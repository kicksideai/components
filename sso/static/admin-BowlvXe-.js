import { defineComponent as se, ref as k, onMounted as oe, watch as me, onBeforeUnmount as he, openBlock as s, createElementBlock as o, toDisplayString as v, computed as p, reactive as J, createCommentVNode as _, createVNode as h, unref as y, createTextVNode as R, Fragment as S, renderList as P, createBlock as te, createElementVNode as r, normalizeClass as $ } from "vue";
import { Icon as b } from "@iconify/vue";
import { loadByTagName as ye, api as z } from "@wippy-fe/proxy";
import { a as be } from "./wc-runtime-CNDpK4lj.js";
const ke = { class: "ks-wcmount" }, we = {
  key: 0,
  class: "ks-wcmount-fail"
}, ae = /* @__PURE__ */ se({
  __name: "WcMount",
  props: {
    tag: {},
    config: {}
  },
  emits: ["change"],
  setup(x, { emit: I }) {
    const u = x, T = I, E = k(null), m = k(!1);
    let d = null;
    function N(f) {
      T("change", f.detail);
    }
    async function j(f) {
      if (!customElements.get(f))
        try {
          await ye(f, { timeoutMs: 8e3 });
        } catch {
        }
    }
    async function g() {
      if (m.value = !1, !!E.value) {
        if (d && (d.removeEventListener("config-changed", N), d = null), E.value.innerHTML = "", !u.tag) {
          m.value = !0;
          return;
        }
        try {
          await j(u.tag), d = document.createElement(u.tag);
          try {
            d.setAttribute("config", JSON.stringify(u.config || {}));
          } catch {
          }
          d.addEventListener("config-changed", N), d.style.display = "block", E.value.appendChild(d), m.value = !customElements.get(u.tag);
        } catch {
          m.value = !0;
        }
      }
    }
    return oe(g), me(() => u.tag, g), he(() => {
      d && d.removeEventListener("config-changed", N);
    }), (f, D) => (s(), o("div", ke, [
      m.value ? (s(), o("div", we, "Provider card “" + v(x.tag) + "” is not available.", 1)) : (s(), o("div", {
        key: 1,
        ref_key: "host",
        ref: E
      }, null, 512))
    ]));
  }
}), Ce = { class: "ap" }, Se = {
  key: 0,
  class: "ap-providers"
}, Ee = {
  key: 0,
  class: "ap-msg ap-err"
}, Le = {
  key: 1,
  class: "ap-loading"
}, Ae = {
  key: 1,
  class: "ap-body"
}, Be = {
  key: 0,
  class: "ap-bar"
}, Pe = {
  key: 0,
  class: "ap-saved"
}, Ne = ["disabled"], je = ["disabled"], Oe = {
  key: 1,
  class: "ap-msg ap-err"
}, Re = {
  key: 2,
  class: "ap-loading"
}, Ge = {
  key: 3,
  class: "ap-cards"
}, $e = { class: "ap-card" }, xe = { class: "ap-h" }, Ie = {
  key: 0,
  class: "ap-toggle-row"
}, Te = { class: "ap-toggle-text" }, De = {
  key: 0,
  class: "ap-toggle-desc"
}, Me = ["aria-checked"], Ke = { class: "pv-group-title" }, Ue = {
  key: 0,
  class: "ap-toggle-row"
}, Ve = { class: "ap-toggle-text" }, Fe = { class: "ap-toggle-name" }, Je = ["aria-checked", "onClick"], ze = { class: "ap-blabel" }, Ye = ["value", "onChange"], He = ["value"], We = {
  key: 1,
  class: "ks-map"
}, qe = ["value", "onInput"], Qe = ["value", "onChange"], Xe = ["value"], Ze = ["onClick"], et = ["onClick"], tt = ["placeholder", "value", "onInput"], at = {
  key: 3,
  class: "ap-hint ap-hint-err"
}, nt = "kickside.sso", ne = "kickside-sso-provider", st = "enabled", ct = /* @__PURE__ */ se({
  __name: "admin",
  setup(x) {
    const I = [
      "enabled",
      "auto_provision",
      "allowed_email_domains",
      "default_group",
      "group_claim_name",
      "group_mapping",
      "post_login_redirect_allowlist"
    ];
    function u(e, t) {
      return `${e}|${t}`;
    }
    const T = be(), E = p(() => T.value?.config || {}), m = p(() => {
      const e = E.value.provider;
      return typeof e == "string" && e.length ? e : "";
    }), d = p(() => !m.value && E.value.scope === "global"), N = p(() => !!m.value), j = k(!0), g = k(""), f = k(nt), D = k([]), G = k([]), M = k([]), l = J({}), O = J({}), K = J({}), L = k(""), le = p(() => {
      const e = {};
      for (const t of G.value) e[u(t.namespace, t.key)] = t;
      return e;
    });
    function c(e) {
      return le.value[e];
    }
    const U = p(() => I.map((e) => u(f.value, e)).filter((e) => !!c(e))), Y = p(() => D.value.filter((e) => e.id === m.value)), ie = [
      { title: "Provisioning", icon: "tabler:user-plus", keys: ["auto_provision", "allowed_email_domains", "default_group"] },
      { title: "Group sync", icon: "tabler:users-group", keys: ["group_claim_name", "group_mapping"] },
      { title: "Redirects", icon: "tabler:route", keys: ["post_login_redirect_allowlist"] }
    ], A = p(() => u(f.value, st)), re = p(() => ie.map((e) => ({ ...e, ids: e.keys.map((t) => u(f.value, t)).filter((t) => !!c(t)) })).filter((e) => e.ids.length)), H = p(() => U.value.some((e) => {
      const t = c(e);
      return t && Q(t);
    })), ce = p(() => U.value.some((e) => K[e]));
    function w(e) {
      if (e.value_type === "bool") return "bool";
      if (e.value_type === "secret") return "secret";
      const t = e.schema?.kind;
      return t === "string_list" ? "list" : t === "group_ref" ? "group" : t === "mapping" ? "mapping" : "text";
    }
    function W(e) {
      return Array.isArray(e) ? e.map((t) => String(t)).filter(Boolean) : typeof e == "string" ? e.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean) : [];
    }
    function ue(e) {
      return e && typeof e == "object" && !Array.isArray(e) ? Object.entries(e).map(([t, n]) => ({ k: t, v: String(n ?? "") })) : [];
    }
    function V(e) {
      const t = u(e.namespace, e.key);
      switch (w(e)) {
        case "bool":
          l[t] = !!e.value;
          break;
        case "secret":
          l[t] = "";
          break;
        case "list":
          l[t] = W(e.value).join(" ");
          break;
        case "mapping":
          l[t] = ue(e.value);
          break;
        default:
          l[t] = String(e.value ?? "");
      }
    }
    function q(e) {
      const t = u(e.namespace, e.key);
      switch (w(e)) {
        case "bool":
          return !!l[t];
        case "secret":
          return String(l[t] ?? "").length ? l[t] : void 0;
        case "list": {
          const n = String(l[t] ?? "").split(/[\s,]+/).map((a) => a.trim()).filter(Boolean);
          return e.value_type === "json" ? n : n.join(" ");
        }
        case "mapping": {
          const n = {};
          for (const a of l[t]) {
            const i = a.k.trim();
            i && (n[i] = a.v);
          }
          return n;
        }
        default:
          return String(l[t] ?? "");
      }
    }
    function de(e) {
      switch (w(e)) {
        case "bool":
          return !!e.value;
        case "list": {
          const t = W(e.value);
          return e.value_type === "json" ? t : t.join(" ");
        }
        case "mapping":
          return e.value && typeof e.value == "object" ? e.value : {};
        default:
          return String(e.value ?? "");
      }
    }
    function Q(e) {
      const t = q(e);
      return t === void 0 ? !1 : w(e) === "secret" ? !0 : JSON.stringify(t) !== JSON.stringify(de(e));
    }
    function pe(e) {
      l[e].push({ k: "", v: "" });
    }
    function ve(e, t) {
      l[e].splice(t, 1);
    }
    function X(e) {
      const t = e.fields.map((n) => {
        const a = c(u(e.namespace, n));
        return {
          key: n,
          value_type: a?.value_type ?? "string",
          value: a?.value,
          has_value: a?.has_value,
          description: a?.description,
          schema: a?.schema ?? null
        };
      });
      return { namespace: e.namespace, label: e.label, icon: e.icon, engine: e.engine, ui: e.ui ?? null, fields: t };
    }
    async function F() {
      const { data: e } = await z.get("/api/v1/sso/providers");
      if (!e?.success) throw new Error(e?.error || "failed to load providers");
      typeof e.global_namespace == "string" && (f.value = e.global_namespace);
      const t = e.settings || {};
      return G.value = Object.values(t).map((n) => ({
        namespace: n.namespace,
        key: n.key,
        value_type: n.value_type,
        schema: n.schema ?? null,
        description: n.description,
        has_value: n.has_value,
        value: n.value
      })), e.providers;
    }
    async function Z() {
      j.value = !0, g.value = "";
      try {
        const [e, t] = await Promise.all([
          F(),
          z.get("/api/v1/users/assignable-scopes").catch(() => ({ data: { success: !1 } }))
        ]);
        D.value = e;
        const n = t.data?.success ? t.data.scopes : [];
        M.value = n.map((a) => ({ id: a.id, label: a.label || a.id }));
        for (const a of G.value) V(a);
      } catch (e) {
        g.value = e instanceof Error ? e.message : String(e);
      } finally {
        j.value = !1;
      }
    }
    function ge(e) {
      return e?.response?.data?.error || e?.message || "save failed";
    }
    async function fe(e, t) {
      L.value = t, g.value = "";
      const n = [];
      try {
        for (const a of e) {
          const i = c(a);
          if (!(!i || !Q(i))) {
            delete O[a];
            try {
              const { data: B } = await z.put("/api/v1/settings", { namespace: i.namespace, key: i.key, value: q(i) });
              B?.success ? (n.push(a), K[a] = !0) : O[a] = B?.error || "save failed";
            } catch (B) {
              O[a] = ge(B);
            }
          }
        }
        if (n.length) {
          await F();
          for (const a of n) {
            const i = c(a);
            i && V(i);
          }
          setTimeout(() => {
            for (const a of n) delete K[a];
          }, 2500);
        }
      } finally {
        L.value = "";
      }
    }
    async function _e() {
      await fe(U.value, "global");
    }
    async function ee() {
      try {
        await F();
        for (const e of G.value) V(e);
      } catch {
      }
    }
    return oe(Z), (e, t) => (s(), o("div", Ce, [
      N.value && !d.value ? (s(), o("div", Se, [
        g.value ? (s(), o("div", Ee, v(g.value), 1)) : _("", !0),
        j.value ? (s(), o("div", Le, [
          h(y(b), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          t[1] || (t[1] = R(" Loading…", -1))
        ])) : _("", !0),
        (s(!0), o(S, null, P(Y.value, (n) => (s(), te(ae, {
          key: n.id,
          tag: n.ui_component || ne,
          config: X(n),
          onChange: ee
        }, null, 8, ["tag", "config"]))), 128))
      ])) : (s(), o("div", Ae, [
        d.value ? (s(), o("header", Be, [
          ce.value ? (s(), o("span", Pe, [
            h(y(b), {
              icon: "tabler:check",
              "aria-hidden": "true"
            }),
            t[2] || (t[2] = R(" Saved", -1))
          ])) : _("", !0),
          r("button", {
            class: "ap-btn ap-btn-ghost",
            disabled: !H.value || L.value === "global",
            onClick: Z
          }, "Discard", 8, Ne),
          r("button", {
            class: "ap-btn ap-btn-primary",
            disabled: !H.value || L.value === "global",
            onClick: _e
          }, [
            h(y(b), {
              icon: L.value === "global" ? "tabler:loader-2" : "tabler:device-floppy",
              class: $(L.value === "global" && "spin"),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"]),
            R(" " + v(L.value === "global" ? "Saving…" : "Save"), 1)
          ], 8, je)
        ])) : _("", !0),
        g.value ? (s(), o("div", Oe, v(g.value), 1)) : _("", !0),
        j.value ? (s(), o("div", Re, [
          h(y(b), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          t[3] || (t[3] = R(" Loading…", -1))
        ])) : d.value ? (s(), o("div", Ge, [
          r("section", $e, [
            r("header", xe, [
              h(y(b), {
                icon: "tabler:shield-lock",
                "aria-hidden": "true"
              }),
              t[4] || (t[4] = R(" Single sign-on", -1))
            ]),
            c(A.value) ? (s(), o("div", Ie, [
              r("div", Te, [
                t[5] || (t[5] = r("span", { class: "ap-toggle-name" }, "Enabled", -1)),
                c(A.value).description ? (s(), o("span", De, v(c(A.value).description), 1)) : _("", !0)
              ]),
              r("button", {
                type: "button",
                class: $(["ks-switch", { on: l[A.value] }]),
                role: "switch",
                "aria-checked": !!l[A.value],
                onClick: t[0] || (t[0] = (n) => l[A.value] = !l[A.value])
              }, [...t[6] || (t[6] = [
                r("span", { class: "ks-switch-knob" }, null, -1)
              ])], 10, Me)
            ])) : _("", !0),
            (s(!0), o(S, null, P(re.value, (n) => (s(), o("div", {
              key: n.title,
              class: "pv-group"
            }, [
              r("h3", Ke, [
                h(y(b), {
                  icon: n.icon,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                R(" " + v(n.title), 1)
              ]),
              (s(!0), o(S, null, P(n.ids, (a) => (s(), o("div", {
                key: a,
                class: "pv-field"
              }, [
                w(c(a)) === "bool" ? (s(), o("div", Ue, [
                  r("div", Ve, [
                    r("span", Fe, v(c(a).description || c(a).key), 1)
                  ]),
                  r("button", {
                    type: "button",
                    class: $(["ks-switch", { on: l[a] }]),
                    role: "switch",
                    "aria-checked": !!l[a],
                    onClick: (i) => l[a] = !l[a]
                  }, [...t[7] || (t[7] = [
                    r("span", { class: "ks-switch-knob" }, null, -1)
                  ])], 10, Je)
                ])) : (s(), o(S, { key: 1 }, [
                  r("label", ze, v(c(a).description || c(a).key), 1),
                  w(c(a)) === "group" ? (s(), o("select", {
                    key: 0,
                    class: "ap-binput",
                    value: l[a],
                    onChange: (i) => l[a] = i.target.value
                  }, [
                    t[8] || (t[8] = r("option", { value: "" }, "— none —", -1)),
                    (s(!0), o(S, null, P(M.value, (i) => (s(), o("option", {
                      key: i.id,
                      value: i.id
                    }, v(i.label), 9, He))), 128))
                  ], 40, Ye)) : w(c(a)) === "mapping" ? (s(), o("div", We, [
                    (s(!0), o(S, null, P(l[a], (i, B) => (s(), o("div", {
                      key: B,
                      class: "ks-map-row"
                    }, [
                      r("input", {
                        class: "ap-binput",
                        placeholder: "IdP group",
                        value: i.k,
                        onInput: (C) => i.k = C.target.value
                      }, null, 40, qe),
                      h(y(b), {
                        icon: "tabler:arrow-right",
                        class: "ks-map-arrow",
                        "aria-hidden": "true"
                      }),
                      r("select", {
                        class: "ap-binput",
                        value: i.v,
                        onChange: (C) => i.v = C.target.value
                      }, [
                        t[9] || (t[9] = r("option", { value: "" }, "— select group —", -1)),
                        (s(!0), o(S, null, P(M.value, (C) => (s(), o("option", {
                          key: C.id,
                          value: C.id
                        }, v(C.label), 9, Xe))), 128))
                      ], 40, Qe),
                      r("button", {
                        type: "button",
                        class: "ap-icon-btn",
                        title: "Remove",
                        "aria-label": "Remove mapping",
                        onClick: (C) => ve(a, B)
                      }, [
                        h(y(b), {
                          icon: "tabler:trash",
                          "aria-hidden": "true"
                        })
                      ], 8, Ze)
                    ]))), 128)),
                    r("button", {
                      type: "button",
                      class: "ap-icon-btn ks-map-add",
                      title: "Add mapping",
                      "aria-label": "Add mapping",
                      onClick: (i) => pe(a)
                    }, [
                      h(y(b), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ], 8, et)
                  ])) : (s(), o("input", {
                    key: 2,
                    type: "text",
                    class: $(["ap-binput", { "ap-binput-invalid": O[a] }]),
                    placeholder: w(c(a)) === "list" ? "space or comma separated" : "",
                    value: l[a],
                    onInput: (i) => l[a] = i.target.value
                  }, null, 42, tt)),
                  O[a] ? (s(), o("p", at, v(O[a]), 1)) : _("", !0)
                ], 64))
              ]))), 128))
            ]))), 128))
          ]),
          N.value ? (s(!0), o(S, { key: 0 }, P(Y.value, (n) => (s(), te(ae, {
            key: n.id,
            tag: n.ui_component || ne,
            config: X(n),
            onChange: ee
          }, null, 8, ["tag", "config"]))), 128)) : _("", !0)
        ])) : _("", !0)
      ]))
    ]));
  }
});
export {
  ct as default
};
//# sourceMappingURL=admin-BowlvXe-.js.map
