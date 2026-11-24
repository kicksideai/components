import { defineComponent as X, useId as Se, openBlock as s, createElementBlock as o, unref as i, createElementVNode as u, toDisplayString as m, createCommentVNode as y, renderSlot as K, useModel as Ae, useSlots as Je, ref as h, watch as G, normalizeClass as Ve, createVNode as r, createBlock as T, Transition as Pe, withCtx as $, withDirectives as ze, vShow as qe, mergeModels as Ke, computed as C, Fragment as J, renderList as Ce, shallowRef as oe, onMounted as Ge, createTextVNode as U, resolveDynamicComponent as He } from "vue";
import { c as We } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { A as Te, K as De, L as Ee, a as Ye, z as Qe, y as Xe, _ as Ze, q as ea, h as aa, d as Y, I as la, D as ta, J as sa } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-Boigvu4O.js";
import { loadByTagName as ia, api as Z, host as $e, define as na } from "@wippy-fe/proxy";
import { Icon as b } from "@iconify/vue";
import I from "primevue/button";
import oa from "primevue/dialog";
import Q from "primevue/inputtext";
import Ne from "primevue/select";
import ra from "primevue/inputnumber";
import da from "primevue/password";
import ua from "primevue/tag";
import va from "primevue/toggleswitch";
const ca = ["aria-labelledby"], ma = {
  key: 0,
  class: "kx-settings-group-head"
}, ya = ["id"], fa = {
  key: 0,
  class: "kx-settings-group-count"
}, pa = { class: "kx-settings-group-list" }, re = /* @__PURE__ */ X({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(d) {
    const p = Se();
    return (v, N) => (s(), o("section", {
      class: "kx-settings-group",
      "aria-labelledby": d.title ? i(p) : void 0
    }, [
      d.title ? (s(), o("div", ma, [
        u("h2", {
          id: i(p),
          class: "kx-settings-group-title"
        }, m(d.title), 9, ya),
        d.count !== void 0 ? (s(), o("span", fa, m(d.count), 1)) : y("", !0)
      ])) : y("", !0),
      u("div", pa, [
        K(v.$slots, "default")
      ])
    ], 8, ca));
  }
}), ka = { class: "kx-settings-item-head" }, ga = { class: "kx-settings-item-main" }, ba = { class: "kx-settings-item-line" }, ha = { class: "kx-settings-item-title" }, _a = {
  key: 0,
  class: "kx-settings-item-desc"
}, xa = {
  key: 1,
  class: "kx-settings-item-meta"
}, wa = { class: "kx-settings-item-actions" }, $a = ["aria-expanded", "aria-controls", "aria-label"], Sa = ["id", "inert"], Va = { class: "kx-settings-item-clip" }, Ca = { class: "kx-settings-item-body" }, A = /* @__PURE__ */ X({
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
    const p = d, v = Ae(d, "open"), N = Je(), O = Se(), R = h(v.value);
    return G(v, (x) => {
      x && (R.value = !0);
    }), (x, k) => (s(), o("article", {
      class: Ve(["kx-settings-item", { "kx-settings-item-open": v.value && i(N).default }])
    }, [
      u("div", ka, [
        u("div", ga, [
          u("div", ba, [
            u("h3", ha, m(d.title), 1),
            K(x.$slots, "status")
          ]),
          d.description ? (s(), o("p", _a, m(d.description), 1)) : y("", !0),
          i(N).meta ? (s(), o("p", xa, [
            K(x.$slots, "meta")
          ])) : y("", !0)
        ]),
        u("div", wa, [
          i(N).default ? (s(), o("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": v.value,
            "aria-controls": i(O),
            "aria-label": (d.expandLabel || "Details") + " " + d.title,
            onClick: k[0] || (k[0] = (L) => v.value = !v.value)
          }, [
            u("span", null, m(d.expandLabel || "Details"), 1),
            r(i(b), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, $a)) : y("", !0),
          K(x.$slots, "actions")
        ])
      ]),
      i(N).default ? (s(), T(Pe, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: $(() => [
          R.value || p.keepMounted ? ze((s(), o("div", {
            key: 0,
            id: i(O),
            inert: !v.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Va, [
              u("div", Ca, [
                K(x.$slots, "default")
              ])
            ])
          ], 8, Sa)), [
            [qe, v.value]
          ]) : y("", !0)
        ]),
        _: 3
      })) : y("", !0)
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
    if (p?.success && Array.isArray(p.settings)) return p.settings.filter((v) => v.namespace === d);
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
    const v = p?.response?.data;
    if (v && typeof v.namespace == "string" && typeof v.key == "string")
      return { namespace: v.namespace, key: v.key, error: typeof v.message == "string" ? v.message : String(v.error ?? "") };
    throw De(p, "Save settings");
  }
}
const Oa = () => Ee(() => Z.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Ma = { class: "mail-setting-control" }, Ra = {
  key: 0,
  class: "mail-secret"
}, ja = {
  key: 1,
  class: "mail-secret"
}, La = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, Ua = /* @__PURE__ */ X({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    draft: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(d, { emit: p }) {
    const v = d, N = p, O = (n) => !!n.is_secret || n.value_type === "secret", R = C(() => v.settings.filter((n) => n.editable !== !1).sort((n, c) => (n.order ?? 100) - (c.order ?? 100))), x = (n) => O(n) ? "" : n.value ?? n.default ?? "", k = h(Object.fromEntries(v.settings.map((n) => [n.key, v.draft?.[n.key] ?? x(n)]))), L = h(Object.fromEntries(v.settings.filter(O).map((n) => [n.key, v.draft?.[n.key] !== void 0])));
    function D(n) {
      L.value[n.key] = !1, k.value[n.key] = "";
    }
    function f(n) {
      const c = k.value[n.key], l = n.schema?.pattern;
      return l && typeof c == "string" && c && !new RegExp(l).test(c) ? "This value does not have the expected form." : "";
    }
    const S = (n) => f(n) || v.errors[n.key] || "";
    G(k, (n) => {
      const c = {};
      for (const l of v.settings) {
        const w = n[l.key];
        if (O(l)) {
          w && (c[l.key] = w);
          continue;
        }
        w !== x(l) && (c[l.key] = w);
      }
      N("change", c), N("validity", v.settings.every((l) => !f(l)));
    }, { deep: !0 });
    const F = (n) => (n.schema?.enum ?? []).map((c) => ({ label: String(c), value: c }));
    return (n, c) => (s(), o(J, null, [
      R.value.length ? y("", !0) : (s(), T(A, {
        key: 0,
        title: "No settings of its own",
        description: "This service is ready once it is chosen."
      })),
      (s(!0), o(J, null, Ce(R.value, (l) => (s(), T(A, {
        key: l.key,
        title: l.title || l.key,
        description: l.description || void 0,
        class: Ve({ "mail-setting-invalid": S(l) })
      }, {
        actions: $(() => [
          u("span", Ma, [
            O(l) ? (s(), o(J, { key: 0 }, [
              l.has_value && !L.value[l.key] ? (s(), o("span", Ra, [
                r(i(ua), {
                  severity: "success",
                  value: "Set",
                  class: "kx-tag-sm"
                }),
                r(i(I), {
                  label: "Replace",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: d.disabled,
                  onClick: (w) => L.value[l.key] = !0
                }, null, 8, ["disabled", "onClick"])
              ])) : (s(), o("span", ja, [
                r(i(da), {
                  modelValue: k.value[l.key],
                  "onUpdate:modelValue": (w) => k.value[l.key] = w,
                  "aria-label": l.title || l.key,
                  feedback: !1,
                  "toggle-mask": "",
                  fluid: "",
                  disabled: d.disabled
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
                l.has_value ? (s(), T(i(I), {
                  key: 0,
                  label: "Cancel",
                  severity: "secondary",
                  text: "",
                  size: "small",
                  disabled: d.disabled,
                  onClick: (w) => D(l)
                }, null, 8, ["disabled", "onClick"])) : y("", !0)
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
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "options", "disabled"])) : l.value_type === "bool" ? (s(), T(i(va), {
              key: 2,
              modelValue: k.value[l.key],
              "onUpdate:modelValue": (w) => k.value[l.key] = w,
              "aria-label": l.title || l.key,
              disabled: d.disabled
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"])) : l.value_type === "int" ? (s(), T(i(ra), {
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
            S(l) ? (s(), o("small", La, m(S(l)), 1)) : y("", !0)
          ])
        ]),
        _: 2
      }, 1032, ["title", "description", "class"]))), 128))
    ], 64));
  }
}), Ia = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Fa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ba = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Aa = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ja = {
  key: 1,
  class: "mail-outcome",
  role: "status"
}, Pa = {
  key: 0,
  class: "kx-notice info mail-block"
}, za = {
  key: 1,
  class: "kx-notice error mail-block"
}, qa = {
  key: 2,
  class: "kx-notice warn mail-block"
}, Ka = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, Ga = ["disabled", "inert"], Ha = { class: "mail-setting-control" }, Wa = {
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
}, el = { class: "mail-setting-control" }, al = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, ll = { class: "mail-setting-control" }, tl = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, sl = { class: "mail-setting-control" }, il = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, nl = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, ol = {
  key: 0,
  class: "kx-notice error mail-block"
}, rl = {
  key: 1,
  class: "kx-notice mail-block"
}, dl = {
  key: 2,
  class: "kx-notice info mail-block"
}, ul = {
  key: 3,
  class: "kx-notice error mail-block"
}, vl = { class: "mail-failure-body" }, cl = { class: "kx-modal-head-icon" }, ml = { class: "mail-change-list" }, yl = {
  key: 0,
  class: "mail-outcome",
  role: "status"
}, fl = {
  key: 0,
  class: "kx-notice info mail-block"
}, pl = {
  key: 1,
  class: "kx-notice error mail-block"
}, kl = {
  key: 2,
  class: "kx-notice warn mail-block"
}, gl = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, q = "kickside.mail", bl = /* @__PURE__ */ X({
  __name: "DeliverySettings",
  setup(d) {
    const p = We(), v = ["from_address", "from_name", "reply_to"], N = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" }, O = h(!0), R = h(!1), x = h(""), k = oe([]), L = oe(), D = h({ driver: "", from_address: "", from_name: "", reply_to: "" }), f = h({ ...D.value }), S = h({}), F = h(!0), n = h({}), c = h(), l = h();
    function w(e) {
      const a = (t) => {
        const g = e.find((j) => j.key === t);
        return typeof g?.value == "string" ? g.value : "";
      };
      return { driver: a("driver"), from_address: a("from_address"), from_name: a("from_name"), reply_to: a("reply_to") };
    }
    async function ue() {
      const [e, a, t] = await Promise.all([Da(), la.status(), Ea(q)]);
      return k.value = e, L.value = a, w(t);
    }
    async function ve() {
      O.value = !0, x.value = "";
      try {
        D.value = await ue(), f.value = { ...D.value }, R.value = !1;
      } catch (e) {
        R.value = aa(e), x.value = R.value ? "" : Y(e, "Delivery settings could not be loaded.");
      } finally {
        O.value = !1;
      }
    }
    Ge(ve);
    const V = C(() => k.value.find((e) => e.id === f.value.driver)), H = C(() => V.value?.settings ?? []), ee = h(!1), ae = h(!1), W = h("");
    G(() => V.value?.id, async () => {
      const e = V.value;
      if (S.value = {}, F.value = !0, n.value = {}, ee.value = !1, ae.value = !!e?.settings_view, W.value = "", !e?.settings_view) return;
      const a = await Ta(e.settings_view);
      V.value?.id === e.id && (ee.value = a, ae.value = !1, a || (W.value = `The ${e.label} settings could not be loaded. Reload the page to try again.`));
    });
    const le = (e) => !!e.is_secret || e.value_type === "secret", Oe = C(() => JSON.stringify(Object.fromEntries(H.value.filter((e) => !le(e)).map((e) => [e.key, e.value ?? e.default ?? null])))), Me = C(() => JSON.stringify(Object.fromEntries(H.value.filter(le).map((e) => [e.key, !!e.has_value])))), Re = C(() => JSON.stringify(n.value)), ce = h("{}");
    function me(e, a) {
      const t = e.detail;
      a === "change" && t?.values && typeof t.values == "object" && (S.value = { ...t.values }), a === "validity" && typeof t?.valid == "boolean" && (F.value = t.valid);
    }
    const ye = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, M = C(() => ({
      from_address: f.value.from_address && !ye.test(f.value.from_address) ? "Enter an email address such as support@example.com." : n.value.from_address ?? "",
      reply_to: f.value.reply_to && !ye.test(f.value.reply_to) ? "Enter an email address, or leave it empty." : n.value.reply_to ?? "",
      from_name: n.value.from_name ?? ""
    }));
    for (const e of v) G(() => f.value[e], () => {
      if (n.value[e]) {
        const { [e]: a, ...t } = n.value;
        n.value = t;
      }
    });
    const fe = (e) => `${V.value?.label}: ${H.value.find((a) => a.key === e)?.title ?? e}`, B = h(!1);
    Ye(() => B.value);
    const je = C(() => {
      const e = [];
      f.value.driver !== D.value.driver && e.push(`Service: ${V.value?.label ?? "none"}`);
      for (const a of v) f.value[a] !== D.value[a] && e.push(N[a]);
      for (const a of Object.keys(S.value)) e.push(fe(a));
      return e;
    }), P = C(() => JSON.stringify(f.value) !== JSON.stringify(D.value) || Object.keys(S.value).length > 0);
    G(P, (e) => p("dirty-change", { dirty: e }), { immediate: !0 });
    const pe = C(() => !!M.value.from_address || !!M.value.reply_to || !F.value), te = h(0);
    function ke() {
      ce.value = JSON.stringify(S.value), te.value++;
    }
    function Le() {
      f.value = { ...D.value }, S.value = {}, n.value = {}, l.value = void 0, ke();
    }
    function Ue() {
      const e = [], a = V.value?.settings_ns;
      if (a) for (const [t, g] of Object.entries(S.value))
        e.push({ write: { namespace: a, key: t, value: g === "" ? null : g }, label: fe(t) });
      for (const t of v)
        f.value[t] !== D.value[t] && e.push({ write: { namespace: q, key: t, value: f.value[t] || null }, label: N[t] });
      return f.value.driver !== D.value.driver && e.push({ write: { namespace: q, key: "driver", value: f.value.driver || null }, label: `Service: ${V.value?.label ?? "none"}` }), e;
    }
    function Ie(e, a) {
      if (e.namespace === q) return (a[e.key] || null) === e.value;
      const t = k.value.find((g) => g.settings_ns === e.namespace)?.settings.find((g) => g.key === e.key);
      return t ? le(t) ? e.value === null ? !t.has_value : !!t.has_value : (t.value ?? t.default ?? null) === e.value || e.value === null && (t.value ?? null) === (t.default ?? null) : !1;
    }
    async function Fe() {
      if (c.value || pe.value) return;
      c.value = "save", x.value = "", n.value = {}, l.value = void 0;
      const e = Ue();
      let a, t = "";
      try {
        a = await Na(e.map((g) => g.write));
      } catch (g) {
        t = Y(g, "Delivery settings could not be saved.");
      }
      try {
        const g = await ue(), j = e.filter((_) => !Ie(_.write, g)), xe = { ...g }, we = {};
        for (const { write: _ } of j)
          _.namespace === q ? xe[_.key] = typeof _.value == "string" ? _.value : "" : we[_.key] = _.value ?? "";
        D.value = g, f.value = xe, S.value = we;
        const ne = a && e.find((_) => _.write.namespace === a.namespace && _.write.key === a.key);
        a && (n.value = { [a.key]: a.error }), l.value = {
          saved: e.filter((_) => !j.includes(_)).map((_) => _.label),
          refused: ne ? { label: ne.label, reason: a.error } : void 0,
          pending: j.filter((_) => _ !== ne).map((_) => _.label)
        }, j.length || (B.value = !1), ke();
      } catch (g) {
        t = t || Y(g, "Delivery settings could not be read back.");
      } finally {
        t && (x.value = t), c.value = void 0;
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
    const E = oe(), z = h("");
    async function be() {
      if (E.value)
        try {
          E.value = await ta.get(E.value.message_id);
        } catch {
        }
    }
    Qe((e) => {
      e.message_id === E.value?.message_id && be();
    });
    async function Be() {
      c.value = "test", z.value = "", E.value = void 0;
      try {
        const e = await Oa();
        E.value = { message_id: e.message_id, status: "queued" }, await be();
      } catch (e) {
        z.value = Y(e, "The test email could not be sent.");
      } finally {
        c.value = void 0;
      }
    }
    const se = C(() => {
      const e = E.value?.last_error;
      if (e)
        return Xe(e.code, L.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), he = C(() => P.value ? "Save or discard your changes to send a test." : L.value?.configured ? "" : "Finish setting up delivery to send a test."), ie = C(() => k.value.map((e) => ({ value: e.id, label: e.label, icon: e.icon, description: e.description }))), _e = C(() => {
      const e = L.value;
      if (!(!e || e.configured))
        return e.reason ?? "Choose a delivery service for Mail.";
    });
    return (e, a) => (s(), o("section", Ia, [
      r(Ze, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: $(() => [
          P.value ? (s(), T(ea, {
            key: 0,
            busy: c.value === "save",
            "review-disabled": pe.value,
            onDiscard: Le,
            onReview: a[0] || (a[0] = (t) => {
              l.value = void 0, B.value = !0;
            })
          }, null, 8, ["busy", "review-disabled"])) : (s(), T(i(I), {
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
      O.value ? (s(), o("p", Fa, [
        r(i(b), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        a[14] || (a[14] = U("Loading delivery settings…", -1))
      ])) : R.value ? (s(), o("p", Ba, [
        r(i(b), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        a[15] || (a[15] = U("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (s(), o(J, { key: 2 }, [
        x.value ? (s(), o("div", Aa, [
          u("span", null, m(x.value), 1),
          k.value.length ? y("", !0) : (s(), T(i(I), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: a[2] || (a[2] = (t) => ve())
          }))
        ])) : y("", !0),
        l.value && !B.value ? (s(), o("div", Ja, [
          l.value.saved.length ? (s(), o("p", Pa, [
            r(i(b), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            u("span", null, "Saved: " + m(l.value.saved.join(", ")) + ".", 1)
          ])) : y("", !0),
          l.value.refused ? (s(), o("p", za, [
            r(i(b), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            u("span", null, "Not saved: " + m(l.value.refused.label) + ". " + m(l.value.refused.reason), 1)
          ])) : y("", !0),
          l.value.pending.length ? (s(), o("p", qa, [
            r(i(b), {
              icon: "tabler:clock-pause",
              "aria-hidden": "true"
            }),
            u("span", null, "Still in your draft: " + m(l.value.pending.join(", ")) + ". Correct the value above and save again.", 1)
          ])) : y("", !0)
        ])) : y("", !0),
        _e.value && !P.value ? (s(), o("p", Ka, [
          r(i(b), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            a[16] || (a[16] = u("strong", null, "Mail is not set up yet.", -1)),
            U(" " + m(_e.value), 1)
          ])
        ])) : y("", !0),
        u("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: c.value === "save",
          inert: c.value === "save" || void 0
        }, [
          r(re, { title: "Delivery service" }, {
            default: $(() => [
              r(A, {
                title: "Service",
                description: V.value?.description || "Choose the service that delivers your email."
              }, {
                actions: $(() => [
                  u("span", Ha, [
                    r(i(Ne), {
                      modelValue: f.value.driver,
                      "onUpdate:modelValue": a[3] || (a[3] = (t) => f.value.driver = t),
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
                        t ? (s(), o("span", Wa, [
                          r(i(b), {
                            icon: ie.value.find((j) => j.value === t)?.icon ?? "tabler:mail",
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U(m(ie.value.find((j) => j.value === t)?.label ?? t), 1)
                        ])) : (s(), o("span", Ya, m(g), 1))
                      ]),
                      option: $(({ option: t }) => [
                        u("span", Qa, [
                          r(i(b), {
                            icon: t.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U(m(t.label), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "options"])
                  ])
                ]),
                _: 1
              }, 8, ["description"]),
              ae.value ? (s(), o("p", Xa, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                U("Loading " + m(V.value?.label) + " settings…", 1)
              ])) : W.value ? (s(), o("p", Za, m(W.value), 1)) : V.value ? (s(), o(J, { key: 2 }, [
                V.value.settings_view && ee.value ? (s(), T(He(V.value.settings_view), {
                  key: V.value.id + ":" + te.value,
                  class: "mail-driver-view",
                  "^values": Oe.value,
                  "^secrets": Me.value,
                  "^errors": Re.value,
                  "^draft": ce.value,
                  "^disabled": String(c.value === "save"),
                  onChange: a[4] || (a[4] = (t) => me(t, "change")),
                  onValidity: a[5] || (a[5] = (t) => me(t, "validity"))
                }, null, 40, ["^values", "^secrets", "^errors", "^draft", "^disabled"])) : (s(), T(Ua, {
                  key: V.value.id + ":" + te.value,
                  settings: H.value,
                  errors: n.value,
                  draft: S.value,
                  disabled: c.value === "save",
                  onChange: a[6] || (a[6] = (t) => S.value = t),
                  onValidity: a[7] || (a[7] = (t) => F.value = t)
                }, null, 8, ["settings", "errors", "draft", "disabled"]))
              ], 64)) : y("", !0)
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
                  u("span", el, [
                    r(i(Q), {
                      modelValue: f.value.from_address,
                      "onUpdate:modelValue": a[8] || (a[8] = (t) => f.value.from_address = t),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      placeholder: "support@example.com",
                      "aria-label": "From address",
                      invalid: !!M.value.from_address
                    }, null, 8, ["modelValue", "invalid"]),
                    M.value.from_address ? (s(), o("small", al, m(M.value.from_address), 1)) : y("", !0)
                  ])
                ]),
                _: 1
              }),
              r(A, {
                title: "From name",
                description: "Shown next to the address, for example your company’s name."
              }, {
                actions: $(() => [
                  u("span", ll, [
                    r(i(Q), {
                      modelValue: f.value.from_name,
                      "onUpdate:modelValue": a[9] || (a[9] = (t) => f.value.from_name = t),
                      fluid: "",
                      "aria-label": "From name",
                      maxlength: "255",
                      invalid: !!M.value.from_name
                    }, null, 8, ["modelValue", "invalid"]),
                    M.value.from_name ? (s(), o("small", tl, m(M.value.from_name), 1)) : y("", !0)
                  ])
                ]),
                _: 1
              }),
              r(A, {
                title: "Reply-to",
                description: "Where replies go when it is not the From address. Optional."
              }, {
                actions: $(() => [
                  u("span", sl, [
                    r(i(Q), {
                      modelValue: f.value.reply_to,
                      "onUpdate:modelValue": a[10] || (a[10] = (t) => f.value.reply_to = t),
                      modelModifiers: { trim: !0 },
                      fluid: "",
                      "aria-label": "Reply-to",
                      invalid: !!M.value.reply_to
                    }, null, 8, ["modelValue", "invalid"]),
                    M.value.reply_to ? (s(), o("small", il, m(M.value.reply_to), 1)) : y("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 8, Ga),
        r(re, { title: "Test" }, {
          default: $(() => [
            r(A, {
              title: "Send a test email",
              description: he.value || "Sends a short message to you with the saved settings."
            }, {
              actions: $(() => [
                r(i(I), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: c.value === "test",
                  disabled: !!he.value || !!c.value,
                  onClick: Be
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
            E.value || z.value ? (s(), o("div", nl, [
              z.value ? (s(), o("p", ol, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                U(m(z.value), 1)
              ])) : E.value?.status === "queued" ? (s(), o("p", rl, [
                r(i(b), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                a[17] || (a[17] = U("Sending the test…", -1))
              ])) : E.value?.status === "sent" ? (s(), o("p", dl, [
                r(i(b), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                a[18] || (a[18] = U("The test was accepted for delivery. Check your inbox.", -1))
              ])) : E.value?.status === "failed" && se.value ? (s(), o("div", ul, [
                r(i(b), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", vl, [
                  u("strong", null, m(se.value.lead), 1),
                  u("span", null, m(se.value.next), 1),
                  r(i(I), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: a[11] || (a[11] = (t) => ge("/system/mail/activity/" + E.value.message_id))
                  })
                ])
              ])) : y("", !0)
            ])) : y("", !0)
          ]),
          _: 1
        })
      ], 64)),
      r(i(oa), {
        visible: B.value,
        modal: "",
        draggable: !1,
        closable: c.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": a[13] || (a[13] = (t) => {
          t || (B.value = !1);
        })
      }, {
        header: $(() => [
          u("span", cl, [
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
          r(i(I), {
            label: l.value ? "Back to the settings" : "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: c.value === "save",
            onClick: a[12] || (a[12] = (t) => B.value = !1)
          }, null, 8, ["label", "disabled"]),
          l.value ? y("", !0) : (s(), T(i(I), {
            key: 0,
            label: "Save",
            loading: c.value === "save",
            onClick: Fe
          }, null, 8, ["loading"]))
        ]),
        default: $(() => [
          u("ul", ml, [
            (s(!0), o(J, null, Ce(je.value, (t) => (s(), o("li", { key: t }, m(t), 1))), 128))
          ]),
          a[20] || (a[20] = u("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          l.value ? (s(), o("div", yl, [
            l.value.saved.length ? (s(), o("p", fl, [
              r(i(b), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              u("span", null, "Saved: " + m(l.value.saved.join(", ")) + ".", 1)
            ])) : y("", !0),
            l.value.refused ? (s(), o("p", pl, [
              r(i(b), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              u("span", null, "Not saved: " + m(l.value.refused.label) + ". " + m(l.value.refused.reason), 1)
            ])) : y("", !0),
            l.value.pending.length ? (s(), o("p", kl, [
              r(i(b), {
                icon: "tabler:clock-pause",
                "aria-hidden": "true"
              }),
              u("span", null, "Still in your draft: " + m(l.value.pending.join(", ")) + ".", 1)
            ])) : y("", !0)
          ])) : y("", !0),
          x.value ? (s(), o("p", gl, m(x.value), 1)) : y("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), hl = sa(bl, { type: "object", properties: { config: { type: "object" } } });
na(import.meta.url, hl);
//# sourceMappingURL=delivery.js.map
