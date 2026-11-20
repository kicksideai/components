import { defineComponent as ce, openBlock as U, createBlock as Q, resolveDynamicComponent as De, withCtx as Fe, renderSlot as Ne, ref as K, watch as se, onBeforeUnmount as we, createElementBlock as Y, createElementVNode as Z, toDisplayString as X, createCommentVNode as ae, createVNode as ye, unref as B, onUnmounted as Ge, useId as Ue, computed as ne, createTextVNode as Be, Fragment as xe, renderList as _e, withKeys as We, withModifiers as Ye, onMounted as ze, nextTick as Je } from "vue";
import He from "primevue/button";
import Oe from "primevue/inputtext";
import Ke from "primevue/inputnumber";
import qe from "primevue/toggleswitch";
import Xe from "primevue/select";
import Qe from "primevue/chip";
import Ze from "primevue/textarea";
import { e as et } from "./mount-B0GaBFyy.js";
import { api as je } from "@wippy-fe/proxy";
const Rt = /* @__PURE__ */ ce({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: d }) {
    const u = e, f = d;
    function h(o) {
      if (u.disabled || o.defaultPrevented) return;
      const i = o.target;
      if (i instanceof Element && i !== o.currentTarget) {
        const n = i.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (n && n !== o.currentTarget) return;
      }
      f("activate", o);
    }
    function c(o) {
      o.target !== o.currentTarget || !["Enter", " "].includes(o.key) || (o.preventDefault(), u.disabled || f("activate", o));
    }
    return (o, i) => (U(), Q(De(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: h,
      onKeydown: c
    }, {
      default: Fe(() => [
        Ne(o.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
});
function oe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const fe = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), tt = { class: "work-json-disclosure" }, nt = { class: "work-stack work-tight" }, rt = {
  key: 0,
  class: "work-small work-muted"
}, it = {
  key: 1,
  role: "alert",
  class: "work-error"
}, at = { class: "work-json-example" }, st = /* @__PURE__ */ ce({
  __name: "JsonInput",
  props: {
    label: {},
    modelValue: {},
    shape: {},
    hint: {},
    example: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: d }) {
    const u = e, f = d, h = K(""), c = K("");
    se(() => u.modelValue, (i) => {
      h.value = i === void 0 ? "" : JSON.stringify(i, null, 2), c.value = "", f("validity", !0);
    }, { immediate: !0 }), we(() => f("validity", !0));
    function o(i) {
      h.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && u.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && u.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        c.value = "", f("update:modelValue", n), f("validity", !0);
      } catch (n) {
        c.value = n instanceof Error ? n.message : "Invalid JSON.", f("validity", !1);
      }
    }
    return (i, n) => (U(), Y("details", tt, [
      Z("summary", null, "Edit as JSON · " + X(e.label), 1),
      Z("label", nt, [
        Z("span", null, X(e.label), 1),
        e.hint ? (U(), Y("span", rt, X(e.hint), 1)) : ae("", !0),
        ye(B(Ze), {
          class: "work-json-input",
          rows: "3",
          "aria-label": e.label,
          value: h.value,
          "aria-invalid": !!c.value,
          onInput: n[0] || (n[0] = (t) => o(t.target.value))
        }, null, 8, ["aria-label", "value", "aria-invalid"]),
        c.value ? (U(), Y("span", it, X(c.value), 1)) : ae("", !0)
      ]),
      n[1] || (n[1] = Z("p", { class: "work-small work-muted" }, "Example", -1)),
      Z("pre", at, X(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
    ]));
  }
});
class ee extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(d, u, f) {
    super(d.message ?? d.error ?? `${u} failed`), this.name = "ApiError", this.kind = d.kind, this.details = d.details, this.retryable = d.retryable, this.status = f;
  }
}
function St(e, d) {
  const u = e instanceof Error ? e.message : d, f = e instanceof ee ? e.details?.code : void 0;
  return typeof f == "string" && f ? `${u} (Error code: ${f})` : u;
}
function Ie(e, d) {
  const u = e;
  if (u && typeof u == "object" && u.success === !1) throw new ee(u, d);
  if (u && typeof u == "object" && u.success === !0 && u.data !== void 0) return u.data;
  throw new ee({ kind: "INTERNAL", message: `${d}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, d);
}
function Ce(e, d) {
  if (e instanceof ee) return e;
  const u = e?.response;
  return u?.data ? new ee(u.data, d, u.status) : e instanceof Error ? e : new ee({ kind: "Unavailable" }, d);
}
async function be(e, d, u) {
  try {
    return Ie((await je.get(e, { params: u })).data, d);
  } catch (f) {
    throw Ce(f, d);
  }
}
async function re(e, d, u) {
  try {
    return Ie((await je.post(e, d)).data, u);
  } catch (f) {
    throw Ce(f, u);
  }
}
const ge = /* @__PURE__ */ new Map();
function ue(e, d = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => ue(f, d)).join(", ");
  if (typeof e == "string") return d.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const u = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof u[f] == "string" && u[f] && !fe(u[f])) return u[f];
  return d.get(`${u.kind ?? "user"}:${u.id}`) ?? (typeof u.email == "string" && u.email ? u.email : u.kind === "group" ? "Unavailable group" : typeof u.id == "string" ? ue(u.id, d) : "Unavailable person");
}
async function ot(e, d) {
  const u = [...new Map(d.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, u]), h = ge.get(f);
  if (h) return h;
  const o = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < u.length; n += 200) {
      const t = await re(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: u.slice(n, n + 200) }, "Display names");
      for (const l of t.principals) l.label.trim() && !fe(l.label) && l.label !== l.id && i.set(`${l.type}:${l.id}`, l.label.trim());
    }
    return i;
  })();
  ge.set(f, o);
  try {
    return await o;
  } finally {
    ge.delete(f);
  }
}
function lt(e, d) {
  const u = K(/* @__PURE__ */ new Map()), f = K("");
  let h = 0;
  return se([e, d], async ([c, o]) => {
    const i = ++h;
    if (u.value = /* @__PURE__ */ new Map(), f.value = "", !(!c || !o.length))
      try {
        const n = await ot(c, o);
        i === h && (u.value = n);
      } catch (n) {
        i === h && (f.value = n instanceof Error ? n.message : "Display names are unavailable.");
      }
  }, { immediate: !0, deep: !0 }), Ge(() => {
    h++, u.value.clear();
  }), {
    labels: u,
    error: f,
    label: (c) => ue(c, u.value),
    remember: (c, o) => {
      o.trim() && !fe(o) && o !== c.id && u.value.set(`${c.kind}:${c.id}`, o.trim());
    }
  };
}
function he(e) {
  if (fe(e)) return "Untitled";
  const d = e.replace(/[_-]+/g, " ");
  return d.charAt(0).toUpperCase() + d.slice(1);
}
function Mt(e) {
  return e.title?.trim() || he(e.code);
}
function Le(e, d, u = ue) {
  return e == null ? "—" : d?.type === "principal" ? u(e) : Array.isArray(e) ? e.map((f) => Le(f, d, u)).join(", ") : d?.type === "option" && typeof e == "string" ? d.options?.find((f) => f.id === e)?.label || he(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (d?.form === "ref" || d?.type === "item") && "unavailable" in e ? "Unavailable" : d?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : d?.form === "ref" && "ref" in e && Array.isArray(e.ref) || d?.form === "ref" && "id" in e && typeof e.id == "string" || d?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function At(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function Vt(e, d) {
  const u = lt(e, d);
  return {
    display: (f, h) => Le(f, h, u.label),
    principalLabel: u.label,
    rememberPrincipal: u.remember,
    nameError: u.error,
    nameLabels: u.labels
  };
}
function Te(e) {
  return Object.entries(oe(e.properties)).map(([d, u]) => {
    const f = oe(u);
    return { key: d, title: typeof f.title == "string" && f.title.trim() ? f.title : he(d), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const Re = (e) => e.type === "array" && oe(e.items).type === "string";
function dt(e, d) {
  const u = {};
  for (const f of Te(e)) {
    const h = d[f.key] ?? f.schema.default, c = f.schema;
    let o = "";
    if (h == null)
      Array.isArray(e.required) && e.required.includes(f.key) && (o = "A value is required.");
    else if (Array.isArray(c.enum) && !c.enum.includes(h)) o = "Choose one of the available values.";
    else if (c.type === "integer" || c.type === "number")
      typeof h != "number" || !Number.isFinite(h) || c.type === "integer" && !Number.isInteger(h) ? o = c.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof c.minimum == "number" && h < c.minimum ? o = `Enter at least ${c.minimum}.` : typeof c.maximum == "number" && h > c.maximum && (o = `Enter at most ${c.maximum}.`);
    else if (c.type === "boolean" && typeof h != "boolean") o = "Choose on or off.";
    else if (c.type === "string") {
      if (typeof h != "string") o = "Enter text.";
      else if (typeof c.minLength == "number" && h.length < c.minLength) o = `Enter at least ${c.minLength} characters.`;
      else if (typeof c.maxLength == "number" && h.length > c.maxLength) o = `Enter at most ${c.maxLength} characters.`;
      else if (typeof c.pattern == "string")
        try {
          new RegExp(c.pattern).test(h) || (o = "Use the required format.");
        } catch {
          o = "The declared format is unavailable.";
        }
    } else if (c.type === "array") {
      if (!Array.isArray(h)) o = "Enter a list.";
      else if (typeof c.maxItems == "number" && h.length > c.maxItems) o = `Use at most ${c.maxItems} entries.`;
      else if (typeof c.minItems == "number" && h.length < c.minItems) o = `Use at least ${c.minItems} entries.`;
      else if (c.uniqueItems && new Set(h).size !== h.length) o = "Remove duplicate entries.";
      else if (Re(c)) {
        const i = oe(c.items);
        h.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (o = "Each entry must match the declared text length.");
      }
    } else c.type === "object" && (typeof h != "object" || Array.isArray(h)) && (o = "Enter an object.");
    o && (u[f.key] = o);
  }
  return u;
}
const ut = { class: "work-stack" }, ct = ["inert", "schema", "config"], ft = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, ht = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, pt = { class: "work-config-fields" }, mt = ["for"], bt = {
  key: 1,
  class: "work-config-chips"
}, gt = {
  key: 6,
  class: "work-muted work-small"
}, yt = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, $t = /* @__PURE__ */ ce({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: d }) {
    const u = e, f = d, h = K({}), c = K(/* @__PURE__ */ new Set()), o = K(!1), i = K(!1), n = Ue(), t = ne(() => Te(u.schema)), l = ne(() => dt(u.schema, u.modelValue)), s = ne(() => t.value.filter((m) => typeof m.schema.picker == "string")), p = ne(() => t.value.filter((m) => typeof m.schema.picker != "string")), r = ne(() => ({ ...u.schema, properties: Object.fromEntries(s.value.map((m) => [m.key, { ...m.schema, title: m.title }])), required: Array.isArray(u.schema.required) ? u.schema.required.filter((m) => s.value.some((_) => _.key === m)) : [] })), a = ne(() => Object.fromEntries(s.value.map((m) => [m.key, u.modelValue[m.key]])));
    se([l, c, () => s.value.length > 0 && !o.value], () => f("validity", !Object.keys(l.value).length && !c.value.size && (!s.value.length || o.value)), { immediate: !0, deep: !0 });
    async function b() {
      i.value = !0, o.value = await et("wc-schema-form"), i.value = !1;
    }
    se(() => s.value.length > 0, (m) => {
      m && b();
    }, { immediate: !0 }), we(() => f("validity", !0));
    function y(m, _) {
      const g = { ...u.modelValue };
      _ == null ? delete g[m] : g[m] = _, f("update:modelValue", g);
    }
    function x(m) {
      const _ = u.modelValue[m];
      return Array.isArray(_) ? _.filter((g) => typeof g == "string") : [];
    }
    function L(m) {
      const _ = h.value[m]?.trim();
      _ && (y(m, [...x(m), _]), h.value[m] = "");
    }
    function v(m, _) {
      _ ? c.value.delete(m) : c.value.add(m);
    }
    function O(m) {
      f("update:modelValue", { ...u.modelValue, ...oe(m.detail) });
    }
    return (m, _) => (U(), Y("div", ut, [
      s.value.length && o.value ? (U(), Y("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(r.value),
        config: JSON.stringify(a.value),
        onConfigChanged: O
      }, null, 40, ct)) : s.value.length && i.value ? (U(), Y("p", ft, "The configuration widget is loading.")) : s.value.length ? (U(), Y("p", ht, [
        _[0] || (_[0] = Be("The configuration widget is unavailable.", -1)),
        ye(B(He), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: b
        })
      ])) : ae("", !0),
      Z("div", pt, [
        (U(!0), Y(xe, null, _e(p.value, (g) => (U(), Y("div", {
          key: g.key,
          class: "work-config-field"
        }, [
          Z("label", {
            class: "work-config-label",
            for: B(n) + "-" + g.key
          }, X(g.title), 9, mt),
          Array.isArray(g.schema.enum) ? (U(), Q(B(Xe), {
            key: 0,
            "input-id": B(n) + "-" + g.key,
            "model-value": e.modelValue[g.key] ?? g.schema.default,
            options: g.schema.enum,
            appendTo: "self",
            "aria-label": g.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (C) => y(g.key, C)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : B(Re)(g.schema) ? (U(), Y("div", bt, [
            (U(!0), Y(xe, null, _e(x(g.key), (C, S) => (U(), Q(B(Qe), {
              key: S,
              label: C,
              removable: !e.disabled,
              onRemove: (A) => y(g.key, x(g.key).filter((w, k) => k !== S))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            ye(B(Oe), {
              id: B(n) + "-" + g.key,
              modelValue: h.value[g.key],
              "onUpdate:modelValue": (C) => h.value[g.key] = C,
              "aria-label": "Add " + g.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: We(Ye((C) => L(g.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (C) => L(g.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(g.schema.type)) ? (U(), Q(B(Ke), {
            key: 2,
            "input-id": B(n) + "-" + g.key,
            "model-value": e.modelValue[g.key] ?? g.schema.default,
            "max-fraction-digits": g.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": g.title,
            disabled: e.disabled,
            invalid: !!l.value[g.key],
            "onUpdate:modelValue": (C) => y(g.key, C)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : g.schema.type === "boolean" ? (U(), Q(B(qe), {
            key: 3,
            "input-id": B(n) + "-" + g.key,
            "model-value": !!(e.modelValue[g.key] ?? g.schema.default),
            "aria-label": g.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (C) => y(g.key, C)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(g.schema.type)) ? (U(), Q(st, {
            key: 4,
            label: g.title,
            "model-value": e.modelValue[g.key],
            shape: g.schema.type === "array" ? "array" : "object",
            example: g.schema.default ?? (g.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (C) => y(g.key, C),
            onValidity: (C) => v(g.key, C)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (U(), Q(B(Oe), {
            key: 5,
            id: B(n) + "-" + g.key,
            "model-value": e.modelValue[g.key] ?? g.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!l.value[g.key],
            "aria-label": g.title,
            "onUpdate:modelValue": (C) => y(g.key, C)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          g.description ? (U(), Y("p", gt, X(g.description), 1)) : ae("", !0),
          l.value[g.key] ? (U(), Y("p", yt, X(l.value[g.key]), 1)) : ae("", !0)
        ]))), 128))
      ])
    ]));
  }
}), wt = ["aria-label", "aria-busy"], Pt = /* @__PURE__ */ ce({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const u = e, f = d, h = K(null);
    let c = null;
    async function o() {
      await Je();
      const n = h.value;
      n && (u.visible && !n.open ? (c = n.getRootNode().activeElement, n.showModal()) : !u.visible && n.open && (n.close(), c?.focus()));
    }
    function i(n) {
      n.preventDefault(), u.busy || f("close");
    }
    return se(() => u.visible, o), ze(o), we(() => {
      h.value?.open && h.value.close(), c?.focus();
    }), (n, t) => (U(), Y("dialog", {
      ref_key: "dialog",
      ref: h,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && f("close");
      })
    }, [
      Ne(n.$slots, "default")
    ], 40, wt));
  }
}), de = "/api/v1/work", le = (e) => `${de}/boards/${encodeURIComponent(e)}`, Dt = {
  boards: async () => {
    const e = [];
    let d;
    do {
      const u = await be(`${de}/boards${d ? "?after=" + encodeURIComponent(d) : ""}`, "Boards");
      e.push(...u.boards), d = u.next;
    } while (d);
    return e;
  },
  packs: () => be(`${de}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, d, u, f = {}) => re(`${de}/boards`, { title: e, declaration: d, idempotency_key: u, ...f }, "Create board"),
  updateBoard: (e, d) => re(`${le(e)}/update`, d, "Update board"),
  schema: (e, d, u) => re(`${le(e)}/get_schema`, { generation: d, ...u ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, d) => re(`${le(e)}/query`, d, "Item choices"),
  item: (e, d) => re(`${le(e)}/get`, { item: d }, "Item choice"),
  options: (e) => be(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options")
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
const Ft = (function() {
  return (/* @__PURE__ */ (function() {
    function e(d, u, f) {
      function h(i, n) {
        if (!u[i]) {
          if (!d[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (c) return c(i, !0);
            var l = new Error("Cannot find module '" + i + "'");
            throw l.code = "MODULE_NOT_FOUND", l;
          }
          var s = u[i] = { exports: {} };
          d[i][0].call(s.exports, function(p) {
            var r = d[i][1][p];
            return h(r || p);
          }, s, s.exports, e, d, u, f);
        }
        return u[i].exports;
      }
      for (var c = typeof require == "function" && require, o = 0; o < f.length; o++) h(f[o]);
      return h;
    }
    return e;
  })())({ 1: [function(e, d, u) {
    d.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, d, u) {
    let f = e("./greedy-fas"), h = e("./util").uniqueId;
    d.exports = { run: c, undo: i };
    function c(n) {
      (n.graph().acyclicer === "greedy" ? f(n, l(n)) : o(n)).forEach((s) => {
        let p = n.edge(s);
        n.removeEdge(s), p.forwardName = s.name, p.reversed = !0, n.setEdge(s.w, s.v, p, h("rev"));
      });
      function l(s) {
        return (p) => s.edge(p).weight;
      }
    }
    function o(n) {
      let t = [], l = {}, s = {};
      function p(r) {
        Object.hasOwn(s, r) || (s[r] = !0, l[r] = !0, n.outEdges(r).forEach((a) => {
          Object.hasOwn(l, a.w) ? t.push(a) : p(a.w);
        }), delete l[r]);
      }
      return n.nodes().forEach(p), t;
    }
    function i(n) {
      n.edges().forEach((t) => {
        let l = n.edge(t);
        if (l.reversed) {
          n.removeEdge(t);
          let s = l.forwardName;
          delete l.reversed, delete l.forwardName, n.setEdge(t.w, t.v, l, s);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, d, u) {
    let f = e("./util");
    d.exports = h;
    function h(o) {
      function i(n) {
        let t = o.children(n), l = o.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(l, "minRank")) {
          l.borderLeft = [], l.borderRight = [];
          for (let s = l.minRank, p = l.maxRank + 1; s < p; ++s)
            c(o, "borderLeft", "_bl", n, l, s), c(o, "borderRight", "_br", n, l, s);
        }
      }
      o.children().forEach(i);
    }
    function c(o, i, n, t, l, s) {
      let p = { width: 0, height: 0, rank: s, borderType: i }, r = l[i][s - 1], a = f.addDummyNode(o, "border", p, n);
      l[i][s] = a, o.setParent(a, t), r && o.setEdge(r, a, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, d, u) {
    d.exports = { adjust: f, undo: h };
    function f(s) {
      let p = s.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && c(s);
    }
    function h(s) {
      let p = s.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(s), (p === "lr" || p === "rl") && (t(s), c(s));
    }
    function c(s) {
      s.nodes().forEach((p) => o(s.node(p))), s.edges().forEach((p) => o(s.edge(p)));
    }
    function o(s) {
      let p = s.width;
      s.width = s.height, s.height = p;
    }
    function i(s) {
      s.nodes().forEach((p) => n(s.node(p))), s.edges().forEach((p) => {
        let r = s.edge(p);
        r.points.forEach(n), Object.hasOwn(r, "y") && n(r);
      });
    }
    function n(s) {
      s.y = -s.y;
    }
    function t(s) {
      s.nodes().forEach((p) => l(s.node(p))), s.edges().forEach((p) => {
        let r = s.edge(p);
        r.points.forEach(l), Object.hasOwn(r, "x") && l(r);
      });
    }
    function l(s) {
      let p = s.x;
      s.x = s.y, s.y = p;
    }
  }, {}], 5: [function(e, d, u) {
    class f {
      constructor() {
        let i = {};
        i._next = i._prev = i, this._sentinel = i;
      }
      dequeue() {
        let i = this._sentinel, n = i._prev;
        if (n !== i)
          return h(n), n;
      }
      enqueue(i) {
        let n = this._sentinel;
        i._prev && i._next && h(i), i._next = n._next, n._next._prev = i, n._next = i, i._prev = n;
      }
      toString() {
        let i = [], n = this._sentinel, t = n._prev;
        for (; t !== n; )
          i.push(JSON.stringify(t, c)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function h(o) {
      o._prev._next = o._next, o._next._prev = o._prev, delete o._next, delete o._prev;
    }
    function c(o, i) {
      if (o !== "_next" && o !== "_prev")
        return i;
    }
    d.exports = f;
  }, {}], 6: [function(e, d, u) {
    let f = e("./util"), h = e("@dagrejs/graphlib").Graph;
    d.exports = { debugOrdering: c };
    function c(o) {
      let i = f.buildLayerMatrix(o), n = new h({ compound: !0, multigraph: !0 }).setGraph({});
      return o.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + o.node(t).rank);
      }), o.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, l) => {
        let s = "layer" + l;
        n.setNode(s, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, d, u) {
    let f = e("@dagrejs/graphlib").Graph, h = e("./data/list");
    d.exports = o;
    let c = () => 1;
    function o(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let a = t(p, r || c);
      return i(a.graph, a.buckets, a.zeroIdx).flatMap((y) => p.outEdges(y.v, y.w));
    }
    function i(p, r, a) {
      let b = [], y = r[r.length - 1], x = r[0], L;
      for (; p.nodeCount(); ) {
        for (; L = x.dequeue(); )
          n(p, r, a, L);
        for (; L = y.dequeue(); )
          n(p, r, a, L);
        if (p.nodeCount()) {
          for (let v = r.length - 2; v > 0; --v)
            if (L = r[v].dequeue(), L) {
              b = b.concat(n(p, r, a, L, !0));
              break;
            }
        }
      }
      return b;
    }
    function n(p, r, a, b, y) {
      let x = y ? [] : void 0;
      return p.inEdges(b.v).forEach((L) => {
        let v = p.edge(L), O = p.node(L.v);
        y && x.push({ v: L.v, w: L.w }), O.out -= v, l(r, a, O);
      }), p.outEdges(b.v).forEach((L) => {
        let v = p.edge(L), O = L.w, m = p.node(O);
        m.in -= v, l(r, a, m);
      }), p.removeNode(b.v), x;
    }
    function t(p, r) {
      let a = new f(), b = 0, y = 0;
      p.nodes().forEach((v) => {
        a.setNode(v, { v, in: 0, out: 0 });
      }), p.edges().forEach((v) => {
        let O = a.edge(v.v, v.w) || 0, m = r(v), _ = O + m;
        a.setEdge(v.v, v.w, _), y = Math.max(y, a.node(v.v).out += m), b = Math.max(b, a.node(v.w).in += m);
      });
      let x = s(y + b + 3).map(() => new h()), L = b + 1;
      return a.nodes().forEach((v) => {
        l(x, L, a.node(v));
      }), { graph: a, buckets: x, zeroIdx: L };
    }
    function l(p, r, a) {
      a.out ? a.in ? p[a.out - a.in + r].enqueue(a) : p[p.length - 1].enqueue(a) : p[0].enqueue(a);
    }
    function s(p) {
      const r = [];
      for (let a = 0; a < p; a++)
        r.push(a);
      return r;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, d, u) {
    let f = e("./acyclic"), h = e("./normalize"), c = e("./rank"), o = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), l = e("./add-border-segments"), s = e("./coordinate-system"), p = e("./order"), r = e("./position"), a = e("./util"), b = e("@dagrejs/graphlib").Graph;
    d.exports = y;
    function y(E, j) {
      let T = j && j.debugTiming ? a.time : a.notime;
      T("layout", () => {
        let M = T("  buildLayoutGraph", () => w(E));
        T("  runLayout", () => x(M, T, j)), T("  updateInputGraph", () => L(E, M));
      });
    }
    function x(E, j, T) {
      j("    makeSpaceForEdgeLabels", () => k(E)), j("    removeSelfEdges", () => Ve(E)), j("    acyclic", () => f.run(E)), j("    nestingGraph.run", () => t.run(E)), j("    rank", () => c(a.asNonCompoundGraph(E))), j("    injectEdgeLabelProxies", () => N(E)), j("    removeEmptyRanks", () => n(E)), j("    nestingGraph.cleanup", () => t.cleanup(E)), j("    normalizeRanks", () => o(E)), j("    assignRankMinMax", () => I(E)), j("    removeEdgeLabelProxies", () => R(E)), j("    normalize.run", () => h.run(E)), j("    parentDummyChains", () => i(E)), j("    addBorderSegments", () => l(E)), j("    order", () => p(E, T)), j("    insertSelfEdges", () => $e(E)), j("    adjustCoordinateSystem", () => s.adjust(E)), j("    position", () => r(E)), j("    positionSelfEdges", () => Pe(E)), j("    removeBorderNodes", () => q(E)), j("    normalize.undo", () => h.undo(E)), j("    fixupEdgeLabelCoords", () => F(E)), j("    undoCoordinateSystem", () => s.undo(E)), j("    translateGraph", () => V(E)), j("    assignNodeIntersects", () => $(E)), j("    reversePoints", () => H(E)), j("    acyclic.undo", () => f.undo(E));
    }
    function L(E, j) {
      E.nodes().forEach((T) => {
        let M = E.node(T), P = j.node(T);
        M && (M.x = P.x, M.y = P.y, M.rank = P.rank, j.children(T).length && (M.width = P.width, M.height = P.height));
      }), E.edges().forEach((T) => {
        let M = E.edge(T), P = j.edge(T);
        M.points = P.points, Object.hasOwn(P, "x") && (M.x = P.x, M.y = P.y);
      }), E.graph().width = j.graph().width, E.graph().height = j.graph().height;
    }
    let v = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], O = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, m = ["acyclicer", "ranker", "rankdir", "align"], _ = ["width", "height", "rank"], g = { width: 0, height: 0 }, C = ["minlen", "weight", "width", "height", "labeloffset"], S = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, A = ["labelpos"];
    function w(E) {
      let j = new b({ multigraph: !0, compound: !0 }), T = me(E.graph());
      return j.setGraph(Object.assign({}, O, pe(T, v), a.pick(T, m))), E.nodes().forEach((M) => {
        let P = me(E.node(M));
        const D = pe(P, _);
        Object.keys(g).forEach((G) => {
          D[G] === void 0 && (D[G] = g[G]);
        }), j.setNode(M, D), j.setParent(M, E.parent(M));
      }), E.edges().forEach((M) => {
        let P = me(E.edge(M));
        j.setEdge(M, Object.assign({}, S, pe(P, C), a.pick(P, A)));
      }), j;
    }
    function k(E) {
      let j = E.graph();
      j.ranksep /= 2, E.edges().forEach((T) => {
        let M = E.edge(T);
        M.minlen *= 2, M.labelpos.toLowerCase() !== "c" && (j.rankdir === "TB" || j.rankdir === "BT" ? M.width += M.labeloffset : M.height += M.labeloffset);
      });
    }
    function N(E) {
      E.edges().forEach((j) => {
        let T = E.edge(j);
        if (T.width && T.height) {
          let M = E.node(j.v), D = { rank: (E.node(j.w).rank - M.rank) / 2 + M.rank, e: j };
          a.addDummyNode(E, "edge-proxy", D, "_ep");
        }
      });
    }
    function I(E) {
      let j = 0;
      E.nodes().forEach((T) => {
        let M = E.node(T);
        M.borderTop && (M.minRank = E.node(M.borderTop).rank, M.maxRank = E.node(M.borderBottom).rank, j = Math.max(j, M.maxRank));
      }), E.graph().maxRank = j;
    }
    function R(E) {
      E.nodes().forEach((j) => {
        let T = E.node(j);
        T.dummy === "edge-proxy" && (E.edge(T.e).labelRank = T.rank, E.removeNode(j));
      });
    }
    function V(E) {
      let j = Number.POSITIVE_INFINITY, T = 0, M = Number.POSITIVE_INFINITY, P = 0, D = E.graph(), G = D.marginx || 0, z = D.marginy || 0;
      function ve(J) {
        let W = J.x, ie = J.y, ke = J.width, Ee = J.height;
        j = Math.min(j, W - ke / 2), T = Math.max(T, W + ke / 2), M = Math.min(M, ie - Ee / 2), P = Math.max(P, ie + Ee / 2);
      }
      E.nodes().forEach((J) => ve(E.node(J))), E.edges().forEach((J) => {
        let W = E.edge(J);
        Object.hasOwn(W, "x") && ve(W);
      }), j -= G, M -= z, E.nodes().forEach((J) => {
        let W = E.node(J);
        W.x -= j, W.y -= M;
      }), E.edges().forEach((J) => {
        let W = E.edge(J);
        W.points.forEach((ie) => {
          ie.x -= j, ie.y -= M;
        }), Object.hasOwn(W, "x") && (W.x -= j), Object.hasOwn(W, "y") && (W.y -= M);
      }), D.width = T - j + G, D.height = P - M + z;
    }
    function $(E) {
      E.edges().forEach((j) => {
        let T = E.edge(j), M = E.node(j.v), P = E.node(j.w), D, G;
        T.points ? (D = T.points[0], G = T.points[T.points.length - 1]) : (T.points = [], D = P, G = M), T.points.unshift(a.intersectRect(M, D)), T.points.push(a.intersectRect(P, G));
      });
    }
    function F(E) {
      E.edges().forEach((j) => {
        let T = E.edge(j);
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
    function H(E) {
      E.edges().forEach((j) => {
        let T = E.edge(j);
        T.reversed && T.points.reverse();
      });
    }
    function q(E) {
      E.nodes().forEach((j) => {
        if (E.children(j).length) {
          let T = E.node(j), M = E.node(T.borderTop), P = E.node(T.borderBottom), D = E.node(T.borderLeft[T.borderLeft.length - 1]), G = E.node(T.borderRight[T.borderRight.length - 1]);
          T.width = Math.abs(G.x - D.x), T.height = Math.abs(P.y - M.y), T.x = D.x + T.width / 2, T.y = M.y + T.height / 2;
        }
      }), E.nodes().forEach((j) => {
        E.node(j).dummy === "border" && E.removeNode(j);
      });
    }
    function Ve(E) {
      E.edges().forEach((j) => {
        if (j.v === j.w) {
          var T = E.node(j.v);
          T.selfEdges || (T.selfEdges = []), T.selfEdges.push({ e: j, label: E.edge(j) }), E.removeEdge(j);
        }
      });
    }
    function $e(E) {
      var j = a.buildLayerMatrix(E);
      j.forEach((T) => {
        var M = 0;
        T.forEach((P, D) => {
          var G = E.node(P);
          G.order = D + M, (G.selfEdges || []).forEach((z) => {
            a.addDummyNode(E, "selfedge", { width: z.label.width, height: z.label.height, rank: G.rank, order: D + ++M, e: z.e, label: z.label }, "_se");
          }), delete G.selfEdges;
        });
      });
    }
    function Pe(E) {
      E.nodes().forEach((j) => {
        var T = E.node(j);
        if (T.dummy === "selfedge") {
          var M = E.node(T.e.v), P = M.x + M.width / 2, D = M.y, G = T.x - P, z = M.height / 2;
          E.setEdge(T.e, T.label), E.removeNode(j), T.label.points = [{ x: P + 2 * G / 3, y: D - z }, { x: P + 5 * G / 6, y: D - z }, { x: P + G, y: D }, { x: P + 5 * G / 6, y: D + z }, { x: P + 2 * G / 3, y: D + z }], T.label.x = T.x, T.label.y = T.y;
        }
      });
    }
    function pe(E, j) {
      return a.mapValues(a.pick(E, j), Number);
    }
    function me(E) {
      var j = {};
      return E && Object.entries(E).forEach(([T, M]) => {
        typeof T == "string" && (T = T.toLowerCase()), j[T] = M;
      }), j;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, d, u) {
    let f = e("./util");
    d.exports = { run: h, cleanup: n };
    function h(t) {
      let l = f.addDummyNode(t, "root", {}, "_root"), s = o(t), p = Object.values(s), r = f.applyWithChunking(Math.max, p) - 1, a = 2 * r + 1;
      t.graph().nestingRoot = l, t.edges().forEach((y) => t.edge(y).minlen *= a);
      let b = i(t) + 1;
      t.children().forEach((y) => c(t, l, a, b, r, s, y)), t.graph().nodeRankFactor = a;
    }
    function c(t, l, s, p, r, a, b) {
      let y = t.children(b);
      if (!y.length) {
        b !== l && t.setEdge(l, b, { weight: 0, minlen: s });
        return;
      }
      let x = f.addBorderNode(t, "_bt"), L = f.addBorderNode(t, "_bb"), v = t.node(b);
      t.setParent(x, b), v.borderTop = x, t.setParent(L, b), v.borderBottom = L, y.forEach((O) => {
        c(t, l, s, p, r, a, O);
        let m = t.node(O), _ = m.borderTop ? m.borderTop : O, g = m.borderBottom ? m.borderBottom : O, C = m.borderTop ? p : 2 * p, S = _ !== g ? 1 : r - a[b] + 1;
        t.setEdge(x, _, { weight: C, minlen: S, nestingEdge: !0 }), t.setEdge(g, L, { weight: C, minlen: S, nestingEdge: !0 });
      }), t.parent(b) || t.setEdge(l, x, { weight: 0, minlen: r + a[b] });
    }
    function o(t) {
      var l = {};
      function s(p, r) {
        var a = t.children(p);
        a && a.length && a.forEach((b) => s(b, r + 1)), l[p] = r;
      }
      return t.children().forEach((p) => s(p, 1)), l;
    }
    function i(t) {
      return t.edges().reduce((l, s) => l + t.edge(s).weight, 0);
    }
    function n(t) {
      var l = t.graph();
      t.removeNode(l.nestingRoot), delete l.nestingRoot, t.edges().forEach((s) => {
        var p = t.edge(s);
        p.nestingEdge && t.removeEdge(s);
      });
    }
  }, { "./util": 27 }], 10: [function(e, d, u) {
    let f = e("./util");
    d.exports = { run: h, undo: o };
    function h(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => c(i, n));
    }
    function c(i, n) {
      let t = n.v, l = i.node(t).rank, s = n.w, p = i.node(s).rank, r = n.name, a = i.edge(n), b = a.labelRank;
      if (p === l + 1) return;
      i.removeEdge(n);
      let y, x, L;
      for (L = 0, ++l; l < p; ++L, ++l)
        a.points = [], x = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: l }, y = f.addDummyNode(i, "edge", x, "_d"), l === b && (x.width = a.width, x.height = a.height, x.dummy = "edge-label", x.labelpos = a.labelpos), i.setEdge(t, y, { weight: a.weight }, r), L === 0 && i.graph().dummyChains.push(y), t = y;
      i.setEdge(t, s, { weight: a.weight }, r);
    }
    function o(i) {
      i.graph().dummyChains.forEach((n) => {
        let t = i.node(n), l = t.edgeLabel, s;
        for (i.setEdge(t.edgeObj, l); t.dummy; )
          s = i.successors(n)[0], i.removeNode(n), l.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (l.x = t.x, l.y = t.y, l.width = t.width, l.height = t.height), n = s, t = i.node(n);
      });
    }
  }, { "./util": 27 }], 11: [function(e, d, u) {
    d.exports = f;
    function f(h, c, o) {
      let i = {}, n;
      o.forEach((t) => {
        let l = h.parent(t), s, p;
        for (; l; ) {
          if (s = h.parent(l), s ? (p = i[s], i[s] = l) : (p = n, n = l), p && p !== l) {
            c.setEdge(p, l);
            return;
          }
          l = s;
        }
      });
    }
  }, {}], 12: [function(e, d, u) {
    d.exports = f;
    function f(h, c = []) {
      return c.map((o) => {
        let i = h.inEdges(o);
        if (i.length) {
          let n = i.reduce((t, l) => {
            let s = h.edge(l), p = h.node(l.v);
            return { sum: t.sum + s.weight * p.order, weight: t.weight + s.weight };
          }, { sum: 0, weight: 0 });
          return { v: o, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: o };
      });
    }
  }, {}], 13: [function(e, d, u) {
    let f = e("@dagrejs/graphlib").Graph, h = e("../util");
    d.exports = c;
    function c(i, n, t, l) {
      l || (l = i.nodes());
      let s = o(i), p = new f({ compound: !0 }).setGraph({ root: s }).setDefaultNodeLabel((r) => i.node(r));
      return l.forEach((r) => {
        let a = i.node(r), b = i.parent(r);
        (a.rank === n || a.minRank <= n && n <= a.maxRank) && (p.setNode(r), p.setParent(r, b || s), i[t](r).forEach((y) => {
          let x = y.v === r ? y.w : y.v, L = p.edge(x, r), v = L !== void 0 ? L.weight : 0;
          p.setEdge(x, r, { weight: i.edge(y).weight + v });
        }), Object.hasOwn(a, "minRank") && p.setNode(r, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
      }), p;
    }
    function o(i) {
      for (var n; i.hasNode(n = h.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, d, u) {
    let f = e("../util").zipObject;
    d.exports = h;
    function h(o, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += c(o, i[t - 1], i[t]);
      return n;
    }
    function c(o, i, n) {
      let t = f(n, n.map((b, y) => y)), l = i.flatMap((b) => o.outEdges(b).map((y) => ({ pos: t[y.w], weight: o.edge(y).weight })).sort((y, x) => y.pos - x.pos)), s = 1;
      for (; s < n.length; ) s <<= 1;
      let p = 2 * s - 1;
      s -= 1;
      let r = new Array(p).fill(0), a = 0;
      return l.forEach((b) => {
        let y = b.pos + s;
        r[y] += b.weight;
        let x = 0;
        for (; y > 0; )
          y % 2 && (x += r[y + 1]), y = y - 1 >> 1, r[y] += b.weight;
        a += b.weight * x;
      }), a;
    }
  }, { "../util": 27 }], 15: [function(e, d, u) {
    let f = e("./init-order"), h = e("./cross-count"), c = e("./sort-subgraph"), o = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    d.exports = l;
    function l(a, b) {
      if (b && typeof b.customOrder == "function") {
        b.customOrder(a, l);
        return;
      }
      let y = t.maxRank(a), x = s(a, t.range(1, y + 1), "inEdges"), L = s(a, t.range(y - 1, -1, -1), "outEdges"), v = f(a);
      if (r(a, v), b && b.disableOptimalOrderHeuristic)
        return;
      let O = Number.POSITIVE_INFINITY, m;
      for (let _ = 0, g = 0; g < 4; ++_, ++g) {
        p(_ % 2 ? x : L, _ % 4 >= 2), v = t.buildLayerMatrix(a);
        let C = h(a, v);
        C < O && (g = 0, m = Object.assign({}, v), O = C);
      }
      r(a, m);
    }
    function s(a, b, y) {
      const x = /* @__PURE__ */ new Map(), L = (v, O) => {
        x.has(v) || x.set(v, []), x.get(v).push(O);
      };
      for (const v of a.nodes()) {
        const O = a.node(v);
        if (typeof O.rank == "number" && L(O.rank, v), typeof O.minRank == "number" && typeof O.maxRank == "number")
          for (let m = O.minRank; m <= O.maxRank; m++)
            m !== O.rank && L(m, v);
      }
      return b.map(function(v) {
        return o(a, v, y, x.get(v) || []);
      });
    }
    function p(a, b) {
      let y = new n();
      a.forEach(function(x) {
        let L = x.graph().root, v = c(x, L, y, b);
        v.vs.forEach((O, m) => x.node(O).order = m), i(x, y, v.vs);
      });
    }
    function r(a, b) {
      Object.values(b).forEach((y) => y.forEach((x, L) => a.node(x).order = L));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, d, u) {
    let f = e("../util");
    d.exports = h;
    function h(c) {
      let o = {}, i = c.nodes().filter((r) => !c.children(r).length), n = i.map((r) => c.node(r).rank), t = f.applyWithChunking(Math.max, n), l = f.range(t + 1).map(() => []);
      function s(r) {
        if (o[r]) return;
        o[r] = !0;
        let a = c.node(r);
        l[a.rank].push(r), c.successors(r).forEach(s);
      }
      return i.sort((r, a) => c.node(r).rank - c.node(a).rank).forEach(s), l;
    }
  }, { "../util": 27 }], 17: [function(e, d, u) {
    let f = e("../util");
    d.exports = h;
    function h(i, n) {
      let t = {};
      i.forEach((s, p) => {
        let r = t[s.v] = { indegree: 0, in: [], out: [], vs: [s.v], i: p };
        s.barycenter !== void 0 && (r.barycenter = s.barycenter, r.weight = s.weight);
      }), n.edges().forEach((s) => {
        let p = t[s.v], r = t[s.w];
        p !== void 0 && r !== void 0 && (r.indegree++, p.out.push(t[s.w]));
      });
      let l = Object.values(t).filter((s) => !s.indegree);
      return c(l);
    }
    function c(i) {
      let n = [];
      function t(s) {
        return (p) => {
          p.merged || (p.barycenter === void 0 || s.barycenter === void 0 || p.barycenter >= s.barycenter) && o(s, p);
        };
      }
      function l(s) {
        return (p) => {
          p.in.push(s), --p.indegree === 0 && i.push(p);
        };
      }
      for (; i.length; ) {
        let s = i.pop();
        n.push(s), s.in.reverse().forEach(t(s)), s.out.forEach(l(s));
      }
      return n.filter((s) => !s.merged).map((s) => f.pick(s, ["vs", "i", "barycenter", "weight"]));
    }
    function o(i, n) {
      let t = 0, l = 0;
      i.weight && (t += i.barycenter * i.weight, l += i.weight), n.weight && (t += n.barycenter * n.weight, l += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / l, i.weight = l, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, d, u) {
    let f = e("./barycenter"), h = e("./resolve-conflicts"), c = e("./sort");
    d.exports = o;
    function o(t, l, s, p) {
      let r = t.children(l), a = t.node(l), b = a ? a.borderLeft : void 0, y = a ? a.borderRight : void 0, x = {};
      b && (r = r.filter((m) => m !== b && m !== y));
      let L = f(t, r);
      L.forEach((m) => {
        if (t.children(m.v).length) {
          let _ = o(t, m.v, s, p);
          x[m.v] = _, Object.hasOwn(_, "barycenter") && n(m, _);
        }
      });
      let v = h(L, s);
      i(v, x);
      let O = c(v, p);
      if (b && (O.vs = [b, O.vs, y].flat(!0), t.predecessors(b).length)) {
        let m = t.node(t.predecessors(b)[0]), _ = t.node(t.predecessors(y)[0]);
        Object.hasOwn(O, "barycenter") || (O.barycenter = 0, O.weight = 0), O.barycenter = (O.barycenter * O.weight + m.order + _.order) / (O.weight + 2), O.weight += 2;
      }
      return O;
    }
    function i(t, l) {
      t.forEach((s) => {
        s.vs = s.vs.flatMap((p) => l[p] ? l[p].vs : p);
      });
    }
    function n(t, l) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + l.barycenter * l.weight) / (t.weight + l.weight), t.weight += l.weight) : (t.barycenter = l.barycenter, t.weight = l.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, d, u) {
    let f = e("../util");
    d.exports = h;
    function h(i, n) {
      let t = f.partition(i, (x) => Object.hasOwn(x, "barycenter")), l = t.lhs, s = t.rhs.sort((x, L) => L.i - x.i), p = [], r = 0, a = 0, b = 0;
      l.sort(o(!!n)), b = c(p, s, b), l.forEach((x) => {
        b += x.vs.length, p.push(x.vs), r += x.barycenter * x.weight, a += x.weight, b = c(p, s, b);
      });
      let y = { vs: p.flat(!0) };
      return a && (y.barycenter = r / a, y.weight = a), y;
    }
    function c(i, n, t) {
      let l;
      for (; n.length && (l = n[n.length - 1]).i <= t; )
        n.pop(), i.push(l.vs), t++;
      return t;
    }
    function o(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, d, u) {
    d.exports = f;
    function f(o) {
      let i = c(o);
      o.graph().dummyChains.forEach((n) => {
        let t = o.node(n), l = t.edgeObj, s = h(o, i, l.v, l.w), p = s.path, r = s.lca, a = 0, b = p[a], y = !0;
        for (; n !== l.w; ) {
          if (t = o.node(n), y) {
            for (; (b = p[a]) !== r && o.node(b).maxRank < t.rank; )
              a++;
            b === r && (y = !1);
          }
          if (!y) {
            for (; a < p.length - 1 && o.node(b = p[a + 1]).minRank <= t.rank; )
              a++;
            b = p[a];
          }
          o.setParent(n, b), n = o.successors(n)[0];
        }
      });
    }
    function h(o, i, n, t) {
      let l = [], s = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), a, b;
      a = n;
      do
        a = o.parent(a), l.push(a);
      while (a && (i[a].low > p || r > i[a].lim));
      for (b = a, a = t; (a = o.parent(a)) !== b; )
        s.push(a);
      return { path: l.concat(s.reverse()), lca: b };
    }
    function c(o) {
      let i = {}, n = 0;
      function t(l) {
        let s = n;
        o.children(l).forEach(t), i[l] = { low: s, lim: n++ };
      }
      return o.children().forEach(t), i;
    }
  }, {}], 21: [function(e, d, u) {
    let f = e("@dagrejs/graphlib").Graph, h = e("../util");
    d.exports = { positionX: y, findType1Conflicts: c, findType2Conflicts: o, addConflict: n, hasConflict: t, verticalAlignment: l, horizontalCompaction: s, alignCoordinates: a, findSmallestWidthAlignment: r, balance: b };
    function c(v, O) {
      let m = {};
      function _(g, C) {
        let S = 0, A = 0, w = g.length, k = C[C.length - 1];
        return C.forEach((N, I) => {
          let R = i(v, N), V = R ? v.node(R).order : w;
          (R || N === k) && (C.slice(A, I + 1).forEach(($) => {
            v.predecessors($).forEach((F) => {
              let H = v.node(F), q = H.order;
              (q < S || V < q) && !(H.dummy && v.node($).dummy) && n(m, F, $);
            });
          }), A = I + 1, S = V);
        }), C;
      }
      return O.length && O.reduce(_), m;
    }
    function o(v, O) {
      let m = {};
      function _(C, S, A, w, k) {
        let N;
        h.range(S, A).forEach((I) => {
          N = C[I], v.node(N).dummy && v.predecessors(N).forEach((R) => {
            let V = v.node(R);
            V.dummy && (V.order < w || V.order > k) && n(m, R, N);
          });
        });
      }
      function g(C, S) {
        let A = -1, w, k = 0;
        return S.forEach((N, I) => {
          if (v.node(N).dummy === "border") {
            let R = v.predecessors(N);
            R.length && (w = v.node(R[0]).order, _(S, k, I, A, w), k = I, A = w);
          }
          _(S, k, S.length, w, C.length);
        }), S;
      }
      return O.length && O.reduce(g), m;
    }
    function i(v, O) {
      if (v.node(O).dummy)
        return v.predecessors(O).find((m) => v.node(m).dummy);
    }
    function n(v, O, m) {
      if (O > m) {
        let g = O;
        O = m, m = g;
      }
      let _ = v[O];
      _ || (v[O] = _ = {}), _[m] = !0;
    }
    function t(v, O, m) {
      if (O > m) {
        let _ = O;
        O = m, m = _;
      }
      return !!v[O] && Object.hasOwn(v[O], m);
    }
    function l(v, O, m, _) {
      let g = {}, C = {}, S = {};
      return O.forEach((A) => {
        A.forEach((w, k) => {
          g[w] = w, C[w] = w, S[w] = k;
        });
      }), O.forEach((A) => {
        let w = -1;
        A.forEach((k) => {
          let N = _(k);
          if (N.length) {
            N = N.sort((R, V) => S[R] - S[V]);
            let I = (N.length - 1) / 2;
            for (let R = Math.floor(I), V = Math.ceil(I); R <= V; ++R) {
              let $ = N[R];
              C[k] === k && w < S[$] && !t(m, k, $) && (C[$] = k, C[k] = g[k] = g[$], w = S[$]);
            }
          }
        });
      }), { root: g, align: C };
    }
    function s(v, O, m, _, g) {
      let C = {}, S = p(v, O, m, g), A = g ? "borderLeft" : "borderRight";
      function w(I, R) {
        let V = S.nodes(), $ = V.pop(), F = {};
        for (; $; )
          F[$] ? I($) : (F[$] = !0, V.push($), V = V.concat(R($))), $ = V.pop();
      }
      function k(I) {
        C[I] = S.inEdges(I).reduce((R, V) => Math.max(R, C[V.v] + S.edge(V)), 0);
      }
      function N(I) {
        let R = S.outEdges(I).reduce(($, F) => Math.min($, C[F.w] - S.edge(F)), Number.POSITIVE_INFINITY), V = v.node(I);
        R !== Number.POSITIVE_INFINITY && V.borderType !== A && (C[I] = Math.max(C[I], R));
      }
      return w(k, S.predecessors.bind(S)), w(N, S.successors.bind(S)), Object.keys(_).forEach((I) => C[I] = C[m[I]]), C;
    }
    function p(v, O, m, _) {
      let g = new f(), C = v.graph(), S = x(C.nodesep, C.edgesep, _);
      return O.forEach((A) => {
        let w;
        A.forEach((k) => {
          let N = m[k];
          if (g.setNode(N), w) {
            var I = m[w], R = g.edge(I, N);
            g.setEdge(I, N, Math.max(S(v, k, w), R || 0));
          }
          w = k;
        });
      }), g;
    }
    function r(v, O) {
      return Object.values(O).reduce((m, _) => {
        let g = Number.NEGATIVE_INFINITY, C = Number.POSITIVE_INFINITY;
        Object.entries(_).forEach(([A, w]) => {
          let k = L(v, A) / 2;
          g = Math.max(w + k, g), C = Math.min(w - k, C);
        });
        const S = g - C;
        return S < m[0] && (m = [S, _]), m;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function a(v, O) {
      let m = Object.values(O), _ = h.applyWithChunking(Math.min, m), g = h.applyWithChunking(Math.max, m);
      ["u", "d"].forEach((C) => {
        ["l", "r"].forEach((S) => {
          let A = C + S, w = v[A];
          if (w === O) return;
          let k = Object.values(w), N = _ - h.applyWithChunking(Math.min, k);
          S !== "l" && (N = g - h.applyWithChunking(Math.max, k)), N && (v[A] = h.mapValues(w, (I) => I + N));
        });
      });
    }
    function b(v, O) {
      return h.mapValues(v.ul, (m, _) => {
        if (O)
          return v[O.toLowerCase()][_];
        {
          let g = Object.values(v).map((C) => C[_]).sort((C, S) => C - S);
          return (g[1] + g[2]) / 2;
        }
      });
    }
    function y(v) {
      let O = h.buildLayerMatrix(v), m = Object.assign(c(v, O), o(v, O)), _ = {}, g;
      ["u", "d"].forEach((S) => {
        g = S === "u" ? O : Object.values(O).reverse(), ["l", "r"].forEach((A) => {
          A === "r" && (g = g.map((I) => Object.values(I).reverse()));
          let w = (S === "u" ? v.predecessors : v.successors).bind(v), k = l(v, g, m, w), N = s(v, g, k.root, k.align, A === "r");
          A === "r" && (N = h.mapValues(N, (I) => -I)), _[S + A] = N;
        });
      });
      let C = r(v, _);
      return a(_, C), b(_, v.graph().align);
    }
    function x(v, O, m) {
      return (_, g, C) => {
        let S = _.node(g), A = _.node(C), w = 0, k;
        if (w += S.width / 2, Object.hasOwn(S, "labelpos"))
          switch (S.labelpos.toLowerCase()) {
            case "l":
              k = -S.width / 2;
              break;
            case "r":
              k = S.width / 2;
              break;
          }
        if (k && (w += m ? k : -k), k = 0, w += (S.dummy ? O : v) / 2, w += (A.dummy ? O : v) / 2, w += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              k = A.width / 2;
              break;
            case "r":
              k = -A.width / 2;
              break;
          }
        return k && (w += m ? k : -k), k = 0, w;
      };
    }
    function L(v, O) {
      return v.node(O).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, d, u) {
    let f = e("../util"), h = e("./bk").positionX;
    d.exports = c;
    function c(i) {
      i = f.asNonCompoundGraph(i), o(i), Object.entries(h(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function o(i) {
      let n = f.buildLayerMatrix(i), t = i.graph().ranksep, l = 0;
      n.forEach((s) => {
        const p = s.reduce((r, a) => {
          const b = i.node(a).height;
          return r > b ? r : b;
        }, 0);
        s.forEach((r) => i.node(r).y = l + p / 2), l += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, d, u) {
    var f = e("@dagrejs/graphlib").Graph, h = e("./util").slack;
    d.exports = c;
    function c(t) {
      var l = new f({ directed: !1 }), s = t.nodes()[0], p = t.nodeCount();
      l.setNode(s, {});
      for (var r, a; o(l, t) < p; )
        r = i(l, t), a = l.hasNode(r.v) ? h(t, r) : -h(t, r), n(l, t, a);
      return l;
    }
    function o(t, l) {
      function s(p) {
        l.nodeEdges(p).forEach((r) => {
          var a = r.v, b = p === a ? r.w : a;
          !t.hasNode(b) && !h(l, r) && (t.setNode(b, {}), t.setEdge(p, b, {}), s(b));
        });
      }
      return t.nodes().forEach(s), t.nodeCount();
    }
    function i(t, l) {
      return l.edges().reduce((p, r) => {
        let a = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (a = h(l, r)), a < p[0] ? [a, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, l, s) {
      t.nodes().forEach((p) => l.node(p).rank += s);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, d, u) {
    var f = e("./util"), h = f.longestPath, c = e("./feasible-tree"), o = e("./network-simplex");
    d.exports = i;
    function i(s) {
      var p = s.graph().ranker;
      if (p instanceof Function)
        return p(s);
      switch (s.graph().ranker) {
        case "network-simplex":
          l(s);
          break;
        case "tight-tree":
          t(s);
          break;
        case "longest-path":
          n(s);
          break;
        case "none":
          break;
        default:
          l(s);
      }
    }
    var n = h;
    function t(s) {
      h(s), c(s);
    }
    function l(s) {
      o(s);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, d, u) {
    var f = e("./feasible-tree"), h = e("./util").slack, c = e("./util").longestPath, o = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    d.exports = t, t.initLowLimValues = r, t.initCutValues = l, t.calcCutValue = p, t.leaveEdge = b, t.enterEdge = y, t.exchangeEdges = x;
    function t(m) {
      m = n(m), c(m);
      var _ = f(m);
      r(_), l(_, m);
      for (var g, C; g = b(_); )
        C = y(_, m, g), x(_, m, g, C);
    }
    function l(m, _) {
      var g = i(m, m.nodes());
      g = g.slice(0, g.length - 1), g.forEach((C) => s(m, _, C));
    }
    function s(m, _, g) {
      var C = m.node(g), S = C.parent;
      m.edge(g, S).cutvalue = p(m, _, g);
    }
    function p(m, _, g) {
      var C = m.node(g), S = C.parent, A = !0, w = _.edge(g, S), k = 0;
      return w || (A = !1, w = _.edge(S, g)), k = w.weight, _.nodeEdges(g).forEach((N) => {
        var I = N.v === g, R = I ? N.w : N.v;
        if (R !== S) {
          var V = I === A, $ = _.edge(N).weight;
          if (k += V ? $ : -$, v(m, g, R)) {
            var F = m.edge(g, R).cutvalue;
            k += V ? -F : F;
          }
        }
      }), k;
    }
    function r(m, _) {
      arguments.length < 2 && (_ = m.nodes()[0]), a(m, {}, 1, _);
    }
    function a(m, _, g, C, S) {
      var A = g, w = m.node(C);
      return _[C] = !0, m.neighbors(C).forEach((k) => {
        Object.hasOwn(_, k) || (g = a(m, _, g, k, C));
      }), w.low = A, w.lim = g++, S ? w.parent = S : delete w.parent, g;
    }
    function b(m) {
      return m.edges().find((_) => m.edge(_).cutvalue < 0);
    }
    function y(m, _, g) {
      var C = g.v, S = g.w;
      _.hasEdge(C, S) || (C = g.w, S = g.v);
      var A = m.node(C), w = m.node(S), k = A, N = !1;
      A.lim > w.lim && (k = w, N = !0);
      var I = _.edges().filter((R) => N === O(m, m.node(R.v), k) && N !== O(m, m.node(R.w), k));
      return I.reduce((R, V) => h(_, V) < h(_, R) ? V : R);
    }
    function x(m, _, g, C) {
      var S = g.v, A = g.w;
      m.removeEdge(S, A), m.setEdge(C.v, C.w, {}), r(m), l(m, _), L(m, _);
    }
    function L(m, _) {
      var g = m.nodes().find((S) => !_.node(S).parent), C = o(m, g);
      C = C.slice(1), C.forEach((S) => {
        var A = m.node(S).parent, w = _.edge(S, A), k = !1;
        w || (w = _.edge(A, S), k = !0), _.node(S).rank = _.node(A).rank + (k ? w.minlen : -w.minlen);
      });
    }
    function v(m, _, g) {
      return m.hasEdge(_, g);
    }
    function O(m, _, g) {
      return g.low <= _.lim && _.lim <= g.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, d, u) {
    const { applyWithChunking: f } = e("../util");
    d.exports = { longestPath: h, slack: c };
    function h(o) {
      var i = {};
      function n(t) {
        var l = o.node(t);
        if (Object.hasOwn(i, t))
          return l.rank;
        i[t] = !0;
        let s = o.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - o.edge(r).minlen);
        var p = f(Math.min, s);
        return p === Number.POSITIVE_INFINITY && (p = 0), l.rank = p;
      }
      o.sources().forEach(n);
    }
    function c(o, i) {
      return o.node(i.w).rank - o.node(i.v).rank - o.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, d, u) {
    let f = e("@dagrejs/graphlib").Graph;
    d.exports = { addBorderNode: r, addDummyNode: h, applyWithChunking: y, asNonCompoundGraph: o, buildLayerMatrix: l, intersectRect: t, mapValues: S, maxRank: x, normalizeRanks: s, notime: O, partition: L, pick: C, predecessorWeights: n, range: g, removeEmptyRanks: p, simplify: c, successorWeights: i, time: v, uniqueId: _, zipObject: A };
    function h(w, k, N, I) {
      for (var R = I; w.hasNode(R); )
        R = _(I);
      return N.dummy = k, w.setNode(R, N), R;
    }
    function c(w) {
      let k = new f().setGraph(w.graph());
      return w.nodes().forEach((N) => k.setNode(N, w.node(N))), w.edges().forEach((N) => {
        let I = k.edge(N.v, N.w) || { weight: 0, minlen: 1 }, R = w.edge(N);
        k.setEdge(N.v, N.w, { weight: I.weight + R.weight, minlen: Math.max(I.minlen, R.minlen) });
      }), k;
    }
    function o(w) {
      let k = new f({ multigraph: w.isMultigraph() }).setGraph(w.graph());
      return w.nodes().forEach((N) => {
        w.children(N).length || k.setNode(N, w.node(N));
      }), w.edges().forEach((N) => {
        k.setEdge(N, w.edge(N));
      }), k;
    }
    function i(w) {
      let k = w.nodes().map((N) => {
        let I = {};
        return w.outEdges(N).forEach((R) => {
          I[R.w] = (I[R.w] || 0) + w.edge(R).weight;
        }), I;
      });
      return A(w.nodes(), k);
    }
    function n(w) {
      let k = w.nodes().map((N) => {
        let I = {};
        return w.inEdges(N).forEach((R) => {
          I[R.v] = (I[R.v] || 0) + w.edge(R).weight;
        }), I;
      });
      return A(w.nodes(), k);
    }
    function t(w, k) {
      let N = w.x, I = w.y, R = k.x - N, V = k.y - I, $ = w.width / 2, F = w.height / 2;
      if (!R && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, q;
      return Math.abs(V) * $ > Math.abs(R) * F ? (V < 0 && (F = -F), H = F * R / V, q = F) : (R < 0 && ($ = -$), H = $, q = $ * V / R), { x: N + H, y: I + q };
    }
    function l(w) {
      let k = g(x(w) + 1).map(() => []);
      return w.nodes().forEach((N) => {
        let I = w.node(N), R = I.rank;
        R !== void 0 && (k[R][I.order] = N);
      }), k;
    }
    function s(w) {
      let k = w.nodes().map((I) => {
        let R = w.node(I).rank;
        return R === void 0 ? Number.MAX_VALUE : R;
      }), N = y(Math.min, k);
      w.nodes().forEach((I) => {
        let R = w.node(I);
        Object.hasOwn(R, "rank") && (R.rank -= N);
      });
    }
    function p(w) {
      let k = w.nodes().map(($) => w.node($).rank), N = y(Math.min, k), I = [];
      w.nodes().forEach(($) => {
        let F = w.node($).rank - N;
        I[F] || (I[F] = []), I[F].push($);
      });
      let R = 0, V = w.graph().nodeRankFactor;
      Array.from(I).forEach(($, F) => {
        $ === void 0 && F % V !== 0 ? --R : $ !== void 0 && R && $.forEach((H) => w.node(H).rank += R);
      });
    }
    function r(w, k, N, I) {
      let R = { width: 0, height: 0 };
      return arguments.length >= 4 && (R.rank = N, R.order = I), h(w, "border", R, k);
    }
    function a(w, k = b) {
      const N = [];
      for (let I = 0; I < w.length; I += k) {
        const R = w.slice(I, I + k);
        N.push(R);
      }
      return N;
    }
    const b = 65535;
    function y(w, k) {
      if (k.length > b) {
        const N = a(k);
        return w.apply(null, N.map((I) => w.apply(null, I)));
      } else
        return w.apply(null, k);
    }
    function x(w) {
      const N = w.nodes().map((I) => {
        let R = w.node(I).rank;
        return R === void 0 ? Number.MIN_VALUE : R;
      });
      return y(Math.max, N);
    }
    function L(w, k) {
      let N = { lhs: [], rhs: [] };
      return w.forEach((I) => {
        k(I) ? N.lhs.push(I) : N.rhs.push(I);
      }), N;
    }
    function v(w, k) {
      let N = Date.now();
      try {
        return k();
      } finally {
        console.log(w + " time: " + (Date.now() - N) + "ms");
      }
    }
    function O(w, k) {
      return k();
    }
    let m = 0;
    function _(w) {
      var k = ++m;
      return w + ("" + k);
    }
    function g(w, k, N = 1) {
      k == null && (k = w, w = 0);
      let I = (V) => V < k;
      N < 0 && (I = (V) => k < V);
      const R = [];
      for (let V = w; I(V); V += N)
        R.push(V);
      return R;
    }
    function C(w, k) {
      const N = {};
      for (const I of k)
        w[I] !== void 0 && (N[I] = w[I]);
      return N;
    }
    function S(w, k) {
      let N = k;
      return typeof k == "string" && (N = (I) => I[k]), Object.entries(w).reduce((I, [R, V]) => (I[R] = N(V, R), I), {});
    }
    function A(w, k) {
      return w.reduce((N, I, R) => (N[I] = k[R], N), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, d, u) {
    d.exports = "1.1.8";
  }, {}], 29: [function(e, d, u) {
    var f = e("./lib");
    d.exports = { Graph: f.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: f.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, d, u) {
    d.exports = f;
    function f(h) {
      var c = {}, o = [], i;
      function n(t) {
        Object.hasOwn(c, t) || (c[t] = !0, i.push(t), h.successors(t).forEach(n), h.predecessors(t).forEach(n));
      }
      return h.nodes().forEach(function(t) {
        i = [], n(t), i.length && o.push(i);
      }), o;
    }
  }, {}], 31: [function(e, d, u) {
    d.exports = f;
    function f(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var l = i.isDirected() ? (a) => i.successors(a) : (a) => i.neighbors(a), s = t === "post" ? h : c, p = [], r = {};
      return n.forEach((a) => {
        if (!i.hasNode(a))
          throw new Error("Graph does not have node: " + a);
        s(a, l, r, p);
      }), p;
    }
    function h(i, n, t, l) {
      for (var s = [[i, !1]]; s.length > 0; ) {
        var p = s.pop();
        p[1] ? l.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, s.push([p[0], !0]), o(n(p[0]), (r) => s.push([r, !1])));
      }
    }
    function c(i, n, t, l) {
      for (var s = [i]; s.length > 0; ) {
        var p = s.pop();
        Object.hasOwn(t, p) || (t[p] = !0, l.push(p), o(n(p), (r) => s.push(r)));
      }
    }
    function o(i, n) {
      for (var t = i.length; t--; )
        n(i[t], t, i);
      return i;
    }
  }, {}], 32: [function(e, d, u) {
    var f = e("./dijkstra");
    d.exports = h;
    function h(c, o, i) {
      return c.nodes().reduce(function(n, t) {
        return n[t] = f(c, t, o, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, d, u) {
    var f = e("../data/priority-queue");
    d.exports = c;
    var h = () => 1;
    function c(i, n, t, l) {
      return o(i, String(n), t || h, l || function(s) {
        return i.outEdges(s);
      });
    }
    function o(i, n, t, l) {
      var s = {}, p = new f(), r, a, b = function(y) {
        var x = y.v !== r ? y.v : y.w, L = s[x], v = t(y), O = a.distance + v;
        if (v < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + y + " Weight: " + v);
        O < L.distance && (L.distance = O, L.predecessor = r, p.decrease(x, O));
      };
      for (i.nodes().forEach(function(y) {
        var x = y === n ? 0 : Number.POSITIVE_INFINITY;
        s[y] = { distance: x }, p.add(y, x);
      }); p.size() > 0 && (r = p.removeMin(), a = s[r], a.distance !== Number.POSITIVE_INFINITY); )
        l(r).forEach(b);
      return s;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, d, u) {
    var f = e("./tarjan");
    d.exports = h;
    function h(c) {
      return f(c).filter(function(o) {
        return o.length > 1 || o.length === 1 && c.hasEdge(o[0], o[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, d, u) {
    d.exports = h;
    var f = () => 1;
    function h(o, i, n) {
      return c(o, i || f, n || function(t) {
        return o.outEdges(t);
      });
    }
    function c(o, i, n) {
      var t = {}, l = o.nodes();
      return l.forEach(function(s) {
        t[s] = {}, t[s][s] = { distance: 0 }, l.forEach(function(p) {
          s !== p && (t[s][p] = { distance: Number.POSITIVE_INFINITY });
        }), n(s).forEach(function(p) {
          var r = p.v === s ? p.w : p.v, a = i(p);
          t[s][r] = { distance: a, predecessor: s };
        });
      }), l.forEach(function(s) {
        var p = t[s];
        l.forEach(function(r) {
          var a = t[r];
          l.forEach(function(b) {
            var y = a[s], x = p[b], L = a[b], v = y.distance + x.distance;
            v < L.distance && (L.distance = v, L.predecessor = x.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, d, u) {
    d.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, d, u) {
    var f = e("./topsort");
    d.exports = h;
    function h(c) {
      try {
        f(c);
      } catch (o) {
        if (o instanceof f.CycleException)
          return !1;
        throw o;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, d, u) {
    var f = e("./dfs");
    d.exports = h;
    function h(c, o) {
      return f(c, o, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, d, u) {
    var f = e("./dfs");
    d.exports = h;
    function h(c, o) {
      return f(c, o, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, d, u) {
    var f = e("../graph"), h = e("../data/priority-queue");
    d.exports = c;
    function c(o, i) {
      var n = new f(), t = {}, l = new h(), s;
      function p(a) {
        var b = a.v === s ? a.w : a.v, y = l.priority(b);
        if (y !== void 0) {
          var x = i(a);
          x < y && (t[b] = s, l.decrease(b, x));
        }
      }
      if (o.nodeCount() === 0)
        return n;
      o.nodes().forEach(function(a) {
        l.add(a, Number.POSITIVE_INFINITY), n.setNode(a);
      }), l.decrease(o.nodes()[0], 0);
      for (var r = !1; l.size() > 0; ) {
        if (s = l.removeMin(), Object.hasOwn(t, s))
          n.setEdge(s, t[s]);
        else {
          if (r)
            throw new Error("Input graph is not connected: " + o);
          r = !0;
        }
        o.nodeEdges(s).forEach(p);
      }
      return n;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, d, u) {
    d.exports = f;
    function f(h) {
      var c = 0, o = [], i = {}, n = [];
      function t(l) {
        var s = i[l] = { onStack: !0, lowlink: c, index: c++ };
        if (o.push(l), h.successors(l).forEach(function(a) {
          Object.hasOwn(i, a) ? i[a].onStack && (s.lowlink = Math.min(s.lowlink, i[a].index)) : (t(a), s.lowlink = Math.min(s.lowlink, i[a].lowlink));
        }), s.lowlink === s.index) {
          var p = [], r;
          do
            r = o.pop(), i[r].onStack = !1, p.push(r);
          while (l !== r);
          n.push(p);
        }
      }
      return h.nodes().forEach(function(l) {
        Object.hasOwn(i, l) || t(l);
      }), n;
    }
  }, {}], 42: [function(e, d, u) {
    function f(c) {
      var o = {}, i = {}, n = [];
      function t(l) {
        if (Object.hasOwn(i, l))
          throw new h();
        Object.hasOwn(o, l) || (i[l] = !0, o[l] = !0, c.predecessors(l).forEach(t), delete i[l], n.push(l));
      }
      if (c.sinks().forEach(t), Object.keys(o).length !== c.nodeCount())
        throw new h();
      return n;
    }
    class h extends Error {
      constructor() {
        super(...arguments);
      }
    }
    d.exports = f, f.CycleException = h;
  }, {}], 43: [function(e, d, u) {
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
        return this._arr.map(function(c) {
          return c.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(c) {
        return Object.hasOwn(this._keyIndices, c);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(c) {
        var o = this._keyIndices[c];
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
      add(c, o) {
        var i = this._keyIndices;
        if (c = String(c), !Object.hasOwn(i, c)) {
          var n = this._arr, t = n.length;
          return i[c] = t, n.push({ key: c, priority: o }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var c = this._arr.pop();
        return delete this._keyIndices[c.key], this._heapify(0), c.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(c, o) {
        var i = this._keyIndices[c];
        if (o > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + c + " Old: " + this._arr[i].priority + " New: " + o);
        this._arr[i].priority = o, this._decrease(i);
      }
      _heapify(c) {
        var o = this._arr, i = 2 * c, n = i + 1, t = c;
        i < o.length && (t = o[i].priority < o[t].priority ? i : t, n < o.length && (t = o[n].priority < o[t].priority ? n : t), t !== c && (this._swap(c, t), this._heapify(t)));
      }
      _decrease(c) {
        for (var o = this._arr, i = o[c].priority, n; c !== 0 && (n = c >> 1, !(o[n].priority < i)); )
          this._swap(c, n), c = n;
      }
      _swap(c, o) {
        var i = this._arr, n = this._keyIndices, t = i[c], l = i[o];
        i[c] = l, i[o] = t, n[l.key] = c, n[t.key] = o;
      }
    }
    d.exports = f;
  }, {}], 44: [function(e, d, u) {
    var f = "\0", h = "\0", c = "";
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
      constructor(r) {
        r && (this._isDirected = Object.hasOwn(r, "directed") ? r.directed : !0, this._isMultigraph = Object.hasOwn(r, "multigraph") ? r.multigraph : !1, this._isCompound = Object.hasOwn(r, "compound") ? r.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[h] = {});
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
        var b = arguments, y = this;
        return r.forEach(function(x) {
          b.length > 1 ? y.setNode(x, a) : y.setNode(x);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(r, a) {
        return Object.hasOwn(this._nodes, r) ? (arguments.length > 1 && (this._nodes[r] = a), this) : (this._nodes[r] = arguments.length > 1 ? a : this._defaultNodeLabelFn(r), this._isCompound && (this._parent[r] = h, this._children[r] = {}, this._children[h][r] = !0), this._in[r] = {}, this._preds[r] = {}, this._out[r] = {}, this._sucs[r] = {}, ++this._nodeCount, this);
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
          var b = (y) => a.removeEdge(a._edgeObjs[y]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(y) {
            a.setParent(y);
          }), delete this._children[r]), Object.keys(this._in[r]).forEach(b), delete this._in[r], delete this._preds[r], Object.keys(this._out[r]).forEach(b), delete this._out[r], delete this._sucs[r], --this._nodeCount;
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
          a = h;
        else {
          a += "";
          for (var b = a; b !== void 0; b = this.parent(b))
            if (b === r)
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
          if (a !== h)
            return a;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(r = h) {
        if (this._isCompound) {
          var a = this._children[r];
          if (a)
            return Object.keys(a);
        } else {
          if (r === h)
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
          const y = new Set(a);
          for (var b of this.successors(r))
            y.add(b);
          return Array.from(y.values());
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
        var b = this;
        Object.entries(this._nodes).forEach(function([L, v]) {
          r(L) && a.setNode(L, v);
        }), Object.values(this._edgeObjs).forEach(function(L) {
          a.hasNode(L.v) && a.hasNode(L.w) && a.setEdge(L, b.edge(L));
        });
        var y = {};
        function x(L) {
          var v = b.parent(L);
          return v === void 0 || a.hasNode(v) ? (y[L] = v, v) : v in y ? y[v] : x(v);
        }
        return this._isCompound && a.nodes().forEach((L) => a.setParent(L, x(L))), a;
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
        var b = this, y = arguments;
        return r.reduce(function(x, L) {
          return y.length > 1 ? b.setEdge(x, L, a) : b.setEdge(x, L), L;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, a, b, y, x = !1, L = arguments[0];
        typeof L == "object" && L !== null && "v" in L ? (r = L.v, a = L.w, b = L.name, arguments.length === 2 && (y = arguments[1], x = !0)) : (r = L, a = arguments[1], b = arguments[3], arguments.length > 2 && (y = arguments[2], x = !0)), r = "" + r, a = "" + a, b !== void 0 && (b = "" + b);
        var v = t(this._isDirected, r, a, b);
        if (Object.hasOwn(this._edgeLabels, v))
          return x && (this._edgeLabels[v] = y), this;
        if (b !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(a), this._edgeLabels[v] = x ? y : this._defaultEdgeLabelFn(r, a, b);
        var O = l(this._isDirected, r, a, b);
        return r = O.v, a = O.w, Object.freeze(O), this._edgeObjs[v] = O, i(this._preds[a], r), i(this._sucs[r], a), this._in[a][v] = O, this._out[r][v] = O, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, a, b) {
        var y = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, b);
        return this._edgeLabels[y];
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
      hasEdge(r, a, b) {
        var y = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, b);
        return Object.hasOwn(this._edgeLabels, y);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, a, b) {
        var y = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, b), x = this._edgeObjs[y];
        return x && (r = x.v, a = x.w, delete this._edgeLabels[y], delete this._edgeObjs[y], n(this._preds[a], r), n(this._sucs[r], a), delete this._in[a][y], delete this._out[r][y], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, a) {
        var b = this._in[r];
        if (b) {
          var y = Object.values(b);
          return a ? y.filter((x) => x.v === a) : y;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(r, a) {
        var b = this._out[r];
        if (b) {
          var y = Object.values(b);
          return a ? y.filter((x) => x.w === a) : y;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(r, a) {
        var b = this.inEdges(r, a);
        if (b)
          return b.concat(this.outEdges(r, a));
      }
    }
    function i(p, r) {
      p[r] ? p[r]++ : p[r] = 1;
    }
    function n(p, r) {
      --p[r] || delete p[r];
    }
    function t(p, r, a, b) {
      var y = "" + r, x = "" + a;
      if (!p && y > x) {
        var L = y;
        y = x, x = L;
      }
      return y + c + x + c + (b === void 0 ? f : b);
    }
    function l(p, r, a, b) {
      var y = "" + r, x = "" + a;
      if (!p && y > x) {
        var L = y;
        y = x, x = L;
      }
      var v = { v: y, w: x };
      return b && (v.name = b), v;
    }
    function s(p, r) {
      return t(p, r.v, r.w, r.name);
    }
    d.exports = o;
  }, {}], 45: [function(e, d, u) {
    d.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, d, u) {
    var f = e("./graph");
    d.exports = { write: h, read: i };
    function h(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: c(n), edges: o(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function c(n) {
      return n.nodes().map(function(t) {
        var l = n.node(t), s = n.parent(t), p = { v: t };
        return l !== void 0 && (p.value = l), s !== void 0 && (p.parent = s), p;
      });
    }
    function o(n) {
      return n.edges().map(function(t) {
        var l = n.edge(t), s = { v: t.v, w: t.w };
        return t.name !== void 0 && (s.name = t.name), l !== void 0 && (s.value = l), s;
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
  }, { "./graph": 44 }], 47: [function(e, d, u) {
    d.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), Gt = ["unstarted", "started", "completed", "canceled"];
function Ut(e, d) {
  let u = 1;
  const f = () => `${e.slice(0, 40 - String(u).length - 1)}_${u}`;
  for (; d.some((h) => h.id === f()); ) u++;
  return f();
}
function Bt(e, d) {
  return [
    ...e.initial === d.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((u) => u.to === d.id || u.from !== "any" && u.from.includes(d.id)).map((u) => `transition ${vt(u)}`),
    ...e.states.filter((u) => u.regions?.some((f) => f.initial === d.id)).map((u) => `lanes in ${Se(u)}`),
    ...Object.entries(e.map ?? {}).filter(([, u]) => u === d.id).map(() => "existing item migration")
  ];
}
function Wt(e, d) {
  return e.states.flatMap((u) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => u.run?.[f] === d.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${Se(u)}`),
    ...(u.timers ?? []).filter((f) => f.then?.transition === d.id).map(() => "a timer")
  ]);
}
const Se = (e) => e?.name || "Untitled state", vt = (e) => e.name?.trim() || he(e.id), Yt = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", zt = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function Jt(e, d) {
  if (e.id === d.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const u = e.release_when?.approvals?.min;
    return u ? `Needs ${u} approval${u === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Me(e) : "A person moves it";
}
function Me(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Ht(e, d) {
  const u = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${u === 1 ? "one person approves" : `${u} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Me(e)}.` : "A person chooses when to move the item on.", h = d.policy?.wip?.[e.id]?.limit;
  return f + (h !== void 0 ? ` At most ${h} at a time.` : "");
}
function Kt(e) {
  const d = e.transitions ?? [], u = [], f = /* @__PURE__ */ new Set();
  let h = e.states.find((o) => o.id === e.initial);
  const c = new Map(e.states.map((o, i) => [o.id, i]));
  for (; h && !f.has(h.id) && (u.push(h), f.add(h.id), !(h.category === "completed" || h.category === "canceled")); ) {
    const o = h, i = d.filter((t) => t.from !== "any" && t.from.includes(o.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (c.get(t.to) ?? -1) > (c.get(o.id) ?? 0));
    h = e.states.find((t) => t.id === n?.to);
  }
  return u;
}
function Ae(e) {
  const d = e.states.find((u) => u.id === e.initial);
  return e.migration ?? (d?.kind === "automated" || d?.kind === "parallel" ? "pin" : "follow");
}
const te = (e) => JSON.parse(JSON.stringify(e));
function qt(e) {
  return e?.admin === !0;
}
function Xt(e, d, u) {
  const f = d + u;
  if (d < 0 || d >= e.length || f < 0 || f >= e.length) return;
  const [h] = e.splice(d, 1);
  e.splice(f, 0, h);
}
function Qt(e, d, u) {
  const f = d.code;
  if (f === u) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  d.code = u;
  const h = (n) => n === f ? u : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(h), n.inherit && (n.inherit = n.inherit.map(h));
  const c = (n) => {
    for (const t of n ?? []) "field" in t && t.field === f && (t.field = u);
  }, o = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = h(n.field));
  }, i = (n) => {
    if (!(!n || typeof n != "object")) {
      if (Array.isArray(n)) {
        n.forEach(i);
        return;
      }
      o(n);
      for (const [t, l] of Object.entries(n)) ["value", "values", "ctx"].includes(t) || i(l);
    }
  };
  for (const n of e.fields ?? [])
    n.field && (n.field = h(n.field)), i(n.where), c(n.access?.read), c(n.access?.write);
  if (e.visibility) {
    e.visibility.field = h(e.visibility.field);
    for (const n of e.visibility.levels) c(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      o(t.awaiting), o(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(h));
      for (const l of t.timers ?? [])
        l.at_field && (l.at_field = h(l.at_field)), l.by && (l.by = h(l.by));
    }
    for (const t of n.transitions ?? []) {
      i(t.when), t.require && (t.require = t.require.map(h));
      for (const l of t.set ?? [])
        l.field = h(l.field), l.copy && (l.copy = h(l.copy));
    }
  }
}
function Zt(e, d) {
  const u = te(e);
  for (const h of u.fields ?? [])
    h.type?.includes(":") && delete h.form;
  const f = { ...u.remove };
  d.visibility && !u.visibility ? f.visibility = !0 : delete f.visibility;
  for (const h of ["fields", "item_types", "processes", "relation_types"]) {
    const c = (d[h] ?? []).filter((o) => {
      if (h === "fields") {
        const i = o;
        return !u.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(u[h] ?? []).some((i) => "id" in i && i.id === ("id" in o ? o.id : void 0));
    }).map((o) => "code" in o ? o.code : o.id);
    c.length ? f[h] = [.../* @__PURE__ */ new Set([...f[h] ?? [], ...c])] : delete f[h];
  }
  return Object.keys(f).length ? u.remove = f : delete u.remove, u;
}
function en(e, d, u) {
  const f = JSON.stringify({ declaration: e, configs: u });
  return {
    declaration: te(e),
    expected_generation: d,
    plugin_configs: te(u),
    matches: (h, c, o) => d === c && f === JSON.stringify({ declaration: h, configs: o })
  };
}
function tn(e) {
  const d = te(e), u = [...new Set(d.declaration.item_types?.flatMap((h) => h.fields) ?? [])], f = (h) => {
    const c = u.indexOf(h);
    return c < 0 ? u.length : c;
  };
  d.declaration.fields?.sort((h, c) => f(h.code) - f(c.code));
  for (const h of d.declaration.fields ?? []) {
    const c = d.compiled.fields?.find((o) => o.code === h.code);
    h.id ??= c?.id, h.form ??= c?.form;
  }
  for (const h of d.declaration.processes ?? []) h.migration ??= d.compiled.processes?.find((c) => c.id === h.id)?.migration ?? Ae(h);
  return d;
}
function nn(e, d) {
  return (d.processes ?? []).filter((u) => Ae(u) !== "pin" && e.changes.some((f) => f.code === "process " + u.id && f.class !== "cosmetic" && f.class !== "refused")).map((u) => u.id);
}
function rn(e, d, u) {
  const f = [u, `item_type ${u}`, `relation ${u}`, `process ${u}`], h = e.refused.filter((c) => f.includes(c.code));
  return d === "fields" && h.push(...e.changes.filter((c) => c.code === u && c.what === "removed" && c.class === "semantic")), h.length ? h.map(kt).join(" ") : void 0;
}
function an(e, d, u) {
  if (d === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== u);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((h) => h !== u), f.inherit = f.inherit?.filter((h) => h !== u);
  } else d === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== u) : d === "processes" ? e.processes = e.processes?.filter((f) => f.id !== u) : e.relation_types = e.relation_types?.filter((f) => f.id !== u);
}
function kt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function sn(e, d) {
  if (!(e instanceof ee)) return [];
  const u = e.details ?? {};
  let f = typeof u.field == "string" ? u.field : "";
  if (!f) {
    const h = d.processes?.find((c) => c.id === u.process || c.states.some((o) => o.id === u.state) || e.message.includes(`process ${c.id}`));
    h ? f = `process ${h.id}` : typeof u.item_type == "string" && (f = `item_type ${u.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: e.message }] : [];
}
const on = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, ln = (e) => !("problem" in e);
function dn(e, d) {
  return { pack: e.id, version: e.version, expected_generation: d };
}
async function un(e, d) {
  const u = { ...te(e), resolutions: te(e.resolutions ?? {}) };
  let f = await d(u);
  return u.maps || (u.maps = te(f.maps), f = await d(u)), { request: u, plan: f };
}
function cn() {
  let e = 0;
  return () => {
    const d = ++e;
    return () => d === e;
  };
}
export {
  an as A,
  Qt as B,
  zt as C,
  Ce as D,
  Ut as E,
  Ht as F,
  Wt as G,
  Bt as H,
  Ae as I,
  te as J,
  fe as K,
  lt as L,
  on as M,
  Zt as N,
  nn as O,
  dn as P,
  un as Q,
  ee as R,
  tn as S,
  en as T,
  sn as U,
  rn as V,
  Pt as _,
  ln as a,
  dt as b,
  Te as c,
  $t as d,
  St as e,
  qt as f,
  Rt as g,
  Ft as h,
  Jt as i,
  Le as j,
  oe as k,
  cn as l,
  Kt as m,
  Mt as n,
  st as o,
  re as p,
  Gt as q,
  At as r,
  Se as s,
  vt as t,
  Vt as u,
  Yt as v,
  Dt as w,
  Xt as x,
  he as y,
  kt as z
};
//# sourceMappingURL=latestRequest-DkiZG7QS.js.map
