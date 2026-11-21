import { defineComponent as he, useModel as We, openBlock as U, createBlock as X, unref as B, withCtx as oe, createVNode as ie, createTextVNode as Ce, toDisplayString as Q, renderSlot as Le, mergeModels as Ye, ref as q, watch as le, onBeforeUnmount as ve, createElementVNode as re, createElementBlock as Y, createCommentVNode as ae, onUnmounted as ze, useId as Je, computed as Z, Fragment as _e, renderList as Oe, withKeys as He, withModifiers as qe, onMounted as Ke, nextTick as Xe } from "vue";
import Qe from "primevue/button";
import Ne from "primevue/inputtext";
import Ze from "primevue/inputnumber";
import et from "primevue/toggleswitch";
import tt from "primevue/select";
import nt from "primevue/chip";
import rt from "primevue/accordion";
import it from "primevue/accordioncontent";
import st from "primevue/accordionheader";
import ot from "primevue/accordionpanel";
import at from "primevue/textarea";
import { e as lt } from "./mount--O3y-Bty.js";
import { api as Te } from "@wippy-fe/proxy";
class ee extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(c, u, f) {
    super(c.message ?? c.error ?? `${u} failed`), this.name = "ApiError", this.kind = c.kind, this.details = c.details, this.retryable = c.retryable, this.status = f;
  }
}
const je = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Me(e, c) {
  const u = e instanceof ee ? e.details?.code : void 0, f = e instanceof Error && e.message || c;
  return typeof u != "string" || !u.trim() ? f : `${Object.hasOwn(je, u) ? je[u] : f}
Error code: ${u}`;
}
function Se(e, c) {
  const u = e;
  if (u && typeof u == "object" && u.success === !1) throw new ee(u, c);
  if (u && typeof u == "object" && u.success === !0 && u.data !== void 0) return u.data;
  throw new ee({ kind: "INTERNAL", message: `${c}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, c);
}
function Re(e, c) {
  if (e instanceof ee) return e;
  const u = e?.response;
  return u?.data ? new ee(u.data, c, u.status) : e instanceof Error ? e : new ee({ kind: "Unavailable" }, c);
}
async function ye(e, c, u) {
  try {
    return Se((await Te.get(e, { params: u })).data, c);
  } catch (f) {
    throw Re(f, c);
  }
}
async function ne(e, c, u) {
  try {
    return Se((await Te.post(e, c)).data, u);
  } catch (f) {
    throw Re(f, u);
  }
}
function de(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const pe = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), dt = /* @__PURE__ */ he({
  __name: "Disclosure",
  props: /* @__PURE__ */ Ye({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const c = We(e, "open");
    return (u, f) => (U(), X(B(rt), {
      class: "kx-disclosure",
      value: c.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = (d) => c.value = d === "content")
    }, {
      default: oe(() => [
        ie(B(ot), { value: "content" }, {
          default: oe(() => [
            ie(B(st), { class: "kx-disclosure-toggle" }, {
              default: oe(() => [
                Ce(Q(e.label), 1)
              ]),
              _: 1
            }),
            ie(B(it), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: oe(() => [
                Le(u.$slots, "default")
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
}), ut = { class: "work-stack work-tight" }, ct = {
  key: 0,
  class: "work-small work-muted"
}, ft = {
  key: 1,
  role: "alert",
  class: "work-error"
}, ht = { class: "work-json-example" }, pt = /* @__PURE__ */ he({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: c }) {
    const u = e, f = c, d = q(""), h = q("");
    le(() => u.modelValue, (i) => {
      d.value = i === void 0 ? "" : JSON.stringify(i, null, 2), h.value = "", f("validity", !0);
    }, { immediate: !0 }), ve(() => f("validity", !0));
    function l(i) {
      d.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && u.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && u.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        h.value = "", f("update:modelValue", n), f("validity", !0);
      } catch (n) {
        h.value = n instanceof Error ? n.message : "Invalid JSON.", f("validity", !1);
      }
    }
    return (i, n) => (U(), X(dt, {
      class: "work-json-disclosure",
      label: `Edit as JSON · ${e.label}`
    }, {
      default: oe(() => [
        re("label", ut, [
          re("span", null, Q(e.label), 1),
          e.hint ? (U(), Y("span", ct, Q(e.hint), 1)) : ae("", !0),
          ie(B(at), {
            class: "work-json-input",
            rows: "3",
            "aria-label": e.label,
            value: d.value,
            "aria-invalid": !!h.value,
            onInput: n[0] || (n[0] = (t) => l(t.target.value))
          }, null, 8, ["aria-label", "value", "aria-invalid"]),
          h.value ? (U(), Y("span", ft, Q(h.value), 1)) : ae("", !0)
        ]),
        n[1] || (n[1] = re("p", { class: "work-small work-muted" }, "Example", -1)),
        re("pre", ht, Q(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
      ]),
      _: 1
    }, 8, ["label"]));
  }
}), we = /* @__PURE__ */ new Map();
function fe(e, c = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => fe(f, c)).join(", ");
  if (typeof e == "string") return c.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const u = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof u[f] == "string" && u[f] && !pe(u[f])) return u[f];
  return c.get(`${u.kind ?? "user"}:${u.id}`) ?? (typeof u.email == "string" && u.email ? u.email : u.kind === "group" ? "Unavailable group" : typeof u.id == "string" ? fe(u.id, c) : "Unavailable person");
}
async function mt(e, c) {
  const u = [...new Map(c.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, u]), d = we.get(f);
  if (d) return d;
  const l = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < u.length; n += 200) {
      const t = await ne(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: u.slice(n, n + 200) }, "Display names");
      for (const a of t.principals) a.label.trim() && !pe(a.label) && a.label !== a.id && i.set(`${a.type}:${a.id}`, a.label.trim());
    }
    return i;
  })();
  we.set(f, l);
  try {
    return await l;
  } finally {
    we.delete(f);
  }
}
function gt(e, c) {
  const u = q(/* @__PURE__ */ new Map()), f = q("");
  let d = 0;
  return le([e, c], async ([h, l]) => {
    const i = ++d;
    if (u.value = /* @__PURE__ */ new Map(), f.value = "", !(!h || !l.length))
      try {
        const n = await mt(h, l);
        i === d && (u.value = n);
      } catch (n) {
        i === d && (f.value = Me(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), ze(() => {
    d++, u.value.clear();
  }), {
    labels: u,
    error: f,
    label: (h) => fe(h, u.value),
    remember: (h, l) => {
      l.trim() && !pe(l) && l !== h.id && u.value.set(`${h.kind}:${h.id}`, l.trim());
    }
  };
}
function me(e) {
  if (pe(e)) return "Untitled";
  const c = e.replace(/[_-]+/g, " ");
  return c.charAt(0).toUpperCase() + c.slice(1);
}
function Yt(e) {
  return e.title?.trim() || me(e.code);
}
function Ae(e, c, u = fe) {
  return e == null ? "—" : c?.type === "principal" ? u(e) : Array.isArray(e) ? e.map((f) => Ae(f, c, u)).join(", ") : c?.type === "option" && typeof e == "string" ? c.options?.find((f) => f.id === e)?.label || me(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (c?.form === "ref" || c?.type === "item") && "unavailable" in e ? "Unavailable" : c?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : c?.form === "ref" && "ref" in e && Array.isArray(e.ref) || c?.form === "ref" && "id" in e && typeof e.id == "string" || c?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function zt(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function Jt(e, c) {
  const u = gt(e, c);
  return {
    display: (f, d) => Ae(f, d, u.label),
    principalLabel: u.label,
    rememberPrincipal: u.remember,
    nameError: u.error,
    nameLabels: u.labels
  };
}
function Ve(e) {
  return Object.entries(de(e.properties)).map(([c, u]) => {
    const f = de(u);
    return { key: c, title: typeof f.title == "string" && f.title.trim() ? f.title : me(c), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const $e = (e) => e.type === "array" && de(e.items).type === "string";
function bt(e, c) {
  const u = {};
  for (const f of Ve(e)) {
    const d = c[f.key] ?? f.schema.default, h = f.schema;
    let l = "";
    if (d == null)
      Array.isArray(e.required) && e.required.includes(f.key) && (l = "A value is required.");
    else if (Array.isArray(h.enum) && !h.enum.includes(d)) l = "Choose one of the available values.";
    else if (h.type === "integer" || h.type === "number")
      typeof d != "number" || !Number.isFinite(d) || h.type === "integer" && !Number.isInteger(d) ? l = h.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof h.minimum == "number" && d < h.minimum ? l = `Enter at least ${h.minimum}.` : typeof h.maximum == "number" && d > h.maximum && (l = `Enter at most ${h.maximum}.`);
    else if (h.type === "boolean" && typeof d != "boolean") l = "Choose on or off.";
    else if (h.type === "string") {
      if (typeof d != "string") l = "Enter text.";
      else if (typeof h.minLength == "number" && d.length < h.minLength) l = `Enter at least ${h.minLength} characters.`;
      else if (typeof h.maxLength == "number" && d.length > h.maxLength) l = `Enter at most ${h.maxLength} characters.`;
      else if (typeof h.pattern == "string")
        try {
          new RegExp(h.pattern).test(d) || (l = "Use the required format.");
        } catch {
          l = "The declared format is unavailable.";
        }
    } else if (h.type === "array") {
      if (!Array.isArray(d)) l = "Enter a list.";
      else if (typeof h.maxItems == "number" && d.length > h.maxItems) l = `Use at most ${h.maxItems} entries.`;
      else if (typeof h.minItems == "number" && d.length < h.minItems) l = `Use at least ${h.minItems} entries.`;
      else if (h.uniqueItems && new Set(d).size !== d.length) l = "Remove duplicate entries.";
      else if ($e(h)) {
        const i = de(h.items);
        d.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (l = "Each entry must match the declared text length.");
      }
    } else h.type === "object" && (typeof d != "object" || Array.isArray(d)) && (l = "Enter an object.");
    l && (u[f.key] = l);
  }
  return u;
}
const yt = { class: "work-stack" }, wt = ["inert", "schema", "config"], vt = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, kt = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, Et = { class: "work-config-fields" }, xt = ["for"], _t = {
  key: 1,
  class: "work-config-chips"
}, Ot = {
  key: 6,
  class: "work-muted work-small"
}, Nt = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, Ht = /* @__PURE__ */ he({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: c }) {
    const u = e, f = c, d = q({}), h = q(/* @__PURE__ */ new Set()), l = q(!1), i = q(!1), n = Je(), t = Z(() => Ve(u.schema)), a = Z(() => bt(u.schema, u.modelValue)), o = Z(() => t.value.filter((v) => typeof v.schema.picker == "string")), p = Z(() => t.value.filter((v) => typeof v.schema.picker != "string")), r = Z(() => ({ ...u.schema, properties: Object.fromEntries(o.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(u.schema.required) ? u.schema.required.filter((v) => o.value.some((O) => O.key === v)) : [] })), s = Z(() => Object.fromEntries(o.value.map((v) => [v.key, u.modelValue[v.key]]))), m = Z(() => !Object.keys(a.value).length && !h.value.size && (!o.value.length || l.value));
    le(m, (v) => f("validity", v), { immediate: !0 });
    async function g() {
      i.value = !0, l.value = await lt("wc-schema-form"), i.value = !1;
    }
    le(() => o.value.length > 0, (v) => {
      v && g();
    }, { immediate: !0 }), ve(() => f("validity", !0));
    function _(v, O) {
      const w = { ...u.modelValue };
      O == null ? delete w[v] : w[v] = O, f("update:modelValue", w);
    }
    function T(v) {
      const O = u.modelValue[v];
      return Array.isArray(O) ? O.filter((w) => typeof w == "string") : [];
    }
    function y(v) {
      const O = d.value[v]?.trim();
      O && (_(v, [...T(v), O]), d.value[v] = "");
    }
    function N(v, O) {
      O ? h.value.delete(v) : h.value.add(v);
    }
    function k(v) {
      f("update:modelValue", { ...u.modelValue, ...de(v.detail) });
    }
    return (v, O) => (U(), Y("div", yt, [
      o.value.length && l.value ? (U(), Y("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(r.value),
        config: JSON.stringify(s.value),
        onConfigChanged: k
      }, null, 40, wt)) : o.value.length && i.value ? (U(), Y("p", vt, "The configuration widget is loading.")) : o.value.length ? (U(), Y("p", kt, [
        O[0] || (O[0] = Ce("The configuration widget is unavailable.", -1)),
        ie(B(Qe), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: g
        })
      ])) : ae("", !0),
      re("div", Et, [
        (U(!0), Y(_e, null, Oe(p.value, (w) => (U(), Y("div", {
          key: w.key,
          class: "work-config-field"
        }, [
          re("label", {
            class: "work-config-label",
            for: B(n) + "-" + w.key
          }, Q(w.title), 9, xt),
          Array.isArray(w.schema.enum) ? (U(), X(B(tt), {
            key: 0,
            "input-id": B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            options: w.schema.enum,
            appendTo: "self",
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : B($e)(w.schema) ? (U(), Y("div", _t, [
            (U(!0), Y(_e, null, Oe(T(w.key), (L, A) => (U(), X(B(nt), {
              key: A,
              label: L,
              removable: !e.disabled,
              onRemove: (b) => _(w.key, T(w.key).filter((E, j) => j !== A))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            ie(B(Ne), {
              id: B(n) + "-" + w.key,
              modelValue: d.value[w.key],
              "onUpdate:modelValue": (L) => d.value[w.key] = L,
              "aria-label": "Add " + w.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: He(qe((L) => y(w.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (L) => y(w.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(w.schema.type)) ? (U(), X(B(Ze), {
            key: 2,
            "input-id": B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            "max-fraction-digits": w.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": w.title,
            disabled: e.disabled,
            invalid: !!a.value[w.key],
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : w.schema.type === "boolean" ? (U(), X(B(et), {
            key: 3,
            "input-id": B(n) + "-" + w.key,
            "model-value": !!(e.modelValue[w.key] ?? w.schema.default),
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(w.schema.type)) ? (U(), X(pt, {
            key: 4,
            label: w.title,
            "model-value": e.modelValue[w.key],
            shape: w.schema.type === "array" ? "array" : "object",
            example: w.schema.default ?? (w.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (L) => _(w.key, L),
            onValidity: (L) => N(w.key, L)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (U(), X(B(Ne), {
            key: 5,
            id: B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!a.value[w.key],
            "aria-label": w.title,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          w.description ? (U(), Y("p", Ot, Q(w.description), 1)) : ae("", !0),
          a.value[w.key] ? (U(), Y("p", Nt, Q(a.value[w.key]), 1)) : ae("", !0)
        ]))), 128))
      ])
    ]));
  }
}), jt = ["aria-label", "aria-busy"], qt = /* @__PURE__ */ he({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean },
    returnFocus: {}
  },
  emits: ["close"],
  setup(e, { emit: c }) {
    const u = e, f = c, d = q(null);
    let h = null;
    async function l() {
      await Xe();
      const n = d.value;
      if (n)
        if (u.visible && !n.open) {
          const t = n.getRootNode();
          h = u.returnFocus ?? t.activeElement, n.showModal();
        } else !u.visible && n.open && (n.close(), h?.focus());
    }
    function i(n) {
      n.preventDefault(), u.busy || f("close");
    }
    return le(() => u.visible, l), Ke(l), ve(() => {
      d.value?.open && d.value.close(), h?.focus();
    }), (n, t) => (U(), Y("dialog", {
      ref_key: "dialog",
      ref: d,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && f("close");
      })
    }, [
      Le(n.$slots, "default")
    ], 40, jt));
  }
}), ce = "/api/v1/work", ue = (e) => `${ce}/boards/${encodeURIComponent(e)}`, It = {
  boards: async () => {
    const e = [];
    let c;
    do {
      const u = await ye(`${ce}/boards${c ? "?after=" + encodeURIComponent(c) : ""}`, "Boards");
      e.push(...u.boards), c = u.next;
    } while (c);
    return e;
  },
  packs: () => ye(`${ce}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, c, u, f = {}) => ne(`${ce}/boards`, { title: e, declaration: c, idempotency_key: u, ...f }, "Create board"),
  updateBoard: (e, c) => ne(`${ue(e)}/update`, c, "Update board"),
  schema: (e, c, u) => ne(`${ue(e)}/get_schema`, { generation: c, ...u ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, c) => ne(`${ue(e)}/query`, c, "Item choices"),
  async stateCounts(e) {
    const c = /* @__PURE__ */ Object.create(null);
    let u;
    do {
      const f = await It.query(e, { group_by: "type", sub_group_by: "state", group_after: u, limit: 1 });
      if (f.incomplete || f.reindexing) throw new Error("Counts unavailable");
      for (const d of f.groups ?? []) {
        if (typeof d.value != "string") continue;
        const h = c[d.value] ??= /* @__PURE__ */ Object.create(null);
        for (const l of d.groups ?? []) typeof l.value == "string" && (h[l.value] = l.count);
      }
      u = f.group_after;
    } while (u);
    return c;
  },
  item: (e, c) => ne(`${ue(e)}/get`, { item: c }, "Item choice"),
  options: (e) => ye(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options")
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
const Kt = (function() {
  return (/* @__PURE__ */ (function() {
    function e(c, u, f) {
      function d(i, n) {
        if (!u[i]) {
          if (!c[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (h) return h(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var o = u[i] = { exports: {} };
          c[i][0].call(o.exports, function(p) {
            var r = c[i][1][p];
            return d(r || p);
          }, o, o.exports, e, c, u, f);
        }
        return u[i].exports;
      }
      for (var h = typeof require == "function" && require, l = 0; l < f.length; l++) d(f[l]);
      return d;
    }
    return e;
  })())({ 1: [function(e, c, u) {
    c.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, c, u) {
    let f = e("./greedy-fas"), d = e("./util").uniqueId;
    c.exports = { run: h, undo: i };
    function h(n) {
      (n.graph().acyclicer === "greedy" ? f(n, a(n)) : l(n)).forEach((o) => {
        let p = n.edge(o);
        n.removeEdge(o), p.forwardName = o.name, p.reversed = !0, n.setEdge(o.w, o.v, p, d("rev"));
      });
      function a(o) {
        return (p) => o.edge(p).weight;
      }
    }
    function l(n) {
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
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, c, u) {
    let f = e("./util");
    c.exports = d;
    function d(l) {
      function i(n) {
        let t = l.children(n), a = l.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(a, "minRank")) {
          a.borderLeft = [], a.borderRight = [];
          for (let o = a.minRank, p = a.maxRank + 1; o < p; ++o)
            h(l, "borderLeft", "_bl", n, a, o), h(l, "borderRight", "_br", n, a, o);
        }
      }
      l.children().forEach(i);
    }
    function h(l, i, n, t, a, o) {
      let p = { width: 0, height: 0, rank: o, borderType: i }, r = a[i][o - 1], s = f.addDummyNode(l, "border", p, n);
      a[i][o] = s, l.setParent(s, t), r && l.setEdge(r, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, c, u) {
    c.exports = { adjust: f, undo: d };
    function f(o) {
      let p = o.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && h(o);
    }
    function d(o) {
      let p = o.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(o), (p === "lr" || p === "rl") && (t(o), h(o));
    }
    function h(o) {
      o.nodes().forEach((p) => l(o.node(p))), o.edges().forEach((p) => l(o.edge(p)));
    }
    function l(o) {
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
  }, {}], 5: [function(e, c, u) {
    class f {
      constructor() {
        let i = {};
        i._next = i._prev = i, this._sentinel = i;
      }
      dequeue() {
        let i = this._sentinel, n = i._prev;
        if (n !== i)
          return d(n), n;
      }
      enqueue(i) {
        let n = this._sentinel;
        i._prev && i._next && d(i), i._next = n._next, n._next._prev = i, n._next = i, i._prev = n;
      }
      toString() {
        let i = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          i.push(JSON.stringify(t, h)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function d(l) {
      l._prev._next = l._next, l._next._prev = l._prev, delete l._next, delete l._prev;
    }
    function h(l, i) {
      if (l !== "_next" && l !== "_prev")
        return i;
    }
    c.exports = f;
  }, {}], 6: [function(e, c, u) {
    let f = e("./util"), d = e("@dagrejs/graphlib").Graph;
    c.exports = { debugOrdering: h };
    function h(l) {
      let i = f.buildLayerMatrix(l), n = new d({ compound: !0, multigraph: !0 }).setGraph({});
      return l.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + l.node(t).rank);
      }), l.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, a) => {
        let o = "layer" + a;
        n.setNode(o, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, c, u) {
    let f = e("@dagrejs/graphlib").Graph, d = e("./data/list");
    c.exports = l;
    let h = () => 1;
    function l(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let s = t(p, r || h);
      return i(s.graph, s.buckets, s.zeroIdx).flatMap((g) => p.outEdges(g.v, g.w));
    }
    function i(p, r, s) {
      let m = [], g = r[r.length - 1], _ = r[0], T;
      for (; p.nodeCount(); ) {
        for (; T = _.dequeue(); )
          n(p, r, s, T);
        for (; T = g.dequeue(); )
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
    function n(p, r, s, m, g) {
      let _ = g ? [] : void 0;
      return p.inEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = p.node(T.v);
        g && _.push({ v: T.v, w: T.w }), N.out -= y, a(r, s, N);
      }), p.outEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = T.w, k = p.node(N);
        k.in -= y, a(r, s, k);
      }), p.removeNode(m.v), _;
    }
    function t(p, r) {
      let s = new f(), m = 0, g = 0;
      p.nodes().forEach((y) => {
        s.setNode(y, { v: y, in: 0, out: 0 });
      }), p.edges().forEach((y) => {
        let N = s.edge(y.v, y.w) || 0, k = r(y), v = N + k;
        s.setEdge(y.v, y.w, v), g = Math.max(g, s.node(y.v).out += k), m = Math.max(m, s.node(y.w).in += k);
      });
      let _ = o(g + m + 3).map(() => new d()), T = m + 1;
      return s.nodes().forEach((y) => {
        a(_, T, s.node(y));
      }), { graph: s, buckets: _, zeroIdx: T };
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
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, c, u) {
    let f = e("./acyclic"), d = e("./normalize"), h = e("./rank"), l = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), a = e("./add-border-segments"), o = e("./coordinate-system"), p = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    c.exports = g;
    function g(x, I) {
      let M = I && I.debugTiming ? s.time : s.notime;
      M("layout", () => {
        let R = M("  buildLayoutGraph", () => b(x));
        M("  runLayout", () => _(R, M, I)), M("  updateInputGraph", () => T(x, R));
      });
    }
    function _(x, I, M) {
      I("    makeSpaceForEdgeLabels", () => E(x)), I("    removeSelfEdges", () => Ge(x)), I("    acyclic", () => f.run(x)), I("    nestingGraph.run", () => t.run(x)), I("    rank", () => h(s.asNonCompoundGraph(x))), I("    injectEdgeLabelProxies", () => j(x)), I("    removeEmptyRanks", () => n(x)), I("    nestingGraph.cleanup", () => t.cleanup(x)), I("    normalizeRanks", () => l(x)), I("    assignRankMinMax", () => C(x)), I("    removeEdgeLabelProxies", () => S(x)), I("    normalize.run", () => d.run(x)), I("    parentDummyChains", () => i(x)), I("    addBorderSegments", () => a(x)), I("    order", () => p(x, M)), I("    insertSelfEdges", () => Ue(x)), I("    adjustCoordinateSystem", () => o.adjust(x)), I("    position", () => r(x)), I("    positionSelfEdges", () => Be(x)), I("    removeBorderNodes", () => K(x)), I("    normalize.undo", () => d.undo(x)), I("    fixupEdgeLabelCoords", () => F(x)), I("    undoCoordinateSystem", () => o.undo(x)), I("    translateGraph", () => V(x)), I("    assignNodeIntersects", () => $(x)), I("    reversePoints", () => H(x)), I("    acyclic.undo", () => f.undo(x));
    }
    function T(x, I) {
      x.nodes().forEach((M) => {
        let R = x.node(M), P = I.node(M);
        R && (R.x = P.x, R.y = P.y, R.rank = P.rank, I.children(M).length && (R.width = P.width, R.height = P.height));
      }), x.edges().forEach((M) => {
        let R = x.edge(M), P = I.edge(M);
        R.points = P.points, Object.hasOwn(P, "x") && (R.x = P.x, R.y = P.y);
      }), x.graph().width = I.graph().width, x.graph().height = I.graph().height;
    }
    let y = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], v = ["width", "height", "rank"], O = { width: 0, height: 0 }, w = ["minlen", "weight", "width", "height", "labeloffset"], L = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, A = ["labelpos"];
    function b(x) {
      let I = new m({ multigraph: !0, compound: !0 }), M = be(x.graph());
      return I.setGraph(Object.assign({}, N, ge(M, y), s.pick(M, k))), x.nodes().forEach((R) => {
        let P = be(x.node(R));
        const D = ge(P, v);
        Object.keys(O).forEach((G) => {
          D[G] === void 0 && (D[G] = O[G]);
        }), I.setNode(R, D), I.setParent(R, x.parent(R));
      }), x.edges().forEach((R) => {
        let P = be(x.edge(R));
        I.setEdge(R, Object.assign({}, L, ge(P, w), s.pick(P, A)));
      }), I;
    }
    function E(x) {
      let I = x.graph();
      I.ranksep /= 2, x.edges().forEach((M) => {
        let R = x.edge(M);
        R.minlen *= 2, R.labelpos.toLowerCase() !== "c" && (I.rankdir === "TB" || I.rankdir === "BT" ? R.width += R.labeloffset : R.height += R.labeloffset);
      });
    }
    function j(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I);
        if (M.width && M.height) {
          let R = x.node(I.v), D = { rank: (x.node(I.w).rank - R.rank) / 2 + R.rank, e: I };
          s.addDummyNode(x, "edge-proxy", D, "_ep");
        }
      });
    }
    function C(x) {
      let I = 0;
      x.nodes().forEach((M) => {
        let R = x.node(M);
        R.borderTop && (R.minRank = x.node(R.borderTop).rank, R.maxRank = x.node(R.borderBottom).rank, I = Math.max(I, R.maxRank));
      }), x.graph().maxRank = I;
    }
    function S(x) {
      x.nodes().forEach((I) => {
        let M = x.node(I);
        M.dummy === "edge-proxy" && (x.edge(M.e).labelRank = M.rank, x.removeNode(I));
      });
    }
    function V(x) {
      let I = Number.POSITIVE_INFINITY, M = 0, R = Number.POSITIVE_INFINITY, P = 0, D = x.graph(), G = D.marginx || 0, z = D.marginy || 0;
      function ke(J) {
        let W = J.x, se = J.y, Ee = J.width, xe = J.height;
        I = Math.min(I, W - Ee / 2), M = Math.max(M, W + Ee / 2), R = Math.min(R, se - xe / 2), P = Math.max(P, se + xe / 2);
      }
      x.nodes().forEach((J) => ke(x.node(J))), x.edges().forEach((J) => {
        let W = x.edge(J);
        Object.hasOwn(W, "x") && ke(W);
      }), I -= G, R -= z, x.nodes().forEach((J) => {
        let W = x.node(J);
        W.x -= I, W.y -= R;
      }), x.edges().forEach((J) => {
        let W = x.edge(J);
        W.points.forEach((se) => {
          se.x -= I, se.y -= R;
        }), Object.hasOwn(W, "x") && (W.x -= I), Object.hasOwn(W, "y") && (W.y -= R);
      }), D.width = M - I + G, D.height = P - R + z;
    }
    function $(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I), R = x.node(I.v), P = x.node(I.w), D, G;
        M.points ? (D = M.points[0], G = M.points[M.points.length - 1]) : (M.points = [], D = P, G = R), M.points.unshift(s.intersectRect(R, D)), M.points.push(s.intersectRect(P, G));
      });
    }
    function F(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I);
        if (Object.hasOwn(M, "x"))
          switch ((M.labelpos === "l" || M.labelpos === "r") && (M.width -= M.labeloffset), M.labelpos) {
            case "l":
              M.x -= M.width / 2 + M.labeloffset;
              break;
            case "r":
              M.x += M.width / 2 + M.labeloffset;
              break;
          }
      });
    }
    function H(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I);
        M.reversed && M.points.reverse();
      });
    }
    function K(x) {
      x.nodes().forEach((I) => {
        if (x.children(I).length) {
          let M = x.node(I), R = x.node(M.borderTop), P = x.node(M.borderBottom), D = x.node(M.borderLeft[M.borderLeft.length - 1]), G = x.node(M.borderRight[M.borderRight.length - 1]);
          M.width = Math.abs(G.x - D.x), M.height = Math.abs(P.y - R.y), M.x = D.x + M.width / 2, M.y = R.y + M.height / 2;
        }
      }), x.nodes().forEach((I) => {
        x.node(I).dummy === "border" && x.removeNode(I);
      });
    }
    function Ge(x) {
      x.edges().forEach((I) => {
        if (I.v === I.w) {
          var M = x.node(I.v);
          M.selfEdges || (M.selfEdges = []), M.selfEdges.push({ e: I, label: x.edge(I) }), x.removeEdge(I);
        }
      });
    }
    function Ue(x) {
      var I = s.buildLayerMatrix(x);
      I.forEach((M) => {
        var R = 0;
        M.forEach((P, D) => {
          var G = x.node(P);
          G.order = D + R, (G.selfEdges || []).forEach((z) => {
            s.addDummyNode(x, "selfedge", { width: z.label.width, height: z.label.height, rank: G.rank, order: D + ++R, e: z.e, label: z.label }, "_se");
          }), delete G.selfEdges;
        });
      });
    }
    function Be(x) {
      x.nodes().forEach((I) => {
        var M = x.node(I);
        if (M.dummy === "selfedge") {
          var R = x.node(M.e.v), P = R.x + R.width / 2, D = R.y, G = M.x - P, z = R.height / 2;
          x.setEdge(M.e, M.label), x.removeNode(I), M.label.points = [{ x: P + 2 * G / 3, y: D - z }, { x: P + 5 * G / 6, y: D - z }, { x: P + G, y: D }, { x: P + 5 * G / 6, y: D + z }, { x: P + 2 * G / 3, y: D + z }], M.label.x = M.x, M.label.y = M.y;
        }
      });
    }
    function ge(x, I) {
      return s.mapValues(s.pick(x, I), Number);
    }
    function be(x) {
      var I = {};
      return x && Object.entries(x).forEach(([M, R]) => {
        typeof M == "string" && (M = M.toLowerCase()), I[M] = R;
      }), I;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, c, u) {
    let f = e("./util");
    c.exports = { run: d, cleanup: n };
    function d(t) {
      let a = f.addDummyNode(t, "root", {}, "_root"), o = l(t), p = Object.values(o), r = f.applyWithChunking(Math.max, p) - 1, s = 2 * r + 1;
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
      let _ = f.addBorderNode(t, "_bt"), T = f.addBorderNode(t, "_bb"), y = t.node(m);
      t.setParent(_, m), y.borderTop = _, t.setParent(T, m), y.borderBottom = T, g.forEach((N) => {
        h(t, a, o, p, r, s, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, w = k.borderTop ? p : 2 * p, L = v !== O ? 1 : r - s[m] + 1;
        t.setEdge(_, v, { weight: w, minlen: L, nestingEdge: !0 }), t.setEdge(O, T, { weight: w, minlen: L, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(a, _, { weight: 0, minlen: r + s[m] });
    }
    function l(t) {
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
  }, { "./util": 27 }], 10: [function(e, c, u) {
    let f = e("./util");
    c.exports = { run: d, undo: l };
    function d(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => h(i, n));
    }
    function h(i, n) {
      let t = n.v, a = i.node(t).rank, o = n.w, p = i.node(o).rank, r = n.name, s = i.edge(n), m = s.labelRank;
      if (p === a + 1) return;
      i.removeEdge(n);
      let g, _, T;
      for (T = 0, ++a; a < p; ++T, ++a)
        s.points = [], _ = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: a }, g = f.addDummyNode(i, "edge", _, "_d"), a === m && (_.width = s.width, _.height = s.height, _.dummy = "edge-label", _.labelpos = s.labelpos), i.setEdge(t, g, { weight: s.weight }, r), T === 0 && i.graph().dummyChains.push(g), t = g;
      i.setEdge(t, o, { weight: s.weight }, r);
    }
    function l(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), a = t.edgeLabel, o;
        for (i.setEdge(t.edgeObj, a); t.dummy; )
          o = i.successors(n)[0], i.removeNode(n), a.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (a.x = t.x, a.y = t.y, a.width = t.width, a.height = t.height), n = o, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, c, u) {
    c.exports = f;
    function f(d, h, l) {
      let i = {}, n;
      l.forEach((t) => {
        let a = d.parent(t), o, p;
        for (; a; ) {
          if (o = d.parent(a), o ? (p = i[o], i[o] = a) : (p = n, n = a), p && p !== a) {
            h.setEdge(p, a);
            return;
          }
          a = o;
        }
      });
    }
  }, {}], 12: [function(e, c, u) {
    c.exports = f;
    function f(d, h = []) {
      return h.map((l) => {
        let i = d.inEdges(l);
        if (i.length) {
          let n = i.reduce((t, a) => {
            let o = d.edge(a), p = d.node(a.v);
            return { sum: t.sum + o.weight * p.order, weight: t.weight + o.weight };
          }, { sum: 0, weight: 0 });
          return { v: l, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: l };
      });
    }
  }, {}], 13: [function(e, c, u) {
    let f = e("@dagrejs/graphlib").Graph, d = e("../util");
    c.exports = h;
    function h(i, n, t, a) {
      a || (a = i.nodes());
      let o = l(i), p = new f({ compound: !0 }).setGraph({ root: o }).setDefaultNodeLabel((r) => i.node(r));
      return a.forEach((r) => {
        let s = i.node(r), m = i.parent(r);
        (s.rank === n || s.minRank <= n && n <= s.maxRank) && (p.setNode(r), p.setParent(r, m || o), i[t](r).forEach((g) => {
          let _ = g.v === r ? g.w : g.v, T = p.edge(_, r), y = T !== void 0 ? T.weight : 0;
          p.setEdge(_, r, { weight: i.edge(g).weight + y });
        }), Object.hasOwn(s, "minRank") && p.setNode(r, { borderLeft: s.borderLeft[n], borderRight: s.borderRight[n] }));
      }), p;
    }
    function l(i) {
      for (var n; i.hasNode(n = d.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, c, u) {
    let f = e("../util").zipObject;
    c.exports = d;
    function d(l, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += h(l, i[t - 1], i[t]);
      return n;
    }
    function h(l, i, n) {
      let t = f(n, n.map((m, g) => g)), a = i.flatMap((m) => l.outEdges(m).map((g) => ({ pos: t[g.w], weight: l.edge(g).weight })).sort((g, _) => g.pos - _.pos)), o = 1;
      for (; o < n.length; ) o <<= 1;
      let p = 2 * o - 1;
      o -= 1;
      let r = new Array(p).fill(0), s = 0;
      return a.forEach((m) => {
        let g = m.pos + o;
        r[g] += m.weight;
        let _ = 0;
        for (; g > 0; )
          g % 2 && (_ += r[g + 1]), g = g - 1 >> 1, r[g] += m.weight;
        s += m.weight * _;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, c, u) {
    let f = e("./init-order"), d = e("./cross-count"), h = e("./sort-subgraph"), l = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    c.exports = a;
    function a(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, a);
        return;
      }
      let g = t.maxRank(s), _ = o(s, t.range(1, g + 1), "inEdges"), T = o(s, t.range(g - 1, -1, -1), "outEdges"), y = f(s);
      if (r(s, y), m && m.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let v = 0, O = 0; O < 4; ++v, ++O) {
        p(v % 2 ? _ : T, v % 4 >= 2), y = t.buildLayerMatrix(s);
        let w = d(s, y);
        w < N && (O = 0, k = Object.assign({}, y), N = w);
      }
      r(s, k);
    }
    function o(s, m, g) {
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
        return l(s, y, g, _.get(y) || []);
      });
    }
    function p(s, m) {
      let g = new n();
      s.forEach(function(_) {
        let T = _.graph().root, y = h(_, T, g, m);
        y.vs.forEach((N, k) => _.node(N).order = k), i(_, g, y.vs);
      });
    }
    function r(s, m) {
      Object.values(m).forEach((g) => g.forEach((_, T) => s.node(_).order = T));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, c, u) {
    let f = e("../util");
    c.exports = d;
    function d(h) {
      let l = {}, i = h.nodes().filter((r) => !h.children(r).length), n = i.map((r) => h.node(r).rank), t = f.applyWithChunking(Math.max, n), a = f.range(t + 1).map(() => []);
      function o(r) {
        if (l[r]) return;
        l[r] = !0;
        let s = h.node(r);
        a[s.rank].push(r), h.successors(r).forEach(o);
      }
      return i.sort((r, s) => h.node(r).rank - h.node(s).rank).forEach(o), a;
    }
  }, { "../util": 27 }], 17: [function(e, c, u) {
    let f = e("../util");
    c.exports = d;
    function d(i, n) {
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
          p.merged || (p.barycenter === void 0 || o.barycenter === void 0 || p.barycenter >= o.barycenter) && l(o, p);
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
    function l(i, n) {
      let t = 0, a = 0;
      i.weight && (t += i.barycenter * i.weight, a += i.weight), n.weight && (t += n.barycenter * n.weight, a += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / a, i.weight = a, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, c, u) {
    let f = e("./barycenter"), d = e("./resolve-conflicts"), h = e("./sort");
    c.exports = l;
    function l(t, a, o, p) {
      let r = t.children(a), s = t.node(a), m = s ? s.borderLeft : void 0, g = s ? s.borderRight : void 0, _ = {};
      m && (r = r.filter((k) => k !== m && k !== g));
      let T = f(t, r);
      T.forEach((k) => {
        if (t.children(k.v).length) {
          let v = l(t, k.v, o, p);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let y = d(T, o);
      i(y, _);
      let N = h(y, p);
      if (m && (N.vs = [m, N.vs, g].flat(!0), t.predecessors(m).length)) {
        let k = t.node(t.predecessors(m)[0]), v = t.node(t.predecessors(g)[0]);
        Object.hasOwn(N, "barycenter") || (N.barycenter = 0, N.weight = 0), N.barycenter = (N.barycenter * N.weight + k.order + v.order) / (N.weight + 2), N.weight += 2;
      }
      return N;
    }
    function i(t, a) {
      t.forEach((o) => {
        o.vs = o.vs.flatMap((p) => a[p] ? a[p].vs : p);
      });
    }
    function n(t, a) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + a.barycenter * a.weight) / (t.weight + a.weight), t.weight += a.weight) : (t.barycenter = a.barycenter, t.weight = a.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, c, u) {
    let f = e("../util");
    c.exports = d;
    function d(i, n) {
      let t = f.partition(i, (_) => Object.hasOwn(_, "barycenter")), a = t.lhs, o = t.rhs.sort((_, T) => T.i - _.i), p = [], r = 0, s = 0, m = 0;
      a.sort(l(!!n)), m = h(p, o, m), a.forEach((_) => {
        m += _.vs.length, p.push(_.vs), r += _.barycenter * _.weight, s += _.weight, m = h(p, o, m);
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
    function l(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, c, u) {
    c.exports = f;
    function f(l) {
      let i = h(l);
      l.graph().dummyChains.forEach((n) => {
        let t = l.node(n), a = t.edgeObj, o = d(l, i, a.v, a.w), p = o.path, r = o.lca, s = 0, m = p[s], g = !0;
        for (; n !== a.w; ) {
          if (t = l.node(n), g) {
            for (; (m = p[s]) !== r && l.node(m).maxRank < t.rank; )
              s++;
            m === r && (g = !1);
          }
          if (!g) {
            for (; s < p.length - 1 && l.node(m = p[s + 1]).minRank <= t.rank; )
              s++;
            m = p[s];
          }
          l.setParent(n, m), n = l.successors(n)[0];
        }
      });
    }
    function d(l, i, n, t) {
      let a = [], o = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), s, m;
      s = n;
      do
        s = l.parent(s), a.push(s);
      while (s && (i[s].low > p || r > i[s].lim));
      for (m = s, s = t; (s = l.parent(s)) !== m; )
        o.push(s);
      return { path: a.concat(o.reverse()), lca: m };
    }
    function h(l) {
      let i = {}, n = 0;
      function t(a) {
        let o = n;
        l.children(a).forEach(t), i[a] = { low: o, lim: n++ };
      }
      return l.children().forEach(t), i;
    }
  }, {}], 21: [function(e, c, u) {
    let f = e("@dagrejs/graphlib").Graph, d = e("../util");
    c.exports = { positionX: g, findType1Conflicts: h, findType2Conflicts: l, addConflict: n, hasConflict: t, verticalAlignment: a, horizontalCompaction: o, alignCoordinates: s, findSmallestWidthAlignment: r, balance: m };
    function h(y, N) {
      let k = {};
      function v(O, w) {
        let L = 0, A = 0, b = O.length, E = w[w.length - 1];
        return w.forEach((j, C) => {
          let S = i(y, j), V = S ? y.node(S).order : b;
          (S || j === E) && (w.slice(A, C + 1).forEach(($) => {
            y.predecessors($).forEach((F) => {
              let H = y.node(F), K = H.order;
              (K < L || V < K) && !(H.dummy && y.node($).dummy) && n(k, F, $);
            });
          }), A = C + 1, L = V);
        }), w;
      }
      return N.length && N.reduce(v), k;
    }
    function l(y, N) {
      let k = {};
      function v(w, L, A, b, E) {
        let j;
        d.range(L, A).forEach((C) => {
          j = w[C], y.node(j).dummy && y.predecessors(j).forEach((S) => {
            let V = y.node(S);
            V.dummy && (V.order < b || V.order > E) && n(k, S, j);
          });
        });
      }
      function O(w, L) {
        let A = -1, b, E = 0;
        return L.forEach((j, C) => {
          if (y.node(j).dummy === "border") {
            let S = y.predecessors(j);
            S.length && (b = y.node(S[0]).order, v(L, E, C, A, b), E = C, A = b);
          }
          v(L, E, L.length, b, w.length);
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
    function a(y, N, k, v) {
      let O = {}, w = {}, L = {};
      return N.forEach((A) => {
        A.forEach((b, E) => {
          O[b] = b, w[b] = b, L[b] = E;
        });
      }), N.forEach((A) => {
        let b = -1;
        A.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((S, V) => L[S] - L[V]);
            let C = (j.length - 1) / 2;
            for (let S = Math.floor(C), V = Math.ceil(C); S <= V; ++S) {
              let $ = j[S];
              w[E] === E && b < L[$] && !t(k, E, $) && (w[$] = E, w[E] = O[E] = O[$], b = L[$]);
            }
          }
        });
      }), { root: O, align: w };
    }
    function o(y, N, k, v, O) {
      let w = {}, L = p(y, N, k, O), A = O ? "borderLeft" : "borderRight";
      function b(C, S) {
        let V = L.nodes(), $ = V.pop(), F = {};
        for (; $; )
          F[$] ? C($) : (F[$] = !0, V.push($), V = V.concat(S($))), $ = V.pop();
      }
      function E(C) {
        w[C] = L.inEdges(C).reduce((S, V) => Math.max(S, w[V.v] + L.edge(V)), 0);
      }
      function j(C) {
        let S = L.outEdges(C).reduce(($, F) => Math.min($, w[F.w] - L.edge(F)), Number.POSITIVE_INFINITY), V = y.node(C);
        S !== Number.POSITIVE_INFINITY && V.borderType !== A && (w[C] = Math.max(w[C], S));
      }
      return b(E, L.predecessors.bind(L)), b(j, L.successors.bind(L)), Object.keys(v).forEach((C) => w[C] = w[k[C]]), w;
    }
    function p(y, N, k, v) {
      let O = new f(), w = y.graph(), L = _(w.nodesep, w.edgesep, v);
      return N.forEach((A) => {
        let b;
        A.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), b) {
            var C = k[b], S = O.edge(C, j);
            O.setEdge(C, j, Math.max(L(y, E, b), S || 0));
          }
          b = E;
        });
      }), O;
    }
    function r(y, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, w = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([A, b]) => {
          let E = T(y, A) / 2;
          O = Math.max(b + E, O), w = Math.min(b - E, w);
        });
        const L = O - w;
        return L < k[0] && (k = [L, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(y, N) {
      let k = Object.values(N), v = d.applyWithChunking(Math.min, k), O = d.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((w) => {
        ["l", "r"].forEach((L) => {
          let A = w + L, b = y[A];
          if (b === N) return;
          let E = Object.values(b), j = v - d.applyWithChunking(Math.min, E);
          L !== "l" && (j = O - d.applyWithChunking(Math.max, E)), j && (y[A] = d.mapValues(b, (C) => C + j));
        });
      });
    }
    function m(y, N) {
      return d.mapValues(y.ul, (k, v) => {
        if (N)
          return y[N.toLowerCase()][v];
        {
          let O = Object.values(y).map((w) => w[v]).sort((w, L) => w - L);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function g(y) {
      let N = d.buildLayerMatrix(y), k = Object.assign(h(y, N), l(y, N)), v = {}, O;
      ["u", "d"].forEach((L) => {
        O = L === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((A) => {
          A === "r" && (O = O.map((C) => Object.values(C).reverse()));
          let b = (L === "u" ? y.predecessors : y.successors).bind(y), E = a(y, O, k, b), j = o(y, O, E.root, E.align, A === "r");
          A === "r" && (j = d.mapValues(j, (C) => -C)), v[L + A] = j;
        });
      });
      let w = r(y, v);
      return s(v, w), m(v, y.graph().align);
    }
    function _(y, N, k) {
      return (v, O, w) => {
        let L = v.node(O), A = v.node(w), b = 0, E;
        if (b += L.width / 2, Object.hasOwn(L, "labelpos"))
          switch (L.labelpos.toLowerCase()) {
            case "l":
              E = -L.width / 2;
              break;
            case "r":
              E = L.width / 2;
              break;
          }
        if (E && (b += k ? E : -E), E = 0, b += (L.dummy ? N : y) / 2, b += (A.dummy ? N : y) / 2, b += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              E = A.width / 2;
              break;
            case "r":
              E = -A.width / 2;
              break;
          }
        return E && (b += k ? E : -E), E = 0, b;
      };
    }
    function T(y, N) {
      return y.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, c, u) {
    let f = e("../util"), d = e("./bk").positionX;
    c.exports = h;
    function h(i) {
      i = f.asNonCompoundGraph(i), l(i), Object.entries(d(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function l(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, a = 0;
      n.forEach((o) => {
        const p = o.reduce((r, s) => {
          const m = i.node(s).height;
          return r > m ? r : m;
        }, 0);
        o.forEach((r) => i.node(r).y = a + p / 2), a += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, c, u) {
    var f = e("@dagrejs/graphlib").Graph, d = e("./util").slack;
    c.exports = h;
    function h(t) {
      var a = new f({ directed: !1 }), o = t.nodes()[0], p = t.nodeCount();
      a.setNode(o, {});
      for (var r, s; l(a, t) < p; )
        r = i(a, t), s = a.hasNode(r.v) ? d(t, r) : -d(t, r), n(a, t, s);
      return a;
    }
    function l(t, a) {
      function o(p) {
        a.nodeEdges(p).forEach((r) => {
          var s = r.v, m = p === s ? r.w : s;
          !t.hasNode(m) && !d(a, r) && (t.setNode(m, {}), t.setEdge(p, m, {}), o(m));
        });
      }
      return t.nodes().forEach(o), t.nodeCount();
    }
    function i(t, a) {
      return a.edges().reduce((p, r) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (s = d(a, r)), s < p[0] ? [s, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, a, o) {
      t.nodes().forEach((p) => a.node(p).rank += o);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, c, u) {
    var f = e("./util"), d = f.longestPath, h = e("./feasible-tree"), l = e("./network-simplex");
    c.exports = i;
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
    var n = d;
    function t(o) {
      d(o), h(o);
    }
    function a(o) {
      l(o);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, c, u) {
    var f = e("./feasible-tree"), d = e("./util").slack, h = e("./util").longestPath, l = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    c.exports = t, t.initLowLimValues = r, t.initCutValues = a, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = _;
    function t(k) {
      k = n(k), h(k);
      var v = f(k);
      r(v), a(v, k);
      for (var O, w; O = m(v); )
        w = g(v, k, O), _(v, k, O, w);
    }
    function a(k, v) {
      var O = i(k, k.nodes());
      O = O.slice(0, O.length - 1), O.forEach((w) => o(k, v, w));
    }
    function o(k, v, O) {
      var w = k.node(O), L = w.parent;
      k.edge(O, L).cutvalue = p(k, v, O);
    }
    function p(k, v, O) {
      var w = k.node(O), L = w.parent, A = !0, b = v.edge(O, L), E = 0;
      return b || (A = !1, b = v.edge(L, O)), E = b.weight, v.nodeEdges(O).forEach((j) => {
        var C = j.v === O, S = C ? j.w : j.v;
        if (S !== L) {
          var V = C === A, $ = v.edge(j).weight;
          if (E += V ? $ : -$, y(k, O, S)) {
            var F = k.edge(O, S).cutvalue;
            E += V ? -F : F;
          }
        }
      }), E;
    }
    function r(k, v) {
      arguments.length < 2 && (v = k.nodes()[0]), s(k, {}, 1, v);
    }
    function s(k, v, O, w, L) {
      var A = O, b = k.node(w);
      return v[w] = !0, k.neighbors(w).forEach((E) => {
        Object.hasOwn(v, E) || (O = s(k, v, O, E, w));
      }), b.low = A, b.lim = O++, L ? b.parent = L : delete b.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function g(k, v, O) {
      var w = O.v, L = O.w;
      v.hasEdge(w, L) || (w = O.w, L = O.v);
      var A = k.node(w), b = k.node(L), E = A, j = !1;
      A.lim > b.lim && (E = b, j = !0);
      var C = v.edges().filter((S) => j === N(k, k.node(S.v), E) && j !== N(k, k.node(S.w), E));
      return C.reduce((S, V) => d(v, V) < d(v, S) ? V : S);
    }
    function _(k, v, O, w) {
      var L = O.v, A = O.w;
      k.removeEdge(L, A), k.setEdge(w.v, w.w, {}), r(k), a(k, v), T(k, v);
    }
    function T(k, v) {
      var O = k.nodes().find((L) => !v.node(L).parent), w = l(k, O);
      w = w.slice(1), w.forEach((L) => {
        var A = k.node(L).parent, b = v.edge(L, A), E = !1;
        b || (b = v.edge(A, L), E = !0), v.node(L).rank = v.node(A).rank + (E ? b.minlen : -b.minlen);
      });
    }
    function y(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, c, u) {
    const { applyWithChunking: f } = e("../util");
    c.exports = { longestPath: d, slack: h };
    function d(l) {
      var i = {};
      function n(t) {
        var a = l.node(t);
        if (Object.hasOwn(i, t))
          return a.rank;
        i[t] = !0;
        let o = l.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - l.edge(r).minlen);
        var p = f(Math.min, o);
        return p === Number.POSITIVE_INFINITY && (p = 0), a.rank = p;
      }
      l.sources().forEach(n);
    }
    function h(l, i) {
      return l.node(i.w).rank - l.node(i.v).rank - l.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, c, u) {
    let f = e("@dagrejs/graphlib").Graph;
    c.exports = { addBorderNode: r, addDummyNode: d, applyWithChunking: g, asNonCompoundGraph: l, buildLayerMatrix: a, intersectRect: t, mapValues: L, maxRank: _, normalizeRanks: o, notime: N, partition: T, pick: w, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: h, successorWeights: i, time: y, uniqueId: v, zipObject: A };
    function d(b, E, j, C) {
      for (var S = C; b.hasNode(S); )
        S = v(C);
      return j.dummy = E, b.setNode(S, j), S;
    }
    function h(b) {
      let E = new f().setGraph(b.graph());
      return b.nodes().forEach((j) => E.setNode(j, b.node(j))), b.edges().forEach((j) => {
        let C = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, S = b.edge(j);
        E.setEdge(j.v, j.w, { weight: C.weight + S.weight, minlen: Math.max(C.minlen, S.minlen) });
      }), E;
    }
    function l(b) {
      let E = new f({ multigraph: b.isMultigraph() }).setGraph(b.graph());
      return b.nodes().forEach((j) => {
        b.children(j).length || E.setNode(j, b.node(j));
      }), b.edges().forEach((j) => {
        E.setEdge(j, b.edge(j));
      }), E;
    }
    function i(b) {
      let E = b.nodes().map((j) => {
        let C = {};
        return b.outEdges(j).forEach((S) => {
          C[S.w] = (C[S.w] || 0) + b.edge(S).weight;
        }), C;
      });
      return A(b.nodes(), E);
    }
    function n(b) {
      let E = b.nodes().map((j) => {
        let C = {};
        return b.inEdges(j).forEach((S) => {
          C[S.v] = (C[S.v] || 0) + b.edge(S).weight;
        }), C;
      });
      return A(b.nodes(), E);
    }
    function t(b, E) {
      let j = b.x, C = b.y, S = E.x - j, V = E.y - C, $ = b.width / 2, F = b.height / 2;
      if (!S && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, K;
      return Math.abs(V) * $ > Math.abs(S) * F ? (V < 0 && (F = -F), H = F * S / V, K = F) : (S < 0 && ($ = -$), H = $, K = $ * V / S), { x: j + H, y: C + K };
    }
    function a(b) {
      let E = O(_(b) + 1).map(() => []);
      return b.nodes().forEach((j) => {
        let C = b.node(j), S = C.rank;
        S !== void 0 && (E[S][C.order] = j);
      }), E;
    }
    function o(b) {
      let E = b.nodes().map((C) => {
        let S = b.node(C).rank;
        return S === void 0 ? Number.MAX_VALUE : S;
      }), j = g(Math.min, E);
      b.nodes().forEach((C) => {
        let S = b.node(C);
        Object.hasOwn(S, "rank") && (S.rank -= j);
      });
    }
    function p(b) {
      let E = b.nodes().map(($) => b.node($).rank), j = g(Math.min, E), C = [];
      b.nodes().forEach(($) => {
        let F = b.node($).rank - j;
        C[F] || (C[F] = []), C[F].push($);
      });
      let S = 0, V = b.graph().nodeRankFactor;
      Array.from(C).forEach(($, F) => {
        $ === void 0 && F % V !== 0 ? --S : $ !== void 0 && S && $.forEach((H) => b.node(H).rank += S);
      });
    }
    function r(b, E, j, C) {
      let S = { width: 0, height: 0 };
      return arguments.length >= 4 && (S.rank = j, S.order = C), d(b, "border", S, E);
    }
    function s(b, E = m) {
      const j = [];
      for (let C = 0; C < b.length; C += E) {
        const S = b.slice(C, C + E);
        j.push(S);
      }
      return j;
    }
    const m = 65535;
    function g(b, E) {
      if (E.length > m) {
        const j = s(E);
        return b.apply(null, j.map((C) => b.apply(null, C)));
      } else
        return b.apply(null, E);
    }
    function _(b) {
      const j = b.nodes().map((C) => {
        let S = b.node(C).rank;
        return S === void 0 ? Number.MIN_VALUE : S;
      });
      return g(Math.max, j);
    }
    function T(b, E) {
      let j = { lhs: [], rhs: [] };
      return b.forEach((C) => {
        E(C) ? j.lhs.push(C) : j.rhs.push(C);
      }), j;
    }
    function y(b, E) {
      let j = Date.now();
      try {
        return E();
      } finally {
        console.log(b + " time: " + (Date.now() - j) + "ms");
      }
    }
    function N(b, E) {
      return E();
    }
    let k = 0;
    function v(b) {
      var E = ++k;
      return b + ("" + E);
    }
    function O(b, E, j = 1) {
      E == null && (E = b, b = 0);
      let C = (V) => V < E;
      j < 0 && (C = (V) => E < V);
      const S = [];
      for (let V = b; C(V); V += j)
        S.push(V);
      return S;
    }
    function w(b, E) {
      const j = {};
      for (const C of E)
        b[C] !== void 0 && (j[C] = b[C]);
      return j;
    }
    function L(b, E) {
      let j = E;
      return typeof E == "string" && (j = (C) => C[E]), Object.entries(b).reduce((C, [S, V]) => (C[S] = j(V, S), C), {});
    }
    function A(b, E) {
      return b.reduce((j, C, S) => (j[C] = E[S], j), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, c, u) {
    c.exports = "1.1.8";
  }, {}], 29: [function(e, c, u) {
    var f = e("./lib");
    c.exports = { Graph: f.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: f.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, c, u) {
    c.exports = f;
    function f(d) {
      var h = {}, l = [], i;
      function n(t) {
        Object.hasOwn(h, t) || (h[t] = !0, i.push(t), d.successors(t).forEach(n), d.predecessors(t).forEach(n));
      }
      return d.nodes().forEach(function(t) {
        i = [], n(t), i.length && l.push(i);
      }), l;
    }
  }, {}], 31: [function(e, c, u) {
    c.exports = f;
    function f(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var a = i.isDirected() ? (s) => i.successors(s) : (s) => i.neighbors(s), o = t === "post" ? d : h, p = [], r = {};
      return n.forEach((s) => {
        if (!i.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        o(s, a, r, p);
      }), p;
    }
    function d(i, n, t, a) {
      for (var o = [[i, !1]]; o.length > 0; ) {
        var p = o.pop();
        p[1] ? a.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, o.push([p[0], !0]), l(n(p[0]), (r) => o.push([r, !1])));
      }
    }
    function h(i, n, t, a) {
      for (var o = [i]; o.length > 0; ) {
        var p = o.pop();
        Object.hasOwn(t, p) || (t[p] = !0, a.push(p), l(n(p), (r) => o.push(r)));
      }
    }
    function l(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, c, u) {
    var f = e("./dijkstra");
    c.exports = d;
    function d(h, l, i) {
      return h.nodes().reduce(function(n, t) {
        return n[t] = f(h, t, l, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, c, u) {
    var f = e("../data/priority-queue");
    c.exports = h;
    var d = () => 1;
    function h(i, n, t, a) {
      return l(i, String(n), t || d, a || function(o) {
        return i.outEdges(o);
      });
    }
    function l(i, n, t, a) {
      var o = {}, p = new f(), r, s, m = function(g) {
        var _ = g.v !== r ? g.v : g.w, T = o[_], y = t(g), N = s.distance + y;
        if (y < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + y);
        N < T.distance && (T.distance = N, T.predecessor = r, p.decrease(_, N));
      };
      for (i.nodes().forEach(function(g) {
        var _ = g === n ? 0 : Number.POSITIVE_INFINITY;
        o[g] = { distance: _ }, p.add(g, _);
      }); p.size() > 0 && (r = p.removeMin(), s = o[r], s.distance !== Number.POSITIVE_INFINITY); )
        a(r).forEach(m);
      return o;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, c, u) {
    var f = e("./tarjan");
    c.exports = d;
    function d(h) {
      return f(h).filter(function(l) {
        return l.length > 1 || l.length === 1 && h.hasEdge(l[0], l[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, c, u) {
    c.exports = d;
    var f = () => 1;
    function d(l, i, n) {
      return h(l, i || f, n || function(t) {
        return l.outEdges(t);
      });
    }
    function h(l, i, n) {
      var t = {}, a = l.nodes();
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
            var g = s[o], _ = p[m], T = s[m], y = g.distance + _.distance;
            y < T.distance && (T.distance = y, T.predecessor = _.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, c, u) {
    c.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, c, u) {
    var f = e("./topsort");
    c.exports = d;
    function d(h) {
      try {
        f(h);
      } catch (l) {
        if (l instanceof f.CycleException)
          return !1;
        throw l;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, c, u) {
    var f = e("./dfs");
    c.exports = d;
    function d(h, l) {
      return f(h, l, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, c, u) {
    var f = e("./dfs");
    c.exports = d;
    function d(h, l) {
      return f(h, l, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, c, u) {
    var f = e("../graph"), d = e("../data/priority-queue");
    c.exports = h;
    function h(l, i) {
      var n = new f(), t = {}, a = new d(), o;
      function p(s) {
        var m = s.v === o ? s.w : s.v, g = a.priority(m);
        if (g !== void 0) {
          var _ = i(s);
          _ < g && (t[m] = o, a.decrease(m, _));
        }
      }
      if (l.nodeCount() === 0)
        return n;
      l.nodes().forEach(function(s) {
        a.add(s, Number.POSITIVE_INFINITY), n.setNode(s);
      }), a.decrease(l.nodes()[0], 0);
      for (var r = !1; a.size() > 0; ) {
        if (o = a.removeMin(), Object.hasOwn(t, o))
          n.setEdge(o, t[o]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + l);
          r = !0;
        }
        l.nodeEdges(o).forEach(p);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, c, u) {
    c.exports = f;
    function f(d) {
      var h = 0, l = [], i = {}, n = [];
      function t(a) {
        var o = i[a] = { onStack: !0, lowlink: h, index: h++ };
        if (l.push(a), d.successors(a).forEach(function(s) {
          Object.hasOwn(i, s) ? i[s].onStack && (o.lowlink = Math.min(o.lowlink, i[s].index)) : (t(s), o.lowlink = Math.min(o.lowlink, i[s].lowlink));
        }), o.lowlink === o.index) {
          var p = [], r;
          do
            r = l.pop(), i[r].onStack = !1, p.push(r);
          while (a !== r);
          n.push(p);
        }
      }
      return d.nodes().forEach(function(a) {
        Object.hasOwn(i, a) || t(a);
      }), n;
    }
  }, {}], 42: [function(e, c, u) {
    function f(h) {
      var l = {}, i = {}, n = [];
      function t(a) {
        if (Object.hasOwn(i, a))
          throw new d();
        Object.hasOwn(l, a) || (i[a] = !0, l[a] = !0, h.predecessors(a).forEach(t), delete i[a], n.push(a));
      }
      if (h.sinks().forEach(t), Object.keys(l).length !== h.nodeCount())
        throw new d();
      return n;
    }
    class d extends Error {
      constructor() {
        super(...arguments);
      }
    }
    c.exports = f, f.CycleException = d;
  }, {}], 43: [function(e, c, u) {
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
        var l = this._keyIndices[h];
        if (l !== void 0)
          return this._arr[l].priority;
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
      add(h, l) {
        var i = this._keyIndices;
        if (h = String(h), !Object.hasOwn(i, h)) {
          var n = this._arr, t = n.length;
          return i[h] = t, n.push({ key: h, priority: l }), this._decrease(t), !0;
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
      decrease(h, l) {
        var i = this._keyIndices[h];
        if (l > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + h + " Old: " + this._arr[i].priority + " New: " + l);
        this._arr[i].priority = l, this._decrease(i);
      }
      _heapify(h) {
        var l = this._arr, i = 2 * h, n = i + 1, t = h;
        i < l.length && (t = l[i].priority < l[t].priority ? i : t, n < l.length && (t = l[n].priority < l[t].priority ? n : t), t !== h && (this._swap(h, t), this._heapify(t)));
      }
      _decrease(h) {
        for (var l = this._arr, i = l[h].priority, n; h !== 0 && (n = h >> 1, !(l[n].priority < i)); )
          this._swap(h, n), h = n;
      }
      _swap(h, l) {
        var i = this._arr, n = this._keyIndices, t = i[h], a = i[l];
        i[h] = a, i[l] = t, n[a.key] = h, n[t.key] = l;
      }
    }
    c.exports = f;
  }, {}], 44: [function(e, c, u) {
    var f = "\0", d = "\0", h = "";
    class l {
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
        r && (this._isDirected = Object.hasOwn(r, "directed") ? r.directed : !0, this._isMultigraph = Object.hasOwn(r, "multigraph") ? r.multigraph : !1, this._isCompound = Object.hasOwn(r, "compound") ? r.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[d] = {});
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
        return r.forEach(function(_) {
          m.length > 1 ? g.setNode(_, s) : g.setNode(_);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, s) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = s), this) : (this._nodes[r] = arguments.length > 1 ? s : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = d, this._children[r] = {}, this._children[d][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
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
          s = d;
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
          if (s !== d)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = d) {
        if (this._isCompound) {
          var s = this._children[r];
          if (s)
            return Object.keys(s);
        } else {
          if (r === d)
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
        Object.entries(this._nodes).forEach(function([T, y]) {
          r(T) && s.setNode(T, y);
        }), Object.values(this._edgeObjs).forEach(function(T) {
          s.hasNode(T.v) && s.hasNode(T.w) && s.setEdge(T, m.edge(T));
        });
        var g = {};
        function _(T) {
          var y = m.parent(T);
          return y === void 0 || s.hasNode(y) ? (g[T] = y, y) : y in g ? g[y] : _(y);
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
        var m = this, g = arguments;
        return r.reduce(function(_, T) {
          return g.length > 1 ? m.setEdge(_, T, s) : m.setEdge(_, T), T;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, s, m, g, _ = !1, T = arguments[0];
        typeof T == "object" && T !== null && "v" in T ? (r = T.v, s = T.w, m = T.name, arguments.length === 2 && (g = arguments[1], _ = !0)) : (r = T, s = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], _ = !0)), r = "" + r, s = "" + s, m !== void 0 && (m = "" + m);
        var y = t(this._isDirected, r, s, m);
        if (Object.hasOwn(this._edgeLabels, y))
          return _ && (this._edgeLabels[y] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(s), this._edgeLabels[y] = _ ? g : this._defaultEdgeLabelFn(r, s, m);
        var N = a(this._isDirected, r, s, m);
        return r = N.v, s = N.w, Object.freeze(N), this._edgeObjs[y] = N, i(this._preds[s], r), i(this._sucs[r], s), this._in[s][y] = N, this._out[r][y] = N, this._edgeCount++, this;
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
        var g = arguments.length === 1 ? o(this._isDirected, arguments[0]) : t(this._isDirected, r, s, m), _ = this._edgeObjs[g];
        return _ && (r = _.v, s = _.w, delete this._edgeLabels[g], delete this._edgeObjs[g], n(this._preds[s], r), n(this._sucs[r], s), delete this._in[s][g], delete this._out[r][g], this._edgeCount--), this;
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
          return s ? g.filter((_) => _.v === s) : g;
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
          return s ? g.filter((_) => _.w === s) : g;
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
      var g = "" + r, _ = "" + s;
      if (!p && g > _) {
        var T = g;
        g = _, _ = T;
      }
      return g + h + _ + h + (m === void 0 ? f : m);
    }
    function a(p, r, s, m) {
      var g = "" + r, _ = "" + s;
      if (!p && g > _) {
        var T = g;
        g = _, _ = T;
      }
      var y = { v: g, w: _ };
      return m && (y.name = m), y;
    }
    function o(p, r) {
      return t(p, r.v, r.w, r.name);
    }
    c.exports = l;
  }, {}], 45: [function(e, c, u) {
    c.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, c, u) {
    var f = e("./graph");
    c.exports = { write: d, read: i };
    function d(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: h(n), edges: l(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function h(n) {
      return n.nodes().map(function(t) {
        var a = n.node(t), o = n.parent(t), p = { v: t };
        return a !== void 0 && (p.value = a), o !== void 0 && (p.parent = o), p;
      });
    }
    function l(n) {
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
  }, { "./graph": 44 }], 47: [function(e, c, u) {
    c.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), Xt = ["unstarted", "started", "completed", "canceled"];
function Qt(e, c) {
  let u = 1;
  const f = () => `${e.slice(0, 40 - String(u).length - 1)}_${u}`;
  for (; c.some((d) => d.id === f()); ) u++;
  return f();
}
function Zt(e, c) {
  return [
    ...e.initial === c.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((u) => u.to === c.id || u.from !== "any" && u.from.includes(c.id)).map((u) => `transition ${Ct(u)}`),
    ...e.states.filter((u) => u.regions?.some((f) => f.initial === c.id)).map((u) => `lanes in ${Pe(u)}`),
    ...Object.entries(e.map ?? {}).filter(([, u]) => u === c.id).map(() => "existing item migration")
  ];
}
function en(e, c) {
  return e.states.flatMap((u) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => u.run?.[f] === c.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${Pe(u)}`),
    ...(u.timers ?? []).filter((f) => f.then?.transition === c.id).map(() => "a timer")
  ]);
}
const Pe = (e) => e?.name || "Untitled state", Ct = (e) => e.name?.trim() || me(e.id), tn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", nn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function rn(e, c) {
  if (e.id === c.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const u = e.release_when?.approvals?.min;
    return u ? `Needs ${u} approval${u === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? De(e) : "A person moves it";
}
function De(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function sn(e, c) {
  const u = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${u === 1 ? "one person approves" : `${u} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${De(e)}.` : "A person chooses when to move the item on.", d = c.policy?.wip?.[e.id]?.limit;
  return f + (d !== void 0 ? ` At most ${d} at a time.` : "");
}
function on(e) {
  const c = e.transitions ?? [], u = [], f = /* @__PURE__ */ new Set();
  let d = e.states.find((l) => l.id === e.initial);
  const h = new Map(e.states.map((l, i) => [l.id, i]));
  for (; d && !f.has(d.id) && (u.push(d), f.add(d.id), !(d.category === "completed" || d.category === "canceled")); ) {
    const l = d, i = c.filter((t) => t.from !== "any" && t.from.includes(l.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (h.get(t.to) ?? -1) > (h.get(l.id) ?? 0));
    d = e.states.find((t) => t.id === n?.to);
  }
  return u;
}
function Fe(e) {
  const c = e.states.find((u) => u.id === e.initial);
  return e.migration ?? (c?.kind === "automated" || c?.kind === "parallel" ? "pin" : "follow");
}
const te = (e) => JSON.parse(JSON.stringify(e));
function an(e) {
  return e?.admin === !0;
}
function ln(e, c, u) {
  const f = c + u;
  if (c < 0 || c >= e.length || f < 0 || f >= e.length) return;
  const [d] = e.splice(c, 1);
  e.splice(f, 0, d);
}
function dn(e, c, u) {
  const f = c.code;
  if (f === u) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  c.code = u;
  const d = (n) => n === f ? u : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(d), n.inherit && (n.inherit = n.inherit.map(d));
  const h = (n) => {
    for (const t of n ?? []) "field" in t && t.field === f && (t.field = u);
  }, l = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = d(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      l(n);
      for (const [t, a] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(a);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = d(n.field)), i(n.where), h(n.access?.read), h(n.access?.write);
  if (e.visibility) {
    e.visibility.field = d(e.visibility.field);
    for (const n of e.visibility.levels) h(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      l(t.awaiting), l(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(d));
      for (const a of t.timers ?? [])
        a.at_field && (a.at_field = d(a.at_field)), a.by && (a.by = d(a.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(d));
      for (const a of t.set ?? [])
        a.field = d(a.field), a.copy && (a.copy = d(a.copy));
    }
  }
}
function Ie({ migration: e, map: c, ...u }) {
  return JSON.stringify(u);
}
function un(e, c) {
  const u = te(e);
  for (const d of u.processes ?? []) {
    const h = c.processes?.find((l) => l.id === d.id);
    if (h && Ie(d) !== Ie(h) && (d.migration = "follow"), d.map) {
      for (const [l, i] of Object.entries(d.map))
        (d.states.some((n) => n.id === l) || !d.states.some((n) => n.id === i)) && delete d.map[l];
      Object.keys(d.map).length || delete d.map;
    }
  }
  u.plugins && (u.plugins = u.plugins.map(({ use: d }) => ({ use: d })));
  for (const d of u.fields ?? [])
    d.type?.includes(":") && delete d.form;
  const f = { ...u.remove };
  c.visibility && !u.visibility ? f.visibility = !0 : delete f.visibility;
  for (const d of ["fields", "item_types", "processes", "relation_types"]) {
    const h = (c[d] ?? []).filter((l) => {
      if (d === "fields") {
        const i = l;
        return !u.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(u[d] ?? []).some((i) => "id" in i && i.id === ("id" in l ? l.id : void 0));
    }).map((l) => "code" in l ? l.code : l.id);
    h.length ? f[d] = [.../* @__PURE__ */ new Set([...f[d] ?? [], ...h])] : delete f[d];
  }
  return Object.keys(f).length ? u.remove = f : delete u.remove, u;
}
function cn(e, c, u) {
  const f = JSON.stringify({ declaration: e, configs: u });
  return {
    declaration: te(e),
    expected_generation: c,
    plugin_configs: te(u),
    matches: (d, h, l) => c === h && f === JSON.stringify({ declaration: d, configs: l })
  };
}
function fn(e) {
  const c = te(e), u = [...new Set(c.declaration.item_types?.flatMap((d) => d.fields) ?? [])], f = (d) => {
    const h = u.indexOf(d);
    return h < 0 ? u.length : h;
  };
  c.declaration.fields?.sort((d, h) => f(d.code) - f(h.code));
  for (const d of c.declaration.fields ?? []) {
    const h = c.compiled.fields?.find((l) => l.code === d.code);
    d.id ??= h?.id, d.form ??= h?.form;
  }
  for (const d of c.declaration.processes ?? []) d.migration ??= c.compiled.processes?.find((h) => h.id === d.id)?.migration ?? Fe(d);
  return c;
}
function hn(e, c) {
  return (c.processes ?? []).filter((u) => Fe(u) !== "pin" && e.changes.some((f) => f.code === "process " + u.id && f.class !== "cosmetic" && f.class !== "refused")).map((u) => u.id);
}
function pn(e, c, u) {
  const f = [u, `item_type ${u}`, `relation ${u}`, `process ${u}`], d = e.refused.filter((h) => f.includes(h.code));
  return c === "fields" && d.push(...e.changes.filter((h) => h.code === u && h.what === "removed" && h.class === "semantic")), d.length ? d.map(Lt).join(" ") : void 0;
}
function mn(e, c, u) {
  if (c === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== u);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((d) => d !== u), f.inherit = f.inherit?.filter((d) => d !== u);
  } else c === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== u) : c === "processes" ? e.processes = e.processes?.filter((f) => f.id !== u) : e.relation_types = e.relation_types?.filter((f) => f.id !== u);
}
function Lt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function gn(e, c) {
  if (!(e instanceof ee)) return [];
  const u = e.details ?? {};
  let f = typeof u.field == "string" ? u.field : "";
  if (!f) {
    const d = c.processes?.find((h) => h.id === u.process || h.states.some((l) => l.id === u.state) || e.message.includes(`process ${h.id}`));
    d ? f = `process ${d.id}` : typeof u.item_type == "string" && (f = `item_type ${u.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: Me(e, "The definition is invalid.") }] : [];
}
const bn = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, yn = (e) => !("problem" in e);
function wn(e, c) {
  return { pack: e.id, version: e.version, expected_generation: c };
}
async function vn(e, c) {
  const u = { ...te(e), resolutions: te(e.resolutions ?? {}) };
  let f = await c(u);
  return u.maps || (u.maps = te(f.maps), f = await c(u)), { request: u, plan: f };
}
function kn() {
  let e = 0;
  return () => {
    const c = ++e;
    return () => c === e;
  };
}
export {
  mn as A,
  dn as B,
  nn as C,
  ee as D,
  Re as E,
  Qt as F,
  sn as G,
  en as H,
  Zt as I,
  te as J,
  gt as K,
  pe as L,
  bn as M,
  un as N,
  hn as O,
  wn as P,
  vn as Q,
  fn as R,
  cn as S,
  gn as T,
  pn as U,
  qt as _,
  yn as a,
  bt as b,
  Ve as c,
  Ht as d,
  an as e,
  Me as f,
  Kt as g,
  rn as h,
  Ae as i,
  de as j,
  Yt as k,
  kn as l,
  on as m,
  pt as n,
  me as o,
  ne as p,
  dt as q,
  zt as r,
  Pe as s,
  Ct as t,
  Jt as u,
  Xt as v,
  It as w,
  tn as x,
  ln as y,
  Lt as z
};
//# sourceMappingURL=latestRequest-DDkHJpUA.js.map
