import { defineComponent as X, useId as Se, openBlock as s, createElementBlock as n, unref as i, createElementVNode as u, toDisplayString as y, createCommentVNode as f, renderSlot as G, useModel as Pe, useSlots as ze, ref as h, watch as Q, normalizeClass as Ve, createVNode as r, createBlock as T, Transition as Je, withCtx as $, withDirectives as qe, vShow as Ge, mergeModels as Ke, computed as C, Fragment as P, renderList as Ce, shallowRef as oe, onMounted as He, createTextVNode as U, resolveDynamicComponent as We } from "vue";
import { c as Ye } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { A as Te, H as De, I as Ee, a as Qe, w as Xe, _ as Ze, n as ea, g as aa, d as W, F as ta, z as la, G as sa } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-DyE7BiXg.js";
import { loadByTagName as ia, api as Z, host as $e, define as na } from "@wippy-fe/proxy";
import { Icon as b } from "@iconify/vue";
import L from "primevue/button";
import oa from "primevue/dialog";
import Y from "primevue/inputtext";
import Ne from "primevue/select";
import ra from "primevue/inputnumber";
import da from "primevue/password";
import ua from "primevue/tag";
import ca from "primevue/toggleswitch";
const va = ["aria-labelledby"], ya = {
  key: 0,
  class: "kx-settings-group-head"
}, fa = ["id"], pa = {
  key: 0,
  class: "kx-settings-group-count"
}, ma = { class: "kx-settings-group-list" }, re = /* @__PURE__ */ X({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(d) {
    const p = Se();
    return (c, N) => (s(), n("section", {
      class: "kx-settings-group",
      "aria-labelledby": d.title ? i(p) : void 0
    }, [
      d.title ? (s(), n("div", ya, [
        u("h2", {
          id: i(p),
          class: "kx-settings-group-title"
        }, y(d.title), 9, fa),
        d.count !== void 0 ? (s(), n("span", pa, y(d.count), 1)) : f("", !0)
      ])) : f("", !0),
      u("div", ma, [
        G(c.$slots, "default")
      ])
    ], 8, va));
  }
}), ka = { class: "kx-settings-item-head" }, ga = { class: "kx-settings-item-main" }, ba = { class: "kx-settings-item-line" }, ha = { class: "kx-settings-item-title" }, _a = {
  key: 0,
  class: "kx-settings-item-desc"
}, xa = {
  key: 1,
  class: "kx-settings-item-meta"
}, wa = { class: "kx-settings-item-actions" }, $a = ["aria-expanded", "aria-controls", "aria-label"], Sa = ["id", "inert"], Va = { class: "kx-settings-item-clip" }, Ca = { class: "kx-settings-item-body" }, B = /* @__PURE__ */ X({
  __name: "SettingsItem",
  props: /* @__PURE__ */ Ke({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(d) {
    const p = d, c = Pe(d, "open"), N = ze(), O = Se(), M = h(c.value);
    return Q(c, (x) => {
      x && (M.value = !0);
    }), (x, k) => (s(), n("article", {
      class: Ve(["kx-settings-item", { "kx-settings-item-open": c.value && i(N).default }])
    }, [
      u("div", ka, [
        u("div", ga, [
          u("div", ba, [
            u("h3", ha, y(d.title), 1),
            G(x.$slots, "status")
          ]),
          d.description ? (s(), n("p", _a, y(d.description), 1)) : f("", !0),
          i(N).meta ? (s(), n("p", xa, [
            G(x.$slots, "meta")
          ])) : f("", !0)
        ]),
        u("div", wa, [
          i(N).default ? (s(), n("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": c.value,
            "aria-controls": i(O),
            "aria-label": (d.expandLabel || "Details") + " " + d.title,
            onClick: k[0] || (k[0] = (j) => c.value = !c.value)
          }, [
            u("span", null, y(d.expandLabel || "Details"), 1),
            r(i(b), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, $a)) : f("", !0),
          G(x.$slots, "actions")
        ])
      ]),
      i(N).default ? (s(), T(Je, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: $(() => [
          M.value || p.keepMounted ? qe((s(), n("div", {
            key: 0,
            id: i(O),
            inert: !c.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Va, [
              u("div", Ca, [
                G(x.$slots, "default")
              ])
            ])
          ], 8, Sa)), [
            [Ge, c.value]
          ]) : f("", !0)
        ]),
        _: 3
      })) : f("", !0)
    ], 2));
  }
}), de = /* @__PURE__ */ new Map();
function Ta(d) {
  let p = de.get(d);
  return p || (p = Promise.resolve(ia(d)).then(() => !0, () => (de.delete(d), !1)), de.set(d, p)), p;
}
const Da = () => Ee(() => Z.get("/api/v1/mail/delivery/drivers"), "Delivery services").then((d) => d.items);
async function Ea(d) {
  try {
    const { data: p } = await Z.get("/api/v1/settings", { params: { namespace: d } });
    if (p?.success && Array.isArray(p.settings)) return p.settings.filter((c) => c.namespace === d);
    throw new Te({ error: p?.error, kind: "INTERNAL" }, "Settings");
  } catch (p) {
    throw De(p, "Settings");
  }
}
async function Na(d) {
  try {
    const { data: p } = await Z.put("/api/v1/settings", { values: d });
    if (p?.success) return;
    throw new Te({ error: p?.error, kind: "INVALID" }, "Save settings");
  } catch (p) {
    const c = p?.response?.data;
    if (c && typeof c.namespace == "string" && typeof c.key == "string")
      return { namespace: c.namespace, key: c.key, error: typeof c.message == "string" ? c.message : String(c.error ?? "") };
    throw De(p, "Save settings");
  }
}
const Oa = () => Ee(() => Z.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Ma = { class: "mail-setting-control" }, Ra = {
  key: 0,
  class: "mail-secret"
}, ja = {
  key: 1,
  class: "mail-secret"
}, Ua = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, Ia = /* @__PURE__ */ X({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    draft: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(d, { emit: p }) {
    const c = d, N = p, O = (o) => !!o.is_secret || o.value_type === "secret", M = C(() => c.settings.filter((o) => o.editable !== !1).sort((o, v) => (o.order ?? 100) - (v.order ?? 100))), x = (o) => O(o) ? "" : o.value ?? o.default ?? "", k = h(Object.fromEntries(c.settings.map((o) => [o.key, c.draft?.[o.key] ?? x(o)]))), j = h(Object.fromEntries(c.settings.filter(O).map((o) => [o.key, c.draft?.[o.key] !== void 0])));
    function D(o) {
      j.value[o.key] = !1, k.value[o.key] = "";
    }
    function m(o) {
      const v = k.value[o.key], t = o.schema?.pattern;
      return t && typeof v == "string" && v && !new RegExp(t).test(v) ? "This value does not have the expected form." : "";
    }
    const S = (o) => m(o) || c.errors[o.key] || "";
    Q(k, (o) => {
      const v = {};
      for (const t of c.settings) {
        const w = o[t.key];
        if (O(t)) {
          w && (v[t.key] = w);
          continue;
        }
        w !== x(t) && (v[t.key] = w);
      }
      N("change", v), N("validity", c.settings.every((t) => !m(t)));
    }, { deep: !0 });
    const F = (o) => (o.schema?.enum ?? []).map((v) => ({ label: String(v), value: v }));
    return (o, v) => (s(), n(P, null, [
      M.value.length ? f("", !0) : (s(), T(B, {
        key: 0,
        title: "No settings of its own",
        description: "This service is ready once it is chosen."
      })),
      (s(!0), n(P, null, Ce(M.value, (t) => (s(), T(B, {
        key: t.key,
        title: t.title || t.key,
        description: t.description || void 0,
        class: Ve({ "mail-setting-invalid": S(t) })
      }, {
        actions: $(() => [
          u("span", Ma, [
            O(t) ? (s(), n(P, { key: 0 }, [
              t.has_value && !j.value[t.key] ? (s(), n("span", Ra, [
                r(i(ua), {
                  severity: "success",
                  value: "Set",
                  class: "kx-tag-sm"
                }),
                r(i(L), {
                  label: "Replace",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: d.disabled,
                  onClick: (w) => j.value[t.key] = !0
                }, null, 8, ["disabled", "onClick"])
              ])) : (s(), n("span", ja, [
                r(i(da), {
                  modelValue: k.value[t.key],
                  "onUpdate:modelValue": (w) => k.value[t.key] = w,
                  "aria-label": t.title || t.key,
                  feedback: !1,
                  "toggle-mask": "",
                  fluid: "",
                  disabled: d.disabled
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
                t.has_value ? (s(), T(i(L), {
                  key: 0,
                  label: "Cancel",
                  severity: "secondary",
                  text: "",
                  size: "small",
                  disabled: d.disabled,
                  onClick: (w) => D(t)
                }, null, 8, ["disabled", "onClick"])) : f("", !0)
              ]))
            ], 64)) : F(t).length ? (s(), T(i(Ne), {
              key: 1,
              modelValue: k.value[t.key],
              "onUpdate:modelValue": (w) => k.value[t.key] = w,
              "aria-label": t.title || t.key,
              options: F(t),
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              fluid: "",
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "options", "disabled"])) : t.value_type === "bool" ? (s(), T(i(ca), {
              key: 2,
              modelValue: k.value[t.key],
              "onUpdate:modelValue": (w) => k.value[t.key] = w,
              "aria-label": t.title || t.key,
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : t.value_type === "int" ? (s(), T(i(ra), {
              key: 3,
              modelValue: k.value[t.key],
              "onUpdate:modelValue": (w) => k.value[t.key] = w,
              "aria-label": t.title || t.key,
              fluid: "",
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : (s(), T(i(Y), {
              key: 4,
              modelValue: k.value[t.key],
              "onUpdate:modelValue": (w) => k.value[t.key] = w,
              "aria-label": t.title || t.key,
              fluid: "",
              invalid: !!S(t),
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "invalid", "disabled"])),
            S(t) ? (s(), n("small", Ua, y(S(t)), 1)) : f("", !0)
          ])
        ]),
        _: 2
      }, 1032, ["title", "description", "class"]))), 128))
    ], 64));
  }
}), La = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Fa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Aa = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Ba = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Pa = {
  key: 1,
  class: "mail-outcome",
  role: "status"
}, za = {
  key: 0,
  class: "kx-notice info mail-block"
}, Ja = {
  key: 1,
  class: "kx-notice error mail-block"
}, qa = {
  key: 2,
  class: "kx-notice warn mail-block"
}, Ga = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, Ka = ["disabled", "inert"], Ha = { class: "mail-setting-control" }, Wa = {
  key: 0,
  class: "mail-kind"
}, Ya = { key: 1 }, Qa = { class: "mail-kind" }, Xa = {
  key: 0,
  class: "kx-loading mail-driver-state",
  role: "status"
}, Za = {
  key: 1,
  class: "kx-err inline mail-driver-state",
  role: "alert"
}, et = { class: "mail-setting-control" }, at = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, tt = { class: "mail-setting-control" }, lt = { class: "mail-setting-control" }, st = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, it = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, nt = {
  key: 0,
  class: "kx-notice error mail-block"
}, ot = {
  key: 1,
  class: "kx-notice mail-block"
}, rt = {
  key: 2,
  class: "kx-notice info mail-block"
}, dt = {
  key: 3,
  class: "kx-notice error mail-block"
}, ut = { class: "mail-failure-body" }, ct = { class: "kx-modal-head-icon" }, vt = { class: "mail-change-list" }, yt = {
  key: 0,
  class: "mail-outcome",
  role: "status"
}, ft = {
  key: 0,
  class: "kx-notice info mail-block"
}, pt = {
  key: 1,
  class: "kx-notice error mail-block"
}, mt = {
  key: 2,
  class: "kx-notice warn mail-block"
}, kt = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, q = "kickside.mail", gt = /* @__PURE__ */ X({
  __name: "DeliverySettings",
  setup(d) {
    const p = Ye(), c = ["from_address", "from_name", "reply_to"], N = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" }, O = h(!0), M = h(!1), x = h(""), k = oe([]), j = oe(), D = h({ driver: "", from_address: "", from_name: "", reply_to: "" }), m = h({ ...D.value }), S = h({}), F = h(!0), o = h({}), v = h(), t = h();
    function w(e) {
      const a = (l) => {
        const g = e.find((R) => R.key === l);
        return typeof g?.value == "string" ? g.value : "";
      };
      return { driver: a("driver"), from_address: a("from_address"), from_name: a("from_name"), reply_to: a("reply_to") };
    }
    async function ue() {
      const [e, a, l] = await Promise.all([Da(), ta.status(), Ea(q)]);
      return k.value = e, j.value = a, w(l);
    }
    async function ce() {
      O.value = !0, x.value = "";
      try {
        D.value = await ue(), m.value = { ...D.value }, M.value = !1;
      } catch (e) {
        M.value = aa(e), x.value = M.value ? "" : W(e, "Delivery settings could not be loaded.");
      } finally {
        O.value = !1;
      }
    }
    He(ce);
    const V = C(() => k.value.find((e) => e.id === m.value.driver)), K = C(() => V.value?.settings ?? []), ee = h(!1), ae = h(!1), H = h("");
    Q(() => V.value?.id, async () => {
      const e = V.value;
      if (S.value = {}, F.value = !0, o.value = {}, ee.value = !1, ae.value = !!e?.settings_view, H.value = "", !e?.settings_view) return;
      const a = await Ta(e.settings_view);
      V.value?.id === e.id && (ee.value = a, ae.value = !1, a || (H.value = `The ${e.label} settings could not be loaded. Reload the page to try again.`));
    });
    const te = (e) => !!e.is_secret || e.value_type === "secret", Oe = C(() => JSON.stringify(Object.fromEntries(K.value.filter((e) => !te(e)).map((e) => [e.key, e.value ?? e.default ?? null])))), Me = C(() => JSON.stringify(Object.fromEntries(K.value.filter(te).map((e) => [e.key, !!e.has_value])))), Re = C(() => JSON.stringify(o.value)), ve = h("{}");
    function ye(e, a) {
      const l = e.detail;
      a === "change" && l?.values && typeof l.values == "object" && (S.value = { ...l.values }), a === "validity" && typeof l?.valid == "boolean" && (F.value = l.valid);
    }
    const fe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, I = C(() => ({
      from_address: m.value.from_address && !fe.test(m.value.from_address) ? "Enter an email address such as support@example.com." : o.value.from_address ?? "",
      reply_to: m.value.reply_to && !fe.test(m.value.reply_to) ? "Enter an email address, or leave it empty." : o.value.reply_to ?? ""
    })), pe = (e) => `${V.value?.label}: ${K.value.find((a) => a.key === e)?.title ?? e}`, A = h(!1);
    Qe(() => A.value);
    const je = C(() => {
      const e = [];
      m.value.driver !== D.value.driver && e.push(`Service: ${V.value?.label ?? "none"}`);
      for (const a of c) m.value[a] !== D.value[a] && e.push(N[a]);
      for (const a of Object.keys(S.value)) e.push(pe(a));
      return e;
    }), z = C(() => JSON.stringify(m.value) !== JSON.stringify(D.value) || Object.keys(S.value).length > 0);
    Q(z, (e) => p("dirty-change", { dirty: e }), { immediate: !0 });
    const me = C(() => !!I.value.from_address || !!I.value.reply_to || !F.value), le = h(0);
    function ke() {
      ve.value = JSON.stringify(S.value), le.value++;
    }
    function Ue() {
      m.value = { ...D.value }, S.value = {}, o.value = {}, t.value = void 0, ke();
    }
    function Ie() {
      const e = [], a = V.value?.settings_ns;
      if (a) for (const [l, g] of Object.entries(S.value))
        e.push({ write: { namespace: a, key: l, value: g === "" ? null : g }, label: pe(l) });
      for (const l of c)
        m.value[l] !== D.value[l] && e.push({ write: { namespace: q, key: l, value: m.value[l] || null }, label: N[l] });
      return m.value.driver !== D.value.driver && e.push({ write: { namespace: q, key: "driver", value: m.value.driver || null }, label: `Service: ${V.value?.label ?? "none"}` }), e;
    }
    function Le(e, a) {
      if (e.namespace === q) return (a[e.key] || null) === e.value;
      const l = k.value.find((g) => g.settings_ns === e.namespace)?.settings.find((g) => g.key === e.key);
      return l ? te(l) ? e.value === null ? !l.has_value : !!l.has_value : (l.value ?? l.default ?? null) === e.value || e.value === null && (l.value ?? null) === (l.default ?? null) : !1;
    }
    async function Fe() {
      if (v.value || me.value) return;
      v.value = "save", x.value = "", o.value = {}, t.value = void 0;
      const e = Ie();
      let a, l = "";
      try {
        a = await Na(e.map((g) => g.write));
      } catch (g) {
        l = W(g, "Delivery settings could not be saved.");
      }
      try {
        const g = await ue(), R = e.filter((_) => !Le(_.write, g)), xe = { ...g }, we = {};
        for (const { write: _ } of R)
          _.namespace === q ? xe[_.key] = typeof _.value == "string" ? _.value : "" : we[_.key] = _.value ?? "";
        D.value = g, m.value = xe, S.value = we;
        const ne = a && e.find((_) => _.write.namespace === a.namespace && _.write.key === a.key);
        a && (o.value = { [a.key]: a.error }), t.value = {
          saved: e.filter((_) => !R.includes(_)).map((_) => _.label),
          refused: ne ? { label: ne.label, reason: a.error } : void 0,
          pending: R.filter((_) => _ !== ne).map((_) => _.label)
        }, R.length || (A.value = !1), ke();
      } catch (g) {
        l = l || W(g, "Delivery settings could not be read back.");
      } finally {
        l && (x.value = l), v.value = void 0;
      }
    }
    async function ge(e) {
      z.value && !await $e.confirm({
        header: "Discard unsaved changes?",
        message: "Your changes to the mail delivery settings are not saved yet.",
        acceptLabel: "Discard changes",
        rejectLabel: "Keep editing",
        acceptClass: "p-button-danger"
      }) || $e.navigate(e);
    }
    const E = oe(), J = h("");
    async function be() {
      if (E.value)
        try {
          E.value = await la.get(E.value.message_id);
        } catch {
        }
    }
    Xe((e) => {
      e.message_id === E.value?.message_id && be();
    });
    async function Ae() {
      v.value = "test", J.value = "", E.value = void 0;
      try {
        const e = await Oa();
        E.value = { message_id: e.message_id, status: "queued" }, await be();
      } catch (e) {
        J.value = W(e, "The test email could not be sent.");
      } finally {
        v.value = void 0;
      }
    }
    const Be = /* @__PURE__ */ new Set(["invalid_config", "credentials_invalid", "provider_endpoint_invalid", "settings_read_failed"]), se = C(() => {
      const e = E.value?.last_error;
      if (e)
        return e.code === "credentials_invalid" ? { lead: `${j.value?.driver?.label ?? "The service"} refused the credentials.`, next: "Check the API key above, save, and send the test again." } : Be.has(e.code) ? { lead: "The delivery settings are not complete.", next: "Check the settings above, save, and send the test again." } : { lead: "The service did not accept the test.", next: e.message };
    }), he = C(() => z.value ? "Save or discard your changes to send a test." : j.value?.configured ? "" : "Finish setting up delivery to send a test."), ie = C(() => k.value.map((e) => ({ value: e.id, label: e.label, icon: e.icon, description: e.description }))), _e = C(() => {
      const e = j.value;
      if (!(!e || e.configured))
        return e.reason ?? "Choose a delivery service for Mail.";
    });
    return (e, a) => (s(), n("section", La, [
      r(Ze, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: $(() => [
          z.value ? (s(), T(ea, {
            key: 0,
            busy: v.value === "save",
            "review-disabled": me.value,
            onDiscard: Ue,
            onReview: a[0] || (a[0] = (l) => {
              t.value = void 0, A.value = !0;
            })
          }, null, 8, ["busy", "review-disabled"])) : (s(), T(i(L), {
            key: 1,
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: a[1] || (a[1] = (l) => ge("/system/mail"))
          }, {
            icon: $(() => [
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
      O.value ? (s(), n("p", Fa, [
        r(i(b), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        a[14] || (a[14] = U("Loading delivery settings…", -1))
      ])) : M.value ? (s(), n("p", Aa, [
        r(i(b), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        a[15] || (a[15] = U("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (s(), n(P, { key: 2 }, [
        x.value ? (s(), n("div", Ba, [
          u("span", null, y(x.value), 1),
          k.value.length ? f("", !0) : (s(), T(i(L), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: a[2] || (a[2] = (l) => ce())
          }))
        ])) : f("", !0),
        t.value && !A.value ? (s(), n("div", Pa, [
          t.value.saved.length ? (s(), n("p", za, [
            r(i(b), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            u("span", null, "Saved: " + y(t.value.saved.join(", ")) + ".", 1)
          ])) : f("", !0),
          t.value.refused ? (s(), n("p", Ja, [
            r(i(b), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            u("span", null, "Not saved: " + y(t.value.refused.label) + ". " + y(t.value.refused.reason), 1)
          ])) : f("", !0),
          t.value.pending.length ? (s(), n("p", qa, [
            r(i(b), {
              icon: "tabler:clock-pause",
              "aria-hidden": "true"
            }),
            u("span", null, "Still in your draft: " + y(t.value.pending.join(", ")) + ". Correct the value above and save again.", 1)
          ])) : f("", !0)
        ])) : f("", !0),
        _e.value && !z.value ? (s(), n("p", Ga, [
          r(i(b), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            a[16] || (a[16] = u("strong", null, "Mail is not set up yet.", -1)),
            U(" " + y(_e.value), 1)
          ])
        ])) : f("", !0),
        u("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: v.value === "save",
          inert: v.value === "save" || void 0
        }, [
          r(re, { title: "Delivery service" }, {
            default: $(() => [
              r(B, {
                title: "Service",
                description: V.value?.description || "Choose the service that delivers your email."
              }, {
                actions: $(() => [
                  u("span", Ha, [
                    r(i(Ne), {
                      modelValue: m.value.driver,
                      "onUpdate:modelValue": a[3] || (a[3] = (l) => m.value.driver = l),
                      options: ie.value,
                      "option-label": "label",
                      "option-value": "value",
                      "append-to": "self",
                      placeholder: "Choose a service…",
                      fluid: "",
                      "aria-label": "Service",
                      "empty-message": "No delivery service is installed"
                    }, {
                      value: $(({ value: l, placeholder: g }) => [
                        l ? (s(), n("span", Wa, [
                          r(i(b), {
                            icon: ie.value.find((R) => R.value === l)?.icon ?? "tabler:mail",
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U(y(ie.value.find((R) => R.value === l)?.label ?? l), 1)
                        ])) : (s(), n("span", Ya, y(g), 1))
                      ]),
                      option: $(({ option: l }) => [
                        u("span", Qa, [
                          r(i(b), {
                            icon: l.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U(y(l.label), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "options"])
                  ])
                ]),
                _: 1
              }, 8, ["description"]),
              ae.value ? (s(), n("p", Xa, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                U("Loading " + y(V.value?.label) + " settings…", 1)
              ])) : H.value ? (s(), n("p", Za, y(H.value), 1)) : V.value ? (s(), n(P, { key: 2 }, [
                V.value.settings_view && ee.value ? (s(), T(We(V.value.settings_view), {
                  key: V.value.id + ":" + le.value,
                  class: "mail-driver-view",
                  "^values": Oe.value,
                  "^secrets": Me.value,
                  "^errors": Re.value,
                  "^draft": ve.value,
                  "^disabled": String(v.value === "save"),
                  onChange: a[4] || (a[4] = (l) => ye(l, "change")),
                  onValidity: a[5] || (a[5] = (l) => ye(l, "validity"))
                }, null, 40, ["^values", "^secrets", "^errors", "^draft", "^disabled"])) : (s(), T(Ia, {
                  key: V.value.id + ":" + le.value,
                  settings: K.value,
                  errors: o.value,
                  draft: S.value,
                  disabled: v.value === "save",
                  onChange: a[6] || (a[6] = (l) => S.value = l),
                  onValidity: a[7] || (a[7] = (l) => F.value = l)
                }, null, 8, ["settings", "errors", "draft", "disabled"]))
              ], 64)) : f("", !0)
            ]),
            _: 1
          }),
          r(re, { title: "Sender" }, {
            default: $(() => [
              r(B, {
                title: "From address",
                description: "The address recipients see and reply to by default. The service must accept mail from it."
              }, {
                actions: $(() => [
                  u("span", et, [
                    r(i(Y), {
                      modelValue: m.value.from_address,
                      "onUpdate:modelValue": a[8] || (a[8] = (l) => m.value.from_address = l),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      placeholder: "support@example.com",
                      "aria-label": "From address",
                      invalid: !!I.value.from_address
                    }, null, 8, ["modelValue", "invalid"]),
                    I.value.from_address ? (s(), n("small", at, y(I.value.from_address), 1)) : f("", !0)
                  ])
                ]),
                _: 1
              }),
              r(B, {
                title: "From name",
                description: "Shown next to the address, for example your company’s name."
              }, {
                actions: $(() => [
                  u("span", tt, [
                    r(i(Y), {
                      modelValue: m.value.from_name,
                      "onUpdate:modelValue": a[9] || (a[9] = (l) => m.value.from_name = l),
                      fluid: "",
                      "aria-label": "From name"
                    }, null, 8, ["modelValue"])
                  ])
                ]),
                _: 1
              }),
              r(B, {
                title: "Reply-to",
                description: "Where replies go when it is not the From address. Optional."
              }, {
                actions: $(() => [
                  u("span", lt, [
                    r(i(Y), {
                      modelValue: m.value.reply_to,
                      "onUpdate:modelValue": a[10] || (a[10] = (l) => m.value.reply_to = l),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      "aria-label": "Reply-to",
                      invalid: !!I.value.reply_to
                    }, null, 8, ["modelValue", "invalid"]),
                    I.value.reply_to ? (s(), n("small", st, y(I.value.reply_to), 1)) : f("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 8, Ka),
        r(re, { title: "Test" }, {
          default: $(() => [
            r(B, {
              title: "Send a test email",
              description: he.value || "Sends a short message to you with the saved settings."
            }, {
              actions: $(() => [
                r(i(L), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: v.value === "test",
                  disabled: !!he.value || !!v.value,
                  onClick: Ae
                }, {
                  icon: $(() => [
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
            E.value || J.value ? (s(), n("div", it, [
              J.value ? (s(), n("p", nt, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                U(y(J.value), 1)
              ])) : E.value?.status === "queued" ? (s(), n("p", ot, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                a[17] || (a[17] = U("Sending the test…", -1))
              ])) : E.value?.status === "sent" ? (s(), n("p", rt, [
                r(i(b), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                a[18] || (a[18] = U("The test was accepted for delivery. Check your inbox.", -1))
              ])) : E.value?.status === "failed" && se.value ? (s(), n("div", dt, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", ut, [
                  u("strong", null, y(se.value.lead), 1),
                  u("span", null, y(se.value.next), 1),
                  r(i(L), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: a[11] || (a[11] = (l) => ge("/system/mail/activity/" + E.value.message_id))
                  })
                ])
              ])) : f("", !0)
            ])) : f("", !0)
          ]),
          _: 1
        })
      ], 64)),
      r(i(oa), {
        visible: A.value,
        modal: "",
        draggable: !1,
        closable: v.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": a[13] || (a[13] = (l) => {
          l || (A.value = !1);
        })
      }, {
        header: $(() => [
          u("span", ct, [
            r(i(b), {
              icon: "tabler:checklist",
              "aria-hidden": "true"
            })
          ]),
          a[19] || (a[19] = u("span", { class: "kx-modal-head-text" }, [
            u("span", { class: "kx-modal-head-title" }, "Review changes"),
            u("span", { class: "kx-modal-head-sub" }, "Mail delivery")
          ], -1))
        ]),
        footer: $(() => [
          r(i(L), {
            label: t.value ? "Back to the settings" : "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: v.value === "save",
            onClick: a[12] || (a[12] = (l) => A.value = !1)
          }, null, 8, ["label", "disabled"]),
          t.value ? f("", !0) : (s(), T(i(L), {
            key: 0,
            label: "Save",
            loading: v.value === "save",
            onClick: Fe
          }, null, 8, ["loading"]))
        ]),
        default: $(() => [
          u("ul", vt, [
            (s(!0), n(P, null, Ce(je.value, (l) => (s(), n("li", { key: l }, y(l), 1))), 128))
          ]),
          a[20] || (a[20] = u("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          t.value ? (s(), n("div", yt, [
            t.value.saved.length ? (s(), n("p", ft, [
              r(i(b), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              u("span", null, "Saved: " + y(t.value.saved.join(", ")) + ".", 1)
            ])) : f("", !0),
            t.value.refused ? (s(), n("p", pt, [
              r(i(b), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              u("span", null, "Not saved: " + y(t.value.refused.label) + ". " + y(t.value.refused.reason), 1)
            ])) : f("", !0),
            t.value.pending.length ? (s(), n("p", mt, [
              r(i(b), {
                icon: "tabler:clock-pause",
                "aria-hidden": "true"
              }),
              u("span", null, "Still in your draft: " + y(t.value.pending.join(", ")) + ".", 1)
            ])) : f("", !0)
          ])) : f("", !0),
          x.value ? (s(), n("p", kt, y(x.value), 1)) : f("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), bt = sa(gt, { type: "object", properties: { config: { type: "object" } } });
na(import.meta.url, bt);
//# sourceMappingURL=delivery.js.map
