import { defineComponent as te, useId as se, openBlock as o, createElementBlock as i, unref as t, createElementVNode as s, createTextVNode as A, toDisplayString as u, createCommentVNode as b, renderSlot as J, ref as r, computed as K, watch as W, createBlock as Q, withCtx as C, withModifiers as oe, Fragment as E, createVNode as c, renderList as X, onUnmounted as re, onMounted as ie, normalizeClass as ne, isRef as de, nextTick as ue } from "vue";
import { u as ce, e as ve, a as fe } from "./mount--O3y-Bty.js";
import "pinia";
import { on as me, host as le, define as ke } from "@wippy-fe/proxy";
import T from "primevue/button";
import be from "primevue/iconfield";
import pe from "primevue/inputicon";
import ee from "primevue/inputtext";
import { Icon as I } from "@iconify/vue";
import { a as Y, c as ye, b as he, w as P, f as ae, _ as _e, d as ge, l as we, e as F } from "./latestRequest-C0O_GxCX.js";
import $e from "primevue/selectbutton";
import xe from "primevue/toggleswitch";
import Ce from "primevue/textarea";
const Ve = ["aria-labelledby"], Be = { class: "kx-railhead" }, Se = ["id"], Ue = { key: 0 }, Le = { class: "kx-railhead-acts" }, Ae = { class: "kx-rail-body" }, qe = /* @__PURE__ */ te({
  __name: "ListRail",
  props: {
    title: {},
    count: {}
  },
  setup($) {
    const _ = se();
    return (y, B) => (o(), i("aside", {
      class: "kx-rail",
      "aria-labelledby": t(_)
    }, [
      s("div", Be, [
        s("span", {
          id: t(_),
          class: "kx-railhead-title"
        }, [
          A(u($.title), 1),
          $.count !== void 0 ? (o(), i("b", Ue, u($.count), 1)) : b("", !0)
        ], 8, Se),
        s("div", Le, [
          J(y.$slots, "actions")
        ])
      ]),
      J(y.$slots, "toolbar"),
      s("div", Ae, [
        J(y.$slots, "default")
      ])
    ], 8, Ve));
  }
}), Ie = { class: "work-stack work-tight" }, Te = { class: "work-muted work-small" }, De = { class: "work-muted work-small" }, Re = { class: "work-stack work-tight" }, Ee = { class: "work-stack work-tight" }, Ne = { class: "work-stack work-tight" }, Oe = { class: "work-muted work-small" }, je = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Fe = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ke = { class: "work-pack-choice" }, Me = { class: "work-row" }, We = {
  key: 0,
  class: "work-muted work-small"
}, Ze = { class: "work-muted work-small" }, ze = {
  key: 0,
  class: "work-pack-unavailable"
}, Ge = {
  key: 2,
  class: "work-row work-small"
}, Pe = ["disabled"], He = { class: "work-settings-card work-stack work-tight" }, Je = {
  key: 0,
  class: "work-muted work-small"
}, Ye = { class: "work-mono work-muted" }, Qe = { class: "work-muted work-small" }, Xe = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ea = { class: "work-dialog-actions" }, aa = /* @__PURE__ */ te({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup($, { emit: _ }) {
    const y = $, B = _, g = r(""), v = r(""), p = r("WORK"), k = r(""), w = r(!1), d = r(1), n = r(!1), x = r(!1), V = r(""), S = r(""), D = r([]), m = r(""), h = r({}), U = r(/* @__PURE__ */ new Set()), N = {}, O = K(() => {
      const l = D.value.find((e) => e.id === k.value);
      return !l || !Y(l) ? [] : l.plugins.flatMap((e) => e.config_schema && ye(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    function Z(l) {
      const e = Y(l) ? l.plugins.find((a) => a.problem && a.installed)?.problem : l.problem;
      if (e) return `${e.message} (Error code: ${e.code})`;
      if (Y(l) && l.plugins.some((a) => !a.installed)) return "A required plugin is unavailable.";
    }
    W(k, () => {
      h.value = {}, U.value.clear();
    });
    function z(l, e) {
      e ? U.value.delete(l) : U.value.add(l);
    }
    let L = crypto.randomUUID(), q = "", R = 0;
    const G = K(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...D.value.map((l) => {
      const e = Z(l);
      return { ...l, title: l.title ?? "Unnamed pack", icon: l.icon ?? "tabler:package-off", disabled: !!e, unavailable: e };
    })]), j = K(() => G.value.find((l) => l.id === k.value)), M = K(() => !!g.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(p.value) && !!j.value && !j.value.disabled && !U.value.size && (d.value === 1 || O.value.every((l) => !Object.keys(he(l.schema, h.value[l.id] ?? N)).length)));
    W(() => y.visible, async (l) => {
      const e = ++R;
      if (l) {
        m.value = "", h.value = {}, U.value.clear(), d.value = 1, V.value = "", S.value = "", g.value = "", v.value = "", p.value = "WORK", k.value = "", w.value = !1, L = crypto.randomUUID(), q = "", D.value = [], x.value = !0;
        try {
          const a = await P.packs();
          e === R && (D.value = a);
        } catch (a) {
          e === R && (S.value = ae(a, "Could not load packs."));
        } finally {
          e === R && (x.value = !1);
        }
      }
    }, { immediate: !0 });
    async function H() {
      if (!M.value || n.value) return;
      if (d.value === 1) {
        d.value = 2;
        return;
      }
      n.value = !0, V.value = "";
      const l = k.value ? { pack: k.value, version: j.value?.version, starter: w.value, ...Object.keys(h.value).length ? { plugin_configs: h.value } : {} } : {}, e = { key_prefix: p.value }, a = JSON.stringify([g.value.trim(), v.value, e, l]);
      q && q !== a && (L = crypto.randomUUID()), q = a;
      try {
        if (!m.value) {
          const f = await P.createBoard(g.value.trim(), e, L, l);
          m.value = f.board_id;
        }
        v.value && await P.updateBoard(m.value, { description: v.value }), B("created", m.value), B("close");
      } catch (f) {
        V.value = (m.value ? "Board created. Description was not saved. " : "") + ae(f, "Could not save the board.");
      } finally {
        n.value = !1;
      }
    }
    return (l, e) => (o(), Q(_e, {
      visible: $.visible,
      label: "New board",
      busy: n.value,
      onClose: e[6] || (e[6] = (a) => B("close"))
    }, {
      default: C(() => [
        s("form", {
          class: "work-dialog-box",
          onSubmit: oe(H, ["prevent"])
        }, [
          s("header", Ie, [
            s("span", Te, "Step " + u(d.value) + " of 2", 1),
            s("h2", null, u(d.value === 1 ? "Name your board" : "Choose a pack"), 1),
            s("p", De, u(d.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          d.value === 1 ? (o(), i(E, { key: 0 }, [
            s("label", Re, [
              e[7] || (e[7] = A("Title", -1)),
              c(t(ee), {
                id: "board-title",
                modelValue: g.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => g.value = a),
                autofocus: "",
                required: "",
                disabled: n.value || !!m.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", Ee, [
              e[8] || (e[8] = A("Description", -1)),
              c(t(Ce), {
                id: "board-description",
                modelValue: v.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => v.value = a),
                rows: "3",
                disabled: n.value || !!m.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", Ne, [
              e[9] || (e[9] = A("Item key prefix", -1)),
              c(t(ee), {
                id: "board-prefix",
                modelValue: p.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => p.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: n.value || !!m.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("p", Oe, " Keys look like " + u(p.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (o(), i(E, { key: 1 }, [
            x.value ? (o(), i("p", je, "Loading packs…")) : b("", !0),
            S.value ? (o(), i("p", Fe, u(S.value), 1)) : b("", !0),
            c(t($e), {
              modelValue: k.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => k.value = a),
              class: "work-pack-choices",
              options: G.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: n.value || !!m.value,
              "aria-label": "Board pack"
            }, {
              option: C(({ option: a }) => [
                s("span", Ke, [
                  s("span", Me, [
                    c(t(I), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    s("strong", null, u(a.title), 1),
                    a.version ? (o(), i("span", We, u(a.version), 1)) : b("", !0)
                  ]),
                  s("span", Ze, u(a.description), 1),
                  a.disabled ? (o(), i("span", ze, u(a.unavailable), 1)) : b("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            k.value ? (o(), i("label", Ge, [
              c(t(xe), {
                modelValue: w.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => w.value = a),
                disabled: n.value || !!m.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = A("Include starter items", -1))
            ])) : b("", !0),
            O.value.length ? (o(), i("fieldset", {
              key: 3,
              disabled: n.value || !!m.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (o(!0), i(E, null, X(O.value, (a) => (o(), i("section", {
                key: k.value + ":" + a.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                s("h3", null, u(a.title), 1),
                c(ge, {
                  schema: a.schema,
                  "model-value": h.value[a.id] ?? N,
                  disabled: n.value || !!m.value,
                  "onUpdate:modelValue": (f) => h.value[a.id] = f,
                  onValidity: (f) => z(a.id, f)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Pe)) : b("", !0),
            s("div", He, [
              s("strong", null, u(g.value), 1),
              v.value ? (o(), i("p", Je, u(v.value), 1)) : b("", !0),
              s("span", Ye, u(p.value) + "-1", 1),
              s("p", Qe, u(j.value?.title), 1)
            ])
          ], 64)),
          V.value ? (o(), i("p", Xe, u(V.value), 1)) : b("", !0),
          s("footer", ea, [
            c(t(T), {
              label: d.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: n.value || !!m.value,
              onClick: e[5] || (e[5] = (a) => d.value === 1 ? B("close") : d.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            c(t(T), {
              type: "submit",
              label: d.value === 1 ? "Continue" : m.value ? "Save description" : "Create board",
              loading: n.value,
              disabled: !M.value || n.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function ta() {
  const $ = r([]), _ = r(!0), y = r(""), B = r(""), g = r(!1), v = K(() => $.value.filter((d) => `${d.title} ${d.description ?? ""} ${d.key_prefix ?? ""}`.toLocaleLowerCase().includes(B.value.trim().toLocaleLowerCase()))), p = we();
  async function k(d = !1) {
    const n = p();
    d && (_.value = !0, y.value = "");
    try {
      const x = await P.boards();
      if (!n()) return;
      $.value = x, g.value = !0, y.value = "";
    } catch (x) {
      n() && (y.value = ae(x, "Could not load boards."));
    } finally {
      n() && (_.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return W($, (d) => {
    for (const [n, x] of w) d.some((V) => V.board_id === n) || (x(), w.delete(n));
    for (const n of d) w.has(n.board_id) || w.set(n.board_id, me(`component.${n.board_id}`, () => {
      k();
    }));
  }), ce(k), re(() => {
    p();
    for (const d of w.values()) d();
  }), { boards: $, loading: _, error: y, search: B, visibleBoards: v, hasLoaded: g, load: k };
}
const la = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, sa = {
  key: 1,
  class: "kx-err work-alert-actions"
}, oa = { role: "alert" }, ra = { class: "picker-group" }, ia = { class: "picker-list" }, na = ["aria-label", "aria-describedby", "aria-current", "disabled", "onClick"], da = { class: "picker-name" }, ua = ["id"], ca = {
  key: 3,
  class: "picker-message",
  role: "status"
}, va = ["board-id", "focus-back"], fa = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ma = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ka = {
  key: 3,
  class: "kx-empty"
}, ba = { class: "kx-empty-title" }, pa = { class: "kx-empty-sub" }, ya = /* @__PURE__ */ te({
  __name: "AdminApp",
  setup($) {
    const _ = r(!1), y = r(!1);
    async function B() {
      if (y.value) return !1;
      if (!_.value) return !0;
      y.value = !0;
      try {
        return await le.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        y.value = !1;
      }
    }
    const g = r(!1), v = r(""), p = r(""), k = r(!1), w = r(!1), d = r(!0), n = r(), x = r(), V = r(), { boards: S, loading: D, error: m, search: h, visibleBoards: U, hasLoaded: N, load: O } = ta(), Z = se(), z = K(() => [
      { heading: "Available", boards: U.value.filter((l) => F(l.access)) },
      { heading: "Admin access required", boards: U.value.filter((l) => !F(l.access)) }
    ].filter((l) => l.boards.length));
    let L = !0;
    W(h, () => {
      L = !1;
    });
    function q(l, e = !0) {
      L = !1, g.value = e, e && n.value?.focus({ preventScroll: !0 }), p.value = v.value = l;
    }
    async function R() {
      if (!await B()) return;
      _.value = !1, v.value = "", await ue(), (x.value?.querySelector('[aria-current="true"]') ?? V.value?.querySelector("input"))?.focus();
    }
    function G() {
      L = !1, k.value = !0;
    }
    function j() {
      le.navigate("/system/settings");
    }
    W(S, (l) => {
      if (p.value && !l.some((a) => a.board_id === p.value && F(a.access)) && (p.value = v.value = "", _.value = !1), !L) return;
      L = !1;
      const e = l[0];
      l.length === 1 && e && F(e.access) && q(e.board_id, !1);
    });
    async function M() {
      d.value = !0;
      try {
        w.value = await ve("kickside-work-board-settings");
      } finally {
        d.value = !1;
      }
    }
    ie(M);
    async function H(l) {
      k.value = !1, await O(), q(l);
    }
    return (l, e) => (o(), i("main", {
      class: ne(["kx-shell work-admin-shell", { "work-board-selected": v.value }])
    }, [
      v.value ? b("", !0) : (o(), Q(qe, {
        key: 0,
        class: "work-board-directory",
        title: "Boards",
        count: t(N) ? t(S).length : void 0
      }, {
        actions: C(() => [
          c(t(T), {
            type: "button",
            text: "",
            "aria-label": "Create board",
            title: "Create board",
            onClick: G
          }, {
            icon: C(() => [
              c(t(I), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }),
          c(t(T), {
            type: "button",
            text: "",
            "aria-label": "Application defaults",
            title: "Application defaults",
            onClick: j
          }, {
            icon: C(() => [
              c(t(I), {
                icon: "tabler:settings",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        toolbar: C(() => [
          s("div", {
            ref_key: "searchField",
            ref: V,
            class: "picker-search"
          }, [
            c(t(be), null, {
              default: C(() => [
                c(t(pe), null, {
                  default: C(() => [
                    c(t(I), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                c(t(ee), {
                  type: "search",
                  modelValue: t(h),
                  "onUpdate:modelValue": e[0] || (e[0] = (a) => de(h) ? h.value = a : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                t(h) ? (o(), Q(t(T), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: e[1] || (e[1] = (a) => {
                    h.value = "", V.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: C(() => [
                    c(t(I), {
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
        default: C(() => [
          t(D) ? (o(), i("p", la, "Loading boards…")) : t(m) ? (o(), i("div", sa, [
            s("p", oa, u(t(m)), 1),
            c(t(T), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: e[2] || (e[2] = (a) => t(O)(!0))
            }, {
              icon: C(() => [
                c(t(I), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : b("", !0),
          z.value.length ? (o(), i("ul", {
            key: 2,
            ref_key: "list",
            ref: x,
            class: "picker-list"
          }, [
            (o(!0), i(E, null, X(z.value, (a) => (o(), i("li", {
              key: a.heading
            }, [
              s("h2", ra, u(a.heading), 1),
              s("ul", ia, [
                (o(!0), i(E, null, X(a.boards, (f) => (o(), i("li", {
                  key: f.board_id
                }, [
                  s("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (f.title || "Untitled board"),
                    "aria-describedby": t(Z) + "-" + f.board_id,
                    "aria-current": p.value === f.board_id ? "true" : void 0,
                    disabled: !t(F)(f.access),
                    onClick: (_a) => q(f.board_id)
                  }, [
                    s("span", da, u(f.title || "Untitled board"), 1),
                    s("span", {
                      id: t(Z) + "-" + f.board_id,
                      class: "work-sr-only"
                    }, [
                      f.key_prefix ? (o(), i(E, { key: 0 }, [
                        A(u(f.key_prefix) + " · ", 1)
                      ], 64)) : b("", !0),
                      A(u(f.open_count ?? 0) + "/" + u(f.item_count ?? 0) + " open", 1),
                      t(F)(f.access) ? b("", !0) : (o(), i(E, { key: 1 }, [
                        A(" · Admin access required")
                      ], 64))
                    ], 8, ua)
                  ], 8, na)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : b("", !0),
          t(N) && !t(D) && !t(m) && !t(U).length ? (o(), i("p", ca, u(t(S).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["count"])),
      s("section", {
        ref_key: "detail",
        ref: n,
        class: "work-admin-main",
        "aria-label": "Board settings detail",
        tabindex: "-1"
      }, [
        v.value && w.value ? (o(), i("kickside-work-board-settings", {
          key: v.value,
          "board-id": v.value,
          embedded: "true",
          "focus-back": String(g.value),
          onBackToBoards: R,
          onDirtyChange: e[3] || (e[3] = (a) => _.value = a.detail.dirty)
        }, null, 40, va)) : v.value && d.value ? (o(), i("p", fa, "Loading board settings…")) : v.value ? (o(), i("p", ma, [
          e[5] || (e[5] = A("Board settings are unavailable.", -1)),
          c(t(T), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: R
          }),
          c(t(T), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: M
          }, {
            icon: C(() => [
              c(t(I), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : t(N) && !t(m) ? (o(), i("div", ka, [
          c(t(I), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments",
            "aria-hidden": "true"
          }),
          s("h2", ba, u(t(S).length ? "Choose a board" : "No boards yet"), 1),
          s("p", pa, u(t(S).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."), 1)
        ])) : b("", !0)
      ], 512),
      c(aa, {
        visible: k.value,
        onClose: e[4] || (e[4] = (a) => k.value = !1),
        onCreated: H
      }, null, 8, ["visible"])
    ], 2));
  }
}), ha = fe(ya, { type: "object", properties: {} });
ke(import.meta.url, ha);
//# sourceMappingURL=admin.js.map
