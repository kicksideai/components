import { defineComponent as te, ref as o, computed as F, watch as Z, openBlock as s, createBlock as Y, withCtx as B, createElementVNode as i, withModifiers as le, toDisplayString as u, createElementBlock as n, Fragment as N, createTextVNode as I, createVNode as v, unref as l, createCommentVNode as b, renderList as Q, onUnmounted as se, useId as oe, onMounted as re, normalizeClass as ie, isRef as ne, nextTick as de } from "vue";
import { u as ue, e as ce, a as ve } from "./mount-DH3Id7d9.js";
import "pinia";
import { on as fe, host as ae, define as me } from "@wippy-fe/proxy";
import K from "primevue/button";
import ke from "primevue/iconfield";
import be from "primevue/inputicon";
import X from "primevue/inputtext";
import { a as J, c as pe, b as ye, w as P, f as ee, _ as he, d as ge, l as _e, e as O, g as we, h as $e } from "./latestRequest-DmAg0i5K.js";
import { Icon as j } from "@iconify/vue";
import xe from "primevue/selectbutton";
import Ce from "primevue/toggleswitch";
import Ve from "primevue/textarea";
const Be = { class: "work-stack work-tight" }, Se = { class: "work-muted work-small" }, Ue = { class: "work-muted work-small" }, Ae = { class: "work-stack work-tight" }, Le = { class: "work-stack work-tight" }, qe = { class: "work-stack work-tight" }, De = { class: "work-muted work-small" }, Ie = {
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
}, Pe = { class: "work-dialog-actions" }, He = /* @__PURE__ */ te({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(A, { emit: x }) {
    const C = A, V = x, g = o(""), c = o(""), p = o("WORK"), k = o(""), y = o(!1), d = o(1), r = o(!1), _ = o(!1), w = o(""), $ = o(""), T = o([]), m = o(""), h = o({}), S = o(/* @__PURE__ */ new Set()), E = {}, R = F(() => {
      const t = T.value.find((e) => e.id === k.value);
      return !t || !J(t) ? [] : t.plugins.flatMap((e) => e.config_schema && pe(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    function z(t) {
      const e = J(t) ? t.plugins.find((a) => a.problem && a.installed)?.problem : t.problem;
      if (e) return `${e.message} (Error code: ${e.code})`;
      if (J(t) && t.plugins.some((a) => !a.installed)) return "A required plugin is unavailable.";
    }
    Z(k, () => {
      h.value = {}, S.value.clear();
    });
    function M(t, e) {
      e ? S.value.delete(t) : S.value.add(t);
    }
    let U = crypto.randomUUID(), L = "", q = 0;
    const G = F(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...T.value.map((t) => {
      const e = z(t);
      return { ...t, title: t.title ?? "Unnamed pack", icon: t.icon ?? "tabler:package-off", disabled: !!e, unavailable: e };
    })]), D = F(() => G.value.find((t) => t.id === k.value)), W = F(() => !!g.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(p.value) && !!D.value && !D.value.disabled && !S.value.size && (d.value === 1 || R.value.every((t) => !Object.keys(ye(t.schema, h.value[t.id] ?? E)).length)));
    Z(() => C.visible, async (t) => {
      const e = ++q;
      if (t) {
        m.value = "", h.value = {}, S.value.clear(), d.value = 1, w.value = "", $.value = "", g.value = "", c.value = "", p.value = "WORK", k.value = "", y.value = !1, U = crypto.randomUUID(), L = "", T.value = [], _.value = !0;
        try {
          const a = await P.packs();
          e === q && (T.value = a);
        } catch (a) {
          e === q && ($.value = ee(a, "Could not load packs."));
        } finally {
          e === q && (_.value = !1);
        }
      }
    }, { immediate: !0 });
    async function H() {
      if (!W.value || r.value) return;
      if (d.value === 1) {
        d.value = 2;
        return;
      }
      r.value = !0, w.value = "";
      const t = k.value ? { pack: k.value, version: D.value?.version, starter: y.value, ...Object.keys(h.value).length ? { plugin_configs: h.value } : {} } : {}, e = { key_prefix: p.value }, a = JSON.stringify([g.value.trim(), c.value, e, t]);
      L && L !== a && (U = crypto.randomUUID()), L = a;
      try {
        if (!m.value) {
          const f = await P.createBoard(g.value.trim(), e, U, t);
          m.value = f.board_id;
        }
        c.value && await P.updateBoard(m.value, { description: c.value }), V("created", m.value), V("close");
      } catch (f) {
        w.value = (m.value ? "Board created. Description was not saved. " : "") + ee(f, "Could not save the board.");
      } finally {
        r.value = !1;
      }
    }
    return (t, e) => (s(), Y(he, {
      visible: A.visible,
      label: "New board",
      busy: r.value,
      onClose: e[6] || (e[6] = (a) => V("close"))
    }, {
      default: B(() => [
        i("form", {
          class: "work-dialog-box",
          onSubmit: le(H, ["prevent"])
        }, [
          i("header", Be, [
            i("span", Se, "Step " + u(d.value) + " of 2", 1),
            i("h2", null, u(d.value === 1 ? "Name your board" : "Choose a pack"), 1),
            i("p", Ue, u(d.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          d.value === 1 ? (s(), n(N, { key: 0 }, [
            i("label", Ae, [
              e[7] || (e[7] = I("Title", -1)),
              v(l(X), {
                id: "board-title",
                modelValue: g.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => g.value = a),
                autofocus: "",
                required: "",
                disabled: r.value || !!m.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("label", Le, [
              e[8] || (e[8] = I("Description", -1)),
              v(l(Ve), {
                id: "board-description",
                modelValue: c.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => c.value = a),
                rows: "3",
                disabled: r.value || !!m.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("label", qe, [
              e[9] || (e[9] = I("Item key prefix", -1)),
              v(l(X), {
                id: "board-prefix",
                modelValue: p.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => p.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: r.value || !!m.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("p", De, " Keys look like " + u(p.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (s(), n(N, { key: 1 }, [
            _.value ? (s(), n("p", Ie, "Loading packs…")) : b("", !0),
            $.value ? (s(), n("p", Te, u($.value), 1)) : b("", !0),
            v(l(xe), {
              modelValue: k.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => k.value = a),
              class: "work-pack-choices",
              options: G.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: r.value || !!m.value,
              "aria-label": "Board pack"
            }, {
              option: B(({ option: a }) => [
                i("span", Ee, [
                  i("span", Ne, [
                    v(l(j), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    i("strong", null, u(a.title), 1),
                    a.version ? (s(), n("span", Re, u(a.version), 1)) : b("", !0)
                  ]),
                  i("span", Oe, u(a.description), 1),
                  a.disabled ? (s(), n("span", je, u(a.unavailable), 1)) : b("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            k.value ? (s(), n("label", Fe, [
              v(l(Ce), {
                modelValue: y.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => y.value = a),
                disabled: r.value || !!m.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = I("Include starter items", -1))
            ])) : b("", !0),
            R.value.length ? (s(), n("fieldset", {
              key: 3,
              disabled: r.value || !!m.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (s(!0), n(N, null, Q(R.value, (a) => (s(), n("section", {
                key: k.value + ":" + a.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                i("h3", null, u(a.title), 1),
                v(ge, {
                  schema: a.schema,
                  "model-value": h.value[a.id] ?? E,
                  disabled: r.value || !!m.value,
                  "onUpdate:modelValue": (f) => h.value[a.id] = f,
                  onValidity: (f) => M(a.id, f)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Ke)) : b("", !0),
            i("div", Me, [
              i("strong", null, u(g.value), 1),
              c.value ? (s(), n("p", We, u(c.value), 1)) : b("", !0),
              i("span", Ze, u(p.value) + "-1", 1),
              i("p", ze, u(D.value?.title), 1)
            ])
          ], 64)),
          w.value ? (s(), n("p", Ge, u(w.value), 1)) : b("", !0),
          i("footer", Pe, [
            v(l(K), {
              label: d.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: r.value || !!m.value,
              onClick: e[5] || (e[5] = (a) => d.value === 1 ? V("close") : d.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            v(l(K), {
              type: "submit",
              label: d.value === 1 ? "Continue" : m.value ? "Save description" : "Create board",
              loading: r.value,
              disabled: !W.value || r.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Je() {
  const A = o([]), x = o(!0), C = o(""), V = o(""), g = o(!1), c = F(() => A.value.filter((d) => `${d.title} ${d.description ?? ""} ${d.key_prefix ?? ""}`.toLocaleLowerCase().includes(V.value.trim().toLocaleLowerCase()))), p = _e();
  async function k(d = !1) {
    const r = p();
    d && (x.value = !0, C.value = "");
    try {
      const _ = await P.boards();
      if (!r()) return;
      A.value = _, g.value = !0, C.value = "";
    } catch (_) {
      r() && (C.value = ee(_, "Could not load boards."));
    } finally {
      r() && (x.value = !1);
    }
  }
  const y = /* @__PURE__ */ new Map();
  return Z(A, (d) => {
    for (const [r, _] of y) d.some((w) => w.board_id === r) || (_(), y.delete(r));
    for (const r of d) y.has(r.board_id) || y.set(r.board_id, fe(`component.${r.board_id}`, () => {
      k();
    }));
  }), ue(k), se(() => {
    p();
    for (const d of y.values()) d();
  }), { boards: A, loading: x, error: C, search: V, visibleBoards: c, hasLoaded: g, load: k };
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
}, da = {
  key: 3,
  class: "kx-empty"
}, ua = { class: "kx-empty-title" }, ca = { class: "kx-empty-sub" }, va = /* @__PURE__ */ te({
  __name: "AdminApp",
  setup(A) {
    const x = o(!1), C = o(!1);
    async function V() {
      if (C.value) return !1;
      if (!x.value) return !0;
      C.value = !0;
      try {
        return await ae.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        C.value = !1;
      }
    }
    const g = o(!1), c = o(""), p = o(""), k = o(!1), y = o(!1), d = o(!0), r = o(), _ = o(), w = o(), { boards: $, loading: T, error: m, search: h, visibleBoards: S, hasLoaded: E, load: R } = Je(), z = oe(), M = F(() => [
      { heading: "Available", boards: S.value.filter((t) => O(t.access)) },
      { heading: "Admin access required", boards: S.value.filter((t) => !O(t.access)) }
    ].filter((t) => t.boards.length));
    let U = !0;
    Z(h, () => {
      U = !1;
    });
    function L(t, e = !0) {
      U = !1, g.value = e, e && r.value?.focus({ preventScroll: !0 }), p.value = c.value = t;
    }
    async function q() {
      return await V() ? (x.value = !1, c.value = "", await de(), (_.value?.querySelector('[aria-current="true"]') ?? w.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function G() {
      U = !1, k.value = !0;
    }
    async function D(t) {
      if (t === "defaults") {
        await V() && ae.navigate("/system/settings");
        return;
      }
      (!c.value || await q()) && G();
    }
    Z($, (t) => {
      if (p.value && !t.some((a) => a.board_id === p.value && O(a.access)) && (p.value = c.value = "", x.value = !1), !U) return;
      U = !1;
      const e = t[0];
      t.length === 1 && e && O(e.access) && L(e.board_id, !1);
    });
    async function W() {
      d.value = !0;
      try {
        y.value = await ce("kickside-work-board-settings");
      } finally {
        d.value = !1;
      }
    }
    re(W);
    async function H(t) {
      k.value = !1, await R(), L(t);
    }
    return (t, e) => (s(), n("main", {
      class: ie(["kx-shell kx-settings-shell work-admin-shell", { "work-board-selected": c.value && y.value }])
    }, [
      !c.value || !y.value ? (s(), Y(we, {
        key: 0,
        settings: "",
        class: "work-board-directory",
        title: "Boards",
        count: l(E) ? l($).length : void 0
      }, {
        actions: B(() => [
          v($e, {
            "create-label": "Create board",
            onCreate: e[0] || (e[0] = (a) => D("create")),
            onDefaults: e[1] || (e[1] = (a) => D("defaults"))
          })
        ]),
        toolbar: B(() => [
          i("div", {
            ref_key: "searchField",
            ref: w,
            class: "picker-search"
          }, [
            v(l(ke), null, {
              default: B(() => [
                v(l(be), null, {
                  default: B(() => [
                    v(l(j), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                v(l(X), {
                  type: "search",
                  modelValue: l(h),
                  "onUpdate:modelValue": e[2] || (e[2] = (a) => ne(h) ? h.value = a : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                l(h) ? (s(), Y(l(K), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: e[3] || (e[3] = (a) => {
                    h.value = "", w.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: B(() => [
                    v(l(j), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                })) : b("", !0)
              ]),
              _: 1
            })
          ], 512)
        ]),
        default: B(() => [
          l(T) ? (s(), n("p", Ye, "Loading boards…")) : l(m) ? (s(), n("div", Qe, [
            i("p", Xe, u(l(m)), 1),
            v(l(K), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: e[4] || (e[4] = (a) => l(R)(!0))
            }, {
              icon: B(() => [
                v(l(j), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : b("", !0),
          M.value.length ? (s(), n("ul", {
            key: 2,
            ref_key: "list",
            ref: _,
            class: "picker-list"
          }, [
            (s(!0), n(N, null, Q(M.value, (a) => (s(), n("li", {
              key: a.heading
            }, [
              M.value.length > 1 || a.heading !== "Available" ? (s(), n("h2", ea, u(a.heading), 1)) : b("", !0),
              i("ul", aa, [
                (s(!0), n(N, null, Q(a.boards, (f) => (s(), n("li", {
                  key: f.board_id
                }, [
                  i("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (f.title || "Untitled board"),
                    "aria-describedby": l(z) + "-" + f.board_id,
                    "aria-current": p.value === f.board_id ? "true" : void 0,
                    disabled: !l(O)(f.access),
                    onClick: (ma) => L(f.board_id)
                  }, [
                    i("span", la, u(f.title || "Untitled board"), 1),
                    i("span", {
                      id: l(z) + "-" + f.board_id,
                      class: "work-sr-only"
                    }, [
                      f.key_prefix ? (s(), n(N, { key: 0 }, [
                        I(u(f.key_prefix) + " · ", 1)
                      ], 64)) : b("", !0),
                      I(u(f.open_count ?? 0) + "/" + u(f.item_count ?? 0) + " open", 1),
                      l(O)(f.access) ? b("", !0) : (s(), n(N, { key: 1 }, [
                        I(" · Admin access required")
                      ], 64))
                    ], 8, sa)
                  ], 8, ta)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : b("", !0),
          l(E) && !l(T) && !l(m) && !l(S).length ? (s(), n("p", oa, u(l($).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["count"])) : b("", !0),
      i("section", {
        ref_key: "detail",
        ref: r,
        class: "work-admin-main",
        "aria-label": "Board settings detail",
        tabindex: "-1"
      }, [
        c.value && y.value ? (s(), n("kickside-work-board-settings", {
          key: c.value,
          "board-id": c.value,
          embedded: "true",
          "focus-back": String(g.value),
          "directory-count": l(E) ? l($).length : void 0,
          onDirectoryAction: e[5] || (e[5] = (a) => D(a.detail.name)),
          onBackToBoards: q,
          onDirtyChange: e[6] || (e[6] = (a) => x.value = a.detail.dirty)
        }, null, 40, ra)) : c.value && d.value ? (s(), n("p", ia, "Loading board settings…")) : c.value ? (s(), n("p", na, [
          e[8] || (e[8] = I("Board settings are unavailable.", -1)),
          v(l(K), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: q
          }),
          v(l(K), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: W
          }, {
            icon: B(() => [
              v(l(j), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : l(E) && !l(m) ? (s(), n("div", da, [
          v(l(j), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          i("h2", ua, u(l($).length ? "Choose a board" : "No boards yet"), 1),
          i("p", ca, u(l($).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."), 1)
        ])) : b("", !0)
      ], 512),
      v(He, {
        visible: k.value,
        onClose: e[7] || (e[7] = (a) => k.value = !1),
        onCreated: H
      }, null, 8, ["visible"])
    ], 2));
  }
}), fa = ve(va, { type: "object", properties: {} });
me(import.meta.url, fa);
//# sourceMappingURL=admin.js.map
