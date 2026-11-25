import { u as ie, P as ae } from "./wc-runtime-Ch_wJl3O.js";
import { defineComponent as E, useId as J, openBlock as i, createElementBlock as l, unref as t, createElementVNode as d, toDisplayString as c, createCommentVNode as v, renderSlot as M, useModel as le, useSlots as ne, ref as _, watch as oe, normalizeClass as re, createVNode as a, createBlock as W, Transition as ce, withCtx as f, withDirectives as de, vShow as ue, mergeModels as ve, onMounted as me, createTextVNode as b, shallowRef as P, computed as x, Fragment as ge, createSlots as he } from "vue";
import { api as K, loadByTagName as ye, host as V } from "@wippy-fe/proxy";
import { Icon as g } from "@iconify/vue";
import I from "primevue/button";
import pe from "primevue/select";
import z from "primevue/tag";
import { A as Q, G as ke, H as fe, u as _e, x as be, _ as xe, F as $e, i as we, d as A, B as Se, g as G } from "./latestRequest-9-3hn826.js";
const Te = ["aria-labelledby"], Ce = {
  key: 0,
  class: "kx-settings-group-head"
}, Me = ["id"], De = {
  key: 0,
  class: "kx-settings-group-count"
}, Ne = { class: "kx-settings-group-list" }, H = /* @__PURE__ */ E({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(n) {
    const h = J();
    return (o, u) => (i(), l("section", {
      class: "kx-settings-group",
      "aria-labelledby": n.title ? t(h) : void 0
    }, [
      n.title ? (i(), l("div", Ce, [
        d("h2", {
          id: t(h),
          class: "kx-settings-group-title"
        }, c(n.title), 9, Me),
        n.count !== void 0 ? (i(), l("span", De, c(n.count), 1)) : v("", !0)
      ])) : v("", !0),
      d("div", Ne, [
        M(o.$slots, "default")
      ])
    ], 8, Te));
  }
}), Be = { class: "kx-settings-item-head" }, Ie = { class: "kx-settings-item-main" }, Ee = { class: "kx-settings-item-line" }, Le = { class: "kx-settings-item-title" }, Re = {
  key: 0,
  class: "kx-settings-item-desc"
}, Ve = {
  key: 1,
  class: "kx-settings-item-meta"
}, Ae = { class: "kx-settings-item-actions" }, qe = ["aria-expanded", "aria-controls", "aria-label"], Fe = ["id", "inert"], Pe = { class: "kx-settings-item-clip" }, ze = { class: "kx-settings-item-body" }, O = /* @__PURE__ */ E({
  __name: "SettingsItem",
  props: /* @__PURE__ */ ve({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(n) {
    const h = n, o = le(n, "open"), u = ne(), m = J(), D = _(o.value);
    return oe(o, (p) => {
      p && (D.value = !0);
    }), (p, $) => (i(), l("article", {
      class: re(["kx-settings-item", { "kx-settings-item-open": o.value && t(u).default }])
    }, [
      d("div", Be, [
        d("div", Ie, [
          d("div", Ee, [
            d("h3", Le, c(n.title), 1),
            M(p.$slots, "status")
          ]),
          n.description ? (i(), l("p", Re, c(n.description), 1)) : v("", !0),
          t(u).meta ? (i(), l("p", Ve, [
            M(p.$slots, "meta")
          ])) : v("", !0)
        ]),
        d("div", Ae, [
          t(u).default ? (i(), l("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": o.value,
            "aria-controls": t(m),
            "aria-label": (n.expandLabel || "Details") + " " + n.title,
            onClick: $[0] || ($[0] = (k) => o.value = !o.value)
          }, [
            d("span", null, c(n.expandLabel || "Details"), 1),
            a(t(g), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, qe)) : v("", !0),
          M(p.$slots, "actions")
        ])
      ]),
      t(u).default ? (i(), W(ce, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: f(() => [
          D.value || h.keepMounted ? de((i(), l("div", {
            key: 0,
            id: t(m),
            inert: !o.value,
            class: "kx-settings-item-panel"
          }, [
            d("div", Pe, [
              d("div", ze, [
                M(p.$slots, "default")
              ])
            ])
          ], 8, Fe)), [
            [ue, o.value]
          ]) : v("", !0)
        ]),
        _: 3
      })) : v("", !0)
    ], 2));
  }
});
async function Ge(n, h) {
  try {
    const { data: o } = await K.put("/api/v1/settings", { namespace: "kickside.mail", key: "driver", value: n, expected_revision: h });
    if (o?.success) return;
    throw new Q({ error: o?.error, kind: "INVALID" }, "Delivery service");
  } catch (o) {
    throw ke(o, "Delivery service");
  }
}
const He = (n) => n instanceof Q && n.status === 409, Oe = () => fe(() => K.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Ue = ["^config"], je = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Je = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, U = "kickside-settings-provider", j = /* @__PURE__ */ E({
  __name: "SettingsProvider",
  props: {
    config: {}
  },
  setup(n) {
    const h = _(!!customElements.get(U)), o = _("");
    return me(async () => {
      if (!h.value)
        try {
          await ye(U, { timeoutMs: 8e3 }), h.value = !0;
        } catch (u) {
          o.value = u instanceof Error ? u.message : String(u);
        }
    }), (u, m) => h.value ? (i(), l("kickside-settings-provider", {
      key: 0,
      class: "mail-provider",
      "^config": JSON.stringify(n.config)
    }, null, 8, Ue)) : o.value ? (i(), l("p", je, "The " + c(n.config.title) + " settings could not be loaded. " + c(o.value), 1)) : (i(), l("p", Je, [
      a(t(g), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      b("Loading " + c(n.config.title) + " settings…", 1)
    ]));
  }
}), We = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Ke = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Qe = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Xe = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Ye = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "status"
}, Ze = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, et = { class: "mail-setting-control" }, tt = {
  key: 0,
  class: "mail-kind"
}, st = { key: 1 }, it = { class: "mail-service-option" }, at = { class: "mail-kind" }, lt = {
  key: 0,
  class: "mail-sub"
}, nt = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, ot = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, rt = {
  key: 0,
  class: "kx-notice error mail-block"
}, ct = {
  key: 1,
  class: "kx-notice mail-block"
}, dt = {
  key: 2,
  class: "kx-notice info mail-block"
}, ut = {
  key: 3,
  class: "kx-notice error mail-block"
}, vt = { class: "mail-failure-body" }, mt = /* @__PURE__ */ E({
  __name: "DeliverySettings",
  setup(n) {
    const h = _(!0), o = _(!1), u = _(""), m = P(), D = G();
    async function p() {
      const e = D();
      try {
        const s = await $e.status();
        if (!e()) return;
        m.value = s, o.value = !1, u.value = "";
      } catch (s) {
        if (!e()) return;
        o.value = we(s), u.value = o.value ? "" : A(s, "Delivery settings could not be loaded.");
      } finally {
        e() && (h.value = !1);
      }
    }
    ie(p);
    const $ = x(() => m.value?.transports ?? []), k = x(() => $.value.find((e) => e.id === m.value?.driver?.id)), X = x(() => $.value.map((e) => ({
      value: e.id,
      label: e.title,
      icon: e.icon,
      ready: e.ready,
      reason: e.reason
    }))), Y = x(() => {
      const e = k.value;
      return e ? e.ready ? e.description : e.reason ?? e.description : "Choose the service that delivers your email.";
    }), S = _(!1), N = _(""), T = _("");
    async function Z(e) {
      const s = m.value;
      if (!e || !s || e === s.driver?.id || S.value) return;
      const r = $.value.find((w) => w.id === e);
      if (r && !(s.driver && !await V.confirm({
        header: `Send email through ${r.title}?`,
        message: `Email sent after this goes through ${r.title} instead of ${s.driver.label}.`,
        acceptLabel: `Use ${r.title}`,
        rejectLabel: "Cancel"
      }))) {
        S.value = !0, N.value = T.value = "";
        try {
          await Ge(e, s.driver_revision), T.value = `Mail now sends through ${r.title}.`;
        } catch (w) {
          He(w) ? T.value = "Someone changed the delivery service while you were here. It shows the current choice now." : N.value = A(w, "The delivery service could not be changed.");
        } finally {
          await p(), S.value = !1;
        }
      }
    }
    const L = x(() => {
      const e = k.value;
      return e && { namespace: e.settings_ns, title: e.title, icon: e.icon, help: e.description };
    }), ee = {
      namespace: "kickside.mail",
      title: "Sender",
      icon: "tabler:at",
      help: "Who recipients see the email from, where replies go, and how long Mail keeps the delivery log."
    }, y = P(), B = _(!1), C = _(""), te = G();
    async function q() {
      const e = y.value?.message_id;
      if (!e) return;
      const s = te();
      try {
        const r = await Se.get(e);
        s() && y.value?.message_id === e && (y.value = r);
      } catch {
      }
    }
    _e("mail.activity", () => {
      y.value?.status === "queued" && q();
    });
    async function se() {
      B.value = !0, C.value = "", y.value = void 0;
      try {
        const e = await Oe();
        y.value = { message_id: e.message_id, status: "queued" }, await q();
      } catch (e) {
        C.value = A(e, "The test email could not be sent.");
      } finally {
        B.value = !1, p();
      }
    }
    const R = x(() => {
      const e = y.value?.last_error;
      if (e)
        return be(e.code, m.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), F = x(() => k.value ? "" : "Choose a service to send a test.");
    return (e, s) => (i(), l("section", We, [
      a(xe, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: f(() => [
          a(t(I), {
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: s[0] || (s[0] = (r) => t(V).navigate("/system/mail"))
          }, {
            icon: f(() => [
              a(t(g), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      h.value ? (i(), l("p", Ke, [
        a(t(g), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[3] || (s[3] = b("Loading delivery settings…", -1))
      ])) : o.value ? (i(), l("p", Qe, [
        a(t(g), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        s[4] || (s[4] = b("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : u.value && !m.value ? (i(), l("div", Xe, [
        d("span", null, c(u.value), 1),
        a(t(I), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: s[1] || (s[1] = (r) => p())
        })
      ])) : m.value ? (i(), l(ge, { key: 3 }, [
        !m.value.configured && m.value.reason ? (i(), l("p", Ye, [
          a(t(g), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          d("span", null, [
            s[5] || (s[5] = d("strong", null, "Mail is not set up yet.", -1)),
            b(" " + c(m.value.reason), 1)
          ])
        ])) : v("", !0),
        T.value ? (i(), l("p", Ze, [
          a(t(g), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          b(c(T.value), 1)
        ])) : v("", !0),
        a(H, {
          title: "Delivery service",
          class: "mail-service-group"
        }, {
          default: f(() => [
            a(O, {
              title: "Service",
              description: Y.value
            }, he({
              actions: f(() => [
                d("span", et, [
                  a(t(pe), {
                    "model-value": k.value?.id,
                    options: X.value,
                    "option-label": "label",
                    "option-value": "value",
                    "append-to": "self",
                    fluid: "",
                    placeholder: "Choose a service…",
                    "aria-label": "Service",
                    loading: S.value,
                    disabled: S.value,
                    "empty-message": "No delivery service is installed",
                    "onUpdate:modelValue": Z
                  }, {
                    value: f(({ value: r, placeholder: w }) => [
                      r && k.value ? (i(), l("span", tt, [
                        a(t(g), {
                          icon: k.value.icon,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        b(c(k.value.title), 1)
                      ])) : (i(), l("span", st, c(w), 1))
                    ]),
                    option: f(({ option: r }) => [
                      d("span", it, [
                        d("span", at, [
                          a(t(g), {
                            icon: r.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          b(c(r.label), 1)
                        ]),
                        a(t(z), {
                          severity: r.ready ? "success" : "warn",
                          value: r.ready ? "Ready" : "Needs setup",
                          class: "kx-tag-sm"
                        }, null, 8, ["severity", "value"]),
                        !r.ready && r.reason ? (i(), l("span", lt, c(r.reason), 1)) : v("", !0)
                      ])
                    ]),
                    _: 1
                  }, 8, ["model-value", "options", "loading", "disabled"]),
                  N.value ? (i(), l("small", nt, c(N.value), 1)) : v("", !0)
                ])
              ]),
              _: 2
            }, [
              k.value ? {
                name: "status",
                fn: f(() => [
                  a(t(z), {
                    severity: k.value.ready ? "success" : "warn",
                    value: k.value.ready ? "Ready" : "Needs setup",
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["description"])
          ]),
          _: 1
        }),
        L.value ? (i(), W(j, {
          key: L.value.namespace,
          config: L.value
        }, null, 8, ["config"])) : v("", !0),
        a(j, { config: ee }),
        a(H, { title: "Test" }, {
          default: f(() => [
            a(O, {
              title: "Send a test email",
              description: F.value || "Sends a short message to you with the saved settings."
            }, {
              actions: f(() => [
                a(t(I), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: B.value,
                  disabled: !!F.value || B.value,
                  onClick: se
                }, {
                  icon: f(() => [
                    a(t(g), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            }, 8, ["description"]),
            y.value || C.value ? (i(), l("div", ot, [
              C.value ? (i(), l("p", rt, [
                a(t(g), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                b(c(C.value), 1)
              ])) : y.value?.status === "queued" ? (i(), l("p", ct, [
                a(t(g), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                s[6] || (s[6] = b("Sending the test…", -1))
              ])) : y.value?.status === "sent" ? (i(), l("p", dt, [
                a(t(g), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                s[7] || (s[7] = b("The test was accepted for delivery. Check your inbox.", -1))
              ])) : y.value?.status === "failed" && R.value ? (i(), l("div", ut, [
                a(t(g), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                d("div", vt, [
                  d("strong", null, c(R.value.lead), 1),
                  d("span", null, c(R.value.next), 1),
                  a(t(I), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: s[2] || (s[2] = (r) => t(V).navigate("/system/mail/activity/" + y.value.message_id))
                  })
                ])
              ])) : v("", !0)
            ])) : v("", !0)
          ]),
          _: 1
        })
      ], 64)) : v("", !0)
    ]));
  }
}), xt = { rootComponent: mt, plugins: [ae] };
export {
  xt as config
};
//# sourceMappingURL=mount-rvBc_H30.js.map
