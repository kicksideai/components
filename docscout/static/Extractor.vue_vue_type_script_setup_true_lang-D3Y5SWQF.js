import { defineComponent as Q, useModel as re, openBlock as s, createElementBlock as o, withModifiers as ye, createElementVNode as e, mergeModels as ge, computed as B, withKeys as Ke, unref as h, normalizeClass as L, createVNode as u, toDisplayString as i, Fragment as C, renderList as T, createCommentVNode as p, createTextVNode as k, createBlock as X, watch as ae, withDirectives as O, vModelText as K, vModelSelect as ie, ref as R, onMounted as fe, normalizeStyle as ne, onBeforeUnmount as Ee, nextTick as He, vShow as be, vModelDynamic as Ge, toRaw as qe } from "vue";
import { loadByTagName as Be, on as Xe } from "@wippy-fe/proxy";
import { i as ce, h as Re, t as pe, g as _, j as he, k as Ye, m as Te, l as De, o as Ue, p as Ze, q as _e, r as el, v as ll, w as Me, x as tl, y as de, z as al, A as nl, s as H, n as Ne, C as sl, D as ol, c as oe } from "./index-DC4KoVbP.js";
import { Icon as z } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const ze = () => ({ result: null, evals: [], proposals: [] }), il = ["aria-checked", "aria-label", "disabled"], j = /* @__PURE__ */ Q({
  __name: "Toggle",
  props: /* @__PURE__ */ ge({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const v = re(t, "modelValue");
    return (n, m) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": v.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: m[0] || (m[0] = ye((r) => v.value = !v.value, ["stop"]))
    }, [...m[1] || (m[1] = [
      e("span", null, null, -1)
    ])], 8, il));
  }
}), dl = ["aria-label"], ul = { class: "node-icon" }, rl = { class: "node-main" }, cl = { class: "node-title" }, ml = { class: "node-summary" }, vl = {
  key: 0,
  class: "chips"
}, bl = {
  key: 1,
  class: "trace-line"
}, pl = { class: "node-side" }, yl = {
  key: 0,
  class: "chip model"
}, le = /* @__PURE__ */ Q({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(t, { emit: v }) {
    const n = t, m = v, r = B(() => ce(n.config, n.stage)), $ = B(() => n.config.stages[n.stage].model), x = B({ get: () => r.value, set: (V) => {
      n.config.stages[n.stage].enabled = V;
    } }), g = B(() => {
      const V = n.config, l = V.stages;
      switch (n.stage) {
        case "map":
          return V.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...V.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((a) => ({ text: pe(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return V.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return Re(V).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), E = (V) => [`${(V.duration_ms / 1e3).toFixed(1)}s`, `${(V.input_tokens + V.output_tokens).toLocaleString()} tokens`, V.queries?.length ? `${V.queries.length} queries` : "", V.message ?? ""].filter(Boolean).join(" · ");
    return (V, l) => (s(), o("div", {
      class: L(["node", { active: t.active, off: !r.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(_)[t.stage],
      onClick: l[1] || (l[1] = (a) => m("select")),
      onKeydown: l[2] || (l[2] = Ke((a) => m("select"), ["enter"]))
    }, [
      e("span", ul, [
        u(h(z), {
          icon: h(he)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", rl, [
        e("span", cl, i(h(_)[t.stage]), 1),
        e("span", ml, i(r.value ? h(Ye)(t.stage, t.config) : "Off"), 1),
        r.value && g.value.length ? (s(), o("span", vl, [
          (s(!0), o(C, null, T(g.value, (a) => (s(), o("span", {
            key: a.text,
            class: L(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        t.trace ? (s(), o("span", bl, [
          u(h(z), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          k(i(E(t.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", pl, [
        r.value && $.value ? (s(), o("span", yl, i(h(Te)($.value)), 1)) : p("", !0),
        t.stage !== "extract" && !t.readonly ? (s(), X(j, {
          key: 1,
          modelValue: x.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => x.value = a),
          label: `Enable ${h(_)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, dl));
  }
}), gl = ["disabled"], fl = { class: "grid" }, hl = ["aria-invalid"], kl = ["value"], $l = {
  key: 0,
  class: "field-error",
  role: "alert"
}, xl = { key: 1 }, wl = ["value"], Vl = { key: 2 }, Sl = ["value"], Cl = { class: "grid" }, ql = {
  key: 3,
  class: "field-note"
}, Ul = { class: "label-block" }, Ml = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "within-label"
}, Nl = ["aria-checked"], El = ["aria-checked"], Bl = {
  key: 4,
  class: "field-error"
}, Rl = { id: "docscout-groups" }, Tl = ["value"], Dl = { key: 5 }, zl = ["placeholder"], Al = { class: "toggle-row" }, Fl = { class: "toggle-row" }, Ol = /* @__PURE__ */ Q({
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
  setup(t, { emit: v }) {
    const n = t, m = v, r = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], $ = r.filter((V) => ["text", "number", "boolean", "date", "object"].includes(V.value)), x = B(() => De(n.field, n.otherNames)), g = B(() => n.field.type !== "boolean" && n.field.type !== "enum" && !(n.field.type === "list" && n.field.item_type === "boolean"));
    ae(() => n.field.type, () => {
      !Ue(n.field) && n.field.enum_values.length && (n.field.enum_values = []);
    });
    function E(V) {
      n.field.enum_values = [...new Set(V.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (V, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", fl, [
        e("label", null, [
          l[15] || (l[15] = k("Name", -1)),
          O(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (a) => t.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!x.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, hl), [
            [
              K,
              t.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          l[16] || (l[16] = k("Type", -1)),
          O(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (a) => t.field.type = a),
            "aria-label": "Field type"
          }, [
            (s(), o(C, null, T(r, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, kl)), 64))
          ], 512), [
            [ie, t.field.type]
          ])
        ])
      ]),
      x.value ? (s(), o("p", $l, [
        u(h(z), { icon: "tabler:alert-circle" }),
        k(i(x.value), 1)
      ])) : p("", !0),
      t.field.type === "list" ? (s(), o("label", xl, [
        l[17] || (l[17] = k("Each item is", -1)),
        O(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => t.field.item_type = a)
        }, [
          (s(!0), o(C, null, T(h($), (a) => (s(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, wl))), 128))
        ], 512), [
          [ie, t.field.item_type]
        ])
      ])) : p("", !0),
      h(Ue)(t.field) ? (s(), o("label", Vl, [
        k(i(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: E
        }, null, 40, Sl),
        e("small", null, i(t.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : p("", !0),
      e("label", null, [
        l[18] || (l[18] = k("Description", -1)),
        O(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (a) => t.field.description = a),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [K, t.field.description]
        ]),
        l[19] || (l[19] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      l[35] || (l[35] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[20] || (l[20] = k("Search hints", -1)),
        O(e("textarea", {
          "onUpdate:modelValue": l[4] || (l[4] = (a) => t.field.search_hints = a),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [K, t.field.search_hints]
        ]),
        l[21] || (l[21] = e("small", null, "Each line becomes a query in Prefetch and Scout.", -1))
      ]),
      e("div", Cl, [
        e("label", null, [
          l[23] || (l[23] = k("Strategy", -1)),
          O(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (a) => t.field.strategy = a)
          }, [...l[22] || (l[22] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [ie, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[24] || (l[24] = k("Chunks to read", -1)),
          O(e("input", {
            "onUpdate:modelValue": l[6] || (l[6] = (a) => t.field.chunks = a),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              K,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[25] || (l[25] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (s(), o("p", ql, [
        u(h(z), { icon: "tabler:info-circle" }),
        l[26] || (l[26] = k("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Ul, [
        l[27] || (l[27] = e("span", { id: "within-label" }, "Search within", -1)),
        e("div", Ml, [
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": t.field.search_within === "document",
            onClick: l[7] || (l[7] = (a) => t.field.search_within = "document")
          }, "Whole document", 8, Nl),
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": t.field.search_within === "sections",
            onClick: l[8] || (l[8] = (a) => t.field.search_within = "sections")
          }, "Map's sections", 8, El)
        ]),
        e("small", null, i(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (s(), o("p", Bl, [
        u(h(z), { icon: "tabler:alert-circle" }),
        l[28] || (l[28] = k("Turn on Map the document to read sections.", -1))
      ])) : p("", !0),
      e("label", null, [
        l[29] || (l[29] = k("Group", -1)),
        O(e("input", {
          "onUpdate:modelValue": l[9] || (l[9] = (a) => t.field.group = a),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            K,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Rl, [
          (s(!0), o(C, null, T(t.groups, (a) => (s(), o("option", {
            key: a,
            value: a
          }, null, 8, Tl))), 128))
        ]),
        l[30] || (l[30] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      l[36] || (l[36] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[31] || (l[31] = k("Validation hints", -1)),
        O(e("textarea", {
          "onUpdate:modelValue": l[10] || (l[10] = (a) => t.field.validation_hints = a),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [K, t.field.validation_hints]
        ])
      ]),
      g.value ? (s(), o("label", Dl, [
        l[32] || (l[32] = k("Expected format", -1)),
        O(e("input", {
          "onUpdate:modelValue": l[11] || (l[11] = (a) => t.field.expected_format = a),
          placeholder: h(Ze)(t.field)
        }, null, 8, zl), [
          [K, t.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Al, [
        l[33] || (l[33] = e("span", null, [
          k("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        u(j, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => t.field.required = a),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Fl, [
        l[34] || (l[34] = e("span", null, [
          k("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        u(j, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[13] || (l[13] = (a) => t.field.evidence_required = a),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? p("", !0) : (s(), o("button", {
        key: 6,
        type: "button",
        class: "btn danger-text",
        onClick: l[14] || (l[14] = (a) => m("remove"))
      }, "Remove field"))
    ], 8, gl));
  }
}), Pl = ["value", "capability", "aria-labelledby"], Ll = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, jl = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, G = /* @__PURE__ */ Q({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: v }) {
    const n = v, m = R(!!customElements.get("wc-model-picker")), r = R("");
    fe(async () => {
      if (!m.value)
        try {
          await Be("wc-model-picker", { timeoutMs: 8e3 }), m.value = !0;
        } catch (x) {
          r.value = x instanceof Error ? x.message : String(x);
        }
    });
    function $(x) {
      const g = x.detail;
      typeof g == "string" && n("select", g);
    }
    return (x, g) => m.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: $
    }, null, 40, Pl)) : r.value ? (s(), o("p", Ll, "Could not load model picker: " + i(r.value), 1)) : (s(), o("span", jl, "Loading models…"));
  }
}), Il = { class: "slider" }, Wl = { class: "slider-head" }, Ql = { class: "slider-value" }, Jl = ["aria-label", "aria-valuetext", "disabled"], Kl = {
  key: 0,
  class: "slider-hints"
}, Hl = { key: 1 }, te = 1e3, W = /* @__PURE__ */ Q({
  __name: "Slider",
  props: /* @__PURE__ */ ge({
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
    const v = t, n = re(t, "modelValue"), m = B(() => v.percent ? `${Math.round(n.value * 100)}%` : `${n.value.toLocaleString()}${v.unit ? ` ${v.unit}` : ""}`), r = (g) => v.log ? Math.log(g / v.min) / Math.log(v.max / v.min) * te : (g - v.min) / (v.max - v.min) * te;
    function $(g) {
      const E = v.log ? v.min * Math.pow(v.max / v.min, g / te) : v.min + (v.max - v.min) * g / te, V = Math.round(E / v.step) * v.step;
      return Math.min(v.max, Math.max(v.min, Number(V.toFixed(4))));
    }
    const x = B({ get: () => Math.round(r(n.value)), set: (g) => {
      n.value = $(g);
    } });
    return (g, E) => (s(), o("div", Il, [
      e("div", Wl, [
        e("span", null, i(t.label), 1),
        e("output", Ql, i(m.value), 1)
      ]),
      O(e("input", {
        "onUpdate:modelValue": E[0] || (E[0] = (V) => x.value = V),
        type: "range",
        min: "0",
        max: te,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": m.value,
        disabled: t.disabled,
        style: ne({ "--fill": `${x.value / te * 100}%` })
      }, null, 12, Jl), [
        [
          K,
          x.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (s(), o("div", Kl, [
        e("span", null, i(t.hints[0]), 1),
        e("span", null, i(t.hints[1]), 1)
      ])) : p("", !0),
      t.note ? (s(), o("small", Hl, i(t.note), 1)) : p("", !0)
    ]));
  }
}), Gl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Xl = { class: "fd-track" }, Yl = { class: "fd-node" }, Zl = { class: "fd-dots" }, _l = { class: "fd-more" }, et = { class: "fd-node goal" }, lt = /* @__PURE__ */ Q({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const v = t;
    return (n, m) => (s(), o("figure", Gl, [
      e("div", Xl, [
        m[2] || (m[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (s(!0), o(C, null, T(Math.min(v.rounds, 8), (r) => (s(), o(C, { key: r }, [
          m[0] || (m[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Yl, [
            e("span", null, "R" + i(r), 1),
            e("span", Zl, [
              (s(!0), o(C, null, T(Math.min(v.extra, 6), ($) => (s(), o("i", { key: $ }))), 128))
            ])
          ])
        ], 64))), 128)),
        v.rounds > 8 ? (s(), o(C, { key: 0 }, [
          m[1] || (m[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", _l, "+" + i(v.rounds - 8), 1)
        ], 64)) : p("", !0),
        m[3] || (m[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", et, "≥ " + i(Math.round(v.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, i(v.rounds ? `One pass, then up to ${v.rounds} rounds with up to ${v.extra} new queries each, stopping as soon as confidence reaches ${Math.round(v.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), tt = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, at = { class: "fd-grid" }, nt = { class: "fd-node solid" }, st = { class: "fd-node" }, ot = { class: "fd-node" }, it = { class: "fd-node goal" }, dt = /* @__PURE__ */ Q({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const v = t, n = B(() => Math.min(v.queries * v.perQuery, v.cap));
    return (m, r) => (s(), o("figure", tt, [
      e("div", at, [
        e("span", nt, [
          e("b", null, i(t.fields), 1),
          k(" field" + i(t.fields === 1 ? "" : "s"), 1),
          e("small", null, i(t.parallel) + " at a time", 1)
        ]),
        e("span", st, [
          e("b", null, i(t.queries), 1),
          r[0] || (r[0] = k(" queries", -1)),
          r[1] || (r[1] = e("small", null, "per field", -1))
        ]),
        e("span", ot, [
          e("b", null, i(t.perQuery), 1),
          r[2] || (r[2] = k(" chunks", -1)),
          r[3] || (r[3] = e("small", null, "per query", -1))
        ]),
        e("span", it, [
          e("b", null, i(n.value), 1),
          r[4] || (r[4] = k(" chunks", -1)),
          e("small", null, i(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(n.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), ut = ["disabled"], rt = { class: "muted" }, ct = { class: "toggle-row" }, mt = { class: "label-block" }, vt = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "outline-label"
}, bt = ["aria-checked"], pt = ["aria-checked"], yt = { class: "toggle-row" }, gt = {
  id: "model-map",
  class: "model-role"
}, ft = {
  key: 0,
  class: "chips"
}, ht = {
  key: 1,
  class: "muted"
}, kt = { class: "toggle-row" }, $t = { class: "grid" }, xt = ["onUpdate:modelValue"], wt = ["onUpdate:modelValue"], Vt = ["onUpdate:modelValue"], St = ["onClick"], Ct = {
  key: 0,
  class: "muted"
}, qt = { class: "toggle-row" }, Ut = { class: "label-block" }, Mt = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, Nt = ["aria-checked"], Et = ["aria-checked"], Bt = {
  id: "model-scout",
  class: "model-role"
}, Rt = { class: "toggle-row" }, Tt = { class: "toggle-row" }, Dt = { class: "mono" }, zt = { class: "toggle-row" }, At = { class: "label-block" }, Ft = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "read-label"
}, Ot = ["aria-checked"], Pt = ["aria-checked"], Lt = {
  id: "model-deep",
  class: "model-role"
}, jt = {
  id: "model-deep-query",
  class: "model-role"
}, It = {
  id: "model-extract",
  class: "model-role"
}, Wt = { class: "output-list" }, Qt = { class: "chip" }, Jt = {
  key: 0,
  class: "muted"
}, Kt = { class: "toggle-row" }, Ht = { class: "toggle-row" }, Gt = { class: "toggle-row" }, Xt = { class: "toggle-row" }, Yt = {
  id: "model-verify",
  class: "model-role"
}, Zt = /* @__PURE__ */ Q({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const v = t, n = B(() => v.config.stages), m = (V) => tl(v.stage, V), r = _e(), $ = B(() => v.config.fields.filter((V) => V.strategy === "deep").length), x = B(() => v.config.fields.filter((V) => V.search_within === "sections").map((V) => V.name || "New field")), g = B(() => Re(v.config));
    function E(V, l) {
      const a = n.value.scout.tools.filter((S) => S !== V);
      n.value.scout.tools = l ? [...a, V] : a;
    }
    return (V, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", rt, i(h(el)[t.stage]), 1),
      t.stage === "map" ? (s(), o(C, { key: 0 }, [
        e("div", ct, [
          l[37] || (l[37] = e("span", null, "Stage enabled", -1)),
          u(j, {
            modelValue: n.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (a) => n.value.map.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", mt, [
          l[38] || (l[38] = e("span", { id: "outline-label" }, "Outline", -1)),
          e("div", vt, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.map.outline === "find_or_build",
              onClick: l[1] || (l[1] = (a) => n.value.map.outline = "find_or_build")
            }, "Use contents first", 8, bt),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.map.outline === "build",
              onClick: l[2] || (l[2] = (a) => n.value.map.outline = "build")
            }, "Always build", 8, pt)
          ]),
          l[39] || (l[39] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", yt, [
          l[40] || (l[40] = e("span", null, [
            k("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          u(j, {
            modelValue: n.value.map.section_summaries,
            "onUpdate:modelValue": l[3] || (l[3] = (a) => n.value.map.section_summaries = a),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[42] || (l[42] = e("h4", null, "Models", -1)),
        e("div", gt, [
          l[41] || (l[41] = e("span", null, "Outliner", -1)),
          u(G, {
            value: n.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[4] || (l[4] = (a) => n.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        l[43] || (l[43] = e("h4", null, "Fields that read sections", -1)),
        x.value.length ? (s(), o("p", ft, [
          (s(!0), o(C, null, T(x.value, (a) => (s(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (s(), o("p", ht, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      t.stage === "prefetch" ? (s(), o(C, { key: 1 }, [
        e("div", kt, [
          l[44] || (l[44] = e("span", null, "Stage enabled", -1)),
          u(j, {
            modelValue: n.value.prefetch.enabled,
            "onUpdate:modelValue": l[5] || (l[5] = (a) => n.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[48] || (l[48] = e("h4", null, "Queries", -1)),
        (s(!0), o(C, null, T(n.value.prefetch.queries, (a, S) => (s(), o("div", {
          key: S,
          class: "query-row"
        }, [
          e("div", $t, [
            e("label", null, [
              l[45] || (l[45] = k("Name", -1)),
              O(e("input", {
                "onUpdate:modelValue": (f) => a.name = f,
                placeholder: "Parties"
              }, null, 8, xt), [
                [K, a.name]
              ])
            ]),
            e("label", null, [
              l[46] || (l[46] = k("Chunks", -1)),
              O(e("input", {
                "onUpdate:modelValue": (f) => a.chunks = f,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, wt), [
                [
                  K,
                  a.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[47] || (l[47] = k("Query", -1)),
            O(e("textarea", {
              "onUpdate:modelValue": (f) => a.query = f,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Vt), [
              [K, a.query]
            ])
          ]),
          t.readonly ? p("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (f) => n.value.prefetch.queries.splice(S, 1)
          }, "Remove query", 8, St))
        ]))), 128)),
        n.value.prefetch.queries.length ? p("", !0) : (s(), o("p", Ct, "No fixed queries. Field search hints still run.")),
        t.readonly ? p("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[6] || (l[6] = (a) => n.value.prefetch.queries.push(h(ll)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      t.stage === "scout" ? (s(), o(C, { key: 2 }, [
        e("div", qt, [
          l[49] || (l[49] = e("span", null, "Stage enabled", -1)),
          u(j, {
            modelValue: n.value.scout.enabled,
            "onUpdate:modelValue": l[7] || (l[7] = (a) => n.value.scout.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ut, [
          l[50] || (l[50] = e("span", { id: "mode-label" }, "Mode", -1)),
          e("div", Mt, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.scout.mode === "loop",
              onClick: l[8] || (l[8] = (a) => n.value.scout.mode = "loop")
            }, "Structured loop", 8, Nt),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.scout.mode === "agent",
              onClick: l[9] || (l[9] = (a) => n.value.scout.mode = "agent")
            }, "Agent", 8, Et)
          ]),
          e("small", null, i(n.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        u(lt, {
          rounds: n.value.scout.max_rounds,
          confidence: n.value.scout.target_confidence,
          extra: n.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"]),
        l[55] || (l[55] = e("h4", null, "Models", -1)),
        e("div", Bt, [
          l[51] || (l[51] = e("span", null, "Scout", -1)),
          u(G, {
            value: n.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[10] || (l[10] = (a) => n.value.scout.model = a)
          }, null, 8, ["value"])
        ]),
        l[56] || (l[56] = e("h4", null, "Loop", -1)),
        u(W, {
          modelValue: n.value.scout.max_rounds,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => n.value.scout.max_rounds = a),
          label: "Follow-up rounds",
          min: m("max_rounds").min,
          max: m("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.scout.target_confidence,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => n.value.scout.target_confidence = a),
          label: "Stop at confidence",
          min: m("target_confidence").min,
          max: m("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[13] || (l[13] = (a) => n.value.scout.max_extra_queries = a),
          label: n.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: m("max_extra_queries").min,
          max: m("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.scout.max_tokens,
          "onUpdate:modelValue": l[14] || (l[14] = (a) => n.value.scout.max_tokens = a),
          label: "Scout output limit",
          min: m("max_tokens").min,
          max: m("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Rt, [
          l[52] || (l[52] = e("span", null, [
            k("Drop noisy chunks"),
            e("small", null, "Chunks the scout judges irrelevant leave the evidence pool.")
          ], -1)),
          u(j, {
            modelValue: n.value.scout.drop_noise,
            "onUpdate:modelValue": l[15] || (l[15] = (a) => n.value.scout.drop_noise = a),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Tt, [
          l[53] || (l[53] = e("span", null, [
            k("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          u(j, {
            modelValue: n.value.scout.share_notes,
            "onUpdate:modelValue": l[16] || (l[16] = (a) => n.value.scout.share_notes = a),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.scout.mode === "agent" ? (s(), o(C, { key: 0 }, [
          l[54] || (l[54] = e("h4", null, "Agent tools", -1)),
          (s(!0), o(C, null, T(h(r), (a) => (s(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, [
              k(i(h(pe)(a)), 1),
              e("small", Dt, i(a), 1)
            ]),
            u(j, {
              "model-value": n.value.scout.tools.includes(a),
              label: h(pe)(a),
              disabled: t.readonly,
              "onUpdate:modelValue": (S) => E(a, S)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      t.stage === "deep" ? (s(), o(C, { key: 3 }, [
        e("div", zt, [
          l[57] || (l[57] = e("span", null, "Stage enabled", -1)),
          u(j, {
            modelValue: n.value.deep.enabled,
            "onUpdate:modelValue": l[17] || (l[17] = (a) => n.value.deep.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        u(dt, {
          fields: $.value,
          parallel: n.value.deep.parallel_fields,
          queries: n.value.deep.max_queries,
          "per-query": n.value.deep.chunks_per_query,
          cap: n.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", At, [
          l[58] || (l[58] = e("span", { id: "read-label" }, "Reads", -1)),
          e("div", Ft, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.deep.read === "chunks",
              onClick: l[18] || (l[18] = (a) => n.value.deep.read = "chunks")
            }, "Retrieved chunks", 8, Ot),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.deep.read === "sections",
              onClick: l[19] || (l[19] = (a) => n.value.deep.read = "sections")
            }, "Whole sections", 8, Pt)
          ]),
          l[59] || (l[59] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[62] || (l[62] = e("h4", null, "Models", -1)),
        e("div", Lt, [
          l[60] || (l[60] = e("span", null, "Analysis", -1)),
          u(G, {
            value: n.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[20] || (l[20] = (a) => n.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", jt, [
          l[61] || (l[61] = e("span", null, "Query writer", -1)),
          u(G, {
            value: n.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[21] || (l[21] = (a) => n.value.deep.query_model = a)
          }, null, 8, ["value"])
        ]),
        l[63] || (l[63] = e("h4", null, "Reach", -1)),
        u(W, {
          modelValue: n.value.deep.parallel_fields,
          "onUpdate:modelValue": l[22] || (l[22] = (a) => n.value.deep.parallel_fields = a),
          label: "Fields at a time",
          min: m("parallel_fields").min,
          max: m("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.deep.max_queries,
          "onUpdate:modelValue": l[23] || (l[23] = (a) => n.value.deep.max_queries = a),
          label: "Queries per field",
          min: m("max_queries").min,
          max: m("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[24] || (l[24] = (a) => n.value.deep.chunks_per_query = a),
          label: "Chunks per query",
          min: m("chunks_per_query").min,
          max: m("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.deep.chunk_cap,
          "onUpdate:modelValue": l[25] || (l[25] = (a) => n.value.deep.chunk_cap = a),
          label: "Chunk cap per field",
          min: m("chunk_cap").min,
          max: m("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.deep.min_similarity,
          "onUpdate:modelValue": l[26] || (l[26] = (a) => n.value.deep.min_similarity = a),
          label: "Minimum similarity",
          min: m("min_similarity").min,
          max: m("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[64] || (l[64] = e("h4", null, "Temperature", -1)),
        u(W, {
          modelValue: n.value.deep.query_temperature,
          "onUpdate:modelValue": l[27] || (l[27] = (a) => n.value.deep.query_temperature = a),
          label: "Query writing",
          min: m("query_temperature").min,
          max: m("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        u(W, {
          modelValue: n.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[28] || (l[28] = (a) => n.value.deep.analysis_temperature = a),
          label: "Analysis",
          min: m("analysis_temperature").min,
          max: m("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : p("", !0),
      t.stage === "extract" ? (s(), o(C, { key: 4 }, [
        l[67] || (l[67] = e("h4", null, "Models", -1)),
        e("div", It, [
          l[65] || (l[65] = e("span", null, "Extraction", -1)),
          u(G, {
            value: n.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[29] || (l[29] = (a) => n.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        l[68] || (l[68] = e("h4", null, "Field groups", -1)),
        e("ul", Wt, [
          (s(!0), o(C, null, T(g.value, (a) => (s(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Qt, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        g.value.length ? p("", !0) : (s(), o("p", Jt, "No fields yet.")),
        u(W, {
          modelValue: n.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[30] || (l[30] = (a) => n.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: m("max_fields_per_call").min,
          max: m("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${h(Me)(t.config)} extraction call${h(Me)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        u(W, {
          modelValue: n.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[31] || (l[31] = (a) => n.value.extract.max_output_tokens = a),
          label: "Output limit",
          min: m("max_output_tokens").min,
          max: m("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Kt, [
          l[66] || (l[66] = e("span", null, [
            k("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          u(j, {
            modelValue: n.value.extract.structured_output,
            "onUpdate:modelValue": l[32] || (l[32] = (a) => n.value.extract.structured_output = a),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : p("", !0),
      t.stage === "verify" ? (s(), o(C, { key: 5 }, [
        e("div", Ht, [
          l[69] || (l[69] = e("span", null, "Stage enabled", -1)),
          u(j, {
            modelValue: n.value.verify.enabled,
            "onUpdate:modelValue": l[33] || (l[33] = (a) => n.value.verify.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Gt, [
          l[70] || (l[70] = e("span", null, [
            k("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          u(j, {
            modelValue: n.value.verify.check_quotes,
            "onUpdate:modelValue": l[34] || (l[34] = (a) => n.value.verify.check_quotes = a),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Xt, [
          l[71] || (l[71] = e("span", null, [
            k("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          u(j, {
            modelValue: n.value.verify.check_support,
            "onUpdate:modelValue": l[35] || (l[35] = (a) => n.value.verify.check_support = a),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.verify.check_support ? (s(), o(C, { key: 0 }, [
          l[73] || (l[73] = e("h4", null, "Models", -1)),
          e("div", Yt, [
            l[72] || (l[72] = e("span", null, "Checker", -1)),
            u(G, {
              value: n.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[36] || (l[36] = (a) => n.value.verify.model = a)
            }, null, 8, ["value"])
          ])
        ], 64)) : p("", !0)
      ], 64)) : p("", !0)
    ], 8, ut));
  }
}), _t = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, ea = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, la = ["x", "y", "width"], ta = ["x", "width"], aa = /* @__PURE__ */ Q({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const v = t, n = B(() => Math.min(0.9, Math.max(0, v.overlap / v.size))), m = B(() => {
      const r = 100 / (3 - 2 * n.value);
      return [0, 1, 2].map(($) => ({ x: $ * r * (1 - n.value), w: r }));
    });
    return (r, $) => (s(), o("figure", _t, [
      (s(), o("svg", ea, [
        (s(!0), o(C, null, T(m.value, (x, g) => (s(), o("rect", {
          key: g,
          x: x.x,
          y: g % 2 ? 14 : 4,
          width: x.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, la))), 128)),
        (s(), o(C, null, T([1, 2], (x) => e("rect", {
          key: "o" + x,
          x: m.value[x].x,
          y: 4,
          width: m.value[x - 1].x + m.value[x - 1].w - m.value[x].x,
          height: "24",
          class: "shared"
        }, null, 8, ta)), 64))
      ])),
      e("figcaption", null, i(t.size.toLocaleString()) + " tokens per chunk · " + i(t.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(n.value * 100)) + "%)", 1)
    ]));
  }
}), na = ["disabled"], sa = { class: "muted" }, oa = { class: "toggle-row" }, ia = { class: "toggle-row" }, da = { class: "label-block" }, ua = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "context-label"
}, ra = ["aria-checked", "onClick"], ca = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, ma = { class: "label-block" }, va = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, ba = ["aria-checked", "onClick"], pa = {
  id: "embedding-model",
  class: "model-role"
}, ya = { class: "toggle-row" }, ga = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, fa = /* @__PURE__ */ Q({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const v = t, n = B(() => v.config.retrieval), m = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], r = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per chunk, cached with the processed document." }], $ = de("chunk_size"), x = de("overlap"), g = de("top_results"), E = de("section_budget"), V = B(() => Math.min(x.max, n.value.chunk_size - 50));
    return (l, a) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", sa, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(t.retention) + ".", 1),
      a[18] || (a[18] = e("h4", null, "Chunks", -1)),
      u(aa, {
        size: n.value.chunk_size,
        overlap: n.value.overlap
      }, null, 8, ["size", "overlap"]),
      u(W, {
        modelValue: n.value.chunk_size,
        "onUpdate:modelValue": a[0] || (a[0] = (S) => n.value.chunk_size = S),
        label: "Chunk size",
        min: h($).min,
        max: h($).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      u(W, {
        modelValue: n.value.overlap,
        "onUpdate:modelValue": a[1] || (a[1] = (S) => n.value.overlap = S),
        label: "Overlap",
        min: h(x).min,
        max: V.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", oa, [
        a[10] || (a[10] = e("span", null, [
          k("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        u(j, {
          modelValue: n.value.split_headings,
          "onUpdate:modelValue": a[2] || (a[2] = (S) => n.value.split_headings = S),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", ia, [
        a[11] || (a[11] = e("span", null, [
          k("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        u(j, {
          modelValue: n.value.keep_tables,
          "onUpdate:modelValue": a[3] || (a[3] = (S) => n.value.keep_tables = S),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      u(W, {
        modelValue: n.value.section_budget,
        "onUpdate:modelValue": a[4] || (a[4] = (S) => n.value.section_budget = S),
        label: "Section budget",
        min: h(E).min,
        max: h(E).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      a[19] || (a[19] = e("h4", null, "Context", -1)),
      e("div", da, [
        a[12] || (a[12] = e("span", { id: "context-label" }, "Chunk context", -1)),
        e("div", ua, [
          (s(), o(C, null, T(r, (S) => e("button", {
            key: S.value,
            type: "button",
            role: "radio",
            "aria-checked": n.value.context === S.value,
            onClick: (f) => n.value.context = S.value
          }, i(S.label), 9, ra)), 64))
        ]),
        e("small", null, i(r.find((S) => S.value === n.value.context)?.note), 1)
      ]),
      n.value.context === "generated" ? (s(), o("div", ca, [
        a[13] || (a[13] = e("span", null, "Context writer", -1)),
        u(G, {
          value: n.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: a[5] || (a[5] = (S) => n.value.context_model = S)
        }, null, 8, ["value"])
      ])) : p("", !0),
      a[20] || (a[20] = e("h4", null, "Search", -1)),
      e("div", ma, [
        a[14] || (a[14] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", va, [
          (s(), o(C, null, T(m, (S) => e("button", {
            key: S.value,
            type: "button",
            role: "radio",
            "aria-checked": n.value.search_mode === S.value,
            onClick: (f) => n.value.search_mode = S.value
          }, i(S.label), 9, ba)), 64))
        ]),
        e("small", null, i(m.find((S) => S.value === n.value.search_mode)?.note), 1)
      ]),
      u(W, {
        modelValue: n.value.top_results,
        "onUpdate:modelValue": a[6] || (a[6] = (S) => n.value.top_results = S),
        label: "Results per query",
        min: h(g).min,
        max: h(g).max,
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      a[21] || (a[21] = e("h4", null, "Models", -1)),
      e("div", pa, [
        a[15] || (a[15] = e("span", null, "Embedding", -1)),
        u(G, {
          value: n.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: a[7] || (a[7] = (S) => n.value.embedding_model = S)
        }, null, 8, ["value"])
      ]),
      e("div", ya, [
        a[16] || (a[16] = e("span", null, [
          k("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        u(j, {
          modelValue: n.value.highlighter,
          "onUpdate:modelValue": a[8] || (a[8] = (S) => n.value.highlighter = S),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      n.value.highlighter ? (s(), o("div", ga, [
        a[17] || (a[17] = e("span", null, "Highlighter", -1)),
        u(G, {
          value: n.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: a[9] || (a[9] = (S) => n.value.highlighter_model = S)
        }, null, 8, ["value"])
      ])) : p("", !0)
    ], 8, na));
  }
}), ha = { class: "canvas" }, ka = { class: "canvas-inner" }, $a = {
  class: "block",
  "aria-labelledby": "fields-head"
}, xa = { class: "block-head" }, wa = ["aria-expanded"], Va = { class: "count" }, Sa = {
  key: 0,
  class: "block-peek"
}, Ca = {
  id: "fields-body",
  class: "block-body"
}, qa = {
  key: 0,
  class: "block-empty"
}, Ua = {
  key: 1,
  class: "rows"
}, Ma = ["onClick"], Na = { class: "row-name" }, Ea = {
  key: 0,
  class: "req",
  title: "Required"
}, Ba = { class: "chips" }, Ra = {
  key: 1,
  class: "chip"
}, Ta = ["title"], Da = { class: "chip" }, za = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Aa = {
  key: 0,
  class: "row-actions"
}, Fa = ["disabled", "onClick"], Oa = ["disabled", "onClick"], Pa = {
  class: "block",
  "aria-labelledby": "flow-head"
}, La = { class: "block-head" }, ja = ["aria-expanded"], Ia = { class: "count" }, Wa = {
  key: 0,
  class: "block-peek"
}, Qa = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Ja = { class: "node-icon" }, Ka = { class: "node-main" }, Ha = { class: "node-summary" }, Ga = { class: "node-side" }, Xa = { class: "chip model" }, Ya = { class: "branches" }, Za = { class: "branch" }, _a = { class: "branch" }, en = { class: "node-icon" }, ln = { class: "node-main" }, tn = { class: "node-summary" }, an = ["aria-valuenow"], nn = { class: "side-panel-head" }, sn = { class: "side-panel-icon" }, on = ["disabled"], dn = {
  key: 4,
  class: "inspector-form"
}, un = { class: "output-list" }, rn = { class: "mono" }, cn = { class: "chip" }, mn = { class: "rail-label" }, ve = 400, ue = 320, vn = /* @__PURE__ */ Q({
  __name: "Builder",
  props: /* @__PURE__ */ ge({
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
    const v = t, n = re(t, "title"), m = re(t, "description"), r = R({ kind: "document" });
    function $(b, d) {
      try {
        const U = localStorage.getItem(`docscout.${b}`);
        return U === null ? d : U === "1";
      } catch {
        return d;
      }
    }
    function x(b, d) {
      try {
        localStorage.setItem(`docscout.${b}`, d ? "1" : "0");
      } catch {
      }
    }
    const g = R($("panel", !0)), E = R($("fields", !0)), V = R($("flow", !0));
    function l() {
      try {
        const b = Number(localStorage.getItem("docscout.panelWidth"));
        return b >= ue ? b : ve;
      } catch {
        return ve;
      }
    }
    const a = R(l()), S = () => {
      const b = A.value?.clientWidth;
      return b ? Math.max(ue, b - 420) : Number.POSITIVE_INFINITY;
    };
    function f(b, d = !0) {
      if (a.value = Math.round(Math.min(S(), Math.max(ue, b))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const N = R(!1);
    function w(b) {
      const d = b.currentTarget, U = b.clientX, J = a.value;
      d.setPointerCapture(b.pointerId), N.value = !0;
      const Z = (Je) => f(J + (U - Je.clientX), !1), Ce = () => {
        N.value = !1, f(a.value), d.removeEventListener("pointermove", Z), d.removeEventListener("pointerup", Ce);
      };
      d.addEventListener("pointermove", Z), d.addEventListener("pointerup", Ce);
    }
    function D(b) {
      b.key === "ArrowLeft" ? (f(a.value + 24), b.preventDefault()) : b.key === "ArrowRight" && (f(a.value - 24), b.preventDefault());
    }
    function M(b) {
      g.value = b, I.value || x("panel", b);
    }
    function F(b) {
      const d = b === "fields" ? E : V;
      d.value = !d.value, x(b, d.value);
    }
    const A = R(), I = R(!1);
    let Y;
    fe(() => {
      Y = new ResizeObserver(([b]) => {
        const d = I.value;
        I.value = b.contentRect.width < 1e3, I.value && !d && (g.value = !1), !I.value && d && (g.value = $("panel", !0));
      }), A.value && Y.observe(A.value);
    }), Ee(() => Y?.disconnect());
    const se = R();
    ae(r, async () => {
      await He(), se.value && (se.value.scrollTop = 0);
    });
    function q(b) {
      r.value = b, g.value = !0;
    }
    const y = (b) => JSON.stringify(b) === JSON.stringify(r.value), c = B(() => r.value.kind === "field" ? v.config.fields[r.value.index] : void 0), P = B(() => {
      const b = r.value;
      return b.kind === "stage" ? _[b.stage] : b.kind === "field" ? c.value?.name || "New field" : b.kind === "document" ? "Read document" : b.kind === "output" ? "Output" : "Details";
    }), Fe = B(() => {
      const b = r.value;
      return b.kind === "stage" ? he[b.stage] : b.kind === "field" ? "tabler:forms" : b.kind === "document" ? "tabler:file-text" : b.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Oe = B(() => v.config.fields.filter((b, d) => !(r.value.kind === "field" && r.value.index === d)).map((b) => b.name)), me = B(() => v.config.stages.deep.enabled), ke = B(() => v.config.stages.map.enabled), Pe = B(() => [...new Set(v.config.fields.map((b) => b.group.trim()).filter(Boolean))]), $e = (b) => De(v.config.fields[b], v.config.fields.filter((d, U) => U !== b).map((d) => d.name)), xe = ["map", "prefetch", "scout", "deep", "extract", "verify"], Le = B(() => xe.filter((b) => ce(v.config, b)).map((b) => _[b]).join(" · ")), je = B(() => v.config.fields.map((b) => b.name || "New field").join(", ")), Ie = B(() => xe.filter((b) => ce(v.config, b)).length), ee = (b) => v.result?.trace.find((d) => d.kind === b);
    function We() {
      v.config.fields.push(nl()), E.value = !0, q({ kind: "field", index: v.config.fields.length - 1 });
    }
    function Qe(b) {
      v.config.fields.splice(b, 1), r.value = { kind: "document" };
    }
    function we(b, d) {
      const U = v.config.fields, J = b + d;
      if (J < 0 || J >= U.length) return;
      const [Z] = U.splice(b, 1);
      U.splice(J, 0, Z), r.value = { kind: "field", index: J };
    }
    const Ve = (b) => b.type === "list" ? `list of ${b.item_type}` : b.type, Se = B({ get: () => v.config.tags.join(", "), set: (b) => {
      v.config.tags = [...new Set(b.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (b, d) => (s(), o("div", {
      ref_key: "root",
      ref: A,
      class: L(["builder", { narrow: I.value, "panel-open": g.value, resizing: N.value }])
    }, [
      e("div", ha, [
        e("div", ka, [
          e("section", $a, [
            e("header", xa, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": E.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (U) => F("fields"))
              }, [
                u(h(z), {
                  icon: E.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", Va, i(t.config.fields.length), 1)
              ], 8, wa),
              !E.value && t.config.fields.length ? (s(), o("span", Sa, i(je.value), 1)) : p("", !0),
              t.readonly ? p("", !0) : (s(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: We
              }, [
                u(h(z), { icon: "tabler:plus" }),
                d[20] || (d[20] = k("Add field", -1))
              ]))
            ]),
            O(e("div", Ca, [
              t.config.fields.length ? (s(), o("ul", Ua, [
                (s(!0), o(C, null, T(t.config.fields, (U, J) => (s(), o("li", {
                  key: J,
                  class: L(["row-item", { active: y({ kind: "field", index: J }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (Z) => q({ kind: "field", index: J })
                  }, [
                    e("span", Na, [
                      k(i(U.name || "New field"), 1),
                      U.required ? (s(), o("span", Ea, "*")) : p("", !0),
                      $e(J) ? (s(), X(h(z), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: $e(J)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: L(["row-desc", { missing: !U.description }])
                    }, i(U.description || "No description"), 3),
                    e("span", Ba, [
                      U.search_within === "sections" ? (s(), o("span", {
                        key: 0,
                        class: L(["chip", ke.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      U.group.trim() ? (s(), o("span", Ra, i(U.group), 1)) : p("", !0),
                      U.strategy === "deep" ? (s(), o("span", {
                        key: 2,
                        class: L(["chip", me.value ? "primary" : "muted-chip"]),
                        title: me.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, Ta)) : p("", !0),
                      e("span", Da, i(Ve(U)), 1),
                      U.evidence_required ? (s(), o("span", za, [
                        u(h(z), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, Ma),
                  t.readonly ? p("", !0) : (s(), o("span", Aa, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: J === 0,
                      onClick: (Z) => we(J, -1)
                    }, [
                      u(h(z), { icon: "tabler:chevron-up" })
                    ], 8, Fa),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: J === t.config.fields.length - 1,
                      onClick: (Z) => we(J, 1)
                    }, [
                      u(h(z), { icon: "tabler:chevron-down" })
                    ], 8, Oa)
                  ]))
                ], 2))), 128))
              ])) : (s(), o("p", qa, "Add the values to pull from each document."))
            ], 512), [
              [be, E.value]
            ])
          ]),
          e("section", Pa, [
            e("header", La, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": V.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (U) => F("flow"))
              }, [
                u(h(z), {
                  icon: V.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Ia, i(Ie.value) + " of 6", 1)
              ], 8, ja),
              V.value ? p("", !0) : (s(), o("span", Wa, i(Le.value), 1)),
              e("button", {
                type: "button",
                class: L(["btn small subtle push", { on: y({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (U) => q({ kind: "details" }))
              }, [
                u(h(z), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = k("Details", -1))
              ], 2)
            ]),
            O(e("div", Qa, [
              e("button", {
                type: "button",
                class: L(["node fixed", { active: y({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (U) => q({ kind: "document" }))
              }, [
                e("span", Ja, [
                  u(h(z), { icon: "tabler:file-text" })
                ]),
                e("span", Ka, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", Ha, i(h(al)(t.config.retrieval)), 1)
                ]),
                e("span", Ga, [
                  e("span", Xa, i(h(Te)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              u(le, {
                stage: "map",
                config: t.config,
                active: y({ kind: "stage", stage: "map" }),
                trace: ee("map"),
                readonly: t.readonly,
                onSelect: d[4] || (d[4] = (U) => q({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[29] || (d[29] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", Ya, [
                e("div", Za, [
                  d[24] || (d[24] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  u(le, {
                    stage: "prefetch",
                    config: t.config,
                    active: y({ kind: "stage", stage: "prefetch" }),
                    trace: ee("prefetch"),
                    readonly: t.readonly,
                    onSelect: d[5] || (d[5] = (U) => q({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  u(le, {
                    stage: "scout",
                    config: t.config,
                    active: y({ kind: "stage", stage: "scout" }),
                    trace: ee("scout"),
                    readonly: t.readonly,
                    onSelect: d[6] || (d[6] = (U) => q({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", _a, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  u(le, {
                    stage: "deep",
                    config: t.config,
                    active: y({ kind: "stage", stage: "deep" }),
                    trace: ee("deep"),
                    readonly: t.readonly,
                    onSelect: d[7] || (d[7] = (U) => q({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              d[30] || (d[30] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              u(le, {
                stage: "extract",
                config: t.config,
                active: y({ kind: "stage", stage: "extract" }),
                trace: ee("extract"),
                readonly: t.readonly,
                onSelect: d[8] || (d[8] = (U) => q({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              u(le, {
                stage: "verify",
                config: t.config,
                active: y({ kind: "stage", stage: "verify" }),
                trace: ee("verify"),
                readonly: t.readonly,
                onSelect: d[9] || (d[9] = (U) => q({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: L(["node fixed", { active: y({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (U) => q({ kind: "output" }))
              }, [
                e("span", en, [
                  u(h(z), { icon: "tabler:braces" })
                ]),
                e("span", ln, [
                  d[27] || (d[27] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", tn, i(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [be, V.value]
            ])
          ])
        ])
      ]),
      I.value && g.value ? (s(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (U) => M(!1))
      })) : p("", !0),
      g.value ? (s(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: ne(I.value ? void 0 : { width: `${a.value}px` })
      }, [
        I.value ? p("", !0) : (s(), o("div", {
          key: 0,
          class: L(["resizer", { active: N.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": ue,
          onPointerdown: ye(w, ["prevent"]),
          onKeydown: D,
          onDblclick: d[12] || (d[12] = (U) => f(ve))
        }, null, 42, an)),
        e("header", nn, [
          e("span", sn, [
            u(h(z), { icon: Fe.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(P.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (U) => M(!1))
          }, [
            u(h(z), {
              icon: I.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: se,
          class: "side-panel-body"
        }, [
          r.value.kind === "document" ? (s(), X(fa, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : r.value.kind === "stage" ? (s(), X(Zt, {
            key: 1,
            stage: r.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : r.value.kind === "field" && c.value ? (s(), X(Ol, {
            key: 2,
            field: c.value,
            "other-names": Oe.value,
            groups: Pe.value,
            "deep-enabled": me.value,
            "map-enabled": ke.value,
            readonly: t.readonly,
            onRemove: d[14] || (d[14] = (U) => Qe(r.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : r.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = k("Name", -1)),
              O(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (U) => n.value = U),
                "aria-label": "Extractor name"
              }, null, 512), [
                [K, n.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = k("Description", -1)),
              O(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (U) => m.value = U),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [K, m.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = k("Tags", -1)),
              O(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (U) => Se.value = U),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  K,
                  Se.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, on)) : r.value.kind === "output" ? (s(), o("div", dn, [
            d[37] || (d[37] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", un, [
              (s(!0), o(C, null, T(t.config.fields, (U) => (s(), o("li", {
                key: U.name
              }, [
                e("span", rn, i(U.name || "New field"), 1),
                e("span", cn, i(Ve(U)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 4)) : I.value ? p("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (U) => M(!0))
      }, [
        u(h(z), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", mn, i(P.value), 1)
      ]))
    ], 2));
  }
}), bn = ["selected"], pn = {
  key: 1,
  role: "alert"
}, yn = {
  key: 2,
  class: "muted"
}, Ae = /* @__PURE__ */ Q({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: v }) {
    const n = v, m = R(!1), r = R("");
    fe(async () => {
      try {
        await Be("wc-multiselect", { timeoutMs: 8e3 }), m.value = !0;
      } catch (x) {
        r.value = String(x);
      }
    });
    function $(x) {
      const g = x.detail;
      n("select", g.selected[0] || "", g.labels?.[0] || "");
    }
    return (x, g) => m.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: $
    }, null, 40, bn)) : r.value ? (s(), o("p", pn, i(r.value), 1)) : (s(), o("span", yn, "Loading uploads…"));
  }
}), gn = { class: "test" }, fn = { class: "run-bar" }, hn = { class: "run-input" }, kn = { class: "muted run-note" }, $n = {
  key: 0,
  class: "empty"
}, xn = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, wn = {
  key: 2,
  class: "test-grid"
}, Vn = { class: "block" }, Sn = { class: "block-head" }, Cn = { class: "muted push" }, qn = { class: "value-list" }, Un = ["aria-expanded", "onClick"], Mn = { class: "value-name" }, Nn = ["title"], En = { class: "bar" }, Bn = ["title"], Rn = { class: "evidence" }, Tn = {
  key: 0,
  class: "full-value"
}, Dn = {
  key: 1,
  class: "muted"
}, zn = {
  key: 2,
  class: "muted"
}, An = { class: "block" }, Fn = { class: "timeline" }, On = { class: "tl-icon" }, Pn = { class: "tl-main" }, Ln = { class: "tl-head" }, jn = { class: "muted push" }, In = { class: "tl-bar" }, Wn = { class: "muted" }, Qn = {
  key: 0,
  class: "tl-msg"
}, Jn = {
  key: 1,
  class: "chips"
}, Kn = /* @__PURE__ */ Q({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: v }) {
    const n = t, m = v, r = R(""), $ = R(), x = (f) => `${Math.round(f * 100)}%`, g = (f) => f == null ? "—" : typeof f == "string" ? f : Array.isArray(f) && f.every((N) => typeof N != "object") ? f.join(", ") : typeof f == "object" ? JSON.stringify(f) : String(f), E = (f) => `${(f / 1e3).toFixed(1)}s`, V = B(() => Math.max(1, ...n.result?.trace.map((f) => f.duration_ms) ?? [1])), l = (f) => f === "read" ? "Read document" : _[f] ?? f, a = (f) => f === "read" ? "tabler:file-text" : he[f] ?? "tabler:point", S = (f) => f >= 0.9 ? "high" : f >= 0.7 ? "mid" : "low";
    return (f, N) => (s(), o("div", gn, [
      e("section", fn, [
        e("div", hn, [
          u(Ae, {
            value: r.value,
            onSelect: N[0] || (N[0] = (w) => r.value = w)
          }, null, 8, ["value"])
        ]),
        u(h(H), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !r.value || t.running || !t.canRun,
          onClick: N[1] || (N[1] = (w) => m("run", r.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", kn, i(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(t.retention) + ".", 1)
      ]),
      t.result ? p("", !0) : (s(), o("p", $n, "No extraction results yet.")),
      t.result?.status === "failed" ? (s(), o("p", xn, [
        u(h(z), { icon: "tabler:alert-triangle" }),
        k("The run stopped: " + i(t.result.error), 1)
      ])) : p("", !0),
      t.result ? (s(), o("div", wn, [
        e("section", Vn, [
          e("header", Sn, [
            N[2] || (N[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", Cn, [
              k(i(t.result.tokens.toLocaleString()) + " tokens · " + i(E(t.result.duration_ms)), 1),
              t.result.cost !== void 0 ? (s(), o(C, { key: 0 }, [
                k(" · $" + i(t.result.cost.toFixed(3)), 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", qn, [
            (s(!0), o(C, null, T(t.result.fields, (w) => (s(), o("li", {
              key: w.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": $.value === w.name,
                onClick: (D) => $.value = $.value === w.name ? void 0 : w.name
              }, [
                e("span", Mn, i(w.name), 1),
                e("span", {
                  class: L(["value-text", { missing: w.missing }]),
                  title: w.missing ? void 0 : g(w.value)
                }, i(w.missing ? "Not in the document" : g(w.value)), 11, Nn),
                e("span", {
                  class: L(["confidence", S(w.confidence)])
                }, [
                  e("span", En, [
                    e("span", {
                      style: ne({ width: x(w.confidence) })
                    }, null, 4)
                  ]),
                  k(i(x(w.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: L(["chip", w.verified ? "primary" : "warn"]),
                  title: w.reason
                }, [
                  u(h(z), {
                    icon: w.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  k(i(w.verified ? "Verified" : "Check"), 1)
                ], 10, Bn),
                u(h(z), {
                  icon: $.value === w.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, Un),
              O(e("div", Rn, [
                w.missing ? p("", !0) : (s(), o("p", Tn, i(g(w.value)), 1)),
                (s(!0), o(C, null, T(w.evidence, (D, M) => (s(), o("blockquote", {
                  key: M,
                  class: L({ unfound: D.found === !1 })
                }, [
                  e("p", null, "“" + i(D.quote) + "”", 1),
                  e("cite", null, [
                    k(i(D.section), 1),
                    D.page !== void 0 && D.page !== null ? (s(), o(C, { key: 0 }, [
                      k(" · Page " + i(D.page), 1)
                    ], 64)) : p("", !0),
                    D.found === !1 ? (s(), o(C, { key: 1 }, [
                      k(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                w.evidence.length ? p("", !0) : (s(), o("p", Dn, "No evidence.")),
                w.reason ? (s(), o("p", zn, i(w.reason), 1)) : p("", !0)
              ], 512), [
                [be, $.value === w.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", An, [
          N[3] || (N[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Fn, [
            (s(!0), o(C, null, T(t.result.trace, (w, D) => (s(), o("li", {
              key: D,
              class: L(w.status)
            }, [
              e("span", On, [
                u(h(z), {
                  icon: a(w.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Pn, [
                e("div", Ln, [
                  e("strong", null, i(l(w.kind)), 1),
                  e("span", jn, i(E(w.duration_ms)), 1)
                ]),
                e("span", In, [
                  e("span", {
                    style: ne({ width: `${Math.max(4, w.duration_ms / V.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Wn, [
                  k(i(w.scope), 1),
                  w.model ? (s(), o(C, { key: 0 }, [
                    k(" · " + i(w.model), 1)
                  ], 64)) : p("", !0),
                  k(" · " + i((w.input_tokens + w.output_tokens).toLocaleString()) + " tokens", 1),
                  w.cost !== void 0 ? (s(), o(C, { key: 1 }, [
                    k(" · $" + i(w.cost.toFixed(4)), 1)
                  ], 64)) : p("", !0)
                ]),
                w.message ? (s(), o("p", Qn, i(w.message), 1)) : p("", !0),
                w.queries?.length ? (s(), o("div", Jn, [
                  (s(!0), o(C, null, T(w.queries, (M) => (s(), o("span", {
                    key: M,
                    class: "chip"
                  }, i(M), 1))), 128))
                ])) : p("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : p("", !0)
    ]));
  }
}), Hn = { class: "evals" }, Gn = {
  key: 0,
  class: "stat-row"
}, Xn = { class: "stat" }, Yn = { class: "stat-label" }, Zn = { class: "stat-value" }, _n = { class: "stat" }, es = { class: "stat-value" }, ls = { class: "stat" }, ts = { class: "stat-value" }, as = {
  key: 0,
  class: "stat-delta flat"
}, ns = { class: "stat" }, ss = { class: "stat-value" }, os = { class: "block" }, is = { class: "block-head" }, ds = {
  key: 0,
  class: "rev-pick push"
}, us = ["value"], rs = ["value"], cs = ["value"], ms = ["value"], vs = {
  key: 0,
  class: "block-empty"
}, bs = {
  key: 1,
  class: "metric-table"
}, ps = { class: "mono" }, ys = { class: "acc" }, gs = { class: "bar" }, fs = { class: "acc strong" }, hs = { class: "bar" }, ks = { class: "num muted" }, $s = { class: "num muted" }, xs = { class: "block" }, ws = { class: "block-head" }, Vs = { class: "count" }, Ss = { class: "row push" }, Cs = { class: "grid" }, qs = { class: "mono" }, Us = ["onUpdate:modelValue"], Ms = ["onUpdate:modelValue"], Ns = ["onUpdate:modelValue"], Es = ["onUpdate:modelValue", "type"], Bs = {
  key: 0,
  class: "error",
  role: "alert"
}, Rs = { class: "row" }, Ts = {
  key: 1,
  class: "block-empty"
}, Ds = {
  key: 2,
  class: "table-scroll"
}, zs = { class: "metric-table" }, As = { class: "num" }, Fs = ["aria-label", "disabled", "onClick"], Os = { class: "block" }, Ps = { class: "block-head" }, Ls = {
  key: 0,
  class: "block-empty"
}, js = { class: "proposal-head" }, Is = { class: "muted" }, Ws = { class: "chips" }, Qs = { class: "chip" }, Js = { class: "chip" }, Ks = { class: "changes" }, Hs = { class: "row" }, Gs = /* @__PURE__ */ Q({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(t, { emit: v }) {
    const n = t, m = v, r = R(!1), $ = R(""), x = R(""), g = R({}), E = R("");
    ae(() => n.cases, () => {
      r.value = !1, $.value = "", g.value = {};
    });
    function V() {
      E.value = "";
      const q = {};
      try {
        for (const y of n.fields) {
          const c = g.value[y.name] ?? "";
          q[y.name] = ["number", "boolean", "list", "object"].includes(y.type) ? c.trim() ? JSON.parse(c) : null : c;
        }
        m("add-case", { upload_id: $.value, upload_name: x.value, expected: q });
      } catch {
        E.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const l = B(() => [...n.results].sort((q, y) => q.revision - y.revision)), a = R(), S = R(), f = B(() => l.value.find((q) => q.revision === S.value) ?? l.value.at(-1)), N = B(() => l.value.find((q) => q.revision === a.value) ?? l.value.at(-2) ?? l.value.at(-1)), w = (q) => q && q.metrics.length ? q.metrics.reduce((y, c) => y + c.accuracy, 0) / q.metrics.length : 0, D = B(() => [...new Set([...N.value?.metrics ?? [], ...f.value?.metrics ?? []].map((y) => y.field))].map((y) => ({ name: y, a: N.value?.metrics.find((c) => c.field === y), b: f.value?.metrics.find((c) => c.field === y) }))), M = (q) => `${Math.round(q * 100)}%`, F = (q) => `${q > 0 ? "+" : q < 0 ? "−" : ""}${Math.abs(Math.round(q * 100))} pts`, A = (q) => Math.round(q * 100) > 0 ? "up" : Math.round(q * 100) < 0 ? "down" : "flat", I = (q) => `$${q.toFixed(3)}`, Y = (q) => `${(q / 1e3).toFixed(1)}s`, se = (q) => q == null || q === "" ? "—" : typeof q == "string" ? q : JSON.stringify(q);
    return (q, y) => (s(), o("div", Hn, [
      f.value ? (s(), o("div", Gn, [
        e("div", Xn, [
          e("span", Yn, "Accuracy · revision " + i(f.value.revision), 1),
          e("span", Zn, i(M(w(f.value))), 1),
          N.value && N.value !== f.value ? (s(), o("span", {
            key: 0,
            class: L(["stat-delta", A(w(f.value) - w(N.value))])
          }, i(F(w(f.value) - w(N.value))) + " vs revision " + i(N.value.revision), 3)) : p("", !0)
        ]),
        e("div", _n, [
          y[5] || (y[5] = e("span", { class: "stat-label" }, "Cases", -1)),
          e("span", es, i(f.value.cases), 1)
        ]),
        e("div", ls, [
          y[6] || (y[6] = e("span", { class: "stat-label" }, "Cost per eval", -1)),
          e("span", ts, i(I(f.value.cost)), 1),
          N.value && N.value !== f.value ? (s(), o("span", as, i(I(N.value.cost)) + " before", 1)) : p("", !0)
        ]),
        e("div", ns, [
          y[7] || (y[7] = e("span", { class: "stat-label" }, "Time per eval", -1)),
          e("span", ss, i(Y(f.value.duration_ms)), 1),
          N.value && N.value !== f.value ? (s(), o("span", {
            key: 0,
            class: L(["stat-delta", f.value.duration_ms < N.value.duration_ms ? "up" : "flat"])
          }, i(Y(N.value.duration_ms)) + " before", 3)) : p("", !0)
        ])
      ])) : p("", !0),
      e("section", os, [
        e("header", is, [
          y[8] || (y[8] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
          l.value.length ? (s(), o("div", ds, [
            e("select", {
              value: N.value?.revision,
              "aria-label": "Baseline revision",
              onChange: y[0] || (y[0] = (c) => a.value = Number(c.target.value))
            }, [
              (s(!0), o(C, null, T(l.value, (c) => (s(), o("option", {
                key: c.revision,
                value: c.revision
              }, "Revision " + i(c.revision), 9, rs))), 128))
            ], 40, us),
            u(h(z), { icon: "tabler:arrow-right" }),
            e("select", {
              value: f.value?.revision,
              "aria-label": "Compared revision",
              onChange: y[1] || (y[1] = (c) => S.value = Number(c.target.value))
            }, [
              (s(!0), o(C, null, T(l.value, (c) => (s(), o("option", {
                key: c.revision,
                value: c.revision
              }, "Revision " + i(c.revision), 9, ms))), 128))
            ], 40, cs)
          ])) : p("", !0)
        ]),
        l.value.length ? (s(), o("table", bs, [
          e("thead", null, [
            e("tr", null, [
              y[9] || (y[9] = e("th", null, "Field", -1)),
              e("th", null, "Revision " + i(N.value?.revision), 1),
              e("th", null, "Revision " + i(f.value?.revision), 1),
              y[10] || (y[10] = e("th", null, "Change", -1)),
              y[11] || (y[11] = e("th", { class: "num" }, "Cost", -1)),
              y[12] || (y[12] = e("th", { class: "num" }, "Time", -1))
            ])
          ]),
          e("tbody", null, [
            (s(!0), o(C, null, T(D.value, (c) => (s(), o("tr", {
              key: c.name
            }, [
              e("td", ps, i(c.name), 1),
              e("td", null, [
                e("span", ys, [
                  e("span", gs, [
                    e("span", {
                      style: ne({ width: M(c.a?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  k(i(c.a ? M(c.a.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                e("span", fs, [
                  e("span", hs, [
                    e("span", {
                      style: ne({ width: M(c.b?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  k(i(c.b ? M(c.b.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                c.a && c.b ? (s(), o("span", {
                  key: 0,
                  class: L(["trend", A(c.b.accuracy - c.a.accuracy)])
                }, [
                  u(h(z), {
                    icon: A(c.b.accuracy - c.a.accuracy) === "up" ? "tabler:trending-up" : A(c.b.accuracy - c.a.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                  }, null, 8, ["icon"]),
                  k(i(F(c.b.accuracy - c.a.accuracy)), 1)
                ], 2)) : p("", !0)
              ]),
              e("td", ks, i(c.b ? I(c.b.cost) : "—"), 1),
              e("td", $s, i(c.b ? Y(c.b.duration_ms) : "—"), 1)
            ]))), 128))
          ])
        ])) : (s(), o("p", vs, "No evaluation results yet."))
      ]),
      e("section", xs, [
        e("header", ws, [
          y[13] || (y[13] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", Vs, i(t.cases.length), 1),
          e("div", Ss, [
            u(h(H), {
              label: "Add case",
              size: "small",
              severity: "secondary",
              disabled: !t.fields.length,
              onClick: y[2] || (y[2] = (c) => r.value = !r.value)
            }, null, 8, ["disabled"]),
            u(h(H), {
              label: "Run all cases",
              size: "small",
              disabled: ""
            })
          ])
        ]),
        r.value ? (s(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ye(V, ["prevent"])
        }, [
          e("label", null, [
            y[14] || (y[14] = k("Upload", -1)),
            u(Ae, {
              value: $.value,
              onSelect: y[3] || (y[3] = (c, P) => {
                $.value = c, x.value = P;
              })
            }, null, 8, ["value"])
          ]),
          e("div", Cs, [
            (s(!0), o(C, null, T(t.fields, (c) => (s(), o("label", {
              key: c.name
            }, [
              e("span", qs, i(c.name), 1),
              c.type === "boolean" ? O((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (P) => g.value[c.name] = P
              }, [...y[15] || (y[15] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Us)), [
                [ie, g.value[c.name]]
              ]) : c.type === "enum" ? O((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (P) => g.value[c.name] = P
              }, [
                y[16] || (y[16] = e("option", { value: "" }, "No value", -1)),
                (s(!0), o(C, null, T(c.enum_values, (P) => (s(), o("option", { key: P }, i(P), 1))), 128))
              ], 8, Ms)), [
                [ie, g.value[c.name]]
              ]) : ["object", "list"].includes(c.type) ? O((s(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (P) => g.value[c.name] = P,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, Ns)), [
                [K, g.value[c.name]]
              ]) : O((s(), o("input", {
                key: 3,
                "onUpdate:modelValue": (P) => g.value[c.name] = P,
                type: c.type === "number" ? "number" : c.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, Es)), [
                [Ge, g.value[c.name]]
              ])
            ]))), 128))
          ]),
          E.value ? (s(), o("p", Bs, i(E.value), 1)) : p("", !0),
          e("div", Rs, [
            u(h(H), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !$.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            u(h(H), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: y[4] || (y[4] = (c) => r.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        !t.cases.length && !r.value ? (s(), o("p", Ts, "No evaluation cases yet. Add a document with the values you expect.")) : t.cases.length ? (s(), o("div", Ds, [
          e("table", zs, [
            e("thead", null, [
              e("tr", null, [
                y[17] || (y[17] = e("th", null, "Document", -1)),
                (s(!0), o(C, null, T(t.fields, (c) => (s(), o("th", {
                  key: c.name,
                  class: "mono"
                }, i(c.name), 1))), 128)),
                y[18] || (y[18] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(C, null, T(t.cases, (c) => (s(), o("tr", {
                key: c.id
              }, [
                e("td", null, [
                  u(h(z), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  k(" " + i(c.upload_name), 1)
                ]),
                (s(!0), o(C, null, T(t.fields, (P) => (s(), o("td", {
                  key: P.name
                }, i(se(c.expected[P.name])), 1))), 128)),
                e("td", As, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${c.upload_name}`,
                    disabled: t.saving,
                    onClick: (P) => m("delete-case", c.id)
                  }, [
                    u(h(z), { icon: "tabler:trash" })
                  ], 8, Fs)
                ])
              ]))), 128))
            ])
          ])
        ])) : p("", !0),
        y[19] || (y[19] = e("p", { class: "block-foot muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", Os, [
        e("header", Ps, [
          y[20] || (y[20] = e("h2", { class: "block-title" }, "Tuning proposals", -1)),
          u(h(H), {
            label: "Tune configuration",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: ""
          })
        ]),
        t.proposals.length ? p("", !0) : (s(), o("p", Ls, "No tuning proposals yet.")),
        (s(!0), o(C, null, T(t.proposals, (c) => (s(), o("article", {
          key: c.id,
          class: "proposal"
        }, [
          e("div", js, [
            e("h3", null, i(c.title), 1),
            e("span", Is, "from revision " + i(c.base_revision), 1)
          ]),
          e("div", Ws, [
            e("span", {
              class: L(["chip", c.accuracy_delta > 0 ? "primary" : ""])
            }, i(F(c.accuracy_delta)) + " accuracy", 3),
            e("span", Qs, i(c.cost_delta >= 0 ? "+" : "−") + i(I(Math.abs(c.cost_delta))) + " cost", 1),
            e("span", Js, i(c.duration_delta_ms >= 0 ? "+" : "−") + i(Y(Math.abs(c.duration_delta_ms))) + " time", 1)
          ]),
          e("ul", Ks, [
            (s(!0), o(C, null, T(c.changes, (P) => (s(), o("li", { key: P }, i(P), 1))), 128))
          ]),
          e("div", Hs, [
            u(h(H), {
              label: "Apply",
              size: "small",
              disabled: ""
            }),
            u(h(H), {
              label: "Discard",
              size: "small",
              severity: "secondary",
              text: "",
              disabled: ""
            })
          ])
        ]))), 128)),
        y[21] || (y[21] = e("p", { class: "block-foot muted" }, "Configuration tuning is not available yet.", -1))
      ])
    ]));
  }
}), Xs = { class: "section-head" }, Ys = { class: "muted" }, Zs = {
  key: 0,
  class: "empty"
}, _s = {
  key: 1,
  class: "run-list"
}, eo = { class: "row" }, lo = { class: "capitalize" }, to = ["data-status"], ao = /* @__PURE__ */ Q({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const v = (n) => new Date(n).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (n, m) => (s(), o(C, null, [
      e("div", Xs, [
        m[0] || (m[0] = e("h2", null, "Recent runs", -1)),
        e("span", Ys, "Retention " + i(t.retention), 1)
      ]),
      t.runs.length ? (s(), o("div", _s, [
        (s(!0), o(C, null, T(t.runs, (r) => (s(), o("article", {
          key: r.id,
          class: "run-card"
        }, [
          e("div", eo, [
            e("strong", lo, i(r.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": r.status
            }, i(r.status), 9, to)
          ]),
          e("dl", null, [
            m[1] || (m[1] = e("dt", null, "Duration", -1)),
            e("dd", null, i((r.duration_ms / 1e3).toFixed(1)) + "s", 1),
            m[2] || (m[2] = e("dt", null, "Expires", -1)),
            e("dd", null, i(v(r.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (s(), o("p", Zs, "No runs yet."))
    ], 64));
  }
}), no = { class: "docscout" }, so = { class: "toolbar" }, oo = { class: "toolbar-lead" }, io = { class: "crumb" }, uo = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, ro = ["id", "aria-selected", "aria-controls", "onClick"], co = { class: "toolbar-side" }, mo = { class: "stats" }, vo = ["title"], bo = {
  key: 1,
  class: "unsaved"
}, po = {
  key: 0,
  role: "alert",
  class: "error banner"
}, yo = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, go = ["id", "aria-labelledby"], fo = /* @__PURE__ */ Q({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    running: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back", "run"],
  setup(t, { emit: v }) {
    const n = t, m = v, r = R(), $ = R("Builder"), x = R(Ne()), g = R(""), E = R(""), V = B(() => n.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    ae($, () => {
      r.value && (r.value.scrollTop = 0);
    }, { flush: "post" });
    const l = B(() => n.engine ?? ze()), a = R();
    function S(M) {
      return g.value === M.title && E.value === (M.description ?? "") && ol(x.value, M.config);
    }
    ae(() => n.snapshot, (M, F) => {
      V.value.includes($.value) || ($.value = V.value[0]), !(F && M.id === F.id && M.can_edit && F.can_edit && !S(F) && !S(M)) && (x.value = structuredClone(qe(M.config ?? Ne())), g.value = M.title, E.value = M.description ?? "", a.value = M.expected_revision);
    }, { immediate: !0 });
    const f = B(() => n.snapshot.can_edit && !S(n.snapshot)), N = B(() => sl(x.value)), w = B(() => Object.keys(_).filter((M) => ce(x.value, M)).length);
    function D() {
      m("save", { title: g.value, description: E.value, config: structuredClone(qe(x.value)), expected_revision: a.value });
    }
    return (M, F) => (s(), o("main", no, [
      e("div", so, [
        e("div", oo, [
          t.back ? (s(), o(C, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: F[0] || (F[0] = (A) => m("back"))
            }, [
              u(h(z), { icon: "tabler:arrow-left" })
            ]),
            e("span", io, i(t.snapshot.title), 1)
          ], 64)) : p("", !0),
          e("nav", uo, [
            (s(!0), o(C, null, T(V.value, (A) => (s(), o("button", {
              id: `tab-${A}`,
              key: A,
              role: "tab",
              "aria-selected": $.value === A,
              "aria-controls": `panel-${A}`,
              onClick: (I) => $.value = A
            }, i(A), 9, ro))), 128))
          ])
        ]),
        e("div", co, [
          e("span", mo, [
            k(i(t.snapshot.field_count) + " " + i(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (s(), o(C, { key: 0 }, [
              k(" · " + i(w.value) + " steps · revision " + i(t.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(C, { key: 1 }, [
              k(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (s(), o(C, { key: 0 }, [
            N.value ? (s(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: N.value
            }, [
              u(h(z), { icon: "tabler:alert-circle" }),
              k(i(N.value), 1)
            ], 8, vo)) : f.value ? (s(), o("span", bo, "Unsaved")) : p("", !0),
            u(h(H), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !f.value || !!N.value || !g.value.trim(),
              onClick: D
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      t.error ? (s(), o("p", po, i(t.error), 1)) : p("", !0),
      $.value === "Builder" && t.snapshot.can_edit ? (s(), o("div", yo, [
        u(vn, {
          title: g.value,
          "onUpdate:title": F[1] || (F[1] = (A) => g.value = A),
          description: E.value,
          "onUpdate:description": F[2] || (F[2] = (A) => E.value = A),
          config: x.value,
          retention: t.snapshot.retention,
          result: l.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 2,
        ref_key: "body",
        ref: r,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${$.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${$.value}`,
          class: "panel"
        }, [
          $.value === "Test" ? (s(), X(Kn, {
            key: 0,
            result: l.value.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: F[3] || (F[3] = (A) => m("run", A))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          $.value === "Evals" && t.snapshot.can_edit ? (s(), X(Gs, {
            key: 1,
            cases: t.snapshot.cases,
            results: l.value.evals,
            proposals: l.value.proposals,
            fields: t.snapshot.config?.fields ?? [],
            saving: t.saving,
            onAddCase: F[4] || (F[4] = (A) => m("add-case", A)),
            onDeleteCase: F[5] || (F[5] = (A) => m("delete-case", A))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : p("", !0),
          $.value === "Runs" ? (s(), X(ao, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, go)
      ], 512))
    ]));
  }
}), ho = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, ko = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, So = /* @__PURE__ */ Q({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: v }) {
    const n = t, m = v, r = R(), $ = R(""), x = R(!1), g = R(!1), E = R(ze());
    let V;
    async function l() {
      if (!n.id) {
        $.value = "No extractor selected.";
        return;
      }
      const D = n.id;
      try {
        const M = await oe.get(D);
        D === n.id && (r.value = M, $.value = "");
      } catch (M) {
        $.value = M instanceof Error ? M.message : String(M);
      }
    }
    ae(() => n.id, () => {
      r.value = void 0, V?.(), l(), n.id && (V = Xe(`component.${n.id}`, () => l()));
    }, { immediate: !0 }), Ee(() => V?.());
    async function a(D) {
      x.value = !0, $.value = "";
      try {
        await D(), await l();
      } catch (M) {
        $.value = M instanceof Error ? M.message : String(M);
      } finally {
        x.value = !1;
      }
    }
    const S = (D) => a(() => oe.update(n.id, D)), f = (D) => a(() => oe.addCase(n.id, D)), N = (D) => a(() => oe.deleteCase(n.id, D));
    async function w(D) {
      g.value = !0, $.value = "";
      try {
        E.value = { ...E.value, result: await oe.run(n.id, D) }, await l();
      } catch (M) {
        $.value = M instanceof Error ? M.message : String(M);
      } finally {
        g.value = !1;
      }
    }
    return (D, M) => r.value ? (s(), X(fo, {
      key: 0,
      snapshot: r.value,
      saving: x.value,
      running: g.value,
      engine: E.value,
      error: $.value,
      back: t.back,
      onBack: M[0] || (M[0] = (F) => m("back")),
      onRun: w,
      onSave: S,
      onAddCase: f,
      onDeleteCase: N
    }, null, 8, ["snapshot", "saving", "running", "engine", "error", "back"])) : $.value ? (s(), o("p", ho, i($.value), 1)) : (s(), o("p", ko, "Loading Docscout…"));
  }
});
export {
  So as _
};
