import { defineComponent as oe, useId as Me, openBlock as U, createElementBlock as W, unref as G, normalizeClass as Je, createElementVNode as q, createTextVNode as xe, toDisplayString as K, createCommentVNode as ae, renderSlot as de, Fragment as ke, createVNode as X, withCtx as ne, useModel as He, createBlock as ee, mergeModels as qe, ref as Q, watch as ue, onBeforeUnmount as _e, onUnmounted as Ke, computed as te, renderList as Ie, withKeys as Xe, withModifiers as Qe, onMounted as Ze, nextTick as et } from "vue";
import { Icon as Ce } from "@iconify/vue";
import Ee from "primevue/button";
import Le from "primevue/inputtext";
import tt from "primevue/inputnumber";
import nt from "primevue/toggleswitch";
import rt from "primevue/select";
import it from "primevue/chip";
import st from "primevue/accordion";
import at from "primevue/accordioncontent";
import ot from "primevue/accordionheader";
import lt from "primevue/accordionpanel";
import dt from "primevue/textarea";
import { e as ut } from "./mount-DH3Id7d9.js";
import { api as Se } from "@wippy-fe/proxy";
const ct = ["aria-labelledby"], ft = { class: "kx-railhead" }, ht = ["id"], pt = { key: 0 }, mt = { class: "kx-railhead-acts" }, bt = { class: "kx-rail-body" }, en = /* @__PURE__ */ oe({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const o = Me();
    return (d, f) => (U(), W("aside", {
      class: Je(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": G(o)
    }, [
      q("div", ft, [
        q("span", {
          id: G(o),
          class: "kx-railhead-title"
        }, [
          xe(K(e.title), 1),
          e.count !== void 0 ? (U(), W("b", pt, K(e.count), 1)) : ae("", !0)
        ], 8, ht),
        q("div", mt, [
          de(d.$slots, "actions")
        ])
      ]),
      de(d.$slots, "toolbar"),
      q("div", bt, [
        de(d.$slots, "default")
      ])
    ], 10, ct));
  }
}), tn = /* @__PURE__ */ oe({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(e) {
    return (o, d) => (U(), W(ke, null, [
      X(G(Ee), {
        type: "button",
        text: "",
        "aria-label": e.createLabel,
        title: e.createLabel,
        onClick: d[0] || (d[0] = (f) => o.$emit("create"))
      }, {
        icon: ne(() => [
          X(G(Ce), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      X(G(Ee), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: d[1] || (d[1] = (f) => o.$emit("defaults"))
      }, {
        icon: ne(() => [
          X(G(Ce), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
});
class re extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(o, d, f) {
    super(o.message ?? o.error ?? `${d} failed`), this.name = "ApiError", this.kind = o.kind, this.details = o.details, this.retryable = o.retryable, this.status = f;
  }
}
const Te = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Re(e, o) {
  const d = e instanceof re ? e.details?.code : void 0, f = e instanceof Error && e.message || o;
  return typeof d != "string" || !d.trim() ? f : `${Object.hasOwn(Te, d) ? Te[d] : f}
Error code: ${d}`;
}
function Ve(e, o) {
  const d = e;
  if (d && typeof d == "object" && d.success === !1) throw new re(d, o);
  if (d && typeof d == "object" && d.success === !0 && d.data !== void 0) return d.data;
  throw new re({ kind: "INTERNAL", message: `${o}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, o);
}
function $e(e, o) {
  if (e instanceof re) return e;
  const d = e?.response;
  return d?.data ? new re(d.data, o, d.status) : e instanceof Error ? e : new re({ kind: "Unavailable" }, o);
}
async function we(e, o, d) {
  try {
    return Ve((await Se.get(e, { params: d })).data, o);
  } catch (f) {
    throw $e(f, o);
  }
}
async function se(e, o, d) {
  try {
    return Ve((await Se.post(e, o)).data, d);
  } catch (f) {
    throw $e(f, d);
  }
}
function ce(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const me = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), gt = /* @__PURE__ */ oe({
  __name: "Disclosure",
  props: /* @__PURE__ */ qe({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const o = He(e, "open");
    return (d, f) => (U(), ee(G(st), {
      class: "kx-disclosure",
      value: o.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = (c) => o.value = c === "content")
    }, {
      default: ne(() => [
        X(G(lt), { value: "content" }, {
          default: ne(() => [
            X(G(ot), { class: "kx-disclosure-toggle" }, {
              default: ne(() => [
                xe(K(e.label), 1)
              ]),
              _: 1
            }),
            X(G(at), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: ne(() => [
                de(d.$slots, "default")
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
}), yt = { class: "work-stack work-tight" }, wt = {
  key: 0,
  class: "work-small work-muted"
}, vt = {
  key: 1,
  role: "alert",
  class: "work-error"
}, kt = { class: "work-json-example" }, Et = /* @__PURE__ */ oe({
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
    const d = e, f = o, c = Q(""), h = Q("");
    ue(() => d.modelValue, (i) => {
      c.value = i === void 0 ? "" : JSON.stringify(i, null, 2), h.value = "", f("validity", !0);
    }, { immediate: !0 }), _e(() => f("validity", !0));
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
    return (i, n) => (U(), ee(gt, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: ne(() => [
        q("label", yt, [
          q("span", null, K(e.label), 1),
          e.hint ? (U(), W("span", wt, K(e.hint), 1)) : ae("", !0),
          X(G(dt), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: c.value,
            "aria-invalid": !!h.value,
            onInput: n[0] || (n[0] = (t) => u(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          h.value ? (U(), W("span", vt, K(h.value), 1)) : ae("", !0)
        ]),
        n[1] || (n[1] = q("p", { class: "work-small work-muted" }, "Example", -1)),
        q("pre", kt, K(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), ve = /* @__PURE__ */ new Map();
function pe(e, o = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => pe(f, o)).join(", ");
  if (typeof e == "string") return o.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const d = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof d[f] == "string" && d[f] && !me(d[f])) return d[f];
  return o.get(`${d.kind ?? "user"}:${d.id}`) ?? (typeof d.email == "string" && d.email ? d.email : d.kind === "group" ? "Unavailable group" : typeof d.id == "string" ? pe(d.id, o) : "Unavailable person");
}
async function xt(e, o) {
  const d = [...new Map(o.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, d]), c = ve.get(f);
  if (c) return c;
  const u = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < d.length; n += 200) {
      const t = await se(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: d.slice(n, n + 200) }, "Display names");
      for (const l of t.principals) l.label.trim() && !me(l.label) && l.label !== l.id && i.set(`${l.type}:${l.id}`, l.label.trim());
    }
    return i;
  })();
  ve.set(f, u);
  try {
    return await u;
  } finally {
    ve.delete(f);
  }
}
function _t(e, o) {
  const d = Q(/* @__PURE__ */ new Map()), f = Q("");
  let c = 0;
  return ue([e, o], async ([h, u]) => {
    const i = ++c;
    if (d.value = /* @__PURE__ */ new Map(), f.value = "", !(!h || !u.length))
      try {
        const n = await xt(h, u);
        i === c && (d.value = n);
      } catch (n) {
        i === c && (f.value = Re(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), Ke(() => {
    c++, d.value.clear();
  }), {
    labels: d,
    error: f,
    label: (h) => pe(h, d.value),
    remember: (h, u) => {
      u.trim() && !me(u) && u !== h.id && d.value.set(`${h.kind}:${h.id}`, u.trim());
    }
  };
}
function be(e) {
  if (me(e)) return "Untitled";
  const o = e.replace(/[_-]+/g, " ");
  return o.charAt(0).toUpperCase() + o.slice(1);
}
function nn(e) {
  return e.title?.trim() || be(e.code);
}
function Pe(e, o, d = pe) {
  return e == null ? "—" : o?.type === "principal" ? d(e) : Array.isArray(e) ? e.map((f) => Pe(f, o, d)).join(", ") : o?.type === "option" && typeof e == "string" ? o.options?.find((f) => f.id === e)?.label || be(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (o?.form === "ref" || o?.type === "item") && "unavailable" in e ? "Unavailable" : o?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : o?.form === "ref" && "ref" in e && Array.isArray(e.ref) || o?.form === "ref" && "id" in e && typeof e.id == "string" || o?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function rn(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function sn(e, o) {
  const d = _t(e, o);
  return {
    display: (f, c) => Pe(f, c, d.label),
    principalLabel: d.label,
    rememberPrincipal: d.remember,
    nameError: d.error,
    nameLabels: d.labels
  };
}
function De(e) {
  return Object.entries(ce(e.properties)).map(([o, d]) => {
    const f = ce(d);
    return { key: o, title: typeof f.title == "string" && f.title.trim() ? f.title : be(o), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const Fe = (e) => e.type === "array" && ce(e.items).type === "string";
function Ot(e, o) {
  const d = {};
  for (const f of De(e)) {
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
      else if (Fe(h)) {
        const i = ce(h.items);
        c.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (u = "Each entry must match the declared text length.");
      }
    } else h.type === "object" && (typeof c != "object" || Array.isArray(c)) && (u = "Enter an object.");
    u && (d[f.key] = u);
  }
  return d;
}
const Nt = { class: "work-stack" }, jt = ["inert", "schema", "config"], It = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, Ct = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Lt = { class: "work-config-fields" }, Tt = ["for"], At = {
  key: 1,
  class: "work-config-chips"
}, Mt = {
  key: 6,
  class: "work-muted work-small"
}, St = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, an = /* @__PURE__ */ oe({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: o }) {
    const d = e, f = o, c = Q({}), h = Q(/* @__PURE__ */ new Set()), u = Q(!1), i = Q(!1), n = Me(), t = te(() => De(d.schema)), l = te(() => Ot(d.schema, d.modelValue)), a = te(() => t.value.filter((v) => typeof v.schema.picker == "string")), p = te(() => t.value.filter((v) => typeof v.schema.picker != "string")), r = te(() => ({ ...d.schema, properties: Object.fromEntries(a.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(d.schema.required) ? d.schema.required.filter((v) => a.value.some((O) => O.key === v)) : [] })), s = te(() => Object.fromEntries(a.value.map((v) => [v.key, d.modelValue[v.key]]))), m = te(() => !Object.keys(l.value).length && !h.value.size && (!a.value.length || u.value));
    ue(m, (v) => f("validity", v), { immediate: !0 });
    async function b() {
      i.value = !0, u.value = await ut("wc-schema-form"), i.value = !1;
    }
    ue(() => a.value.length > 0, (v) => {
      v && b();
    }, { immediate: !0 }), _e(() => f("validity", !0));
    function _(v, O) {
      const w = { ...d.modelValue };
      O == null ? delete w[v] : w[v] = O, f("update:modelValue", w);
    }
    function T(v) {
      const O = d.modelValue[v];
      return Array.isArray(O) ? O.filter((w) => typeof w == "string") : [];
    }
    function y(v) {
      const O = c.value[v]?.trim();
      O && (_(v, [...T(v), O]), c.value[v] = "");
    }
    function N(v, O) {
      O ? h.value.delete(v) : h.value.add(v);
    }
    function k(v) {
      f("update:modelValue", { ...d.modelValue, ...ce(v.detail) });
    }
    return (v, O) => (U(), W("div", Nt, [
      a.value.length && u.value ? (U(), W("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(r.value),
        config: JSON.stringify(s.value),
        onConfigChanged: k
      }, null, 40, jt)) : a.value.length && i.value ? (U(), W("p", It, "The configuration widget is loading.")) : a.value.length ? (U(), W("p", Ct, [
        O[0] || (O[0] = xe("The configuration widget is unavailable.", -1)),
        X(G(Ee), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: b
        })
      ])) : ae("", !0),
      q("div", Lt, [
        (U(!0), W(ke, null, Ie(p.value, (w) => (U(), W("div", {
          key: w.key,
          class: "work-config-field"
        }, [
          q("label", {
            class: "work-config-label",
            for: G(n) + "-" + w.key
          }, K(w.title), 9, Tt),
          Array.isArray(w.schema.enum) ? (U(), ee(G(rt), {
            key: 0,
            "input-id": G(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            options: w.schema.enum,
            appendTo: "self",
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : G(Fe)(w.schema) ? (U(), W("div", At, [
            (U(!0), W(ke, null, Ie(T(w.key), (L, R) => (U(), ee(G(it), {
              key: R,
              label: L,
              removable: !e.disabled,
              onRemove: (g) => _(w.key, T(w.key).filter((E, j) => j !== R))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            X(G(Le), {
              id: G(n) + "-" + w.key,
              modelValue: c.value[w.key],
              "onUpdate:modelValue": (L) => c.value[w.key] = L,
              "aria-label": "Add " + w.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: Xe(Qe((L) => y(w.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (L) => y(w.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(w.schema.type)) ? (U(), ee(G(tt), {
            key: 2,
            "input-id": G(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            "max-fraction-digits": w.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": w.title,
            disabled: e.disabled,
            invalid: !!l.value[w.key],
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : w.schema.type === "boolean" ? (U(), ee(G(nt), {
            key: 3,
            "input-id": G(n) + "-" + w.key,
            "model-value": !!(e.modelValue[w.key] ?? w.schema.default),
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(w.schema.type)) ? (U(), ee(Et, {
            key: 4,
            label: w.title,
            "model-value": e.modelValue[w.key],
            shape: w.schema.type === "array" ? "array" : "object",
            example: w.schema.default ?? (w.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (L) => _(w.key, L),
            onValidity: (L) => N(w.key, L)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (U(), ee(G(Le), {
            key: 5,
            id: G(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!l.value[w.key],
            "aria-label": w.title,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          w.description ? (U(), W("p", Mt, K(w.description), 1)) : ae("", !0),
          l.value[w.key] ? (U(), W("p", St, K(l.value[w.key]), 1)) : ae("", !0)
        ]))), 128))
      ])
    ]));
  }
}), Rt = ["aria-label", "aria-busy"], on = /* @__PURE__ */ oe({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const d = e, f = o, c = Q(null);
    let h = null;
    async function u() {
      await et();
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
    return ue(() => d.visible, u), Ze(u), _e(() => {
      c.value?.open && c.value.close(), h?.focus();
    }), (n, t) => (U(), W("dialog", {
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
      de(n.$slots, "default")
    ], 40, Rt));
  }
}), he = "/api/v1/work", fe = (e) => `${he}/boards/${encodeURIComponent(e)}`, Vt = {
  boards: async () => {
    const e = [];
    let o;
    do {
      const d = await we(`${he}/boards${o ? "?after=" + encodeURIComponent(o) : ""}`, "Boards");
      e.push(...d.boards), o = d.next;
    } while (o);
    return e;
  },
  packs: () => we(`${he}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, o, d, f = {}) => se(`${he}/boards`, { title: e, declaration: o, idempotency_key: d, ...f }, "Create board"),
  updateBoard: (e, o) => se(`${fe(e)}/update`, o, "Update board"),
  schema: (e, o, d) => se(`${fe(e)}/get_schema`, { generation: o, ...d ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, o) => se(`${fe(e)}/query`, o, "Item choices"),
  async stateCounts(e) {
    const o = /* @__PURE__ */ Object.create(null);
    let d;
    do {
      const f = await Vt.query(e, { group_by: "type", sub_group_by: "state", group_after: d, limit: 1 });
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
  item: (e, o) => se(`${fe(e)}/get`, { item: o }, "Item choice"),
  async options(e) {
    const o = await we(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
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
const ln = (function() {
  return (/* @__PURE__ */ (function() {
    function e(o, d, f) {
      function c(i, n) {
        if (!d[i]) {
          if (!o[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (h) return h(i, !0);
            var l = new Error("Cannot find module '" + i + "'");
            throw l.code = "MODULE_NOT_FOUND", l;
          }
          var a = d[i] = { exports: {} };
          o[i][0].call(a.exports, function(p) {
            var r = o[i][1][p];
            return c(r || p);
          }, a, a.exports, e, o, d, f);
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
      (n.graph().acyclicer === "greedy" ? f(n, l(n)) : u(n)).forEach((a) => {
        let p = n.edge(a);
        n.removeEdge(a), p.forwardName = a.name, p.reversed = !0, n.setEdge(a.w, a.v, p, c("rev"));
      });
      function l(a) {
        return (p) => a.edge(p).weight;
      }
    }
    function u(n) {
      let t = [], l = {}, a = {};
      function p(r) {
        Object.hasOwn(a, r) || (a[r] = !0, l[r] = !0, n.outEdges(r).forEach((s) => {
          Object.hasOwn(l, s.w) ? t.push(s) : p(s.w);
        }), delete l[r]);
      }
      return n.nodes().forEach(p), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let l = n.edge(t);
        if (l.reversed) {
          n.removeEdge(t);
          let a = l.forwardName;
          delete l.reversed, delete l.forwardName, n.setEdge(t.w, t.v, l, a);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, o, d) {
    let f = e("./util");
    o.exports = c;
    function c(u) {
      function i(n) {
        let t = u.children(n), l = u.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(l, "minRank")) {
          l.borderLeft = [], l.borderRight = [];
          for (let a = l.minRank, p = l.maxRank + 1; a < p; ++a)
            h(u, "borderLeft", "_bl", n, l, a), h(u, "borderRight", "_br", n, l, a);
        }
      }
      u.children().forEach(i);
    }
    function h(u, i, n, t, l, a) {
      let p = { width: 0, height: 0, rank: a, borderType: i }, r = l[i][a - 1], s = f.addDummyNode(u, "border", p, n);
      l[i][a] = s, u.setParent(s, t), r && u.setEdge(r, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, o, d) {
    o.exports = { adjust: f, undo: c };
    function f(a) {
      let p = a.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && h(a);
    }
    function c(a) {
      let p = a.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(a), (p === "lr" || p === "rl") && (t(a), h(a));
    }
    function h(a) {
      a.nodes().forEach((p) => u(a.node(p))), a.edges().forEach((p) => u(a.edge(p)));
    }
    function u(a) {
      let p = a.width;
      a.width = a.height, a.height = p;
    }
    function i(a) {
      a.nodes().forEach((p) => n(a.node(p))), a.edges().forEach((p) => {
        let r = a.edge(p);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(a) {
      a.y = -a.y;
    }
    function t(a) {
      a.nodes().forEach((p) => l(a.node(p))), a.edges().forEach((p) => {
        let r = a.edge(p);
        r.points.forEach(l), Object.hasOwn(r, "x") && l(r);
      });
    }
    function l(a) {
      let p = a.x;
      a.x = a.y, a.y = p;
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
      }), u.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, l) => {
        let a = "layer" + l;
        n.setNode(a, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("./data/list");
    o.exports = u;
    let h = () => 1;
    function u(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let s = t(p, r || h);
      return i(s.graph, s.buckets, s.zeroIdx).flatMap((b) => p.outEdges(b.v, b.w));
    }
    function i(p, r, s) {
      let m = [], b = r[r.length - 1], _ = r[0], T;
      for (; p.nodeCount(); ) {
        for (; T = _.dequeue(); )
          n(p, r, s, T);
        for (; T = b.dequeue(); )
          n(p, r, s, T);
        if (p.nodeCount()) {
          for (let y = r.length - 2; y > 0; --y)
            if (T = r[y].dequeue(), T) {
              m = m.concat(n(p, r, s, T, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(p, r, s, m, b) {
      let _ = b ? [] : void 0;
      return p.inEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = p.node(T.v);
        b && _.push({ v: T.v, w: T.w }), N.out -= y, l(r, s, N);
      }), p.outEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = T.w, k = p.node(N);
        k.in -= y, l(r, s, k);
      }), p.removeNode(m.v), _;
    }
    function t(p, r) {
      let s = new f(), m = 0, b = 0;
      p.nodes().forEach((y) => {
        s.setNode(y, { v: y, in: 0, out: 0 });
      }), p.edges().forEach((y) => {
        let N = s.edge(y.v, y.w) || 0, k = r(y), v = N + k;
        s.setEdge(y.v, y.w, v), b = Math.max(b, s.node(y.v).out += k), m = Math.max(m, s.node(y.w).in += k);
      });
      let _ = a(b + m + 3).map(() => new c()), T = m + 1;
      return s.nodes().forEach((y) => {
        l(_, T, s.node(y));
      }), { graph: s, buckets: _, zeroIdx: T };
    }
    function l(p, r, s) {
      s.out ? s.in ? p[s.out - s.in + r].enqueue(s) : p[p.length - 1].enqueue(s) : p[0].enqueue(s);
    }
    function a(p) {
      const r = [];
      for (let s = 0; s < p; s++)
        r.push(s);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, o, d) {
    let f = e("./acyclic"), c = e("./normalize"), h = e("./rank"), u = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), l = e("./add-border-segments"), a = e("./coordinate-system"), p = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    o.exports = b;
    function b(x, I) {
      let A = I && I.debugTiming ? s.time : s.notime;
      A("layout", () => {
        let S = A("  buildLayoutGraph", () => g(x));
        A("  runLayout", () => _(S, A, I)), A("  updateInputGraph", () => T(x, S));
      });
    }
    function _(x, I, A) {
      I("    makeSpaceForEdgeLabels", () => E(x)), I("    removeSelfEdges", () => We(x)), I("    acyclic", () => f.run(x)), I("    nestingGraph.run", () => t.run(x)), I("    rank", () => h(s.asNonCompoundGraph(x))), I("    injectEdgeLabelProxies", () => j(x)), I("    removeEmptyRanks", () => n(x)), I("    nestingGraph.cleanup", () => t.cleanup(x)), I("    normalizeRanks", () => u(x)), I("    assignRankMinMax", () => C(x)), I("    removeEdgeLabelProxies", () => M(x)), I("    normalize.run", () => c.run(x)), I("    parentDummyChains", () => i(x)), I("    addBorderSegments", () => l(x)), I("    order", () => p(x, A)), I("    insertSelfEdges", () => ze(x)), I("    adjustCoordinateSystem", () => a.adjust(x)), I("    position", () => r(x)), I("    positionSelfEdges", () => Ye(x)), I("    removeBorderNodes", () => Z(x)), I("    normalize.undo", () => c.undo(x)), I("    fixupEdgeLabelCoords", () => F(x)), I("    undoCoordinateSystem", () => a.undo(x)), I("    translateGraph", () => V(x)), I("    assignNodeIntersects", () => $(x)), I("    reversePoints", () => H(x)), I("    acyclic.undo", () => f.undo(x));
    }
    function T(x, I) {
      x.nodes().forEach((A) => {
        let S = x.node(A), P = I.node(A);
        S && (S.x = P.x, S.y = P.y, S.rank = P.rank, I.children(A).length && (S.width = P.width, S.height = P.height));
      }), x.edges().forEach((A) => {
        let S = x.edge(A), P = I.edge(A);
        S.points = P.points, Object.hasOwn(P, "x") && (S.x = P.x, S.y = P.y);
      }), x.graph().width = I.graph().width, x.graph().height = I.graph().height;
    }
    let y = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], v = ["width", "height", "rank"], O = { width: 0, height: 0 }, w = ["minlen", "weight", "width", "height", "labeloffset"], L = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, R = ["labelpos"];
    function g(x) {
      let I = new m({ multigraph: !0, compound: !0 }), A = ye(x.graph());
      return I.setGraph(Object.assign({}, N, ge(A, y), s.pick(A, k))), x.nodes().forEach((S) => {
        let P = ye(x.node(S));
        const D = ge(P, v);
        Object.keys(O).forEach((B) => {
          D[B] === void 0 && (D[B] = O[B]);
        }), I.setNode(S, D), I.setParent(S, x.parent(S));
      }), x.edges().forEach((S) => {
        let P = ye(x.edge(S));
        I.setEdge(S, Object.assign({}, L, ge(P, w), s.pick(P, R)));
      }), I;
    }
    function E(x) {
      let I = x.graph();
      I.ranksep /= 2, x.edges().forEach((A) => {
        let S = x.edge(A);
        S.minlen *= 2, S.labelpos.toLowerCase() !== "c" && (I.rankdir === "TB" || I.rankdir === "BT" ? S.width += S.labeloffset : S.height += S.labeloffset);
      });
    }
    function j(x) {
      x.edges().forEach((I) => {
        let A = x.edge(I);
        if (A.width && A.height) {
          let S = x.node(I.v), D = { rank: (x.node(I.w).rank - S.rank) / 2 + S.rank, e: I };
          s.addDummyNode(x, "edge-proxy", D, "_ep");
        }
      });
    }
    function C(x) {
      let I = 0;
      x.nodes().forEach((A) => {
        let S = x.node(A);
        S.borderTop && (S.minRank = x.node(S.borderTop).rank, S.maxRank = x.node(S.borderBottom).rank, I = Math.max(I, S.maxRank));
      }), x.graph().maxRank = I;
    }
    function M(x) {
      x.nodes().forEach((I) => {
        let A = x.node(I);
        A.dummy === "edge-proxy" && (x.edge(A.e).labelRank = A.rank, x.removeNode(I));
      });
    }
    function V(x) {
      let I = Number.POSITIVE_INFINITY, A = 0, S = Number.POSITIVE_INFINITY, P = 0, D = x.graph(), B = D.marginx || 0, Y = D.marginy || 0;
      function Oe(J) {
        let z = J.x, le = J.y, Ne = J.width, je = J.height;
        I = Math.min(I, z - Ne / 2), A = Math.max(A, z + Ne / 2), S = Math.min(S, le - je / 2), P = Math.max(P, le + je / 2);
      }
      x.nodes().forEach((J) => Oe(x.node(J))), x.edges().forEach((J) => {
        let z = x.edge(J);
        Object.hasOwn(z, "x") && Oe(z);
      }), I -= B, S -= Y, x.nodes().forEach((J) => {
        let z = x.node(J);
        z.x -= I, z.y -= S;
      }), x.edges().forEach((J) => {
        let z = x.edge(J);
        z.points.forEach((le) => {
          le.x -= I, le.y -= S;
        }), Object.hasOwn(z, "x") && (z.x -= I), Object.hasOwn(z, "y") && (z.y -= S);
      }), D.width = A - I + B, D.height = P - S + Y;
    }
    function $(x) {
      x.edges().forEach((I) => {
        let A = x.edge(I), S = x.node(I.v), P = x.node(I.w), D, B;
        A.points ? (D = A.points[0], B = A.points[A.points.length - 1]) : (A.points = [], D = P, B = S), A.points.unshift(s.intersectRect(S, D)), A.points.push(s.intersectRect(P, B));
      });
    }
    function F(x) {
      x.edges().forEach((I) => {
        let A = x.edge(I);
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
    function H(x) {
      x.edges().forEach((I) => {
        let A = x.edge(I);
        A.reversed && A.points.reverse();
      });
    }
    function Z(x) {
      x.nodes().forEach((I) => {
        if (x.children(I).length) {
          let A = x.node(I), S = x.node(A.borderTop), P = x.node(A.borderBottom), D = x.node(A.borderLeft[A.borderLeft.length - 1]), B = x.node(A.borderRight[A.borderRight.length - 1]);
          A.width = Math.abs(B.x - D.x), A.height = Math.abs(P.y - S.y), A.x = D.x + A.width / 2, A.y = S.y + A.height / 2;
        }
      }), x.nodes().forEach((I) => {
        x.node(I).dummy === "border" && x.removeNode(I);
      });
    }
    function We(x) {
      x.edges().forEach((I) => {
        if (I.v === I.w) {
          var A = x.node(I.v);
          A.selfEdges || (A.selfEdges = []), A.selfEdges.push({ e: I, label: x.edge(I) }), x.removeEdge(I);
        }
      });
    }
    function ze(x) {
      var I = s.buildLayerMatrix(x);
      I.forEach((A) => {
        var S = 0;
        A.forEach((P, D) => {
          var B = x.node(P);
          B.order = D + S, (B.selfEdges || []).forEach((Y) => {
            s.addDummyNode(x, "selfedge", { width: Y.label.width, height: Y.label.height, rank: B.rank, order: D + ++S, e: Y.e, label: Y.label }, "_se");
          }), delete B.selfEdges;
        });
      });
    }
    function Ye(x) {
      x.nodes().forEach((I) => {
        var A = x.node(I);
        if (A.dummy === "selfedge") {
          var S = x.node(A.e.v), P = S.x + S.width / 2, D = S.y, B = A.x - P, Y = S.height / 2;
          x.setEdge(A.e, A.label), x.removeNode(I), A.label.points = [{ x: P + 2 * B / 3, y: D - Y }, { x: P + 5 * B / 6, y: D - Y }, { x: P + B, y: D }, { x: P + 5 * B / 6, y: D + Y }, { x: P + 2 * B / 3, y: D + Y }], A.label.x = A.x, A.label.y = A.y;
        }
      });
    }
    function ge(x, I) {
      return s.mapValues(s.pick(x, I), Number);
    }
    function ye(x) {
      var I = {};
      return x && Object.entries(x).forEach(([A, S]) => {
        typeof A == "string" && (A = A.toLowerCase()), I[A] = S;
      }), I;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, o, d) {
    let f = e("./util");
    o.exports = { run: c, cleanup: n };
    function c(t) {
      let l = f.addDummyNode(t, "root", {}, "_root"), a = u(t), p = Object.values(a), r = f.applyWithChunking(Math.max, p) - 1, s = 2 * r + 1;
      t.graph().nestingRoot = l, t.edges().forEach((b) => t.edge(b).minlen *= s);
      let m = i(t) + 1;
      t.children().forEach((b) => h(t, l, s, m, r, a, b)), t.graph().nodeRankFactor = s;
    }
    function h(t, l, a, p, r, s, m) {
      let b = t.children(m);
      if (!b.length) {
        m !== l && t.setEdge(l, m, { weight: 0, minlen: a });
        return;
      }
      let _ = f.addBorderNode(t, "_bt"), T = f.addBorderNode(t, "_bb"), y = t.node(m);
      t.setParent(_, m), y.borderTop = _, t.setParent(T, m), y.borderBottom = T, b.forEach((N) => {
        h(t, l, a, p, r, s, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, w = k.borderTop ? p : 2 * p, L = v !== O ? 1 : r - s[m] + 1;
        t.setEdge(_, v, { weight: w, minlen: L, nestingEdge: !0 }), t.setEdge(O, T, { weight: w, minlen: L, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(l, _, { weight: 0, minlen: r + s[m] });
    }
    function u(t) {
      var l = {};
      function a(p, r) {
        var s = t.children(p);
        s && s.length && s.forEach((m) => a(m, r + 1)), l[p] = r;
      }
      return t.children().forEach((p) => a(p, 1)), l;
    }
    function i(t) {
      return t.edges().reduce((l, a) => l + t.edge(a).weight, 0);
    }
    function n(t) {
      var l = t.graph();
      t.removeNode(l.nestingRoot), delete l.nestingRoot, t.edges().forEach((a) => {
        var p = t.edge(a);
        p.nestingEdge && t.removeEdge(a);
      });
    }
  }, { "./util": 27 }], 10: [function(e, o, d) {
    let f = e("./util");
    o.exports = { run: c, undo: u };
    function c(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => h(i, n));
    }
    function h(i, n) {
      let t = n.v, l = i.node(t).rank, a = n.w, p = i.node(a).rank, r = n.name, s = i.edge(n), m = s.labelRank;
      if (p === l + 1) return;
      i.removeEdge(n);
      let b, _, T;
      for (T = 0, ++l; l < p; ++T, ++l)
        s.points = [], _ = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: l }, b = f.addDummyNode(i, "edge", _, "_d"), l === m && (_.width = s.width, _.height = s.height, _.dummy = "edge-label", _.labelpos = s.labelpos), i.setEdge(t, b, { weight: s.weight }, r), T === 0 && i.graph().dummyChains.push(b), t = b;
      i.setEdge(t, a, { weight: s.weight }, r);
    }
    function u(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), l = t.edgeLabel, a;
        for (i.setEdge(t.edgeObj, l); t.dummy; )
          a = i.successors(n)[0], i.removeNode(n), l.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (l.x = t.x, l.y = t.y, l.width = t.width, l.height = t.height), n = a, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, o, d) {
    o.exports = f;
    function f(c, h, u) {
      let i = {}, n;
      u.forEach((t) => {
        let l = c.parent(t), a, p;
        for (; l; ) {
          if (a = c.parent(l), a ? (p = i[a], i[a] = l) : (p = n, n = l), p && p !== l) {
            h.setEdge(p, l);
            return;
          }
          l = a;
        }
      });
    }
  }, {}], 12: [function(e, o, d) {
    o.exports = f;
    function f(c, h = []) {
      return h.map((u) => {
        let i = c.inEdges(u);
        if (i.length) {
          let n = i.reduce((t, l) => {
            let a = c.edge(l), p = c.node(l.v);
            return { sum: t.sum + a.weight * p.order, weight: t.weight + a.weight };
          }, { sum: 0, weight: 0 });
          return { v: u, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: u };
      });
    }
  }, {}], 13: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("../util");
    o.exports = h;
    function h(i, n, t, l) {
      l || (l = i.nodes());
      let a = u(i), p = new f({ compound: !0 }).setGraph({ root: a }).setDefaultNodeLabel((r) => i.node(r));
      return l.forEach((r) => {
        let s = i.node(r), m = i.parent(r);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (p.setNode(r), p.setParent(r, m || a), i[t](r).forEach((b) => {
          let _ = b.v === r ? b.w : b.v, T = p.edge(_, r), y = T !== void 0 ? T.weight : 0;
          p.setEdge(_, r, { weight: i.edge(b).weight + y });
        }), Object.hasOwn(s, "minRank") && p.setNode(r, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
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
      let t = f(n, n.map((m, b) => b)), l = i.flatMap((m) => u.outEdges(m).map((b) => ({ pos: t[b.w], weight: u.edge(b).weight })).sort((b, _) => b.pos - _.pos)), a = 1;
      for (; a < n.length; ) a <<= 1;
      let p = 2 * a - 1;
      a -= 1;
      let r = new Array(p).fill(0), s = 0;
      return l.forEach((m) => {
        let b = m.pos + a;
        r[b] += m.weight;
        let _ = 0;
        for (; b > 0; )
          b % 2 && (_ += r[b + 1]), b = b - 1 >> 1, r[b] += m.weight;
        s += m.weight * _;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, o, d) {
    let f = e("./init-order"), c = e("./cross-count"), h = e("./sort-subgraph"), u = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    o.exports = l;
    function l(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, l);
        return;
      }
      let b = t.maxRank(s), _ = a(s, t.range(1, b + 1), "inEdges"), T = a(s, t.range(b - 1, -1, -1), "outEdges"), y = f(s);
      if (r(s, y), m && m.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let v = 0, O = 0; O < 4; ++v, ++O) {
        p(v % 2 ? _ : T, v % 4 >= 2), y = t.buildLayerMatrix(s);
        let w = c(s, y);
        w < N && (O = 0, k = Object.assign({}, y), N = w);
      }
      r(s, k);
    }
    function a(s, m, b) {
      const _ = /* @__PURE__ */ new Map(), T = (y, N) => {
        _.has(y) || _.set(y, []), _.get(y).push(N);
      };
      for (const y of s.nodes()) {
        const N = s.node(y);
        if (typeof N.rank == "number" && T(N.rank, y), typeof N.minRank == "number" && typeof N.maxRank == "number")
          for (let k = N.minRank; k <= N.maxRank; k++)
            k !== N.rank && T(k, y);
      }
      return m.map(function(y) {
        return u(s, y, b, _.get(y) || []);
      });
    }
    function p(s, m) {
      let b = new n();
      s.forEach(function(_) {
        let T = _.graph().root, y = h(_, T, b, m);
        y.vs.forEach((N, k) => _.node(N).order = k), i(_, b, y.vs);
      });
    }
    function r(s, m) {
      Object.values(m).forEach((b) => b.forEach((_, T) => s.node(_).order = T));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(h) {
      let u = {}, i = h.nodes().filter((r) => !h.children(r).length), n = i.map((r) => h.node(r).rank), t = f.applyWithChunking(Math.max, n), l = f.range(t + 1).map(() => []);
      function a(r) {
        if (u[r]) return;
        u[r] = !0;
        let s = h.node(r);
        l[s.rank].push(r), h.successors(r).forEach(a);
      }
      return i.sort((r, s) => h.node(r).rank - h.node(s).rank).forEach(a), l;
    }
  }, { "../util": 27 }], 17: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(i, n) {
      let t = {};
      i.forEach((a, p) => {
        let r = t[a.v] = { indegree: 0, in: [], out: [], vs: [a.v], i: p };
        a.barycenter !== void 0 && (r.barycenter = a.barycenter, r.weight = a.weight);
      }), n.edges().forEach((a) => {
        let p = t[a.v], r = t[a.w];
        p !== void 0 && r !== void 0 && (r.indegree++, p.out.push(t[a.w]));
      });
      let l = Object.values(t).filter((a) => !a.indegree);
      return h(l);
    }
    function h(i) {
      let n = [];
      function t(a) {
        return (p) => {
          p.merged || (p.barycenter === void 0 || a.barycenter === void 0 || p.barycenter >= a.barycenter) && u(a, p);
        };
      }
      function l(a) {
        return (p) => {
          p.in.push(a), --p.indegree === 0 && i.push(p);
        };
      }
      for (; i.length; ) {
        let a = i.pop();
        n.push(a), a.in.reverse().forEach(t(a)), a.out.forEach(l(a));
      }
      return n.filter((a) => !a.merged).map((a) => f.pick(a, ["vs", "i", "barycenter", "weight"]));
    }
    function u(i, n) {
      let t = 0, l = 0;
      i.weight && (t += i.barycenter * i.weight, l += i.weight), n.weight && (t += n.barycenter * n.weight, l += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / l, i.weight = l, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, o, d) {
    let f = e("./barycenter"), c = e("./resolve-conflicts"), h = e("./sort");
    o.exports = u;
    function u(t, l, a, p) {
      let r = t.children(l), s = t.node(l), m = s ? s.borderLeft : void 0, b = s ? s.borderRight : void 0, _ = {};
      m && (r = r.filter((k) => k !== m && k !== b));
      let T = f(t, r);
      T.forEach((k) => {
        if (t.children(k.v).length) {
          let v = u(t, k.v, a, p);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let y = c(T, a);
      i(y, _);
      let N = h(y, p);
      if (m && (N.vs = [m, N.vs, b].flat(!0), t.predecessors(m).length)) {
        let k = t.node(t.predecessors(m)[0]), v = t.node(t.predecessors(b)[0]);
        Object.hasOwn(N, "barycenter") || (N.barycenter = 0, N.weight = 0), N.barycenter = (N.barycenter * N.weight + k.order + v.order) / (N.weight + 2), N.weight += 2;
      }
      return N;
    }
    function i(t, l) {
      t.forEach((a) => {
        a.vs = a.vs.flatMap((p) => l[p] ? l[p].vs : p);
      });
    }
    function n(t, l) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + l.barycenter * l.weight) / (t.weight + l.weight), t.weight += l.weight) : (t.barycenter = l.barycenter, t.weight = l.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, o, d) {
    let f = e("../util");
    o.exports = c;
    function c(i, n) {
      let t = f.partition(i, (_) => Object.hasOwn(_, "barycenter")), l = t.lhs, a = t.rhs.sort((_, T) => T.i - _.i), p = [], r = 0, s = 0, m = 0;
      l.sort(u(!!n)), m = h(p, a, m), l.forEach((_) => {
        m += _.vs.length, p.push(_.vs), r += _.barycenter * _.weight, s += _.weight, m = h(p, a, m);
      });
      let b = { vs: p.flat(!0) };
      return s && (b.barycenter = r / s, b.weight = s), b;
    }
    function h(i, n, t) {
      let l;
      for (; n.length && (l = n[n.length - 1]).i <= t; )
        n.pop(), i.push(l.vs), t++;
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
        let t = u.node(n), l = t.edgeObj, a = c(u, i, l.v, l.w), p = a.path, r = a.lca, s = 0, m = p[s], b = !0;
        for (; n !== l.w; ) {
          if (t = u.node(n), b) {
            for (; (m = p[s]) !== r && u.node(m).maxRank < t.rank; )
              s++;
            m === r && (b = !1);
          }
          if (!b) {
            for (; s < p.length - 1 && u.node(m = p[s + 1]).minRank <= t.rank; )
              s++;
            m = p[s];
          }
          u.setParent(n, m), n = u.successors(n)[0];
        }
      });
    }
    function c(u, i, n, t) {
      let l = [], a = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), s, m;
      s = n;
      do
        s = u.parent(s), l.push(s);
      while (s && (i[s].low > p || r > i[s].lim));
      for (m = s, s = t; (s = u.parent(s)) !== m; )
        a.push(s);
      return { path: l.concat(a.reverse()), lca: m };
    }
    function h(u) {
      let i = {}, n = 0;
      function t(l) {
        let a = n;
        u.children(l).forEach(t), i[l] = { low: a, lim: n++ };
      }
      return u.children().forEach(t), i;
    }
  }, {}], 21: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph, c = e("../util");
    o.exports = { positionX: b, findType1Conflicts: h, findType2Conflicts: u, addConflict: n, hasConflict: t, verticalAlignment: l, horizontalCompaction: a, alignCoordinates: s, findSmallestWidthAlignment: r, balance: m };
    function h(y, N) {
      let k = {};
      function v(O, w) {
        let L = 0, R = 0, g = O.length, E = w[w.length - 1];
        return w.forEach((j, C) => {
          let M = i(y, j), V = M ? y.node(M).order : g;
          (M || j === E) && (w.slice(R, C + 1).forEach(($) => {
            y.predecessors($).forEach((F) => {
              let H = y.node(F), Z = H.order;
              (Z < L || V < Z) && !(H.dummy && y.node($).dummy) && n(k, F, $);
            });
          }), R = C + 1, L = V);
        }), w;
      }
      return N.length && N.reduce(v), k;
    }
    function u(y, N) {
      let k = {};
      function v(w, L, R, g, E) {
        let j;
        c.range(L, R).forEach((C) => {
          j = w[C], y.node(j).dummy && y.predecessors(j).forEach((M) => {
            let V = y.node(M);
            V.dummy && (V.order < g || V.order > E) && n(k, M, j);
          });
        });
      }
      function O(w, L) {
        let R = -1, g, E = 0;
        return L.forEach((j, C) => {
          if (y.node(j).dummy === "border") {
            let M = y.predecessors(j);
            M.length && (g = y.node(M[0]).order, v(L, E, C, R, g), E = C, R = g);
          }
          v(L, E, L.length, g, w.length);
        }), L;
      }
      return N.length && N.reduce(O), k;
    }
    function i(y, N) {
      if (y.node(N).dummy)
        return y.predecessors(N).find((k) => y.node(k).dummy);
    }
    function n(y, N, k) {
      if (N > k) {
        let O = N;
        N = k, k = O;
      }
      let v = y[N];
      v || (y[N] = v = {}), v[k] = !0;
    }
    function t(y, N, k) {
      if (N > k) {
        let v = N;
        N = k, k = v;
      }
      return !!y[N] && Object.hasOwn(y[N], k);
    }
    function l(y, N, k, v) {
      let O = {}, w = {}, L = {};
      return N.forEach((R) => {
        R.forEach((g, E) => {
          O[g] = g, w[g] = g, L[g] = E;
        });
      }), N.forEach((R) => {
        let g = -1;
        R.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((M, V) => L[M] - L[V]);
            let C = (j.length - 1) / 2;
            for (let M = Math.floor(C), V = Math.ceil(C); M <= V; ++M) {
              let $ = j[M];
              w[E] === E && g < L[$] && !t(k, E, $) && (w[$] = E, w[E] = O[E] = O[$], g = L[$]);
            }
          }
        });
      }), { root: O, align: w };
    }
    function a(y, N, k, v, O) {
      let w = {}, L = p(y, N, k, O), R = O ? "borderLeft" : "borderRight";
      function g(C, M) {
        let V = L.nodes(), $ = V.pop(), F = {};
        for (; $; )
          F[$] ? C($) : (F[$] = !0, V.push($), V = V.concat(M($))), $ = V.pop();
      }
      function E(C) {
        w[C] = L.inEdges(C).reduce((M, V) => Math.max(M, w[V.v] + L.edge(V)), 0);
      }
      function j(C) {
        let M = L.outEdges(C).reduce(($, F) => Math.min($, w[F.w] - L.edge(F)), Number.POSITIVE_INFINITY), V = y.node(C);
        M !== Number.POSITIVE_INFINITY && V.borderType !== R && (w[C] = Math.max(w[C], M));
      }
      return g(E, L.predecessors.bind(L)), g(j, L.successors.bind(L)), Object.keys(v).forEach((C) => w[C] = w[k[C]]), w;
    }
    function p(y, N, k, v) {
      let O = new f(), w = y.graph(), L = _(w.nodesep, w.edgesep, v);
      return N.forEach((R) => {
        let g;
        R.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), g) {
            var C = k[g], M = O.edge(C, j);
            O.setEdge(C, j, Math.max(L(y, E, g), M || 0));
          }
          g = E;
        });
      }), O;
    }
    function r(y, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, w = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([R, g]) => {
          let E = T(y, R) / 2;
          O = Math.max(g + E, O), w = Math.min(g - E, w);
        });
        const L = O - w;
        return L < k[0] && (k = [L, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(y, N) {
      let k = Object.values(N), v = c.applyWithChunking(Math.min, k), O = c.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((w) => {
        ["l", "r"].forEach((L) => {
          let R = w + L, g = y[R];
          if (g === N) return;
          let E = Object.values(g), j = v - c.applyWithChunking(Math.min, E);
          L !== "l" && (j = O - c.applyWithChunking(Math.max, E)), j && (y[R] = c.mapValues(g, (C) => C + j));
        });
      });
    }
    function m(y, N) {
      return c.mapValues(y.ul, (k, v) => {
        if (N)
          return y[N.toLowerCase()][v];
        {
          let O = Object.values(y).map((w) => w[v]).sort((w, L) => w - L);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function b(y) {
      let N = c.buildLayerMatrix(y), k = Object.assign(h(y, N), u(y, N)), v = {}, O;
      ["u", "d"].forEach((L) => {
        O = L === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((R) => {
          R === "r" && (O = O.map((C) => Object.values(C).reverse()));
          let g = (L === "u" ? y.predecessors : y.successors).bind(y), E = l(y, O, k, g), j = a(y, O, E.root, E.align, R === "r");
          R === "r" && (j = c.mapValues(j, (C) => -C)), v[L + R] = j;
        });
      });
      let w = r(y, v);
      return s(v, w), m(v, y.graph().align);
    }
    function _(y, N, k) {
      return (v, O, w) => {
        let L = v.node(O), R = v.node(w), g = 0, E;
        if (g += L.width / 2, Object.hasOwn(L, "labelpos"))
          switch (L.labelpos.toLowerCase()) {
            case "l":
              E = -L.width / 2;
              break;
            case "r":
              E = L.width / 2;
              break;
          }
        if (E && (g += k ? E : -E), E = 0, g += (L.dummy ? N : y) / 2, g += (R.dummy ? N : y) / 2, g += R.width / 2, Object.hasOwn(R, "labelpos"))
          switch (R.labelpos.toLowerCase()) {
            case "l":
              E = R.width / 2;
              break;
            case "r":
              E = -R.width / 2;
              break;
          }
        return E && (g += k ? E : -E), E = 0, g;
      };
    }
    function T(y, N) {
      return y.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, o, d) {
    let f = e("../util"), c = e("./bk").positionX;
    o.exports = h;
    function h(i) {
      i = f.asNonCompoundGraph(i), u(i), Object.entries(c(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function u(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, l = 0;
      n.forEach((a) => {
        const p = a.reduce((r, s) => {
          const m = i.node(s).height;
          return r > m ? r : m;
        }, 0);
        a.forEach((r) => i.node(r).y = l + p / 2), l += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, o, d) {
    var f = e("@dagrejs/graphlib").Graph, c = e("./util").slack;
    o.exports = h;
    function h(t) {
      var l = new f({ directed: !1 }), a = t.nodes()[0], p = t.nodeCount();
      l.setNode(a, {});
      for (var r, s; u(l, t) < p; )
        r = i(l, t), s = l.hasNode(r.v) ? c(t, r) : -c(t, r), n(l, t, s);
      return l;
    }
    function u(t, l) {
      function a(p) {
        l.nodeEdges(p).forEach((r) => {
          var s = r.v, m = p === s ? r.w : s;
          !t.hasNode(m) && !c(l, r) && (t.setNode(m, {}), t.setEdge(p, m, {}), a(m));
        });
      }
      return t.nodes().forEach(a), t.nodeCount();
    }
    function i(t, l) {
      return l.edges().reduce((p, r) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (s = c(l, r)), s < p[0] ? [s, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, l, a) {
      t.nodes().forEach((p) => l.node(p).rank += a);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, o, d) {
    var f = e("./util"), c = f.longestPath, h = e("./feasible-tree"), u = e("./network-simplex");
    o.exports = i;
    function i(a) {
      var p = a.graph().ranker;
      if (p instanceof Function)
        return p(a);
      switch (a.graph().ranker) {
        case "network-simplex":
          l(a);
          break;
        case "tight-tree":
          t(a);
          break;
        case "longest-path":
          n(a);
          break;
        case "none":
          break;
        default:
          l(a);
      }
    }
    var n = c;
    function t(a) {
      c(a), h(a);
    }
    function l(a) {
      u(a);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, o, d) {
    var f = e("./feasible-tree"), c = e("./util").slack, h = e("./util").longestPath, u = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    o.exports = t, t.initLowLimValues = r, t.initCutValues = l, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = b, t.exchangeEdges = _;
    function t(k) {
      k = n(k), h(k);
      var v = f(k);
      r(v), l(v, k);
      for (var O, w; O = m(v); )
        w = b(v, k, O), _(v, k, O, w);
    }
    function l(k, v) {
      var O = i(k, k.nodes());
      O = O.slice(0, O.length - 1), O.forEach((w) => a(k, v, w));
    }
    function a(k, v, O) {
      var w = k.node(O), L = w.parent;
      k.edge(O, L).cutvalue = p(k, v, O);
    }
    function p(k, v, O) {
      var w = k.node(O), L = w.parent, R = !0, g = v.edge(O, L), E = 0;
      return g || (R = !1, g = v.edge(L, O)), E = g.weight, v.nodeEdges(O).forEach((j) => {
        var C = j.v === O, M = C ? j.w : j.v;
        if (M !== L) {
          var V = C === R, $ = v.edge(j).weight;
          if (E += V ? $ : -$, y(k, O, M)) {
            var F = k.edge(O, M).cutvalue;
            E += V ? -F : F;
          }
        }
      }), E;
    }
    function r(k, v) {
      arguments.length < 2 && (v = k.nodes()[0]), s(k, {}, 1, v);
    }
    function s(k, v, O, w, L) {
      var R = O, g = k.node(w);
      return v[w] = !0, k.neighbors(w).forEach((E) => {
        Object.hasOwn(v, E) || (O = s(k, v, O, E, w));
      }), g.low = R, g.lim = O++, L ? g.parent = L : delete g.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function b(k, v, O) {
      var w = O.v, L = O.w;
      v.hasEdge(w, L) || (w = O.w, L = O.v);
      var R = k.node(w), g = k.node(L), E = R, j = !1;
      R.lim > g.lim && (E = g, j = !0);
      var C = v.edges().filter((M) => j === N(k, k.node(M.v), E) && j !== N(k, k.node(M.w), E));
      return C.reduce((M, V) => c(v, V) < c(v, M) ? V : M);
    }
    function _(k, v, O, w) {
      var L = O.v, R = O.w;
      k.removeEdge(L, R), k.setEdge(w.v, w.w, {}), r(k), l(k, v), T(k, v);
    }
    function T(k, v) {
      var O = k.nodes().find((L) => !v.node(L).parent), w = u(k, O);
      w = w.slice(1), w.forEach((L) => {
        var R = k.node(L).parent, g = v.edge(L, R), E = !1;
        g || (g = v.edge(R, L), E = !0), v.node(L).rank = v.node(R).rank + (E ? g.minlen : -g.minlen);
      });
    }
    function y(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, o, d) {
    const { applyWithChunking: f } = e("../util");
    o.exports = { longestPath: c, slack: h };
    function c(u) {
      var i = {};
      function n(t) {
        var l = u.node(t);
        if (Object.hasOwn(i, t))
          return l.rank;
        i[t] = !0;
        let a = u.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - u.edge(r).minlen);
        var p = f(Math.min, a);
        return p === Number.POSITIVE_INFINITY && (p = 0), l.rank = p;
      }
      u.sources().forEach(n);
    }
    function h(u, i) {
      return u.node(i.w).rank - u.node(i.v).rank - u.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, o, d) {
    let f = e("@dagrejs/graphlib").Graph;
    o.exports = { addBorderNode: r, addDummyNode: c, applyWithChunking: b, asNonCompoundGraph: u, buildLayerMatrix: l, intersectRect: t, mapValues: L, maxRank: _, normalizeRanks: a, notime: N, partition: T, pick: w, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: h, successorWeights: i, time: y, uniqueId: v, zipObject: R };
    function c(g, E, j, C) {
      for (var M = C; g.hasNode(M); )
        M = v(C);
      return j.dummy = E, g.setNode(M, j), M;
    }
    function h(g) {
      let E = new f().setGraph(g.graph());
      return g.nodes().forEach((j) => E.setNode(j, g.node(j))), g.edges().forEach((j) => {
        let C = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, M = g.edge(j);
        E.setEdge(j.v, j.w, { weight: C.weight + M.weight, minlen: Math.max(C.minlen, M.minlen) });
      }), E;
    }
    function u(g) {
      let E = new f({ multigraph: g.isMultigraph() }).setGraph(g.graph());
      return g.nodes().forEach((j) => {
        g.children(j).length || E.setNode(j, g.node(j));
      }), g.edges().forEach((j) => {
        E.setEdge(j, g.edge(j));
      }), E;
    }
    function i(g) {
      let E = g.nodes().map((j) => {
        let C = {};
        return g.outEdges(j).forEach((M) => {
          C[M.w] = (C[M.w] || 0) + g.edge(M).weight;
        }), C;
      });
      return R(g.nodes(), E);
    }
    function n(g) {
      let E = g.nodes().map((j) => {
        let C = {};
        return g.inEdges(j).forEach((M) => {
          C[M.v] = (C[M.v] || 0) + g.edge(M).weight;
        }), C;
      });
      return R(g.nodes(), E);
    }
    function t(g, E) {
      let j = g.x, C = g.y, M = E.x - j, V = E.y - C, $ = g.width / 2, F = g.height / 2;
      if (!M && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, Z;
      return Math.abs(V) * $ > Math.abs(M) * F ? (V < 0 && (F = -F), H = F * M / V, Z = F) : (M < 0 && ($ = -$), H = $, Z = $ * V / M), { x: j + H, y: C + Z };
    }
    function l(g) {
      let E = O(_(g) + 1).map(() => []);
      return g.nodes().forEach((j) => {
        let C = g.node(j), M = C.rank;
        M !== void 0 && (E[M][C.order] = j);
      }), E;
    }
    function a(g) {
      let E = g.nodes().map((C) => {
        let M = g.node(C).rank;
        return M === void 0 ? Number.MAX_VALUE : M;
      }), j = b(Math.min, E);
      g.nodes().forEach((C) => {
        let M = g.node(C);
        Object.hasOwn(M, "rank") && (M.rank -= j);
      });
    }
    function p(g) {
      let E = g.nodes().map(($) => g.node($).rank), j = b(Math.min, E), C = [];
      g.nodes().forEach(($) => {
        let F = g.node($).rank - j;
        C[F] || (C[F] = []), C[F].push($);
      });
      let M = 0, V = g.graph().nodeRankFactor;
      Array.from(C).forEach(($, F) => {
        $ === void 0 && F % V !== 0 ? --M : $ !== void 0 && M && $.forEach((H) => g.node(H).rank += M);
      });
    }
    function r(g, E, j, C) {
      let M = { width: 0, height: 0 };
      return arguments.length >= 4 && (M.rank = j, M.order = C), c(g, "border", M, E);
    }
    function s(g, E = m) {
      const j = [];
      for (let C = 0; C < g.length; C += E) {
        const M = g.slice(C, C + E);
        j.push(M);
      }
      return j;
    }
    const m = 65535;
    function b(g, E) {
      if (E.length > m) {
        const j = s(E);
        return g.apply(null, j.map((C) => g.apply(null, C)));
      } else
        return g.apply(null, E);
    }
    function _(g) {
      const j = g.nodes().map((C) => {
        let M = g.node(C).rank;
        return M === void 0 ? Number.MIN_VALUE : M;
      });
      return b(Math.max, j);
    }
    function T(g, E) {
      let j = { lhs: [], rhs: [] };
      return g.forEach((C) => {
        E(C) ? j.lhs.push(C) : j.rhs.push(C);
      }), j;
    }
    function y(g, E) {
      let j = Date.now();
      try {
        return E();
      } finally {
        console.log(g + " time: " + (Date.now() - j) + "ms");
      }
    }
    function N(g, E) {
      return E();
    }
    let k = 0;
    function v(g) {
      var E = ++k;
      return g + ("" + E);
    }
    function O(g, E, j = 1) {
      E == null && (E = g, g = 0);
      let C = (V) => V < E;
      j < 0 && (C = (V) => E < V);
      const M = [];
      for (let V = g; C(V); V += j)
        M.push(V);
      return M;
    }
    function w(g, E) {
      const j = {};
      for (const C of E)
        g[C] !== void 0 && (j[C] = g[C]);
      return j;
    }
    function L(g, E) {
      let j = E;
      return typeof E == "string" && (j = (C) => C[E]), Object.entries(g).reduce((C, [M, V]) => (C[M] = j(V, M), C), {});
    }
    function R(g, E) {
      return g.reduce((j, C, M) => (j[C] = E[M], j), {});
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
      var l = i.isDirected() ? (s) => i.successors(s) : (s) => i.neighbors(s), a = t === "post" ? c : h, p = [], r = {};
      return n.forEach((s) => {
        if (!i.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        a(s, l, r, p);
      }), p;
    }
    function c(i, n, t, l) {
      for (var a = [[i, !1]]; a.length > 0; ) {
        var p = a.pop();
        p[1] ? l.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, a.push([p[0], !0]), u(n(p[0]), (r) => a.push([r, !1])));
      }
    }
    function h(i, n, t, l) {
      for (var a = [i]; a.length > 0; ) {
        var p = a.pop();
        Object.hasOwn(t, p) || (t[p] = !0, l.push(p), u(n(p), (r) => a.push(r)));
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
    function h(i, n, t, l) {
      return u(i, String(n), t || c, l || function(a) {
        return i.outEdges(a);
      });
    }
    function u(i, n, t, l) {
      var a = {}, p = new f(), r, s, m = function(b) {
        var _ = b.v !== r ? b.v : b.w, T = a[_], y = t(b), N = s.distance + y;
        if (y < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + b + " Weight: " + y);
        N < T.distance && (T.distance = N, T.predecessor = r, p.decrease(_, N));
      };
      for (i.nodes().forEach(function(b) {
        var _ = b === n ? 0 : Number.POSITIVE_INFINITY;
        a[b] = { distance: _ }, p.add(b, _);
      }); p.size() > 0 && (r = p.removeMin(), s = a[r], s.distance !== Number.POSITIVE_INFINITY); )
        l(r).forEach(m);
      return a;
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
      var t = {}, l = u.nodes();
      return l.forEach(function(a) {
        t[a] = {}, t[a][a] = { distance: 0 }, l.forEach(function(p) {
          a !== p && (t[a][p] = { distance: Number.POSITIVE_INFINITY });
        }), n(a).forEach(function(p) {
          var r = p.v === a ? p.w : p.v, s = i(p);
          t[a][r] = { distance: s, predecessor: a };
        });
      }), l.forEach(function(a) {
        var p = t[a];
        l.forEach(function(r) {
          var s = t[r];
          l.forEach(function(m) {
            var b = s[a], _ = p[m], T = s[m], y = b.distance + _.distance;
            y < T.distance && (T.distance = y, T.predecessor = _.predecessor);
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
      var n = new f(), t = {}, l = new c(), a;
      function p(s) {
        var m = s.v === a ? s.w : s.v, b = l.priority(m);
        if (b !== void 0) {
          var _ = i(s);
          _ < b && (t[m] = a, l.decrease(m, _));
        }
      }
      if (u.nodeCount() === 0)
        return n;
      u.nodes().forEach(function(s) {
        l.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), l.decrease(u.nodes()[0], 0);
      for (var r = !1; l.size() > 0; ) {
        if (a = l.removeMin(), Object.hasOwn(t, a))
          n.setEdge(a, t[a]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + u);
          r = !0;
        }
        u.nodeEdges(a).forEach(p);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, o, d) {
    o.exports = f;
    function f(c) {
      var h = 0, u = [], i = {}, n = [];
      function t(l) {
        var a = i[l] = { onStack: !0, lowlink: h, index: h++ };
        if (u.push(l), c.successors(l).forEach(function(s) {
          Object.hasOwn(i, s) ? i[s].onStack && (a.lowlink = Math.min(a.lowlink, i[s].index)) : (t(s), a.lowlink = Math.min(a.lowlink, i[s].lowlink));
        }), a.lowlink === a.index) {
          var p = [], r;
          do
            r = u.pop(), i[r].onStack = !1, p.push(r);
          while (l !== r);
          n.push(p);
        }
      }
      return c.nodes().forEach(function(l) {
        Object.hasOwn(i, l) || t(l);
      }), n;
    }
  }, {}], 42: [function(e, o, d) {
    function f(h) {
      var u = {}, i = {}, n = [];
      function t(l) {
        if (Object.hasOwn(i, l))
          throw new c();
        Object.hasOwn(u, l) || (i[l] = !0, u[l] = !0, h.predecessors(l).forEach(t), delete i[l], n.push(l));
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
        var i = this._arr, n = this._keyIndices, t = i[h], l = i[u];
        i[h] = l, i[u] = t, n[l.key] = h, n[t.key] = u;
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
        var m = arguments, b = this;
        return r.forEach(function(_) {
          m.length > 1 ? b.setNode(_, s) : b.setNode(_);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, s) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = s), this) : (this._nodes[r] = arguments.length > 1 ? s : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = c, this._children[r] = {}, this._children[c][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
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
          var m = (b) => s.removeEdge(s._edgeObjs[b]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(b) {
            s.setParent(b);
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
          s = c;
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
          if (s !== c)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = c) {
        if (this._isCompound) {
          var s = this._children[r];
          if (s)
            return Object.keys(s);
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
          const b = new Set(s);
          for (var m of this.successors(r))
            b.add(m);
          return Array.from(b.values());
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
        Object.entries(this._nodes).forEach(function([T, y]) {
          r(T) && s.setNode(T, y);
        }), Object.values(this._edgeObjs).forEach(function(T) {
          s.hasNode(T.v) && s.hasNode(T.w) && s.setEdge(T, m.edge(T));
        });
        var b = {};
        function _(T) {
          var y = m.parent(T);
          return y === void 0 || s.hasNode(y) ? (b[T] = y, y) : y in b ? b[y] : _(y);
        }
        return this._isCompound && s.nodes().forEach((T) => s.setParent(T, _(T))), s;
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
        var m = this, b = arguments;
        return r.reduce(function(_, T) {
          return b.length > 1 ? m.setEdge(_, T, s) : m.setEdge(_, T), T;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, s, m, b, _ = !1, T = arguments[0];
        typeof T == "object" && T !== null && "v" in T ? (r = T.v, s = T.w, m = T.name, arguments.length === 2 && (b = arguments[1], _ = !0)) : (r = T, s = arguments[1], m = arguments[3], arguments.length > 2 && (b = arguments[2], _ = !0)), r = "" + r, s = "" + s, m !== void 0 && (m = "" + m);
        var y = t(this._isDirected, r, s, m);
        if (Object.hasOwn(this._edgeLabels, y))
          return _ && (this._edgeLabels[y] = b), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(s), this._edgeLabels[y] = _ ? b : this._defaultEdgeLabelFn(r, s, m);
        var N = l(this._isDirected, r, s, m);
        return r = N.v, s = N.w, Object.freeze(N), this._edgeObjs[y] = N, i(this._preds[s], r), i(this._sucs[r], s), this._in[s][y] = N, this._out[r][y] = N, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, s, m) {
        var b = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return this._edgeLabels[b];
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
        var b = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m);
        return Object.hasOwn(this._edgeLabels, b);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, s, m) {
        var b = arguments.length === 1 ? a(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m), _ = this._edgeObjs[b];
        return _ && (r = _.v, s = _.w, delete this._edgeLabels[b], delete this._edgeObjs[b], n(this._preds[s], r), n(this._sucs[r], s), delete this._in[s][b], delete this._out[r][b], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, s) {
        var m = this._in[r];
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
      outEdges(r, s) {
        var m = this._out[r];
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
      var b = "" + r, _ = "" + s;
      if (!p && b > _) {
        var T = b;
        b = _, _ = T;
      }
      return b + h + _ + h + (m === void 0 ? f : m);
    }
    function l(p, r, s, m) {
      var b = "" + r, _ = "" + s;
      if (!p && b > _) {
        var T = b;
        b = _, _ = T;
      }
      var y = { v: b, w: _ };
      return m && (y.name = m), y;
    }
    function a(p, r) {
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
        var l = n.node(t), a = n.parent(t), p = { v: t };
        return l !== void 0 && (p.value = l), a !== void 0 && (p.parent = a), p;
      });
    }
    function u(n) {
      return n.edges().map(function(t) {
        var l = n.edge(t), a = { v: t.v, w: t.w };
        return t.name !== void 0 && (a.name = t.name), l !== void 0 && (a.value = l), a;
      });
    }
    function i(n) {
      var t = new f(n.options).setGraph(n.value);
      return n.nodes.forEach(function(l) {
        t.setNode(l.v, l.value), l.parent && t.setParent(l.v, l.parent);
      }), n.edges.forEach(function(l) {
        t.setEdge({ v: l.v, w: l.w, name: l.name }, l.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, o, d) {
    o.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), dn = ["unstarted", "started", "completed", "canceled"];
function un(e, o) {
  let d = 1;
  const f = () => `${e.slice(0, 40 - String(d).length - 1)}_${d}`;
  for (; o.some((c) => c.id === f()); ) d++;
  return f();
}
function cn(e, o) {
  return [
    ...e.initial === o.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((d) => d.to === o.id || d.from !== "any" && d.from.includes(o.id)).map((d) => `transition ${$t(d)}`),
    ...e.states.filter((d) => d.regions?.some((f) => f.initial === o.id)).map((d) => `lanes in ${Ge(d)}`),
    ...Object.entries(e.map ?? {}).filter(([, d]) => d === o.id).map(() => "existing item migration")
  ];
}
function fn(e, o) {
  return e.states.flatMap((d) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => d.run?.[f] === o.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${Ge(d)}`),
    ...(d.timers ?? []).filter((f) => f.then?.transition === o.id).map(() => "a timer")
  ]);
}
const Ge = (e) => e?.name || "Untitled state", $t = (e) => e.name?.trim() || be(e.id), hn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", pn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function mn(e, o) {
  if (e.id === o.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const d = e.release_when?.approvals?.min;
    return d ? `Needs ${d} approval${d === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Ue(e) : "A person moves it";
}
function Ue(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function bn(e, o) {
  const d = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${d === 1 ? "one person approves" : `${d} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Ue(e)}.` : "A person chooses when to move the item on.", c = o.policy?.wip?.[e.id]?.limit;
  return f + (c !== void 0 ? ` At most ${c} at a time.` : "");
}
function gn(e) {
  const o = e.transitions ?? [], d = [], f = /* @__PURE__ */ new Set();
  let c = e.states.find((u) => u.id === e.initial);
  const h = new Map(e.states.map((u, i) => [u.id, i]));
  for (; c && !f.has(c.id) && (d.push(c), f.add(c.id), !(c.category === "completed" || c.category === "canceled")); ) {
    const u = c, i = o.filter((t) => t.from !== "any" && t.from.includes(u.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (h.get(t.to) ?? -1) > (h.get(u.id) ?? 0));
    c = e.states.find((t) => t.id === n?.to);
  }
  return d;
}
function Be(e) {
  const o = e.states.find((d) => d.id === e.initial);
  return e.migration ?? (o?.kind === "automated" || o?.kind === "parallel" ? "pin" : "follow");
}
const ie = (e) => JSON.parse(JSON.stringify(e));
function yn(e) {
  return e?.admin === !0;
}
function wn(e, o, d) {
  const f = o + d;
  if (o < 0 || o >= e.length || f < 0 || f >= e.length) return;
  const [c] = e.splice(o, 1);
  e.splice(f, 0, c);
}
function vn(e, o, d) {
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
      for (const [t, l] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(l);
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
      for (const l of t.timers ?? [])
        l.at_field && (l.at_field = c(l.at_field)), l.by && (l.by = c(l.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(c));
      for (const l of t.set ?? [])
        l.field = c(l.field), l.copy && (l.copy = c(l.copy));
    }
  }
}
function Ae({ migration: e, map: o, ...d }) {
  return JSON.stringify(d);
}
function kn(e, o) {
  const d = ie(e);
  for (const c of d.processes ?? []) {
    const h = o.processes?.find((u) => u.id === c.id);
    if (h && Ae(c) !== Ae(h) && (c.migration = "follow"), c.map) {
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
function En(e, o, d) {
  const f = JSON.stringify({ declaration: e, configs: d });
  return {
    declaration: ie(e),
    expected_generation: o,
    plugin_configs: ie(d),
    matches: (c, h, u) => o === h && f === JSON.stringify({ declaration: c, configs: u })
  };
}
function xn(e) {
  const o = ie(e), d = [...new Set(o.declaration.item_types?.flatMap((c) => c.fields) ?? [])], f = (c) => {
    const h = d.indexOf(c);
    return h < 0 ? d.length : h;
  };
  o.declaration.fields?.sort((c, h) => f(c.code) - f(h.code));
  for (const c of o.declaration.fields ?? []) {
    const h = o.compiled.fields?.find((u) => u.code === c.code);
    c.id ??= h?.id, c.form ??= h?.form;
  }
  for (const c of o.declaration.processes ?? []) c.migration ??= o.compiled.processes?.find((h) => h.id === c.id)?.migration ?? Be(c);
  return o;
}
function _n(e, o) {
  return (o.processes ?? []).filter((d) => Be(d) !== "pin" && e.changes.some((f) => f.code === "process " + d.id && f.class !== "cosmetic" && f.class !== "refused")).map((d) => d.id);
}
function On(e, o, d) {
  const f = [d, `item_type ${d}`, `relation ${d}`, `process ${d}`], c = e.refused.filter((h) => f.includes(h.code));
  return o === "fields" && c.push(...e.changes.filter((h) => h.code === d && h.what === "removed" && h.class === "semantic")), c.length ? c.map(Pt).join(" ") : void 0;
}
function Nn(e, o, d) {
  if (o === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== d);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((c) => c !== d), f.inherit = f.inherit?.filter((c) => c !== d);
  } else o === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== d) : o === "processes" ? e.processes = e.processes?.filter((f) => f.id !== d) : e.relation_types = e.relation_types?.filter((f) => f.id !== d);
}
function Pt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function jn(e, o) {
  if (!(e instanceof re)) return [];
  const d = e.details ?? {};
  let f = typeof d.field == "string" ? d.field : "";
  if (!f) {
    const c = o.processes?.find((h) => h.id === d.process || h.states.some((u) => u.id === d.state) || e.message.includes(`process ${h.id}`));
    c ? f = `process ${c.id}` : typeof d.item_type == "string" && (f = `item_type ${d.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: Re(e, "The definition is invalid.") }] : [];
}
const In = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, Cn = (e) => !("problem" in e);
function Ln(e, o) {
  return { pack: e.id, version: e.version, expected_generation: o };
}
async function Tn(e, o) {
  const d = { ...ie(e), resolutions: ie(e.resolutions ?? {}) };
  let f = await o(d);
  return d.maps || (d.maps = ie(f.maps), f = await o(d)), { request: d, plan: f };
}
function An() {
  let e = 0;
  return () => {
    const o = ++e;
    return () => o === e;
  };
}
export {
  wn as A,
  Pt as B,
  Nn as C,
  vn as D,
  pn as E,
  re as F,
  $e as G,
  un as H,
  bn as I,
  fn as J,
  cn as K,
  ie as L,
  _t as M,
  me as N,
  In as O,
  kn as P,
  _n as Q,
  Ln as R,
  Tn as S,
  xn as T,
  En as U,
  jn as V,
  On as W,
  on as _,
  Cn as a,
  Ot as b,
  De as c,
  an as d,
  yn as e,
  Re as f,
  en as g,
  tn as h,
  ln as i,
  mn as j,
  Pe as k,
  An as l,
  gn as m,
  ce as n,
  nn as o,
  se as p,
  Et as q,
  rn as r,
  Ge as s,
  $t as t,
  sn as u,
  be as v,
  Vt as w,
  gt as x,
  dn as y,
  hn as z
};
//# sourceMappingURL=latestRequest-DmAg0i5K.js.map
