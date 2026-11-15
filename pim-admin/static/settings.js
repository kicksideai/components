import { _ as Ke, a as Me, e as He, p as ne, g as Je, u as Ne, r as Ue, b as Fe, c as We, W as Ge, s as Ye, P as Ze } from "./styles-vHZl2OOQ.js";
import { defineComponent as Q, openBlock as n, createElementBlock as p, Fragment as J, createBlock as j, unref as l, createCommentVNode as q, createVNode as i, withCtx as m, createTextVNode as N, normalizeClass as ke, createElementVNode as e, resolveDynamicComponent as Qe, toDisplayString as A, renderSlot as se, provide as Xe, computed as H, normalizeStyle as el, renderList as W, inject as ll, useModel as tl, mergeModels as je, ref as E, withKeys as de, withModifiers as X, onMounted as Se, watch as fe, onUnmounted as Ae } from "vue";
import { Icon as K } from "@iconify/vue";
import le from "primevue/tag";
import L from "primevue/button";
import al from "primevue/tabs";
import nl from "primevue/tablist";
import sl from "primevue/tab";
import me from "primevue/message";
import { loadByTagName as ol, on as il, define as dl } from "@wippy-fe/proxy";
import ul from "primevue/multiselect";
import Pe from "primevue/selectbutton";
import xe from "primevue/toggleswitch";
import oe from "primevue/select";
import te from "primevue/inputtext";
import rl from "primevue/inputnumber";
import cl from "primevue/textarea";
const Re = /* @__PURE__ */ Q({
  __name: "SettingsActions",
  props: {
    access: {},
    dirty: { type: Boolean },
    busy: { type: Boolean },
    valid: { type: Boolean },
    reviewed: { type: Boolean },
    canApply: { type: Boolean }
  },
  emits: ["discard", "review", "apply"],
  setup(t, { emit: V }) {
    const a = V;
    return (y, u) => t.access?.admin ? (n(), p(J, { key: 0 }, [
      t.dirty ? (n(), j(l(le), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : q("", !0),
      i(l(L), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: u[0] || (u[0] = (k) => a("discard"))
      }, {
        default: m(() => [
          i(l(K), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[3] || (u[3] = N(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? (n(), j(l(L), {
        key: 2,
        disabled: !t.dirty || t.busy || !t.canApply,
        loading: t.busy,
        onClick: u[2] || (u[2] = (k) => a("apply"))
      }, {
        default: m(() => [...u[5] || (u[5] = [
          N("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"])) : (n(), j(l(L), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: u[1] || (u[1] = (k) => a("review"))
      }, {
        default: m(() => [...u[4] || (u[4] = [
          N("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : q("", !0);
  }
}), ml = { class: "kx-head-icon" }, pl = { class: "kx-head-text" }, fl = { class: "pim-title-line" }, vl = ["title"], yl = { class: "kx-head-actions" }, bl = /* @__PURE__ */ Q({
  __name: "PageHead",
  props: {
    title: {},
    subtitle: {},
    icon: {},
    backLabel: {},
    pane: { type: Boolean }
  },
  emits: ["back"],
  setup(t, { emit: V }) {
    const a = V;
    return (y, u) => (n(), p("header", {
      class: ke(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (n(), j(l(L), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: u[0] || (u[0] = (k) => a("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: m(() => [
          i(l(K), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : q("", !0),
      e("div", ml, [
        i(l(K), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", pl, [
        e("div", fl, [
          (n(), j(Qe(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: m(() => [
              N(A(t.title), 1)
            ]),
            _: 1
          })),
          se(y.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, A(t.subtitle), 9, vl)
      ]),
      e("div", yl, [
        se(y.$slots, "default")
      ])
    ], 2));
  }
});
function gl(t, V, a = {}) {
  const y = JSON.stringify(t), u = JSON.stringify(a);
  return {
    declaration: JSON.parse(y),
    generation: V,
    pluginConfigs: JSON.parse(u),
    matches: (k, b, _ = {}) => V === b && y === JSON.stringify(k) && u === JSON.stringify(_)
  };
}
function qe(t, V) {
  const a = {};
  for (const [y, u] of Object.entries(V)) {
    const k = u.filter((b) => y === "plugins" ? !t.plugins?.some((_) => _.use === b) : y === "scopes" ? !t.scopes?.includes(b) : y === "attributes" ? !t.aspects?.some((_) => _.attributes?.some((d) => _.namespace + "." + d.code === b)) : y === "aspects" ? !t.aspects?.some((_) => _.namespace === b) : y === "dimensions" ? !t.dimensions?.some((_) => _.name === b) : y === "vocabularies" || y === "families" ? !t[y]?.some((_) => _.code === b) : !t[y]?.some((_) => _.id === b));
    k.length && (a[y] = k);
  }
  return a;
}
const Te = (t) => !!t && typeof t == "object" && !Array.isArray(t), G = ["string"], De = { "*": "string" }, hl = { id: "number", code: "string!", type: "string!", scope: G, cardinality: "string", index: "string", index_contexts: [De], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, kl = {
  dimensions: [{ name: "string!", members: G, fallback: { "*": G } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: G }, attributes: [hl] }],
  families: [{ code: "string!", aspects: G, variation: [{ axes: G, own: G }], requirements: [{ id: "string!", context: De, require: G, authored: G }], checks: [{ check: "string!", reads: G, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: G, principals: G, audit: "boolean" }],
  channels: [{ id: "string!", requirements: G, families: G }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: G,
  policy: { "*": "policy" },
  remove: { dimensions: G, vocabularies: G, aspects: G, families: G, sources: G, channels: G, attributes: G, scopes: G, plugins: G }
};
function Oe(t, V, a) {
  if (typeof V == "string") {
    const y = V.replace("!", "");
    if (!(y === "json" || (y === "object" ? Te(t) : y === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === y)) || V.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${a} has an invalid ${y} value.`);
  } else if (Array.isArray(V)) {
    if (!Array.isArray(t)) throw new Error(`${a} must be an array.`);
    t.forEach((y, u) => Oe(y, V[0], `${a}[${u}]`));
  } else {
    if (!Te(t)) throw new Error(`${a} must be an object.`);
    for (const [y, u] of Object.entries(V)) if (typeof u == "string" && u.endsWith("!") && t[y] === void 0) throw new Error(`${a}.${y} is required.`);
    for (const [y, u] of Object.entries(t)) {
      const k = V[y] ?? V["*"];
      if (!k) throw new Error(`${a}.${y} is not an editor field.`);
      Oe(u, k, `${a}.${y}`);
    }
  }
}
function wl(t) {
  const V = JSON.parse(t);
  Oe(V, kl, "Declaration");
  const a = V;
  for (const y of a.dimensions ?? []) y.members ??= [];
  return a;
}
function Ve(t) {
  return JSON.parse(JSON.stringify(t));
}
const Z = /^[a-z][a-z0-9_]*$/;
function he(t, V, a) {
  a.length ? t[V] = a : delete t[V];
}
const Ee = Symbol("definitionColumns"), $l = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, xl = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, _l = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Vl = { class: "pim-definition-grid" }, Cl = {
  key: 0,
  class: "pim-definition-columns",
  "aria-hidden": "true"
}, ye = /* @__PURE__ */ Q({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(t) {
    const V = t;
    Xe(Ee, H(() => V.columns));
    const a = H(() => ["48px", "minmax(160px, 1.4fr)", ...V.columns.map((y) => xl[y]), "80px"].join(" "));
    return (y, u) => (n(), p("section", {
      class: "form pim-definition-list",
      style: el({ "--pim-definition-columns": a.value })
    }, [
      se(y.$slots, "head"),
      e("div", _l, [
        e("div", Vl, [
          t.count > 3 ? (n(), p("div", Cl, [
            u[0] || (u[0] = e("span", null, null, -1)),
            u[1] || (u[1] = e("span", null, "Name", -1)),
            (n(!0), p(J, null, W(t.columns, (k) => (n(), p("span", {
              key: k,
              class: ke("pim-definition-" + k)
            }, A(l($l)[k]), 3))), 128)),
            u[2] || (u[2] = e("span", null, null, -1))
          ])) : q("", !0),
          se(y.$slots, "default")
        ])
      ]),
      se(y.$slots, "add")
    ], 4));
  }
}), Ul = { class: "pim-definition" }, Ol = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Sl = {
  class: "pim-row-title",
  "data-column": "name"
}, Al = ["data-column"], Il = {
  key: 0,
  class: "mono"
}, jl = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, Rl = {
  key: 0,
  class: "pim-definition-body"
}, be = /* @__PURE__ */ Q({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ je({
    title: {},
    code: {},
    kind: {},
    usage: {},
    headClass: {},
    toggleClass: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: /* @__PURE__ */ je(["head-keydown", "head-drop", "head-dragover"], ["update:open"]),
  setup(t, { emit: V }) {
    const a = t, y = ll(Ee, H(() => [
      ...a.code ? ["code"] : [],
      ...a.kind ? ["kind"] : []
    ])), u = tl(t, "open"), k = V;
    return (b, _) => (n(), p("section", Ul, [
      e("header", {
        class: ke(["pim-definition-head", t.headClass]),
        onKeydown: _[1] || (_[1] = (d) => k("head-keydown", d)),
        onDrop: _[2] || (_[2] = (d) => k("head-drop", d)),
        onDragover: _[3] || (_[3] = (d) => k("head-dragover", d))
      }, [
        i(Ke, {
          class: ke(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": u.value,
          onClick: _[0] || (_[0] = (d) => u.value = !u.value)
        }, {
          default: m(() => [
            e("span", Ol, [
              se(b.$slots, "handle"),
              i(l(K), {
                icon: u.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", Sl, A(t.title), 1),
            (n(!0), p(J, null, W(l(y), (d) => (n(), p("span", {
              key: d,
              class: ke("pim-definition-" + d),
              "data-column": d
            }, [
              d === "code" && t.code ? (n(), p("code", Il, A(t.code), 1)) : d === "kind" && t.kind ? (n(), j(l(le), {
                key: 1,
                severity: "secondary",
                value: t.kind
              }, null, 8, ["value"])) : d === "details" ? se(b.$slots, "details", {}, void 0, void 0, 2) : d === "usage" ? se(b.$slots, "usage", {}, () => [
                N(A(t.usage), 1)
              ], void 0, 3) : q("", !0)
            ], 10, Al))), 128))
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", jl, [
          se(b.$slots, "actions")
        ])
      ], 34),
      u.value ? (n(), p("div", Rl, [
        se(b.$slots, "default")
      ])) : q("", !0)
    ]));
  }
});
function ve(t, V) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? V : t;
}
async function ql(t, V) {
  const a = [...new Set(V)].map((u) => ({ type: "user", id: u }));
  if (!a.length) return {};
  const y = await Me(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: a }, "People");
  return Object.fromEntries((y.principals ?? []).map((u) => [u.id, ve(u.label, "Person")]));
}
function Tl(t) {
  const V = Math.abs(t.m).toString(), a = t.m < 0 ? "-" : "";
  if (t.e >= 0) return a + V + "0".repeat(t.e);
  const y = -t.e, u = V.padStart(y + 1, "0");
  return a + u.slice(0, u.length - y) + "." + u.slice(u.length - y);
}
function Y(t) {
  const a = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return a ? a[0].toUpperCase() + a.slice(1) : t;
}
function ze(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
const zl = { class: "pim-chips pim-picker-chips" }, ie = /* @__PURE__ */ Q({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = E("");
    function k(R) {
      return a.modelValue.includes(R);
    }
    function b(R) {
      a.disabled || !R || y("update:modelValue", k(R) ? a.modelValue.filter((P) => P !== R) : [...a.modelValue, R]);
    }
    function _() {
      const R = u.value.trim();
      if (!R || k(R)) {
        u.value = "";
        return;
      }
      y("update:modelValue", [...a.modelValue, R]), u.value = "";
    }
    function d(R) {
      y("update:modelValue", a.modelValue.filter((P) => P !== R));
    }
    function I(R) {
      return a.options?.find((P) => P.value === R)?.label ?? R;
    }
    return (R, P) => (n(), p("div", zl, [
      t.options && t.options.length > 10 ? (n(), p(J, { key: 0 }, [
        (n(!0), p(J, null, W(t.modelValue, (f) => (n(), p("span", {
          key: f,
          class: "row"
        }, [
          N(A(I(f)), 1),
          t.disabled ? q("", !0) : (n(), j(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + f,
            onClick: (r) => d(f),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: m(() => [
              i(l(K), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? q("", !0) : (n(), j(l(oe), {
          key: 0,
          "model-value": "",
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": P[0] || (P[0] = (f) => b(f)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(t.placeholder ?? "Add…") }, ...t.options.filter((f) => !k(f.value)).map((f) => ({ value: f.value, label: String(f.label ?? f.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-label", "options"]))
      ], 64)) : t.options ? (n(), p(J, { key: 1 }, [
        i(l(Pe), {
          "model-value": t.modelValue.filter((f) => t.options.some((r) => r.value === f)),
          options: t.options.map((f) => ({ value: f.value, label: f.label ?? f.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": P[1] || (P[1] = (f) => y("update:modelValue", [...f, ...t.modelValue.filter((r) => !t.options.some((v) => v.value === r))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), p(J, null, W(t.modelValue.filter((f) => !t.options.some((r) => r.value === f)), (f) => (n(), p("span", {
          key: f,
          class: "row"
        }, [
          N(A(I(f)), 1),
          t.disabled ? q("", !0) : (n(), j(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + f,
            onClick: (r) => d(f),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: m(() => [
              i(l(K), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (n(!0), p(J, { key: 2 }, W(t.modelValue, (f) => (n(), p("span", {
        key: f,
        class: "row"
      }, [
        N(A(f), 1),
        t.disabled ? q("", !0) : (n(), j(l(L), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + f,
          onClick: (r) => d(f),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: m(() => [
            i(l(K), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (n(), j(l(te), {
        key: 3,
        modelValue: u.value,
        "onUpdate:modelValue": P[2] || (P[2] = (f) => u.value = f),
        type: "text",
        placeholder: t.placeholder ?? "Add…",
        onKeydown: de(X(_, ["prevent"]), ["enter"]),
        onBlur: _,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : q("", !0)
    ]));
  }
}), Nl = ["inert"], Pl = ["schema", "config"], Dl = {
  key: 1,
  class: "muted small",
  role: "status"
}, Ie = /* @__PURE__ */ Q({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = E("pending");
    async function k() {
      u.value = "pending", u.value = await He("wc-schema-form") ? "ready" : "failed";
    }
    Se(k);
    function b(_) {
      const d = _.detail;
      d && typeof d == "object" && !Array.isArray(d) && y("update:modelValue", d);
    }
    return (_, d) => (n(), p("div", {
      inert: t.disabled || void 0
    }, [
      u.value === "ready" ? (n(), p("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(a.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: b
      }, null, 40, Pl)) : u.value === "pending" ? (n(), p("span", Dl, "Configuration form is loading.")) : (n(), j(l(me), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: m(() => [
          d[2] || (d[2] = N("Configuration form could not be loaded. ", -1)),
          i(l(L), {
            type: "button",
            disabled: t.disabled,
            onClick: k,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [...d[1] || (d[1] = [
              N("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      i(l(L), {
        type: "button",
        disabled: t.disabled,
        onClick: d[0] || (d[0] = (I) => y("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: m(() => [
          i(l(K), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          d[3] || (d[3] = N(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, Nl));
  }
}), El = /* @__PURE__ */ Q({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => {
      const d = a.type?.form;
      let I = { type: "string" };
      return d === "bool" ? I = { type: "boolean" } : d === "int" ? I = { type: "integer" } : d === "dec" ? I = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : d === "quantity" ? I = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(a.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : d === "record" ? I = { type: "object", additionalProperties: !0 } : d === "ref" && (I = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${a.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (a.attribute.cardinality ?? "one") !== "one" && (I = { type: "array", items: I, uniqueItems: a.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...I, title: "Default value" } } };
    });
    function k(d) {
      return d && typeof d == "object" && "m" in d && "e" in d ? Tl(d) : d;
    }
    function b(d) {
      return a.type?.form === "dec" ? k(d) : a.type?.form === "quantity" && d && typeof d == "object" && "v" in d && "u" in d ? { value: k(d.v), unit: d.u } : d;
    }
    const _ = H(() => a.attribute.default === void 0 ? {} : { value: Array.isArray(a.attribute.default) ? a.attribute.default.map(b) : b(a.attribute.default) });
    return (d, I) => (n(), j(Ie, {
      schema: u.value,
      "model-value": _.value,
      "onUpdate:modelValue": I[0] || (I[0] = (R) => y("change", R.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Bl = { class: "pim-stack" }, Ll = { class: "pim-bsection-head" }, Kl = {
  key: 0,
  class: "mono muted small"
}, Ml = { class: "pim-source-permissions" }, Hl = ["for"], Jl = ["onDragstart"], Fl = { class: "pim-fields" }, Wl = { class: "pim-f pim-w-third" }, Gl = { class: "pim-f-label" }, Yl = {
  key: 0,
  class: "pim-f-note"
}, Zl = { class: "pim-f pim-w-third" }, Ql = { class: "pim-f-label" }, Xl = {
  key: 0,
  class: "pim-f-note"
}, et = { class: "pim-f pim-w-third" }, lt = {
  key: 0,
  class: "pim-f pim-w-third"
}, tt = {
  key: 1,
  class: "pim-f pim-w-third"
}, at = { class: "pim-f pim-w-third" }, nt = { class: "pim-f pim-w-third" }, st = { class: "pim-f pim-w-half" }, ot = { class: "pim-f pim-w-half" }, it = { class: "row" }, dt = {
  key: 2,
  class: "pim-f pim-w-full"
}, ut = { class: "pim-contexts" }, rt = { class: "small muted" }, ct = {
  key: 3,
  class: "pim-f pim-w-half"
}, mt = {
  key: 4,
  class: "pim-f pim-w-full"
}, pt = { class: "row end" }, ft = { class: "row pim-add-row" }, vt = { class: "form" }, yt = { class: "pim-aspect row pim-add-row" }, bt = /* @__PURE__ */ Q({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = ["quarter", "third", "half", "full"], k = ["one", "list", "set"], b = H(() => a.draft.aspects ?? []), _ = H(() => (a.draft.dimensions ?? []).map((o) => ({ value: o.name, label: Y(o.name) }))), d = H(() => (a.draft.vocabularies ?? []).map((o) => o.code)), I = H(() => (a.draft.sources ?? []).map((o) => ({ value: o.id, label: Y(o.id) }))), R = H(() => [...a.options.types].sort((o, c) => o.form.localeCompare(c.form)).map((o) => ({ value: o.id, label: f(o) })));
    function P(o) {
      return a.options.types.find((c) => c.id === o.type);
    }
    function f(o) {
      return ve(o.title, "Field type");
    }
    function r(o) {
      return P(o)?.target === "term";
    }
    function v(o) {
      const c = P(o);
      return !!c && c.form === "ref" && !c.target;
    }
    function s(o, c) {
      return c.id !== void 0 && a.schema.attributes[o + "." + c.code] !== void 0;
    }
    function C(o) {
      const c = (a.draft.families ?? []).filter((U) => U.aspects?.includes(o)).length;
      return c + (c === 1 ? " family" : " families");
    }
    const O = E({});
    function g(o, c) {
      return o + "." + (c.id ?? c.code);
    }
    function S(o, c) {
      o.type = c;
      const U = P(o);
      if (U && o.index && !U.indexes.includes(o.index) && delete o.index, r(o) || delete o.vocabulary, !v(o) && o.config && "target" in o.config) {
        const { target: w, ...F } = o.config;
        o.config = Object.keys(F).length ? F : void 0, o.config || delete o.config;
      }
    }
    function h(o, c) {
      Object.keys(c).length ? o.config = c : delete o.config;
    }
    function $(o, c) {
      const U = { ...o.config ?? {} };
      c ? U.target = c : delete U.target, h(o, U);
    }
    function D(o, c) {
      c.length ? o.scope = c : delete o.scope, c.length || delete o.index_contexts, c.length && delete o.default;
    }
    function x(o, c, U) {
      U === void 0 || U === "" || U === !1 && c !== "default" ? delete o[c] : o[c] = U;
    }
    function B(o) {
      return o.index_contexts ?? [];
    }
    function ee(o) {
      return (a.draft.dimensions ?? []).find((c) => c.name === o)?.members ?? [];
    }
    function ae(o) {
      const c = {};
      for (const w of o.scope ?? []) c[w] = ee(w)[0] ?? "";
      (o.index_contexts ?? (o.index_contexts = [])).push(c);
    }
    const ge = E(null);
    function we(o, c) {
      ge.value?.namespace === o.namespace && T(o.attributes ?? [], ge.value.index, c), ge.value = null;
    }
    const pe = E("");
    function $e() {
      const o = pe.value.trim();
      !Z.test(o) || b.value.some((c) => c.namespace === o) || ((a.draft.aspects ??= []).push({ namespace: o, attributes: [] }), pe.value = "");
    }
    function Ce(o) {
      const c = b.value.indexOf(o);
      c >= 0 && b.value.splice(c, 1), a.schema.declaration.aspects?.some((U) => U.namespace === o.namespace) && y("remove", "aspects", o.namespace);
    }
    const ue = E({});
    function re(o) {
      const c = (ue.value[o.namespace] ?? "").trim(), U = o.attributes ?? (o.attributes = []);
      if (!Z.test(c) || U.some((z) => z.code === c)) return;
      const w = a.options.types.find((z) => z.id === "kickside.pim.types:text") ?? a.options.types[0], F = { code: c, type: w?.id ?? "" };
      U.push(F), ue.value[o.namespace] = "", O.value[g(o.namespace, F)] = !0;
    }
    function M(o, c) {
      const U = o.attributes ?? [], w = U.indexOf(c);
      w >= 0 && U.splice(w, 1), s(o.namespace, c) && y("remove", "attributes", o.namespace + "." + c.code);
    }
    function T(o, c, U) {
      if (U < 0 || U >= o.length) return;
      const [w] = o.splice(c, 1);
      o.splice(U, 0, w);
    }
    return (o, c) => (n(), p("div", Bl, [
      (n(!0), p(J, null, W(b.value, (U) => (n(), j(ye, {
        key: U.namespace,
        count: U.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: m(() => [
          e("header", Ll, [
            e("div", null, [
              e("h3", null, [
                N(A(l(Y)(U.namespace)), 1),
                l(Y)(U.namespace).toLocaleLowerCase() !== U.namespace.toLocaleLowerCase() ? (n(), p("span", Kl, A(U.namespace), 1)) : q("", !0)
              ]),
              e("div", Ml, [
                e("label", {
                  for: "writers-" + U.namespace
                }, "Sources allowed to write", 8, Hl),
                i(l(ul), {
                  "input-id": "writers-" + U.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": U.write?.sources ?? [],
                  options: I.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (w) => U.write = { sources: w }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                c[4] || (c[4] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this aspect.", -1))
              ])
            ]),
            i(l(L), {
              type: "button",
              onClick: (w) => Ce(U),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), { icon: "tabler:trash" }),
                c[5] || (c[5] = N(" Remove aspect", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: m(() => [
          e("div", ft, [
            i(l(te), {
              modelValue: ue.value[U.namespace],
              "onUpdate:modelValue": (w) => ue.value[U.namespace] = w,
              type: "text",
              placeholder: "new_field",
              onKeydown: de(X((w) => re(U), ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(Z).test(ue.value[U.namespace] ?? ""),
              onClick: (w) => re(U),
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                c[21] || (c[21] = N(" Add field", -1))
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ])
        ]),
        default: m(() => [
          (n(!0), p(J, null, W(U.attributes ?? [], (w, F) => (n(), j(be, {
            key: g(U.namespace, w),
            open: O.value[g(U.namespace, w)],
            "onUpdate:open": (z) => O.value[g(U.namespace, w)] = z,
            title: l(Y)(w.code),
            code: U.namespace + "." + w.code,
            kind: P(w) ? f(P(w)) : "Unknown type",
            usage: C(U.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: c[2] || (c[2] = X(() => {
            }, ["prevent"])),
            onHeadDrop: X((z) => we(U, F), ["prevent"]),
            onHeadKeydown: [
              X((z) => T(U.attributes ?? [], F, F - 1), ["alt", "prevent"]),
              X((z) => T(U.attributes ?? [], F, F + 1), ["alt", "prevent"])
            ]
          }, {
            handle: m(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: c[0] || (c[0] = X(() => {
                }, ["stop"])),
                onDragstart: X((z) => ge.value = { namespace: U.namespace, index: F }, ["stop"]),
                onDragend: c[1] || (c[1] = (z) => ge.value = null)
              }, [
                i(l(K), { icon: "tabler:grip-vertical" })
              ], 40, Jl)
            ]),
            details: m(() => [
              w.cardinality && w.cardinality !== "one" ? (n(), j(l(le), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N(A(w.cardinality), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              w.scope?.length ? (n(), j(l(le), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N("per " + A(w.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              w.index && w.index !== "none" ? (n(), j(l(le), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N(A(w.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              w.unique ? (n(), j(l(le), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [...c[6] || (c[6] = [
                  N("unique", -1)
                ])]),
                _: 1
              })) : q("", !0)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                disabled: F === 0,
                "aria-label": "Move " + w.code + " earlier",
                onClick: (z) => T(U.attributes, F, F - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(K), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              i(l(L), {
                type: "button",
                disabled: F === (U.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + w.code + " later",
                onClick: (z) => T(U.attributes, F, F + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(K), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: m(() => [
              e("div", Fl, [
                e("div", Wl, [
                  e("div", Gl, [
                    c[7] || (c[7] = e("label", null, "Code", -1)),
                    s(U.namespace, w) ? (n(), p("span", Yl, "renames keep values")) : q("", !0)
                  ]),
                  i(l(te), {
                    type: "text",
                    value: w.code,
                    onInput: (z) => w.code = z.target.value,
                    class: "mono"
                  }, null, 8, ["value", "onInput"])
                ]),
                e("div", Zl, [
                  e("div", Ql, [
                    c[8] || (c[8] = e("label", null, "Type", -1)),
                    s(U.namespace, w) ? (n(), p("span", Xl, "fixed once values exist")) : q("", !0)
                  ]),
                  i(l(oe), {
                    "model-value": w.type,
                    disabled: s(U.namespace, w),
                    options: R.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (z) => S(w, z)
                  }, null, 8, ["model-value", "disabled", "options", "onUpdate:modelValue"])
                ]),
                e("div", et, [
                  c[9] || (c[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Cardinality")
                  ], -1)),
                  i(l(oe), {
                    "model-value": w.cardinality ?? "one",
                    disabled: s(U.namespace, w),
                    options: k,
                    appendTo: "self",
                    "onUpdate:modelValue": (z) => x(w, "cardinality", z === "one" ? void 0 : z)
                  }, null, 8, ["model-value", "disabled", "onUpdate:modelValue"])
                ]),
                r(w) ? (n(), p("div", lt, [
                  c[10] || (c[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  i(l(oe), {
                    "model-value": w.vocabulary ?? "",
                    "onUpdate:modelValue": (z) => x(w, "vocabulary", z),
                    options: [{ value: "", label: "Choose…" }, ...d.value.map((z) => ({ value: z, label: String(z) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : q("", !0),
                v(w) ? (n(), p("div", tt, [
                  c[11] || (c[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  i(l(oe), {
                    "model-value": w.config?.target ?? "",
                    "onUpdate:modelValue": (z) => $(w, z),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((z) => ({ value: z.kind, label: l(ve)(z.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : q("", !0),
                e("div", at, [
                  c[12] || (c[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  i(l(oe), {
                    "model-value": w.index ?? "none",
                    options: P(w)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (z) => x(w, "index", z === "none" ? void 0 : z)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", nt, [
                  c[13] || (c[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  i(l(Pe), {
                    "model-value": w.width ?? t.schema.attributes[U.namespace + "." + w.code]?.width ?? "half",
                    options: u,
                    "allow-empty": !1,
                    "onUpdate:modelValue": (z) => w.width = z
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", st, [
                  c[14] || (c[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  i(ie, {
                    "model-value": w.scope ?? [],
                    options: _.value,
                    disabled: s(U.namespace, w),
                    "onUpdate:modelValue": (z) => D(w, z)
                  }, null, 8, ["model-value", "options", "disabled", "onUpdate:modelValue"])
                ]),
                e("div", ot, [
                  c[15] || (c[15] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", it, [
                    i(l(xe), {
                      "aria-label": "Unique " + w.code,
                      "model-value": w.unique === !0,
                      disabled: !!w.scope?.length || (w.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (z) => x(w, "unique", z)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, A(w.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (w.scope?.length ?? 0) > 0 && w.index && w.index !== "none" ? (n(), p("div", dt, [
                  c[17] || (c[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", ut, [
                    (n(!0), p(J, null, W(B(w), (z, _e) => (n(), p("div", {
                      key: _e,
                      class: "pim-context-row"
                    }, [
                      (n(!0), p(J, null, W(w.scope, (ce) => (n(), p("label", {
                        key: ce,
                        class: "pim-context-field"
                      }, [
                        e("span", rt, A(l(Y)(ce)), 1),
                        i(l(oe), {
                          "model-value": z[ce] ?? "",
                          options: ee(ce),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (Le) => z[ce] = Le
                        }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      i(l(L), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (ce) => B(w).splice(_e, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: m(() => [
                          i(l(K), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    i(l(L), {
                      type: "button",
                      onClick: (z) => ae(w),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(K), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        c[16] || (c[16] = N(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : q("", !0),
                w.scope?.length ? q("", !0) : (n(), p("div", ct, [
                  c[18] || (c[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  i(El, {
                    attribute: w,
                    type: P(w),
                    onChange: (z) => x(w, "default", z)
                  }, null, 8, ["attribute", "type", "onChange"])
                ])),
                P(w)?.config_schema ? (n(), p("div", mt, [
                  c[19] || (c[19] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  i(Ie, {
                    schema: P(w).config_schema,
                    "model-value": w.config ?? {},
                    "onUpdate:modelValue": (z) => h(w, z)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ])) : q("", !0)
              ]),
              e("div", pt, [
                i(l(L), {
                  type: "button",
                  onClick: (z) => M(U, w),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: m(() => [
                    i(l(K), { icon: "tabler:trash" }),
                    c[20] || (c[20] = N(" Remove field", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "title", "code", "kind", "usage", "onHeadDrop", "onHeadKeydown"]))), 128))
        ]),
        _: 2
      }, 1032, ["count"]))), 128)),
      e("section", vt, [
        e("div", yt, [
          i(l(te), {
            modelValue: pe.value,
            "onUpdate:modelValue": c[3] || (c[3] = (U) => pe.value = U),
            type: "text",
            placeholder: "new_aspect",
            onKeydown: de(X($e, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(Z).test(pe.value),
            onClick: $e,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(K), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              c[22] || (c[22] = N(" Add aspect", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          c[23] || (c[23] = e("span", { class: "muted small" }, "An aspect groups fields and can be written by named sources only.", -1))
        ])
      ])
    ]));
  }
}), gt = { class: "muted small" }, ht = { class: "pim-aspect" }, kt = {
  key: 0,
  class: "small muted"
}, wt = { class: "pim-fields" }, $t = { class: "pim-f pim-w-full" }, xt = { class: "pim-f-label" }, _t = { class: "row pim-add-row" }, Vt = /* @__PURE__ */ Q({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => a.draft.dimensions ?? []), k = E("");
    function b() {
      const f = k.value.trim();
      !Z.test(f) || u.value.some((r) => r.name === f) || ((a.draft.dimensions ??= []).push({ name: f, members: [] }), k.value = "");
    }
    function _(f) {
      const r = [];
      for (const v of a.draft.aspects ?? []) for (const s of v.attributes ?? []) s.scope?.includes(f.name) && r.push(v.namespace + "." + s.code);
      for (const v of a.draft.families ?? []) for (const s of v.requirements ?? []) s.context && f.name in s.context && r.push(v.code + " requirement " + s.id);
      return r;
    }
    function d(f) {
      _(f).length || (u.value.splice(u.value.indexOf(f), 1), a.schema.declaration.dimensions?.some((r) => r.name === f.name) && y("remove", "dimensions", f.name));
    }
    function I(f, r) {
      if (f.members = r, f.fallback)
        for (const v of Object.keys(f.fallback)) r.includes(v) || delete f.fallback[v];
    }
    function R(f, r) {
      return f.fallback?.[r] ?? [];
    }
    function P(f, r, v) {
      const s = { ...f.fallback ?? {} };
      v.length ? s[r] = v : delete s[r], Object.keys(s).length ? f.fallback = s : delete f.fallback;
    }
    return (f, r) => (n(), j(ye, {
      count: u.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: m(() => [
        e("div", _t, [
          i(l(te), {
            modelValue: k.value,
            "onUpdate:modelValue": r[0] || (r[0] = (v) => k.value = v),
            type: "text",
            placeholder: "new_dimension",
            onKeydown: de(X(b, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(Z).test(k.value),
            onClick: b,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(K), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              r[3] || (r[3] = N(" Add dimension", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          r[4] || (r[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
        ])
      ]),
      default: m(() => [
        (n(!0), p(J, null, W(u.value, (v) => (n(), j(be, {
          title: l(Y)(v.name),
          code: v.name,
          key: v.name,
          usage: _(v).length + (_(v).length === 1 ? " dependency" : " dependencies")
        }, {
          details: m(() => [
            e("span", gt, A(v.members.length) + " " + A(v.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              disabled: _(v).length > 0,
              "aria-label": "Remove " + l(Y)(v.name),
              title: _(v).length ? "Take the dimension off these first" : "",
              onClick: (s) => d(v),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: m(() => [
            e("div", ht, [
              _(v).length ? (n(), p("p", kt, "Used by " + A(_(v).join(", ")), 1)) : q("", !0),
              e("div", wt, [
                e("div", $t, [
                  r[1] || (r[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  i(ie, {
                    "model-value": v.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (s) => I(v, s)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                (n(!0), p(J, null, W(v.members, (s) => (n(), p("div", {
                  key: s,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", xt, [
                    e("label", null, A(s) + " falls back to", 1),
                    r[2] || (r[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  i(ie, {
                    "model-value": R(v, s),
                    options: v.members.filter((C) => C !== s).map((C) => ({ value: C })),
                    "onUpdate:modelValue": (C) => P(v, s, C)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]))), 128))
              ])
            ])
          ]),
          _: 2
        }, 1032, ["title", "code", "usage"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Ct = { class: "muted small" }, Ut = { class: "pim-aspect" }, Ot = { class: "row small" }, St = {
  key: 1,
  class: "muted small"
}, At = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, It = {
  key: 1,
  class: "pim-grid compact"
}, jt = { key: 0 }, Rt = { class: "mono" }, qt = {
  key: 0,
  class: "mono muted"
}, Tt = { class: "num" }, zt = {
  key: 2,
  class: "muted small"
}, Nt = { class: "row" }, Pt = { class: "row wrap pim-add-row" }, Dt = { class: "row pim-add-row" }, Et = /* @__PURE__ */ Q({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => a.draft.vocabularies ?? []), k = E("");
    function b() {
      const $ = k.value.trim();
      !Z.test($) || u.value.some((D) => D.code === $) || ((a.draft.vocabularies ??= []).push({ code: $ }), k.value = "");
    }
    function _($) {
      u.value.splice(u.value.indexOf($), 1), a.schema.declaration.vocabularies?.some((D) => D.code === $.code) && y("remove", "vocabularies", $.code);
    }
    function d($) {
      return !!a.schema.vocabularies[$];
    }
    const I = E({}), R = E({}), P = E({}), f = E({}), r = E({}), v = E({}), s = E({});
    async function C($, D) {
      r.value[$] = !0;
      try {
        const x = await ne.termsPage(a.catalogId, $, D);
        R.value[$] = x.terms, f.value[$] = D, P.value[$] = x.next;
      } catch (x) {
        v.value[$] = x instanceof Error ? x.message : "Could not load terms.";
      } finally {
        r.value[$] = !1;
      }
    }
    function O($) {
      I.value[$] = !I.value[$], I.value[$] && !R.value[$] && C($);
    }
    function g($) {
      return s.value[$] ?? (s.value[$] = { code: "", label: "", parent: "" });
    }
    async function S($) {
      const D = g($.code);
      if (Z.test(D.code)) {
        r.value[$.code] = !0, v.value[$.code] = "";
        try {
          const x = { term: { vocabulary: $.code, code: D.code }, labels: { en: D.label || Y(D.code) } };
          $.hierarchical && D.parent && (x.parent = D.parent);
          const ee = (await ne.apply(a.catalogId, [x])).outcomes[0];
          if (ee.outcome !== "created" && ee.outcome !== "updated") throw new Error(ee.findings?.[0]?.message ?? "The term was not accepted.");
          s.value[$.code] = { code: "", label: "", parent: "" }, ne.invalidateTerms(a.catalogId), await C($.code, f.value[$.code]);
        } catch (x) {
          v.value[$.code] = x instanceof Error ? x.message : "Could not add the term.";
        } finally {
          r.value[$.code] = !1;
        }
      }
    }
    async function h($, D, x) {
      r.value[$.code] = !0, v.value[$.code] = "";
      try {
        const ee = (await ne.apply(a.catalogId, [{ term: { vocabulary: $.code, code: D.code }, retired: x }])).outcomes[0];
        if (!ee || !["updated", "unchanged"].includes(ee.outcome)) throw new Error(ee?.findings?.map((ae) => ae.message ?? ae.code).join("; ") || "The term change was not accepted.");
        ne.invalidateTerms(a.catalogId), await C($.code, f.value[$.code]);
      } catch (B) {
        v.value[$.code] = B instanceof Error ? B.message : "Could not change the term.";
      } finally {
        r.value[$.code] = !1;
      }
    }
    return ($, D) => (n(), j(ye, {
      count: u.value.length,
      columns: ["code", "details"]
    }, {
      add: m(() => [
        e("div", Dt, [
          i(l(te), {
            modelValue: k.value,
            "onUpdate:modelValue": D[0] || (D[0] = (x) => k.value = x),
            type: "text",
            placeholder: "new_vocabulary",
            onKeydown: de(X(b, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(Z).test(k.value),
            onClick: b,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(K), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              D[8] || (D[8] = N(" Add vocabulary", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          D[9] || (D[9] = e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1))
        ])
      ]),
      default: m(() => [
        (n(!0), p(J, null, W(u.value, (x) => (n(), j(be, {
          title: l(Y)(x.code),
          code: x.code,
          key: x.code
        }, {
          details: m(() => [
            e("span", Ct, A(x.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              "aria-label": "Remove " + l(Y)(x.code),
              onClick: (B) => _(x),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: m(() => [
            e("div", Ut, [
              e("label", Ot, [
                i(l(xe), {
                  "aria-label": "Hierarchical " + x.code,
                  "model-value": x.hierarchical === !0,
                  "onUpdate:modelValue": (B) => B ? x.hierarchical = !0 : delete x.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                D[1] || (D[1] = e("span", null, "Hierarchical", -1))
              ]),
              d(x.code) ? (n(), j(l(L), {
                key: 0,
                type: "button",
                onClick: (B) => O(x.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: m(() => [
                  i(l(K), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  N(" " + A(I.value[x.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (n(), p("span", St, "Apply the schema before adding terms.")),
              I.value[x.code] ? (n(), p("div", At, [
                v.value[x.code] ? (n(), j(l(me), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: m(() => [
                    N(A(v.value[x.code]), 1)
                  ]),
                  _: 2
                }, 1024)) : q("", !0),
                (R.value[x.code] ?? []).length ? (n(), p("table", It, [
                  e("thead", null, [
                    e("tr", null, [
                      D[2] || (D[2] = e("th", null, "Code", -1)),
                      D[3] || (D[3] = e("th", null, "Label", -1)),
                      x.hierarchical ? (n(), p("th", jt, "Parent")) : q("", !0),
                      D[4] || (D[4] = e("th", null, null, -1))
                    ])
                  ]),
                  e("tbody", null, [
                    (n(!0), p(J, null, W(R.value[x.code], (B) => (n(), p("tr", {
                      key: B.code,
                      class: ke({ muted: B.retired })
                    }, [
                      e("td", Rt, A(B.code), 1),
                      e("td", null, A(l(ze)(B)), 1),
                      x.hierarchical ? (n(), p("td", qt, A(B.parent ?? ""), 1)) : q("", !0),
                      e("td", Tt, [
                        i(l(L), {
                          type: "button",
                          disabled: r.value[x.code],
                          onClick: (ee) => h(x, B, !B.retired),
                          text: "",
                          severity: "secondary",
                          size: "small"
                        }, {
                          default: m(() => [
                            N(A(B.retired ? "Restore" : "Retire"), 1)
                          ]),
                          _: 2
                        }, 1032, ["disabled", "onClick"])
                      ])
                    ], 2))), 128))
                  ])
                ])) : r.value[x.code] ? q("", !0) : (n(), p("p", zt, "No terms yet.")),
                e("div", Nt, [
                  i(l(L), {
                    type: "button",
                    disabled: r.value[x.code] || !f.value[x.code],
                    onClick: (B) => C(x.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(K), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      D[5] || (D[5] = N(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  i(l(L), {
                    type: "button",
                    disabled: r.value[x.code] || !P.value[x.code],
                    onClick: (B) => C(x.code, P.value[x.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(K), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      D[6] || (D[6] = N(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", Pt, [
                  i(l(te), {
                    modelValue: g(x.code).code,
                    "onUpdate:modelValue": (B) => g(x.code).code = B,
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  i(l(te), {
                    modelValue: g(x.code).label,
                    "onUpdate:modelValue": (B) => g(x.code).label = B,
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  x.hierarchical ? (n(), j(l(oe), {
                    key: 0,
                    modelValue: g(x.code).parent,
                    "onUpdate:modelValue": (B) => g(x.code).parent = B,
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...(R.value[x.code] ?? []).map((B) => ({ value: B.code, label: String(l(ze)(B)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : q("", !0),
                  i(l(L), {
                    type: "button",
                    disabled: r.value[x.code] || !l(Z).test(g(x.code).code),
                    onClick: (B) => S(x),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(K), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      D[7] || (D[7] = N(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : q("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Bt = { class: "muted small" }, Lt = { class: "pim-aspect" }, Kt = { class: "pim-fields" }, Mt = { class: "pim-f pim-w-full" }, Ht = { class: "pim-aspect" }, Jt = { class: "pim-stack tight" }, Ft = { class: "pim-level-head" }, Wt = { class: "pim-fields" }, Gt = { class: "pim-f pim-w-half" }, Yt = { class: "pim-f pim-w-half" }, Zt = { class: "pim-aspect" }, Qt = { class: "pim-stack tight" }, Xt = { class: "pim-level-head" }, ea = { class: "mono" }, la = { class: "pim-fields" }, ta = { class: "pim-f-label" }, aa = { class: "pim-f pim-w-half" }, na = { class: "pim-f pim-w-half" }, sa = { class: "row pim-add-row" }, oa = { class: "row pim-add-row" }, ia = /* @__PURE__ */ Q({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => (a.draft.families ?? []).filter((g) => g.code !== "generic")), k = H(() => {
      const g = (a.draft.aspects ?? []).map((h) => h.namespace), S = [...new Set(Object.entries(a.schema.attributes).filter(([, h]) => h.plugin).map(([h]) => h.split(".")[0]))];
      return [...g, ...S.filter((h) => !g.includes(h))].map((h) => ({ value: h, label: Y(h) }));
    });
    function b(g) {
      const S = [];
      for (const h of a.draft.aspects ?? []) if (g.aspects?.includes(h.namespace)) for (const $ of h.attributes ?? []) S.push({ value: h.namespace + "." + $.code, label: Y($.code) + " (" + h.namespace + ")" });
      for (const [h, $] of Object.entries(a.schema.attributes)) $.plugin && g.aspects?.includes(h.split(".")[0]) && !S.some((D) => D.value === h) && S.push({ value: h, label: Y(h) + " (" + h.split(".")[0] + ")" });
      return S;
    }
    const _ = H(() => a.draft.dimensions ?? []), d = E("");
    function I() {
      const g = d.value.trim();
      !Z.test(g) || (a.draft.families ?? []).some((S) => S.code === g) || ((a.draft.families ??= []).push({ code: g, aspects: [] }), d.value = "");
    }
    function R(g) {
      a.draft.families.splice(a.draft.families.indexOf(g), 1), a.schema.declaration.families?.some((S) => S.code === g.code) && y("remove", "families", g.code);
    }
    function P(g) {
      return g.variation ?? [];
    }
    function f(g) {
      (g.variation ??= []).push({ axes: [] });
    }
    function r(g) {
      return g.requirements ?? [];
    }
    const v = E({});
    function s(g) {
      const S = (v.value[g.code] ?? "").trim();
      !Z.test(S) || r(g).some((h) => h.id === S) || ((g.requirements ??= []).push({ id: S, require: [] }), v.value[g.code] = "");
    }
    function C(g, S) {
      return g.context?.[S] ?? "";
    }
    function O(g, S, h) {
      const $ = { ...g.context ?? {} };
      h ? $[S] = h : delete $[S], Object.keys($).length ? g.context = $ : delete g.context;
    }
    return (g, S) => (n(), j(ye, {
      count: u.value.length,
      columns: ["code", "details"]
    }, {
      add: m(() => [
        e("div", oa, [
          i(l(te), {
            modelValue: d.value,
            "onUpdate:modelValue": S[0] || (S[0] = (h) => d.value = h),
            type: "text",
            placeholder: "new_family",
            onKeydown: de(X(I, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(Z).test(d.value),
            onClick: I,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(K), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              S[11] || (S[11] = N(" Add family", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          S[12] || (S[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
        ])
      ]),
      default: m(() => [
        (n(!0), p(J, null, W(u.value, (h) => (n(), j(be, {
          title: l(Y)(h.code),
          code: h.code,
          key: h.code
        }, {
          details: m(() => [
            e("span", Bt, A(h.aspects?.length ?? 0) + " " + A(h.aspects?.length === 1 ? "aspect" : "aspects"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              onClick: ($) => R(h),
              "aria-label": "Remove " + l(Y)(h.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: m(() => [
            e("div", Lt, [
              e("div", Kt, [
                e("div", Mt, [
                  S[1] || (S[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Aspects"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  i(ie, {
                    "model-value": h.aspects ?? [],
                    options: k.value,
                    "onUpdate:modelValue": ($) => l(he)(h, "aspects", $)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", Ht, [
              S[5] || (S[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", Jt, [
                (n(!0), p(J, null, W(P(h), ($, D) => (n(), p("div", {
                  key: D,
                  class: "pim-level"
                }, [
                  e("div", Ft, [
                    e("strong", null, "Level " + A(D + 1), 1),
                    i(l(L), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (x) => P(h).splice(D, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(K), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Wt, [
                    e("div", Gt, [
                      S[2] || (S[2] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes"),
                        e("span", { class: "pim-f-note" }, "key-indexed, one value each")
                      ], -1)),
                      i(ie, {
                        "model-value": $.axes ?? [],
                        options: b(h),
                        "onUpdate:modelValue": (x) => $.axes = x
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Yt, [
                      S[3] || (S[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here"),
                        e("span", { class: "pim-f-note" }, "other fields written at this level")
                      ], -1)),
                      i(ie, {
                        "model-value": $.own ?? [],
                        options: b(h),
                        "onUpdate:modelValue": (x) => x.length ? $.own = x : delete $.own
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                i(l(L), {
                  type: "button",
                  onClick: ($) => f(h),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: m(() => [
                    i(l(K), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    S[4] || (S[4] = N(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Zt, [
              S[10] || (S[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Qt, [
                (n(!0), p(J, null, W(r(h), ($, D) => (n(), p("div", {
                  key: $.id,
                  class: "pim-level"
                }, [
                  e("div", Xt, [
                    e("strong", ea, A($.id), 1),
                    i(l(L), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (x) => r(h).splice(D, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(K), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", la, [
                    (n(!0), p(J, null, W(_.value, (x) => (n(), p("div", {
                      key: x.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", ta, [
                        e("label", null, A(l(Y)(x.name)), 1),
                        S[6] || (S[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      i(l(oe), {
                        "model-value": C($, x.name),
                        "onUpdate:modelValue": (B) => O($, x.name, B),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...x.members.map((B) => ({ value: B, label: String(B) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", aa, [
                      S[7] || (S[7] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      i(ie, {
                        "model-value": $.require ?? [],
                        options: b(h),
                        "onUpdate:modelValue": (x) => l(he)($, "require", x)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", na, [
                      S[8] || (S[8] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      i(ie, {
                        "model-value": $.authored ?? [],
                        options: b(h),
                        "onUpdate:modelValue": (x) => l(he)($, "authored", x)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                e("div", sa, [
                  i(l(te), {
                    modelValue: v.value[h.code],
                    "onUpdate:modelValue": ($) => v.value[h.code] = $,
                    type: "text",
                    placeholder: "requirement_id",
                    onKeydown: de(X(($) => s(h), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  i(l(L), {
                    type: "button",
                    disabled: !l(Z).test(v.value[h.code] ?? ""),
                    onClick: ($) => s(h),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(K), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      S[9] || (S[9] = N(" Add requirement", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), da = ["inert"], ua = {
  key: 0,
  class: "row wrap"
}, ra = {
  key: 2,
  class: "small muted"
}, ca = { class: "pim-principal-service" }, ma = /* @__PURE__ */ Q({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = E(!1), k = E(""), b = E({});
    let _ = 0;
    fe(() => a.modelValue, async (f) => {
      const r = ++_;
      try {
        const v = await ql(a.catalogId ?? "", f);
        r === _ && (b.value = v);
      } catch {
        r === _ && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ae(() => {
      _++;
    });
    function d(f) {
      return b.value[f] ?? ve(f, "Person");
    }
    Se(async () => {
      try {
        await ol("wc-principal-picker"), u.value = !0;
      } catch {
        u.value = !1;
      }
    });
    function I(f) {
      a.disabled || !f.trim() || a.modelValue.includes(f.trim()) || (y("update:modelValue", [...a.modelValue, f.trim()]), k.value = "");
    }
    function R(f) {
      const r = f.detail;
      if (!r || typeof r != "object") return;
      const v = r, s = v.principal_id ?? v.id;
      typeof s == "string" && I(s);
    }
    function P(f) {
      a.disabled || y("update:modelValue", a.modelValue.filter((r) => r !== f));
    }
    return (f, r) => (n(), p("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (n(), p("div", ua, [
        (n(!0), p(J, null, W(t.modelValue, (v) => (n(), j(l(le), {
          key: v,
          severity: "secondary"
        }, {
          default: m(() => [
            e("span", null, A(d(v)), 1),
            i(l(L), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + d(v),
              onClick: (s) => P(v)
            }, {
              default: m(() => [
                i(l(K), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : q("", !0),
      u.value ? (n(), p("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: X(R, ["stop"])
      }, null, 32)) : (n(), p("span", ra, "The person picker is unavailable.")),
      e("label", ca, [
        r[3] || (r[3] = e("span", { class: "small muted" }, "Service account", -1)),
        i(l(te), {
          modelValue: k.value,
          "onUpdate:modelValue": r[0] || (r[0] = (v) => k.value = v),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: r[1] || (r[1] = de(X((v) => I(k.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      i(l(L), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !k.value.trim(),
        onClick: r[2] || (r[2] = (v) => I(k.value))
      }, {
        default: m(() => [
          i(l(K), { icon: "tabler:plus" }),
          r[4] || (r[4] = N(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, da));
  }
}), pa = { class: "pim-stack" }, fa = { class: "muted small" }, va = { class: "pim-fields" }, ya = { class: "pim-f pim-w-half" }, ba = { class: "pim-f pim-w-half" }, ga = { class: "row pim-add-row" }, ha = { class: "muted small" }, ka = { class: "pim-fields" }, wa = { class: "pim-f pim-w-third" }, $a = { class: "pim-f pim-w-third" }, xa = { class: "row" }, _a = { class: "pim-f pim-w-third" }, Va = { class: "pim-f pim-w-full" }, Ca = { class: "row pim-add-row" }, Ua = /* @__PURE__ */ Q({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => a.draft.channels ?? []), k = H(() => a.draft.sources ?? []), b = H(() => [...new Set((a.draft.families ?? []).flatMap((s) => (s.requirements ?? []).map((C) => C.id)))].map((s) => ({ value: s }))), _ = H(() => (a.draft.families ?? []).filter((s) => s.code !== "generic").map((s) => ({ value: s.code, label: Y(s.code) }))), d = H(() => (a.draft.aspects ?? []).map((s) => ({ value: s.namespace, label: Y(s.namespace) }))), I = E(""), R = E("");
    function P() {
      const s = I.value.trim();
      !Z.test(s) || u.value.some((C) => C.id === s) || ((a.draft.channels ??= []).push({ id: s, requirements: [] }), I.value = "");
    }
    function f(s) {
      u.value.splice(u.value.indexOf(s), 1), a.schema.declaration.channels?.some((C) => C.id === s.id) && y("remove", "channels", s.id);
    }
    function r() {
      const s = R.value.trim();
      !Z.test(s) || k.value.some((C) => C.id === s) || ((a.draft.sources ??= []).push({ id: s, ordering: "none", writes: [] }), R.value = "");
    }
    function v(s) {
      k.value.splice(k.value.indexOf(s), 1), a.schema.declaration.sources?.some((C) => C.id === s.id) && y("remove", "sources", s.id);
    }
    return (s, C) => (n(), p("div", pa, [
      i(ye, {
        count: u.value.length,
        columns: ["code", "details"]
      }, {
        head: m(() => [...C[2] || (C[2] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: m(() => [
          e("div", ga, [
            i(l(te), {
              modelValue: I.value,
              "onUpdate:modelValue": C[0] || (C[0] = (O) => I.value = O),
              type: "text",
              placeholder: "new_channel",
              onKeydown: de(X(P, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(Z).test(I.value),
              onClick: P,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                C[5] || (C[5] = N(" Add channel", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: m(() => [
          (n(!0), p(J, null, W(u.value, (O) => (n(), j(be, {
            key: O.id,
            title: l(Y)(O.id),
            code: O.id
          }, {
            details: m(() => [
              e("span", fa, A(O.requirements?.length ?? 0) + " " + A(O.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                onClick: (g) => f(O),
                "aria-label": "Remove " + l(Y)(O.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(K), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: m(() => [
              e("div", va, [
                e("div", ya, [
                  C[3] || (C[3] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  i(ie, {
                    "model-value": O.requirements ?? [],
                    options: b.value,
                    "onUpdate:modelValue": (g) => l(he)(O, "requirements", g)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ba, [
                  C[4] || (C[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  i(ie, {
                    "model-value": O.families ?? [],
                    options: _.value,
                    "onUpdate:modelValue": (g) => l(he)(O, "families", g)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i(ye, {
        count: k.value.length,
        columns: ["code", "details"]
      }, {
        head: m(() => [...C[6] || (C[6] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: m(() => [
          e("div", Ca, [
            i(l(te), {
              modelValue: R.value,
              "onUpdate:modelValue": C[1] || (C[1] = (O) => R.value = O),
              type: "text",
              placeholder: "new_source",
              onKeydown: de(X(r, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(Z).test(R.value),
              onClick: r,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(K), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                C[11] || (C[11] = N(" Add source", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: m(() => [
          (n(!0), p(J, null, W(k.value, (O) => (n(), j(be, {
            key: O.id,
            title: l(Y)(O.id),
            code: O.id
          }, {
            details: m(() => [
              e("span", ha, A(O.writes?.length ?? 0) + " " + A(O.writes?.length === 1 ? "aspect" : "aspects"), 1)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                onClick: (g) => v(O),
                "aria-label": "Remove " + l(Y)(O.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(K), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: m(() => [
              e("div", ka, [
                e("div", wa, [
                  C[7] || (C[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  i(l(oe), {
                    "model-value": O.ordering ?? "none",
                    "onUpdate:modelValue": (g) => O.ordering = g,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", $a, [
                  C[8] || (C[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", xa, [
                    i(l(xe), {
                      "aria-label": "Audit " + O.id,
                      "model-value": O.audit !== !1,
                      "onUpdate:modelValue": (g) => g ? delete O.audit : O.audit = !1
                    }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, A(O.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", _a, [
                  C[9] || (C[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  i(ma, {
                    "catalog-id": t.catalogId,
                    "model-value": O.principals ?? [],
                    "onUpdate:modelValue": (g) => l(he)(O, "principals", g)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", Va, [
                  C[10] || (C[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "aspects this source may set")
                  ], -1)),
                  i(ie, {
                    "model-value": O.writes ?? [],
                    options: d.value,
                    "onUpdate:modelValue": (g) => l(he)(O, "writes", g)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Oa = { class: "pim-stack" }, Sa = { class: "pim-bsection-head" }, Aa = { class: "muted small" }, Ia = {
  key: 0,
  class: "pim-aspect muted"
}, ja = {
  key: 1,
  class: "muted small"
}, Ra = {
  key: 3,
  class: "muted small"
}, qa = {
  key: 0,
  class: "pim-aspect muted"
}, Ta = { class: "muted small" }, za = /* @__PURE__ */ Q({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = H(() => a.draft.plugins ?? []);
    function k(r) {
      return u.value.some((v) => v.use === r.plugin);
    }
    function b(r) {
      return a.schema.plugins.find((v) => v.plugin === r.plugin);
    }
    function _(r, v) {
      v && !k(r) && (a.draft.plugins ??= []).push({ use: r.plugin }), v || (a.draft.plugins = u.value.filter((s) => s.use !== r.plugin), delete a.pluginConfigs[r.plugin], b(r)?.active && y("remove", "plugins", r.plugin));
    }
    function d(r, v) {
      a.pluginConfigs[r.plugin] = v;
    }
    function I(r) {
      return Object.entries(a.schema.attributes).filter(([, v]) => v.plugin === r.plugin).map(([v]) => v);
    }
    const R = H(() => a.draft.scopes ?? []);
    function P(r) {
      return R.value.includes(r.id);
    }
    function f(r, v) {
      v && !P(r) && (a.draft.scopes ??= []).push(r.id), !v && P(r) && (R.value.splice(R.value.indexOf(r.id), 1), a.schema.declaration.scopes?.includes(r.id) && y("remove", "scopes", r.id));
    }
    return (r, v) => (n(), p("div", Oa, [
      i(ye, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: m(() => [
          e("header", Sa, [
            v[0] || (v[0] = e("h3", null, "Plugins", -1)),
            e("span", Aa, A(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: m(() => [
          t.options.plugins.length === 0 ? (n(), p("div", Ia, "No plugin is installed.")) : q("", !0),
          (n(!0), p(J, null, W(t.options.plugins, (s) => (n(), j(be, {
            key: s.plugin,
            title: l(ve)(s.title, "Plugin")
          }, {
            details: m(() => [
              i(l(le), {
                severity: k(s) ? "success" : "secondary",
                value: k(s) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: m(() => [
              i(l(xe), {
                "aria-label": "Enable " + l(ve)(s.title, "Plugin"),
                "model-value": k(s),
                "onUpdate:modelValue": (C) => _(s, C)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: m(() => [
              b(s)?.problem ? (n(), j(l(me), {
                key: 0,
                severity: "warn"
              }, {
                default: m(() => [
                  N(A(b(s)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : q("", !0),
              I(s).length ? (n(), p("p", ja, "Fields: " + A(I(s).join(", ")) + ".", 1)) : q("", !0),
              k(s) ? (n(), j(Ie, {
                key: 2,
                schema: s.config_schema,
                "model-value": t.pluginConfigs[s.plugin] ?? b(s)?.config ?? {},
                "onUpdate:modelValue": (C) => d(s, C)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : q("", !0),
              b(s)?.active ? (n(), p("p", Ra, [
                N(A(b(s)?.lifecycle.state), 1),
                (n(!0), p(J, null, W(b(s)?.projections, (C, O) => (n(), p("span", { key: O }, " · " + A(O) + ": " + A(C.parked ? "paused" : C.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : q("", !0),
              b(s)?.active && t.pluginConfigs[s.plugin] ? (n(), j(l(L), {
                key: 4,
                label: "Save configuration",
                onClick: (C) => y("configure", s.plugin, t.pluginConfigs[s.plugin])
              }, null, 8, ["onClick"])) : q("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i(ye, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: m(() => [...v[1] || (v[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: m(() => [
          t.options.scopes.length === 0 ? (n(), p("div", qa, "No scope is declared.")) : q("", !0),
          (n(!0), p(J, null, W(t.options.scopes, (s) => (n(), j(be, {
            key: s.id,
            title: l(ve)(s.title, "Scope")
          }, {
            details: m(() => [
              i(l(le), {
                severity: P(s) ? "success" : "secondary",
                value: P(s) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: m(() => [
              i(l(xe), {
                "aria-label": "Adopt " + l(ve)(s.title, "Scope"),
                "model-value": P(s),
                "onUpdate:modelValue": (C) => f(s, C)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: m(() => [
              e("p", Ta, [
                v[2] || (v[2] = N("Filters: ", -1)),
                (n(!0), p(J, null, W(s.filters, (C, O) => (n(), j(l(le), {
                  key: O,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: m(() => [
                    N(A(O) + " · " + A(C.ops.join(" ")), 1)
                  ]),
                  _: 2
                }, 1024))), 128)),
                N(" · needs " + A(s.access) + " access", 1)
              ])
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
async function Na(t) {
  const V = await Je(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (V.audit !== "fields" && V.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((a) => typeof V[a] == "number" && Number.isSafeInteger(V[a])))
    throw new Error("Policy defaults are unavailable.");
  for (const [a, y] of Object.entries(Be)) {
    const u = V[a];
    if (typeof u != "number" || !Number.isSafeInteger(u) || u < y.min || u > y.max) throw new Error(`Policy ${a} is unavailable.`);
  }
  return V;
}
const Be = {
  proposal_days: {
    min: 1,
    max: 3650,
    title: "Proposal retention (days)",
    global: !1
  },
  completed_work_days: {
    min: 1,
    max: 3650,
    title: "Completed release work retention (days)",
    global: !1
  },
  abandoned_work_days: {
    min: 1,
    max: 3650,
    title: "Abandoned release work retention (days)",
    global: !1
  },
  import_days: {
    min: 1,
    max: 3650,
    title: "Completed import retention (days)",
    global: !1
  },
  pending_creation_days: {
    min: 1,
    max: 3650,
    title: "Unfinished catalog expiry (days)",
    global: !0
  },
  proposal_count: {
    min: 1,
    max: 1e3,
    title: "Proposal quota",
    global: !1
  },
  proposal_bytes: {
    min: 1024,
    max: 262144,
    title: "Proposal size (bytes)",
    global: !1
  },
  command_deadline_ms: {
    min: 100,
    max: 5e3,
    title: "Time limit per catalog change (ms)",
    global: !1
  },
  maintenance_rows: {
    min: 20,
    max: 500,
    title: "Records per cleanup pass",
    global: !0
  },
  maintenance_catalogs: {
    min: 1,
    max: 10,
    title: "Catalogs per cleanup pass",
    global: !0
  },
  rebuild_rows: {
    min: 1,
    max: 500,
    title: "Products per rebuild step",
    global: !1
  },
  job_batches: {
    min: 1,
    max: 20,
    title: "Product groups per work session",
    global: !1
  },
  import_rows: {
    min: 1,
    max: 200,
    title: "Products per import step",
    global: !1
  }
}, Pa = { class: "form" }, Da = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, Ea = ["id", "data-policy-group", "aria-label"], Ba = {
  key: 0,
  class: "pim-bsection-head"
}, La = { class: "pim-policy-copy" }, Ka = ["for"], Ma = ["id"], Ha = { key: 0 }, Ja = ["aria-expanded"], Fa = /* @__PURE__ */ Q({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const V = t, a = E(), y = H(() => V.defaults ?? a.value), u = E(""), k = E(!1);
    async function b() {
      if (!V.defaults) {
        u.value = "", k.value = !0;
        try {
          a.value = await Na(V.catalogId ?? "");
        } catch (O) {
          u.value = O instanceof Error ? O.message : "Could not read policy defaults.";
        } finally {
          k.value = !1;
        }
      }
    }
    Se(b);
    const _ = H(() => V.draft.policy ?? {}), d = E(!1), I = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], R = {
      proposal_days: "How long proposals stay in this catalog before removal.",
      proposal_count: "Maximum number of stored proposals in this catalog.",
      completed_work_days: "How long finished release work stays in this catalog.",
      abandoned_work_days: "How long unfinished release work stays before removal.",
      import_days: "How long finished imports stay in this catalog.",
      pending_creation_days: "How long an unfinished catalog creation stays before removal.",
      proposal_bytes: "Maximum data size of one proposal in this catalog.",
      command_deadline_ms: "Maximum time one catalog change can run before it stops.",
      maintenance_rows: "Maximum records cleaned up in one maintenance pass.",
      maintenance_catalogs: "Maximum catalogs cleaned up in one maintenance pass.",
      rebuild_rows: "Maximum products updated together during a catalog rebuild.",
      job_batches: "Maximum groups of products processed in one background work session.",
      import_rows: "Maximum products read together from an import."
    };
    function P(O) {
      const g = Be[O];
      return { key: O, ...g, kind: "int", hint: R[O] };
    }
    I.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(P));
    const f = ["proposal_days", "proposal_count"].map(P), r = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(P), v = [
      { id: "retention", title: "Retention", keys: I },
      { id: "proposals", title: "Proposals", keys: f },
      { id: "advanced", title: "", keys: r }
    ], s = H(() => [
      { value: "inherited", label: y.value ? `${y.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function C(O, g) {
      const S = V.draft.policy ?? (V.draft.policy = {});
      S[O] = g == null || g === "" || g === "inherited" ? !1 : g;
    }
    return (O, g) => (n(), p("section", Pa, [
      g[4] || (g[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      k.value ? (n(), p("p", Da, "Loading deployment defaults…")) : q("", !0),
      u.value ? (n(), j(l(me), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: m(() => [
          N(A(u.value) + " ", 1),
          i(l(L), {
            severity: "secondary",
            outlined: "",
            onClick: b
          }, {
            default: m(() => [...g[1] || (g[1] = [
              N("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : q("", !0),
      (n(), p(J, null, W(v, (S) => (n(), p(J, {
        key: S.id
      }, [
        S.id !== "advanced" || d.value ? (n(), p("section", {
          key: 0,
          id: S.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": S.id,
          class: "pim-policy-group",
          "aria-label": S.title || "Advanced"
        }, [
          S.title ? (n(), p("header", Ba, [
            e("h3", null, A(S.title), 1)
          ])) : q("", !0),
          (n(!0), p(J, null, W(S.keys, (h) => (n(), p("div", {
            key: h.key,
            class: "pim-policy-row"
          }, [
            e("div", La, [
              e("label", {
                for: "pol-" + h.key
              }, A(h.title), 9, Ka),
              e("p", {
                id: "pol-help-" + h.key
              }, [
                N(A(h.hint), 1),
                h.global ? (n(), p("span", Ha, " Managed in deployment settings.")) : q("", !0)
              ], 8, Ma)
            ]),
            h.kind === "enum" ? (n(), j(l(oe), {
              key: 0,
              "input-id": "pol-" + h.key,
              "aria-describedby": "pol-help-" + h.key,
              class: "pim-policy-control",
              "model-value": typeof _.value[h.key] == "string" ? _.value[h.key] : "inherited",
              options: s.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": ($) => C(h.key, $)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (n(), j(l(rl), {
              key: 1,
              disabled: h.global,
              "input-id": "pol-" + h.key,
              "aria-describedby": "pol-help-" + h.key,
              class: "pim-policy-control",
              "model-value": h.global ? Number(y.value?.[h.key] ?? 0) || null : typeof _.value[h.key] == "number" ? Number(_.value[h.key]) : null,
              min: h.min ?? (h.key === "audit_days" ? 0 : 1),
              max: h.max,
              step: 1,
              placeholder: y.value ? "Default: " + y.value[h.key] : "Deployment default",
              "onUpdate:modelValue": ($) => C(h.key, $)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, Ea)) : q("", !0),
        S.id === "proposals" ? (n(), p("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": d.value,
          "aria-controls": "policy-advanced",
          onClick: g[0] || (g[0] = (h) => d.value = !d.value)
        }, [
          i(l(K), {
            icon: d.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          g[2] || (g[2] = e("span", null, "Advanced", -1)),
          g[3] || (g[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Ja)) : q("", !0)
      ], 64))), 64))
    ]));
  }
}), Wa = { class: "form" }, Ga = { class: "pim-aspect" }, Ya = /* @__PURE__ */ Q({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = E(JSON.stringify(a.draft, null, 2)), k = E("");
    fe(() => a.draft, (_) => {
      u.value = JSON.stringify(_, null, 2), k.value = "";
    }, { deep: !0 });
    function b() {
      try {
        const _ = wl(u.value);
        k.value = "", y("validity", !0), y("replace", _);
      } catch (_) {
        y("validity", !1), k.value = "Invalid declaration: " + (_ instanceof Error ? _.message : String(_));
      }
    }
    return (_, d) => (n(), p("section", Wa, [
      e("div", Ga, [
        d[1] || (d[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        k.value ? (n(), j(l(me), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: m(() => [
            N(A(k.value), 1)
          ]),
          _: 1
        })) : q("", !0),
        i(l(cl), {
          modelValue: u.value,
          "onUpdate:modelValue": d[0] || (d[0] = (I) => u.value = I),
          rows: "28",
          spellcheck: "false",
          onInput: b,
          onBlur: b,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Za = {
  key: 0,
  class: "pim-detail-head"
}, Qa = { class: "pim-detail-actions" }, Xa = { class: "pim-settings-pane" }, en = { class: "pim-builder-main pim-readable" }, ln = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, tn = ["disabled", "inert"], an = {
  key: 5,
  class: "pim-table pim-plan"
}, nn = { class: "pim-group-head" }, sn = { class: "pim-card-body pad" }, on = {
  key: 0,
  class: "muted"
}, dn = {
  key: 1,
  class: "muted small"
}, un = {
  key: 2,
  class: "muted small"
}, rn = {
  key: 3,
  class: "muted small"
}, cn = { key: 0 }, mn = {
  key: 5,
  class: "pim-plan-list"
}, pn = { class: "mono" }, fn = { class: "muted" }, vn = /* @__PURE__ */ Q({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back"],
  setup(t, { emit: V }) {
    const a = t, y = V, u = [
      { id: "fields", title: "Fields" },
      { id: "dimensions", title: "Dimensions" },
      { id: "vocabularies", title: "Vocabularies" },
      { id: "families", title: "Families" },
      { id: "channels", title: "Channels & sources" },
      { id: "plugins", title: "Plugins & scopes" },
      { id: "policy", title: "Policy" },
      { id: "declaration", title: "Declaration" }
    ], k = E("fields"), b = E(null), _ = E(null), d = E({}), I = E({}), R = E({}), P = H(() => Object.fromEntries(Object.entries(R.value).filter(([M]) => d.value.plugins?.some((T) => T.use === M) && !b.value?.plugins.some((T) => T.plugin === M && T.active)))), f = E(""), r = E(!1), v = E(""), s = E(null), C = E(null), O = E(!0), g = Ue(), S = H(() => O.value && !!s.value && s.value.class !== "refused" && !!C.value?.matches(we.value, b.value?.schema_generation ?? -1, P.value)), h = Ue(), $ = E(!1);
    let D = 0;
    fe([d, I, R], () => {
      D++, s.value = null;
    }, { deep: !0, flush: "sync" });
    async function x(M = !1, T = !1) {
      if (ae.value && !M) return;
      const o = h.begin(), c = D, U = a.catalogId, w = T ? Object.entries(R.value).filter(([F]) => b.value?.plugins.some((z) => z.plugin === F && z.active)) : [];
      $.value = !0, f.value = "";
      try {
        const [F, z] = await Promise.all([ne.schema(U), ne.schemaOptions(U)]);
        if (!h.current(o) || c !== D || U !== a.catalogId) return;
        b.value = F, _.value = z, d.value = Ve(F.declaration), I.value = {}, R.value = Object.fromEntries(w.filter(([_e]) => F.plugins.some((ce) => ce.plugin === _e && ce.active))), s.value = null, O.value = !0;
      } catch (F) {
        h.current(o) && (f.value = F instanceof Error ? F.message : "Could not load the schema.");
      } finally {
        h.current(o) && ($.value = !1);
      }
    }
    let B = () => {
    };
    fe(() => a.catalogId, (M) => {
      B(), B = il(`component.${M}`, () => {
        ae.value || x();
      });
    }, { immediate: !0 }), Ne(async () => {
      ae.value || await x();
    }), Ae(() => {
      B(), g.begin(), h.begin();
    }), fe(() => a.catalogId, () => {
      g.begin(), r.value = !1, b.value = null, _.value = null, ue(), x();
    });
    const ee = H(() => Object.values(qe(d.value, I.value)).reduce((M, T) => M + (T?.length ?? 0), 0)), ae = H(() => !!b.value && (JSON.stringify(d.value) !== JSON.stringify(b.value.declaration) || ee.value > 0 || Object.keys(R.value).length > 0)), ge = H(() => ![d.value.aspects, d.value.dimensions, d.value.vocabularies, d.value.families, d.value.channels, d.value.sources, d.value.plugins, d.value.scopes].some((M) => M?.length)), we = H(() => {
      const M = Ve(d.value), T = qe(M, I.value);
      return Object.keys(T).length && (M.remove = T), M;
    });
    fe(ae, (M) => {
      M || (s.value = null);
    }), fe([we, P], () => {
      s.value = null;
    }, { deep: !0 });
    async function pe() {
      if (!b.value || !O.value) return;
      const M = g.begin(), T = gl(we.value, b.value.schema_generation, P.value);
      r.value = !0, f.value = "";
      try {
        const o = await ne.planSchema(a.catalogId, T.declaration, T.generation, T.pluginConfigs);
        if (!g.current(M) || !T.matches(we.value, b.value.schema_generation, P.value) || !O.value) return;
        C.value = T, s.value = o;
      } catch (o) {
        if (!g.current(M)) return;
        f.value = o instanceof Error ? o.message : "Could not review the change.", s.value = null, C.value = null;
      } finally {
        g.current(M) && (r.value = !1);
      }
    }
    async function $e() {
      if (!b.value || !ae.value || !S.value || !C.value) return;
      const M = a.catalogId, T = g.begin();
      r.value = !0, f.value = "", v.value = "";
      try {
        const o = await ne.applySchema(M, C.value.declaration, C.value.generation, C.value.pluginConfigs);
        if (M !== a.catalogId || !g.current(T) || (await x(!0, !0), M !== a.catalogId || !g.current(T))) return;
        v.value = `Applied as generation ${o.generation} (${o.class})`, y("applied", o.generation);
      } catch (o) {
        if (M !== a.catalogId || !g.current(T)) return;
        f.value = o instanceof Error ? o.message : "Could not apply the change.";
      } finally {
        g.current(T) && (r.value = !1);
      }
    }
    async function Ce(M, T) {
      const o = a.catalogId, c = h.begin(), U = g.begin();
      r.value = !0, f.value = "";
      try {
        const w = JSON.stringify(T);
        if (await ne.configurePlugin(o, M, Ve(T)), o !== a.catalogId || !h.current(c)) return;
        const F = await ne.schema(o);
        if (o !== a.catalogId || !h.current(c)) return;
        b.value && (b.value.plugins = F.plugins), JSON.stringify(R.value[M]) === w && delete R.value[M], v.value = "Configuration saved";
      } catch (w) {
        o === a.catalogId && g.current(U) && (f.value = w instanceof Error ? w.message : "Could not save configuration.");
      } finally {
        g.current(U) && (r.value = !1);
      }
    }
    function ue() {
      R.value = {}, O.value = !0, b.value && (d.value = Ve(b.value.declaration)), I.value = {}, s.value = null, v.value = "";
    }
    function re(M, T) {
      const o = I.value[M] ?? [];
      o.includes(T) || (I.value = { ...I.value, [M]: [...o, T] });
    }
    return (M, T) => (n(), p("div", {
      class: ke(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (n(), p("div", Za, [
        e("h2", null, A(t.title || "Catalog"), 1),
        i(l(le), {
          severity: "secondary",
          value: "Generation " + (b.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Qa, [
          se(M.$slots, "actions", {
            access: b.value?.access
          }),
          i(Re, {
            access: b.value?.access,
            dirty: ae.value,
            busy: r.value,
            valid: O.value,
            reviewed: !!s.value,
            "can-apply": S.value,
            onDiscard: ue,
            onReview: pe,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (n(), j(bl, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (b.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: T[0] || (T[0] = (o) => y("back"))
      }, {
        default: m(() => [
          se(M.$slots, "actions", {
            access: b.value?.access
          }),
          i(Re, {
            access: b.value?.access,
            dirty: ae.value,
            busy: r.value,
            valid: O.value,
            reviewed: !!s.value,
            "can-apply": S.value,
            onDiscard: ue,
            onReview: pe,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      i(l(al), {
        value: k.value,
        "onUpdate:value": T[1] || (T[1] = (o) => k.value = o),
        class: "pim-section-tabs"
      }, {
        default: m(() => [
          i(l(nl), { "aria-label": "Schema sections" }, {
            default: m(() => [
              (n(), p(J, null, W(u, (o) => i(l(sl), {
                key: o.id,
                value: o.id
              }, {
                default: m(() => [
                  N(A(o.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", Xa, [
        e("div", en, [
          f.value ? (n(), j(l(me), {
            key: 0,
            severity: "error",
            role: "alert"
          }, {
            default: m(() => [
              N(A(f.value), 1)
            ]),
            _: 1
          })) : q("", !0),
          v.value ? (n(), j(l(me), {
            key: 1,
            severity: "success"
          }, {
            default: m(() => [
              N(A(v.value), 1)
            ]),
            _: 1
          })) : q("", !0),
          $.value && (!b.value || !_.value) ? (n(), p("div", ln, "Loading…")) : (!b.value || !_.value) && f.value ? (n(), j(l(L), {
            key: 3,
            onClick: T[2] || (T[2] = (o) => x()),
            severity: "secondary",
            outlined: ""
          }, {
            default: m(() => [...T[5] || (T[5] = [
              N("Retry", -1)
            ])]),
            _: 1
          })) : b.value && _.value ? (n(), p("fieldset", {
            key: 4,
            class: "pim-editor-surface",
            disabled: r.value || !b.value.access.admin,
            inert: r.value || !b.value.access.admin
          }, [
            ge.value && k.value === "fields" ? (n(), j(l(me), {
              key: 0,
              severity: "info"
            }, {
              default: m(() => [...T[6] || (T[6] = [
                N("No catalog definitions yet. Add an aspect to start defining fields.", -1)
              ])]),
              _: 1
            })) : q("", !0),
            k.value === "fields" ? (n(), j(bt, {
              key: 1,
              draft: d.value,
              schema: b.value,
              options: _.value,
              onRemove: re
            }, null, 8, ["draft", "schema", "options"])) : k.value === "dimensions" ? (n(), j(Vt, {
              key: 2,
              draft: d.value,
              schema: b.value,
              onRemove: re
            }, null, 8, ["draft", "schema"])) : k.value === "vocabularies" ? (n(), j(Et, {
              key: 3,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: b.value,
              onRemove: re
            }, null, 8, ["catalog-id", "draft", "schema"])) : k.value === "families" ? (n(), j(ia, {
              key: 4,
              draft: d.value,
              schema: b.value,
              onRemove: re
            }, null, 8, ["draft", "schema"])) : k.value === "channels" ? (n(), j(Ua, {
              key: 5,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: b.value,
              onRemove: re
            }, null, 8, ["catalog-id", "draft", "schema"])) : k.value === "plugins" ? (n(), j(za, {
              key: 6,
              draft: d.value,
              schema: b.value,
              options: _.value,
              "plugin-configs": R.value,
              onConfigure: Ce,
              onRemove: re
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : k.value === "policy" ? (n(), j(Fa, {
              key: 7,
              "catalog-id": t.catalogId,
              draft: d.value
            }, null, 8, ["catalog-id", "draft"])) : k.value === "declaration" ? (n(), j(Ya, {
              key: 8,
              draft: d.value,
              onReplace: T[3] || (T[3] = (o) => d.value = o),
              onValidity: T[4] || (T[4] = (o) => {
                O.value = o, s.value = null;
              })
            }, null, 8, ["draft"])) : q("", !0)
          ], 8, tn)) : q("", !0),
          s.value ? (n(), p("div", an, [
            e("div", nn, [
              i(l(K), { icon: "tabler:checklist" }),
              T[7] || (T[7] = e("h3", null, "Review", -1)),
              i(l(le), {
                class: "kx-tag-sm",
                severity: s.value.class === "refused" ? "danger" : s.value.class === "semantic" ? "warn" : "info"
              }, {
                default: m(() => [
                  N(A(s.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", sn, [
              s.value.class === "unchanged" ? (n(), p("p", on, "Nothing would change.")) : s.value.class === "cosmetic" ? (n(), p("p", dn, "Labels, order, widths or choices only; no product is touched.")) : s.value.class === "additive" ? (n(), p("p", un, "New fields or options; existing values stay as they are.")) : s.value.class === "semantic" ? (n(), p("p", rn, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (n(), j(l(me), {
                key: 4,
                severity: "error"
              }, {
                default: m(() => [
                  T[8] || (T[8] = N("Refused: the draft cannot be compiled as it stands.", -1)),
                  s.value.migration ? (n(), p("span", cn, A(s.value.migration), 1)) : q("", !0)
                ]),
                _: 1
              })),
              s.value.changes.length || s.value.refused.length ? (n(), p("ul", mn, [
                (n(!0), p(J, null, W([...s.value.refused, ...s.value.changes], (o, c) => (n(), p("li", { key: c }, [
                  i(l(le), {
                    class: "kx-tag-sm small",
                    severity: o.class === "refused" ? "danger" : o.class === "semantic" ? "warn" : "info"
                  }, {
                    default: m(() => [
                      N(A(o.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", pn, A(o.code), 1),
                  e("span", fn, A(o.what), 1)
                ]))), 128))
              ])) : q("", !0)
            ])
          ])) : q("", !0)
        ])
      ])
    ], 2));
  }
}), yn = /* @__PURE__ */ Q({
  __name: "SettingsApp",
  setup(t) {
    const V = Fe(), a = We(), y = E(""), u = H(() => V.value.catalogId ?? ""), k = Ue();
    async function b() {
      const _ = k.begin(), d = u.value;
      try {
        const I = await ne.catalogSummary(d);
        k.current(_) && (y.value = I?.title || "Untitled catalog");
      } catch {
        k.current(_) && (y.value = "Untitled catalog");
      }
    }
    return fe(u, () => {
      y.value = "", b();
    }), Ne(b), Ae(() => {
      k.begin();
    }), (_, d) => u.value ? (n(), j(vn, {
      key: u.value,
      "catalog-id": u.value,
      title: y.value || "Catalog",
      embedded: l(V).embedded,
      "back-label": l(V).embedded ? void 0 : "Back to catalog settings",
      onBack: d[0] || (d[0] = (I) => l(a)("navigate", { route: "" }))
    }, null, 8, ["catalog-id", "title", "embedded", "back-label"])) : q("", !0);
  }
});
class bn extends Ge {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Ye
    };
  }
  static get vueConfig() {
    return { rootComponent: yn, plugins: [Ze] };
  }
}
dl(import.meta.url, bn);
