import { defineComponent as ue, useId as Oe, openBlock as P, createElementBlock as W, unref as F, normalizeClass as Qe, createElementVNode as Q, createTextVNode as oe, toDisplayString as q, createCommentVNode as X, renderSlot as le, ref as Y, computed as ee, createBlock as K, withCtx as se, createVNode as te, withKeys as Te, withModifiers as Ae, nextTick as xe, useModel as Ze, mergeModels as et, watch as de, onBeforeUnmount as Ne, onUnmounted as tt, Fragment as Se, renderList as Me, onMounted as nt } from "vue";
import pe from "primevue/button";
import Pe from "primevue/inputtext";
import rt from "primevue/inputnumber";
import it from "primevue/toggleswitch";
import Re from "primevue/select";
import at from "primevue/chip";
import { Icon as st } from "@iconify/vue";
import ot from "primevue/accordion";
import lt from "primevue/accordioncontent";
import dt from "primevue/accordionheader";
import ut from "primevue/accordionpanel";
import ct from "primevue/textarea";
import { e as ft } from "./mount-DPTy0rBc.js";
import { api as Fe } from "@wippy-fe/proxy";
const ht = ["aria-labelledby"], pt = { class: "kx-railhead" }, mt = ["id"], bt = { key: 0 }, gt = { class: "kx-railhead-acts" }, yt = { class: "kx-rail-body" }, fn = /* @__PURE__ */ ue({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const o = Oe();
    return (l, c) => (P(), W("aside", {
      class: Qe(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": F(o)
    }, [
      Q("div", pt, [
        Q("span", {
          id: F(o),
          class: "kx-railhead-title"
        }, [
          oe(q(e.title), 1),
          e.count !== void 0 ? (P(), W("b", bt, q(e.count), 1)) : X("", !0)
        ], 8, mt),
        Q("div", gt, [
          le(l.$slots, "actions")
        ])
      ]),
      le(l.$slots, "toolbar"),
      Q("div", yt, [
        le(l.$slots, "default")
      ])
    ], 10, ht));
  }
});
class re extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(o, l, c) {
    super(o.message ?? o.error ?? `${l} failed`), this.name = "ApiError", this.kind = o.kind, this.details = o.details, this.retryable = o.retryable, this.status = c;
  }
}
const Ve = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function je(e, o) {
  const l = e instanceof re ? e.details?.code : void 0, c = e instanceof Error && e.message || o;
  return typeof l != "string" || !l.trim() ? c : `${Object.hasOwn(Ve, l) ? Ve[l] : c}
Error code: ${l}`;
}
function Ue(e, o) {
  const l = e;
  if (l && typeof l == "object" && l.success === !1) throw new re(l, o);
  if (l && typeof l == "object" && l.success === !0 && l.data !== void 0) return l.data;
  throw new re({ kind: "INTERNAL", message: `${o}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, o);
}
function Ge(e, o) {
  if (e instanceof re) return e;
  const l = e?.response;
  return l?.data ? new re(l.data, o, l.status) : e instanceof Error ? e : new re({ kind: "Unavailable" }, o);
}
async function ke(e, o, l) {
  try {
    return Ue((await Fe.get(e, { params: l })).data, o);
  } catch (c) {
    throw Ge(c, o);
  }
}
async function ae(e, o, l) {
  try {
    return Ue((await Fe.post(e, o)).data, l);
  } catch (c) {
    throw Ge(c, l);
  }
}
function fe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ge = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), wt = ["onKeydown"], vt = { class: "work-stack work-tight" }, kt = { class: "work-row work-wrap" }, Et = ["id"], xt = /* @__PURE__ */ ue({
  __name: "AddDefinitionRow",
  props: {
    action: {},
    label: {},
    maxlength: {},
    regular: { type: Boolean },
    validate: { type: Function }
  },
  emits: ["open", "add"],
  setup(e, { emit: o }) {
    const l = e, c = o, f = Y(), p = Y(!1), s = Y(""), r = Oe(), n = ee(() => s.value.trim()), t = ee(() => n.value ? l.validate?.(n.value) : void 0);
    async function d() {
      c("open"), p.value = !0, await xe(), f.value?.querySelector("input")?.focus();
    }
    async function u() {
      s.value = "", p.value = !1, await xe(), f.value?.querySelector("button")?.focus();
    }
    function h() {
      !n.value || t.value || (c("add", n.value), u());
    }
    return (i, a) => (P(), W("div", {
      ref_key: "row",
      ref: f,
      class: "work-add-definition"
    }, [
      p.value ? (P(), W("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: Te(Ae(u, ["stop", "prevent"]), ["esc"])
      }, [
        Q("label", vt, [
          oe(q(e.label) + " ", 1),
          te(F(Pe), {
            modelValue: s.value,
            "onUpdate:modelValue": a[0] || (a[0] = (m) => s.value = m),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!t.value,
            "aria-describedby": t.value ? F(r) : void 0,
            onKeydown: Te(Ae(h, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        le(i.$slots, "default"),
        Q("div", kt, [
          te(F(pe), {
            type: "button",
            label: e.action,
            size: e.regular ? void 0 : "small",
            disabled: !n.value || !!t.value,
            onClick: h
          }, null, 8, ["label", "size", "disabled"]),
          te(F(pe), {
            type: "button",
            label: "Cancel",
            text: "",
            severity: "secondary",
            size: e.regular ? void 0 : "small",
            onClick: u
          }, null, 8, ["size"])
        ]),
        t.value ? (P(), W("p", {
          key: 0,
          id: F(r),
          class: "work-error work-small",
          role: "status"
        }, q(t.value), 9, Et)) : X("", !0)
      ], 40, wt)) : (P(), K(F(pe), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: e.regular ? void 0 : "small",
        onClick: d
      }, {
        icon: se(() => [
          te(F(st), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["label", "size"]))
    ], 512));
  }
}), _t = /* @__PURE__ */ ue({
  __name: "Disclosure",
  props: /* @__PURE__ */ et({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const o = Ze(e, "open");
    return (l, c) => (P(), K(F(ot), {
      class: "kx-disclosure",
      value: o.value ? "content" : void 0,
      "onUpdate:value": c[0] || (c[0] = (f) => o.value = f === "content")
    }, {
      default: se(() => [
        te(F(ut), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: se(() => [
            te(F(dt), { class: "kx-disclosure-toggle" }, {
              default: se(() => [
                oe(q(e.label), 1)
              ]),
              _: 1
            }),
            te(F(lt), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: se(() => [
                le(l.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
}), Ot = { class: "work-stack work-tight" }, Nt = {
  key: 0,
  class: "work-small work-muted"
}, jt = {
  key: 1,
  role: "alert",
  class: "work-error"
}, It = { class: "work-json-example" }, Ct = /* @__PURE__ */ ue({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: o }) {
    const l = e, c = o, f = Y(""), p = Y("");
    de(() => l.modelValue, (r) => {
      f.value = r === void 0 ? "" : JSON.stringify(r, null, 2), p.value = "", c("validity", !0);
    }, { immediate: !0 }), Ne(() => c("validity", !0));
    function s(r) {
      f.value = r;
      try {
        const n = r.trim() ? JSON.parse(r) : void 0;
        if (n !== void 0 && l.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && l.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        p.value = "", c("update:modelValue", n), c("validity", !0);
      } catch (n) {
        p.value = n instanceof Error ? n.message : "Invalid JSON.", c("validity", !1);
      }
    }
    return (r, n) => (P(), K(_t, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: se(() => [
        Q("label", Ot, [
          Q("span", null, q(e.label), 1),
          e.hint ? (P(), W("span", Nt, q(e.hint), 1)) : X("", !0),
          te(F(ct), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: f.value,
            "aria-invalid": !!p.value,
            onInput: n[0] || (n[0] = (t) => s(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          p.value ? (P(), W("span", jt, q(p.value), 1)) : X("", !0)
        ]),
        n[1] || (n[1] = Q("p", { class: "work-small work-muted" }, "Example", -1)),
        Q("pre", It, q(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), Ee = /* @__PURE__ */ new Map();
function be(e, o = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((c) => be(c, o)).join(", ");
  if (typeof e == "string") return o.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const l = e;
  for (const c of ["display_name", "displayName", "name", "label"]) if (typeof l[c] == "string" && l[c] && !ge(l[c])) return l[c];
  return o.get(`${l.kind ?? "user"}:${l.id}`) ?? (typeof l.email == "string" && l.email ? l.email : l.kind === "group" ? "Unavailable group" : typeof l.id == "string" ? be(l.id, o) : "Unavailable person");
}
async function Lt(e, o) {
  const l = [...new Map(o.map((r) => [`${r.kind}:${r.id}`, { type: r.kind, id: r.id }])).values()].sort((r, n) => `${r.type}:${r.id}`.localeCompare(`${n.type}:${n.id}`)), c = JSON.stringify([e, l]), f = Ee.get(c);
  if (f) return f;
  const s = (async () => {
    const r = /* @__PURE__ */ new Map();
    for (let n = 0; n < l.length; n += 200) {
      const t = await ae(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: l.slice(n, n + 200) }, "Display names");
      for (const d of t.principals) d.label.trim() && !ge(d.label) && d.label !== d.id && r.set(`${d.type}:${d.id}`, d.label.trim());
    }
    return r;
  })();
  Ee.set(c, s);
  try {
    return await s;
  } finally {
    Ee.delete(c);
  }
}
function Tt(e, o) {
  const l = Y(/* @__PURE__ */ new Map()), c = Y("");
  let f = 0;
  return de([e, o], async ([p, s]) => {
    const r = ++f;
    if (l.value = /* @__PURE__ */ new Map(), c.value = "", !(!p || !s.length))
      try {
        const n = await Lt(p, s);
        r === f && (l.value = n);
      } catch (n) {
        r === f && (c.value = je(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), tt(() => {
    f++, l.value.clear();
  }), {
    labels: l,
    error: c,
    label: (p) => be(p, l.value),
    remember: (p, s) => {
      s.trim() && !ge(s) && s !== p.id && l.value.set(`${p.kind}:${p.id}`, s.trim());
    }
  };
}
function ye(e) {
  if (ge(e)) return "Untitled";
  const o = e.replace(/[_-]+/g, " ");
  return o.charAt(0).toUpperCase() + o.slice(1);
}
function hn(e) {
  return e.title?.trim() || ye(e.code);
}
function Be(e, o, l = be) {
  return e == null ? "—" : o?.type === "principal" ? l(e) : Array.isArray(e) ? e.map((c) => Be(c, o, l)).join(", ") : o?.type === "option" && typeof e == "string" ? o.options?.find((c) => c.id === e)?.label || ye(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (o?.form === "ref" || o?.type === "item") && "unavailable" in e ? "Unavailable" : o?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : o?.form === "ref" && "ref" in e && Array.isArray(e.ref) || o?.form === "ref" && "id" in e && typeof e.id == "string" || o?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function pn(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function mn(e, o) {
  const l = Tt(e, o);
  return {
    display: (c, f) => Be(c, f, l.label),
    principalLabel: l.label,
    rememberPrincipal: l.remember,
    nameError: l.error,
    nameLabels: l.labels
  };
}
function We(e) {
  return Object.entries(fe(e.properties)).map(([o, l]) => {
    const c = fe(l);
    return { key: o, title: typeof c.title == "string" && c.title.trim() ? c.title : ye(o), description: typeof c.description == "string" ? c.description : "", required: Array.isArray(e.required) && e.required.includes(o), schema: c };
  });
}
const _e = (e) => e.type === "array" && fe(e.items).type === "string";
function At(e, o, l = !0) {
  const c = {};
  for (const f of We(e)) {
    const p = o[f.key] ?? (l ? f.schema.default : void 0), s = f.schema;
    let r = "";
    if (p == null)
      f.required && (r = "A value is required.");
    else if (Array.isArray(s.enum) && !s.enum.includes(p)) r = "Choose one of the available values.";
    else if (s.type === "integer" || s.type === "number")
      typeof p != "number" || !Number.isFinite(p) || s.type === "integer" && !Number.isInteger(p) ? r = s.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof s.minimum == "number" && p < s.minimum ? r = `Enter at least ${s.minimum}.` : typeof s.maximum == "number" && p > s.maximum && (r = `Enter at most ${s.maximum}.`);
    else if (s.type === "boolean" && typeof p != "boolean") r = "Choose on or off.";
    else if (s.type === "string") {
      if (typeof p != "string") r = "Enter text.";
      else if (typeof s.minLength == "number" && p.length < s.minLength) r = `Enter at least ${s.minLength} characters.`;
      else if (typeof s.maxLength == "number" && p.length > s.maxLength) r = `Enter at most ${s.maxLength} characters.`;
      else if (typeof s.pattern == "string")
        try {
          new RegExp(s.pattern).test(p) || (r = "Use the required format.");
        } catch {
          r = "The declared format is unavailable.";
        }
    } else if (s.type === "array") {
      if (!Array.isArray(p)) r = "Enter a list.";
      else if (typeof s.maxItems == "number" && p.length > s.maxItems) r = `Use at most ${s.maxItems} entries.`;
      else if (typeof s.minItems == "number" && p.length < s.minItems) r = `Use at least ${s.minItems} entries.`;
      else if (s.uniqueItems && new Set(p).size !== p.length) r = "Remove duplicate entries.";
      else if (_e(s)) {
        const n = fe(s.items);
        p.some((t) => typeof t != "string" || typeof n.minLength == "number" && t.length < n.minLength || typeof n.maxLength == "number" && t.length > n.maxLength) && (r = "Each entry must match the declared text length.");
      }
    } else s.type === "object" && (typeof p != "object" || Array.isArray(p)) && (r = "Enter an object.");
    r && (c[f.key] = r);
  }
  return c;
}
const St = { class: "work-stack" }, Mt = ["inert", "schema", "config"], Rt = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Vt = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, $t = { class: "work-config-fields" }, Dt = {
  key: 0,
  class: "work-config-label"
}, Pt = {
  key: 0,
  class: "work-muted"
}, Ft = ["for"], Ut = {
  key: 0,
  class: "work-muted"
}, Gt = {
  key: 3,
  class: "work-config-chips"
}, Bt = {
  key: 9,
  class: "work-muted work-small"
}, Wt = {
  key: 10,
  class: "work-muted work-small"
}, zt = {
  key: 11,
  role: "alert",
  class: "work-error work-small"
}, bn = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    suggestDefaults: { type: Boolean }
  },
  emits: ["update:modelValue", "validity", "validation-message"],
  setup(e, { emit: o }) {
    const l = e, c = o, f = Y(/* @__PURE__ */ new Set()), p = Y(!1), s = Y(!1), r = Oe(), n = ee(() => We(l.schema)), t = ee(() => At(l.schema, l.modelValue, !l.suggestDefaults)), d = ee(() => n.value.filter((v) => typeof v.schema.picker == "string")), u = ee(() => n.value.filter((v) => typeof v.schema.picker != "string")), h = ee(() => ({ ...l.schema, properties: Object.fromEntries(d.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(l.schema.required) ? l.schema.required.filter((v) => d.value.some((O) => O.key === v)) : [] })), i = ee(() => Object.fromEntries(d.value.map((v) => [v.key, l.modelValue[v.key]]))), a = ee(() => !Object.keys(t.value).length && !f.value.size && (!d.value.length || p.value)), m = ee(() => {
      for (const v of n.value) {
        if (t.value[v.key]) return v.title + ": " + t.value[v.key];
        if (f.value.has(v.key)) return v.title + ": Enter valid JSON.";
      }
      return a.value ? "" : "Open plugin settings to check the configuration widget.";
    });
    de(a, (v) => c("validity", v), { immediate: !0 }), de(m, (v) => c("validation-message", v), { immediate: !0 });
    async function g() {
      s.value = !0, p.value = await ft("wc-schema-form"), s.value = !1;
    }
    de(() => d.value.length > 0, (v) => {
      v && g();
    }, { immediate: !0 }), Ne(() => {
      c("validity", !0), c("validation-message", "");
    });
    function _(v, O) {
      return l.modelValue[v] ?? (l.suggestDefaults ? void 0 : O);
    }
    function I(v, O) {
      const b = { ...l.modelValue };
      O == null ? delete b[v] : b[v] = O, c("update:modelValue", b);
    }
    function w(v) {
      const O = l.modelValue[v];
      return Array.isArray(O) ? O.filter((b) => typeof b == "string") : [];
    }
    function N(v, O) {
      O ? f.value.delete(v) : f.value.add(v);
    }
    function k(v) {
      c("update:modelValue", { ...l.modelValue, ...fe(v.detail) });
    }
    return (v, O) => (P(), W("div", St, [
      d.value.length && p.value ? (P(), W("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(h.value),
        config: JSON.stringify(i.value),
        onConfigChanged: k
      }, null, 40, Mt)) : d.value.length && s.value ? (P(), W("p", Rt, "The configuration widget is loading.")) : d.value.length ? (P(), W("p", Vt, [
        O[0] || (O[0] = oe("The configuration widget is unavailable.", -1)),
        te(F(pe), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: g
        })
      ])) : X("", !0),
      Q("div", $t, [
        (P(!0), W(Se, null, Me(u.value, (b) => (P(), W("div", {
          key: b.key,
          class: "work-config-field"
        }, [
          F(_e)(b.schema) ? (P(), W("span", Dt, [
            oe(q(b.title), 1),
            b.required ? (P(), W("span", Pt, " (required)")) : X("", !0)
          ])) : (P(), W("label", {
            key: 1,
            class: "work-config-label",
            for: F(r) + "-" + b.key
          }, [
            oe(q(b.title), 1),
            b.required ? (P(), W("span", Ut, " (required)")) : X("", !0)
          ], 8, Ft)),
          Array.isArray(b.schema.enum) ? (P(), K(F(Re), {
            key: 2,
            "input-id": F(r) + "-" + b.key,
            "model-value": _(b.key, b.schema.default),
            options: b.schema.enum,
            appendTo: "self",
            "aria-label": b.title,
            "aria-required": b.required || void 0,
            disabled: e.disabled,
            "onUpdate:modelValue": (T) => I(b.key, T)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : F(_e)(b.schema) ? (P(), W("div", Gt, [
            (P(!0), W(Se, null, Me(w(b.key), (T, R) => (P(), K(F(at), {
              key: R,
              label: T,
              removable: !e.disabled,
              onRemove: (y) => I(b.key, w(b.key).filter((E, j) => j !== R))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            e.disabled ? X("", !0) : (P(), K(xt, {
              key: 0,
              action: "Add value",
              label: "Add " + b.title.toLocaleLowerCase(),
              onAdd: (T) => I(b.key, [...w(b.key), T])
            }, null, 8, ["label", "onAdd"]))
          ])) : ["integer", "number"].includes(String(b.schema.type)) ? (P(), K(F(rt), {
            key: 4,
            "input-id": F(r) + "-" + b.key,
            "model-value": _(b.key, b.schema.default),
            "max-fraction-digits": b.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": b.title,
            disabled: e.disabled,
            invalid: !!t.value[b.key],
            pt: { pcInputText: { root: { "aria-required": b.required || void 0 } } },
            "onUpdate:modelValue": (T) => I(b.key, T)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "pt", "onUpdate:modelValue"])) : b.schema.type === "boolean" && e.suggestDefaults ? (P(), K(F(Re), {
            key: 5,
            "input-id": F(r) + "-" + b.key,
            "model-value": e.modelValue[b.key],
            "aria-label": b.title,
            "aria-required": b.required || void 0,
            disabled: e.disabled,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [{ label: "Use deployment setting", value: null }, { label: "On", value: !0 }, { label: "Off", value: !1 }],
            placeholder: "Use deployment setting",
            "onUpdate:modelValue": (T) => I(b.key, T)
          }, null, 8, ["input-id", "model-value", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : b.schema.type === "boolean" ? (P(), K(F(it), {
            key: 6,
            "input-id": F(r) + "-" + b.key,
            "model-value": !!_(b.key, b.schema.default),
            "aria-label": b.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (T) => I(b.key, T)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(b.schema.type)) ? (P(), K(Ct, {
            key: 7,
            label: b.title,
            "model-value": e.modelValue[b.key],
            shape: b.schema.type === "array" ? "array" : "object",
            example: b.schema.default ?? (b.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (T) => I(b.key, T),
            onValidity: (T) => N(b.key, T)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (P(), K(F(Pe), {
            key: 8,
            id: F(r) + "-" + b.key,
            "model-value": _(b.key, b.schema.default) ?? "",
            disabled: e.disabled,
            invalid: !!t.value[b.key],
            "aria-label": b.title,
            "aria-required": b.required || void 0,
            "onUpdate:modelValue": (T) => I(b.key, T)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "aria-required", "onUpdate:modelValue"])),
          b.description ? (P(), W("p", Bt, q(b.description), 1)) : X("", !0),
          e.suggestDefaults && e.modelValue[b.key] === void 0 && b.schema.default !== void 0 ? (P(), W("p", Wt, "Suggested value: " + q(b.schema.default), 1)) : X("", !0),
          t.value[b.key] ? (P(), W("p", zt, q(t.value[b.key]), 1)) : X("", !0)
        ]))), 128))
      ])
    ]));
  }
}), qt = ["aria-label", "aria-busy"], gn = /* @__PURE__ */ ue({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const l = e, c = o, f = Y(null);
    let p = null;
    async function s() {
      await xe();
      const n = f.value;
      if (n)
        if (l.visible && !n.open) {
          const t = n.getRootNode();
          p = l.returnFocus ?? t.activeElement, n.showModal();
        } else !l.visible && n.open && (n.close(), p?.focus());
    }
    function r(n) {
      n.preventDefault(), l.busy || c("close");
    }
    return de(() => l.visible, s), nt(s), Ne(() => {
      f.value?.open && f.value.close(), p?.focus();
    }), (n, t) => (P(), W("dialog", {
      ref_key: "dialog",
      ref: f,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: r,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && c("close");
      })
    }, [
      le(n.$slots, "default")
    ], 40, qt));
  }
}), me = "/api/v1/work", he = (e) => `${me}/boards/${encodeURIComponent(e)}`, ze = {
  boards: async () => {
    const e = [];
    let o;
    do {
      const l = await ke(`${me}/boards${o ? "?after=" + encodeURIComponent(o) : ""}`, "Boards");
      e.push(...l.boards), o = l.next;
    } while (o);
    return e;
  },
  packs: () => ke(`${me}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, o, l, c = {}) => ae(`${me}/boards`, { title: e, declaration: o, idempotency_key: l, ...c }, "Create board"),
  updateBoard: (e, o) => ae(`${he(e)}/update`, o, "Update board"),
  schema: (e, o, l) => ae(`${he(e)}/get_schema`, { generation: o, ...l ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, o) => ae(`${he(e)}/query`, o, "Item choices"),
  async stateCounts(e) {
    const o = /* @__PURE__ */ Object.create(null);
    let l;
    do {
      const c = await ze.query(e, { group_by: "type", sub_group_by: "state", group_after: l, limit: 1 });
      if (c.incomplete || c.reindexing) throw new Error("Counts unavailable");
      for (const f of c.groups ?? []) {
        if (typeof f.value != "string") continue;
        const p = o[f.value] ??= /* @__PURE__ */ Object.create(null);
        for (const s of f.groups ?? []) typeof s.value == "string" && (p[s.value] = s.count);
      }
      l = c.group_after;
    } while (l);
    return o;
  },
  item: (e, o) => ae(`${he(e)}/get`, { item: o }, "Item choice"),
  async options(e) {
    const o = await ke(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
    return {
      ...o,
      guards: Array.isArray(o.guards) ? o.guards : [],
      filters: Array.isArray(o.filters) ? o.filters : [],
      board_apps: Array.isArray(o.board_apps) ? o.board_apps : []
    };
  }
};
/*! @license MIT — @dagrejs/dagre 1.1.8 and @dagrejs/graphlib 2.2.4
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
const yn = (function() {
  return (/* @__PURE__ */ (function() {
    function e(o, l, c) {
      function f(r, n) {
        if (!l[r]) {
          if (!o[r]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(r, !0);
            if (p) return p(r, !0);
            var d = new Error("Cannot find module '" + r + "'");
            throw d.code = "MODULE_NOT_FOUND", d;
          }
          var u = l[r] = { exports: {} };
          o[r][0].call(u.exports, function(h) {
            var i = o[r][1][h];
            return f(i || h);
          }, u, u.exports, e, o, l, c);
        }
        return l[r].exports;
      }
      for (var p = typeof require == "function" && require, s = 0; s < c.length; s++) f(c[s]);
      return f;
    }
    return e;
  })())({ 1: [function(e, o, l) {
    o.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, o, l) {
    let c = e("./greedy-fas"), f = e("./util").uniqueId;
    o.exports = { run: p, undo: r };
    function p(n) {
      (n.graph().acyclicer === "greedy" ? c(n, d(n)) : s(n)).forEach((u) => {
        let h = n.edge(u);
        n.removeEdge(u), h.forwardName = u.name, h.reversed = !0, n.setEdge(u.w, u.v, h, f("rev"));
      });
      function d(u) {
        return (h) => u.edge(h).weight;
      }
    }
    function s(n) {
      let t = [], d = {}, u = {};
      function h(i) {
        Object.hasOwn(u, i) || (u[i] = !0, d[i] = !0, n.outEdges(i).forEach((a) => {
          Object.hasOwn(d, a.w) ? t.push(a) : h(a.w);
        }), delete d[i]);
      }
      return n.nodes().forEach(h), t;
    }
    function r(n) {
      n.edges().forEach((t) => {
        let d = n.edge(t);
        if (d.reversed) {
          n.removeEdge(t);
          let u = d.forwardName;
          delete d.reversed, delete d.forwardName, n.setEdge(t.w, t.v, d, u);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, o, l) {
    let c = e("./util");
    o.exports = f;
    function f(s) {
      function r(n) {
        let t = s.children(n), d = s.node(n);
        if (t.length && t.forEach(r), Object.hasOwn(d, "minRank")) {
          d.borderLeft = [], d.borderRight = [];
          for (let u = d.minRank, h = d.maxRank + 1; u < h; ++u)
            p(s, "borderLeft", "_bl", n, d, u), p(s, "borderRight", "_br", n, d, u);
        }
      }
      s.children().forEach(r);
    }
    function p(s, r, n, t, d, u) {
      let h = { width: 0, height: 0, rank: u, borderType: r }, i = d[r][u - 1], a = c.addDummyNode(s, "border", h, n);
      d[r][u] = a, s.setParent(a, t), i && s.setEdge(i, a, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, o, l) {
    o.exports = { adjust: c, undo: f };
    function c(u) {
      let h = u.graph().rankdir.toLowerCase();
      (h === "lr" || h === "rl") && p(u);
    }
    function f(u) {
      let h = u.graph().rankdir.toLowerCase();
      (h === "bt" || h === "rl") && r(u), (h === "lr" || h === "rl") && (t(u), p(u));
    }
    function p(u) {
      u.nodes().forEach((h) => s(u.node(h))), u.edges().forEach((h) => s(u.edge(h)));
    }
    function s(u) {
      let h = u.width;
      u.width = u.height, u.height = h;
    }
    function r(u) {
      u.nodes().forEach((h) => n(u.node(h))), u.edges().forEach((h) => {
        let i = u.edge(h);
        i.points.forEach(n), Object.hasOwn(i, "y") && n(i);
      });
    }
    function n(u) {
      u.y = -u.y;
    }
    function t(u) {
      u.nodes().forEach((h) => d(u.node(h))), u.edges().forEach((h) => {
        let i = u.edge(h);
        i.points.forEach(d), Object.hasOwn(i, "x") && d(i);
      });
    }
    function d(u) {
      let h = u.x;
      u.x = u.y, u.y = h;
    }
  }, {}], 5: [function(e, o, l) {
    class c {
      constructor() {
        let r = {};
        r._next = r._prev = r, this._sentinel = r;
      }
      dequeue() {
        let r = this._sentinel, n = r._prev;
        if (n !== r)
          return f(n), n;
      }
      enqueue(r) {
        let n = this._sentinel;
        r._prev && r._next && f(r), r._next = n._next, n._next._prev = r, n._next = r, r._prev = n;
      }
      toString() {
        let r = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          r.push(JSON.stringify(t, p)), t = t._prev;
        return "[" + r.join(", ") + "]";
      }
    }
    function f(s) {
      s._prev._next = s._next, s._next._prev = s._prev, delete s._next, delete s._prev;
    }
    function p(s, r) {
      if (s !== "_next" && s !== "_prev")
        return r;
    }
    o.exports = c;
  }, {}], 6: [function(e, o, l) {
    let c = e("./util"), f = e("@dagrejs/graphlib").Graph;
    o.exports = { debugOrdering: p };
    function p(s) {
      let r = c.buildLayerMatrix(s), n = new f({ compound: !0, multigraph: !0 }).setGraph({});
      return s.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + s.node(t).rank);
      }), s.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), r.forEach((t, d) => {
        let u = "layer" + d;
        n.setNode(u, { rank: "same" }), t.reduce((h, i) => (n.setEdge(h, i, { style: "invis" }), i));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, o, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("./data/list");
    o.exports = s;
    let p = () => 1;
    function s(h, i) {
      if (h.nodeCount() <= 1)
        return [];
      let a = t(h, i || p);
      return r(a.graph, a.buckets, a.zeroIdx).flatMap((g) => h.outEdges(g.v, g.w));
    }
    function r(h, i, a) {
      let m = [], g = i[i.length - 1], _ = i[0], I;
      for (; h.nodeCount(); ) {
        for (; I = _.dequeue(); )
          n(h, i, a, I);
        for (; I = g.dequeue(); )
          n(h, i, a, I);
        if (h.nodeCount()) {
          for (let w = i.length - 2; w > 0; --w)
            if (I = i[w].dequeue(), I) {
              m = m.concat(n(h, i, a, I, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(h, i, a, m, g) {
      let _ = g ? [] : void 0;
      return h.inEdges(m.v).forEach((I) => {
        let w = h.edge(I), N = h.node(I.v);
        g && _.push({ v: I.v, w: I.w }), N.out -= w, d(i, a, N);
      }), h.outEdges(m.v).forEach((I) => {
        let w = h.edge(I), N = I.w, k = h.node(N);
        k.in -= w, d(i, a, k);
      }), h.removeNode(m.v), _;
    }
    function t(h, i) {
      let a = new c(), m = 0, g = 0;
      h.nodes().forEach((w) => {
        a.setNode(w, { v: w, in: 0, out: 0 });
      }), h.edges().forEach((w) => {
        let N = a.edge(w.v, w.w) || 0, k = i(w), v = N + k;
        a.setEdge(w.v, w.w, v), g = Math.max(g, a.node(w.v).out += k), m = Math.max(m, a.node(w.w).in += k);
      });
      let _ = u(g + m + 3).map(() => new f()), I = m + 1;
      return a.nodes().forEach((w) => {
        d(_, I, a.node(w));
      }), { graph: a, buckets: _, zeroIdx: I };
    }
    function d(h, i, a) {
      a.out ? a.in ? h[a.out - a.in + i].enqueue(a) : h[h.length - 1].enqueue(a) : h[0].enqueue(a);
    }
    function u(h) {
      const i = [];
      for (let a = 0; a < h; a++)
        i.push(a);
      return i;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, o, l) {
    let c = e("./acyclic"), f = e("./normalize"), p = e("./rank"), s = e("./util").normalizeRanks, r = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), d = e("./add-border-segments"), u = e("./coordinate-system"), h = e("./order"), i = e("./position"), a = e("./util"), m = e("@dagrejs/graphlib").Graph;
    o.exports = g;
    function g(x, C) {
      let A = C && C.debugTiming ? a.time : a.notime;
      A("layout", () => {
        let M = A("  buildLayoutGraph", () => y(x));
        A("  runLayout", () => _(M, A, C)), A("  updateInputGraph", () => I(x, M));
      });
    }
    function _(x, C, A) {
      C("    makeSpaceForEdgeLabels", () => E(x)), C("    removeSelfEdges", () => He(x)), C("    acyclic", () => c.run(x)), C("    nestingGraph.run", () => t.run(x)), C("    rank", () => p(a.asNonCompoundGraph(x))), C("    injectEdgeLabelProxies", () => j(x)), C("    removeEmptyRanks", () => n(x)), C("    nestingGraph.cleanup", () => t.cleanup(x)), C("    normalizeRanks", () => s(x)), C("    assignRankMinMax", () => L(x)), C("    removeEdgeLabelProxies", () => S(x)), C("    normalize.run", () => f.run(x)), C("    parentDummyChains", () => r(x)), C("    addBorderSegments", () => d(x)), C("    order", () => h(x, A)), C("    insertSelfEdges", () => Ke(x)), C("    adjustCoordinateSystem", () => u.adjust(x)), C("    position", () => i(x)), C("    positionSelfEdges", () => Xe(x)), C("    removeBorderNodes", () => ne(x)), C("    normalize.undo", () => f.undo(x)), C("    fixupEdgeLabelCoords", () => G(x)), C("    undoCoordinateSystem", () => u.undo(x)), C("    translateGraph", () => V(x)), C("    assignNodeIntersects", () => $(x)), C("    reversePoints", () => Z(x)), C("    acyclic.undo", () => c.undo(x));
    }
    function I(x, C) {
      x.nodes().forEach((A) => {
        let M = x.node(A), D = C.node(A);
        M && (M.x = D.x, M.y = D.y, M.rank = D.rank, C.children(A).length && (M.width = D.width, M.height = D.height));
      }), x.edges().forEach((A) => {
        let M = x.edge(A), D = C.edge(A);
        M.points = D.points, Object.hasOwn(D, "x") && (M.x = D.x, M.y = D.y);
      }), x.graph().width = C.graph().width, x.graph().height = C.graph().height;
    }
    let w = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], v = ["width", "height", "rank"], O = { width: 0, height: 0 }, b = ["minlen", "weight", "width", "height", "labeloffset"], T = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, R = ["labelpos"];
    function y(x) {
      let C = new m({ multigraph: !0, compound: !0 }), A = ve(x.graph());
      return C.setGraph(Object.assign({}, N, we(A, w), a.pick(A, k))), x.nodes().forEach((M) => {
        let D = ve(x.node(M));
        const U = we(D, v);
        Object.keys(O).forEach((B) => {
          U[B] === void 0 && (U[B] = O[B]);
        }), C.setNode(M, U), C.setParent(M, x.parent(M));
      }), x.edges().forEach((M) => {
        let D = ve(x.edge(M));
        C.setEdge(M, Object.assign({}, T, we(D, b), a.pick(D, R)));
      }), C;
    }
    function E(x) {
      let C = x.graph();
      C.ranksep /= 2, x.edges().forEach((A) => {
        let M = x.edge(A);
        M.minlen *= 2, M.labelpos.toLowerCase() !== "c" && (C.rankdir === "TB" || C.rankdir === "BT" ? M.width += M.labeloffset : M.height += M.labeloffset);
      });
    }
    function j(x) {
      x.edges().forEach((C) => {
        let A = x.edge(C);
        if (A.width && A.height) {
          let M = x.node(C.v), U = { rank: (x.node(C.w).rank - M.rank) / 2 + M.rank, e: C };
          a.addDummyNode(x, "edge-proxy", U, "_ep");
        }
      });
    }
    function L(x) {
      let C = 0;
      x.nodes().forEach((A) => {
        let M = x.node(A);
        M.borderTop && (M.minRank = x.node(M.borderTop).rank, M.maxRank = x.node(M.borderBottom).rank, C = Math.max(C, M.maxRank));
      }), x.graph().maxRank = C;
    }
    function S(x) {
      x.nodes().forEach((C) => {
        let A = x.node(C);
        A.dummy === "edge-proxy" && (x.edge(A.e).labelRank = A.rank, x.removeNode(C));
      });
    }
    function V(x) {
      let C = Number.POSITIVE_INFINITY, A = 0, M = Number.POSITIVE_INFINITY, D = 0, U = x.graph(), B = U.marginx || 0, J = U.marginy || 0;
      function Ie(H) {
        let z = H.x, ce = H.y, Ce = H.width, Le = H.height;
        C = Math.min(C, z - Ce / 2), A = Math.max(A, z + Ce / 2), M = Math.min(M, ce - Le / 2), D = Math.max(D, ce + Le / 2);
      }
      x.nodes().forEach((H) => Ie(x.node(H))), x.edges().forEach((H) => {
        let z = x.edge(H);
        Object.hasOwn(z, "x") && Ie(z);
      }), C -= B, M -= J, x.nodes().forEach((H) => {
        let z = x.node(H);
        z.x -= C, z.y -= M;
      }), x.edges().forEach((H) => {
        let z = x.edge(H);
        z.points.forEach((ce) => {
          ce.x -= C, ce.y -= M;
        }), Object.hasOwn(z, "x") && (z.x -= C), Object.hasOwn(z, "y") && (z.y -= M);
      }), U.width = A - C + B, U.height = D - M + J;
    }
    function $(x) {
      x.edges().forEach((C) => {
        let A = x.edge(C), M = x.node(C.v), D = x.node(C.w), U, B;
        A.points ? (U = A.points[0], B = A.points[A.points.length - 1]) : (A.points = [], U = D, B = M), A.points.unshift(a.intersectRect(M, U)), A.points.push(a.intersectRect(D, B));
      });
    }
    function G(x) {
      x.edges().forEach((C) => {
        let A = x.edge(C);
        if (Object.hasOwn(A, "x"))
          switch ((A.labelpos === "l" || A.labelpos === "r") && (A.width -= A.labeloffset), A.labelpos) {
            case "l":
              A.x -= A.width / 2 + A.labeloffset;
              break;
            case "r":
              A.x += A.width / 2 + A.labeloffset;
              break;
          }
      });
    }
    function Z(x) {
      x.edges().forEach((C) => {
        let A = x.edge(C);
        A.reversed && A.points.reverse();
      });
    }
    function ne(x) {
      x.nodes().forEach((C) => {
        if (x.children(C).length) {
          let A = x.node(C), M = x.node(A.borderTop), D = x.node(A.borderBottom), U = x.node(A.borderLeft[A.borderLeft.length - 1]), B = x.node(A.borderRight[A.borderRight.length - 1]);
          A.width = Math.abs(B.x - U.x), A.height = Math.abs(D.y - M.y), A.x = U.x + A.width / 2, A.y = M.y + A.height / 2;
        }
      }), x.nodes().forEach((C) => {
        x.node(C).dummy === "border" && x.removeNode(C);
      });
    }
    function He(x) {
      x.edges().forEach((C) => {
        if (C.v === C.w) {
          var A = x.node(C.v);
          A.selfEdges || (A.selfEdges = []), A.selfEdges.push({ e: C, label: x.edge(C) }), x.removeEdge(C);
        }
      });
    }
    function Ke(x) {
      var C = a.buildLayerMatrix(x);
      C.forEach((A) => {
        var M = 0;
        A.forEach((D, U) => {
          var B = x.node(D);
          B.order = U + M, (B.selfEdges || []).forEach((J) => {
            a.addDummyNode(x, "selfedge", { width: J.label.width, height: J.label.height, rank: B.rank, order: U + ++M, e: J.e, label: J.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function Xe(x) {
      x.nodes().forEach((C) => {
        var A = x.node(C);
        if (A.dummy === "selfedge") {
          var M = x.node(A.e.v), D = M.x + M.width / 2, U = M.y, B = A.x - D, J = M.height / 2;
          x.setEdge(A.e, A.label), x.removeNode(C), A.label.points = [{ x: D + 2 * B / 3, y: U - J }, { x: D + 5 * B / 6, y: U - J }, { x: D + B, y: U }, { x: D + 5 * B / 6, y: U + J }, { x: D + 2 * B / 3, y: U + J }], A.label.x = A.x, A.label.y = A.y;
        }
      });
    }
    function we(x, C) {
      return a.mapValues(a.pick(x, C), Number);
    }
    function ve(x) {
      var C = {};
      return x && Object.entries(x).forEach(([A, M]) => {
        typeof A == "string" && (A = A.toLowerCase()), C[A] = M;
      }), C;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, o, l) {
    let c = e("./util");
    o.exports = { run: f, cleanup: n };
    function f(t) {
      let d = c.addDummyNode(t, "root", {}, "_root"), u = s(t), h = Object.values(u), i = c.applyWithChunking(Math.max, h) - 1, a = 2 * i + 1;
      t.graph().nestingRoot = d, t.edges().forEach((g) => t.edge(g).minlen *= a);
      let m = r(t) + 1;
      t.children().forEach((g) => p(t, d, a, m, i, u, g)), t.graph().nodeRankFactor = a;
    }
    function p(t, d, u, h, i, a, m) {
      let g = t.children(m);
      if (!g.length) {
        m !== d && t.setEdge(d, m, { weight: 0, minlen: u });
        return;
      }
      let _ = c.addBorderNode(t, "_bt"), I = c.addBorderNode(t, "_bb"), w = t.node(m);
      t.setParent(_, m), w.borderTop = _, t.setParent(I, m), w.borderBottom = I, g.forEach((N) => {
        p(t, d, u, h, i, a, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, b = k.borderTop ? h : 2 * h, T = v !== O ? 1 : i - a[m] + 1;
        t.setEdge(_, v, { weight: b, minlen: T, nestingEdge: !0 }), t.setEdge(O, I, { weight: b, minlen: T, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(d, _, { weight: 0, minlen: i + a[m] });
    }
    function s(t) {
      var d = {};
      function u(h, i) {
        var a = t.children(h);
        a && a.length && a.forEach((m) => u(m, i + 1)), d[h] = i;
      }
      return t.children().forEach((h) => u(h, 1)), d;
    }
    function r(t) {
      return t.edges().reduce((d, u) => d + t.edge(u).weight, 0);
    }
    function n(t) {
      var d = t.graph();
      t.removeNode(d.nestingRoot), delete d.nestingRoot, t.edges().forEach((u) => {
        var h = t.edge(u);
        h.nestingEdge && t.removeEdge(u);
      });
    }
  }, { "./util": 27 }], 10: [function(e, o, l) {
    let c = e("./util");
    o.exports = { run: f, undo: s };
    function f(r) {
      r.graph().dummyChains = [], r.edges().forEach((n) => p(r, n));
    }
    function p(r, n) {
      let t = n.v, d = r.node(t).rank, u = n.w, h = r.node(u).rank, i = n.name, a = r.edge(n), m = a.labelRank;
      if (h === d + 1) return;
      r.removeEdge(n);
      let g, _, I;
      for (I = 0, ++d; d < h; ++I, ++d)
        a.points = [], _ = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: d }, g = c.addDummyNode(r, "edge", _, "_d"), d === m && (_.width = a.width, _.height = a.height, _.dummy = "edge-label", _.labelpos = a.labelpos), r.setEdge(t, g, { weight: a.weight }, i), I === 0 && r.graph().dummyChains.push(g), t = g;
      r.setEdge(t, u, { weight: a.weight }, i);
    }
    function s(r) {
      r.graph().dummyChains.forEach((n) => {
        let t = r.node(n), d = t.edgeLabel, u;
        for (r.setEdge(t.edgeObj, d); t.dummy; )
          u = r.successors(n)[0], r.removeNode(n), d.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (d.x = t.x, d.y = t.y, d.width = t.width, d.height = t.height), n = u, t = r.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, o, l) {
    o.exports = c;
    function c(f, p, s) {
      let r = {}, n;
      s.forEach((t) => {
        let d = f.parent(t), u, h;
        for (; d; ) {
          if (u = f.parent(d), u ? (h = r[u], r[u] = d) : (h = n, n = d), h && h !== d) {
            p.setEdge(h, d);
            return;
          }
          d = u;
        }
      });
    }
  }, {}], 12: [function(e, o, l) {
    o.exports = c;
    function c(f, p = []) {
      return p.map((s) => {
        let r = f.inEdges(s);
        if (r.length) {
          let n = r.reduce((t, d) => {
            let u = f.edge(d), h = f.node(d.v);
            return { sum: t.sum + u.weight * h.order, weight: t.weight + u.weight };
          }, { sum: 0, weight: 0 });
          return { v: s, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: s };
      });
    }
  }, {}], 13: [function(e, o, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("../util");
    o.exports = p;
    function p(r, n, t, d) {
      d || (d = r.nodes());
      let u = s(r), h = new c({ compound: !0 }).setGraph({ root: u }).setDefaultNodeLabel((i) => r.node(i));
      return d.forEach((i) => {
        let a = r.node(i), m = r.parent(i);
        (a.rank === n || a.minRank <= n && n <= a.maxRank) && (h.setNode(i), h.setParent(i, m || u), r[t](i).forEach((g) => {
          let _ = g.v === i ? g.w : g.v, I = h.edge(_, i), w = I !== void 0 ? I.weight : 0;
          h.setEdge(_, i, { weight: r.edge(g).weight + w });
        }), Object.hasOwn(a, "minRank") && h.setNode(i, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
      }), h;
    }
    function s(r) {
      for (var n; r.hasNode(n = f.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, o, l) {
    let c = e("../util").zipObject;
    o.exports = f;
    function f(s, r) {
      let n = 0;
      for (let t = 1; t < r.length; ++t)
        n += p(s, r[t - 1], r[t]);
      return n;
    }
    function p(s, r, n) {
      let t = c(n, n.map((m, g) => g)), d = r.flatMap((m) => s.outEdges(m).map((g) => ({ pos: t[g.w], weight: s.edge(g).weight })).sort((g, _) => g.pos - _.pos)), u = 1;
      for (; u < n.length; ) u <<= 1;
      let h = 2 * u - 1;
      u -= 1;
      let i = new Array(h).fill(0), a = 0;
      return d.forEach((m) => {
        let g = m.pos + u;
        i[g] += m.weight;
        let _ = 0;
        for (; g > 0; )
          g % 2 && (_ += i[g + 1]), g = g - 1 >> 1, i[g] += m.weight;
        a += m.weight * _;
      }), a;
    }
  }, { "../util": 27 }], 15: [function(e, o, l) {
    let c = e("./init-order"), f = e("./cross-count"), p = e("./sort-subgraph"), s = e("./build-layer-graph"), r = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    o.exports = d;
    function d(a, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(a, d);
        return;
      }
      let g = t.maxRank(a), _ = u(a, t.range(1, g + 1), "inEdges"), I = u(a, t.range(g - 1, -1, -1), "outEdges"), w = c(a);
      if (i(a, w), m && m.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let v = 0, O = 0; O < 4; ++v, ++O) {
        h(v % 2 ? _ : I, v % 4 >= 2), w = t.buildLayerMatrix(a);
        let b = f(a, w);
        b < N && (O = 0, k = Object.assign({}, w), N = b);
      }
      i(a, k);
    }
    function u(a, m, g) {
      const _ = /* @__PURE__ */ new Map(), I = (w, N) => {
        _.has(w) || _.set(w, []), _.get(w).push(N);
      };
      for (const w of a.nodes()) {
        const N = a.node(w);
        if (typeof N.rank == "number" && I(N.rank, w), typeof N.minRank == "number" && typeof N.maxRank == "number")
          for (let k = N.minRank; k <= N.maxRank; k++)
            k !== N.rank && I(k, w);
      }
      return m.map(function(w) {
        return s(a, w, g, _.get(w) || []);
      });
    }
    function h(a, m) {
      let g = new n();
      a.forEach(function(_) {
        let I = _.graph().root, w = p(_, I, g, m);
        w.vs.forEach((N, k) => _.node(N).order = k), r(_, g, w.vs);
      });
    }
    function i(a, m) {
      Object.values(m).forEach((g) => g.forEach((_, I) => a.node(_).order = I));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, o, l) {
    let c = e("../util");
    o.exports = f;
    function f(p) {
      let s = {}, r = p.nodes().filter((i) => !p.children(i).length), n = r.map((i) => p.node(i).rank), t = c.applyWithChunking(Math.max, n), d = c.range(t + 1).map(() => []);
      function u(i) {
        if (s[i]) return;
        s[i] = !0;
        let a = p.node(i);
        d[a.rank].push(i), p.successors(i).forEach(u);
      }
      return r.sort((i, a) => p.node(i).rank - p.node(a).rank).forEach(u), d;
    }
  }, { "../util": 27 }], 17: [function(e, o, l) {
    let c = e("../util");
    o.exports = f;
    function f(r, n) {
      let t = {};
      r.forEach((u, h) => {
        let i = t[u.v] = { indegree: 0, in: [], out: [], vs: [u.v], i: h };
        u.barycenter !== void 0 && (i.barycenter = u.barycenter, i.weight = u.weight);
      }), n.edges().forEach((u) => {
        let h = t[u.v], i = t[u.w];
        h !== void 0 && i !== void 0 && (i.indegree++, h.out.push(t[u.w]));
      });
      let d = Object.values(t).filter((u) => !u.indegree);
      return p(d);
    }
    function p(r) {
      let n = [];
      function t(u) {
        return (h) => {
          h.merged || (h.barycenter === void 0 || u.barycenter === void 0 || h.barycenter >= u.barycenter) && s(u, h);
        };
      }
      function d(u) {
        return (h) => {
          h.in.push(u), --h.indegree === 0 && r.push(h);
        };
      }
      for (; r.length; ) {
        let u = r.pop();
        n.push(u), u.in.reverse().forEach(t(u)), u.out.forEach(d(u));
      }
      return n.filter((u) => !u.merged).map((u) => c.pick(u, ["vs", "i", "barycenter", "weight"]));
    }
    function s(r, n) {
      let t = 0, d = 0;
      r.weight && (t += r.barycenter * r.weight, d += r.weight), n.weight && (t += n.barycenter * n.weight, d += n.weight), r.vs = n.vs.concat(r.vs), r.barycenter = t / d, r.weight = d, r.i = Math.min(n.i, r.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, o, l) {
    let c = e("./barycenter"), f = e("./resolve-conflicts"), p = e("./sort");
    o.exports = s;
    function s(t, d, u, h) {
      let i = t.children(d), a = t.node(d), m = a ? a.borderLeft : void 0, g = a ? a.borderRight : void 0, _ = {};
      m && (i = i.filter((k) => k !== m && k !== g));
      let I = c(t, i);
      I.forEach((k) => {
        if (t.children(k.v).length) {
          let v = s(t, k.v, u, h);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let w = f(I, u);
      r(w, _);
      let N = p(w, h);
      if (m && (N.vs = [m, N.vs, g].flat(!0), t.predecessors(m).length)) {
        let k = t.node(t.predecessors(m)[0]), v = t.node(t.predecessors(g)[0]);
        Object.hasOwn(N, "barycenter") || (N.barycenter = 0, N.weight = 0), N.barycenter = (N.barycenter * N.weight + k.order + v.order) / (N.weight + 2), N.weight += 2;
      }
      return N;
    }
    function r(t, d) {
      t.forEach((u) => {
        u.vs = u.vs.flatMap((h) => d[h] ? d[h].vs : h);
      });
    }
    function n(t, d) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + d.barycenter * d.weight) / (t.weight + d.weight), t.weight += d.weight) : (t.barycenter = d.barycenter, t.weight = d.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, o, l) {
    let c = e("../util");
    o.exports = f;
    function f(r, n) {
      let t = c.partition(r, (_) => Object.hasOwn(_, "barycenter")), d = t.lhs, u = t.rhs.sort((_, I) => I.i - _.i), h = [], i = 0, a = 0, m = 0;
      d.sort(s(!!n)), m = p(h, u, m), d.forEach((_) => {
        m += _.vs.length, h.push(_.vs), i += _.barycenter * _.weight, a += _.weight, m = p(h, u, m);
      });
      let g = { vs: h.flat(!0) };
      return a && (g.barycenter = i / a, g.weight = a), g;
    }
    function p(r, n, t) {
      let d;
      for (; n.length && (d = n[n.length - 1]).i <= t; )
        n.pop(), r.push(d.vs), t++;
      return t;
    }
    function s(r) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : r ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, o, l) {
    o.exports = c;
    function c(s) {
      let r = p(s);
      s.graph().dummyChains.forEach((n) => {
        let t = s.node(n), d = t.edgeObj, u = f(s, r, d.v, d.w), h = u.path, i = u.lca, a = 0, m = h[a], g = !0;
        for (; n !== d.w; ) {
          if (t = s.node(n), g) {
            for (; (m = h[a]) !== i && s.node(m).maxRank < t.rank; )
              a++;
            m === i && (g = !1);
          }
          if (!g) {
            for (; a < h.length - 1 && s.node(m = h[a + 1]).minRank <= t.rank; )
              a++;
            m = h[a];
          }
          s.setParent(n, m), n = s.successors(n)[0];
        }
      });
    }
    function f(s, r, n, t) {
      let d = [], u = [], h = Math.min(r[n].low, r[t].low), i = Math.max(r[n].lim, r[t].lim), a, m;
      a = n;
      do
        a = s.parent(a), d.push(a);
      while (a && (r[a].low > h || i > r[a].lim));
      for (m = a, a = t; (a = s.parent(a)) !== m; )
        u.push(a);
      return { path: d.concat(u.reverse()), lca: m };
    }
    function p(s) {
      let r = {}, n = 0;
      function t(d) {
        let u = n;
        s.children(d).forEach(t), r[d] = { low: u, lim: n++ };
      }
      return s.children().forEach(t), r;
    }
  }, {}], 21: [function(e, o, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("../util");
    o.exports = { positionX: g, findType1Conflicts: p, findType2Conflicts: s, addConflict: n, hasConflict: t, verticalAlignment: d, horizontalCompaction: u, alignCoordinates: a, findSmallestWidthAlignment: i, balance: m };
    function p(w, N) {
      let k = {};
      function v(O, b) {
        let T = 0, R = 0, y = O.length, E = b[b.length - 1];
        return b.forEach((j, L) => {
          let S = r(w, j), V = S ? w.node(S).order : y;
          (S || j === E) && (b.slice(R, L + 1).forEach(($) => {
            w.predecessors($).forEach((G) => {
              let Z = w.node(G), ne = Z.order;
              (ne < T || V < ne) && !(Z.dummy && w.node($).dummy) && n(k, G, $);
            });
          }), R = L + 1, T = V);
        }), b;
      }
      return N.length && N.reduce(v), k;
    }
    function s(w, N) {
      let k = {};
      function v(b, T, R, y, E) {
        let j;
        f.range(T, R).forEach((L) => {
          j = b[L], w.node(j).dummy && w.predecessors(j).forEach((S) => {
            let V = w.node(S);
            V.dummy && (V.order < y || V.order > E) && n(k, S, j);
          });
        });
      }
      function O(b, T) {
        let R = -1, y, E = 0;
        return T.forEach((j, L) => {
          if (w.node(j).dummy === "border") {
            let S = w.predecessors(j);
            S.length && (y = w.node(S[0]).order, v(T, E, L, R, y), E = L, R = y);
          }
          v(T, E, T.length, y, b.length);
        }), T;
      }
      return N.length && N.reduce(O), k;
    }
    function r(w, N) {
      if (w.node(N).dummy)
        return w.predecessors(N).find((k) => w.node(k).dummy);
    }
    function n(w, N, k) {
      if (N > k) {
        let O = N;
        N = k, k = O;
      }
      let v = w[N];
      v || (w[N] = v = {}), v[k] = !0;
    }
    function t(w, N, k) {
      if (N > k) {
        let v = N;
        N = k, k = v;
      }
      return !!w[N] && Object.hasOwn(w[N], k);
    }
    function d(w, N, k, v) {
      let O = {}, b = {}, T = {};
      return N.forEach((R) => {
        R.forEach((y, E) => {
          O[y] = y, b[y] = y, T[y] = E;
        });
      }), N.forEach((R) => {
        let y = -1;
        R.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((S, V) => T[S] - T[V]);
            let L = (j.length - 1) / 2;
            for (let S = Math.floor(L), V = Math.ceil(L); S <= V; ++S) {
              let $ = j[S];
              b[E] === E && y < T[$] && !t(k, E, $) && (b[$] = E, b[E] = O[E] = O[$], y = T[$]);
            }
          }
        });
      }), { root: O, align: b };
    }
    function u(w, N, k, v, O) {
      let b = {}, T = h(w, N, k, O), R = O ? "borderLeft" : "borderRight";
      function y(L, S) {
        let V = T.nodes(), $ = V.pop(), G = {};
        for (; $; )
          G[$] ? L($) : (G[$] = !0, V.push($), V = V.concat(S($))), $ = V.pop();
      }
      function E(L) {
        b[L] = T.inEdges(L).reduce((S, V) => Math.max(S, b[V.v] + T.edge(V)), 0);
      }
      function j(L) {
        let S = T.outEdges(L).reduce(($, G) => Math.min($, b[G.w] - T.edge(G)), Number.POSITIVE_INFINITY), V = w.node(L);
        S !== Number.POSITIVE_INFINITY && V.borderType !== R && (b[L] = Math.max(b[L], S));
      }
      return y(E, T.predecessors.bind(T)), y(j, T.successors.bind(T)), Object.keys(v).forEach((L) => b[L] = b[k[L]]), b;
    }
    function h(w, N, k, v) {
      let O = new c(), b = w.graph(), T = _(b.nodesep, b.edgesep, v);
      return N.forEach((R) => {
        let y;
        R.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), y) {
            var L = k[y], S = O.edge(L, j);
            O.setEdge(L, j, Math.max(T(w, E, y), S || 0));
          }
          y = E;
        });
      }), O;
    }
    function i(w, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, b = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([R, y]) => {
          let E = I(w, R) / 2;
          O = Math.max(y + E, O), b = Math.min(y - E, b);
        });
        const T = O - b;
        return T < k[0] && (k = [T, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function a(w, N) {
      let k = Object.values(N), v = f.applyWithChunking(Math.min, k), O = f.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((b) => {
        ["l", "r"].forEach((T) => {
          let R = b + T, y = w[R];
          if (y === N) return;
          let E = Object.values(y), j = v - f.applyWithChunking(Math.min, E);
          T !== "l" && (j = O - f.applyWithChunking(Math.max, E)), j && (w[R] = f.mapValues(y, (L) => L + j));
        });
      });
    }
    function m(w, N) {
      return f.mapValues(w.ul, (k, v) => {
        if (N)
          return w[N.toLowerCase()][v];
        {
          let O = Object.values(w).map((b) => b[v]).sort((b, T) => b - T);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function g(w) {
      let N = f.buildLayerMatrix(w), k = Object.assign(p(w, N), s(w, N)), v = {}, O;
      ["u", "d"].forEach((T) => {
        O = T === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((R) => {
          R === "r" && (O = O.map((L) => Object.values(L).reverse()));
          let y = (T === "u" ? w.predecessors : w.successors).bind(w), E = d(w, O, k, y), j = u(w, O, E.root, E.align, R === "r");
          R === "r" && (j = f.mapValues(j, (L) => -L)), v[T + R] = j;
        });
      });
      let b = i(w, v);
      return a(v, b), m(v, w.graph().align);
    }
    function _(w, N, k) {
      return (v, O, b) => {
        let T = v.node(O), R = v.node(b), y = 0, E;
        if (y += T.width / 2, Object.hasOwn(T, "labelpos"))
          switch (T.labelpos.toLowerCase()) {
            case "l":
              E = -T.width / 2;
              break;
            case "r":
              E = T.width / 2;
              break;
          }
        if (E && (y += k ? E : -E), E = 0, y += (T.dummy ? N : w) / 2, y += (R.dummy ? N : w) / 2, y += R.width / 2, Object.hasOwn(R, "labelpos"))
          switch (R.labelpos.toLowerCase()) {
            case "l":
              E = R.width / 2;
              break;
            case "r":
              E = -R.width / 2;
              break;
          }
        return E && (y += k ? E : -E), E = 0, y;
      };
    }
    function I(w, N) {
      return w.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, o, l) {
    let c = e("../util"), f = e("./bk").positionX;
    o.exports = p;
    function p(r) {
      r = c.asNonCompoundGraph(r), s(r), Object.entries(f(r)).forEach(([n, t]) => r.node(n).x = t);
    }
    function s(r) {
      let n = c.buildLayerMatrix(r), t = r.graph().ranksep, d = 0;
      n.forEach((u) => {
        const h = u.reduce((i, a) => {
          const m = r.node(a).height;
          return i > m ? i : m;
        }, 0);
        u.forEach((i) => r.node(i).y = d + h / 2), d += h + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, o, l) {
    var c = e("@dagrejs/graphlib").Graph, f = e("./util").slack;
    o.exports = p;
    function p(t) {
      var d = new c({ directed: !1 }), u = t.nodes()[0], h = t.nodeCount();
      d.setNode(u, {});
      for (var i, a; s(d, t) < h; )
        i = r(d, t), a = d.hasNode(i.v) ? f(t, i) : -f(t, i), n(d, t, a);
      return d;
    }
    function s(t, d) {
      function u(h) {
        d.nodeEdges(h).forEach((i) => {
          var a = i.v, m = h === a ? i.w : a;
          !t.hasNode(m) && !f(d, i) && (t.setNode(m, {}), t.setEdge(h, m, {}), u(m));
        });
      }
      return t.nodes().forEach(u), t.nodeCount();
    }
    function r(t, d) {
      return d.edges().reduce((h, i) => {
        let a = Number.POSITIVE_INFINITY;
        return t.hasNode(i.v) !== t.hasNode(i.w) && (a = f(d, i)), a < h[0] ? [a, i] : h;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, d, u) {
      t.nodes().forEach((h) => d.node(h).rank += u);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, o, l) {
    var c = e("./util"), f = c.longestPath, p = e("./feasible-tree"), s = e("./network-simplex");
    o.exports = r;
    function r(u) {
      var h = u.graph().ranker;
      if (h instanceof Function)
        return h(u);
      switch (u.graph().ranker) {
        case "network-simplex":
          d(u);
          break;
        case "tight-tree":
          t(u);
          break;
        case "longest-path":
          n(u);
          break;
        case "none":
          break;
        default:
          d(u);
      }
    }
    var n = f;
    function t(u) {
      f(u), p(u);
    }
    function d(u) {
      s(u);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, o, l) {
    var c = e("./feasible-tree"), f = e("./util").slack, p = e("./util").longestPath, s = e("@dagrejs/graphlib").alg.preorder, r = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    o.exports = t, t.initLowLimValues = i, t.initCutValues = d, t.calcCutValue = h, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = _;
    function t(k) {
      k = n(k), p(k);
      var v = c(k);
      i(v), d(v, k);
      for (var O, b; O = m(v); )
        b = g(v, k, O), _(v, k, O, b);
    }
    function d(k, v) {
      var O = r(k, k.nodes());
      O = O.slice(0, O.length - 1), O.forEach((b) => u(k, v, b));
    }
    function u(k, v, O) {
      var b = k.node(O), T = b.parent;
      k.edge(O, T).cutvalue = h(k, v, O);
    }
    function h(k, v, O) {
      var b = k.node(O), T = b.parent, R = !0, y = v.edge(O, T), E = 0;
      return y || (R = !1, y = v.edge(T, O)), E = y.weight, v.nodeEdges(O).forEach((j) => {
        var L = j.v === O, S = L ? j.w : j.v;
        if (S !== T) {
          var V = L === R, $ = v.edge(j).weight;
          if (E += V ? $ : -$, w(k, O, S)) {
            var G = k.edge(O, S).cutvalue;
            E += V ? -G : G;
          }
        }
      }), E;
    }
    function i(k, v) {
      arguments.length < 2 && (v = k.nodes()[0]), a(k, {}, 1, v);
    }
    function a(k, v, O, b, T) {
      var R = O, y = k.node(b);
      return v[b] = !0, k.neighbors(b).forEach((E) => {
        Object.hasOwn(v, E) || (O = a(k, v, O, E, b));
      }), y.low = R, y.lim = O++, T ? y.parent = T : delete y.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function g(k, v, O) {
      var b = O.v, T = O.w;
      v.hasEdge(b, T) || (b = O.w, T = O.v);
      var R = k.node(b), y = k.node(T), E = R, j = !1;
      R.lim > y.lim && (E = y, j = !0);
      var L = v.edges().filter((S) => j === N(k, k.node(S.v), E) && j !== N(k, k.node(S.w), E));
      return L.reduce((S, V) => f(v, V) < f(v, S) ? V : S);
    }
    function _(k, v, O, b) {
      var T = O.v, R = O.w;
      k.removeEdge(T, R), k.setEdge(b.v, b.w, {}), i(k), d(k, v), I(k, v);
    }
    function I(k, v) {
      var O = k.nodes().find((T) => !v.node(T).parent), b = s(k, O);
      b = b.slice(1), b.forEach((T) => {
        var R = k.node(T).parent, y = v.edge(T, R), E = !1;
        y || (y = v.edge(R, T), E = !0), v.node(T).rank = v.node(R).rank + (E ? y.minlen : -y.minlen);
      });
    }
    function w(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, o, l) {
    const { applyWithChunking: c } = e("../util");
    o.exports = { longestPath: f, slack: p };
    function f(s) {
      var r = {};
      function n(t) {
        var d = s.node(t);
        if (Object.hasOwn(r, t))
          return d.rank;
        r[t] = !0;
        let u = s.outEdges(t).map((i) => i == null ? Number.POSITIVE_INFINITY : n(i.w) - s.edge(i).minlen);
        var h = c(Math.min, u);
        return h === Number.POSITIVE_INFINITY && (h = 0), d.rank = h;
      }
      s.sources().forEach(n);
    }
    function p(s, r) {
      return s.node(r.w).rank - s.node(r.v).rank - s.edge(r).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, o, l) {
    let c = e("@dagrejs/graphlib").Graph;
    o.exports = { addBorderNode: i, addDummyNode: f, applyWithChunking: g, asNonCompoundGraph: s, buildLayerMatrix: d, intersectRect: t, mapValues: T, maxRank: _, normalizeRanks: u, notime: N, partition: I, pick: b, predecessorWeights: n, range: O, removeEmptyRanks: h, simplify: p, successorWeights: r, time: w, uniqueId: v, zipObject: R };
    function f(y, E, j, L) {
      for (var S = L; y.hasNode(S); )
        S = v(L);
      return j.dummy = E, y.setNode(S, j), S;
    }
    function p(y) {
      let E = new c().setGraph(y.graph());
      return y.nodes().forEach((j) => E.setNode(j, y.node(j))), y.edges().forEach((j) => {
        let L = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, S = y.edge(j);
        E.setEdge(j.v, j.w, { weight: L.weight + S.weight, minlen: Math.max(L.minlen, S.minlen) });
      }), E;
    }
    function s(y) {
      let E = new c({ multigraph: y.isMultigraph() }).setGraph(y.graph());
      return y.nodes().forEach((j) => {
        y.children(j).length || E.setNode(j, y.node(j));
      }), y.edges().forEach((j) => {
        E.setEdge(j, y.edge(j));
      }), E;
    }
    function r(y) {
      let E = y.nodes().map((j) => {
        let L = {};
        return y.outEdges(j).forEach((S) => {
          L[S.w] = (L[S.w] || 0) + y.edge(S).weight;
        }), L;
      });
      return R(y.nodes(), E);
    }
    function n(y) {
      let E = y.nodes().map((j) => {
        let L = {};
        return y.inEdges(j).forEach((S) => {
          L[S.v] = (L[S.v] || 0) + y.edge(S).weight;
        }), L;
      });
      return R(y.nodes(), E);
    }
    function t(y, E) {
      let j = y.x, L = y.y, S = E.x - j, V = E.y - L, $ = y.width / 2, G = y.height / 2;
      if (!S && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let Z, ne;
      return Math.abs(V) * $ > Math.abs(S) * G ? (V < 0 && (G = -G), Z = G * S / V, ne = G) : (S < 0 && ($ = -$), Z = $, ne = $ * V / S), { x: j + Z, y: L + ne };
    }
    function d(y) {
      let E = O(_(y) + 1).map(() => []);
      return y.nodes().forEach((j) => {
        let L = y.node(j), S = L.rank;
        S !== void 0 && (E[S][L.order] = j);
      }), E;
    }
    function u(y) {
      let E = y.nodes().map((L) => {
        let S = y.node(L).rank;
        return S === void 0 ? Number.MAX_VALUE : S;
      }), j = g(Math.min, E);
      y.nodes().forEach((L) => {
        let S = y.node(L);
        Object.hasOwn(S, "rank") && (S.rank -= j);
      });
    }
    function h(y) {
      let E = y.nodes().map(($) => y.node($).rank), j = g(Math.min, E), L = [];
      y.nodes().forEach(($) => {
        let G = y.node($).rank - j;
        L[G] || (L[G] = []), L[G].push($);
      });
      let S = 0, V = y.graph().nodeRankFactor;
      Array.from(L).forEach(($, G) => {
        $ === void 0 && G % V !== 0 ? --S : $ !== void 0 && S && $.forEach((Z) => y.node(Z).rank += S);
      });
    }
    function i(y, E, j, L) {
      let S = { width: 0, height: 0 };
      return arguments.length >= 4 && (S.rank = j, S.order = L), f(y, "border", S, E);
    }
    function a(y, E = m) {
      const j = [];
      for (let L = 0; L < y.length; L += E) {
        const S = y.slice(L, L + E);
        j.push(S);
      }
      return j;
    }
    const m = 65535;
    function g(y, E) {
      if (E.length > m) {
        const j = a(E);
        return y.apply(null, j.map((L) => y.apply(null, L)));
      } else
        return y.apply(null, E);
    }
    function _(y) {
      const j = y.nodes().map((L) => {
        let S = y.node(L).rank;
        return S === void 0 ? Number.MIN_VALUE : S;
      });
      return g(Math.max, j);
    }
    function I(y, E) {
      let j = { lhs: [], rhs: [] };
      return y.forEach((L) => {
        E(L) ? j.lhs.push(L) : j.rhs.push(L);
      }), j;
    }
    function w(y, E) {
      let j = Date.now();
      try {
        return E();
      } finally {
        console.log(y + " time: " + (Date.now() - j) + "ms");
      }
    }
    function N(y, E) {
      return E();
    }
    let k = 0;
    function v(y) {
      var E = ++k;
      return y + ("" + E);
    }
    function O(y, E, j = 1) {
      E == null && (E = y, y = 0);
      let L = (V) => V < E;
      j < 0 && (L = (V) => E < V);
      const S = [];
      for (let V = y; L(V); V += j)
        S.push(V);
      return S;
    }
    function b(y, E) {
      const j = {};
      for (const L of E)
        y[L] !== void 0 && (j[L] = y[L]);
      return j;
    }
    function T(y, E) {
      let j = E;
      return typeof E == "string" && (j = (L) => L[E]), Object.entries(y).reduce((L, [S, V]) => (L[S] = j(V, S), L), {});
    }
    function R(y, E) {
      return y.reduce((j, L, S) => (j[L] = E[S], j), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, o, l) {
    o.exports = "1.1.8";
  }, {}], 29: [function(e, o, l) {
    var c = e("./lib");
    o.exports = { Graph: c.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: c.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, o, l) {
    o.exports = c;
    function c(f) {
      var p = {}, s = [], r;
      function n(t) {
        Object.hasOwn(p, t) || (p[t] = !0, r.push(t), f.successors(t).forEach(n), f.predecessors(t).forEach(n));
      }
      return f.nodes().forEach(function(t) {
        r = [], n(t), r.length && s.push(r);
      }), s;
    }
  }, {}], 31: [function(e, o, l) {
    o.exports = c;
    function c(r, n, t) {
      Array.isArray(n) || (n = [n]);
      var d = r.isDirected() ? (a) => r.successors(a) : (a) => r.neighbors(a), u = t === "post" ? f : p, h = [], i = {};
      return n.forEach((a) => {
        if (!r.hasNode(a))
          throw new Error("Graph does not have node: " + a);
        u(a, d, i, h);
      }), h;
    }
    function f(r, n, t, d) {
      for (var u = [[r, !1]]; u.length > 0; ) {
        var h = u.pop();
        h[1] ? d.push(h[0]) : Object.hasOwn(t, h[0]) || (t[h[0]] = !0, u.push([h[0], !0]), s(n(h[0]), (i) => u.push([i, !1])));
      }
    }
    function p(r, n, t, d) {
      for (var u = [r]; u.length > 0; ) {
        var h = u.pop();
        Object.hasOwn(t, h) || (t[h] = !0, d.push(h), s(n(h), (i) => u.push(i)));
      }
    }
    function s(r, n) {
      for (var t = r.length; t--; )
        n(r[t], t, r);
      return r;
    }
  }, {}], 32: [function(e, o, l) {
    var c = e("./dijkstra");
    o.exports = f;
    function f(p, s, r) {
      return p.nodes().reduce(function(n, t) {
        return n[t] = c(p, t, s, r), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, o, l) {
    var c = e("../data/priority-queue");
    o.exports = p;
    var f = () => 1;
    function p(r, n, t, d) {
      return s(r, String(n), t || f, d || function(u) {
        return r.outEdges(u);
      });
    }
    function s(r, n, t, d) {
      var u = {}, h = new c(), i, a, m = function(g) {
        var _ = g.v !== i ? g.v : g.w, I = u[_], w = t(g), N = a.distance + w;
        if (w < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + w);
        N < I.distance && (I.distance = N, I.predecessor = i, h.decrease(_, N));
      };
      for (r.nodes().forEach(function(g) {
        var _ = g === n ? 0 : Number.POSITIVE_INFINITY;
        u[g] = { distance: _ }, h.add(g, _);
      }); h.size() > 0 && (i = h.removeMin(), a = u[i], a.distance !== Number.POSITIVE_INFINITY); )
        d(i).forEach(m);
      return u;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, o, l) {
    var c = e("./tarjan");
    o.exports = f;
    function f(p) {
      return c(p).filter(function(s) {
        return s.length > 1 || s.length === 1 && p.hasEdge(s[0], s[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, o, l) {
    o.exports = f;
    var c = () => 1;
    function f(s, r, n) {
      return p(s, r || c, n || function(t) {
        return s.outEdges(t);
      });
    }
    function p(s, r, n) {
      var t = {}, d = s.nodes();
      return d.forEach(function(u) {
        t[u] = {}, t[u][u] = { distance: 0 }, d.forEach(function(h) {
          u !== h && (t[u][h] = { distance: Number.POSITIVE_INFINITY });
        }), n(u).forEach(function(h) {
          var i = h.v === u ? h.w : h.v, a = r(h);
          t[u][i] = { distance: a, predecessor: u };
        });
      }), d.forEach(function(u) {
        var h = t[u];
        d.forEach(function(i) {
          var a = t[i];
          d.forEach(function(m) {
            var g = a[u], _ = h[m], I = a[m], w = g.distance + _.distance;
            w < I.distance && (I.distance = w, I.predecessor = _.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, o, l) {
    o.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, o, l) {
    var c = e("./topsort");
    o.exports = f;
    function f(p) {
      try {
        c(p);
      } catch (s) {
        if (s instanceof c.CycleException)
          return !1;
        throw s;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, o, l) {
    var c = e("./dfs");
    o.exports = f;
    function f(p, s) {
      return c(p, s, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, o, l) {
    var c = e("./dfs");
    o.exports = f;
    function f(p, s) {
      return c(p, s, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, o, l) {
    var c = e("../graph"), f = e("../data/priority-queue");
    o.exports = p;
    function p(s, r) {
      var n = new c(), t = {}, d = new f(), u;
      function h(a) {
        var m = a.v === u ? a.w : a.v, g = d.priority(m);
        if (g !== void 0) {
          var _ = r(a);
          _ < g && (t[m] = u, d.decrease(m, _));
        }
      }
      if (s.nodeCount() === 0)
        return n;
      s.nodes().forEach(function(a) {
        d.add(a, Number.POSITIVE_INFINITY), n.setNode(a);
      }), d.decrease(s.nodes()[0], 0);
      for (var i = !1; d.size() > 0; ) {
        if (u = d.removeMin(), Object.hasOwn(t, u))
          n.setEdge(u, t[u]);
        else {
          if (i)
            throw new Error("Input graph is not connected: " + s);
          i = !0;
        }
        s.nodeEdges(u).forEach(h);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, o, l) {
    o.exports = c;
    function c(f) {
      var p = 0, s = [], r = {}, n = [];
      function t(d) {
        var u = r[d] = { onStack: !0, lowlink: p, index: p++ };
        if (s.push(d), f.successors(d).forEach(function(a) {
          Object.hasOwn(r, a) ? r[a].onStack && (u.lowlink = Math.min(u.lowlink, r[a].index)) : (t(a), u.lowlink = Math.min(u.lowlink, r[a].lowlink));
        }), u.lowlink === u.index) {
          var h = [], i;
          do
            i = s.pop(), r[i].onStack = !1, h.push(i);
          while (d !== i);
          n.push(h);
        }
      }
      return f.nodes().forEach(function(d) {
        Object.hasOwn(r, d) || t(d);
      }), n;
    }
  }, {}], 42: [function(e, o, l) {
    function c(p) {
      var s = {}, r = {}, n = [];
      function t(d) {
        if (Object.hasOwn(r, d))
          throw new f();
        Object.hasOwn(s, d) || (r[d] = !0, s[d] = !0, p.predecessors(d).forEach(t), delete r[d], n.push(d));
      }
      if (p.sinks().forEach(t), Object.keys(s).length !== p.nodeCount())
        throw new f();
      return n;
    }
    class f extends Error {
      constructor() {
        super(...arguments);
      }
    }
    o.exports = c, c.CycleException = f;
  }, {}], 43: [function(e, o, l) {
    class c {
      _arr = [];
      _keyIndices = {};
      /**
         * Returns the number of elements in the queue. Takes `O(1)` time.
         */
      size() {
        return this._arr.length;
      }
      /**
         * Returns the keys that are in the queue. Takes `O(n)` time.
         */
      keys() {
        return this._arr.map(function(p) {
          return p.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(p) {
        return Object.hasOwn(this._keyIndices, p);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(p) {
        var s = this._keyIndices[p];
        if (s !== void 0)
          return this._arr[s].priority;
      }
      /**
         * Returns the key for the minimum element in this queue. If the queue is
         * empty this function throws an Error. Takes `O(1)` time.
         */
      min() {
        if (this.size() === 0)
          throw new Error("Queue underflow");
        return this._arr[0].key;
      }
      /**
         * Inserts a new key into the priority queue. If the key already exists in
         * the queue this function returns `false`; otherwise it will return `true`.
         * Takes `O(n)` time.
         *
         * @param {Object} key the key to add
         * @param {Number} priority the initial priority for the key
         */
      add(p, s) {
        var r = this._keyIndices;
        if (p = String(p), !Object.hasOwn(r, p)) {
          var n = this._arr, t = n.length;
          return r[p] = t, n.push({ key: p, priority: s }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var p = this._arr.pop();
        return delete this._keyIndices[p.key], this._heapify(0), p.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(p, s) {
        var r = this._keyIndices[p];
        if (s > this._arr[r].priority)
          throw new Error("New priority is greater than current priority. Key: " + p + " Old: " + this._arr[r].priority + " New: " + s);
        this._arr[r].priority = s, this._decrease(r);
      }
      _heapify(p) {
        var s = this._arr, r = 2 * p, n = r + 1, t = p;
        r < s.length && (t = s[r].priority < s[t].priority ? r : t, n < s.length && (t = s[n].priority < s[t].priority ? n : t), t !== p && (this._swap(p, t), this._heapify(t)));
      }
      _decrease(p) {
        for (var s = this._arr, r = s[p].priority, n; p !== 0 && (n = p >> 1, !(s[n].priority < r)); )
          this._swap(p, n), p = n;
      }
      _swap(p, s) {
        var r = this._arr, n = this._keyIndices, t = r[p], d = r[s];
        r[p] = d, r[s] = t, n[d.key] = p, n[t.key] = s;
      }
    }
    o.exports = c;
  }, {}], 44: [function(e, o, l) {
    var c = "\0", f = "\0", p = "";
    class s {
      _isDirected = !0;
      _isMultigraph = !1;
      _isCompound = !1;
      // Label for the graph itself
      _label;
      // Defaults to be set when creating a new node
      _defaultNodeLabelFn = () => {
      };
      // Defaults to be set when creating a new edge
      _defaultEdgeLabelFn = () => {
      };
      // v -> label
      _nodes = {};
      // v -> edgeObj
      _in = {};
      // u -> v -> Number
      _preds = {};
      // v -> edgeObj
      _out = {};
      // v -> w -> Number
      _sucs = {};
      // e -> edgeObj
      _edgeObjs = {};
      // e -> label
      _edgeLabels = {};
      /* Number of nodes in the graph. Should only be changed by the implementation. */
      _nodeCount = 0;
      /* Number of edges in the graph. Should only be changed by the implementation. */
      _edgeCount = 0;
      _parent;
      _children;
      constructor(i) {
        i && (this._isDirected = Object.hasOwn(i, "directed") ? i.directed : !0, this._isMultigraph = Object.hasOwn(i, "multigraph") ? i.multigraph : !1, this._isCompound = Object.hasOwn(i, "compound") ? i.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[f] = {});
      }
      /* === Graph functions ========= */
      /**
         * Whether graph was created with 'directed' flag set to true or not.
         */
      isDirected() {
        return this._isDirected;
      }
      /**
         * Whether graph was created with 'multigraph' flag set to true or not.
         */
      isMultigraph() {
        return this._isMultigraph;
      }
      /**
         * Whether graph was created with 'compound' flag set to true or not.
         */
      isCompound() {
        return this._isCompound;
      }
      /**
         * Sets the label of the graph.
         */
      setGraph(i) {
        return this._label = i, this;
      }
      /**
         * Gets the graph label.
         */
      graph() {
        return this._label;
      }
      /* === Node functions ========== */
      /**
         * Sets the default node label. If newDefault is a function, it will be
         * invoked ach time when setting a label for a node. Otherwise, this label
         * will be assigned as default label in case if no label was specified while
         * setting a node.
         * Complexity: O(1).
         */
      setDefaultNodeLabel(i) {
        return this._defaultNodeLabelFn = i, typeof i != "function" && (this._defaultNodeLabelFn = () => i), this;
      }
      /**
         * Gets the number of nodes in the graph.
         * Complexity: O(1).
         */
      nodeCount() {
        return this._nodeCount;
      }
      /**
         * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
         * not included in list.
         * Complexity: O(1).
         */
      nodes() {
        return Object.keys(this._nodes);
      }
      /**
         * Gets list of nodes without in-edges.
         * Complexity: O(|V|).
         */
      sources() {
        var i = this;
        return this.nodes().filter((a) => Object.keys(i._in[a]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var i = this;
        return this.nodes().filter((a) => Object.keys(i._out[a]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(i, a) {
        var m = arguments, g = this;
        return i.forEach(function(_) {
          m.length > 1 ? g.setNode(_, a) : g.setNode(_);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(i, a) {
        return Object.hasOwn(this._nodes, i) ? (arguments.length > 1 && (this._nodes[i] = a), this) : (this._nodes[i] = arguments.length > 1 ? a : this._defaultNodeLabelFn(i), this._isCompound && (this._parent[i] = f, this._children[i] = {}, this._children[f][i] = !0), this._in[i] = {}, this._preds[i] = {}, this._out[i] = {}, this._sucs[i] = {}, ++this._nodeCount, this);
      }
      /**
         * Gets the label of node with specified name.
         * Complexity: O(|V|).
         */
      node(i) {
        return this._nodes[i];
      }
      /**
         * Detects whether graph has a node with specified name or not.
         */
      hasNode(i) {
        return Object.hasOwn(this._nodes, i);
      }
      /**
         * Remove the node with the name from the graph or do nothing if the node is not in
         * the graph. If the node was removed this function also removes any incident
         * edges.
         * Complexity: O(1).
         */
      removeNode(i) {
        var a = this;
        if (Object.hasOwn(this._nodes, i)) {
          var m = (g) => a.removeEdge(a._edgeObjs[g]);
          delete this._nodes[i], this._isCompound && (this._removeFromParentsChildList(i), delete this._parent[i], this.children(i).forEach(function(g) {
            a.setParent(g);
          }), delete this._children[i]), Object.keys(this._in[i]).forEach(m), delete this._in[i], delete this._preds[i], Object.keys(this._out[i]).forEach(m), delete this._out[i], delete this._sucs[i], --this._nodeCount;
        }
        return this;
      }
      /**
         * Sets node p as a parent for node v if it is defined, or removes the
         * parent for v if p is undefined. Method throws an exception in case of
         * invoking it in context of noncompound graph.
         * Average-case complexity: O(1).
         */
      setParent(i, a) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (a === void 0)
          a = f;
        else {
          a += "";
          for (var m = a; m !== void 0; m = this.parent(m))
            if (m === i)
              throw new Error("Setting " + a + " as parent of " + i + " would create a cycle");
          this.setNode(a);
        }
        return this.setNode(i), this._removeFromParentsChildList(i), this._parent[i] = a, this._children[a][i] = !0, this;
      }
      _removeFromParentsChildList(i) {
        delete this._children[this._parent[i]][i];
      }
      /**
         * Gets parent node for node v.
         * Complexity: O(1).
         */
      parent(i) {
        if (this._isCompound) {
          var a = this._parent[i];
          if (a !== f)
            return a;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(i = f) {
        if (this._isCompound) {
          var a = this._children[i];
          if (a)
            return Object.keys(a);
        } else {
          if (i === f)
            return this.nodes();
          if (this.hasNode(i))
            return [];
        }
      }
      /**
         * Return all nodes that are predecessors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      predecessors(i) {
        var a = this._preds[i];
        if (a)
          return Object.keys(a);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(i) {
        var a = this._sucs[i];
        if (a)
          return Object.keys(a);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(i) {
        var a = this.predecessors(i);
        if (a) {
          const g = new Set(a);
          for (var m of this.successors(i))
            g.add(m);
          return Array.from(g.values());
        }
      }
      isLeaf(i) {
        var a;
        return this.isDirected() ? a = this.successors(i) : a = this.neighbors(i), a.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(i) {
        var a = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        a.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([I, w]) {
          i(I) && a.setNode(I, w);
        }), Object.values(this._edgeObjs).forEach(function(I) {
          a.hasNode(I.v) && a.hasNode(I.w) && a.setEdge(I, m.edge(I));
        });
        var g = {};
        function _(I) {
          var w = m.parent(I);
          return w === void 0 || a.hasNode(w) ? (g[I] = w, w) : w in g ? g[w] : _(w);
        }
        return this._isCompound && a.nodes().forEach((I) => a.setParent(I, _(I))), a;
      }
      /* === Edge functions ========== */
      /**
         * Sets the default edge label or factory function. This label will be
         * assigned as default label in case if no label was specified while setting
         * an edge or this function will be invoked each time when setting an edge
         * with no label specified and returned value * will be used as a label for edge.
         * Complexity: O(1).
         */
      setDefaultEdgeLabel(i) {
        return this._defaultEdgeLabelFn = i, typeof i != "function" && (this._defaultEdgeLabelFn = () => i), this;
      }
      /**
         * Gets the number of edges in the graph.
         * Complexity: O(1).
         */
      edgeCount() {
        return this._edgeCount;
      }
      /**
         * Gets edges of the graph. In case of compound graph subgraphs are not considered.
         * Complexity: O(|E|).
         */
      edges() {
        return Object.values(this._edgeObjs);
      }
      /**
         * Establish an edges path over the nodes in nodes list. If some edge is already
         * exists, it will update its label, otherwise it will create an edge between pair
         * of nodes with label provided or default label if no label provided.
         * Complexity: O(|nodes|).
         */
      setPath(i, a) {
        var m = this, g = arguments;
        return i.reduce(function(_, I) {
          return g.length > 1 ? m.setEdge(_, I, a) : m.setEdge(_, I), I;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var i, a, m, g, _ = !1, I = arguments[0];
        typeof I == "object" && I !== null && "v" in I ? (i = I.v, a = I.w, m = I.name, arguments.length === 2 && (g = arguments[1], _ = !0)) : (i = I, a = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], _ = !0)), i = "" + i, a = "" + a, m !== void 0 && (m = "" + m);
        var w = t(this._isDirected, i, a, m);
        if (Object.hasOwn(this._edgeLabels, w))
          return _ && (this._edgeLabels[w] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(i), this.setNode(a), this._edgeLabels[w] = _ ? g : this._defaultEdgeLabelFn(i, a, m);
        var N = d(this._isDirected, i, a, m);
        return i = N.v, a = N.w, Object.freeze(N), this._edgeObjs[w] = N, r(this._preds[a], i), r(this._sucs[i], a), this._in[a][w] = N, this._out[i][w] = N, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(i, a, m) {
        var g = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, a, m);
        return this._edgeLabels[g];
      }
      /**
         * Gets the label for the specified edge and converts it to an object.
         * Complexity: O(1)
         */
      edgeAsObj() {
        const i = this.edge(...arguments);
        return typeof i != "object" ? { label: i } : i;
      }
      /**
         * Detects whether the graph contains specified edge or not. No subgraphs are considered.
         * Complexity: O(1).
         */
      hasEdge(i, a, m) {
        var g = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, a, m);
        return Object.hasOwn(this._edgeLabels, g);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(i, a, m) {
        var g = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, a, m), _ = this._edgeObjs[g];
        return _ && (i = _.v, a = _.w, delete this._edgeLabels[g], delete this._edgeObjs[g], n(this._preds[a], i), n(this._sucs[i], a), delete this._in[a][g], delete this._out[i][g], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(i, a) {
        var m = this._in[i];
        if (m) {
          var g = Object.values(m);
          return a ? g.filter((_) => _.v === a) : g;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(i, a) {
        var m = this._out[i];
        if (m) {
          var g = Object.values(m);
          return a ? g.filter((_) => _.w === a) : g;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(i, a) {
        var m = this.inEdges(i, a);
        if (m)
          return m.concat(this.outEdges(i, a));
      }
    }
    function r(h, i) {
      h[i] ? h[i]++ : h[i] = 1;
    }
    function n(h, i) {
      --h[i] || delete h[i];
    }
    function t(h, i, a, m) {
      var g = "" + i, _ = "" + a;
      if (!h && g > _) {
        var I = g;
        g = _, _ = I;
      }
      return g + p + _ + p + (m === void 0 ? c : m);
    }
    function d(h, i, a, m) {
      var g = "" + i, _ = "" + a;
      if (!h && g > _) {
        var I = g;
        g = _, _ = I;
      }
      var w = { v: g, w: _ };
      return m && (w.name = m), w;
    }
    function u(h, i) {
      return t(h, i.v, i.w, i.name);
    }
    o.exports = s;
  }, {}], 45: [function(e, o, l) {
    o.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, o, l) {
    var c = e("./graph");
    o.exports = { write: f, read: r };
    function f(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: p(n), edges: s(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function p(n) {
      return n.nodes().map(function(t) {
        var d = n.node(t), u = n.parent(t), h = { v: t };
        return d !== void 0 && (h.value = d), u !== void 0 && (h.parent = u), h;
      });
    }
    function s(n) {
      return n.edges().map(function(t) {
        var d = n.edge(t), u = { v: t.v, w: t.w };
        return t.name !== void 0 && (u.name = t.name), d !== void 0 && (u.value = d), u;
      });
    }
    function r(n) {
      var t = new c(n.options).setGraph(n.value);
      return n.nodes.forEach(function(d) {
        t.setNode(d.v, d.value), d.parent && t.setParent(d.v, d.parent);
      }), n.edges.forEach(function(d) {
        t.setEdge({ v: d.v, w: d.w, name: d.name }, d.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, o, l) {
    o.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), wn = ["unstarted", "started", "completed", "canceled"];
function vn(e, o) {
  let l = 1;
  const c = () => `${e.slice(0, 40 - String(l).length - 1)}_${l}`;
  for (; o.some((f) => f.id === c()); ) l++;
  return c();
}
function kn(e, o) {
  return [
    ...e.initial === o.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((l) => l.to === o.id || l.from !== "any" && l.from.includes(o.id)).map((l) => `transition ${Yt(l)}`),
    ...e.states.filter((l) => l.regions?.some((c) => c.initial === o.id)).map((l) => `lanes in ${qe(l)}`),
    ...Object.entries(e.map ?? {}).filter(([, l]) => l === o.id).map(() => "existing item migration")
  ];
}
function En(e, o) {
  return e.states.flatMap((l) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((c) => l.run?.[c] === o.id).map((c) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[c]} handler in ${qe(l)}`),
    ...(l.timers ?? []).filter((c) => c.then?.transition === o.id).map(() => "a timer")
  ]);
}
const qe = (e) => e?.name || "Untitled state", Yt = (e) => e.name?.trim() || ye(e.id), xn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", _n = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function On(e, o) {
  if (e.id === o.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const l = e.release_when?.approvals?.min;
    return l ? `Needs ${l} approval${l === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Ye(e) : "A person moves it";
}
function Ye(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Nn(e, o) {
  const l = e.release_when?.approvals?.min ?? 1, c = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${l === 1 ? "one person approves" : `${l} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Ye(e)}.` : "A person chooses when to move the item on.", f = o.policy?.wip?.[e.id]?.limit;
  return c + (f !== void 0 ? ` At most ${f} at a time.` : "");
}
function jn(e) {
  const o = e.transitions ?? [], l = [], c = /* @__PURE__ */ new Set();
  let f = e.states.find((s) => s.id === e.initial);
  const p = new Map(e.states.map((s, r) => [s.id, r]));
  for (; f && !c.has(f.id) && (l.push(f), c.add(f.id), !(f.category === "completed" || f.category === "canceled")); ) {
    const s = f, r = o.filter((t) => t.from !== "any" && t.from.includes(s.id)), n = r.find((t) => t.default) ?? r.find((t) => !c.has(t.to) && (p.get(t.to) ?? -1) > (p.get(s.id) ?? 0));
    f = e.states.find((t) => t.id === n?.to);
  }
  return l;
}
function Je(e) {
  const o = e.states.find((l) => l.id === e.initial);
  return e.migration ?? (o?.kind === "automated" || o?.kind === "parallel" ? "pin" : "follow");
}
const ie = (e) => JSON.parse(JSON.stringify(e));
function In(e) {
  return e?.admin === !0;
}
function Cn(e, o, l) {
  const c = o + l;
  if (o < 0 || o >= e.length || c < 0 || c >= e.length) return;
  const [f] = e.splice(o, 1);
  e.splice(c, 0, f);
}
function Ln(e, o, l) {
  const c = o.code;
  if (c === l) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  o.code = l;
  const f = (n) => n === c ? l : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(f), n.inherit && (n.inherit = n.inherit.map(f));
  const p = (n) => {
    for (const t of n ?? []) "field" in t && t.field === c && (t.field = l);
  }, s = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = f(n.field));
  }, r = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(r);
        return;
      }
      s(n);
      for (const [t, d] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || r(d);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = f(n.field)), r(n.where), p(n.access?.read), p(n.access?.write);
  if (e.visibility) {
    e.visibility.field = f(e.visibility.field);
    for (const n of e.visibility.levels) p(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      s(t.awaiting), s(t.release_when?.approvals?.from), r(t.release_when?.when), t.require && (t.require = t.require.map(f));
      for (const d of t.timers ?? [])
        d.at_field && (d.at_field = f(d.at_field)), d.by && (d.by = f(d.by));
    }
    for (const t of n.transitions ?? []) {
      r(t.when), t.require && (t.require = t.require.map(f));
      for (const d of t.set ?? [])
        d.field = f(d.field), d.copy && (d.copy = f(d.copy));
    }
  }
}
function $e({ migration: e, map: o, ...l }) {
  return JSON.stringify(l);
}
function Tn(e, o) {
  const l = ie(e);
  for (const f of l.processes ?? []) {
    const p = o.processes?.find((s) => s.id === f.id);
    if (p && $e(f) !== $e(p) && (f.migration = "follow"), f.map) {
      for (const [s, r] of Object.entries(f.map))
        (f.states.some((n) => n.id === s) || !f.states.some((n) => n.id === r)) && delete f.map[s];
      Object.keys(f.map).length || delete f.map;
    }
  }
  l.plugins && (l.plugins = l.plugins.map(({ use: f }) => ({ use: f })));
  for (const f of l.fields ?? [])
    f.type?.includes(":") && delete f.form;
  const c = { ...l.remove };
  o.visibility && !l.visibility ? c.visibility = !0 : delete c.visibility;
  for (const f of ["fields", "item_types", "processes", "relation_types"]) {
    const p = (o[f] ?? []).filter((s) => {
      if (f === "fields") {
        const r = s;
        return !l.fields?.some((n) => r.id !== void 0 ? n.id === r.id : n.code === r.code);
      }
      return !(l[f] ?? []).some((r) => "id" in r && r.id === ("id" in s ? s.id : void 0));
    }).map((s) => "code" in s ? s.code : s.id);
    p.length ? c[f] = [.../* @__PURE__ */ new Set([...c[f] ?? [], ...p])] : delete c[f];
  }
  return Object.keys(c).length ? l.remove = c : delete l.remove, l;
}
function An(e, o, l) {
  const c = JSON.stringify({ declaration: e, configs: l });
  return {
    declaration: ie(e),
    expected_generation: o,
    plugin_configs: ie(l),
    matches: (f, p, s) => o === p && c === JSON.stringify({ declaration: f, configs: s })
  };
}
function Sn(e) {
  const o = ie(e), l = [...new Set(o.declaration.item_types?.flatMap((f) => f.fields) ?? [])], c = (f) => {
    const p = l.indexOf(f);
    return p < 0 ? l.length : p;
  };
  o.declaration.fields?.sort((f, p) => c(f.code) - c(p.code));
  for (const f of o.declaration.fields ?? []) {
    const p = o.compiled.fields?.find((s) => s.code === f.code);
    f.id ??= p?.id, f.form ??= p?.form;
  }
  for (const f of o.declaration.processes ?? []) f.migration ??= o.compiled.processes?.find((p) => p.id === f.id)?.migration ?? Je(f);
  return o;
}
function Mn(e, o) {
  return (o.processes ?? []).filter((l) => Je(l) !== "pin" && e.changes.some((c) => c.code === "process " + l.id && c.class !== "cosmetic" && c.class !== "refused")).map((l) => l.id);
}
function Rn(e, o, l) {
  const c = [l, `item_type ${l}`, `relation ${l}`, `process ${l}`], f = e.refused.filter((p) => c.includes(p.code));
  return o === "fields" && f.push(...e.changes.filter((p) => p.code === l && p.what === "removed" && p.class === "semantic")), f.length ? f.map(Jt).join(" ") : void 0;
}
function Vn(e, o, l) {
  if (o === "fields") {
    e.fields = e.fields?.filter((c) => c.code !== l);
    for (const c of e.item_types ?? [])
      c.fields = c.fields.filter((f) => f !== l), c.inherit = c.inherit?.filter((f) => f !== l);
  } else o === "item_types" ? e.item_types = e.item_types?.filter((c) => c.id !== l) : o === "processes" ? e.processes = e.processes?.filter((c) => c.id !== l) : e.relation_types = e.relation_types?.filter((c) => c.id !== l);
}
function Jt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function $n(e, o) {
  if (!(e instanceof re)) return [];
  const l = e.details ?? {};
  let c = typeof l.field == "string" ? l.field : "";
  if (!c) {
    const f = o.processes?.find((p) => p.id === l.process || p.states.some((s) => s.id === l.state) || e.message.includes(`process ${p.id}`));
    f ? c = `process ${f.id}` : typeof l.item_type == "string" && (c = `item_type ${l.item_type}`);
  }
  return c ? [{ code: c, class: "refused", what: "invalid", detail: je(e, "The definition is invalid.") }] : [];
}
const Dn = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, De = (e) => !("problem" in e);
function Pn(e) {
  const o = De(e) ? e.plugins.find((c) => c.problem && c.installed)?.problem : e.problem, l = o ? `${o.message} (Error code: ${o.code})` : De(e) && e.plugins.some((c) => !c.installed) ? "A required plugin is unavailable." : void 0;
  return { ...e, title: e.title ?? "Unnamed pack", icon: e.icon ?? "tabler:package-off", disabled: !!l, unavailable: l };
}
function Fn(e, o) {
  return { pack: e.id, version: e.version, expected_generation: o };
}
async function Un(e, o) {
  const l = { ...ie(e), resolutions: ie(e.resolutions ?? {}) };
  let c = await o(l);
  return l.maps || (l.maps = ie(c.maps), c = await o(l)), { request: l, plan: c };
}
function Ht() {
  let e = 0;
  return () => {
    const o = ++e;
    return () => o === e;
  };
}
function Gn() {
  const e = Y([]), o = Y(!1), l = Y(""), c = Ht();
  async function f(s = () => !0) {
    const r = c();
    l.value = "", o.value = !0;
    try {
      const n = await ze.packs();
      r() && s() && (e.value = n);
    } catch (n) {
      r() && s() && (l.value = je(n, "Could not load packs."));
    } finally {
      r() && (o.value = !1);
    }
  }
  function p() {
    c(), e.value = [], l.value = "", o.value = !1;
  }
  return { packs: e, loading: o, error: l, load: f, reset: p };
}
export {
  xn as A,
  Cn as B,
  xt as C,
  Jt as D,
  Vn as E,
  Ln as F,
  _n as G,
  re as H,
  Ge as I,
  vn as J,
  Nn as K,
  En as L,
  kn as M,
  Tt as N,
  ge as O,
  Dn as P,
  Tn as Q,
  Mn as R,
  ie as S,
  Fn as T,
  Un as U,
  Sn as V,
  An as W,
  $n as X,
  Rn as Y,
  gn as _,
  De as a,
  At as b,
  We as c,
  bn as d,
  In as e,
  je as f,
  fn as g,
  yn as h,
  On as i,
  ae as j,
  Be as k,
  Ht as l,
  jn as m,
  fe as n,
  hn as o,
  Pn as p,
  Ct as q,
  pn as r,
  qe as s,
  Yt as t,
  Gn as u,
  mn as v,
  ze as w,
  ye as x,
  _t as y,
  wn as z
};
//# sourceMappingURL=usePackDiscovery-BCCFCjF1.js.map
