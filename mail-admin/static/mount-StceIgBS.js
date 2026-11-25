import { u as re, P as ce } from "./wc-runtime-UUwuoPn6.js";
import { defineComponent as q, useId as te, openBlock as t, createElementBlock as a, unref as l, createElementVNode as u, toDisplayString as c, createCommentVNode as d, renderSlot as E, useModel as ue, useSlots as de, ref as k, watch as ve, normalizeClass as me, createVNode as n, createBlock as I, Transition as pe, withCtx as f, withDirectives as he, vShow as ge, mergeModels as ye, onMounted as fe, createTextVNode as _, shallowRef as W, computed as $, reactive as ke, Fragment as K, createSlots as _e, renderList as be } from "vue";
import { api as xe, loadByTagName as $e, host as we } from "@wippy-fe/proxy";
import { Icon as h } from "@iconify/vue";
import L from "primevue/button";
import Se from "primevue/select";
import Q from "primevue/tag";
import { I as Te, J as Ce, A as Me, u as De, z as Ee, _ as Ie, h as Ne, H as X, i as Re, d as V, t as Be, D as Le, g as Y } from "./navigation-DC1TuBvs.js";
const Ve = ["aria-labelledby"], qe = {
  key: 0,
  class: "kx-settings-group-head"
}, Ae = ["id"], Ue = {
  key: 0,
  class: "kx-settings-group-count"
}, ze = { class: "kx-settings-group-list" }, F = /* @__PURE__ */ q({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(o) {
    const g = te();
    return (r, v) => (t(), a("section", {
      class: "kx-settings-group",
      "aria-labelledby": o.title ? l(g) : void 0
    }, [
      o.title ? (t(), a("div", qe, [
        u("h2", {
          id: l(g),
          class: "kx-settings-group-title"
        }, c(o.title), 9, Ae),
        o.count !== void 0 ? (t(), a("span", Ue, c(o.count), 1)) : d("", !0)
      ])) : d("", !0),
      u("div", ze, [
        E(r.$slots, "default")
      ])
    ], 8, Ve));
  }
}), Oe = { class: "kx-settings-item-head" }, Pe = { class: "kx-settings-item-main" }, Fe = { class: "kx-settings-item-line" }, He = { class: "kx-settings-item-title" }, Ge = {
  key: 0,
  class: "kx-settings-item-desc"
}, Je = {
  key: 1,
  class: "kx-settings-item-meta"
}, je = { class: "kx-settings-item-actions" }, We = ["aria-expanded", "aria-controls", "aria-label"], Ke = ["id", "inert"], Qe = { class: "kx-settings-item-clip" }, Xe = { class: "kx-settings-item-body" }, Z = /* @__PURE__ */ q({
  __name: "SettingsItem",
  props: /* @__PURE__ */ ye({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(o) {
    const g = o, r = ue(o, "open"), v = de(), m = te(), S = k(r.value);
    return ve(r, (b) => {
      b && (S.value = !0);
    }), (b, w) => (t(), a("article", {
      class: me(["kx-settings-item", { "kx-settings-item-open": r.value && l(v).default }])
    }, [
      u("div", Oe, [
        u("div", Pe, [
          u("div", Fe, [
            u("h3", He, c(o.title), 1),
            E(b.$slots, "status")
          ]),
          o.description ? (t(), a("p", Ge, c(o.description), 1)) : d("", !0),
          l(v).meta ? (t(), a("p", Je, [
            E(b.$slots, "meta")
          ])) : d("", !0)
        ]),
        u("div", je, [
          l(v).default ? (t(), a("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": r.value,
            "aria-controls": l(m),
            "aria-label": (o.expandLabel || "Details") + " " + o.title,
            onClick: w[0] || (w[0] = (A) => r.value = !r.value)
          }, [
            u("span", null, c(o.expandLabel || "Details"), 1),
            n(l(h), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, We)) : d("", !0),
          E(b.$slots, "actions")
        ])
      ]),
      l(v).default ? (t(), I(pe, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: f(() => [
          S.value || g.keepMounted ? he((t(), a("div", {
            key: 0,
            id: l(m),
            inert: !r.value,
            class: "kx-settings-item-panel"
          }, [
            u("div", Qe, [
              u("div", Xe, [
                E(b.$slots, "default")
              ])
            ])
          ], 8, Ke)), [
            [ge, r.value]
          ]) : d("", !0)
        ]),
        _: 3
      })) : d("", !0)
    ], 2));
  }
});
async function Ye(o, g) {
  try {
    const { data: r } = await xe.put("/api/v1/settings", { namespace: "kickside.mail", key: "driver", value: o, expected_revision: g });
    if (r?.success) return;
    throw Te(r, "Delivery service");
  } catch (r) {
    throw Ce(r, "Delivery service");
  }
}
const Ze = (o) => o instanceof Me && o.status === 409, et = {
  key: 0,
  class: "mail-provider-frame"
}, tt = ["^config"], st = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, at = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ee = "kickside-settings-provider", H = /* @__PURE__ */ q({
  __name: "SettingsProvider",
  props: {
    config: {}
  },
  setup(o) {
    const g = k(!!customElements.get(ee)), r = k("");
    return fe(async () => {
      if (!g.value)
        try {
          await $e(ee, { timeoutMs: 8e3 }), g.value = !0;
        } catch (v) {
          r.value = v instanceof Error ? v.message : String(v);
        }
    }), (v, m) => g.value ? (t(), a("div", et, [
      u("kickside-settings-provider", {
        class: "mail-provider",
        "^config": JSON.stringify(o.config)
      }, null, 8, tt)
    ])) : r.value ? (t(), a("p", st, "The " + c(o.config.title) + " settings could not be loaded. " + c(r.value), 1)) : (t(), a("p", at, [
      n(l(h), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      _("Loading " + c(o.config.title) + " settings…", 1)
    ]));
  }
}), it = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, lt = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, nt = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, ot = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, rt = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "status"
}, ct = {
  key: 2,
  class: "kx-notice info mail-block",
  role: "status"
}, ut = { class: "mail-setting-control" }, dt = {
  key: 0,
  class: "mail-kind"
}, vt = { key: 1 }, mt = { class: "mail-service-option" }, pt = { class: "mail-kind" }, ht = {
  key: 0,
  class: "mail-sub"
}, gt = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, yt = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, ft = {
  key: 0,
  class: "kx-notice error mail-block"
}, kt = {
  key: 1,
  class: "kx-notice mail-block"
}, _t = {
  key: 2,
  class: "kx-notice info mail-block"
}, bt = {
  key: 3,
  class: "kx-notice error mail-block"
}, xt = { class: "mail-failure-body" }, $t = {
  key: 4,
  class: "kx-notice warn mail-block",
  role: "alert"
}, wt = /* @__PURE__ */ q({
  __name: "DeliverySettings",
  setup(o) {
    const g = k(!0), r = k(!1), v = k(""), m = W(), S = k(), b = Y();
    async function w() {
      const e = b();
      try {
        const s = await X.status();
        if (!e()) return;
        m.value = s, r.value = !1, v.value = "";
      } catch (s) {
        if (!e()) return;
        r.value = Re(s), v.value = r.value ? "" : V(s, "Delivery settings could not be loaded.");
      } finally {
        e() && (g.value = !1);
      }
    }
    function A(e = "") {
      Be(S.value, "/system/mail" + e);
    }
    const N = $(() => m.value?.transports ?? []), y = $(() => N.value.find((e) => e.id === m.value?.driver?.id)), se = $(() => N.value.map((e) => ({
      value: e.id,
      label: e.title,
      icon: e.icon,
      ready: e.ready,
      reason: e.reason
    }))), ae = $(() => {
      const e = y.value;
      return e ? e.ready ? e.description : e.reason ?? e.description : "Choose the service that delivers your email.";
    }), T = k(!1), R = k(""), C = k("");
    async function ie(e) {
      const s = m.value;
      if (!e || !s || e === s.driver?.id || T.value) return;
      const i = N.value.find((x) => x.id === e);
      if (i && !(s.driver && !await we.confirm({
        header: `Send email through ${i.title}?`,
        message: `Email sent after this goes through ${i.title} instead of ${s.driver.label}.`,
        acceptLabel: `Use ${i.title}`,
        rejectLabel: "Cancel"
      }))) {
        T.value = !0, R.value = C.value = "";
        try {
          await Ye(e, s.driver_revision), C.value = `Mail now sends through ${i.title}.`;
        } catch (x) {
          Ze(x) ? C.value = "Someone changed the delivery service while you were here. It shows the current choice now." : R.value = V(x, "The delivery service could not be changed.");
        } finally {
          await w(), T.value = !1;
        }
      }
    }
    const G = (e) => ({ namespace: e.settings_ns, title: e.title, icon: e.icon, help: e.description }), U = $(() => y.value && G(y.value)), J = $(() => N.value.filter((e) => e.id !== y.value?.id)), z = ke({}), le = {
      namespace: "kickside.mail",
      title: "Sender",
      icon: "tabler:at",
      help: "Who recipients see the email from, where replies go, and how long Mail keeps the delivery log."
    }, p = W(), B = k(!1), M = k(""), D = k(""), ne = Y();
    async function O() {
      const e = p.value?.message_id;
      if (!e) return;
      const s = ne();
      try {
        const i = await Le.get(e);
        s() && p.value?.message_id === e && (p.value = i, D.value = "");
      } catch (i) {
        s() && p.value?.message_id === e && (D.value = V(i, "The test email status could not be loaded."));
      }
    }
    re(async () => {
      await w(), p.value?.status === "queued" && await O();
    }), De("mail.activity", () => {
      p.value?.status === "queued" && O();
    });
    async function oe() {
      B.value = !0, M.value = D.value = "", p.value = void 0;
      try {
        const e = await X.sendTest();
        p.value = { message_id: e.message_id, status: "queued" }, await O();
      } catch (e) {
        M.value = V(e, "The test email could not be sent.");
      } finally {
        B.value = !1, w();
      }
    }
    const P = $(() => {
      const e = p.value?.last_error;
      if (e)
        return Ee(e.code, m.value?.driver?.label ?? "The service", "above") ?? { lead: "The service did not accept the test.", next: e.message };
    }), j = $(() => y.value ? "" : "Choose a service to send a test.");
    return (e, s) => (t(), a("section", {
      ref_key: "root",
      ref: S,
      class: "mail-delivery",
      "aria-label": "Mail delivery settings"
    }, [
      n(Ie, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: f(() => [
          n(l(L), {
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: s[0] || (s[0] = (i) => A())
          }, {
            icon: f(() => [
              n(l(h), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      g.value ? (t(), a("p", it, [
        n(l(h), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        s[3] || (s[3] = _("Loading delivery settings…", -1))
      ])) : r.value ? (t(), a("p", lt, [
        n(l(h), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        s[4] || (s[4] = _("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : v.value && !m.value ? (t(), a("div", nt, [
        u("span", null, c(v.value), 1),
        n(l(L), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: s[1] || (s[1] = (i) => w())
        })
      ])) : m.value ? (t(), a(K, { key: 3 }, [
        v.value ? (t(), a("p", ot, c(v.value), 1)) : d("", !0),
        !m.value.configured && m.value.reason ? (t(), a("p", rt, [
          n(l(h), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          u("span", null, [
            s[5] || (s[5] = u("strong", null, "Mail is not set up yet.", -1)),
            _(" " + c(m.value.reason), 1)
          ])
        ])) : d("", !0),
        C.value ? (t(), a("p", ct, [
          n(l(h), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          _(c(C.value), 1)
        ])) : d("", !0),
        n(F, {
          title: "Delivery service",
          class: "mail-service-group"
        }, {
          default: f(() => [
            n(Z, {
              title: "Service",
              description: ae.value
            }, _e({
              actions: f(() => [
                u("span", ut, [
                  n(l(Se), {
                    "model-value": y.value?.id,
                    options: se.value,
                    "option-label": "label",
                    "option-value": "value",
                    "append-to": "self",
                    fluid: "",
                    placeholder: "Choose a service…",
                    "aria-label": "Service",
                    loading: T.value,
                    disabled: T.value,
                    "empty-message": "No delivery service is installed",
                    "onUpdate:modelValue": ie
                  }, {
                    value: f(({ value: i, placeholder: x }) => [
                      i && y.value ? (t(), a("span", dt, [
                        n(l(h), {
                          icon: y.value.icon,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        _(c(y.value.title), 1)
                      ])) : (t(), a("span", vt, c(x), 1))
                    ]),
                    option: f(({ option: i }) => [
                      u("span", mt, [
                        u("span", pt, [
                          n(l(h), {
                            icon: i.icon,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          _(c(i.label), 1)
                        ]),
                        n(l(Q), {
                          severity: i.ready ? "success" : "warn",
                          value: i.ready ? "Ready" : "Needs setup",
                          class: "kx-tag-sm"
                        }, null, 8, ["severity", "value"]),
                        !i.ready && i.reason ? (t(), a("span", ht, c(i.reason), 1)) : d("", !0)
                      ])
                    ]),
                    _: 1
                  }, 8, ["model-value", "options", "loading", "disabled"]),
                  R.value ? (t(), a("small", gt, c(R.value), 1)) : d("", !0)
                ])
              ]),
              _: 2
            }, [
              y.value ? {
                name: "status",
                fn: f(() => [
                  n(l(Q), {
                    severity: y.value.ready ? "success" : "warn",
                    value: y.value.ready ? "Ready" : "Needs setup",
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["description"])
          ]),
          _: 1
        }),
        U.value ? (t(), I(H, {
          key: U.value.namespace,
          config: U.value
        }, null, 8, ["config"])) : d("", !0),
        J.value.length ? (t(), I(F, {
          key: 4,
          title: y.value ? "Other services" : "Services",
          class: "mail-other-services"
        }, {
          default: f(() => [
            (t(!0), a(K, null, be(J.value, (i) => (t(), I(Ne, {
              key: i.id,
              open: z[i.id],
              "onUpdate:open": (x) => z[i.id] = x,
              label: i.title
            }, {
              default: f(() => [
                z[i.id] ? (t(), I(H, {
                  key: 0,
                  config: G(i)
                }, null, 8, ["config"])) : d("", !0)
              ]),
              _: 2
            }, 1032, ["open", "onUpdate:open", "label"]))), 128))
          ]),
          _: 1
        }, 8, ["title"])) : d("", !0),
        n(H, { config: le }),
        n(F, { title: "Test" }, {
          default: f(() => [
            n(Z, {
              title: "Send a test email",
              description: j.value || "Sends a short message to you with the saved settings."
            }, {
              actions: f(() => [
                n(l(L), {
                  label: "Send test email",
                  severity: "secondary",
                  outlined: "",
                  loading: B.value,
                  disabled: !!j.value || B.value,
                  onClick: oe
                }, {
                  icon: f(() => [
                    n(l(h), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            }, 8, ["description"]),
            p.value || M.value ? (t(), a("div", yt, [
              M.value ? (t(), a("p", ft, [
                n(l(h), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                _(c(M.value), 1)
              ])) : p.value?.status === "queued" ? (t(), a("p", kt, [
                n(l(h), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                s[6] || (s[6] = _("Sending the test…", -1))
              ])) : p.value?.status === "sent" ? (t(), a("p", _t, [
                n(l(h), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                s[7] || (s[7] = _("The test was accepted for delivery. Check your inbox.", -1))
              ])) : p.value?.status === "failed" && P.value ? (t(), a("div", bt, [
                n(l(h), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                u("div", xt, [
                  u("strong", null, c(P.value.lead), 1),
                  u("span", null, c(P.value.next), 1),
                  n(l(L), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open it in Activity",
                    onClick: s[2] || (s[2] = (i) => A("/activity/" + encodeURIComponent(p.value.message_id)))
                  })
                ])
              ])) : d("", !0),
              D.value ? (t(), a("p", $t, c(D.value), 1)) : d("", !0)
            ])) : d("", !0)
          ]),
          _: 1
        })
      ], 64)) : d("", !0)
    ], 512));
  }
}), Rt = { rootComponent: wt, plugins: [ce] };
export {
  Rt as config
};
