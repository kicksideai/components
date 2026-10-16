import { u as U, a as q, W as G } from "./index-C70m2Vvt.js";
import { defineComponent as M, computed as l, reactive as O, ref as A, watch as Q, openBlock as c, createElementBlock as i, createElementVNode as p, createVNode as y, unref as x, createTextVNode as m, toDisplayString as t, createCommentVNode as d, normalizeClass as k, Fragment as _, renderList as X } from "vue";
import { Icon as w } from "@iconify/vue";
import { api as Y, define as Z } from "@wippy-fe/proxy";
const rr = {
  key: 0,
  class: "ap"
}, ar = { class: "ap-body" }, er = { class: "ap-bar" }, or = {
  key: 0,
  class: "ap-msg-inline ap-err"
}, pr = {
  key: 1,
  class: "ap-saved"
}, cr = ["disabled"], ir = ["disabled"], nr = { class: "ap-cards" }, sr = { class: "ap-card" }, tr = { class: "ap-h" }, lr = {
  key: 0,
  class: "ap-sub"
}, vr = ["href"], dr = { class: "ap-toggle-row" }, ur = ["aria-checked", "title"], gr = {
  key: 0,
  class: "ap-toggle-row"
}, mr = { class: "ap-toggle-text" }, fr = { class: "ap-toggle-name" }, hr = {
  key: 0,
  class: "ap-hint ap-hint-err"
}, br = ["aria-checked", "title", "onClick"], yr = { class: "ap-blabel" }, xr = ["placeholder", "value", "onInput"], kr = ["type", "placeholder", "value", "onInput"], wr = {
  key: 2,
  class: "ap-hint ap-hint-err"
}, _r = ["value"], Sr = {
  key: 0,
  class: "ap-hint"
}, Cr = /* @__PURE__ */ M({
  __name: "ProviderCard",
  setup(F) {
    const K = U(), P = q(), u = l(() => K.value.config || null), f = l(() => u.value?.ui || {}), S = l(() => u.value?.namespace || ""), h = l(() => u.value?.fields || []), R = l(() => {
      const r = {};
      for (const e of h.value) r[e.key] = e;
      return r;
    });
    function D(r) {
      return R.value[r];
    }
    function g(r) {
      return r.value_type === "bool" ? "bool" : r.value_type === "secret" ? "secret" : r.schema?.kind === "string_list" || r.value_type === "json" ? "list" : "text";
    }
    const o = O({}), n = O({}), v = A(!1), C = A(!1);
    function E(r) {
      return Array.isArray(r) ? r.map(String).filter(Boolean) : typeof r == "string" ? r.split(/[\s,]+/).map((e) => e.trim()).filter(Boolean) : [];
    }
    function z() {
      for (const r of h.value)
        switch (g(r)) {
          case "bool":
            o[r.key] = !!r.value;
            break;
          case "secret":
            o[r.key] = "";
            break;
          case "list":
            o[r.key] = E(r.value).join(" ");
            break;
          default:
            o[r.key] = String(r.value ?? "");
        }
    }
    Q(u, z, { immediate: !0 });
    function B(r) {
      switch (g(r)) {
        case "bool":
          return !!o[r.key];
        case "secret":
          return String(o[r.key] ?? "").length ? o[r.key] : void 0;
        case "list": {
          const e = String(o[r.key] ?? "").split(/[\s,]+/).map((a) => a.trim()).filter(Boolean);
          return r.value_type === "json" ? e : e.join(" ");
        }
        default:
          return String(o[r.key] ?? "");
      }
    }
    function H(r) {
      switch (g(r)) {
        case "bool":
          return !!r.value;
        case "list": {
          const e = E(r.value);
          return r.value_type === "json" ? e : e.join(" ");
        }
        default:
          return String(r.value ?? "");
      }
    }
    function N(r) {
      const e = B(r);
      return e === void 0 ? !1 : g(r) === "secret" ? !0 : JSON.stringify(e) !== JSON.stringify(H(r));
    }
    const b = l({
      get: () => !!o.enabled,
      set: (r) => {
        o.enabled = r;
      }
    }), I = { issuer: 0, client_id: 1, client_secret: 2, tenant: 3, allow_unverified_email: 4 }, J = l(() => h.value.filter((r) => r.key !== "enabled" && r.key !== "scopes").sort((r, e) => (I[r.key] ?? 9) - (I[e.key] ?? 9))), j = l(() => D("scopes"));
    function L() {
      const r = String(o.client_id ?? "").trim().length > 0, a = !!D("client_secret")?.has_value || String(o.client_secret ?? "").length > 0;
      return r && a;
    }
    const T = l(() => h.value.some(N));
    function V(r) {
      if (r && typeof r == "object" && typeof r.message == "string")
        return r.message;
    }
    function W(r) {
      const e = r && typeof r == "object" ? r.response : void 0;
      return V(e?.data) || (r instanceof Error ? r.message : "") || "save failed";
    }
    async function $() {
      if (!S.value || v.value) return;
      v.value = !0;
      const r = [...h.value].sort((a, s) => (a.key === "enabled" ? 1 : 0) - (s.key === "enabled" ? 1 : 0));
      let e = !1;
      for (const a of r)
        if (N(a)) {
          delete n[a.key];
          try {
            const { data: s } = await Y.put("/api/v1/settings", { namespace: S.value, key: a.key, value: B(a) });
            s?.success ? (e = !0, g(a) === "secret" ? a.has_value = !0 : a.value = B(a)) : n[a.key] = V(s) || "save failed";
          } catch (s) {
            n[a.key] = W(s);
          }
        }
      v.value = !1, e && (z(), C.value = !0, setTimeout(() => {
        C.value = !1;
      }, 2e3), P("config-changed", { namespace: S.value, enabled: !!o.enabled, configured: L() }));
    }
    return (r, e) => u.value ? (c(), i("div", rr, [
      p("div", ar, [
        p("header", er, [
          n.enabled ? (c(), i("span", or, [
            y(x(w), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            m(" " + t(n.enabled), 1)
          ])) : C.value ? (c(), i("span", pr, [
            y(x(w), {
              icon: "tabler:check",
              "aria-hidden": "true"
            }),
            e[2] || (e[2] = m(" Saved", -1))
          ])) : d("", !0),
          p("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !T.value || v.value,
            onClick: z
          }, "Discard", 8, cr),
          p("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !T.value || v.value,
            onClick: $
          }, [
            y(x(w), {
              icon: v.value ? "tabler:loader-2" : "tabler:device-floppy",
              class: k(v.value && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            m(" " + t(v.value ? "Saving…" : "Save"), 1)
          ], 8, ir)
        ]),
        p("div", nr, [
          p("section", sr, [
            p("header", tr, [
              y(x(w), {
                icon: u.value.icon || "tabler:plug",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              m(" " + t(u.value.label), 1)
            ]),
            f.value.intro ? (c(), i("p", lr, [
              m(t(f.value.intro) + " ", 1),
              f.value.docs_url ? (c(), i("a", {
                key: 0,
                href: f.value.docs_url,
                target: "_blank",
                rel: "noopener",
                class: "ap-link"
              }, [
                m(t(f.value.docs_label || "Docs") + " ", 1),
                y(x(w), {
                  icon: "tabler:external-link",
                  "aria-hidden": "true"
                })
              ], 8, vr)) : d("", !0)
            ])) : d("", !0),
            p("div", dr, [
              e[4] || (e[4] = p("div", { class: "ap-toggle-text" }, [
                p("span", { class: "ap-toggle-name" }, "Enabled"),
                p("span", { class: "ap-toggle-desc" }, "Turn this provider on once its credentials are set.")
              ], -1)),
              p("button", {
                type: "button",
                class: k(["ks-switch", { on: b.value }]),
                role: "switch",
                "aria-checked": b.value,
                title: b.value ? "Enabled" : "Disabled",
                onClick: e[0] || (e[0] = (a) => b.value = !b.value)
              }, [...e[3] || (e[3] = [
                p("span", { class: "ks-switch-knob" }, null, -1)
              ])], 10, ur)
            ]),
            (c(!0), i(_, null, X(J.value, (a) => (c(), i(_, {
              key: a.key
            }, [
              g(a) === "bool" ? (c(), i("div", gr, [
                p("div", mr, [
                  p("span", fr, t(a.description || a.key), 1),
                  n[a.key] ? (c(), i("span", hr, t(n[a.key]), 1)) : d("", !0)
                ]),
                p("button", {
                  type: "button",
                  class: k(["ks-switch", { on: !!o[a.key] }]),
                  role: "switch",
                  "aria-checked": !!o[a.key],
                  title: o[a.key] ? "Enabled" : "Disabled",
                  onClick: (s) => o[a.key] = !o[a.key]
                }, [...e[5] || (e[5] = [
                  p("span", { class: "ks-switch-knob" }, null, -1)
                ])], 10, br)
              ])) : (c(), i(_, { key: 1 }, [
                p("label", yr, t(a.description || a.key), 1),
                g(a) === "secret" ? (c(), i("input", {
                  key: 0,
                  type: "password",
                  autocomplete: "off",
                  class: k(["ap-binput", { "ap-binput-invalid": n[a.key] }]),
                  placeholder: a.has_value ? "•••••••• set — leave blank to keep" : "Not set",
                  value: o[a.key],
                  onInput: (s) => o[a.key] = s.target.value
                }, null, 42, xr)) : (c(), i("input", {
                  key: 1,
                  class: k(["ap-binput", { "ap-binput-invalid": n[a.key] }]),
                  type: a.key === "issuer" ? "url" : "text",
                  placeholder: a.key === "issuer" ? "https://issuer.example.com" : "",
                  value: o[a.key],
                  onInput: (s) => o[a.key] = s.target.value
                }, null, 42, kr)),
                n[a.key] ? (c(), i("p", wr, t(n[a.key]), 1)) : d("", !0)
              ], 64))
            ], 64))), 128)),
            j.value ? (c(), i(_, { key: 1 }, [
              e[6] || (e[6] = p("label", { class: "ap-blabel" }, "Scopes", -1)),
              p("input", {
                class: "ap-binput",
                placeholder: "space or comma separated (optional)",
                value: o.scopes,
                onInput: e[1] || (e[1] = (a) => o.scopes = a.target.value)
              }, null, 40, _r),
              j.value.description ? (c(), i("p", Sr, t(j.value.description), 1)) : d("", !0)
            ], 64)) : d("", !0)
          ])
        ])
      ])
    ])) : d("", !0);
  }
}), zr = ":root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.ap{--system-surface-gutter: var(--kickside-system-surface-gutter, 24px);font-family:inherit;display:flex;flex-direction:column;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background)}.ap-body{flex:1;overflow-y:auto;padding:0 0 28px}.ap-bar{display:flex;align-items:center;justify-content:flex-end;gap:10px;width:100%;padding:12px var(--system-surface-gutter);background:var(--p-content-background);position:sticky;top:0;z-index:3;border-bottom:1px solid var(--p-content-border-color)}.ap-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 14px;border-radius:8px;border:1px solid transparent;font:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:filter .15s,background .15s,opacity .15s}.ap-btn:disabled{opacity:.45;cursor:default}.ap-btn-primary{background:var(--p-primary-color);color:var(--p-button-primary-color)}.ap-btn-primary:hover:not(:disabled){filter:brightness(1.05)}.ap-btn-ghost{background:transparent;border-color:var(--p-content-border-color);color:var(--p-text-color)}.ap-btn-ghost:hover:not(:disabled){background:color-mix(in srgb,var(--p-text-color) 8%,transparent)}.ap-btn svg{width:16px;height:16px}.ap-err{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.ap-msg-inline{display:inline-flex;align-items:center;gap:4px;margin-right:auto;padding:0 11px;height:34px;border-radius:8px;font-size:12px;font-weight:600}.ap-msg-inline svg{width:15px;height:15px}.ap-saved{display:inline-flex;align-items:center;gap:4px;margin-right:auto;font-size:12px;font-weight:600;color:var(--p-primary-color)}.ap-saved svg{width:15px;height:15px}.ap-cards{display:flex;flex-direction:column;gap:16px;padding:16px var(--system-surface-gutter) 0}.ap-card{background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:16px 18px}.ap-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:var(--p-text-color);letter-spacing:-.2px}.ap-h svg{width:17px;height:17px;color:var(--p-text-muted-color)}.ap-sub{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--p-text-muted-color);margin:4px 0 12px}.ap-link{display:inline-flex;align-items:center;gap:3px;color:var(--p-primary-color);text-decoration:none;font-weight:600}.ap-link:hover{text-decoration:underline}.ap-link svg{width:13px;height:13px}.ap-blabel{display:block;font-size:11.5px;font-weight:700;color:var(--p-text-muted-color);text-transform:uppercase;letter-spacing:.04em;margin:12px 0 6px}.ap-binput{width:100%;height:34px;padding:0 12px;border-radius:8px;border:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-color);font:inherit;font-size:13px;box-sizing:border-box}select.ap-binput{cursor:pointer}.ap-binput:focus{outline:none;border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.ap-binput-invalid,.ap-binput-invalid:focus{border-color:var(--p-danger-500)}.ap-hint{font-size:11.5px;color:var(--p-text-muted-color);margin:8px 0 0}.ap-hint-err{color:var(--p-danger-600, var(--p-danger-500))}.ap-toggle-row{display:flex;align-items:center;gap:16px;margin-top:12px}.ap-toggle-text{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}.ap-toggle-name{font-size:13px;font-weight:600;color:var(--p-text-color)}.ap-toggle-desc{font-size:12px;color:var(--p-text-muted-color)}.ks-switch{flex:0 0 auto;position:relative;width:40px;height:22px;padding:0;border:none;border-radius:999px;cursor:pointer;background:color-mix(in srgb,var(--p-text-color) 22%,transparent);transition:background .18s}.ks-switch.on{background:var(--p-primary-color)}.ks-switch:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.ks-switch-knob{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--p-button-primary-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent);transition:transform .18s}.ks-switch.on .ks-switch-knob{transform:translate(18px)}@keyframes ks-spin{to{transform:rotate(360deg)}}.spin{animation:ks-spin .8s linear infinite}", Br = { type: "object", properties: { config: { type: "object" } } };
class jr extends G {
  static get wippyConfig() {
    return { propsSchema: Br, hostCssKeys: ["themeConfigUrl"], inlineCss: zr };
  }
  static get vueConfig() {
    return { rootComponent: Cr };
  }
}
Z(import.meta.url, jr);
//# sourceMappingURL=provider.js.map
