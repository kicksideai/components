import { defineComponent as z, useModel as ie, openBlock as n, createElementBlock as s, withModifiers as Y, createElementVNode as e, mergeModels as Ce, computed as P, watch as G, createTextVNode as m, withDirectives as U, vModelText as F, Fragment as x, renderList as N, toDisplayString as a, vModelSelect as H, createVNode as h, unref as y, createCommentVNode as b, ref as S, onMounted as de, onBeforeUnmount as Ue, normalizeClass as W, createBlock as I, vShow as pe, withKeys as Ae, normalizeStyle as Le, toRaw as ke } from "vue";
import { loadByTagName as Se, on as ze } from "@wippy-fe/proxy";
import { g as qe, t as ge, h as Ie, i as We, j as je, k as Je, l as he, b as Q, o as $e, p as Ke, m as oe, q as Qe, r as xe, v as we, w as He, s as j, f as Xe, e as Ye, n as Ve, x as Ge, y as Ze, c as Z } from "./index-CmKPKov9.js";
import { Icon as D } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const _e = ["aria-checked", "aria-label", "disabled"], L = /* @__PURE__ */ z({
  __name: "Toggle",
  props: /* @__PURE__ */ Ce({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(l) {
    const w = ie(l, "modelValue");
    return (p, r) => (n(), s("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": w.value,
      "aria-label": l.label,
      disabled: l.disabled,
      onClick: r[0] || (r[0] = Y((d) => w.value = !w.value, ["stop"]))
    }, [...r[1] || (r[1] = [
      e("span", null, null, -1)
    ])], 8, _e));
  }
}), el = ["disabled"], ll = { class: "grid" }, tl = ["aria-invalid"], nl = ["value"], sl = {
  key: 0,
  class: "field-error",
  role: "alert"
}, ol = { key: 1 }, al = ["value"], il = { key: 2 }, dl = ["value"], ul = { class: "grid" }, rl = {
  key: 3,
  class: "field-note"
}, cl = { key: 4 }, vl = ["placeholder"], ml = { class: "toggle-row" }, bl = { class: "toggle-row" }, yl = /* @__PURE__ */ z({
  __name: "FieldInspector",
  props: {
    field: {},
    otherNames: {},
    deepEnabled: { type: Boolean },
    readonly: { type: Boolean }
  },
  emits: ["remove"],
  setup(l, { emit: w }) {
    const p = l, r = w, d = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], f = d.filter((E) => ["text", "number", "boolean", "date", "object"].includes(E.value)), t = P(() => qe(p.field, p.otherNames)), o = P(() => p.field.type !== "boolean" && p.field.type !== "enum" && !(p.field.type === "list" && p.field.item_type === "boolean"));
    G(() => p.field.type, () => {
      !ge(p.field) && p.field.enum_values.length && (p.field.enum_values = []);
    });
    function V(E) {
      p.field.enum_values = [...new Set(E.target.value.split(`
`).map((c) => c.trim()).filter(Boolean))];
    }
    return (E, c) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("div", ll, [
        e("label", null, [
          c[12] || (c[12] = m("Name", -1)),
          U(e("input", {
            "onUpdate:modelValue": c[0] || (c[0] = ($) => l.field.name = $),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!t.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, tl), [
            [
              F,
              l.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          c[13] || (c[13] = m("Type", -1)),
          U(e("select", {
            "onUpdate:modelValue": c[1] || (c[1] = ($) => l.field.type = $),
            "aria-label": "Field type"
          }, [
            (n(), s(x, null, N(d, ($) => e("option", {
              key: $.value,
              value: $.value
            }, a($.label), 9, nl)), 64))
          ], 512), [
            [H, l.field.type]
          ])
        ])
      ]),
      t.value ? (n(), s("p", sl, [
        h(y(D), { icon: "tabler:alert-circle" }),
        m(a(t.value), 1)
      ])) : b("", !0),
      l.field.type === "list" ? (n(), s("label", ol, [
        c[14] || (c[14] = m("Each item is", -1)),
        U(e("select", {
          "onUpdate:modelValue": c[2] || (c[2] = ($) => l.field.item_type = $)
        }, [
          (n(!0), s(x, null, N(y(f), ($) => (n(), s("option", {
            key: $.value,
            value: $.value
          }, a($.label), 9, al))), 128))
        ], 512), [
          [H, l.field.item_type]
        ])
      ])) : b("", !0),
      y(ge)(l.field) ? (n(), s("label", il, [
        m(a(l.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: l.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: V
        }, null, 40, dl),
        e("small", null, a(l.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : b("", !0),
      e("label", null, [
        c[15] || (c[15] = m("Description", -1)),
        U(e("textarea", {
          "onUpdate:modelValue": c[3] || (c[3] = ($) => l.field.description = $),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [F, l.field.description]
        ]),
        c[16] || (c[16] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      c[28] || (c[28] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        c[17] || (c[17] = m("Search hints", -1)),
        U(e("textarea", {
          "onUpdate:modelValue": c[4] || (c[4] = ($) => l.field.search_hints = $),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [F, l.field.search_hints]
        ]),
        c[18] || (c[18] = e("small", null, "Each line becomes a query in Prefetch and Scout.", -1))
      ]),
      e("div", ul, [
        e("label", null, [
          c[20] || (c[20] = m("Strategy", -1)),
          U(e("select", {
            "onUpdate:modelValue": c[5] || (c[5] = ($) => l.field.strategy = $)
          }, [...c[19] || (c[19] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [H, l.field.strategy]
          ])
        ]),
        e("label", null, [
          c[21] || (c[21] = m("Chunks to read", -1)),
          U(e("input", {
            "onUpdate:modelValue": c[6] || (c[6] = ($) => l.field.chunks = $),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              F,
              l.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          c[22] || (c[22] = e("small", null, "Per search hint", -1))
        ])
      ]),
      l.field.strategy === "deep" && !l.deepEnabled ? (n(), s("p", rl, [
        h(y(D), { icon: "tabler:info-circle" }),
        c[23] || (c[23] = m("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : b("", !0),
      c[29] || (c[29] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        c[24] || (c[24] = m("Validation hints", -1)),
        U(e("textarea", {
          "onUpdate:modelValue": c[7] || (c[7] = ($) => l.field.validation_hints = $),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [F, l.field.validation_hints]
        ])
      ]),
      o.value ? (n(), s("label", cl, [
        c[25] || (c[25] = m("Expected format", -1)),
        U(e("input", {
          "onUpdate:modelValue": c[8] || (c[8] = ($) => l.field.expected_format = $),
          placeholder: y(Ie)(l.field)
        }, null, 8, vl), [
          [F, l.field.expected_format]
        ])
      ])) : b("", !0),
      e("div", ml, [
        c[26] || (c[26] = e("span", null, [
          m("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        h(L, {
          modelValue: l.field.required,
          "onUpdate:modelValue": c[9] || (c[9] = ($) => l.field.required = $),
          label: "Required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", bl, [
        c[27] || (c[27] = e("span", null, [
          m("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        h(L, {
          modelValue: l.field.evidence_required,
          "onUpdate:modelValue": c[10] || (c[10] = ($) => l.field.evidence_required = $),
          label: "Evidence required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.readonly ? b("", !0) : (n(), s("button", {
        key: 5,
        type: "button",
        class: "btn danger-text",
        onClick: c[11] || (c[11] = ($) => r("remove"))
      }, "Remove field"))
    ], 8, el));
  }
}), fl = ["value", "capability", "aria-labelledby"], pl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, kl = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, ee = /* @__PURE__ */ z({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(l, { emit: w }) {
    const p = w, r = S(!!customElements.get("wc-model-picker")), d = S("");
    de(async () => {
      if (!r.value)
        try {
          await Se("wc-model-picker", { timeoutMs: 8e3 }), r.value = !0;
        } catch (t) {
          d.value = t instanceof Error ? t.message : String(t);
        }
    });
    function f(t) {
      const o = t.detail;
      typeof o == "string" && p("select", o);
    }
    return (t, o) => r.value ? (n(), s("wc-model-picker", {
      key: 0,
      value: l.value,
      capability: l.capability,
      "aria-labelledby": l.labelledBy,
      onSelect: f
    }, null, 40, fl)) : d.value ? (n(), s("p", pl, "Could not load model picker: " + a(d.value), 1)) : (n(), s("span", kl, "Loading models…"));
  }
}), gl = ["disabled"], hl = { class: "muted" }, $l = {
  key: 0,
  class: "toggle-row"
}, xl = { class: "label-block" }, wl = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "scope-label"
}, Vl = ["aria-checked", "onClick"], Cl = ["id"], Ul = { key: 2 }, Sl = { class: "grid" }, ql = ["onUpdate:modelValue"], Nl = ["onUpdate:modelValue"], El = ["onUpdate:modelValue"], Fl = ["onClick"], Ml = {
  key: 0,
  class: "muted"
}, Rl = { class: "grid" }, Tl = ["value"], Dl = { class: "grid" }, Bl = { class: "toggle-row" }, Pl = { class: "toggle-row" }, Ol = { class: "mono" }, Al = { id: "model-deep-query" }, Ll = { class: "grid" }, zl = { class: "grid" }, Il = { class: "grid" }, Wl = { class: "toggle-row" }, jl = {
  key: 7,
  class: "toggle-row"
}, Jl = /* @__PURE__ */ z({
  __name: "StepInspector",
  props: {
    step: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(l) {
    const w = l, p = [{ value: "outline", label: "Outline" }, { value: "section", label: "Section" }, { value: "chunk", label: "Chunk" }], r = We();
    function d(f, t) {
      const o = w.config.tools.filter((V) => V !== f);
      w.config.tools = t ? [...o, f] : o;
    }
    return (f, t) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", hl, a(y(je)[l.step.kind]), 1),
      l.step.kind !== "extract" ? (n(), s("div", $l, [
        t[21] || (t[21] = e("span", null, "Step enabled", -1)),
        h(L, {
          modelValue: l.step.enabled,
          "onUpdate:modelValue": t[0] || (t[0] = (o) => l.step.enabled = o),
          label: "Enable step",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0),
      e("div", xl, [
        t[22] || (t[22] = e("span", { id: "scope-label" }, "Reads at", -1)),
        e("div", wl, [
          (n(), s(x, null, N(p, (o) => e("button", {
            key: o.value,
            type: "button",
            role: "radio",
            "aria-checked": l.step.scope === o.value,
            onClick: (V) => l.step.scope = o.value
          }, a(o.label), 9, Vl)), 64))
        ]),
        t[23] || (t[23] = e("small", null, "Layer of the document this step works on: outline, then section, then chunk.", -1))
      ]),
      l.step.model !== void 0 ? (n(), s("label", {
        key: 1,
        id: `model-${l.step.kind}`
      }, [
        m(a(l.step.kind === "deep" ? "Analysis model" : "Model"), 1),
        h(ee, {
          value: l.step.model,
          capability: "generate",
          "labelled-by": `model-${l.step.kind}`,
          onSelect: t[1] || (t[1] = (o) => l.step.model = o)
        }, null, 8, ["value", "labelled-by"])
      ], 8, Cl)) : b("", !0),
      l.step.kind === "map" ? (n(), s("label", Ul, [
        t[25] || (t[25] = m("Outline", -1)),
        U(e("select", {
          "onUpdate:modelValue": t[2] || (t[2] = (o) => l.step.options.outline_mode = o)
        }, [...t[24] || (t[24] = [
          e("option", { value: "find_or_build" }, "Use the table of contents, or build an outline", -1),
          e("option", { value: "build" }, "Always build an outline", -1)
        ])], 512), [
          [H, l.step.options.outline_mode]
        ])
      ])) : b("", !0),
      l.step.kind === "prefetch" ? (n(), s(x, { key: 3 }, [
        t[29] || (t[29] = e("h4", null, "Queries", -1)),
        (n(!0), s(x, null, N(l.step.options.queries, (o, V) => (n(), s("div", {
          key: V,
          class: "query-row"
        }, [
          e("div", Sl, [
            e("label", null, [
              t[26] || (t[26] = m("Name", -1)),
              U(e("input", {
                "onUpdate:modelValue": (E) => o.name = E,
                placeholder: "Parties"
              }, null, 8, ql), [
                [F, o.name]
              ])
            ]),
            e("label", null, [
              t[27] || (t[27] = m("Chunks", -1)),
              U(e("input", {
                "onUpdate:modelValue": (E) => o.chunks = E,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, Nl), [
                [
                  F,
                  o.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            t[28] || (t[28] = m("Query", -1)),
            U(e("textarea", {
              "onUpdate:modelValue": (E) => o.query = E,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, El), [
              [F, o.query]
            ])
          ]),
          l.readonly ? b("", !0) : (n(), s("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (E) => l.step.options.queries.splice(V, 1)
          }, "Remove query", 8, Fl))
        ]))), 128)),
        l.step.options.queries.length ? b("", !0) : (n(), s("p", Ml, "No queries. Field search hints still run.")),
        l.readonly ? b("", !0) : (n(), s("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: t[3] || (t[3] = (o) => l.step.options.queries.push(y(Je)()))
        }, "Add query"))
      ], 64)) : b("", !0),
      l.step.kind === "scout" ? (n(), s(x, { key: 4 }, [
        e("div", Rl, [
          e("label", null, [
            t[30] || (t[30] = m("Rounds", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[4] || (t[4] = (o) => l.step.options.max_iterations = o),
              type: "number",
              min: "0",
              max: "30"
            }, null, 512), [
              [
                F,
                l.step.options.max_iterations,
                void 0,
                { number: !0 }
              ]
            ]),
            t[31] || (t[31] = e("small", null, "0 runs a single pass.", -1))
          ]),
          e("label", null, [
            t[32] || (t[32] = m("Stop at confidence", -1)),
            e("input", {
              value: Math.round(l.step.options.target_confidence * 100),
              type: "number",
              min: "0",
              max: "100",
              onInput: t[5] || (t[5] = (o) => l.step.options.target_confidence = Number(o.target.value) / 100)
            }, null, 40, Tl),
            t[33] || (t[33] = e("small", null, "Percent", -1))
          ])
        ]),
        e("div", Dl, [
          e("label", null, [
            t[34] || (t[34] = m("Extra queries per round", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[6] || (t[6] = (o) => l.step.options.max_extra_queries = o),
              type: "number",
              min: "0",
              max: "20"
            }, null, 512), [
              [
                F,
                l.step.options.max_extra_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            t[35] || (t[35] = m("Max tokens", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[7] || (t[7] = (o) => l.step.options.max_tokens = o),
              type: "number",
              min: "256",
              max: "64000"
            }, null, 512), [
              [
                F,
                l.step.options.max_tokens,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", Bl, [
          t[36] || (t[36] = e("span", null, "Drop noisy chunks", -1)),
          h(L, {
            modelValue: l.step.options.drop_noise,
            "onUpdate:modelValue": t[8] || (t[8] = (o) => l.step.options.drop_noise = o),
            label: "Drop noisy chunks",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Pl, [
          t[37] || (t[37] = e("span", null, "Share scout notes with extraction", -1)),
          h(L, {
            modelValue: l.config.shared_context,
            "onUpdate:modelValue": t[9] || (t[9] = (o) => l.config.shared_context = o),
            label: "Share scout notes with extraction",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t[38] || (t[38] = e("h4", null, "Agent tools", -1)),
        (n(!0), s(x, null, N(y(r), (o) => (n(), s("div", {
          key: o,
          class: "toggle-row"
        }, [
          e("span", null, [
            m(a(y(he)(o)), 1),
            e("small", Ol, a(o), 1)
          ]),
          h(L, {
            "model-value": l.config.tools.includes(o),
            label: y(he)(o),
            disabled: l.readonly,
            "onUpdate:modelValue": (V) => d(o, V)
          }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
        ]))), 128))
      ], 64)) : b("", !0),
      l.step.kind === "deep" ? (n(), s(x, { key: 5 }, [
        e("label", Al, [
          t[39] || (t[39] = m("Query model", -1)),
          h(ee, {
            value: l.step.options.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: t[10] || (t[10] = (o) => l.step.options.query_model = o)
          }, null, 8, ["value"])
        ]),
        e("div", Ll, [
          e("label", null, [
            t[40] || (t[40] = m("Fields at a time", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[11] || (t[11] = (o) => l.step.options.parallel_fields = o),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                F,
                l.step.options.parallel_fields,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            t[41] || (t[41] = m("Queries per field", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[12] || (t[12] = (o) => l.step.options.max_queries = o),
              type: "number",
              min: "1",
              max: "20"
            }, null, 512), [
              [
                F,
                l.step.options.max_queries,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", zl, [
          e("label", null, [
            t[42] || (t[42] = m("Chunks per query", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[13] || (t[13] = (o) => l.step.options.chunks_per_query = o),
              type: "number",
              min: "1",
              max: "500"
            }, null, 512), [
              [
                F,
                l.step.options.chunks_per_query,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            t[43] || (t[43] = m("Chunk cap", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[14] || (t[14] = (o) => l.step.options.chunk_cap = o),
              type: "number",
              min: "1",
              max: "1000"
            }, null, 512), [
              [
                F,
                l.step.options.chunk_cap,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("div", Il, [
          e("label", null, [
            t[44] || (t[44] = m("Minimum similarity", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[15] || (t[15] = (o) => l.step.options.min_similarity = o),
              type: "number",
              min: "0",
              max: "1",
              step: "0.05"
            }, null, 512), [
              [
                F,
                l.step.options.min_similarity,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          e("label", null, [
            t[45] || (t[45] = m("Query temperature", -1)),
            U(e("input", {
              "onUpdate:modelValue": t[16] || (t[16] = (o) => l.step.options.query_temperature = o),
              type: "number",
              min: "0",
              max: "2",
              step: "0.1"
            }, null, 512), [
              [
                F,
                l.step.options.query_temperature,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("label", null, [
          t[46] || (t[46] = m("Analysis temperature", -1)),
          U(e("input", {
            "onUpdate:modelValue": t[17] || (t[17] = (o) => l.step.options.analysis_temperature = o),
            type: "number",
            min: "0",
            max: "2",
            step: "0.1"
          }, null, 512), [
            [
              F,
              l.step.options.analysis_temperature,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ], 64)) : b("", !0),
      l.step.kind === "extract" ? (n(), s(x, { key: 6 }, [
        e("label", null, [
          t[47] || (t[47] = m("Max output tokens", -1)),
          U(e("input", {
            "onUpdate:modelValue": t[18] || (t[18] = (o) => l.step.options.max_output_tokens = o),
            type: "number",
            min: "256",
            max: "64000"
          }, null, 512), [
            [
              F,
              l.step.options.max_output_tokens,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        e("div", Wl, [
          t[48] || (t[48] = e("span", null, "Structured output", -1)),
          h(L, {
            modelValue: l.step.options.structured_output,
            "onUpdate:modelValue": t[19] || (t[19] = (o) => l.step.options.structured_output = o),
            label: "Structured output",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : b("", !0),
      l.step.kind === "verify" ? (n(), s("div", jl, [
        t[49] || (t[49] = e("span", null, "Check every value", -1)),
        h(L, {
          modelValue: l.step.options.require_all_values,
          "onUpdate:modelValue": t[20] || (t[20] = (o) => l.step.options.require_all_values = o),
          label: "Check every value",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0)
    ], 8, gl));
  }
}), Kl = ["disabled"], Ql = { class: "muted" }, Hl = { class: "grid" }, Xl = { class: "toggle-row" }, Yl = { class: "label-block" }, Gl = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, Zl = ["aria-checked", "onClick"], _l = { id: "embedding-model" }, et = { class: "toggle-row" }, lt = { class: "toggle-row" }, tt = {
  key: 0,
  id: "highlighter-model"
}, nt = /* @__PURE__ */ z({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(l) {
    const w = [{ value: "keyword", label: "Keyword" }, { value: "semantic", label: "Semantic" }, { value: "hybrid", label: "Hybrid" }];
    return (p, r) => (n(), s("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", Ql, "The upload's text is split into chunks and indexed for this run. Processed copies expire after " + a(l.retention) + ".", 1),
      r[19] || (r[19] = e("h4", null, "Chunks", -1)),
      e("div", Hl, [
        e("label", null, [
          r[8] || (r[8] = m("Chunk size", -1)),
          U(e("input", {
            "onUpdate:modelValue": r[0] || (r[0] = (d) => l.config.retrieval.chunk_size = d),
            type: "number",
            min: "100",
            max: "16000"
          }, null, 512), [
            [
              F,
              l.config.retrieval.chunk_size,
              void 0,
              { number: !0 }
            ]
          ]),
          r[9] || (r[9] = e("small", null, "Tokens", -1))
        ]),
        e("label", null, [
          r[10] || (r[10] = m("Overlap", -1)),
          U(e("input", {
            "onUpdate:modelValue": r[1] || (r[1] = (d) => l.config.retrieval.overlap = d),
            type: "number",
            min: "0",
            max: "4000"
          }, null, 512), [
            [
              F,
              l.config.retrieval.overlap,
              void 0,
              { number: !0 }
            ]
          ]),
          r[11] || (r[11] = e("small", null, "Tokens", -1))
        ])
      ]),
      e("div", Xl, [
        r[12] || (r[12] = e("span", null, "Split by headings", -1)),
        h(L, {
          modelValue: l.config.retrieval.split_headings,
          "onUpdate:modelValue": r[2] || (r[2] = (d) => l.config.retrieval.split_headings = d),
          label: "Split by headings",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r[20] || (r[20] = e("h4", null, "Search", -1)),
      e("div", Yl, [
        r[13] || (r[13] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", Gl, [
          (n(), s(x, null, N(w, (d) => e("button", {
            key: d.value,
            type: "button",
            role: "radio",
            "aria-checked": l.config.retrieval.search_mode === d.value,
            onClick: (f) => l.config.retrieval.search_mode = d.value
          }, a(d.label), 9, Zl)), 64))
        ])
      ]),
      e("label", null, [
        r[14] || (r[14] = m("Results per query", -1)),
        U(e("input", {
          "onUpdate:modelValue": r[3] || (r[3] = (d) => l.config.retrieval.top_results = d),
          type: "number",
          min: "1",
          max: "100"
        }, null, 512), [
          [
            F,
            l.config.retrieval.top_results,
            void 0,
            { number: !0 }
          ]
        ])
      ]),
      e("label", _l, [
        r[15] || (r[15] = m("Embedding model", -1)),
        h(ee, {
          value: l.config.retrieval.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: r[4] || (r[4] = (d) => l.config.retrieval.embedding_model = d)
        }, null, 8, ["value"])
      ]),
      e("div", et, [
        r[16] || (r[16] = e("span", null, [
          m("Contextual embeddings"),
          e("small", null, "Prepend section context to each chunk before embedding.")
        ], -1)),
        h(L, {
          modelValue: l.config.retrieval.contextual_embeddings,
          "onUpdate:modelValue": r[5] || (r[5] = (d) => l.config.retrieval.contextual_embeddings = d),
          label: "Contextual embeddings",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r[21] || (r[21] = e("h4", null, "Highlighter", -1)),
      e("div", lt, [
        r[17] || (r[17] = e("span", null, [
          m("Mark relevant spans"),
          e("small", null, "A small model highlights what each field needs before extraction.")
        ], -1)),
        h(L, {
          modelValue: l.config.retrieval.highlighter,
          "onUpdate:modelValue": r[6] || (r[6] = (d) => l.config.retrieval.highlighter = d),
          label: "Highlighter",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.config.retrieval.highlighter ? (n(), s("label", tt, [
        r[18] || (r[18] = m("Highlighter model", -1)),
        h(ee, {
          value: l.config.retrieval.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: r[7] || (r[7] = (d) => l.config.retrieval.highlighter_model = d)
        }, null, 8, ["value"])
      ])) : b("", !0)
    ], 8, Kl));
  }
}), st = { class: "canvas" }, ot = { class: "canvas-inner" }, at = {
  class: "block",
  "aria-labelledby": "fields-head"
}, it = { class: "block-head" }, dt = ["aria-expanded"], ut = { class: "count" }, rt = {
  key: 0,
  class: "block-peek"
}, ct = {
  id: "fields-body",
  class: "block-body"
}, vt = {
  key: 0,
  class: "block-empty"
}, mt = {
  key: 1,
  class: "rows"
}, bt = ["onClick"], yt = { class: "row-name" }, ft = {
  key: 0,
  class: "req",
  title: "Required"
}, pt = { class: "chips" }, kt = ["title"], gt = { class: "chip" }, ht = {
  key: 1,
  class: "chip",
  title: "Evidence required"
}, $t = {
  key: 0,
  class: "row-actions"
}, xt = ["disabled", "onClick"], wt = ["disabled", "onClick"], Vt = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ct = { class: "block-head" }, Ut = ["aria-expanded"], St = { class: "count" }, qt = {
  key: 0,
  class: "block-peek"
}, Nt = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Et = { class: "node-icon" }, Ft = { class: "node-main" }, Mt = { class: "node-summary" }, Rt = {
  key: 0,
  class: "chips"
}, Tt = { class: "chip" }, Dt = { class: "node-side" }, Bt = { class: "chip model" }, Pt = ["onClick", "onKeydown"], Ot = { class: "node-icon" }, At = { class: "node-main" }, Lt = { class: "node-title" }, zt = { class: "scope" }, It = { class: "node-summary" }, Wt = {
  key: 0,
  class: "chips"
}, jt = {
  key: 1,
  class: "chips"
}, Jt = {
  key: 2,
  class: "chips"
}, Kt = {
  key: 3,
  class: "trace-line"
}, Qt = { class: "node-side" }, Ht = {
  key: 0,
  class: "chip model"
}, Xt = {
  key: 1,
  class: "node-actions"
}, Yt = ["aria-label", "onClick"], Gt = ["aria-label", "onClick"], Zt = { class: "node-icon" }, _t = { class: "node-main" }, en = { class: "node-summary" }, ln = ["aria-valuenow"], tn = { class: "panel-head" }, nn = { class: "panel-icon" }, sn = { class: "panel-body" }, on = ["disabled"], an = {
  key: 4,
  class: "inspector-form"
}, dn = { class: "output-list" }, un = { class: "mono" }, rn = { class: "chip" }, cn = { class: "rail-label" }, ae = 400, _ = 320, vn = /* @__PURE__ */ z({
  __name: "Builder",
  props: /* @__PURE__ */ Ce({
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
    const w = l, p = ie(l, "title"), r = ie(l, "description"), d = S({ kind: "document" });
    function f(i, u) {
      try {
        const v = localStorage.getItem(`docscout.${i}`);
        return v === null ? u : v === "1";
      } catch {
        return u;
      }
    }
    function t(i, u) {
      try {
        localStorage.setItem(`docscout.${i}`, u ? "1" : "0");
      } catch {
      }
    }
    const o = S(f("panel", !0)), V = S(f("fields", !0)), E = S(f("flow", !0));
    function c() {
      try {
        const i = Number(localStorage.getItem("docscout.panelWidth"));
        return i >= _ ? i : ae;
      } catch {
        return ae;
      }
    }
    const $ = S(c()), J = () => {
      const i = B.value?.clientWidth;
      return i ? Math.max(_, i - 420) : Number.POSITIVE_INFINITY;
    };
    function q(i, u = !0) {
      if ($.value = Math.round(Math.min(J(), Math.max(_, i))), u)
        try {
          localStorage.setItem("docscout.panelWidth", String($.value));
        } catch {
        }
    }
    const g = S(!1);
    function k(i) {
      const u = i.currentTarget, v = i.clientX, T = $.value;
      u.setPointerCapture(i.pointerId), g.value = !0;
      const R = (Oe) => q(T + (v - Oe.clientX), !1), fe = () => {
        g.value = !1, q($.value), u.removeEventListener("pointermove", R), u.removeEventListener("pointerup", fe);
      };
      u.addEventListener("pointermove", R), u.addEventListener("pointerup", fe);
    }
    function M(i) {
      i.key === "ArrowLeft" ? (q($.value + 24), i.preventDefault()) : i.key === "ArrowRight" && (q($.value - 24), i.preventDefault());
    }
    function C(i) {
      o.value = i, A.value || t("panel", i);
    }
    function O(i) {
      const u = i === "fields" ? V : E;
      u.value = !u.value, t(i, u.value);
    }
    const B = S(), A = S(!1);
    let le;
    de(() => {
      le = new ResizeObserver(([i]) => {
        const u = A.value;
        A.value = i.contentRect.width < 1e3, A.value && !u && (o.value = !1), !A.value && u && (o.value = f("panel", !0));
      }), B.value && le.observe(B.value);
    }), Ue(() => le?.disconnect());
    function K(i) {
      d.value = i, o.value = !0;
    }
    const X = (i) => i.kind === "step" ? d.value.kind === "step" && d.value.step === i.step : JSON.stringify(i) === JSON.stringify(d.value), te = P(() => d.value.kind === "field" ? w.config.fields[d.value.index] : void 0), ue = P(() => {
      const i = d.value;
      return i.kind === "step" ? Q[i.step.kind] : i.kind === "field" ? te.value?.name || "New field" : i.kind === "document" ? "Read document" : i.kind === "output" ? "Output" : "Details";
    }), Ee = P(() => {
      const i = d.value;
      return i.kind === "step" ? $e[i.step.kind] : i.kind === "field" ? "tabler:forms" : i.kind === "document" ? "tabler:file-text" : i.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Fe = P(() => w.config.fields.filter((i, u) => !(d.value.kind === "field" && d.value.index === u)).map((i) => i.name)), ne = P(() => !!w.config.workflow.find((i) => i.kind === "deep")?.enabled), re = (i) => qe(w.config.fields[i], w.config.fields.filter((u, v) => v !== i).map((u) => u.name)), ce = P(() => w.config.fields.filter((i) => i.strategy === "deep")), ve = P(() => w.config.fields.filter((i) => i.search_hints.trim())), Me = P(() => w.config.workflow.filter((i) => i.enabled).map((i) => Q[i.kind]).join(" → ")), Re = P(() => w.config.fields.map((i) => i.name || "New field").join(", ")), Te = P(() => w.config.workflow.filter((i) => i.enabled).length), se = (i) => w.result?.trace.find((u) => u.kind === i), De = (i) => [`${(i.duration_ms / 1e3).toFixed(1)}s`, `${(i.input_tokens + i.output_tokens).toLocaleString()} tokens`, i.queries?.length ? `${i.queries.length} queries` : "", i.message ?? ""].filter(Boolean).join(" · ");
    function Be() {
      w.config.fields.push(He()), V.value = !0, K({ kind: "field", index: w.config.fields.length - 1 });
    }
    function Pe(i) {
      w.config.fields.splice(i, 1), d.value = { kind: "document" };
    }
    function me(i, u) {
      const v = w.config.fields, T = i + u;
      if (T < 0 || T >= v.length) return;
      const [R] = v.splice(i, 1);
      v.splice(T, 0, R), d.value = { kind: "field", index: T };
    }
    const be = (i) => i.type === "list" ? `list of ${i.item_type}` : i.type, ye = P({ get: () => w.config.tags.join(", "), set: (i) => {
      w.config.tags = [...new Set(i.split(",").map((u) => u.trim()).filter(Boolean))];
    } });
    return (i, u) => (n(), s("div", {
      ref_key: "root",
      ref: B,
      class: W(["builder", { narrow: A.value, "panel-open": o.value, resizing: g.value }])
    }, [
      e("div", st, [
        e("div", ot, [
          e("section", at, [
            e("header", it, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": V.value,
                "aria-controls": "fields-body",
                onClick: u[0] || (u[0] = (v) => O("fields"))
              }, [
                h(y(D), {
                  icon: V.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                u[13] || (u[13] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", ut, a(l.config.fields.length), 1)
              ], 8, dt),
              !V.value && l.config.fields.length ? (n(), s("span", rt, a(Re.value), 1)) : b("", !0),
              l.readonly ? b("", !0) : (n(), s("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: Be
              }, [
                h(y(D), { icon: "tabler:plus" }),
                u[14] || (u[14] = m("Add field", -1))
              ]))
            ]),
            U(e("div", ct, [
              l.config.fields.length ? (n(), s("ul", mt, [
                (n(!0), s(x, null, N(l.config.fields, (v, T) => (n(), s("li", {
                  key: T,
                  class: W(["row-item", { active: X({ kind: "field", index: T }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (R) => K({ kind: "field", index: T })
                  }, [
                    e("span", yt, [
                      m(a(v.name || "New field"), 1),
                      v.required ? (n(), s("span", ft, "*")) : b("", !0),
                      re(T) ? (n(), I(y(D), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: re(T)
                      }, null, 8, ["title"])) : b("", !0)
                    ]),
                    e("span", {
                      class: W(["row-desc", { missing: !v.description }])
                    }, a(v.description || "No description"), 3),
                    e("span", pt, [
                      v.strategy === "deep" ? (n(), s("span", {
                        key: 0,
                        class: W(["chip", ne.value ? "primary" : "muted-chip"]),
                        title: ne.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, kt)) : b("", !0),
                      e("span", gt, a(be(v)), 1),
                      v.evidence_required ? (n(), s("span", ht, [
                        h(y(D), { icon: "tabler:quote" })
                      ])) : b("", !0)
                    ])
                  ], 8, bt),
                  l.readonly ? b("", !0) : (n(), s("span", $t, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: T === 0,
                      onClick: (R) => me(T, -1)
                    }, [
                      h(y(D), { icon: "tabler:chevron-up" })
                    ], 8, xt),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: T === l.config.fields.length - 1,
                      onClick: (R) => me(T, 1)
                    }, [
                      h(y(D), { icon: "tabler:chevron-down" })
                    ], 8, wt)
                  ]))
                ], 2))), 128))
              ])) : (n(), s("p", vt, "Add the values to pull from each document."))
            ], 512), [
              [pe, V.value]
            ])
          ]),
          e("section", Vt, [
            e("header", Ct, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": E.value,
                "aria-controls": "flow-body",
                onClick: u[1] || (u[1] = (v) => O("flow"))
              }, [
                h(y(D), {
                  icon: E.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                u[15] || (u[15] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", St, a(Te.value) + " of " + a(l.config.workflow.length), 1)
              ], 8, Ut),
              E.value ? b("", !0) : (n(), s("span", qt, a(Me.value), 1)),
              e("button", {
                type: "button",
                class: W(["btn small subtle push", { on: X({ kind: "details" }) }]),
                onClick: u[2] || (u[2] = (v) => K({ kind: "details" }))
              }, [
                h(y(D), { icon: "tabler:info-circle" }),
                u[16] || (u[16] = m("Details", -1))
              ], 2)
            ]),
            U(e("div", Nt, [
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "document" }) }]),
                onClick: u[3] || (u[3] = (v) => K({ kind: "document" }))
              }, [
                e("span", Et, [
                  h(y(D), { icon: "tabler:file-text" })
                ]),
                e("span", Ft, [
                  u[17] || (u[17] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", Mt, a(y(Ke)(l.config.retrieval)), 1),
                  l.config.retrieval.highlighter ? (n(), s("span", Rt, [
                    e("span", Tt, "Highlighter · " + a(y(oe)(l.config.retrieval.highlighter_model)), 1)
                  ])) : b("", !0)
                ]),
                e("span", Dt, [
                  e("span", Bt, a(y(oe)(l.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              (n(!0), s(x, null, N(l.config.workflow, (v, T) => (n(), s(x, {
                key: v.kind
              }, [
                e("div", {
                  class: W(["connector", { off: !v.enabled }])
                }, null, 2),
                e("div", {
                  class: W(["node", { active: X({ kind: "step", step: v }), off: !v.enabled }]),
                  role: "button",
                  tabindex: "0",
                  onClick: (R) => K({ kind: "step", step: v }),
                  onKeydown: Ae((R) => K({ kind: "step", step: v }), ["enter"])
                }, [
                  e("span", Ot, [
                    h(y(D), {
                      icon: y($e)[v.kind]
                    }, null, 8, ["icon"])
                  ]),
                  e("span", At, [
                    e("span", Lt, [
                      m(a(y(Q)[v.kind]), 1),
                      e("span", zt, a(v.scope), 1)
                    ]),
                    e("span", It, a(v.enabled ? y(Qe)(v, l.config) : "Off"), 1),
                    v.enabled && v.kind === "deep" && ce.value.length ? (n(), s("span", Wt, [
                      (n(!0), s(x, null, N(ce.value, (R) => (n(), s("span", {
                        key: R.name,
                        class: "chip primary"
                      }, a(R.name || "New field"), 1))), 128))
                    ])) : b("", !0),
                    v.enabled && v.kind === "prefetch" && (v.options.queries.length || ve.value.length) ? (n(), s("span", jt, [
                      (n(!0), s(x, null, N(v.options.queries, (R) => (n(), s("span", {
                        key: "q" + R.name,
                        class: "chip"
                      }, a(R.name || "Untitled query"), 1))), 128)),
                      (n(!0), s(x, null, N(ve.value, (R) => (n(), s("span", {
                        key: "f" + R.name,
                        class: "chip muted-chip"
                      }, a(R.name), 1))), 128))
                    ])) : b("", !0),
                    v.enabled && v.kind === "scout" && l.config.tools.length ? (n(), s("span", Jt, [
                      (n(!0), s(x, null, N(l.config.tools, (R) => (n(), s("span", {
                        key: R,
                        class: "chip"
                      }, a(R.split(":").pop()?.replace(/_/g, " ")), 1))), 128))
                    ])) : b("", !0),
                    se(v.kind) ? (n(), s("span", Kt, [
                      h(y(D), {
                        icon: se(v.kind).status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
                      }, null, 8, ["icon"]),
                      m(a(De(se(v.kind))), 1)
                    ])) : b("", !0)
                  ]),
                  e("span", Qt, [
                    v.enabled && v.model ? (n(), s("span", Ht, a(y(oe)(v.model)), 1)) : b("", !0),
                    l.readonly ? b("", !0) : (n(), s("span", Xt, [
                      y(xe)(l.config, T, -1) ? (n(), s("button", {
                        key: 0,
                        type: "button",
                        class: "icon-btn",
                        "aria-label": `Move ${y(Q)[v.kind]} up`,
                        onClick: Y((R) => y(we)(l.config, T, -1), ["stop"])
                      }, [
                        h(y(D), { icon: "tabler:arrow-up" })
                      ], 8, Yt)) : b("", !0),
                      y(xe)(l.config, T, 1) ? (n(), s("button", {
                        key: 1,
                        type: "button",
                        class: "icon-btn",
                        "aria-label": `Move ${y(Q)[v.kind]} down`,
                        onClick: Y((R) => y(we)(l.config, T, 1), ["stop"])
                      }, [
                        h(y(D), { icon: "tabler:arrow-down" })
                      ], 8, Gt)) : b("", !0),
                      v.kind !== "extract" ? (n(), I(L, {
                        key: 2,
                        modelValue: v.enabled,
                        "onUpdate:modelValue": (R) => v.enabled = R,
                        label: `Enable ${y(Q)[v.kind]}`
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])) : b("", !0)
                    ]))
                  ])
                ], 42, Pt)
              ], 64))), 128)),
              u[19] || (u[19] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "output" }) }]),
                onClick: u[4] || (u[4] = (v) => K({ kind: "output" }))
              }, [
                e("span", Zt, [
                  h(y(D), { icon: "tabler:braces" })
                ]),
                e("span", _t, [
                  u[18] || (u[18] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", en, a(l.config.fields.length ? `${l.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [pe, E.value]
            ])
          ])
        ])
      ]),
      A.value && o.value ? (n(), s("div", {
        key: 0,
        class: "scrim",
        onClick: u[5] || (u[5] = (v) => C(!1))
      })) : b("", !0),
      o.value ? (n(), s("aside", {
        key: 1,
        class: "panel",
        "aria-label": "Settings panel",
        style: Le(A.value ? void 0 : { width: `${$.value}px` })
      }, [
        A.value ? b("", !0) : (n(), s("div", {
          key: 0,
          class: W(["resizer", { active: g.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": $.value,
          "aria-valuemin": _,
          onPointerdown: Y(k, ["prevent"]),
          onKeydown: M,
          onDblclick: u[6] || (u[6] = (v) => q(ae))
        }, null, 42, ln)),
        e("header", tn, [
          e("span", nn, [
            h(y(D), { icon: Ee.value }, null, 8, ["icon"])
          ]),
          e("h2", null, a(ue.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: u[7] || (u[7] = (v) => C(!1))
          }, [
            h(y(D), {
              icon: A.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", sn, [
          d.value.kind === "document" ? (n(), I(nt, {
            key: 0,
            config: l.config,
            retention: l.retention,
            readonly: l.readonly
          }, null, 8, ["config", "retention", "readonly"])) : d.value.kind === "step" ? (n(), I(Jl, {
            key: 1,
            step: d.value.step,
            config: l.config,
            readonly: l.readonly
          }, null, 8, ["step", "config", "readonly"])) : d.value.kind === "field" && te.value ? (n(), I(yl, {
            key: 2,
            field: te.value,
            "other-names": Fe.value,
            "deep-enabled": ne.value,
            readonly: l.readonly,
            onRemove: u[8] || (u[8] = (v) => Pe(d.value.index))
          }, null, 8, ["field", "other-names", "deep-enabled", "readonly"])) : d.value.kind === "details" ? (n(), s("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: l.readonly
          }, [
            e("label", null, [
              u[20] || (u[20] = m("Name", -1)),
              U(e("input", {
                "onUpdate:modelValue": u[9] || (u[9] = (v) => p.value = v),
                "aria-label": "Extractor name"
              }, null, 512), [
                [F, p.value]
              ])
            ]),
            e("label", null, [
              u[21] || (u[21] = m("Description", -1)),
              U(e("textarea", {
                "onUpdate:modelValue": u[10] || (u[10] = (v) => r.value = v),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [F, r.value]
              ])
            ]),
            e("label", null, [
              u[22] || (u[22] = m("Tags", -1)),
              U(e("input", {
                "onUpdate:modelValue": u[11] || (u[11] = (v) => ye.value = v),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  F,
                  ye.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              u[23] || (u[23] = e("small", null, "Comma separated", -1))
            ])
          ], 8, on)) : d.value.kind === "output" ? (n(), s("div", an, [
            u[24] || (u[24] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", dn, [
              (n(!0), s(x, null, N(l.config.fields, (v) => (n(), s("li", {
                key: v.name
              }, [
                e("span", un, a(v.name || "New field"), 1),
                e("span", rn, a(be(v)), 1)
              ]))), 128))
            ]),
            u[25] || (u[25] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : b("", !0)
        ])
      ], 4)) : A.value ? b("", !0) : (n(), s("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: u[12] || (u[12] = (v) => C(!0))
      }, [
        h(y(D), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", cn, a(ue.value), 1)
      ]))
    ], 2));
  }
}), mn = ["selected"], bn = {
  key: 1,
  role: "alert"
}, yn = {
  key: 2,
  class: "muted"
}, Ne = /* @__PURE__ */ z({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(l, { emit: w }) {
    const p = w, r = S(!1), d = S("");
    de(async () => {
      try {
        await Se("wc-multiselect", { timeoutMs: 8e3 }), r.value = !0;
      } catch (t) {
        d.value = String(t);
      }
    });
    function f(t) {
      const o = t.detail;
      p("select", o.selected[0] || "", o.labels?.[0] || "");
    }
    return (t, o) => r.value ? (n(), s("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(l.value ? [l.value] : []),
      placeholder: "Choose an upload",
      onChange: f
    }, null, 40, mn)) : d.value ? (n(), s("p", bn, a(d.value), 1)) : (n(), s("span", yn, "Loading uploads…"));
  }
}), fn = { class: "test-input" }, pn = { class: "row wrap" }, kn = { class: "grow" }, gn = { class: "retention" }, hn = { class: "section-head" }, $n = { class: "muted" }, xn = { class: "row" }, wn = { class: "confidence push" }, Vn = { class: "value" }, Cn = { class: "muted" }, Un = {
  key: 0,
  class: "muted"
}, Sn = { class: "trace" }, qn = { class: "row wrap" }, Nn = { class: "muted" }, En = { class: "push" }, Fn = { class: "muted" }, Mn = { key: 0 }, Rn = { key: 1 }, Tn = {
  key: 1,
  class: "empty"
}, Dn = /* @__PURE__ */ z({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(l) {
    const w = S(""), p = (d) => `${Math.round(d * 100)}%`, r = (d) => typeof d == "string" ? d : JSON.stringify(d);
    return (d, f) => (n(), s(x, null, [
      e("section", fn, [
        f[1] || (f[1] = e("h2", null, "Document", -1)),
        e("div", pn, [
          e("div", kn, [
            h(Ne, {
              value: w.value,
              onSelect: f[0] || (f[0] = (t) => w.value = t)
            }, null, 8, ["value"])
          ]),
          h(y(j), {
            label: "Run extraction",
            disabled: ""
          })
        ]),
        f[2] || (f[2] = e("p", { class: "muted" }, "Extraction is not available yet.", -1)),
        e("p", gn, "Processed documents and runs expire after " + a(l.retention) + ".", 1)
      ]),
      l.result ? (n(), s(x, { key: 0 }, [
        e("div", hn, [
          f[3] || (f[3] = e("h2", null, "Values", -1)),
          e("span", $n, a(l.result.tokens.toLocaleString()) + " tokens · " + a((l.result.duration_ms / 1e3).toFixed(1)) + "s", 1)
        ]),
        (n(!0), s(x, null, N(l.result.fields, (t) => (n(), s("article", {
          key: t.name,
          class: "field-card value-card"
        }, [
          e("header", xn, [
            e("h3", null, a(t.name), 1),
            e("span", wn, a(p(t.confidence)) + " confidence", 1)
          ]),
          e("p", Vn, a(r(t.value)), 1),
          e("p", Cn, a(t.verified ? "Verified" : "Unverified"), 1),
          (n(!0), s(x, null, N(t.evidence, (o, V) => (n(), s("blockquote", { key: V }, [
            e("p", null, "“" + a(o.quote) + "”", 1),
            e("cite", null, [
              m(a(o.section), 1),
              o.page !== void 0 ? (n(), s(x, { key: 0 }, [
                m(" · Page " + a(o.page), 1)
              ], 64)) : b("", !0)
            ])
          ]))), 128)),
          t.evidence.length ? b("", !0) : (n(), s("p", Un, "No evidence."))
        ]))), 128)),
        f[4] || (f[4] = e("h2", null, "Trace", -1)),
        e("ol", Sn, [
          (n(!0), s(x, null, N(l.result.trace, (t, o) => (n(), s("li", { key: o }, [
            e("div", qn, [
              e("strong", null, a(t.kind), 1),
              e("span", Nn, a(t.status), 1),
              e("span", En, a((t.duration_ms / 1e3).toFixed(1)) + "s", 1)
            ]),
            e("p", Fn, [
              m(a(t.scope), 1),
              t.model ? (n(), s(x, { key: 0 }, [
                m(" · " + a(t.model), 1)
              ], 64)) : b("", !0),
              m(" · " + a(t.input_tokens + t.output_tokens) + " tokens", 1),
              t.cost !== void 0 ? (n(), s(x, { key: 1 }, [
                m(" · $" + a(t.cost.toFixed(4)), 1)
              ], 64)) : b("", !0)
            ]),
            t.message ? (n(), s("p", Mn, a(t.message), 1)) : b("", !0),
            t.queries?.length ? (n(), s("ul", Rn, [
              (n(!0), s(x, null, N(t.queries, (V) => (n(), s("li", { key: V }, a(V), 1))), 128))
            ])) : b("", !0)
          ]))), 128))
        ])
      ], 64)) : (n(), s("p", Tn, "No extraction results yet."))
    ], 64));
  }
}), Bn = { class: "section-head" }, Pn = { class: "row wrap" }, On = { class: "grid" }, An = ["onUpdate:modelValue"], Ln = ["onUpdate:modelValue"], zn = {
  key: 0,
  class: "error",
  role: "alert"
}, In = { class: "row" }, Wn = {
  key: 1,
  class: "empty"
}, jn = { class: "row" }, Jn = { class: "values" }, Kn = {
  key: 0,
  class: "empty"
}, Qn = {
  key: 1,
  class: "grid comparison"
}, Hn = ["value", "onChange"], Xn = ["value"], Yn = { class: "muted" }, Gn = { class: "values" }, Zn = { class: "section-head" }, _n = {
  key: 0,
  class: "empty"
}, es = { class: "delta" }, ls = { class: "row" }, ts = /* @__PURE__ */ z({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(l, { emit: w }) {
    const p = l, r = w, d = S(!1), f = S(""), t = S(""), o = S({}), V = S("");
    G(() => p.cases, () => {
      d.value = !1, f.value = "", o.value = {};
    });
    function E() {
      V.value = "";
      const q = {};
      try {
        for (const g of p.fields) {
          const k = o.value[g.name] ?? "";
          q[g.name] = ["number", "boolean", "list", "object"].includes(g.type) ? k.trim() ? JSON.parse(k) : null : k;
        }
        r("add-case", { upload_id: f.value, upload_name: t.value, expected: q });
      } catch {
        V.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const c = S(), $ = S(), J = P(() => [p.results.find((q) => q.revision === (c.value ?? p.results[0]?.revision)), p.results.find((q) => q.revision === ($.value ?? p.results[1]?.revision))]);
    return (q, g) => (n(), s(x, null, [
      e("section", null, [
        e("div", Bn, [
          g[3] || (g[3] = e("h2", null, "Cases", -1)),
          e("div", Pn, [
            h(y(j), {
              label: "Add case",
              severity: "secondary",
              disabled: !l.fields.length,
              onClick: g[0] || (g[0] = (k) => d.value = !d.value)
            }, null, 8, ["disabled"]),
            h(y(j), {
              label: "Run all cases",
              disabled: ""
            })
          ])
        ]),
        d.value ? (n(), s("form", {
          key: 0,
          class: "field-card",
          onSubmit: Y(E, ["prevent"])
        }, [
          e("label", null, [
            g[4] || (g[4] = m("Upload", -1)),
            h(Ne, {
              value: f.value,
              onSelect: g[1] || (g[1] = (k, M) => {
                f.value = k, t.value = M;
              })
            }, null, 8, ["value"])
          ]),
          e("div", On, [
            (n(!0), s(x, null, N(l.fields, (k) => (n(), s("label", {
              key: k.name
            }, [
              m(a(k.name), 1),
              k.type === "boolean" ? U((n(), s("select", {
                key: 0,
                "onUpdate:modelValue": (M) => o.value[k.name] = M
              }, [...g[5] || (g[5] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "True", -1),
                e("option", { value: "false" }, "False", -1)
              ])], 8, An)), [
                [H, o.value[k.name]]
              ]) : k.type === "enum" ? U((n(), s("select", {
                key: 1,
                "onUpdate:modelValue": (M) => o.value[k.name] = M
              }, [
                (n(!0), s(x, null, N(k.enum_values, (M) => (n(), s("option", { key: M }, a(M), 1))), 128))
              ], 8, Ln)), [
                [H, o.value[k.name]]
              ]) : ["object", "list"].includes(k.type) ? (n(), I(y(Xe), {
                key: 2,
                modelValue: o.value[k.name],
                "onUpdate:modelValue": (M) => o.value[k.name] = M,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), I(y(Ye), {
                key: 3,
                modelValue: o.value[k.name],
                "onUpdate:modelValue": (M) => o.value[k.name] = M,
                type: k.type === "number" ? "number" : k.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type"]))
            ]))), 128))
          ]),
          V.value ? (n(), s("p", zn, a(V.value), 1)) : b("", !0),
          e("div", In, [
            h(y(j), {
              label: "Save case",
              type: "submit",
              disabled: !f.value,
              loading: l.saving
            }, null, 8, ["disabled", "loading"]),
            h(y(j), {
              label: "Cancel",
              severity: "secondary",
              text: "",
              onClick: g[2] || (g[2] = (k) => d.value = !1)
            })
          ])
        ], 32)) : b("", !0),
        l.cases.length ? b("", !0) : (n(), s("p", Wn, "No evaluation cases yet.")),
        (n(!0), s(x, null, N(l.cases, (k) => (n(), s("div", {
          key: k.id,
          class: "field-card"
        }, [
          e("header", jn, [
            e("h3", null, a(k.upload_name), 1),
            h(y(j), {
              label: "Remove case",
              severity: "secondary",
              text: "",
              size: "small",
              class: "push",
              disabled: l.saving,
              onClick: (M) => r("delete-case", k.id)
            }, null, 8, ["disabled", "onClick"])
          ]),
          e("dl", Jn, [
            (n(!0), s(x, null, N(k.expected, (M, C) => (n(), s(x, { key: C }, [
              e("dt", null, a(C), 1),
              e("dd", null, a(M), 1)
            ], 64))), 128))
          ])
        ]))), 128)),
        g[6] || (g[6] = e("p", { class: "muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", null, [
        g[8] || (g[8] = e("h2", null, "Revision comparison", -1)),
        l.results.length ? (n(), s("div", Qn, [
          (n(!0), s(x, null, N(J.value, (k, M) => (n(), s("article", {
            key: M,
            class: "field-card"
          }, [
            e("label", null, [
              g[7] || (g[7] = m("Configuration revision", -1)),
              e("select", {
                value: k?.revision,
                onChange: (C) => M === 0 ? c.value = Number(C.target.value) : $.value = Number(C.target.value)
              }, [
                (n(!0), s(x, null, N(l.results, (C) => (n(), s("option", {
                  key: C.revision,
                  value: C.revision
                }, "Revision " + a(C.revision), 9, Xn))), 128))
              ], 40, Hn)
            ]),
            k ? (n(), s(x, { key: 0 }, [
              e("p", Yn, a(k.cases) + " cases · $" + a(k.cost.toFixed(3)) + " · " + a((k.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("dl", Gn, [
                (n(!0), s(x, null, N(k.metrics, (C) => (n(), s(x, {
                  key: C.field
                }, [
                  e("dt", null, a(C.field), 1),
                  e("dd", null, [
                    m(a(Math.round(C.accuracy * 100)) + "%", 1),
                    e("small", null, "$" + a(C.cost.toFixed(3)) + " · " + a((C.duration_ms / 1e3).toFixed(1)) + "s", 1)
                  ])
                ], 64))), 128))
              ])
            ], 64)) : b("", !0)
          ]))), 128))
        ])) : (n(), s("p", Kn, "No evaluation results yet."))
      ]),
      e("section", null, [
        e("div", Zn, [
          g[9] || (g[9] = e("h2", null, "Proposals", -1)),
          h(y(j), {
            label: "Tune configuration",
            severity: "secondary",
            disabled: ""
          })
        ]),
        l.proposals.length ? b("", !0) : (n(), s("p", _n, "No tuning proposals yet.")),
        (n(!0), s(x, null, N(l.proposals, (k) => (n(), s("article", {
          key: k.id,
          class: "field-card"
        }, [
          e("h3", null, a(k.title), 1),
          e("p", es, a(k.accuracy_delta >= 0 ? "+" : "") + a(Math.round(k.accuracy_delta * 100)) + "% accuracy · " + a(k.cost_delta >= 0 ? "+" : "") + "$" + a(k.cost_delta.toFixed(3)) + " · " + a((k.duration_delta_ms / 1e3).toFixed(1)) + "s", 1),
          e("ul", null, [
            (n(!0), s(x, null, N(k.changes, (M) => (n(), s("li", { key: M }, a(M), 1))), 128))
          ]),
          e("div", ls, [
            h(y(j), {
              label: "Apply proposal",
              disabled: ""
            }),
            h(y(j), {
              label: "Discard",
              severity: "secondary",
              disabled: ""
            })
          ])
        ]))), 128)),
        g[10] || (g[10] = e("p", { class: "muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ], 64));
  }
}), ns = { class: "section-head" }, ss = { class: "muted" }, os = {
  key: 0,
  class: "empty"
}, as = {
  key: 1,
  class: "run-list"
}, is = { class: "row" }, ds = { class: "capitalize" }, us = ["data-status"], rs = /* @__PURE__ */ z({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(l) {
    const w = (p) => new Date(p).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (p, r) => (n(), s(x, null, [
      e("div", ns, [
        r[0] || (r[0] = e("h2", null, "Recent runs", -1)),
        e("span", ss, "Retention " + a(l.retention), 1)
      ]),
      l.runs.length ? (n(), s("div", as, [
        (n(!0), s(x, null, N(l.runs, (d) => (n(), s("article", {
          key: d.id,
          class: "run-card"
        }, [
          e("div", is, [
            e("strong", ds, a(d.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": d.status
            }, a(d.status), 9, us)
          ]),
          e("dl", null, [
            r[1] || (r[1] = e("dt", null, "Duration", -1)),
            e("dd", null, a((d.duration_ms / 1e3).toFixed(1)) + "s", 1),
            r[2] || (r[2] = e("dt", null, "Expires", -1)),
            e("dd", null, a(w(d.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (n(), s("p", os, "No runs yet."))
    ], 64));
  }
}), cs = () => ({ result: null, evals: [], proposals: [] }), vs = { class: "docscout" }, ms = { class: "toolbar" }, bs = { class: "toolbar-lead" }, ys = { class: "crumb" }, fs = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, ps = ["id", "aria-selected", "aria-controls", "onClick"], ks = { class: "toolbar-side" }, gs = { class: "stats" }, hs = ["title"], $s = {
  key: 1,
  class: "unsaved"
}, xs = {
  key: 0,
  role: "alert",
  class: "error banner"
}, ws = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Vs = ["id", "aria-labelledby"], Cs = /* @__PURE__ */ z({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back"],
  setup(l, { emit: w }) {
    const p = l, r = w, d = S(), f = S("Builder"), t = S(Ve()), o = S(""), V = S(""), E = P(() => p.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    G(f, () => {
      d.value && (d.value.scrollTop = 0);
    }, { flush: "post" });
    const c = P(() => p.engine ?? cs()), $ = S();
    function J(C) {
      return o.value === C.title && V.value === (C.description ?? "") && Ze(t.value, C.config);
    }
    G(() => p.snapshot, (C, O) => {
      E.value.includes(f.value) || (f.value = E.value[0]), !(O && C.id === O.id && C.can_edit && O.can_edit && !J(O) && !J(C)) && (t.value = structuredClone(ke(C.config ?? Ve())), o.value = C.title, V.value = C.description ?? "", $.value = C.expected_revision);
    }, { immediate: !0 });
    const q = P(() => p.snapshot.can_edit && !J(p.snapshot)), g = P(() => Ge(t.value)), k = P(() => t.value.workflow.filter((C) => C.enabled).length);
    function M() {
      r("save", { title: o.value, description: V.value, config: structuredClone(ke(t.value)), expected_revision: $.value });
    }
    return (C, O) => (n(), s("main", vs, [
      e("div", ms, [
        e("div", bs, [
          l.back ? (n(), s(x, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: O[0] || (O[0] = (B) => r("back"))
            }, [
              h(y(D), { icon: "tabler:arrow-left" })
            ]),
            e("span", ys, a(l.snapshot.title), 1)
          ], 64)) : b("", !0),
          e("nav", fs, [
            (n(!0), s(x, null, N(E.value, (B) => (n(), s("button", {
              id: `tab-${B}`,
              key: B,
              role: "tab",
              "aria-selected": f.value === B,
              "aria-controls": `panel-${B}`,
              onClick: (A) => f.value = B
            }, a(B), 9, ps))), 128))
          ])
        ]),
        e("div", ks, [
          e("span", gs, [
            m(a(l.snapshot.field_count) + " " + a(l.snapshot.field_count === 1 ? "field" : "fields"), 1),
            l.snapshot.can_edit ? (n(), s(x, { key: 0 }, [
              m(" · " + a(k.value) + " steps · revision " + a(l.snapshot.expected_revision), 1)
            ], 64)) : (n(), s(x, { key: 1 }, [
              m(" · Read access")
            ], 64))
          ]),
          l.snapshot.can_edit ? (n(), s(x, { key: 0 }, [
            g.value ? (n(), s("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: g.value
            }, [
              h(y(D), { icon: "tabler:alert-circle" }),
              m(a(g.value), 1)
            ], 8, hs)) : q.value ? (n(), s("span", $s, "Unsaved")) : b("", !0),
            h(y(j), {
              label: "Save",
              size: "small",
              loading: l.saving,
              disabled: !q.value || !!g.value || !o.value.trim(),
              onClick: M
            }, null, 8, ["loading", "disabled"])
          ], 64)) : b("", !0)
        ])
      ]),
      l.error ? (n(), s("p", xs, a(l.error), 1)) : b("", !0),
      f.value === "Builder" && l.snapshot.can_edit ? (n(), s("div", ws, [
        h(vn, {
          title: o.value,
          "onUpdate:title": O[1] || (O[1] = (B) => o.value = B),
          description: V.value,
          "onUpdate:description": O[2] || (O[2] = (B) => V.value = B),
          config: t.value,
          retention: l.snapshot.retention,
          result: c.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), s("div", {
        key: 2,
        ref_key: "body",
        ref: d,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${f.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${f.value}`,
          class: "panel"
        }, [
          f.value === "Test" ? (n(), I(Dn, {
            key: 0,
            result: c.value.result,
            retention: l.snapshot.retention
          }, null, 8, ["result", "retention"])) : b("", !0),
          f.value === "Evals" && l.snapshot.can_edit ? (n(), I(ts, {
            key: 1,
            cases: l.snapshot.cases,
            results: c.value.evals,
            proposals: c.value.proposals,
            fields: l.snapshot.config?.fields ?? [],
            saving: l.saving,
            onAddCase: O[3] || (O[3] = (B) => r("add-case", B)),
            onDeleteCase: O[4] || (O[4] = (B) => r("delete-case", B))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : b("", !0),
          f.value === "Runs" ? (n(), I(rs, {
            key: 2,
            runs: l.snapshot.runs,
            retention: l.snapshot.retention
          }, null, 8, ["runs", "retention"])) : b("", !0)
        ], 8, Vs)
      ], 512))
    ]));
  }
}), Us = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Ss = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Ms = /* @__PURE__ */ z({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(l, { emit: w }) {
    const p = l, r = w, d = S(), f = S(""), t = S(!1);
    let o;
    async function V() {
      if (!p.id) {
        f.value = "No extractor selected.";
        return;
      }
      const q = p.id;
      try {
        const g = await Z.get(q);
        q === p.id && (d.value = g, f.value = "");
      } catch (g) {
        f.value = g instanceof Error ? g.message : String(g);
      }
    }
    G(() => p.id, () => {
      d.value = void 0, o?.(), V(), p.id && (o = ze(`component.${p.id}`, () => V()));
    }, { immediate: !0 }), Ue(() => o?.());
    async function E(q) {
      t.value = !0, f.value = "";
      try {
        await q(), await V();
      } catch (g) {
        f.value = g instanceof Error ? g.message : String(g);
      } finally {
        t.value = !1;
      }
    }
    const c = (q) => E(() => Z.update(p.id, q)), $ = (q) => E(() => Z.addCase(p.id, q)), J = (q) => E(() => Z.deleteCase(p.id, q));
    return (q, g) => d.value ? (n(), I(Cs, {
      key: 0,
      snapshot: d.value,
      saving: t.value,
      error: f.value,
      back: l.back,
      onBack: g[0] || (g[0] = (k) => r("back")),
      onSave: c,
      onAddCase: $,
      onDeleteCase: J
    }, null, 8, ["snapshot", "saving", "error", "back"])) : f.value ? (n(), s("p", Us, a(f.value), 1)) : (n(), s("p", Ss, "Loading Docscout…"));
  }
});
export {
  Ms as _
};
