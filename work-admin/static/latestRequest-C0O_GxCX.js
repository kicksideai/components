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
  constructor(l, c, f) {
    super(l.message ?? l.error ?? `${c} failed`), this.name = "ApiError", this.kind = l.kind, this.details = l.details, this.retryable = l.retryable, this.status = f;
  }
}
const je = {
  key_prefix_taken: "That item key prefix is already in use. Choose another prefix.",
  plugin_config_invalid: "The plugin rejected this configuration. Check its settings and try again.",
  generation_changed: "The board settings changed. Review your changes again before applying them.",
  no_parked_migration: "There is no paused migration to resume."
};
function Ae(e, l) {
  const c = e instanceof ee ? e.details?.code : void 0, f = e instanceof Error && e.message || l;
  return typeof c != "string" || !c.trim() ? f : `${Object.hasOwn(je, c) ? je[c] : f}
Error code: ${c}`;
}
function Me(e, l) {
  const c = e;
  if (c && typeof c == "object" && c.success === !1) throw new ee(c, l);
  if (c && typeof c == "object" && c.success === !0 && c.data !== void 0) return c.data;
  throw new ee({ kind: "INTERNAL", message: `${l}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, l);
}
function Se(e, l) {
  if (e instanceof ee) return e;
  const c = e?.response;
  return c?.data ? new ee(c.data, l, c.status) : e instanceof Error ? e : new ee({ kind: "Unavailable" }, l);
}
async function ye(e, l, c) {
  try {
    return Me((await Te.get(e, { params: c })).data, l);
  } catch (f) {
    throw Se(f, l);
  }
}
async function ne(e, l, c) {
  try {
    return Me((await Te.post(e, l)).data, c);
  } catch (f) {
    throw Se(f, c);
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
    const l = We(e, "open");
    return (c, f) => (U(), X(B(rt), {
      class: "kx-disclosure",
      value: l.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = (u) => l.value = u === "content")
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
                Le(c.$slots, "default")
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
  setup(e, { emit: l }) {
    const c = e, f = l, u = q(""), h = q("");
    le(() => c.modelValue, (i) => {
      u.value = i === void 0 ? "" : JSON.stringify(i, null, 2), h.value = "", f("validity", !0);
    }, { immediate: !0 }), ve(() => f("validity", !0));
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
            value: u.value,
            "aria-invalid": !!h.value,
            onInput: n[0] || (n[0] = (t) => d(t.target.value))
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
function fe(e, l = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((f) => fe(f, l)).join(", ");
  if (typeof e == "string") return l.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const c = e;
  for (const f of ["display_name", "displayName", "name", "label"]) if (typeof c[f] == "string" && c[f] && !pe(c[f])) return c[f];
  return l.get(`${c.kind ?? "user"}:${c.id}`) ?? (typeof c.email == "string" && c.email ? c.email : c.kind === "group" ? "Unavailable group" : typeof c.id == "string" ? fe(c.id, l) : "Unavailable person");
}
async function mt(e, l) {
  const c = [...new Map(l.map((i) => [`${i.kind}:${i.id}`, { type: i.kind, id: i.id }])).values()].sort((i, n) => `${i.type}:${i.id}`.localeCompare(`${n.type}:${n.id}`)), f = JSON.stringify([e, c]), u = we.get(f);
  if (u) return u;
  const d = (async () => {
    const i = /* @__PURE__ */ new Map();
    for (let n = 0; n < c.length; n += 200) {
      const t = await ne(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: c.slice(n, n + 200) }, "Display names");
      for (const a of t.principals) a.label.trim() && !pe(a.label) && a.label !== a.id && i.set(`${a.type}:${a.id}`, a.label.trim());
    }
    return i;
  })();
  we.set(f, d);
  try {
    return await d;
  } finally {
    we.delete(f);
  }
}
function gt(e, l) {
  const c = q(/* @__PURE__ */ new Map()), f = q("");
  let u = 0;
  return le([e, l], async ([h, d]) => {
    const i = ++u;
    if (c.value = /* @__PURE__ */ new Map(), f.value = "", !(!h || !d.length))
      try {
        const n = await mt(h, d);
        i === u && (c.value = n);
      } catch (n) {
        i === u && (f.value = Ae(n, "Display names are unavailable."));
      }
  }, { immediate: !0, deep: !0 }), ze(() => {
    u++, c.value.clear();
  }), {
    labels: c,
    error: f,
    label: (h) => fe(h, c.value),
    remember: (h, d) => {
      d.trim() && !pe(d) && d !== h.id && c.value.set(`${h.kind}:${h.id}`, d.trim());
    }
  };
}
function me(e) {
  if (pe(e)) return "Untitled";
  const l = e.replace(/[_-]+/g, " ");
  return l.charAt(0).toUpperCase() + l.slice(1);
}
function Yt(e) {
  return e.title?.trim() || me(e.code);
}
function Re(e, l, c = fe) {
  return e == null ? "—" : l?.type === "principal" ? c(e) : Array.isArray(e) ? e.map((f) => Re(f, l, c)).join(", ") : l?.type === "option" && typeof e == "string" ? l.options?.find((f) => f.id === e)?.label || me(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (l?.form === "ref" || l?.type === "item") && "unavailable" in e ? "Unavailable" : l?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : l?.form === "ref" && "ref" in e && Array.isArray(e.ref) || l?.form === "ref" && "id" in e && typeof e.id == "string" || l?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function zt(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function Jt(e, l) {
  const c = gt(e, l);
  return {
    display: (f, u) => Re(f, u, c.label),
    principalLabel: c.label,
    rememberPrincipal: c.remember,
    nameError: c.error,
    nameLabels: c.labels
  };
}
function Ve(e) {
  return Object.entries(de(e.properties)).map(([l, c]) => {
    const f = de(c);
    return { key: l, title: typeof f.title == "string" && f.title.trim() ? f.title : me(l), description: typeof f.description == "string" ? f.description : "", schema: f };
  });
}
const $e = (e) => e.type === "array" && de(e.items).type === "string";
function bt(e, l) {
  const c = {};
  for (const f of Ve(e)) {
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
      else if ($e(h)) {
        const i = de(h.items);
        u.some((n) => typeof n != "string" || typeof i.minLength == "number" && n.length < i.minLength || typeof i.maxLength == "number" && n.length > i.maxLength) && (d = "Each entry must match the declared text length.");
      }
    } else h.type === "object" && (typeof u != "object" || Array.isArray(u)) && (d = "Enter an object.");
    d && (c[f.key] = d);
  }
  return c;
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
  setup(e, { emit: l }) {
    const c = e, f = l, u = q({}), h = q(/* @__PURE__ */ new Set()), d = q(!1), i = q(!1), n = Je(), t = Z(() => Ve(c.schema)), a = Z(() => bt(c.schema, c.modelValue)), o = Z(() => t.value.filter((v) => typeof v.schema.picker == "string")), p = Z(() => t.value.filter((v) => typeof v.schema.picker != "string")), r = Z(() => ({ ...c.schema, properties: Object.fromEntries(o.value.map((v) => [v.key, { ...v.schema, title: v.title }])), required: Array.isArray(c.schema.required) ? c.schema.required.filter((v) => o.value.some((O) => O.key === v)) : [] })), s = Z(() => Object.fromEntries(o.value.map((v) => [v.key, c.modelValue[v.key]]))), m = Z(() => !Object.keys(a.value).length && !h.value.size && (!o.value.length || d.value));
    le(m, (v) => f("validity", v), { immediate: !0 });
    async function g() {
      i.value = !0, d.value = await lt("wc-schema-form"), i.value = !1;
    }
    le(() => o.value.length > 0, (v) => {
      v && g();
    }, { immediate: !0 }), ve(() => f("validity", !0));
    function _(v, O) {
      const w = { ...c.modelValue };
      O == null ? delete w[v] : w[v] = O, f("update:modelValue", w);
    }
    function T(v) {
      const O = c.modelValue[v];
      return Array.isArray(O) ? O.filter((w) => typeof w == "string") : [];
    }
    function y(v) {
      const O = u.value[v]?.trim();
      O && (_(v, [...T(v), O]), u.value[v] = "");
    }
    function N(v, O) {
      O ? h.value.delete(v) : h.value.add(v);
    }
    function k(v) {
      f("update:modelValue", { ...c.modelValue, ...de(v.detail) });
    }
    return (v, O) => (U(), Y("div", yt, [
      o.value.length && d.value ? (U(), Y("wc-schema-form", {
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
            (U(!0), Y(_e, null, Oe(T(w.key), (L, R) => (U(), X(B(nt), {
              key: R,
              label: L,
              removable: !e.disabled,
              onRemove: (b) => _(w.key, T(w.key).filter((E, j) => j !== R))
            }, null, 8, ["label", "removable", "onRemove"]))), 128)),
            ie(B(Ne), {
              id: B(n) + "-" + w.key,
              modelValue: u.value[w.key],
              "onUpdate:modelValue": (L) => u.value[w.key] = L,
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
  setup(e, { emit: l }) {
    const c = e, f = l, u = q(null);
    let h = null;
    async function d() {
      await Xe();
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
    return le(() => c.visible, d), Ke(d), ve(() => {
      u.value?.open && u.value.close(), h?.focus();
    }), (n, t) => (U(), Y("dialog", {
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
      Le(n.$slots, "default")
    ], 40, jt));
  }
}), ce = "/api/v1/work", ue = (e) => `${ce}/boards/${encodeURIComponent(e)}`, It = {
  boards: async () => {
    const e = [];
    let l;
    do {
      const c = await ye(`${ce}/boards${l ? "?after=" + encodeURIComponent(l) : ""}`, "Boards");
      e.push(...c.boards), l = c.next;
    } while (l);
    return e;
  },
  packs: () => ye(`${ce}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, l, c, f = {}) => ne(`${ce}/boards`, { title: e, declaration: l, idempotency_key: c, ...f }, "Create board"),
  updateBoard: (e, l) => ne(`${ue(e)}/update`, l, "Update board"),
  schema: (e, l, c) => ne(`${ue(e)}/get_schema`, { generation: l, ...c ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, l) => ne(`${ue(e)}/query`, l, "Item choices"),
  async stateCounts(e) {
    const l = /* @__PURE__ */ Object.create(null);
    let c;
    do {
      const f = await It.query(e, { group_by: "type", sub_group_by: "state", group_after: c, limit: 1 });
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
  item: (e, l) => ne(`${ue(e)}/get`, { item: l }, "Item choice"),
  async options(e) {
    const l = await ye(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options");
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
const Kt = (function() {
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
      let _ = o(g + m + 3).map(() => new u()), T = m + 1;
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
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, l, c) {
    let f = e("./acyclic"), u = e("./normalize"), h = e("./rank"), d = e("./util").normalizeRanks, i = e("./parent-dummy-chains"), n = e("./util").removeEmptyRanks, t = e("./nesting-graph"), a = e("./add-border-segments"), o = e("./coordinate-system"), p = e("./order"), r = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    l.exports = g;
    function g(x, I) {
      let A = I && I.debugTiming ? s.time : s.notime;
      A("layout", () => {
        let S = A("  buildLayoutGraph", () => b(x));
        A("  runLayout", () => _(S, A, I)), A("  updateInputGraph", () => T(x, S));
      });
    }
    function _(x, I, A) {
      I("    makeSpaceForEdgeLabels", () => E(x)), I("    removeSelfEdges", () => Ge(x)), I("    acyclic", () => f.run(x)), I("    nestingGraph.run", () => t.run(x)), I("    rank", () => h(s.asNonCompoundGraph(x))), I("    injectEdgeLabelProxies", () => j(x)), I("    removeEmptyRanks", () => n(x)), I("    nestingGraph.cleanup", () => t.cleanup(x)), I("    normalizeRanks", () => d(x)), I("    assignRankMinMax", () => C(x)), I("    removeEdgeLabelProxies", () => M(x)), I("    normalize.run", () => u.run(x)), I("    parentDummyChains", () => i(x)), I("    addBorderSegments", () => a(x)), I("    order", () => p(x, A)), I("    insertSelfEdges", () => Ue(x)), I("    adjustCoordinateSystem", () => o.adjust(x)), I("    position", () => r(x)), I("    positionSelfEdges", () => Be(x)), I("    removeBorderNodes", () => K(x)), I("    normalize.undo", () => u.undo(x)), I("    fixupEdgeLabelCoords", () => F(x)), I("    undoCoordinateSystem", () => o.undo(x)), I("    translateGraph", () => V(x)), I("    assignNodeIntersects", () => $(x)), I("    reversePoints", () => H(x)), I("    acyclic.undo", () => f.undo(x));
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
    function b(x) {
      let I = new m({ multigraph: !0, compound: !0 }), A = be(x.graph());
      return I.setGraph(Object.assign({}, N, ge(A, y), s.pick(A, k))), x.nodes().forEach((S) => {
        let P = be(x.node(S));
        const D = ge(P, v);
        Object.keys(O).forEach((G) => {
          D[G] === void 0 && (D[G] = O[G]);
        }), I.setNode(S, D), I.setParent(S, x.parent(S));
      }), x.edges().forEach((S) => {
        let P = be(x.edge(S));
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
      let I = Number.POSITIVE_INFINITY, A = 0, S = Number.POSITIVE_INFINITY, P = 0, D = x.graph(), G = D.marginx || 0, z = D.marginy || 0;
      function ke(J) {
        let W = J.x, se = J.y, Ee = J.width, xe = J.height;
        I = Math.min(I, W - Ee / 2), A = Math.max(A, W + Ee / 2), S = Math.min(S, se - xe / 2), P = Math.max(P, se + xe / 2);
      }
      x.nodes().forEach((J) => ke(x.node(J))), x.edges().forEach((J) => {
        let W = x.edge(J);
        Object.hasOwn(W, "x") && ke(W);
      }), I -= G, S -= z, x.nodes().forEach((J) => {
        let W = x.node(J);
        W.x -= I, W.y -= S;
      }), x.edges().forEach((J) => {
        let W = x.edge(J);
        W.points.forEach((se) => {
          se.x -= I, se.y -= S;
        }), Object.hasOwn(W, "x") && (W.x -= I), Object.hasOwn(W, "y") && (W.y -= S);
      }), D.width = A - I + G, D.height = P - S + z;
    }
    function $(x) {
      x.edges().forEach((I) => {
        let A = x.edge(I), S = x.node(I.v), P = x.node(I.w), D, G;
        A.points ? (D = A.points[0], G = A.points[A.points.length - 1]) : (A.points = [], D = P, G = S), A.points.unshift(s.intersectRect(S, D)), A.points.push(s.intersectRect(P, G));
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
    function K(x) {
      x.nodes().forEach((I) => {
        if (x.children(I).length) {
          let A = x.node(I), S = x.node(A.borderTop), P = x.node(A.borderBottom), D = x.node(A.borderLeft[A.borderLeft.length - 1]), G = x.node(A.borderRight[A.borderRight.length - 1]);
          A.width = Math.abs(G.x - D.x), A.height = Math.abs(P.y - S.y), A.x = D.x + A.width / 2, A.y = S.y + A.height / 2;
        }
      }), x.nodes().forEach((I) => {
        x.node(I).dummy === "border" && x.removeNode(I);
      });
    }
    function Ge(x) {
      x.edges().forEach((I) => {
        if (I.v === I.w) {
          var A = x.node(I.v);
          A.selfEdges || (A.selfEdges = []), A.selfEdges.push({ e: I, label: x.edge(I) }), x.removeEdge(I);
        }
      });
    }
    function Ue(x) {
      var I = s.buildLayerMatrix(x);
      I.forEach((A) => {
        var S = 0;
        A.forEach((P, D) => {
          var G = x.node(P);
          G.order = D + S, (G.selfEdges || []).forEach((z) => {
            s.addDummyNode(x, "selfedge", { width: z.label.width, height: z.label.height, rank: G.rank, order: D + ++S, e: z.e, label: z.label }, "_se");
          }), delete G.selfEdges;
        });
      });
    }
    function Be(x) {
      x.nodes().forEach((I) => {
        var A = x.node(I);
        if (A.dummy === "selfedge") {
          var S = x.node(A.e.v), P = S.x + S.width / 2, D = S.y, G = A.x - P, z = S.height / 2;
          x.setEdge(A.e, A.label), x.removeNode(I), A.label.points = [{ x: P + 2 * G / 3, y: D - z }, { x: P + 5 * G / 6, y: D - z }, { x: P + G, y: D }, { x: P + 5 * G / 6, y: D + z }, { x: P + 2 * G / 3, y: D + z }], A.label.x = A.x, A.label.y = A.y;
        }
      });
    }
    function ge(x, I) {
      return s.mapValues(s.pick(x, I), Number);
    }
    function be(x) {
      var I = {};
      return x && Object.entries(x).forEach(([A, S]) => {
        typeof A == "string" && (A = A.toLowerCase()), I[A] = S;
      }), I;
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
      let _ = f.addBorderNode(t, "_bt"), T = f.addBorderNode(t, "_bb"), y = t.node(m);
      t.setParent(_, m), y.borderTop = _, t.setParent(T, m), y.borderBottom = T, g.forEach((N) => {
        h(t, a, o, p, r, s, N);
        let k = t.node(N), v = k.borderTop ? k.borderTop : N, O = k.borderBottom ? k.borderBottom : N, w = k.borderTop ? p : 2 * p, L = v !== O ? 1 : r - s[m] + 1;
        t.setEdge(_, v, { weight: w, minlen: L, nestingEdge: !0 }), t.setEdge(O, T, { weight: w, minlen: L, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(a, _, { weight: 0, minlen: r + s[m] });
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
      let g, _, T;
      for (T = 0, ++a; a < p; ++T, ++a)
        s.points = [], _ = { width: 0, height: 0, edgeLabel: s, edgeObj: n, rank: a }, g = f.addDummyNode(i, "edge", _, "_d"), a === m && (_.width = s.width, _.height = s.height, _.dummy = "edge-label", _.labelpos = s.labelpos), i.setEdge(t, g, { weight: s.weight }, r), T === 0 && i.graph().dummyChains.push(g), t = g;
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
          let _ = g.v === r ? g.w : g.v, T = p.edge(_, r), y = T !== void 0 ? T.weight : 0;
          p.setEdge(_, r, { weight: i.edge(g).weight + y });
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
      let t = f(n, n.map((m, g) => g)), a = i.flatMap((m) => d.outEdges(m).map((g) => ({ pos: t[g.w], weight: d.edge(g).weight })).sort((g, _) => g.pos - _.pos)), o = 1;
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
  }, { "../util": 27 }], 15: [function(e, l, c) {
    let f = e("./init-order"), u = e("./cross-count"), h = e("./sort-subgraph"), d = e("./build-layer-graph"), i = e("./add-subgraph-constraints"), n = e("@dagrejs/graphlib").Graph, t = e("../util");
    l.exports = a;
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
        let w = u(s, y);
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
        return d(s, y, g, _.get(y) || []);
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
      let r = t.children(a), s = t.node(a), m = s ? s.borderLeft : void 0, g = s ? s.borderRight : void 0, _ = {};
      m && (r = r.filter((k) => k !== m && k !== g));
      let T = f(t, r);
      T.forEach((k) => {
        if (t.children(k.v).length) {
          let v = d(t, k.v, o, p);
          _[k.v] = v, Object.hasOwn(v, "barycenter") && n(k, v);
        }
      });
      let y = u(T, o);
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
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, l, c) {
    let f = e("../util");
    l.exports = u;
    function u(i, n) {
      let t = f.partition(i, (_) => Object.hasOwn(_, "barycenter")), a = t.lhs, o = t.rhs.sort((_, T) => T.i - _.i), p = [], r = 0, s = 0, m = 0;
      a.sort(d(!!n)), m = h(p, o, m), a.forEach((_) => {
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
    function h(y, N) {
      let k = {};
      function v(O, w) {
        let L = 0, R = 0, b = O.length, E = w[w.length - 1];
        return w.forEach((j, C) => {
          let M = i(y, j), V = M ? y.node(M).order : b;
          (M || j === E) && (w.slice(R, C + 1).forEach(($) => {
            y.predecessors($).forEach((F) => {
              let H = y.node(F), K = H.order;
              (K < L || V < K) && !(H.dummy && y.node($).dummy) && n(k, F, $);
            });
          }), R = C + 1, L = V);
        }), w;
      }
      return N.length && N.reduce(v), k;
    }
    function d(y, N) {
      let k = {};
      function v(w, L, R, b, E) {
        let j;
        u.range(L, R).forEach((C) => {
          j = w[C], y.node(j).dummy && y.predecessors(j).forEach((M) => {
            let V = y.node(M);
            V.dummy && (V.order < b || V.order > E) && n(k, M, j);
          });
        });
      }
      function O(w, L) {
        let R = -1, b, E = 0;
        return L.forEach((j, C) => {
          if (y.node(j).dummy === "border") {
            let M = y.predecessors(j);
            M.length && (b = y.node(M[0]).order, v(L, E, C, R, b), E = C, R = b);
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
      return N.forEach((R) => {
        R.forEach((b, E) => {
          O[b] = b, w[b] = b, L[b] = E;
        });
      }), N.forEach((R) => {
        let b = -1;
        R.forEach((E) => {
          let j = v(E);
          if (j.length) {
            j = j.sort((M, V) => L[M] - L[V]);
            let C = (j.length - 1) / 2;
            for (let M = Math.floor(C), V = Math.ceil(C); M <= V; ++M) {
              let $ = j[M];
              w[E] === E && b < L[$] && !t(k, E, $) && (w[$] = E, w[E] = O[E] = O[$], b = L[$]);
            }
          }
        });
      }), { root: O, align: w };
    }
    function o(y, N, k, v, O) {
      let w = {}, L = p(y, N, k, O), R = O ? "borderLeft" : "borderRight";
      function b(C, M) {
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
      return b(E, L.predecessors.bind(L)), b(j, L.successors.bind(L)), Object.keys(v).forEach((C) => w[C] = w[k[C]]), w;
    }
    function p(y, N, k, v) {
      let O = new f(), w = y.graph(), L = _(w.nodesep, w.edgesep, v);
      return N.forEach((R) => {
        let b;
        R.forEach((E) => {
          let j = k[E];
          if (O.setNode(j), b) {
            var C = k[b], M = O.edge(C, j);
            O.setEdge(C, j, Math.max(L(y, E, b), M || 0));
          }
          b = E;
        });
      }), O;
    }
    function r(y, N) {
      return Object.values(N).reduce((k, v) => {
        let O = Number.NEGATIVE_INFINITY, w = Number.POSITIVE_INFINITY;
        Object.entries(v).forEach(([R, b]) => {
          let E = T(y, R) / 2;
          O = Math.max(b + E, O), w = Math.min(b - E, w);
        });
        const L = O - w;
        return L < k[0] && (k = [L, v]), k;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(y, N) {
      let k = Object.values(N), v = u.applyWithChunking(Math.min, k), O = u.applyWithChunking(Math.max, k);
      ["u", "d"].forEach((w) => {
        ["l", "r"].forEach((L) => {
          let R = w + L, b = y[R];
          if (b === N) return;
          let E = Object.values(b), j = v - u.applyWithChunking(Math.min, E);
          L !== "l" && (j = O - u.applyWithChunking(Math.max, E)), j && (y[R] = u.mapValues(b, (C) => C + j));
        });
      });
    }
    function m(y, N) {
      return u.mapValues(y.ul, (k, v) => {
        if (N)
          return y[N.toLowerCase()][v];
        {
          let O = Object.values(y).map((w) => w[v]).sort((w, L) => w - L);
          return (O[1] + O[2]) / 2;
        }
      });
    }
    function g(y) {
      let N = u.buildLayerMatrix(y), k = Object.assign(h(y, N), d(y, N)), v = {}, O;
      ["u", "d"].forEach((L) => {
        O = L === "u" ? N : Object.values(N).reverse(), ["l", "r"].forEach((R) => {
          R === "r" && (O = O.map((C) => Object.values(C).reverse()));
          let b = (L === "u" ? y.predecessors : y.successors).bind(y), E = a(y, O, k, b), j = o(y, O, E.root, E.align, R === "r");
          R === "r" && (j = u.mapValues(j, (C) => -C)), v[L + R] = j;
        });
      });
      let w = r(y, v);
      return s(v, w), m(v, y.graph().align);
    }
    function _(y, N, k) {
      return (v, O, w) => {
        let L = v.node(O), R = v.node(w), b = 0, E;
        if (b += L.width / 2, Object.hasOwn(L, "labelpos"))
          switch (L.labelpos.toLowerCase()) {
            case "l":
              E = -L.width / 2;
              break;
            case "r":
              E = L.width / 2;
              break;
          }
        if (E && (b += k ? E : -E), E = 0, b += (L.dummy ? N : y) / 2, b += (R.dummy ? N : y) / 2, b += R.width / 2, Object.hasOwn(R, "labelpos"))
          switch (R.labelpos.toLowerCase()) {
            case "l":
              E = R.width / 2;
              break;
            case "r":
              E = -R.width / 2;
              break;
          }
        return E && (b += k ? E : -E), E = 0, b;
      };
    }
    function T(y, N) {
      return y.node(N).width;
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
    l.exports = t, t.initLowLimValues = r, t.initCutValues = a, t.calcCutValue = p, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = _;
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
      var w = k.node(O), L = w.parent, R = !0, b = v.edge(O, L), E = 0;
      return b || (R = !1, b = v.edge(L, O)), E = b.weight, v.nodeEdges(O).forEach((j) => {
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
      var R = O, b = k.node(w);
      return v[w] = !0, k.neighbors(w).forEach((E) => {
        Object.hasOwn(v, E) || (O = s(k, v, O, E, w));
      }), b.low = R, b.lim = O++, L ? b.parent = L : delete b.parent, O;
    }
    function m(k) {
      return k.edges().find((v) => k.edge(v).cutvalue < 0);
    }
    function g(k, v, O) {
      var w = O.v, L = O.w;
      v.hasEdge(w, L) || (w = O.w, L = O.v);
      var R = k.node(w), b = k.node(L), E = R, j = !1;
      R.lim > b.lim && (E = b, j = !0);
      var C = v.edges().filter((M) => j === N(k, k.node(M.v), E) && j !== N(k, k.node(M.w), E));
      return C.reduce((M, V) => u(v, V) < u(v, M) ? V : M);
    }
    function _(k, v, O, w) {
      var L = O.v, R = O.w;
      k.removeEdge(L, R), k.setEdge(w.v, w.w, {}), r(k), a(k, v), T(k, v);
    }
    function T(k, v) {
      var O = k.nodes().find((L) => !v.node(L).parent), w = d(k, O);
      w = w.slice(1), w.forEach((L) => {
        var R = k.node(L).parent, b = v.edge(L, R), E = !1;
        b || (b = v.edge(R, L), E = !0), v.node(L).rank = v.node(R).rank + (E ? b.minlen : -b.minlen);
      });
    }
    function y(k, v, O) {
      return k.hasEdge(v, O);
    }
    function N(k, v, O) {
      return O.low <= v.lim && v.lim <= O.lim;
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
    l.exports = { addBorderNode: r, addDummyNode: u, applyWithChunking: g, asNonCompoundGraph: d, buildLayerMatrix: a, intersectRect: t, mapValues: L, maxRank: _, normalizeRanks: o, notime: N, partition: T, pick: w, predecessorWeights: n, range: O, removeEmptyRanks: p, simplify: h, successorWeights: i, time: y, uniqueId: v, zipObject: R };
    function u(b, E, j, C) {
      for (var M = C; b.hasNode(M); )
        M = v(C);
      return j.dummy = E, b.setNode(M, j), M;
    }
    function h(b) {
      let E = new f().setGraph(b.graph());
      return b.nodes().forEach((j) => E.setNode(j, b.node(j))), b.edges().forEach((j) => {
        let C = E.edge(j.v, j.w) || { weight: 0, minlen: 1 }, M = b.edge(j);
        E.setEdge(j.v, j.w, { weight: C.weight + M.weight, minlen: Math.max(C.minlen, M.minlen) });
      }), E;
    }
    function d(b) {
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
        return b.outEdges(j).forEach((M) => {
          C[M.w] = (C[M.w] || 0) + b.edge(M).weight;
        }), C;
      });
      return R(b.nodes(), E);
    }
    function n(b) {
      let E = b.nodes().map((j) => {
        let C = {};
        return b.inEdges(j).forEach((M) => {
          C[M.v] = (C[M.v] || 0) + b.edge(M).weight;
        }), C;
      });
      return R(b.nodes(), E);
    }
    function t(b, E) {
      let j = b.x, C = b.y, M = E.x - j, V = E.y - C, $ = b.width / 2, F = b.height / 2;
      if (!M && !V)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, K;
      return Math.abs(V) * $ > Math.abs(M) * F ? (V < 0 && (F = -F), H = F * M / V, K = F) : (M < 0 && ($ = -$), H = $, K = $ * V / M), { x: j + H, y: C + K };
    }
    function a(b) {
      let E = O(_(b) + 1).map(() => []);
      return b.nodes().forEach((j) => {
        let C = b.node(j), M = C.rank;
        M !== void 0 && (E[M][C.order] = j);
      }), E;
    }
    function o(b) {
      let E = b.nodes().map((C) => {
        let M = b.node(C).rank;
        return M === void 0 ? Number.MAX_VALUE : M;
      }), j = g(Math.min, E);
      b.nodes().forEach((C) => {
        let M = b.node(C);
        Object.hasOwn(M, "rank") && (M.rank -= j);
      });
    }
    function p(b) {
      let E = b.nodes().map(($) => b.node($).rank), j = g(Math.min, E), C = [];
      b.nodes().forEach(($) => {
        let F = b.node($).rank - j;
        C[F] || (C[F] = []), C[F].push($);
      });
      let M = 0, V = b.graph().nodeRankFactor;
      Array.from(C).forEach(($, F) => {
        $ === void 0 && F % V !== 0 ? --M : $ !== void 0 && M && $.forEach((H) => b.node(H).rank += M);
      });
    }
    function r(b, E, j, C) {
      let M = { width: 0, height: 0 };
      return arguments.length >= 4 && (M.rank = j, M.order = C), u(b, "border", M, E);
    }
    function s(b, E = m) {
      const j = [];
      for (let C = 0; C < b.length; C += E) {
        const M = b.slice(C, C + E);
        j.push(M);
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
        let M = b.node(C).rank;
        return M === void 0 ? Number.MIN_VALUE : M;
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
      const M = [];
      for (let V = b; C(V); V += j)
        M.push(V);
      return M;
    }
    function w(b, E) {
      const j = {};
      for (const C of E)
        b[C] !== void 0 && (j[C] = b[C]);
      return j;
    }
    function L(b, E) {
      let j = E;
      return typeof E == "string" && (j = (C) => C[E]), Object.entries(b).reduce((C, [M, V]) => (C[M] = j(V, M), C), {});
    }
    function R(b, E) {
      return b.reduce((j, C, M) => (j[C] = E[M], j), {});
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
            var g = s[o], _ = p[m], T = s[m], y = g.distance + _.distance;
            y < T.distance && (T.distance = y, T.predecessor = _.predecessor);
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
          var _ = i(s);
          _ < g && (t[m] = o, a.decrease(m, _));
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
})(), Xt = ["unstarted", "started", "completed", "canceled"];
function Qt(e, l) {
  let c = 1;
  const f = () => `${e.slice(0, 40 - String(c).length - 1)}_${c}`;
  for (; l.some((u) => u.id === f()); ) c++;
  return f();
}
function Zt(e, l) {
  return [
    ...e.initial === l.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((c) => c.to === l.id || c.from !== "any" && c.from.includes(l.id)).map((c) => `transition ${Ct(c)}`),
    ...e.states.filter((c) => c.regions?.some((f) => f.initial === l.id)).map((c) => `lanes in ${Pe(c)}`),
    ...Object.entries(e.map ?? {}).filter(([, c]) => c === l.id).map(() => "existing item migration")
  ];
}
function en(e, l) {
  return e.states.flatMap((c) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((f) => c.run?.[f] === l.id).map((f) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[f]} handler in ${Pe(c)}`),
    ...(c.timers ?? []).filter((f) => f.then?.transition === l.id).map(() => "a timer")
  ]);
}
const Pe = (e) => e?.name || "Untitled state", Ct = (e) => e.name?.trim() || me(e.id), tn = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", nn = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function rn(e, l) {
  if (e.id === l.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const c = e.release_when?.approvals?.min;
    return c ? `Needs ${c} approval${c === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? De(e) : "A person moves it";
}
function De(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function sn(e, l) {
  const c = e.release_when?.approvals?.min ?? 1, f = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${c === 1 ? "one person approves" : `${c} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${De(e)}.` : "A person chooses when to move the item on.", u = l.policy?.wip?.[e.id]?.limit;
  return f + (u !== void 0 ? ` At most ${u} at a time.` : "");
}
function on(e) {
  const l = e.transitions ?? [], c = [], f = /* @__PURE__ */ new Set();
  let u = e.states.find((d) => d.id === e.initial);
  const h = new Map(e.states.map((d, i) => [d.id, i]));
  for (; u && !f.has(u.id) && (c.push(u), f.add(u.id), !(u.category === "completed" || u.category === "canceled")); ) {
    const d = u, i = l.filter((t) => t.from !== "any" && t.from.includes(d.id)), n = i.find((t) => t.default) ?? i.find((t) => !f.has(t.to) && (h.get(t.to) ?? -1) > (h.get(d.id) ?? 0));
    u = e.states.find((t) => t.id === n?.to);
  }
  return c;
}
function Fe(e) {
  const l = e.states.find((c) => c.id === e.initial);
  return e.migration ?? (l?.kind === "automated" || l?.kind === "parallel" ? "pin" : "follow");
}
const te = (e) => JSON.parse(JSON.stringify(e));
function an(e) {
  return e?.admin === !0;
}
function ln(e, l, c) {
  const f = l + c;
  if (l < 0 || l >= e.length || f < 0 || f >= e.length) return;
  const [u] = e.splice(l, 1);
  e.splice(f, 0, u);
}
function dn(e, l, c) {
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
function Ie({ migration: e, map: l, ...c }) {
  return JSON.stringify(c);
}
function un(e, l) {
  const c = te(e);
  for (const u of c.processes ?? []) {
    const h = l.processes?.find((d) => d.id === u.id);
    if (h && Ie(u) !== Ie(h) && (u.migration = "follow"), u.map) {
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
function cn(e, l, c) {
  const f = JSON.stringify({ declaration: e, configs: c });
  return {
    declaration: te(e),
    expected_generation: l,
    plugin_configs: te(c),
    matches: (u, h, d) => l === h && f === JSON.stringify({ declaration: u, configs: d })
  };
}
function fn(e) {
  const l = te(e), c = [...new Set(l.declaration.item_types?.flatMap((u) => u.fields) ?? [])], f = (u) => {
    const h = c.indexOf(u);
    return h < 0 ? c.length : h;
  };
  l.declaration.fields?.sort((u, h) => f(u.code) - f(h.code));
  for (const u of l.declaration.fields ?? []) {
    const h = l.compiled.fields?.find((d) => d.code === u.code);
    u.id ??= h?.id, u.form ??= h?.form;
  }
  for (const u of l.declaration.processes ?? []) u.migration ??= l.compiled.processes?.find((h) => h.id === u.id)?.migration ?? Fe(u);
  return l;
}
function hn(e, l) {
  return (l.processes ?? []).filter((c) => Fe(c) !== "pin" && e.changes.some((f) => f.code === "process " + c.id && f.class !== "cosmetic" && f.class !== "refused")).map((c) => c.id);
}
function pn(e, l, c) {
  const f = [c, `item_type ${c}`, `relation ${c}`, `process ${c}`], u = e.refused.filter((h) => f.includes(h.code));
  return l === "fields" && u.push(...e.changes.filter((h) => h.code === c && h.what === "removed" && h.class === "semantic")), u.length ? u.map(Lt).join(" ") : void 0;
}
function mn(e, l, c) {
  if (l === "fields") {
    e.fields = e.fields?.filter((f) => f.code !== c);
    for (const f of e.item_types ?? [])
      f.fields = f.fields.filter((u) => u !== c), f.inherit = f.inherit?.filter((u) => u !== c);
  } else l === "item_types" ? e.item_types = e.item_types?.filter((f) => f.id !== c) : l === "processes" ? e.processes = e.processes?.filter((f) => f.id !== c) : e.relation_types = e.relation_types?.filter((f) => f.id !== c);
}
function Lt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function gn(e, l) {
  if (!(e instanceof ee)) return [];
  const c = e.details ?? {};
  let f = typeof c.field == "string" ? c.field : "";
  if (!f) {
    const u = l.processes?.find((h) => h.id === c.process || h.states.some((d) => d.id === c.state) || e.message.includes(`process ${h.id}`));
    u ? f = `process ${u.id}` : typeof c.item_type == "string" && (f = `item_type ${c.item_type}`);
  }
  return f ? [{ code: f, class: "refused", what: "invalid", detail: Ae(e, "The definition is invalid.") }] : [];
}
const bn = {
  unchanged: "Nothing changes.",
  cosmetic: "These changes update labels or settings. Saved item values keep their meaning.",
  additive: "New choices or definitions become available to items.",
  semantic: "These changes can affect existing items or how they are found.",
  refused: "Resolve the blocked changes before applying this draft.",
  initial: "These settings will be used when the board is ready."
}, yn = (e) => !("problem" in e);
function wn(e, l) {
  return { pack: e.id, version: e.version, expected_generation: l };
}
async function vn(e, l) {
  const c = { ...te(e), resolutions: te(e.resolutions ?? {}) };
  let f = await l(c);
  return c.maps || (c.maps = te(f.maps), f = await l(c)), { request: c, plan: f };
}
function kn() {
  let e = 0;
  return () => {
    const l = ++e;
    return () => l === e;
  };
}
export {
  mn as A,
  dn as B,
  nn as C,
  ee as D,
  Se as E,
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
  Ae as f,
  Kt as g,
  rn as h,
  Re as i,
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
//# sourceMappingURL=latestRequest-C0O_GxCX.js.map
