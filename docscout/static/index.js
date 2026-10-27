import { defineComponent as q, openBlock as o, createElementBlock as s, Fragment as m, createElementVNode as e, createVNode as g, unref as y, createCommentVNode as p, renderList as V, toDisplayString as u, createTextVNode as c, withDirectives as h, vModelSelect as B, vModelCheckbox as T, ref as $, onMounted as K, normalizeClass as Z, vModelText as z, watch as j, computed as O, withModifiers as ee, createBlock as D, toRaw as J, onBeforeUnmount as le } from "vue";
import "@iconify/vue";
import { loadByTagName as Q, on as te, define as ne } from "@wippy-fe/proxy";
import { b as S, f as oe, s as I, a as P, g as W, m as Y, n as H, h as se, i as ae, u as ie, d as L, e as ue } from "./index-CzyJHWsI.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const de = { class: "section-head" }, re = {
  key: 0,
  class: "empty"
}, ce = { class: "row" }, ve = { class: "ordinal" }, me = { class: "grid" }, pe = ["onUpdate:modelValue", "aria-label"], ye = ["value"], be = { key: 0 }, ge = { key: 1 }, ke = ["onUpdate:modelValue"], he = ["value"], fe = { class: "grid" }, $e = { class: "grid" }, _e = ["onUpdate:modelValue"], Ve = { class: "row wrap" }, xe = { class: "check" }, we = ["onUpdate:modelValue"], Ue = { class: "check" }, Ce = ["onUpdate:modelValue"], Se = /* @__PURE__ */ q({
  __name: "FieldsEditor",
  props: {
    config: {}
  },
  setup(a) {
    const _ = ["text", "number", "boolean", "date", "enum", "list", "object"];
    function v(i) {
      return i.target.value.split(`
`).map((l) => l.trim()).filter(Boolean);
    }
    return (i, l) => (o(), s(m, null, [
      e("div", de, [
        l[1] || (l[1] = e("div", null, [
          e("h2", null, "Fields"),
          e("p", { class: "muted" }, "Values to find in each document.")
        ], -1)),
        g(y(S), {
          label: "Add field",
          size: "small",
          onClick: l[0] || (l[0] = (n) => a.config.fields.push(y(oe)()))
        })
      ]),
      a.config.fields.length ? p("", !0) : (o(), s("p", re, "No fields yet.")),
      (o(!0), s(m, null, V(a.config.fields, (n, d) => (o(), s("article", {
        key: d,
        class: "field-card"
      }, [
        e("header", ce, [
          e("span", ve, u(d + 1), 1),
          e("h3", null, u(n.name || "New field"), 1),
          g(y(S), {
            label: "Remove",
            severity: "secondary",
            text: "",
            size: "small",
            class: "push",
            onClick: (t) => a.config.fields.splice(d, 1)
          }, null, 8, ["onClick"])
        ]),
        e("div", me, [
          e("label", null, [
            l[2] || (l[2] = c("Name", -1)),
            g(y(I), {
              modelValue: n.name,
              "onUpdate:modelValue": (t) => n.name = t,
              placeholder: "invoice_total",
              "aria-label": `Field ${d + 1} name`
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          e("label", null, [
            l[3] || (l[3] = c("Type", -1)),
            h(e("select", {
              "onUpdate:modelValue": (t) => n.type = t,
              "aria-label": `Field ${d + 1} type`
            }, [
              (o(), s(m, null, V(_, (t) => e("option", {
                key: t,
                value: t
              }, u(t[0].toUpperCase() + t.slice(1)), 9, ye)), 64))
            ], 8, pe), [
              [B, n.type]
            ])
          ])
        ]),
        e("label", null, [
          l[4] || (l[4] = c("Description", -1)),
          g(y(P), {
            modelValue: n.description,
            "onUpdate:modelValue": (t) => n.description = t,
            rows: "2",
            placeholder: "What this value means"
          }, null, 8, ["modelValue", "onUpdate:modelValue"])
        ]),
        n.type === "enum" ? (o(), s("label", be, [
          l[5] || (l[5] = c("Enum values", -1)),
          g(y(P), {
            value: n.enum_values.join(`
`),
            rows: "3",
            placeholder: "One value per line",
            onInput: (t) => n.enum_values = v(t)
          }, null, 8, ["value", "onInput"])
        ])) : p("", !0),
        n.type === "list" ? (o(), s("label", ge, [
          l[6] || (l[6] = c("List item type", -1)),
          h(e("select", {
            "onUpdate:modelValue": (t) => n.item_type = t
          }, [
            (o(!0), s(m, null, V(_.filter((t) => !["enum", "list"].includes(t)), (t) => (o(), s("option", {
              key: t,
              value: t
            }, u(t), 9, he))), 128))
          ], 8, ke), [
            [B, n.item_type]
          ])
        ])) : p("", !0),
        e("div", fe, [
          e("label", null, [
            l[7] || (l[7] = c("Search hints", -1)),
            g(y(P), {
              modelValue: n.search_hints,
              "onUpdate:modelValue": (t) => n.search_hints = t,
              rows: "2",
              placeholder: "Terms and phrases to look for"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          e("label", null, [
            l[8] || (l[8] = c("Validation hints", -1)),
            g(y(P), {
              modelValue: n.validation_hints,
              "onUpdate:modelValue": (t) => n.validation_hints = t,
              rows: "2",
              placeholder: "Rules the value should satisfy"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ])
        ]),
        e("div", $e, [
          e("label", null, [
            l[9] || (l[9] = c("Expected format", -1)),
            g(y(I), {
              modelValue: n.expected_format,
              "onUpdate:modelValue": (t) => n.expected_format = t,
              placeholder: "For example, YYYY-MM-DD"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          e("label", null, [
            l[11] || (l[11] = c("Strategy", -1)),
            h(e("select", {
              "onUpdate:modelValue": (t) => n.strategy = t
            }, [...l[10] || (l[10] = [
              e("option", { value: "standard" }, "Standard", -1),
              e("option", { value: "deep" }, "Deep analysis", -1)
            ])], 8, _e), [
              [B, n.strategy]
            ])
          ])
        ]),
        e("div", Ve, [
          e("label", xe, [
            h(e("input", {
              "onUpdate:modelValue": (t) => n.required = t,
              type: "checkbox"
            }, null, 8, we), [
              [T, n.required]
            ]),
            l[12] || (l[12] = c("Required", -1))
          ]),
          e("label", Ue, [
            h(e("input", {
              "onUpdate:modelValue": (t) => n.evidence_required = t,
              type: "checkbox"
            }, null, 8, Ce), [
              [T, n.evidence_required]
            ]),
            l[13] || (l[13] = c("Evidence required", -1))
          ])
        ])
      ]))), 128))
    ], 64));
  }
}), Ee = ["value", "capability", "aria-labelledby"], Ne = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Re = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, A = /* @__PURE__ */ q({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(a, { emit: _ }) {
    const v = _, i = $(!!customElements.get("wc-model-picker")), l = $("");
    K(async () => {
      if (!i.value)
        try {
          await Q("wc-model-picker", { timeoutMs: 8e3 }), i.value = !0;
        } catch (d) {
          l.value = d instanceof Error ? d.message : String(d);
        }
    });
    function n(d) {
      const t = d.detail;
      typeof t == "string" && v("select", t);
    }
    return (d, t) => i.value ? (o(), s("wc-model-picker", {
      key: 0,
      value: a.value,
      capability: a.capability,
      "aria-labelledby": a.labelledBy,
      onSelect: n
    }, null, 40, Ee)) : l.value ? (o(), s("p", Ne, "Could not load model picker: " + u(l.value), 1)) : (o(), s("span", Re, "Loading models…"));
  }
}), Me = { class: "row" }, Fe = { class: "ordinal" }, qe = { class: "check push" }, De = ["onUpdate:modelValue", "aria-label"], Te = {
  key: 0,
  class: "step-body"
}, ze = { class: "grid" }, Be = ["onUpdate:modelValue"], Pe = ["id"], Oe = { key: 0 }, Le = ["onUpdate:modelValue"], je = { key: 1 }, Ie = {
  key: 2,
  class: "grid three"
}, Ae = ["onUpdate:modelValue"], Je = ["onUpdate:modelValue"], We = ["onUpdate:modelValue"], Ye = { class: "check" }, He = ["onUpdate:modelValue"], Ke = { key: 3 }, Qe = ["onUpdate:modelValue"], Ge = { key: 4 }, Xe = ["onUpdate:modelValue"], Ze = {
  key: 5,
  class: "check"
}, el = ["onUpdate:modelValue"], ll = {
  key: 1,
  class: "row"
}, tl = /* @__PURE__ */ q({
  __name: "WorkflowEditor",
  props: {
    config: {}
  },
  setup(a) {
    const _ = ["outline", "section", "chunk"];
    function v(i) {
      return i.target.value.split(`
`).map((l) => l.trim()).filter(Boolean);
    }
    return (i, l) => (o(), s(m, null, [
      l[13] || (l[13] = e("div", { class: "section-head" }, [
        e("div", null, [
          e("h2", null, "Reading workflow"),
          e("p", { class: "muted" }, "Steps run in this order. Map the document stays first.")
        ])
      ], -1)),
      (o(!0), s(m, null, V(a.config.workflow, (n, d) => (o(), s("article", {
        key: n.kind,
        class: Z(["step-card", { inactive: !n.enabled }])
      }, [
        e("header", Me, [
          e("span", Fe, u(d + 1), 1),
          e("h3", null, u(y(W)[n.kind]), 1),
          e("label", qe, [
            h(e("input", {
              "onUpdate:modelValue": (t) => n.enabled = t,
              type: "checkbox",
              "aria-label": `Enable ${y(W)[n.kind]}`
            }, null, 8, De), [
              [T, n.enabled]
            ]),
            l[0] || (l[0] = c("Enabled", -1))
          ])
        ]),
        n.enabled ? (o(), s("div", Te, [
          e("div", ze, [
            e("label", null, [
              l[1] || (l[1] = c("Scope", -1)),
              h(e("select", {
                "onUpdate:modelValue": (t) => n.scope = t
              }, [
                (o(), s(m, null, V(_, (t) => e("option", { key: t }, u(t), 1)), 64))
              ], 8, Be), [
                [B, n.scope]
              ])
            ]),
            n.model !== void 0 ? (o(), s("label", {
              key: 0,
              id: `model-${n.kind}`
            }, [
              l[2] || (l[2] = c("Model", -1)),
              g(A, {
                value: n.model,
                capability: "generate",
                "labelled-by": `model-${n.kind}`,
                onSelect: (t) => n.model = t
              }, null, 8, ["value", "labelled-by", "onSelect"])
            ], 8, Pe)) : p("", !0)
          ]),
          n.kind === "map" ? (o(), s("label", Oe, [
            l[4] || (l[4] = c("Outline", -1)),
            h(e("select", {
              "onUpdate:modelValue": (t) => n.options.outline_mode = t
            }, [...l[3] || (l[3] = [
              e("option", { value: "find_or_build" }, "Use a table of contents or build an outline", -1),
              e("option", { value: "build" }, "Build an outline", -1)
            ])], 8, Le), [
              [B, n.options.outline_mode]
            ])
          ])) : p("", !0),
          n.kind === "prefetch" ? (o(), s("label", je, [
            l[5] || (l[5] = c("Queries", -1)),
            g(y(P), {
              value: n.options.queries.join(`
`),
              rows: "3",
              placeholder: "One query per line",
              onInput: (t) => n.options.queries = v(t)
            }, null, 8, ["value", "onInput"])
          ])) : p("", !0),
          n.kind === "scout" ? (o(), s("div", Ie, [
            e("label", null, [
              l[6] || (l[6] = c("Maximum iterations", -1)),
              h(e("input", {
                "onUpdate:modelValue": (t) => n.options.max_iterations = t,
                type: "number",
                min: "1",
                max: "30"
              }, null, 8, Ae), [
                [
                  z,
                  n.options.max_iterations,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", null, [
              l[7] || (l[7] = c("Target confidence", -1)),
              h(e("input", {
                "onUpdate:modelValue": (t) => n.options.target_confidence = t,
                type: "number",
                min: "0",
                max: "1",
                step: "0.05"
              }, null, 8, Je), [
                [
                  z,
                  n.options.target_confidence,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", null, [
              l[8] || (l[8] = c("Extra queries per iteration", -1)),
              h(e("input", {
                "onUpdate:modelValue": (t) => n.options.max_extra_queries = t,
                type: "number",
                min: "0",
                max: "20"
              }, null, 8, We), [
                [
                  z,
                  n.options.max_extra_queries,
                  void 0,
                  { number: !0 }
                ]
              ])
            ]),
            e("label", Ye, [
              h(e("input", {
                "onUpdate:modelValue": (t) => n.options.drop_noise = t,
                type: "checkbox"
              }, null, 8, He), [
                [T, n.options.drop_noise]
              ]),
              l[9] || (l[9] = c("Drop noise", -1))
            ])
          ])) : p("", !0),
          n.kind === "deep" ? (o(), s("label", Ke, [
            l[10] || (l[10] = c("Parallel fields", -1)),
            h(e("input", {
              "onUpdate:modelValue": (t) => n.options.parallel_fields = t,
              type: "number",
              min: "1",
              max: "20"
            }, null, 8, Qe), [
              [
                z,
                n.options.parallel_fields,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : p("", !0),
          n.kind === "extract" ? (o(), s("label", Ge, [
            l[11] || (l[11] = c("Maximum output tokens", -1)),
            h(e("input", {
              "onUpdate:modelValue": (t) => n.options.max_output_tokens = t,
              type: "number",
              min: "256",
              max: "64000"
            }, null, 8, Xe), [
              [
                z,
                n.options.max_output_tokens,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : p("", !0),
          n.kind === "verify" ? (o(), s("label", Ze, [
            h(e("input", {
              "onUpdate:modelValue": (t) => n.options.require_all_values = t,
              type: "checkbox"
            }, null, 8, el), [
              [T, n.options.require_all_values]
            ]),
            l[12] || (l[12] = c("Check every value against its evidence", -1))
          ])) : p("", !0)
        ])) : p("", !0),
        d > 0 ? (o(), s("footer", ll, [
          g(y(S), {
            label: "Move up",
            size: "small",
            severity: "secondary",
            text: "",
            disabled: d === 1,
            onClick: (t) => y(Y)(a.config, d, -1)
          }, null, 8, ["disabled", "onClick"]),
          g(y(S), {
            label: "Move down",
            size: "small",
            severity: "secondary",
            text: "",
            disabled: d === a.config.workflow.length - 1,
            onClick: (t) => y(Y)(a.config, d, 1)
          }, null, 8, ["disabled", "onClick"])
        ])) : p("", !0)
      ], 2))), 128))
    ], 64));
  }
}), nl = { class: "grid" }, ol = { class: "check" }, sl = { class: "grid" }, al = { class: "check" }, il = { id: "embedding-model" }, ul = { class: "check" }, dl = {
  key: 0,
  id: "highlighter-model"
}, rl = { class: "grid" }, cl = ["onUpdate:modelValue"], vl = /* @__PURE__ */ q({
  __name: "RetrievalEditor",
  props: {
    config: {}
  },
  setup(a) {
    const _ = { keyword_search: "Keyword search", semantic_search: "Semantic search", read_section: "Read section", read_outline: "Read outline" };
    return (v, i) => (o(), s(m, null, [
      e("section", null, [
        i[14] || (i[14] = e("h2", null, "Chunks", -1)),
        e("div", nl, [
          e("label", null, [
            i[9] || (i[9] = c("Chunk size", -1)),
            h(e("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (l) => a.config.retrieval.chunk_size = l),
              type: "number",
              min: "100",
              max: "16000"
            }, null, 512), [
              [
                z,
                a.config.retrieval.chunk_size,
                void 0,
                { number: !0 }
              ]
            ]),
            i[10] || (i[10] = e("small", null, "Tokens per chunk", -1))
          ]),
          e("label", null, [
            i[11] || (i[11] = c("Overlap", -1)),
            h(e("input", {
              "onUpdate:modelValue": i[1] || (i[1] = (l) => a.config.retrieval.overlap = l),
              type: "number",
              min: "0",
              max: "4000"
            }, null, 512), [
              [
                z,
                a.config.retrieval.overlap,
                void 0,
                { number: !0 }
              ]
            ]),
            i[12] || (i[12] = e("small", null, "Tokens shared with the next chunk", -1))
          ])
        ]),
        e("label", ol, [
          h(e("input", {
            "onUpdate:modelValue": i[2] || (i[2] = (l) => a.config.retrieval.split_headings = l),
            type: "checkbox"
          }, null, 512), [
            [T, a.config.retrieval.split_headings]
          ]),
          i[13] || (i[13] = c("Split by headings", -1))
        ])
      ]),
      e("section", null, [
        i[20] || (i[20] = e("h2", null, "Search", -1)),
        e("div", sl, [
          e("label", null, [
            i[16] || (i[16] = c("Search mode", -1)),
            h(e("select", {
              "onUpdate:modelValue": i[3] || (i[3] = (l) => a.config.retrieval.search_mode = l)
            }, [...i[15] || (i[15] = [
              e("option", { value: "keyword" }, "Keyword", -1),
              e("option", { value: "semantic" }, "Semantic", -1),
              e("option", { value: "hybrid" }, "Hybrid", -1)
            ])], 512), [
              [B, a.config.retrieval.search_mode]
            ])
          ]),
          e("label", null, [
            i[17] || (i[17] = c("Results per query", -1)),
            h(e("input", {
              "onUpdate:modelValue": i[4] || (i[4] = (l) => a.config.retrieval.top_results = l),
              type: "number",
              min: "1",
              max: "100"
            }, null, 512), [
              [
                z,
                a.config.retrieval.top_results,
                void 0,
                { number: !0 }
              ]
            ])
          ])
        ]),
        e("label", al, [
          h(e("input", {
            "onUpdate:modelValue": i[5] || (i[5] = (l) => a.config.retrieval.contextual_embeddings = l),
            type: "checkbox"
          }, null, 512), [
            [T, a.config.retrieval.contextual_embeddings]
          ]),
          i[18] || (i[18] = c("Prepend section context before embedding", -1))
        ]),
        e("label", il, [
          i[19] || (i[19] = c("Embedding model", -1)),
          g(A, {
            value: a.config.retrieval.embedding_model,
            capability: "embed",
            "labelled-by": "embedding-model",
            onSelect: i[6] || (i[6] = (l) => a.config.retrieval.embedding_model = l)
          }, null, 8, ["value"])
        ])
      ]),
      e("section", null, [
        i[23] || (i[23] = e("h2", null, "Highlighter", -1)),
        e("label", ul, [
          h(e("input", {
            "onUpdate:modelValue": i[7] || (i[7] = (l) => a.config.retrieval.highlighter = l),
            type: "checkbox"
          }, null, 512), [
            [T, a.config.retrieval.highlighter]
          ]),
          i[21] || (i[21] = c("Mark relevant spans before extraction", -1))
        ]),
        a.config.retrieval.highlighter ? (o(), s("label", dl, [
          i[22] || (i[22] = c("Model", -1)),
          g(A, {
            value: a.config.retrieval.highlighter_model,
            capability: "generate",
            "labelled-by": "highlighter-model",
            onSelect: i[8] || (i[8] = (l) => a.config.retrieval.highlighter_model = l)
          }, null, 8, ["value"])
        ])) : p("", !0)
      ]),
      e("section", null, [
        i[24] || (i[24] = e("h2", null, "Internal agent tools", -1)),
        e("div", rl, [
          (o(), s(m, null, V(_, (l, n) => e("label", {
            key: n,
            class: "check"
          }, [
            h(e("input", {
              "onUpdate:modelValue": (d) => a.config.tools[n] = d,
              type: "checkbox"
            }, null, 8, cl), [
              [T, a.config.tools[n]]
            ]),
            c(u(l), 1)
          ])), 64))
        ])
      ])
    ], 64));
  }
}), ml = ["selected"], pl = {
  key: 1,
  role: "alert"
}, yl = {
  key: 2,
  class: "muted"
}, G = /* @__PURE__ */ q({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(a, { emit: _ }) {
    const v = _, i = $(!1), l = $("");
    K(async () => {
      try {
        await Q("wc-multiselect", { timeoutMs: 8e3 }), i.value = !0;
      } catch (d) {
        l.value = String(d);
      }
    });
    function n(d) {
      const t = d.detail;
      v("select", t.selected[0] || "", t.labels?.[0] || "");
    }
    return (d, t) => i.value ? (o(), s("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(a.value ? [a.value] : []),
      placeholder: "Choose an upload",
      onChange: n
    }, null, 40, ml)) : l.value ? (o(), s("p", pl, u(l.value), 1)) : (o(), s("span", yl, "Loading uploads…"));
  }
}), bl = { class: "test-input" }, gl = { class: "row wrap" }, kl = { class: "grow" }, hl = { class: "retention" }, fl = { class: "section-head" }, $l = { class: "muted" }, _l = { class: "row" }, Vl = { class: "confidence push" }, xl = { class: "value" }, wl = { class: "muted" }, Ul = {
  key: 0,
  class: "muted"
}, Cl = { class: "trace" }, Sl = { class: "row wrap" }, El = { class: "muted" }, Nl = { class: "push" }, Rl = { class: "muted" }, Ml = { key: 0 }, Fl = { key: 1 }, ql = {
  key: 1,
  class: "empty"
}, Dl = /* @__PURE__ */ q({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(a) {
    const _ = $(""), v = (l) => `${Math.round(l * 100)}%`, i = (l) => typeof l == "string" ? l : JSON.stringify(l);
    return (l, n) => (o(), s(m, null, [
      e("section", bl, [
        n[1] || (n[1] = e("h2", null, "Document", -1)),
        e("div", gl, [
          e("div", kl, [
            g(G, {
              value: _.value,
              onSelect: n[0] || (n[0] = (d) => _.value = d)
            }, null, 8, ["value"])
          ]),
          g(y(S), {
            label: "Run extraction",
            disabled: ""
          })
        ]),
        n[2] || (n[2] = e("p", { class: "muted" }, "Extraction is not available yet.", -1)),
        e("p", hl, "Processed documents and runs expire after " + u(a.retention) + ".", 1)
      ]),
      a.result ? (o(), s(m, { key: 0 }, [
        e("div", fl, [
          n[3] || (n[3] = e("h2", null, "Values", -1)),
          e("span", $l, u(a.result.tokens.toLocaleString()) + " tokens · " + u((a.result.duration_ms / 1e3).toFixed(1)) + "s", 1)
        ]),
        (o(!0), s(m, null, V(a.result.fields, (d) => (o(), s("article", {
          key: d.name,
          class: "field-card value-card"
        }, [
          e("header", _l, [
            e("h3", null, u(d.name), 1),
            e("span", Vl, u(v(d.confidence)) + " confidence", 1)
          ]),
          e("p", xl, u(i(d.value)), 1),
          e("p", wl, u(d.verified ? "Verified" : "Unverified"), 1),
          (o(!0), s(m, null, V(d.evidence, (t, x) => (o(), s("blockquote", { key: x }, [
            e("p", null, "“" + u(t.quote) + "”", 1),
            e("cite", null, [
              c(u(t.section), 1),
              t.page !== void 0 ? (o(), s(m, { key: 0 }, [
                c(" · Page " + u(t.page), 1)
              ], 64)) : p("", !0)
            ])
          ]))), 128)),
          d.evidence.length ? p("", !0) : (o(), s("p", Ul, "No evidence."))
        ]))), 128)),
        n[4] || (n[4] = e("h2", null, "Trace", -1)),
        e("ol", Cl, [
          (o(!0), s(m, null, V(a.result.trace, (d, t) => (o(), s("li", { key: t }, [
            e("div", Sl, [
              e("strong", null, u(d.kind), 1),
              e("span", El, u(d.status), 1),
              e("span", Nl, u((d.duration_ms / 1e3).toFixed(1)) + "s", 1)
            ]),
            e("p", Rl, [
              c(u(d.scope), 1),
              d.model ? (o(), s(m, { key: 0 }, [
                c(" · " + u(d.model), 1)
              ], 64)) : p("", !0),
              c(" · " + u(d.input_tokens + d.output_tokens) + " tokens", 1),
              d.cost !== void 0 ? (o(), s(m, { key: 1 }, [
                c(" · $" + u(d.cost.toFixed(4)), 1)
              ], 64)) : p("", !0)
            ]),
            d.message ? (o(), s("p", Ml, u(d.message), 1)) : p("", !0),
            d.queries?.length ? (o(), s("ul", Fl, [
              (o(!0), s(m, null, V(d.queries, (x) => (o(), s("li", { key: x }, u(x), 1))), 128))
            ])) : p("", !0)
          ]))), 128))
        ])
      ], 64)) : (o(), s("p", ql, "No extraction results yet."))
    ], 64));
  }
}), Tl = { class: "section-head" }, zl = { class: "row wrap" }, Bl = { class: "grid" }, Pl = ["onUpdate:modelValue"], Ol = ["onUpdate:modelValue"], Ll = {
  key: 0,
  class: "error",
  role: "alert"
}, jl = { class: "row" }, Il = {
  key: 1,
  class: "empty"
}, Al = { class: "row" }, Jl = { class: "values" }, Wl = {
  key: 0,
  class: "empty"
}, Yl = {
  key: 1,
  class: "grid comparison"
}, Hl = ["value", "onChange"], Kl = ["value"], Ql = { class: "muted" }, Gl = { class: "values" }, Xl = { class: "section-head" }, Zl = {
  key: 0,
  class: "empty"
}, et = { class: "delta" }, lt = { class: "row" }, tt = /* @__PURE__ */ q({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(a, { emit: _ }) {
    const v = a, i = _, l = $(!1), n = $(""), d = $(""), t = $({}), x = $("");
    j(() => v.cases, () => {
      l.value = !1, n.value = "", t.value = {};
    });
    function R() {
      x.value = "";
      const F = {};
      try {
        for (const b of v.fields) {
          const r = t.value[b.name] ?? "";
          F[b.name] = ["number", "boolean", "list", "object"].includes(b.type) ? r.trim() ? JSON.parse(r) : null : r;
        }
        i("add-case", { upload_id: n.value, upload_name: d.value, expected: F });
      } catch {
        x.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const M = $(), C = $(), f = O(() => [v.results.find((F) => F.revision === (M.value ?? v.results[0]?.revision)), v.results.find((F) => F.revision === (C.value ?? v.results[1]?.revision))]);
    return (F, b) => (o(), s(m, null, [
      e("section", null, [
        e("div", Tl, [
          b[3] || (b[3] = e("h2", null, "Cases", -1)),
          e("div", zl, [
            g(y(S), {
              label: "Add case",
              severity: "secondary",
              disabled: !a.fields.length,
              onClick: b[0] || (b[0] = (r) => l.value = !l.value)
            }, null, 8, ["disabled"]),
            g(y(S), {
              label: "Run all cases",
              disabled: ""
            })
          ])
        ]),
        l.value ? (o(), s("form", {
          key: 0,
          class: "field-card",
          onSubmit: ee(R, ["prevent"])
        }, [
          e("label", null, [
            b[4] || (b[4] = c("Upload", -1)),
            g(G, {
              value: n.value,
              onSelect: b[1] || (b[1] = (r, k) => {
                n.value = r, d.value = k;
              })
            }, null, 8, ["value"])
          ]),
          e("div", Bl, [
            (o(!0), s(m, null, V(a.fields, (r) => (o(), s("label", {
              key: r.name
            }, [
              c(u(r.name), 1),
              r.type === "boolean" ? h((o(), s("select", {
                key: 0,
                "onUpdate:modelValue": (k) => t.value[r.name] = k
              }, [...b[5] || (b[5] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "True", -1),
                e("option", { value: "false" }, "False", -1)
              ])], 8, Pl)), [
                [B, t.value[r.name]]
              ]) : r.type === "enum" ? h((o(), s("select", {
                key: 1,
                "onUpdate:modelValue": (k) => t.value[r.name] = k
              }, [
                (o(!0), s(m, null, V(r.enum_values, (k) => (o(), s("option", { key: k }, u(k), 1))), 128))
              ], 8, Ol)), [
                [B, t.value[r.name]]
              ]) : ["object", "list"].includes(r.type) ? (o(), D(y(P), {
                key: 2,
                modelValue: t.value[r.name],
                "onUpdate:modelValue": (k) => t.value[r.name] = k,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (o(), D(y(I), {
                key: 3,
                modelValue: t.value[r.name],
                "onUpdate:modelValue": (k) => t.value[r.name] = k,
                type: r.type === "number" ? "number" : r.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type"]))
            ]))), 128))
          ]),
          x.value ? (o(), s("p", Ll, u(x.value), 1)) : p("", !0),
          e("div", jl, [
            g(y(S), {
              label: "Save case",
              type: "submit",
              disabled: !n.value,
              loading: a.saving
            }, null, 8, ["disabled", "loading"]),
            g(y(S), {
              label: "Cancel",
              severity: "secondary",
              text: "",
              onClick: b[2] || (b[2] = (r) => l.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        a.cases.length ? p("", !0) : (o(), s("p", Il, "No evaluation cases yet.")),
        (o(!0), s(m, null, V(a.cases, (r) => (o(), s("div", {
          key: r.id,
          class: "field-card"
        }, [
          e("header", Al, [
            e("h3", null, u(r.upload_name), 1),
            g(y(S), {
              label: "Remove case",
              severity: "secondary",
              text: "",
              size: "small",
              class: "push",
              disabled: a.saving,
              onClick: (k) => i("delete-case", r.id)
            }, null, 8, ["disabled", "onClick"])
          ]),
          e("dl", Jl, [
            (o(!0), s(m, null, V(r.expected, (k, U) => (o(), s(m, { key: U }, [
              e("dt", null, u(U), 1),
              e("dd", null, u(k), 1)
            ], 64))), 128))
          ])
        ]))), 128)),
        b[6] || (b[6] = e("p", { class: "muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", null, [
        b[8] || (b[8] = e("h2", null, "Revision comparison", -1)),
        a.results.length ? (o(), s("div", Yl, [
          (o(!0), s(m, null, V(f.value, (r, k) => (o(), s("article", {
            key: k,
            class: "field-card"
          }, [
            e("label", null, [
              b[7] || (b[7] = c("Configuration revision", -1)),
              e("select", {
                value: r?.revision,
                onChange: (U) => k === 0 ? M.value = Number(U.target.value) : C.value = Number(U.target.value)
              }, [
                (o(!0), s(m, null, V(a.results, (U) => (o(), s("option", {
                  key: U.revision,
                  value: U.revision
                }, "Revision " + u(U.revision), 9, Kl))), 128))
              ], 40, Hl)
            ]),
            r ? (o(), s(m, { key: 0 }, [
              e("p", Ql, u(r.cases) + " cases · $" + u(r.cost.toFixed(3)) + " · " + u((r.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("dl", Gl, [
                (o(!0), s(m, null, V(r.metrics, (U) => (o(), s(m, {
                  key: U.field
                }, [
                  e("dt", null, u(U.field), 1),
                  e("dd", null, [
                    c(u(Math.round(U.accuracy * 100)) + "%", 1),
                    e("small", null, "$" + u(U.cost.toFixed(3)) + " · " + u((U.duration_ms / 1e3).toFixed(1)) + "s", 1)
                  ])
                ], 64))), 128))
              ])
            ], 64)) : p("", !0)
          ]))), 128))
        ])) : (o(), s("p", Wl, "No evaluation results yet."))
      ]),
      e("section", null, [
        e("div", Xl, [
          b[9] || (b[9] = e("h2", null, "Proposals", -1)),
          g(y(S), {
            label: "Tune configuration",
            severity: "secondary",
            disabled: ""
          })
        ]),
        a.proposals.length ? p("", !0) : (o(), s("p", Zl, "No tuning proposals yet.")),
        (o(!0), s(m, null, V(a.proposals, (r) => (o(), s("article", {
          key: r.id,
          class: "field-card"
        }, [
          e("h3", null, u(r.title), 1),
          e("p", et, u(r.accuracy_delta >= 0 ? "+" : "") + u(Math.round(r.accuracy_delta * 100)) + "% accuracy · " + u(r.cost_delta >= 0 ? "+" : "") + "$" + u(r.cost_delta.toFixed(3)) + " · " + u((r.duration_delta_ms / 1e3).toFixed(1)) + "s", 1),
          e("ul", null, [
            (o(!0), s(m, null, V(r.changes, (k) => (o(), s("li", { key: k }, u(k), 1))), 128))
          ]),
          e("div", lt, [
            g(y(S), {
              label: "Apply proposal",
              disabled: ""
            }),
            g(y(S), {
              label: "Discard",
              severity: "secondary",
              disabled: ""
            })
          ])
        ]))), 128)),
        b[10] || (b[10] = e("p", { class: "muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ], 64));
  }
}), nt = { class: "section-head" }, ot = { class: "muted" }, st = {
  key: 0,
  class: "empty"
}, at = {
  key: 1,
  class: "run-list"
}, it = { class: "row" }, ut = { class: "capitalize" }, dt = ["data-status"], rt = /* @__PURE__ */ q({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(a) {
    const _ = (v) => new Date(v).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (v, i) => (o(), s(m, null, [
      e("div", nt, [
        i[0] || (i[0] = e("h2", null, "Recent runs", -1)),
        e("span", ot, "Retention " + u(a.retention), 1)
      ]),
      a.runs.length ? (o(), s("div", at, [
        (o(!0), s(m, null, V(a.runs, (l) => (o(), s("article", {
          key: l.id,
          class: "run-card"
        }, [
          e("div", it, [
            e("strong", ut, u(l.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": l.status
            }, u(l.status), 9, dt)
          ]),
          e("dl", null, [
            i[1] || (i[1] = e("dt", null, "Duration", -1)),
            e("dd", null, u((l.duration_ms / 1e3).toFixed(1)) + "s", 1),
            i[2] || (i[2] = e("dt", null, "Expires", -1)),
            e("dd", null, u(_(l.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (o(), s("p", st, "No runs yet."))
    ], 64));
  }
}), ct = () => ({ result: null, evals: [], proposals: [] }), vt = { class: "page-header" }, mt = { class: "heading" }, pt = {
  key: 0,
  class: "description"
}, yt = { class: "row meta-line" }, bt = { class: "badge" }, gt = { key: 0 }, kt = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, ht = ["id", "aria-selected", "aria-controls", "onClick"], ft = {
  key: 0,
  role: "alert",
  class: "error"
}, $t = {
  key: 1,
  role: "alert",
  class: "error"
}, _t = ["id", "aria-labelledby"], Vt = { class: "identity" }, xt = { class: "grid" }, wt = /* @__PURE__ */ q({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {}
  },
  emits: ["save", "add-case", "delete-case"],
  setup(a, { emit: _ }) {
    const v = a, i = _, l = $(), n = $();
    function d() {
      l.value?.dispatchEvent(new CustomEvent("navigate", { detail: { path: "/workspace" }, bubbles: !0, composed: !0 }));
    }
    const t = $("Fields"), x = $(H()), R = $(""), M = $(""), C = O(() => v.snapshot.can_edit ? ["Fields", "Workflow", "Retrieval", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    j(t, () => {
      n.value && (n.value.scrollTop = 0);
    }, { flush: "post" });
    const f = O(() => v.engine ?? ct()), F = $();
    function b(N) {
      return R.value === N.title && M.value === (N.description ?? "") && ae(x.value, N.config);
    }
    j(() => v.snapshot, (N, w) => {
      C.value.includes(t.value) || (t.value = C.value[0]), !(w && N.id === w.id && N.can_edit && w.can_edit && !b(w) && !b(N)) && (x.value = structuredClone(J(N.config ?? H())), R.value = N.title, M.value = N.description ?? "", F.value = N.expected_revision);
    }, { immediate: !0 });
    const r = O(() => !b(v.snapshot)), k = O(() => se(x.value));
    function U() {
      i("save", { title: R.value, description: M.value, config: structuredClone(J(x.value)), expected_revision: F.value });
    }
    return (N, w) => (o(), s("main", {
      ref_key: "root",
      ref: l,
      class: "docscout"
    }, [
      e("header", vt, [
        e("div", mt, [
          g(y(S), {
            label: "Workspace",
            text: "",
            severity: "secondary",
            size: "small",
            class: "back-link",
            onClick: d
          }),
          w[4] || (w[4] = e("div", { class: "eyebrow" }, "Docscout", -1)),
          e("h1", null, u(a.snapshot.title), 1),
          a.snapshot.description ? (o(), s("p", pt, u(a.snapshot.description), 1)) : p("", !0),
          e("div", yt, [
            e("span", null, u(a.snapshot.field_count) + " " + u(a.snapshot.field_count === 1 ? "field" : "fields"), 1),
            e("span", bt, u(a.snapshot.status), 1),
            a.snapshot.can_edit ? p("", !0) : (o(), s("span", gt, "Read access"))
          ])
        ]),
        a.snapshot.can_edit ? (o(), D(y(S), {
          key: 0,
          label: "Save changes",
          loading: a.saving,
          disabled: !r.value || !!k.value || !R.value.trim(),
          onClick: U
        }, null, 8, ["loading", "disabled"])) : p("", !0)
      ]),
      e("nav", kt, [
        (o(!0), s(m, null, V(C.value, (E) => (o(), s("button", {
          id: `tab-${E}`,
          key: E,
          role: "tab",
          "aria-selected": t.value === E,
          "aria-controls": `panel-${E}`,
          onClick: (Et) => t.value = E
        }, u(E), 9, ht))), 128))
      ]),
      e("div", {
        ref_key: "body",
        ref: n,
        class: "page-body"
      }, [
        a.error ? (o(), s("p", ft, u(a.error), 1)) : p("", !0),
        k.value && a.snapshot.can_edit ? (o(), s("p", $t, u(k.value), 1)) : p("", !0),
        e("div", {
          id: `panel-${t.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${t.value}`,
          class: "panel"
        }, [
          t.value === "Fields" && a.snapshot.can_edit ? (o(), s(m, { key: 0 }, [
            e("section", Vt, [
              e("div", xt, [
                e("label", null, [
                  w[5] || (w[5] = c("Name", -1)),
                  g(y(I), {
                    modelValue: R.value,
                    "onUpdate:modelValue": w[0] || (w[0] = (E) => R.value = E)
                  }, null, 8, ["modelValue"])
                ]),
                e("label", null, [
                  w[6] || (w[6] = c("Description", -1)),
                  g(y(P), {
                    modelValue: M.value,
                    "onUpdate:modelValue": w[1] || (w[1] = (E) => M.value = E),
                    rows: "1"
                  }, null, 8, ["modelValue"])
                ])
              ])
            ]),
            g(Se, { config: x.value }, null, 8, ["config"])
          ], 64)) : p("", !0),
          t.value === "Workflow" && a.snapshot.can_edit ? (o(), D(tl, {
            key: 1,
            config: x.value
          }, null, 8, ["config"])) : p("", !0),
          t.value === "Retrieval" && a.snapshot.can_edit ? (o(), D(vl, {
            key: 2,
            config: x.value
          }, null, 8, ["config"])) : p("", !0),
          t.value === "Test" ? (o(), D(Dl, {
            key: 3,
            result: f.value.result,
            retention: a.snapshot.retention
          }, null, 8, ["result", "retention"])) : p("", !0),
          t.value === "Evals" && a.snapshot.can_edit ? (o(), D(tt, {
            key: 4,
            cases: a.snapshot.cases,
            results: f.value.evals,
            proposals: f.value.proposals,
            fields: a.snapshot.config?.fields ?? [],
            saving: a.saving,
            onAddCase: w[2] || (w[2] = (E) => i("add-case", E)),
            onDeleteCase: w[3] || (w[3] = (E) => i("delete-case", E))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : p("", !0),
          t.value === "Runs" ? (o(), D(rt, {
            key: 5,
            runs: a.snapshot.runs,
            retention: a.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, _t)
      ], 512)
    ], 512));
  }
}), Ut = {
  key: 1,
  class: "error",
  role: "alert"
}, Ct = {
  key: 2,
  class: "empty",
  role: "status"
}, St = /* @__PURE__ */ q({
  __name: "ManageRoot",
  setup(a) {
    const _ = ie(), v = O(() => _.value.entryId ?? ""), i = $(), l = $(""), n = $(!1);
    let d;
    async function t() {
      if (!v.value) {
        l.value = "No extractor selected.";
        return;
      }
      const C = v.value;
      try {
        const f = await L.get(C);
        C === v.value && (i.value = f, l.value = "");
      } catch (f) {
        l.value = f instanceof Error ? f.message : String(f);
      }
    }
    j(v, () => {
      i.value = void 0, d?.(), t(), v.value && (d = te(`component.${v.value}`, () => t()));
    }, { immediate: !0 }), le(() => d?.());
    async function x(C) {
      n.value = !0, l.value = "";
      try {
        await L.update(v.value, C), await t();
      } catch (f) {
        l.value = f instanceof Error ? f.message : String(f);
      } finally {
        n.value = !1;
      }
    }
    async function R(C) {
      n.value = !0, l.value = "";
      try {
        await L.addCase(v.value, C), await t();
      } catch (f) {
        l.value = f instanceof Error ? f.message : String(f);
      } finally {
        n.value = !1;
      }
    }
    async function M(C) {
      n.value = !0, l.value = "";
      try {
        await L.deleteCase(v.value, C), await t();
      } catch (f) {
        l.value = f instanceof Error ? f.message : String(f);
      } finally {
        n.value = !1;
      }
    }
    return (C, f) => i.value ? (o(), D(wt, {
      key: 0,
      snapshot: i.value,
      saving: n.value,
      error: l.value,
      onSave: x,
      onAddCase: R,
      onDeleteCase: M
    }, null, 8, ["snapshot", "saving", "error"])) : l.value ? (o(), s("p", Ut, u(l.value), 1)) : (o(), s("p", Ct, "Loading Docscout…"));
  }
}), X = ue(St, { type: "object", properties: { "entry-id": { type: "string", description: "Selected component id supplied by the workspace." } } });
async function qt() {
  return X;
}
ne(import.meta.url, X);
export {
  qt as webComponent
};
