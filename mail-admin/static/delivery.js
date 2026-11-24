import { defineComponent as ye, useId as B, computed as S, ref as y, watch as ee, openBlock as o, createElementBlock as r, createCommentVNode as V, Fragment as J, renderList as fe, normalizeClass as le, createElementVNode as t, unref as n, toDisplayString as f, createVNode as v, createBlock as O, shallowRef as P, onMounted as Ce, withCtx as R, createTextVNode as N, resolveDynamicComponent as Ee } from "vue";
import "./wc-runtime-IM7bQYl9.js";
import "pinia";
import { G as ge, A as _e, H as ke, d as G, w as Ne, _ as Oe, m as Ue, E as ve, i as De, z as Re, F as Me } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-iB-gd4CJ.js";
import { loadByTagName as je, api as W, host as ce, define as Ae } from "@wippy-fe/proxy";
import { Icon as w } from "@iconify/vue";
import F from "primevue/button";
import Fe from "primevue/dialog";
import K from "primevue/inputtext";
import he from "primevue/select";
import Ie from "primevue/inputnumber";
import Le from "primevue/password";
import Pe from "primevue/tag";
import Be from "primevue/toggleswitch";
const Z = /* @__PURE__ */ new Map();
function Je(_) {
  let d = Z.get(_);
  return d || (d = Promise.resolve(je(_)).then(() => !0, () => (Z.delete(_), !1)), Z.set(_, d)), d;
}
const me = () => ge(() => W.get("/api/v1/mail/delivery/drivers"), "Delivery services").then((_) => _.items);
async function pe(_) {
  try {
    const { data: d } = await W.get("/api/v1/settings", { params: { namespace: _ } });
    if (d?.success && Array.isArray(d.settings)) return d.settings.filter((m) => m.namespace === _);
    throw new _e({ error: d?.error, kind: "INTERNAL" }, "Settings");
  } catch (d) {
    throw ke(d, "Settings");
  }
}
async function ze(_) {
  try {
    const { data: d } = await W.put("/api/v1/settings", { values: _ });
    if (d?.success) return;
    throw new _e({ error: d?.error, kind: "INVALID" }, "Save settings");
  } catch (d) {
    const m = d?.response?.data;
    if (m && typeof m.namespace == "string" && typeof m.key == "string")
      return { namespace: m.namespace, key: m.key, error: typeof m.message == "string" ? m.message : String(m.error ?? "") };
    throw ke(d, "Save settings");
  }
}
const qe = () => ge(() => W.post("/api/v1/mail/delivery/send-test", {}), "Send test email"), Ge = ["disabled"], He = {
  key: 0,
  class: "mail-setting-row mail-setting-help"
}, Ke = { class: "mail-setting-text" }, We = ["for"], Qe = {
  key: 0,
  class: "mail-setting-help"
}, Xe = { class: "mail-setting-control" }, Ye = {
  key: 0,
  class: "mail-secret"
}, Ze = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, el = /* @__PURE__ */ ye({
  __name: "DriverRows",
  props: {
    settings: {},
    errors: {},
    disabled: { type: Boolean }
  },
  emits: ["change", "validity"],
  setup(_, { emit: d }) {
    const m = _, M = d, g = B(), D = S(() => m.settings.filter((i) => i.editable !== !1).sort((i, u) => (i.order ?? 100) - (u.order ?? 100))), p = y({}), j = y({});
    ee(() => m.settings, (i) => {
      p.value = Object.fromEntries(i.map((u) => [u.key, u.is_secret || u.value_type === "secret" ? "" : u.value ?? u.default ?? ""])), j.value = {};
    }, { immediate: !0 });
    const $ = (i) => i.is_secret || i.value_type === "secret";
    function A(i) {
      const u = p.value[i.key], a = i.schema?.pattern;
      return a && typeof u == "string" && u && !new RegExp(a).test(u) ? "This value does not have the expected form." : "";
    }
    const C = (i) => A(i) || m.errors[i.key] || "";
    ee(p, (i) => {
      const u = {};
      for (const a of m.settings) {
        const c = i[a.key];
        if ($(a)) {
          c && (u[a.key] = c);
          continue;
        }
        c !== (a.value ?? a.default ?? "") && (u[a.key] = c);
      }
      M("change", u), M("validity", m.settings.every((a) => !A(a)));
    }, { deep: !0 });
    const h = (i) => (i.schema?.enum ?? []).map((u) => ({ label: String(u), value: u }));
    return (i, u) => (o(), r("fieldset", {
      class: "mail-delivery-rows",
      disabled: _.disabled
    }, [
      D.value.length ? V("", !0) : (o(), r("p", He, "This service needs no settings of its own.")),
      (o(!0), r(J, null, fe(D.value, (a) => (o(), r("div", {
        key: a.key,
        class: le(["mail-setting-row", { "mail-setting-invalid": C(a) }])
      }, [
        t("div", Ke, [
          t("label", {
            class: "mail-setting-title",
            for: n(g) + a.key
          }, f(a.title || a.key), 9, We),
          a.description ? (o(), r("p", Qe, f(a.description), 1)) : V("", !0)
        ]),
        t("div", Xe, [
          $(a) ? (o(), r(J, { key: 0 }, [
            a.has_value && !j.value[a.key] ? (o(), r("div", Ye, [
              v(n(Pe), {
                severity: "success",
                value: "Set"
              }),
              v(n(F), {
                label: "Replace",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: (c) => j.value[a.key] = !0
              }, null, 8, ["onClick"])
            ])) : (o(), O(n(Le), {
              key: 1,
              modelValue: p.value[a.key],
              "onUpdate:modelValue": (c) => p.value[a.key] = c,
              "input-id": n(g) + a.key,
              feedback: !1,
              "toggle-mask": "",
              fluid: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"]))
          ], 64)) : h(a).length ? (o(), O(n(he), {
            key: 1,
            modelValue: p.value[a.key],
            "onUpdate:modelValue": (c) => p.value[a.key] = c,
            "input-id": n(g) + a.key,
            options: h(a),
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            fluid: ""
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id", "options"])) : a.value_type === "bool" ? (o(), O(n(Be), {
            key: 2,
            modelValue: p.value[a.key],
            "onUpdate:modelValue": (c) => p.value[a.key] = c,
            "input-id": n(g) + a.key
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"])) : a.value_type === "int" ? (o(), O(n(Ie), {
            key: 3,
            modelValue: p.value[a.key],
            "onUpdate:modelValue": (c) => p.value[a.key] = c,
            "input-id": n(g) + a.key,
            fluid: ""
          }, null, 8, ["modelValue", "onUpdate:modelValue", "input-id"])) : (o(), O(n(K), {
            key: 4,
            modelValue: p.value[a.key],
            "onUpdate:modelValue": (c) => p.value[a.key] = c,
            id: n(g) + a.key,
            fluid: "",
            invalid: !!C(a)
          }, null, 8, ["modelValue", "onUpdate:modelValue", "id", "invalid"])),
          C(a) ? (o(), r("small", Ze, f(C(a)), 1)) : V("", !0)
        ])
      ], 2))), 128))
    ], 8, Ge));
  }
}), ll = {
  class: "mail-delivery",
  "aria-label": "Mail delivery settings"
}, sl = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, al = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, tl = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, il = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, ol = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "status"
}, nl = ["disabled", "inert"], rl = { class: "mail-settings-list" }, dl = { class: "mail-setting-row" }, ul = { class: "mail-setting-text" }, vl = ["for"], cl = { class: "mail-setting-help" }, ml = { class: "mail-setting-control" }, pl = {
  key: 0,
  class: "mail-kind"
}, yl = { key: 1 }, fl = { class: "mail-kind" }, gl = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, _l = {
  key: 1,
  class: "kx-err inline mail-driver-error",
  role: "alert"
}, kl = { class: "mail-settings-list" }, hl = { class: "mail-setting-text" }, bl = ["for"], wl = { class: "mail-setting-control" }, Vl = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, xl = { class: "mail-setting-row" }, Sl = { class: "mail-setting-text" }, $l = ["for"], Tl = { class: "mail-setting-control" }, Cl = { class: "mail-setting-text" }, El = ["for"], Nl = { class: "mail-setting-control" }, Ol = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ul = { class: "mail-settings-list" }, Dl = { class: "mail-setting-row" }, Rl = { class: "mail-setting-control mail-test-control" }, Ml = {
  key: 0,
  class: "mail-test-result",
  role: "status"
}, jl = {
  key: 0,
  class: "kx-notice error mail-block"
}, Al = {
  key: 1,
  class: "kx-notice mail-block"
}, Fl = {
  key: 2,
  class: "kx-notice info mail-block"
}, Il = {
  key: 3,
  class: "kx-notice error mail-block"
}, Ll = { class: "mail-failure-body" }, Pl = {
  key: 0,
  class: "mail-problem-detail"
}, Bl = { class: "kx-modal-head-icon" }, Jl = { class: "mail-change-list" }, zl = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, H = "kickside.mail", ql = /* @__PURE__ */ ye({
  __name: "DeliverySettings",
  setup(_) {
    const d = { driver: B(), address: B(), name: B(), reply: B() }, m = y(!0), M = y(!1), g = y(""), D = P([]), p = P(), j = P([]), $ = P([]), A = y(!1), C = y(""), h = y({ driver: "", from_address: "", from_name: "", reply_to: "" }), i = y({ ...h.value }), u = y({}), a = y(!0), c = y({}), k = y(), z = y("");
    function se(s) {
      const e = (l) => {
        const T = s.find((U) => U.key === l);
        return typeof T?.value == "string" ? T.value : "";
      };
      return { driver: e("driver"), from_address: e("from_address"), from_name: e("from_name"), reply_to: e("reply_to") };
    }
    async function ae() {
      m.value = !0, g.value = "";
      try {
        const [s, e, l] = await Promise.all([me(), ve.status(), pe(H)]);
        D.value = s, p.value = e, j.value = l, h.value = se(l), i.value = { ...h.value }, M.value = !1;
      } catch (s) {
        M.value = De(s), g.value = M.value ? "" : G(s, "Delivery settings could not be loaded.");
      } finally {
        m.value = !1;
      }
    }
    Ce(ae);
    const x = S(() => D.value.find((s) => s.id === i.value.driver)), Q = y(!1);
    ee(x, async (s) => {
      if (u.value = {}, a.value = !0, c.value = {}, $.value = [], Q.value = !1, A.value = !!s, C.value = "", !!s)
        try {
          const e = s.settings_view ? await Je(s.settings_view) : !1;
          if (x.value !== s) return;
          $.value = s.settings, Q.value = e, s.settings_view && !e && (C.value = `The ${s.label} settings could not be loaded. Reload the page to try again.`);
        } catch (e) {
          x.value === s && (C.value = G(e, `The ${s.label} settings could not be loaded.`));
        } finally {
          x.value === s && (A.value = !1);
        }
    });
    const be = S(() => JSON.stringify(Object.fromEntries($.value.filter((s) => !(s.is_secret || s.value_type === "secret")).map((s) => [s.key, s.value ?? s.default ?? null])))), we = S(() => JSON.stringify(Object.fromEntries($.value.filter((s) => s.is_secret || s.value_type === "secret").map((s) => [s.key, !!s.has_value])))), Ve = S(() => JSON.stringify(c.value));
    function te(s, e) {
      const l = s.detail;
      e === "change" && l?.values && typeof l.values == "object" && (u.value = { ...l.values }), e === "validity" && typeof l?.valid == "boolean" && (a.value = l.valid);
    }
    const ie = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, E = S(() => ({
      from_address: i.value.from_address && !ie.test(i.value.from_address) ? "Enter an email address such as support@example.com." : c.value.from_address ?? "",
      reply_to: i.value.reply_to && !ie.test(i.value.reply_to) ? "Enter an email address, or leave it empty." : c.value.reply_to ?? ""
    })), I = y(!1), xe = S(() => {
      const s = [];
      i.value.driver !== h.value.driver && s.push(`Service: ${x.value?.label ?? "none"}`);
      const e = { from_address: "From address", from_name: "From name", reply_to: "Reply-to" };
      for (const l of Object.keys(e)) i.value[l] !== h.value[l] && s.push(e[l]);
      for (const l of Object.keys(u.value)) {
        const T = $.value.find((U) => U.key === l);
        s.push(`${x.value?.label}: ${T?.title ?? l}`);
      }
      return s;
    }), q = S(() => JSON.stringify(i.value) !== JSON.stringify(h.value) || Object.keys(u.value).length > 0), oe = S(() => !!E.value.from_address || !!E.value.reply_to || !a.value), X = y(0);
    function Se() {
      i.value = { ...h.value }, u.value = {}, c.value = {}, $.value = [...$.value], X.value++;
    }
    async function $e() {
      if (k.value || oe.value) return;
      k.value = "save", z.value = g.value = "", c.value = {};
      const s = [], e = x.value?.settings_ns;
      if (e) for (const [l, T] of Object.entries(u.value)) s.push({ namespace: e, key: l, value: T === "" ? null : T });
      for (const l of ["from_address", "from_name", "reply_to"])
        i.value[l] !== h.value[l] && s.push({ namespace: H, key: l, value: i.value[l] || null });
      i.value.driver !== h.value.driver && s.push({ namespace: H, key: "driver", value: i.value.driver || null });
      try {
        const l = await ze(s);
        if (l) {
          c.value = { [l.key]: l.error }, g.value = "Some changes were not saved. Correct the highlighted value and save again.";
          return;
        }
        const [T, U, ue] = await Promise.all([me(), ve.status(), pe(H)]);
        p.value = U, j.value = ue, h.value = se(ue), i.value = { ...h.value }, D.value = T, u.value = {}, X.value++, I.value = !1, z.value = "Delivery settings saved.";
      } catch (l) {
        g.value = G(l, "Delivery settings could not be saved.");
      } finally {
        k.value = void 0;
      }
    }
    const b = P(), L = y("");
    async function ne() {
      if (b.value)
        try {
          b.value = await Re.get(b.value.message_id);
        } catch {
        }
    }
    Ne((s) => {
      s.message_id === b.value?.message_id && ne();
    });
    async function Te() {
      k.value = "test", L.value = "", b.value = void 0;
      try {
        const s = await qe();
        b.value = { message_id: s.message_id, status: "queued" }, await ne();
      } catch (s) {
        L.value = G(s, "The test email could not be sent.");
      } finally {
        k.value = void 0;
      }
    }
    const re = S(() => b.value && "last_error" in b.value ? b.value.last_error?.message ?? "" : ""), Y = S(() => D.value.map((s) => ({ value: s.id, label: s.label, icon: s.icon, description: s.description }))), de = S(() => {
      const s = p.value;
      if (!(!s || s.configured))
        return s.reason ?? "Mail delivery is not set up.";
    });
    return (s, e) => (o(), r("section", ll, [
      v(Oe, {
        title: "Mail",
        description: "How email leaves this workspace. Templates and their look are in System → Mail."
      }, {
        actions: R(() => [
          q.value ? (o(), O(Ue, {
            key: 0,
            busy: k.value === "save",
            "review-disabled": oe.value,
            onDiscard: Se,
            onReview: e[0] || (e[0] = (l) => I.value = !0)
          }, null, 8, ["busy", "review-disabled"])) : (o(), O(n(F), {
            key: 1,
            label: "Templates",
            severity: "secondary",
            outlined: "",
            onClick: e[1] || (e[1] = (l) => n(ce).navigate("/system/mail"))
          }, {
            icon: R(() => [
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
      m.value ? (o(), r("p", sl, [
        v(n(w), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        e[14] || (e[14] = N("Loading delivery settings…", -1))
      ])) : M.value ? (o(), r("p", al, [
        v(n(w), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        e[15] || (e[15] = N("Ask an administrator to grant you access to mail delivery.", -1))
      ])) : (o(), r(J, { key: 2 }, [
        g.value ? (o(), r("div", tl, [
          t("span", null, f(g.value), 1),
          D.value.length ? V("", !0) : (o(), O(n(F), {
            key: 0,
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: e[2] || (e[2] = (l) => ae())
          }))
        ])) : V("", !0),
        z.value ? (o(), r("p", il, [
          v(n(w), {
            icon: "tabler:circle-check",
            "aria-hidden": "true"
          }),
          N(f(z.value), 1)
        ])) : V("", !0),
        de.value && !q.value ? (o(), r("p", ol, [
          v(n(w), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", null, [
            e[16] || (e[16] = t("strong", null, "Mail is not set up yet.", -1)),
            N(" " + f(de.value), 1)
          ])
        ])) : V("", !0),
        t("fieldset", {
          class: "mail-fieldset mail-delivery-body",
          disabled: k.value === "save",
          inert: k.value === "save" || void 0
        }, [
          e[20] || (e[20] = t("h2", { class: "mail-label" }, "Delivery service", -1)),
          t("div", rl, [
            t("div", dl, [
              t("div", ul, [
                t("label", {
                  class: "mail-setting-title",
                  for: d.driver
                }, "Service", 8, vl),
                t("p", cl, f(x.value?.description || "Choose the service that delivers your email."), 1)
              ]),
              t("div", ml, [
                v(n(he), {
                  modelValue: i.value.driver,
                  "onUpdate:modelValue": e[3] || (e[3] = (l) => i.value.driver = l),
                  "input-id": d.driver,
                  options: Y.value,
                  "option-label": "label",
                  "option-value": "value",
                  "append-to": "self",
                  placeholder: "Choose a service…",
                  fluid: "",
                  "empty-message": "No delivery service is installed"
                }, {
                  value: R(({ value: l, placeholder: T }) => [
                    l ? (o(), r("span", pl, [
                      v(n(w), {
                        icon: Y.value.find((U) => U.value === l)?.icon ?? "tabler:mail",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      N(f(Y.value.find((U) => U.value === l)?.label ?? l), 1)
                    ])) : (o(), r("span", yl, f(T), 1))
                  ]),
                  option: R(({ option: l }) => [
                    t("span", fl, [
                      v(n(w), {
                        icon: l.icon,
                        "aria-hidden": "true"
                      }, null, 8, ["icon"]),
                      N(f(l.label), 1)
                    ])
                  ]),
                  _: 1
                }, 8, ["modelValue", "input-id", "options"])
              ])
            ]),
            A.value ? (o(), r("p", gl, [
              v(n(w), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              N("Loading " + f(x.value?.label) + " settings…", 1)
            ])) : C.value ? (o(), r("p", _l, f(C.value), 1)) : x.value ? (o(), r(J, { key: 2 }, [
              x.value.settings_view && Q.value ? (o(), O(Ee(x.value.settings_view), {
                key: x.value.id + ":" + X.value,
                class: "mail-driver-view",
                "^values": be.value,
                "^secrets": we.value,
                "^errors": Ve.value,
                "^disabled": String(k.value === "save"),
                onChange: e[4] || (e[4] = (l) => te(l, "change")),
                onValidity: e[5] || (e[5] = (l) => te(l, "validity"))
              }, null, 40, ["^values", "^secrets", "^errors", "^disabled"])) : (o(), O(el, {
                key: 1,
                settings: $.value,
                errors: c.value,
                disabled: k.value === "save",
                onChange: e[6] || (e[6] = (l) => u.value = l),
                onValidity: e[7] || (e[7] = (l) => a.value = l)
              }, null, 8, ["settings", "errors", "disabled"]))
            ], 64)) : V("", !0)
          ]),
          e[21] || (e[21] = t("h2", { class: "mail-label" }, "Sender", -1)),
          t("div", kl, [
            t("div", {
              class: le(["mail-setting-row", { "mail-setting-invalid": E.value.from_address }])
            }, [
              t("div", hl, [
                t("label", {
                  class: "mail-setting-title",
                  for: d.address
                }, "From address", 8, bl),
                e[17] || (e[17] = t("p", { class: "mail-setting-help" }, "The address recipients see and reply to by default. The service must accept mail from it.", -1))
              ]),
              t("div", wl, [
                v(n(K), {
                  id: d.address,
                  modelValue: i.value.from_address,
                  "onUpdate:modelValue": e[8] || (e[8] = (l) => i.value.from_address = l),
                  modelModifiers: { trim: !0 },
                  fluid: "",
                  placeholder: "support@example.com",
                  invalid: !!E.value.from_address
                }, null, 8, ["id", "modelValue", "invalid"]),
                E.value.from_address ? (o(), r("small", Vl, f(E.value.from_address), 1)) : V("", !0)
              ])
            ], 2),
            t("div", xl, [
              t("div", Sl, [
                t("label", {
                  class: "mail-setting-title",
                  for: d.name
                }, "From name", 8, $l),
                e[18] || (e[18] = t("p", { class: "mail-setting-help" }, "Shown next to the address, for example your company’s name.", -1))
              ]),
              t("div", Tl, [
                v(n(K), {
                  id: d.name,
                  modelValue: i.value.from_name,
                  "onUpdate:modelValue": e[9] || (e[9] = (l) => i.value.from_name = l),
                  fluid: ""
                }, null, 8, ["id", "modelValue"])
              ])
            ]),
            t("div", {
              class: le(["mail-setting-row", { "mail-setting-invalid": E.value.reply_to }])
            }, [
              t("div", Cl, [
                t("label", {
                  class: "mail-setting-title",
                  for: d.reply
                }, "Reply-to", 8, El),
                e[19] || (e[19] = t("p", { class: "mail-setting-help" }, "Where replies go when it is not the From address. Optional.", -1))
              ]),
              t("div", Nl, [
                v(n(K), {
                  id: d.reply,
                  modelValue: i.value.reply_to,
                  "onUpdate:modelValue": e[10] || (e[10] = (l) => i.value.reply_to = l),
                  modelModifiers: { trim: !0 },
                  fluid: "",
                  invalid: !!E.value.reply_to
                }, null, 8, ["id", "modelValue", "invalid"]),
                E.value.reply_to ? (o(), r("small", Ol, f(E.value.reply_to), 1)) : V("", !0)
              ])
            ], 2)
          ])
        ], 8, nl),
        e[26] || (e[26] = t("h2", { class: "mail-label" }, "Test", -1)),
        t("div", Ul, [
          t("div", Dl, [
            e[22] || (e[22] = t("div", { class: "mail-setting-text" }, [
              t("span", { class: "mail-setting-title" }, "Send a test email"),
              t("p", { class: "mail-setting-help" }, "Sends a short message to you with the saved settings.")
            ], -1)),
            t("div", Rl, [
              v(n(F), {
                label: "Send test email",
                severity: "secondary",
                outlined: "",
                loading: k.value === "test",
                disabled: q.value || !!k.value || !p.value?.configured,
                title: q.value ? "Save your changes first." : p.value?.configured ? void 0 : "Set up delivery first.",
                onClick: Te
              }, {
                icon: R(() => [
                  v(n(w), {
                    icon: "tabler:send",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled", "title"])
            ])
          ]),
          b.value || L.value ? (o(), r("div", Ml, [
            L.value ? (o(), r("p", jl, [
              v(n(w), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              N(f(L.value), 1)
            ])) : b.value?.status === "queued" ? (o(), r("p", Al, [
              v(n(w), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              e[23] || (e[23] = N("Sending the test…", -1))
            ])) : b.value?.status === "sent" ? (o(), r("p", Fl, [
              v(n(w), {
                icon: "tabler:circle-check",
                "aria-hidden": "true"
              }),
              e[24] || (e[24] = N("The test was accepted for delivery. Check your inbox.", -1))
            ])) : b.value?.status === "failed" ? (o(), r("div", Il, [
              v(n(w), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Ll, [
                e[25] || (e[25] = t("strong", null, "The service did not accept the test.", -1)),
                re.value ? (o(), r("code", Pl, f(re.value), 1)) : V("", !0),
                t("button", {
                  type: "button",
                  class: "mail-text-link",
                  onClick: e[11] || (e[11] = (l) => n(ce).navigate("/system/mail/activity/" + b.value.message_id))
                }, "Open it in Activity")
              ])
            ])) : V("", !0)
          ])) : V("", !0)
        ])
      ], 64)),
      v(n(Fe), {
        visible: I.value,
        modal: "",
        draggable: !1,
        closable: k.value !== "save",
        class: "mail-dialog",
        "aria-label": "Review changes",
        pt: { header: { class: "mail-dialog-header" }, footer: { class: "mail-dialog-footer" } },
        "onUpdate:visible": e[13] || (e[13] = (l) => {
          l || (I.value = !1);
        })
      }, {
        header: R(() => [
          t("span", Bl, [
            v(n(w), {
              icon: "tabler:checklist",
              "aria-hidden": "true"
            })
          ]),
          e[27] || (e[27] = t("span", { class: "kx-modal-head-text" }, [
            t("span", { class: "kx-modal-head-title" }, "Review changes"),
            t("span", { class: "kx-modal-head-sub" }, "Mail delivery")
          ], -1))
        ]),
        footer: R(() => [
          v(n(F), {
            label: "Keep editing",
            severity: "secondary",
            outlined: "",
            disabled: k.value === "save",
            onClick: e[12] || (e[12] = (l) => I.value = !1)
          }, null, 8, ["disabled"]),
          v(n(F), {
            label: "Save",
            loading: k.value === "save",
            onClick: $e
          }, null, 8, ["loading"])
        ]),
        default: R(() => [
          t("ul", Jl, [
            (o(!0), r(J, null, fe(xe.value, (l) => (o(), r("li", { key: l }, f(l), 1))), 128))
          ]),
          e[28] || (e[28] = t("p", { class: "mail-muted mail-review-note" }, "Email sent after you save uses these settings.", -1)),
          g.value ? (o(), r("p", zl, f(g.value), 1)) : V("", !0)
        ]),
        _: 1
      }, 8, ["visible", "closable"])
    ]));
  }
}), Gl = Me(ql, { type: "object", properties: { config: { type: "object" } } });
Ae(import.meta.url, Gl);
//# sourceMappingURL=delivery.js.map
