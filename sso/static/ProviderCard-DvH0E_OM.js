import { defineComponent as q, computed as u, reactive as F, ref as R, watch as G, openBlock as o, createElementBlock as l, createElementVNode as n, createVNode as g, unref as m, createTextVNode as y, toDisplayString as c, createCommentVNode as p, normalizeClass as f, Fragment as S, renderList as M } from "vue";
import { Icon as w } from "@iconify/vue";
import { api as Q } from "@wippy-fe/proxy";
import { a as U, u as W } from "./wc-runtime-CNDpK4lj.js";
const X = {
  key: 0,
  class: "ap"
}, Y = { class: "ap-body" }, Z = { class: "ap-bar" }, ee = {
  key: 0,
  class: "ap-msg-inline ap-err"
}, te = {
  key: 1,
  class: "ap-saved"
}, se = ["disabled"], ae = ["disabled"], ne = { class: "ap-cards" }, oe = { class: "ap-card" }, le = { class: "ap-h" }, ie = {
  key: 0,
  class: "ap-sub"
}, re = ["href"], ce = { class: "ap-toggle-row" }, ue = ["aria-checked", "title"], de = {
  key: 0,
  class: "ap-toggle-row"
}, pe = { class: "ap-toggle-text" }, ve = { class: "ap-toggle-name" }, ke = {
  key: 0,
  class: "ap-hint ap-hint-err"
}, ye = ["aria-checked", "title", "onClick"], be = { class: "ap-blabel" }, _e = ["placeholder", "value", "onInput"], he = ["type", "placeholder", "value", "onInput"], ge = {
  key: 2,
  class: "ap-hint ap-hint-err"
}, me = ["value"], fe = {
  key: 0,
  class: "ap-hint"
}, je = /* @__PURE__ */ q({
  __name: "ProviderCard",
  setup(we) {
    const A = U(), H = W(), v = u(() => A.value.config || null), b = u(() => v.value?.ui || {}), B = u(() => v.value?.namespace || ""), _ = u(() => v.value?.fields || []), J = u(() => {
      const e = {};
      for (const s of _.value) e[s.key] = s;
      return e;
    });
    function E(e) {
      return J.value[e];
    }
    function k(e) {
      return e.value_type === "bool" ? "bool" : e.value_type === "secret" ? "secret" : e.schema?.kind === "string_list" || e.value_type === "json" ? "list" : "text";
    }
    const a = F({}), i = F({}), d = R(!1), C = R(!1);
    function N(e) {
      return Array.isArray(e) ? e.map(String).filter(Boolean) : typeof e == "string" ? e.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean) : [];
    }
    function x() {
      for (const e of _.value)
        switch (k(e)) {
          case "bool":
            a[e.key] = !!e.value;
            break;
          case "secret":
            a[e.key] = "";
            break;
          case "list":
            a[e.key] = N(e.value).join(" ");
            break;
          default:
            a[e.key] = String(e.value ?? "");
        }
    }
    G(v, x, { immediate: !0 });
    function j(e) {
      switch (k(e)) {
        case "bool":
          return !!a[e.key];
        case "secret":
          return String(a[e.key] ?? "").length ? a[e.key] : void 0;
        case "list": {
          const s = String(a[e.key] ?? "").split(/[\s,]+/).map((t) => t.trim()).filter(Boolean);
          return e.value_type === "json" ? s : s.join(" ");
        }
        default:
          return String(a[e.key] ?? "");
      }
    }
    function L(e) {
      switch (k(e)) {
        case "bool":
          return !!e.value;
        case "list": {
          const s = N(e.value);
          return e.value_type === "json" ? s : s.join(" ");
        }
        default:
          return String(e.value ?? "");
      }
    }
    function I(e) {
      const s = j(e);
      return s === void 0 ? !1 : k(e) === "secret" ? !0 : JSON.stringify(s) !== JSON.stringify(L(e));
    }
    const h = u({
      get: () => !!a.enabled,
      set: (e) => {
        a.enabled = e;
      }
    }), O = { issuer: 0, client_id: 1, client_secret: 2, tenant: 3, allow_unverified_email: 4 }, P = u(() => _.value.filter((e) => e.key !== "enabled" && e.key !== "scopes").sort((e, s) => (O[e.key] ?? 9) - (O[s.key] ?? 9))), D = u(() => E("scopes"));
    function $() {
      const e = String(a.client_id ?? "").trim().length > 0, t = !!E("client_secret")?.has_value || String(a.client_secret ?? "").length > 0;
      return e && t;
    }
    const T = u(() => _.value.some(I));
    function V(e) {
      if (e && typeof e == "object" && typeof e.message == "string")
        return e.message;
    }
    function z(e) {
      const s = e && typeof e == "object" ? e.response : void 0;
      return V(s?.data) || (e instanceof Error ? e.message : "") || "save failed";
    }
    async function K() {
      if (!B.value || d.value) return;
      d.value = !0;
      const e = [..._.value].sort((t, r) => (t.key === "enabled" ? 1 : 0) - (r.key === "enabled" ? 1 : 0));
      let s = !1;
      for (const t of e)
        if (I(t)) {
          delete i[t.key];
          try {
            const { data: r } = await Q.put("/api/v1/settings", { namespace: B.value, key: t.key, value: j(t) });
            r?.success ? (s = !0, k(t) === "secret" ? t.has_value = !0 : t.value = j(t)) : i[t.key] = V(r) || "save failed";
          } catch (r) {
            i[t.key] = z(r);
          }
        }
      d.value = !1, s && (x(), C.value = !0, setTimeout(() => {
        C.value = !1;
      }, 2e3), H("config-changed", { namespace: B.value, enabled: !!a.enabled, configured: $() }));
    }
    return (e, s) => v.value ? (o(), l("div", X, [
      n("div", Y, [
        n("header", Z, [
          i.enabled ? (o(), l("span", ee, [
            g(m(w), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            y(" " + c(i.enabled), 1)
          ])) : C.value ? (o(), l("span", te, [
            g(m(w), {
              icon: "tabler:check",
              "aria-hidden": "true"
            }),
            s[2] || (s[2] = y(" Saved", -1))
          ])) : p("", !0),
          n("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !T.value || d.value,
            onClick: x
          }, "Discard", 8, se),
          n("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !T.value || d.value,
            onClick: K
          }, [
            g(m(w), {
              icon: d.value ? "tabler:loader-2" : "tabler:device-floppy",
              class: f(d.value && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            y(" " + c(d.value ? "Saving…" : "Save"), 1)
          ], 8, ae)
        ]),
        n("div", ne, [
          n("section", oe, [
            n("header", le, [
              g(m(w), {
                icon: v.value.icon || "tabler:plug",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              y(" " + c(v.value.label), 1)
            ]),
            b.value.intro ? (o(), l("p", ie, [
              y(c(b.value.intro) + " ", 1),
              b.value.docs_url ? (o(), l("a", {
                key: 0,
                href: b.value.docs_url,
                target: "_blank",
                rel: "noopener",
                class: "ap-link"
              }, [
                y(c(b.value.docs_label || "Docs") + " ", 1),
                g(m(w), {
                  icon: "tabler:external-link",
                  "aria-hidden": "true"
                })
              ], 8, re)) : p("", !0)
            ])) : p("", !0),
            n("div", ce, [
              s[4] || (s[4] = n("div", { class: "ap-toggle-text" }, [
                n("span", { class: "ap-toggle-name" }, "Enabled"),
                n("span", { class: "ap-toggle-desc" }, "Turn this provider on once its credentials are set.")
              ], -1)),
              n("button", {
                type: "button",
                class: f(["ks-switch", { on: h.value }]),
                role: "switch",
                "aria-checked": h.value,
                title: h.value ? "Enabled" : "Disabled",
                onClick: s[0] || (s[0] = (t) => h.value = !h.value)
              }, [...s[3] || (s[3] = [
                n("span", { class: "ks-switch-knob" }, null, -1)
              ])], 10, ue)
            ]),
            (o(!0), l(S, null, M(P.value, (t) => (o(), l(S, {
              key: t.key
            }, [
              k(t) === "bool" ? (o(), l("div", de, [
                n("div", pe, [
                  n("span", ve, c(t.description || t.key), 1),
                  i[t.key] ? (o(), l("span", ke, c(i[t.key]), 1)) : p("", !0)
                ]),
                n("button", {
                  type: "button",
                  class: f(["ks-switch", { on: !!a[t.key] }]),
                  role: "switch",
                  "aria-checked": !!a[t.key],
                  title: a[t.key] ? "Enabled" : "Disabled",
                  onClick: (r) => a[t.key] = !a[t.key]
                }, [...s[5] || (s[5] = [
                  n("span", { class: "ks-switch-knob" }, null, -1)
                ])], 10, ye)
              ])) : (o(), l(S, { key: 1 }, [
                n("label", be, c(t.description || t.key), 1),
                k(t) === "secret" ? (o(), l("input", {
                  key: 0,
                  type: "password",
                  autocomplete: "off",
                  class: f(["ap-binput", { "ap-binput-invalid": i[t.key] }]),
                  placeholder: t.has_value ? "•••••••• set — leave blank to keep" : "Not set",
                  value: a[t.key],
                  onInput: (r) => a[t.key] = r.target.value
                }, null, 42, _e)) : (o(), l("input", {
                  key: 1,
                  class: f(["ap-binput", { "ap-binput-invalid": i[t.key] }]),
                  type: t.key === "issuer" ? "url" : "text",
                  placeholder: t.key === "issuer" ? "https://issuer.example.com" : "",
                  value: a[t.key],
                  onInput: (r) => a[t.key] = r.target.value
                }, null, 42, he)),
                i[t.key] ? (o(), l("p", ge, c(i[t.key]), 1)) : p("", !0)
              ], 64))
            ], 64))), 128)),
            D.value ? (o(), l(S, { key: 1 }, [
              s[6] || (s[6] = n("label", { class: "ap-blabel" }, "Scopes", -1)),
              n("input", {
                class: "ap-binput",
                placeholder: "space or comma separated (optional)",
                value: a.scopes,
                onInput: s[1] || (s[1] = (t) => a.scopes = t.target.value)
              }, null, 40, me),
              D.value.description ? (o(), l("p", fe, c(D.value.description), 1)) : p("", !0)
            ], 64)) : p("", !0)
          ])
        ])
      ])
    ])) : p("", !0);
  }
});
export {
  je as default
};
//# sourceMappingURL=ProviderCard-DvH0E_OM.js.map
