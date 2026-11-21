import { defineComponent as le, useId as Oe, openBlock as D, createElementBlock as W, unref as F, normalizeClass as qe, createElementVNode as q, createTextVNode as be, toDisplayString as Y, createCommentVNode as ne, renderSlot as oe, ref as K, computed as Z, createBlock as Q, withCtx as ae, createVNode as ee, withKeys as Le, withModifiers as Ae, nextTick as _e, useModel as Ke, mergeModels as Xe, watch as ue, onBeforeUnmount as Ne, onUnmounted as Qe, Fragment as Te, renderList as Me, onMounted as Ze } from "vue";
import he from "primevue/button";
import Ve from "primevue/inputtext";
import et from "primevue/inputnumber";
import tt from "primevue/toggleswitch";
import nt from "primevue/select";
import rt from "primevue/chip";
import { Icon as it } from "@iconify/vue";
import st from "primevue/accordion";
import at from "primevue/accordioncontent";
import ot from "primevue/accordionheader";
import lt from "primevue/accordionpanel";
import dt from "primevue/textarea";
import { e as ut } from "./mount-CDzcrCyw.js";
import { api as $e } from "@wippy-fe/proxy";
const ct = ["aria-labelledby"], ft = { class: "kx-railhead" }, ht = ["id"], pt = { key: 0 }, mt = { class: "kx-railhead-acts" }, bt = { class: "kx-rail-body" }, on = /* @__PURE__ */ le({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const l = Oe();
    return (c, f) => (D(), W("aside", {
      class: qe(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": F(l)
    }, [
      q("div", ft, [
        q("span", {
          id: F(l),
          class: "kx-railhead-title"
        }, [
          be(Y(e.title), 1),
          e.count !== void 0 ? (D(), W("b", pt, Y(e.count), 1)) : ne("", !0)
        ], 8, ht),
        q("div", mt, [
          oe(c.$slots, "actions")
        ])
      ]),
      oe(c.$slots, "toolbar"),
      q("div", bt, [
        oe(c.$slots, "default")
      ])
    ], 10, ct));
  }
});
class re extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(l, c, f) {
    super(l.message ?? l.error ?? `${c} failed`), this.name = "ApiError", this.kind = l.kind, this.details = l.details, this.retryable = l.retryable, this.status = f;
  }
}
const Se = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Pe(e, l) {
  const c = e instanceof re ? e.details?.code : void 0, f = e instanceof Error && e.message || l;
  return typeof c != "string" || !c.trim() ? f : `${Object.hasOwn(Se, c) ? Se[c] : f}
Error code: ${c}`;
}
function De(e, l) {
  const c = e;
  if (c && typeof c == "object" && c.success === !1) throw new re(c, l);
  if (c && typeof c == "object" && c.success === !0 && c.data !== void 0) return c.data;
  throw new re({ kind: "INTERNAL", message: `${l}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, l);
}
function Fe(e, l) {
  if (e instanceof re) return e;
  const c = e?.response;
  return c?.data ? new re(c.data, l, c.status) : e instanceof Error ? e : new re({ kind: "Unavailable" }, l);
}
async function ke(e, l, c) {
  try {
    return De((await $e.get(e, { params: c })).data, l);
  } catch (f) {
    throw Fe(f, l);
  }
}
async function se(e, l, c) {
  try {
    return De((await $e.post(e, l)).data, c);
  } catch (f) {
    throw Fe(f, c);
  }
}
function ce(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ge = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), gt = ["onKeydown"], yt = { class: "work-stack work-tight" }, wt = { class: "work-row work-wrap" }, vt = ["id"], kt = /* @__PURE__ */ le({
  __name: "AddDefinitionRow",
  props: {
    action: {},
    label: {},
    maxlength: {},
    validate: { type: Function }
  },
  emits: ["open", "add"],
  setup(e, { emit: l }) {
    const c = e, f = l, u = K(), h = K(!1), d = K(""), i = Oe(), n = Z(() => d.value.trim()), t = Z(() => n.value ? c.validate?.(n.value) : void 0);
    async function a() {
      f("open"), h.value = !0, await _e(), u.value?.querySelector("input")?.focus();
    }
    async function o() {
      d.value = "", h.value = !1, await _e(), u.value?.querySelector("button")?.focus();
    }
    function p() {
      !n.value || t.value || (f("add", n.value), o());
    }
    return (r, s) => (D(), W("div", {
      ref_key: "row",
      ref: u,
      class: "work-add-definition"
    }, [
      h.value ? (D(), W("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: Le(Ae(o, ["stop", "prevent"]), ["esc"])
      }, [
        q("label", yt, [
          be(Y(e.label) + " ", 1),
          ee(F(Ve), {
            modelValue: d.value,
            "onUpdate:modelValue": s[0] || (s[0] = (m) => d.value = m),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!t.value,
            "aria-describedby": t.value ? F(i) : void 0,
            onKeydown: Le(Ae(p, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        oe(r.$slots, "default"),
        q("div", wt, [
          ee(F(he), {
            type: "button",
            label: e.action,
            size: "small",
            disabled: !n.value || !!t.value,
            onClick: p
          }, null, 8, ["label", "disabled"]),
          ee(F(he), {
            type: "button",
            label: "Cancel",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: o
          })
        ]),
        t.value ? (D(), W("p", {
          key: 0,
          id: F(i),
          class: "work-error work-small",
          role: "status"
        }, Y(t.value), 9, vt)) : ne("", !0)
      ], 40, gt)) : (D(), Q(F(he), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: a
      }, {
        icon: ae(() => [
          ee(F(it), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["label"]))
    ], 512));
  }
}), Et = /* @__PURE__ */ le({
  __name: "Disclosure",
  props: /* @__PURE__ */ Xe({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const l = Ke(e, "open");
    return (c, f) => (D(), Q(F(st), {
      class: "kx-disclosure",
      value: l.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = (u) => l.value = u === "content")
    }, {
      default: ae(() => [
        ee(F(lt), { value: "content" }, {
          default: ae(() => [
            ee(F(ot), { class: "kx-disclosure-toggle" }, {
              default: ae(() => [
                be(Y(e.label), 1)
              ]),
              _: 1
            }),
            ee(F(at), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: ae(() => [
                oe(c.$slots, "default")
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
}), _t = { class: "work-stack work-tight" }, xt = {
  key: 0,
  class: "work-small work-muted"
}, Ot = {
  key: 1,
  role: "alert",
  class: "work-error"
}, Nt = { class: "work-json-example" }, jt = /* @__PURE__ */ le({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const c = e, f = l, u = K(""), h = K("");
    ue(() => c.modelValue, (i) => {
      u.value = i === void 0 ? "" : JSON.stringify(i, null, 2), h.value = "", f("validity", !0);
    }, { immediate: !0 }), Ne(() => f("validity", !0));
    function d(i) {
      u.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && c.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && c.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        h.value = "", f("update:modelValue", n), f("validity", !0);
      } catch (n) {
        h.value = n instanceof Error ? n.message : "Invalid JSON.", f("validity", !1);
      }
    }
    return (i, n) => (D(), Q(Et, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: ae(() => [
        q("label", _t, [
          q("span", null, Y(e.label), 1),
          e.hint ? (D(), W("span", xt, Y(e.hint), 1)) : ne("", !0),
          ee(F(dt), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: u.value,
            "aria-invalid": !!h.value,
            onInput: n[0] || (n[0] = (t) => d(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          h.value ? (D(), W("span", Ot, Y(h.value), 1)) : ne("", !0)
        ]),
        n[1] || (n[1] = q("p", { class: "work-small work-muted" }, "Example", -1)),
        q("pre", Nt, Y(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), Ee = /* @__PURE__ */ new Map();
function me(e, l = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => me(f, l)).join(", ");
  if (typeof e == "string") return l.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const c = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof c[f] == "string" && c[f] && !ge(c[f])) return c[f];
  return l.get(`${c.kind ?? "user"}:${c.id}`) ?? (typeof c.email == "string" && c.email ? c.email : c.kind === "group" ? "Unavailable group" : typeof c.id == "string" ? me(c.id, l) : "Unavailable person");
}
async function It(e, l) {
  const c = [...new Map(l.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, c]), u = Ee.get(f);
  if (u) return u;
  const d = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < c.length; n += 200) {
      const t = await se(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: c.slice(n, n + 200) }, "Display names");
      for (const a of t.principals) a.label.trim() && !ge(a.label) && a.label !== a.id && i.set(`${a.type}:${a.id}`, a.label.trim());
    }
    return i;
  })();
  Ee.set(f, d);
  try {
    return await d;
  } finally {
    Ee.delete(f);
  }
}
function Ct(e, l) {
  const c = K(/* @__PURE__ */ new Map()), f = K("");
  let u = 0;
  return ue([e, l], async ([h, d]) => {
    const i = ++u;
    if (c.value = /* @__PURE__ */ new Map(), f.value = "", !(!h || !d.length))
      try {
        const n = await It(h, d);
        i === u && (c.value = n);
      } catch (n) {
        i === u && (f.value = Pe(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), Qe(() => {
    u++, c.value.clear();
  }), {
    labels: c,
    error: f,
    label: (h) => me(h, c.value),
    remember: (h, d) => {
      d.trim() && !ge(d) && d !== h.id && c.value.set(`${h.kind}:${h.id}`, d.trim());
    }
  };
}
function ye(e) {
  if (ge(e)) return "Untitled";
  const l = e.replace(/[_-]+/g, " ");
  return l.charAt(0).toUpperCase() + l.slice(1);
}
function ln(e) {
  return e.title?.trim() || ye(e.code);
}
function Ge(e, l, c = me) {
  return e == null ? "—" : l?.type === "principal" ? c(e) : Array.isArray(e) ? e.map((f) => Ge(f, l, c)).join(", ") : l?.type === "option" && typeof e == "string" ? l.options?.find((f) => f.id === e)?.label || ye(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (l?.form === "ref" || l?.type === "item") && "unavailable" in e ? "Unavailable" : l?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : l?.form === "ref" && "ref" in e && Array.isArray(e.ref) || l?.form === "ref" && "id" in e && typeof e.id == "string" || l?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function dn(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function un(e, l) {
  const c = Ct(e, l);
  return {
    display: (f, u) => Ge(f, u, c.label),
    principalLabel: c.label,
    rememberPrincipal: c.remember,
    nameError: c.error,
    nameLabels: c.labels
  };
}
function Ue(e) {
  return Object.entries(ce(e.properties)).map(([l, c]) => {
    const f = ce(c);
    return { key: l, title: typeof f.title == "string" && f.title.trim() ? f.title : ye(l), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const xe = (e) => e.type === "array" && ce(e.items).type === "string";
function Lt(e, l) {
  const c = {};
  for (const f of Ue(e)) {
    const u = l[f.key] ?? f.schema.default, h = f.schema;
    let d = "";
    if (u == null)
      Array.isArray(e.required) && e.required.includes(f.key) && (d = "A value is required.");
    else if (Array.isArray(h.enum) && !h.enum.includes(u)) d = "Choose one of the available values.";
    else if (h.type === "integer" || h.type === "number")
      typeof u != "number" || !Number.isFinite(u) || h.type === "integer" && !Number.isInteger(u) ? d = h.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof h.minimum == "number" && u < h.minimum ? d = `Enter at least ${h.minimum}.` : typeof h.maximum == "number" && u > h.maximum && (d = `Enter at most ${h.maximum}.`);
    else if (h.type === "boolean" && typeof u != "boolean") d = "Choose on or off.";
    else if (h.type === "string") {
      if (typeof u != "string") d = "Enter text.";
      else if (typeof h.minLength == "number" && u.length < h.minLength) d = `Enter at least ${h.minLength} characters.`;
      else if (typeof h.maxLength == "number" && u.length > h.maxLength) d = `Enter at most ${h.maxLength} characters.`;
      else if (typeof h.pattern == "string")
        try {
          new RegExp(h.pattern).test(u) || (d = "Use the required format.");
        } catch {
          d = "The declared format is unavailable.";
        }
    } else if (h.type === "array") {
      if (!Array.isArray(u)) d = "Enter a list.";
      else if (typeof h.maxItems == "number" && u.length > h.maxItems) d = `Use at most ${h.maxItems} entries.`;
      else if (typeof h.minItems == "number" && u.length < h.minItems) d = `Use at least ${h.minItems} entries.`;
      else if (h.uniqueItems && new Set(u).size !== u.length) d = "Remove duplicate entries.";
      else if (xe(h)) {
        const i = ce(h.items);
        u.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (d = "Each entry must match the declared text length.");
      }
    } else h.type === "object" && (typeof u != "object" || Array.isArray(u)) && (d = "Enter an object.");
    d && (c[f.key] = d);
  }
  return c;
}
const At = { class: "work-stack" }, Tt = ["inert", "schema", "config"], Mt = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, St = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Rt = { class: "work-config-fields" }, Vt = {
  key: 0,
  class: "work-config-label"
}, $t = ["for"], Pt = {
  key: 3,
  class: "work-config-chips"
}, Dt = {
  key: 8,
  class: "work-muted work-small"
}, Ft = {
  key: 9,
  role: "alert",
  class: "work-error work-small"
}, cn = /* @__PURE__ */ le({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: l }) {
    const c = e, f = l, u = K(/* @__PURE__ */ new Set()), h = K(!1), d = K(!1), i = Oe(), n = Z(() => Ue(c.schema)), t = Z(() => Lt(c.schema, c.modelValue)), a = Z(() => n.value.filter((k) => typeof k.schema.picker == "string")), o = Z(() => n.value.filter((k) => typeof k.schema.picker != "string")), p = Z(() => ({ ...c.schema, properties: Object.fromEntries(a.value.map((k) => [k.key, { ...k.schema, title: k.title }])), required: Array.isArray(c.schema.required) ? c.schema.required.filter((k) => a.value.some((w) => w.key === k)) : [] })), r = Z(() => Object.fromEntries(a.value.map((k) => [k.key, c.modelValue[k.key]]))), s = Z(() => !Object.keys(t.value).length && !u.value.size && (!a.value.length || h.value));
    ue(s, (k) => f("validity", k), { immediate: !0 });
    async function m() {
      d.value = !0, h.value = await ut("wc-schema-form"), d.value = !1;
    }
    ue(() => a.value.length > 0, (k) => {
      k && m();
    }, { immediate: !0 }), Ne(() => f("validity", !0));
    function g(k, w) {
      const b = { ...c.modelValue };
      w == null ? delete b[k] : b[k] = w, f("update:modelValue", b);
    }
    function x(k) {
      const w = c.modelValue[k];
      return Array.isArray(w) ? w.filter((b) => typeof b == "string") : [];
    }
    function C(k, w) {
      w ? u.value.delete(k) : u.value.add(k);
    }
    function v(k) {
      f("update:modelValue", { ...c.modelValue, ...ce(k.detail) });
    }
    return (k, w) => (D(), W("div", At, [
      a.value.length && h.value ? (D(), W("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(p.value),
        config: JSON.stringify(r.value),
        onConfigChanged: v
      }, null, 40, Tt)) : a.value.length && d.value ? (D(), W("p", Mt, "The configuration widget is loading.")) : a.value.length ? (D(), W("p", St, [
        w[0] || (w[0] = be("The configuration widget is unavailable.", -1)),
        ee(F(he), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: m
        })
      ])) : ne("", !0),
      q("div", Rt, [
        (D(!0), W(Te, null, Me(o.value, (b) => (D(), W("div", {
          key: b.key,
          class: "work-config-field"
        }, [
          F(xe)(b.schema) ? (D(), W("span", Vt, Y(b.title), 1)) : (D(), W("label", {
            key: 1,
            class: "work-config-label",
            for: F(i) + "-" + b.key
          }, Y(b.title), 9, $t)),
          Array.isArray(b.schema.enum) ? (D(), Q(F(nt), {
            key: 2,
            "input-id": F(i) + "-" + b.key,
            "model-value": e.modelValue[b.key] ?? b.schema.default,
            options: b.schema.enum,
            appendTo: "self",
            "aria-label": b.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : F(xe)(b.schema) ? (D(), W("div", Pt, [
            (D(!0), W(Te, null, Me(x(b.key), (O, T) => (D(), Q(F(rt), {
              key: T,
              label: O,
              removable: !e.disabled,
              onRemove: (M) => g(b.key, x(b.key).filter((R, y) => y !== T))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            e.disabled ? ne("", !0) : (D(), Q(kt, {
              key: 0,
              action: "Add value",
              label: "Add " + b.title.toLocaleLowerCase(),
              onAdd: (O) => g(b.key, [...x(b.key), O])
            }, null, 8, ["label", "onAdd"]))
          ])) : ["integer", "number"].includes(String(b.schema.type)) ? (D(), Q(F(et), {
            key: 4,
            "input-id": F(i) + "-" + b.key,
            "model-value": e.modelValue[b.key] ?? b.schema.default,
            "max-fraction-digits": b.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": b.title,
            disabled: e.disabled,
            invalid: !!t.value[b.key],
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : b.schema.type === "boolean" ? (D(), Q(F(tt), {
            key: 5,
            "input-id": F(i) + "-" + b.key,
            "model-value": !!(e.modelValue[b.key] ?? b.schema.default),
            "aria-label": b.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(b.schema.type)) ? (D(), Q(jt, {
            key: 6,
            label: b.title,
            "model-value": e.modelValue[b.key],
            shape: b.schema.type === "array" ? "array" : "object",
            example: b.schema.default ?? (b.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (O) => g(b.key, O),
            onValidity: (O) => C(b.key, O)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (D(), Q(F(Ve), {
            key: 7,
            id: F(i) + "-" + b.key,
            "model-value": e.modelValue[b.key] ?? b.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!t.value[b.key],
            "aria-label": b.title,
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          b.description ? (D(), W("p", Dt, Y(b.description), 1)) : ne("", !0),
          t.value[b.key] ? (D(), W("p", Ft, Y(t.value[b.key]), 1)) : ne("", !0)
        ]))), 128))
      ])
    ]));
  }
}), Gt = ["aria-label", "aria-busy"], fn = /* @__PURE__ */ le({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: l }) {
    const c = e, f = l, u = K(null);
    let h = null;
    async function d() {
      await _e();
      const n = u.value;
      if (n)
        if (c.visible && !n.open) {
          const t = n.getRootNode();
          h = c.returnFocus ?? t.activeElement, n.showModal();
        } else !c.visible && n.open && (n.close(), h?.focus());
    }
    function i(n) {
      n.preventDefault(), c.busy || f("close");
    }
    return ue(() => c.visible, d), Ze(d), Ne(() => {
      u.value?.open && u.value.close(), h?.focus();
    }), (n, t) => (D(), W("dialog", {
      ref_key: "dialog",
      ref: u,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && f("close");
      })
    }, [
      oe(n.$slots, "default")
    ], 40, Gt));
  }
}), pe = "/api/v1/work", fe = (e) => `${pe}/boards/${encodeURIComponent(e)}`, Ut = {
  boards: async () => {
    const e = [];
    let l;
    do {
      const c = await ke(`${pe}/boards${l ? "?after=" + encodeURIComponent(l) : ""}`, "Boards");
      e.push(...c.boards), l = c.next;
    } while (l);
    return e;
  },
  packs: () => ke(`${pe}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, l, c, f = {}) => se(`${pe}/boards`, { title: e, declaration: l, idempotency_key: c, ...f }, "Create board"),
  updateBoard: (e, l) => se(`${fe(e)}/update`, l, "Update board"),
  schema: (e, l, c) => se(`${fe(e)}/get_schema`, { generation: l, ...c ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, l) => se(`${fe(e)}/query`, l, "Item choices"),
  async stateCounts(e) {
    const l = /* @__PURE__ */ Object.create(null);
    let c;
    do {
      const f = await Ut.query(e, { group_by: "type", sub_group_by: "state", group_after: c, limit: 1 });
      if (f.incomplete || f.reindexing) throw new Error("Counts unavailable");
      for (const u of f.groups ?? []) {
        if (typeof u.value != "string") continue;
        const h = l[u.value] ??= /* @__PURE__ */ Object.create(null);
        for (const d of u.groups ?? []) typeof d.value == "string" && (h[d.value] = d.count);
      }
      c = f.group_after;
    } while (c);
    return l;
  },
  item: (e, l) => se(`${fe(e)}/get`, { item: l }, "Item choice"),
  async options(e) {
    const l = await ke(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
    return {
      ...l,
      guards: Array.isArray(l.guards) ? l.guards : [],
      filters: Array.isArray(l.filters) ? l.filters : [],
      board_apps: Array.isArray(l.board_apps) ? l.board_apps : []
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
const hn = (function() {
  return (/* @__PURE__ */ (function() {
    function e(l, c, f) {
      function u(i, n) {
        if (!c[i]) {
          if (!l[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (h) return h(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var o = c[i] = { exports: {} };
          l[i][0].call(o.exports, function(p) {
            var r = l[i][1][p];
            return u(r || p);
          }, o, o.exports, e, l, c, f);
        }
        return c[i].exports;
      }
      for (var h = typeof require == "function" && require, d = 0; d < f.length; d++) u(f[d]);
      return u;
    }
    return e;
  })())({ 1: [function(e, l, c) {
    l.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, l, c) {
    let f = e("./greedy-fas"), u = e("./util").uniqueId;
    l.exports = { run: h, undo: i };
    function h(n) {
      (n.graph().acyclicer === "greedy" ? f(n, a(n)) : d(n)).forEach((o) => {
        let p = n.edge(o);
        n.removeEdge(o), p.forwardName = o.name, p.reversed = !0, n.setEdge(o.w, o.v, p, u("rev"));
      });
      function a(o) {
        return (p) => o.edge(p).weight;
      }
    }
    function d(n) {
      let t = [], a = {}, o = {};
      function p(r) {
        Object.hasOwn(o, r) || (o[r] = !0, a[r] = !0, n.outEdges(r).forEach((s) => {
          Object.hasOwn(a, s.w) ? t.push(s) : p(s.w);
        }), delete a[r]);
      }
      return n.nodes().forEach(p), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let a = n.edge(t);
        if (a.reversed) {
          n.removeEdge(t);
          let o = a.forwardName;
          delete a.reversed, delete a.forwardName, n.setEdge(t.w, t.v, a, o);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, l, c) {
    let f = e("./util");
    l.exports = u;
    function u(d) {
      function i(n) {
        let t = d.children(n), a = d.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(a, "minRank")) {
          a.borderLeft = [], a.borderRight = [];
          for (let o = a.minRank, p = a.maxRank + 1; o < p; ++o)
            h(d, "borderLeft", "_bl", n, a, o), h(d, "borderRight", "_br", n, a, o);
        }
      }
      d.children().forEach(i);
    }
    function h(d, i, n, t, a, o) {
      let p = { width: 0, height: 0, rank: o, borderType: i }, r = a[i][o - 1], s = f.addDummyNode(d, "border", p, n);
      a[i][o] = s, d.setParent(s, t), r && d.setEdge(r, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, l, c) {
    l.exports = { adjust: f, undo: u };
    function f(o) {
      let p = o.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && h(o);
    }
    function u(o) {
      let p = o.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(o), (p === "lr" || p === "rl") && (t(o), h(o));
    }
    function h(o) {
      o.nodes().forEach((p) => d(o.node(p))), o.edges().forEach((p) => d(o.edge(p)));
    }
    function d(o) {
      let p = o.width;
      o.width = o.height, o.height = p;
    }
    function i(o) {
      o.nodes().forEach((p) => n(o.node(p))), o.edges().forEach((p) => {
        let r = o.edge(p);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(o) {
      o.y = -o.y;
    }
    function t(o) {
      o.nodes().forEach((p) => a(o.node(p))), o.edges().forEach((p) => {
        let r = o.edge(p);
        r.points.forEach(a), Object.hasOwn(r, "x") && a(r);
      });
    }
    function a(o) {
      let p = o.x;
      o.x = o.y, o.y = p;
    }
  }, {}], 5: [function(e, l, c) {
    class f {
      constructor() {
        let i = {};
        i._next = i._prev = i, this._sentinel = i;
      }
      dequeue() {
        let i = this._sentinel, n = i._prev;
        if (n !== i)
          return u(n), n;
      }
      enqueue(i) {
        let n = this._sentinel;
        i._prev && i._next && u(i), i._next = n._next, n._next._prev = i, n._next = i, i._prev = n;
      }
      toString() {
        let i = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          i.push(JSON.stringify(t, h)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function u(d) {
      d._prev._next = d._next, d._next._prev = d._prev, delete d._next, delete d._prev;
    }
    function h(d, i) {
      if (d !== "_next" && d !== "_prev")
        return i;
    }
    l.exports = f;
  }, {}], 6: [function(e, l, c) {
    let f = e("./util"), u = e("@dagrejs/graphlib").Graph;
    l.exports = { debugOrdering: h };
    function h(d) {
      let i = f.buildLayerMatrix(d), n = new u({ compound: !0, multigraph: !0 }).setGraph({});
      return d.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + d.node(t).rank);
      }), d.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, a) => {
        let o = "layer" + a;
        n.setNode(o, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, l, c) {
    let f = e("@dagrejs/graphlib").Graph, u = e("./data/list");
    l.exports = d;
    let h = () => 1;
    function d(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let s = t(p, r || h);
      return i(s.graph, s.buckets, s.zeroIdx).flatMap((g) => p.outEdges(g.v, g.w));
    }
    function i(p, r, s) {
      let m = [], g = r[r.length - 1], x = r[0], C;
      for (; p.nodeCount(); ) {
        for (; C = x.dequeue(); )
          n(p, r, s, C);
        for (; C = g.dequeue(); )
          n(p, r, s, C);
        if (p.nodeCount()) {
          for (let v = r.length - 2; v > 0; --v)
            if (C = r[v].dequeue(), C) {
              m = m.concat(n(p, r, s, C, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(p, r, s, m, g) {
      let x = g ? [] : void 0;
      return p.inEdges(m.v).forEach((C) => {
        let v = p.edge(C), k = p.node(C.v);
        g && x.push({ v: C.v, w: C.w }), k.out -= v, a(r, s, k);
      }), p.outEdges(m.v).forEach((C) => {
        let v = p.edge(C), k = C.w, w = p.node(k);
        w.in -= v, a(r, s, w);
      }), p.removeNode(m.v), x;
    }
    function t(p, r) {
      let s = new f(), m = 0, g = 0;
      p.nodes().forEach((v) => {
        s.setNode(v, { v, in: 0, out: 0 });
      }), p.edges().forEach((v) => {
        let k = s.edge(v.v, v.w) || 0, w = r(v), b = k + w;
        s.setEdge(v.v, v.w, b), g = Math.max(g, s.node(v.v).out += w), m = Math.max(m, s.node(v.w).in += w);
      });
      let x = o(g + m + 3).map(() => new u()), C = m + 1;
      return s.nodes().forEach((v) => {
        a(x, C, s.node(v));
      }), { graph: s, buckets: x, zeroIdx: C };
    }
    function a(p, r, s) {
      s.out ? s.in ? p[s.out - s.in + r].enqueue(s) : p[p.length - 1].enqueue(s) : p[0].enqueue(s);
    }
    function o(p) {
      const r = [];
      for (let s = 0; s < p; s++)
        r.push(s);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, l, c) {
    let f = e("./acyclic"), u = e("./normalize"), h = e("./rank"), d = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), a = e("./add-border-segments"), o = e("./coordinate-system"), p = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    l.exports = g;
    function g(_, j) {
      let L = j && j.debugTiming ? s.time : s.notime;
      L("layout", () => {
        let S = L("  buildLayoutGraph", () => y(_));
        L("  runLayout", () => x(S, L, j)), L("  updateInputGraph", () => C(_, S));
      });
    }
    function x(_, j, L) {
      j("    makeSpaceForEdgeLabels", () => E(_)), j("    removeSelfEdges", () => Ye(_)), j("    acyclic", () => f.run(_)), j("    nestingGraph.run", () => t.run(_)), j("    rank", () => h(s.asNonCompoundGraph(_))), j("    injectEdgeLabelProxies", () => N(_)), j("    removeEmptyRanks", () => n(_)), j("    nestingGraph.cleanup", () => t.cleanup(_)), j("    normalizeRanks", () => d(_)), j("    assignRankMinMax", () => I(_)), j("    removeEdgeLabelProxies", () => A(_)), j("    normalize.run", () => u.run(_)), j("    parentDummyChains", () => i(_)), j("    addBorderSegments", () => a(_)), j("    order", () => p(_, L)), j("    insertSelfEdges", () => Je(_)), j("    adjustCoordinateSystem", () => o.adjust(_)), j("    position", () => r(_)), j("    positionSelfEdges", () => He(_)), j("    removeBorderNodes", () => te(_)), j("    normalize.undo", () => u.undo(_)), j("    fixupEdgeLabelCoords", () => U(_)), j("    undoCoordinateSystem", () => o.undo(_)), j("    translateGraph", () => V(_)), j("    assignNodeIntersects", () => $(_)), j("    reversePoints", () => X(_)), j("    acyclic.undo", () => f.undo(_));
    }
    function C(_, j) {
      _.nodes().forEach((L) => {
        let S = _.node(L), P = j.node(L);
        S && (S.x = P.x, S.y = P.y, S.rank = P.rank, j.children(L).length && (S.width = P.width, S.height = P.height));
      }), _.edges().forEach((L) => {
        let S = _.edge(L), P = j.edge(L);
        S.points = P.points, Object.hasOwn(P, "x") && (S.x = P.x, S.y = P.y);
      }), _.graph().width = j.graph().width, _.graph().height = j.graph().height;
    }
    let v = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], k = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, w = ["acyclicer", "ranker", "rankdir", "align"], b = ["width", "height", "rank"], O = { width: 0, height: 0 }, T = ["minlen", "weight", "width", "height", "labeloffset"], M = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, R = ["labelpos"];
    function y(_) {
      let j = new m({ multigraph: !0, compound: !0 }), L = ve(_.graph());
      return j.setGraph(Object.assign({}, k, we(L, v), s.pick(L, w))), _.nodes().forEach((S) => {
        let P = ve(_.node(S));
        const G = we(P, b);
        Object.keys(O).forEach((B) => {
          G[B] === void 0 && (G[B] = O[B]);
        }), j.setNode(S, G), j.setParent(S, _.parent(S));
      }), _.edges().forEach((S) => {
        let P = ve(_.edge(S));
        j.setEdge(S, Object.assign({}, M, we(P, T), s.pick(P, R)));
      }), j;
    }
    function E(_) {
      let j = _.graph();
      j.ranksep /= 2, _.edges().forEach((L) => {
        let S = _.edge(L);
        S.minlen *= 2, S.labelpos.toLowerCase() !== "c" && (j.rankdir === "TB" || j.rankdir === "BT" ? S.width += S.labeloffset : S.height += S.labeloffset);
      });
    }
    function N(_) {
      _.edges().forEach((j) => {
        let L = _.edge(j);
        if (L.width && L.height) {
          let S = _.node(j.v), G = { rank: (_.node(j.w).rank - S.rank) / 2 + S.rank, e: j };
          s.addDummyNode(_, "edge-proxy", G, "_ep");
        }
      });
    }
    function I(_) {
      let j = 0;
      _.nodes().forEach((L) => {
        let S = _.node(L);
        S.borderTop && (S.minRank = _.node(S.borderTop).rank, S.maxRank = _.node(S.borderBottom).rank, j = Math.max(j, S.maxRank));
      }), _.graph().maxRank = j;
    }
    function A(_) {
      _.nodes().forEach((j) => {
        let L = _.node(j);
        L.dummy === "edge-proxy" && (_.edge(L.e).labelRank = L.rank, _.removeNode(j));
      });
    }
    function V(_) {
      let j = Number.POSITIVE_INFINITY, L = 0, S = Number.POSITIVE_INFINITY, P = 0, G = _.graph(), B = G.marginx || 0, J = G.marginy || 0;
      function je(H) {
        let z = H.x, de = H.y, Ie = H.width, Ce = H.height;
        j = Math.min(j, z - Ie / 2), L = Math.max(L, z + Ie / 2), S = Math.min(S, de - Ce / 2), P = Math.max(P, de + Ce / 2);
      }
      _.nodes().forEach((H) => je(_.node(H))), _.edges().forEach((H) => {
        let z = _.edge(H);
        Object.hasOwn(z, "x") && je(z);
      }), j -= B, S -= J, _.nodes().forEach((H) => {
        let z = _.node(H);
        z.x -= j, z.y -= S;
      }), _.edges().forEach((H) => {
        let z = _.edge(H);
        z.points.forEach((de) => {
          de.x -= j, de.y -= S;
        }), Object.hasOwn(z, "x") && (z.x -= j), Object.hasOwn(z, "y") && (z.y -= S);
      }), G.width = L - j + B, G.height = P - S + J;
    }
    function $(_) {
      _.edges().forEach((j) => {
        let L = _.edge(j), S = _.node(j.v), P = _.node(j.w), G, B;
        L.points ? (G = L.points[0], B = L.points[L.points.length - 1]) : (L.points = [], G = P, B = S), L.points.unshift(s.intersectRect(S, G)), L.points.push(s.intersectRect(P, B));
      });
    }
    function U(_) {
      _.edges().forEach((j) => {
        let L = _.edge(j);
        if (Object.hasOwn(L, "x"))
          switch ((L.labelpos === "l" || L.labelpos === "r") && (L.width -= L.labeloffset), L.labelpos) {
            case "l":
              L.x -= L.width / 2 + L.labeloffset;
              break;
            case "r":
              L.x += L.width / 2 + L.labeloffset;
              break;
          }
      });
    }
    function X(_) {
      _.edges().forEach((j) => {
        let L = _.edge(j);
        L.reversed && L.points.reverse();
      });
    }
    function te(_) {
      _.nodes().forEach((j) => {
        if (_.children(j).length) {
          let L = _.node(j), S = _.node(L.borderTop), P = _.node(L.borderBottom), G = _.node(L.borderLeft[L.borderLeft.length - 1]), B = _.node(L.borderRight[L.borderRight.length - 1]);
          L.width = Math.abs(B.x - G.x), L.height = Math.abs(P.y - S.y), L.x = G.x + L.width / 2, L.y = S.y + L.height / 2;
        }
      }), _.nodes().forEach((j) => {
        _.node(j).dummy === "border" && _.removeNode(j);
      });
    }
    function Ye(_) {
      _.edges().forEach((j) => {
        if (j.v === j.w) {
          var L = _.node(j.v);
          L.selfEdges || (L.selfEdges = []), L.selfEdges.push({ e: j, label: _.edge(j) }), _.removeEdge(j);
        }
      });
    }
    function Je(_) {
      var j = s.buildLayerMatrix(_);
      j.forEach((L) => {
        var S = 0;
        L.forEach((P, G) => {
          var B = _.node(P);
          B.order = G + S, (B.selfEdges || []).forEach((J) => {
            s.addDummyNode(_, "selfedge", { width: J.label.width, height: J.label.height, rank: B.rank, order: G + ++S, e: J.e, label: J.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function He(_) {
      _.nodes().forEach((j) => {
        var L = _.node(j);
        if (L.dummy === "selfedge") {
          var S = _.node(L.e.v), P = S.x + S.width / 2, G = S.y, B = L.x - P, J = S.height / 2;
          _.setEdge(L.e, L.label), _.removeNode(j), L.label.points = [{ x: P + 2 * B / 3, y: G - J }, { x: P + 5 * B / 6, y: G - J }, { x: P + B, y: G }, { x: P + 5 * B / 6, y: G + J }, { x: P + 2 * B / 3, y: G + J }], L.label.x = L.x, L.label.y = L.y;
        }
      });
    }
    function we(_, j) {
      return s.mapValues(s.pick(_, j), Number);
    }
    function ve(_) {
      var j = {};
      return _ && Object.entries(_).forEach(([L, S]) => {
        typeof L == "string" && (L = L.toLowerCase()), j[L] = S;
      }), j;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, l, c) {
    let f = e("./util");
    l.exports = { run: u, cleanup: n };
    function u(t) {
      let a = f.addDummyNode(t, "root", {}, "_root"), o = d(t), p = Object.values(o), r = f.applyWithChunking(Math.max, p) - 1, s = 2 * r + 1;
      t.graph().nestingRoot = a, t.edges().forEach((g) => t.edge(g).minlen *= s);
      let m = i(t) + 1;
      t.children().forEach((g) => h(t, a, s, m, r, o, g)), t.graph().nodeRankFactor = s;
    }
    function h(t, a, o, p, r, s, m) {
      let g = t.children(m);
      if (!g.length) {
        m !== a && t.setEdge(a, m, { weight: 0, minlen: o });
        return;
      }
      let x = f.addBorderNode(t, "_bt"), C = f.addBorderNode(t, "_bb"), v = t.node(m);
      t.setParent(x, m), v.borderTop = x, t.setParent(C, m), v.borderBottom = C, g.forEach((k) => {
        h(t, a, o, p, r, s, k);
        let w = t.node(k), b = w.borderTop ? w.borderTop : k, O = w.borderBottom ? w.borderBottom : k, T = w.borderTop ? p : 2 * p, M = b !== O ? 1 : r - s[m] + 1;
        t.setEdge(x, b, { weight: T, minlen: M, nestingEdge: !0 }), t.setEdge(O, C, { weight: T, minlen: M, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(a, x, { weight: 0, minlen: r + s[m] });
    }
    function d(t) {
      var a = {};
      function o(p, r) {
        var s = t.children(p);
        s && s.length && s.forEach((m) => o(m, r + 1)), a[p] = r;
      }
      return t.children().forEach((p) => o(p, 1)), a;
    }
    function i(t) {
      return t.edges().reduce((a, o) => a + t.edge(o).weight, 0);
    }
    function n(t) {
      var a = t.graph();
      t.removeNode(a.nestingRoot), delete a.nestingRoot, t.edges().forEach((o) => {
        var p = t.edge(o);
        p.nestingEdge && t.removeEdge(o);
      });
    }
  }, { "./util": 27 }], 10: [function(e, l, c) {
    let f = e("./util");
    l.exports = { run: u, undo: d };
    function u(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => h(i, n));
    }
    function h(i, n) {
      let t = n.v, a = i.node(t).rank, o = n.w, p = i.node(o).rank, r = n.name, s = i.edge(n), m = s.labelRank;
      if (p === a + 1) return;
      i.removeEdge(n);
      let g, x, C;
      for (C = 0, ++a; a < p; ++C, ++a)
        s.points = [], x = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: a }, g = f.addDummyNode(i, "edge", x, "_d"), a === m && (x.width = s.width, x.height = s.height, x.dummy = "edge-label", x.labelpos = s.labelpos), i.setEdge(t, g, { weight: s.weight }, r), C === 0 && i.graph().dummyChains.push(g), t = g;
      i.setEdge(t, o, { weight: s.weight }, r);
    }
    function d(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), a = t.edgeLabel, o;
        for (i.setEdge(t.edgeObj, a); t.dummy; )
          o = i.successors(n)[0], i.removeNode(n), a.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (a.x = t.x, a.y = t.y, a.width = t.width, a.height = t.height), n = o, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, l, c) {
    l.exports = f;
    function f(u, h, d) {
      let i = {}, n;
      d.forEach((t) => {
        let a = u.parent(t), o, p;
        for (; a; ) {
          if (o = u.parent(a), o ? (p = i[o], i[o] = a) : (p = n, n = a), p && p !== a) {
            h.setEdge(p, a);
            return;
          }
          a = o;
        }
      });
    }
  }, {}], 12: [function(e, l, c) {
    l.exports = f;
    function f(u, h = []) {
      return h.map((d) => {
        let i = u.inEdges(d);
        if (i.length) {
          let n = i.reduce((t, a) => {
            let o = u.edge(a), p = u.node(a.v);
            return { sum: t.sum + o.weight * p.order, weight: t.weight + o.weight };
          }, { sum: 0, weight: 0 });
          return { v: d, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: d };
      });
    }
  }, {}], 13: [function(e, l, c) {
    let f = e("@dagrejs/graphlib").Graph, u = e("../util");
    l.exports = h;
    function h(i, n, t, a) {
      a || (a = i.nodes());
      let o = d(i), p = new f({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((r) => i.node(r));
      return a.forEach((r) => {
        let s = i.node(r), m = i.parent(r);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (p.setNode(r), p.setParent(r, m || o), i[t](r).forEach((g) => {
          let x = g.v === r ? g.w : g.v, C = p.edge(x, r), v = C !== void 0 ? C.weight : 0;
          p.setEdge(x, r, { weight: i.edge(g).weight + v });
        }), Object.hasOwn(s, "minRank") && p.setNode(r, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
      }), p;
    }
    function d(i) {
      for (var n; i.hasNode(n = u.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, l, c) {
    let f = e("../util").zipObject;
    l.exports = u;
    function u(d, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += h(d, i[t - 1], i[t]);
      return n;
    }
    function h(d, i, n) {
      let t = f(n, n.map((m, g) => g)), a = i.flatMap((m) => d.outEdges(m).map((g) => ({ pos: t[g.w], weight: d.edge(g).weight })).sort((g, x) => g.pos - x.pos)), o = 1;
      for (; o < n.length; ) o <<= 1;
      let p = 2 * o - 1;
      o -= 1;
      let r = new Array(p).fill(0), s = 0;
      return a.forEach((m) => {
        let g = m.pos + o;
        r[g] += m.weight;
        let x = 0;
        for (; g > 0; )
          g % 2 && (x += r[g + 1]), g = g - 1 >> 1, r[g] += m.weight;
        s += m.weight * x;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, l, c) {
    let f = e("./init-order"), u = e("./cross-count"), h = e("./sort-subgraph"), d = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    l.exports = a;
    function a(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, a);
        return;
      }
      let g = t.maxRank(s), x = o(s, t.range(1, g + 1), "inEdges"), C = o(s, t.range(g - 1, -1, -1), "outEdges"), v = f(s);
      if (r(s, v), m && m.disableOptimalOrderHeuristic)
        return;
      let k = Number.POSITIVE_INFINITY, w;
      for (let b = 0, O = 0; O < 4; ++b, ++O) {
        p(b % 2 ? x : C, b % 4 >= 2), v = t.buildLayerMatrix(s);
        let T = u(s, v);
        T < k && (O = 0, w = Object.assign({}, v), k = T);
      }
      r(s, w);
    }
    function o(s, m, g) {
      const x = /* @__PURE__ */ new Map(), C = (v, k) => {
        x.has(v) || x.set(v, []), x.get(v).push(k);
      };
      for (const v of s.nodes()) {
        const k = s.node(v);
        if (typeof k.rank == "number" && C(k.rank, v), typeof k.minRank == "number" && typeof k.maxRank == "number")
          for (let w = k.minRank; w <= k.maxRank; w++)
            w !== k.rank && C(w, v);
      }
      return m.map(function(v) {
        return d(s, v, g, x.get(v) || []);
      });
    }
    function p(s, m) {
      let g = new n();
      s.forEach(function(x) {
        let C = x.graph().root, v = h(x, C, g, m);
        v.vs.forEach((k, w) => x.node(k).order = w), i(x, g, v.vs);
      });
    }
    function r(s, m) {
      Object.values(m).forEach((g) => g.forEach((x, C) => s.node(x).order = C));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, l, c) {
    let f = e("../util");
    l.exports = u;
    function u(h) {
      let d = {}, i = h.nodes().filter((r) => !h.children(r).length), n = i.map((r) => h.node(r).rank), t = f.applyWithChunking(Math.max, n), a = f.range(t + 1).map(() => []);
      function o(r) {
        if (d[r]) return;
        d[r] = !0;
        let s = h.node(r);
        a[s.rank].push(r), h.successors(r).forEach(o);
      }
      return i.sort((r, s) => h.node(r).rank - h.node(s).rank).forEach(o), a;
    }
  }, { "../util": 27 }], 17: [function(e, l, c) {
    let f = e("../util");
    l.exports = u;
    function u(i, n) {
      let t = {};
      i.forEach((o, p) => {
        let r = t[o.v] = { indegree: 0, in: [], out: [], vs: [o.v], i: p };
        o.barycenter !== void 0 && (r.barycenter = o.barycenter, r.weight = o.weight);
      }), n.edges().forEach((o) => {
        let p = t[o.v], r = t[o.w];
        p !== void 0 && r !== void 0 && (r.indegree++, p.out.push(t[o.w]));
      });
      let a = Object.values(t).filter((o) => !o.indegree);
      return h(a);
    }
    function h(i) {
      let n = [];
      function t(o) {
        return (p) => {
          p.merged || (p.barycenter === void 0 || o.barycenter === void 0 || p.barycenter >= o.barycenter) && d(o, p);
        };
      }
      function a(o) {
        return (p) => {
          p.in.push(o), --p.indegree === 0 && i.push(p);
        };
      }
      for (; i.length; ) {
        let o = i.pop();
        n.push(o), o.in.reverse().forEach(t(o)), o.out.forEach(a(o));
      }
      return n.filter((o) => !o.merged).map((o) => f.pick(o, ["vs", "i", "barycenter", "weight"]));
    }
    function d(i, n) {
      let t = 0, a = 0;
      i.weight && (t += i.barycenter * i.weight, a += i.weight), n.weight && (t += n.barycenter * n.weight, a += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / a, i.weight = a, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, l, c) {
    let f = e("./barycenter"), u = e("./resolve-conflicts"), h = e("./sort");
    l.exports = d;
    function d(t, a, o, p) {
      let r = t.children(a), s = t.node(a), m = s ? s.borderLeft : void 0, g = s ? s.borderRight : void 0, x = {};
      m && (r = r.filter((w) => w !== m && w !== g));
      let C = f(t, r);
      C.forEach((w) => {
        if (t.children(w.v).length) {
          let b = d(t, w.v, o, p);
          x[w.v] = b, Object.hasOwn(b, "barycenter") && n(w, b);
        }
      });
      let v = u(C, o);
      i(v, x);
      let k = h(v, p);
      if (m && (k.vs = [m, k.vs, g].flat(!0), t.predecessors(m).length)) {
        let w = t.node(t.predecessors(m)[0]), b = t.node(t.predecessors(g)[0]);
        Object.hasOwn(k, "barycenter") || (k.barycenter = 0, k.weight = 0), k.barycenter = (k.barycenter * k.weight + w.order + b.order) / (k.weight + 2), k.weight += 2;
      }
      return k;
    }
    function i(t, a) {
      t.forEach((o) => {
        o.vs = o.vs.flatMap((p) => a[p] ? a[p].vs : p);
      });
    }
    function n(t, a) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + a.barycenter * a.weight) / (t.weight + a.weight), t.weight += a.weight) : (t.barycenter = a.barycenter, t.weight = a.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, l, c) {
    let f = e("../util");
    l.exports = u;
    function u(i, n) {
      let t = f.partition(i, (x) => Object.hasOwn(x, "barycenter")), a = t.lhs, o = t.rhs.sort((x, C) => C.i - x.i), p = [], r = 0, s = 0, m = 0;
      a.sort(d(!!n)), m = h(p, o, m), a.forEach((x) => {
        m += x.vs.length, p.push(x.vs), r += x.barycenter * x.weight, s += x.weight, m = h(p, o, m);
      });
      let g = { vs: p.flat(!0) };
      return s && (g.barycenter = r / s, g.weight = s), g;
    }
    function h(i, n, t) {
      let a;
      for (; n.length && (a = n[n.length - 1]).i <= t; )
        n.pop(), i.push(a.vs), t++;
      return t;
    }
    function d(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, l, c) {
    l.exports = f;
    function f(d) {
      let i = h(d);
      d.graph().dummyChains.forEach((n) => {
        let t = d.node(n), a = t.edgeObj, o = u(d, i, a.v, a.w), p = o.path, r = o.lca, s = 0, m = p[s], g = !0;
        for (; n !== a.w; ) {
          if (t = d.node(n), g) {
            for (; (m = p[s]) !== r && d.node(m).maxRank < t.rank; )
              s++;
            m === r && (g = !1);
          }
          if (!g) {
            for (; s < p.length - 1 && d.node(m = p[s + 1]).minRank <= t.rank; )
              s++;
            m = p[s];
          }
          d.setParent(n, m), n = d.successors(n)[0];
        }
      });
    }
    function u(d, i, n, t) {
      let a = [], o = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), s, m;
      s = n;
      do
        s = d.parent(s), a.push(s);
      while (s && (i[s].low > p || r > i[s].lim));
      for (m = s, s = t; (s = d.parent(s)) !== m; )
        o.push(s);
      return { path: a.concat(o.reverse()), lca: m };
    }
    function h(d) {
      let i = {}, n = 0;
      function t(a) {
        let o = n;
        d.children(a).forEach(t), i[a] = { low: o, lim: n++ };
      }
      return d.children().forEach(t), i;
    }
  }, {}], 21: [function(e, l, c) {
    let f = e("@dagrejs/graphlib").Graph, u = e("../util");
    l.exports = { positionX: g, findType1Conflicts: h, findType2Conflicts: d, addConflict: n, hasConflict: t, verticalAlignment: a, horizontalCompaction: o, alignCoordinates: s, findSmallestWidthAlignment: r, balance: m };
    function h(v, k) {
      let w = {};
      function b(O, T) {
        let M = 0, R = 0, y = O.length, E = T[T.length - 1];
        return T.forEach((N, I) => {
          let A = i(v, N), V = A ? v.node(A).order : y;
          (A || N === E) && (T.slice(R, I + 1).forEach(($) => {
            v.predecessors($).forEach((U) => {
              let X = v.node(U), te = X.order;
              (te < M || V < te) && !(X.dummy && v.node($).dummy) && n(w, U, $);
            });
          }), R = I + 1, M = V);
        }), T;
      }
      return k.length && k.reduce(b), w;
    }
    function d(v, k) {
      let w = {};
      function b(T, M, R, y, E) {
        let N;
        u.range(M, R).forEach((I) => {
          N = T[I], v.node(N).dummy && v.predecessors(N).forEach((A) => {
            let V = v.node(A);
            V.dummy && (V.order < y || V.order > E) && n(w, A, N);
          });
        });
      }
      function O(T, M) {
        let R = -1, y, E = 0;
        return M.forEach((N, I) => {
          if (v.node(N).dummy === "border") {
            let A = v.predecessors(N);
            A.length && (y = v.node(A[0]).order, b(M, E, I, R, y), E = I, R = y);
          }
          b(M, E, M.length, y, T.length);
        }), M;
      }
      return k.length && k.reduce(O), w;
    }
    function i(v, k) {
      if (v.node(k).dummy)
        return v.predecessors(k).find((w) => v.node(w).dummy);
    }
    function n(v, k, w) {
      if (k > w) {
        let O = k;
        k = w, w = O;
      }
      let b = v[k];
      b || (v[k] = b = {}), b[w] = !0;
    }
    function t(v, k, w) {
      if (k > w) {
        let b = k;
        k = w, w = b;
      }
      return !!v[k] && Object.hasOwn(v[k], w);
    }
    function a(v, k, w, b) {
      let O = {}, T = {}, M = {};
      return k.forEach((R) => {
        R.forEach((y, E) => {
          O[y] = y, T[y] = y, M[y] = E;
        });
      }), k.forEach((R) => {
        let y = -1;
        R.forEach((E) => {
          let N = b(E);
          if (N.length) {
            N = N.sort((A, V) => M[A] - M[V]);
            let I = (N.length - 1) / 2;
            for (let A = Math.floor(I), V = Math.ceil(I); A <= V; ++A) {
              let $ = N[A];
              T[E] === E && y < M[$] && !t(w, E, $) && (T[$] = E, T[E] = O[E] = O[$], y = M[$]);
            }
          }
        });
      }), { root: O, align: T };
    }
    function o(v, k, w, b, O) {
      let T = {}, M = p(v, k, w, O), R = O ? "borderLeft" : "borderRight";
      function y(I, A) {
        let V = M.nodes(), $ = V.pop(), U = {};
        for (; $; )
          U[$] ? I($) : (U[$] = !0, V.push($), V = V.concat(A($))), $ = V.pop();
      }
      function E(I) {
        T[I] = M.inEdges(I).reduce((A, V) => Math.max(A, T[V.v] + M.edge(V)), 0);
      }
      function N(I) {
        let A = M.outEdges(I).reduce(($, U) => Math.min($, T[U.w] - M.edge(U)), Number.POSITIVE_INFINITY), V = v.node(I);
        A !== Number.POSITIVE_INFINITY && V.borderType !== R && (T[I] = Math.max(T[I], A));
      }
      return y(E, M.predecessors.bind(M)), y(N, M.successors.bind(M)), Object.keys(b).forEach((I) => T[I] = T[w[I]]), T;
    }
    function p(v, k, w, b) {
      let O = new f(), T = v.graph(), M = x(T.nodesep, T.edgesep, b);
      return k.forEach((R) => {
        let y;
        R.forEach((E) => {
          let N = w[E];
          if (O.setNode(N), y) {
            var I = w[y], A = O.edge(I, N);
            O.setEdge(I, N, Math.max(M(v, E, y), A || 0));
          }
          y = E;
        });
      }), O;
    }
    function r(v, k) {
      return Object.values(k).reduce((w, b) => {
        let O = Number.NEGATIVE_INFINITY, T = Number.POSITIVE_INFINITY;
        Object.entries(b).forEach(([R, y]) => {
          let E = C(v, R) / 2;
          O = Math.max(y + E, O), T = Math.min(y - E, T);
        });
        const M = O - T;
        return M < w[0] && (w = [M, b]), w;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(v, k) {
      let w = Object.values(k), b = u.applyWithChunking(Math.min, w), O = u.applyWithChunking(Math.max, w);
      ["u", "d"].forEach((T) => {
        ["l", "r"].forEach((M) => {
          let R = T + M, y = v[R];
          if (y === k) return;
          let E = Object.values(y), N = b - u.applyWithChunking(Math.min, E);
          M !== "l" && (N = O - u.applyWithChunking(Math.max, E)), N && (v[R] = u.mapValues(y, (I) => I + N));
        });
      });
    }
    function m(v, k) {
      return u.mapValues(v.ul, (w, b) => {
        if (k)
          return v[k.toLowerCase()][b];
        {
          let O = Object.values(v).map((T) => T[b]).sort((T, M) => T - M);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function g(v) {
      let k = u.buildLayerMatrix(v), w = Object.assign(h(v, k), d(v, k)), b = {}, O;
      ["u", "d"].forEach((M) => {
        O = M === "u" ? k : Object.values(k).reverse(), ["l", "r"].forEach((R) => {
          R === "r" && (O = O.map((I) => Object.values(I).reverse()));
          let y = (M === "u" ? v.predecessors : v.successors).bind(v), E = a(v, O, w, y), N = o(v, O, E.root, E.align, R === "r");
          R === "r" && (N = u.mapValues(N, (I) => -I)), b[M + R] = N;
        });
      });
      let T = r(v, b);
      return s(b, T), m(b, v.graph().align);
    }
    function x(v, k, w) {
      return (b, O, T) => {
        let M = b.node(O), R = b.node(T), y = 0, E;
        if (y += M.width / 2, Object.hasOwn(M, "labelpos"))
          switch (M.labelpos.toLowerCase()) {
            case "l":
              E = -M.width / 2;
              break;
            case "r":
              E = M.width / 2;
              break;
          }
        if (E && (y += w ? E : -E), E = 0, y += (M.dummy ? k : v) / 2, y += (R.dummy ? k : v) / 2, y += R.width / 2, Object.hasOwn(R, "labelpos"))
          switch (R.labelpos.toLowerCase()) {
            case "l":
              E = R.width / 2;
              break;
            case "r":
              E = -R.width / 2;
              break;
          }
        return E && (y += w ? E : -E), E = 0, y;
      };
    }
    function C(v, k) {
      return v.node(k).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, l, c) {
    let f = e("../util"), u = e("./bk").positionX;
    l.exports = h;
    function h(i) {
      i = f.asNonCompoundGraph(i), d(i), Object.entries(u(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function d(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, a = 0;
      n.forEach((o) => {
        const p = o.reduce((r, s) => {
          const m = i.node(s).height;
          return r > m ? r : m;
        }, 0);
        o.forEach((r) => i.node(r).y = a + p / 2), a += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, l, c) {
    var f = e("@dagrejs/graphlib").Graph, u = e("./util").slack;
    l.exports = h;
    function h(t) {
      var a = new f({ directed: !1 }), o = t.nodes()[0], p = t.nodeCount();
      a.setNode(o, {});
      for (var r, s; d(a, t) < p; )
        r = i(a, t), s = a.hasNode(r.v) ? u(t, r) : -u(t, r), n(a, t, s);
      return a;
    }
    function d(t, a) {
      function o(p) {
        a.nodeEdges(p).forEach((r) => {
          var s = r.v, m = p === s ? r.w : s;
          !t.hasNode(m) && !u(a, r) && (t.setNode(m, {}), t.setEdge(p, m, {}), o(m));
        });
      }
      return t.nodes().forEach(o), t.nodeCount();
    }
    function i(t, a) {
      return a.edges().reduce((p, r) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (s = u(a, r)), s < p[0] ? [s, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, a, o) {
      t.nodes().forEach((p) => a.node(p).rank += o);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, l, c) {
    var f = e("./util"), u = f.longestPath, h = e("./feasible-tree"), d = e("./network-simplex");
    l.exports = i;
    function i(o) {
      var p = o.graph().ranker;
      if (p instanceof Function)
        return p(o);
      switch (o.graph().ranker) {
        case "network-simplex":
          a(o);
          break;
        case "tight-tree":
          t(o);
          break;
        case "longest-path":
          n(o);
          break;
        case "none":
          break;
        default:
          a(o);
      }
    }
    var n = u;
    function t(o) {
      u(o), h(o);
    }
    function a(o) {
      d(o);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, l, c) {
    var f = e("./feasible-tree"), u = e("./util").slack, h = e("./util").longestPath, d = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    l.exports = t, t.initLowLimValues = r, t.initCutValues = a, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = x;
    function t(w) {
      w = n(w), h(w);
      var b = f(w);
      r(b), a(b, w);
      for (var O, T; O = m(b); )
        T = g(b, w, O), x(b, w, O, T);
    }
    function a(w, b) {
      var O = i(w, w.nodes());
      O = O.slice(0, O.length - 1), O.forEach((T) => o(w, b, T));
    }
    function o(w, b, O) {
      var T = w.node(O), M = T.parent;
      w.edge(O, M).cutvalue = p(w, b, O);
    }
    function p(w, b, O) {
      var T = w.node(O), M = T.parent, R = !0, y = b.edge(O, M), E = 0;
      return y || (R = !1, y = b.edge(M, O)), E = y.weight, b.nodeEdges(O).forEach((N) => {
        var I = N.v === O, A = I ? N.w : N.v;
        if (A !== M) {
          var V = I === R, $ = b.edge(N).weight;
          if (E += V ? $ : -$, v(w, O, A)) {
            var U = w.edge(O, A).cutvalue;
            E += V ? -U : U;
          }
        }
      }), E;
    }
    function r(w, b) {
      arguments.length < 2 && (b = w.nodes()[0]), s(w, {}, 1, b);
    }
    function s(w, b, O, T, M) {
      var R = O, y = w.node(T);
      return b[T] = !0, w.neighbors(T).forEach((E) => {
        Object.hasOwn(b, E) || (O = s(w, b, O, E, T));
      }), y.low = R, y.lim = O++, M ? y.parent = M : delete y.parent, O;
    }
    function m(w) {
      return w.edges().find((b) => w.edge(b).cutvalue < 0);
    }
    function g(w, b, O) {
      var T = O.v, M = O.w;
      b.hasEdge(T, M) || (T = O.w, M = O.v);
      var R = w.node(T), y = w.node(M), E = R, N = !1;
      R.lim > y.lim && (E = y, N = !0);
      var I = b.edges().filter((A) => N === k(w, w.node(A.v), E) && N !== k(w, w.node(A.w), E));
      return I.reduce((A, V) => u(b, V) < u(b, A) ? V : A);
    }
    function x(w, b, O, T) {
      var M = O.v, R = O.w;
      w.removeEdge(M, R), w.setEdge(T.v, T.w, {}), r(w), a(w, b), C(w, b);
    }
    function C(w, b) {
      var O = w.nodes().find((M) => !b.node(M).parent), T = d(w, O);
      T = T.slice(1), T.forEach((M) => {
        var R = w.node(M).parent, y = b.edge(M, R), E = !1;
        y || (y = b.edge(R, M), E = !0), b.node(M).rank = b.node(R).rank + (E ? y.minlen : -y.minlen);
      });
    }
    function v(w, b, O) {
      return w.hasEdge(b, O);
    }
    function k(w, b, O) {
      return O.low <= b.lim && b.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, l, c) {
    const { applyWithChunking: f } = e("../util");
    l.exports = { longestPath: u, slack: h };
    function u(d) {
      var i = {};
      function n(t) {
        var a = d.node(t);
        if (Object.hasOwn(i, t))
          return a.rank;
        i[t] = !0;
        let o = d.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - d.edge(r).minlen);
        var p = f(Math.min, o);
        return p === Number.POSITIVE_INFINITY && (p = 0), a.rank = p;
      }
      d.sources().forEach(n);
    }
    function h(d, i) {
      return d.node(i.w).rank - d.node(i.v).rank - d.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, l, c) {
    let f = e("@dagrejs/graphlib").Graph;
    l.exports = { addBorderNode: r, addDummyNode: u, applyWithChunking: g, asNonCompoundGraph: d, buildLayerMatrix: a, intersectRect: t, mapValues: M, maxRank: x, normalizeRanks: o, notime: k, partition: C, pick: T, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: h, successorWeights: i, time: v, uniqueId: b, zipObject: R };
    function u(y, E, N, I) {
      for (var A = I; y.hasNode(A); )
        A = b(I);
      return N.dummy = E, y.setNode(A, N), A;
    }
    function h(y) {
      let E = new f().setGraph(y.graph());
      return y.nodes().forEach((N) => E.setNode(N, y.node(N))), y.edges().forEach((N) => {
        let I = E.edge(N.v, N.w) || { weight: 0, minlen: 1 }, A = y.edge(N);
        E.setEdge(N.v, N.w, { weight: I.weight + A.weight, minlen: Math.max(I.minlen, A.minlen) });
      }), E;
    }
    function d(y) {
      let E = new f({ multigraph: y.isMultigraph() }).setGraph(y.graph());
      return y.nodes().forEach((N) => {
        y.children(N).length || E.setNode(N, y.node(N));
      }), y.edges().forEach((N) => {
        E.setEdge(N, y.edge(N));
      }), E;
    }
    function i(y) {
      let E = y.nodes().map((N) => {
        let I = {};
        return y.outEdges(N).forEach((A) => {
          I[A.w] = (I[A.w] || 0) + y.edge(A).weight;
        }), I;
      });
      return R(y.nodes(), E);
    }
    function n(y) {
      let E = y.nodes().map((N) => {
        let I = {};
        return y.inEdges(N).forEach((A) => {
          I[A.v] = (I[A.v] || 0) + y.edge(A).weight;
        }), I;
      });
      return R(y.nodes(), E);
    }
    function t(y, E) {
      let N = y.x, I = y.y, A = E.x - N, V = E.y - I, $ = y.width / 2, U = y.height / 2;
      if (!A && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let X, te;
      return Math.abs(V) * $ > Math.abs(A) * U ? (V < 0 && (U = -U), X = U * A / V, te = U) : (A < 0 && ($ = -$), X = $, te = $ * V / A), { x: N + X, y: I + te };
    }
    function a(y) {
      let E = O(x(y) + 1).map(() => []);
      return y.nodes().forEach((N) => {
        let I = y.node(N), A = I.rank;
        A !== void 0 && (E[A][I.order] = N);
      }), E;
    }
    function o(y) {
      let E = y.nodes().map((I) => {
        let A = y.node(I).rank;
        return A === void 0 ? Number.MAX_VALUE : A;
      }), N = g(Math.min, E);
      y.nodes().forEach((I) => {
        let A = y.node(I);
        Object.hasOwn(A, "rank") && (A.rank -= N);
      });
    }
    function p(y) {
      let E = y.nodes().map(($) => y.node($).rank), N = g(Math.min, E), I = [];
      y.nodes().forEach(($) => {
        let U = y.node($).rank - N;
        I[U] || (I[U] = []), I[U].push($);
      });
      let A = 0, V = y.graph().nodeRankFactor;
      Array.from(I).forEach(($, U) => {
        $ === void 0 && U % V !== 0 ? --A : $ !== void 0 && A && $.forEach((X) => y.node(X).rank += A);
      });
    }
    function r(y, E, N, I) {
      let A = { width: 0, height: 0 };
      return arguments.length >= 4 && (A.rank = N, A.order = I), u(y, "border", A, E);
    }
    function s(y, E = m) {
      const N = [];
      for (let I = 0; I < y.length; I += E) {
        const A = y.slice(I, I + E);
        N.push(A);
      }
      return N;
    }
    const m = 65535;
    function g(y, E) {
      if (E.length > m) {
        const N = s(E);
        return y.apply(null, N.map((I) => y.apply(null, I)));
      } else
        return y.apply(null, E);
    }
    function x(y) {
      const N = y.nodes().map((I) => {
        let A = y.node(I).rank;
        return A === void 0 ? Number.MIN_VALUE : A;
      });
      return g(Math.max, N);
    }
    function C(y, E) {
      let N = { lhs: [], rhs: [] };
      return y.forEach((I) => {
        E(I) ? N.lhs.push(I) : N.rhs.push(I);
      }), N;
    }
    function v(y, E) {
      let N = Date.now();
      try {
        return E();
      } finally {
        console.log(y + " time: " + (Date.now() - N) + "ms");
      }
    }
    function k(y, E) {
      return E();
    }
    let w = 0;
    function b(y) {
      var E = ++w;
      return y + ("" + E);
    }
    function O(y, E, N = 1) {
      E == null && (E = y, y = 0);
      let I = (V) => V < E;
      N < 0 && (I = (V) => E < V);
      const A = [];
      for (let V = y; I(V); V += N)
        A.push(V);
      return A;
    }
    function T(y, E) {
      const N = {};
      for (const I of E)
        y[I] !== void 0 && (N[I] = y[I]);
      return N;
    }
    function M(y, E) {
      let N = E;
      return typeof E == "string" && (N = (I) => I[E]), Object.entries(y).reduce((I, [A, V]) => (I[A] = N(V, A), I), {});
    }
    function R(y, E) {
      return y.reduce((N, I, A) => (N[I] = E[A], N), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, l, c) {
    l.exports = "1.1.8";
  }, {}], 29: [function(e, l, c) {
    var f = e("./lib");
    l.exports = { Graph: f.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: f.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, l, c) {
    l.exports = f;
    function f(u) {
      var h = {}, d = [], i;
      function n(t) {
        Object.hasOwn(h, t) || (h[t] = !0, i.push(t), u.successors(t).forEach(n), u.predecessors(t).forEach(n));
      }
      return u.nodes().forEach(function(t) {
        i = [], n(t), i.length && d.push(i);
      }), d;
    }
  }, {}], 31: [function(e, l, c) {
    l.exports = f;
    function f(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var a = i.isDirected() ? (s) => i.successors(s) : (s) => i.neighbors(s), o = t === "post" ? u : h, p = [], r = {};
      return n.forEach((s) => {
        if (!i.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        o(s, a, r, p);
      }), p;
    }
    function u(i, n, t, a) {
      for (var o = [[i, !1]]; o.length > 0; ) {
        var p = o.pop();
        p[1] ? a.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, o.push([p[0], !0]), d(n(p[0]), (r) => o.push([r, !1])));
      }
    }
    function h(i, n, t, a) {
      for (var o = [i]; o.length > 0; ) {
        var p = o.pop();
        Object.hasOwn(t, p) || (t[p] = !0, a.push(p), d(n(p), (r) => o.push(r)));
      }
    }
    function d(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, l, c) {
    var f = e("./dijkstra");
    l.exports = u;
    function u(h, d, i) {
      return h.nodes().reduce(function(n, t) {
        return n[t] = f(h, t, d, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, l, c) {
    var f = e("../data/priority-queue");
    l.exports = h;
    var u = () => 1;
    function h(i, n, t, a) {
      return d(i, String(n), t || u, a || function(o) {
        return i.outEdges(o);
      });
    }
    function d(i, n, t, a) {
      var o = {}, p = new f(), r, s, m = function(g) {
        var x = g.v !== r ? g.v : g.w, C = o[x], v = t(g), k = s.distance + v;
        if (v < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + v);
        k < C.distance && (C.distance = k, C.predecessor = r, p.decrease(x, k));
      };
      for (i.nodes().forEach(function(g) {
        var x = g === n ? 0 : Number.POSITIVE_INFINITY;
        o[g] = { distance: x }, p.add(g, x);
      }); p.size() > 0 && (r = p.removeMin(), s = o[r], s.distance !== Number.POSITIVE_INFINITY); )
        a(r).forEach(m);
      return o;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, l, c) {
    var f = e("./tarjan");
    l.exports = u;
    function u(h) {
      return f(h).filter(function(d) {
        return d.length > 1 || d.length === 1 && h.hasEdge(d[0], d[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, l, c) {
    l.exports = u;
    var f = () => 1;
    function u(d, i, n) {
      return h(d, i || f, n || function(t) {
        return d.outEdges(t);
      });
    }
    function h(d, i, n) {
      var t = {}, a = d.nodes();
      return a.forEach(function(o) {
        t[o] = {}, t[o][o] = { distance: 0 }, a.forEach(function(p) {
          o !== p && (t[o][p] = { distance: Number.POSITIVE_INFINITY });
        }), n(o).forEach(function(p) {
          var r = p.v === o ? p.w : p.v, s = i(p);
          t[o][r] = { distance: s, predecessor: o };
        });
      }), a.forEach(function(o) {
        var p = t[o];
        a.forEach(function(r) {
          var s = t[r];
          a.forEach(function(m) {
            var g = s[o], x = p[m], C = s[m], v = g.distance + x.distance;
            v < C.distance && (C.distance = v, C.predecessor = x.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, l, c) {
    l.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, l, c) {
    var f = e("./topsort");
    l.exports = u;
    function u(h) {
      try {
        f(h);
      } catch (d) {
        if (d instanceof f.CycleException)
          return !1;
        throw d;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, l, c) {
    var f = e("./dfs");
    l.exports = u;
    function u(h, d) {
      return f(h, d, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, l, c) {
    var f = e("./dfs");
    l.exports = u;
    function u(h, d) {
      return f(h, d, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, l, c) {
    var f = e("../graph"), u = e("../data/priority-queue");
    l.exports = h;
    function h(d, i) {
      var n = new f(), t = {}, a = new u(), o;
      function p(s) {
        var m = s.v === o ? s.w : s.v, g = a.priority(m);
        if (g !== void 0) {
          var x = i(s);
          x < g && (t[m] = o, a.decrease(m, x));
        }
      }
      if (d.nodeCount() === 0)
        return n;
      d.nodes().forEach(function(s) {
        a.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), a.decrease(d.nodes()[0], 0);
      for (var r = !1; a.size() > 0; ) {
        if (o = a.removeMin(), Object.hasOwn(t, o))
          n.setEdge(o, t[o]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + d);
          r = !0;
        }
        d.nodeEdges(o).forEach(p);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, l, c) {
    l.exports = f;
    function f(u) {
      var h = 0, d = [], i = {}, n = [];
      function t(a) {
        var o = i[a] = { onStack: !0, lowlink: h, index: h++ };
        if (d.push(a), u.successors(a).forEach(function(s) {
          Object.hasOwn(i, s) ? i[s].onStack && (o.lowlink = Math.min(o.lowlink, i[s].index)) : (t(s), o.lowlink = Math.min(o.lowlink, i[s].lowlink));
        }), o.lowlink === o.index) {
          var p = [], r;
          do
            r = d.pop(), i[r].onStack = !1, p.push(r);
          while (a !== r);
          n.push(p);
        }
      }
      return u.nodes().forEach(function(a) {
        Object.hasOwn(i, a) || t(a);
      }), n;
    }
  }, {}], 42: [function(e, l, c) {
    function f(h) {
      var d = {}, i = {}, n = [];
      function t(a) {
        if (Object.hasOwn(i, a))
          throw new u();
        Object.hasOwn(d, a) || (i[a] = !0, d[a] = !0, h.predecessors(a).forEach(t), delete i[a], n.push(a));
      }
      if (h.sinks().forEach(t), Object.keys(d).length !== h.nodeCount())
        throw new u();
      return n;
    }
    class u extends Error {
      constructor() {
        super(...arguments);
      }
    }
    l.exports = f, f.CycleException = u;
  }, {}], 43: [function(e, l, c) {
    class f {
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
        return this._arr.map(function(h) {
          return h.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(h) {
        return Object.hasOwn(this._keyIndices, h);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(h) {
        var d = this._keyIndices[h];
        if (d !== void 0)
          return this._arr[d].priority;
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
      add(h, d) {
        var i = this._keyIndices;
        if (h = String(h), !Object.hasOwn(i, h)) {
          var n = this._arr, t = n.length;
          return i[h] = t, n.push({ key: h, priority: d }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var h = this._arr.pop();
        return delete this._keyIndices[h.key], this._heapify(0), h.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(h, d) {
        var i = this._keyIndices[h];
        if (d > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + h + " Old: " + this._arr[i].priority + " New: " + d);
        this._arr[i].priority = d, this._decrease(i);
      }
      _heapify(h) {
        var d = this._arr, i = 2 * h, n = i + 1, t = h;
        i < d.length && (t = d[i].priority < d[t].priority ? i : t, n < d.length && (t = d[n].priority < d[t].priority ? n : t), t !== h && (this._swap(h, t), this._heapify(t)));
      }
      _decrease(h) {
        for (var d = this._arr, i = d[h].priority, n; h !== 0 && (n = h >> 1, !(d[n].priority < i)); )
          this._swap(h, n), h = n;
      }
      _swap(h, d) {
        var i = this._arr, n = this._keyIndices, t = i[h], a = i[d];
        i[h] = a, i[d] = t, n[a.key] = h, n[t.key] = d;
      }
    }
    l.exports = f;
  }, {}], 44: [function(e, l, c) {
    var f = "\0", u = "\0", h = "";
    class d {
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
      constructor(r) {
        r && (this._isDirected = Object.hasOwn(r, "directed") ? r.directed : !0, this._isMultigraph = Object.hasOwn(r, "multigraph") ? r.multigraph : !1, this._isCompound = Object.hasOwn(r, "compound") ? r.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[u] = {});
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
      setGraph(r) {
        return this._label = r, this;
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
      setDefaultNodeLabel(r) {
        return this._defaultNodeLabelFn = r, typeof r != "function" && (this._defaultNodeLabelFn = () => r), this;
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
        var r = this;
        return this.nodes().filter((s) => Object.keys(r._in[s]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var r = this;
        return this.nodes().filter((s) => Object.keys(r._out[s]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(r, s) {
        var m = arguments, g = this;
        return r.forEach(function(x) {
          m.length > 1 ? g.setNode(x, s) : g.setNode(x);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, s) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = s), this) : (this._nodes[r] = arguments.length > 1 ? s : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = u, this._children[r] = {}, this._children[u][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
      }
      /**
         * Gets the label of node with specified name.
         * Complexity: O(|V|).
         */
      node(r) {
        return this._nodes[r];
      }
      /**
         * Detects whether graph has a node with specified name or not.
         */
      hasNode(r) {
        return Object.hasOwn(this._nodes, r);
      }
      /**
         * Remove the node with the name from the graph or do nothing if the node is not in
         * the graph. If the node was removed this function also removes any incident
         * edges.
         * Complexity: O(1).
         */
      removeNode(r) {
        var s = this;
        if (Object.hasOwn(this._nodes, r)) {
          var m = (g) => s.removeEdge(s._edgeObjs[g]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(g) {
            s.setParent(g);
          }), delete this._children[r]), Object.keys(this._in[r]).forEach(m), delete this._in[r], delete this._preds[r], Object.keys(this._out[r]).forEach(m), delete this._out[r], delete this._sucs[r], --this._nodeCount;
        }
        return this;
      }
      /**
         * Sets node p as a parent for node v if it is defined, or removes the
         * parent for v if p is undefined. Method throws an exception in case of
         * invoking it in context of noncompound graph.
         * Average-case complexity: O(1).
         */
      setParent(r, s) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (s === void 0)
          s = u;
        else {
          s += "";
          for (var m = s; m !== void 0; m = this.parent(m))
            if (m === r)
              throw new Error("Setting " + s + " as parent of " + r + " would create a cycle");
          this.setNode(s);
        }
        return this.setNode(r), this._removeFromParentsChildList(r), this._parent[r] = s, this._children[s][r] = !0, this;
      }
      _removeFromParentsChildList(r) {
        delete this._children[this._parent[r]][r];
      }
      /**
         * Gets parent node for node v.
         * Complexity: O(1).
         */
      parent(r) {
        if (this._isCompound) {
          var s = this._parent[r];
          if (s !== u)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = u) {
        if (this._isCompound) {
          var s = this._children[r];
          if (s)
            return Object.keys(s);
        } else {
          if (r === u)
            return this.nodes();
          if (this.hasNode(r))
            return [];
        }
      }
      /**
         * Return all nodes that are predecessors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      predecessors(r) {
        var s = this._preds[r];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(r) {
        var s = this._sucs[r];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(r) {
        var s = this.predecessors(r);
        if (s) {
          const g = new Set(s);
          for (var m of this.successors(r))
            g.add(m);
          return Array.from(g.values());
        }
      }
      isLeaf(r) {
        var s;
        return this.isDirected() ? s = this.successors(r) : s = this.neighbors(r), s.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(r) {
        var s = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        s.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([C, v]) {
          r(C) && s.setNode(C, v);
        }), Object.values(this._edgeObjs).forEach(function(C) {
          s.hasNode(C.v) && s.hasNode(C.w) && s.setEdge(C, m.edge(C));
        });
        var g = {};
        function x(C) {
          var v = m.parent(C);
          return v === void 0 || s.hasNode(v) ? (g[C] = v, v) : v in g ? g[v] : x(v);
        }
        return this._isCompound && s.nodes().forEach((C) => s.setParent(C, x(C))), s;
      }
      /* === Edge functions ========== */
      /**
         * Sets the default edge label or factory function. This label will be
         * assigned as default label in case if no label was specified while setting
         * an edge or this function will be invoked each time when setting an edge
         * with no label specified and returned value * will be used as a label for edge.
         * Complexity: O(1).
         */
      setDefaultEdgeLabel(r) {
        return this._defaultEdgeLabelFn = r, typeof r != "function" && (this._defaultEdgeLabelFn = () => r), this;
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
      setPath(r, s) {
        var m = this, g = arguments;
        return r.reduce(function(x, C) {
          return g.length > 1 ? m.setEdge(x, C, s) : m.setEdge(x, C), C;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, s, m, g, x = !1, C = arguments[0];
        typeof C == "object" && C !== null && "v" in C ? (r = C.v, s = C.w, m = C.name, arguments.length === 2 && (g = arguments[1], x = !0)) : (r = C, s = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], x = !0)), r = "" + r, s = "" + s, m !== void 0 && (m = "" + m);
        var v = t(this._isDirected, r, s, m);
        if (Object.hasOwn(this._edgeLabels, v))
          return x && (this._edgeLabels[v] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(s), this._edgeLabels[v] = x ? g : this._defaultEdgeLabelFn(r, s, m);
        var k = a(this._isDirected, r, s, m);
        return r = k.v, s = k.w, Object.freeze(k), this._edgeObjs[v] = k, i(this._preds[s], r), i(this._sucs[r], s), this._in[s][v] = k, this._out[r][v] = k, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, s, m) {
        var g = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return this._edgeLabels[g];
      }
      /**
         * Gets the label for the specified edge and converts it to an object.
         * Complexity: O(1)
         */
      edgeAsObj() {
        const r = this.edge(...arguments);
        return typeof r != "object" ? { label: r } : r;
      }
      /**
         * Detects whether the graph contains specified edge or not. No subgraphs are considered.
         * Complexity: O(1).
         */
      hasEdge(r, s, m) {
        var g = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return Object.hasOwn(this._edgeLabels, g);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, s, m) {
        var g = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m), x = this._edgeObjs[g];
        return x && (r = x.v, s = x.w, delete this._edgeLabels[g], delete this._edgeObjs[g], n(this._preds[s], r), n(this._sucs[r], s), delete this._in[s][g], delete this._out[r][g], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, s) {
        var m = this._in[r];
        if (m) {
          var g = Object.values(m);
          return s ? g.filter((x) => x.v === s) : g;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(r, s) {
        var m = this._out[r];
        if (m) {
          var g = Object.values(m);
          return s ? g.filter((x) => x.w === s) : g;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(r, s) {
        var m = this.inEdges(r, s);
        if (m)
          return m.concat(this.outEdges(r, s));
      }
    }
    function i(p, r) {
      p[r] ? p[r]++ : p[r] = 1;
    }
    function n(p, r) {
      --p[r] || delete p[r];
    }
    function t(p, r, s, m) {
      var g = "" + r, x = "" + s;
      if (!p && g > x) {
        var C = g;
        g = x, x = C;
      }
      return g + h + x + h + (m === void 0 ? f : m);
    }
    function a(p, r, s, m) {
      var g = "" + r, x = "" + s;
      if (!p && g > x) {
        var C = g;
        g = x, x = C;
      }
      var v = { v: g, w: x };
      return m && (v.name = m), v;
    }
    function o(p, r) {
      return t(p, r.v, r.w, r.name);
    }
    l.exports = d;
  }, {}], 45: [function(e, l, c) {
    l.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, l, c) {
    var f = e("./graph");
    l.exports = { write: u, read: i };
    function u(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: h(n), edges: d(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function h(n) {
      return n.nodes().map(function(t) {
        var a = n.node(t), o = n.parent(t), p = { v: t };
        return a !== void 0 && (p.value = a), o !== void 0 && (p.parent = o), p;
      });
    }
    function d(n) {
      return n.edges().map(function(t) {
        var a = n.edge(t), o = { v: t.v, w: t.w };
        return t.name !== void 0 && (o.name = t.name), a !== void 0 && (o.value = a), o;
      });
    }
    function i(n) {
      var t = new f(n.options).setGraph(n.value);
      return n.nodes.forEach(function(a) {
        t.setNode(a.v, a.value), a.parent && t.setParent(a.v, a.parent);
      }), n.edges.forEach(function(a) {
        t.setEdge({ v: a.v, w: a.w, name: a.name }, a.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, l, c) {
    l.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), pn = ["unstarted", "started", "completed", "canceled"];
function mn(e, l) {
  let c = 1;
  const f = () => `${e.slice(0, 40 - String(c).length - 1)}_${c}`;
  for (; l.some((u) => u.id === f()); ) c++;
  return f();
}
function bn(e, l) {
  return [
    ...e.initial === l.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((c) => c.to === l.id || c.from !== "any" && c.from.includes(l.id)).map((c) => `transition ${Bt(c)}`),
    ...e.states.filter((c) => c.regions?.some((f) => f.initial === l.id)).map((c) => `lanes in ${Be(c)}`),
    ...Object.entries(e.map ?? {}).filter(([, c]) => c === l.id).map(() => "existing item migration")
  ];
}
function gn(e, l) {
  return e.states.flatMap((c) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => c.run?.[f] === l.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${Be(c)}`),
    ...(c.timers ?? []).filter((f) => f.then?.transition === l.id).map(() => "a timer")
  ]);
}
const Be = (e) => e?.name || "Untitled state", Bt = (e) => e.name?.trim() || ye(e.id), yn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", wn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function vn(e, l) {
  if (e.id === l.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const c = e.release_when?.approvals?.min;
    return c ? `Needs ${c} approval${c === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? We(e) : "A person moves it";
}
function We(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function kn(e, l) {
  const c = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${c === 1 ? "one person approves" : `${c} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${We(e)}.` : "A person chooses when to move the item on.", u = l.policy?.wip?.[e.id]?.limit;
  return f + (u !== void 0 ? ` At most ${u} at a time.` : "");
}
function En(e) {
  const l = e.transitions ?? [], c = [], f = /* @__PURE__ */ new Set();
  let u = e.states.find((d) => d.id === e.initial);
  const h = new Map(e.states.map((d, i) => [d.id, i]));
  for (; u && !f.has(u.id) && (c.push(u), f.add(u.id), !(u.category === "completed" || u.category === "canceled")); ) {
    const d = u, i = l.filter((t) => t.from !== "any" && t.from.includes(d.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (h.get(t.to) ?? -1) > (h.get(d.id) ?? 0));
    u = e.states.find((t) => t.id === n?.to);
  }
  return c;
}
function ze(e) {
  const l = e.states.find((c) => c.id === e.initial);
  return e.migration ?? (l?.kind === "automated" || l?.kind === "parallel" ? "pin" : "follow");
}
const ie = (e) => JSON.parse(JSON.stringify(e));
function _n(e) {
  return e?.admin === !0;
}
function xn(e, l, c) {
  const f = l + c;
  if (l < 0 || l >= e.length || f < 0 || f >= e.length) return;
  const [u] = e.splice(l, 1);
  e.splice(f, 0, u);
}
function On(e, l, c) {
  const f = l.code;
  if (f === c) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  l.code = c;
  const u = (n) => n === f ? c : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(u), n.inherit && (n.inherit = n.inherit.map(u));
  const h = (n) => {
    for (const t of n ?? []) "field" in t && t.field === f && (t.field = c);
  }, d = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = u(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      d(n);
      for (const [t, a] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(a);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = u(n.field)), i(n.where), h(n.access?.read), h(n.access?.write);
  if (e.visibility) {
    e.visibility.field = u(e.visibility.field);
    for (const n of e.visibility.levels) h(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      d(t.awaiting), d(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(u));
      for (const a of t.timers ?? [])
        a.at_field && (a.at_field = u(a.at_field)), a.by && (a.by = u(a.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(u));
      for (const a of t.set ?? [])
        a.field = u(a.field), a.copy && (a.copy = u(a.copy));
    }
  }
}
function Re({ migration: e, map: l, ...c }) {
  return JSON.stringify(c);
}
function Nn(e, l) {
  const c = ie(e);
  for (const u of c.processes ?? []) {
    const h = l.processes?.find((d) => d.id === u.id);
    if (h && Re(u) !== Re(h) && (u.migration = "follow"), u.map) {
      for (const [d, i] of Object.entries(u.map))
        (u.states.some((n) => n.id === d) || !u.states.some((n) => n.id === i)) && delete u.map[d];
      Object.keys(u.map).length || delete u.map;
    }
  }
  c.plugins && (c.plugins = c.plugins.map(({ use: u }) => ({ use: u })));
  for (const u of c.fields ?? [])
    u.type?.includes(":") && delete u.form;
  const f = { ...c.remove };
  l.visibility && !c.visibility ? f.visibility = !0 : delete f.visibility;
  for (const u of ["fields", "item_types", "processes", "relation_types"]) {
    const h = (l[u] ?? []).filter((d) => {
      if (u === "fields") {
        const i = d;
        return !c.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(c[u] ?? []).some((i) => "id" in i && i.id === ("id" in d ? d.id : void 0));
    }).map((d) => "code" in d ? d.code : d.id);
    h.length ? f[u] = [.../* @__PURE__ */ new Set([...f[u] ?? [], ...h])] : delete f[u];
  }
  return Object.keys(f).length ? c.remove = f : delete c.remove, c;
}
function jn(e, l, c) {
  const f = JSON.stringify({ declaration: e, configs: c });
  return {
    declaration: ie(e),
    expected_generation: l,
    plugin_configs: ie(c),
    matches: (u, h, d) => l === h && f === JSON.stringify({ declaration: u, configs: d })
  };
}
function In(e) {
  const l = ie(e), c = [...new Set(l.declaration.item_types?.flatMap((u) => u.fields) ?? [])], f = (u) => {
    const h = c.indexOf(u);
    return h < 0 ? c.length : h;
  };
  l.declaration.fields?.sort((u, h) => f(u.code) - f(h.code));
  for (const u of l.declaration.fields ?? []) {
    const h = l.compiled.fields?.find((d) => d.code === u.code);
    u.id ??= h?.id, u.form ??= h?.form;
  }
  for (const u of l.declaration.processes ?? []) u.migration ??= l.compiled.processes?.find((h) => h.id === u.id)?.migration ?? ze(u);
  return l;
}
function Cn(e, l) {
  return (l.processes ?? []).filter((c) => ze(c) !== "pin" && e.changes.some((f) => f.code === "process " + c.id && f.class !== "cosmetic" && f.class !== "refused")).map((c) => c.id);
}
function Ln(e, l, c) {
  const f = [c, `item_type ${c}`, `relation ${c}`, `process ${c}`], u = e.refused.filter((h) => f.includes(h.code));
  return l === "fields" && u.push(...e.changes.filter((h) => h.code === c && h.what === "removed" && h.class === "semantic")), u.length ? u.map(Wt).join(" ") : void 0;
}
function An(e, l, c) {
  if (l === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== c);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((u) => u !== c), f.inherit = f.inherit?.filter((u) => u !== c);
  } else l === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== c) : l === "processes" ? e.processes = e.processes?.filter((f) => f.id !== c) : e.relation_types = e.relation_types?.filter((f) => f.id !== c);
}
function Wt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function Tn(e, l) {
  if (!(e instanceof re)) return [];
  const c = e.details ?? {};
  let f = typeof c.field == "string" ? c.field : "";
  if (!f) {
    const u = l.processes?.find((h) => h.id === c.process || h.states.some((d) => d.id === c.state) || e.message.includes(`process ${h.id}`));
    u ? f = `process ${u.id}` : typeof c.item_type == "string" && (f = `item_type ${c.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: Pe(e, "The definition is invalid.") }] : [];
}
const Mn = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, Sn = (e) => !("problem" in e);
function Rn(e, l) {
  return { pack: e.id, version: e.version, expected_generation: l };
}
async function Vn(e, l) {
  const c = { ...ie(e), resolutions: ie(e.resolutions ?? {}) };
  let f = await l(c);
  return c.maps || (c.maps = ie(f.maps), f = await l(c)), { request: c, plan: f };
}
function $n() {
  let e = 0;
  return () => {
    const l = ++e;
    return () => l === e;
  };
}
export {
  kt as A,
  Wt as B,
  An as C,
  On as D,
  wn as E,
  re as F,
  Fe as G,
  mn as H,
  kn as I,
  gn as J,
  bn as K,
  ie as L,
  Ct as M,
  ge as N,
  Mn as O,
  Nn as P,
  Cn as Q,
  Rn as R,
  Vn as S,
  In as T,
  jn as U,
  Tn as V,
  Ln as W,
  fn as _,
  Sn as a,
  Lt as b,
  Ue as c,
  cn as d,
  _n as e,
  Pe as f,
  on as g,
  hn as h,
  vn as i,
  Ge as j,
  ce as k,
  $n as l,
  En as m,
  ln as n,
  jt as o,
  se as p,
  ye as q,
  dn as r,
  Be as s,
  Bt as t,
  un as u,
  Et as v,
  Ut as w,
  pn as x,
  yn as y,
  xn as z
};
//# sourceMappingURL=latestRequest-Cv3QFlsy.js.map
