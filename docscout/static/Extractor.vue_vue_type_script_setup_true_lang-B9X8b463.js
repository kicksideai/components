import { defineComponent as R, useModel as Y, openBlock as n, createElementBlock as o, withModifiers as H, createElementVNode as e, mergeModels as le, createTextVNode as c, withDirectives as x, vModelText as U, Fragment as p, renderList as w, toDisplayString as a, vModelSelect as z, createCommentVNode as b, createVNode as $, ref as q, onMounted as te, unref as f, watch as J, nextTick as oe, computed as A, normalizeClass as I, withKeys as ie, createBlock as O, toRaw as G, onBeforeUnmount as ae } from "vue";
import { loadByTagName as ne, on as de } from "@wippy-fe/proxy";
import { g as ue, h as re, i as me, t as X, b as j, j as ce, m as K, k as ve, l as be, o as Z, p as _, q as ye, s as P, f as pe, e as ke, n as ee, r as fe, v as ge, c as Q } from "./index-BLN2AaPk.js";
import { Icon as T } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const $e = ["aria-checked", "aria-label", "disabled"], B = /* @__PURE__ */ R({
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
    const h = Y(t, "modelValue");
    return (g, d) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": h.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: d[0] || (d[0] = H((i) => h.value = !h.value, ["stop"]))
    }, [...d[1] || (d[1] = [
      e("span", null, null, -1)
    ])], 8, $e));
  }
}), he = ["disabled"], xe = { class: "grid" }, Ve = ["value"], we = { key: 0 }, Ce = ["value"], Ue = { key: 1 }, Se = ["value"], qe = { class: "grid" }, Ne = { class: "toggle-row" }, Fe = { class: "toggle-row" }, Ee = /* @__PURE__ */ R({
  __name: "FieldInspector",
  props: {
    field: {},
    readonly: { type: Boolean }
  },
  emits: ["remove"],
  setup(t, { emit: h }) {
    const g = h, d = ["text", "number", "boolean", "date", "enum", "list", "object"], i = (v) => v.target.value.split(`
`).map((l) => l.trim()).filter(Boolean);
    return (v, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", xe, [
        e("label", null, [
          l[13] || (l[13] = c("Name", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (s) => t.field.name = s),
            placeholder: "invoice_total",
            "aria-label": "Field name"
          }, null, 512), [
            [U, t.field.name]
          ])
        ]),
        e("label", null, [
          l[14] || (l[14] = c("Type", -1)),
          x(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (s) => t.field.type = s),
            "aria-label": "Field type"
          }, [
            (n(), o(p, null, w(d, (s) => e("option", {
              key: s,
              value: s
            }, a(s[0].toUpperCase() + s.slice(1)), 9, Ve)), 64))
          ], 512), [
            [z, t.field.type]
          ])
        ])
      ]),
      e("label", null, [
        l[15] || (l[15] = c("Description", -1)),
        x(e("textarea", {
          "onUpdate:modelValue": l[2] || (l[2] = (s) => t.field.description = s),
          rows: "2",
          placeholder: "What this value means"
        }, null, 512), [
          [U, t.field.description]
        ])
      ]),
      t.field.type === "enum" ? (n(), o("label", we, [
        l[16] || (l[16] = c("Allowed values", -1)),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One value per line",
          onInput: l[3] || (l[3] = (s) => t.field.enum_values = i(s))
        }, null, 40, Ce)
      ])) : b("", !0),
      t.field.type === "list" ? (n(), o("label", Ue, [
        l[17] || (l[17] = c("Item type", -1)),
        x(e("select", {
          "onUpdate:modelValue": l[4] || (l[4] = (s) => t.field.item_type = s)
        }, [
          (n(!0), o(p, null, w(d.filter((s) => s !== "list"), (s) => (n(), o("option", {
            key: s,
            value: s
          }, a(s), 9, Se))), 128))
        ], 512), [
          [z, t.field.item_type]
        ])
      ])) : b("", !0),
      l[27] || (l[27] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[18] || (l[18] = c("Search hints", -1)),
        x(e("textarea", {
          "onUpdate:modelValue": l[5] || (l[5] = (s) => t.field.search_hints = s),
          rows: "2",
          placeholder: "Terms and phrases to look for"
        }, null, 512), [
          [U, t.field.search_hints]
        ]),
        l[19] || (l[19] = e("small", null, "Added to Prefetch and Scout as this field's queries.", -1))
      ]),
      e("div", qe, [
        e("label", null, [
          l[21] || (l[21] = c("Strategy", -1)),
          x(e("select", {
            "onUpdate:modelValue": l[6] || (l[6] = (s) => t.field.strategy = s)
          }, [...l[20] || (l[20] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [z, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[22] || (l[22] = c("Chunks to read", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[7] || (l[7] = (s) => t.field.chunks = s),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              U,
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
          "onUpdate:modelValue": l[8] || (l[8] = (s) => t.field.validation_hints = s),
          rows: "2",
          placeholder: "Rules the value should satisfy"
        }, null, 512), [
          [U, t.field.validation_hints]
        ])
      ]),
      e("label", null, [
        l[24] || (l[24] = c("Expected format", -1)),
        x(e("input", {
          "onUpdate:modelValue": l[9] || (l[9] = (s) => t.field.expected_format = s),
          placeholder: "For example, YYYY-MM-DD"
        }, null, 512), [
          [U, t.field.expected_format]
        ])
      ]),
      e("div", Ne, [
        l[25] || (l[25] = e("span", null, "Required", -1)),
        $(B, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[10] || (l[10] = (s) => t.field.required = s),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Fe, [
        l[26] || (l[26] = e("span", null, "Evidence required", -1)),
        $(B, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[11] || (l[11] = (s) => t.field.evidence_required = s),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? b("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "btn danger-text",
        onClick: l[12] || (l[12] = (s) => g("remove"))
      }, "Remove field"))
    ], 8, he));
  }
}), Me = ["value", "capability", "aria-labelledby"], Be = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Re = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, W = /* @__PURE__ */ R({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: h }) {
    const g = h, d = q(!!customElements.get("wc-model-picker")), i = q("");
    te(async () => {
      if (!d.value)
        try {
          await ne("wc-model-picker", { timeoutMs: 8e3 }), d.value = !0;
        } catch (l) {
          i.value = l instanceof Error ? l.message : String(l);
        }
    });
    function v(l) {
      const s = l.detail;
      typeof s == "string" && g("select", s);
    }
    return (l, s) => d.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: v
    }, null, 40, Me)) : i.value ? (n(), o("p", Be, "Could not load model picker: " + a(i.value), 1)) : (n(), o("span", Re, "Loading models…"));
  }
}), De = ["disabled"], Te = { class: "muted" }, Ae = {
  key: 0,
  class: "toggle-row"
}, Pe = { class: "label-block" }, Oe = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "scope-label"
}, Le = ["aria-checked", "onClick"], ze = ["id"], Ie = { key: 2 }, je = { class: "grid" }, Je = ["onUpdate:modelValue"], Qe = ["onUpdate:modelValue"], He = ["onUpdate:modelValue"], We = ["onClick"], Ke = {
  key: 0,
  class: "muted"
}, Ye = { class: "grid" }, Ge = ["value"], Xe = { class: "grid" }, Ze = { class: "toggle-row" }, _e = { class: "toggle-row" }, el = { class: "mono" }, ll = { id: "model-deep-query" }, tl = { class: "grid" }, nl = { class: "grid" }, sl = { class: "grid" }, ol = { class: "toggle-row" }, il = {
  key: 7,
  class: "toggle-row"
}, al = /* @__PURE__ */ R({
  __name: "StepInspector",
  props: {
    step: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const h = t, g = [{ value: "outline", label: "Outline" }, { value: "section", label: "Section" }, { value: "chunk", label: "Chunk" }], d = ue();
    function i(v, l) {
      const s = h.config.tools.filter((V) => V !== v);
      h.config.tools = l ? [...s, v] : s;
    }
    return (v, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", Te, a(f(re)[t.step.kind]), 1),
      t.step.kind !== "extract" ? (n(), o("div", Ae, [
        l[21] || (l[21] = e("span", null, "Step enabled", -1)),
        $(B, {
          modelValue: t.step.enabled,
          "onUpdate:modelValue": l[0] || (l[0] = (s) => t.step.enabled = s),
          label: "Enable step",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0),
      e("div", Pe, [
        l[22] || (l[22] = e("span", { id: "scope-label" }, "Reads at", -1)),
        e("div", Oe, [
          (n(), o(p, null, w(g, (s) => e("button", {
            key: s.value,
            type: "button",
            role: "radio",
            "aria-checked": t.step.scope === s.value,
            onClick: (V) => t.step.scope = s.value
          }, a(s.label), 9, Le)), 64))
        ]),
        l[23] || (l[23] = e("small", null, "Layer of the document this step works on: outline, then section, then chunk.", -1))
      ]),
      t.step.model !== void 0 ? (n(), o("label", {
        key: 1,
        id: `model-${t.step.kind}`
      }, [
        c(a(t.step.kind === "deep" ? "Analysis model" : "Model"), 1),
        $(W, {
          value: t.step.model,
          capability: "generate",
          "labelled-by": `model-${t.step.kind}`,
          onSelect: l[1] || (l[1] = (s) => t.step.model = s)
        }, null, 8, ["value", "labelled-by"])
      ], 8, ze)) : b("", !0),
      t.step.kind === "map" ? (n(), o("label", Ie, [
        l[25] || (l[25] = c("Outline", -1)),
        x(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (s) => t.step.options.outline_mode = s)
        }, [...l[24] || (l[24] = [
          e("option", { value: "find_or_build" }, "Use the table of contents, or build an outline", -1),
          e("option", { value: "build" }, "Always build an outline", -1)
        ])], 512), [
          [z, t.step.options.outline_mode]
        ])
      ])) : b("", !0),
      t.step.kind === "prefetch" ? (n(), o(p, { key: 3 }, [
        l[29] || (l[29] = e("h4", null, "Queries", -1)),
        (n(!0), o(p, null, w(t.step.options.queries, (s, V) => (n(), o("div", {
          key: V,
          class: "query-row"
        }, [
          e("div", je, [
            e("label", null, [
              l[26] || (l[26] = c("Name", -1)),
              x(e("input", {
                "onUpdate:modelValue": (F) => s.name = F,
                placeholder: "Parties"
              }, null, 8, Je), [
                [U, s.name]
              ])
            ]),
            e("label", null, [
              l[27] || (l[27] = c("Chunks", -1)),
              x(e("input", {
                "onUpdate:modelValue": (F) => s.chunks = F,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Qe), [
                [
                  U,
                  s.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[28] || (l[28] = c("Query", -1)),
            x(e("textarea", {
              "onUpdate:modelValue": (F) => s.query = F,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, He), [
              [U, s.query]
            ])
          ]),
          t.readonly ? b("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (F) => t.step.options.queries.splice(V, 1)
          }, "Remove query", 8, We))
        ]))), 128)),
        t.step.options.queries.length ? b("", !0) : (n(), o("p", Ke, "No queries. Field search hints still run.")),
        t.readonly ? b("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[3] || (l[3] = (s) => t.step.options.queries.push(f(me)()))
        }, "Add query"))
      ], 64)) : b("", !0),
      t.step.kind === "scout" ? (n(), o(p, { key: 4 }, [
        e("div", Ye, [
          e("label", null, [
            l[30] || (l[30] = c("Rounds", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[4] || (l[4] = (s) => t.step.options.max_iterations = s),
              type: "number",
              min: "0",
              max: "30"
            }, null, 512), [
              [
                U,
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
              onInput: l[5] || (l[5] = (s) => t.step.options.target_confidence = Number(s.target.value) / 100)
            }, null, 40, Ge),
            l[33] || (l[33] = e("small", null, "Percent", -1))
          ])
        ]),
        e("div", Xe, [
          e("label", null, [
            l[34] || (l[34] = c("Extra queries per round", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[6] || (l[6] = (s) => t.step.options.max_extra_queries = s),
              type: "number",
              min: "0",
              max: "20"
            }, null, 512), [
              [
                U,
                t.step.options.max_extra_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[35] || (l[35] = c("Max tokens", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[7] || (l[7] = (s) => t.step.options.max_tokens = s),
              type: "number",
              min: "256",
              max: "64000"
            }, null, 512), [
              [
                U,
                t.step.options.max_tokens,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", Ze, [
          l[36] || (l[36] = e("span", null, "Drop noisy chunks", -1)),
          $(B, {
            modelValue: t.step.options.drop_noise,
            "onUpdate:modelValue": l[8] || (l[8] = (s) => t.step.options.drop_noise = s),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", _e, [
          l[37] || (l[37] = e("span", null, "Share scout notes with extraction", -1)),
          $(B, {
            modelValue: t.config.shared_context,
            "onUpdate:modelValue": l[9] || (l[9] = (s) => t.config.shared_context = s),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[38] || (l[38] = e("h4", null, "Agent tools", -1)),
        (n(!0), o(p, null, w(f(d), (s) => (n(), o("div", {
          key: s,
          class: "toggle-row"
        }, [
          e("span", null, [
            c(a(f(X)(s)), 1),
            e("small", el, a(s), 1)
          ]),
          $(B, {
            "model-value": t.config.tools.includes(s),
            label: f(X)(s),
            disabled: t.readonly,
            "onUpdate:modelValue": (V) => i(s, V)
          }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
        ]))), 128))
      ], 64)) : b("", !0),
      t.step.kind === "deep" ? (n(), o(p, { key: 5 }, [
        e("label", ll, [
          l[39] || (l[39] = c("Query model", -1)),
          $(W, {
            value: t.step.options.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[10] || (l[10] = (s) => t.step.options.query_model = s)
          }, null, 8, ["value"])
        ]),
        e("div", tl, [
          e("label", null, [
            l[40] || (l[40] = c("Fields at a time", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[11] || (l[11] = (s) => t.step.options.parallel_fields = s),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                U,
                t.step.options.parallel_fields,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[41] || (l[41] = c("Queries per field", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[12] || (l[12] = (s) => t.step.options.max_queries = s),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                U,
                t.step.options.max_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", nl, [
          e("label", null, [
            l[42] || (l[42] = c("Chunks per query", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[13] || (l[13] = (s) => t.step.options.chunks_per_query = s),
              type: "number",
              min: "1",
              max: "500"
            }, null, 512), [
              [
                U,
                t.step.options.chunks_per_query,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[43] || (l[43] = c("Chunk cap", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[14] || (l[14] = (s) => t.step.options.chunk_cap = s),
              type: "number",
              min: "1",
              max: "1000"
            }, null, 512), [
              [
                U,
                t.step.options.chunk_cap,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", sl, [
          e("label", null, [
            l[44] || (l[44] = c("Minimum similarity", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[15] || (l[15] = (s) => t.step.options.min_similarity = s),
              type: "number",
              min: "0",
              max: "1",
              step: "0.05"
            }, null, 512), [
              [
                U,
                t.step.options.min_similarity,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            l[45] || (l[45] = c("Query temperature", -1)),
            x(e("input", {
              "onUpdate:modelValue": l[16] || (l[16] = (s) => t.step.options.query_temperature = s),
              type: "number",
              min: "0",
              max: "2",
              step: "0.1"
            }, null, 512), [
              [
                U,
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
            "onUpdate:modelValue": l[17] || (l[17] = (s) => t.step.options.analysis_temperature = s),
            type: "number",
            min: "0",
            max: "2",
            step: "0.1"
          }, null, 512), [
            [
              U,
              t.step.options.analysis_temperature,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ], 64)) : b("", !0),
      t.step.kind === "extract" ? (n(), o(p, { key: 6 }, [
        e("label", null, [
          l[47] || (l[47] = c("Max output tokens", -1)),
          x(e("input", {
            "onUpdate:modelValue": l[18] || (l[18] = (s) => t.step.options.max_output_tokens = s),
            type: "number",
            min: "256",
            max: "64000"
          }, null, 512), [
            [
              U,
              t.step.options.max_output_tokens,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        e("div", ol, [
          l[48] || (l[48] = e("span", null, "Structured output", -1)),
          $(B, {
            modelValue: t.step.options.structured_output,
            "onUpdate:modelValue": l[19] || (l[19] = (s) => t.step.options.structured_output = s),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : b("", !0),
      t.step.kind === "verify" ? (n(), o("div", il, [
        l[49] || (l[49] = e("span", null, "Check every value", -1)),
        $(B, {
          modelValue: t.step.options.require_all_values,
          "onUpdate:modelValue": l[20] || (l[20] = (s) => t.step.options.require_all_values = s),
          label: "Check every value",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0)
    ], 8, De));
  }
}), dl = ["disabled"], ul = { class: "muted" }, rl = { class: "grid" }, ml = { class: "toggle-row" }, cl = { class: "label-block" }, vl = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, bl = ["aria-checked", "onClick"], yl = { id: "embedding-model" }, pl = { class: "toggle-row" }, kl = { class: "toggle-row" }, fl = {
  key: 0,
  id: "highlighter-model"
}, gl = /* @__PURE__ */ R({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const h = [{ value: "keyword", label: "Keyword" }, { value: "semantic", label: "Semantic" }, { value: "hybrid", label: "Hybrid" }];
    return (g, d) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", ul, "The upload's text is split into chunks and indexed for this run. Processed copies expire after " + a(t.retention) + ".", 1),
      d[19] || (d[19] = e("h4", null, "Chunks", -1)),
      e("div", rl, [
        e("label", null, [
          d[8] || (d[8] = c("Chunk size", -1)),
          x(e("input", {
            "onUpdate:modelValue": d[0] || (d[0] = (i) => t.config.retrieval.chunk_size = i),
            type: "number",
            min: "100",
            max: "16000"
          }, null, 512), [
            [
              U,
              t.config.retrieval.chunk_size,
              void 0,
              { number: !0 }
            ]
          ]),
          d[9] || (d[9] = e("small", null, "Tokens", -1))
        ]),
        e("label", null, [
          d[10] || (d[10] = c("Overlap", -1)),
          x(e("input", {
            "onUpdate:modelValue": d[1] || (d[1] = (i) => t.config.retrieval.overlap = i),
            type: "number",
            min: "0",
            max: "4000"
          }, null, 512), [
            [
              U,
              t.config.retrieval.overlap,
              void 0,
              { number: !0 }
            ]
          ]),
          d[11] || (d[11] = e("small", null, "Tokens", -1))
        ])
      ]),
      e("div", ml, [
        d[12] || (d[12] = e("span", null, "Split by headings", -1)),
        $(B, {
          modelValue: t.config.retrieval.split_headings,
          "onUpdate:modelValue": d[2] || (d[2] = (i) => t.config.retrieval.split_headings = i),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d[20] || (d[20] = e("h4", null, "Search", -1)),
      e("div", cl, [
        d[13] || (d[13] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", vl, [
          (n(), o(p, null, w(h, (i) => e("button", {
            key: i.value,
            type: "button",
            role: "radio",
            "aria-checked": t.config.retrieval.search_mode === i.value,
            onClick: (v) => t.config.retrieval.search_mode = i.value
          }, a(i.label), 9, bl)), 64))
        ])
      ]),
      e("label", null, [
        d[14] || (d[14] = c("Results per query", -1)),
        x(e("input", {
          "onUpdate:modelValue": d[3] || (d[3] = (i) => t.config.retrieval.top_results = i),
          type: "number",
          min: "1",
          max: "100"
        }, null, 512), [
          [
            U,
            t.config.retrieval.top_results,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      e("label", yl, [
        d[15] || (d[15] = c("Embedding model", -1)),
        $(W, {
          value: t.config.retrieval.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: d[4] || (d[4] = (i) => t.config.retrieval.embedding_model = i)
        }, null, 8, ["value"])
      ]),
      e("div", pl, [
        d[16] || (d[16] = e("span", null, [
          c("Contextual embeddings"),
          e("small", null, "Prepend section context to each chunk before embedding.")
        ], -1)),
        $(B, {
          modelValue: t.config.retrieval.contextual_embeddings,
          "onUpdate:modelValue": d[5] || (d[5] = (i) => t.config.retrieval.contextual_embeddings = i),
          label: "Contextual embeddings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      d[21] || (d[21] = e("h4", null, "Highlighter", -1)),
      e("div", kl, [
        d[17] || (d[17] = e("span", null, [
          c("Mark relevant spans"),
          e("small", null, "A small model highlights what each field needs before extraction.")
        ], -1)),
        $(B, {
          modelValue: t.config.retrieval.highlighter,
          "onUpdate:modelValue": d[6] || (d[6] = (i) => t.config.retrieval.highlighter = i),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.config.retrieval.highlighter ? (n(), o("label", fl, [
        d[18] || (d[18] = c("Highlighter model", -1)),
        $(W, {
          value: t.config.retrieval.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: d[7] || (d[7] = (i) => t.config.retrieval.highlighter_model = i)
        }, null, 8, ["value"])
      ])) : b("", !0)
    ], 8, dl));
  }
}), $l = { class: "builder" }, hl = {
  class: "pane fields-pane",
  "aria-label": "Fields"
}, xl = { class: "pane-head" }, Vl = { class: "count" }, wl = {
  key: 0,
  class: "muted pad"
}, Cl = { class: "field-list" }, Ul = ["onClick"], Sl = { class: "field-name" }, ql = {
  key: 0,
  class: "req",
  title: "Required"
}, Nl = { class: "chips" }, Fl = {
  key: 0,
  class: "chip primary"
}, El = { class: "chip" }, Ml = {
  key: 0,
  class: "reorder"
}, Bl = ["disabled", "onClick"], Rl = ["disabled", "onClick"], Dl = {
  class: "flow",
  "aria-label": "Extraction flow"
}, Tl = { class: "node-icon" }, Al = { class: "node-main" }, Pl = { class: "node-summary" }, Ol = {
  key: 0,
  class: "chips"
}, Ll = { class: "chip" }, zl = { class: "chip model" }, Il = ["onClick", "onKeydown"], jl = { class: "node-icon" }, Jl = { class: "node-main" }, Ql = { class: "node-title" }, Hl = { class: "scope" }, Wl = { class: "node-summary" }, Kl = {
  key: 0,
  class: "chips"
}, Yl = {
  key: 1,
  class: "chips"
}, Gl = {
  key: 2,
  class: "chips"
}, Xl = {
  key: 3,
  class: "trace-line"
}, Zl = { class: "node-side" }, _l = {
  key: 0,
  class: "chip model"
}, et = {
  key: 1,
  class: "node-actions"
}, lt = ["aria-label", "onClick"], tt = ["aria-label", "onClick"], nt = { class: "node-icon" }, st = { class: "node-main" }, ot = { class: "node-summary" }, it = { class: "pane-head" }, at = { class: "inspector-body" }, dt = ["disabled"], ut = {
  key: 4,
  class: "inspector-form"
}, rt = { class: "output-list" }, mt = { class: "mono" }, ct = { class: "chip" }, vt = /* @__PURE__ */ R({
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
    const h = t, g = Y(t, "title"), d = Y(t, "description"), i = q({ kind: "document" }), v = q();
    J(i, async () => {
      await oe(), v.value && (v.value.parentElement?.clientWidth ?? 0) <= 680 && v.value.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    const l = (r) => JSON.stringify(r) === JSON.stringify(i.value) || r.kind === "step" && i.value.kind === "step" && r.step === i.value.step, s = A(() => i.value.kind === "field" ? h.config.fields[i.value.index] : void 0), V = A(() => {
      const r = i.value;
      return r.kind === "step" ? j[r.step.kind] : r.kind === "field" ? s.value?.name || "New field" : r.kind === "document" ? "Read document" : r.kind === "output" ? "Output" : "Details";
    }), F = A(() => h.config.fields.filter((r) => r.strategy === "deep")), M = A(() => h.config.fields.filter((r) => r.search_hints.trim())), D = (r) => h.result?.trace.find((m) => m.kind === r), L = (r) => [`${(r.duration_ms / 1e3).toFixed(1)}s`, `${(r.input_tokens + r.output_tokens).toLocaleString()} tokens`, r.queries?.length ? `${r.queries.length} queries` : "", r.message ?? ""].filter(Boolean).join(" · ");
    function S() {
      h.config.fields.push(ye()), i.value = { kind: "field", index: h.config.fields.length - 1 };
    }
    function k(r) {
      h.config.fields.splice(r, 1), i.value = { kind: "document" };
    }
    function y(r, m) {
      const u = h.config.fields, E = r + m;
      if (E < 0 || E >= u.length) return;
      const [N] = u.splice(r, 1);
      u.splice(E, 0, N), i.value = { kind: "field", index: E };
    }
    const C = A({ get: () => h.config.tags.join(", "), set: (r) => {
      h.config.tags = [...new Set(r.split(",").map((m) => m.trim()).filter(Boolean))];
    } });
    return (r, m) => (n(), o("div", $l, [
      e("aside", hl, [
        e("div", xl, [
          m[7] || (m[7] = e("h2", null, "Fields", -1)),
          e("span", Vl, a(t.config.fields.length), 1),
          t.readonly ? b("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "icon-btn push",
            "aria-label": "Add field",
            title: "Add field",
            onClick: S
          }, [
            $(f(T), { icon: "tabler:plus" })
          ]))
        ]),
        t.config.fields.length ? b("", !0) : (n(), o("p", wl, "Add the values to pull from each document.")),
        e("ul", Cl, [
          (n(!0), o(p, null, w(t.config.fields, (u, E) => (n(), o("li", { key: E }, [
            e("button", {
              type: "button",
              class: I(["field-item", { active: l({ kind: "field", index: E }) }]),
              onClick: (N) => i.value = { kind: "field", index: E }
            }, [
              e("span", Sl, [
                c(a(u.name || "New field"), 1),
                u.required ? (n(), o("span", ql, "*")) : b("", !0)
              ]),
              e("span", Nl, [
                u.strategy === "deep" ? (n(), o("span", Fl, "deep")) : b("", !0),
                e("span", El, a(u.type), 1)
              ])
            ], 10, Ul),
            !t.readonly && l({ kind: "field", index: E }) ? (n(), o("span", Ml, [
              e("button", {
                type: "button",
                class: "icon-btn",
                "aria-label": "Move field up",
                disabled: E === 0,
                onClick: (N) => y(E, -1)
              }, [
                $(f(T), { icon: "tabler:chevron-up" })
              ], 8, Bl),
              e("button", {
                type: "button",
                class: "icon-btn",
                "aria-label": "Move field down",
                disabled: E === t.config.fields.length - 1,
                onClick: (N) => y(E, 1)
              }, [
                $(f(T), { icon: "tabler:chevron-down" })
              ], 8, Rl)
            ])) : b("", !0)
          ]))), 128))
        ]),
        t.readonly ? b("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "btn add-field",
          onClick: S
        }, [
          $(f(T), { icon: "tabler:plus" }),
          m[8] || (m[8] = c("Add field", -1))
        ]))
      ]),
      e("section", Dl, [
        e("button", {
          type: "button",
          class: I(["node fixed", { active: l({ kind: "document" }) }]),
          onClick: m[0] || (m[0] = (u) => i.value = { kind: "document" })
        }, [
          e("span", Tl, [
            $(f(T), { icon: "tabler:file-text" })
          ]),
          e("span", Al, [
            m[9] || (m[9] = e("span", { class: "node-title" }, "Read document", -1)),
            e("span", Pl, a(f(ce)(t.config.retrieval)), 1),
            t.config.retrieval.highlighter ? (n(), o("span", Ol, [
              e("span", Ll, "Highlighter · " + a(f(K)(t.config.retrieval.highlighter_model)), 1)
            ])) : b("", !0)
          ]),
          e("span", zl, a(f(K)(t.config.retrieval.embedding_model)), 1)
        ], 2),
        (n(!0), o(p, null, w(t.config.workflow, (u, E) => (n(), o(p, {
          key: u.kind
        }, [
          e("div", {
            class: I(["connector", { off: !u.enabled }])
          }, null, 2),
          e("div", {
            class: I(["node", { active: l({ kind: "step", step: u }), off: !u.enabled }]),
            role: "button",
            tabindex: "0",
            onClick: (N) => i.value = { kind: "step", step: u },
            onKeydown: ie((N) => i.value = { kind: "step", step: u }, ["enter"])
          }, [
            e("span", jl, [
              $(f(T), {
                icon: f(ve)[u.kind]
              }, null, 8, ["icon"])
            ]),
            e("span", Jl, [
              e("span", Ql, [
                c(a(f(j)[u.kind]), 1),
                e("span", Hl, a(u.scope), 1)
              ]),
              e("span", Wl, a(u.enabled ? f(be)(u, t.config) : "Off"), 1),
              u.enabled && u.kind === "deep" && F.value.length ? (n(), o("span", Kl, [
                (n(!0), o(p, null, w(F.value, (N) => (n(), o("span", {
                  key: N.name,
                  class: "chip primary"
                }, a(N.name || "New field"), 1))), 128))
              ])) : b("", !0),
              u.enabled && u.kind === "prefetch" && (u.options.queries.length || M.value.length) ? (n(), o("span", Yl, [
                (n(!0), o(p, null, w(u.options.queries, (N) => (n(), o("span", {
                  key: "q" + N.name,
                  class: "chip"
                }, a(N.name || "Untitled query"), 1))), 128)),
                (n(!0), o(p, null, w(M.value, (N) => (n(), o("span", {
                  key: "f" + N.name,
                  class: "chip muted-chip"
                }, a(N.name), 1))), 128))
              ])) : b("", !0),
              u.enabled && u.kind === "scout" ? (n(), o("span", Gl, [
                (n(!0), o(p, null, w(t.config.tools, (N) => (n(), o("span", {
                  key: N,
                  class: "chip"
                }, a(N.split(":").pop()?.replace(/_/g, " ")), 1))), 128))
              ])) : b("", !0),
              D(u.kind) ? (n(), o("span", Xl, [
                $(f(T), {
                  icon: D(u.kind).status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
                }, null, 8, ["icon"]),
                c(a(L(D(u.kind))), 1)
              ])) : b("", !0)
            ]),
            e("span", Zl, [
              u.enabled && u.model ? (n(), o("span", _l, a(f(K)(u.model)), 1)) : b("", !0),
              t.readonly ? b("", !0) : (n(), o("span", et, [
                f(Z)(t.config, E, -1) ? (n(), o("button", {
                  key: 0,
                  type: "button",
                  class: "icon-btn",
                  "aria-label": `Move ${f(j)[u.kind]} up`,
                  onClick: H((N) => f(_)(t.config, E, -1), ["stop"])
                }, [
                  $(f(T), { icon: "tabler:arrow-up" })
                ], 8, lt)) : b("", !0),
                f(Z)(t.config, E, 1) ? (n(), o("button", {
                  key: 1,
                  type: "button",
                  class: "icon-btn",
                  "aria-label": `Move ${f(j)[u.kind]} down`,
                  onClick: H((N) => f(_)(t.config, E, 1), ["stop"])
                }, [
                  $(f(T), { icon: "tabler:arrow-down" })
                ], 8, tt)) : b("", !0),
                u.kind !== "extract" ? (n(), O(B, {
                  key: 2,
                  modelValue: u.enabled,
                  "onUpdate:modelValue": (N) => u.enabled = N,
                  label: `Enable ${f(j)[u.kind]}`
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])) : b("", !0)
              ]))
            ])
          ], 42, Il)
        ], 64))), 128)),
        m[11] || (m[11] = e("div", { class: "connector" }, null, -1)),
        e("button", {
          type: "button",
          class: I(["node fixed", { active: l({ kind: "output" }) }]),
          onClick: m[1] || (m[1] = (u) => i.value = { kind: "output" })
        }, [
          e("span", nt, [
            $(f(T), { icon: "tabler:braces" })
          ]),
          e("span", st, [
            m[10] || (m[10] = e("span", { class: "node-title" }, "Output", -1)),
            e("span", ot, a(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
          ])
        ], 2)
      ]),
      e("aside", {
        ref_key: "inspector",
        ref: v,
        class: "pane inspector",
        "aria-label": "Inspector"
      }, [
        e("div", it, [
          e("h2", null, a(V.value), 1),
          i.value.kind !== "details" ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle push",
            onClick: m[2] || (m[2] = (u) => i.value = { kind: "details" })
          }, "Details")) : b("", !0)
        ]),
        e("div", at, [
          i.value.kind === "document" ? (n(), O(gl, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : i.value.kind === "step" ? (n(), O(al, {
            key: 1,
            step: i.value.step,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["step", "config", "readonly"])) : i.value.kind === "field" && s.value ? (n(), O(Ee, {
            key: 2,
            field: s.value,
            readonly: t.readonly,
            onRemove: m[3] || (m[3] = (u) => k(i.value.index))
          }, null, 8, ["field", "readonly"])) : i.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              m[12] || (m[12] = c("Name", -1)),
              x(e("input", {
                "onUpdate:modelValue": m[4] || (m[4] = (u) => g.value = u),
                "aria-label": "Extractor name"
              }, null, 512), [
                [U, g.value]
              ])
            ]),
            e("label", null, [
              m[13] || (m[13] = c("Description", -1)),
              x(e("textarea", {
                "onUpdate:modelValue": m[5] || (m[5] = (u) => d.value = u),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [U, d.value]
              ])
            ]),
            e("label", null, [
              m[14] || (m[14] = c("Tags", -1)),
              x(e("input", {
                "onUpdate:modelValue": m[6] || (m[6] = (u) => C.value = u),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  U,
                  C.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              m[15] || (m[15] = e("small", null, "Comma separated", -1))
            ])
          ], 8, dt)) : i.value.kind === "output" ? (n(), o("div", ut, [
            m[16] || (m[16] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", rt, [
              (n(!0), o(p, null, w(t.config.fields, (u) => (n(), o("li", {
                key: u.name
              }, [
                e("span", mt, a(u.name || "New field"), 1),
                e("span", ct, a(u.type === "list" ? `list of ${u.item_type}` : u.type), 1)
              ]))), 128))
            ]),
            m[17] || (m[17] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : b("", !0)
        ])
      ], 512)
    ]));
  }
}), bt = ["selected"], yt = {
  key: 1,
  role: "alert"
}, pt = {
  key: 2,
  class: "muted"
}, se = /* @__PURE__ */ R({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: h }) {
    const g = h, d = q(!1), i = q("");
    te(async () => {
      try {
        await ne("wc-multiselect", { timeoutMs: 8e3 }), d.value = !0;
      } catch (l) {
        i.value = String(l);
      }
    });
    function v(l) {
      const s = l.detail;
      g("select", s.selected[0] || "", s.labels?.[0] || "");
    }
    return (l, s) => d.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: v
    }, null, 40, bt)) : i.value ? (n(), o("p", yt, a(i.value), 1)) : (n(), o("span", pt, "Loading uploads…"));
  }
}), kt = { class: "test-input" }, ft = { class: "row wrap" }, gt = { class: "grow" }, $t = { class: "retention" }, ht = { class: "section-head" }, xt = { class: "muted" }, Vt = { class: "row" }, wt = { class: "confidence push" }, Ct = { class: "value" }, Ut = { class: "muted" }, St = {
  key: 0,
  class: "muted"
}, qt = { class: "trace" }, Nt = { class: "row wrap" }, Ft = { class: "muted" }, Et = { class: "push" }, Mt = { class: "muted" }, Bt = { key: 0 }, Rt = { key: 1 }, Dt = {
  key: 1,
  class: "empty"
}, Tt = /* @__PURE__ */ R({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(t) {
    const h = q(""), g = (i) => `${Math.round(i * 100)}%`, d = (i) => typeof i == "string" ? i : JSON.stringify(i);
    return (i, v) => (n(), o(p, null, [
      e("section", kt, [
        v[1] || (v[1] = e("h2", null, "Document", -1)),
        e("div", ft, [
          e("div", gt, [
            $(se, {
              value: h.value,
              onSelect: v[0] || (v[0] = (l) => h.value = l)
            }, null, 8, ["value"])
          ]),
          $(f(P), {
            label: "Run extraction",
            disabled: ""
          })
        ]),
        v[2] || (v[2] = e("p", { class: "muted" }, "Extraction is not available yet.", -1)),
        e("p", $t, "Processed documents and runs expire after " + a(t.retention) + ".", 1)
      ]),
      t.result ? (n(), o(p, { key: 0 }, [
        e("div", ht, [
          v[3] || (v[3] = e("h2", null, "Values", -1)),
          e("span", xt, a(t.result.tokens.toLocaleString()) + " tokens · " + a((t.result.duration_ms / 1e3).toFixed(1)) + "s", 1)
        ]),
        (n(!0), o(p, null, w(t.result.fields, (l) => (n(), o("article", {
          key: l.name,
          class: "field-card value-card"
        }, [
          e("header", Vt, [
            e("h3", null, a(l.name), 1),
            e("span", wt, a(g(l.confidence)) + " confidence", 1)
          ]),
          e("p", Ct, a(d(l.value)), 1),
          e("p", Ut, a(l.verified ? "Verified" : "Unverified"), 1),
          (n(!0), o(p, null, w(l.evidence, (s, V) => (n(), o("blockquote", { key: V }, [
            e("p", null, "“" + a(s.quote) + "”", 1),
            e("cite", null, [
              c(a(s.section), 1),
              s.page !== void 0 ? (n(), o(p, { key: 0 }, [
                c(" · Page " + a(s.page), 1)
              ], 64)) : b("", !0)
            ])
          ]))), 128)),
          l.evidence.length ? b("", !0) : (n(), o("p", St, "No evidence."))
        ]))), 128)),
        v[4] || (v[4] = e("h2", null, "Trace", -1)),
        e("ol", qt, [
          (n(!0), o(p, null, w(t.result.trace, (l, s) => (n(), o("li", { key: s }, [
            e("div", Nt, [
              e("strong", null, a(l.kind), 1),
              e("span", Ft, a(l.status), 1),
              e("span", Et, a((l.duration_ms / 1e3).toFixed(1)) + "s", 1)
            ]),
            e("p", Mt, [
              c(a(l.scope), 1),
              l.model ? (n(), o(p, { key: 0 }, [
                c(" · " + a(l.model), 1)
              ], 64)) : b("", !0),
              c(" · " + a(l.input_tokens + l.output_tokens) + " tokens", 1),
              l.cost !== void 0 ? (n(), o(p, { key: 1 }, [
                c(" · $" + a(l.cost.toFixed(4)), 1)
              ], 64)) : b("", !0)
            ]),
            l.message ? (n(), o("p", Bt, a(l.message), 1)) : b("", !0),
            l.queries?.length ? (n(), o("ul", Rt, [
              (n(!0), o(p, null, w(l.queries, (V) => (n(), o("li", { key: V }, a(V), 1))), 128))
            ])) : b("", !0)
          ]))), 128))
        ])
      ], 64)) : (n(), o("p", Dt, "No extraction results yet."))
    ], 64));
  }
}), At = { class: "section-head" }, Pt = { class: "row wrap" }, Ot = { class: "grid" }, Lt = ["onUpdate:modelValue"], zt = ["onUpdate:modelValue"], It = {
  key: 0,
  class: "error",
  role: "alert"
}, jt = { class: "row" }, Jt = {
  key: 1,
  class: "empty"
}, Qt = { class: "row" }, Ht = { class: "values" }, Wt = {
  key: 0,
  class: "empty"
}, Kt = {
  key: 1,
  class: "grid comparison"
}, Yt = ["value", "onChange"], Gt = ["value"], Xt = { class: "muted" }, Zt = { class: "values" }, _t = { class: "section-head" }, en = {
  key: 0,
  class: "empty"
}, ln = { class: "delta" }, tn = { class: "row" }, nn = /* @__PURE__ */ R({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(t, { emit: h }) {
    const g = t, d = h, i = q(!1), v = q(""), l = q(""), s = q({}), V = q("");
    J(() => g.cases, () => {
      i.value = !1, v.value = "", s.value = {};
    });
    function F() {
      V.value = "";
      const S = {};
      try {
        for (const k of g.fields) {
          const y = s.value[k.name] ?? "";
          S[k.name] = ["number", "boolean", "list", "object"].includes(k.type) ? y.trim() ? JSON.parse(y) : null : y;
        }
        d("add-case", { upload_id: v.value, upload_name: l.value, expected: S });
      } catch {
        V.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const M = q(), D = q(), L = A(() => [g.results.find((S) => S.revision === (M.value ?? g.results[0]?.revision)), g.results.find((S) => S.revision === (D.value ?? g.results[1]?.revision))]);
    return (S, k) => (n(), o(p, null, [
      e("section", null, [
        e("div", At, [
          k[3] || (k[3] = e("h2", null, "Cases", -1)),
          e("div", Pt, [
            $(f(P), {
              label: "Add case",
              severity: "secondary",
              disabled: !t.fields.length,
              onClick: k[0] || (k[0] = (y) => i.value = !i.value)
            }, null, 8, ["disabled"]),
            $(f(P), {
              label: "Run all cases",
              disabled: ""
            })
          ])
        ]),
        i.value ? (n(), o("form", {
          key: 0,
          class: "field-card",
          onSubmit: H(F, ["prevent"])
        }, [
          e("label", null, [
            k[4] || (k[4] = c("Upload", -1)),
            $(se, {
              value: v.value,
              onSelect: k[1] || (k[1] = (y, C) => {
                v.value = y, l.value = C;
              })
            }, null, 8, ["value"])
          ]),
          e("div", Ot, [
            (n(!0), o(p, null, w(t.fields, (y) => (n(), o("label", {
              key: y.name
            }, [
              c(a(y.name), 1),
              y.type === "boolean" ? x((n(), o("select", {
                key: 0,
                "onUpdate:modelValue": (C) => s.value[y.name] = C
              }, [...k[5] || (k[5] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "True", -1),
                e("option", { value: "false" }, "False", -1)
              ])], 8, Lt)), [
                [z, s.value[y.name]]
              ]) : y.type === "enum" ? x((n(), o("select", {
                key: 1,
                "onUpdate:modelValue": (C) => s.value[y.name] = C
              }, [
                (n(!0), o(p, null, w(y.enum_values, (C) => (n(), o("option", { key: C }, a(C), 1))), 128))
              ], 8, zt)), [
                [z, s.value[y.name]]
              ]) : ["object", "list"].includes(y.type) ? (n(), O(f(pe), {
                key: 2,
                modelValue: s.value[y.name],
                "onUpdate:modelValue": (C) => s.value[y.name] = C,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), O(f(ke), {
                key: 3,
                modelValue: s.value[y.name],
                "onUpdate:modelValue": (C) => s.value[y.name] = C,
                type: y.type === "number" ? "number" : y.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type"]))
            ]))), 128))
          ]),
          V.value ? (n(), o("p", It, a(V.value), 1)) : b("", !0),
          e("div", jt, [
            $(f(P), {
              label: "Save case",
              type: "submit",
              disabled: !v.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            $(f(P), {
              label: "Cancel",
              severity: "secondary",
              text: "",
              onClick: k[2] || (k[2] = (y) => i.value = !1)
            })
          ])
        ], 32)) : b("", !0),
        t.cases.length ? b("", !0) : (n(), o("p", Jt, "No evaluation cases yet.")),
        (n(!0), o(p, null, w(t.cases, (y) => (n(), o("div", {
          key: y.id,
          class: "field-card"
        }, [
          e("header", Qt, [
            e("h3", null, a(y.upload_name), 1),
            $(f(P), {
              label: "Remove case",
              severity: "secondary",
              text: "",
              size: "small",
              class: "push",
              disabled: t.saving,
              onClick: (C) => d("delete-case", y.id)
            }, null, 8, ["disabled", "onClick"])
          ]),
          e("dl", Ht, [
            (n(!0), o(p, null, w(y.expected, (C, r) => (n(), o(p, { key: r }, [
              e("dt", null, a(r), 1),
              e("dd", null, a(C), 1)
            ], 64))), 128))
          ])
        ]))), 128)),
        k[6] || (k[6] = e("p", { class: "muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", null, [
        k[8] || (k[8] = e("h2", null, "Revision comparison", -1)),
        t.results.length ? (n(), o("div", Kt, [
          (n(!0), o(p, null, w(L.value, (y, C) => (n(), o("article", {
            key: C,
            class: "field-card"
          }, [
            e("label", null, [
              k[7] || (k[7] = c("Configuration revision", -1)),
              e("select", {
                value: y?.revision,
                onChange: (r) => C === 0 ? M.value = Number(r.target.value) : D.value = Number(r.target.value)
              }, [
                (n(!0), o(p, null, w(t.results, (r) => (n(), o("option", {
                  key: r.revision,
                  value: r.revision
                }, "Revision " + a(r.revision), 9, Gt))), 128))
              ], 40, Yt)
            ]),
            y ? (n(), o(p, { key: 0 }, [
              e("p", Xt, a(y.cases) + " cases · $" + a(y.cost.toFixed(3)) + " · " + a((y.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("dl", Zt, [
                (n(!0), o(p, null, w(y.metrics, (r) => (n(), o(p, {
                  key: r.field
                }, [
                  e("dt", null, a(r.field), 1),
                  e("dd", null, [
                    c(a(Math.round(r.accuracy * 100)) + "%", 1),
                    e("small", null, "$" + a(r.cost.toFixed(3)) + " · " + a((r.duration_ms / 1e3).toFixed(1)) + "s", 1)
                  ])
                ], 64))), 128))
              ])
            ], 64)) : b("", !0)
          ]))), 128))
        ])) : (n(), o("p", Wt, "No evaluation results yet."))
      ]),
      e("section", null, [
        e("div", _t, [
          k[9] || (k[9] = e("h2", null, "Proposals", -1)),
          $(f(P), {
            label: "Tune configuration",
            severity: "secondary",
            disabled: ""
          })
        ]),
        t.proposals.length ? b("", !0) : (n(), o("p", en, "No tuning proposals yet.")),
        (n(!0), o(p, null, w(t.proposals, (y) => (n(), o("article", {
          key: y.id,
          class: "field-card"
        }, [
          e("h3", null, a(y.title), 1),
          e("p", ln, a(y.accuracy_delta >= 0 ? "+" : "") + a(Math.round(y.accuracy_delta * 100)) + "% accuracy · " + a(y.cost_delta >= 0 ? "+" : "") + "$" + a(y.cost_delta.toFixed(3)) + " · " + a((y.duration_delta_ms / 1e3).toFixed(1)) + "s", 1),
          e("ul", null, [
            (n(!0), o(p, null, w(y.changes, (C) => (n(), o("li", { key: C }, a(C), 1))), 128))
          ]),
          e("div", tn, [
            $(f(P), {
              label: "Apply proposal",
              disabled: ""
            }),
            $(f(P), {
              label: "Discard",
              severity: "secondary",
              disabled: ""
            })
          ])
        ]))), 128)),
        k[10] || (k[10] = e("p", { class: "muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ], 64));
  }
}), sn = { class: "section-head" }, on = { class: "muted" }, an = {
  key: 0,
  class: "empty"
}, dn = {
  key: 1,
  class: "run-list"
}, un = { class: "row" }, rn = { class: "capitalize" }, mn = ["data-status"], cn = /* @__PURE__ */ R({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const h = (g) => new Date(g).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (g, d) => (n(), o(p, null, [
      e("div", sn, [
        d[0] || (d[0] = e("h2", null, "Recent runs", -1)),
        e("span", on, "Retention " + a(t.retention), 1)
      ]),
      t.runs.length ? (n(), o("div", dn, [
        (n(!0), o(p, null, w(t.runs, (i) => (n(), o("article", {
          key: i.id,
          class: "run-card"
        }, [
          e("div", un, [
            e("strong", rn, a(i.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": i.status
            }, a(i.status), 9, mn)
          ]),
          e("dl", null, [
            d[1] || (d[1] = e("dt", null, "Duration", -1)),
            e("dd", null, a((i.duration_ms / 1e3).toFixed(1)) + "s", 1),
            d[2] || (d[2] = e("dt", null, "Expires", -1)),
            e("dd", null, a(h(i.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (n(), o("p", an, "No runs yet."))
    ], 64));
  }
}), vn = () => ({ result: null, evals: [], proposals: [] }), bn = { class: "docscout" }, yn = { class: "toolbar" }, pn = { class: "toolbar-lead" }, kn = { class: "crumb" }, fn = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, gn = ["id", "aria-selected", "aria-controls", "onClick"], $n = { class: "toolbar-side" }, hn = { class: "stats" }, xn = {
  key: 0,
  class: "unsaved"
}, Vn = {
  key: 0,
  role: "alert",
  class: "error banner"
}, wn = {
  key: 1,
  role: "alert",
  class: "error banner"
}, Cn = {
  key: 2,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Un = ["id", "aria-labelledby"], Sn = /* @__PURE__ */ R({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back"],
  setup(t, { emit: h }) {
    const g = t, d = h, i = q(), v = q("Builder"), l = q(ee()), s = q(""), V = q(""), F = A(() => g.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    J(v, () => {
      i.value && (i.value.scrollTop = 0);
    }, { flush: "post" });
    const M = A(() => g.engine ?? vn()), D = q();
    function L(r) {
      return s.value === r.title && V.value === (r.description ?? "") && ge(l.value, r.config);
    }
    J(() => g.snapshot, (r, m) => {
      F.value.includes(v.value) || (v.value = F.value[0]), !(m && r.id === m.id && r.can_edit && m.can_edit && !L(m) && !L(r)) && (l.value = structuredClone(G(r.config ?? ee())), s.value = r.title, V.value = r.description ?? "", D.value = r.expected_revision);
    }, { immediate: !0 });
    const S = A(() => g.snapshot.can_edit && !L(g.snapshot)), k = A(() => fe(l.value)), y = A(() => l.value.workflow.filter((r) => r.enabled).length);
    function C() {
      d("save", { title: s.value, description: V.value, config: structuredClone(G(l.value)), expected_revision: D.value });
    }
    return (r, m) => (n(), o("main", bn, [
      e("div", yn, [
        e("div", pn, [
          t.back ? (n(), o(p, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: m[0] || (m[0] = (u) => d("back"))
            }, [
              $(f(T), { icon: "tabler:arrow-left" })
            ]),
            e("span", kn, a(t.snapshot.title), 1)
          ], 64)) : b("", !0),
          e("nav", fn, [
            (n(!0), o(p, null, w(F.value, (u) => (n(), o("button", {
              id: `tab-${u}`,
              key: u,
              role: "tab",
              "aria-selected": v.value === u,
              "aria-controls": `panel-${u}`,
              onClick: (E) => v.value = u
            }, a(u), 9, gn))), 128))
          ])
        ]),
        e("div", $n, [
          e("span", hn, [
            c(a(t.snapshot.field_count) + " " + a(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (n(), o(p, { key: 0 }, [
              c(" · " + a(y.value) + " steps · revision " + a(t.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(p, { key: 1 }, [
              c(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (n(), o(p, { key: 0 }, [
            S.value ? (n(), o("span", xn, "Unsaved")) : b("", !0),
            $(f(P), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !S.value || !!k.value || !s.value.trim(),
              onClick: C
            }, null, 8, ["loading", "disabled"])
          ], 64)) : b("", !0)
        ])
      ]),
      t.error ? (n(), o("p", Vn, a(t.error), 1)) : b("", !0),
      k.value && t.snapshot.can_edit ? (n(), o("p", wn, a(k.value), 1)) : b("", !0),
      v.value === "Builder" && t.snapshot.can_edit ? (n(), o("div", Cn, [
        $(vt, {
          title: s.value,
          "onUpdate:title": m[1] || (m[1] = (u) => s.value = u),
          description: V.value,
          "onUpdate:description": m[2] || (m[2] = (u) => V.value = u),
          config: l.value,
          retention: t.snapshot.retention,
          result: M.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
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
          v.value === "Test" ? (n(), O(Tt, {
            key: 0,
            result: M.value.result,
            retention: t.snapshot.retention
          }, null, 8, ["result", "retention"])) : b("", !0),
          v.value === "Evals" && t.snapshot.can_edit ? (n(), O(nn, {
            key: 1,
            cases: t.snapshot.cases,
            results: M.value.evals,
            proposals: M.value.proposals,
            fields: t.snapshot.config?.fields ?? [],
            saving: t.saving,
            onAddCase: m[3] || (m[3] = (u) => d("add-case", u)),
            onDeleteCase: m[4] || (m[4] = (u) => d("delete-case", u))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : b("", !0),
          v.value === "Runs" ? (n(), O(cn, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : b("", !0)
        ], 8, Un)
      ], 512))
    ]));
  }
}), qn = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Nn = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Rn = /* @__PURE__ */ R({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: h }) {
    const g = t, d = h, i = q(), v = q(""), l = q(!1);
    let s;
    async function V() {
      if (!g.id) {
        v.value = "No extractor selected.";
        return;
      }
      const S = g.id;
      try {
        const k = await Q.get(S);
        S === g.id && (i.value = k, v.value = "");
      } catch (k) {
        v.value = k instanceof Error ? k.message : String(k);
      }
    }
    J(() => g.id, () => {
      i.value = void 0, s?.(), V(), g.id && (s = de(`component.${g.id}`, () => V()));
    }, { immediate: !0 }), ae(() => s?.());
    async function F(S) {
      l.value = !0, v.value = "";
      try {
        await S(), await V();
      } catch (k) {
        v.value = k instanceof Error ? k.message : String(k);
      } finally {
        l.value = !1;
      }
    }
    const M = (S) => F(() => Q.update(g.id, S)), D = (S) => F(() => Q.addCase(g.id, S)), L = (S) => F(() => Q.deleteCase(g.id, S));
    return (S, k) => i.value ? (n(), O(Sn, {
      key: 0,
      snapshot: i.value,
      saving: l.value,
      error: v.value,
      back: t.back,
      onBack: k[0] || (k[0] = (y) => d("back")),
      onSave: M,
      onAddCase: D,
      onDeleteCase: L
    }, null, 8, ["snapshot", "saving", "error", "back"])) : v.value ? (n(), o("p", qn, a(v.value), 1)) : (n(), o("p", Nn, "Loading Docscout…"));
  }
});
export {
  Rn as _
};
