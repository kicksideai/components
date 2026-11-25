import { defineComponent as ae, useId as we, openBlock as l, createElementBlock as o, unref as i, createElementVNode as d, toDisplayString as m, createCommentVNode as p, renderSlot as W, useModel as je, useSlots as Fe, ref as $, watch as Y, normalizeClass as $e, createVNode as r, createBlock as C, Transition as Oe, withCtx as w, withDirectives as Be, vShow as Ae, mergeModels as Pe, computed as N, Fragment as Q, renderList as Ve, shallowRef as ie, onMounted as qe, createTextVNode as I } from "vue";
import { c as ze } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { A as Se, K as Ce, L as Ke, d as G, a as Je, u as Ge, B as He, _ as We, r as Ye, i as Qe, I as Xe, E as Ze, h as ea, J as aa } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-CMfF3-zi.js";
import { api as re, host as xe, define as ta } from "@wippy-fe/proxy";
import { Icon as b } from "@iconify/vue";
import F from "primevue/button";
import la from "primevue/dialog";
import ee from "primevue/inputtext";
import Te from "primevue/select";
import sa from "primevue/inputnumber";
import ia from "primevue/password";
import na from "primevue/tag";
import oa from "primevue/toggleswitch";
const ra = ["aria-labelledby"], da = {
  key: 0,
  class: "kx-settings-group-head"
}, ua = ["id"], ca = {
  key: 0,
  class: "kx-settings-group-count"
}, va = { class: "kx-settings-group-list" }, ne = /* @__PURE__ */ ae({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(v) {
    const g = we();
    return (u, M) => (l(), o("section", {
      class: "kx-settings-group",
      "aria-labelledby": v.title ? i(g) : void 0
    }, [
      v.title ? (l(), o("div", da, [
        d("h2", {
          id: i(g),
          class: "kx-settings-group-title"
        }, m(v.title), 9, ua),
        v.count !== void 0 ? (l(), o("span", ca, m(v.count), 1)) : p("", !0)
      ])) : p("", !0),
      d("div", va, [
        W(u.$slots, "default")
      ])
    ], 8, ra));
  }
}), ma = { class: "kx-settings-item-head" }, pa = { class: "kx-settings-item-main" }, ya = { class: "kx-settings-item-line" }, fa = { class: "kx-settings-item-title" }, ka = {
  key: 0,
  class: "kx-settings-item-desc"
}, ga = {
  key: 1,
  class: "kx-settings-item-meta"
}, ba = { class: "kx-settings-item-actions" }, ha = ["aria-expanded", "aria-controls", "aria-label"], _a = ["id", "inert"], xa = { class: "kx-settings-item-clip" }, wa = { class: "kx-settings-item-body" }, B = /* @__PURE__ */ ae({
  __name: "SettingsItem",
  props: /* @__PURE__ */ Pe({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(v) {
    const g = v, u = je(v, "open"), M = Fe(), R = we(), U = $(u.value);
    return Y(u, (_) => {
      _ && (U.value = !0);
    }), (_, k) => (l(), o("article", {
      class: $e(["kx-settings-item", { "kx-settings-item-open": u.value && i(M).default }])
    }, [
      d("div", ma, [
        d("div", pa, [
          d("div", ya, [
            d("h3", fa, m(v.title), 1),
            W(_.$slots, "status")
          ]),
          v.description ? (l(), o("p", ka, m(v.description), 1)) : p("", !0),
          i(M).meta ? (l(), o("p", ga, [
            W(_.$slots, "meta")
          ])) : p("", !0)
        ]),
        d("div", ba, [
          i(M).default ? (l(), o("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": u.value,
            "aria-controls": i(R),
            "aria-label": (v.expandLabel || "Details") + " " + v.title,
            onClick: k[0] || (k[0] = (j) => u.value = !u.value)
          }, [
            d("span", null, m(v.expandLabel || "Details"), 1),
            r(i(b), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, ha)) : p("", !0),
          W(_.$slots, "actions")
        ])
      ]),
      i(M).default ? (l(), C(Oe, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: w(() => [
          U.value || g.keepMounted ? Be((l(), o("div", {
            key: 0,
            id: i(R),
            inert: !u.value,
            class: "kx-settings-item-panel"
          }, [
            d("div", xa, [
              d("div", wa, [
                W(_.$slots, "default")
              ])
            ])
          ], 8, _a)), [
            [Ae, u.value]
          ]) : p("", !0)
        ]),
        _: 3
      })) : p("", !0)
    ], 2));
  }
});
async function oe(v) {
  try {
    const { data: g } = await re.get("/api/v1/settings", { params: { namespace: v } });
    if (g?.success && Array.isArray(g.settings)) return g.settings.filter((u) => u.namespace === v);
    throw new Se({ error: g?.error, kind: "INTERNAL" }, "Settings");
  } catch (g) {
    throw Ce(g, "Settings");
  }
}
async function $a(v) {
  try {
    const { data: g } = await re.put("/api/v1/settings", { values: v });
    if (g?.success) return;
    throw new Se({ error: g?.error, kind: "INVALID" }, "Save settings");
  } catch (g) {
    const u = g?.response?.data;
    if (u && typeof u.namespace == "string" && typeof u.key == "string")
      return { namespace: u.namespace, key: u.key, error: typeof u.message == "string" ? u.message : String(u.error ?? "") };
    throw Ce(g, "Save settings");
  }
}
const Va = () => Ke(() => re.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Sa = { class: "mail-setting-control" }, Ca = {
  key: 0,
  class: "mail-secret"
}, Ta = {
  key: 1,
  class: "mail-secret"
}, Da = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, Ea = /* @__PURE__ */ ae({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    draft: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(v, { emit: g }) {
    const u = v, M = g, R = (n) => !!n.is_secret || n.value_type === "secret", U = N(() => u.settings.filter((n) => n.editable !== !1).sort((n, y) => (n.order ?? 100) - (y.order ?? 100))), _ = (n) => R(n) ? "" : n.value ?? n.default ?? "", k = $(Object.fromEntries(u.settings.map((n) => [n.key, u.draft?.[n.key] ?? _(n)]))), j = $(Object.fromEntries(u.settings.filter(R).map((n) => [n.key, u.draft?.[n.key] !== void 0])));
    function T(n) {
      j.value[n.key] = !1, k.value[n.key] = "";
    }
    function f(n) {
      const y = k.value[n.key], e = n.schema?.pattern;
      return e && typeof y == "string" && y && !new RegExp(e).test(y) ? "This value does not have the expected form." : "";
    }
    const S = (n) => f(n) || u.errors[n.key] || "";
    Y(k, (n) => {
      const y = {};
      for (const e of u.settings) {
        const x = n[e.key];
        if (R(e)) {
          x && (y[e.key] = x);
          continue;
        }
        x !== _(e) && (y[e.key] = x);
      }
      M("change", y), M("validity", u.settings.every((e) => !f(e)));
    }, { deep: !0, immediate: !0 });
    const A = (n) => (n.schema?.enum ?? []).map((y) => ({ label: String(y), value: y }));
    return (n, y) => (l(), o(Q, null, [
      U.value.length ? p("", !0) : (l(), C(B, {
        key: 0,
        title: "No settings of its own",
        description: "This service is ready once it is chosen."
      })),
      (l(!0), o(Q, null, Ve(U.value, (e) => (l(), C(B, {
        key: e.key,
        title: e.title || e.key,
        description: e.description || void 0,
        class: $e({ "mail-setting-invalid": S(e) })
      }, {
        actions: w(() => [
          d("span", Sa, [
            R(e) ? (l(), o(Q, { key: 0 }, [
              e.has_value && !j.value[e.key] ? (l(), o("span", Ca, [
                r(i(na), {
                  severity: "success",
                  value: "Set",
                  class: "kx-tag-sm"
                }),
                r(i(F), {
                  label: "Replace",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: v.disabled,
                  onClick: (x) => j.value[e.key] = !0
                }, null, 8, ["disabled", "onClick"])
              ])) : (l(), o("span", Ta, [
                r(i(ia), {
                  modelValue: k.value[e.key],
                  "onUpdate:modelValue": (x) => k.value[e.key] = x,
                  "aria-label": e.title || e.key,
                  feedback: !1,
                  "toggle-mask": "",
                  fluid: "",
                  disabled: v.disabled
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
                e.has_value ? (l(), C(i(F), {
                  key: 0,
                  label: "Cancel",
                  severity: "secondary",
                  text: "",
                  size: "small",
                  disabled: v.disabled,
                  onClick: (x) => T(e)
                }, null, 8, ["disabled", "onClick"])) : p("", !0)
              ]))
            ], 64)) : A(e).length ? (l(), C(i(Te), {
              key: 1,
              modelValue: k.value[e.key],
              "onUpdate:modelValue": (x) => k.value[e.key] = x,
              "aria-label": e.title || e.key,
              options: A(e),
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              fluid: "",
              disabled: v.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "options", "disabled"])) : e.value_type === "bool" ? (l(), C(i(oa), {
              key: 2,
              modelValue: k.value[e.key],
              "onUpdate:modelValue": (x) => k.value[e.key] = x,
              "aria-label": e.title || e.key,
              disabled: v.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : e.value_type === "int" ? (l(), C(i(sa), {
              key: 3,
              modelValue: k.value[e.key],
              "onUpdate:modelValue": (x) => k.value[e.key] = x,
              "aria-label": e.title || e.key,
              fluid: "",
              disabled: v.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : (l(), C(i(ee), {
              key: 4,
              modelValue: k.value[e.key],
              "onUpdate:modelValue": (x) => k.value[e.key] = x,
              "aria-label": e.title || e.key,
              fluid: "",
              invalid: !!S(e),
              disabled: v.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "invalid", "disabled"])),
            S(e) ? (l(), o("small", Da, m(S(e)), 1)) : p("", !0)
          ])
        ]),
        _: 2
      }, 1032, ["title", "description", "class"]))), 128))
    ], 64));
  }
}), Ma = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Ra = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, La = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Na = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ua = {
  key: 1,
  class: "mail-outcome",
  role: "status"
}, Ia = {
  key: 0,
  class: "kx-notice info mail-block"
}, ja = {
  key: 1,
  class: "kx-notice error mail-block"
}, Fa = {
  key: 2,
  class: "kx-notice warn mail-block"
}, Oa = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, Ba = ["disabled", "inert"], Aa = { class: "mail-setting-control" }, Pa = {
  key: 0,
  class: "mail-kind"
}, qa = { key: 1 }, za = { class: "mail-kind" }, Ka = {
  key: 0,
  class: "kx-loading mail-driver-state",
  role: "status"
}, Ja = {
  key: 1,
  class: "kx-err inline mail-driver-state",
  role: "alert"
}, Ga = { class: "mail-setting-control" }, Ha = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Wa = { class: "mail-setting-control" }, Ya = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Qa = { class: "mail-setting-control" }, Xa = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Za = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, et = {
  key: 0,
  class: "kx-notice error mail-block"
}, at = {
  key: 1,
  class: "kx-notice mail-block"
}, tt = {
  key: 2,
  class: "kx-notice info mail-block"
}, lt = {
  key: 3,
  class: "kx-notice error mail-block"
}, st = { class: "mail-failure-body" }, it = { class: "kx-modal-head-icon" }, nt = { class: "mail-change-list" }, ot = {
  key: 0,
  class: "mail-outcome",
  role: "status"
}, rt = {
  key: 0,
  class: "kx-notice info mail-block"
}, dt = {
  key: 1,
  class: "kx-notice error mail-block"
}, ut = {
  key: 2,
  class: "kx-notice warn mail-block"
}, ct = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, H = "kickside.mail", vt = /* @__PURE__ */ ae({
  __name: "DeliverySettings",
  setup(v) {
    const g = ze(), u = ["from_address", "from_name", "reply_to"], M = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" }, R = $(!0), U = $(!1), _ = $(""), k = ie(), j = N(() => k.value?.transports ?? []), T = $({ driver: "", from_address: "", from_name: "", reply_to: "" }), f = $({ ...T.value }), S = $({}), A = $(!0), n = $({}), y = $(), e = $();
    function x(t) {
      const a = (s) => {
        const c = t.find((V) => V.key === s);
        return typeof c?.value == "string" ? c.value : "";
      };
      return { driver: a("driver"), from_address: a("from_address"), from_name: a("from_name"), reply_to: a("reply_to") };
    }
    async function de() {
      const [t, a] = await Promise.all([Xe.status(), oe(H)]);
      return k.value = t, x(a);
    }
    async function ue() {
      R.value = !0, _.value = "";
      try {
        T.value = await de(), f.value = { ...T.value }, U.value = !1;
      } catch (t) {
        U.value = Qe(t), _.value = U.value ? "" : G(t, "Delivery settings could not be loaded.");
      } finally {
        R.value = !1;
      }
    }
    qe(ue);
    const D = N(() => j.value.find((t) => t.id === f.value.driver)), q = ie([]), X = $(!1), z = $("");
    Y(() => D.value?.id, async (t, a, s) => {
      const c = D.value;
      if (q.value = [], S.value = {}, A.value = !0, n.value = {}, X.value = !!c, z.value = "", !c) return;
      let V = !0;
      s(() => {
        V = !1;
      });
      try {
        const P = await oe(c.settings_ns);
        V && (q.value = P);
      } catch (P) {
        V && (z.value = G(P, `The ${c.title} settings could not be loaded.`));
      } finally {
        V && (X.value = !1);
      }
    });
    const De = (t) => !!t.is_secret || t.value_type === "secret", ce = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, L = N(() => ({
      from_address: f.value.from_address && !ce.test(f.value.from_address) ? "Enter an email address such as support@example.com." : n.value.from_address ?? "",
      reply_to: f.value.reply_to && !ce.test(f.value.reply_to) ? "Enter an email address, or leave it empty." : n.value.reply_to ?? "",
      from_name: n.value.from_name ?? ""
    }));
    for (const t of u) Y(() => f.value[t], () => {
      if (n.value[t]) {
        const { [t]: a, ...s } = n.value;
        n.value = s;
      }
    });
    const ve = (t) => `${D.value?.title}: ${q.value.find((a) => a.key === t)?.title ?? t}`, O = $(!1);
    Je(() => O.value);
    const Ee = N(() => {
      const t = [];
      f.value.driver !== T.value.driver && t.push(`Service: ${D.value?.title ?? "none"}`);
      for (const a of u) f.value[a] !== T.value[a] && t.push(M[a]);
      for (const a of Object.keys(S.value)) t.push(ve(a));
      return t;
    }), K = N(() => JSON.stringify(f.value) !== JSON.stringify(T.value) || Object.keys(S.value).length > 0);
    Y(K, (t) => g("dirty-change", { dirty: t }), { immediate: !0 });
    const me = N(() => !!L.value.from_address || !!L.value.reply_to || !A.value || X.value || !!z.value), pe = $(0);
    function ye() {
      pe.value++;
    }
    function Me() {
      f.value = { ...T.value }, S.value = {}, n.value = {}, e.value = void 0, ye();
    }
    function Re() {
      const t = [], a = D.value?.settings_ns;
      if (a) for (const [s, c] of Object.entries(S.value))
        t.push({ write: { namespace: a, key: s, value: c === "" ? null : c }, label: ve(s) });
      for (const s of u)
        f.value[s] !== T.value[s] && t.push({ write: { namespace: H, key: s, value: f.value[s] || null }, label: M[s] });
      return f.value.driver !== T.value.driver && t.push({ write: { namespace: H, key: "driver", value: f.value.driver || null }, label: `Service: ${D.value?.title ?? "none"}` }), t;
    }
    function Le(t, a, s) {
      if (t.namespace === H) return (a[t.key] || null) === t.value;
      const c = s.find((V) => V.namespace === t.namespace && V.key === t.key);
      return c ? De(c) ? t.value === null ? !c.has_value : !!c.has_value : (c.value ?? c.default ?? null) === t.value || t.value === null && (c.value ?? null) === (c.default ?? null) : !1;
    }
    async function Ne() {
      if (y.value || me.value) return;
      y.value = "save", _.value = "", n.value = {}, e.value = void 0;
      const t = Re();
      let a, s = "";
      try {
        a = await $a(t.map((c) => c.write));
      } catch (c) {
        s = G(c, "Delivery settings could not be saved.");
      }
      try {
        const c = D.value?.settings_ns, [V, P] = await Promise.all([de(), c ? oe(c) : []]);
        q.value = P;
        const Z = t.filter((h) => !Le(h.write, V, P)), he = { ...V }, _e = {};
        for (const { write: h } of Z)
          h.namespace === H ? he[h.key] = typeof h.value == "string" ? h.value : "" : _e[h.key] = h.value ?? "";
        T.value = V, f.value = he, S.value = _e;
        const se = a && t.find((h) => h.write.namespace === a.namespace && h.write.key === a.key);
        a && (n.value = { [a.key]: a.error }), e.value = {
          saved: t.filter((h) => !Z.includes(h)).map((h) => h.label),
          refused: se ? { label: se.label, reason: a.error } : void 0,
          pending: Z.filter((h) => h !== se).map((h) => h.label)
        }, Z.length || (O.value = !1), ye();
      } catch (c) {
        s = s || G(c, "Delivery settings could not be read back.");
      } finally {
        s && (_.value = s), y.value = void 0;
      }
    }
    async function fe(t) {
      K.value && !await xe.confirm({
        header: "Discard unsaved changes?",
        message: "Your changes to the mail delivery settings are not saved yet.",
        acceptLabel: "Discard changes",
        rejectLabel: "Keep editing",
        acceptClass: "p-button-danger"
      }) || xe.navigate(t);
    }
    const E = ie(), J = $(""), Ue = ea();
    async function ke() {
      const t = E.value?.message_id;
      if (!t) return;
      const a = Ue();
      try {
        const s = await Ze.get(t);
        a() && E.value?.message_id === t && (E.value = s);
      } catch {
      }
    }
    Ge("mail.activity", () => {
      E.value?.status === "queued" && ke();
    });
    async function Ie() {
      y.value = "test", J.value = "", E.value = void 0;
      try {
        const t = await Va();
        E.value = { message_id: t.message_id, status: "queued" }, await ke();
      } catch (t) {
        J.value = G(t, "The test email could not be sent.");
      } finally {
        y.value = void 0;
      }
    }
    const te = N(() => {
      const t = E.value?.last_error;
      if (t)
        return He(t.code, k.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: t.message };
    }), ge = N(() => K.value ? "Save or discard your changes to send a test." : k.value?.configured ? "" : "Finish setting up delivery to send a test."), le = N(() => j.value.map((t) => ({ value: t.id, label: t.title, icon: t.icon, description: t.description }))), be = N(() => {
      const t = k.value;
      if (!(!t || t.configured))
        return t.reason ?? "Choose a delivery service for Mail.";
    });
    return (t, a) => (l(), o("section", Ma, [
      r(We, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: w(() => [
          K.value ? (l(), C(Ye, {
            key: 0,
            busy: y.value === "save",
            "review-disabled": me.value,
            onDiscard: Me,
            onReview: a[0] || (a[0] = (s) => {
              e.value = void 0, O.value = !0;
            })
          }, null, 8, ["busy", "review-disabled"])) : (l(), C(i(F), {
            key: 1,
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: a[1] || (a[1] = (s) => fe("/system/mail"))
          }, {
            icon: w(() => [
              r(i(b), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }))
        ]),
        _: 1
      }),
      R.value ? (l(), o("p", Ra, [
        r(i(b), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        a[12] || (a[12] = I("Loading delivery settings…", -1))
      ])) : U.value ? (l(), o("p", La, [
        r(i(b), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        a[13] || (a[13] = I("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (l(), o(Q, { key: 2 }, [
        _.value ? (l(), o("div", Na, [
          d("span", null, m(_.value), 1),
          j.value.length ? p("", !0) : (l(), C(i(F), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: a[2] || (a[2] = (s) => ue())
          }))
        ])) : p("", !0),
        e.value && !O.value ? (l(), o("div", Ua, [
          e.value.saved.length ? (l(), o("p", Ia, [
            r(i(b), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            d("span", null, "Saved: " + m(e.value.saved.join(", ")) + ".", 1)
          ])) : p("", !0),
          e.value.refused ? (l(), o("p", ja, [
            r(i(b), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            d("span", null, "Not saved: " + m(e.value.refused.label) + ". " + m(e.value.refused.reason), 1)
          ])) : p("", !0),
          e.value.pending.length ? (l(), o("p", Fa, [
            r(i(b), {
              icon: "tabler:clock-pause",
              "aria-hidden": "true"
            }),
            d("span", null, "Still in your draft: " + m(e.value.pending.join(", ")) + ". Correct the value above and save again.", 1)
          ])) : p("", !0)
        ])) : p("", !0),
        be.value && !K.value ? (l(), o("p", Oa, [
          r(i(b), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          d("span", null, [
            a[14] || (a[14] = d("strong", null, "Mail is not set up yet.", -1)),
            I(" " + m(be.value), 1)
          ])
        ])) : p("", !0),
        d("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: y.value === "save",
          inert: y.value === "save" || void 0
        }, [
          r(ne, { title: "Delivery service" }, {
            default: w(() => [
              r(B, {
                title: "Service",
                description: D.value?.reason || D.value?.description || "Choose the service that delivers your email."
              }, {
                actions: w(() => [
                  d("span", Aa, [
                    r(i(Te), {
                      modelValue: f.value.driver,
                      "onUpdate:modelValue": a[3] || (a[3] = (s) => f.value.driver = s),
                      options: le.value,
                      "option-label": "label",
                      "option-value": "value",
                      "append-to": "self",
                      placeholder: "Choose a service…",
                      fluid: "",
                      "aria-label": "Service",
                      "empty-message": "No delivery service is installed"
                    }, {
                      value: w(({ value: s, placeholder: c }) => [
                        s ? (l(), o("span", Pa, [
                          r(i(b), {
                            icon: le.value.find((V) => V.value === s)?.icon ?? "tabler:mail",
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          I(m(le.value.find((V) => V.value === s)?.label ?? s), 1)
                        ])) : (l(), o("span", qa, m(c), 1))
                      ]),
                      option: w(({ option: s }) => [
                        d("span", za, [
                          r(i(b), {
                            icon: s.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          I(m(s.label), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "options"])
                  ])
                ]),
                _: 1
              }, 8, ["description"]),
              X.value ? (l(), o("p", Ka, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                I("Loading " + m(D.value?.title) + " settings…", 1)
              ])) : z.value ? (l(), o("p", Ja, m(z.value), 1)) : D.value ? (l(), C(Ea, {
                key: D.value.id + ":" + pe.value,
                settings: q.value,
                errors: n.value,
                draft: S.value,
                disabled: y.value === "save",
                onChange: a[4] || (a[4] = (s) => S.value = s),
                onValidity: a[5] || (a[5] = (s) => A.value = s)
              }, null, 8, ["settings", "errors", "draft", "disabled"])) : p("", !0)
            ]),
            _: 1
          }),
          r(ne, { title: "Sender" }, {
            default: w(() => [
              r(B, {
                title: "From address",
                description: "The address recipients see and reply to by default. The service must accept mail from it."
              }, {
                actions: w(() => [
                  d("span", Ga, [
                    r(i(ee), {
                      modelValue: f.value.from_address,
                      "onUpdate:modelValue": a[6] || (a[6] = (s) => f.value.from_address = s),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      placeholder: "support@example.com",
                      "aria-label": "From address",
                      invalid: !!L.value.from_address
                    }, null, 8, ["modelValue", "invalid"]),
                    L.value.from_address ? (l(), o("small", Ha, m(L.value.from_address), 1)) : p("", !0)
                  ])
                ]),
                _: 1
              }),
              r(B, {
                title: "From name",
                description: "Shown next to the address, for example your company’s name."
              }, {
                actions: w(() => [
                  d("span", Wa, [
                    r(i(ee), {
                      modelValue: f.value.from_name,
                      "onUpdate:modelValue": a[7] || (a[7] = (s) => f.value.from_name = s),
                      fluid: "",
                      "aria-label": "From name",
                      maxlength: "255",
                      invalid: !!L.value.from_name
                    }, null, 8, ["modelValue", "invalid"]),
                    L.value.from_name ? (l(), o("small", Ya, m(L.value.from_name), 1)) : p("", !0)
                  ])
                ]),
                _: 1
              }),
              r(B, {
                title: "Reply-to",
                description: "Where replies go when it is not the From address. Optional."
              }, {
                actions: w(() => [
                  d("span", Qa, [
                    r(i(ee), {
                      modelValue: f.value.reply_to,
                      "onUpdate:modelValue": a[8] || (a[8] = (s) => f.value.reply_to = s),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      "aria-label": "Reply-to",
                      invalid: !!L.value.reply_to
                    }, null, 8, ["modelValue", "invalid"]),
                    L.value.reply_to ? (l(), o("small", Xa, m(L.value.reply_to), 1)) : p("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 8, Ba),
        r(ne, { title: "Test" }, {
          default: w(() => [
            r(B, {
              title: "Send a test email",
              description: ge.value || "Sends a short message to you with the saved settings."
            }, {
              actions: w(() => [
                r(i(F), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: y.value === "test",
                  disabled: !!ge.value || !!y.value,
                  onClick: Ie
                }, {
                  icon: w(() => [
                    r(i(b), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            }, 8, ["description"]),
            E.value || J.value ? (l(), o("div", Za, [
              J.value ? (l(), o("p", et, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                I(m(J.value), 1)
              ])) : E.value?.status === "queued" ? (l(), o("p", at, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                a[15] || (a[15] = I("Sending the test…", -1))
              ])) : E.value?.status === "sent" ? (l(), o("p", tt, [
                r(i(b), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                a[16] || (a[16] = I("The test was accepted for delivery. Check your inbox.", -1))
              ])) : E.value?.status === "failed" && te.value ? (l(), o("div", lt, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                d("div", st, [
                  d("strong", null, m(te.value.lead), 1),
                  d("span", null, m(te.value.next), 1),
                  r(i(F), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: a[9] || (a[9] = (s) => fe("/system/mail/activity/" + E.value.message_id))
                  })
                ])
              ])) : p("", !0)
            ])) : p("", !0)
          ]),
          _: 1
        })
      ], 64)),
      r(i(la), {
        visible: O.value,
        modal: "",
        draggable: !1,
        closable: y.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": a[11] || (a[11] = (s) => {
          s || (O.value = !1);
        })
      }, {
        header: w(() => [
          d("span", it, [
            r(i(b), {
              icon: "tabler:checklist",
              "aria-hidden": "true"
            })
          ]),
          a[17] || (a[17] = d("span", { class: "kx-modal-head-text" }, [
            d("span", { class: "kx-modal-head-title" }, "Review changes"),
            d("span", { class: "kx-modal-head-sub" }, "Mail delivery")
          ], -1))
        ]),
        footer: w(() => [
          r(i(F), {
            label: e.value ? "Back to the settings" : "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: y.value === "save",
            onClick: a[10] || (a[10] = (s) => O.value = !1)
          }, null, 8, ["label", "disabled"]),
          e.value ? p("", !0) : (l(), C(i(F), {
            key: 0,
            label: "Save",
            loading: y.value === "save",
            onClick: Ne
          }, null, 8, ["loading"]))
        ]),
        default: w(() => [
          d("ul", nt, [
            (l(!0), o(Q, null, Ve(Ee.value, (s) => (l(), o("li", { key: s }, m(s), 1))), 128))
          ]),
          a[18] || (a[18] = d("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          e.value ? (l(), o("div", ot, [
            e.value.saved.length ? (l(), o("p", rt, [
              r(i(b), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              d("span", null, "Saved: " + m(e.value.saved.join(", ")) + ".", 1)
            ])) : p("", !0),
            e.value.refused ? (l(), o("p", dt, [
              r(i(b), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              d("span", null, "Not saved: " + m(e.value.refused.label) + ". " + m(e.value.refused.reason), 1)
            ])) : p("", !0),
            e.value.pending.length ? (l(), o("p", ut, [
              r(i(b), {
                icon: "tabler:clock-pause",
                "aria-hidden": "true"
              }),
              d("span", null, "Still in your draft: " + m(e.value.pending.join(", ")) + ".", 1)
            ])) : p("", !0)
          ])) : p("", !0),
          _.value ? (l(), o("p", ct, m(_.value), 1)) : p("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), mt = aa(vt, { type: "object", properties: { config: { type: "object" } } });
ta(import.meta.url, mt);
//# sourceMappingURL=delivery.js.map
