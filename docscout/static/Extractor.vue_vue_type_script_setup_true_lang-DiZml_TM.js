import { defineComponent as Q, useModel as fe, openBlock as n, createElementBlock as o, withModifiers as ke, createElementVNode as e, mergeModels as $e, computed as T, withKeys as Re, unref as h, normalizeClass as W, createVNode as r, toDisplayString as i, Fragment as S, renderList as F, createCommentVNode as p, createTextVNode as $, createBlock as Z, ref as D, watch as de, withDirectives as j, vModelText as Y, vModelSelect as ye, onMounted as xe, normalizeStyle as be, onBeforeUnmount as Fe, nextTick as Xe, vShow as Se, vModelDynamic as Ye, toRaw as Ae, withCtx as Ze } from "vue";
import { loadByTagName as qe, on as _e } from "@wippy-fe/proxy";
import { i as he, h as ze, t as Ce, g as ie, j as Ue, k as el, m as Pe, l as Ie, o as De, p as ll, q as tl, r as al, v as nl, w as Le, x as sl, y as we, z as ol, A as il, s as oe, n as Oe, C as dl, D as ul, c as ae } from "./index-BBnkhKOj.js";
import { Icon as O } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const pe = (t) => t.status === "completed" || t.status === "failed", re = (t) => t.metrics.length ? t.metrics.reduce((c, s) => c + s.accuracy, 0) / t.metrics.length : 0, rl = ["aria-checked", "aria-label", "disabled"], K = /* @__PURE__ */ Q({
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
      onClick: m[0] || (m[0] = ke((v) => c.value = !c.value, ["stop"]))
    }, [...m[1] || (m[1] = [
      e("span", null, null, -1)
    ])], 8, rl));
  }
}), cl = ["aria-label"], ml = { class: "node-icon" }, vl = { class: "node-main" }, bl = { class: "node-title" }, pl = { class: "node-summary" }, yl = {
  key: 0,
  class: "chips"
}, fl = {
  key: 1,
  class: "trace-line"
}, gl = { class: "node-side" }, hl = {
  key: 0,
  class: "chip model"
}, ce = /* @__PURE__ */ Q({
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
    const s = t, m = c, v = T(() => he(s.config, s.stage)), f = T(() => s.config.stages[s.stage].model), y = T({ get: () => v.value, set: (w) => {
      s.config.stages[s.stage].enabled = w;
    } }), k = T(() => {
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
    }), N = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, l) => (n(), o("div", {
      class: W(["node", { active: t.active, off: !v.value, fixed: t.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(ie)[t.stage],
      onClick: l[1] || (l[1] = (a) => m("select")),
      onKeydown: [
        l[2] || (l[2] = Re((a) => m("select"), ["enter"])),
        l[3] || (l[3] = Re(ke((a) => m("select"), ["prevent"]), ["space"]))
      ]
    }, [
      e("span", ml, [
        r(h(O), {
          icon: h(Ue)[t.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", vl, [
        e("span", bl, i(h(ie)[t.stage]), 1),
        e("span", pl, i(v.value ? h(el)(t.stage, t.config) : "Off"), 1),
        v.value && k.value.length ? (n(), o("span", yl, [
          (n(!0), o(S, null, F(k.value, (a) => (n(), o("span", {
            key: a.text,
            class: W(["chip", { primary: a.tone === "primary", "muted-chip": a.tone === "hint" }])
          }, i(a.text), 3))), 128))
        ])) : p("", !0),
        t.trace ? (n(), o("span", fl, [
          r(h(O), {
            icon: t.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          $(i(N(t.trace)), 1)
        ])) : p("", !0)
      ]),
      e("span", gl, [
        v.value && f.value ? (n(), o("span", hl, i(h(Pe)(f.value)), 1)) : p("", !0),
        t.stage !== "extract" && !t.readonly ? (n(), Z(K, {
          key: 1,
          modelValue: y.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => y.value = a),
          label: `Enable ${h(ie)[t.stage]}`
        }, null, 8, ["modelValue", "label"])) : p("", !0)
      ])
    ], 42, cl));
  }
}), kl = ["aria-labelledby"], $l = ["aria-checked", "tabindex", "disabled", "onClick", "onKeydown"], ve = /* @__PURE__ */ Q({
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
    const c = t, s = fe(t, "modelValue"), m = D([]);
    function v(f, y) {
      const k = c.options.length - 1, N = { ArrowRight: y + 1, ArrowDown: y + 1, ArrowLeft: y - 1, ArrowUp: y - 1, Home: 0, End: k }[f.key];
      if (N === void 0) return;
      f.preventDefault();
      const w = (N + c.options.length) % c.options.length;
      s.value = c.options[w].value, m.value[w]?.focus();
    }
    return (f, y) => (n(), o("div", {
      class: "segmented",
      role: "radiogroup",
      "aria-labelledby": t.labelledBy
    }, [
      (n(!0), o(S, null, F(t.options, (k, N) => (n(), o("button", {
        key: k.value,
        ref_for: !0,
        ref_key: "buttons",
        ref: m,
        type: "button",
        role: "radio",
        "aria-checked": s.value === k.value,
        tabindex: s.value === k.value ? 0 : -1,
        disabled: t.disabled,
        onClick: (w) => s.value = k.value,
        onKeydown: (w) => v(w, N)
      }, i(k.label), 41, $l))), 128))
    ], 8, kl));
  }
}), xl = ["disabled"], wl = { class: "grid" }, Vl = ["aria-invalid"], Sl = ["value"], Cl = {
  key: 0,
  class: "field-error",
  role: "alert"
}, ql = { key: 1 }, Ul = ["value"], El = { key: 2 }, Ml = ["value"], Nl = { class: "grid" }, Bl = {
  key: 3,
  class: "field-note"
}, Tl = { class: "label-block" }, Rl = {
  key: 4,
  class: "field-error"
}, Al = { id: "docscout-groups" }, Dl = ["value"], Ll = { key: 5 }, Ol = ["placeholder"], Fl = { class: "toggle-row" }, zl = { class: "toggle-row" }, Pl = /* @__PURE__ */ Q({
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
    const s = t, m = c, v = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], f = v.filter((w) => ["text", "number", "boolean", "date", "object"].includes(w.value)), y = T(() => Ie(s.field, s.otherNames)), k = T(() => s.field.type !== "boolean" && s.field.type !== "enum" && !(s.field.type === "list" && s.field.item_type === "boolean"));
    de(() => [s.field.type, s.field.item_type], () => {
      !De(s.field) && s.field.enum_values.length && (s.field.enum_values = []);
    });
    function N(w) {
      s.field.enum_values = [...new Set(w.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (w, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("div", wl, [
        e("label", null, [
          l[14] || (l[14] = $("Name", -1)),
          j(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (a) => t.field.name = a),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!y.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, Vl), [
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
            (n(), o(S, null, F(v, (a) => e("option", {
              key: a.value,
              value: a.value
            }, i(a.label), 9, Sl)), 64))
          ], 512), [
            [ye, t.field.type]
          ])
        ])
      ]),
      y.value ? (n(), o("p", Cl, [
        r(h(O), { icon: "tabler:alert-circle" }),
        $(i(y.value), 1)
      ])) : p("", !0),
      t.field.type === "list" ? (n(), o("label", ql, [
        l[16] || (l[16] = $("Each item is", -1)),
        j(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (a) => t.field.item_type = a)
        }, [
          (n(!0), o(S, null, F(h(f), (a) => (n(), o("option", {
            key: a.value,
            value: a.value
          }, i(a.label), 9, Ul))), 128))
        ], 512), [
          [ye, t.field.item_type]
        ])
      ])) : p("", !0),
      h(De)(t.field) ? (n(), o("label", El, [
        $(i(t.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: t.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: N
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
      e("div", Nl, [
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
      t.field.strategy === "deep" && !t.deepEnabled ? (n(), o("p", Bl, [
        r(h(O), { icon: "tabler:info-circle" }),
        l[25] || (l[25] = $("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : p("", !0),
      e("div", Tl, [
        l[26] || (l[26] = e("span", { id: "within-label" }, "Search within", -1)),
        r(ve, {
          modelValue: t.field.search_within,
          "onUpdate:modelValue": l[7] || (l[7] = (a) => t.field.search_within = a),
          "labelled-by": "within-label",
          options: [{ value: "document", label: "Whole document" }, { value: "sections", label: "Map's sections" }]
        }, null, 8, ["modelValue"]),
        e("small", null, i(t.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      t.field.search_within === "sections" && !t.mapEnabled ? (n(), o("p", Rl, [
        r(h(O), { icon: "tabler:alert-circle" }),
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
        e("datalist", Al, [
          (n(!0), o(S, null, F(t.groups, (a) => (n(), o("option", {
            key: a,
            value: a
          }, null, 8, Dl))), 128))
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
      k.value ? (n(), o("label", Ll, [
        l[31] || (l[31] = $("Expected format", -1)),
        j(e("input", {
          "onUpdate:modelValue": l[10] || (l[10] = (a) => t.field.expected_format = a),
          placeholder: h(ll)(t.field)
        }, null, 8, Ol), [
          [Y, t.field.expected_format]
        ])
      ])) : p("", !0),
      e("div", Fl, [
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
      e("div", zl, [
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
    ], 8, xl));
  }
}), Il = ["value", "capability", "aria-labelledby"], Wl = {
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
    const s = c, m = D(!!customElements.get("wc-model-picker")), v = D("");
    xe(async () => {
      if (!m.value)
        try {
          await qe("wc-model-picker", { timeoutMs: 8e3 }), m.value = !0;
        } catch (y) {
          v.value = y instanceof Error ? y.message : String(y);
        }
    });
    function f(y) {
      const k = y.detail;
      typeof k == "string" && s("select", k);
    }
    return (y, k) => m.value ? (n(), o("wc-model-picker", {
      key: 0,
      value: t.value,
      capability: t.capability,
      "aria-labelledby": t.labelledBy,
      onSelect: f
    }, null, 40, Il)) : v.value ? (n(), o("p", Wl, "Could not load model picker: " + i(v.value), 1)) : (n(), o("span", jl, "Loading models…"));
  }
}), Ql = { class: "slider" }, Kl = { class: "slider-head" }, Hl = { class: "slider-value" }, Jl = ["aria-label", "aria-valuetext", "disabled"], Gl = {
  key: 0,
  class: "slider-hints"
}, Xl = { key: 1 }, me = 1e3, G = /* @__PURE__ */ Q({
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
    const c = t, s = fe(t, "modelValue"), m = T(() => c.percent ? `${Math.round(s.value * 100)}%` : `${s.value.toLocaleString()}${c.unit ? ` ${c.unit}` : ""}`), v = (k) => c.log ? Math.log(k / c.min) / Math.log(c.max / c.min) * me : (k - c.min) / (c.max - c.min) * me;
    function f(k) {
      const N = c.log ? c.min * Math.pow(c.max / c.min, k / me) : c.min + (c.max - c.min) * k / me, w = Math.round(N / c.step) * c.step;
      return Math.min(c.max, Math.max(c.min, Number(w.toFixed(4))));
    }
    const y = T({ get: () => Math.round(v(s.value)), set: (k) => {
      s.value = f(k);
    } });
    return (k, N) => (n(), o("div", Ql, [
      e("div", Kl, [
        e("span", null, i(t.label), 1),
        e("output", Hl, i(m.value), 1)
      ]),
      j(e("input", {
        "onUpdate:modelValue": N[0] || (N[0] = (w) => y.value = w),
        type: "range",
        min: "0",
        max: me,
        step: "1",
        "aria-label": t.label,
        "aria-valuetext": m.value,
        disabled: t.disabled,
        style: be({ "--fill": `${y.value / me * 100}%` })
      }, null, 12, Jl), [
        [
          Y,
          y.value,
          void 0,
          { number: !0 }
        ]
      ]),
      t.hints ? (n(), o("div", Gl, [
        e("span", null, i(t.hints[0]), 1),
        e("span", null, i(t.hints[1]), 1)
      ])) : p("", !0),
      t.note ? (n(), o("small", Xl, i(t.note), 1)) : p("", !0)
    ]));
  }
}), Yl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Zl = { class: "fd-track" }, _l = { class: "fd-node" }, et = { class: "fd-dots" }, lt = { class: "fd-more" }, tt = { class: "fd-node goal" }, at = /* @__PURE__ */ Q({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(t) {
    const c = t;
    return (s, m) => (n(), o("figure", Yl, [
      e("div", Zl, [
        m[2] || (m[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (n(!0), o(S, null, F(Math.min(c.rounds, 8), (v) => (n(), o(S, { key: v }, [
          m[0] || (m[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", _l, [
            e("span", null, "R" + i(v), 1),
            e("span", et, [
              (n(!0), o(S, null, F(Math.min(c.extra, 6), (f) => (n(), o("i", { key: f }))), 128))
            ])
          ])
        ], 64))), 128)),
        c.rounds > 8 ? (n(), o(S, { key: 0 }, [
          m[1] || (m[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", lt, "+" + i(c.rounds - 8), 1)
        ], 64)) : p("", !0),
        m[3] || (m[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", tt, "≥ " + i(Math.round(c.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, i(c.rounds ? `One pass, then up to ${c.rounds} rounds with up to ${c.extra} new queries each, stopping as soon as confidence reaches ${Math.round(c.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), nt = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, st = { class: "fd-grid" }, ot = { class: "fd-node solid" }, it = { class: "fd-node" }, dt = { class: "fd-node" }, ut = { class: "fd-node goal" }, rt = /* @__PURE__ */ Q({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(t) {
    const c = t, s = T(() => Math.min(c.queries * c.perQuery, c.cap));
    return (m, v) => (n(), o("figure", nt, [
      e("div", st, [
        e("span", ot, [
          e("b", null, i(t.fields), 1),
          $(" field" + i(t.fields === 1 ? "" : "s"), 1),
          e("small", null, i(t.parallel) + " at a time", 1)
        ]),
        e("span", it, [
          e("b", null, i(t.queries), 1),
          v[0] || (v[0] = $(" queries", -1)),
          v[1] || (v[1] = e("small", null, "per field", -1))
        ]),
        e("span", dt, [
          e("b", null, i(t.perQuery), 1),
          v[2] || (v[2] = $(" chunks", -1)),
          v[3] || (v[3] = e("small", null, "per query", -1))
        ]),
        e("span", ut, [
          e("b", null, i(s.value), 1),
          v[4] || (v[4] = $(" chunks", -1)),
          e("small", null, i(t.queries * t.perQuery > t.cap ? `capped at ${t.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(s.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), ct = ["disabled"], mt = { class: "muted" }, vt = { class: "toggle-row" }, bt = { class: "label-block" }, pt = { class: "toggle-row" }, yt = {
  id: "model-map",
  class: "model-role"
}, ft = {
  key: 0,
  class: "chips"
}, gt = {
  key: 1,
  class: "muted"
}, ht = { class: "toggle-row" }, kt = { class: "grid" }, $t = ["onUpdate:modelValue"], xt = ["onUpdate:modelValue"], wt = ["onUpdate:modelValue"], Vt = ["onClick"], St = {
  key: 0,
  class: "muted"
}, Ct = { class: "toggle-row" }, qt = { class: "label-block" }, Ut = {
  id: "model-scout",
  class: "model-role"
}, Et = {
  key: 2,
  class: "muted"
}, Mt = {
  key: 3,
  class: "toggle-row"
}, Nt = { class: "toggle-row" }, Bt = { class: "toggle-row" }, Tt = { class: "label-block" }, Rt = {
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
}, zt = { class: "toggle-row" }, Pt = { class: "toggle-row" }, It = { class: "toggle-row" }, Wt = { class: "toggle-row" }, jt = {
  id: "model-verify",
  class: "model-role"
}, Qt = /* @__PURE__ */ Q({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = T(() => c.config.stages), m = (w) => sl(c.stage, w), v = tl(), f = T(() => c.config.fields.filter((w) => w.strategy === "deep").length), y = T(() => c.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), k = T(() => ze(c.config));
    function N(w, l) {
      const a = s.value.scout.tools.filter((q) => q !== w);
      s.value.scout.tools = l ? [...a, w] : a;
    }
    return (w, l) => (n(), o("fieldset", {
      class: "inspector-form",
      disabled: t.readonly
    }, [
      e("p", mt, i(h(al)[t.stage]), 1),
      t.stage === "map" ? (n(), o(S, { key: 0 }, [
        e("div", vt, [
          l[34] || (l[34] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.map.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", bt, [
          l[35] || (l[35] = e("span", { id: "outline-label" }, "Outline", -1)),
          r(ve, {
            modelValue: s.value.map.outline,
            "onUpdate:modelValue": l[1] || (l[1] = (a) => s.value.map.outline = a),
            "labelled-by": "outline-label",
            options: [{ value: "find_or_build", label: "Use contents first" }, { value: "build", label: "Always build" }]
          }, null, 8, ["modelValue"]),
          l[36] || (l[36] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", pt, [
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
        e("div", yt, [
          l[38] || (l[38] = e("span", null, "Outliner", -1)),
          r(le, {
            value: s.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[3] || (l[3] = (a) => s.value.map.model = a)
          }, null, 8, ["value"])
        ]),
        l[40] || (l[40] = e("h4", null, "Fields that read sections", -1)),
        y.value.length ? (n(), o("p", ft, [
          (n(!0), o(S, null, F(y.value, (a) => (n(), o("span", {
            key: a,
            class: "chip primary"
          }, i(a), 1))), 128))
        ])) : (n(), o("p", gt, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : p("", !0),
      t.stage === "prefetch" ? (n(), o(S, { key: 1 }, [
        e("div", ht, [
          l[41] || (l[41] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.prefetch.enabled,
            "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.prefetch.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[45] || (l[45] = e("h4", null, "Queries", -1)),
        (n(!0), o(S, null, F(s.value.prefetch.queries, (a, q) => (n(), o("div", {
          key: q,
          class: "query-row"
        }, [
          e("div", kt, [
            e("label", null, [
              l[42] || (l[42] = $("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": (z) => a.name = z,
                placeholder: "Parties"
              }, null, 8, $t), [
                [Y, a.name]
              ])
            ]),
            e("label", null, [
              l[43] || (l[43] = $("Chunks", -1)),
              j(e("input", {
                "onUpdate:modelValue": (z) => a.chunks = z,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, xt), [
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
              "onUpdate:modelValue": (z) => a.query = z,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, wt), [
              [Y, a.query]
            ])
          ]),
          t.readonly ? p("", !0) : (n(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (z) => s.value.prefetch.queries.splice(q, 1)
          }, "Remove query", 8, Vt))
        ]))), 128)),
        s.value.prefetch.queries.length ? p("", !0) : (n(), o("p", St, "No fixed queries. Field search hints still run.")),
        t.readonly ? p("", !0) : (n(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[5] || (l[5] = (a) => s.value.prefetch.queries.push(h(nl)()))
        }, "Add query"))
      ], 64)) : p("", !0),
      t.stage === "scout" ? (n(), o(S, { key: 2 }, [
        e("div", Ct, [
          l[46] || (l[46] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.scout.enabled,
            "onUpdate:modelValue": l[6] || (l[6] = (a) => s.value.scout.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", qt, [
          l[47] || (l[47] = e("span", { id: "mode-label" }, "Mode", -1)),
          r(ve, {
            modelValue: s.value.scout.mode,
            "onUpdate:modelValue": l[7] || (l[7] = (a) => s.value.scout.mode = a),
            "labelled-by": "mode-label",
            options: [{ value: "loop", label: "Structured loop" }, { value: "agent", label: "Agent" }]
          }, null, 8, ["modelValue"]),
          e("small", null, i(s.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        s.value.scout.mode === "loop" ? (n(), Z(at, {
          key: 0,
          rounds: s.value.scout.max_rounds,
          confidence: s.value.scout.target_confidence,
          extra: s.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"])) : p("", !0),
        l[52] || (l[52] = e("h4", null, "Models", -1)),
        e("div", Ut, [
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
        s.value.scout.mode === "agent" ? (n(), o("p", Et, "Tool budget: " + i(s.value.scout.max_rounds * s.value.scout.max_extra_queries) + " calls.", 1)) : p("", !0),
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
        e("div", Nt, [
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
        s.value.scout.mode === "agent" ? (n(), o(S, { key: 4 }, [
          l[51] || (l[51] = e("h4", null, "Agent tools", -1)),
          (n(!0), o(S, null, F(h(v), (a) => (n(), o("div", {
            key: a,
            class: "toggle-row"
          }, [
            e("span", null, i(h(Ce)(a)), 1),
            r(K, {
              "model-value": s.value.scout.tools.includes(a),
              label: h(Ce)(a),
              disabled: t.readonly,
              "onUpdate:modelValue": (q) => N(a, q)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : p("", !0)
      ], 64)) : p("", !0),
      t.stage === "deep" ? (n(), o(S, { key: 3 }, [
        e("div", Bt, [
          l[54] || (l[54] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.deep.enabled,
            "onUpdate:modelValue": l[15] || (l[15] = (a) => s.value.deep.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r(rt, {
          fields: f.value,
          parallel: s.value.deep.parallel_fields,
          queries: s.value.deep.max_queries,
          "per-query": s.value.deep.chunks_per_query,
          cap: s.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", Tt, [
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
        e("div", Rt, [
          l[57] || (l[57] = e("span", null, "Analysis", -1)),
          r(le, {
            value: s.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[17] || (l[17] = (a) => s.value.deep.model = a)
          }, null, 8, ["value"])
        ]),
        e("div", At, [
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
        e("div", Dt, [
          l[62] || (l[62] = e("span", null, "Extraction", -1)),
          r(le, {
            value: s.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[26] || (l[26] = (a) => s.value.extract.model = a)
          }, null, 8, ["value"])
        ]),
        l[65] || (l[65] = e("h4", null, "Field groups", -1)),
        e("ul", Lt, [
          (n(!0), o(S, null, F(k.value, (a) => (n(), o("li", {
            key: a.name
          }, [
            e("span", null, i(a.name), 1),
            e("span", Ot, i(a.fields.length) + " field" + i(a.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        k.value.length ? p("", !0) : (n(), o("p", Ft, "No fields yet.")),
        r(G, {
          modelValue: s.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[27] || (l[27] = (a) => s.value.extract.max_fields_per_call = a),
          label: "Fields per call",
          min: m("max_fields_per_call").min,
          max: m("max_fields_per_call").max,
          disabled: t.readonly,
          note: `${h(Le)(t.config)} extraction call${h(Le)(t.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
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
      t.stage === "verify" ? (n(), o(S, { key: 5 }, [
        e("div", Pt, [
          l[66] || (l[66] = e("span", null, "Stage enabled", -1)),
          r(K, {
            modelValue: s.value.verify.enabled,
            "onUpdate:modelValue": l[30] || (l[30] = (a) => s.value.verify.enabled = a),
            label: "Enable step",
            disabled: t.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", It, [
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
        e("div", Wt, [
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
    ], 8, ct));
  }
}), Kt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, Ht = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, Jt = ["x", "y", "width"], Gt = ["x", "width"], Xt = /* @__PURE__ */ Q({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(t) {
    const c = t, s = T(() => Math.min(0.9, Math.max(0, c.overlap / c.size))), m = T(() => {
      const v = 100 / (3 - 2 * s.value);
      return [0, 1, 2].map((f) => ({ x: f * v * (1 - s.value), w: v }));
    });
    return (v, f) => (n(), o("figure", Kt, [
      (n(), o("svg", Ht, [
        (n(!0), o(S, null, F(m.value, (y, k) => (n(), o("rect", {
          key: k,
          x: y.x,
          y: k % 2 ? 14 : 4,
          width: y.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, Jt))), 128)),
        (n(), o(S, null, F([1, 2], (y) => e("rect", {
          key: "o" + y,
          x: m.value[y].x,
          y: 4,
          width: m.value[y - 1].x + m.value[y - 1].w - m.value[y].x,
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
}, ia = /* @__PURE__ */ Q({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(t) {
    const c = t, s = T(() => c.config.retrieval), m = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], v = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document." }], f = we("chunk_size"), y = we("overlap"), k = we("section_budget"), N = T(() => Math.min(y.max, s.value.chunk_size - 50));
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
      r(G, {
        modelValue: s.value.chunk_size,
        "onUpdate:modelValue": l[0] || (l[0] = (a) => s.value.chunk_size = a),
        label: "Chunk size",
        min: h(f).min,
        max: h(f).max,
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
        min: h(y).min,
        max: N.value,
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
      r(G, {
        modelValue: s.value.section_budget,
        "onUpdate:modelValue": l[4] || (l[4] = (a) => s.value.section_budget = a),
        label: "Section budget",
        min: h(k).min,
        max: h(k).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: t.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      l[20] || (l[20] = e("h4", null, "Context", -1)),
      e("div", la, [
        l[13] || (l[13] = e("span", { id: "context-label" }, "Chunk context", -1)),
        r(ve, {
          modelValue: s.value.context,
          "onUpdate:modelValue": l[5] || (l[5] = (a) => s.value.context = a),
          "labelled-by": "context-label",
          options: v
        }, null, 8, ["modelValue"]),
        e("small", null, i(v.find((a) => a.value === s.value.context)?.note), 1)
      ]),
      s.value.context === "generated" ? (n(), o("div", ta, [
        l[14] || (l[14] = e("span", null, "Context writer", -1)),
        r(le, {
          value: s.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: l[6] || (l[6] = (a) => s.value.context_model = a)
        }, null, 8, ["value"])
      ])) : p("", !0),
      l[21] || (l[21] = e("h4", null, "Search", -1)),
      e("div", aa, [
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
      e("div", na, [
        l[16] || (l[16] = e("span", null, "Embedding", -1)),
        r(le, {
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
        r(le, {
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
}, qa = ["disabled", "onClick"], Ua = ["disabled", "onClick"], Ea = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Ma = { class: "block-head" }, Na = ["aria-expanded"], Ba = { class: "count" }, Ta = {
  key: 0,
  class: "block-peek"
}, Ra = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Aa = { class: "node-icon" }, Da = { class: "node-main" }, La = { class: "node-summary" }, Oa = { class: "node-side" }, Fa = { class: "chip model" }, za = { class: "branches" }, Pa = { class: "branch" }, Ia = { class: "branch" }, Wa = { class: "node-icon" }, ja = { class: "node-main" }, Qa = { class: "node-summary" }, Ka = ["aria-valuenow"], Ha = { class: "side-panel-head" }, Ja = { class: "side-panel-icon" }, Ga = ["disabled"], Xa = {
  key: 4,
  class: "inspector-form"
}, Ya = { class: "output-list" }, Za = { class: "mono" }, _a = { class: "chip" }, en = { class: "rail-label" }, Ve = 400, ge = 320, ln = /* @__PURE__ */ Q({
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
    const c = t, s = fe(t, "title"), m = fe(t, "description"), v = D({ kind: "document" });
    function f(g, d) {
      try {
        const U = localStorage.getItem(`docscout.${g}`);
        return U === null ? d : U === "1";
      } catch {
        return d;
      }
    }
    function y(g, d) {
      try {
        localStorage.setItem(`docscout.${g}`, d ? "1" : "0");
      } catch {
      }
    }
    const k = D(f("panel", !0)), N = D(f("fields", !0)), w = D(f("flow", !0));
    function l() {
      try {
        const g = Number(localStorage.getItem("docscout.panelWidth"));
        return g >= ge ? g : Ve;
      } catch {
        return Ve;
      }
    }
    const a = D(l()), q = () => {
      const g = R.value?.clientWidth;
      return g ? Math.max(ge, g - 420) : Number.POSITIVE_INFINITY;
    };
    function z(g, d = !0) {
      if (a.value = Math.round(Math.min(q(), Math.max(ge, g))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(a.value));
        } catch {
        }
    }
    const C = D(!1);
    function L(g) {
      const d = g.currentTarget, U = g.clientX, J = a.value;
      d.setPointerCapture(g.pointerId), C.value = !0;
      const se = (Ge) => z(J + (U - Ge.clientX), !1), Te = () => {
        C.value = !1, z(a.value), d.removeEventListener("pointermove", se), d.removeEventListener("pointerup", Te);
      };
      d.addEventListener("pointermove", se), d.addEventListener("pointerup", Te);
    }
    function V(g) {
      g.key === "ArrowLeft" ? (z(a.value + 24), g.preventDefault()) : g.key === "ArrowRight" && (z(a.value - 24), g.preventDefault());
    }
    function E(g) {
      k.value = g, I.value || y("panel", g);
    }
    function M(g) {
      const d = g === "fields" ? N : w;
      d.value = !d.value, y(g, d.value);
    }
    const R = D(), I = D(!1);
    let te;
    xe(() => {
      te = new ResizeObserver(([g]) => {
        const d = I.value;
        I.value = g.contentRect.width < 1e3, I.value && !d && (k.value = !1), !I.value && d && (k.value = f("panel", !0));
      }), R.value && te.observe(R.value);
    }), Fe(() => te?.disconnect());
    const _ = D();
    de(v, async () => {
      await Xe(), _.value && (_.value.scrollTop = 0);
    });
    function H(g) {
      v.value = g, k.value = !0;
    }
    const X = (g) => JSON.stringify(g) === JSON.stringify(v.value), ee = T(() => v.value.kind === "field" ? c.config.fields[v.value.index] : void 0), ne = T(() => {
      const g = v.value;
      return g.kind === "stage" ? ie[g.stage] : g.kind === "field" ? ee.value?.name || "New field" : g.kind === "document" ? "Read document" : g.kind === "output" ? "Output" : "Details";
    }), A = T(() => {
      const g = v.value;
      return g.kind === "stage" ? Ue[g.stage] : g.kind === "field" ? "tabler:forms" : g.kind === "document" ? "tabler:file-text" : g.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), P = T(() => c.config.fields.filter((g, d) => !(v.value.kind === "field" && v.value.index === d)).map((g) => g.name)), x = T(() => c.config.stages.deep.enabled), b = T(() => c.config.stages.map.enabled), u = T(() => [...new Set(c.config.fields.map((g) => g.group.trim()).filter(Boolean))]), B = (g) => Ie(c.config.fields[g], c.config.fields.filter((d, U) => U !== g).map((d) => d.name)), Ee = ["map", "prefetch", "scout", "deep", "extract", "verify"], je = T(() => Ee.filter((g) => he(c.config, g)).map((g) => ie[g]).join(" · ")), Qe = T(() => c.config.fields.map((g) => g.name || "New field").join(", ")), Ke = T(() => Ee.filter((g) => he(c.config, g)).length), ue = (g) => c.result?.trace.find((d) => d.kind === g);
    function He() {
      c.config.fields.push(il()), N.value = !0, H({ kind: "field", index: c.config.fields.length - 1 });
    }
    function Je(g) {
      c.config.fields.splice(g, 1), v.value = { kind: "document" };
    }
    function Me(g, d) {
      const U = c.config.fields, J = g + d;
      if (J < 0 || J >= U.length) return;
      const [se] = U.splice(g, 1);
      U.splice(J, 0, se), v.value = { kind: "field", index: J };
    }
    const Ne = (g) => g.type === "list" ? `list of ${g.item_type}` : g.type, Be = T({ get: () => c.config.tags.join(", "), set: (g) => {
      c.config.tags = [...new Set(g.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (g, d) => (n(), o("div", {
      ref_key: "root",
      ref: R,
      class: W(["builder", { narrow: I.value, "panel-open": k.value, resizing: C.value }])
    }, [
      e("div", da, [
        e("div", ua, [
          e("section", ra, [
            e("header", ca, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": N.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (U) => M("fields"))
              }, [
                r(h(O), {
                  icon: N.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", va, i(t.config.fields.length), 1)
              ], 8, ma),
              !N.value && t.config.fields.length ? (n(), o("span", ba, i(Qe.value), 1)) : p("", !0),
              t.readonly ? p("", !0) : (n(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: He
              }, [
                r(h(O), { icon: "tabler:plus" }),
                d[20] || (d[20] = $("Add field", -1))
              ]))
            ]),
            j(e("div", pa, [
              t.config.fields.length ? (n(), o("ul", fa, [
                (n(!0), o(S, null, F(t.config.fields, (U, J) => (n(), o("li", {
                  key: J,
                  class: W(["row-item", { active: X({ kind: "field", index: J }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (se) => H({ kind: "field", index: J })
                  }, [
                    e("span", ha, [
                      $(i(U.name || "New field"), 1),
                      U.required ? (n(), o("span", ka, "*")) : p("", !0),
                      B(J) ? (n(), Z(h(O), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: B(J)
                      }, null, 8, ["title"])) : p("", !0)
                    ]),
                    e("span", {
                      class: W(["row-desc", { missing: !U.description }])
                    }, i(U.description || "No description"), 3),
                    e("span", $a, [
                      U.search_within === "sections" ? (n(), o("span", {
                        key: 0,
                        class: W(["chip", b.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : p("", !0),
                      U.group.trim() ? (n(), o("span", xa, i(U.group), 1)) : p("", !0),
                      U.strategy === "deep" ? (n(), o("span", {
                        key: 2,
                        class: W(["chip", x.value ? "primary" : "muted-chip"]),
                        title: x.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, wa)) : p("", !0),
                      e("span", Va, i(Ne(U)), 1),
                      U.evidence_required ? (n(), o("span", Sa, [
                        r(h(O), { icon: "tabler:quote" })
                      ])) : p("", !0)
                    ])
                  ], 8, ga),
                  t.readonly ? p("", !0) : (n(), o("span", Ca, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: J === 0,
                      onClick: (se) => Me(J, -1)
                    }, [
                      r(h(O), { icon: "tabler:chevron-up" })
                    ], 8, qa),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: J === t.config.fields.length - 1,
                      onClick: (se) => Me(J, 1)
                    }, [
                      r(h(O), { icon: "tabler:chevron-down" })
                    ], 8, Ua)
                  ]))
                ], 2))), 128))
              ])) : (n(), o("p", ya, "Add the values to pull from each document."))
            ], 512), [
              [Se, N.value]
            ])
          ]),
          e("section", Ea, [
            e("header", Ma, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (U) => M("flow"))
              }, [
                r(h(O), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Ba, i(Ke.value) + " of 6", 1)
              ], 8, Na),
              w.value ? p("", !0) : (n(), o("span", Ta, i(je.value), 1)),
              e("button", {
                type: "button",
                class: W(["btn small subtle push", { on: X({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (U) => H({ kind: "details" }))
              }, [
                r(h(O), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = $("Details", -1))
              ], 2)
            ]),
            j(e("div", Ra, [
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (U) => H({ kind: "document" }))
              }, [
                e("span", Aa, [
                  r(h(O), { icon: "tabler:file-text" })
                ]),
                e("span", Da, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", La, i(h(ol)(t.config.retrieval)), 1)
                ]),
                e("span", Oa, [
                  e("span", Fa, i(h(Pe)(t.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "map",
                config: t.config,
                active: X({ kind: "stage", stage: "map" }),
                trace: ue("map"),
                readonly: t.readonly,
                onSelect: d[4] || (d[4] = (U) => H({ kind: "stage", stage: "map" }))
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
                    active: X({ kind: "stage", stage: "prefetch" }),
                    trace: ue("prefetch"),
                    readonly: t.readonly,
                    onSelect: d[5] || (d[5] = (U) => H({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  r(ce, {
                    stage: "scout",
                    config: t.config,
                    active: X({ kind: "stage", stage: "scout" }),
                    trace: ue("scout"),
                    readonly: t.readonly,
                    onSelect: d[6] || (d[6] = (U) => H({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Ia, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  r(ce, {
                    stage: "deep",
                    config: t.config,
                    active: X({ kind: "stage", stage: "deep" }),
                    trace: ue("deep"),
                    readonly: t.readonly,
                    onSelect: d[7] || (d[7] = (U) => H({ kind: "stage", stage: "deep" }))
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
                active: X({ kind: "stage", stage: "extract" }),
                trace: ue("extract"),
                readonly: t.readonly,
                onSelect: d[8] || (d[8] = (U) => H({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              r(ce, {
                stage: "verify",
                config: t.config,
                active: X({ kind: "stage", stage: "verify" }),
                trace: ue("verify"),
                readonly: t.readonly,
                onSelect: d[9] || (d[9] = (U) => H({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: W(["node fixed", { active: X({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (U) => H({ kind: "output" }))
              }, [
                e("span", Wa, [
                  r(h(O), { icon: "tabler:braces" })
                ]),
                e("span", ja, [
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
      I.value && k.value ? (n(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (U) => E(!1))
      })) : p("", !0),
      k.value ? (n(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: be(I.value ? void 0 : { width: `${a.value}px` })
      }, [
        I.value ? p("", !0) : (n(), o("div", {
          key: 0,
          class: W(["resizer", { active: C.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": a.value,
          "aria-valuemin": ge,
          onPointerdown: ke(L, ["prevent"]),
          onKeydown: V,
          onDblclick: d[12] || (d[12] = (U) => z(Ve))
        }, null, 42, Ka)),
        e("header", Ha, [
          e("span", Ja, [
            r(h(O), { icon: A.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(ne.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (U) => E(!1))
          }, [
            r(h(O), {
              icon: I.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: _,
          class: "side-panel-body"
        }, [
          v.value.kind === "document" ? (n(), Z(ia, {
            key: 0,
            config: t.config,
            retention: t.retention,
            readonly: t.readonly
          }, null, 8, ["config", "retention", "readonly"])) : v.value.kind === "stage" ? (n(), Z(Qt, {
            key: 1,
            stage: v.value.stage,
            config: t.config,
            readonly: t.readonly
          }, null, 8, ["stage", "config", "readonly"])) : v.value.kind === "field" && ee.value ? (n(), Z(Pl, {
            key: 2,
            field: ee.value,
            "other-names": P.value,
            groups: u.value,
            "deep-enabled": x.value,
            "map-enabled": b.value,
            readonly: t.readonly,
            onRemove: d[14] || (d[14] = (U) => Je(v.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : v.value.kind === "details" ? (n(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: t.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = $("Name", -1)),
              j(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (U) => s.value = U),
                "aria-label": "Extractor name"
              }, null, 512), [
                [Y, s.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = $("Description", -1)),
              j(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (U) => m.value = U),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [Y, m.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = $("Tags", -1)),
              j(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (U) => Be.value = U),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  Y,
                  Be.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, Ga)) : v.value.kind === "output" ? (n(), o("div", Xa, [
            d[37] || (d[37] = e("p", { class: "muted" }, "The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.", -1)),
            e("ul", Ya, [
              (n(!0), o(S, null, F(t.config.fields, (U) => (n(), o("li", {
                key: U.name
              }, [
                e("span", Za, i(U.name || "New field"), 1),
                e("span", _a, i(Ne(U)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : p("", !0)
        ], 512)
      ], 4)) : I.value ? p("", !0) : (n(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (U) => E(!0))
      }, [
        r(h(O), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", en, i(ne.value), 1)
      ]))
    ], 2));
  }
}), tn = ["selected"], an = {
  key: 1,
  role: "alert"
}, nn = {
  key: 2,
  class: "muted"
}, We = /* @__PURE__ */ Q({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(t, { emit: c }) {
    const s = c, m = D(!1), v = D("");
    xe(async () => {
      try {
        await qe("wc-multiselect", { timeoutMs: 8e3 }), m.value = !0;
      } catch (y) {
        v.value = String(y);
      }
    });
    function f(y) {
      const k = y.detail;
      s("select", k.selected[0] || "", k.labels?.[0] || "");
    }
    return (y, k) => m.value ? (n(), o("wc-multiselect", {
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
}, Cn = { class: "block" }, qn = { class: "timeline" }, Un = { class: "tl-icon" }, En = { class: "tl-main" }, Mn = { class: "tl-head" }, Nn = { class: "muted push" }, Bn = { class: "tl-bar" }, Tn = { class: "muted" }, Rn = {
  key: 0,
  class: "tl-msg"
}, An = {
  key: 1,
  class: "chips"
}, Dn = /* @__PURE__ */ Q({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {},
    running: { type: Boolean },
    canRun: { type: Boolean }
  },
  emits: ["run"],
  setup(t, { emit: c }) {
    const s = t, m = c, v = D(""), f = D(), y = (C) => `${Math.round(C * 100)}%`, k = (C) => C == null ? "—" : typeof C == "string" ? C : Array.isArray(C) && C.every((L) => typeof L != "object") ? C.join(", ") : typeof C == "object" ? JSON.stringify(C) : String(C), N = (C) => `${(C / 1e3).toFixed(1)}s`, w = T(() => Math.max(1, ...s.result?.trace.map((C) => C.duration_ms) ?? [1])), l = { read: { label: "Read document", icon: "tabler:file-text" }, highlight: { label: "Highlighter", icon: "tabler:highlight" } }, a = (C) => l[C]?.label ?? ie[C] ?? C, q = (C) => l[C]?.icon ?? Ue[C] ?? "tabler:point", z = (C) => C >= 0.9 ? "high" : C >= 0.7 ? "mid" : "low";
    return (C, L) => (n(), o("div", sn, [
      e("section", on, [
        e("div", dn, [
          r(We, {
            value: v.value,
            onSelect: L[0] || (L[0] = (V) => v.value = V)
          }, null, 8, ["value"])
        ]),
        r(h(oe), {
          label: t.running ? "Extracting…" : "Run extraction",
          loading: t.running,
          disabled: !v.value || t.running || !t.canRun,
          onClick: L[1] || (L[1] = (V) => m("run", v.value))
        }, null, 8, ["label", "loading", "disabled"]),
        e("p", un, i(t.canRun ? "" : "Add fields in the Builder first. ") + "Processed documents and runs expire after " + i(t.retention) + ".", 1)
      ]),
      t.result ? p("", !0) : (n(), o("p", rn, "No extraction results yet.")),
      t.result?.status === "failed" ? (n(), o("p", cn, [
        r(h(O), { icon: "tabler:alert-triangle" }),
        $("The run stopped: " + i(t.result.error), 1)
      ])) : p("", !0),
      t.result ? (n(), o("div", mn, [
        e("section", vn, [
          e("header", bn, [
            L[2] || (L[2] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", pn, [
              $(i(t.result.tokens.toLocaleString()) + " tokens · " + i(N(t.result.duration_ms)), 1),
              t.result.pages ? (n(), o(S, { key: 0 }, [
                $(" · " + i(t.result.pages) + " pages", 1)
              ], 64)) : p("", !0)
            ])
          ]),
          e("ul", yn, [
            (n(!0), o(S, null, F(t.result.fields, (V) => (n(), o("li", {
              key: V.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": f.value === V.name,
                onClick: (E) => f.value = f.value === V.name ? void 0 : V.name
              }, [
                e("span", gn, i(V.name), 1),
                e("span", {
                  class: W(["value-text", { missing: V.missing }]),
                  title: V.missing ? void 0 : k(V.value)
                }, i(V.missing ? "Not in the document" : k(V.value)), 11, hn),
                e("span", {
                  class: W(["confidence", z(V.confidence)])
                }, [
                  e("span", kn, [
                    e("span", {
                      style: be({ width: y(V.confidence) })
                    }, null, 4)
                  ]),
                  $(i(y(V.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: W(["chip", V.verified ? "primary" : "warn"]),
                  title: V.reason
                }, [
                  r(h(O), {
                    icon: V.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  $(i(V.verified ? "Verified" : "Check"), 1)
                ], 10, $n),
                r(h(O), {
                  icon: f.value === V.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, fn),
              j(e("div", xn, [
                V.missing ? p("", !0) : (n(), o("p", wn, i(k(V.value)), 1)),
                (n(!0), o(S, null, F(V.evidence, (E, M) => (n(), o("blockquote", {
                  key: M,
                  class: W({ unfound: E.found === !1 })
                }, [
                  e("p", null, "“" + i(E.quote) + "”", 1),
                  e("cite", null, [
                    $(i(E.section), 1),
                    E.page !== void 0 && E.page !== null ? (n(), o(S, { key: 0 }, [
                      $(" · Page " + i(E.page), 1)
                    ], 64)) : p("", !0),
                    E.found === !1 ? (n(), o(S, { key: 1 }, [
                      $(" · not found word for word in the document")
                    ], 64)) : p("", !0)
                  ])
                ], 2))), 128)),
                V.evidence.length ? p("", !0) : (n(), o("p", Vn, "No evidence.")),
                V.reason ? (n(), o("p", Sn, i(V.reason), 1)) : p("", !0)
              ], 512), [
                [Se, f.value === V.name]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Cn, [
          L[3] || (L[3] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", qn, [
            (n(!0), o(S, null, F(t.result.trace, (V, E) => (n(), o("li", {
              key: E,
              class: W(V.status)
            }, [
              e("span", Un, [
                r(h(O), {
                  icon: q(V.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", En, [
                e("div", Mn, [
                  e("strong", null, i(a(V.kind)), 1),
                  e("span", Nn, i(N(V.duration_ms)), 1)
                ]),
                e("span", Bn, [
                  e("span", {
                    style: be({ width: `${Math.max(4, V.duration_ms / w.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", Tn, [
                  $(i(V.scope), 1),
                  V.model ? (n(), o(S, { key: 0 }, [
                    $(" · " + i(V.model), 1)
                  ], 64)) : p("", !0),
                  $(" · " + i((V.input_tokens + V.output_tokens).toLocaleString()) + " tokens", 1)
                ]),
                V.message ? (n(), o("p", Rn, i(V.message), 1)) : p("", !0),
                V.queries?.length ? (n(), o("div", An, [
                  (n(!0), o(S, null, F(V.queries, (M) => (n(), o("span", {
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
}), Ln = { class: "evals" }, On = { class: "block eval-run" }, Fn = { class: "eval-run-main" }, zn = { class: "block-title" }, Pn = {
  key: 0,
  class: "eval-note"
}, In = {
  key: 0,
  class: "eval-progress",
  role: "status"
}, Wn = { class: "bar" }, jn = { class: "muted" }, Qn = { class: "stat-row" }, Kn = { class: "stat" }, Hn = { class: "stat-label" }, Jn = { class: "stat-value" }, Gn = { class: "stat" }, Xn = { class: "stat-value" }, Yn = { class: "stat-delta flat" }, Zn = { class: "stat" }, _n = { class: "stat-value" }, es = {
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
}, Us = ["title"], Es = {
  key: 0,
  class: "result-detail"
}, Ms = ["colspan"], Ns = {
  key: 0,
  class: "muted"
}, Bs = {
  key: 1,
  class: "compare"
}, Ts = { class: "mono" }, Rs = { class: "cmp" }, As = { class: "cmp" }, Ds = { class: "muted case-meta" }, Ls = { class: "block" }, Os = { class: "block-head" }, Fs = { class: "count" }, zs = { class: "grid" }, Ps = { class: "mono" }, Is = ["onUpdate:modelValue"], Ws = ["onUpdate:modelValue"], js = ["onUpdate:modelValue", "placeholder"], Qs = ["onUpdate:modelValue", "type"], Ks = {
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
}, eo = { class: "block-head" }, lo = { class: "count" }, to = { class: "eval-history" }, ao = ["aria-current", "onClick"], no = ["data-status"], so = { class: "muted" }, oo = { class: "push" }, io = /* @__PURE__ */ Q({
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
    const s = t, m = c, v = D(!1), f = D(""), y = D({}), k = D("");
    de(() => s.cases, () => {
      v.value = !1, f.value = "", y.value = {};
    });
    function N(x, b) {
      return x.type === "number" ? Number(b) : x.type === "boolean" ? b === "true" : x.type === "list" || x.type === "object" ? JSON.parse(b) : b;
    }
    function w() {
      k.value = "";
      const x = {};
      try {
        for (const b of s.fields) {
          const u = String(y.value[b.name] ?? "").trim();
          u && (x[b.name] = N(b, u));
        }
      } catch {
        k.value = 'Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';
        return;
      }
      m("add-case", { upload_id: f.value, expected: x });
    }
    const l = T(() => s.evaluations.find((x) => !pe(x))), a = T(() => s.evaluations.filter(pe)), q = T(() => s.evaluation), z = T(() => ({ done: (q.value?.results ?? []).filter((b) => b.status !== "queued").length, total: q.value?.case_count ?? 0 })), C = D();
    de(() => q.value?.id, () => {
      C.value = void 0;
    });
    const L = T(() => {
      if (!q.value) return;
      if (C.value) return a.value.find((b) => b.id === C.value);
      const x = a.value.findIndex((b) => b.id === q.value.id);
      return x >= 0 ? a.value[x + 1] : a.value[0];
    }), V = T(() => (q.value?.metrics ?? []).map((x) => ({ ...x, before: L.value?.metrics.find((b) => b.field === x.field) }))), E = T(() => (q.value?.fields ?? []).map((x) => x.name)), M = (x, b) => x.scores.find((u) => u.field === b), R = D(), I = (x) => `${Math.round(x * 100)}%`, te = (x) => {
      const b = Math.round(x * 100);
      return `${b > 0 ? "+" : b < 0 ? "−" : "±"}${Math.abs(b)} pts`;
    }, _ = (x) => Math.round(x * 100) > 0 ? "up" : Math.round(x * 100) < 0 ? "down" : "flat", H = (x) => x >= 6e4 ? `${Math.floor(x / 6e4)}m ${Math.round(x % 6e4 / 1e3)}s` : `${(x / 1e3).toFixed(1)}s`, X = (x) => new Date(x).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), ee = (x) => x == null || x === "" ? "—" : typeof x == "string" ? x : Array.isArray(x) && x.every((b) => typeof b != "object") ? x.join(", ") : JSON.stringify(x), ne = (x) => x ? x.score >= 0.999 ? "pass" : x.score > 0 ? "partial" : "fail" : "none", A = (x) => (x.results ?? []).filter((b) => b.status === "completed").length, P = { queued: "Queued", running: "Running", completed: "Completed", failed: "Failed" };
    return (x, b) => (n(), o("div", Ln, [
      e("section", On, [
        e("div", Fn, [
          e("div", null, [
            e("h2", zn, "Evaluate revision " + i(t.revision), 1),
            b[6] || (b[6] = e("p", { class: "muted" }, "Runs every case below with the saved configuration and scores each field against the expected value.", -1)),
            t.changed ? (n(), o("p", Pn, [
              r(h(O), { icon: "tabler:info-circle" }),
              b[5] || (b[5] = $("Unsaved changes are not evaluated. Save first to measure them.", -1))
            ])) : p("", !0)
          ]),
          r(h(oe), {
            label: l.value ? "Evaluating…" : "Run all cases",
            loading: t.starting || !!l.value,
            disabled: !t.cases.length || !t.fields.length || !!l.value || t.starting,
            onClick: b[0] || (b[0] = (u) => m("evaluate"))
          }, null, 8, ["label", "loading", "disabled"])
        ]),
        q.value && !h(pe)(q.value) ? (n(), o("div", In, [
          e("span", Wn, [
            e("span", {
              style: be({ width: I(z.value.total ? z.value.done / z.value.total : 0) })
            }, null, 4)
          ]),
          e("span", jn, i(P[q.value.status]) + " · " + i(z.value.done) + " of " + i(z.value.total) + " cases", 1)
        ])) : p("", !0)
      ]),
      q.value && h(pe)(q.value) ? (n(), o(S, { key: 0 }, [
        q.value.error ? (n(), o("p", {
          key: 0,
          class: W(q.value.status === "failed" ? "run-failed" : "eval-warning"),
          role: "alert"
        }, [
          r(h(O), { icon: "tabler:alert-triangle" }),
          $(i(q.value.error), 1)
        ], 2)) : p("", !0),
        e("div", Qn, [
          e("div", Kn, [
            e("span", Hn, "Accuracy · revision " + i(q.value.config_revision), 1),
            e("span", Jn, i(I(h(re)(q.value))), 1),
            L.value ? (n(), o("span", {
              key: 0,
              class: W(["stat-delta", _(h(re)(q.value) - h(re)(L.value))])
            }, i(te(h(re)(q.value) - h(re)(L.value))) + " vs revision " + i(L.value.config_revision), 3)) : p("", !0)
          ]),
          e("div", Gn, [
            b[7] || (b[7] = e("span", { class: "stat-label" }, "Cases", -1)),
            e("span", Xn, [
              $(i(A(q.value)), 1),
              e("small", null, " / " + i(q.value.case_count), 1)
            ]),
            e("span", Yn, i(q.value.case_count - A(q.value)) + " failed", 1)
          ]),
          e("div", Zn, [
            b[8] || (b[8] = e("span", { class: "stat-label" }, "Tokens", -1)),
            e("span", _n, i(q.value.tokens.toLocaleString()), 1),
            L.value ? (n(), o("span", es, i(L.value.tokens.toLocaleString()) + " before", 1)) : p("", !0)
          ]),
          e("div", ls, [
            b[9] || (b[9] = e("span", { class: "stat-label" }, "Model time", -1)),
            e("span", ts, i(H(q.value.duration_ms)), 1),
            L.value ? (n(), o("span", as, i(H(L.value.duration_ms)) + " before", 1)) : p("", !0)
          ])
        ]),
        e("section", ns, [
          e("header", ss, [
            b[11] || (b[11] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
            a.value.length > 1 ? (n(), o("label", os, [
              b[10] || (b[10] = e("span", { class: "muted" }, "Compare with", -1)),
              e("select", {
                value: L.value?.id,
                "aria-label": "Baseline evaluation",
                onChange: b[1] || (b[1] = (u) => C.value = u.target.value)
              }, [
                (n(!0), o(S, null, F(a.value.filter((u) => u.id !== q.value.id), (u) => (n(), o("option", {
                  key: u.id,
                  value: u.id
                }, "Revision " + i(u.config_revision) + " · " + i(X(u.created_at)), 9, ds))), 128))
              ], 40, is)
            ])) : p("", !0)
          ]),
          V.value.length ? (n(), o("div", rs, [
            e("table", cs, [
              e("thead", null, [
                e("tr", null, [
                  b[12] || (b[12] = e("th", null, "Field", -1)),
                  b[13] || (b[13] = e("th", null, "Accuracy", -1)),
                  b[14] || (b[14] = e("th", null, "Verified", -1)),
                  L.value ? (n(), o("th", ms, "Revision " + i(L.value.config_revision), 1)) : p("", !0),
                  L.value ? (n(), o("th", vs, "Change")) : p("", !0)
                ])
              ]),
              e("tbody", null, [
                (n(!0), o(S, null, F(V.value, (u) => (n(), o("tr", {
                  key: u.field
                }, [
                  e("td", bs, i(u.field), 1),
                  e("td", null, [
                    e("span", ps, [
                      e("span", ys, [
                        e("span", {
                          style: be({ width: I(u.accuracy) })
                        }, null, 4)
                      ]),
                      $(i(I(u.accuracy)), 1)
                    ])
                  ]),
                  e("td", fs, i(I(u.verified)), 1),
                  L.value ? (n(), o("td", gs, i(u.before ? I(u.before.accuracy) : "—"), 1)) : p("", !0),
                  L.value ? (n(), o("td", hs, [
                    u.before ? (n(), o("span", {
                      key: 0,
                      class: W(["trend", _(u.accuracy - u.before.accuracy)])
                    }, [
                      r(h(O), {
                        icon: _(u.accuracy - u.before.accuracy) === "up" ? "tabler:trending-up" : _(u.accuracy - u.before.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                      }, null, 8, ["icon"]),
                      $(i(te(u.accuracy - u.before.accuracy)), 1)
                    ], 2)) : (n(), o("span", ks, "New field"))
                  ])) : p("", !0)
                ]))), 128))
              ])
            ])
          ])) : (n(), o("p", us, "No case completed, so there is no accuracy to show."))
        ])
      ], 64)) : p("", !0),
      q.value?.results?.length ? (n(), o("section", $s, [
        b[19] || (b[19] = e("header", { class: "block-head" }, [
          e("h2", { class: "block-title" }, "Results by case"),
          e("span", { class: "muted push matrix-hint" }, "Select a case to compare values")
        ], -1)),
        e("div", xs, [
          e("table", ws, [
            e("thead", null, [
              e("tr", null, [
                b[15] || (b[15] = e("th", null, "Document", -1)),
                (n(!0), o(S, null, F(E.value, (u) => (n(), o("th", {
                  key: u,
                  class: "mono"
                }, i(u), 1))), 128))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(S, null, F(q.value.results, (u) => (n(), o(S, {
                key: u.case_id
              }, [
                e("tr", {
                  class: W(["result-row", { active: R.value === u.case_id }])
                }, [
                  e("td", null, [
                    e("button", {
                      type: "button",
                      class: "case-toggle",
                      "aria-expanded": R.value === u.case_id,
                      onClick: (B) => R.value = R.value === u.case_id ? void 0 : u.case_id
                    }, [
                      r(h(O), {
                        icon: R.value === u.case_id ? "tabler:chevron-down" : "tabler:chevron-right"
                      }, null, 8, ["icon"]),
                      $(i(u.upload_name), 1)
                    ], 8, Vs)
                  ]),
                  u.status !== "completed" ? (n(), o("td", {
                    key: 0,
                    colspan: E.value.length,
                    class: "muted"
                  }, [
                    u.status === "queued" ? (n(), o("span", Cs, [
                      r(h(O), {
                        icon: "tabler:loader-2",
                        class: "spin"
                      }),
                      b[16] || (b[16] = $("Waiting", -1))
                    ])) : (n(), o("span", qs, [
                      r(h(O), { icon: "tabler:alert-triangle" }),
                      $(i(u.error), 1)
                    ]))
                  ], 8, Ss)) : (n(!0), o(S, { key: 1 }, F(E.value, (B) => (n(), o("td", { key: B }, [
                    e("span", {
                      class: W(["cell", ne(M(u, B))]),
                      title: ee(M(u, B)?.value)
                    }, i(M(u, B) ? I(M(u, B).score) : "—"), 11, Us)
                  ]))), 128))
                ], 2),
                R.value === u.case_id ? (n(), o("tr", Es, [
                  e("td", {
                    colspan: E.value.length + 1
                  }, [
                    u.error ? (n(), o("p", Ns, i(u.error), 1)) : (n(), o("dl", Bs, [
                      (n(!0), o(S, null, F(u.scores, (B) => (n(), o(S, {
                        key: B.field
                      }, [
                        e("dt", Ts, i(B.field), 1),
                        e("dd", null, [
                          e("span", {
                            class: W(["cell", ne(B)])
                          }, i(I(B.score)), 3),
                          e("span", Rs, [
                            b[17] || (b[17] = e("span", { class: "cmp-label" }, "Expected", -1)),
                            $(i(ee(B.expected)), 1)
                          ]),
                          e("span", As, [
                            b[18] || (b[18] = e("span", { class: "cmp-label" }, "Extracted", -1)),
                            $(i(ee(B.value)), 1)
                          ]),
                          e("span", null, [
                            e("span", {
                              class: W(["chip", B.verified ? "primary" : "warn"])
                            }, [
                              r(h(O), {
                                icon: B.verified ? "tabler:shield-check" : "tabler:shield-question"
                              }, null, 8, ["icon"]),
                              $(i(B.verified ? "Verified" : "Unverified"), 1)
                            ], 2)
                          ])
                        ])
                      ], 64))), 128))
                    ])),
                    e("p", Ds, i(u.tokens.toLocaleString()) + " tokens · " + i(H(u.duration_ms)), 1)
                  ], 8, Ms)
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
          r(h(oe), {
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
          onSubmit: ke(w, ["prevent"])
        }, [
          e("label", null, [
            b[21] || (b[21] = $("Document", -1)),
            r(We, {
              value: f.value,
              onSelect: b[3] || (b[3] = (u) => {
                f.value = u;
              })
            }, null, 8, ["value"])
          ]),
          b[24] || (b[24] = e("p", { class: "muted" }, "Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.", -1)),
          e("div", zs, [
            (n(!0), o(S, null, F(t.fields, (u) => (n(), o("label", {
              key: u.name
            }, [
              e("span", Ps, i(u.name), 1),
              u.type === "boolean" ? j((n(), o("select", {
                key: 0,
                "onUpdate:modelValue": (B) => y.value[u.name] = B
              }, [...b[22] || (b[22] = [
                e("option", { value: "" }, "Not stated", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, Is)), [
                [ye, y.value[u.name]]
              ]) : u.type === "enum" ? j((n(), o("select", {
                key: 1,
                "onUpdate:modelValue": (B) => y.value[u.name] = B
              }, [
                b[23] || (b[23] = e("option", { value: "" }, "Not stated", -1)),
                (n(!0), o(S, null, F(u.enum_values, (B) => (n(), o("option", { key: B }, i(B), 1))), 128))
              ], 8, Ws)), [
                [ye, y.value[u.name]]
              ]) : u.type === "object" || u.type === "list" ? j((n(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (B) => y.value[u.name] = B,
                rows: "2",
                placeholder: u.type === "list" ? '["first", "second"]' : '{"key": "value"}'
              }, null, 8, js)), [
                [Y, y.value[u.name]]
              ]) : j((n(), o("input", {
                key: 3,
                "onUpdate:modelValue": (B) => y.value[u.name] = B,
                type: u.type === "number" ? "number" : u.type === "date" ? "date" : "text",
                placeholder: "Not stated"
              }, null, 8, Qs)), [
                [Ye, y.value[u.name]]
              ])
            ]))), 128))
          ]),
          k.value ? (n(), o("p", Ks, i(k.value), 1)) : p("", !0),
          e("div", Hs, [
            r(h(oe), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !f.value,
              loading: t.saving
            }, null, 8, ["disabled", "loading"]),
            r(h(oe), {
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
                (n(!0), o(S, null, F(t.fields, (u) => (n(), o("th", {
                  key: u.name,
                  class: "mono"
                }, i(u.name), 1))), 128)),
                b[26] || (b[26] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (n(!0), o(S, null, F(t.cases, (u) => (n(), o("tr", {
                key: u.id
              }, [
                e("td", null, [
                  r(h(O), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  $(" " + i(u.upload_name), 1)
                ]),
                (n(!0), o(S, null, F(t.fields, (B) => (n(), o("td", {
                  key: B.name,
                  class: W({ muted: !(B.name in u.expected) })
                }, i(B.name in u.expected ? ee(u.expected[B.name]) : "Not stated"), 3))), 128)),
                e("td", Ys, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${u.upload_name}`,
                    disabled: t.saving,
                    onClick: (B) => m("delete-case", u.id)
                  }, [
                    r(h(O), { icon: "tabler:trash" })
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
          (n(!0), o(S, null, F(t.evaluations, (u) => (n(), o("li", {
            key: u.id
          }, [
            e("button", {
              type: "button",
              class: W({ active: q.value?.id === u.id }),
              "aria-current": q.value?.id === u.id,
              onClick: (B) => m("open", u.id)
            }, [
              e("span", {
                class: "badge",
                "data-status": u.status
              }, i(P[u.status]), 9, no),
              e("span", null, "Revision " + i(u.config_revision), 1),
              e("span", so, i(X(u.created_at)), 1),
              e("strong", oo, i(u.status === "completed" ? I(h(re)(u)) : "—"), 1)
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
}, vo = { class: "metric-table" }, bo = { class: "caller" }, po = ["data-status"], yo = { class: "num" }, fo = { class: "num" }, go = { class: "muted" }, ho = /* @__PURE__ */ Q({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(t) {
    const c = (m) => new Date(m).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }), s = { ui: { label: "Test tab", icon: "tabler:player-play" }, agent: { label: "Agent", icon: "tabler:robot" }, eval: { label: "Evaluation", icon: "tabler:chart-bar" }, workflow: { label: "Workflow", icon: "tabler:route" } };
    return (m, v) => (n(), o(S, null, [
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
            (n(!0), o(S, null, F(t.runs, (f) => (n(), o("tr", {
              key: f.id
            }, [
              e("td", null, i(c(f.created_at)), 1),
              e("td", null, [
                e("span", bo, [
                  r(h(O), {
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
}), ko = {
  key: 0,
  role: "alert",
  class: "error banner"
}, $o = /* @__PURE__ */ Q({
  __name: "SharePopup",
  props: {
    id: {},
    title: {}
  },
  emits: ["close"],
  setup(t, { emit: c }) {
    const s = t, m = c, v = D(), f = D("");
    return xe(async () => {
      try {
        await qe("kickside-share", { timeoutMs: 8e3 });
      } catch (N) {
        f.value = `Sharing is unavailable: ${N instanceof Error ? N.message : String(N)}`;
        return;
      }
      const y = document.createElement("kickside-share"), k = encodeURIComponent(s.id);
      y.setAttribute("config", JSON.stringify({ resource_id: s.id, title: s.title, access_url: `/api/v1/component-access/grants/${k}`, share_url: `/api/v1/component-access/share/${k}` })), y.style.display = "block", y.addEventListener("close", () => m("close")), v.value?.appendChild(y);
    }), (y, k) => (n(), o("div", {
      ref_key: "host",
      ref: v
    }, [
      f.value ? (n(), o("p", ko, i(f.value), 1)) : p("", !0)
    ], 512));
  }
}), xo = { class: "docscout" }, wo = { class: "toolbar" }, Vo = { class: "toolbar-lead" }, So = { class: "crumb" }, Co = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, qo = ["id", "aria-selected", "aria-controls", "onClick"], Uo = { class: "toolbar-side" }, Eo = { class: "stats" }, Mo = ["title"], No = {
  key: 1,
  class: "unsaved"
}, Bo = {
  key: 0,
  role: "alert",
  class: "error banner"
}, To = {
  key: 2,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, Ro = ["id", "aria-labelledby"], Ao = /* @__PURE__ */ Q({
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
    const s = t, m = c, v = D(), f = D(!1), y = D("Builder"), k = D(Oe()), N = D(""), w = D(""), l = T(() => s.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    de(y, () => {
      v.value && (v.value.scrollTop = 0);
    }, { flush: "post" });
    const a = D();
    function q(E) {
      return N.value === E.title && w.value === (E.description ?? "") && ul(k.value, E.config);
    }
    de(() => s.snapshot, (E, M) => {
      l.value.includes(y.value) || (y.value = l.value[0]), !(M && E.id === M.id && E.can_edit && M.can_edit && !q(M) && !q(E)) && (k.value = structuredClone(Ae(E.config ?? Oe())), N.value = E.title, w.value = E.description ?? "", a.value = E.expected_revision);
    }, { immediate: !0 });
    const z = T(() => s.snapshot.can_edit && !q(s.snapshot)), C = T(() => dl(k.value)), L = T(() => Object.keys(ie).filter((E) => he(k.value, E)).length);
    function V() {
      m("save", { title: N.value, description: w.value, config: structuredClone(Ae(k.value)), expected_revision: a.value });
    }
    return (E, M) => (n(), o("main", xo, [
      e("div", wo, [
        e("div", Vo, [
          t.back ? (n(), o(S, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: M[0] || (M[0] = (R) => m("back"))
            }, [
              r(h(O), { icon: "tabler:arrow-left" })
            ]),
            e("span", So, i(t.snapshot.title), 1)
          ], 64)) : p("", !0),
          e("nav", Co, [
            (n(!0), o(S, null, F(l.value, (R) => (n(), o("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": y.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (I) => y.value = R
            }, i(R), 9, qo))), 128))
          ])
        ]),
        e("div", Uo, [
          t.snapshot.can_share ? (n(), Z(h(oe), {
            key: 0,
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[1] || (M[1] = (R) => f.value = !0)
          }, {
            default: Ze(() => [
              r(h(O), { icon: "tabler:share" }),
              M[10] || (M[10] = $("Share", -1))
            ]),
            _: 1
          })) : p("", !0),
          e("span", Eo, [
            $(i(t.snapshot.field_count) + " " + i(t.snapshot.field_count === 1 ? "field" : "fields"), 1),
            t.snapshot.can_edit ? (n(), o(S, { key: 0 }, [
              $(" · " + i(L.value) + " steps · revision " + i(t.snapshot.expected_revision), 1)
            ], 64)) : (n(), o(S, { key: 1 }, [
              $(" · Read access")
            ], 64))
          ]),
          t.snapshot.can_edit ? (n(), o(S, { key: 1 }, [
            C.value ? (n(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: C.value
            }, [
              r(h(O), { icon: "tabler:alert-circle" }),
              $(i(C.value), 1)
            ], 8, Mo)) : z.value ? (n(), o("span", No, "Unsaved")) : p("", !0),
            r(h(oe), {
              label: "Save",
              size: "small",
              loading: t.saving,
              disabled: !z.value || !!C.value || !N.value.trim(),
              onClick: V
            }, null, 8, ["loading", "disabled"])
          ], 64)) : p("", !0)
        ])
      ]),
      t.error ? (n(), o("p", Bo, i(t.error), 1)) : p("", !0),
      f.value ? (n(), Z($o, {
        key: 1,
        id: t.snapshot.id,
        title: t.snapshot.title,
        onClose: M[2] || (M[2] = (R) => f.value = !1)
      }, null, 8, ["id", "title"])) : p("", !0),
      y.value === "Builder" && t.snapshot.can_edit ? (n(), o("div", To, [
        r(ln, {
          title: N.value,
          "onUpdate:title": M[3] || (M[3] = (R) => N.value = R),
          description: w.value,
          "onUpdate:description": M[4] || (M[4] = (R) => w.value = R),
          config: k.value,
          retention: t.snapshot.retention,
          result: t.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (n(), o("div", {
        key: 3,
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
          y.value === "Test" ? (n(), Z(Dn, {
            key: 0,
            result: t.result,
            retention: t.snapshot.retention,
            running: t.running,
            "can-run": t.snapshot.field_count > 0,
            onRun: M[5] || (M[5] = (R) => m("run", R))
          }, null, 8, ["result", "retention", "running", "can-run"])) : p("", !0),
          y.value === "Evals" && t.snapshot.can_edit ? (n(), Z(io, {
            key: 1,
            cases: t.snapshot.cases,
            fields: t.snapshot.config.fields,
            evaluations: t.evaluations,
            evaluation: t.evaluation,
            revision: t.snapshot.expected_revision,
            changed: z.value,
            saving: t.saving,
            starting: t.starting,
            onAddCase: M[6] || (M[6] = (R) => m("add-case", R)),
            onDeleteCase: M[7] || (M[7] = (R) => m("delete-case", R)),
            onEvaluate: M[8] || (M[8] = (R) => m("evaluate")),
            onOpen: M[9] || (M[9] = (R) => m("open-evaluation", R))
          }, null, 8, ["cases", "fields", "evaluations", "evaluation", "revision", "changed", "saving", "starting"])) : p("", !0),
          y.value === "Runs" ? (n(), Z(ho, {
            key: 2,
            runs: t.snapshot.runs,
            retention: t.snapshot.retention
          }, null, 8, ["runs", "retention"])) : p("", !0)
        ], 8, Ro)
      ], 512))
    ]));
  }
}), Do = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, Lo = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, Oo = 2e3, Wo = /* @__PURE__ */ Q({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: c }) {
    const s = t, m = c, v = D(), f = D(""), y = D(!1), k = D(!1), N = D(!1), w = D(null), l = D([]), a = D();
    let q, z, C = 0, L;
    const V = (A) => A instanceof Error ? A.message : String(A), E = (A) => A === C;
    async function M(A, P) {
      try {
        const x = s.id, b = await ae.evaluations(x);
        if (!E(A)) return;
        l.value = b, P && (L = P);
        const u = L ?? b[0]?.id;
        if (u) {
          const B = await ae.evaluation(x, u);
          if (!E(A) || B.id !== (L ?? u)) return;
          a.value = B;
        }
        clearTimeout(z), b.some((B) => !pe(B)) && (z = setTimeout(() => M(A), Oo));
      } catch (x) {
        E(A) && (f.value = V(x));
      }
    }
    async function R(A) {
      if (!s.id) {
        f.value = "No extractor selected.";
        return;
      }
      try {
        const P = await ae.get(s.id);
        if (!E(A)) return;
        v.value = P, f.value = "", P.can_edit && await M(A);
      } catch (P) {
        E(A) && (f.value = V(P));
      }
    }
    de(() => s.id, () => {
      C++, L = void 0, clearTimeout(z), q?.(), v.value = void 0, w.value = null, l.value = [], a.value = void 0, f.value = "";
      const A = C;
      R(A), s.id && (q = _e(`component.${s.id}`, () => R(A)));
    }, { immediate: !0 }), Fe(() => {
      C++, q?.(), clearTimeout(z);
    });
    async function I(A) {
      const P = C;
      y.value = !0, f.value = "";
      try {
        await A(), E(P) && await R(P);
      } catch (x) {
        E(P) && (f.value = V(x));
      } finally {
        y.value = !1;
      }
    }
    const te = (A) => I(() => ae.update(s.id, A)), _ = (A) => I(() => ae.addCase(s.id, A)), H = (A) => I(() => ae.deleteCase(s.id, A));
    async function X(A) {
      const P = C;
      k.value = !0, f.value = "";
      try {
        const x = await ae.run(s.id, A);
        E(P) && (w.value = x, await R(P));
      } catch (x) {
        E(P) && (f.value = V(x));
      } finally {
        k.value = !1;
      }
    }
    async function ee() {
      const A = C;
      N.value = !0, f.value = "";
      try {
        const { eval_id: P } = await ae.evaluate(s.id);
        E(A) && await M(A, P);
      } catch (P) {
        E(A) && (f.value = V(P));
      } finally {
        N.value = !1;
      }
    }
    function ne(A) {
      M(C, A);
    }
    return (A, P) => v.value ? (n(), Z(Ao, {
      key: 0,
      snapshot: v.value,
      saving: y.value,
      running: k.value,
      starting: N.value,
      result: w.value,
      evaluations: l.value,
      evaluation: a.value,
      error: f.value,
      back: t.back,
      onBack: P[0] || (P[0] = (x) => m("back")),
      onRun: X,
      onSave: te,
      onAddCase: _,
      onDeleteCase: H,
      onEvaluate: ee,
      onOpenEvaluation: ne
    }, null, 8, ["snapshot", "saving", "running", "starting", "result", "evaluations", "evaluation", "error", "back"])) : f.value ? (n(), o("p", Do, i(f.value), 1)) : (n(), o("p", Lo, "Loading Docscout…"));
  }
});
export {
  Wo as _
};
