import { defineComponent as X, useId as Se, openBlock as s, createElementBlock as o, unref as i, createElementVNode as u, toDisplayString as m, createCommentVNode as f, renderSlot as K, useModel as Je, useSlots as Pe, ref as h, watch as G, normalizeClass as Ve, createVNode as r, createBlock as T, Transition as qe, withCtx as $, withDirectives as ze, vShow as Ke, mergeModels as Ge, computed as C, Fragment as J, renderList as Ce, shallowRef as oe, onMounted as He, createTextVNode as I, resolveDynamicComponent as We } from "vue";
import { c as Ye } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { A as Te, J as De, K as Ee, a as Qe, u as Xe, z as Ze, _ as ea, q as aa, i as la, d as Y, H as ta, D as sa, h as ia, I as na } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-Bw84NwTO.js";
import { loadByTagName as oa, api as Z, host as $e, define as ra } from "@wippy-fe/proxy";
import { Icon as b } from "@iconify/vue";
import L from "primevue/button";
import da from "primevue/dialog";
import Q from "primevue/inputtext";
import Ne from "primevue/select";
import ua from "primevue/inputnumber";
import ca from "primevue/password";
import va from "primevue/tag";
import ma from "primevue/toggleswitch";
const fa = ["aria-labelledby"], ya = {
  key: 0,
  class: "kx-settings-group-head"
}, pa = ["id"], ka = {
  key: 0,
  class: "kx-settings-group-count"
}, ga = { class: "kx-settings-group-list" }, re = /* @__PURE__ */ X({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(d) {
    const p = Se();
    return (c, N) => (s(), o("section", {
      class: "kx-settings-group",
      "aria-labelledby": d.title ? i(p) : void 0
    }, [
      d.title ? (s(), o("div", ya, [
        u("h2", {
          id: i(p),
          class: "kx-settings-group-title"
        }, m(d.title), 9, pa),
        d.count !== void 0 ? (s(), o("span", ka, m(d.count), 1)) : f("", !0)
      ])) : f("", !0),
      u("div", ga, [
        K(c.$slots, "default")
      ])
    ], 8, fa));
  }
}), ba = { class: "kx-settings-item-head" }, ha = { class: "kx-settings-item-main" }, _a = { class: "kx-settings-item-line" }, xa = { class: "kx-settings-item-title" }, wa = {
  key: 0,
  class: "kx-settings-item-desc"
}, $a = {
  key: 1,
  class: "kx-settings-item-meta"
}, Sa = { class: "kx-settings-item-actions" }, Va = ["aria-expanded", "aria-controls", "aria-label"], Ca = ["id", "inert"], Ta = { class: "kx-settings-item-clip" }, Da = { class: "kx-settings-item-body" }, A = /* @__PURE__ */ X({
  __name: "SettingsItem",
  props: /* @__PURE__ */ Ge({
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
    const p = d, c = Je(d, "open"), N = Pe(), O = Se(), M = h(c.value);
    return G(c, (x) => {
      x && (M.value = !0);
    }), (x, k) => (s(), o("article", {
      class: Ve(["kx-settings-item", { "kx-settings-item-open": c.value && i(N).default }])
    }, [
      u("div", ba, [
        u("div", ha, [
          u("div", _a, [
            u("h3", xa, m(d.title), 1),
            K(x.$slots, "status")
          ]),
          d.description ? (s(), o("p", wa, m(d.description), 1)) : f("", !0),
          i(N).meta ? (s(), o("p", $a, [
            K(x.$slots, "meta")
          ])) : f("", !0)
        ]),
        u("div", Sa, [
          i(N).default ? (s(), o("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": c.value,
            "aria-controls": i(O),
            "aria-label": (d.expandLabel || "Details") + " " + d.title,
            onClick: k[0] || (k[0] = (U) => c.value = !c.value)
          }, [
            u("span", null, m(d.expandLabel || "Details"), 1),
            r(i(b), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Va)) : f("", !0),
          K(x.$slots, "actions")
        ])
      ]),
      i(N).default ? (s(), T(qe, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: $(() => [
          M.value || p.keepMounted ? ze((s(), o("div", {
            key: 0,
            id: i(O),
            inert: !c.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Ta, [
              u("div", Da, [
                K(x.$slots, "default")
              ])
            ])
          ], 8, Ca)), [
            [Ke, c.value]
          ]) : f("", !0)
        ]),
        _: 3
      })) : f("", !0)
    ], 2));
  }
}), de = /* @__PURE__ */ new Map();
function Ea(d) {
  let p = de.get(d);
  return p || (p = Promise.resolve(oa(d)).then(() => !0, () => (de.delete(d), !1)), de.set(d, p)), p;
}
const Na = () => Ee(() => Z.get("/api/v1/mail/delivery/drivers"), "Delivery services").then((d) => d.items);
async function Oa(d) {
  try {
    const { data: p } = await Z.get("/api/v1/settings", { params: { namespace: d } });
    if (p?.success && Array.isArray(p.settings)) return p.settings.filter((c) => c.namespace === d);
    throw new Te({ error: p?.error, kind: "INTERNAL" }, "Settings");
  } catch (p) {
    throw De(p, "Settings");
  }
}
async function Ra(d) {
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
const Ma = () => Ee(() => Z.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), ja = { class: "mail-setting-control" }, Ua = {
  key: 0,
  class: "mail-secret"
}, Ia = {
  key: 1,
  class: "mail-secret"
}, La = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, Fa = /* @__PURE__ */ X({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    draft: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(d, { emit: p }) {
    const c = d, N = p, O = (n) => !!n.is_secret || n.value_type === "secret", M = C(() => c.settings.filter((n) => n.editable !== !1).sort((n, v) => (n.order ?? 100) - (v.order ?? 100))), x = (n) => O(n) ? "" : n.value ?? n.default ?? "", k = h(Object.fromEntries(c.settings.map((n) => [n.key, c.draft?.[n.key] ?? x(n)]))), U = h(Object.fromEntries(c.settings.filter(O).map((n) => [n.key, c.draft?.[n.key] !== void 0])));
    function D(n) {
      U.value[n.key] = !1, k.value[n.key] = "";
    }
    function y(n) {
      const v = k.value[n.key], l = n.schema?.pattern;
      return l && typeof v == "string" && v && !new RegExp(l).test(v) ? "This value does not have the expected form." : "";
    }
    const S = (n) => y(n) || c.errors[n.key] || "";
    G(k, (n) => {
      const v = {};
      for (const l of c.settings) {
        const w = n[l.key];
        if (O(l)) {
          w && (v[l.key] = w);
          continue;
        }
        w !== x(l) && (v[l.key] = w);
      }
      N("change", v), N("validity", c.settings.every((l) => !y(l)));
    }, { deep: !0 });
    const F = (n) => (n.schema?.enum ?? []).map((v) => ({ label: String(v), value: v }));
    return (n, v) => (s(), o(J, null, [
      M.value.length ? f("", !0) : (s(), T(A, {
        key: 0,
        title: "No settings of its own",
        description: "This service is ready once it is chosen."
      })),
      (s(!0), o(J, null, Ce(M.value, (l) => (s(), T(A, {
        key: l.key,
        title: l.title || l.key,
        description: l.description || void 0,
        class: Ve({ "mail-setting-invalid": S(l) })
      }, {
        actions: $(() => [
          u("span", ja, [
            O(l) ? (s(), o(J, { key: 0 }, [
              l.has_value && !U.value[l.key] ? (s(), o("span", Ua, [
                r(i(va), {
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
                  onClick: (w) => U.value[l.key] = !0
                }, null, 8, ["disabled", "onClick"])
              ])) : (s(), o("span", Ia, [
                r(i(ca), {
                  modelValue: k.value[l.key],
                  "onUpdate:modelValue": (w) => k.value[l.key] = w,
                  "aria-label": l.title || l.key,
                  feedback: !1,
                  "toggle-mask": "",
                  fluid: "",
                  disabled: d.disabled
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
                l.has_value ? (s(), T(i(L), {
                  key: 0,
                  label: "Cancel",
                  severity: "secondary",
                  text: "",
                  size: "small",
                  disabled: d.disabled,
                  onClick: (w) => D(l)
                }, null, 8, ["disabled", "onClick"])) : f("", !0)
              ]))
            ], 64)) : F(l).length ? (s(), T(i(Ne), {
              key: 1,
              modelValue: k.value[l.key],
              "onUpdate:modelValue": (w) => k.value[l.key] = w,
              "aria-label": l.title || l.key,
              options: F(l),
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              fluid: "",
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "options", "disabled"])) : l.value_type === "bool" ? (s(), T(i(ma), {
              key: 2,
              modelValue: k.value[l.key],
              "onUpdate:modelValue": (w) => k.value[l.key] = w,
              "aria-label": l.title || l.key,
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : l.value_type === "int" ? (s(), T(i(ua), {
              key: 3,
              modelValue: k.value[l.key],
              "onUpdate:modelValue": (w) => k.value[l.key] = w,
              "aria-label": l.title || l.key,
              fluid: "",
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : (s(), T(i(Q), {
              key: 4,
              modelValue: k.value[l.key],
              "onUpdate:modelValue": (w) => k.value[l.key] = w,
              "aria-label": l.title || l.key,
              fluid: "",
              invalid: !!S(l),
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "invalid", "disabled"])),
            S(l) ? (s(), o("small", La, m(S(l)), 1)) : f("", !0)
          ])
        ]),
        _: 2
      }, 1032, ["title", "description", "class"]))), 128))
    ], 64));
  }
}), Ba = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Aa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ja = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Pa = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, qa = {
  key: 1,
  class: "mail-outcome",
  role: "status"
}, za = {
  key: 0,
  class: "kx-notice info mail-block"
}, Ka = {
  key: 1,
  class: "kx-notice error mail-block"
}, Ga = {
  key: 2,
  class: "kx-notice warn mail-block"
}, Ha = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, Wa = ["disabled", "inert"], Ya = { class: "mail-setting-control" }, Qa = {
  key: 0,
  class: "mail-kind"
}, Xa = { key: 1 }, Za = { class: "mail-kind" }, el = {
  key: 0,
  class: "kx-loading mail-driver-state",
  role: "status"
}, al = {
  key: 1,
  class: "kx-err inline mail-driver-state",
  role: "alert"
}, ll = { class: "mail-setting-control" }, tl = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, sl = { class: "mail-setting-control" }, il = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, nl = { class: "mail-setting-control" }, ol = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, rl = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, dl = {
  key: 0,
  class: "kx-notice error mail-block"
}, ul = {
  key: 1,
  class: "kx-notice mail-block"
}, cl = {
  key: 2,
  class: "kx-notice info mail-block"
}, vl = {
  key: 3,
  class: "kx-notice error mail-block"
}, ml = { class: "mail-failure-body" }, fl = { class: "kx-modal-head-icon" }, yl = { class: "mail-change-list" }, pl = {
  key: 0,
  class: "mail-outcome",
  role: "status"
}, kl = {
  key: 0,
  class: "kx-notice info mail-block"
}, gl = {
  key: 1,
  class: "kx-notice error mail-block"
}, bl = {
  key: 2,
  class: "kx-notice warn mail-block"
}, hl = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, z = "kickside.mail", _l = /* @__PURE__ */ X({
  __name: "DeliverySettings",
  setup(d) {
    const p = Ye(), c = ["from_address", "from_name", "reply_to"], N = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" }, O = h(!0), M = h(!1), x = h(""), k = oe([]), U = oe(), D = h({ driver: "", from_address: "", from_name: "", reply_to: "" }), y = h({ ...D.value }), S = h({}), F = h(!0), n = h({}), v = h(), l = h();
    function w(e) {
      const a = (t) => {
        const g = e.find((j) => j.key === t);
        return typeof g?.value == "string" ? g.value : "";
      };
      return { driver: a("driver"), from_address: a("from_address"), from_name: a("from_name"), reply_to: a("reply_to") };
    }
    async function ue() {
      const [e, a, t] = await Promise.all([Na(), ta.status(), Oa(z)]);
      return k.value = e, U.value = a, w(t);
    }
    async function ce() {
      O.value = !0, x.value = "";
      try {
        D.value = await ue(), y.value = { ...D.value }, M.value = !1;
      } catch (e) {
        M.value = la(e), x.value = M.value ? "" : Y(e, "Delivery settings could not be loaded.");
      } finally {
        O.value = !1;
      }
    }
    He(ce);
    const V = C(() => k.value.find((e) => e.id === y.value.driver)), H = C(() => V.value?.settings ?? []), ee = h(!1), ae = h(!1), W = h("");
    G(() => V.value?.id, async () => {
      const e = V.value;
      if (S.value = {}, F.value = !0, n.value = {}, ee.value = !1, ae.value = !!e?.settings_view, W.value = "", !e?.settings_view) return;
      const a = await Ea(e.settings_view);
      V.value?.id === e.id && (ee.value = a, ae.value = !1, a || (W.value = `The ${e.label} settings could not be loaded. Reload the page to try again.`));
    });
    const le = (e) => !!e.is_secret || e.value_type === "secret", Oe = C(() => JSON.stringify(Object.fromEntries(H.value.filter((e) => !le(e)).map((e) => [e.key, e.value ?? e.default ?? null])))), Re = C(() => JSON.stringify(Object.fromEntries(H.value.filter(le).map((e) => [e.key, !!e.has_value])))), Me = C(() => JSON.stringify(n.value)), ve = h("{}");
    function me(e, a) {
      const t = e.detail;
      a === "change" && t?.values && typeof t.values == "object" && (S.value = { ...t.values }), a === "validity" && typeof t?.valid == "boolean" && (F.value = t.valid);
    }
    const fe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, R = C(() => ({
      from_address: y.value.from_address && !fe.test(y.value.from_address) ? "Enter an email address such as support@example.com." : n.value.from_address ?? "",
      reply_to: y.value.reply_to && !fe.test(y.value.reply_to) ? "Enter an email address, or leave it empty." : n.value.reply_to ?? "",
      from_name: n.value.from_name ?? ""
    }));
    for (const e of c) G(() => y.value[e], () => {
      if (n.value[e]) {
        const { [e]: a, ...t } = n.value;
        n.value = t;
      }
    });
    const ye = (e) => `${V.value?.label}: ${H.value.find((a) => a.key === e)?.title ?? e}`, B = h(!1);
    Qe(() => B.value);
    const je = C(() => {
      const e = [];
      y.value.driver !== D.value.driver && e.push(`Service: ${V.value?.label ?? "none"}`);
      for (const a of c) y.value[a] !== D.value[a] && e.push(N[a]);
      for (const a of Object.keys(S.value)) e.push(ye(a));
      return e;
    }), P = C(() => JSON.stringify(y.value) !== JSON.stringify(D.value) || Object.keys(S.value).length > 0);
    G(P, (e) => p("dirty-change", { dirty: e }), { immediate: !0 });
    const pe = C(() => !!R.value.from_address || !!R.value.reply_to || !F.value), te = h(0);
    function ke() {
      ve.value = JSON.stringify(S.value), te.value++;
    }
    function Ue() {
      y.value = { ...D.value }, S.value = {}, n.value = {}, l.value = void 0, ke();
    }
    function Ie() {
      const e = [], a = V.value?.settings_ns;
      if (a) for (const [t, g] of Object.entries(S.value))
        e.push({ write: { namespace: a, key: t, value: g === "" ? null : g }, label: ye(t) });
      for (const t of c)
        y.value[t] !== D.value[t] && e.push({ write: { namespace: z, key: t, value: y.value[t] || null }, label: N[t] });
      return y.value.driver !== D.value.driver && e.push({ write: { namespace: z, key: "driver", value: y.value.driver || null }, label: `Service: ${V.value?.label ?? "none"}` }), e;
    }
    function Le(e, a) {
      if (e.namespace === z) return (a[e.key] || null) === e.value;
      const t = k.value.find((g) => g.settings_ns === e.namespace)?.settings.find((g) => g.key === e.key);
      return t ? le(t) ? e.value === null ? !t.has_value : !!t.has_value : (t.value ?? t.default ?? null) === e.value || e.value === null && (t.value ?? null) === (t.default ?? null) : !1;
    }
    async function Fe() {
      if (v.value || pe.value) return;
      v.value = "save", x.value = "", n.value = {}, l.value = void 0;
      const e = Ie();
      let a, t = "";
      try {
        a = await Ra(e.map((g) => g.write));
      } catch (g) {
        t = Y(g, "Delivery settings could not be saved.");
      }
      try {
        const g = await ue(), j = e.filter((_) => !Le(_.write, g)), xe = { ...g }, we = {};
        for (const { write: _ } of j)
          _.namespace === z ? xe[_.key] = typeof _.value == "string" ? _.value : "" : we[_.key] = _.value ?? "";
        D.value = g, y.value = xe, S.value = we;
        const ne = a && e.find((_) => _.write.namespace === a.namespace && _.write.key === a.key);
        a && (n.value = { [a.key]: a.error }), l.value = {
          saved: e.filter((_) => !j.includes(_)).map((_) => _.label),
          refused: ne ? { label: ne.label, reason: a.error } : void 0,
          pending: j.filter((_) => _ !== ne).map((_) => _.label)
        }, j.length || (B.value = !1), ke();
      } catch (g) {
        t = t || Y(g, "Delivery settings could not be read back.");
      } finally {
        t && (x.value = t), v.value = void 0;
      }
    }
    async function ge(e) {
      P.value && !await $e.confirm({
        header: "Discard unsaved changes?",
        message: "Your changes to the mail delivery settings are not saved yet.",
        acceptLabel: "Discard changes",
        rejectLabel: "Keep editing",
        acceptClass: "p-button-danger"
      }) || $e.navigate(e);
    }
    const E = oe(), q = h(""), Be = ia();
    async function be() {
      const e = E.value?.message_id;
      if (!e) return;
      const a = Be();
      try {
        const t = await sa.get(e);
        a() && E.value?.message_id === e && (E.value = t);
      } catch {
      }
    }
    Xe("mail.activity", () => {
      E.value?.status === "queued" && be();
    });
    async function Ae() {
      v.value = "test", q.value = "", E.value = void 0;
      try {
        const e = await Ma();
        E.value = { message_id: e.message_id, status: "queued" }, await be();
      } catch (e) {
        q.value = Y(e, "The test email could not be sent.");
      } finally {
        v.value = void 0;
      }
    }
    const se = C(() => {
      const e = E.value?.last_error;
      if (e)
        return Ze(e.code, U.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), he = C(() => P.value ? "Save or discard your changes to send a test." : U.value?.configured ? "" : "Finish setting up delivery to send a test."), ie = C(() => k.value.map((e) => ({ value: e.id, label: e.label, icon: e.icon, description: e.description }))), _e = C(() => {
      const e = U.value;
      if (!(!e || e.configured))
        return e.reason ?? "Choose a delivery service for Mail.";
    });
    return (e, a) => (s(), o("section", Ba, [
      r(ea, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: $(() => [
          P.value ? (s(), T(aa, {
            key: 0,
            busy: v.value === "save",
            "review-disabled": pe.value,
            onDiscard: Ue,
            onReview: a[0] || (a[0] = (t) => {
              l.value = void 0, B.value = !0;
            })
          }, null, 8, ["busy", "review-disabled"])) : (s(), T(i(L), {
            key: 1,
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: a[1] || (a[1] = (t) => ge("/system/mail"))
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
      O.value ? (s(), o("p", Aa, [
        r(i(b), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        a[14] || (a[14] = I("Loading delivery settings…", -1))
      ])) : M.value ? (s(), o("p", Ja, [
        r(i(b), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        a[15] || (a[15] = I("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (s(), o(J, { key: 2 }, [
        x.value ? (s(), o("div", Pa, [
          u("span", null, m(x.value), 1),
          k.value.length ? f("", !0) : (s(), T(i(L), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: a[2] || (a[2] = (t) => ce())
          }))
        ])) : f("", !0),
        l.value && !B.value ? (s(), o("div", qa, [
          l.value.saved.length ? (s(), o("p", za, [
            r(i(b), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            u("span", null, "Saved: " + m(l.value.saved.join(", ")) + ".", 1)
          ])) : f("", !0),
          l.value.refused ? (s(), o("p", Ka, [
            r(i(b), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            u("span", null, "Not saved: " + m(l.value.refused.label) + ". " + m(l.value.refused.reason), 1)
          ])) : f("", !0),
          l.value.pending.length ? (s(), o("p", Ga, [
            r(i(b), {
              icon: "tabler:clock-pause",
              "aria-hidden": "true"
            }),
            u("span", null, "Still in your draft: " + m(l.value.pending.join(", ")) + ". Correct the value above and save again.", 1)
          ])) : f("", !0)
        ])) : f("", !0),
        _e.value && !P.value ? (s(), o("p", Ha, [
          r(i(b), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            a[16] || (a[16] = u("strong", null, "Mail is not set up yet.", -1)),
            I(" " + m(_e.value), 1)
          ])
        ])) : f("", !0),
        u("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: v.value === "save",
          inert: v.value === "save" || void 0
        }, [
          r(re, { title: "Delivery service" }, {
            default: $(() => [
              r(A, {
                title: "Service",
                description: V.value?.description || "Choose the service that delivers your email."
              }, {
                actions: $(() => [
                  u("span", Ya, [
                    r(i(Ne), {
                      modelValue: y.value.driver,
                      "onUpdate:modelValue": a[3] || (a[3] = (t) => y.value.driver = t),
                      options: ie.value,
                      "option-label": "label",
                      "option-value": "value",
                      "append-to": "self",
                      placeholder: "Choose a service…",
                      fluid: "",
                      "aria-label": "Service",
                      "empty-message": "No delivery service is installed"
                    }, {
                      value: $(({ value: t, placeholder: g }) => [
                        t ? (s(), o("span", Qa, [
                          r(i(b), {
                            icon: ie.value.find((j) => j.value === t)?.icon ?? "tabler:mail",
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          I(m(ie.value.find((j) => j.value === t)?.label ?? t), 1)
                        ])) : (s(), o("span", Xa, m(g), 1))
                      ]),
                      option: $(({ option: t }) => [
                        u("span", Za, [
                          r(i(b), {
                            icon: t.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          I(m(t.label), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "options"])
                  ])
                ]),
                _: 1
              }, 8, ["description"]),
              ae.value ? (s(), o("p", el, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                I("Loading " + m(V.value?.label) + " settings…", 1)
              ])) : W.value ? (s(), o("p", al, m(W.value), 1)) : V.value ? (s(), o(J, { key: 2 }, [
                V.value.settings_view && ee.value ? (s(), T(We(V.value.settings_view), {
                  key: V.value.id + ":" + te.value,
                  class: "mail-driver-view",
                  "^values": Oe.value,
                  "^secrets": Re.value,
                  "^errors": Me.value,
                  "^draft": ve.value,
                  "^disabled": String(v.value === "save"),
                  onChange: a[4] || (a[4] = (t) => me(t, "change")),
                  onValidity: a[5] || (a[5] = (t) => me(t, "validity"))
                }, null, 40, ["^values", "^secrets", "^errors", "^draft", "^disabled"])) : (s(), T(Fa, {
                  key: V.value.id + ":" + te.value,
                  settings: H.value,
                  errors: n.value,
                  draft: S.value,
                  disabled: v.value === "save",
                  onChange: a[6] || (a[6] = (t) => S.value = t),
                  onValidity: a[7] || (a[7] = (t) => F.value = t)
                }, null, 8, ["settings", "errors", "draft", "disabled"]))
              ], 64)) : f("", !0)
            ]),
            _: 1
          }),
          r(re, { title: "Sender" }, {
            default: $(() => [
              r(A, {
                title: "From address",
                description: "The address recipients see and reply to by default. The service must accept mail from it."
              }, {
                actions: $(() => [
                  u("span", ll, [
                    r(i(Q), {
                      modelValue: y.value.from_address,
                      "onUpdate:modelValue": a[8] || (a[8] = (t) => y.value.from_address = t),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      placeholder: "support@example.com",
                      "aria-label": "From address",
                      invalid: !!R.value.from_address
                    }, null, 8, ["modelValue", "invalid"]),
                    R.value.from_address ? (s(), o("small", tl, m(R.value.from_address), 1)) : f("", !0)
                  ])
                ]),
                _: 1
              }),
              r(A, {
                title: "From name",
                description: "Shown next to the address, for example your company’s name."
              }, {
                actions: $(() => [
                  u("span", sl, [
                    r(i(Q), {
                      modelValue: y.value.from_name,
                      "onUpdate:modelValue": a[9] || (a[9] = (t) => y.value.from_name = t),
                      fluid: "",
                      "aria-label": "From name",
                      maxlength: "255",
                      invalid: !!R.value.from_name
                    }, null, 8, ["modelValue", "invalid"]),
                    R.value.from_name ? (s(), o("small", il, m(R.value.from_name), 1)) : f("", !0)
                  ])
                ]),
                _: 1
              }),
              r(A, {
                title: "Reply-to",
                description: "Where replies go when it is not the From address. Optional."
              }, {
                actions: $(() => [
                  u("span", nl, [
                    r(i(Q), {
                      modelValue: y.value.reply_to,
                      "onUpdate:modelValue": a[10] || (a[10] = (t) => y.value.reply_to = t),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      "aria-label": "Reply-to",
                      invalid: !!R.value.reply_to
                    }, null, 8, ["modelValue", "invalid"]),
                    R.value.reply_to ? (s(), o("small", ol, m(R.value.reply_to), 1)) : f("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 8, Wa),
        r(re, { title: "Test" }, {
          default: $(() => [
            r(A, {
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
            E.value || q.value ? (s(), o("div", rl, [
              q.value ? (s(), o("p", dl, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                I(m(q.value), 1)
              ])) : E.value?.status === "queued" ? (s(), o("p", ul, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                a[17] || (a[17] = I("Sending the test…", -1))
              ])) : E.value?.status === "sent" ? (s(), o("p", cl, [
                r(i(b), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                a[18] || (a[18] = I("The test was accepted for delivery. Check your inbox.", -1))
              ])) : E.value?.status === "failed" && se.value ? (s(), o("div", vl, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", ml, [
                  u("strong", null, m(se.value.lead), 1),
                  u("span", null, m(se.value.next), 1),
                  r(i(L), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: a[11] || (a[11] = (t) => ge("/system/mail/activity/" + E.value.message_id))
                  })
                ])
              ])) : f("", !0)
            ])) : f("", !0)
          ]),
          _: 1
        })
      ], 64)),
      r(i(da), {
        visible: B.value,
        modal: "",
        draggable: !1,
        closable: v.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": a[13] || (a[13] = (t) => {
          t || (B.value = !1);
        })
      }, {
        header: $(() => [
          u("span", fl, [
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
            label: l.value ? "Back to the settings" : "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: v.value === "save",
            onClick: a[12] || (a[12] = (t) => B.value = !1)
          }, null, 8, ["label", "disabled"]),
          l.value ? f("", !0) : (s(), T(i(L), {
            key: 0,
            label: "Save",
            loading: v.value === "save",
            onClick: Fe
          }, null, 8, ["loading"]))
        ]),
        default: $(() => [
          u("ul", yl, [
            (s(!0), o(J, null, Ce(je.value, (t) => (s(), o("li", { key: t }, m(t), 1))), 128))
          ]),
          a[20] || (a[20] = u("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          l.value ? (s(), o("div", pl, [
            l.value.saved.length ? (s(), o("p", kl, [
              r(i(b), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              u("span", null, "Saved: " + m(l.value.saved.join(", ")) + ".", 1)
            ])) : f("", !0),
            l.value.refused ? (s(), o("p", gl, [
              r(i(b), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              u("span", null, "Not saved: " + m(l.value.refused.label) + ". " + m(l.value.refused.reason), 1)
            ])) : f("", !0),
            l.value.pending.length ? (s(), o("p", bl, [
              r(i(b), {
                icon: "tabler:clock-pause",
                "aria-hidden": "true"
              }),
              u("span", null, "Still in your draft: " + m(l.value.pending.join(", ")) + ".", 1)
            ])) : f("", !0)
          ])) : f("", !0),
          x.value ? (s(), o("p", hl, m(x.value), 1)) : f("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), xl = na(_l, { type: "object", properties: { config: { type: "object" } } });
ra(import.meta.url, xl);
//# sourceMappingURL=delivery.js.map
