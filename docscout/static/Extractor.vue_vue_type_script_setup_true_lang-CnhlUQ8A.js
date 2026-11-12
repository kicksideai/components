import { defineComponent as G, useModel as Le, openBlock as a, createElementBlock as n, withModifiers as ve, createElementVNode as t, mergeModels as Qe, computed as M, withKeys as Ee, unref as p, normalizeClass as Q, createVNode as b, toDisplayString as o, Fragment as A, renderList as O, createCommentVNode as h, createTextVNode as N, createBlock as J, ref as R, useId as pe, watch as be, withDirectives as W, vModelText as _, vModelSelect as ze, resolveComponent as lt, renderSlot as Ie, withCtx as me, mergeProps as mt, vShow as We, onMounted as Ue, nextTick as Se, normalizeStyle as qe, onBeforeUnmount as kt, vModelDynamic as nl, toRaw as pt } from "vue";
import { b as sl } from "./wc-runtime-DUvG5Zds.js";
import { loadByTagName as Je, on as bt } from "@wippy-fe/proxy";
import { i as Ge, f as xt, t as _e, s as xe, a as at, b as ol, m as $t, d as H, M as Ae, e as wt, g as Vt, h as et, j as il, k as dl, l as ul, o as rl, p as cl, q as Ct, r as vl, u as ml, v as pl, w as bl, x as ft, y as fl, z as Xe, A as gl, B as Te, C as hl, D as gt, n as ht, E as yl, F as kl, c as he } from "./config-uWC4TI7Z.js";
import ue from "primevue/button";
import { Icon as B } from "@iconify/vue";
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
    const i = Le(e, "modelValue");
    return (l, v) => (a(), n("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": i.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: v[0] || (v[0] = ve((u) => i.value = !i.value, ["stop"]))
    }, [...v[1] || (v[1] = [
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = M(() => Ge(l.config, l.stage)), f = M(() => l.config.stages[l.stage].model), k = M({ get: () => u.value, set: (q) => {
      l.config.stages[l.stage].enabled = q;
    } }), r = M(() => {
      const q = l.config, C = q.stages;
      switch (l.stage) {
        case "map":
          return q.fields.filter((m) => m.search_within === "sections").map((m) => ({ text: m.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...C.prefetch.queries.map((m) => ({ text: m.name || "Untitled query", tone: "" })), ...q.fields.filter((m) => m.search_hints.trim()).map((m) => ({ text: m.name, tone: "hint" }))];
        case "scout":
          return C.scout.mode === "agent" ? C.scout.tools.map((m) => ({ text: _e(m).toLowerCase(), tone: "" })) : [];
        case "deep":
          return q.fields.filter((m) => m.strategy === "deep").map((m) => ({ text: m.name || "New field", tone: "primary" }));
        case "extract":
          return xt(q).map((m) => ({ text: `${m.name} · ${m.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), w = (q) => [`${(q.duration_ms / 1e3).toFixed(1)}s`, `${(q.input_tokens + q.output_tokens).toLocaleString()} tokens`, q.queries?.length ? `${q.queries.length} queries` : "", q.message ?? ""].filter(Boolean).join(" · ");
    return (q, C) => (a(), n("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": p(xe)[e.stage],
      onClick: C[1] || (C[1] = (m) => v("select")),
      onKeydown: [
        C[2] || (C[2] = Ee((m) => v("select"), ["enter"])),
        C[3] || (C[3] = Ee(ve((m) => v("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", Vl, [
        b(p(B), {
          icon: p(at)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Cl, [
        t("span", Sl, o(p(xe)[e.stage]), 1),
        t("span", El, o(u.value ? p(ol)(e.stage, e.config) : "Off"), 1),
        u.value && r.value.length ? (a(), n("span", ql, [
          (a(!0), n(A, null, O(r.value, (m) => (a(), n("span", {
            key: m.text,
            class: Q(["chip", { primary: m.tone === "primary", "muted-chip": m.tone === "hint" }])
          }, o(m.text), 3))), 128))
        ])) : h("", !0),
        e.trace ? (a(), n("span", Ul, [
          b(p(B), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          N(o(w(e.trace)), 1)
        ])) : h("", !0)
      ]),
      t("span", Nl, [
        u.value && f.value ? (a(), n("span", Ml, o(p($t)(f.value)), 1)) : h("", !0),
        e.stage !== "extract" && !e.readonly ? (a(), J(Z, {
          key: 1,
          modelValue: k.value,
          "onUpdate:modelValue": C[0] || (C[0] = (m) => k.value = m),
          label: `Enable ${p(xe)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : h("", !0)
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
    const i = e, l = Le(e, "modelValue"), v = R([]);
    function u(f, k) {
      const r = i.options.length - 1, w = { ArrowRight: k + 1, ArrowDown: k + 1, ArrowLeft: k - 1, ArrowUp: k - 1, Home: 0, End: r }[f.key];
      if (w === void 0) return;
      f.preventDefault();
      const q = (w + i.options.length) % i.options.length;
      l.value = i.options[q].value, v.value[q]?.focus();
    }
    return (f, k) => (a(), n("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (a(!0), n(A, null, O(e.options, (r, w) => (a(), n("button", {
        key: r.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: v,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${r.label}` : void 0,
        "aria-checked": l.value === r.value,
        tabindex: l.value === r.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (q) => l.value = r.value,
        onKeydown: (q) => u(q, w)
      }, [
        r.icon ? (a(), J(p(B), {
          key: 0,
          icon: r.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : h("", !0),
        t("span", null, o(r.label), 1)
      ], 40, Rl))), 128))
    ], 8, Al));
  }
}), ie = (e, i) => `${e}:${i.join("/")}`, Et = [
  { value: "text", label: "Text", icon: "tabler:typography" },
  { value: "number", label: "Number", icon: "tabler:123" },
  { value: "boolean", label: "Yes / no", icon: "tabler:toggle-right" },
  { value: "date", label: "Date", icon: "tabler:calendar" },
  { value: "enum", label: "One of a set", icon: "tabler:list-details" },
  { value: "list", label: "List", icon: "tabler:brackets" },
  { value: "object", label: "Object", icon: "tabler:braces" }
], Bl = (e) => Et.find((i) => i.value === e).icon;
function Ke(e) {
  const i = [];
  function l(v, u, f, k) {
    i.push({ field: u, trail: f, shape: v, path: k, depth: f.length + 1, key: ie(u, f) }), v.properties?.forEach((r, w) => l(r, u, [...f, w], `${k}.${r.name || "New property"}`)), v.item && l(v.item, u, [...f, "item"], `${k}[]`);
  }
  return e.forEach((v, u) => l(v, u, [], H(v) || "New field")), i;
}
function tt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(tt), e.item ? tt(e.item) : 0);
}
function Ll(e, i) {
  return Ke(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === i.field && ie(l.field, l.trail) === ie(i.field, i.trail.slice(0, -1))) && l.depth + tt(i.shape) <= Ae && !(l.field === i.field && i.trail.every((v, u) => l.trail[u] === v)));
}
function Tl(e, i, l) {
  const v = { ...Vt(), ...i.shape, name: i.shape.name };
  i.trail.length ? Ke(e).find((k) => k.key === ie(i.field, i.trail.slice(0, -1))).shape.properties.splice(i.trail.at(-1), 1) : e.splice(i.field, 1);
  let u;
  if (l) {
    const { name: f, type: k, description: r, enum_values: w, expected_format: q, required: C, properties: m, item: $ } = v;
    u = { name: f, type: k, description: r, enum_values: w, expected_format: q, required: C, ...m ? { properties: m } : {}, ...$ ? { item: $ } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...et(), ...v, group: "" }, e.push(u), u = e.at(-1);
  return Ke(e).find((f) => f.shape === u);
}
function yt(e, i = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((f) => [f.name || "unnamed", l(f)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : i ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
  }
  const v = {};
  return e.forEach((u) => wt(v, H(u) || "unnamed", l(u))), v;
}
const Pl = { class: "shape-editor" }, Dl = { key: 0 }, Fl = ["aria-label", "aria-invalid", "aria-describedby"], Il = { class: "label-block" }, Ol = ["id"], jl = { key: 0 }, zl = ["id"], Wl = {
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
}, _l = { class: "muted" }, ea = ["aria-label", "disabled"], ta = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = M(() => l.shape), f = M(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), k = M(() => Et.filter((s) => l.depth < Ae || !["object", "list"].includes(s.value))), r = M({ get: () => l.shape.type, set: (s) => {
      l.shape.type = s, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], s === "object" && (l.shape.properties = []), s === "list" && (l.shape.item = il());
    } }), w = pe(), q = pe(), C = R(""), m = R("");
    be(() => l.shape, () => {
      C.value = "", m.value = "";
    });
    const $ = M(() => l.validationError || (l.named ? dl(u.value.name, l.siblingNames) : "") || ul(l.shape, l.depth));
    function V() {
      const s = C.value.trim(), d = l.shape.enum_values ?? [];
      if (!s || s.length > 200) {
        m.value = "Enter 1 to 200 characters.";
        return;
      }
      if (d.includes(s)) {
        m.value = "This value already exists.";
        return;
      }
      if (d.length >= 100) {
        m.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...d, s], C.value = "", m.value = "";
    }
    return (s, d) => (a(), n("div", Pl, [
      e.named ? (a(), n("label", Dl, [
        d[8] || (d[8] = N("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": d[0] || (d[0] = (U) => u.value.name = U),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!$.value,
          "aria-describedby": $.value ? p(q) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, Fl), [
          [
            _,
            u.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : h("", !0),
      t("div", Il, [
        t("span", { id: p(w) }, o(e.named ? "Data type" : "Item type"), 9, Ol),
        b(ye, {
          modelValue: r.value,
          "onUpdate:modelValue": d[1] || (d[1] = (U) => r.value = U),
          class: "type-picker",
          options: k.value,
          "labelled-by": p(w),
          name: f.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === p(Ae) ? (a(), n("small", jl, "Level four · choose a value type.")) : h("", !0)
      ]),
      $.value ? (a(), n("p", {
        key: 1,
        id: p(q),
        class: "field-error",
        role: "alert"
      }, o($.value), 9, zl)) : h("", !0),
      p(rl)(e.shape, e.named) ? (a(), n("div", Wl, [
        t("span", null, o(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", Gl, [
          (a(!0), n(A, null, O(e.shape.enum_values, (U, z) => (a(), n("span", {
            key: U,
            class: "chip primary"
          }, [
            N(o(U), 1),
            e.readonly ? h("", !0) : (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${U}`,
              onClick: (I) => e.shape.enum_values.splice(z, 1)
            }, [
              b(p(B), { icon: "tabler:x" })
            ], 8, Kl))
          ]))), 128))
        ]),
        e.readonly ? h("", !0) : (a(), n("div", Hl, [
          W(t("input", {
            "onUpdate:modelValue": d[2] || (d[2] = (U) => C.value = U),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(V, ["prevent"]), ["enter"])
          }, null, 40, Ql), [
            [_, C.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: V
          }, "Add")
        ])),
        m.value ? (a(), n("p", Jl, o(m.value), 1)) : h("", !0)
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
      ["boolean", "enum"].includes(e.shape.type) ? h("", !0) : (a(), n("label", Yl, [
        d[10] || (d[10] = N("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": d[4] || (d[4] = (U) => e.shape.expected_format = U),
          maxlength: "400",
          placeholder: p(cl)(e.shape)
        }, null, 8, Xl), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (a(), n("div", Zl, [
        d[11] || (d[11] = t("span", null, "Required", -1)),
        b(Z, {
          modelValue: u.value.required,
          "onUpdate:modelValue": d[5] || (d[5] = (U) => u.value.required = U),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : h("", !0),
      e.shape.type === "object" ? (a(), n(A, { key: 5 }, [
        t("p", _l, o(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < p(Ae) ? (a(), n("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: d[6] || (d[6] = (U) => v("add"))
        }, [
          b(p(B), { icon: "tabler:plus" }),
          d[12] || (d[12] = N("Add property", -1))
        ], 8, ea)) : h("", !0)
      ], 64)) : h("", !0),
      e.shape.type === "list" && e.shape.item ? (a(), n("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: d[7] || (d[7] = (U) => v("selectItem"))
      }, [
        b(p(B), { icon: "tabler:brackets" }),
        N("Edit item shape · " + o(e.shape.item.type), 1)
      ])) : h("", !0)
    ]));
  }
}), la = ["disabled"], aa = { class: "grid" }, na = { class: "context-stepper" }, sa = ["disabled"], oa = ["disabled"], ia = {
  key: 0,
  class: "field-note"
}, da = { class: "label-block" }, ua = {
  key: 1,
  class: "field-error"
}, ra = { id: "docscout-groups" }, ca = ["value"], va = { class: "toggle-row" }, ma = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = M(() => !l.depth || l.depth === 1), f = M(() => Ct(l.field, l.otherNames));
    return (k, r) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      b(ta, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? f.value : void 0,
        readonly: e.readonly,
        onAdd: r[0] || (r[0] = (w) => v("add")),
        onSelectItem: r[1] || (r[1] = (w) => v("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (a(), n(A, { key: 0 }, [
        r[25] || (r[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          r[12] || (r[12] = N("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": r[2] || (r[2] = (w) => e.field.search_hints = w),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          r[13] || (r[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", aa, [
          t("label", null, [
            r[15] || (r[15] = N("Strategy", -1)),
            W(t("select", {
              "onUpdate:modelValue": r[3] || (r[3] = (w) => e.field.strategy = w)
            }, [...r[14] || (r[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [ze, e.field.strategy]
            ])
          ]),
          t("label", null, [
            r[16] || (r[16] = N("Chunks to read", -1)),
            t("span", na, [
              W(t("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (w) => e.field.chunks = w),
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
                onClick: r[5] || (r[5] = (w) => e.field.chunks--)
              }, "−", 8, sa),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: r[6] || (r[6] = (w) => e.field.chunks++)
              }, "+", 8, oa)
            ]),
            r[17] || (r[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (a(), n("p", ia, [
          b(p(B), { icon: "tabler:info-circle" }),
          r[18] || (r[18] = N("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : h("", !0),
        t("div", da, [
          r[19] || (r[19] = t("span", { id: "within-label" }, "Search within", -1)),
          b(ye, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": r[7] || (r[7] = (w) => e.field.search_within = w),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, o(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (a(), n("p", ua, [
          b(p(B), { icon: "tabler:alert-circle" }),
          r[20] || (r[20] = N("Turn on Map the document to read sections.", -1))
        ])) : h("", !0),
        t("label", null, [
          r[21] || (r[21] = N("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (w) => e.field.group = w),
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
          t("datalist", ra, [
            (a(!0), n(A, null, O(e.groups, (w) => (a(), n("option", {
              key: w,
              value: w
            }, null, 8, ca))), 128))
          ]),
          r[22] || (r[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        r[26] || (r[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          r[23] || (r[23] = N("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": r[9] || (r[9] = (w) => e.field.validation_hints = w),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", va, [
          r[24] || (r[24] = t("span", null, [
            N("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          b(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": r[10] || (r[10] = (w) => e.field.evidence_required = w),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : h("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (a(), n("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: r[11] || (r[11] = (w) => v("remove"))
      }, o(u.value ? "Remove field" : "Remove property"), 1)) : h("", !0)
    ], 8, la));
  }
}), pa = { class: "field-groups" }, ba = {
  key: 0,
  class: "rows"
}, fa = ["aria-label"], ga = { class: "field-group-head" }, ha = ["aria-label", "aria-expanded", "aria-controls", "onClick"], ya = { class: "group-title" }, ka = ["id"], xa = { class: "group-title" }, Re = /* @__PURE__ */ G({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const i = R(/* @__PURE__ */ new Set()), l = pe();
    function v(f) {
      i.value.has(f) ? i.value.delete(f) : i.value.add(f);
    }
    const u = (f) => f.indices.length + f.children.reduce((k, r) => k + u(r), 0);
    return (f, k) => {
      const r = lt("FieldGroups", !0);
      return a(), n("div", pa, [
        e.node.indices.length ? (a(), n("ul", ba, [
          (a(!0), n(A, null, O(e.node.indices, (w) => (a(), n("li", { key: w }, [
            Ie(f.$slots, "default", { index: w })
          ]))), 128))
        ])) : h("", !0),
        (a(!0), n(A, null, O(e.node.children, (w, q) => (a(), n("section", {
          key: w.path,
          class: "field-group",
          "aria-label": `Group ${w.path}`
        }, [
          t("header", ga, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${i.value.has(w.path) ? "Expand" : "Collapse"} group ${w.path}`,
              "aria-expanded": !i.value.has(w.path),
              "aria-controls": `${p(l)}-${w.path}`,
              onClick: (C) => v(w.path)
            }, [
              b(p(B), {
                icon: i.value.has(w.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, ha),
            Ie(f.$slots, "header", {
              path: w.path,
              label: w.name,
              count: u(w),
              first: q === 0,
              last: q === e.node.children.length - 1
            }, () => [
              t("span", ya, o(w.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${p(l)}-${w.path}`,
            class: "group-content"
          }, [
            b(r, { node: w }, {
              default: me((C) => [
                Ie(f.$slots, "default", mt({ ref_for: !0 }, C))
              ]),
              header: me((C) => [
                Ie(f.$slots, "header", mt({ ref_for: !0 }, C), () => [
                  t("span", xa, o(C.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, ka), [
            [We, !i.value.has(w.path)]
          ])
        ], 8, fa))), 128))
      ]);
    };
  }
}), $a = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], wa = ["aria-label", "title"], Va = ["aria-label", "title"], Ca = ["id"], qt = /* @__PURE__ */ G({
  __name: "GroupPathEditor",
  props: {
    initialValue: { default: "" },
    inputLabel: {},
    saveLabel: {},
    cancelLabel: {},
    maxLength: { default: 320 }
  },
  emits: ["save", "cancel"],
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(l.initialValue), f = R(""), k = R(), r = pe();
    Ue(() => {
      k.value.focus(), k.value.select();
    });
    function w() {
      const q = u.value.trim();
      if (!q || !vl.test(q)) {
        f.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (q.length > l.maxLength) {
        f.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      v("save", q);
    }
    return (q, C) => (a(), n("form", {
      class: "group-path-editor",
      onSubmit: ve(w, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: k,
        "onUpdate:modelValue": C[0] || (C[0] = (m) => u.value = m),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!f.value,
        "aria-describedby": f.value ? p(r) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(w, ["prevent"]), ["enter"]),
          C[1] || (C[1] = Ee(ve((m) => v("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, $a), [
        [_, u.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        b(p(B), { icon: "tabler:check" })
      ], 8, wa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: C[2] || (C[2] = (m) => v("cancel"))
      }, [
        b(p(B), { icon: "tabler:x" })
      ], 8, Va),
      f.value ? (a(), n("p", {
        key: 0,
        id: p(r),
        class: "field-error",
        role: "alert"
      }, o(f.value), 9, Ca)) : h("", !0)
    ], 32));
  }
}), Sa = ["title"], Ea = ["aria-label", "data-group-rename", "title"], qa = ["aria-label"], Ua = {
  key: 2,
  class: "group-actions"
}, Na = ["aria-label", "disabled"], Ma = ["aria-label", "aria-expanded", "aria-controls"], Aa = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(!1), f = R(!1), k = R(), r = R(), w = R(), q = pe(), C = M(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => v("remove") }
    ]);
    function m() {
      u.value = !0;
    }
    async function $() {
      u.value = !1, await Se(), r.value.focus();
    }
    async function V(s) {
      const d = k.value.closest(".field-tree");
      u.value = !1, v("rename", s), await Se(), d.querySelector(`[data-group-rename="${s}"]`).focus();
    }
    return (s, d) => (a(), n("div", {
      ref_key: "heading",
      ref: k,
      class: "group-heading"
    }, [
      u.value ? (a(), J(qt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: V,
        onCancel: $
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (a(), n(A, { key: 1 }, [
        e.readonly ? (a(), n("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, o(e.name), 9, Sa)) : (a(), n("button", {
          key: 1,
          ref_key: "renameButton",
          ref: r,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: m
        }, [
          t("span", null, o(e.name), 1),
          b(p(B), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ea)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, o(e.count), 9, qa),
        e.readonly ? h("", !0) : (a(), n("div", Ua, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: d[0] || (d[0] = (U) => v("add"))
          }, [
            b(p(B), { icon: "tabler:plus" })
          ], 8, Na),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": f.value,
            "aria-controls": p(q),
            onClick: d[1] || (d[1] = (U) => w.value.toggle(U))
          }, [
            b(p(B), { icon: "tabler:dots" })
          ], 8, Ma),
          b(p(St), {
            id: p(q),
            ref_key: "menu",
            ref: w,
            model: C.value,
            popup: "",
            "append-to": "self",
            onShow: d[2] || (d[2] = (U) => f.value = !0),
            onHide: d[3] || (d[3] = (U) => f.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Ra = ["aria-label", "aria-expanded"], Ba = {
  key: 1,
  class: "tree-indent"
}, La = ["aria-label", "aria-describedby", "aria-current"], Ta = { class: "row-copy" }, Pa = { class: "row-name" }, Da = ["title"], Fa = ["id", "title"], Ia = { class: "field-badges" }, Oa = { class: "chip field-type" }, ja = { class: "field-flags" }, za = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, Wa = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, Ga = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, Ka = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, Ha = {
  key: 2,
  class: "row-actions"
}, Qa = ["aria-label", "disabled"], Ja = ["aria-label", "disabled"], Ya = ["aria-label", "aria-expanded", "aria-controls"], Xa = {
  key: 0,
  class: "tree-children"
}, Za = { key: 0 }, _a = { key: 1 }, en = ["aria-label", "disabled"], tn = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = pe(), f = pe(), k = R(), r = R(!1), w = M(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", l.field, l.trail, 1) }
    ]), q = R(!0);
    be(() => l.selected, (d) => {
      const U = ie(l.field, l.trail);
      d !== U && d.startsWith(U + (l.trail.length ? "/" : "")) && (q.value = !0);
    });
    const C = M(() => l.trail.at(-1) !== "item"), m = M(() => C.value ? l.shape.name || "New field" : "Each item"), $ = M(() => l.trail.length ? void 0 : l.shape), V = M(() => l.shape.type === "object" || l.shape.type === "list");
    function s(d) {
      d.key === "ArrowRight" && V.value && (q.value = !0, d.preventDefault(), d.stopPropagation()), d.key === "ArrowLeft" && V.value && (q.value = !1, d.preventDefault(), d.stopPropagation());
    }
    return (d, U) => {
      const z = lt("ShapeTree", !0);
      return a(), n("div", {
        class: "shape-tree-node",
        onKeydown: s
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === p(ie)(e.field, e.trail) }])
        }, [
          V.value ? (a(), n("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${q.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": q.value,
            onClick: U[0] || (U[0] = (I) => q.value = !q.value)
          }, [
            b(p(B), {
              icon: q.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Ra)) : (a(), n("span", Ba)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": p(u),
            "aria-current": e.selected === p(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: U[1] || (U[1] = (I) => v("select", e.field, e.trail))
          }, [
            t("span", Ta, [
              t("span", Pa, [
                b(p(B), {
                  icon: p(Bl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: m.value
                }, o(m.value), 9, Da),
                e.error ? (a(), J(p(B), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : h("", !0)
              ]),
              t("span", {
                id: p(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, o(e.shape.description || "No description"), 11, Fa)
            ]),
            t("span", Ia, [
              t("span", Oa, o(e.shape.type), 1),
              t("span", ja, [
                C.value && e.shape.required ? (a(), n("span", za, [
                  b(p(B), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.strategy === "deep" ? (a(), n("span", Wa, [
                  b(p(B), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.search_within === "sections" ? (a(), n("span", Ga, [
                  b(p(B), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0),
                $.value?.evidence_required ? (a(), n("span", Ka, [
                  b(p(B), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : h("", !0)
              ])
            ])
          ], 8, La),
          !e.readonly && C.value ? (a(), n("span", Ha, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: U[2] || (U[2] = (I) => v("reorder", e.field, e.trail, -1))
            }, [
              b(p(B), { icon: "tabler:chevron-up" })
            ], 8, Qa),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: U[3] || (U[3] = (I) => v("reorder", e.field, e.trail, 1))
            }, [
              b(p(B), { icon: "tabler:chevron-down" })
            ], 8, Ja)
          ])) : h("", !0),
          !e.readonly && C.value ? (a(), n("div", {
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
              "aria-expanded": r.value,
              "aria-controls": p(f),
              onClick: U[4] || (U[4] = (I) => k.value.toggle(I))
            }, [
              b(p(B), { icon: "tabler:dots" })
            ], 8, Ya),
            b(p(St), {
              id: p(f),
              ref_key: "menu",
              ref: k,
              model: w.value,
              popup: "",
              "append-to": "self",
              onShow: U[5] || (U[5] = (I) => r.value = !0),
              onHide: U[6] || (U[6] = (I) => r.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : h("", !0)
        ], 2),
        V.value && q.value ? (a(), n("ul", Xa, [
          (a(!0), n(A, null, O(e.shape.properties, (I, j) => (a(), n("li", { key: j }, [
            b(z, {
              shape: I,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${I.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: U[8] || (U[8] = (K, D) => v("select", K, D)),
              onAdd: U[9] || (U[9] = (K, D) => v("add", K, D)),
              onReorder: U[10] || (U[10] = (K, D, P) => v("reorder", K, D, P))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (a(), n("li", Za, [
            b(z, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: U[11] || (U[11] = (I, j) => v("select", I, j)),
              onAdd: U[12] || (U[12] = (I, j) => v("add", I, j)),
              onReorder: U[13] || (U[13] = (I, j, K) => v("reorder", I, j, K))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : h("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < p(Ae) ? (a(), n("li", _a, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: U[14] || (U[14] = (I) => v("add", e.field, e.trail))
            }, [
              b(p(B), { icon: "tabler:plus" }),
              U[15] || (U[15] = N("Add property", -1))
            ], 8, en)
          ])) : h("", !0)
        ])) : h("", !0)
      ], 32);
    };
  }
}), ln = { class: "label-block" }, an = {
  key: 0,
  class: "muted"
}, nn = ["config"], sn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, on = {
  key: 3,
  role: "status",
  class: "muted picker-pending picker-pending--list"
}, dn = /* @__PURE__ */ G({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: i }) {
    const l = i, v = R(!!customElements.get("wc-agent-picker")), u = R("");
    Ue(async () => {
      if (!v.value)
        try {
          await Je("wc-agent-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          u.value = k instanceof Error ? k.message : String(k);
        }
    });
    function f(k) {
      if (k.composedPath()[0] !== k.currentTarget) return;
      const r = k.detail;
      l("select", r.agent_id);
    }
    return (k, r) => (a(), n("div", ln, [
      r[0] || (r[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (a(), n("p", an, o(e.value || "Built-in scout"), 1)) : v.value ? (a(), n("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: f
      }, null, 40, nn)) : u.value ? (a(), n("p", sn, "Could not load agent picker: " + o(u.value), 1)) : (a(), n("span", on, "Loading agents…")),
      r[1] || (r[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), un = ["value", "capability", "aria-labelledby"], rn = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, cn = {
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
  setup(e, { emit: i }) {
    const l = i, v = R(!!customElements.get("wc-model-picker")), u = R("");
    Ue(async () => {
      if (!v.value)
        try {
          await Je("wc-model-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          u.value = k instanceof Error ? k.message : String(k);
        }
    });
    function f(k) {
      const r = k.detail;
      typeof r == "string" && l("select", r);
    }
    return (k, r) => v.value ? (a(), n("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: f
    }, null, 40, un)) : u.value ? (a(), n("p", rn, "Could not load model picker: " + o(u.value), 1)) : (a(), n("span", cn, "Loading models…"));
  }
}), vn = { class: "slider" }, mn = { class: "slider-head" }, pn = { class: "slider-value" }, bn = ["aria-label", "aria-valuetext", "disabled"], fn = {
  key: 0,
  class: "slider-hints"
}, gn = { key: 1 }, Ve = 1e3, te = /* @__PURE__ */ G({
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
    const i = e, l = Le(e, "modelValue"), v = M(() => i.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${i.unit ? ` ${i.unit}` : ""}`), u = (r) => i.log ? Math.log(r / i.min) / Math.log(i.max / i.min) * Ve : (r - i.min) / (i.max - i.min) * Ve;
    function f(r) {
      const w = i.log ? i.min * Math.pow(i.max / i.min, r / Ve) : i.min + (i.max - i.min) * r / Ve, q = Math.round(w / i.step) * i.step;
      return Math.min(i.max, Math.max(i.min, Number(q.toFixed(4))));
    }
    const k = M({ get: () => Math.round(u(l.value)), set: (r) => {
      l.value = f(r);
    } });
    return (r, w) => (a(), n("div", vn, [
      t("div", mn, [
        t("span", null, o(e.label), 1),
        t("output", pn, o(v.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": w[0] || (w[0] = (q) => k.value = q),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": v.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${k.value / Ve * 100}%` })
      }, null, 12, bn), [
        [
          _,
          k.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (a(), n("div", fn, [
        t("span", null, o(e.hints[0]), 1),
        t("span", null, o(e.hints[1]), 1)
      ])) : h("", !0),
      e.note ? (a(), n("small", gn, o(e.note), 1)) : h("", !0)
    ]));
  }
}), hn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, yn = { class: "fd-track" }, kn = { class: "fd-node" }, xn = { class: "fd-dots" }, $n = { class: "fd-more" }, wn = { class: "fd-node goal" }, Vn = /* @__PURE__ */ G({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const i = e;
    return (l, v) => (a(), n("figure", hn, [
      t("div", yn, [
        v[2] || (v[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (a(!0), n(A, null, O(Math.min(i.rounds, 8), (u) => (a(), n(A, { key: u }, [
          v[0] || (v[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", kn, [
            t("span", null, "R" + o(u), 1),
            t("span", xn, [
              (a(!0), n(A, null, O(Math.min(i.extra, 6), (f) => (a(), n("i", { key: f }))), 128))
            ])
          ])
        ], 64))), 128)),
        i.rounds > 8 ? (a(), n(A, { key: 0 }, [
          v[1] || (v[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", $n, "+" + o(i.rounds - 8), 1)
        ], 64)) : h("", !0),
        v[3] || (v[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", wn, "≥ " + o(Math.round(i.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, o(i.rounds ? `One pass, then up to ${i.rounds} rounds with up to ${i.extra} new queries each, stopping as soon as confidence reaches ${Math.round(i.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Cn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Sn = { class: "fd-grid" }, En = { class: "fd-node solid" }, qn = { class: "fd-node" }, Un = { class: "fd-node" }, Nn = { class: "fd-node goal" }, Mn = /* @__PURE__ */ G({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const i = e, l = M(() => Math.min(i.queries * i.perQuery, i.cap));
    return (v, u) => (a(), n("figure", Cn, [
      t("div", Sn, [
        t("span", En, [
          t("b", null, o(e.fields), 1),
          N(" field" + o(e.fields === 1 ? "" : "s"), 1),
          t("small", null, o(e.parallel) + " at a time", 1)
        ]),
        t("span", qn, [
          t("b", null, o(e.queries), 1),
          u[0] || (u[0] = N(" queries", -1)),
          u[1] || (u[1] = t("small", null, "per field", -1))
        ]),
        t("span", Un, [
          t("b", null, o(e.perQuery), 1),
          u[2] || (u[2] = N(" chunks", -1)),
          u[3] || (u[3] = t("small", null, "per query", -1))
        ]),
        t("span", Nn, [
          t("b", null, o(l.value), 1),
          u[4] || (u[4] = N(" chunks", -1)),
          t("small", null, o(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + o(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), An = ["disabled"], Rn = { class: "muted" }, Bn = { class: "toggle-row" }, Ln = { class: "label-block" }, Tn = { class: "toggle-row" }, Pn = {
  id: "model-map",
  class: "model-role"
}, Dn = {
  key: 0,
  class: "chips"
}, Fn = {
  key: 1,
  class: "muted"
}, In = { class: "toggle-row" }, On = { class: "grid" }, jn = ["onUpdate:modelValue"], zn = ["onUpdate:modelValue"], Wn = ["onUpdate:modelValue"], Gn = ["onClick"], Kn = {
  key: 0,
  class: "muted"
}, Hn = { class: "toggle-row" }, Qn = { class: "label-block" }, Jn = {
  id: "model-scout",
  class: "model-role"
}, Yn = {
  key: 3,
  class: "muted"
}, Xn = {
  key: 4,
  class: "toggle-row"
}, Zn = { class: "toggle-row" }, _n = { class: "toggle-row" }, es = { class: "label-block" }, ts = {
  id: "model-deep",
  class: "model-role"
}, ls = {
  id: "model-deep-query",
  class: "model-role"
}, as = { class: "label-block" }, ns = {
  id: "model-extract",
  class: "model-role"
}, ss = { class: "output-list" }, os = { class: "chip" }, is = {
  key: 1,
  class: "muted"
}, ds = { class: "toggle-row" }, us = { class: "toggle-row" }, rs = { class: "toggle-row" }, cs = { class: "toggle-row" }, vs = {
  id: "model-verify",
  class: "model-role"
}, ms = /* @__PURE__ */ G({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const i = e, l = M(() => i.config.stages), v = (V) => fl(i.stage, V), u = ml(), f = M(() => i.config.fields.filter((V) => V.strategy === "deep").length), k = M(() => i.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), r = M(() => xt(i.config)), w = M({ get: () => l.value.extract.reads ?? "text", set: (V) => {
      l.value.extract.reads = V, V === "pages" && l.value.extract.max_pages === void 0 && (l.value.extract.max_pages = 8);
    } }), q = M({ get: () => l.value.extract.max_pages ?? 8, set: (V) => {
      l.value.extract.max_pages = V;
    } });
    function C(V) {
      l.value.verify.check_support = V, V || (l.value.verify.check_completeness = !1);
    }
    function m(V) {
      V ? l.value.scout.agent_id = V : delete l.value.scout.agent_id;
    }
    function $(V, s) {
      const d = l.value.scout.tools.filter((U) => U !== V);
      l.value.scout.tools = s ? [...d, V] : d;
    }
    return (V, s) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", Rn, o(p(pl)[e.stage]), 1),
      e.stage === "map" ? (a(), n(A, { key: 0 }, [
        t("div", Bn, [
          s[35] || (s[35] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": s[0] || (s[0] = (d) => l.value.map.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Ln, [
          s[36] || (s[36] = t("span", { id: "outline-label" }, "Outline", -1)),
          b(ye, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": s[1] || (s[1] = (d) => l.value.map.outline = d),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          s[37] || (s[37] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Tn, [
          s[38] || (s[38] = t("span", null, [
            N("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          b(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": s[2] || (s[2] = (d) => l.value.map.section_summaries = d),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[40] || (s[40] = t("h4", null, "Models", -1)),
        t("div", Pn, [
          s[39] || (s[39] = t("span", null, "Outliner", -1)),
          b(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: s[3] || (s[3] = (d) => l.value.map.model = d)
          }, null, 8, ["value"])
        ]),
        s[41] || (s[41] = t("h4", null, "Fields that read sections", -1)),
        k.value.length ? (a(), n("p", Dn, [
          (a(!0), n(A, null, O(k.value, (d) => (a(), n("span", {
            key: d,
            class: "chip primary"
          }, o(d), 1))), 128))
        ])) : (a(), n("p", Fn, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : h("", !0),
      e.stage === "prefetch" ? (a(), n(A, { key: 1 }, [
        t("div", In, [
          s[42] || (s[42] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": s[4] || (s[4] = (d) => l.value.prefetch.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s[46] || (s[46] = t("h4", null, "Queries", -1)),
        (a(!0), n(A, null, O(l.value.prefetch.queries, (d, U) => (a(), n("div", {
          key: U,
          class: "query-row"
        }, [
          t("div", On, [
            t("label", null, [
              s[43] || (s[43] = N("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (z) => d.name = z,
                placeholder: "Parties"
              }, null, 8, jn), [
                [_, d.name]
              ])
            ]),
            t("label", null, [
              s[44] || (s[44] = N("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (z) => d.chunks = z,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, zn), [
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
            s[45] || (s[45] = N("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (z) => d.query = z,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Wn), [
              [_, d.query]
            ])
          ]),
          e.readonly ? h("", !0) : (a(), n("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (z) => l.value.prefetch.queries.splice(U, 1)
          }, "Remove query", 8, Gn))
        ]))), 128)),
        l.value.prefetch.queries.length ? h("", !0) : (a(), n("p", Kn, "No fixed queries. Field search hints still run.")),
        e.readonly ? h("", !0) : (a(), n("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: s[5] || (s[5] = (d) => l.value.prefetch.queries.push(p(bl)()))
        }, "Add query"))
      ], 64)) : h("", !0),
      e.stage === "scout" ? (a(), n(A, { key: 2 }, [
        t("div", Hn, [
          s[47] || (s[47] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": s[6] || (s[6] = (d) => l.value.scout.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Qn, [
          s[48] || (s[48] = t("span", { id: "mode-label" }, "Mode", -1)),
          b(ye, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": s[7] || (s[7] = (d) => l.value.scout.mode = d),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, o(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (a(), J(dn, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: m
        }, null, 8, ["value", "readonly"])) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), J(Vn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : h("", !0),
        s[53] || (s[53] = t("h4", null, "Models", -1)),
        t("div", Jn, [
          s[49] || (s[49] = t("span", null, "Scout", -1)),
          b(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: s[8] || (s[8] = (d) => l.value.scout.model = d)
          }, null, 8, ["value"])
        ]),
        s[54] || (s[54] = t("h4", null, "Loop", -1)),
        b(te, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": s[9] || (s[9] = (d) => l.value.scout.max_rounds = d),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: v("max_rounds").min,
          max: v("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (a(), J(te, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": s[10] || (s[10] = (d) => l.value.scout.target_confidence = d),
          label: "Stop at confidence",
          min: v("target_confidence").min,
          max: v("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : h("", !0),
        b(te, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": s[11] || (s[11] = (d) => l.value.scout.max_extra_queries = d),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: v("max_extra_queries").min,
          max: v("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": s[12] || (s[12] = (d) => l.value.scout.max_tokens = d),
          label: "Scout output limit",
          min: v("max_tokens").min,
          max: v("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (a(), n("p", Yn, "Tool budget: " + o(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : h("", !0),
        l.value.scout.mode === "loop" ? (a(), n("div", Xn, [
          s[50] || (s[50] = t("span", null, [
            N("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": s[13] || (s[13] = (d) => l.value.scout.drop_noise = d),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : h("", !0),
        t("div", Zn, [
          s[51] || (s[51] = t("span", null, [
            N("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          b(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": s[14] || (s[14] = (d) => l.value.scout.share_notes = d),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (a(), n(A, { key: 5 }, [
          s[52] || (s[52] = t("h4", null, "Agent tools", -1)),
          (a(!0), n(A, null, O(p(u), (d) => (a(), n("div", {
            key: d,
            class: "toggle-row"
          }, [
            t("span", null, o(p(_e)(d)), 1),
            b(Z, {
              "model-value": l.value.scout.tools.includes(d),
              label: p(_e)(d),
              disabled: e.readonly,
              "onUpdate:modelValue": (U) => $(d, U)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : h("", !0)
      ], 64)) : h("", !0),
      e.stage === "deep" ? (a(), n(A, { key: 3 }, [
        t("div", _n, [
          s[55] || (s[55] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": s[15] || (s[15] = (d) => l.value.deep.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        b(Mn, {
          fields: f.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", es, [
          s[56] || (s[56] = t("span", { id: "read-label" }, "Reads", -1)),
          b(ye, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": s[16] || (s[16] = (d) => l.value.deep.read = d),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          s[57] || (s[57] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        s[60] || (s[60] = t("h4", null, "Models", -1)),
        t("div", ts, [
          s[58] || (s[58] = t("span", null, "Analysis", -1)),
          b(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: s[17] || (s[17] = (d) => l.value.deep.model = d)
          }, null, 8, ["value"])
        ]),
        t("div", ls, [
          s[59] || (s[59] = t("span", null, "Query writer", -1)),
          b(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: s[18] || (s[18] = (d) => l.value.deep.query_model = d)
          }, null, 8, ["value"])
        ]),
        s[61] || (s[61] = t("h4", null, "Reach", -1)),
        b(te, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": s[19] || (s[19] = (d) => l.value.deep.parallel_fields = d),
          label: "Fields at a time",
          min: v("parallel_fields").min,
          max: v("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": s[20] || (s[20] = (d) => l.value.deep.max_queries = d),
          label: "Queries per field",
          min: v("max_queries").min,
          max: v("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": s[21] || (s[21] = (d) => l.value.deep.chunks_per_query = d),
          label: "Chunks per query",
          min: v("chunks_per_query").min,
          max: v("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": s[22] || (s[22] = (d) => l.value.deep.chunk_cap = d),
          label: "Chunk cap per field",
          min: v("chunk_cap").min,
          max: v("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": s[23] || (s[23] = (d) => l.value.deep.min_similarity = d),
          label: "Minimum similarity",
          min: v("min_similarity").min,
          max: v("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        s[62] || (s[62] = t("h4", null, "Temperature", -1)),
        b(te, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": s[24] || (s[24] = (d) => l.value.deep.query_temperature = d),
          label: "Query writing",
          min: v("query_temperature").min,
          max: v("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        b(te, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": s[25] || (s[25] = (d) => l.value.deep.analysis_temperature = d),
          label: "Analysis",
          min: v("analysis_temperature").min,
          max: v("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "extract" ? (a(), n(A, { key: 4 }, [
        t("div", as, [
          s[63] || (s[63] = t("span", { id: "extract-reads-label" }, "Read values from", -1)),
          b(ye, {
            modelValue: w.value,
            "onUpdate:modelValue": s[26] || (s[26] = (d) => w.value = d),
            "labelled-by": "extract-reads-label",
            name: "Read values from",
            options: [{ value: "text", label: "Text" }, { value: "pages", label: "Page images" }],
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        w.value === "pages" ? (a(), n(A, { key: 0 }, [
          s[64] || (s[64] = t("p", { class: "muted" }, "Extraction and visual support need models with vision. Text retrieval selects pages; section boundaries that share a page are unsupported.", -1)),
          b(te, {
            modelValue: q.value,
            "onUpdate:modelValue": s[27] || (s[27] = (d) => q.value = d),
            label: "Page images per call",
            min: v("max_pages").min,
            max: v("max_pages").max,
            disabled: e.readonly,
            note: "The context budget can admit fewer pages."
          }, null, 8, ["modelValue", "min", "max", "disabled"])
        ], 64)) : h("", !0),
        s[66] || (s[66] = t("h4", null, "Models", -1)),
        t("div", ns, [
          s[65] || (s[65] = t("span", null, "Extraction", -1)),
          b(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: s[28] || (s[28] = (d) => l.value.extract.model = d)
          }, null, 8, ["value"])
        ]),
        s[67] || (s[67] = t("h4", null, "Field groups", -1)),
        t("ul", ss, [
          (a(!0), n(A, null, O(r.value, (d) => (a(), n("li", {
            key: d.name
          }, [
            t("span", null, o(d.name), 1),
            t("span", os, o(d.fields.length) + " field" + o(d.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        r.value.length ? h("", !0) : (a(), n("p", is, "No fields yet.")),
        b(te, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": s[29] || (s[29] = (d) => l.value.extract.max_fields_per_call = d),
          label: "Fields per call",
          min: v("max_fields_per_call").min,
          max: v("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${p(ft)(e.config)} extraction call${p(ft)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        b(te, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": s[30] || (s[30] = (d) => l.value.extract.max_output_tokens = d),
          label: "Output limit",
          min: v("max_output_tokens").min,
          max: v("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : h("", !0),
      e.stage === "verify" ? (a(), n(A, { key: 5 }, [
        t("div", ds, [
          s[68] || (s[68] = t("span", null, "Stage enabled", -1)),
          b(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": s[31] || (s[31] = (d) => l.value.verify.enabled = d),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", us, [
          t("span", null, [
            s[69] || (s[69] = N("Quotes exist", -1)),
            t("small", null, o(w.value === "pages" ? "Text agreement is informational; visual support determines verification." : "Each quote is matched against the document text. No model call."), 1)
          ]),
          b(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": s[32] || (s[32] = (d) => l.value.verify.check_quotes = d),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", rs, [
          t("span", null, [
            s[70] || (s[70] = N("Quotes support values", -1)),
            t("small", null, o(w.value === "pages" ? "A vision model checks the quote and value against physical page images." : "A model confirms each quote supports its value."), 1)
          ]),
          b(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": C,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (a(), n(A, { key: 0 }, [
          t("div", cs, [
            s[71] || (s[71] = t("span", null, [
              N("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            b(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": s[33] || (s[33] = (d) => l.value.verify.check_completeness = d),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          s[73] || (s[73] = t("h4", null, "Models", -1)),
          t("div", vs, [
            s[72] || (s[72] = t("span", null, "Checker", -1)),
            b(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: s[34] || (s[34] = (d) => l.value.verify.model = d)
            }, null, 8, ["value"])
          ])
        ], 64)) : h("", !0)
      ], 64)) : h("", !0)
    ], 8, An));
  }
}), ps = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, bs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, fs = ["x", "y", "width"], gs = ["x", "width"], hs = /* @__PURE__ */ G({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const i = e, l = M(() => Math.min(0.9, Math.max(0, i.overlap / i.size))), v = M(() => {
      const u = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((f) => ({ x: f * u * (1 - l.value), w: u }));
    });
    return (u, f) => (a(), n("figure", ps, [
      (a(), n("svg", bs, [
        (a(!0), n(A, null, O(v.value, (k, r) => (a(), n("rect", {
          key: r,
          x: k.x,
          y: r % 2 ? 14 : 4,
          width: k.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, fs))), 128)),
        (a(), n(A, null, O([1, 2], (k) => t("rect", {
          key: "o" + k,
          x: v.value[k].x,
          y: 4,
          width: v.value[k - 1].x + v.value[k - 1].w - v.value[k].x,
          height: "24",
          class: "shared"
        }, null, 8, gs)), 64))
      ])),
      t("figcaption", null, o(e.size.toLocaleString()) + " tokens per chunk · " + o(e.overlap.toLocaleString()) + " shared with the next (" + o(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), ys = ["disabled"], ks = { class: "muted" }, xs = { class: "toggle-row" }, $s = { class: "toggle-row" }, ws = { class: "label-block" }, Vs = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, Cs = { class: "label-block" }, Ss = {
  id: "embedding-model",
  class: "model-role"
}, Es = { class: "toggle-row" }, qs = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Us = /* @__PURE__ */ G({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const i = e, l = M(() => i.config.retrieval), v = M({ get: () => i.config.retention ?? "", set: (C) => {
      C.trim() ? i.config.retention = C.trim() : delete i.config.retention;
    } }), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], f = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], k = Xe("chunk_size"), r = Xe("overlap"), w = Xe("section_budget"), q = M(() => Math.min(r.max, l.value.chunk_size - 50));
    return (C, m) => (a(), n("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", ks, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + o(e.retention) + ".", 1),
      t("label", null, [
        m[12] || (m[12] = N("Retention window", -1)),
        W(t("input", {
          "onUpdate:modelValue": m[0] || (m[0] = ($) => v.value = $),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, v.value]
        ]),
        m[13] || (m[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      m[22] || (m[22] = t("h4", null, "Chunks", -1)),
      b(hs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      b(te, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": m[1] || (m[1] = ($) => l.value.chunk_size = $),
        label: "Chunk size",
        min: p(k).min,
        max: p(k).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      b(te, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": m[2] || (m[2] = ($) => l.value.overlap = $),
        label: "Overlap",
        min: p(r).min,
        max: q.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", xs, [
        m[14] || (m[14] = t("span", null, [
          N("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        b(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": m[3] || (m[3] = ($) => l.value.split_headings = $),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", $s, [
        m[15] || (m[15] = t("span", null, [
          N("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        b(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": m[4] || (m[4] = ($) => l.value.keep_tables = $),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      b(te, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": m[5] || (m[5] = ($) => l.value.section_budget = $),
        label: "Section budget",
        min: p(w).min,
        max: p(w).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      m[23] || (m[23] = t("h4", null, "Context", -1)),
      t("div", ws, [
        m[16] || (m[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        b(ye, {
          modelValue: l.value.context,
          "onUpdate:modelValue": m[6] || (m[6] = ($) => l.value.context = $),
          "labelled-by": "context-label",
          options: f
        }, null, 8, ["modelValue"]),
        t("small", null, o(f.find(($) => $.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (a(), n("div", Vs, [
        m[17] || (m[17] = t("span", null, "Context writer", -1)),
        b(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: m[7] || (m[7] = ($) => l.value.context_model = $)
        }, null, 8, ["value"])
      ])) : h("", !0),
      m[24] || (m[24] = t("h4", null, "Search", -1)),
      t("div", Cs, [
        m[18] || (m[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        b(ye, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": m[8] || (m[8] = ($) => l.value.search_mode = $),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, o(u.find(($) => $.value === l.value.search_mode)?.note), 1)
      ]),
      m[25] || (m[25] = t("h4", null, "Models", -1)),
      t("div", Ss, [
        m[19] || (m[19] = t("span", null, "Embedding", -1)),
        b(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: m[9] || (m[9] = ($) => l.value.embedding_model = $)
        }, null, 8, ["value"])
      ]),
      t("div", Es, [
        m[20] || (m[20] = t("span", null, [
          N("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        b(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": m[10] || (m[10] = ($) => l.value.highlighter = $),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (a(), n("div", qs, [
        m[21] || (m[21] = t("span", null, "Highlighter", -1)),
        b(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: m[11] || (m[11] = ($) => l.value.highlighter_model = $)
        }, null, 8, ["value"])
      ])) : h("", !0)
    ], 8, ys));
  }
}), Ns = ["inert"], Ms = { class: "canvas-inner" }, As = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Rs = { class: "block-head" }, Bs = ["aria-expanded"], Ls = { class: "count" }, Ts = {
  key: 0,
  class: "block-peek"
}, Ps = {
  key: 1,
  class: "field-add-actions push"
}, Ds = ["aria-expanded", "aria-controls", "disabled"], Fs = ["disabled"], Is = {
  id: "fields-body",
  class: "block-body"
}, Os = {
  key: 0,
  class: "block-empty"
}, js = { class: "field-tree" }, zs = ["id"], Ws = {
  class: "tree-indent",
  "aria-hidden": "true"
}, Gs = {
  class: "shape-preview",
  open: ""
}, Ks = { class: "kx-focus-outline" }, Hs = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Qs = {
  key: 1,
  class: "preview-grid"
}, Js = { "aria-label": "Output shape" }, Ys = { "aria-label": "Example output" }, Xs = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Zs = { class: "block-head" }, _s = ["aria-expanded"], eo = { class: "count" }, to = {
  key: 0,
  class: "block-peek"
}, lo = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, ao = { class: "node-icon" }, no = { class: "node-main" }, so = { class: "node-summary" }, oo = { class: "node-side" }, io = { class: "chip model" }, uo = { class: "branches" }, ro = { class: "branch" }, co = { class: "branch" }, vo = { class: "node-icon" }, mo = { class: "node-main" }, po = { class: "node-summary" }, bo = ["aria-labelledby", "role", "aria-modal"], fo = ["aria-valuenow"], go = { class: "side-panel-head" }, ho = { class: "side-panel-icon" }, yo = ["id"], ko = ["aria-label", "title"], xo = { class: "node-breadcrumb mono" }, $o = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, wo = {
  key: 0,
  value: ""
}, Vo = {
  key: 1,
  value: "",
  disabled: ""
}, Co = ["value"], So = ["disabled"], Eo = ["disabled"], qo = {
  key: 4,
  class: "inspector-form"
}, Uo = { class: "output-list" }, No = { class: "mono" }, Mo = { class: "chip" }, Ao = { class: "rail-label" }, Ze = 400, Oe = 320, Ro = /* @__PURE__ */ G({
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
    const i = e, l = Le(e, "title"), v = Le(e, "description"), u = R({ kind: "document" });
    function f(y, c) {
      try {
        const E = localStorage.getItem(`docscout.${y}`);
        return E === null ? c : E === "1";
      } catch {
        return c;
      }
    }
    function k(y, c) {
      try {
        localStorage.setItem(`docscout.${y}`, c ? "1" : "0");
      } catch {
      }
    }
    const r = R(f("panel", !0)), w = R(f("fields", !0)), q = R(f("flow", !0));
    function C() {
      try {
        const y = Number(localStorage.getItem("docscout.panelWidth"));
        return y >= Oe ? y : Ze;
      } catch {
        return Ze;
      }
    }
    const m = R(C()), $ = () => {
      const y = P.value?.clientWidth;
      return y ? Math.max(Oe, y - 420) : Number.POSITIVE_INFINITY;
    };
    function V(y, c = !0) {
      if (m.value = Math.round(Math.min($(), Math.max(Oe, y))), c)
        try {
          localStorage.setItem("docscout.panelWidth", String(m.value));
        } catch {
        }
    }
    const s = R(!1);
    function d(y) {
      const c = y.currentTarget, E = y.clientX, Y = m.value;
      c.setPointerCapture(y.pointerId), s.value = !0;
      const X = (ee) => V(Y + (E - ee.clientX), !1), ae = () => {
        s.value = !1, V(m.value), c.removeEventListener("pointermove", X), c.removeEventListener("pointerup", ae);
      };
      c.addEventListener("pointermove", X), c.addEventListener("pointerup", ae);
    }
    function U(y) {
      y.key === "ArrowLeft" ? (V(m.value + 24), y.preventDefault()) : y.key === "ArrowRight" && (V(m.value - 24), y.preventDefault());
    }
    let z = null;
    const I = R(), j = pe();
    async function K(y) {
      if (r.value = y, !T.value) {
        k("panel", y);
        return;
      }
      if (!y && z) {
        const c = z;
        z = null, await Se(), c.focus();
      }
    }
    function D(y) {
      const c = y === "fields" ? w : q;
      c.value = !c.value, k(y, c.value);
    }
    const P = R(), T = R(!1);
    let de;
    Ue(() => {
      de = new ResizeObserver(([y]) => {
        const c = T.value;
        T.value = y.contentRect.width < 1e3, T.value && !c && (r.value = !1), !T.value && c && (r.value = f("panel", !0));
      }), P.value && de.observe(P.value);
    }), kt(() => de?.disconnect());
    const ke = R();
    be(u, async () => {
      await Se(), ke.value && (ke.value.scrollTop = 0);
    });
    async function le(y) {
      T.value && !r.value && (z = P.value?.getRootNode()?.activeElement), u.value = y, r.value = !0, T.value && (await Se(), I.value?.focus());
    }
    const oe = (y) => JSON.stringify(y) === JSON.stringify(u.value), fe = M(() => u.value.kind === "field" ? i.config.fields[u.value.index] : void 0), S = M(() => Ke(i.config.fields)), g = M(() => u.value.kind === "field" ? S.value.find((y) => y.key === ie(u.value.index, u.value.trail ?? [])) : void 0), x = M(() => g.value?.key ?? ""), L = M(() => {
      const y = g.value;
      return !y || y.trail.at(-1) === "item" || !y.trail.length ? void 0 : S.value.find((E) => E.key === ie(y.field, y.trail.slice(0, -1))).shape.properties.filter((E) => E !== y.shape).map((E) => E.name);
    }), F = R("");
    be(x, () => {
      F.value = "";
    });
    const Ne = M(() => g.value ? Ll(i.config.fields, g.value) : []), ge = M(() => {
      const y = gl(i.config.fields.map(H));
      return y ? `Group path collides with field ${y}.` : "";
    }), Pe = M(() => ge.value ? null : yt(i.config.fields)), Rt = M(() => ge.value ? null : yt(i.config.fields, !0)), nt = M(() => {
      const y = u.value;
      return y.kind === "stage" ? xe[y.stage] : y.kind === "field" ? g.value?.trail.length ? g.value.path : fe.value?.name || "New field" : y.kind === "document" ? "Read document" : y.kind === "output" ? "Output" : "Details";
    }), Bt = M(() => {
      const y = u.value;
      return y.kind === "stage" ? at[y.stage] : y.kind === "field" ? "tabler:forms" : y.kind === "document" ? "tabler:file-text" : y.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Lt = M(() => i.config.fields.filter((y, c) => !(u.value.kind === "field" && u.value.index === c)).map(H)), Tt = M(() => i.config.stages.deep.enabled), Pt = M(() => i.config.stages.map.enabled), Dt = M(() => Te(i.config.fields.map(H))), De = R(!1), st = R(), ot = pe();
    function Ft(y, c) {
      for (const E of i.config.fields) (E.group === y || E.group.startsWith(y + ".")) && (E.group = c + E.group.slice(y.length));
    }
    const It = (y) => 320 - Math.max(0, ...i.config.fields.filter((c) => c.group === y || c.group.startsWith(y + ".")).map((c) => c.group.length - y.length));
    function Ot() {
      w.value = !0, De.value = !0;
    }
    async function it() {
      De.value = !1, await Se(), st.value.focus();
    }
    function jt(y) {
      i.config.fields.push({ ...et(), group: y }), it();
    }
    const zt = M(() => [...new Set(i.config.fields.map((y) => y.group.trim()).filter(Boolean))]), Wt = (y) => Ct(i.config.fields[y], i.config.fields.filter((c, E) => E !== y).map(H)), dt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Gt = M(() => dt.filter((y) => Ge(i.config, y)).map((y) => xe[y]).join(" · ")), Kt = M(() => i.config.fields.map((y) => y.name || "New field").join(", ")), Ht = M(() => dt.filter((y) => Ge(i.config, y)).length), $e = (y) => i.result?.trace.find((c) => c.kind === y);
    function ut(y = "") {
      i.config.fields.push({ ...et(), group: y }), w.value = !0, le({ kind: "field", index: i.config.fields.length - 1 });
    }
    function Qt(y) {
      i.config.fields.splice(y, 1), u.value = { kind: "document" };
    }
    function re(y, c = []) {
      le({ kind: "field", index: y, ...c.length ? { trail: c } : {} });
    }
    function rt(y, c) {
      const E = S.value.find((Y) => Y.key === ie(y, c));
      E.shape.properties.push(Vt()), re(y, [...c, E.shape.properties.length - 1]);
    }
    function Jt() {
      const y = g.value;
      if (!y.trail.length) {
        Qt(y.field);
        return;
      }
      const c = S.value.find((E) => E.key === ie(y.field, y.trail.slice(0, -1)));
      c.shape.properties.splice(y.trail.at(-1), 1), re(c.field, c.trail);
    }
    function Yt(y, c, E) {
      if (c.length) {
        const X = S.value.find((ne) => ne.key === ie(y, c.slice(0, -1))).shape.properties, ae = c.at(-1), ee = ae + E;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(y, [...c.slice(0, -1), ee]);
      } else {
        const Y = i.config.fields.map((ee, ne) => ee.group === i.config.fields[y].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(y) + E];
        if (X === void 0) return;
        const ae = i.config.fields;
        [ae[y], ae[X]] = [ae[X], ae[y]], re(X);
      }
    }
    function Xt() {
      const y = g.value, c = Ne.value.find((Y) => Y.key === F.value), E = Tl(i.config.fields, y, c);
      re(E.field, E.trail);
    }
    function Zt(y) {
      const c = g.value?.shape;
      i.config.fields.splice(0, i.config.fields.length, ...i.config.fields.filter((Y) => Y.group !== y && !Y.group.startsWith(y + ".")));
      const E = S.value.find((Y) => Y.shape === c);
      E ? re(E.field, E.trail) : u.value = { kind: "document" };
    }
    function _t(y, c) {
      const E = y.split(".").slice(0, -1).join(".");
      let X = Te(i.config.fields.map(H));
      for (const se of E.split(".").filter(Boolean)) X = X.children.find((al) => al.name === se);
      const ae = X.children.findIndex((se) => se.path === y), ee = X.children[ae + c]?.path;
      if (!ee) return;
      const ne = i.config.fields.filter((se) => se.group === y || se.group.startsWith(y + ".")), Fe = i.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Me = i.config.fields, tl = Math.min(Me.indexOf(ne[0]), Me.indexOf(Fe[0])), vt = Me.filter((se) => !ne.includes(se) && !Fe.includes(se));
      vt.splice(tl, 0, ...c > 0 ? [...Fe, ...ne] : [...ne, ...Fe]);
      const ll = g.value?.shape;
      Me.splice(0, Me.length, ...vt);
      const Ye = S.value.find((se) => se.shape === ll);
      Ye && re(Ye.field, Ye.trail);
    }
    const el = (y) => y.type === "list" ? `list of ${y.item?.type}` : y.type, ct = M({ get: () => i.config.tags.join(", "), set: (y) => {
      i.config.tags = [...new Set(y.split(",").map((c) => c.trim()).filter(Boolean))];
    } });
    return (y, c) => (a(), n("div", {
      ref_key: "root",
      ref: P,
      class: Q(["builder", { narrow: T.value, "panel-open": r.value, resizing: s.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: T.value && r.value
      }, [
        t("div", Ms, [
          t("section", As, [
            t("header", Rs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "fields-body",
                onClick: c[0] || (c[0] = (E) => D("fields"))
              }, [
                b(p(B), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[23] || (c[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Ls, o(e.config.fields.length), 1)
              ], 8, Bs),
              !w.value && e.config.fields.length ? (a(), n("span", Ts, o(Kt.value), 1)) : h("", !0),
              e.readonly ? h("", !0) : (a(), n("div", Ps, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: st,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": De.value,
                  "aria-controls": p(ot),
                  disabled: e.config.fields.length >= 100,
                  onClick: Ot
                }, [
                  b(p(B), { icon: "tabler:folder-plus" }),
                  c[24] || (c[24] = N("Add group", -1))
                ], 8, Ds),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: c[1] || (c[1] = (E) => ut())
                }, [
                  b(p(B), { icon: "tabler:plus" }),
                  c[25] || (c[25] = N("Add field", -1))
                ], 8, Fs)
              ]))
            ]),
            W(t("div", Is, [
              e.config.fields.length ? h("", !0) : (a(), n("p", Os, "Add the values to pull from each document.")),
              t("div", js, [
                De.value && !e.readonly ? (a(), n("div", {
                  key: 0,
                  id: p(ot),
                  class: "group-create-row"
                }, [
                  t("span", Ws, [
                    b(p(B), { icon: "tabler:folder-plus" })
                  ]),
                  b(qt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: jt,
                    onCancel: it
                  })
                ], 8, zs)) : h("", !0),
                b(Re, { node: Dt.value }, {
                  header: me(({ path: E, label: Y, count: X, first: ae, last: ee }) => [
                    b(Aa, {
                      path: E,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": It(E),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Ft(E, ne),
                      onAdd: (ne) => ut(E),
                      onReorder: (ne) => _t(E, ne),
                      onRemove: (ne) => Zt(E)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: E }) => [
                    b(tn, {
                      shape: e.config.fields[E],
                      field: E,
                      trail: [],
                      path: p(H)(e.config.fields[E]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: Wt(E),
                      first: !e.config.fields.slice(0, E).some((Y) => Y.group === e.config.fields[E].group),
                      last: !e.config.fields.slice(E + 1).some((Y) => Y.group === e.config.fields[E].group),
                      onSelect: re,
                      onAdd: rt,
                      onReorder: Yt
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", Gs, [
                t("summary", Ks, [
                  b(p(B), { icon: "tabler:braces" }),
                  c[26] || (c[26] = N("Output preview", -1))
                ]),
                ge.value ? (a(), n("p", Hs, o(ge.value), 1)) : (a(), n("div", Qs, [
                  t("div", null, [
                    c[27] || (c[27] = t("h3", null, "Output shape", -1)),
                    t("pre", Js, o(JSON.stringify(Pe.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    c[28] || (c[28] = t("h3", null, "Example value", -1)),
                    t("pre", Ys, o(JSON.stringify(Rt.value, null, 2)), 1)
                  ])
                ])),
                c[29] || (c[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [We, w.value]
            ])
          ]),
          t("section", Xs, [
            t("header", Zs, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": q.value,
                "aria-controls": "flow-body",
                onClick: c[2] || (c[2] = (E) => D("flow"))
              }, [
                b(p(B), {
                  icon: q.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[30] || (c[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", eo, o(Ht.value) + " of 6", 1)
              ], 8, _s),
              q.value ? h("", !0) : (a(), n("span", to, o(Gt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: c[3] || (c[3] = (E) => le({ kind: "details" }))
              }, [
                b(p(B), { icon: "tabler:info-circle" }),
                c[31] || (c[31] = N("Details", -1))
              ], 2)
            ]),
            W(t("div", lo, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: c[4] || (c[4] = (E) => le({ kind: "document" }))
              }, [
                t("span", ao, [
                  b(p(B), { icon: "tabler:file-text" })
                ]),
                t("span", no, [
                  c[32] || (c[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", so, o(p(hl)(e.config.retrieval)), 1)
                ]),
                t("span", oo, [
                  t("span", io, o(p($t)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              c[37] || (c[37] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: $e("map"),
                readonly: e.readonly,
                onSelect: c[5] || (c[5] = (E) => le({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[38] || (c[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", uo, [
                t("div", ro, [
                  c[33] || (c[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  b(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: $e("prefetch"),
                    readonly: e.readonly,
                    onSelect: c[6] || (c[6] = (E) => le({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  c[34] || (c[34] = t("div", { class: "connector" }, null, -1)),
                  b(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: $e("scout"),
                    readonly: e.readonly,
                    onSelect: c[7] || (c[7] = (E) => le({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", co, [
                  c[35] || (c[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  b(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: $e("deep"),
                    readonly: e.readonly,
                    onSelect: c[8] || (c[8] = (E) => le({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              c[39] || (c[39] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              b(we, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: $e("extract"),
                readonly: e.readonly,
                onSelect: c[9] || (c[9] = (E) => le({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[40] || (c[40] = t("div", { class: "connector" }, null, -1)),
              b(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: $e("verify"),
                readonly: e.readonly,
                onSelect: c[10] || (c[10] = (E) => le({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[41] || (c[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: c[11] || (c[11] = (E) => le({ kind: "output" }))
              }, [
                t("span", vo, [
                  b(p(B), { icon: "tabler:braces" })
                ]),
                t("span", mo, [
                  c[36] || (c[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", po, o(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [We, q.value]
            ])
          ])
        ])
      ], 8, Ns),
      T.value && r.value ? (a(), n("div", {
        key: 0,
        class: "scrim",
        onClick: c[12] || (c[12] = (E) => K(!1))
      })) : h("", !0),
      r.value ? W((a(), n("aside", {
        key: String(T.value),
        class: "side-panel",
        "aria-labelledby": p(j),
        role: T.value ? "dialog" : void 0,
        "aria-modal": T.value ? "true" : void 0,
        style: qe(T.value ? void 0 : { width: `${m.value}px` }),
        onKeydown: c[21] || (c[21] = Ee((E) => T.value && K(!1), ["esc"]))
      }, [
        T.value ? h("", !0) : (a(), n("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: s.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": m.value,
          "aria-valuemin": Oe,
          onPointerdown: ve(d, ["prevent"]),
          onKeydown: U,
          onDblclick: c[13] || (c[13] = (E) => V(Ze))
        }, null, 42, fo)),
        t("header", go, [
          t("span", ho, [
            b(p(B), { icon: Bt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: p(j) }, o(nt.value), 9, yo),
          t("button", {
            ref_key: "closeButton",
            ref: I,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": T.value ? "Close panel" : "Collapse panel",
            title: T.value ? "Close panel" : "Collapse panel",
            onClick: c[14] || (c[14] = (E) => K(!1))
          }, [
            b(p(B), {
              icon: T.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, ko)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ke,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (a(), J(Us, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (a(), J(ms, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && fe.value && g.value ? (a(), n(A, { key: 2 }, [
            t("p", xo, o(g.value.path), 1),
            b(ma, {
              field: fe.value,
              shape: g.value.shape,
              depth: g.value.depth,
              "sibling-names": L.value,
              "other-names": Lt.value,
              groups: zt.value,
              "deep-enabled": Tt.value,
              "map-enabled": Pt.value,
              readonly: e.readonly,
              onRemove: Jt,
              onAdd: c[15] || (c[15] = (E) => rt(g.value.field, g.value.trail)),
              onSelectItem: c[16] || (c[16] = (E) => re(g.value.field, [...g.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && g.value.trail.at(-1) !== "item" ? (a(), n("fieldset", $o, [
              t("label", null, [
                c[42] || (c[42] = N("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": c[17] || (c[17] = (E) => F.value = E),
                  "aria-label": "Move to parent"
                }, [
                  g.value.trail.length ? (a(), n("option", wo, "Top-level field")) : (a(), n("option", Vo, "Choose an object…")),
                  (a(!0), n(A, null, O(Ne.value, (E) => (a(), n("option", {
                    key: E.key,
                    value: E.key
                  }, o(E.path), 9, Co))), 128))
                ], 512), [
                  [ze, F.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !F.value && !g.value.trail.length || !F.value && e.config.fields.length >= 100,
                onClick: Xt
              }, "Move", 8, So)
            ])) : h("", !0)
          ], 64)) : u.value.kind === "details" ? (a(), n("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              c[43] || (c[43] = N("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[18] || (c[18] = (E) => l.value = E),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              c[44] || (c[44] = N("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": c[19] || (c[19] = (E) => v.value = E),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, v.value]
              ])
            ]),
            t("label", null, [
              c[45] || (c[45] = N("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[20] || (c[20] = (E) => ct.value = E),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  ct.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              c[46] || (c[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Eo)) : u.value.kind === "output" ? (a(), n("div", qo, [
            c[47] || (c[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Uo, [
              (a(!0), n(A, null, O(e.config.fields, (E) => (a(), n("li", {
                key: p(H)(E)
              }, [
                t("span", No, o(p(H)(E) || "New field"), 1),
                t("span", Mo, o(el(E)), 1)
              ]))), 128))
            ]),
            c[48] || (c[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : h("", !0)
        ], 512)
      ], 44, bo)), [
        [p(xl), { disabled: !T.value }]
      ]) : T.value ? h("", !0) : (a(), n("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: c[22] || (c[22] = (E) => K(!0))
      }, [
        b(p(B), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Ao, o(nt.value), 1)
      ]))
    ], 2));
  }
}), Bo = ["selected"], Lo = {
  key: 1,
  role: "alert"
}, To = {
  key: 2,
  class: "muted picker-pending picker-pending--list"
}, Ut = /* @__PURE__ */ G({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: i }) {
    const l = i, v = R(!1), u = R("");
    Ue(async () => {
      try {
        await Je("wc-multiselect", { timeoutMs: 8e3 }), v.value = !0;
      } catch (k) {
        u.value = String(k);
      }
    });
    function f(k) {
      const r = k.detail;
      l("select", r.selected[0] || "", r.labels?.[0] || "");
    }
    return (k, r) => v.value ? (a(), n("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: f
    }, null, 40, Bo)) : u.value ? (a(), n("p", Lo, o(u.value), 1)) : (a(), n("span", To, "Loading uploads…"));
  }
}), je = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Ce = (e) => e.metrics.length ? e.metrics.reduce((i, l) => i + l.accuracy, 0) / e.metrics.length : 0, Nt = (e) => `Visual · ${e.status}`, Po = ["data-error-kind", "data-error-code"], Do = { key: 0 }, Mt = /* @__PURE__ */ G({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    const i = e, l = M(() => {
      const u = i.error?.details;
      return u && typeof u == "object" && "code" in u && typeof u.code == "string" ? u.code : void 0;
    }), v = M(() => l.value === "context_budget_exceeded");
    return (u, f) => (a(), n("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      "data-error-code": l.value,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, o(v.value ? "Context budget exceeded" : e.error?.kind), 1),
        N(" · " + o(e.error?.message), 1)
      ]),
      t("small", null, o(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (a(), n("details", Do, [
        f[0] || (f[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, o(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : h("", !0)
    ], 8, Po));
  }
}), Fo = { class: "nested-value" }, Io = { key: 0 }, Oo = {
  key: 0,
  class: "muted"
}, jo = { key: 1 }, zo = { key: 2 }, Be = /* @__PURE__ */ G({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const i = e, l = M(() => i.value !== null && typeof i.value == "object" && !Array.isArray(i.value) ? i.value : null);
    return (v, u) => {
      const f = lt("NestedValue", !0);
      return a(), n("div", Fo, [
        Array.isArray(e.value) ? (a(), n("ol", Io, [
          (a(!0), n(A, null, O(e.value, (k, r) => (a(), n("li", { key: r }, [
            b(f, { value: k }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? h("", !0) : (a(), n("li", Oo, "Empty list"))
        ])) : l.value ? (a(), n("dl", jo, [
          (a(!0), n(A, null, O(l.value, (k, r) => (a(), n(A, { key: r }, [
            t("dt", null, o(r), 1),
            t("dd", null, [
              b(f, { value: k }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (a(), n("span", zo, o(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), Wo = { class: "value-list" }, Go = ["aria-expanded", "onClick"], Ko = { class: "value-name" }, Ho = { class: "bar" }, Qo = {
  key: 1,
  class: "value-checks"
}, Jo = ["title"], Yo = {
  key: 0,
  class: "chip",
  "aria-label": "Verification method"
}, Xo = {
  key: 1,
  class: "chip warn",
  "aria-label": "Context"
}, Zo = {
  key: 2,
  class: "chip",
  "aria-label": "Completeness"
}, _o = { class: "evidence" }, ei = {
  key: 1,
  class: "muted"
}, ti = {
  key: 2,
  class: "muted"
}, At = /* @__PURE__ */ G({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const i = e, l = M(() => Te(i.fields.map((C) => C.path))), v = R(), u = (C) => `${Math.round(C * 100)}%`, f = (C) => C !== null && typeof C == "object", k = (C) => Array.isArray(C) ? `${C.length} items` : f(C) ? `${Object.keys(C).length} properties` : C == null ? "—" : String(C), r = (C) => C >= 0.9 ? "high" : C >= 0.7 ? "mid" : "low", w = (C) => C.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (i.pageRange ? " of the searched pages" : "") : "Not in the document", q = (C) => {
      const m = C.error?.details;
      return !!m && typeof m == "object" && "code" in m && m.code === "context_budget_exceeded";
    };
    return (C, m) => (a(), n("div", Wo, [
      b(Re, { node: l.value }, {
        default: me(({ index: $ }) => [
          (a(!0), n(A, null, O([e.fields[$]], (V) => (a(), n("div", {
            key: V.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": v.value === V.path,
              onClick: (s) => v.value = v.value === V.path ? void 0 : V.path
            }, [
              t("span", Ko, o(V.name), 1),
              t("span", {
                class: Q(["value-text", { missing: V.missing }])
              }, o(V.failed ? q(V) ? "Context budget exceeded" : "Failed" : V.missing ? w(V) : k(V.value)), 3),
              V.failed ? h("", !0) : (a(), n("span", {
                key: 0,
                class: Q(["confidence", r(V.confidence)])
              }, [
                t("span", Ho, [
                  t("span", {
                    style: qe({ width: u(V.confidence) })
                  }, null, 4)
                ]),
                N(o(u(V.confidence)), 1),
                m[0] || (m[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              V.failed ? h("", !0) : (a(), n("span", Qo, [
                t("span", {
                  class: Q(["chip", V.verified ? "primary" : "warn"]),
                  title: V.reason
                }, [
                  b(p(B), {
                    icon: V.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  N(o(V.verified ? "Verified" : "Check"), 1)
                ], 10, Jo),
                V.verification ? (a(), n("span", Yo, o(p(Nt)(V.verification)), 1)) : h("", !0),
                V.codes?.includes("context_budget_partial") ? (a(), n("span", Xo, "Partial context")) : h("", !0),
                V.missing ? h("", !0) : (a(), n("span", Zo, o(V.complete === !0 ? "Complete" : V.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              b(p(B), {
                icon: v.value === V.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, Go),
            !V.failed && !V.missing && f(V.value) ? (a(), J(Be, {
              key: 0,
              class: "structured-value",
              value: V.value
            }, null, 8, ["value"])) : h("", !0),
            V.failed ? (a(), J(Mt, {
              key: 1,
              error: V.error
            }, null, 8, ["error"])) : h("", !0),
            W(t("div", _o, [
              !V.failed && !V.missing && !f(V.value) ? (a(), J(Be, {
                key: 0,
                value: V.value
              }, null, 8, ["value"])) : h("", !0),
              (a(!0), n(A, null, O(V.evidence, (s, d) => (a(), n("blockquote", {
                key: d,
                class: Q({ unfound: s.found === !1 })
              }, [
                t("p", null, "“" + o(s.quote) + "”", 1),
                t("cite", null, [
                  N(o(s.section), 1),
                  s.page !== void 0 && s.page !== null ? (a(), n(A, { key: 0 }, [
                    N(" · Page " + o(s.page), 1)
                  ], 64)) : h("", !0),
                  s.found === !1 ? (a(), n(A, { key: 1 }, [
                    N(" · not found word for word in the document")
                  ], 64)) : h("", !0)
                ])
              ], 2))), 128)),
              V.evidence.length ? h("", !0) : (a(), n("p", ei, "No evidence.")),
              V.reason || !V.verified && !V.failed ? (a(), n("p", ti, o(V.reason || "No reason recorded"), 1)) : h("", !0)
            ], 512), [
              [We, v.value === V.path && !V.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), li = { class: "test" }, ai = { class: "run-bar" }, ni = { class: "run-input" }, si = { class: "muted run-note" }, oi = {
  key: 0,
  class: "empty"
}, ii = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, di = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, ui = {
  key: 3,
  class: "test-grid"
}, ri = { class: "block" }, ci = { class: "block-head" }, vi = { class: "muted push" }, mi = { class: "block" }, pi = { class: "timeline" }, bi = { class: "tl-icon" }, fi = { class: "tl-main" }, gi = { class: "tl-head" }, hi = { class: "muted push" }, yi = { class: "tl-bar" }, ki = { class: "muted" }, xi = {
  key: 0,
  class: "tl-msg"
}, $i = {
  key: 1,
  class: "chips"
}, wi = /* @__PURE__ */ G({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(""), f = (C) => `${(C / 1e3).toFixed(1)}s`, k = M(() => Math.max(1, ...l.result?.trace.map((C) => C.duration_ms) ?? [1])), r = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, w = (C) => r[C]?.label ?? xe[C] ?? C, q = (C) => r[C]?.icon ?? at[C] ?? "tabler:point";
    return (C, m) => (a(), n("div", li, [
      t("section", ai, [
        t("div", ni, [
          b(Ut, {
            value: u.value,
            onSelect: m[0] || (m[0] = ($) => u.value = $)
          }, null, 8, ["value"])
        ]),
        b(p(ue), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: m[1] || (m[1] = ($) => v("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", si, o(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + o(e.retention) + ".", 1)
      ]),
      e.result ? h("", !0) : (a(), n("p", oi, "No extraction results yet.")),
      e.result?.status === "failed" ? (a(), n("p", ii, [
        b(p(B), { icon: "tabler:alert-triangle" }),
        N("The run stopped: " + o(e.result.error), 1)
      ])) : h("", !0),
      e.result?.status === "partial" ? (a(), n("p", di, [
        b(p(B), { icon: "tabler:alert-triangle" }),
        m[2] || (m[2] = N("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : h("", !0),
      e.result ? (a(), n("div", ui, [
        t("section", ri, [
          t("header", ci, [
            m[3] || (m[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", vi, [
              N(o(e.result.tokens.toLocaleString()) + " tokens · " + o(f(e.result.duration_ms)), 1),
              e.result.page_range ? (a(), n(A, { key: 0 }, [
                N(" · Pages " + o(e.result.page_range.first) + "–" + o(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (a(), n(A, { key: 1 }, [
                N(" · " + o(e.result.pages) + " pages", 1)
              ], 64)) : h("", !0)
            ])
          ]),
          b(At, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", mi, [
          m[4] || (m[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", pi, [
            (a(!0), n(A, null, O(e.result.trace, ($, V) => (a(), n("li", {
              key: V,
              class: Q($.status)
            }, [
              t("span", bi, [
                b(p(B), {
                  icon: q($.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", fi, [
                t("div", gi, [
                  t("strong", null, o(w($.kind)), 1),
                  t("span", hi, o(f($.duration_ms)), 1)
                ]),
                t("span", yi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, $.duration_ms / k.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", ki, [
                  N(o($.scope), 1),
                  $.pages ? (a(), n(A, { key: 0 }, [
                    N(" · Pages " + o($.pages.first) + "–" + o($.pages.last), 1)
                  ], 64)) : h("", !0),
                  $.model ? (a(), n(A, { key: 1 }, [
                    N(" · " + o($.model), 1)
                  ], 64)) : h("", !0),
                  N(" · " + o(($.input_tokens + $.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                $.message ? (a(), n("p", xi, o($.message), 1)) : h("", !0),
                $.queries?.length ? (a(), n("div", $i, [
                  (a(!0), n(A, null, O($.queries, (s) => (a(), n("span", {
                    key: s,
                    class: "chip"
                  }, o(s), 1))), 128))
                ])) : h("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : h("", !0)
    ]));
  }
});
function He(e, i = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === i.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === i.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const Vi = { class: "evals" }, Ci = { class: "block eval-run" }, Si = { class: "eval-run-main" }, Ei = { class: "block-title" }, qi = {
  key: 0,
  class: "eval-note"
}, Ui = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ni = { class: "bar" }, Mi = { class: "muted" }, Ai = { class: "stat-row" }, Ri = { class: "stat" }, Bi = { class: "stat-label" }, Li = { class: "stat-value" }, Ti = { class: "stat" }, Pi = { class: "stat-value" }, Di = { class: "stat-delta flat" }, Fi = { class: "stat" }, Ii = { class: "stat-value" }, Oi = {
  key: 0,
  class: "stat-delta flat"
}, ji = { class: "stat" }, zi = { class: "stat-value" }, Wi = {
  key: 0,
  class: "stat-delta flat"
}, Gi = { class: "block" }, Ki = { class: "block-head" }, Hi = {
  key: 0,
  class: "compare-pick push"
}, Qi = ["value"], Ji = ["value"], Yi = {
  key: 0,
  class: "block-empty"
}, Xi = {
  key: 1,
  class: "table-scroll"
}, Zi = { key: 0 }, _i = { key: 1 }, ed = { class: "mono" }, td = { class: "acc strong" }, ld = { class: "bar" }, ad = { class: "muted" }, nd = {
  key: 0,
  class: "muted"
}, sd = { key: 1 }, od = {
  key: 1,
  class: "muted"
}, id = {
  key: 1,
  class: "block"
}, dd = { class: "table-scroll" }, ud = { class: "metric-table result-matrix" }, rd = ["aria-expanded", "onClick"], cd = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, vd = ["colspan"], md = {
  key: 0,
  class: "cell-state"
}, pd = ["data-error-kind", "title"], bd = ["data-label"], fd = ["title"], gd = {
  key: 0,
  class: "result-detail"
}, hd = ["colspan"], yd = ["data-error-kind", "title"], kd = { class: "mono" }, xd = { class: "cmp" }, $d = { class: "cmp" }, wd = {
  key: 0,
  class: "value-checks"
}, Vd = {
  key: 1,
  class: "chip",
  "aria-label": "Verification method"
}, Cd = { class: "muted case-meta" }, Sd = { class: "block" }, Ed = { class: "block-head" }, qd = { class: "count" }, Ud = { class: "mono" }, Nd = ["onUpdate:modelValue"], Md = ["onUpdate:modelValue"], Ad = ["onUpdate:modelValue", "placeholder"], Rd = ["onUpdate:modelValue", "type"], Bd = {
  key: 0,
  class: "error",
  role: "alert"
}, Ld = { class: "row" }, Td = {
  key: 1,
  class: "block-empty"
}, Pd = {
  key: 2,
  class: "block-empty"
}, Dd = {
  key: 3,
  class: "table-scroll"
}, Fd = { class: "metric-table case-table" }, Id = { class: "case-value" }, Od = {
  key: 1,
  class: "muted"
}, jd = { class: "num" }, zd = ["aria-label", "disabled", "onClick"], Wd = {
  key: 2,
  class: "block"
}, Gd = { class: "block-head" }, Kd = { class: "count" }, Hd = { class: "eval-history" }, Qd = ["aria-current", "onClick"], Jd = ["data-status"], Yd = { class: "muted" }, Xd = { class: "push" }, Zd = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(!1), f = R(""), k = R({}), r = R("");
    be(() => l.addedCaseId, () => {
      u.value = !1, f.value = "", k.value = {};
    });
    function w(S, g) {
      return S.type === "number" ? Number(g) : S.type === "boolean" ? g === "true" : S.type === "list" || S.type === "object" ? JSON.parse(g) : g;
    }
    function q() {
      r.value = "";
      const S = {};
      try {
        for (const g of l.fields) {
          const x = String(k.value[H(g)] ?? "").trim();
          x && wt(S, H(g), w(g, x));
        }
      } catch {
        r.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      v("add-case", { upload_id: f.value, expected: S });
    }
    const C = M(() => l.evaluations.find((S) => !je(S))), m = M(() => l.evaluations.filter(je)), $ = M(() => l.evaluation), V = M(() => ({ done: ($.value?.results ?? []).filter((g) => g.status !== "queued").length, total: $.value?.case_count ?? 0 })), s = R();
    be(() => $.value?.id, () => {
      s.value = void 0;
    });
    const d = M(() => {
      if (!$.value) return;
      if (s.value) return m.value.find((g) => g.id === s.value);
      const S = m.value.findIndex((g) => g.id === $.value.id);
      return S >= 0 ? m.value[S + 1] : m.value[0];
    }), U = M(() => ($.value?.metrics ?? []).map((S) => ({ ...S, before: d.value?.metrics.find((g) => g.field === S.field) }))), z = M(() => ($.value?.fields ?? []).map(H)), I = M(() => Te(l.fields.map(H))), j = (S, g) => S.scores.find((x) => x.field === g), K = R(), D = (S) => `${Math.round(S * 100)}%`, P = (S) => {
      const g = Math.round(S * 100);
      return `${g > 0 ? "+" : g < 0 ? "−" : "±"}${Math.abs(g)} pts`;
    }, T = (S) => Math.round(S * 100) > 0 ? "up" : Math.round(S * 100) < 0 ? "down" : "flat", de = (S) => S >= 6e4 ? `${Math.floor(S / 6e4)}m ${Math.round(S % 6e4 / 1e3)}s` : `${(S / 1e3).toFixed(1)}s`, ke = (S) => S == null || S === "" ? "—" : typeof S == "string" ? S : Array.isArray(S) && S.every((g) => typeof g != "object") ? S.join(", ") : JSON.stringify(S), le = (S) => S ? S.failed ? "fail" : S.score >= 0.999 ? "pass" : S.score > 0 ? "partial" : "fail" : "none", oe = (S) => (S.results ?? []).filter((g) => g.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (S, g) => (a(), n("div", Vi, [
      t("section", Ci, [
        t("div", Si, [
          t("div", null, [
            t("h2", Ei, "Evaluate revision " + o(e.revision), 1),
            g[6] || (g[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (a(), n("p", qi, [
              b(p(B), { icon: "tabler:info-circle" }),
              g[5] || (g[5] = N("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : h("", !0)
          ]),
          b(p(ue), {
            label: C.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!C.value,
            disabled: !e.cases.length || !e.fields.length || !!C.value || e.starting,
            onClick: g[0] || (g[0] = (x) => v("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        $.value && !p(je)($.value) ? (a(), n("div", Ui, [
          t("span", Ni, [
            t("span", {
              style: qe({ width: D(V.value.total ? V.value.done / V.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Mi, o(fe[$.value.status]) + " · " + o(V.value.done) + " of " + o(V.value.total) + " cases", 1)
        ])) : h("", !0)
      ]),
      $.value && p(je)($.value) ? (a(), n(A, { key: 0 }, [
        $.value.error ? (a(), n("p", {
          key: 0,
          class: Q($.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          b(p(B), { icon: "tabler:alert-triangle" }),
          N(o($.value.error), 1)
        ], 2)) : h("", !0),
        t("div", Ai, [
          t("div", Ri, [
            t("span", Bi, "Accuracy · revision " + o($.value.config_revision), 1),
            t("span", Li, o(D(p(Ce)($.value))), 1),
            d.value ? (a(), n("span", {
              key: 0,
              class: Q(["stat-delta", T(p(Ce)($.value) - p(Ce)(d.value))])
            }, o(P(p(Ce)($.value) - p(Ce)(d.value))) + " vs revision " + o(d.value.config_revision), 3)) : h("", !0)
          ]),
          t("div", Ti, [
            g[7] || (g[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Pi, [
              N(o(oe($.value)), 1),
              t("small", null, " / " + o($.value.case_count), 1)
            ]),
            t("span", Di, o(($.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + o(($.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Fi, [
            g[8] || (g[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Ii, o($.value.tokens.toLocaleString()), 1),
            d.value ? (a(), n("span", Oi, o(d.value.tokens.toLocaleString()) + " before", 1)) : h("", !0)
          ]),
          t("div", ji, [
            g[9] || (g[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", zi, o(de($.value.duration_ms)), 1),
            d.value ? (a(), n("span", Wi, o(de(d.value.duration_ms)) + " before", 1)) : h("", !0)
          ])
        ]),
        t("section", Gi, [
          t("header", Ki, [
            g[11] || (g[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            m.value.length > 1 ? (a(), n("label", Hi, [
              g[10] || (g[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: d.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: g[1] || (g[1] = (x) => s.value = x.target.value)
              }, [
                (a(!0), n(A, null, O(m.value.filter((x) => x.id !== $.value.id), (x) => (a(), n("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + o(x.config_revision) + " · " + o(p(He)(x.created_at)), 9, Ji))), 128))
              ], 40, Qi)
            ])) : h("", !0)
          ]),
          U.value.length ? (a(), n("div", Xi, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!d.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  g[12] || (g[12] = t("th", null, "Field", -1)),
                  g[13] || (g[13] = t("th", null, "Accuracy", -1)),
                  g[14] || (g[14] = t("th", null, "Verified", -1)),
                  d.value ? (a(), n("th", Zi, "Revision " + o(d.value.config_revision), 1)) : h("", !0),
                  d.value ? (a(), n("th", _i, "Change")) : h("", !0)
                ])
              ]),
              t("tbody", null, [
                (a(!0), n(A, null, O(U.value, (x) => (a(), n("tr", {
                  key: x.field
                }, [
                  t("td", ed, o(x.field), 1),
                  t("td", null, [
                    t("span", td, [
                      t("span", ld, [
                        t("span", {
                          style: qe({ width: D(x.accuracy) })
                        }, null, 4)
                      ]),
                      N(o(D(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", ad, o(D(x.verified)), 1),
                  d.value ? (a(), n("td", nd, o(x.before ? D(x.before.accuracy) : "—"), 1)) : h("", !0),
                  d.value ? (a(), n("td", sd, [
                    x.before ? (a(), n("span", {
                      key: 0,
                      class: Q(["trend", T(x.accuracy - x.before.accuracy)])
                    }, [
                      b(p(B), {
                        icon: T(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : T(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      N(o(P(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (a(), n("span", od, "New field"))
                  ])) : h("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (a(), n("p", Yi, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : h("", !0),
      $.value?.results?.length ? (a(), n("section", id, [
        g[19] || (g[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", dd, [
          t("table", ud, [
            t("thead", null, [
              t("tr", null, [
                g[15] || (g[15] = t("th", null, "Document", -1)),
                (a(!0), n(A, null, O(z.value, (x) => (a(), n("th", {
                  key: x,
                  class: "mono"
                }, o(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (a(!0), n(A, null, O($.value.results, (x) => (a(), n(A, {
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
                      onClick: (L) => K.value = K.value === x.case_id ? void 0 : x.case_id
                    }, [
                      b(p(B), {
                        icon: K.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      N(o(x.upload_name), 1)
                    ], 8, rd),
                    x.status === "partial" ? (a(), n("span", cd, "Partial")) : h("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (a(), n("td", {
                    key: 0,
                    colspan: z.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (a(), n("span", md, [
                      b(p(B), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      g[16] || (g[16] = N("Waiting", -1))
                    ])) : (a(), n("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      b(p(B), { icon: "tabler:alert-triangle" }),
                      N(o(x.error?.message), 1)
                    ], 8, pd))
                  ], 8, vd)) : (a(!0), n(A, { key: 1 }, O(z.value, (L) => (a(), n("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", le(j(x, L))]),
                      title: ke(j(x, L)?.value)
                    }, o(j(x, L)?.failed ? "Failed" : j(x, L) ? D(j(x, L).score) : "—"), 11, fd)
                  ], 8, bd))), 128))
                ], 2),
                K.value === x.case_id ? (a(), n("tr", gd, [
                  t("td", {
                    colspan: z.value.length + 1
                  }, [
                    x.error ? (a(), n("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, o(x.error.message), 9, yd)) : h("", !0),
                    b(Re, {
                      node: p(Te)(x.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (a(!0), n(A, null, O([x.scores[L]], (F) => (a(), n("dl", {
                          key: F.field,
                          class: "compare"
                        }, [
                          t("dt", kd, o(F.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", le(F)])
                            }, o(F.failed ? "Failed" : D(F.score)), 3),
                            t("div", xd, [
                              g[17] || (g[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              b(Be, {
                                value: F.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", $d, [
                              g[18] || (g[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              F.failed ? (a(), J(Mt, {
                                key: 0,
                                error: F.error
                              }, null, 8, ["error"])) : (a(), J(Be, {
                                key: 1,
                                value: F.value
                              }, null, 8, ["value"]))
                            ]),
                            !F.failed || F.verification ? (a(), n("span", wd, [
                              F.failed ? h("", !0) : (a(), n("span", {
                                key: 0,
                                class: Q(["chip", F.verified ? "primary" : "warn"])
                              }, [
                                b(p(B), {
                                  icon: F.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                N(o(F.verified ? "Verified" : "Unverified"), 1)
                              ], 2)),
                              F.verification ? (a(), n("span", Vd, o(p(Nt)(F.verification)), 1)) : h("", !0)
                            ])) : h("", !0)
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", Cd, o(x.tokens.toLocaleString()) + " tokens · " + o(de(x.duration_ms)), 1)
                  ], 8, hd)
                ])) : h("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : h("", !0),
      t("section", Sd, [
        t("header", Ed, [
          g[20] || (g[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", qd, o(e.cases.length), 1),
          b(p(ue), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: g[2] || (g[2] = (x) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (a(), n("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(q, ["prevent"])
        }, [
          t("label", null, [
            g[21] || (g[21] = N("Document", -1)),
            b(Ut, {
              value: f.value,
              onSelect: g[3] || (g[3] = (x) => {
                f.value = x;
              })
            }, null, 8, ["value"])
          ]),
          g[24] || (g[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          b(Re, { node: I.value }, {
            default: me(({ index: x }) => [
              (a(!0), n(A, null, O([e.fields[x]], (L) => (a(), n("label", {
                key: p(H)(L)
              }, [
                t("span", Ud, o(L.name), 1),
                L.type === "boolean" ? W((a(), n("select", {
                  key: 0,
                  "onUpdate:modelValue": (F) => k.value[p(H)(L)] = F
                }, [...g[22] || (g[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Nd)), [
                  [ze, k.value[p(H)(L)]]
                ]) : L.type === "enum" ? W((a(), n("select", {
                  key: 1,
                  "onUpdate:modelValue": (F) => k.value[p(H)(L)] = F
                }, [
                  g[23] || (g[23] = t("option", { value: "" }, "Not stated", -1)),
                  (a(!0), n(A, null, O(L.enum_values, (F) => (a(), n("option", { key: F }, o(F), 1))), 128))
                ], 8, Md)), [
                  [ze, k.value[p(H)(L)]]
                ]) : L.type === "object" || L.type === "list" ? W((a(), n("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (F) => k.value[p(H)(L)] = F,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Ad)), [
                  [_, k.value[p(H)(L)]]
                ]) : W((a(), n("input", {
                  key: 3,
                  "onUpdate:modelValue": (F) => k.value[p(H)(L)] = F,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Rd)), [
                  [nl, k.value[p(H)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          r.value ? (a(), n("p", Bd, o(r.value), 1)) : h("", !0),
          t("div", Ld, [
            b(p(ue), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !f.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            b(p(ue), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: g[4] || (g[4] = (x) => u.value = !1)
            })
          ])
        ], 32)) : h("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (a(), n("p", Pd, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (a(), n("div", Dd, [
          t("table", Fd, [
            g[25] || (g[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (a(!0), n(A, null, O(e.cases, (x) => (a(), n("tr", {
                key: x.id
              }, [
                t("td", null, [
                  b(p(B), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  N(" " + o(x.upload_name), 1)
                ]),
                t("td", null, [
                  b(Re, { node: I.value }, {
                    default: me(({ index: L }) => [
                      t("div", Id, [
                        t("strong", null, o(e.fields[L].name), 1),
                        p(gt)(x.expected, p(H)(e.fields[L])) !== void 0 ? (a(), J(Be, {
                          key: 0,
                          value: p(gt)(x.expected, p(H)(e.fields[L]))
                        }, null, 8, ["value"])) : (a(), n("span", Od, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", jd, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => v("delete-case", x.id)
                  }, [
                    b(p(B), { icon: "tabler:trash" })
                  ], 8, zd)
                ])
              ]))), 128))
            ])
          ])
        ])) : h("", !0) : (a(), n("p", Td, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (a(), n("section", Wd, [
        t("header", Gd, [
          g[26] || (g[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", Kd, o(e.evaluations.length), 1)
        ]),
        t("ul", Hd, [
          (a(!0), n(A, null, O(e.evaluations, (x) => (a(), n("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: $.value?.id === x.id }),
              "aria-current": $.value?.id === x.id,
              onClick: (L) => v("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, o(fe[x.status]), 9, Jd),
              t("span", null, "Revision " + o(x.config_revision), 1),
              t("span", Yd, o(p(He)(x.created_at)), 1),
              t("strong", Xd, o(x.status === "completed" || x.status === "partial" ? D(p(Ce)(x)) : "—"), 1)
            ], 10, Qd)
          ]))), 128))
        ])
      ])) : h("", !0)
    ]));
  }
}), _d = { class: "section-head" }, eu = { class: "muted" }, tu = {
  key: 0,
  class: "empty"
}, lu = {
  key: 1,
  class: "table-scroll"
}, au = { class: "metric-table runs-table" }, nu = ["aria-label", "aria-expanded", "onClick"], su = { class: "caller" }, ou = {
  key: 0,
  class: "muted"
}, iu = ["data-status"], du = {
  class: "num",
  "data-label": "Time"
}, uu = {
  class: "num",
  "data-label": "Tokens"
}, ru = {
  class: "muted",
  "data-label": "Expires"
}, cu = {
  key: 0,
  class: "result-detail"
}, vu = { colspan: "6" }, mu = /* @__PURE__ */ G({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const i = R(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (v, u) => (a(), n(A, null, [
      t("div", _d, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", eu, "Runs expire after " + o(e.retention), 1)
      ]),
      e.runs.length ? (a(), n("div", lu, [
        t("table", au, [
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
            (a(!0), n(A, null, O(e.runs, (f) => (a(), n(A, {
              key: f.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${f.id}`,
                    "aria-expanded": i.value === f.id,
                    onClick: (k) => i.value = i.value === f.id ? void 0 : f.id
                  }, [
                    b(p(B), {
                      icon: i.value === f.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    N(o(p(He)(f.created_at)), 1)
                  ], 8, nu)
                ]),
                t("td", null, [
                  t("span", su, [
                    b(p(B), {
                      icon: l[f.caller].icon
                    }, null, 8, ["icon"]),
                    N(o(l[f.caller].label), 1)
                  ]),
                  f.result.page_range ? (a(), n("span", ou, " · Pages " + o(f.result.page_range.first) + "–" + o(f.result.page_range.last), 1)) : h("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": f.status
                  }, o(f.status === "completed" ? "Completed" : f.status === "partial" ? "Partial" : "Failed"), 9, iu)
                ]),
                t("td", du, o((f.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", uu, o(Number(f.tokens).toLocaleString()), 1),
                t("td", ru, o(p(He)(f.expires_at)), 1)
              ]),
              i.value === f.id ? (a(), n("tr", cu, [
                t("td", vu, [
                  b(At, {
                    fields: f.result.fields,
                    "page-range": f.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : h("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (a(), n("p", tu, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), pu = {
  key: 0,
  role: "alert",
  class: "error banner"
}, bu = /* @__PURE__ */ G({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(), f = R("");
    return Ue(async () => {
      try {
        await Je("kickside-share", { timeoutMs: 8e3 });
      } catch (w) {
        f.value = `Sharing is unavailable: ${w instanceof Error ? w.message : String(w)}`;
        return;
      }
      const k = document.createElement("kickside-share"), r = encodeURIComponent(l.id);
      k.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${r}`, share_url: `/api/v1/component-access/share/${r}` })), k.style.display = "block", k.addEventListener("close", () => v("close")), u.value?.appendChild(k);
    }), (k, r) => (a(), n("div", {
      ref_key: "host",
      ref: u
    }, [
      f.value ? (a(), n("p", pu, o(f.value), 1)) : h("", !0)
    ], 512));
  }
}), fu = { class: "docscout" }, gu = { class: "toolbar" }, hu = { class: "toolbar-lead" }, yu = { class: "crumb-row" }, ku = { class: "crumb" }, xu = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, $u = ["id", "aria-selected", "aria-controls", "onClick"], wu = { class: "toolbar-side" }, Vu = { class: "stats" }, Cu = ["title"], Su = {
  key: 2,
  class: "unsaved"
}, Eu = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, qu = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Uu = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Nu = ["id", "aria-labelledby"], Mu = /* @__PURE__ */ G({
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
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(), f = R(!1), k = R("Builder"), r = R(ht()), w = R(""), q = R(""), C = M(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    be(k, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const m = R(), $ = R(), V = M(() => l.snapshot.can_edit && m.value !== l.snapshot.expected_revision), s = M(() => V.value && $.value !== l.snapshot.expected_revision);
    function d(D) {
      return w.value === D.title && q.value === (D.description ?? "") && kl(r.value, D.config);
    }
    function U() {
      const D = l.snapshot;
      r.value = structuredClone(pt(D.config ?? ht())), w.value = D.title, q.value = D.description ?? "", m.value = D.expected_revision, $.value = void 0;
    }
    be(() => l.snapshot, (D, P) => {
      C.value.includes(k.value) || (k.value = C.value[0]), !(P && D.id === P.id && D.can_edit && P.can_edit && !d(P) && !d(D)) && U();
    }, { immediate: !0 });
    const z = M(() => l.snapshot.can_edit && !d(l.snapshot)), I = M(() => yl(r.value)), j = M(() => Object.keys(xe).filter((D) => Ge(r.value, D)).length);
    function K() {
      v("save", { title: w.value, description: q.value, config: structuredClone(pt(r.value)), expected_revision: m.value });
    }
    return (D, P) => (a(), n("main", fu, [
      t("div", gu, [
        t("div", hu, [
          t("span", yu, [
            e.back ? (a(), n("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: P[0] || (P[0] = (T) => v("back"))
            }, [
              b(p(B), { icon: "tabler:arrow-left" })
            ])) : h("", !0),
            t("span", ku, o(e.snapshot.title), 1)
          ]),
          t("nav", xu, [
            (a(!0), n(A, null, O(C.value, (T) => (a(), n("button", {
              id: `tab-${T}`,
              key: T,
              role: "tab",
              "aria-selected": k.value === T,
              "aria-controls": `panel-${T}`,
              onClick: (de) => k.value = T
            }, o(T), 9, $u))), 128))
          ])
        ]),
        t("div", wu, [
          e.snapshot.can_share ? (a(), J(p(ue), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: P[1] || (P[1] = (T) => f.value = !0)
          }, {
            default: me(() => [
              b(p(B), { icon: "tabler:share" }),
              P[11] || (P[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : h("", !0),
          t("span", Vu, [
            N(o(e.snapshot.field_count) + " " + o(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (a(), n(A, { key: 0 }, [
              N(" · " + o(j.value) + " steps · revision " + o(e.snapshot.expected_revision), 1)
            ], 64)) : (a(), n(A, { key: 1 }, [
              N(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (a(), n(A, { key: 1 }, [
            V.value && !s.value ? (a(), J(p(ue), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: U
            })) : h("", !0),
            I.value ? (a(), n("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: I.value
            }, [
              b(p(B), { icon: "tabler:alert-circle" }),
              N(o(I.value), 1)
            ], 8, Cu)) : z.value ? (a(), n("span", Su, "Unsaved")) : h("", !0),
            b(p(ue), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !z.value || !!I.value || !w.value.trim(),
              onClick: K
            }, null, 8, ["loading", "disabled"])
          ], 64)) : h("", !0)
        ])
      ]),
      s.value ? (a(), n("div", Eu, [
        t("span", null, "Saved configuration changed to revision " + o(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        b(p(ue), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: U
        }),
        b(p(ue), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: P[2] || (P[2] = (T) => $.value = e.snapshot.expected_revision)
        })
      ])) : h("", !0),
      e.error ? (a(), n("p", qu, o(e.error), 1)) : h("", !0),
      f.value ? (a(), J(bu, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: P[3] || (P[3] = (T) => f.value = !1)
      }, null, 8, ["id", "title"])) : h("", !0),
      k.value === "Builder" && e.snapshot.can_edit ? (a(), n("div", Uu, [
        b(Ro, {
          title: w.value,
          "onUpdate:title": P[4] || (P[4] = (T) => w.value = T),
          description: q.value,
          "onUpdate:description": P[5] || (P[5] = (T) => q.value = T),
          config: r.value,
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
          id: `panel-${k.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${k.value}`,
          class: "panel"
        }, [
          k.value === "Test" ? (a(), J(wi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: P[6] || (P[6] = (T) => v("run", T))
          }, null, 8, ["result", "retention", "running", "can-run"])) : h("", !0),
          k.value === "Evals" && e.snapshot.can_edit ? (a(), J(Zd, {
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
            onAddCase: P[7] || (P[7] = (T) => v("add-case", T)),
            onDeleteCase: P[8] || (P[8] = (T) => v("delete-case", T)),
            onEvaluate: P[9] || (P[9] = (T) => v("evaluate")),
            onOpen: P[10] || (P[10] = (T) => v("open-evaluation", T))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : h("", !0),
          k.value === "Runs" ? (a(), J(mu, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : h("", !0)
        ], 8, Nu)
      ], 512))
    ]));
  }
}), Au = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Ru = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, ju = /* @__PURE__ */ G({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: i }) {
    const l = e, v = i, u = R(), f = R(""), k = R(!1), r = R(!1), w = R(!1), q = R(), C = R(null), m = R([]), $ = R();
    let V = [], s = 0, d = 0, U = 0, z;
    const I = (S) => S instanceof Error ? S.message : String(S), j = (S) => S === s;
    async function K(S, g) {
      const x = ++U;
      g && (z = g);
      const L = () => j(S) && x === U;
      try {
        const F = l.id, Ne = await he.evaluations(F);
        if (!L()) return;
        m.value = Ne;
        const ge = z ?? Ne[0]?.id;
        if (ge) {
          const Pe = await he.evaluation(F, ge);
          if (!L() || Pe.id !== (z ?? ge)) return;
          $.value = Pe;
        }
      } catch (F) {
        L() && (f.value = I(F));
      }
    }
    async function D(S) {
      const g = ++d, x = () => j(S) && g === d;
      if (!l.id) {
        f.value = "No extractor selected.";
        return;
      }
      try {
        const L = await he.get(l.id);
        if (!x()) return;
        u.value = L, f.value = "", L.can_edit && await K(S);
      } catch (L) {
        x() && (f.value = I(L));
      }
    }
    be(() => l.id, (S, g) => {
      s++, z = void 0, V.forEach((L) => L()), V = [], q.value = void 0, u.value = void 0, C.value = null, m.value = [], $.value = void 0, f.value = "";
      const x = s;
      l.id && (V = [bt(`component.${l.id}`, () => D(x)), bt(`docscout.runs.${l.id}`, () => D(x))]), g !== void 0 && D(x);
    }, { immediate: !0 }), sl(() => D(s)), kt(() => {
      s++, V.forEach((S) => S());
    });
    async function P(S) {
      const g = s;
      k.value = !0, f.value = "";
      try {
        const x = await S();
        if (j(g))
          return await D(g), x;
      } catch (x) {
        j(g) && (f.value = I(x));
      } finally {
        k.value = !1;
      }
    }
    const T = (S) => P(() => he.update(l.id, S));
    async function de(S) {
      const g = s, x = await P(() => he.addCase(l.id, S));
      x && j(g) && (q.value = x.id);
    }
    const ke = (S) => P(() => he.deleteCase(l.id, S));
    async function le(S) {
      const g = s;
      r.value = !0, f.value = "";
      try {
        const x = await he.run(l.id, S);
        j(g) && (C.value = x, await D(g));
      } catch (x) {
        if (j(g)) {
          const L = x?.response?.data?.error;
          f.value = u.value?.config?.stages.extract.reads === "pages" && L ? L : I(x);
        }
      } finally {
        r.value = !1;
      }
    }
    async function oe() {
      const S = s;
      w.value = !0, f.value = "";
      try {
        const { eval_id: g } = await he.evaluate(l.id);
        j(S) && await K(S, g);
      } catch (g) {
        j(S) && (f.value = I(g));
      } finally {
        w.value = !1;
      }
    }
    function fe(S) {
      K(s, S);
    }
    return (S, g) => u.value ? (a(), J(Mu, {
      key: 0,
      snapshot: u.value,
      "added-case-id": q.value,
      saving: k.value,
      running: r.value,
      starting: w.value,
      result: C.value,
      evaluations: m.value,
      evaluation: $.value,
      error: f.value,
      back: e.back,
      onBack: g[0] || (g[0] = (x) => v("back")),
      onRun: le,
      onSave: T,
      onAddCase: de,
      onDeleteCase: ke,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : f.value ? (a(), n("p", Au, o(f.value), 1)) : (a(), n("p", Ru, "Loading Docscout…"));
  }
});
export {
  ju as _,
  He as w
};
