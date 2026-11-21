import { defineComponent as se, useId as je, openBlock as D, createElementBlock as W, unref as F, normalizeClass as Ke, createElementVNode as K, createTextVNode as be, toDisplayString as Y, createCommentVNode as ne, renderSlot as le, Fragment as xe, createVNode as J, withCtx as re, ref as X, computed as ee, createBlock as Z, withKeys as Te, withModifiers as Se, nextTick as _e, useModel as Xe, mergeModels as Qe, watch as ce, onBeforeUnmount as Ie, onUnmounted as Ze, renderList as Me, onMounted as et } from "vue";
import { Icon as Oe } from "@iconify/vue";
import de from "primevue/button";
import Ve from "primevue/inputtext";
import tt from "primevue/inputnumber";
import nt from "primevue/toggleswitch";
import rt from "primevue/select";
import it from "primevue/chip";
import at from "primevue/accordion";
import st from "primevue/accordioncontent";
import ot from "primevue/accordionheader";
import lt from "primevue/accordionpanel";
import dt from "primevue/textarea";
import { e as ut } from "./mount-CDzcrCyw.js";
import { api as Pe } from "@wippy-fe/proxy";
const ct = ["aria-labelledby"], ft = { class: "kx-railhead" }, ht = ["id"], pt = { key: 0 }, mt = { class: "kx-railhead-acts" }, bt = { class: "kx-rail-body" }, on = /* @__PURE__ */ se({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const o = je();
    return (d, f) => (D(), W("aside", {
      class: Ke(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": F(o)
    }, [
      K("div", ft, [
        K("span", {
          id: F(o),
          class: "kx-railhead-title"
        }, [
          be(Y(e.title), 1),
          e.count !== void 0 ? (D(), W("b", pt, Y(e.count), 1)) : ne("", !0)
        ], 8, ht),
        K("div", mt, [
          le(d.$slots, "actions")
        ])
      ]),
      le(d.$slots, "toolbar"),
      K("div", bt, [
        le(d.$slots, "default")
      ])
    ], 10, ct));
  }
}), ln = /* @__PURE__ */ se({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(e) {
    return (o, d) => (D(), W(xe, null, [
      J(F(de), {
        type: "button",
        text: "",
        "aria-label": e.createLabel,
        title: e.createLabel,
        onClick: d[0] || (d[0] = (f) => o.$emit("create"))
      }, {
        icon: re(() => [
          J(F(Oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      J(F(de), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: d[1] || (d[1] = (f) => o.$emit("defaults"))
      }, {
        icon: re(() => [
          J(F(Oe), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
});
class ie extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(o, d, f) {
    super(o.message ?? o.error ?? `${d} failed`), this.name = "ApiError", this.kind = o.kind, this.details = o.details, this.retryable = o.retryable, this.status = f;
  }
}
const Re = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function De(e, o) {
  const d = e instanceof ie ? e.details?.code : void 0, f = e instanceof Error && e.message || o;
  return typeof d != "string" || !d.trim() ? f : `${Object.hasOwn(Re, d) ? Re[d] : f}
Error code: ${d}`;
}
function Fe(e, o) {
  const d = e;
  if (d && typeof d == "object" && d.success === !1) throw new ie(d, o);
  if (d && typeof d == "object" && d.success === !0 && d.data !== void 0) return d.data;
  throw new ie({ kind: "INTERNAL", message: `${o}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, o);
}
function Ge(e, o) {
  if (e instanceof ie) return e;
  const d = e?.response;
  return d?.data ? new ie(d.data, o, d.status) : e instanceof Error ? e : new ie({ kind: "Unavailable" }, o);
}
async function ke(e, o, d) {
  try {
    return Fe((await Pe.get(e, { params: d })).data, o);
  } catch (f) {
    throw Ge(f, o);
  }
}
async function oe(e, o, d) {
  try {
    return Fe((await Pe.post(e, o)).data, d);
  } catch (f) {
    throw Ge(f, d);
  }
}
function fe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const ge = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), gt = ["onKeydown"], yt = { class: "work-stack work-tight" }, wt = { class: "work-row work-wrap" }, vt = ["id"], kt = /* @__PURE__ */ se({
  __name: "AddDefinitionRow",
  props: {
    action: {},
    label: {},
    maxlength: {},
    validate: { type: Function }
  },
  emits: ["open", "add"],
  setup(e, { emit: o }) {
    const d = e, f = o, c = X(), h = X(!1), u = X(""), i = je(), n = ee(() => u.value.trim()), t = ee(() => n.value ? d.validate?.(n.value) : void 0);
    async function s() {
      f("open"), h.value = !0, await _e(), c.value?.querySelector("input")?.focus();
    }
    async function l() {
      u.value = "", h.value = !1, await _e(), c.value?.querySelector("button")?.focus();
    }
    function p() {
      !n.value || t.value || (f("add", n.value), l());
    }
    return (r, a) => (D(), W("div", {
      ref_key: "row",
      ref: c,
      class: "work-add-definition"
    }, [
      h.value ? (D(), W("div", {
        key: 1,
        class: "work-add-editor",
        onKeydown: Te(Se(l, ["stop", "prevent"]), ["esc"])
      }, [
        K("label", yt, [
          be(Y(e.label) + " ", 1),
          J(F(Ve), {
            modelValue: u.value,
            "onUpdate:modelValue": a[0] || (a[0] = (m) => u.value = m),
            "aria-label": e.label,
            maxlength: e.maxlength,
            invalid: !!t.value,
            "aria-describedby": t.value ? F(i) : void 0,
            onKeydown: Te(Se(p, ["stop", "prevent"]), ["enter"])
          }, null, 8, ["modelValue", "aria-label", "maxlength", "invalid", "aria-describedby", "onKeydown"])
        ]),
        le(r.$slots, "default"),
        K("div", wt, [
          J(F(de), {
            type: "button",
            label: e.action,
            size: "small",
            disabled: !n.value || !!t.value,
            onClick: p
          }, null, 8, ["label", "disabled"]),
          J(F(de), {
            type: "button",
            label: "Cancel",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: l
          })
        ]),
        t.value ? (D(), W("p", {
          key: 0,
          id: F(i),
          class: "work-error work-small",
          role: "status"
        }, Y(t.value), 9, vt)) : ne("", !0)
      ], 40, gt)) : (D(), Z(F(de), {
        key: 0,
        type: "button",
        label: e.action,
        "aria-expanded": "false",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: s
      }, {
        icon: re(() => [
          J(F(Oe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["label"]))
    ], 512));
  }
}), Et = /* @__PURE__ */ se({
  __name: "Disclosure",
  props: /* @__PURE__ */ Qe({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const o = Xe(e, "open");
    return (d, f) => (D(), Z(F(at), {
      class: "kx-disclosure",
      value: o.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = (c) => o.value = c === "content")
    }, {
      default: re(() => [
        J(F(lt), { value: "content" }, {
          default: re(() => [
            J(F(ot), { class: "kx-disclosure-toggle" }, {
              default: re(() => [
                be(Y(e.label), 1)
              ]),
              _: 1
            }),
            J(F(st), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: re(() => [
                le(d.$slots, "default")
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
}), xt = { class: "work-stack work-tight" }, _t = {
  key: 0,
  class: "work-small work-muted"
}, Ot = {
  key: 1,
  role: "alert",
  class: "work-error"
}, Nt = { class: "work-json-example" }, jt = /* @__PURE__ */ se({
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
    const d = e, f = o, c = X(""), h = X("");
    ce(() => d.modelValue, (i) => {
      c.value = i === void 0 ? "" : JSON.stringify(i, null, 2), h.value = "", f("validity", !0);
    }, { immediate: !0 }), Ie(() => f("validity", !0));
    function u(i) {
      c.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && d.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && d.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        h.value = "", f("update:modelValue", n), f("validity", !0);
      } catch (n) {
        h.value = n instanceof Error ? n.message : "Invalid JSON.", f("validity", !1);
      }
    }
    return (i, n) => (D(), Z(Et, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: re(() => [
        K("label", xt, [
          K("span", null, Y(e.label), 1),
          e.hint ? (D(), W("span", _t, Y(e.hint), 1)) : ne("", !0),
          J(F(dt), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: c.value,
            "aria-invalid": !!h.value,
            onInput: n[0] || (n[0] = (t) => u(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          h.value ? (D(), W("span", Ot, Y(h.value), 1)) : ne("", !0)
        ]),
        n[1] || (n[1] = K("p", { class: "work-small work-muted" }, "Example", -1)),
        K("pre", Nt, Y(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), Ee = /* @__PURE__ */ new Map();
function me(e, o = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => me(f, o)).join(", ");
  if (typeof e == "string") return o.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const d = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof d[f] == "string" && d[f] && !ge(d[f])) return d[f];
  return o.get(`${d.kind ?? "user"}:${d.id}`) ?? (typeof d.email == "string" && d.email ? d.email : d.kind === "group" ? "Unavailable group" : typeof d.id == "string" ? me(d.id, o) : "Unavailable person");
}
async function It(e, o) {
  const d = [...new Map(o.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, d]), c = Ee.get(f);
  if (c) return c;
  const u = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < d.length; n += 200) {
      const t = await oe(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: d.slice(n, n + 200) }, "Display names");
      for (const s of t.principals) s.label.trim() && !ge(s.label) && s.label !== s.id && i.set(`${s.type}:${s.id}`, s.label.trim());
    }
    return i;
  })();
  Ee.set(f, u);
  try {
    return await u;
  } finally {
    Ee.delete(f);
  }
}
function Ct(e, o) {
  const d = X(/* @__PURE__ */ new Map()), f = X("");
  let c = 0;
  return ce([e, o], async ([h, u]) => {
    const i = ++c;
    if (d.value = /* @__PURE__ */ new Map(), f.value = "", !(!h || !u.length))
      try {
        const n = await It(h, u);
        i === c && (d.value = n);
      } catch (n) {
        i === c && (f.value = De(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), Ze(() => {
    c++, d.value.clear();
  }), {
    labels: d,
    error: f,
    label: (h) => me(h, d.value),
    remember: (h, u) => {
      u.trim() && !ge(u) && u !== h.id && d.value.set(`${h.kind}:${h.id}`, u.trim());
    }
  };
}
function ye(e) {
  if (ge(e)) return "Untitled";
  const o = e.replace(/[_-]+/g, " ");
  return o.charAt(0).toUpperCase() + o.slice(1);
}
function dn(e) {
  return e.title?.trim() || ye(e.code);
}
function Ue(e, o, d = me) {
  return e == null ? "—" : o?.type === "principal" ? d(e) : Array.isArray(e) ? e.map((f) => Ue(f, o, d)).join(", ") : o?.type === "option" && typeof e == "string" ? o.options?.find((f) => f.id === e)?.label || ye(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (o?.form === "ref" || o?.type === "item") && "unavailable" in e ? "Unavailable" : o?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : o?.form === "ref" && "ref" in e && Array.isArray(e.ref) || o?.form === "ref" && "id" in e && typeof e.id == "string" || o?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function un(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function cn(e, o) {
  const d = Ct(e, o);
  return {
    display: (f, c) => Ue(f, c, d.label),
    principalLabel: d.label,
    rememberPrincipal: d.remember,
    nameError: d.error,
    nameLabels: d.labels
  };
}
function Be(e) {
  return Object.entries(fe(e.properties)).map(([o, d]) => {
    const f = fe(d);
    return { key: o, title: typeof f.title == "string" && f.title.trim() ? f.title : ye(o), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const Ne = (e) => e.type === "array" && fe(e.items).type === "string";
function Lt(e, o) {
  const d = {};
  for (const f of Be(e)) {
    const c = o[f.key] ?? f.schema.default, h = f.schema;
    let u = "";
    if (c == null)
      Array.isArray(e.required) && e.required.includes(f.key) && (u = "A value is required.");
    else if (Array.isArray(h.enum) && !h.enum.includes(c)) u = "Choose one of the available values.";
    else if (h.type === "integer" || h.type === "number")
      typeof c != "number" || !Number.isFinite(c) || h.type === "integer" && !Number.isInteger(c) ? u = h.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof h.minimum == "number" && c < h.minimum ? u = `Enter at least ${h.minimum}.` : typeof h.maximum == "number" && c > h.maximum && (u = `Enter at most ${h.maximum}.`);
    else if (h.type === "boolean" && typeof c != "boolean") u = "Choose on or off.";
    else if (h.type === "string") {
      if (typeof c != "string") u = "Enter text.";
      else if (typeof h.minLength == "number" && c.length < h.minLength) u = `Enter at least ${h.minLength} characters.`;
      else if (typeof h.maxLength == "number" && c.length > h.maxLength) u = `Enter at most ${h.maxLength} characters.`;
      else if (typeof h.pattern == "string")
        try {
          new RegExp(h.pattern).test(c) || (u = "Use the required format.");
        } catch {
          u = "The declared format is unavailable.";
        }
    } else if (h.type === "array") {
      if (!Array.isArray(c)) u = "Enter a list.";
      else if (typeof h.maxItems == "number" && c.length > h.maxItems) u = `Use at most ${h.maxItems} entries.`;
      else if (typeof h.minItems == "number" && c.length < h.minItems) u = `Use at least ${h.minItems} entries.`;
      else if (h.uniqueItems && new Set(c).size !== c.length) u = "Remove duplicate entries.";
      else if (Ne(h)) {
        const i = fe(h.items);
        c.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (u = "Each entry must match the declared text length.");
      }
    } else h.type === "object" && (typeof c != "object" || Array.isArray(c)) && (u = "Enter an object.");
    u && (d[f.key] = u);
  }
  return d;
}
const At = { class: "work-stack" }, Tt = ["inert", "schema", "config"], St = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Mt = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Rt = { class: "work-config-fields" }, $t = {
  key: 0,
  class: "work-config-label"
}, Vt = ["for"], Pt = {
  key: 3,
  class: "work-config-chips"
}, Dt = {
  key: 8,
  class: "work-muted work-small"
}, Ft = {
  key: 9,
  role: "alert",
  class: "work-error work-small"
}, fn = /* @__PURE__ */ se({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: o }) {
    const d = e, f = o, c = X(/* @__PURE__ */ new Set()), h = X(!1), u = X(!1), i = je(), n = ee(() => Be(d.schema)), t = ee(() => Lt(d.schema, d.modelValue)), s = ee(() => n.value.filter((k) => typeof k.schema.picker == "string")), l = ee(() => n.value.filter((k) => typeof k.schema.picker != "string")), p = ee(() => ({ ...d.schema, properties: Object.fromEntries(s.value.map((k) => [k.key, { ...k.schema, title: k.title }])), required: Array.isArray(d.schema.required) ? d.schema.required.filter((k) => s.value.some((w) => w.key === k)) : [] })), r = ee(() => Object.fromEntries(s.value.map((k) => [k.key, d.modelValue[k.key]]))), a = ee(() => !Object.keys(t.value).length && !c.value.size && (!s.value.length || h.value));
    ce(a, (k) => f("validity", k), { immediate: !0 });
    async function m() {
      u.value = !0, h.value = await ut("wc-schema-form"), u.value = !1;
    }
    ce(() => s.value.length > 0, (k) => {
      k && m();
    }, { immediate: !0 }), Ie(() => f("validity", !0));
    function g(k, w) {
      const b = { ...d.modelValue };
      w == null ? delete b[k] : b[k] = w, f("update:modelValue", b);
    }
    function _(k) {
      const w = d.modelValue[k];
      return Array.isArray(w) ? w.filter((b) => typeof b == "string") : [];
    }
    function C(k, w) {
      w ? c.value.delete(k) : c.value.add(k);
    }
    function v(k) {
      f("update:modelValue", { ...d.modelValue, ...fe(k.detail) });
    }
    return (k, w) => (D(), W("div", At, [
      s.value.length && h.value ? (D(), W("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(p.value),
        config: JSON.stringify(r.value),
        onConfigChanged: v
      }, null, 40, Tt)) : s.value.length && u.value ? (D(), W("p", St, "The configuration widget is loading.")) : s.value.length ? (D(), W("p", Mt, [
        w[0] || (w[0] = be("The configuration widget is unavailable.", -1)),
        J(F(de), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: m
        })
      ])) : ne("", !0),
      K("div", Rt, [
        (D(!0), W(xe, null, Me(l.value, (b) => (D(), W("div", {
          key: b.key,
          class: "work-config-field"
        }, [
          F(Ne)(b.schema) ? (D(), W("span", $t, Y(b.title), 1)) : (D(), W("label", {
            key: 1,
            class: "work-config-label",
            for: F(i) + "-" + b.key
          }, Y(b.title), 9, Vt)),
          Array.isArray(b.schema.enum) ? (D(), Z(F(rt), {
            key: 2,
            "input-id": F(i) + "-" + b.key,
            "model-value": e.modelValue[b.key] ?? b.schema.default,
            options: b.schema.enum,
            appendTo: "self",
            "aria-label": b.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : F(Ne)(b.schema) ? (D(), W("div", Pt, [
            (D(!0), W(xe, null, Me(_(b.key), (O, T) => (D(), Z(F(it), {
              key: T,
              label: O,
              removable: !e.disabled,
              onRemove: (S) => g(b.key, _(b.key).filter((R, y) => y !== T))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            e.disabled ? ne("", !0) : (D(), Z(kt, {
              key: 0,
              action: "Add value",
              label: "Add " + b.title.toLocaleLowerCase(),
              onAdd: (O) => g(b.key, [..._(b.key), O])
            }, null, 8, ["label", "onAdd"]))
          ])) : ["integer", "number"].includes(String(b.schema.type)) ? (D(), Z(F(tt), {
            key: 4,
            "input-id": F(i) + "-" + b.key,
            "model-value": e.modelValue[b.key] ?? b.schema.default,
            "max-fraction-digits": b.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": b.title,
            disabled: e.disabled,
            invalid: !!t.value[b.key],
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : b.schema.type === "boolean" ? (D(), Z(F(nt), {
            key: 5,
            "input-id": F(i) + "-" + b.key,
            "model-value": !!(e.modelValue[b.key] ?? b.schema.default),
            "aria-label": b.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (O) => g(b.key, O)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(b.schema.type)) ? (D(), Z(jt, {
            key: 6,
            label: b.title,
            "model-value": e.modelValue[b.key],
            shape: b.schema.type === "array" ? "array" : "object",
            example: b.schema.default ?? (b.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (O) => g(b.key, O),
            onValidity: (O) => C(b.key, O)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (D(), Z(F(Ve), {
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
}), Gt = ["aria-label", "aria-busy"], hn = /* @__PURE__ */ se({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const d = e, f = o, c = X(null);
    let h = null;
    async function u() {
      await _e();
      const n = c.value;
      if (n)
        if (d.visible && !n.open) {
          const t = n.getRootNode();
          h = d.returnFocus ?? t.activeElement, n.showModal();
        } else !d.visible && n.open && (n.close(), h?.focus());
    }
    function i(n) {
      n.preventDefault(), d.busy || f("close");
    }
    return ce(() => d.visible, u), et(u), Ie(() => {
      c.value?.open && c.value.close(), h?.focus();
    }), (n, t) => (D(), W("dialog", {
      ref_key: "dialog",
      ref: c,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && f("close");
      })
    }, [
      le(n.$slots, "default")
    ], 40, Gt));
  }
}), pe = "/api/v1/work", he = (e) => `${pe}/boards/${encodeURIComponent(e)}`, Ut = {
  boards: async () => {
    const e = [];
    let o;
    do {
      const d = await ke(`${pe}/boards${o ? "?after=" + encodeURIComponent(o) : ""}`, "Boards");
      e.push(...d.boards), o = d.next;
    } while (o);
    return e;
  },
  packs: () => ke(`${pe}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, o, d, f = {}) => oe(`${pe}/boards`, { title: e, declaration: o, idempotency_key: d, ...f }, "Create board"),
  updateBoard: (e, o) => oe(`${he(e)}/update`, o, "Update board"),
  schema: (e, o, d) => oe(`${he(e)}/get_schema`, { generation: o, ...d ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, o) => oe(`${he(e)}/query`, o, "Item choices"),
  async stateCounts(e) {
    const o = /* @__PURE__ */ Object.create(null);
    let d;
    do {
      const f = await Ut.query(e, { group_by: "type", sub_group_by: "state", group_after: d, limit: 1 });
      if (f.incomplete || f.reindexing) throw new Error("Counts unavailable");
      for (const c of f.groups ?? []) {
        if (typeof c.value != "string") continue;
        const h = o[c.value] ??= /* @__PURE__ */ Object.create(null);
        for (const u of c.groups ?? []) typeof u.value == "string" && (h[u.value] = u.count);
      }
      d = f.group_after;
    } while (d);
    return o;
  },
  item: (e, o) => oe(`${he(e)}/get`, { item: o }, "Item choice"),
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
const pn = (function() {
  return (/* @__PURE__ */ (function() {
    function e(o, d, f) {
      function c(i, n) {
        if (!d[i]) {
          if (!o[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (h) return h(i, !0);
            var s = new Error("Cannot find module '" + i + "'");
            throw s.code = "MODULE_NOT_FOUND", s;
          }
          var l = d[i] = { exports: {} };
          o[i][0].call(l.exports, function(p) {
            var r = o[i][1][p];
            return c(r || p);
          }, l, l.exports, e, o, d, f);
        }
        return d[i].exports;
      }
      for (var h = typeof require == "function" && require, u = 0; u < f.length; u++) c(f[u]);
      return c;
    }
    return e;
  })())({ 1: [function(e, o, d) {
    o.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, o, d) {
    let f = e("./greedy-fas"), c = e("./util").uniqueId;
    o.exports = { run: h, undo: i };
    function h(n) {
      (n.graph().acyclicer === "greedy" ? f(n, s(n)) : u(n)).forEach((l) => {
        let p = n.edge(l);
        n.removeEdge(l), p.forwardName = l.name, p.reversed = !0, n.setEdge(l.w, l.v, p, c("rev"));
      });
      function s(l) {
        return (p) => l.edge(p).weight;
      }
    }
    function u(n) {
      let t = [], s = {}, l = {};
      function p(r) {
        Object.hasOwn(l, r) || (l[r] = !0, s[r] = !0, n.outEdges(r).forEach((a) => {
          Object.hasOwn(s, a.w) ? t.push(a) : p(a.w);
        }), delete s[r]);
      }
      return n.nodes().forEach(p), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let s = n.edge(t);
        if (s.reversed) {
          n.removeEdge(t);
          let l = s.forwardName;
          delete s.reversed, delete s.forwardName, n.setEdge(t.w, t.v, s, l);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, o, d) {
    let f = e("./util");
    o.exports = c;
    function c(u) {
      function i(n) {
        let t = u.children(n), s = u.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(s, "minRank")) {
          s.borderLeft = [], s.borderRight = [];
          for (let l = s.minRank, p = s.maxRank + 1; l < p; ++l)
            h(u, "borderLeft", "_bl", n, s, l), h(u, "borderRight", "_br", n, s, l);
        }
      }
      u.children().forEach(i);
    }
    function h(u, i, n, t, s, l) {
      let p = { width: 0, height: 0, rank: l, borderType: i }, r = s[i][l - 1], a = f.addDummyNode(u, "border", p, n);
      s[i][l] = a, u.setParent(a, t), r && u.setEdge(r, a, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, o, d) {
    o.exports = { adjust: f, undo: c };
    function f(l) {
      let p = l.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && h(l);
    }
    function c(l) {
      let p = l.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(l), (p === "lr" || p === "rl") && (t(l), h(l));
    }
    function h(l) {
      l.nodes().forEach((p) => u(l.node(p))), l.edges().forEach((p) => u(l.edge(p)));
    }
    function u(l) {
      let p = l.width;
      l.width = l.height, l.height = p;
    }
    function i(l) {
      l.nodes().forEach((p) => n(l.node(p))), l.edges().forEach((p) => {
        let r = l.edge(p);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(l) {
      l.y = -l.y;
    }
    function t(l) {
      l.nodes().forEach((p) => s(l.node(p))), l.edges().forEach((p) => {
        let r = l.edge(p);
        r.points.forEach(s), Object.hasOwn(r, "x") && s(r);
      });
    }
    function s(l) {
      let p = l.x;
      l.x = l.y, l.y = p;
    }
  }, {}], 5: [function(e, o, d) {
    class f {
      constructor() {
        let i = {};
        i._next = i._prev = i, this._sentinel = i;
      }
      dequeue() {
        let i = this._sentinel, n = i._prev;
        if (n !== i)
          return c(n), n;
      }
      enqueue(i) {
        let n = this._sentinel;
        i._prev && i._next && c(i), i._next = n._next, n._next._prev = i, n._next = i, i._prev = n;
      }
      toString() {
        let i = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          i.push(JSON.stringify(t, h)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function c(u) {
      u._prev._next = u._next, u._next._prev = u._prev, delete u._next, delete u._prev;
    }
    function h(u, i) {
      if (u !== "_next" && u !== "_prev")
        return i;
    }
    o.exports = f;
  }, {}], 6: [function(e, o, d) {
    let f = e("./util"), c = e("@dagrejs/graphlib").Graph;
    o.exports = { debugOrdering: h };
    function h(u) {
      let i = f.buildLayerMatrix(u), n = new c({ compound: !0, multigraph: !0 }).setGraph({});
      return u.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + u.node(t).rank);
      }), u.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, s) => {
        let l = "layer" + s;
        n.setNode(l, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("./data/list");
    o.exports = u;
    let h = () => 1;
    function u(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let a = t(p, r || h);
      return i(a.graph, a.buckets, a.zeroIdx).flatMap((g) => p.outEdges(g.v, g.w));
    }
    function i(p, r, a) {
      let m = [], g = r[r.length - 1], _ = r[0], C;
      for (; p.nodeCount(); ) {
        for (; C = _.dequeue(); )
          n(p, r, a, C);
        for (; C = g.dequeue(); )
          n(p, r, a, C);
        if (p.nodeCount()) {
          for (let v = r.length - 2; v > 0; --v)
            if (C = r[v].dequeue(), C) {
              m = m.concat(n(p, r, a, C, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(p, r, a, m, g) {
      let _ = g ? [] : void 0;
      return p.inEdges(m.v).forEach((C) => {
        let v = p.edge(C), k = p.node(C.v);
        g && _.push({ v: C.v, w: C.w }), k.out -= v, s(r, a, k);
      }), p.outEdges(m.v).forEach((C) => {
        let v = p.edge(C), k = C.w, w = p.node(k);
        w.in -= v, s(r, a, w);
      }), p.removeNode(m.v), _;
    }
    function t(p, r) {
      let a = new f(), m = 0, g = 0;
      p.nodes().forEach((v) => {
        a.setNode(v, { v, in: 0, out: 0 });
      }), p.edges().forEach((v) => {
        let k = a.edge(v.v, v.w) || 0, w = r(v), b = k + w;
        a.setEdge(v.v, v.w, b), g = Math.max(g, a.node(v.v).out += w), m = Math.max(m, a.node(v.w).in += w);
      });
      let _ = l(g + m + 3).map(() => new c()), C = m + 1;
      return a.nodes().forEach((v) => {
        s(_, C, a.node(v));
      }), { graph: a, buckets: _, zeroIdx: C };
    }
    function s(p, r, a) {
      a.out ? a.in ? p[a.out - a.in + r].enqueue(a) : p[p.length - 1].enqueue(a) : p[0].enqueue(a);
    }
    function l(p) {
      const r = [];
      for (let a = 0; a < p; a++)
        r.push(a);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, o, d) {
    let f = e("./acyclic"), c = e("./normalize"), h = e("./rank"), u = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), s = e("./add-border-segments"), l = e("./coordinate-system"), p = e("./order"), r = e("./position"), a = e("./util"), m = e("@dagrejs/graphlib").Graph;
    o.exports = g;
    function g(x, j) {
      let L = j && j.debugTiming ? a.time : a.notime;
      L("layout", () => {
        let M = L("  buildLayoutGraph", () => y(x));
        L("  runLayout", () => _(M, L, j)), L("  updateInputGraph", () => C(x, M));
      });
    }
    function _(x, j, L) {
      j("    makeSpaceForEdgeLabels", () => E(x)), j("    removeSelfEdges", () => Je(x)), j("    acyclic", () => f.run(x)), j("    nestingGraph.run", () => t.run(x)), j("    rank", () => h(a.asNonCompoundGraph(x))), j("    injectEdgeLabelProxies", () => N(x)), j("    removeEmptyRanks", () => n(x)), j("    nestingGraph.cleanup", () => t.cleanup(x)), j("    normalizeRanks", () => u(x)), j("    assignRankMinMax", () => I(x)), j("    removeEdgeLabelProxies", () => A(x)), j("    normalize.run", () => c.run(x)), j("    parentDummyChains", () => i(x)), j("    addBorderSegments", () => s(x)), j("    order", () => p(x, L)), j("    insertSelfEdges", () => He(x)), j("    adjustCoordinateSystem", () => l.adjust(x)), j("    position", () => r(x)), j("    positionSelfEdges", () => qe(x)), j("    removeBorderNodes", () => te(x)), j("    normalize.undo", () => c.undo(x)), j("    fixupEdgeLabelCoords", () => U(x)), j("    undoCoordinateSystem", () => l.undo(x)), j("    translateGraph", () => $(x)), j("    assignNodeIntersects", () => V(x)), j("    reversePoints", () => Q(x)), j("    acyclic.undo", () => f.undo(x));
    }
    function C(x, j) {
      x.nodes().forEach((L) => {
        let M = x.node(L), P = j.node(L);
        M && (M.x = P.x, M.y = P.y, M.rank = P.rank, j.children(L).length && (M.width = P.width, M.height = P.height));
      }), x.edges().forEach((L) => {
        let M = x.edge(L), P = j.edge(L);
        M.points = P.points, Object.hasOwn(P, "x") && (M.x = P.x, M.y = P.y);
      }), x.graph().width = j.graph().width, x.graph().height = j.graph().height;
    }
    let v = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], k = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, w = ["acyclicer", "ranker", "rankdir", "align"], b = ["width", "height", "rank"], O = { width: 0, height: 0 }, T = ["minlen", "weight", "width", "height", "labeloffset"], S = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, R = ["labelpos"];
    function y(x) {
      let j = new m({ multigraph: !0, compound: !0 }), L = ve(x.graph());
      return j.setGraph(Object.assign({}, k, we(L, v), a.pick(L, w))), x.nodes().forEach((M) => {
        let P = ve(x.node(M));
        const G = we(P, b);
        Object.keys(O).forEach((B) => {
          G[B] === void 0 && (G[B] = O[B]);
        }), j.setNode(M, G), j.setParent(M, x.parent(M));
      }), x.edges().forEach((M) => {
        let P = ve(x.edge(M));
        j.setEdge(M, Object.assign({}, S, we(P, T), a.pick(P, R)));
      }), j;
    }
    function E(x) {
      let j = x.graph();
      j.ranksep /= 2, x.edges().forEach((L) => {
        let M = x.edge(L);
        M.minlen *= 2, M.labelpos.toLowerCase() !== "c" && (j.rankdir === "TB" || j.rankdir === "BT" ? M.width += M.labeloffset : M.height += M.labeloffset);
      });
    }
    function N(x) {
      x.edges().forEach((j) => {
        let L = x.edge(j);
        if (L.width && L.height) {
          let M = x.node(j.v), G = { rank: (x.node(j.w).rank - M.rank) / 2 + M.rank, e: j };
          a.addDummyNode(x, "edge-proxy", G, "_ep");
        }
      });
    }
    function I(x) {
      let j = 0;
      x.nodes().forEach((L) => {
        let M = x.node(L);
        M.borderTop && (M.minRank = x.node(M.borderTop).rank, M.maxRank = x.node(M.borderBottom).rank, j = Math.max(j, M.maxRank));
      }), x.graph().maxRank = j;
    }
    function A(x) {
      x.nodes().forEach((j) => {
        let L = x.node(j);
        L.dummy === "edge-proxy" && (x.edge(L.e).labelRank = L.rank, x.removeNode(j));
      });
    }
    function $(x) {
      let j = Number.POSITIVE_INFINITY, L = 0, M = Number.POSITIVE_INFINITY, P = 0, G = x.graph(), B = G.marginx || 0, H = G.marginy || 0;
      function Ce(q) {
        let z = q.x, ue = q.y, Le = q.width, Ae = q.height;
        j = Math.min(j, z - Le / 2), L = Math.max(L, z + Le / 2), M = Math.min(M, ue - Ae / 2), P = Math.max(P, ue + Ae / 2);
      }
      x.nodes().forEach((q) => Ce(x.node(q))), x.edges().forEach((q) => {
        let z = x.edge(q);
        Object.hasOwn(z, "x") && Ce(z);
      }), j -= B, M -= H, x.nodes().forEach((q) => {
        let z = x.node(q);
        z.x -= j, z.y -= M;
      }), x.edges().forEach((q) => {
        let z = x.edge(q);
        z.points.forEach((ue) => {
          ue.x -= j, ue.y -= M;
        }), Object.hasOwn(z, "x") && (z.x -= j), Object.hasOwn(z, "y") && (z.y -= M);
      }), G.width = L - j + B, G.height = P - M + H;
    }
    function V(x) {
      x.edges().forEach((j) => {
        let L = x.edge(j), M = x.node(j.v), P = x.node(j.w), G, B;
        L.points ? (G = L.points[0], B = L.points[L.points.length - 1]) : (L.points = [], G = P, B = M), L.points.unshift(a.intersectRect(M, G)), L.points.push(a.intersectRect(P, B));
      });
    }
    function U(x) {
      x.edges().forEach((j) => {
        let L = x.edge(j);
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
    function Q(x) {
      x.edges().forEach((j) => {
        let L = x.edge(j);
        L.reversed && L.points.reverse();
      });
    }
    function te(x) {
      x.nodes().forEach((j) => {
        if (x.children(j).length) {
          let L = x.node(j), M = x.node(L.borderTop), P = x.node(L.borderBottom), G = x.node(L.borderLeft[L.borderLeft.length - 1]), B = x.node(L.borderRight[L.borderRight.length - 1]);
          L.width = Math.abs(B.x - G.x), L.height = Math.abs(P.y - M.y), L.x = G.x + L.width / 2, L.y = M.y + L.height / 2;
        }
      }), x.nodes().forEach((j) => {
        x.node(j).dummy === "border" && x.removeNode(j);
      });
    }
    function Je(x) {
      x.edges().forEach((j) => {
        if (j.v === j.w) {
          var L = x.node(j.v);
          L.selfEdges || (L.selfEdges = []), L.selfEdges.push({ e: j, label: x.edge(j) }), x.removeEdge(j);
        }
      });
    }
    function He(x) {
      var j = a.buildLayerMatrix(x);
      j.forEach((L) => {
        var M = 0;
        L.forEach((P, G) => {
          var B = x.node(P);
          B.order = G + M, (B.selfEdges || []).forEach((H) => {
            a.addDummyNode(x, "selfedge", { width: H.label.width, height: H.label.height, rank: B.rank, order: G + ++M, e: H.e, label: H.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function qe(x) {
      x.nodes().forEach((j) => {
        var L = x.node(j);
        if (L.dummy === "selfedge") {
          var M = x.node(L.e.v), P = M.x + M.width / 2, G = M.y, B = L.x - P, H = M.height / 2;
          x.setEdge(L.e, L.label), x.removeNode(j), L.label.points = [{ x: P + 2 * B / 3, y: G - H }, { x: P + 5 * B / 6, y: G - H }, { x: P + B, y: G }, { x: P + 5 * B / 6, y: G + H }, { x: P + 2 * B / 3, y: G + H }], L.label.x = L.x, L.label.y = L.y;
        }
      });
    }
    function we(x, j) {
      return a.mapValues(a.pick(x, j), Number);
    }
    function ve(x) {
      var j = {};
      return x && Object.entries(x).forEach(([L, M]) => {
        typeof L == "string" && (L = L.toLowerCase()), j[L] = M;
      }), j;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, o, d) {
    let f = e("./util");
    o.exports = { run: c, cleanup: n };
    function c(t) {
      let s = f.addDummyNode(t, "root", {}, "_root"), l = u(t), p = Object.values(l), r = f.applyWithChunking(Math.max, p) - 1, a = 2 * r + 1;
      t.graph().nestingRoot = s, t.edges().forEach((g) => t.edge(g).minlen *= a);
      let m = i(t) + 1;
      t.children().forEach((g) => h(t, s, a, m, r, l, g)), t.graph().nodeRankFactor = a;
    }
    function h(t, s, l, p, r, a, m) {
      let g = t.children(m);
      if (!g.length) {
        m !== s && t.setEdge(s, m, { weight: 0, minlen: l });
        return;
      }
      let _ = f.addBorderNode(t, "_bt"), C = f.addBorderNode(t, "_bb"), v = t.node(m);
      t.setParent(_, m), v.borderTop = _, t.setParent(C, m), v.borderBottom = C, g.forEach((k) => {
        h(t, s, l, p, r, a, k);
        let w = t.node(k), b = w.borderTop ? w.borderTop : k, O = w.borderBottom ? w.borderBottom : k, T = w.borderTop ? p : 2 * p, S = b !== O ? 1 : r - a[m] + 1;
        t.setEdge(_, b, { weight: T, minlen: S, nestingEdge: !0 }), t.setEdge(O, C, { weight: T, minlen: S, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(s, _, { weight: 0, minlen: r + a[m] });
    }
    function u(t) {
      var s = {};
      function l(p, r) {
        var a = t.children(p);
        a && a.length && a.forEach((m) => l(m, r + 1)), s[p] = r;
      }
      return t.children().forEach((p) => l(p, 1)), s;
    }
    function i(t) {
      return t.edges().reduce((s, l) => s + t.edge(l).weight, 0);
    }
    function n(t) {
      var s = t.graph();
      t.removeNode(s.nestingRoot), delete s.nestingRoot, t.edges().forEach((l) => {
        var p = t.edge(l);
        p.nestingEdge && t.removeEdge(l);
      });
    }
  }, { "./util": 27 }], 10: [function(e, o, d) {
    let f = e("./util");
    o.exports = { run: c, undo: u };
    function c(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => h(i, n));
    }
    function h(i, n) {
      let t = n.v, s = i.node(t).rank, l = n.w, p = i.node(l).rank, r = n.name, a = i.edge(n), m = a.labelRank;
      if (p === s + 1) return;
      i.removeEdge(n);
      let g, _, C;
      for (C = 0, ++s; s < p; ++C, ++s)
        a.points = [], _ = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: s }, g = f.addDummyNode(i, "edge", _, "_d"), s === m && (_.width = a.width, _.height = a.height, _.dummy = "edge-label", _.labelpos = a.labelpos), i.setEdge(t, g, { weight: a.weight }, r), C === 0 && i.graph().dummyChains.push(g), t = g;
      i.setEdge(t, l, { weight: a.weight }, r);
    }
    function u(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), s = t.edgeLabel, l;
        for (i.setEdge(t.edgeObj, s); t.dummy; )
          l = i.successors(n)[0], i.removeNode(n), s.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (s.x = t.x, s.y = t.y, s.width = t.width, s.height = t.height), n = l, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, o, d) {
    o.exports = f;
    function f(c, h, u) {
      let i = {}, n;
      u.forEach((t) => {
        let s = c.parent(t), l, p;
        for (; s; ) {
          if (l = c.parent(s), l ? (p = i[l], i[l] = s) : (p = n, n = s), p && p !== s) {
            h.setEdge(p, s);
            return;
          }
          s = l;
        }
      });
    }
  }, {}], 12: [function(e, o, d) {
    o.exports = f;
    function f(c, h = []) {
      return h.map((u) => {
        let i = c.inEdges(u);
        if (i.length) {
          let n = i.reduce((t, s) => {
            let l = c.edge(s), p = c.node(s.v);
            return { sum: t.sum + l.weight * p.order, weight: t.weight + l.weight };
          }, { sum: 0, weight: 0 });
          return { v: u, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: u };
      });
    }
  }, {}], 13: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("../util");
    o.exports = h;
    function h(i, n, t, s) {
      s || (s = i.nodes());
      let l = u(i), p = new f({ compound: !0 }).setGraph({ root: l }).setDefaultNodeLabel((r) => i.node(r));
      return s.forEach((r) => {
        let a = i.node(r), m = i.parent(r);
        (a.rank === n || a.minRank <= n && n <= a.maxRank) && (p.setNode(r), p.setParent(r, m || l), i[t](r).forEach((g) => {
          let _ = g.v === r ? g.w : g.v, C = p.edge(_, r), v = C !== void 0 ? C.weight : 0;
          p.setEdge(_, r, { weight: i.edge(g).weight + v });
        }), Object.hasOwn(a, "minRank") && p.setNode(r, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
      }), p;
    }
    function u(i) {
      for (var n; i.hasNode(n = c.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, o, d) {
    let f = e("../util").zipObject;
    o.exports = c;
    function c(u, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += h(u, i[t - 1], i[t]);
      return n;
    }
    function h(u, i, n) {
      let t = f(n, n.map((m, g) => g)), s = i.flatMap((m) => u.outEdges(m).map((g) => ({ pos: t[g.w], weight: u.edge(g).weight })).sort((g, _) => g.pos - _.pos)), l = 1;
      for (; l < n.length; ) l <<= 1;
      let p = 2 * l - 1;
      l -= 1;
      let r = new Array(p).fill(0), a = 0;
      return s.forEach((m) => {
        let g = m.pos + l;
        r[g] += m.weight;
        let _ = 0;
        for (; g > 0; )
          g % 2 && (_ += r[g + 1]), g = g - 1 >> 1, r[g] += m.weight;
        a += m.weight * _;
      }), a;
    }
  }, { "../util": 27 }], 15: [function(e, o, d) {
    let f = e("./init-order"), c = e("./cross-count"), h = e("./sort-subgraph"), u = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    o.exports = s;
    function s(a, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(a, s);
        return;
      }
      let g = t.maxRank(a), _ = l(a, t.range(1, g + 1), "inEdges"), C = l(a, t.range(g - 1, -1, -1), "outEdges"), v = f(a);
      if (r(a, v), m && m.disableOptimalOrderHeuristic)
        return;
      let k = Number.POSITIVE_INFINITY, w;
      for (let b = 0, O = 0; O < 4; ++b, ++O) {
        p(b % 2 ? _ : C, b % 4 >= 2), v = t.buildLayerMatrix(a);
        let T = c(a, v);
        T < k && (O = 0, w = Object.assign({}, v), k = T);
      }
      r(a, w);
    }
    function l(a, m, g) {
      const _ = /* @__PURE__ */ new Map(), C = (v, k) => {
        _.has(v) || _.set(v, []), _.get(v).push(k);
      };
      for (const v of a.nodes()) {
        const k = a.node(v);
        if (typeof k.rank == "number" && C(k.rank, v), typeof k.minRank == "number" && typeof k.maxRank == "number")
          for (let w = k.minRank; w <= k.maxRank; w++)
            w !== k.rank && C(w, v);
      }
      return m.map(function(v) {
        return u(a, v, g, _.get(v) || []);
      });
    }
    function p(a, m) {
      let g = new n();
      a.forEach(function(_) {
        let C = _.graph().root, v = h(_, C, g, m);
        v.vs.forEach((k, w) => _.node(k).order = w), i(_, g, v.vs);
      });
    }
    function r(a, m) {
      Object.values(m).forEach((g) => g.forEach((_, C) => a.node(_).order = C));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(h) {
      let u = {}, i = h.nodes().filter((r) => !h.children(r).length), n = i.map((r) => h.node(r).rank), t = f.applyWithChunking(Math.max, n), s = f.range(t + 1).map(() => []);
      function l(r) {
        if (u[r]) return;
        u[r] = !0;
        let a = h.node(r);
        s[a.rank].push(r), h.successors(r).forEach(l);
      }
      return i.sort((r, a) => h.node(r).rank - h.node(a).rank).forEach(l), s;
    }
  }, { "../util": 27 }], 17: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(i, n) {
      let t = {};
      i.forEach((l, p) => {
        let r = t[l.v] = { indegree: 0, in: [], out: [], vs: [l.v], i: p };
        l.barycenter !== void 0 && (r.barycenter = l.barycenter, r.weight = l.weight);
      }), n.edges().forEach((l) => {
        let p = t[l.v], r = t[l.w];
        p !== void 0 && r !== void 0 && (r.indegree++, p.out.push(t[l.w]));
      });
      let s = Object.values(t).filter((l) => !l.indegree);
      return h(s);
    }
    function h(i) {
      let n = [];
      function t(l) {
        return (p) => {
          p.merged || (p.barycenter === void 0 || l.barycenter === void 0 || p.barycenter >= l.barycenter) && u(l, p);
        };
      }
      function s(l) {
        return (p) => {
          p.in.push(l), --p.indegree === 0 && i.push(p);
        };
      }
      for (; i.length; ) {
        let l = i.pop();
        n.push(l), l.in.reverse().forEach(t(l)), l.out.forEach(s(l));
      }
      return n.filter((l) => !l.merged).map((l) => f.pick(l, ["vs", "i", "barycenter", "weight"]));
    }
    function u(i, n) {
      let t = 0, s = 0;
      i.weight && (t += i.barycenter * i.weight, s += i.weight), n.weight && (t += n.barycenter * n.weight, s += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / s, i.weight = s, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, o, d) {
    let f = e("./barycenter"), c = e("./resolve-conflicts"), h = e("./sort");
    o.exports = u;
    function u(t, s, l, p) {
      let r = t.children(s), a = t.node(s), m = a ? a.borderLeft : void 0, g = a ? a.borderRight : void 0, _ = {};
      m && (r = r.filter((w) => w !== m && w !== g));
      let C = f(t, r);
      C.forEach((w) => {
        if (t.children(w.v).length) {
          let b = u(t, w.v, l, p);
          _[w.v] = b, Object.hasOwn(b, "barycenter") && n(w, b);
        }
      });
      let v = c(C, l);
      i(v, _);
      let k = h(v, p);
      if (m && (k.vs = [m, k.vs, g].flat(!0), t.predecessors(m).length)) {
        let w = t.node(t.predecessors(m)[0]), b = t.node(t.predecessors(g)[0]);
        Object.hasOwn(k, "barycenter") || (k.barycenter = 0, k.weight = 0), k.barycenter = (k.barycenter * k.weight + w.order + b.order) / (k.weight + 2), k.weight += 2;
      }
      return k;
    }
    function i(t, s) {
      t.forEach((l) => {
        l.vs = l.vs.flatMap((p) => s[p] ? s[p].vs : p);
      });
    }
    function n(t, s) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + s.barycenter * s.weight) / (t.weight + s.weight), t.weight += s.weight) : (t.barycenter = s.barycenter, t.weight = s.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(i, n) {
      let t = f.partition(i, (_) => Object.hasOwn(_, "barycenter")), s = t.lhs, l = t.rhs.sort((_, C) => C.i - _.i), p = [], r = 0, a = 0, m = 0;
      s.sort(u(!!n)), m = h(p, l, m), s.forEach((_) => {
        m += _.vs.length, p.push(_.vs), r += _.barycenter * _.weight, a += _.weight, m = h(p, l, m);
      });
      let g = { vs: p.flat(!0) };
      return a && (g.barycenter = r / a, g.weight = a), g;
    }
    function h(i, n, t) {
      let s;
      for (; n.length && (s = n[n.length - 1]).i <= t; )
        n.pop(), i.push(s.vs), t++;
      return t;
    }
    function u(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, o, d) {
    o.exports = f;
    function f(u) {
      let i = h(u);
      u.graph().dummyChains.forEach((n) => {
        let t = u.node(n), s = t.edgeObj, l = c(u, i, s.v, s.w), p = l.path, r = l.lca, a = 0, m = p[a], g = !0;
        for (; n !== s.w; ) {
          if (t = u.node(n), g) {
            for (; (m = p[a]) !== r && u.node(m).maxRank < t.rank; )
              a++;
            m === r && (g = !1);
          }
          if (!g) {
            for (; a < p.length - 1 && u.node(m = p[a + 1]).minRank <= t.rank; )
              a++;
            m = p[a];
          }
          u.setParent(n, m), n = u.successors(n)[0];
        }
      });
    }
    function c(u, i, n, t) {
      let s = [], l = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), a, m;
      a = n;
      do
        a = u.parent(a), s.push(a);
      while (a && (i[a].low > p || r > i[a].lim));
      for (m = a, a = t; (a = u.parent(a)) !== m; )
        l.push(a);
      return { path: s.concat(l.reverse()), lca: m };
    }
    function h(u) {
      let i = {}, n = 0;
      function t(s) {
        let l = n;
        u.children(s).forEach(t), i[s] = { low: l, lim: n++ };
      }
      return u.children().forEach(t), i;
    }
  }, {}], 21: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("../util");
    o.exports = { positionX: g, findType1Conflicts: h, findType2Conflicts: u, addConflict: n, hasConflict: t, verticalAlignment: s, horizontalCompaction: l, alignCoordinates: a, findSmallestWidthAlignment: r, balance: m };
    function h(v, k) {
      let w = {};
      function b(O, T) {
        let S = 0, R = 0, y = O.length, E = T[T.length - 1];
        return T.forEach((N, I) => {
          let A = i(v, N), $ = A ? v.node(A).order : y;
          (A || N === E) && (T.slice(R, I + 1).forEach((V) => {
            v.predecessors(V).forEach((U) => {
              let Q = v.node(U), te = Q.order;
              (te < S || $ < te) && !(Q.dummy && v.node(V).dummy) && n(w, U, V);
            });
          }), R = I + 1, S = $);
        }), T;
      }
      return k.length && k.reduce(b), w;
    }
    function u(v, k) {
      let w = {};
      function b(T, S, R, y, E) {
        let N;
        c.range(S, R).forEach((I) => {
          N = T[I], v.node(N).dummy && v.predecessors(N).forEach((A) => {
            let $ = v.node(A);
            $.dummy && ($.order < y || $.order > E) && n(w, A, N);
          });
        });
      }
      function O(T, S) {
        let R = -1, y, E = 0;
        return S.forEach((N, I) => {
          if (v.node(N).dummy === "border") {
            let A = v.predecessors(N);
            A.length && (y = v.node(A[0]).order, b(S, E, I, R, y), E = I, R = y);
          }
          b(S, E, S.length, y, T.length);
        }), S;
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
    function s(v, k, w, b) {
      let O = {}, T = {}, S = {};
      return k.forEach((R) => {
        R.forEach((y, E) => {
          O[y] = y, T[y] = y, S[y] = E;
        });
      }), k.forEach((R) => {
        let y = -1;
        R.forEach((E) => {
          let N = b(E);
          if (N.length) {
            N = N.sort((A, $) => S[A] - S[$]);
            let I = (N.length - 1) / 2;
            for (let A = Math.floor(I), $ = Math.ceil(I); A <= $; ++A) {
              let V = N[A];
              T[E] === E && y < S[V] && !t(w, E, V) && (T[V] = E, T[E] = O[E] = O[V], y = S[V]);
            }
          }
        });
      }), { root: O, align: T };
    }
    function l(v, k, w, b, O) {
      let T = {}, S = p(v, k, w, O), R = O ? "borderLeft" : "borderRight";
      function y(I, A) {
        let $ = S.nodes(), V = $.pop(), U = {};
        for (; V; )
          U[V] ? I(V) : (U[V] = !0, $.push(V), $ = $.concat(A(V))), V = $.pop();
      }
      function E(I) {
        T[I] = S.inEdges(I).reduce((A, $) => Math.max(A, T[$.v] + S.edge($)), 0);
      }
      function N(I) {
        let A = S.outEdges(I).reduce((V, U) => Math.min(V, T[U.w] - S.edge(U)), Number.POSITIVE_INFINITY), $ = v.node(I);
        A !== Number.POSITIVE_INFINITY && $.borderType !== R && (T[I] = Math.max(T[I], A));
      }
      return y(E, S.predecessors.bind(S)), y(N, S.successors.bind(S)), Object.keys(b).forEach((I) => T[I] = T[w[I]]), T;
    }
    function p(v, k, w, b) {
      let O = new f(), T = v.graph(), S = _(T.nodesep, T.edgesep, b);
      return k.forEach((R) => {
        let y;
        R.forEach((E) => {
          let N = w[E];
          if (O.setNode(N), y) {
            var I = w[y], A = O.edge(I, N);
            O.setEdge(I, N, Math.max(S(v, E, y), A || 0));
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
        const S = O - T;
        return S < w[0] && (w = [S, b]), w;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function a(v, k) {
      let w = Object.values(k), b = c.applyWithChunking(Math.min, w), O = c.applyWithChunking(Math.max, w);
      ["u", "d"].forEach((T) => {
        ["l", "r"].forEach((S) => {
          let R = T + S, y = v[R];
          if (y === k) return;
          let E = Object.values(y), N = b - c.applyWithChunking(Math.min, E);
          S !== "l" && (N = O - c.applyWithChunking(Math.max, E)), N && (v[R] = c.mapValues(y, (I) => I + N));
        });
      });
    }
    function m(v, k) {
      return c.mapValues(v.ul, (w, b) => {
        if (k)
          return v[k.toLowerCase()][b];
        {
          let O = Object.values(v).map((T) => T[b]).sort((T, S) => T - S);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function g(v) {
      let k = c.buildLayerMatrix(v), w = Object.assign(h(v, k), u(v, k)), b = {}, O;
      ["u", "d"].forEach((S) => {
        O = S === "u" ? k : Object.values(k).reverse(), ["l", "r"].forEach((R) => {
          R === "r" && (O = O.map((I) => Object.values(I).reverse()));
          let y = (S === "u" ? v.predecessors : v.successors).bind(v), E = s(v, O, w, y), N = l(v, O, E.root, E.align, R === "r");
          R === "r" && (N = c.mapValues(N, (I) => -I)), b[S + R] = N;
        });
      });
      let T = r(v, b);
      return a(b, T), m(b, v.graph().align);
    }
    function _(v, k, w) {
      return (b, O, T) => {
        let S = b.node(O), R = b.node(T), y = 0, E;
        if (y += S.width / 2, Object.hasOwn(S, "labelpos"))
          switch (S.labelpos.toLowerCase()) {
            case "l":
              E = -S.width / 2;
              break;
            case "r":
              E = S.width / 2;
              break;
          }
        if (E && (y += w ? E : -E), E = 0, y += (S.dummy ? k : v) / 2, y += (R.dummy ? k : v) / 2, y += R.width / 2, Object.hasOwn(R, "labelpos"))
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
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, o, d) {
    let f = e("../util"), c = e("./bk").positionX;
    o.exports = h;
    function h(i) {
      i = f.asNonCompoundGraph(i), u(i), Object.entries(c(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function u(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, s = 0;
      n.forEach((l) => {
        const p = l.reduce((r, a) => {
          const m = i.node(a).height;
          return r > m ? r : m;
        }, 0);
        l.forEach((r) => i.node(r).y = s + p / 2), s += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, o, d) {
    var f = e("@dagrejs/graphlib").Graph, c = e("./util").slack;
    o.exports = h;
    function h(t) {
      var s = new f({ directed: !1 }), l = t.nodes()[0], p = t.nodeCount();
      s.setNode(l, {});
      for (var r, a; u(s, t) < p; )
        r = i(s, t), a = s.hasNode(r.v) ? c(t, r) : -c(t, r), n(s, t, a);
      return s;
    }
    function u(t, s) {
      function l(p) {
        s.nodeEdges(p).forEach((r) => {
          var a = r.v, m = p === a ? r.w : a;
          !t.hasNode(m) && !c(s, r) && (t.setNode(m, {}), t.setEdge(p, m, {}), l(m));
        });
      }
      return t.nodes().forEach(l), t.nodeCount();
    }
    function i(t, s) {
      return s.edges().reduce((p, r) => {
        let a = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (a = c(s, r)), a < p[0] ? [a, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, s, l) {
      t.nodes().forEach((p) => s.node(p).rank += l);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, o, d) {
    var f = e("./util"), c = f.longestPath, h = e("./feasible-tree"), u = e("./network-simplex");
    o.exports = i;
    function i(l) {
      var p = l.graph().ranker;
      if (p instanceof Function)
        return p(l);
      switch (l.graph().ranker) {
        case "network-simplex":
          s(l);
          break;
        case "tight-tree":
          t(l);
          break;
        case "longest-path":
          n(l);
          break;
        case "none":
          break;
        default:
          s(l);
      }
    }
    var n = c;
    function t(l) {
      c(l), h(l);
    }
    function s(l) {
      u(l);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, o, d) {
    var f = e("./feasible-tree"), c = e("./util").slack, h = e("./util").longestPath, u = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    o.exports = t, t.initLowLimValues = r, t.initCutValues = s, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = _;
    function t(w) {
      w = n(w), h(w);
      var b = f(w);
      r(b), s(b, w);
      for (var O, T; O = m(b); )
        T = g(b, w, O), _(b, w, O, T);
    }
    function s(w, b) {
      var O = i(w, w.nodes());
      O = O.slice(0, O.length - 1), O.forEach((T) => l(w, b, T));
    }
    function l(w, b, O) {
      var T = w.node(O), S = T.parent;
      w.edge(O, S).cutvalue = p(w, b, O);
    }
    function p(w, b, O) {
      var T = w.node(O), S = T.parent, R = !0, y = b.edge(O, S), E = 0;
      return y || (R = !1, y = b.edge(S, O)), E = y.weight, b.nodeEdges(O).forEach((N) => {
        var I = N.v === O, A = I ? N.w : N.v;
        if (A !== S) {
          var $ = I === R, V = b.edge(N).weight;
          if (E += $ ? V : -V, v(w, O, A)) {
            var U = w.edge(O, A).cutvalue;
            E += $ ? -U : U;
          }
        }
      }), E;
    }
    function r(w, b) {
      arguments.length < 2 && (b = w.nodes()[0]), a(w, {}, 1, b);
    }
    function a(w, b, O, T, S) {
      var R = O, y = w.node(T);
      return b[T] = !0, w.neighbors(T).forEach((E) => {
        Object.hasOwn(b, E) || (O = a(w, b, O, E, T));
      }), y.low = R, y.lim = O++, S ? y.parent = S : delete y.parent, O;
    }
    function m(w) {
      return w.edges().find((b) => w.edge(b).cutvalue < 0);
    }
    function g(w, b, O) {
      var T = O.v, S = O.w;
      b.hasEdge(T, S) || (T = O.w, S = O.v);
      var R = w.node(T), y = w.node(S), E = R, N = !1;
      R.lim > y.lim && (E = y, N = !0);
      var I = b.edges().filter((A) => N === k(w, w.node(A.v), E) && N !== k(w, w.node(A.w), E));
      return I.reduce((A, $) => c(b, $) < c(b, A) ? $ : A);
    }
    function _(w, b, O, T) {
      var S = O.v, R = O.w;
      w.removeEdge(S, R), w.setEdge(T.v, T.w, {}), r(w), s(w, b), C(w, b);
    }
    function C(w, b) {
      var O = w.nodes().find((S) => !b.node(S).parent), T = u(w, O);
      T = T.slice(1), T.forEach((S) => {
        var R = w.node(S).parent, y = b.edge(S, R), E = !1;
        y || (y = b.edge(R, S), E = !0), b.node(S).rank = b.node(R).rank + (E ? y.minlen : -y.minlen);
      });
    }
    function v(w, b, O) {
      return w.hasEdge(b, O);
    }
    function k(w, b, O) {
      return O.low <= b.lim && b.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, o, d) {
    const { applyWithChunking: f } = e("../util");
    o.exports = { longestPath: c, slack: h };
    function c(u) {
      var i = {};
      function n(t) {
        var s = u.node(t);
        if (Object.hasOwn(i, t))
          return s.rank;
        i[t] = !0;
        let l = u.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - u.edge(r).minlen);
        var p = f(Math.min, l);
        return p === Number.POSITIVE_INFINITY && (p = 0), s.rank = p;
      }
      u.sources().forEach(n);
    }
    function h(u, i) {
      return u.node(i.w).rank - u.node(i.v).rank - u.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph;
    o.exports = { addBorderNode: r, addDummyNode: c, applyWithChunking: g, asNonCompoundGraph: u, buildLayerMatrix: s, intersectRect: t, mapValues: S, maxRank: _, normalizeRanks: l, notime: k, partition: C, pick: T, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: h, successorWeights: i, time: v, uniqueId: b, zipObject: R };
    function c(y, E, N, I) {
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
    function u(y) {
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
      let N = y.x, I = y.y, A = E.x - N, $ = E.y - I, V = y.width / 2, U = y.height / 2;
      if (!A && !$)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let Q, te;
      return Math.abs($) * V > Math.abs(A) * U ? ($ < 0 && (U = -U), Q = U * A / $, te = U) : (A < 0 && (V = -V), Q = V, te = V * $ / A), { x: N + Q, y: I + te };
    }
    function s(y) {
      let E = O(_(y) + 1).map(() => []);
      return y.nodes().forEach((N) => {
        let I = y.node(N), A = I.rank;
        A !== void 0 && (E[A][I.order] = N);
      }), E;
    }
    function l(y) {
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
      let E = y.nodes().map((V) => y.node(V).rank), N = g(Math.min, E), I = [];
      y.nodes().forEach((V) => {
        let U = y.node(V).rank - N;
        I[U] || (I[U] = []), I[U].push(V);
      });
      let A = 0, $ = y.graph().nodeRankFactor;
      Array.from(I).forEach((V, U) => {
        V === void 0 && U % $ !== 0 ? --A : V !== void 0 && A && V.forEach((Q) => y.node(Q).rank += A);
      });
    }
    function r(y, E, N, I) {
      let A = { width: 0, height: 0 };
      return arguments.length >= 4 && (A.rank = N, A.order = I), c(y, "border", A, E);
    }
    function a(y, E = m) {
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
        const N = a(E);
        return y.apply(null, N.map((I) => y.apply(null, I)));
      } else
        return y.apply(null, E);
    }
    function _(y) {
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
      let I = ($) => $ < E;
      N < 0 && (I = ($) => E < $);
      const A = [];
      for (let $ = y; I($); $ += N)
        A.push($);
      return A;
    }
    function T(y, E) {
      const N = {};
      for (const I of E)
        y[I] !== void 0 && (N[I] = y[I]);
      return N;
    }
    function S(y, E) {
      let N = E;
      return typeof E == "string" && (N = (I) => I[E]), Object.entries(y).reduce((I, [A, $]) => (I[A] = N($, A), I), {});
    }
    function R(y, E) {
      return y.reduce((N, I, A) => (N[I] = E[A], N), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, o, d) {
    o.exports = "1.1.8";
  }, {}], 29: [function(e, o, d) {
    var f = e("./lib");
    o.exports = { Graph: f.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: f.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, o, d) {
    o.exports = f;
    function f(c) {
      var h = {}, u = [], i;
      function n(t) {
        Object.hasOwn(h, t) || (h[t] = !0, i.push(t), c.successors(t).forEach(n), c.predecessors(t).forEach(n));
      }
      return c.nodes().forEach(function(t) {
        i = [], n(t), i.length && u.push(i);
      }), u;
    }
  }, {}], 31: [function(e, o, d) {
    o.exports = f;
    function f(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var s = i.isDirected() ? (a) => i.successors(a) : (a) => i.neighbors(a), l = t === "post" ? c : h, p = [], r = {};
      return n.forEach((a) => {
        if (!i.hasNode(a))
          throw new Error("Graph does not have node: " + a);
        l(a, s, r, p);
      }), p;
    }
    function c(i, n, t, s) {
      for (var l = [[i, !1]]; l.length > 0; ) {
        var p = l.pop();
        p[1] ? s.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, l.push([p[0], !0]), u(n(p[0]), (r) => l.push([r, !1])));
      }
    }
    function h(i, n, t, s) {
      for (var l = [i]; l.length > 0; ) {
        var p = l.pop();
        Object.hasOwn(t, p) || (t[p] = !0, s.push(p), u(n(p), (r) => l.push(r)));
      }
    }
    function u(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, o, d) {
    var f = e("./dijkstra");
    o.exports = c;
    function c(h, u, i) {
      return h.nodes().reduce(function(n, t) {
        return n[t] = f(h, t, u, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, o, d) {
    var f = e("../data/priority-queue");
    o.exports = h;
    var c = () => 1;
    function h(i, n, t, s) {
      return u(i, String(n), t || c, s || function(l) {
        return i.outEdges(l);
      });
    }
    function u(i, n, t, s) {
      var l = {}, p = new f(), r, a, m = function(g) {
        var _ = g.v !== r ? g.v : g.w, C = l[_], v = t(g), k = a.distance + v;
        if (v < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + v);
        k < C.distance && (C.distance = k, C.predecessor = r, p.decrease(_, k));
      };
      for (i.nodes().forEach(function(g) {
        var _ = g === n ? 0 : Number.POSITIVE_INFINITY;
        l[g] = { distance: _ }, p.add(g, _);
      }); p.size() > 0 && (r = p.removeMin(), a = l[r], a.distance !== Number.POSITIVE_INFINITY); )
        s(r).forEach(m);
      return l;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, o, d) {
    var f = e("./tarjan");
    o.exports = c;
    function c(h) {
      return f(h).filter(function(u) {
        return u.length > 1 || u.length === 1 && h.hasEdge(u[0], u[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, o, d) {
    o.exports = c;
    var f = () => 1;
    function c(u, i, n) {
      return h(u, i || f, n || function(t) {
        return u.outEdges(t);
      });
    }
    function h(u, i, n) {
      var t = {}, s = u.nodes();
      return s.forEach(function(l) {
        t[l] = {}, t[l][l] = { distance: 0 }, s.forEach(function(p) {
          l !== p && (t[l][p] = { distance: Number.POSITIVE_INFINITY });
        }), n(l).forEach(function(p) {
          var r = p.v === l ? p.w : p.v, a = i(p);
          t[l][r] = { distance: a, predecessor: l };
        });
      }), s.forEach(function(l) {
        var p = t[l];
        s.forEach(function(r) {
          var a = t[r];
          s.forEach(function(m) {
            var g = a[l], _ = p[m], C = a[m], v = g.distance + _.distance;
            v < C.distance && (C.distance = v, C.predecessor = _.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, o, d) {
    o.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, o, d) {
    var f = e("./topsort");
    o.exports = c;
    function c(h) {
      try {
        f(h);
      } catch (u) {
        if (u instanceof f.CycleException)
          return !1;
        throw u;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, o, d) {
    var f = e("./dfs");
    o.exports = c;
    function c(h, u) {
      return f(h, u, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, o, d) {
    var f = e("./dfs");
    o.exports = c;
    function c(h, u) {
      return f(h, u, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, o, d) {
    var f = e("../graph"), c = e("../data/priority-queue");
    o.exports = h;
    function h(u, i) {
      var n = new f(), t = {}, s = new c(), l;
      function p(a) {
        var m = a.v === l ? a.w : a.v, g = s.priority(m);
        if (g !== void 0) {
          var _ = i(a);
          _ < g && (t[m] = l, s.decrease(m, _));
        }
      }
      if (u.nodeCount() === 0)
        return n;
      u.nodes().forEach(function(a) {
        s.add(a, Number.POSITIVE_INFINITY), n.setNode(a);
      }), s.decrease(u.nodes()[0], 0);
      for (var r = !1; s.size() > 0; ) {
        if (l = s.removeMin(), Object.hasOwn(t, l))
          n.setEdge(l, t[l]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + u);
          r = !0;
        }
        u.nodeEdges(l).forEach(p);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, o, d) {
    o.exports = f;
    function f(c) {
      var h = 0, u = [], i = {}, n = [];
      function t(s) {
        var l = i[s] = { onStack: !0, lowlink: h, index: h++ };
        if (u.push(s), c.successors(s).forEach(function(a) {
          Object.hasOwn(i, a) ? i[a].onStack && (l.lowlink = Math.min(l.lowlink, i[a].index)) : (t(a), l.lowlink = Math.min(l.lowlink, i[a].lowlink));
        }), l.lowlink === l.index) {
          var p = [], r;
          do
            r = u.pop(), i[r].onStack = !1, p.push(r);
          while (s !== r);
          n.push(p);
        }
      }
      return c.nodes().forEach(function(s) {
        Object.hasOwn(i, s) || t(s);
      }), n;
    }
  }, {}], 42: [function(e, o, d) {
    function f(h) {
      var u = {}, i = {}, n = [];
      function t(s) {
        if (Object.hasOwn(i, s))
          throw new c();
        Object.hasOwn(u, s) || (i[s] = !0, u[s] = !0, h.predecessors(s).forEach(t), delete i[s], n.push(s));
      }
      if (h.sinks().forEach(t), Object.keys(u).length !== h.nodeCount())
        throw new c();
      return n;
    }
    class c extends Error {
      constructor() {
        super(...arguments);
      }
    }
    o.exports = f, f.CycleException = c;
  }, {}], 43: [function(e, o, d) {
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
        var u = this._keyIndices[h];
        if (u !== void 0)
          return this._arr[u].priority;
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
      add(h, u) {
        var i = this._keyIndices;
        if (h = String(h), !Object.hasOwn(i, h)) {
          var n = this._arr, t = n.length;
          return i[h] = t, n.push({ key: h, priority: u }), this._decrease(t), !0;
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
      decrease(h, u) {
        var i = this._keyIndices[h];
        if (u > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + h + " Old: " + this._arr[i].priority + " New: " + u);
        this._arr[i].priority = u, this._decrease(i);
      }
      _heapify(h) {
        var u = this._arr, i = 2 * h, n = i + 1, t = h;
        i < u.length && (t = u[i].priority < u[t].priority ? i : t, n < u.length && (t = u[n].priority < u[t].priority ? n : t), t !== h && (this._swap(h, t), this._heapify(t)));
      }
      _decrease(h) {
        for (var u = this._arr, i = u[h].priority, n; h !== 0 && (n = h >> 1, !(u[n].priority < i)); )
          this._swap(h, n), h = n;
      }
      _swap(h, u) {
        var i = this._arr, n = this._keyIndices, t = i[h], s = i[u];
        i[h] = s, i[u] = t, n[s.key] = h, n[t.key] = u;
      }
    }
    o.exports = f;
  }, {}], 44: [function(e, o, d) {
    var f = "\0", c = "\0", h = "";
    class u {
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
        r && (this._isDirected = Object.hasOwn(r, "directed") ? r.directed : !0, this._isMultigraph = Object.hasOwn(r, "multigraph") ? r.multigraph : !1, this._isCompound = Object.hasOwn(r, "compound") ? r.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[c] = {});
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
        return this.nodes().filter((a) => Object.keys(r._in[a]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var r = this;
        return this.nodes().filter((a) => Object.keys(r._out[a]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(r, a) {
        var m = arguments, g = this;
        return r.forEach(function(_) {
          m.length > 1 ? g.setNode(_, a) : g.setNode(_);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, a) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = a), this) : (this._nodes[r] = arguments.length > 1 ? a : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = c, this._children[r] = {}, this._children[c][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
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
        var a = this;
        if (Object.hasOwn(this._nodes, r)) {
          var m = (g) => a.removeEdge(a._edgeObjs[g]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(g) {
            a.setParent(g);
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
      setParent(r, a) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (a === void 0)
          a = c;
        else {
          a += "";
          for (var m = a; m !== void 0; m = this.parent(m))
            if (m === r)
              throw new Error("Setting " + a + " as parent of " + r + " would create a cycle");
          this.setNode(a);
        }
        return this.setNode(r), this._removeFromParentsChildList(r), this._parent[r] = a, this._children[a][r] = !0, this;
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
          var a = this._parent[r];
          if (a !== c)
            return a;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = c) {
        if (this._isCompound) {
          var a = this._children[r];
          if (a)
            return Object.keys(a);
        } else {
          if (r === c)
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
        var a = this._preds[r];
        if (a)
          return Object.keys(a);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(r) {
        var a = this._sucs[r];
        if (a)
          return Object.keys(a);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(r) {
        var a = this.predecessors(r);
        if (a) {
          const g = new Set(a);
          for (var m of this.successors(r))
            g.add(m);
          return Array.from(g.values());
        }
      }
      isLeaf(r) {
        var a;
        return this.isDirected() ? a = this.successors(r) : a = this.neighbors(r), a.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(r) {
        var a = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        a.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([C, v]) {
          r(C) && a.setNode(C, v);
        }), Object.values(this._edgeObjs).forEach(function(C) {
          a.hasNode(C.v) && a.hasNode(C.w) && a.setEdge(C, m.edge(C));
        });
        var g = {};
        function _(C) {
          var v = m.parent(C);
          return v === void 0 || a.hasNode(v) ? (g[C] = v, v) : v in g ? g[v] : _(v);
        }
        return this._isCompound && a.nodes().forEach((C) => a.setParent(C, _(C))), a;
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
      setPath(r, a) {
        var m = this, g = arguments;
        return r.reduce(function(_, C) {
          return g.length > 1 ? m.setEdge(_, C, a) : m.setEdge(_, C), C;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, a, m, g, _ = !1, C = arguments[0];
        typeof C == "object" && C !== null && "v" in C ? (r = C.v, a = C.w, m = C.name, arguments.length === 2 && (g = arguments[1], _ = !0)) : (r = C, a = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], _ = !0)), r = "" + r, a = "" + a, m !== void 0 && (m = "" + m);
        var v = t(this._isDirected, r, a, m);
        if (Object.hasOwn(this._edgeLabels, v))
          return _ && (this._edgeLabels[v] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(a), this._edgeLabels[v] = _ ? g : this._defaultEdgeLabelFn(r, a, m);
        var k = s(this._isDirected, r, a, m);
        return r = k.v, a = k.w, Object.freeze(k), this._edgeObjs[v] = k, i(this._preds[a], r), i(this._sucs[r], a), this._in[a][v] = k, this._out[r][v] = k, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, a, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m);
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
      hasEdge(r, a, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m);
        return Object.hasOwn(this._edgeLabels, g);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, a, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m), _ = this._edgeObjs[g];
        return _ && (r = _.v, a = _.w, delete this._edgeLabels[g], delete this._edgeObjs[g], n(this._preds[a], r), n(this._sucs[r], a), delete this._in[a][g], delete this._out[r][g], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, a) {
        var m = this._in[r];
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
      outEdges(r, a) {
        var m = this._out[r];
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
      nodeEdges(r, a) {
        var m = this.inEdges(r, a);
        if (m)
          return m.concat(this.outEdges(r, a));
      }
    }
    function i(p, r) {
      p[r] ? p[r]++ : p[r] = 1;
    }
    function n(p, r) {
      --p[r] || delete p[r];
    }
    function t(p, r, a, m) {
      var g = "" + r, _ = "" + a;
      if (!p && g > _) {
        var C = g;
        g = _, _ = C;
      }
      return g + h + _ + h + (m === void 0 ? f : m);
    }
    function s(p, r, a, m) {
      var g = "" + r, _ = "" + a;
      if (!p && g > _) {
        var C = g;
        g = _, _ = C;
      }
      var v = { v: g, w: _ };
      return m && (v.name = m), v;
    }
    function l(p, r) {
      return t(p, r.v, r.w, r.name);
    }
    o.exports = u;
  }, {}], 45: [function(e, o, d) {
    o.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, o, d) {
    var f = e("./graph");
    o.exports = { write: c, read: i };
    function c(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: h(n), edges: u(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function h(n) {
      return n.nodes().map(function(t) {
        var s = n.node(t), l = n.parent(t), p = { v: t };
        return s !== void 0 && (p.value = s), l !== void 0 && (p.parent = l), p;
      });
    }
    function u(n) {
      return n.edges().map(function(t) {
        var s = n.edge(t), l = { v: t.v, w: t.w };
        return t.name !== void 0 && (l.name = t.name), s !== void 0 && (l.value = s), l;
      });
    }
    function i(n) {
      var t = new f(n.options).setGraph(n.value);
      return n.nodes.forEach(function(s) {
        t.setNode(s.v, s.value), s.parent && t.setParent(s.v, s.parent);
      }), n.edges.forEach(function(s) {
        t.setEdge({ v: s.v, w: s.w, name: s.name }, s.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, o, d) {
    o.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), mn = ["unstarted", "started", "completed", "canceled"];
function bn(e, o) {
  let d = 1;
  const f = () => `${e.slice(0, 40 - String(d).length - 1)}_${d}`;
  for (; o.some((c) => c.id === f()); ) d++;
  return f();
}
function gn(e, o) {
  return [
    ...e.initial === o.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((d) => d.to === o.id || d.from !== "any" && d.from.includes(o.id)).map((d) => `transition ${Bt(d)}`),
    ...e.states.filter((d) => d.regions?.some((f) => f.initial === o.id)).map((d) => `lanes in ${We(d)}`),
    ...Object.entries(e.map ?? {}).filter(([, d]) => d === o.id).map(() => "existing item migration")
  ];
}
function yn(e, o) {
  return e.states.flatMap((d) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => d.run?.[f] === o.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${We(d)}`),
    ...(d.timers ?? []).filter((f) => f.then?.transition === o.id).map(() => "a timer")
  ]);
}
const We = (e) => e?.name || "Untitled state", Bt = (e) => e.name?.trim() || ye(e.id), wn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", vn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function kn(e, o) {
  if (e.id === o.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const d = e.release_when?.approvals?.min;
    return d ? `Needs ${d} approval${d === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? ze(e) : "A person moves it";
}
function ze(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function En(e, o) {
  const d = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${d === 1 ? "one person approves" : `${d} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${ze(e)}.` : "A person chooses when to move the item on.", c = o.policy?.wip?.[e.id]?.limit;
  return f + (c !== void 0 ? ` At most ${c} at a time.` : "");
}
function xn(e) {
  const o = e.transitions ?? [], d = [], f = /* @__PURE__ */ new Set();
  let c = e.states.find((u) => u.id === e.initial);
  const h = new Map(e.states.map((u, i) => [u.id, i]));
  for (; c && !f.has(c.id) && (d.push(c), f.add(c.id), !(c.category === "completed" || c.category === "canceled")); ) {
    const u = c, i = o.filter((t) => t.from !== "any" && t.from.includes(u.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (h.get(t.to) ?? -1) > (h.get(u.id) ?? 0));
    c = e.states.find((t) => t.id === n?.to);
  }
  return d;
}
function Ye(e) {
  const o = e.states.find((d) => d.id === e.initial);
  return e.migration ?? (o?.kind === "automated" || o?.kind === "parallel" ? "pin" : "follow");
}
const ae = (e) => JSON.parse(JSON.stringify(e));
function _n(e) {
  return e?.admin === !0;
}
function On(e, o, d) {
  const f = o + d;
  if (o < 0 || o >= e.length || f < 0 || f >= e.length) return;
  const [c] = e.splice(o, 1);
  e.splice(f, 0, c);
}
function Nn(e, o, d) {
  const f = o.code;
  if (f === d) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  o.code = d;
  const c = (n) => n === f ? d : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(c), n.inherit && (n.inherit = n.inherit.map(c));
  const h = (n) => {
    for (const t of n ?? []) "field" in t && t.field === f && (t.field = d);
  }, u = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = c(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      u(n);
      for (const [t, s] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(s);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = c(n.field)), i(n.where), h(n.access?.read), h(n.access?.write);
  if (e.visibility) {
    e.visibility.field = c(e.visibility.field);
    for (const n of e.visibility.levels) h(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      u(t.awaiting), u(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(c));
      for (const s of t.timers ?? [])
        s.at_field && (s.at_field = c(s.at_field)), s.by && (s.by = c(s.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(c));
      for (const s of t.set ?? [])
        s.field = c(s.field), s.copy && (s.copy = c(s.copy));
    }
  }
}
function $e({ migration: e, map: o, ...d }) {
  return JSON.stringify(d);
}
function jn(e, o) {
  const d = ae(e);
  for (const c of d.processes ?? []) {
    const h = o.processes?.find((u) => u.id === c.id);
    if (h && $e(c) !== $e(h) && (c.migration = "follow"), c.map) {
      for (const [u, i] of Object.entries(c.map))
        (c.states.some((n) => n.id === u) || !c.states.some((n) => n.id === i)) && delete c.map[u];
      Object.keys(c.map).length || delete c.map;
    }
  }
  d.plugins && (d.plugins = d.plugins.map(({ use: c }) => ({ use: c })));
  for (const c of d.fields ?? [])
    c.type?.includes(":") && delete c.form;
  const f = { ...d.remove };
  o.visibility && !d.visibility ? f.visibility = !0 : delete f.visibility;
  for (const c of ["fields", "item_types", "processes", "relation_types"]) {
    const h = (o[c] ?? []).filter((u) => {
      if (c === "fields") {
        const i = u;
        return !d.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(d[c] ?? []).some((i) => "id" in i && i.id === ("id" in u ? u.id : void 0));
    }).map((u) => "code" in u ? u.code : u.id);
    h.length ? f[c] = [.../* @__PURE__ */ new Set([...f[c] ?? [], ...h])] : delete f[c];
  }
  return Object.keys(f).length ? d.remove = f : delete d.remove, d;
}
function In(e, o, d) {
  const f = JSON.stringify({ declaration: e, configs: d });
  return {
    declaration: ae(e),
    expected_generation: o,
    plugin_configs: ae(d),
    matches: (c, h, u) => o === h && f === JSON.stringify({ declaration: c, configs: u })
  };
}
function Cn(e) {
  const o = ae(e), d = [...new Set(o.declaration.item_types?.flatMap((c) => c.fields) ?? [])], f = (c) => {
    const h = d.indexOf(c);
    return h < 0 ? d.length : h;
  };
  o.declaration.fields?.sort((c, h) => f(c.code) - f(h.code));
  for (const c of o.declaration.fields ?? []) {
    const h = o.compiled.fields?.find((u) => u.code === c.code);
    c.id ??= h?.id, c.form ??= h?.form;
  }
  for (const c of o.declaration.processes ?? []) c.migration ??= o.compiled.processes?.find((h) => h.id === c.id)?.migration ?? Ye(c);
  return o;
}
function Ln(e, o) {
  return (o.processes ?? []).filter((d) => Ye(d) !== "pin" && e.changes.some((f) => f.code === "process " + d.id && f.class !== "cosmetic" && f.class !== "refused")).map((d) => d.id);
}
function An(e, o, d) {
  const f = [d, `item_type ${d}`, `relation ${d}`, `process ${d}`], c = e.refused.filter((h) => f.includes(h.code));
  return o === "fields" && c.push(...e.changes.filter((h) => h.code === d && h.what === "removed" && h.class === "semantic")), c.length ? c.map(Wt).join(" ") : void 0;
}
function Tn(e, o, d) {
  if (o === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== d);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((c) => c !== d), f.inherit = f.inherit?.filter((c) => c !== d);
  } else o === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== d) : o === "processes" ? e.processes = e.processes?.filter((f) => f.id !== d) : e.relation_types = e.relation_types?.filter((f) => f.id !== d);
}
function Wt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function Sn(e, o) {
  if (!(e instanceof ie)) return [];
  const d = e.details ?? {};
  let f = typeof d.field == "string" ? d.field : "";
  if (!f) {
    const c = o.processes?.find((h) => h.id === d.process || h.states.some((u) => u.id === d.state) || e.message.includes(`process ${h.id}`));
    c ? f = `process ${c.id}` : typeof d.item_type == "string" && (f = `item_type ${d.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: De(e, "The definition is invalid.") }] : [];
}
const Mn = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, Rn = (e) => !("problem" in e);
function $n(e, o) {
  return { pack: e.id, version: e.version, expected_generation: o };
}
async function Vn(e, o) {
  const d = { ...ae(e), resolutions: ae(e.resolutions ?? {}) };
  let f = await o(d);
  return d.maps || (d.maps = ae(f.maps), f = await o(d)), { request: d, plan: f };
}
function Pn() {
  let e = 0;
  return () => {
    const o = ++e;
    return () => o === e;
  };
}
export {
  On as A,
  kt as B,
  Wt as C,
  Tn as D,
  Nn as E,
  vn as F,
  ie as G,
  Ge as H,
  bn as I,
  En as J,
  yn as K,
  gn as L,
  ae as M,
  Ct as N,
  ge as O,
  Mn as P,
  jn as Q,
  Ln as R,
  $n as S,
  Vn as T,
  Cn as U,
  In as V,
  Sn as W,
  An as X,
  hn as _,
  Rn as a,
  Lt as b,
  Be as c,
  fn as d,
  _n as e,
  De as f,
  on as g,
  ln as h,
  pn as i,
  kn as j,
  Ue as k,
  Pn as l,
  xn as m,
  fe as n,
  dn as o,
  oe as p,
  jt as q,
  un as r,
  We as s,
  Bt as t,
  cn as u,
  ye as v,
  Ut as w,
  Et as x,
  mn as y,
  wn as z
};
//# sourceMappingURL=latestRequest-icOSmQHK.js.map
