import { u as le, P as ne } from "./wc-runtime-UUwuoPn6.js";
import { defineComponent as L, useId as Q, openBlock as t, createElementBlock as i, unref as a, createElementVNode as u, toDisplayString as c, createCommentVNode as v, renderSlot as E, useModel as oe, useSlots as re, ref as g, watch as ce, normalizeClass as ue, createVNode as l, createBlock as X, Transition as de, withCtx as k, withDirectives as ve, vShow as me, mergeModels as he, onMounted as pe, createTextVNode as _, shallowRef as G, computed as w, Fragment as ye, createSlots as ge } from "vue";
import { api as ke, loadByTagName as fe, host as _e } from "@wippy-fe/proxy";
import { Icon as p } from "@iconify/vue";
import B from "primevue/button";
import be from "primevue/select";
import U from "primevue/tag";
import { A as Y, G as xe, u as we, x as $e, _ as Se, F as H, i as Te, d as R, B as Ce, g as O } from "./realtime-CIhC94Jq.js";
const Me = ["aria-labelledby"], De = {
  key: 0,
  class: "kx-settings-group-head"
}, Ee = ["id"], Ie = {
  key: 0,
  class: "kx-settings-group-count"
}, Ne = { class: "kx-settings-group-list" }, j = /* @__PURE__ */ L({
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
      n.title ? (t(), i("div", De, [
        u("h2", {
          id: a(y),
          class: "kx-settings-group-title"
        }, c(n.title), 9, Ee),
        n.count !== void 0 ? (t(), i("span", Ie, c(n.count), 1)) : v("", !0)
      ])) : v("", !0),
      u("div", Ne, [
        E(o.$slots, "default")
      ])
    ], 8, Me));
  }
}), Be = { class: "kx-settings-item-head" }, Re = { class: "kx-settings-item-main" }, Le = { class: "kx-settings-item-line" }, Ve = { class: "kx-settings-item-title" }, Ae = {
  key: 0,
  class: "kx-settings-item-desc"
}, qe = {
  key: 1,
  class: "kx-settings-item-meta"
}, Fe = { class: "kx-settings-item-actions" }, Pe = ["aria-expanded", "aria-controls", "aria-label"], ze = ["id", "inert"], Ge = { class: "kx-settings-item-clip" }, Ue = { class: "kx-settings-item-body" }, J = /* @__PURE__ */ L({
  __name: "SettingsItem",
  props: /* @__PURE__ */ he({
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
    const y = n, o = oe(n, "open"), d = re(), m = Q(), S = g(o.value);
    return ce(o, (b) => {
      b && (S.value = !0);
    }), (b, x) => (t(), i("article", {
      class: ue(["kx-settings-item", { "kx-settings-item-open": o.value && a(d).default }])
    }, [
      u("div", Be, [
        u("div", Re, [
          u("div", Le, [
            u("h3", Ve, c(n.title), 1),
            E(b.$slots, "status")
          ]),
          n.description ? (t(), i("p", Ae, c(n.description), 1)) : v("", !0),
          a(d).meta ? (t(), i("p", qe, [
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
          ], 8, Pe)) : v("", !0),
          E(b.$slots, "actions")
        ])
      ]),
      a(d).default ? (t(), X(de, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: k(() => [
          S.value || y.keepMounted ? ve((t(), i("div", {
            key: 0,
            id: a(m),
            inert: !o.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Ge, [
              u("div", Ue, [
                E(b.$slots, "default")
              ])
            ])
          ], 8, ze)), [
            [me, o.value]
          ]) : v("", !0)
        ]),
        _: 3
      })) : v("", !0)
    ], 2));
  }
});
async function He(n, y) {
  try {
    const { data: o } = await ke.put("/api/v1/settings", { namespace: "kickside.mail", key: "driver", value: n, expected_revision: y });
    if (o?.success) return;
    throw new Y({ error: o?.error, kind: "INVALID" }, "Delivery service");
  } catch (o) {
    throw xe(o, "Delivery service");
  }
}
const Oe = (n) => n instanceof Y && n.status === 409, je = {
  key: 0,
  class: "mail-provider-frame"
}, Je = ["^config"], We = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Ke = {
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
    return pe(async () => {
      if (!y.value)
        try {
          await fe(W, { timeoutMs: 8e3 }), y.value = !0;
        } catch (d) {
          o.value = d instanceof Error ? d.message : String(d);
        }
    }), (d, m) => y.value ? (t(), i("div", je, [
      u("kickside-settings-provider", {
        class: "mail-provider",
        "^config": JSON.stringify(n.config)
      }, null, 8, Je)
    ])) : o.value ? (t(), i("p", We, "The " + c(n.config.title) + " settings could not be loaded. " + c(o.value), 1)) : (t(), i("p", Ke, [
      l(a(p), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      _("Loading " + c(n.config.title) + " settings…", 1)
    ]));
  }
}), Qe = {
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
  role: "alert"
}, et = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "status"
}, tt = {
  key: 2,
  class: "kx-notice info mail-block",
  role: "status"
}, st = { class: "mail-setting-control" }, at = {
  key: 0,
  class: "mail-kind"
}, it = { key: 1 }, lt = { class: "mail-service-option" }, nt = { class: "mail-kind" }, ot = {
  key: 0,
  class: "mail-sub"
}, rt = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, ct = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, ut = {
  key: 0,
  class: "kx-notice error mail-block"
}, dt = {
  key: 1,
  class: "kx-notice mail-block"
}, vt = {
  key: 2,
  class: "kx-notice info mail-block"
}, mt = {
  key: 3,
  class: "kx-notice error mail-block"
}, ht = { class: "mail-failure-body" }, pt = {
  key: 4,
  class: "kx-notice warn mail-block",
  role: "alert"
}, yt = /* @__PURE__ */ L({
  __name: "DeliverySettings",
  setup(n) {
    const y = g(!0), o = g(!1), d = g(""), m = G(), S = g(), b = O();
    async function x() {
      const e = b();
      try {
        const s = await H.status();
        if (!e()) return;
        m.value = s, o.value = !1, d.value = "";
      } catch (s) {
        if (!e()) return;
        o.value = Te(s), d.value = o.value ? "" : R(s, "Delivery settings could not be loaded.");
      } finally {
        e() && (y.value = !1);
      }
    }
    function V(e = "") {
      S.value?.dispatchEvent(new CustomEvent("navigate", {
        detail: { path: "/system/mail" + e },
        bubbles: !0,
        composed: !0
      }));
    }
    const A = w(() => m.value?.transports ?? []), f = w(() => A.value.find((e) => e.id === m.value?.driver?.id)), Z = w(() => A.value.map((e) => ({
      value: e.id,
      label: e.title,
      icon: e.icon,
      ready: e.ready,
      reason: e.reason
    }))), ee = w(() => {
      const e = f.value;
      return e ? e.ready ? e.description : e.reason ?? e.description : "Choose the service that delivers your email.";
    }), T = g(!1), I = g(""), C = g("");
    async function te(e) {
      const s = m.value;
      if (!e || !s || e === s.driver?.id || T.value) return;
      const r = A.value.find(($) => $.id === e);
      if (r && !(s.driver && !await _e.confirm({
        header: `Send email through ${r.title}?`,
        message: `Email sent after this goes through ${r.title} instead of ${s.driver.label}.`,
        acceptLabel: `Use ${r.title}`,
        rejectLabel: "Cancel"
      }))) {
        T.value = !0, I.value = C.value = "";
        try {
          await He(e, s.driver_revision), C.value = `Mail now sends through ${r.title}.`;
        } catch ($) {
          Oe($) ? C.value = "Someone changed the delivery service while you were here. It shows the current choice now." : I.value = R($, "The delivery service could not be changed.");
        } finally {
          await x(), T.value = !1;
        }
      }
    }
    const q = w(() => {
      const e = f.value;
      return e && { namespace: e.settings_ns, title: e.title, icon: e.icon, help: e.description };
    }), se = {
      namespace: "kickside.mail",
      title: "Sender",
      icon: "tabler:at",
      help: "Who recipients see the email from, where replies go, and how long Mail keeps the delivery log."
    }, h = G(), N = g(!1), M = g(""), D = g(""), ae = O();
    async function F() {
      const e = h.value?.message_id;
      if (!e) return;
      const s = ae();
      try {
        const r = await Ce.get(e);
        s() && h.value?.message_id === e && (h.value = r, D.value = "");
      } catch (r) {
        s() && h.value?.message_id === e && (D.value = R(r, "The test email status could not be loaded."));
      }
    }
    le(async () => {
      await x(), h.value?.status === "queued" && await F();
    }), we("mail.activity", () => {
      h.value?.status === "queued" && F();
    });
    async function ie() {
      N.value = !0, M.value = D.value = "", h.value = void 0;
      try {
        const e = await H.sendTest();
        h.value = { message_id: e.message_id, status: "queued" }, await F();
      } catch (e) {
        M.value = R(e, "The test email could not be sent.");
      } finally {
        N.value = !1, x();
      }
    }
    const P = w(() => {
      const e = h.value?.last_error;
      if (e)
        return $e(e.code, m.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), z = w(() => f.value ? "" : "Choose a service to send a test.");
    return (e, s) => (t(), i("section", {
      ref_key: "root",
      ref: S,
      class: "mail-delivery",
      "aria-label": "Mail delivery settings"
    }, [
      l(Se, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: k(() => [
          l(a(B), {
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
      y.value ? (t(), i("p", Qe, [
        l(a(p), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[3] || (s[3] = _("Loading delivery settings…", -1))
      ])) : o.value ? (t(), i("p", Xe, [
        l(a(p), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        s[4] || (s[4] = _("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : d.value && !m.value ? (t(), i("div", Ye, [
        u("span", null, c(d.value), 1),
        l(a(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: s[1] || (s[1] = (r) => x())
        })
      ])) : m.value ? (t(), i(ye, { key: 3 }, [
        d.value ? (t(), i("p", Ze, c(d.value), 1)) : v("", !0),
        !m.value.configured && m.value.reason ? (t(), i("p", et, [
          l(a(p), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            s[5] || (s[5] = u("strong", null, "Mail is not set up yet.", -1)),
            _(" " + c(m.value.reason), 1)
          ])
        ])) : v("", !0),
        C.value ? (t(), i("p", tt, [
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
              description: ee.value
            }, ge({
              actions: k(() => [
                u("span", st, [
                  l(a(be), {
                    "model-value": f.value?.id,
                    options: Z.value,
                    "option-label": "label",
                    "option-value": "value",
                    "append-to": "self",
                    fluid: "",
                    placeholder: "Choose a service…",
                    "aria-label": "Service",
                    loading: T.value,
                    disabled: T.value,
                    "empty-message": "No delivery service is installed",
                    "onUpdate:modelValue": te
                  }, {
                    value: k(({ value: r, placeholder: $ }) => [
                      r && f.value ? (t(), i("span", at, [
                        l(a(p), {
                          icon: f.value.icon,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        _(c(f.value.title), 1)
                      ])) : (t(), i("span", it, c($), 1))
                    ]),
                    option: k(({ option: r }) => [
                      u("span", lt, [
                        u("span", nt, [
                          l(a(p), {
                            icon: r.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          _(c(r.label), 1)
                        ]),
                        l(a(U), {
                          severity: r.ready ? "success" : "warn",
                          value: r.ready ? "Ready" : "Needs setup",
                          class: "kx-tag-sm"
                        }, null, 8, ["severity", "value"]),
                        !r.ready && r.reason ? (t(), i("span", ot, c(r.reason), 1)) : v("", !0)
                      ])
                    ]),
                    _: 1
                  }, 8, ["model-value", "options", "loading", "disabled"]),
                  I.value ? (t(), i("small", rt, c(I.value), 1)) : v("", !0)
                ])
              ]),
              _: 2
            }, [
              f.value ? {
                name: "status",
                fn: k(() => [
                  l(a(U), {
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
        l(K, { config: se }),
        q.value ? (t(), X(K, {
          key: q.value.namespace,
          config: q.value
        }, null, 8, ["config"])) : v("", !0),
        l(j, { title: "Test" }, {
          default: k(() => [
            l(J, {
              title: "Send a test email",
              description: z.value || "Sends a short message to you with the saved settings."
            }, {
              actions: k(() => [
                l(a(B), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: N.value,
                  disabled: !!z.value || N.value,
                  onClick: ie
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
            h.value || M.value ? (t(), i("div", ct, [
              M.value ? (t(), i("p", ut, [
                l(a(p), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                _(c(M.value), 1)
              ])) : h.value?.status === "queued" ? (t(), i("p", dt, [
                l(a(p), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                s[6] || (s[6] = _("Sending the test…", -1))
              ])) : h.value?.status === "sent" ? (t(), i("p", vt, [
                l(a(p), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                s[7] || (s[7] = _("The test was accepted for delivery. Check your inbox.", -1))
              ])) : h.value?.status === "failed" && P.value ? (t(), i("div", mt, [
                l(a(p), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", ht, [
                  u("strong", null, c(P.value.lead), 1),
                  u("span", null, c(P.value.next), 1),
                  l(a(B), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: s[2] || (s[2] = (r) => V("/activity/" + encodeURIComponent(h.value.message_id)))
                  })
                ])
              ])) : v("", !0),
              D.value ? (t(), i("p", pt, c(D.value), 1)) : v("", !0)
            ])) : v("", !0)
          ]),
          _: 1
        })
      ], 64)) : v("", !0)
    ], 512));
  }
}), St = { rootComponent: yt, plugins: [ne] };
export {
  St as config
};
