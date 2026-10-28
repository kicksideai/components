import { defineComponent as Q, useModel as fe, openBlock as n, createElementBlock as o, withModifiers as ke, createElementVNode as e, mergeModels as $e, computed as N, withKeys as Te, unref as h, normalizeClass as W, createVNode as r, toDisplayString as i, Fragment as S, renderList as O, createCommentVNode as p, createTextVNode as $, createBlock as Z, ref as A, watch as ie, withDirectives as j, vModelText as Y, vModelSelect as ye, onMounted as Ce, normalizeStyle as be, onBeforeUnmount as Oe, nextTick as Xe, vShow as Ve, vModelDynamic as Ye, toRaw as Re } from "vue";
import { loadByTagName as Fe, on as Ze } from "@wippy-fe/proxy";
import { i as he, h as ze, t as Se, g as oe, j as qe, k as _e, m as Pe, l as We, o as Ae, p as el, q as ll, r as tl, v as al, w as De, x as nl, y as xe, z as sl, A as ol, s as me, n as Le, C as il, D as dl, c as ae } from "./index-BBnkhKOj.js";
import { Icon as L } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const pe = (t) => t.status === "completed" || t.status === "failed", ue = (t) => t.metrics.length ? t.metrics.reduce((c, s) => c + s.accuracy, 0) / t.metrics.length : 0, ul = ["aria-checked", "aria-label", "disabled"], I = /* @__PURE__ */ Q({
  __name: "Toggle",
  props: /* @__PURE__ */ $e({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const c = fe(t, "modelValue");
    return (s, m) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": c.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: m[0] || (m[0] = ke((b) => c.value = !c.value, ["stop"]))
    }, [...m[1] || (m[1] = [
      e("span", null, null, -1)
    ])], 8, ul));
  }
}), rl = ["aria-label"], cl = { class: "node-icon" }, ml = { class: "node-main" }, vl = { class: "node-title" }, bl = { class: "node-summary" }, pl = {
  key: 0,
  class: "chips"
}, yl = {
  key: 1,
  class: "trace-line"
}, fl = { class: "node-side" }, gl = {
  key: 0,
  class: "chip model"
}, re = /* @__PURE__ */ Q({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = t, m = c, b = N(() => he(s.config, s.stage)), y = N(() => s.config.stages[s.stage].model), g = N({ get: () => b.value, set: (V) => {
      s.config.stages[s.stage].enabled = V;
    } }), w = N(() => {
      const V = s.config, l = V.stages;
      switch (s.stage) {
        case "map":
          return V.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...V.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((a) => ({ text: Se(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return V.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return ze(V).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), B = (V) => [`${(V.duration_ms / 1e3).toFixed(1)}s`, `${(V.input_tokens + V.output_tokens).toLocaleString()} tokens`, V.queries?.length ? `${V.queries.length} queries` : "", V.message ?? ""].filter(Boolean).join(" · ");
    return (V, l) => (n(), o("div", {
      class: W(["node", { active: t.active, off: !b.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(oe)[t.stage],
      onClick: l[1] || (l[1] = (a) => m("select")),
      onKeydown: [
        l[2] || (l[2] = Te((a) => m("select"), ["enter"])),
        l[3] || (l[3] = Te(ke((a) => m("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", cl, [
        r(h(L), {
          icon: h(qe)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", ml, [
        e("span", vl, i(h(oe)[t.stage]), 1),
        e("span", bl, i(b.value ? h(_e)(t.stage, t.config) : "Off"), 1),
        b.value && w.value.length ? (n(), o("span", pl, [
          (n(!0), o(S, null, O(w.value, (a) => (n(), o("span", {
            key: a.text,
            class: W(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        t.trace ? (n(), o("span", yl, [
          r(h(L), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          $(i(B(t.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", fl, [
        b.value && y.value ? (n(), o("span", gl, i(h(Pe)(y.value)), 1)) : p("", !0),
        t.stage !== "extract" && !t.readonly ? (n(), Z(I, {
          key: 1,
          modelValue: g.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => g.value = a),
          label: `Enable ${h(oe)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, rl));
  }
}), hl = ["aria-labelledby"], kl = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ve = /* @__PURE__ */ Q({
  __name: "Segmented",
  props: /* @__PURE__ */ $e({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const c = t, s = fe(t, "modelValue"), m = A([]);
    function b(y, g) {
      const w = c.options.length - 1, B = { ArrowRight: g + 1, ArrowDown: g + 1, ArrowLeft: g - 1, ArrowUp: g - 1, Home: 0, End: w }[y.key];
      if (B === void 0) return;
      y.preventDefault();
      const V = (B + c.options.length) % c.options.length;
      s.value = c.options[V].value, m.value[V]?.focus();
    }
    return (y, g) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (n(!0), o(S, null, O(t.options, (w, B) => (n(), o("button", {
        key: w.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: m,
        type: "button",
        role: "radio",
        "aria-checked": s.value === w.value,
        tabindex: s.value === w.value ? 0 : -1,
        disabled: t.disabled,
        onClick: (V) => s.value = w.value,
        onKeydown: (V) => b(V, B)
      }, i(w.label), 41, kl))), 128))
    ], 8, hl));
  }
}), $l = ["disabled"], xl = { class: "grid" }, wl = ["aria-invalid"], Vl = ["value"], Sl = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Cl = { key: 1 }, ql = ["value"], Ul = { key: 2 }, Ml = ["value"], El = { class: "grid" }, Nl = {
  key: 3,
  class: "field-note"
}, Bl = { class: "label-block" }, Tl = {
  key: 4,
  class: "field-error"
}, Rl = { id: "docscout-groups" }, Al = ["value"], Dl = { key: 5 }, Ll = ["placeholder"], Ol = { class: "toggle-row" }, Fl = { class: "toggle-row" }, zl = /* @__PURE__ */ Q({
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
  setup(t, { emit: c }) {
    const s = t, m = c, b = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], y = b.filter((V) => ["text", "number", "boolean", "date", "object"].includes(V.value)), g = N(() => We(s.field, s.otherNames)), w = N(() => s.field.type !== "boolean" && s.field.type !== "enum" && !(s.field.type === "list" && s.field.item_type === "boolean"));
    ie(() => [s.field.type, s.field.item_type], () => {
      !Ae(s.field) && s.field.enum_values.length && (s.field.enum_values = []);
    });
    function B(V) {
      s.field.enum_values = [...new Set(V.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (V, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", xl, [
        e("label", null, [
          l[14] || (l[14] = $("Name", -1)),
          j(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (a) => t.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!g.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, wl), [
            [
              Y,
              t.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          l[15] || (l[15] = $("Type", -1)),
          j(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (a) => t.field.type = a),
            "aria-label": "Field type"
          }, [
            (n(), o(S, null, O(b, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, Vl)), 64))
          ], 512), [
            [ye, t.field.type]
          ])
        ])
      ]),
      g.value ? (n(), o("p", Sl, [
        r(h(L), { icon: "tabler:alert-circle" }),
        $(i(g.value), 1)
      ])) : p("", !0),
      t.field.type === "list" ? (n(), o("label", Cl, [
        l[16] || (l[16] = $("Each item is", -1)),
        j(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => t.field.item_type = a)
        }, [
          (n(!0), o(S, null, O(h(y), (a) => (n(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, ql))), 128))
        ], 512), [
          [ye, t.field.item_type]
        ])
      ])) : p("", !0),
      h(Ae)(t.field) ? (n(), o("label", Ul, [
        $(i(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: B
        }, null, 40, Ml),
        e("small", null, i(t.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : p("", !0),
      e("label", null, [
        l[17] || (l[17] = $("Description", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (a) => t.field.description = a),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [Y, t.field.description]
        ]),
        l[18] || (l[18] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      l[34] || (l[34] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[19] || (l[19] = $("Search hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[4] || (l[4] = (a) => t.field.search_hints = a),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [Y, t.field.search_hints]
        ]),
        l[20] || (l[20] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", El, [
        e("label", null, [
          l[22] || (l[22] = $("Strategy", -1)),
          j(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (a) => t.field.strategy = a)
          }, [...l[21] || (l[21] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [ye, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[23] || (l[23] = $("Chunks to read", -1)),
          j(e("input", {
            "onUpdate:modelValue": l[6] || (l[6] = (a) => t.field.chunks = a),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              Y,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[24] || (l[24] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (n(), o("p", Nl, [
        r(h(L), { icon: "tabler:info-circle" }),
        l[25] || (l[25] = $("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Bl, [
        l[26] || (l[26] = e("span", { id: "within-label" }, "Search within", -1)),
        r(ve, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => t.field.search_within = a),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, i(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (n(), o("p", Tl, [
        r(h(L), { icon: "tabler:alert-circle" }),
        l[27] || (l[27] = $("Turn on Map the document to read sections.", -1))
      ])) : p("", !0),
      e("label", null, [
        l[28] || (l[28] = $("Group", -1)),
        j(e("input", {
          "onUpdate:modelValue": l[8] || (l[8] = (a) => t.field.group = a),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            Y,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Rl, [
          (n(!0), o(S, null, O(t.groups, (a) => (n(), o("option", {
            key: a,
            value: a
          }, null, 8, Al))), 128))
        ]),
        l[29] || (l[29] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      l[35] || (l[35] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[30] || (l[30] = $("Validation hints", -1)),
        j(e("textarea", {
          "onUpdate:modelValue": l[9] || (l[9] = (a) => t.field.validation_hints = a),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [Y, t.field.validation_hints]
        ])
      ]),
      w.value ? (n(), o("label", Dl, [
        l[31] || (l[31] = $("Expected format", -1)),
        j(e("input", {
          "onUpdate:modelValue": l[10] || (l[10] = (a) => t.field.expected_format = a),
          placeholder: h(el)(t.field)
        }, null, 8, Ll), [
          [Y, t.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Ol, [
        l[32] || (l[32] = e("span", null, [
          $("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        r(I, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => t.field.required = a),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Fl, [
        l[33] || (l[33] = e("span", null, [
          $("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        r(I, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => t.field.evidence_required = a),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? p("", !0) : (n(), o("button", {
        key: 6,
        type: "button",
        class: "btn danger-text",
        onClick: l[13] || (l[13] = (a) => m("remove"))
      }, "Remove field"))
    ], 8, $l));
  }
}), Pl = ["value", "capability", "aria-labelledby"], Wl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, jl = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, le = /* @__PURE__ */ Q({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = c, m = A(!!customElements.get("wc-model-picker")), b = A("");
    Ce(async () => {
      if (!m.value)
        try {
          await Fe("wc-model-picker", { timeoutMs: 8e3 }), m.value = !0;
        } catch (g) {
          b.value = g instanceof Error ? g.message : String(g);
        }
    });
    function y(g) {
      const w = g.detail;
      typeof w == "string" && s("select", w);
    }
    return (g, w) => m.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: y
    }, null, 40, Pl)) : b.value ? (n(), o("p", Wl, "Could not load model picker: " + i(b.value), 1)) : (n(), o("span", jl, "Loading models…"));
  }
}), Il = { class: "slider" }, Ql = { class: "slider-head" }, Kl = { class: "slider-value" }, Hl = ["aria-label", "aria-valuetext", "disabled"], Jl = {
  key: 0,
  class: "slider-hints"
}, Gl = { key: 1 }, ce = 1e3, G = /* @__PURE__ */ Q({
  __name: "Slider",
  props: /* @__PURE__ */ $e({
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
    const c = t, s = fe(t, "modelValue"), m = N(() => c.percent ? `${Math.round(s.value * 100)}%` : `${s.value.toLocaleString()}${c.unit ? ` ${c.unit}` : ""}`), b = (w) => c.log ? Math.log(w / c.min) / Math.log(c.max / c.min) * ce : (w - c.min) / (c.max - c.min) * ce;
    function y(w) {
      const B = c.log ? c.min * Math.pow(c.max / c.min, w / ce) : c.min + (c.max - c.min) * w / ce, V = Math.round(B / c.step) * c.step;
      return Math.min(c.max, Math.max(c.min, Number(V.toFixed(4))));
    }
    const g = N({ get: () => Math.round(b(s.value)), set: (w) => {
      s.value = y(w);
    } });
    return (w, B) => (n(), o("div", Il, [
      e("div", Ql, [
        e("span", null, i(t.label), 1),
        e("output", Kl, i(m.value), 1)
      ]),
      j(e("input", {
        "onUpdate:modelValue": B[0] || (B[0] = (V) => g.value = V),
        type: "range",
        min: "0",
        max: ce,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": m.value,
        disabled: t.disabled,
        style: be({ "--fill": `${g.value / ce * 100}%` })
      }, null, 12, Hl), [
        [
          Y,
          g.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (n(), o("div", Jl, [
        e("span", null, i(t.hints[0]), 1),
        e("span", null, i(t.hints[1]), 1)
      ])) : p("", !0),
      t.note ? (n(), o("small", Gl, i(t.note), 1)) : p("", !0)
    ]));
  }
}), Xl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Yl = { class: "fd-track" }, Zl = { class: "fd-node" }, _l = { class: "fd-dots" }, et = { class: "fd-more" }, lt = { class: "fd-node goal" }, tt = /* @__PURE__ */ Q({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const c = t;
    return (s, m) => (n(), o("figure", Xl, [
      e("div", Yl, [
        m[2] || (m[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(S, null, O(Math.min(c.rounds, 8), (b) => (n(), o(S, { key: b }, [
          m[0] || (m[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Zl, [
            e("span", null, "R" + i(b), 1),
            e("span", _l, [
              (n(!0), o(S, null, O(Math.min(c.extra, 6), (y) => (n(), o("i", { key: y }))), 128))
            ])
          ])
        ], 64))), 128)),
        c.rounds > 8 ? (n(), o(S, { key: 0 }, [
          m[1] || (m[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", et, "+" + i(c.rounds - 8), 1)
        ], 64)) : p("", !0),
        m[3] || (m[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", lt, "≥ " + i(Math.round(c.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, i(c.rounds ? `One pass, then up to ${c.rounds} rounds with up to ${c.extra} new queries each, stopping as soon as confidence reaches ${Math.round(c.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), at = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, nt = { class: "fd-grid" }, st = { class: "fd-node solid" }, ot = { class: "fd-node" }, it = { class: "fd-node" }, dt = { class: "fd-node goal" }, ut = /* @__PURE__ */ Q({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const c = t, s = N(() => Math.min(c.queries * c.perQuery, c.cap));
    return (m, b) => (n(), o("figure", at, [
      e("div", nt, [
        e("span", st, [
          e("b", null, i(t.fields), 1),
          $(" field" + i(t.fields === 1 ? "" : "s"), 1),
          e("small", null, i(t.parallel) + " at a time", 1)
        ]),
        e("span", ot, [
          e("b", null, i(t.queries), 1),
          b[0] || (b[0] = $(" queries", -1)),
          b[1] || (b[1] = e("small", null, "per field", -1))
        ]),
        e("span", it, [
          e("b", null, i(t.perQuery), 1),
          b[2] || (b[2] = $(" chunks", -1)),
          b[3] || (b[3] = e("small", null, "per query", -1))
        ]),
        e("span", dt, [
          e("b", null, i(s.value), 1),
          b[4] || (b[4] = $(" chunks", -1)),
          e("small", null, i(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(s.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), rt = ["disabled"], ct = { class: "muted" }, mt = { class: "toggle-row" }, vt = { class: "label-block" }, bt = { class: "toggle-row" }, pt = {
  id: "model-map",
  class: "model-role"
}, yt = {
  key: 0,
  class: "chips"
}, ft = {
  key: 1,
  class: "muted"
}, gt = { class: "toggle-row" }, ht = { class: "grid" }, kt = ["onUpdate:modelValue"], $t = ["onUpdate:modelValue"], xt = ["onUpdate:modelValue"], wt = ["onClick"], Vt = {
  key: 0,
  class: "muted"
}, St = { class: "toggle-row" }, Ct = { class: "label-block" }, qt = {
  id: "model-scout",
  class: "model-role"
}, Ut = {
  key: 2,
  class: "muted"
}, Mt = {
  key: 3,
  class: "toggle-row"
}, Et = { class: "toggle-row" }, Nt = { class: "toggle-row" }, Bt = { class: "label-block" }, Tt = {
  id: "model-deep",
  class: "model-role"
}, Rt = {
  id: "model-deep-query",
  class: "model-role"
}, At = {
  id: "model-extract",
  class: "model-role"
}, Dt = { class: "output-list" }, Lt = { class: "chip" }, Ot = {
  key: 0,
  class: "muted"
}, Ft = { class: "toggle-row" }, zt = { class: "toggle-row" }, Pt = { class: "toggle-row" }, Wt = { class: "toggle-row" }, jt = {
  id: "model-verify",
  class: "model-role"
}, It = /* @__PURE__ */ Q({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = N(() => c.config.stages), m = (V) => nl(c.stage, V), b = ll(), y = N(() => c.config.fields.filter((V) => V.strategy === "deep").length), g = N(() => c.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), w = N(() => ze(c.config));
    function B(V, l) {
      const a = s.value.scout.tools.filter((q) => q !== V);
      s.value.scout.tools = l ? [...a, V] : a;
    }
    return (V, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", ct, i(h(tl)[t.stage]), 1),
      t.stage === "map" ? (n(), o(S, { key: 0 }, [
        e("div", mt, [
          l[34] || (l[34] = e("span", null, "Stage enabled", -1)),
          r(I, {
            modelValue: s.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.map.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", vt, [
          l[35] || (l[35] = e("span", { id: "outline-label" }, "Outline", -1)),
          r(ve, {
            modelValue: s.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (a) => s.value.map.outline = a),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[36] || (l[36] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", bt, [
          l[37] || (l[37] = e("span", null, [
            $("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          r(I, {
            modelValue: s.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (a) => s.value.map.section_summaries = a),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[39] || (l[39] = e("h4", null, "Models", -1)),
        e("div", pt, [
          l[38] || (l[38] = e("span", null, "Outliner", -1)),
          r(le, {
            value: s.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (a) => s.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        l[40] || (l[40] = e("h4", null, "Fields that read sections", -1)),
        g.value.length ? (n(), o("p", yt, [
          (n(!0), o(S, null, O(g.value, (a) => (n(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (n(), o("p", ft, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      t.stage === "prefetch" ? (n(), o(S, { key: 1 }, [
        e("div", gt, [
          l[41] || (l[41] = e("span", null, "Stage enabled", -1)),
          r(I, {
            modelValue: s.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[45] || (l[45] = e("h4", null, "Queries", -1)),
        (n(!0), o(S, null, O(s.value.prefetch.queries, (a, q) => (n(), o("div", {
          key: q,
          class: "query-row"
        }, [
          e("div", ht, [
            e("label", null, [
              l[42] || (l[42] = $("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": (F) => a.name = F,
                placeholder: "Parties"
              }, null, 8, kt), [
                [Y, a.name]
              ])
            ]),
            e("label", null, [
              l[43] || (l[43] = $("Chunks", -1)),
              j(e("input", {
                "onUpdate:modelValue": (F) => a.chunks = F,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, $t), [
                [
                  Y,
                  a.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[44] || (l[44] = $("Query", -1)),
            j(e("textarea", {
              "onUpdate:modelValue": (F) => a.query = F,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, xt), [
              [Y, a.query]
            ])
          ]),
          t.readonly ? p("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (F) => s.value.prefetch.queries.splice(q, 1)
          }, "Remove query", 8, wt))
        ]))), 128)),
        s.value.prefetch.queries.length ? p("", !0) : (n(), o("p", Vt, "No fixed queries. Field search hints still run.")),
        t.readonly ? p("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[5] || (l[5] = (a) => s.value.prefetch.queries.push(h(al)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      t.stage === "scout" ? (n(), o(S, { key: 2 }, [
        e("div", St, [
          l[46] || (l[46] = e("span", null, "Stage enabled", -1)),
          r(I, {
            modelValue: s.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (a) => s.value.scout.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ct, [
          l[47] || (l[47] = e("span", { id: "mode-label" }, "Mode", -1)),
          r(ve, {
            modelValue: s.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (a) => s.value.scout.mode = a),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, i(s.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        s.value.scout.mode === "loop" ? (n(), Z(tt, {
          key: 0,
          rounds: s.value.scout.max_rounds,
          confidence: s.value.scout.target_confidence,
          extra: s.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : p("", !0),
        l[52] || (l[52] = e("h4", null, "Models", -1)),
        e("div", qt, [
          l[48] || (l[48] = e("span", null, "Scout", -1)),
          r(le, {
            value: s.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (a) => s.value.scout.model = a)
          }, null, 8, ["value"])
        ]),
        l[53] || (l[53] = e("h4", null, "Loop", -1)),
        r(G, {
          modelValue: s.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => s.value.scout.max_rounds = a),
          label: s.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: m("max_rounds").min,
          max: m("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        s.value.scout.mode === "loop" ? (n(), Z(G, {
          key: 1,
          modelValue: s.value.scout.target_confidence,
          "onUpdate:modelValue": l[10] || (l[10] = (a) => s.value.scout.target_confidence = a),
          label: "Stop at confidence",
          min: m("target_confidence").min,
          max: m("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : p("", !0),
        r(G, {
          modelValue: s.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => s.value.scout.max_extra_queries = a),
          label: s.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: m("max_extra_queries").min,
          max: m("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.scout.max_tokens,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => s.value.scout.max_tokens = a),
          label: "Scout output limit",
          min: m("max_tokens").min,
          max: m("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        s.value.scout.mode === "agent" ? (n(), o("p", Ut, "Tool budget: " + i(s.value.scout.max_rounds * s.value.scout.max_extra_queries) + " calls.", 1)) : p("", !0),
        s.value.scout.mode === "loop" ? (n(), o("div", Mt, [
          l[49] || (l[49] = e("span", null, [
            $("Drop noisy chunks"),
            e("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          r(I, {
            modelValue: s.value.scout.drop_noise,
            "onUpdate:modelValue": l[13] || (l[13] = (a) => s.value.scout.drop_noise = a),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : p("", !0),
        e("div", Et, [
          l[50] || (l[50] = e("span", null, [
            $("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          r(I, {
            modelValue: s.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (a) => s.value.scout.share_notes = a),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s.value.scout.mode === "agent" ? (n(), o(S, { key: 4 }, [
          l[51] || (l[51] = e("h4", null, "Agent tools", -1)),
          (n(!0), o(S, null, O(h(b), (a) => (n(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, i(h(Se)(a)), 1),
            r(I, {
              "model-value": s.value.scout.tools.includes(a),
              label: h(Se)(a),
              disabled: t.readonly,
              "onUpdate:modelValue": (q) => B(a, q)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      t.stage === "deep" ? (n(), o(S, { key: 3 }, [
        e("div", Nt, [
          l[54] || (l[54] = e("span", null, "Stage enabled", -1)),
          r(I, {
            modelValue: s.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (a) => s.value.deep.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r(ut, {
          fields: y.value,
          parallel: s.value.deep.parallel_fields,
          queries: s.value.deep.max_queries,
          "per-query": s.value.deep.chunks_per_query,
          cap: s.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Bt, [
          l[55] || (l[55] = e("span", { id: "read-label" }, "Reads", -1)),
          r(ve, {
            modelValue: s.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (a) => s.value.deep.read = a),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[56] || (l[56] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[59] || (l[59] = e("h4", null, "Models", -1)),
        e("div", Tt, [
          l[57] || (l[57] = e("span", null, "Analysis", -1)),
          r(le, {
            value: s.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (a) => s.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", Rt, [
          l[58] || (l[58] = e("span", null, "Query writer", -1)),
          r(le, {
            value: s.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (a) => s.value.deep.query_model = a)
          }, null, 8, ["value"])
        ]),
        l[60] || (l[60] = e("h4", null, "Reach", -1)),
        r(G, {
          modelValue: s.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (a) => s.value.deep.parallel_fields = a),
          label: "Fields at a time",
          min: m("parallel_fields").min,
          max: m("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (a) => s.value.deep.max_queries = a),
          label: "Queries per field",
          min: m("max_queries").min,
          max: m("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (a) => s.value.deep.chunks_per_query = a),
          label: "Chunks per query",
          min: m("chunks_per_query").min,
          max: m("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (a) => s.value.deep.chunk_cap = a),
          label: "Chunk cap per field",
          min: m("chunk_cap").min,
          max: m("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.deep.min_similarity,
          "onUpdate:modelValue": l[23] || (l[23] = (a) => s.value.deep.min_similarity = a),
          label: "Minimum similarity",
          min: m("min_similarity").min,
          max: m("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[61] || (l[61] = e("h4", null, "Temperature", -1)),
        r(G, {
          modelValue: s.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (a) => s.value.deep.query_temperature = a),
          label: "Query writing",
          min: m("query_temperature").min,
          max: m("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(G, {
          modelValue: s.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[25] || (l[25] = (a) => s.value.deep.analysis_temperature = a),
          label: "Analysis",
          min: m("analysis_temperature").min,
          max: m("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : p("", !0),
      t.stage === "extract" ? (n(), o(S, { key: 4 }, [
        l[64] || (l[64] = e("h4", null, "Models", -1)),
        e("div", At, [
          l[62] || (l[62] = e("span", null, "Extraction", -1)),
          r(le, {
            value: s.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (a) => s.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        l[65] || (l[65] = e("h4", null, "Field groups", -1)),
        e("ul", Dt, [
          (n(!0), o(S, null, O(w.value, (a) => (n(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Lt, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        w.value.length ? p("", !0) : (n(), o("p", Ot, "No fields yet.")),
        r(G, {
          modelValue: s.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (a) => s.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: m("max_fields_per_call").min,
          max: m("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${h(De)(t.config)} extraction call${h(De)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        r(G, {
          modelValue: s.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[28] || (l[28] = (a) => s.value.extract.max_output_tokens = a),
          label: "Output limit",
          min: m("max_output_tokens").min,
          max: m("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Ft, [
          l[63] || (l[63] = e("span", null, [
            $("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          r(I, {
            modelValue: s.value.extract.structured_output,
            "onUpdate:modelValue": l[29] || (l[29] = (a) => s.value.extract.structured_output = a),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : p("", !0),
      t.stage === "verify" ? (n(), o(S, { key: 5 }, [
        e("div", zt, [
          l[66] || (l[66] = e("span", null, "Stage enabled", -1)),
          r(I, {
            modelValue: s.value.verify.enabled,
            "onUpdate:modelValue": l[30] || (l[30] = (a) => s.value.verify.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Pt, [
          l[67] || (l[67] = e("span", null, [
            $("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          r(I, {
            modelValue: s.value.verify.check_quotes,
            "onUpdate:modelValue": l[31] || (l[31] = (a) => s.value.verify.check_quotes = a),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Wt, [
          l[68] || (l[68] = e("span", null, [
            $("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          r(I, {
            modelValue: s.value.verify.check_support,
            "onUpdate:modelValue": l[32] || (l[32] = (a) => s.value.verify.check_support = a),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s.value.verify.check_support ? (n(), o(S, { key: 0 }, [
          l[70] || (l[70] = e("h4", null, "Models", -1)),
          e("div", jt, [
            l[69] || (l[69] = e("span", null, "Checker", -1)),
            r(le, {
              value: s.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[33] || (l[33] = (a) => s.value.verify.model = a)
            }, null, 8, ["value"])
          ])
        ], 64)) : p("", !0)
      ], 64)) : p("", !0)
    ], 8, rt));
  }
}), Qt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Kt = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Ht = ["x", "y", "width"], Jt = ["x", "width"], Gt = /* @__PURE__ */ Q({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const c = t, s = N(() => Math.min(0.9, Math.max(0, c.overlap / c.size))), m = N(() => {
      const b = 100 / (3 - 2 * s.value);
      return [0, 1, 2].map((y) => ({ x: y * b * (1 - s.value), w: b }));
    });
    return (b, y) => (n(), o("figure", Qt, [
      (n(), o("svg", Kt, [
        (n(!0), o(S, null, O(m.value, (g, w) => (n(), o("rect", {
          key: w,
          x: g.x,
          y: w % 2 ? 14 : 4,
          width: g.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Ht))), 128)),
        (n(), o(S, null, O([1, 2], (g) => e("rect", {
          key: "o" + g,
          x: m.value[g].x,
          y: 4,
          width: m.value[g - 1].x + m.value[g - 1].w - m.value[g].x,
          height: "24",
          class: "shared"
        }, null, 8, Jt)), 64))
      ])),
      e("figcaption", null, i(t.size.toLocaleString()) + " tokens per chunk · " + i(t.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(s.value * 100)) + "%)", 1)
    ]));
  }
}), Xt = ["disabled"], Yt = { class: "muted" }, Zt = { class: "toggle-row" }, _t = { class: "toggle-row" }, ea = { class: "label-block" }, la = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, ta = { class: "label-block" }, aa = {
  id: "embedding-model",
  class: "model-role"
}, na = { class: "toggle-row" }, sa = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, oa = /* @__PURE__ */ Q({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = N(() => c.config.retrieval), m = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], b = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = xe("chunk_size"), g = xe("overlap"), w = xe("section_budget"), B = N(() => Math.min(g.max, s.value.chunk_size - 50));
    return (V, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", Yt, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(t.retention) + ".", 1),
      l[19] || (l[19] = e("h4", null, "Chunks", -1)),
      r(Gt, {
        size: s.value.chunk_size,
        overlap: s.value.overlap
      }, null, 8, ["size", "overlap"]),
      r(G, {
        modelValue: s.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.chunk_size = a),
        label: "Chunk size",
        min: h(y).min,
        max: h(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      r(G, {
        modelValue: s.value.overlap,
        "onUpdate:modelValue": l[1] || (l[1] = (a) => s.value.overlap = a),
        label: "Overlap",
        min: h(g).min,
        max: B.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", Zt, [
        l[11] || (l[11] = e("span", null, [
          $("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        r(I, {
          modelValue: s.value.split_headings,
          "onUpdate:modelValue": l[2] || (l[2] = (a) => s.value.split_headings = a),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", _t, [
        l[12] || (l[12] = e("span", null, [
          $("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        r(I, {
          modelValue: s.value.keep_tables,
          "onUpdate:modelValue": l[3] || (l[3] = (a) => s.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r(G, {
        modelValue: s.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.section_budget = a),
        label: "Section budget",
        min: h(w).min,
        max: h(w).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", ea, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        r(ve, {
          modelValue: s.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (a) => s.value.context = a),
          "labelled-by": "context-label",
          options: b
        }, null, 8, ["modelValue"]),
        e("small", null, i(b.find((a) => a.value === s.value.context)?.note), 1)
      ]),
      s.value.context === "generated" ? (n(), o("div", la, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        r(le, {
          value: s.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (a) => s.value.context_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", ta, [
        l[15] || (l[15] = e("span", { id: "mode-label" }, "Search mode", -1)),
        r(ve, {
          modelValue: s.value.search_mode,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => s.value.search_mode = a),
          "labelled-by": "mode-label",
          options: m
        }, null, 8, ["modelValue"]),
        e("small", null, i(m.find((a) => a.value === s.value.search_mode)?.note), 1)
      ]),
      l[22] || (l[22] = e("h4", null, "Models", -1)),
      e("div", aa, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        r(le, {
          value: s.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[8] || (l[8] = (a) => s.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      e("div", na, [
        l[17] || (l[17] = e("span", null, [
          $("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        r(I, {
          modelValue: s.value.highlighter,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => s.value.highlighter = a),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      s.value.highlighter ? (n(), o("div", sa, [
        l[18] || (l[18] = e("span", null, "Highlighter", -1)),
        r(le, {
          value: s.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[10] || (l[10] = (a) => s.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0)
    ], 8, Xt));
  }
}), ia = { class: "canvas" }, da = { class: "canvas-inner" }, ua = {
  class: "block",
  "aria-labelledby": "fields-head"
}, ra = { class: "block-head" }, ca = ["aria-expanded"], ma = { class: "count" }, va = {
  key: 0,
  class: "block-peek"
}, ba = {
  id: "fields-body",
  class: "block-body"
}, pa = {
  key: 0,
  class: "block-empty"
}, ya = {
  key: 1,
  class: "rows"
}, fa = ["onClick"], ga = { class: "row-name" }, ha = {
  key: 0,
  class: "req",
  title: "Required"
}, ka = { class: "chips" }, $a = {
  key: 1,
  class: "chip"
}, xa = ["title"], wa = { class: "chip" }, Va = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Sa = {
  key: 0,
  class: "row-actions"
}, Ca = ["disabled", "onClick"], qa = ["disabled", "onClick"], Ua = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ma = { class: "block-head" }, Ea = ["aria-expanded"], Na = { class: "count" }, Ba = {
  key: 0,
  class: "block-peek"
}, Ta = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Ra = { class: "node-icon" }, Aa = { class: "node-main" }, Da = { class: "node-summary" }, La = { class: "node-side" }, Oa = { class: "chip model" }, Fa = { class: "branches" }, za = { class: "branch" }, Pa = { class: "branch" }, Wa = { class: "node-icon" }, ja = { class: "node-main" }, Ia = { class: "node-summary" }, Qa = ["aria-valuenow"], Ka = { class: "side-panel-head" }, Ha = { class: "side-panel-icon" }, Ja = ["disabled"], Ga = {
  key: 4,
  class: "inspector-form"
}, Xa = { class: "output-list" }, Ya = { class: "mono" }, Za = { class: "chip" }, _a = { class: "rail-label" }, we = 400, ge = 320, en = /* @__PURE__ */ Q({
  __name: "Builder",
  props: /* @__PURE__ */ $e({
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
    const c = t, s = fe(t, "title"), m = fe(t, "description"), b = A({ kind: "document" });
    function y(f, d) {
      try {
        const M = localStorage.getItem(`docscout.${f}`);
        return M === null ? d : M === "1";
      } catch {
        return d;
      }
    }
    function g(f, d) {
      try {
        localStorage.setItem(`docscout.${f}`, d ? "1" : "0");
      } catch {
      }
    }
    const w = A(y("panel", !0)), B = A(y("fields", !0)), V = A(y("flow", !0));
    function l() {
      try {
        const f = Number(localStorage.getItem("docscout.panelWidth"));
        return f >= ge ? f : we;
      } catch {
        return we;
      }
    }
    const a = A(l()), q = () => {
      const f = K.value?.clientWidth;
      return f ? Math.max(ge, f - 420) : Number.POSITIVE_INFINITY;
    };
    function F(f, d = !0) {
      if (a.value = Math.round(Math.min(q(), Math.max(ge, f))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const U = A(!1);
    function D(f) {
      const d = f.currentTarget, M = f.clientX, J = a.value;
      d.setPointerCapture(f.pointerId), U.value = !0;
      const se = (Ge) => F(J + (M - Ge.clientX), !1), Be = () => {
        U.value = !1, F(a.value), d.removeEventListener("pointermove", se), d.removeEventListener("pointerup", Be);
      };
      d.addEventListener("pointermove", se), d.addEventListener("pointerup", Be);
    }
    function k(f) {
      f.key === "ArrowLeft" ? (F(a.value + 24), f.preventDefault()) : f.key === "ArrowRight" && (F(a.value - 24), f.preventDefault());
    }
    function C(f) {
      w.value = f, P.value || g("panel", f);
    }
    function R(f) {
      const d = f === "fields" ? B : V;
      d.value = !d.value, g(f, d.value);
    }
    const K = A(), P = A(!1);
    let te;
    Ce(() => {
      te = new ResizeObserver(([f]) => {
        const d = P.value;
        P.value = f.contentRect.width < 1e3, P.value && !d && (w.value = !1), !P.value && d && (w.value = y("panel", !0));
      }), K.value && te.observe(K.value);
    }), Oe(() => te?.disconnect());
    const _ = A();
    ie(b, async () => {
      await Xe(), _.value && (_.value.scrollTop = 0);
    });
    function H(f) {
      b.value = f, w.value = !0;
    }
    const X = (f) => JSON.stringify(f) === JSON.stringify(b.value), ee = N(() => b.value.kind === "field" ? c.config.fields[b.value.index] : void 0), ne = N(() => {
      const f = b.value;
      return f.kind === "stage" ? oe[f.stage] : f.kind === "field" ? ee.value?.name || "New field" : f.kind === "document" ? "Read document" : f.kind === "output" ? "Output" : "Details";
    }), T = N(() => {
      const f = b.value;
      return f.kind === "stage" ? qe[f.stage] : f.kind === "field" ? "tabler:forms" : f.kind === "document" ? "tabler:file-text" : f.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), z = N(() => c.config.fields.filter((f, d) => !(b.value.kind === "field" && b.value.index === d)).map((f) => f.name)), x = N(() => c.config.stages.deep.enabled), v = N(() => c.config.stages.map.enabled), u = N(() => [...new Set(c.config.fields.map((f) => f.group.trim()).filter(Boolean))]), E = (f) => We(c.config.fields[f], c.config.fields.filter((d, M) => M !== f).map((d) => d.name)), Ue = ["map", "prefetch", "scout", "deep", "extract", "verify"], Ie = N(() => Ue.filter((f) => he(c.config, f)).map((f) => oe[f]).join(" · ")), Qe = N(() => c.config.fields.map((f) => f.name || "New field").join(", ")), Ke = N(() => Ue.filter((f) => he(c.config, f)).length), de = (f) => c.result?.trace.find((d) => d.kind === f);
    function He() {
      c.config.fields.push(ol()), B.value = !0, H({ kind: "field", index: c.config.fields.length - 1 });
    }
    function Je(f) {
      c.config.fields.splice(f, 1), b.value = { kind: "document" };
    }
    function Me(f, d) {
      const M = c.config.fields, J = f + d;
      if (J < 0 || J >= M.length) return;
      const [se] = M.splice(f, 1);
      M.splice(J, 0, se), b.value = { kind: "field", index: J };
    }
    const Ee = (f) => f.type === "list" ? `list of ${f.item_type}` : f.type, Ne = N({ get: () => c.config.tags.join(", "), set: (f) => {
      c.config.tags = [...new Set(f.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (f, d) => (n(), o("div", {
      ref_key: "root",
      ref: K,
      class: W(["builder", { narrow: P.value, "panel-open": w.value, resizing: U.value }])
    }, [
      e("div", ia, [
        e("div", da, [
          e("section", ua, [
            e("header", ra, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": B.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (M) => R("fields"))
              }, [
                r(h(L), {
                  icon: B.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", ma, i(t.config.fields.length), 1)
              ], 8, ca),
              !B.value && t.config.fields.length ? (n(), o("span", va, i(Qe.value), 1)) : p("", !0),
              t.readonly ? p("", !0) : (n(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: He
              }, [
                r(h(L), { icon: "tabler:plus" }),
                d[20] || (d[20] = $("Add field", -1))
              ]))
            ]),
            j(e("div", ba, [
              t.config.fields.length ? (n(), o("ul", ya, [
                (n(!0), o(S, null, O(t.config.fields, (M, J) => (n(), o("li", {
                  key: J,
                  class: W(["row-item", { active: X({ kind: "field", index: J }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (se) => H({ kind: "field", index: J })
                  }, [
                    e("span", ga, [
                      $(i(M.name || "New field"), 1),
                      M.required ? (n(), o("span", ha, "*")) : p("", !0),
                      E(J) ? (n(), Z(h(L), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: E(J)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: W(["row-desc", { missing: !M.description }])
                    }, i(M.description || "No description"), 3),
                    e("span", ka, [
                      M.search_within === "sections" ? (n(), o("span", {
                        key: 0,
                        class: W(["chip", v.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      M.group.trim() ? (n(), o("span", $a, i(M.group), 1)) : p("", !0),
                      M.strategy === "deep" ? (n(), o("span", {
                        key: 2,
                        class: W(["chip", x.value ? "primary" : "muted-chip"]),
                        title: x.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, xa)) : p("", !0),
                      e("span", wa, i(Ee(M)), 1),
                      M.evidence_required ? (n(), o("span", Va, [
                        r(h(L), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, fa),
                  t.readonly ? p("", !0) : (n(), o("span", Sa, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: J === 0,
                      onClick: (se) => Me(J, -1)
                    }, [
                      r(h(L), { icon: "tabler:chevron-up" })
                    ], 8, Ca),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: J === t.config.fields.length - 1,
                      onClick: (se) => Me(J, 1)
                    }, [
                      r(h(L), { icon: "tabler:chevron-down" })
                    ], 8, qa)
                  ]))
                ], 2))), 128))
              ])) : (n(), o("p", pa, "Add the values to pull from each document."))
            ], 512), [
              [Ve, B.value]
            ])
          ]),
          e("section", Ua, [
            e("header", Ma, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": V.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (M) => R("flow"))
              }, [
                r(h(L), {
                  icon: V.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Na, i(Ke.value) + " of 6", 1)
              ], 8, Ea),
              V.value ? p("", !0) : (n(), o("span", Ba, i(Ie.value), 1)),
              e("button", {
                type: "button",
                class: W(["btn small subtle push", { on: X({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (M) => H({ kind: "details" }))
              }, [
                r(h(L), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = $("Details", -1))
              ], 2)
            ]),
            j(e("div", Ta, [
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (M) => H({ kind: "document" }))
              }, [
                e("span", Ra, [
                  r(h(L), { icon: "tabler:file-text" })
                ]),
                e("span", Aa, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", Da, i(h(sl)(t.config.retrieval)), 1)
                ]),
                e("span", La, [
                  e("span", Oa, i(h(Pe)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              r(re, {
                stage: "map",
                config: t.config,
                active: X({ kind: "stage", stage: "map" }),
                trace: de("map"),
                readonly: t.readonly,
                onSelect: d[4] || (d[4] = (M) => H({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[29] || (d[29] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", Fa, [
                e("div", za, [
                  d[24] || (d[24] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  r(re, {
                    stage: "prefetch",
                    config: t.config,
                    active: X({ kind: "stage", stage: "prefetch" }),
                    trace: de("prefetch"),
                    readonly: t.readonly,
                    onSelect: d[5] || (d[5] = (M) => H({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  r(re, {
                    stage: "scout",
                    config: t.config,
                    active: X({ kind: "stage", stage: "scout" }),
                    trace: de("scout"),
                    readonly: t.readonly,
                    onSelect: d[6] || (d[6] = (M) => H({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Pa, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  r(re, {
                    stage: "deep",
                    config: t.config,
                    active: X({ kind: "stage", stage: "deep" }),
                    trace: de("deep"),
                    readonly: t.readonly,
                    onSelect: d[7] || (d[7] = (M) => H({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              d[30] || (d[30] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              r(re, {
                stage: "extract",
                config: t.config,
                active: X({ kind: "stage", stage: "extract" }),
                trace: de("extract"),
                readonly: t.readonly,
                onSelect: d[8] || (d[8] = (M) => H({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              r(re, {
                stage: "verify",
                config: t.config,
                active: X({ kind: "stage", stage: "verify" }),
                trace: de("verify"),
                readonly: t.readonly,
                onSelect: d[9] || (d[9] = (M) => H({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (M) => H({ kind: "output" }))
              }, [
                e("span", Wa, [
                  r(h(L), { icon: "tabler:braces" })
                ]),
                e("span", ja, [
                  d[27] || (d[27] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", Ia, i(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Ve, V.value]
            ])
          ])
        ])
      ]),
      P.value && w.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (M) => C(!1))
      })) : p("", !0),
      w.value ? (n(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: be(P.value ? void 0 : { width: `${a.value}px` })
      }, [
        P.value ? p("", !0) : (n(), o("div", {
          key: 0,
          class: W(["resizer", { active: U.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": ge,
          onPointerdown: ke(D, ["prevent"]),
          onKeydown: k,
          onDblclick: d[12] || (d[12] = (M) => F(we))
        }, null, 42, Qa)),
        e("header", Ka, [
          e("span", Ha, [
            r(h(L), { icon: T.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(ne.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (M) => C(!1))
          }, [
            r(h(L), {
              icon: P.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: _,
          class: "side-panel-body"
        }, [
          b.value.kind === "document" ? (n(), Z(oa, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : b.value.kind === "stage" ? (n(), Z(It, {
            key: 1,
            stage: b.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : b.value.kind === "field" && ee.value ? (n(), Z(zl, {
            key: 2,
            field: ee.value,
            "other-names": z.value,
            groups: u.value,
            "deep-enabled": x.value,
            "map-enabled": v.value,
            readonly: t.readonly,
            onRemove: d[14] || (d[14] = (M) => Je(b.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : b.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = $("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (M) => s.value = M),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Y, s.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = $("Description", -1)),
              j(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (M) => m.value = M),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Y, m.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = $("Tags", -1)),
              j(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (M) => Ne.value = M),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Y,
                  Ne.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, Ja)) : b.value.kind === "output" ? (n(), o("div", Ga, [
            d[37] || (d[37] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", Xa, [
              (n(!0), o(S, null, O(t.config.fields, (M) => (n(), o("li", {
                key: M.name
              }, [
                e("span", Ya, i(M.name || "New field"), 1),
                e("span", Za, i(Ee(M)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 4)) : P.value ? p("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (M) => C(!0))
      }, [
        r(h(L), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", _a, i(ne.value), 1)
      ]))
    ], 2));
  }
}), ln = ["selected"], tn = {
  key: 1,
  role: "alert"
}, an = {
  key: 2,
  class: "muted"
}, je = /* @__PURE__ */ Q({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = c, m = A(!1), b = A("");
    Ce(async () => {
      try {
        await Fe("wc-multiselect", { timeoutMs: 8e3 }), m.value = !0;
      } catch (g) {
        b.value = String(g);
      }
    });
    function y(g) {
      const w = g.detail;
      s("select", w.selected[0] || "", w.labels?.[0] || "");
    }
    return (g, w) => m.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: y
    }, null, 40, ln)) : b.value ? (n(), o("p", tn, i(b.value), 1)) : (n(), o("span", an, "Loading uploads…"));
  }
}), nn = { class: "test" }, sn = { class: "run-bar" }, on = { class: "run-input" }, dn = { class: "muted run-note" }, un = {
  key: 0,
  class: "empty"
}, rn = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, cn = {
  key: 2,
  class: "test-grid"
}, mn = { class: "block" }, vn = { class: "block-head" }, bn = { class: "muted push" }, pn = { class: "value-list" }, yn = ["aria-expanded", "onClick"], fn = { class: "value-name" }, gn = ["title"], hn = { class: "bar" }, kn = ["title"], $n = { class: "evidence" }, xn = {
  key: 0,
  class: "full-value"
}, wn = {
  key: 1,
  class: "muted"
}, Vn = {
  key: 2,
  class: "muted"
}, Sn = { class: "block" }, Cn = { class: "timeline" }, qn = { class: "tl-icon" }, Un = { class: "tl-main" }, Mn = { class: "tl-head" }, En = { class: "muted push" }, Nn = { class: "tl-bar" }, Bn = { class: "muted" }, Tn = {
  key: 0,
  class: "tl-msg"
}, Rn = {
  key: 1,
  class: "chips"
}, An = /* @__PURE__ */ Q({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: c }) {
    const s = t, m = c, b = A(""), y = A(), g = (U) => `${Math.round(U * 100)}%`, w = (U) => U == null ? "—" : typeof U == "string" ? U : Array.isArray(U) && U.every((D) => typeof D != "object") ? U.join(", ") : typeof U == "object" ? JSON.stringify(U) : String(U), B = (U) => `${(U / 1e3).toFixed(1)}s`, V = N(() => Math.max(1, ...s.result?.trace.map((U) => U.duration_ms) ?? [1])), l = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, a = (U) => l[U]?.label ?? oe[U] ?? U, q = (U) => l[U]?.icon ?? qe[U] ?? "tabler:point", F = (U) => U >= 0.9 ? "high" : U >= 0.7 ? "mid" : "low";
    return (U, D) => (n(), o("div", nn, [
      e("section", sn, [
        e("div", on, [
          r(je, {
            value: b.value,
            onSelect: D[0] || (D[0] = (k) => b.value = k)
          }, null, 8, ["value"])
        ]),
        r(h(me), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !b.value || t.running || !t.canRun,
          onClick: D[1] || (D[1] = (k) => m("run", b.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", dn, i(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(t.retention) + ".", 1)
      ]),
      t.result ? p("", !0) : (n(), o("p", un, "No extraction results yet.")),
      t.result?.status === "failed" ? (n(), o("p", rn, [
        r(h(L), { icon: "tabler:alert-triangle" }),
        $("The run stopped: " + i(t.result.error), 1)
      ])) : p("", !0),
      t.result ? (n(), o("div", cn, [
        e("section", mn, [
          e("header", vn, [
            D[2] || (D[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", bn, [
              $(i(t.result.tokens.toLocaleString()) + " tokens · " + i(B(t.result.duration_ms)), 1),
              t.result.pages ? (n(), o(S, { key: 0 }, [
                $(" · " + i(t.result.pages) + " pages", 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", pn, [
            (n(!0), o(S, null, O(t.result.fields, (k) => (n(), o("li", {
              key: k.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": y.value === k.name,
                onClick: (C) => y.value = y.value === k.name ? void 0 : k.name
              }, [
                e("span", fn, i(k.name), 1),
                e("span", {
                  class: W(["value-text", { missing: k.missing }]),
                  title: k.missing ? void 0 : w(k.value)
                }, i(k.missing ? "Not in the document" : w(k.value)), 11, gn),
                e("span", {
                  class: W(["confidence", F(k.confidence)])
                }, [
                  e("span", hn, [
                    e("span", {
                      style: be({ width: g(k.confidence) })
                    }, null, 4)
                  ]),
                  $(i(g(k.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: W(["chip", k.verified ? "primary" : "warn"]),
                  title: k.reason
                }, [
                  r(h(L), {
                    icon: k.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  $(i(k.verified ? "Verified" : "Check"), 1)
                ], 10, kn),
                r(h(L), {
                  icon: y.value === k.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, yn),
              j(e("div", $n, [
                k.missing ? p("", !0) : (n(), o("p", xn, i(w(k.value)), 1)),
                (n(!0), o(S, null, O(k.evidence, (C, R) => (n(), o("blockquote", {
                  key: R,
                  class: W({ unfound: C.found === !1 })
                }, [
                  e("p", null, "“" + i(C.quote) + "”", 1),
                  e("cite", null, [
                    $(i(C.section), 1),
                    C.page !== void 0 && C.page !== null ? (n(), o(S, { key: 0 }, [
                      $(" · Page " + i(C.page), 1)
                    ], 64)) : p("", !0),
                    C.found === !1 ? (n(), o(S, { key: 1 }, [
                      $(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                k.evidence.length ? p("", !0) : (n(), o("p", wn, "No evidence.")),
                k.reason ? (n(), o("p", Vn, i(k.reason), 1)) : p("", !0)
              ], 512), [
                [Ve, y.value === k.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Sn, [
          D[3] || (D[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Cn, [
            (n(!0), o(S, null, O(t.result.trace, (k, C) => (n(), o("li", {
              key: C,
              class: W(k.status)
            }, [
              e("span", qn, [
                r(h(L), {
                  icon: q(k.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Un, [
                e("div", Mn, [
                  e("strong", null, i(a(k.kind)), 1),
                  e("span", En, i(B(k.duration_ms)), 1)
                ]),
                e("span", Nn, [
                  e("span", {
                    style: be({ width: `${Math.max(4, k.duration_ms / V.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Bn, [
                  $(i(k.scope), 1),
                  k.model ? (n(), o(S, { key: 0 }, [
                    $(" · " + i(k.model), 1)
                  ], 64)) : p("", !0),
                  $(" · " + i((k.input_tokens + k.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                k.message ? (n(), o("p", Tn, i(k.message), 1)) : p("", !0),
                k.queries?.length ? (n(), o("div", Rn, [
                  (n(!0), o(S, null, O(k.queries, (R) => (n(), o("span", {
                    key: R,
                    class: "chip"
                  }, i(R), 1))), 128))
                ])) : p("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : p("", !0)
    ]));
  }
}), Dn = { class: "evals" }, Ln = { class: "block eval-run" }, On = { class: "eval-run-main" }, Fn = { class: "block-title" }, zn = {
  key: 0,
  class: "eval-note"
}, Pn = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Wn = { class: "bar" }, jn = { class: "muted" }, In = { class: "stat-row" }, Qn = { class: "stat" }, Kn = { class: "stat-label" }, Hn = { class: "stat-value" }, Jn = { class: "stat" }, Gn = { class: "stat-value" }, Xn = { class: "stat-delta flat" }, Yn = { class: "stat" }, Zn = { class: "stat-value" }, _n = {
  key: 0,
  class: "stat-delta flat"
}, es = { class: "stat" }, ls = { class: "stat-value" }, ts = {
  key: 0,
  class: "stat-delta flat"
}, as = { class: "block" }, ns = { class: "block-head" }, ss = {
  key: 0,
  class: "compare-pick push"
}, os = ["value"], is = ["value"], ds = {
  key: 0,
  class: "block-empty"
}, us = {
  key: 1,
  class: "table-scroll"
}, rs = { class: "metric-table" }, cs = { key: 0 }, ms = { key: 1 }, vs = { class: "mono" }, bs = { class: "acc strong" }, ps = { class: "bar" }, ys = { class: "muted" }, fs = {
  key: 0,
  class: "muted"
}, gs = { key: 1 }, hs = {
  key: 1,
  class: "muted"
}, ks = {
  key: 1,
  class: "block"
}, $s = { class: "table-scroll" }, xs = { class: "metric-table result-matrix" }, ws = ["aria-expanded", "onClick"], Vs = ["colspan"], Ss = {
  key: 0,
  class: "cell-state"
}, Cs = {
  key: 1,
  class: "cell-state fail"
}, qs = ["title"], Us = {
  key: 0,
  class: "result-detail"
}, Ms = ["colspan"], Es = {
  key: 0,
  class: "muted"
}, Ns = {
  key: 1,
  class: "compare"
}, Bs = { class: "mono" }, Ts = { class: "cmp" }, Rs = { class: "cmp" }, As = { class: "muted case-meta" }, Ds = { class: "block" }, Ls = { class: "block-head" }, Os = { class: "count" }, Fs = { class: "grid" }, zs = { class: "mono" }, Ps = ["onUpdate:modelValue"], Ws = ["onUpdate:modelValue"], js = ["onUpdate:modelValue", "placeholder"], Is = ["onUpdate:modelValue", "type"], Qs = {
  key: 0,
  class: "error",
  role: "alert"
}, Ks = { class: "row" }, Hs = {
  key: 1,
  class: "block-empty"
}, Js = {
  key: 2,
  class: "table-scroll"
}, Gs = { class: "metric-table" }, Xs = { class: "num" }, Ys = ["aria-label", "disabled", "onClick"], Zs = {
  key: 2,
  class: "block"
}, _s = { class: "block-head" }, eo = { class: "count" }, lo = { class: "eval-history" }, to = ["aria-current", "onClick"], ao = ["data-status"], no = { class: "muted" }, so = { class: "push" }, oo = /* @__PURE__ */ Q({
  __name: "EvalsPanel",
  props: {
    cases: {},
    fields: {},
    evaluations: {},
    evaluation: {},
    revision: {},
    changed: { type: Boolean },
    saving: { type: Boolean },
    starting: { type: Boolean }
  },
  emits: ["add-case", "delete-case", "evaluate", "open"],
  setup(t, { emit: c }) {
    const s = t, m = c, b = A(!1), y = A(""), g = A({}), w = A("");
    ie(() => s.cases, () => {
      b.value = !1, y.value = "", g.value = {};
    });
    function B(x, v) {
      return x.type === "number" ? Number(v) : x.type === "boolean" ? v === "true" : x.type === "list" || x.type === "object" ? JSON.parse(v) : v;
    }
    function V() {
      w.value = "";
      const x = {};
      try {
        for (const v of s.fields) {
          const u = String(g.value[v.name] ?? "").trim();
          u && (x[v.name] = B(v, u));
        }
      } catch {
        w.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      m("add-case", { upload_id: y.value, expected: x });
    }
    const l = N(() => s.evaluations.find((x) => !pe(x))), a = N(() => s.evaluations.filter(pe)), q = N(() => s.evaluation), F = N(() => ({ done: (q.value?.results ?? []).filter((v) => v.status !== "queued").length, total: q.value?.case_count ?? 0 })), U = A();
    ie(() => q.value?.id, () => {
      U.value = void 0;
    });
    const D = N(() => {
      if (!q.value) return;
      if (U.value) return a.value.find((v) => v.id === U.value);
      const x = a.value.findIndex((v) => v.id === q.value.id);
      return x >= 0 ? a.value[x + 1] : a.value[0];
    }), k = N(() => (q.value?.metrics ?? []).map((x) => ({ ...x, before: D.value?.metrics.find((v) => v.field === x.field) }))), C = N(() => (q.value?.fields ?? []).map((x) => x.name)), R = (x, v) => x.scores.find((u) => u.field === v), K = A(), P = (x) => `${Math.round(x * 100)}%`, te = (x) => {
      const v = Math.round(x * 100);
      return `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v)} pts`;
    }, _ = (x) => Math.round(x * 100) > 0 ? "up" : Math.round(x * 100) < 0 ? "down" : "flat", H = (x) => x >= 6e4 ? `${Math.floor(x / 6e4)}m ${Math.round(x % 6e4 / 1e3)}s` : `${(x / 1e3).toFixed(1)}s`, X = (x) => new Date(x).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), ee = (x) => x == null || x === "" ? "—" : typeof x == "string" ? x : Array.isArray(x) && x.every((v) => typeof v != "object") ? x.join(", ") : JSON.stringify(x), ne = (x) => x ? x.score >= 0.999 ? "pass" : x.score > 0 ? "partial" : "fail" : "none", T = (x) => (x.results ?? []).filter((v) => v.status === "completed").length, z = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (x, v) => (n(), o("div", Dn, [
      e("section", Ln, [
        e("div", On, [
          e("div", null, [
            e("h2", Fn, "Evaluate revision " + i(t.revision), 1),
            v[6] || (v[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (n(), o("p", zn, [
              r(h(L), { icon: "tabler:info-circle" }),
              v[5] || (v[5] = $("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : p("", !0)
          ]),
          r(h(me), {
            label: l.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!l.value,
            disabled: !t.cases.length || !t.fields.length || !!l.value || t.starting,
            onClick: v[0] || (v[0] = (u) => m("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        q.value && !h(pe)(q.value) ? (n(), o("div", Pn, [
          e("span", Wn, [
            e("span", {
              style: be({ width: P(F.value.total ? F.value.done / F.value.total : 0) })
            }, null, 4)
          ]),
          e("span", jn, i(z[q.value.status]) + " · " + i(F.value.done) + " of " + i(F.value.total) + " cases", 1)
        ])) : p("", !0)
      ]),
      q.value && h(pe)(q.value) ? (n(), o(S, { key: 0 }, [
        q.value.error ? (n(), o("p", {
          key: 0,
          class: W(q.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          r(h(L), { icon: "tabler:alert-triangle" }),
          $(i(q.value.error), 1)
        ], 2)) : p("", !0),
        e("div", In, [
          e("div", Qn, [
            e("span", Kn, "Accuracy · revision " + i(q.value.config_revision), 1),
            e("span", Hn, i(P(h(ue)(q.value))), 1),
            D.value ? (n(), o("span", {
              key: 0,
              class: W(["stat-delta", _(h(ue)(q.value) - h(ue)(D.value))])
            }, i(te(h(ue)(q.value) - h(ue)(D.value))) + " vs revision " + i(D.value.config_revision), 3)) : p("", !0)
          ]),
          e("div", Jn, [
            v[7] || (v[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", Gn, [
              $(i(T(q.value)), 1),
              e("small", null, " / " + i(q.value.case_count), 1)
            ]),
            e("span", Xn, i(q.value.case_count - T(q.value)) + " failed", 1)
          ]),
          e("div", Yn, [
            v[8] || (v[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", Zn, i(q.value.tokens.toLocaleString()), 1),
            D.value ? (n(), o("span", _n, i(D.value.tokens.toLocaleString()) + " before", 1)) : p("", !0)
          ]),
          e("div", es, [
            v[9] || (v[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", ls, i(H(q.value.duration_ms)), 1),
            D.value ? (n(), o("span", ts, i(H(D.value.duration_ms)) + " before", 1)) : p("", !0)
          ])
        ]),
        e("section", as, [
          e("header", ns, [
            v[11] || (v[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (n(), o("label", ss, [
              v[10] || (v[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: D.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: v[1] || (v[1] = (u) => U.value = u.target.value)
              }, [
                (n(!0), o(S, null, O(a.value.filter((u) => u.id !== q.value.id), (u) => (n(), o("option", {
                  key: u.id,
                  value: u.id
                }, "Revision " + i(u.config_revision) + " · " + i(X(u.created_at)), 9, is))), 128))
              ], 40, os)
            ])) : p("", !0)
          ]),
          k.value.length ? (n(), o("div", us, [
            e("table", rs, [
              e("thead", null, [
                e("tr", null, [
                  v[12] || (v[12] = e("th", null, "Field", -1)),
                  v[13] || (v[13] = e("th", null, "Accuracy", -1)),
                  v[14] || (v[14] = e("th", null, "Verified", -1)),
                  D.value ? (n(), o("th", cs, "Revision " + i(D.value.config_revision), 1)) : p("", !0),
                  D.value ? (n(), o("th", ms, "Change")) : p("", !0)
                ])
              ]),
              e("tbody", null, [
                (n(!0), o(S, null, O(k.value, (u) => (n(), o("tr", {
                  key: u.field
                }, [
                  e("td", vs, i(u.field), 1),
                  e("td", null, [
                    e("span", bs, [
                      e("span", ps, [
                        e("span", {
                          style: be({ width: P(u.accuracy) })
                        }, null, 4)
                      ]),
                      $(i(P(u.accuracy)), 1)
                    ])
                  ]),
                  e("td", ys, i(P(u.verified)), 1),
                  D.value ? (n(), o("td", fs, i(u.before ? P(u.before.accuracy) : "—"), 1)) : p("", !0),
                  D.value ? (n(), o("td", gs, [
                    u.before ? (n(), o("span", {
                      key: 0,
                      class: W(["trend", _(u.accuracy - u.before.accuracy)])
                    }, [
                      r(h(L), {
                        icon: _(u.accuracy - u.before.accuracy) === "up" ? "tabler:trending-up" : _(u.accuracy - u.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      $(i(te(u.accuracy - u.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", hs, "New field"))
                  ])) : p("", !0)
                ]))), 128))
              ])
            ])
          ])) : (n(), o("p", ds, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : p("", !0),
      q.value?.results?.length ? (n(), o("section", ks, [
        v[19] || (v[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", $s, [
          e("table", xs, [
            e("thead", null, [
              e("tr", null, [
                v[15] || (v[15] = e("th", null, "Document", -1)),
                (n(!0), o(S, null, O(C.value, (u) => (n(), o("th", {
                  key: u,
                  class: "mono"
                }, i(u), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(S, null, O(q.value.results, (u) => (n(), o(S, {
                key: u.case_id
              }, [
                e("tr", {
                  class: W(["result-row", { active: K.value === u.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": K.value === u.case_id,
                      onClick: (E) => K.value = K.value === u.case_id ? void 0 : u.case_id
                    }, [
                      r(h(L), {
                        icon: K.value === u.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      $(i(u.upload_name), 1)
                    ], 8, ws)
                  ]),
                  u.status !== "completed" ? (n(), o("td", {
                    key: 0,
                    colspan: C.value.length,
                    class: "muted"
                  }, [
                    u.status === "queued" ? (n(), o("span", Ss, [
                      r(h(L), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      v[16] || (v[16] = $("Waiting", -1))
                    ])) : (n(), o("span", Cs, [
                      r(h(L), { icon: "tabler:alert-triangle" }),
                      $(i(u.error), 1)
                    ]))
                  ], 8, Vs)) : (n(!0), o(S, { key: 1 }, O(C.value, (E) => (n(), o("td", { key: E }, [
                    e("span", {
                      class: W(["cell", ne(R(u, E))]),
                      title: ee(R(u, E)?.value)
                    }, i(R(u, E) ? P(R(u, E).score) : "—"), 11, qs)
                  ]))), 128))
                ], 2),
                K.value === u.case_id ? (n(), o("tr", Us, [
                  e("td", {
                    colspan: C.value.length + 1
                  }, [
                    u.error ? (n(), o("p", Es, i(u.error), 1)) : (n(), o("dl", Ns, [
                      (n(!0), o(S, null, O(u.scores, (E) => (n(), o(S, {
                        key: E.field
                      }, [
                        e("dt", Bs, i(E.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: W(["cell", ne(E)])
                          }, i(P(E.score)), 3),
                          e("span", Ts, [
                            v[17] || (v[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            $(i(ee(E.expected)), 1)
                          ]),
                          e("span", Rs, [
                            v[18] || (v[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            $(i(ee(E.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: W(["chip", E.verified ? "primary" : "warn"])
                            }, [
                              r(h(L), {
                                icon: E.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              $(i(E.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", As, i(u.tokens.toLocaleString()) + " tokens · " + i(H(u.duration_ms)), 1)
                  ], 8, Ms)
                ])) : p("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : p("", !0),
      e("section", Ds, [
        e("header", Ls, [
          v[20] || (v[20] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", Os, i(t.cases.length), 1),
          r(h(me), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !t.fields.length,
            onClick: v[2] || (v[2] = (u) => b.value = !b.value)
          }, null, 8, ["disabled"])
        ]),
        b.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ke(V, ["prevent"])
        }, [
          e("label", null, [
            v[21] || (v[21] = $("Document", -1)),
            r(je, {
              value: y.value,
              onSelect: v[3] || (v[3] = (u) => {
                y.value = u;
              })
            }, null, 8, ["value"])
          ]),
          v[24] || (v[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", Fs, [
            (n(!0), o(S, null, O(t.fields, (u) => (n(), o("label", {
              key: u.name
            }, [
              e("span", zs, i(u.name), 1),
              u.type === "boolean" ? j((n(), o("select", {
                key: 0,
                "onUpdate:modelValue": (E) => g.value[u.name] = E
              }, [...v[22] || (v[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Ps)), [
                [ye, g.value[u.name]]
              ]) : u.type === "enum" ? j((n(), o("select", {
                key: 1,
                "onUpdate:modelValue": (E) => g.value[u.name] = E
              }, [
                v[23] || (v[23] = e("option", { value: "" }, "Not stated", -1)),
                (n(!0), o(S, null, O(u.enum_values, (E) => (n(), o("option", { key: E }, i(E), 1))), 128))
              ], 8, Ws)), [
                [ye, g.value[u.name]]
              ]) : u.type === "object" || u.type === "list" ? j((n(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (E) => g.value[u.name] = E,
                rows: "2",
                placeholder: u.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, js)), [
                [Y, g.value[u.name]]
              ]) : j((n(), o("input", {
                key: 3,
                "onUpdate:modelValue": (E) => g.value[u.name] = E,
                type: u.type === "number" ? "number" : u.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, Is)), [
                [Ye, g.value[u.name]]
              ])
            ]))), 128))
          ]),
          w.value ? (n(), o("p", Qs, i(w.value), 1)) : p("", !0),
          e("div", Ks, [
            r(h(me), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !y.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            r(h(me), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: v[4] || (v[4] = (u) => b.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        !t.cases.length && !b.value ? (n(), o("p", Hs, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : t.cases.length ? (n(), o("div", Js, [
          e("table", Gs, [
            e("thead", null, [
              e("tr", null, [
                v[25] || (v[25] = e("th", null, "Document", -1)),
                (n(!0), o(S, null, O(t.fields, (u) => (n(), o("th", {
                  key: u.name,
                  class: "mono"
                }, i(u.name), 1))), 128)),
                v[26] || (v[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(S, null, O(t.cases, (u) => (n(), o("tr", {
                key: u.id
              }, [
                e("td", null, [
                  r(h(L), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  $(" " + i(u.upload_name), 1)
                ]),
                (n(!0), o(S, null, O(t.fields, (E) => (n(), o("td", {
                  key: E.name,
                  class: W({ muted: !(E.name in u.expected) })
                }, i(E.name in u.expected ? ee(u.expected[E.name]) : "Not stated"), 3))), 128)),
                e("td", Xs, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${u.upload_name}`,
                    disabled: t.saving,
                    onClick: (E) => m("delete-case", u.id)
                  }, [
                    r(h(L), { icon: "tabler:trash" })
                  ], 8, Ys)
                ])
              ]))), 128))
            ])
          ])
        ])) : p("", !0)
      ]),
      t.evaluations.length ? (n(), o("section", Zs, [
        e("header", _s, [
          v[27] || (v[27] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", eo, i(t.evaluations.length), 1)
        ]),
        e("ul", lo, [
          (n(!0), o(S, null, O(t.evaluations, (u) => (n(), o("li", {
            key: u.id
          }, [
            e("button", {
              type: "button",
              class: W({ active: q.value?.id === u.id }),
              "aria-current": q.value?.id === u.id,
              onClick: (E) => m("open", u.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": u.status
              }, i(z[u.status]), 9, ao),
              e("span", null, "Revision " + i(u.config_revision), 1),
              e("span", no, i(X(u.created_at)), 1),
              e("strong", so, i(u.status === "completed" ? P(h(ue)(u)) : "—"), 1)
            ], 10, to)
          ]))), 128))
        ])
      ])) : p("", !0)
    ]));
  }
}), io = { class: "section-head" }, uo = { class: "muted" }, ro = {
  key: 0,
  class: "empty"
}, co = {
  key: 1,
  class: "table-scroll"
}, mo = { class: "metric-table" }, vo = { class: "caller" }, bo = ["data-status"], po = { class: "num" }, yo = { class: "num" }, fo = { class: "muted" }, go = /* @__PURE__ */ Q({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const c = (m) => new Date(m).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), s = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (m, b) => (n(), o(S, null, [
      e("div", io, [
        b[0] || (b[0] = e("h2", null, "Recent runs", -1)),
        e("span", uo, "Runs expire after " + i(t.retention), 1)
      ]),
      t.runs.length ? (n(), o("div", co, [
        e("table", mo, [
          b[1] || (b[1] = e("thead", null, [
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
            (n(!0), o(S, null, O(t.runs, (y) => (n(), o("tr", {
              key: y.id
            }, [
              e("td", null, i(c(y.created_at)), 1),
              e("td", null, [
                e("span", vo, [
                  r(h(L), {
                    icon: s[y.caller].icon
                  }, null, 8, ["icon"]),
                  $(i(s[y.caller].label), 1)
                ])
              ]),
              e("td", null, [
                e("span", {
                  class: "badge",
                  "data-status": y.status
                }, i(y.status === "completed" ? "Completed" : "Failed"), 9, bo)
              ]),
              e("td", po, i((y.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("td", yo, i(Number(y.tokens).toLocaleString()), 1),
              e("td", fo, i(c(y.expires_at)), 1)
            ]))), 128))
          ])
        ])
      ])) : (n(), o("p", ro, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), ho = { class: "docscout" }, ko = { class: "toolbar" }, $o = { class: "toolbar-lead" }, xo = { class: "crumb" }, wo = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Vo = ["id", "aria-selected", "aria-controls", "onClick"], So = { class: "toolbar-side" }, Co = { class: "stats" }, qo = ["title"], Uo = {
  key: 1,
  class: "unsaved"
}, Mo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Eo = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, No = ["id", "aria-labelledby"], Bo = /* @__PURE__ */ Q({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
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
  setup(t, { emit: c }) {
    const s = t, m = c, b = A(), y = A("Builder"), g = A(Le()), w = A(""), B = A(""), V = N(() => s.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    ie(y, () => {
      b.value && (b.value.scrollTop = 0);
    }, { flush: "post" });
    const l = A();
    function a(k) {
      return w.value === k.title && B.value === (k.description ?? "") && dl(g.value, k.config);
    }
    ie(() => s.snapshot, (k, C) => {
      V.value.includes(y.value) || (y.value = V.value[0]), !(C && k.id === C.id && k.can_edit && C.can_edit && !a(C) && !a(k)) && (g.value = structuredClone(Re(k.config ?? Le())), w.value = k.title, B.value = k.description ?? "", l.value = k.expected_revision);
    }, { immediate: !0 });
    const q = N(() => s.snapshot.can_edit && !a(s.snapshot)), F = N(() => il(g.value)), U = N(() => Object.keys(oe).filter((k) => he(g.value, k)).length);
    function D() {
      m("save", { title: w.value, description: B.value, config: structuredClone(Re(g.value)), expected_revision: l.value });
    }
    return (k, C) => (n(), o("main", ho, [
      e("div", ko, [
        e("div", $o, [
          t.back ? (n(), o(S, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: C[0] || (C[0] = (R) => m("back"))
            }, [
              r(h(L), { icon: "tabler:arrow-left" })
            ]),
            e("span", xo, i(t.snapshot.title), 1)
          ], 64)) : p("", !0),
          e("nav", wo, [
            (n(!0), o(S, null, O(V.value, (R) => (n(), o("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": y.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (K) => y.value = R
            }, i(R), 9, Vo))), 128))
          ])
        ]),
        e("div", So, [
          e("span", Co, [
            $(i(t.snapshot.field_count) + " " + i(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (n(), o(S, { key: 0 }, [
              $(" · " + i(U.value) + " steps · revision " + i(t.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(S, { key: 1 }, [
              $(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (n(), o(S, { key: 0 }, [
            F.value ? (n(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: F.value
            }, [
              r(h(L), { icon: "tabler:alert-circle" }),
              $(i(F.value), 1)
            ], 8, qo)) : q.value ? (n(), o("span", Uo, "Unsaved")) : p("", !0),
            r(h(me), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !q.value || !!F.value || !w.value.trim(),
              onClick: D
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      t.error ? (n(), o("p", Mo, i(t.error), 1)) : p("", !0),
      y.value === "Builder" && t.snapshot.can_edit ? (n(), o("div", Eo, [
        r(en, {
          title: w.value,
          "onUpdate:title": C[1] || (C[1] = (R) => w.value = R),
          description: B.value,
          "onUpdate:description": C[2] || (C[2] = (R) => B.value = R),
          config: g.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 2,
        ref_key: "body",
        ref: b,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${y.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${y.value}`,
          class: "panel"
        }, [
          y.value === "Test" ? (n(), Z(An, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: C[3] || (C[3] = (R) => m("run", R))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          y.value === "Evals" && t.snapshot.can_edit ? (n(), Z(oo, {
            key: 1,
            cases: t.snapshot.cases,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: q.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: C[4] || (C[4] = (R) => m("add-case", R)),
            onDeleteCase: C[5] || (C[5] = (R) => m("delete-case", R)),
            onEvaluate: C[6] || (C[6] = (R) => m("evaluate")),
            onOpen: C[7] || (C[7] = (R) => m("open-evaluation", R))
          }, null, 8, ["cases", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : p("", !0),
          y.value === "Runs" ? (n(), Z(go, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, No)
      ], 512))
    ]));
  }
}), To = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Ro = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Ao = 2e3, zo = /* @__PURE__ */ Q({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: c }) {
    const s = t, m = c, b = A(), y = A(""), g = A(!1), w = A(!1), B = A(!1), V = A(null), l = A([]), a = A();
    let q, F, U = 0, D;
    const k = (T) => T instanceof Error ? T.message : String(T), C = (T) => T === U;
    async function R(T, z) {
      try {
        const x = s.id, v = await ae.evaluations(x);
        if (!C(T)) return;
        l.value = v, z && (D = z);
        const u = D ?? v[0]?.id;
        if (u) {
          const E = await ae.evaluation(x, u);
          if (!C(T) || E.id !== (D ?? u)) return;
          a.value = E;
        }
        clearTimeout(F), v.some((E) => !pe(E)) && (F = setTimeout(() => R(T), Ao));
      } catch (x) {
        C(T) && (y.value = k(x));
      }
    }
    async function K(T) {
      if (!s.id) {
        y.value = "No extractor selected.";
        return;
      }
      try {
        const z = await ae.get(s.id);
        if (!C(T)) return;
        b.value = z, y.value = "", z.can_edit && await R(T);
      } catch (z) {
        C(T) && (y.value = k(z));
      }
    }
    ie(() => s.id, () => {
      U++, D = void 0, clearTimeout(F), q?.(), b.value = void 0, V.value = null, l.value = [], a.value = void 0, y.value = "";
      const T = U;
      K(T), s.id && (q = Ze(`component.${s.id}`, () => K(T)));
    }, { immediate: !0 }), Oe(() => {
      U++, q?.(), clearTimeout(F);
    });
    async function P(T) {
      const z = U;
      g.value = !0, y.value = "";
      try {
        await T(), C(z) && await K(z);
      } catch (x) {
        C(z) && (y.value = k(x));
      } finally {
        g.value = !1;
      }
    }
    const te = (T) => P(() => ae.update(s.id, T)), _ = (T) => P(() => ae.addCase(s.id, T)), H = (T) => P(() => ae.deleteCase(s.id, T));
    async function X(T) {
      const z = U;
      w.value = !0, y.value = "";
      try {
        const x = await ae.run(s.id, T);
        C(z) && (V.value = x, await K(z));
      } catch (x) {
        C(z) && (y.value = k(x));
      } finally {
        w.value = !1;
      }
    }
    async function ee() {
      const T = U;
      B.value = !0, y.value = "";
      try {
        const { eval_id: z } = await ae.evaluate(s.id);
        C(T) && await R(T, z);
      } catch (z) {
        C(T) && (y.value = k(z));
      } finally {
        B.value = !1;
      }
    }
    function ne(T) {
      R(U, T);
    }
    return (T, z) => b.value ? (n(), Z(Bo, {
      key: 0,
      snapshot: b.value,
      saving: g.value,
      running: w.value,
      starting: B.value,
      result: V.value,
      evaluations: l.value,
      evaluation: a.value,
      error: y.value,
      back: t.back,
      onBack: z[0] || (z[0] = (x) => m("back")),
      onRun: X,
      onSave: te,
      onAddCase: _,
      onDeleteCase: H,
      onEvaluate: ee,
      onOpenEvaluation: ne
    }, null, 8, ["snapshot", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : y.value ? (n(), o("p", To, i(y.value), 1)) : (n(), o("p", Ro, "Loading Docscout…"));
  }
});
export {
  zo as _
};
