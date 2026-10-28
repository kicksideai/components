import { defineComponent as j, useModel as ye, openBlock as s, createElementBlock as o, withModifiers as $e, createElementVNode as e, mergeModels as xe, computed as R, withKeys as Ce, unref as y, normalizeClass as P, createVNode as c, toDisplayString as i, Fragment as S, renderList as O, createCommentVNode as p, createTextVNode as $, createBlock as Z, ref as A, watch as ue, withDirectives as W, vModelText as X, vModelSelect as fe, onMounted as we, normalizeStyle as be, onBeforeUnmount as Ie, nextTick as Le, vShow as qe, vModelDynamic as el, toRaw as Fe, withCtx as ll } from "vue";
import { loadByTagName as Ee, on as tl } from "@wippy-fe/proxy";
import { i as he, h as We, t as Ue, g as ie, j as Me, k as al, m as je, l as Qe, o as Oe, p as nl, q as sl, r as ol, v as il, w as ze, x as ul, y as Ve, z as dl, A as rl, s as oe, n as Pe, C as cl, D as ml, c as ae } from "./index-DnSDhJct.js";
import { Icon as F } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const pe = (t) => t.status === "completed" || t.status === "failed", re = (t) => t.metrics.length ? t.metrics.reduce((r, n) => r + n.accuracy, 0) / t.metrics.length : 0, vl = ["aria-checked", "aria-label", "disabled"], Q = /* @__PURE__ */ j({
  __name: "Toggle",
  props: /* @__PURE__ */ xe({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const r = ye(t, "modelValue");
    return (n, b) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": r.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: b[0] || (b[0] = $e((m) => r.value = !r.value, ["stop"]))
    }, [...b[1] || (b[1] = [
      e("span", null, null, -1)
    ])], 8, vl));
  }
}), bl = ["aria-label"], pl = { class: "node-icon" }, fl = { class: "node-main" }, yl = { class: "node-title" }, gl = { class: "node-summary" }, hl = {
  key: 0,
  class: "chips"
}, kl = {
  key: 1,
  class: "trace-line"
}, $l = { class: "node-side" }, xl = {
  key: 0,
  class: "chip model"
}, ce = /* @__PURE__ */ j({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(t, { emit: r }) {
    const n = t, b = r, m = R(() => he(n.config, n.stage)), x = R(() => n.config.stages[n.stage].model), f = R({ get: () => m.value, set: (w) => {
      n.config.stages[n.stage].enabled = w;
    } }), k = R(() => {
      const w = n.config, l = w.stages;
      switch (n.stage) {
        case "map":
          return w.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...w.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((a) => ({ text: Ue(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return We(w).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), N = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, l) => (s(), o("div", {
      class: P(["node", { active: t.active, off: !m.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": y(ie)[t.stage],
      onClick: l[1] || (l[1] = (a) => b("select")),
      onKeydown: [
        l[2] || (l[2] = Ce((a) => b("select"), ["enter"])),
        l[3] || (l[3] = Ce($e((a) => b("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", pl, [
        c(y(F), {
          icon: y(Me)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", fl, [
        e("span", yl, i(y(ie)[t.stage]), 1),
        e("span", gl, i(m.value ? y(al)(t.stage, t.config) : "Off"), 1),
        m.value && k.value.length ? (s(), o("span", hl, [
          (s(!0), o(S, null, O(k.value, (a) => (s(), o("span", {
            key: a.text,
            class: P(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        t.trace ? (s(), o("span", kl, [
          c(y(F), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          $(i(N(t.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", $l, [
        m.value && x.value ? (s(), o("span", xl, i(y(je)(x.value)), 1)) : p("", !0),
        t.stage !== "extract" && !t.readonly ? (s(), Z(Q, {
          key: 1,
          modelValue: f.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => f.value = a),
          label: `Enable ${y(ie)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, bl));
  }
}), wl = ["aria-labelledby"], Vl = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ve = /* @__PURE__ */ j({
  __name: "Segmented",
  props: /* @__PURE__ */ xe({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const r = t, n = ye(t, "modelValue"), b = A([]);
    function m(x, f) {
      const k = r.options.length - 1, N = { ArrowRight: f + 1, ArrowDown: f + 1, ArrowLeft: f - 1, ArrowUp: f - 1, Home: 0, End: k }[x.key];
      if (N === void 0) return;
      x.preventDefault();
      const w = (N + r.options.length) % r.options.length;
      n.value = r.options[w].value, b.value[w]?.focus();
    }
    return (x, f) => (s(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (s(!0), o(S, null, O(t.options, (k, N) => (s(), o("button", {
        key: k.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: b,
        type: "button",
        role: "radio",
        "aria-checked": n.value === k.value,
        tabindex: n.value === k.value ? 0 : -1,
        disabled: t.disabled,
        onClick: (w) => n.value = k.value,
        onKeydown: (w) => m(w, N)
      }, i(k.label), 41, Vl))), 128))
    ], 8, wl));
  }
}), Sl = ["disabled"], Cl = { class: "grid" }, ql = ["aria-invalid"], Ul = ["value"], El = {
  key: 0,
  class: "field-error",
  role: "alert"
}, Ml = { key: 1 }, Nl = ["value"], Bl = { key: 2 }, Tl = ["value"], Rl = { class: "grid" }, Al = {
  key: 3,
  class: "field-note"
}, Dl = { class: "label-block" }, Ll = {
  key: 4,
  class: "field-error"
}, Fl = { id: "docscout-groups" }, Ol = ["value"], zl = { key: 5 }, Pl = ["placeholder"], Il = { class: "toggle-row" }, Wl = { class: "toggle-row" }, jl = /* @__PURE__ */ j({
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
  setup(t, { emit: r }) {
    const n = t, b = r, m = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], x = m.filter((w) => ["text", "number", "boolean", "date", "object"].includes(w.value)), f = R(() => Qe(n.field, n.otherNames)), k = R(() => n.field.type !== "boolean" && n.field.type !== "enum" && !(n.field.type === "list" && n.field.item_type === "boolean"));
    ue(() => [n.field.type, n.field.item_type], () => {
      !Oe(n.field) && n.field.enum_values.length && (n.field.enum_values = []);
    });
    function N(w) {
      n.field.enum_values = [...new Set(w.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (w, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", Cl, [
        e("label", null, [
          l[14] || (l[14] = $("Name", -1)),
          W(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (a) => t.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!f.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, ql), [
            [
              X,
              t.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          l[15] || (l[15] = $("Type", -1)),
          W(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (a) => t.field.type = a),
            "aria-label": "Field type"
          }, [
            (s(), o(S, null, O(m, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, Ul)), 64))
          ], 512), [
            [fe, t.field.type]
          ])
        ])
      ]),
      f.value ? (s(), o("p", El, [
        c(y(F), { icon: "tabler:alert-circle" }),
        $(i(f.value), 1)
      ])) : p("", !0),
      t.field.type === "list" ? (s(), o("label", Ml, [
        l[16] || (l[16] = $("Each item is", -1)),
        W(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => t.field.item_type = a)
        }, [
          (s(!0), o(S, null, O(y(x), (a) => (s(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, Nl))), 128))
        ], 512), [
          [fe, t.field.item_type]
        ])
      ])) : p("", !0),
      y(Oe)(t.field) ? (s(), o("label", Bl, [
        $(i(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: N
        }, null, 40, Tl),
        e("small", null, i(t.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : p("", !0),
      e("label", null, [
        l[17] || (l[17] = $("Description", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (a) => t.field.description = a),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [X, t.field.description]
        ]),
        l[18] || (l[18] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      l[34] || (l[34] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[19] || (l[19] = $("Search hints", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": l[4] || (l[4] = (a) => t.field.search_hints = a),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [X, t.field.search_hints]
        ]),
        l[20] || (l[20] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", Rl, [
        e("label", null, [
          l[22] || (l[22] = $("Strategy", -1)),
          W(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (a) => t.field.strategy = a)
          }, [...l[21] || (l[21] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [fe, t.field.strategy]
          ])
        ]),
        e("label", null, [
          l[23] || (l[23] = $("Chunks to read", -1)),
          W(e("input", {
            "onUpdate:modelValue": l[6] || (l[6] = (a) => t.field.chunks = a),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              X,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[24] || (l[24] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (s(), o("p", Al, [
        c(y(F), { icon: "tabler:info-circle" }),
        l[25] || (l[25] = $("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Dl, [
        l[26] || (l[26] = e("span", { id: "within-label" }, "Search within", -1)),
        c(ve, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => t.field.search_within = a),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, i(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (s(), o("p", Ll, [
        c(y(F), { icon: "tabler:alert-circle" }),
        l[27] || (l[27] = $("Turn on Map the document to read sections.", -1))
      ])) : p("", !0),
      e("label", null, [
        l[28] || (l[28] = $("Group", -1)),
        W(e("input", {
          "onUpdate:modelValue": l[8] || (l[8] = (a) => t.field.group = a),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            X,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Fl, [
          (s(!0), o(S, null, O(t.groups, (a) => (s(), o("option", {
            key: a,
            value: a
          }, null, 8, Ol))), 128))
        ]),
        l[29] || (l[29] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      l[35] || (l[35] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[30] || (l[30] = $("Validation hints", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": l[9] || (l[9] = (a) => t.field.validation_hints = a),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [X, t.field.validation_hints]
        ])
      ]),
      k.value ? (s(), o("label", zl, [
        l[31] || (l[31] = $("Expected format", -1)),
        W(e("input", {
          "onUpdate:modelValue": l[10] || (l[10] = (a) => t.field.expected_format = a),
          placeholder: y(nl)(t.field)
        }, null, 8, Pl), [
          [X, t.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Il, [
        l[32] || (l[32] = e("span", null, [
          $("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        c(Q, {
          modelValue: t.field.required,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => t.field.required = a),
          label: "Required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Wl, [
        l[33] || (l[33] = e("span", null, [
          $("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        c(Q, {
          modelValue: t.field.evidence_required,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => t.field.evidence_required = a),
          label: "Evidence required",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      t.readonly ? p("", !0) : (s(), o("button", {
        key: 6,
        type: "button",
        class: "btn danger-text",
        onClick: l[13] || (l[13] = (a) => b("remove"))
      }, "Remove field"))
    ], 8, Sl));
  }
}), Ql = ["value", "capability", "aria-labelledby"], Kl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Hl = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, te = /* @__PURE__ */ j({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: r }) {
    const n = r, b = A(!!customElements.get("wc-model-picker")), m = A("");
    we(async () => {
      if (!b.value)
        try {
          await Ee("wc-model-picker", { timeoutMs: 8e3 }), b.value = !0;
        } catch (f) {
          m.value = f instanceof Error ? f.message : String(f);
        }
    });
    function x(f) {
      const k = f.detail;
      typeof k == "string" && n("select", k);
    }
    return (f, k) => b.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: x
    }, null, 40, Ql)) : m.value ? (s(), o("p", Kl, "Could not load model picker: " + i(m.value), 1)) : (s(), o("span", Hl, "Loading models…"));
  }
}), Jl = { class: "slider" }, Yl = { class: "slider-head" }, Gl = { class: "slider-value" }, Xl = ["aria-label", "aria-valuetext", "disabled"], Zl = {
  key: 0,
  class: "slider-hints"
}, _l = { key: 1 }, me = 1e3, Y = /* @__PURE__ */ j({
  __name: "Slider",
  props: /* @__PURE__ */ xe({
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
    const r = t, n = ye(t, "modelValue"), b = R(() => r.percent ? `${Math.round(n.value * 100)}%` : `${n.value.toLocaleString()}${r.unit ? ` ${r.unit}` : ""}`), m = (k) => r.log ? Math.log(k / r.min) / Math.log(r.max / r.min) * me : (k - r.min) / (r.max - r.min) * me;
    function x(k) {
      const N = r.log ? r.min * Math.pow(r.max / r.min, k / me) : r.min + (r.max - r.min) * k / me, w = Math.round(N / r.step) * r.step;
      return Math.min(r.max, Math.max(r.min, Number(w.toFixed(4))));
    }
    const f = R({ get: () => Math.round(m(n.value)), set: (k) => {
      n.value = x(k);
    } });
    return (k, N) => (s(), o("div", Jl, [
      e("div", Yl, [
        e("span", null, i(t.label), 1),
        e("output", Gl, i(b.value), 1)
      ]),
      W(e("input", {
        "onUpdate:modelValue": N[0] || (N[0] = (w) => f.value = w),
        type: "range",
        min: "0",
        max: me,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": b.value,
        disabled: t.disabled,
        style: be({ "--fill": `${f.value / me * 100}%` })
      }, null, 12, Xl), [
        [
          X,
          f.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (s(), o("div", Zl, [
        e("span", null, i(t.hints[0]), 1),
        e("span", null, i(t.hints[1]), 1)
      ])) : p("", !0),
      t.note ? (s(), o("small", _l, i(t.note), 1)) : p("", !0)
    ]));
  }
}), et = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, lt = { class: "fd-track" }, tt = { class: "fd-node" }, at = { class: "fd-dots" }, nt = { class: "fd-more" }, st = { class: "fd-node goal" }, ot = /* @__PURE__ */ j({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const r = t;
    return (n, b) => (s(), o("figure", et, [
      e("div", lt, [
        b[2] || (b[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (s(!0), o(S, null, O(Math.min(r.rounds, 8), (m) => (s(), o(S, { key: m }, [
          b[0] || (b[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", tt, [
            e("span", null, "R" + i(m), 1),
            e("span", at, [
              (s(!0), o(S, null, O(Math.min(r.extra, 6), (x) => (s(), o("i", { key: x }))), 128))
            ])
          ])
        ], 64))), 128)),
        r.rounds > 8 ? (s(), o(S, { key: 0 }, [
          b[1] || (b[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", nt, "+" + i(r.rounds - 8), 1)
        ], 64)) : p("", !0),
        b[3] || (b[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", st, "≥ " + i(Math.round(r.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, i(r.rounds ? `One pass, then up to ${r.rounds} rounds with up to ${r.extra} new queries each, stopping as soon as confidence reaches ${Math.round(r.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), it = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, ut = { class: "fd-grid" }, dt = { class: "fd-node solid" }, rt = { class: "fd-node" }, ct = { class: "fd-node" }, mt = { class: "fd-node goal" }, vt = /* @__PURE__ */ j({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const r = t, n = R(() => Math.min(r.queries * r.perQuery, r.cap));
    return (b, m) => (s(), o("figure", it, [
      e("div", ut, [
        e("span", dt, [
          e("b", null, i(t.fields), 1),
          $(" field" + i(t.fields === 1 ? "" : "s"), 1),
          e("small", null, i(t.parallel) + " at a time", 1)
        ]),
        e("span", rt, [
          e("b", null, i(t.queries), 1),
          m[0] || (m[0] = $(" queries", -1)),
          m[1] || (m[1] = e("small", null, "per field", -1))
        ]),
        e("span", ct, [
          e("b", null, i(t.perQuery), 1),
          m[2] || (m[2] = $(" chunks", -1)),
          m[3] || (m[3] = e("small", null, "per query", -1))
        ]),
        e("span", mt, [
          e("b", null, i(n.value), 1),
          m[4] || (m[4] = $(" chunks", -1)),
          e("small", null, i(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(n.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), bt = ["disabled"], pt = { class: "muted" }, ft = { class: "toggle-row" }, yt = { class: "label-block" }, gt = { class: "toggle-row" }, ht = {
  id: "model-map",
  class: "model-role"
}, kt = {
  key: 0,
  class: "chips"
}, $t = {
  key: 1,
  class: "muted"
}, xt = { class: "toggle-row" }, wt = { class: "grid" }, Vt = ["onUpdate:modelValue"], St = ["onUpdate:modelValue"], Ct = ["onUpdate:modelValue"], qt = ["onClick"], Ut = {
  key: 0,
  class: "muted"
}, Et = { class: "toggle-row" }, Mt = { class: "label-block" }, Nt = {
  id: "model-scout",
  class: "model-role"
}, Bt = {
  key: 2,
  class: "muted"
}, Tt = {
  key: 3,
  class: "toggle-row"
}, Rt = { class: "toggle-row" }, At = { class: "toggle-row" }, Dt = { class: "label-block" }, Lt = {
  id: "model-deep",
  class: "model-role"
}, Ft = {
  id: "model-deep-query",
  class: "model-role"
}, Ot = {
  id: "model-extract",
  class: "model-role"
}, zt = { class: "output-list" }, Pt = { class: "chip" }, It = {
  key: 0,
  class: "muted"
}, Wt = { class: "toggle-row" }, jt = { class: "toggle-row" }, Qt = { class: "toggle-row" }, Kt = { class: "toggle-row" }, Ht = {
  id: "model-verify",
  class: "model-role"
}, Jt = /* @__PURE__ */ j({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const r = t, n = R(() => r.config.stages), b = (w) => ul(r.stage, w), m = sl(), x = R(() => r.config.fields.filter((w) => w.strategy === "deep").length), f = R(() => r.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), k = R(() => We(r.config));
    function N(w, l) {
      const a = n.value.scout.tools.filter((q) => q !== w);
      n.value.scout.tools = l ? [...a, w] : a;
    }
    return (w, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", pt, i(y(ol)[t.stage]), 1),
      t.stage === "map" ? (s(), o(S, { key: 0 }, [
        e("div", ft, [
          l[34] || (l[34] = e("span", null, "Stage enabled", -1)),
          c(Q, {
            modelValue: n.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (a) => n.value.map.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", yt, [
          l[35] || (l[35] = e("span", { id: "outline-label" }, "Outline", -1)),
          c(ve, {
            modelValue: n.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (a) => n.value.map.outline = a),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[36] || (l[36] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", gt, [
          l[37] || (l[37] = e("span", null, [
            $("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          c(Q, {
            modelValue: n.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (a) => n.value.map.section_summaries = a),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[39] || (l[39] = e("h4", null, "Models", -1)),
        e("div", ht, [
          l[38] || (l[38] = e("span", null, "Outliner", -1)),
          c(te, {
            value: n.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (a) => n.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        l[40] || (l[40] = e("h4", null, "Fields that read sections", -1)),
        f.value.length ? (s(), o("p", kt, [
          (s(!0), o(S, null, O(f.value, (a) => (s(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (s(), o("p", $t, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      t.stage === "prefetch" ? (s(), o(S, { key: 1 }, [
        e("div", xt, [
          l[41] || (l[41] = e("span", null, "Stage enabled", -1)),
          c(Q, {
            modelValue: n.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (a) => n.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[45] || (l[45] = e("h4", null, "Queries", -1)),
        (s(!0), o(S, null, O(n.value.prefetch.queries, (a, q) => (s(), o("div", {
          key: q,
          class: "query-row"
        }, [
          e("div", wt, [
            e("label", null, [
              l[42] || (l[42] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": (z) => a.name = z,
                placeholder: "Parties"
              }, null, 8, Vt), [
                [X, a.name]
              ])
            ]),
            e("label", null, [
              l[43] || (l[43] = $("Chunks", -1)),
              W(e("input", {
                "onUpdate:modelValue": (z) => a.chunks = z,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, St), [
                [
                  X,
                  a.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[44] || (l[44] = $("Query", -1)),
            W(e("textarea", {
              "onUpdate:modelValue": (z) => a.query = z,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, Ct), [
              [X, a.query]
            ])
          ]),
          t.readonly ? p("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (z) => n.value.prefetch.queries.splice(q, 1)
          }, "Remove query", 8, qt))
        ]))), 128)),
        n.value.prefetch.queries.length ? p("", !0) : (s(), o("p", Ut, "No fixed queries. Field search hints still run.")),
        t.readonly ? p("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[5] || (l[5] = (a) => n.value.prefetch.queries.push(y(il)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      t.stage === "scout" ? (s(), o(S, { key: 2 }, [
        e("div", Et, [
          l[46] || (l[46] = e("span", null, "Stage enabled", -1)),
          c(Q, {
            modelValue: n.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (a) => n.value.scout.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Mt, [
          l[47] || (l[47] = e("span", { id: "mode-label" }, "Mode", -1)),
          c(ve, {
            modelValue: n.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (a) => n.value.scout.mode = a),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, i(n.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        n.value.scout.mode === "loop" ? (s(), Z(ot, {
          key: 0,
          rounds: n.value.scout.max_rounds,
          confidence: n.value.scout.target_confidence,
          extra: n.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : p("", !0),
        l[52] || (l[52] = e("h4", null, "Models", -1)),
        e("div", Nt, [
          l[48] || (l[48] = e("span", null, "Scout", -1)),
          c(te, {
            value: n.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (a) => n.value.scout.model = a)
          }, null, 8, ["value"])
        ]),
        l[53] || (l[53] = e("h4", null, "Loop", -1)),
        c(Y, {
          modelValue: n.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => n.value.scout.max_rounds = a),
          label: n.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: b("max_rounds").min,
          max: b("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        n.value.scout.mode === "loop" ? (s(), Z(Y, {
          key: 1,
          modelValue: n.value.scout.target_confidence,
          "onUpdate:modelValue": l[10] || (l[10] = (a) => n.value.scout.target_confidence = a),
          label: "Stop at confidence",
          min: b("target_confidence").min,
          max: b("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : p("", !0),
        c(Y, {
          modelValue: n.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => n.value.scout.max_extra_queries = a),
          label: n.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: b("max_extra_queries").min,
          max: b("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.scout.max_tokens,
          "onUpdate:modelValue": l[12] || (l[12] = (a) => n.value.scout.max_tokens = a),
          label: "Scout output limit",
          min: b("max_tokens").min,
          max: b("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        n.value.scout.mode === "agent" ? (s(), o("p", Bt, "Tool budget: " + i(n.value.scout.max_rounds * n.value.scout.max_extra_queries) + " calls.", 1)) : p("", !0),
        n.value.scout.mode === "loop" ? (s(), o("div", Tt, [
          l[49] || (l[49] = e("span", null, [
            $("Drop noisy chunks"),
            e("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          c(Q, {
            modelValue: n.value.scout.drop_noise,
            "onUpdate:modelValue": l[13] || (l[13] = (a) => n.value.scout.drop_noise = a),
            label: "Drop noisy chunks",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : p("", !0),
        e("div", Rt, [
          l[50] || (l[50] = e("span", null, [
            $("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          c(Q, {
            modelValue: n.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (a) => n.value.scout.share_notes = a),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.scout.mode === "agent" ? (s(), o(S, { key: 4 }, [
          l[51] || (l[51] = e("h4", null, "Agent tools", -1)),
          (s(!0), o(S, null, O(y(m), (a) => (s(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, i(y(Ue)(a)), 1),
            c(Q, {
              "model-value": n.value.scout.tools.includes(a),
              label: y(Ue)(a),
              disabled: t.readonly,
              "onUpdate:modelValue": (q) => N(a, q)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      t.stage === "deep" ? (s(), o(S, { key: 3 }, [
        e("div", At, [
          l[54] || (l[54] = e("span", null, "Stage enabled", -1)),
          c(Q, {
            modelValue: n.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (a) => n.value.deep.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        c(vt, {
          fields: x.value,
          parallel: n.value.deep.parallel_fields,
          queries: n.value.deep.max_queries,
          "per-query": n.value.deep.chunks_per_query,
          cap: n.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Dt, [
          l[55] || (l[55] = e("span", { id: "read-label" }, "Reads", -1)),
          c(ve, {
            modelValue: n.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (a) => n.value.deep.read = a),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[56] || (l[56] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[59] || (l[59] = e("h4", null, "Models", -1)),
        e("div", Lt, [
          l[57] || (l[57] = e("span", null, "Analysis", -1)),
          c(te, {
            value: n.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (a) => n.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", Ft, [
          l[58] || (l[58] = e("span", null, "Query writer", -1)),
          c(te, {
            value: n.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (a) => n.value.deep.query_model = a)
          }, null, 8, ["value"])
        ]),
        l[60] || (l[60] = e("h4", null, "Reach", -1)),
        c(Y, {
          modelValue: n.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (a) => n.value.deep.parallel_fields = a),
          label: "Fields at a time",
          min: b("parallel_fields").min,
          max: b("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (a) => n.value.deep.max_queries = a),
          label: "Queries per field",
          min: b("max_queries").min,
          max: b("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (a) => n.value.deep.chunks_per_query = a),
          label: "Chunks per query",
          min: b("chunks_per_query").min,
          max: b("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (a) => n.value.deep.chunk_cap = a),
          label: "Chunk cap per field",
          min: b("chunk_cap").min,
          max: b("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.deep.min_similarity,
          "onUpdate:modelValue": l[23] || (l[23] = (a) => n.value.deep.min_similarity = a),
          label: "Minimum similarity",
          min: b("min_similarity").min,
          max: b("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[61] || (l[61] = e("h4", null, "Temperature", -1)),
        c(Y, {
          modelValue: n.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (a) => n.value.deep.query_temperature = a),
          label: "Query writing",
          min: b("query_temperature").min,
          max: b("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        c(Y, {
          modelValue: n.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[25] || (l[25] = (a) => n.value.deep.analysis_temperature = a),
          label: "Analysis",
          min: b("analysis_temperature").min,
          max: b("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : p("", !0),
      t.stage === "extract" ? (s(), o(S, { key: 4 }, [
        l[64] || (l[64] = e("h4", null, "Models", -1)),
        e("div", Ot, [
          l[62] || (l[62] = e("span", null, "Extraction", -1)),
          c(te, {
            value: n.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (a) => n.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        l[65] || (l[65] = e("h4", null, "Field groups", -1)),
        e("ul", zt, [
          (s(!0), o(S, null, O(k.value, (a) => (s(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Pt, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        k.value.length ? p("", !0) : (s(), o("p", It, "No fields yet.")),
        c(Y, {
          modelValue: n.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (a) => n.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: b("max_fields_per_call").min,
          max: b("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${y(ze)(t.config)} extraction call${y(ze)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        c(Y, {
          modelValue: n.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[28] || (l[28] = (a) => n.value.extract.max_output_tokens = a),
          label: "Output limit",
          min: b("max_output_tokens").min,
          max: b("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Wt, [
          l[63] || (l[63] = e("span", null, [
            $("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          c(Q, {
            modelValue: n.value.extract.structured_output,
            "onUpdate:modelValue": l[29] || (l[29] = (a) => n.value.extract.structured_output = a),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : p("", !0),
      t.stage === "verify" ? (s(), o(S, { key: 5 }, [
        e("div", jt, [
          l[66] || (l[66] = e("span", null, "Stage enabled", -1)),
          c(Q, {
            modelValue: n.value.verify.enabled,
            "onUpdate:modelValue": l[30] || (l[30] = (a) => n.value.verify.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Qt, [
          l[67] || (l[67] = e("span", null, [
            $("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          c(Q, {
            modelValue: n.value.verify.check_quotes,
            "onUpdate:modelValue": l[31] || (l[31] = (a) => n.value.verify.check_quotes = a),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Kt, [
          l[68] || (l[68] = e("span", null, [
            $("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          c(Q, {
            modelValue: n.value.verify.check_support,
            "onUpdate:modelValue": l[32] || (l[32] = (a) => n.value.verify.check_support = a),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.verify.check_support ? (s(), o(S, { key: 0 }, [
          l[70] || (l[70] = e("h4", null, "Models", -1)),
          e("div", Ht, [
            l[69] || (l[69] = e("span", null, "Checker", -1)),
            c(te, {
              value: n.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[33] || (l[33] = (a) => n.value.verify.model = a)
            }, null, 8, ["value"])
          ])
        ], 64)) : p("", !0)
      ], 64)) : p("", !0)
    ], 8, bt));
  }
}), Yt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Gt = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Xt = ["x", "y", "width"], Zt = ["x", "width"], _t = /* @__PURE__ */ j({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const r = t, n = R(() => Math.min(0.9, Math.max(0, r.overlap / r.size))), b = R(() => {
      const m = 100 / (3 - 2 * n.value);
      return [0, 1, 2].map((x) => ({ x: x * m * (1 - n.value), w: m }));
    });
    return (m, x) => (s(), o("figure", Yt, [
      (s(), o("svg", Gt, [
        (s(!0), o(S, null, O(b.value, (f, k) => (s(), o("rect", {
          key: k,
          x: f.x,
          y: k % 2 ? 14 : 4,
          width: f.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Xt))), 128)),
        (s(), o(S, null, O([1, 2], (f) => e("rect", {
          key: "o" + f,
          x: b.value[f].x,
          y: 4,
          width: b.value[f - 1].x + b.value[f - 1].w - b.value[f].x,
          height: "24",
          class: "shared"
        }, null, 8, Zt)), 64))
      ])),
      e("figcaption", null, i(t.size.toLocaleString()) + " tokens per chunk · " + i(t.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(n.value * 100)) + "%)", 1)
    ]));
  }
}), ea = ["disabled"], la = { class: "muted" }, ta = { class: "toggle-row" }, aa = { class: "toggle-row" }, na = { class: "label-block" }, sa = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, oa = { class: "label-block" }, ia = {
  id: "embedding-model",
  class: "model-role"
}, ua = { class: "toggle-row" }, da = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, ra = /* @__PURE__ */ j({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const r = t, n = R(() => r.config.retrieval), b = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], m = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], x = Ve("chunk_size"), f = Ve("overlap"), k = Ve("section_budget"), N = R(() => Math.min(f.max, n.value.chunk_size - 50));
    return (w, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", la, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(t.retention) + ".", 1),
      l[19] || (l[19] = e("h4", null, "Chunks", -1)),
      c(_t, {
        size: n.value.chunk_size,
        overlap: n.value.overlap
      }, null, 8, ["size", "overlap"]),
      c(Y, {
        modelValue: n.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (a) => n.value.chunk_size = a),
        label: "Chunk size",
        min: y(x).min,
        max: y(x).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      c(Y, {
        modelValue: n.value.overlap,
        "onUpdate:modelValue": l[1] || (l[1] = (a) => n.value.overlap = a),
        label: "Overlap",
        min: y(f).min,
        max: N.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", ta, [
        l[11] || (l[11] = e("span", null, [
          $("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        c(Q, {
          modelValue: n.value.split_headings,
          "onUpdate:modelValue": l[2] || (l[2] = (a) => n.value.split_headings = a),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", aa, [
        l[12] || (l[12] = e("span", null, [
          $("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        c(Q, {
          modelValue: n.value.keep_tables,
          "onUpdate:modelValue": l[3] || (l[3] = (a) => n.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      c(Y, {
        modelValue: n.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (a) => n.value.section_budget = a),
        label: "Section budget",
        min: y(k).min,
        max: y(k).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", na, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        c(ve, {
          modelValue: n.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (a) => n.value.context = a),
          "labelled-by": "context-label",
          options: m
        }, null, 8, ["modelValue"]),
        e("small", null, i(m.find((a) => a.value === n.value.context)?.note), 1)
      ]),
      n.value.context === "generated" ? (s(), o("div", sa, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        c(te, {
          value: n.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (a) => n.value.context_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", oa, [
        l[15] || (l[15] = e("span", { id: "mode-label" }, "Search mode", -1)),
        c(ve, {
          modelValue: n.value.search_mode,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => n.value.search_mode = a),
          "labelled-by": "mode-label",
          options: b
        }, null, 8, ["modelValue"]),
        e("small", null, i(b.find((a) => a.value === n.value.search_mode)?.note), 1)
      ]),
      l[22] || (l[22] = e("h4", null, "Models", -1)),
      e("div", ia, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        c(te, {
          value: n.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[8] || (l[8] = (a) => n.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      e("div", ua, [
        l[17] || (l[17] = e("span", null, [
          $("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        c(Q, {
          modelValue: n.value.highlighter,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => n.value.highlighter = a),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      n.value.highlighter ? (s(), o("div", da, [
        l[18] || (l[18] = e("span", null, "Highlighter", -1)),
        c(te, {
          value: n.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[10] || (l[10] = (a) => n.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0)
    ], 8, ea));
  }
}), ca = { class: "canvas" }, ma = { class: "canvas-inner" }, va = {
  class: "block",
  "aria-labelledby": "fields-head"
}, ba = { class: "block-head" }, pa = ["aria-expanded"], fa = { class: "count" }, ya = {
  key: 0,
  class: "block-peek"
}, ga = {
  id: "fields-body",
  class: "block-body"
}, ha = {
  key: 0,
  class: "block-empty"
}, ka = {
  key: 1,
  class: "rows"
}, $a = ["onClick"], xa = { class: "row-name" }, wa = {
  key: 0,
  class: "req",
  title: "Required"
}, Va = { class: "chips" }, Sa = {
  key: 1,
  class: "chip"
}, Ca = ["title"], qa = { class: "chip" }, Ua = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Ea = {
  key: 0,
  class: "row-actions"
}, Ma = ["disabled", "onClick"], Na = ["disabled", "onClick"], Ba = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ta = { class: "block-head" }, Ra = ["aria-expanded"], Aa = { class: "count" }, Da = {
  key: 0,
  class: "block-peek"
}, La = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Fa = { class: "node-icon" }, Oa = { class: "node-main" }, za = { class: "node-summary" }, Pa = { class: "node-side" }, Ia = { class: "chip model" }, Wa = { class: "branches" }, ja = { class: "branch" }, Qa = { class: "branch" }, Ka = { class: "node-icon" }, Ha = { class: "node-main" }, Ja = { class: "node-summary" }, Ya = ["role", "aria-modal"], Ga = ["aria-valuenow"], Xa = { class: "side-panel-head" }, Za = { class: "side-panel-icon" }, _a = ["aria-label", "title"], en = ["disabled"], ln = {
  key: 4,
  class: "inspector-form"
}, tn = { class: "output-list" }, an = { class: "mono" }, nn = { class: "chip" }, sn = { class: "rail-label" }, Se = 400, ge = 320, on = /* @__PURE__ */ j({
  __name: "Builder",
  props: /* @__PURE__ */ xe({
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
    const r = t, n = ye(t, "title"), b = ye(t, "description"), m = A({ kind: "document" });
    function x(h, u) {
      try {
        const U = localStorage.getItem(`docscout.${h}`);
        return U === null ? u : U === "1";
      } catch {
        return u;
      }
    }
    function f(h, u) {
      try {
        localStorage.setItem(`docscout.${h}`, u ? "1" : "0");
      } catch {
      }
    }
    const k = A(x("panel", !0)), N = A(x("fields", !0)), w = A(x("flow", !0));
    function l() {
      try {
        const h = Number(localStorage.getItem("docscout.panelWidth"));
        return h >= ge ? h : Se;
      } catch {
        return Se;
      }
    }
    const a = A(l()), q = () => {
      const h = _.value?.clientWidth;
      return h ? Math.max(ge, h - 420) : Number.POSITIVE_INFINITY;
    };
    function z(h, u = !0) {
      if (a.value = Math.round(Math.min(q(), Math.max(ge, h))), u)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const C = A(!1);
    function L(h) {
      const u = h.currentTarget, U = h.clientX, J = a.value;
      u.setPointerCapture(h.pointerId), C.value = !0;
      const se = (_e) => z(J + (U - _e.clientX), !1), De = () => {
        C.value = !1, z(a.value), u.removeEventListener("pointermove", se), u.removeEventListener("pointerup", De);
      };
      u.addEventListener("pointermove", se), u.addEventListener("pointerup", De);
    }
    function V(h) {
      h.key === "ArrowLeft" ? (z(a.value + 24), h.preventDefault()) : h.key === "ArrowRight" && (z(a.value - 24), h.preventDefault());
    }
    let E = null;
    const M = A();
    function D(h) {
      if (k.value = h, !I.value) {
        f("panel", h);
        return;
      }
      !h && E && (E.focus(), E = null);
    }
    function K(h) {
      const u = h === "fields" ? N : w;
      u.value = !u.value, f(h, u.value);
    }
    const _ = A(), I = A(!1);
    let le;
    we(() => {
      le = new ResizeObserver(([h]) => {
        const u = I.value;
        I.value = h.contentRect.width < 1e3, I.value && !u && (k.value = !1), !I.value && u && (k.value = x("panel", !0));
      }), _.value && le.observe(_.value);
    }), Ie(() => le?.disconnect());
    const ee = A();
    ue(m, async () => {
      await Le(), ee.value && (ee.value.scrollTop = 0);
    });
    async function H(h) {
      I.value && !k.value && (E = _.value?.getRootNode()?.activeElement), m.value = h, k.value = !0, I.value && (await Le(), M.value?.focus());
    }
    const G = (h) => JSON.stringify(h) === JSON.stringify(m.value), T = R(() => m.value.kind === "field" ? r.config.fields[m.value.index] : void 0), g = R(() => {
      const h = m.value;
      return h.kind === "stage" ? ie[h.stage] : h.kind === "field" ? T.value?.name || "New field" : h.kind === "document" ? "Read document" : h.kind === "output" ? "Output" : "Details";
    }), v = R(() => {
      const h = m.value;
      return h.kind === "stage" ? Me[h.stage] : h.kind === "field" ? "tabler:forms" : h.kind === "document" ? "tabler:file-text" : h.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), d = R(() => r.config.fields.filter((h, u) => !(m.value.kind === "field" && m.value.index === u)).map((h) => h.name)), B = R(() => r.config.stages.deep.enabled), ne = R(() => r.config.stages.map.enabled), He = R(() => [...new Set(r.config.fields.map((h) => h.group.trim()).filter(Boolean))]), Ne = (h) => Qe(r.config.fields[h], r.config.fields.filter((u, U) => U !== h).map((u) => u.name)), Be = ["map", "prefetch", "scout", "deep", "extract", "verify"], Je = R(() => Be.filter((h) => he(r.config, h)).map((h) => ie[h]).join(" · ")), Ye = R(() => r.config.fields.map((h) => h.name || "New field").join(", ")), Ge = R(() => Be.filter((h) => he(r.config, h)).length), de = (h) => r.result?.trace.find((u) => u.kind === h);
    function Xe() {
      r.config.fields.push(rl()), N.value = !0, H({ kind: "field", index: r.config.fields.length - 1 });
    }
    function Ze(h) {
      r.config.fields.splice(h, 1), m.value = { kind: "document" };
    }
    function Te(h, u) {
      const U = r.config.fields, J = h + u;
      if (J < 0 || J >= U.length) return;
      const [se] = U.splice(h, 1);
      U.splice(J, 0, se), m.value = { kind: "field", index: J };
    }
    const Re = (h) => h.type === "list" ? `list of ${h.item_type}` : h.type, Ae = R({ get: () => r.config.tags.join(", "), set: (h) => {
      r.config.tags = [...new Set(h.split(",").map((u) => u.trim()).filter(Boolean))];
    } });
    return (h, u) => (s(), o("div", {
      ref_key: "root",
      ref: _,
      class: P(["builder", { narrow: I.value, "panel-open": k.value, resizing: C.value }])
    }, [
      e("div", ca, [
        e("div", ma, [
          e("section", va, [
            e("header", ba, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": N.value,
                "aria-controls": "fields-body",
                onClick: u[0] || (u[0] = (U) => K("fields"))
              }, [
                c(y(F), {
                  icon: N.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                u[20] || (u[20] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", fa, i(t.config.fields.length), 1)
              ], 8, pa),
              !N.value && t.config.fields.length ? (s(), o("span", ya, i(Ye.value), 1)) : p("", !0),
              t.readonly ? p("", !0) : (s(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: Xe
              }, [
                c(y(F), { icon: "tabler:plus" }),
                u[21] || (u[21] = $("Add field", -1))
              ]))
            ]),
            W(e("div", ga, [
              t.config.fields.length ? (s(), o("ul", ka, [
                (s(!0), o(S, null, O(t.config.fields, (U, J) => (s(), o("li", {
                  key: J,
                  class: P(["row-item", { active: G({ kind: "field", index: J }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (se) => H({ kind: "field", index: J })
                  }, [
                    e("span", xa, [
                      $(i(U.name || "New field"), 1),
                      U.required ? (s(), o("span", wa, "*")) : p("", !0),
                      Ne(J) ? (s(), Z(y(F), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: Ne(J)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: P(["row-desc", { missing: !U.description }])
                    }, i(U.description || "No description"), 3),
                    e("span", Va, [
                      U.search_within === "sections" ? (s(), o("span", {
                        key: 0,
                        class: P(["chip", ne.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      U.group.trim() ? (s(), o("span", Sa, i(U.group), 1)) : p("", !0),
                      U.strategy === "deep" ? (s(), o("span", {
                        key: 2,
                        class: P(["chip", B.value ? "primary" : "muted-chip"]),
                        title: B.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, Ca)) : p("", !0),
                      e("span", qa, i(Re(U)), 1),
                      U.evidence_required ? (s(), o("span", Ua, [
                        c(y(F), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, $a),
                  t.readonly ? p("", !0) : (s(), o("span", Ea, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: J === 0,
                      onClick: (se) => Te(J, -1)
                    }, [
                      c(y(F), { icon: "tabler:chevron-up" })
                    ], 8, Ma),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: J === t.config.fields.length - 1,
                      onClick: (se) => Te(J, 1)
                    }, [
                      c(y(F), { icon: "tabler:chevron-down" })
                    ], 8, Na)
                  ]))
                ], 2))), 128))
              ])) : (s(), o("p", ha, "Add the values to pull from each document."))
            ], 512), [
              [qe, N.value]
            ])
          ]),
          e("section", Ba, [
            e("header", Ta, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: u[1] || (u[1] = (U) => K("flow"))
              }, [
                c(y(F), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                u[22] || (u[22] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Aa, i(Ge.value) + " of 6", 1)
              ], 8, Ra),
              w.value ? p("", !0) : (s(), o("span", Da, i(Je.value), 1)),
              e("button", {
                type: "button",
                class: P(["btn small subtle push", { on: G({ kind: "details" }) }]),
                onClick: u[2] || (u[2] = (U) => H({ kind: "details" }))
              }, [
                c(y(F), { icon: "tabler:info-circle" }),
                u[23] || (u[23] = $("Details", -1))
              ], 2)
            ]),
            W(e("div", La, [
              e("button", {
                type: "button",
                class: P(["node fixed", { active: G({ kind: "document" }) }]),
                onClick: u[3] || (u[3] = (U) => H({ kind: "document" }))
              }, [
                e("span", Fa, [
                  c(y(F), { icon: "tabler:file-text" })
                ]),
                e("span", Oa, [
                  u[24] || (u[24] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", za, i(y(dl)(t.config.retrieval)), 1)
                ]),
                e("span", Pa, [
                  e("span", Ia, i(y(je)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              u[29] || (u[29] = e("div", { class: "connector" }, null, -1)),
              c(ce, {
                stage: "map",
                config: t.config,
                active: G({ kind: "stage", stage: "map" }),
                trace: de("map"),
                readonly: t.readonly,
                onSelect: u[4] || (u[4] = (U) => H({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              u[30] || (u[30] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", Wa, [
                e("div", ja, [
                  u[25] || (u[25] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  c(ce, {
                    stage: "prefetch",
                    config: t.config,
                    active: G({ kind: "stage", stage: "prefetch" }),
                    trace: de("prefetch"),
                    readonly: t.readonly,
                    onSelect: u[5] || (u[5] = (U) => H({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  u[26] || (u[26] = e("div", { class: "connector" }, null, -1)),
                  c(ce, {
                    stage: "scout",
                    config: t.config,
                    active: G({ kind: "stage", stage: "scout" }),
                    trace: de("scout"),
                    readonly: t.readonly,
                    onSelect: u[6] || (u[6] = (U) => H({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Qa, [
                  u[27] || (u[27] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  c(ce, {
                    stage: "deep",
                    config: t.config,
                    active: G({ kind: "stage", stage: "deep" }),
                    trace: de("deep"),
                    readonly: t.readonly,
                    onSelect: u[7] || (u[7] = (U) => H({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              u[31] || (u[31] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              c(ce, {
                stage: "extract",
                config: t.config,
                active: G({ kind: "stage", stage: "extract" }),
                trace: de("extract"),
                readonly: t.readonly,
                onSelect: u[8] || (u[8] = (U) => H({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              u[32] || (u[32] = e("div", { class: "connector" }, null, -1)),
              c(ce, {
                stage: "verify",
                config: t.config,
                active: G({ kind: "stage", stage: "verify" }),
                trace: de("verify"),
                readonly: t.readonly,
                onSelect: u[9] || (u[9] = (U) => H({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              u[33] || (u[33] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: P(["node fixed", { active: G({ kind: "output" }) }]),
                onClick: u[10] || (u[10] = (U) => H({ kind: "output" }))
              }, [
                e("span", Ka, [
                  c(y(F), { icon: "tabler:braces" })
                ]),
                e("span", Ha, [
                  u[28] || (u[28] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", Ja, i(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [qe, w.value]
            ])
          ])
        ])
      ]),
      I.value && k.value ? (s(), o("div", {
        key: 0,
        class: "scrim",
        onClick: u[11] || (u[11] = (U) => D(!1))
      })) : p("", !0),
      k.value ? (s(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        role: I.value ? "dialog" : void 0,
        "aria-modal": I.value ? "true" : void 0,
        style: be(I.value ? void 0 : { width: `${a.value}px` }),
        onKeydown: u[18] || (u[18] = Ce((U) => I.value && D(!1), ["esc"]))
      }, [
        I.value ? p("", !0) : (s(), o("div", {
          key: 0,
          class: P(["resizer", { active: C.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": ge,
          onPointerdown: $e(L, ["prevent"]),
          onKeydown: V,
          onDblclick: u[12] || (u[12] = (U) => z(Se))
        }, null, 42, Ga)),
        e("header", Xa, [
          e("span", Za, [
            c(y(F), { icon: v.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(g.value), 1),
          e("button", {
            ref_key: "closeButton",
            ref: M,
            type: "button",
            class: "icon-btn push",
            "aria-label": I.value ? "Close panel" : "Collapse panel",
            title: I.value ? "Close panel" : "Collapse panel",
            onClick: u[13] || (u[13] = (U) => D(!1))
          }, [
            c(y(F), {
              icon: I.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ], 8, _a)
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: ee,
          class: "side-panel-body"
        }, [
          m.value.kind === "document" ? (s(), Z(ra, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : m.value.kind === "stage" ? (s(), Z(Jt, {
            key: 1,
            stage: m.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : m.value.kind === "field" && T.value ? (s(), Z(jl, {
            key: 2,
            field: T.value,
            "other-names": d.value,
            groups: He.value,
            "deep-enabled": B.value,
            "map-enabled": ne.value,
            readonly: t.readonly,
            onRemove: u[14] || (u[14] = (U) => Ze(m.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : m.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              u[34] || (u[34] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": u[15] || (u[15] = (U) => n.value = U),
                "aria-label": "Extractor name"
              }, null, 512), [
                [X, n.value]
              ])
            ]),
            e("label", null, [
              u[35] || (u[35] = $("Description", -1)),
              W(e("textarea", {
                "onUpdate:modelValue": u[16] || (u[16] = (U) => b.value = U),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [X, b.value]
              ])
            ]),
            e("label", null, [
              u[36] || (u[36] = $("Tags", -1)),
              W(e("input", {
                "onUpdate:modelValue": u[17] || (u[17] = (U) => Ae.value = U),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  X,
                  Ae.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              u[37] || (u[37] = e("small", null, "Comma separated", -1))
            ])
          ], 8, en)) : m.value.kind === "output" ? (s(), o("div", ln, [
            u[38] || (u[38] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", tn, [
              (s(!0), o(S, null, O(t.config.fields, (U) => (s(), o("li", {
                key: U.name
              }, [
                e("span", an, i(U.name || "New field"), 1),
                e("span", nn, i(Re(U)), 1)
              ]))), 128))
            ]),
            u[39] || (u[39] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 44, Ya)) : I.value ? p("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: u[19] || (u[19] = (U) => D(!0))
      }, [
        c(y(F), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", sn, i(g.value), 1)
      ]))
    ], 2));
  }
}), un = ["selected"], dn = {
  key: 1,
  role: "alert"
}, rn = {
  key: 2,
  class: "muted"
}, Ke = /* @__PURE__ */ j({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: r }) {
    const n = r, b = A(!1), m = A("");
    we(async () => {
      try {
        await Ee("wc-multiselect", { timeoutMs: 8e3 }), b.value = !0;
      } catch (f) {
        m.value = String(f);
      }
    });
    function x(f) {
      const k = f.detail;
      n("select", k.selected[0] || "", k.labels?.[0] || "");
    }
    return (f, k) => b.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: x
    }, null, 40, un)) : m.value ? (s(), o("p", dn, i(m.value), 1)) : (s(), o("span", rn, "Loading uploads…"));
  }
}), cn = { class: "test" }, mn = { class: "run-bar" }, vn = { class: "run-input" }, bn = { class: "muted run-note" }, pn = {
  key: 0,
  class: "empty"
}, fn = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, yn = {
  key: 2,
  class: "test-grid"
}, gn = { class: "block" }, hn = { class: "block-head" }, kn = { class: "muted push" }, $n = { class: "value-list" }, xn = ["aria-expanded", "onClick"], wn = { class: "value-name" }, Vn = ["title"], Sn = { class: "bar" }, Cn = ["title"], qn = { class: "evidence" }, Un = {
  key: 0,
  class: "full-value"
}, En = {
  key: 1,
  class: "muted"
}, Mn = {
  key: 2,
  class: "muted"
}, Nn = { class: "block" }, Bn = { class: "timeline" }, Tn = { class: "tl-icon" }, Rn = { class: "tl-main" }, An = { class: "tl-head" }, Dn = { class: "muted push" }, Ln = { class: "tl-bar" }, Fn = { class: "muted" }, On = {
  key: 0,
  class: "tl-msg"
}, zn = {
  key: 1,
  class: "chips"
}, Pn = /* @__PURE__ */ j({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: r }) {
    const n = t, b = r, m = A(""), x = A(), f = (C) => `${Math.round(C * 100)}%`, k = (C) => C == null ? "—" : typeof C == "string" ? C : Array.isArray(C) && C.every((L) => typeof L != "object") ? C.join(", ") : typeof C == "object" ? JSON.stringify(C) : String(C), N = (C) => `${(C / 1e3).toFixed(1)}s`, w = R(() => Math.max(1, ...n.result?.trace.map((C) => C.duration_ms) ?? [1])), l = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, a = (C) => l[C]?.label ?? ie[C] ?? C, q = (C) => l[C]?.icon ?? Me[C] ?? "tabler:point", z = (C) => C >= 0.9 ? "high" : C >= 0.7 ? "mid" : "low";
    return (C, L) => (s(), o("div", cn, [
      e("section", mn, [
        e("div", vn, [
          c(Ke, {
            value: m.value,
            onSelect: L[0] || (L[0] = (V) => m.value = V)
          }, null, 8, ["value"])
        ]),
        c(y(oe), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !m.value || t.running || !t.canRun,
          onClick: L[1] || (L[1] = (V) => b("run", m.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", bn, i(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(t.retention) + ".", 1)
      ]),
      t.result ? p("", !0) : (s(), o("p", pn, "No extraction results yet.")),
      t.result?.status === "failed" ? (s(), o("p", fn, [
        c(y(F), { icon: "tabler:alert-triangle" }),
        $("The run stopped: " + i(t.result.error), 1)
      ])) : p("", !0),
      t.result ? (s(), o("div", yn, [
        e("section", gn, [
          e("header", hn, [
            L[2] || (L[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", kn, [
              $(i(t.result.tokens.toLocaleString()) + " tokens · " + i(N(t.result.duration_ms)), 1),
              t.result.pages ? (s(), o(S, { key: 0 }, [
                $(" · " + i(t.result.pages) + " pages", 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", $n, [
            (s(!0), o(S, null, O(t.result.fields, (V) => (s(), o("li", {
              key: V.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": x.value === V.name,
                onClick: (E) => x.value = x.value === V.name ? void 0 : V.name
              }, [
                e("span", wn, i(V.name), 1),
                e("span", {
                  class: P(["value-text", { missing: V.missing }]),
                  title: V.missing ? void 0 : k(V.value)
                }, i(V.missing ? "Not in the document" : k(V.value)), 11, Vn),
                e("span", {
                  class: P(["confidence", z(V.confidence)])
                }, [
                  e("span", Sn, [
                    e("span", {
                      style: be({ width: f(V.confidence) })
                    }, null, 4)
                  ]),
                  $(i(f(V.confidence)), 1),
                  L[3] || (L[3] = e("span", { class: "conf-word" }, " confidence", -1))
                ], 2),
                e("span", {
                  class: P(["chip", V.verified ? "primary" : "warn"]),
                  title: V.reason
                }, [
                  c(y(F), {
                    icon: V.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  $(i(V.verified ? "Verified" : "Check"), 1)
                ], 10, Cn),
                c(y(F), {
                  icon: x.value === V.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, xn),
              W(e("div", qn, [
                V.missing ? p("", !0) : (s(), o("p", Un, i(k(V.value)), 1)),
                (s(!0), o(S, null, O(V.evidence, (E, M) => (s(), o("blockquote", {
                  key: M,
                  class: P({ unfound: E.found === !1 })
                }, [
                  e("p", null, "“" + i(E.quote) + "”", 1),
                  e("cite", null, [
                    $(i(E.section), 1),
                    E.page !== void 0 && E.page !== null ? (s(), o(S, { key: 0 }, [
                      $(" · Page " + i(E.page), 1)
                    ], 64)) : p("", !0),
                    E.found === !1 ? (s(), o(S, { key: 1 }, [
                      $(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                V.evidence.length ? p("", !0) : (s(), o("p", En, "No evidence.")),
                V.reason ? (s(), o("p", Mn, i(V.reason), 1)) : p("", !0)
              ], 512), [
                [qe, x.value === V.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Nn, [
          L[4] || (L[4] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Bn, [
            (s(!0), o(S, null, O(t.result.trace, (V, E) => (s(), o("li", {
              key: E,
              class: P(V.status)
            }, [
              e("span", Tn, [
                c(y(F), {
                  icon: q(V.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Rn, [
                e("div", An, [
                  e("strong", null, i(a(V.kind)), 1),
                  e("span", Dn, i(N(V.duration_ms)), 1)
                ]),
                e("span", Ln, [
                  e("span", {
                    style: be({ width: `${Math.max(4, V.duration_ms / w.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Fn, [
                  $(i(V.scope), 1),
                  V.model ? (s(), o(S, { key: 0 }, [
                    $(" · " + i(V.model), 1)
                  ], 64)) : p("", !0),
                  $(" · " + i((V.input_tokens + V.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                V.message ? (s(), o("p", On, i(V.message), 1)) : p("", !0),
                V.queries?.length ? (s(), o("div", zn, [
                  (s(!0), o(S, null, O(V.queries, (M) => (s(), o("span", {
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
});
function ke(t, r = /* @__PURE__ */ new Date()) {
  const n = new Date(t);
  return n.toDateString() === r.toDateString() ? n.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : n.getFullYear() === r.getFullYear() ? n.toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : n.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
const In = { class: "evals" }, Wn = { class: "block eval-run" }, jn = { class: "eval-run-main" }, Qn = { class: "block-title" }, Kn = {
  key: 0,
  class: "eval-note"
}, Hn = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Jn = { class: "bar" }, Yn = { class: "muted" }, Gn = { class: "stat-row" }, Xn = { class: "stat" }, Zn = { class: "stat-label" }, _n = { class: "stat-value" }, es = { class: "stat" }, ls = { class: "stat-value" }, ts = { class: "stat-delta flat" }, as = { class: "stat" }, ns = { class: "stat-value" }, ss = {
  key: 0,
  class: "stat-delta flat"
}, os = { class: "stat" }, is = { class: "stat-value" }, us = {
  key: 0,
  class: "stat-delta flat"
}, ds = { class: "block" }, rs = { class: "block-head" }, cs = {
  key: 0,
  class: "compare-pick push"
}, ms = ["value"], vs = ["value"], bs = {
  key: 0,
  class: "block-empty"
}, ps = {
  key: 1,
  class: "table-scroll"
}, fs = { key: 0 }, ys = { key: 1 }, gs = { class: "mono" }, hs = { class: "acc strong" }, ks = { class: "bar" }, $s = { class: "muted" }, xs = {
  key: 0,
  class: "muted"
}, ws = { key: 1 }, Vs = {
  key: 1,
  class: "muted"
}, Ss = {
  key: 1,
  class: "block"
}, Cs = { class: "table-scroll" }, qs = { class: "metric-table result-matrix" }, Us = ["aria-expanded", "onClick"], Es = ["colspan"], Ms = {
  key: 0,
  class: "cell-state"
}, Ns = {
  key: 1,
  class: "cell-state fail"
}, Bs = ["data-label"], Ts = ["title"], Rs = {
  key: 0,
  class: "result-detail"
}, As = ["colspan"], Ds = {
  key: 0,
  class: "muted"
}, Ls = {
  key: 1,
  class: "compare"
}, Fs = { class: "mono" }, Os = { class: "cmp" }, zs = { class: "cmp" }, Ps = { class: "muted case-meta" }, Is = { class: "block" }, Ws = { class: "block-head" }, js = { class: "count" }, Qs = { class: "grid" }, Ks = { class: "mono" }, Hs = ["onUpdate:modelValue"], Js = ["onUpdate:modelValue"], Ys = ["onUpdate:modelValue", "placeholder"], Gs = ["onUpdate:modelValue", "type"], Xs = {
  key: 0,
  class: "error",
  role: "alert"
}, Zs = { class: "row" }, _s = {
  key: 1,
  class: "block-empty"
}, eo = {
  key: 2,
  class: "block-empty"
}, lo = {
  key: 3,
  class: "table-scroll"
}, to = { class: "metric-table case-table" }, ao = ["data-label"], no = { class: "num" }, so = ["aria-label", "disabled", "onClick"], oo = {
  key: 2,
  class: "block"
}, io = { class: "block-head" }, uo = { class: "count" }, ro = { class: "eval-history" }, co = ["aria-current", "onClick"], mo = ["data-status"], vo = { class: "muted" }, bo = { class: "push" }, po = /* @__PURE__ */ j({
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
  setup(t, { emit: r }) {
    const n = t, b = r, m = A(!1), x = A(""), f = A({}), k = A("");
    ue(() => n.cases, () => {
      m.value = !1, x.value = "", f.value = {};
    });
    function N(g, v) {
      return g.type === "number" ? Number(v) : g.type === "boolean" ? v === "true" : g.type === "list" || g.type === "object" ? JSON.parse(v) : v;
    }
    function w() {
      k.value = "";
      const g = {};
      try {
        for (const v of n.fields) {
          const d = String(f.value[v.name] ?? "").trim();
          d && (g[v.name] = N(v, d));
        }
      } catch {
        k.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      b("add-case", { upload_id: x.value, expected: g });
    }
    const l = R(() => n.evaluations.find((g) => !pe(g))), a = R(() => n.evaluations.filter(pe)), q = R(() => n.evaluation), z = R(() => ({ done: (q.value?.results ?? []).filter((v) => v.status !== "queued").length, total: q.value?.case_count ?? 0 })), C = A();
    ue(() => q.value?.id, () => {
      C.value = void 0;
    });
    const L = R(() => {
      if (!q.value) return;
      if (C.value) return a.value.find((v) => v.id === C.value);
      const g = a.value.findIndex((v) => v.id === q.value.id);
      return g >= 0 ? a.value[g + 1] : a.value[0];
    }), V = R(() => (q.value?.metrics ?? []).map((g) => ({ ...g, before: L.value?.metrics.find((v) => v.field === g.field) }))), E = R(() => (q.value?.fields ?? []).map((g) => g.name)), M = (g, v) => g.scores.find((d) => d.field === v), D = A(), K = (g) => `${Math.round(g * 100)}%`, _ = (g) => {
      const v = Math.round(g * 100);
      return `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v)} pts`;
    }, I = (g) => Math.round(g * 100) > 0 ? "up" : Math.round(g * 100) < 0 ? "down" : "flat", le = (g) => g >= 6e4 ? `${Math.floor(g / 6e4)}m ${Math.round(g % 6e4 / 1e3)}s` : `${(g / 1e3).toFixed(1)}s`, ee = (g) => g == null || g === "" ? "—" : typeof g == "string" ? g : Array.isArray(g) && g.every((v) => typeof v != "object") ? g.join(", ") : JSON.stringify(g), H = (g) => g ? g.score >= 0.999 ? "pass" : g.score > 0 ? "partial" : "fail" : "none", G = (g) => (g.results ?? []).filter((v) => v.status === "completed").length, T = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (g, v) => (s(), o("div", In, [
      e("section", Wn, [
        e("div", jn, [
          e("div", null, [
            e("h2", Qn, "Evaluate revision " + i(t.revision), 1),
            v[6] || (v[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (s(), o("p", Kn, [
              c(y(F), { icon: "tabler:info-circle" }),
              v[5] || (v[5] = $("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : p("", !0)
          ]),
          c(y(oe), {
            label: l.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!l.value,
            disabled: !t.cases.length || !t.fields.length || !!l.value || t.starting,
            onClick: v[0] || (v[0] = (d) => b("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        q.value && !y(pe)(q.value) ? (s(), o("div", Hn, [
          e("span", Jn, [
            e("span", {
              style: be({ width: K(z.value.total ? z.value.done / z.value.total : 0) })
            }, null, 4)
          ]),
          e("span", Yn, i(T[q.value.status]) + " · " + i(z.value.done) + " of " + i(z.value.total) + " cases", 1)
        ])) : p("", !0)
      ]),
      q.value && y(pe)(q.value) ? (s(), o(S, { key: 0 }, [
        q.value.error ? (s(), o("p", {
          key: 0,
          class: P(q.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          c(y(F), { icon: "tabler:alert-triangle" }),
          $(i(q.value.error), 1)
        ], 2)) : p("", !0),
        e("div", Gn, [
          e("div", Xn, [
            e("span", Zn, "Accuracy · revision " + i(q.value.config_revision), 1),
            e("span", _n, i(K(y(re)(q.value))), 1),
            L.value ? (s(), o("span", {
              key: 0,
              class: P(["stat-delta", I(y(re)(q.value) - y(re)(L.value))])
            }, i(_(y(re)(q.value) - y(re)(L.value))) + " vs revision " + i(L.value.config_revision), 3)) : p("", !0)
          ]),
          e("div", es, [
            v[7] || (v[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", ls, [
              $(i(G(q.value)), 1),
              e("small", null, " / " + i(q.value.case_count), 1)
            ]),
            e("span", ts, i(q.value.case_count - G(q.value)) + " failed", 1)
          ]),
          e("div", as, [
            v[8] || (v[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", ns, i(q.value.tokens.toLocaleString()), 1),
            L.value ? (s(), o("span", ss, i(L.value.tokens.toLocaleString()) + " before", 1)) : p("", !0)
          ]),
          e("div", os, [
            v[9] || (v[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", is, i(le(q.value.duration_ms)), 1),
            L.value ? (s(), o("span", us, i(le(L.value.duration_ms)) + " before", 1)) : p("", !0)
          ])
        ]),
        e("section", ds, [
          e("header", rs, [
            v[11] || (v[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (s(), o("label", cs, [
              v[10] || (v[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: L.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: v[1] || (v[1] = (d) => C.value = d.target.value)
              }, [
                (s(!0), o(S, null, O(a.value.filter((d) => d.id !== q.value.id), (d) => (s(), o("option", {
                  key: d.id,
                  value: d.id
                }, "Revision " + i(d.config_revision) + " · " + i(y(ke)(d.created_at)), 9, vs))), 128))
              ], 40, ms)
            ])) : p("", !0)
          ]),
          V.value.length ? (s(), o("div", ps, [
            e("table", {
              class: P(["metric-table accuracy-table", { comparing: !!L.value }])
            }, [
              e("thead", null, [
                e("tr", null, [
                  v[12] || (v[12] = e("th", null, "Field", -1)),
                  v[13] || (v[13] = e("th", null, "Accuracy", -1)),
                  v[14] || (v[14] = e("th", null, "Verified", -1)),
                  L.value ? (s(), o("th", fs, "Revision " + i(L.value.config_revision), 1)) : p("", !0),
                  L.value ? (s(), o("th", ys, "Change")) : p("", !0)
                ])
              ]),
              e("tbody", null, [
                (s(!0), o(S, null, O(V.value, (d) => (s(), o("tr", {
                  key: d.field
                }, [
                  e("td", gs, i(d.field), 1),
                  e("td", null, [
                    e("span", hs, [
                      e("span", ks, [
                        e("span", {
                          style: be({ width: K(d.accuracy) })
                        }, null, 4)
                      ]),
                      $(i(K(d.accuracy)), 1)
                    ])
                  ]),
                  e("td", $s, i(K(d.verified)), 1),
                  L.value ? (s(), o("td", xs, i(d.before ? K(d.before.accuracy) : "—"), 1)) : p("", !0),
                  L.value ? (s(), o("td", ws, [
                    d.before ? (s(), o("span", {
                      key: 0,
                      class: P(["trend", I(d.accuracy - d.before.accuracy)])
                    }, [
                      c(y(F), {
                        icon: I(d.accuracy - d.before.accuracy) === "up" ? "tabler:trending-up" : I(d.accuracy - d.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      $(i(_(d.accuracy - d.before.accuracy)), 1)
                    ], 2)) : (s(), o("span", Vs, "New field"))
                  ])) : p("", !0)
                ]))), 128))
              ])
            ], 2)
          ])) : (s(), o("p", bs, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : p("", !0),
      q.value?.results?.length ? (s(), o("section", Ss, [
        v[19] || (v[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", Cs, [
          e("table", qs, [
            e("thead", null, [
              e("tr", null, [
                v[15] || (v[15] = e("th", null, "Document", -1)),
                (s(!0), o(S, null, O(E.value, (d) => (s(), o("th", {
                  key: d,
                  class: "mono"
                }, i(d), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(S, null, O(q.value.results, (d) => (s(), o(S, {
                key: d.case_id
              }, [
                e("tr", {
                  class: P(["result-row", { active: D.value === d.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": D.value === d.case_id,
                      onClick: (B) => D.value = D.value === d.case_id ? void 0 : d.case_id
                    }, [
                      c(y(F), {
                        icon: D.value === d.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      $(i(d.upload_name), 1)
                    ], 8, Us)
                  ]),
                  d.status !== "completed" ? (s(), o("td", {
                    key: 0,
                    colspan: E.value.length,
                    class: "muted"
                  }, [
                    d.status === "queued" ? (s(), o("span", Ms, [
                      c(y(F), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      v[16] || (v[16] = $("Waiting", -1))
                    ])) : (s(), o("span", Ns, [
                      c(y(F), { icon: "tabler:alert-triangle" }),
                      $(i(d.error), 1)
                    ]))
                  ], 8, Es)) : (s(!0), o(S, { key: 1 }, O(E.value, (B) => (s(), o("td", {
                    key: B,
                    "data-label": B
                  }, [
                    e("span", {
                      class: P(["cell", H(M(d, B))]),
                      title: ee(M(d, B)?.value)
                    }, i(M(d, B) ? K(M(d, B).score) : "—"), 11, Ts)
                  ], 8, Bs))), 128))
                ], 2),
                D.value === d.case_id ? (s(), o("tr", Rs, [
                  e("td", {
                    colspan: E.value.length + 1
                  }, [
                    d.error ? (s(), o("p", Ds, i(d.error), 1)) : (s(), o("dl", Ls, [
                      (s(!0), o(S, null, O(d.scores, (B) => (s(), o(S, {
                        key: B.field
                      }, [
                        e("dt", Fs, i(B.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: P(["cell", H(B)])
                          }, i(K(B.score)), 3),
                          e("span", Os, [
                            v[17] || (v[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            $(i(ee(B.expected)), 1)
                          ]),
                          e("span", zs, [
                            v[18] || (v[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            $(i(ee(B.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: P(["chip", B.verified ? "primary" : "warn"])
                            }, [
                              c(y(F), {
                                icon: B.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              $(i(B.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", Ps, i(d.tokens.toLocaleString()) + " tokens · " + i(le(d.duration_ms)), 1)
                  ], 8, As)
                ])) : p("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : p("", !0),
      e("section", Is, [
        e("header", Ws, [
          v[20] || (v[20] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", js, i(t.cases.length), 1),
          c(y(oe), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !t.fields.length,
            onClick: v[2] || (v[2] = (d) => m.value = !m.value)
          }, null, 8, ["disabled"])
        ]),
        m.value ? (s(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: $e(w, ["prevent"])
        }, [
          e("label", null, [
            v[21] || (v[21] = $("Document", -1)),
            c(Ke, {
              value: x.value,
              onSelect: v[3] || (v[3] = (d) => {
                x.value = d;
              })
            }, null, 8, ["value"])
          ]),
          v[24] || (v[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", Qs, [
            (s(!0), o(S, null, O(t.fields, (d) => (s(), o("label", {
              key: d.name
            }, [
              e("span", Ks, i(d.name), 1),
              d.type === "boolean" ? W((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (B) => f.value[d.name] = B
              }, [...v[22] || (v[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Hs)), [
                [fe, f.value[d.name]]
              ]) : d.type === "enum" ? W((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (B) => f.value[d.name] = B
              }, [
                v[23] || (v[23] = e("option", { value: "" }, "Not stated", -1)),
                (s(!0), o(S, null, O(d.enum_values, (B) => (s(), o("option", { key: B }, i(B), 1))), 128))
              ], 8, Js)), [
                [fe, f.value[d.name]]
              ]) : d.type === "object" || d.type === "list" ? W((s(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (B) => f.value[d.name] = B,
                rows: "2",
                placeholder: d.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, Ys)), [
                [X, f.value[d.name]]
              ]) : W((s(), o("input", {
                key: 3,
                "onUpdate:modelValue": (B) => f.value[d.name] = B,
                type: d.type === "number" ? "number" : d.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, Gs)), [
                [el, f.value[d.name]]
              ])
            ]))), 128))
          ]),
          k.value ? (s(), o("p", Xs, i(k.value), 1)) : p("", !0),
          e("div", Zs, [
            c(y(oe), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !x.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            c(y(oe), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: v[4] || (v[4] = (d) => m.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        t.fields.length ? !t.cases.length && !m.value ? (s(), o("p", eo, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : t.cases.length ? (s(), o("div", lo, [
          e("table", to, [
            e("thead", null, [
              e("tr", null, [
                v[25] || (v[25] = e("th", null, "Document", -1)),
                (s(!0), o(S, null, O(t.fields, (d) => (s(), o("th", {
                  key: d.name,
                  class: "mono"
                }, i(d.name), 1))), 128)),
                v[26] || (v[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(S, null, O(t.cases, (d) => (s(), o("tr", {
                key: d.id
              }, [
                e("td", null, [
                  c(y(F), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  $(" " + i(d.upload_name), 1)
                ]),
                (s(!0), o(S, null, O(t.fields, (B) => (s(), o("td", {
                  key: B.name,
                  "data-label": B.name,
                  class: P({ muted: !(B.name in d.expected) })
                }, i(B.name in d.expected ? ee(d.expected[B.name]) : "Not stated"), 11, ao))), 128)),
                e("td", no, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${d.upload_name}`,
                    disabled: t.saving,
                    onClick: (B) => b("delete-case", d.id)
                  }, [
                    c(y(F), { icon: "tabler:trash" })
                  ], 8, so)
                ])
              ]))), 128))
            ])
          ])
        ])) : p("", !0) : (s(), o("p", _s, "Add a field in the Builder, then add documents with the values you expect."))
      ]),
      t.evaluations.length ? (s(), o("section", oo, [
        e("header", io, [
          v[27] || (v[27] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", uo, i(t.evaluations.length), 1)
        ]),
        e("ul", ro, [
          (s(!0), o(S, null, O(t.evaluations, (d) => (s(), o("li", {
            key: d.id
          }, [
            e("button", {
              type: "button",
              class: P({ active: q.value?.id === d.id }),
              "aria-current": q.value?.id === d.id,
              onClick: (B) => b("open", d.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": d.status
              }, i(T[d.status]), 9, mo),
              e("span", null, "Revision " + i(d.config_revision), 1),
              e("span", vo, i(y(ke)(d.created_at)), 1),
              e("strong", bo, i(d.status === "completed" ? K(y(re)(d)) : "—"), 1)
            ], 10, co)
          ]))), 128))
        ])
      ])) : p("", !0)
    ]));
  }
}), fo = { class: "section-head" }, yo = { class: "muted" }, go = {
  key: 0,
  class: "empty"
}, ho = {
  key: 1,
  class: "table-scroll"
}, ko = { class: "metric-table runs-table" }, $o = { class: "caller" }, xo = ["data-status"], wo = {
  class: "num",
  "data-label": "Time"
}, Vo = {
  class: "num",
  "data-label": "Tokens"
}, So = {
  class: "muted",
  "data-label": "Expires"
}, Co = /* @__PURE__ */ j({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const r = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (n, b) => (s(), o(S, null, [
      e("div", fo, [
        b[0] || (b[0] = e("h2", null, "Recent runs", -1)),
        e("span", yo, "Runs expire after " + i(t.retention), 1)
      ]),
      t.runs.length ? (s(), o("div", ho, [
        e("table", ko, [
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
            (s(!0), o(S, null, O(t.runs, (m) => (s(), o("tr", {
              key: m.id
            }, [
              e("td", null, i(y(ke)(m.created_at)), 1),
              e("td", null, [
                e("span", $o, [
                  c(y(F), {
                    icon: r[m.caller].icon
                  }, null, 8, ["icon"]),
                  $(i(r[m.caller].label), 1)
                ])
              ]),
              e("td", null, [
                e("span", {
                  class: "badge",
                  "data-status": m.status
                }, i(m.status === "completed" ? "Completed" : "Failed"), 9, xo)
              ]),
              e("td", wo, i((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("td", Vo, i(Number(m.tokens).toLocaleString()), 1),
              e("td", So, i(y(ke)(m.expires_at)), 1)
            ]))), 128))
          ])
        ])
      ])) : (s(), o("p", go, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), qo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Uo = /* @__PURE__ */ j({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(t, { emit: r }) {
    const n = t, b = r, m = A(), x = A("");
    return we(async () => {
      try {
        await Ee("kickside-share", { timeoutMs: 8e3 });
      } catch (N) {
        x.value = `Sharing is unavailable: ${N instanceof Error ? N.message : String(N)}`;
        return;
      }
      const f = document.createElement("kickside-share"), k = encodeURIComponent(n.id);
      f.setAttribute("config", JSON.stringify({ resource_id: n.id, title: n.title, access_url: `/api/v1/component-access/grants/${k}`, share_url: `/api/v1/component-access/share/${k}` })), f.style.display = "block", f.addEventListener("close", () => b("close")), m.value?.appendChild(f);
    }), (f, k) => (s(), o("div", {
      ref_key: "host",
      ref: m
    }, [
      x.value ? (s(), o("p", qo, i(x.value), 1)) : p("", !0)
    ], 512));
  }
}), Eo = { class: "docscout" }, Mo = { class: "toolbar" }, No = { class: "toolbar-lead" }, Bo = {
  key: 0,
  class: "crumb-row"
}, To = { class: "crumb" }, Ro = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, Ao = ["id", "aria-selected", "aria-controls", "onClick"], Do = { class: "toolbar-side" }, Lo = { class: "stats" }, Fo = ["title"], Oo = {
  key: 1,
  class: "unsaved"
}, zo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, Po = {
  key: 2,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Io = ["id", "aria-labelledby"], Wo = /* @__PURE__ */ j({
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
  setup(t, { emit: r }) {
    const n = t, b = r, m = A(), x = A(!1), f = A("Builder"), k = A(Pe()), N = A(""), w = A(""), l = R(() => n.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    ue(f, () => {
      m.value && (m.value.scrollTop = 0);
    }, { flush: "post" });
    const a = A();
    function q(E) {
      return N.value === E.title && w.value === (E.description ?? "") && ml(k.value, E.config);
    }
    ue(() => n.snapshot, (E, M) => {
      l.value.includes(f.value) || (f.value = l.value[0]), !(M && E.id === M.id && E.can_edit && M.can_edit && !q(M) && !q(E)) && (k.value = structuredClone(Fe(E.config ?? Pe())), N.value = E.title, w.value = E.description ?? "", a.value = E.expected_revision);
    }, { immediate: !0 });
    const z = R(() => n.snapshot.can_edit && !q(n.snapshot)), C = R(() => cl(k.value)), L = R(() => Object.keys(ie).filter((E) => he(k.value, E)).length);
    function V() {
      b("save", { title: N.value, description: w.value, config: structuredClone(Fe(k.value)), expected_revision: a.value });
    }
    return (E, M) => (s(), o("main", Eo, [
      e("div", Mo, [
        e("div", No, [
          t.back ? (s(), o("span", Bo, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: M[0] || (M[0] = (D) => b("back"))
            }, [
              c(y(F), { icon: "tabler:arrow-left" })
            ]),
            e("span", To, i(t.snapshot.title), 1)
          ])) : p("", !0),
          e("nav", Ro, [
            (s(!0), o(S, null, O(l.value, (D) => (s(), o("button", {
              id: `tab-${D}`,
              key: D,
              role: "tab",
              "aria-selected": f.value === D,
              "aria-controls": `panel-${D}`,
              onClick: (K) => f.value = D
            }, i(D), 9, Ao))), 128))
          ])
        ]),
        e("div", Do, [
          t.snapshot.can_share ? (s(), Z(y(oe), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-label": "Share",
            onClick: M[1] || (M[1] = (D) => x.value = !0)
          }, {
            default: ll(() => [
              c(y(F), { icon: "tabler:share" }),
              M[10] || (M[10] = e("span", { class: "btn-label" }, "Share", -1))
            ]),
            _: 1
          })) : p("", !0),
          e("span", Lo, [
            $(i(t.snapshot.field_count) + " " + i(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (s(), o(S, { key: 0 }, [
              $(" · " + i(L.value) + " steps · revision " + i(t.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(S, { key: 1 }, [
              $(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (s(), o(S, { key: 1 }, [
            C.value ? (s(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: C.value
            }, [
              c(y(F), { icon: "tabler:alert-circle" }),
              $(i(C.value), 1)
            ], 8, Fo)) : z.value ? (s(), o("span", Oo, "Unsaved")) : p("", !0),
            c(y(oe), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !z.value || !!C.value || !N.value.trim(),
              onClick: V
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      t.error ? (s(), o("p", zo, i(t.error), 1)) : p("", !0),
      x.value ? (s(), Z(Uo, {
        key: 1,
        id: t.snapshot.id,
        title: t.snapshot.title,
        onClose: M[2] || (M[2] = (D) => x.value = !1)
      }, null, 8, ["id", "title"])) : p("", !0),
      f.value === "Builder" && t.snapshot.can_edit ? (s(), o("div", Po, [
        c(on, {
          title: N.value,
          "onUpdate:title": M[3] || (M[3] = (D) => N.value = D),
          description: w.value,
          "onUpdate:description": M[4] || (M[4] = (D) => w.value = D),
          config: k.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 3,
        ref_key: "body",
        ref: m,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${f.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${f.value}`,
          class: "panel"
        }, [
          f.value === "Test" ? (s(), Z(Pn, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: M[5] || (M[5] = (D) => b("run", D))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          f.value === "Evals" && t.snapshot.can_edit ? (s(), Z(po, {
            key: 1,
            cases: t.snapshot.cases,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: z.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: M[6] || (M[6] = (D) => b("add-case", D)),
            onDeleteCase: M[7] || (M[7] = (D) => b("delete-case", D)),
            onEvaluate: M[8] || (M[8] = (D) => b("evaluate")),
            onOpen: M[9] || (M[9] = (D) => b("open-evaluation", D))
          }, null, 8, ["cases", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : p("", !0),
          f.value === "Runs" ? (s(), Z(Co, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, Io)
      ], 512))
    ]));
  }
}), jo = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Qo = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Ko = 2e3, Xo = /* @__PURE__ */ j({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: r }) {
    const n = t, b = r, m = A(), x = A(""), f = A(!1), k = A(!1), N = A(!1), w = A(null), l = A([]), a = A();
    let q, z, C = 0, L;
    const V = (T) => T instanceof Error ? T.message : String(T), E = (T) => T === C;
    async function M(T, g) {
      try {
        const v = n.id, d = await ae.evaluations(v);
        if (!E(T)) return;
        l.value = d, g && (L = g);
        const B = L ?? d[0]?.id;
        if (B) {
          const ne = await ae.evaluation(v, B);
          if (!E(T) || ne.id !== (L ?? B)) return;
          a.value = ne;
        }
        clearTimeout(z), d.some((ne) => !pe(ne)) && (z = setTimeout(() => M(T), Ko));
      } catch (v) {
        E(T) && (x.value = V(v));
      }
    }
    async function D(T) {
      if (!n.id) {
        x.value = "No extractor selected.";
        return;
      }
      try {
        const g = await ae.get(n.id);
        if (!E(T)) return;
        m.value = g, x.value = "", g.can_edit && await M(T);
      } catch (g) {
        E(T) && (x.value = V(g));
      }
    }
    ue(() => n.id, () => {
      C++, L = void 0, clearTimeout(z), q?.(), m.value = void 0, w.value = null, l.value = [], a.value = void 0, x.value = "";
      const T = C;
      D(T), n.id && (q = tl(`component.${n.id}`, () => D(T)));
    }, { immediate: !0 }), Ie(() => {
      C++, q?.(), clearTimeout(z);
    });
    async function K(T) {
      const g = C;
      f.value = !0, x.value = "";
      try {
        await T(), E(g) && await D(g);
      } catch (v) {
        E(g) && (x.value = V(v));
      } finally {
        f.value = !1;
      }
    }
    const _ = (T) => K(() => ae.update(n.id, T)), I = (T) => K(() => ae.addCase(n.id, T)), le = (T) => K(() => ae.deleteCase(n.id, T));
    async function ee(T) {
      const g = C;
      k.value = !0, x.value = "";
      try {
        const v = await ae.run(n.id, T);
        E(g) && (w.value = v, await D(g));
      } catch (v) {
        E(g) && (x.value = V(v));
      } finally {
        k.value = !1;
      }
    }
    async function H() {
      const T = C;
      N.value = !0, x.value = "";
      try {
        const { eval_id: g } = await ae.evaluate(n.id);
        E(T) && await M(T, g);
      } catch (g) {
        E(T) && (x.value = V(g));
      } finally {
        N.value = !1;
      }
    }
    function G(T) {
      M(C, T);
    }
    return (T, g) => m.value ? (s(), Z(Wo, {
      key: 0,
      snapshot: m.value,
      saving: f.value,
      running: k.value,
      starting: N.value,
      result: w.value,
      evaluations: l.value,
      evaluation: a.value,
      error: x.value,
      back: t.back,
      onBack: g[0] || (g[0] = (v) => b("back")),
      onRun: ee,
      onSave: _,
      onAddCase: I,
      onDeleteCase: le,
      onEvaluate: H,
      onOpenEvaluation: G
    }, null, 8, ["snapshot", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : x.value ? (s(), o("p", jo, i(x.value), 1)) : (s(), o("p", Qo, "Loading Docscout…"));
  }
});
export {
  Xo as _,
  ke as w
};
