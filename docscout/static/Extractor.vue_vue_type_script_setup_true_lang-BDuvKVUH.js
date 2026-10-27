import { defineComponent as j, useModel as ie, openBlock as t, createElementBlock as n, withModifiers as ne, createElementVNode as e, mergeModels as fe, computed as N, watch as _, createTextVNode as w, withDirectives as D, vModelText as J, Fragment as S, renderList as M, toDisplayString as s, vModelSelect as se, createVNode as p, unref as k, createCommentVNode as f, ref as E, onMounted as pe, normalizeStyle as ee, createBlock as H, onBeforeUnmount as Ee, nextTick as We, normalizeClass as I, vShow as be, withKeys as Qe, vModelDynamic as Je, toRaw as Ce } from "vue";
import { loadByTagName as Be, on as Ke } from "@wippy-fe/proxy";
import { h as Re, t as Se, i as He, j as Xe, k as Ye, l as Ge, o as qe, p as Ze, r as ce, g as G, q as ye, v as _e, m as me, w as el, x as Ue, y as Me, z as ll, s as X, n as Ne, A as tl, C as nl, c as ae } from "./index-Du_Twtvt.js";
import { Icon as B } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const sl = ["aria-checked", "aria-label", "disabled"], K = /* @__PURE__ */ j({
  __name: "Toggle",
  props: /* @__PURE__ */ fe({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(l) {
    const c = ie(l, "modelValue");
    return (g, $) => (t(), n("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": c.value,
      "aria-label": l.label,
      disabled: l.disabled,
      onClick: $[0] || ($[0] = ne((d) => c.value = !c.value, ["stop"]))
    }, [...$[1] || ($[1] = [
      e("span", null, null, -1)
    ])], 8, sl));
  }
}), al = ["disabled"], ol = { class: "grid" }, il = ["aria-invalid"], dl = ["value"], ul = {
  key: 0,
  class: "field-error",
  role: "alert"
}, rl = { key: 1 }, cl = ["value"], ml = { key: 2 }, vl = ["value"], bl = { class: "grid" }, yl = {
  key: 3,
  class: "field-note"
}, fl = { key: 4 }, pl = ["placeholder"], hl = { class: "toggle-row" }, kl = { class: "toggle-row" }, gl = /* @__PURE__ */ j({
  __name: "FieldInspector",
  props: {
    field: {},
    otherNames: {},
    deepEnabled: { type: Boolean },
    readonly: { type: Boolean }
  },
  emits: ["remove"],
  setup(l, { emit: c }) {
    const g = l, $ = c, d = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], C = d.filter((a) => ["text", "number", "boolean", "date", "object"].includes(a.value)), V = N(() => Re(g.field, g.otherNames)), x = N(() => g.field.type !== "boolean" && g.field.type !== "enum" && !(g.field.type === "list" && g.field.item_type === "boolean"));
    _(() => g.field.type, () => {
      !Se(g.field) && g.field.enum_values.length && (g.field.enum_values = []);
    });
    function o(a) {
      g.field.enum_values = [...new Set(a.target.value.split(`
`).map((i) => i.trim()).filter(Boolean))];
    }
    return (a, i) => (t(), n("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("div", ol, [
        e("label", null, [
          i[12] || (i[12] = w("Name", -1)),
          D(e("input", {
            "onUpdate:modelValue": i[0] || (i[0] = (v) => l.field.name = v),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!V.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, il), [
            [
              J,
              l.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          i[13] || (i[13] = w("Type", -1)),
          D(e("select", {
            "onUpdate:modelValue": i[1] || (i[1] = (v) => l.field.type = v),
            "aria-label": "Field type"
          }, [
            (t(), n(S, null, M(d, (v) => e("option", {
              key: v.value,
              value: v.value
            }, s(v.label), 9, dl)), 64))
          ], 512), [
            [se, l.field.type]
          ])
        ])
      ]),
      V.value ? (t(), n("p", ul, [
        p(k(B), { icon: "tabler:alert-circle" }),
        w(s(V.value), 1)
      ])) : f("", !0),
      l.field.type === "list" ? (t(), n("label", rl, [
        i[14] || (i[14] = w("Each item is", -1)),
        D(e("select", {
          "onUpdate:modelValue": i[2] || (i[2] = (v) => l.field.item_type = v)
        }, [
          (t(!0), n(S, null, M(k(C), (v) => (t(), n("option", {
            key: v.value,
            value: v.value
          }, s(v.label), 9, cl))), 128))
        ], 512), [
          [se, l.field.item_type]
        ])
      ])) : f("", !0),
      k(Se)(l.field) ? (t(), n("label", ml, [
        w(s(l.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: l.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: o
        }, null, 40, vl),
        e("small", null, s(l.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : f("", !0),
      e("label", null, [
        i[15] || (i[15] = w("Description", -1)),
        D(e("textarea", {
          "onUpdate:modelValue": i[3] || (i[3] = (v) => l.field.description = v),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [J, l.field.description]
        ]),
        i[16] || (i[16] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      i[28] || (i[28] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        i[17] || (i[17] = w("Search hints", -1)),
        D(e("textarea", {
          "onUpdate:modelValue": i[4] || (i[4] = (v) => l.field.search_hints = v),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [J, l.field.search_hints]
        ]),
        i[18] || (i[18] = e("small", null, "Each line becomes a query in Prefetch and Scout.", -1))
      ]),
      e("div", bl, [
        e("label", null, [
          i[20] || (i[20] = w("Strategy", -1)),
          D(e("select", {
            "onUpdate:modelValue": i[5] || (i[5] = (v) => l.field.strategy = v)
          }, [...i[19] || (i[19] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [se, l.field.strategy]
          ])
        ]),
        e("label", null, [
          i[21] || (i[21] = w("Chunks to read", -1)),
          D(e("input", {
            "onUpdate:modelValue": i[6] || (i[6] = (v) => l.field.chunks = v),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              J,
              l.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          i[22] || (i[22] = e("small", null, "Per search hint", -1))
        ])
      ]),
      l.field.strategy === "deep" && !l.deepEnabled ? (t(), n("p", yl, [
        p(k(B), { icon: "tabler:info-circle" }),
        i[23] || (i[23] = w("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : f("", !0),
      i[29] || (i[29] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        i[24] || (i[24] = w("Validation hints", -1)),
        D(e("textarea", {
          "onUpdate:modelValue": i[7] || (i[7] = (v) => l.field.validation_hints = v),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [J, l.field.validation_hints]
        ])
      ]),
      x.value ? (t(), n("label", fl, [
        i[25] || (i[25] = w("Expected format", -1)),
        D(e("input", {
          "onUpdate:modelValue": i[8] || (i[8] = (v) => l.field.expected_format = v),
          placeholder: k(He)(l.field)
        }, null, 8, pl), [
          [J, l.field.expected_format]
        ])
      ])) : f("", !0),
      e("div", hl, [
        i[26] || (i[26] = e("span", null, [
          w("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        p(K, {
          modelValue: l.field.required,
          "onUpdate:modelValue": i[9] || (i[9] = (v) => l.field.required = v),
          label: "Required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", kl, [
        i[27] || (i[27] = e("span", null, [
          w("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        p(K, {
          modelValue: l.field.evidence_required,
          "onUpdate:modelValue": i[10] || (i[10] = (v) => l.field.evidence_required = v),
          label: "Evidence required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.readonly ? f("", !0) : (t(), n("button", {
        key: 5,
        type: "button",
        class: "btn danger-text",
        onClick: i[11] || (i[11] = (v) => $("remove"))
      }, "Remove field"))
    ], 8, al));
  }
}), $l = ["value", "capability", "aria-labelledby"], xl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, wl = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, de = /* @__PURE__ */ j({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(l, { emit: c }) {
    const g = c, $ = E(!!customElements.get("wc-model-picker")), d = E("");
    pe(async () => {
      if (!$.value)
        try {
          await Be("wc-model-picker", { timeoutMs: 8e3 }), $.value = !0;
        } catch (V) {
          d.value = V instanceof Error ? V.message : String(V);
        }
    });
    function C(V) {
      const x = V.detail;
      typeof x == "string" && g("select", x);
    }
    return (V, x) => $.value ? (t(), n("wc-model-picker", {
      key: 0,
      value: l.value,
      capability: l.capability,
      "aria-labelledby": l.labelledBy,
      onSelect: C
    }, null, 40, $l)) : d.value ? (t(), n("p", xl, "Could not load model picker: " + s(d.value), 1)) : (t(), n("span", wl, "Loading models…"));
  }
}), Vl = { class: "slider" }, Cl = { class: "slider-head" }, Sl = { class: "slider-value" }, ql = ["aria-label", "aria-valuetext", "disabled"], Ul = {
  key: 0,
  class: "slider-hints"
}, Ml = { key: 1 }, Z = 1e3, Q = /* @__PURE__ */ j({
  __name: "Slider",
  props: /* @__PURE__ */ fe({
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
  setup(l) {
    const c = l, g = ie(l, "modelValue"), $ = N(() => c.percent ? `${Math.round(g.value * 100)}%` : `${g.value.toLocaleString()}${c.unit ? ` ${c.unit}` : ""}`), d = (x) => c.log ? Math.log(x / c.min) / Math.log(c.max / c.min) * Z : (x - c.min) / (c.max - c.min) * Z;
    function C(x) {
      const o = c.log ? c.min * Math.pow(c.max / c.min, x / Z) : c.min + (c.max - c.min) * x / Z, a = Math.round(o / c.step) * c.step;
      return Math.min(c.max, Math.max(c.min, Number(a.toFixed(4))));
    }
    const V = N({ get: () => Math.round(d(g.value)), set: (x) => {
      g.value = C(x);
    } });
    return (x, o) => (t(), n("div", Vl, [
      e("div", Cl, [
        e("span", null, s(l.label), 1),
        e("output", Sl, s($.value), 1)
      ]),
      D(e("input", {
        "onUpdate:modelValue": o[0] || (o[0] = (a) => V.value = a),
        type: "range",
        min: "0",
        max: Z,
        step: "1",
        "aria-label": l.label,
        "aria-valuetext": $.value,
        disabled: l.disabled,
        style: ee({ "--fill": `${V.value / Z * 100}%` })
      }, null, 12, ql), [
        [
          J,
          V.value,
          void 0,
          { number: !0 }
        ]
      ]),
      l.hints ? (t(), n("div", Ul, [
        e("span", null, s(l.hints[0]), 1),
        e("span", null, s(l.hints[1]), 1)
      ])) : f("", !0),
      l.note ? (t(), n("small", Ml, s(l.note), 1)) : f("", !0)
    ]));
  }
}), Nl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, El = { class: "fd-track" }, Bl = { class: "fd-node" }, Rl = { class: "fd-dots" }, Tl = { class: "fd-more" }, zl = { class: "fd-node goal" }, Dl = /* @__PURE__ */ j({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(l) {
    const c = l;
    return (g, $) => (t(), n("figure", Nl, [
      e("div", El, [
        $[2] || ($[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (t(!0), n(S, null, M(Math.min(c.rounds, 8), (d) => (t(), n(S, { key: d }, [
          $[0] || ($[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Bl, [
            e("span", null, "R" + s(d), 1),
            e("span", Rl, [
              (t(!0), n(S, null, M(Math.min(c.extra, 6), (C) => (t(), n("i", { key: C }))), 128))
            ])
          ])
        ], 64))), 128)),
        c.rounds > 8 ? (t(), n(S, { key: 0 }, [
          $[1] || ($[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Tl, "+" + s(c.rounds - 8), 1)
        ], 64)) : f("", !0),
        $[3] || ($[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", zl, "≥ " + s(Math.round(c.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, s(c.rounds ? `One pass, then up to ${c.rounds} rounds with up to ${c.extra} new queries each, stopping as soon as confidence reaches ${Math.round(c.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), Ol = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Fl = { class: "fd-grid" }, Pl = { class: "fd-node solid" }, Al = { class: "fd-node" }, Ll = { class: "fd-node" }, Il = { class: "fd-node goal" }, jl = /* @__PURE__ */ j({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(l) {
    const c = l, g = N(() => Math.min(c.queries * c.perQuery, c.cap));
    return ($, d) => (t(), n("figure", Ol, [
      e("div", Fl, [
        e("span", Pl, [
          e("b", null, s(l.fields), 1),
          w(" field" + s(l.fields === 1 ? "" : "s"), 1),
          e("small", null, s(l.parallel) + " at a time", 1)
        ]),
        e("span", Al, [
          e("b", null, s(l.queries), 1),
          d[0] || (d[0] = w(" queries", -1)),
          d[1] || (d[1] = e("small", null, "per field", -1))
        ]),
        e("span", Ll, [
          e("b", null, s(l.perQuery), 1),
          d[2] || (d[2] = w(" chunks", -1)),
          d[3] || (d[3] = e("small", null, "per query", -1))
        ]),
        e("span", Il, [
          e("b", null, s(g.value), 1),
          d[4] || (d[4] = w(" chunks", -1)),
          e("small", null, s(l.queries * l.perQuery > l.cap ? `capped at ${l.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + s(g.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), Wl = ["disabled"], Ql = { class: "muted" }, Jl = {
  key: 0,
  class: "toggle-row"
}, Kl = { class: "label-block" }, Hl = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "scope-label"
}, Xl = ["aria-checked", "onClick"], Yl = ["id"], Gl = {
  key: 0,
  class: "model-role",
  id: "model-deep-query"
}, Zl = {
  key: 4,
  class: "label-block"
}, _l = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "outline-label"
}, et = ["aria-checked"], lt = ["aria-checked"], tt = { class: "grid" }, nt = ["onUpdate:modelValue"], st = ["onUpdate:modelValue"], at = ["onUpdate:modelValue"], ot = ["onClick"], it = {
  key: 0,
  class: "muted"
}, dt = { class: "toggle-row" }, ut = { class: "toggle-row" }, rt = { class: "mono" }, ct = { class: "toggle-row" }, mt = {
  key: 9,
  class: "toggle-row"
}, vt = /* @__PURE__ */ j({
  __name: "StepInspector",
  props: {
    step: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(l) {
    const c = l, g = [{ value: "outline", label: "Outline" }, { value: "section", label: "Section" }, { value: "chunk", label: "Chunk" }], $ = Xe(), d = (x) => Ze(c.step.kind, x), C = N(() => c.config.fields.filter((x) => x.strategy === "deep").length);
    function V(x, o) {
      const a = c.config.tools.filter((i) => i !== x);
      c.config.tools = o ? [...a, x] : a;
    }
    return (x, o) => (t(), n("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", Ql, s(k(Ye)[l.step.kind]), 1),
      l.step.kind !== "extract" ? (t(), n("div", Jl, [
        o[22] || (o[22] = e("span", null, "Step enabled", -1)),
        p(K, {
          modelValue: l.step.enabled,
          "onUpdate:modelValue": o[0] || (o[0] = (a) => l.step.enabled = a),
          label: "Enable step",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : f("", !0),
      l.step.kind === "scout" ? (t(), H(Dl, {
        key: 1,
        rounds: l.step.options.max_iterations,
        confidence: l.step.options.target_confidence,
        extra: l.step.options.max_extra_queries
      }, null, 8, ["rounds", "confidence", "extra"])) : f("", !0),
      l.step.kind === "deep" ? (t(), H(jl, {
        key: 2,
        fields: C.value,
        parallel: l.step.options.parallel_fields,
        queries: l.step.options.max_queries,
        "per-query": l.step.options.chunks_per_query,
        cap: l.step.options.chunk_cap
      }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"])) : f("", !0),
      e("div", Kl, [
        o[23] || (o[23] = e("span", { id: "scope-label" }, "Reads at", -1)),
        e("div", Hl, [
          (t(), n(S, null, M(g, (a) => e("button", {
            key: a.value,
            type: "button",
            role: "radio",
            "aria-checked": l.step.scope === a.value,
            onClick: (i) => l.step.scope = a.value
          }, s(a.label), 9, Xl)), 64))
        ]),
        o[24] || (o[24] = e("small", null, "Outline sees headings only, section reads whole sections, chunk reads retrieved passages.", -1))
      ]),
      l.step.model !== void 0 ? (t(), n(S, { key: 3 }, [
        o[26] || (o[26] = e("h4", null, "Models", -1)),
        e("div", {
          class: "model-role",
          id: `model-${l.step.kind}`
        }, [
          e("span", null, s(l.step.kind === "deep" ? "Analysis" : l.step.kind === "scout" ? "Scout" : l.step.kind === "verify" ? "Checker" : l.step.kind === "map" ? "Outliner" : "Extraction"), 1),
          p(de, {
            value: l.step.model,
            capability: "generate",
            "labelled-by": `model-${l.step.kind}`,
            onSelect: o[1] || (o[1] = (a) => l.step.model = a)
          }, null, 8, ["value", "labelled-by"])
        ], 8, Yl),
        l.step.kind === "deep" ? (t(), n("div", Gl, [
          o[25] || (o[25] = e("span", null, "Query writer", -1)),
          p(de, {
            value: l.step.options.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: o[2] || (o[2] = (a) => l.step.options.query_model = a)
          }, null, 8, ["value"])
        ])) : f("", !0)
      ], 64)) : f("", !0),
      l.step.kind === "map" ? (t(), n("div", Zl, [
        o[27] || (o[27] = e("span", { id: "outline-label" }, "Outline", -1)),
        e("div", _l, [
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": l.step.options.outline_mode === "find_or_build",
            onClick: o[3] || (o[3] = (a) => l.step.options.outline_mode = "find_or_build")
          }, "Use contents first", 8, et),
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": l.step.options.outline_mode === "build",
            onClick: o[4] || (o[4] = (a) => l.step.options.outline_mode = "build")
          }, "Always build", 8, lt)
        ]),
        o[28] || (o[28] = e("small", null, "Using the document's own table of contents is faster when it has one.", -1))
      ])) : f("", !0),
      l.step.kind === "prefetch" ? (t(), n(S, { key: 5 }, [
        o[32] || (o[32] = e("h4", null, "Queries", -1)),
        (t(!0), n(S, null, M(l.step.options.queries, (a, i) => (t(), n("div", {
          key: i,
          class: "query-row"
        }, [
          e("div", tt, [
            e("label", null, [
              o[29] || (o[29] = w("Name", -1)),
              D(e("input", {
                "onUpdate:modelValue": (v) => a.name = v,
                placeholder: "Parties"
              }, null, 8, nt), [
                [J, a.name]
              ])
            ]),
            e("label", null, [
              o[30] || (o[30] = w("Chunks", -1)),
              D(e("input", {
                "onUpdate:modelValue": (v) => a.chunks = v,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, st), [
                [
                  J,
                  a.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            o[31] || (o[31] = w("Query", -1)),
            D(e("textarea", {
              "onUpdate:modelValue": (v) => a.query = v,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, at), [
              [J, a.query]
            ])
          ]),
          l.readonly ? f("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (v) => l.step.options.queries.splice(i, 1)
          }, "Remove query", 8, ot))
        ]))), 128)),
        l.step.options.queries.length ? f("", !0) : (t(), n("p", it, "No queries. Field search hints still run.")),
        l.readonly ? f("", !0) : (t(), n("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: o[5] || (o[5] = (a) => l.step.options.queries.push(k(Ge)()))
        }, "Add query"))
      ], 64)) : f("", !0),
      l.step.kind === "scout" ? (t(), n(S, { key: 6 }, [
        o[35] || (o[35] = e("h4", null, "Loop", -1)),
        p(Q, {
          modelValue: l.step.options.max_iterations,
          "onUpdate:modelValue": o[6] || (o[6] = (a) => l.step.options.max_iterations = a),
          label: "Follow-up rounds",
          min: d("max_iterations").min,
          max: d("max_iterations").max,
          hints: ["Single pass", "Thorough"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.target_confidence,
          "onUpdate:modelValue": o[7] || (o[7] = (a) => l.step.options.target_confidence = a),
          label: "Stop at confidence",
          min: d("target_confidence").min,
          max: d("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.max_extra_queries,
          "onUpdate:modelValue": o[8] || (o[8] = (a) => l.step.options.max_extra_queries = a),
          label: "New queries per round",
          min: d("max_extra_queries").min,
          max: d("max_extra_queries").max,
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.max_tokens,
          "onUpdate:modelValue": o[9] || (o[9] = (a) => l.step.options.max_tokens = a),
          label: "Scout output limit",
          min: d("max_tokens").min,
          max: d("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", dt, [
          o[33] || (o[33] = e("span", null, [
            w("Drop noisy chunks"),
            e("small", null, "Chunks the scout judges irrelevant leave the evidence set.")
          ], -1)),
          p(K, {
            modelValue: l.step.options.drop_noise,
            "onUpdate:modelValue": o[10] || (o[10] = (a) => l.step.options.drop_noise = a),
            label: "Drop noisy chunks",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", ut, [
          o[34] || (o[34] = e("span", null, [
            w("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          p(K, {
            modelValue: l.config.shared_context,
            "onUpdate:modelValue": o[11] || (o[11] = (a) => l.config.shared_context = a),
            label: "Share scout notes with extraction",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        o[36] || (o[36] = e("h4", null, "Agent tools", -1)),
        (t(!0), n(S, null, M(k($), (a) => (t(), n("div", {
          key: a,
          class: "toggle-row"
        }, [
          e("span", null, [
            w(s(k(qe)(a)), 1),
            e("small", rt, s(a), 1)
          ]),
          p(K, {
            "model-value": l.config.tools.includes(a),
            label: k(qe)(a),
            disabled: l.readonly,
            "onUpdate:modelValue": (i) => V(a, i)
          }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
        ]))), 128))
      ], 64)) : f("", !0),
      l.step.kind === "deep" ? (t(), n(S, { key: 7 }, [
        o[37] || (o[37] = e("h4", null, "Reach", -1)),
        p(Q, {
          modelValue: l.step.options.parallel_fields,
          "onUpdate:modelValue": o[12] || (o[12] = (a) => l.step.options.parallel_fields = a),
          label: "Fields at a time",
          min: d("parallel_fields").min,
          max: d("parallel_fields").max,
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.max_queries,
          "onUpdate:modelValue": o[13] || (o[13] = (a) => l.step.options.max_queries = a),
          label: "Queries per field",
          min: d("max_queries").min,
          max: d("max_queries").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.chunks_per_query,
          "onUpdate:modelValue": o[14] || (o[14] = (a) => l.step.options.chunks_per_query = a),
          label: "Chunks per query",
          min: d("chunks_per_query").min,
          max: d("chunks_per_query").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.chunk_cap,
          "onUpdate:modelValue": o[15] || (o[15] = (a) => l.step.options.chunk_cap = a),
          label: "Chunk cap per field",
          min: d("chunk_cap").min,
          max: d("chunk_cap").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.min_similarity,
          "onUpdate:modelValue": o[16] || (o[16] = (a) => l.step.options.min_similarity = a),
          label: "Minimum similarity",
          min: d("min_similarity").min,
          max: d("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        o[38] || (o[38] = e("h4", null, "Temperature", -1)),
        p(Q, {
          modelValue: l.step.options.query_temperature,
          "onUpdate:modelValue": o[17] || (o[17] = (a) => l.step.options.query_temperature = a),
          label: "Query writing",
          min: d("query_temperature").min,
          max: d("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        p(Q, {
          modelValue: l.step.options.analysis_temperature,
          "onUpdate:modelValue": o[18] || (o[18] = (a) => l.step.options.analysis_temperature = a),
          label: "Analysis",
          min: d("analysis_temperature").min,
          max: d("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : f("", !0),
      l.step.kind === "extract" ? (t(), n(S, { key: 8 }, [
        p(Q, {
          modelValue: l.step.options.max_output_tokens,
          "onUpdate:modelValue": o[19] || (o[19] = (a) => l.step.options.max_output_tokens = a),
          label: "Output limit",
          min: d("max_output_tokens").min,
          max: d("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", ct, [
          o[39] || (o[39] = e("span", null, [
            w("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          p(K, {
            modelValue: l.step.options.structured_output,
            "onUpdate:modelValue": o[20] || (o[20] = (a) => l.step.options.structured_output = a),
            label: "Structured output",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : f("", !0),
      l.step.kind === "verify" ? (t(), n("div", mt, [
        o[40] || (o[40] = e("span", null, [
          w("Check every value"),
          e("small", null, "Off checks only values that carry evidence.")
        ], -1)),
        p(K, {
          modelValue: l.step.options.require_all_values,
          "onUpdate:modelValue": o[21] || (o[21] = (a) => l.step.options.require_all_values = a),
          label: "Check every value",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : f("", !0)
    ], 8, Wl));
  }
}), bt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, yt = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, ft = ["x", "y", "width"], pt = ["x", "width"], ht = /* @__PURE__ */ j({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(l) {
    const c = l, g = N(() => Math.min(0.9, Math.max(0, c.overlap / c.size))), $ = N(() => {
      const d = 100 / (3 - 2 * g.value);
      return [0, 1, 2].map((C) => ({ x: C * d * (1 - g.value), w: d }));
    });
    return (d, C) => (t(), n("figure", bt, [
      (t(), n("svg", yt, [
        (t(!0), n(S, null, M($.value, (V, x) => (t(), n("rect", {
          key: x,
          x: V.x,
          y: x % 2 ? 14 : 4,
          width: V.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, ft))), 128)),
        (t(), n(S, null, M([1, 2], (V) => e("rect", {
          key: "o" + V,
          x: $.value[V].x,
          y: 4,
          width: $.value[V - 1].x + $.value[V - 1].w - $.value[V].x,
          height: "24",
          class: "shared"
        }, null, 8, pt)), 64))
      ])),
      e("figcaption", null, s(l.size.toLocaleString()) + " tokens per chunk · " + s(l.overlap.toLocaleString()) + " shared with the next (" + s(Math.round(g.value * 100)) + "%)", 1)
    ]));
  }
}), kt = ["disabled"], gt = { class: "muted" }, $t = { class: "toggle-row" }, xt = { class: "label-block" }, wt = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, Vt = ["aria-checked", "onClick"], Ct = { class: "toggle-row" }, St = {
  class: "model-role",
  id: "embedding-model"
}, qt = { class: "toggle-row" }, Ut = {
  key: 0,
  class: "model-role",
  id: "highlighter-model"
}, Mt = /* @__PURE__ */ j({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(l) {
    const c = l, g = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], $ = ce("chunk_size"), d = ce("overlap"), C = ce("top_results"), V = N(() => Math.min(d.max, c.config.retrieval.chunk_size - 50)), x = N(() => g.find((o) => o.value === c.config.retrieval.search_mode)?.note);
    return (o, a) => (t(), n("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", gt, "The upload's text is split into chunks and indexed for this run. Processed copies expire after " + s(l.retention) + ".", 1),
      a[14] || (a[14] = e("h4", null, "Chunks", -1)),
      p(ht, {
        size: l.config.retrieval.chunk_size,
        overlap: l.config.retrieval.overlap
      }, null, 8, ["size", "overlap"]),
      p(Q, {
        modelValue: l.config.retrieval.chunk_size,
        "onUpdate:modelValue": a[0] || (a[0] = (i) => l.config.retrieval.chunk_size = i),
        label: "Chunk size",
        min: k($).min,
        max: k($).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      p(Q, {
        modelValue: l.config.retrieval.overlap,
        "onUpdate:modelValue": a[1] || (a[1] = (i) => l.config.retrieval.overlap = i),
        label: "Overlap",
        min: k(d).min,
        max: V.value,
        step: 10,
        unit: "tokens",
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", $t, [
        a[8] || (a[8] = e("span", null, [
          w("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        p(K, {
          modelValue: l.config.retrieval.split_headings,
          "onUpdate:modelValue": a[2] || (a[2] = (i) => l.config.retrieval.split_headings = i),
          label: "Split by headings",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a[15] || (a[15] = e("h4", null, "Search", -1)),
      e("div", xt, [
        a[9] || (a[9] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", wt, [
          (t(), n(S, null, M(g, (i) => e("button", {
            key: i.value,
            type: "button",
            role: "radio",
            "aria-checked": l.config.retrieval.search_mode === i.value,
            onClick: (v) => l.config.retrieval.search_mode = i.value
          }, s(i.label), 9, Vt)), 64))
        ]),
        e("small", null, s(x.value), 1)
      ]),
      p(Q, {
        modelValue: l.config.retrieval.top_results,
        "onUpdate:modelValue": a[3] || (a[3] = (i) => l.config.retrieval.top_results = i),
        label: "Results per query",
        min: k(C).min,
        max: k(C).max,
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", Ct, [
        a[10] || (a[10] = e("span", null, [
          w("Contextual embeddings"),
          e("small", null, "Prepend section context to each chunk before embedding.")
        ], -1)),
        p(K, {
          modelValue: l.config.retrieval.contextual_embeddings,
          "onUpdate:modelValue": a[4] || (a[4] = (i) => l.config.retrieval.contextual_embeddings = i),
          label: "Contextual embeddings",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a[16] || (a[16] = e("h4", null, "Models", -1)),
      e("div", St, [
        a[11] || (a[11] = e("span", null, "Embedding", -1)),
        p(de, {
          value: l.config.retrieval.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: a[5] || (a[5] = (i) => l.config.retrieval.embedding_model = i)
        }, null, 8, ["value"])
      ]),
      e("div", qt, [
        a[12] || (a[12] = e("span", null, [
          w("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        p(K, {
          modelValue: l.config.retrieval.highlighter,
          "onUpdate:modelValue": a[6] || (a[6] = (i) => l.config.retrieval.highlighter = i),
          label: "Highlighter",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.config.retrieval.highlighter ? (t(), n("div", Ut, [
        a[13] || (a[13] = e("span", null, "Highlighter", -1)),
        p(de, {
          value: l.config.retrieval.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: a[7] || (a[7] = (i) => l.config.retrieval.highlighter_model = i)
        }, null, 8, ["value"])
      ])) : f("", !0)
    ], 8, kt));
  }
}), Nt = { class: "canvas" }, Et = { class: "canvas-inner" }, Bt = {
  class: "block",
  "aria-labelledby": "fields-head"
}, Rt = { class: "block-head" }, Tt = ["aria-expanded"], zt = { class: "count" }, Dt = {
  key: 0,
  class: "block-peek"
}, Ot = {
  id: "fields-body",
  class: "block-body"
}, Ft = {
  key: 0,
  class: "block-empty"
}, Pt = {
  key: 1,
  class: "rows"
}, At = ["onClick"], Lt = { class: "row-name" }, It = {
  key: 0,
  class: "req",
  title: "Required"
}, jt = { class: "chips" }, Wt = ["title"], Qt = { class: "chip" }, Jt = {
  key: 1,
  class: "chip",
  title: "Evidence required"
}, Kt = {
  key: 0,
  class: "row-actions"
}, Ht = ["disabled", "onClick"], Xt = ["disabled", "onClick"], Yt = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Gt = { class: "block-head" }, Zt = ["aria-expanded"], _t = { class: "count" }, en = {
  key: 0,
  class: "block-peek"
}, ln = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, tn = { class: "node-icon" }, nn = { class: "node-main" }, sn = { class: "node-summary" }, an = {
  key: 0,
  class: "chips"
}, on = { class: "chip" }, dn = { class: "node-side" }, un = { class: "chip model" }, rn = ["onClick", "onKeydown"], cn = { class: "node-icon" }, mn = { class: "node-main" }, vn = { class: "node-title" }, bn = { class: "scope" }, yn = { class: "node-summary" }, fn = {
  key: 0,
  class: "chips"
}, pn = {
  key: 1,
  class: "chips"
}, hn = {
  key: 2,
  class: "chips"
}, kn = {
  key: 3,
  class: "trace-line"
}, gn = { class: "node-side" }, $n = {
  key: 0,
  class: "chip model"
}, xn = {
  key: 1,
  class: "node-actions"
}, wn = ["aria-label", "onClick"], Vn = ["aria-label", "onClick"], Cn = { class: "node-icon" }, Sn = { class: "node-main" }, qn = { class: "node-summary" }, Un = ["aria-valuenow"], Mn = { class: "side-panel-head" }, Nn = { class: "side-panel-icon" }, En = ["disabled"], Bn = {
  key: 4,
  class: "inspector-form"
}, Rn = { class: "output-list" }, Tn = { class: "mono" }, zn = { class: "chip" }, Dn = { class: "rail-label" }, ve = 400, oe = 320, On = /* @__PURE__ */ j({
  __name: "Builder",
  props: /* @__PURE__ */ fe({
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
  setup(l) {
    const c = l, g = ie(l, "title"), $ = ie(l, "description"), d = E({ kind: "document" });
    function C(r, m) {
      try {
        const y = localStorage.getItem(`docscout.${r}`);
        return y === null ? m : y === "1";
      } catch {
        return m;
      }
    }
    function V(r, m) {
      try {
        localStorage.setItem(`docscout.${r}`, m ? "1" : "0");
      } catch {
      }
    }
    const x = E(C("panel", !0)), o = E(C("fields", !0)), a = E(C("flow", !0));
    function i() {
      try {
        const r = Number(localStorage.getItem("docscout.panelWidth"));
        return r >= oe ? r : ve;
      } catch {
        return ve;
      }
    }
    const v = E(i()), A = () => {
      const r = R.value?.clientWidth;
      return r ? Math.max(oe, r - 420) : Number.POSITIVE_INFINITY;
    };
    function b(r, m = !0) {
      if (v.value = Math.round(Math.min(A(), Math.max(oe, r))), m)
        try {
          localStorage.setItem("docscout.panelWidth", String(v.value));
        } catch {
        }
    }
    const q = E(!1);
    function W(r) {
      const m = r.currentTarget, y = r.clientX, P = v.value;
      m.setPointerCapture(r.pointerId), q.value = !0;
      const T = (je) => b(P + (y - je.clientX), !1), Ve = () => {
        q.value = !1, b(v.value), m.removeEventListener("pointermove", T), m.removeEventListener("pointerup", Ve);
      };
      m.addEventListener("pointermove", T), m.addEventListener("pointerup", Ve);
    }
    function le(r) {
      r.key === "ArrowLeft" ? (b(v.value + 24), r.preventDefault()) : r.key === "ArrowRight" && (b(v.value - 24), r.preventDefault());
    }
    function z(r) {
      x.value = r, L.value || V("panel", r);
    }
    function O(r) {
      const m = r === "fields" ? o : a;
      m.value = !m.value, V(r, m.value);
    }
    const R = E(), L = E(!1);
    let Y;
    pe(() => {
      Y = new ResizeObserver(([r]) => {
        const m = L.value;
        L.value = r.contentRect.width < 1e3, L.value && !m && (x.value = !1), !L.value && m && (x.value = C("panel", !0));
      }), R.value && Y.observe(R.value);
    }), Ee(() => Y?.disconnect());
    const te = E();
    _(d, async () => {
      await We(), te.value && (te.value.scrollTop = 0);
    });
    function U(r) {
      d.value = r, x.value = !0;
    }
    const h = (r) => r.kind === "step" ? d.value.kind === "step" && d.value.step === r.step : JSON.stringify(r) === JSON.stringify(d.value), u = N(() => d.value.kind === "field" ? c.config.fields[d.value.index] : void 0), F = N(() => {
      const r = d.value;
      return r.kind === "step" ? G[r.step.kind] : r.kind === "field" ? u.value?.name || "New field" : r.kind === "document" ? "Read document" : r.kind === "output" ? "Output" : "Details";
    }), ze = N(() => {
      const r = d.value;
      return r.kind === "step" ? ye[r.step.kind] : r.kind === "field" ? "tabler:forms" : r.kind === "document" ? "tabler:file-text" : r.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), De = N(() => c.config.fields.filter((r, m) => !(d.value.kind === "field" && d.value.index === m)).map((r) => r.name)), ue = N(() => !!c.config.workflow.find((r) => r.kind === "deep")?.enabled), he = (r) => Re(c.config.fields[r], c.config.fields.filter((m, y) => y !== r).map((m) => m.name)), ke = N(() => c.config.fields.filter((r) => r.strategy === "deep")), ge = N(() => c.config.fields.filter((r) => r.search_hints.trim())), Oe = N(() => c.config.workflow.filter((r) => r.enabled).map((r) => G[r.kind]).join(" → ")), Fe = N(() => c.config.fields.map((r) => r.name || "New field").join(", ")), Pe = N(() => c.config.workflow.filter((r) => r.enabled).length), re = (r) => c.result?.trace.find((m) => m.kind === r), Ae = (r) => [`${(r.duration_ms / 1e3).toFixed(1)}s`, `${(r.input_tokens + r.output_tokens).toLocaleString()} tokens`, r.queries?.length ? `${r.queries.length} queries` : "", r.message ?? ""].filter(Boolean).join(" · ");
    function Le() {
      c.config.fields.push(ll()), o.value = !0, U({ kind: "field", index: c.config.fields.length - 1 });
    }
    function Ie(r) {
      c.config.fields.splice(r, 1), d.value = { kind: "document" };
    }
    function $e(r, m) {
      const y = c.config.fields, P = r + m;
      if (P < 0 || P >= y.length) return;
      const [T] = y.splice(r, 1);
      y.splice(P, 0, T), d.value = { kind: "field", index: P };
    }
    const xe = (r) => r.type === "list" ? `list of ${r.item_type}` : r.type, we = N({ get: () => c.config.tags.join(", "), set: (r) => {
      c.config.tags = [...new Set(r.split(",").map((m) => m.trim()).filter(Boolean))];
    } });
    return (r, m) => (t(), n("div", {
      ref_key: "root",
      ref: R,
      class: I(["builder", { narrow: L.value, "panel-open": x.value, resizing: q.value }])
    }, [
      e("div", Nt, [
        e("div", Et, [
          e("section", Bt, [
            e("header", Rt, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": o.value,
                "aria-controls": "fields-body",
                onClick: m[0] || (m[0] = (y) => O("fields"))
              }, [
                p(k(B), {
                  icon: o.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[13] || (m[13] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", zt, s(l.config.fields.length), 1)
              ], 8, Tt),
              !o.value && l.config.fields.length ? (t(), n("span", Dt, s(Fe.value), 1)) : f("", !0),
              l.readonly ? f("", !0) : (t(), n("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: Le
              }, [
                p(k(B), { icon: "tabler:plus" }),
                m[14] || (m[14] = w("Add field", -1))
              ]))
            ]),
            D(e("div", Ot, [
              l.config.fields.length ? (t(), n("ul", Pt, [
                (t(!0), n(S, null, M(l.config.fields, (y, P) => (t(), n("li", {
                  key: P,
                  class: I(["row-item", { active: h({ kind: "field", index: P }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (T) => U({ kind: "field", index: P })
                  }, [
                    e("span", Lt, [
                      w(s(y.name || "New field"), 1),
                      y.required ? (t(), n("span", It, "*")) : f("", !0),
                      he(P) ? (t(), H(k(B), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: he(P)
                      }, null, 8, ["title"])) : f("", !0)
                    ]),
                    e("span", {
                      class: I(["row-desc", { missing: !y.description }])
                    }, s(y.description || "No description"), 3),
                    e("span", jt, [
                      y.strategy === "deep" ? (t(), n("span", {
                        key: 0,
                        class: I(["chip", ue.value ? "primary" : "muted-chip"]),
                        title: ue.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, Wt)) : f("", !0),
                      e("span", Qt, s(xe(y)), 1),
                      y.evidence_required ? (t(), n("span", Jt, [
                        p(k(B), { icon: "tabler:quote" })
                      ])) : f("", !0)
                    ])
                  ], 8, At),
                  l.readonly ? f("", !0) : (t(), n("span", Kt, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: P === 0,
                      onClick: (T) => $e(P, -1)
                    }, [
                      p(k(B), { icon: "tabler:chevron-up" })
                    ], 8, Ht),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: P === l.config.fields.length - 1,
                      onClick: (T) => $e(P, 1)
                    }, [
                      p(k(B), { icon: "tabler:chevron-down" })
                    ], 8, Xt)
                  ]))
                ], 2))), 128))
              ])) : (t(), n("p", Ft, "Add the values to pull from each document."))
            ], 512), [
              [be, o.value]
            ])
          ]),
          e("section", Yt, [
            e("header", Gt, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": a.value,
                "aria-controls": "flow-body",
                onClick: m[1] || (m[1] = (y) => O("flow"))
              }, [
                p(k(B), {
                  icon: a.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                m[15] || (m[15] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", _t, s(Pe.value) + " of " + s(l.config.workflow.length), 1)
              ], 8, Zt),
              a.value ? f("", !0) : (t(), n("span", en, s(Oe.value), 1)),
              e("button", {
                type: "button",
                class: I(["btn small subtle push", { on: h({ kind: "details" }) }]),
                onClick: m[2] || (m[2] = (y) => U({ kind: "details" }))
              }, [
                p(k(B), { icon: "tabler:info-circle" }),
                m[16] || (m[16] = w("Details", -1))
              ], 2)
            ]),
            D(e("div", ln, [
              e("button", {
                type: "button",
                class: I(["node fixed", { active: h({ kind: "document" }) }]),
                onClick: m[3] || (m[3] = (y) => U({ kind: "document" }))
              }, [
                e("span", tn, [
                  p(k(B), { icon: "tabler:file-text" })
                ]),
                e("span", nn, [
                  m[17] || (m[17] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", sn, s(k(_e)(l.config.retrieval)), 1),
                  l.config.retrieval.highlighter ? (t(), n("span", an, [
                    e("span", on, "Highlighter · " + s(k(me)(l.config.retrieval.highlighter_model)), 1)
                  ])) : f("", !0)
                ]),
                e("span", dn, [
                  e("span", un, s(k(me)(l.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              (t(!0), n(S, null, M(l.config.workflow, (y, P) => (t(), n(S, {
                key: y.kind
              }, [
                e("div", {
                  class: I(["connector", { off: !y.enabled }])
                }, null, 2),
                e("div", {
                  class: I(["node", { active: h({ kind: "step", step: y }), off: !y.enabled }]),
                  role: "button",
                  tabindex: "0",
                  onClick: (T) => U({ kind: "step", step: y }),
                  onKeydown: Qe((T) => U({ kind: "step", step: y }), ["enter"])
                }, [
                  e("span", cn, [
                    p(k(B), {
                      icon: k(ye)[y.kind]
                    }, null, 8, ["icon"])
                  ]),
                  e("span", mn, [
                    e("span", vn, [
                      w(s(k(G)[y.kind]), 1),
                      e("span", bn, s(y.scope), 1)
                    ]),
                    e("span", yn, s(y.enabled ? k(el)(y, l.config) : "Off"), 1),
                    y.enabled && y.kind === "deep" && ke.value.length ? (t(), n("span", fn, [
                      (t(!0), n(S, null, M(ke.value, (T) => (t(), n("span", {
                        key: T.name,
                        class: "chip primary"
                      }, s(T.name || "New field"), 1))), 128))
                    ])) : f("", !0),
                    y.enabled && y.kind === "prefetch" && (y.options.queries.length || ge.value.length) ? (t(), n("span", pn, [
                      (t(!0), n(S, null, M(y.options.queries, (T) => (t(), n("span", {
                        key: "q" + T.name,
                        class: "chip"
                      }, s(T.name || "Untitled query"), 1))), 128)),
                      (t(!0), n(S, null, M(ge.value, (T) => (t(), n("span", {
                        key: "f" + T.name,
                        class: "chip muted-chip"
                      }, s(T.name), 1))), 128))
                    ])) : f("", !0),
                    y.enabled && y.kind === "scout" && l.config.tools.length ? (t(), n("span", hn, [
                      (t(!0), n(S, null, M(l.config.tools, (T) => (t(), n("span", {
                        key: T,
                        class: "chip"
                      }, s(T.split(":").pop()?.replace(/_/g, " ")), 1))), 128))
                    ])) : f("", !0),
                    re(y.kind) ? (t(), n("span", kn, [
                      p(k(B), {
                        icon: re(y.kind).status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
                      }, null, 8, ["icon"]),
                      w(s(Ae(re(y.kind))), 1)
                    ])) : f("", !0)
                  ]),
                  e("span", gn, [
                    y.enabled && y.model ? (t(), n("span", $n, s(k(me)(y.model)), 1)) : f("", !0),
                    l.readonly ? f("", !0) : (t(), n("span", xn, [
                      k(Ue)(l.config, P, -1) ? (t(), n("button", {
                        key: 0,
                        type: "button",
                        class: "icon-btn",
                        "aria-label": `Move ${k(G)[y.kind]} up`,
                        onClick: ne((T) => k(Me)(l.config, P, -1), ["stop"])
                      }, [
                        p(k(B), { icon: "tabler:arrow-up" })
                      ], 8, wn)) : f("", !0),
                      k(Ue)(l.config, P, 1) ? (t(), n("button", {
                        key: 1,
                        type: "button",
                        class: "icon-btn",
                        "aria-label": `Move ${k(G)[y.kind]} down`,
                        onClick: ne((T) => k(Me)(l.config, P, 1), ["stop"])
                      }, [
                        p(k(B), { icon: "tabler:arrow-down" })
                      ], 8, Vn)) : f("", !0),
                      y.kind !== "extract" ? (t(), H(K, {
                        key: 2,
                        modelValue: y.enabled,
                        "onUpdate:modelValue": (T) => y.enabled = T,
                        label: `Enable ${k(G)[y.kind]}`
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])) : f("", !0)
                    ]))
                  ])
                ], 42, rn)
              ], 64))), 128)),
              m[19] || (m[19] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: I(["node fixed", { active: h({ kind: "output" }) }]),
                onClick: m[4] || (m[4] = (y) => U({ kind: "output" }))
              }, [
                e("span", Cn, [
                  p(k(B), { icon: "tabler:braces" })
                ]),
                e("span", Sn, [
                  m[18] || (m[18] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", qn, s(l.config.fields.length ? `${l.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [be, a.value]
            ])
          ])
        ])
      ]),
      L.value && x.value ? (t(), n("div", {
        key: 0,
        class: "scrim",
        onClick: m[5] || (m[5] = (y) => z(!1))
      })) : f("", !0),
      x.value ? (t(), n("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: ee(L.value ? void 0 : { width: `${v.value}px` })
      }, [
        L.value ? f("", !0) : (t(), n("div", {
          key: 0,
          class: I(["resizer", { active: q.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": v.value,
          "aria-valuemin": oe,
          onPointerdown: ne(W, ["prevent"]),
          onKeydown: le,
          onDblclick: m[6] || (m[6] = (y) => b(ve))
        }, null, 42, Un)),
        e("header", Mn, [
          e("span", Nn, [
            p(k(B), { icon: ze.value }, null, 8, ["icon"])
          ]),
          e("h2", null, s(F.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: m[7] || (m[7] = (y) => z(!1))
          }, [
            p(k(B), {
              icon: L.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: te,
          class: "side-panel-body"
        }, [
          d.value.kind === "document" ? (t(), H(Mt, {
            key: 0,
            config: l.config,
            retention: l.retention,
            readonly: l.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "step" ? (t(), H(vt, {
            key: 1,
            step: d.value.step,
            config: l.config,
            readonly: l.readonly
          }, null, 8, ["step", "config", "readonly"])) : d.value.kind === "field" && u.value ? (t(), H(gl, {
            key: 2,
            field: u.value,
            "other-names": De.value,
            "deep-enabled": ue.value,
            readonly: l.readonly,
            onRemove: m[8] || (m[8] = (y) => Ie(d.value.index))
          }, null, 8, ["field", "other-names", "deep-enabled", "readonly"])) : d.value.kind === "details" ? (t(), n("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: l.readonly
          }, [
            e("label", null, [
              m[20] || (m[20] = w("Name", -1)),
              D(e("input", {
                "onUpdate:modelValue": m[9] || (m[9] = (y) => g.value = y),
                "aria-label": "Extractor name"
              }, null, 512), [
                [J, g.value]
              ])
            ]),
            e("label", null, [
              m[21] || (m[21] = w("Description", -1)),
              D(e("textarea", {
                "onUpdate:modelValue": m[10] || (m[10] = (y) => $.value = y),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [J, $.value]
              ])
            ]),
            e("label", null, [
              m[22] || (m[22] = w("Tags", -1)),
              D(e("input", {
                "onUpdate:modelValue": m[11] || (m[11] = (y) => we.value = y),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  J,
                  we.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              m[23] || (m[23] = e("small", null, "Comma separated", -1))
            ])
          ], 8, En)) : d.value.kind === "output" ? (t(), n("div", Bn, [
            m[24] || (m[24] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", Rn, [
              (t(!0), n(S, null, M(l.config.fields, (y) => (t(), n("li", {
                key: y.name
              }, [
                e("span", Tn, s(y.name || "New field"), 1),
                e("span", zn, s(xe(y)), 1)
              ]))), 128))
            ]),
            m[25] || (m[25] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : f("", !0)
        ], 512)
      ], 4)) : L.value ? f("", !0) : (t(), n("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: m[12] || (m[12] = (y) => z(!0))
      }, [
        p(k(B), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", Dn, s(F.value), 1)
      ]))
    ], 2));
  }
}), Fn = ["selected"], Pn = {
  key: 1,
  role: "alert"
}, An = {
  key: 2,
  class: "muted"
}, Te = /* @__PURE__ */ j({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(l, { emit: c }) {
    const g = c, $ = E(!1), d = E("");
    pe(async () => {
      try {
        await Be("wc-multiselect", { timeoutMs: 8e3 }), $.value = !0;
      } catch (V) {
        d.value = String(V);
      }
    });
    function C(V) {
      const x = V.detail;
      g("select", x.selected[0] || "", x.labels?.[0] || "");
    }
    return (V, x) => $.value ? (t(), n("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(l.value ? [l.value] : []),
      placeholder: "Choose an upload",
      onChange: C
    }, null, 40, Fn)) : d.value ? (t(), n("p", Pn, s(d.value), 1)) : (t(), n("span", An, "Loading uploads…"));
  }
}), Ln = { class: "test" }, In = { class: "run-bar" }, jn = { class: "run-input" }, Wn = { class: "muted run-note" }, Qn = {
  key: 0,
  class: "empty"
}, Jn = {
  key: 1,
  class: "test-grid"
}, Kn = { class: "block" }, Hn = { class: "block-head" }, Xn = { class: "muted push" }, Yn = { class: "value-list" }, Gn = ["aria-expanded", "onClick"], Zn = { class: "value-name" }, _n = { class: "value-text" }, es = { class: "bar" }, ls = { class: "evidence" }, ts = {
  key: 0,
  class: "muted"
}, ns = { class: "block" }, ss = { class: "timeline" }, as = { class: "tl-icon" }, os = { class: "tl-main" }, is = { class: "tl-head" }, ds = { class: "muted push" }, us = { class: "tl-bar" }, rs = { class: "muted" }, cs = {
  key: 0,
  class: "tl-msg"
}, ms = {
  key: 1,
  class: "chips"
}, vs = /* @__PURE__ */ j({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(l) {
    const c = l, g = E(""), $ = E(), d = (v) => `${Math.round(v * 100)}%`, C = (v) => v == null ? "—" : typeof v == "string" ? v : JSON.stringify(v), V = (v) => `${(v / 1e3).toFixed(1)}s`, x = N(() => Math.max(1, ...c.result?.trace.map((v) => v.duration_ms) ?? [1])), o = (v) => G[v] ?? v, a = (v) => ye[v] ?? "tabler:point", i = (v) => v >= 0.9 ? "high" : v >= 0.7 ? "mid" : "low";
    return (v, A) => (t(), n("div", Ln, [
      e("section", In, [
        e("div", jn, [
          p(Te, {
            value: g.value,
            onSelect: A[0] || (A[0] = (b) => g.value = b)
          }, null, 8, ["value"])
        ]),
        p(k(X), {
          label: "Run extraction",
          disabled: ""
        }),
        e("p", Wn, "Extraction is not available yet. Processed documents and runs expire after " + s(l.retention) + ".", 1)
      ]),
      l.result ? (t(), n("div", Jn, [
        e("section", Kn, [
          e("header", Hn, [
            A[1] || (A[1] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", Xn, [
              w(s(l.result.tokens.toLocaleString()) + " tokens · " + s(V(l.result.duration_ms)), 1),
              l.result.cost !== void 0 ? (t(), n(S, { key: 0 }, [
                w(" · $" + s(l.result.cost.toFixed(3)), 1)
              ], 64)) : f("", !0)
            ])
          ]),
          e("ul", Yn, [
            (t(!0), n(S, null, M(l.result.fields, (b) => (t(), n("li", {
              key: b.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": $.value === b.name,
                onClick: (q) => $.value = $.value === b.name ? void 0 : b.name
              }, [
                e("span", Zn, s(b.name), 1),
                e("span", _n, s(C(b.value)), 1),
                e("span", {
                  class: I(["confidence", i(b.confidence)])
                }, [
                  e("span", es, [
                    e("span", {
                      style: ee({ width: d(b.confidence) })
                    }, null, 4)
                  ]),
                  w(s(d(b.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: I(["chip", b.verified ? "primary" : "muted-chip"])
                }, [
                  p(k(B), {
                    icon: b.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  w(s(b.verified ? "Verified" : "Unverified"), 1)
                ], 2),
                p(k(B), {
                  icon: $.value === b.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, Gn),
              D(e("div", ls, [
                (t(!0), n(S, null, M(b.evidence, (q, W) => (t(), n("blockquote", { key: W }, [
                  e("p", null, "“" + s(q.quote) + "”", 1),
                  e("cite", null, [
                    w(s(q.section), 1),
                    q.page !== void 0 ? (t(), n(S, { key: 0 }, [
                      w(" · Page " + s(q.page), 1)
                    ], 64)) : f("", !0)
                  ])
                ]))), 128)),
                b.evidence.length ? f("", !0) : (t(), n("p", ts, "No evidence."))
              ], 512), [
                [be, $.value === b.name || b.evidence.length === 1]
              ])
            ]))), 128))
          ])
        ]),
        e("section", ns, [
          A[2] || (A[2] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", ss, [
            (t(!0), n(S, null, M(l.result.trace, (b, q) => (t(), n("li", {
              key: q,
              class: I(b.status)
            }, [
              e("span", as, [
                p(k(B), {
                  icon: a(b.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", os, [
                e("div", is, [
                  e("strong", null, s(o(b.kind)), 1),
                  e("span", ds, s(V(b.duration_ms)), 1)
                ]),
                e("span", us, [
                  e("span", {
                    style: ee({ width: `${Math.max(4, b.duration_ms / x.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", rs, [
                  w(s(b.scope), 1),
                  b.model ? (t(), n(S, { key: 0 }, [
                    w(" · " + s(b.model), 1)
                  ], 64)) : f("", !0),
                  w(" · " + s((b.input_tokens + b.output_tokens).toLocaleString()) + " tokens", 1),
                  b.cost !== void 0 ? (t(), n(S, { key: 1 }, [
                    w(" · $" + s(b.cost.toFixed(4)), 1)
                  ], 64)) : f("", !0)
                ]),
                b.message ? (t(), n("p", cs, s(b.message), 1)) : f("", !0),
                b.queries?.length ? (t(), n("div", ms, [
                  (t(!0), n(S, null, M(b.queries, (W) => (t(), n("span", {
                    key: W,
                    class: "chip"
                  }, s(W), 1))), 128))
                ])) : f("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : (t(), n("p", Qn, "No extraction results yet."))
    ]));
  }
}), bs = { class: "evals" }, ys = {
  key: 0,
  class: "stat-row"
}, fs = { class: "stat" }, ps = { class: "stat-label" }, hs = { class: "stat-value" }, ks = { class: "stat" }, gs = { class: "stat-value" }, $s = { class: "stat" }, xs = { class: "stat-value" }, ws = {
  key: 0,
  class: "stat-delta flat"
}, Vs = { class: "stat" }, Cs = { class: "stat-value" }, Ss = { class: "block" }, qs = { class: "block-head" }, Us = {
  key: 0,
  class: "rev-pick push"
}, Ms = ["value"], Ns = ["value"], Es = ["value"], Bs = ["value"], Rs = {
  key: 0,
  class: "block-empty"
}, Ts = {
  key: 1,
  class: "metric-table"
}, zs = { class: "mono" }, Ds = { class: "acc" }, Os = { class: "bar" }, Fs = { class: "acc strong" }, Ps = { class: "bar" }, As = { class: "num muted" }, Ls = { class: "num muted" }, Is = { class: "block" }, js = { class: "block-head" }, Ws = { class: "count" }, Qs = { class: "row push" }, Js = { class: "grid" }, Ks = { class: "mono" }, Hs = ["onUpdate:modelValue"], Xs = ["onUpdate:modelValue"], Ys = ["onUpdate:modelValue"], Gs = ["onUpdate:modelValue", "type"], Zs = {
  key: 0,
  class: "error",
  role: "alert"
}, _s = { class: "row" }, ea = {
  key: 1,
  class: "block-empty"
}, la = {
  key: 2,
  class: "table-scroll"
}, ta = { class: "metric-table" }, na = { class: "num" }, sa = ["aria-label", "disabled", "onClick"], aa = { class: "block" }, oa = { class: "block-head" }, ia = {
  key: 0,
  class: "block-empty"
}, da = { class: "proposal-head" }, ua = { class: "muted" }, ra = { class: "chips" }, ca = { class: "chip" }, ma = { class: "chip" }, va = { class: "changes" }, ba = { class: "row" }, ya = /* @__PURE__ */ j({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(l, { emit: c }) {
    const g = l, $ = c, d = E(!1), C = E(""), V = E(""), x = E({}), o = E("");
    _(() => g.cases, () => {
      d.value = !1, C.value = "", x.value = {};
    });
    function a() {
      o.value = "";
      const U = {};
      try {
        for (const h of g.fields) {
          const u = x.value[h.name] ?? "";
          U[h.name] = ["number", "boolean", "list", "object"].includes(h.type) ? u.trim() ? JSON.parse(u) : null : u;
        }
        $("add-case", { upload_id: C.value, upload_name: V.value, expected: U });
      } catch {
        o.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const i = N(() => [...g.results].sort((U, h) => U.revision - h.revision)), v = E(), A = E(), b = N(() => i.value.find((U) => U.revision === A.value) ?? i.value.at(-1)), q = N(() => i.value.find((U) => U.revision === v.value) ?? i.value.at(-2) ?? i.value.at(-1)), W = (U) => U && U.metrics.length ? U.metrics.reduce((h, u) => h + u.accuracy, 0) / U.metrics.length : 0, le = N(() => [...new Set([...q.value?.metrics ?? [], ...b.value?.metrics ?? []].map((h) => h.field))].map((h) => ({ name: h, a: q.value?.metrics.find((u) => u.field === h), b: b.value?.metrics.find((u) => u.field === h) }))), z = (U) => `${Math.round(U * 100)}%`, O = (U) => `${U > 0 ? "+" : U < 0 ? "−" : ""}${Math.abs(Math.round(U * 100))} pts`, R = (U) => Math.round(U * 100) > 0 ? "up" : Math.round(U * 100) < 0 ? "down" : "flat", L = (U) => `$${U.toFixed(3)}`, Y = (U) => `${(U / 1e3).toFixed(1)}s`, te = (U) => U == null || U === "" ? "—" : typeof U == "string" ? U : JSON.stringify(U);
    return (U, h) => (t(), n("div", bs, [
      b.value ? (t(), n("div", ys, [
        e("div", fs, [
          e("span", ps, "Accuracy · revision " + s(b.value.revision), 1),
          e("span", hs, s(z(W(b.value))), 1),
          q.value && q.value !== b.value ? (t(), n("span", {
            key: 0,
            class: I(["stat-delta", R(W(b.value) - W(q.value))])
          }, s(O(W(b.value) - W(q.value))) + " vs revision " + s(q.value.revision), 3)) : f("", !0)
        ]),
        e("div", ks, [
          h[5] || (h[5] = e("span", { class: "stat-label" }, "Cases", -1)),
          e("span", gs, s(b.value.cases), 1)
        ]),
        e("div", $s, [
          h[6] || (h[6] = e("span", { class: "stat-label" }, "Cost per eval", -1)),
          e("span", xs, s(L(b.value.cost)), 1),
          q.value && q.value !== b.value ? (t(), n("span", ws, s(L(q.value.cost)) + " before", 1)) : f("", !0)
        ]),
        e("div", Vs, [
          h[7] || (h[7] = e("span", { class: "stat-label" }, "Time per eval", -1)),
          e("span", Cs, s(Y(b.value.duration_ms)), 1),
          q.value && q.value !== b.value ? (t(), n("span", {
            key: 0,
            class: I(["stat-delta", b.value.duration_ms < q.value.duration_ms ? "up" : "flat"])
          }, s(Y(q.value.duration_ms)) + " before", 3)) : f("", !0)
        ])
      ])) : f("", !0),
      e("section", Ss, [
        e("header", qs, [
          h[8] || (h[8] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
          i.value.length ? (t(), n("div", Us, [
            e("select", {
              value: q.value?.revision,
              "aria-label": "Baseline revision",
              onChange: h[0] || (h[0] = (u) => v.value = Number(u.target.value))
            }, [
              (t(!0), n(S, null, M(i.value, (u) => (t(), n("option", {
                key: u.revision,
                value: u.revision
              }, "Revision " + s(u.revision), 9, Ns))), 128))
            ], 40, Ms),
            p(k(B), { icon: "tabler:arrow-right" }),
            e("select", {
              value: b.value?.revision,
              "aria-label": "Compared revision",
              onChange: h[1] || (h[1] = (u) => A.value = Number(u.target.value))
            }, [
              (t(!0), n(S, null, M(i.value, (u) => (t(), n("option", {
                key: u.revision,
                value: u.revision
              }, "Revision " + s(u.revision), 9, Bs))), 128))
            ], 40, Es)
          ])) : f("", !0)
        ]),
        i.value.length ? (t(), n("table", Ts, [
          e("thead", null, [
            e("tr", null, [
              h[9] || (h[9] = e("th", null, "Field", -1)),
              e("th", null, "Revision " + s(q.value?.revision), 1),
              e("th", null, "Revision " + s(b.value?.revision), 1),
              h[10] || (h[10] = e("th", null, "Change", -1)),
              h[11] || (h[11] = e("th", { class: "num" }, "Cost", -1)),
              h[12] || (h[12] = e("th", { class: "num" }, "Time", -1))
            ])
          ]),
          e("tbody", null, [
            (t(!0), n(S, null, M(le.value, (u) => (t(), n("tr", {
              key: u.name
            }, [
              e("td", zs, s(u.name), 1),
              e("td", null, [
                e("span", Ds, [
                  e("span", Os, [
                    e("span", {
                      style: ee({ width: z(u.a?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  w(s(u.a ? z(u.a.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                e("span", Fs, [
                  e("span", Ps, [
                    e("span", {
                      style: ee({ width: z(u.b?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  w(s(u.b ? z(u.b.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                u.a && u.b ? (t(), n("span", {
                  key: 0,
                  class: I(["trend", R(u.b.accuracy - u.a.accuracy)])
                }, [
                  p(k(B), {
                    icon: R(u.b.accuracy - u.a.accuracy) === "up" ? "tabler:trending-up" : R(u.b.accuracy - u.a.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                  }, null, 8, ["icon"]),
                  w(s(O(u.b.accuracy - u.a.accuracy)), 1)
                ], 2)) : f("", !0)
              ]),
              e("td", As, s(u.b ? L(u.b.cost) : "—"), 1),
              e("td", Ls, s(u.b ? Y(u.b.duration_ms) : "—"), 1)
            ]))), 128))
          ])
        ])) : (t(), n("p", Rs, "No evaluation results yet."))
      ]),
      e("section", Is, [
        e("header", js, [
          h[13] || (h[13] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", Ws, s(l.cases.length), 1),
          e("div", Qs, [
            p(k(X), {
              label: "Add case",
              size: "small",
              severity: "secondary",
              disabled: !l.fields.length,
              onClick: h[2] || (h[2] = (u) => d.value = !d.value)
            }, null, 8, ["disabled"]),
            p(k(X), {
              label: "Run all cases",
              size: "small",
              disabled: ""
            })
          ])
        ]),
        d.value ? (t(), n("form", {
          key: 0,
          class: "case-form",
          onSubmit: ne(a, ["prevent"])
        }, [
          e("label", null, [
            h[14] || (h[14] = w("Upload", -1)),
            p(Te, {
              value: C.value,
              onSelect: h[3] || (h[3] = (u, F) => {
                C.value = u, V.value = F;
              })
            }, null, 8, ["value"])
          ]),
          e("div", Js, [
            (t(!0), n(S, null, M(l.fields, (u) => (t(), n("label", {
              key: u.name
            }, [
              e("span", Ks, s(u.name), 1),
              u.type === "boolean" ? D((t(), n("select", {
                key: 0,
                "onUpdate:modelValue": (F) => x.value[u.name] = F
              }, [...h[15] || (h[15] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Hs)), [
                [se, x.value[u.name]]
              ]) : u.type === "enum" ? D((t(), n("select", {
                key: 1,
                "onUpdate:modelValue": (F) => x.value[u.name] = F
              }, [
                h[16] || (h[16] = e("option", { value: "" }, "No value", -1)),
                (t(!0), n(S, null, M(u.enum_values, (F) => (t(), n("option", { key: F }, s(F), 1))), 128))
              ], 8, Xs)), [
                [se, x.value[u.name]]
              ]) : ["object", "list"].includes(u.type) ? D((t(), n("textarea", {
                key: 2,
                "onUpdate:modelValue": (F) => x.value[u.name] = F,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, Ys)), [
                [J, x.value[u.name]]
              ]) : D((t(), n("input", {
                key: 3,
                "onUpdate:modelValue": (F) => x.value[u.name] = F,
                type: u.type === "number" ? "number" : u.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, Gs)), [
                [Je, x.value[u.name]]
              ])
            ]))), 128))
          ]),
          o.value ? (t(), n("p", Zs, s(o.value), 1)) : f("", !0),
          e("div", _s, [
            p(k(X), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !C.value,
              loading: l.saving
            }, null, 8, ["disabled", "loading"]),
            p(k(X), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: h[4] || (h[4] = (u) => d.value = !1)
            })
          ])
        ], 32)) : f("", !0),
        !l.cases.length && !d.value ? (t(), n("p", ea, "No evaluation cases yet. Add a document with the values you expect.")) : l.cases.length ? (t(), n("div", la, [
          e("table", ta, [
            e("thead", null, [
              e("tr", null, [
                h[17] || (h[17] = e("th", null, "Document", -1)),
                (t(!0), n(S, null, M(l.fields, (u) => (t(), n("th", {
                  key: u.name,
                  class: "mono"
                }, s(u.name), 1))), 128)),
                h[18] || (h[18] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (t(!0), n(S, null, M(l.cases, (u) => (t(), n("tr", {
                key: u.id
              }, [
                e("td", null, [
                  p(k(B), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  w(" " + s(u.upload_name), 1)
                ]),
                (t(!0), n(S, null, M(l.fields, (F) => (t(), n("td", {
                  key: F.name
                }, s(te(u.expected[F.name])), 1))), 128)),
                e("td", na, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${u.upload_name}`,
                    disabled: l.saving,
                    onClick: (F) => $("delete-case", u.id)
                  }, [
                    p(k(B), { icon: "tabler:trash" })
                  ], 8, sa)
                ])
              ]))), 128))
            ])
          ])
        ])) : f("", !0),
        h[19] || (h[19] = e("p", { class: "block-foot muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", aa, [
        e("header", oa, [
          h[20] || (h[20] = e("h2", { class: "block-title" }, "Tuning proposals", -1)),
          p(k(X), {
            label: "Tune configuration",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: ""
          })
        ]),
        l.proposals.length ? f("", !0) : (t(), n("p", ia, "No tuning proposals yet.")),
        (t(!0), n(S, null, M(l.proposals, (u) => (t(), n("article", {
          key: u.id,
          class: "proposal"
        }, [
          e("div", da, [
            e("h3", null, s(u.title), 1),
            e("span", ua, "from revision " + s(u.base_revision), 1)
          ]),
          e("div", ra, [
            e("span", {
              class: I(["chip", u.accuracy_delta > 0 ? "primary" : ""])
            }, s(O(u.accuracy_delta)) + " accuracy", 3),
            e("span", ca, s(u.cost_delta >= 0 ? "+" : "−") + s(L(Math.abs(u.cost_delta))) + " cost", 1),
            e("span", ma, s(u.duration_delta_ms >= 0 ? "+" : "−") + s(Y(Math.abs(u.duration_delta_ms))) + " time", 1)
          ]),
          e("ul", va, [
            (t(!0), n(S, null, M(u.changes, (F) => (t(), n("li", { key: F }, s(F), 1))), 128))
          ]),
          e("div", ba, [
            p(k(X), {
              label: "Apply",
              size: "small",
              disabled: ""
            }),
            p(k(X), {
              label: "Discard",
              size: "small",
              severity: "secondary",
              text: "",
              disabled: ""
            })
          ])
        ]))), 128)),
        h[21] || (h[21] = e("p", { class: "block-foot muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ]));
  }
}), fa = { class: "section-head" }, pa = { class: "muted" }, ha = {
  key: 0,
  class: "empty"
}, ka = {
  key: 1,
  class: "run-list"
}, ga = { class: "row" }, $a = { class: "capitalize" }, xa = ["data-status"], wa = /* @__PURE__ */ j({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(l) {
    const c = (g) => new Date(g).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (g, $) => (t(), n(S, null, [
      e("div", fa, [
        $[0] || ($[0] = e("h2", null, "Recent runs", -1)),
        e("span", pa, "Retention " + s(l.retention), 1)
      ]),
      l.runs.length ? (t(), n("div", ka, [
        (t(!0), n(S, null, M(l.runs, (d) => (t(), n("article", {
          key: d.id,
          class: "run-card"
        }, [
          e("div", ga, [
            e("strong", $a, s(d.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": d.status
            }, s(d.status), 9, xa)
          ]),
          e("dl", null, [
            $[1] || ($[1] = e("dt", null, "Duration", -1)),
            e("dd", null, s((d.duration_ms / 1e3).toFixed(1)) + "s", 1),
            $[2] || ($[2] = e("dt", null, "Expires", -1)),
            e("dd", null, s(c(d.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (t(), n("p", ha, "No runs yet."))
    ], 64));
  }
}), Va = () => ({ result: null, evals: [], proposals: [] }), Ca = { class: "docscout" }, Sa = { class: "toolbar" }, qa = { class: "toolbar-lead" }, Ua = { class: "crumb" }, Ma = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Na = ["id", "aria-selected", "aria-controls", "onClick"], Ea = { class: "toolbar-side" }, Ba = { class: "stats" }, Ra = ["title"], Ta = {
  key: 1,
  class: "unsaved"
}, za = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Da = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Oa = ["id", "aria-labelledby"], Fa = /* @__PURE__ */ j({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back"],
  setup(l, { emit: c }) {
    const g = l, $ = c, d = E(), C = E("Builder"), V = E(Ne()), x = E(""), o = E(""), a = N(() => g.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    _(C, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const i = N(() => g.engine ?? Va()), v = E();
    function A(z) {
      return x.value === z.title && o.value === (z.description ?? "") && nl(V.value, z.config);
    }
    _(() => g.snapshot, (z, O) => {
      a.value.includes(C.value) || (C.value = a.value[0]), !(O && z.id === O.id && z.can_edit && O.can_edit && !A(O) && !A(z)) && (V.value = structuredClone(Ce(z.config ?? Ne())), x.value = z.title, o.value = z.description ?? "", v.value = z.expected_revision);
    }, { immediate: !0 });
    const b = N(() => g.snapshot.can_edit && !A(g.snapshot)), q = N(() => tl(V.value)), W = N(() => V.value.workflow.filter((z) => z.enabled).length);
    function le() {
      $("save", { title: x.value, description: o.value, config: structuredClone(Ce(V.value)), expected_revision: v.value });
    }
    return (z, O) => (t(), n("main", Ca, [
      e("div", Sa, [
        e("div", qa, [
          l.back ? (t(), n(S, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (R) => $("back"))
            }, [
              p(k(B), { icon: "tabler:arrow-left" })
            ]),
            e("span", Ua, s(l.snapshot.title), 1)
          ], 64)) : f("", !0),
          e("nav", Ma, [
            (t(!0), n(S, null, M(a.value, (R) => (t(), n("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": C.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (L) => C.value = R
            }, s(R), 9, Na))), 128))
          ])
        ]),
        e("div", Ea, [
          e("span", Ba, [
            w(s(l.snapshot.field_count) + " " + s(l.snapshot.field_count === 1 ? "field" : "fields"), 1),
            l.snapshot.can_edit ? (t(), n(S, { key: 0 }, [
              w(" · " + s(W.value) + " steps · revision " + s(l.snapshot.expected_revision), 1)
            ], 64)) : (t(), n(S, { key: 1 }, [
              w(" · Read access")
            ], 64))
          ]),
          l.snapshot.can_edit ? (t(), n(S, { key: 0 }, [
            q.value ? (t(), n("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: q.value
            }, [
              p(k(B), { icon: "tabler:alert-circle" }),
              w(s(q.value), 1)
            ], 8, Ra)) : b.value ? (t(), n("span", Ta, "Unsaved")) : f("", !0),
            p(k(X), {
              label: "Save",
              size: "small",
              loading: l.saving,
              disabled: !b.value || !!q.value || !x.value.trim(),
              onClick: le
            }, null, 8, ["loading", "disabled"])
          ], 64)) : f("", !0)
        ])
      ]),
      l.error ? (t(), n("p", za, s(l.error), 1)) : f("", !0),
      C.value === "Builder" && l.snapshot.can_edit ? (t(), n("div", Da, [
        p(On, {
          title: x.value,
          "onUpdate:title": O[1] || (O[1] = (R) => x.value = R),
          description: o.value,
          "onUpdate:description": O[2] || (O[2] = (R) => o.value = R),
          config: V.value,
          retention: l.snapshot.retention,
          result: i.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (t(), n("div", {
        key: 2,
        ref_key: "body",
        ref: d,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${C.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${C.value}`,
          class: "panel"
        }, [
          C.value === "Test" ? (t(), H(vs, {
            key: 0,
            result: i.value.result,
            retention: l.snapshot.retention
          }, null, 8, ["result", "retention"])) : f("", !0),
          C.value === "Evals" && l.snapshot.can_edit ? (t(), H(ya, {
            key: 1,
            cases: l.snapshot.cases,
            results: i.value.evals,
            proposals: i.value.proposals,
            fields: l.snapshot.config?.fields ?? [],
            saving: l.saving,
            onAddCase: O[3] || (O[3] = (R) => $("add-case", R)),
            onDeleteCase: O[4] || (O[4] = (R) => $("delete-case", R))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : f("", !0),
          C.value === "Runs" ? (t(), H(wa, {
            key: 2,
            runs: l.snapshot.runs,
            retention: l.snapshot.retention
          }, null, 8, ["runs", "retention"])) : f("", !0)
        ], 8, Oa)
      ], 512))
    ]));
  }
}), Pa = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Aa = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Qa = /* @__PURE__ */ j({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(l, { emit: c }) {
    const g = l, $ = c, d = E(), C = E(""), V = E(!1);
    let x;
    async function o() {
      if (!g.id) {
        C.value = "No extractor selected.";
        return;
      }
      const b = g.id;
      try {
        const q = await ae.get(b);
        b === g.id && (d.value = q, C.value = "");
      } catch (q) {
        C.value = q instanceof Error ? q.message : String(q);
      }
    }
    _(() => g.id, () => {
      d.value = void 0, x?.(), o(), g.id && (x = Ke(`component.${g.id}`, () => o()));
    }, { immediate: !0 }), Ee(() => x?.());
    async function a(b) {
      V.value = !0, C.value = "";
      try {
        await b(), await o();
      } catch (q) {
        C.value = q instanceof Error ? q.message : String(q);
      } finally {
        V.value = !1;
      }
    }
    const i = (b) => a(() => ae.update(g.id, b)), v = (b) => a(() => ae.addCase(g.id, b)), A = (b) => a(() => ae.deleteCase(g.id, b));
    return (b, q) => d.value ? (t(), H(Fa, {
      key: 0,
      snapshot: d.value,
      saving: V.value,
      error: C.value,
      back: l.back,
      onBack: q[0] || (q[0] = (W) => $("back")),
      onSave: i,
      onAddCase: v,
      onDeleteCase: A
    }, null, 8, ["snapshot", "saving", "error", "back"])) : C.value ? (t(), n("p", Pa, s(C.value), 1)) : (t(), n("p", Aa, "Loading Docscout…"));
  }
});
export {
  Qa as _
};
