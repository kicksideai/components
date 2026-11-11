import { defineComponent as W, useModel as Le, openBlock as n, createElementBlock as s, withModifiers as ve, createElementVNode as t, mergeModels as Qe, computed as U, withKeys as Ee, unref as m, normalizeClass as Q, createVNode as p, toDisplayString as i, Fragment as M, renderList as O, createCommentVNode as y, createTextVNode as q, createBlock as J, ref as A, useId as pe, watch as be, withDirectives as z, vModelText as _, vModelSelect as ze, resolveComponent as lt, renderSlot as Ie, withCtx as me, mergeProps as mt, vShow as We, onMounted as Ne, nextTick as Ce, normalizeStyle as qe, onBeforeUnmount as kt, vModelDynamic as al, toRaw as pt } from "vue";
import { b as nl } from "./wc-runtime-DUvG5Zds.js";
import { loadByTagName as Je, on as bt } from "@wippy-fe/proxy";
import { i as Ge, f as $t, t as _e, s as ke, a as at, b as sl, m as xt, d as K, M as Ae, e as wt, g as Vt, h as et, j as ol, k as il, l as dl, o as ul, p as rl, q as St, r as cl, u as vl, v as ml, w as pl, x as ft, y as bl, z as Xe, A as fl, B as Te, C as gl, D as gt, n as ht, E as hl, F as yl, c as he } from "./config-DmObsT0z.js";
import ue from "primevue/button";
import { Icon as R } from "@iconify/vue";
import kl from "primevue/focustrap";
import Ct from "primevue/menu";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const $l = ["aria-checked", "aria-label", "disabled"], Z = /* @__PURE__ */ W({
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
      onClick: v[0] || (v[0] = ve((u) => o.value = !o.value, ["stop"]))
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
  setup(e, { emit: o }) {
    const l = e, v = o, u = U(() => Ge(l.config, l.stage)), b = U(() => l.config.stages[l.stage].model), k = U({ get: () => u.value, set: (w) => {
      l.config.stages[l.stage].enabled = w;
    } }), d = U(() => {
      const w = l.config, E = w.stages;
      switch (l.stage) {
        case "map":
          return w.fields.filter((c) => c.search_within === "sections").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...E.prefetch.queries.map((c) => ({ text: c.name || "Untitled query", tone: "" })), ...w.fields.filter((c) => c.search_hints.trim()).map((c) => ({ text: c.name, tone: "hint" }))];
        case "scout":
          return E.scout.mode === "agent" ? E.scout.tools.map((c) => ({ text: _e(c).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((c) => c.strategy === "deep").map((c) => ({ text: c.name || "New field", tone: "primary" }));
        case "extract":
          return $t(w).map((c) => ({ text: `${c.name} · ${c.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), x = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, E) => (n(), s("div", {
      class: Q(["node kx-focus-halo", { active: e.active, off: !u.value, fixed: e.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": m(ke)[e.stage],
      onClick: E[1] || (E[1] = (c) => v("select")),
      onKeydown: [
        E[2] || (E[2] = Ee((c) => v("select"), ["enter"])),
        E[3] || (E[3] = Ee(ve((c) => v("select"), ["prevent"]), ["space"]))
      ]
    }, [
      t("span", wl, [
        p(m(R), {
          icon: m(at)[e.stage]
        }, null, 8, ["icon"])
      ]),
      t("span", Vl, [
        t("span", Sl, i(m(ke)[e.stage]), 1),
        t("span", Cl, i(u.value ? m(sl)(e.stage, e.config) : "Off"), 1),
        u.value && d.value.length ? (n(), s("span", El, [
          (n(!0), s(M, null, O(d.value, (c) => (n(), s("span", {
            key: c.text,
            class: Q(["chip", { primary: c.tone === "primary", "muted-chip": c.tone === "hint" }])
          }, i(c.text), 3))), 128))
        ])) : y("", !0),
        e.trace ? (n(), s("span", ql, [
          p(m(R), {
            icon: e.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          q(i(x(e.trace)), 1)
        ])) : y("", !0)
      ]),
      t("span", Nl, [
        u.value && b.value ? (n(), s("span", Ul, i(m(xt)(b.value)), 1)) : y("", !0),
        e.stage !== "extract" && !e.readonly ? (n(), J(Z, {
          key: 1,
          modelValue: k.value,
          "onUpdate:modelValue": E[0] || (E[0] = (c) => k.value = c),
          label: `Enable ${m(ke)[e.stage]}`
        }, null, 8, ["modelValue", "label"])) : y("", !0)
      ])
    ], 42, xl));
  }
}), Ml = ["aria-labelledby"], Al = ["aria-label", "aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], $e = /* @__PURE__ */ W({
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
    const o = e, l = Le(e, "modelValue"), v = A([]);
    function u(b, k) {
      const d = o.options.length - 1, x = { ArrowRight: k + 1, ArrowDown: k + 1, ArrowLeft: k - 1, ArrowUp: k - 1, Home: 0, End: d }[b.key];
      if (x === void 0) return;
      b.preventDefault();
      const w = (x + o.options.length) % o.options.length;
      l.value = o.options[w].value, v.value[w]?.focus();
    }
    return (b, k) => (n(), s("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": e.labelledBy
    }, [
      (n(!0), s(M, null, O(e.options, (d, x) => (n(), s("button", {
        key: d.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: v,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        role: "radio",
        "aria-label": e.name ? `${e.name}: ${d.label}` : void 0,
        "aria-checked": l.value === d.value,
        tabindex: l.value === d.value ? 0 : -1,
        disabled: e.disabled,
        onClick: (w) => l.value = d.value,
        onKeydown: (w) => u(w, x)
      }, [
        d.icon ? (n(), J(m(R), {
          key: 0,
          icon: d.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])) : y("", !0),
        t("span", null, i(d.label), 1)
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
], Rl = (e) => Et.find((o) => o.value === e).icon;
function Ke(e) {
  const o = [];
  function l(v, u, b, k) {
    o.push({ field: u, trail: b, shape: v, path: k, depth: b.length + 1, key: ie(u, b) }), v.properties?.forEach((d, x) => l(d, u, [...b, x], `${k}.${d.name || "New property"}`)), v.item && l(v.item, u, [...b, "item"], `${k}[]`);
  }
  return e.forEach((v, u) => l(v, u, [], K(v) || "New field")), o;
}
function tt(e) {
  return 1 + Math.max(0, ...(e.properties ?? []).map(tt), e.item ? tt(e.item) : 0);
}
function Bl(e, o) {
  return Ke(e).filter((l) => l.shape.type === "object" && ((l.shape.properties?.length ?? 0) < 100 || l.field === o.field && ie(l.field, l.trail) === ie(o.field, o.trail.slice(0, -1))) && l.depth + tt(o.shape) <= Ae && !(l.field === o.field && o.trail.every((v, u) => l.trail[u] === v)));
}
function Ll(e, o, l) {
  const v = { ...Vt(), ...o.shape, name: o.shape.name };
  o.trail.length ? Ke(e).find((k) => k.key === ie(o.field, o.trail.slice(0, -1))).shape.properties.splice(o.trail.at(-1), 1) : e.splice(o.field, 1);
  let u;
  if (l) {
    const { name: b, type: k, description: d, enum_values: x, expected_format: w, required: E, properties: c, item: a } = v;
    u = { name: b, type: k, description: d, enum_values: x, expected_format: w, required: E, ...c ? { properties: c } : {}, ...a ? { item: a } : {} }, l.shape.properties.push(u), u = l.shape.properties.at(-1);
  } else
    u = { ...et(), ...v, group: "" }, e.push(u), u = e.at(-1);
  return Ke(e).find((b) => b.shape === u);
}
function yt(e, o = !1) {
  function l(u) {
    return u.type === "object" ? Object.fromEntries((u.properties ?? []).map((b) => [b.name || "unnamed", l(b)])) : u.type === "list" ? u.item ? [l(u.item)] : [] : o ? u.enum_values?.length ? u.enum_values[0] : { text: "Example value", number: 42, boolean: !0, date: "2026-01-15", enum: null }[u.type] : u.type === "enum" ? u.enum_values?.join(" | ") || "enum" : u.type;
  }
  const v = {};
  return e.forEach((u) => wt(v, K(u) || "unnamed", l(u))), v;
}
const Tl = { class: "shape-editor" }, Dl = { key: 0 }, Pl = ["aria-label", "aria-invalid", "aria-describedby"], Fl = { class: "label-block" }, Il = ["id"], Ol = { key: 0 }, jl = ["id"], zl = {
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
}, Zl = { class: "muted" }, _l = ["aria-label", "disabled"], ea = /* @__PURE__ */ W({
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
    const l = e, v = o, u = U(() => l.shape), b = U(() => l.named ? l.depth === 1 ? "Field type" : "Property type" : "Item type"), k = U(() => Et.filter((B) => l.depth < Ae || !["object", "list"].includes(B.value))), d = U({ get: () => l.shape.type, set: (B) => {
      l.shape.type = B, delete l.shape.properties, delete l.shape.item, l.shape.enum_values = [], B === "object" && (l.shape.properties = []), B === "list" && (l.shape.item = ol());
    } }), x = pe(), w = pe(), E = A(""), c = A("");
    be(() => l.shape, () => {
      E.value = "", c.value = "";
    });
    const a = U(() => l.validationError || (l.named ? il(u.value.name, l.siblingNames) : "") || dl(l.shape, l.depth));
    function f() {
      const B = E.value.trim(), S = l.shape.enum_values ?? [];
      if (!B || B.length > 200) {
        c.value = "Enter 1 to 200 characters.";
        return;
      }
      if (S.includes(B)) {
        c.value = "This value already exists.";
        return;
      }
      if (S.length >= 100) {
        c.value = "Use at most 100 allowed values.";
        return;
      }
      l.shape.enum_values = [...S, B], E.value = "", c.value = "";
    }
    return (B, S) => (n(), s("div", Tl, [
      e.named ? (n(), s("label", Dl, [
        S[8] || (S[8] = q("Name", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[0] || (S[0] = (N) => u.value.name = N),
          "aria-label": e.depth === 1 ? "Field name" : "Property name",
          "aria-invalid": !!a.value,
          "aria-describedby": a.value ? m(w) : void 0,
          maxlength: "80",
          spellcheck: "false",
          class: "mono-input"
        }, null, 8, Pl), [
          [
            _,
            u.value.name,
            void 0,
            { trim: !0 }
          ]
        ])
      ])) : y("", !0),
      t("div", Fl, [
        t("span", { id: m(x) }, i(e.named ? "Data type" : "Item type"), 9, Il),
        p($e, {
          modelValue: d.value,
          "onUpdate:modelValue": S[1] || (S[1] = (N) => d.value = N),
          class: "type-picker",
          options: k.value,
          "labelled-by": m(x),
          name: b.value,
          disabled: e.readonly
        }, null, 8, ["modelValue", "options", "labelled-by", "name", "disabled"]),
        e.depth === m(Ae) ? (n(), s("small", Ol, "Level four · choose a value type.")) : y("", !0)
      ]),
      a.value ? (n(), s("p", {
        key: 1,
        id: m(w),
        class: "field-error",
        role: "alert"
      }, i(a.value), 9, jl)) : y("", !0),
      m(ul)(e.shape, e.named) ? (n(), s("div", zl, [
        t("span", null, i(e.shape.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        t("div", Wl, [
          (n(!0), s(M, null, O(e.shape.enum_values, (N, H) => (n(), s("span", {
            key: N,
            class: "chip primary"
          }, [
            q(i(N), 1),
            e.readonly ? y("", !0) : (n(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Remove allowed value ${N}`,
              onClick: (I) => e.shape.enum_values.splice(H, 1)
            }, [
              p(m(R), { icon: "tabler:x" })
            ], 8, Gl))
          ]))), 128))
        ]),
        e.readonly ? y("", !0) : (n(), s("div", Kl, [
          z(t("input", {
            "onUpdate:modelValue": S[2] || (S[2] = (N) => E.value = N),
            "aria-label": "New allowed value",
            placeholder: "Add a value…",
            maxlength: "200",
            onKeydown: Ee(ve(f, ["prevent"]), ["enter"])
          }, null, 40, Hl), [
            [_, E.value]
          ]),
          t("button", {
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo",
            onClick: f
          }, "Add")
        ])),
        c.value ? (n(), s("p", Ql, i(c.value), 1)) : y("", !0)
      ])) : y("", !0),
      t("label", null, [
        S[9] || (S[9] = q("Description", -1)),
        z(t("textarea", {
          "onUpdate:modelValue": S[3] || (S[3] = (N) => e.shape.description = N),
          rows: "3",
          maxlength: "4000",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, e.shape.description]
        ])
      ]),
      ["boolean", "enum"].includes(e.shape.type) ? y("", !0) : (n(), s("label", Jl, [
        S[10] || (S[10] = q("Expected format", -1)),
        z(t("input", {
          "onUpdate:modelValue": S[4] || (S[4] = (N) => e.shape.expected_format = N),
          maxlength: "400",
          placeholder: m(rl)(e.shape)
        }, null, 8, Yl), [
          [_, e.shape.expected_format]
        ])
      ])),
      e.named ? (n(), s("div", Xl, [
        S[11] || (S[11] = t("span", null, "Required", -1)),
        p(Z, {
          modelValue: u.value.required,
          "onUpdate:modelValue": S[5] || (S[5] = (N) => u.value.required = N),
          label: "Required",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : y("", !0),
      e.shape.type === "object" ? (n(), s(M, { key: 5 }, [
        t("p", Zl, i(e.shape.properties?.length ?? 0) + " properties · Select a property in the tree to edit it.", 1),
        !e.readonly && e.depth < m(Ae) ? (n(), s("button", {
          key: 0,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Add property to ${e.label}`,
          disabled: (e.shape.properties?.length ?? 0) >= 100,
          onClick: S[6] || (S[6] = (N) => v("add"))
        }, [
          p(m(R), { icon: "tabler:plus" }),
          S[12] || (S[12] = q("Add property", -1))
        ], 8, _l)) : y("", !0)
      ], 64)) : y("", !0),
      e.shape.type === "list" && e.shape.item ? (n(), s("button", {
        key: 6,
        type: "button",
        class: "kx-btn kx-btn-ghost kx-focus-halo",
        onClick: S[7] || (S[7] = (N) => v("selectItem"))
      }, [
        p(m(R), { icon: "tabler:brackets" }),
        q("Edit item shape · " + i(e.shape.item.type), 1)
      ])) : y("", !0)
    ]));
  }
}), ta = ["disabled"], la = { class: "grid" }, aa = { class: "context-stepper" }, na = ["disabled"], sa = ["disabled"], oa = {
  key: 0,
  class: "field-note"
}, ia = { class: "label-block" }, da = {
  key: 1,
  class: "field-error"
}, ua = { id: "docscout-groups" }, ra = ["value"], ca = { class: "toggle-row" }, va = /* @__PURE__ */ W({
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
    const l = e, v = o, u = U(() => !l.depth || l.depth === 1), b = U(() => St(l.field, l.otherNames));
    return (k, d) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      p(ea, {
        shape: e.shape ?? e.field,
        depth: e.depth ?? 1,
        label: e.shape?.name || e.field.name || "field",
        named: u.value || !!e.shape?.name || !!e.siblingNames,
        "sibling-names": e.siblingNames,
        "validation-error": u.value ? b.value : void 0,
        readonly: e.readonly,
        onAdd: d[0] || (d[0] = (x) => v("add")),
        onSelectItem: d[1] || (d[1] = (x) => v("selectItem"))
      }, null, 8, ["shape", "depth", "label", "named", "sibling-names", "validation-error", "readonly"]),
      u.value ? (n(), s(M, { key: 0 }, [
        d[25] || (d[25] = t("h4", null, "Finding it", -1)),
        t("label", null, [
          d[12] || (d[12] = q("Search hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": d[2] || (d[2] = (x) => e.field.search_hints = x),
            rows: "2",
            maxlength: "4000",
            placeholder: "One query per line"
          }, null, 512), [
            [_, e.field.search_hints]
          ]),
          d[13] || (d[13] = t("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
        ]),
        t("div", la, [
          t("label", null, [
            d[15] || (d[15] = q("Strategy", -1)),
            z(t("select", {
              "onUpdate:modelValue": d[3] || (d[3] = (x) => e.field.strategy = x)
            }, [...d[14] || (d[14] = [
              t("option", { value: "standard" }, "Standard", -1),
              t("option", { value: "deep" }, "Deep analysis", -1)
            ])], 512), [
              [ze, e.field.strategy]
            ])
          ]),
          t("label", null, [
            d[16] || (d[16] = q("Chunks to read", -1)),
            t("span", aa, [
              z(t("input", {
                "onUpdate:modelValue": d[4] || (d[4] = (x) => e.field.chunks = x),
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
                onClick: d[5] || (d[5] = (x) => e.field.chunks--)
              }, "−", 8, na),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Increase chunks to read",
                disabled: e.field.chunks >= 1e3 || e.readonly,
                onClick: d[6] || (d[6] = (x) => e.field.chunks++)
              }, "+", 8, sa)
            ]),
            d[17] || (d[17] = t("small", null, "Per search hint", -1))
          ])
        ]),
        e.field.strategy === "deep" && !e.deepEnabled ? (n(), s("p", oa, [
          p(m(R), { icon: "tabler:info-circle" }),
          d[18] || (d[18] = q("Deep analysis is off in the flow, so this field runs as standard.", -1))
        ])) : y("", !0),
        t("div", ia, [
          d[19] || (d[19] = t("span", { id: "within-label" }, "Search within", -1)),
          p($e, {
            modelValue: e.field.search_within,
            "onUpdate:modelValue": d[7] || (d[7] = (x) => e.field.search_within = x),
            "labelled-by": "within-label",
            options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
          }, null, 8, ["modelValue"]),
          t("small", null, i(e.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
        ]),
        e.field.search_within === "sections" && !e.mapEnabled ? (n(), s("p", da, [
          p(m(R), { icon: "tabler:alert-circle" }),
          d[20] || (d[20] = q("Turn on Map the document to read sections.", -1))
        ])) : y("", !0),
        t("label", null, [
          d[21] || (d[21] = q("Group", -1)),
          z(t("input", {
            "onUpdate:modelValue": d[8] || (d[8] = (x) => e.field.group = x),
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
          t("datalist", ua, [
            (n(!0), s(M, null, O(e.groups, (x) => (n(), s("option", {
              key: x,
              value: x
            }, null, 8, ra))), 128))
          ]),
          d[22] || (d[22] = t("small", null, "Use dotted snake_case names. Values nest under this path.", -1))
        ]),
        d[26] || (d[26] = t("h4", null, "Checking it", -1)),
        t("label", null, [
          d[23] || (d[23] = q("Validation hints", -1)),
          z(t("textarea", {
            "onUpdate:modelValue": d[9] || (d[9] = (x) => e.field.validation_hints = x),
            rows: "2",
            maxlength: "4000",
            placeholder: "Rules the value must satisfy"
          }, null, 512), [
            [_, e.field.validation_hints]
          ])
        ]),
        t("div", ca, [
          d[24] || (d[24] = t("span", null, [
            q("Evidence required"),
            t("small", null, "The value must cite a quote from the document.")
          ], -1)),
          p(Z, {
            modelValue: e.field.evidence_required,
            "onUpdate:modelValue": d[10] || (d[10] = (x) => e.field.evidence_required = x),
            label: "Evidence required",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : y("", !0),
      !e.readonly && (u.value || e.siblingNames) ? (n(), s("button", {
        key: 1,
        type: "button",
        class: "kx-btn kx-btn-danger kx-focus-halo",
        onClick: d[11] || (d[11] = (x) => v("remove"))
      }, i(u.value ? "Remove field" : "Remove property"), 1)) : y("", !0)
    ], 8, ta));
  }
}), ma = { class: "field-groups" }, pa = {
  key: 0,
  class: "rows"
}, ba = ["aria-label"], fa = { class: "field-group-head" }, ga = ["aria-label", "aria-expanded", "aria-controls", "onClick"], ha = { class: "group-title" }, ya = ["id"], ka = { class: "group-title" }, Re = /* @__PURE__ */ W({
  __name: "FieldGroups",
  props: {
    node: {}
  },
  setup(e) {
    const o = A(/* @__PURE__ */ new Set()), l = pe();
    function v(b) {
      o.value.has(b) ? o.value.delete(b) : o.value.add(b);
    }
    const u = (b) => b.indices.length + b.children.reduce((k, d) => k + u(d), 0);
    return (b, k) => {
      const d = lt("FieldGroups", !0);
      return n(), s("div", ma, [
        e.node.indices.length ? (n(), s("ul", pa, [
          (n(!0), s(M, null, O(e.node.indices, (x) => (n(), s("li", { key: x }, [
            Ie(b.$slots, "default", { index: x })
          ]))), 128))
        ])) : y("", !0),
        (n(!0), s(M, null, O(e.node.children, (x, w) => (n(), s("section", {
          key: x.path,
          class: "field-group",
          "aria-label": `Group ${x.path}`
        }, [
          t("header", fa, [
            t("button", {
              type: "button",
              class: "tree-toggle kx-iconbtn kx-focus-outline",
              "aria-label": `${o.value.has(x.path) ? "Expand" : "Collapse"} group ${x.path}`,
              "aria-expanded": !o.value.has(x.path),
              "aria-controls": `${m(l)}-${x.path}`,
              onClick: (E) => v(x.path)
            }, [
              p(m(R), {
                icon: o.value.has(x.path) ? "tabler:chevron-right" : "tabler:chevron-down"
              }, null, 8, ["icon"])
            ], 8, ga),
            Ie(b.$slots, "header", {
              path: x.path,
              label: x.name,
              count: u(x),
              first: w === 0,
              last: w === e.node.children.length - 1
            }, () => [
              t("span", ha, i(x.name), 1)
            ])
          ]),
          z(t("div", {
            id: `${m(l)}-${x.path}`,
            class: "group-content"
          }, [
            p(d, { node: x }, {
              default: me((E) => [
                Ie(b.$slots, "default", mt({ ref_for: !0 }, E))
              ]),
              header: me((E) => [
                Ie(b.$slots, "header", mt({ ref_for: !0 }, E), () => [
                  t("span", ka, i(E.label), 1)
                ])
              ]),
              _: 3
            }, 8, ["node"])
          ], 8, ya), [
            [We, !o.value.has(x.path)]
          ])
        ], 8, ba))), 128))
      ]);
    };
  }
}), $a = ["aria-label", "maxlength", "aria-invalid", "aria-describedby", "onKeydown"], xa = ["aria-label", "title"], wa = ["aria-label", "title"], Va = ["id"], qt = /* @__PURE__ */ W({
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
    const l = e, v = o, u = A(l.initialValue), b = A(""), k = A(), d = pe();
    Ne(() => {
      k.value.focus(), k.value.select();
    });
    function x() {
      const w = u.value.trim();
      if (!w || !cl.test(w)) {
        b.value = "Use a dotted path of snake_case group names.";
        return;
      }
      if (w.length > l.maxLength) {
        b.value = "The group and its nested paths must fit within 320 characters.";
        return;
      }
      v("save", w);
    }
    return (w, E) => (n(), s("form", {
      class: "group-path-editor",
      onSubmit: ve(x, ["prevent"])
    }, [
      z(t("input", {
        ref_key: "input",
        ref: k,
        "onUpdate:modelValue": E[0] || (E[0] = (c) => u.value = c),
        "aria-label": e.inputLabel,
        maxlength: e.maxLength,
        "aria-invalid": !!b.value,
        "aria-describedby": b.value ? m(d) : void 0,
        "aria-required": "true",
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "parties.borrower",
        onKeydown: [
          Ee(ve(x, ["prevent"]), ["enter"]),
          E[1] || (E[1] = Ee(ve((c) => v("cancel"), ["stop", "prevent"]), ["esc"]))
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
        p(m(R), { icon: "tabler:check" })
      ], 8, xa),
      t("button", {
        type: "button",
        class: "kx-iconbtn kx-focus-outline",
        "aria-label": e.cancelLabel,
        title: e.cancelLabel,
        onClick: E[2] || (E[2] = (c) => v("cancel"))
      }, [
        p(m(R), { icon: "tabler:x" })
      ], 8, wa),
      b.value ? (n(), s("p", {
        key: 0,
        id: m(d),
        class: "field-error",
        role: "alert"
      }, i(b.value), 9, Va)) : y("", !0)
    ], 32));
  }
}), Sa = ["title"], Ca = ["aria-label", "data-group-rename", "title"], Ea = ["aria-label"], qa = {
  key: 2,
  class: "group-actions"
}, Na = ["aria-label", "disabled"], Ua = ["aria-label", "aria-expanded", "aria-controls"], Ma = /* @__PURE__ */ W({
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
    const l = e, v = o, u = A(!1), b = A(!1), k = A(), d = A(), x = A(), w = pe(), E = U(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", 1) },
      { separator: !0 },
      { label: "Delete group and its fields", command: () => v("remove") }
    ]);
    function c() {
      u.value = !0;
    }
    async function a() {
      u.value = !1, await Ce(), d.value.focus();
    }
    async function f(B) {
      const S = k.value.closest(".field-tree");
      u.value = !1, v("rename", B), await Ce(), S.querySelector(`[data-group-rename="${B}"]`).focus();
    }
    return (B, S) => (n(), s("div", {
      ref_key: "heading",
      ref: k,
      class: "group-heading"
    }, [
      u.value ? (n(), J(qt, {
        key: 0,
        "initial-value": e.path,
        "input-label": `Group path for ${e.path}`,
        "save-label": "Save group name",
        "cancel-label": "Cancel group rename",
        "max-length": e.maxLength,
        onSave: f,
        onCancel: a
      }, null, 8, ["initial-value", "input-label", "max-length"])) : (n(), s(M, { key: 1 }, [
        e.readonly ? (n(), s("span", {
          key: 0,
          class: "group-title",
          title: e.path
        }, i(e.name), 9, Sa)) : (n(), s("button", {
          key: 1,
          ref_key: "renameButton",
          ref: d,
          type: "button",
          class: "group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo",
          "aria-label": `Rename group ${e.path}`,
          "data-group-rename": e.path,
          title: e.path,
          onClick: c
        }, [
          t("span", null, i(e.name), 1),
          p(m(R), {
            icon: "tabler:pencil",
            "aria-hidden": "true"
          })
        ], 8, Ca)),
        t("span", {
          class: "count group-count",
          "aria-label": `${e.count} fields`
        }, i(e.count), 9, Ea),
        e.readonly ? y("", !0) : (n(), s("div", qa, [
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Add field to ${e.path}`,
            disabled: !e.canAdd,
            title: "Add field",
            onClick: S[0] || (S[0] = (N) => v("add"))
          }, [
            p(m(R), { icon: "tabler:plus" })
          ], 8, Na),
          t("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline",
            "aria-label": `Actions for group ${e.path}`,
            "aria-haspopup": "menu",
            "aria-expanded": b.value,
            "aria-controls": m(w),
            onClick: S[1] || (S[1] = (N) => x.value.toggle(N))
          }, [
            p(m(R), { icon: "tabler:dots" })
          ], 8, Ua),
          p(m(Ct), {
            id: m(w),
            ref_key: "menu",
            ref: x,
            model: E.value,
            popup: "",
            "append-to": "self",
            onShow: S[2] || (S[2] = (N) => b.value = !0),
            onHide: S[3] || (S[3] = (N) => b.value = !1)
          }, null, 8, ["id", "model"])
        ]))
      ], 64))
    ], 512));
  }
}), Aa = ["aria-label", "aria-expanded"], Ra = {
  key: 1,
  class: "tree-indent"
}, Ba = ["aria-label", "aria-describedby", "aria-current"], La = { class: "row-copy" }, Ta = { class: "row-name" }, Da = ["title"], Pa = ["id", "title"], Fa = { class: "field-badges" }, Ia = { class: "chip field-type" }, Oa = { class: "field-flags" }, ja = {
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
}, Xa = { key: 0 }, Za = { key: 1 }, _a = ["aria-label", "disabled"], en = /* @__PURE__ */ W({
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
    const l = e, v = o, u = pe(), b = pe(), k = A(), d = A(!1), x = U(() => [
      { label: "Move up", disabled: l.first, command: () => v("reorder", l.field, l.trail, -1) },
      { label: "Move down", disabled: l.last, command: () => v("reorder", l.field, l.trail, 1) }
    ]), w = A(!0);
    be(() => l.selected, (S) => {
      const N = ie(l.field, l.trail);
      S !== N && S.startsWith(N + (l.trail.length ? "/" : "")) && (w.value = !0);
    });
    const E = U(() => l.trail.at(-1) !== "item"), c = U(() => E.value ? l.shape.name || "New field" : "Each item"), a = U(() => l.trail.length ? void 0 : l.shape), f = U(() => l.shape.type === "object" || l.shape.type === "list");
    function B(S) {
      S.key === "ArrowRight" && f.value && (w.value = !0, S.preventDefault(), S.stopPropagation()), S.key === "ArrowLeft" && f.value && (w.value = !1, S.preventDefault(), S.stopPropagation());
    }
    return (S, N) => {
      const H = lt("ShapeTree", !0);
      return n(), s("div", {
        class: "shape-tree-node",
        onKeydown: B
      }, [
        t("div", {
          class: Q(["row-item", { active: e.selected === m(ie)(e.field, e.trail) }])
        }, [
          f.value ? (n(), s("button", {
            key: 0,
            class: "tree-toggle kx-iconbtn kx-focus-outline",
            type: "button",
            "aria-label": `${w.value ? "Collapse" : "Expand"} ${e.path}`,
            "aria-expanded": w.value,
            onClick: N[0] || (N[0] = (I) => w.value = !w.value)
          }, [
            p(m(R), {
              icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
            }, null, 8, ["icon"])
          ], 8, Aa)) : (n(), s("span", Ra)),
          t("button", {
            type: "button",
            class: "row-main kx-focus-halo",
            "aria-label": `Edit ${e.path}`,
            "aria-describedby": m(u),
            "aria-current": e.selected === m(ie)(e.field, e.trail) ? "true" : void 0,
            onClick: N[1] || (N[1] = (I) => v("select", e.field, e.trail))
          }, [
            t("span", La, [
              t("span", Ta, [
                p(m(R), {
                  icon: m(Rl)(e.shape.type),
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", {
                  class: "row-label",
                  title: c.value
                }, i(c.value), 9, Da),
                e.error ? (n(), J(m(R), {
                  key: 0,
                  icon: "tabler:alert-circle",
                  class: "row-warn",
                  "aria-label": e.error,
                  title: e.error
                }, null, 8, ["aria-label", "title"])) : y("", !0)
              ]),
              t("span", {
                id: m(u),
                class: Q(["row-desc", { missing: !e.shape.description }]),
                title: e.shape.description || void 0
              }, i(e.shape.description || "No description"), 11, Pa)
            ]),
            t("span", Fa, [
              t("span", Ia, i(e.shape.type), 1),
              t("span", Oa, [
                E.value && e.shape.required ? (n(), s("span", ja, [
                  p(m(R), {
                    icon: "tabler:asterisk",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                a.value?.strategy === "deep" ? (n(), s("span", za, [
                  p(m(R), {
                    icon: "tabler:microscope",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                a.value?.search_within === "sections" ? (n(), s("span", Wa, [
                  p(m(R), {
                    icon: "tabler:layout-list",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0),
                a.value?.evidence_required ? (n(), s("span", Ga, [
                  p(m(R), {
                    icon: "tabler:file-search",
                    "aria-hidden": "true"
                  })
                ])) : y("", !0)
              ])
            ])
          ], 8, Ba),
          !e.readonly && E.value ? (n(), s("span", Ka, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} up`,
              disabled: e.first,
              onClick: N[2] || (N[2] = (I) => v("reorder", e.field, e.trail, -1))
            }, [
              p(m(R), { icon: "tabler:chevron-up" })
            ], 8, Ha),
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Move ${e.path} down`,
              disabled: e.last,
              onClick: N[3] || (N[3] = (I) => v("reorder", e.field, e.trail, 1))
            }, [
              p(m(R), { icon: "tabler:chevron-down" })
            ], 8, Qa)
          ])) : y("", !0),
          !e.readonly && E.value ? (n(), s("div", {
            key: 3,
            class: "row-overflow",
            onKeydown: N[7] || (N[7] = ve(() => {
            }, ["stop"]))
          }, [
            t("button", {
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": `Actions for ${e.path}`,
              "aria-haspopup": "menu",
              "aria-expanded": d.value,
              "aria-controls": m(b),
              onClick: N[4] || (N[4] = (I) => k.value.toggle(I))
            }, [
              p(m(R), { icon: "tabler:dots" })
            ], 8, Ja),
            p(m(Ct), {
              id: m(b),
              ref_key: "menu",
              ref: k,
              model: x.value,
              popup: "",
              "append-to": "self",
              onShow: N[5] || (N[5] = (I) => d.value = !0),
              onHide: N[6] || (N[6] = (I) => d.value = !1)
            }, null, 8, ["id", "model"])
          ], 32)) : y("", !0)
        ], 2),
        f.value && w.value ? (n(), s("ul", Ya, [
          (n(!0), s(M, null, O(e.shape.properties, (I, j) => (n(), s("li", { key: j }, [
            p(H, {
              shape: I,
              field: e.field,
              trail: [...e.trail, j],
              path: `${e.path}.${I.name || "New property"}`,
              selected: e.selected,
              readonly: e.readonly,
              first: j === 0,
              last: j === e.shape.properties.length - 1,
              onSelect: N[8] || (N[8] = (G, P) => v("select", G, P)),
              onAdd: N[9] || (N[9] = (G, P) => v("add", G, P)),
              onReorder: N[10] || (N[10] = (G, P, D) => v("reorder", G, P, D))
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
              onSelect: N[11] || (N[11] = (I, j) => v("select", I, j)),
              onAdd: N[12] || (N[12] = (I, j) => v("add", I, j)),
              onReorder: N[13] || (N[13] = (I, j, G) => v("reorder", I, j, G))
            }, null, 8, ["shape", "field", "trail", "path", "selected", "readonly"])
          ])) : y("", !0),
          !e.readonly && e.shape.type === "object" && e.trail.length + 1 < m(Ae) ? (n(), s("li", Za, [
            t("button", {
              type: "button",
              class: "kx-btn kx-btn-ghost kx-focus-halo sm",
              "aria-label": `Add property to ${e.path}`,
              disabled: (e.shape.properties?.length ?? 0) >= 100,
              onClick: N[14] || (N[14] = (I) => v("add", e.field, e.trail))
            }, [
              p(m(R), { icon: "tabler:plus" }),
              N[15] || (N[15] = q("Add property", -1))
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
  class: "muted picker-pending picker-pending--list"
}, on = /* @__PURE__ */ W({
  __name: "AgentPicker",
  props: {
    value: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = A(!!customElements.get("wc-agent-picker")), u = A("");
    Ne(async () => {
      if (!v.value)
        try {
          await Je("wc-agent-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          u.value = k instanceof Error ? k.message : String(k);
        }
    });
    function b(k) {
      if (k.composedPath()[0] !== k.currentTarget) return;
      const d = k.detail;
      l("select", d.agent_id);
    }
    return (k, d) => (n(), s("div", tn, [
      d[0] || (d[0] = t("span", null, "Scout agent", -1)),
      e.readonly ? (n(), s("p", ln, i(e.value || "Built-in scout"), 1)) : v.value ? (n(), s("wc-agent-picker", {
        key: 1,
        config: JSON.stringify({ agent_id: e.value || "" }),
        "aria-label": "Scout agent",
        placeholder: "Choose your agent…",
        onChange: b
      }, null, 40, an)) : u.value ? (n(), s("p", nn, "Could not load agent picker: " + i(u.value), 1)) : (n(), s("span", sn, "Loading agents…")),
      d[1] || (d[1] = t("small", null, "Leave empty to use the built-in scout.", -1))
    ]));
  }
}), dn = ["value", "capability", "aria-labelledby"], un = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, rn = {
  key: 2,
  class: "dz-muted picker-pending",
  role: "status"
}, ce = /* @__PURE__ */ W({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = A(!!customElements.get("wc-model-picker")), u = A("");
    Ne(async () => {
      if (!v.value)
        try {
          await Je("wc-model-picker", { timeoutMs: 8e3 }), v.value = !0;
        } catch (k) {
          u.value = k instanceof Error ? k.message : String(k);
        }
    });
    function b(k) {
      const d = k.detail;
      typeof d == "string" && l("select", d);
    }
    return (k, d) => v.value ? (n(), s("wc-model-picker", {
      key: 0,
      value: e.value,
      capability: e.capability,
      "aria-labelledby": e.labelledBy,
      onSelect: b
    }, null, 40, dn)) : u.value ? (n(), s("p", un, "Could not load model picker: " + i(u.value), 1)) : (n(), s("span", rn, "Loading models…"));
  }
}), cn = { class: "slider" }, vn = { class: "slider-head" }, mn = { class: "slider-value" }, pn = ["aria-label", "aria-valuetext", "disabled"], bn = {
  key: 0,
  class: "slider-hints"
}, fn = { key: 1 }, Ve = 1e3, le = /* @__PURE__ */ W({
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
    const o = e, l = Le(e, "modelValue"), v = U(() => o.percent ? `${Math.round(l.value * 100)}%` : `${l.value.toLocaleString()}${o.unit ? ` ${o.unit}` : ""}`), u = (d) => o.log ? Math.log(d / o.min) / Math.log(o.max / o.min) * Ve : (d - o.min) / (o.max - o.min) * Ve;
    function b(d) {
      const x = o.log ? o.min * Math.pow(o.max / o.min, d / Ve) : o.min + (o.max - o.min) * d / Ve, w = Math.round(x / o.step) * o.step;
      return Math.min(o.max, Math.max(o.min, Number(w.toFixed(4))));
    }
    const k = U({ get: () => Math.round(u(l.value)), set: (d) => {
      l.value = b(d);
    } });
    return (d, x) => (n(), s("div", cn, [
      t("div", vn, [
        t("span", null, i(e.label), 1),
        t("output", mn, i(v.value), 1)
      ]),
      z(t("input", {
        "onUpdate:modelValue": x[0] || (x[0] = (w) => k.value = w),
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
          _,
          k.value,
          void 0,
          { number: !0 }
        ]
      ]),
      e.hints ? (n(), s("div", bn, [
        t("span", null, i(e.hints[0]), 1),
        t("span", null, i(e.hints[1]), 1)
      ])) : y("", !0),
      e.note ? (n(), s("small", fn, i(e.note), 1)) : y("", !0)
    ]));
  }
}), gn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, hn = { class: "fd-track" }, yn = { class: "fd-node" }, kn = { class: "fd-dots" }, $n = { class: "fd-more" }, xn = { class: "fd-node goal" }, wn = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(e) {
    const o = e;
    return (l, v) => (n(), s("figure", gn, [
      t("div", hn, [
        v[2] || (v[2] = t("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), s(M, null, O(Math.min(o.rounds, 8), (u) => (n(), s(M, { key: u }, [
          v[0] || (v[0] = t("span", { class: "fd-link" }, null, -1)),
          t("span", yn, [
            t("span", null, "R" + i(u), 1),
            t("span", kn, [
              (n(!0), s(M, null, O(Math.min(o.extra, 6), (b) => (n(), s("i", { key: b }))), 128))
            ])
          ])
        ], 64))), 128)),
        o.rounds > 8 ? (n(), s(M, { key: 0 }, [
          v[1] || (v[1] = t("span", { class: "fd-link" }, null, -1)),
          t("span", $n, "+" + i(o.rounds - 8), 1)
        ], 64)) : y("", !0),
        v[3] || (v[3] = t("span", { class: "fd-link" }, null, -1)),
        t("span", xn, "≥ " + i(Math.round(o.confidence * 100)) + "%", 1)
      ]),
      t("figcaption", null, i(o.rounds ? `One pass, then up to ${o.rounds} rounds with up to ${o.extra} new queries each, stopping as soon as confidence reaches ${Math.round(o.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Vn = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Sn = { class: "fd-grid" }, Cn = { class: "fd-node solid" }, En = { class: "fd-node" }, qn = { class: "fd-node" }, Nn = { class: "fd-node goal" }, Un = /* @__PURE__ */ W({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(e) {
    const o = e, l = U(() => Math.min(o.queries * o.perQuery, o.cap));
    return (v, u) => (n(), s("figure", Vn, [
      t("div", Sn, [
        t("span", Cn, [
          t("b", null, i(e.fields), 1),
          q(" field" + i(e.fields === 1 ? "" : "s"), 1),
          t("small", null, i(e.parallel) + " at a time", 1)
        ]),
        t("span", En, [
          t("b", null, i(e.queries), 1),
          u[0] || (u[0] = q(" queries", -1)),
          u[1] || (u[1] = t("small", null, "per field", -1))
        ]),
        t("span", qn, [
          t("b", null, i(e.perQuery), 1),
          u[2] || (u[2] = q(" chunks", -1)),
          u[3] || (u[3] = t("small", null, "per query", -1))
        ]),
        t("span", Nn, [
          t("b", null, i(l.value), 1),
          u[4] || (u[4] = q(" chunks", -1)),
          t("small", null, i(e.queries * e.perQuery > e.cap ? `capped at ${e.cap}` : "read per field"), 1)
        ])
      ]),
      t("figcaption", null, "Each deep field gets its own queries; up to " + i(l.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Mn = ["disabled"], An = { class: "muted" }, Rn = { class: "toggle-row" }, Bn = { class: "label-block" }, Ln = { class: "toggle-row" }, Tn = {
  id: "model-map",
  class: "model-role"
}, Dn = {
  key: 0,
  class: "chips"
}, Pn = {
  key: 1,
  class: "muted"
}, Fn = { class: "toggle-row" }, In = { class: "grid" }, On = ["onUpdate:modelValue"], jn = ["onUpdate:modelValue"], zn = ["onUpdate:modelValue"], Wn = ["onClick"], Gn = {
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
}, os = { class: "toggle-row" }, is = { class: "toggle-row" }, ds = { class: "toggle-row" }, us = { class: "toggle-row" }, rs = {
  id: "model-verify",
  class: "model-role"
}, cs = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = U(() => o.config.stages), v = (c) => bl(o.stage, c), u = vl(), b = U(() => o.config.fields.filter((c) => c.strategy === "deep").length), k = U(() => o.config.fields.filter((c) => c.search_within === "sections").map((c) => c.name || "New field")), d = U(() => $t(o.config));
    function x(c) {
      l.value.verify.check_support = c, c || (l.value.verify.check_completeness = !1);
    }
    function w(c) {
      c ? l.value.scout.agent_id = c : delete l.value.scout.agent_id;
    }
    function E(c, a) {
      const f = l.value.scout.tools.filter((B) => B !== c);
      l.value.scout.tools = a ? [...f, c] : f;
    }
    return (c, a) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", An, i(m(ml)[e.stage]), 1),
      e.stage === "map" ? (n(), s(M, { key: 0 }, [
        t("div", Rn, [
          a[33] || (a[33] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.map.enabled,
            "onUpdate:modelValue": a[0] || (a[0] = (f) => l.value.map.enabled = f),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Bn, [
          a[34] || (a[34] = t("span", { id: "outline-label" }, "Outline", -1)),
          p($e, {
            modelValue: l.value.map.outline,
            "onUpdate:modelValue": a[1] || (a[1] = (f) => l.value.map.outline = f),
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
          p(Z, {
            modelValue: l.value.map.section_summaries,
            "onUpdate:modelValue": a[2] || (a[2] = (f) => l.value.map.section_summaries = f),
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
            onSelect: a[3] || (a[3] = (f) => l.value.map.model = f)
          }, null, 8, ["value"])
        ]),
        a[39] || (a[39] = t("h4", null, "Fields that read sections", -1)),
        k.value.length ? (n(), s("p", Dn, [
          (n(!0), s(M, null, O(k.value, (f) => (n(), s("span", {
            key: f,
            class: "chip primary"
          }, i(f), 1))), 128))
        ])) : (n(), s("p", Pn, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : y("", !0),
      e.stage === "prefetch" ? (n(), s(M, { key: 1 }, [
        t("div", Fn, [
          a[40] || (a[40] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.prefetch.enabled,
            "onUpdate:modelValue": a[4] || (a[4] = (f) => l.value.prefetch.enabled = f),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        a[44] || (a[44] = t("h4", null, "Queries", -1)),
        (n(!0), s(M, null, O(l.value.prefetch.queries, (f, B) => (n(), s("div", {
          key: B,
          class: "query-row"
        }, [
          t("div", In, [
            t("label", null, [
              a[41] || (a[41] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => f.name = S,
                placeholder: "Parties"
              }, null, 8, On), [
                [_, f.name]
              ])
            ]),
            t("label", null, [
              a[42] || (a[42] = q("Chunks", -1)),
              z(t("input", {
                "onUpdate:modelValue": (S) => f.chunks = S,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, jn), [
                [
                  _,
                  f.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          t("label", null, [
            a[43] || (a[43] = q("Query", -1)),
            z(t("textarea", {
              "onUpdate:modelValue": (S) => f.query = S,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, zn), [
              [_, f.query]
            ])
          ]),
          e.readonly ? y("", !0) : (n(), s("button", {
            key: 0,
            type: "button",
            class: "kx-btn kx-btn-ghost kx-focus-halo sm",
            onClick: (S) => l.value.prefetch.queries.splice(B, 1)
          }, "Remove query", 8, Wn))
        ]))), 128)),
        l.value.prefetch.queries.length ? y("", !0) : (n(), s("p", Gn, "No fixed queries. Field search hints still run.")),
        e.readonly ? y("", !0) : (n(), s("button", {
          key: 1,
          type: "button",
          class: "kx-btn kx-btn-ghost kx-focus-halo",
          onClick: a[5] || (a[5] = (f) => l.value.prefetch.queries.push(m(pl)()))
        }, "Add query"))
      ], 64)) : y("", !0),
      e.stage === "scout" ? (n(), s(M, { key: 2 }, [
        t("div", Kn, [
          a[45] || (a[45] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.scout.enabled,
            "onUpdate:modelValue": a[6] || (a[6] = (f) => l.value.scout.enabled = f),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", Hn, [
          a[46] || (a[46] = t("span", { id: "mode-label" }, "Mode", -1)),
          p($e, {
            modelValue: l.value.scout.mode,
            "onUpdate:modelValue": a[7] || (a[7] = (f) => l.value.scout.mode = f),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          t("small", null, i(l.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        l.value.scout.mode === "agent" ? (n(), J(on, {
          key: 0,
          value: l.value.scout.agent_id,
          readonly: e.readonly,
          onSelect: w
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
            onSelect: a[8] || (a[8] = (f) => l.value.scout.model = f)
          }, null, 8, ["value"])
        ]),
        a[52] || (a[52] = t("h4", null, "Loop", -1)),
        p(le, {
          modelValue: l.value.scout.max_rounds,
          "onUpdate:modelValue": a[9] || (a[9] = (f) => l.value.scout.max_rounds = f),
          label: l.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: v("max_rounds").min,
          max: v("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        l.value.scout.mode === "loop" ? (n(), J(le, {
          key: 2,
          modelValue: l.value.scout.target_confidence,
          "onUpdate:modelValue": a[10] || (a[10] = (f) => l.value.scout.target_confidence = f),
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
          "onUpdate:modelValue": a[11] || (a[11] = (f) => l.value.scout.max_extra_queries = f),
          label: l.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: v("max_extra_queries").min,
          max: v("max_extra_queries").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.scout.max_tokens,
          "onUpdate:modelValue": a[12] || (a[12] = (f) => l.value.scout.max_tokens = f),
          label: "Scout output limit",
          min: v("max_tokens").min,
          max: v("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l.value.scout.mode === "agent" ? (n(), s("p", Jn, "Tool budget: " + i(l.value.scout.max_rounds * l.value.scout.max_extra_queries) + " calls.", 1)) : y("", !0),
        l.value.scout.mode === "loop" ? (n(), s("div", Yn, [
          a[48] || (a[48] = t("span", null, [
            q("Drop noisy chunks"),
            t("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          p(Z, {
            modelValue: l.value.scout.drop_noise,
            "onUpdate:modelValue": a[13] || (a[13] = (f) => l.value.scout.drop_noise = f),
            label: "Drop noisy chunks",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : y("", !0),
        t("div", Xn, [
          a[49] || (a[49] = t("span", null, [
            q("Share scout notes with extraction"),
            t("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          p(Z, {
            modelValue: l.value.scout.share_notes,
            "onUpdate:modelValue": a[14] || (a[14] = (f) => l.value.scout.share_notes = f),
            label: "Share scout notes with extraction",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l.value.scout.mode === "agent" ? (n(), s(M, { key: 5 }, [
          a[50] || (a[50] = t("h4", null, "Agent tools", -1)),
          (n(!0), s(M, null, O(m(u), (f) => (n(), s("div", {
            key: f,
            class: "toggle-row"
          }, [
            t("span", null, i(m(_e)(f)), 1),
            p(Z, {
              "model-value": l.value.scout.tools.includes(f),
              label: m(_e)(f),
              disabled: e.readonly,
              "onUpdate:modelValue": (B) => E(f, B)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : y("", !0)
      ], 64)) : y("", !0),
      e.stage === "deep" ? (n(), s(M, { key: 3 }, [
        t("div", Zn, [
          a[53] || (a[53] = t("span", null, "Stage enabled", -1)),
          p(Z, {
            modelValue: l.value.deep.enabled,
            "onUpdate:modelValue": a[15] || (a[15] = (f) => l.value.deep.enabled = f),
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
            "onUpdate:modelValue": a[16] || (a[16] = (f) => l.value.deep.read = f),
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
            onSelect: a[17] || (a[17] = (f) => l.value.deep.model = f)
          }, null, 8, ["value"])
        ]),
        t("div", ts, [
          a[57] || (a[57] = t("span", null, "Query writer", -1)),
          p(ce, {
            value: l.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: a[18] || (a[18] = (f) => l.value.deep.query_model = f)
          }, null, 8, ["value"])
        ]),
        a[59] || (a[59] = t("h4", null, "Reach", -1)),
        p(le, {
          modelValue: l.value.deep.parallel_fields,
          "onUpdate:modelValue": a[19] || (a[19] = (f) => l.value.deep.parallel_fields = f),
          label: "Fields at a time",
          min: v("parallel_fields").min,
          max: v("parallel_fields").max,
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.max_queries,
          "onUpdate:modelValue": a[20] || (a[20] = (f) => l.value.deep.max_queries = f),
          label: "Queries per field",
          min: v("max_queries").min,
          max: v("max_queries").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.chunks_per_query,
          "onUpdate:modelValue": a[21] || (a[21] = (f) => l.value.deep.chunks_per_query = f),
          label: "Chunks per query",
          min: v("chunks_per_query").min,
          max: v("chunks_per_query").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.chunk_cap,
          "onUpdate:modelValue": a[22] || (a[22] = (f) => l.value.deep.chunk_cap = f),
          label: "Chunk cap per field",
          min: v("chunk_cap").min,
          max: v("chunk_cap").max,
          log: "",
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.min_similarity,
          "onUpdate:modelValue": a[23] || (a[23] = (f) => l.value.deep.min_similarity = f),
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
          "onUpdate:modelValue": a[24] || (a[24] = (f) => l.value.deep.query_temperature = f),
          label: "Query writing",
          min: v("query_temperature").min,
          max: v("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: e.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(le, {
          modelValue: l.value.deep.analysis_temperature,
          "onUpdate:modelValue": a[25] || (a[25] = (f) => l.value.deep.analysis_temperature = f),
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
            onSelect: a[26] || (a[26] = (f) => l.value.extract.model = f)
          }, null, 8, ["value"])
        ]),
        a[63] || (a[63] = t("h4", null, "Field groups", -1)),
        t("ul", as, [
          (n(!0), s(M, null, O(d.value, (f) => (n(), s("li", {
            key: f.name
          }, [
            t("span", null, i(f.name), 1),
            t("span", ns, i(f.fields.length) + " field" + i(f.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        d.value.length ? y("", !0) : (n(), s("p", ss, "No fields yet.")),
        p(le, {
          modelValue: l.value.extract.max_fields_per_call,
          "onUpdate:modelValue": a[27] || (a[27] = (f) => l.value.extract.max_fields_per_call = f),
          label: "Fields per call",
          min: v("max_fields_per_call").min,
          max: v("max_fields_per_call").max,
          disabled: e.readonly,
          note: `${m(ft)(e.config)} extraction call${m(ft)(e.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        p(le, {
          modelValue: l.value.extract.max_output_tokens,
          "onUpdate:modelValue": a[28] || (a[28] = (f) => l.value.extract.max_output_tokens = f),
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
          p(Z, {
            modelValue: l.value.verify.enabled,
            "onUpdate:modelValue": a[29] || (a[29] = (f) => l.value.verify.enabled = f),
            label: "Enable step",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", is, [
          a[65] || (a[65] = t("span", null, [
            q("Quotes exist"),
            t("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          p(Z, {
            modelValue: l.value.verify.check_quotes,
            "onUpdate:modelValue": a[30] || (a[30] = (f) => l.value.verify.check_quotes = f),
            label: "Quotes exist",
            disabled: e.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t("div", ds, [
          a[66] || (a[66] = t("span", null, [
            q("Quotes support values"),
            t("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          p(Z, {
            "model-value": l.value.verify.check_support,
            "onUpdate:modelValue": x,
            label: "Quotes support values",
            disabled: e.readonly
          }, null, 8, ["model-value", "disabled"])
        ]),
        l.value.verify.check_support ? (n(), s(M, { key: 0 }, [
          t("div", us, [
            a[67] || (a[67] = t("span", null, [
              q("Check completeness"),
              t("small", null, "Check the requested text and lists against additional source passages. Adds input tokens; completeness can remain unknown.")
            ], -1)),
            p(Z, {
              "model-value": l.value.verify.check_completeness === !0,
              "onUpdate:modelValue": a[31] || (a[31] = (f) => l.value.verify.check_completeness = f),
              label: "Check completeness",
              disabled: e.readonly
            }, null, 8, ["model-value", "disabled"])
          ]),
          a[69] || (a[69] = t("h4", null, "Models", -1)),
          t("div", rs, [
            a[68] || (a[68] = t("span", null, "Checker", -1)),
            p(ce, {
              value: l.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: a[32] || (a[32] = (f) => l.value.verify.model = f)
            }, null, 8, ["value"])
          ])
        ], 64)) : y("", !0)
      ], 64)) : y("", !0)
    ], 8, Mn));
  }
}), vs = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, ms = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, ps = ["x", "y", "width"], bs = ["x", "width"], fs = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(e) {
    const o = e, l = U(() => Math.min(0.9, Math.max(0, o.overlap / o.size))), v = U(() => {
      const u = 100 / (3 - 2 * l.value);
      return [0, 1, 2].map((b) => ({ x: b * u * (1 - l.value), w: u }));
    });
    return (u, b) => (n(), s("figure", vs, [
      (n(), s("svg", ms, [
        (n(!0), s(M, null, O(v.value, (k, d) => (n(), s("rect", {
          key: d,
          x: k.x,
          y: d % 2 ? 14 : 4,
          width: k.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, ps))), 128)),
        (n(), s(M, null, O([1, 2], (k) => t("rect", {
          key: "o" + k,
          x: v.value[k].x,
          y: 4,
          width: v.value[k - 1].x + v.value[k - 1].w - v.value[k].x,
          height: "24",
          class: "shared"
        }, null, 8, bs)), 64))
      ])),
      t("figcaption", null, i(e.size.toLocaleString()) + " tokens per chunk · " + i(e.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(l.value * 100)) + "%)", 1)
    ]));
  }
}), gs = ["disabled"], hs = { class: "muted" }, ys = { class: "toggle-row" }, ks = { class: "toggle-row" }, $s = { class: "label-block" }, xs = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, ws = { class: "label-block" }, Vs = {
  id: "embedding-model",
  class: "model-role"
}, Ss = { class: "toggle-row" }, Cs = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, Es = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(e) {
    const o = e, l = U(() => o.config.retrieval), v = U({ get: () => o.config.retention ?? "", set: (E) => {
      E.trim() ? o.config.retention = E.trim() : delete o.config.retention;
    } }), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], b = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], k = Xe("chunk_size"), d = Xe("overlap"), x = Xe("section_budget"), w = U(() => Math.min(d.max, l.value.chunk_size - 50));
    return (E, c) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: e.readonly
    }, [
      t("p", hs, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(e.retention) + ".", 1),
      t("label", null, [
        c[12] || (c[12] = q("Retention window", -1)),
        z(t("input", {
          "onUpdate:modelValue": c[0] || (c[0] = (a) => v.value = a),
          "aria-label": "Retention window",
          placeholder: "Global setting"
        }, null, 512), [
          [_, v.value]
        ]),
        c[13] || (c[13] = t("small", null, "Duration for new processed documents and runs, for example 24h. Leave empty to use the global Docscout setting. Existing records keep their expiry.", -1))
      ]),
      c[22] || (c[22] = t("h4", null, "Chunks", -1)),
      p(fs, {
        size: l.value.chunk_size,
        overlap: l.value.overlap
      }, null, 8, ["size", "overlap"]),
      p(le, {
        modelValue: l.value.chunk_size,
        "onUpdate:modelValue": c[1] || (c[1] = (a) => l.value.chunk_size = a),
        label: "Chunk size",
        min: m(k).min,
        max: m(k).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      p(le, {
        modelValue: l.value.overlap,
        "onUpdate:modelValue": c[2] || (c[2] = (a) => l.value.overlap = a),
        label: "Overlap",
        min: m(d).min,
        max: w.value,
        step: 10,
        unit: "tokens",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t("div", ys, [
        c[14] || (c[14] = t("span", null, [
          q("Split by headings"),
          t("small", null, "A chunk never crosses a heading.")
        ], -1)),
        p(Z, {
          modelValue: l.value.split_headings,
          "onUpdate:modelValue": c[3] || (c[3] = (a) => l.value.split_headings = a),
          label: "Split by headings",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t("div", ks, [
        c[15] || (c[15] = t("span", null, [
          q("Keep tables whole"),
          t("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        p(Z, {
          modelValue: l.value.keep_tables,
          "onUpdate:modelValue": c[4] || (c[4] = (a) => l.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      p(le, {
        modelValue: l.value.section_budget,
        "onUpdate:modelValue": c[5] || (c[5] = (a) => l.value.section_budget = a),
        label: "Section budget",
        min: m(x).min,
        max: m(x).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: e.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      c[23] || (c[23] = t("h4", null, "Context", -1)),
      t("div", $s, [
        c[16] || (c[16] = t("span", { id: "context-label" }, "Chunk context", -1)),
        p($e, {
          modelValue: l.value.context,
          "onUpdate:modelValue": c[6] || (c[6] = (a) => l.value.context = a),
          "labelled-by": "context-label",
          options: b
        }, null, 8, ["modelValue"]),
        t("small", null, i(b.find((a) => a.value === l.value.context)?.note), 1)
      ]),
      l.value.context === "generated" ? (n(), s("div", xs, [
        c[17] || (c[17] = t("span", null, "Context writer", -1)),
        p(ce, {
          value: l.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: c[7] || (c[7] = (a) => l.value.context_model = a)
        }, null, 8, ["value"])
      ])) : y("", !0),
      c[24] || (c[24] = t("h4", null, "Search", -1)),
      t("div", ws, [
        c[18] || (c[18] = t("span", { id: "mode-label" }, "Search mode", -1)),
        p($e, {
          modelValue: l.value.search_mode,
          "onUpdate:modelValue": c[8] || (c[8] = (a) => l.value.search_mode = a),
          "labelled-by": "mode-label",
          options: u
        }, null, 8, ["modelValue"]),
        t("small", null, i(u.find((a) => a.value === l.value.search_mode)?.note), 1)
      ]),
      c[25] || (c[25] = t("h4", null, "Models", -1)),
      t("div", Vs, [
        c[19] || (c[19] = t("span", null, "Embedding", -1)),
        p(ce, {
          value: l.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: c[9] || (c[9] = (a) => l.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      t("div", Ss, [
        c[20] || (c[20] = t("span", null, [
          q("Highlighter"),
          t("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        p(Z, {
          modelValue: l.value.highlighter,
          "onUpdate:modelValue": c[10] || (c[10] = (a) => l.value.highlighter = a),
          label: "Highlighter",
          disabled: e.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.value.highlighter ? (n(), s("div", Cs, [
        c[21] || (c[21] = t("span", null, "Highlighter", -1)),
        p(ce, {
          value: l.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: c[11] || (c[11] = (a) => l.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : y("", !0)
    ], 8, gs));
  }
}), qs = ["inert"], Ns = { class: "canvas-inner" }, Us = {
  class: "block fields-block",
  "aria-labelledby": "fields-head"
}, Ms = { class: "block-head" }, As = ["aria-expanded"], Rs = { class: "count" }, Bs = {
  key: 0,
  class: "block-peek"
}, Ls = {
  key: 1,
  class: "field-add-actions push"
}, Ts = ["aria-expanded", "aria-controls", "disabled"], Ds = ["disabled"], Ps = {
  id: "fields-body",
  class: "block-body"
}, Fs = {
  key: 0,
  class: "block-empty"
}, Is = { class: "field-tree" }, Os = ["id"], js = {
  class: "tree-indent",
  "aria-hidden": "true"
}, zs = {
  class: "shape-preview",
  open: ""
}, Ws = { class: "kx-focus-outline" }, Gs = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Ks = {
  key: 1,
  class: "preview-grid"
}, Hs = { "aria-label": "Output shape" }, Qs = { "aria-label": "Example output" }, Js = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ys = { class: "block-head" }, Xs = ["aria-expanded"], Zs = { class: "count" }, _s = {
  key: 0,
  class: "block-peek"
}, eo = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, to = { class: "node-icon" }, lo = { class: "node-main" }, ao = { class: "node-summary" }, no = { class: "node-side" }, so = { class: "chip model" }, oo = { class: "branches" }, io = { class: "branch" }, uo = { class: "branch" }, ro = { class: "node-icon" }, co = { class: "node-main" }, vo = { class: "node-summary" }, mo = ["aria-labelledby", "role", "aria-modal"], po = ["aria-valuenow"], bo = { class: "side-panel-head" }, fo = { class: "side-panel-icon" }, go = ["id"], ho = ["aria-label", "title"], yo = { class: "node-breadcrumb mono" }, ko = {
  key: 0,
  class: "move-node",
  "aria-label": "Move node"
}, $o = {
  key: 0,
  value: ""
}, xo = {
  key: 1,
  value: "",
  disabled: ""
}, wo = ["value"], Vo = ["disabled"], So = ["disabled"], Co = {
  key: 4,
  class: "inspector-form"
}, Eo = { class: "output-list" }, qo = { class: "mono" }, No = { class: "chip" }, Uo = { class: "rail-label" }, Ze = 400, Oe = 320, Mo = /* @__PURE__ */ W({
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
    const o = e, l = Le(e, "title"), v = Le(e, "description"), u = A({ kind: "document" });
    function b(h, r) {
      try {
        const C = localStorage.getItem(`docscout.${h}`);
        return C === null ? r : C === "1";
      } catch {
        return r;
      }
    }
    function k(h, r) {
      try {
        localStorage.setItem(`docscout.${h}`, r ? "1" : "0");
      } catch {
      }
    }
    const d = A(b("panel", !0)), x = A(b("fields", !0)), w = A(b("flow", !0));
    function E() {
      try {
        const h = Number(localStorage.getItem("docscout.panelWidth"));
        return h >= Oe ? h : Ze;
      } catch {
        return Ze;
      }
    }
    const c = A(E()), a = () => {
      const h = D.value?.clientWidth;
      return h ? Math.max(Oe, h - 420) : Number.POSITIVE_INFINITY;
    };
    function f(h, r = !0) {
      if (c.value = Math.round(Math.min(a(), Math.max(Oe, h))), r)
        try {
          localStorage.setItem("docscout.panelWidth", String(c.value));
        } catch {
        }
    }
    const B = A(!1);
    function S(h) {
      const r = h.currentTarget, C = h.clientX, Y = c.value;
      r.setPointerCapture(h.pointerId), B.value = !0;
      const X = (ee) => f(Y + (C - ee.clientX), !1), ae = () => {
        B.value = !1, f(c.value), r.removeEventListener("pointermove", X), r.removeEventListener("pointerup", ae);
      };
      r.addEventListener("pointermove", X), r.addEventListener("pointerup", ae);
    }
    function N(h) {
      h.key === "ArrowLeft" ? (f(c.value + 24), h.preventDefault()) : h.key === "ArrowRight" && (f(c.value - 24), h.preventDefault());
    }
    let H = null;
    const I = A(), j = pe();
    async function G(h) {
      if (d.value = h, !L.value) {
        k("panel", h);
        return;
      }
      if (!h && H) {
        const r = H;
        H = null, await Ce(), r.focus();
      }
    }
    function P(h) {
      const r = h === "fields" ? x : w;
      r.value = !r.value, k(h, r.value);
    }
    const D = A(), L = A(!1);
    let de;
    Ne(() => {
      de = new ResizeObserver(([h]) => {
        const r = L.value;
        L.value = h.contentRect.width < 1e3, L.value && !r && (d.value = !1), !L.value && r && (d.value = b("panel", !0));
      }), D.value && de.observe(D.value);
    }), kt(() => de?.disconnect());
    const ye = A();
    be(u, async () => {
      await Ce(), ye.value && (ye.value.scrollTop = 0);
    });
    async function te(h) {
      L.value && !d.value && (H = D.value?.getRootNode()?.activeElement), u.value = h, d.value = !0, L.value && (await Ce(), I.value?.focus());
    }
    const oe = (h) => JSON.stringify(h) === JSON.stringify(u.value), fe = U(() => u.value.kind === "field" ? o.config.fields[u.value.index] : void 0), V = U(() => Ke(o.config.fields)), g = U(() => u.value.kind === "field" ? V.value.find((h) => h.key === ie(u.value.index, u.value.trail ?? [])) : void 0), $ = U(() => g.value?.key ?? ""), T = U(() => {
      const h = g.value;
      return !h || h.trail.at(-1) === "item" || !h.trail.length ? void 0 : V.value.find((C) => C.key === ie(h.field, h.trail.slice(0, -1))).shape.properties.filter((C) => C !== h.shape).map((C) => C.name);
    }), F = A("");
    be($, () => {
      F.value = "";
    });
    const Ue = U(() => g.value ? Bl(o.config.fields, g.value) : []), ge = U(() => {
      const h = fl(o.config.fields.map(K));
      return h ? `Group path collides with field ${h}.` : "";
    }), De = U(() => ge.value ? null : yt(o.config.fields)), At = U(() => ge.value ? null : yt(o.config.fields, !0)), nt = U(() => {
      const h = u.value;
      return h.kind === "stage" ? ke[h.stage] : h.kind === "field" ? g.value?.trail.length ? g.value.path : fe.value?.name || "New field" : h.kind === "document" ? "Read document" : h.kind === "output" ? "Output" : "Details";
    }), Rt = U(() => {
      const h = u.value;
      return h.kind === "stage" ? at[h.stage] : h.kind === "field" ? "tabler:forms" : h.kind === "document" ? "tabler:file-text" : h.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Bt = U(() => o.config.fields.filter((h, r) => !(u.value.kind === "field" && u.value.index === r)).map(K)), Lt = U(() => o.config.stages.deep.enabled), Tt = U(() => o.config.stages.map.enabled), Dt = U(() => Te(o.config.fields.map(K))), Pe = A(!1), st = A(), ot = pe();
    function Pt(h, r) {
      for (const C of o.config.fields) (C.group === h || C.group.startsWith(h + ".")) && (C.group = r + C.group.slice(h.length));
    }
    const Ft = (h) => 320 - Math.max(0, ...o.config.fields.filter((r) => r.group === h || r.group.startsWith(h + ".")).map((r) => r.group.length - h.length));
    function It() {
      x.value = !0, Pe.value = !0;
    }
    async function it() {
      Pe.value = !1, await Ce(), st.value.focus();
    }
    function Ot(h) {
      o.config.fields.push({ ...et(), group: h }), it();
    }
    const jt = U(() => [...new Set(o.config.fields.map((h) => h.group.trim()).filter(Boolean))]), zt = (h) => St(o.config.fields[h], o.config.fields.filter((r, C) => C !== h).map(K)), dt = ["map", "prefetch", "scout", "deep", "extract", "verify"], Wt = U(() => dt.filter((h) => Ge(o.config, h)).map((h) => ke[h]).join(" · ")), Gt = U(() => o.config.fields.map((h) => h.name || "New field").join(", ")), Kt = U(() => dt.filter((h) => Ge(o.config, h)).length), xe = (h) => o.result?.trace.find((r) => r.kind === h);
    function ut(h = "") {
      o.config.fields.push({ ...et(), group: h }), x.value = !0, te({ kind: "field", index: o.config.fields.length - 1 });
    }
    function Ht(h) {
      o.config.fields.splice(h, 1), u.value = { kind: "document" };
    }
    function re(h, r = []) {
      te({ kind: "field", index: h, ...r.length ? { trail: r } : {} });
    }
    function rt(h, r) {
      const C = V.value.find((Y) => Y.key === ie(h, r));
      C.shape.properties.push(Vt()), re(h, [...r, C.shape.properties.length - 1]);
    }
    function Qt() {
      const h = g.value;
      if (!h.trail.length) {
        Ht(h.field);
        return;
      }
      const r = V.value.find((C) => C.key === ie(h.field, h.trail.slice(0, -1)));
      r.shape.properties.splice(h.trail.at(-1), 1), re(r.field, r.trail);
    }
    function Jt(h, r, C) {
      if (r.length) {
        const X = V.value.find((ne) => ne.key === ie(h, r.slice(0, -1))).shape.properties, ae = r.at(-1), ee = ae + C;
        if (ee < 0 || ee >= X.length) return;
        [X[ae], X[ee]] = [X[ee], X[ae]], re(h, [...r.slice(0, -1), ee]);
      } else {
        const Y = o.config.fields.map((ee, ne) => ee.group === o.config.fields[h].group ? ne : -1).filter((ee) => ee >= 0), X = Y[Y.indexOf(h) + C];
        if (X === void 0) return;
        const ae = o.config.fields;
        [ae[h], ae[X]] = [ae[X], ae[h]], re(X);
      }
    }
    function Yt() {
      const h = g.value, r = Ue.value.find((Y) => Y.key === F.value), C = Ll(o.config.fields, h, r);
      re(C.field, C.trail);
    }
    function Xt(h) {
      const r = g.value?.shape;
      o.config.fields.splice(0, o.config.fields.length, ...o.config.fields.filter((Y) => Y.group !== h && !Y.group.startsWith(h + ".")));
      const C = V.value.find((Y) => Y.shape === r);
      C ? re(C.field, C.trail) : u.value = { kind: "document" };
    }
    function Zt(h, r) {
      const C = h.split(".").slice(0, -1).join(".");
      let X = Te(o.config.fields.map(K));
      for (const se of C.split(".").filter(Boolean)) X = X.children.find((ll) => ll.name === se);
      const ae = X.children.findIndex((se) => se.path === h), ee = X.children[ae + r]?.path;
      if (!ee) return;
      const ne = o.config.fields.filter((se) => se.group === h || se.group.startsWith(h + ".")), Fe = o.config.fields.filter((se) => se.group === ee || se.group.startsWith(ee + ".")), Me = o.config.fields, el = Math.min(Me.indexOf(ne[0]), Me.indexOf(Fe[0])), vt = Me.filter((se) => !ne.includes(se) && !Fe.includes(se));
      vt.splice(el, 0, ...r > 0 ? [...Fe, ...ne] : [...ne, ...Fe]);
      const tl = g.value?.shape;
      Me.splice(0, Me.length, ...vt);
      const Ye = V.value.find((se) => se.shape === tl);
      Ye && re(Ye.field, Ye.trail);
    }
    const _t = (h) => h.type === "list" ? `list of ${h.item?.type}` : h.type, ct = U({ get: () => o.config.tags.join(", "), set: (h) => {
      o.config.tags = [...new Set(h.split(",").map((r) => r.trim()).filter(Boolean))];
    } });
    return (h, r) => (n(), s("div", {
      ref_key: "root",
      ref: D,
      class: Q(["builder", { narrow: L.value, "panel-open": d.value, resizing: B.value }])
    }, [
      t("div", {
        class: "canvas",
        inert: L.value && d.value
      }, [
        t("div", Ns, [
          t("section", Us, [
            t("header", Ms, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": x.value,
                "aria-controls": "fields-body",
                onClick: r[0] || (r[0] = (C) => P("fields"))
              }, [
                p(m(R), {
                  icon: x.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                r[23] || (r[23] = t("h2", { id: "fields-head" }, "Fields", -1)),
                t("span", Rs, i(e.config.fields.length), 1)
              ], 8, As),
              !x.value && e.config.fields.length ? (n(), s("span", Bs, i(Gt.value), 1)) : y("", !0),
              e.readonly ? y("", !0) : (n(), s("div", Ls, [
                t("button", {
                  ref_key: "addGroupButton",
                  ref: st,
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  "aria-label": "Add group",
                  "aria-expanded": Pe.value,
                  "aria-controls": m(ot),
                  disabled: e.config.fields.length >= 100,
                  onClick: It
                }, [
                  p(m(R), { icon: "tabler:folder-plus" }),
                  r[24] || (r[24] = q("Add group", -1))
                ], 8, Ts),
                t("button", {
                  type: "button",
                  class: "kx-btn kx-btn-ghost kx-focus-halo sm",
                  disabled: e.config.fields.length >= 100,
                  onClick: r[1] || (r[1] = (C) => ut())
                }, [
                  p(m(R), { icon: "tabler:plus" }),
                  r[25] || (r[25] = q("Add field", -1))
                ], 8, Ds)
              ]))
            ]),
            z(t("div", Ps, [
              e.config.fields.length ? y("", !0) : (n(), s("p", Fs, "Add the values to pull from each document.")),
              t("div", Is, [
                Pe.value && !e.readonly ? (n(), s("div", {
                  key: 0,
                  id: m(ot),
                  class: "group-create-row"
                }, [
                  t("span", js, [
                    p(m(R), { icon: "tabler:folder-plus" })
                  ]),
                  p(qt, {
                    "input-label": "New group path",
                    "save-label": "Create group",
                    "cancel-label": "Cancel group creation",
                    onSave: Ot,
                    onCancel: it
                  })
                ], 8, Os)) : y("", !0),
                p(Re, { node: Dt.value }, {
                  header: me(({ path: C, label: Y, count: X, first: ae, last: ee }) => [
                    p(Ma, {
                      path: C,
                      name: Y,
                      count: X,
                      first: ae,
                      last: ee,
                      "max-length": Ft(C),
                      "can-add": e.config.fields.length < 100,
                      readonly: e.readonly,
                      onRename: (ne) => Pt(C, ne),
                      onAdd: (ne) => ut(C),
                      onReorder: (ne) => Zt(C, ne),
                      onRemove: (ne) => Xt(C)
                    }, null, 8, ["path", "name", "count", "first", "last", "max-length", "can-add", "readonly", "onRename", "onAdd", "onReorder", "onRemove"])
                  ]),
                  default: me(({ index: C }) => [
                    p(en, {
                      shape: e.config.fields[C],
                      field: C,
                      trail: [],
                      path: m(K)(e.config.fields[C]) || "New field",
                      selected: $.value,
                      readonly: e.readonly,
                      error: zt(C),
                      first: !e.config.fields.slice(0, C).some((Y) => Y.group === e.config.fields[C].group),
                      last: !e.config.fields.slice(C + 1).some((Y) => Y.group === e.config.fields[C].group),
                      onSelect: re,
                      onAdd: rt,
                      onReorder: Jt
                    }, null, 8, ["shape", "field", "path", "selected", "readonly", "error", "first", "last"])
                  ]),
                  _: 1
                }, 8, ["node"])
              ]),
              t("details", zs, [
                t("summary", Ws, [
                  p(m(R), { icon: "tabler:braces" }),
                  r[26] || (r[26] = q("Output preview", -1))
                ]),
                ge.value ? (n(), s("p", Gs, i(ge.value), 1)) : (n(), s("div", Ks, [
                  t("div", null, [
                    r[27] || (r[27] = t("h3", null, "Output shape", -1)),
                    t("pre", Hs, i(JSON.stringify(De.value, null, 2)), 1)
                  ]),
                  t("div", null, [
                    r[28] || (r[28] = t("h3", null, "Example value", -1)),
                    t("pre", Qs, i(JSON.stringify(At.value, null, 2)), 1)
                  ])
                ])),
                r[29] || (r[29] = t("small", null, "Example values illustrate the shape; extracted values come from your document.", -1))
              ])
            ], 512), [
              [We, x.value]
            ])
          ]),
          t("section", Js, [
            t("header", Ys, [
              t("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: r[2] || (r[2] = (C) => P("flow"))
              }, [
                p(m(R), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                r[30] || (r[30] = t("h2", { id: "flow-head" }, "Flow", -1)),
                t("span", Zs, i(Kt.value) + " of 6", 1)
              ], 8, Xs),
              w.value ? y("", !0) : (n(), s("span", _s, i(Wt.value), 1)),
              t("button", {
                type: "button",
                class: Q(["kx-btn kx-btn-ghost kx-focus-halo sm push", { on: oe({ kind: "details" }) }]),
                onClick: r[3] || (r[3] = (C) => te({ kind: "details" }))
              }, [
                p(m(R), { icon: "tabler:info-circle" }),
                r[31] || (r[31] = q("Details", -1))
              ], 2)
            ]),
            z(t("div", eo, [
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "document" }) }]),
                onClick: r[4] || (r[4] = (C) => te({ kind: "document" }))
              }, [
                t("span", to, [
                  p(m(R), { icon: "tabler:file-text" })
                ]),
                t("span", lo, [
                  r[32] || (r[32] = t("span", { class: "node-title" }, "Read document", -1)),
                  t("span", ao, i(m(gl)(e.config.retrieval)), 1)
                ]),
                t("span", no, [
                  t("span", so, i(m(xt)(e.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              r[37] || (r[37] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "map",
                config: e.config,
                active: oe({ kind: "stage", stage: "map" }),
                trace: xe("map"),
                readonly: e.readonly,
                onSelect: r[5] || (r[5] = (C) => te({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[38] || (r[38] = t("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                t("span")
              ], -1)),
              t("div", oo, [
                t("div", io, [
                  r[33] || (r[33] = t("span", { class: "branch-label" }, "Evidence", -1)),
                  p(we, {
                    stage: "prefetch",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "prefetch" }),
                    trace: xe("prefetch"),
                    readonly: e.readonly,
                    onSelect: r[6] || (r[6] = (C) => te({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  r[34] || (r[34] = t("div", { class: "connector" }, null, -1)),
                  p(we, {
                    stage: "scout",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "scout" }),
                    trace: xe("scout"),
                    readonly: e.readonly,
                    onSelect: r[7] || (r[7] = (C) => te({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                t("div", uo, [
                  r[35] || (r[35] = t("span", { class: "branch-label" }, "Deep fields", -1)),
                  p(we, {
                    stage: "deep",
                    config: e.config,
                    active: oe({ kind: "stage", stage: "deep" }),
                    trace: xe("deep"),
                    readonly: e.readonly,
                    onSelect: r[8] || (r[8] = (C) => te({ kind: "stage", stage: "deep" }))
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
                trace: xe("extract"),
                readonly: e.readonly,
                onSelect: r[9] || (r[9] = (C) => te({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[40] || (r[40] = t("div", { class: "connector" }, null, -1)),
              p(we, {
                stage: "verify",
                config: e.config,
                active: oe({ kind: "stage", stage: "verify" }),
                trace: xe("verify"),
                readonly: e.readonly,
                onSelect: r[10] || (r[10] = (C) => te({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              r[41] || (r[41] = t("div", { class: "connector" }, null, -1)),
              t("button", {
                type: "button",
                class: Q(["node kx-focus-halo fixed", { active: oe({ kind: "output" }) }]),
                onClick: r[11] || (r[11] = (C) => te({ kind: "output" }))
              }, [
                t("span", ro, [
                  p(m(R), { icon: "tabler:braces" })
                ]),
                t("span", co, [
                  r[36] || (r[36] = t("span", { class: "node-title" }, "Output", -1)),
                  t("span", vo, i(e.config.fields.length ? `${e.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [We, w.value]
            ])
          ])
        ])
      ], 8, qs),
      L.value && d.value ? (n(), s("div", {
        key: 0,
        class: "scrim",
        onClick: r[12] || (r[12] = (C) => G(!1))
      })) : y("", !0),
      d.value ? z((n(), s("aside", {
        key: String(L.value),
        class: "side-panel",
        "aria-labelledby": m(j),
        role: L.value ? "dialog" : void 0,
        "aria-modal": L.value ? "true" : void 0,
        style: qe(L.value ? void 0 : { width: `${c.value}px` }),
        onKeydown: r[21] || (r[21] = Ee((C) => L.value && G(!1), ["esc"]))
      }, [
        L.value ? y("", !0) : (n(), s("div", {
          key: 0,
          class: Q(["resizer kx-focus-outline", { active: B.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": c.value,
          "aria-valuemin": Oe,
          onPointerdown: ve(S, ["prevent"]),
          onKeydown: N,
          onDblclick: r[13] || (r[13] = (C) => f(Ze))
        }, null, 42, po)),
        t("header", bo, [
          t("span", fo, [
            p(m(R), { icon: Rt.value }, null, 8, ["icon"])
          ]),
          t("h2", { id: m(j) }, i(nt.value), 9, go),
          t("button", {
            ref_key: "closeButton",
            ref: I,
            type: "button",
            class: "kx-iconbtn kx-focus-outline push",
            "aria-label": L.value ? "Close panel" : "Collapse panel",
            title: L.value ? "Close panel" : "Collapse panel",
            onClick: r[14] || (r[14] = (C) => G(!1))
          }, [
            p(m(R), {
              icon: L.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, ho)
        ]),
        t("div", {
          ref_key: "panelBody",
          ref: ye,
          class: "side-panel-body"
        }, [
          u.value.kind === "document" ? (n(), J(Es, {
            key: 0,
            config: e.config,
            retention: e.retention,
            readonly: e.readonly
          }, null, 8, ["config", "retention", "readonly"])) : u.value.kind === "stage" ? (n(), J(cs, {
            key: 1,
            stage: u.value.stage,
            config: e.config,
            readonly: e.readonly
          }, null, 8, ["stage", "config", "readonly"])) : u.value.kind === "field" && fe.value && g.value ? (n(), s(M, { key: 2 }, [
            t("p", yo, i(g.value.path), 1),
            p(va, {
              field: fe.value,
              shape: g.value.shape,
              depth: g.value.depth,
              "sibling-names": T.value,
              "other-names": Bt.value,
              groups: jt.value,
              "deep-enabled": Lt.value,
              "map-enabled": Tt.value,
              readonly: e.readonly,
              onRemove: Qt,
              onAdd: r[15] || (r[15] = (C) => rt(g.value.field, g.value.trail)),
              onSelectItem: r[16] || (r[16] = (C) => re(g.value.field, [...g.value.trail, "item"]))
            }, null, 8, ["field", "shape", "depth", "sibling-names", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"]),
            !e.readonly && g.value.trail.at(-1) !== "item" ? (n(), s("fieldset", ko, [
              t("label", null, [
                r[42] || (r[42] = q("Move to parent", -1)),
                z(t("select", {
                  "onUpdate:modelValue": r[17] || (r[17] = (C) => F.value = C),
                  "aria-label": "Move to parent"
                }, [
                  g.value.trail.length ? (n(), s("option", $o, "Top-level field")) : (n(), s("option", xo, "Choose an object…")),
                  (n(!0), s(M, null, O(Ue.value, (C) => (n(), s("option", {
                    key: C.key,
                    value: C.key
                  }, i(C.path), 9, wo))), 128))
                ], 512), [
                  [ze, F.value]
                ])
              ]),
              t("button", {
                type: "button",
                class: "kx-btn kx-btn-ghost kx-focus-halo",
                "aria-label": "Move selected node",
                disabled: !F.value && !g.value.trail.length || !F.value && e.config.fields.length >= 100,
                onClick: Yt
              }, "Move", 8, Vo)
            ])) : y("", !0)
          ], 64)) : u.value.kind === "details" ? (n(), s("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: e.readonly
          }, [
            t("label", null, [
              r[43] || (r[43] = q("Name", -1)),
              z(t("input", {
                "onUpdate:modelValue": r[18] || (r[18] = (C) => l.value = C),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, l.value]
              ])
            ]),
            t("label", null, [
              r[44] || (r[44] = q("Description", -1)),
              z(t("textarea", {
                "onUpdate:modelValue": r[19] || (r[19] = (C) => v.value = C),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, v.value]
              ])
            ]),
            t("label", null, [
              r[45] || (r[45] = q("Tags", -1)),
              z(t("input", {
                "onUpdate:modelValue": r[20] || (r[20] = (C) => ct.value = C),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  ct.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              r[46] || (r[46] = t("small", null, "Comma separated", -1))
            ])
          ], 8, So)) : u.value.kind === "output" ? (n(), s("div", Co, [
            r[47] || (r[47] = t("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            t("ul", Eo, [
              (n(!0), s(M, null, O(e.config.fields, (C) => (n(), s("li", {
                key: m(K)(C)
              }, [
                t("span", qo, i(m(K)(C) || "New field"), 1),
                t("span", No, i(_t(C)), 1)
              ]))), 128))
            ]),
            r[48] || (r[48] = t("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : y("", !0)
        ], 512)
      ], 44, mo)), [
        [m(kl), { disabled: !L.value }]
      ]) : L.value ? y("", !0) : (n(), s("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: r[22] || (r[22] = (C) => G(!0))
      }, [
        p(m(R), { icon: "tabler:layout-sidebar-right-expand" }),
        t("span", Uo, i(nt.value), 1)
      ]))
    ], 2));
  }
}), Ao = ["selected"], Ro = {
  key: 1,
  role: "alert"
}, Bo = {
  key: 2,
  class: "muted picker-pending picker-pending--list"
}, Nt = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const l = o, v = A(!1), u = A("");
    Ne(async () => {
      try {
        await Je("wc-multiselect", { timeoutMs: 8e3 }), v.value = !0;
      } catch (k) {
        u.value = String(k);
      }
    });
    function b(k) {
      const d = k.detail;
      l("select", d.selected[0] || "", d.labels?.[0] || "");
    }
    return (k, d) => v.value ? (n(), s("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(e.value ? [e.value] : []),
      placeholder: "Choose an upload",
      onChange: b
    }, null, 40, Ao)) : u.value ? (n(), s("p", Ro, i(u.value), 1)) : (n(), s("span", Bo, "Loading uploads…"));
  }
}), Lo = ["data-error-kind"], To = { key: 0 }, Ut = /* @__PURE__ */ W({
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
        t("strong", null, i(e.error?.kind), 1),
        q(" · " + i(e.error?.message), 1)
      ]),
      t("small", null, i(e.error?.retryable ? "Retryable" : "Not retryable"), 1),
      e.error?.details ? (n(), s("details", To, [
        l[0] || (l[0] = t("summary", { class: "kx-focus-outline" }, "Error details", -1)),
        t("pre", null, i(JSON.stringify(e.error.details, null, 2)), 1)
      ])) : y("", !0)
    ], 8, Lo));
  }
}), Do = { class: "nested-value" }, Po = { key: 0 }, Fo = {
  key: 0,
  class: "muted"
}, Io = { key: 1 }, Oo = { key: 2 }, Be = /* @__PURE__ */ W({
  __name: "NestedValue",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, l = U(() => o.value !== null && typeof o.value == "object" && !Array.isArray(o.value) ? o.value : null);
    return (v, u) => {
      const b = lt("NestedValue", !0);
      return n(), s("div", Do, [
        Array.isArray(e.value) ? (n(), s("ol", Po, [
          (n(!0), s(M, null, O(e.value, (k, d) => (n(), s("li", { key: d }, [
            p(b, { value: k }, null, 8, ["value"])
          ]))), 128)),
          e.value.length ? y("", !0) : (n(), s("li", Fo, "Empty list"))
        ])) : l.value ? (n(), s("dl", Io, [
          (n(!0), s(M, null, O(l.value, (k, d) => (n(), s(M, { key: d }, [
            t("dt", null, i(d), 1),
            t("dd", null, [
              p(b, { value: k }, null, 8, ["value"])
            ])
          ], 64))), 128))
        ])) : (n(), s("span", Oo, i(e.value === null || e.value === void 0 ? "—" : String(e.value)), 1))
      ]);
    };
  }
}), jo = { class: "value-list" }, zo = ["aria-expanded", "onClick"], Wo = { class: "value-name" }, Go = { class: "bar" }, Ko = {
  key: 1,
  class: "value-checks"
}, Ho = ["title"], Qo = {
  key: 0,
  class: "chip",
  "aria-label": "Completeness"
}, Jo = { class: "evidence" }, Yo = {
  key: 1,
  class: "muted"
}, Xo = {
  key: 2,
  class: "muted"
}, Mt = /* @__PURE__ */ W({
  __name: "ResultFields",
  props: {
    fields: {},
    pageRange: {}
  },
  setup(e) {
    const o = e, l = U(() => Te(o.fields.map((w) => w.path))), v = A(), u = (w) => `${Math.round(w * 100)}%`, b = (w) => w !== null && typeof w == "object", k = (w) => Array.isArray(w) ? `${w.length} items` : b(w) ? `${Object.keys(w).length} properties` : w == null ? "—" : String(w), d = (w) => w >= 0.9 ? "high" : w >= 0.7 ? "mid" : "low", x = (w) => w.codes?.includes("missing_in_sections") ? "Not in the selected sections" + (o.pageRange ? " of the searched pages" : "") : "Not in the document";
    return (w, E) => (n(), s("div", jo, [
      p(Re, { node: l.value }, {
        default: me(({ index: c }) => [
          (n(!0), s(M, null, O([e.fields[c]], (a) => (n(), s("div", {
            key: a.path,
            class: "value-row"
          }, [
            t("button", {
              type: "button",
              class: "value-main",
              "aria-expanded": v.value === a.path,
              onClick: (f) => v.value = v.value === a.path ? void 0 : a.path
            }, [
              t("span", Wo, i(a.name), 1),
              t("span", {
                class: Q(["value-text", { missing: a.missing }])
              }, i(a.failed ? "Failed" : a.missing ? x(a) : k(a.value)), 3),
              a.failed ? y("", !0) : (n(), s("span", {
                key: 0,
                class: Q(["confidence", d(a.confidence)])
              }, [
                t("span", Go, [
                  t("span", {
                    style: qe({ width: u(a.confidence) })
                  }, null, 4)
                ]),
                q(i(u(a.confidence)), 1),
                E[0] || (E[0] = t("span", { class: "conf-word" }, " confidence", -1))
              ], 2)),
              a.failed ? y("", !0) : (n(), s("span", Ko, [
                t("span", {
                  class: Q(["chip", a.verified ? "primary" : "warn"]),
                  title: a.reason
                }, [
                  p(m(R), {
                    icon: a.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  q(i(a.verified ? "Verified" : "Check"), 1)
                ], 10, Ho),
                a.missing ? y("", !0) : (n(), s("span", Qo, i(a.complete === !0 ? "Complete" : a.complete === !1 ? "Incomplete" : "Completeness unknown"), 1))
              ])),
              p(m(R), {
                icon: v.value === a.path ? "tabler:chevron-up" : "tabler:chevron-down",
                class: "value-caret"
              }, null, 8, ["icon"])
            ], 8, zo),
            !a.failed && !a.missing && b(a.value) ? (n(), J(Be, {
              key: 0,
              class: "structured-value",
              value: a.value
            }, null, 8, ["value"])) : y("", !0),
            a.failed ? (n(), J(Ut, {
              key: 1,
              error: a.error
            }, null, 8, ["error"])) : y("", !0),
            z(t("div", Jo, [
              !a.failed && !a.missing && !b(a.value) ? (n(), J(Be, {
                key: 0,
                value: a.value
              }, null, 8, ["value"])) : y("", !0),
              (n(!0), s(M, null, O(a.evidence, (f, B) => (n(), s("blockquote", {
                key: B,
                class: Q({ unfound: f.found === !1 })
              }, [
                t("p", null, "“" + i(f.quote) + "”", 1),
                t("cite", null, [
                  q(i(f.section), 1),
                  f.page !== void 0 && f.page !== null ? (n(), s(M, { key: 0 }, [
                    q(" · Page " + i(f.page), 1)
                  ], 64)) : y("", !0),
                  f.found === !1 ? (n(), s(M, { key: 1 }, [
                    q(" · not found word for word in the document")
                  ], 64)) : y("", !0)
                ])
              ], 2))), 128)),
              a.evidence.length ? y("", !0) : (n(), s("p", Yo, "No evidence.")),
              a.reason || !a.verified && !a.failed ? (n(), s("p", Xo, i(a.reason || "No reason recorded"), 1)) : y("", !0)
            ], 512), [
              [We, v.value === a.path && !a.failed]
            ])
          ]))), 128))
        ]),
        _: 1
      }, 8, ["node"])
    ]));
  }
}), Zo = { class: "test" }, _o = { class: "run-bar" }, ei = { class: "run-input" }, ti = { class: "muted run-note" }, li = {
  key: 0,
  class: "empty"
}, ai = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, ni = {
  key: 2,
  class: "eval-warning",
  role: "status"
}, si = {
  key: 3,
  class: "test-grid"
}, oi = { class: "block" }, ii = { class: "block-head" }, di = { class: "muted push" }, ui = { class: "block" }, ri = { class: "timeline" }, ci = { class: "tl-icon" }, vi = { class: "tl-main" }, mi = { class: "tl-head" }, pi = { class: "muted push" }, bi = { class: "tl-bar" }, fi = { class: "muted" }, gi = {
  key: 0,
  class: "tl-msg"
}, hi = {
  key: 1,
  class: "chips"
}, yi = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(e, { emit: o }) {
    const l = e, v = o, u = A(""), b = (E) => `${(E / 1e3).toFixed(1)}s`, k = U(() => Math.max(1, ...l.result?.trace.map((E) => E.duration_ms) ?? [1])), d = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, x = (E) => d[E]?.label ?? ke[E] ?? E, w = (E) => d[E]?.icon ?? at[E] ?? "tabler:point";
    return (E, c) => (n(), s("div", Zo, [
      t("section", _o, [
        t("div", ei, [
          p(Nt, {
            value: u.value,
            onSelect: c[0] || (c[0] = (a) => u.value = a)
          }, null, 8, ["value"])
        ]),
        p(m(ue), {
          label: e.running ? "Extracting…" : "Run extraction",
          loading: e.running,
          disabled: !u.value || e.running || !e.canRun,
          onClick: c[1] || (c[1] = (a) => v("run", u.value))
        }, null, 8, ["label", "loading", "disabled"]),
        t("p", ti, i(e.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(e.retention) + ".", 1)
      ]),
      e.result ? y("", !0) : (n(), s("p", li, "No extraction results yet.")),
      e.result?.status === "failed" ? (n(), s("p", ai, [
        p(m(R), { icon: "tabler:alert-triangle" }),
        q("The run stopped: " + i(e.result.error), 1)
      ])) : y("", !0),
      e.result?.status === "partial" ? (n(), s("p", ni, [
        p(m(R), { icon: "tabler:alert-triangle" }),
        c[2] || (c[2] = q("Partial result · Some fields failed. Successful values are available below.", -1))
      ])) : y("", !0),
      e.result ? (n(), s("div", si, [
        t("section", oi, [
          t("header", ii, [
            c[3] || (c[3] = t("h2", { class: "block-title" }, "Values", -1)),
            t("span", di, [
              q(i(e.result.tokens.toLocaleString()) + " tokens · " + i(b(e.result.duration_ms)), 1),
              e.result.page_range ? (n(), s(M, { key: 0 }, [
                q(" · Pages " + i(e.result.page_range.first) + "–" + i(e.result.page_range.last), 1)
              ], 64)) : e.result.pages ? (n(), s(M, { key: 1 }, [
                q(" · " + i(e.result.pages) + " pages", 1)
              ], 64)) : y("", !0)
            ])
          ]),
          p(Mt, {
            fields: e.result.fields,
            "page-range": e.result.page_range
          }, null, 8, ["fields", "page-range"])
        ]),
        t("section", ui, [
          c[4] || (c[4] = t("header", { class: "block-head" }, [
            t("h2", { class: "block-title" }, "Steps")
          ], -1)),
          t("ol", ri, [
            (n(!0), s(M, null, O(e.result.trace, (a, f) => (n(), s("li", {
              key: f,
              class: Q(a.status)
            }, [
              t("span", ci, [
                p(m(R), {
                  icon: w(a.kind)
                }, null, 8, ["icon"])
              ]),
              t("div", vi, [
                t("div", mi, [
                  t("strong", null, i(x(a.kind)), 1),
                  t("span", pi, i(b(a.duration_ms)), 1)
                ]),
                t("span", bi, [
                  t("span", {
                    style: qe({ width: `${Math.max(4, a.duration_ms / k.value * 100)}%` })
                  }, null, 4)
                ]),
                t("p", fi, [
                  q(i(a.scope), 1),
                  a.pages ? (n(), s(M, { key: 0 }, [
                    q(" · Pages " + i(a.pages.first) + "–" + i(a.pages.last), 1)
                  ], 64)) : y("", !0),
                  a.model ? (n(), s(M, { key: 1 }, [
                    q(" · " + i(a.model), 1)
                  ], 64)) : y("", !0),
                  q(" · " + i((a.input_tokens + a.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                a.message ? (n(), s("p", gi, i(a.message), 1)) : y("", !0),
                a.queries?.length ? (n(), s("div", hi, [
                  (n(!0), s(M, null, O(a.queries, (B) => (n(), s("span", {
                    key: B,
                    class: "chip"
                  }, i(B), 1))), 128))
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
const ki = { class: "evals" }, $i = { class: "block eval-run" }, xi = { class: "eval-run-main" }, wi = { class: "block-title" }, Vi = {
  key: 0,
  class: "eval-note"
}, Si = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Ci = { class: "bar" }, Ei = { class: "muted" }, qi = { class: "stat-row" }, Ni = { class: "stat" }, Ui = { class: "stat-label" }, Mi = { class: "stat-value" }, Ai = { class: "stat" }, Ri = { class: "stat-value" }, Bi = { class: "stat-delta flat" }, Li = { class: "stat" }, Ti = { class: "stat-value" }, Di = {
  key: 0,
  class: "stat-delta flat"
}, Pi = { class: "stat" }, Fi = { class: "stat-value" }, Ii = {
  key: 0,
  class: "stat-delta flat"
}, Oi = { class: "block" }, ji = { class: "block-head" }, zi = {
  key: 0,
  class: "compare-pick push"
}, Wi = ["value"], Gi = ["value"], Ki = {
  key: 0,
  class: "block-empty"
}, Hi = {
  key: 1,
  class: "table-scroll"
}, Qi = { key: 0 }, Ji = { key: 1 }, Yi = { class: "mono" }, Xi = { class: "acc strong" }, Zi = { class: "bar" }, _i = { class: "muted" }, ed = {
  key: 0,
  class: "muted"
}, td = { key: 1 }, ld = {
  key: 1,
  class: "muted"
}, ad = {
  key: 1,
  class: "block"
}, nd = { class: "table-scroll" }, sd = { class: "metric-table result-matrix" }, od = ["aria-expanded", "onClick"], id = {
  key: 0,
  class: "badge",
  "data-status": "partial"
}, dd = ["colspan"], ud = {
  key: 0,
  class: "cell-state"
}, rd = ["data-error-kind", "title"], cd = ["data-label"], vd = ["title"], md = {
  key: 0,
  class: "result-detail"
}, pd = ["colspan"], bd = ["data-error-kind", "title"], fd = { class: "mono" }, gd = { class: "cmp" }, hd = { class: "cmp" }, yd = { key: 0 }, kd = { class: "muted case-meta" }, $d = { class: "block" }, xd = { class: "block-head" }, wd = { class: "count" }, Vd = { class: "mono" }, Sd = ["onUpdate:modelValue"], Cd = ["onUpdate:modelValue"], Ed = ["onUpdate:modelValue", "placeholder"], qd = ["onUpdate:modelValue", "type"], Nd = {
  key: 0,
  class: "error",
  role: "alert"
}, Ud = { class: "row" }, Md = {
  key: 1,
  class: "block-empty"
}, Ad = {
  key: 2,
  class: "block-empty"
}, Rd = {
  key: 3,
  class: "table-scroll"
}, Bd = { class: "metric-table case-table" }, Ld = { class: "case-value" }, Td = {
  key: 1,
  class: "muted"
}, Dd = { class: "num" }, Pd = ["aria-label", "disabled", "onClick"], Fd = {
  key: 2,
  class: "block"
}, Id = { class: "block-head" }, Od = { class: "count" }, jd = { class: "eval-history" }, zd = ["aria-current", "onClick"], Wd = ["data-status"], Gd = { class: "muted" }, Kd = { class: "push" }, Hd = /* @__PURE__ */ W({
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
    const l = e, v = o, u = A(!1), b = A(""), k = A({}), d = A("");
    be(() => l.addedCaseId, () => {
      u.value = !1, b.value = "", k.value = {};
    });
    function x(V, g) {
      return V.type === "number" ? Number(g) : V.type === "boolean" ? g === "true" : V.type === "list" || V.type === "object" ? JSON.parse(g) : g;
    }
    function w() {
      d.value = "";
      const V = {};
      try {
        for (const g of l.fields) {
          const $ = String(k.value[K(g)] ?? "").trim();
          $ && wt(V, K(g), x(g, $));
        }
      } catch {
        d.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      v("add-case", { upload_id: b.value, expected: V });
    }
    const E = U(() => l.evaluations.find((V) => !je(V))), c = U(() => l.evaluations.filter(je)), a = U(() => l.evaluation), f = U(() => ({ done: (a.value?.results ?? []).filter((g) => g.status !== "queued").length, total: a.value?.case_count ?? 0 })), B = A();
    be(() => a.value?.id, () => {
      B.value = void 0;
    });
    const S = U(() => {
      if (!a.value) return;
      if (B.value) return c.value.find((g) => g.id === B.value);
      const V = c.value.findIndex((g) => g.id === a.value.id);
      return V >= 0 ? c.value[V + 1] : c.value[0];
    }), N = U(() => (a.value?.metrics ?? []).map((V) => ({ ...V, before: S.value?.metrics.find((g) => g.field === V.field) }))), H = U(() => (a.value?.fields ?? []).map(K)), I = U(() => Te(l.fields.map(K))), j = (V, g) => V.scores.find(($) => $.field === g), G = A(), P = (V) => `${Math.round(V * 100)}%`, D = (V) => {
      const g = Math.round(V * 100);
      return `${g > 0 ? "+" : g < 0 ? "−" : "±"}${Math.abs(g)} pts`;
    }, L = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", de = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ye = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((g) => typeof g != "object") ? V.join(", ") : JSON.stringify(V), te = (V) => V ? V.failed ? "fail" : V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", oe = (V) => (V.results ?? []).filter((g) => g.status === "completed").length, fe = { queued: "Queued", running: "Running", completed: "Completed", partial: "Partial", failed: "Failed" };
    return (V, g) => (n(), s("div", ki, [
      t("section", $i, [
        t("div", xi, [
          t("div", null, [
            t("h2", wi, "Evaluate revision " + i(e.revision), 1),
            g[6] || (g[6] = t("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            e.changed ? (n(), s("p", Vi, [
              p(m(R), { icon: "tabler:info-circle" }),
              g[5] || (g[5] = q("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : y("", !0)
          ]),
          p(m(ue), {
            label: E.value ? "Evaluating…" : "Run all cases",
            loading: e.starting || !!E.value,
            disabled: !e.cases.length || !e.fields.length || !!E.value || e.starting,
            onClick: g[0] || (g[0] = ($) => v("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        a.value && !m(je)(a.value) ? (n(), s("div", Si, [
          t("span", Ci, [
            t("span", {
              style: qe({ width: P(f.value.total ? f.value.done / f.value.total : 0) })
            }, null, 4)
          ]),
          t("span", Ei, i(fe[a.value.status]) + " · " + i(f.value.done) + " of " + i(f.value.total) + " cases", 1)
        ])) : y("", !0)
      ]),
      a.value && m(je)(a.value) ? (n(), s(M, { key: 0 }, [
        a.value.error ? (n(), s("p", {
          key: 0,
          class: Q(a.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          p(m(R), { icon: "tabler:alert-triangle" }),
          q(i(a.value.error), 1)
        ], 2)) : y("", !0),
        t("div", qi, [
          t("div", Ni, [
            t("span", Ui, "Accuracy · revision " + i(a.value.config_revision), 1),
            t("span", Mi, i(P(m(Se)(a.value))), 1),
            S.value ? (n(), s("span", {
              key: 0,
              class: Q(["stat-delta", L(m(Se)(a.value) - m(Se)(S.value))])
            }, i(D(m(Se)(a.value) - m(Se)(S.value))) + " vs revision " + i(S.value.config_revision), 3)) : y("", !0)
          ]),
          t("div", Ai, [
            g[7] || (g[7] = t("span", { class: "stat-label" }, "Cases", -1)),
            t("span", Ri, [
              q(i(oe(a.value)), 1),
              t("small", null, " / " + i(a.value.case_count), 1)
            ]),
            t("span", Bi, i((a.value.results ?? []).filter(($) => $.status === "partial").length) + " partial · " + i((a.value.results ?? []).filter(($) => $.status === "failed").length) + " failed", 1)
          ]),
          t("div", Li, [
            g[8] || (g[8] = t("span", { class: "stat-label" }, "Tokens", -1)),
            t("span", Ti, i(a.value.tokens.toLocaleString()), 1),
            S.value ? (n(), s("span", Di, i(S.value.tokens.toLocaleString()) + " before", 1)) : y("", !0)
          ]),
          t("div", Pi, [
            g[9] || (g[9] = t("span", { class: "stat-label" }, "Model time", -1)),
            t("span", Fi, i(de(a.value.duration_ms)), 1),
            S.value ? (n(), s("span", Ii, i(de(S.value.duration_ms)) + " before", 1)) : y("", !0)
          ])
        ]),
        t("section", Oi, [
          t("header", ji, [
            g[11] || (g[11] = t("h2", { class: "block-title" }, "Field accuracy", -1)),
            c.value.length > 1 ? (n(), s("label", zi, [
              g[10] || (g[10] = t("span", { class: "muted" }, "Compare with", -1)),
              t("select", {
                value: S.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: g[1] || (g[1] = ($) => B.value = $.target.value)
              }, [
                (n(!0), s(M, null, O(c.value.filter(($) => $.id !== a.value.id), ($) => (n(), s("option", {
                  key: $.id,
                  value: $.id
                }, "Revision " + i($.config_revision) + " · " + i(m(He)($.created_at)), 9, Gi))), 128))
              ], 40, Wi)
            ])) : y("", !0)
          ]),
          N.value.length ? (n(), s("div", Hi, [
            t("table", {
              class: Q(["metric-table accuracy-table", { comparing: !!S.value }])
            }, [
              t("thead", null, [
                t("tr", null, [
                  g[12] || (g[12] = t("th", null, "Field", -1)),
                  g[13] || (g[13] = t("th", null, "Accuracy", -1)),
                  g[14] || (g[14] = t("th", null, "Verified", -1)),
                  S.value ? (n(), s("th", Qi, "Revision " + i(S.value.config_revision), 1)) : y("", !0),
                  S.value ? (n(), s("th", Ji, "Change")) : y("", !0)
                ])
              ]),
              t("tbody", null, [
                (n(!0), s(M, null, O(N.value, ($) => (n(), s("tr", {
                  key: $.field
                }, [
                  t("td", Yi, i($.field), 1),
                  t("td", null, [
                    t("span", Xi, [
                      t("span", Zi, [
                        t("span", {
                          style: qe({ width: P($.accuracy) })
                        }, null, 4)
                      ]),
                      q(i(P($.accuracy)), 1)
                    ])
                  ]),
                  t("td", _i, i(P($.verified)), 1),
                  S.value ? (n(), s("td", ed, i($.before ? P($.before.accuracy) : "—"), 1)) : y("", !0),
                  S.value ? (n(), s("td", td, [
                    $.before ? (n(), s("span", {
                      key: 0,
                      class: Q(["trend", L($.accuracy - $.before.accuracy)])
                    }, [
                      p(m(R), {
                        icon: L($.accuracy - $.before.accuracy) === "up" ? "tabler:trending-up" : L($.accuracy - $.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      q(i(D($.accuracy - $.before.accuracy)), 1)
                    ], 2)) : (n(), s("span", ld, "New field"))
                  ])) : y("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (n(), s("p", Ki, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : y("", !0),
      a.value?.results?.length ? (n(), s("section", ad, [
        g[19] || (g[19] = t("header", { class: "block-head" }, [
          t("h2", { class: "block-title" }, "Results by case"),
          t("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        t("div", nd, [
          t("table", sd, [
            t("thead", null, [
              t("tr", null, [
                g[15] || (g[15] = t("th", null, "Document", -1)),
                (n(!0), s(M, null, O(H.value, ($) => (n(), s("th", {
                  key: $,
                  class: "mono"
                }, i($), 1))), 128))
              ])
            ]),
            t("tbody", null, [
              (n(!0), s(M, null, O(a.value.results, ($) => (n(), s(M, {
                key: $.case_id
              }, [
                t("tr", {
                  class: Q(["result-row", { active: G.value === $.case_id }])
                }, [
                  t("td", null, [
                    t("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": G.value === $.case_id,
                      onClick: (T) => G.value = G.value === $.case_id ? void 0 : $.case_id
                    }, [
                      p(m(R), {
                        icon: G.value === $.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      q(i($.upload_name), 1)
                    ], 8, od),
                    $.status === "partial" ? (n(), s("span", id, "Partial")) : y("", !0)
                  ]),
                  $.status === "queued" || $.status === "failed" ? (n(), s("td", {
                    key: 0,
                    colspan: H.value.length,
                    class: "muted"
                  }, [
                    $.status === "queued" ? (n(), s("span", ud, [
                      p(m(R), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      g[16] || (g[16] = q("Waiting", -1))
                    ])) : (n(), s("span", {
                      key: 1,
                      class: "cell-state fail",
                      "data-error-kind": $.error?.kind,
                      title: $.error?.kind
                    }, [
                      p(m(R), { icon: "tabler:alert-triangle" }),
                      q(i($.error?.message), 1)
                    ], 8, rd))
                  ], 8, dd)) : (n(!0), s(M, { key: 1 }, O(H.value, (T) => (n(), s("td", {
                    key: T,
                    "data-label": T
                  }, [
                    t("span", {
                      class: Q(["cell", te(j($, T))]),
                      title: ye(j($, T)?.value)
                    }, i(j($, T)?.failed ? "Failed" : j($, T) ? P(j($, T).score) : "—"), 11, vd)
                  ], 8, cd))), 128))
                ], 2),
                G.value === $.case_id ? (n(), s("tr", md, [
                  t("td", {
                    colspan: H.value.length + 1
                  }, [
                    $.error ? (n(), s("p", {
                      key: 0,
                      class: "muted",
                      "data-error-kind": $.error.kind,
                      title: $.error.kind
                    }, i($.error.message), 9, bd)) : y("", !0),
                    p(Re, {
                      node: m(Te)($.scores.map((T) => T.field))
                    }, {
                      default: me(({ index: T }) => [
                        (n(!0), s(M, null, O([$.scores[T]], (F) => (n(), s("dl", {
                          key: F.field,
                          class: "compare"
                        }, [
                          t("dt", fd, i(F.field.split(".").at(-1)), 1),
                          t("dd", null, [
                            t("span", {
                              class: Q(["cell", te(F)])
                            }, i(F.failed ? "Failed" : P(F.score)), 3),
                            t("div", gd, [
                              g[17] || (g[17] = t("span", { class: "cmp-label" }, "Expected", -1)),
                              p(Be, {
                                value: F.expected
                              }, null, 8, ["value"])
                            ]),
                            t("div", hd, [
                              g[18] || (g[18] = t("span", { class: "cmp-label" }, "Extracted", -1)),
                              F.failed ? (n(), J(Ut, {
                                key: 0,
                                error: F.error
                              }, null, 8, ["error"])) : (n(), J(Be, {
                                key: 1,
                                value: F.value
                              }, null, 8, ["value"]))
                            ]),
                            F.failed ? y("", !0) : (n(), s("span", yd, [
                              t("span", {
                                class: Q(["chip", F.verified ? "primary" : "warn"])
                              }, [
                                p(m(R), {
                                  icon: F.verified ? "tabler:shield-check" : "tabler:shield-question"
                                }, null, 8, ["icon"]),
                                q(i(F.verified ? "Verified" : "Unverified"), 1)
                              ], 2)
                            ]))
                          ])
                        ]))), 128))
                      ]),
                      _: 2
                    }, 1032, ["node"]),
                    t("p", kd, i($.tokens.toLocaleString()) + " tokens · " + i(de($.duration_ms)), 1)
                  ], 8, pd)
                ])) : y("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : y("", !0),
      t("section", $d, [
        t("header", xd, [
          g[20] || (g[20] = t("h2", { class: "block-title" }, "Cases", -1)),
          t("span", wd, i(e.cases.length), 1),
          p(m(ue), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !e.fields.length,
            onClick: g[2] || (g[2] = ($) => u.value = !u.value)
          }, null, 8, ["disabled"])
        ]),
        u.value ? (n(), s("form", {
          key: 0,
          class: "case-form",
          onSubmit: ve(w, ["prevent"])
        }, [
          t("label", null, [
            g[21] || (g[21] = q("Document", -1)),
            p(Nt, {
              value: b.value,
              onSelect: g[3] || (g[3] = ($) => {
                b.value = $;
              })
            }, null, 8, ["value"])
          ]),
          g[24] || (g[24] = t("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          p(Re, { node: I.value }, {
            default: me(({ index: $ }) => [
              (n(!0), s(M, null, O([e.fields[$]], (T) => (n(), s("label", {
                key: m(K)(T)
              }, [
                t("span", Vd, i(T.name), 1),
                T.type === "boolean" ? z((n(), s("select", {
                  key: 0,
                  "onUpdate:modelValue": (F) => k.value[m(K)(T)] = F
                }, [...g[22] || (g[22] = [
                  t("option", { value: "" }, "Not stated", -1),
                  t("option", { value: "true" }, "Yes", -1),
                  t("option", { value: "false" }, "No", -1)
                ])], 8, Sd)), [
                  [ze, k.value[m(K)(T)]]
                ]) : T.type === "enum" ? z((n(), s("select", {
                  key: 1,
                  "onUpdate:modelValue": (F) => k.value[m(K)(T)] = F
                }, [
                  g[23] || (g[23] = t("option", { value: "" }, "Not stated", -1)),
                  (n(!0), s(M, null, O(T.enum_values, (F) => (n(), s("option", { key: F }, i(F), 1))), 128))
                ], 8, Cd)), [
                  [ze, k.value[m(K)(T)]]
                ]) : T.type === "object" || T.type === "list" ? z((n(), s("textarea", {
                  key: 2,
                  "onUpdate:modelValue": (F) => k.value[m(K)(T)] = F,
                  rows: "2",
                  placeholder: T.type === "list" ? '["first", "second"]' : '{"key": "value"}'
                }, null, 8, Ed)), [
                  [_, k.value[m(K)(T)]]
                ]) : z((n(), s("input", {
                  key: 3,
                  "onUpdate:modelValue": (F) => k.value[m(K)(T)] = F,
                  type: T.type === "number" ? "number" : T.type === "date" ? "date" : "text",
                  placeholder: "Not stated"
                }, null, 8, qd)), [
                  [al, k.value[m(K)(T)]]
                ])
              ]))), 128))
            ]),
            _: 1
          }, 8, ["node"]),
          d.value ? (n(), s("p", Nd, i(d.value), 1)) : y("", !0),
          t("div", Ud, [
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
              onClick: g[4] || (g[4] = ($) => u.value = !1)
            })
          ])
        ], 32)) : y("", !0),
        e.fields.length ? !e.cases.length && !u.value ? (n(), s("p", Ad, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : e.cases.length ? (n(), s("div", Rd, [
          t("table", Bd, [
            g[25] || (g[25] = t("thead", null, [
              t("tr", null, [
                t("th", null, "Document"),
                t("th", null, "Expected values"),
                t("th")
              ])
            ], -1)),
            t("tbody", null, [
              (n(!0), s(M, null, O(e.cases, ($) => (n(), s("tr", {
                key: $.id
              }, [
                t("td", null, [
                  p(m(R), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  q(" " + i($.upload_name), 1)
                ]),
                t("td", null, [
                  p(Re, { node: I.value }, {
                    default: me(({ index: T }) => [
                      t("div", Ld, [
                        t("strong", null, i(e.fields[T].name), 1),
                        m(gt)($.expected, m(K)(e.fields[T])) !== void 0 ? (n(), J(Be, {
                          key: 0,
                          value: m(gt)($.expected, m(K)(e.fields[T]))
                        }, null, 8, ["value"])) : (n(), s("span", Td, "Not stated"))
                      ])
                    ]),
                    _: 2
                  }, 1032, ["node"])
                ]),
                t("td", Dd, [
                  t("button", {
                    type: "button",
                    class: "kx-iconbtn kx-focus-outline",
                    "aria-label": `Remove case ${$.upload_name}`,
                    disabled: e.saving,
                    onClick: (T) => v("delete-case", $.id)
                  }, [
                    p(m(R), { icon: "tabler:trash" })
                  ], 8, Pd)
                ])
              ]))), 128))
            ])
          ])
        ])) : y("", !0) : (n(), s("p", Md, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      e.evaluations.length ? (n(), s("section", Fd, [
        t("header", Id, [
          g[26] || (g[26] = t("h2", { class: "block-title" }, "History", -1)),
          t("span", Od, i(e.evaluations.length), 1)
        ]),
        t("ul", jd, [
          (n(!0), s(M, null, O(e.evaluations, ($) => (n(), s("li", {
            key: $.id
          }, [
            t("button", {
              type: "button",
              class: Q({ active: a.value?.id === $.id }),
              "aria-current": a.value?.id === $.id,
              onClick: (T) => v("open", $.id)
            }, [
              t("span", {
                class: "badge",
                "data-status": $.status
              }, i(fe[$.status]), 9, Wd),
              t("span", null, "Revision " + i($.config_revision), 1),
              t("span", Gd, i(m(He)($.created_at)), 1),
              t("strong", Kd, i($.status === "completed" || $.status === "partial" ? P(m(Se)($)) : "—"), 1)
            ], 10, zd)
          ]))), 128))
        ])
      ])) : y("", !0)
    ]));
  }
}), Qd = { class: "section-head" }, Jd = { class: "muted" }, Yd = {
  key: 0,
  class: "empty"
}, Xd = {
  key: 1,
  class: "table-scroll"
}, Zd = { class: "metric-table runs-table" }, _d = ["aria-label", "aria-expanded", "onClick"], eu = { class: "caller" }, tu = {
  key: 0,
  class: "muted"
}, lu = ["data-status"], au = {
  class: "num",
  "data-label": "Time"
}, nu = {
  class: "num",
  "data-label": "Tokens"
}, su = {
  class: "muted",
  "data-label": "Expires"
}, ou = {
  key: 0,
  class: "result-detail"
}, iu = { colspan: "6" }, du = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(e) {
    const o = A(), l = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (v, u) => (n(), s(M, null, [
      t("div", Qd, [
        u[0] || (u[0] = t("h2", null, "Recent runs", -1)),
        t("span", Jd, "Runs expire after " + i(e.retention), 1)
      ]),
      e.runs.length ? (n(), s("div", Xd, [
        t("table", Zd, [
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
            (n(!0), s(M, null, O(e.runs, (b) => (n(), s(M, {
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
                    p(m(R), {
                      icon: o.value === b.id ? "tabler:chevron-down" : "tabler:chevron-right"
                    }, null, 8, ["icon"]),
                    q(i(m(He)(b.created_at)), 1)
                  ], 8, _d)
                ]),
                t("td", null, [
                  t("span", eu, [
                    p(m(R), {
                      icon: l[b.caller].icon
                    }, null, 8, ["icon"]),
                    q(i(l[b.caller].label), 1)
                  ]),
                  b.result.page_range ? (n(), s("span", tu, " · Pages " + i(b.result.page_range.first) + "–" + i(b.result.page_range.last), 1)) : y("", !0)
                ]),
                t("td", null, [
                  t("span", {
                    class: "badge",
                    "data-status": b.status
                  }, i(b.status === "completed" ? "Completed" : b.status === "partial" ? "Partial" : "Failed"), 9, lu)
                ]),
                t("td", au, i((b.duration_ms / 1e3).toFixed(1)) + "s", 1),
                t("td", nu, i(Number(b.tokens).toLocaleString()), 1),
                t("td", su, i(m(He)(b.expires_at)), 1)
              ]),
              o.value === b.id ? (n(), s("tr", ou, [
                t("td", iu, [
                  p(Mt, {
                    fields: b.result.fields,
                    "page-range": b.result.page_range
                  }, null, 8, ["fields", "page-range"])
                ])
              ])) : y("", !0)
            ], 64))), 128))
          ])
        ])
      ])) : (n(), s("p", Yd, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), uu = {
  key: 0,
  role: "alert",
  class: "error banner"
}, ru = /* @__PURE__ */ W({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const l = e, v = o, u = A(), b = A("");
    return Ne(async () => {
      try {
        await Je("kickside-share", { timeoutMs: 8e3 });
      } catch (x) {
        b.value = `Sharing is unavailable: ${x instanceof Error ? x.message : String(x)}`;
        return;
      }
      const k = document.createElement("kickside-share"), d = encodeURIComponent(l.id);
      k.setAttribute("config", JSON.stringify({ resource_id: l.id, title: l.title, access_url: `/api/v1/component-access/grants/${d}`, share_url: `/api/v1/component-access/share/${d}` })), k.style.display = "block", k.addEventListener("close", () => v("close")), u.value?.appendChild(k);
    }), (k, d) => (n(), s("div", {
      ref_key: "host",
      ref: u
    }, [
      b.value ? (n(), s("p", uu, i(b.value), 1)) : y("", !0)
    ], 512));
  }
}), cu = { class: "docscout" }, vu = { class: "toolbar" }, mu = { class: "toolbar-lead" }, pu = { class: "crumb-row" }, bu = { class: "crumb" }, fu = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, gu = ["id", "aria-selected", "aria-controls", "onClick"], hu = { class: "toolbar-side" }, yu = { class: "stats" }, ku = ["title"], $u = {
  key: 2,
  class: "unsaved"
}, xu = {
  key: 0,
  class: "banner row wrap",
  role: "status"
}, wu = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Vu = {
  key: 3,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Su = ["id", "aria-labelledby"], Cu = /* @__PURE__ */ W({
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
    const l = e, v = o, u = A(), b = A(!1), k = A("Builder"), d = A(ht()), x = A(""), w = A(""), E = U(() => l.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    be(k, () => {
      u.value && (u.value.scrollTop = 0);
    }, { flush: "post" });
    const c = A(), a = A(), f = U(() => l.snapshot.can_edit && c.value !== l.snapshot.expected_revision), B = U(() => f.value && a.value !== l.snapshot.expected_revision);
    function S(P) {
      return x.value === P.title && w.value === (P.description ?? "") && yl(d.value, P.config);
    }
    function N() {
      const P = l.snapshot;
      d.value = structuredClone(pt(P.config ?? ht())), x.value = P.title, w.value = P.description ?? "", c.value = P.expected_revision, a.value = void 0;
    }
    be(() => l.snapshot, (P, D) => {
      E.value.includes(k.value) || (k.value = E.value[0]), !(D && P.id === D.id && P.can_edit && D.can_edit && !S(D) && !S(P)) && N();
    }, { immediate: !0 });
    const H = U(() => l.snapshot.can_edit && !S(l.snapshot)), I = U(() => hl(d.value)), j = U(() => Object.keys(ke).filter((P) => Ge(d.value, P)).length);
    function G() {
      v("save", { title: x.value, description: w.value, config: structuredClone(pt(d.value)), expected_revision: c.value });
    }
    return (P, D) => (n(), s("main", cu, [
      t("div", vu, [
        t("div", mu, [
          t("span", pu, [
            e.back ? (n(), s("button", {
              key: 0,
              type: "button",
              class: "kx-iconbtn kx-focus-outline",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: D[0] || (D[0] = (L) => v("back"))
            }, [
              p(m(R), { icon: "tabler:arrow-left" })
            ])) : y("", !0),
            t("span", bu, i(e.snapshot.title), 1)
          ]),
          t("nav", fu, [
            (n(!0), s(M, null, O(E.value, (L) => (n(), s("button", {
              id: `tab-${L}`,
              key: L,
              role: "tab",
              "aria-selected": k.value === L,
              "aria-controls": `panel-${L}`,
              onClick: (de) => k.value = L
            }, i(L), 9, gu))), 128))
          ])
        ]),
        t("div", hu, [
          e.snapshot.can_share ? (n(), J(m(ue), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: D[1] || (D[1] = (L) => b.value = !0)
          }, {
            default: me(() => [
              p(m(R), { icon: "tabler:share" }),
              D[11] || (D[11] = t("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : y("", !0),
          t("span", yu, [
            q(i(e.snapshot.field_count) + " " + i(e.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e.snapshot.can_edit ? (n(), s(M, { key: 0 }, [
              q(" · " + i(j.value) + " steps · revision " + i(e.snapshot.expected_revision), 1)
            ], 64)) : (n(), s(M, { key: 1 }, [
              q(" · Read access")
            ], 64))
          ]),
          e.snapshot.can_edit ? (n(), s(M, { key: 1 }, [
            f.value && !B.value ? (n(), J(m(ue), {
              key: 0,
              label: "Reload saved",
              severity: "secondary",
              size: "small",
              onClick: N
            })) : y("", !0),
            I.value ? (n(), s("span", {
              key: 1,
              class: "invalid",
              role: "alert",
              title: I.value
            }, [
              p(m(R), { icon: "tabler:alert-circle" }),
              q(i(I.value), 1)
            ], 8, ku)) : H.value ? (n(), s("span", $u, "Unsaved")) : y("", !0),
            p(m(ue), {
              label: "Save",
              size: "small",
              loading: e.saving,
              disabled: !H.value || !!I.value || !x.value.trim(),
              onClick: G
            }, null, 8, ["loading", "disabled"])
          ], 64)) : y("", !0)
        ])
      ]),
      B.value ? (n(), s("div", xu, [
        t("span", null, "Saved configuration changed to revision " + i(e.snapshot.expected_revision) + ". Your edits are kept.", 1),
        p(m(ue), {
          label: "Reload saved",
          severity: "secondary",
          size: "small",
          onClick: N
        }),
        p(m(ue), {
          label: "Keep editing",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: D[2] || (D[2] = (L) => a.value = e.snapshot.expected_revision)
        })
      ])) : y("", !0),
      e.error ? (n(), s("p", wu, i(e.error), 1)) : y("", !0),
      b.value ? (n(), J(ru, {
        key: 2,
        id: e.snapshot.id,
        title: e.snapshot.title,
        onClose: D[3] || (D[3] = (L) => b.value = !1)
      }, null, 8, ["id", "title"])) : y("", !0),
      k.value === "Builder" && e.snapshot.can_edit ? (n(), s("div", Vu, [
        p(Mo, {
          title: x.value,
          "onUpdate:title": D[4] || (D[4] = (L) => x.value = L),
          description: w.value,
          "onUpdate:description": D[5] || (D[5] = (L) => w.value = L),
          config: d.value,
          retention: e.snapshot.retention,
          result: e.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), s("div", {
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
          k.value === "Test" ? (n(), J(yi, {
            key: 0,
            result: e.result,
            retention: e.snapshot.retention,
            running: e.running,
            "can-run": e.snapshot.field_count > 0,
            onRun: D[6] || (D[6] = (L) => v("run", L))
          }, null, 8, ["result", "retention", "running", "can-run"])) : y("", !0),
          k.value === "Evals" && e.snapshot.can_edit ? (n(), J(Hd, {
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
            onAddCase: D[7] || (D[7] = (L) => v("add-case", L)),
            onDeleteCase: D[8] || (D[8] = (L) => v("delete-case", L)),
            onEvaluate: D[9] || (D[9] = (L) => v("evaluate")),
            onOpen: D[10] || (D[10] = (L) => v("open-evaluation", L))
          }, null, 8, ["cases", "added-case-id", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : y("", !0),
          k.value === "Runs" ? (n(), J(du, {
            key: 2,
            runs: e.snapshot.runs,
            retention: e.snapshot.retention
          }, null, 8, ["runs", "retention"])) : y("", !0)
        ], 8, Su)
      ], 512))
    ]));
  }
}), Eu = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, qu = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Du = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(e, { emit: o }) {
    const l = e, v = o, u = A(), b = A(""), k = A(!1), d = A(!1), x = A(!1), w = A(), E = A(null), c = A([]), a = A();
    let f = [], B = 0, S = 0, N = 0, H;
    const I = (V) => V instanceof Error ? V.message : String(V), j = (V) => V === B;
    async function G(V, g) {
      const $ = ++N;
      g && (H = g);
      const T = () => j(V) && $ === N;
      try {
        const F = l.id, Ue = await he.evaluations(F);
        if (!T()) return;
        c.value = Ue;
        const ge = H ?? Ue[0]?.id;
        if (ge) {
          const De = await he.evaluation(F, ge);
          if (!T() || De.id !== (H ?? ge)) return;
          a.value = De;
        }
      } catch (F) {
        T() && (b.value = I(F));
      }
    }
    async function P(V) {
      const g = ++S, $ = () => j(V) && g === S;
      if (!l.id) {
        b.value = "No extractor selected.";
        return;
      }
      try {
        const T = await he.get(l.id);
        if (!$()) return;
        u.value = T, b.value = "", T.can_edit && await G(V);
      } catch (T) {
        $() && (b.value = I(T));
      }
    }
    be(() => l.id, (V, g) => {
      B++, H = void 0, f.forEach((T) => T()), f = [], w.value = void 0, u.value = void 0, E.value = null, c.value = [], a.value = void 0, b.value = "";
      const $ = B;
      l.id && (f = [bt(`component.${l.id}`, () => P($)), bt(`docscout.runs.${l.id}`, () => P($))]), g !== void 0 && P($);
    }, { immediate: !0 }), nl(() => P(B)), kt(() => {
      B++, f.forEach((V) => V());
    });
    async function D(V) {
      const g = B;
      k.value = !0, b.value = "";
      try {
        const $ = await V();
        if (j(g))
          return await P(g), $;
      } catch ($) {
        j(g) && (b.value = I($));
      } finally {
        k.value = !1;
      }
    }
    const L = (V) => D(() => he.update(l.id, V));
    async function de(V) {
      const g = B, $ = await D(() => he.addCase(l.id, V));
      $ && j(g) && (w.value = $.id);
    }
    const ye = (V) => D(() => he.deleteCase(l.id, V));
    async function te(V) {
      const g = B;
      d.value = !0, b.value = "";
      try {
        const $ = await he.run(l.id, V);
        j(g) && (E.value = $, await P(g));
      } catch ($) {
        j(g) && (b.value = I($));
      } finally {
        d.value = !1;
      }
    }
    async function oe() {
      const V = B;
      x.value = !0, b.value = "";
      try {
        const { eval_id: g } = await he.evaluate(l.id);
        j(V) && await G(V, g);
      } catch (g) {
        j(V) && (b.value = I(g));
      } finally {
        x.value = !1;
      }
    }
    function fe(V) {
      G(B, V);
    }
    return (V, g) => u.value ? (n(), J(Cu, {
      key: 0,
      snapshot: u.value,
      "added-case-id": w.value,
      saving: k.value,
      running: d.value,
      starting: x.value,
      result: E.value,
      evaluations: c.value,
      evaluation: a.value,
      error: b.value,
      back: e.back,
      onBack: g[0] || (g[0] = ($) => v("back")),
      onRun: te,
      onSave: L,
      onAddCase: de,
      onDeleteCase: ye,
      onEvaluate: oe,
      onOpenEvaluation: fe
    }, null, 8, ["snapshot", "added-case-id", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : b.value ? (n(), s("p", Eu, i(b.value), 1)) : (n(), s("p", qu, "Loading Docscout…"));
  }
});
export {
  Du as _,
  He as w
};
