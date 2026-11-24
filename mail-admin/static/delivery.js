import { defineComponent as me, useId as B, computed as S, ref as y, watch as le, openBlock as o, createElementBlock as r, createCommentVNode as V, Fragment as J, renderList as pe, normalizeClass as se, createElementVNode as a, unref as n, toDisplayString as f, createVNode as v, createBlock as U, shallowRef as L, onMounted as $e, withCtx as D, createTextVNode as O, resolveDynamicComponent as Te } from "vue";
import "./wc-runtime-IM7bQYl9.js";
import "pinia";
import { A as ye, G as fe, H as ge, d as G, w as Ce, _ as Ee, m as Ne, E as ve, i as Oe, z as Ue, F as De } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-CcUSMp3N.js";
import { loadByTagName as Re, api as Q, host as ce, define as Me } from "@wippy-fe/proxy";
import { Icon as w } from "@iconify/vue";
import P from "primevue/button";
import je from "primevue/dialog";
import W from "primevue/inputtext";
import _e from "primevue/select";
import Ae from "primevue/inputnumber";
import Pe from "primevue/password";
import Fe from "primevue/tag";
import Ie from "primevue/toggleswitch";
const ee = /* @__PURE__ */ new Map();
function Le(_) {
  let d = ee.get(_);
  return d || (d = Promise.resolve(Re(_)).then(() => !0, () => (ee.delete(_), !1)), ee.set(_, d)), d;
}
const Be = () => ge(() => Q.get("/api/v1/mail-admin/drivers"), "Delivery services").then((_) => _.items);
async function H(_) {
  try {
    const { data: d } = await Q.get("/api/v1/settings", { params: { namespace: _ } });
    if (d?.success && Array.isArray(d.settings)) return d.settings.filter((m) => m.namespace === _);
    throw new ye({ error: d?.error, kind: "INTERNAL" }, "Settings");
  } catch (d) {
    throw fe(d, "Settings");
  }
}
async function Je(_) {
  try {
    const { data: d } = await Q.put("/api/v1/settings", { values: _ });
    if (d?.success) return;
    throw new ye({ error: d?.error, kind: "INVALID" }, "Save settings");
  } catch (d) {
    const m = d?.response?.data;
    if (m && typeof m.namespace == "string" && typeof m.key == "string")
      return { namespace: m.namespace, key: m.key, error: typeof m.message == "string" ? m.message : String(m.error ?? "") };
    throw fe(d, "Save settings");
  }
}
const ze = () => ge(() => Q.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), qe = ["disabled"], Ge = {
  key: 0,
  class: "mail-setting-row mail-setting-help"
}, He = { class: "mail-setting-text" }, Ke = ["for"], We = {
  key: 0,
  class: "mail-setting-help"
}, Qe = { class: "mail-setting-control" }, Xe = {
  key: 0,
  class: "mail-secret"
}, Ye = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, Ze = /* @__PURE__ */ me({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(_, { emit: d }) {
    const m = _, R = d, g = B(), M = S(() => m.settings.filter((i) => i.editable !== !1).sort((i, u) => (i.order ?? 100) - (u.order ?? 100))), p = y({}), j = y({});
    le(() => m.settings, (i) => {
      p.value = Object.fromEntries(i.map((u) => [u.key, u.is_secret || u.value_type === "secret" ? "" : u.value ?? u.default ?? ""])), j.value = {};
    }, { immediate: !0 });
    const x = (i) => i.is_secret || i.value_type === "secret";
    function A(i) {
      const u = p.value[i.key], t = i.schema?.pattern;
      return t && typeof u == "string" && u && !new RegExp(t).test(u) ? "This value does not have the expected form." : "";
    }
    const C = (i) => A(i) || m.errors[i.key] || "";
    le(p, (i) => {
      const u = {};
      for (const t of m.settings) {
        const c = i[t.key];
        if (x(t)) {
          c && (u[t.key] = c);
          continue;
        }
        c !== (t.value ?? t.default ?? "") && (u[t.key] = c);
      }
      R("change", u), R("validity", m.settings.every((t) => !A(t)));
    }, { deep: !0 });
    const h = (i) => (i.schema?.enum ?? []).map((u) => ({ label: String(u), value: u }));
    return (i, u) => (o(), r("fieldset", {
      class: "mail-delivery-rows",
      disabled: _.disabled
    }, [
      M.value.length ? V("", !0) : (o(), r("p", Ge, "This service needs no settings of its own.")),
      (o(!0), r(J, null, pe(M.value, (t) => (o(), r("div", {
        key: t.key,
        class: se(["mail-setting-row", { "mail-setting-invalid": C(t) }])
      }, [
        a("div", He, [
          a("label", {
            class: "mail-setting-title",
            for: n(g) + t.key
          }, f(t.title || t.key), 9, Ke),
          t.description ? (o(), r("p", We, f(t.description), 1)) : V("", !0)
        ]),
        a("div", Qe, [
          x(t) ? (o(), r(J, { key: 0 }, [
            t.has_value && !j.value[t.key] ? (o(), r("div", Xe, [
              v(n(Fe), {
                severity: "success",
                value: "Set"
              }),
              v(n(P), {
                label: "Replace",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: (c) => j.value[t.key] = !0
              }, null, 8, ["onClick"])
            ])) : (o(), U(n(Pe), {
              key: 1,
              modelValue: p.value[t.key],
              "onUpdate:modelValue": (c) => p.value[t.key] = c,
              "input-id": n(g) + t.key,
              feedback: !1,
              "toggle-mask": "",
              fluid: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"]))
          ], 64)) : h(t).length ? (o(), U(n(_e), {
            key: 1,
            modelValue: p.value[t.key],
            "onUpdate:modelValue": (c) => p.value[t.key] = c,
            "input-id": n(g) + t.key,
            options: h(t),
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            fluid: ""
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id", "options"])) : t.value_type === "bool" ? (o(), U(n(Ie), {
            key: 2,
            modelValue: p.value[t.key],
            "onUpdate:modelValue": (c) => p.value[t.key] = c,
            "input-id": n(g) + t.key
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"])) : t.value_type === "int" ? (o(), U(n(Ae), {
            key: 3,
            modelValue: p.value[t.key],
            "onUpdate:modelValue": (c) => p.value[t.key] = c,
            "input-id": n(g) + t.key,
            fluid: ""
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"])) : (o(), U(n(W), {
            key: 4,
            modelValue: p.value[t.key],
            "onUpdate:modelValue": (c) => p.value[t.key] = c,
            id: n(g) + t.key,
            fluid: "",
            invalid: !!C(t)
          }, null, 8, ["modelValue", "onUpdate:modelValue", "id", "invalid"])),
          C(t) ? (o(), r("small", Ye, f(C(t)), 1)) : V("", !0)
        ])
      ], 2))), 128))
    ], 8, qe));
  }
}), el = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, ll = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, sl = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, tl = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, al = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, il = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, ol = ["disabled", "inert"], nl = { class: "mail-settings-list" }, rl = { class: "mail-setting-row" }, dl = { class: "mail-setting-text" }, ul = ["for"], vl = { class: "mail-setting-help" }, cl = { class: "mail-setting-control" }, ml = {
  key: 0,
  class: "mail-kind"
}, pl = { key: 1 }, yl = { class: "mail-kind" }, fl = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, gl = {
  key: 1,
  class: "kx-err inline mail-driver-error",
  role: "alert"
}, _l = { class: "mail-settings-list" }, kl = { class: "mail-setting-text" }, hl = ["for"], bl = { class: "mail-setting-control" }, wl = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Vl = { class: "mail-setting-row" }, xl = { class: "mail-setting-text" }, Sl = ["for"], $l = { class: "mail-setting-control" }, Tl = { class: "mail-setting-text" }, Cl = ["for"], El = { class: "mail-setting-control" }, Nl = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ol = { class: "mail-settings-list" }, Ul = { class: "mail-setting-row" }, Dl = { class: "mail-setting-control mail-test-control" }, Rl = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, Ml = {
  key: 0,
  class: "kx-notice error mail-block"
}, jl = {
  key: 1,
  class: "kx-notice mail-block"
}, Al = {
  key: 2,
  class: "kx-notice info mail-block"
}, Pl = {
  key: 3,
  class: "kx-notice error mail-block"
}, Fl = { class: "mail-failure-body" }, Il = {
  key: 0,
  class: "mail-problem-detail"
}, Ll = { class: "kx-modal-head-icon" }, Bl = { class: "mail-change-list" }, Jl = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, K = "kickside.mail", zl = /* @__PURE__ */ me({
  __name: "DeliverySettings",
  setup(_) {
    const d = { driver: B(), address: B(), name: B(), reply: B() }, m = y(!0), R = y(!1), g = y(""), M = L([]), p = L(), j = L([]), x = L([]), A = y(!1), C = y(""), h = y({ driver: "", from_address: "", from_name: "", reply_to: "" }), i = y({ ...h.value }), u = y({}), t = y(!0), c = y({}), k = y(), z = y("");
    function te(s) {
      const e = (l) => {
        const T = s.find((N) => N.key === l);
        return typeof T?.value == "string" ? T.value : "";
      };
      return { driver: e("driver"), from_address: e("from_address"), from_name: e("from_name"), reply_to: e("reply_to") };
    }
    async function ae() {
      m.value = !0, g.value = "";
      try {
        const [s, e, l] = await Promise.all([Be(), ve.status(), H(K)]);
        M.value = s, p.value = e, j.value = l, h.value = te(l), i.value = { ...h.value }, R.value = !1;
      } catch (s) {
        R.value = Oe(s), g.value = R.value ? "" : G(s, "Delivery settings could not be loaded.");
      } finally {
        m.value = !1;
      }
    }
    $e(ae);
    const $ = S(() => M.value.find((s) => s.id === i.value.driver)), X = y(!1);
    le($, async (s) => {
      if (u.value = {}, t.value = !0, c.value = {}, x.value = [], X.value = !1, !!s) {
        A.value = !0, C.value = "";
        try {
          const [e, l] = await Promise.all([H(s.settings_ns), s.settings_view ? Le(s.settings_view) : Promise.resolve(!1)]);
          if ($.value?.id !== s.id) return;
          x.value = e, X.value = l, s.settings_view && !l && (C.value = `The ${s.label} settings could not be loaded. Reload the page to try again.`);
        } catch (e) {
          C.value = G(e, `The ${s.label} settings could not be loaded.`);
        } finally {
          A.value = !1;
        }
      }
    });
    const ke = S(() => JSON.stringify(Object.fromEntries(x.value.filter((s) => !(s.is_secret || s.value_type === "secret")).map((s) => [s.key, s.value ?? s.default ?? null])))), he = S(() => JSON.stringify(Object.fromEntries(x.value.filter((s) => s.is_secret || s.value_type === "secret").map((s) => [s.key, !!s.has_value])))), be = S(() => JSON.stringify(c.value));
    function ie(s, e) {
      const l = s.detail;
      e === "change" && l?.values && typeof l.values == "object" && (u.value = { ...l.values }), e === "validity" && typeof l?.valid == "boolean" && (t.value = l.valid);
    }
    const oe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, E = S(() => ({
      from_address: i.value.from_address && !oe.test(i.value.from_address) ? "Enter an email address such as support@example.com." : c.value.from_address ?? "",
      reply_to: i.value.reply_to && !oe.test(i.value.reply_to) ? "Enter an email address, or leave it empty." : c.value.reply_to ?? ""
    })), F = y(!1), we = S(() => {
      const s = [];
      i.value.driver !== h.value.driver && s.push(`Service: ${$.value?.label ?? "none"}`);
      const e = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" };
      for (const l of Object.keys(e)) i.value[l] !== h.value[l] && s.push(e[l]);
      for (const l of Object.keys(u.value)) {
        const T = x.value.find((N) => N.key === l);
        s.push(`${$.value?.label}: ${T?.title ?? l}`);
      }
      return s;
    }), q = S(() => JSON.stringify(i.value) !== JSON.stringify(h.value) || Object.keys(u.value).length > 0), ne = S(() => !!E.value.from_address || !!E.value.reply_to || !t.value), Y = y(0);
    function Ve() {
      i.value = { ...h.value }, u.value = {}, c.value = {}, x.value = [...x.value], Y.value++;
    }
    async function xe() {
      if (k.value || ne.value) return;
      k.value = "save", z.value = g.value = "", c.value = {};
      const s = [], e = $.value?.settings_ns;
      if (e) for (const [l, T] of Object.entries(u.value)) s.push({ namespace: e, key: l, value: T === "" ? null : T });
      for (const l of ["from_address", "from_name", "reply_to"])
        i.value[l] !== h.value[l] && s.push({ namespace: K, key: l, value: i.value[l] || null });
      i.value.driver !== h.value.driver && s.push({ namespace: K, key: "driver", value: i.value.driver || null });
      try {
        const l = await Je(s);
        if (l) {
          c.value = { [l.key]: l.error }, g.value = "Some changes were not saved. Correct the highlighted value and save again.";
          return;
        }
        const [T, N] = await Promise.all([ve.status(), H(K)]);
        p.value = T, j.value = N, h.value = te(N), i.value = { ...h.value }, e && (x.value = await H(e)), u.value = {}, Y.value++, F.value = !1, z.value = "Delivery settings saved.";
      } catch (l) {
        g.value = G(l, "Delivery settings could not be saved.");
      } finally {
        k.value = void 0;
      }
    }
    const b = L(), I = y("");
    async function re() {
      if (b.value)
        try {
          b.value = await Ue.get(b.value.message_id);
        } catch {
        }
    }
    Ce((s) => {
      s.message_id === b.value?.message_id && re();
    });
    async function Se() {
      k.value = "test", I.value = "", b.value = void 0;
      try {
        const s = await ze();
        b.value = { message_id: s.message_id, status: "queued" }, await re();
      } catch (s) {
        I.value = G(s, "The test email could not be sent.");
      } finally {
        k.value = void 0;
      }
    }
    const de = S(() => b.value && "last_error" in b.value ? b.value.last_error?.message ?? "" : ""), Z = S(() => M.value.map((s) => ({ value: s.id, label: s.label, icon: s.icon, description: s.description }))), ue = S(() => {
      const s = p.value;
      if (!(!s || s.configured))
        return s.reason ?? "Mail delivery is not set up.";
    });
    return (s, e) => (o(), r("section", el, [
      v(Ee, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: D(() => [
          q.value ? (o(), U(Ne, {
            key: 0,
            busy: k.value === "save",
            "review-disabled": ne.value,
            onDiscard: Ve,
            onReview: e[0] || (e[0] = (l) => F.value = !0)
          }, null, 8, ["busy", "review-disabled"])) : (o(), U(n(P), {
            key: 1,
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: e[1] || (e[1] = (l) => n(ce).navigate("/system/mail"))
          }, {
            icon: D(() => [
              v(n(w), {
                icon: "tabler:template",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }))
        ]),
        _: 1
      }),
      m.value ? (o(), r("p", ll, [
        v(n(w), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        e[14] || (e[14] = O("Loading delivery settings…", -1))
      ])) : R.value ? (o(), r("p", sl, [
        v(n(w), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        e[15] || (e[15] = O("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (o(), r(J, { key: 2 }, [
        g.value ? (o(), r("div", tl, [
          a("span", null, f(g.value), 1),
          M.value.length ? V("", !0) : (o(), U(n(P), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: e[2] || (e[2] = (l) => ae())
          }))
        ])) : V("", !0),
        z.value ? (o(), r("p", al, [
          v(n(w), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          O(f(z.value), 1)
        ])) : V("", !0),
        ue.value && !q.value ? (o(), r("p", il, [
          v(n(w), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          a("span", null, [
            e[16] || (e[16] = a("strong", null, "Mail is not set up yet.", -1)),
            O(" " + f(ue.value), 1)
          ])
        ])) : V("", !0),
        a("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: k.value === "save",
          inert: k.value === "save" || void 0
        }, [
          e[20] || (e[20] = a("h2", { class: "mail-label" }, "Delivery service", -1)),
          a("div", nl, [
            a("div", rl, [
              a("div", dl, [
                a("label", {
                  class: "mail-setting-title",
                  for: d.driver
                }, "Service", 8, ul),
                a("p", vl, f($.value?.description || "Choose the service that delivers your email."), 1)
              ]),
              a("div", cl, [
                v(n(_e), {
                  modelValue: i.value.driver,
                  "onUpdate:modelValue": e[3] || (e[3] = (l) => i.value.driver = l),
                  "input-id": d.driver,
                  options: Z.value,
                  "option-label": "label",
                  "option-value": "value",
                  "append-to": "self",
                  placeholder: "Choose a service…",
                  fluid: "",
                  "empty-message": "No delivery service is installed"
                }, {
                  value: D(({ value: l, placeholder: T }) => [
                    l ? (o(), r("span", ml, [
                      v(n(w), {
                        icon: Z.value.find((N) => N.value === l)?.icon ?? "tabler:mail",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      O(f(Z.value.find((N) => N.value === l)?.label ?? l), 1)
                    ])) : (o(), r("span", pl, f(T), 1))
                  ]),
                  option: D(({ option: l }) => [
                    a("span", yl, [
                      v(n(w), {
                        icon: l.icon,
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      O(f(l.label), 1)
                    ])
                  ]),
                  _: 1
                }, 8, ["modelValue", "input-id", "options"])
              ])
            ]),
            A.value ? (o(), r("p", fl, [
              v(n(w), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              O("Loading " + f($.value?.label) + " settings…", 1)
            ])) : C.value ? (o(), r("p", gl, f(C.value), 1)) : $.value ? (o(), r(J, { key: 2 }, [
              $.value.settings_view && X.value ? (o(), U(Te($.value.settings_view), {
                key: $.value.id + ":" + Y.value,
                class: "mail-driver-view",
                "^values": ke.value,
                "^secrets": he.value,
                "^errors": be.value,
                "^disabled": String(k.value === "save"),
                onChange: e[4] || (e[4] = (l) => ie(l, "change")),
                onValidity: e[5] || (e[5] = (l) => ie(l, "validity"))
              }, null, 40, ["^values", "^secrets", "^errors", "^disabled"])) : (o(), U(Ze, {
                key: 1,
                settings: x.value,
                errors: c.value,
                disabled: k.value === "save",
                onChange: e[6] || (e[6] = (l) => u.value = l),
                onValidity: e[7] || (e[7] = (l) => t.value = l)
              }, null, 8, ["settings", "errors", "disabled"]))
            ], 64)) : V("", !0)
          ]),
          e[21] || (e[21] = a("h2", { class: "mail-label" }, "Sender", -1)),
          a("div", _l, [
            a("div", {
              class: se(["mail-setting-row", { "mail-setting-invalid": E.value.from_address }])
            }, [
              a("div", kl, [
                a("label", {
                  class: "mail-setting-title",
                  for: d.address
                }, "From address", 8, hl),
                e[17] || (e[17] = a("p", { class: "mail-setting-help" }, "The address recipients see and reply to by default. The service must accept mail from it.", -1))
              ]),
              a("div", bl, [
                v(n(W), {
                  id: d.address,
                  modelValue: i.value.from_address,
                  "onUpdate:modelValue": e[8] || (e[8] = (l) => i.value.from_address = l),
                  modelModifiers: { trim: !0 },
                  fluid: "",
                  placeholder: "support@example.com",
                  invalid: !!E.value.from_address
                }, null, 8, ["id", "modelValue", "invalid"]),
                E.value.from_address ? (o(), r("small", wl, f(E.value.from_address), 1)) : V("", !0)
              ])
            ], 2),
            a("div", Vl, [
              a("div", xl, [
                a("label", {
                  class: "mail-setting-title",
                  for: d.name
                }, "From name", 8, Sl),
                e[18] || (e[18] = a("p", { class: "mail-setting-help" }, "Shown next to the address, for example your company’s name.", -1))
              ]),
              a("div", $l, [
                v(n(W), {
                  id: d.name,
                  modelValue: i.value.from_name,
                  "onUpdate:modelValue": e[9] || (e[9] = (l) => i.value.from_name = l),
                  fluid: ""
                }, null, 8, ["id", "modelValue"])
              ])
            ]),
            a("div", {
              class: se(["mail-setting-row", { "mail-setting-invalid": E.value.reply_to }])
            }, [
              a("div", Tl, [
                a("label", {
                  class: "mail-setting-title",
                  for: d.reply
                }, "Reply-to", 8, Cl),
                e[19] || (e[19] = a("p", { class: "mail-setting-help" }, "Where replies go when it is not the From address. Optional.", -1))
              ]),
              a("div", El, [
                v(n(W), {
                  id: d.reply,
                  modelValue: i.value.reply_to,
                  "onUpdate:modelValue": e[10] || (e[10] = (l) => i.value.reply_to = l),
                  modelModifiers: { trim: !0 },
                  fluid: "",
                  invalid: !!E.value.reply_to
                }, null, 8, ["id", "modelValue", "invalid"]),
                E.value.reply_to ? (o(), r("small", Nl, f(E.value.reply_to), 1)) : V("", !0)
              ])
            ], 2)
          ])
        ], 8, ol),
        e[26] || (e[26] = a("h2", { class: "mail-label" }, "Test", -1)),
        a("div", Ol, [
          a("div", Ul, [
            e[22] || (e[22] = a("div", { class: "mail-setting-text" }, [
              a("span", { class: "mail-setting-title" }, "Send a test email"),
              a("p", { class: "mail-setting-help" }, "Sends a short message to you with the saved settings.")
            ], -1)),
            a("div", Dl, [
              v(n(P), {
                label: "Send test email",
                severity: "secondary",
                outlined: "",
                loading: k.value === "test",
                disabled: q.value || !!k.value || !p.value?.configured,
                title: q.value ? "Save your changes first." : p.value?.configured ? void 0 : "Set up delivery first.",
                onClick: Se
              }, {
                icon: D(() => [
                  v(n(w), {
                    icon: "tabler:send",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled", "title"])
            ])
          ]),
          b.value || I.value ? (o(), r("div", Rl, [
            I.value ? (o(), r("p", Ml, [
              v(n(w), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              O(f(I.value), 1)
            ])) : b.value?.status === "queued" ? (o(), r("p", jl, [
              v(n(w), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              e[23] || (e[23] = O("Sending the test…", -1))
            ])) : b.value?.status === "sent" ? (o(), r("p", Al, [
              v(n(w), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              e[24] || (e[24] = O("The test was accepted for delivery. Check your inbox.", -1))
            ])) : b.value?.status === "failed" ? (o(), r("div", Pl, [
              v(n(w), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              a("div", Fl, [
                e[25] || (e[25] = a("strong", null, "The service did not accept the test.", -1)),
                de.value ? (o(), r("code", Il, f(de.value), 1)) : V("", !0),
                a("button", {
                  type: "button",
                  class: "mail-text-link",
                  onClick: e[11] || (e[11] = (l) => n(ce).navigate("/system/mail/activity/" + b.value.message_id))
                }, "Open it in Activity")
              ])
            ])) : V("", !0)
          ])) : V("", !0)
        ])
      ], 64)),
      v(n(je), {
        visible: F.value,
        modal: "",
        draggable: !1,
        closable: k.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": e[13] || (e[13] = (l) => {
          l || (F.value = !1);
        })
      }, {
        header: D(() => [
          a("span", Ll, [
            v(n(w), {
              icon: "tabler:checklist",
              "aria-hidden": "true"
            })
          ]),
          e[27] || (e[27] = a("span", { class: "kx-modal-head-text" }, [
            a("span", { class: "kx-modal-head-title" }, "Review changes"),
            a("span", { class: "kx-modal-head-sub" }, "Mail delivery")
          ], -1))
        ]),
        footer: D(() => [
          v(n(P), {
            label: "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: k.value === "save",
            onClick: e[12] || (e[12] = (l) => F.value = !1)
          }, null, 8, ["disabled"]),
          v(n(P), {
            label: "Save",
            loading: k.value === "save",
            onClick: xe
          }, null, 8, ["loading"])
        ]),
        default: D(() => [
          a("ul", Bl, [
            (o(!0), r(J, null, pe(we.value, (l) => (o(), r("li", { key: l }, f(l), 1))), 128))
          ]),
          e[28] || (e[28] = a("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          g.value ? (o(), r("p", Jl, f(g.value), 1)) : V("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), ql = De(zl, { type: "object", properties: { config: { type: "object" } } });
Me(import.meta.url, ql);
//# sourceMappingURL=delivery.js.map
