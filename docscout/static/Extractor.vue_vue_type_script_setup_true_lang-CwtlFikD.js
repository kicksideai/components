import { defineComponent as H, useModel as ge, openBlock as s, createElementBlock as o, withModifiers as xe, createElementVNode as e, mergeModels as we, computed as T, withKeys as Te, unref as h, normalizeClass as P, createVNode as r, toDisplayString as i, Fragment as S, renderList as O, createCommentVNode as p, createTextVNode as $, createBlock as ee, ref as D, watch as de, withDirectives as W, vModelText as Z, vModelSelect as fe, onMounted as qe, normalizeStyle as pe, onBeforeUnmount as Oe, nextTick as Xe, vShow as Se, vModelDynamic as Ye, toRaw as Re } from "vue";
import { loadByTagName as Fe, on as Ze } from "@wippy-fe/proxy";
import { i as $e, h as ze, t as Ce, g as ie, j as Ue, k as _e, m as Pe, l as We, o as Ae, p as el, q as ll, r as tl, v as al, w as De, x as nl, y as he, z as sl, A as ol, s as ve, n as Le, C as il, D as dl, c as se } from "./index-DmncycM2.js";
import { Icon as L } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const ye = (l) => l.status === "completed" || l.status === "failed", re = (l) => l.metrics.length ? l.metrics.reduce((c, n) => c + n.accuracy, 0) / l.metrics.length : 0, ul = ["aria-checked", "aria-label", "disabled"], K = /* @__PURE__ */ H({
  __name: "Toggle",
  props: /* @__PURE__ */ we({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(l) {
    const c = ge(l, "modelValue");
    return (n, m) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": c.value,
      "aria-label": l.label,
      disabled: l.disabled,
      onClick: m[0] || (m[0] = xe((v) => c.value = !c.value, ["stop"]))
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = T(() => $e(n.config, n.stage)), y = T(() => n.config.stages[n.stage].model), x = T({ get: () => v.value, set: (w) => {
      n.config.stages[n.stage].enabled = w;
    } }), k = T(() => {
      const w = n.config, t = w.stages;
      switch (n.stage) {
        case "map":
          return w.fields.filter((a) => a.search_within === "sections").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...t.prefetch.queries.map((a) => ({ text: a.name || "Untitled query", tone: "" })), ...w.fields.filter((a) => a.search_hints.trim()).map((a) => ({ text: a.name, tone: "hint" }))];
        case "scout":
          return t.scout.mode === "agent" ? t.scout.tools.map((a) => ({ text: Ce(a).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((a) => a.strategy === "deep").map((a) => ({ text: a.name || "New field", tone: "primary" }));
        case "extract":
          return ze(w).map((a) => ({ text: `${a.name} · ${a.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), B = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, t) => (s(), o("div", {
      class: P(["node", { active: l.active, off: !v.value, fixed: l.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(ie)[l.stage],
      onClick: t[1] || (t[1] = (a) => m("select")),
      onKeydown: [
        t[2] || (t[2] = Te((a) => m("select"), ["enter"])),
        t[3] || (t[3] = Te(xe((a) => m("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", cl, [
        r(h(L), {
          icon: h(Ue)[l.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", ml, [
        e("span", vl, i(h(ie)[l.stage]), 1),
        e("span", bl, i(v.value ? h(_e)(l.stage, l.config) : "Off"), 1),
        v.value && k.value.length ? (s(), o("span", pl, [
          (s(!0), o(S, null, O(k.value, (a) => (s(), o("span", {
            key: a.text,
            class: P(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        l.trace ? (s(), o("span", yl, [
          r(h(L), {
            icon: l.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          $(i(B(l.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", fl, [
        v.value && y.value ? (s(), o("span", gl, i(h(Pe)(y.value)), 1)) : p("", !0),
        l.stage !== "extract" && !l.readonly ? (s(), ee(K, {
          key: 1,
          modelValue: x.value,
          "onUpdate:modelValue": t[0] || (t[0] = (a) => x.value = a),
          label: `Enable ${h(ie)[l.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, rl));
  }
}), hl = ["aria-labelledby"], kl = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], be = /* @__PURE__ */ H({
  __name: "Segmented",
  props: /* @__PURE__ */ we({
    options: {},
    labelledBy: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(l) {
    const c = l, n = ge(l, "modelValue"), m = D([]);
    function v(y, x) {
      const k = c.options.length - 1, B = { ArrowRight: x + 1, ArrowDown: x + 1, ArrowLeft: x - 1, ArrowUp: x - 1, Home: 0, End: k }[y.key];
      if (B === void 0) return;
      y.preventDefault();
      const w = (B + c.options.length) % c.options.length;
      n.value = c.options[w].value, m.value[w]?.focus();
    }
    return (y, x) => (s(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": l.labelledBy
    }, [
      (s(!0), o(S, null, O(l.options, (k, B) => (s(), o("button", {
        key: k.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: m,
        type: "button",
        role: "radio",
        "aria-checked": n.value === k.value,
        tabindex: n.value === k.value ? 0 : -1,
        disabled: l.disabled,
        onClick: (w) => n.value = k.value,
        onKeydown: (w) => v(w, B)
      }, i(k.label), 41, kl))), 128))
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], y = v.filter((w) => ["text", "number", "boolean", "date", "object"].includes(w.value)), x = T(() => We(n.field, n.otherNames)), k = T(() => n.field.type !== "boolean" && n.field.type !== "enum" && !(n.field.type === "list" && n.field.item_type === "boolean"));
    de(() => [n.field.type, n.field.item_type], () => {
      !Ae(n.field) && n.field.enum_values.length && (n.field.enum_values = []);
    });
    function B(w) {
      n.field.enum_values = [...new Set(w.target.value.split(`
`).map((t) => t.trim()).filter(Boolean))];
    }
    return (w, t) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("div", xl, [
        e("label", null, [
          t[14] || (t[14] = $("Name", -1)),
          W(e("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (a) => l.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!x.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, wl), [
            [
              Z,
              l.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          t[15] || (t[15] = $("Type", -1)),
          W(e("select", {
            "onUpdate:modelValue": t[1] || (t[1] = (a) => l.field.type = a),
            "aria-label": "Field type"
          }, [
            (s(), o(S, null, O(v, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, Vl)), 64))
          ], 512), [
            [fe, l.field.type]
          ])
        ])
      ]),
      x.value ? (s(), o("p", Sl, [
        r(h(L), { icon: "tabler:alert-circle" }),
        $(i(x.value), 1)
      ])) : p("", !0),
      l.field.type === "list" ? (s(), o("label", Cl, [
        t[16] || (t[16] = $("Each item is", -1)),
        W(e("select", {
          "onUpdate:modelValue": t[2] || (t[2] = (a) => l.field.item_type = a)
        }, [
          (s(!0), o(S, null, O(h(y), (a) => (s(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, ql))), 128))
        ], 512), [
          [fe, l.field.item_type]
        ])
      ])) : p("", !0),
      h(Ae)(l.field) ? (s(), o("label", Ul, [
        $(i(l.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: l.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: B
        }, null, 40, Ml),
        e("small", null, i(l.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : p("", !0),
      e("label", null, [
        t[17] || (t[17] = $("Description", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": t[3] || (t[3] = (a) => l.field.description = a),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [Z, l.field.description]
        ]),
        t[18] || (t[18] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      t[34] || (t[34] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        t[19] || (t[19] = $("Search hints", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": t[4] || (t[4] = (a) => l.field.search_hints = a),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [Z, l.field.search_hints]
        ]),
        t[20] || (t[20] = e("small", null, "Each line is an extra search for this field in Prefetch and Deep analysis.", -1))
      ]),
      e("div", El, [
        e("label", null, [
          t[22] || (t[22] = $("Strategy", -1)),
          W(e("select", {
            "onUpdate:modelValue": t[5] || (t[5] = (a) => l.field.strategy = a)
          }, [...t[21] || (t[21] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [fe, l.field.strategy]
          ])
        ]),
        e("label", null, [
          t[23] || (t[23] = $("Chunks to read", -1)),
          W(e("input", {
            "onUpdate:modelValue": t[6] || (t[6] = (a) => l.field.chunks = a),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              Z,
              l.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          t[24] || (t[24] = e("small", null, "Per search hint", -1))
        ])
      ]),
      l.field.strategy === "deep" && !l.deepEnabled ? (s(), o("p", Nl, [
        r(h(L), { icon: "tabler:info-circle" }),
        t[25] || (t[25] = $("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Bl, [
        t[26] || (t[26] = e("span", { id: "within-label" }, "Search within", -1)),
        r(be, {
          modelValue: l.field.search_within,
          "onUpdate:modelValue": t[7] || (t[7] = (a) => l.field.search_within = a),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, i(l.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      l.field.search_within === "sections" && !l.mapEnabled ? (s(), o("p", Tl, [
        r(h(L), { icon: "tabler:alert-circle" }),
        t[27] || (t[27] = $("Turn on Map the document to read sections.", -1))
      ])) : p("", !0),
      e("label", null, [
        t[28] || (t[28] = $("Group", -1)),
        W(e("input", {
          "onUpdate:modelValue": t[8] || (t[8] = (a) => l.field.group = a),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            Z,
            l.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Rl, [
          (s(!0), o(S, null, O(l.groups, (a) => (s(), o("option", {
            key: a,
            value: a
          }, null, 8, Al))), 128))
        ]),
        t[29] || (t[29] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      t[35] || (t[35] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        t[30] || (t[30] = $("Validation hints", -1)),
        W(e("textarea", {
          "onUpdate:modelValue": t[9] || (t[9] = (a) => l.field.validation_hints = a),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [Z, l.field.validation_hints]
        ])
      ]),
      k.value ? (s(), o("label", Dl, [
        t[31] || (t[31] = $("Expected format", -1)),
        W(e("input", {
          "onUpdate:modelValue": t[10] || (t[10] = (a) => l.field.expected_format = a),
          placeholder: h(el)(l.field)
        }, null, 8, Ll), [
          [Z, l.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Ol, [
        t[32] || (t[32] = e("span", null, [
          $("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        r(K, {
          modelValue: l.field.required,
          "onUpdate:modelValue": t[11] || (t[11] = (a) => l.field.required = a),
          label: "Required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Fl, [
        t[33] || (t[33] = e("span", null, [
          $("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        r(K, {
          modelValue: l.field.evidence_required,
          "onUpdate:modelValue": t[12] || (t[12] = (a) => l.field.evidence_required = a),
          label: "Evidence required",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      l.readonly ? p("", !0) : (s(), o("button", {
        key: 6,
        type: "button",
        class: "btn danger-text",
        onClick: t[13] || (t[13] = (a) => m("remove"))
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
  setup(l, { emit: c }) {
    const n = c, m = D(!!customElements.get("wc-model-picker")), v = D("");
    qe(async () => {
      if (!m.value)
        try {
          await Fe("wc-model-picker", { timeoutMs: 8e3 }), m.value = !0;
        } catch (x) {
          v.value = x instanceof Error ? x.message : String(x);
        }
    });
    function y(x) {
      const k = x.detail;
      typeof k == "string" && n("select", k);
    }
    return (x, k) => m.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: l.value,
      capability: l.capability,
      "aria-labelledby": l.labelledBy,
      onSelect: y
    }, null, 40, Pl)) : v.value ? (s(), o("p", Wl, "Could not load model picker: " + i(v.value), 1)) : (s(), o("span", jl, "Loading models…"));
  }
}), Il = { class: "slider" }, Ql = { class: "slider-head" }, Kl = { class: "slider-value" }, Hl = ["aria-label", "aria-valuetext", "disabled"], Jl = {
  key: 0,
  class: "slider-hints"
}, Gl = { key: 1 }, me = 1e3, J = /* @__PURE__ */ H({
  __name: "Slider",
  props: /* @__PURE__ */ we({
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
    const c = l, n = ge(l, "modelValue"), m = T(() => c.percent ? `${Math.round(n.value * 100)}%` : `${n.value.toLocaleString()}${c.unit ? ` ${c.unit}` : ""}`), v = (k) => c.log ? Math.log(k / c.min) / Math.log(c.max / c.min) * me : (k - c.min) / (c.max - c.min) * me;
    function y(k) {
      const B = c.log ? c.min * Math.pow(c.max / c.min, k / me) : c.min + (c.max - c.min) * k / me, w = Math.round(B / c.step) * c.step;
      return Math.min(c.max, Math.max(c.min, Number(w.toFixed(4))));
    }
    const x = T({ get: () => Math.round(v(n.value)), set: (k) => {
      n.value = y(k);
    } });
    return (k, B) => (s(), o("div", Il, [
      e("div", Ql, [
        e("span", null, i(l.label), 1),
        e("output", Kl, i(m.value), 1)
      ]),
      W(e("input", {
        "onUpdate:modelValue": B[0] || (B[0] = (w) => x.value = w),
        type: "range",
        min: "0",
        max: me,
        step: "1",
        "aria-label": l.label,
        "aria-valuetext": m.value,
        disabled: l.disabled,
        style: pe({ "--fill": `${x.value / me * 100}%` })
      }, null, 12, Hl), [
        [
          Z,
          x.value,
          void 0,
          { number: !0 }
        ]
      ]),
      l.hints ? (s(), o("div", Jl, [
        e("span", null, i(l.hints[0]), 1),
        e("span", null, i(l.hints[1]), 1)
      ])) : p("", !0),
      l.note ? (s(), o("small", Gl, i(l.note), 1)) : p("", !0)
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
  setup(l) {
    const c = l;
    return (n, m) => (s(), o("figure", Xl, [
      e("div", Yl, [
        m[2] || (m[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (s(!0), o(S, null, O(Math.min(c.rounds, 8), (v) => (s(), o(S, { key: v }, [
          m[0] || (m[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Zl, [
            e("span", null, "R" + i(v), 1),
            e("span", _l, [
              (s(!0), o(S, null, O(Math.min(c.extra, 6), (y) => (s(), o("i", { key: y }))), 128))
            ])
          ])
        ], 64))), 128)),
        c.rounds > 8 ? (s(), o(S, { key: 0 }, [
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
  setup(l) {
    const c = l, n = T(() => Math.min(c.queries * c.perQuery, c.cap));
    return (m, v) => (s(), o("figure", at, [
      e("div", nt, [
        e("span", st, [
          e("b", null, i(l.fields), 1),
          $(" field" + i(l.fields === 1 ? "" : "s"), 1),
          e("small", null, i(l.parallel) + " at a time", 1)
        ]),
        e("span", ot, [
          e("b", null, i(l.queries), 1),
          v[0] || (v[0] = $(" queries", -1)),
          v[1] || (v[1] = e("small", null, "per field", -1))
        ]),
        e("span", it, [
          e("b", null, i(l.perQuery), 1),
          v[2] || (v[2] = $(" chunks", -1)),
          v[3] || (v[3] = e("small", null, "per query", -1))
        ]),
        e("span", dt, [
          e("b", null, i(n.value), 1),
          v[4] || (v[4] = $(" chunks", -1)),
          e("small", null, i(l.queries * l.perQuery > l.cap ? `capped at ${l.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(n.value) + " chunks are read for it before analysis.", 1)
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
  setup(l) {
    const c = l, n = T(() => c.config.stages), m = (w) => nl(c.stage, w), v = ll(), y = T(() => c.config.fields.filter((w) => w.strategy === "deep").length), x = T(() => c.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), k = T(() => ze(c.config));
    function B(w, t) {
      const a = n.value.scout.tools.filter((q) => q !== w);
      n.value.scout.tools = t ? [...a, w] : a;
    }
    return (w, t) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", ct, i(h(tl)[l.stage]), 1),
      l.stage === "map" ? (s(), o(S, { key: 0 }, [
        e("div", mt, [
          t[34] || (t[34] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: n.value.map.enabled,
            "onUpdate:modelValue": t[0] || (t[0] = (a) => n.value.map.enabled = a),
            label: "Enable step",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", vt, [
          t[35] || (t[35] = e("span", { id: "outline-label" }, "Outline", -1)),
          r(be, {
            modelValue: n.value.map.outline,
            "onUpdate:modelValue": t[1] || (t[1] = (a) => n.value.map.outline = a),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          t[36] || (t[36] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", bt, [
          t[37] || (t[37] = e("span", null, [
            $("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          r(K, {
            modelValue: n.value.map.section_summaries,
            "onUpdate:modelValue": t[2] || (t[2] = (a) => n.value.map.section_summaries = a),
            label: "Section summaries",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t[39] || (t[39] = e("h4", null, "Models", -1)),
        e("div", pt, [
          t[38] || (t[38] = e("span", null, "Outliner", -1)),
          r(te, {
            value: n.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: t[3] || (t[3] = (a) => n.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        t[40] || (t[40] = e("h4", null, "Fields that read sections", -1)),
        x.value.length ? (s(), o("p", yt, [
          (s(!0), o(S, null, O(x.value, (a) => (s(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (s(), o("p", ft, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      l.stage === "prefetch" ? (s(), o(S, { key: 1 }, [
        e("div", gt, [
          t[41] || (t[41] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: n.value.prefetch.enabled,
            "onUpdate:modelValue": t[4] || (t[4] = (a) => n.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        t[45] || (t[45] = e("h4", null, "Queries", -1)),
        (s(!0), o(S, null, O(n.value.prefetch.queries, (a, q) => (s(), o("div", {
          key: q,
          class: "query-row"
        }, [
          e("div", ht, [
            e("label", null, [
              t[42] || (t[42] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": (V) => a.name = V,
                placeholder: "Parties"
              }, null, 8, kt), [
                [Z, a.name]
              ])
            ]),
            e("label", null, [
              t[43] || (t[43] = $("Chunks", -1)),
              W(e("input", {
                "onUpdate:modelValue": (V) => a.chunks = V,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, $t), [
                [
                  Z,
                  a.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            t[44] || (t[44] = $("Query", -1)),
            W(e("textarea", {
              "onUpdate:modelValue": (V) => a.query = V,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, xt), [
              [Z, a.query]
            ])
          ]),
          l.readonly ? p("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (V) => n.value.prefetch.queries.splice(q, 1)
          }, "Remove query", 8, wt))
        ]))), 128)),
        n.value.prefetch.queries.length ? p("", !0) : (s(), o("p", Vt, "No fixed queries. Field search hints still run.")),
        l.readonly ? p("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: t[5] || (t[5] = (a) => n.value.prefetch.queries.push(h(al)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      l.stage === "scout" ? (s(), o(S, { key: 2 }, [
        e("div", St, [
          t[46] || (t[46] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: n.value.scout.enabled,
            "onUpdate:modelValue": t[6] || (t[6] = (a) => n.value.scout.enabled = a),
            label: "Enable step",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ct, [
          t[47] || (t[47] = e("span", { id: "mode-label" }, "Mode", -1)),
          r(be, {
            modelValue: n.value.scout.mode,
            "onUpdate:modelValue": t[7] || (t[7] = (a) => n.value.scout.mode = a),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, i(n.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        n.value.scout.mode === "loop" ? (s(), ee(tt, {
          key: 0,
          rounds: n.value.scout.max_rounds,
          confidence: n.value.scout.target_confidence,
          extra: n.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : p("", !0),
        t[52] || (t[52] = e("h4", null, "Models", -1)),
        e("div", qt, [
          t[48] || (t[48] = e("span", null, "Scout", -1)),
          r(te, {
            value: n.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: t[8] || (t[8] = (a) => n.value.scout.model = a)
          }, null, 8, ["value"])
        ]),
        t[53] || (t[53] = e("h4", null, "Loop", -1)),
        r(J, {
          modelValue: n.value.scout.max_rounds,
          "onUpdate:modelValue": t[9] || (t[9] = (a) => n.value.scout.max_rounds = a),
          label: n.value.scout.mode === "agent" ? "Rounds" : "Follow-up rounds",
          min: m("max_rounds").min,
          max: m("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        n.value.scout.mode === "loop" ? (s(), ee(J, {
          key: 1,
          modelValue: n.value.scout.target_confidence,
          "onUpdate:modelValue": t[10] || (t[10] = (a) => n.value.scout.target_confidence = a),
          label: "Stop at confidence",
          min: m("target_confidence").min,
          max: m("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])) : p("", !0),
        r(J, {
          modelValue: n.value.scout.max_extra_queries,
          "onUpdate:modelValue": t[11] || (t[11] = (a) => n.value.scout.max_extra_queries = a),
          label: n.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: m("max_extra_queries").min,
          max: m("max_extra_queries").max,
          disabled: l.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.scout.max_tokens,
          "onUpdate:modelValue": t[12] || (t[12] = (a) => n.value.scout.max_tokens = a),
          label: "Scout output limit",
          min: m("max_tokens").min,
          max: m("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        n.value.scout.mode === "agent" ? (s(), o("p", Ut, "Tool budget: " + i(n.value.scout.max_rounds * n.value.scout.max_extra_queries) + " calls.", 1)) : p("", !0),
        n.value.scout.mode === "loop" ? (s(), o("div", Mt, [
          t[49] || (t[49] = e("span", null, [
            $("Drop noisy chunks"),
            e("small", null, "Chunks no field needs leave the evidence pool; chunks cited for a field always stay.")
          ], -1)),
          r(K, {
            modelValue: n.value.scout.drop_noise,
            "onUpdate:modelValue": t[13] || (t[13] = (a) => n.value.scout.drop_noise = a),
            label: "Drop noisy chunks",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])) : p("", !0),
        e("div", Et, [
          t[50] || (t[50] = e("span", null, [
            $("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          r(K, {
            modelValue: n.value.scout.share_notes,
            "onUpdate:modelValue": t[14] || (t[14] = (a) => n.value.scout.share_notes = a),
            label: "Share scout notes with extraction",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.scout.mode === "agent" ? (s(), o(S, { key: 4 }, [
          t[51] || (t[51] = e("h4", null, "Agent tools", -1)),
          (s(!0), o(S, null, O(h(v), (a) => (s(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, [
              $(i(h(Ce)(a)), 1),
              e("small", Nt, i(a), 1)
            ]),
            r(K, {
              "model-value": n.value.scout.tools.includes(a),
              label: h(Ce)(a),
              disabled: l.readonly,
              "onUpdate:modelValue": (q) => B(a, q)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      l.stage === "deep" ? (s(), o(S, { key: 3 }, [
        e("div", Bt, [
          t[54] || (t[54] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: n.value.deep.enabled,
            "onUpdate:modelValue": t[15] || (t[15] = (a) => n.value.deep.enabled = a),
            label: "Enable step",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r(ut, {
          fields: y.value,
          parallel: n.value.deep.parallel_fields,
          queries: n.value.deep.max_queries,
          "per-query": n.value.deep.chunks_per_query,
          cap: n.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Tt, [
          t[55] || (t[55] = e("span", { id: "read-label" }, "Reads", -1)),
          r(be, {
            modelValue: n.value.deep.read,
            "onUpdate:modelValue": t[16] || (t[16] = (a) => n.value.deep.read = a),
            "labelled-by": "read-label",
            options: [{ value: "chunks", label: "Retrieved chunks" }, { value: "sections", label: "Whole sections" }]
          }, null, 8, ["modelValue"]),
          t[56] || (t[56] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        t[59] || (t[59] = e("h4", null, "Models", -1)),
        e("div", Rt, [
          t[57] || (t[57] = e("span", null, "Analysis", -1)),
          r(te, {
            value: n.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: t[17] || (t[17] = (a) => n.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", At, [
          t[58] || (t[58] = e("span", null, "Query writer", -1)),
          r(te, {
            value: n.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: t[18] || (t[18] = (a) => n.value.deep.query_model = a)
          }, null, 8, ["value"])
        ]),
        t[60] || (t[60] = e("h4", null, "Reach", -1)),
        r(J, {
          modelValue: n.value.deep.parallel_fields,
          "onUpdate:modelValue": t[19] || (t[19] = (a) => n.value.deep.parallel_fields = a),
          label: "Fields at a time",
          min: m("parallel_fields").min,
          max: m("parallel_fields").max,
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.deep.max_queries,
          "onUpdate:modelValue": t[20] || (t[20] = (a) => n.value.deep.max_queries = a),
          label: "Queries per field",
          min: m("max_queries").min,
          max: m("max_queries").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.deep.chunks_per_query,
          "onUpdate:modelValue": t[21] || (t[21] = (a) => n.value.deep.chunks_per_query = a),
          label: "Chunks per query",
          min: m("chunks_per_query").min,
          max: m("chunks_per_query").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.deep.chunk_cap,
          "onUpdate:modelValue": t[22] || (t[22] = (a) => n.value.deep.chunk_cap = a),
          label: "Chunk cap per field",
          min: m("chunk_cap").min,
          max: m("chunk_cap").max,
          log: "",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.deep.min_similarity,
          "onUpdate:modelValue": t[23] || (t[23] = (a) => n.value.deep.min_similarity = a),
          label: "Minimum similarity",
          min: m("min_similarity").min,
          max: m("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        t[61] || (t[61] = e("h4", null, "Temperature", -1)),
        r(J, {
          modelValue: n.value.deep.query_temperature,
          "onUpdate:modelValue": t[24] || (t[24] = (a) => n.value.deep.query_temperature = a),
          label: "Query writing",
          min: m("query_temperature").min,
          max: m("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(J, {
          modelValue: n.value.deep.analysis_temperature,
          "onUpdate:modelValue": t[25] || (t[25] = (a) => n.value.deep.analysis_temperature = a),
          label: "Analysis",
          min: m("analysis_temperature").min,
          max: m("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : p("", !0),
      l.stage === "extract" ? (s(), o(S, { key: 4 }, [
        t[64] || (t[64] = e("h4", null, "Models", -1)),
        e("div", Dt, [
          t[62] || (t[62] = e("span", null, "Extraction", -1)),
          r(te, {
            value: n.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: t[26] || (t[26] = (a) => n.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        t[65] || (t[65] = e("h4", null, "Field groups", -1)),
        e("ul", Lt, [
          (s(!0), o(S, null, O(k.value, (a) => (s(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Ot, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        k.value.length ? p("", !0) : (s(), o("p", Ft, "No fields yet.")),
        r(J, {
          modelValue: n.value.extract.max_fields_per_call,
          "onUpdate:modelValue": t[27] || (t[27] = (a) => n.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: m("max_fields_per_call").min,
          max: m("max_fields_per_call").max,
          disabled: l.readonly,
          note: `${h(De)(l.config)} extraction call${h(De)(l.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        r(J, {
          modelValue: n.value.extract.max_output_tokens,
          "onUpdate:modelValue": t[28] || (t[28] = (a) => n.value.extract.max_output_tokens = a),
          label: "Output limit",
          min: m("max_output_tokens").min,
          max: m("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: l.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", zt, [
          t[63] || (t[63] = e("span", null, [
            $("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          r(K, {
            modelValue: n.value.extract.structured_output,
            "onUpdate:modelValue": t[29] || (t[29] = (a) => n.value.extract.structured_output = a),
            label: "Structured output",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : p("", !0),
      l.stage === "verify" ? (s(), o(S, { key: 5 }, [
        e("div", Pt, [
          t[66] || (t[66] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: n.value.verify.enabled,
            "onUpdate:modelValue": t[30] || (t[30] = (a) => n.value.verify.enabled = a),
            label: "Enable step",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Wt, [
          t[67] || (t[67] = e("span", null, [
            $("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          r(K, {
            modelValue: n.value.verify.check_quotes,
            "onUpdate:modelValue": t[31] || (t[31] = (a) => n.value.verify.check_quotes = a),
            label: "Quotes exist",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", jt, [
          t[68] || (t[68] = e("span", null, [
            $("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          r(K, {
            modelValue: n.value.verify.check_support,
            "onUpdate:modelValue": t[32] || (t[32] = (a) => n.value.verify.check_support = a),
            label: "Quotes support values",
            disabled: l.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.verify.check_support ? (s(), o(S, { key: 0 }, [
          t[70] || (t[70] = e("h4", null, "Models", -1)),
          e("div", It, [
            t[69] || (t[69] = e("span", null, "Checker", -1)),
            r(te, {
              value: n.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: t[33] || (t[33] = (a) => n.value.verify.model = a)
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
  setup(l) {
    const c = l, n = T(() => Math.min(0.9, Math.max(0, c.overlap / c.size))), m = T(() => {
      const v = 100 / (3 - 2 * n.value);
      return [0, 1, 2].map((y) => ({ x: y * v * (1 - n.value), w: v }));
    });
    return (v, y) => (s(), o("figure", Kt, [
      (s(), o("svg", Ht, [
        (s(!0), o(S, null, O(m.value, (x, k) => (s(), o("rect", {
          key: k,
          x: x.x,
          y: k % 2 ? 14 : 4,
          width: x.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Jt))), 128)),
        (s(), o(S, null, O([1, 2], (x) => e("rect", {
          key: "o" + x,
          x: m.value[x].x,
          y: 4,
          width: m.value[x - 1].x + m.value[x - 1].w - m.value[x].x,
          height: "24",
          class: "shared"
        }, null, 8, Gt)), 64))
      ])),
      e("figcaption", null, i(l.size.toLocaleString()) + " tokens per chunk · " + i(l.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(n.value * 100)) + "%)", 1)
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
  setup(l) {
    const c = l, n = T(() => c.config.retrieval), m = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], v = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], y = he("chunk_size"), x = he("overlap"), k = he("top_results"), B = he("section_budget"), w = T(() => Math.min(x.max, n.value.chunk_size - 50));
    return (t, a) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: l.readonly
    }, [
      e("p", Zt, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(l.retention) + ".", 1),
      a[20] || (a[20] = e("h4", null, "Chunks", -1)),
      r(Xt, {
        size: n.value.chunk_size,
        overlap: n.value.overlap
      }, null, 8, ["size", "overlap"]),
      r(J, {
        modelValue: n.value.chunk_size,
        "onUpdate:modelValue": a[0] || (a[0] = (q) => n.value.chunk_size = q),
        label: "Chunk size",
        min: h(y).min,
        max: h(y).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      r(J, {
        modelValue: n.value.overlap,
        "onUpdate:modelValue": a[1] || (a[1] = (q) => n.value.overlap = q),
        label: "Overlap",
        min: h(x).min,
        max: w.value,
        step: 10,
        unit: "tokens",
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", _t, [
        a[12] || (a[12] = e("span", null, [
          $("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        r(K, {
          modelValue: n.value.split_headings,
          "onUpdate:modelValue": a[2] || (a[2] = (q) => n.value.split_headings = q),
          label: "Split by headings",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", ea, [
        a[13] || (a[13] = e("span", null, [
          $("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        r(K, {
          modelValue: n.value.keep_tables,
          "onUpdate:modelValue": a[3] || (a[3] = (q) => n.value.keep_tables = q),
          label: "Keep tables whole",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r(J, {
        modelValue: n.value.section_budget,
        "onUpdate:modelValue": a[4] || (a[4] = (q) => n.value.section_budget = q),
        label: "Section budget",
        min: h(B).min,
        max: h(B).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      a[21] || (a[21] = e("h4", null, "Context", -1)),
      e("div", la, [
        a[14] || (a[14] = e("span", { id: "context-label" }, "Chunk context", -1)),
        r(be, {
          modelValue: n.value.context,
          "onUpdate:modelValue": a[5] || (a[5] = (q) => n.value.context = q),
          "labelled-by": "context-label",
          options: v
        }, null, 8, ["modelValue"]),
        e("small", null, i(v.find((q) => q.value === n.value.context)?.note), 1)
      ]),
      n.value.context === "generated" ? (s(), o("div", ta, [
        a[15] || (a[15] = e("span", null, "Context writer", -1)),
        r(te, {
          value: n.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: a[6] || (a[6] = (q) => n.value.context_model = q)
        }, null, 8, ["value"])
      ])) : p("", !0),
      a[22] || (a[22] = e("h4", null, "Search", -1)),
      e("div", aa, [
        a[16] || (a[16] = e("span", { id: "mode-label" }, "Search mode", -1)),
        r(be, {
          modelValue: n.value.search_mode,
          "onUpdate:modelValue": a[7] || (a[7] = (q) => n.value.search_mode = q),
          "labelled-by": "mode-label",
          options: m
        }, null, 8, ["modelValue"]),
        e("small", null, i(m.find((q) => q.value === n.value.search_mode)?.note), 1)
      ]),
      r(J, {
        modelValue: n.value.top_results,
        "onUpdate:modelValue": a[8] || (a[8] = (q) => n.value.top_results = q),
        label: "Results per query",
        min: h(k).min,
        max: h(k).max,
        disabled: l.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      a[23] || (a[23] = e("h4", null, "Models", -1)),
      e("div", na, [
        a[17] || (a[17] = e("span", null, "Embedding", -1)),
        r(te, {
          value: n.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: a[9] || (a[9] = (q) => n.value.embedding_model = q)
        }, null, 8, ["value"])
      ]),
      e("div", sa, [
        a[18] || (a[18] = e("span", null, [
          $("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        r(K, {
          modelValue: n.value.highlighter,
          "onUpdate:modelValue": a[10] || (a[10] = (q) => n.value.highlighter = q),
          label: "Highlighter",
          disabled: l.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      n.value.highlighter ? (s(), o("div", oa, [
        a[19] || (a[19] = e("span", null, "Highlighter", -1)),
        r(te, {
          value: n.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: a[11] || (a[11] = (q) => n.value.highlighter_model = q)
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
}, Ya = { class: "output-list" }, Za = { class: "mono" }, _a = { class: "chip" }, en = { class: "rail-label" }, Ve = 400, ke = 320, ln = /* @__PURE__ */ H({
  __name: "Builder",
  props: /* @__PURE__ */ we({
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
    const c = l, n = ge(l, "title"), m = ge(l, "description"), v = D({ kind: "document" });
    function y(g, d) {
      try {
        const U = localStorage.getItem(`docscout.${g}`);
        return U === null ? d : U === "1";
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
    const k = D(y("panel", !0)), B = D(y("fields", !0)), w = D(y("flow", !0));
    function t() {
      try {
        const g = Number(localStorage.getItem("docscout.panelWidth"));
        return g >= ke ? g : Ve;
      } catch {
        return Ve;
      }
    }
    const a = D(t()), q = () => {
      const g = _.value?.clientWidth;
      return g ? Math.max(ke, g - 420) : Number.POSITIVE_INFINITY;
    };
    function V(g, d = !0) {
      if (a.value = Math.round(Math.min(q(), Math.max(ke, g))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const M = D(!1);
    function F(g) {
      const d = g.currentTarget, U = g.clientX, X = a.value;
      d.setPointerCapture(g.pointerId), M.value = !0;
      const oe = (Ge) => V(X + (U - Ge.clientX), !1), Be = () => {
        M.value = !1, V(a.value), d.removeEventListener("pointermove", oe), d.removeEventListener("pointerup", Be);
      };
      d.addEventListener("pointermove", oe), d.addEventListener("pointerup", Be);
    }
    function f(g) {
      g.key === "ArrowLeft" ? (V(a.value + 24), g.preventDefault()) : g.key === "ArrowRight" && (V(a.value - 24), g.preventDefault());
    }
    function N(g) {
      k.value = g, j.value || x("panel", g);
    }
    function A(g) {
      const d = g === "fields" ? B : w;
      d.value = !d.value, x(g, d.value);
    }
    const _ = D(), j = D(!1);
    let Y;
    qe(() => {
      Y = new ResizeObserver(([g]) => {
        const d = j.value;
        j.value = g.contentRect.width < 1e3, j.value && !d && (k.value = !1), !j.value && d && (k.value = y("panel", !0));
      }), _.value && Y.observe(_.value);
    }), Oe(() => Y?.disconnect());
    const ae = D();
    de(v, async () => {
      await Xe(), ae.value && (ae.value.scrollTop = 0);
    });
    function Q(g) {
      v.value = g, k.value = !0;
    }
    const G = (g) => JSON.stringify(g) === JSON.stringify(v.value), ne = T(() => v.value.kind === "field" ? c.config.fields[v.value.index] : void 0), E = T(() => {
      const g = v.value;
      return g.kind === "stage" ? ie[g.stage] : g.kind === "field" ? ne.value?.name || "New field" : g.kind === "document" ? "Read document" : g.kind === "output" ? "Output" : "Details";
    }), z = T(() => {
      const g = v.value;
      return g.kind === "stage" ? Ue[g.stage] : g.kind === "field" ? "tabler:forms" : g.kind === "document" ? "tabler:file-text" : g.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), I = T(() => c.config.fields.filter((g, d) => !(v.value.kind === "field" && v.value.index === d)).map((g) => g.name)), le = T(() => c.config.stages.deep.enabled), C = T(() => c.config.stages.map.enabled), b = T(() => [...new Set(c.config.fields.map((g) => g.group.trim()).filter(Boolean))]), u = (g) => We(c.config.fields[g], c.config.fields.filter((d, U) => U !== g).map((d) => d.name)), R = ["map", "prefetch", "scout", "deep", "extract", "verify"], Ie = T(() => R.filter((g) => $e(c.config, g)).map((g) => ie[g]).join(" · ")), Qe = T(() => c.config.fields.map((g) => g.name || "New field").join(", ")), Ke = T(() => R.filter((g) => $e(c.config, g)).length), ue = (g) => c.result?.trace.find((d) => d.kind === g);
    function He() {
      c.config.fields.push(ol()), B.value = !0, Q({ kind: "field", index: c.config.fields.length - 1 });
    }
    function Je(g) {
      c.config.fields.splice(g, 1), v.value = { kind: "document" };
    }
    function Me(g, d) {
      const U = c.config.fields, X = g + d;
      if (X < 0 || X >= U.length) return;
      const [oe] = U.splice(g, 1);
      U.splice(X, 0, oe), v.value = { kind: "field", index: X };
    }
    const Ee = (g) => g.type === "list" ? `list of ${g.item_type}` : g.type, Ne = T({ get: () => c.config.tags.join(", "), set: (g) => {
      c.config.tags = [...new Set(g.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (g, d) => (s(), o("div", {
      ref_key: "root",
      ref: _,
      class: P(["builder", { narrow: j.value, "panel-open": k.value, resizing: M.value }])
    }, [
      e("div", da, [
        e("div", ua, [
          e("section", ra, [
            e("header", ca, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": B.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (U) => A("fields"))
              }, [
                r(h(L), {
                  icon: B.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", va, i(l.config.fields.length), 1)
              ], 8, ma),
              !B.value && l.config.fields.length ? (s(), o("span", ba, i(Qe.value), 1)) : p("", !0),
              l.readonly ? p("", !0) : (s(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: He
              }, [
                r(h(L), { icon: "tabler:plus" }),
                d[20] || (d[20] = $("Add field", -1))
              ]))
            ]),
            W(e("div", pa, [
              l.config.fields.length ? (s(), o("ul", fa, [
                (s(!0), o(S, null, O(l.config.fields, (U, X) => (s(), o("li", {
                  key: X,
                  class: P(["row-item", { active: G({ kind: "field", index: X }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (oe) => Q({ kind: "field", index: X })
                  }, [
                    e("span", ha, [
                      $(i(U.name || "New field"), 1),
                      U.required ? (s(), o("span", ka, "*")) : p("", !0),
                      u(X) ? (s(), ee(h(L), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: u(X)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: P(["row-desc", { missing: !U.description }])
                    }, i(U.description || "No description"), 3),
                    e("span", $a, [
                      U.search_within === "sections" ? (s(), o("span", {
                        key: 0,
                        class: P(["chip", C.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      U.group.trim() ? (s(), o("span", xa, i(U.group), 1)) : p("", !0),
                      U.strategy === "deep" ? (s(), o("span", {
                        key: 2,
                        class: P(["chip", le.value ? "primary" : "muted-chip"]),
                        title: le.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, wa)) : p("", !0),
                      e("span", Va, i(Ee(U)), 1),
                      U.evidence_required ? (s(), o("span", Sa, [
                        r(h(L), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, ga),
                  l.readonly ? p("", !0) : (s(), o("span", Ca, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: X === 0,
                      onClick: (oe) => Me(X, -1)
                    }, [
                      r(h(L), { icon: "tabler:chevron-up" })
                    ], 8, qa),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: X === l.config.fields.length - 1,
                      onClick: (oe) => Me(X, 1)
                    }, [
                      r(h(L), { icon: "tabler:chevron-down" })
                    ], 8, Ua)
                  ]))
                ], 2))), 128))
              ])) : (s(), o("p", ya, "Add the values to pull from each document."))
            ], 512), [
              [Se, B.value]
            ])
          ]),
          e("section", Ma, [
            e("header", Ea, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (U) => A("flow"))
              }, [
                r(h(L), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Ba, i(Ke.value) + " of 6", 1)
              ], 8, Na),
              w.value ? p("", !0) : (s(), o("span", Ta, i(Ie.value), 1)),
              e("button", {
                type: "button",
                class: P(["btn small subtle push", { on: G({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (U) => Q({ kind: "details" }))
              }, [
                r(h(L), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = $("Details", -1))
              ], 2)
            ]),
            W(e("div", Ra, [
              e("button", {
                type: "button",
                class: P(["node fixed", { active: G({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (U) => Q({ kind: "document" }))
              }, [
                e("span", Aa, [
                  r(h(L), { icon: "tabler:file-text" })
                ]),
                e("span", Da, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", La, i(h(sl)(l.config.retrieval)), 1)
                ]),
                e("span", Oa, [
                  e("span", Fa, i(h(Pe)(l.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "map",
                config: l.config,
                active: G({ kind: "stage", stage: "map" }),
                trace: ue("map"),
                readonly: l.readonly,
                onSelect: d[4] || (d[4] = (U) => Q({ kind: "stage", stage: "map" }))
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
                    config: l.config,
                    active: G({ kind: "stage", stage: "prefetch" }),
                    trace: ue("prefetch"),
                    readonly: l.readonly,
                    onSelect: d[5] || (d[5] = (U) => Q({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  r(ce, {
                    stage: "scout",
                    config: l.config,
                    active: G({ kind: "stage", stage: "scout" }),
                    trace: ue("scout"),
                    readonly: l.readonly,
                    onSelect: d[6] || (d[6] = (U) => Q({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Wa, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  r(ce, {
                    stage: "deep",
                    config: l.config,
                    active: G({ kind: "stage", stage: "deep" }),
                    trace: ue("deep"),
                    readonly: l.readonly,
                    onSelect: d[7] || (d[7] = (U) => Q({ kind: "stage", stage: "deep" }))
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
                config: l.config,
                active: G({ kind: "stage", stage: "extract" }),
                trace: ue("extract"),
                readonly: l.readonly,
                onSelect: d[8] || (d[8] = (U) => Q({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "verify",
                config: l.config,
                active: G({ kind: "stage", stage: "verify" }),
                trace: ue("verify"),
                readonly: l.readonly,
                onSelect: d[9] || (d[9] = (U) => Q({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: P(["node fixed", { active: G({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (U) => Q({ kind: "output" }))
              }, [
                e("span", ja, [
                  r(h(L), { icon: "tabler:braces" })
                ]),
                e("span", Ia, [
                  d[27] || (d[27] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", Qa, i(l.config.fields.length ? `${l.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [Se, w.value]
            ])
          ])
        ])
      ]),
      j.value && k.value ? (s(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (U) => N(!1))
      })) : p("", !0),
      k.value ? (s(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: pe(j.value ? void 0 : { width: `${a.value}px` })
      }, [
        j.value ? p("", !0) : (s(), o("div", {
          key: 0,
          class: P(["resizer", { active: M.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": ke,
          onPointerdown: xe(F, ["prevent"]),
          onKeydown: f,
          onDblclick: d[12] || (d[12] = (U) => V(Ve))
        }, null, 42, Ka)),
        e("header", Ha, [
          e("span", Ja, [
            r(h(L), { icon: z.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(E.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (U) => N(!1))
          }, [
            r(h(L), {
              icon: j.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: ae,
          class: "side-panel-body"
        }, [
          v.value.kind === "document" ? (s(), ee(ia, {
            key: 0,
            config: l.config,
            retention: l.retention,
            readonly: l.readonly
          }, null, 8, ["config", "retention", "readonly"])) : v.value.kind === "stage" ? (s(), ee(Qt, {
            key: 1,
            stage: v.value.stage,
            config: l.config,
            readonly: l.readonly
          }, null, 8, ["stage", "config", "readonly"])) : v.value.kind === "field" && ne.value ? (s(), ee(zl, {
            key: 2,
            field: ne.value,
            "other-names": I.value,
            groups: b.value,
            "deep-enabled": le.value,
            "map-enabled": C.value,
            readonly: l.readonly,
            onRemove: d[14] || (d[14] = (U) => Je(v.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : v.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: l.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = $("Name", -1)),
              W(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (U) => n.value = U),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Z, n.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = $("Description", -1)),
              W(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (U) => m.value = U),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Z, m.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = $("Tags", -1)),
              W(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (U) => Ne.value = U),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Z,
                  Ne.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, Ga)) : v.value.kind === "output" ? (s(), o("div", Xa, [
            d[37] || (d[37] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", Ya, [
              (s(!0), o(S, null, O(l.config.fields, (U) => (s(), o("li", {
                key: U.name
              }, [
                e("span", Za, i(U.name || "New field"), 1),
                e("span", _a, i(Ee(U)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 4)) : j.value ? p("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (U) => N(!0))
      }, [
        r(h(L), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", en, i(E.value), 1)
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
  setup(l, { emit: c }) {
    const n = c, m = D(!1), v = D("");
    qe(async () => {
      try {
        await Fe("wc-multiselect", { timeoutMs: 8e3 }), m.value = !0;
      } catch (x) {
        v.value = String(x);
      }
    });
    function y(x) {
      const k = x.detail;
      n("select", k.selected[0] || "", k.labels?.[0] || "");
    }
    return (x, k) => m.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(l.value ? [l.value] : []),
      placeholder: "Choose an upload",
      onChange: y
    }, null, 40, tn)) : v.value ? (s(), o("p", an, i(v.value), 1)) : (s(), o("span", nn, "Loading uploads…"));
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = D(""), y = D(), x = (M) => `${Math.round(M * 100)}%`, k = (M) => M == null ? "—" : typeof M == "string" ? M : Array.isArray(M) && M.every((F) => typeof F != "object") ? M.join(", ") : typeof M == "object" ? JSON.stringify(M) : String(M), B = (M) => `${(M / 1e3).toFixed(1)}s`, w = T(() => Math.max(1, ...n.result?.trace.map((M) => M.duration_ms) ?? [1])), t = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, a = (M) => t[M]?.label ?? ie[M] ?? M, q = (M) => t[M]?.icon ?? Ue[M] ?? "tabler:point", V = (M) => M >= 0.9 ? "high" : M >= 0.7 ? "mid" : "low";
    return (M, F) => (s(), o("div", sn, [
      e("section", on, [
        e("div", dn, [
          r(je, {
            value: v.value,
            onSelect: F[0] || (F[0] = (f) => v.value = f)
          }, null, 8, ["value"])
        ]),
        r(h(ve), {
          label: l.running ? "Extracting…" : "Run extraction",
          loading: l.running,
          disabled: !v.value || l.running || !l.canRun,
          onClick: F[1] || (F[1] = (f) => m("run", v.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", un, i(l.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(l.retention) + ".", 1)
      ]),
      l.result ? p("", !0) : (s(), o("p", rn, "No extraction results yet.")),
      l.result?.status === "failed" ? (s(), o("p", cn, [
        r(h(L), { icon: "tabler:alert-triangle" }),
        $("The run stopped: " + i(l.result.error), 1)
      ])) : p("", !0),
      l.result ? (s(), o("div", mn, [
        e("section", vn, [
          e("header", bn, [
            F[2] || (F[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", pn, [
              $(i(l.result.tokens.toLocaleString()) + " tokens · " + i(B(l.result.duration_ms)), 1),
              l.result.pages ? (s(), o(S, { key: 0 }, [
                $(" · " + i(l.result.pages) + " pages", 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", yn, [
            (s(!0), o(S, null, O(l.result.fields, (f) => (s(), o("li", {
              key: f.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": y.value === f.name,
                onClick: (N) => y.value = y.value === f.name ? void 0 : f.name
              }, [
                e("span", gn, i(f.name), 1),
                e("span", {
                  class: P(["value-text", { missing: f.missing }]),
                  title: f.missing ? void 0 : k(f.value)
                }, i(f.missing ? "Not in the document" : k(f.value)), 11, hn),
                e("span", {
                  class: P(["confidence", V(f.confidence)])
                }, [
                  e("span", kn, [
                    e("span", {
                      style: pe({ width: x(f.confidence) })
                    }, null, 4)
                  ]),
                  $(i(x(f.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: P(["chip", f.verified ? "primary" : "warn"]),
                  title: f.reason
                }, [
                  r(h(L), {
                    icon: f.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  $(i(f.verified ? "Verified" : "Check"), 1)
                ], 10, $n),
                r(h(L), {
                  icon: y.value === f.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, fn),
              W(e("div", xn, [
                f.missing ? p("", !0) : (s(), o("p", wn, i(k(f.value)), 1)),
                (s(!0), o(S, null, O(f.evidence, (N, A) => (s(), o("blockquote", {
                  key: A,
                  class: P({ unfound: N.found === !1 })
                }, [
                  e("p", null, "“" + i(N.quote) + "”", 1),
                  e("cite", null, [
                    $(i(N.section), 1),
                    N.page !== void 0 && N.page !== null ? (s(), o(S, { key: 0 }, [
                      $(" · Page " + i(N.page), 1)
                    ], 64)) : p("", !0),
                    N.found === !1 ? (s(), o(S, { key: 1 }, [
                      $(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                f.evidence.length ? p("", !0) : (s(), o("p", Vn, "No evidence.")),
                f.reason ? (s(), o("p", Sn, i(f.reason), 1)) : p("", !0)
              ], 512), [
                [Se, y.value === f.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Cn, [
          F[3] || (F[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", qn, [
            (s(!0), o(S, null, O(l.result.trace, (f, N) => (s(), o("li", {
              key: N,
              class: P(f.status)
            }, [
              e("span", Un, [
                r(h(L), {
                  icon: q(f.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Mn, [
                e("div", En, [
                  e("strong", null, i(a(f.kind)), 1),
                  e("span", Nn, i(B(f.duration_ms)), 1)
                ]),
                e("span", Bn, [
                  e("span", {
                    style: pe({ width: `${Math.max(4, f.duration_ms / w.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Tn, [
                  $(i(f.scope), 1),
                  f.model ? (s(), o(S, { key: 0 }, [
                    $(" · " + i(f.model), 1)
                  ], 64)) : p("", !0),
                  $(" · " + i((f.input_tokens + f.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                f.message ? (s(), o("p", Rn, i(f.message), 1)) : p("", !0),
                f.queries?.length ? (s(), o("div", An, [
                  (s(!0), o(S, null, O(f.queries, (A) => (s(), o("span", {
                    key: A,
                    class: "chip"
                  }, i(A), 1))), 128))
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = D(!1), y = D(""), x = D(""), k = D({}), B = D("");
    de(() => n.cases, () => {
      v.value = !1, y.value = "", k.value = {};
    });
    function w(C, b) {
      return C.type === "number" ? Number(b) : C.type === "boolean" ? b === "true" : C.type === "list" || C.type === "object" ? JSON.parse(b) : b;
    }
    function t() {
      B.value = "";
      const C = {};
      try {
        for (const b of n.fields) {
          const u = String(k.value[b.name] ?? "").trim();
          u && (C[b.name] = w(b, u));
        }
      } catch {
        B.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      m("add-case", { upload_id: y.value, upload_name: x.value, expected: C });
    }
    const a = T(() => n.evaluations.find((C) => !ye(C))), q = T(() => n.evaluations.filter(ye)), V = T(() => n.evaluation), M = T(() => ({ done: (V.value?.results ?? []).filter((b) => b.status !== "queued").length, total: V.value?.case_count ?? 0 })), F = D();
    de(() => V.value?.id, () => {
      F.value = void 0;
    });
    const f = T(() => {
      if (!V.value) return;
      if (F.value) return q.value.find((b) => b.id === F.value);
      const C = q.value.findIndex((b) => b.id === V.value.id);
      return C >= 0 ? q.value[C + 1] : q.value[0];
    }), N = T(() => (V.value?.metrics ?? []).map((C) => ({ ...C, before: f.value?.metrics.find((b) => b.field === C.field) }))), A = T(() => (V.value?.fields ?? []).map((C) => C.name)), _ = (C, b) => C.scores.find((u) => u.field === b), j = D(), Y = (C) => `${Math.round(C * 100)}%`, ae = (C) => {
      const b = Math.round(C * 100);
      return `${b > 0 ? "+" : b < 0 ? "−" : "±"}${Math.abs(b)} pts`;
    }, Q = (C) => Math.round(C * 100) > 0 ? "up" : Math.round(C * 100) < 0 ? "down" : "flat", G = (C) => C >= 6e4 ? `${Math.floor(C / 6e4)}m ${Math.round(C % 6e4 / 1e3)}s` : `${(C / 1e3).toFixed(1)}s`, ne = (C) => new Date(C).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), E = (C) => C == null || C === "" ? "—" : typeof C == "string" ? C : Array.isArray(C) && C.every((b) => typeof b != "object") ? C.join(", ") : JSON.stringify(C), z = (C) => C ? C.score >= 0.999 ? "pass" : C.score > 0 ? "partial" : "fail" : "none", I = (C) => (C.results ?? []).filter((b) => b.status === "completed").length, le = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (C, b) => (s(), o("div", Ln, [
      e("section", On, [
        e("div", Fn, [
          e("div", null, [
            e("h2", zn, "Evaluate revision " + i(l.revision), 1),
            b[6] || (b[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            l.changed ? (s(), o("p", Pn, [
              r(h(L), { icon: "tabler:info-circle" }),
              b[5] || (b[5] = $("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : p("", !0)
          ]),
          r(h(ve), {
            label: a.value ? "Evaluating…" : "Run all cases",
            loading: l.starting || !!a.value,
            disabled: !l.cases.length || !l.fields.length || !!a.value || l.starting,
            onClick: b[0] || (b[0] = (u) => m("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        V.value && !h(ye)(V.value) ? (s(), o("div", Wn, [
          e("span", jn, [
            e("span", {
              style: pe({ width: Y(M.value.total ? M.value.done / M.value.total : 0) })
            }, null, 4)
          ]),
          e("span", In, i(le[V.value.status]) + " · " + i(M.value.done) + " of " + i(M.value.total) + " cases", 1)
        ])) : p("", !0)
      ]),
      V.value && h(ye)(V.value) ? (s(), o(S, { key: 0 }, [
        V.value.error ? (s(), o("p", {
          key: 0,
          class: P(V.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          r(h(L), { icon: "tabler:alert-triangle" }),
          $(i(V.value.error), 1)
        ], 2)) : p("", !0),
        e("div", Qn, [
          e("div", Kn, [
            e("span", Hn, "Accuracy · revision " + i(V.value.config_revision), 1),
            e("span", Jn, i(Y(h(re)(V.value))), 1),
            f.value ? (s(), o("span", {
              key: 0,
              class: P(["stat-delta", Q(h(re)(V.value) - h(re)(f.value))])
            }, i(ae(h(re)(V.value) - h(re)(f.value))) + " vs revision " + i(f.value.config_revision), 3)) : p("", !0)
          ]),
          e("div", Gn, [
            b[7] || (b[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", Xn, [
              $(i(I(V.value)), 1),
              e("small", null, " / " + i(V.value.case_count), 1)
            ]),
            e("span", Yn, i(V.value.case_count - I(V.value)) + " failed", 1)
          ]),
          e("div", Zn, [
            b[8] || (b[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", _n, i(V.value.tokens.toLocaleString()), 1),
            f.value ? (s(), o("span", es, i(f.value.tokens.toLocaleString()) + " before", 1)) : p("", !0)
          ]),
          e("div", ls, [
            b[9] || (b[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", ts, i(G(V.value.duration_ms)), 1),
            f.value ? (s(), o("span", as, i(G(f.value.duration_ms)) + " before", 1)) : p("", !0)
          ])
        ]),
        e("section", ns, [
          e("header", ss, [
            b[11] || (b[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            q.value.length > 1 ? (s(), o("label", os, [
              b[10] || (b[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: f.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: b[1] || (b[1] = (u) => F.value = u.target.value)
              }, [
                (s(!0), o(S, null, O(q.value.filter((u) => u.id !== V.value.id), (u) => (s(), o("option", {
                  key: u.id,
                  value: u.id
                }, "Revision " + i(u.config_revision) + " · " + i(ne(u.created_at)), 9, ds))), 128))
              ], 40, is)
            ])) : p("", !0)
          ]),
          N.value.length ? (s(), o("div", rs, [
            e("table", cs, [
              e("thead", null, [
                e("tr", null, [
                  b[12] || (b[12] = e("th", null, "Field", -1)),
                  b[13] || (b[13] = e("th", null, "Accuracy", -1)),
                  b[14] || (b[14] = e("th", null, "Verified", -1)),
                  f.value ? (s(), o("th", ms, "Revision " + i(f.value.config_revision), 1)) : p("", !0),
                  f.value ? (s(), o("th", vs, "Change")) : p("", !0)
                ])
              ]),
              e("tbody", null, [
                (s(!0), o(S, null, O(N.value, (u) => (s(), o("tr", {
                  key: u.field
                }, [
                  e("td", bs, i(u.field), 1),
                  e("td", null, [
                    e("span", ps, [
                      e("span", ys, [
                        e("span", {
                          style: pe({ width: Y(u.accuracy) })
                        }, null, 4)
                      ]),
                      $(i(Y(u.accuracy)), 1)
                    ])
                  ]),
                  e("td", fs, i(Y(u.verified)), 1),
                  f.value ? (s(), o("td", gs, i(u.before ? Y(u.before.accuracy) : "—"), 1)) : p("", !0),
                  f.value ? (s(), o("td", hs, [
                    u.before ? (s(), o("span", {
                      key: 0,
                      class: P(["trend", Q(u.accuracy - u.before.accuracy)])
                    }, [
                      r(h(L), {
                        icon: Q(u.accuracy - u.before.accuracy) === "up" ? "tabler:trending-up" : Q(u.accuracy - u.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      $(i(ae(u.accuracy - u.before.accuracy)), 1)
                    ], 2)) : (s(), o("span", ks, "New field"))
                  ])) : p("", !0)
                ]))), 128))
              ])
            ])
          ])) : (s(), o("p", us, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : p("", !0),
      V.value?.results?.length ? (s(), o("section", $s, [
        b[19] || (b[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", xs, [
          e("table", ws, [
            e("thead", null, [
              e("tr", null, [
                b[15] || (b[15] = e("th", null, "Document", -1)),
                (s(!0), o(S, null, O(A.value, (u) => (s(), o("th", {
                  key: u,
                  class: "mono"
                }, i(u), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(S, null, O(V.value.results, (u) => (s(), o(S, {
                key: u.case_id
              }, [
                e("tr", {
                  class: P(["result-row", { active: j.value === u.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": j.value === u.case_id,
                      onClick: (R) => j.value = j.value === u.case_id ? void 0 : u.case_id
                    }, [
                      r(h(L), {
                        icon: j.value === u.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      $(i(u.upload_name), 1)
                    ], 8, Vs)
                  ]),
                  u.status !== "completed" ? (s(), o("td", {
                    key: 0,
                    colspan: A.value.length,
                    class: "muted"
                  }, [
                    u.status === "queued" ? (s(), o("span", Cs, [
                      r(h(L), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      b[16] || (b[16] = $("Waiting", -1))
                    ])) : (s(), o("span", qs, [
                      r(h(L), { icon: "tabler:alert-triangle" }),
                      $(i(u.error), 1)
                    ]))
                  ], 8, Ss)) : (s(!0), o(S, { key: 1 }, O(A.value, (R) => (s(), o("td", { key: R }, [
                    e("span", {
                      class: P(["cell", z(_(u, R))]),
                      title: E(_(u, R)?.value)
                    }, i(_(u, R) ? Y(_(u, R).score) : "—"), 11, Us)
                  ]))), 128))
                ], 2),
                j.value === u.case_id ? (s(), o("tr", Ms, [
                  e("td", {
                    colspan: A.value.length + 1
                  }, [
                    u.error ? (s(), o("p", Ns, i(u.error), 1)) : (s(), o("dl", Bs, [
                      (s(!0), o(S, null, O(u.scores, (R) => (s(), o(S, {
                        key: R.field
                      }, [
                        e("dt", Ts, i(R.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: P(["cell", z(R)])
                          }, i(Y(R.score)), 3),
                          e("span", Rs, [
                            b[17] || (b[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            $(i(E(R.expected)), 1)
                          ]),
                          e("span", As, [
                            b[18] || (b[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            $(i(E(R.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: P(["chip", R.verified ? "primary" : "warn"])
                            }, [
                              r(h(L), {
                                icon: R.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              $(i(R.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", Ds, i(u.tokens.toLocaleString()) + " tokens · " + i(G(u.duration_ms)), 1)
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
          e("span", Fs, i(l.cases.length), 1),
          r(h(ve), {
            label: "Add case",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: !l.fields.length,
            onClick: b[2] || (b[2] = (u) => v.value = !v.value)
          }, null, 8, ["disabled"])
        ]),
        v.value ? (s(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: xe(t, ["prevent"])
        }, [
          e("label", null, [
            b[21] || (b[21] = $("Document", -1)),
            r(je, {
              value: y.value,
              onSelect: b[3] || (b[3] = (u, R) => {
                y.value = u, x.value = R;
              })
            }, null, 8, ["value"])
          ]),
          b[24] || (b[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", zs, [
            (s(!0), o(S, null, O(l.fields, (u) => (s(), o("label", {
              key: u.name
            }, [
              e("span", Ps, i(u.name), 1),
              u.type === "boolean" ? W((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (R) => k.value[u.name] = R
              }, [...b[22] || (b[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Ws)), [
                [fe, k.value[u.name]]
              ]) : u.type === "enum" ? W((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (R) => k.value[u.name] = R
              }, [
                b[23] || (b[23] = e("option", { value: "" }, "Not stated", -1)),
                (s(!0), o(S, null, O(u.enum_values, (R) => (s(), o("option", { key: R }, i(R), 1))), 128))
              ], 8, js)), [
                [fe, k.value[u.name]]
              ]) : u.type === "object" || u.type === "list" ? W((s(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (R) => k.value[u.name] = R,
                rows: "2",
                placeholder: u.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, Is)), [
                [Z, k.value[u.name]]
              ]) : W((s(), o("input", {
                key: 3,
                "onUpdate:modelValue": (R) => k.value[u.name] = R,
                type: u.type === "number" ? "number" : u.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, Qs)), [
                [Ye, k.value[u.name]]
              ])
            ]))), 128))
          ]),
          B.value ? (s(), o("p", Ks, i(B.value), 1)) : p("", !0),
          e("div", Hs, [
            r(h(ve), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !y.value,
              loading: l.saving
            }, null, 8, ["disabled", "loading"]),
            r(h(ve), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: b[4] || (b[4] = (u) => v.value = !1)
            })
          ])
        ], 32)) : p("", !0),
        !l.cases.length && !v.value ? (s(), o("p", Js, "No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.")) : l.cases.length ? (s(), o("div", Gs, [
          e("table", Xs, [
            e("thead", null, [
              e("tr", null, [
                b[25] || (b[25] = e("th", null, "Document", -1)),
                (s(!0), o(S, null, O(l.fields, (u) => (s(), o("th", {
                  key: u.name,
                  class: "mono"
                }, i(u.name), 1))), 128)),
                b[26] || (b[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(S, null, O(l.cases, (u) => (s(), o("tr", {
                key: u.id
              }, [
                e("td", null, [
                  r(h(L), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  $(" " + i(u.upload_name), 1)
                ]),
                (s(!0), o(S, null, O(l.fields, (R) => (s(), o("td", {
                  key: R.name,
                  class: P({ muted: !(R.name in u.expected) })
                }, i(R.name in u.expected ? E(u.expected[R.name]) : "Not stated"), 3))), 128)),
                e("td", Ys, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${u.upload_name}`,
                    disabled: l.saving,
                    onClick: (R) => m("delete-case", u.id)
                  }, [
                    r(h(L), { icon: "tabler:trash" })
                  ], 8, Zs)
                ])
              ]))), 128))
            ])
          ])
        ])) : p("", !0)
      ]),
      l.evaluations.length ? (s(), o("section", _s, [
        e("header", eo, [
          b[27] || (b[27] = e("h2", { class: "block-title" }, "History", -1)),
          e("span", lo, i(l.evaluations.length), 1)
        ]),
        e("ul", to, [
          (s(!0), o(S, null, O(l.evaluations, (u) => (s(), o("li", {
            key: u.id
          }, [
            e("button", {
              type: "button",
              class: P({ active: V.value?.id === u.id }),
              "aria-current": V.value?.id === u.id,
              onClick: (R) => m("open", u.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": u.status
              }, i(le[u.status]), 9, no),
              e("span", null, "Revision " + i(u.config_revision), 1),
              e("span", so, i(ne(u.created_at)), 1),
              e("strong", oo, i(u.status === "completed" ? Y(h(re)(u)) : "—"), 1)
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
  setup(l) {
    const c = (m) => new Date(m).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), n = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (m, v) => (s(), o(S, null, [
      e("div", uo, [
        v[0] || (v[0] = e("h2", null, "Recent runs", -1)),
        e("span", ro, "Runs expire after " + i(l.retention), 1)
      ]),
      l.runs.length ? (s(), o("div", mo, [
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
            (s(!0), o(S, null, O(l.runs, (y) => (s(), o("tr", {
              key: y.id
            }, [
              e("td", null, i(c(y.created_at)), 1),
              e("td", null, [
                e("span", bo, [
                  r(h(L), {
                    icon: n[y.caller].icon
                  }, null, 8, ["icon"]),
                  $(i(n[y.caller].label), 1)
                ])
              ]),
              e("td", null, [
                e("span", {
                  class: "badge",
                  "data-status": y.status
                }, i(y.status === "completed" ? "Completed" : "Failed"), 9, po)
              ]),
              e("td", yo, i((y.duration_ms / 1e3).toFixed(1)) + "s", 1),
              e("td", fo, i(Number(y.tokens).toLocaleString()), 1),
              e("td", go, i(c(y.expires_at)), 1)
            ]))), 128))
          ])
        ])
      ])) : (s(), o("p", co, "No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here."))
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = D(), y = D("Builder"), x = D(Le()), k = D(""), B = D(""), w = T(() => n.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    de(y, () => {
      v.value && (v.value.scrollTop = 0);
    }, { flush: "post" });
    const t = D();
    function a(f) {
      return k.value === f.title && B.value === (f.description ?? "") && dl(x.value, f.config);
    }
    de(() => n.snapshot, (f, N) => {
      w.value.includes(y.value) || (y.value = w.value[0]), !(N && f.id === N.id && f.can_edit && N.can_edit && !a(N) && !a(f)) && (x.value = structuredClone(Re(f.config ?? Le())), k.value = f.title, B.value = f.description ?? "", t.value = f.expected_revision);
    }, { immediate: !0 });
    const q = T(() => n.snapshot.can_edit && !a(n.snapshot)), V = T(() => il(x.value)), M = T(() => Object.keys(ie).filter((f) => $e(x.value, f)).length);
    function F() {
      m("save", { title: k.value, description: B.value, config: structuredClone(Re(x.value)), expected_revision: t.value });
    }
    return (f, N) => (s(), o("main", ko, [
      e("div", $o, [
        e("div", xo, [
          l.back ? (s(), o(S, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: N[0] || (N[0] = (A) => m("back"))
            }, [
              r(h(L), { icon: "tabler:arrow-left" })
            ]),
            e("span", wo, i(l.snapshot.title), 1)
          ], 64)) : p("", !0),
          e("nav", Vo, [
            (s(!0), o(S, null, O(w.value, (A) => (s(), o("button", {
              id: `tab-${A}`,
              key: A,
              role: "tab",
              "aria-selected": y.value === A,
              "aria-controls": `panel-${A}`,
              onClick: (_) => y.value = A
            }, i(A), 9, So))), 128))
          ])
        ]),
        e("div", Co, [
          e("span", qo, [
            $(i(l.snapshot.field_count) + " " + i(l.snapshot.field_count === 1 ? "field" : "fields"), 1),
            l.snapshot.can_edit ? (s(), o(S, { key: 0 }, [
              $(" · " + i(M.value) + " steps · revision " + i(l.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(S, { key: 1 }, [
              $(" · Read access")
            ], 64))
          ]),
          l.snapshot.can_edit ? (s(), o(S, { key: 0 }, [
            V.value ? (s(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: V.value
            }, [
              r(h(L), { icon: "tabler:alert-circle" }),
              $(i(V.value), 1)
            ], 8, Uo)) : q.value ? (s(), o("span", Mo, "Unsaved")) : p("", !0),
            r(h(ve), {
              label: "Save",
              size: "small",
              loading: l.saving,
              disabled: !q.value || !!V.value || !k.value.trim(),
              onClick: F
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      l.error ? (s(), o("p", Eo, i(l.error), 1)) : p("", !0),
      y.value === "Builder" && l.snapshot.can_edit ? (s(), o("div", No, [
        r(ln, {
          title: k.value,
          "onUpdate:title": N[1] || (N[1] = (A) => k.value = A),
          description: B.value,
          "onUpdate:description": N[2] || (N[2] = (A) => B.value = A),
          config: x.value,
          retention: l.snapshot.retention,
          result: l.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 2,
        ref_key: "body",
        ref: v,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${y.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${y.value}`,
          class: "panel"
        }, [
          y.value === "Test" ? (s(), ee(Dn, {
            key: 0,
            result: l.result,
            retention: l.snapshot.retention,
            running: l.running,
            "can-run": l.snapshot.field_count > 0,
            onRun: N[3] || (N[3] = (A) => m("run", A))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          y.value === "Evals" && l.snapshot.can_edit ? (s(), ee(io, {
            key: 1,
            cases: l.snapshot.cases,
            fields: l.snapshot.config.fields,
            evaluations: l.evaluations,
            evaluation: l.evaluation,
            revision: l.snapshot.expected_revision,
            changed: q.value,
            saving: l.saving,
            starting: l.starting,
            onAddCase: N[4] || (N[4] = (A) => m("add-case", A)),
            onDeleteCase: N[5] || (N[5] = (A) => m("delete-case", A)),
            onEvaluate: N[6] || (N[6] = (A) => m("evaluate")),
            onOpen: N[7] || (N[7] = (A) => m("open-evaluation", A))
          }, null, 8, ["cases", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : p("", !0),
          y.value === "Runs" ? (s(), ee(ho, {
            key: 2,
            runs: l.snapshot.runs,
            retention: l.snapshot.retention
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
  setup(l, { emit: c }) {
    const n = l, m = c, v = D(), y = D(""), x = D(!1), k = D(!1), B = D(!1), w = D(null), t = D([]), a = D();
    let q, V;
    const M = (E) => E instanceof Error ? E.message : String(E), F = (E) => E === n.id;
    async function f(E, z) {
      const I = await se.evaluation(E, z);
      F(E) && (a.value = I, clearTimeout(V), ye(I) || (V = setTimeout(() => N(E, z), Do)));
    }
    async function N(E, z) {
      try {
        const I = await se.evaluations(E);
        if (!F(E)) return;
        t.value = I;
        const le = z ?? a.value?.id ?? I[0]?.id;
        le && await f(E, le);
      } catch (I) {
        F(E) && (y.value = M(I));
      }
    }
    async function A() {
      const E = n.id;
      if (!E) {
        y.value = "No extractor selected.";
        return;
      }
      try {
        const z = await se.get(E);
        if (!F(E)) return;
        v.value = z, y.value = "", z.can_edit && await N(E);
      } catch (z) {
        F(E) && (y.value = M(z));
      }
    }
    de(() => n.id, () => {
      clearTimeout(V), q?.(), v.value = void 0, w.value = null, t.value = [], a.value = void 0, y.value = "", A(), n.id && (q = Ze(`component.${n.id}`, () => A()));
    }, { immediate: !0 }), Oe(() => {
      q?.(), clearTimeout(V);
    });
    async function _(E) {
      const z = n.id;
      x.value = !0, y.value = "";
      try {
        await E(), F(z) && await A();
      } catch (I) {
        F(z) && (y.value = M(I));
      } finally {
        x.value = !1;
      }
    }
    const j = (E) => _(() => se.update(n.id, E)), Y = (E) => _(() => se.addCase(n.id, E)), ae = (E) => _(() => se.deleteCase(n.id, E));
    async function Q(E) {
      const z = n.id;
      k.value = !0, y.value = "";
      try {
        const I = await se.run(z, E);
        F(z) && (w.value = I, await A());
      } catch (I) {
        F(z) && (y.value = M(I));
      } finally {
        k.value = !1;
      }
    }
    async function G() {
      const E = n.id;
      B.value = !0, y.value = "";
      try {
        const { eval_id: z } = await se.evaluate(E);
        F(E) && await N(E, z);
      } catch (z) {
        F(E) && (y.value = M(z));
      } finally {
        B.value = !1;
      }
    }
    function ne(E) {
      N(n.id, E);
    }
    return (E, z) => v.value ? (s(), ee(To, {
      key: 0,
      snapshot: v.value,
      saving: x.value,
      running: k.value,
      starting: B.value,
      result: w.value,
      evaluations: t.value,
      evaluation: a.value,
      error: y.value,
      back: l.back,
      onBack: z[0] || (z[0] = (I) => m("back")),
      onRun: Q,
      onSave: j,
      onAddCase: Y,
      onDeleteCase: ae,
      onEvaluate: G,
      onOpenEvaluation: ne
    }, null, 8, ["snapshot", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : y.value ? (s(), o("p", Ro, i(y.value), 1)) : (s(), o("p", Ao, "Loading Docscout…"));
  }
});
export {
  Po as _
};
