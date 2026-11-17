import { e as Ne, _ as Me, a as He, p as se, g as Je, u as Pe, r as Se, b as Fe, c as We, W as Ge, s as Ze, P as Ye } from "./styles-vHZl2OOQ.js";
import { defineComponent as Q, ref as E, openBlock as n, createElementBlock as v, Fragment as F, createVNode as o, unref as l, withCtx as r, createTextVNode as j, createCommentVNode as T, createBlock as R, toDisplayString as A, normalizeClass as we, createElementVNode as e, resolveDynamicComponent as Qe, renderSlot as ie, provide as Xe, computed as J, normalizeStyle as el, renderList as G, inject as ll, useModel as tl, mergeModels as je, withKeys as re, withModifiers as X, onMounted as Ie, watch as ve, onUnmounted as Ve } from "vue";
import L from "primevue/button";
import ue from "primevue/message";
import { Icon as H } from "@iconify/vue";
import ae from "primevue/tag";
import al from "primevue/tabs";
import nl from "primevue/tablist";
import sl from "primevue/tab";
import { host as il, loadByTagName as ol, on as dl, define as ul } from "@wippy-fe/proxy";
import rl from "primevue/multiselect";
import De from "primevue/selectbutton";
import xe from "primevue/toggleswitch";
import oe from "primevue/select";
import ne from "primevue/inputtext";
import cl from "primevue/inputnumber";
import ml from "primevue/textarea";
const pl = ["config"], fl = /* @__PURE__ */ Q({
  __name: "CatalogShare",
  props: {
    catalogId: {},
    title: {}
  },
  setup(t) {
    const x = t, a = E(!1), p = E(!1), u = E("");
    async function h() {
      p.value = !0, u.value = "", await Ne("kickside-share") ? a.value = !0 : u.value = "Could not open sharing. Try Share again.", p.value = !1;
    }
    return (y, w) => (n(), v(F, null, [
      o(l(L), {
        type: "button",
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: p.value,
        onClick: h
      }, {
        default: r(() => [...w[1] || (w[1] = [
          j("Share", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      a.value ? (n(), v("kickside-share", {
        key: 0,
        config: JSON.stringify({ resource_id: x.catalogId, title: x.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(x.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(x.catalogId)}` }),
        onClose: w[0] || (w[0] = (d) => a.value = !1)
      }, null, 40, pl)) : T("", !0),
      u.value ? (n(), R(l(ue), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: r(() => [
          j(A(u.value), 1)
        ]),
        _: 1
      })) : T("", !0)
    ], 64));
  }
}), Te = /* @__PURE__ */ Q({
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
    return (p, u) => t.access?.admin ? (n(), v(F, { key: 0 }, [
      t.dirty ? (n(), R(l(ae), {
        key: 0,
        severity: "warn",
        value: "Unsaved changes"
      })) : T("", !0),
      o(l(L), {
        severity: "secondary",
        outlined: "",
        disabled: !t.dirty || t.busy,
        onClick: u[0] || (u[0] = (h) => a("discard"))
      }, {
        default: r(() => [
          o(l(H), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          u[3] || (u[3] = j(" Discard", -1))
        ]),
        _: 1
      }, 8, ["disabled"]),
      t.reviewed ? (n(), R(l(L), {
        key: 2,
        disabled: !t.dirty || t.busy || !t.canApply,
        loading: t.busy,
        onClick: u[2] || (u[2] = (h) => a("apply"))
      }, {
        default: r(() => [...u[5] || (u[5] = [
          j("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"])) : (n(), R(l(L), {
        key: 1,
        disabled: !t.dirty || t.busy || !t.valid,
        loading: t.busy,
        onClick: u[1] || (u[1] = (h) => a("review"))
      }, {
        default: r(() => [...u[4] || (u[4] = [
          j("Review changes", -1)
        ])]),
        _: 1
      }, 8, ["disabled", "loading"]))
    ], 64)) : T("", !0);
  }
}), vl = { class: "kx-head-icon" }, yl = { class: "kx-head-text" }, bl = { class: "pim-title-line" }, gl = ["title"], hl = { class: "kx-head-actions" }, kl = /* @__PURE__ */ Q({
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
    return (p, u) => (n(), v("header", {
      class: we(["kx-head", { "pim-panel-head": t.pane }])
    }, [
      t.backLabel ? (n(), R(l(L), {
        key: 0,
        type: "button",
        "aria-label": t.backLabel,
        onClick: u[0] || (u[0] = (h) => a("back")),
        text: "",
        severity: "secondary",
        size: "small"
      }, {
        default: r(() => [
          o(l(H), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label"])) : T("", !0),
      e("div", vl, [
        o(l(H), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      e("div", yl, [
        e("div", bl, [
          (n(), R(Qe(t.pane ? "h2" : "h1"), { class: "kx-title" }, {
            default: r(() => [
              j(A(t.title), 1)
            ]),
            _: 1
          })),
          ie(p.$slots, "meta")
        ]),
        e("p", {
          class: "kx-head-sub",
          title: t.subtitle
        }, A(t.subtitle), 9, gl)
      ]),
      e("div", hl, [
        ie(p.$slots, "default")
      ])
    ], 2));
  }
});
function wl(t, x, a = {}) {
  const p = JSON.stringify(t), u = JSON.stringify(a);
  return {
    declaration: JSON.parse(p),
    generation: x,
    pluginConfigs: JSON.parse(u),
    matches: (h, y, w = {}) => x === y && p === JSON.stringify(h) && u === JSON.stringify(w)
  };
}
function qe(t, x) {
  const a = {};
  for (const [p, u] of Object.entries(x)) {
    const h = u.filter((y) => p === "plugins" ? !t.plugins?.some((w) => w.use === y) : p === "scopes" ? !t.scopes?.includes(y) : p === "attributes" ? !t.aspects?.some((w) => w.attributes?.some((d) => w.namespace + "." + d.code === y)) : p === "aspects" ? !t.aspects?.some((w) => w.namespace === y) : p === "dimensions" ? !t.dimensions?.some((w) => w.name === y) : p === "vocabularies" || p === "families" ? !t[p]?.some((w) => w.code === y) : !t[p]?.some((w) => w.id === y));
    h.length && (a[p] = h);
  }
  return a;
}
const ze = (t) => !!t && typeof t == "object" && !Array.isArray(t), Z = ["string"], Ee = { "*": "string" }, $l = { id: "number", code: "string!", type: "string!", scope: Z, cardinality: "string", index: "string", index_contexts: [Ee], unique: "boolean", vocabulary: "string", default: "json", config: "object", width: "string" }, xl = {
  dimensions: [{ name: "string!", members: Z, fallback: { "*": Z } }],
  vocabularies: [{ code: "string!", hierarchical: "boolean" }],
  aspects: [{ namespace: "string!", write: { sources: Z }, attributes: [$l] }],
  families: [{ code: "string!", aspects: Z, variation: [{ axes: Z, own: Z }], requirements: [{ id: "string!", context: Ee, require: Z, authored: Z }], checks: [{ check: "string!", reads: Z, cost: "string", config: "object", enforce: "string" }] }],
  sources: [{ id: "string!", ordering: "string", writes: Z, principals: Z, audit: "boolean" }],
  channels: [{ id: "string!", requirements: Z, families: Z }],
  plugins: [{ use: "string!", schema: "json" }],
  scopes: Z,
  policy: { "*": "policy" },
  remove: { dimensions: Z, vocabularies: Z, aspects: Z, families: Z, sources: Z, channels: Z, attributes: Z, scopes: Z, plugins: Z }
};
function Ae(t, x, a) {
  if (typeof x == "string") {
    const p = x.replace("!", "");
    if (!(p === "json" || (p === "object" ? ze(t) : p === "policy" ? t === !1 || typeof t == "string" || typeof t == "number" : typeof t === p)) || x.endsWith("!") && (typeof t != "string" || !t.trim())) throw new Error(`${a} has an invalid ${p} value.`);
  } else if (Array.isArray(x)) {
    if (!Array.isArray(t)) throw new Error(`${a} must be an array.`);
    t.forEach((p, u) => Ae(p, x[0], `${a}[${u}]`));
  } else {
    if (!ze(t)) throw new Error(`${a} must be an object.`);
    for (const [p, u] of Object.entries(x)) if (typeof u == "string" && u.endsWith("!") && t[p] === void 0) throw new Error(`${a}.${p} is required.`);
    for (const [p, u] of Object.entries(t)) {
      const h = x[p] ?? x["*"];
      if (!h) throw new Error(`${a}.${p} is not an editor field.`);
      Ae(u, h, `${a}.${p}`);
    }
  }
}
function Cl(t) {
  const x = JSON.parse(t);
  Ae(x, xl, "Declaration");
  const a = x;
  for (const p of a.dimensions ?? []) p.members ??= [];
  return a;
}
function _e(t) {
  return JSON.parse(JSON.stringify(t));
}
const le = /^[a-z][a-z0-9_]*$/;
function ke(t, x, a) {
  a.length ? t[x] = a : delete t[x];
}
const Be = Symbol("definitionColumns"), _l = { code: "Code", kind: "Kind", details: "Details", usage: "Used by" }, Vl = {
  code: "minmax(120px, 1fr)",
  kind: "140px",
  details: "minmax(120px, 1.2fr)",
  usage: "120px"
}, Ul = {
  class: "pim-definition-scroll",
  tabindex: "0",
  "aria-label": "Definitions"
}, Ol = { class: "pim-definition-grid" }, Sl = {
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
    Xe(Be, J(() => x.columns));
    const a = J(() => ["48px", "minmax(160px, 1.4fr)", ...x.columns.map((p) => Vl[p]), "80px"].join(" "));
    return (p, u) => (n(), v("section", {
      class: "form pim-definition-list",
      style: el({ "--pim-definition-columns": a.value })
    }, [
      ie(p.$slots, "head"),
      e("div", Ul, [
        e("div", Ol, [
          t.count > 3 ? (n(), v("div", Sl, [
            u[0] || (u[0] = e("span", null, null, -1)),
            u[1] || (u[1] = e("span", null, "Name", -1)),
            (n(!0), v(F, null, G(t.columns, (h) => (n(), v("span", {
              key: h,
              class: we("pim-definition-" + h)
            }, A(l(_l)[h]), 3))), 128)),
            u[2] || (u[2] = e("span", null, null, -1))
          ])) : T("", !0),
          ie(p.$slots, "default")
        ])
      ]),
      ie(p.$slots, "add")
    ], 4));
  }
}), Al = { class: "pim-definition" }, Il = {
  class: "pim-definition-lead",
  "data-column": "lead"
}, Rl = {
  class: "pim-row-title",
  "data-column": "name"
}, jl = ["data-column"], Tl = {
  key: 0,
  class: "mono"
}, ql = {
  class: "pim-definition-actions",
  "data-column": "actions"
}, zl = {
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
    const a = t, p = ll(Be, J(() => [
      ...a.code ? ["code"] : [],
      ...a.kind ? ["kind"] : []
    ])), u = tl(t, "open"), h = x;
    return (y, w) => (n(), v("section", Al, [
      e("header", {
        class: we(["pim-definition-head", t.headClass]),
        onKeydown: w[1] || (w[1] = (d) => h("head-keydown", d)),
        onDrop: w[2] || (w[2] = (d) => h("head-drop", d)),
        onDragover: w[3] || (w[3] = (d) => h("head-dragover", d))
      }, [
        o(Me, {
          class: we(["pim-definition-toggle", t.toggleClass]),
          "aria-expanded": u.value,
          onClick: w[0] || (w[0] = (d) => u.value = !u.value)
        }, {
          default: r(() => [
            e("span", Il, [
              ie(y.$slots, "handle"),
              o(l(H), {
                icon: u.value ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            e("span", Rl, A(t.title), 1),
            (n(!0), v(F, null, G(l(p), (d) => (n(), v("span", {
              key: d,
              class: we("pim-definition-" + d),
              "data-column": d
            }, [
              d === "code" && t.code ? (n(), v("code", Tl, A(t.code), 1)) : d === "kind" && t.kind ? (n(), R(l(ae), {
                key: 1,
                severity: "secondary",
                value: t.kind
              }, null, 8, ["value"])) : d === "details" ? ie(y.$slots, "details", {}, void 0, void 0, 2) : d === "usage" ? ie(y.$slots, "usage", {}, () => [
                j(A(t.usage), 1)
              ], void 0, 3) : T("", !0)
            ], 10, jl))), 128))
          ]),
          _: 3
        }, 8, ["class", "aria-expanded"]),
        e("div", ql, [
          ie(y.$slots, "actions")
        ])
      ], 34),
      u.value ? (n(), v("div", zl, [
        ie(y.$slots, "default")
      ])) : T("", !0)
    ]));
  }
});
function be(t, x) {
  return !t || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(t) ? x : t;
}
async function Nl(t, x) {
  const a = [...new Set(x)].map((u) => ({ type: "user", id: u }));
  if (!a.length) return {};
  const p = await He(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/principal_labels`, { refs: a }, "People");
  return Object.fromEntries((p.principals ?? []).map((u) => [u.id, be(u.label, "Person")]));
}
function Pl(t) {
  const x = Math.abs(t.m).toString(), a = t.m < 0 ? "-" : "";
  if (t.e >= 0) return a + x + "0".repeat(t.e);
  const p = -t.e, u = x.padStart(p + 1, "0");
  return a + u.slice(0, u.length - p) + "." + u.slice(u.length - p);
}
function Y(t) {
  const a = (t.includes(".") ? t.slice(t.indexOf(".") + 1) : t).replace(/[_-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return a ? a[0].toUpperCase() + a.slice(1) : t;
}
function Oe(t) {
  return t.labels.en ?? Object.values(t.labels)[0] ?? t.code;
}
const Dl = { class: "pim-chips pim-picker-chips" }, de = /* @__PURE__ */ Q({
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
    const a = t, p = x, u = E("");
    function h(D) {
      return a.modelValue.includes(D);
    }
    function y(D) {
      a.disabled || !D || p("update:modelValue", h(D) ? a.modelValue.filter((z) => z !== D) : [...a.modelValue, D]);
    }
    function w() {
      const D = u.value.trim();
      if (!D || h(D)) {
        u.value = "";
        return;
      }
      p("update:modelValue", [...a.modelValue, D]), u.value = "";
    }
    function d(D) {
      p("update:modelValue", a.modelValue.filter((z) => z !== D));
    }
    function I(D) {
      return a.options?.find((z) => z.value === D)?.label ?? D;
    }
    return (D, z) => (n(), v("div", Dl, [
      t.options && t.options.length > 10 ? (n(), v(F, { key: 0 }, [
        (n(!0), v(F, null, G(t.modelValue, (f) => (n(), v("span", {
          key: f,
          class: "row"
        }, [
          j(A(I(f)), 1),
          t.disabled ? T("", !0) : (n(), R(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + f,
            onClick: (m) => d(f),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: r(() => [
              o(l(H), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128)),
        t.disabled ? T("", !0) : (n(), R(l(oe), {
          key: 0,
          "model-value": "",
          "aria-label": t.placeholder ?? "Add",
          "onUpdate:modelValue": z[0] || (z[0] = (f) => y(f)),
          class: "pim-chip-entry",
          options: [{ value: "", label: String(t.placeholder ?? "Add…") }, ...t.options.filter((f) => !h(f.value)).map((f) => ({ value: f.value, label: String(f.label ?? f.value) }))],
          "option-label": "label",
          "option-value": "value",
          appendTo: "self"
        }, null, 8, ["aria-label", "options"]))
      ], 64)) : t.options ? (n(), v(F, { key: 1 }, [
        o(l(De), {
          "model-value": t.modelValue.filter((f) => t.options.some((m) => m.value === f)),
          options: t.options.map((f) => ({ value: f.value, label: f.label ?? f.value })),
          "option-label": "label",
          "option-value": "value",
          multiple: "",
          disabled: t.disabled,
          "aria-label": t.placeholder ?? "Selected values",
          "onUpdate:modelValue": z[1] || (z[1] = (f) => p("update:modelValue", [...f, ...t.modelValue.filter((m) => !t.options.some((g) => g.value === m))]))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), v(F, null, G(t.modelValue.filter((f) => !t.options.some((m) => m.value === f)), (f) => (n(), v("span", {
          key: f,
          class: "row"
        }, [
          j(A(I(f)), 1),
          t.disabled ? T("", !0) : (n(), R(l(L), {
            key: 0,
            type: "button",
            "aria-label": "Remove " + f,
            onClick: (m) => d(f),
            size: "small",
            text: "",
            severity: "secondary"
          }, {
            default: r(() => [
              o(l(H), { icon: "tabler:x" })
            ]),
            _: 1
          }, 8, ["aria-label", "onClick"]))
        ]))), 128))
      ], 64)) : (n(!0), v(F, { key: 2 }, G(t.modelValue, (f) => (n(), v("span", {
        key: f,
        class: "row"
      }, [
        j(A(f), 1),
        t.disabled ? T("", !0) : (n(), R(l(L), {
          key: 0,
          type: "button",
          "aria-label": "Remove " + f,
          onClick: (m) => d(f),
          size: "small",
          text: "",
          severity: "secondary"
        }, {
          default: r(() => [
            o(l(H), { icon: "tabler:x" })
          ]),
          _: 1
        }, 8, ["aria-label", "onClick"]))
      ]))), 128)),
      t.free && !t.disabled ? (n(), R(l(ne), {
        key: 3,
        modelValue: u.value,
        "onUpdate:modelValue": z[2] || (z[2] = (f) => u.value = f),
        type: "text",
        placeholder: t.placeholder ?? "Add…",
        onKeydown: re(X(w, ["prevent"]), ["enter"]),
        onBlur: w,
        class: "pim-chip-entry"
      }, null, 8, ["modelValue", "placeholder", "onKeydown"])) : T("", !0)
    ]));
  }
}), El = ["inert"], Bl = ["schema", "config"], Ll = {
  key: 1,
  class: "muted small",
  role: "status"
}, Re = /* @__PURE__ */ Q({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = E("pending");
    async function h() {
      u.value = "pending", u.value = await Ne("wc-schema-form") ? "ready" : "failed";
    }
    Ie(h);
    function y(w) {
      const d = w.detail;
      d && typeof d == "object" && !Array.isArray(d) && p("update:modelValue", d);
    }
    return (w, d) => (n(), v("div", {
      inert: t.disabled || void 0
    }, [
      u.value === "ready" ? (n(), v("wc-schema-form", {
        key: 0,
        schema: JSON.stringify(a.schema),
        config: JSON.stringify(t.modelValue),
        onConfigChanged: y
      }, null, 40, Bl)) : u.value === "pending" ? (n(), v("span", Ll, "Configuration form is loading.")) : (n(), R(l(ue), {
        key: 2,
        role: "alert",
        severity: "error"
      }, {
        default: r(() => [
          d[2] || (d[2] = j("Configuration form could not be loaded. ", -1)),
          o(l(L), {
            type: "button",
            disabled: t.disabled,
            onClick: h,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: r(() => [...d[1] || (d[1] = [
              j("Retry", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ]),
        _: 1
      })),
      o(l(L), {
        type: "button",
        disabled: t.disabled,
        onClick: d[0] || (d[0] = (I) => p("update:modelValue", {})),
        severity: "secondary",
        outlined: "",
        size: "small"
      }, {
        default: r(() => [
          o(l(H), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          }),
          d[3] || (d[3] = j(" Reset overrides", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, El));
  }
}), Kl = /* @__PURE__ */ Q({
  __name: "DefaultValue",
  props: {
    attribute: {},
    type: {}
  },
  emits: ["change"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = J(() => {
      const d = a.type?.form;
      let I = { type: "string" };
      return d === "bool" ? I = { type: "boolean" } : d === "int" ? I = { type: "integer" } : d === "dec" ? I = { type: "string", pattern: "^-?\\d+(\\.\\d+)?$", description: "Exact number, for example 12.50." } : d === "quantity" ? I = { type: "object", required: ["value", "unit"], properties: { value: { type: "string", title: "Amount" }, unit: { type: "string", title: "Unit", enum: Object.keys(a.attribute.config?.units ?? {}) } }, additionalProperties: !1 } : d === "record" ? I = { type: "object", additionalProperties: !0 } : d === "ref" && (I = { type: "object", required: ["ref"], properties: { ref: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 2, description: `Reference kind (${a.type?.target ?? "link kind"}) and identity.` } }, additionalProperties: !1 }), (a.attribute.cardinality ?? "one") !== "one" && (I = { type: "array", items: I, uniqueItems: a.attribute.cardinality === "set" }), { type: "object", properties: { value: { ...I, title: "Default value" } } };
    });
    function h(d) {
      return d && typeof d == "object" && "m" in d && "e" in d ? Pl(d) : d;
    }
    function y(d) {
      return a.type?.form === "dec" ? h(d) : a.type?.form === "quantity" && d && typeof d == "object" && "v" in d && "u" in d ? { value: h(d.v), unit: d.u } : d;
    }
    const w = J(() => a.attribute.default === void 0 ? {} : { value: Array.isArray(a.attribute.default) ? a.attribute.default.map(y) : y(a.attribute.default) });
    return (d, I) => (n(), R(Re, {
      schema: u.value,
      "model-value": w.value,
      "onUpdate:modelValue": I[0] || (I[0] = (D) => p("change", D.value))
    }, null, 8, ["schema", "model-value"]));
  }
}), Ml = { class: "pim-stack" }, Hl = { class: "pim-bsection-head" }, Jl = {
  key: 0,
  class: "mono muted small"
}, Fl = { class: "pim-source-permissions" }, Wl = ["for"], Gl = ["onDragstart"], Zl = { class: "pim-fields" }, Yl = { class: "pim-f pim-w-third" }, Ql = { class: "pim-f-label" }, Xl = {
  key: 0,
  class: "pim-f-note"
}, et = { class: "pim-f pim-w-third" }, lt = { class: "pim-f pim-w-third" }, tt = {
  key: 0,
  class: "pim-f pim-w-third"
}, at = {
  key: 1,
  class: "pim-f pim-w-third"
}, nt = { class: "pim-f pim-w-third" }, st = { class: "pim-f pim-w-third" }, it = { class: "pim-f pim-w-half" }, ot = { class: "pim-f pim-w-half" }, dt = { class: "row" }, ut = {
  key: 2,
  class: "pim-f pim-w-full"
}, rt = { class: "pim-contexts" }, ct = { class: "small muted" }, mt = { class: "pim-f pim-w-half" }, pt = {
  key: 3,
  class: "pim-f pim-w-full"
}, ft = { class: "row end" }, vt = { class: "row pim-add-row" }, yt = { class: "form" }, bt = { class: "pim-aspect row pim-add-row" }, gt = /* @__PURE__ */ Q({
  __name: "BuilderFields",
  props: {
    draft: {},
    schema: {},
    options: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = ["quarter", "third", "half", "full"], h = [{ value: "one", label: "Single value" }, { value: "list", label: "Ordered list" }, { value: "set", label: "Unique set" }], y = J(() => a.draft.aspects ?? []), w = J(() => (a.draft.dimensions ?? []).map((i) => ({ value: i.name, label: Y(i.name) }))), d = J(() => (a.draft.vocabularies ?? []).map((i) => i.code)), I = J(() => (a.draft.sources ?? []).map((i) => ({ value: i.id, label: Y(i.id) }))), D = J(() => [...a.options.types].sort((i, c) => i.form.localeCompare(c.form)).map((i) => ({ value: i.id, label: f(i) })));
    function z(i) {
      return a.options.types.find((c) => c.id === i.type);
    }
    function f(i) {
      return be(i.title, "Field type");
    }
    function m(i) {
      return z(i)?.target === "term";
    }
    function g(i) {
      const c = z(i);
      return !!c && c.form === "ref" && !c.target;
    }
    function s(i, c) {
      return c.id !== void 0 && a.schema.attributes[i + "." + c.code] !== void 0;
    }
    function C(i) {
      const c = (a.draft.families ?? []).filter((O) => O.aspects?.includes(i)).length;
      return c + (c === 1 ? " family" : " families");
    }
    const V = E({});
    function k(i, c) {
      return i + "." + (c.id ?? c.code);
    }
    function S(i, c) {
      i.type = c;
      const O = z(i);
      if (O && i.index && !O.indexes.includes(i.index) && delete i.index, m(i) || delete i.vocabulary, !g(i) && i.config && "target" in i.config) {
        const { target: $, ...W } = i.config;
        i.config = Object.keys(W).length ? W : void 0, i.config || delete i.config;
      }
    }
    function b(i, c) {
      Object.keys(c).length ? i.config = c : delete i.config;
    }
    function B(i, c) {
      const O = { ...i.config ?? {} };
      c ? O.target = c : delete O.target, b(i, O);
    }
    function te(i, c) {
      c.length ? i.scope = c : delete i.scope, c.length || delete i.index_contexts;
    }
    function _(i, c, O) {
      O === void 0 || O === "" || O === !1 && c !== "default" ? delete i[c] : i[c] = O;
    }
    function N(i) {
      return i.index_contexts ?? [];
    }
    function U(i) {
      return (a.draft.dimensions ?? []).find((c) => c.name === i)?.members ?? [];
    }
    function K(i) {
      const c = {};
      for (const $ of i.scope ?? []) c[$] = U($)[0] ?? "";
      (i.index_contexts ?? (i.index_contexts = [])).push(c);
    }
    const ee = E(null);
    function ce(i, c) {
      ee.value?.namespace === i.namespace && P(i.attributes ?? [], ee.value.index, c), ee.value = null;
    }
    const ye = E("");
    function $e() {
      const i = ye.value.trim();
      !le.test(i) || y.value.some((c) => c.namespace === i) || ((a.draft.aspects ??= []).push({ namespace: i, attributes: [] }), ye.value = "");
    }
    function Ue(i) {
      const c = y.value.indexOf(i);
      c >= 0 && y.value.splice(c, 1), a.schema.declaration.aspects?.some((O) => O.namespace === i.namespace) && p("remove", "aspects", i.namespace);
    }
    const me = E({});
    function pe(i) {
      const c = (me.value[i.namespace] ?? "").trim(), O = i.attributes ?? (i.attributes = []);
      if (!le.test(c) || O.some((q) => q.code === c)) return;
      const $ = a.options.types.find((q) => q.id === "kickside.pim.types:text") ?? a.options.types[0], W = { code: c, type: $?.id ?? "" };
      O.push(W), me.value[i.namespace] = "", V.value[k(i.namespace, W)] = !0;
    }
    function M(i, c) {
      const O = i.attributes ?? [], $ = O.indexOf(c);
      $ >= 0 && O.splice($, 1), s(i.namespace, c) && p("remove", "attributes", i.namespace + "." + c.code);
    }
    function P(i, c, O) {
      if (O < 0 || O >= i.length) return;
      const [$] = i.splice(c, 1);
      i.splice(O, 0, $);
    }
    return (i, c) => (n(), v("div", Ml, [
      (n(!0), v(F, null, G(y.value, (O) => (n(), R(ge, {
        key: O.namespace,
        count: O.attributes?.length ?? 0,
        columns: ["code", "kind", "details", "usage"]
      }, {
        head: r(() => [
          e("header", Hl, [
            e("div", null, [
              e("h3", null, [
                j(A(l(Y)(O.namespace)), 1),
                l(Y)(O.namespace).toLocaleLowerCase() !== O.namespace.toLocaleLowerCase() ? (n(), v("span", Jl, A(O.namespace), 1)) : T("", !0)
              ]),
              e("div", Fl, [
                e("label", {
                  for: "writers-" + O.namespace
                }, "Sources allowed to write", 8, Wl),
                o(l(rl), {
                  "input-id": "writers-" + O.namespace,
                  "aria-label": "Sources allowed to write",
                  "model-value": O.write?.sources ?? [],
                  options: I.value,
                  "option-label": "label",
                  "option-value": "value",
                  placeholder: "Any source",
                  appendTo: "self",
                  "onUpdate:modelValue": ($) => O.write = { sources: $ }
                }, null, 8, ["input-id", "model-value", "options", "onUpdate:modelValue"]),
                c[4] || (c[4] = e("span", { class: "small muted" }, "Leave empty to allow any source to write this field group.", -1))
              ])
            ]),
            o(l(L), {
              type: "button",
              onClick: ($) => Ue(O),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), { icon: "tabler:trash" }),
                c[5] || (c[5] = j(" Remove field group", -1))
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]),
        add: r(() => [
          e("div", vt, [
            o(l(ne), {
              modelValue: me.value[O.namespace],
              "onUpdate:modelValue": ($) => me.value[O.namespace] = $,
              type: "text",
              placeholder: "new_field",
              onKeydown: re(X(($) => pe(O), ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
            o(l(L), {
              type: "button",
              disabled: !l(le).test(me.value[O.namespace] ?? ""),
              onClick: ($) => pe(O),
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                c[21] || (c[21] = j(" Add field", -1))
              ]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ])
        ]),
        default: r(() => [
          (n(!0), v(F, null, G(O.attributes ?? [], ($, W) => (n(), R(he, {
            key: k(O.namespace, $),
            open: V.value[k(O.namespace, $)],
            "onUpdate:open": (q) => V.value[k(O.namespace, $)] = q,
            title: l(Y)($.code),
            code: O.namespace + "." + $.code,
            kind: z($) ? f(z($)) : "Unknown type",
            usage: C(O.namespace),
            class: "pim-attr",
            "head-class": "pim-attr-row",
            "toggle-class": "field-toggle",
            onHeadDragover: c[2] || (c[2] = X(() => {
            }, ["prevent"])),
            onHeadDrop: X((q) => ce(O, W), ["prevent"]),
            onHeadKeydown: [
              X((q) => P(O.attributes ?? [], W, W - 1), ["alt", "prevent"]),
              X((q) => P(O.attributes ?? [], W, W + 1), ["alt", "prevent"])
            ]
          }, {
            handle: r(() => [
              e("span", {
                class: "pim-grip",
                draggable: "true",
                "aria-hidden": "true",
                onClick: c[0] || (c[0] = X(() => {
                }, ["stop"])),
                onDragstart: X((q) => ee.value = { namespace: O.namespace, index: W }, ["stop"]),
                onDragend: c[1] || (c[1] = (q) => ee.value = null)
              }, [
                o(l(H), { icon: "tabler:grip-vertical" })
              ], 40, Gl)
            ]),
            details: r(() => [
              $.cardinality && $.cardinality !== "one" ? (n(), R(l(ae), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: r(() => [
                  j(A(h.find((q) => q.value === $.cardinality)?.label), 1)
                ]),
                _: 2
              }, 1024)) : T("", !0),
              $.scope?.length ? (n(), R(l(ae), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: r(() => [
                  j("per " + A($.scope.join(", ")), 1)
                ]),
                _: 2
              }, 1024)) : T("", !0),
              $.index && $.index !== "none" ? (n(), R(l(ae), {
                key: 2,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: r(() => [
                  j(A($.index) + " index", 1)
                ]),
                _: 2
              }, 1024)) : T("", !0),
              $.unique ? (n(), R(l(ae), {
                key: 3,
                class: "kx-tag-sm",
                severity: "secondary"
              }, {
                default: r(() => [...c[6] || (c[6] = [
                  j("unique", -1)
                ])]),
                _: 1
              })) : T("", !0)
            ]),
            actions: r(() => [
              o(l(L), {
                type: "button",
                disabled: W === 0,
                "aria-label": "Move " + $.code + " earlier",
                onClick: (q) => P(O.attributes, W, W - 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: r(() => [
                  o(l(H), { icon: "tabler:arrow-up" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"]),
              o(l(L), {
                type: "button",
                disabled: W === (O.attributes?.length ?? 0) - 1,
                "aria-label": "Move " + $.code + " later",
                onClick: (q) => P(O.attributes, W, W + 1),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: r(() => [
                  o(l(H), { icon: "tabler:arrow-down" })
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "onClick"])
            ]),
            default: r(() => [
              e("div", Zl, [
                e("div", Yl, [
                  e("div", Ql, [
                    c[7] || (c[7] = e("label", null, "Code", -1)),
                    s(O.namespace, $) ? (n(), v("span", Xl, "renames keep values")) : T("", !0)
                  ]),
                  o(l(ne), {
                    type: "text",
                    value: $.code,
                    onInput: (q) => $.code = q.target.value,
                    class: "mono"
                  }, null, 8, ["value", "onInput"])
                ]),
                e("div", et, [
                  c[8] || (c[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type")
                  ], -1)),
                  o(l(oe), {
                    "model-value": $.type,
                    options: D.value,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => S($, q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", lt, [
                  c[9] || (c[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Values")
                  ], -1)),
                  o(l(oe), {
                    "model-value": $.cardinality ?? "one",
                    options: h,
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => _($, "cardinality", q === "one" ? void 0 : q)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                m($) ? (n(), v("div", tt, [
                  c[10] || (c[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Vocabulary")
                  ], -1)),
                  o(l(oe), {
                    "model-value": $.vocabulary ?? "",
                    "onUpdate:modelValue": (q) => _($, "vocabulary", q),
                    options: [{ value: "", label: "Choose…" }, ...d.value.map((q) => ({ value: q, label: String(q) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : T("", !0),
                g($) ? (n(), v("div", at, [
                  c[11] || (c[11] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Link kind"),
                    e("span", { class: "pim-f-note" }, "owned by a plugin")
                  ], -1)),
                  o(l(oe), {
                    "model-value": $.config?.target ?? "",
                    "onUpdate:modelValue": (q) => B($, q),
                    options: [{ value: "", label: "Choose…" }, ...t.options.link_kinds.map((q) => ({ value: q.kind, label: l(be)(q.title, "Link kind") }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ])) : T("", !0),
                e("div", nt, [
                  c[12] || (c[12] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Index"),
                    e("span", { class: "pim-f-note" }, "for filters and keys")
                  ], -1)),
                  o(l(oe), {
                    "model-value": $.index ?? "none",
                    options: z($)?.indexes ?? ["none"],
                    appendTo: "self",
                    "onUpdate:modelValue": (q) => _($, "index", q === "none" ? void 0 : q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", st, [
                  c[13] || (c[13] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Width"),
                    e("span", { class: "pim-f-note" }, "of a form row")
                  ], -1)),
                  o(l(De), {
                    "model-value": $.width ?? t.schema.attributes[O.namespace + "." + $.code]?.width ?? "half",
                    options: u,
                    "allow-empty": !1,
                    "onUpdate:modelValue": (q) => $.width = q
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", it, [
                  c[14] || (c[14] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Varies per"),
                    e("span", { class: "pim-f-note" }, "dimensions the value depends on")
                  ], -1)),
                  o(de, {
                    "model-value": $.scope ?? [],
                    options: w.value,
                    "onUpdate:modelValue": (q) => te($, q)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ot, [
                  c[15] || (c[15] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Unique"),
                    e("span", { class: "pim-f-note" }, "one holder per value, catalog wide")
                  ], -1)),
                  e("label", dt, [
                    o(l(xe), {
                      "aria-label": "Unique " + $.code,
                      "model-value": $.unique === !0,
                      disabled: !!$.scope?.length || ($.cardinality ?? "one") !== "one",
                      "onUpdate:modelValue": (q) => _($, "unique", q)
                    }, null, 8, ["aria-label", "model-value", "disabled", "onUpdate:modelValue"]),
                    e("span", null, A($.unique ? "Yes" : "No"), 1)
                  ])
                ]),
                ($.scope?.length ?? 0) > 0 && $.index && $.index !== "none" ? (n(), v("div", ut, [
                  c[17] || (c[17] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Indexed contexts"),
                    e("span", { class: "pim-f-note" }, "which combinations get an index")
                  ], -1)),
                  e("div", rt, [
                    (n(!0), v(F, null, G(N($), (q, Ce) => (n(), v("div", {
                      key: Ce,
                      class: "pim-context-row"
                    }, [
                      (n(!0), v(F, null, G($.scope, (fe) => (n(), v("label", {
                        key: fe,
                        class: "pim-context-field"
                      }, [
                        e("span", ct, A(l(Y)(fe)), 1),
                        o(l(oe), {
                          "model-value": q[fe] ?? "",
                          options: U(fe),
                          class: "narrow",
                          appendTo: "self",
                          "onUpdate:modelValue": (Ke) => q[fe] = Ke
                        }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                      ]))), 128)),
                      o(l(L), {
                        type: "button",
                        "aria-label": "Remove context",
                        onClick: (fe) => N($).splice(Ce, 1),
                        text: "",
                        severity: "secondary",
                        size: "small"
                      }, {
                        default: r(() => [
                          o(l(H), { icon: "tabler:x" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    o(l(L), {
                      type: "button",
                      onClick: (q) => K($),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: r(() => [
                        o(l(H), {
                          icon: "tabler:plus",
                          "aria-hidden": "true"
                        }),
                        c[16] || (c[16] = j(" Add context", -1))
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : T("", !0),
                e("div", mt, [
                  c[18] || (c[18] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Default"),
                    e("span", { class: "pim-f-note" }, "when no value is set")
                  ], -1)),
                  o(Kl, {
                    attribute: $,
                    type: z($),
                    onChange: (q) => _($, "default", q)
                  }, null, 8, ["attribute", "type", "onChange"])
                ]),
                z($)?.config_schema ? (n(), v("div", pt, [
                  c[19] || (c[19] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Type configuration")
                  ], -1)),
                  o(Re, {
                    schema: z($).config_schema,
                    "model-value": $.config ?? {},
                    "onUpdate:modelValue": (q) => b($, q)
                  }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])
                ])) : T("", !0)
              ]),
              e("div", ft, [
                o(l(L), {
                  type: "button",
                  onClick: (q) => M(O, $),
                  text: "",
                  severity: "secondary",
                  size: "small"
                }, {
                  default: r(() => [
                    o(l(H), { icon: "tabler:trash" }),
                    c[20] || (c[20] = j(" Remove field", -1))
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
      e("section", yt, [
        e("div", bt, [
          o(l(ne), {
            modelValue: ye.value,
            "onUpdate:modelValue": c[3] || (c[3] = (O) => ye.value = O),
            type: "text",
            placeholder: "new_field_group",
            onKeydown: re(X($e, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          o(l(L), {
            type: "button",
            disabled: !l(le).test(ye.value),
            onClick: $e,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: r(() => [
              o(l(H), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              c[22] || (c[22] = j(" Add field group", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          c[23] || (c[23] = e("span", { class: "muted small" }, "A field group contains fields and can be written by named sources only.", -1))
        ])
      ])
    ]));
  }
}), ht = { class: "muted small" }, kt = { class: "pim-aspect" }, wt = {
  key: 0,
  class: "small muted"
}, $t = { class: "pim-fields" }, xt = { class: "pim-f pim-w-full" }, Ct = { class: "pim-f-label" }, _t = { class: "row pim-add-row" }, Vt = /* @__PURE__ */ Q({
  __name: "BuilderDimensions",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = J(() => a.draft.dimensions ?? []), h = E("");
    function y() {
      const f = h.value.trim();
      !le.test(f) || u.value.some((m) => m.name === f) || ((a.draft.dimensions ??= []).push({ name: f, members: [] }), h.value = "");
    }
    function w(f) {
      const m = [];
      for (const g of a.draft.aspects ?? []) for (const s of g.attributes ?? []) s.scope?.includes(f.name) && m.push(g.namespace + "." + s.code);
      for (const g of a.draft.families ?? []) for (const s of g.requirements ?? []) s.context && f.name in s.context && m.push(g.code + " requirement " + s.id);
      return m;
    }
    function d(f) {
      w(f).length || (u.value.splice(u.value.indexOf(f), 1), a.schema.declaration.dimensions?.some((m) => m.name === f.name) && p("remove", "dimensions", f.name));
    }
    function I(f, m) {
      if (f.members = m, f.fallback)
        for (const g of Object.keys(f.fallback)) m.includes(g) || delete f.fallback[g];
    }
    function D(f, m) {
      return f.fallback?.[m] ?? [];
    }
    function z(f, m, g) {
      const s = { ...f.fallback ?? {} };
      g.length ? s[m] = g : delete s[m], Object.keys(s).length ? f.fallback = s : delete f.fallback;
    }
    return (f, m) => (n(), R(ge, {
      count: u.value.length,
      columns: ["code", "details", "usage"]
    }, {
      add: r(() => [
        e("div", _t, [
          o(l(ne), {
            modelValue: h.value,
            "onUpdate:modelValue": m[0] || (m[0] = (g) => h.value = g),
            type: "text",
            placeholder: "new_dimension",
            onKeydown: re(X(y, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          o(l(L), {
            type: "button",
            disabled: !l(le).test(h.value),
            onClick: y,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: r(() => [
              o(l(H), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              m[3] || (m[3] = j(" Add dimension", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          m[4] || (m[4] = e("span", { class: "muted small" }, "A dimension lets a value differ per member, with fallbacks between members.", -1))
        ])
      ]),
      default: r(() => [
        (n(!0), v(F, null, G(u.value, (g) => (n(), R(he, {
          title: l(Y)(g.name),
          code: g.name,
          key: g.name,
          usage: w(g).length + (w(g).length === 1 ? " dependency" : " dependencies")
        }, {
          details: r(() => [
            e("span", ht, A(g.members.length) + " " + A(g.members.length === 1 ? "member" : "members"), 1)
          ]),
          actions: r(() => [
            o(l(L), {
              type: "button",
              disabled: w(g).length > 0,
              "aria-label": "Remove " + l(Y)(g.name),
              title: w(g).length ? "Take the dimension off these first" : "",
              onClick: (s) => d(g),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title", "onClick"])
          ]),
          default: r(() => [
            e("div", kt, [
              w(g).length ? (n(), v("p", wt, "Used by " + A(w(g).join(", ")), 1)) : T("", !0),
              e("div", $t, [
                e("div", xt, [
                  m[1] || (m[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Members"),
                    e("span", { class: "pim-f-note" }, "the values this dimension takes")
                  ], -1)),
                  o(de, {
                    "model-value": g.members,
                    free: "",
                    placeholder: "add member",
                    "onUpdate:modelValue": (s) => I(g, s)
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                (n(!0), v(F, null, G(g.members, (s) => (n(), v("div", {
                  key: s,
                  class: "pim-f pim-w-half"
                }, [
                  e("div", Ct, [
                    e("label", null, A(s) + " falls back to", 1),
                    m[2] || (m[2] = e("span", { class: "pim-f-note" }, "in order, when it has no value", -1))
                  ]),
                  o(de, {
                    "model-value": D(g, s),
                    options: g.members.filter((C) => C !== s).map((C) => ({ value: C })),
                    "onUpdate:modelValue": (C) => z(g, s, C)
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
}), Ut = { class: "muted small" }, Ot = { class: "pim-aspect" }, St = { class: "row small" }, At = {
  key: 1,
  class: "muted small"
}, It = {
  key: 2,
  class: "pim-stack tight pim-terms"
}, Rt = {
  key: 1,
  class: "pim-grid compact"
}, jt = { key: 0 }, Tt = { class: "mono" }, qt = {
  key: 0,
  class: "mono muted"
}, zt = { class: "num" }, Nt = {
  key: 2,
  class: "muted small"
}, Pt = { class: "row" }, Dt = { class: "row wrap pim-add-row" }, Et = { class: "row pim-add-row" }, Bt = /* @__PURE__ */ Q({
  __name: "BuilderVocabularies",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/, h = J(() => a.schema.access.write), y = J(() => a.draft.vocabularies ?? []), w = E("");
    function d() {
      const _ = w.value.trim();
      !le.test(_) || y.value.some((N) => N.code === _) || ((a.draft.vocabularies ??= []).push({ code: _ }), w.value = "");
    }
    function I(_) {
      y.value.splice(y.value.indexOf(_), 1), a.schema.declaration.vocabularies?.some((N) => N.code === _.code) && p("remove", "vocabularies", _.code);
    }
    function D(_) {
      return !!a.schema.vocabularies[_];
    }
    const z = E({}), f = E({}), m = E({}), g = E({}), s = E({}), C = E({}), V = E({});
    async function k(_, N) {
      s.value[_] = !0, C.value[_] = "";
      try {
        const U = await se.termsPage(a.catalogId, _, N);
        f.value[_] = U.terms, g.value[_] = N, m.value[_] = U.next;
      } catch (U) {
        C.value[_] = U instanceof Error ? U.message : "Could not load terms.";
      } finally {
        s.value[_] = !1;
      }
    }
    function S(_) {
      z.value[_] = !z.value[_], z.value[_] && !f.value[_] && k(_);
    }
    function b(_) {
      return V.value[_] ?? (V.value[_] = { code: "", label: "", parent: "" });
    }
    async function B(_) {
      const N = b(_.code);
      if (!(!h.value || !u.test(N.code))) {
        s.value[_.code] = !0, C.value[_.code] = "";
        try {
          const U = { term: { vocabulary: _.code, code: N.code }, labels: { en: N.label || Y(N.code) } };
          _.hierarchical && N.parent && (U.parent = N.parent);
          const ee = (await se.apply(a.catalogId, [U])).outcomes[0];
          if (ee.outcome !== "created" && ee.outcome !== "updated") throw new Error(ee.findings?.[0]?.message ?? "The term was not accepted.");
          V.value[_.code] = { code: "", label: "", parent: "" }, se.invalidateTerms(a.catalogId), await k(_.code, g.value[_.code]);
        } catch (U) {
          C.value[_.code] = U instanceof Error ? U.message : "Could not add the term.";
        } finally {
          s.value[_.code] = !1;
        }
      }
    }
    async function te(_, N, U) {
      if (h.value && !(U && !await il.confirm({ header: "Retire term?", message: `Retire ${Oe(N)}? Term changes save immediately. You can restore this term later.`, acceptLabel: "Retire", rejectLabel: "Cancel" }))) {
        s.value[_.code] = !0, C.value[_.code] = "";
        try {
          const ee = (await se.apply(a.catalogId, [{ term: { vocabulary: _.code, code: N.code }, retired: U }])).outcomes[0];
          if (!ee || !["updated", "unchanged"].includes(ee.outcome)) throw new Error(ee?.findings?.map((ce) => ce.message ?? ce.code).join("; ") || "The term change was not accepted.");
          se.invalidateTerms(a.catalogId), await k(_.code, g.value[_.code]);
        } catch (K) {
          C.value[_.code] = K instanceof Error ? K.message : "Could not change the term.";
        } finally {
          s.value[_.code] = !1;
        }
      }
    }
    return (_, N) => (n(), R(ge, {
      count: y.value.length,
      columns: ["code", "details"]
    }, {
      add: r(() => [
        e("div", Et, [
          o(l(ne), {
            modelValue: w.value,
            "onUpdate:modelValue": N[0] || (N[0] = (U) => w.value = U),
            type: "text",
            placeholder: "new_vocabulary",
            onKeydown: re(X(d, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          o(l(L), {
            type: "button",
            disabled: !l(le).test(w.value),
            onClick: d,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: r(() => [
              o(l(H), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              N[10] || (N[10] = j(" Add vocabulary", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          N[11] || (N[11] = e("span", { class: "muted small" }, "Select fields pick their values from a vocabulary's terms.", -1))
        ])
      ]),
      default: r(() => [
        (n(!0), v(F, null, G(y.value, (U) => (n(), R(he, {
          title: l(Y)(U.code),
          code: U.code,
          key: U.code
        }, {
          details: r(() => [
            e("span", Ut, A(U.hierarchical ? "Hierarchical" : "Flat"), 1)
          ]),
          actions: r(() => [
            o(l(L), {
              type: "button",
              "aria-label": "Remove " + l(Y)(U.code),
              onClick: (K) => I(U),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["aria-label", "onClick"])
          ]),
          default: r(() => [
            e("div", Ot, [
              e("label", St, [
                o(l(xe), {
                  "aria-label": "Hierarchical " + U.code,
                  "model-value": U.hierarchical === !0,
                  "onUpdate:modelValue": (K) => K ? U.hierarchical = !0 : delete U.hierarchical
                }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                N[1] || (N[1] = e("span", null, "Hierarchical", -1))
              ]),
              D(U.code) ? (n(), R(l(L), {
                key: 0,
                type: "button",
                onClick: (K) => S(U.code),
                severity: "secondary",
                outlined: "",
                size: "small"
              }, {
                default: r(() => [
                  o(l(H), {
                    icon: "tabler:adjustments",
                    "aria-hidden": "true"
                  }),
                  j(" " + A(z.value[U.code] ? "Hide terms" : "Terms"), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : (n(), v("span", At, "Apply the schema before adding terms.")),
              z.value[U.code] ? (n(), v("div", It, [
                N[9] || (N[9] = e("p", { class: "muted small" }, "Term changes save immediately.", -1)),
                C.value[U.code] ? (n(), R(l(ue), {
                  key: 0,
                  severity: "error",
                  role: "alert"
                }, {
                  default: r(() => [
                    j(A(C.value[U.code]) + " ", 1),
                    o(l(L), {
                      type: "button",
                      disabled: s.value[U.code],
                      onClick: (K) => k(U.code, g.value[U.code]),
                      severity: "secondary",
                      outlined: "",
                      size: "small"
                    }, {
                      default: r(() => [...N[2] || (N[2] = [
                        j("Retry", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled", "onClick"])
                  ]),
                  _: 2
                }, 1024)) : T("", !0),
                (f.value[U.code] ?? []).length ? (n(), v("table", Rt, [
                  e("thead", null, [
                    e("tr", null, [
                      N[3] || (N[3] = e("th", null, "Code", -1)),
                      N[4] || (N[4] = e("th", null, "Label", -1)),
                      U.hierarchical ? (n(), v("th", jt, "Parent")) : T("", !0),
                      N[5] || (N[5] = e("th", null, null, -1))
                    ])
                  ]),
                  e("tbody", null, [
                    (n(!0), v(F, null, G(f.value[U.code], (K) => (n(), v("tr", {
                      key: K.code,
                      class: we({ muted: K.retired })
                    }, [
                      e("td", Tt, A(K.code), 1),
                      e("td", null, A(l(Oe)(K)), 1),
                      U.hierarchical ? (n(), v("td", qt, A(K.parent ?? ""), 1)) : T("", !0),
                      e("td", zt, [
                        o(l(L), {
                          type: "button",
                          disabled: !h.value || s.value[U.code],
                          onClick: (ee) => te(U, K, !K.retired),
                          text: "",
                          severity: "secondary",
                          size: "small"
                        }, {
                          default: r(() => [
                            j(A(K.retired ? "Restore" : "Retire"), 1)
                          ]),
                          _: 2
                        }, 1032, ["disabled", "onClick"])
                      ])
                    ], 2))), 128))
                  ])
                ])) : s.value[U.code] ? T("", !0) : (n(), v("p", Nt, "No terms yet.")),
                e("div", Pt, [
                  o(l(L), {
                    type: "button",
                    disabled: s.value[U.code] || !g.value[U.code],
                    onClick: (K) => k(U.code),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: r(() => [
                      o(l(H), {
                        icon: "tabler:chevrons-left",
                        "aria-hidden": "true"
                      }),
                      N[6] || (N[6] = j(" First terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"]),
                  o(l(L), {
                    type: "button",
                    disabled: s.value[U.code] || !m.value[U.code],
                    onClick: (K) => k(U.code, m.value[U.code]),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: r(() => [
                      o(l(H), {
                        icon: "tabler:chevron-right",
                        "aria-hidden": "true"
                      }),
                      N[7] || (N[7] = j(" Next terms", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                e("div", Dt, [
                  o(l(ne), {
                    modelValue: b(U.code).code,
                    "onUpdate:modelValue": (K) => b(U.code).code = K,
                    disabled: !h.value || s.value[U.code],
                    type: "text",
                    placeholder: "code",
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  o(l(ne), {
                    modelValue: b(U.code).label,
                    "onUpdate:modelValue": (K) => b(U.code).label = K,
                    disabled: !h.value || s.value[U.code],
                    type: "text",
                    placeholder: "Label (en)"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  U.hierarchical ? (n(), R(l(oe), {
                    key: 0,
                    modelValue: b(U.code).parent,
                    "onUpdate:modelValue": (K) => b(U.code).parent = K,
                    disabled: !h.value || s.value[U.code],
                    class: "narrow",
                    options: [{ value: "", label: "No parent" }, ...(f.value[U.code] ?? []).map((K) => ({ value: K.code, label: String(l(Oe)(K)) }))],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "options"])) : T("", !0),
                  o(l(L), {
                    type: "button",
                    disabled: !h.value || s.value[U.code] || !u.test(b(U.code).code),
                    onClick: (K) => B(U),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: r(() => [
                      o(l(H), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      N[8] || (N[8] = j(" Add term", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ])
              ])) : T("", !0)
            ])
          ]),
          _: 2
        }, 1032, ["title", "code"]))), 128))
      ]),
      _: 1
    }, 8, ["count"]));
  }
}), Lt = { class: "muted small" }, Kt = { class: "pim-aspect" }, Mt = { class: "pim-fields" }, Ht = { class: "pim-f pim-w-full" }, Jt = { class: "pim-aspect" }, Ft = { class: "pim-stack tight" }, Wt = { class: "pim-level-head" }, Gt = { class: "pim-fields" }, Zt = { class: "pim-f pim-w-half" }, Yt = { class: "pim-f pim-w-half" }, Qt = { class: "pim-aspect" }, Xt = { class: "pim-stack tight" }, ea = { class: "pim-level-head" }, la = { class: "mono" }, ta = { class: "pim-fields" }, aa = { class: "pim-f-label" }, na = { class: "pim-f pim-w-half" }, sa = { class: "pim-f pim-w-half" }, ia = { class: "row pim-add-row" }, oa = { class: "row pim-add-row" }, da = /* @__PURE__ */ Q({
  __name: "BuilderFamilies",
  props: {
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = J(() => (a.draft.families ?? []).filter((k) => k.code !== "generic")), h = J(() => {
      const k = (a.draft.aspects ?? []).map((b) => b.namespace), S = [...new Set(Object.entries(a.schema.attributes).filter(([, b]) => b.plugin).map(([b]) => b.split(".")[0]))];
      return [...k, ...S.filter((b) => !k.includes(b))].map((b) => ({ value: b, label: Y(b) }));
    });
    function y(k) {
      const S = [];
      for (const b of a.draft.aspects ?? []) if (k.aspects?.includes(b.namespace)) for (const B of b.attributes ?? []) S.push({ value: b.namespace + "." + B.code, label: Y(B.code) + " (" + b.namespace + ")" });
      for (const [b, B] of Object.entries(a.schema.attributes)) B.plugin && k.aspects?.includes(b.split(".")[0]) && !S.some((te) => te.value === b) && S.push({ value: b, label: Y(b) + " (" + b.split(".")[0] + ")" });
      return S;
    }
    const w = J(() => a.draft.dimensions ?? []), d = E("");
    function I() {
      const k = d.value.trim();
      !le.test(k) || (a.draft.families ?? []).some((S) => S.code === k) || ((a.draft.families ??= []).push({ code: k, aspects: [] }), d.value = "");
    }
    function D(k) {
      a.draft.families.splice(a.draft.families.indexOf(k), 1), a.schema.declaration.families?.some((S) => S.code === k.code) && p("remove", "families", k.code);
    }
    function z(k) {
      return k.variation ?? [];
    }
    function f(k) {
      (k.variation ??= []).push({ axes: [] });
    }
    function m(k) {
      return k.requirements ?? [];
    }
    const g = E({});
    function s(k) {
      const S = (g.value[k.code] ?? "").trim();
      !le.test(S) || m(k).some((b) => b.id === S) || ((k.requirements ??= []).push({ id: S, require: [] }), g.value[k.code] = "");
    }
    function C(k, S) {
      return k.context?.[S] ?? "";
    }
    function V(k, S, b) {
      const B = { ...k.context ?? {} };
      b ? B[S] = b : delete B[S], Object.keys(B).length ? k.context = B : delete k.context;
    }
    return (k, S) => (n(), R(ge, {
      count: u.value.length,
      columns: ["code", "details"]
    }, {
      add: r(() => [
        e("div", oa, [
          o(l(ne), {
            modelValue: d.value,
            "onUpdate:modelValue": S[0] || (S[0] = (b) => d.value = b),
            type: "text",
            placeholder: "new_family",
            onKeydown: re(X(I, ["prevent"]), ["enter"]),
            class: "mono"
          }, null, 8, ["modelValue", "onKeydown"]),
          o(l(L), {
            type: "button",
            disabled: !l(le).test(d.value),
            onClick: I,
            severity: "secondary",
            outlined: "",
            size: "small"
          }, {
            default: r(() => [
              o(l(H), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              }),
              S[11] || (S[11] = j(" Add family", -1))
            ]),
            _: 1
          }, 8, ["disabled"]),
          S[12] || (S[12] = e("span", { class: "muted small" }, "Products without a family use the generic one.", -1))
        ])
      ]),
      default: r(() => [
        (n(!0), v(F, null, G(u.value, (b) => (n(), R(he, {
          title: l(Y)(b.code),
          code: b.code,
          key: b.code
        }, {
          details: r(() => [
            e("span", Lt, A(b.aspects?.length ?? 0) + " " + A(b.aspects?.length === 1 ? "field group" : "field groups"), 1)
          ]),
          actions: r(() => [
            o(l(L), {
              type: "button",
              onClick: (B) => D(b),
              "aria-label": "Remove " + l(Y)(b.code),
              text: "",
              severity: "secondary",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick", "aria-label"])
          ]),
          default: r(() => [
            e("div", Kt, [
              e("div", Mt, [
                e("div", Ht, [
                  S[1] || (S[1] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Field groups"),
                    e("span", { class: "pim-f-note" }, "the fields this family's products carry")
                  ], -1)),
                  o(de, {
                    "model-value": b.aspects ?? [],
                    options: h.value,
                    "onUpdate:modelValue": (B) => l(ke)(b, "aspects", B)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            e("div", Jt, [
              S[5] || (S[5] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Variation"),
                e("span", { class: "muted small" }, "model → variants → items; each level owns axes that make its children distinct")
              ], -1)),
              e("div", Ft, [
                (n(!0), v(F, null, G(z(b), (B, te) => (n(), v("div", {
                  key: te,
                  class: "pim-level"
                }, [
                  e("div", Wt, [
                    e("strong", null, "Level " + A(te + 1), 1),
                    o(l(L), {
                      type: "button",
                      "aria-label": "Remove level",
                      onClick: (_) => z(b).splice(te, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: r(() => [
                        o(l(H), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", Gt, [
                    e("div", Zt, [
                      S[2] || (S[2] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Axes"),
                        e("span", { class: "pim-f-note" }, "key-indexed, one value each")
                      ], -1)),
                      o(de, {
                        "model-value": B.axes ?? [],
                        options: y(b),
                        "onUpdate:modelValue": (_) => B.axes = _
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", Yt, [
                      S[3] || (S[3] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Also owned here"),
                        e("span", { class: "pim-f-note" }, "other fields written at this level")
                      ], -1)),
                      o(de, {
                        "model-value": B.own ?? [],
                        options: y(b),
                        "onUpdate:modelValue": (_) => _.length ? B.own = _ : delete B.own
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                o(l(L), {
                  type: "button",
                  onClick: (B) => f(b),
                  severity: "secondary",
                  outlined: "",
                  size: "small"
                }, {
                  default: r(() => [
                    o(l(H), {
                      icon: "tabler:plus",
                      "aria-hidden": "true"
                    }),
                    S[4] || (S[4] = j(" Add level", -1))
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ]),
            e("div", Qt, [
              S[10] || (S[10] = e("header", { class: "pim-aspect-head" }, [
                e("h3", null, "Requirements"),
                e("span", { class: "muted small" }, "what a channel needs before a product is ready")
              ], -1)),
              e("div", Xt, [
                (n(!0), v(F, null, G(m(b), (B, te) => (n(), v("div", {
                  key: B.id,
                  class: "pim-level"
                }, [
                  e("div", ea, [
                    e("strong", la, A(B.id), 1),
                    o(l(L), {
                      type: "button",
                      "aria-label": "Remove requirement",
                      onClick: (_) => m(b).splice(te, 1),
                      text: "",
                      severity: "secondary",
                      size: "small"
                    }, {
                      default: r(() => [
                        o(l(H), { icon: "tabler:x" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  e("div", ta, [
                    (n(!0), v(F, null, G(w.value, (_) => (n(), v("div", {
                      key: _.name,
                      class: "pim-f pim-w-third"
                    }, [
                      e("div", aa, [
                        e("label", null, A(l(Y)(_.name)), 1),
                        S[6] || (S[6] = e("span", { class: "pim-f-note" }, "context", -1))
                      ]),
                      o(l(oe), {
                        "model-value": C(B, _.name),
                        "onUpdate:modelValue": (N) => V(B, _.name, N),
                        options: [{ value: "", label: "not stated" }, { value: "all", label: "all members" }, ..._.members.map((N) => ({ value: N, label: String(N) }))],
                        "option-label": "label",
                        "option-value": "value",
                        appendTo: "self"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]))), 128)),
                    e("div", na, [
                      S[7] || (S[7] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Required"),
                        e("span", { class: "pim-f-note" }, "must hold a value")
                      ], -1)),
                      o(de, {
                        "model-value": B.require ?? [],
                        options: y(b),
                        "onUpdate:modelValue": (_) => l(ke)(B, "require", _)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ]),
                    e("div", sa, [
                      S[8] || (S[8] = e("div", { class: "pim-f-label" }, [
                        e("label", null, "Authored"),
                        e("span", { class: "pim-f-note" }, "must be set in the context itself, not by fallback")
                      ], -1)),
                      o(de, {
                        "model-value": B.authored ?? [],
                        options: y(b),
                        "onUpdate:modelValue": (_) => l(ke)(B, "authored", _)
                      }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                    ])
                  ])
                ]))), 128)),
                e("div", ia, [
                  o(l(ne), {
                    modelValue: g.value[b.code],
                    "onUpdate:modelValue": (B) => g.value[b.code] = B,
                    type: "text",
                    placeholder: "requirement_id",
                    onKeydown: re(X((B) => s(b), ["prevent"]), ["enter"]),
                    class: "mono narrow"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                  o(l(L), {
                    type: "button",
                    disabled: !l(le).test(g.value[b.code] ?? ""),
                    onClick: (B) => s(b),
                    severity: "secondary",
                    outlined: "",
                    size: "small"
                  }, {
                    default: r(() => [
                      o(l(H), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      }),
                      S[9] || (S[9] = j(" Add requirement", -1))
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
}), ua = ["inert"], ra = {
  key: 0,
  class: "row wrap"
}, ca = {
  key: 2,
  class: "small muted"
}, ma = { class: "pim-principal-service" }, pa = /* @__PURE__ */ Q({
  __name: "PrincipalList",
  props: {
    modelValue: {},
    catalogId: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = E(!1), h = E(""), y = E({});
    let w = 0;
    ve(() => a.modelValue, async (f) => {
      const m = ++w;
      try {
        const g = await Nl(a.catalogId ?? "", f);
        m === w && (y.value = g);
      } catch {
        m === w && (y.value = {});
      }
    }, { immediate: !0, deep: !0 }), Ve(() => {
      w++;
    });
    function d(f) {
      return y.value[f] ?? be(f, "Person");
    }
    Ie(async () => {
      try {
        await ol("wc-principal-picker"), u.value = !0;
      } catch {
        u.value = !1;
      }
    });
    function I(f) {
      a.disabled || !f.trim() || a.modelValue.includes(f.trim()) || (p("update:modelValue", [...a.modelValue, f.trim()]), h.value = "");
    }
    function D(f) {
      const m = f.detail;
      if (!m || typeof m != "object") return;
      const g = m, s = g.principal_id ?? g.id;
      typeof s == "string" && I(s);
    }
    function z(f) {
      a.disabled || p("update:modelValue", a.modelValue.filter((m) => m !== f));
    }
    return (f, m) => (n(), v("div", {
      class: "pim-principal-list",
      inert: t.disabled || void 0
    }, [
      t.modelValue.length ? (n(), v("div", ra, [
        (n(!0), v(F, null, G(t.modelValue, (g) => (n(), R(l(ae), {
          key: g,
          severity: "secondary"
        }, {
          default: r(() => [
            e("span", null, A(d(g)), 1),
            o(l(L), {
              text: "",
              size: "small",
              disabled: t.disabled,
              "aria-label": "Remove " + d(g),
              onClick: (s) => z(g)
            }, {
              default: r(() => [
                o(l(H), { icon: "tabler:x" })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ]),
          _: 2
        }, 1024))), 128))
      ])) : T("", !0),
      u.value ? (n(), v("wc-principal-picker", {
        key: 1,
        config: "{}",
        kinds: "user",
        placeholder: "Add a person…",
        onConfigChanged: X(D, ["stop"])
      }, null, 32)) : (n(), v("span", ca, "The person picker is unavailable.")),
      e("label", ma, [
        m[3] || (m[3] = e("span", { class: "small muted" }, "Service account", -1)),
        o(l(ne), {
          modelValue: h.value,
          "onUpdate:modelValue": m[0] || (m[0] = (g) => h.value = g),
          disabled: t.disabled,
          placeholder: "Service principal id",
          onKeydown: m[1] || (m[1] = re(X((g) => I(h.value), ["prevent"]), ["enter"]))
        }, null, 8, ["modelValue", "disabled"])
      ]),
      o(l(L), {
        severity: "secondary",
        outlined: "",
        size: "small",
        disabled: t.disabled || !h.value.trim(),
        onClick: m[2] || (m[2] = (g) => I(h.value))
      }, {
        default: r(() => [
          o(l(H), { icon: "tabler:plus" }),
          m[4] || (m[4] = j(" Add service account", -1))
        ]),
        _: 1
      }, 8, ["disabled"])
    ], 8, ua));
  }
}), fa = { class: "pim-stack" }, va = { class: "muted small" }, ya = { class: "pim-fields" }, ba = { class: "pim-f pim-w-half" }, ga = { class: "pim-f pim-w-half" }, ha = { class: "row pim-add-row" }, ka = { class: "muted small" }, wa = { class: "pim-fields" }, $a = { class: "pim-f pim-w-third" }, xa = { class: "pim-f pim-w-third" }, Ca = { class: "row" }, _a = { class: "pim-f pim-w-third" }, Va = { class: "pim-f pim-w-full" }, Ua = { class: "row pim-add-row" }, Oa = /* @__PURE__ */ Q({
  __name: "BuilderChannels",
  props: {
    catalogId: {},
    draft: {},
    schema: {}
  },
  emits: ["remove"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = J(() => a.draft.channels ?? []), h = J(() => a.draft.sources ?? []), y = J(() => [...new Set((a.draft.families ?? []).flatMap((s) => (s.requirements ?? []).map((C) => C.id)))].map((s) => ({ value: s }))), w = J(() => (a.draft.families ?? []).filter((s) => s.code !== "generic").map((s) => ({ value: s.code, label: Y(s.code) }))), d = J(() => (a.draft.aspects ?? []).map((s) => ({ value: s.namespace, label: Y(s.namespace) }))), I = E(""), D = E("");
    function z() {
      const s = I.value.trim();
      !le.test(s) || u.value.some((C) => C.id === s) || ((a.draft.channels ??= []).push({ id: s, requirements: [] }), I.value = "");
    }
    function f(s) {
      u.value.splice(u.value.indexOf(s), 1), a.schema.declaration.channels?.some((C) => C.id === s.id) && p("remove", "channels", s.id);
    }
    function m() {
      const s = D.value.trim();
      !le.test(s) || h.value.some((C) => C.id === s) || ((a.draft.sources ??= []).push({ id: s, ordering: "none", writes: [] }), D.value = "");
    }
    function g(s) {
      h.value.splice(h.value.indexOf(s), 1), a.schema.declaration.sources?.some((C) => C.id === s.id) && p("remove", "sources", s.id);
    }
    return (s, C) => (n(), v("div", fa, [
      o(ge, {
        count: u.value.length,
        columns: ["code", "details"]
      }, {
        head: r(() => [...C[2] || (C[2] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Channels")
          ], -1)
        ])]),
        add: r(() => [
          e("div", ha, [
            o(l(ne), {
              modelValue: I.value,
              "onUpdate:modelValue": C[0] || (C[0] = (V) => I.value = V),
              type: "text",
              placeholder: "new_channel",
              onKeydown: re(X(z, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            o(l(L), {
              type: "button",
              disabled: !l(le).test(I.value),
              onClick: z,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                C[5] || (C[5] = j(" Add channel", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: r(() => [
          (n(!0), v(F, null, G(u.value, (V) => (n(), R(he, {
            key: V.id,
            title: l(Y)(V.id),
            code: V.id
          }, {
            details: r(() => [
              e("span", va, A(V.requirements?.length ?? 0) + " " + A(V.requirements?.length === 1 ? "requirement" : "requirements"), 1)
            ]),
            actions: r(() => [
              o(l(L), {
                type: "button",
                onClick: (k) => f(V),
                "aria-label": "Remove " + l(Y)(V.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: r(() => [
                  o(l(H), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: r(() => [
              e("div", ya, [
                e("div", ba, [
                  C[3] || (C[3] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Requirements"),
                    e("span", { class: "pim-f-note" }, "a product is ready for the channel when these hold")
                  ], -1)),
                  o(de, {
                    "model-value": V.requirements ?? [],
                    options: y.value,
                    "onUpdate:modelValue": (k) => l(ke)(V, "requirements", k)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ]),
                e("div", ga, [
                  C[4] || (C[4] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Families"),
                    e("span", { class: "pim-f-note" }, "empty means every family")
                  ], -1)),
                  o(de, {
                    "model-value": V.families ?? [],
                    options: w.value,
                    "onUpdate:modelValue": (k) => l(ke)(V, "families", k)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])
              ])
            ]),
            _: 2
          }, 1032, ["title", "code"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      o(ge, {
        count: h.value.length,
        columns: ["code", "details"]
      }, {
        head: r(() => [...C[6] || (C[6] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Sources")
          ], -1)
        ])]),
        add: r(() => [
          e("div", Ua, [
            o(l(ne), {
              modelValue: D.value,
              "onUpdate:modelValue": C[1] || (C[1] = (V) => D.value = V),
              type: "text",
              placeholder: "new_source",
              onKeydown: re(X(m, ["prevent"]), ["enter"]),
              class: "mono"
            }, null, 8, ["modelValue", "onKeydown"]),
            o(l(L), {
              type: "button",
              disabled: !l(le).test(D.value),
              onClick: m,
              severity: "secondary",
              outlined: "",
              size: "small"
            }, {
              default: r(() => [
                o(l(H), {
                  icon: "tabler:plus",
                  "aria-hidden": "true"
                }),
                C[11] || (C[11] = j(" Add source", -1))
              ]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        default: r(() => [
          (n(!0), v(F, null, G(h.value, (V) => (n(), R(he, {
            key: V.id,
            title: l(Y)(V.id),
            code: V.id
          }, {
            details: r(() => [
              e("span", ka, A(V.writes?.length ?? 0) + " " + A(V.writes?.length === 1 ? "field group" : "field groups"), 1)
            ]),
            actions: r(() => [
              o(l(L), {
                type: "button",
                onClick: (k) => g(V),
                "aria-label": "Remove " + l(Y)(V.id),
                text: "",
                severity: "secondary",
                size: "small"
              }, {
                default: r(() => [
                  o(l(H), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick", "aria-label"])
            ]),
            default: r(() => [
              e("div", wa, [
                e("div", $a, [
                  C[7] || (C[7] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Ordering"),
                    e("span", { class: "pim-f-note" }, "sequence keeps late deliveries from winning")
                  ], -1)),
                  o(l(oe), {
                    "model-value": V.ordering ?? "none",
                    "onUpdate:modelValue": (k) => V.ordering = k,
                    options: [{ value: "none", label: "none" }, { value: "sequence", label: "sequence" }],
                    "option-label": "label",
                    "option-value": "value",
                    appendTo: "self"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                e("div", xa, [
                  C[8] || (C[8] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Audit"),
                    e("span", { class: "pim-f-note" }, "record each value change")
                  ], -1)),
                  e("label", Ca, [
                    o(l(xe), {
                      "aria-label": "Audit " + V.id,
                      "model-value": V.audit !== !1,
                      "onUpdate:modelValue": (k) => k ? delete V.audit : V.audit = !1
                    }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
                    e("span", null, A(V.audit === !1 ? "Off for this source" : "As the catalog policy"), 1)
                  ])
                ]),
                e("div", _a, [
                  C[9] || (C[9] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Principals"),
                    e("span", { class: "pim-f-note" }, "who may write as this source")
                  ], -1)),
                  o(pa, {
                    "catalog-id": t.catalogId,
                    "model-value": V.principals ?? [],
                    "onUpdate:modelValue": (k) => l(ke)(V, "principals", k)
                  }, null, 8, ["catalog-id", "model-value", "onUpdate:modelValue"])
                ]),
                e("div", Va, [
                  C[10] || (C[10] = e("div", { class: "pim-f-label" }, [
                    e("label", null, "Writes"),
                    e("span", { class: "pim-f-note" }, "field groups this source may set")
                  ], -1)),
                  o(de, {
                    "model-value": V.writes ?? [],
                    options: d.value,
                    "onUpdate:modelValue": (k) => l(ke)(V, "writes", k)
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
}), Sa = { class: "pim-stack" }, Aa = { class: "pim-bsection-head" }, Ia = { class: "muted small" }, Ra = {
  key: 0,
  class: "pim-aspect muted"
}, ja = {
  key: 1,
  class: "muted small"
}, Ta = {
  key: 3,
  class: "muted small"
}, qa = {
  key: 0,
  class: "pim-aspect muted"
}, za = { class: "muted small" }, Na = /* @__PURE__ */ Q({
  __name: "BuilderPlugins",
  props: {
    draft: {},
    schema: {},
    options: {},
    pluginConfigs: { default: () => ({}) }
  },
  emits: ["remove", "configure"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = J(() => a.draft.plugins ?? []);
    function h(m) {
      return u.value.some((g) => g.use === m.plugin);
    }
    function y(m) {
      return a.schema.plugins.find((g) => g.plugin === m.plugin);
    }
    function w(m, g) {
      g && !h(m) && (a.draft.plugins ??= []).push({ use: m.plugin }), g || (a.draft.plugins = u.value.filter((s) => s.use !== m.plugin), delete a.pluginConfigs[m.plugin], y(m)?.active && p("remove", "plugins", m.plugin));
    }
    function d(m, g) {
      a.pluginConfigs[m.plugin] = g;
    }
    function I(m) {
      return Object.entries(a.schema.attributes).filter(([, g]) => g.plugin === m.plugin).map(([g]) => g);
    }
    const D = J(() => a.draft.scopes ?? []);
    function z(m) {
      return D.value.includes(m.id);
    }
    function f(m, g) {
      g && !z(m) && (a.draft.scopes ??= []).push(m.id), !g && z(m) && (D.value.splice(D.value.indexOf(m.id), 1), a.schema.declaration.scopes?.includes(m.id) && p("remove", "scopes", m.id));
    }
    return (m, g) => (n(), v("div", Sa, [
      o(ge, {
        count: t.options.plugins.length,
        columns: ["details"]
      }, {
        head: r(() => [
          e("header", Aa, [
            g[0] || (g[0] = e("h3", null, "Plugins", -1)),
            e("span", Ia, A(t.options.plugins.length) + " installed", 1)
          ])
        ]),
        default: r(() => [
          t.options.plugins.length === 0 ? (n(), v("div", Ra, "No plugin is installed.")) : T("", !0),
          (n(!0), v(F, null, G(t.options.plugins, (s) => (n(), R(he, {
            key: s.plugin,
            title: l(be)(s.title, "Plugin")
          }, {
            details: r(() => [
              o(l(ae), {
                severity: h(s) ? "success" : "secondary",
                value: h(s) ? "Active" : "Inactive"
              }, null, 8, ["severity", "value"])
            ]),
            actions: r(() => [
              o(l(xe), {
                "aria-label": "Enable " + l(be)(s.title, "Plugin"),
                "model-value": h(s),
                "onUpdate:modelValue": (C) => w(s, C)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: r(() => [
              y(s)?.problem ? (n(), R(l(ue), {
                key: 0,
                severity: "warn"
              }, {
                default: r(() => [
                  j(A(y(s)?.problem?.message), 1)
                ]),
                _: 2
              }, 1024)) : T("", !0),
              I(s).length ? (n(), v("p", ja, "Fields: " + A(I(s).join(", ")) + ".", 1)) : T("", !0),
              h(s) ? (n(), R(Re, {
                key: 2,
                schema: s.config_schema,
                "model-value": t.pluginConfigs[s.plugin] ?? y(s)?.config ?? {},
                "onUpdate:modelValue": (C) => d(s, C)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue"])) : T("", !0),
              y(s)?.active ? (n(), v("p", Ta, [
                j(A(y(s)?.lifecycle.state), 1),
                (n(!0), v(F, null, G(y(s)?.projections, (C, V) => (n(), v("span", { key: V }, " · " + A(V) + ": " + A(C.parked ? "paused" : C.bootstrapping ? "initializing" : "ready"), 1))), 128))
              ])) : T("", !0),
              y(s)?.active && t.pluginConfigs[s.plugin] ? (n(), R(l(L), {
                key: 4,
                label: "Save configuration",
                onClick: (C) => p("configure", s.plugin, t.pluginConfigs[s.plugin])
              }, null, 8, ["onClick"])) : T("", !0)
            ]),
            _: 2
          }, 1032, ["title"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      o(ge, {
        count: t.options.scopes.length,
        columns: ["details"]
      }, {
        head: r(() => [...g[1] || (g[1] = [
          e("header", { class: "pim-bsection-head" }, [
            e("h3", null, "Scopes"),
            e("span", { class: "muted small" }, "filters the grid can use from plugin tables")
          ], -1)
        ])]),
        default: r(() => [
          t.options.scopes.length === 0 ? (n(), v("div", qa, "No scope is declared.")) : T("", !0),
          (n(!0), v(F, null, G(t.options.scopes, (s) => (n(), R(he, {
            key: s.id,
            title: l(be)(s.title, "Scope")
          }, {
            details: r(() => [
              o(l(ae), {
                severity: z(s) ? "success" : "secondary",
                value: z(s) ? "Adopted" : "Not adopted"
              }, null, 8, ["severity", "value"])
            ]),
            actions: r(() => [
              o(l(xe), {
                "aria-label": "Adopt " + l(be)(s.title, "Scope"),
                "model-value": z(s),
                "onUpdate:modelValue": (C) => f(s, C)
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ]),
            default: r(() => [
              e("p", za, [
                g[2] || (g[2] = j("Filters: ", -1)),
                (n(!0), v(F, null, G(s.filters, (C, V) => (n(), R(l(ae), {
                  key: V,
                  class: "kx-tag-sm small",
                  severity: "secondary"
                }, {
                  default: r(() => [
                    j(A(V) + " · " + A(C.ops.join(" ")), 1)
                  ]),
                  _: 2
                }, 1024))), 128)),
                j(" · needs " + A(s.access) + " access", 1)
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
async function Pa(t) {
  const x = await Je(`/api/v1/pim-admin/catalogs/${encodeURIComponent(t)}/policy_defaults`, "policy defaults");
  if (x.audit !== "fields" && x.audit !== "off" || !["audit_days", "trash_days", "tombstone_days"].every((a) => typeof x[a] == "number" && Number.isSafeInteger(x[a])))
    throw new Error("Policy defaults are unavailable.");
  for (const [a, p] of Object.entries(Le)) {
    const u = x[a];
    if (typeof u != "number" || !Number.isSafeInteger(u) || u < p.min || u > p.max) throw new Error(`Policy ${a} is unavailable.`);
  }
  return x;
}
const Le = {
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
}, Da = { class: "form" }, Ea = {
  key: 0,
  class: "muted small pim-policy-status",
  role: "status"
}, Ba = ["id", "data-policy-group", "aria-label"], La = {
  key: 0,
  class: "pim-bsection-head"
}, Ka = { class: "pim-policy-copy" }, Ma = ["for"], Ha = ["id"], Ja = { key: 0 }, Fa = ["aria-expanded"], Wa = /* @__PURE__ */ Q({
  __name: "BuilderPolicy",
  props: {
    draft: {},
    catalogId: {},
    defaults: {}
  },
  setup(t) {
    const x = t, a = E(), p = J(() => x.defaults ?? a.value), u = E(""), h = E(!1);
    async function y() {
      if (!x.defaults) {
        u.value = "", h.value = !0;
        try {
          a.value = await Pa(x.catalogId ?? "");
        } catch (V) {
          u.value = V instanceof Error ? V.message : "Could not read policy defaults.";
        } finally {
          h.value = !1;
        }
      }
    }
    Ie(y);
    const w = J(() => x.draft.policy ?? {}), d = E(!1), I = [
      { key: "audit", title: "Audit trail", hint: "Fields records each value change. Off records only lifecycle, schema and release history.", kind: "enum" },
      { key: "audit_days", title: "Audit retention (days)", hint: "0 uses the 365-day default. History always expires.", kind: "int", min: 0, max: 106751 },
      { key: "trash_days", title: "Trash window (days)", hint: "How long a deleted product stays restorable.", kind: "int", min: 1, max: 106751 },
      { key: "tombstone_days", title: "Deleted product notices (days)", hint: "How long feeds report a purged product as deleted.", kind: "int", min: 1, max: 106751 }
    ], D = {
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
    function z(V) {
      const k = Le[V];
      return { key: V, ...k, kind: "int", hint: D[V] };
    }
    I.push(...["completed_work_days", "abandoned_work_days", "import_days"].map(z));
    const f = ["proposal_days", "proposal_count"].map(z), m = ["command_deadline_ms", "rebuild_rows", "job_batches", "import_rows", "proposal_bytes", "maintenance_rows", "maintenance_catalogs", "pending_creation_days"].map(z), g = [
      { id: "retention", title: "Retention", keys: I },
      { id: "proposals", title: "Proposals", keys: f },
      { id: "advanced", title: "", keys: m }
    ], s = J(() => [
      { value: "inherited", label: p.value ? `${p.value.audit === "fields" ? "Fields" : "Off"} (default)` : "Deployment default" },
      { value: "fields", label: "Fields" },
      { value: "off", label: "Off" }
    ]);
    function C(V, k) {
      const S = x.draft.policy ?? (x.draft.policy = {});
      S[V] = k == null || k === "" || k === "inherited" ? !1 : k;
    }
    return (V, k) => (n(), v("section", Da, [
      k[4] || (k[4] = e("p", { class: "muted small pim-policy-intro" }, "Empty fields inherit the deployment settings.", -1)),
      h.value ? (n(), v("p", Ea, "Loading deployment defaults…")) : T("", !0),
      u.value ? (n(), R(l(ue), {
        key: 1,
        severity: "error",
        role: "alert"
      }, {
        default: r(() => [
          j(A(u.value) + " ", 1),
          o(l(L), {
            severity: "secondary",
            outlined: "",
            onClick: y
          }, {
            default: r(() => [...k[1] || (k[1] = [
              j("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : T("", !0),
      (n(), v(F, null, G(g, (S) => (n(), v(F, {
        key: S.id
      }, [
        S.id !== "advanced" || d.value ? (n(), v("section", {
          key: 0,
          id: S.id === "advanced" ? "policy-advanced" : void 0,
          "data-policy-group": S.id,
          class: "pim-policy-group",
          "aria-label": S.title || "Advanced"
        }, [
          S.title ? (n(), v("header", La, [
            e("h3", null, A(S.title), 1)
          ])) : T("", !0),
          (n(!0), v(F, null, G(S.keys, (b) => (n(), v("div", {
            key: b.key,
            class: "pim-policy-row"
          }, [
            e("div", Ka, [
              e("label", {
                for: "pol-" + b.key
              }, A(b.title), 9, Ma),
              e("p", {
                id: "pol-help-" + b.key
              }, [
                j(A(b.hint), 1),
                b.global ? (n(), v("span", Ja, " Managed in deployment settings.")) : T("", !0)
              ], 8, Ha)
            ]),
            b.kind === "enum" ? (n(), R(l(oe), {
              key: 0,
              "input-id": "pol-" + b.key,
              "aria-describedby": "pol-help-" + b.key,
              class: "pim-policy-control",
              "model-value": typeof w.value[b.key] == "string" ? w.value[b.key] : "inherited",
              options: s.value,
              "option-label": "label",
              "option-value": "value",
              appendTo: "self",
              "onUpdate:modelValue": (B) => C(b.key, B)
            }, null, 8, ["input-id", "aria-describedby", "model-value", "options", "onUpdate:modelValue"])) : (n(), R(l(cl), {
              key: 1,
              disabled: b.global,
              "input-id": "pol-" + b.key,
              "aria-describedby": "pol-help-" + b.key,
              class: "pim-policy-control",
              "model-value": b.global ? Number(p.value?.[b.key] ?? 0) || null : typeof w.value[b.key] == "number" ? Number(w.value[b.key]) : null,
              min: b.min ?? (b.key === "audit_days" ? 0 : 1),
              max: b.max,
              step: 1,
              placeholder: p.value ? "Default: " + p.value[b.key] : "Deployment default",
              "onUpdate:modelValue": (B) => C(b.key, B)
            }, null, 8, ["disabled", "input-id", "aria-describedby", "model-value", "min", "max", "placeholder", "onUpdate:modelValue"]))
          ]))), 128))
        ], 8, Ba)) : T("", !0),
        S.id === "proposals" ? (n(), v("button", {
          key: 1,
          type: "button",
          class: "pim-policy-advanced",
          "aria-expanded": d.value,
          "aria-controls": "policy-advanced",
          onClick: k[0] || (k[0] = (b) => d.value = !d.value)
        }, [
          o(l(H), {
            icon: d.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          k[2] || (k[2] = e("span", null, "Advanced", -1)),
          k[3] || (k[3] = e("span", { class: "muted small" }, "Processing limits and deployment settings", -1))
        ], 8, Fa)) : T("", !0)
      ], 64))), 64))
    ]));
  }
}), Ga = { class: "form" }, Za = { class: "pim-aspect" }, Ya = /* @__PURE__ */ Q({
  __name: "BuilderDeclaration",
  props: {
    draft: {}
  },
  emits: ["replace", "validity"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = E(JSON.stringify(a.draft, null, 2)), h = E("");
    Ve(() => p("validity", !0)), ve(() => a.draft, (w) => {
      u.value = JSON.stringify(w, null, 2), h.value = "";
    }, { deep: !0 });
    function y() {
      try {
        const w = Cl(u.value);
        h.value = "", p("validity", !0), p("replace", w);
      } catch (w) {
        p("validity", !1), h.value = "Invalid declaration: " + (w instanceof Error ? w.message : String(w));
      }
    }
    return (w, d) => (n(), v("section", Ga, [
      e("div", Za, [
        d[1] || (d[1] = e("header", { class: "pim-aspect-head" }, [
          e("h3", null, "Declaration"),
          e("span", { class: "muted small" }, "edits apply to the draft when the JSON parses")
        ], -1)),
        h.value ? (n(), R(l(ue), {
          key: 0,
          severity: "error",
          role: "alert"
        }, {
          default: r(() => [
            j(A(h.value), 1)
          ]),
          _: 1
        })) : T("", !0),
        o(l(ml), {
          modelValue: u.value,
          "onUpdate:modelValue": d[0] || (d[0] = (I) => u.value = I),
          rows: "28",
          spellcheck: "false",
          onInput: y,
          onBlur: y,
          class: "mono pim-json-edit"
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}), Qa = {
  key: 0,
  class: "pim-detail-head"
}, Xa = { class: "pim-detail-actions" }, en = { class: "pim-settings-pane" }, ln = { class: "pim-builder-main pim-readable" }, tn = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, an = ["disabled", "inert"], nn = {
  key: 5,
  class: "pim-table pim-plan"
}, sn = { class: "pim-group-head" }, on = { class: "pim-card-body pad" }, dn = {
  key: 0,
  class: "muted"
}, un = {
  key: 1,
  class: "muted small"
}, rn = {
  key: 2,
  class: "muted small"
}, cn = {
  key: 3,
  class: "muted small"
}, mn = { key: 0 }, pn = {
  key: 5,
  class: "pim-plan-list"
}, fn = { class: "mono" }, vn = { class: "muted" }, yn = /* @__PURE__ */ Q({
  __name: "SchemaBuilder",
  props: {
    catalogId: {},
    embedded: { type: Boolean },
    title: {},
    backLabel: {}
  },
  emits: ["applied", "back", "dirty-changed"],
  setup(t, { emit: x }) {
    const a = t, p = x, u = [
      { id: "fields", title: "Fields" },
      { id: "dimensions", title: "Dimensions" },
      { id: "vocabularies", title: "Vocabularies" },
      { id: "families", title: "Families" },
      { id: "channels", title: "Channels & sources" },
      { id: "plugins", title: "Plugins & scopes" },
      { id: "policy", title: "Policy" },
      { id: "declaration", title: "Declaration" }
    ], h = E("fields"), y = E(null), w = E(null), d = E({}), I = E({}), D = E({}), z = J(() => Object.fromEntries(Object.entries(D.value).filter(([M]) => d.value.plugins?.some((P) => P.use === M) && !y.value?.plugins.some((P) => P.plugin === M && P.active)))), f = E(""), m = E(!1), g = E(""), s = E(null), C = E(null), V = E(!0), k = Se(), S = J(() => V.value && !!s.value && s.value.class !== "refused" && !!C.value?.matches(ce.value, y.value?.schema_generation ?? -1, z.value)), b = Se(), B = E(!1);
    let te = 0;
    ve([d, I, D], () => {
      te++, s.value = null;
    }, { deep: !0, flush: "sync" });
    async function _(M = !1, P = !1) {
      if (K.value && !M) return;
      const i = b.begin(), c = te, O = a.catalogId, $ = P ? Object.entries(D.value).filter(([W]) => y.value?.plugins.some((q) => q.plugin === W && q.active)) : [];
      B.value = !0, f.value = "";
      try {
        const [W, q] = await Promise.all([se.schema(O), se.schemaOptions(O)]);
        if (!b.current(i) || c !== te || O !== a.catalogId) return;
        y.value = W, w.value = q, d.value = _e(W.declaration), I.value = {}, D.value = Object.fromEntries($.filter(([Ce]) => W.plugins.some((fe) => fe.plugin === Ce && fe.active))), s.value = null, V.value = !0;
      } catch (W) {
        b.current(i) && (f.value = W instanceof Error ? W.message : "Could not load the schema.");
      } finally {
        b.current(i) && (B.value = !1);
      }
    }
    let N = () => {
    };
    ve(() => a.catalogId, (M) => {
      N(), N = dl(`component.${M}`, () => {
        K.value || _();
      });
    }, { immediate: !0 }), Pe(async () => {
      K.value || await _();
    }), Ve(() => {
      N(), k.begin(), b.begin();
    }), ve(() => a.catalogId, () => {
      k.begin(), m.value = !1, y.value = null, w.value = null, me(), _();
    });
    const U = J(() => Object.values(qe(d.value, I.value)).reduce((M, P) => M + (P?.length ?? 0), 0)), K = J(() => !!y.value && (JSON.stringify(d.value) !== JSON.stringify(y.value.declaration) || U.value > 0 || Object.keys(D.value).length > 0));
    ve(K, (M) => p("dirty-changed", M), { immediate: !0 });
    const ee = J(() => ![d.value.aspects, d.value.dimensions, d.value.vocabularies, d.value.families, d.value.channels, d.value.sources, d.value.plugins, d.value.scopes].some((M) => M?.length)), ce = J(() => {
      const M = _e(d.value), P = qe(M, I.value);
      return Object.keys(P).length && (M.remove = P), M;
    });
    ve(K, (M) => {
      M || (s.value = null);
    }), ve([ce, z], () => {
      s.value = null;
    }, { deep: !0 });
    async function ye() {
      if (!y.value || !V.value) return;
      const M = k.begin(), P = wl(ce.value, y.value.schema_generation, z.value);
      m.value = !0, f.value = "";
      try {
        const i = await se.planSchema(a.catalogId, P.declaration, P.generation, P.pluginConfigs);
        if (!k.current(M) || !P.matches(ce.value, y.value.schema_generation, z.value) || !V.value) return;
        C.value = P, s.value = i;
      } catch (i) {
        if (!k.current(M)) return;
        f.value = i instanceof Error ? i.message : "Could not review the change.", s.value = null, C.value = null;
      } finally {
        k.current(M) && (m.value = !1);
      }
    }
    async function $e() {
      if (!y.value || !K.value || !S.value || !C.value) return;
      const M = a.catalogId, P = k.begin();
      m.value = !0, f.value = "", g.value = "";
      try {
        const i = await se.applySchema(M, C.value.declaration, C.value.generation, C.value.pluginConfigs);
        if (M !== a.catalogId || !k.current(P) || (await _(!0, !0), M !== a.catalogId || !k.current(P))) return;
        g.value = `Applied as generation ${i.generation} (${i.class})`, p("applied", i.generation);
      } catch (i) {
        if (M !== a.catalogId || !k.current(P)) return;
        f.value = i instanceof Error ? i.message : "Could not apply the change.";
      } finally {
        k.current(P) && (m.value = !1);
      }
    }
    async function Ue(M, P) {
      const i = a.catalogId, c = b.begin(), O = k.begin();
      m.value = !0, f.value = "";
      try {
        const $ = JSON.stringify(P);
        if (await se.configurePlugin(i, M, _e(P)), i !== a.catalogId || !b.current(c)) return;
        const W = await se.schema(i);
        if (i !== a.catalogId || !b.current(c)) return;
        y.value && (y.value.plugins = W.plugins), JSON.stringify(D.value[M]) === $ && delete D.value[M], g.value = "Configuration saved";
      } catch ($) {
        i === a.catalogId && k.current(O) && (f.value = $ instanceof Error ? $.message : "Could not save configuration.");
      } finally {
        k.current(O) && (m.value = !1);
      }
    }
    function me() {
      D.value = {}, V.value = !0, y.value && (d.value = _e(y.value.declaration)), I.value = {}, s.value = null, g.value = "";
    }
    function pe(M, P) {
      const i = I.value[M] ?? [];
      i.includes(P) || (I.value = { ...I.value, [M]: [...i, P] });
    }
    return (M, P) => (n(), v("div", {
      class: we(["pim-builder", { embedded: t.embedded }])
    }, [
      t.embedded ? (n(), v("div", Qa, [
        e("h2", null, A(t.title || "Catalog"), 1),
        o(l(ae), {
          severity: "secondary",
          value: "Generation " + (y.value?.schema_generation ?? "…")
        }, null, 8, ["value"]),
        e("div", Xa, [
          ie(M.$slots, "actions", {
            access: y.value?.access
          }),
          o(Te, {
            access: y.value?.access,
            dirty: K.value,
            busy: m.value,
            valid: V.value,
            reviewed: !!s.value,
            "can-apply": S.value,
            onDiscard: me,
            onReview: ye,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ])
      ])) : (n(), R(kl, {
        key: 1,
        title: t.title || "Catalog",
        subtitle: "Settings · generation " + (y.value?.schema_generation ?? "…"),
        icon: "tabler:settings",
        "back-label": t.backLabel,
        onBack: P[0] || (P[0] = (i) => p("back"))
      }, {
        default: r(() => [
          ie(M.$slots, "actions", {
            access: y.value?.access
          }),
          o(Te, {
            access: y.value?.access,
            dirty: K.value,
            busy: m.value,
            valid: V.value,
            reviewed: !!s.value,
            "can-apply": S.value,
            onDiscard: me,
            onReview: ye,
            onApply: $e
          }, null, 8, ["access", "dirty", "busy", "valid", "reviewed", "can-apply"])
        ]),
        _: 3
      }, 8, ["title", "subtitle", "back-label"])),
      o(l(al), {
        value: h.value,
        "onUpdate:value": P[1] || (P[1] = (i) => h.value = i),
        class: "pim-section-tabs"
      }, {
        default: r(() => [
          o(l(nl), { "aria-label": "Schema sections" }, {
            default: r(() => [
              (n(), v(F, null, G(u, (i) => o(l(sl), {
                key: i.id,
                value: i.id
              }, {
                default: r(() => [
                  j(A(i.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])), 64))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["value"]),
      e("div", en, [
        e("div", ln, [
          f.value ? (n(), R(l(ue), {
            key: 0,
            severity: "error",
            role: "alert"
          }, {
            default: r(() => [
              j(A(f.value), 1)
            ]),
            _: 1
          })) : T("", !0),
          g.value ? (n(), R(l(ue), {
            key: 1,
            severity: "success"
          }, {
            default: r(() => [
              j(A(g.value), 1)
            ]),
            _: 1
          })) : T("", !0),
          B.value && (!y.value || !w.value) ? (n(), v("div", tn, "Loading…")) : (!y.value || !w.value) && f.value ? (n(), R(l(L), {
            key: 3,
            onClick: P[2] || (P[2] = (i) => _()),
            severity: "secondary",
            outlined: ""
          }, {
            default: r(() => [...P[5] || (P[5] = [
              j("Retry", -1)
            ])]),
            _: 1
          })) : y.value && w.value ? (n(), v("fieldset", {
            key: 4,
            class: "pim-editor-surface",
            disabled: m.value || !y.value.access.admin,
            inert: m.value || !y.value.access.admin
          }, [
            ee.value && h.value === "fields" ? (n(), R(l(ue), {
              key: 0,
              severity: "info"
            }, {
              default: r(() => [...P[6] || (P[6] = [
                j("No catalog definitions yet. Add a field group to start defining fields.", -1)
              ])]),
              _: 1
            })) : T("", !0),
            h.value === "fields" ? (n(), R(gt, {
              key: 1,
              draft: d.value,
              schema: y.value,
              options: w.value,
              onRemove: pe
            }, null, 8, ["draft", "schema", "options"])) : h.value === "dimensions" ? (n(), R(Vt, {
              key: 2,
              draft: d.value,
              schema: y.value,
              onRemove: pe
            }, null, 8, ["draft", "schema"])) : h.value === "vocabularies" ? (n(), R(Bt, {
              key: 3,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: y.value,
              onRemove: pe
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "families" ? (n(), R(da, {
              key: 4,
              draft: d.value,
              schema: y.value,
              onRemove: pe
            }, null, 8, ["draft", "schema"])) : h.value === "channels" ? (n(), R(Oa, {
              key: 5,
              "catalog-id": t.catalogId,
              draft: d.value,
              schema: y.value,
              onRemove: pe
            }, null, 8, ["catalog-id", "draft", "schema"])) : h.value === "plugins" ? (n(), R(Na, {
              key: 6,
              draft: d.value,
              schema: y.value,
              options: w.value,
              "plugin-configs": D.value,
              onConfigure: Ue,
              onRemove: pe
            }, null, 8, ["draft", "schema", "options", "plugin-configs"])) : h.value === "policy" ? (n(), R(Wa, {
              key: 7,
              "catalog-id": t.catalogId,
              draft: d.value
            }, null, 8, ["catalog-id", "draft"])) : h.value === "declaration" ? (n(), R(Ya, {
              key: 8,
              draft: d.value,
              onReplace: P[3] || (P[3] = (i) => d.value = i),
              onValidity: P[4] || (P[4] = (i) => {
                V.value = i, s.value = null;
              })
            }, null, 8, ["draft"])) : T("", !0)
          ], 8, an)) : T("", !0),
          s.value ? (n(), v("div", nn, [
            e("div", sn, [
              o(l(H), { icon: "tabler:checklist" }),
              P[7] || (P[7] = e("h3", null, "Review", -1)),
              o(l(ae), {
                class: "kx-tag-sm",
                severity: s.value.class === "refused" ? "danger" : s.value.class === "semantic" ? "warn" : "info"
              }, {
                default: r(() => [
                  j(A(s.value.class), 1)
                ]),
                _: 1
              }, 8, ["severity"])
            ]),
            e("div", on, [
              s.value.class === "unchanged" ? (n(), v("p", dn, "Nothing would change.")) : s.value.class === "cosmetic" ? (n(), v("p", un, "Labels, order, widths or choices only; no product is touched.")) : s.value.class === "additive" ? (n(), v("p", rn, "New fields or options; existing values stay as they are.")) : s.value.class === "semantic" ? (n(), v("p", cn, "Resolved values or readiness change; the catalog rebuilds its rows after apply.")) : (n(), R(l(ue), {
                key: 4,
                severity: "error"
              }, {
                default: r(() => [
                  P[8] || (P[8] = j("Refused: the draft cannot be compiled as it stands.", -1)),
                  s.value.migration ? (n(), v("span", mn, A(s.value.migration), 1)) : T("", !0)
                ]),
                _: 1
              })),
              s.value.changes.length || s.value.refused.length ? (n(), v("ul", pn, [
                (n(!0), v(F, null, G([...s.value.refused, ...s.value.changes], (i, c) => (n(), v("li", { key: c }, [
                  o(l(ae), {
                    class: "kx-tag-sm small",
                    severity: i.class === "refused" ? "danger" : i.class === "semantic" ? "warn" : "info"
                  }, {
                    default: r(() => [
                      j(A(i.class), 1)
                    ]),
                    _: 2
                  }, 1032, ["severity"]),
                  e("span", fn, A(i.code), 1),
                  e("span", vn, A(i.what), 1)
                ]))), 128))
              ])) : T("", !0)
            ])
          ])) : T("", !0)
        ])
      ])
    ], 2));
  }
}), bn = /* @__PURE__ */ Q({
  __name: "SettingsApp",
  setup(t) {
    const x = Fe(), a = We(), p = E(""), u = J(() => x.value.catalogId ?? ""), h = Se();
    async function y() {
      const w = h.begin(), d = u.value;
      try {
        const I = await se.catalogSummary(d);
        h.current(w) && (p.value = I?.title || "Untitled catalog");
      } catch {
        h.current(w) && (p.value = "Untitled catalog");
      }
    }
    return ve(u, () => {
      p.value = "", y();
    }), Pe(y), Ve(() => {
      h.begin();
    }), (w, d) => u.value ? (n(), R(yn, {
      key: u.value,
      "catalog-id": u.value,
      title: p.value || "Catalog",
      embedded: l(x).embedded,
      "back-label": l(x).embedded ? void 0 : "Back to catalog settings",
      onBack: d[0] || (d[0] = (I) => l(a)("navigate", { route: "" })),
      onDirtyChanged: d[1] || (d[1] = (I) => l(a)("dirty-changed", { dirty: I }))
    }, {
      actions: r(({ access: I }) => [
        I?.admin ? (n(), R(fl, {
          key: 0,
          "catalog-id": u.value,
          title: p.value || "Catalog"
        }, null, 8, ["catalog-id", "title"])) : T("", !0)
      ]),
      _: 1
    }, 8, ["catalog-id", "title", "embedded", "back-label"])) : T("", !0);
  }
});
class gn extends Ge {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { "catalog-id": { type: "string", default: "" }, embedded: { type: "boolean", default: !1 } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Ze
    };
  }
  static get vueConfig() {
    return { rootComponent: bn, plugins: [Ye] };
  }
}
ul(import.meta.url, gn);
