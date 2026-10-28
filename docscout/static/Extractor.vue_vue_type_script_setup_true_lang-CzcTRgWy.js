import { defineComponent as H, useModel as ge, openBlock as n, createElementBlock as o, withModifiers as $e, createElementVNode as e, mergeModels as xe, computed as N, withKeys as Te, unref as k, normalizeClass as z, createVNode as r, toDisplayString as i, Fragment as C, renderList as L, createCommentVNode as p, createTextVNode as $, createBlock as ee, ref as A, watch as de, withDirectives as W, vModelText as _, vModelSelect as fe, onMounted as qe, normalizeStyle as pe, onBeforeUnmount as Oe, nextTick as Xe, vShow as Se, vModelDynamic as Ye, toRaw as Re } from "vue";
import { loadByTagName as Fe, on as Ze } from "@wippy-fe/proxy";
import { i as ke, h as ze, t as Ce, g as ie, j as Ue, k as _e, m as Pe, l as We, o as Ae, p as el, q as ll, r as tl, v as al, w as De, x as nl, y as we, z as sl, A as ol, s as ve, n as Le, C as il, D as dl, c as se } from "./index-DaK7blmj.js";
import { Icon as D } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const ye = (t) => t.status === "completed" || t.status === "failed", re = (t) => t.metrics.length ? t.metrics.reduce((c, s) => c + s.accuracy, 0) / t.metrics.length : 0, ul = ["aria-checked", "aria-label", "disabled"], K = /* @__PURE__ */ H({
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
    const c = ge(t, "modelValue");
    return (s, m) => (n(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": c.value,
      "aria-label": t.label,
      disabled: t.disabled,
      onClick: m[0] || (m[0] = $e((v) => c.value = !c.value, ["stop"]))
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
}, ce = /* @__PURE__ */ H({
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
    const s = t, m = c, v = N(() => ke(s.config, s.stage)), f = N(() => s.config.stages[s.stage].model), x = N({ get: () => v.value, set: (w) => {
      s.config.stages[s.stage].enabled = w;
    } }), h = N(() => {
      const w = s.config, l = w.stages;
      switch (s.stage) {
        case "map":
          return w.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...w.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((a) => ({ text: Ce(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return ze(w).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), E = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, l) => (n(), o("div", {
      class: z(["node", { active: t.active, off: !v.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": k(ie)[t.stage],
      onClick: l[1] || (l[1] = (a) => m("select")),
      onKeydown: [
        l[2] || (l[2] = Te((a) => m("select"), ["enter"])),
        l[3] || (l[3] = Te($e((a) => m("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", cl, [
        r(k(D), {
          icon: k(Ue)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", ml, [
        e("span", vl, i(k(ie)[t.stage]), 1),
        e("span", bl, i(v.value ? k(_e)(t.stage, t.config) : "Off"), 1),
        v.value && h.value.length ? (n(), o("span", pl, [
          (n(!0), o(C, null, L(h.value, (a) => (n(), o("span", {
            key: a.text,
            class: z(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        t.trace ? (n(), o("span", yl, [
          r(k(D), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          $(i(E(t.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", fl, [
        v.value && f.value ? (n(), o("span", gl, i(k(Pe)(f.value)), 1)) : p("", !0),
        t.stage !== "extract" && !t.readonly ? (n(), ee(K, {
          key: 1,
          modelValue: x.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => x.value = a),
          label: `Enable ${k(ie)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, rl));
  }
}), hl = ["aria-labelledby"], kl = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], be = /* @__PURE__ */ H({
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
    const c = t, s = ge(t, "modelValue"), m = A([]);
    function v(f, x) {
      const h = c.options.length - 1, E = { ArrowRight: x + 1, ArrowDown: x + 1, ArrowLeft: x - 1, ArrowUp: x - 1, Home: 0, End: h }[f.key];
      if (E === void 0) return;
      f.preventDefault();
      const w = (E + c.options.length) % c.options.length;
      s.value = c.options[w].value, m.value[w]?.focus();
    }
    return (f, x) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (n(!0), o(C, null, L(t.options, (h, E) => (n(), o("button", {
        key: h.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: m,
        type: "button",
        role: "radio",
        "aria-checked": s.value === h.value,
        tabindex: s.value === h.value ? 0 : -1,
        disabled: t.disabled,
        onClick: (w) => s.value = h.value,
        onKeydown: (w) => v(w, E)
      }, i(h.label), 41, kl))), 128))
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
}, Rl = { id: "docscout-groups" }, Al = ["value"], Dl = { key: 5 }, Ll = ["placeholder"], Ol = { class: "toggle-row" }, Fl = { class: "toggle-row" }, zl = /* @__PURE__ */ H({
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
    const s = t, m = c, v = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], f = v.filter((w) => ["text", "number", "boolean", "date", "object"].includes(w.value)), x = N(() => We(s.field, s.otherNames)), h = N(() => s.field.type !== "boolean" && s.field.type !== "enum" && !(s.field.type === "list" && s.field.item_type === "boolean"));
    de(() => [s.field.type, s.field.item_type], () => {
      !Ae(s.field) && s.field.enum_values.length && (s.field.enum_values = []);
    });
    function E(w) {
      s.field.enum_values = [...new Set(w.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (w, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", xl, [
        e("label", null, [
          l[14] || (l[14] = $("Name", -1)),
          W(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (a) => t.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!x.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, wl), [
            [
              _,
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
            (n(), o(C, null, L(v, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, Vl)), 64))
          ], 512), [
            [fe, t.field.type]
          ])
        ])
      ]),
      x.value ? (n(), o("p", Sl, [
        r(k(D), { icon: "tabler:alert-circle" }),
        $(i(x.value), 1)
      ])) : p("", !0),
      t.field.type === "list" ? (n(), o("label", Cl, [
        l[16] || (l[16] = $("Each item is", -1)),
        W(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => t.field.item_type = a)
        }, [
          (n(!0), o(C, null, L(k(f), (a) => (n(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, ql))), 128))
        ], 512), [
          [fe, t.field.item_type]
        ])
      ])) : p("", !0),
      k(Ae)(t.field) ? (n(), o("label", Ul, [
        $(i(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: E
        }, null, 40, Ml),
        e("small", null, i(t.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : p("", !0),
      e("label", null, [
        l[17] || (l[17] = $("Description", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (a) => t.field.description = a),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [_, t.field.description]
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
          [_, t.field.search_hints]
        ]),
        l[20] || (l[20] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", El, [
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
              _,
              t.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[24] || (l[24] = e("small", null, "Per search hint", -1))
        ])
      ]),
      t.field.strategy === "deep" && !t.deepEnabled ? (n(), o("p", Nl, [
        r(k(D), { icon: "tabler:info-circle" }),
        l[25] || (l[25] = $("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Bl, [
        l[26] || (l[26] = e("span", { id: "within-label" }, "Search within", -1)),
        r(be, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => t.field.search_within = a),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, i(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (n(), o("p", Tl, [
        r(k(D), { icon: "tabler:alert-circle" }),
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
            _,
            t.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Rl, [
          (n(!0), o(C, null, L(t.groups, (a) => (n(), o("option", {
            key: a,
            value: a
          }, null, 8, Al))), 128))
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
          [_, t.field.validation_hints]
        ])
      ]),
      h.value ? (n(), o("label", Dl, [
        l[31] || (l[31] = $("Expected format", -1)),
        W(e("input", {
          "onUpdate:modelValue": l[10] || (l[10] = (a) => t.field.expected_format = a),
          placeholder: k(el)(t.field)
        }, null, 8, Ll), [
          [_, t.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Ol, [
        l[32] || (l[32] = e("span", null, [
          $("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        r(K, {
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
        r(K, {
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
}, te = /* @__PURE__ */ H({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = c, m = A(!!customElements.get("wc-model-picker")), v = A("");
    qe(async () => {
      if (!m.value)
        try {
          await Fe("wc-model-picker", { timeoutMs: 8e3 }), m.value = !0;
        } catch (x) {
          v.value = x instanceof Error ? x.message : String(x);
        }
    });
    function f(x) {
      const h = x.detail;
      typeof h == "string" && s("select", h);
    }
    return (x, h) => m.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: f
    }, null, 40, Pl)) : v.value ? (n(), o("p", Wl, "Could not load model picker: " + i(v.value), 1)) : (n(), o("span", jl, "Loading models…"));
  }
}), Il = { class: "slider" }, Ql = { class: "slider-head" }, Kl = { class: "slider-value" }, Hl = ["aria-label", "aria-valuetext", "disabled"], Jl = {
  key: 0,
  class: "slider-hints"
}, Gl = { key: 1 }, me = 1e3, X = /* @__PURE__ */ H({
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
    const c = t, s = ge(t, "modelValue"), m = N(() => c.percent ? `${Math.round(s.value * 100)}%` : `${s.value.toLocaleString()}${c.unit ? ` ${c.unit}` : ""}`), v = (h) => c.log ? Math.log(h / c.min) / Math.log(c.max / c.min) * me : (h - c.min) / (c.max - c.min) * me;
    function f(h) {
      const E = c.log ? c.min * Math.pow(c.max / c.min, h / me) : c.min + (c.max - c.min) * h / me, w = Math.round(E / c.step) * c.step;
      return Math.min(c.max, Math.max(c.min, Number(w.toFixed(4))));
    }
    const x = N({ get: () => Math.round(v(s.value)), set: (h) => {
      s.value = f(h);
    } });
    return (h, E) => (n(), o("div", Il, [
      e("div", Ql, [
        e("span", null, i(t.label), 1),
        e("output", Kl, i(m.value), 1)
      ]),
      W(e("input", {
        "onUpdate:modelValue": E[0] || (E[0] = (w) => x.value = w),
        type: "range",
        min: "0",
        max: me,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": m.value,
        disabled: t.disabled,
        style: pe({ "--fill": `${x.value / me * 100}%` })
      }, null, 12, Hl), [
        [
          _,
          x.value,
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
}, Yl = { class: "fd-track" }, Zl = { class: "fd-node" }, _l = { class: "fd-dots" }, et = { class: "fd-more" }, lt = { class: "fd-node goal" }, tt = /* @__PURE__ */ H({
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
        (n(!0), o(C, null, L(Math.min(c.rounds, 8), (v) => (n(), o(C, { key: v }, [
          m[0] || (m[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Zl, [
            e("span", null, "R" + i(v), 1),
            e("span", _l, [
              (n(!0), o(C, null, L(Math.min(c.extra, 6), (f) => (n(), o("i", { key: f }))), 128))
            ])
          ])
        ], 64))), 128)),
        c.rounds > 8 ? (n(), o(C, { key: 0 }, [
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
}, nt = { class: "fd-grid" }, st = { class: "fd-node solid" }, ot = { class: "fd-node" }, it = { class: "fd-node" }, dt = { class: "fd-node goal" }, ut = /* @__PURE__ */ H({
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
    return (m, v) => (n(), o("figure", at, [
      e("div", nt, [
        e("span", st, [
          e("b", null, i(t.fields), 1),
          $(" field" + i(t.fields === 1 ? "" : "s"), 1),
          e("small", null, i(t.parallel) + " at a time", 1)
        ]),
        e("span", ot, [
          e("b", null, i(t.queries), 1),
          v[0] || (v[0] = $(" queries", -1)),
          v[1] || (v[1] = e("small", null, "per field", -1))
        ]),
        e("span", it, [
          e("b", null, i(t.perQuery), 1),
          v[2] || (v[2] = $(" chunks", -1)),
          v[3] || (v[3] = e("small", null, "per query", -1))
        ]),
        e("span", dt, [
          e("b", null, i(s.value), 1),
          v[4] || (v[4] = $(" chunks", -1)),
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
}, Et = { class: "toggle-row" }, Nt = { class: "mono" }, Bt = { class: "toggle-row" }, Tt = { class: "label-block" }, Rt = {
  id: "model-deep",
  class: "model-role"
}, At = {
  id: "model-deep-query",
  class: "model-role"
}, Dt = {
  id: "model-extract",
  class: "model-role"
}, Lt = { class: "output-list" }, Ot = { class: "chip" }, Ft = {
  key: 0,
  class: "muted"
}, zt = { class: "toggle-row" }, Pt = { class: "toggle-row" }, Wt = { class: "toggle-row" }, jt = { class: "toggle-row" }, It = {
  id: "model-verify",
  class: "model-role"
}, Qt = /* @__PURE__ */ H({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = N(() => c.config.stages), m = (w) => nl(c.stage, w), v = ll(), f = N(() => c.config.fields.filter((w) => w.strategy === "deep").length), x = N(() => c.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), h = N(() => ze(c.config));
    function E(w, l) {
      const a = s.value.scout.tools.filter((F) => F !== w);
      s.value.scout.tools = l ? [...a, w] : a;
    }
    return (w, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", ct, i(k(tl)[t.stage]), 1),
      t.stage === "map" ? (n(), o(C, { key: 0 }, [
        e("div", mt, [
          l[34] || (l[34] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.map.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", vt, [
          l[35] || (l[35] = e("span", { id: "outline-label" }, "Outline", -1)),
          r(be, {
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
          r(K, {
            modelValue: s.value.map.section_summaries,
            "onUpdate:modelValue": l[2] || (l[2] = (a) => s.value.map.section_summaries = a),
            label: "Section summaries",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[39] || (l[39] = e("h4", null, "Models", -1)),
        e("div", pt, [
          l[38] || (l[38] = e("span", null, "Outliner", -1)),
          r(te, {
            value: s.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (a) => s.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        l[40] || (l[40] = e("h4", null, "Fields that read sections", -1)),
        x.value.length ? (n(), o("p", yt, [
          (n(!0), o(C, null, L(x.value, (a) => (n(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (n(), o("p", ft, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      t.stage === "prefetch" ? (n(), o(C, { key: 1 }, [
        e("div", gt, [
          l[41] || (l[41] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[45] || (l[45] = e("h4", null, "Queries", -1)),
        (n(!0), o(C, null, L(s.value.prefetch.queries, (a, F) => (n(), o("div", {
          key: F,
          class: "query-row"
        }, [
          e("div", ht, [
            e("label", null, [
              l[42] || (l[42] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": (S) => a.name = S,
                placeholder: "Parties"
              }, null, 8, kt), [
                [_, a.name]
              ])
            ]),
            e("label", null, [
              l[43] || (l[43] = $("Chunks", -1)),
              W(e("input", {
                "onUpdate:modelValue": (S) => a.chunks = S,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, $t), [
                [
                  _,
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
              "onUpdate:modelValue": (S) => a.query = S,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, xt), [
              [_, a.query]
            ])
          ]),
          t.readonly ? p("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (S) => s.value.prefetch.queries.splice(F, 1)
          }, "Remove query", 8, wt))
        ]))), 128)),
        s.value.prefetch.queries.length ? p("", !0) : (n(), o("p", Vt, "No fixed queries. Field search hints still run.")),
        t.readonly ? p("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[5] || (l[5] = (a) => s.value.prefetch.queries.push(k(al)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      t.stage === "scout" ? (n(), o(C, { key: 2 }, [
        e("div", St, [
          l[46] || (l[46] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (a) => s.value.scout.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ct, [
          l[47] || (l[47] = e("span", { id: "mode-label" }, "Mode", -1)),
          r(be, {
            modelValue: s.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (a) => s.value.scout.mode = a),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, i(s.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        s.value.scout.mode === "loop" ? (n(), ee(tt, {
          key: 0,
          rounds: s.value.scout.max_rounds,
          confidence: s.value.scout.target_confidence,
          extra: s.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : p("", !0),
        l[52] || (l[52] = e("h4", null, "Models", -1)),
        e("div", qt, [
          l[48] || (l[48] = e("span", null, "Scout", -1)),
          r(te, {
            value: s.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[8] || (l[8] = (a) => s.value.scout.model = a)
          }, null, 8, ["value"])
        ]),
        l[53] || (l[53] = e("h4", null, "Loop", -1)),
        r(X, {
          modelValue: s.value.scout.max_rounds,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => s.value.scout.max_rounds = a),
          label: s.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: m("max_rounds").min,
          max: m("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        s.value.scout.mode === "loop" ? (n(), ee(X, {
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
        r(X, {
          modelValue: s.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[11] || (l[11] = (a) => s.value.scout.max_extra_queries = a),
          label: s.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: m("max_extra_queries").min,
          max: m("max_extra_queries").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        r(X, {
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
          r(K, {
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
          r(K, {
            modelValue: s.value.scout.share_notes,
            "onUpdate:modelValue": l[14] || (l[14] = (a) => s.value.scout.share_notes = a),
            label: "Share scout notes with extraction",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s.value.scout.mode === "agent" ? (n(), o(C, { key: 4 }, [
          l[51] || (l[51] = e("h4", null, "Agent tools", -1)),
          (n(!0), o(C, null, L(k(v), (a) => (n(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, [
              $(i(k(Ce)(a)), 1),
              e("small", Nt, i(a), 1)
            ]),
            r(K, {
              "model-value": s.value.scout.tools.includes(a),
              label: k(Ce)(a),
              disabled: t.readonly,
              "onUpdate:modelValue": (F) => E(a, F)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      t.stage === "deep" ? (n(), o(C, { key: 3 }, [
        e("div", Bt, [
          l[54] || (l[54] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (a) => s.value.deep.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r(ut, {
          fields: f.value,
          parallel: s.value.deep.parallel_fields,
          queries: s.value.deep.max_queries,
          "per-query": s.value.deep.chunks_per_query,
          cap: s.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Tt, [
          l[55] || (l[55] = e("span", { id: "read-label" }, "Reads", -1)),
          r(be, {
            modelValue: s.value.deep.read,
            "onUpdate:modelValue": l[16] || (l[16] = (a) => s.value.deep.read = a),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          l[56] || (l[56] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[59] || (l[59] = e("h4", null, "Models", -1)),
        e("div", Rt, [
          l[57] || (l[57] = e("span", null, "Analysis", -1)),
          r(te, {
            value: s.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (a) => s.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", At, [
          l[58] || (l[58] = e("span", null, "Query writer", -1)),
          r(te, {
            value: s.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[18] || (l[18] = (a) => s.value.deep.query_model = a)
          }, null, 8, ["value"])
        ]),
        l[60] || (l[60] = e("h4", null, "Reach", -1)),
        r(X, {
          modelValue: s.value.deep.parallel_fields,
          "onUpdate:modelValue": l[19] || (l[19] = (a) => s.value.deep.parallel_fields = a),
          label: "Fields at a time",
          min: m("parallel_fields").min,
          max: m("parallel_fields").max,
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(X, {
          modelValue: s.value.deep.max_queries,
          "onUpdate:modelValue": l[20] || (l[20] = (a) => s.value.deep.max_queries = a),
          label: "Queries per field",
          min: m("max_queries").min,
          max: m("max_queries").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(X, {
          modelValue: s.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[21] || (l[21] = (a) => s.value.deep.chunks_per_query = a),
          label: "Chunks per query",
          min: m("chunks_per_query").min,
          max: m("chunks_per_query").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(X, {
          modelValue: s.value.deep.chunk_cap,
          "onUpdate:modelValue": l[22] || (l[22] = (a) => s.value.deep.chunk_cap = a),
          label: "Chunk cap per field",
          min: m("chunk_cap").min,
          max: m("chunk_cap").max,
          log: "",
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(X, {
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
        r(X, {
          modelValue: s.value.deep.query_temperature,
          "onUpdate:modelValue": l[24] || (l[24] = (a) => s.value.deep.query_temperature = a),
          label: "Query writing",
          min: m("query_temperature").min,
          max: m("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: t.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(X, {
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
      t.stage === "extract" ? (n(), o(C, { key: 4 }, [
        l[64] || (l[64] = e("h4", null, "Models", -1)),
        e("div", Dt, [
          l[62] || (l[62] = e("span", null, "Extraction", -1)),
          r(te, {
            value: s.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (a) => s.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        l[65] || (l[65] = e("h4", null, "Field groups", -1)),
        e("ul", Lt, [
          (n(!0), o(C, null, L(h.value, (a) => (n(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Ot, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        h.value.length ? p("", !0) : (n(), o("p", Ft, "No fields yet.")),
        r(X, {
          modelValue: s.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (a) => s.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: m("max_fields_per_call").min,
          max: m("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${k(De)(t.config)} extraction call${k(De)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        r(X, {
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
        e("div", zt, [
          l[63] || (l[63] = e("span", null, [
            $("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          r(K, {
            modelValue: s.value.extract.structured_output,
            "onUpdate:modelValue": l[29] || (l[29] = (a) => s.value.extract.structured_output = a),
            label: "Structured output",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : p("", !0),
      t.stage === "verify" ? (n(), o(C, { key: 5 }, [
        e("div", Pt, [
          l[66] || (l[66] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.verify.enabled,
            "onUpdate:modelValue": l[30] || (l[30] = (a) => s.value.verify.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Wt, [
          l[67] || (l[67] = e("span", null, [
            $("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          r(K, {
            modelValue: s.value.verify.check_quotes,
            "onUpdate:modelValue": l[31] || (l[31] = (a) => s.value.verify.check_quotes = a),
            label: "Quotes exist",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", jt, [
          l[68] || (l[68] = e("span", null, [
            $("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          r(K, {
            modelValue: s.value.verify.check_support,
            "onUpdate:modelValue": l[32] || (l[32] = (a) => s.value.verify.check_support = a),
            label: "Quotes support values",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s.value.verify.check_support ? (n(), o(C, { key: 0 }, [
          l[70] || (l[70] = e("h4", null, "Models", -1)),
          e("div", It, [
            l[69] || (l[69] = e("span", null, "Checker", -1)),
            r(te, {
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
}), Kt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Ht = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Jt = ["x", "y", "width"], Gt = ["x", "width"], Xt = /* @__PURE__ */ H({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const c = t, s = N(() => Math.min(0.9, Math.max(0, c.overlap / c.size))), m = N(() => {
      const v = 100 / (3 - 2 * s.value);
      return [0, 1, 2].map((f) => ({ x: f * v * (1 - s.value), w: v }));
    });
    return (v, f) => (n(), o("figure", Kt, [
      (n(), o("svg", Ht, [
        (n(!0), o(C, null, L(m.value, (x, h) => (n(), o("rect", {
          key: h,
          x: x.x,
          y: h % 2 ? 14 : 4,
          width: x.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Jt))), 128)),
        (n(), o(C, null, L([1, 2], (x) => e("rect", {
          key: "o" + x,
          x: m.value[x].x,
          y: 4,
          width: m.value[x - 1].x + m.value[x - 1].w - m.value[x].x,
          height: "24",
          class: "shared"
        }, null, 8, Gt)), 64))
      ])),
      e("figcaption", null, i(t.size.toLocaleString()) + " tokens per chunk · " + i(t.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(s.value * 100)) + "%)", 1)
    ]));
  }
}), Yt = ["disabled"], Zt = { class: "muted" }, _t = { class: "toggle-row" }, ea = { class: "toggle-row" }, la = { class: "label-block" }, ta = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, aa = { class: "label-block" }, na = {
  id: "embedding-model",
  class: "model-role"
}, sa = { class: "toggle-row" }, oa = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, ia = /* @__PURE__ */ H({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = N(() => c.config.retrieval), m = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], v = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], f = we("chunk_size"), x = we("overlap"), h = we("section_budget"), E = N(() => Math.min(x.max, s.value.chunk_size - 50));
    return (w, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", Zt, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(t.retention) + ".", 1),
      l[19] || (l[19] = e("h4", null, "Chunks", -1)),
      r(Xt, {
        size: s.value.chunk_size,
        overlap: s.value.overlap
      }, null, 8, ["size", "overlap"]),
      r(X, {
        modelValue: s.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.chunk_size = a),
        label: "Chunk size",
        min: k(f).min,
        max: k(f).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      r(X, {
        modelValue: s.value.overlap,
        "onUpdate:modelValue": l[1] || (l[1] = (a) => s.value.overlap = a),
        label: "Overlap",
        min: k(x).min,
        max: E.value,
        step: 10,
        unit: "tokens",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", _t, [
        l[11] || (l[11] = e("span", null, [
          $("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        r(K, {
          modelValue: s.value.split_headings,
          "onUpdate:modelValue": l[2] || (l[2] = (a) => s.value.split_headings = a),
          label: "Split by headings",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", ea, [
        l[12] || (l[12] = e("span", null, [
          $("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        r(K, {
          modelValue: s.value.keep_tables,
          "onUpdate:modelValue": l[3] || (l[3] = (a) => s.value.keep_tables = a),
          label: "Keep tables whole",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r(X, {
        modelValue: s.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.section_budget = a),
        label: "Section budget",
        min: k(h).min,
        max: k(h).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", la, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        r(be, {
          modelValue: s.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (a) => s.value.context = a),
          "labelled-by": "context-label",
          options: v
        }, null, 8, ["modelValue"]),
        e("small", null, i(v.find((a) => a.value === s.value.context)?.note), 1)
      ]),
      s.value.context === "generated" ? (n(), o("div", ta, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        r(te, {
          value: s.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (a) => s.value.context_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", aa, [
        l[15] || (l[15] = e("span", { id: "mode-label" }, "Search mode", -1)),
        r(be, {
          modelValue: s.value.search_mode,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => s.value.search_mode = a),
          "labelled-by": "mode-label",
          options: m
        }, null, 8, ["modelValue"]),
        e("small", null, i(m.find((a) => a.value === s.value.search_mode)?.note), 1)
      ]),
      l[22] || (l[22] = e("h4", null, "Models", -1)),
      e("div", na, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        r(te, {
          value: s.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: l[8] || (l[8] = (a) => s.value.embedding_model = a)
        }, null, 8, ["value"])
      ]),
      e("div", sa, [
        l[17] || (l[17] = e("span", null, [
          $("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        r(K, {
          modelValue: s.value.highlighter,
          "onUpdate:modelValue": l[9] || (l[9] = (a) => s.value.highlighter = a),
          label: "Highlighter",
          disabled: t.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      s.value.highlighter ? (n(), o("div", oa, [
        l[18] || (l[18] = e("span", null, "Highlighter", -1)),
        r(te, {
          value: s.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: l[10] || (l[10] = (a) => s.value.highlighter_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0)
    ], 8, Yt));
  }
}), da = { class: "canvas" }, ua = { class: "canvas-inner" }, ra = {
  class: "block",
  "aria-labelledby": "fields-head"
}, ca = { class: "block-head" }, ma = ["aria-expanded"], va = { class: "count" }, ba = {
  key: 0,
  class: "block-peek"
}, pa = {
  id: "fields-body",
  class: "block-body"
}, ya = {
  key: 0,
  class: "block-empty"
}, fa = {
  key: 1,
  class: "rows"
}, ga = ["onClick"], ha = { class: "row-name" }, ka = {
  key: 0,
  class: "req",
  title: "Required"
}, $a = { class: "chips" }, xa = {
  key: 1,
  class: "chip"
}, wa = ["title"], Va = { class: "chip" }, Sa = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, Ca = {
  key: 0,
  class: "row-actions"
}, qa = ["disabled", "onClick"], Ua = ["disabled", "onClick"], Ma = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ea = { class: "block-head" }, Na = ["aria-expanded"], Ba = { class: "count" }, Ta = {
  key: 0,
  class: "block-peek"
}, Ra = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Aa = { class: "node-icon" }, Da = { class: "node-main" }, La = { class: "node-summary" }, Oa = { class: "node-side" }, Fa = { class: "chip model" }, za = { class: "branches" }, Pa = { class: "branch" }, Wa = { class: "branch" }, ja = { class: "node-icon" }, Ia = { class: "node-main" }, Qa = { class: "node-summary" }, Ka = ["aria-valuenow"], Ha = { class: "side-panel-head" }, Ja = { class: "side-panel-icon" }, Ga = ["disabled"], Xa = {
  key: 4,
  class: "inspector-form"
}, Ya = { class: "output-list" }, Za = { class: "mono" }, _a = { class: "chip" }, en = { class: "rail-label" }, Ve = 400, he = 320, ln = /* @__PURE__ */ H({
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
    const c = t, s = ge(t, "title"), m = ge(t, "description"), v = A({ kind: "document" });
    function f(g, d) {
      try {
        const M = localStorage.getItem(`docscout.${g}`);
        return M === null ? d : M === "1";
      } catch {
        return d;
      }
    }
    function x(g, d) {
      try {
        localStorage.setItem(`docscout.${g}`, d ? "1" : "0");
      } catch {
      }
    }
    const h = A(f("panel", !0)), E = A(f("fields", !0)), w = A(f("flow", !0));
    function l() {
      try {
        const g = Number(localStorage.getItem("docscout.panelWidth"));
        return g >= he ? g : Ve;
      } catch {
        return Ve;
      }
    }
    const a = A(l()), F = () => {
      const g = Y.value?.clientWidth;
      return g ? Math.max(he, g - 420) : Number.POSITIVE_INFINITY;
    };
    function S(g, d = !0) {
      if (a.value = Math.round(Math.min(F(), Math.max(he, g))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const U = A(!1);
    function P(g) {
      const d = g.currentTarget, M = g.clientX, G = a.value;
      d.setPointerCapture(g.pointerId), U.value = !0;
      const oe = (Ge) => S(G + (M - Ge.clientX), !1), Be = () => {
        U.value = !1, S(a.value), d.removeEventListener("pointermove", oe), d.removeEventListener("pointerup", Be);
      };
      d.addEventListener("pointermove", oe), d.addEventListener("pointerup", Be);
    }
    function y(g) {
      g.key === "ArrowLeft" ? (S(a.value + 24), g.preventDefault()) : g.key === "ArrowRight" && (S(a.value - 24), g.preventDefault());
    }
    function q(g) {
      h.value = g, j.value || x("panel", g);
    }
    function R(g) {
      const d = g === "fields" ? E : w;
      d.value = !d.value, x(g, d.value);
    }
    const Y = A(), j = A(!1);
    let Z;
    qe(() => {
      Z = new ResizeObserver(([g]) => {
        const d = j.value;
        j.value = g.contentRect.width < 1e3, j.value && !d && (h.value = !1), !j.value && d && (h.value = f("panel", !0));
      }), Y.value && Z.observe(Y.value);
    }), Oe(() => Z?.disconnect());
    const ae = A();
    de(v, async () => {
      await Xe(), ae.value && (ae.value.scrollTop = 0);
    });
    function I(g) {
      v.value = g, h.value = !0;
    }
    const J = (g) => JSON.stringify(g) === JSON.stringify(v.value), ne = N(() => v.value.kind === "field" ? c.config.fields[v.value.index] : void 0), le = N(() => {
      const g = v.value;
      return g.kind === "stage" ? ie[g.stage] : g.kind === "field" ? ne.value?.name || "New field" : g.kind === "document" ? "Read document" : g.kind === "output" ? "Output" : "Details";
    }), B = N(() => {
      const g = v.value;
      return g.kind === "stage" ? Ue[g.stage] : g.kind === "field" ? "tabler:forms" : g.kind === "document" ? "tabler:file-text" : g.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), O = N(() => c.config.fields.filter((g, d) => !(v.value.kind === "field" && v.value.index === d)).map((g) => g.name)), Q = N(() => c.config.stages.deep.enabled), V = N(() => c.config.stages.map.enabled), b = N(() => [...new Set(c.config.fields.map((g) => g.group.trim()).filter(Boolean))]), u = (g) => We(c.config.fields[g], c.config.fields.filter((d, M) => M !== g).map((d) => d.name)), T = ["map", "prefetch", "scout", "deep", "extract", "verify"], Ie = N(() => T.filter((g) => ke(c.config, g)).map((g) => ie[g]).join(" · ")), Qe = N(() => c.config.fields.map((g) => g.name || "New field").join(", ")), Ke = N(() => T.filter((g) => ke(c.config, g)).length), ue = (g) => c.result?.trace.find((d) => d.kind === g);
    function He() {
      c.config.fields.push(ol()), E.value = !0, I({ kind: "field", index: c.config.fields.length - 1 });
    }
    function Je(g) {
      c.config.fields.splice(g, 1), v.value = { kind: "document" };
    }
    function Me(g, d) {
      const M = c.config.fields, G = g + d;
      if (G < 0 || G >= M.length) return;
      const [oe] = M.splice(g, 1);
      M.splice(G, 0, oe), v.value = { kind: "field", index: G };
    }
    const Ee = (g) => g.type === "list" ? `list of ${g.item_type}` : g.type, Ne = N({ get: () => c.config.tags.join(", "), set: (g) => {
      c.config.tags = [...new Set(g.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (g, d) => (n(), o("div", {
      ref_key: "root",
      ref: Y,
      class: z(["builder", { narrow: j.value, "panel-open": h.value, resizing: U.value }])
    }, [
      e("div", da, [
        e("div", ua, [
          e("section", ra, [
            e("header", ca, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": E.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (M) => R("fields"))
              }, [
                r(k(D), {
                  icon: E.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", va, i(t.config.fields.length), 1)
              ], 8, ma),
              !E.value && t.config.fields.length ? (n(), o("span", ba, i(Qe.value), 1)) : p("", !0),
              t.readonly ? p("", !0) : (n(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: He
              }, [
                r(k(D), { icon: "tabler:plus" }),
                d[20] || (d[20] = $("Add field", -1))
              ]))
            ]),
            W(e("div", pa, [
              t.config.fields.length ? (n(), o("ul", fa, [
                (n(!0), o(C, null, L(t.config.fields, (M, G) => (n(), o("li", {
                  key: G,
                  class: z(["row-item", { active: J({ kind: "field", index: G }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (oe) => I({ kind: "field", index: G })
                  }, [
                    e("span", ha, [
                      $(i(M.name || "New field"), 1),
                      M.required ? (n(), o("span", ka, "*")) : p("", !0),
                      u(G) ? (n(), ee(k(D), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: u(G)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: z(["row-desc", { missing: !M.description }])
                    }, i(M.description || "No description"), 3),
                    e("span", $a, [
                      M.search_within === "sections" ? (n(), o("span", {
                        key: 0,
                        class: z(["chip", V.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      M.group.trim() ? (n(), o("span", xa, i(M.group), 1)) : p("", !0),
                      M.strategy === "deep" ? (n(), o("span", {
                        key: 2,
                        class: z(["chip", Q.value ? "primary" : "muted-chip"]),
                        title: Q.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, wa)) : p("", !0),
                      e("span", Va, i(Ee(M)), 1),
                      M.evidence_required ? (n(), o("span", Sa, [
                        r(k(D), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, ga),
                  t.readonly ? p("", !0) : (n(), o("span", Ca, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: G === 0,
                      onClick: (oe) => Me(G, -1)
                    }, [
                      r(k(D), { icon: "tabler:chevron-up" })
                    ], 8, qa),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: G === t.config.fields.length - 1,
                      onClick: (oe) => Me(G, 1)
                    }, [
                      r(k(D), { icon: "tabler:chevron-down" })
                    ], 8, Ua)
                  ]))
                ], 2))), 128))
              ])) : (n(), o("p", ya, "Add the values to pull from each document."))
            ], 512), [
              [Se, E.value]
            ])
          ]),
          e("section", Ma, [
            e("header", Ea, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (M) => R("flow"))
              }, [
                r(k(D), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Ba, i(Ke.value) + " of 6", 1)
              ], 8, Na),
              w.value ? p("", !0) : (n(), o("span", Ta, i(Ie.value), 1)),
              e("button", {
                type: "button",
                class: z(["btn small subtle push", { on: J({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (M) => I({ kind: "details" }))
              }, [
                r(k(D), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = $("Details", -1))
              ], 2)
            ]),
            W(e("div", Ra, [
              e("button", {
                type: "button",
                class: z(["node fixed", { active: J({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (M) => I({ kind: "document" }))
              }, [
                e("span", Aa, [
                  r(k(D), { icon: "tabler:file-text" })
                ]),
                e("span", Da, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", La, i(k(sl)(t.config.retrieval)), 1)
                ]),
                e("span", Oa, [
                  e("span", Fa, i(k(Pe)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "map",
                config: t.config,
                active: J({ kind: "stage", stage: "map" }),
                trace: ue("map"),
                readonly: t.readonly,
                onSelect: d[4] || (d[4] = (M) => I({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[29] || (d[29] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", za, [
                e("div", Pa, [
                  d[24] || (d[24] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  r(ce, {
                    stage: "prefetch",
                    config: t.config,
                    active: J({ kind: "stage", stage: "prefetch" }),
                    trace: ue("prefetch"),
                    readonly: t.readonly,
                    onSelect: d[5] || (d[5] = (M) => I({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  r(ce, {
                    stage: "scout",
                    config: t.config,
                    active: J({ kind: "stage", stage: "scout" }),
                    trace: ue("scout"),
                    readonly: t.readonly,
                    onSelect: d[6] || (d[6] = (M) => I({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Wa, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  r(ce, {
                    stage: "deep",
                    config: t.config,
                    active: J({ kind: "stage", stage: "deep" }),
                    trace: ue("deep"),
                    readonly: t.readonly,
                    onSelect: d[7] || (d[7] = (M) => I({ kind: "stage", stage: "deep" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ])
              ]),
              d[30] || (d[30] = e("div", {
                class: "join",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              r(ce, {
                stage: "extract",
                config: t.config,
                active: J({ kind: "stage", stage: "extract" }),
                trace: ue("extract"),
                readonly: t.readonly,
                onSelect: d[8] || (d[8] = (M) => I({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "verify",
                config: t.config,
                active: J({ kind: "stage", stage: "verify" }),
                trace: ue("verify"),
                readonly: t.readonly,
                onSelect: d[9] || (d[9] = (M) => I({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: z(["node fixed", { active: J({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (M) => I({ kind: "output" }))
              }, [
                e("span", ja, [
                  r(k(D), { icon: "tabler:braces" })
                ]),
                e("span", Ia, [
                  d[27] || (d[27] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", Qa, i(t.config.fields.length ? `${t.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Se, w.value]
            ])
          ])
        ])
      ]),
      j.value && h.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (M) => q(!1))
      })) : p("", !0),
      h.value ? (n(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: pe(j.value ? void 0 : { width: `${a.value}px` })
      }, [
        j.value ? p("", !0) : (n(), o("div", {
          key: 0,
          class: z(["resizer", { active: U.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": he,
          onPointerdown: $e(P, ["prevent"]),
          onKeydown: y,
          onDblclick: d[12] || (d[12] = (M) => S(Ve))
        }, null, 42, Ka)),
        e("header", Ha, [
          e("span", Ja, [
            r(k(D), { icon: B.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(le.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (M) => q(!1))
          }, [
            r(k(D), {
              icon: j.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: ae,
          class: "side-panel-body"
        }, [
          v.value.kind === "document" ? (n(), ee(ia, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : v.value.kind === "stage" ? (n(), ee(Qt, {
            key: 1,
            stage: v.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : v.value.kind === "field" && ne.value ? (n(), ee(zl, {
            key: 2,
            field: ne.value,
            "other-names": O.value,
            groups: b.value,
            "deep-enabled": Q.value,
            "map-enabled": V.value,
            readonly: t.readonly,
            onRemove: d[14] || (d[14] = (M) => Je(v.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : v.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (M) => s.value = M),
                "aria-label": "Extractor name"
              }, null, 512), [
                [_, s.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = $("Description", -1)),
              W(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (M) => m.value = M),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [_, m.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = $("Tags", -1)),
              W(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (M) => Ne.value = M),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  _,
                  Ne.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, Ga)) : v.value.kind === "output" ? (n(), o("div", Xa, [
            d[37] || (d[37] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", Ya, [
              (n(!0), o(C, null, L(t.config.fields, (M) => (n(), o("li", {
                key: M.name
              }, [
                e("span", Za, i(M.name || "New field"), 1),
                e("span", _a, i(Ee(M)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 4)) : j.value ? p("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (M) => q(!0))
      }, [
        r(k(D), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", en, i(le.value), 1)
      ]))
    ], 2));
  }
}), tn = ["selected"], an = {
  key: 1,
  role: "alert"
}, nn = {
  key: 2,
  class: "muted"
}, je = /* @__PURE__ */ H({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = c, m = A(!1), v = A("");
    qe(async () => {
      try {
        await Fe("wc-multiselect", { timeoutMs: 8e3 }), m.value = !0;
      } catch (x) {
        v.value = String(x);
      }
    });
    function f(x) {
      const h = x.detail;
      s("select", h.selected[0] || "", h.labels?.[0] || "");
    }
    return (x, h) => m.value ? (n(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(t.value ? [t.value] : []),
      placeholder: "Choose an upload",
      onChange: f
    }, null, 40, tn)) : v.value ? (n(), o("p", an, i(v.value), 1)) : (n(), o("span", nn, "Loading uploads…"));
  }
}), sn = { class: "test" }, on = { class: "run-bar" }, dn = { class: "run-input" }, un = { class: "muted run-note" }, rn = {
  key: 0,
  class: "empty"
}, cn = {
  key: 1,
  class: "run-failed",
  role: "alert"
}, mn = {
  key: 2,
  class: "test-grid"
}, vn = { class: "block" }, bn = { class: "block-head" }, pn = { class: "muted push" }, yn = { class: "value-list" }, fn = ["aria-expanded", "onClick"], gn = { class: "value-name" }, hn = ["title"], kn = { class: "bar" }, $n = ["title"], xn = { class: "evidence" }, wn = {
  key: 0,
  class: "full-value"
}, Vn = {
  key: 1,
  class: "muted"
}, Sn = {
  key: 2,
  class: "muted"
}, Cn = { class: "block" }, qn = { class: "timeline" }, Un = { class: "tl-icon" }, Mn = { class: "tl-main" }, En = { class: "tl-head" }, Nn = { class: "muted push" }, Bn = { class: "tl-bar" }, Tn = { class: "muted" }, Rn = {
  key: 0,
  class: "tl-msg"
}, An = {
  key: 1,
  class: "chips"
}, Dn = /* @__PURE__ */ H({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: c }) {
    const s = t, m = c, v = A(""), f = A(), x = (U) => `${Math.round(U * 100)}%`, h = (U) => U == null ? "—" : typeof U == "string" ? U : Array.isArray(U) && U.every((P) => typeof P != "object") ? U.join(", ") : typeof U == "object" ? JSON.stringify(U) : String(U), E = (U) => `${(U / 1e3).toFixed(1)}s`, w = N(() => Math.max(1, ...s.result?.trace.map((U) => U.duration_ms) ?? [1])), l = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, a = (U) => l[U]?.label ?? ie[U] ?? U, F = (U) => l[U]?.icon ?? Ue[U] ?? "tabler:point", S = (U) => U >= 0.9 ? "high" : U >= 0.7 ? "mid" : "low";
    return (U, P) => (n(), o("div", sn, [
      e("section", on, [
        e("div", dn, [
          r(je, {
            value: v.value,
            onSelect: P[0] || (P[0] = (y) => v.value = y)
          }, null, 8, ["value"])
        ]),
        r(k(ve), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !v.value || t.running || !t.canRun,
          onClick: P[1] || (P[1] = (y) => m("run", v.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", un, i(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(t.retention) + ".", 1)
      ]),
      t.result ? p("", !0) : (n(), o("p", rn, "No extraction results yet.")),
      t.result?.status === "failed" ? (n(), o("p", cn, [
        r(k(D), { icon: "tabler:alert-triangle" }),
        $("The run stopped: " + i(t.result.error), 1)
      ])) : p("", !0),
      t.result ? (n(), o("div", mn, [
        e("section", vn, [
          e("header", bn, [
            P[2] || (P[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", pn, [
              $(i(t.result.tokens.toLocaleString()) + " tokens · " + i(E(t.result.duration_ms)), 1),
              t.result.pages ? (n(), o(C, { key: 0 }, [
                $(" · " + i(t.result.pages) + " pages", 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", yn, [
            (n(!0), o(C, null, L(t.result.fields, (y) => (n(), o("li", {
              key: y.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": f.value === y.name,
                onClick: (q) => f.value = f.value === y.name ? void 0 : y.name
              }, [
                e("span", gn, i(y.name), 1),
                e("span", {
                  class: z(["value-text", { missing: y.missing }]),
                  title: y.missing ? void 0 : h(y.value)
                }, i(y.missing ? "Not in the document" : h(y.value)), 11, hn),
                e("span", {
                  class: z(["confidence", S(y.confidence)])
                }, [
                  e("span", kn, [
                    e("span", {
                      style: pe({ width: x(y.confidence) })
                    }, null, 4)
                  ]),
                  $(i(x(y.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: z(["chip", y.verified ? "primary" : "warn"]),
                  title: y.reason
                }, [
                  r(k(D), {
                    icon: y.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  $(i(y.verified ? "Verified" : "Check"), 1)
                ], 10, $n),
                r(k(D), {
                  icon: f.value === y.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, fn),
              W(e("div", xn, [
                y.missing ? p("", !0) : (n(), o("p", wn, i(h(y.value)), 1)),
                (n(!0), o(C, null, L(y.evidence, (q, R) => (n(), o("blockquote", {
                  key: R,
                  class: z({ unfound: q.found === !1 })
                }, [
                  e("p", null, "“" + i(q.quote) + "”", 1),
                  e("cite", null, [
                    $(i(q.section), 1),
                    q.page !== void 0 && q.page !== null ? (n(), o(C, { key: 0 }, [
                      $(" · Page " + i(q.page), 1)
                    ], 64)) : p("", !0),
                    q.found === !1 ? (n(), o(C, { key: 1 }, [
                      $(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                y.evidence.length ? p("", !0) : (n(), o("p", Vn, "No evidence.")),
                y.reason ? (n(), o("p", Sn, i(y.reason), 1)) : p("", !0)
              ], 512), [
                [Se, f.value === y.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Cn, [
          P[3] || (P[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", qn, [
            (n(!0), o(C, null, L(t.result.trace, (y, q) => (n(), o("li", {
              key: q,
              class: z(y.status)
            }, [
              e("span", Un, [
                r(k(D), {
                  icon: F(y.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Mn, [
                e("div", En, [
                  e("strong", null, i(a(y.kind)), 1),
                  e("span", Nn, i(E(y.duration_ms)), 1)
                ]),
                e("span", Bn, [
                  e("span", {
                    style: pe({ width: `${Math.max(4, y.duration_ms / w.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Tn, [
                  $(i(y.scope), 1),
                  y.model ? (n(), o(C, { key: 0 }, [
                    $(" · " + i(y.model), 1)
                  ], 64)) : p("", !0),
                  $(" · " + i((y.input_tokens + y.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                y.message ? (n(), o("p", Rn, i(y.message), 1)) : p("", !0),
                y.queries?.length ? (n(), o("div", An, [
                  (n(!0), o(C, null, L(y.queries, (R) => (n(), o("span", {
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
}), Ln = { class: "evals" }, On = { class: "block eval-run" }, Fn = { class: "eval-run-main" }, zn = { class: "block-title" }, Pn = {
  key: 0,
  class: "eval-note"
}, Wn = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, jn = { class: "bar" }, In = { class: "muted" }, Qn = { class: "stat-row" }, Kn = { class: "stat" }, Hn = { class: "stat-label" }, Jn = { class: "stat-value" }, Gn = { class: "stat" }, Xn = { class: "stat-value" }, Yn = { class: "stat-delta flat" }, Zn = { class: "stat" }, _n = { class: "stat-value" }, es = {
  key: 0,
  class: "stat-delta flat"
}, ls = { class: "stat" }, ts = { class: "stat-value" }, as = {
  key: 0,
  class: "stat-delta flat"
}, ns = { class: "block" }, ss = { class: "block-head" }, os = {
  key: 0,
  class: "compare-pick push"
}, is = ["value"], ds = ["value"], us = {
  key: 0,
  class: "block-empty"
}, rs = {
  key: 1,
  class: "table-scroll"
}, cs = { class: "metric-table" }, ms = { key: 0 }, vs = { key: 1 }, bs = { class: "mono" }, ps = { class: "acc strong" }, ys = { class: "bar" }, fs = { class: "muted" }, gs = {
  key: 0,
  class: "muted"
}, hs = { key: 1 }, ks = {
  key: 1,
  class: "muted"
}, $s = {
  key: 1,
  class: "block"
}, xs = { class: "table-scroll" }, ws = { class: "metric-table result-matrix" }, Vs = ["aria-expanded", "onClick"], Ss = ["colspan"], Cs = {
  key: 0,
  class: "cell-state"
}, qs = {
  key: 1,
  class: "cell-state fail"
}, Us = ["title"], Ms = {
  key: 0,
  class: "result-detail"
}, Es = ["colspan"], Ns = {
  key: 0,
  class: "muted"
}, Bs = {
  key: 1,
  class: "compare"
}, Ts = { class: "mono" }, Rs = { class: "cmp" }, As = { class: "cmp" }, Ds = { class: "muted case-meta" }, Ls = { class: "block" }, Os = { class: "block-head" }, Fs = { class: "count" }, zs = { class: "grid" }, Ps = { class: "mono" }, Ws = ["onUpdate:modelValue"], js = ["onUpdate:modelValue"], Is = ["onUpdate:modelValue", "placeholder"], Qs = ["onUpdate:modelValue", "type"], Ks = {
  key: 0,
  class: "error",
  role: "alert"
}, Hs = { class: "row" }, Js = {
  key: 1,
  class: "block-empty"
}, Gs = {
  key: 2,
  class: "table-scroll"
}, Xs = { class: "metric-table" }, Ys = { class: "num" }, Zs = ["aria-label", "disabled", "onClick"], _s = {
  key: 2,
  class: "block"
}, eo = { class: "block-head" }, lo = { class: "count" }, to = { class: "eval-history" }, ao = ["aria-current", "onClick"], no = ["data-status"], so = { class: "muted" }, oo = { class: "push" }, io = /* @__PURE__ */ H({
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
    const s = t, m = c, v = A(!1), f = A(""), x = A(""), h = A({}), E = A("");
    de(() => s.cases, () => {
      v.value = !1, f.value = "", h.value = {};
    });
    function w(V, b) {
      return V.type === "number" ? Number(b) : V.type === "boolean" ? b === "true" : V.type === "list" || V.type === "object" ? JSON.parse(b) : b;
    }
    function l() {
      E.value = "";
      const V = {};
      try {
        for (const b of s.fields) {
          const u = String(h.value[b.name] ?? "").trim();
          u && (V[b.name] = w(b, u));
        }
      } catch {
        E.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      m("add-case", { upload_id: f.value, upload_name: x.value, expected: V });
    }
    const a = N(() => s.evaluations.find((V) => !ye(V))), F = N(() => s.evaluations.filter(ye)), S = N(() => s.evaluation), U = N(() => ({ done: (S.value?.results ?? []).filter((b) => b.status !== "queued").length, total: S.value?.case_count ?? 0 })), P = A();
    de(() => S.value?.id, () => {
      P.value = void 0;
    });
    const y = N(() => {
      if (!S.value) return;
      if (P.value) return F.value.find((b) => b.id === P.value);
      const V = F.value.findIndex((b) => b.id === S.value.id);
      return V >= 0 ? F.value[V + 1] : F.value[0];
    }), q = N(() => (S.value?.metrics ?? []).map((V) => ({ ...V, before: y.value?.metrics.find((b) => b.field === V.field) }))), R = N(() => (S.value?.fields ?? []).map((V) => V.name)), Y = (V, b) => V.scores.find((u) => u.field === b), j = A(), Z = (V) => `${Math.round(V * 100)}%`, ae = (V) => {
      const b = Math.round(V * 100);
      return `${b > 0 ? "+" : b < 0 ? "−" : "±"}${Math.abs(b)} pts`;
    }, I = (V) => Math.round(V * 100) > 0 ? "up" : Math.round(V * 100) < 0 ? "down" : "flat", J = (V) => V >= 6e4 ? `${Math.floor(V / 6e4)}m ${Math.round(V % 6e4 / 1e3)}s` : `${(V / 1e3).toFixed(1)}s`, ne = (V) => new Date(V).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), le = (V) => V == null || V === "" ? "—" : typeof V == "string" ? V : Array.isArray(V) && V.every((b) => typeof b != "object") ? V.join(", ") : JSON.stringify(V), B = (V) => V ? V.score >= 0.999 ? "pass" : V.score > 0 ? "partial" : "fail" : "none", O = (V) => (V.results ?? []).filter((b) => b.status === "completed").length, Q = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (V, b) => (n(), o("div", Ln, [
      e("section", On, [
        e("div", Fn, [
          e("div", null, [
            e("h2", zn, "Evaluate revision " + i(t.revision), 1),
            b[6] || (b[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (n(), o("p", Pn, [
              r(k(D), { icon: "tabler:info-circle" }),
              b[5] || (b[5] = $("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : p("", !0)
          ]),
          r(k(ve), {
            label: a.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!a.value,
            disabled: !t.cases.length || !t.fields.length || !!a.value || t.starting,
            onClick: b[0] || (b[0] = (u) => m("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        S.value && !k(ye)(S.value) ? (n(), o("div", Wn, [
          e("span", jn, [
            e("span", {
              style: pe({ width: Z(U.value.total ? U.value.done / U.value.total : 0) })
            }, null, 4)
          ]),
          e("span", In, i(Q[S.value.status]) + " · " + i(U.value.done) + " of " + i(U.value.total) + " cases", 1)
        ])) : p("", !0)
      ]),
      S.value && k(ye)(S.value) ? (n(), o(C, { key: 0 }, [
        S.value.error ? (n(), o("p", {
          key: 0,
          class: z(S.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          r(k(D), { icon: "tabler:alert-triangle" }),
          $(i(S.value.error), 1)
        ], 2)) : p("", !0),
        e("div", Qn, [
          e("div", Kn, [
            e("span", Hn, "Accuracy · revision " + i(S.value.config_revision), 1),
            e("span", Jn, i(Z(k(re)(S.value))), 1),
            y.value ? (n(), o("span", {
              key: 0,
              class: z(["stat-delta", I(k(re)(S.value) - k(re)(y.value))])
            }, i(ae(k(re)(S.value) - k(re)(y.value))) + " vs revision " + i(y.value.config_revision), 3)) : p("", !0)
          ]),
          e("div", Gn, [
            b[7] || (b[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", Xn, [
              $(i(O(S.value)), 1),
              e("small", null, " / " + i(S.value.case_count), 1)
            ]),
            e("span", Yn, i(S.value.case_count - O(S.value)) + " failed", 1)
          ]),
          e("div", Zn, [
            b[8] || (b[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", _n, i(S.value.tokens.toLocaleString()), 1),
            y.value ? (n(), o("span", es, i(y.value.tokens.toLocaleString()) + " before", 1)) : p("", !0)
          ]),
          e("div", ls, [
            b[9] || (b[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", ts, i(J(S.value.duration_ms)), 1),
            y.value ? (n(), o("span", as, i(J(y.value.duration_ms)) + " before", 1)) : p("", !0)
          ])
        ]),
        e("section", ns, [
          e("header", ss, [
            b[11] || (b[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            F.value.length > 1 ? (n(), o("label", os, [
              b[10] || (b[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: y.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: b[1] || (b[1] = (u) => P.value = u.target.value)
              }, [
                (n(!0), o(C, null, L(F.value.filter((u) => u.id !== S.value.id), (u) => (n(), o("option", {
                  key: u.id,
                  value: u.id
                }, "Revision " + i(u.config_revision) + " · " + i(ne(u.created_at)), 9, ds))), 128))
              ], 40, is)
            ])) : p("", !0)
          ]),
          q.value.length ? (n(), o("div", rs, [
            e("table", cs, [
              e("thead", null, [
                e("tr", null, [
                  b[12] || (b[12] = e("th", null, "Field", -1)),
                  b[13] || (b[13] = e("th", null, "Accuracy", -1)),
                  b[14] || (b[14] = e("th", null, "Verified", -1)),
                  y.value ? (n(), o("th", ms, "Revision " + i(y.value.config_revision), 1)) : p("", !0),
                  y.value ? (n(), o("th", vs, "Change")) : p("", !0)
                ])
              ]),
              e("tbody", null, [
                (n(!0), o(C, null, L(q.value, (u) => (n(), o("tr", {
                  key: u.field
                }, [
                  e("td", bs, i(u.field), 1),
                  e("td", null, [
                    e("span", ps, [
                      e("span", ys, [
                        e("span", {
                          style: pe({ width: Z(u.accuracy) })
                        }, null, 4)
                      ]),
                      $(i(Z(u.accuracy)), 1)
                    ])
                  ]),
                  e("td", fs, i(Z(u.verified)), 1),
                  y.value ? (n(), o("td", gs, i(u.before ? Z(u.before.accuracy) : "—"), 1)) : p("", !0),
                  y.value ? (n(), o("td", hs, [
                    u.before ? (n(), o("span", {
                      key: 0,
                      class: z(["trend", I(u.accuracy - u.before.accuracy)])
                    }, [
                      r(k(D), {
                        icon: I(u.accuracy - u.before.accuracy) === "up" ? "tabler:trending-up" : I(u.accuracy - u.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      $(i(ae(u.accuracy - u.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", ks, "New field"))
                  ])) : p("", !0)
                ]))), 128))
              ])
            ])
          ])) : (n(), o("p", us, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : p("", !0),
      S.value?.results?.length ? (n(), o("section", $s, [
        b[19] || (b[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", xs, [
          e("table", ws, [
            e("thead", null, [
              e("tr", null, [
                b[15] || (b[15] = e("th", null, "Document", -1)),
                (n(!0), o(C, null, L(R.value, (u) => (n(), o("th", {
                  key: u,
                  class: "mono"
                }, i(u), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(C, null, L(S.value.results, (u) => (n(), o(C, {
                key: u.case_id
              }, [
                e("tr", {
                  class: z(["result-row", { active: j.value === u.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": j.value === u.case_id,
                      onClick: (T) => j.value = j.value === u.case_id ? void 0 : u.case_id
                    }, [
                      r(k(D), {
                        icon: j.value === u.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      $(i(u.upload_name), 1)
                    ], 8, Vs)
                  ]),
                  u.status !== "completed" ? (n(), o("td", {
                    key: 0,
                    colspan: R.value.length,
                    class: "muted"
                  }, [
                    u.status === "queued" ? (n(), o("span", Cs, [
                      r(k(D), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      b[16] || (b[16] = $("Waiting", -1))
                    ])) : (n(), o("span", qs, [
                      r(k(D), { icon: "tabler:alert-triangle" }),
                      $(i(u.error), 1)
                    ]))
                  ], 8, Ss)) : (n(!0), o(C, { key: 1 }, L(R.value, (T) => (n(), o("td", { key: T }, [
                    e("span", {
                      class: z(["cell", B(Y(u, T))]),
                      title: le(Y(u, T)?.value)
                    }, i(Y(u, T) ? Z(Y(u, T).score) : "—"), 11, Us)
                  ]))), 128))
                ], 2),
                j.value === u.case_id ? (n(), o("tr", Ms, [
                  e("td", {
                    colspan: R.value.length + 1
                  }, [
                    u.error ? (n(), o("p", Ns, i(u.error), 1)) : (n(), o("dl", Bs, [
                      (n(!0), o(C, null, L(u.scores, (T) => (n(), o(C, {
                        key: T.field
                      }, [
                        e("dt", Ts, i(T.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: z(["cell", B(T)])
                          }, i(Z(T.score)), 3),
                          e("span", Rs, [
                            b[17] || (b[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            $(i(le(T.expected)), 1)
                          ]),
                          e("span", As, [
                            b[18] || (b[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            $(i(le(T.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: z(["chip", T.verified ? "primary" : "warn"])
                            }, [
                              r(k(D), {
                                icon: T.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              $(i(T.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", Ds, i(u.tokens.toLocaleString()) + " tokens · " + i(J(u.duration_ms)), 1)
                  ], 8, Es)
                ])) : p("", !0)
              ], 64))), 128))
            ])
          ])
        ])
      ])) : p("", !0),
      e("section", Ls, [
        e("header", Os, [
          b[20] || (b[20] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", Fs, i(t.cases.length), 1),
          r(k(ve), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !t.fields.length,
            onClick: b[2] || (b[2] = (u) => v.value = !v.value)
          }, null, 8, ["disabled"])
        ]),
        v.value ? (n(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: $e(l, ["prevent"])
        }, [
          e("label", null, [
            b[21] || (b[21] = $("Document", -1)),
            r(je, {
              value: f.value,
              onSelect: b[3] || (b[3] = (u, T) => {
                f.value = u, x.value = T;
              })
            }, null, 8, ["value"])
          ]),
          b[24] || (b[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", zs, [
            (n(!0), o(C, null, L(t.fields, (u) => (n(), o("label", {
              key: u.name
            }, [
              e("span", Ps, i(u.name), 1),
              u.type === "boolean" ? W((n(), o("select", {
                key: 0,
                "onUpdate:modelValue": (T) => h.value[u.name] = T
              }, [...b[22] || (b[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Ws)), [
                [fe, h.value[u.name]]
              ]) : u.type === "enum" ? W((n(), o("select", {
                key: 1,
                "onUpdate:modelValue": (T) => h.value[u.name] = T
              }, [
                b[23] || (b[23] = e("option", { value: "" }, "Not stated", -1)),
                (n(!0), o(C, null, L(u.enum_values, (T) => (n(), o("option", { key: T }, i(T), 1))), 128))
              ], 8, js)), [
                [fe, h.value[u.name]]
              ]) : u.type === "object" || u.type === "list" ? W((n(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (T) => h.value[u.name] = T,
                rows: "2",
                placeholder: u.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, Is)), [
                [_, h.value[u.name]]
              ]) : W((n(), o("input", {
                key: 3,
                "onUpdate:modelValue": (T) => h.value[u.name] = T,
                type: u.type === "number" ? "number" : u.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, Qs)), [
                [Ye, h.value[u.name]]
              ])
            ]))), 128))
          ]),
          E.value ? (n(), o("p", Ks, i(E.value), 1)) : p("", !0),
          e("div", Hs, [
            r(k(ve), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !f.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            r(k(ve), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: b[4] || (b[4] = (u) => v.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        !t.cases.length && !v.value ? (n(), o("p", Js, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : t.cases.length ? (n(), o("div", Gs, [
          e("table", Xs, [
            e("thead", null, [
              e("tr", null, [
                b[25] || (b[25] = e("th", null, "Document", -1)),
                (n(!0), o(C, null, L(t.fields, (u) => (n(), o("th", {
                  key: u.name,
                  class: "mono"
                }, i(u.name), 1))), 128)),
                b[26] || (b[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(C, null, L(t.cases, (u) => (n(), o("tr", {
                key: u.id
              }, [
                e("td", null, [
                  r(k(D), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  $(" " + i(u.upload_name), 1)
                ]),
                (n(!0), o(C, null, L(t.fields, (T) => (n(), o("td", {
                  key: T.name,
                  class: z({ muted: !(T.name in u.expected) })
                }, i(T.name in u.expected ? le(u.expected[T.name]) : "Not stated"), 3))), 128)),
                e("td", Ys, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${u.upload_name}`,
                    disabled: t.saving,
                    onClick: (T) => m("delete-case", u.id)
                  }, [
                    r(k(D), { icon: "tabler:trash" })
                  ], 8, Zs)
                ])
              ]))), 128))
            ])
          ])
        ])) : p("", !0)
      ]),
      t.evaluations.length ? (n(), o("section", _s, [
        e("header", eo, [
          b[27] || (b[27] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", lo, i(t.evaluations.length), 1)
        ]),
        e("ul", to, [
          (n(!0), o(C, null, L(t.evaluations, (u) => (n(), o("li", {
            key: u.id
          }, [
            e("button", {
              type: "button",
              class: z({ active: S.value?.id === u.id }),
              "aria-current": S.value?.id === u.id,
              onClick: (T) => m("open", u.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": u.status
              }, i(Q[u.status]), 9, no),
              e("span", null, "Revision " + i(u.config_revision), 1),
              e("span", so, i(ne(u.created_at)), 1),
              e("strong", oo, i(u.status === "completed" ? Z(k(re)(u)) : "—"), 1)
            ], 10, ao)
          ]))), 128))
        ])
      ])) : p("", !0)
    ]));
  }
}), uo = { class: "section-head" }, ro = { class: "muted" }, co = {
  key: 0,
  class: "empty"
}, mo = {
  key: 1,
  class: "table-scroll"
}, vo = { class: "metric-table" }, bo = { class: "caller" }, po = ["data-status"], yo = { class: "num" }, fo = { class: "num" }, go = { class: "muted" }, ho = /* @__PURE__ */ H({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const c = (m) => new Date(m).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), s = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (m, v) => (n(), o(C, null, [
      e("div", uo, [
        v[0] || (v[0] = e("h2", null, "Recent runs", -1)),
        e("span", ro, "Runs expire after " + i(t.retention), 1)
      ]),
      t.runs.length ? (n(), o("div", mo, [
        e("table", vo, [
          v[1] || (v[1] = e("thead", null, [
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
            (n(!0), o(C, null, L(t.runs, (f) => (n(), o("tr", {
              key: f.id
            }, [
              e("td", null, i(c(f.created_at)), 1),
              e("td", null, [
                e("span", bo, [
                  r(k(D), {
                    icon: s[f.caller].icon
                  }, null, 8, ["icon"]),
                  $(i(s[f.caller].label), 1)
                ])
              ]),
              e("td", null, [
                e("span", {
                  class: "badge",
                  "data-status": f.status
                }, i(f.status === "completed" ? "Completed" : "Failed"), 9, po)
              ]),
              e("td", yo, i((f.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("td", fo, i(Number(f.tokens).toLocaleString()), 1),
              e("td", go, i(c(f.expires_at)), 1)
            ]))), 128))
          ])
        ])
      ])) : (n(), o("p", co, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
    ], 64));
  }
}), ko = { class: "docscout" }, $o = { class: "toolbar" }, xo = { class: "toolbar-lead" }, wo = { class: "crumb" }, Vo = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, So = ["id", "aria-selected", "aria-controls", "onClick"], Co = { class: "toolbar-side" }, qo = { class: "stats" }, Uo = ["title"], Mo = {
  key: 1,
  class: "unsaved"
}, Eo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, No = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Bo = ["id", "aria-labelledby"], To = /* @__PURE__ */ H({
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
    const s = t, m = c, v = A(), f = A("Builder"), x = A(Le()), h = A(""), E = A(""), w = N(() => s.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    de(f, () => {
      v.value && (v.value.scrollTop = 0);
    }, { flush: "post" });
    const l = A();
    function a(y) {
      return h.value === y.title && E.value === (y.description ?? "") && dl(x.value, y.config);
    }
    de(() => s.snapshot, (y, q) => {
      w.value.includes(f.value) || (f.value = w.value[0]), !(q && y.id === q.id && y.can_edit && q.can_edit && !a(q) && !a(y)) && (x.value = structuredClone(Re(y.config ?? Le())), h.value = y.title, E.value = y.description ?? "", l.value = y.expected_revision);
    }, { immediate: !0 });
    const F = N(() => s.snapshot.can_edit && !a(s.snapshot)), S = N(() => il(x.value)), U = N(() => Object.keys(ie).filter((y) => ke(x.value, y)).length);
    function P() {
      m("save", { title: h.value, description: E.value, config: structuredClone(Re(x.value)), expected_revision: l.value });
    }
    return (y, q) => (n(), o("main", ko, [
      e("div", $o, [
        e("div", xo, [
          t.back ? (n(), o(C, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: q[0] || (q[0] = (R) => m("back"))
            }, [
              r(k(D), { icon: "tabler:arrow-left" })
            ]),
            e("span", wo, i(t.snapshot.title), 1)
          ], 64)) : p("", !0),
          e("nav", Vo, [
            (n(!0), o(C, null, L(w.value, (R) => (n(), o("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": f.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (Y) => f.value = R
            }, i(R), 9, So))), 128))
          ])
        ]),
        e("div", Co, [
          e("span", qo, [
            $(i(t.snapshot.field_count) + " " + i(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (n(), o(C, { key: 0 }, [
              $(" · " + i(U.value) + " steps · revision " + i(t.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(C, { key: 1 }, [
              $(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (n(), o(C, { key: 0 }, [
            S.value ? (n(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: S.value
            }, [
              r(k(D), { icon: "tabler:alert-circle" }),
              $(i(S.value), 1)
            ], 8, Uo)) : F.value ? (n(), o("span", Mo, "Unsaved")) : p("", !0),
            r(k(ve), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !F.value || !!S.value || !h.value.trim(),
              onClick: P
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      t.error ? (n(), o("p", Eo, i(t.error), 1)) : p("", !0),
      f.value === "Builder" && t.snapshot.can_edit ? (n(), o("div", No, [
        r(ln, {
          title: h.value,
          "onUpdate:title": q[1] || (q[1] = (R) => h.value = R),
          description: E.value,
          "onUpdate:description": q[2] || (q[2] = (R) => E.value = R),
          config: x.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 2,
        ref_key: "body",
        ref: v,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${f.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${f.value}`,
          class: "panel"
        }, [
          f.value === "Test" ? (n(), ee(Dn, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: q[3] || (q[3] = (R) => m("run", R))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          f.value === "Evals" && t.snapshot.can_edit ? (n(), ee(io, {
            key: 1,
            cases: t.snapshot.cases,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: F.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: q[4] || (q[4] = (R) => m("add-case", R)),
            onDeleteCase: q[5] || (q[5] = (R) => m("delete-case", R)),
            onEvaluate: q[6] || (q[6] = (R) => m("evaluate")),
            onOpen: q[7] || (q[7] = (R) => m("open-evaluation", R))
          }, null, 8, ["cases", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : p("", !0),
          f.value === "Runs" ? (n(), ee(ho, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, Bo)
      ], 512))
    ]));
  }
}), Ro = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Ao = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Do = 2e3, Po = /* @__PURE__ */ H({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: c }) {
    const s = t, m = c, v = A(), f = A(""), x = A(!1), h = A(!1), E = A(!1), w = A(null), l = A([]), a = A();
    let F, S, U = 0, P;
    const y = (B) => B instanceof Error ? B.message : String(B), q = (B) => B === U;
    async function R(B, O) {
      try {
        const Q = s.id, V = await se.evaluations(Q);
        if (!q(B)) return;
        l.value = V, O && (P = O);
        const b = P ?? V[0]?.id;
        if (b) {
          const u = await se.evaluation(Q, b);
          if (!q(B) || u.id !== (P ?? b)) return;
          a.value = u;
        }
        clearTimeout(S), V.some((u) => !ye(u)) && (S = setTimeout(() => R(B), Do));
      } catch (Q) {
        q(B) && (f.value = y(Q));
      }
    }
    async function Y(B) {
      if (!s.id) {
        f.value = "No extractor selected.";
        return;
      }
      try {
        const O = await se.get(s.id);
        if (!q(B)) return;
        v.value = O, f.value = "", O.can_edit && await R(B);
      } catch (O) {
        q(B) && (f.value = y(O));
      }
    }
    de(() => s.id, () => {
      U++, P = void 0, clearTimeout(S), F?.(), v.value = void 0, w.value = null, l.value = [], a.value = void 0, f.value = "";
      const B = U;
      Y(B), s.id && (F = Ze(`component.${s.id}`, () => Y(B)));
    }, { immediate: !0 }), Oe(() => {
      U++, F?.(), clearTimeout(S);
    });
    async function j(B) {
      const O = U;
      x.value = !0, f.value = "";
      try {
        await B(), q(O) && await Y(O);
      } catch (Q) {
        q(O) && (f.value = y(Q));
      } finally {
        x.value = !1;
      }
    }
    const Z = (B) => j(() => se.update(s.id, B)), ae = (B) => j(() => se.addCase(s.id, B)), I = (B) => j(() => se.deleteCase(s.id, B));
    async function J(B) {
      const O = U;
      h.value = !0, f.value = "";
      try {
        const Q = await se.run(s.id, B);
        q(O) && (w.value = Q, await Y(O));
      } catch (Q) {
        q(O) && (f.value = y(Q));
      } finally {
        h.value = !1;
      }
    }
    async function ne() {
      const B = U;
      E.value = !0, f.value = "";
      try {
        const { eval_id: O } = await se.evaluate(s.id);
        q(B) && await R(B, O);
      } catch (O) {
        q(B) && (f.value = y(O));
      } finally {
        E.value = !1;
      }
    }
    function le(B) {
      R(U, B);
    }
    return (B, O) => v.value ? (n(), ee(To, {
      key: 0,
      snapshot: v.value,
      saving: x.value,
      running: h.value,
      starting: E.value,
      result: w.value,
      evaluations: l.value,
      evaluation: a.value,
      error: f.value,
      back: t.back,
      onBack: O[0] || (O[0] = (Q) => m("back")),
      onRun: J,
      onSave: Z,
      onAddCase: ae,
      onDeleteCase: I,
      onEvaluate: ne,
      onOpenEvaluation: le
    }, null, 8, ["snapshot", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : f.value ? (n(), o("p", Ro, i(f.value), 1)) : (n(), o("p", Ao, "Loading Docscout…"));
  }
});
export {
  Po as _
};
