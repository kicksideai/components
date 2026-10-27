import { defineComponent as A, useModel as Y, openBlock as s, createElementBlock as o, withModifiers as H, createElementVNode as e, mergeModels as le, createTextVNode as c, withDirectives as x, vModelText as S, Fragment as p, renderList as w, toDisplayString as d, vModelSelect as I, createCommentVNode as b, createVNode as k, ref as q, onMounted as te, unref as f, watch as J, nextTick as ie, computed as T, normalizeClass as j, withKeys as ae, createBlock as L, toRaw as G, onBeforeUnmount as de } from "vue";
import { Icon as P } from "@iconify/vue";
import { loadByTagName as ne, on as ue, define as re } from "@wippy-fe/proxy";
import { f as me, g as ce, h as ve, t as X, i as z, j as be, m as W, k as ye, l as pe, o as Z, p as _, q as fe, b as O, a as ge, s as ke, n as ee, r as $e, v as he, u as xe, d as Q, e as we } from "./index-CctQU-aN.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const Ve = ["aria-checked", "aria-label", "disabled"], D = /* @__PURE__ */ A({
  __name: "Toggle",
  props: /* @__PURE__ */ le({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const $ = Y(t, "modelValue");
    return (g, a) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": $.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: a[0] || (a[0] = H((i) => $.value = !$.value, ["stop"]))
    }, [...a[1] || (a[1] = [
      e("span", null, null, -1)
    ])], 8, Ve));
  }
}), Ce = ["disabled"], Ue = { class: "grid" }, Se = ["value"], qe = { key: 0 }, Ne = ["value"], Ee = { key: 1 }, Me = ["value"], Fe = { class: "grid" }, Re = { class: "toggle-row" }, Be = { class: "toggle-row" }, De = /* @__PURE__ */ A({
  __name: "FieldInspector",
  props: {
    field: {},
    readonly: { type: Boolean }
  },
  emits: ["remove"],
  setup(t, { emit: $ }) {
    const g = $, a = ["text", "number", "boolean", "date", "enum", "list", "object"], i = (v) => v.target.value.split(`
`).map((l) => l.trim()).filter(Boolean);
    return (v, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", Ue, [
        e("label", null, [
          l[13] || (l[13] = c("Name", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (n) => t.field.name = n),
            placeholder: "invoice_total",
            "aria-label": "Field name"
          }, null, 512), [
            [S, t.field.name]
          ])
        ]),
        e("label", null, [
          l[14] || (l[14] = c("Type", -1)),
          x(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (n) => t.field.type = n),
            "aria-label": "Field type"
          }, [
            (s(), o(p, null, w(a, (n) => e("option", {
              key: n,
              value: n
            }, d(n[0].toUpperCase() + n.slice(1)), 9, Se)), 64))
          ], 512), [
            [I, t.field.type]
          ])
        ])
      ]),
      e("label", null, [
        l[15] || (l[15] = c("Description", -1)),
        x(e("textarea", {
          "onUpdate:modelValue": l[2] || (l[2] = (n) => t.field.description = n),
          rows: "2",
          placeholder: "What this value means"
        }, null, 512), [
          [S, t.field.description]
        ])
      ]),
      t.field.type === "enum" ? (s(), o("label", qe, [
        l[16] || (l[16] = c("Allowed values", -1)),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One value per line",
          onInput: l[3] || (l[3] = (n) => t.field.enum_values = i(n))
        }, null, 40, Ne)
      ])) : b("", !0),
      t.field.type === "list" ? (s(), o("label", Ee, [
        l[17] || (l[17] = c("Item type", -1)),
        x(e("select", {
          "onUpdate:modelValue": l[4] || (l[4] = (n) => t.field.item_type = n)
        }, [
          (s(!0), o(p, null, w(a.filter((n) => n !== "list"), (n) => (s(), o("option", {
            key: n,
            value: n
          }, d(n), 9, Me))), 128))
        ], 512), [
          [I, t.field.item_type]
        ])
      ])) : b("", !0),
      l[27] || (l[27] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[18] || (l[18] = c("Search hints", -1)),
        x(e("textarea", {
          "onUpdate:modelValue": l[5] || (l[5] = (n) => t.field.search_hints = n),
          rows: "2",
          placeholder: "Terms and phrases to look for"
        }, null, 512), [
          [S, t.field.search_hints]
        ]),
        l[19] || (l[19] = e("small", null, "Added to Prefetch and Scout as this field's queries.", -1))
      ]),
      e("div", Fe, [
        e("label", null, [
          l[21] || (l[21] = c("Strategy", -1)),
          x(e("select", {
            "onUpdate:modelValue": l[6] || (l[6] = (n) => t.field.strategy = n)
          }, [...l[20] || (l[20] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [I, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[22] || (l[22] = c("Chunks to read", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[7] || (l[7] = (n) => t.field.chunks = n),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              S,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      l[28] || (l[28] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[23] || (l[23] = c("Validation hints", -1)),
        x(e("textarea", {
          "onUpdate:modelValue": l[8] || (l[8] = (n) => t.field.validation_hints = n),
          rows: "2",
          placeholder: "Rules the value should satisfy"
        }, null, 512), [
          [S, t.field.validation_hints]
        ])
      ]),
      e("label", null, [
        l[24] || (l[24] = c("Expected format", -1)),
        x(e("input", {
          "onUpdate:modelValue": l[9] || (l[9] = (n) => t.field.expected_format = n),
          placeholder: "For example, YYYY-MM-DD"
        }, null, 512), [
          [S, t.field.expected_format]
        ])
      ]),
      e("div", Re, [
        l[25] || (l[25] = e("span", null, "Required", -1)),
        k(D, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[10] || (l[10] = (n) => t.field.required = n),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Be, [
        l[26] || (l[26] = e("span", null, "Evidence required", -1)),
        k(D, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[11] || (l[11] = (n) => t.field.evidence_required = n),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? b("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "btn danger-text",
        onClick: l[12] || (l[12] = (n) => g("remove"))
      }, "Remove field"))
    ], 8, Ce));
  }
}), Te = ["value", "capability", "aria-labelledby"], Ae = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Pe = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, K = /* @__PURE__ */ A({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: $ }) {
    const g = $, a = q(!!customElements.get("wc-model-picker")), i = q("");
    te(async () => {
      if (!a.value)
        try {
          await ne("wc-model-picker", { timeoutMs: 8e3 }), a.value = !0;
        } catch (l) {
          i.value = l instanceof Error ? l.message : String(l);
        }
    });
    function v(l) {
      const n = l.detail;
      typeof n == "string" && g("select", n);
    }
    return (l, n) => a.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: v
    }, null, 40, Te)) : i.value ? (s(), o("p", Ae, "Could not load model picker: " + d(i.value), 1)) : (s(), o("span", Pe, "Loading models…"));
  }
}), Oe = ["disabled"], Le = { class: "muted" }, Ie = {
  key: 0,
  class: "toggle-row"
}, je = { class: "label-block" }, ze = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "scope-label"
}, Je = ["aria-checked", "onClick"], Qe = ["id"], He = { key: 2 }, Ke = { class: "grid" }, We = ["onUpdate:modelValue"], Ye = ["onUpdate:modelValue"], Ge = ["onUpdate:modelValue"], Xe = ["onClick"], Ze = {
  key: 0,
  class: "muted"
}, _e = { class: "grid" }, el = ["value"], ll = { class: "grid" }, tl = { class: "toggle-row" }, nl = { class: "toggle-row" }, sl = { class: "mono" }, ol = { id: "model-deep-query" }, il = { class: "grid" }, al = { class: "grid" }, dl = { class: "grid" }, ul = { class: "toggle-row" }, rl = {
  key: 7,
  class: "toggle-row"
}, ml = /* @__PURE__ */ A({
  __name: "StepInspector",
  props: {
    step: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const $ = t, g = [{ value: "outline", label: "Outline" }, { value: "section", label: "Section" }, { value: "chunk", label: "Chunk" }], a = me();
    function i(v, l) {
      const n = $.config.tools.filter((V) => V !== v);
      $.config.tools = l ? [...n, v] : n;
    }
    return (v, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", Le, d(f(ce)[t.step.kind]), 1),
      t.step.kind !== "extract" ? (s(), o("div", Ie, [
        l[21] || (l[21] = e("span", null, "Step enabled", -1)),
        k(D, {
          modelValue: t.step.enabled,
          "onUpdate:modelValue": l[0] || (l[0] = (n) => t.step.enabled = n),
          label: "Enable step",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0),
      e("div", je, [
        l[22] || (l[22] = e("span", { id: "scope-label" }, "Reads at", -1)),
        e("div", ze, [
          (s(), o(p, null, w(g, (n) => e("button", {
            key: n.value,
            type: "button",
            role: "radio",
            "aria-checked": t.step.scope === n.value,
            onClick: (V) => t.step.scope = n.value
          }, d(n.label), 9, Je)), 64))
        ]),
        l[23] || (l[23] = e("small", null, "Layer of the document this step works on: outline, then section, then chunk.", -1))
      ]),
      t.step.model !== void 0 ? (s(), o("label", {
        key: 1,
        id: `model-${t.step.kind}`
      }, [
        c(d(t.step.kind === "deep" ? "Analysis model" : "Model"), 1),
        k(K, {
          value: t.step.model,
          capability: "generate",
          "labelled-by": `model-${t.step.kind}`,
          onSelect: l[1] || (l[1] = (n) => t.step.model = n)
        }, null, 8, ["value", "labelled-by"])
      ], 8, Qe)) : b("", !0),
      t.step.kind === "map" ? (s(), o("label", He, [
        l[25] || (l[25] = c("Outline", -1)),
        x(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (n) => t.step.options.outline_mode = n)
        }, [...l[24] || (l[24] = [
          e("option", { value: "find_or_build" }, "Use the table of contents, or build an outline", -1),
          e("option", { value: "build" }, "Always build an outline", -1)
        ])], 512), [
          [I, t.step.options.outline_mode]
        ])
      ])) : b("", !0),
      t.step.kind === "prefetch" ? (s(), o(p, { key: 3 }, [
        l[29] || (l[29] = e("h4", null, "Queries", -1)),
        (s(!0), o(p, null, w(t.step.options.queries, (n, V) => (s(), o("div", {
          key: V,
          class: "query-row"
        }, [
          e("div", Ke, [
            e("label", null, [
              l[26] || (l[26] = c("Name", -1)),
              x(e("input", {
                "onUpdate:modelValue": (F) => n.name = F,
                placeholder: "Parties"
              }, null, 8, We), [
                [S, n.name]
              ])
            ]),
            e("label", null, [
              l[27] || (l[27] = c("Chunks", -1)),
              x(e("input", {
                "onUpdate:modelValue": (F) => n.chunks = F,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Ye), [
                [
                  S,
                  n.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[28] || (l[28] = c("Query", -1)),
            x(e("textarea", {
              "onUpdate:modelValue": (F) => n.query = F,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Ge), [
              [S, n.query]
            ])
          ]),
          t.readonly ? b("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (F) => t.step.options.queries.splice(V, 1)
          }, "Remove query", 8, Xe))
        ]))), 128)),
        t.step.options.queries.length ? b("", !0) : (s(), o("p", Ze, "No queries. Field search hints still run.")),
        t.readonly ? b("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[3] || (l[3] = (n) => t.step.options.queries.push(f(ve)()))
        }, "Add query"))
      ], 64)) : b("", !0),
      t.step.kind === "scout" ? (s(), o(p, { key: 4 }, [
        e("div", _e, [
          e("label", null, [
            l[30] || (l[30] = c("Rounds", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[4] || (l[4] = (n) => t.step.options.max_iterations = n),
              type: "number",
              min: "0",
              max: "30"
            }, null, 512), [
              [
                S,
                t.step.options.max_iterations,
                void 0,
                { number: !0 }
              ]
            ]),
            l[31] || (l[31] = e("small", null, "0 runs a single pass.", -1))
          ]),
          e("label", null, [
            l[32] || (l[32] = c("Stop at confidence", -1)),
            e("input", {
              value: Math.round(t.step.options.target_confidence * 100),
              type: "number",
              min: "0",
              max: "100",
              onInput: l[5] || (l[5] = (n) => t.step.options.target_confidence = Number(n.target.value) / 100)
            }, null, 40, el),
            l[33] || (l[33] = e("small", null, "Percent", -1))
          ])
        ]),
        e("div", ll, [
          e("label", null, [
            l[34] || (l[34] = c("Extra queries per round", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[6] || (l[6] = (n) => t.step.options.max_extra_queries = n),
              type: "number",
              min: "0",
              max: "20"
            }, null, 512), [
              [
                S,
                t.step.options.max_extra_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[35] || (l[35] = c("Max tokens", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[7] || (l[7] = (n) => t.step.options.max_tokens = n),
              type: "number",
              min: "256",
              max: "64000"
            }, null, 512), [
              [
                S,
                t.step.options.max_tokens,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", tl, [
          l[36] || (l[36] = e("span", null, "Drop noisy chunks", -1)),
          k(D, {
            modelValue: t.step.options.drop_noise,
            "onUpdate:modelValue": l[8] || (l[8] = (n) => t.step.options.drop_noise = n),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", nl, [
          l[37] || (l[37] = e("span", null, "Share scout notes with extraction", -1)),
          k(D, {
            modelValue: t.config.shared_context,
            "onUpdate:modelValue": l[9] || (l[9] = (n) => t.config.shared_context = n),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[38] || (l[38] = e("h4", null, "Agent tools", -1)),
        (s(!0), o(p, null, w(f(a), (n) => (s(), o("div", {
          key: n,
          class: "toggle-row"
        }, [
          e("span", null, [
            c(d(f(X)(n)), 1),
            e("small", sl, d(n), 1)
          ]),
          k(D, {
            "model-value": t.config.tools.includes(n),
            label: f(X)(n),
            disabled: t.readonly,
            "onUpdate:modelValue": (V) => i(n, V)
          }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
        ]))), 128))
      ], 64)) : b("", !0),
      t.step.kind === "deep" ? (s(), o(p, { key: 5 }, [
        e("label", ol, [
          l[39] || (l[39] = c("Query model", -1)),
          k(K, {
            value: t.step.options.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[10] || (l[10] = (n) => t.step.options.query_model = n)
          }, null, 8, ["value"])
        ]),
        e("div", il, [
          e("label", null, [
            l[40] || (l[40] = c("Fields at a time", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[11] || (l[11] = (n) => t.step.options.parallel_fields = n),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                S,
                t.step.options.parallel_fields,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[41] || (l[41] = c("Queries per field", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[12] || (l[12] = (n) => t.step.options.max_queries = n),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                S,
                t.step.options.max_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", al, [
          e("label", null, [
            l[42] || (l[42] = c("Chunks per query", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[13] || (l[13] = (n) => t.step.options.chunks_per_query = n),
              type: "number",
              min: "1",
              max: "500"
            }, null, 512), [
              [
                S,
                t.step.options.chunks_per_query,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[43] || (l[43] = c("Chunk cap", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[14] || (l[14] = (n) => t.step.options.chunk_cap = n),
              type: "number",
              min: "1",
              max: "1000"
            }, null, 512), [
              [
                S,
                t.step.options.chunk_cap,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", dl, [
          e("label", null, [
            l[44] || (l[44] = c("Minimum similarity", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[15] || (l[15] = (n) => t.step.options.min_similarity = n),
              type: "number",
              min: "0",
              max: "1",
              step: "0.05"
            }, null, 512), [
              [
                S,
                t.step.options.min_similarity,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[45] || (l[45] = c("Query temperature", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[16] || (l[16] = (n) => t.step.options.query_temperature = n),
              type: "number",
              min: "0",
              max: "2",
              step: "0.1"
            }, null, 512), [
              [
                S,
                t.step.options.query_temperature,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("label", null, [
          l[46] || (l[46] = c("Analysis temperature", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[17] || (l[17] = (n) => t.step.options.analysis_temperature = n),
            type: "number",
            min: "0",
            max: "2",
            step: "0.1"
          }, null, 512), [
            [
              S,
              t.step.options.analysis_temperature,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ], 64)) : b("", !0),
      t.step.kind === "extract" ? (s(), o(p, { key: 6 }, [
        e("label", null, [
          l[47] || (l[47] = c("Max output tokens", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[18] || (l[18] = (n) => t.step.options.max_output_tokens = n),
            type: "number",
            min: "256",
            max: "64000"
          }, null, 512), [
            [
              S,
              t.step.options.max_output_tokens,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        e("div", ul, [
          l[48] || (l[48] = e("span", null, "Structured output", -1)),
          k(D, {
            modelValue: t.step.options.structured_output,
            "onUpdate:modelValue": l[19] || (l[19] = (n) => t.step.options.structured_output = n),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : b("", !0),
      t.step.kind === "verify" ? (s(), o("div", rl, [
        l[49] || (l[49] = e("span", null, "Check every value", -1)),
        k(D, {
          modelValue: t.step.options.require_all_values,
          "onUpdate:modelValue": l[20] || (l[20] = (n) => t.step.options.require_all_values = n),
          label: "Check every value",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0)
    ], 8, Oe));
  }
}), cl = ["disabled"], vl = { class: "muted" }, bl = { class: "grid" }, yl = { class: "toggle-row" }, pl = { class: "label-block" }, fl = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, gl = ["aria-checked", "onClick"], kl = { id: "embedding-model" }, $l = { class: "toggle-row" }, hl = { class: "toggle-row" }, xl = {
  key: 0,
  id: "highlighter-model"
}, wl = /* @__PURE__ */ A({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const $ = [{ value: "keyword", label: "Keyword" }, { value: "semantic", label: "Semantic" }, { value: "hybrid", label: "Hybrid" }];
    return (g, a) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", vl, "The upload's text is split into chunks and indexed for this run. Processed copies expire after " + d(t.retention) + ".", 1),
      a[19] || (a[19] = e("h4", null, "Chunks", -1)),
      e("div", bl, [
        e("label", null, [
          a[8] || (a[8] = c("Chunk size", -1)),
          x(e("input", {
            "onUpdate:modelValue": a[0] || (a[0] = (i) => t.config.retrieval.chunk_size = i),
            type: "number",
            min: "100",
            max: "16000"
          }, null, 512), [
            [
              S,
              t.config.retrieval.chunk_size,
              void 0,
              { number: !0 }
            ]
          ]),
          a[9] || (a[9] = e("small", null, "Tokens", -1))
        ]),
        e("label", null, [
          a[10] || (a[10] = c("Overlap", -1)),
          x(e("input", {
            "onUpdate:modelValue": a[1] || (a[1] = (i) => t.config.retrieval.overlap = i),
            type: "number",
            min: "0",
            max: "4000"
          }, null, 512), [
            [
              S,
              t.config.retrieval.overlap,
              void 0,
              { number: !0 }
            ]
          ]),
          a[11] || (a[11] = e("small", null, "Tokens", -1))
        ])
      ]),
      e("div", yl, [
        a[12] || (a[12] = e("span", null, "Split by headings", -1)),
        k(D, {
          modelValue: t.config.retrieval.split_headings,
          "onUpdate:modelValue": a[2] || (a[2] = (i) => t.config.retrieval.split_headings = i),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a[20] || (a[20] = e("h4", null, "Search", -1)),
      e("div", pl, [
        a[13] || (a[13] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", fl, [
          (s(), o(p, null, w($, (i) => e("button", {
            key: i.value,
            type: "button",
            role: "radio",
            "aria-checked": t.config.retrieval.search_mode === i.value,
            onClick: (v) => t.config.retrieval.search_mode = i.value
          }, d(i.label), 9, gl)), 64))
        ])
      ]),
      e("label", null, [
        a[14] || (a[14] = c("Results per query", -1)),
        x(e("input", {
          "onUpdate:modelValue": a[3] || (a[3] = (i) => t.config.retrieval.top_results = i),
          type: "number",
          min: "1",
          max: "100"
        }, null, 512), [
          [
            S,
            t.config.retrieval.top_results,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      e("label", kl, [
        a[15] || (a[15] = c("Embedding model", -1)),
        k(K, {
          value: t.config.retrieval.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: a[4] || (a[4] = (i) => t.config.retrieval.embedding_model = i)
        }, null, 8, ["value"])
      ]),
      e("div", $l, [
        a[16] || (a[16] = e("span", null, [
          c("Contextual embeddings"),
          e("small", null, "Prepend section context to each chunk before embedding.")
        ], -1)),
        k(D, {
          modelValue: t.config.retrieval.contextual_embeddings,
          "onUpdate:modelValue": a[5] || (a[5] = (i) => t.config.retrieval.contextual_embeddings = i),
          label: "Contextual embeddings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a[21] || (a[21] = e("h4", null, "Highlighter", -1)),
      e("div", hl, [
        a[17] || (a[17] = e("span", null, [
          c("Mark relevant spans"),
          e("small", null, "A small model highlights what each field needs before extraction.")
        ], -1)),
        k(D, {
          modelValue: t.config.retrieval.highlighter,
          "onUpdate:modelValue": a[6] || (a[6] = (i) => t.config.retrieval.highlighter = i),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.config.retrieval.highlighter ? (s(), o("label", xl, [
        a[18] || (a[18] = c("Highlighter model", -1)),
        k(K, {
          value: t.config.retrieval.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: a[7] || (a[7] = (i) => t.config.retrieval.highlighter_model = i)
        }, null, 8, ["value"])
      ])) : b("", !0)
    ], 8, cl));
  }
}), Vl = { class: "builder" }, Cl = {
  class: "pane fields-pane",
  "aria-label": "Fields"
}, Ul = { class: "pane-head" }, Sl = { class: "count" }, ql = {
  key: 0,
  class: "muted pad"
}, Nl = { class: "field-list" }, El = ["onClick"], Ml = { class: "field-name" }, Fl = {
  key: 0,
  class: "req",
  title: "Required"
}, Rl = { class: "chips" }, Bl = { class: "chip" }, Dl = {
  key: 0,
  class: "chip primary"
}, Tl = {
  key: 0,
  class: "reorder"
}, Al = ["disabled", "onClick"], Pl = ["disabled", "onClick"], Ol = {
  class: "flow",
  "aria-label": "Extraction flow"
}, Ll = { class: "node-icon" }, Il = { class: "node-main" }, jl = { class: "node-summary" }, zl = {
  key: 0,
  class: "chips"
}, Jl = { class: "chip" }, Ql = { class: "chip model" }, Hl = ["onClick", "onKeydown"], Kl = { class: "node-icon" }, Wl = { class: "node-main" }, Yl = { class: "node-title" }, Gl = { class: "scope" }, Xl = { class: "node-summary" }, Zl = {
  key: 0,
  class: "chips"
}, _l = {
  key: 1,
  class: "chips"
}, et = {
  key: 2,
  class: "chips"
}, lt = {
  key: 3,
  class: "trace-line"
}, tt = { class: "node-side" }, nt = {
  key: 0,
  class: "chip model"
}, st = {
  key: 1,
  class: "node-actions"
}, ot = ["aria-label", "onClick"], it = ["aria-label", "onClick"], at = { class: "node-icon" }, dt = { class: "node-main" }, ut = { class: "node-summary" }, rt = { class: "pane-head" }, mt = { class: "inspector-body" }, ct = ["disabled"], vt = {
  key: 4,
  class: "inspector-form"
}, bt = { class: "output-list" }, yt = { class: "mono" }, pt = { class: "chip" }, ft = /* @__PURE__ */ A({
  __name: "Builder",
  props: /* @__PURE__ */ le({
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
    const $ = t, g = Y(t, "title"), a = Y(t, "description"), i = q({ kind: "document" }), v = q();
    J(i, async () => {
      await ie(), v.value && matchMedia("(max-width: 860px)").matches && v.value.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    const l = (m) => JSON.stringify(m) === JSON.stringify(i.value) || m.kind === "step" && i.value.kind === "step" && m.step === i.value.step, n = T(() => i.value.kind === "field" ? $.config.fields[i.value.index] : void 0), V = T(() => {
      const m = i.value;
      return m.kind === "step" ? z[m.step.kind] : m.kind === "field" ? n.value?.name || "New field" : m.kind === "document" ? "Read document" : m.kind === "output" ? "Output" : "Details";
    }), F = T(() => $.config.fields.filter((m) => m.strategy === "deep")), B = T(() => $.config.fields.filter((m) => m.search_hints.trim())), E = (m) => $.result?.trace.find((r) => r.kind === m), C = (m) => [`${(m.duration_ms / 1e3).toFixed(1)}s`, `${(m.input_tokens + m.output_tokens).toLocaleString()} tokens`, m.queries?.length ? `${m.queries.length} queries` : "", m.message ?? ""].filter(Boolean).join(" · ");
    function R() {
      $.config.fields.push(fe()), i.value = { kind: "field", index: $.config.fields.length - 1 };
    }
    function h(m) {
      $.config.fields.splice(m, 1), i.value = { kind: "document" };
    }
    function y(m, r) {
      const u = $.config.fields, M = m + r;
      if (M < 0 || M >= u.length) return;
      const [N] = u.splice(m, 1);
      u.splice(M, 0, N), i.value = { kind: "field", index: M };
    }
    const U = T({ get: () => $.config.tags.join(", "), set: (m) => {
      $.config.tags = [...new Set(m.split(",").map((r) => r.trim()).filter(Boolean))];
    } });
    return (m, r) => (s(), o("div", Vl, [
      e("aside", Cl, [
        e("div", Ul, [
          r[7] || (r[7] = e("h2", null, "Fields", -1)),
          e("span", Sl, d(t.config.fields.length), 1),
          t.readonly ? b("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "icon-btn push",
            "aria-label": "Add field",
            title: "Add field",
            onClick: R
          }, [
            k(f(P), { icon: "tabler:plus" })
          ]))
        ]),
        t.config.fields.length ? b("", !0) : (s(), o("p", ql, "Add the values to pull from each document.")),
        e("ul", Nl, [
          (s(!0), o(p, null, w(t.config.fields, (u, M) => (s(), o("li", { key: M }, [
            e("button", {
              type: "button",
              class: j(["field-item", { active: l({ kind: "field", index: M }) }]),
              onClick: (N) => i.value = { kind: "field", index: M }
            }, [
              e("span", Ml, [
                c(d(u.name || "New field"), 1),
                u.required ? (s(), o("span", Fl, "*")) : b("", !0)
              ]),
              e("span", Rl, [
                e("span", Bl, d(u.type), 1),
                u.strategy === "deep" ? (s(), o("span", Dl, "deep")) : b("", !0)
              ])
            ], 10, El),
            !t.readonly && l({ kind: "field", index: M }) ? (s(), o("span", Tl, [
              e("button", {
                type: "button",
                class: "icon-btn",
                "aria-label": "Move field up",
                disabled: M === 0,
                onClick: (N) => y(M, -1)
              }, [
                k(f(P), { icon: "tabler:chevron-up" })
              ], 8, Al),
              e("button", {
                type: "button",
                class: "icon-btn",
                "aria-label": "Move field down",
                disabled: M === t.config.fields.length - 1,
                onClick: (N) => y(M, 1)
              }, [
                k(f(P), { icon: "tabler:chevron-down" })
              ], 8, Pl)
            ])) : b("", !0)
          ]))), 128))
        ]),
        t.readonly ? b("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn add-field",
          onClick: R
        }, [
          k(f(P), { icon: "tabler:plus" }),
          r[8] || (r[8] = c("Add field", -1))
        ]))
      ]),
      e("section", Ol, [
        e("button", {
          type: "button",
          class: j(["node fixed", { active: l({ kind: "document" }) }]),
          onClick: r[0] || (r[0] = (u) => i.value = { kind: "document" })
        }, [
          e("span", Ll, [
            k(f(P), { icon: "tabler:file-text" })
          ]),
          e("span", Il, [
            r[9] || (r[9] = e("span", { class: "node-title" }, "Read document", -1)),
            e("span", jl, d(f(be)(t.config.retrieval)), 1),
            t.config.retrieval.highlighter ? (s(), o("span", zl, [
              e("span", Jl, "Highlighter · " + d(f(W)(t.config.retrieval.highlighter_model)), 1)
            ])) : b("", !0)
          ]),
          e("span", Ql, d(f(W)(t.config.retrieval.embedding_model)), 1)
        ], 2),
        (s(!0), o(p, null, w(t.config.workflow, (u, M) => (s(), o(p, {
          key: u.kind
        }, [
          e("div", {
            class: j(["connector", { off: !u.enabled }])
          }, null, 2),
          e("div", {
            class: j(["node", { active: l({ kind: "step", step: u }), off: !u.enabled }]),
            role: "button",
            tabindex: "0",
            onClick: (N) => i.value = { kind: "step", step: u },
            onKeydown: ae((N) => i.value = { kind: "step", step: u }, ["enter"])
          }, [
            e("span", Kl, [
              k(f(P), {
                icon: f(ye)[u.kind]
              }, null, 8, ["icon"])
            ]),
            e("span", Wl, [
              e("span", Yl, [
                c(d(f(z)[u.kind]), 1),
                e("span", Gl, d(u.scope), 1)
              ]),
              e("span", Xl, d(u.enabled ? f(pe)(u, t.config) : "Off"), 1),
              u.enabled && u.kind === "deep" && F.value.length ? (s(), o("span", Zl, [
                (s(!0), o(p, null, w(F.value, (N) => (s(), o("span", {
                  key: N.name,
                  class: "chip primary"
                }, d(N.name || "New field"), 1))), 128))
              ])) : b("", !0),
              u.enabled && u.kind === "prefetch" && (u.options.queries.length || B.value.length) ? (s(), o("span", _l, [
                (s(!0), o(p, null, w(u.options.queries, (N) => (s(), o("span", {
                  key: "q" + N.name,
                  class: "chip"
                }, d(N.name || "Untitled query"), 1))), 128)),
                (s(!0), o(p, null, w(B.value, (N) => (s(), o("span", {
                  key: "f" + N.name,
                  class: "chip muted-chip"
                }, d(N.name), 1))), 128))
              ])) : b("", !0),
              u.enabled && u.kind === "scout" ? (s(), o("span", et, [
                (s(!0), o(p, null, w(t.config.tools, (N) => (s(), o("span", {
                  key: N,
                  class: "chip"
                }, d(N.split(":").pop()?.replace(/_/g, " ")), 1))), 128))
              ])) : b("", !0),
              E(u.kind) ? (s(), o("span", lt, [
                k(f(P), {
                  icon: E(u.kind).status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
                }, null, 8, ["icon"]),
                c(d(C(E(u.kind))), 1)
              ])) : b("", !0)
            ]),
            e("span", tt, [
              u.enabled && u.model ? (s(), o("span", nt, d(f(W)(u.model)), 1)) : b("", !0),
              t.readonly ? b("", !0) : (s(), o("span", st, [
                f(Z)(t.config, M, -1) ? (s(), o("button", {
                  key: 0,
                  type: "button",
                  class: "icon-btn",
                  "aria-label": `Move ${f(z)[u.kind]} up`,
                  onClick: H((N) => f(_)(t.config, M, -1), ["stop"])
                }, [
                  k(f(P), { icon: "tabler:arrow-up" })
                ], 8, ot)) : b("", !0),
                f(Z)(t.config, M, 1) ? (s(), o("button", {
                  key: 1,
                  type: "button",
                  class: "icon-btn",
                  "aria-label": `Move ${f(z)[u.kind]} down`,
                  onClick: H((N) => f(_)(t.config, M, 1), ["stop"])
                }, [
                  k(f(P), { icon: "tabler:arrow-down" })
                ], 8, it)) : b("", !0),
                u.kind !== "extract" ? (s(), L(D, {
                  key: 2,
                  modelValue: u.enabled,
                  "onUpdate:modelValue": (N) => u.enabled = N,
                  label: `Enable ${f(z)[u.kind]}`
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])) : b("", !0)
              ]))
            ])
          ], 42, Hl)
        ], 64))), 128)),
        r[11] || (r[11] = e("div", { class: "connector" }, null, -1)),
        e("button", {
          type: "button",
          class: j(["node fixed", { active: l({ kind: "output" }) }]),
          onClick: r[1] || (r[1] = (u) => i.value = { kind: "output" })
        }, [
          e("span", at, [
            k(f(P), { icon: "tabler:braces" })
          ]),
          e("span", dt, [
            r[10] || (r[10] = e("span", { class: "node-title" }, "Output", -1)),
            e("span", ut, d(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
          ])
        ], 2)
      ]),
      e("aside", {
        ref_key: "inspector",
        ref: v,
        class: "pane inspector",
        "aria-label": "Inspector"
      }, [
        e("div", rt, [
          e("h2", null, d(V.value), 1),
          i.value.kind !== "details" ? (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle push",
            onClick: r[2] || (r[2] = (u) => i.value = { kind: "details" })
          }, "Details")) : b("", !0)
        ]),
        e("div", mt, [
          i.value.kind === "document" ? (s(), L(wl, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : i.value.kind === "step" ? (s(), L(ml, {
            key: 1,
            step: i.value.step,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["step", "config", "readonly"])) : i.value.kind === "field" && n.value ? (s(), L(De, {
            key: 2,
            field: n.value,
            readonly: t.readonly,
            onRemove: r[3] || (r[3] = (u) => h(i.value.index))
          }, null, 8, ["field", "readonly"])) : i.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              r[12] || (r[12] = c("Name", -1)),
              x(e("input", {
                "onUpdate:modelValue": r[4] || (r[4] = (u) => g.value = u),
                "aria-label": "Extractor name"
              }, null, 512), [
                [S, g.value]
              ])
            ]),
            e("label", null, [
              r[13] || (r[13] = c("Description", -1)),
              x(e("textarea", {
                "onUpdate:modelValue": r[5] || (r[5] = (u) => a.value = u),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [S, a.value]
              ])
            ]),
            e("label", null, [
              r[14] || (r[14] = c("Tags", -1)),
              x(e("input", {
                "onUpdate:modelValue": r[6] || (r[6] = (u) => U.value = u),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  S,
                  U.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              r[15] || (r[15] = e("small", null, "Comma separated", -1))
            ])
          ], 8, ct)) : i.value.kind === "output" ? (s(), o("div", vt, [
            r[16] || (r[16] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", bt, [
              (s(!0), o(p, null, w(t.config.fields, (u) => (s(), o("li", {
                key: u.name
              }, [
                e("span", yt, d(u.name || "New field"), 1),
                e("span", pt, d(u.type === "list" ? `list of ${u.item_type}` : u.type), 1)
              ]))), 128))
            ]),
            r[17] || (r[17] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : b("", !0)
        ])
      ], 512)
    ]));
  }
}), gt = ["selected"], kt = {
  key: 1,
  role: "alert"
}, $t = {
  key: 2,
  class: "muted"
}, se = /* @__PURE__ */ A({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: $ }) {
    const g = $, a = q(!1), i = q("");
    te(async () => {
      try {
        await ne("wc-multiselect", { timeoutMs: 8e3 }), a.value = !0;
      } catch (l) {
        i.value = String(l);
      }
    });
    function v(l) {
      const n = l.detail;
      g("select", n.selected[0] || "", n.labels?.[0] || "");
    }
    return (l, n) => a.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: v
    }, null, 40, gt)) : i.value ? (s(), o("p", kt, d(i.value), 1)) : (s(), o("span", $t, "Loading uploads…"));
  }
}), ht = { class: "test-input" }, xt = { class: "row wrap" }, wt = { class: "grow" }, Vt = { class: "retention" }, Ct = { class: "section-head" }, Ut = { class: "muted" }, St = { class: "row" }, qt = { class: "confidence push" }, Nt = { class: "value" }, Et = { class: "muted" }, Mt = {
  key: 0,
  class: "muted"
}, Ft = { class: "trace" }, Rt = { class: "row wrap" }, Bt = { class: "muted" }, Dt = { class: "push" }, Tt = { class: "muted" }, At = { key: 0 }, Pt = { key: 1 }, Ot = {
  key: 1,
  class: "empty"
}, Lt = /* @__PURE__ */ A({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(t) {
    const $ = q(""), g = (i) => `${Math.round(i * 100)}%`, a = (i) => typeof i == "string" ? i : JSON.stringify(i);
    return (i, v) => (s(), o(p, null, [
      e("section", ht, [
        v[1] || (v[1] = e("h2", null, "Document", -1)),
        e("div", xt, [
          e("div", wt, [
            k(se, {
              value: $.value,
              onSelect: v[0] || (v[0] = (l) => $.value = l)
            }, null, 8, ["value"])
          ]),
          k(f(O), {
            label: "Run extraction",
            disabled: ""
          })
        ]),
        v[2] || (v[2] = e("p", { class: "muted" }, "Extraction is not available yet.", -1)),
        e("p", Vt, "Processed documents and runs expire after " + d(t.retention) + ".", 1)
      ]),
      t.result ? (s(), o(p, { key: 0 }, [
        e("div", Ct, [
          v[3] || (v[3] = e("h2", null, "Values", -1)),
          e("span", Ut, d(t.result.tokens.toLocaleString()) + " tokens · " + d((t.result.duration_ms / 1e3).toFixed(1)) + "s", 1)
        ]),
        (s(!0), o(p, null, w(t.result.fields, (l) => (s(), o("article", {
          key: l.name,
          class: "field-card value-card"
        }, [
          e("header", St, [
            e("h3", null, d(l.name), 1),
            e("span", qt, d(g(l.confidence)) + " confidence", 1)
          ]),
          e("p", Nt, d(a(l.value)), 1),
          e("p", Et, d(l.verified ? "Verified" : "Unverified"), 1),
          (s(!0), o(p, null, w(l.evidence, (n, V) => (s(), o("blockquote", { key: V }, [
            e("p", null, "“" + d(n.quote) + "”", 1),
            e("cite", null, [
              c(d(n.section), 1),
              n.page !== void 0 ? (s(), o(p, { key: 0 }, [
                c(" · Page " + d(n.page), 1)
              ], 64)) : b("", !0)
            ])
          ]))), 128)),
          l.evidence.length ? b("", !0) : (s(), o("p", Mt, "No evidence."))
        ]))), 128)),
        v[4] || (v[4] = e("h2", null, "Trace", -1)),
        e("ol", Ft, [
          (s(!0), o(p, null, w(t.result.trace, (l, n) => (s(), o("li", { key: n }, [
            e("div", Rt, [
              e("strong", null, d(l.kind), 1),
              e("span", Bt, d(l.status), 1),
              e("span", Dt, d((l.duration_ms / 1e3).toFixed(1)) + "s", 1)
            ]),
            e("p", Tt, [
              c(d(l.scope), 1),
              l.model ? (s(), o(p, { key: 0 }, [
                c(" · " + d(l.model), 1)
              ], 64)) : b("", !0),
              c(" · " + d(l.input_tokens + l.output_tokens) + " tokens", 1),
              l.cost !== void 0 ? (s(), o(p, { key: 1 }, [
                c(" · $" + d(l.cost.toFixed(4)), 1)
              ], 64)) : b("", !0)
            ]),
            l.message ? (s(), o("p", At, d(l.message), 1)) : b("", !0),
            l.queries?.length ? (s(), o("ul", Pt, [
              (s(!0), o(p, null, w(l.queries, (V) => (s(), o("li", { key: V }, d(V), 1))), 128))
            ])) : b("", !0)
          ]))), 128))
        ])
      ], 64)) : (s(), o("p", Ot, "No extraction results yet."))
    ], 64));
  }
}), It = { class: "section-head" }, jt = { class: "row wrap" }, zt = { class: "grid" }, Jt = ["onUpdate:modelValue"], Qt = ["onUpdate:modelValue"], Ht = {
  key: 0,
  class: "error",
  role: "alert"
}, Kt = { class: "row" }, Wt = {
  key: 1,
  class: "empty"
}, Yt = { class: "row" }, Gt = { class: "values" }, Xt = {
  key: 0,
  class: "empty"
}, Zt = {
  key: 1,
  class: "grid comparison"
}, _t = ["value", "onChange"], en = ["value"], ln = { class: "muted" }, tn = { class: "values" }, nn = { class: "section-head" }, sn = {
  key: 0,
  class: "empty"
}, on = { class: "delta" }, an = { class: "row" }, dn = /* @__PURE__ */ A({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(t, { emit: $ }) {
    const g = t, a = $, i = q(!1), v = q(""), l = q(""), n = q({}), V = q("");
    J(() => g.cases, () => {
      i.value = !1, v.value = "", n.value = {};
    });
    function F() {
      V.value = "";
      const R = {};
      try {
        for (const h of g.fields) {
          const y = n.value[h.name] ?? "";
          R[h.name] = ["number", "boolean", "list", "object"].includes(h.type) ? y.trim() ? JSON.parse(y) : null : y;
        }
        a("add-case", { upload_id: v.value, upload_name: l.value, expected: R });
      } catch {
        V.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const B = q(), E = q(), C = T(() => [g.results.find((R) => R.revision === (B.value ?? g.results[0]?.revision)), g.results.find((R) => R.revision === (E.value ?? g.results[1]?.revision))]);
    return (R, h) => (s(), o(p, null, [
      e("section", null, [
        e("div", It, [
          h[3] || (h[3] = e("h2", null, "Cases", -1)),
          e("div", jt, [
            k(f(O), {
              label: "Add case",
              severity: "secondary",
              disabled: !t.fields.length,
              onClick: h[0] || (h[0] = (y) => i.value = !i.value)
            }, null, 8, ["disabled"]),
            k(f(O), {
              label: "Run all cases",
              disabled: ""
            })
          ])
        ]),
        i.value ? (s(), o("form", {
          key: 0,
          class: "field-card",
          onSubmit: H(F, ["prevent"])
        }, [
          e("label", null, [
            h[4] || (h[4] = c("Upload", -1)),
            k(se, {
              value: v.value,
              onSelect: h[1] || (h[1] = (y, U) => {
                v.value = y, l.value = U;
              })
            }, null, 8, ["value"])
          ]),
          e("div", zt, [
            (s(!0), o(p, null, w(t.fields, (y) => (s(), o("label", {
              key: y.name
            }, [
              c(d(y.name), 1),
              y.type === "boolean" ? x((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (U) => n.value[y.name] = U
              }, [...h[5] || (h[5] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "True", -1),
                e("option", { value: "false" }, "False", -1)
              ])], 8, Jt)), [
                [I, n.value[y.name]]
              ]) : y.type === "enum" ? x((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (U) => n.value[y.name] = U
              }, [
                (s(!0), o(p, null, w(y.enum_values, (U) => (s(), o("option", { key: U }, d(U), 1))), 128))
              ], 8, Qt)), [
                [I, n.value[y.name]]
              ]) : ["object", "list"].includes(y.type) ? (s(), L(f(ge), {
                key: 2,
                modelValue: n.value[y.name],
                "onUpdate:modelValue": (U) => n.value[y.name] = U,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (s(), L(f(ke), {
                key: 3,
                modelValue: n.value[y.name],
                "onUpdate:modelValue": (U) => n.value[y.name] = U,
                type: y.type === "number" ? "number" : y.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type"]))
            ]))), 128))
          ]),
          V.value ? (s(), o("p", Ht, d(V.value), 1)) : b("", !0),
          e("div", Kt, [
            k(f(O), {
              label: "Save case",
              type: "submit",
              disabled: !v.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            k(f(O), {
              label: "Cancel",
              severity: "secondary",
              text: "",
              onClick: h[2] || (h[2] = (y) => i.value = !1)
            })
          ])
        ], 32)) : b("", !0),
        t.cases.length ? b("", !0) : (s(), o("p", Wt, "No evaluation cases yet.")),
        (s(!0), o(p, null, w(t.cases, (y) => (s(), o("div", {
          key: y.id,
          class: "field-card"
        }, [
          e("header", Yt, [
            e("h3", null, d(y.upload_name), 1),
            k(f(O), {
              label: "Remove case",
              severity: "secondary",
              text: "",
              size: "small",
              class: "push",
              disabled: t.saving,
              onClick: (U) => a("delete-case", y.id)
            }, null, 8, ["disabled", "onClick"])
          ]),
          e("dl", Gt, [
            (s(!0), o(p, null, w(y.expected, (U, m) => (s(), o(p, { key: m }, [
              e("dt", null, d(m), 1),
              e("dd", null, d(U), 1)
            ], 64))), 128))
          ])
        ]))), 128)),
        h[6] || (h[6] = e("p", { class: "muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", null, [
        h[8] || (h[8] = e("h2", null, "Revision comparison", -1)),
        t.results.length ? (s(), o("div", Zt, [
          (s(!0), o(p, null, w(C.value, (y, U) => (s(), o("article", {
            key: U,
            class: "field-card"
          }, [
            e("label", null, [
              h[7] || (h[7] = c("Configuration revision", -1)),
              e("select", {
                value: y?.revision,
                onChange: (m) => U === 0 ? B.value = Number(m.target.value) : E.value = Number(m.target.value)
              }, [
                (s(!0), o(p, null, w(t.results, (m) => (s(), o("option", {
                  key: m.revision,
                  value: m.revision
                }, "Revision " + d(m.revision), 9, en))), 128))
              ], 40, _t)
            ]),
            y ? (s(), o(p, { key: 0 }, [
              e("p", ln, d(y.cases) + " cases · $" + d(y.cost.toFixed(3)) + " · " + d((y.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("dl", tn, [
                (s(!0), o(p, null, w(y.metrics, (m) => (s(), o(p, {
                  key: m.field
                }, [
                  e("dt", null, d(m.field), 1),
                  e("dd", null, [
                    c(d(Math.round(m.accuracy * 100)) + "%", 1),
                    e("small", null, "$" + d(m.cost.toFixed(3)) + " · " + d((m.duration_ms / 1e3).toFixed(1)) + "s", 1)
                  ])
                ], 64))), 128))
              ])
            ], 64)) : b("", !0)
          ]))), 128))
        ])) : (s(), o("p", Xt, "No evaluation results yet."))
      ]),
      e("section", null, [
        e("div", nn, [
          h[9] || (h[9] = e("h2", null, "Proposals", -1)),
          k(f(O), {
            label: "Tune configuration",
            severity: "secondary",
            disabled: ""
          })
        ]),
        t.proposals.length ? b("", !0) : (s(), o("p", sn, "No tuning proposals yet.")),
        (s(!0), o(p, null, w(t.proposals, (y) => (s(), o("article", {
          key: y.id,
          class: "field-card"
        }, [
          e("h3", null, d(y.title), 1),
          e("p", on, d(y.accuracy_delta >= 0 ? "+" : "") + d(Math.round(y.accuracy_delta * 100)) + "% accuracy · " + d(y.cost_delta >= 0 ? "+" : "") + "$" + d(y.cost_delta.toFixed(3)) + " · " + d((y.duration_delta_ms / 1e3).toFixed(1)) + "s", 1),
          e("ul", null, [
            (s(!0), o(p, null, w(y.changes, (U) => (s(), o("li", { key: U }, d(U), 1))), 128))
          ]),
          e("div", an, [
            k(f(O), {
              label: "Apply proposal",
              disabled: ""
            }),
            k(f(O), {
              label: "Discard",
              severity: "secondary",
              disabled: ""
            })
          ])
        ]))), 128)),
        h[10] || (h[10] = e("p", { class: "muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ], 64));
  }
}), un = { class: "section-head" }, rn = { class: "muted" }, mn = {
  key: 0,
  class: "empty"
}, cn = {
  key: 1,
  class: "run-list"
}, vn = { class: "row" }, bn = { class: "capitalize" }, yn = ["data-status"], pn = /* @__PURE__ */ A({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const $ = (g) => new Date(g).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (g, a) => (s(), o(p, null, [
      e("div", un, [
        a[0] || (a[0] = e("h2", null, "Recent runs", -1)),
        e("span", rn, "Retention " + d(t.retention), 1)
      ]),
      t.runs.length ? (s(), o("div", cn, [
        (s(!0), o(p, null, w(t.runs, (i) => (s(), o("article", {
          key: i.id,
          class: "run-card"
        }, [
          e("div", vn, [
            e("strong", bn, d(i.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": i.status
            }, d(i.status), 9, yn)
          ]),
          e("dl", null, [
            a[1] || (a[1] = e("dt", null, "Duration", -1)),
            e("dd", null, d((i.duration_ms / 1e3).toFixed(1)) + "s", 1),
            a[2] || (a[2] = e("dt", null, "Expires", -1)),
            e("dd", null, d($(i.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (s(), o("p", mn, "No runs yet."))
    ], 64));
  }
}), fn = () => ({ result: null, evals: [], proposals: [] }), gn = { class: "docscout" }, kn = { class: "page-header" }, $n = { class: "heading" }, hn = { class: "title-row" }, xn = {
  key: 0,
  class: "description"
}, wn = { class: "stats" }, Vn = {
  key: 0,
  class: "save-area"
}, Cn = {
  key: 0,
  class: "unsaved"
}, Un = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Sn = ["id", "aria-selected", "aria-controls", "onClick"], qn = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Nn = {
  key: 1,
  role: "alert",
  class: "error banner"
}, En = {
  key: 2,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Mn = ["id", "aria-labelledby"], Fn = /* @__PURE__ */ A({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {}
  },
  emits: ["save", "add-case", "delete-case"],
  setup(t, { emit: $ }) {
    const g = t, a = $, i = q(), v = q("Builder"), l = q(ee()), n = q(""), V = q(""), F = T(() => g.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    J(v, () => {
      i.value && (i.value.scrollTop = 0);
    }, { flush: "post" });
    const B = T(() => g.engine ?? fn()), E = q();
    function C(m) {
      return n.value === m.title && V.value === (m.description ?? "") && he(l.value, m.config);
    }
    J(() => g.snapshot, (m, r) => {
      F.value.includes(v.value) || (v.value = F.value[0]), !(r && m.id === r.id && m.can_edit && r.can_edit && !C(r) && !C(m)) && (l.value = structuredClone(G(m.config ?? ee())), n.value = m.title, V.value = m.description ?? "", E.value = m.expected_revision);
    }, { immediate: !0 });
    const R = T(() => g.snapshot.can_edit && !C(g.snapshot)), h = T(() => $e(l.value)), y = T(() => l.value.workflow.filter((m) => m.enabled).length);
    function U() {
      a("save", { title: n.value, description: V.value, config: structuredClone(G(l.value)), expected_revision: E.value });
    }
    return (m, r) => (s(), o("main", gn, [
      e("header", kn, [
        e("div", $n, [
          e("div", hn, [
            e("h1", null, d(t.snapshot.title), 1),
            r[4] || (r[4] = e("span", { class: "badge" }, "Docscout", -1))
          ]),
          t.snapshot.description ? (s(), o("p", xn, d(t.snapshot.description), 1)) : b("", !0),
          e("div", wn, [
            e("span", null, d(t.snapshot.field_count) + " " + d(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (s(), o(p, { key: 0 }, [
              r[5] || (r[5] = e("span", { class: "sep" }, "·", -1)),
              e("span", null, d(y.value) + " steps", 1),
              r[6] || (r[6] = e("span", { class: "sep" }, "·", -1)),
              e("span", null, "revision " + d(t.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(p, { key: 1 }, [
              r[7] || (r[7] = e("span", { class: "sep" }, "·", -1)),
              r[8] || (r[8] = e("span", null, "Read access", -1))
            ], 64))
          ])
        ]),
        t.snapshot.can_edit ? (s(), o("div", Vn, [
          R.value ? (s(), o("span", Cn, "Unsaved changes")) : b("", !0),
          k(f(O), {
            label: "Save",
            loading: t.saving,
            disabled: !R.value || !!h.value || !n.value.trim(),
            onClick: U
          }, null, 8, ["loading", "disabled"])
        ])) : b("", !0)
      ]),
      e("nav", Un, [
        (s(!0), o(p, null, w(F.value, (u) => (s(), o("button", {
          id: `tab-${u}`,
          key: u,
          role: "tab",
          "aria-selected": v.value === u,
          "aria-controls": `panel-${u}`,
          onClick: (M) => v.value = u
        }, d(u), 9, Sn))), 128))
      ]),
      t.error ? (s(), o("p", qn, d(t.error), 1)) : b("", !0),
      h.value && t.snapshot.can_edit ? (s(), o("p", Nn, d(h.value), 1)) : b("", !0),
      v.value === "Builder" && t.snapshot.can_edit ? (s(), o("div", En, [
        k(ft, {
          title: n.value,
          "onUpdate:title": r[0] || (r[0] = (u) => n.value = u),
          description: V.value,
          "onUpdate:description": r[1] || (r[1] = (u) => V.value = u),
          config: l.value,
          retention: t.snapshot.retention,
          result: B.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 3,
        ref_key: "body",
        ref: i,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${v.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${v.value}`,
          class: "panel"
        }, [
          v.value === "Test" ? (s(), L(Lt, {
            key: 0,
            result: B.value.result,
            retention: t.snapshot.retention
          }, null, 8, ["result", "retention"])) : b("", !0),
          v.value === "Evals" && t.snapshot.can_edit ? (s(), L(dn, {
            key: 1,
            cases: t.snapshot.cases,
            results: B.value.evals,
            proposals: B.value.proposals,
            fields: t.snapshot.config?.fields ?? [],
            saving: t.saving,
            onAddCase: r[2] || (r[2] = (u) => a("add-case", u)),
            onDeleteCase: r[3] || (r[3] = (u) => a("delete-case", u))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : b("", !0),
          v.value === "Runs" ? (s(), L(pn, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : b("", !0)
        ], 8, Mn)
      ], 512))
    ]));
  }
}), Rn = {
  key: 1,
  class: "error",
  role: "alert"
}, Bn = {
  key: 2,
  class: "empty",
  role: "status"
}, Dn = /* @__PURE__ */ A({
  __name: "ManageRoot",
  setup(t) {
    const $ = xe(), g = T(() => $.value.entryId ?? ""), a = q(), i = q(""), v = q(!1);
    let l;
    async function n() {
      if (!g.value) {
        i.value = "No extractor selected.";
        return;
      }
      const E = g.value;
      try {
        const C = await Q.get(E);
        E === g.value && (a.value = C, i.value = "");
      } catch (C) {
        i.value = C instanceof Error ? C.message : String(C);
      }
    }
    J(g, () => {
      a.value = void 0, l?.(), n(), g.value && (l = ue(`component.${g.value}`, () => n()));
    }, { immediate: !0 }), de(() => l?.());
    async function V(E) {
      v.value = !0, i.value = "";
      try {
        await Q.update(g.value, E), await n();
      } catch (C) {
        i.value = C instanceof Error ? C.message : String(C);
      } finally {
        v.value = !1;
      }
    }
    async function F(E) {
      v.value = !0, i.value = "";
      try {
        await Q.addCase(g.value, E), await n();
      } catch (C) {
        i.value = C instanceof Error ? C.message : String(C);
      } finally {
        v.value = !1;
      }
    }
    async function B(E) {
      v.value = !0, i.value = "";
      try {
        await Q.deleteCase(g.value, E), await n();
      } catch (C) {
        i.value = C instanceof Error ? C.message : String(C);
      } finally {
        v.value = !1;
      }
    }
    return (E, C) => a.value ? (s(), L(Fn, {
      key: 0,
      snapshot: a.value,
      saving: v.value,
      error: i.value,
      onSave: V,
      onAddCase: F,
      onDeleteCase: B
    }, null, 8, ["snapshot", "saving", "error"])) : i.value ? (s(), o("p", Rn, d(i.value), 1)) : (s(), o("p", Bn, "Loading Docscout…"));
  }
}), oe = we(Dn, { type: "object", properties: { "entry-id": { type: "string", description: "Selected component id supplied by the workspace." } } });
async function Ln() {
  return oe;
}
re(import.meta.url, oe);
export {
  Ln as webComponent
};
