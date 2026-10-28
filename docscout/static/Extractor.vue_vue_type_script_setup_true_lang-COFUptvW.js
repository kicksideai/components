import { defineComponent as W, useModel as re, openBlock as s, createElementBlock as o, withModifiers as ye, createElementVNode as e, mergeModels as fe, computed as M, withKeys as Je, unref as h, normalizeClass as P, createVNode as r, toDisplayString as i, Fragment as S, renderList as E, createCommentVNode as f, createTextVNode as k, createBlock as G, watch as te, withDirectives as z, vModelText as J, vModelSelect as oe, ref as B, onMounted as ge, normalizeStyle as ae, onBeforeUnmount as Ee, nextTick as Ke, vShow as be, vModelDynamic as He, toRaw as qe } from "vue";
import { loadByTagName as Be, on as Ge } from "@wippy-fe/proxy";
import { i as ce, h as Te, t as pe, g as Z, j as he, k as Xe, m as Re, l as De, o as Ue, p as Ye, q as Ze, r as _e, v as el, w as Me, x as ll, y as ie, z as tl, A as al, s as K, n as Ne, C as nl, D as sl, c as de } from "./index-D4Z7Rr2F.js";
import { Icon as T } from "@iconify/vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const ol = ["aria-checked", "aria-label", "disabled"], O = /* @__PURE__ */ W({
  __name: "Toggle",
  props: /* @__PURE__ */ fe({
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: Boolean, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(a) {
    const v = re(a, "modelValue");
    return (n, u) => (s(), o("button", {
      type: "button",
      role: "switch",
      class: "switch",
      "aria-checked": v.value,
      "aria-label": a.label,
      disabled: a.disabled,
      onClick: u[0] || (u[0] = ye((m) => v.value = !v.value, ["stop"]))
    }, [...u[1] || (u[1] = [
      e("span", null, null, -1)
    ])], 8, ol));
  }
}), il = ["aria-label"], dl = { class: "node-icon" }, ul = { class: "node-main" }, rl = { class: "node-title" }, cl = { class: "node-summary" }, ml = {
  key: 0,
  class: "chips"
}, vl = {
  key: 1,
  class: "trace-line"
}, bl = { class: "node-side" }, pl = {
  key: 0,
  class: "chip model"
}, ee = /* @__PURE__ */ W({
  __name: "StageNode",
  props: {
    stage: {},
    config: {},
    active: { type: Boolean },
    trace: {},
    readonly: { type: Boolean }
  },
  emits: ["select"],
  setup(a, { emit: v }) {
    const n = a, u = v, m = M(() => ce(n.config, n.stage)), V = M(() => n.config.stages[n.stage].model), x = M({ get: () => m.value, set: (w) => {
      n.config.stages[n.stage].enabled = w;
    } }), g = M(() => {
      const w = n.config, l = w.stages;
      switch (n.stage) {
        case "map":
          return w.fields.filter((t) => t.search_within === "sections").map((t) => ({ text: t.name || "New field", tone: "primary" }));
        case "prefetch":
          return [...l.prefetch.queries.map((t) => ({ text: t.name || "Untitled query", tone: "" })), ...w.fields.filter((t) => t.search_hints.trim()).map((t) => ({ text: t.name, tone: "hint" }))];
        case "scout":
          return l.scout.mode === "agent" ? l.scout.tools.map((t) => ({ text: pe(t).toLowerCase(), tone: "" })) : [];
        case "deep":
          return w.fields.filter((t) => t.strategy === "deep").map((t) => ({ text: t.name || "New field", tone: "primary" }));
        case "extract":
          return Te(w).map((t) => ({ text: `${t.name} · ${t.fields.length}`, tone: "" }));
        default:
          return [];
      }
    }), N = (w) => [`${(w.duration_ms / 1e3).toFixed(1)}s`, `${(w.input_tokens + w.output_tokens).toLocaleString()} tokens`, w.queries?.length ? `${w.queries.length} queries` : "", w.message ?? ""].filter(Boolean).join(" · ");
    return (w, l) => (s(), o("div", {
      class: P(["node", { active: a.active, off: !m.value, fixed: a.stage === "extract" }]),
      role: "button",
      tabindex: "0",
      "aria-label": h(Z)[a.stage],
      onClick: l[1] || (l[1] = (t) => u("select")),
      onKeydown: l[2] || (l[2] = Je((t) => u("select"), ["enter"]))
    }, [
      e("span", dl, [
        r(h(T), {
          icon: h(he)[a.stage]
        }, null, 8, ["icon"])
      ]),
      e("span", ul, [
        e("span", rl, i(h(Z)[a.stage]), 1),
        e("span", cl, i(m.value ? h(Xe)(a.stage, a.config) : "Off"), 1),
        m.value && g.value.length ? (s(), o("span", ml, [
          (s(!0), o(S, null, E(g.value, (t) => (s(), o("span", {
            key: t.text,
            class: P(["chip", { primary: t.tone === "primary", "muted-chip": t.tone === "hint" }])
          }, i(t.text), 3))), 128))
        ])) : f("", !0),
        a.trace ? (s(), o("span", vl, [
          r(h(T), {
            icon: a.trace.status === "failed" ? "tabler:alert-circle" : "tabler:circle-check"
          }, null, 8, ["icon"]),
          k(i(N(a.trace)), 1)
        ])) : f("", !0)
      ]),
      e("span", bl, [
        m.value && V.value ? (s(), o("span", pl, i(h(Re)(V.value)), 1)) : f("", !0),
        a.stage !== "extract" && !a.readonly ? (s(), G(O, {
          key: 1,
          modelValue: x.value,
          "onUpdate:modelValue": l[0] || (l[0] = (t) => x.value = t),
          label: `Enable ${h(Z)[a.stage]}`
        }, null, 8, ["modelValue", "label"])) : f("", !0)
      ])
    ], 42, il));
  }
}), yl = ["disabled"], fl = { class: "grid" }, gl = ["aria-invalid"], hl = ["value"], kl = {
  key: 0,
  class: "field-error",
  role: "alert"
}, $l = { key: 1 }, xl = ["value"], wl = { key: 2 }, Vl = ["value"], Sl = { class: "grid" }, Cl = {
  key: 3,
  class: "field-note"
}, ql = { class: "label-block" }, Ul = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "within-label"
}, Ml = ["aria-checked"], Nl = ["aria-checked"], El = {
  key: 4,
  class: "field-error"
}, Bl = { id: "docscout-groups" }, Tl = ["value"], Rl = { key: 5 }, Dl = ["placeholder"], zl = { class: "toggle-row" }, Fl = { class: "toggle-row" }, Al = /* @__PURE__ */ W({
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
  setup(a, { emit: v }) {
    const n = a, u = v, m = [{ value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Yes / no" }, { value: "date", label: "Date" }, { value: "enum", label: "One of a set" }, { value: "list", label: "List" }, { value: "object", label: "Object" }], V = m.filter((w) => ["text", "number", "boolean", "date", "object"].includes(w.value)), x = M(() => De(n.field, n.otherNames)), g = M(() => n.field.type !== "boolean" && n.field.type !== "enum" && !(n.field.type === "list" && n.field.item_type === "boolean"));
    te(() => n.field.type, () => {
      !Ue(n.field) && n.field.enum_values.length && (n.field.enum_values = []);
    });
    function N(w) {
      n.field.enum_values = [...new Set(w.target.value.split(`
`).map((l) => l.trim()).filter(Boolean))];
    }
    return (w, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: a.readonly
    }, [
      e("div", fl, [
        e("label", null, [
          l[15] || (l[15] = k("Name", -1)),
          z(e("input", {
            "onUpdate:modelValue": l[0] || (l[0] = (t) => a.field.name = t),
            placeholder: "invoice_total",
            "aria-label": "Field name",
            "aria-invalid": !!x.value,
            spellcheck: "false",
            class: "mono-input"
          }, null, 8, gl), [
            [
              J,
              a.field.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        e("label", null, [
          l[16] || (l[16] = k("Type", -1)),
          z(e("select", {
            "onUpdate:modelValue": l[1] || (l[1] = (t) => a.field.type = t),
            "aria-label": "Field type"
          }, [
            (s(), o(S, null, E(m, (t) => e("option", {
              key: t.value,
              value: t.value
            }, i(t.label), 9, hl)), 64))
          ], 512), [
            [oe, a.field.type]
          ])
        ])
      ]),
      x.value ? (s(), o("p", kl, [
        r(h(T), { icon: "tabler:alert-circle" }),
        k(i(x.value), 1)
      ])) : f("", !0),
      a.field.type === "list" ? (s(), o("label", $l, [
        l[17] || (l[17] = k("Each item is", -1)),
        z(e("select", {
          "onUpdate:modelValue": l[2] || (l[2] = (t) => a.field.item_type = t)
        }, [
          (s(!0), o(S, null, E(h(V), (t) => (s(), o("option", {
            key: t.value,
            value: t.value
          }, i(t.label), 9, xl))), 128))
        ], 512), [
          [oe, a.field.item_type]
        ])
      ])) : f("", !0),
      h(Ue)(a.field) ? (s(), o("label", wl, [
        k(i(a.field.type === "enum" ? "Allowed values" : "Allowed items (optional)"), 1),
        e("textarea", {
          value: a.field.enum_values.join(`
`),
          rows: "3",
          placeholder: "One per line",
          onChange: N
        }, null, 40, Vl),
        e("small", null, i(a.field.type === "enum" ? "The value must be exactly one of these." : "When set, every item must be one of these."), 1)
      ])) : f("", !0),
      e("label", null, [
        l[18] || (l[18] = k("Description", -1)),
        z(e("textarea", {
          "onUpdate:modelValue": l[3] || (l[3] = (t) => a.field.description = t),
          rows: "2",
          placeholder: "What this value means in the document"
        }, null, 512), [
          [J, a.field.description]
        ]),
        l[19] || (l[19] = e("small", null, "The model reads this to know what to look for.", -1))
      ]),
      l[35] || (l[35] = e("h4", null, "Finding it", -1)),
      e("label", null, [
        l[20] || (l[20] = k("Search hints", -1)),
        z(e("textarea", {
          "onUpdate:modelValue": l[4] || (l[4] = (t) => a.field.search_hints = t),
          rows: "2",
          placeholder: "One query per line"
        }, null, 512), [
          [J, a.field.search_hints]
        ]),
        l[21] || (l[21] = e("small", null, "Each line becomes a query in Prefetch and Scout.", -1))
      ]),
      e("div", Sl, [
        e("label", null, [
          l[23] || (l[23] = k("Strategy", -1)),
          z(e("select", {
            "onUpdate:modelValue": l[5] || (l[5] = (t) => a.field.strategy = t)
          }, [...l[22] || (l[22] = [
            e("option", { value: "standard" }, "Standard", -1),
            e("option", { value: "deep" }, "Deep analysis", -1)
          ])], 512), [
            [oe, a.field.strategy]
          ])
        ]),
        e("label", null, [
          l[24] || (l[24] = k("Chunks to read", -1)),
          z(e("input", {
            "onUpdate:modelValue": l[6] || (l[6] = (t) => a.field.chunks = t),
            type: "number",
            min: "1",
            max: "1000"
          }, null, 512), [
            [
              J,
              a.field.chunks,
              void 0,
              { number: !0 }
            ]
          ]),
          l[25] || (l[25] = e("small", null, "Per search hint", -1))
        ])
      ]),
      a.field.strategy === "deep" && !a.deepEnabled ? (s(), o("p", Cl, [
        r(h(T), { icon: "tabler:info-circle" }),
        l[26] || (l[26] = k("Deep analysis is off in the flow, so this field runs as standard.", -1))
      ])) : f("", !0),
      e("div", ql, [
        l[27] || (l[27] = e("span", { id: "within-label" }, "Search within", -1)),
        e("div", Ul, [
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": a.field.search_within === "document",
            onClick: l[7] || (l[7] = (t) => a.field.search_within = "document")
          }, "Whole document", 8, Ml),
          e("button", {
            type: "button",
            role: "radio",
            "aria-checked": a.field.search_within === "sections",
            onClick: l[8] || (l[8] = (t) => a.field.search_within = "sections")
          }, "Map's sections", 8, Nl)
        ]),
        e("small", null, i(a.field.search_within === "sections" ? "Map picks the sections that should hold this value; search and reading stay inside them." : "Search covers the whole document."), 1)
      ]),
      a.field.search_within === "sections" && !a.mapEnabled ? (s(), o("p", El, [
        r(h(T), { icon: "tabler:alert-circle" }),
        l[28] || (l[28] = k("Turn on Map the document to read sections.", -1))
      ])) : f("", !0),
      e("label", null, [
        l[29] || (l[29] = k("Group", -1)),
        z(e("input", {
          "onUpdate:modelValue": l[9] || (l[9] = (t) => a.field.group = t),
          list: "docscout-groups",
          placeholder: "Default"
        }, null, 512), [
          [
            J,
            a.field.group,
            void 0,
            { trim: !0 }
          ]
        ]),
        e("datalist", Bl, [
          (s(!0), o(S, null, E(a.groups, (t) => (s(), o("option", {
            key: t,
            value: t
          }, null, 8, Tl))), 128))
        ]),
        l[30] || (l[30] = e("small", null, "Fields in a group are extracted together in one call.", -1))
      ]),
      l[36] || (l[36] = e("h4", null, "Checking it", -1)),
      e("label", null, [
        l[31] || (l[31] = k("Validation hints", -1)),
        z(e("textarea", {
          "onUpdate:modelValue": l[10] || (l[10] = (t) => a.field.validation_hints = t),
          rows: "2",
          placeholder: "Rules the value must satisfy"
        }, null, 512), [
          [J, a.field.validation_hints]
        ])
      ]),
      g.value ? (s(), o("label", Rl, [
        l[32] || (l[32] = k("Expected format", -1)),
        z(e("input", {
          "onUpdate:modelValue": l[11] || (l[11] = (t) => a.field.expected_format = t),
          placeholder: h(Ye)(a.field)
        }, null, 8, Dl), [
          [J, a.field.expected_format]
        ])
      ])) : f("", !0),
      e("div", zl, [
        l[33] || (l[33] = e("span", null, [
          k("Required"),
          e("small", null, "A run reports this field as missing when no value is found.")
        ], -1)),
        r(O, {
          modelValue: a.field.required,
          "onUpdate:modelValue": l[12] || (l[12] = (t) => a.field.required = t),
          label: "Required",
          disabled: a.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", Fl, [
        l[34] || (l[34] = e("span", null, [
          k("Evidence required"),
          e("small", null, "The value must cite a quote from the document.")
        ], -1)),
        r(O, {
          modelValue: a.field.evidence_required,
          "onUpdate:modelValue": l[13] || (l[13] = (t) => a.field.evidence_required = t),
          label: "Evidence required",
          disabled: a.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      a.readonly ? f("", !0) : (s(), o("button", {
        key: 6,
        type: "button",
        class: "btn danger-text",
        onClick: l[14] || (l[14] = (t) => u("remove"))
      }, "Remove field"))
    ], 8, yl));
  }
}), Ol = ["value", "capability", "aria-labelledby"], Pl = {
  key: 1,
  class: "dz-error",
  role: "alert"
}, Ll = {
  key: 2,
  class: "dz-muted",
  role: "status"
}, H = /* @__PURE__ */ W({
  __name: "ModelPicker",
  props: {
    value: {},
    capability: {},
    labelledBy: {}
  },
  emits: ["select"],
  setup(a, { emit: v }) {
    const n = v, u = B(!!customElements.get("wc-model-picker")), m = B("");
    ge(async () => {
      if (!u.value)
        try {
          await Be("wc-model-picker", { timeoutMs: 8e3 }), u.value = !0;
        } catch (x) {
          m.value = x instanceof Error ? x.message : String(x);
        }
    });
    function V(x) {
      const g = x.detail;
      typeof g == "string" && n("select", g);
    }
    return (x, g) => u.value ? (s(), o("wc-model-picker", {
      key: 0,
      value: a.value,
      capability: a.capability,
      "aria-labelledby": a.labelledBy,
      onSelect: V
    }, null, 40, Ol)) : m.value ? (s(), o("p", Pl, "Could not load model picker: " + i(m.value), 1)) : (s(), o("span", Ll, "Loading models…"));
  }
}), Il = { class: "slider" }, Wl = { class: "slider-head" }, jl = { class: "slider-value" }, Ql = ["aria-label", "aria-valuetext", "disabled"], Jl = {
  key: 0,
  class: "slider-hints"
}, Kl = { key: 1 }, le = 1e3, I = /* @__PURE__ */ W({
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
  setup(a) {
    const v = a, n = re(a, "modelValue"), u = M(() => v.percent ? `${Math.round(n.value * 100)}%` : `${n.value.toLocaleString()}${v.unit ? ` ${v.unit}` : ""}`), m = (g) => v.log ? Math.log(g / v.min) / Math.log(v.max / v.min) * le : (g - v.min) / (v.max - v.min) * le;
    function V(g) {
      const N = v.log ? v.min * Math.pow(v.max / v.min, g / le) : v.min + (v.max - v.min) * g / le, w = Math.round(N / v.step) * v.step;
      return Math.min(v.max, Math.max(v.min, Number(w.toFixed(4))));
    }
    const x = M({ get: () => Math.round(m(n.value)), set: (g) => {
      n.value = V(g);
    } });
    return (g, N) => (s(), o("div", Il, [
      e("div", Wl, [
        e("span", null, i(a.label), 1),
        e("output", jl, i(u.value), 1)
      ]),
      z(e("input", {
        "onUpdate:modelValue": N[0] || (N[0] = (w) => x.value = w),
        type: "range",
        min: "0",
        max: le,
        step: "1",
        "aria-label": a.label,
        "aria-valuetext": u.value,
        disabled: a.disabled,
        style: ae({ "--fill": `${x.value / le * 100}%` })
      }, null, 12, Ql), [
        [
          J,
          x.value,
          void 0,
          { number: !0 }
        ]
      ]),
      a.hints ? (s(), o("div", Jl, [
        e("span", null, i(a.hints[0]), 1),
        e("span", null, i(a.hints[1]), 1)
      ])) : f("", !0),
      a.note ? (s(), o("small", Kl, i(a.note), 1)) : f("", !0)
    ]));
  }
}), Hl = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, Gl = { class: "fd-track" }, Xl = { class: "fd-node" }, Yl = { class: "fd-dots" }, Zl = { class: "fd-more" }, _l = { class: "fd-node goal" }, et = /* @__PURE__ */ W({
  __name: "ScoutDiagram",
  props: {
    rounds: {},
    confidence: {},
    extra: {}
  },
  setup(a) {
    const v = a;
    return (n, u) => (s(), o("figure", Hl, [
      e("div", Gl, [
        u[2] || (u[2] = e("span", { class: "fd-node solid" }, "Pass", -1)),
        (s(!0), o(S, null, E(Math.min(v.rounds, 8), (m) => (s(), o(S, { key: m }, [
          u[0] || (u[0] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Xl, [
            e("span", null, "R" + i(m), 1),
            e("span", Yl, [
              (s(!0), o(S, null, E(Math.min(v.extra, 6), (V) => (s(), o("i", { key: V }))), 128))
            ])
          ])
        ], 64))), 128)),
        v.rounds > 8 ? (s(), o(S, { key: 0 }, [
          u[1] || (u[1] = e("span", { class: "fd-link" }, null, -1)),
          e("span", Zl, "+" + i(v.rounds - 8), 1)
        ], 64)) : f("", !0),
        u[3] || (u[3] = e("span", { class: "fd-link" }, null, -1)),
        e("span", _l, "≥ " + i(Math.round(v.confidence * 100)) + "%", 1)
      ]),
      e("figcaption", null, i(v.rounds ? `One pass, then up to ${v.rounds} rounds with up to ${v.extra} new queries each, stopping as soon as confidence reaches ${Math.round(v.confidence * 100)}%.` : "One pass only; no follow-up rounds."), 1)
    ]));
  }
}), lt = {
  class: "diagram flow-diagram",
  "aria-hidden": "true"
}, tt = { class: "fd-grid" }, at = { class: "fd-node solid" }, nt = { class: "fd-node" }, st = { class: "fd-node" }, ot = { class: "fd-node goal" }, it = /* @__PURE__ */ W({
  __name: "DeepDiagram",
  props: {
    fields: {},
    parallel: {},
    queries: {},
    perQuery: {},
    cap: {}
  },
  setup(a) {
    const v = a, n = M(() => Math.min(v.queries * v.perQuery, v.cap));
    return (u, m) => (s(), o("figure", lt, [
      e("div", tt, [
        e("span", at, [
          e("b", null, i(a.fields), 1),
          k(" field" + i(a.fields === 1 ? "" : "s"), 1),
          e("small", null, i(a.parallel) + " at a time", 1)
        ]),
        e("span", nt, [
          e("b", null, i(a.queries), 1),
          m[0] || (m[0] = k(" queries", -1)),
          m[1] || (m[1] = e("small", null, "per field", -1))
        ]),
        e("span", st, [
          e("b", null, i(a.perQuery), 1),
          m[2] || (m[2] = k(" chunks", -1)),
          m[3] || (m[3] = e("small", null, "per query", -1))
        ]),
        e("span", ot, [
          e("b", null, i(n.value), 1),
          m[4] || (m[4] = k(" chunks", -1)),
          e("small", null, i(a.queries * a.perQuery > a.cap ? `capped at ${a.cap}` : "read per field"), 1)
        ])
      ]),
      e("figcaption", null, "Each deep field gets its own queries; up to " + i(n.value) + " chunks are read for it before analysis.", 1)
    ]));
  }
}), dt = ["disabled"], ut = { class: "muted" }, rt = { class: "toggle-row" }, ct = { class: "label-block" }, mt = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "outline-label"
}, vt = ["aria-checked"], bt = ["aria-checked"], pt = { class: "toggle-row" }, yt = {
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
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, Mt = ["aria-checked"], Nt = ["aria-checked"], Et = {
  id: "model-scout",
  class: "model-role"
}, Bt = { class: "toggle-row" }, Tt = { class: "toggle-row" }, Rt = { class: "mono" }, Dt = { class: "toggle-row" }, zt = { class: "label-block" }, Ft = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "read-label"
}, At = ["aria-checked"], Ot = ["aria-checked"], Pt = {
  id: "model-deep",
  class: "model-role"
}, Lt = {
  id: "model-deep-query",
  class: "model-role"
}, It = {
  id: "model-extract",
  class: "model-role"
}, Wt = { class: "output-list" }, jt = { class: "chip" }, Qt = {
  key: 0,
  class: "muted"
}, Jt = { class: "toggle-row" }, Kt = { class: "toggle-row" }, Ht = { class: "toggle-row" }, Gt = { class: "toggle-row" }, Xt = {
  id: "model-verify",
  class: "model-role"
}, Yt = /* @__PURE__ */ W({
  __name: "StepInspector",
  props: {
    stage: {},
    config: {},
    readonly: { type: Boolean }
  },
  setup(a) {
    const v = a, n = M(() => v.config.stages), u = (w) => ll(v.stage, w), m = Ze(), V = M(() => v.config.fields.filter((w) => w.strategy === "deep").length), x = M(() => v.config.fields.filter((w) => w.search_within === "sections").map((w) => w.name || "New field")), g = M(() => Te(v.config));
    function N(w, l) {
      const t = n.value.scout.tools.filter(($) => $ !== w);
      n.value.scout.tools = l ? [...t, w] : t;
    }
    return (w, l) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: a.readonly
    }, [
      e("p", ut, i(h(_e)[a.stage]), 1),
      a.stage === "map" ? (s(), o(S, { key: 0 }, [
        e("div", rt, [
          l[37] || (l[37] = e("span", null, "Stage enabled", -1)),
          r(O, {
            modelValue: n.value.map.enabled,
            "onUpdate:modelValue": l[0] || (l[0] = (t) => n.value.map.enabled = t),
            label: "Enable step",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", ct, [
          l[38] || (l[38] = e("span", { id: "outline-label" }, "Outline", -1)),
          e("div", mt, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.map.outline === "find_or_build",
              onClick: l[1] || (l[1] = (t) => n.value.map.outline = "find_or_build")
            }, "Use contents first", 8, vt),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.map.outline === "build",
              onClick: l[2] || (l[2] = (t) => n.value.map.outline = "build")
            }, "Always build", 8, bt)
          ]),
          l[39] || (l[39] = e("small", null, "The document's own headings are used when it has them; otherwise the model builds an outline.", -1))
        ]),
        e("div", pt, [
          l[40] || (l[40] = e("span", null, [
            k("Section summaries"),
            e("small", null, "A short summary per section helps pick the right sections in long documents.")
          ], -1)),
          r(O, {
            modelValue: n.value.map.section_summaries,
            "onUpdate:modelValue": l[3] || (l[3] = (t) => n.value.map.section_summaries = t),
            label: "Section summaries",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[42] || (l[42] = e("h4", null, "Models", -1)),
        e("div", yt, [
          l[41] || (l[41] = e("span", null, "Outliner", -1)),
          r(H, {
            value: n.value.map.model,
            capability: "generate",
            "labelled-by": "model-map",
            onSelect: l[4] || (l[4] = (t) => n.value.map.model = t)
          }, null, 8, ["value"])
        ]),
        l[43] || (l[43] = e("h4", null, "Fields that read sections", -1)),
        x.value.length ? (s(), o("p", ft, [
          (s(!0), o(S, null, E(x.value, (t) => (s(), o("span", {
            key: t,
            class: "chip primary"
          }, i(t), 1))), 128))
        ])) : (s(), o("p", gt, 'None. Set "Search within" on a field to read only the sections Map picks for it.'))
      ], 64)) : f("", !0),
      a.stage === "prefetch" ? (s(), o(S, { key: 1 }, [
        e("div", ht, [
          l[44] || (l[44] = e("span", null, "Stage enabled", -1)),
          r(O, {
            modelValue: n.value.prefetch.enabled,
            "onUpdate:modelValue": l[5] || (l[5] = (t) => n.value.prefetch.enabled = t),
            label: "Enable step",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        l[48] || (l[48] = e("h4", null, "Queries", -1)),
        (s(!0), o(S, null, E(n.value.prefetch.queries, (t, $) => (s(), o("div", {
          key: $,
          class: "query-row"
        }, [
          e("div", kt, [
            e("label", null, [
              l[45] || (l[45] = k("Name", -1)),
              z(e("input", {
                "onUpdate:modelValue": (b) => t.name = b,
                placeholder: "Parties"
              }, null, 8, $t), [
                [J, t.name]
              ])
            ]),
            e("label", null, [
              l[46] || (l[46] = k("Chunks", -1)),
              z(e("input", {
                "onUpdate:modelValue": (b) => t.chunks = b,
                type: "number",
                min: "1",
                max: "1000"
              }, null, 8, xt), [
                [
                  J,
                  t.chunks,
                  void 0,
                  { number: !0 }
                ]
              ])
            ])
          ]),
          e("label", null, [
            l[47] || (l[47] = k("Query", -1)),
            z(e("textarea", {
              "onUpdate:modelValue": (b) => t.query = b,
              rows: "2",
              placeholder: "Who signed the agreement and on whose behalf"
            }, null, 8, wt), [
              [J, t.query]
            ])
          ]),
          a.readonly ? f("", !0) : (s(), o("button", {
            key: 0,
            type: "button",
            class: "btn subtle",
            onClick: (b) => n.value.prefetch.queries.splice($, 1)
          }, "Remove query", 8, Vt))
        ]))), 128)),
        n.value.prefetch.queries.length ? f("", !0) : (s(), o("p", St, "No fixed queries. Field search hints still run.")),
        a.readonly ? f("", !0) : (s(), o("button", {
          key: 1,
          type: "button",
          class: "btn",
          onClick: l[6] || (l[6] = (t) => n.value.prefetch.queries.push(h(el)()))
        }, "Add query"))
      ], 64)) : f("", !0),
      a.stage === "scout" ? (s(), o(S, { key: 2 }, [
        e("div", Ct, [
          l[49] || (l[49] = e("span", null, "Stage enabled", -1)),
          r(O, {
            modelValue: n.value.scout.enabled,
            "onUpdate:modelValue": l[7] || (l[7] = (t) => n.value.scout.enabled = t),
            label: "Enable step",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", qt, [
          l[50] || (l[50] = e("span", { id: "mode-label" }, "Mode", -1)),
          e("div", Ut, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.scout.mode === "loop",
              onClick: l[8] || (l[8] = (t) => n.value.scout.mode = "loop")
            }, "Structured loop", 8, Mt),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.scout.mode === "agent",
              onClick: l[9] || (l[9] = (t) => n.value.scout.mode = "agent")
            }, "Agent", 8, Nt)
          ]),
          e("small", null, i(n.value.scout.mode === "loop" ? "Each round the model rates the evidence, drops noise and proposes queries; the engine runs them." : "The model reads the document itself with the tools below, following references until confident."), 1)
        ]),
        r(et, {
          rounds: n.value.scout.max_rounds,
          confidence: n.value.scout.target_confidence,
          extra: n.value.scout.max_extra_queries
        }, null, 8, ["rounds", "confidence", "extra"]),
        l[55] || (l[55] = e("h4", null, "Models", -1)),
        e("div", Et, [
          l[51] || (l[51] = e("span", null, "Scout", -1)),
          r(H, {
            value: n.value.scout.model,
            capability: "generate",
            "labelled-by": "model-scout",
            onSelect: l[10] || (l[10] = (t) => n.value.scout.model = t)
          }, null, 8, ["value"])
        ]),
        l[56] || (l[56] = e("h4", null, "Loop", -1)),
        r(I, {
          modelValue: n.value.scout.max_rounds,
          "onUpdate:modelValue": l[11] || (l[11] = (t) => n.value.scout.max_rounds = t),
          label: "Follow-up rounds",
          min: u("max_rounds").min,
          max: u("max_rounds").max,
          hints: ["Single pass", "Thorough"],
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.scout.target_confidence,
          "onUpdate:modelValue": l[12] || (l[12] = (t) => n.value.scout.target_confidence = t),
          label: "Stop at confidence",
          min: u("target_confidence").min,
          max: u("target_confidence").max,
          step: 0.05,
          percent: "",
          hints: ["Stop early", "Keep looking"],
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.scout.max_extra_queries,
          "onUpdate:modelValue": l[13] || (l[13] = (t) => n.value.scout.max_extra_queries = t),
          label: n.value.scout.mode === "agent" ? "Tool calls per round" : "New queries per round",
          min: u("max_extra_queries").min,
          max: u("max_extra_queries").max,
          disabled: a.readonly
        }, null, 8, ["modelValue", "label", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.scout.max_tokens,
          "onUpdate:modelValue": l[14] || (l[14] = (t) => n.value.scout.max_tokens = t),
          label: "Scout output limit",
          min: u("max_tokens").min,
          max: u("max_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Bt, [
          l[52] || (l[52] = e("span", null, [
            k("Drop noisy chunks"),
            e("small", null, "Chunks the scout judges irrelevant leave the evidence pool.")
          ], -1)),
          r(O, {
            modelValue: n.value.scout.drop_noise,
            "onUpdate:modelValue": l[15] || (l[15] = (t) => n.value.scout.drop_noise = t),
            label: "Drop noisy chunks",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Tt, [
          l[53] || (l[53] = e("span", null, [
            k("Share scout notes with extraction"),
            e("small", null, "Extraction sees what the scout learned.")
          ], -1)),
          r(O, {
            modelValue: n.value.scout.share_notes,
            "onUpdate:modelValue": l[16] || (l[16] = (t) => n.value.scout.share_notes = t),
            label: "Share scout notes with extraction",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.scout.mode === "agent" ? (s(), o(S, { key: 0 }, [
          l[54] || (l[54] = e("h4", null, "Agent tools", -1)),
          (s(!0), o(S, null, E(h(m), (t) => (s(), o("div", {
            key: t,
            class: "toggle-row"
          }, [
            e("span", null, [
              k(i(h(pe)(t)), 1),
              e("small", Rt, i(t), 1)
            ]),
            r(O, {
              "model-value": n.value.scout.tools.includes(t),
              label: h(pe)(t),
              disabled: a.readonly,
              "onUpdate:modelValue": ($) => N(t, $)
            }, null, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])
          ]))), 128))
        ], 64)) : f("", !0)
      ], 64)) : f("", !0),
      a.stage === "deep" ? (s(), o(S, { key: 3 }, [
        e("div", Dt, [
          l[57] || (l[57] = e("span", null, "Stage enabled", -1)),
          r(O, {
            modelValue: n.value.deep.enabled,
            "onUpdate:modelValue": l[17] || (l[17] = (t) => n.value.deep.enabled = t),
            label: "Enable step",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        r(it, {
          fields: V.value,
          parallel: n.value.deep.parallel_fields,
          queries: n.value.deep.max_queries,
          "per-query": n.value.deep.chunks_per_query,
          cap: n.value.deep.chunk_cap
        }, null, 8, ["fields", "parallel", "queries", "per-query", "cap"]),
        e("div", zt, [
          l[58] || (l[58] = e("span", { id: "read-label" }, "Reads", -1)),
          e("div", Ft, [
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.deep.read === "chunks",
              onClick: l[18] || (l[18] = (t) => n.value.deep.read = "chunks")
            }, "Retrieved chunks", 8, At),
            e("button", {
              type: "button",
              role: "radio",
              "aria-checked": n.value.deep.read === "sections",
              onClick: l[19] || (l[19] = (t) => n.value.deep.read = "sections")
            }, "Whole sections", 8, Ot)
          ]),
          l[59] || (l[59] = e("small", null, "Whole sections suit clauses that span many passages; long sections fall back to chunks.", -1))
        ]),
        l[62] || (l[62] = e("h4", null, "Models", -1)),
        e("div", Pt, [
          l[60] || (l[60] = e("span", null, "Analysis", -1)),
          r(H, {
            value: n.value.deep.model,
            capability: "generate",
            "labelled-by": "model-deep",
            onSelect: l[20] || (l[20] = (t) => n.value.deep.model = t)
          }, null, 8, ["value"])
        ]),
        e("div", Lt, [
          l[61] || (l[61] = e("span", null, "Query writer", -1)),
          r(H, {
            value: n.value.deep.query_model,
            capability: "generate",
            "labelled-by": "model-deep-query",
            onSelect: l[21] || (l[21] = (t) => n.value.deep.query_model = t)
          }, null, 8, ["value"])
        ]),
        l[63] || (l[63] = e("h4", null, "Reach", -1)),
        r(I, {
          modelValue: n.value.deep.parallel_fields,
          "onUpdate:modelValue": l[22] || (l[22] = (t) => n.value.deep.parallel_fields = t),
          label: "Fields at a time",
          min: u("parallel_fields").min,
          max: u("parallel_fields").max,
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.deep.max_queries,
          "onUpdate:modelValue": l[23] || (l[23] = (t) => n.value.deep.max_queries = t),
          label: "Queries per field",
          min: u("max_queries").min,
          max: u("max_queries").max,
          log: "",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.deep.chunks_per_query,
          "onUpdate:modelValue": l[24] || (l[24] = (t) => n.value.deep.chunks_per_query = t),
          label: "Chunks per query",
          min: u("chunks_per_query").min,
          max: u("chunks_per_query").max,
          log: "",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.deep.chunk_cap,
          "onUpdate:modelValue": l[25] || (l[25] = (t) => n.value.deep.chunk_cap = t),
          label: "Chunk cap per field",
          min: u("chunk_cap").min,
          max: u("chunk_cap").max,
          log: "",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.deep.min_similarity,
          "onUpdate:modelValue": l[26] || (l[26] = (t) => n.value.deep.min_similarity = t),
          label: "Minimum similarity",
          min: u("min_similarity").min,
          max: u("min_similarity").max,
          step: 0.05,
          percent: "",
          hints: ["Loose", "Strict"],
          note: "Chunks less similar than this are skipped.",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        l[64] || (l[64] = e("h4", null, "Temperature", -1)),
        r(I, {
          modelValue: n.value.deep.query_temperature,
          "onUpdate:modelValue": l[27] || (l[27] = (t) => n.value.deep.query_temperature = t),
          label: "Query writing",
          min: u("query_temperature").min,
          max: u("query_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        r(I, {
          modelValue: n.value.deep.analysis_temperature,
          "onUpdate:modelValue": l[28] || (l[28] = (t) => n.value.deep.analysis_temperature = t),
          label: "Analysis",
          min: u("analysis_temperature").min,
          max: u("analysis_temperature").max,
          step: 0.1,
          hints: ["Precise", "Varied"],
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"])
      ], 64)) : f("", !0),
      a.stage === "extract" ? (s(), o(S, { key: 4 }, [
        l[67] || (l[67] = e("h4", null, "Models", -1)),
        e("div", It, [
          l[65] || (l[65] = e("span", null, "Extraction", -1)),
          r(H, {
            value: n.value.extract.model,
            capability: "generate",
            "labelled-by": "model-extract",
            onSelect: l[29] || (l[29] = (t) => n.value.extract.model = t)
          }, null, 8, ["value"])
        ]),
        l[68] || (l[68] = e("h4", null, "Field groups", -1)),
        e("ul", Wt, [
          (s(!0), o(S, null, E(g.value, (t) => (s(), o("li", {
            key: t.name
          }, [
            e("span", null, i(t.name), 1),
            e("span", jt, i(t.fields.length) + " field" + i(t.fields.length === 1 ? "" : "s"), 1)
          ]))), 128))
        ]),
        g.value.length ? f("", !0) : (s(), o("p", Qt, "No fields yet.")),
        r(I, {
          modelValue: n.value.extract.max_fields_per_call,
          "onUpdate:modelValue": l[30] || (l[30] = (t) => n.value.extract.max_fields_per_call = t),
          label: "Fields per call",
          min: u("max_fields_per_call").min,
          max: u("max_fields_per_call").max,
          disabled: a.readonly,
          note: `${h(Me)(a.config)} extraction call${h(Me)(a.config) === 1 ? "" : "s"} per document. Groups larger than this are split.`
        }, null, 8, ["modelValue", "min", "max", "disabled", "note"]),
        r(I, {
          modelValue: n.value.extract.max_output_tokens,
          "onUpdate:modelValue": l[31] || (l[31] = (t) => n.value.extract.max_output_tokens = t),
          label: "Output limit",
          min: u("max_output_tokens").min,
          max: u("max_output_tokens").max,
          log: "",
          step: 64,
          unit: "tokens",
          disabled: a.readonly
        }, null, 8, ["modelValue", "min", "max", "disabled"]),
        e("div", Jt, [
          l[66] || (l[66] = e("span", null, [
            k("Structured output"),
            e("small", null, "The model returns JSON matching the field schema.")
          ], -1)),
          r(O, {
            modelValue: n.value.extract.structured_output,
            "onUpdate:modelValue": l[32] || (l[32] = (t) => n.value.extract.structured_output = t),
            label: "Structured output",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ])
      ], 64)) : f("", !0),
      a.stage === "verify" ? (s(), o(S, { key: 5 }, [
        e("div", Kt, [
          l[69] || (l[69] = e("span", null, "Stage enabled", -1)),
          r(O, {
            modelValue: n.value.verify.enabled,
            "onUpdate:modelValue": l[33] || (l[33] = (t) => n.value.verify.enabled = t),
            label: "Enable step",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Ht, [
          l[70] || (l[70] = e("span", null, [
            k("Quotes exist"),
            e("small", null, "Each quote is matched against the document text. No model call.")
          ], -1)),
          r(O, {
            modelValue: n.value.verify.check_quotes,
            "onUpdate:modelValue": l[34] || (l[34] = (t) => n.value.verify.check_quotes = t),
            label: "Quotes exist",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        e("div", Gt, [
          l[71] || (l[71] = e("span", null, [
            k("Quotes support values"),
            e("small", null, "A model confirms each quote supports its value.")
          ], -1)),
          r(O, {
            modelValue: n.value.verify.check_support,
            "onUpdate:modelValue": l[35] || (l[35] = (t) => n.value.verify.check_support = t),
            label: "Quotes support values",
            disabled: a.readonly
          }, null, 8, ["modelValue", "disabled"])
        ]),
        n.value.verify.check_support ? (s(), o(S, { key: 0 }, [
          l[73] || (l[73] = e("h4", null, "Models", -1)),
          e("div", Xt, [
            l[72] || (l[72] = e("span", null, "Checker", -1)),
            r(H, {
              value: n.value.verify.model,
              capability: "generate",
              "labelled-by": "model-verify",
              onSelect: l[36] || (l[36] = (t) => n.value.verify.model = t)
            }, null, 8, ["value"])
          ])
        ], 64)) : f("", !0)
      ], 64)) : f("", !0)
    ], 8, dt));
  }
}), Zt = {
  class: "diagram chunk-diagram",
  "aria-hidden": "true"
}, _t = {
  viewBox: "0 0 100 34",
  preserveAspectRatio: "none"
}, ea = ["x", "y", "width"], la = ["x", "width"], ta = /* @__PURE__ */ W({
  __name: "ChunkDiagram",
  props: {
    size: {},
    overlap: {}
  },
  setup(a) {
    const v = a, n = M(() => Math.min(0.9, Math.max(0, v.overlap / v.size))), u = M(() => {
      const m = 100 / (3 - 2 * n.value);
      return [0, 1, 2].map((V) => ({ x: V * m * (1 - n.value), w: m }));
    });
    return (m, V) => (s(), o("figure", Zt, [
      (s(), o("svg", _t, [
        (s(!0), o(S, null, E(u.value, (x, g) => (s(), o("rect", {
          key: g,
          x: x.x,
          y: g % 2 ? 14 : 4,
          width: x.w,
          height: "14",
          rx: "2",
          class: "chunk"
        }, null, 8, ea))), 128)),
        (s(), o(S, null, E([1, 2], (x) => e("rect", {
          key: "o" + x,
          x: u.value[x].x,
          y: 4,
          width: u.value[x - 1].x + u.value[x - 1].w - u.value[x].x,
          height: "24",
          class: "shared"
        }, null, 8, la)), 64))
      ])),
      e("figcaption", null, i(a.size.toLocaleString()) + " tokens per chunk · " + i(a.overlap.toLocaleString()) + " shared with the next (" + i(Math.round(n.value * 100)) + "%)", 1)
    ]));
  }
}), aa = ["disabled"], na = { class: "muted" }, sa = { class: "toggle-row" }, oa = { class: "toggle-row" }, ia = { class: "label-block" }, da = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "context-label"
}, ua = ["aria-checked", "onClick"], ra = {
  key: 0,
  id: "context-model",
  class: "model-role"
}, ca = { class: "label-block" }, ma = {
  class: "segmented",
  role: "radiogroup",
  "aria-labelledby": "mode-label"
}, va = ["aria-checked", "onClick"], ba = {
  id: "embedding-model",
  class: "model-role"
}, pa = { class: "toggle-row" }, ya = {
  key: 1,
  id: "highlighter-model",
  class: "model-role"
}, fa = /* @__PURE__ */ W({
  __name: "DocumentInspector",
  props: {
    config: {},
    retention: {},
    readonly: { type: Boolean }
  },
  setup(a) {
    const v = a, n = M(() => v.config.retrieval), u = [{ value: "keyword", label: "Keyword", note: "Exact words and numbers" }, { value: "semantic", label: "Semantic", note: "Meaning, even with other wording" }, { value: "hybrid", label: "Hybrid", note: "Both, merged by rank" }], m = [{ value: "none", label: "None", note: "Chunks are embedded as they are." }, { value: "headings", label: "Headings", note: 'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.' }, { value: "generated", label: "Generated", note: "A model writes one or two sentences placing each chunk in the document before it is embedded. One call per chunk, cached with the processed document." }], V = ie("chunk_size"), x = ie("overlap"), g = ie("top_results"), N = ie("section_budget"), w = M(() => Math.min(x.max, n.value.chunk_size - 50));
    return (l, t) => (s(), o("fieldset", {
      class: "inspector-form",
      disabled: a.readonly
    }, [
      e("p", na, "The upload's text is split into chunks and indexed once per document and settings; processed copies expire after " + i(a.retention) + ".", 1),
      t[18] || (t[18] = e("h4", null, "Chunks", -1)),
      r(ta, {
        size: n.value.chunk_size,
        overlap: n.value.overlap
      }, null, 8, ["size", "overlap"]),
      r(I, {
        modelValue: n.value.chunk_size,
        "onUpdate:modelValue": t[0] || (t[0] = ($) => n.value.chunk_size = $),
        label: "Chunk size",
        min: h(V).min,
        max: h(V).max,
        step: 50,
        log: "",
        unit: "tokens",
        hints: ["Precise", "More context"],
        disabled: a.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      r(I, {
        modelValue: n.value.overlap,
        "onUpdate:modelValue": t[1] || (t[1] = ($) => n.value.overlap = $),
        label: "Overlap",
        min: h(x).min,
        max: w.value,
        step: 10,
        unit: "tokens",
        disabled: a.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      e("div", sa, [
        t[10] || (t[10] = e("span", null, [
          k("Split by headings"),
          e("small", null, "A chunk never crosses a heading.")
        ], -1)),
        r(O, {
          modelValue: n.value.split_headings,
          "onUpdate:modelValue": t[2] || (t[2] = ($) => n.value.split_headings = $),
          label: "Split by headings",
          disabled: a.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      e("div", oa, [
        t[11] || (t[11] = e("span", null, [
          k("Keep tables whole"),
          e("small", null, "Table rows stay together in one chunk up to the chunk size.")
        ], -1)),
        r(O, {
          modelValue: n.value.keep_tables,
          "onUpdate:modelValue": t[3] || (t[3] = ($) => n.value.keep_tables = $),
          label: "Keep tables whole",
          disabled: a.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      r(I, {
        modelValue: n.value.section_budget,
        "onUpdate:modelValue": t[4] || (t[4] = ($) => n.value.section_budget = $),
        label: "Section budget",
        min: h(N).min,
        max: h(N).max,
        step: 100,
        log: "",
        unit: "tokens",
        note: "Sections longer than this are read as chunks instead.",
        disabled: a.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t[19] || (t[19] = e("h4", null, "Context", -1)),
      e("div", ia, [
        t[12] || (t[12] = e("span", { id: "context-label" }, "Chunk context", -1)),
        e("div", da, [
          (s(), o(S, null, E(m, ($) => e("button", {
            key: $.value,
            type: "button",
            role: "radio",
            "aria-checked": n.value.context === $.value,
            onClick: (b) => n.value.context = $.value
          }, i($.label), 9, ua)), 64))
        ]),
        e("small", null, i(m.find(($) => $.value === n.value.context)?.note), 1)
      ]),
      n.value.context === "generated" ? (s(), o("div", ra, [
        t[13] || (t[13] = e("span", null, "Context writer", -1)),
        r(H, {
          value: n.value.context_model,
          capability: "generate",
          "labelled-by": "context-model",
          onSelect: t[5] || (t[5] = ($) => n.value.context_model = $)
        }, null, 8, ["value"])
      ])) : f("", !0),
      t[20] || (t[20] = e("h4", null, "Search", -1)),
      e("div", ca, [
        t[14] || (t[14] = e("span", { id: "mode-label" }, "Search mode", -1)),
        e("div", ma, [
          (s(), o(S, null, E(u, ($) => e("button", {
            key: $.value,
            type: "button",
            role: "radio",
            "aria-checked": n.value.search_mode === $.value,
            onClick: (b) => n.value.search_mode = $.value
          }, i($.label), 9, va)), 64))
        ]),
        e("small", null, i(u.find(($) => $.value === n.value.search_mode)?.note), 1)
      ]),
      r(I, {
        modelValue: n.value.top_results,
        "onUpdate:modelValue": t[6] || (t[6] = ($) => n.value.top_results = $),
        label: "Results per query",
        min: h(g).min,
        max: h(g).max,
        disabled: a.readonly
      }, null, 8, ["modelValue", "min", "max", "disabled"]),
      t[21] || (t[21] = e("h4", null, "Models", -1)),
      e("div", ba, [
        t[15] || (t[15] = e("span", null, "Embedding", -1)),
        r(H, {
          value: n.value.embedding_model,
          capability: "embed",
          "labelled-by": "embedding-model",
          onSelect: t[7] || (t[7] = ($) => n.value.embedding_model = $)
        }, null, 8, ["value"])
      ]),
      e("div", pa, [
        t[16] || (t[16] = e("span", null, [
          k("Highlighter"),
          e("small", null, "A small model marks what each field needs before extraction.")
        ], -1)),
        r(O, {
          modelValue: n.value.highlighter,
          "onUpdate:modelValue": t[8] || (t[8] = ($) => n.value.highlighter = $),
          label: "Highlighter",
          disabled: a.readonly
        }, null, 8, ["modelValue", "disabled"])
      ]),
      n.value.highlighter ? (s(), o("div", ya, [
        t[17] || (t[17] = e("span", null, "Highlighter", -1)),
        r(H, {
          value: n.value.highlighter_model,
          capability: "generate",
          "labelled-by": "highlighter-model",
          onSelect: t[9] || (t[9] = ($) => n.value.highlighter_model = $)
        }, null, 8, ["value"])
      ])) : f("", !0)
    ], 8, aa));
  }
}), ga = { class: "canvas" }, ha = { class: "canvas-inner" }, ka = {
  class: "block",
  "aria-labelledby": "fields-head"
}, $a = { class: "block-head" }, xa = ["aria-expanded"], wa = { class: "count" }, Va = {
  key: 0,
  class: "block-peek"
}, Sa = {
  id: "fields-body",
  class: "block-body"
}, Ca = {
  key: 0,
  class: "block-empty"
}, qa = {
  key: 1,
  class: "rows"
}, Ua = ["onClick"], Ma = { class: "row-name" }, Na = {
  key: 0,
  class: "req",
  title: "Required"
}, Ea = { class: "chips" }, Ba = {
  key: 1,
  class: "chip"
}, Ta = ["title"], Ra = { class: "chip" }, Da = {
  key: 3,
  class: "chip",
  title: "Evidence required"
}, za = {
  key: 0,
  class: "row-actions"
}, Fa = ["disabled", "onClick"], Aa = ["disabled", "onClick"], Oa = {
  class: "block",
  "aria-labelledby": "flow-head"
}, Pa = { class: "block-head" }, La = ["aria-expanded"], Ia = { class: "count" }, Wa = {
  key: 0,
  class: "block-peek"
}, ja = {
  id: "flow-body",
  class: "flow",
  "aria-label": "Extraction flow"
}, Qa = { class: "node-icon" }, Ja = { class: "node-main" }, Ka = { class: "node-summary" }, Ha = { class: "node-side" }, Ga = { class: "chip model" }, Xa = { class: "branches" }, Ya = { class: "branch" }, Za = { class: "branch" }, _a = { class: "node-icon" }, en = { class: "node-main" }, ln = { class: "node-summary" }, tn = ["aria-valuenow"], an = { class: "side-panel-head" }, nn = { class: "side-panel-icon" }, sn = ["disabled"], on = {
  key: 4,
  class: "inspector-form"
}, dn = { class: "output-list" }, un = { class: "mono" }, rn = { class: "chip" }, cn = { class: "rail-label" }, ve = 400, ue = 320, mn = /* @__PURE__ */ W({
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
  setup(a) {
    const v = a, n = re(a, "title"), u = re(a, "description"), m = B({ kind: "document" });
    function V(p, d) {
      try {
        const U = localStorage.getItem(`docscout.${p}`);
        return U === null ? d : U === "1";
      } catch {
        return d;
      }
    }
    function x(p, d) {
      try {
        localStorage.setItem(`docscout.${p}`, d ? "1" : "0");
      } catch {
      }
    }
    const g = B(V("panel", !0)), N = B(V("fields", !0)), w = B(V("flow", !0));
    function l() {
      try {
        const p = Number(localStorage.getItem("docscout.panelWidth"));
        return p >= ue ? p : ve;
      } catch {
        return ve;
      }
    }
    const t = B(l()), $ = () => {
      const p = R.value?.clientWidth;
      return p ? Math.max(ue, p - 420) : Number.POSITIVE_INFINITY;
    };
    function b(p, d = !0) {
      if (t.value = Math.round(Math.min($(), Math.max(ue, p))), d)
        try {
          localStorage.setItem("docscout.panelWidth", String(t.value));
        } catch {
        }
    }
    const C = B(!1);
    function Q(p) {
      const d = p.currentTarget, U = p.clientX, j = t.value;
      d.setPointerCapture(p.pointerId), C.value = !0;
      const Y = (Qe) => b(j + (U - Qe.clientX), !1), Ce = () => {
        C.value = !1, b(t.value), d.removeEventListener("pointermove", Y), d.removeEventListener("pointerup", Ce);
      };
      d.addEventListener("pointermove", Y), d.addEventListener("pointerup", Ce);
    }
    function ne(p) {
      p.key === "ArrowLeft" ? (b(t.value + 24), p.preventDefault()) : p.key === "ArrowRight" && (b(t.value - 24), p.preventDefault());
    }
    function D(p) {
      g.value = p, L.value || x("panel", p);
    }
    function F(p) {
      const d = p === "fields" ? N : w;
      d.value = !d.value, x(p, d.value);
    }
    const R = B(), L = B(!1);
    let X;
    ge(() => {
      X = new ResizeObserver(([p]) => {
        const d = L.value;
        L.value = p.contentRect.width < 1e3, L.value && !d && (g.value = !1), !L.value && d && (g.value = V("panel", !0));
      }), R.value && X.observe(R.value);
    }), Ee(() => X?.disconnect());
    const se = B();
    te(m, async () => {
      await Ke(), se.value && (se.value.scrollTop = 0);
    });
    function q(p) {
      m.value = p, g.value = !0;
    }
    const y = (p) => JSON.stringify(p) === JSON.stringify(m.value), c = M(() => m.value.kind === "field" ? v.config.fields[m.value.index] : void 0), A = M(() => {
      const p = m.value;
      return p.kind === "stage" ? Z[p.stage] : p.kind === "field" ? c.value?.name || "New field" : p.kind === "document" ? "Read document" : p.kind === "output" ? "Output" : "Details";
    }), Fe = M(() => {
      const p = m.value;
      return p.kind === "stage" ? he[p.stage] : p.kind === "field" ? "tabler:forms" : p.kind === "document" ? "tabler:file-text" : p.kind === "output" ? "tabler:braces" : "tabler:info-circle";
    }), Ae = M(() => v.config.fields.filter((p, d) => !(m.value.kind === "field" && m.value.index === d)).map((p) => p.name)), me = M(() => v.config.stages.deep.enabled), ke = M(() => v.config.stages.map.enabled), Oe = M(() => [...new Set(v.config.fields.map((p) => p.group.trim()).filter(Boolean))]), $e = (p) => De(v.config.fields[p], v.config.fields.filter((d, U) => U !== p).map((d) => d.name)), xe = ["map", "prefetch", "scout", "deep", "extract", "verify"], Pe = M(() => xe.filter((p) => ce(v.config, p)).map((p) => Z[p]).join(" · ")), Le = M(() => v.config.fields.map((p) => p.name || "New field").join(", ")), Ie = M(() => xe.filter((p) => ce(v.config, p)).length), _ = (p) => v.result?.trace.find((d) => d.kind === p);
    function We() {
      v.config.fields.push(al()), N.value = !0, q({ kind: "field", index: v.config.fields.length - 1 });
    }
    function je(p) {
      v.config.fields.splice(p, 1), m.value = { kind: "document" };
    }
    function we(p, d) {
      const U = v.config.fields, j = p + d;
      if (j < 0 || j >= U.length) return;
      const [Y] = U.splice(p, 1);
      U.splice(j, 0, Y), m.value = { kind: "field", index: j };
    }
    const Ve = (p) => p.type === "list" ? `list of ${p.item_type}` : p.type, Se = M({ get: () => v.config.tags.join(", "), set: (p) => {
      v.config.tags = [...new Set(p.split(",").map((d) => d.trim()).filter(Boolean))];
    } });
    return (p, d) => (s(), o("div", {
      ref_key: "root",
      ref: R,
      class: P(["builder", { narrow: L.value, "panel-open": g.value, resizing: C.value }])
    }, [
      e("div", ga, [
        e("div", ha, [
          e("section", ka, [
            e("header", $a, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": N.value,
                "aria-controls": "fields-body",
                onClick: d[0] || (d[0] = (U) => F("fields"))
              }, [
                r(h(T), {
                  icon: N.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[19] || (d[19] = e("h2", { id: "fields-head" }, "Fields", -1)),
                e("span", wa, i(a.config.fields.length), 1)
              ], 8, xa),
              !N.value && a.config.fields.length ? (s(), o("span", Va, i(Le.value), 1)) : f("", !0),
              a.readonly ? f("", !0) : (s(), o("button", {
                key: 1,
                type: "button",
                class: "btn small push",
                onClick: We
              }, [
                r(h(T), { icon: "tabler:plus" }),
                d[20] || (d[20] = k("Add field", -1))
              ]))
            ]),
            z(e("div", Sa, [
              a.config.fields.length ? (s(), o("ul", qa, [
                (s(!0), o(S, null, E(a.config.fields, (U, j) => (s(), o("li", {
                  key: j,
                  class: P(["row-item", { active: y({ kind: "field", index: j }) }])
                }, [
                  e("button", {
                    type: "button",
                    class: "row-main",
                    onClick: (Y) => q({ kind: "field", index: j })
                  }, [
                    e("span", Ma, [
                      k(i(U.name || "New field"), 1),
                      U.required ? (s(), o("span", Na, "*")) : f("", !0),
                      $e(j) ? (s(), G(h(T), {
                        key: 1,
                        icon: "tabler:alert-circle",
                        class: "row-warn",
                        title: $e(j)
                      }, null, 8, ["title"])) : f("", !0)
                    ]),
                    e("span", {
                      class: P(["row-desc", { missing: !U.description }])
                    }, i(U.description || "No description"), 3),
                    e("span", Ea, [
                      U.search_within === "sections" ? (s(), o("span", {
                        key: 0,
                        class: P(["chip", ke.value ? "" : "muted-chip"]),
                        title: "Reads the sections Map picks"
                      }, "sections", 2)) : f("", !0),
                      U.group.trim() ? (s(), o("span", Ba, i(U.group), 1)) : f("", !0),
                      U.strategy === "deep" ? (s(), o("span", {
                        key: 2,
                        class: P(["chip", me.value ? "primary" : "muted-chip"]),
                        title: me.value ? "Deep analysis" : "Deep analysis is off in the flow"
                      }, "deep", 10, Ta)) : f("", !0),
                      e("span", Ra, i(Ve(U)), 1),
                      U.evidence_required ? (s(), o("span", Da, [
                        r(h(T), { icon: "tabler:quote" })
                      ])) : f("", !0)
                    ])
                  ], 8, Ua),
                  a.readonly ? f("", !0) : (s(), o("span", za, [
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field up",
                      disabled: j === 0,
                      onClick: (Y) => we(j, -1)
                    }, [
                      r(h(T), { icon: "tabler:chevron-up" })
                    ], 8, Fa),
                    e("button", {
                      type: "button",
                      class: "icon-btn",
                      "aria-label": "Move field down",
                      disabled: j === a.config.fields.length - 1,
                      onClick: (Y) => we(j, 1)
                    }, [
                      r(h(T), { icon: "tabler:chevron-down" })
                    ], 8, Aa)
                  ]))
                ], 2))), 128))
              ])) : (s(), o("p", Ca, "Add the values to pull from each document."))
            ], 512), [
              [be, N.value]
            ])
          ]),
          e("section", Oa, [
            e("header", Pa, [
              e("button", {
                type: "button",
                class: "collapse",
                "aria-expanded": w.value,
                "aria-controls": "flow-body",
                onClick: d[1] || (d[1] = (U) => F("flow"))
              }, [
                r(h(T), {
                  icon: w.value ? "tabler:chevron-down" : "tabler:chevron-right"
                }, null, 8, ["icon"]),
                d[21] || (d[21] = e("h2", { id: "flow-head" }, "Flow", -1)),
                e("span", Ia, i(Ie.value) + " of 6", 1)
              ], 8, La),
              w.value ? f("", !0) : (s(), o("span", Wa, i(Pe.value), 1)),
              e("button", {
                type: "button",
                class: P(["btn small subtle push", { on: y({ kind: "details" }) }]),
                onClick: d[2] || (d[2] = (U) => q({ kind: "details" }))
              }, [
                r(h(T), { icon: "tabler:info-circle" }),
                d[22] || (d[22] = k("Details", -1))
              ], 2)
            ]),
            z(e("div", ja, [
              e("button", {
                type: "button",
                class: P(["node fixed", { active: y({ kind: "document" }) }]),
                onClick: d[3] || (d[3] = (U) => q({ kind: "document" }))
              }, [
                e("span", Qa, [
                  r(h(T), { icon: "tabler:file-text" })
                ]),
                e("span", Ja, [
                  d[23] || (d[23] = e("span", { class: "node-title" }, "Read document", -1)),
                  e("span", Ka, i(h(tl)(a.config.retrieval)), 1)
                ]),
                e("span", Ha, [
                  e("span", Ga, i(h(Re)(a.config.retrieval.embedding_model)), 1)
                ])
              ], 2),
              d[28] || (d[28] = e("div", { class: "connector" }, null, -1)),
              r(ee, {
                stage: "map",
                config: a.config,
                active: y({ kind: "stage", stage: "map" }),
                trace: _("map"),
                readonly: a.readonly,
                onSelect: d[4] || (d[4] = (U) => q({ kind: "stage", stage: "map" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[29] || (d[29] = e("div", {
                class: "fork",
                "aria-hidden": "true"
              }, [
                e("span")
              ], -1)),
              e("div", Xa, [
                e("div", Ya, [
                  d[24] || (d[24] = e("span", { class: "branch-label" }, "Evidence", -1)),
                  r(ee, {
                    stage: "prefetch",
                    config: a.config,
                    active: y({ kind: "stage", stage: "prefetch" }),
                    trace: _("prefetch"),
                    readonly: a.readonly,
                    onSelect: d[5] || (d[5] = (U) => q({ kind: "stage", stage: "prefetch" }))
                  }, null, 8, ["config", "active", "trace", "readonly"]),
                  d[25] || (d[25] = e("div", { class: "connector" }, null, -1)),
                  r(ee, {
                    stage: "scout",
                    config: a.config,
                    active: y({ kind: "stage", stage: "scout" }),
                    trace: _("scout"),
                    readonly: a.readonly,
                    onSelect: d[6] || (d[6] = (U) => q({ kind: "stage", stage: "scout" }))
                  }, null, 8, ["config", "active", "trace", "readonly"])
                ]),
                e("div", Za, [
                  d[26] || (d[26] = e("span", { class: "branch-label" }, "Deep fields", -1)),
                  r(ee, {
                    stage: "deep",
                    config: a.config,
                    active: y({ kind: "stage", stage: "deep" }),
                    trace: _("deep"),
                    readonly: a.readonly,
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
              r(ee, {
                stage: "extract",
                config: a.config,
                active: y({ kind: "stage", stage: "extract" }),
                trace: _("extract"),
                readonly: a.readonly,
                onSelect: d[8] || (d[8] = (U) => q({ kind: "stage", stage: "extract" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[31] || (d[31] = e("div", { class: "connector" }, null, -1)),
              r(ee, {
                stage: "verify",
                config: a.config,
                active: y({ kind: "stage", stage: "verify" }),
                trace: _("verify"),
                readonly: a.readonly,
                onSelect: d[9] || (d[9] = (U) => q({ kind: "stage", stage: "verify" }))
              }, null, 8, ["config", "active", "trace", "readonly"]),
              d[32] || (d[32] = e("div", { class: "connector" }, null, -1)),
              e("button", {
                type: "button",
                class: P(["node fixed", { active: y({ kind: "output" }) }]),
                onClick: d[10] || (d[10] = (U) => q({ kind: "output" }))
              }, [
                e("span", _a, [
                  r(h(T), { icon: "tabler:braces" })
                ]),
                e("span", en, [
                  d[27] || (d[27] = e("span", { class: "node-title" }, "Output", -1)),
                  e("span", ln, i(a.config.fields.length ? `${a.config.fields.length} values with evidence` : "No fields yet"), 1)
                ])
              ], 2)
            ], 512), [
              [be, w.value]
            ])
          ])
        ])
      ]),
      L.value && g.value ? (s(), o("div", {
        key: 0,
        class: "scrim",
        onClick: d[11] || (d[11] = (U) => D(!1))
      })) : f("", !0),
      g.value ? (s(), o("aside", {
        key: 1,
        class: "side-panel",
        "aria-label": "Settings panel",
        style: ae(L.value ? void 0 : { width: `${t.value}px` })
      }, [
        L.value ? f("", !0) : (s(), o("div", {
          key: 0,
          class: P(["resizer", { active: C.value }]),
          role: "separator",
          "aria-orientation": "vertical",
          "aria-label": "Resize panel",
          tabindex: "0",
          "aria-valuenow": t.value,
          "aria-valuemin": ue,
          onPointerdown: ye(Q, ["prevent"]),
          onKeydown: ne,
          onDblclick: d[12] || (d[12] = (U) => b(ve))
        }, null, 42, tn)),
        e("header", an, [
          e("span", nn, [
            r(h(T), { icon: Fe.value }, null, 8, ["icon"])
          ]),
          e("h2", null, i(A.value), 1),
          e("button", {
            type: "button",
            class: "icon-btn push",
            "aria-label": "Collapse panel",
            title: "Collapse panel",
            onClick: d[13] || (d[13] = (U) => D(!1))
          }, [
            r(h(T), {
              icon: L.value ? "tabler:x" : "tabler:layout-sidebar-right-collapse"
            }, null, 8, ["icon"])
          ])
        ]),
        e("div", {
          ref_key: "panelBody",
          ref: se,
          class: "side-panel-body"
        }, [
          m.value.kind === "document" ? (s(), G(fa, {
            key: 0,
            config: a.config,
            retention: a.retention,
            readonly: a.readonly
          }, null, 8, ["config", "retention", "readonly"])) : m.value.kind === "stage" ? (s(), G(Yt, {
            key: 1,
            stage: m.value.stage,
            config: a.config,
            readonly: a.readonly
          }, null, 8, ["stage", "config", "readonly"])) : m.value.kind === "field" && c.value ? (s(), G(Al, {
            key: 2,
            field: c.value,
            "other-names": Ae.value,
            groups: Oe.value,
            "deep-enabled": me.value,
            "map-enabled": ke.value,
            readonly: a.readonly,
            onRemove: d[14] || (d[14] = (U) => je(m.value.index))
          }, null, 8, ["field", "other-names", "groups", "deep-enabled", "map-enabled", "readonly"])) : m.value.kind === "details" ? (s(), o("fieldset", {
            key: 3,
            class: "inspector-form",
            disabled: a.readonly
          }, [
            e("label", null, [
              d[33] || (d[33] = k("Name", -1)),
              z(e("input", {
                "onUpdate:modelValue": d[15] || (d[15] = (U) => n.value = U),
                "aria-label": "Extractor name"
              }, null, 512), [
                [J, n.value]
              ])
            ]),
            e("label", null, [
              d[34] || (d[34] = k("Description", -1)),
              z(e("textarea", {
                "onUpdate:modelValue": d[16] || (d[16] = (U) => u.value = U),
                rows: "3",
                placeholder: "What this extractor reads"
              }, null, 512), [
                [J, u.value]
              ])
            ]),
            e("label", null, [
              d[35] || (d[35] = k("Tags", -1)),
              z(e("input", {
                "onUpdate:modelValue": d[17] || (d[17] = (U) => Se.value = U),
                placeholder: "invoices, finance"
              }, null, 512), [
                [
                  J,
                  Se.value,
                  void 0,
                  { lazy: !0 }
                ]
              ]),
              d[36] || (d[36] = e("small", null, "Comma separated", -1))
            ])
          ], 8, sn)) : m.value.kind === "output" ? (s(), o("div", on, [
            d[37] || (d[37] = e("p", { class: "muted" }, "Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.", -1)),
            e("ul", dn, [
              (s(!0), o(S, null, E(a.config.fields, (U) => (s(), o("li", {
                key: U.name
              }, [
                e("span", un, i(U.name || "New field"), 1),
                e("span", rn, i(Ve(U)), 1)
              ]))), 128))
            ]),
            d[38] || (d[38] = e("p", { class: "muted" }, "Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.", -1))
          ])) : f("", !0)
        ], 512)
      ], 4)) : L.value ? f("", !0) : (s(), o("button", {
        key: 2,
        type: "button",
        class: "rail",
        "aria-label": "Open panel",
        title: "Open panel",
        onClick: d[18] || (d[18] = (U) => D(!0))
      }, [
        r(h(T), { icon: "tabler:layout-sidebar-right-expand" }),
        e("span", cn, i(A.value), 1)
      ]))
    ], 2));
  }
}), vn = ["selected"], bn = {
  key: 1,
  role: "alert"
}, pn = {
  key: 2,
  class: "muted"
}, ze = /* @__PURE__ */ W({
  __name: "UploadPicker",
  props: {
    value: {}
  },
  emits: ["select"],
  setup(a, { emit: v }) {
    const n = v, u = B(!1), m = B("");
    ge(async () => {
      try {
        await Be("wc-multiselect", { timeoutMs: 8e3 }), u.value = !0;
      } catch (x) {
        m.value = String(x);
      }
    });
    function V(x) {
      const g = x.detail;
      n("select", g.selected[0] || "", g.labels?.[0] || "");
    }
    return (x, g) => u.value ? (s(), o("wc-multiselect", {
      key: 0,
      source: "/api/v1/uploads/list",
      "response-key": "uploads",
      "id-key": "uuid",
      "label-key": "filename",
      multi: !1,
      selected: JSON.stringify(a.value ? [a.value] : []),
      placeholder: "Choose an upload",
      onChange: V
    }, null, 40, vn)) : m.value ? (s(), o("p", bn, i(m.value), 1)) : (s(), o("span", pn, "Loading uploads…"));
  }
}), yn = { class: "test" }, fn = { class: "run-bar" }, gn = { class: "run-input" }, hn = { class: "muted run-note" }, kn = {
  key: 0,
  class: "empty"
}, $n = {
  key: 1,
  class: "test-grid"
}, xn = { class: "block" }, wn = { class: "block-head" }, Vn = { class: "muted push" }, Sn = { class: "value-list" }, Cn = ["aria-expanded", "onClick"], qn = { class: "value-name" }, Un = { class: "value-text" }, Mn = { class: "bar" }, Nn = { class: "evidence" }, En = {
  key: 0,
  class: "muted"
}, Bn = { class: "block" }, Tn = { class: "timeline" }, Rn = { class: "tl-icon" }, Dn = { class: "tl-main" }, zn = { class: "tl-head" }, Fn = { class: "muted push" }, An = { class: "tl-bar" }, On = { class: "muted" }, Pn = {
  key: 0,
  class: "tl-msg"
}, Ln = {
  key: 1,
  class: "chips"
}, In = /* @__PURE__ */ W({
  __name: "TestPanel",
  props: {
    result: {},
    retention: {}
  },
  setup(a) {
    const v = a, n = B(""), u = B(), m = (t) => `${Math.round(t * 100)}%`, V = (t) => t == null ? "—" : typeof t == "string" ? t : JSON.stringify(t), x = (t) => `${(t / 1e3).toFixed(1)}s`, g = M(() => Math.max(1, ...v.result?.trace.map((t) => t.duration_ms) ?? [1])), N = (t) => Z[t] ?? t, w = (t) => he[t] ?? "tabler:point", l = (t) => t >= 0.9 ? "high" : t >= 0.7 ? "mid" : "low";
    return (t, $) => (s(), o("div", yn, [
      e("section", fn, [
        e("div", gn, [
          r(ze, {
            value: n.value,
            onSelect: $[0] || ($[0] = (b) => n.value = b)
          }, null, 8, ["value"])
        ]),
        r(h(K), {
          label: "Run extraction",
          disabled: ""
        }),
        e("p", hn, "Extraction is not available yet. Processed documents and runs expire after " + i(a.retention) + ".", 1)
      ]),
      a.result ? (s(), o("div", $n, [
        e("section", xn, [
          e("header", wn, [
            $[1] || ($[1] = e("h2", { class: "block-title" }, "Values", -1)),
            e("span", Vn, [
              k(i(a.result.tokens.toLocaleString()) + " tokens · " + i(x(a.result.duration_ms)), 1),
              a.result.cost !== void 0 ? (s(), o(S, { key: 0 }, [
                k(" · $" + i(a.result.cost.toFixed(3)), 1)
              ], 64)) : f("", !0)
            ])
          ]),
          e("ul", Sn, [
            (s(!0), o(S, null, E(a.result.fields, (b) => (s(), o("li", {
              key: b.name,
              class: "value-row"
            }, [
              e("button", {
                type: "button",
                class: "value-main",
                "aria-expanded": u.value === b.name,
                onClick: (C) => u.value = u.value === b.name ? void 0 : b.name
              }, [
                e("span", qn, i(b.name), 1),
                e("span", Un, i(V(b.value)), 1),
                e("span", {
                  class: P(["confidence", l(b.confidence)])
                }, [
                  e("span", Mn, [
                    e("span", {
                      style: ae({ width: m(b.confidence) })
                    }, null, 4)
                  ]),
                  k(i(m(b.confidence)) + " confidence", 1)
                ], 2),
                e("span", {
                  class: P(["chip", b.verified ? "primary" : "muted-chip"])
                }, [
                  r(h(T), {
                    icon: b.verified ? "tabler:shield-check" : "tabler:shield-question"
                  }, null, 8, ["icon"]),
                  k(i(b.verified ? "Verified" : "Unverified"), 1)
                ], 2),
                r(h(T), {
                  icon: u.value === b.name ? "tabler:chevron-up" : "tabler:chevron-down",
                  class: "value-caret"
                }, null, 8, ["icon"])
              ], 8, Cn),
              z(e("div", Nn, [
                (s(!0), o(S, null, E(b.evidence, (C, Q) => (s(), o("blockquote", { key: Q }, [
                  e("p", null, "“" + i(C.quote) + "”", 1),
                  e("cite", null, [
                    k(i(C.section), 1),
                    C.page !== void 0 ? (s(), o(S, { key: 0 }, [
                      k(" · Page " + i(C.page), 1)
                    ], 64)) : f("", !0)
                  ])
                ]))), 128)),
                b.evidence.length ? f("", !0) : (s(), o("p", En, "No evidence."))
              ], 512), [
                [be, u.value === b.name || b.evidence.length === 1]
              ])
            ]))), 128))
          ])
        ]),
        e("section", Bn, [
          $[2] || ($[2] = e("header", { class: "block-head" }, [
            e("h2", { class: "block-title" }, "Steps")
          ], -1)),
          e("ol", Tn, [
            (s(!0), o(S, null, E(a.result.trace, (b, C) => (s(), o("li", {
              key: C,
              class: P(b.status)
            }, [
              e("span", Rn, [
                r(h(T), {
                  icon: w(b.kind)
                }, null, 8, ["icon"])
              ]),
              e("div", Dn, [
                e("div", zn, [
                  e("strong", null, i(N(b.kind)), 1),
                  e("span", Fn, i(x(b.duration_ms)), 1)
                ]),
                e("span", An, [
                  e("span", {
                    style: ae({ width: `${Math.max(4, b.duration_ms / g.value * 100)}%` })
                  }, null, 4)
                ]),
                e("p", On, [
                  k(i(b.scope), 1),
                  b.model ? (s(), o(S, { key: 0 }, [
                    k(" · " + i(b.model), 1)
                  ], 64)) : f("", !0),
                  k(" · " + i((b.input_tokens + b.output_tokens).toLocaleString()) + " tokens", 1),
                  b.cost !== void 0 ? (s(), o(S, { key: 1 }, [
                    k(" · $" + i(b.cost.toFixed(4)), 1)
                  ], 64)) : f("", !0)
                ]),
                b.message ? (s(), o("p", Pn, i(b.message), 1)) : f("", !0),
                b.queries?.length ? (s(), o("div", Ln, [
                  (s(!0), o(S, null, E(b.queries, (Q) => (s(), o("span", {
                    key: Q,
                    class: "chip"
                  }, i(Q), 1))), 128))
                ])) : f("", !0)
              ])
            ], 2))), 128))
          ])
        ])
      ])) : (s(), o("p", kn, "No extraction results yet."))
    ]));
  }
}), Wn = { class: "evals" }, jn = {
  key: 0,
  class: "stat-row"
}, Qn = { class: "stat" }, Jn = { class: "stat-label" }, Kn = { class: "stat-value" }, Hn = { class: "stat" }, Gn = { class: "stat-value" }, Xn = { class: "stat" }, Yn = { class: "stat-value" }, Zn = {
  key: 0,
  class: "stat-delta flat"
}, _n = { class: "stat" }, es = { class: "stat-value" }, ls = { class: "block" }, ts = { class: "block-head" }, as = {
  key: 0,
  class: "rev-pick push"
}, ns = ["value"], ss = ["value"], os = ["value"], is = ["value"], ds = {
  key: 0,
  class: "block-empty"
}, us = {
  key: 1,
  class: "metric-table"
}, rs = { class: "mono" }, cs = { class: "acc" }, ms = { class: "bar" }, vs = { class: "acc strong" }, bs = { class: "bar" }, ps = { class: "num muted" }, ys = { class: "num muted" }, fs = { class: "block" }, gs = { class: "block-head" }, hs = { class: "count" }, ks = { class: "row push" }, $s = { class: "grid" }, xs = { class: "mono" }, ws = ["onUpdate:modelValue"], Vs = ["onUpdate:modelValue"], Ss = ["onUpdate:modelValue"], Cs = ["onUpdate:modelValue", "type"], qs = {
  key: 0,
  class: "error",
  role: "alert"
}, Us = { class: "row" }, Ms = {
  key: 1,
  class: "block-empty"
}, Ns = {
  key: 2,
  class: "table-scroll"
}, Es = { class: "metric-table" }, Bs = { class: "num" }, Ts = ["aria-label", "disabled", "onClick"], Rs = { class: "block" }, Ds = { class: "block-head" }, zs = {
  key: 0,
  class: "block-empty"
}, Fs = { class: "proposal-head" }, As = { class: "muted" }, Os = { class: "chips" }, Ps = { class: "chip" }, Ls = { class: "chip" }, Is = { class: "changes" }, Ws = { class: "row" }, js = /* @__PURE__ */ W({
  __name: "EvalsPanel",
  props: {
    cases: {},
    results: {},
    proposals: {},
    fields: {},
    saving: { type: Boolean }
  },
  emits: ["add-case", "delete-case"],
  setup(a, { emit: v }) {
    const n = a, u = v, m = B(!1), V = B(""), x = B(""), g = B({}), N = B("");
    te(() => n.cases, () => {
      m.value = !1, V.value = "", g.value = {};
    });
    function w() {
      N.value = "";
      const q = {};
      try {
        for (const y of n.fields) {
          const c = g.value[y.name] ?? "";
          q[y.name] = ["number", "boolean", "list", "object"].includes(y.type) ? c.trim() ? JSON.parse(c) : null : c;
        }
        u("add-case", { upload_id: V.value, upload_name: x.value, expected: q });
      } catch {
        N.value = "Use valid JSON for numbers, lists, and objects.";
      }
    }
    const l = M(() => [...n.results].sort((q, y) => q.revision - y.revision)), t = B(), $ = B(), b = M(() => l.value.find((q) => q.revision === $.value) ?? l.value.at(-1)), C = M(() => l.value.find((q) => q.revision === t.value) ?? l.value.at(-2) ?? l.value.at(-1)), Q = (q) => q && q.metrics.length ? q.metrics.reduce((y, c) => y + c.accuracy, 0) / q.metrics.length : 0, ne = M(() => [...new Set([...C.value?.metrics ?? [], ...b.value?.metrics ?? []].map((y) => y.field))].map((y) => ({ name: y, a: C.value?.metrics.find((c) => c.field === y), b: b.value?.metrics.find((c) => c.field === y) }))), D = (q) => `${Math.round(q * 100)}%`, F = (q) => `${q > 0 ? "+" : q < 0 ? "−" : ""}${Math.abs(Math.round(q * 100))} pts`, R = (q) => Math.round(q * 100) > 0 ? "up" : Math.round(q * 100) < 0 ? "down" : "flat", L = (q) => `$${q.toFixed(3)}`, X = (q) => `${(q / 1e3).toFixed(1)}s`, se = (q) => q == null || q === "" ? "—" : typeof q == "string" ? q : JSON.stringify(q);
    return (q, y) => (s(), o("div", Wn, [
      b.value ? (s(), o("div", jn, [
        e("div", Qn, [
          e("span", Jn, "Accuracy · revision " + i(b.value.revision), 1),
          e("span", Kn, i(D(Q(b.value))), 1),
          C.value && C.value !== b.value ? (s(), o("span", {
            key: 0,
            class: P(["stat-delta", R(Q(b.value) - Q(C.value))])
          }, i(F(Q(b.value) - Q(C.value))) + " vs revision " + i(C.value.revision), 3)) : f("", !0)
        ]),
        e("div", Hn, [
          y[5] || (y[5] = e("span", { class: "stat-label" }, "Cases", -1)),
          e("span", Gn, i(b.value.cases), 1)
        ]),
        e("div", Xn, [
          y[6] || (y[6] = e("span", { class: "stat-label" }, "Cost per eval", -1)),
          e("span", Yn, i(L(b.value.cost)), 1),
          C.value && C.value !== b.value ? (s(), o("span", Zn, i(L(C.value.cost)) + " before", 1)) : f("", !0)
        ]),
        e("div", _n, [
          y[7] || (y[7] = e("span", { class: "stat-label" }, "Time per eval", -1)),
          e("span", es, i(X(b.value.duration_ms)), 1),
          C.value && C.value !== b.value ? (s(), o("span", {
            key: 0,
            class: P(["stat-delta", b.value.duration_ms < C.value.duration_ms ? "up" : "flat"])
          }, i(X(C.value.duration_ms)) + " before", 3)) : f("", !0)
        ])
      ])) : f("", !0),
      e("section", ls, [
        e("header", ts, [
          y[8] || (y[8] = e("h2", { class: "block-title" }, "Field accuracy", -1)),
          l.value.length ? (s(), o("div", as, [
            e("select", {
              value: C.value?.revision,
              "aria-label": "Baseline revision",
              onChange: y[0] || (y[0] = (c) => t.value = Number(c.target.value))
            }, [
              (s(!0), o(S, null, E(l.value, (c) => (s(), o("option", {
                key: c.revision,
                value: c.revision
              }, "Revision " + i(c.revision), 9, ss))), 128))
            ], 40, ns),
            r(h(T), { icon: "tabler:arrow-right" }),
            e("select", {
              value: b.value?.revision,
              "aria-label": "Compared revision",
              onChange: y[1] || (y[1] = (c) => $.value = Number(c.target.value))
            }, [
              (s(!0), o(S, null, E(l.value, (c) => (s(), o("option", {
                key: c.revision,
                value: c.revision
              }, "Revision " + i(c.revision), 9, is))), 128))
            ], 40, os)
          ])) : f("", !0)
        ]),
        l.value.length ? (s(), o("table", us, [
          e("thead", null, [
            e("tr", null, [
              y[9] || (y[9] = e("th", null, "Field", -1)),
              e("th", null, "Revision " + i(C.value?.revision), 1),
              e("th", null, "Revision " + i(b.value?.revision), 1),
              y[10] || (y[10] = e("th", null, "Change", -1)),
              y[11] || (y[11] = e("th", { class: "num" }, "Cost", -1)),
              y[12] || (y[12] = e("th", { class: "num" }, "Time", -1))
            ])
          ]),
          e("tbody", null, [
            (s(!0), o(S, null, E(ne.value, (c) => (s(), o("tr", {
              key: c.name
            }, [
              e("td", rs, i(c.name), 1),
              e("td", null, [
                e("span", cs, [
                  e("span", ms, [
                    e("span", {
                      style: ae({ width: D(c.a?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  k(i(c.a ? D(c.a.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                e("span", vs, [
                  e("span", bs, [
                    e("span", {
                      style: ae({ width: D(c.b?.accuracy ?? 0) })
                    }, null, 4)
                  ]),
                  k(i(c.b ? D(c.b.accuracy) : "—"), 1)
                ])
              ]),
              e("td", null, [
                c.a && c.b ? (s(), o("span", {
                  key: 0,
                  class: P(["trend", R(c.b.accuracy - c.a.accuracy)])
                }, [
                  r(h(T), {
                    icon: R(c.b.accuracy - c.a.accuracy) === "up" ? "tabler:trending-up" : R(c.b.accuracy - c.a.accuracy) === "down" ? "tabler:trending-down" : "tabler:minus"
                  }, null, 8, ["icon"]),
                  k(i(F(c.b.accuracy - c.a.accuracy)), 1)
                ], 2)) : f("", !0)
              ]),
              e("td", ps, i(c.b ? L(c.b.cost) : "—"), 1),
              e("td", ys, i(c.b ? X(c.b.duration_ms) : "—"), 1)
            ]))), 128))
          ])
        ])) : (s(), o("p", ds, "No evaluation results yet."))
      ]),
      e("section", fs, [
        e("header", gs, [
          y[13] || (y[13] = e("h2", { class: "block-title" }, "Cases", -1)),
          e("span", hs, i(a.cases.length), 1),
          e("div", ks, [
            r(h(K), {
              label: "Add case",
              size: "small",
              severity: "secondary",
              disabled: !a.fields.length,
              onClick: y[2] || (y[2] = (c) => m.value = !m.value)
            }, null, 8, ["disabled"]),
            r(h(K), {
              label: "Run all cases",
              size: "small",
              disabled: ""
            })
          ])
        ]),
        m.value ? (s(), o("form", {
          key: 0,
          class: "case-form",
          onSubmit: ye(w, ["prevent"])
        }, [
          e("label", null, [
            y[14] || (y[14] = k("Upload", -1)),
            r(ze, {
              value: V.value,
              onSelect: y[3] || (y[3] = (c, A) => {
                V.value = c, x.value = A;
              })
            }, null, 8, ["value"])
          ]),
          e("div", $s, [
            (s(!0), o(S, null, E(a.fields, (c) => (s(), o("label", {
              key: c.name
            }, [
              e("span", xs, i(c.name), 1),
              c.type === "boolean" ? z((s(), o("select", {
                key: 0,
                "onUpdate:modelValue": (A) => g.value[c.name] = A
              }, [...y[15] || (y[15] = [
                e("option", { value: "" }, "No value", -1),
                e("option", { value: "true" }, "Yes", -1),
                e("option", { value: "false" }, "No", -1)
              ])], 8, ws)), [
                [oe, g.value[c.name]]
              ]) : c.type === "enum" ? z((s(), o("select", {
                key: 1,
                "onUpdate:modelValue": (A) => g.value[c.name] = A
              }, [
                y[16] || (y[16] = e("option", { value: "" }, "No value", -1)),
                (s(!0), o(S, null, E(c.enum_values, (A) => (s(), o("option", { key: A }, i(A), 1))), 128))
              ], 8, Vs)), [
                [oe, g.value[c.name]]
              ]) : ["object", "list"].includes(c.type) ? z((s(), o("textarea", {
                key: 2,
                "onUpdate:modelValue": (A) => g.value[c.name] = A,
                rows: "2",
                placeholder: "JSON value"
              }, null, 8, Ss)), [
                [J, g.value[c.name]]
              ]) : z((s(), o("input", {
                key: 3,
                "onUpdate:modelValue": (A) => g.value[c.name] = A,
                type: c.type === "number" ? "number" : c.type === "date" ? "date" : "text",
                placeholder: "Expected value"
              }, null, 8, Cs)), [
                [He, g.value[c.name]]
              ])
            ]))), 128))
          ]),
          N.value ? (s(), o("p", qs, i(N.value), 1)) : f("", !0),
          e("div", Us, [
            r(h(K), {
              label: "Save case",
              size: "small",
              type: "submit",
              disabled: !V.value,
              loading: a.saving
            }, null, 8, ["disabled", "loading"]),
            r(h(K), {
              label: "Cancel",
              size: "small",
              severity: "secondary",
              text: "",
              onClick: y[4] || (y[4] = (c) => m.value = !1)
            })
          ])
        ], 32)) : f("", !0),
        !a.cases.length && !m.value ? (s(), o("p", Ms, "No evaluation cases yet. Add a document with the values you expect.")) : a.cases.length ? (s(), o("div", Ns, [
          e("table", Es, [
            e("thead", null, [
              e("tr", null, [
                y[17] || (y[17] = e("th", null, "Document", -1)),
                (s(!0), o(S, null, E(a.fields, (c) => (s(), o("th", {
                  key: c.name,
                  class: "mono"
                }, i(c.name), 1))), 128)),
                y[18] || (y[18] = e("th", null, null, -1))
              ])
            ]),
            e("tbody", null, [
              (s(!0), o(S, null, E(a.cases, (c) => (s(), o("tr", {
                key: c.id
              }, [
                e("td", null, [
                  r(h(T), {
                    icon: "tabler:file-text",
                    class: "muted"
                  }),
                  k(" " + i(c.upload_name), 1)
                ]),
                (s(!0), o(S, null, E(a.fields, (A) => (s(), o("td", {
                  key: A.name
                }, i(se(c.expected[A.name])), 1))), 128)),
                e("td", Bs, [
                  e("button", {
                    type: "button",
                    class: "icon-btn",
                    "aria-label": `Remove case ${c.upload_name}`,
                    disabled: a.saving,
                    onClick: (A) => u("delete-case", c.id)
                  }, [
                    r(h(T), { icon: "tabler:trash" })
                  ], 8, Ts)
                ])
              ]))), 128))
            ])
          ])
        ])) : f("", !0),
        y[19] || (y[19] = e("p", { class: "block-foot muted" }, "Evaluation execution is not available yet.", -1))
      ]),
      e("section", Rs, [
        e("header", Ds, [
          y[20] || (y[20] = e("h2", { class: "block-title" }, "Tuning proposals", -1)),
          r(h(K), {
            label: "Tune configuration",
            size: "small",
            severity: "secondary",
            class: "push",
            disabled: ""
          })
        ]),
        a.proposals.length ? f("", !0) : (s(), o("p", zs, "No tuning proposals yet.")),
        (s(!0), o(S, null, E(a.proposals, (c) => (s(), o("article", {
          key: c.id,
          class: "proposal"
        }, [
          e("div", Fs, [
            e("h3", null, i(c.title), 1),
            e("span", As, "from revision " + i(c.base_revision), 1)
          ]),
          e("div", Os, [
            e("span", {
              class: P(["chip", c.accuracy_delta > 0 ? "primary" : ""])
            }, i(F(c.accuracy_delta)) + " accuracy", 3),
            e("span", Ps, i(c.cost_delta >= 0 ? "+" : "−") + i(L(Math.abs(c.cost_delta))) + " cost", 1),
            e("span", Ls, i(c.duration_delta_ms >= 0 ? "+" : "−") + i(X(Math.abs(c.duration_delta_ms))) + " time", 1)
          ]),
          e("ul", Is, [
            (s(!0), o(S, null, E(c.changes, (A) => (s(), o("li", { key: A }, i(A), 1))), 128))
          ]),
          e("div", Ws, [
            r(h(K), {
              label: "Apply",
              size: "small",
              disabled: ""
            }),
            r(h(K), {
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
}), Qs = { class: "section-head" }, Js = { class: "muted" }, Ks = {
  key: 0,
  class: "empty"
}, Hs = {
  key: 1,
  class: "run-list"
}, Gs = { class: "row" }, Xs = { class: "capitalize" }, Ys = ["data-status"], Zs = /* @__PURE__ */ W({
  __name: "RunsPanel",
  props: {
    runs: {},
    retention: {}
  },
  setup(a) {
    const v = (n) => new Date(n).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
    return (n, u) => (s(), o(S, null, [
      e("div", Qs, [
        u[0] || (u[0] = e("h2", null, "Recent runs", -1)),
        e("span", Js, "Retention " + i(a.retention), 1)
      ]),
      a.runs.length ? (s(), o("div", Hs, [
        (s(!0), o(S, null, E(a.runs, (m) => (s(), o("article", {
          key: m.id,
          class: "run-card"
        }, [
          e("div", Gs, [
            e("strong", Xs, i(m.caller), 1),
            e("span", {
              class: "badge push",
              "data-status": m.status
            }, i(m.status), 9, Ys)
          ]),
          e("dl", null, [
            u[1] || (u[1] = e("dt", null, "Duration", -1)),
            e("dd", null, i((m.duration_ms / 1e3).toFixed(1)) + "s", 1),
            u[2] || (u[2] = e("dt", null, "Expires", -1)),
            e("dd", null, i(v(m.expires_at)), 1)
          ])
        ]))), 128))
      ])) : (s(), o("p", Ks, "No runs yet."))
    ], 64));
  }
}), _s = () => ({ result: null, evals: [], proposals: [] }), eo = { class: "docscout" }, lo = { class: "toolbar" }, to = { class: "toolbar-lead" }, ao = { class: "crumb" }, no = {
  class: "tabs",
  role: "tablist",
  "aria-label": "Docscout"
}, so = ["id", "aria-selected", "aria-controls", "onClick"], oo = { class: "toolbar-side" }, io = { class: "stats" }, uo = ["title"], ro = {
  key: 1,
  class: "unsaved"
}, co = {
  key: 0,
  role: "alert",
  class: "error banner"
}, mo = {
  key: 1,
  id: "panel-Builder",
  role: "tabpanel",
  "aria-labelledby": "tab-Builder",
  class: "builder-body"
}, vo = ["id", "aria-labelledby"], bo = /* @__PURE__ */ W({
  __name: "DocscoutPage",
  props: {
    snapshot: {},
    engine: {},
    saving: { type: Boolean },
    error: {},
    back: { type: Boolean }
  },
  emits: ["save", "add-case", "delete-case", "back"],
  setup(a, { emit: v }) {
    const n = a, u = v, m = B(), V = B("Builder"), x = B(Ne()), g = B(""), N = B(""), w = M(() => n.snapshot.can_edit ? ["Builder", "Test", "Evals", "Runs"] : ["Test", "Runs"]);
    te(V, () => {
      m.value && (m.value.scrollTop = 0);
    }, { flush: "post" });
    const l = M(() => n.engine ?? _s()), t = B();
    function $(D) {
      return g.value === D.title && N.value === (D.description ?? "") && sl(x.value, D.config);
    }
    te(() => n.snapshot, (D, F) => {
      w.value.includes(V.value) || (V.value = w.value[0]), !(F && D.id === F.id && D.can_edit && F.can_edit && !$(F) && !$(D)) && (x.value = structuredClone(qe(D.config ?? Ne())), g.value = D.title, N.value = D.description ?? "", t.value = D.expected_revision);
    }, { immediate: !0 });
    const b = M(() => n.snapshot.can_edit && !$(n.snapshot)), C = M(() => nl(x.value)), Q = M(() => Object.keys(Z).filter((D) => ce(x.value, D)).length);
    function ne() {
      u("save", { title: g.value, description: N.value, config: structuredClone(qe(x.value)), expected_revision: t.value });
    }
    return (D, F) => (s(), o("main", eo, [
      e("div", lo, [
        e("div", to, [
          a.back ? (s(), o(S, { key: 0 }, [
            e("button", {
              type: "button",
              class: "icon-btn",
              "aria-label": "All extractors",
              title: "All extractors",
              onClick: F[0] || (F[0] = (R) => u("back"))
            }, [
              r(h(T), { icon: "tabler:arrow-left" })
            ]),
            e("span", ao, i(a.snapshot.title), 1)
          ], 64)) : f("", !0),
          e("nav", no, [
            (s(!0), o(S, null, E(w.value, (R) => (s(), o("button", {
              id: `tab-${R}`,
              key: R,
              role: "tab",
              "aria-selected": V.value === R,
              "aria-controls": `panel-${R}`,
              onClick: (L) => V.value = R
            }, i(R), 9, so))), 128))
          ])
        ]),
        e("div", oo, [
          e("span", io, [
            k(i(a.snapshot.field_count) + " " + i(a.snapshot.field_count === 1 ? "field" : "fields"), 1),
            a.snapshot.can_edit ? (s(), o(S, { key: 0 }, [
              k(" · " + i(Q.value) + " steps · revision " + i(a.snapshot.expected_revision), 1)
            ], 64)) : (s(), o(S, { key: 1 }, [
              k(" · Read access")
            ], 64))
          ]),
          a.snapshot.can_edit ? (s(), o(S, { key: 0 }, [
            C.value ? (s(), o("span", {
              key: 0,
              class: "invalid",
              role: "alert",
              title: C.value
            }, [
              r(h(T), { icon: "tabler:alert-circle" }),
              k(i(C.value), 1)
            ], 8, uo)) : b.value ? (s(), o("span", ro, "Unsaved")) : f("", !0),
            r(h(K), {
              label: "Save",
              size: "small",
              loading: a.saving,
              disabled: !b.value || !!C.value || !g.value.trim(),
              onClick: ne
            }, null, 8, ["loading", "disabled"])
          ], 64)) : f("", !0)
        ])
      ]),
      a.error ? (s(), o("p", co, i(a.error), 1)) : f("", !0),
      V.value === "Builder" && a.snapshot.can_edit ? (s(), o("div", mo, [
        r(mn, {
          title: g.value,
          "onUpdate:title": F[1] || (F[1] = (R) => g.value = R),
          description: N.value,
          "onUpdate:description": F[2] || (F[2] = (R) => N.value = R),
          config: x.value,
          retention: a.snapshot.retention,
          result: l.value.result
        }, null, 8, ["title", "description", "config", "retention", "result"])
      ])) : (s(), o("div", {
        key: 2,
        ref_key: "body",
        ref: m,
        class: "page-body"
      }, [
        e("div", {
          id: `panel-${V.value}`,
          role: "tabpanel",
          "aria-labelledby": `tab-${V.value}`,
          class: "panel"
        }, [
          V.value === "Test" ? (s(), G(In, {
            key: 0,
            result: l.value.result,
            retention: a.snapshot.retention
          }, null, 8, ["result", "retention"])) : f("", !0),
          V.value === "Evals" && a.snapshot.can_edit ? (s(), G(js, {
            key: 1,
            cases: a.snapshot.cases,
            results: l.value.evals,
            proposals: l.value.proposals,
            fields: a.snapshot.config?.fields ?? [],
            saving: a.saving,
            onAddCase: F[3] || (F[3] = (R) => u("add-case", R)),
            onDeleteCase: F[4] || (F[4] = (R) => u("delete-case", R))
          }, null, 8, ["cases", "results", "proposals", "fields", "saving"])) : f("", !0),
          V.value === "Runs" ? (s(), G(Zs, {
            key: 2,
            runs: a.snapshot.runs,
            retention: a.snapshot.retention
          }, null, 8, ["runs", "retention"])) : f("", !0)
        ], 8, vo)
      ], 512))
    ]));
  }
}), po = {
  key: 1,
  class: "error pad-page",
  role: "alert"
}, yo = {
  key: 2,
  class: "empty pad-page",
  role: "status"
}, $o = /* @__PURE__ */ W({
  __name: "Extractor",
  props: {
    id: {},
    back: { type: Boolean }
  },
  emits: ["back"],
  setup(a, { emit: v }) {
    const n = a, u = v, m = B(), V = B(""), x = B(!1);
    let g;
    async function N() {
      if (!n.id) {
        V.value = "No extractor selected.";
        return;
      }
      const b = n.id;
      try {
        const C = await de.get(b);
        b === n.id && (m.value = C, V.value = "");
      } catch (C) {
        V.value = C instanceof Error ? C.message : String(C);
      }
    }
    te(() => n.id, () => {
      m.value = void 0, g?.(), N(), n.id && (g = Ge(`component.${n.id}`, () => N()));
    }, { immediate: !0 }), Ee(() => g?.());
    async function w(b) {
      x.value = !0, V.value = "";
      try {
        await b(), await N();
      } catch (C) {
        V.value = C instanceof Error ? C.message : String(C);
      } finally {
        x.value = !1;
      }
    }
    const l = (b) => w(() => de.update(n.id, b)), t = (b) => w(() => de.addCase(n.id, b)), $ = (b) => w(() => de.deleteCase(n.id, b));
    return (b, C) => m.value ? (s(), G(bo, {
      key: 0,
      snapshot: m.value,
      saving: x.value,
      error: V.value,
      back: a.back,
      onBack: C[0] || (C[0] = (Q) => u("back")),
      onSave: l,
      onAddCase: t,
      onDeleteCase: $
    }, null, 8, ["snapshot", "saving", "error", "back"])) : V.value ? (s(), o("p", po, i(V.value), 1)) : (s(), o("p", yo, "Loading Docscout…"));
  }
});
export {
  $o as _
};
