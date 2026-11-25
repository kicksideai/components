import { u as ie, P as le } from "./wc-runtime-UUwuoPn6.js";
import { defineComponent as L, useId as Q, openBlock as t, createElementBlock as i, unref as a, createElementVNode as u, toDisplayString as c, createCommentVNode as v, renderSlot as E, useModel as ne, useSlots as oe, ref as g, watch as re, normalizeClass as ce, createVNode as l, createBlock as X, Transition as ue, withCtx as k, withDirectives as de, vShow as ve, mergeModels as me, onMounted as he, createTextVNode as _, shallowRef as G, computed as $, Fragment as pe, createSlots as ye } from "vue";
import { api as ge, loadByTagName as ke, host as fe } from "@wippy-fe/proxy";
import { Icon as p } from "@iconify/vue";
import R from "primevue/button";
import _e from "primevue/select";
import H from "primevue/tag";
import { H as be, I as xe, A as $e, u as we, y as Se, _ as Te, G as U, i as Ce, d as B, r as Me, C as De, g as O } from "./navigation-B2wAj0uZ.js";
const Ee = ["aria-labelledby"], Ie = {
  key: 0,
  class: "kx-settings-group-head"
}, Ne = ["id"], Re = {
  key: 0,
  class: "kx-settings-group-count"
}, Be = { class: "kx-settings-group-list" }, j = /* @__PURE__ */ L({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(n) {
    const y = Q();
    return (o, d) => (t(), i("section", {
      class: "kx-settings-group",
      "aria-labelledby": n.title ? a(y) : void 0
    }, [
      n.title ? (t(), i("div", Ie, [
        u("h2", {
          id: a(y),
          class: "kx-settings-group-title"
        }, c(n.title), 9, Ne),
        n.count !== void 0 ? (t(), i("span", Re, c(n.count), 1)) : v("", !0)
      ])) : v("", !0),
      u("div", Be, [
        E(o.$slots, "default")
      ])
    ], 8, Ee));
  }
}), Le = { class: "kx-settings-item-head" }, Ve = { class: "kx-settings-item-main" }, qe = { class: "kx-settings-item-line" }, Ae = { class: "kx-settings-item-title" }, Pe = {
  key: 0,
  class: "kx-settings-item-desc"
}, ze = {
  key: 1,
  class: "kx-settings-item-meta"
}, Fe = { class: "kx-settings-item-actions" }, Ge = ["aria-expanded", "aria-controls", "aria-label"], He = ["id", "inert"], Ue = { class: "kx-settings-item-clip" }, Oe = { class: "kx-settings-item-body" }, J = /* @__PURE__ */ L({
  __name: "SettingsItem",
  props: /* @__PURE__ */ me({
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
    const y = n, o = ne(n, "open"), d = oe(), m = Q(), S = g(o.value);
    return re(o, (b) => {
      b && (S.value = !0);
    }), (b, x) => (t(), i("article", {
      class: ce(["kx-settings-item", { "kx-settings-item-open": o.value && a(d).default }])
    }, [
      u("div", Le, [
        u("div", Ve, [
          u("div", qe, [
            u("h3", Ae, c(n.title), 1),
            E(b.$slots, "status")
          ]),
          n.description ? (t(), i("p", Pe, c(n.description), 1)) : v("", !0),
          a(d).meta ? (t(), i("p", ze, [
            E(b.$slots, "meta")
          ])) : v("", !0)
        ]),
        u("div", Fe, [
          a(d).default ? (t(), i("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": o.value,
            "aria-controls": a(m),
            "aria-label": (n.expandLabel || "Details") + " " + n.title,
            onClick: x[0] || (x[0] = (V) => o.value = !o.value)
          }, [
            u("span", null, c(n.expandLabel || "Details"), 1),
            l(a(p), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, Ge)) : v("", !0),
          E(b.$slots, "actions")
        ])
      ]),
      a(d).default ? (t(), X(ue, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: k(() => [
          S.value || y.keepMounted ? de((t(), i("div", {
            key: 0,
            id: a(m),
            inert: !o.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Ue, [
              u("div", Oe, [
                E(b.$slots, "default")
              ])
            ])
          ], 8, He)), [
            [ve, o.value]
          ]) : v("", !0)
        ]),
        _: 3
      })) : v("", !0)
    ], 2));
  }
});
async function je(n, y) {
  try {
    const { data: o } = await ge.put("/api/v1/settings", { namespace: "kickside.mail", key: "driver", value: n, expected_revision: y });
    if (o?.success) return;
    throw be(o, "Delivery service");
  } catch (o) {
    throw xe(o, "Delivery service");
  }
}
const Je = (n) => n instanceof $e && n.status === 409, We = {
  key: 0,
  class: "mail-provider-frame"
}, Ke = ["^config"], Qe = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Xe = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, W = "kickside-settings-provider", K = /* @__PURE__ */ L({
  __name: "SettingsProvider",
  props: {
    config: {}
  },
  setup(n) {
    const y = g(!!customElements.get(W)), o = g("");
    return he(async () => {
      if (!y.value)
        try {
          await ke(W, { timeoutMs: 8e3 }), y.value = !0;
        } catch (d) {
          o.value = d instanceof Error ? d.message : String(d);
        }
    }), (d, m) => y.value ? (t(), i("div", We, [
      u("kickside-settings-provider", {
        class: "mail-provider",
        "^config": JSON.stringify(n.config)
      }, null, 8, Ke)
    ])) : o.value ? (t(), i("p", Qe, "The " + c(n.config.title) + " settings could not be loaded. " + c(o.value), 1)) : (t(), i("p", Xe, [
      l(a(p), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      _("Loading " + c(n.config.title) + " settings…", 1)
    ]));
  }
}), Ye = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ze = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, et = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, tt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, st = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "status"
}, at = {
  key: 2,
  class: "kx-notice info mail-block",
  role: "status"
}, it = { class: "mail-setting-control" }, lt = {
  key: 0,
  class: "mail-kind"
}, nt = { key: 1 }, ot = { class: "mail-service-option" }, rt = { class: "mail-kind" }, ct = {
  key: 0,
  class: "mail-sub"
}, ut = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, dt = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, vt = {
  key: 0,
  class: "kx-notice error mail-block"
}, mt = {
  key: 1,
  class: "kx-notice mail-block"
}, ht = {
  key: 2,
  class: "kx-notice info mail-block"
}, pt = {
  key: 3,
  class: "kx-notice error mail-block"
}, yt = { class: "mail-failure-body" }, gt = {
  key: 4,
  class: "kx-notice warn mail-block",
  role: "alert"
}, kt = /* @__PURE__ */ L({
  __name: "DeliverySettings",
  setup(n) {
    const y = g(!0), o = g(!1), d = g(""), m = G(), S = g(), b = O();
    async function x() {
      const e = b();
      try {
        const s = await U.status();
        if (!e()) return;
        m.value = s, o.value = !1, d.value = "";
      } catch (s) {
        if (!e()) return;
        o.value = Ce(s), d.value = o.value ? "" : B(s, "Delivery settings could not be loaded.");
      } finally {
        e() && (y.value = !1);
      }
    }
    function V(e = "") {
      Me(S.value, "/system/mail" + e);
    }
    const q = $(() => m.value?.transports ?? []), f = $(() => q.value.find((e) => e.id === m.value?.driver?.id)), Y = $(() => q.value.map((e) => ({
      value: e.id,
      label: e.title,
      icon: e.icon,
      ready: e.ready,
      reason: e.reason
    }))), Z = $(() => {
      const e = f.value;
      return e ? e.ready ? e.description : e.reason ?? e.description : "Choose the service that delivers your email.";
    }), T = g(!1), I = g(""), C = g("");
    async function ee(e) {
      const s = m.value;
      if (!e || !s || e === s.driver?.id || T.value) return;
      const r = q.value.find((w) => w.id === e);
      if (r && !(s.driver && !await fe.confirm({
        header: `Send email through ${r.title}?`,
        message: `Email sent after this goes through ${r.title} instead of ${s.driver.label}.`,
        acceptLabel: `Use ${r.title}`,
        rejectLabel: "Cancel"
      }))) {
        T.value = !0, I.value = C.value = "";
        try {
          await je(e, s.driver_revision), C.value = `Mail now sends through ${r.title}.`;
        } catch (w) {
          Je(w) ? C.value = "Someone changed the delivery service while you were here. It shows the current choice now." : I.value = B(w, "The delivery service could not be changed.");
        } finally {
          await x(), T.value = !1;
        }
      }
    }
    const A = $(() => {
      const e = f.value;
      return e && { namespace: e.settings_ns, title: e.title, icon: e.icon, help: e.description };
    }), te = {
      namespace: "kickside.mail",
      title: "Sender",
      icon: "tabler:at",
      help: "Who recipients see the email from, where replies go, and how long Mail keeps the delivery log."
    }, h = G(), N = g(!1), M = g(""), D = g(""), se = O();
    async function P() {
      const e = h.value?.message_id;
      if (!e) return;
      const s = se();
      try {
        const r = await De.get(e);
        s() && h.value?.message_id === e && (h.value = r, D.value = "");
      } catch (r) {
        s() && h.value?.message_id === e && (D.value = B(r, "The test email status could not be loaded."));
      }
    }
    ie(async () => {
      await x(), h.value?.status === "queued" && await P();
    }), we("mail.activity", () => {
      h.value?.status === "queued" && P();
    });
    async function ae() {
      N.value = !0, M.value = D.value = "", h.value = void 0;
      try {
        const e = await U.sendTest();
        h.value = { message_id: e.message_id, status: "queued" }, await P();
      } catch (e) {
        M.value = B(e, "The test email could not be sent.");
      } finally {
        N.value = !1, x();
      }
    }
    const z = $(() => {
      const e = h.value?.last_error;
      if (e)
        return Se(e.code, m.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), F = $(() => f.value ? "" : "Choose a service to send a test.");
    return (e, s) => (t(), i("section", {
      ref_key: "root",
      ref: S,
      class: "mail-delivery",
      "aria-label": "Mail delivery settings"
    }, [
      l(Te, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: k(() => [
          l(a(R), {
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: s[0] || (s[0] = (r) => V())
          }, {
            icon: k(() => [
              l(a(p), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      y.value ? (t(), i("p", Ye, [
        l(a(p), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[3] || (s[3] = _("Loading delivery settings…", -1))
      ])) : o.value ? (t(), i("p", Ze, [
        l(a(p), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        s[4] || (s[4] = _("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : d.value && !m.value ? (t(), i("div", et, [
        u("span", null, c(d.value), 1),
        l(a(R), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: s[1] || (s[1] = (r) => x())
        })
      ])) : m.value ? (t(), i(pe, { key: 3 }, [
        d.value ? (t(), i("p", tt, c(d.value), 1)) : v("", !0),
        !m.value.configured && m.value.reason ? (t(), i("p", st, [
          l(a(p), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            s[5] || (s[5] = u("strong", null, "Mail is not set up yet.", -1)),
            _(" " + c(m.value.reason), 1)
          ])
        ])) : v("", !0),
        C.value ? (t(), i("p", at, [
          l(a(p), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          _(c(C.value), 1)
        ])) : v("", !0),
        l(j, {
          title: "Delivery service",
          class: "mail-service-group"
        }, {
          default: k(() => [
            l(J, {
              title: "Service",
              description: Z.value
            }, ye({
              actions: k(() => [
                u("span", it, [
                  l(a(_e), {
                    "model-value": f.value?.id,
                    options: Y.value,
                    "option-label": "label",
                    "option-value": "value",
                    "append-to": "self",
                    fluid: "",
                    placeholder: "Choose a service…",
                    "aria-label": "Service",
                    loading: T.value,
                    disabled: T.value,
                    "empty-message": "No delivery service is installed",
                    "onUpdate:modelValue": ee
                  }, {
                    value: k(({ value: r, placeholder: w }) => [
                      r && f.value ? (t(), i("span", lt, [
                        l(a(p), {
                          icon: f.value.icon,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        _(c(f.value.title), 1)
                      ])) : (t(), i("span", nt, c(w), 1))
                    ]),
                    option: k(({ option: r }) => [
                      u("span", ot, [
                        u("span", rt, [
                          l(a(p), {
                            icon: r.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          _(c(r.label), 1)
                        ]),
                        l(a(H), {
                          severity: r.ready ? "success" : "warn",
                          value: r.ready ? "Ready" : "Needs setup",
                          class: "kx-tag-sm"
                        }, null, 8, ["severity", "value"]),
                        !r.ready && r.reason ? (t(), i("span", ct, c(r.reason), 1)) : v("", !0)
                      ])
                    ]),
                    _: 1
                  }, 8, ["model-value", "options", "loading", "disabled"]),
                  I.value ? (t(), i("small", ut, c(I.value), 1)) : v("", !0)
                ])
              ]),
              _: 2
            }, [
              f.value ? {
                name: "status",
                fn: k(() => [
                  l(a(H), {
                    severity: f.value.ready ? "success" : "warn",
                    value: f.value.ready ? "Ready" : "Needs setup",
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["description"])
          ]),
          _: 1
        }),
        l(K, { config: te }),
        A.value ? (t(), X(K, {
          key: A.value.namespace,
          config: A.value
        }, null, 8, ["config"])) : v("", !0),
        l(j, { title: "Test" }, {
          default: k(() => [
            l(J, {
              title: "Send a test email",
              description: F.value || "Sends a short message to you with the saved settings."
            }, {
              actions: k(() => [
                l(a(R), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: N.value,
                  disabled: !!F.value || N.value,
                  onClick: ae
                }, {
                  icon: k(() => [
                    l(a(p), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            }, 8, ["description"]),
            h.value || M.value ? (t(), i("div", dt, [
              M.value ? (t(), i("p", vt, [
                l(a(p), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                _(c(M.value), 1)
              ])) : h.value?.status === "queued" ? (t(), i("p", mt, [
                l(a(p), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                s[6] || (s[6] = _("Sending the test…", -1))
              ])) : h.value?.status === "sent" ? (t(), i("p", ht, [
                l(a(p), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                s[7] || (s[7] = _("The test was accepted for delivery. Check your inbox.", -1))
              ])) : h.value?.status === "failed" && z.value ? (t(), i("div", pt, [
                l(a(p), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", yt, [
                  u("strong", null, c(z.value.lead), 1),
                  u("span", null, c(z.value.next), 1),
                  l(a(R), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: s[2] || (s[2] = (r) => V("/activity/" + encodeURIComponent(h.value.message_id)))
                  })
                ])
              ])) : v("", !0),
              D.value ? (t(), i("p", gt, c(D.value), 1)) : v("", !0)
            ])) : v("", !0)
          ]),
          _: 1
        })
      ], 64)) : v("", !0)
    ], 512));
  }
}), Ct = { rootComponent: kt, plugins: [le] };
export {
  Ct as config
};
