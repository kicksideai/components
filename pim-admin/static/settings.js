import { _ as Ke, a as Me, e as He, p as se, g as Je, u as Ne, r as Ue, b as Fe, c as We, W as Ge, s as Ze, P as Ye } from "./styles-vHZl2OOQ.js";
import { defineComponent as Q, openBlock as n, createElementBlock as v, Fragment as F, createBlock as I, unref as l, createCommentVNode as z, createVNode as i, withCtx as m, createTextVNode as N, normalizeClass as we, createElementVNode as e, resolveDynamicComponent as Qe, toDisplayString as A, renderSlot as oe, provide as Xe, computed as J, normalizeStyle as el, renderList as G, inject as ll, useModel as tl, mergeModels as je, ref as B, withKeys as ue, withModifiers as X, onMounted as Se, watch as ye, onUnmounted as Ae } from "vue";
import { Icon as M } from "@iconify/vue";
import ae from "primevue/tag";
import L from "primevue/button";
import al from "primevue/tabs";
import nl from "primevue/tablist";
import sl from "primevue/tab";
import fe from "primevue/message";
import { loadByTagName as ol, on as il, define as dl } from "@wippy-fe/proxy";
import ul from "primevue/multiselect";
import Pe from "primevue/selectbutton";
import xe from "primevue/toggleswitch";
import ie from "primevue/select";
import ne from "primevue/inputtext";
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
  setup(t, { emit: x }) {
    const a = x;
    return (y, u) => t.access?.admin ? (n(), v(F, { key: 0 }, [
      t.dirty ? (n(), I(l(ae), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : z("", !0),
      i(l(L), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: u[0] || (u[0] = (h) => a("discard"))
      }, {
        default: m(() => [
          i(l(M), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[3] || (u[3] = N(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? (n(), I(l(L), {
        key: 2,
        disabled: !t.dirty || t.busy || !t.canApply,
        loading: t.busy,
        onClick: u[2] || (u[2] = (h) => a("apply"))
      }, {
        default: m(() => [...u[5] || (u[5] = [
          N("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"])) : (n(), I(l(L), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: u[1] || (u[1] = (h) => a("review"))
      }, {
        default: m(() => [...u[4] || (u[4] = [
          N("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : z("", !0);
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
  setup(t, { emit: x }) {
    const a = x;
    return (y, u) => (n(), v("header", {
      class: we(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (n(), I(l(L), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: u[0] || (u[0] = (h) => a("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: m(() => [
          i(l(M), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : z("", !0),
      e("div", ml, [
        i(l(M), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", pl, [
        e("div", fl, [
          (n(), I(Qe(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: m(() => [
              N(A(t.title), 1)
            ]),
            _: 1
          })),
          oe(y.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, A(t.subtitle), 9, vl)
      ]),
      e("div", yl, [
        oe(y.$slots, "default")
      ])
    ], 2));
  }
});
function gl(t, x, a = {}) {
  const y = JSON.stringify(t), u = JSON.stringify(a);
  return {
    declaration: JSON.parse(y),
    generation: x,
    pluginConfigs: JSON.parse(u),
    matches: (h, b, $ = {}) => x === b && y === JSON.stringify(h) && u === JSON.stringify($)
  };
}
function qe(t, x) {
  const a = {};
  for (const [y, u] of Object.entries(x)) {
    const h = u.filter((b) => y === "plugins" ? !t.plugins?.some(($) => $.use === b) : y === "scopes" ? !t.scopes?.includes(b) : y === "attributes" ? !t.aspects?.some(($) => $.attributes?.some((d) => $.namespace + "." + d.code === b)) : y === "aspects" ? !t.aspects?.some(($) => $.namespace === b) : y === "dimensions" ? !t.dimensions?.some(($) => $.name === b) : y === "vocabularies" || y === "families" ? !t[y]?.some(($) => $.code === b) : !t[y]?.some(($) => $.id === b));
    h.length && (a[y] = h);
  }
  return a;
}
const Te = (t) => !!t && typeof t == "object" && !Array.isArray(t), Z = ["string"], De = { "*": "string" }, hl = { id: "number", code: "string!", type: "string!", scope: Z, cardinality: "string", index: "string", index_contexts: [De], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, kl = {
  dimensions: [{ name: "string!", members: Z, fallback: { "*": Z } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: Z }, attributes: [hl] }],
  families: [{ code: "string!", aspects: Z, variation: [{ axes: Z, own: Z }], requirements: [{ id: "string!", context: De, require: Z, authored: Z }], checks: [{ check: "string!", reads: Z, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: Z, principals: Z, audit: "boolean" }],
  channels: [{ id: "string!", requirements: Z, families: Z }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: Z,
  policy: { "*": "policy" },
  remove: { dimensions: Z, vocabularies: Z, aspects: Z, families: Z, sources: Z, channels: Z, attributes: Z, scopes: Z, plugins: Z }
};
function Oe(t, x, a) {
  if (typeof x == "string") {
    const y = x.replace("!", "");
    if (!(y === "json" || (y === "object" ? Te(t) : y === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === y)) || x.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${a} has an invalid ${y} value.`);
  } else if (Array.isArray(x)) {
    if (!Array.isArray(t)) throw new Error(`${a} must be an array.`);
    t.forEach((y, u) => Oe(y, x[0], `${a}[${u}]`));
  } else {
    if (!Te(t)) throw new Error(`${a} must be an object.`);
    for (const [y, u] of Object.entries(x)) if (typeof u == "string" && u.endsWith("!") && t[y] === void 0) throw new Error(`${a}.${y} is required.`);
    for (const [y, u] of Object.entries(t)) {
      const h = x[y] ?? x["*"];
      if (!h) throw new Error(`${a}.${y} is not an editor field.`);
      Oe(u, h, `${a}.${y}`);
    }
  }
}
function wl(t) {
  const x = JSON.parse(t);
  Oe(x, kl, "Declaration");
  const a = x;
  for (const y of a.dimensions ?? []) y.members ??= [];
  return a;
}
function Ve(t) {
  return JSON.parse(JSON.stringify(t));
}
const le = /^[a-z][a-z0-9_]*$/;
function ke(t, x, a) {
  a.length ? t[x] = a : delete t[x];
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
}, ge = /* @__PURE__ */ Q({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: { default: () => ["code"] }
  },
  setup(t) {
    const x = t;
    Xe(Ee, J(() => x.columns));
    const a = J(() => ["48px", "minmax(160px, 1.4fr)", ...x.columns.map((y) => xl[y]), "80px"].join(" "));
    return (y, u) => (n(), v("section", {
      class: "form pim-definition-list",
      style: el({ "--pim-definition-columns": a.value })
    }, [
      oe(y.$slots, "head"),
      e("div", _l, [
        e("div", Vl, [
          t.count > 3 ? (n(), v("div", Cl, [
            u[0] || (u[0] = e("span", null, null, -1)),
            u[1] || (u[1] = e("span", null, "Name", -1)),
            (n(!0), v(F, null, G(t.columns, (h) => (n(), v("span", {
              key: h,
              class: we("pim-definition-" + h)
            }, A(l($l)[h]), 3))), 128)),
            u[2] || (u[2] = e("span", null, null, -1))
          ])) : z("", !0),
          oe(y.$slots, "default")
        ])
      ]),
      oe(y.$slots, "add")
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
}, he = /* @__PURE__ */ Q({
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
  setup(t, { emit: x }) {
    const a = t, y = ll(Ee, J(() => [
      ...a.code ? ["code"] : [],
      ...a.kind ? ["kind"] : []
    ])), u = tl(t, "open"), h = x;
    return (b, $) => (n(), v("section", Ul, [
      e("header", {
        class: we(["pim-definition-head", t.headClass]),
        onKeydown: $[1] || ($[1] = (d) => h("head-keydown", d)),
        onDrop: $[2] || ($[2] = (d) => h("head-drop", d)),
        onDragover: $[3] || ($[3] = (d) => h("head-dragover", d))
      }, [
        i(Ke, {
          class: we(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": u.value,
          onClick: $[0] || ($[0] = (d) => u.value = !u.value)
        }, {
          default: m(() => [
            e("span", Ol, [
              oe(b.$slots, "handle"),
              i(l(M), {
                icon: u.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", Sl, A(t.title), 1),
            (n(!0), v(F, null, G(l(y), (d) => (n(), v("span", {
              key: d,
              class: we("pim-definition-" + d),
              "data-column": d
            }, [
              d === "code" && t.code ? (n(), v("code", Il, A(t.code), 1)) : d === "kind" && t.kind ? (n(), I(l(ae), {
                key: 1,
                severity: "secondary",
                value: t.kind
              }, null, 8, ["value"])) : d === "details" ? oe(b.$slots, "details", {}, void 0, void 0, 2) : d === "usage" ? oe(b.$slots, "usage", {}, () => [
                N(A(t.usage), 1)
              ], void 0, 3) : z("", !0)
            ], 10, Al))), 128))
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", jl, [
          oe(b.$slots, "actions")
        ])
      ], 34),
      u.value ? (n(), v("div", Rl, [
        oe(b.$slots, "default")
      ])) : z("", !0)
    ]));
  }
});
function be(t, x) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? x : t;
}
async function ql(t, x) {
  const a = [...new Set(x)].map((u) => ({ type: "user", id: u }));
  if (!a.length) return {};
  const y = await Me(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: a }, "People");
  return Object.fromEntries((y.principals ?? []).map((u) => [u.id, be(u.label, "Person")]));
}
function Tl(t) {
  const x = Math.abs(t.m).toString(), a = t.m < 0 ? "-" : "";
  if (t.e >= 0) return a + x + "0".repeat(t.e);
  const y = -t.e, u = x.padStart(y + 1, "0");
  return a + u.slice(0, u.length - y) + "." + u.slice(u.length - y);
}
function Y(t) {
  const a = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return a ? a[0].toUpperCase() + a.slice(1) : t;
}
function ze(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
const zl = { class: "pim-chips pim-picker-chips" }, de = /* @__PURE__ */ Q({
  __name: "ChipPicker",
  props: {
    modelValue: {},
    options: {},
    free: { type: Boolean },
    placeholder: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = B("");
    function h(P) {
      return a.modelValue.includes(P);
    }
    function b(P) {
      a.disabled || !P || y("update:modelValue", h(P) ? a.modelValue.filter((R) => R !== P) : [...a.modelValue, P]);
    }
    function $() {
      const P = u.value.trim();
      if (!P || h(P)) {
        u.value = "";
        return;
      }
      y("update:modelValue", [...a.modelValue, P]), u.value = "";
    }
    function d(P) {
      y("update:modelValue", a.modelValue.filter((R) => R !== P));
    }
    function j(P) {
      return a.options?.find((R) => R.value === P)?.label ?? P;
    }
    return (P, R) => (n(), v("div", zl, [
      t.options && t.options.length > 10 ? (n(), v(F, { key: 0 }, [
        (n(!0), v(F, null, G(t.modelValue, (p) => (n(), v("span", {
          key: p,
          class: "row"
        }, [
          N(A(j(p)), 1),
          t.disabled ? z("", !0) : (n(), I(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + p,
            onClick: (c) => d(p),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: m(() => [
              i(l(M), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? z("", !0) : (n(), I(l(ie), {
          key: 0,
          "model-value": "",
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": R[0] || (R[0] = (p) => b(p)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(t.placeholder ?? "Add…") }, ...t.options.filter((p) => !h(p.value)).map((p) => ({ value: p.value, label: String(p.label ?? p.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-label", "options"]))
      ], 64)) : t.options ? (n(), v(F, { key: 1 }, [
        i(l(Pe), {
          "model-value": t.modelValue.filter((p) => t.options.some((c) => c.value === p)),
          options: t.options.map((p) => ({ value: p.value, label: p.label ?? p.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": R[1] || (R[1] = (p) => y("update:modelValue", [...p, ...t.modelValue.filter((c) => !t.options.some((g) => g.value === c))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), v(F, null, G(t.modelValue.filter((p) => !t.options.some((c) => c.value === p)), (p) => (n(), v("span", {
          key: p,
          class: "row"
        }, [
          N(A(j(p)), 1),
          t.disabled ? z("", !0) : (n(), I(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + p,
            onClick: (c) => d(p),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: m(() => [
              i(l(M), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (n(!0), v(F, { key: 2 }, G(t.modelValue, (p) => (n(), v("span", {
        key: p,
        class: "row"
      }, [
        N(A(p), 1),
        t.disabled ? z("", !0) : (n(), I(l(L), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + p,
          onClick: (c) => d(p),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: m(() => [
            i(l(M), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (n(), I(l(ne), {
        key: 3,
        modelValue: u.value,
        "onUpdate:modelValue": R[2] || (R[2] = (p) => u.value = p),
        type: "text",
        placeholder: t.placeholder ?? "Add…",
        onKeydown: ue(X($, ["prevent"]), ["enter"]),
        onBlur: $,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : z("", !0)
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
  setup(t, { emit: x }) {
    const a = t, y = x, u = B("pending");
    async function h() {
      u.value = "pending", u.value = await He("wc-schema-form") ? "ready" : "failed";
    }
    Se(h);
    function b($) {
      const d = $.detail;
      d && typeof d == "object" && !Array.isArray(d) && y("update:modelValue", d);
    }
    return ($, d) => (n(), v("div", {
      inert: t.disabled || void 0
    }, [
      u.value === "ready" ? (n(), v("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(a.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: b
      }, null, 40, Pl)) : u.value === "pending" ? (n(), v("span", Dl, "Configuration form is loading.")) : (n(), I(l(fe), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: m(() => [
          d[2] || (d[2] = N("Configuration form could not be loaded. ", -1)),
          i(l(L), {
            type: "button",
            disabled: t.disabled,
            onClick: h,
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
        onClick: d[0] || (d[0] = (j) => y("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: m(() => [
          i(l(M), {
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
  setup(t, { emit: x }) {
    const a = t, y = x, u = J(() => {
      const d = a.type?.form;
      let j = { type: "string" };
      return d === "bool" ? j = { type: "boolean" } : d === "int" ? j = { type: "integer" } : d === "dec" ? j = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : d === "quantity" ? j = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(a.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : d === "record" ? j = { type: "object", additionalProperties: !0 } : d === "ref" && (j = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${a.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (a.attribute.cardinality ?? "one") !== "one" && (j = { type: "array", items: j, uniqueItems: a.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...j, title: "Default value" } } };
    });
    function h(d) {
      return d && typeof d == "object" && "m" in d && "e" in d ? Tl(d) : d;
    }
    function b(d) {
      return a.type?.form === "dec" ? h(d) : a.type?.form === "quantity" && d && typeof d == "object" && "v" in d && "u" in d ? { value: h(d.v), unit: d.u } : d;
    }
    const $ = J(() => a.attribute.default === void 0 ? {} : { value: Array.isArray(a.attribute.default) ? a.attribute.default.map(b) : b(a.attribute.default) });
    return (d, j) => (n(), I(Ie, {
      schema: u.value,
      "model-value": $.value,
      "onUpdate:modelValue": j[0] || (j[0] = (P) => y("change", P.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Bl = { class: "pim-stack" }, Ll = { class: "pim-bsection-head" }, Kl = {
  key: 0,
  class: "mono muted small"
}, Ml = { class: "pim-source-permissions" }, Hl = ["for"], Jl = ["onDragstart"], Fl = { class: "pim-fields" }, Wl = { class: "pim-f pim-w-third" }, Gl = { class: "pim-f-label" }, Zl = {
  key: 0,
  class: "pim-f-note"
}, Yl = { class: "pim-f pim-w-third" }, Ql = { class: "pim-f pim-w-third" }, Xl = {
  key: 0,
  class: "pim-f pim-w-third"
}, et = {
  key: 1,
  class: "pim-f pim-w-third"
}, lt = { class: "pim-f pim-w-third" }, tt = { class: "pim-f pim-w-third" }, at = { class: "pim-f pim-w-half" }, nt = { class: "pim-f pim-w-half" }, st = { class: "row" }, ot = {
  key: 2,
  class: "pim-f pim-w-full"
}, it = { class: "pim-contexts" }, dt = { class: "small muted" }, ut = { class: "pim-f pim-w-half" }, rt = {
  key: 3,
  class: "pim-f pim-w-full"
}, ct = { class: "row end" }, mt = { class: "row pim-add-row" }, pt = { class: "form" }, ft = { class: "pim-aspect row pim-add-row" }, vt = /* @__PURE__ */ Q({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = ["quarter", "third", "half", "full"], h = ["one", "list", "set"], b = J(() => a.draft.aspects ?? []), $ = J(() => (a.draft.dimensions ?? []).map((o) => ({ value: o.name, label: Y(o.name) }))), d = J(() => (a.draft.vocabularies ?? []).map((o) => o.code)), j = J(() => (a.draft.sources ?? []).map((o) => ({ value: o.id, label: Y(o.id) }))), P = J(() => [...a.options.types].sort((o, r) => o.form.localeCompare(r.form)).map((o) => ({ value: o.id, label: p(o) })));
    function R(o) {
      return a.options.types.find((r) => r.id === o.type);
    }
    function p(o) {
      return be(o.title, "Field type");
    }
    function c(o) {
      return R(o)?.target === "term";
    }
    function g(o) {
      const r = R(o);
      return !!r && r.form === "ref" && !r.target;
    }
    function s(o, r) {
      return r.id !== void 0 && a.schema.attributes[o + "." + r.code] !== void 0;
    }
    function _(o) {
      const r = (a.draft.families ?? []).filter((U) => U.aspects?.includes(o)).length;
      return r + (r === 1 ? " family" : " families");
    }
    const C = B({});
    function k(o, r) {
      return o + "." + (r.id ?? r.code);
    }
    function O(o, r) {
      o.type = r;
      const U = R(o);
      if (U && o.index && !U.indexes.includes(o.index) && delete o.index, c(o) || delete o.vocabulary, !g(o) && o.config && "target" in o.config) {
        const { target: w, ...W } = o.config;
        o.config = Object.keys(W).length ? W : void 0, o.config || delete o.config;
      }
    }
    function f(o, r) {
      Object.keys(r).length ? o.config = r : delete o.config;
    }
    function E(o, r) {
      const U = { ...o.config ?? {} };
      r ? U.target = r : delete U.target, f(o, U);
    }
    function te(o, r) {
      r.length ? o.scope = r : delete o.scope, r.length || delete o.index_contexts;
    }
    function V(o, r, U) {
      U === void 0 || U === "" || U === !1 && r !== "default" ? delete o[r] : o[r] = U;
    }
    function D(o) {
      return o.index_contexts ?? [];
    }
    function S(o) {
      return (a.draft.dimensions ?? []).find((r) => r.name === o)?.members ?? [];
    }
    function K(o) {
      const r = {};
      for (const w of o.scope ?? []) r[w] = S(w)[0] ?? "";
      (o.index_contexts ?? (o.index_contexts = [])).push(r);
    }
    const ee = B(null);
    function re(o, r) {
      ee.value?.namespace === o.namespace && q(o.attributes ?? [], ee.value.index, r), ee.value = null;
    }
    const ve = B("");
    function $e() {
      const o = ve.value.trim();
      !le.test(o) || b.value.some((r) => r.namespace === o) || ((a.draft.aspects ??= []).push({ namespace: o, attributes: [] }), ve.value = "");
    }
    function Ce(o) {
      const r = b.value.indexOf(o);
      r >= 0 && b.value.splice(r, 1), a.schema.declaration.aspects?.some((U) => U.namespace === o.namespace) && y("remove", "aspects", o.namespace);
    }
    const ce = B({});
    function me(o) {
      const r = (ce.value[o.namespace] ?? "").trim(), U = o.attributes ?? (o.attributes = []);
      if (!le.test(r) || U.some((T) => T.code === r)) return;
      const w = a.options.types.find((T) => T.id === "kickside.pim.types:text") ?? a.options.types[0], W = { code: r, type: w?.id ?? "" };
      U.push(W), ce.value[o.namespace] = "", C.value[k(o.namespace, W)] = !0;
    }
    function H(o, r) {
      const U = o.attributes ?? [], w = U.indexOf(r);
      w >= 0 && U.splice(w, 1), s(o.namespace, r) && y("remove", "attributes", o.namespace + "." + r.code);
    }
    function q(o, r, U) {
      if (U < 0 || U >= o.length) return;
      const [w] = o.splice(r, 1);
      o.splice(U, 0, w);
    }
    return (o, r) => (n(), v("div", Bl, [
      (n(!0), v(F, null, G(b.value, (U) => (n(), I(ge, {
        key: U.namespace,
        count: U.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: m(() => [
          e("header", Ll, [
            e("div", null, [
              e("h3", null, [
                N(A(l(Y)(U.namespace)), 1),
                l(Y)(U.namespace).toLocaleLowerCase() !== U.namespace.toLocaleLowerCase() ? (n(), v("span", Kl, A(U.namespace), 1)) : z("", !0)
              ]),
              e("div", Ml, [
                e("label", {
                  for: "writers-" + U.namespace
                }, "Sources allowed to write", 8, Hl),
                i(l(ul), {
                  "input-id": "writers-" + U.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": U.write?.sources ?? [],
                  options: j.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": (w) => U.write = { sources: w }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                r[4] || (r[4] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this aspect.", -1))
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
                i(l(M), { icon: "tabler:trash" }),
                r[5] || (r[5] = N(" Remove aspect", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: m(() => [
          e("div", mt, [
            i(l(ne), {
              modelValue: ce.value[U.namespace],
              "onUpdate:modelValue": (w) => ce.value[U.namespace] = w,
              type: "text",
              placeholder: "new_field",
              onKeydown: ue(X((w) => me(U), ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(le).test(ce.value[U.namespace] ?? ""),
              onClick: (w) => me(U),
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                r[21] || (r[21] = N(" Add field", -1))
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ])
        ]),
        default: m(() => [
          (n(!0), v(F, null, G(U.attributes ?? [], (w, W) => (n(), I(he, {
            key: k(U.namespace, w),
            open: C.value[k(U.namespace, w)],
            "onUpdate:open": (T) => C.value[k(U.namespace, w)] = T,
            title: l(Y)(w.code),
            code: U.namespace + "." + w.code,
            kind: R(w) ? p(R(w)) : "Unknown type",
            usage: _(U.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: r[2] || (r[2] = X(() => {
            }, ["prevent"])),
            onHeadDrop: X((T) => re(U, W), ["prevent"]),
            onHeadKeydown: [
              X((T) => q(U.attributes ?? [], W, W - 1), ["alt", "prevent"]),
              X((T) => q(U.attributes ?? [], W, W + 1), ["alt", "prevent"])
            ]
          }, {
            handle: m(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: r[0] || (r[0] = X(() => {
                }, ["stop"])),
                onDragstart: X((T) => ee.value = { namespace: U.namespace, index: W }, ["stop"]),
                onDragend: r[1] || (r[1] = (T) => ee.value = null)
              }, [
                i(l(M), { icon: "tabler:grip-vertical" })
              ], 40, Jl)
            ]),
            details: m(() => [
              w.cardinality && w.cardinality !== "one" ? (n(), I(l(ae), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N(A(w.cardinality), 1)
                ]),
                _: 2
              }, 1024)) : z("", !0),
              w.scope?.length ? (n(), I(l(ae), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N("per " + A(w.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : z("", !0),
              w.index && w.index !== "none" ? (n(), I(l(ae), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [
                  N(A(w.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : z("", !0),
              w.unique ? (n(), I(l(ae), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: m(() => [...r[6] || (r[6] = [
                  N("unique", -1)
                ])]),
                _: 1
              })) : z("", !0)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                disabled: W === 0,
                "aria-label": "Move " + w.code + " earlier",
                onClick: (T) => q(U.attributes, W, W - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(M), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              i(l(L), {
                type: "button",
                disabled: W === (U.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + w.code + " later",
                onClick: (T) => q(U.attributes, W, W + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(M), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: m(() => [
              e("div", Fl, [
                e("div", Wl, [
                  e("div", Gl, [
                    r[7] || (r[7] = e("label", null, "Code", -1)),
                    s(U.namespace, w) ? (n(), v("span", Zl, "renames keep values")) : z("", !0)
                  ]),
                  i(l(ne), {
                    type: "text",
                    value: w.code,
                    onInput: (T) => w.code = T.target.value,
                    class: "mono"
                  }, null, 8, ["value", "onInput"])
                ]),
                e("div", Yl, [
                  r[8] || (r[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type")
                  ], -1)),
                  i(l(ie), {
                    "model-value": w.type,
                    options: P.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (T) => O(w, T)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", Ql, [
                  r[9] || (r[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Cardinality")
                  ], -1)),
                  i(l(ie), {
                    "model-value": w.cardinality ?? "one",
                    options: h,
                    appendTo: "self",
                    "onUpdate:modelValue": (T) => V(w, "cardinality", T === "one" ? void 0 : T)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                c(w) ? (n(), v("div", Xl, [
                  r[10] || (r[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  i(l(ie), {
                    "model-value": w.vocabulary ?? "",
                    "onUpdate:modelValue": (T) => V(w, "vocabulary", T),
                    options: [{ value: "", label: "Choose…" }, ...d.value.map((T) => ({ value: T, label: String(T) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : z("", !0),
                g(w) ? (n(), v("div", et, [
                  r[11] || (r[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  i(l(ie), {
                    "model-value": w.config?.target ?? "",
                    "onUpdate:modelValue": (T) => E(w, T),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((T) => ({ value: T.kind, label: l(be)(T.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : z("", !0),
                e("div", lt, [
                  r[12] || (r[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  i(l(ie), {
                    "model-value": w.index ?? "none",
                    options: R(w)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (T) => V(w, "index", T === "none" ? void 0 : T)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", tt, [
                  r[13] || (r[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  i(l(Pe), {
                    "model-value": w.width ?? t.schema.attributes[U.namespace + "." + w.code]?.width ?? "half",
                    options: u,
                    "allow-empty": !1,
                    "onUpdate:modelValue": (T) => w.width = T
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", at, [
                  r[14] || (r[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  i(de, {
                    "model-value": w.scope ?? [],
                    options: $.value,
                    "onUpdate:modelValue": (T) => te(w, T)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", nt, [
                  r[15] || (r[15] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", st, [
                    i(l(xe), {
                      "aria-label": "Unique " + w.code,
                      "model-value": w.unique === !0,
                      disabled: !!w.scope?.length || (w.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (T) => V(w, "unique", T)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, A(w.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                (w.scope?.length ?? 0) > 0 && w.index && w.index !== "none" ? (n(), v("div", ot, [
                  r[17] || (r[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", it, [
                    (n(!0), v(F, null, G(D(w), (T, _e) => (n(), v("div", {
                      key: _e,
                      class: "pim-context-row"
                    }, [
                      (n(!0), v(F, null, G(w.scope, (pe) => (n(), v("label", {
                        key: pe,
                        class: "pim-context-field"
                      }, [
                        e("span", dt, A(l(Y)(pe)), 1),
                        i(l(ie), {
                          "model-value": T[pe] ?? "",
                          options: S(pe),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (Le) => T[pe] = Le
                        }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      i(l(L), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (pe) => D(w).splice(_e, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: m(() => [
                          i(l(M), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    i(l(L), {
                      type: "button",
                      onClick: (T) => K(w),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(M), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        r[16] || (r[16] = N(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : z("", !0),
                e("div", ut, [
                  r[18] || (r[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  i(El, {
                    attribute: w,
                    type: R(w),
                    onChange: (T) => V(w, "default", T)
                  }, null, 8, ["attribute", "type", "onChange"])
                ]),
                R(w)?.config_schema ? (n(), v("div", rt, [
                  r[19] || (r[19] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  i(Ie, {
                    schema: R(w).config_schema,
                    "model-value": w.config ?? {},
                    "onUpdate:modelValue": (T) => f(w, T)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ])) : z("", !0)
              ]),
              e("div", ct, [
                i(l(L), {
                  type: "button",
                  onClick: (T) => H(U, w),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: m(() => [
                    i(l(M), { icon: "tabler:trash" }),
                    r[20] || (r[20] = N(" Remove field", -1))
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
      e("section", pt, [
        e("div", ft, [
          i(l(ne), {
            modelValue: ve.value,
            "onUpdate:modelValue": r[3] || (r[3] = (U) => ve.value = U),
            type: "text",
            placeholder: "new_aspect",
            onKeydown: ue(X($e, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(le).test(ve.value),
            onClick: $e,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              r[22] || (r[22] = N(" Add aspect", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          r[23] || (r[23] = e("span", { class: "muted small" }, "An aspect groups fields and can be written by named sources only.", -1))
        ])
      ])
    ]));
  }
}), yt = { class: "muted small" }, bt = { class: "pim-aspect" }, gt = {
  key: 0,
  class: "small muted"
}, ht = { class: "pim-fields" }, kt = { class: "pim-f pim-w-full" }, wt = { class: "pim-f-label" }, $t = { class: "row pim-add-row" }, xt = /* @__PURE__ */ Q({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = J(() => a.draft.dimensions ?? []), h = B("");
    function b() {
      const p = h.value.trim();
      !le.test(p) || u.value.some((c) => c.name === p) || ((a.draft.dimensions ??= []).push({ name: p, members: [] }), h.value = "");
    }
    function $(p) {
      const c = [];
      for (const g of a.draft.aspects ?? []) for (const s of g.attributes ?? []) s.scope?.includes(p.name) && c.push(g.namespace + "." + s.code);
      for (const g of a.draft.families ?? []) for (const s of g.requirements ?? []) s.context && p.name in s.context && c.push(g.code + " requirement " + s.id);
      return c;
    }
    function d(p) {
      $(p).length || (u.value.splice(u.value.indexOf(p), 1), a.schema.declaration.dimensions?.some((c) => c.name === p.name) && y("remove", "dimensions", p.name));
    }
    function j(p, c) {
      if (p.members = c, p.fallback)
        for (const g of Object.keys(p.fallback)) c.includes(g) || delete p.fallback[g];
    }
    function P(p, c) {
      return p.fallback?.[c] ?? [];
    }
    function R(p, c, g) {
      const s = { ...p.fallback ?? {} };
      g.length ? s[c] = g : delete s[c], Object.keys(s).length ? p.fallback = s : delete p.fallback;
    }
    return (p, c) => (n(), I(ge, {
      count: u.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: m(() => [
        e("div", $t, [
          i(l(ne), {
            modelValue: h.value,
            "onUpdate:modelValue": c[0] || (c[0] = (g) => h.value = g),
            type: "text",
            placeholder: "new_dimension",
            onKeydown: ue(X(b, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(le).test(h.value),
            onClick: b,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              c[3] || (c[3] = N(" Add dimension", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          c[4] || (c[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
        ])
      ]),
      default: m(() => [
        (n(!0), v(F, null, G(u.value, (g) => (n(), I(he, {
          title: l(Y)(g.name),
          code: g.name,
          key: g.name,
          usage: $(g).length + ($(g).length === 1 ? " dependency" : " dependencies")
        }, {
          details: m(() => [
            e("span", yt, A(g.members.length) + " " + A(g.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              disabled: $(g).length > 0,
              "aria-label": "Remove " + l(Y)(g.name),
              title: $(g).length ? "Take the dimension off these first" : "",
              onClick: (s) => d(g),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: m(() => [
            e("div", bt, [
              $(g).length ? (n(), v("p", gt, "Used by " + A($(g).join(", ")), 1)) : z("", !0),
              e("div", ht, [
                e("div", kt, [
                  c[1] || (c[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  i(de, {
                    "model-value": g.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (s) => j(g, s)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                (n(!0), v(F, null, G(g.members, (s) => (n(), v("div", {
                  key: s,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", wt, [
                    e("label", null, A(s) + " falls back to", 1),
                    c[2] || (c[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  i(de, {
                    "model-value": P(g, s),
                    options: g.members.filter((_) => _ !== s).map((_) => ({ value: _ })),
                    "onUpdate:modelValue": (_) => R(g, s, _)
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
}), _t = { class: "muted small" }, Vt = { class: "pim-aspect" }, Ct = { class: "row small" }, Ut = {
  key: 1,
  class: "muted small"
}, Ot = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, St = {
  key: 1,
  class: "pim-grid compact"
}, At = { key: 0 }, It = { class: "mono" }, jt = {
  key: 0,
  class: "mono muted"
}, Rt = { class: "num" }, qt = {
  key: 2,
  class: "muted small"
}, Tt = { class: "row" }, zt = { class: "row wrap pim-add-row" }, Nt = { class: "row pim-add-row" }, Pt = /* @__PURE__ */ Q({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, h = J(() => a.schema.access.write), b = J(() => a.draft.vocabularies ?? []), $ = B("");
    function d() {
      const V = $.value.trim();
      !le.test(V) || b.value.some((D) => D.code === V) || ((a.draft.vocabularies ??= []).push({ code: V }), $.value = "");
    }
    function j(V) {
      b.value.splice(b.value.indexOf(V), 1), a.schema.declaration.vocabularies?.some((D) => D.code === V.code) && y("remove", "vocabularies", V.code);
    }
    function P(V) {
      return !!a.schema.vocabularies[V];
    }
    const R = B({}), p = B({}), c = B({}), g = B({}), s = B({}), _ = B({}), C = B({});
    async function k(V, D) {
      s.value[V] = !0;
      try {
        const S = await se.termsPage(a.catalogId, V, D);
        p.value[V] = S.terms, g.value[V] = D, c.value[V] = S.next;
      } catch (S) {
        _.value[V] = S instanceof Error ? S.message : "Could not load terms.";
      } finally {
        s.value[V] = !1;
      }
    }
    function O(V) {
      R.value[V] = !R.value[V], R.value[V] && !p.value[V] && k(V);
    }
    function f(V) {
      return C.value[V] ?? (C.value[V] = { code: "", label: "", parent: "" });
    }
    async function E(V) {
      const D = f(V.code);
      if (!(!h.value || !u.test(D.code))) {
        s.value[V.code] = !0, _.value[V.code] = "";
        try {
          const S = { term: { vocabulary: V.code, code: D.code }, labels: { en: D.label || Y(D.code) } };
          V.hierarchical && D.parent && (S.parent = D.parent);
          const ee = (await se.apply(a.catalogId, [S])).outcomes[0];
          if (ee.outcome !== "created" && ee.outcome !== "updated") throw new Error(ee.findings?.[0]?.message ?? "The term was not accepted.");
          C.value[V.code] = { code: "", label: "", parent: "" }, se.invalidateTerms(a.catalogId), await k(V.code, g.value[V.code]);
        } catch (S) {
          _.value[V.code] = S instanceof Error ? S.message : "Could not add the term.";
        } finally {
          s.value[V.code] = !1;
        }
      }
    }
    async function te(V, D, S) {
      if (h.value) {
        s.value[V.code] = !0, _.value[V.code] = "";
        try {
          const ee = (await se.apply(a.catalogId, [{ term: { vocabulary: V.code, code: D.code }, retired: S }])).outcomes[0];
          if (!ee || !["updated", "unchanged"].includes(ee.outcome)) throw new Error(ee?.findings?.map((re) => re.message ?? re.code).join("; ") || "The term change was not accepted.");
          se.invalidateTerms(a.catalogId), await k(V.code, g.value[V.code]);
        } catch (K) {
          _.value[V.code] = K instanceof Error ? K.message : "Could not change the term.";
        } finally {
          s.value[V.code] = !1;
        }
      }
    }
    return (V, D) => (n(), I(ge, {
      count: b.value.length,
      columns: ["code", "details"]
    }, {
      add: m(() => [
        e("div", Nt, [
          i(l(ne), {
            modelValue: $.value,
            "onUpdate:modelValue": D[0] || (D[0] = (S) => $.value = S),
            type: "text",
            placeholder: "new_vocabulary",
            onKeydown: ue(X(d, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(le).test($.value),
            onClick: d,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(M), {
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
        (n(!0), v(F, null, G(b.value, (S) => (n(), I(he, {
          title: l(Y)(S.code),
          code: S.code,
          key: S.code
        }, {
          details: m(() => [
            e("span", _t, A(S.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              "aria-label": "Remove " + l(Y)(S.code),
              onClick: (K) => j(S),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: m(() => [
            e("div", Vt, [
              e("label", Ct, [
                i(l(xe), {
                  "aria-label": "Hierarchical " + S.code,
                  "model-value": S.hierarchical === !0,
                  "onUpdate:modelValue": (K) => K ? S.hierarchical = !0 : delete S.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                D[1] || (D[1] = e("span", null, "Hierarchical", -1))
              ]),
              P(S.code) ? (n(), I(l(L), {
                key: 0,
                type: "button",
                onClick: (K) => O(S.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: m(() => [
                  i(l(M), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  N(" " + A(R.value[S.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (n(), v("span", Ut, "Apply the schema before adding terms.")),
              R.value[S.code] ? (n(), v("div", Ot, [
                _.value[S.code] ? (n(), I(l(fe), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: m(() => [
                    N(A(_.value[S.code]), 1)
                  ]),
                  _: 2
                }, 1024)) : z("", !0),
                (p.value[S.code] ?? []).length ? (n(), v("table", St, [
                  e("thead", null, [
                    e("tr", null, [
                      D[2] || (D[2] = e("th", null, "Code", -1)),
                      D[3] || (D[3] = e("th", null, "Label", -1)),
                      S.hierarchical ? (n(), v("th", At, "Parent")) : z("", !0),
                      D[4] || (D[4] = e("th", null, null, -1))
                    ])
                  ]),
                  e("tbody", null, [
                    (n(!0), v(F, null, G(p.value[S.code], (K) => (n(), v("tr", {
                      key: K.code,
                      class: we({ muted: K.retired })
                    }, [
                      e("td", It, A(K.code), 1),
                      e("td", null, A(l(ze)(K)), 1),
                      S.hierarchical ? (n(), v("td", jt, A(K.parent ?? ""), 1)) : z("", !0),
                      e("td", Rt, [
                        i(l(L), {
                          type: "button",
                          disabled: !h.value || s.value[S.code],
                          onClick: (ee) => te(S, K, !K.retired),
                          text: "",
                          severity: "secondary",
                          size: "small"
                        }, {
                          default: m(() => [
                            N(A(K.retired ? "Restore" : "Retire"), 1)
                          ]),
                          _: 2
                        }, 1032, ["disabled", "onClick"])
                      ])
                    ], 2))), 128))
                  ])
                ])) : s.value[S.code] ? z("", !0) : (n(), v("p", qt, "No terms yet.")),
                e("div", Tt, [
                  i(l(L), {
                    type: "button",
                    disabled: s.value[S.code] || !g.value[S.code],
                    onClick: (K) => k(S.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(M), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      D[5] || (D[5] = N(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  i(l(L), {
                    type: "button",
                    disabled: s.value[S.code] || !c.value[S.code],
                    onClick: (K) => k(S.code, c.value[S.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(M), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      D[6] || (D[6] = N(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", zt, [
                  i(l(ne), {
                    modelValue: f(S.code).code,
                    "onUpdate:modelValue": (K) => f(S.code).code = K,
                    disabled: !h.value || s.value[S.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  i(l(ne), {
                    modelValue: f(S.code).label,
                    "onUpdate:modelValue": (K) => f(S.code).label = K,
                    disabled: !h.value || s.value[S.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  S.hierarchical ? (n(), I(l(ie), {
                    key: 0,
                    modelValue: f(S.code).parent,
                    "onUpdate:modelValue": (K) => f(S.code).parent = K,
                    disabled: !h.value || s.value[S.code],
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...(p.value[S.code] ?? []).map((K) => ({ value: K.code, label: String(l(ze)(K)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : z("", !0),
                  i(l(L), {
                    type: "button",
                    disabled: !h.value || s.value[S.code] || !u.test(f(S.code).code),
                    onClick: (K) => E(S),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(M), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      D[7] || (D[7] = N(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : z("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Dt = { class: "muted small" }, Et = { class: "pim-aspect" }, Bt = { class: "pim-fields" }, Lt = { class: "pim-f pim-w-full" }, Kt = { class: "pim-aspect" }, Mt = { class: "pim-stack tight" }, Ht = { class: "pim-level-head" }, Jt = { class: "pim-fields" }, Ft = { class: "pim-f pim-w-half" }, Wt = { class: "pim-f pim-w-half" }, Gt = { class: "pim-aspect" }, Zt = { class: "pim-stack tight" }, Yt = { class: "pim-level-head" }, Qt = { class: "mono" }, Xt = { class: "pim-fields" }, ea = { class: "pim-f-label" }, la = { class: "pim-f pim-w-half" }, ta = { class: "pim-f pim-w-half" }, aa = { class: "row pim-add-row" }, na = { class: "row pim-add-row" }, sa = /* @__PURE__ */ Q({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = J(() => (a.draft.families ?? []).filter((k) => k.code !== "generic")), h = J(() => {
      const k = (a.draft.aspects ?? []).map((f) => f.namespace), O = [...new Set(Object.entries(a.schema.attributes).filter(([, f]) => f.plugin).map(([f]) => f.split(".")[0]))];
      return [...k, ...O.filter((f) => !k.includes(f))].map((f) => ({ value: f, label: Y(f) }));
    });
    function b(k) {
      const O = [];
      for (const f of a.draft.aspects ?? []) if (k.aspects?.includes(f.namespace)) for (const E of f.attributes ?? []) O.push({ value: f.namespace + "." + E.code, label: Y(E.code) + " (" + f.namespace + ")" });
      for (const [f, E] of Object.entries(a.schema.attributes)) E.plugin && k.aspects?.includes(f.split(".")[0]) && !O.some((te) => te.value === f) && O.push({ value: f, label: Y(f) + " (" + f.split(".")[0] + ")" });
      return O;
    }
    const $ = J(() => a.draft.dimensions ?? []), d = B("");
    function j() {
      const k = d.value.trim();
      !le.test(k) || (a.draft.families ?? []).some((O) => O.code === k) || ((a.draft.families ??= []).push({ code: k, aspects: [] }), d.value = "");
    }
    function P(k) {
      a.draft.families.splice(a.draft.families.indexOf(k), 1), a.schema.declaration.families?.some((O) => O.code === k.code) && y("remove", "families", k.code);
    }
    function R(k) {
      return k.variation ?? [];
    }
    function p(k) {
      (k.variation ??= []).push({ axes: [] });
    }
    function c(k) {
      return k.requirements ?? [];
    }
    const g = B({});
    function s(k) {
      const O = (g.value[k.code] ?? "").trim();
      !le.test(O) || c(k).some((f) => f.id === O) || ((k.requirements ??= []).push({ id: O, require: [] }), g.value[k.code] = "");
    }
    function _(k, O) {
      return k.context?.[O] ?? "";
    }
    function C(k, O, f) {
      const E = { ...k.context ?? {} };
      f ? E[O] = f : delete E[O], Object.keys(E).length ? k.context = E : delete k.context;
    }
    return (k, O) => (n(), I(ge, {
      count: u.value.length,
      columns: ["code", "details"]
    }, {
      add: m(() => [
        e("div", na, [
          i(l(ne), {
            modelValue: d.value,
            "onUpdate:modelValue": O[0] || (O[0] = (f) => d.value = f),
            type: "text",
            placeholder: "new_family",
            onKeydown: ue(X(j, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          i(l(L), {
            type: "button",
            disabled: !l(le).test(d.value),
            onClick: j,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: m(() => [
              i(l(M), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              O[11] || (O[11] = N(" Add family", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          O[12] || (O[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
        ])
      ]),
      default: m(() => [
        (n(!0), v(F, null, G(u.value, (f) => (n(), I(he, {
          title: l(Y)(f.code),
          code: f.code,
          key: f.code
        }, {
          details: m(() => [
            e("span", Dt, A(f.aspects?.length ?? 0) + " " + A(f.aspects?.length === 1 ? "aspect" : "aspects"), 1)
          ]),
          actions: m(() => [
            i(l(L), {
              type: "button",
              onClick: (E) => P(f),
              "aria-label": "Remove " + l(Y)(f.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: m(() => [
            e("div", Et, [
              e("div", Bt, [
                e("div", Lt, [
                  O[1] || (O[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Aspects"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  i(de, {
                    "model-value": f.aspects ?? [],
                    options: h.value,
                    "onUpdate:modelValue": (E) => l(ke)(f, "aspects", E)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", Kt, [
              O[5] || (O[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", Mt, [
                (n(!0), v(F, null, G(R(f), (E, te) => (n(), v("div", {
                  key: te,
                  class: "pim-level"
                }, [
                  e("div", Ht, [
                    e("strong", null, "Level " + A(te + 1), 1),
                    i(l(L), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (V) => R(f).splice(te, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(M), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Jt, [
                    e("div", Ft, [
                      O[2] || (O[2] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes"),
                        e("span", { class: "pim-f-note" }, "key-indexed, one value each")
                      ], -1)),
                      i(de, {
                        "model-value": E.axes ?? [],
                        options: b(f),
                        "onUpdate:modelValue": (V) => E.axes = V
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Wt, [
                      O[3] || (O[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here"),
                        e("span", { class: "pim-f-note" }, "other fields written at this level")
                      ], -1)),
                      i(de, {
                        "model-value": E.own ?? [],
                        options: b(f),
                        "onUpdate:modelValue": (V) => V.length ? E.own = V : delete E.own
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                i(l(L), {
                  type: "button",
                  onClick: (E) => p(f),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: m(() => [
                    i(l(M), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    O[4] || (O[4] = N(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Gt, [
              O[10] || (O[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Zt, [
                (n(!0), v(F, null, G(c(f), (E, te) => (n(), v("div", {
                  key: E.id,
                  class: "pim-level"
                }, [
                  e("div", Yt, [
                    e("strong", Qt, A(E.id), 1),
                    i(l(L), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (V) => c(f).splice(te, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: m(() => [
                        i(l(M), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Xt, [
                    (n(!0), v(F, null, G($.value, (V) => (n(), v("div", {
                      key: V.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", ea, [
                        e("label", null, A(l(Y)(V.name)), 1),
                        O[6] || (O[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      i(l(ie), {
                        "model-value": _(E, V.name),
                        "onUpdate:modelValue": (D) => C(E, V.name, D),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ...V.members.map((D) => ({ value: D, label: String(D) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", la, [
                      O[7] || (O[7] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      i(de, {
                        "model-value": E.require ?? [],
                        options: b(f),
                        "onUpdate:modelValue": (V) => l(ke)(E, "require", V)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", ta, [
                      O[8] || (O[8] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      i(de, {
                        "model-value": E.authored ?? [],
                        options: b(f),
                        "onUpdate:modelValue": (V) => l(ke)(E, "authored", V)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                e("div", aa, [
                  i(l(ne), {
                    modelValue: g.value[f.code],
                    "onUpdate:modelValue": (E) => g.value[f.code] = E,
                    type: "text",
                    placeholder: "requirement_id",
                    onKeydown: ue(X((E) => s(f), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  i(l(L), {
                    type: "button",
                    disabled: !l(le).test(g.value[f.code] ?? ""),
                    onClick: (E) => s(f),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: m(() => [
                      i(l(M), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      O[9] || (O[9] = N(" Add requirement", -1))
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
}), oa = ["inert"], ia = {
  key: 0,
  class: "row wrap"
}, da = {
  key: 2,
  class: "small muted"
}, ua = { class: "pim-principal-service" }, ra = /* @__PURE__ */ Q({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = B(!1), h = B(""), b = B({});
    let $ = 0;
    ye(() => a.modelValue, async (p) => {
      const c = ++$;
      try {
        const g = await ql(a.catalogId ?? "", p);
        c === $ && (b.value = g);
      } catch {
        c === $ && (b.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ae(() => {
      $++;
    });
    function d(p) {
      return b.value[p] ?? be(p, "Person");
    }
    Se(async () => {
      try {
        await ol("wc-principal-picker"), u.value = !0;
      } catch {
        u.value = !1;
      }
    });
    function j(p) {
      a.disabled || !p.trim() || a.modelValue.includes(p.trim()) || (y("update:modelValue", [...a.modelValue, p.trim()]), h.value = "");
    }
    function P(p) {
      const c = p.detail;
      if (!c || typeof c != "object") return;
      const g = c, s = g.principal_id ?? g.id;
      typeof s == "string" && j(s);
    }
    function R(p) {
      a.disabled || y("update:modelValue", a.modelValue.filter((c) => c !== p));
    }
    return (p, c) => (n(), v("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (n(), v("div", ia, [
        (n(!0), v(F, null, G(t.modelValue, (g) => (n(), I(l(ae), {
          key: g,
          severity: "secondary"
        }, {
          default: m(() => [
            e("span", null, A(d(g)), 1),
            i(l(L), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + d(g),
              onClick: (s) => R(g)
            }, {
              default: m(() => [
                i(l(M), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : z("", !0),
      u.value ? (n(), v("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: X(P, ["stop"])
      }, null, 32)) : (n(), v("span", da, "The person picker is unavailable.")),
      e("label", ua, [
        c[3] || (c[3] = e("span", { class: "small muted" }, "Service account", -1)),
        i(l(ne), {
          modelValue: h.value,
          "onUpdate:modelValue": c[0] || (c[0] = (g) => h.value = g),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: c[1] || (c[1] = ue(X((g) => j(h.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      i(l(L), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !h.value.trim(),
        onClick: c[2] || (c[2] = (g) => j(h.value))
      }, {
        default: m(() => [
          i(l(M), { icon: "tabler:plus" }),
          c[4] || (c[4] = N(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, oa));
  }
}), ca = { class: "pim-stack" }, ma = { class: "muted small" }, pa = { class: "pim-fields" }, fa = { class: "pim-f pim-w-half" }, va = { class: "pim-f pim-w-half" }, ya = { class: "row pim-add-row" }, ba = { class: "muted small" }, ga = { class: "pim-fields" }, ha = { class: "pim-f pim-w-third" }, ka = { class: "pim-f pim-w-third" }, wa = { class: "row" }, $a = { class: "pim-f pim-w-third" }, xa = { class: "pim-f pim-w-full" }, _a = { class: "row pim-add-row" }, Va = /* @__PURE__ */ Q({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = J(() => a.draft.channels ?? []), h = J(() => a.draft.sources ?? []), b = J(() => [...new Set((a.draft.families ?? []).flatMap((s) => (s.requirements ?? []).map((_) => _.id)))].map((s) => ({ value: s }))), $ = J(() => (a.draft.families ?? []).filter((s) => s.code !== "generic").map((s) => ({ value: s.code, label: Y(s.code) }))), d = J(() => (a.draft.aspects ?? []).map((s) => ({ value: s.namespace, label: Y(s.namespace) }))), j = B(""), P = B("");
    function R() {
      const s = j.value.trim();
      !le.test(s) || u.value.some((_) => _.id === s) || ((a.draft.channels ??= []).push({ id: s, requirements: [] }), j.value = "");
    }
    function p(s) {
      u.value.splice(u.value.indexOf(s), 1), a.schema.declaration.channels?.some((_) => _.id === s.id) && y("remove", "channels", s.id);
    }
    function c() {
      const s = P.value.trim();
      !le.test(s) || h.value.some((_) => _.id === s) || ((a.draft.sources ??= []).push({ id: s, ordering: "none", writes: [] }), P.value = "");
    }
    function g(s) {
      h.value.splice(h.value.indexOf(s), 1), a.schema.declaration.sources?.some((_) => _.id === s.id) && y("remove", "sources", s.id);
    }
    return (s, _) => (n(), v("div", ca, [
      i(ge, {
        count: u.value.length,
        columns: ["code", "details"]
      }, {
        head: m(() => [..._[2] || (_[2] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: m(() => [
          e("div", ya, [
            i(l(ne), {
              modelValue: j.value,
              "onUpdate:modelValue": _[0] || (_[0] = (C) => j.value = C),
              type: "text",
              placeholder: "new_channel",
              onKeydown: ue(X(R, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(le).test(j.value),
              onClick: R,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                _[5] || (_[5] = N(" Add channel", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: m(() => [
          (n(!0), v(F, null, G(u.value, (C) => (n(), I(he, {
            key: C.id,
            title: l(Y)(C.id),
            code: C.id
          }, {
            details: m(() => [
              e("span", ma, A(C.requirements?.length ?? 0) + " " + A(C.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                onClick: (k) => p(C),
                "aria-label": "Remove " + l(Y)(C.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(M), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: m(() => [
              e("div", pa, [
                e("div", fa, [
                  _[3] || (_[3] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  i(de, {
                    "model-value": C.requirements ?? [],
                    options: b.value,
                    "onUpdate:modelValue": (k) => l(ke)(C, "requirements", k)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", va, [
                  _[4] || (_[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  i(de, {
                    "model-value": C.families ?? [],
                    options: $.value,
                    "onUpdate:modelValue": (k) => l(ke)(C, "families", k)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i(ge, {
        count: h.value.length,
        columns: ["code", "details"]
      }, {
        head: m(() => [..._[6] || (_[6] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: m(() => [
          e("div", _a, [
            i(l(ne), {
              modelValue: P.value,
              "onUpdate:modelValue": _[1] || (_[1] = (C) => P.value = C),
              type: "text",
              placeholder: "new_source",
              onKeydown: ue(X(c, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            i(l(L), {
              type: "button",
              disabled: !l(le).test(P.value),
              onClick: c,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: m(() => [
                i(l(M), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                _[11] || (_[11] = N(" Add source", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: m(() => [
          (n(!0), v(F, null, G(h.value, (C) => (n(), I(he, {
            key: C.id,
            title: l(Y)(C.id),
            code: C.id
          }, {
            details: m(() => [
              e("span", ba, A(C.writes?.length ?? 0) + " " + A(C.writes?.length === 1 ? "aspect" : "aspects"), 1)
            ]),
            actions: m(() => [
              i(l(L), {
                type: "button",
                onClick: (k) => g(C),
                "aria-label": "Remove " + l(Y)(C.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: m(() => [
                  i(l(M), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: m(() => [
              e("div", ga, [
                e("div", ha, [
                  _[7] || (_[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  i(l(ie), {
                    "model-value": C.ordering ?? "none",
                    "onUpdate:modelValue": (k) => C.ordering = k,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", ka, [
                  _[8] || (_[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", wa, [
                    i(l(xe), {
                      "aria-label": "Audit " + C.id,
                      "model-value": C.audit !== !1,
                      "onUpdate:modelValue": (k) => k ? delete C.audit : C.audit = !1
                    }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, A(C.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", $a, [
                  _[9] || (_[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  i(ra, {
                    "catalog-id": t.catalogId,
                    "model-value": C.principals ?? [],
                    "onUpdate:modelValue": (k) => l(ke)(C, "principals", k)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", xa, [
                  _[10] || (_[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "aspects this source may set")
                  ], -1)),
                  i(de, {
                    "model-value": C.writes ?? [],
                    options: d.value,
                    "onUpdate:modelValue": (k) => l(ke)(C, "writes", k)
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
}), Ca = { class: "pim-stack" }, Ua = { class: "pim-bsection-head" }, Oa = { class: "muted small" }, Sa = {
  key: 0,
  class: "pim-aspect muted"
}, Aa = {
  key: 1,
  class: "muted small"
}, Ia = {
  key: 3,
  class: "muted small"
}, ja = {
  key: 0,
  class: "pim-aspect muted"
}, Ra = { class: "muted small" }, qa = /* @__PURE__ */ Q({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = J(() => a.draft.plugins ?? []);
    function h(c) {
      return u.value.some((g) => g.use === c.plugin);
    }
    function b(c) {
      return a.schema.plugins.find((g) => g.plugin === c.plugin);
    }
    function $(c, g) {
      g && !h(c) && (a.draft.plugins ??= []).push({ use: c.plugin }), g || (a.draft.plugins = u.value.filter((s) => s.use !== c.plugin), delete a.pluginConfigs[c.plugin], b(c)?.active && y("remove", "plugins", c.plugin));
    }
    function d(c, g) {
      a.pluginConfigs[c.plugin] = g;
    }
    function j(c) {
      return Object.entries(a.schema.attributes).filter(([, g]) => g.plugin === c.plugin).map(([g]) => g);
    }
    const P = J(() => a.draft.scopes ?? []);
    function R(c) {
      return P.value.includes(c.id);
    }
    function p(c, g) {
      g && !R(c) && (a.draft.scopes ??= []).push(c.id), !g && R(c) && (P.value.splice(P.value.indexOf(c.id), 1), a.schema.declaration.scopes?.includes(c.id) && y("remove", "scopes", c.id));
    }
    return (c, g) => (n(), v("div", Ca, [
      i(ge, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: m(() => [
          e("header", Ua, [
            g[0] || (g[0] = e("h3", null, "Plugins", -1)),
            e("span", Oa, A(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: m(() => [
          t.options.plugins.length === 0 ? (n(), v("div", Sa, "No plugin is installed.")) : z("", !0),
          (n(!0), v(F, null, G(t.options.plugins, (s) => (n(), I(he, {
            key: s.plugin,
            title: l(be)(s.title, "Plugin")
          }, {
            details: m(() => [
              i(l(ae), {
                severity: h(s) ? "success" : "secondary",
                value: h(s) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: m(() => [
              i(l(xe), {
                "aria-label": "Enable " + l(be)(s.title, "Plugin"),
                "model-value": h(s),
                "onUpdate:modelValue": (_) => $(s, _)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: m(() => [
              b(s)?.problem ? (n(), I(l(fe), {
                key: 0,
                severity: "warn"
              }, {
                default: m(() => [
                  N(A(b(s)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : z("", !0),
              j(s).length ? (n(), v("p", Aa, "Fields: " + A(j(s).join(", ")) + ".", 1)) : z("", !0),
              h(s) ? (n(), I(Ie, {
                key: 2,
                schema: s.config_schema,
                "model-value": t.pluginConfigs[s.plugin] ?? b(s)?.config ?? {},
                "onUpdate:modelValue": (_) => d(s, _)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : z("", !0),
              b(s)?.active ? (n(), v("p", Ia, [
                N(A(b(s)?.lifecycle.state), 1),
                (n(!0), v(F, null, G(b(s)?.projections, (_, C) => (n(), v("span", { key: C }, " · " + A(C) + ": " + A(_.parked ? "paused" : _.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : z("", !0),
              b(s)?.active && t.pluginConfigs[s.plugin] ? (n(), I(l(L), {
                key: 4,
                label: "Save configuration",
                onClick: (_) => y("configure", s.plugin, t.pluginConfigs[s.plugin])
              }, null, 8, ["onClick"])) : z("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      i(ge, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: m(() => [...g[1] || (g[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: m(() => [
          t.options.scopes.length === 0 ? (n(), v("div", ja, "No scope is declared.")) : z("", !0),
          (n(!0), v(F, null, G(t.options.scopes, (s) => (n(), I(he, {
            key: s.id,
            title: l(be)(s.title, "Scope")
          }, {
            details: m(() => [
              i(l(ae), {
                severity: R(s) ? "success" : "secondary",
                value: R(s) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: m(() => [
              i(l(xe), {
                "aria-label": "Adopt " + l(be)(s.title, "Scope"),
                "model-value": R(s),
                "onUpdate:modelValue": (_) => p(s, _)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: m(() => [
              e("p", Ra, [
                g[2] || (g[2] = N("Filters: ", -1)),
                (n(!0), v(F, null, G(s.filters, (_, C) => (n(), I(l(ae), {
                  key: C,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: m(() => [
                    N(A(C) + " · " + A(_.ops.join(" ")), 1)
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
async function Ta(t) {
  const x = await Je(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (x.audit !== "fields" && x.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((a) => typeof x[a] == "number" && Number.isSafeInteger(x[a])))
    throw new Error("Policy defaults are unavailable.");
  for (const [a, y] of Object.entries(Be)) {
    const u = x[a];
    if (typeof u != "number" || !Number.isSafeInteger(u) || u < y.min || u > y.max) throw new Error(`Policy ${a} is unavailable.`);
  }
  return x;
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
}, za = { class: "form" }, Na = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, Pa = ["id", "data-policy-group", "aria-label"], Da = {
  key: 0,
  class: "pim-bsection-head"
}, Ea = { class: "pim-policy-copy" }, Ba = ["for"], La = ["id"], Ka = { key: 0 }, Ma = ["aria-expanded"], Ha = /* @__PURE__ */ Q({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const x = t, a = B(), y = J(() => x.defaults ?? a.value), u = B(""), h = B(!1);
    async function b() {
      if (!x.defaults) {
        u.value = "", h.value = !0;
        try {
          a.value = await Ta(x.catalogId ?? "");
        } catch (C) {
          u.value = C instanceof Error ? C.message : "Could not read policy defaults.";
        } finally {
          h.value = !1;
        }
      }
    }
    Se(b);
    const $ = J(() => x.draft.policy ?? {}), d = B(!1), j = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], P = {
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
    function R(C) {
      const k = Be[C];
      return { key: C, ...k, kind: "int", hint: P[C] };
    }
    j.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(R));
    const p = ["proposal_days", "proposal_count"].map(R), c = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(R), g = [
      { id: "retention", title: "Retention", keys: j },
      { id: "proposals", title: "Proposals", keys: p },
      { id: "advanced", title: "", keys: c }
    ], s = J(() => [
      { value: "inherited", label: y.value ? `${y.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function _(C, k) {
      const O = x.draft.policy ?? (x.draft.policy = {});
      O[C] = k == null || k === "" || k === "inherited" ? !1 : k;
    }
    return (C, k) => (n(), v("section", za, [
      k[4] || (k[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      h.value ? (n(), v("p", Na, "Loading deployment defaults…")) : z("", !0),
      u.value ? (n(), I(l(fe), {
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
            default: m(() => [...k[1] || (k[1] = [
              N("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : z("", !0),
      (n(), v(F, null, G(g, (O) => (n(), v(F, {
        key: O.id
      }, [
        O.id !== "advanced" || d.value ? (n(), v("section", {
          key: 0,
          id: O.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": O.id,
          class: "pim-policy-group",
          "aria-label": O.title || "Advanced"
        }, [
          O.title ? (n(), v("header", Da, [
            e("h3", null, A(O.title), 1)
          ])) : z("", !0),
          (n(!0), v(F, null, G(O.keys, (f) => (n(), v("div", {
            key: f.key,
            class: "pim-policy-row"
          }, [
            e("div", Ea, [
              e("label", {
                for: "pol-" + f.key
              }, A(f.title), 9, Ba),
              e("p", {
                id: "pol-help-" + f.key
              }, [
                N(A(f.hint), 1),
                f.global ? (n(), v("span", Ka, " Managed in deployment settings.")) : z("", !0)
              ], 8, La)
            ]),
            f.kind === "enum" ? (n(), I(l(ie), {
              key: 0,
              "input-id": "pol-" + f.key,
              "aria-describedby": "pol-help-" + f.key,
              class: "pim-policy-control",
              "model-value": typeof $.value[f.key] == "string" ? $.value[f.key] : "inherited",
              options: s.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (E) => _(f.key, E)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (n(), I(l(rl), {
              key: 1,
              disabled: f.global,
              "input-id": "pol-" + f.key,
              "aria-describedby": "pol-help-" + f.key,
              class: "pim-policy-control",
              "model-value": f.global ? Number(y.value?.[f.key] ?? 0) || null : typeof $.value[f.key] == "number" ? Number($.value[f.key]) : null,
              min: f.min ?? (f.key === "audit_days" ? 0 : 1),
              max: f.max,
              step: 1,
              placeholder: y.value ? "Default: " + y.value[f.key] : "Deployment default",
              "onUpdate:modelValue": (E) => _(f.key, E)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, Pa)) : z("", !0),
        O.id === "proposals" ? (n(), v("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": d.value,
          "aria-controls": "policy-advanced",
          onClick: k[0] || (k[0] = (f) => d.value = !d.value)
        }, [
          i(l(M), {
            icon: d.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          k[2] || (k[2] = e("span", null, "Advanced", -1)),
          k[3] || (k[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Ma)) : z("", !0)
      ], 64))), 64))
    ]));
  }
}), Ja = { class: "form" }, Fa = { class: "pim-aspect" }, Wa = /* @__PURE__ */ Q({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = B(JSON.stringify(a.draft, null, 2)), h = B("");
    ye(() => a.draft, ($) => {
      u.value = JSON.stringify($, null, 2), h.value = "";
    }, { deep: !0 });
    function b() {
      try {
        const $ = wl(u.value);
        h.value = "", y("validity", !0), y("replace", $);
      } catch ($) {
        y("validity", !1), h.value = "Invalid declaration: " + ($ instanceof Error ? $.message : String($));
      }
    }
    return ($, d) => (n(), v("section", Ja, [
      e("div", Fa, [
        d[1] || (d[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        h.value ? (n(), I(l(fe), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: m(() => [
            N(A(h.value), 1)
          ]),
          _: 1
        })) : z("", !0),
        i(l(cl), {
          modelValue: u.value,
          "onUpdate:modelValue": d[0] || (d[0] = (j) => u.value = j),
          rows: "28",
          spellcheck: "false",
          onInput: b,
          onBlur: b,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Ga = {
  key: 0,
  class: "pim-detail-head"
}, Za = { class: "pim-detail-actions" }, Ya = { class: "pim-settings-pane" }, Qa = { class: "pim-builder-main pim-readable" }, Xa = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, en = ["disabled", "inert"], ln = {
  key: 5,
  class: "pim-table pim-plan"
}, tn = { class: "pim-group-head" }, an = { class: "pim-card-body pad" }, nn = {
  key: 0,
  class: "muted"
}, sn = {
  key: 1,
  class: "muted small"
}, on = {
  key: 2,
  class: "muted small"
}, dn = {
  key: 3,
  class: "muted small"
}, un = { key: 0 }, rn = {
  key: 5,
  class: "pim-plan-list"
}, cn = { class: "mono" }, mn = { class: "muted" }, pn = /* @__PURE__ */ Q({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back"],
  setup(t, { emit: x }) {
    const a = t, y = x, u = [
      { id: "fields", title: "Fields" },
      { id: "dimensions", title: "Dimensions" },
      { id: "vocabularies", title: "Vocabularies" },
      { id: "families", title: "Families" },
      { id: "channels", title: "Channels & sources" },
      { id: "plugins", title: "Plugins & scopes" },
      { id: "policy", title: "Policy" },
      { id: "declaration", title: "Declaration" }
    ], h = B("fields"), b = B(null), $ = B(null), d = B({}), j = B({}), P = B({}), R = J(() => Object.fromEntries(Object.entries(P.value).filter(([H]) => d.value.plugins?.some((q) => q.use === H) && !b.value?.plugins.some((q) => q.plugin === H && q.active)))), p = B(""), c = B(!1), g = B(""), s = B(null), _ = B(null), C = B(!0), k = Ue(), O = J(() => C.value && !!s.value && s.value.class !== "refused" && !!_.value?.matches(re.value, b.value?.schema_generation ?? -1, R.value)), f = Ue(), E = B(!1);
    let te = 0;
    ye([d, j, P], () => {
      te++, s.value = null;
    }, { deep: !0, flush: "sync" });
    async function V(H = !1, q = !1) {
      if (K.value && !H) return;
      const o = f.begin(), r = te, U = a.catalogId, w = q ? Object.entries(P.value).filter(([W]) => b.value?.plugins.some((T) => T.plugin === W && T.active)) : [];
      E.value = !0, p.value = "";
      try {
        const [W, T] = await Promise.all([se.schema(U), se.schemaOptions(U)]);
        if (!f.current(o) || r !== te || U !== a.catalogId) return;
        b.value = W, $.value = T, d.value = Ve(W.declaration), j.value = {}, P.value = Object.fromEntries(w.filter(([_e]) => W.plugins.some((pe) => pe.plugin === _e && pe.active))), s.value = null, C.value = !0;
      } catch (W) {
        f.current(o) && (p.value = W instanceof Error ? W.message : "Could not load the schema.");
      } finally {
        f.current(o) && (E.value = !1);
      }
    }
    let D = () => {
    };
    ye(() => a.catalogId, (H) => {
      D(), D = il(`component.${H}`, () => {
        K.value || V();
      });
    }, { immediate: !0 }), Ne(async () => {
      K.value || await V();
    }), Ae(() => {
      D(), k.begin(), f.begin();
    }), ye(() => a.catalogId, () => {
      k.begin(), c.value = !1, b.value = null, $.value = null, ce(), V();
    });
    const S = J(() => Object.values(qe(d.value, j.value)).reduce((H, q) => H + (q?.length ?? 0), 0)), K = J(() => !!b.value && (JSON.stringify(d.value) !== JSON.stringify(b.value.declaration) || S.value > 0 || Object.keys(P.value).length > 0)), ee = J(() => ![d.value.aspects, d.value.dimensions, d.value.vocabularies, d.value.families, d.value.channels, d.value.sources, d.value.plugins, d.value.scopes].some((H) => H?.length)), re = J(() => {
      const H = Ve(d.value), q = qe(H, j.value);
      return Object.keys(q).length && (H.remove = q), H;
    });
    ye(K, (H) => {
      H || (s.value = null);
    }), ye([re, R], () => {
      s.value = null;
    }, { deep: !0 });
    async function ve() {
      if (!b.value || !C.value) return;
      const H = k.begin(), q = gl(re.value, b.value.schema_generation, R.value);
      c.value = !0, p.value = "";
      try {
        const o = await se.planSchema(a.catalogId, q.declaration, q.generation, q.pluginConfigs);
        if (!k.current(H) || !q.matches(re.value, b.value.schema_generation, R.value) || !C.value) return;
        _.value = q, s.value = o;
      } catch (o) {
        if (!k.current(H)) return;
        p.value = o instanceof Error ? o.message : "Could not review the change.", s.value = null, _.value = null;
      } finally {
        k.current(H) && (c.value = !1);
      }
    }
    async function $e() {
      if (!b.value || !K.value || !O.value || !_.value) return;
      const H = a.catalogId, q = k.begin();
      c.value = !0, p.value = "", g.value = "";
      try {
        const o = await se.applySchema(H, _.value.declaration, _.value.generation, _.value.pluginConfigs);
        if (H !== a.catalogId || !k.current(q) || (await V(!0, !0), H !== a.catalogId || !k.current(q))) return;
        g.value = `Applied as generation ${o.generation} (${o.class})`, y("applied", o.generation);
      } catch (o) {
        if (H !== a.catalogId || !k.current(q)) return;
        p.value = o instanceof Error ? o.message : "Could not apply the change.";
      } finally {
        k.current(q) && (c.value = !1);
      }
    }
    async function Ce(H, q) {
      const o = a.catalogId, r = f.begin(), U = k.begin();
      c.value = !0, p.value = "";
      try {
        const w = JSON.stringify(q);
        if (await se.configurePlugin(o, H, Ve(q)), o !== a.catalogId || !f.current(r)) return;
        const W = await se.schema(o);
        if (o !== a.catalogId || !f.current(r)) return;
        b.value && (b.value.plugins = W.plugins), JSON.stringify(P.value[H]) === w && delete P.value[H], g.value = "Configuration saved";
      } catch (w) {
        o === a.catalogId && k.current(U) && (p.value = w instanceof Error ? w.message : "Could not save configuration.");
      } finally {
        k.current(U) && (c.value = !1);
      }
    }
    function ce() {
      P.value = {}, C.value = !0, b.value && (d.value = Ve(b.value.declaration)), j.value = {}, s.value = null, g.value = "";
    }
    function me(H, q) {
      const o = j.value[H] ?? [];
      o.includes(q) || (j.value = { ...j.value, [H]: [...o, q] });
    }
    return (H, q) => (n(), v("div", {
      class: we(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (n(), v("div", Ga, [
        e("h2", null, A(t.title || "Catalog"), 1),
        i(l(ae), {
          severity: "secondary",
          value: "Generation " + (b.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Za, [
          oe(H.$slots, "actions", {
            access: b.value?.access
          }),
          i(Re, {
            access: b.value?.access,
            dirty: K.value,
            busy: c.value,
            valid: C.value,
            reviewed: !!s.value,
            "can-apply": O.value,
            onDiscard: ce,
            onReview: ve,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (n(), I(bl, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (b.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: q[0] || (q[0] = (o) => y("back"))
      }, {
        default: m(() => [
          oe(H.$slots, "actions", {
            access: b.value?.access
          }),
          i(Re, {
            access: b.value?.access,
            dirty: K.value,
            busy: c.value,
            valid: C.value,
            reviewed: !!s.value,
            "can-apply": O.value,
            onDiscard: ce,
            onReview: ve,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      i(l(al), {
        value: h.value,
        "onUpdate:value": q[1] || (q[1] = (o) => h.value = o),
        class: "pim-section-tabs"
      }, {
        default: m(() => [
          i(l(nl), { "aria-label": "Schema sections" }, {
            default: m(() => [
              (n(), v(F, null, G(u, (o) => i(l(sl), {
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
      e("div", Ya, [
        e("div", Qa, [
          p.value ? (n(), I(l(fe), {
            key: 0,
            severity: "error",
            role: "alert"
          }, {
            default: m(() => [
              N(A(p.value), 1)
            ]),
            _: 1
          })) : z("", !0),
          g.value ? (n(), I(l(fe), {
            key: 1,
            severity: "success"
          }, {
            default: m(() => [
              N(A(g.value), 1)
            ]),
            _: 1
          })) : z("", !0),
          E.value && (!b.value || !$.value) ? (n(), v("div", Xa, "Loading…")) : (!b.value || !$.value) && p.value ? (n(), I(l(L), {
            key: 3,
            onClick: q[2] || (q[2] = (o) => V()),
            severity: "secondary",
            outlined: ""
          }, {
            default: m(() => [...q[5] || (q[5] = [
              N("Retry", -1)
            ])]),
            _: 1
          })) : b.value && $.value ? (n(), v("fieldset", {
            key: 4,
            class: "pim-editor-surface",
            disabled: c.value || !b.value.access.admin,
            inert: c.value || !b.value.access.admin
          }, [
            ee.value && h.value === "fields" ? (n(), I(l(fe), {
              key: 0,
              severity: "info"
            }, {
              default: m(() => [...q[6] || (q[6] = [
                N("No catalog definitions yet. Add an aspect to start defining fields.", -1)
              ])]),
              _: 1
            })) : z("", !0),
            h.value === "fields" ? (n(), I(vt, {
              key: 1,
              draft: d.value,
              schema: b.value,
              options: $.value,
              onRemove: me
            }, null, 8, ["draft", "schema", "options"])) : h.value === "dimensions" ? (n(), I(xt, {
              key: 2,
              draft: d.value,
              schema: b.value,
              onRemove: me
            }, null, 8, ["draft", "schema"])) : h.value === "vocabularies" ? (n(), I(Pt, {
              key: 3,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: b.value,
              onRemove: me
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "families" ? (n(), I(sa, {
              key: 4,
              draft: d.value,
              schema: b.value,
              onRemove: me
            }, null, 8, ["draft", "schema"])) : h.value === "channels" ? (n(), I(Va, {
              key: 5,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: b.value,
              onRemove: me
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "plugins" ? (n(), I(qa, {
              key: 6,
              draft: d.value,
              schema: b.value,
              options: $.value,
              "plugin-configs": P.value,
              onConfigure: Ce,
              onRemove: me
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : h.value === "policy" ? (n(), I(Ha, {
              key: 7,
              "catalog-id": t.catalogId,
              draft: d.value
            }, null, 8, ["catalog-id", "draft"])) : h.value === "declaration" ? (n(), I(Wa, {
              key: 8,
              draft: d.value,
              onReplace: q[3] || (q[3] = (o) => d.value = o),
              onValidity: q[4] || (q[4] = (o) => {
                C.value = o, s.value = null;
              })
            }, null, 8, ["draft"])) : z("", !0)
          ], 8, en)) : z("", !0),
          s.value ? (n(), v("div", ln, [
            e("div", tn, [
              i(l(M), { icon: "tabler:checklist" }),
              q[7] || (q[7] = e("h3", null, "Review", -1)),
              i(l(ae), {
                class: "kx-tag-sm",
                severity: s.value.class === "refused" ? "danger" : s.value.class === "semantic" ? "warn" : "info"
              }, {
                default: m(() => [
                  N(A(s.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", an, [
              s.value.class === "unchanged" ? (n(), v("p", nn, "Nothing would change.")) : s.value.class === "cosmetic" ? (n(), v("p", sn, "Labels, order, widths or choices only; no product is touched.")) : s.value.class === "additive" ? (n(), v("p", on, "New fields or options; existing values stay as they are.")) : s.value.class === "semantic" ? (n(), v("p", dn, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (n(), I(l(fe), {
                key: 4,
                severity: "error"
              }, {
                default: m(() => [
                  q[8] || (q[8] = N("Refused: the draft cannot be compiled as it stands.", -1)),
                  s.value.migration ? (n(), v("span", un, A(s.value.migration), 1)) : z("", !0)
                ]),
                _: 1
              })),
              s.value.changes.length || s.value.refused.length ? (n(), v("ul", rn, [
                (n(!0), v(F, null, G([...s.value.refused, ...s.value.changes], (o, r) => (n(), v("li", { key: r }, [
                  i(l(ae), {
                    class: "kx-tag-sm small",
                    severity: o.class === "refused" ? "danger" : o.class === "semantic" ? "warn" : "info"
                  }, {
                    default: m(() => [
                      N(A(o.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", cn, A(o.code), 1),
                  e("span", mn, A(o.what), 1)
                ]))), 128))
              ])) : z("", !0)
            ])
          ])) : z("", !0)
        ])
      ])
    ], 2));
  }
}), fn = /* @__PURE__ */ Q({
  __name: "SettingsApp",
  setup(t) {
    const x = Fe(), a = We(), y = B(""), u = J(() => x.value.catalogId ?? ""), h = Ue();
    async function b() {
      const $ = h.begin(), d = u.value;
      try {
        const j = await se.catalogSummary(d);
        h.current($) && (y.value = j?.title || "Untitled catalog");
      } catch {
        h.current($) && (y.value = "Untitled catalog");
      }
    }
    return ye(u, () => {
      y.value = "", b();
    }), Ne(b), Ae(() => {
      h.begin();
    }), ($, d) => u.value ? (n(), I(pn, {
      key: u.value,
      "catalog-id": u.value,
      title: y.value || "Catalog",
      embedded: l(x).embedded,
      "back-label": l(x).embedded ? void 0 : "Back to catalog settings",
      onBack: d[0] || (d[0] = (j) => l(a)("navigate", { route: "" }))
    }, null, 8, ["catalog-id", "title", "embedded", "back-label"])) : z("", !0);
  }
});
class vn extends Ge {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Ze
    };
  }
  static get vueConfig() {
    return { rootComponent: fn, plugins: [Ye] };
  }
}
dl(import.meta.url, vn);
