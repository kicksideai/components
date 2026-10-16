import { u as hr, W as br } from "./index-C70m2Vvt.js";
import { defineComponent as pr, ref as k, onMounted as cr, watch as yr, onBeforeUnmount as xr, openBlock as p, createElementBlock as c, toDisplayString as d, computed as u, reactive as F, createCommentVNode as f, createVNode as b, unref as y, createTextVNode as N, Fragment as C, renderList as L, createBlock as ar, createElementVNode as n, normalizeClass as D } from "vue";
import { Icon as x } from "@iconify/vue";
import { loadByTagName as kr, api as J, define as wr } from "@wippy-fe/proxy";
const _r = { class: "ks-wcmount" }, Cr = {
  key: 0,
  class: "ks-wcmount-fail"
}, or = /* @__PURE__ */ pr({
  __name: "WcMount",
  props: {
    tag: {},
    config: {}
  },
  emits: ["change"],
  setup(O, { emit: G }) {
    const l = O, T = G, S = k(null), h = k(!1);
    let v = null;
    function j(m) {
      T("change", m.detail);
    }
    async function B(m) {
      if (!customElements.get(m))
        try {
          await kr(m, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function g() {
      if (h.value = !1, !!S.value) {
        if (v && (v.removeEventListener("config-changed", j), v = null), S.value.innerHTML = "", !l.tag) {
          h.value = !0;
          return;
        }
        try {
          await B(l.tag), v = document.createElement(l.tag);
          try {
            v.setAttribute("config", JSON.stringify(l.config || {}));
          } catch {
          }
          v.addEventListener("config-changed", j), v.style.display = "block", S.value.appendChild(v), h.value = !customElements.get(l.tag);
        } catch {
          h.value = !0;
        }
      }
    }
    return cr(g), yr(() => l.tag, g), xr(() => {
      v && v.removeEventListener("config-changed", j);
    }), (m, $) => (p(), c("div", _r, [
      h.value ? (p(), c("div", Cr, "Provider card “" + d(O.tag) + "” is not available.", 1)) : (p(), c("div", {
        key: 1,
        ref_key: "host",
        ref: S
      }, null, 512))
    ]));
  }
}), Sr = { class: "ap" }, Er = {
  key: 0,
  class: "ap-providers"
}, zr = {
  key: 0,
  class: "ap-msg ap-err"
}, Ar = {
  key: 1,
  class: "ap-loading"
}, Lr = {
  key: 1,
  class: "ap-body"
}, jr = {
  key: 0,
  class: "ap-bar"
}, Br = {
  key: 0,
  class: "ap-saved"
}, Pr = ["disabled"], Nr = ["disabled"], Or = {
  key: 1,
  class: "ap-msg ap-err"
}, Rr = {
  key: 2,
  class: "ap-loading"
}, Dr = {
  key: 3,
  class: "ap-cards"
}, Gr = { class: "ap-card" }, Tr = { class: "ap-h" }, $r = {
  key: 0,
  class: "ap-toggle-row"
}, Ir = { class: "ap-toggle-text" }, Kr = {
  key: 0,
  class: "ap-toggle-desc"
}, Mr = ["aria-checked"], Ur = { class: "pv-group-title" }, Vr = {
  key: 0,
  class: "ap-toggle-row"
}, Fr = { class: "ap-toggle-text" }, Jr = { class: "ap-toggle-name" }, Wr = ["aria-checked", "onClick"], Hr = { class: "ap-blabel" }, Yr = ["value", "onChange"], qr = ["value"], Qr = {
  key: 1,
  class: "ks-map"
}, Xr = ["value", "onInput"], Zr = ["value", "onChange"], ra = ["value"], aa = ["onClick"], oa = ["onClick"], ea = ["placeholder", "value", "onInput"], pa = {
  key: 3,
  class: "ap-hint ap-hint-err"
}, ca = "kickside.sso", er = "kickside-sso-provider", ta = "enabled", ia = /* @__PURE__ */ pr({
  __name: "admin",
  setup(O) {
    const G = [
      "enabled",
      "auto_provision",
      "allowed_email_domains",
      "default_group",
      "group_claim_name",
      "group_mapping",
      "post_login_redirect_allowlist"
    ];
    function l(r, a) {
      return `${r}|${a}`;
    }
    const T = hr(), S = u(() => T.value?.config || {}), h = u(() => {
      const r = S.value.provider;
      return typeof r == "string" && r.length ? r : "";
    }), v = u(() => !h.value && S.value.scope === "global"), j = u(() => !!h.value), B = k(!0), g = k(""), m = k(ca), $ = k([]), R = k([]), I = k([]), t = F({}), P = F({}), K = F({}), E = k(""), tr = u(() => {
      const r = {};
      for (const a of R.value) r[l(a.namespace, a.key)] = a;
      return r;
    });
    function s(r) {
      return tr.value[r];
    }
    const M = u(() => G.map((r) => l(m.value, r)).filter((r) => !!s(r))), W = u(() => $.value.filter((r) => r.id === h.value)), ir = [
      { title: "Provisioning", icon: "tabler:user-plus", keys: ["auto_provision", "allowed_email_domains", "default_group"] },
      { title: "Group sync", icon: "tabler:users-group", keys: ["group_claim_name", "group_mapping"] },
      { title: "Redirects", icon: "tabler:route", keys: ["post_login_redirect_allowlist"] }
    ], z = u(() => l(m.value, ta)), nr = u(() => ir.map((r) => ({ ...r, ids: r.keys.map((a) => l(m.value, a)).filter((a) => !!s(a)) })).filter((r) => r.ids.length)), H = u(() => M.value.some((r) => {
      const a = s(r);
      return a && Q(a);
    })), sr = u(() => M.value.some((r) => K[r]));
    function w(r) {
      if (r.value_type === "bool") return "bool";
      if (r.value_type === "secret") return "secret";
      const a = r.schema?.kind;
      return a === "string_list" ? "list" : a === "group_ref" ? "group" : a === "mapping" ? "mapping" : "text";
    }
    function Y(r) {
      return Array.isArray(r) ? r.map((a) => String(a)).filter(Boolean) : typeof r == "string" ? r.split(/[\s,]+/).map((a) => a.trim()).filter(Boolean) : [];
    }
    function lr(r) {
      return r && typeof r == "object" && !Array.isArray(r) ? Object.entries(r).map(([a, e]) => ({ k: a, v: String(e ?? "") })) : [];
    }
    function U(r) {
      const a = l(r.namespace, r.key);
      switch (w(r)) {
        case "bool":
          t[a] = !!r.value;
          break;
        case "secret":
          t[a] = "";
          break;
        case "list":
          t[a] = Y(r.value).join(" ");
          break;
        case "mapping":
          t[a] = lr(r.value);
          break;
        default:
          t[a] = String(r.value ?? "");
      }
    }
    function q(r) {
      const a = l(r.namespace, r.key);
      switch (w(r)) {
        case "bool":
          return !!t[a];
        case "secret":
          return String(t[a] ?? "").length ? t[a] : void 0;
        case "list": {
          const e = String(t[a] ?? "").split(/[\s,]+/).map((o) => o.trim()).filter(Boolean);
          return r.value_type === "json" ? e : e.join(" ");
        }
        case "mapping": {
          const e = {};
          for (const o of t[a]) {
            const i = o.k.trim();
            i && (e[i] = o.v);
          }
          return e;
        }
        default:
          return String(t[a] ?? "");
      }
    }
    function vr(r) {
      switch (w(r)) {
        case "bool":
          return !!r.value;
        case "list": {
          const a = Y(r.value);
          return r.value_type === "json" ? a : a.join(" ");
        }
        case "mapping":
          return r.value && typeof r.value == "object" ? r.value : {};
        default:
          return String(r.value ?? "");
      }
    }
    function Q(r) {
      const a = q(r);
      return a === void 0 ? !1 : w(r) === "secret" ? !0 : JSON.stringify(a) !== JSON.stringify(vr(r));
    }
    function ur(r) {
      t[r].push({ k: "", v: "" });
    }
    function dr(r, a) {
      t[r].splice(a, 1);
    }
    function X(r) {
      const a = r.fields.map((e) => {
        const o = s(l(r.namespace, e));
        return {
          key: e,
          value_type: o?.value_type ?? "string",
          value: o?.value,
          has_value: o?.has_value,
          description: o?.description,
          schema: o?.schema ?? null
        };
      });
      return { namespace: r.namespace, label: r.label, icon: r.icon, engine: r.engine, ui: r.ui ?? null, fields: a };
    }
    async function V() {
      const { data: r } = await J.get("/api/v1/sso/providers");
      if (!r?.success) throw new Error(r?.error || "failed to load providers");
      typeof r.global_namespace == "string" && (m.value = r.global_namespace);
      const a = r.settings || {};
      return R.value = Object.values(a).map((e) => ({
        namespace: e.namespace,
        key: e.key,
        value_type: e.value_type,
        schema: e.schema ?? null,
        description: e.description,
        has_value: e.has_value,
        value: e.value
      })), r.providers;
    }
    async function Z() {
      B.value = !0, g.value = "";
      try {
        const [r, a] = await Promise.all([
          V(),
          J.get("/api/v1/users/assignable-scopes").catch(() => ({ data: { success: !1 } }))
        ]);
        $.value = r;
        const e = a.data?.success ? a.data.scopes : [];
        I.value = e.map((o) => ({ id: o.id, label: o.label || o.id }));
        for (const o of R.value) U(o);
      } catch (r) {
        g.value = r instanceof Error ? r.message : String(r);
      } finally {
        B.value = !1;
      }
    }
    function gr(r) {
      return r?.response?.data?.error || r?.message || "save failed";
    }
    async function mr(r, a) {
      E.value = a, g.value = "";
      const e = [];
      try {
        for (const o of r) {
          const i = s(o);
          if (!(!i || !Q(i))) {
            delete P[o];
            try {
              const { data: A } = await J.put("/api/v1/settings", { namespace: i.namespace, key: i.key, value: q(i) });
              A?.success ? (e.push(o), K[o] = !0) : P[o] = A?.error || "save failed";
            } catch (A) {
              P[o] = gr(A);
            }
          }
        }
        if (e.length) {
          await V();
          for (const o of e) {
            const i = s(o);
            i && U(i);
          }
          setTimeout(() => {
            for (const o of e) delete K[o];
          }, 2500);
        }
      } finally {
        E.value = "";
      }
    }
    async function fr() {
      await mr(M.value, "global");
    }
    async function rr() {
      try {
        await V();
        for (const r of R.value) U(r);
      } catch {
      }
    }
    return cr(Z), (r, a) => (p(), c("div", Sr, [
      j.value && !v.value ? (p(), c("div", Er, [
        g.value ? (p(), c("div", zr, d(g.value), 1)) : f("", !0),
        B.value ? (p(), c("div", Ar, [
          b(y(x), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          a[1] || (a[1] = N(" Loading…", -1))
        ])) : f("", !0),
        (p(!0), c(C, null, L(W.value, (e) => (p(), ar(or, {
          key: e.id,
          tag: e.ui_component || er,
          config: X(e),
          onChange: rr
        }, null, 8, ["tag", "config"]))), 128))
      ])) : (p(), c("div", Lr, [
        v.value ? (p(), c("header", jr, [
          sr.value ? (p(), c("span", Br, [
            b(y(x), {
              icon: "tabler:check",
              "aria-hidden": "true"
            }),
            a[2] || (a[2] = N(" Saved", -1))
          ])) : f("", !0),
          n("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !H.value || E.value === "global",
            onClick: Z
          }, "Discard", 8, Pr),
          n("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !H.value || E.value === "global",
            onClick: fr
          }, [
            b(y(x), {
              icon: E.value === "global" ? "tabler:loader-2" : "tabler:device-floppy",
              class: D(E.value === "global" && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            N(" " + d(E.value === "global" ? "Saving…" : "Save"), 1)
          ], 8, Nr)
        ])) : f("", !0),
        g.value ? (p(), c("div", Or, d(g.value), 1)) : f("", !0),
        B.value ? (p(), c("div", Rr, [
          b(y(x), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          a[3] || (a[3] = N(" Loading…", -1))
        ])) : v.value ? (p(), c("div", Dr, [
          n("section", Gr, [
            n("header", Tr, [
              b(y(x), {
                icon: "tabler:shield-lock",
                "aria-hidden": "true"
              }),
              a[4] || (a[4] = N(" Single sign-on", -1))
            ]),
            s(z.value) ? (p(), c("div", $r, [
              n("div", Ir, [
                a[5] || (a[5] = n("span", { class: "ap-toggle-name" }, "Enabled", -1)),
                s(z.value).description ? (p(), c("span", Kr, d(s(z.value).description), 1)) : f("", !0)
              ]),
              n("button", {
                type: "button",
                class: D(["ks-switch", { on: t[z.value] }]),
                role: "switch",
                "aria-checked": !!t[z.value],
                onClick: a[0] || (a[0] = (e) => t[z.value] = !t[z.value])
              }, [...a[6] || (a[6] = [
                n("span", { class: "ks-switch-knob" }, null, -1)
              ])], 10, Mr)
            ])) : f("", !0),
            (p(!0), c(C, null, L(nr.value, (e) => (p(), c("div", {
              key: e.title,
              class: "pv-group"
            }, [
              n("h3", Ur, [
                b(y(x), {
                  icon: e.icon,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                N(" " + d(e.title), 1)
              ]),
              (p(!0), c(C, null, L(e.ids, (o) => (p(), c("div", {
                key: o,
                class: "pv-field"
              }, [
                w(s(o)) === "bool" ? (p(), c("div", Vr, [
                  n("div", Fr, [
                    n("span", Jr, d(s(o).description || s(o).key), 1)
                  ]),
                  n("button", {
                    type: "button",
                    class: D(["ks-switch", { on: t[o] }]),
                    role: "switch",
                    "aria-checked": !!t[o],
                    onClick: (i) => t[o] = !t[o]
                  }, [...a[7] || (a[7] = [
                    n("span", { class: "ks-switch-knob" }, null, -1)
                  ])], 10, Wr)
                ])) : (p(), c(C, { key: 1 }, [
                  n("label", Hr, d(s(o).description || s(o).key), 1),
                  w(s(o)) === "group" ? (p(), c("select", {
                    key: 0,
                    class: "ap-binput",
                    value: t[o],
                    onChange: (i) => t[o] = i.target.value
                  }, [
                    a[8] || (a[8] = n("option", { value: "" }, "— none —", -1)),
                    (p(!0), c(C, null, L(I.value, (i) => (p(), c("option", {
                      key: i.id,
                      value: i.id
                    }, d(i.label), 9, qr))), 128))
                  ], 40, Yr)) : w(s(o)) === "mapping" ? (p(), c("div", Qr, [
                    (p(!0), c(C, null, L(t[o], (i, A) => (p(), c("div", {
                      key: A,
                      class: "ks-map-row"
                    }, [
                      n("input", {
                        class: "ap-binput",
                        placeholder: "IdP group",
                        value: i.k,
                        onInput: (_) => i.k = _.target.value
                      }, null, 40, Xr),
                      b(y(x), {
                        icon: "tabler:arrow-right",
                        class: "ks-map-arrow",
                        "aria-hidden": "true"
                      }),
                      n("select", {
                        class: "ap-binput",
                        value: i.v,
                        onChange: (_) => i.v = _.target.value
                      }, [
                        a[9] || (a[9] = n("option", { value: "" }, "— select group —", -1)),
                        (p(!0), c(C, null, L(I.value, (_) => (p(), c("option", {
                          key: _.id,
                          value: _.id
                        }, d(_.label), 9, ra))), 128))
                      ], 40, Zr),
                      n("button", {
                        type: "button",
                        class: "ap-icon-btn",
                        title: "Remove",
                        "aria-label": "Remove mapping",
                        onClick: (_) => dr(o, A)
                      }, [
                        b(y(x), {
                          icon: "tabler:trash",
                          "aria-hidden": "true"
                        })
                      ], 8, aa)
                    ]))), 128)),
                    n("button", {
                      type: "button",
                      class: "ap-icon-btn ks-map-add",
                      title: "Add mapping",
                      "aria-label": "Add mapping",
                      onClick: (i) => ur(o)
                    }, [
                      b(y(x), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ], 8, oa)
                  ])) : (p(), c("input", {
                    key: 2,
                    type: "text",
                    class: D(["ap-binput", { "ap-binput-invalid": P[o] }]),
                    placeholder: w(s(o)) === "list" ? "space or comma separated" : "",
                    value: t[o],
                    onInput: (i) => t[o] = i.target.value
                  }, null, 42, ea)),
                  P[o] ? (p(), c("p", pa, d(P[o]), 1)) : f("", !0)
                ], 64))
              ]))), 128))
            ]))), 128))
          ]),
          j.value ? (p(!0), c(C, { key: 0 }, L(W.value, (e) => (p(), ar(or, {
            key: e.id,
            tag: e.ui_component || er,
            config: X(e),
            onChange: rr
          }, null, 8, ["tag", "config"]))), 128)) : f("", !0)
        ])) : f("", !0)
      ]))
    ]));
  }
}), na = ":root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.ap{--system-surface-gutter: var(--kickside-system-surface-gutter, 24px);font-family:inherit;display:flex;flex-direction:column;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background)}.ap-body{flex:1;overflow-y:auto;padding:0 0 28px}.ap-providers{flex:1;min-height:0;display:flex;flex-direction:column}.ap-providers .ks-wcmount{display:block;flex:1;min-height:0}.ap-providers .ks-wcmount>div{height:100%;min-height:0}.ks-wcmount-fail{font-size:12px;color:var(--p-text-muted-color);margin:16px var(--system-surface-gutter);padding:14px;border:1px dashed var(--p-content-border-color);border-radius:14px}.ap-bar{display:flex;align-items:center;justify-content:flex-end;gap:10px;width:100%;padding:12px var(--system-surface-gutter);background:var(--p-content-background);position:sticky;top:0;z-index:3;border-bottom:1px solid var(--p-content-border-color)}.ap-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border-radius:8px;border:1px solid transparent;font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:filter .15s,background .15s,opacity .15s}.ap-btn:disabled{opacity:.45;cursor:default}.ap-btn-primary{background:var(--p-primary-color);color:var(--p-button-primary-color)}.ap-btn-primary:hover:not(:disabled){filter:brightness(1.05)}.ap-btn-ghost{background:transparent;border-color:var(--p-content-border-color);color:var(--p-text-color)}.ap-btn-ghost:hover:not(:disabled){background:color-mix(in srgb,var(--p-text-color) 8%,transparent)}.ap-btn svg{width:16px;height:16px}.ap-saved{display:inline-flex;align-items:center;gap:4px;margin-right:auto;font-size:12px;font-weight:600;color:var(--p-primary-color)}.ap-saved svg{width:15px;height:15px}.ap-msg{margin:12px var(--system-surface-gutter) 0;padding:9px 12px;border-radius:8px;font-size:13px}.ap-err{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.ap-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.ap-cards{display:flex;flex-direction:column;gap:16px;padding:16px var(--system-surface-gutter) 0}.ap-card{background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:16px 18px}.ap-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:var(--p-text-color);letter-spacing:-.2px}.ap-h svg{width:17px;height:17px;color:var(--p-text-muted-color)}.ap-sub{font-size:12.5px;color:var(--p-text-muted-color);margin:4px 0 12px}.ap-blabel{display:block;font-size:11.5px;font-weight:700;color:var(--p-text-muted-color);text-transform:uppercase;letter-spacing:.04em;margin:12px 0 6px}.ap-binput{width:100%;height:34px;padding:0 12px;border-radius:8px;border:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-color);font:inherit;font-size:13px;box-sizing:border-box}select.ap-binput{cursor:pointer}.ap-binput:focus{outline:none;border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.ap-binput-invalid,.ap-binput-invalid:focus{border-color:var(--p-danger-500)}.ap-hint{font-size:11.5px;color:var(--p-text-muted-color);margin:8px 0 0}.ap-hint-err{color:var(--p-danger-600, var(--p-danger-500))}.ap-toggle-row{display:flex;align-items:center;gap:16px;margin-top:12px}.ap-toggle-text{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}.ap-toggle-name{font-size:13px;font-weight:600;color:var(--p-text-color)}.ap-toggle-desc{font-size:12px;color:var(--p-text-muted-color)}.ap-icon-btn{width:34px;height:34px;flex:0 0 auto;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--p-content-border-color);background:transparent;color:var(--p-text-muted-color);cursor:pointer;transition:background .15s,color .15s}.ap-icon-btn:hover{color:var(--p-text-color);background:color-mix(in srgb,var(--p-text-color) 8%,transparent)}.ap-icon-btn svg{width:16px;height:16px}.pv-group+.pv-group{margin-top:22px}.pv-group-title{display:flex;align-items:center;gap:6px;margin:22px 0 10px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--p-text-muted-color)}.pv-group-title svg{width:14px;height:14px}.pv-field{margin-bottom:16px}.pv-field:last-child{margin-bottom:0}.ks-switch{flex:0 0 auto;position:relative;width:40px;height:22px;padding:0;border:none;border-radius:999px;cursor:pointer;background:color-mix(in srgb,var(--p-text-color) 22%,transparent);transition:background .18s}.ks-switch.on{background:var(--p-primary-color)}.ks-switch:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.ks-switch-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--p-button-primary-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent);transition:transform .18s}.ks-switch.on .ks-switch-knob{transform:translate(18px)}.ks-map{display:flex;flex-direction:column;gap:8px;align-items:stretch}.ks-map-row{display:grid;grid-template-columns:1fr auto 1fr auto;gap:8px;align-items:center}.ks-map-arrow{color:var(--p-text-muted-color);width:15px;height:15px}.ks-map-add{align-self:flex-start}@keyframes ks-spin{to{transform:rotate(360deg)}}.spin{animation:ks-spin .8s linear infinite}", sa = { type: "object", properties: { config: { type: "object" } } };
class la extends br {
  static get wippyConfig() {
    return {
      propsSchema: sa,
      hostCssKeys: ["themeConfigUrl"],
      inlineCss: na
    };
  }
  static get vueConfig() {
    return { rootComponent: ia };
  }
}
wr(import.meta.url, la);
//# sourceMappingURL=admin.js.map
