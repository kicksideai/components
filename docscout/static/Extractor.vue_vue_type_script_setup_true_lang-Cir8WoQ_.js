import { defineComponent as G, useModel as Le, openBlock as a, createElementBlock as n, withModifiers as ve, createElementVNode as t, mergeModels as Qe, computed as N, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as p, toDisplayString as i, Fragment as A, renderList as z, createCommentVNode as g, createTextVNode as M, createBlock as J, ref as B, toRaw as _e, useId as pe, watch as be, withDirectives as W, vModelText as _, vModelSelect as ze, resolveComponent as nt, renderSlot as Fe, withCtx as me, mergeProps as bt, vShow as We, onMounted as Ue, nextTick as Se, normalizeStyle as qe, onBeforeUnmount as kt, vModelDynamic as nl } from "vue";
import { b as sl } from "./wc-runtime-DUvG5Zds.js";
import { loadByTagName as Je, on as ft } from "@wippy-fe/proxy";
import { i as Ge, f as xt, t as et, s as xe, a as st, b as ol, m as $t, d as H, M as Ae, e as wt, g as Vt, h as tt, j as il, k as dl, l as ul, o as rl, p as cl, q as Ct, r as vl, u as ml, v as pl, w as bl, x as gt, y as fl, z as Xe, A as gl, B as Te, C as hl, D as lt, n as ht, E as yl, F as kl, c as he } from "./config-Y09Qqq2I.js";
import ue from "primevue/button";
import { Icon as L } from "@iconify/vue";
import xl from "primevue/focustrap";
import St from "primevue/menu";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const $l = ["aria-checked", "aria-label", "disabled"], Z = /* @__PURE__ */ G({
  __name: "Toggle",
  props: /* @__PURE__ */ Qe({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const o = Le(e, "modelValue");
    return (l, c) => (a(), n("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": o.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: c[0] || (c[0] = ve((d) => o.value = !o.value, ["stop"]))
    }, [...c[1] || (c[1] = [
      t("span", null, null, -1)
    ])], 8, $l));
  }
}), wl = ["aria-label"], Vl = { class: "node-icon" }, Cl = { class: "node-main" }, Sl = { class: "node-title" }, El = { class: "node-summary" }, ql = {
  key: 0,
  class: "chips"
}, Ul = {
  key: 1,
  class: "trace-line"
}, Nl = { class: "node-side" }, Ml = {
  key: 0,
  class: "chip model"
}, we = /* @__PURE__ */ G({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = e, c = o, d = N(() => Ge(l.config, l.stage)), f = N(() => l.config.stages[l.stage].model), y = N({ get: () => d.value, set: (S) => {
      l.config.stages[l.stage].enabled = S;
    } }), u = N(() => {
      const S = l.config, C = S.stages;
      switch (l.stage) {
        case "map":
          return S.fields.filter((b) => b.search_within === "sections").map((b) => ({ text: b.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...C.prefetch.queries.map((b) => ({ text: b.name || "Untitled query", tone: "" })), ...S.fields.filter((b) => b.search_hints.trim()).map((b) => ({ text: b.name, tone: "hint" }))];
        case "scout":
          return C.scout.mode === "agent" ? C.scout.tools.map((b) => ({ text: et(b).toLowerCase(), tone: "" })) : [];
        case "deep":
          return S.fields.filter((b) => b.strategy === "deep").map((b) => ({ text: b.name || "New field", tone: "primary" }));
        case "extract":
          return xt(S).map((b) => ({ text: `${b.name} · ${b.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), $ = (S) => [`${(S.duration_ms / 1e3).toFixed(1)}s`, `${(S.input_tokens + S.output_tokens).toLocaleString()} tokens`, S.queries?.length ? `${S.queries.length} queries` : "", S.message ?? ""].filter(Boolean).join(" · ");
    return (S, C) => (a(), n("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !d.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m(xe)[e.stage],
      onClick: C[1] || (C[1] = (b) => c("select")),
      onKeydown: [
        C[2] || (C[2] = Ee((b) => c("select"), ["enter"])),
        C[3] || (C[3] = Ee(ve((b) => c("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Vl, [
        p(m(L), {
          icon: m(st)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Cl, [
        t("span", Sl, i(m(xe)[e.stage]), 1),
        t("span", El, i(d.value ? m(ol)(e.stage, e.config) : "Off"), 1),
        d.value && u.value.length ? (a(), n("span", ql, [
          (a(!0), n(A, null, z(u.value, (b) => (a(), n("span", {
            key: b.text,
            class: Q(["chip", { primary: b.tone === "primary", "muted-chip": b.tone === "hint" }])
          }, i(b.text), 3))), 128))
        ])) : g("", !0),
        e.trace ? (a(), n("span", Ul, [
          p(m(L), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          M(i($(e.trace)), 1)
        ])) : g("", !0)
      ]),
      t("span", Nl, [
        d.value && f.value ? (a(), n("span", Ml, i(m($t)(f.value)), 1)) : g("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": C[0] || (C[0] = (b) => y.value = b),
          label: `Enable ${m(xe)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : g("", !0)
      ])
    ], 42, wl));
  }
}), Al = ["aria-labelledby"], Rl = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ye = /* @__PURE__ */ G({
  __name: "Segmented",
  props: /* @__PURE__ */ Qe({
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
    const o = e, l = Le(e, "modelValue"), c = B([]);
    function d(f, y) {
      const u = o.options.length - 1, $ = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: u }[f.key];
      if ($ === void 0) return;
      f.preventDefault();
      const S = ($ + o.options.length) % o.options.length;
      l.value = o.options[S].value, c.value[S]?.focus();
    }
    return (f, y) => (a(), n("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), n(A, null, z(e.options, (u, $) => (a(), n("button", {
        key: u.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: c,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${u.label}` : void 0,
        "aria-checked": l.value === u.value,
        tabindex: l.value === u.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (S) => l.value = u.value,
        onKeydown: (S) => d(S, $)
      }, [
        u.icon ? (a(), J(m(L), {
          key: 0,
          icon: u.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : g("", !0),
        t("span", null, i(u.label), 1)
      ], 40, Rl))), 128))
    ], 8, Al));
  }
}), ie = (e, o) => `${e}:${o.join("/")}`, Et = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Bl = (e) => Et.find((o) => o.value === e).icon;
function Ke(e) {
  const o = [];
  function l(c, d, f, y) {
    o.push({ field: d, trail: f, shape: c, path: y, depth: f.length + 1, key: ie(d, f) }), c.properties?.forEach((u, $) => l(u, d, [...f, $], `${y}.${u.name || "New property"}`)), c.item && l(c.item, d, [...f, "item"], `${y}[]`);
  }
  return e.forEach((c, d) => l(c, d, [], H(c) || "New field")), o;
}
function at(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(at), e.item ? at(e.item) : 0);
}
function Ll(e, o) {
  return Ke(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === o.field && ie(l.field, l.trail) === ie(o.field, o.trail.slice(0, -1))) && l.depth + at(o.shape) <= Ae && !(l.field === o.field && o.trail.every((c, d) => l.trail[d] === c)));
}
function Tl(e, o, l) {
  const c = { ...Vt(), ...structuredClone(_e(o.shape)), name: o.shape.name };
  o.trail.length ? Ke(e).find((y) => y.key === ie(o.field, o.trail.slice(0, -1))).shape.properties.splice(o.trail.at(-1), 1) : e.splice(o.field, 1);
  let d;
  if (l) {
    const { name: f, type: y, description: u, enum_values: $, expected_format: S, required: C, properties: b, item: V, nullable: w, max_length: s } = c;
    d = { name: f, type: y, description: u, enum_values: $, expected_format: S, required: C, ...b ? { properties: b } : {}, ...V ? { item: V } : {}, ...w !== void 0 ? { nullable: w } : {}, ...s !== void 0 ? { max_length: s } : {} }, l.shape.properties.push(d), d = l.shape.properties.at(-1);
  } else {
    const { nullable: f, max_length: y, ...u } = c;
    d = { ...tt(), ...u, group: "" }, e.push(d), d = e.at(-1);
  }
  return Ke(e).find((f) => f.shape === d);
}
function yt(e, o = !1) {
  function l(d) {
    return d.type === "object" ? Object.fromEntries((d.properties ?? []).map((f) => [f.name || "unnamed", l(f)])) : d.type === "list" ? d.item ? [l(d.item)] : [] : o ? d.enum_values?.length ? d.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[d.type] : d.type === "enum" ? d.enum_values?.join(" | ") || "enum" : d.type;
  }
  const c = {};
  return e.forEach((d) => wt(c, H(d) || "unnamed", l(d))), c;
}
const Pl = { class: "shape-editor" }, Dl = { key: 0 }, Ol = ["aria-label", "aria-invalid", "aria-describedby"], Fl = { class: "label-block" }, Il = ["id"], jl = { key: 0 }, zl = ["id"], Wl = {
  key: 2,
  class: "label-block"
}, Gl = { class: "chips" }, Kl = ["aria-label", "onClick"], Hl = {
  key: 0,
  class: "row"
}, Ql = ["onKeydown"], Jl = {
  key: 1,
  class: "field-error",
  role: "alert"
}, Yl = { key: 3 }, Xl = ["placeholder"], Zl = {
  key: 4,
  class: "toggle-row"
}, _l = { class: "toggle-row" }, ea = { key: 0 }, ta = { class: "muted" }, la = ["aria-label", "disabled"], aa = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = N(() => l.shape), f = N(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), y = N(() => Et.filter((O) => l.depth < Ae || !["object", "list"].includes(O.value))), u = N({ get: () => l.shape.type, set: (O) => {
      l.shape.type = O, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], ["text", "date", "enum"].includes(O) || delete d.value.max_length, O === "object" && (l.shape.properties = []), O === "list" && (l.shape.item = il());
    } }), $ = N(() => l.named && l.depth > 1), S = N({ get: () => d.value.nullable === !0, set: (O) => {
      O ? d.value.nullable = !0 : delete d.value.nullable;
    } }), C = N({ get: () => d.value.max_length ?? "", set: (O) => {
      O === "" ? delete d.value.max_length : d.value.max_length = Number(O);
    } }), b = pe(), V = pe(), w = B(""), s = B("");
    be(() => l.shape, () => {
      w.value = "", s.value = "";
    });
    const v = N(() => l.validationError || (l.named ? dl(d.value.name, l.siblingNames) : "") || ul(l.shape, l.depth));
    function R() {
      const O = w.value.trim(), U = l.shape.enum_values ?? [];
      if (!O || O.length > 200) {
        s.value = "Enter 1 to 200 characters.";
        return;
      }
      if (U.includes(O)) {
        s.value = "This value already exists.";
        return;
      }
      if (U.length >= 100) {
        s.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...U, O], w.value = "", s.value = "";
    }
    return (O, U) => (a(), n("div", Pl, [
      e.named ? (a(), n("label", Dl, [
        U[10] || (U[10] = M("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": U[0] || (U[0] = (T) => d.value.name = T),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!v.value,
          "aria-describedby": v.value ? m(V) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, Ol), [
          [
            _,
            d.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : g("", !0),
      t("div", Fl, [
        t("span", { id: m(b) }, i(e.named ? "Data type" : "Item type"), 9, Il),
        p(ye, {
          modelValue: u.value,
          "onUpdate:modelValue": U[1] || (U[1] = (T) => u.value = T),
          class: "type-picker",
          options: y.value,
          "labelled-by": m(b),
          name: f.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (a(), n("small", jl, "Level four · choose a value type.")) : g("", !0)
      ]),
      v.value ? (a(), n("p", {
        key: 1,
        id: m(V),
        class: "field-error",
        role: "alert"
      }, i(v.value), 9, zl)) : g("", !0),
      m(rl)(e.shape, e.named) ? (a(), n("div", Wl, [
        t("span", null, i(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", Gl, [
          (a(!0), n(A, null, z(e.shape.enum_values, (T, K) => (a(), n("span", {
            key: T,
            class: "chip primary"
          }, [
            M(i(T), 1),
            e.readonly ? g("", !0) : (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${T}`,
              onClick: (I) => e.shape.enum_values.splice(K, 1)
            }, [
              p(m(L), { icon: "tabler:x" })
            ], 8, Kl))
          ]))), 128))
        ]),
        e.readonly ? g("", !0) : (a(), n("div", Hl, [
          W(t("input", {
            "onUpdate:modelValue": U[2] || (U[2] = (T) => w.value = T),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(R, ["prevent"]), ["enter"])
          }, null, 40, Ql), [
            [_, w.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: R
          }, "Add")
        ])),
        s.value ? (a(), n("p", Jl, i(s.value), 1)) : g("", !0)
      ])) : g("", !0),
      t("label", null, [
        U[11] || (U[11] = M("Description", -1)),
        W(t("textarea", {
          "onUpdate:modelValue": U[3] || (U[3] = (T) => e.shape.description = T),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? g("", !0) : (a(), n("label", Yl, [
        U[12] || (U[12] = M("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": U[4] || (U[4] = (T) => e.shape.expected_format = T),
          maxlength: "400",
          placeholder: m(cl)(e.shape)
        }, null, 8, Xl), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), n("div", Zl, [
        U[13] || (U[13] = t("span", null, "Required", -1)),
        p(Z, {
          modelValue: d.value.required,
          "onUpdate:modelValue": U[5] || (U[5] = (T) => d.value.required = T),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      $.value ? (a(), n(A, { key: 5 }, [
        t("div", _l, [
          U[14] || (U[14] = t("span", null, [
            M("May be absent"),
            t("small", null, "A missing member has no value.")
          ], -1)),
          p(Z, {
            modelValue: S.value,
            "onUpdate:modelValue": U[6] || (U[6] = (T) => S.value = T),
            label: "May be absent",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        ["text", "date", "enum"].includes(e.shape.type) ? (a(), n("label", ea, [
          U[15] || (U[15] = M("Maximum characters", -1)),
          W(t("input", {
            "onUpdate:modelValue": U[7] || (U[7] = (T) => C.value = T),
            type: "number",
            min: "1",
            step: "1",
            "aria-label": "Maximum characters"
          }, null, 512), [
            [_, C.value]
          ]),
          U[16] || (U[16] = t("small", null, "Optional. Longer values fail extraction.", -1))
        ])) : g("", !0)
      ], 64)) : g("", !0),
      e.shape.type === "object" ? (a(), n(A, { key: 6 }, [
        t("p", ta, i(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (a(), n("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: U[8] || (U[8] = (T) => c("add"))
        }, [
          p(m(L), { icon: "tabler:plus" }),
          U[17] || (U[17] = M("Add property", -1))
        ], 8, la)) : g("", !0)
      ], 64)) : g("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), n("button", {
        key: 7,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: U[9] || (U[9] = (T) => c("selectItem"))
      }, [
        p(m(L), { icon: "tabler:brackets" }),
        M("Edit item shape · " + i(e.shape.item.type), 1)
      ])) : g("", !0)
    ]));
  }
}), na = ["disabled"], sa = { class: "grid" }, oa = { class: "context-stepper" }, ia = ["disabled"], da = ["disabled"], ua = {
  key: 0,
  class: "field-note"
}, ra = { class: "label-block" }, ca = {
  key: 1,
  class: "field-error"
}, va = { id: "docscout-groups" }, ma = ["value"], pa = { class: "toggle-row" }, ba = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = N(() => !l.depth || l.depth === 1), f = N(() => Ct(l.field, l.otherNames));
    return (y, u) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      p(aa, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: d.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": d.value ? f.value : void 0,
        readonly: e.readonly,
        onAdd: u[0] || (u[0] = ($) => c("add")),
        onSelectItem: u[1] || (u[1] = ($) => c("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      d.value ? (a(), n(A, { key: 0 }, [
        u[25] || (u[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          u[12] || (u[12] = M("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": u[2] || (u[2] = ($) => e.field.search_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          u[13] || (u[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", sa, [
          t("label", null, [
            u[15] || (u[15] = M("Strategy", -1)),
            W(t("select", {
              "onUpdate:modelValue": u[3] || (u[3] = ($) => e.field.strategy = $)
            }, [...u[14] || (u[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [ze, e.field.strategy]
            ])
          ]),
          t("label", null, [
            u[16] || (u[16] = M("Chunks to read", -1)),
            t("span", oa, [
              W(t("input", {
                "onUpdate:modelValue": u[4] || (u[4] = ($) => e.field.chunks = $),
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
                onClick: u[5] || (u[5] = ($) => e.field.chunks--)
              }, "−", 8, ia),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: u[6] || (u[6] = ($) => e.field.chunks++)
              }, "+", 8, da)
            ]),
            u[17] || (u[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), n("p", ua, [
          p(m(L), { icon: "tabler:info-circle" }),
          u[18] || (u[18] = M("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : g("", !0),
        t("div", ra, [
          u[19] || (u[19] = t("span", { id: "within-label" }, "Search within", -1)),
          p(ye, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": u[7] || (u[7] = ($) => e.field.search_within = $),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, i(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), n("p", ca, [
          p(m(L), { icon: "tabler:alert-circle" }),
          u[20] || (u[20] = M("Turn on Map the document to read sections.", -1))
        ])) : g("", !0),
        t("label", null, [
          u[21] || (u[21] = M("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": u[8] || (u[8] = ($) => e.field.group = $),
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
          t("datalist", va, [
            (a(!0), n(A, null, z(e.groups, ($) => (a(), n("option", {
              key: $,
              value: $
            }, null, 8, ma))), 128))
          ]),
          u[22] || (u[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        u[26] || (u[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          u[23] || (u[23] = M("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": u[9] || (u[9] = ($) => e.field.validation_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", pa, [
          u[24] || (u[24] = t("span", null, [
            M("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          p(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": u[10] || (u[10] = ($) => e.field.evidence_required = $),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : g("", !0),
      !e.readonly && (d.value || e.siblingNames) ? (a(), n("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: u[11] || (u[11] = ($) => c("remove"))
      }, i(d.value ? "Remove field" : "Remove property"), 1)) : g("", !0)
    ], 8, na));
  }
}), fa = { class: "field-groups" }, ga = {
  key: 0,
  class: "rows"
}, ha = ["aria-label"], ya = { class: "field-group-head" }, ka = ["aria-label", "aria-expanded", "aria-controls", "onClick"], xa = { class: "group-title" }, $a = ["id"], wa = { class: "group-title" }, Re = /* @__PURE__ */ G({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const o = B(/* @__PURE__ */ new Set()), l = pe();
    function c(f) {
      o.value.has(f) ? o.value.delete(f) : o.value.add(f);
    }
    const d = (f) => f.indices.length + f.children.reduce((y, u) => y + d(u), 0);
    return (f, y) => {
      const u = nt("FieldGroups", !0);
      return a(), n("div", fa, [
        e.node.indices.length ? (a(), n("ul", ga, [
          (a(!0), n(A, null, z(e.node.indices, ($) => (a(), n("li", { key: $ }, [
            Fe(f.$slots, "default", { index: $ })
          ]))), 128))
        ])) : g("", !0),
        (a(!0), n(A, null, z(e.node.children, ($, S) => (a(), n("section", {
          key: $.path,
          class: "field-group",
          "aria-label": `Group ${$.path}`
        }, [
          t("header", ya, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${o.value.has($.path) ? "Expand" : "Collapse"} group ${$.path}`,
              "aria-expanded": !o.value.has($.path),
              "aria-controls": `${m(l)}-${$.path}`,
              onClick: (C) => c($.path)
            }, [
              p(m(L), {
                icon: o.value.has($.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, ka),
            Fe(f.$slots, "header", {
              path: $.path,
              label: $.name,
              count: d($),
              first: S === 0,
              last: S === e.node.children.length - 1
            }, () => [
              t("span", xa, i($.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${m(l)}-${$.path}`,
            class: "group-content"
          }, [
            p(u, { node: $ }, {
              default: me((C) => [
                Fe(f.$slots, "default", bt({ ref_for: !0 }, C))
              ]),
              header: me((C) => [
                Fe(f.$slots, "header", bt({ ref_for: !0 }, C), () => [
                  t("span", wa, i(C.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, $a), [
            [We, !o.value.has($.path)]
          ])
        ], 8, ha))), 128))
      ]);
    };
  }
}), Va = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], Ca = ["aria-label", "title"], Sa = ["aria-label", "title"], Ea = ["id"], qt = /* @__PURE__ */ G({
  __name: "GroupPathEditor",
  props: {
    initialValue: { default: "" },
    inputLabel: {},
    saveLabel: {},
    cancelLabel: {},
    maxLength: { default: 320 }
  },
  emits: ["save", "cancel"],
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(l.initialValue), f = B(""), y = B(), u = pe();
    Ue(() => {
      y.value.focus(), y.value.select();
    });
    function $() {
      const S = d.value.trim();
      if (!S || !vl.test(S)) {
        f.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (S.length > l.maxLength) {
        f.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      c("save", S);
    }
    return (S, C) => (a(), n("form", {
      class: "group-path-editor",
      onSubmit: ve($, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: y,
        "onUpdate:modelValue": C[0] || (C[0] = (b) => d.value = b),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!f.value,
        "aria-describedby": f.value ? m(u) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve($, ["prevent"]), ["enter"]),
          C[1] || (C[1] = Ee(ve((b) => c("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, Va), [
        [_, d.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        p(m(L), { icon: "tabler:check" })
      ], 8, Ca),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: C[2] || (C[2] = (b) => c("cancel"))
      }, [
        p(m(L), { icon: "tabler:x" })
      ], 8, Sa),
      f.value ? (a(), n("p", {
        key: 0,
        id: m(u),
        class: "field-error",
        role: "alert"
      }, i(f.value), 9, Ea)) : g("", !0)
    ], 32));
  }
}), qa = ["title"], Ua = ["aria-label", "data-group-rename", "title"], Na = ["aria-label"], Ma = {
  key: 2,
  class: "group-actions"
}, Aa = ["aria-label", "disabled"], Ra = ["aria-label", "aria-expanded", "aria-controls"], Ba = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(!1), f = B(!1), y = B(), u = B(), $ = B(), S = pe(), C = N(() => [
      { label: "Move up", disabled: l.first, command: () => c("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => c("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => c("remove") }
    ]);
    function b() {
      d.value = !0;
    }
    async function V() {
      d.value = !1, await Se(), u.value.focus();
    }
    async function w(s) {
      const v = y.value.closest(".field-tree");
      d.value = !1, c("rename", s), await Se(), v.querySelector(`[data-group-rename="${s}"]`).focus();
    }
    return (s, v) => (a(), n("div", {
      ref_key: "heading",
      ref: y,
      class: "group-heading"
    }, [
      d.value ? (a(), J(qt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: w,
        onCancel: V
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), n(A, { key: 1 }, [
        e.readonly ? (a(), n("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, i(e.name), 9, qa)) : (a(), n("button", {
          key: 1,
          ref_key: "renameButton",
          ref: u,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: b
        }, [
          t("span", null, i(e.name), 1),
          p(m(L), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ua)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, i(e.count), 9, Na),
        e.readonly ? g("", !0) : (a(), n("div", Ma, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: v[0] || (v[0] = (R) => c("add"))
          }, [
            p(m(L), { icon: "tabler:plus" })
          ], 8, Aa),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": f.value,
            "aria-controls": m(S),
            onClick: v[1] || (v[1] = (R) => $.value.toggle(R))
          }, [
            p(m(L), { icon: "tabler:dots" })
          ], 8, Ra),
          p(m(St), {
            id: m(S),
            ref_key: "menu",
            ref: $,
            model: C.value,
            popup: "",
            "append-to": "self",
            onShow: v[2] || (v[2] = (R) => f.value = !0),
            onHide: v[3] || (v[3] = (R) => f.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), La = ["aria-label", "aria-expanded"], Ta = {
  key: 1,
  class: "tree-indent"
}, Pa = ["aria-label", "aria-describedby", "aria-current"], Da = { class: "row-copy" }, Oa = { class: "row-name" }, Fa = ["title"], Ia = ["id", "title"], ja = { class: "field-badges" }, za = { class: "chip field-type" }, Wa = { class: "field-flags" }, Ga = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, Ka = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, Ha = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, Qa = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, Ja = {
  key: 2,
  class: "row-actions"
}, Ya = ["aria-label", "disabled"], Xa = ["aria-label", "disabled"], Za = ["aria-label", "aria-expanded", "aria-controls"], _a = {
  key: 0,
  class: "tree-children"
}, en = { key: 0 }, tn = { key: 1 }, ln = ["aria-label", "disabled"], an = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = pe(), f = pe(), y = B(), u = B(!1), $ = N(() => [
      { label: "Move up", disabled: l.first, command: () => c("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => c("reorder", l.field, l.trail, 1) }
    ]), S = B(!0);
    be(() => l.selected, (v) => {
      const R = ie(l.field, l.trail);
      v !== R && v.startsWith(R + (l.trail.length ? "/" : "")) && (S.value = !0);
    });
    const C = N(() => l.trail.at(-1) !== "item"), b = N(() => C.value ? l.shape.name || "New field" : "Each item"), V = N(() => l.trail.length ? void 0 : l.shape), w = N(() => l.shape.type === "object" || l.shape.type === "list");
    function s(v) {
      v.key === "ArrowRight" && w.value && (S.value = !0, v.preventDefault(), v.stopPropagation()), v.key === "ArrowLeft" && w.value && (S.value = !1, v.preventDefault(), v.stopPropagation());
    }
    return (v, R) => {
      const O = nt("ShapeTree", !0);
      return a(), n("div", {
        class: "shape-tree-node",
        onKeydown: s
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === m(ie)(e.field, e.trail) }])
        }, [
          w.value ? (a(), n("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${S.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": S.value,
            onClick: R[0] || (R[0] = (U) => S.value = !S.value)
          }, [
            p(m(L), {
              icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, La)) : (a(), n("span", Ta)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(d),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: R[1] || (R[1] = (U) => c("select", e.field, e.trail))
          }, [
            t("span", Da, [
              t("span", Oa, [
                p(m(L), {
                  icon: m(Bl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: b.value
                }, i(b.value), 9, Fa),
                e.error ? (a(), J(m(L), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : g("", !0)
              ]),
              t("span", {
                id: m(d),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, i(e.shape.description || "No description"), 11, Ia)
            ]),
            t("span", ja, [
              t("span", za, i(e.shape.type), 1),
              t("span", Wa, [
                C.value && e.shape.required ? (a(), n("span", Ga, [
                  p(m(L), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                V.value?.strategy === "deep" ? (a(), n("span", Ka, [
                  p(m(L), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                V.value?.search_within === "sections" ? (a(), n("span", Ha, [
                  p(m(L), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0),
                V.value?.evidence_required ? (a(), n("span", Qa, [
                  p(m(L), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : g("", !0)
              ])
            ])
          ], 8, Pa),
          !e.readonly && C.value ? (a(), n("span", Ja, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: R[2] || (R[2] = (U) => c("reorder", e.field, e.trail, -1))
            }, [
              p(m(L), { icon: "tabler:chevron-up" })
            ], 8, Ya),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: R[3] || (R[3] = (U) => c("reorder", e.field, e.trail, 1))
            }, [
              p(m(L), { icon: "tabler:chevron-down" })
            ], 8, Xa)
          ])) : g("", !0),
          !e.readonly && C.value ? (a(), n("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: R[7] || (R[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": u.value,
              "aria-controls": m(f),
              onClick: R[4] || (R[4] = (U) => y.value.toggle(U))
            }, [
              p(m(L), { icon: "tabler:dots" })
            ], 8, Za),
            p(m(St), {
              id: m(f),
              ref_key: "menu",
              ref: y,
              model: $.value,
              popup: "",
              "append-to": "self",
              onShow: R[5] || (R[5] = (U) => u.value = !0),
              onHide: R[6] || (R[6] = (U) => u.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : g("", !0)
        ], 2),
        w.value && S.value ? (a(), n("ul", _a, [
          (a(!0), n(A, null, z(e.shape.properties, (U, T) => (a(), n("li", { key: T }, [
            p(O, {
              shape: U,
              field: e.field,
              trail: [...e.trail, T],
              path: `${e.path}.${U.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: T === 0,
              last: T === e.shape.properties.length - 1,
              onSelect: R[8] || (R[8] = (K, I) => c("select", K, I)),
              onAdd: R[9] || (R[9] = (K, I) => c("add", K, I)),
              onReorder: R[10] || (R[10] = (K, I, F) => c("reorder", K, I, F))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), n("li", en, [
            p(O, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: R[11] || (R[11] = (U, T) => c("select", U, T)),
              onAdd: R[12] || (R[12] = (U, T) => c("add", U, T)),
              onReorder: R[13] || (R[13] = (U, T, K) => c("reorder", U, T, K))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : g("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (a(), n("li", tn, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: R[14] || (R[14] = (U) => c("add", e.field, e.trail))
            }, [
              p(m(L), { icon: "tabler:plus" }),
              R[15] || (R[15] = M("Add property", -1))
            ], 8, ln)
          ])) : g("", !0)
        ])) : g("", !0)
      ], 32);
    };
  }
}), nn = { class: "label-block" }, sn = {
  key: 0,
  class: "muted"
}, on = ["config"], dn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, un = {
  key: 3,
  role: "status",
  class: "muted picker-pending picker-pending--list"
}, rn = /* @__PURE__ */ G({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, c = B(!!customElements.get("wc-agent-picker")), d = B("");
    Ue(async () => {
      if (!c.value)
        try {
          await Je("wc-agent-picker", { timeoutMs: 8e3 }), c.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function f(y) {
      if (y.composedPath()[0] !== y.currentTarget) return;
      const u = y.detail;
      l("select", u.agent_id);
    }
    return (y, u) => (a(), n("div", nn, [
      u[0] || (u[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), n("p", sn, i(e.value || "Built-in scout"), 1)) : c.value ? (a(), n("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: f
      }, null, 40, on)) : d.value ? (a(), n("p", dn, "Could not load agent picker: " + i(d.value), 1)) : (a(), n("span", un, "Loading agents…")),
      u[1] || (u[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), cn = ["value", "capability", "aria-labelledby"], vn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, mn = {
  key: 2,
  class: "dz-muted picker-pending",
  role: "status"
}, ce = /* @__PURE__ */ G({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, c = B(!!customElements.get("wc-model-picker")), d = B("");
    Ue(async () => {
      if (!c.value)
        try {
          await Je("wc-model-picker", { timeoutMs: 8e3 }), c.value = !0;
        } catch (y) {
          d.value = y instanceof Error ? y.message : String(y);
        }
    });
    function f(y) {
      const u = y.detail;
      typeof u == "string" && l("select", u);
    }
    return (y, u) => c.value ? (a(), n("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: f
    }, null, 40, cn)) : d.value ? (a(), n("p", vn, "Could not load model picker: " + i(d.value), 1)) : (a(), n("span", mn, "Loading models…"));
  }
}), pn = { class: "slider" }, bn = { class: "slider-head" }, fn = { class: "slider-value" }, gn = ["aria-label", "aria-valuetext", "disabled"], hn = {
  key: 0,
  class: "slider-hints"
}, yn = { key: 1 }, Ve = 1e3, te = /* @__PURE__ */ G({
  __name: "Slider",
  props: /* @__PURE__ */ Qe({
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
    const o = e, l = Le(e, "modelValue"), c = N(() => o.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${o.unit ? ` ${o.unit}` : ""}`), d = (u) => o.log ? Math.log(u / o.min) / Math.log(o.max / o.min) * Ve : (u - o.min) / (o.max - o.min) * Ve;
    function f(u) {
      const $ = o.log ? o.min * Math.pow(o.max / o.min, u / Ve) : o.min + (o.max - o.min) * u / Ve, S = Math.round($ / o.step) * o.step;
      return Math.min(o.max, Math.max(o.min, Number(S.toFixed(4))));
    }
    const y = N({ get: () => Math.round(d(l.value)), set: (u) => {
      l.value = f(u);
    } });
    return (u, $) => (a(), n("div", pn, [
      t("div", bn, [
        t("span", null, i(e.label), 1),
        t("output", fn, i(c.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": $[0] || ($[0] = (S) => y.value = S),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": c.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${y.value / Ve * 100}%` })
      }, null, 12, gn), [
        [
          _,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), n("div", hn, [
        t("span", null, i(e.hints[0]), 1),
        t("span", null, i(e.hints[1]), 1)
      ])) : g("", !0),
      e.note ? (a(), n("small", yn, i(e.note), 1)) : g("", !0)
    ]));
  }
}), kn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, xn = { class: "fd-track" }, $n = { class: "fd-node" }, wn = { class: "fd-dots" }, Vn = { class: "fd-more" }, Cn = { class: "fd-node goal" }, Sn = /* @__PURE__ */ G({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const o = e;
    return (l, c) => (a(), n("figure", kn, [
      t("div", xn, [
        c[2] || (c[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), n(A, null, z(Math.min(o.rounds, 8), (d) => (a(), n(A, { key: d }, [
          c[0] || (c[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", $n, [
            t("span", null, "R" + i(d), 1),
            t("span", wn, [
              (a(!0), n(A, null, z(Math.min(o.extra, 6), (f) => (a(), n("i", { key: f }))), 128))
            ])
          ])
        ], 64))), 128)),
        o.rounds > 8 ? (a(), n(A, { key: 0 }, [
          c[1] || (c[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", Vn, "+" + i(o.rounds - 8), 1)
        ], 64)) : g("", !0),
        c[3] || (c[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", Cn, "≥ " + i(Math.round(o.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, i(o.rounds ? `One pass, then up to ${o.rounds} rounds with up to ${o.extra} new queries each, stopping as soon as confidence reaches ${Math.round(o.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), En = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, qn = { class: "fd-grid" }, Un = { class: "fd-node solid" }, Nn = { class: "fd-node" }, Mn = { class: "fd-node" }, An = { class: "fd-node goal" }, Rn = /* @__PURE__ */ G({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const o = e, l = N(() => Math.min(o.queries * o.perQuery, o.cap));
    return (c, d) => (a(), n("figure", En, [
      t("div", qn, [
        t("span", Un, [
          t("b", null, i(e.fields), 1),
          M(" field" + i(e.fields === 1 ? "" : "s"), 1),
          t("small", null, i(e.parallel) + " at a time", 1)
        ]),
        t("span", Nn, [
          t("b", null, i(e.queries), 1),
          d[0] || (d[0] = M(" queries", -1)),
          d[1] || (d[1] = t("small", null, "per field", -1))
        ]),
        t("span", Mn, [
          t("b", null, i(e.perQuery), 1),
          d[2] || (d[2] = M(" chunks", -1)),
          d[3] || (d[3] = t("small", null, "per query", -1))
        ]),
        t("span", An, [
          t("b", null, i(l.value), 1),
          d[4] || (d[4] = M(" chunks", -1)),
          t("small", null, i(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + i(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Bn = ["disabled"], Ln = { class: "muted" }, Tn = { class: "toggle-row" }, Pn = { class: "label-block" }, Dn = { class: "toggle-row" }, On = {
  id: "model-map",
  class: "model-role"
}, Fn = {
  key: 0,
  class: "chips"
}, In = {
  key: 1,
  class: "muted"
}, jn = { class: "toggle-row" }, zn = { class: "grid" }, Wn = ["onUpdate:modelValue"], Gn = ["onUpdate:modelValue"], Kn = ["onUpdate:modelValue"], Hn = ["onClick"], Qn = {
  key: 0,
  class: "muted"
}, Jn = { class: "toggle-row" }, Yn = { class: "label-block" }, Xn = {
  id: "model-scout",
  class: "model-role"
}, Zn = {
  key: 3,
  class: "muted"
}, _n = {
  key: 4,
  class: "toggle-row"
}, es = { class: "toggle-row" }, ts = { class: "toggle-row" }, ls = { class: "label-block" }, as = {
  id: "model-deep",
  class: "model-role"
}, ns = {
  id: "model-deep-query",
  class: "model-role"
}, ss = { class: "label-block" }, os = {
  id: "model-extract",
  class: "model-role"
}, is = { class: "output-list" }, ds = { class: "chip" }, us = {
  key: 1,
  class: "muted"
}, rs = { class: "toggle-row" }, cs = { class: "toggle-row" }, vs = { class: "toggle-row" }, ms = { class: "toggle-row" }, ps = {
  id: "model-verify",
  class: "model-role"
}, bs = /* @__PURE__ */ G({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = N(() => o.config.stages), c = (w) => fl(o.stage, w), d = ml(), f = N(() => o.config.fields.filter((w) => w.strategy === "deep").length), y = N(() => o.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), u = N(() => xt(o.config)), $ = N({ get: () => l.value.extract.reads ?? "text", set: (w) => {
      l.value.extract.reads = w, w === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = 8);
    } }), S = N({ get: () => l.value.extract.max_pages ?? 8, set: (w) => {
      l.value.extract.max_pages = w;
    } });
    function C(w) {
      l.value.verify.check_support = w, w || (l.value.verify.check_completeness = !1);
    }
    function b(w) {
      w ? l.value.scout.agent_id = w : delete l.value.scout.agent_id;
    }
    function V(w, s) {
      const v = l.value.scout.tools.filter((R) => R !== w);
      l.value.scout.tools = s ? [...v, w] : v;
    }
    return (w, s) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Ln, i(m(pl)[e.stage]), 1),
      e.stage === "map" ? (a(), n(A, { key: 0 }, [
        t("div", Tn, [
          s[35] || (s[35] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": s[0] || (s[0] = (v) => l.value.map.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Pn, [
          s[36] || (s[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          p(ye, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": s[1] || (s[1] = (v) => l.value.map.outline = v),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          s[37] || (s[37] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Dn, [
          s[38] || (s[38] = t("span", null, [
            M("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          p(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": s[2] || (s[2] = (v) => l.value.map.section_summaries = v),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[40] || (s[40] = t("h4", null, "Models", -1)),
        t("div", On, [
          s[39] || (s[39] = t("span", null, "Outliner", -1)),
          p(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: s[3] || (s[3] = (v) => l.value.map.model = v)
          }, null, 8, ["value"])
        ]),
        s[41] || (s[41] = t("h4", null, "Fields that read sections", -1)),
        y.value.length ? (a(), n("p", Fn, [
          (a(!0), n(A, null, z(y.value, (v) => (a(), n("span", {
            key: v,
            class: "chip primary"
          }, i(v), 1))), 128))
        ])) : (a(), n("p", In, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : g("", !0),
      e.stage === "prefetch" ? (a(), n(A, { key: 1 }, [
        t("div", jn, [
          s[42] || (s[42] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": s[4] || (s[4] = (v) => l.value.prefetch.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[46] || (s[46] = t("h4", null, "Queries", -1)),
        (a(!0), n(A, null, z(l.value.prefetch.queries, (v, R) => (a(), n("div", {
          key: R,
          class: "query-row"
        }, [
          t("div", zn, [
            t("label", null, [
              s[43] || (s[43] = M("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (O) => v.name = O,
                placeholder: "Parties"
              }, null, 8, Wn), [
                [_, v.name]
              ])
            ]),
            t("label", null, [
              s[44] || (s[44] = M("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (O) => v.chunks = O,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Gn), [
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
            s[45] || (s[45] = M("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (O) => v.query = O,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Kn), [
              [_, v.query]
            ])
          ]),
          e.readonly ? g("", !0) : (a(), n("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (O) => l.value.prefetch.queries.splice(R, 1)
          }, "Remove query", 8, Hn))
        ]))), 128)),
        l.value.prefetch.queries.length ? g("", !0) : (a(), n("p", Qn, "No fixed queries. Field search hints still run.")),
        e.readonly ? g("", !0) : (a(), n("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: s[5] || (s[5] = (v) => l.value.prefetch.queries.push(m(bl)()))
        }, "Add query"))
      ], 64)) : g("", !0),
      e.stage === "scout" ? (a(), n(A, { key: 2 }, [
        t("div", Jn, [
          s[47] || (s[47] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": s[6] || (s[6] = (v) => l.value.scout.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Yn, [
          s[48] || (s[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          p(ye, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": s[7] || (s[7] = (v) => l.value.scout.mode = v),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, i(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(rn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: b
        }, null, 8, ["value", "readonly"])) : g("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Sn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : g("", !0),
        s[53] || (s[53] = t("h4", null, "Models", -1)),
        t("div", Xn, [
          s[49] || (s[49] = t("span", null, "Scout", -1)),
          p(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: s[8] || (s[8] = (v) => l.value.scout.model = v)
          }, null, 8, ["value"])
        ]),
        s[54] || (s[54] = t("h4", null, "Loop", -1)),
        p(te, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": s[9] || (s[9] = (v) => l.value.scout.max_rounds = v),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: c("max_rounds").min,
          max: c("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(te, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": s[10] || (s[10] = (v) => l.value.scout.target_confidence = v),
          label: "Stop at confidence",
          min: c("target_confidence").min,
          max: c("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : g("", !0),
        p(te, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": s[11] || (s[11] = (v) => l.value.scout.max_extra_queries = v),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: c("max_extra_queries").min,
          max: c("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": s[12] || (s[12] = (v) => l.value.scout.max_tokens = v),
          label: "Scout output limit",
          min: c("max_tokens").min,
          max: c("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), n("p", Zn, "Tool budget: " + i(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : g("", !0),
        l.value.scout.mode === "loop" ? (a(), n("div", _n, [
          s[50] || (s[50] = t("span", null, [
            M("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          p(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": s[13] || (s[13] = (v) => l.value.scout.drop_noise = v),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : g("", !0),
        t("div", es, [
          s[51] || (s[51] = t("span", null, [
            M("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          p(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": s[14] || (s[14] = (v) => l.value.scout.share_notes = v),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), n(A, { key: 5 }, [
          s[52] || (s[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), n(A, null, z(m(d), (v) => (a(), n("div", {
            key: v,
            class: "toggle-row"
          }, [
            t("span", null, i(m(et)(v)), 1),
            p(Z, {
              "model-value": l.value.scout.tools.includes(v),
              label: m(et)(v),
              disabled: e.readonly,
              "onUpdate:modelValue": (R) => V(v, R)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : g("", !0)
      ], 64)) : g("", !0),
      e.stage === "deep" ? (a(), n(A, { key: 3 }, [
        t("div", ts, [
          s[55] || (s[55] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": s[15] || (s[15] = (v) => l.value.deep.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        p(Rn, {
          fields: f.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", ls, [
          s[56] || (s[56] = t("span", { id: "read-label" }, "Reads", -1)),
          p(ye, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": s[16] || (s[16] = (v) => l.value.deep.read = v),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          s[57] || (s[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        s[60] || (s[60] = t("h4", null, "Models", -1)),
        t("div", as, [
          s[58] || (s[58] = t("span", null, "Analysis", -1)),
          p(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: s[17] || (s[17] = (v) => l.value.deep.model = v)
          }, null, 8, ["value"])
        ]),
        t("div", ns, [
          s[59] || (s[59] = t("span", null, "Query writer", -1)),
          p(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: s[18] || (s[18] = (v) => l.value.deep.query_model = v)
          }, null, 8, ["value"])
        ]),
        s[61] || (s[61] = t("h4", null, "Reach", -1)),
        p(te, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": s[19] || (s[19] = (v) => l.value.deep.parallel_fields = v),
          label: "Fields at a time",
          min: c("parallel_fields").min,
          max: c("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": s[20] || (s[20] = (v) => l.value.deep.max_queries = v),
          label: "Queries per field",
          min: c("max_queries").min,
          max: c("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": s[21] || (s[21] = (v) => l.value.deep.chunks_per_query = v),
          label: "Chunks per query",
          min: c("chunks_per_query").min,
          max: c("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": s[22] || (s[22] = (v) => l.value.deep.chunk_cap = v),
          label: "Chunk cap per field",
          min: c("chunk_cap").min,
          max: c("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": s[23] || (s[23] = (v) => l.value.deep.min_similarity = v),
          label: "Minimum similarity",
          min: c("min_similarity").min,
          max: c("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        s[62] || (s[62] = t("h4", null, "Temperature", -1)),
        p(te, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": s[24] || (s[24] = (v) => l.value.deep.query_temperature = v),
          label: "Query writing",
          min: c("query_temperature").min,
          max: c("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(te, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": s[25] || (s[25] = (v) => l.value.deep.analysis_temperature = v),
          label: "Analysis",
          min: c("analysis_temperature").min,
          max: c("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      e.stage === "extract" ? (a(), n(A, { key: 4 }, [
        t("div", ss, [
          s[63] || (s[63] = t("span", { id: "extract-reads-label" }, "Read values from", -1)),
          p(ye, {
            modelValue: $.value,
            "onUpdate:modelValue": s[26] || (s[26] = (v) => $.value = v),
            "labelled-by": "extract-reads-label",
            name: "Read values from",
            options: [{ value: "text", label: "Text" }, { value: "pages", label: "Page images" }],
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        $.value === "pages" ? (a(), n(A, { key: 0 }, [
          s[64] || (s[64] = t("p", { class: "muted" }, "Extraction and visual support need models with vision. Text retrieval selects pages; section boundaries that share a page are unsupported.", -1)),
          p(te, {
            modelValue: S.value,
            "onUpdate:modelValue": s[27] || (s[27] = (v) => S.value = v),
            label: "Page images per call",
            min: c("max_pages").min,
            max: c("max_pages").max,
            disabled: e.readonly,
            note: "The context budget can admit fewer pages."
          }, null, 8, ["modelValue", "min", "max", "disabled"])
        ], 64)) : g("", !0),
        s[66] || (s[66] = t("h4", null, "Models", -1)),
        t("div", os, [
          s[65] || (s[65] = t("span", null, "Extraction", -1)),
          p(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: s[28] || (s[28] = (v) => l.value.extract.model = v)
          }, null, 8, ["value"])
        ]),
        s[67] || (s[67] = t("h4", null, "Field groups", -1)),
        t("ul", is, [
          (a(!0), n(A, null, z(u.value, (v) => (a(), n("li", {
            key: v.name
          }, [
            t("span", null, i(v.name), 1),
            t("span", ds, i(v.fields.length) + " field" + i(v.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        u.value.length ? g("", !0) : (a(), n("p", us, "No fields yet.")),
        p(te, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": s[29] || (s[29] = (v) => l.value.extract.max_fields_per_call = v),
          label: "Fields per call",
          min: c("max_fields_per_call").min,
          max: c("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(gt)(e.config)} extraction call${m(gt)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        p(te, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": s[30] || (s[30] = (v) => l.value.extract.max_output_tokens = v),
          label: "Output limit",
          min: c("max_output_tokens").min,
          max: c("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : g("", !0),
      e.stage === "verify" ? (a(), n(A, { key: 5 }, [
        t("div", rs, [
          s[68] || (s[68] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": s[31] || (s[31] = (v) => l.value.verify.enabled = v),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", cs, [
          t("span", null, [
            s[69] || (s[69] = M("Quotes exist", -1)),
            t("small", null, i($.value === "pages" ? "Text agreement is informational; visual support determines verification." : "Each quote is matched against the document text. No model call."), 1)
          ]),
          p(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": s[32] || (s[32] = (v) => l.value.verify.check_quotes = v),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", vs, [
          t("span", null, [
            s[70] || (s[70] = M("Quotes support values", -1)),
            t("small", null, i($.value === "pages" ? "A vision model checks the quote and value against physical page images." : "A model confirms each quote supports its value."), 1)
          ]),
          p(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": C,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), n(A, { key: 0 }, [
          t("div", ms, [
            s[71] || (s[71] = t("span", null, [
              M("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            p(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": s[33] || (s[33] = (v) => l.value.verify.check_completeness = v),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          s[73] || (s[73] = t("h4", null, "Models", -1)),
          t("div", ps, [
            s[72] || (s[72] = t("span", null, "Checker", -1)),
            p(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: s[34] || (s[34] = (v) => l.value.verify.model = v)
            }, null, 8, ["value"])
          ])
        ], 64)) : g("", !0)
      ], 64)) : g("", !0)
    ], 8, Bn));
  }
}), fs = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, gs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, hs = ["x", "y", "width"], ys = ["x", "width"], ks = /* @__PURE__ */ G({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const o = e, l = N(() => Math.min(0.9, Math.max(0, o.overlap / o.size))), c = N(() => {
      const d = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((f) => ({ x: f * d * (1 - l.value), w: d }));
    });
    return (d, f) => (a(), n("figure", fs, [
      (a(), n("svg", gs, [
        (a(!0), n(A, null, z(c.value, (y, u) => (a(), n("rect", {
          key: u,
          x: y.x,
          y: u % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, hs))), 128)),
        (a(), n(A, null, z([1, 2], (y) => t("rect", {
          key: "o" + y,
          x: c.value[y].x,
          y: 4,
          width: c.value[y - 1].x + c.value[y - 1].w - c.value[y].x,
          height: "24",
          class: "shared"
        }, null, 8, ys)), 64))
      ])),
      t("figcaption", null, i(e.size.toLocaleString()) + " tokens per chunk · " + i(e.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), xs = ["disabled"], $s = { class: "muted" }, ws = { class: "toggle-row" }, Vs = { class: "toggle-row" }, Cs = { class: "label-block" }, Ss = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Es = { class: "label-block" }, qs = {
  id: "embedding-model",
  class: "model-role"
}, Us = { class: "toggle-row" }, Ns = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Ms = /* @__PURE__ */ G({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = N(() => o.config.retrieval), c = N({ get: () => o.config.retention ?? "", set: (C) => {
      C.trim() ? o.config.retention = C.trim() : delete o.config.retention;
    } }), d = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], f = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = Xe("chunk_size"), u = Xe("overlap"), $ = Xe("section_budget"), S = N(() => Math.min(u.max, l.value.chunk_size - 50));
    return (C, b) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", $s, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(e.retention) + ".", 1),
      t("label", null, [
        b[12] || (b[12] = M("Retention window", -1)),
        W(t("input", {
          "onUpdate:modelValue": b[0] || (b[0] = (V) => c.value = V),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, c.value]
        ]),
        b[13] || (b[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      b[22] || (b[22] = t("h4", null, "Chunks", -1)),
      p(ks, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      p(te, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": b[1] || (b[1] = (V) => l.value.chunk_size = V),
        label: "Chunk size",
        min: m(y).min,
        max: m(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      p(te, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": b[2] || (b[2] = (V) => l.value.overlap = V),
        label: "Overlap",
        min: m(u).min,
        max: S.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", ws, [
        b[14] || (b[14] = t("span", null, [
          M("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        p(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": b[3] || (b[3] = (V) => l.value.split_headings = V),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", Vs, [
        b[15] || (b[15] = t("span", null, [
          M("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        p(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": b[4] || (b[4] = (V) => l.value.keep_tables = V),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      p(te, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": b[5] || (b[5] = (V) => l.value.section_budget = V),
        label: "Section budget",
        min: m($).min,
        max: m($).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b[23] || (b[23] = t("h4", null, "Context", -1)),
      t("div", Cs, [
        b[16] || (b[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        p(ye, {
          modelValue: l.value.context,
          "onUpdate:modelValue": b[6] || (b[6] = (V) => l.value.context = V),
          "labelled-by": "context-label",
          options: f
        }, null, 8, ["modelValue"]),
        t("small", null, i(f.find((V) => V.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), n("div", Ss, [
        b[17] || (b[17] = t("span", null, "Context writer", -1)),
        p(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: b[7] || (b[7] = (V) => l.value.context_model = V)
        }, null, 8, ["value"])
      ])) : g("", !0),
      b[24] || (b[24] = t("h4", null, "Search", -1)),
      t("div", Es, [
        b[18] || (b[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        p(ye, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": b[8] || (b[8] = (V) => l.value.search_mode = V),
          "labelled-by": "mode-label",
          options: d
        }, null, 8, ["modelValue"]),
        t("small", null, i(d.find((V) => V.value === l.value.search_mode)?.note), 1)
      ]),
      b[25] || (b[25] = t("h4", null, "Models", -1)),
      t("div", qs, [
        b[19] || (b[19] = t("span", null, "Embedding", -1)),
        p(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: b[9] || (b[9] = (V) => l.value.embedding_model = V)
        }, null, 8, ["value"])
      ]),
      t("div", Us, [
        b[20] || (b[20] = t("span", null, [
          M("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        p(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": b[10] || (b[10] = (V) => l.value.highlighter = V),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), n("div", Ns, [
        b[21] || (b[21] = t("span", null, "Highlighter", -1)),
        p(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: b[11] || (b[11] = (V) => l.value.highlighter_model = V)
        }, null, 8, ["value"])
      ])) : g("", !0)
    ], 8, xs));
  }
}), As = ["inert"], Rs = { class: "canvas-inner" }, Bs = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Ls = { class: "block-head" }, Ts = ["aria-expanded"], Ps = { class: "count" }, Ds = {
  key: 0,
  class: "block-peek"
}, Os = {
  key: 1,
  class: "field-add-actions push"
}, Fs = ["aria-expanded", "aria-controls", "disabled"], Is = ["disabled"], js = {
  id: "fields-body",
  class: "block-body"
}, zs = {
  key: 0,
  class: "block-empty"
}, Ws = { class: "field-tree" }, Gs = ["id"], Ks = {
  class: "tree-indent",
  "aria-hidden": "true"
}, Hs = {
  class: "shape-preview",
  open: ""
}, Qs = { class: "kx-focus-outline" }, Js = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Ys = {
  key: 1,
  class: "preview-grid"
}, Xs = { "aria-label": "Output shape" }, Zs = { "aria-label": "Example output" }, _s = {
  class: "block",
  "aria-labelledby": "flow-head"
}, eo = { class: "block-head" }, to = ["aria-expanded"], lo = { class: "count" }, ao = {
  key: 0,
  class: "block-peek"
}, no = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, so = { class: "node-icon" }, oo = { class: "node-main" }, io = { class: "node-summary" }, uo = { class: "node-side" }, ro = { class: "chip model" }, co = { class: "branches" }, vo = { class: "branch" }, mo = { class: "branch" }, po = { class: "node-icon" }, bo = { class: "node-main" }, fo = { class: "node-summary" }, go = ["aria-labelledby", "role", "aria-modal"], ho = ["aria-valuenow"], yo = { class: "side-panel-head" }, ko = { class: "side-panel-icon" }, xo = ["id"], $o = ["aria-label", "title"], wo = { class: "node-breadcrumb mono" }, Vo = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, Co = {
  key: 0,
  value: ""
}, So = {
  key: 1,
  value: "",
  disabled: ""
}, Eo = ["value"], qo = ["disabled"], Uo = ["disabled"], No = {
  key: 4,
  class: "inspector-form"
}, Mo = { class: "output-list" }, Ao = { class: "mono" }, Ro = { class: "chip" }, Bo = { class: "rail-label" }, Ze = 400, Ie = 320, Lo = /* @__PURE__ */ G({
  __name: "Builder",
  props: /* @__PURE__ */ Qe({
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
    const o = e, l = Le(e, "title"), c = Le(e, "description"), d = B({ kind: "document" });
    function f(k, r) {
      try {
        const q = localStorage.getItem(`docscout.${k}`);
        return q === null ? r : q === "1";
      } catch {
        return r;
      }
    }
    function y(k, r) {
      try {
        localStorage.setItem(`docscout.${k}`, r ? "1" : "0");
      } catch {
      }
    }
    const u = B(f("panel", !0)), $ = B(f("fields", !0)), S = B(f("flow", !0));
    function C() {
      try {
        const k = Number(localStorage.getItem("docscout.panelWidth"));
        return k >= Ie ? k : Ze;
      } catch {
        return Ze;
      }
    }
    const b = B(C()), V = () => {
      const k = F.value?.clientWidth;
      return k ? Math.max(Ie, k - 420) : Number.POSITIVE_INFINITY;
    };
    function w(k, r = !0) {
      if (b.value = Math.round(Math.min(V(), Math.max(Ie, k))), r)
        try {
          localStorage.setItem("docscout.panelWidth", String(b.value));
        } catch {
        }
    }
    const s = B(!1);
    function v(k) {
      const r = k.currentTarget, q = k.clientX, Y = b.value;
      r.setPointerCapture(k.pointerId), s.value = !0;
      const X = (ee) => w(Y + (q - ee.clientX), !1), ae = () => {
        s.value = !1, w(b.value), r.removeEventListener("pointermove", X), r.removeEventListener("pointerup", ae);
      };
      r.addEventListener("pointermove", X), r.addEventListener("pointerup", ae);
    }
    function R(k) {
      k.key === "ArrowLeft" ? (w(b.value + 24), k.preventDefault()) : k.key === "ArrowRight" && (w(b.value - 24), k.preventDefault());
    }
    let O = null;
    const U = B(), T = pe();
    async function K(k) {
      if (u.value = k, !D.value) {
        y("panel", k);
        return;
      }
      if (!k && O) {
        const r = O;
        O = null, await Se(), r.focus();
      }
    }
    function I(k) {
      const r = k === "fields" ? $ : S;
      r.value = !r.value, y(k, r.value);
    }
    const F = B(), D = B(!1);
    let de;
    Ue(() => {
      de = new ResizeObserver(([k]) => {
        const r = D.value;
        D.value = k.contentRect.width < 1e3, D.value && !r && (u.value = !1), !D.value && r && (u.value = f("panel", !0));
      }), F.value && de.observe(F.value);
    }), kt(() => de?.disconnect());
    const ke = B();
    be(d, async () => {
      await Se(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(k) {
      D.value && !u.value && (O = F.value?.getRootNode()?.activeElement), d.value = k, u.value = !0, D.value && (await Se(), U.value?.focus());
    }
    const oe = (k) => JSON.stringify(k) === JSON.stringify(d.value), fe = N(() => d.value.kind === "field" ? o.config.fields[d.value.index] : void 0), E = N(() => Ke(o.config.fields)), h = N(() => d.value.kind === "field" ? E.value.find((k) => k.key === ie(d.value.index, d.value.trail ?? [])) : void 0), x = N(() => h.value?.key ?? ""), P = N(() => {
      const k = h.value;
      return !k || k.trail.at(-1) === "item" || !k.trail.length ? void 0 : E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1))).shape.properties.filter((q) => q !== k.shape).map((q) => q.name);
    }), j = B("");
    be(x, () => {
      j.value = "";
    });
    const Ne = N(() => h.value ? Ll(o.config.fields, h.value) : []), ge = N(() => {
      const k = gl(o.config.fields.map(H));
      return k ? `Group path collides with field ${k}.` : "";
    }), Pe = N(() => ge.value ? null : yt(o.config.fields)), Rt = N(() => ge.value ? null : yt(o.config.fields, !0)), ot = N(() => {
      const k = d.value;
      return k.kind === "stage" ? xe[k.stage] : k.kind === "field" ? h.value?.trail.length ? h.value.path : fe.value?.name || "New field" : k.kind === "document" ? "Read document" : k.kind === "output" ? "Output" : "Details";
    }), Bt = N(() => {
      const k = d.value;
      return k.kind === "stage" ? st[k.stage] : k.kind === "field" ? "tabler:forms" : k.kind === "document" ? "tabler:file-text" : k.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Lt = N(() => o.config.fields.filter((k, r) => !(d.value.kind === "field" && d.value.index === r)).map(H)), Tt = N(() => o.config.stages.deep.enabled), Pt = N(() => o.config.stages.map.enabled), Dt = N(() => Te(o.config.fields.map(H))), De = B(!1), it = B(), dt = pe();
    function Ot(k, r) {
      for (const q of o.config.fields) (q.group === k || q.group.startsWith(k + ".")) && (q.group = r + q.group.slice(k.length));
    }
    const Ft = (k) => 320 - Math.max(0, ...o.config.fields.filter((r) => r.group === k || r.group.startsWith(k + ".")).map((r) => r.group.length - k.length));
    function It() {
      $.value = !0, De.value = !0;
    }
    async function ut() {
      De.value = !1, await Se(), it.value.focus();
    }
    function jt(k) {
      o.config.fields.push({ ...tt(), group: k }), ut();
    }
    const zt = N(() => [...new Set(o.config.fields.map((k) => k.group.trim()).filter(Boolean))]), Wt = (k) => Ct(o.config.fields[k], o.config.fields.filter((r, q) => q !== k).map(H)), rt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Gt = N(() => rt.filter((k) => Ge(o.config, k)).map((k) => xe[k]).join(" · ")), Kt = N(() => o.config.fields.map((k) => k.name || "New field").join(", ")), Ht = N(() => rt.filter((k) => Ge(o.config, k)).length), $e = (k) => o.result?.trace.find((r) => r.kind === k);
    function ct(k = "") {
      o.config.fields.push({ ...tt(), group: k }), $.value = !0, le({ kind: "field", index: o.config.fields.length - 1 });
    }
    function Qt(k) {
      o.config.fields.splice(k, 1), d.value = { kind: "document" };
    }
    function re(k, r = []) {
      le({ kind: "field", index: k, ...r.length ? { trail: r } : {} });
    }
    function vt(k, r) {
      const q = E.value.find((Y) => Y.key === ie(k, r));
      q.shape.properties.push(Vt()), re(k, [...r, q.shape.properties.length - 1]);
    }
    function Jt() {
      const k = h.value;
      if (!k.trail.length) {
        Qt(k.field);
        return;
      }
      const r = E.value.find((q) => q.key === ie(k.field, k.trail.slice(0, -1)));
      r.shape.properties.splice(k.trail.at(-1), 1), re(r.field, r.trail);
    }
    function Yt(k, r, q) {
      if (r.length) {
        const X = E.value.find((ne) => ne.key === ie(k, r.slice(0, -1))).shape.properties, ae = r.at(-1), ee = ae + q;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(k, [...r.slice(0, -1), ee]);
      } else {
        const Y = o.config.fields.map((ee, ne) => ee.group === o.config.fields[k].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(k) + q];
        if (X === void 0) return;
        const ae = o.config.fields;
        [ae[k], ae[X]] = [ae[X], ae[k]], re(X);
      }
    }
    function Xt() {
      const k = h.value, r = Ne.value.find((Y) => Y.key === j.value), q = Tl(o.config.fields, k, r);
      re(q.field, q.trail);
    }
    function Zt(k) {
      const r = h.value?.shape;
      o.config.fields.splice(0, o.config.fields.length, ...o.config.fields.filter((Y) => Y.group !== k && !Y.group.startsWith(k + ".")));
      const q = E.value.find((Y) => Y.shape === r);
      q ? re(q.field, q.trail) : d.value = { kind: "document" };
    }
    function _t(k, r) {
      const q = k.split(".").slice(0, -1).join(".");
      let X = Te(o.config.fields.map(H));
      for (const se of q.split(".").filter(Boolean)) X = X.children.find((al) => al.name === se);
      const ae = X.children.findIndex((se) => se.path === k), ee = X.children[ae + r]?.path;
      if (!ee) return;
      const ne = o.config.fields.filter((se) => se.group === k || se.group.startsWith(k + ".")), Oe = o.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Me = o.config.fields, tl = Math.min(Me.indexOf(ne[0]), Me.indexOf(Oe[0])), pt = Me.filter((se) => !ne.includes(se) && !Oe.includes(se));
      pt.splice(tl, 0, ...r > 0 ? [...Oe, ...ne] : [...ne, ...Oe]);
      const ll = h.value?.shape;
      Me.splice(0, Me.length, ...pt);
      const Ye = E.value.find((se) => se.shape === ll);
      Ye && re(Ye.field, Ye.trail);
    }
    const el = (k) => k.type === "list" ? `list of ${k.item?.type}` : k.type, mt = N({ get: () => o.config.tags.join(", "), set: (k) => {
      o.config.tags = [...new Set(k.split(",").map((r) => r.trim()).filter(Boolean))];
    } });
    return (k, r) => (a(), n("div", {
      ref_key: "root",
      ref: F,
      class: Q(["builder", { narrow: D.value, "panel-open": u.value, resizing: s.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: D.value && u.value
      }, [
        t("div", Rs, [
          t("section", Bs, [
            t("header", Ls, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": $.value,
                "aria-controls": "fields-body",
                onClick: r[0] || (r[0] = (q) => I("fields"))
              }, [
                p(m(L), {
                  icon: $.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                r[23] || (r[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Ps, i(e.config.fields.length), 1)
              ], 8, Ts),
              !$.value && e.config.fields.length ? (a(), n("span", Ds, i(Kt.value), 1)) : g("", !0),
              e.readonly ? g("", !0) : (a(), n("div", Os, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: it,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": m(dt),
                  disabled: e.config.fields.length >= 100,
                  onClick: It
                }, [
                  p(m(L), { icon: "tabler:folder-plus" }),
                  r[24] || (r[24] = M("Add group", -1))
                ], 8, Fs),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: r[1] || (r[1] = (q) => ct())
                }, [
                  p(m(L), { icon: "tabler:plus" }),
                  r[25] || (r[25] = M("Add field", -1))
                ], 8, Is)
              ]))
            ]),
            W(t("div", js, [
              e.config.fields.length ? g("", !0) : (a(), n("p", zs, "Add the values to pull from each document.")),
              t("div", Ws, [
                De.value && !e.readonly ? (a(), n("div", {
                  key: 0,
                  id: m(dt),
                  class: "group-create-row"
                }, [
                  t("span", Ks, [
                    p(m(L), { icon: "tabler:folder-plus" })
                  ]),
                  p(qt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: jt,
                    onCancel: ut
                  })
                ], 8, Gs)) : g("", !0),
                p(Re, { node: Dt.value }, {
                  header: me(({ path: q, label: Y, count: X, first: ae, last: ee }) => [
                    p(Ba, {
                      path: q,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Ft(q),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ot(q, ne),
                      onAdd: (ne) => ct(q),
                      onReorder: (ne) => _t(q, ne),
                      onRemove: (ne) => Zt(q)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: q }) => [
                    p(an, {
                      shape: e.config.fields[q],
                      field: q,
                      trail: [],
                      path: m(H)(e.config.fields[q]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Wt(q),
                      first: !e.config.fields.slice(0, q).some((Y) => Y.group === e.config.fields[q].group),
                      last: !e.config.fields.slice(q + 1).some((Y) => Y.group === e.config.fields[q].group),
                      onSelect: re,
                      onAdd: vt,
                      onReorder: Yt
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", Hs, [
                t("summary", Qs, [
                  p(m(L), { icon: "tabler:braces" }),
                  r[26] || (r[26] = M("Output preview", -1))
                ]),
                ge.value ? (a(), n("p", Js, i(ge.value), 1)) : (a(), n("div", Ys, [
                  t("div", null, [
                    r[27] || (r[27] = t("h3", null, "Output shape", -1)),
                    t("pre", Xs, i(JSON.stringify(Pe.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    r[28] || (r[28] = t("h3", null, "Example value", -1)),
                    t("pre", Zs, i(JSON.stringify(Rt.value, null, 2)), 1)
                  ])
                ])),
                r[29] || (r[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [We, $.value]
            ])
          ]),
          t("section", _s, [
            t("header", eo, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": S.value,
                "aria-controls": "flow-body",
                onClick: r[2] || (r[2] = (q) => I("flow"))
              }, [
                p(m(L), {
                  icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                r[30] || (r[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", lo, i(Ht.value) + " of 6", 1)
              ], 8, to),
              S.value ? g("", !0) : (a(), n("span", ao, i(Gt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: r[3] || (r[3] = (q) => le({ kind: "details" }))
              }, [
                p(m(L), { icon: "tabler:info-circle" }),
                r[31] || (r[31] = M("Details", -1))
              ], 2)
            ]),
            W(t("div", no, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: r[4] || (r[4] = (q) => le({ kind: "document" }))
              }, [
                t("span", so, [
                  p(m(L), { icon: "tabler:file-text" })
                ]),
                t("span", oo, [
                  r[32] || (r[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", io, i(m(hl)(e.config.retrieval)), 1)
                ]),
                t("span", uo, [
                  t("span", ro, i(m($t)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              r[37] || (r[37] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: $e("map"),
                readonly: e.readonly,
                onSelect: r[5] || (r[5] = (q) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[38] || (r[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", co, [
                t("div", vo, [
                  r[33] || (r[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  p(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: $e("prefetch"),
                    readonly: e.readonly,
                    onSelect: r[6] || (r[6] = (q) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  r[34] || (r[34] = t("div", { class: "connector" }, null, -1)),
                  p(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: $e("scout"),
                    readonly: e.readonly,
                    onSelect: r[7] || (r[7] = (q) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", mo, [
                  r[35] || (r[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  p(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: $e("deep"),
                    readonly: e.readonly,
                    onSelect: r[8] || (r[8] = (q) => le({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              r[39] || (r[39] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              p(we, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: $e("extract"),
                readonly: e.readonly,
                onSelect: r[9] || (r[9] = (q) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[40] || (r[40] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: $e("verify"),
                readonly: e.readonly,
                onSelect: r[10] || (r[10] = (q) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[41] || (r[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: r[11] || (r[11] = (q) => le({ kind: "output" }))
              }, [
                t("span", po, [
                  p(m(L), { icon: "tabler:braces" })
                ]),
                t("span", bo, [
                  r[36] || (r[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", fo, i(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [We, S.value]
            ])
          ])
        ])
      ], 8, As),
      D.value && u.value ? (a(), n("div", {
        key: 0,
        class: "scrim",
        onClick: r[12] || (r[12] = (q) => K(!1))
      })) : g("", !0),
      u.value ? W((a(), n("aside", {
        key: String(D.value),
        class: "side-panel",
        "aria-labelledby": m(T),
        role: D.value ? "dialog" : void 0,
        "aria-modal": D.value ? "true" : void 0,
        style: qe(D.value ? void 0 : { width: `${b.value}px` }),
        onKeydown: r[21] || (r[21] = Ee((q) => D.value && K(!1), ["esc"]))
      }, [
        D.value ? g("", !0) : (a(), n("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: s.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": b.value,
          "aria-valuemin": Ie,
          onPointerdown: ve(v, ["prevent"]),
          onKeydown: R,
          onDblclick: r[13] || (r[13] = (q) => w(Ze))
        }, null, 42, ho)),
        t("header", yo, [
          t("span", ko, [
            p(m(L), { icon: Bt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: m(T) }, i(ot.value), 9, xo),
          t("button", {
            ref_key: "closeButton",
            ref: U,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": D.value ? "Close panel" : "Collapse panel",
            title: D.value ? "Close panel" : "Collapse panel",
            onClick: r[14] || (r[14] = (q) => K(!1))
          }, [
            p(m(L), {
              icon: D.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, $o)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ke,
          class: "side-panel-body"
        }, [
          d.value.kind === "document" ? (a(), J(Ms, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "stage" ? (a(), J(bs, {
            key: 1,
            stage: d.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : d.value.kind === "field" && fe.value && h.value ? (a(), n(A, { key: 2 }, [
            t("p", wo, i(h.value.path), 1),
            p(ba, {
              field: fe.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": P.value,
              "other-names": Lt.value,
              groups: zt.value,
              "deep-enabled": Tt.value,
              "map-enabled": Pt.value,
              readonly: e.readonly,
              onRemove: Jt,
              onAdd: r[15] || (r[15] = (q) => vt(h.value.field, h.value.trail)),
              onSelectItem: r[16] || (r[16] = (q) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (a(), n("fieldset", Vo, [
              t("label", null, [
                r[42] || (r[42] = M("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": r[17] || (r[17] = (q) => j.value = q),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (a(), n("option", Co, "Top-level field")) : (a(), n("option", So, "Choose an object…")),
                  (a(!0), n(A, null, z(Ne.value, (q) => (a(), n("option", {
                    key: q.key,
                    value: q.key
                  }, i(q.path), 9, Eo))), 128))
                ], 512), [
                  [ze, j.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !j.value && !h.value.trail.length || !j.value && e.config.fields.length >= 100,
                onClick: Xt
              }, "Move", 8, qo)
            ])) : g("", !0)
          ], 64)) : d.value.kind === "details" ? (a(), n("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              r[43] || (r[43] = M("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": r[18] || (r[18] = (q) => l.value = q),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              r[44] || (r[44] = M("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": r[19] || (r[19] = (q) => c.value = q),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, c.value]
              ])
            ]),
            t("label", null, [
              r[45] || (r[45] = M("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": r[20] || (r[20] = (q) => mt.value = q),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  mt.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              r[46] || (r[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Uo)) : d.value.kind === "output" ? (a(), n("div", No, [
            r[47] || (r[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Mo, [
              (a(!0), n(A, null, z(e.config.fields, (q) => (a(), n("li", {
                key: m(H)(q)
              }, [
                t("span", Ao, i(m(H)(q) || "New field"), 1),
                t("span", Ro, i(el(q)), 1)
              ]))), 128))
            ]),
            r[48] || (r[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : g("", !0)
        ], 512)
      ], 44, go)), [
        [m(xl), { disabled: !D.value }]
      ]) : D.value ? g("", !0) : (a(), n("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: r[22] || (r[22] = (q) => K(!0))
      }, [
        p(m(L), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Bo, i(ot.value), 1)
      ]))
    ], 2));
  }
}), To = ["selected"], Po = {
  key: 1,
  role: "alert"
}, Do = {
  key: 2,
  class: "muted picker-pending picker-pending--list"
}, Ut = /* @__PURE__ */ G({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, c = B(!1), d = B("");
    Ue(async () => {
      try {
        await Je("wc-multiselect", { timeoutMs: 8e3 }), c.value = !0;
      } catch (y) {
        d.value = String(y);
      }
    });
    function f(y) {
      const u = y.detail;
      l("select", u.selected[0] || "", u.labels?.[0] || "");
    }
    return (y, u) => c.value ? (a(), n("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: f
    }, null, 40, To)) : d.value ? (a(), n("p", Po, i(d.value), 1)) : (a(), n("span", Do, "Loading uploads…"));
  }
}), je = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ce = (e) => e.metrics.length ? e.metrics.reduce((o, l) => o + l.accuracy, 0) / e.metrics.length : 0, Nt = (e) => `Visual · ${e.status}`, Oo = ["data-error-kind", "data-error-code"], Fo = { key: 0 }, Mt = /* @__PURE__ */ G({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const o = e, l = N(() => {
      const d = o.error?.details;
      return d && typeof d == "object" && "code" in d && typeof d.code == "string" ? d.code : void 0;
    }), c = N(() => l.value === "context_budget_exceeded");
    return (d, f) => (a(), n("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      "data-error-code": l.value,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, i(c.value ? "Context budget exceeded" : e.error?.kind), 1),
        M(" · " + i(e.error?.message), 1)
      ]),
      t("small", null, i(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), n("details", Fo, [
        f[0] || (f[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, i(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : g("", !0)
    ], 8, Oo));
  }
}), Io = { class: "nested-value" }, jo = { key: 0 }, zo = {
  key: 0,
  class: "muted"
}, Wo = { key: 1 }, Go = { key: 2 }, Be = /* @__PURE__ */ G({
  __name: "NestedValue",
  props: {
    value: {},
    schema: {}
  },
  setup(e) {
    const o = e, l = N(() => o.value !== null && typeof o.value == "object" && !Array.isArray(o.value) ? o.value : null), c = N(() => [.../* @__PURE__ */ new Set([...Object.keys(o.schema?.properties ?? {}), ...Object.keys(l.value ?? {})])]);
    function d(y) {
      if (!y) return !1;
      if (Array.isArray(y.type) && y.type.includes("null")) return !0;
      const u = Object.entries(y.properties ?? {});
      return u.length ? u.every(([$, S]) => !y.required?.includes($) || d(S)) : !!y.items && d(y.items);
    }
    const f = N(() => d(o.schema) ? "Missing" : "—");
    return (y, u) => {
      const $ = nt("NestedValue", !0);
      return a(), n("div", Io, [
        Array.isArray(e.value) ? (a(), n("ol", jo, [
          (a(!0), n(A, null, z(e.value, (S, C) => (a(), n("li", { key: C }, [
            p($, {
              value: S,
              schema: e.schema?.items
            }, null, 8, ["value", "schema"])
          ]))), 128)),
          e.value.length ? g("", !0) : (a(), n("li", zo, "Empty list"))
        ])) : l.value ? (a(), n("dl", Wo, [
          (a(!0), n(A, null, z(c.value, (S) => (a(), n(A, { key: S }, [
            t("dt", null, i(S), 1),
            t("dd", null, [
              p($, {
                value: m(lt)(l.value, S),
                schema: e.schema?.properties?.[S]
              }, null, 8, ["value", "schema"])
            ])
          ], 64))), 128))
        ])) : (a(), n("span", Go, i(e.value === null || e.value === void 0 ? f.value : String(e.value)), 1))
      ]);
    };
  }
}), Ko = { class: "value-list" }, Ho = ["aria-expanded", "onClick"], Qo = { class: "value-name" }, Jo = { class: "bar" }, Yo = {
  key: 1,
  class: "value-checks"
}, Xo = ["title"], Zo = {
  key: 0,
  class: "chip",
  "aria-label": "Verification method"
}, _o = {
  key: 1,
  class: "chip warn",
  "aria-label": "Context"
}, ei = {
  key: 2,
  class: "chip",
  "aria-label": "Completeness"
}, ti = { class: "evidence" }, li = {
  key: 1,
  class: "muted"
}, ai = {
  key: 2,
  class: "muted"
}, At = /* @__PURE__ */ G({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const o = e, l = N(() => Te(o.fields.map((C) => C.path))), c = B(), d = (C) => `${Math.round(C * 100)}%`, f = (C) => C !== null && typeof C == "object", y = (C) => Array.isArray(C) ? `${C.length} items` : f(C) ? `${Object.keys(C).length} properties` : C == null ? "—" : String(C), u = (C) => C >= 0.9 ? "high" : C >= 0.7 ? "mid" : "low", $ = (C) => C.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (o.pageRange ? " of the searched pages" : "") : "Not in the document", S = (C) => {
      const b = C.error?.details;
      return !!b && typeof b == "object" && "code" in b && b.code === "context_budget_exceeded";
    };
    return (C, b) => (a(), n("div", Ko, [
      p(Re, { node: l.value }, {
        default: me(({ index: V }) => [
          (a(!0), n(A, null, z([e.fields[V]], (w) => (a(), n("div", {
            key: w.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": c.value === w.path,
              onClick: (s) => c.value = c.value === w.path ? void 0 : w.path
            }, [
              t("span", Qo, i(w.name), 1),
              t("span", {
                class: Q(["value-text", { missing: w.missing }])
              }, i(w.failed ? S(w) ? "Context budget exceeded" : "Failed" : w.missing ? $(w) : y(w.value)), 3),
              w.failed ? g("", !0) : (a(), n("span", {
                key: 0,
                class: Q(["confidence", u(w.confidence)])
              }, [
                t("span", Jo, [
                  t("span", {
                    style: qe({ width: d(w.confidence) })
                  }, null, 4)
                ]),
                M(i(d(w.confidence)), 1),
                b[0] || (b[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              w.failed ? g("", !0) : (a(), n("span", Yo, [
                t("span", {
                  class: Q(["chip", w.verified ? "primary" : "warn"]),
                  title: w.reason
                }, [
                  p(m(L), {
                    icon: w.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  M(i(w.verified ? "Verified" : "Check"), 1)
                ], 10, Xo),
                w.verification ? (a(), n("span", Zo, i(m(Nt)(w.verification)), 1)) : g("", !0),
                w.codes?.includes("context_budget_partial") ? (a(), n("span", _o, "Partial context")) : g("", !0),
                w.missing ? g("", !0) : (a(), n("span", ei, i(w.complete === !0 ? "Complete" : w.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              p(m(L), {
                icon: c.value === w.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, Ho),
            !w.failed && !w.missing && f(w.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: w.value,
              schema: w.value_schema
            }, null, 8, ["value", "schema"])) : g("", !0),
            w.failed ? (a(), J(Mt, {
              key: 1,
              error: w.error
            }, null, 8, ["error"])) : g("", !0),
            W(t("div", ti, [
              !w.failed && !w.missing && !f(w.value) ? (a(), J(Be, {
                key: 0,
                value: w.value,
                schema: w.value_schema
              }, null, 8, ["value", "schema"])) : g("", !0),
              (a(!0), n(A, null, z(w.evidence, (s, v) => (a(), n("blockquote", {
                key: v,
                class: Q({ unfound: s.found === !1 })
              }, [
                t("p", null, "“" + i(s.quote) + "”", 1),
                t("cite", null, [
                  M(i(s.section), 1),
                  s.page !== void 0 && s.page !== null ? (a(), n(A, { key: 0 }, [
                    M(" · Page " + i(s.page), 1)
                  ], 64)) : g("", !0),
                  s.found === !1 ? (a(), n(A, { key: 1 }, [
                    M(" · not found word for word in the document")
                  ], 64)) : g("", !0)
                ])
              ], 2))), 128)),
              w.evidence.length ? g("", !0) : (a(), n("p", li, "No evidence.")),
              w.reason || !w.verified && !w.failed ? (a(), n("p", ai, i(w.reason || "No reason recorded"), 1)) : g("", !0)
            ], 512), [
              [We, c.value === w.path && !w.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), ni = { class: "test" }, si = { class: "run-bar" }, oi = { class: "run-input" }, ii = { class: "muted run-note" }, di = {
  key: 0,
  class: "empty"
}, ui = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, ri = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, ci = {
  key: 3,
  class: "test-grid"
}, vi = { class: "block" }, mi = { class: "block-head" }, pi = { class: "muted push" }, bi = { class: "block" }, fi = { class: "timeline" }, gi = { class: "tl-icon" }, hi = { class: "tl-main" }, yi = { class: "tl-head" }, ki = { class: "muted push" }, xi = { class: "tl-bar" }, $i = { class: "muted" }, wi = {
  key: 0,
  class: "tl-msg"
}, Vi = {
  key: 1,
  class: "chips"
}, Ci = /* @__PURE__ */ G({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(""), f = (C) => `${(C / 1e3).toFixed(1)}s`, y = N(() => Math.max(1, ...l.result?.trace.map((C) => C.duration_ms) ?? [1])), u = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, $ = (C) => u[C]?.label ?? xe[C] ?? C, S = (C) => u[C]?.icon ?? st[C] ?? "tabler:point";
    return (C, b) => (a(), n("div", ni, [
      t("section", si, [
        t("div", oi, [
          p(Ut, {
            value: d.value,
            onSelect: b[0] || (b[0] = (V) => d.value = V)
          }, null, 8, ["value"])
        ]),
        p(m(ue), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !d.value || e.running || !e.canRun,
          onClick: b[1] || (b[1] = (V) => c("run", d.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", ii, i(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(e.retention) + ".", 1)
      ]),
      e.result ? g("", !0) : (a(), n("p", di, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), n("p", ui, [
        p(m(L), { icon: "tabler:alert-triangle" }),
        M("The run stopped: " + i(e.result.error), 1)
      ])) : g("", !0),
      e.result?.status === "partial" ? (a(), n("p", ri, [
        p(m(L), { icon: "tabler:alert-triangle" }),
        b[2] || (b[2] = M("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : g("", !0),
      e.result ? (a(), n("div", ci, [
        t("section", vi, [
          t("header", mi, [
            b[3] || (b[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", pi, [
              M(i(e.result.tokens.toLocaleString()) + " tokens · " + i(f(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), n(A, { key: 0 }, [
                M(" · Pages " + i(e.result.page_range.first) + "–" + i(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), n(A, { key: 1 }, [
                M(" · " + i(e.result.pages) + " pages", 1)
              ], 64)) : g("", !0)
            ])
          ]),
          p(At, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", bi, [
          b[4] || (b[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", fi, [
            (a(!0), n(A, null, z(e.result.trace, (V, w) => (a(), n("li", {
              key: w,
              class: Q(V.status)
            }, [
              t("span", gi, [
                p(m(L), {
                  icon: S(V.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", hi, [
                t("div", yi, [
                  t("strong", null, i($(V.kind)), 1),
                  t("span", ki, i(f(V.duration_ms)), 1)
                ]),
                t("span", xi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, V.duration_ms / y.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", $i, [
                  M(i(V.scope), 1),
                  V.pages ? (a(), n(A, { key: 0 }, [
                    M(" · Pages " + i(V.pages.first) + "–" + i(V.pages.last), 1)
                  ], 64)) : g("", !0),
                  V.model ? (a(), n(A, { key: 1 }, [
                    M(" · " + i(V.model), 1)
                  ], 64)) : g("", !0),
                  M(" · " + i((V.input_tokens + V.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                V.message ? (a(), n("p", wi, i(V.message), 1)) : g("", !0),
                V.queries?.length ? (a(), n("div", Vi, [
                  (a(!0), n(A, null, z(V.queries, (s) => (a(), n("span", {
                    key: s,
                    class: "chip"
                  }, i(s), 1))), 128))
                ])) : g("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : g("", !0)
    ]));
  }
});
function He(e, o = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === o.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === o.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Si = { class: "evals" }, Ei = { class: "block eval-run" }, qi = { class: "eval-run-main" }, Ui = { class: "block-title" }, Ni = {
  key: 0,
  class: "eval-note"
}, Mi = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ai = { class: "bar" }, Ri = { class: "muted" }, Bi = { class: "stat-row" }, Li = { class: "stat" }, Ti = { class: "stat-label" }, Pi = { class: "stat-value" }, Di = { class: "stat" }, Oi = { class: "stat-value" }, Fi = { class: "stat-delta flat" }, Ii = { class: "stat" }, ji = { class: "stat-value" }, zi = {
  key: 0,
  class: "stat-delta flat"
}, Wi = { class: "stat" }, Gi = { class: "stat-value" }, Ki = {
  key: 0,
  class: "stat-delta flat"
}, Hi = { class: "block" }, Qi = { class: "block-head" }, Ji = {
  key: 0,
  class: "compare-pick push"
}, Yi = ["value"], Xi = ["value"], Zi = {
  key: 0,
  class: "block-empty"
}, _i = {
  key: 1,
  class: "table-scroll"
}, ed = { key: 0 }, td = { key: 1 }, ld = { class: "mono" }, ad = { class: "acc strong" }, nd = { class: "bar" }, sd = { class: "muted" }, od = {
  key: 0,
  class: "muted"
}, id = { key: 1 }, dd = {
  key: 1,
  class: "muted"
}, ud = {
  key: 1,
  class: "block"
}, rd = { class: "table-scroll" }, cd = { class: "metric-table result-matrix" }, vd = ["aria-expanded", "onClick"], md = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, pd = ["colspan"], bd = {
  key: 0,
  class: "cell-state"
}, fd = ["data-error-kind", "title"], gd = ["data-label"], hd = ["title"], yd = {
  key: 0,
  class: "result-detail"
}, kd = ["colspan"], xd = ["data-error-kind", "title"], $d = { class: "mono" }, wd = { class: "cmp" }, Vd = { class: "cmp" }, Cd = {
  key: 0,
  class: "value-checks"
}, Sd = {
  key: 1,
  class: "chip",
  "aria-label": "Verification method"
}, Ed = { class: "muted case-meta" }, qd = { class: "block" }, Ud = { class: "block-head" }, Nd = { class: "count" }, Md = { class: "mono" }, Ad = ["onUpdate:modelValue"], Rd = ["onUpdate:modelValue"], Bd = ["onUpdate:modelValue", "placeholder"], Ld = ["onUpdate:modelValue", "type"], Td = {
  key: 0,
  class: "error",
  role: "alert"
}, Pd = { class: "row" }, Dd = {
  key: 1,
  class: "block-empty"
}, Od = {
  key: 2,
  class: "block-empty"
}, Fd = {
  key: 3,
  class: "table-scroll"
}, Id = { class: "metric-table case-table" }, jd = { class: "case-value" }, zd = {
  key: 1,
  class: "muted"
}, Wd = { class: "num" }, Gd = ["aria-label", "disabled", "onClick"], Kd = {
  key: 2,
  class: "block"
}, Hd = { class: "block-head" }, Qd = { class: "count" }, Jd = { class: "eval-history" }, Yd = ["aria-current", "onClick"], Xd = ["data-status"], Zd = { class: "muted" }, _d = { class: "push" }, eu = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(!1), f = B(""), y = B({}), u = B("");
    be(() => l.addedCaseId, () => {
      d.value = !1, f.value = "", y.value = {};
    });
    function $(E, h) {
      return E.type === "number" ? Number(h) : E.type === "boolean" ? h === "true" : E.type === "list" || E.type === "object" ? JSON.parse(h) : h;
    }
    function S() {
      u.value = "";
      const E = {};
      try {
        for (const h of l.fields) {
          const x = String(y.value[H(h)] ?? "").trim();
          x && wt(E, H(h), $(h, x));
        }
      } catch {
        u.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      c("add-case", { upload_id: f.value, expected: E });
    }
    const C = N(() => l.evaluations.find((E) => !je(E))), b = N(() => l.evaluations.filter(je)), V = N(() => l.evaluation), w = N(() => ({ done: (V.value?.results ?? []).filter((h) => h.status !== "queued").length, total: V.value?.case_count ?? 0 })), s = B();
    be(() => V.value?.id, () => {
      s.value = void 0;
    });
    const v = N(() => {
      if (!V.value) return;
      if (s.value) return b.value.find((h) => h.id === s.value);
      const E = b.value.findIndex((h) => h.id === V.value.id);
      return E >= 0 ? b.value[E + 1] : b.value[0];
    }), R = N(() => (V.value?.metrics ?? []).map((E) => ({ ...E, before: v.value?.metrics.find((h) => h.field === E.field) }))), O = N(() => (V.value?.fields ?? []).map(H)), U = N(() => Te(l.fields.map(H))), T = (E, h) => E.scores.find((x) => x.field === h), K = B(), I = (E) => `${Math.round(E * 100)}%`, F = (E) => {
      const h = Math.round(E * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, D = (E) => Math.round(E * 100) > 0 ? "up" : Math.round(E * 100) < 0 ? "down" : "flat", de = (E) => E >= 6e4 ? `${Math.floor(E / 6e4)}m ${Math.round(E % 6e4 / 1e3)}s` : `${(E / 1e3).toFixed(1)}s`, ke = (E) => E == null || E === "" ? "—" : typeof E == "string" ? E : Array.isArray(E) && E.every((h) => typeof h != "object") ? E.join(", ") : JSON.stringify(E), le = (E) => E ? E.failed ? "fail" : E.score >= 0.999 ? "pass" : E.score > 0 ? "partial" : "fail" : "none", oe = (E) => (E.results ?? []).filter((h) => h.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (E, h) => (a(), n("div", Si, [
      t("section", Ei, [
        t("div", qi, [
          t("div", null, [
            t("h2", Ui, "Evaluate revision " + i(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), n("p", Ni, [
              p(m(L), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = M("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : g("", !0)
          ]),
          p(m(ue), {
            label: C.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!C.value,
            disabled: !e.cases.length || !e.fields.length || !!C.value || e.starting,
            onClick: h[0] || (h[0] = (x) => c("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        V.value && !m(je)(V.value) ? (a(), n("div", Mi, [
          t("span", Ai, [
            t("span", {
              style: qe({ width: I(w.value.total ? w.value.done / w.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ri, i(fe[V.value.status]) + " · " + i(w.value.done) + " of " + i(w.value.total) + " cases", 1)
        ])) : g("", !0)
      ]),
      V.value && m(je)(V.value) ? (a(), n(A, { key: 0 }, [
        V.value.error ? (a(), n("p", {
          key: 0,
          class: Q(V.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          p(m(L), { icon: "tabler:alert-triangle" }),
          M(i(V.value.error), 1)
        ], 2)) : g("", !0),
        t("div", Bi, [
          t("div", Li, [
            t("span", Ti, "Accuracy · revision " + i(V.value.config_revision), 1),
            t("span", Pi, i(I(m(Ce)(V.value))), 1),
            v.value ? (a(), n("span", {
              key: 0,
              class: Q(["stat-delta", D(m(Ce)(V.value) - m(Ce)(v.value))])
            }, i(F(m(Ce)(V.value) - m(Ce)(v.value))) + " vs revision " + i(v.value.config_revision), 3)) : g("", !0)
          ]),
          t("div", Di, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Oi, [
              M(i(oe(V.value)), 1),
              t("small", null, " / " + i(V.value.case_count), 1)
            ]),
            t("span", Fi, i((V.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + i((V.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Ii, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", ji, i(V.value.tokens.toLocaleString()), 1),
            v.value ? (a(), n("span", zi, i(v.value.tokens.toLocaleString()) + " before", 1)) : g("", !0)
          ]),
          t("div", Wi, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Gi, i(de(V.value.duration_ms)), 1),
            v.value ? (a(), n("span", Ki, i(de(v.value.duration_ms)) + " before", 1)) : g("", !0)
          ])
        ]),
        t("section", Hi, [
          t("header", Qi, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            b.value.length > 1 ? (a(), n("label", Ji, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: v.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => s.value = x.target.value)
              }, [
                (a(!0), n(A, null, z(b.value.filter((x) => x.id !== V.value.id), (x) => (a(), n("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + i(x.config_revision) + " · " + i(m(He)(x.created_at)), 9, Xi))), 128))
              ], 40, Yi)
            ])) : g("", !0)
          ]),
          R.value.length ? (a(), n("div", _i, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!v.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  v.value ? (a(), n("th", ed, "Revision " + i(v.value.config_revision), 1)) : g("", !0),
                  v.value ? (a(), n("th", td, "Change")) : g("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), n(A, null, z(R.value, (x) => (a(), n("tr", {
                  key: x.field
                }, [
                  t("td", ld, i(x.field), 1),
                  t("td", null, [
                    t("span", ad, [
                      t("span", nd, [
                        t("span", {
                          style: qe({ width: I(x.accuracy) })
                        }, null, 4)
                      ]),
                      M(i(I(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", sd, i(I(x.verified)), 1),
                  v.value ? (a(), n("td", od, i(x.before ? I(x.before.accuracy) : "—"), 1)) : g("", !0),
                  v.value ? (a(), n("td", id, [
                    x.before ? (a(), n("span", {
                      key: 0,
                      class: Q(["trend", D(x.accuracy - x.before.accuracy)])
                    }, [
                      p(m(L), {
                        icon: D(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : D(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      M(i(F(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (a(), n("span", dd, "New field"))
                  ])) : g("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), n("p", Zi, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : g("", !0),
      V.value?.results?.length ? (a(), n("section", ud, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", rd, [
          t("table", cd, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (a(!0), n(A, null, z(O.value, (x) => (a(), n("th", {
                  key: x,
                  class: "mono"
                }, i(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), n(A, null, z(V.value.results, (x) => (a(), n(A, {
                key: x.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: K.value === x.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": K.value === x.case_id,
                      onClick: (P) => K.value = K.value === x.case_id ? void 0 : x.case_id
                    }, [
                      p(m(L), {
                        icon: K.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      M(i(x.upload_name), 1)
                    ], 8, vd),
                    x.status === "partial" ? (a(), n("span", md, "Partial")) : g("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (a(), n("td", {
                    key: 0,
                    colspan: O.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (a(), n("span", bd, [
                      p(m(L), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = M("Waiting", -1))
                    ])) : (a(), n("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      p(m(L), { icon: "tabler:alert-triangle" }),
                      M(i(x.error?.message), 1)
                    ], 8, fd))
                  ], 8, pd)) : (a(!0), n(A, { key: 1 }, z(O.value, (P) => (a(), n("td", {
                    key: P,
                    "data-label": P
                  }, [
                    t("span", {
                      class: Q(["cell", le(T(x, P))]),
                      title: ke(T(x, P)?.value)
                    }, i(T(x, P)?.failed ? "Failed" : T(x, P) ? I(T(x, P).score) : "—"), 11, hd)
                  ], 8, gd))), 128))
                ], 2),
                K.value === x.case_id ? (a(), n("tr", yd, [
                  t("td", {
                    colspan: O.value.length + 1
                  }, [
                    x.error ? (a(), n("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, i(x.error.message), 9, xd)) : g("", !0),
                    p(Re, {
                      node: m(Te)(x.scores.map((P) => P.field))
                    }, {
                      default: me(({ index: P }) => [
                        (a(!0), n(A, null, z([x.scores[P]], (j) => (a(), n("dl", {
                          key: j.field,
                          class: "compare"
                        }, [
                          t("dt", $d, i(j.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(j)])
                            }, i(j.failed ? "Failed" : I(j.score)), 3),
                            t("div", wd, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              p(Be, {
                                value: j.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", Vd, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              j.failed ? (a(), J(Mt, {
                                key: 0,
                                error: j.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: j.value
                              }, null, 8, ["value"]))
                            ]),
                            !j.failed || j.verification ? (a(), n("span", Cd, [
                              j.failed ? g("", !0) : (a(), n("span", {
                                key: 0,
                                class: Q(["chip", j.verified ? "primary" : "warn"])
                              }, [
                                p(m(L), {
                                  icon: j.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                M(i(j.verified ? "Verified" : "Unverified"), 1)
                              ], 2)),
                              j.verification ? (a(), n("span", Sd, i(m(Nt)(j.verification)), 1)) : g("", !0)
                            ])) : g("", !0)
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Ed, i(x.tokens.toLocaleString()) + " tokens · " + i(de(x.duration_ms)), 1)
                  ], 8, kd)
                ])) : g("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : g("", !0),
      t("section", qd, [
        t("header", Ud, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", Nd, i(e.cases.length), 1),
          p(m(ue), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: h[2] || (h[2] = (x) => d.value = !d.value)
          }, null, 8, ["disabled"])
        ]),
        d.value ? (a(), n("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(S, ["prevent"])
        }, [
          t("label", null, [
            h[21] || (h[21] = M("Document", -1)),
            p(Ut, {
              value: f.value,
              onSelect: h[3] || (h[3] = (x) => {
                f.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          p(Re, { node: U.value }, {
            default: me(({ index: x }) => [
              (a(!0), n(A, null, z([e.fields[x]], (P) => (a(), n("label", {
                key: m(H)(P)
              }, [
                t("span", Md, i(P.name), 1),
                P.type === "boolean" ? W((a(), n("select", {
                  key: 0,
                  "onUpdate:modelValue": (j) => y.value[m(H)(P)] = j
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Ad)), [
                  [ze, y.value[m(H)(P)]]
                ]) : P.type === "enum" ? W((a(), n("select", {
                  key: 1,
                  "onUpdate:modelValue": (j) => y.value[m(H)(P)] = j
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), n(A, null, z(P.enum_values, (j) => (a(), n("option", { key: j }, i(j), 1))), 128))
                ], 8, Rd)), [
                  [ze, y.value[m(H)(P)]]
                ]) : P.type === "object" || P.type === "list" ? W((a(), n("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (j) => y.value[m(H)(P)] = j,
                  rows: "2",
                  placeholder: P.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Bd)), [
                  [_, y.value[m(H)(P)]]
                ]) : W((a(), n("input", {
                  key: 3,
                  "onUpdate:modelValue": (j) => y.value[m(H)(P)] = j,
                  type: P.type === "number" ? "number" : P.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Ld)), [
                  [nl, y.value[m(H)(P)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          u.value ? (a(), n("p", Td, i(u.value), 1)) : g("", !0),
          t("div", Pd, [
            p(m(ue), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !f.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            p(m(ue), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: h[4] || (h[4] = (x) => d.value = !1)
            })
          ])
        ], 32)) : g("", !0),
        e.fields.length ? !e.cases.length && !d.value ? (a(), n("p", Od, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), n("div", Fd, [
          t("table", Id, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), n(A, null, z(e.cases, (x) => (a(), n("tr", {
                key: x.id
              }, [
                t("td", null, [
                  p(m(L), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  M(" " + i(x.upload_name), 1)
                ]),
                t("td", null, [
                  p(Re, { node: U.value }, {
                    default: me(({ index: P }) => [
                      t("div", jd, [
                        t("strong", null, i(e.fields[P].name), 1),
                        m(lt)(x.expected, m(H)(e.fields[P])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: m(lt)(x.expected, m(H)(e.fields[P]))
                        }, null, 8, ["value"])) : (a(), n("span", zd, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Wd, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (P) => c("delete-case", x.id)
                  }, [
                    p(m(L), { icon: "tabler:trash" })
                  ], 8, Gd)
                ])
              ]))), 128))
            ])
          ])
        ])) : g("", !0) : (a(), n("p", Dd, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), n("section", Kd, [
        t("header", Hd, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", Qd, i(e.evaluations.length), 1)
        ]),
        t("ul", Jd, [
          (a(!0), n(A, null, z(e.evaluations, (x) => (a(), n("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: V.value?.id === x.id }),
              "aria-current": V.value?.id === x.id,
              onClick: (P) => c("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, i(fe[x.status]), 9, Xd),
              t("span", null, "Revision " + i(x.config_revision), 1),
              t("span", Zd, i(m(He)(x.created_at)), 1),
              t("strong", _d, i(x.status === "completed" || x.status === "partial" ? I(m(Ce)(x)) : "—"), 1)
            ], 10, Yd)
          ]))), 128))
        ])
      ])) : g("", !0)
    ]));
  }
}), tu = { class: "section-head" }, lu = { class: "muted" }, au = {
  key: 0,
  class: "empty"
}, nu = {
  key: 1,
  class: "table-scroll"
}, su = { class: "metric-table runs-table" }, ou = ["aria-label", "aria-expanded", "onClick"], iu = { class: "caller" }, du = {
  key: 0,
  class: "muted"
}, uu = ["data-status"], ru = {
  class: "num",
  "data-label": "Time"
}, cu = {
  class: "num",
  "data-label": "Tokens"
}, vu = {
  class: "muted",
  "data-label": "Expires"
}, mu = {
  key: 0,
  class: "result-detail"
}, pu = { colspan: "6" }, bu = /* @__PURE__ */ G({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const o = B(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (c, d) => (a(), n(A, null, [
      t("div", tu, [
        d[0] || (d[0] = t("h2", null, "Recent runs", -1)),
        t("span", lu, "Runs expire after " + i(e.retention), 1)
      ]),
      e.runs.length ? (a(), n("div", nu, [
        t("table", su, [
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
            (a(!0), n(A, null, z(e.runs, (f) => (a(), n(A, {
              key: f.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${f.id}`,
                    "aria-expanded": o.value === f.id,
                    onClick: (y) => o.value = o.value === f.id ? void 0 : f.id
                  }, [
                    p(m(L), {
                      icon: o.value === f.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    M(i(m(He)(f.created_at)), 1)
                  ], 8, ou)
                ]),
                t("td", null, [
                  t("span", iu, [
                    p(m(L), {
                      icon: l[f.caller].icon
                    }, null, 8, ["icon"]),
                    M(i(l[f.caller].label), 1)
                  ]),
                  f.result.page_range ? (a(), n("span", du, " · Pages " + i(f.result.page_range.first) + "–" + i(f.result.page_range.last), 1)) : g("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": f.status
                  }, i(f.status === "completed" ? "Completed" : f.status === "partial" ? "Partial" : "Failed"), 9, uu)
                ]),
                t("td", ru, i((f.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", cu, i(Number(f.tokens).toLocaleString()), 1),
                t("td", vu, i(m(He)(f.expires_at)), 1)
              ]),
              o.value === f.id ? (a(), n("tr", mu, [
                t("td", pu, [
                  p(At, {
                    fields: f.result.fields,
                    "page-range": f.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : g("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), n("p", au, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), fu = {
  key: 0,
  role: "alert",
  class: "error banner"
}, gu = /* @__PURE__ */ G({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(), f = B("");
    return Ue(async () => {
      try {
        await Je("kickside-share", { timeoutMs: 8e3 });
      } catch ($) {
        f.value = `Sharing is unavailable: ${$ instanceof Error ? $.message : String($)}`;
        return;
      }
      const y = document.createElement("kickside-share"), u = encodeURIComponent(l.id);
      y.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${u}`, share_url: `/api/v1/component-access/share/${u}` })), y.style.display = "block", y.addEventListener("close", () => c("close")), d.value?.appendChild(y);
    }), (y, u) => (a(), n("div", {
      ref_key: "host",
      ref: d
    }, [
      f.value ? (a(), n("p", fu, i(f.value), 1)) : g("", !0)
    ], 512));
  }
}), hu = { class: "docscout" }, yu = { class: "toolbar" }, ku = { class: "toolbar-lead" }, xu = { class: "crumb-row" }, $u = { class: "crumb" }, wu = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Vu = ["id", "aria-selected", "aria-controls", "onClick"], Cu = { class: "toolbar-side" }, Su = { class: "stats" }, Eu = ["title"], qu = {
  key: 2,
  class: "unsaved"
}, Uu = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, Nu = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Mu = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Au = ["id", "aria-labelledby"], Ru = /* @__PURE__ */ G({
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
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(), f = B(!1), y = B("Builder"), u = B(ht()), $ = B(""), S = B(""), C = N(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    be(y, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const b = B(), V = B(), w = N(() => l.snapshot.can_edit && b.value !== l.snapshot.expected_revision), s = N(() => w.value && V.value !== l.snapshot.expected_revision);
    function v(I) {
      return $.value === I.title && S.value === (I.description ?? "") && kl(u.value, I.config);
    }
    function R() {
      const I = l.snapshot;
      u.value = structuredClone(_e(I.config ?? ht())), $.value = I.title, S.value = I.description ?? "", b.value = I.expected_revision, V.value = void 0;
    }
    be(() => l.snapshot, (I, F) => {
      C.value.includes(y.value) || (y.value = C.value[0]), !(F && I.id === F.id && I.can_edit && F.can_edit && !v(F) && !v(I)) && R();
    }, { immediate: !0 });
    const O = N(() => l.snapshot.can_edit && !v(l.snapshot)), U = N(() => yl(u.value)), T = N(() => Object.keys(xe).filter((I) => Ge(u.value, I)).length);
    function K() {
      c("save", { title: $.value, description: S.value, config: structuredClone(_e(u.value)), expected_revision: b.value });
    }
    return (I, F) => (a(), n("main", hu, [
      t("div", yu, [
        t("div", ku, [
          t("span", xu, [
            e.back ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: F[0] || (F[0] = (D) => c("back"))
            }, [
              p(m(L), { icon: "tabler:arrow-left" })
            ])) : g("", !0),
            t("span", $u, i(e.snapshot.title), 1)
          ]),
          t("nav", wu, [
            (a(!0), n(A, null, z(C.value, (D) => (a(), n("button", {
              id: `tab-${D}`,
              key: D,
              role: "tab",
              "aria-selected": y.value === D,
              "aria-controls": `panel-${D}`,
              onClick: (de) => y.value = D
            }, i(D), 9, Vu))), 128))
          ])
        ]),
        t("div", Cu, [
          e.snapshot.can_share ? (a(), J(m(ue), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: F[1] || (F[1] = (D) => f.value = !0)
          }, {
            default: me(() => [
              p(m(L), { icon: "tabler:share" }),
              F[11] || (F[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : g("", !0),
          t("span", Su, [
            M(i(e.snapshot.field_count) + " " + i(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), n(A, { key: 0 }, [
              M(" · " + i(T.value) + " steps · revision " + i(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), n(A, { key: 1 }, [
              M(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), n(A, { key: 1 }, [
            w.value && !s.value ? (a(), J(m(ue), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: R
            })) : g("", !0),
            U.value ? (a(), n("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: U.value
            }, [
              p(m(L), { icon: "tabler:alert-circle" }),
              M(i(U.value), 1)
            ], 8, Eu)) : O.value ? (a(), n("span", qu, "Unsaved")) : g("", !0),
            p(m(ue), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !O.value || !!U.value || !$.value.trim(),
              onClick: K
            }, null, 8, ["loading", "disabled"])
          ], 64)) : g("", !0)
        ])
      ]),
      s.value ? (a(), n("div", Uu, [
        t("span", null, "Saved configuration changed to revision " + i(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        p(m(ue), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: R
        }),
        p(m(ue), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: F[2] || (F[2] = (D) => V.value = e.snapshot.expected_revision)
        })
      ])) : g("", !0),
      e.error ? (a(), n("p", Nu, i(e.error), 1)) : g("", !0),
      f.value ? (a(), J(gu, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: F[3] || (F[3] = (D) => f.value = !1)
      }, null, 8, ["id", "title"])) : g("", !0),
      y.value === "Builder" && e.snapshot.can_edit ? (a(), n("div", Mu, [
        p(Lo, {
          title: $.value,
          "onUpdate:title": F[4] || (F[4] = (D) => $.value = D),
          description: S.value,
          "onUpdate:description": F[5] || (F[5] = (D) => S.value = D),
          config: u.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (a(), n("div", {
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
          y.value === "Test" ? (a(), J(Ci, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: F[6] || (F[6] = (D) => c("run", D))
          }, null, 8, ["result", "retention", "running", "can-run"])) : g("", !0),
          y.value === "Evals" && e.snapshot.can_edit ? (a(), J(eu, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: O.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: F[7] || (F[7] = (D) => c("add-case", D)),
            onDeleteCase: F[8] || (F[8] = (D) => c("delete-case", D)),
            onEvaluate: F[9] || (F[9] = (D) => c("evaluate")),
            onOpen: F[10] || (F[10] = (D) => c("open-evaluation", D))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : g("", !0),
          y.value === "Runs" ? (a(), J(bu, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : g("", !0)
        ], 8, Au)
      ], 512))
    ]));
  }
}), Bu = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Lu = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Wu = /* @__PURE__ */ G({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: o }) {
    const l = e, c = o, d = B(), f = B(""), y = B(!1), u = B(!1), $ = B(!1), S = B(), C = B(null), b = B([]), V = B();
    let w = [], s = 0, v = 0, R = 0, O;
    const U = (E) => E instanceof Error ? E.message : String(E), T = (E) => E === s;
    async function K(E, h) {
      const x = ++R;
      h && (O = h);
      const P = () => T(E) && x === R;
      try {
        const j = l.id, Ne = await he.evaluations(j);
        if (!P()) return;
        b.value = Ne;
        const ge = O ?? Ne[0]?.id;
        if (ge) {
          const Pe = await he.evaluation(j, ge);
          if (!P() || Pe.id !== (O ?? ge)) return;
          V.value = Pe;
        }
      } catch (j) {
        P() && (f.value = U(j));
      }
    }
    async function I(E) {
      const h = ++v, x = () => T(E) && h === v;
      if (!l.id) {
        f.value = "No extractor selected.";
        return;
      }
      try {
        const P = await he.get(l.id);
        if (!x()) return;
        d.value = P, f.value = "", P.can_edit && await K(E);
      } catch (P) {
        x() && (f.value = U(P));
      }
    }
    be(() => l.id, (E, h) => {
      s++, O = void 0, w.forEach((P) => P()), w = [], S.value = void 0, d.value = void 0, C.value = null, b.value = [], V.value = void 0, f.value = "";
      const x = s;
      l.id && (w = [ft(`component.${l.id}`, () => I(x)), ft(`docscout.runs.${l.id}`, () => I(x))]), h !== void 0 && I(x);
    }, { immediate: !0 }), sl(() => I(s)), kt(() => {
      s++, w.forEach((E) => E());
    });
    async function F(E) {
      const h = s;
      y.value = !0, f.value = "";
      try {
        const x = await E();
        if (T(h))
          return await I(h), x;
      } catch (x) {
        T(h) && (f.value = U(x));
      } finally {
        y.value = !1;
      }
    }
    const D = (E) => F(() => he.update(l.id, E));
    async function de(E) {
      const h = s, x = await F(() => he.addCase(l.id, E));
      x && T(h) && (S.value = x.id);
    }
    const ke = (E) => F(() => he.deleteCase(l.id, E));
    async function le(E) {
      const h = s;
      u.value = !0, f.value = "";
      try {
        const x = await he.run(l.id, E);
        T(h) && (C.value = x, await I(h));
      } catch (x) {
        if (T(h)) {
          const P = x?.response?.data?.error;
          f.value = d.value?.config?.stages.extract.reads === "pages" && P ? P : U(x);
        }
      } finally {
        u.value = !1;
      }
    }
    async function oe() {
      const E = s;
      $.value = !0, f.value = "";
      try {
        const { eval_id: h } = await he.evaluate(l.id);
        T(E) && await K(E, h);
      } catch (h) {
        T(E) && (f.value = U(h));
      } finally {
        $.value = !1;
      }
    }
    function fe(E) {
      K(s, E);
    }
    return (E, h) => d.value ? (a(), J(Ru, {
      key: 0,
      snapshot: d.value,
      "added-case-id": S.value,
      saving: y.value,
      running: u.value,
      starting: $.value,
      result: C.value,
      evaluations: b.value,
      evaluation: V.value,
      error: f.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => c("back")),
      onRun: le,
      onSave: D,
      onAddCase: de,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : f.value ? (a(), n("p", Bu, i(f.value), 1)) : (a(), n("p", Lu, "Loading Docscout…"));
  }
});
export {
  Wu as _,
  He as w
};
