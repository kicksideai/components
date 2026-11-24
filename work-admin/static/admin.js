import { defineComponent as Y, openBlock as t, createElementBlock as i, createElementVNode as n, createVNode as u, unref as e, toDisplayString as m, renderSlot as ue, createTextVNode as q, createCommentVNode as g, createBlock as G, createSlots as de, withCtx as B, normalizeClass as oe, Fragment as O, ref as d, computed as z, watch as F, withModifiers as ie, renderList as ae, onUnmounted as ce, useId as ve, onMounted as me, isRef as fe, nextTick as ke } from "vue";
import { u as be, e as pe, a as ye, b as he, c as ge } from "./mount-Vm8EEgjb.js";
import "pinia";
import { on as we, host as se, define as _e } from "@wippy-fe/proxy";
import A from "primevue/button";
import $e from "primevue/iconfield";
import Ce from "primevue/inputicon";
import te from "primevue/inputtext";
import { u as xe, a as Ve, c as Be, p as Se, b as Ue, _ as Ie, d as Le, w as le, f as re, l as Ae, e as Z, g as De } from "./usePackDiscovery-eNQQwSzJ.js";
import { Icon as T } from "@iconify/vue";
import Re from "primevue/selectbutton";
import qe from "primevue/toggleswitch";
import Te from "primevue/textarea";
const Ne = { class: "kx-empty" }, Ee = { class: "kx-empty-ico" }, Oe = { class: "kx-empty-title" }, je = {
  key: 0,
  class: "kx-empty-sub"
}, Pe = /* @__PURE__ */ Y({
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
    return (C, f) => (t(), i("div", Ne, [
      n("div", Ee, [
        u(e(T), {
          icon: k.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      n("div", Oe, m(k.title), 1),
      k.hint || C.$slots.hint ? (t(), i("p", je, [
        ue(C.$slots, "hint", {}, () => [
          q(m(k.hint), 1)
        ])
      ])) : g("", !0),
      k.cta ? (t(), G(e(A), {
        key: 1,
        label: k.cta,
        onClick: f[0] || (f[0] = (x) => C.$emit("cta"))
      }, de({ _: 2 }, [
        k.ctaIcon ? {
          name: "icon",
          fn: B(({ class: x }) => [
            u(e(T), {
              icon: k.ctaIcon,
              class: oe(x),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : g("", !0)
    ]));
  }
}), Fe = /* @__PURE__ */ Y({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(k) {
    return (C, f) => (t(), i(O, null, [
      u(e(A), {
        type: "button",
        text: "",
        "aria-label": k.createLabel,
        title: k.createLabel,
        onClick: f[0] || (f[0] = (x) => C.$emit("create"))
      }, {
        icon: B(() => [
          u(e(T), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      u(e(A), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: f[1] || (f[1] = (x) => C.$emit("defaults"))
      }, {
        icon: B(() => [
          u(e(T), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Ke = { class: "work-stack work-tight" }, Me = { class: "work-muted work-small" }, We = { class: "work-muted work-small" }, Ze = { class: "work-stack work-tight" }, ze = { class: "work-stack work-tight" }, Ge = { class: "work-stack work-tight" }, He = { class: "work-muted work-small" }, Je = {
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
}, oa = ["disabled"], ia = { class: "work-settings-card work-stack work-tight" }, ra = {
  key: 0,
  class: "work-muted work-small"
}, na = { class: "work-mono work-muted" }, ua = { class: "work-muted work-small" }, da = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ca = { class: "work-dialog-actions" }, va = /* @__PURE__ */ Y({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(k, { emit: C }) {
    const f = k, x = C, b = d(""), w = d(""), S = d("WORK"), _ = d(""), v = d(!1), s = d(1), o = d(!1), V = d(""), { packs: N, loading: Q, error: H, load: K, reset: j } = xe(), $ = d(""), U = d({}), I = d(/* @__PURE__ */ new Set()), M = {}, P = z(() => {
      const p = N.value.find((a) => a.id === _.value);
      return !p || !Ve(p) ? [] : p.plugins.flatMap((a) => a.config_schema && Be(a.config_schema).length ? [{ id: a.plugin, title: a.title || "Required plugin", schema: a.config_schema }] : []);
    });
    F(_, () => {
      U.value = {}, I.value.clear();
    });
    function X(p, a) {
      a ? I.value.delete(p) : I.value.add(p);
    }
    let W = crypto.randomUUID(), E = "";
    const D = z(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...N.value.map(Se)]), R = z(() => D.value.find((p) => p.id === _.value)), J = z(() => !!b.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(S.value) && !!R.value && !R.value.disabled && !I.value.size && (s.value === 1 || P.value.every((p) => !Object.keys(Ue(p.schema, U.value[p.id] ?? M, !1)).length)));
    F(() => f.visible, (p) => {
      j(), p && ($.value = "", U.value = {}, I.value.clear(), s.value = 1, V.value = "", b.value = "", w.value = "", S.value = "WORK", _.value = "", v.value = !1, W = crypto.randomUUID(), E = "", K());
    }, { immediate: !0 });
    async function ee() {
      if (!J.value || o.value) return;
      if (s.value === 1) {
        s.value = 2;
        return;
      }
      o.value = !0, V.value = "";
      const p = _.value ? { pack: _.value, version: R.value?.version, starter: v.value, ...Object.keys(U.value).length ? { plugin_configs: U.value } : {} } : {}, a = { key_prefix: S.value }, l = JSON.stringify([b.value.trim(), w.value, a, p]);
      E && E !== l && (W = crypto.randomUUID()), E = l;
      try {
        if (!$.value) {
          const L = await le.createBoard(b.value.trim(), a, W, p);
          $.value = L.board_id;
        }
        w.value && await le.updateBoard($.value, { description: w.value }), x("created", $.value), x("close");
      } catch (L) {
        V.value = ($.value ? "Board created. Description was not saved. " : "") + re(L, "Could not save the board.");
      } finally {
        o.value = !1;
      }
    }
    return (p, a) => (t(), G(Ie, {
      visible: k.visible,
      label: "New board",
      busy: o.value,
      onClose: a[7] || (a[7] = (l) => x("close"))
    }, {
      default: B(() => [
        n("form", {
          class: "work-dialog-box",
          onSubmit: ie(ee, ["prevent"])
        }, [
          n("header", Ke, [
            n("span", Me, "Step " + m(s.value) + " of 2", 1),
            n("h2", null, m(s.value === 1 ? "Name your board" : "Choose a pack"), 1),
            n("p", We, m(s.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          s.value === 1 ? (t(), i(O, { key: 0 }, [
            n("label", Ze, [
              a[8] || (a[8] = q("Title", -1)),
              u(e(te), {
                id: "board-title",
                modelValue: b.value,
                "onUpdate:modelValue": a[0] || (a[0] = (l) => b.value = l),
                autofocus: "",
                required: "",
                disabled: o.value || !!$.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("label", ze, [
              a[9] || (a[9] = q("Description", -1)),
              u(e(Te), {
                id: "board-description",
                modelValue: w.value,
                "onUpdate:modelValue": a[1] || (a[1] = (l) => w.value = l),
                rows: "3",
                disabled: o.value || !!$.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("label", Ge, [
              a[10] || (a[10] = q("Item key prefix", -1)),
              u(e(te), {
                id: "board-prefix",
                modelValue: S.value,
                "onUpdate:modelValue": a[2] || (a[2] = (l) => S.value = l),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: o.value || !!$.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("p", He, " Keys look like " + m(S.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (t(), i(O, { key: 1 }, [
            e(Q) ? (t(), i("p", Je, "Loading packs…")) : g("", !0),
            e(H) ? (t(), i("div", Ye, [
              n("p", Qe, m(e(H)), 1),
              u(e(A), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: a[3] || (a[3] = (l) => e(K)())
              })
            ])) : g("", !0),
            u(e(Re), {
              modelValue: _.value,
              "onUpdate:modelValue": a[4] || (a[4] = (l) => _.value = l),
              class: "work-pack-choices",
              options: D.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: o.value || !!$.value,
              "aria-label": "Board pack"
            }, {
              option: B(({ option: l }) => [
                n("span", Xe, [
                  n("span", ea, [
                    u(e(T), {
                      icon: l.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    n("strong", null, m(l.title), 1),
                    l.version ? (t(), i("span", aa, m(l.version), 1)) : g("", !0)
                  ]),
                  n("span", ta, m(l.description), 1),
                  l.disabled ? (t(), i("span", la, m(l.unavailable), 1)) : g("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            _.value ? (t(), i("label", sa, [
              u(e(qe), {
                modelValue: v.value,
                "onUpdate:modelValue": a[5] || (a[5] = (l) => v.value = l),
                disabled: o.value || !!$.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              a[11] || (a[11] = q("Include starter items", -1))
            ])) : g("", !0),
            P.value.length ? (t(), i("fieldset", {
              key: 3,
              disabled: o.value || !!$.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (t(!0), i(O, null, ae(P.value, (l) => (t(), i("section", {
                key: _.value + ":" + l.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                n("h3", null, m(l.title), 1),
                u(Le, {
                  schema: l.schema,
                  "model-value": U.value[l.id] ?? M,
                  disabled: o.value || !!$.value,
                  "suggest-defaults": "",
                  "onUpdate:modelValue": (L) => U.value[l.id] = L,
                  onValidity: (L) => X(l.id, L)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, oa)) : g("", !0),
            n("div", ia, [
              n("strong", null, m(b.value), 1),
              w.value ? (t(), i("p", ra, m(w.value), 1)) : g("", !0),
              n("span", na, m(S.value) + "-1", 1),
              n("p", ua, m(R.value?.title), 1)
            ])
          ], 64)),
          V.value ? (t(), i("p", da, m(V.value), 1)) : g("", !0),
          n("footer", ca, [
            u(e(A), {
              label: s.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: o.value || !!$.value,
              onClick: a[6] || (a[6] = (l) => s.value === 1 ? x("close") : s.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            u(e(A), {
              type: "submit",
              label: s.value === 1 ? "Continue" : $.value ? "Save description" : "Create board",
              loading: o.value,
              disabled: !J.value || o.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function ma() {
  const k = d([]), C = d(!0), f = d(""), x = d(""), b = d(!1), w = z(() => k.value.filter((s) => `${s.title} ${s.description ?? ""} ${s.key_prefix ?? ""}`.toLocaleLowerCase().includes(x.value.trim().toLocaleLowerCase()))), S = Ae();
  async function _(s = !1) {
    const o = S();
    s && (C.value = !0, f.value = "");
    try {
      const V = await le.boards();
      if (!o()) return;
      k.value = V, b.value = !0, f.value = "";
    } catch (V) {
      o() && (f.value = re(V, "Could not load boards."));
    } finally {
      o() && (C.value = !1);
    }
  }
  const v = /* @__PURE__ */ new Map();
  return F(k, (s) => {
    for (const [o, V] of v) s.some((N) => N.board_id === o) || (V(), v.delete(o));
    for (const o of s) v.has(o.board_id) || v.set(o.board_id, we(`component.${o.board_id}`, () => {
      _();
    }));
  }), be(_), ce(() => {
    S();
    for (const s of v.values()) s();
  }), { boards: k, loading: C, error: f, search: x, visibleBoards: w, hasLoaded: b, load: _ };
}
const fa = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ka = {
  key: 1,
  class: "kx-err work-alert-actions"
}, ba = { role: "alert" }, pa = {
  key: 0,
  class: "picker-group"
}, ya = { class: "picker-list" }, ha = ["aria-label", "aria-describedby", "aria-current", "disabled", "onClick"], ga = { class: "picker-name" }, wa = ["id"], _a = {
  key: 3,
  class: "picker-message",
  role: "status"
}, $a = ["route", "board-id", "focus-back"], Ca = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, xa = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Va = /* @__PURE__ */ Y({
  __name: "AdminApp",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(k, { emit: C }) {
    const f = k, x = C, b = d(!1), w = d(!1);
    async function S() {
      if (w.value) return !1;
      if (!b.value) return !0;
      w.value = !0;
      try {
        return await se.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        w.value = !1;
      }
    }
    const _ = d(!1), v = d(""), s = d(""), o = d(!1), V = d(!1), N = d(!0), Q = d(), H = d(), K = d(), { boards: j, loading: $, error: U, search: I, visibleBoards: M, hasLoaded: P, load: X } = ma(), W = ve(), E = z(() => [
      { heading: "Available", boards: M.value.filter((c) => Z(c.access)) },
      { heading: "Admin access required", boards: M.value.filter((c) => !Z(c.access)) }
    ].filter((c) => c.boards.length));
    let D = !0;
    F(I, () => {
      D = !1;
    });
    const R = d("");
    F(b, (c) => x("dirty-change", c), { flush: "sync" });
    function J(c) {
      f.route !== void 0 && c !== f.route && x("navigate", c);
    }
    function ee(c) {
      const r = v.value;
      !r || f.route === void 0 || (R.value = c, J(c ? encodeURIComponent(r) + "/" + c : encodeURIComponent(r)));
    }
    function p(c, r = !0) {
      D = !1, _.value = r, r && Q.value?.focus({ preventScroll: !0 }), s.value = v.value = c, ee("general");
    }
    F(() => f.route, (c) => {
      if (c === void 0) return;
      const [r, ...h] = c.split("/");
      let y;
      try {
        y = decodeURIComponent(r ?? "");
      } catch {
        return;
      }
      y && (D = !1), y !== v.value && (v.value = y, y && (s.value = y), _.value = !1, b.value = !1), R.value = h.join("/");
    }, { immediate: !0 });
    async function a() {
      return await S() ? (b.value = !1, v.value = "", R.value = "", J(""), await ke(), (H.value?.querySelector('[aria-current="true"]') ?? K.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function l() {
      D = !1, o.value = !0;
    }
    F(j, (c) => {
      if (s.value && !c.some((h) => h.board_id === s.value && Z(h.access)) && (s.value = v.value = "", b.value = !1), !D) return;
      D = !1;
      const r = c[0];
      c.length === 1 && r && Z(r.access) && p(r.board_id, !1);
    });
    async function L() {
      N.value = !0;
      try {
        V.value = await pe("kickside-work-board-settings");
      } finally {
        N.value = !1;
      }
    }
    me(L);
    async function ne(c) {
      o.value = !1, await X(), p(c);
    }
    return (c, r) => (t(), i("main", {
      class: oe(["kx-shell kx-settings-shell work-admin-shell", { "work-board-selected": v.value && V.value }])
    }, [
      !v.value || !V.value ? (t(), G(De, {
        key: 0,
        settings: "",
        class: "work-board-directory",
        title: "Boards",
        count: e(P) ? e(j).length : void 0
      }, {
        actions: B(() => [
          u(Fe, {
            "create-label": "Create board",
            onCreate: l,
            onDefaults: r[0] || (r[0] = (h) => e(se).navigate("/system/settings"))
          })
        ]),
        toolbar: B(() => [
          n("div", {
            ref_key: "searchField",
            ref: K,
            class: "picker-search"
          }, [
            u(e($e), null, {
              default: B(() => [
                u(e(Ce), null, {
                  default: B(() => [
                    u(e(T), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                u(e(te), {
                  type: "search",
                  modelValue: e(I),
                  "onUpdate:modelValue": r[1] || (r[1] = (h) => fe(I) ? I.value = h : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                e(I) ? (t(), G(e(A), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: r[2] || (r[2] = (h) => {
                    I.value = "", K.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: B(() => [
                    u(e(T), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : g("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: B(() => [
          e($) ? (t(), i("p", fa, "Loading boards…")) : e(U) ? (t(), i("div", ka, [
            n("p", ba, m(e(U)), 1),
            u(e(A), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: r[3] || (r[3] = (h) => e(X)(!0))
            }, {
              icon: B(() => [
                u(e(T), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : g("", !0),
          E.value.length ? (t(), i("ul", {
            key: 2,
            ref_key: "list",
            ref: H,
            class: "picker-list"
          }, [
            (t(!0), i(O, null, ae(E.value, (h) => (t(), i("li", {
              key: h.heading
            }, [
              E.value.length > 1 || h.heading !== "Available" ? (t(), i("h2", pa, m(h.heading), 1)) : g("", !0),
              n("ul", ya, [
                (t(!0), i(O, null, ae(h.boards, (y) => (t(), i("li", {
                  key: y.board_id
                }, [
                  n("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (y.title || "Untitled board"),
                    "aria-describedby": e(W) + "-" + y.board_id,
                    "aria-current": s.value === y.board_id ? "true" : void 0,
                    disabled: !e(Z)(y.access),
                    onClick: (Ua) => p(y.board_id)
                  }, [
                    n("span", ga, m(y.title || "Untitled board"), 1),
                    n("span", {
                      id: e(W) + "-" + y.board_id,
                      class: "work-sr-only"
                    }, [
                      y.key_prefix ? (t(), i(O, { key: 0 }, [
                        q(m(y.key_prefix) + " · ", 1)
                      ], 64)) : g("", !0),
                      q(m(y.open_count ?? 0) + "/" + m(y.item_count ?? 0) + " open", 1),
                      e(Z)(y.access) ? g("", !0) : (t(), i(O, { key: 1 }, [
                        q(" · Admin access required")
                      ], 64))
                    ], 8, wa)
                  ], 8, ha)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : g("", !0),
          e(P) && !e($) && !e(U) && !e(M).length ? (t(), i("p", _a, m(e(j).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : g("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : g("", !0),
      n("section", {
        ref_key: "detail",
        ref: Q,
        class: "work-admin-main",
        "aria-label": "Board settings detail",
        tabindex: "-1"
      }, [
        v.value && V.value ? (t(), i("kickside-work-board-settings", {
          route: f.route === void 0 ? void 0 : R.value,
          onNavigate: r[4] || (r[4] = ie((h) => ee(h.detail.route), ["stop"])),
          key: v.value,
          "board-id": v.value,
          embedded: "true",
          "focus-back": String(_.value),
          onBackToBoards: a,
          onDirtyChange: r[5] || (r[5] = (h) => b.value = h.detail.dirty)
        }, null, 40, $a)) : v.value && N.value ? (t(), i("p", Ca, "Loading board settings…")) : v.value ? (t(), i("p", xa, [
          r[7] || (r[7] = q("Board settings are unavailable.", -1)),
          u(e(A), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: a
          }),
          u(e(A), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: L
          }, {
            icon: B(() => [
              u(e(T), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : e(P) && !e(U) ? (t(), G(Pe, {
          key: 3,
          icon: "tabler:adjustments",
          title: e(j).length ? "Choose a board" : "No boards yet",
          hint: e(j).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."
        }, null, 8, ["title", "hint"])) : g("", !0)
      ], 512),
      u(va, {
        visible: o.value,
        onClose: r[6] || (r[6] = (h) => o.value = !1),
        onCreated: ne
      }, null, 8, ["visible"])
    ], 2));
  }
}), Ba = /* @__PURE__ */ Y({
  __name: "AdminRoot",
  setup(k) {
    const C = ye(), f = he();
    return (x, b) => (t(), G(Va, {
      route: e(C).route,
      onNavigate: b[0] || (b[0] = (w) => e(f)("navigate", { route: w })),
      onDirtyChange: b[1] || (b[1] = (w) => e(f)("dirty-change", { dirty: w }))
    }, null, 8, ["route"]));
  }
}), Sa = ge(Ba, { type: "object", properties: { route: { type: "string", default: "" } } });
_e(import.meta.url, Sa);
//# sourceMappingURL=admin.js.map
