import { defineComponent as X, openBlock as t, createElementBlock as s, createElementVNode as d, createVNode as c, unref as e, toDisplayString as m, renderSlot as ue, createTextVNode as D, createCommentVNode as h, createBlock as Z, createSlots as ce, withCtx as B, normalizeClass as re, Fragment as q, ref as u, computed as J, watch as E, withModifiers as ne, renderList as te, onUnmounted as ve, useId as me, onMounted as fe, isRef as ke, nextTick as be } from "vue";
import { u as pe, a as ye, e as ge, b as he, c as we, d as _e } from "./mount-BjEzswH5.js";
import "pinia";
import { on as Ce, host as oe, define as $e } from "@wippy-fe/proxy";
import U from "primevue/button";
import xe from "primevue/iconfield";
import Se from "primevue/inputicon";
import le from "primevue/inputtext";
import { u as Be, a as Ve, c as Ie, p as Le, _ as Ue, e as ie, w as se, f as de, l as Ae, b as W, d as De } from "./usePackDiscovery-BegvP3gm.js";
import { Icon as T } from "@iconify/vue";
import Re from "primevue/selectbutton";
import Te from "primevue/toggleswitch";
import Ne from "primevue/textarea";
const qe = { class: "kx-empty" }, Ee = { class: "kx-empty-ico" }, Oe = { class: "kx-empty-title" }, Fe = {
  key: 0,
  class: "kx-empty-sub"
}, Pe = /* @__PURE__ */ X({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(k) {
    return ($, f) => (t(), s("div", qe, [
      d("div", Ee, [
        c(e(T), {
          icon: k.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      d("div", Oe, m(k.title), 1),
      k.hint || $.$slots.hint ? (t(), s("p", Fe, [
        ue($.$slots, "hint", {}, () => [
          D(m(k.hint), 1)
        ])
      ])) : h("", !0),
      k.cta ? (t(), Z(e(U), {
        key: 1,
        label: k.cta,
        onClick: f[0] || (f[0] = (x) => $.$emit("cta"))
      }, ce({ _: 2 }, [
        k.ctaIcon ? {
          name: "icon",
          fn: B(({ class: x }) => [
            c(e(T), {
              icon: k.ctaIcon,
              class: re(x),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : h("", !0)
    ]));
  }
}), je = /* @__PURE__ */ X({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(k) {
    return ($, f) => (t(), s(q, null, [
      c(e(U), {
        type: "button",
        text: "",
        "aria-label": k.createLabel,
        title: k.createLabel,
        onClick: f[0] || (f[0] = (x) => $.$emit("create"))
      }, {
        icon: B(() => [
          c(e(T), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      c(e(U), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: f[1] || (f[1] = (x) => $.$emit("defaults"))
      }, {
        icon: B(() => [
          c(e(T), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), ze = { class: "work-stack work-tight" }, Ke = { class: "work-muted work-small" }, Me = { class: "work-muted work-small" }, We = { class: "work-stack work-tight" }, Je = { class: "work-stack work-tight" }, Ze = { class: "work-stack work-tight" }, Ge = { class: "work-muted work-small" }, He = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ye = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Qe = { role: "alert" }, Xe = { class: "work-pack-choice" }, ea = { class: "work-row" }, aa = {
  key: 0,
  class: "work-muted work-small"
}, ta = { class: "work-muted work-small" }, la = {
  key: 0,
  class: "work-pack-unavailable"
}, sa = {
  key: 2,
  class: "work-row work-small"
}, oa = ["disabled"], ia = ["disabled", "schema", "config", "choices", "onConfigChanged", "onValidityChanged"], ra = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, na = {
  key: 2,
  role: "status",
  class: "work-muted work-small"
}, da = { class: "work-settings-card work-stack work-tight" }, ua = {
  key: 0,
  class: "work-muted work-small"
}, ca = { class: "work-mono work-muted" }, va = { class: "work-muted work-small" }, ma = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, fa = { class: "work-dialog-actions" }, ka = /* @__PURE__ */ X({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(k, { emit: $ }) {
    const f = k, x = $, b = u(""), w = u(""), V = u("WORK"), _ = u(""), v = u(!1), i = u(1), r = u(!1), S = u(""), { packs: N, loading: ee, error: G, load: z, reset: O } = Be(), C = u(""), L = u({}), I = u(/* @__PURE__ */ new Set()), H = {}, F = J(() => {
      const p = N.value.find((a) => a.id === _.value);
      return !p || !Ve(p) ? [] : p.plugins.flatMap((a) => a.config_schema && Ie(a.config_schema).length ? [{ id: a.plugin, title: a.title || "Required plugin", schema: a.config_schema }] : []);
    }), P = pe("wc-schema-form"), K = u(/* @__PURE__ */ new Set());
    E(F, (p) => {
      K.value = new Set(p.map((a) => a.id)), p.length && P.load();
    }, { immediate: !0 }), E(_, () => {
      L.value = {}, I.value.clear();
    });
    function Y(p, a) {
      K.value.delete(p), a.valid ? I.value.delete(p) : I.value.add(p);
    }
    let A = crypto.randomUUID(), R = "";
    const Q = J(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...N.value.map(Le)]), j = J(() => Q.value.find((p) => p.id === _.value)), M = J(() => !!b.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(V.value) && !!j.value && !j.value.disabled && !I.value.size && (i.value === 1 || !K.value.size));
    E(() => f.visible, (p) => {
      O(), p && (C.value = "", L.value = {}, I.value.clear(), i.value = 1, S.value = "", b.value = "", w.value = "", V.value = "WORK", _.value = "", v.value = !1, A = crypto.randomUUID(), R = "", z());
    }, { immediate: !0 });
    async function ae() {
      if (!M.value || r.value) return;
      if (i.value === 1) {
        i.value = 2;
        return;
      }
      r.value = !0, S.value = "";
      const p = _.value ? { pack: _.value, version: j.value?.version, starter: v.value, ...Object.keys(L.value).length ? { plugin_configs: L.value } : {} } : {}, a = { key_prefix: V.value }, o = JSON.stringify([b.value.trim(), w.value, a, p]);
      R && R !== o && (A = crypto.randomUUID()), R = o;
      try {
        if (!C.value) {
          const l = await se.createBoard(b.value.trim(), a, A, p);
          C.value = l.board_id;
        }
        w.value && await se.updateBoard(C.value, { description: w.value }), x("created", C.value), x("close");
      } catch (l) {
        S.value = (C.value ? "Board created. Description was not saved. " : "") + de(l, "Could not save the board.");
      } finally {
        r.value = !1;
      }
    }
    return (p, a) => (t(), Z(Ue, {
      visible: k.visible,
      label: "New board",
      busy: r.value,
      onClose: a[8] || (a[8] = (o) => x("close"))
    }, {
      default: B(() => [
        d("form", {
          class: "work-dialog-box",
          onSubmit: ne(ae, ["prevent"])
        }, [
          d("header", ze, [
            d("span", Ke, "Step " + m(i.value) + " of 2", 1),
            d("h2", null, m(i.value === 1 ? "Name your board" : "Choose a pack"), 1),
            d("p", Me, m(i.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          i.value === 1 ? (t(), s(q, { key: 0 }, [
            d("label", We, [
              a[9] || (a[9] = D("Title", -1)),
              c(e(le), {
                id: "board-title",
                modelValue: b.value,
                "onUpdate:modelValue": a[0] || (a[0] = (o) => b.value = o),
                autofocus: "",
                required: "",
                disabled: r.value || !!C.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            d("label", Je, [
              a[10] || (a[10] = D("Description", -1)),
              c(e(Ne), {
                id: "board-description",
                modelValue: w.value,
                "onUpdate:modelValue": a[1] || (a[1] = (o) => w.value = o),
                rows: "3",
                disabled: r.value || !!C.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            d("label", Ze, [
              a[11] || (a[11] = D("Item key prefix", -1)),
              c(e(le), {
                id: "board-prefix",
                modelValue: V.value,
                "onUpdate:modelValue": a[2] || (a[2] = (o) => V.value = o),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: r.value || !!C.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            d("p", Ge, " Keys look like " + m(V.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (t(), s(q, { key: 1 }, [
            e(ee) ? (t(), s("p", He, "Loading packs…")) : h("", !0),
            e(G) ? (t(), s("div", Ye, [
              d("p", Qe, m(e(G)), 1),
              c(e(U), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: a[3] || (a[3] = (o) => e(z)())
              })
            ])) : h("", !0),
            c(e(Re), {
              modelValue: _.value,
              "onUpdate:modelValue": a[4] || (a[4] = (o) => _.value = o),
              class: "work-pack-choices",
              options: Q.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: r.value || !!C.value,
              "aria-label": "Board pack"
            }, {
              option: B(({ option: o }) => [
                d("span", Xe, [
                  d("span", ea, [
                    c(e(T), {
                      icon: o.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    d("strong", null, m(o.title), 1),
                    o.version ? (t(), s("span", aa, m(o.version), 1)) : h("", !0)
                  ]),
                  d("span", ta, m(o.description), 1),
                  o.disabled ? (t(), s("span", la, m(o.unavailable), 1)) : h("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            _.value ? (t(), s("label", sa, [
              c(e(Te), {
                modelValue: v.value,
                "onUpdate:modelValue": a[5] || (a[5] = (o) => v.value = o),
                disabled: r.value || !!C.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              a[12] || (a[12] = D("Include starter items", -1))
            ])) : h("", !0),
            F.value.length ? (t(), s("fieldset", {
              key: 3,
              disabled: r.value || !!C.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (t(!0), s(q, null, te(F.value, (o) => (t(), s("section", {
                key: _.value + ":" + o.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                d("h3", null, m(o.title), 1),
                e(P).state.value === "ready" ? (t(), s("wc-schema-form", {
                  key: 0,
                  class: "work-config-widget",
                  disabled: r.value || !!C.value || void 0,
                  schema: JSON.stringify(o.schema),
                  config: JSON.stringify(L.value[o.id] ?? H),
                  choices: JSON.stringify({ board_item_types: [] }),
                  onConfigChanged: (l) => L.value[o.id] = e(ie)(l),
                  onValidityChanged: (l) => Y(o.id, e(ie)(l))
                }, null, 40, ia)) : e(P).state.value === "failed" ? (t(), s("p", ra, [
                  a[13] || (a[13] = D("The configuration form is unavailable. ", -1)),
                  c(e(U), {
                    label: "Reload configuration form",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    onClick: a[6] || (a[6] = (l) => e(P).load())
                  })
                ])) : (t(), s("p", na, "The configuration form is loading."))
              ]))), 128))
            ], 8, oa)) : h("", !0),
            d("div", da, [
              d("strong", null, m(b.value), 1),
              w.value ? (t(), s("p", ua, m(w.value), 1)) : h("", !0),
              d("span", ca, m(V.value) + "-1", 1),
              d("p", va, m(j.value?.title), 1)
            ])
          ], 64)),
          S.value ? (t(), s("p", ma, m(S.value), 1)) : h("", !0),
          d("footer", fa, [
            c(e(U), {
              label: i.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: r.value || !!C.value,
              onClick: a[7] || (a[7] = (o) => i.value === 1 ? x("close") : i.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            c(e(U), {
              type: "submit",
              label: i.value === 1 ? "Continue" : C.value ? "Save description" : "Create board",
              loading: r.value,
              disabled: !M.value || r.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function ba() {
  const k = u([]), $ = u(!0), f = u(""), x = u(""), b = u(!1), w = J(() => k.value.filter((i) => `${i.title} ${i.description ?? ""} ${i.key_prefix ?? ""}`.toLocaleLowerCase().includes(x.value.trim().toLocaleLowerCase()))), V = Ae();
  async function _(i = !1) {
    const r = V();
    i && ($.value = !0, f.value = "");
    try {
      const S = await se.boards();
      if (!r()) return;
      k.value = S, b.value = !0, f.value = "";
    } catch (S) {
      r() && (f.value = de(S, "Could not load boards."));
    } finally {
      r() && ($.value = !1);
    }
  }
  const v = /* @__PURE__ */ new Map();
  return E(k, (i) => {
    for (const [r, S] of v) i.some((N) => N.board_id === r) || (S(), v.delete(r));
    for (const r of i) v.has(r.board_id) || v.set(r.board_id, Ce(`component.${r.board_id}`, () => {
      _();
    }));
  }), ye(_), ve(() => {
    V();
    for (const i of v.values()) i();
  }), { boards: k, loading: $, error: f, search: x, visibleBoards: w, hasLoaded: b, load: _ };
}
const pa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ya = {
  key: 1,
  class: "kx-err work-alert-actions"
}, ga = { role: "alert" }, ha = {
  key: 0,
  class: "picker-group"
}, wa = { class: "picker-list" }, _a = ["aria-label", "aria-describedby", "aria-current", "disabled", "onClick"], Ca = { class: "picker-name" }, $a = ["id"], xa = {
  key: 3,
  class: "picker-message",
  role: "status"
}, Sa = ["route", "board-id", "focus-back"], Ba = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Va = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Ia = /* @__PURE__ */ X({
  __name: "AdminApp",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(k, { emit: $ }) {
    const f = k, x = $, b = u(!1), w = u(!1);
    async function V() {
      if (w.value) return !1;
      if (!b.value) return !0;
      w.value = !0;
      try {
        return await oe.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        w.value = !1;
      }
    }
    const _ = u(!1), v = u(""), i = u(""), r = u(!1), S = u(!1), N = u(!0), ee = u(), G = u(), z = u(), { boards: O, loading: C, error: L, search: I, visibleBoards: H, hasLoaded: F, load: P } = ba(), K = me(), Y = J(() => [
      { heading: "Available", boards: H.value.filter((l) => W(l.access)) },
      { heading: "Admin access required", boards: H.value.filter((l) => !W(l.access)) }
    ].filter((l) => l.boards.length));
    let A = !0;
    E(I, () => {
      A = !1;
    });
    const R = u("");
    E(b, (l) => x("dirty-change", l), { flush: "sync" });
    function Q(l) {
      f.route !== void 0 && l !== f.route && x("navigate", l);
    }
    function j(l) {
      const n = v.value;
      !n || f.route === void 0 || (R.value = l, Q(l ? encodeURIComponent(n) + "/" + l : encodeURIComponent(n)));
    }
    function M(l, n = !0) {
      A = !1, _.value = n, n && ee.value?.focus({ preventScroll: !0 }), i.value = v.value = l, j("general");
    }
    E(() => f.route, (l) => {
      if (l === void 0) return;
      const [n, ...g] = l.split("/");
      let y;
      try {
        y = decodeURIComponent(n ?? "");
      } catch {
        return;
      }
      y && (A = !1), y !== v.value && (v.value = y, y && (i.value = y), _.value = !1, b.value = !1), R.value = g.join("/");
    }, { immediate: !0 });
    async function ae() {
      return await V() ? (b.value = !1, v.value = "", R.value = "", Q(""), await be(), (G.value?.querySelector('[aria-current="true"]') ?? z.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function p() {
      A = !1, r.value = !0;
    }
    E(O, (l) => {
      if (i.value && !l.some((g) => g.board_id === i.value && W(g.access)) && (i.value = v.value = "", b.value = !1), !A) return;
      A = !1;
      const n = l[0];
      l.length === 1 && n && W(n.access) && M(n.board_id, !1);
    });
    async function a() {
      N.value = !0;
      try {
        S.value = await ge("kickside-work-board-settings");
      } finally {
        N.value = !1;
      }
    }
    fe(a);
    async function o(l) {
      r.value = !1, await P(), M(l);
    }
    return (l, n) => (t(), s("main", {
      class: re(["kx-shell kx-settings-shell work-admin-shell", { "work-board-selected": v.value && S.value }])
    }, [
      !v.value || !S.value ? (t(), Z(De, {
        key: 0,
        settings: "",
        class: "work-board-directory",
        title: "Boards",
        count: e(F) ? e(O).length : void 0
      }, {
        actions: B(() => [
          c(je, {
            "create-label": "Create board",
            onCreate: p,
            onDefaults: n[0] || (n[0] = (g) => e(oe).navigate("/system/settings"))
          })
        ]),
        toolbar: B(() => [
          d("div", {
            ref_key: "searchField",
            ref: z,
            class: "picker-search"
          }, [
            c(e(xe), null, {
              default: B(() => [
                c(e(Se), null, {
                  default: B(() => [
                    c(e(T), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                c(e(le), {
                  type: "search",
                  modelValue: e(I),
                  "onUpdate:modelValue": n[1] || (n[1] = (g) => ke(I) ? I.value = g : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                e(I) ? (t(), Z(e(U), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: n[2] || (n[2] = (g) => {
                    I.value = "", z.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: B(() => [
                    c(e(T), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : h("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: B(() => [
          e(C) ? (t(), s("p", pa, "Loading boards…")) : e(L) ? (t(), s("div", ya, [
            d("p", ga, m(e(L)), 1),
            c(e(U), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: n[3] || (n[3] = (g) => e(P)(!0))
            }, {
              icon: B(() => [
                c(e(T), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : h("", !0),
          Y.value.length ? (t(), s("ul", {
            key: 2,
            ref_key: "list",
            ref: G,
            class: "picker-list"
          }, [
            (t(!0), s(q, null, te(Y.value, (g) => (t(), s("li", {
              key: g.heading
            }, [
              Y.value.length > 1 || g.heading !== "Available" ? (t(), s("h2", ha, m(g.heading), 1)) : h("", !0),
              d("ul", wa, [
                (t(!0), s(q, null, te(g.boards, (y) => (t(), s("li", {
                  key: y.board_id
                }, [
                  d("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (y.title || "Untitled board"),
                    "aria-describedby": e(K) + "-" + y.board_id,
                    "aria-current": i.value === y.board_id ? "true" : void 0,
                    disabled: !e(W)(y.access),
                    onClick: (Aa) => M(y.board_id)
                  }, [
                    d("span", Ca, m(y.title || "Untitled board"), 1),
                    d("span", {
                      id: e(K) + "-" + y.board_id,
                      class: "work-sr-only"
                    }, [
                      y.key_prefix ? (t(), s(q, { key: 0 }, [
                        D(m(y.key_prefix) + " · ", 1)
                      ], 64)) : h("", !0),
                      D(m(y.open_count ?? 0) + "/" + m(y.item_count ?? 0) + " open", 1),
                      e(W)(y.access) ? h("", !0) : (t(), s(q, { key: 1 }, [
                        D(" · Admin access required")
                      ], 64))
                    ], 8, $a)
                  ], 8, _a)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : h("", !0),
          e(F) && !e(C) && !e(L) && !e(H).length ? (t(), s("p", xa, m(e(O).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : h("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : h("", !0),
      d("section", {
        ref_key: "detail",
        ref: ee,
        class: "work-admin-main",
        "aria-label": "Board settings detail",
        tabindex: "-1"
      }, [
        v.value && S.value ? (t(), s("kickside-work-board-settings", {
          route: f.route === void 0 ? void 0 : R.value,
          onNavigate: n[4] || (n[4] = ne((g) => j(g.detail.route), ["stop"])),
          key: v.value,
          "board-id": v.value,
          embedded: "true",
          "focus-back": String(_.value),
          onBackToBoards: ae,
          onDirtyChange: n[5] || (n[5] = (g) => b.value = g.detail.dirty)
        }, null, 40, Sa)) : v.value && N.value ? (t(), s("p", Ba, "Loading board settings…")) : v.value ? (t(), s("p", Va, [
          n[7] || (n[7] = D("Board settings are unavailable.", -1)),
          c(e(U), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: ae
          }),
          c(e(U), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: a
          }, {
            icon: B(() => [
              c(e(T), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : e(F) && !e(L) ? (t(), Z(Pe, {
          key: 3,
          icon: "tabler:adjustments",
          title: e(O).length ? "Choose a board" : "No boards yet",
          hint: e(O).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."
        }, null, 8, ["title", "hint"])) : h("", !0)
      ], 512),
      c(ka, {
        visible: r.value,
        onClose: n[6] || (n[6] = (g) => r.value = !1),
        onCreated: o
      }, null, 8, ["visible"])
    ], 2));
  }
}), La = /* @__PURE__ */ X({
  __name: "AdminRoot",
  setup(k) {
    const $ = he(), f = we();
    return (x, b) => (t(), Z(Ia, {
      route: e($).route,
      onNavigate: b[0] || (b[0] = (w) => e(f)("navigate", { route: w })),
      onDirtyChange: b[1] || (b[1] = (w) => e(f)("dirty-change", { dirty: w }))
    }, null, 8, ["route"]));
  }
}), Ua = _e(La, { type: "object", properties: { route: { type: "string", default: "" } } });
$e(import.meta.url, Ua);
//# sourceMappingURL=admin.js.map
