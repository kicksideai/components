import { defineComponent as ce, openBlock as U, createBlock as Z, resolveDynamicComponent as Ge, withCtx as Ue, renderSlot as je, ref as K, watch as se, onBeforeUnmount as we, createElementBlock as Y, createElementVNode as ee, toDisplayString as X, createCommentVNode as ae, createVNode as ye, unref as B, onUnmounted as Be, useId as We, computed as Q, createTextVNode as Ye, Fragment as xe, renderList as _e, withKeys as ze, withModifiers as Je, onMounted as He, nextTick as Ke } from "vue";
import qe from "primevue/button";
import Oe from "primevue/inputtext";
import Xe from "primevue/inputnumber";
import Qe from "primevue/toggleswitch";
import Ze from "primevue/select";
import et from "primevue/chip";
import tt from "primevue/textarea";
import { e as nt } from "./mount-6xLuMEcF.js";
import { api as Ie } from "@wippy-fe/proxy";
const St = /* @__PURE__ */ ce({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: d }) {
    const u = e, h = d;
    function c(o) {
      if (u.disabled || o.defaultPrevented) return;
      const i = o.target;
      if (i instanceof Element && i !== o.currentTarget) {
        const n = i.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (n && n !== o.currentTarget) return;
      }
      h("activate", o);
    }
    function f(o) {
      o.target !== o.currentTarget || !["Enter", " "].includes(o.key) || (o.preventDefault(), u.disabled || h("activate", o));
    }
    return (o, i) => (U(), Z(Ge(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: c,
      onKeydown: f
    }, {
      default: Ue(() => [
        je(o.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
});
class te extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(d, u, h) {
    super(d.message ?? d.error ?? `${u} failed`), this.name = "ApiError", this.kind = d.kind, this.details = d.details, this.retryable = d.retryable, this.status = h;
  }
}
const Ne = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Ce(e, d) {
  const u = e instanceof te ? e.details?.code : void 0, h = e instanceof Error && e.message || d;
  return typeof u != "string" || !u.trim() ? h : `${Object.hasOwn(Ne, u) ? Ne[u] : h}
Error code: ${u}`;
}
function Le(e, d) {
  const u = e;
  if (u && typeof u == "object" && u.success === !1) throw new te(u, d);
  if (u && typeof u == "object" && u.success === !0 && u.data !== void 0) return u.data;
  throw new te({ kind: "INTERNAL", message: `${d}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, d);
}
function Te(e, d) {
  if (e instanceof te) return e;
  const u = e?.response;
  return u?.data ? new te(u.data, d, u.status) : e instanceof Error ? e : new te({ kind: "Unavailable" }, d);
}
async function be(e, d, u) {
  try {
    return Le((await Ie.get(e, { params: u })).data, d);
  } catch (h) {
    throw Te(h, d);
  }
}
async function re(e, d, u) {
  try {
    return Le((await Ie.post(e, d)).data, u);
  } catch (h) {
    throw Te(h, u);
  }
}
function oe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const fe = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), rt = { class: "work-json-disclosure" }, it = { class: "work-stack work-tight" }, at = {
  key: 0,
  class: "work-small work-muted"
}, st = {
  key: 1,
  role: "alert",
  class: "work-error"
}, ot = { class: "work-json-example" }, lt = /* @__PURE__ */ ce({
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
    const u = e, h = d, c = K(""), f = K("");
    se(() => u.modelValue, (i) => {
      c.value = i === void 0 ? "" : JSON.stringify(i, null, 2), f.value = "", h("validity", !0);
    }, { immediate: !0 }), we(() => h("validity", !0));
    function o(i) {
      c.value = i;
      try {
        const n = i.trim() ? JSON.parse(i) : void 0;
        if (n !== void 0 && u.shape === "object" && (!n || typeof n != "object" || Array.isArray(n))) throw new Error("Enter a JSON object.");
        if (n !== void 0 && u.shape === "array" && !Array.isArray(n)) throw new Error("Enter a JSON array.");
        f.value = "", h("update:modelValue", n), h("validity", !0);
      } catch (n) {
        f.value = n instanceof Error ? n.message : "Invalid JSON.", h("validity", !1);
      }
    }
    return (i, n) => (U(), Y("details", rt, [
      ee("summary", null, "Edit as JSON · " + X(e.label), 1),
      ee("label", it, [
        ee("span", null, X(e.label), 1),
        e.hint ? (U(), Y("span", at, X(e.hint), 1)) : ae("", !0),
        ye(B(tt), {
          class: "work-json-input",
          rows: "3",
          "aria-label": e.label,
          value: c.value,
          "aria-invalid": !!f.value,
          onInput: n[0] || (n[0] = (t) => o(t.target.value))
        }, null, 8, ["aria-label", "value", "aria-invalid"]),
        f.value ? (U(), Y("span", st, X(f.value), 1)) : ae("", !0)
      ]),
      n[1] || (n[1] = ee("p", { class: "work-small work-muted" }, "Example", -1)),
      ee("pre", ot, X(JSON.stringify(e.example ?? (e.shape === "array" ? [] : {}), null, 2)), 1)
    ]));
  }
}), ge = /* @__PURE__ */ new Map();
function ue(e, d = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((h) => ue(h, d)).join(", ");
  if (typeof e == "string") return d.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const u = e;
  for (const h of ["display_name", "displayName", "name", "label"]) if (typeof u[h] == "string" && u[h] && !fe(u[h])) return u[h];
  return d.get(`${u.kind ?? "user"}:${u.id}`) ?? (typeof u.email == "string" && u.email ? u.email : u.kind === "group" ? "Unavailable group" : typeof u.id == "string" ? ue(u.id, d) : "Unavailable person");
}
async function dt(e, d) {
  const u = [...new Map(d.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), h = JSON.stringify([e, u]), c = ge.get(h);
  if (c) return c;
  const o = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < u.length; n += 200) {
      const t = await re(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: u.slice(n, n + 200) }, "Display names");
      for (const l of t.principals) l.label.trim() && !fe(l.label) && l.label !== l.id && i.set(`${l.type}:${l.id}`, l.label.trim());
    }
    return i;
  })();
  ge.set(h, o);
  try {
    return await o;
  } finally {
    ge.delete(h);
  }
}
function ut(e, d) {
  const u = K(/* @__PURE__ */ new Map()), h = K("");
  let c = 0;
  return se([e, d], async ([f, o]) => {
    const i = ++c;
    if (u.value = /* @__PURE__ */ new Map(), h.value = "", !(!f || !o.length))
      try {
        const n = await dt(f, o);
        i === c && (u.value = n);
      } catch (n) {
        i === c && (h.value = Ce(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), Be(() => {
    c++, u.value.clear();
  }), {
    labels: u,
    error: h,
    label: (f) => ue(f, u.value),
    remember: (f, o) => {
      o.trim() && !fe(o) && o !== f.id && u.value.set(`${f.kind}:${f.id}`, o.trim());
    }
  };
}
function he(e) {
  if (fe(e)) return "Untitled";
  const d = e.replace(/[_-]+/g, " ");
  return d.charAt(0).toUpperCase() + d.slice(1);
}
function At(e) {
  return e.title?.trim() || he(e.code);
}
function Me(e, d, u = ue) {
  return e == null ? "—" : d?.type === "principal" ? u(e) : Array.isArray(e) ? e.map((h) => Me(h, d, u)).join(", ") : d?.type === "option" && typeof e == "string" ? d.options?.find((h) => h.id === e)?.label || he(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (d?.form === "ref" || d?.type === "item") && "unavailable" in e ? "Unavailable" : d?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : d?.form === "ref" && "ref" in e && Array.isArray(e.ref) || d?.form === "ref" && "id" in e && typeof e.id == "string" || d?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function Vt(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function $t(e, d) {
  const u = ut(e, d);
  return {
    display: (h, c) => Me(h, c, u.label),
    principalLabel: u.label,
    rememberPrincipal: u.remember,
    nameError: u.error,
    nameLabels: u.labels
  };
}
function Re(e) {
  return Object.entries(oe(e.properties)).map(([d, u]) => {
    const h = oe(u);
    return { key: d, title: typeof h.title == "string" && h.title.trim() ? h.title : he(d), description: typeof h.description == "string" ? h.description : "", schema: h };
  });
}
const Se = (e) => e.type === "array" && oe(e.items).type === "string";
function ct(e, d) {
  const u = {};
  for (const h of Re(e)) {
    const c = d[h.key] ?? h.schema.default, f = h.schema;
    let o = "";
    if (c == null)
      Array.isArray(e.required) && e.required.includes(h.key) && (o = "A value is required.");
    else if (Array.isArray(f.enum) && !f.enum.includes(c)) o = "Choose one of the available values.";
    else if (f.type === "integer" || f.type === "number")
      typeof c != "number" || !Number.isFinite(c) || f.type === "integer" && !Number.isInteger(c) ? o = f.type === "integer" ? "Enter a whole number." : "Enter a number." : typeof f.minimum == "number" && c < f.minimum ? o = `Enter at least ${f.minimum}.` : typeof f.maximum == "number" && c > f.maximum && (o = `Enter at most ${f.maximum}.`);
    else if (f.type === "boolean" && typeof c != "boolean") o = "Choose on or off.";
    else if (f.type === "string") {
      if (typeof c != "string") o = "Enter text.";
      else if (typeof f.minLength == "number" && c.length < f.minLength) o = `Enter at least ${f.minLength} characters.`;
      else if (typeof f.maxLength == "number" && c.length > f.maxLength) o = `Enter at most ${f.maxLength} characters.`;
      else if (typeof f.pattern == "string")
        try {
          new RegExp(f.pattern).test(c) || (o = "Use the required format.");
        } catch {
          o = "The declared format is unavailable.";
        }
    } else if (f.type === "array") {
      if (!Array.isArray(c)) o = "Enter a list.";
      else if (typeof f.maxItems == "number" && c.length > f.maxItems) o = `Use at most ${f.maxItems} entries.`;
      else if (typeof f.minItems == "number" && c.length < f.minItems) o = `Use at least ${f.minItems} entries.`;
      else if (f.uniqueItems && new Set(c).size !== c.length) o = "Remove duplicate entries.";
      else if (Se(f)) {
        const i = oe(f.items);
        c.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (o = "Each entry must match the declared text length.");
      }
    } else f.type === "object" && (typeof c != "object" || Array.isArray(c)) && (o = "Enter an object.");
    o && (u[h.key] = o);
  }
  return u;
}
const ft = { class: "work-stack" }, ht = ["inert", "schema", "config"], pt = {
  key: 1,
  role: "status",
  class: "work-muted work-small"
}, mt = {
  key: 2,
  role: "alert",
  class: "kx-err"
}, bt = { class: "work-config-fields" }, gt = ["for"], yt = {
  key: 1,
  class: "work-config-chips"
}, wt = {
  key: 6,
  class: "work-muted work-small"
}, vt = {
  key: 7,
  role: "alert",
  class: "work-error work-small"
}, Pt = /* @__PURE__ */ ce({
  __name: "ConfigForm",
  props: {
    schema: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: d }) {
    const u = e, h = d, c = K({}), f = K(/* @__PURE__ */ new Set()), o = K(!1), i = K(!1), n = We(), t = Q(() => Re(u.schema)), l = Q(() => ct(u.schema, u.modelValue)), s = Q(() => t.value.filter((v) => typeof v.schema.picker == "string")), p = Q(() => t.value.filter((v) => typeof v.schema.picker != "string")), r = Q(() => ({ ...u.schema, properties: Object.fromEntries(s.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(u.schema.required) ? u.schema.required.filter((v) => s.value.some((O) => O.key === v)) : [] })), a = Q(() => Object.fromEntries(s.value.map((v) => [v.key, u.modelValue[v.key]]))), m = Q(() => !Object.keys(l.value).length && !f.value.size && (!s.value.length || o.value));
    se(m, (v) => h("validity", v), { immediate: !0 });
    async function b() {
      i.value = !0, o.value = await nt("wc-schema-form"), i.value = !1;
    }
    se(() => s.value.length > 0, (v) => {
      v && b();
    }, { immediate: !0 }), we(() => h("validity", !0));
    function _(v, O) {
      const w = { ...u.modelValue };
      O == null ? delete w[v] : w[v] = O, h("update:modelValue", w);
    }
    function T(v) {
      const O = u.modelValue[v];
      return Array.isArray(O) ? O.filter((w) => typeof w == "string") : [];
    }
    function y(v) {
      const O = c.value[v]?.trim();
      O && (_(v, [...T(v), O]), c.value[v] = "");
    }
    function N(v, O) {
      O ? f.value.delete(v) : f.value.add(v);
    }
    function k(v) {
      h("update:modelValue", { ...u.modelValue, ...oe(v.detail) });
    }
    return (v, O) => (U(), Y("div", ft, [
      s.value.length && o.value ? (U(), Y("wc-schema-form", {
        key: 0,
        class: "work-config-widget",
        inert: e.disabled || void 0,
        schema: JSON.stringify(r.value),
        config: JSON.stringify(a.value),
        onConfigChanged: k
      }, null, 40, ht)) : s.value.length && i.value ? (U(), Y("p", pt, "The configuration widget is loading.")) : s.value.length ? (U(), Y("p", mt, [
        O[0] || (O[0] = Ye("The configuration widget is unavailable.", -1)),
        ye(B(qe), {
          label: "Reload configuration widget",
          severity: "secondary",
          outlined: "",
          onClick: b
        })
      ])) : ae("", !0),
      ee("div", bt, [
        (U(!0), Y(xe, null, _e(p.value, (w) => (U(), Y("div", {
          key: w.key,
          class: "work-config-field"
        }, [
          ee("label", {
            class: "work-config-label",
            for: B(n) + "-" + w.key
          }, X(w.title), 9, gt),
          Array.isArray(w.schema.enum) ? (U(), Z(B(Ze), {
            key: 0,
            "input-id": B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            options: w.schema.enum,
            appendTo: "self",
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "options", "aria-label", "disabled", "onUpdate:modelValue"])) : B(Se)(w.schema) ? (U(), Y("div", yt, [
            (U(!0), Y(xe, null, _e(T(w.key), (L, A) => (U(), Z(B(et), {
              key: A,
              label: L,
              removable: !e.disabled,
              onRemove: (g) => _(w.key, T(w.key).filter((E, j) => j !== A))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            ye(B(Oe), {
              id: B(n) + "-" + w.key,
              modelValue: c.value[w.key],
              "onUpdate:modelValue": (L) => c.value[w.key] = L,
              "aria-label": "Add " + w.title.toLocaleLowerCase(),
              disabled: e.disabled,
              placeholder: "Type and press Enter",
              onKeydown: ze(Je((L) => y(w.key), ["stop", "prevent"]), ["enter"]),
              onBlur: (L) => y(w.key)
            }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "aria-label", "disabled", "onKeydown", "onBlur"])
          ])) : ["integer", "number"].includes(String(w.schema.type)) ? (U(), Z(B(Xe), {
            key: 2,
            "input-id": B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default,
            "max-fraction-digits": w.schema.type === "integer" ? 0 : 8,
            "use-grouping": !1,
            "aria-label": w.title,
            disabled: e.disabled,
            invalid: !!l.value[w.key],
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "max-fraction-digits", "aria-label", "disabled", "invalid", "onUpdate:modelValue"])) : w.schema.type === "boolean" ? (U(), Z(B(Qe), {
            key: 3,
            "input-id": B(n) + "-" + w.key,
            "model-value": !!(e.modelValue[w.key] ?? w.schema.default),
            "aria-label": w.title,
            disabled: e.disabled,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["input-id", "model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : ["array", "object"].includes(String(w.schema.type)) ? (U(), Z(lt, {
            key: 4,
            label: w.title,
            "model-value": e.modelValue[w.key],
            shape: w.schema.type === "array" ? "array" : "object",
            example: w.schema.default ?? (w.schema.type === "array" ? [] : {}),
            "onUpdate:modelValue": (L) => _(w.key, L),
            onValidity: (L) => N(w.key, L)
          }, null, 8, ["label", "model-value", "shape", "example", "onUpdate:modelValue", "onValidity"])) : (U(), Z(B(Oe), {
            key: 5,
            id: B(n) + "-" + w.key,
            "model-value": e.modelValue[w.key] ?? w.schema.default ?? "",
            disabled: e.disabled,
            invalid: !!l.value[w.key],
            "aria-label": w.title,
            "onUpdate:modelValue": (L) => _(w.key, L)
          }, null, 8, ["id", "model-value", "disabled", "invalid", "aria-label", "onUpdate:modelValue"])),
          w.description ? (U(), Y("p", wt, X(w.description), 1)) : ae("", !0),
          l.value[w.key] ? (U(), Y("p", vt, X(l.value[w.key]), 1)) : ae("", !0)
        ]))), 128))
      ])
    ]));
  }
}), kt = ["aria-label", "aria-busy"], Dt = /* @__PURE__ */ ce({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const u = e, h = d, c = K(null);
    let f = null;
    async function o() {
      await Ke();
      const n = c.value;
      n && (u.visible && !n.open ? (f = n.getRootNode().activeElement, n.showModal()) : !u.visible && n.open && (n.close(), f?.focus()));
    }
    function i(n) {
      n.preventDefault(), u.busy || h("close");
    }
    return se(() => u.visible, o), He(o), we(() => {
      c.value?.open && c.value.close(), f?.focus();
    }), (n, t) => (U(), Y("dialog", {
      ref_key: "dialog",
      ref: c,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: i,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && h("close");
      })
    }, [
      je(n.$slots, "default")
    ], 40, kt));
  }
}), de = "/api/v1/work", le = (e) => `${de}/boards/${encodeURIComponent(e)}`, Ft = {
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
  createBoard: (e, d, u, h = {}) => re(`${de}/boards`, { title: e, declaration: d, idempotency_key: u, ...h }, "Create board"),
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
const Gt = (function() {
  return (/* @__PURE__ */ (function() {
    function e(d, u, h) {
      function c(i, n) {
        if (!u[i]) {
          if (!d[i]) {
            var t = typeof require == "function" && require;
            if (!n && t) return t(i, !0);
            if (f) return f(i, !0);
            var l = new Error("Cannot find module '" + i + "'");
            throw l.code = "MODULE_NOT_FOUND", l;
          }
          var s = u[i] = { exports: {} };
          d[i][0].call(s.exports, function(p) {
            var r = d[i][1][p];
            return c(r || p);
          }, s, s.exports, e, d, u, h);
        }
        return u[i].exports;
      }
      for (var f = typeof require == "function" && require, o = 0; o < h.length; o++) c(h[o]);
      return c;
    }
    return e;
  })())({ 1: [function(e, d, u) {
    d.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, d, u) {
    let h = e("./greedy-fas"), c = e("./util").uniqueId;
    d.exports = { run: f, undo: i };
    function f(n) {
      (n.graph().acyclicer === "greedy" ? h(n, l(n)) : o(n)).forEach((s) => {
        let p = n.edge(s);
        n.removeEdge(s), p.forwardName = s.name, p.reversed = !0, n.setEdge(s.w, s.v, p, c("rev"));
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
    let h = e("./util");
    d.exports = c;
    function c(o) {
      function i(n) {
        let t = o.children(n), l = o.node(n);
        if (t.length && t.forEach(i), Object.hasOwn(l, "minRank")) {
          l.borderLeft = [], l.borderRight = [];
          for (let s = l.minRank, p = l.maxRank + 1; s < p; ++s)
            f(o, "borderLeft", "_bl", n, l, s), f(o, "borderRight", "_br", n, l, s);
        }
      }
      o.children().forEach(i);
    }
    function f(o, i, n, t, l, s) {
      let p = { width: 0, height: 0, rank: s, borderType: i }, r = l[i][s - 1], a = h.addDummyNode(o, "border", p, n);
      l[i][s] = a, o.setParent(a, t), r && o.setEdge(r, a, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, d, u) {
    d.exports = { adjust: h, undo: c };
    function h(s) {
      let p = s.graph().rankdir.toLowerCase();
      (p === "lr" || p === "rl") && f(s);
    }
    function c(s) {
      let p = s.graph().rankdir.toLowerCase();
      (p === "bt" || p === "rl") && i(s), (p === "lr" || p === "rl") && (t(s), f(s));
    }
    function f(s) {
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
    class h {
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
          i.push(JSON.stringify(t, f)), t = t._prev;
        return "[" + i.join(", ") + "]";
      }
    }
    function c(o) {
      o._prev._next = o._next, o._next._prev = o._prev, delete o._next, delete o._prev;
    }
    function f(o, i) {
      if (o !== "_next" && o !== "_prev")
        return i;
    }
    d.exports = h;
  }, {}], 6: [function(e, d, u) {
    let h = e("./util"), c = e("@dagrejs/graphlib").Graph;
    d.exports = { debugOrdering: f };
    function f(o) {
      let i = h.buildLayerMatrix(o), n = new c({ compound: !0, multigraph: !0 }).setGraph({});
      return o.nodes().forEach((t) => {
        n.setNode(t, { label: t }), n.setParent(t, "layer" + o.node(t).rank);
      }), o.edges().forEach((t) => n.setEdge(t.v, t.w, {}, t.name)), i.forEach((t, l) => {
        let s = "layer" + l;
        n.setNode(s, { rank: "same" }), t.reduce((p, r) => (n.setEdge(p, r, { style: "invis" }), r));
      }), n;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, d, u) {
    let h = e("@dagrejs/graphlib").Graph, c = e("./data/list");
    d.exports = o;
    let f = () => 1;
    function o(p, r) {
      if (p.nodeCount() <= 1)
        return [];
      let a = t(p, r || f);
      return i(a.graph, a.buckets, a.zeroIdx).flatMap((b) => p.outEdges(b.v, b.w));
    }
    function i(p, r, a) {
      let m = [], b = r[r.length - 1], _ = r[0], T;
      for (; p.nodeCount(); ) {
        for (; T = _.dequeue(); )
          n(p, r, a, T);
        for (; T = b.dequeue(); )
          n(p, r, a, T);
        if (p.nodeCount()) {
          for (let y = r.length - 2; y > 0; --y)
            if (T = r[y].dequeue(), T) {
              m = m.concat(n(p, r, a, T, !0));
              break;
            }
        }
      }
      return m;
    }
    function n(p, r, a, m, b) {
      let _ = b ? [] : void 0;
      return p.inEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = p.node(T.v);
        b && _.push({ v: T.v, w: T.w }), N.out -= y, l(r, a, N);
      }), p.outEdges(m.v).forEach((T) => {
        let y = p.edge(T), N = T.w, k = p.node(N);
        k.in -= y, l(r, a, k);
      }), p.removeNode(m.v), _;
    }
    function t(p, r) {
      let a = new h(), m = 0, b = 0;
      p.nodes().forEach((y) => {
        a.setNode(y, { v: y, in: 0, out: 0 });
      }), p.edges().forEach((y) => {
        let N = a.edge(y.v, y.w) || 0, k = r(y), v = N + k;
        a.setEdge(y.v, y.w, v), b = Math.max(b, a.node(y.v).out += k), m = Math.max(m, a.node(y.w).in += k);
      });
      let _ = s(b + m + 3).map(() => new c()), T = m + 1;
      return a.nodes().forEach((y) => {
        l(_, T, a.node(y));
      }), { graph: a, buckets: _, zeroIdx: T };
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
    let h = e("./acyclic"), c = e("./normalize"), f = e("./rank"), o = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), l = e("./add-border-segments"), s = e("./coordinate-system"), p = e("./order"), r = e("./position"), a = e("./util"), m = e("@dagrejs/graphlib").Graph;
    d.exports = b;
    function b(x, I) {
      let M = I && I.debugTiming ? a.time : a.notime;
      M("layout", () => {
        let S = M("  buildLayoutGraph", () => g(x));
        M("  runLayout", () => _(S, M, I)), M("  updateInputGraph", () => T(x, S));
      });
    }
    function _(x, I, M) {
      I("    makeSpaceForEdgeLabels", () => E(x)), I("    removeSelfEdges", () => Pe(x)), I("    acyclic", () => h.run(x)), I("    nestingGraph.run", () => t.run(x)), I("    rank", () => f(a.asNonCompoundGraph(x))), I("    injectEdgeLabelProxies", () => j(x)), I("    removeEmptyRanks", () => n(x)), I("    nestingGraph.cleanup", () => t.cleanup(x)), I("    normalizeRanks", () => o(x)), I("    assignRankMinMax", () => C(x)), I("    removeEdgeLabelProxies", () => R(x)), I("    normalize.run", () => c.run(x)), I("    parentDummyChains", () => i(x)), I("    addBorderSegments", () => l(x)), I("    order", () => p(x, M)), I("    insertSelfEdges", () => De(x)), I("    adjustCoordinateSystem", () => s.adjust(x)), I("    position", () => r(x)), I("    positionSelfEdges", () => Fe(x)), I("    removeBorderNodes", () => q(x)), I("    normalize.undo", () => c.undo(x)), I("    fixupEdgeLabelCoords", () => F(x)), I("    undoCoordinateSystem", () => s.undo(x)), I("    translateGraph", () => V(x)), I("    assignNodeIntersects", () => $(x)), I("    reversePoints", () => H(x)), I("    acyclic.undo", () => h.undo(x));
    }
    function T(x, I) {
      x.nodes().forEach((M) => {
        let S = x.node(M), P = I.node(M);
        S && (S.x = P.x, S.y = P.y, S.rank = P.rank, I.children(M).length && (S.width = P.width, S.height = P.height));
      }), x.edges().forEach((M) => {
        let S = x.edge(M), P = I.edge(M);
        S.points = P.points, Object.hasOwn(P, "x") && (S.x = P.x, S.y = P.y);
      }), x.graph().width = I.graph().width, x.graph().height = I.graph().height;
    }
    let y = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], N = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, k = ["acyclicer", "ranker", "rankdir", "align"], v = ["width", "height", "rank"], O = { width: 0, height: 0 }, w = ["minlen", "weight", "width", "height", "labeloffset"], L = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, A = ["labelpos"];
    function g(x) {
      let I = new m({ multigraph: !0, compound: !0 }), M = me(x.graph());
      return I.setGraph(Object.assign({}, N, pe(M, y), a.pick(M, k))), x.nodes().forEach((S) => {
        let P = me(x.node(S));
        const D = pe(P, v);
        Object.keys(O).forEach((G) => {
          D[G] === void 0 && (D[G] = O[G]);
        }), I.setNode(S, D), I.setParent(S, x.parent(S));
      }), x.edges().forEach((S) => {
        let P = me(x.edge(S));
        I.setEdge(S, Object.assign({}, L, pe(P, w), a.pick(P, A)));
      }), I;
    }
    function E(x) {
      let I = x.graph();
      I.ranksep /= 2, x.edges().forEach((M) => {
        let S = x.edge(M);
        S.minlen *= 2, S.labelpos.toLowerCase() !== "c" && (I.rankdir === "TB" || I.rankdir === "BT" ? S.width += S.labeloffset : S.height += S.labeloffset);
      });
    }
    function j(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I);
        if (M.width && M.height) {
          let S = x.node(I.v), D = { rank: (x.node(I.w).rank - S.rank) / 2 + S.rank, e: I };
          a.addDummyNode(x, "edge-proxy", D, "_ep");
        }
      });
    }
    function C(x) {
      let I = 0;
      x.nodes().forEach((M) => {
        let S = x.node(M);
        S.borderTop && (S.minRank = x.node(S.borderTop).rank, S.maxRank = x.node(S.borderBottom).rank, I = Math.max(I, S.maxRank));
      }), x.graph().maxRank = I;
    }
    function R(x) {
      x.nodes().forEach((I) => {
        let M = x.node(I);
        M.dummy === "edge-proxy" && (x.edge(M.e).labelRank = M.rank, x.removeNode(I));
      });
    }
    function V(x) {
      let I = Number.POSITIVE_INFINITY, M = 0, S = Number.POSITIVE_INFINITY, P = 0, D = x.graph(), G = D.marginx || 0, z = D.marginy || 0;
      function ve(J) {
        let W = J.x, ie = J.y, ke = J.width, Ee = J.height;
        I = Math.min(I, W - ke / 2), M = Math.max(M, W + ke / 2), S = Math.min(S, ie - Ee / 2), P = Math.max(P, ie + Ee / 2);
      }
      x.nodes().forEach((J) => ve(x.node(J))), x.edges().forEach((J) => {
        let W = x.edge(J);
        Object.hasOwn(W, "x") && ve(W);
      }), I -= G, S -= z, x.nodes().forEach((J) => {
        let W = x.node(J);
        W.x -= I, W.y -= S;
      }), x.edges().forEach((J) => {
        let W = x.edge(J);
        W.points.forEach((ie) => {
          ie.x -= I, ie.y -= S;
        }), Object.hasOwn(W, "x") && (W.x -= I), Object.hasOwn(W, "y") && (W.y -= S);
      }), D.width = M - I + G, D.height = P - S + z;
    }
    function $(x) {
      x.edges().forEach((I) => {
        let M = x.edge(I), S = x.node(I.v), P = x.node(I.w), D, G;
        M.points ? (D = M.points[0], G = M.points[M.points.length - 1]) : (M.points = [], D = P, G = S), M.points.unshift(a.intersectRect(S, D)), M.points.push(a.intersectRect(P, G));
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
    function q(x) {
      x.nodes().forEach((I) => {
        if (x.children(I).length) {
          let M = x.node(I), S = x.node(M.borderTop), P = x.node(M.borderBottom), D = x.node(M.borderLeft[M.borderLeft.length - 1]), G = x.node(M.borderRight[M.borderRight.length - 1]);
          M.width = Math.abs(G.x - D.x), M.height = Math.abs(P.y - S.y), M.x = D.x + M.width / 2, M.y = S.y + M.height / 2;
        }
      }), x.nodes().forEach((I) => {
        x.node(I).dummy === "border" && x.removeNode(I);
      });
    }
    function Pe(x) {
      x.edges().forEach((I) => {
        if (I.v === I.w) {
          var M = x.node(I.v);
          M.selfEdges || (M.selfEdges = []), M.selfEdges.push({ e: I, label: x.edge(I) }), x.removeEdge(I);
        }
      });
    }
    function De(x) {
      var I = a.buildLayerMatrix(x);
      I.forEach((M) => {
        var S = 0;
        M.forEach((P, D) => {
          var G = x.node(P);
          G.order = D + S, (G.selfEdges || []).forEach((z) => {
            a.addDummyNode(x, "selfedge", { width: z.label.width, height: z.label.height, rank: G.rank, order: D + ++S, e: z.e, label: z.label }, "_se");
          }), delete G.selfEdges;
        });
      });
    }
    function Fe(x) {
      x.nodes().forEach((I) => {
        var M = x.node(I);
        if (M.dummy === "selfedge") {
          var S = x.node(M.e.v), P = S.x + S.width / 2, D = S.y, G = M.x - P, z = S.height / 2;
          x.setEdge(M.e, M.label), x.removeNode(I), M.label.points = [{ x: P + 2 * G / 3, y: D - z }, { x: P + 5 * G / 6, y: D - z }, { x: P + G, y: D }, { x: P + 5 * G / 6, y: D + z }, { x: P + 2 * G / 3, y: D + z }], M.label.x = M.x, M.label.y = M.y;
        }
      });
    }
    function pe(x, I) {
      return a.mapValues(a.pick(x, I), Number);
    }
    function me(x) {
      var I = {};
      return x && Object.entries(x).forEach(([M, S]) => {
        typeof M == "string" && (M = M.toLowerCase()), I[M] = S;
      }), I;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, d, u) {
    let h = e("./util");
    d.exports = { run: c, cleanup: n };
    function c(t) {
      let l = h.addDummyNode(t, "root", {}, "_root"), s = o(t), p = Object.values(s), r = h.applyWithChunking(Math.max, p) - 1, a = 2 * r + 1;
      t.graph().nestingRoot = l, t.edges().forEach((b) => t.edge(b).minlen *= a);
      let m = i(t) + 1;
      t.children().forEach((b) => f(t, l, a, m, r, s, b)), t.graph().nodeRankFactor = a;
    }
    function f(t, l, s, p, r, a, m) {
      let b = t.children(m);
      if (!b.length) {
        m !== l && t.setEdge(l, m, { weight: 0, minlen: s });
        return;
      }
      let _ = h.addBorderNode(t, "_bt"), T = h.addBorderNode(t, "_bb"), y = t.node(m);
      t.setParent(_, m), y.borderTop = _, t.setParent(T, m), y.borderBottom = T, b.forEach((N) => {
        f(t, l, s, p, r, a, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, w = k.borderTop ? p : 2 * p, L = v !== O ? 1 : r - a[m] + 1;
        t.setEdge(_, v, { weight: w, minlen: L, nestingEdge: !0 }), t.setEdge(O, T, { weight: w, minlen: L, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(l, _, { weight: 0, minlen: r + a[m] });
    }
    function o(t) {
      var l = {};
      function s(p, r) {
        var a = t.children(p);
        a && a.length && a.forEach((m) => s(m, r + 1)), l[p] = r;
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
    let h = e("./util");
    d.exports = { run: c, undo: o };
    function c(i) {
      i.graph().dummyChains = [], i.edges().forEach((n) => f(i, n));
    }
    function f(i, n) {
      let t = n.v, l = i.node(t).rank, s = n.w, p = i.node(s).rank, r = n.name, a = i.edge(n), m = a.labelRank;
      if (p === l + 1) return;
      i.removeEdge(n);
      let b, _, T;
      for (T = 0, ++l; l < p; ++T, ++l)
        a.points = [], _ = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: l }, b = h.addDummyNode(i, "edge", _, "_d"), l === m && (_.width = a.width, _.height = a.height, _.dummy = "edge-label", _.labelpos = a.labelpos), i.setEdge(t, b, { weight: a.weight }, r), T === 0 && i.graph().dummyChains.push(b), t = b;
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
    d.exports = h;
    function h(c, f, o) {
      let i = {}, n;
      o.forEach((t) => {
        let l = c.parent(t), s, p;
        for (; l; ) {
          if (s = c.parent(l), s ? (p = i[s], i[s] = l) : (p = n, n = l), p && p !== l) {
            f.setEdge(p, l);
            return;
          }
          l = s;
        }
      });
    }
  }, {}], 12: [function(e, d, u) {
    d.exports = h;
    function h(c, f = []) {
      return f.map((o) => {
        let i = c.inEdges(o);
        if (i.length) {
          let n = i.reduce((t, l) => {
            let s = c.edge(l), p = c.node(l.v);
            return { sum: t.sum + s.weight * p.order, weight: t.weight + s.weight };
          }, { sum: 0, weight: 0 });
          return { v: o, barycenter: n.sum / n.weight, weight: n.weight };
        } else
          return { v: o };
      });
    }
  }, {}], 13: [function(e, d, u) {
    let h = e("@dagrejs/graphlib").Graph, c = e("../util");
    d.exports = f;
    function f(i, n, t, l) {
      l || (l = i.nodes());
      let s = o(i), p = new h({ compound: !0 }).setGraph({ root: s }).setDefaultNodeLabel((r) => i.node(r));
      return l.forEach((r) => {
        let a = i.node(r), m = i.parent(r);
        (a.rank === n || a.minRank <= n && n <= a.maxRank) && (p.setNode(r), p.setParent(r, m || s), i[t](r).forEach((b) => {
          let _ = b.v === r ? b.w : b.v, T = p.edge(_, r), y = T !== void 0 ? T.weight : 0;
          p.setEdge(_, r, { weight: i.edge(b).weight + y });
        }), Object.hasOwn(a, "minRank") && p.setNode(r, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] }));
      }), p;
    }
    function o(i) {
      for (var n; i.hasNode(n = c.uniqueId("_root")); ) ;
      return n;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, d, u) {
    let h = e("../util").zipObject;
    d.exports = c;
    function c(o, i) {
      let n = 0;
      for (let t = 1; t < i.length; ++t)
        n += f(o, i[t - 1], i[t]);
      return n;
    }
    function f(o, i, n) {
      let t = h(n, n.map((m, b) => b)), l = i.flatMap((m) => o.outEdges(m).map((b) => ({ pos: t[b.w], weight: o.edge(b).weight })).sort((b, _) => b.pos - _.pos)), s = 1;
      for (; s < n.length; ) s <<= 1;
      let p = 2 * s - 1;
      s -= 1;
      let r = new Array(p).fill(0), a = 0;
      return l.forEach((m) => {
        let b = m.pos + s;
        r[b] += m.weight;
        let _ = 0;
        for (; b > 0; )
          b % 2 && (_ += r[b + 1]), b = b - 1 >> 1, r[b] += m.weight;
        a += m.weight * _;
      }), a;
    }
  }, { "../util": 27 }], 15: [function(e, d, u) {
    let h = e("./init-order"), c = e("./cross-count"), f = e("./sort-subgraph"), o = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    d.exports = l;
    function l(a, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(a, l);
        return;
      }
      let b = t.maxRank(a), _ = s(a, t.range(1, b + 1), "inEdges"), T = s(a, t.range(b - 1, -1, -1), "outEdges"), y = h(a);
      if (r(a, y), m && m.disableOptimalOrderHeuristic)
        return;
      let N = Number.POSITIVE_INFINITY, k;
      for (let v = 0, O = 0; O < 4; ++v, ++O) {
        p(v % 2 ? _ : T, v % 4 >= 2), y = t.buildLayerMatrix(a);
        let w = c(a, y);
        w < N && (O = 0, k = Object.assign({}, y), N = w);
      }
      r(a, k);
    }
    function s(a, m, b) {
      const _ = /* @__PURE__ */ new Map(), T = (y, N) => {
        _.has(y) || _.set(y, []), _.get(y).push(N);
      };
      for (const y of a.nodes()) {
        const N = a.node(y);
        if (typeof N.rank == "number" && T(N.rank, y), typeof N.minRank == "number" && typeof N.maxRank == "number")
          for (let k = N.minRank; k <= N.maxRank; k++)
            k !== N.rank && T(k, y);
      }
      return m.map(function(y) {
        return o(a, y, b, _.get(y) || []);
      });
    }
    function p(a, m) {
      let b = new n();
      a.forEach(function(_) {
        let T = _.graph().root, y = f(_, T, b, m);
        y.vs.forEach((N, k) => _.node(N).order = k), i(_, b, y.vs);
      });
    }
    function r(a, m) {
      Object.values(m).forEach((b) => b.forEach((_, T) => a.node(_).order = T));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, d, u) {
    let h = e("../util");
    d.exports = c;
    function c(f) {
      let o = {}, i = f.nodes().filter((r) => !f.children(r).length), n = i.map((r) => f.node(r).rank), t = h.applyWithChunking(Math.max, n), l = h.range(t + 1).map(() => []);
      function s(r) {
        if (o[r]) return;
        o[r] = !0;
        let a = f.node(r);
        l[a.rank].push(r), f.successors(r).forEach(s);
      }
      return i.sort((r, a) => f.node(r).rank - f.node(a).rank).forEach(s), l;
    }
  }, { "../util": 27 }], 17: [function(e, d, u) {
    let h = e("../util");
    d.exports = c;
    function c(i, n) {
      let t = {};
      i.forEach((s, p) => {
        let r = t[s.v] = { indegree: 0, in: [], out: [], vs: [s.v], i: p };
        s.barycenter !== void 0 && (r.barycenter = s.barycenter, r.weight = s.weight);
      }), n.edges().forEach((s) => {
        let p = t[s.v], r = t[s.w];
        p !== void 0 && r !== void 0 && (r.indegree++, p.out.push(t[s.w]));
      });
      let l = Object.values(t).filter((s) => !s.indegree);
      return f(l);
    }
    function f(i) {
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
      return n.filter((s) => !s.merged).map((s) => h.pick(s, ["vs", "i", "barycenter", "weight"]));
    }
    function o(i, n) {
      let t = 0, l = 0;
      i.weight && (t += i.barycenter * i.weight, l += i.weight), n.weight && (t += n.barycenter * n.weight, l += n.weight), i.vs = n.vs.concat(i.vs), i.barycenter = t / l, i.weight = l, i.i = Math.min(n.i, i.i), n.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, d, u) {
    let h = e("./barycenter"), c = e("./resolve-conflicts"), f = e("./sort");
    d.exports = o;
    function o(t, l, s, p) {
      let r = t.children(l), a = t.node(l), m = a ? a.borderLeft : void 0, b = a ? a.borderRight : void 0, _ = {};
      m && (r = r.filter((k) => k !== m && k !== b));
      let T = h(t, r);
      T.forEach((k) => {
        if (t.children(k.v).length) {
          let v = o(t, k.v, s, p);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let y = c(T, s);
      i(y, _);
      let N = f(y, p);
      if (m && (N.vs = [m, N.vs, b].flat(!0), t.predecessors(m).length)) {
        let k = t.node(t.predecessors(m)[0]), v = t.node(t.predecessors(b)[0]);
        Object.hasOwn(N, "barycenter") || (N.barycenter = 0, N.weight = 0), N.barycenter = (N.barycenter * N.weight + k.order + v.order) / (N.weight + 2), N.weight += 2;
      }
      return N;
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
    let h = e("../util");
    d.exports = c;
    function c(i, n) {
      let t = h.partition(i, (_) => Object.hasOwn(_, "barycenter")), l = t.lhs, s = t.rhs.sort((_, T) => T.i - _.i), p = [], r = 0, a = 0, m = 0;
      l.sort(o(!!n)), m = f(p, s, m), l.forEach((_) => {
        m += _.vs.length, p.push(_.vs), r += _.barycenter * _.weight, a += _.weight, m = f(p, s, m);
      });
      let b = { vs: p.flat(!0) };
      return a && (b.barycenter = r / a, b.weight = a), b;
    }
    function f(i, n, t) {
      let l;
      for (; n.length && (l = n[n.length - 1]).i <= t; )
        n.pop(), i.push(l.vs), t++;
      return t;
    }
    function o(i) {
      return (n, t) => n.barycenter < t.barycenter ? -1 : n.barycenter > t.barycenter ? 1 : i ? t.i - n.i : n.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, d, u) {
    d.exports = h;
    function h(o) {
      let i = f(o);
      o.graph().dummyChains.forEach((n) => {
        let t = o.node(n), l = t.edgeObj, s = c(o, i, l.v, l.w), p = s.path, r = s.lca, a = 0, m = p[a], b = !0;
        for (; n !== l.w; ) {
          if (t = o.node(n), b) {
            for (; (m = p[a]) !== r && o.node(m).maxRank < t.rank; )
              a++;
            m === r && (b = !1);
          }
          if (!b) {
            for (; a < p.length - 1 && o.node(m = p[a + 1]).minRank <= t.rank; )
              a++;
            m = p[a];
          }
          o.setParent(n, m), n = o.successors(n)[0];
        }
      });
    }
    function c(o, i, n, t) {
      let l = [], s = [], p = Math.min(i[n].low, i[t].low), r = Math.max(i[n].lim, i[t].lim), a, m;
      a = n;
      do
        a = o.parent(a), l.push(a);
      while (a && (i[a].low > p || r > i[a].lim));
      for (m = a, a = t; (a = o.parent(a)) !== m; )
        s.push(a);
      return { path: l.concat(s.reverse()), lca: m };
    }
    function f(o) {
      let i = {}, n = 0;
      function t(l) {
        let s = n;
        o.children(l).forEach(t), i[l] = { low: s, lim: n++ };
      }
      return o.children().forEach(t), i;
    }
  }, {}], 21: [function(e, d, u) {
    let h = e("@dagrejs/graphlib").Graph, c = e("../util");
    d.exports = { positionX: b, findType1Conflicts: f, findType2Conflicts: o, addConflict: n, hasConflict: t, verticalAlignment: l, horizontalCompaction: s, alignCoordinates: a, findSmallestWidthAlignment: r, balance: m };
    function f(y, N) {
      let k = {};
      function v(O, w) {
        let L = 0, A = 0, g = O.length, E = w[w.length - 1];
        return w.forEach((j, C) => {
          let R = i(y, j), V = R ? y.node(R).order : g;
          (R || j === E) && (w.slice(A, C + 1).forEach(($) => {
            y.predecessors($).forEach((F) => {
              let H = y.node(F), q = H.order;
              (q < L || V < q) && !(H.dummy && y.node($).dummy) && n(k, F, $);
            });
          }), A = C + 1, L = V);
        }), w;
      }
      return N.length && N.reduce(v), k;
    }
    function o(y, N) {
      let k = {};
      function v(w, L, A, g, E) {
        let j;
        c.range(L, A).forEach((C) => {
          j = w[C], y.node(j).dummy && y.predecessors(j).forEach((R) => {
            let V = y.node(R);
            V.dummy && (V.order < g || V.order > E) && n(k, R, j);
          });
        });
      }
      function O(w, L) {
        let A = -1, g, E = 0;
        return L.forEach((j, C) => {
          if (y.node(j).dummy === "border") {
            let R = y.predecessors(j);
            R.length && (g = y.node(R[0]).order, v(L, E, C, A, g), E = C, A = g);
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
      return N.forEach((A) => {
        A.forEach((g, E) => {
          O[g] = g, w[g] = g, L[g] = E;
        });
      }), N.forEach((A) => {
        let g = -1;
        A.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((R, V) => L[R] - L[V]);
            let C = (j.length - 1) / 2;
            for (let R = Math.floor(C), V = Math.ceil(C); R <= V; ++R) {
              let $ = j[R];
              w[E] === E && g < L[$] && !t(k, E, $) && (w[$] = E, w[E] = O[E] = O[$], g = L[$]);
            }
          }
        });
      }), { root: O, align: w };
    }
    function s(y, N, k, v, O) {
      let w = {}, L = p(y, N, k, O), A = O ? "borderLeft" : "borderRight";
      function g(C, R) {
        let V = L.nodes(), $ = V.pop(), F = {};
        for (; $; )
          F[$] ? C($) : (F[$] = !0, V.push($), V = V.concat(R($))), $ = V.pop();
      }
      function E(C) {
        w[C] = L.inEdges(C).reduce((R, V) => Math.max(R, w[V.v] + L.edge(V)), 0);
      }
      function j(C) {
        let R = L.outEdges(C).reduce(($, F) => Math.min($, w[F.w] - L.edge(F)), Number.POSITIVE_INFINITY), V = y.node(C);
        R !== Number.POSITIVE_INFINITY && V.borderType !== A && (w[C] = Math.max(w[C], R));
      }
      return g(E, L.predecessors.bind(L)), g(j, L.successors.bind(L)), Object.keys(v).forEach((C) => w[C] = w[k[C]]), w;
    }
    function p(y, N, k, v) {
      let O = new h(), w = y.graph(), L = _(w.nodesep, w.edgesep, v);
      return N.forEach((A) => {
        let g;
        A.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), g) {
            var C = k[g], R = O.edge(C, j);
            O.setEdge(C, j, Math.max(L(y, E, g), R || 0));
          }
          g = E;
        });
      }), O;
    }
    function r(y, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, w = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([A, g]) => {
          let E = T(y, A) / 2;
          O = Math.max(g + E, O), w = Math.min(g - E, w);
        });
        const L = O - w;
        return L < k[0] && (k = [L, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function a(y, N) {
      let k = Object.values(N), v = c.applyWithChunking(Math.min, k), O = c.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((w) => {
        ["l", "r"].forEach((L) => {
          let A = w + L, g = y[A];
          if (g === N) return;
          let E = Object.values(g), j = v - c.applyWithChunking(Math.min, E);
          L !== "l" && (j = O - c.applyWithChunking(Math.max, E)), j && (y[A] = c.mapValues(g, (C) => C + j));
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
      let N = c.buildLayerMatrix(y), k = Object.assign(f(y, N), o(y, N)), v = {}, O;
      ["u", "d"].forEach((L) => {
        O = L === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((A) => {
          A === "r" && (O = O.map((C) => Object.values(C).reverse()));
          let g = (L === "u" ? y.predecessors : y.successors).bind(y), E = l(y, O, k, g), j = s(y, O, E.root, E.align, A === "r");
          A === "r" && (j = c.mapValues(j, (C) => -C)), v[L + A] = j;
        });
      });
      let w = r(y, v);
      return a(v, w), m(v, y.graph().align);
    }
    function _(y, N, k) {
      return (v, O, w) => {
        let L = v.node(O), A = v.node(w), g = 0, E;
        if (g += L.width / 2, Object.hasOwn(L, "labelpos"))
          switch (L.labelpos.toLowerCase()) {
            case "l":
              E = -L.width / 2;
              break;
            case "r":
              E = L.width / 2;
              break;
          }
        if (E && (g += k ? E : -E), E = 0, g += (L.dummy ? N : y) / 2, g += (A.dummy ? N : y) / 2, g += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              E = A.width / 2;
              break;
            case "r":
              E = -A.width / 2;
              break;
          }
        return E && (g += k ? E : -E), E = 0, g;
      };
    }
    function T(y, N) {
      return y.node(N).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, d, u) {
    let h = e("../util"), c = e("./bk").positionX;
    d.exports = f;
    function f(i) {
      i = h.asNonCompoundGraph(i), o(i), Object.entries(c(i)).forEach(([n, t]) => i.node(n).x = t);
    }
    function o(i) {
      let n = h.buildLayerMatrix(i), t = i.graph().ranksep, l = 0;
      n.forEach((s) => {
        const p = s.reduce((r, a) => {
          const m = i.node(a).height;
          return r > m ? r : m;
        }, 0);
        s.forEach((r) => i.node(r).y = l + p / 2), l += p + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, d, u) {
    var h = e("@dagrejs/graphlib").Graph, c = e("./util").slack;
    d.exports = f;
    function f(t) {
      var l = new h({ directed: !1 }), s = t.nodes()[0], p = t.nodeCount();
      l.setNode(s, {});
      for (var r, a; o(l, t) < p; )
        r = i(l, t), a = l.hasNode(r.v) ? c(t, r) : -c(t, r), n(l, t, a);
      return l;
    }
    function o(t, l) {
      function s(p) {
        l.nodeEdges(p).forEach((r) => {
          var a = r.v, m = p === a ? r.w : a;
          !t.hasNode(m) && !c(l, r) && (t.setNode(m, {}), t.setEdge(p, m, {}), s(m));
        });
      }
      return t.nodes().forEach(s), t.nodeCount();
    }
    function i(t, l) {
      return l.edges().reduce((p, r) => {
        let a = Number.POSITIVE_INFINITY;
        return t.hasNode(r.v) !== t.hasNode(r.w) && (a = c(l, r)), a < p[0] ? [a, r] : p;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function n(t, l, s) {
      t.nodes().forEach((p) => l.node(p).rank += s);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, d, u) {
    var h = e("./util"), c = h.longestPath, f = e("./feasible-tree"), o = e("./network-simplex");
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
    var n = c;
    function t(s) {
      c(s), f(s);
    }
    function l(s) {
      o(s);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, d, u) {
    var h = e("./feasible-tree"), c = e("./util").slack, f = e("./util").longestPath, o = e("@dagrejs/graphlib").alg.preorder, i = e("@dagrejs/graphlib").alg.postorder, n = e("../util").simplify;
    d.exports = t, t.initLowLimValues = r, t.initCutValues = l, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = b, t.exchangeEdges = _;
    function t(k) {
      k = n(k), f(k);
      var v = h(k);
      r(v), l(v, k);
      for (var O, w; O = m(v); )
        w = b(v, k, O), _(v, k, O, w);
    }
    function l(k, v) {
      var O = i(k, k.nodes());
      O = O.slice(0, O.length - 1), O.forEach((w) => s(k, v, w));
    }
    function s(k, v, O) {
      var w = k.node(O), L = w.parent;
      k.edge(O, L).cutvalue = p(k, v, O);
    }
    function p(k, v, O) {
      var w = k.node(O), L = w.parent, A = !0, g = v.edge(O, L), E = 0;
      return g || (A = !1, g = v.edge(L, O)), E = g.weight, v.nodeEdges(O).forEach((j) => {
        var C = j.v === O, R = C ? j.w : j.v;
        if (R !== L) {
          var V = C === A, $ = v.edge(j).weight;
          if (E += V ? $ : -$, y(k, O, R)) {
            var F = k.edge(O, R).cutvalue;
            E += V ? -F : F;
          }
        }
      }), E;
    }
    function r(k, v) {
      arguments.length < 2 && (v = k.nodes()[0]), a(k, {}, 1, v);
    }
    function a(k, v, O, w, L) {
      var A = O, g = k.node(w);
      return v[w] = !0, k.neighbors(w).forEach((E) => {
        Object.hasOwn(v, E) || (O = a(k, v, O, E, w));
      }), g.low = A, g.lim = O++, L ? g.parent = L : delete g.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function b(k, v, O) {
      var w = O.v, L = O.w;
      v.hasEdge(w, L) || (w = O.w, L = O.v);
      var A = k.node(w), g = k.node(L), E = A, j = !1;
      A.lim > g.lim && (E = g, j = !0);
      var C = v.edges().filter((R) => j === N(k, k.node(R.v), E) && j !== N(k, k.node(R.w), E));
      return C.reduce((R, V) => c(v, V) < c(v, R) ? V : R);
    }
    function _(k, v, O, w) {
      var L = O.v, A = O.w;
      k.removeEdge(L, A), k.setEdge(w.v, w.w, {}), r(k), l(k, v), T(k, v);
    }
    function T(k, v) {
      var O = k.nodes().find((L) => !v.node(L).parent), w = o(k, O);
      w = w.slice(1), w.forEach((L) => {
        var A = k.node(L).parent, g = v.edge(L, A), E = !1;
        g || (g = v.edge(A, L), E = !0), v.node(L).rank = v.node(A).rank + (E ? g.minlen : -g.minlen);
      });
    }
    function y(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, d, u) {
    const { applyWithChunking: h } = e("../util");
    d.exports = { longestPath: c, slack: f };
    function c(o) {
      var i = {};
      function n(t) {
        var l = o.node(t);
        if (Object.hasOwn(i, t))
          return l.rank;
        i[t] = !0;
        let s = o.outEdges(t).map((r) => r == null ? Number.POSITIVE_INFINITY : n(r.w) - o.edge(r).minlen);
        var p = h(Math.min, s);
        return p === Number.POSITIVE_INFINITY && (p = 0), l.rank = p;
      }
      o.sources().forEach(n);
    }
    function f(o, i) {
      return o.node(i.w).rank - o.node(i.v).rank - o.edge(i).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, d, u) {
    let h = e("@dagrejs/graphlib").Graph;
    d.exports = { addBorderNode: r, addDummyNode: c, applyWithChunking: b, asNonCompoundGraph: o, buildLayerMatrix: l, intersectRect: t, mapValues: L, maxRank: _, normalizeRanks: s, notime: N, partition: T, pick: w, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: f, successorWeights: i, time: y, uniqueId: v, zipObject: A };
    function c(g, E, j, C) {
      for (var R = C; g.hasNode(R); )
        R = v(C);
      return j.dummy = E, g.setNode(R, j), R;
    }
    function f(g) {
      let E = new h().setGraph(g.graph());
      return g.nodes().forEach((j) => E.setNode(j, g.node(j))), g.edges().forEach((j) => {
        let C = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, R = g.edge(j);
        E.setEdge(j.v, j.w, { weight: C.weight + R.weight, minlen: Math.max(C.minlen, R.minlen) });
      }), E;
    }
    function o(g) {
      let E = new h({ multigraph: g.isMultigraph() }).setGraph(g.graph());
      return g.nodes().forEach((j) => {
        g.children(j).length || E.setNode(j, g.node(j));
      }), g.edges().forEach((j) => {
        E.setEdge(j, g.edge(j));
      }), E;
    }
    function i(g) {
      let E = g.nodes().map((j) => {
        let C = {};
        return g.outEdges(j).forEach((R) => {
          C[R.w] = (C[R.w] || 0) + g.edge(R).weight;
        }), C;
      });
      return A(g.nodes(), E);
    }
    function n(g) {
      let E = g.nodes().map((j) => {
        let C = {};
        return g.inEdges(j).forEach((R) => {
          C[R.v] = (C[R.v] || 0) + g.edge(R).weight;
        }), C;
      });
      return A(g.nodes(), E);
    }
    function t(g, E) {
      let j = g.x, C = g.y, R = E.x - j, V = E.y - C, $ = g.width / 2, F = g.height / 2;
      if (!R && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, q;
      return Math.abs(V) * $ > Math.abs(R) * F ? (V < 0 && (F = -F), H = F * R / V, q = F) : (R < 0 && ($ = -$), H = $, q = $ * V / R), { x: j + H, y: C + q };
    }
    function l(g) {
      let E = O(_(g) + 1).map(() => []);
      return g.nodes().forEach((j) => {
        let C = g.node(j), R = C.rank;
        R !== void 0 && (E[R][C.order] = j);
      }), E;
    }
    function s(g) {
      let E = g.nodes().map((C) => {
        let R = g.node(C).rank;
        return R === void 0 ? Number.MAX_VALUE : R;
      }), j = b(Math.min, E);
      g.nodes().forEach((C) => {
        let R = g.node(C);
        Object.hasOwn(R, "rank") && (R.rank -= j);
      });
    }
    function p(g) {
      let E = g.nodes().map(($) => g.node($).rank), j = b(Math.min, E), C = [];
      g.nodes().forEach(($) => {
        let F = g.node($).rank - j;
        C[F] || (C[F] = []), C[F].push($);
      });
      let R = 0, V = g.graph().nodeRankFactor;
      Array.from(C).forEach(($, F) => {
        $ === void 0 && F % V !== 0 ? --R : $ !== void 0 && R && $.forEach((H) => g.node(H).rank += R);
      });
    }
    function r(g, E, j, C) {
      let R = { width: 0, height: 0 };
      return arguments.length >= 4 && (R.rank = j, R.order = C), c(g, "border", R, E);
    }
    function a(g, E = m) {
      const j = [];
      for (let C = 0; C < g.length; C += E) {
        const R = g.slice(C, C + E);
        j.push(R);
      }
      return j;
    }
    const m = 65535;
    function b(g, E) {
      if (E.length > m) {
        const j = a(E);
        return g.apply(null, j.map((C) => g.apply(null, C)));
      } else
        return g.apply(null, E);
    }
    function _(g) {
      const j = g.nodes().map((C) => {
        let R = g.node(C).rank;
        return R === void 0 ? Number.MIN_VALUE : R;
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
      const R = [];
      for (let V = g; C(V); V += j)
        R.push(V);
      return R;
    }
    function w(g, E) {
      const j = {};
      for (const C of E)
        g[C] !== void 0 && (j[C] = g[C]);
      return j;
    }
    function L(g, E) {
      let j = E;
      return typeof E == "string" && (j = (C) => C[E]), Object.entries(g).reduce((C, [R, V]) => (C[R] = j(V, R), C), {});
    }
    function A(g, E) {
      return g.reduce((j, C, R) => (j[C] = E[R], j), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, d, u) {
    d.exports = "1.1.8";
  }, {}], 29: [function(e, d, u) {
    var h = e("./lib");
    d.exports = { Graph: h.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: h.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, d, u) {
    d.exports = h;
    function h(c) {
      var f = {}, o = [], i;
      function n(t) {
        Object.hasOwn(f, t) || (f[t] = !0, i.push(t), c.successors(t).forEach(n), c.predecessors(t).forEach(n));
      }
      return c.nodes().forEach(function(t) {
        i = [], n(t), i.length && o.push(i);
      }), o;
    }
  }, {}], 31: [function(e, d, u) {
    d.exports = h;
    function h(i, n, t) {
      Array.isArray(n) || (n = [n]);
      var l = i.isDirected() ? (a) => i.successors(a) : (a) => i.neighbors(a), s = t === "post" ? c : f, p = [], r = {};
      return n.forEach((a) => {
        if (!i.hasNode(a))
          throw new Error("Graph does not have node: " + a);
        s(a, l, r, p);
      }), p;
    }
    function c(i, n, t, l) {
      for (var s = [[i, !1]]; s.length > 0; ) {
        var p = s.pop();
        p[1] ? l.push(p[0]) : Object.hasOwn(t, p[0]) || (t[p[0]] = !0, s.push([p[0], !0]), o(n(p[0]), (r) => s.push([r, !1])));
      }
    }
    function f(i, n, t, l) {
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
    var h = e("./dijkstra");
    d.exports = c;
    function c(f, o, i) {
      return f.nodes().reduce(function(n, t) {
        return n[t] = h(f, t, o, i), n;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, d, u) {
    var h = e("../data/priority-queue");
    d.exports = f;
    var c = () => 1;
    function f(i, n, t, l) {
      return o(i, String(n), t || c, l || function(s) {
        return i.outEdges(s);
      });
    }
    function o(i, n, t, l) {
      var s = {}, p = new h(), r, a, m = function(b) {
        var _ = b.v !== r ? b.v : b.w, T = s[_], y = t(b), N = a.distance + y;
        if (y < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + b + " Weight: " + y);
        N < T.distance && (T.distance = N, T.predecessor = r, p.decrease(_, N));
      };
      for (i.nodes().forEach(function(b) {
        var _ = b === n ? 0 : Number.POSITIVE_INFINITY;
        s[b] = { distance: _ }, p.add(b, _);
      }); p.size() > 0 && (r = p.removeMin(), a = s[r], a.distance !== Number.POSITIVE_INFINITY); )
        l(r).forEach(m);
      return s;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, d, u) {
    var h = e("./tarjan");
    d.exports = c;
    function c(f) {
      return h(f).filter(function(o) {
        return o.length > 1 || o.length === 1 && f.hasEdge(o[0], o[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, d, u) {
    d.exports = c;
    var h = () => 1;
    function c(o, i, n) {
      return f(o, i || h, n || function(t) {
        return o.outEdges(t);
      });
    }
    function f(o, i, n) {
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
          l.forEach(function(m) {
            var b = a[s], _ = p[m], T = a[m], y = b.distance + _.distance;
            y < T.distance && (T.distance = y, T.predecessor = _.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, d, u) {
    d.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, d, u) {
    var h = e("./topsort");
    d.exports = c;
    function c(f) {
      try {
        h(f);
      } catch (o) {
        if (o instanceof h.CycleException)
          return !1;
        throw o;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, d, u) {
    var h = e("./dfs");
    d.exports = c;
    function c(f, o) {
      return h(f, o, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, d, u) {
    var h = e("./dfs");
    d.exports = c;
    function c(f, o) {
      return h(f, o, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, d, u) {
    var h = e("../graph"), c = e("../data/priority-queue");
    d.exports = f;
    function f(o, i) {
      var n = new h(), t = {}, l = new c(), s;
      function p(a) {
        var m = a.v === s ? a.w : a.v, b = l.priority(m);
        if (b !== void 0) {
          var _ = i(a);
          _ < b && (t[m] = s, l.decrease(m, _));
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
    d.exports = h;
    function h(c) {
      var f = 0, o = [], i = {}, n = [];
      function t(l) {
        var s = i[l] = { onStack: !0, lowlink: f, index: f++ };
        if (o.push(l), c.successors(l).forEach(function(a) {
          Object.hasOwn(i, a) ? i[a].onStack && (s.lowlink = Math.min(s.lowlink, i[a].index)) : (t(a), s.lowlink = Math.min(s.lowlink, i[a].lowlink));
        }), s.lowlink === s.index) {
          var p = [], r;
          do
            r = o.pop(), i[r].onStack = !1, p.push(r);
          while (l !== r);
          n.push(p);
        }
      }
      return c.nodes().forEach(function(l) {
        Object.hasOwn(i, l) || t(l);
      }), n;
    }
  }, {}], 42: [function(e, d, u) {
    function h(f) {
      var o = {}, i = {}, n = [];
      function t(l) {
        if (Object.hasOwn(i, l))
          throw new c();
        Object.hasOwn(o, l) || (i[l] = !0, o[l] = !0, f.predecessors(l).forEach(t), delete i[l], n.push(l));
      }
      if (f.sinks().forEach(t), Object.keys(o).length !== f.nodeCount())
        throw new c();
      return n;
    }
    class c extends Error {
      constructor() {
        super(...arguments);
      }
    }
    d.exports = h, h.CycleException = c;
  }, {}], 43: [function(e, d, u) {
    class h {
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
        return this._arr.map(function(f) {
          return f.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(f) {
        return Object.hasOwn(this._keyIndices, f);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(f) {
        var o = this._keyIndices[f];
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
      add(f, o) {
        var i = this._keyIndices;
        if (f = String(f), !Object.hasOwn(i, f)) {
          var n = this._arr, t = n.length;
          return i[f] = t, n.push({ key: f, priority: o }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var f = this._arr.pop();
        return delete this._keyIndices[f.key], this._heapify(0), f.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(f, o) {
        var i = this._keyIndices[f];
        if (o > this._arr[i].priority)
          throw new Error("New priority is greater than current priority. Key: " + f + " Old: " + this._arr[i].priority + " New: " + o);
        this._arr[i].priority = o, this._decrease(i);
      }
      _heapify(f) {
        var o = this._arr, i = 2 * f, n = i + 1, t = f;
        i < o.length && (t = o[i].priority < o[t].priority ? i : t, n < o.length && (t = o[n].priority < o[t].priority ? n : t), t !== f && (this._swap(f, t), this._heapify(t)));
      }
      _decrease(f) {
        for (var o = this._arr, i = o[f].priority, n; f !== 0 && (n = f >> 1, !(o[n].priority < i)); )
          this._swap(f, n), f = n;
      }
      _swap(f, o) {
        var i = this._arr, n = this._keyIndices, t = i[f], l = i[o];
        i[f] = l, i[o] = t, n[l.key] = f, n[t.key] = o;
      }
    }
    d.exports = h;
  }, {}], 44: [function(e, d, u) {
    var h = "\0", c = "\0", f = "";
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
        var m = arguments, b = this;
        return r.forEach(function(_) {
          m.length > 1 ? b.setNode(_, a) : b.setNode(_);
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
          var m = (b) => a.removeEdge(a._edgeObjs[b]);
          delete this._nodes[r], this._isCompound && (this._removeFromParentsChildList(r), delete this._parent[r], this.children(r).forEach(function(b) {
            a.setParent(b);
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
          const b = new Set(a);
          for (var m of this.successors(r))
            b.add(m);
          return Array.from(b.values());
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
        Object.entries(this._nodes).forEach(function([T, y]) {
          r(T) && a.setNode(T, y);
        }), Object.values(this._edgeObjs).forEach(function(T) {
          a.hasNode(T.v) && a.hasNode(T.w) && a.setEdge(T, m.edge(T));
        });
        var b = {};
        function _(T) {
          var y = m.parent(T);
          return y === void 0 || a.hasNode(y) ? (b[T] = y, y) : y in b ? b[y] : _(y);
        }
        return this._isCompound && a.nodes().forEach((T) => a.setParent(T, _(T))), a;
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
        var m = this, b = arguments;
        return r.reduce(function(_, T) {
          return b.length > 1 ? m.setEdge(_, T, a) : m.setEdge(_, T), T;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var r, a, m, b, _ = !1, T = arguments[0];
        typeof T == "object" && T !== null && "v" in T ? (r = T.v, a = T.w, m = T.name, arguments.length === 2 && (b = arguments[1], _ = !0)) : (r = T, a = arguments[1], m = arguments[3], arguments.length > 2 && (b = arguments[2], _ = !0)), r = "" + r, a = "" + a, m !== void 0 && (m = "" + m);
        var y = t(this._isDirected, r, a, m);
        if (Object.hasOwn(this._edgeLabels, y))
          return _ && (this._edgeLabels[y] = b), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(r), this.setNode(a), this._edgeLabels[y] = _ ? b : this._defaultEdgeLabelFn(r, a, m);
        var N = l(this._isDirected, r, a, m);
        return r = N.v, a = N.w, Object.freeze(N), this._edgeObjs[y] = N, i(this._preds[a], r), i(this._sucs[r], a), this._in[a][y] = N, this._out[r][y] = N, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(r, a, m) {
        var b = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m);
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
      hasEdge(r, a, m) {
        var b = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m);
        return Object.hasOwn(this._edgeLabels, b);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(r, a, m) {
        var b = arguments.length === 1 ? s(this._isDirected, arguments[0]) : t(this._isDirected, r, a, m), _ = this._edgeObjs[b];
        return _ && (r = _.v, a = _.w, delete this._edgeLabels[b], delete this._edgeObjs[b], n(this._preds[a], r), n(this._sucs[r], a), delete this._in[a][b], delete this._out[r][b], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(r, a) {
        var m = this._in[r];
        if (m) {
          var b = Object.values(m);
          return a ? b.filter((_) => _.v === a) : b;
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
          var b = Object.values(m);
          return a ? b.filter((_) => _.w === a) : b;
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
      var b = "" + r, _ = "" + a;
      if (!p && b > _) {
        var T = b;
        b = _, _ = T;
      }
      return b + f + _ + f + (m === void 0 ? h : m);
    }
    function l(p, r, a, m) {
      var b = "" + r, _ = "" + a;
      if (!p && b > _) {
        var T = b;
        b = _, _ = T;
      }
      var y = { v: b, w: _ };
      return m && (y.name = m), y;
    }
    function s(p, r) {
      return t(p, r.v, r.w, r.name);
    }
    d.exports = o;
  }, {}], 45: [function(e, d, u) {
    d.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, d, u) {
    var h = e("./graph");
    d.exports = { write: c, read: i };
    function c(n) {
      var t = { options: { directed: n.isDirected(), multigraph: n.isMultigraph(), compound: n.isCompound() }, nodes: f(n), edges: o(n) };
      return n.graph() !== void 0 && (t.value = structuredClone(n.graph())), t;
    }
    function f(n) {
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
      var t = new h(n.options).setGraph(n.value);
      return n.nodes.forEach(function(l) {
        t.setNode(l.v, l.value), l.parent && t.setParent(l.v, l.parent);
      }), n.edges.forEach(function(l) {
        t.setEdge({ v: l.v, w: l.w, name: l.name }, l.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, d, u) {
    d.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), Ut = ["unstarted", "started", "completed", "canceled"];
function Bt(e, d) {
  let u = 1;
  const h = () => `${e.slice(0, 40 - String(u).length - 1)}_${u}`;
  for (; d.some((c) => c.id === h()); ) u++;
  return h();
}
function Wt(e, d) {
  return [
    ...e.initial === d.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((u) => u.to === d.id || u.from !== "any" && u.from.includes(d.id)).map((u) => `transition ${Et(u)}`),
    ...e.states.filter((u) => u.regions?.some((h) => h.initial === d.id)).map((u) => `lanes in ${Ae(u)}`),
    ...Object.entries(e.map ?? {}).filter(([, u]) => u === d.id).map(() => "existing item migration")
  ];
}
function Yt(e, d) {
  return e.states.flatMap((u) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((h) => u.run?.[h] === d.id).map((h) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[h]} handler in ${Ae(u)}`),
    ...(u.timers ?? []).filter((h) => h.then?.transition === d.id).map(() => "a timer")
  ]);
}
const Ae = (e) => e?.name || "Untitled state", Et = (e) => e.name?.trim() || he(e.id), zt = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", Jt = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function Ht(e, d) {
  if (e.id === d.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const u = e.release_when?.approvals?.min;
    return u ? `Needs ${u} approval${u === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? Ve(e) : "A person moves it";
}
function Ve(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Kt(e, d) {
  const u = e.release_when?.approvals?.min ?? 1, h = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${u === 1 ? "one person approves" : `${u} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${Ve(e)}.` : "A person chooses when to move the item on.", c = d.policy?.wip?.[e.id]?.limit;
  return h + (c !== void 0 ? ` At most ${c} at a time.` : "");
}
function qt(e) {
  const d = e.transitions ?? [], u = [], h = /* @__PURE__ */ new Set();
  let c = e.states.find((o) => o.id === e.initial);
  const f = new Map(e.states.map((o, i) => [o.id, i]));
  for (; c && !h.has(c.id) && (u.push(c), h.add(c.id), !(c.category === "completed" || c.category === "canceled")); ) {
    const o = c, i = d.filter((t) => t.from !== "any" && t.from.includes(o.id)), n = i.find((t) => t.default) ?? i.find((t) => !h.has(t.to) && (f.get(t.to) ?? -1) > (f.get(o.id) ?? 0));
    c = e.states.find((t) => t.id === n?.to);
  }
  return u;
}
function $e(e) {
  const d = e.states.find((u) => u.id === e.initial);
  return e.migration ?? (d?.kind === "automated" || d?.kind === "parallel" ? "pin" : "follow");
}
const ne = (e) => JSON.parse(JSON.stringify(e));
function Xt(e) {
  return e?.admin === !0;
}
function Qt(e, d, u) {
  const h = d + u;
  if (d < 0 || d >= e.length || h < 0 || h >= e.length) return;
  const [c] = e.splice(d, 1);
  e.splice(h, 0, c);
}
function Zt(e, d, u) {
  const h = d.code;
  if (h === u) return;
  if (e.fields?.some((n) => n.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  d.code = u;
  const c = (n) => n === h ? u : n;
  for (const n of e.item_types ?? [])
    n.fields = n.fields.map(c), n.inherit && (n.inherit = n.inherit.map(c));
  const f = (n) => {
    for (const t of n ?? []) "field" in t && t.field === h && (t.field = u);
  }, o = (n) => {
    n && typeof n == "object" && !Array.isArray(n) && "field" in n && typeof n.field == "string" && (n.field = c(n.field));
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
    n.field && (n.field = c(n.field)), i(n.where), f(n.access?.read), f(n.access?.write);
  if (e.visibility) {
    e.visibility.field = c(e.visibility.field);
    for (const n of e.visibility.levels) f(n.holders);
  }
  for (const n of e.processes ?? []) {
    for (const t of n.states) {
      o(t.awaiting), o(t.release_when?.approvals?.from), i(t.release_when?.when), t.require && (t.require = t.require.map(c));
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
function en(e, d) {
  const u = ne(e);
  for (const c of u.fields ?? [])
    c.type?.includes(":") && delete c.form;
  const h = { ...u.remove };
  d.visibility && !u.visibility ? h.visibility = !0 : delete h.visibility;
  for (const c of ["fields", "item_types", "processes", "relation_types"]) {
    const f = (d[c] ?? []).filter((o) => {
      if (c === "fields") {
        const i = o;
        return !u.fields?.some((n) => i.id !== void 0 ? n.id === i.id : n.code === i.code);
      }
      return !(u[c] ?? []).some((i) => "id" in i && i.id === ("id" in o ? o.id : void 0));
    }).map((o) => "code" in o ? o.code : o.id);
    f.length ? h[c] = [.../* @__PURE__ */ new Set([...h[c] ?? [], ...f])] : delete h[c];
  }
  return Object.keys(h).length ? u.remove = h : delete u.remove, u;
}
function tn(e, d, u) {
  const h = JSON.stringify({ declaration: e, configs: u });
  return {
    declaration: ne(e),
    expected_generation: d,
    plugin_configs: ne(u),
    matches: (c, f, o) => d === f && h === JSON.stringify({ declaration: c, configs: o })
  };
}
function nn(e) {
  const d = ne(e), u = [...new Set(d.declaration.item_types?.flatMap((c) => c.fields) ?? [])], h = (c) => {
    const f = u.indexOf(c);
    return f < 0 ? u.length : f;
  };
  d.declaration.fields?.sort((c, f) => h(c.code) - h(f.code));
  for (const c of d.declaration.fields ?? []) {
    const f = d.compiled.fields?.find((o) => o.code === c.code);
    c.id ??= f?.id, c.form ??= f?.form;
  }
  for (const c of d.declaration.processes ?? []) c.migration ??= d.compiled.processes?.find((f) => f.id === c.id)?.migration ?? $e(c);
  return d;
}
function rn(e, d) {
  return (d.processes ?? []).filter((u) => $e(u) !== "pin" && e.changes.some((h) => h.code === "process " + u.id && h.class !== "cosmetic" && h.class !== "refused")).map((u) => u.id);
}
function an(e, d, u) {
  const h = [u, `item_type ${u}`, `relation ${u}`, `process ${u}`], c = e.refused.filter((f) => h.includes(f.code));
  return d === "fields" && c.push(...e.changes.filter((f) => f.code === u && f.what === "removed" && f.class === "semantic")), c.length ? c.map(xt).join(" ") : void 0;
}
function sn(e, d, u) {
  if (d === "fields") {
    e.fields = e.fields?.filter((h) => h.code !== u);
    for (const h of e.item_types ?? [])
      h.fields = h.fields.filter((c) => c !== u), h.inherit = h.inherit?.filter((c) => c !== u);
  } else d === "item_types" ? e.item_types = e.item_types?.filter((h) => h.id !== u) : d === "processes" ? e.processes = e.processes?.filter((h) => h.id !== u) : e.relation_types = e.relation_types?.filter((h) => h.id !== u);
}
function xt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function on(e, d) {
  if (!(e instanceof te)) return [];
  const u = e.details ?? {};
  let h = typeof u.field == "string" ? u.field : "";
  if (!h) {
    const c = d.processes?.find((f) => f.id === u.process || f.states.some((o) => o.id === u.state) || e.message.includes(`process ${f.id}`));
    c ? h = `process ${c.id}` : typeof u.item_type == "string" && (h = `item_type ${u.item_type}`);
  }
  return h ? [{ code: h, class: "refused", what: "invalid", detail: Ce(e, "The definition is invalid.") }] : [];
}
const ln = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, dn = (e) => !("problem" in e);
function un(e, d) {
  return { pack: e.id, version: e.version, expected_generation: d };
}
async function cn(e, d) {
  const u = { ...ne(e), resolutions: ne(e.resolutions ?? {}) };
  let h = await d(u);
  return u.maps || (u.maps = ne(h.maps), h = await d(u)), { request: u, plan: h };
}
function fn() {
  let e = 0;
  return () => {
    const d = ++e;
    return () => d === e;
  };
}
export {
  sn as A,
  Zt as B,
  Jt as C,
  te as D,
  Te as E,
  Bt as F,
  Kt as G,
  Yt as H,
  Wt as I,
  $e as J,
  ne as K,
  fe as L,
  ut as M,
  ln as N,
  en as O,
  rn as P,
  un as Q,
  cn as R,
  nn as S,
  tn as T,
  on as U,
  an as V,
  Dt as _,
  dn as a,
  ct as b,
  Re as c,
  Pt as d,
  Xt as e,
  Ce as f,
  St as g,
  Gt as h,
  Ht as i,
  Me as j,
  oe as k,
  fn as l,
  qt as m,
  At as n,
  lt as o,
  re as p,
  Ut as q,
  Vt as r,
  Ae as s,
  Et as t,
  $t as u,
  zt as v,
  Ft as w,
  Qt as x,
  he as y,
  xt as z
};
//# sourceMappingURL=latestRequest-DwIpRsvA.js.map
