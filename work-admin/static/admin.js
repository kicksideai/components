import { defineComponent as ae, openBlock as s, createElementBlock as r, Fragment as I, createVNode as d, unref as l, withCtx as C, ref as o, computed as M, watch as Z, createBlock as Y, createElementVNode as n, withModifiers as le, toDisplayString as c, createTextVNode as T, createCommentVNode as k, renderList as Q, onUnmounted as se, useId as oe, onMounted as re, normalizeClass as ie, isRef as ne, nextTick as ue } from "vue";
import { u as de, e as ce, a as ve } from "./mount-CDzcrCyw.js";
import "pinia";
import { on as fe, host as te, define as me } from "@wippy-fe/proxy";
import E from "primevue/button";
import be from "primevue/iconfield";
import ke from "primevue/inputicon";
import X from "primevue/inputtext";
import { a as J, c as pe, b as ye, w as H, f as ee, _ as he, d as ge, l as _e, e as K, g as we } from "./latestRequest-Cv3QFlsy.js";
import { Icon as D } from "@iconify/vue";
import $e from "primevue/selectbutton";
import Ce from "primevue/toggleswitch";
import xe from "primevue/textarea";
const Ve = /* @__PURE__ */ ae({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(x) {
    return (_, y) => (s(), r(I, null, [
      d(l(E), {
        type: "button",
        text: "",
        "aria-label": x.createLabel,
        title: x.createLabel,
        onClick: y[0] || (y[0] = (V) => _.$emit("create"))
      }, {
        icon: C(() => [
          d(l(D), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      d(l(E), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: y[1] || (y[1] = (V) => _.$emit("defaults"))
      }, {
        icon: C(() => [
          d(l(D), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Be = { class: "work-stack work-tight" }, Se = { class: "work-muted work-small" }, Le = { class: "work-muted work-small" }, Ue = { class: "work-stack work-tight" }, Ae = { class: "work-stack work-tight" }, qe = { class: "work-stack work-tight" }, De = { class: "work-muted work-small" }, Ie = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Te = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ee = { class: "work-pack-choice" }, Ne = { class: "work-row" }, Re = {
  key: 0,
  class: "work-muted work-small"
}, Oe = { class: "work-muted work-small" }, je = {
  key: 0,
  class: "work-pack-unavailable"
}, Fe = {
  key: 2,
  class: "work-row work-small"
}, Ke = ["disabled"], Me = { class: "work-settings-card work-stack work-tight" }, We = {
  key: 0,
  class: "work-muted work-small"
}, Ze = { class: "work-mono work-muted" }, ze = { class: "work-muted work-small" }, Ge = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Pe = { class: "work-dialog-actions" }, He = /* @__PURE__ */ ae({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(x, { emit: _ }) {
    const y = x, V = _, w = o(""), v = o(""), p = o("WORK"), m = o(""), h = o(!1), u = o(1), i = o(!1), $ = o(!1), B = o(""), S = o(""), N = o([]), f = o(""), g = o({}), L = o(/* @__PURE__ */ new Set()), R = {}, F = M(() => {
      const t = N.value.find((e) => e.id === m.value);
      return !t || !J(t) ? [] : t.plugins.flatMap((e) => e.config_schema && pe(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    function z(t) {
      const e = J(t) ? t.plugins.find((a) => a.problem && a.installed)?.problem : t.problem;
      if (e) return `${e.message} (Error code: ${e.code})`;
      if (J(t) && t.plugins.some((a) => !a.installed)) return "A required plugin is unavailable.";
    }
    Z(m, () => {
      g.value = {}, L.value.clear();
    });
    function W(t, e) {
      e ? L.value.delete(t) : L.value.add(t);
    }
    let U = crypto.randomUUID(), A = "", O = 0;
    const G = M(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...N.value.map((t) => {
      const e = z(t);
      return { ...t, title: t.title ?? "Unnamed pack", icon: t.icon ?? "tabler:package-off", disabled: !!e, unavailable: e };
    })]), j = M(() => G.value.find((t) => t.id === m.value)), P = M(() => !!w.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(p.value) && !!j.value && !j.value.disabled && !L.value.size && (u.value === 1 || F.value.every((t) => !Object.keys(ye(t.schema, g.value[t.id] ?? R)).length)));
    Z(() => y.visible, async (t) => {
      const e = ++O;
      if (t) {
        f.value = "", g.value = {}, L.value.clear(), u.value = 1, B.value = "", S.value = "", w.value = "", v.value = "", p.value = "WORK", m.value = "", h.value = !1, U = crypto.randomUUID(), A = "", N.value = [], $.value = !0;
        try {
          const a = await H.packs();
          e === O && (N.value = a);
        } catch (a) {
          e === O && (S.value = ee(a, "Could not load packs."));
        } finally {
          e === O && ($.value = !1);
        }
      }
    }, { immediate: !0 });
    async function b() {
      if (!P.value || i.value) return;
      if (u.value === 1) {
        u.value = 2;
        return;
      }
      i.value = !0, B.value = "";
      const t = m.value ? { pack: m.value, version: j.value?.version, starter: h.value, ...Object.keys(g.value).length ? { plugin_configs: g.value } : {} } : {}, e = { key_prefix: p.value }, a = JSON.stringify([w.value.trim(), v.value, e, t]);
      A && A !== a && (U = crypto.randomUUID()), A = a;
      try {
        if (!f.value) {
          const q = await H.createBoard(w.value.trim(), e, U, t);
          f.value = q.board_id;
        }
        v.value && await H.updateBoard(f.value, { description: v.value }), V("created", f.value), V("close");
      } catch (q) {
        B.value = (f.value ? "Board created. Description was not saved. " : "") + ee(q, "Could not save the board.");
      } finally {
        i.value = !1;
      }
    }
    return (t, e) => (s(), Y(he, {
      visible: x.visible,
      label: "New board",
      busy: i.value,
      onClose: e[6] || (e[6] = (a) => V("close"))
    }, {
      default: C(() => [
        n("form", {
          class: "work-dialog-box",
          onSubmit: le(b, ["prevent"])
        }, [
          n("header", Be, [
            n("span", Se, "Step " + c(u.value) + " of 2", 1),
            n("h2", null, c(u.value === 1 ? "Name your board" : "Choose a pack"), 1),
            n("p", Le, c(u.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          u.value === 1 ? (s(), r(I, { key: 0 }, [
            n("label", Ue, [
              e[7] || (e[7] = T("Title", -1)),
              d(l(X), {
                id: "board-title",
                modelValue: w.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => w.value = a),
                autofocus: "",
                required: "",
                disabled: i.value || !!f.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("label", Ae, [
              e[8] || (e[8] = T("Description", -1)),
              d(l(xe), {
                id: "board-description",
                modelValue: v.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => v.value = a),
                rows: "3",
                disabled: i.value || !!f.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("label", qe, [
              e[9] || (e[9] = T("Item key prefix", -1)),
              d(l(X), {
                id: "board-prefix",
                modelValue: p.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => p.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: i.value || !!f.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            n("p", De, " Keys look like " + c(p.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (s(), r(I, { key: 1 }, [
            $.value ? (s(), r("p", Ie, "Loading packs…")) : k("", !0),
            S.value ? (s(), r("p", Te, c(S.value), 1)) : k("", !0),
            d(l($e), {
              modelValue: m.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => m.value = a),
              class: "work-pack-choices",
              options: G.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: i.value || !!f.value,
              "aria-label": "Board pack"
            }, {
              option: C(({ option: a }) => [
                n("span", Ee, [
                  n("span", Ne, [
                    d(l(D), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    n("strong", null, c(a.title), 1),
                    a.version ? (s(), r("span", Re, c(a.version), 1)) : k("", !0)
                  ]),
                  n("span", Oe, c(a.description), 1),
                  a.disabled ? (s(), r("span", je, c(a.unavailable), 1)) : k("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            m.value ? (s(), r("label", Fe, [
              d(l(Ce), {
                modelValue: h.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => h.value = a),
                disabled: i.value || !!f.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = T("Include starter items", -1))
            ])) : k("", !0),
            F.value.length ? (s(), r("fieldset", {
              key: 3,
              disabled: i.value || !!f.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (s(!0), r(I, null, Q(F.value, (a) => (s(), r("section", {
                key: m.value + ":" + a.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                n("h3", null, c(a.title), 1),
                d(ge, {
                  schema: a.schema,
                  "model-value": g.value[a.id] ?? R,
                  disabled: i.value || !!f.value,
                  "onUpdate:modelValue": (q) => g.value[a.id] = q,
                  onValidity: (q) => W(a.id, q)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Ke)) : k("", !0),
            n("div", Me, [
              n("strong", null, c(w.value), 1),
              v.value ? (s(), r("p", We, c(v.value), 1)) : k("", !0),
              n("span", Ze, c(p.value) + "-1", 1),
              n("p", ze, c(j.value?.title), 1)
            ])
          ], 64)),
          B.value ? (s(), r("p", Ge, c(B.value), 1)) : k("", !0),
          n("footer", Pe, [
            d(l(E), {
              label: u.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: i.value || !!f.value,
              onClick: e[5] || (e[5] = (a) => u.value === 1 ? V("close") : u.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            d(l(E), {
              type: "submit",
              label: u.value === 1 ? "Continue" : f.value ? "Save description" : "Create board",
              loading: i.value,
              disabled: !P.value || i.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Je() {
  const x = o([]), _ = o(!0), y = o(""), V = o(""), w = o(!1), v = M(() => x.value.filter((u) => `${u.title} ${u.description ?? ""} ${u.key_prefix ?? ""}`.toLocaleLowerCase().includes(V.value.trim().toLocaleLowerCase()))), p = _e();
  async function m(u = !1) {
    const i = p();
    u && (_.value = !0, y.value = "");
    try {
      const $ = await H.boards();
      if (!i()) return;
      x.value = $, w.value = !0, y.value = "";
    } catch ($) {
      i() && (y.value = ee($, "Could not load boards."));
    } finally {
      i() && (_.value = !1);
    }
  }
  const h = /* @__PURE__ */ new Map();
  return Z(x, (u) => {
    for (const [i, $] of h) u.some((B) => B.board_id === i) || ($(), h.delete(i));
    for (const i of u) h.has(i.board_id) || h.set(i.board_id, fe(`component.${i.board_id}`, () => {
      m();
    }));
  }), de(m), se(() => {
    p();
    for (const u of h.values()) u();
  }), { boards: x, loading: _, error: y, search: V, visibleBoards: v, hasLoaded: w, load: m };
}
const Ye = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Qe = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Xe = { role: "alert" }, ea = {
  key: 0,
  class: "picker-group"
}, aa = { class: "picker-list" }, ta = ["aria-label", "aria-describedby", "aria-current", "disabled", "onClick"], la = { class: "picker-name" }, sa = ["id"], oa = {
  key: 3,
  class: "picker-message",
  role: "status"
}, ra = ["board-id", "focus-back", "directory-count"], ia = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, na = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ua = {
  key: 3,
  class: "kx-empty"
}, da = { class: "kx-empty-title" }, ca = { class: "kx-empty-sub" }, va = /* @__PURE__ */ ae({
  __name: "AdminApp",
  setup(x) {
    const _ = o(!1), y = o(!1);
    async function V() {
      if (y.value) return !1;
      if (!_.value) return !0;
      y.value = !0;
      try {
        return await te.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        y.value = !1;
      }
    }
    const w = o(!1), v = o(""), p = o(""), m = o(!1), h = o(!1), u = o(!0), i = o(), $ = o(), B = o(), { boards: S, loading: N, error: f, search: g, visibleBoards: L, hasLoaded: R, load: F } = Je(), z = oe(), W = M(() => [
      { heading: "Available", boards: L.value.filter((b) => K(b.access)) },
      { heading: "Admin access required", boards: L.value.filter((b) => !K(b.access)) }
    ].filter((b) => b.boards.length));
    let U = !0;
    Z(g, () => {
      U = !1;
    });
    function A(b, t = !0) {
      U = !1, w.value = t, t && i.value?.focus({ preventScroll: !0 }), p.value = v.value = b;
    }
    async function O() {
      return await V() ? (_.value = !1, v.value = "", await ue(), ($.value?.querySelector('[aria-current="true"]') ?? B.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function G() {
      U = !1, m.value = !0;
    }
    Z(S, (b) => {
      if (p.value && !b.some((e) => e.board_id === p.value && K(e.access)) && (p.value = v.value = "", _.value = !1), !U) return;
      U = !1;
      const t = b[0];
      b.length === 1 && t && K(t.access) && A(t.board_id, !1);
    });
    async function j() {
      u.value = !0;
      try {
        h.value = await ce("kickside-work-board-settings");
      } finally {
        u.value = !1;
      }
    }
    re(j);
    async function P(b) {
      m.value = !1, await F(), A(b);
    }
    return (b, t) => (s(), r("main", {
      class: ie(["kx-shell kx-settings-shell work-admin-shell", { "work-board-selected": v.value && h.value }])
    }, [
      !v.value || !h.value ? (s(), Y(we, {
        key: 0,
        settings: "",
        class: "work-board-directory",
        title: "Boards",
        count: l(R) ? l(S).length : void 0
      }, {
        actions: C(() => [
          d(Ve, {
            "create-label": "Create board",
            onCreate: G,
            onDefaults: t[0] || (t[0] = (e) => l(te).navigate("/system/settings"))
          })
        ]),
        toolbar: C(() => [
          n("div", {
            ref_key: "searchField",
            ref: B,
            class: "picker-search"
          }, [
            d(l(be), null, {
              default: C(() => [
                d(l(ke), null, {
                  default: C(() => [
                    d(l(D), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                d(l(X), {
                  type: "search",
                  modelValue: l(g),
                  "onUpdate:modelValue": t[1] || (t[1] = (e) => ne(g) ? g.value = e : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                l(g) ? (s(), Y(l(E), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: t[2] || (t[2] = (e) => {
                    g.value = "", B.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: C(() => [
                    d(l(D), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : k("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: C(() => [
          l(N) ? (s(), r("p", Ye, "Loading boards…")) : l(f) ? (s(), r("div", Qe, [
            n("p", Xe, c(l(f)), 1),
            d(l(E), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: t[3] || (t[3] = (e) => l(F)(!0))
            }, {
              icon: C(() => [
                d(l(D), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : k("", !0),
          W.value.length ? (s(), r("ul", {
            key: 2,
            ref_key: "list",
            ref: $,
            class: "picker-list"
          }, [
            (s(!0), r(I, null, Q(W.value, (e) => (s(), r("li", {
              key: e.heading
            }, [
              W.value.length > 1 || e.heading !== "Available" ? (s(), r("h2", ea, c(e.heading), 1)) : k("", !0),
              n("ul", aa, [
                (s(!0), r(I, null, Q(e.boards, (a) => (s(), r("li", {
                  key: a.board_id
                }, [
                  n("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (a.title || "Untitled board"),
                    "aria-describedby": l(z) + "-" + a.board_id,
                    "aria-current": p.value === a.board_id ? "true" : void 0,
                    disabled: !l(K)(a.access),
                    onClick: (q) => A(a.board_id)
                  }, [
                    n("span", la, c(a.title || "Untitled board"), 1),
                    n("span", {
                      id: l(z) + "-" + a.board_id,
                      class: "work-sr-only"
                    }, [
                      a.key_prefix ? (s(), r(I, { key: 0 }, [
                        T(c(a.key_prefix) + " · ", 1)
                      ], 64)) : k("", !0),
                      T(c(a.open_count ?? 0) + "/" + c(a.item_count ?? 0) + " open", 1),
                      l(K)(a.access) ? k("", !0) : (s(), r(I, { key: 1 }, [
                        T(" · Admin access required")
                      ], 64))
                    ], 8, sa)
                  ], 8, ta)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : k("", !0),
          l(R) && !l(N) && !l(f) && !l(L).length ? (s(), r("p", oa, c(l(S).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : k("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : k("", !0),
      n("section", {
        ref_key: "detail",
        ref: i,
        class: "work-admin-main",
        "aria-label": "Board settings detail",
        tabindex: "-1"
      }, [
        v.value && h.value ? (s(), r("kickside-work-board-settings", {
          key: v.value,
          "board-id": v.value,
          embedded: "true",
          "focus-back": String(w.value),
          "directory-count": l(R) ? l(S).length : void 0,
          onBackToBoards: O,
          onDirtyChange: t[4] || (t[4] = (e) => _.value = e.detail.dirty)
        }, null, 40, ra)) : v.value && u.value ? (s(), r("p", ia, "Loading board settings…")) : v.value ? (s(), r("p", na, [
          t[6] || (t[6] = T("Board settings are unavailable.", -1)),
          d(l(E), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: O
          }),
          d(l(E), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: j
          }, {
            icon: C(() => [
              d(l(D), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : l(R) && !l(f) ? (s(), r("div", ua, [
          d(l(D), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          n("h2", da, c(l(S).length ? "Choose a board" : "No boards yet"), 1),
          n("p", ca, c(l(S).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."), 1)
        ])) : k("", !0)
      ], 512),
      d(He, {
        visible: m.value,
        onClose: t[5] || (t[5] = (e) => m.value = !1),
        onCreated: P
      }, null, 8, ["visible"])
    ], 2));
  }
}), fa = ve(va, { type: "object", properties: {} });
me(import.meta.url, fa);
//# sourceMappingURL=admin.js.map
