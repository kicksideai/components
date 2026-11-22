import { defineComponent as ue, useId as Ne, openBlock as P, createElementBlock as W, unref as F, normalizeClass as Ze, createElementVNode as Q, createTextVNode as oe, toDisplayString as q, createCommentVNode as X, renderSlot as le, ref as Y, computed as ee, watch as re, createBlock as K, withCtx as ae, createVNode as te, withKeys as Te, withModifiers as Me, nextTick as _e, useModel as et, mergeModels as tt, onBeforeUnmount as je, onUnmounted as nt, Fragment as Re, renderList as Se, onMounted as rt } from "vue";
import pe from "primevue/button";
import Fe from "primevue/inputtext";
import it from "primevue/inputnumber";
import st from "primevue/toggleswitch";
import Ve from "primevue/select";
import at from "primevue/chip";
import { Icon as ot } from "@iconify/vue";
import lt from "primevue/accordion";
import dt from "primevue/accordioncontent";
import ut from "primevue/accordionheader";
import ct from "primevue/accordionpanel";
import ft from "primevue/textarea";
import { e as ht } from "./mount-Dm-3vIEJ.js";
import { api as Ue } from "@wippy-fe/proxy";
const pt = ["aria-labelledby"], mt = { class: "kx-railhead" }, gt = ["id"], bt = { key: 0 }, yt = { class: "kx-railhead-acts" }, wt = { class: "kx-rail-body" }, mn = /* @__PURE__ */ ue({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const a = Ne();
    return (l, c) => (P(), W("aside", {
      class: Ze(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": F(a)
    }, [
      Q("div", mt, [
        Q("span", {
          id: F(a),
          class: "kx-railhead-title"
        }, [
          oe(q(e.title), 1),
          e.count !== void 0 ? (P(), W("b", bt, q(e.count), 1)) : X("", !0)
        ], 8, gt),
        Q("div", yt, [
          le(l.$slots, "actions")
        ])
      ]),
      le(l.$slots, "toolbar"),
      Q("div", wt, [
        le(l.$slots, "default")
      ])
    ], 10, pt));
  }
});
class de extends Error {
  constructor(a, l, c) {
    super(a.message ?? a.error ?? `${l} failed`), this.name = "ApiError", this.kind = a.kind, this.details = a.details, this.retryable = a.retryable, this.status = c;
  }
}
function me(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ge(e, a, l) {
  return new de({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: me(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, a, l);
}
function vt(e, a) {
  if (e instanceof de) return e;
  if (me(e) && me(e.response) && me(e.response.data)) {
    const { data: l, status: c } = e.response;
    return Ge(l, a, typeof c == "number" ? c : void 0);
  }
  return e instanceof Error ? e : new de({ kind: "UNAVAILABLE" }, a);
}
async function Be(e, a) {
  let l;
  try {
    l = (await e()).data;
  } catch (c) {
    throw vt(c, a);
  }
  if (l?.success === !0 && l.data !== void 0) return l.data;
  throw l?.success === !1 ? Ge(l, a) : new de({ kind: "INTERNAL", message: `${a}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, a);
}
const $e = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Ie(e, a) {
  const l = e instanceof de ? e.details?.code : void 0, c = e instanceof Error && e.message || a;
  return typeof l != "string" || !l.trim() ? c : `${Object.hasOwn($e, l) ? $e[l] : c}
Error code: ${l}`;
}
function Ee(e, a, l) {
  return Be(() => Ue.get(e, { params: l }), a);
}
function se(e, a, l) {
  return Be(() => Ue.post(e, a), l);
}
function fe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ye = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), kt = ["onKeydown"], Et = { class: "work-stack work-tight" }, xt = { class: "work-row work-wrap" }, _t = ["id"], Ot = /* @__PURE__ */ ue({
  __name: "AddDefinitionRow",
  props: {
    action: {},
    label: {},
    maxlength: {},
    regular: { type: Boolean },
    openOnEntry: { type: Boolean },
    validate: { type: Function }
  },
  emits: ["open", "add", "cancel"],
  setup(e, { emit: a }) {
    const l = e, c = a, f = Y(), p = Y(!1), o = Y(""), r = Ne(), n = ee(() => o.value.trim()), t = ee(() => n.value ? l.validate?.(n.value) : void 0);
    async function d() {
      c("open"), p.value = !0, await _e(), f.value?.querySelector("input")?.focus();
    }
    async function u() {
      o.value = "", p.value = !1, await _e(), f.value?.querySelector("button")?.focus();
    }
    function h() {
      !n.value || t.value || (c("add", n.value), u());
    }
    function i() {
      c("cancel"), u();
    }
    return re(() => l.openOnEntry, (s, m) => {
      s ? d() : m && p.value && u();
    }, { immediate: !0 }), (s, m) => (P(), W("div", {
      ref_key: "row",
      ref: f,
      class: "work-add-definition"
    }, [
      p.value ? (P(), W("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: Te(Me(i, ["stop", "prevent"]), ["esc"])
      }, [
        Q("label", Et, [
          oe(q(e.label) + " ", 1),
          te(F(Fe), {
            modelValue: o.value,
            "onUpdate:modelValue": m[0] || (m[0] = (b) => o.value = b),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!t.value,
            "aria-describedby": t.value ? F(r) : void 0,
            onKeydown: Te(Me(h, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        le(s.$slots, "default"),
        Q("div", xt, [
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
            onClick: i
          }, null, 8, ["size"])
        ]),
        t.value ? (P(), W("p", {
          key: 0,
          id: F(r),
          class: "work-error work-small",
          role: "status"
        }, q(t.value), 9, _t)) : X("", !0)
      ], 40, kt)) : (P(), K(F(pe), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: e.regular ? void 0 : "small",
        onClick: d
      }, {
        icon: ae(() => [
          te(F(ot), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["label", "size"]))
    ], 512));
  }
}), Nt = /* @__PURE__ */ ue({
  __name: "Disclosure",
  props: /* @__PURE__ */ tt({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = et(e, "open");
    return (l, c) => (P(), K(F(lt), {
      class: "kx-disclosure",
      value: a.value ? "content" : void 0,
      "onUpdate:value": c[0] || (c[0] = (f) => a.value = f === "content")
    }, {
      default: ae(() => [
        te(F(ct), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: ae(() => [
            te(F(ut), { class: "kx-disclosure-toggle" }, {
              default: ae(() => [
                oe(q(e.label), 1)
              ]),
              _: 1
            }),
            te(F(dt), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: ae(() => [
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
}), jt = { class: "work-stack work-tight" }, It = {
  key: 0,
  class: "work-small work-muted"
}, Ct = {
  key: 1,
  role: "alert",
  class: "work-error"
}, Lt = { class: "work-json-example" }, At = /* @__PURE__ */ ue({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {},
    commit: { type: Function }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const l = e, c = a, f = Y(""), p = Y("");
    re(() => l.modelValue, (r) => {
      f.value = r === void 0 ? "" : JSON.stringify(r, null, 2), p.value = "", c("validity", !0);
    }, { immediate: !0 }), je(() => c("validity", !0));
    function o(r) {
      f.value = r;
      try {
        const n = r.trim() ? JSON.parse(r) : void 0;
        if (n !== void 0 && l.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && l.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        if (l.commit) {
          const t = l.commit(n);
          if (t) throw new Error(t);
        } else c("update:modelValue", n);
        p.value = "", c("validity", !0);
      } catch (n) {
        p.value = n instanceof Error ? n.message : "Invalid JSON.", c("validity", !1);
      }
    }
    return (r, n) => (P(), K(Nt, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: ae(() => [
        Q("label", jt, [
          Q("span", null, q(e.label), 1),
          e.hint ? (P(), W("span", It, q(e.hint), 1)) : X("", !0),
          te(F(ft), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: f.value,
            "aria-invalid": !!p.value,
            onInput: n[0] || (n[0] = (t) => o(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          p.value ? (P(), W("span", Ct, q(p.value), 1)) : X("", !0)
        ]),
        n[1] || (n[1] = Q("p", { class: "work-small work-muted" }, "Example", -1)),
        Q("pre", Lt, q(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), xe = /* @__PURE__ */ new Map();
function be(e, a = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((c) => be(c, a)).join(", ");
  if (typeof e == "string") return a.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const l = e;
  for (const c of ["display_name", "displayName", "name", "label"]) if (typeof l[c] == "string" && l[c] && !ye(l[c])) return l[c];
  return a.get(`${l.kind ?? "user"}:${l.id}`) ?? (typeof l.email == "string" && l.email ? l.email : l.kind === "group" ? "Unavailable group" : typeof l.id == "string" ? be(l.id, a) : "Unavailable person");
}
function Tt(e) {
  if (Array.isArray(e)) return e.flatMap(Tt);
  if (typeof e == "string" && e) return [{ kind: "user", id: e }];
  if (!e || typeof e != "object") return [];
  const a = e;
  return typeof a.id == "string" && (a.kind === "user" || a.kind === "group") ? [{ kind: a.kind, id: a.id }] : [];
}
async function Mt(e, a) {
  const l = [...new Map(a.map((r) => [`${r.kind}:${r.id}`, { type: r.kind, id: r.id }])).values()].sort((r, n) => `${r.type}:${r.id}`.localeCompare(`${n.type}:${n.id}`)), c = JSON.stringify([e, l]), f = xe.get(c);
  if (f) return f;
  const o = (async () => {
    const r = /* @__PURE__ */ new Map();
    for (let n = 0; n < l.length; n += 200) {
      const t = await se(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: l.slice(n, n + 200) }, "Display names");
      for (const d of t.principals) d.label.trim() && !ye(d.label) && d.label !== d.id && r.set(`${d.type}:${d.id}`, d.label.trim());
    }
    return r;
  })();
  xe.set(c, o);
  try {
    return await o;
  } finally {
    xe.delete(c);
  }
}
function Rt(e, a) {
  const l = Y(/* @__PURE__ */ new Map()), c = Y("");
  let f = 0;
  return re([e, a], async ([p, o]) => {
    const r = ++f;
    if (l.value = /* @__PURE__ */ new Map(), c.value = "", !(!p || !o.length))
      try {
        const n = await Mt(p, o);
        r === f && (l.value = n);
      } catch (n) {
        r === f && (c.value = Ie(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), nt(() => {
    f++, l.value.clear();
  }), {
    labels: l,
    error: c,
    label: (p) => be(p, l.value),
    remember: (p, o) => {
      o.trim() && !ye(o) && o !== p.id && l.value.set(`${p.kind}:${p.id}`, o.trim());
    }
  };
}
function we(e) {
  if (ye(e)) return "Untitled";
  const a = e.replace(/[_-]+/g, " ");
  return a.charAt(0).toUpperCase() + a.slice(1);
}
function gn(e) {
  return e.title?.trim() || we(e.code);
}
function We(e, a, l = be) {
  return e == null ? "—" : a?.type === "principal" ? l(e) : Array.isArray(e) ? e.map((c) => We(c, a, l)).join(", ") : a?.type === "option" && typeof e == "string" ? a.options?.find((c) => c.id === e)?.label || we(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (a?.form === "ref" || a?.type === "item") && "unavailable" in e ? "Unavailable" : a?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : a?.form === "ref" && "ref" in e && Array.isArray(e.ref) || a?.form === "ref" && "id" in e && typeof e.id == "string" || a?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function bn(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function yn(e, a) {
  const l = Rt(e, a);
  return {
    display: (c, f) => We(c, f, l.label),
    principalLabel: l.label,
    rememberPrincipal: l.remember,
    nameError: l.error,
    nameLabels: l.labels
  };
}
function ze(e) {
  return Object.entries(fe(e.properties)).map(([a, l]) => {
    const c = fe(l);
    return { key: a, title: typeof c.title == "string" && c.title.trim() ? c.title : we(a), description: typeof c.description == "string" ? c.description : "", required: Array.isArray(e.required) && e.required.includes(a), schema: c };
  });
}
const Oe = (e) => e.type === "array" && fe(e.items).type === "string";
function St(e, a, l = !0) {
  const c = {};
  for (const f of ze(e)) {
    const p = a[f.key] ?? (l ? f.schema.default : void 0), o = f.schema;
    let r = "";
    if (p == null)
      f.required && (r = "A value is required.");
    else if (Array.isArray(o.enum) && !o.enum.includes(p)) r = "Choose one of the available values.";
    else if (o.type === "integer" || o.type === "number")
      typeof p != "number" || !Number.isFinite(p) || o.type === "integer" && !Number.isInteger(p) ? r = o.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof o.minimum == "number" && p < o.minimum ? r = `Enter at least ${o.minimum}.` : typeof o.maximum == "number" && p > o.maximum && (r = `Enter at most ${o.maximum}.`);
    else if (o.type === "boolean" && typeof p != "boolean") r = "Choose on or off.";
    else if (o.type === "string") {
      if (typeof p != "string") r = "Enter text.";
      else if (typeof o.minLength == "number" && p.length < o.minLength) r = `Enter at least ${o.minLength} characters.`;
      else if (typeof o.maxLength == "number" && p.length > o.maxLength) r = `Enter at most ${o.maxLength} characters.`;
      else if (typeof o.pattern == "string")
        try {
          new RegExp(o.pattern).test(p) || (r = "Use the required format.");
        } catch {
          r = "The declared format is unavailable.";
        }
    } else if (o.type === "array") {
      if (!Array.isArray(p)) r = "Enter a list.";
      else if (typeof o.maxItems == "number" && p.length > o.maxItems) r = `Use at most ${o.maxItems} entries.`;
      else if (typeof o.minItems == "number" && p.length < o.minItems) r = `Use at least ${o.minItems} entries.`;
      else if (o.uniqueItems && new Set(p).size !== p.length) r = "Remove duplicate entries.";
      else if (Oe(o)) {
        const n = fe(o.items);
        p.some((t) => typeof t != "string" || typeof n.minLength == "number" && t.length < n.minLength || typeof n.maxLength == "number" && t.length > n.maxLength) && (r = "Each entry must match the declared text length.");
      }
    } else o.type === "object" && (typeof p != "object" || Array.isArray(p)) && (r = "Enter an object.");
    r && (c[f.key] = r);
  }
  return c;
}
const Vt = { class: "work-stack" }, $t = ["inert", "schema", "config"], Dt = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Pt = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Ft = { class: "work-config-fields" }, Ut = {
  key: 0,
  class: "work-config-label"
}, Gt = {
  key: 0,
  class: "work-muted"
}, Bt = ["for"], Wt = {
  key: 0,
  class: "work-muted"
}, zt = {
  key: 3,
  class: "work-config-chips"
}, qt = {
  key: 9,
  class: "work-muted work-small"
}, Yt = {
  key: 10,
  class: "work-muted work-small"
}, Jt = {
  key: 11,
  role: "alert",
  class: "work-error work-small"
}, wn = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    suggestDefaults: { type: Boolean }
  },
  emits: ["update:modelValue", "validity", "validation-message"],
  setup(e, { emit: a }) {
    const l = e, c = a, f = Y(/* @__PURE__ */ new Set()), p = Y(!1), o = Y(!1), r = Ne(), n = ee(() => ze(l.schema)), t = ee(() => St(l.schema, l.modelValue, !l.suggestDefaults)), d = ee(() => n.value.filter((v) => typeof v.schema.picker == "string")), u = ee(() => n.value.filter((v) => typeof v.schema.picker != "string")), h = ee(() => ({ ...l.schema, properties: Object.fromEntries(d.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(l.schema.required) ? l.schema.required.filter((v) => d.value.some((O) => O.key === v)) : [] })), i = ee(() => Object.fromEntries(d.value.map((v) => [v.key, l.modelValue[v.key]]))), s = ee(() => !Object.keys(t.value).length && !f.value.size && (!d.value.length || p.value)), m = ee(() => {
      for (const v of n.value) {
        if (t.value[v.key]) return v.title + ": " + t.value[v.key];
        if (f.value.has(v.key)) return v.title + ": Enter valid JSON.";
      }
      return s.value ? "" : "Open plugin settings to check the configuration widget.";
    });
    re(s, (v) => c("validity", v), { immediate: !0 }), re(m, (v) => c("validation-message", v), { immediate: !0 });
    async function b() {
      o.value = !0, p.value = await ht("wc-schema-form"), o.value = !1;
    }
    re(() => d.value.length > 0, (v) => {
      v && b();
    }, { immediate: !0 }), je(() => {
      c("validity", !0), c("validation-message", "");
    });
    function _(v, O) {
      return l.modelValue[v] ?? (l.suggestDefaults ? void 0 : O);
    }
    function I(v, O) {
      const g = { ...l.modelValue };
      O == null ? delete g[v] : g[v] = O, c("update:modelValue", g);
    }
    function w(v) {
      const O = l.modelValue[v];
      return Array.isArray(O) ? O.filter((g) => typeof g == "string") : [];
    }
    function N(v, O) {
      O ? f.value.delete(v) : f.value.add(v);
    }
    function k(v) {
      c("update:modelValue", { ...l.modelValue, ...fe(v.detail) });
    }
    return (v, O) => (P(), W("div", Vt, [
      d.value.length && p.value ? (P(), W("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(h.value),
        config: JSON.stringify(i.value),
        onConfigChanged: k
      }, null, 40, $t)) : d.value.length && o.value ? (P(), W("p", Dt, "The configuration widget is loading.")) : d.value.length ? (P(), W("p", Pt, [
        O[0] || (O[0] = oe("The configuration widget is unavailable.", -1)),
        te(F(pe), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: b
        })
      ])) : X("", !0),
      Q("div", Ft, [
        (P(!0), W(Re, null, Se(u.value, (g) => (P(), W("div", {
          key: g.key,
          class: "work-config-field"
        }, [
          F(Oe)(g.schema) ? (P(), W("span", Ut, [
            oe(q(g.title), 1),
            g.required ? (P(), W("span", Gt, " (required)")) : X("", !0)
          ])) : (P(), W("label", {
            key: 1,
            class: "work-config-label",
            for: F(r) + "-" + g.key
          }, [
            oe(q(g.title), 1),
            g.required ? (P(), W("span", Wt, " (required)")) : X("", !0)
          ], 8, Bt)),
          Array.isArray(g.schema.enum) ? (P(), K(F(Ve), {
            key: 2,
            "input-id": F(r) + "-" + g.key,
            "model-value": _(g.key, g.schema.default),
            options: g.schema.enum,
            appendTo: "self",
            "aria-label": g.title,
            "aria-required": g.required || void 0,
            disabled: e.disabled,
            "onUpdate:modelValue": (A) => I(g.key, A)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : F(Oe)(g.schema) ? (P(), W("div", zt, [
            (P(!0), W(Re, null, Se(w(g.key), (A, S) => (P(), K(F(at), {
              key: S,
              label: A,
              removable: !e.disabled,
              onRemove: (y) => I(g.key, w(g.key).filter((E, j) => j !== S))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            e.disabled ? X("", !0) : (P(), K(Ot, {
              key: 0,
              action: "Add value",
              label: "Add " + g.title.toLocaleLowerCase(),
              onAdd: (A) => I(g.key, [...w(g.key), A])
            }, null, 8, ["label", "onAdd"]))
          ])) : ["integer", "number"].includes(String(g.schema.type)) ? (P(), K(F(it), {
            key: 4,
            "input-id": F(r) + "-" + g.key,
            "model-value": _(g.key, g.schema.default),
            "max-fraction-digits": g.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": g.title,
            disabled: e.disabled,
            invalid: !!t.value[g.key],
            pt: { pcInputText: { root: { "aria-required": g.required || void 0 } } },
            "onUpdate:modelValue": (A) => I(g.key, A)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "pt", "onUpdate:modelValue"])) : g.schema.type === "boolean" && e.suggestDefaults ? (P(), K(F(Ve), {
            key: 5,
            "input-id": F(r) + "-" + g.key,
            "model-value": e.modelValue[g.key],
            "aria-label": g.title,
            "aria-required": g.required || void 0,
            disabled: e.disabled,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [{ label: "Use deployment setting", value: null }, { label: "On", value: !0 }, { label: "Off", value: !1 }],
            placeholder: "Use deployment setting",
            "onUpdate:modelValue": (A) => I(g.key, A)
          }, null, 8, ["input-id", "model-value", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : g.schema.type === "boolean" ? (P(), K(F(st), {
            key: 6,
            "input-id": F(r) + "-" + g.key,
            "model-value": !!_(g.key, g.schema.default),
            "aria-label": g.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (A) => I(g.key, A)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(g.schema.type)) ? (P(), K(At, {
            key: 7,
            label: g.title,
            "model-value": e.modelValue[g.key],
            shape: g.schema.type === "array" ? "array" : "object",
            example: g.schema.default ?? (g.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (A) => I(g.key, A),
            onValidity: (A) => N(g.key, A)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (P(), K(F(Fe), {
            key: 8,
            id: F(r) + "-" + g.key,
            "model-value": _(g.key, g.schema.default) ?? "",
            disabled: e.disabled,
            invalid: !!t.value[g.key],
            "aria-label": g.title,
            "aria-required": g.required || void 0,
            "onUpdate:modelValue": (A) => I(g.key, A)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "aria-required", "onUpdate:modelValue"])),
          g.description ? (P(), W("p", qt, q(g.description), 1)) : X("", !0),
          e.suggestDefaults && e.modelValue[g.key] === void 0 && g.schema.default !== void 0 ? (P(), W("p", Yt, "Suggested value: " + q(g.schema.default), 1)) : X("", !0),
          t.value[g.key] ? (P(), W("p", Jt, q(t.value[g.key]), 1)) : X("", !0)
        ]))), 128))
      ])
    ]));
  }
}), Ht = ["aria-label", "aria-busy"], vn = /* @__PURE__ */ ue({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: a }) {
    const l = e, c = a, f = Y(null);
    let p = null;
    async function o() {
      await _e();
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
    return re(() => l.visible, o), rt(o), je(() => {
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
    ], 40, Ht));
  }
}), ge = "/api/v1/work", he = (e) => `${ge}/boards/${encodeURIComponent(e)}`, qe = {
  boards: async () => {
    const e = [];
    let a;
    do {
      const l = await Ee(`${ge}/boards${a ? "?after=" + encodeURIComponent(a) : ""}`, "Boards");
      e.push(...l.boards), a = l.next;
    } while (a);
    return e;
  },
  packs: () => Ee(`${ge}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, a, l, c = {}) => se(`${ge}/boards`, { title: e, declaration: a, idempotency_key: l, ...c }, "Create board"),
  updateBoard: (e, a) => se(`${he(e)}/update`, a, "Update board"),
  schema: (e, a, l) => se(`${he(e)}/get_schema`, { generation: a, ...l ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, a) => se(`${he(e)}/query`, a, "Item choices"),
  async stateCounts(e) {
    const a = /* @__PURE__ */ Object.create(null);
    let l;
    do {
      const c = await qe.query(e, { group_by: "type", sub_group_by: "state", group_after: l, limit: 1 });
      if (c.incomplete || c.reindexing) throw new Error("Counts unavailable");
      for (const f of c.groups ?? []) {
        if (typeof f.value != "string") continue;
        const p = a[f.value] ??= /* @__PURE__ */ Object.create(null);
        for (const o of f.groups ?? []) typeof o.value == "string" && (p[o.value] = o.count);
      }
      l = c.group_after;
    } while (l);
    return a;
  },
  item: (e, a) => se(`${he(e)}/get`, { item: a }, "Item choice"),
  async options(e) {
    const a = await Ee(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
    return {
      ...a,
      guards: Array.isArray(a.guards) ? a.guards : [],
      filters: Array.isArray(a.filters) ? a.filters : [],
      board_apps: Array.isArray(a.board_apps) ? a.board_apps : []
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
const kn = (function() {
  return (/* @__PURE__ */ (function() {
    function e(a, l, c) {
      function f(r, n) {
        if (!l[r]) {
          if (!a[r]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(r, !0);
            if (p) return p(r, !0);
            var d = new Error("Cannot find module '" + r + "'");
            throw d.code = "MODULE_NOT_FOUND", d;
          }
          var u = l[r] = { exports: {} };
          a[r][0].call(u.exports, function(h) {
            var i = a[r][1][h];
            return f(i || h);
          }, u, u.exports, e, a, l, c);
        }
        return l[r].exports;
      }
      for (var p = typeof require == "function" && require, o = 0; o < c.length; o++) f(c[o]);
      return f;
    }
    return e;
  })())({ 1: [function(e, a, l) {
    a.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, a, l) {
    let c = e("./greedy-fas"), f = e("./util").uniqueId;
    a.exports = { run: p, undo: r };
    function p(n) {
      (n.graph().acyclicer === "greedy" ? c(n, d(n)) : o(n)).forEach((u) => {
        let h = n.edge(u);
        n.removeEdge(u), h.forwardName = u.name, h.reversed = !0, n.setEdge(u.w, u.v, h, f("rev"));
      });
      function d(u) {
        return (h) => u.edge(h).weight;
      }
    }
    function o(n) {
      let t = [], d = {}, u = {};
      function h(i) {
        Object.hasOwn(u, i) || (u[i] = !0, d[i] = !0, n.outEdges(i).forEach((s) => {
          Object.hasOwn(d, s.w) ? t.push(s) : h(s.w);
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
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, a, l) {
    let c = e("./util");
    a.exports = f;
    function f(o) {
      function r(n) {
        let t = o.children(n), d = o.node(n);
        if (t.length && t.forEach(r), Object.hasOwn(d, "minRank")) {
          d.borderLeft = [], d.borderRight = [];
          for (let u = d.minRank, h = d.maxRank + 1; u < h; ++u)
            p(o, "borderLeft", "_bl", n, d, u), p(o, "borderRight", "_br", n, d, u);
        }
      }
      o.children().forEach(r);
    }
    function p(o, r, n, t, d, u) {
      let h = { width: 0, height: 0, rank: u, borderType: r }, i = d[r][u - 1], s = c.addDummyNode(o, "border", h, n);
      d[r][u] = s, o.setParent(s, t), i && o.setEdge(i, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, a, l) {
    a.exports = { adjust: c, undo: f };
    function c(u) {
      let h = u.graph().rankdir.toLowerCase();
      (h === "lr" || h === "rl") && p(u);
    }
    function f(u) {
      let h = u.graph().rankdir.toLowerCase();
      (h === "bt" || h === "rl") && r(u), (h === "lr" || h === "rl") && (t(u), p(u));
    }
    function p(u) {
      u.nodes().forEach((h) => o(u.node(h))), u.edges().forEach((h) => o(u.edge(h)));
    }
    function o(u) {
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
  }, {}], 5: [function(e, a, l) {
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
    function f(o) {
      o._prev._next = o._next, o._next._prev = o._prev, delete o._next, delete o._prev;
    }
    function p(o, r) {
      if (o !== "_next" && o !== "_prev")
        return r;
    }
    a.exports = c;
  }, {}], 6: [function(e, a, l) {
    let c = e("./util"), f = e("@dagrejs/graphlib").Graph;
    a.exports = { debugOrdering: p };
    function p(o) {
      let r = c.buildLayerMatrix(o), n = new f({ compound: !0, multigraph: !0 }).setGraph({});
      return o.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + o.node(t).rank);
      }), o.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), r.forEach((t, d) => {
        let u = "layer" + d;
        n.setNode(u, { rank: "same" }), t.reduce((h, i) => (n.setEdge(h, i, { style: "invis" }), i));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, a, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("./data/list");
    a.exports = o;
    let p = () => 1;
    function o(h, i) {
      if (h.nodeCount() <= 1)
        return [];
      let s = t(h, i || p);
      return r(s.graph, s.buckets, s.zeroIdx).flatMap((b) => h.outEdges(b.v, b.w));
    }
    function r(h, i, s) {
      let m = [], b = i[i.length - 1], _ = i[0], I;
      for (; h.nodeCount(); ) {
        for (; I = _.dequeue(); )
          n(h, i, s, I);
        for (; I = b.dequeue(); )
          n(h, i, s, I);
        if (h.nodeCount()) {
          for (let w = i.length - 2; w > 0; --w)
            if (I = i[w].dequeue(), I) {
              m = m.concat(n(h, i, s, I, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(h, i, s, m, b) {
      let _ = b ? [] : void 0;
      return h.inEdges(m.v).forEach((I) => {
        let w = h.edge(I), N = h.node(I.v);
        b && _.push({ v: I.v, w: I.w }), N.out -= w, d(i, s, N);
      }), h.outEdges(m.v).forEach((I) => {
        let w = h.edge(I), N = I.w, k = h.node(N);
        k.in -= w, d(i, s, k);
      }), h.removeNode(m.v), _;
    }
    function t(h, i) {
      let s = new c(), m = 0, b = 0;
      h.nodes().forEach((w) => {
        s.setNode(w, { v: w, in: 0, out: 0 });
      }), h.edges().forEach((w) => {
        let N = s.edge(w.v, w.w) || 0, k = i(w), v = N + k;
        s.setEdge(w.v, w.w, v), b = Math.max(b, s.node(w.v).out += k), m = Math.max(m, s.node(w.w).in += k);
      });
      let _ = u(b + m + 3).map(() => new f()), I = m + 1;
      return s.nodes().forEach((w) => {
        d(_, I, s.node(w));
      }), { graph: s, buckets: _, zeroIdx: I };
    }
    function d(h, i, s) {
      s.out ? s.in ? h[s.out - s.in + i].enqueue(s) : h[h.length - 1].enqueue(s) : h[0].enqueue(s);
    }
    function u(h) {
      const i = [];
      for (let s = 0; s < h; s++)
        i.push(s);
      return i;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, a, l) {
    let c = e("./acyclic"), f = e("./normalize"), p = e("./rank"), o = e("./util").normalizeRanks, r = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), d = e("./add-border-segments"), u = e("./coordinate-system"), h = e("./order"), i = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    a.exports = b;
    function b(x, C) {
      let T = C && C.debugTiming ? s.time : s.notime;
      T("layout", () => {
        let R = T("  buildLayoutGraph", () => y(x));
        T("  runLayout", () => _(R, T, C)), T("  updateInputGraph", () => I(x, R));
      });
    }
    function _(x, C, T) {
      C("    makeSpaceForEdgeLabels", () => E(x)), C("    removeSelfEdges", () => Ke(x)), C("    acyclic", () => c.run(x)), C("    nestingGraph.run", () => t.run(x)), C("    rank", () => p(s.asNonCompoundGraph(x))), C("    injectEdgeLabelProxies", () => j(x)), C("    removeEmptyRanks", () => n(x)), C("    nestingGraph.cleanup", () => t.cleanup(x)), C("    normalizeRanks", () => o(x)), C("    assignRankMinMax", () => L(x)), C("    removeEdgeLabelProxies", () => M(x)), C("    normalize.run", () => f.run(x)), C("    parentDummyChains", () => r(x)), C("    addBorderSegments", () => d(x)), C("    order", () => h(x, T)), C("    insertSelfEdges", () => Xe(x)), C("    adjustCoordinateSystem", () => u.adjust(x)), C("    position", () => i(x)), C("    positionSelfEdges", () => Qe(x)), C("    removeBorderNodes", () => ne(x)), C("    normalize.undo", () => f.undo(x)), C("    fixupEdgeLabelCoords", () => G(x)), C("    undoCoordinateSystem", () => u.undo(x)), C("    translateGraph", () => V(x)), C("    assignNodeIntersects", () => $(x)), C("    reversePoints", () => Z(x)), C("    acyclic.undo", () => c.undo(x));
    }
    function I(x, C) {
      x.nodes().forEach((T) => {
        let R = x.node(T), D = C.node(T);
        R && (R.x = D.x, R.y = D.y, R.rank = D.rank, C.children(T).length && (R.width = D.width, R.height = D.height));
      }), x.edges().forEach((T) => {
        let R = x.edge(T), D = C.edge(T);
        R.points = D.points, Object.hasOwn(D, "x") && (R.x = D.x, R.y = D.y);
      }), x.graph().width = C.graph().width, x.graph().height = C.graph().height;
    }
    let w = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], v = ["width", "height", "rank"], O = { width: 0, height: 0 }, g = ["minlen", "weight", "width", "height", "labeloffset"], A = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, S = ["labelpos"];
    function y(x) {
      let C = new m({ multigraph: !0, compound: !0 }), T = ke(x.graph());
      return C.setGraph(Object.assign({}, N, ve(T, w), s.pick(T, k))), x.nodes().forEach((R) => {
        let D = ke(x.node(R));
        const U = ve(D, v);
        Object.keys(O).forEach((B) => {
          U[B] === void 0 && (U[B] = O[B]);
        }), C.setNode(R, U), C.setParent(R, x.parent(R));
      }), x.edges().forEach((R) => {
        let D = ke(x.edge(R));
        C.setEdge(R, Object.assign({}, A, ve(D, g), s.pick(D, S)));
      }), C;
    }
    function E(x) {
      let C = x.graph();
      C.ranksep /= 2, x.edges().forEach((T) => {
        let R = x.edge(T);
        R.minlen *= 2, R.labelpos.toLowerCase() !== "c" && (C.rankdir === "TB" || C.rankdir === "BT" ? R.width += R.labeloffset : R.height += R.labeloffset);
      });
    }
    function j(x) {
      x.edges().forEach((C) => {
        let T = x.edge(C);
        if (T.width && T.height) {
          let R = x.node(C.v), U = { rank: (x.node(C.w).rank - R.rank) / 2 + R.rank, e: C };
          s.addDummyNode(x, "edge-proxy", U, "_ep");
        }
      });
    }
    function L(x) {
      let C = 0;
      x.nodes().forEach((T) => {
        let R = x.node(T);
        R.borderTop && (R.minRank = x.node(R.borderTop).rank, R.maxRank = x.node(R.borderBottom).rank, C = Math.max(C, R.maxRank));
      }), x.graph().maxRank = C;
    }
    function M(x) {
      x.nodes().forEach((C) => {
        let T = x.node(C);
        T.dummy === "edge-proxy" && (x.edge(T.e).labelRank = T.rank, x.removeNode(C));
      });
    }
    function V(x) {
      let C = Number.POSITIVE_INFINITY, T = 0, R = Number.POSITIVE_INFINITY, D = 0, U = x.graph(), B = U.marginx || 0, J = U.marginy || 0;
      function Ce(H) {
        let z = H.x, ce = H.y, Le = H.width, Ae = H.height;
        C = Math.min(C, z - Le / 2), T = Math.max(T, z + Le / 2), R = Math.min(R, ce - Ae / 2), D = Math.max(D, ce + Ae / 2);
      }
      x.nodes().forEach((H) => Ce(x.node(H))), x.edges().forEach((H) => {
        let z = x.edge(H);
        Object.hasOwn(z, "x") && Ce(z);
      }), C -= B, R -= J, x.nodes().forEach((H) => {
        let z = x.node(H);
        z.x -= C, z.y -= R;
      }), x.edges().forEach((H) => {
        let z = x.edge(H);
        z.points.forEach((ce) => {
          ce.x -= C, ce.y -= R;
        }), Object.hasOwn(z, "x") && (z.x -= C), Object.hasOwn(z, "y") && (z.y -= R);
      }), U.width = T - C + B, U.height = D - R + J;
    }
    function $(x) {
      x.edges().forEach((C) => {
        let T = x.edge(C), R = x.node(C.v), D = x.node(C.w), U, B;
        T.points ? (U = T.points[0], B = T.points[T.points.length - 1]) : (T.points = [], U = D, B = R), T.points.unshift(s.intersectRect(R, U)), T.points.push(s.intersectRect(D, B));
      });
    }
    function G(x) {
      x.edges().forEach((C) => {
        let T = x.edge(C);
        if (Object.hasOwn(T, "x"))
          switch ((T.labelpos === "l" || T.labelpos === "r") && (T.width -= T.labeloffset), T.labelpos) {
            case "l":
              T.x -= T.width / 2 + T.labeloffset;
              break;
            case "r":
              T.x += T.width / 2 + T.labeloffset;
              break;
          }
      });
    }
    function Z(x) {
      x.edges().forEach((C) => {
        let T = x.edge(C);
        T.reversed && T.points.reverse();
      });
    }
    function ne(x) {
      x.nodes().forEach((C) => {
        if (x.children(C).length) {
          let T = x.node(C), R = x.node(T.borderTop), D = x.node(T.borderBottom), U = x.node(T.borderLeft[T.borderLeft.length - 1]), B = x.node(T.borderRight[T.borderRight.length - 1]);
          T.width = Math.abs(B.x - U.x), T.height = Math.abs(D.y - R.y), T.x = U.x + T.width / 2, T.y = R.y + T.height / 2;
        }
      }), x.nodes().forEach((C) => {
        x.node(C).dummy === "border" && x.removeNode(C);
      });
    }
    function Ke(x) {
      x.edges().forEach((C) => {
        if (C.v === C.w) {
          var T = x.node(C.v);
          T.selfEdges || (T.selfEdges = []), T.selfEdges.push({ e: C, label: x.edge(C) }), x.removeEdge(C);
        }
      });
    }
    function Xe(x) {
      var C = s.buildLayerMatrix(x);
      C.forEach((T) => {
        var R = 0;
        T.forEach((D, U) => {
          var B = x.node(D);
          B.order = U + R, (B.selfEdges || []).forEach((J) => {
            s.addDummyNode(x, "selfedge", { width: J.label.width, height: J.label.height, rank: B.rank, order: U + ++R, e: J.e, label: J.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function Qe(x) {
      x.nodes().forEach((C) => {
        var T = x.node(C);
        if (T.dummy === "selfedge") {
          var R = x.node(T.e.v), D = R.x + R.width / 2, U = R.y, B = T.x - D, J = R.height / 2;
          x.setEdge(T.e, T.label), x.removeNode(C), T.label.points = [{ x: D + 2 * B / 3, y: U - J }, { x: D + 5 * B / 6, y: U - J }, { x: D + B, y: U }, { x: D + 5 * B / 6, y: U + J }, { x: D + 2 * B / 3, y: U + J }], T.label.x = T.x, T.label.y = T.y;
        }
      });
    }
    function ve(x, C) {
      return s.mapValues(s.pick(x, C), Number);
    }
    function ke(x) {
      var C = {};
      return x && Object.entries(x).forEach(([T, R]) => {
        typeof T == "string" && (T = T.toLowerCase()), C[T] = R;
      }), C;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, a, l) {
    let c = e("./util");
    a.exports = { run: f, cleanup: n };
    function f(t) {
      let d = c.addDummyNode(t, "root", {}, "_root"), u = o(t), h = Object.values(u), i = c.applyWithChunking(Math.max, h) - 1, s = 2 * i + 1;
      t.graph().nestingRoot = d, t.edges().forEach((b) => t.edge(b).minlen *= s);
      let m = r(t) + 1;
      t.children().forEach((b) => p(t, d, s, m, i, u, b)), t.graph().nodeRankFactor = s;
    }
    function p(t, d, u, h, i, s, m) {
      let b = t.children(m);
      if (!b.length) {
        m !== d && t.setEdge(d, m, { weight: 0, minlen: u });
        return;
      }
      let _ = c.addBorderNode(t, "_bt"), I = c.addBorderNode(t, "_bb"), w = t.node(m);
      t.setParent(_, m), w.borderTop = _, t.setParent(I, m), w.borderBottom = I, b.forEach((N) => {
        p(t, d, u, h, i, s, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, g = k.borderTop ? h : 2 * h, A = v !== O ? 1 : i - s[m] + 1;
        t.setEdge(_, v, { weight: g, minlen: A, nestingEdge: !0 }), t.setEdge(O, I, { weight: g, minlen: A, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(d, _, { weight: 0, minlen: i + s[m] });
    }
    function o(t) {
      var d = {};
      function u(h, i) {
        var s = t.children(h);
        s && s.length && s.forEach((m) => u(m, i + 1)), d[h] = i;
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
  }, { "./util": 27 }], 10: [function(e, a, l) {
    let c = e("./util");
    a.exports = { run: f, undo: o };
    function f(r) {
      r.graph().dummyChains = [], r.edges().forEach((n) => p(r, n));
    }
    function p(r, n) {
      let t = n.v, d = r.node(t).rank, u = n.w, h = r.node(u).rank, i = n.name, s = r.edge(n), m = s.labelRank;
      if (h === d + 1) return;
      r.removeEdge(n);
      let b, _, I;
      for (I = 0, ++d; d < h; ++I, ++d)
        s.points = [], _ = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: d }, b = c.addDummyNode(r, "edge", _, "_d"), d === m && (_.width = s.width, _.height = s.height, _.dummy = "edge-label", _.labelpos = s.labelpos), r.setEdge(t, b, { weight: s.weight }, i), I === 0 && r.graph().dummyChains.push(b), t = b;
      r.setEdge(t, u, { weight: s.weight }, i);
    }
    function o(r) {
      r.graph().dummyChains.forEach((n) => {
        let t = r.node(n), d = t.edgeLabel, u;
        for (r.setEdge(t.edgeObj, d); t.dummy; )
          u = r.successors(n)[0], r.removeNode(n), d.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (d.x = t.x, d.y = t.y, d.width = t.width, d.height = t.height), n = u, t = r.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, a, l) {
    a.exports = c;
    function c(f, p, o) {
      let r = {}, n;
      o.forEach((t) => {
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
  }, {}], 12: [function(e, a, l) {
    a.exports = c;
    function c(f, p = []) {
      return p.map((o) => {
        let r = f.inEdges(o);
        if (r.length) {
          let n = r.reduce((t, d) => {
            let u = f.edge(d), h = f.node(d.v);
            return { sum: t.sum + u.weight * h.order, weight: t.weight + u.weight };
          }, { sum: 0, weight: 0 });
          return { v: o, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: o };
      });
    }
  }, {}], 13: [function(e, a, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("../util");
    a.exports = p;
    function p(r, n, t, d) {
      d || (d = r.nodes());
      let u = o(r), h = new c({ compound: !0 }).setGraph({ root: u }).setDefaultNodeLabel((i) => r.node(i));
      return d.forEach((i) => {
        let s = r.node(i), m = r.parent(i);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (h.setNode(i), h.setParent(i, m || u), r[t](i).forEach((b) => {
          let _ = b.v === i ? b.w : b.v, I = h.edge(_, i), w = I !== void 0 ? I.weight : 0;
          h.setEdge(_, i, { weight: r.edge(b).weight + w });
        }), Object.hasOwn(s, "minRank") && h.setNode(i, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
      }), h;
    }
    function o(r) {
      for (var n; r.hasNode(n = f.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, a, l) {
    let c = e("../util").zipObject;
    a.exports = f;
    function f(o, r) {
      let n = 0;
      for (let t = 1; t < r.length; ++t)
        n += p(o, r[t - 1], r[t]);
      return n;
    }
    function p(o, r, n) {
      let t = c(n, n.map((m, b) => b)), d = r.flatMap((m) => o.outEdges(m).map((b) => ({ pos: t[b.w], weight: o.edge(b).weight })).sort((b, _) => b.pos - _.pos)), u = 1;
      for (; u < n.length; ) u <<= 1;
      let h = 2 * u - 1;
      u -= 1;
      let i = new Array(h).fill(0), s = 0;
      return d.forEach((m) => {
        let b = m.pos + u;
        i[b] += m.weight;
        let _ = 0;
        for (; b > 0; )
          b % 2 && (_ += i[b + 1]), b = b - 1 >> 1, i[b] += m.weight;
        s += m.weight * _;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, a, l) {
    let c = e("./init-order"), f = e("./cross-count"), p = e("./sort-subgraph"), o = e("./build-layer-graph"), r = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    a.exports = d;
    function d(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, d);
        return;
      }
      let b = t.maxRank(s), _ = u(s, t.range(1, b + 1), "inEdges"), I = u(s, t.range(b - 1, -1, -1), "outEdges"), w = c(s);
      if (i(s, w), m && m.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let v = 0, O = 0; O < 4; ++v, ++O) {
        h(v % 2 ? _ : I, v % 4 >= 2), w = t.buildLayerMatrix(s);
        let g = f(s, w);
        g < N && (O = 0, k = Object.assign({}, w), N = g);
      }
      i(s, k);
    }
    function u(s, m, b) {
      const _ = /* @__PURE__ */ new Map(), I = (w, N) => {
        _.has(w) || _.set(w, []), _.get(w).push(N);
      };
      for (const w of s.nodes()) {
        const N = s.node(w);
        if (typeof N.rank == "number" && I(N.rank, w), typeof N.minRank == "number" && typeof N.maxRank == "number")
          for (let k = N.minRank; k <= N.maxRank; k++)
            k !== N.rank && I(k, w);
      }
      return m.map(function(w) {
        return o(s, w, b, _.get(w) || []);
      });
    }
    function h(s, m) {
      let b = new n();
      s.forEach(function(_) {
        let I = _.graph().root, w = p(_, I, b, m);
        w.vs.forEach((N, k) => _.node(N).order = k), r(_, b, w.vs);
      });
    }
    function i(s, m) {
      Object.values(m).forEach((b) => b.forEach((_, I) => s.node(_).order = I));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, a, l) {
    let c = e("../util");
    a.exports = f;
    function f(p) {
      let o = {}, r = p.nodes().filter((i) => !p.children(i).length), n = r.map((i) => p.node(i).rank), t = c.applyWithChunking(Math.max, n), d = c.range(t + 1).map(() => []);
      function u(i) {
        if (o[i]) return;
        o[i] = !0;
        let s = p.node(i);
        d[s.rank].push(i), p.successors(i).forEach(u);
      }
      return r.sort((i, s) => p.node(i).rank - p.node(s).rank).forEach(u), d;
    }
  }, { "../util": 27 }], 17: [function(e, a, l) {
    let c = e("../util");
    a.exports = f;
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
          h.merged || (h.barycenter === void 0 || u.barycenter === void 0 || h.barycenter >= u.barycenter) && o(u, h);
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
    function o(r, n) {
      let t = 0, d = 0;
      r.weight && (t += r.barycenter * r.weight, d += r.weight), n.weight && (t += n.barycenter * n.weight, d += n.weight), r.vs = n.vs.concat(r.vs), r.barycenter = t / d, r.weight = d, r.i = Math.min(n.i, r.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, a, l) {
    let c = e("./barycenter"), f = e("./resolve-conflicts"), p = e("./sort");
    a.exports = o;
    function o(t, d, u, h) {
      let i = t.children(d), s = t.node(d), m = s ? s.borderLeft : void 0, b = s ? s.borderRight : void 0, _ = {};
      m && (i = i.filter((k) => k !== m && k !== b));
      let I = c(t, i);
      I.forEach((k) => {
        if (t.children(k.v).length) {
          let v = o(t, k.v, u, h);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let w = f(I, u);
      r(w, _);
      let N = p(w, h);
      if (m && (N.vs = [m, N.vs, b].flat(!0), t.predecessors(m).length)) {
        let k = t.node(t.predecessors(m)[0]), v = t.node(t.predecessors(b)[0]);
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
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, a, l) {
    let c = e("../util");
    a.exports = f;
    function f(r, n) {
      let t = c.partition(r, (_) => Object.hasOwn(_, "barycenter")), d = t.lhs, u = t.rhs.sort((_, I) => I.i - _.i), h = [], i = 0, s = 0, m = 0;
      d.sort(o(!!n)), m = p(h, u, m), d.forEach((_) => {
        m += _.vs.length, h.push(_.vs), i += _.barycenter * _.weight, s += _.weight, m = p(h, u, m);
      });
      let b = { vs: h.flat(!0) };
      return s && (b.barycenter = i / s, b.weight = s), b;
    }
    function p(r, n, t) {
      let d;
      for (; n.length && (d = n[n.length - 1]).i <= t; )
        n.pop(), r.push(d.vs), t++;
      return t;
    }
    function o(r) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : r ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, a, l) {
    a.exports = c;
    function c(o) {
      let r = p(o);
      o.graph().dummyChains.forEach((n) => {
        let t = o.node(n), d = t.edgeObj, u = f(o, r, d.v, d.w), h = u.path, i = u.lca, s = 0, m = h[s], b = !0;
        for (; n !== d.w; ) {
          if (t = o.node(n), b) {
            for (; (m = h[s]) !== i && o.node(m).maxRank < t.rank; )
              s++;
            m === i && (b = !1);
          }
          if (!b) {
            for (; s < h.length - 1 && o.node(m = h[s + 1]).minRank <= t.rank; )
              s++;
            m = h[s];
          }
          o.setParent(n, m), n = o.successors(n)[0];
        }
      });
    }
    function f(o, r, n, t) {
      let d = [], u = [], h = Math.min(r[n].low, r[t].low), i = Math.max(r[n].lim, r[t].lim), s, m;
      s = n;
      do
        s = o.parent(s), d.push(s);
      while (s && (r[s].low > h || i > r[s].lim));
      for (m = s, s = t; (s = o.parent(s)) !== m; )
        u.push(s);
      return { path: d.concat(u.reverse()), lca: m };
    }
    function p(o) {
      let r = {}, n = 0;
      function t(d) {
        let u = n;
        o.children(d).forEach(t), r[d] = { low: u, lim: n++ };
      }
      return o.children().forEach(t), r;
    }
  }, {}], 21: [function(e, a, l) {
    let c = e("@dagrejs/graphlib").Graph, f = e("../util");
    a.exports = { positionX: b, findType1Conflicts: p, findType2Conflicts: o, addConflict: n, hasConflict: t, verticalAlignment: d, horizontalCompaction: u, alignCoordinates: s, findSmallestWidthAlignment: i, balance: m };
    function p(w, N) {
      let k = {};
      function v(O, g) {
        let A = 0, S = 0, y = O.length, E = g[g.length - 1];
        return g.forEach((j, L) => {
          let M = r(w, j), V = M ? w.node(M).order : y;
          (M || j === E) && (g.slice(S, L + 1).forEach(($) => {
            w.predecessors($).forEach((G) => {
              let Z = w.node(G), ne = Z.order;
              (ne < A || V < ne) && !(Z.dummy && w.node($).dummy) && n(k, G, $);
            });
          }), S = L + 1, A = V);
        }), g;
      }
      return N.length && N.reduce(v), k;
    }
    function o(w, N) {
      let k = {};
      function v(g, A, S, y, E) {
        let j;
        f.range(A, S).forEach((L) => {
          j = g[L], w.node(j).dummy && w.predecessors(j).forEach((M) => {
            let V = w.node(M);
            V.dummy && (V.order < y || V.order > E) && n(k, M, j);
          });
        });
      }
      function O(g, A) {
        let S = -1, y, E = 0;
        return A.forEach((j, L) => {
          if (w.node(j).dummy === "border") {
            let M = w.predecessors(j);
            M.length && (y = w.node(M[0]).order, v(A, E, L, S, y), E = L, S = y);
          }
          v(A, E, A.length, y, g.length);
        }), A;
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
      let O = {}, g = {}, A = {};
      return N.forEach((S) => {
        S.forEach((y, E) => {
          O[y] = y, g[y] = y, A[y] = E;
        });
      }), N.forEach((S) => {
        let y = -1;
        S.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((M, V) => A[M] - A[V]);
            let L = (j.length - 1) / 2;
            for (let M = Math.floor(L), V = Math.ceil(L); M <= V; ++M) {
              let $ = j[M];
              g[E] === E && y < A[$] && !t(k, E, $) && (g[$] = E, g[E] = O[E] = O[$], y = A[$]);
            }
          }
        });
      }), { root: O, align: g };
    }
    function u(w, N, k, v, O) {
      let g = {}, A = h(w, N, k, O), S = O ? "borderLeft" : "borderRight";
      function y(L, M) {
        let V = A.nodes(), $ = V.pop(), G = {};
        for (; $; )
          G[$] ? L($) : (G[$] = !0, V.push($), V = V.concat(M($))), $ = V.pop();
      }
      function E(L) {
        g[L] = A.inEdges(L).reduce((M, V) => Math.max(M, g[V.v] + A.edge(V)), 0);
      }
      function j(L) {
        let M = A.outEdges(L).reduce(($, G) => Math.min($, g[G.w] - A.edge(G)), Number.POSITIVE_INFINITY), V = w.node(L);
        M !== Number.POSITIVE_INFINITY && V.borderType !== S && (g[L] = Math.max(g[L], M));
      }
      return y(E, A.predecessors.bind(A)), y(j, A.successors.bind(A)), Object.keys(v).forEach((L) => g[L] = g[k[L]]), g;
    }
    function h(w, N, k, v) {
      let O = new c(), g = w.graph(), A = _(g.nodesep, g.edgesep, v);
      return N.forEach((S) => {
        let y;
        S.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), y) {
            var L = k[y], M = O.edge(L, j);
            O.setEdge(L, j, Math.max(A(w, E, y), M || 0));
          }
          y = E;
        });
      }), O;
    }
    function i(w, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, g = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([S, y]) => {
          let E = I(w, S) / 2;
          O = Math.max(y + E, O), g = Math.min(y - E, g);
        });
        const A = O - g;
        return A < k[0] && (k = [A, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(w, N) {
      let k = Object.values(N), v = f.applyWithChunking(Math.min, k), O = f.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((g) => {
        ["l", "r"].forEach((A) => {
          let S = g + A, y = w[S];
          if (y === N) return;
          let E = Object.values(y), j = v - f.applyWithChunking(Math.min, E);
          A !== "l" && (j = O - f.applyWithChunking(Math.max, E)), j && (w[S] = f.mapValues(y, (L) => L + j));
        });
      });
    }
    function m(w, N) {
      return f.mapValues(w.ul, (k, v) => {
        if (N)
          return w[N.toLowerCase()][v];
        {
          let O = Object.values(w).map((g) => g[v]).sort((g, A) => g - A);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function b(w) {
      let N = f.buildLayerMatrix(w), k = Object.assign(p(w, N), o(w, N)), v = {}, O;
      ["u", "d"].forEach((A) => {
        O = A === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((S) => {
          S === "r" && (O = O.map((L) => Object.values(L).reverse()));
          let y = (A === "u" ? w.predecessors : w.successors).bind(w), E = d(w, O, k, y), j = u(w, O, E.root, E.align, S === "r");
          S === "r" && (j = f.mapValues(j, (L) => -L)), v[A + S] = j;
        });
      });
      let g = i(w, v);
      return s(v, g), m(v, w.graph().align);
    }
    function _(w, N, k) {
      return (v, O, g) => {
        let A = v.node(O), S = v.node(g), y = 0, E;
        if (y += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              E = -A.width / 2;
              break;
            case "r":
              E = A.width / 2;
              break;
          }
        if (E && (y += k ? E : -E), E = 0, y += (A.dummy ? N : w) / 2, y += (S.dummy ? N : w) / 2, y += S.width / 2, Object.hasOwn(S, "labelpos"))
          switch (S.labelpos.toLowerCase()) {
            case "l":
              E = S.width / 2;
              break;
            case "r":
              E = -S.width / 2;
              break;
          }
        return E && (y += k ? E : -E), E = 0, y;
      };
    }
    function I(w, N) {
      return w.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, a, l) {
    let c = e("../util"), f = e("./bk").positionX;
    a.exports = p;
    function p(r) {
      r = c.asNonCompoundGraph(r), o(r), Object.entries(f(r)).forEach(([n, t]) => r.node(n).x = t);
    }
    function o(r) {
      let n = c.buildLayerMatrix(r), t = r.graph().ranksep, d = 0;
      n.forEach((u) => {
        const h = u.reduce((i, s) => {
          const m = r.node(s).height;
          return i > m ? i : m;
        }, 0);
        u.forEach((i) => r.node(i).y = d + h / 2), d += h + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, a, l) {
    var c = e("@dagrejs/graphlib").Graph, f = e("./util").slack;
    a.exports = p;
    function p(t) {
      var d = new c({ directed: !1 }), u = t.nodes()[0], h = t.nodeCount();
      d.setNode(u, {});
      for (var i, s; o(d, t) < h; )
        i = r(d, t), s = d.hasNode(i.v) ? f(t, i) : -f(t, i), n(d, t, s);
      return d;
    }
    function o(t, d) {
      function u(h) {
        d.nodeEdges(h).forEach((i) => {
          var s = i.v, m = h === s ? i.w : s;
          !t.hasNode(m) && !f(d, i) && (t.setNode(m, {}), t.setEdge(h, m, {}), u(m));
        });
      }
      return t.nodes().forEach(u), t.nodeCount();
    }
    function r(t, d) {
      return d.edges().reduce((h, i) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(i.v) !== t.hasNode(i.w) && (s = f(d, i)), s < h[0] ? [s, i] : h;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, d, u) {
      t.nodes().forEach((h) => d.node(h).rank += u);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, a, l) {
    var c = e("./util"), f = c.longestPath, p = e("./feasible-tree"), o = e("./network-simplex");
    a.exports = r;
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
      o(u);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, a, l) {
    var c = e("./feasible-tree"), f = e("./util").slack, p = e("./util").longestPath, o = e("@dagrejs/graphlib").alg.preorder, r = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    a.exports = t, t.initLowLimValues = i, t.initCutValues = d, t.calcCutValue = h, t.leaveEdge = m, t.enterEdge = b, t.exchangeEdges = _;
    function t(k) {
      k = n(k), p(k);
      var v = c(k);
      i(v), d(v, k);
      for (var O, g; O = m(v); )
        g = b(v, k, O), _(v, k, O, g);
    }
    function d(k, v) {
      var O = r(k, k.nodes());
      O = O.slice(0, O.length - 1), O.forEach((g) => u(k, v, g));
    }
    function u(k, v, O) {
      var g = k.node(O), A = g.parent;
      k.edge(O, A).cutvalue = h(k, v, O);
    }
    function h(k, v, O) {
      var g = k.node(O), A = g.parent, S = !0, y = v.edge(O, A), E = 0;
      return y || (S = !1, y = v.edge(A, O)), E = y.weight, v.nodeEdges(O).forEach((j) => {
        var L = j.v === O, M = L ? j.w : j.v;
        if (M !== A) {
          var V = L === S, $ = v.edge(j).weight;
          if (E += V ? $ : -$, w(k, O, M)) {
            var G = k.edge(O, M).cutvalue;
            E += V ? -G : G;
          }
        }
      }), E;
    }
    function i(k, v) {
      arguments.length < 2 && (v = k.nodes()[0]), s(k, {}, 1, v);
    }
    function s(k, v, O, g, A) {
      var S = O, y = k.node(g);
      return v[g] = !0, k.neighbors(g).forEach((E) => {
        Object.hasOwn(v, E) || (O = s(k, v, O, E, g));
      }), y.low = S, y.lim = O++, A ? y.parent = A : delete y.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function b(k, v, O) {
      var g = O.v, A = O.w;
      v.hasEdge(g, A) || (g = O.w, A = O.v);
      var S = k.node(g), y = k.node(A), E = S, j = !1;
      S.lim > y.lim && (E = y, j = !0);
      var L = v.edges().filter((M) => j === N(k, k.node(M.v), E) && j !== N(k, k.node(M.w), E));
      return L.reduce((M, V) => f(v, V) < f(v, M) ? V : M);
    }
    function _(k, v, O, g) {
      var A = O.v, S = O.w;
      k.removeEdge(A, S), k.setEdge(g.v, g.w, {}), i(k), d(k, v), I(k, v);
    }
    function I(k, v) {
      var O = k.nodes().find((A) => !v.node(A).parent), g = o(k, O);
      g = g.slice(1), g.forEach((A) => {
        var S = k.node(A).parent, y = v.edge(A, S), E = !1;
        y || (y = v.edge(S, A), E = !0), v.node(A).rank = v.node(S).rank + (E ? y.minlen : -y.minlen);
      });
    }
    function w(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, a, l) {
    const { applyWithChunking: c } = e("../util");
    a.exports = { longestPath: f, slack: p };
    function f(o) {
      var r = {};
      function n(t) {
        var d = o.node(t);
        if (Object.hasOwn(r, t))
          return d.rank;
        r[t] = !0;
        let u = o.outEdges(t).map((i) => i == null ? Number.POSITIVE_INFINITY : n(i.w) - o.edge(i).minlen);
        var h = c(Math.min, u);
        return h === Number.POSITIVE_INFINITY && (h = 0), d.rank = h;
      }
      o.sources().forEach(n);
    }
    function p(o, r) {
      return o.node(r.w).rank - o.node(r.v).rank - o.edge(r).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, a, l) {
    let c = e("@dagrejs/graphlib").Graph;
    a.exports = { addBorderNode: i, addDummyNode: f, applyWithChunking: b, asNonCompoundGraph: o, buildLayerMatrix: d, intersectRect: t, mapValues: A, maxRank: _, normalizeRanks: u, notime: N, partition: I, pick: g, predecessorWeights: n, range: O, removeEmptyRanks: h, simplify: p, successorWeights: r, time: w, uniqueId: v, zipObject: S };
    function f(y, E, j, L) {
      for (var M = L; y.hasNode(M); )
        M = v(L);
      return j.dummy = E, y.setNode(M, j), M;
    }
    function p(y) {
      let E = new c().setGraph(y.graph());
      return y.nodes().forEach((j) => E.setNode(j, y.node(j))), y.edges().forEach((j) => {
        let L = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, M = y.edge(j);
        E.setEdge(j.v, j.w, { weight: L.weight + M.weight, minlen: Math.max(L.minlen, M.minlen) });
      }), E;
    }
    function o(y) {
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
        return y.outEdges(j).forEach((M) => {
          L[M.w] = (L[M.w] || 0) + y.edge(M).weight;
        }), L;
      });
      return S(y.nodes(), E);
    }
    function n(y) {
      let E = y.nodes().map((j) => {
        let L = {};
        return y.inEdges(j).forEach((M) => {
          L[M.v] = (L[M.v] || 0) + y.edge(M).weight;
        }), L;
      });
      return S(y.nodes(), E);
    }
    function t(y, E) {
      let j = y.x, L = y.y, M = E.x - j, V = E.y - L, $ = y.width / 2, G = y.height / 2;
      if (!M && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let Z, ne;
      return Math.abs(V) * $ > Math.abs(M) * G ? (V < 0 && (G = -G), Z = G * M / V, ne = G) : (M < 0 && ($ = -$), Z = $, ne = $ * V / M), { x: j + Z, y: L + ne };
    }
    function d(y) {
      let E = O(_(y) + 1).map(() => []);
      return y.nodes().forEach((j) => {
        let L = y.node(j), M = L.rank;
        M !== void 0 && (E[M][L.order] = j);
      }), E;
    }
    function u(y) {
      let E = y.nodes().map((L) => {
        let M = y.node(L).rank;
        return M === void 0 ? Number.MAX_VALUE : M;
      }), j = b(Math.min, E);
      y.nodes().forEach((L) => {
        let M = y.node(L);
        Object.hasOwn(M, "rank") && (M.rank -= j);
      });
    }
    function h(y) {
      let E = y.nodes().map(($) => y.node($).rank), j = b(Math.min, E), L = [];
      y.nodes().forEach(($) => {
        let G = y.node($).rank - j;
        L[G] || (L[G] = []), L[G].push($);
      });
      let M = 0, V = y.graph().nodeRankFactor;
      Array.from(L).forEach(($, G) => {
        $ === void 0 && G % V !== 0 ? --M : $ !== void 0 && M && $.forEach((Z) => y.node(Z).rank += M);
      });
    }
    function i(y, E, j, L) {
      let M = { width: 0, height: 0 };
      return arguments.length >= 4 && (M.rank = j, M.order = L), f(y, "border", M, E);
    }
    function s(y, E = m) {
      const j = [];
      for (let L = 0; L < y.length; L += E) {
        const M = y.slice(L, L + E);
        j.push(M);
      }
      return j;
    }
    const m = 65535;
    function b(y, E) {
      if (E.length > m) {
        const j = s(E);
        return y.apply(null, j.map((L) => y.apply(null, L)));
      } else
        return y.apply(null, E);
    }
    function _(y) {
      const j = y.nodes().map((L) => {
        let M = y.node(L).rank;
        return M === void 0 ? Number.MIN_VALUE : M;
      });
      return b(Math.max, j);
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
      const M = [];
      for (let V = y; L(V); V += j)
        M.push(V);
      return M;
    }
    function g(y, E) {
      const j = {};
      for (const L of E)
        y[L] !== void 0 && (j[L] = y[L]);
      return j;
    }
    function A(y, E) {
      let j = E;
      return typeof E == "string" && (j = (L) => L[E]), Object.entries(y).reduce((L, [M, V]) => (L[M] = j(V, M), L), {});
    }
    function S(y, E) {
      return y.reduce((j, L, M) => (j[L] = E[M], j), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, a, l) {
    a.exports = "1.1.8";
  }, {}], 29: [function(e, a, l) {
    var c = e("./lib");
    a.exports = { Graph: c.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: c.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, a, l) {
    a.exports = c;
    function c(f) {
      var p = {}, o = [], r;
      function n(t) {
        Object.hasOwn(p, t) || (p[t] = !0, r.push(t), f.successors(t).forEach(n), f.predecessors(t).forEach(n));
      }
      return f.nodes().forEach(function(t) {
        r = [], n(t), r.length && o.push(r);
      }), o;
    }
  }, {}], 31: [function(e, a, l) {
    a.exports = c;
    function c(r, n, t) {
      Array.isArray(n) || (n = [n]);
      var d = r.isDirected() ? (s) => r.successors(s) : (s) => r.neighbors(s), u = t === "post" ? f : p, h = [], i = {};
      return n.forEach((s) => {
        if (!r.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        u(s, d, i, h);
      }), h;
    }
    function f(r, n, t, d) {
      for (var u = [[r, !1]]; u.length > 0; ) {
        var h = u.pop();
        h[1] ? d.push(h[0]) : Object.hasOwn(t, h[0]) || (t[h[0]] = !0, u.push([h[0], !0]), o(n(h[0]), (i) => u.push([i, !1])));
      }
    }
    function p(r, n, t, d) {
      for (var u = [r]; u.length > 0; ) {
        var h = u.pop();
        Object.hasOwn(t, h) || (t[h] = !0, d.push(h), o(n(h), (i) => u.push(i)));
      }
    }
    function o(r, n) {
      for (var t = r.length; t--; )
        n(r[t], t, r);
      return r;
    }
  }, {}], 32: [function(e, a, l) {
    var c = e("./dijkstra");
    a.exports = f;
    function f(p, o, r) {
      return p.nodes().reduce(function(n, t) {
        return n[t] = c(p, t, o, r), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, a, l) {
    var c = e("../data/priority-queue");
    a.exports = p;
    var f = () => 1;
    function p(r, n, t, d) {
      return o(r, String(n), t || f, d || function(u) {
        return r.outEdges(u);
      });
    }
    function o(r, n, t, d) {
      var u = {}, h = new c(), i, s, m = function(b) {
        var _ = b.v !== i ? b.v : b.w, I = u[_], w = t(b), N = s.distance + w;
        if (w < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + b + " Weight: " + w);
        N < I.distance && (I.distance = N, I.predecessor = i, h.decrease(_, N));
      };
      for (r.nodes().forEach(function(b) {
        var _ = b === n ? 0 : Number.POSITIVE_INFINITY;
        u[b] = { distance: _ }, h.add(b, _);
      }); h.size() > 0 && (i = h.removeMin(), s = u[i], s.distance !== Number.POSITIVE_INFINITY); )
        d(i).forEach(m);
      return u;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, a, l) {
    var c = e("./tarjan");
    a.exports = f;
    function f(p) {
      return c(p).filter(function(o) {
        return o.length > 1 || o.length === 1 && p.hasEdge(o[0], o[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, a, l) {
    a.exports = f;
    var c = () => 1;
    function f(o, r, n) {
      return p(o, r || c, n || function(t) {
        return o.outEdges(t);
      });
    }
    function p(o, r, n) {
      var t = {}, d = o.nodes();
      return d.forEach(function(u) {
        t[u] = {}, t[u][u] = { distance: 0 }, d.forEach(function(h) {
          u !== h && (t[u][h] = { distance: Number.POSITIVE_INFINITY });
        }), n(u).forEach(function(h) {
          var i = h.v === u ? h.w : h.v, s = r(h);
          t[u][i] = { distance: s, predecessor: u };
        });
      }), d.forEach(function(u) {
        var h = t[u];
        d.forEach(function(i) {
          var s = t[i];
          d.forEach(function(m) {
            var b = s[u], _ = h[m], I = s[m], w = b.distance + _.distance;
            w < I.distance && (I.distance = w, I.predecessor = _.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, a, l) {
    a.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, a, l) {
    var c = e("./topsort");
    a.exports = f;
    function f(p) {
      try {
        c(p);
      } catch (o) {
        if (o instanceof c.CycleException)
          return !1;
        throw o;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, a, l) {
    var c = e("./dfs");
    a.exports = f;
    function f(p, o) {
      return c(p, o, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, a, l) {
    var c = e("./dfs");
    a.exports = f;
    function f(p, o) {
      return c(p, o, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, a, l) {
    var c = e("../graph"), f = e("../data/priority-queue");
    a.exports = p;
    function p(o, r) {
      var n = new c(), t = {}, d = new f(), u;
      function h(s) {
        var m = s.v === u ? s.w : s.v, b = d.priority(m);
        if (b !== void 0) {
          var _ = r(s);
          _ < b && (t[m] = u, d.decrease(m, _));
        }
      }
      if (o.nodeCount() === 0)
        return n;
      o.nodes().forEach(function(s) {
        d.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), d.decrease(o.nodes()[0], 0);
      for (var i = !1; d.size() > 0; ) {
        if (u = d.removeMin(), Object.hasOwn(t, u))
          n.setEdge(u, t[u]);
        else {
          if (i)
            throw new Error("Input graph is not connected: " + o);
          i = !0;
        }
        o.nodeEdges(u).forEach(h);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, a, l) {
    a.exports = c;
    function c(f) {
      var p = 0, o = [], r = {}, n = [];
      function t(d) {
        var u = r[d] = { onStack: !0, lowlink: p, index: p++ };
        if (o.push(d), f.successors(d).forEach(function(s) {
          Object.hasOwn(r, s) ? r[s].onStack && (u.lowlink = Math.min(u.lowlink, r[s].index)) : (t(s), u.lowlink = Math.min(u.lowlink, r[s].lowlink));
        }), u.lowlink === u.index) {
          var h = [], i;
          do
            i = o.pop(), r[i].onStack = !1, h.push(i);
          while (d !== i);
          n.push(h);
        }
      }
      return f.nodes().forEach(function(d) {
        Object.hasOwn(r, d) || t(d);
      }), n;
    }
  }, {}], 42: [function(e, a, l) {
    function c(p) {
      var o = {}, r = {}, n = [];
      function t(d) {
        if (Object.hasOwn(r, d))
          throw new f();
        Object.hasOwn(o, d) || (r[d] = !0, o[d] = !0, p.predecessors(d).forEach(t), delete r[d], n.push(d));
      }
      if (p.sinks().forEach(t), Object.keys(o).length !== p.nodeCount())
        throw new f();
      return n;
    }
    class f extends Error {
      constructor() {
        super(...arguments);
      }
    }
    a.exports = c, c.CycleException = f;
  }, {}], 43: [function(e, a, l) {
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
        var o = this._keyIndices[p];
        if (o !== void 0)
          return this._arr[o].priority;
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
      add(p, o) {
        var r = this._keyIndices;
        if (p = String(p), !Object.hasOwn(r, p)) {
          var n = this._arr, t = n.length;
          return r[p] = t, n.push({ key: p, priority: o }), this._decrease(t), !0;
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
      decrease(p, o) {
        var r = this._keyIndices[p];
        if (o > this._arr[r].priority)
          throw new Error("New priority is greater than current priority. Key: " + p + " Old: " + this._arr[r].priority + " New: " + o);
        this._arr[r].priority = o, this._decrease(r);
      }
      _heapify(p) {
        var o = this._arr, r = 2 * p, n = r + 1, t = p;
        r < o.length && (t = o[r].priority < o[t].priority ? r : t, n < o.length && (t = o[n].priority < o[t].priority ? n : t), t !== p && (this._swap(p, t), this._heapify(t)));
      }
      _decrease(p) {
        for (var o = this._arr, r = o[p].priority, n; p !== 0 && (n = p >> 1, !(o[n].priority < r)); )
          this._swap(p, n), p = n;
      }
      _swap(p, o) {
        var r = this._arr, n = this._keyIndices, t = r[p], d = r[o];
        r[p] = d, r[o] = t, n[d.key] = p, n[t.key] = o;
      }
    }
    a.exports = c;
  }, {}], 44: [function(e, a, l) {
    var c = "\0", f = "\0", p = "";
    class o {
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
        return this.nodes().filter((s) => Object.keys(i._in[s]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var i = this;
        return this.nodes().filter((s) => Object.keys(i._out[s]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(i, s) {
        var m = arguments, b = this;
        return i.forEach(function(_) {
          m.length > 1 ? b.setNode(_, s) : b.setNode(_);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(i, s) {
        return Object.hasOwn(this._nodes, i) ? (arguments.length > 1 && (this._nodes[i] = s), this) : (this._nodes[i] = arguments.length > 1 ? s : this._defaultNodeLabelFn(i), this._isCompound && (this._parent[i] = f, this._children[i] = {}, this._children[f][i] = !0), this._in[i] = {}, this._preds[i] = {}, this._out[i] = {}, this._sucs[i] = {}, ++this._nodeCount, this);
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
        var s = this;
        if (Object.hasOwn(this._nodes, i)) {
          var m = (b) => s.removeEdge(s._edgeObjs[b]);
          delete this._nodes[i], this._isCompound && (this._removeFromParentsChildList(i), delete this._parent[i], this.children(i).forEach(function(b) {
            s.setParent(b);
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
      setParent(i, s) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (s === void 0)
          s = f;
        else {
          s += "";
          for (var m = s; m !== void 0; m = this.parent(m))
            if (m === i)
              throw new Error("Setting " + s + " as parent of " + i + " would create a cycle");
          this.setNode(s);
        }
        return this.setNode(i), this._removeFromParentsChildList(i), this._parent[i] = s, this._children[s][i] = !0, this;
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
          var s = this._parent[i];
          if (s !== f)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(i = f) {
        if (this._isCompound) {
          var s = this._children[i];
          if (s)
            return Object.keys(s);
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
        var s = this._preds[i];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(i) {
        var s = this._sucs[i];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(i) {
        var s = this.predecessors(i);
        if (s) {
          const b = new Set(s);
          for (var m of this.successors(i))
            b.add(m);
          return Array.from(b.values());
        }
      }
      isLeaf(i) {
        var s;
        return this.isDirected() ? s = this.successors(i) : s = this.neighbors(i), s.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(i) {
        var s = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        s.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([I, w]) {
          i(I) && s.setNode(I, w);
        }), Object.values(this._edgeObjs).forEach(function(I) {
          s.hasNode(I.v) && s.hasNode(I.w) && s.setEdge(I, m.edge(I));
        });
        var b = {};
        function _(I) {
          var w = m.parent(I);
          return w === void 0 || s.hasNode(w) ? (b[I] = w, w) : w in b ? b[w] : _(w);
        }
        return this._isCompound && s.nodes().forEach((I) => s.setParent(I, _(I))), s;
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
      setPath(i, s) {
        var m = this, b = arguments;
        return i.reduce(function(_, I) {
          return b.length > 1 ? m.setEdge(_, I, s) : m.setEdge(_, I), I;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var i, s, m, b, _ = !1, I = arguments[0];
        typeof I == "object" && I !== null && "v" in I ? (i = I.v, s = I.w, m = I.name, arguments.length === 2 && (b = arguments[1], _ = !0)) : (i = I, s = arguments[1], m = arguments[3], arguments.length > 2 && (b = arguments[2], _ = !0)), i = "" + i, s = "" + s, m !== void 0 && (m = "" + m);
        var w = t(this._isDirected, i, s, m);
        if (Object.hasOwn(this._edgeLabels, w))
          return _ && (this._edgeLabels[w] = b), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(i), this.setNode(s), this._edgeLabels[w] = _ ? b : this._defaultEdgeLabelFn(i, s, m);
        var N = d(this._isDirected, i, s, m);
        return i = N.v, s = N.w, Object.freeze(N), this._edgeObjs[w] = N, r(this._preds[s], i), r(this._sucs[i], s), this._in[s][w] = N, this._out[i][w] = N, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(i, s, m) {
        var b = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, s, m);
        return this._edgeLabels[b];
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
      hasEdge(i, s, m) {
        var b = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, s, m);
        return Object.hasOwn(this._edgeLabels, b);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(i, s, m) {
        var b = arguments.length === 1 ? u(this._isDirected, arguments[0]) : t(this._isDirected, i, s, m), _ = this._edgeObjs[b];
        return _ && (i = _.v, s = _.w, delete this._edgeLabels[b], delete this._edgeObjs[b], n(this._preds[s], i), n(this._sucs[i], s), delete this._in[s][b], delete this._out[i][b], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(i, s) {
        var m = this._in[i];
        if (m) {
          var b = Object.values(m);
          return s ? b.filter((_) => _.v === s) : b;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(i, s) {
        var m = this._out[i];
        if (m) {
          var b = Object.values(m);
          return s ? b.filter((_) => _.w === s) : b;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(i, s) {
        var m = this.inEdges(i, s);
        if (m)
          return m.concat(this.outEdges(i, s));
      }
    }
    function r(h, i) {
      h[i] ? h[i]++ : h[i] = 1;
    }
    function n(h, i) {
      --h[i] || delete h[i];
    }
    function t(h, i, s, m) {
      var b = "" + i, _ = "" + s;
      if (!h && b > _) {
        var I = b;
        b = _, _ = I;
      }
      return b + p + _ + p + (m === void 0 ? c : m);
    }
    function d(h, i, s, m) {
      var b = "" + i, _ = "" + s;
      if (!h && b > _) {
        var I = b;
        b = _, _ = I;
      }
      var w = { v: b, w: _ };
      return m && (w.name = m), w;
    }
    function u(h, i) {
      return t(h, i.v, i.w, i.name);
    }
    a.exports = o;
  }, {}], 45: [function(e, a, l) {
    a.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, a, l) {
    var c = e("./graph");
    a.exports = { write: f, read: r };
    function f(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: p(n), edges: o(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function p(n) {
      return n.nodes().map(function(t) {
        var d = n.node(t), u = n.parent(t), h = { v: t };
        return d !== void 0 && (h.value = d), u !== void 0 && (h.parent = u), h;
      });
    }
    function o(n) {
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
  }, { "./graph": 44 }], 47: [function(e, a, l) {
    a.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), En = ["unstarted", "started", "completed", "canceled"];
function xn(e, a) {
  let l = 1;
  const c = () => `${e.slice(0, 40 - String(l).length - 1)}_${l}`;
  for (; a.some((f) => f.id === c()); ) l++;
  return c();
}
function _n(e, a) {
  return [
    ...e.initial === a.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((l) => l.to === a.id || l.from !== "any" && l.from.includes(a.id)).map((l) => `transition ${Kt(l)}`),
    ...e.states.filter((l) => l.regions?.some((c) => c.initial === a.id)).map((l) => `lanes in ${Ye(l)}`),
    ...Object.entries(e.map ?? {}).filter(([, l]) => l === a.id).map(() => "existing item migration")
  ];
}
function On(e, a) {
  return e.states.flatMap((l) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((c) => l.run?.[c] === a.id).map((c) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[c]} handler in ${Ye(l)}`),
    ...(l.timers ?? []).filter((c) => c.then?.transition === a.id).map(() => "a timer")
  ]);
}
const Ye = (e) => e?.name || "Untitled state", Kt = (e) => e.name?.trim() || we(e.id), Nn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", jn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function In(e, a) {
  if (e.id === a.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const l = e.release_when?.approvals?.min;
    return l ? `Needs ${l} approval${l === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Je(e) : "A person moves it";
}
function Je(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Cn(e, a) {
  const l = e.release_when?.approvals?.min ?? 1, c = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${l === 1 ? "one person approves" : `${l} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Je(e)}.` : "A person chooses when to move the item on.", f = a.policy?.wip?.[e.id]?.limit;
  return c + (f !== void 0 ? ` At most ${f} at a time.` : "");
}
function Ln(e) {
  const a = e.transitions ?? [], l = [], c = /* @__PURE__ */ new Set();
  let f = e.states.find((o) => o.id === e.initial);
  const p = new Map(e.states.map((o, r) => [o.id, r]));
  for (; f && !c.has(f.id) && (l.push(f), c.add(f.id), !(f.category === "completed" || f.category === "canceled")); ) {
    const o = f, r = a.filter((t) => t.from !== "any" && t.from.includes(o.id)), n = r.find((t) => t.default) ?? r.find((t) => !c.has(t.to) && (p.get(t.to) ?? -1) > (p.get(o.id) ?? 0));
    f = e.states.find((t) => t.id === n?.to);
  }
  return l;
}
function He(e) {
  const a = e.states.find((l) => l.id === e.initial);
  return e.migration ?? (a?.kind === "automated" || a?.kind === "parallel" ? "pin" : "follow");
}
const ie = (e) => JSON.parse(JSON.stringify(e));
function An(e) {
  return e?.admin === !0;
}
function Tn(e, a, l) {
  const c = a + l;
  if (a < 0 || a >= e.length || c < 0 || c >= e.length) return;
  const [f] = e.splice(a, 1);
  e.splice(c, 0, f);
}
function Mn(e, a, l) {
  const c = a.code;
  if (c === l) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  a.code = l;
  const f = (n) => n === c ? l : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(f), n.inherit && (n.inherit = n.inherit.map(f));
  const p = (n) => {
    for (const t of n ?? []) "field" in t && t.field === c && (t.field = l);
  }, o = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = f(n.field));
  }, r = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(r);
        return;
      }
      o(n);
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
      o(t.awaiting), o(t.release_when?.approvals?.from), r(t.release_when?.when), t.require && (t.require = t.require.map(f));
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
function De({ migration: e, map: a, ...l }) {
  return JSON.stringify(l);
}
function Rn(e, a) {
  const l = ie(e);
  for (const f of l.processes ?? []) {
    const p = a.processes?.find((o) => o.id === f.id);
    if (p && De(f) !== De(p) && (f.migration = "follow"), f.map) {
      for (const [o, r] of Object.entries(f.map))
        (f.states.some((n) => n.id === o) || !f.states.some((n) => n.id === r)) && delete f.map[o];
      Object.keys(f.map).length || delete f.map;
    }
  }
  l.plugins && (l.plugins = l.plugins.map(({ use: f }) => ({ use: f })));
  for (const f of l.fields ?? [])
    f.type?.includes(":") && delete f.form;
  const c = { ...l.remove };
  a.visibility && !l.visibility ? c.visibility = !0 : delete c.visibility;
  for (const f of ["fields", "item_types", "processes", "relation_types"]) {
    const p = (a[f] ?? []).filter((o) => {
      if (f === "fields") {
        const r = o;
        return !l.fields?.some((n) => r.id !== void 0 ? n.id === r.id : n.code === r.code);
      }
      return !(l[f] ?? []).some((r) => "id" in r && r.id === ("id" in o ? o.id : void 0));
    }).map((o) => "code" in o ? o.code : o.id);
    p.length ? c[f] = [.../* @__PURE__ */ new Set([...c[f] ?? [], ...p])] : delete c[f];
  }
  return Object.keys(c).length ? l.remove = c : delete l.remove, l;
}
function Sn(e, a, l) {
  const c = JSON.stringify({ declaration: e, configs: l });
  return {
    declaration: ie(e),
    expected_generation: a,
    plugin_configs: ie(l),
    matches: (f, p, o) => a === p && c === JSON.stringify({ declaration: f, configs: o })
  };
}
function Vn(e) {
  const a = ie(e), l = [...new Set(a.declaration.item_types?.flatMap((f) => f.fields) ?? [])], c = (f) => {
    const p = l.indexOf(f);
    return p < 0 ? l.length : p;
  };
  a.declaration.fields?.sort((f, p) => c(f.code) - c(p.code));
  for (const f of a.declaration.fields ?? []) {
    const p = a.compiled.fields?.find((o) => o.code === f.code);
    f.id ??= p?.id, f.form ??= p?.form;
  }
  for (const f of a.declaration.processes ?? []) f.migration ??= a.compiled.processes?.find((p) => p.id === f.id)?.migration ?? He(f);
  return a;
}
function $n(e, a) {
  return (a.processes ?? []).filter((l) => He(l) !== "pin" && e.changes.some((c) => c.code === "process " + l.id && c.what !== "add" && c.class !== "cosmetic" && c.class !== "refused")).map((l) => l.id);
}
function Dn(e, a, l) {
  const c = [l, `item_type ${l}`, `relation ${l}`, `process ${l}`], f = e.refused.filter((p) => c.includes(p.code));
  return a === "fields" && f.push(...e.changes.filter((p) => p.code === l && p.what === "removed" && p.class === "semantic")), f.length ? f.map(Xt).join(" ") : void 0;
}
function Pn(e, a, l) {
  if (a === "fields") {
    e.fields = e.fields?.filter((c) => c.code !== l);
    for (const c of e.item_types ?? [])
      c.fields = c.fields.filter((f) => f !== l), c.inherit = c.inherit?.filter((f) => f !== l);
  } else a === "item_types" ? e.item_types = e.item_types?.filter((c) => c.id !== l) : a === "processes" ? e.processes = e.processes?.filter((c) => c.id !== l) : e.relation_types = e.relation_types?.filter((c) => c.id !== l);
}
function Xt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function Fn(e, a) {
  if (!(e instanceof de)) return [];
  const l = e.details ?? {};
  let c = typeof l.field == "string" ? l.field : "";
  if (!c) {
    const f = a.processes ?? [], p = typeof l.process != "string" && typeof l.state == "string" ? f.filter((r) => r.states.some((n) => n.id === l.state)) : [], o = typeof l.process == "string" ? f.find((r) => r.id === l.process) : p.length === 1 ? p[0] : void 0;
    o ? c = `process ${o.id}` : typeof l.item_type == "string" && (c = `item_type ${l.item_type}`);
  }
  return c ? [{ code: c, class: "refused", what: "invalid", detail: Ie(e, "The definition is invalid.") }] : [];
}
const Un = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, Pe = (e) => !("problem" in e);
function Gn(e) {
  const a = Pe(e) ? e.plugins.find((c) => c.problem && c.installed)?.problem : e.problem, l = a ? `${a.message} (Error code: ${a.code})` : Pe(e) && e.plugins.some((c) => !c.installed) ? "A required plugin is unavailable." : void 0;
  return { ...e, title: e.title ?? "Unnamed pack", icon: e.icon ?? "tabler:package-off", disabled: !!l, unavailable: l };
}
function Bn(e, a) {
  return { pack: e.id, version: e.version, expected_generation: a };
}
async function Wn(e, a) {
  const l = { ...ie(e), resolutions: ie(e.resolutions ?? {}) };
  let c = await a(l);
  return l.maps || (l.maps = ie(c.maps), c = await a(l)), { request: l, plan: c };
}
function Qt() {
  let e = 0;
  return () => {
    const a = ++e;
    return () => a === e;
  };
}
function zn() {
  const e = Y([]), a = Y(!1), l = Y(""), c = Qt();
  async function f(o = () => !0) {
    const r = c();
    l.value = "", a.value = !0;
    try {
      const n = await qe.packs();
      r() && o() && (e.value = n);
    } catch (n) {
      r() && o() && (l.value = Ie(n, "Could not load packs."));
    } finally {
      r() && (a.value = !1);
    }
  }
  function p() {
    c(), e.value = [], l.value = "", a.value = !1;
  }
  return { packs: e, loading: a, error: l, load: f, reset: p };
}
export {
  Nn as A,
  Tn as B,
  Ot as C,
  Xt as D,
  Pn as E,
  Mn as F,
  jn as G,
  de as H,
  vt as I,
  xn as J,
  Tt as K,
  Cn as L,
  On as M,
  _n as N,
  Rt as O,
  ye as P,
  Un as Q,
  ie as R,
  Wn as S,
  Bn as T,
  Rn as U,
  $n as V,
  Vn as W,
  Sn as X,
  Fn as Y,
  Dn as Z,
  vn as _,
  Pe as a,
  St as b,
  ze as c,
  wn as d,
  An as e,
  Ie as f,
  mn as g,
  kn as h,
  In as i,
  se as j,
  We as k,
  Qt as l,
  Ln as m,
  fe as n,
  gn as o,
  Gn as p,
  At as q,
  bn as r,
  Ye as s,
  Kt as t,
  zn as u,
  yn as v,
  qe as w,
  we as x,
  Nt as y,
  En as z
};
//# sourceMappingURL=usePackDiscovery-B-gbOGcR.js.map
