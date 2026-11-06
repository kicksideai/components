import { defineComponent as z, useModel as Le, openBlock as n, createElementBlock as s, withModifiers as ve, createElementVNode as t, mergeModels as Qe, computed as N, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as p, toDisplayString as d, Fragment as M, renderList as I, createCommentVNode as y, createTextVNode as q, createBlock as J, ref as U, useId as pe, watch as be, withDirectives as W, vModelText as ee, vModelSelect as ze, resolveComponent as lt, renderSlot as Oe, withCtx as me, mergeProps as mt, vShow as We, onMounted as Ne, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as kt, vModelDynamic as al, toRaw as pt } from "vue";
import { b as nl } from "./wc-runtime-DUvG5Zds.js";
import { loadByTagName as Je, on as bt } from "@wippy-fe/proxy";
import { i as Ge, f as $t, t as _e, s as ke, a as at, b as sl, m as xt, d as K, M as Ae, e as wt, g as Vt, h as et, j as ol, k as il, l as dl, o as ul, p as rl, q as St, r as cl, u as vl, v as ml, w as pl, x as ft, y as bl, z as Xe, A as fl, B as Te, C as hl, D as ht, n as gt, E as gl, F as yl, c as ge } from "./config-mzfyYps4.js";
import ue from "primevue/button";
import { Icon as A } from "@iconify/vue";
import kl from "primevue/focustrap";
import Ct from "primevue/menu";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const $l = ["aria-checked", "aria-label", "disabled"], _ = /* @__PURE__ */ z({
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
    return (l, v) => (n(), s("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": o.value,
      "aria-label": e.label,
      disabled: e.disabled,
      onClick: v[0] || (v[0] = ve((r) => o.value = !o.value, ["stop"]))
    }, [...v[1] || (v[1] = [
      t("span", null, null, -1)
    ])], 8, $l));
  }
}), xl = ["aria-label"], wl = { class: "node-icon" }, Vl = { class: "node-main" }, Sl = { class: "node-title" }, Cl = { class: "node-summary" }, El = {
  key: 0,
  class: "chips"
}, ql = {
  key: 1,
  class: "trace-line"
}, Nl = { class: "node-side" }, Ul = {
  key: 0,
  class: "chip model"
}, we = /* @__PURE__ */ z({
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
    const l = e, v = o, r = N(() => Ge(l.config, l.stage)), b = N(() => l.config.stages[l.stage].model), k = N({ get: () => r.value, set: (S) => {
      l.config.stages[l.stage].enabled = S;
    } }), u = N(() => {
      const S = l.config, f = S.stages;
      switch (l.stage) {
        case "map":
          return S.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...f.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...S.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return f.scout.mode === "agent" ? f.scout.tools.map((a) => ({ text: _e(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return S.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return $t(S).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), $ = (S) => [`${(S.duration_ms / 1e3).toFixed(1)}s`, `${(S.input_tokens + S.output_tokens).toLocaleString()} tokens`, S.queries?.length ? `${S.queries.length} queries` : "", S.message ?? ""].filter(Boolean).join(" · ");
    return (S, f) => (n(), s("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !r.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m(ke)[e.stage],
      onClick: f[1] || (f[1] = (a) => v("select")),
      onKeydown: [
        f[2] || (f[2] = Ee((a) => v("select"), ["enter"])),
        f[3] || (f[3] = Ee(ve((a) => v("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", wl, [
        p(m(A), {
          icon: m(at)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Vl, [
        t("span", Sl, d(m(ke)[e.stage]), 1),
        t("span", Cl, d(r.value ? m(sl)(e.stage, e.config) : "Off"), 1),
        r.value && u.value.length ? (n(), s("span", El, [
          (n(!0), s(M, null, I(u.value, (a) => (n(), s("span", {
            key: a.text,
            class: Q(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, d(a.text), 3))), 128))
        ])) : y("", !0),
        e.trace ? (n(), s("span", ql, [
          p(m(A), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(d($(e.trace)), 1)
        ])) : y("", !0)
      ]),
      t("span", Nl, [
        r.value && b.value ? (n(), s("span", Ul, d(m(xt)(b.value)), 1)) : y("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), J(_, {
          key: 1,
          modelValue: k.value,
          "onUpdate:modelValue": f[0] || (f[0] = (a) => k.value = a),
          label: `Enable ${m(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : y("", !0)
      ])
    ], 42, xl));
  }
}), Ml = ["aria-labelledby"], Al = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], $e = /* @__PURE__ */ z({
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
    const o = e, l = Le(e, "modelValue"), v = U([]);
    function r(b, k) {
      const u = o.options.length - 1, $ = { ArrowRight: k + 1, ArrowDown: k + 1, ArrowLeft: k - 1, ArrowUp: k - 1, Home: 0, End: u }[b.key];
      if ($ === void 0) return;
      b.preventDefault();
      const S = ($ + o.options.length) % o.options.length;
      l.value = o.options[S].value, v.value[S]?.focus();
    }
    return (b, k) => (n(), s("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), s(M, null, I(e.options, (u, $) => (n(), s("button", {
        key: u.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: v,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${u.label}` : void 0,
        "aria-checked": l.value === u.value,
        tabindex: l.value === u.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (S) => l.value = u.value,
        onKeydown: (S) => r(S, $)
      }, [
        u.icon ? (n(), J(m(A), {
          key: 0,
          icon: u.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        t("span", null, d(u.label), 1)
      ], 40, Al))), 128))
    ], 8, Ml));
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
  function l(v, r, b, k) {
    o.push({ field: r, trail: b, shape: v, path: k, depth: b.length + 1, key: ie(r, b) }), v.properties?.forEach((u, $) => l(u, r, [...b, $], `${k}.${u.name || "New property"}`)), v.item && l(v.item, r, [...b, "item"], `${k}[]`);
  }
  return e.forEach((v, r) => l(v, r, [], K(v) || "New field")), o;
}
function tt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(tt), e.item ? tt(e.item) : 0);
}
function Rl(e, o) {
  return Ke(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === o.field && ie(l.field, l.trail) === ie(o.field, o.trail.slice(0, -1))) && l.depth + tt(o.shape) <= Ae && !(l.field === o.field && o.trail.every((v, r) => l.trail[r] === v)));
}
function Ll(e, o, l) {
  const v = { ...Vt(), ...o.shape, name: o.shape.name };
  o.trail.length ? Ke(e).find((k) => k.key === ie(o.field, o.trail.slice(0, -1))).shape.properties.splice(o.trail.at(-1), 1) : e.splice(o.field, 1);
  let r;
  if (l) {
    const { name: b, type: k, description: u, enum_values: $, expected_format: S, required: f, properties: a, item: i } = v;
    r = { name: b, type: k, description: u, enum_values: $, expected_format: S, required: f, ...a ? { properties: a } : {}, ...i ? { item: i } : {} }, l.shape.properties.push(r), r = l.shape.properties.at(-1);
  } else
    r = { ...et(), ...v, group: "" }, e.push(r), r = e.at(-1);
  return Ke(e).find((b) => b.shape === r);
}
function yt(e, o = !1) {
  function l(r) {
    return r.type === "object" ? Object.fromEntries((r.properties ?? []).map((b) => [b.name || "unnamed", l(b)])) : r.type === "list" ? r.item ? [l(r.item)] : [] : o ? r.enum_values?.length ? r.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[r.type] : r.type === "enum" ? r.enum_values?.join(" | ") || "enum" : r.type;
  }
  const v = {};
  return e.forEach((r) => wt(v, K(r) || "unnamed", l(r))), v;
}
const Tl = { class: "shape-editor" }, Dl = { key: 0 }, Pl = ["aria-label", "aria-invalid", "aria-describedby"], Fl = { class: "label-block" }, Ol = ["id"], Il = { key: 0 }, jl = ["id"], zl = {
  key: 2,
  class: "label-block"
}, Wl = { class: "chips" }, Gl = ["aria-label", "onClick"], Kl = {
  key: 0,
  class: "row"
}, Hl = ["onKeydown"], Ql = {
  key: 1,
  class: "field-error",
  role: "alert"
}, Jl = { key: 3 }, Yl = ["placeholder"], Xl = {
  key: 4,
  class: "toggle-row"
}, Zl = { class: "muted" }, _l = ["aria-label", "disabled"], ea = /* @__PURE__ */ z({
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
    const l = e, v = o, r = N(() => l.shape), b = N(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), k = N(() => Et.filter((R) => l.depth < Ae || !["object", "list"].includes(R.value))), u = N({ get: () => l.shape.type, set: (R) => {
      l.shape.type = R, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], R === "object" && (l.shape.properties = []), R === "list" && (l.shape.item = ol());
    } }), $ = pe(), S = pe(), f = U(""), a = U("");
    be(() => l.shape, () => {
      f.value = "", a.value = "";
    });
    const i = N(() => l.validationError || (l.named ? il(r.value.name, l.siblingNames) : "") || dl(l.shape, l.depth));
    function P() {
      const R = f.value.trim(), C = l.shape.enum_values ?? [];
      if (!R || R.length > 200) {
        a.value = "Enter 1 to 200 characters.";
        return;
      }
      if (C.includes(R)) {
        a.value = "This value already exists.";
        return;
      }
      if (C.length >= 100) {
        a.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...C, R], f.value = "", a.value = "";
    }
    return (R, C) => (n(), s("div", Tl, [
      e.named ? (n(), s("label", Dl, [
        C[8] || (C[8] = q("Name", -1)),
        W(t("input", {
          "onUpdate:modelValue": C[0] || (C[0] = (E) => r.value.name = E),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!i.value,
          "aria-describedby": i.value ? m(S) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, Pl), [
          [
            ee,
            r.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : y("", !0),
      t("div", Fl, [
        t("span", { id: m($) }, d(e.named ? "Data type" : "Item type"), 9, Ol),
        p($e, {
          modelValue: u.value,
          "onUpdate:modelValue": C[1] || (C[1] = (E) => u.value = E),
          class: "type-picker",
          options: k.value,
          "labelled-by": m($),
          name: b.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (n(), s("small", Il, "Level four · choose a value type.")) : y("", !0)
      ]),
      i.value ? (n(), s("p", {
        key: 1,
        id: m(S),
        class: "field-error",
        role: "alert"
      }, d(i.value), 9, jl)) : y("", !0),
      m(ul)(e.shape, e.named) ? (n(), s("div", zl, [
        t("span", null, d(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", Wl, [
          (n(!0), s(M, null, I(e.shape.enum_values, (E, H) => (n(), s("span", {
            key: E,
            class: "chip primary"
          }, [
            q(d(E), 1),
            e.readonly ? y("", !0) : (n(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${E}`,
              onClick: (O) => e.shape.enum_values.splice(H, 1)
            }, [
              p(m(A), { icon: "tabler:x" })
            ], 8, Gl))
          ]))), 128))
        ]),
        e.readonly ? y("", !0) : (n(), s("div", Kl, [
          W(t("input", {
            "onUpdate:modelValue": C[2] || (C[2] = (E) => f.value = E),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(P, ["prevent"]), ["enter"])
          }, null, 40, Hl), [
            [ee, f.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: P
          }, "Add")
        ])),
        a.value ? (n(), s("p", Ql, d(a.value), 1)) : y("", !0)
      ])) : y("", !0),
      t("label", null, [
        C[9] || (C[9] = q("Description", -1)),
        W(t("textarea", {
          "onUpdate:modelValue": C[3] || (C[3] = (E) => e.shape.description = E),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [ee, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? y("", !0) : (n(), s("label", Jl, [
        C[10] || (C[10] = q("Expected format", -1)),
        W(t("input", {
          "onUpdate:modelValue": C[4] || (C[4] = (E) => e.shape.expected_format = E),
          maxlength: "400",
          placeholder: m(rl)(e.shape)
        }, null, 8, Yl), [
          [ee, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), s("div", Xl, [
        C[11] || (C[11] = t("span", null, "Required", -1)),
        p(_, {
          modelValue: r.value.required,
          "onUpdate:modelValue": C[5] || (C[5] = (E) => r.value.required = E),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : y("", !0),
      e.shape.type === "object" ? (n(), s(M, { key: 5 }, [
        t("p", Zl, d(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (n(), s("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: C[6] || (C[6] = (E) => v("add"))
        }, [
          p(m(A), { icon: "tabler:plus" }),
          C[12] || (C[12] = q("Add property", -1))
        ], 8, _l)) : y("", !0)
      ], 64)) : y("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), s("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: C[7] || (C[7] = (E) => v("selectItem"))
      }, [
        p(m(A), { icon: "tabler:brackets" }),
        q("Edit item shape · " + d(e.shape.item.type), 1)
      ])) : y("", !0)
    ]));
  }
}), ta = ["disabled"], la = { class: "grid" }, aa = { class: "context-stepper" }, na = ["disabled"], sa = ["disabled"], oa = {
  key: 0,
  class: "field-note"
}, ia = { class: "label-block" }, da = {
  key: 1,
  class: "field-error"
}, ua = { id: "docscout-groups" }, ra = ["value"], ca = { class: "toggle-row" }, va = /* @__PURE__ */ z({
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
    const l = e, v = o, r = N(() => !l.depth || l.depth === 1), b = N(() => St(l.field, l.otherNames));
    return (k, u) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      p(ea, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: r.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": r.value ? b.value : void 0,
        readonly: e.readonly,
        onAdd: u[0] || (u[0] = ($) => v("add")),
        onSelectItem: u[1] || (u[1] = ($) => v("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      r.value ? (n(), s(M, { key: 0 }, [
        u[25] || (u[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          u[12] || (u[12] = q("Search hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": u[2] || (u[2] = ($) => e.field.search_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [ee, e.field.search_hints]
          ]),
          u[13] || (u[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", la, [
          t("label", null, [
            u[15] || (u[15] = q("Strategy", -1)),
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
            u[16] || (u[16] = q("Chunks to read", -1)),
            t("span", aa, [
              W(t("input", {
                "onUpdate:modelValue": u[4] || (u[4] = ($) => e.field.chunks = $),
                type: "number",
                min: "1",
                max: "1000",
                "aria-label": "Chunks to read"
              }, null, 512), [
                [
                  ee,
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
              }, "−", 8, na),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: u[6] || (u[6] = ($) => e.field.chunks++)
              }, "+", 8, sa)
            ]),
            u[17] || (u[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), s("p", oa, [
          p(m(A), { icon: "tabler:info-circle" }),
          u[18] || (u[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : y("", !0),
        t("div", ia, [
          u[19] || (u[19] = t("span", { id: "within-label" }, "Search within", -1)),
          p($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": u[7] || (u[7] = ($) => e.field.search_within = $),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), s("p", da, [
          p(m(A), { icon: "tabler:alert-circle" }),
          u[20] || (u[20] = q("Turn on Map the document to read sections.", -1))
        ])) : y("", !0),
        t("label", null, [
          u[21] || (u[21] = q("Group", -1)),
          W(t("input", {
            "onUpdate:modelValue": u[8] || (u[8] = ($) => e.field.group = $),
            list: "docscout-groups",
            placeholder: "parties.borrower",
            "aria-label": "Field group",
            maxlength: "320"
          }, null, 512), [
            [
              ee,
              e.field.group,
              void 0,
              { trim: !0 }
            ]
          ]),
          t("datalist", ua, [
            (n(!0), s(M, null, I(e.groups, ($) => (n(), s("option", {
              key: $,
              value: $
            }, null, 8, ra))), 128))
          ]),
          u[22] || (u[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        u[26] || (u[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          u[23] || (u[23] = q("Validation hints", -1)),
          W(t("textarea", {
            "onUpdate:modelValue": u[9] || (u[9] = ($) => e.field.validation_hints = $),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [ee, e.field.validation_hints]
          ])
        ]),
        t("div", ca, [
          u[24] || (u[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          p(_, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": u[10] || (u[10] = ($) => e.field.evidence_required = $),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : y("", !0),
      !e.readonly && (r.value || e.siblingNames) ? (n(), s("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: u[11] || (u[11] = ($) => v("remove"))
      }, d(r.value ? "Remove field" : "Remove property"), 1)) : y("", !0)
    ], 8, ta));
  }
}), ma = { class: "field-groups" }, pa = {
  key: 0,
  class: "rows"
}, ba = ["aria-label"], fa = { class: "field-group-head" }, ha = ["aria-label", "aria-expanded", "aria-controls", "onClick"], ga = { class: "group-title" }, ya = ["id"], ka = { class: "group-title" }, Be = /* @__PURE__ */ z({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const o = U(/* @__PURE__ */ new Set()), l = pe();
    function v(b) {
      o.value.has(b) ? o.value.delete(b) : o.value.add(b);
    }
    const r = (b) => b.indices.length + b.children.reduce((k, u) => k + r(u), 0);
    return (b, k) => {
      const u = lt("FieldGroups", !0);
      return n(), s("div", ma, [
        e.node.indices.length ? (n(), s("ul", pa, [
          (n(!0), s(M, null, I(e.node.indices, ($) => (n(), s("li", { key: $ }, [
            Oe(b.$slots, "default", { index: $ })
          ]))), 128))
        ])) : y("", !0),
        (n(!0), s(M, null, I(e.node.children, ($, S) => (n(), s("section", {
          key: $.path,
          class: "field-group",
          "aria-label": `Group ${$.path}`
        }, [
          t("header", fa, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${o.value.has($.path) ? "Expand" : "Collapse"} group ${$.path}`,
              "aria-expanded": !o.value.has($.path),
              "aria-controls": `${m(l)}-${$.path}`,
              onClick: (f) => v($.path)
            }, [
              p(m(A), {
                icon: o.value.has($.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, ha),
            Oe(b.$slots, "header", {
              path: $.path,
              label: $.name,
              count: r($),
              first: S === 0,
              last: S === e.node.children.length - 1
            }, () => [
              t("span", ga, d($.name), 1)
            ])
          ]),
          W(t("div", {
            id: `${m(l)}-${$.path}`,
            class: "group-content"
          }, [
            p(u, { node: $ }, {
              default: me((f) => [
                Oe(b.$slots, "default", mt({ ref_for: !0 }, f))
              ]),
              header: me((f) => [
                Oe(b.$slots, "header", mt({ ref_for: !0 }, f), () => [
                  t("span", ka, d(f.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, ya), [
            [We, !o.value.has($.path)]
          ])
        ], 8, ba))), 128))
      ]);
    };
  }
}), $a = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], xa = ["aria-label", "title"], wa = ["aria-label", "title"], Va = ["id"], qt = /* @__PURE__ */ z({
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
    const l = e, v = o, r = U(l.initialValue), b = U(""), k = U(), u = pe();
    Ne(() => {
      k.value.focus(), k.value.select();
    });
    function $() {
      const S = r.value.trim();
      if (!S || !cl.test(S)) {
        b.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (S.length > l.maxLength) {
        b.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      v("save", S);
    }
    return (S, f) => (n(), s("form", {
      class: "group-path-editor",
      onSubmit: ve($, ["prevent"])
    }, [
      W(t("input", {
        ref_key: "input",
        ref: k,
        "onUpdate:modelValue": f[0] || (f[0] = (a) => r.value = a),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!b.value,
        "aria-describedby": b.value ? m(u) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve($, ["prevent"]), ["enter"]),
          f[1] || (f[1] = Ee(ve((a) => v("cancel"), ["stop", "prevent"]), ["esc"]))
        ]
      }, null, 40, $a), [
        [ee, r.value]
      ]),
      t("button", {
        type: "submit",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.saveLabel,
        title: e.saveLabel
      }, [
        p(m(A), { icon: "tabler:check" })
      ], 8, xa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: f[2] || (f[2] = (a) => v("cancel"))
      }, [
        p(m(A), { icon: "tabler:x" })
      ], 8, wa),
      b.value ? (n(), s("p", {
        key: 0,
        id: m(u),
        class: "field-error",
        role: "alert"
      }, d(b.value), 9, Va)) : y("", !0)
    ], 32));
  }
}), Sa = ["title"], Ca = ["aria-label", "data-group-rename", "title"], Ea = ["aria-label"], qa = {
  key: 2,
  class: "group-actions"
}, Na = ["aria-label", "disabled"], Ua = ["aria-label", "aria-expanded", "aria-controls"], Ma = /* @__PURE__ */ z({
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
    const l = e, v = o, r = U(!1), b = U(!1), k = U(), u = U(), $ = U(), S = pe(), f = N(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => v("remove") }
    ]);
    function a() {
      r.value = !0;
    }
    async function i() {
      r.value = !1, await Ce(), u.value.focus();
    }
    async function P(R) {
      const C = k.value.closest(".field-tree");
      r.value = !1, v("rename", R), await Ce(), C.querySelector(`[data-group-rename="${R}"]`).focus();
    }
    return (R, C) => (n(), s("div", {
      ref_key: "heading",
      ref: k,
      class: "group-heading"
    }, [
      r.value ? (n(), J(qt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: P,
        onCancel: i
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (n(), s(M, { key: 1 }, [
        e.readonly ? (n(), s("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, d(e.name), 9, Sa)) : (n(), s("button", {
          key: 1,
          ref_key: "renameButton",
          ref: u,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: a
        }, [
          t("span", null, d(e.name), 1),
          p(m(A), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ca)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, d(e.count), 9, Ea),
        e.readonly ? y("", !0) : (n(), s("div", qa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: C[0] || (C[0] = (E) => v("add"))
          }, [
            p(m(A), { icon: "tabler:plus" })
          ], 8, Na),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": b.value,
            "aria-controls": m(S),
            onClick: C[1] || (C[1] = (E) => $.value.toggle(E))
          }, [
            p(m(A), { icon: "tabler:dots" })
          ], 8, Ua),
          p(m(Ct), {
            id: m(S),
            ref_key: "menu",
            ref: $,
            model: f.value,
            popup: "",
            "append-to": "self",
            onShow: C[2] || (C[2] = (E) => b.value = !0),
            onHide: C[3] || (C[3] = (E) => b.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Aa = ["aria-label", "aria-expanded"], Ba = {
  key: 1,
  class: "tree-indent"
}, Ra = ["aria-label", "aria-describedby", "aria-current"], La = { class: "row-copy" }, Ta = { class: "row-name" }, Da = ["title"], Pa = ["id", "title"], Fa = { class: "field-badges" }, Oa = { class: "chip field-type" }, Ia = { class: "field-flags" }, ja = {
  key: 0,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Required",
  title: "Required"
}, za = {
  key: 1,
  class: "chip field-flag primary",
  role: "img",
  "aria-label": "Deep analysis",
  title: "Deep analysis"
}, Wa = {
  key: 2,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Reads sections",
  title: "Reads sections"
}, Ga = {
  key: 3,
  class: "chip field-flag",
  role: "img",
  "aria-label": "Evidence required",
  title: "Evidence required"
}, Ka = {
  key: 2,
  class: "row-actions"
}, Ha = ["aria-label", "disabled"], Qa = ["aria-label", "disabled"], Ja = ["aria-label", "aria-expanded", "aria-controls"], Ya = {
  key: 0,
  class: "tree-children"
}, Xa = { key: 0 }, Za = { key: 1 }, _a = ["aria-label", "disabled"], en = /* @__PURE__ */ z({
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
    const l = e, v = o, r = pe(), b = pe(), k = U(), u = U(!1), $ = N(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", l.field, l.trail, 1) }
    ]), S = U(!0);
    be(() => l.selected, (C) => {
      const E = ie(l.field, l.trail);
      C !== E && C.startsWith(E + (l.trail.length ? "/" : "")) && (S.value = !0);
    });
    const f = N(() => l.trail.at(-1) !== "item"), a = N(() => f.value ? l.shape.name || "New field" : "Each item"), i = N(() => l.trail.length ? void 0 : l.shape), P = N(() => l.shape.type === "object" || l.shape.type === "list");
    function R(C) {
      C.key === "ArrowRight" && P.value && (S.value = !0, C.preventDefault(), C.stopPropagation()), C.key === "ArrowLeft" && P.value && (S.value = !1, C.preventDefault(), C.stopPropagation());
    }
    return (C, E) => {
      const H = lt("ShapeTree", !0);
      return n(), s("div", {
        class: "shape-tree-node",
        onKeydown: R
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === m(ie)(e.field, e.trail) }])
        }, [
          P.value ? (n(), s("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${S.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": S.value,
            onClick: E[0] || (E[0] = (O) => S.value = !S.value)
          }, [
            p(m(A), {
              icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Aa)) : (n(), s("span", Ba)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(r),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: E[1] || (E[1] = (O) => v("select", e.field, e.trail))
          }, [
            t("span", La, [
              t("span", Ta, [
                p(m(A), {
                  icon: m(Bl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: a.value
                }, d(a.value), 9, Da),
                e.error ? (n(), J(m(A), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : y("", !0)
              ]),
              t("span", {
                id: m(r),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, d(e.shape.description || "No description"), 11, Pa)
            ]),
            t("span", Fa, [
              t("span", Oa, d(e.shape.type), 1),
              t("span", Ia, [
                f.value && e.shape.required ? (n(), s("span", ja, [
                  p(m(A), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                i.value?.strategy === "deep" ? (n(), s("span", za, [
                  p(m(A), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                i.value?.search_within === "sections" ? (n(), s("span", Wa, [
                  p(m(A), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                i.value?.evidence_required ? (n(), s("span", Ga, [
                  p(m(A), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0)
              ])
            ])
          ], 8, Ra),
          !e.readonly && f.value ? (n(), s("span", Ka, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: E[2] || (E[2] = (O) => v("reorder", e.field, e.trail, -1))
            }, [
              p(m(A), { icon: "tabler:chevron-up" })
            ], 8, Ha),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: E[3] || (E[3] = (O) => v("reorder", e.field, e.trail, 1))
            }, [
              p(m(A), { icon: "tabler:chevron-down" })
            ], 8, Qa)
          ])) : y("", !0),
          !e.readonly && f.value ? (n(), s("div", {
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
              "aria-expanded": u.value,
              "aria-controls": m(b),
              onClick: E[4] || (E[4] = (O) => k.value.toggle(O))
            }, [
              p(m(A), { icon: "tabler:dots" })
            ], 8, Ja),
            p(m(Ct), {
              id: m(b),
              ref_key: "menu",
              ref: k,
              model: $.value,
              popup: "",
              "append-to": "self",
              onShow: E[5] || (E[5] = (O) => u.value = !0),
              onHide: E[6] || (E[6] = (O) => u.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : y("", !0)
        ], 2),
        P.value && S.value ? (n(), s("ul", Ya, [
          (n(!0), s(M, null, I(e.shape.properties, (O, j) => (n(), s("li", { key: j }, [
            p(H, {
              shape: O,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${O.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: E[8] || (E[8] = (G, D) => v("select", G, D)),
              onAdd: E[9] || (E[9] = (G, D) => v("add", G, D)),
              onReorder: E[10] || (E[10] = (G, D, T) => v("reorder", G, D, T))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly", "first", "last"])
          ]))), 128)),
          e.shape.item ? (n(), s("li", Xa, [
            p(H, {
              shape: e.shape.item,
              field: e.field,
              trail: [...e.trail, "item"],
              path: `${e.path}[]`,
              selected: e.selected,
              readonly: e.readonly,
              onSelect: E[11] || (E[11] = (O, j) => v("select", O, j)),
              onAdd: E[12] || (E[12] = (O, j) => v("add", O, j)),
              onReorder: E[13] || (E[13] = (O, j, G) => v("reorder", O, j, G))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : y("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (n(), s("li", Za, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: E[14] || (E[14] = (O) => v("add", e.field, e.trail))
            }, [
              p(m(A), { icon: "tabler:plus" }),
              E[15] || (E[15] = q("Add property", -1))
            ], 8, _a)
          ])) : y("", !0)
        ])) : y("", !0)
      ], 32);
    };
  }
}), tn = { class: "label-block" }, ln = {
  key: 0,
  class: "muted"
}, an = ["config"], nn = {
  key: 2,
  class: "field-error",
  role: "alert"
}, sn = {
  key: 3,
  role: "status",
  class: "muted"
}, on = /* @__PURE__ */ z({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = U(!!customElements.get("wc-agent-picker")), r = U("");
    Ne(async () => {
      if (!v.value)
        try {
          await Je("wc-agent-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          r.value = k instanceof Error ? k.message : String(k);
        }
    });
    function b(k) {
      if (k.composedPath()[0] !== k.currentTarget) return;
      const u = k.detail;
      l("select", u.agent_id);
    }
    return (k, u) => (n(), s("div", tn, [
      u[0] || (u[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), s("p", ln, d(e.value || "Built-in scout"), 1)) : v.value ? (n(), s("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: b
      }, null, 40, an)) : r.value ? (n(), s("p", nn, "Could not load agent picker: " + d(r.value), 1)) : (n(), s("span", sn, "Loading agents…")),
      u[1] || (u[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), dn = ["value", "capability", "aria-labelledby"], un = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, rn = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, ce = /* @__PURE__ */ z({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = U(!!customElements.get("wc-model-picker")), r = U("");
    Ne(async () => {
      if (!v.value)
        try {
          await Je("wc-model-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          r.value = k instanceof Error ? k.message : String(k);
        }
    });
    function b(k) {
      const u = k.detail;
      typeof u == "string" && l("select", u);
    }
    return (k, u) => v.value ? (n(), s("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: b
    }, null, 40, dn)) : r.value ? (n(), s("p", un, "Could not load model picker: " + d(r.value), 1)) : (n(), s("span", rn, "Loading models…"));
  }
}), cn = { class: "slider" }, vn = { class: "slider-head" }, mn = { class: "slider-value" }, pn = ["aria-label", "aria-valuetext", "disabled"], bn = {
  key: 0,
  class: "slider-hints"
}, fn = { key: 1 }, Ve = 1e3, le = /* @__PURE__ */ z({
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
    const o = e, l = Le(e, "modelValue"), v = N(() => o.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${o.unit ? ` ${o.unit}` : ""}`), r = (u) => o.log ? Math.log(u / o.min) / Math.log(o.max / o.min) * Ve : (u - o.min) / (o.max - o.min) * Ve;
    function b(u) {
      const $ = o.log ? o.min * Math.pow(o.max / o.min, u / Ve) : o.min + (o.max - o.min) * u / Ve, S = Math.round($ / o.step) * o.step;
      return Math.min(o.max, Math.max(o.min, Number(S.toFixed(4))));
    }
    const k = N({ get: () => Math.round(r(l.value)), set: (u) => {
      l.value = b(u);
    } });
    return (u, $) => (n(), s("div", cn, [
      t("div", vn, [
        t("span", null, d(e.label), 1),
        t("output", mn, d(v.value), 1)
      ]),
      W(t("input", {
        "onUpdate:modelValue": $[0] || ($[0] = (S) => k.value = S),
        type: "range",
        min: "0",
        max: Ve,
        step: "1",
        "aria-label": e.label,
        "aria-valuetext": v.value,
        disabled: e.disabled,
        style: qe({ "--fill": `${k.value / Ve * 100}%` })
      }, null, 12, pn), [
        [
          ee,
          k.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), s("div", bn, [
        t("span", null, d(e.hints[0]), 1),
        t("span", null, d(e.hints[1]), 1)
      ])) : y("", !0),
      e.note ? (n(), s("small", fn, d(e.note), 1)) : y("", !0)
    ]));
  }
}), hn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, gn = { class: "fd-track" }, yn = { class: "fd-node" }, kn = { class: "fd-dots" }, $n = { class: "fd-more" }, xn = { class: "fd-node goal" }, wn = /* @__PURE__ */ z({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const o = e;
    return (l, v) => (n(), s("figure", hn, [
      t("div", gn, [
        v[2] || (v[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), s(M, null, I(Math.min(o.rounds, 8), (r) => (n(), s(M, { key: r }, [
          v[0] || (v[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", yn, [
            t("span", null, "R" + d(r), 1),
            t("span", kn, [
              (n(!0), s(M, null, I(Math.min(o.extra, 6), (b) => (n(), s("i", { key: b }))), 128))
            ])
          ])
        ], 64))), 128)),
        o.rounds > 8 ? (n(), s(M, { key: 0 }, [
          v[1] || (v[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", $n, "+" + d(o.rounds - 8), 1)
        ], 64)) : y("", !0),
        v[3] || (v[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", xn, "≥ " + d(Math.round(o.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, d(o.rounds ? `One pass, then up to ${o.rounds} rounds with up to ${o.extra} new queries each, stopping as soon as confidence reaches ${Math.round(o.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Vn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Sn = { class: "fd-grid" }, Cn = { class: "fd-node solid" }, En = { class: "fd-node" }, qn = { class: "fd-node" }, Nn = { class: "fd-node goal" }, Un = /* @__PURE__ */ z({
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
    return (v, r) => (n(), s("figure", Vn, [
      t("div", Sn, [
        t("span", Cn, [
          t("b", null, d(e.fields), 1),
          q(" field" + d(e.fields === 1 ? "" : "s"), 1),
          t("small", null, d(e.parallel) + " at a time", 1)
        ]),
        t("span", En, [
          t("b", null, d(e.queries), 1),
          r[0] || (r[0] = q(" queries", -1)),
          r[1] || (r[1] = t("small", null, "per field", -1))
        ]),
        t("span", qn, [
          t("b", null, d(e.perQuery), 1),
          r[2] || (r[2] = q(" chunks", -1)),
          r[3] || (r[3] = t("small", null, "per query", -1))
        ]),
        t("span", Nn, [
          t("b", null, d(l.value), 1),
          r[4] || (r[4] = q(" chunks", -1)),
          t("small", null, d(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + d(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Mn = ["disabled"], An = { class: "muted" }, Bn = { class: "toggle-row" }, Rn = { class: "label-block" }, Ln = { class: "toggle-row" }, Tn = {
  id: "model-map",
  class: "model-role"
}, Dn = {
  key: 0,
  class: "chips"
}, Pn = {
  key: 1,
  class: "muted"
}, Fn = { class: "toggle-row" }, On = { class: "grid" }, In = ["onUpdate:modelValue"], jn = ["onUpdate:modelValue"], zn = ["onUpdate:modelValue"], Wn = ["onClick"], Gn = {
  key: 0,
  class: "muted"
}, Kn = { class: "toggle-row" }, Hn = { class: "label-block" }, Qn = {
  id: "model-scout",
  class: "model-role"
}, Jn = {
  key: 3,
  class: "muted"
}, Yn = {
  key: 4,
  class: "toggle-row"
}, Xn = { class: "toggle-row" }, Zn = { class: "toggle-row" }, _n = { class: "label-block" }, es = {
  id: "model-deep",
  class: "model-role"
}, ts = {
  id: "model-deep-query",
  class: "model-role"
}, ls = {
  id: "model-extract",
  class: "model-role"
}, as = { class: "output-list" }, ns = { class: "chip" }, ss = {
  key: 0,
  class: "muted"
}, os = { class: "toggle-row" }, is = { class: "toggle-row" }, ds = { class: "toggle-row" }, us = {
  id: "model-verify",
  class: "model-role"
}, rs = /* @__PURE__ */ z({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = N(() => o.config.stages), v = (f) => bl(o.stage, f), r = vl(), b = N(() => o.config.fields.filter((f) => f.strategy === "deep").length), k = N(() => o.config.fields.filter((f) => f.search_within === "sections").map((f) => f.name || "New field")), u = N(() => $t(o.config));
    function $(f) {
      f ? l.value.scout.agent_id = f : delete l.value.scout.agent_id;
    }
    function S(f, a) {
      const i = l.value.scout.tools.filter((P) => P !== f);
      l.value.scout.tools = a ? [...i, f] : i;
    }
    return (f, a) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", An, d(m(ml)[e.stage]), 1),
      e.stage === "map" ? (n(), s(M, { key: 0 }, [
        t("div", Bn, [
          a[33] || (a[33] = t("span", null, "Stage enabled", -1)),
          p(_, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": a[0] || (a[0] = (i) => l.value.map.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Rn, [
          a[34] || (a[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          p($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": a[1] || (a[1] = (i) => l.value.map.outline = i),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          a[35] || (a[35] = t("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        t("div", Ln, [
          a[36] || (a[36] = t("span", null, [
            q("Section summaries"),
            t("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          p(_, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": a[2] || (a[2] = (i) => l.value.map.section_summaries = i),
            label: "Section summaries",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[38] || (a[38] = t("h4", null, "Models", -1)),
        t("div", Tn, [
          a[37] || (a[37] = t("span", null, "Outliner", -1)),
          p(ce, {
            value: l.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: a[3] || (a[3] = (i) => l.value.map.model = i)
          }, null, 8, ["value"])
        ]),
        a[39] || (a[39] = t("h4", null, "Fields that read sections", -1)),
        k.value.length ? (n(), s("p", Dn, [
          (n(!0), s(M, null, I(k.value, (i) => (n(), s("span", {
            key: i,
            class: "chip primary"
          }, d(i), 1))), 128))
        ])) : (n(), s("p", Pn, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : y("", !0),
      e.stage === "prefetch" ? (n(), s(M, { key: 1 }, [
        t("div", Fn, [
          a[40] || (a[40] = t("span", null, "Stage enabled", -1)),
          p(_, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": a[4] || (a[4] = (i) => l.value.prefetch.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[44] || (a[44] = t("h4", null, "Queries", -1)),
        (n(!0), s(M, null, I(l.value.prefetch.queries, (i, P) => (n(), s("div", {
          key: P,
          class: "query-row"
        }, [
          t("div", On, [
            t("label", null, [
              a[41] || (a[41] = q("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": (R) => i.name = R,
                placeholder: "Parties"
              }, null, 8, In), [
                [ee, i.name]
              ])
            ]),
            t("label", null, [
              a[42] || (a[42] = q("Chunks", -1)),
              W(t("input", {
                "onUpdate:modelValue": (R) => i.chunks = R,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, jn), [
                [
                  ee,
                  i.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            a[43] || (a[43] = q("Query", -1)),
            W(t("textarea", {
              "onUpdate:modelValue": (R) => i.query = R,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, zn), [
              [ee, i.query]
            ])
          ]),
          e.readonly ? y("", !0) : (n(), s("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (R) => l.value.prefetch.queries.splice(P, 1)
          }, "Remove query", 8, Wn))
        ]))), 128)),
        l.value.prefetch.queries.length ? y("", !0) : (n(), s("p", Gn, "No fixed queries. Field search hints still run.")),
        e.readonly ? y("", !0) : (n(), s("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: a[5] || (a[5] = (i) => l.value.prefetch.queries.push(m(pl)()))
        }, "Add query"))
      ], 64)) : y("", !0),
      e.stage === "scout" ? (n(), s(M, { key: 2 }, [
        t("div", Kn, [
          a[45] || (a[45] = t("span", null, "Stage enabled", -1)),
          p(_, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": a[6] || (a[6] = (i) => l.value.scout.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Hn, [
          a[46] || (a[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          p($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": a[7] || (a[7] = (i) => l.value.scout.mode = i),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, d(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (n(), J(on, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: $
        }, null, 8, ["value", "readonly"])) : y("", !0),
        l.value.scout.mode === "loop" ? (n(), J(wn, {
          key: 1,
          rounds: l.value.scout.max_rounds,
          confidence: l.value.scout.target_confidence,
          extra: l.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : y("", !0),
        a[51] || (a[51] = t("h4", null, "Models", -1)),
        t("div", Qn, [
          a[47] || (a[47] = t("span", null, "Scout", -1)),
          p(ce, {
            value: l.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: a[8] || (a[8] = (i) => l.value.scout.model = i)
          }, null, 8, ["value"])
        ]),
        a[52] || (a[52] = t("h4", null, "Loop", -1)),
        p(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": a[9] || (a[9] = (i) => l.value.scout.max_rounds = i),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: v("max_rounds").min,
          max: v("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (n(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": a[10] || (a[10] = (i) => l.value.scout.target_confidence = i),
          label: "Stop at confidence",
          min: v("target_confidence").min,
          max: v("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : y("", !0),
        p(le, {
          modelValue: l.value.scout.max_extra_queries,
          "onUpdate:modelValue": a[11] || (a[11] = (i) => l.value.scout.max_extra_queries = i),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: v("max_extra_queries").min,
          max: v("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": a[12] || (a[12] = (i) => l.value.scout.max_tokens = i),
          label: "Scout output limit",
          min: v("max_tokens").min,
          max: v("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (n(), s("p", Jn, "Tool budget: " + d(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : y("", !0),
        l.value.scout.mode === "loop" ? (n(), s("div", Yn, [
          a[48] || (a[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          p(_, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": a[13] || (a[13] = (i) => l.value.scout.drop_noise = i),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : y("", !0),
        t("div", Xn, [
          a[49] || (a[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          p(_, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": a[14] || (a[14] = (i) => l.value.scout.share_notes = i),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (n(), s(M, { key: 5 }, [
          a[50] || (a[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), s(M, null, I(m(r), (i) => (n(), s("div", {
            key: i,
            class: "toggle-row"
          }, [
            t("span", null, d(m(_e)(i)), 1),
            p(_, {
              "model-value": l.value.scout.tools.includes(i),
              label: m(_e)(i),
              disabled: e.readonly,
              "onUpdate:modelValue": (P) => S(i, P)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : y("", !0)
      ], 64)) : y("", !0),
      e.stage === "deep" ? (n(), s(M, { key: 3 }, [
        t("div", Zn, [
          a[53] || (a[53] = t("span", null, "Stage enabled", -1)),
          p(_, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": a[15] || (a[15] = (i) => l.value.deep.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        p(Un, {
          fields: b.value,
          parallel: l.value.deep.parallel_fields,
          queries: l.value.deep.max_queries,
          "per-query": l.value.deep.chunks_per_query,
          cap: l.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        t("div", _n, [
          a[54] || (a[54] = t("span", { id: "read-label" }, "Reads", -1)),
          p($e, {
            modelValue: l.value.deep.read,
            "onUpdate:modelValue": a[16] || (a[16] = (i) => l.value.deep.read = i),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          a[55] || (a[55] = t("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        a[58] || (a[58] = t("h4", null, "Models", -1)),
        t("div", es, [
          a[56] || (a[56] = t("span", null, "Analysis", -1)),
          p(ce, {
            value: l.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: a[17] || (a[17] = (i) => l.value.deep.model = i)
          }, null, 8, ["value"])
        ]),
        t("div", ts, [
          a[57] || (a[57] = t("span", null, "Query writer", -1)),
          p(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: a[18] || (a[18] = (i) => l.value.deep.query_model = i)
          }, null, 8, ["value"])
        ]),
        a[59] || (a[59] = t("h4", null, "Reach", -1)),
        p(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": a[19] || (a[19] = (i) => l.value.deep.parallel_fields = i),
          label: "Fields at a time",
          min: v("parallel_fields").min,
          max: v("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": a[20] || (a[20] = (i) => l.value.deep.max_queries = i),
          label: "Queries per field",
          min: v("max_queries").min,
          max: v("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": a[21] || (a[21] = (i) => l.value.deep.chunks_per_query = i),
          label: "Chunks per query",
          min: v("chunks_per_query").min,
          max: v("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": a[22] || (a[22] = (i) => l.value.deep.chunk_cap = i),
          label: "Chunk cap per field",
          min: v("chunk_cap").min,
          max: v("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": a[23] || (a[23] = (i) => l.value.deep.min_similarity = i),
          label: "Minimum similarity",
          min: v("min_similarity").min,
          max: v("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        a[60] || (a[60] = t("h4", null, "Temperature", -1)),
        p(le, {
          modelValue: l.value.deep.query_temperature,
          "onUpdate:modelValue": a[24] || (a[24] = (i) => l.value.deep.query_temperature = i),
          label: "Query writing",
          min: v("query_temperature").min,
          max: v("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": a[25] || (a[25] = (i) => l.value.deep.analysis_temperature = i),
          label: "Analysis",
          min: v("analysis_temperature").min,
          max: v("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : y("", !0),
      e.stage === "extract" ? (n(), s(M, { key: 4 }, [
        a[62] || (a[62] = t("h4", null, "Models", -1)),
        t("div", ls, [
          a[61] || (a[61] = t("span", null, "Extraction", -1)),
          p(ce, {
            value: l.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: a[26] || (a[26] = (i) => l.value.extract.model = i)
          }, null, 8, ["value"])
        ]),
        a[63] || (a[63] = t("h4", null, "Field groups", -1)),
        t("ul", as, [
          (n(!0), s(M, null, I(u.value, (i) => (n(), s("li", {
            key: i.name
          }, [
            t("span", null, d(i.name), 1),
            t("span", ns, d(i.fields.length) + " field" + d(i.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        u.value.length ? y("", !0) : (n(), s("p", ss, "No fields yet.")),
        p(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": a[27] || (a[27] = (i) => l.value.extract.max_fields_per_call = i),
          label: "Fields per call",
          min: v("max_fields_per_call").min,
          max: v("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(ft)(e.config)} extraction call${m(ft)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        p(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": a[28] || (a[28] = (i) => l.value.extract.max_output_tokens = i),
          label: "Output limit",
          min: v("max_output_tokens").min,
          max: v("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : y("", !0),
      e.stage === "verify" ? (n(), s(M, { key: 5 }, [
        t("div", os, [
          a[64] || (a[64] = t("span", null, "Stage enabled", -1)),
          p(_, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": a[29] || (a[29] = (i) => l.value.verify.enabled = i),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", is, [
          a[65] || (a[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          p(_, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": a[30] || (a[30] = (i) => l.value.verify.check_quotes = i),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          a[66] || (a[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          p(_, {
            modelValue: l.value.verify.check_support,
            "onUpdate:modelValue": a[31] || (a[31] = (i) => l.value.verify.check_support = i),
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.verify.check_support ? (n(), s(M, { key: 0 }, [
          a[68] || (a[68] = t("h4", null, "Models", -1)),
          t("div", us, [
            a[67] || (a[67] = t("span", null, "Checker", -1)),
            p(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: a[32] || (a[32] = (i) => l.value.verify.model = i)
            }, null, 8, ["value"])
          ])
        ], 64)) : y("", !0)
      ], 64)) : y("", !0)
    ], 8, Mn));
  }
}), cs = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, vs = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, ms = ["x", "y", "width"], ps = ["x", "width"], bs = /* @__PURE__ */ z({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const o = e, l = N(() => Math.min(0.9, Math.max(0, o.overlap / o.size))), v = N(() => {
      const r = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((b) => ({ x: b * r * (1 - l.value), w: r }));
    });
    return (r, b) => (n(), s("figure", cs, [
      (n(), s("svg", vs, [
        (n(!0), s(M, null, I(v.value, (k, u) => (n(), s("rect", {
          key: u,
          x: k.x,
          y: u % 2 ? 14 : 4,
          width: k.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, ms))), 128)),
        (n(), s(M, null, I([1, 2], (k) => t("rect", {
          key: "o" + k,
          x: v.value[k].x,
          y: 4,
          width: v.value[k - 1].x + v.value[k - 1].w - v.value[k].x,
          height: "24",
          class: "shared"
        }, null, 8, ps)), 64))
      ])),
      t("figcaption", null, d(e.size.toLocaleString()) + " tokens per chunk · " + d(e.overlap.toLocaleString()) + " shared with the next (" + d(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), fs = ["disabled"], hs = { class: "muted" }, gs = { class: "toggle-row" }, ys = { class: "toggle-row" }, ks = { class: "label-block" }, $s = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, xs = { class: "label-block" }, ws = {
  id: "embedding-model",
  class: "model-role"
}, Vs = { class: "toggle-row" }, Ss = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Cs = /* @__PURE__ */ z({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = N(() => o.config.retrieval), v = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], r = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], b = Xe("chunk_size"), k = Xe("overlap"), u = Xe("section_budget"), $ = N(() => Math.min(k.max, l.value.chunk_size - 50));
    return (S, f) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", hs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + d(e.retention) + ".", 1),
      f[19] || (f[19] = t("h4", null, "Chunks", -1)),
      p(bs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      p(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": f[0] || (f[0] = (a) => l.value.chunk_size = a),
        label: "Chunk size",
        min: m(b).min,
        max: m(b).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      p(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": f[1] || (f[1] = (a) => l.value.overlap = a),
        label: "Overlap",
        min: m(k).min,
        max: $.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", gs, [
        f[11] || (f[11] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        p(_, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": f[2] || (f[2] = (a) => l.value.split_headings = a),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", ys, [
        f[12] || (f[12] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        p(_, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": f[3] || (f[3] = (a) => l.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      p(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": f[4] || (f[4] = (a) => l.value.section_budget = a),
        label: "Section budget",
        min: m(u).min,
        max: m(u).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      f[20] || (f[20] = t("h4", null, "Context", -1)),
      t("div", ks, [
        f[13] || (f[13] = t("span", { id: "context-label" }, "Chunk context", -1)),
        p($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": f[5] || (f[5] = (a) => l.value.context = a),
          "labelled-by": "context-label",
          options: r
        }, null, 8, ["modelValue"]),
        t("small", null, d(r.find((a) => a.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (n(), s("div", $s, [
        f[14] || (f[14] = t("span", null, "Context writer", -1)),
        p(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: f[6] || (f[6] = (a) => l.value.context_model = a)
        }, null, 8, ["value"])
      ])) : y("", !0),
      f[21] || (f[21] = t("h4", null, "Search", -1)),
      t("div", xs, [
        f[15] || (f[15] = t("span", { id: "mode-label" }, "Search mode", -1)),
        p($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": f[7] || (f[7] = (a) => l.value.search_mode = a),
          "labelled-by": "mode-label",
          options: v
        }, null, 8, ["modelValue"]),
        t("small", null, d(v.find((a) => a.value === l.value.search_mode)?.note), 1)
      ]),
      f[22] || (f[22] = t("h4", null, "Models", -1)),
      t("div", ws, [
        f[16] || (f[16] = t("span", null, "Embedding", -1)),
        p(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: f[8] || (f[8] = (a) => l.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      t("div", Vs, [
        f[17] || (f[17] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        p(_, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": f[9] || (f[9] = (a) => l.value.highlighter = a),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (n(), s("div", Ss, [
        f[18] || (f[18] = t("span", null, "Highlighter", -1)),
        p(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: f[10] || (f[10] = (a) => l.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : y("", !0)
    ], 8, fs));
  }
}), Es = ["inert"], qs = { class: "canvas-inner" }, Ns = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Us = { class: "block-head" }, Ms = ["aria-expanded"], As = { class: "count" }, Bs = {
  key: 0,
  class: "block-peek"
}, Rs = {
  key: 1,
  class: "field-add-actions push"
}, Ls = ["aria-expanded", "aria-controls", "disabled"], Ts = ["disabled"], Ds = {
  id: "fields-body",
  class: "block-body"
}, Ps = {
  key: 0,
  class: "block-empty"
}, Fs = { class: "field-tree" }, Os = ["id"], Is = {
  class: "tree-indent",
  "aria-hidden": "true"
}, js = {
  class: "shape-preview",
  open: ""
}, zs = { class: "kx-focus-outline" }, Ws = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Gs = {
  key: 1,
  class: "preview-grid"
}, Ks = { "aria-label": "Output shape" }, Hs = { "aria-label": "Example output" }, Qs = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Js = { class: "block-head" }, Ys = ["aria-expanded"], Xs = { class: "count" }, Zs = {
  key: 0,
  class: "block-peek"
}, _s = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, eo = { class: "node-icon" }, to = { class: "node-main" }, lo = { class: "node-summary" }, ao = { class: "node-side" }, no = { class: "chip model" }, so = { class: "branches" }, oo = { class: "branch" }, io = { class: "branch" }, uo = { class: "node-icon" }, ro = { class: "node-main" }, co = { class: "node-summary" }, vo = ["aria-labelledby", "role", "aria-modal"], mo = ["aria-valuenow"], po = { class: "side-panel-head" }, bo = { class: "side-panel-icon" }, fo = ["id"], ho = ["aria-label", "title"], go = { class: "node-breadcrumb mono" }, yo = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, ko = {
  key: 0,
  value: ""
}, $o = {
  key: 1,
  value: "",
  disabled: ""
}, xo = ["value"], wo = ["disabled"], Vo = ["disabled"], So = {
  key: 4,
  class: "inspector-form"
}, Co = { class: "output-list" }, Eo = { class: "mono" }, qo = { class: "chip" }, No = { class: "rail-label" }, Ze = 400, Ie = 320, Uo = /* @__PURE__ */ z({
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
    const o = e, l = Le(e, "title"), v = Le(e, "description"), r = U({ kind: "document" });
    function b(g, c) {
      try {
        const V = localStorage.getItem(`docscout.${g}`);
        return V === null ? c : V === "1";
      } catch {
        return c;
      }
    }
    function k(g, c) {
      try {
        localStorage.setItem(`docscout.${g}`, c ? "1" : "0");
      } catch {
      }
    }
    const u = U(b("panel", !0)), $ = U(b("fields", !0)), S = U(b("flow", !0));
    function f() {
      try {
        const g = Number(localStorage.getItem("docscout.panelWidth"));
        return g >= Ie ? g : Ze;
      } catch {
        return Ze;
      }
    }
    const a = U(f()), i = () => {
      const g = T.value?.clientWidth;
      return g ? Math.max(Ie, g - 420) : Number.POSITIVE_INFINITY;
    };
    function P(g, c = !0) {
      if (a.value = Math.round(Math.min(i(), Math.max(Ie, g))), c)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const R = U(!1);
    function C(g) {
      const c = g.currentTarget, V = g.clientX, Y = a.value;
      c.setPointerCapture(g.pointerId), R.value = !0;
      const X = (Z) => P(Y + (V - Z.clientX), !1), ae = () => {
        R.value = !1, P(a.value), c.removeEventListener("pointermove", X), c.removeEventListener("pointerup", ae);
      };
      c.addEventListener("pointermove", X), c.addEventListener("pointerup", ae);
    }
    function E(g) {
      g.key === "ArrowLeft" ? (P(a.value + 24), g.preventDefault()) : g.key === "ArrowRight" && (P(a.value - 24), g.preventDefault());
    }
    let H = null;
    const O = U(), j = pe();
    async function G(g) {
      if (u.value = g, !B.value) {
        k("panel", g);
        return;
      }
      if (!g && H) {
        const c = H;
        H = null, await Ce(), c.focus();
      }
    }
    function D(g) {
      const c = g === "fields" ? $ : S;
      c.value = !c.value, k(g, c.value);
    }
    const T = U(), B = U(!1);
    let de;
    Ne(() => {
      de = new ResizeObserver(([g]) => {
        const c = B.value;
        B.value = g.contentRect.width < 1e3, B.value && !c && (u.value = !1), !B.value && c && (u.value = b("panel", !0));
      }), T.value && de.observe(T.value);
    }), kt(() => de?.disconnect());
    const ye = U();
    be(r, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(g) {
      B.value && !u.value && (H = T.value?.getRootNode()?.activeElement), r.value = g, u.value = !0, B.value && (await Ce(), O.value?.focus());
    }
    const oe = (g) => JSON.stringify(g) === JSON.stringify(r.value), fe = N(() => r.value.kind === "field" ? o.config.fields[r.value.index] : void 0), w = N(() => Ke(o.config.fields)), h = N(() => r.value.kind === "field" ? w.value.find((g) => g.key === ie(r.value.index, r.value.trail ?? [])) : void 0), x = N(() => h.value?.key ?? ""), L = N(() => {
      const g = h.value;
      return !g || g.trail.at(-1) === "item" || !g.trail.length ? void 0 : w.value.find((V) => V.key === ie(g.field, g.trail.slice(0, -1))).shape.properties.filter((V) => V !== g.shape).map((V) => V.name);
    }), F = U("");
    be(x, () => {
      F.value = "";
    });
    const Ue = N(() => h.value ? Rl(o.config.fields, h.value) : []), he = N(() => {
      const g = fl(o.config.fields.map(K));
      return g ? `Group path collides with field ${g}.` : "";
    }), De = N(() => he.value ? null : yt(o.config.fields)), At = N(() => he.value ? null : yt(o.config.fields, !0)), nt = N(() => {
      const g = r.value;
      return g.kind === "stage" ? ke[g.stage] : g.kind === "field" ? h.value?.trail.length ? h.value.path : fe.value?.name || "New field" : g.kind === "document" ? "Read document" : g.kind === "output" ? "Output" : "Details";
    }), Bt = N(() => {
      const g = r.value;
      return g.kind === "stage" ? at[g.stage] : g.kind === "field" ? "tabler:forms" : g.kind === "document" ? "tabler:file-text" : g.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Rt = N(() => o.config.fields.filter((g, c) => !(r.value.kind === "field" && r.value.index === c)).map(K)), Lt = N(() => o.config.stages.deep.enabled), Tt = N(() => o.config.stages.map.enabled), Dt = N(() => Te(o.config.fields.map(K))), Pe = U(!1), st = U(), ot = pe();
    function Pt(g, c) {
      for (const V of o.config.fields) (V.group === g || V.group.startsWith(g + ".")) && (V.group = c + V.group.slice(g.length));
    }
    const Ft = (g) => 320 - Math.max(0, ...o.config.fields.filter((c) => c.group === g || c.group.startsWith(g + ".")).map((c) => c.group.length - g.length));
    function Ot() {
      $.value = !0, Pe.value = !0;
    }
    async function it() {
      Pe.value = !1, await Ce(), st.value.focus();
    }
    function It(g) {
      o.config.fields.push({ ...et(), group: g }), it();
    }
    const jt = N(() => [...new Set(o.config.fields.map((g) => g.group.trim()).filter(Boolean))]), zt = (g) => St(o.config.fields[g], o.config.fields.filter((c, V) => V !== g).map(K)), dt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Wt = N(() => dt.filter((g) => Ge(o.config, g)).map((g) => ke[g]).join(" · ")), Gt = N(() => o.config.fields.map((g) => g.name || "New field").join(", ")), Kt = N(() => dt.filter((g) => Ge(o.config, g)).length), xe = (g) => o.result?.trace.find((c) => c.kind === g);
    function ut(g = "") {
      o.config.fields.push({ ...et(), group: g }), $.value = !0, te({ kind: "field", index: o.config.fields.length - 1 });
    }
    function Ht(g) {
      o.config.fields.splice(g, 1), r.value = { kind: "document" };
    }
    function re(g, c = []) {
      te({ kind: "field", index: g, ...c.length ? { trail: c } : {} });
    }
    function rt(g, c) {
      const V = w.value.find((Y) => Y.key === ie(g, c));
      V.shape.properties.push(Vt()), re(g, [...c, V.shape.properties.length - 1]);
    }
    function Qt() {
      const g = h.value;
      if (!g.trail.length) {
        Ht(g.field);
        return;
      }
      const c = w.value.find((V) => V.key === ie(g.field, g.trail.slice(0, -1)));
      c.shape.properties.splice(g.trail.at(-1), 1), re(c.field, c.trail);
    }
    function Jt(g, c, V) {
      if (c.length) {
        const X = w.value.find((ne) => ne.key === ie(g, c.slice(0, -1))).shape.properties, ae = c.at(-1), Z = ae + V;
        if (Z < 0 || Z >= X.length) return;
        [X[ae], X[Z]] = [X[Z], X[ae]], re(g, [...c.slice(0, -1), Z]);
      } else {
        const Y = o.config.fields.map((Z, ne) => Z.group === o.config.fields[g].group ? ne : -1).filter((Z) => Z >= 0), X = Y[Y.indexOf(g) + V];
        if (X === void 0) return;
        const ae = o.config.fields;
        [ae[g], ae[X]] = [ae[X], ae[g]], re(X);
      }
    }
    function Yt() {
      const g = h.value, c = Ue.value.find((Y) => Y.key === F.value), V = Ll(o.config.fields, g, c);
      re(V.field, V.trail);
    }
    function Xt(g) {
      const c = h.value?.shape;
      o.config.fields.splice(0, o.config.fields.length, ...o.config.fields.filter((Y) => Y.group !== g && !Y.group.startsWith(g + ".")));
      const V = w.value.find((Y) => Y.shape === c);
      V ? re(V.field, V.trail) : r.value = { kind: "document" };
    }
    function Zt(g, c) {
      const V = g.split(".").slice(0, -1).join(".");
      let X = Te(o.config.fields.map(K));
      for (const se of V.split(".").filter(Boolean)) X = X.children.find((ll) => ll.name === se);
      const ae = X.children.findIndex((se) => se.path === g), Z = X.children[ae + c]?.path;
      if (!Z) return;
      const ne = o.config.fields.filter((se) => se.group === g || se.group.startsWith(g + ".")), Fe = o.config.fields.filter((se) => se.group === Z || se.group.startsWith(Z + ".")), Me = o.config.fields, el = Math.min(Me.indexOf(ne[0]), Me.indexOf(Fe[0])), vt = Me.filter((se) => !ne.includes(se) && !Fe.includes(se));
      vt.splice(el, 0, ...c > 0 ? [...Fe, ...ne] : [...ne, ...Fe]);
      const tl = h.value?.shape;
      Me.splice(0, Me.length, ...vt);
      const Ye = w.value.find((se) => se.shape === tl);
      Ye && re(Ye.field, Ye.trail);
    }
    const _t = (g) => g.type === "list" ? `list of ${g.item?.type}` : g.type, ct = N({ get: () => o.config.tags.join(", "), set: (g) => {
      o.config.tags = [...new Set(g.split(",").map((c) => c.trim()).filter(Boolean))];
    } });
    return (g, c) => (n(), s("div", {
      ref_key: "root",
      ref: T,
      class: Q(["builder", { narrow: B.value, "panel-open": u.value, resizing: R.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: B.value && u.value
      }, [
        t("div", qs, [
          t("section", Ns, [
            t("header", Us, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": $.value,
                "aria-controls": "fields-body",
                onClick: c[0] || (c[0] = (V) => D("fields"))
              }, [
                p(m(A), {
                  icon: $.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[23] || (c[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", As, d(e.config.fields.length), 1)
              ], 8, Ms),
              !$.value && e.config.fields.length ? (n(), s("span", Bs, d(Gt.value), 1)) : y("", !0),
              e.readonly ? y("", !0) : (n(), s("div", Rs, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: st,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": Pe.value,
                  "aria-controls": m(ot),
                  disabled: e.config.fields.length >= 100,
                  onClick: Ot
                }, [
                  p(m(A), { icon: "tabler:folder-plus" }),
                  c[24] || (c[24] = q("Add group", -1))
                ], 8, Ls),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: c[1] || (c[1] = (V) => ut())
                }, [
                  p(m(A), { icon: "tabler:plus" }),
                  c[25] || (c[25] = q("Add field", -1))
                ], 8, Ts)
              ]))
            ]),
            W(t("div", Ds, [
              e.config.fields.length ? y("", !0) : (n(), s("p", Ps, "Add the values to pull from each document.")),
              t("div", Fs, [
                Pe.value && !e.readonly ? (n(), s("div", {
                  key: 0,
                  id: m(ot),
                  class: "group-create-row"
                }, [
                  t("span", Is, [
                    p(m(A), { icon: "tabler:folder-plus" })
                  ]),
                  p(qt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: It,
                    onCancel: it
                  })
                ], 8, Os)) : y("", !0),
                p(Be, { node: Dt.value }, {
                  header: me(({ path: V, label: Y, count: X, first: ae, last: Z }) => [
                    p(Ma, {
                      path: V,
                      name: Y,
                      count: X,
                      first: ae,
                      last: Z,
                      "max-length": Ft(V),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Pt(V, ne),
                      onAdd: (ne) => ut(V),
                      onReorder: (ne) => Zt(V, ne),
                      onRemove: (ne) => Xt(V)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: V }) => [
                    p(en, {
                      shape: e.config.fields[V],
                      field: V,
                      trail: [],
                      path: m(K)(e.config.fields[V]) || "New field",
                      selected: x.value,
                      readonly: e.readonly,
                      error: zt(V),
                      first: !e.config.fields.slice(0, V).some((Y) => Y.group === e.config.fields[V].group),
                      last: !e.config.fields.slice(V + 1).some((Y) => Y.group === e.config.fields[V].group),
                      onSelect: re,
                      onAdd: rt,
                      onReorder: Jt
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", js, [
                t("summary", zs, [
                  p(m(A), { icon: "tabler:braces" }),
                  c[26] || (c[26] = q("Output preview", -1))
                ]),
                he.value ? (n(), s("p", Ws, d(he.value), 1)) : (n(), s("div", Gs, [
                  t("div", null, [
                    c[27] || (c[27] = t("h3", null, "Output shape", -1)),
                    t("pre", Ks, d(JSON.stringify(De.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    c[28] || (c[28] = t("h3", null, "Example value", -1)),
                    t("pre", Hs, d(JSON.stringify(At.value, null, 2)), 1)
                  ])
                ])),
                c[29] || (c[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [We, $.value]
            ])
          ]),
          t("section", Qs, [
            t("header", Js, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": S.value,
                "aria-controls": "flow-body",
                onClick: c[2] || (c[2] = (V) => D("flow"))
              }, [
                p(m(A), {
                  icon: S.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                c[30] || (c[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", Xs, d(Kt.value) + " of 6", 1)
              ], 8, Ys),
              S.value ? y("", !0) : (n(), s("span", Zs, d(Wt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: c[3] || (c[3] = (V) => te({ kind: "details" }))
              }, [
                p(m(A), { icon: "tabler:info-circle" }),
                c[31] || (c[31] = q("Details", -1))
              ], 2)
            ]),
            W(t("div", _s, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: c[4] || (c[4] = (V) => te({ kind: "document" }))
              }, [
                t("span", eo, [
                  p(m(A), { icon: "tabler:file-text" })
                ]),
                t("span", to, [
                  c[32] || (c[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", lo, d(m(hl)(e.config.retrieval)), 1)
                ]),
                t("span", ao, [
                  t("span", no, d(m(xt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              c[37] || (c[37] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: c[5] || (c[5] = (V) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[38] || (c[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", so, [
                t("div", oo, [
                  c[33] || (c[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  p(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: c[6] || (c[6] = (V) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  c[34] || (c[34] = t("div", { class: "connector" }, null, -1)),
                  p(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: c[7] || (c[7] = (V) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", io, [
                  c[35] || (c[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  p(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: c[8] || (c[8] = (V) => te({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              c[39] || (c[39] = t("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              p(we, {
                stage: "extract",
                config: e.config,
                active: oe({ kind: "stage", stage: "extract" }),
                trace: xe("extract"),
                readonly: e.readonly,
                onSelect: c[9] || (c[9] = (V) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[40] || (c[40] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: c[10] || (c[10] = (V) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              c[41] || (c[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: c[11] || (c[11] = (V) => te({ kind: "output" }))
              }, [
                t("span", uo, [
                  p(m(A), { icon: "tabler:braces" })
                ]),
                t("span", ro, [
                  c[36] || (c[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", co, d(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [We, S.value]
            ])
          ])
        ])
      ], 8, Es),
      B.value && u.value ? (n(), s("div", {
        key: 0,
        class: "scrim",
        onClick: c[12] || (c[12] = (V) => G(!1))
      })) : y("", !0),
      u.value ? W((n(), s("aside", {
        key: String(B.value),
        class: "side-panel",
        "aria-labelledby": m(j),
        role: B.value ? "dialog" : void 0,
        "aria-modal": B.value ? "true" : void 0,
        style: qe(B.value ? void 0 : { width: `${a.value}px` }),
        onKeydown: c[21] || (c[21] = Ee((V) => B.value && G(!1), ["esc"]))
      }, [
        B.value ? y("", !0) : (n(), s("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: R.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": Ie,
          onPointerdown: ve(C, ["prevent"]),
          onKeydown: E,
          onDblclick: c[13] || (c[13] = (V) => P(Ze))
        }, null, 42, mo)),
        t("header", po, [
          t("span", bo, [
            p(m(A), { icon: Bt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: m(j) }, d(nt.value), 9, fo),
          t("button", {
            ref_key: "closeButton",
            ref: O,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": B.value ? "Close panel" : "Collapse panel",
            title: B.value ? "Close panel" : "Collapse panel",
            onClick: c[14] || (c[14] = (V) => G(!1))
          }, [
            p(m(A), {
              icon: B.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, ho)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          r.value.kind === "document" ? (n(), J(Cs, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : r.value.kind === "stage" ? (n(), J(rs, {
            key: 1,
            stage: r.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : r.value.kind === "field" && fe.value && h.value ? (n(), s(M, { key: 2 }, [
            t("p", go, d(h.value.path), 1),
            p(va, {
              field: fe.value,
              shape: h.value.shape,
              depth: h.value.depth,
              "sibling-names": L.value,
              "other-names": Rt.value,
              groups: jt.value,
              "deep-enabled": Lt.value,
              "map-enabled": Tt.value,
              readonly: e.readonly,
              onRemove: Qt,
              onAdd: c[15] || (c[15] = (V) => rt(h.value.field, h.value.trail)),
              onSelectItem: c[16] || (c[16] = (V) => re(h.value.field, [...h.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && h.value.trail.at(-1) !== "item" ? (n(), s("fieldset", yo, [
              t("label", null, [
                c[42] || (c[42] = q("Move to parent", -1)),
                W(t("select", {
                  "onUpdate:modelValue": c[17] || (c[17] = (V) => F.value = V),
                  "aria-label": "Move to parent"
                }, [
                  h.value.trail.length ? (n(), s("option", ko, "Top-level field")) : (n(), s("option", $o, "Choose an object…")),
                  (n(!0), s(M, null, I(Ue.value, (V) => (n(), s("option", {
                    key: V.key,
                    value: V.key
                  }, d(V.path), 9, xo))), 128))
                ], 512), [
                  [ze, F.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !F.value && !h.value.trail.length || !F.value && e.config.fields.length >= 100,
                onClick: Yt
              }, "Move", 8, wo)
            ])) : y("", !0)
          ], 64)) : r.value.kind === "details" ? (n(), s("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              c[43] || (c[43] = q("Name", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[18] || (c[18] = (V) => l.value = V),
                "aria-label": "Extractor name"
              }, null, 512), [
                [ee, l.value]
              ])
            ]),
            t("label", null, [
              c[44] || (c[44] = q("Description", -1)),
              W(t("textarea", {
                "onUpdate:modelValue": c[19] || (c[19] = (V) => v.value = V),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [ee, v.value]
              ])
            ]),
            t("label", null, [
              c[45] || (c[45] = q("Tags", -1)),
              W(t("input", {
                "onUpdate:modelValue": c[20] || (c[20] = (V) => ct.value = V),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  ee,
                  ct.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              c[46] || (c[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, Vo)) : r.value.kind === "output" ? (n(), s("div", So, [
            c[47] || (c[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Co, [
              (n(!0), s(M, null, I(e.config.fields, (V) => (n(), s("li", {
                key: m(K)(V)
              }, [
                t("span", Eo, d(m(K)(V) || "New field"), 1),
                t("span", qo, d(_t(V)), 1)
              ]))), 128))
            ]),
            c[48] || (c[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : y("", !0)
        ], 512)
      ], 44, vo)), [
        [m(kl), { disabled: !B.value }]
      ]) : B.value ? y("", !0) : (n(), s("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: c[22] || (c[22] = (V) => G(!0))
      }, [
        p(m(A), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", No, d(nt.value), 1)
      ]))
    ], 2));
  }
}), Mo = ["selected"], Ao = {
  key: 1,
  role: "alert"
}, Bo = {
  key: 2,
  class: "muted"
}, Nt = /* @__PURE__ */ z({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = U(!1), r = U("");
    Ne(async () => {
      try {
        await Je("wc-multiselect", { timeoutMs: 8e3 }), v.value = !0;
      } catch (k) {
        r.value = String(k);
      }
    });
    function b(k) {
      const u = k.detail;
      l("select", u.selected[0] || "", u.labels?.[0] || "");
    }
    return (k, u) => v.value ? (n(), s("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: b
    }, null, 40, Mo)) : r.value ? (n(), s("p", Ao, d(r.value), 1)) : (n(), s("span", Bo, "Loading uploads…"));
  }
}), Ro = ["data-error-kind"], Lo = { key: 0 }, Ut = /* @__PURE__ */ z({
  __name: "FieldFailure",
  props: {
    error: {}
  },
  setup(e) {
    return (o, l) => (n(), s("div", {
      class: "field-failure",
      "data-error-kind": e.error?.kind,
      role: "note",
      "aria-label": "Field failure"
    }, [
      t("p", null, [
        t("strong", null, d(e.error?.kind), 1),
        q(" · " + d(e.error?.message), 1)
      ]),
      t("small", null, d(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (n(), s("details", Lo, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, d(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : y("", !0)
    ], 8, Ro));
  }
}), To = { class: "nested-value" }, Do = { key: 0 }, Po = {
  key: 0,
  class: "muted"
}, Fo = { key: 1 }, Oo = { key: 2 }, Re = /* @__PURE__ */ z({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, l = N(() => o.value !== null && typeof o.value == "object" && !Array.isArray(o.value) ? o.value : null);
    return (v, r) => {
      const b = lt("NestedValue", !0);
      return n(), s("div", To, [
        Array.isArray(e.value) ? (n(), s("ol", Do, [
          (n(!0), s(M, null, I(e.value, (k, u) => (n(), s("li", { key: u }, [
            p(b, { value: k }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? y("", !0) : (n(), s("li", Po, "Empty list"))
        ])) : l.value ? (n(), s("dl", Fo, [
          (n(!0), s(M, null, I(l.value, (k, u) => (n(), s(M, { key: u }, [
            t("dt", null, d(u), 1),
            t("dd", null, [
              p(b, { value: k }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), s("span", Oo, d(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), Io = { class: "value-list" }, jo = ["aria-expanded", "onClick"], zo = { class: "value-name" }, Wo = { class: "bar" }, Go = ["title"], Ko = { class: "evidence" }, Ho = {
  key: 1,
  class: "muted"
}, Qo = {
  key: 2,
  class: "muted"
}, Mt = /* @__PURE__ */ z({
  __name: "ResultFields",
  props: {
    fields: {}
  },
  setup(e) {
    const o = e, l = N(() => Te(o.fields.map(($) => $.path))), v = U(), r = ($) => `${Math.round($ * 100)}%`, b = ($) => $ !== null && typeof $ == "object", k = ($) => Array.isArray($) ? `${$.length} items` : b($) ? `${Object.keys($).length} properties` : $ == null ? "—" : String($), u = ($) => $ >= 0.9 ? "high" : $ >= 0.7 ? "mid" : "low";
    return ($, S) => (n(), s("div", Io, [
      p(Be, { node: l.value }, {
        default: me(({ index: f }) => [
          (n(!0), s(M, null, I([e.fields[f]], (a) => (n(), s("div", {
            key: a.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": v.value === a.path,
              onClick: (i) => v.value = v.value === a.path ? void 0 : a.path
            }, [
              t("span", zo, d(a.name), 1),
              t("span", {
                class: Q(["value-text", { missing: a.missing }])
              }, d(a.failed ? "Failed" : a.missing ? "Not in the document" : k(a.value)), 3),
              a.failed ? y("", !0) : (n(), s("span", {
                key: 0,
                class: Q(["confidence", u(a.confidence)])
              }, [
                t("span", Wo, [
                  t("span", {
                    style: qe({ width: r(a.confidence) })
                  }, null, 4)
                ]),
                q(d(r(a.confidence)), 1),
                S[0] || (S[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              a.failed ? y("", !0) : (n(), s("span", {
                key: 1,
                class: Q(["chip", a.verified ? "primary" : "warn"]),
                title: a.reason
              }, [
                p(m(A), {
                  icon: a.verified ? "tabler:shield-check" : "tabler:shield-question"
                }, null, 8, ["icon"]),
                q(d(a.verified ? "Verified" : "Check"), 1)
              ], 10, Go)),
              p(m(A), {
                icon: v.value === a.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, jo),
            !a.failed && !a.missing && b(a.value) ? (n(), J(Re, {
              key: 0,
              class: "structured-value",
              value: a.value
            }, null, 8, ["value"])) : y("", !0),
            a.failed ? (n(), J(Ut, {
              key: 1,
              error: a.error
            }, null, 8, ["error"])) : y("", !0),
            W(t("div", Ko, [
              !a.failed && !a.missing && !b(a.value) ? (n(), J(Re, {
                key: 0,
                value: a.value
              }, null, 8, ["value"])) : y("", !0),
              (n(!0), s(M, null, I(a.evidence, (i, P) => (n(), s("blockquote", {
                key: P,
                class: Q({ unfound: i.found === !1 })
              }, [
                t("p", null, "“" + d(i.quote) + "”", 1),
                t("cite", null, [
                  q(d(i.section), 1),
                  i.page !== void 0 && i.page !== null ? (n(), s(M, { key: 0 }, [
                    q(" · Page " + d(i.page), 1)
                  ], 64)) : y("", !0),
                  i.found === !1 ? (n(), s(M, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : y("", !0)
                ])
              ], 2))), 128)),
              a.evidence.length ? y("", !0) : (n(), s("p", Ho, "No evidence.")),
              a.reason ? (n(), s("p", Qo, d(a.reason), 1)) : y("", !0)
            ], 512), [
              [We, v.value === a.path && !a.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), Jo = { class: "test" }, Yo = { class: "run-bar" }, Xo = { class: "run-input" }, Zo = { class: "muted run-note" }, _o = {
  key: 0,
  class: "empty"
}, ei = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, ti = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, li = {
  key: 3,
  class: "test-grid"
}, ai = { class: "block" }, ni = { class: "block-head" }, si = { class: "muted push" }, oi = { class: "block" }, ii = { class: "timeline" }, di = { class: "tl-icon" }, ui = { class: "tl-main" }, ri = { class: "tl-head" }, ci = { class: "muted push" }, vi = { class: "tl-bar" }, mi = { class: "muted" }, pi = {
  key: 0,
  class: "tl-msg"
}, bi = {
  key: 1,
  class: "chips"
}, fi = /* @__PURE__ */ z({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: o }) {
    const l = e, v = o, r = U(""), b = (f) => `${(f / 1e3).toFixed(1)}s`, k = N(() => Math.max(1, ...l.result?.trace.map((f) => f.duration_ms) ?? [1])), u = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, $ = (f) => u[f]?.label ?? ke[f] ?? f, S = (f) => u[f]?.icon ?? at[f] ?? "tabler:point";
    return (f, a) => (n(), s("div", Jo, [
      t("section", Yo, [
        t("div", Xo, [
          p(Nt, {
            value: r.value,
            onSelect: a[0] || (a[0] = (i) => r.value = i)
          }, null, 8, ["value"])
        ]),
        p(m(ue), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !r.value || e.running || !e.canRun,
          onClick: a[1] || (a[1] = (i) => v("run", r.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", Zo, d(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + d(e.retention) + ".", 1)
      ]),
      e.result ? y("", !0) : (n(), s("p", _o, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), s("p", ei, [
        p(m(A), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + d(e.result.error), 1)
      ])) : y("", !0),
      e.result?.status === "partial" ? (n(), s("p", ti, [
        p(m(A), { icon: "tabler:alert-triangle" }),
        a[2] || (a[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : y("", !0),
      e.result ? (n(), s("div", li, [
        t("section", ai, [
          t("header", ni, [
            a[3] || (a[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", si, [
              q(d(e.result.tokens.toLocaleString()) + " tokens · " + d(b(e.result.duration_ms)), 1),
              e.result.pages ? (n(), s(M, { key: 0 }, [
                q(" · " + d(e.result.pages) + " pages", 1)
              ], 64)) : y("", !0)
            ])
          ]),
          p(Mt, {
            fields: e.result.fields
          }, null, 8, ["fields"])
        ]),
        t("section", oi, [
          a[4] || (a[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", ii, [
            (n(!0), s(M, null, I(e.result.trace, (i, P) => (n(), s("li", {
              key: P,
              class: Q(i.status)
            }, [
              t("span", di, [
                p(m(A), {
                  icon: S(i.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", ui, [
                t("div", ri, [
                  t("strong", null, d($(i.kind)), 1),
                  t("span", ci, d(b(i.duration_ms)), 1)
                ]),
                t("span", vi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, i.duration_ms / k.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", mi, [
                  q(d(i.scope), 1),
                  i.model ? (n(), s(M, { key: 0 }, [
                    q(" · " + d(i.model), 1)
                  ], 64)) : y("", !0),
                  q(" · " + d((i.input_tokens + i.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                i.message ? (n(), s("p", pi, d(i.message), 1)) : y("", !0),
                i.queries?.length ? (n(), s("div", bi, [
                  (n(!0), s(M, null, I(i.queries, (R) => (n(), s("span", {
                    key: R,
                    class: "chip"
                  }, d(R), 1))), 128))
                ])) : y("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : y("", !0)
    ]));
  }
}), je = (e) => e.status === "completed" || e.status === "partial" || e.status === "failed", Se = (e) => e.metrics.length ? e.metrics.reduce((o, l) => o + l.accuracy, 0) / e.metrics.length : 0;
function He(e, o = /* @__PURE__ */ new Date()) {
  const l = new Date(e);
  return l.toDateString() === o.toDateString() ? l.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : l.getFullYear() === o.getFullYear() ? l.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : l.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const hi = { class: "evals" }, gi = { class: "block eval-run" }, yi = { class: "eval-run-main" }, ki = { class: "block-title" }, $i = {
  key: 0,
  class: "eval-note"
}, xi = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, wi = { class: "bar" }, Vi = { class: "muted" }, Si = { class: "stat-row" }, Ci = { class: "stat" }, Ei = { class: "stat-label" }, qi = { class: "stat-value" }, Ni = { class: "stat" }, Ui = { class: "stat-value" }, Mi = { class: "stat-delta flat" }, Ai = { class: "stat" }, Bi = { class: "stat-value" }, Ri = {
  key: 0,
  class: "stat-delta flat"
}, Li = { class: "stat" }, Ti = { class: "stat-value" }, Di = {
  key: 0,
  class: "stat-delta flat"
}, Pi = { class: "block" }, Fi = { class: "block-head" }, Oi = {
  key: 0,
  class: "compare-pick push"
}, Ii = ["value"], ji = ["value"], zi = {
  key: 0,
  class: "block-empty"
}, Wi = {
  key: 1,
  class: "table-scroll"
}, Gi = { key: 0 }, Ki = { key: 1 }, Hi = { class: "mono" }, Qi = { class: "acc strong" }, Ji = { class: "bar" }, Yi = { class: "muted" }, Xi = {
  key: 0,
  class: "muted"
}, Zi = { key: 1 }, _i = {
  key: 1,
  class: "muted"
}, ed = {
  key: 1,
  class: "block"
}, td = { class: "table-scroll" }, ld = { class: "metric-table result-matrix" }, ad = ["aria-expanded", "onClick"], nd = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, sd = ["colspan"], od = {
  key: 0,
  class: "cell-state"
}, id = ["data-error-kind", "title"], dd = ["data-label"], ud = ["title"], rd = {
  key: 0,
  class: "result-detail"
}, cd = ["colspan"], vd = ["data-error-kind", "title"], md = { class: "mono" }, pd = { class: "cmp" }, bd = { class: "cmp" }, fd = { key: 0 }, hd = { class: "muted case-meta" }, gd = { class: "block" }, yd = { class: "block-head" }, kd = { class: "count" }, $d = { class: "mono" }, xd = ["onUpdate:modelValue"], wd = ["onUpdate:modelValue"], Vd = ["onUpdate:modelValue", "placeholder"], Sd = ["onUpdate:modelValue", "type"], Cd = {
  key: 0,
  class: "error",
  role: "alert"
}, Ed = { class: "row" }, qd = {
  key: 1,
  class: "block-empty"
}, Nd = {
  key: 2,
  class: "block-empty"
}, Ud = {
  key: 3,
  class: "table-scroll"
}, Md = { class: "metric-table case-table" }, Ad = { class: "case-value" }, Bd = {
  key: 1,
  class: "muted"
}, Rd = { class: "num" }, Ld = ["aria-label", "disabled", "onClick"], Td = {
  key: 2,
  class: "block"
}, Dd = { class: "block-head" }, Pd = { class: "count" }, Fd = { class: "eval-history" }, Od = ["aria-current", "onClick"], Id = ["data-status"], jd = { class: "muted" }, zd = { class: "push" }, Wd = /* @__PURE__ */ z({
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
    const l = e, v = o, r = U(!1), b = U(""), k = U({}), u = U("");
    be(() => l.addedCaseId, () => {
      r.value = !1, b.value = "", k.value = {};
    });
    function $(w, h) {
      return w.type === "number" ? Number(h) : w.type === "boolean" ? h === "true" : w.type === "list" || w.type === "object" ? JSON.parse(h) : h;
    }
    function S() {
      u.value = "";
      const w = {};
      try {
        for (const h of l.fields) {
          const x = String(k.value[K(h)] ?? "").trim();
          x && wt(w, K(h), $(h, x));
        }
      } catch {
        u.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      v("add-case", { upload_id: b.value, expected: w });
    }
    const f = N(() => l.evaluations.find((w) => !je(w))), a = N(() => l.evaluations.filter(je)), i = N(() => l.evaluation), P = N(() => ({ done: (i.value?.results ?? []).filter((h) => h.status !== "queued").length, total: i.value?.case_count ?? 0 })), R = U();
    be(() => i.value?.id, () => {
      R.value = void 0;
    });
    const C = N(() => {
      if (!i.value) return;
      if (R.value) return a.value.find((h) => h.id === R.value);
      const w = a.value.findIndex((h) => h.id === i.value.id);
      return w >= 0 ? a.value[w + 1] : a.value[0];
    }), E = N(() => (i.value?.metrics ?? []).map((w) => ({ ...w, before: C.value?.metrics.find((h) => h.field === w.field) }))), H = N(() => (i.value?.fields ?? []).map(K)), O = N(() => Te(l.fields.map(K))), j = (w, h) => w.scores.find((x) => x.field === h), G = U(), D = (w) => `${Math.round(w * 100)}%`, T = (w) => {
      const h = Math.round(w * 100);
      return `${h > 0 ? "+" : h < 0 ? "−" : "±"}${Math.abs(h)} pts`;
    }, B = (w) => Math.round(w * 100) > 0 ? "up" : Math.round(w * 100) < 0 ? "down" : "flat", de = (w) => w >= 6e4 ? `${Math.floor(w / 6e4)}m ${Math.round(w % 6e4 / 1e3)}s` : `${(w / 1e3).toFixed(1)}s`, ye = (w) => w == null || w === "" ? "—" : typeof w == "string" ? w : Array.isArray(w) && w.every((h) => typeof h != "object") ? w.join(", ") : JSON.stringify(w), te = (w) => w ? w.failed ? "fail" : w.score >= 0.999 ? "pass" : w.score > 0 ? "partial" : "fail" : "none", oe = (w) => (w.results ?? []).filter((h) => h.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (w, h) => (n(), s("div", hi, [
      t("section", gi, [
        t("div", yi, [
          t("div", null, [
            t("h2", ki, "Evaluate revision " + d(e.revision), 1),
            h[6] || (h[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), s("p", $i, [
              p(m(A), { icon: "tabler:info-circle" }),
              h[5] || (h[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : y("", !0)
          ]),
          p(m(ue), {
            label: f.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!f.value,
            disabled: !e.cases.length || !e.fields.length || !!f.value || e.starting,
            onClick: h[0] || (h[0] = (x) => v("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        i.value && !m(je)(i.value) ? (n(), s("div", xi, [
          t("span", wi, [
            t("span", {
              style: qe({ width: D(P.value.total ? P.value.done / P.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Vi, d(fe[i.value.status]) + " · " + d(P.value.done) + " of " + d(P.value.total) + " cases", 1)
        ])) : y("", !0)
      ]),
      i.value && m(je)(i.value) ? (n(), s(M, { key: 0 }, [
        i.value.error ? (n(), s("p", {
          key: 0,
          class: Q(i.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          p(m(A), { icon: "tabler:alert-triangle" }),
          q(d(i.value.error), 1)
        ], 2)) : y("", !0),
        t("div", Si, [
          t("div", Ci, [
            t("span", Ei, "Accuracy · revision " + d(i.value.config_revision), 1),
            t("span", qi, d(D(m(Se)(i.value))), 1),
            C.value ? (n(), s("span", {
              key: 0,
              class: Q(["stat-delta", B(m(Se)(i.value) - m(Se)(C.value))])
            }, d(T(m(Se)(i.value) - m(Se)(C.value))) + " vs revision " + d(C.value.config_revision), 3)) : y("", !0)
          ]),
          t("div", Ni, [
            h[7] || (h[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Ui, [
              q(d(oe(i.value)), 1),
              t("small", null, " / " + d(i.value.case_count), 1)
            ]),
            t("span", Mi, d((i.value.results ?? []).filter((x) => x.status === "partial").length) + " partial · " + d((i.value.results ?? []).filter((x) => x.status === "failed").length) + " failed", 1)
          ]),
          t("div", Ai, [
            h[8] || (h[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Bi, d(i.value.tokens.toLocaleString()), 1),
            C.value ? (n(), s("span", Ri, d(C.value.tokens.toLocaleString()) + " before", 1)) : y("", !0)
          ]),
          t("div", Li, [
            h[9] || (h[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Ti, d(de(i.value.duration_ms)), 1),
            C.value ? (n(), s("span", Di, d(de(C.value.duration_ms)) + " before", 1)) : y("", !0)
          ])
        ]),
        t("section", Pi, [
          t("header", Fi, [
            h[11] || (h[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (n(), s("label", Oi, [
              h[10] || (h[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: C.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: h[1] || (h[1] = (x) => R.value = x.target.value)
              }, [
                (n(!0), s(M, null, I(a.value.filter((x) => x.id !== i.value.id), (x) => (n(), s("option", {
                  key: x.id,
                  value: x.id
                }, "Revision " + d(x.config_revision) + " · " + d(m(He)(x.created_at)), 9, ji))), 128))
              ], 40, Ii)
            ])) : y("", !0)
          ]),
          E.value.length ? (n(), s("div", Wi, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!C.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  h[12] || (h[12] = t("th", null, "Field", -1)),
                  h[13] || (h[13] = t("th", null, "Accuracy", -1)),
                  h[14] || (h[14] = t("th", null, "Verified", -1)),
                  C.value ? (n(), s("th", Gi, "Revision " + d(C.value.config_revision), 1)) : y("", !0),
                  C.value ? (n(), s("th", Ki, "Change")) : y("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), s(M, null, I(E.value, (x) => (n(), s("tr", {
                  key: x.field
                }, [
                  t("td", Hi, d(x.field), 1),
                  t("td", null, [
                    t("span", Qi, [
                      t("span", Ji, [
                        t("span", {
                          style: qe({ width: D(x.accuracy) })
                        }, null, 4)
                      ]),
                      q(d(D(x.accuracy)), 1)
                    ])
                  ]),
                  t("td", Yi, d(D(x.verified)), 1),
                  C.value ? (n(), s("td", Xi, d(x.before ? D(x.before.accuracy) : "—"), 1)) : y("", !0),
                  C.value ? (n(), s("td", Zi, [
                    x.before ? (n(), s("span", {
                      key: 0,
                      class: Q(["trend", B(x.accuracy - x.before.accuracy)])
                    }, [
                      p(m(A), {
                        icon: B(x.accuracy - x.before.accuracy) === "up" ? "tabler:trending-up" : B(x.accuracy - x.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(d(T(x.accuracy - x.before.accuracy)), 1)
                    ], 2)) : (n(), s("span", _i, "New field"))
                  ])) : y("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), s("p", zi, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : y("", !0),
      i.value?.results?.length ? (n(), s("section", ed, [
        h[19] || (h[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", td, [
          t("table", ld, [
            t("thead", null, [
              t("tr", null, [
                h[15] || (h[15] = t("th", null, "Document", -1)),
                (n(!0), s(M, null, I(H.value, (x) => (n(), s("th", {
                  key: x,
                  class: "mono"
                }, d(x), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), s(M, null, I(i.value.results, (x) => (n(), s(M, {
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
                      onClick: (L) => G.value = G.value === x.case_id ? void 0 : x.case_id
                    }, [
                      p(m(A), {
                        icon: G.value === x.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(d(x.upload_name), 1)
                    ], 8, ad),
                    x.status === "partial" ? (n(), s("span", nd, "Partial")) : y("", !0)
                  ]),
                  x.status === "queued" || x.status === "failed" ? (n(), s("td", {
                    key: 0,
                    colspan: H.value.length,
                    class: "muted"
                  }, [
                    x.status === "queued" ? (n(), s("span", od, [
                      p(m(A), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      h[16] || (h[16] = q("Waiting", -1))
                    ])) : (n(), s("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": x.error?.kind,
                      title: x.error?.kind
                    }, [
                      p(m(A), { icon: "tabler:alert-triangle" }),
                      q(d(x.error?.message), 1)
                    ], 8, id))
                  ], 8, sd)) : (n(!0), s(M, { key: 1 }, I(H.value, (L) => (n(), s("td", {
                    key: L,
                    "data-label": L
                  }, [
                    t("span", {
                      class: Q(["cell", te(j(x, L))]),
                      title: ye(j(x, L)?.value)
                    }, d(j(x, L)?.failed ? "Failed" : j(x, L) ? D(j(x, L).score) : "—"), 11, ud)
                  ], 8, dd))), 128))
                ], 2),
                G.value === x.case_id ? (n(), s("tr", rd, [
                  t("td", {
                    colspan: H.value.length + 1
                  }, [
                    x.error ? (n(), s("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": x.error.kind,
                      title: x.error.kind
                    }, d(x.error.message), 9, vd)) : y("", !0),
                    p(Be, {
                      node: m(Te)(x.scores.map((L) => L.field))
                    }, {
                      default: me(({ index: L }) => [
                        (n(!0), s(M, null, I([x.scores[L]], (F) => (n(), s("dl", {
                          key: F.field,
                          class: "compare"
                        }, [
                          t("dt", md, d(F.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(F)])
                            }, d(F.failed ? "Failed" : D(F.score)), 3),
                            t("div", pd, [
                              h[17] || (h[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              p(Re, {
                                value: F.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", bd, [
                              h[18] || (h[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              F.failed ? (n(), J(Ut, {
                                key: 0,
                                error: F.error
                              }, null, 8, ["error"])) : (n(), J(Re, {
                                key: 1,
                                value: F.value
                              }, null, 8, ["value"]))
                            ]),
                            F.failed ? y("", !0) : (n(), s("span", fd, [
                              t("span", {
                                class: Q(["chip", F.verified ? "primary" : "warn"])
                              }, [
                                p(m(A), {
                                  icon: F.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                q(d(F.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", hd, d(x.tokens.toLocaleString()) + " tokens · " + d(de(x.duration_ms)), 1)
                  ], 8, cd)
                ])) : y("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : y("", !0),
      t("section", gd, [
        t("header", yd, [
          h[20] || (h[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", kd, d(e.cases.length), 1),
          p(m(ue), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: h[2] || (h[2] = (x) => r.value = !r.value)
          }, null, 8, ["disabled"])
        ]),
        r.value ? (n(), s("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(S, ["prevent"])
        }, [
          t("label", null, [
            h[21] || (h[21] = q("Document", -1)),
            p(Nt, {
              value: b.value,
              onSelect: h[3] || (h[3] = (x) => {
                b.value = x;
              })
            }, null, 8, ["value"])
          ]),
          h[24] || (h[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          p(Be, { node: O.value }, {
            default: me(({ index: x }) => [
              (n(!0), s(M, null, I([e.fields[x]], (L) => (n(), s("label", {
                key: m(K)(L)
              }, [
                t("span", $d, d(L.name), 1),
                L.type === "boolean" ? W((n(), s("select", {
                  key: 0,
                  "onUpdate:modelValue": (F) => k.value[m(K)(L)] = F
                }, [...h[22] || (h[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, xd)), [
                  [ze, k.value[m(K)(L)]]
                ]) : L.type === "enum" ? W((n(), s("select", {
                  key: 1,
                  "onUpdate:modelValue": (F) => k.value[m(K)(L)] = F
                }, [
                  h[23] || (h[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), s(M, null, I(L.enum_values, (F) => (n(), s("option", { key: F }, d(F), 1))), 128))
                ], 8, wd)), [
                  [ze, k.value[m(K)(L)]]
                ]) : L.type === "object" || L.type === "list" ? W((n(), s("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (F) => k.value[m(K)(L)] = F,
                  rows: "2",
                  placeholder: L.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Vd)), [
                  [ee, k.value[m(K)(L)]]
                ]) : W((n(), s("input", {
                  key: 3,
                  "onUpdate:modelValue": (F) => k.value[m(K)(L)] = F,
                  type: L.type === "number" ? "number" : L.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, Sd)), [
                  [al, k.value[m(K)(L)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          u.value ? (n(), s("p", Cd, d(u.value), 1)) : y("", !0),
          t("div", Ed, [
            p(m(ue), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !b.value,
              loading: e.saving
            }, null, 8, ["disabled", "loading"]),
            p(m(ue), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: h[4] || (h[4] = (x) => r.value = !1)
            })
          ])
        ], 32)) : y("", !0),
        e.fields.length ? !e.cases.length && !r.value ? (n(), s("p", Nd, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), s("div", Ud, [
          t("table", Md, [
            h[25] || (h[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (n(!0), s(M, null, I(e.cases, (x) => (n(), s("tr", {
                key: x.id
              }, [
                t("td", null, [
                  p(m(A), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + d(x.upload_name), 1)
                ]),
                t("td", null, [
                  p(Be, { node: O.value }, {
                    default: me(({ index: L }) => [
                      t("div", Ad, [
                        t("strong", null, d(e.fields[L].name), 1),
                        m(ht)(x.expected, m(K)(e.fields[L])) !== void 0 ? (n(), J(Re, {
                          key: 0,
                          value: m(ht)(x.expected, m(K)(e.fields[L]))
                        }, null, 8, ["value"])) : (n(), s("span", Bd, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Rd, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${x.upload_name}`,
                    disabled: e.saving,
                    onClick: (L) => v("delete-case", x.id)
                  }, [
                    p(m(A), { icon: "tabler:trash" })
                  ], 8, Ld)
                ])
              ]))), 128))
            ])
          ])
        ])) : y("", !0) : (n(), s("p", qd, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), s("section", Td, [
        t("header", Dd, [
          h[26] || (h[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", Pd, d(e.evaluations.length), 1)
        ]),
        t("ul", Fd, [
          (n(!0), s(M, null, I(e.evaluations, (x) => (n(), s("li", {
            key: x.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: i.value?.id === x.id }),
              "aria-current": i.value?.id === x.id,
              onClick: (L) => v("open", x.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": x.status
              }, d(fe[x.status]), 9, Id),
              t("span", null, "Revision " + d(x.config_revision), 1),
              t("span", jd, d(m(He)(x.created_at)), 1),
              t("strong", zd, d(x.status === "completed" || x.status === "partial" ? D(m(Se)(x)) : "—"), 1)
            ], 10, Od)
          ]))), 128))
        ])
      ])) : y("", !0)
    ]));
  }
}), Gd = { class: "section-head" }, Kd = { class: "muted" }, Hd = {
  key: 0,
  class: "empty"
}, Qd = {
  key: 1,
  class: "table-scroll"
}, Jd = { class: "metric-table runs-table" }, Yd = ["aria-label", "aria-expanded", "onClick"], Xd = { class: "caller" }, Zd = ["data-status"], _d = {
  class: "num",
  "data-label": "Time"
}, eu = {
  class: "num",
  "data-label": "Tokens"
}, tu = {
  class: "muted",
  "data-label": "Expires"
}, lu = {
  key: 0,
  class: "result-detail"
}, au = { colspan: "6" }, nu = /* @__PURE__ */ z({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const o = U(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (v, r) => (n(), s(M, null, [
      t("div", Gd, [
        r[0] || (r[0] = t("h2", null, "Recent runs", -1)),
        t("span", Kd, "Runs expire after " + d(e.retention), 1)
      ]),
      e.runs.length ? (n(), s("div", Qd, [
        t("table", Jd, [
          r[1] || (r[1] = t("thead", null, [
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
            (n(!0), s(M, null, I(e.runs, (b) => (n(), s(M, {
              key: b.id
            }, [
              t("tr", null, [
                t("td", null, [
                  t("button", {
                    type: "button",
                    class: "case-toggle",
                    "aria-label": `Show values for run ${b.id}`,
                    "aria-expanded": o.value === b.id,
                    onClick: (k) => o.value = o.value === b.id ? void 0 : b.id
                  }, [
                    p(m(A), {
                      icon: o.value === b.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(d(m(He)(b.created_at)), 1)
                  ], 8, Yd)
                ]),
                t("td", null, [
                  t("span", Xd, [
                    p(m(A), {
                      icon: l[b.caller].icon
                    }, null, 8, ["icon"]),
                    q(d(l[b.caller].label), 1)
                  ])
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": b.status
                  }, d(b.status === "completed" ? "Completed" : b.status === "partial" ? "Partial" : "Failed"), 9, Zd)
                ]),
                t("td", _d, d((b.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", eu, d(Number(b.tokens).toLocaleString()), 1),
                t("td", tu, d(m(He)(b.expires_at)), 1)
              ]),
              o.value === b.id ? (n(), s("tr", lu, [
                t("td", au, [
                  p(Mt, {
                    fields: b.result.fields
                  }, null, 8, ["fields"])
                ])
              ])) : y("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), s("p", Hd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), su = {
  key: 0,
  role: "alert",
  class: "error banner"
}, ou = /* @__PURE__ */ z({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const l = e, v = o, r = U(), b = U("");
    return Ne(async () => {
      try {
        await Je("kickside-share", { timeoutMs: 8e3 });
      } catch ($) {
        b.value = `Sharing is unavailable: ${$ instanceof Error ? $.message : String($)}`;
        return;
      }
      const k = document.createElement("kickside-share"), u = encodeURIComponent(l.id);
      k.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${u}`, share_url: `/api/v1/component-access/share/${u}` })), k.style.display = "block", k.addEventListener("close", () => v("close")), r.value?.appendChild(k);
    }), (k, u) => (n(), s("div", {
      ref_key: "host",
      ref: r
    }, [
      b.value ? (n(), s("p", su, d(b.value), 1)) : y("", !0)
    ], 512));
  }
}), iu = { class: "docscout" }, du = { class: "toolbar" }, uu = { class: "toolbar-lead" }, ru = { class: "crumb-row" }, cu = { class: "crumb" }, vu = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, mu = ["id", "aria-selected", "aria-controls", "onClick"], pu = { class: "toolbar-side" }, bu = { class: "stats" }, fu = ["title"], hu = {
  key: 2,
  class: "unsaved"
}, gu = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, yu = {
  key: 1,
  role: "alert",
  class: "error banner"
}, ku = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, $u = ["id", "aria-labelledby"], xu = /* @__PURE__ */ z({
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
    const l = e, v = o, r = U(), b = U(!1), k = U("Builder"), u = U(gt()), $ = U(""), S = U(""), f = N(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    be(k, () => {
      r.value && (r.value.scrollTop = 0);
    }, { flush: "post" });
    const a = U(), i = U(), P = N(() => l.snapshot.can_edit && a.value !== l.snapshot.expected_revision), R = N(() => P.value && i.value !== l.snapshot.expected_revision);
    function C(D) {
      return $.value === D.title && S.value === (D.description ?? "") && yl(u.value, D.config);
    }
    function E() {
      const D = l.snapshot;
      u.value = structuredClone(pt(D.config ?? gt())), $.value = D.title, S.value = D.description ?? "", a.value = D.expected_revision, i.value = void 0;
    }
    be(() => l.snapshot, (D, T) => {
      f.value.includes(k.value) || (k.value = f.value[0]), !(T && D.id === T.id && D.can_edit && T.can_edit && !C(T) && !C(D)) && E();
    }, { immediate: !0 });
    const H = N(() => l.snapshot.can_edit && !C(l.snapshot)), O = N(() => gl(u.value)), j = N(() => Object.keys(ke).filter((D) => Ge(u.value, D)).length);
    function G() {
      v("save", { title: $.value, description: S.value, config: structuredClone(pt(u.value)), expected_revision: a.value });
    }
    return (D, T) => (n(), s("main", iu, [
      t("div", du, [
        t("div", uu, [
          t("span", ru, [
            e.back ? (n(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: T[0] || (T[0] = (B) => v("back"))
            }, [
              p(m(A), { icon: "tabler:arrow-left" })
            ])) : y("", !0),
            t("span", cu, d(e.snapshot.title), 1)
          ]),
          t("nav", vu, [
            (n(!0), s(M, null, I(f.value, (B) => (n(), s("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": k.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (de) => k.value = B
            }, d(B), 9, mu))), 128))
          ])
        ]),
        t("div", pu, [
          e.snapshot.can_share ? (n(), J(m(ue), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: T[1] || (T[1] = (B) => b.value = !0)
          }, {
            default: me(() => [
              p(m(A), { icon: "tabler:share" }),
              T[11] || (T[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : y("", !0),
          t("span", bu, [
            q(d(e.snapshot.field_count) + " " + d(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (n(), s(M, { key: 0 }, [
              q(" · " + d(j.value) + " steps · revision " + d(e.snapshot.expected_revision), 1)
            ], 64)) : (n(), s(M, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (n(), s(M, { key: 1 }, [
            P.value && !R.value ? (n(), J(m(ue), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: E
            })) : y("", !0),
            O.value ? (n(), s("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: O.value
            }, [
              p(m(A), { icon: "tabler:alert-circle" }),
              q(d(O.value), 1)
            ], 8, fu)) : H.value ? (n(), s("span", hu, "Unsaved")) : y("", !0),
            p(m(ue), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !H.value || !!O.value || !$.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : y("", !0)
        ])
      ]),
      R.value ? (n(), s("div", gu, [
        t("span", null, "Saved configuration changed to revision " + d(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        p(m(ue), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: E
        }),
        p(m(ue), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: T[2] || (T[2] = (B) => i.value = e.snapshot.expected_revision)
        })
      ])) : y("", !0),
      e.error ? (n(), s("p", yu, d(e.error), 1)) : y("", !0),
      b.value ? (n(), J(ou, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: T[3] || (T[3] = (B) => b.value = !1)
      }, null, 8, ["id", "title"])) : y("", !0),
      k.value === "Builder" && e.snapshot.can_edit ? (n(), s("div", ku, [
        p(Uo, {
          title: $.value,
          "onUpdate:title": T[4] || (T[4] = (B) => $.value = B),
          description: S.value,
          "onUpdate:description": T[5] || (T[5] = (B) => S.value = B),
          config: u.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), s("div", {
        key: 4,
        ref_key: "body",
        ref: r,
        class: "page-body"
      }, [
        t("div", {
          id: `panel-${k.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${k.value}`,
          class: "panel"
        }, [
          k.value === "Test" ? (n(), J(fi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: T[6] || (T[6] = (B) => v("run", B))
          }, null, 8, ["result", "retention", "running", "can-run"])) : y("", !0),
          k.value === "Evals" && e.snapshot.can_edit ? (n(), J(Wd, {
            key: 1,
            cases: e.snapshot.cases,
            "added-case-id": e.addedCaseId,
            fields: e.snapshot.config.fields,
            evaluations: e.evaluations,
            evaluation: e.evaluation,
            revision: e.snapshot.expected_revision,
            changed: H.value,
            saving: e.saving,
            starting: e.starting,
            onAddCase: T[7] || (T[7] = (B) => v("add-case", B)),
            onDeleteCase: T[8] || (T[8] = (B) => v("delete-case", B)),
            onEvaluate: T[9] || (T[9] = (B) => v("evaluate")),
            onOpen: T[10] || (T[10] = (B) => v("open-evaluation", B))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : y("", !0),
          k.value === "Runs" ? (n(), J(nu, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : y("", !0)
        ], 8, $u)
      ], 512))
    ]));
  }
}), wu = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Vu = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Bu = /* @__PURE__ */ z({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: o }) {
    const l = e, v = o, r = U(), b = U(""), k = U(!1), u = U(!1), $ = U(!1), S = U(), f = U(null), a = U([]), i = U();
    let P = [], R = 0, C = 0, E = 0, H;
    const O = (w) => w instanceof Error ? w.message : String(w), j = (w) => w === R;
    async function G(w, h) {
      const x = ++E;
      h && (H = h);
      const L = () => j(w) && x === E;
      try {
        const F = l.id, Ue = await ge.evaluations(F);
        if (!L()) return;
        a.value = Ue;
        const he = H ?? Ue[0]?.id;
        if (he) {
          const De = await ge.evaluation(F, he);
          if (!L() || De.id !== (H ?? he)) return;
          i.value = De;
        }
      } catch (F) {
        L() && (b.value = O(F));
      }
    }
    async function D(w) {
      const h = ++C, x = () => j(w) && h === C;
      if (!l.id) {
        b.value = "No extractor selected.";
        return;
      }
      try {
        const L = await ge.get(l.id);
        if (!x()) return;
        r.value = L, b.value = "", L.can_edit && await G(w);
      } catch (L) {
        x() && (b.value = O(L));
      }
    }
    be(() => l.id, (w, h) => {
      R++, H = void 0, P.forEach((L) => L()), P = [], S.value = void 0, r.value = void 0, f.value = null, a.value = [], i.value = void 0, b.value = "";
      const x = R;
      l.id && (P = [bt(`component.${l.id}`, () => D(x)), bt(`docscout.runs.${l.id}`, () => D(x))]), h !== void 0 && D(x);
    }, { immediate: !0 }), nl(() => D(R)), kt(() => {
      R++, P.forEach((w) => w());
    });
    async function T(w) {
      const h = R;
      k.value = !0, b.value = "";
      try {
        const x = await w();
        if (j(h))
          return await D(h), x;
      } catch (x) {
        j(h) && (b.value = O(x));
      } finally {
        k.value = !1;
      }
    }
    const B = (w) => T(() => ge.update(l.id, w));
    async function de(w) {
      const h = R, x = await T(() => ge.addCase(l.id, w));
      x && j(h) && (S.value = x.id);
    }
    const ye = (w) => T(() => ge.deleteCase(l.id, w));
    async function te(w) {
      const h = R;
      u.value = !0, b.value = "";
      try {
        const x = await ge.run(l.id, w);
        j(h) && (f.value = x, await D(h));
      } catch (x) {
        j(h) && (b.value = O(x));
      } finally {
        u.value = !1;
      }
    }
    async function oe() {
      const w = R;
      $.value = !0, b.value = "";
      try {
        const { eval_id: h } = await ge.evaluate(l.id);
        j(w) && await G(w, h);
      } catch (h) {
        j(w) && (b.value = O(h));
      } finally {
        $.value = !1;
      }
    }
    function fe(w) {
      G(R, w);
    }
    return (w, h) => r.value ? (n(), J(xu, {
      key: 0,
      snapshot: r.value,
      "added-case-id": S.value,
      saving: k.value,
      running: u.value,
      starting: $.value,
      result: f.value,
      evaluations: a.value,
      evaluation: i.value,
      error: b.value,
      back: e.back,
      onBack: h[0] || (h[0] = (x) => v("back")),
      onRun: te,
      onSave: B,
      onAddCase: de,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : b.value ? (n(), s("p", wu, d(b.value), 1)) : (n(), s("p", Vu, "Loading Docscout…"));
  }
});
export {
  Bu as _,
  He as w
};
