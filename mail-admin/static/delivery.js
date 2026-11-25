import { defineComponent as B, useId as P, openBlock as i, createElementBlock as l, unref as t, createElementVNode as d, toDisplayString as c, createCommentVNode as v, renderSlot as M, useModel as ie, useSlots as ae, ref as _, watch as le, normalizeClass as ne, createVNode as a, createBlock as W, Transition as oe, withCtx as f, withDirectives as re, vShow as ce, mergeModels as de, onMounted as ue, createTextVNode as b, shallowRef as z, computed as x, Fragment as ve, createSlots as me } from "vue";
import { u as ye } from "./wc-runtime-Ch_wJl3O.js";
import "pinia";
import { A as K, I as pe, J as he, u as ge, y as ke, _ as fe, G as _e, i as be, d as V, C as xe, g as F, H as $e } from "./latestRequest-BxeovKA8.js";
import { api as Q, loadByTagName as we, host as A, define as Se } from "@wippy-fe/proxy";
import { Icon as y } from "@iconify/vue";
import E from "primevue/button";
import Te from "primevue/select";
import G from "primevue/tag";
const Ce = ["aria-labelledby"], Me = {
  key: 0,
  class: "kx-settings-group-head"
}, De = ["id"], Ie = {
  key: 0,
  class: "kx-settings-group-count"
}, Ne = { class: "kx-settings-group-list" }, H = /* @__PURE__ */ B({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(n) {
    const p = P();
    return (o, u) => (i(), l("section", {
      class: "kx-settings-group",
      "aria-labelledby": n.title ? t(p) : void 0
    }, [
      n.title ? (i(), l("div", Me, [
        d("h2", {
          id: t(p),
          class: "kx-settings-group-title"
        }, c(n.title), 9, De),
        n.count !== void 0 ? (i(), l("span", Ie, c(n.count), 1)) : v("", !0)
      ])) : v("", !0),
      d("div", Ne, [
        M(o.$slots, "default")
      ])
    ], 8, Ce));
  }
}), Ee = { class: "kx-settings-item-head" }, Be = { class: "kx-settings-item-main" }, Le = { class: "kx-settings-item-line" }, Re = { class: "kx-settings-item-title" }, Ve = {
  key: 0,
  class: "kx-settings-item-desc"
}, Ae = {
  key: 1,
  class: "kx-settings-item-meta"
}, qe = { class: "kx-settings-item-actions" }, je = ["aria-expanded", "aria-controls", "aria-label"], ze = ["id", "inert"], Fe = { class: "kx-settings-item-clip" }, Ge = { class: "kx-settings-item-body" }, J = /* @__PURE__ */ B({
  __name: "SettingsItem",
  props: /* @__PURE__ */ de({
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
    const p = n, o = ie(n, "open"), u = ae(), m = P(), D = _(o.value);
    return le(o, (g) => {
      g && (D.value = !0);
    }), (g, $) => (i(), l("article", {
      class: ne(["kx-settings-item", { "kx-settings-item-open": o.value && t(u).default }])
    }, [
      d("div", Ee, [
        d("div", Be, [
          d("div", Le, [
            d("h3", Re, c(n.title), 1),
            M(g.$slots, "status")
          ]),
          n.description ? (i(), l("p", Ve, c(n.description), 1)) : v("", !0),
          t(u).meta ? (i(), l("p", Ae, [
            M(g.$slots, "meta")
          ])) : v("", !0)
        ]),
        d("div", qe, [
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
            a(t(y), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, je)) : v("", !0),
          M(g.$slots, "actions")
        ])
      ]),
      t(u).default ? (i(), W(oe, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: f(() => [
          D.value || p.keepMounted ? re((i(), l("div", {
            key: 0,
            id: t(m),
            inert: !o.value,
            class: "kx-settings-item-panel"
          }, [
            d("div", Fe, [
              d("div", Ge, [
                M(g.$slots, "default")
              ])
            ])
          ], 8, ze)), [
            [ce, o.value]
          ]) : v("", !0)
        ]),
        _: 3
      })) : v("", !0)
    ], 2));
  }
});
async function He(n, p) {
  try {
    const { data: o } = await Q.put("/api/v1/settings", { namespace: "kickside.mail", key: "driver", value: n, expected_revision: p });
    if (o?.success) return;
    throw new K({ error: o?.error, kind: "INVALID" }, "Delivery service");
  } catch (o) {
    throw pe(o, "Delivery service");
  }
}
const Je = (n) => n instanceof K && n.status === 409, Oe = () => he(() => Q.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Ue = ["^config"], Pe = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, We = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, O = "kickside-settings-provider", U = /* @__PURE__ */ B({
  __name: "SettingsProvider",
  props: {
    config: {}
  },
  setup(n) {
    const p = _(!!customElements.get(O)), o = _("");
    return ue(async () => {
      if (!p.value)
        try {
          await we(O, { timeoutMs: 8e3 }), p.value = !0;
        } catch (u) {
          o.value = u instanceof Error ? u.message : String(u);
        }
    }), (u, m) => p.value ? (i(), l("kickside-settings-provider", {
      key: 0,
      class: "mail-provider",
      "^config": JSON.stringify(n.config)
    }, null, 8, Ue)) : o.value ? (i(), l("p", Pe, "The " + c(n.config.title) + " settings could not be loaded. " + c(o.value), 1)) : (i(), l("p", We, [
      a(t(y), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      b("Loading " + c(n.config.title) + " settings…", 1)
    ]));
  }
}), Ke = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, Qe = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Xe = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Ye = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Ze = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "status"
}, et = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, tt = { class: "mail-setting-control" }, st = {
  key: 0,
  class: "mail-kind"
}, it = { key: 1 }, at = { class: "mail-service-option" }, lt = { class: "mail-kind" }, nt = {
  key: 0,
  class: "mail-sub"
}, ot = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, rt = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, ct = {
  key: 0,
  class: "kx-notice error mail-block"
}, dt = {
  key: 1,
  class: "kx-notice mail-block"
}, ut = {
  key: 2,
  class: "kx-notice info mail-block"
}, vt = {
  key: 3,
  class: "kx-notice error mail-block"
}, mt = { class: "mail-failure-body" }, yt = /* @__PURE__ */ B({
  __name: "DeliverySettings",
  setup(n) {
    const p = _(!0), o = _(!1), u = _(""), m = z(), D = F();
    async function g() {
      const e = D();
      try {
        const s = await _e.status();
        if (!e()) return;
        m.value = s, o.value = !1, u.value = "";
      } catch (s) {
        if (!e()) return;
        o.value = be(s), u.value = o.value ? "" : V(s, "Delivery settings could not be loaded.");
      } finally {
        e() && (p.value = !1);
      }
    }
    ye(g);
    const $ = x(() => m.value?.transports ?? []), k = x(() => $.value.find((e) => e.id === m.value?.driver?.id)), X = x(() => $.value.map((e) => ({
      value: e.id,
      label: e.title,
      icon: e.icon,
      ready: e.ready,
      reason: e.reason
    }))), Y = x(() => {
      const e = k.value;
      return e ? e.ready ? e.description : e.reason ?? e.description : "Choose the service that delivers your email.";
    }), S = _(!1), I = _(""), T = _("");
    async function Z(e) {
      const s = m.value;
      if (!e || !s || e === s.driver?.id || S.value) return;
      const r = $.value.find((w) => w.id === e);
      if (r && !(s.driver && !await A.confirm({
        header: `Send email through ${r.title}?`,
        message: `Email sent after this goes through ${r.title} instead of ${s.driver.label}.`,
        acceptLabel: `Use ${r.title}`,
        rejectLabel: "Cancel"
      }))) {
        S.value = !0, I.value = T.value = "";
        try {
          await He(e, s.driver_revision), T.value = `Mail now sends through ${r.title}.`;
        } catch (w) {
          Je(w) ? T.value = "Someone changed the delivery service while you were here. It shows the current choice now." : I.value = V(w, "The delivery service could not be changed.");
        } finally {
          await g(), S.value = !1;
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
    }, h = z(), N = _(!1), C = _(""), te = F();
    async function q() {
      const e = h.value?.message_id;
      if (!e) return;
      const s = te();
      try {
        const r = await xe.get(e);
        s() && h.value?.message_id === e && (h.value = r);
      } catch {
      }
    }
    ge("mail.activity", () => {
      h.value?.status === "queued" && q();
    });
    async function se() {
      N.value = !0, C.value = "", h.value = void 0;
      try {
        const e = await Oe();
        h.value = { message_id: e.message_id, status: "queued" }, await q();
      } catch (e) {
        C.value = V(e, "The test email could not be sent.");
      } finally {
        N.value = !1, g();
      }
    }
    const R = x(() => {
      const e = h.value?.last_error;
      if (e)
        return ke(e.code, m.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), j = x(() => k.value ? "" : "Choose a service to send a test.");
    return (e, s) => (i(), l("section", Ke, [
      a(fe, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: f(() => [
          a(t(E), {
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: s[0] || (s[0] = (r) => t(A).navigate("/system/mail"))
          }, {
            icon: f(() => [
              a(t(y), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      p.value ? (i(), l("p", Qe, [
        a(t(y), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[3] || (s[3] = b("Loading delivery settings…", -1))
      ])) : o.value ? (i(), l("p", Xe, [
        a(t(y), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        s[4] || (s[4] = b("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : u.value && !m.value ? (i(), l("div", Ye, [
        d("span", null, c(u.value), 1),
        a(t(E), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: s[1] || (s[1] = (r) => g())
        })
      ])) : m.value ? (i(), l(ve, { key: 3 }, [
        !m.value.configured && m.value.reason ? (i(), l("p", Ze, [
          a(t(y), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          d("span", null, [
            s[5] || (s[5] = d("strong", null, "Mail is not set up yet.", -1)),
            b(" " + c(m.value.reason), 1)
          ])
        ])) : v("", !0),
        T.value ? (i(), l("p", et, [
          a(t(y), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          b(c(T.value), 1)
        ])) : v("", !0),
        a(H, { title: "Delivery service" }, {
          default: f(() => [
            a(J, {
              title: "Service",
              description: Y.value
            }, me({
              actions: f(() => [
                d("span", tt, [
                  a(t(Te), {
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
                      r && k.value ? (i(), l("span", st, [
                        a(t(y), {
                          icon: k.value.icon,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        b(c(k.value.title), 1)
                      ])) : (i(), l("span", it, c(w), 1))
                    ]),
                    option: f(({ option: r }) => [
                      d("span", at, [
                        d("span", lt, [
                          a(t(y), {
                            icon: r.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          b(c(r.label), 1)
                        ]),
                        a(t(G), {
                          severity: r.ready ? "success" : "warn",
                          value: r.ready ? "Ready" : "Needs setup",
                          class: "kx-tag-sm"
                        }, null, 8, ["severity", "value"]),
                        !r.ready && r.reason ? (i(), l("span", nt, c(r.reason), 1)) : v("", !0)
                      ])
                    ]),
                    _: 1
                  }, 8, ["model-value", "options", "loading", "disabled"]),
                  I.value ? (i(), l("small", ot, c(I.value), 1)) : v("", !0)
                ])
              ]),
              _: 2
            }, [
              k.value ? {
                name: "status",
                fn: f(() => [
                  a(t(G), {
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
        L.value ? (i(), W(U, {
          key: L.value.namespace,
          config: L.value
        }, null, 8, ["config"])) : v("", !0),
        a(U, { config: ee }),
        a(H, { title: "Test" }, {
          default: f(() => [
            a(J, {
              title: "Send a test email",
              description: j.value || "Sends a short message to you with the saved settings."
            }, {
              actions: f(() => [
                a(t(E), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: N.value,
                  disabled: !!j.value || N.value,
                  onClick: se
                }, {
                  icon: f(() => [
                    a(t(y), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            }, 8, ["description"]),
            h.value || C.value ? (i(), l("div", rt, [
              C.value ? (i(), l("p", ct, [
                a(t(y), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                b(c(C.value), 1)
              ])) : h.value?.status === "queued" ? (i(), l("p", dt, [
                a(t(y), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                s[6] || (s[6] = b("Sending the test…", -1))
              ])) : h.value?.status === "sent" ? (i(), l("p", ut, [
                a(t(y), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                s[7] || (s[7] = b("The test was accepted for delivery. Check your inbox.", -1))
              ])) : h.value?.status === "failed" && R.value ? (i(), l("div", vt, [
                a(t(y), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                d("div", mt, [
                  d("strong", null, c(R.value.lead), 1),
                  d("span", null, c(R.value.next), 1),
                  a(t(E), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: s[2] || (s[2] = (r) => t(A).navigate("/system/mail/activity/" + h.value.message_id))
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
}), pt = $e(yt, { type: "object", properties: { config: { type: "object" } } });
Se(import.meta.url, pt);
//# sourceMappingURL=delivery.js.map
