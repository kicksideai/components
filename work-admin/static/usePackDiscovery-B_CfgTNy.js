import { defineComponent as ue, useId as Ne, openBlock as P, createElementBlock as W, unref as F, normalizeClass as Ze, createElementVNode as ee, createTextVNode as oe, toDisplayString as Y, createCommentVNode as Z, renderSlot as le, ref as z, computed as K, watch as re, createBlock as Q, withCtx as se, createVNode as ne, withKeys as Te, withModifiers as Se, nextTick as _e, useModel as et, mergeModels as tt, onBeforeUnmount as je, onUnmounted as nt, Fragment as Me, renderList as Re, onMounted as rt } from "vue";
import pe from "primevue/button";
import Fe from "primevue/inputtext";
import it from "primevue/inputnumber";
import at from "primevue/toggleswitch";
import Ve from "primevue/select";
import st from "primevue/chip";
import { Icon as ot } from "@iconify/vue";
import lt from "primevue/accordion";
import dt from "primevue/accordioncontent";
import ut from "primevue/accordionheader";
import ct from "primevue/accordionpanel";
import ft from "primevue/textarea";
import { e as ht } from "./mount-Dm-3vIEJ.js";
import { api as Ue } from "@wippy-fe/proxy";
const pt = ["aria-labelledby"], mt = { class: "kx-railhead" }, gt = ["id"], bt = { key: 0 }, yt = { class: "kx-railhead-acts" }, vt = { class: "kx-rail-body" }, mn = /* @__PURE__ */ ue({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const s = Ne();
    return (c, u) => (P(), W("aside", {
      class: Ze(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": F(s)
    }, [
      ee("div", mt, [
        ee("span", {
          id: F(s),
          class: "kx-railhead-title"
        }, [
          oe(Y(e.title), 1),
          e.count !== void 0 ? (P(), W("b", bt, Y(e.count), 1)) : Z("", !0)
        ], 8, gt),
        ee("div", yt, [
          le(c.$slots, "actions")
        ])
      ]),
      le(c.$slots, "toolbar"),
      ee("div", vt, [
        le(c.$slots, "default")
      ])
    ], 10, pt));
  }
});
class de extends Error {
  constructor(s, c, u) {
    super(s.message ?? s.error ?? `${c} failed`), this.name = "ApiError", this.kind = s.kind, this.details = s.details, this.retryable = s.retryable, this.status = u;
  }
}
function me(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ge(e, s, c) {
  return new de({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: me(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, s, c);
}
function wt(e, s) {
  if (e instanceof de) return e;
  if (me(e) && me(e.response) && me(e.response.data)) {
    const { data: c, status: u } = e.response;
    return Ge(c, s, typeof u == "number" ? u : void 0);
  }
  return e instanceof Error ? e : new de({ kind: "UNAVAILABLE" }, s);
}
async function Be(e, s) {
  let c;
  try {
    c = (await e()).data;
  } catch (u) {
    throw wt(u, s);
  }
  if (c?.success === !0 && c.data !== void 0) return c.data;
  throw c?.success === !1 ? Ge(c, s) : new de({ kind: "INTERNAL", message: `${s}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, s);
}
const $e = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Ie(e, s) {
  const c = e instanceof de ? e.details?.code : void 0, u = e instanceof Error && e.message || s;
  return typeof c != "string" || !c.trim() ? u : `${Object.hasOwn($e, c) ? $e[c] : u}
Error code: ${c}`;
}
function Ee(e, s, c) {
  return Be(() => Ue.get(e, { params: c }), s);
}
function ae(e, s, c) {
  return Be(() => Ue.post(e, s), c);
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
  setup(e, { emit: s }) {
    const c = e, u = s, f = z(), p = z(!1), o = z(""), r = Ne(), n = K(() => o.value.trim()), t = K(() => n.value ? c.validate?.(n.value) : void 0);
    async function l() {
      u("open"), p.value = !0, await _e(), f.value?.querySelector("input")?.focus();
    }
    async function d() {
      o.value = "", p.value = !1, await _e(), f.value?.querySelector("button")?.focus();
    }
    function h() {
      !n.value || t.value || (u("add", n.value), d());
    }
    function i() {
      u("cancel"), d();
    }
    return re(() => c.openOnEntry, (a, g) => {
      a ? l() : g && p.value && d();
    }, { immediate: !0 }), (a, g) => (P(), W("div", {
      ref_key: "row",
      ref: f,
      class: "work-add-definition"
    }, [
      p.value ? (P(), W("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: Te(Se(i, ["stop", "prevent"]), ["esc"])
      }, [
        ee("label", Et, [
          oe(Y(e.label) + " ", 1),
          ne(F(Fe), {
            modelValue: o.value,
            "onUpdate:modelValue": g[0] || (g[0] = (b) => o.value = b),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!t.value,
            "aria-describedby": t.value ? F(r) : void 0,
            onKeydown: Te(Se(h, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        le(a.$slots, "default"),
        ee("div", xt, [
          ne(F(pe), {
            type: "button",
            label: e.action,
            size: e.regular ? void 0 : "small",
            disabled: !n.value || !!t.value,
            onClick: h
          }, null, 8, ["label", "size", "disabled"]),
          ne(F(pe), {
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
        }, Y(t.value), 9, _t)) : Z("", !0)
      ], 40, kt)) : (P(), Q(F(pe), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: e.regular ? void 0 : "small",
        onClick: l
      }, {
        icon: se(() => [
          ne(F(ot), {
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
    const s = et(e, "open");
    return (c, u) => (P(), Q(F(lt), {
      class: "kx-disclosure",
      value: s.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = (f) => s.value = f === "content")
    }, {
      default: se(() => [
        ne(F(ct), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: se(() => [
            ne(F(ut), { class: "kx-disclosure-toggle" }, {
              default: se(() => [
                oe(Y(e.label), 1)
              ]),
              _: 1
            }),
            ne(F(dt), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: se(() => [
                le(c.$slots, "default")
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
  setup(e, { emit: s }) {
    const c = e, u = s, f = z(""), p = z("");
    re(() => c.modelValue, (r) => {
      f.value = r === void 0 ? "" : JSON.stringify(r, null, 2), p.value = "", u("validity", !0);
    }, { immediate: !0 }), je(() => u("validity", !0));
    function o(r) {
      f.value = r;
      try {
        const n = r.trim() ? JSON.parse(r) : void 0;
        if (n !== void 0 && c.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && c.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        if (c.commit) {
          const t = c.commit(n);
          if (t) throw new Error(t);
        } else u("update:modelValue", n);
        p.value = "", u("validity", !0);
      } catch (n) {
        p.value = n instanceof Error ? n.message : "Invalid JSON.", u("validity", !1);
      }
    }
    return (r, n) => (P(), Q(Nt, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: se(() => [
        ee("label", jt, [
          ee("span", null, Y(e.label), 1),
          e.hint ? (P(), W("span", It, Y(e.hint), 1)) : Z("", !0),
          ne(F(ft), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: f.value,
            "aria-invalid": !!p.value,
            onInput: n[0] || (n[0] = (t) => o(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          p.value ? (P(), W("span", Ct, Y(p.value), 1)) : Z("", !0)
        ]),
        n[1] || (n[1] = ee("p", { class: "work-small work-muted" }, "Example", -1)),
        ee("pre", Lt, Y(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), xe = /* @__PURE__ */ new Map();
function be(e, s = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((u) => be(u, s)).join(", ");
  if (typeof e == "string") return s.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const c = e;
  for (const u of ["display_name", "displayName", "name", "label"]) if (typeof c[u] == "string" && c[u] && !ye(c[u])) return c[u];
  return s.get(`${c.kind ?? "user"}:${c.id}`) ?? (typeof c.email == "string" && c.email ? c.email : c.kind === "group" ? "Unavailable group" : typeof c.id == "string" ? be(c.id, s) : "Unavailable person");
}
function Tt(e) {
  if (Array.isArray(e)) return e.flatMap(Tt);
  if (typeof e == "string" && e) return [{ kind: "user", id: e }];
  if (!e || typeof e != "object") return [];
  const s = e;
  return typeof s.id == "string" && (s.kind === "user" || s.kind === "group") ? [{ kind: s.kind, id: s.id }] : [];
}
async function St(e, s) {
  const c = [...new Map(s.map((r) => [`${r.kind}:${r.id}`, { type: r.kind, id: r.id }])).values()].sort((r, n) => `${r.type}:${r.id}`.localeCompare(`${n.type}:${n.id}`)), u = JSON.stringify([e, c]), f = xe.get(u);
  if (f) return f;
  const o = (async () => {
    const r = /* @__PURE__ */ new Map();
    for (let n = 0; n < c.length; n += 200) {
      const t = await ae(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: c.slice(n, n + 200) }, "Display names");
      for (const l of t.principals) l.label.trim() && !ye(l.label) && l.label !== l.id && r.set(`${l.type}:${l.id}`, l.label.trim());
    }
    return r;
  })();
  xe.set(u, o);
  try {
    return await o;
  } finally {
    xe.delete(u);
  }
}
function Mt(e, s) {
  const c = z(/* @__PURE__ */ new Map()), u = z("");
  let f = 0;
  return re([e, s], async ([p, o]) => {
    const r = ++f;
    if (c.value = /* @__PURE__ */ new Map(), u.value = "", !(!p || !o.length))
      try {
        const n = await St(p, o);
        r === f && (c.value = n);
      } catch (n) {
        r === f && (u.value = Ie(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), nt(() => {
    f++, c.value.clear();
  }), {
    labels: c,
    error: u,
    label: (p) => be(p, c.value),
    remember: (p, o) => {
      o.trim() && !ye(o) && o !== p.id && c.value.set(`${p.kind}:${p.id}`, o.trim());
    }
  };
}
function ve(e) {
  if (ye(e)) return "Untitled";
  const s = e.replace(/[_-]+/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function gn(e) {
  return e.title?.trim() || ve(e.code);
}
function We(e, s, c = be) {
  return e == null ? "—" : s?.type === "principal" ? c(e) : Array.isArray(e) ? e.map((u) => We(u, s, c)).join(", ") : s?.type === "option" && typeof e == "string" ? s.options?.find((u) => u.id === e)?.label || ve(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (s?.form === "ref" || s?.type === "item") && "unavailable" in e ? "Unavailable" : s?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : s?.form === "ref" && "ref" in e && Array.isArray(e.ref) || s?.form === "ref" && "id" in e && typeof e.id == "string" || s?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function bn(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function yn(e, s) {
  const c = Mt(e, s);
  return {
    display: (u, f) => We(u, f, c.label),
    principalLabel: c.label,
    rememberPrincipal: c.remember,
    nameError: c.error,
    nameLabels: c.labels
  };
}
function ze(e) {
  return Object.entries(fe(e.properties)).map(([s, c]) => {
    const u = fe(c);
    return { key: s, title: typeof u.title == "string" && u.title.trim() ? u.title : ve(s), description: typeof u.description == "string" ? u.description : "", required: Array.isArray(e.required) && e.required.includes(s), schema: u };
  });
}
const Oe = (e) => e.type === "array" && fe(e.items).type === "string";
function Rt(e, s, c = !0) {
  const u = {};
  for (const f of ze(e)) {
    const p = s[f.key] ?? (c ? f.schema.default : void 0), o = f.schema;
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
    r && (u[f.key] = r);
  }
  return u;
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
}, vn = /* @__PURE__ */ ue({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean },
    suggestDefaults: { type: Boolean }
  },
  emits: ["update:modelValue", "validity", "widget-validity", "validation-message"],
  setup(e, { expose: s, emit: c }) {
    const u = e, f = c, p = z(/* @__PURE__ */ new Set()), o = z(!1), r = z(!1), n = z(), t = z({}), l = Ne(), d = K(() => ze(u.schema)), h = K(() => d.value.filter((y) => typeof y.schema.picker == "string")), i = K(() => d.value.filter((y) => typeof y.schema.picker != "string")), a = K(() => ({ ...u.schema, properties: Object.fromEntries(h.value.map((y) => [y.key, { ...y.schema, title: y.title }])), required: Array.isArray(u.schema.required) ? u.schema.required.filter((y) => h.value.some((x) => x.key === y)) : [] })), g = K(() => ({
      ...u.schema,
      properties: Object.fromEntries(i.value.map((y) => [y.key, y.schema]))
    })), b = K(() => Rt(g.value, u.modelValue, !u.suggestDefaults)), O = K(() => Object.fromEntries(h.value.map((y) => [y.key, u.modelValue[y.key]]))), L = K(() => !Object.keys(b.value).length && !p.value.size && (!h.value.length || o.value)), w = K(() => !h.value.length || !Object.keys(t.value).length), N = K(() => {
      for (const y of d.value) {
        if (b.value[y.key]) return y.title + ": " + b.value[y.key];
        if (t.value[y.key]) return y.title + ": " + t.value[y.key];
        if (p.value.has(y.key)) return y.title + ": Enter valid JSON.";
      }
      return L.value ? "" : "Open plugin settings to check the configuration widget.";
    });
    re([L, w], ([y, x]) => f("validity", y && x), { immediate: !0 }), re([L, w], ([y, x]) => f("widget-validity", !y || x), { immediate: !0 }), re(N, (y) => f("validation-message", y), { immediate: !0 });
    async function k() {
      r.value = !0, o.value = await ht("wc-schema-form"), r.value = !1;
    }
    re(() => h.value.length > 0, (y) => {
      y ? k() : t.value = {};
    }, { immediate: !0 }), je(() => {
      f("validity", !0), f("widget-validity", !0), f("validation-message", "");
    });
    function j(y, x) {
      return u.modelValue[y] ?? (u.suggestDefaults ? void 0 : x);
    }
    function I(y, x) {
      const m = { ...u.modelValue };
      x == null ? delete m[y] : m[y] = x, f("update:modelValue", m);
    }
    function T(y) {
      const x = u.modelValue[y];
      return Array.isArray(x) ? x.filter((m) => typeof m == "string") : [];
    }
    function S(y, x) {
      x ? p.value.delete(y) : p.value.add(y);
    }
    function V(y) {
      f("update:modelValue", { ...u.modelValue, ...fe(y.detail) });
    }
    function v(y) {
      t.value = y.detail.errors;
    }
    function E() {
      return n.value?.reportValidity();
    }
    return s({ reportValidity: E }), (y, x) => (P(), W("div", Vt, [
      h.value.length && o.value ? (P(), W("wc-schema-form", {
        key: 0,
        ref_key: "widget",
        ref: n,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(a.value),
        config: JSON.stringify(O.value),
        onConfigChanged: V,
        onValidityChanged: v
      }, null, 40, $t)) : h.value.length && r.value ? (P(), W("p", Dt, "The configuration widget is loading.")) : h.value.length ? (P(), W("p", Pt, [
        x[0] || (x[0] = oe("The configuration widget is unavailable.", -1)),
        ne(F(pe), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: k
        })
      ])) : Z("", !0),
      ee("div", Ft, [
        (P(!0), W(Me, null, Re(i.value, (m) => (P(), W("div", {
          key: m.key,
          class: "work-config-field"
        }, [
          F(Oe)(m.schema) ? (P(), W("span", Ut, [
            oe(Y(m.title), 1),
            m.required ? (P(), W("span", Gt, " (required)")) : Z("", !0)
          ])) : (P(), W("label", {
            key: 1,
            class: "work-config-label",
            for: F(l) + "-" + m.key
          }, [
            oe(Y(m.title), 1),
            m.required ? (P(), W("span", Wt, " (required)")) : Z("", !0)
          ], 8, Bt)),
          Array.isArray(m.schema.enum) ? (P(), Q(F(Ve), {
            key: 2,
            "input-id": F(l) + "-" + m.key,
            "model-value": j(m.key, m.schema.default),
            options: m.schema.enum,
            appendTo: "self",
            "aria-label": m.title,
            "aria-required": m.required || void 0,
            disabled: e.disabled,
            "onUpdate:modelValue": (M) => I(m.key, M)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : F(Oe)(m.schema) ? (P(), W("div", zt, [
            (P(!0), W(Me, null, Re(T(m.key), (M, $) => (P(), Q(F(st), {
              key: $,
              label: M,
              removable: !e.disabled,
              onRemove: (U) => I(m.key, T(m.key).filter((X, te) => te !== $))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            e.disabled ? Z("", !0) : (P(), Q(Ot, {
              key: 0,
              action: "Add value",
              label: "Add " + m.title.toLocaleLowerCase(),
              onAdd: (M) => I(m.key, [...T(m.key), M])
            }, null, 8, ["label", "onAdd"]))
          ])) : ["integer", "number"].includes(String(m.schema.type)) ? (P(), Q(F(it), {
            key: 4,
            "input-id": F(l) + "-" + m.key,
            "model-value": j(m.key, m.schema.default),
            "max-fraction-digits": m.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": m.title,
            disabled: e.disabled,
            invalid: !!b.value[m.key],
            pt: { pcInputText: { root: { "aria-required": m.required || void 0 } } },
            "onUpdate:modelValue": (M) => I(m.key, M)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "pt", "onUpdate:modelValue"])) : m.schema.type === "boolean" && e.suggestDefaults ? (P(), Q(F(Ve), {
            key: 5,
            "input-id": F(l) + "-" + m.key,
            "model-value": e.modelValue[m.key],
            "aria-label": m.title,
            "aria-required": m.required || void 0,
            disabled: e.disabled,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: [{ label: "Use deployment setting", value: null }, { label: "On", value: !0 }, { label: "Off", value: !1 }],
            placeholder: "Use deployment setting",
            "onUpdate:modelValue": (M) => I(m.key, M)
          }, null, 8, ["input-id", "model-value", "aria-label", "aria-required", "disabled", "onUpdate:modelValue"])) : m.schema.type === "boolean" ? (P(), Q(F(at), {
            key: 6,
            "input-id": F(l) + "-" + m.key,
            "model-value": !!j(m.key, m.schema.default),
            "aria-label": m.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (M) => I(m.key, M)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(m.schema.type)) ? (P(), Q(At, {
            key: 7,
            label: m.title,
            "model-value": e.modelValue[m.key],
            shape: m.schema.type === "array" ? "array" : "object",
            example: m.schema.default ?? (m.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (M) => I(m.key, M),
            onValidity: (M) => S(m.key, M)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (P(), Q(F(Fe), {
            key: 8,
            id: F(l) + "-" + m.key,
            "model-value": j(m.key, m.schema.default) ?? "",
            disabled: e.disabled,
            invalid: !!b.value[m.key],
            "aria-label": m.title,
            "aria-required": m.required || void 0,
            "onUpdate:modelValue": (M) => I(m.key, M)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "aria-required", "onUpdate:modelValue"])),
          m.description ? (P(), W("p", qt, Y(m.description), 1)) : Z("", !0),
          e.suggestDefaults && e.modelValue[m.key] === void 0 && m.schema.default !== void 0 ? (P(), W("p", Yt, "Suggested value: " + Y(m.schema.default), 1)) : Z("", !0),
          b.value[m.key] ? (P(), W("p", Jt, Y(b.value[m.key]), 1)) : Z("", !0)
        ]))), 128))
      ])
    ]));
  }
}), Ht = ["aria-label", "aria-busy"], wn = /* @__PURE__ */ ue({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: s }) {
    const c = e, u = s, f = z(null);
    let p = null;
    async function o() {
      await _e();
      const n = f.value;
      if (n)
        if (c.visible && !n.open) {
          const t = n.getRootNode();
          p = c.returnFocus ?? t.activeElement, n.showModal();
        } else !c.visible && n.open && (n.close(), p?.focus());
    }
    function r(n) {
      n.preventDefault(), c.busy || u("close");
    }
    return re(() => c.visible, o), rt(o), je(() => {
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
        e.visible && !e.busy && u("close");
      })
    }, [
      le(n.$slots, "default")
    ], 40, Ht));
  }
}), ge = "/api/v1/work", he = (e) => `${ge}/boards/${encodeURIComponent(e)}`, qe = {
  boards: async () => {
    const e = [];
    let s;
    do {
      const c = await Ee(`${ge}/boards${s ? "?after=" + encodeURIComponent(s) : ""}`, "Boards");
      e.push(...c.boards), s = c.next;
    } while (s);
    return e;
  },
  packs: () => Ee(`${ge}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, s, c, u = {}) => ae(`${ge}/boards`, { title: e, declaration: s, idempotency_key: c, ...u }, "Create board"),
  updateBoard: (e, s) => ae(`${he(e)}/update`, s, "Update board"),
  schema: (e, s, c) => ae(`${he(e)}/get_schema`, { generation: s, ...c ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, s) => ae(`${he(e)}/query`, s, "Item choices"),
  async stateCounts(e) {
    const s = /* @__PURE__ */ Object.create(null);
    let c;
    do {
      const u = await qe.query(e, { group_by: "type", sub_group_by: "state", group_after: c, limit: 1 });
      if (u.incomplete || u.reindexing) throw new Error("Counts unavailable");
      for (const f of u.groups ?? []) {
        if (typeof f.value != "string") continue;
        const p = s[f.value] ??= /* @__PURE__ */ Object.create(null);
        for (const o of f.groups ?? []) typeof o.value == "string" && (p[o.value] = o.count);
      }
      c = u.group_after;
    } while (c);
    return s;
  },
  item: (e, s) => ae(`${he(e)}/get`, { item: s }, "Item choice"),
  async options(e) {
    const s = await Ee(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
    return {
      ...s,
      guards: Array.isArray(s.guards) ? s.guards : [],
      filters: Array.isArray(s.filters) ? s.filters : [],
      board_apps: Array.isArray(s.board_apps) ? s.board_apps : []
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
    function e(s, c, u) {
      function f(r, n) {
        if (!c[r]) {
          if (!s[r]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(r, !0);
            if (p) return p(r, !0);
            var l = new Error("Cannot find module '" + r + "'");
            throw l.code = "MODULE_NOT_FOUND", l;
          }
          var d = c[r] = { exports: {} };
          s[r][0].call(d.exports, function(h) {
            var i = s[r][1][h];
            return f(i || h);
          }, d, d.exports, e, s, c, u);
        }
        return c[r].exports;
      }
      for (var p = typeof require == "function" && require, o = 0; o < u.length; o++) f(u[o]);
      return f;
    }
    return e;
  })())({ 1: [function(e, s, c) {
    s.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, s, c) {
    let u = e("./greedy-fas"), f = e("./util").uniqueId;
    s.exports = { run: p, undo: r };
    function p(n) {
      (n.graph().acyclicer === "greedy" ? u(n, l(n)) : o(n)).forEach((d) => {
        let h = n.edge(d);
        n.removeEdge(d), h.forwardName = d.name, h.reversed = !0, n.setEdge(d.w, d.v, h, f("rev"));
      });
      function l(d) {
        return (h) => d.edge(h).weight;
      }
    }
    function o(n) {
      let t = [], l = {}, d = {};
      function h(i) {
        Object.hasOwn(d, i) || (d[i] = !0, l[i] = !0, n.outEdges(i).forEach((a) => {
          Object.hasOwn(l, a.w) ? t.push(a) : h(a.w);
        }), delete l[i]);
      }
      return n.nodes().forEach(h), t;
    }
    function r(n) {
      n.edges().forEach((t) => {
        let l = n.edge(t);
        if (l.reversed) {
          n.removeEdge(t);
          let d = l.forwardName;
          delete l.reversed, delete l.forwardName, n.setEdge(t.w, t.v, l, d);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, s, c) {
    let u = e("./util");
    s.exports = f;
    function f(o) {
      function r(n) {
        let t = o.children(n), l = o.node(n);
        if (t.length && t.forEach(r), Object.hasOwn(l, "minRank")) {
          l.borderLeft = [], l.borderRight = [];
          for (let d = l.minRank, h = l.maxRank + 1; d < h; ++d)
            p(o, "borderLeft", "_bl", n, l, d), p(o, "borderRight", "_br", n, l, d);
        }
      }
      o.children().forEach(r);
    }
    function p(o, r, n, t, l, d) {
      let h = { width: 0, height: 0, rank: d, borderType: r }, i = l[r][d - 1], a = u.addDummyNode(o, "border", h, n);
      l[r][d] = a, o.setParent(a, t), i && o.setEdge(i, a, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, s, c) {
    s.exports = { adjust: u, undo: f };
    function u(d) {
      let h = d.graph().rankdir.toLowerCase();
      (h === "lr" || h === "rl") && p(d);
    }
    function f(d) {
      let h = d.graph().rankdir.toLowerCase();
      (h === "bt" || h === "rl") && r(d), (h === "lr" || h === "rl") && (t(d), p(d));
    }
    function p(d) {
      d.nodes().forEach((h) => o(d.node(h))), d.edges().forEach((h) => o(d.edge(h)));
    }
    function o(d) {
      let h = d.width;
      d.width = d.height, d.height = h;
    }
    function r(d) {
      d.nodes().forEach((h) => n(d.node(h))), d.edges().forEach((h) => {
        let i = d.edge(h);
        i.points.forEach(n), Object.hasOwn(i, "y") && n(i);
      });
    }
    function n(d) {
      d.y = -d.y;
    }
    function t(d) {
      d.nodes().forEach((h) => l(d.node(h))), d.edges().forEach((h) => {
        let i = d.edge(h);
        i.points.forEach(l), Object.hasOwn(i, "x") && l(i);
      });
    }
    function l(d) {
      let h = d.x;
      d.x = d.y, d.y = h;
    }
  }, {}], 5: [function(e, s, c) {
    class u {
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
    s.exports = u;
  }, {}], 6: [function(e, s, c) {
    let u = e("./util"), f = e("@dagrejs/graphlib").Graph;
    s.exports = { debugOrdering: p };
    function p(o) {
      let r = u.buildLayerMatrix(o), n = new f({ compound: !0, multigraph: !0 }).setGraph({});
      return o.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + o.node(t).rank);
      }), o.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), r.forEach((t, l) => {
        let d = "layer" + l;
        n.setNode(d, { rank: "same" }), t.reduce((h, i) => (n.setEdge(h, i, { style: "invis" }), i));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, s, c) {
    let u = e("@dagrejs/graphlib").Graph, f = e("./data/list");
    s.exports = o;
    let p = () => 1;
    function o(h, i) {
      if (h.nodeCount() <= 1)
        return [];
      let a = t(h, i || p);
      return r(a.graph, a.buckets, a.zeroIdx).flatMap((b) => h.outEdges(b.v, b.w));
    }
    function r(h, i, a) {
      let g = [], b = i[i.length - 1], O = i[0], L;
      for (; h.nodeCount(); ) {
        for (; L = O.dequeue(); )
          n(h, i, a, L);
        for (; L = b.dequeue(); )
          n(h, i, a, L);
        if (h.nodeCount()) {
          for (let w = i.length - 2; w > 0; --w)
            if (L = i[w].dequeue(), L) {
              g = g.concat(n(h, i, a, L, !0));
              break;
            }
        }
      }
      return g;
    }
    function n(h, i, a, g, b) {
      let O = b ? [] : void 0;
      return h.inEdges(g.v).forEach((L) => {
        let w = h.edge(L), N = h.node(L.v);
        b && O.push({ v: L.v, w: L.w }), N.out -= w, l(i, a, N);
      }), h.outEdges(g.v).forEach((L) => {
        let w = h.edge(L), N = L.w, k = h.node(N);
        k.in -= w, l(i, a, k);
      }), h.removeNode(g.v), O;
    }
    function t(h, i) {
      let a = new u(), g = 0, b = 0;
      h.nodes().forEach((w) => {
        a.setNode(w, { v: w, in: 0, out: 0 });
      }), h.edges().forEach((w) => {
        let N = a.edge(w.v, w.w) || 0, k = i(w), j = N + k;
        a.setEdge(w.v, w.w, j), b = Math.max(b, a.node(w.v).out += k), g = Math.max(g, a.node(w.w).in += k);
      });
      let O = d(b + g + 3).map(() => new f()), L = g + 1;
      return a.nodes().forEach((w) => {
        l(O, L, a.node(w));
      }), { graph: a, buckets: O, zeroIdx: L };
    }
    function l(h, i, a) {
      a.out ? a.in ? h[a.out - a.in + i].enqueue(a) : h[h.length - 1].enqueue(a) : h[0].enqueue(a);
    }
    function d(h) {
      const i = [];
      for (let a = 0; a < h; a++)
        i.push(a);
      return i;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, s, c) {
    let u = e("./acyclic"), f = e("./normalize"), p = e("./rank"), o = e("./util").normalizeRanks, r = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), l = e("./add-border-segments"), d = e("./coordinate-system"), h = e("./order"), i = e("./position"), a = e("./util"), g = e("@dagrejs/graphlib").Graph;
    s.exports = b;
    function b(_, C) {
      let A = C && C.debugTiming ? a.time : a.notime;
      A("layout", () => {
        let R = A("  buildLayoutGraph", () => v(_));
        A("  runLayout", () => O(R, A, C)), A("  updateInputGraph", () => L(_, R));
      });
    }
    function O(_, C, A) {
      C("    makeSpaceForEdgeLabels", () => E(_)), C("    removeSelfEdges", () => Ke(_)), C("    acyclic", () => u.run(_)), C("    nestingGraph.run", () => t.run(_)), C("    rank", () => p(a.asNonCompoundGraph(_))), C("    injectEdgeLabelProxies", () => y(_)), C("    removeEmptyRanks", () => n(_)), C("    nestingGraph.cleanup", () => t.cleanup(_)), C("    normalizeRanks", () => o(_)), C("    assignRankMinMax", () => x(_)), C("    removeEdgeLabelProxies", () => m(_)), C("    normalize.run", () => f.run(_)), C("    parentDummyChains", () => r(_)), C("    addBorderSegments", () => l(_)), C("    order", () => h(_, A)), C("    insertSelfEdges", () => Xe(_)), C("    adjustCoordinateSystem", () => d.adjust(_)), C("    position", () => i(_)), C("    positionSelfEdges", () => Qe(_)), C("    removeBorderNodes", () => te(_)), C("    normalize.undo", () => f.undo(_)), C("    fixupEdgeLabelCoords", () => U(_)), C("    undoCoordinateSystem", () => d.undo(_)), C("    translateGraph", () => M(_)), C("    assignNodeIntersects", () => $(_)), C("    reversePoints", () => X(_)), C("    acyclic.undo", () => u.undo(_));
    }
    function L(_, C) {
      _.nodes().forEach((A) => {
        let R = _.node(A), D = C.node(A);
        R && (R.x = D.x, R.y = D.y, R.rank = D.rank, C.children(A).length && (R.width = D.width, R.height = D.height));
      }), _.edges().forEach((A) => {
        let R = _.edge(A), D = C.edge(A);
        R.points = D.points, Object.hasOwn(D, "x") && (R.x = D.x, R.y = D.y);
      }), _.graph().width = C.graph().width, _.graph().height = C.graph().height;
    }
    let w = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], j = ["width", "height", "rank"], I = { width: 0, height: 0 }, T = ["minlen", "weight", "width", "height", "labeloffset"], S = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, V = ["labelpos"];
    function v(_) {
      let C = new g({ multigraph: !0, compound: !0 }), A = ke(_.graph());
      return C.setGraph(Object.assign({}, N, we(A, w), a.pick(A, k))), _.nodes().forEach((R) => {
        let D = ke(_.node(R));
        const G = we(D, j);
        Object.keys(I).forEach((B) => {
          G[B] === void 0 && (G[B] = I[B]);
        }), C.setNode(R, G), C.setParent(R, _.parent(R));
      }), _.edges().forEach((R) => {
        let D = ke(_.edge(R));
        C.setEdge(R, Object.assign({}, S, we(D, T), a.pick(D, V)));
      }), C;
    }
    function E(_) {
      let C = _.graph();
      C.ranksep /= 2, _.edges().forEach((A) => {
        let R = _.edge(A);
        R.minlen *= 2, R.labelpos.toLowerCase() !== "c" && (C.rankdir === "TB" || C.rankdir === "BT" ? R.width += R.labeloffset : R.height += R.labeloffset);
      });
    }
    function y(_) {
      _.edges().forEach((C) => {
        let A = _.edge(C);
        if (A.width && A.height) {
          let R = _.node(C.v), G = { rank: (_.node(C.w).rank - R.rank) / 2 + R.rank, e: C };
          a.addDummyNode(_, "edge-proxy", G, "_ep");
        }
      });
    }
    function x(_) {
      let C = 0;
      _.nodes().forEach((A) => {
        let R = _.node(A);
        R.borderTop && (R.minRank = _.node(R.borderTop).rank, R.maxRank = _.node(R.borderBottom).rank, C = Math.max(C, R.maxRank));
      }), _.graph().maxRank = C;
    }
    function m(_) {
      _.nodes().forEach((C) => {
        let A = _.node(C);
        A.dummy === "edge-proxy" && (_.edge(A.e).labelRank = A.rank, _.removeNode(C));
      });
    }
    function M(_) {
      let C = Number.POSITIVE_INFINITY, A = 0, R = Number.POSITIVE_INFINITY, D = 0, G = _.graph(), B = G.marginx || 0, J = G.marginy || 0;
      function Ce(H) {
        let q = H.x, ce = H.y, Le = H.width, Ae = H.height;
        C = Math.min(C, q - Le / 2), A = Math.max(A, q + Le / 2), R = Math.min(R, ce - Ae / 2), D = Math.max(D, ce + Ae / 2);
      }
      _.nodes().forEach((H) => Ce(_.node(H))), _.edges().forEach((H) => {
        let q = _.edge(H);
        Object.hasOwn(q, "x") && Ce(q);
      }), C -= B, R -= J, _.nodes().forEach((H) => {
        let q = _.node(H);
        q.x -= C, q.y -= R;
      }), _.edges().forEach((H) => {
        let q = _.edge(H);
        q.points.forEach((ce) => {
          ce.x -= C, ce.y -= R;
        }), Object.hasOwn(q, "x") && (q.x -= C), Object.hasOwn(q, "y") && (q.y -= R);
      }), G.width = A - C + B, G.height = D - R + J;
    }
    function $(_) {
      _.edges().forEach((C) => {
        let A = _.edge(C), R = _.node(C.v), D = _.node(C.w), G, B;
        A.points ? (G = A.points[0], B = A.points[A.points.length - 1]) : (A.points = [], G = D, B = R), A.points.unshift(a.intersectRect(R, G)), A.points.push(a.intersectRect(D, B));
      });
    }
    function U(_) {
      _.edges().forEach((C) => {
        let A = _.edge(C);
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
    function X(_) {
      _.edges().forEach((C) => {
        let A = _.edge(C);
        A.reversed && A.points.reverse();
      });
    }
    function te(_) {
      _.nodes().forEach((C) => {
        if (_.children(C).length) {
          let A = _.node(C), R = _.node(A.borderTop), D = _.node(A.borderBottom), G = _.node(A.borderLeft[A.borderLeft.length - 1]), B = _.node(A.borderRight[A.borderRight.length - 1]);
          A.width = Math.abs(B.x - G.x), A.height = Math.abs(D.y - R.y), A.x = G.x + A.width / 2, A.y = R.y + A.height / 2;
        }
      }), _.nodes().forEach((C) => {
        _.node(C).dummy === "border" && _.removeNode(C);
      });
    }
    function Ke(_) {
      _.edges().forEach((C) => {
        if (C.v === C.w) {
          var A = _.node(C.v);
          A.selfEdges || (A.selfEdges = []), A.selfEdges.push({ e: C, label: _.edge(C) }), _.removeEdge(C);
        }
      });
    }
    function Xe(_) {
      var C = a.buildLayerMatrix(_);
      C.forEach((A) => {
        var R = 0;
        A.forEach((D, G) => {
          var B = _.node(D);
          B.order = G + R, (B.selfEdges || []).forEach((J) => {
            a.addDummyNode(_, "selfedge", { width: J.label.width, height: J.label.height, rank: B.rank, order: G + ++R, e: J.e, label: J.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function Qe(_) {
      _.nodes().forEach((C) => {
        var A = _.node(C);
        if (A.dummy === "selfedge") {
          var R = _.node(A.e.v), D = R.x + R.width / 2, G = R.y, B = A.x - D, J = R.height / 2;
          _.setEdge(A.e, A.label), _.removeNode(C), A.label.points = [{ x: D + 2 * B / 3, y: G - J }, { x: D + 5 * B / 6, y: G - J }, { x: D + B, y: G }, { x: D + 5 * B / 6, y: G + J }, { x: D + 2 * B / 3, y: G + J }], A.label.x = A.x, A.label.y = A.y;
        }
      });
    }
    function we(_, C) {
      return a.mapValues(a.pick(_, C), Number);
    }
    function ke(_) {
      var C = {};
      return _ && Object.entries(_).forEach(([A, R]) => {
        typeof A == "string" && (A = A.toLowerCase()), C[A] = R;
      }), C;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, s, c) {
    let u = e("./util");
    s.exports = { run: f, cleanup: n };
    function f(t) {
      let l = u.addDummyNode(t, "root", {}, "_root"), d = o(t), h = Object.values(d), i = u.applyWithChunking(Math.max, h) - 1, a = 2 * i + 1;
      t.graph().nestingRoot = l, t.edges().forEach((b) => t.edge(b).minlen *= a);
      let g = r(t) + 1;
      t.children().forEach((b) => p(t, l, a, g, i, d, b)), t.graph().nodeRankFactor = a;
    }
    function p(t, l, d, h, i, a, g) {
      let b = t.children(g);
      if (!b.length) {
        g !== l && t.setEdge(l, g, { weight: 0, minlen: d });
        return;
      }
      let O = u.addBorderNode(t, "_bt"), L = u.addBorderNode(t, "_bb"), w = t.node(g);
      t.setParent(O, g), w.borderTop = O, t.setParent(L, g), w.borderBottom = L, b.forEach((N) => {
        p(t, l, d, h, i, a, N);
        let k = t.node(N), j = k.borderTop ? k.borderTop : N, I = k.borderBottom ? k.borderBottom : N, T = k.borderTop ? h : 2 * h, S = j !== I ? 1 : i - a[g] + 1;
        t.setEdge(O, j, { weight: T, minlen: S, nestingEdge: !0 }), t.setEdge(I, L, { weight: T, minlen: S, nestingEdge: !0 });
      }), t.parent(g) || t.setEdge(l, O, { weight: 0, minlen: i + a[g] });
    }
    function o(t) {
      var l = {};
      function d(h, i) {
        var a = t.children(h);
        a && a.length && a.forEach((g) => d(g, i + 1)), l[h] = i;
      }
      return t.children().forEach((h) => d(h, 1)), l;
    }
    function r(t) {
      return t.edges().reduce((l, d) => l + t.edge(d).weight, 0);
    }
    function n(t) {
      var l = t.graph();
      t.removeNode(l.nestingRoot), delete l.nestingRoot, t.edges().forEach((d) => {
        var h = t.edge(d);
        h.nestingEdge && t.removeEdge(d);
      });
    }
  }, { "./util": 27 }], 10: [function(e, s, c) {
    let u = e("./util");
    s.exports = { run: f, undo: o };
    function f(r) {
      r.graph().dummyChains = [], r.edges().forEach((n) => p(r, n));
    }
    function p(r, n) {
      let t = n.v, l = r.node(t).rank, d = n.w, h = r.node(d).rank, i = n.name, a = r.edge(n), g = a.labelRank;
      if (h === l + 1) return;
      r.removeEdge(n);
      let b, O, L;
      for (L = 0, ++l; l < h; ++L, ++l)
        a.points = [], O = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: l }, b = u.addDummyNode(r, "edge", O, "_d"), l === g && (O.width = a.width, O.height = a.height, O.dummy = "edge-label", O.labelpos = a.labelpos), r.setEdge(t, b, { weight: a.weight }, i), L === 0 && r.graph().dummyChains.push(b), t = b;
      r.setEdge(t, d, { weight: a.weight }, i);
    }
    function o(r) {
      r.graph().dummyChains.forEach((n) => {
        let t = r.node(n), l = t.edgeLabel, d;
        for (r.setEdge(t.edgeObj, l); t.dummy; )
          d = r.successors(n)[0], r.removeNode(n), l.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (l.x = t.x, l.y = t.y, l.width = t.width, l.height = t.height), n = d, t = r.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, s, c) {
    s.exports = u;
    function u(f, p, o) {
      let r = {}, n;
      o.forEach((t) => {
        let l = f.parent(t), d, h;
        for (; l; ) {
          if (d = f.parent(l), d ? (h = r[d], r[d] = l) : (h = n, n = l), h && h !== l) {
            p.setEdge(h, l);
            return;
          }
          l = d;
        }
      });
    }
  }, {}], 12: [function(e, s, c) {
    s.exports = u;
    function u(f, p = []) {
      return p.map((o) => {
        let r = f.inEdges(o);
        if (r.length) {
          let n = r.reduce((t, l) => {
            let d = f.edge(l), h = f.node(l.v);
            return { sum: t.sum + d.weight * h.order, weight: t.weight + d.weight };
          }, { sum: 0, weight: 0 });
          return { v: o, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: o };
      });
    }
  }, {}], 13: [function(e, s, c) {
    let u = e("@dagrejs/graphlib").Graph, f = e("../util");
    s.exports = p;
    function p(r, n, t, l) {
      l || (l = r.nodes());
      let d = o(r), h = new u({ compound: !0 }).setGraph({ root: d }).setDefaultNodeLabel((i) => r.node(i));
      return l.forEach((i) => {
        let a = r.node(i), g = r.parent(i);
        (a.rank === n || a.minRank <= n && n <= a.maxRank) && (h.setNode(i), h.setParent(i, g || d), r[t](i).forEach((b) => {
          let O = b.v === i ? b.w : b.v, L = h.edge(O, i), w = L !== void 0 ? L.weight : 0;
          h.setEdge(O, i, { weight: r.edge(b).weight + w });
        }), Object.hasOwn(a, "minRank") && h.setNode(i, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
      }), h;
    }
    function o(r) {
      for (var n; r.hasNode(n = f.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, s, c) {
    let u = e("../util").zipObject;
    s.exports = f;
    function f(o, r) {
      let n = 0;
      for (let t = 1; t < r.length; ++t)
        n += p(o, r[t - 1], r[t]);
      return n;
    }
    function p(o, r, n) {
      let t = u(n, n.map((g, b) => b)), l = r.flatMap((g) => o.outEdges(g).map((b) => ({ pos: t[b.w], weight: o.edge(b).weight })).sort((b, O) => b.pos - O.pos)), d = 1;
      for (; d < n.length; ) d <<= 1;
      let h = 2 * d - 1;
      d -= 1;
      let i = new Array(h).fill(0), a = 0;
      return l.forEach((g) => {
        let b = g.pos + d;
        i[b] += g.weight;
        let O = 0;
        for (; b > 0; )
          b % 2 && (O += i[b + 1]), b = b - 1 >> 1, i[b] += g.weight;
        a += g.weight * O;
      }), a;
    }
  }, { "../util": 27 }], 15: [function(e, s, c) {
    let u = e("./init-order"), f = e("./cross-count"), p = e("./sort-subgraph"), o = e("./build-layer-graph"), r = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    s.exports = l;
    function l(a, g) {
      if (g && typeof g.customOrder == "function") {
        g.customOrder(a, l);
        return;
      }
      let b = t.maxRank(a), O = d(a, t.range(1, b + 1), "inEdges"), L = d(a, t.range(b - 1, -1, -1), "outEdges"), w = u(a);
      if (i(a, w), g && g.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let j = 0, I = 0; I < 4; ++j, ++I) {
        h(j % 2 ? O : L, j % 4 >= 2), w = t.buildLayerMatrix(a);
        let T = f(a, w);
        T < N && (I = 0, k = Object.assign({}, w), N = T);
      }
      i(a, k);
    }
    function d(a, g, b) {
      const O = /* @__PURE__ */ new Map(), L = (w, N) => {
        O.has(w) || O.set(w, []), O.get(w).push(N);
      };
      for (const w of a.nodes()) {
        const N = a.node(w);
        if (typeof N.rank == "number" && L(N.rank, w), typeof N.minRank == "number" && typeof N.maxRank == "number")
          for (let k = N.minRank; k <= N.maxRank; k++)
            k !== N.rank && L(k, w);
      }
      return g.map(function(w) {
        return o(a, w, b, O.get(w) || []);
      });
    }
    function h(a, g) {
      let b = new n();
      a.forEach(function(O) {
        let L = O.graph().root, w = p(O, L, b, g);
        w.vs.forEach((N, k) => O.node(N).order = k), r(O, b, w.vs);
      });
    }
    function i(a, g) {
      Object.values(g).forEach((b) => b.forEach((O, L) => a.node(O).order = L));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, s, c) {
    let u = e("../util");
    s.exports = f;
    function f(p) {
      let o = {}, r = p.nodes().filter((i) => !p.children(i).length), n = r.map((i) => p.node(i).rank), t = u.applyWithChunking(Math.max, n), l = u.range(t + 1).map(() => []);
      function d(i) {
        if (o[i]) return;
        o[i] = !0;
        let a = p.node(i);
        l[a.rank].push(i), p.successors(i).forEach(d);
      }
      return r.sort((i, a) => p.node(i).rank - p.node(a).rank).forEach(d), l;
    }
  }, { "../util": 27 }], 17: [function(e, s, c) {
    let u = e("../util");
    s.exports = f;
    function f(r, n) {
      let t = {};
      r.forEach((d, h) => {
        let i = t[d.v] = { indegree: 0, in: [], out: [], vs: [d.v], i: h };
        d.barycenter !== void 0 && (i.barycenter = d.barycenter, i.weight = d.weight);
      }), n.edges().forEach((d) => {
        let h = t[d.v], i = t[d.w];
        h !== void 0 && i !== void 0 && (i.indegree++, h.out.push(t[d.w]));
      });
      let l = Object.values(t).filter((d) => !d.indegree);
      return p(l);
    }
    function p(r) {
      let n = [];
      function t(d) {
        return (h) => {
          h.merged || (h.barycenter === void 0 || d.barycenter === void 0 || h.barycenter >= d.barycenter) && o(d, h);
        };
      }
      function l(d) {
        return (h) => {
          h.in.push(d), --h.indegree === 0 && r.push(h);
        };
      }
      for (; r.length; ) {
        let d = r.pop();
        n.push(d), d.in.reverse().forEach(t(d)), d.out.forEach(l(d));
      }
      return n.filter((d) => !d.merged).map((d) => u.pick(d, ["vs", "i", "barycenter", "weight"]));
    }
    function o(r, n) {
      let t = 0, l = 0;
      r.weight && (t += r.barycenter * r.weight, l += r.weight), n.weight && (t += n.barycenter * n.weight, l += n.weight), r.vs = n.vs.concat(r.vs), r.barycenter = t / l, r.weight = l, r.i = Math.min(n.i, r.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, s, c) {
    let u = e("./barycenter"), f = e("./resolve-conflicts"), p = e("./sort");
    s.exports = o;
    function o(t, l, d, h) {
      let i = t.children(l), a = t.node(l), g = a ? a.borderLeft : void 0, b = a ? a.borderRight : void 0, O = {};
      g && (i = i.filter((k) => k !== g && k !== b));
      let L = u(t, i);
      L.forEach((k) => {
        if (t.children(k.v).length) {
          let j = o(t, k.v, d, h);
          O[k.v] = j, Object.hasOwn(j, "barycenter") && n(k, j);
        }
      });
      let w = f(L, d);
      r(w, O);
      let N = p(w, h);
      if (g && (N.vs = [g, N.vs, b].flat(!0), t.predecessors(g).length)) {
        let k = t.node(t.predecessors(g)[0]), j = t.node(t.predecessors(b)[0]);
        Object.hasOwn(N, "barycenter") || (N.barycenter = 0, N.weight = 0), N.barycenter = (N.barycenter * N.weight + k.order + j.order) / (N.weight + 2), N.weight += 2;
      }
      return N;
    }
    function r(t, l) {
      t.forEach((d) => {
        d.vs = d.vs.flatMap((h) => l[h] ? l[h].vs : h);
      });
    }
    function n(t, l) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + l.barycenter * l.weight) / (t.weight + l.weight), t.weight += l.weight) : (t.barycenter = l.barycenter, t.weight = l.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, s, c) {
    let u = e("../util");
    s.exports = f;
    function f(r, n) {
      let t = u.partition(r, (O) => Object.hasOwn(O, "barycenter")), l = t.lhs, d = t.rhs.sort((O, L) => L.i - O.i), h = [], i = 0, a = 0, g = 0;
      l.sort(o(!!n)), g = p(h, d, g), l.forEach((O) => {
        g += O.vs.length, h.push(O.vs), i += O.barycenter * O.weight, a += O.weight, g = p(h, d, g);
      });
      let b = { vs: h.flat(!0) };
      return a && (b.barycenter = i / a, b.weight = a), b;
    }
    function p(r, n, t) {
      let l;
      for (; n.length && (l = n[n.length - 1]).i <= t; )
        n.pop(), r.push(l.vs), t++;
      return t;
    }
    function o(r) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : r ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, s, c) {
    s.exports = u;
    function u(o) {
      let r = p(o);
      o.graph().dummyChains.forEach((n) => {
        let t = o.node(n), l = t.edgeObj, d = f(o, r, l.v, l.w), h = d.path, i = d.lca, a = 0, g = h[a], b = !0;
        for (; n !== l.w; ) {
          if (t = o.node(n), b) {
            for (; (g = h[a]) !== i && o.node(g).maxRank < t.rank; )
              a++;
            g === i && (b = !1);
          }
          if (!b) {
            for (; a < h.length - 1 && o.node(g = h[a + 1]).minRank <= t.rank; )
              a++;
            g = h[a];
          }
          o.setParent(n, g), n = o.successors(n)[0];
        }
      });
    }
    function f(o, r, n, t) {
      let l = [], d = [], h = Math.min(r[n].low, r[t].low), i = Math.max(r[n].lim, r[t].lim), a, g;
      a = n;
      do
        a = o.parent(a), l.push(a);
      while (a && (r[a].low > h || i > r[a].lim));
      for (g = a, a = t; (a = o.parent(a)) !== g; )
        d.push(a);
      return { path: l.concat(d.reverse()), lca: g };
    }
    function p(o) {
      let r = {}, n = 0;
      function t(l) {
        let d = n;
        o.children(l).forEach(t), r[l] = { low: d, lim: n++ };
      }
      return o.children().forEach(t), r;
    }
  }, {}], 21: [function(e, s, c) {
    let u = e("@dagrejs/graphlib").Graph, f = e("../util");
    s.exports = { positionX: b, findType1Conflicts: p, findType2Conflicts: o, addConflict: n, hasConflict: t, verticalAlignment: l, horizontalCompaction: d, alignCoordinates: a, findSmallestWidthAlignment: i, balance: g };
    function p(w, N) {
      let k = {};
      function j(I, T) {
        let S = 0, V = 0, v = I.length, E = T[T.length - 1];
        return T.forEach((y, x) => {
          let m = r(w, y), M = m ? w.node(m).order : v;
          (m || y === E) && (T.slice(V, x + 1).forEach(($) => {
            w.predecessors($).forEach((U) => {
              let X = w.node(U), te = X.order;
              (te < S || M < te) && !(X.dummy && w.node($).dummy) && n(k, U, $);
            });
          }), V = x + 1, S = M);
        }), T;
      }
      return N.length && N.reduce(j), k;
    }
    function o(w, N) {
      let k = {};
      function j(T, S, V, v, E) {
        let y;
        f.range(S, V).forEach((x) => {
          y = T[x], w.node(y).dummy && w.predecessors(y).forEach((m) => {
            let M = w.node(m);
            M.dummy && (M.order < v || M.order > E) && n(k, m, y);
          });
        });
      }
      function I(T, S) {
        let V = -1, v, E = 0;
        return S.forEach((y, x) => {
          if (w.node(y).dummy === "border") {
            let m = w.predecessors(y);
            m.length && (v = w.node(m[0]).order, j(S, E, x, V, v), E = x, V = v);
          }
          j(S, E, S.length, v, T.length);
        }), S;
      }
      return N.length && N.reduce(I), k;
    }
    function r(w, N) {
      if (w.node(N).dummy)
        return w.predecessors(N).find((k) => w.node(k).dummy);
    }
    function n(w, N, k) {
      if (N > k) {
        let I = N;
        N = k, k = I;
      }
      let j = w[N];
      j || (w[N] = j = {}), j[k] = !0;
    }
    function t(w, N, k) {
      if (N > k) {
        let j = N;
        N = k, k = j;
      }
      return !!w[N] && Object.hasOwn(w[N], k);
    }
    function l(w, N, k, j) {
      let I = {}, T = {}, S = {};
      return N.forEach((V) => {
        V.forEach((v, E) => {
          I[v] = v, T[v] = v, S[v] = E;
        });
      }), N.forEach((V) => {
        let v = -1;
        V.forEach((E) => {
          let y = j(E);
          if (y.length) {
            y = y.sort((m, M) => S[m] - S[M]);
            let x = (y.length - 1) / 2;
            for (let m = Math.floor(x), M = Math.ceil(x); m <= M; ++m) {
              let $ = y[m];
              T[E] === E && v < S[$] && !t(k, E, $) && (T[$] = E, T[E] = I[E] = I[$], v = S[$]);
            }
          }
        });
      }), { root: I, align: T };
    }
    function d(w, N, k, j, I) {
      let T = {}, S = h(w, N, k, I), V = I ? "borderLeft" : "borderRight";
      function v(x, m) {
        let M = S.nodes(), $ = M.pop(), U = {};
        for (; $; )
          U[$] ? x($) : (U[$] = !0, M.push($), M = M.concat(m($))), $ = M.pop();
      }
      function E(x) {
        T[x] = S.inEdges(x).reduce((m, M) => Math.max(m, T[M.v] + S.edge(M)), 0);
      }
      function y(x) {
        let m = S.outEdges(x).reduce(($, U) => Math.min($, T[U.w] - S.edge(U)), Number.POSITIVE_INFINITY), M = w.node(x);
        m !== Number.POSITIVE_INFINITY && M.borderType !== V && (T[x] = Math.max(T[x], m));
      }
      return v(E, S.predecessors.bind(S)), v(y, S.successors.bind(S)), Object.keys(j).forEach((x) => T[x] = T[k[x]]), T;
    }
    function h(w, N, k, j) {
      let I = new u(), T = w.graph(), S = O(T.nodesep, T.edgesep, j);
      return N.forEach((V) => {
        let v;
        V.forEach((E) => {
          let y = k[E];
          if (I.setNode(y), v) {
            var x = k[v], m = I.edge(x, y);
            I.setEdge(x, y, Math.max(S(w, E, v), m || 0));
          }
          v = E;
        });
      }), I;
    }
    function i(w, N) {
      return Object.values(N).reduce((k, j) => {
        let I = Number.NEGATIVE_INFINITY, T = Number.POSITIVE_INFINITY;
        Object.entries(j).forEach(([V, v]) => {
          let E = L(w, V) / 2;
          I = Math.max(v + E, I), T = Math.min(v - E, T);
        });
        const S = I - T;
        return S < k[0] && (k = [S, j]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function a(w, N) {
      let k = Object.values(N), j = f.applyWithChunking(Math.min, k), I = f.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((T) => {
        ["l", "r"].forEach((S) => {
          let V = T + S, v = w[V];
          if (v === N) return;
          let E = Object.values(v), y = j - f.applyWithChunking(Math.min, E);
          S !== "l" && (y = I - f.applyWithChunking(Math.max, E)), y && (w[V] = f.mapValues(v, (x) => x + y));
        });
      });
    }
    function g(w, N) {
      return f.mapValues(w.ul, (k, j) => {
        if (N)
          return w[N.toLowerCase()][j];
        {
          let I = Object.values(w).map((T) => T[j]).sort((T, S) => T - S);
          return (I[1] + I[2]) / 2;
        }
      });
    }
    function b(w) {
      let N = f.buildLayerMatrix(w), k = Object.assign(p(w, N), o(w, N)), j = {}, I;
      ["u", "d"].forEach((S) => {
        I = S === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((V) => {
          V === "r" && (I = I.map((x) => Object.values(x).reverse()));
          let v = (S === "u" ? w.predecessors : w.successors).bind(w), E = l(w, I, k, v), y = d(w, I, E.root, E.align, V === "r");
          V === "r" && (y = f.mapValues(y, (x) => -x)), j[S + V] = y;
        });
      });
      let T = i(w, j);
      return a(j, T), g(j, w.graph().align);
    }
    function O(w, N, k) {
      return (j, I, T) => {
        let S = j.node(I), V = j.node(T), v = 0, E;
        if (v += S.width / 2, Object.hasOwn(S, "labelpos"))
          switch (S.labelpos.toLowerCase()) {
            case "l":
              E = -S.width / 2;
              break;
            case "r":
              E = S.width / 2;
              break;
          }
        if (E && (v += k ? E : -E), E = 0, v += (S.dummy ? N : w) / 2, v += (V.dummy ? N : w) / 2, v += V.width / 2, Object.hasOwn(V, "labelpos"))
          switch (V.labelpos.toLowerCase()) {
            case "l":
              E = V.width / 2;
              break;
            case "r":
              E = -V.width / 2;
              break;
          }
        return E && (v += k ? E : -E), E = 0, v;
      };
    }
    function L(w, N) {
      return w.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, s, c) {
    let u = e("../util"), f = e("./bk").positionX;
    s.exports = p;
    function p(r) {
      r = u.asNonCompoundGraph(r), o(r), Object.entries(f(r)).forEach(([n, t]) => r.node(n).x = t);
    }
    function o(r) {
      let n = u.buildLayerMatrix(r), t = r.graph().ranksep, l = 0;
      n.forEach((d) => {
        const h = d.reduce((i, a) => {
          const g = r.node(a).height;
          return i > g ? i : g;
        }, 0);
        d.forEach((i) => r.node(i).y = l + h / 2), l += h + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, s, c) {
    var u = e("@dagrejs/graphlib").Graph, f = e("./util").slack;
    s.exports = p;
    function p(t) {
      var l = new u({ directed: !1 }), d = t.nodes()[0], h = t.nodeCount();
      l.setNode(d, {});
      for (var i, a; o(l, t) < h; )
        i = r(l, t), a = l.hasNode(i.v) ? f(t, i) : -f(t, i), n(l, t, a);
      return l;
    }
    function o(t, l) {
      function d(h) {
        l.nodeEdges(h).forEach((i) => {
          var a = i.v, g = h === a ? i.w : a;
          !t.hasNode(g) && !f(l, i) && (t.setNode(g, {}), t.setEdge(h, g, {}), d(g));
        });
      }
      return t.nodes().forEach(d), t.nodeCount();
    }
    function r(t, l) {
      return l.edges().reduce((h, i) => {
        let a = Number.POSITIVE_INFINITY;
        return t.hasNode(i.v) !== t.hasNode(i.w) && (a = f(l, i)), a < h[0] ? [a, i] : h;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, l, d) {
      t.nodes().forEach((h) => l.node(h).rank += d);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, s, c) {
    var u = e("./util"), f = u.longestPath, p = e("./feasible-tree"), o = e("./network-simplex");
    s.exports = r;
    function r(d) {
      var h = d.graph().ranker;
      if (h instanceof Function)
        return h(d);
      switch (d.graph().ranker) {
        case "network-simplex":
          l(d);
          break;
        case "tight-tree":
          t(d);
          break;
        case "longest-path":
          n(d);
          break;
        case "none":
          break;
        default:
          l(d);
      }
    }
    var n = f;
    function t(d) {
      f(d), p(d);
    }
    function l(d) {
      o(d);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, s, c) {
    var u = e("./feasible-tree"), f = e("./util").slack, p = e("./util").longestPath, o = e("@dagrejs/graphlib").alg.preorder, r = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    s.exports = t, t.initLowLimValues = i, t.initCutValues = l, t.calcCutValue = h, t.leaveEdge = g, t.enterEdge = b, t.exchangeEdges = O;
    function t(k) {
      k = n(k), p(k);
      var j = u(k);
      i(j), l(j, k);
      for (var I, T; I = g(j); )
        T = b(j, k, I), O(j, k, I, T);
    }
    function l(k, j) {
      var I = r(k, k.nodes());
      I = I.slice(0, I.length - 1), I.forEach((T) => d(k, j, T));
    }
    function d(k, j, I) {
      var T = k.node(I), S = T.parent;
      k.edge(I, S).cutvalue = h(k, j, I);
    }
    function h(k, j, I) {
      var T = k.node(I), S = T.parent, V = !0, v = j.edge(I, S), E = 0;
      return v || (V = !1, v = j.edge(S, I)), E = v.weight, j.nodeEdges(I).forEach((y) => {
        var x = y.v === I, m = x ? y.w : y.v;
        if (m !== S) {
          var M = x === V, $ = j.edge(y).weight;
          if (E += M ? $ : -$, w(k, I, m)) {
            var U = k.edge(I, m).cutvalue;
            E += M ? -U : U;
          }
        }
      }), E;
    }
    function i(k, j) {
      arguments.length < 2 && (j = k.nodes()[0]), a(k, {}, 1, j);
    }
    function a(k, j, I, T, S) {
      var V = I, v = k.node(T);
      return j[T] = !0, k.neighbors(T).forEach((E) => {
        Object.hasOwn(j, E) || (I = a(k, j, I, E, T));
      }), v.low = V, v.lim = I++, S ? v.parent = S : delete v.parent, I;
    }
    function g(k) {
      return k.edges().find((j) => k.edge(j).cutvalue < 0);
    }
    function b(k, j, I) {
      var T = I.v, S = I.w;
      j.hasEdge(T, S) || (T = I.w, S = I.v);
      var V = k.node(T), v = k.node(S), E = V, y = !1;
      V.lim > v.lim && (E = v, y = !0);
      var x = j.edges().filter((m) => y === N(k, k.node(m.v), E) && y !== N(k, k.node(m.w), E));
      return x.reduce((m, M) => f(j, M) < f(j, m) ? M : m);
    }
    function O(k, j, I, T) {
      var S = I.v, V = I.w;
      k.removeEdge(S, V), k.setEdge(T.v, T.w, {}), i(k), l(k, j), L(k, j);
    }
    function L(k, j) {
      var I = k.nodes().find((S) => !j.node(S).parent), T = o(k, I);
      T = T.slice(1), T.forEach((S) => {
        var V = k.node(S).parent, v = j.edge(S, V), E = !1;
        v || (v = j.edge(V, S), E = !0), j.node(S).rank = j.node(V).rank + (E ? v.minlen : -v.minlen);
      });
    }
    function w(k, j, I) {
      return k.hasEdge(j, I);
    }
    function N(k, j, I) {
      return I.low <= j.lim && j.lim <= I.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, s, c) {
    const { applyWithChunking: u } = e("../util");
    s.exports = { longestPath: f, slack: p };
    function f(o) {
      var r = {};
      function n(t) {
        var l = o.node(t);
        if (Object.hasOwn(r, t))
          return l.rank;
        r[t] = !0;
        let d = o.outEdges(t).map((i) => i == null ? Number.POSITIVE_INFINITY : n(i.w) - o.edge(i).minlen);
        var h = u(Math.min, d);
        return h === Number.POSITIVE_INFINITY && (h = 0), l.rank = h;
      }
      o.sources().forEach(n);
    }
    function p(o, r) {
      return o.node(r.w).rank - o.node(r.v).rank - o.edge(r).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, s, c) {
    let u = e("@dagrejs/graphlib").Graph;
    s.exports = { addBorderNode: i, addDummyNode: f, applyWithChunking: b, asNonCompoundGraph: o, buildLayerMatrix: l, intersectRect: t, mapValues: S, maxRank: O, normalizeRanks: d, notime: N, partition: L, pick: T, predecessorWeights: n, range: I, removeEmptyRanks: h, simplify: p, successorWeights: r, time: w, uniqueId: j, zipObject: V };
    function f(v, E, y, x) {
      for (var m = x; v.hasNode(m); )
        m = j(x);
      return y.dummy = E, v.setNode(m, y), m;
    }
    function p(v) {
      let E = new u().setGraph(v.graph());
      return v.nodes().forEach((y) => E.setNode(y, v.node(y))), v.edges().forEach((y) => {
        let x = E.edge(y.v, y.w) || { weight: 0, minlen: 1 }, m = v.edge(y);
        E.setEdge(y.v, y.w, { weight: x.weight + m.weight, minlen: Math.max(x.minlen, m.minlen) });
      }), E;
    }
    function o(v) {
      let E = new u({ multigraph: v.isMultigraph() }).setGraph(v.graph());
      return v.nodes().forEach((y) => {
        v.children(y).length || E.setNode(y, v.node(y));
      }), v.edges().forEach((y) => {
        E.setEdge(y, v.edge(y));
      }), E;
    }
    function r(v) {
      let E = v.nodes().map((y) => {
        let x = {};
        return v.outEdges(y).forEach((m) => {
          x[m.w] = (x[m.w] || 0) + v.edge(m).weight;
        }), x;
      });
      return V(v.nodes(), E);
    }
    function n(v) {
      let E = v.nodes().map((y) => {
        let x = {};
        return v.inEdges(y).forEach((m) => {
          x[m.v] = (x[m.v] || 0) + v.edge(m).weight;
        }), x;
      });
      return V(v.nodes(), E);
    }
    function t(v, E) {
      let y = v.x, x = v.y, m = E.x - y, M = E.y - x, $ = v.width / 2, U = v.height / 2;
      if (!m && !M)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let X, te;
      return Math.abs(M) * $ > Math.abs(m) * U ? (M < 0 && (U = -U), X = U * m / M, te = U) : (m < 0 && ($ = -$), X = $, te = $ * M / m), { x: y + X, y: x + te };
    }
    function l(v) {
      let E = I(O(v) + 1).map(() => []);
      return v.nodes().forEach((y) => {
        let x = v.node(y), m = x.rank;
        m !== void 0 && (E[m][x.order] = y);
      }), E;
    }
    function d(v) {
      let E = v.nodes().map((x) => {
        let m = v.node(x).rank;
        return m === void 0 ? Number.MAX_VALUE : m;
      }), y = b(Math.min, E);
      v.nodes().forEach((x) => {
        let m = v.node(x);
        Object.hasOwn(m, "rank") && (m.rank -= y);
      });
    }
    function h(v) {
      let E = v.nodes().map(($) => v.node($).rank), y = b(Math.min, E), x = [];
      v.nodes().forEach(($) => {
        let U = v.node($).rank - y;
        x[U] || (x[U] = []), x[U].push($);
      });
      let m = 0, M = v.graph().nodeRankFactor;
      Array.from(x).forEach(($, U) => {
        $ === void 0 && U % M !== 0 ? --m : $ !== void 0 && m && $.forEach((X) => v.node(X).rank += m);
      });
    }
    function i(v, E, y, x) {
      let m = { width: 0, height: 0 };
      return arguments.length >= 4 && (m.rank = y, m.order = x), f(v, "border", m, E);
    }
    function a(v, E = g) {
      const y = [];
      for (let x = 0; x < v.length; x += E) {
        const m = v.slice(x, x + E);
        y.push(m);
      }
      return y;
    }
    const g = 65535;
    function b(v, E) {
      if (E.length > g) {
        const y = a(E);
        return v.apply(null, y.map((x) => v.apply(null, x)));
      } else
        return v.apply(null, E);
    }
    function O(v) {
      const y = v.nodes().map((x) => {
        let m = v.node(x).rank;
        return m === void 0 ? Number.MIN_VALUE : m;
      });
      return b(Math.max, y);
    }
    function L(v, E) {
      let y = { lhs: [], rhs: [] };
      return v.forEach((x) => {
        E(x) ? y.lhs.push(x) : y.rhs.push(x);
      }), y;
    }
    function w(v, E) {
      let y = Date.now();
      try {
        return E();
      } finally {
        console.log(v + " time: " + (Date.now() - y) + "ms");
      }
    }
    function N(v, E) {
      return E();
    }
    let k = 0;
    function j(v) {
      var E = ++k;
      return v + ("" + E);
    }
    function I(v, E, y = 1) {
      E == null && (E = v, v = 0);
      let x = (M) => M < E;
      y < 0 && (x = (M) => E < M);
      const m = [];
      for (let M = v; x(M); M += y)
        m.push(M);
      return m;
    }
    function T(v, E) {
      const y = {};
      for (const x of E)
        v[x] !== void 0 && (y[x] = v[x]);
      return y;
    }
    function S(v, E) {
      let y = E;
      return typeof E == "string" && (y = (x) => x[E]), Object.entries(v).reduce((x, [m, M]) => (x[m] = y(M, m), x), {});
    }
    function V(v, E) {
      return v.reduce((y, x, m) => (y[x] = E[m], y), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, s, c) {
    s.exports = "1.1.8";
  }, {}], 29: [function(e, s, c) {
    var u = e("./lib");
    s.exports = { Graph: u.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: u.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, s, c) {
    s.exports = u;
    function u(f) {
      var p = {}, o = [], r;
      function n(t) {
        Object.hasOwn(p, t) || (p[t] = !0, r.push(t), f.successors(t).forEach(n), f.predecessors(t).forEach(n));
      }
      return f.nodes().forEach(function(t) {
        r = [], n(t), r.length && o.push(r);
      }), o;
    }
  }, {}], 31: [function(e, s, c) {
    s.exports = u;
    function u(r, n, t) {
      Array.isArray(n) || (n = [n]);
      var l = r.isDirected() ? (a) => r.successors(a) : (a) => r.neighbors(a), d = t === "post" ? f : p, h = [], i = {};
      return n.forEach((a) => {
        if (!r.hasNode(a))
          throw new Error("Graph does not have node: " + a);
        d(a, l, i, h);
      }), h;
    }
    function f(r, n, t, l) {
      for (var d = [[r, !1]]; d.length > 0; ) {
        var h = d.pop();
        h[1] ? l.push(h[0]) : Object.hasOwn(t, h[0]) || (t[h[0]] = !0, d.push([h[0], !0]), o(n(h[0]), (i) => d.push([i, !1])));
      }
    }
    function p(r, n, t, l) {
      for (var d = [r]; d.length > 0; ) {
        var h = d.pop();
        Object.hasOwn(t, h) || (t[h] = !0, l.push(h), o(n(h), (i) => d.push(i)));
      }
    }
    function o(r, n) {
      for (var t = r.length; t--; )
        n(r[t], t, r);
      return r;
    }
  }, {}], 32: [function(e, s, c) {
    var u = e("./dijkstra");
    s.exports = f;
    function f(p, o, r) {
      return p.nodes().reduce(function(n, t) {
        return n[t] = u(p, t, o, r), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, s, c) {
    var u = e("../data/priority-queue");
    s.exports = p;
    var f = () => 1;
    function p(r, n, t, l) {
      return o(r, String(n), t || f, l || function(d) {
        return r.outEdges(d);
      });
    }
    function o(r, n, t, l) {
      var d = {}, h = new u(), i, a, g = function(b) {
        var O = b.v !== i ? b.v : b.w, L = d[O], w = t(b), N = a.distance + w;
        if (w < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + b + " Weight: " + w);
        N < L.distance && (L.distance = N, L.predecessor = i, h.decrease(O, N));
      };
      for (r.nodes().forEach(function(b) {
        var O = b === n ? 0 : Number.POSITIVE_INFINITY;
        d[b] = { distance: O }, h.add(b, O);
      }); h.size() > 0 && (i = h.removeMin(), a = d[i], a.distance !== Number.POSITIVE_INFINITY); )
        l(i).forEach(g);
      return d;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, s, c) {
    var u = e("./tarjan");
    s.exports = f;
    function f(p) {
      return u(p).filter(function(o) {
        return o.length > 1 || o.length === 1 && p.hasEdge(o[0], o[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, s, c) {
    s.exports = f;
    var u = () => 1;
    function f(o, r, n) {
      return p(o, r || u, n || function(t) {
        return o.outEdges(t);
      });
    }
    function p(o, r, n) {
      var t = {}, l = o.nodes();
      return l.forEach(function(d) {
        t[d] = {}, t[d][d] = { distance: 0 }, l.forEach(function(h) {
          d !== h && (t[d][h] = { distance: Number.POSITIVE_INFINITY });
        }), n(d).forEach(function(h) {
          var i = h.v === d ? h.w : h.v, a = r(h);
          t[d][i] = { distance: a, predecessor: d };
        });
      }), l.forEach(function(d) {
        var h = t[d];
        l.forEach(function(i) {
          var a = t[i];
          l.forEach(function(g) {
            var b = a[d], O = h[g], L = a[g], w = b.distance + O.distance;
            w < L.distance && (L.distance = w, L.predecessor = O.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, s, c) {
    s.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, s, c) {
    var u = e("./topsort");
    s.exports = f;
    function f(p) {
      try {
        u(p);
      } catch (o) {
        if (o instanceof u.CycleException)
          return !1;
        throw o;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, s, c) {
    var u = e("./dfs");
    s.exports = f;
    function f(p, o) {
      return u(p, o, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, s, c) {
    var u = e("./dfs");
    s.exports = f;
    function f(p, o) {
      return u(p, o, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, s, c) {
    var u = e("../graph"), f = e("../data/priority-queue");
    s.exports = p;
    function p(o, r) {
      var n = new u(), t = {}, l = new f(), d;
      function h(a) {
        var g = a.v === d ? a.w : a.v, b = l.priority(g);
        if (b !== void 0) {
          var O = r(a);
          O < b && (t[g] = d, l.decrease(g, O));
        }
      }
      if (o.nodeCount() === 0)
        return n;
      o.nodes().forEach(function(a) {
        l.add(a, Number.POSITIVE_INFINITY), n.setNode(a);
      }), l.decrease(o.nodes()[0], 0);
      for (var i = !1; l.size() > 0; ) {
        if (d = l.removeMin(), Object.hasOwn(t, d))
          n.setEdge(d, t[d]);
        else {
          if (i)
            throw new Error("Input graph is not connected: " + o);
          i = !0;
        }
        o.nodeEdges(d).forEach(h);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, s, c) {
    s.exports = u;
    function u(f) {
      var p = 0, o = [], r = {}, n = [];
      function t(l) {
        var d = r[l] = { onStack: !0, lowlink: p, index: p++ };
        if (o.push(l), f.successors(l).forEach(function(a) {
          Object.hasOwn(r, a) ? r[a].onStack && (d.lowlink = Math.min(d.lowlink, r[a].index)) : (t(a), d.lowlink = Math.min(d.lowlink, r[a].lowlink));
        }), d.lowlink === d.index) {
          var h = [], i;
          do
            i = o.pop(), r[i].onStack = !1, h.push(i);
          while (l !== i);
          n.push(h);
        }
      }
      return f.nodes().forEach(function(l) {
        Object.hasOwn(r, l) || t(l);
      }), n;
    }
  }, {}], 42: [function(e, s, c) {
    function u(p) {
      var o = {}, r = {}, n = [];
      function t(l) {
        if (Object.hasOwn(r, l))
          throw new f();
        Object.hasOwn(o, l) || (r[l] = !0, o[l] = !0, p.predecessors(l).forEach(t), delete r[l], n.push(l));
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
    s.exports = u, u.CycleException = f;
  }, {}], 43: [function(e, s, c) {
    class u {
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
        var r = this._arr, n = this._keyIndices, t = r[p], l = r[o];
        r[p] = l, r[o] = t, n[l.key] = p, n[t.key] = o;
      }
    }
    s.exports = u;
  }, {}], 44: [function(e, s, c) {
    var u = "\0", f = "\0", p = "";
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
        var g = arguments, b = this;
        return i.forEach(function(O) {
          g.length > 1 ? b.setNode(O, a) : b.setNode(O);
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
          var g = (b) => a.removeEdge(a._edgeObjs[b]);
          delete this._nodes[i], this._isCompound && (this._removeFromParentsChildList(i), delete this._parent[i], this.children(i).forEach(function(b) {
            a.setParent(b);
          }), delete this._children[i]), Object.keys(this._in[i]).forEach(g), delete this._in[i], delete this._preds[i], Object.keys(this._out[i]).forEach(g), delete this._out[i], delete this._sucs[i], --this._nodeCount;
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
          for (var g = a; g !== void 0; g = this.parent(g))
            if (g === i)
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
          const b = new Set(a);
          for (var g of this.successors(i))
            b.add(g);
          return Array.from(b.values());
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
        var g = this;
        Object.entries(this._nodes).forEach(function([L, w]) {
          i(L) && a.setNode(L, w);
        }), Object.values(this._edgeObjs).forEach(function(L) {
          a.hasNode(L.v) && a.hasNode(L.w) && a.setEdge(L, g.edge(L));
        });
        var b = {};
        function O(L) {
          var w = g.parent(L);
          return w === void 0 || a.hasNode(w) ? (b[L] = w, w) : w in b ? b[w] : O(w);
        }
        return this._isCompound && a.nodes().forEach((L) => a.setParent(L, O(L))), a;
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
        var g = this, b = arguments;
        return i.reduce(function(O, L) {
          return b.length > 1 ? g.setEdge(O, L, a) : g.setEdge(O, L), L;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var i, a, g, b, O = !1, L = arguments[0];
        typeof L == "object" && L !== null && "v" in L ? (i = L.v, a = L.w, g = L.name, arguments.length === 2 && (b = arguments[1], O = !0)) : (i = L, a = arguments[1], g = arguments[3], arguments.length > 2 && (b = arguments[2], O = !0)), i = "" + i, a = "" + a, g !== void 0 && (g = "" + g);
        var w = t(this._isDirected, i, a, g);
        if (Object.hasOwn(this._edgeLabels, w))
          return O && (this._edgeLabels[w] = b), this;
        if (g !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(i), this.setNode(a), this._edgeLabels[w] = O ? b : this._defaultEdgeLabelFn(i, a, g);
        var N = l(this._isDirected, i, a, g);
        return i = N.v, a = N.w, Object.freeze(N), this._edgeObjs[w] = N, r(this._preds[a], i), r(this._sucs[i], a), this._in[a][w] = N, this._out[i][w] = N, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(i, a, g) {
        var b = arguments.length === 1 ? d(this._isDirected, arguments[0]) : t(this._isDirected, i, a, g);
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
      hasEdge(i, a, g) {
        var b = arguments.length === 1 ? d(this._isDirected, arguments[0]) : t(this._isDirected, i, a, g);
        return Object.hasOwn(this._edgeLabels, b);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(i, a, g) {
        var b = arguments.length === 1 ? d(this._isDirected, arguments[0]) : t(this._isDirected, i, a, g), O = this._edgeObjs[b];
        return O && (i = O.v, a = O.w, delete this._edgeLabels[b], delete this._edgeObjs[b], n(this._preds[a], i), n(this._sucs[i], a), delete this._in[a][b], delete this._out[i][b], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(i, a) {
        var g = this._in[i];
        if (g) {
          var b = Object.values(g);
          return a ? b.filter((O) => O.v === a) : b;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(i, a) {
        var g = this._out[i];
        if (g) {
          var b = Object.values(g);
          return a ? b.filter((O) => O.w === a) : b;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(i, a) {
        var g = this.inEdges(i, a);
        if (g)
          return g.concat(this.outEdges(i, a));
      }
    }
    function r(h, i) {
      h[i] ? h[i]++ : h[i] = 1;
    }
    function n(h, i) {
      --h[i] || delete h[i];
    }
    function t(h, i, a, g) {
      var b = "" + i, O = "" + a;
      if (!h && b > O) {
        var L = b;
        b = O, O = L;
      }
      return b + p + O + p + (g === void 0 ? u : g);
    }
    function l(h, i, a, g) {
      var b = "" + i, O = "" + a;
      if (!h && b > O) {
        var L = b;
        b = O, O = L;
      }
      var w = { v: b, w: O };
      return g && (w.name = g), w;
    }
    function d(h, i) {
      return t(h, i.v, i.w, i.name);
    }
    s.exports = o;
  }, {}], 45: [function(e, s, c) {
    s.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, s, c) {
    var u = e("./graph");
    s.exports = { write: f, read: r };
    function f(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: p(n), edges: o(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function p(n) {
      return n.nodes().map(function(t) {
        var l = n.node(t), d = n.parent(t), h = { v: t };
        return l !== void 0 && (h.value = l), d !== void 0 && (h.parent = d), h;
      });
    }
    function o(n) {
      return n.edges().map(function(t) {
        var l = n.edge(t), d = { v: t.v, w: t.w };
        return t.name !== void 0 && (d.name = t.name), l !== void 0 && (d.value = l), d;
      });
    }
    function r(n) {
      var t = new u(n.options).setGraph(n.value);
      return n.nodes.forEach(function(l) {
        t.setNode(l.v, l.value), l.parent && t.setParent(l.v, l.parent);
      }), n.edges.forEach(function(l) {
        t.setEdge({ v: l.v, w: l.w, name: l.name }, l.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, s, c) {
    s.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), En = ["unstarted", "started", "completed", "canceled"];
function xn(e, s) {
  let c = 1;
  const u = () => `${e.slice(0, 40 - String(c).length - 1)}_${c}`;
  for (; s.some((f) => f.id === u()); ) c++;
  return u();
}
function _n(e, s) {
  return [
    ...e.initial === s.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((c) => c.to === s.id || c.from !== "any" && c.from.includes(s.id)).map((c) => `transition ${Kt(c)}`),
    ...e.states.filter((c) => c.regions?.some((u) => u.initial === s.id)).map((c) => `lanes in ${Ye(c)}`),
    ...Object.entries(e.map ?? {}).filter(([, c]) => c === s.id).map(() => "existing item migration")
  ];
}
function On(e, s) {
  return e.states.flatMap((c) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((u) => c.run?.[u] === s.id).map((u) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[u]} handler in ${Ye(c)}`),
    ...(c.timers ?? []).filter((u) => u.then?.transition === s.id).map(() => "a timer")
  ]);
}
const Ye = (e) => e?.name || "Untitled state", Kt = (e) => e.name?.trim() || ve(e.id), Nn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", jn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function In(e, s) {
  if (e.id === s.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const c = e.release_when?.approvals?.min;
    return c ? `Needs ${c} approval${c === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Je(e) : "A person moves it";
}
function Je(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Cn(e, s) {
  const c = e.release_when?.approvals?.min ?? 1, u = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${c === 1 ? "one person approves" : `${c} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Je(e)}.` : "A person chooses when to move the item on.", f = s.policy?.wip?.[e.id]?.limit;
  return u + (f !== void 0 ? ` At most ${f} at a time.` : "");
}
function Ln(e) {
  const s = e.transitions ?? [], c = [], u = /* @__PURE__ */ new Set();
  let f = e.states.find((o) => o.id === e.initial);
  const p = new Map(e.states.map((o, r) => [o.id, r]));
  for (; f && !u.has(f.id) && (c.push(f), u.add(f.id), !(f.category === "completed" || f.category === "canceled")); ) {
    const o = f, r = s.filter((t) => t.from !== "any" && t.from.includes(o.id)), n = r.find((t) => t.default) ?? r.find((t) => !u.has(t.to) && (p.get(t.to) ?? -1) > (p.get(o.id) ?? 0));
    f = e.states.find((t) => t.id === n?.to);
  }
  return c;
}
function He(e) {
  const s = e.states.find((c) => c.id === e.initial);
  return e.migration ?? (s?.kind === "automated" || s?.kind === "parallel" ? "pin" : "follow");
}
const ie = (e) => JSON.parse(JSON.stringify(e));
function An(e) {
  return e?.admin === !0;
}
function Tn(e, s, c) {
  const u = s + c;
  if (s < 0 || s >= e.length || u < 0 || u >= e.length) return;
  const [f] = e.splice(s, 1);
  e.splice(u, 0, f);
}
function Sn(e, s, c) {
  const u = s.code;
  if (u === c) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  s.code = c;
  const f = (n) => n === u ? c : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(f), n.inherit && (n.inherit = n.inherit.map(f));
  const p = (n) => {
    for (const t of n ?? []) "field" in t && t.field === u && (t.field = c);
  }, o = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = f(n.field));
  }, r = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(r);
        return;
      }
      o(n);
      for (const [t, l] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || r(l);
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
      for (const l of t.timers ?? [])
        l.at_field && (l.at_field = f(l.at_field)), l.by && (l.by = f(l.by));
    }
    for (const t of n.transitions ?? []) {
      r(t.when), t.require && (t.require = t.require.map(f));
      for (const l of t.set ?? [])
        l.field = f(l.field), l.copy && (l.copy = f(l.copy));
    }
  }
}
function De({ migration: e, map: s, ...c }) {
  return JSON.stringify(c);
}
function Mn(e, s) {
  const c = ie(e);
  for (const f of c.processes ?? []) {
    const p = s.processes?.find((o) => o.id === f.id);
    if (p && De(f) !== De(p) && (f.migration = "follow"), f.map) {
      for (const [o, r] of Object.entries(f.map))
        (f.states.some((n) => n.id === o) || !f.states.some((n) => n.id === r)) && delete f.map[o];
      Object.keys(f.map).length || delete f.map;
    }
  }
  c.plugins && (c.plugins = c.plugins.map(({ use: f }) => ({ use: f })));
  for (const f of c.fields ?? [])
    f.type?.includes(":") && delete f.form;
  const u = { ...c.remove };
  s.visibility && !c.visibility ? u.visibility = !0 : delete u.visibility;
  for (const f of ["fields", "item_types", "processes", "relation_types"]) {
    const p = (s[f] ?? []).filter((o) => {
      if (f === "fields") {
        const r = o;
        return !c.fields?.some((n) => r.id !== void 0 ? n.id === r.id : n.code === r.code);
      }
      return !(c[f] ?? []).some((r) => "id" in r && r.id === ("id" in o ? o.id : void 0));
    }).map((o) => "code" in o ? o.code : o.id);
    p.length ? u[f] = [.../* @__PURE__ */ new Set([...u[f] ?? [], ...p])] : delete u[f];
  }
  return Object.keys(u).length ? c.remove = u : delete c.remove, c;
}
function Rn(e, s, c) {
  const u = JSON.stringify({ declaration: e, configs: c });
  return {
    declaration: ie(e),
    expected_generation: s,
    plugin_configs: ie(c),
    matches: (f, p, o) => s === p && u === JSON.stringify({ declaration: f, configs: o })
  };
}
function Vn(e) {
  const s = ie(e), c = [...new Set(s.declaration.item_types?.flatMap((f) => f.fields) ?? [])], u = (f) => {
    const p = c.indexOf(f);
    return p < 0 ? c.length : p;
  };
  s.declaration.fields?.sort((f, p) => u(f.code) - u(p.code));
  for (const f of s.declaration.fields ?? []) {
    const p = s.compiled.fields?.find((o) => o.code === f.code);
    f.id ??= p?.id, f.form ??= p?.form;
  }
  for (const f of s.declaration.processes ?? []) f.migration ??= s.compiled.processes?.find((p) => p.id === f.id)?.migration ?? He(f);
  return s;
}
function $n(e, s) {
  return (s.processes ?? []).filter((c) => He(c) !== "pin" && e.changes.some((u) => u.code === "process " + c.id && u.what !== "add" && u.class !== "cosmetic" && u.class !== "refused")).map((c) => c.id);
}
function Dn(e, s, c) {
  const u = [c, `item_type ${c}`, `relation ${c}`, `process ${c}`], f = e.refused.filter((p) => u.includes(p.code));
  return s === "fields" && f.push(...e.changes.filter((p) => p.code === c && p.what === "removed" && p.class === "semantic")), f.length ? f.map(Xt).join(" ") : void 0;
}
function Pn(e, s, c) {
  if (s === "fields") {
    e.fields = e.fields?.filter((u) => u.code !== c);
    for (const u of e.item_types ?? [])
      u.fields = u.fields.filter((f) => f !== c), u.inherit = u.inherit?.filter((f) => f !== c);
  } else s === "item_types" ? e.item_types = e.item_types?.filter((u) => u.id !== c) : s === "processes" ? e.processes = e.processes?.filter((u) => u.id !== c) : e.relation_types = e.relation_types?.filter((u) => u.id !== c);
}
function Xt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function Fn(e, s) {
  if (!(e instanceof de)) return [];
  const c = e.details ?? {};
  let u = typeof c.field == "string" ? c.field : "";
  if (!u) {
    const f = s.processes ?? [], p = typeof c.process != "string" && typeof c.state == "string" ? f.filter((r) => r.states.some((n) => n.id === c.state)) : [], o = typeof c.process == "string" ? f.find((r) => r.id === c.process) : p.length === 1 ? p[0] : void 0;
    o ? u = `process ${o.id}` : typeof c.item_type == "string" && (u = `item_type ${c.item_type}`);
  }
  return u ? [{ code: u, class: "refused", what: "invalid", detail: Ie(e, "The definition is invalid.") }] : [];
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
  const s = Pe(e) ? e.plugins.find((u) => u.problem && u.installed)?.problem : e.problem, c = s ? `${s.message} (Error code: ${s.code})` : Pe(e) && e.plugins.some((u) => !u.installed) ? "A required plugin is unavailable." : void 0;
  return { ...e, title: e.title ?? "Unnamed pack", icon: e.icon ?? "tabler:package-off", disabled: !!c, unavailable: c };
}
function Bn(e, s) {
  return { pack: e.id, version: e.version, expected_generation: s };
}
async function Wn(e, s) {
  const c = { ...ie(e), resolutions: ie(e.resolutions ?? {}) };
  let u = await s(c);
  return c.maps || (c.maps = ie(u.maps), u = await s(c)), { request: c, plan: u };
}
function Qt() {
  let e = 0;
  return () => {
    const s = ++e;
    return () => s === e;
  };
}
function zn() {
  const e = z([]), s = z(!1), c = z(""), u = Qt();
  async function f(o = () => !0) {
    const r = u();
    c.value = "", s.value = !0;
    try {
      const n = await qe.packs();
      r() && o() && (e.value = n);
    } catch (n) {
      r() && o() && (c.value = Ie(n, "Could not load packs."));
    } finally {
      r() && (s.value = !1);
    }
  }
  function p() {
    u(), e.value = [], c.value = "", s.value = !1;
  }
  return { packs: e, loading: s, error: c, load: f, reset: p };
}
export {
  Nn as A,
  Tn as B,
  Ot as C,
  Xt as D,
  Pn as E,
  Sn as F,
  jn as G,
  de as H,
  wt as I,
  xn as J,
  Tt as K,
  Cn as L,
  On as M,
  _n as N,
  Mt as O,
  ye as P,
  Un as Q,
  ie as R,
  Wn as S,
  Bn as T,
  Mn as U,
  $n as V,
  Vn as W,
  Rn as X,
  Fn as Y,
  Dn as Z,
  wn as _,
  Pe as a,
  Rt as b,
  ze as c,
  vn as d,
  An as e,
  Ie as f,
  mn as g,
  kn as h,
  In as i,
  ae as j,
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
  ve as x,
  Nt as y,
  En as z
};
//# sourceMappingURL=usePackDiscovery-B_CfgTNy.js.map
