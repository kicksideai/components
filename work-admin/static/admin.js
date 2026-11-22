import { defineComponent as J, openBlock as s, createElementBlock as o, createElementVNode as i, createVNode as n, unref as a, toDisplayString as c, renderSlot as le, createTextVNode as S, createCommentVNode as b, createBlock as Z, createSlots as se, withCtx as x, normalizeClass as ae, Fragment as q, ref as u, computed as M, watch as z, withModifiers as oe, renderList as Y, onUnmounted as ie, useId as re, onMounted as ne, isRef as de, nextTick as ue } from "vue";
import { u as ce, e as ve, a as ke } from "./mount-Chf6MiNr.js";
import "pinia";
import { on as me, host as ee, define as fe } from "@wippy-fe/proxy";
import B from "primevue/button";
import be from "primevue/iconfield";
import pe from "primevue/inputicon";
import Q from "primevue/inputtext";
import { u as ye, a as he, c as ge, p as we, b as _e, _ as $e, d as Ce, w as X, f as te, l as xe, e as K, g as Ve } from "./usePackDiscovery-CfANJ1PP.js";
import { Icon as L } from "@iconify/vue";
import Be from "primevue/selectbutton";
import Se from "primevue/toggleswitch";
import Le from "primevue/textarea";
const Ue = { class: "kx-empty" }, Ae = { class: "kx-empty-ico" }, Ie = { class: "kx-empty-title" }, De = {
  key: 0,
  class: "kx-empty-sub"
}, qe = /* @__PURE__ */ J({
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
    return (y, p) => (s(), o("div", Ue, [
      i("div", Ae, [
        n(a(L), {
          icon: k.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      i("div", Ie, c(k.title), 1),
      k.hint || y.$slots.hint ? (s(), o("p", De, [
        le(y.$slots, "hint", {}, () => [
          S(c(k.hint), 1)
        ])
      ])) : b("", !0),
      k.cta ? (s(), Z(a(B), {
        key: 1,
        label: k.cta,
        onClick: p[0] || (p[0] = (_) => y.$emit("cta"))
      }, se({ _: 2 }, [
        k.ctaIcon ? {
          name: "icon",
          fn: x(({ class: _ }) => [
            n(a(L), {
              icon: k.ctaIcon,
              class: ae(_),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : b("", !0)
    ]));
  }
}), Te = /* @__PURE__ */ J({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(k) {
    return (y, p) => (s(), o(q, null, [
      n(a(B), {
        type: "button",
        text: "",
        "aria-label": k.createLabel,
        title: k.createLabel,
        onClick: p[0] || (p[0] = (_) => y.$emit("create"))
      }, {
        icon: x(() => [
          n(a(L), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      n(a(B), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: p[1] || (p[1] = (_) => y.$emit("defaults"))
      }, {
        icon: x(() => [
          n(a(L), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Re = { class: "work-stack work-tight" }, Ee = { class: "work-muted work-small" }, Ne = { class: "work-muted work-small" }, Oe = { class: "work-stack work-tight" }, je = { class: "work-stack work-tight" }, Fe = { class: "work-stack work-tight" }, Ke = { class: "work-muted work-small" }, Me = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Pe = {
  key: 1,
  class: "kx-err work-alert-actions"
}, We = { role: "alert" }, Ze = { class: "work-pack-choice" }, ze = { class: "work-row" }, Ge = {
  key: 0,
  class: "work-muted work-small"
}, He = { class: "work-muted work-small" }, Je = {
  key: 0,
  class: "work-pack-unavailable"
}, Ye = {
  key: 2,
  class: "work-row work-small"
}, Qe = ["disabled"], Xe = { class: "work-settings-card work-stack work-tight" }, ea = {
  key: 0,
  class: "work-muted work-small"
}, aa = { class: "work-mono work-muted" }, ta = { class: "work-muted work-small" }, la = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, sa = { class: "work-dialog-actions" }, oa = /* @__PURE__ */ J({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(k, { emit: y }) {
    const p = k, _ = y, C = u(""), v = u(""), g = u("WORK"), m = u(""), w = u(!1), d = u(1), r = u(!1), $ = u(""), { packs: U, loading: T, error: P, load: R, reset: A } = ye(), f = u(""), V = u({}), I = u(/* @__PURE__ */ new Set()), W = {}, E = M(() => {
      const l = U.value.find((e) => e.id === m.value);
      return !l || !he(l) ? [] : l.plugins.flatMap((e) => e.config_schema && ge(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    z(m, () => {
      V.value = {}, I.value.clear();
    });
    function N(l, e) {
      e ? I.value.delete(l) : I.value.add(l);
    }
    let O = crypto.randomUUID(), j = "";
    const G = M(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...U.value.map(we)]), F = M(() => G.value.find((l) => l.id === m.value)), H = M(() => !!C.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(g.value) && !!F.value && !F.value.disabled && !I.value.size && (d.value === 1 || E.value.every((l) => !Object.keys(_e(l.schema, V.value[l.id] ?? W, !1)).length)));
    z(() => p.visible, (l) => {
      A(), l && (f.value = "", V.value = {}, I.value.clear(), d.value = 1, $.value = "", C.value = "", v.value = "", g.value = "WORK", m.value = "", w.value = !1, O = crypto.randomUUID(), j = "", R());
    }, { immediate: !0 });
    async function h() {
      if (!H.value || r.value) return;
      if (d.value === 1) {
        d.value = 2;
        return;
      }
      r.value = !0, $.value = "";
      const l = m.value ? { pack: m.value, version: F.value?.version, starter: w.value, ...Object.keys(V.value).length ? { plugin_configs: V.value } : {} } : {}, e = { key_prefix: g.value }, t = JSON.stringify([C.value.trim(), v.value, e, l]);
      j && j !== t && (O = crypto.randomUUID()), j = t;
      try {
        if (!f.value) {
          const D = await X.createBoard(C.value.trim(), e, O, l);
          f.value = D.board_id;
        }
        v.value && await X.updateBoard(f.value, { description: v.value }), _("created", f.value), _("close");
      } catch (D) {
        $.value = (f.value ? "Board created. Description was not saved. " : "") + te(D, "Could not save the board.");
      } finally {
        r.value = !1;
      }
    }
    return (l, e) => (s(), Z($e, {
      visible: k.visible,
      label: "New board",
      busy: r.value,
      onClose: e[7] || (e[7] = (t) => _("close"))
    }, {
      default: x(() => [
        i("form", {
          class: "work-dialog-box",
          onSubmit: oe(h, ["prevent"])
        }, [
          i("header", Re, [
            i("span", Ee, "Step " + c(d.value) + " of 2", 1),
            i("h2", null, c(d.value === 1 ? "Name your board" : "Choose a pack"), 1),
            i("p", Ne, c(d.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          d.value === 1 ? (s(), o(q, { key: 0 }, [
            i("label", Oe, [
              e[8] || (e[8] = S("Title", -1)),
              n(a(Q), {
                id: "board-title",
                modelValue: C.value,
                "onUpdate:modelValue": e[0] || (e[0] = (t) => C.value = t),
                autofocus: "",
                required: "",
                disabled: r.value || !!f.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("label", je, [
              e[9] || (e[9] = S("Description", -1)),
              n(a(Le), {
                id: "board-description",
                modelValue: v.value,
                "onUpdate:modelValue": e[1] || (e[1] = (t) => v.value = t),
                rows: "3",
                disabled: r.value || !!f.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("label", Fe, [
              e[10] || (e[10] = S("Item key prefix", -1)),
              n(a(Q), {
                id: "board-prefix",
                modelValue: g.value,
                "onUpdate:modelValue": e[2] || (e[2] = (t) => g.value = t),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: r.value || !!f.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            i("p", Ke, " Keys look like " + c(g.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (s(), o(q, { key: 1 }, [
            a(T) ? (s(), o("p", Me, "Loading packs…")) : b("", !0),
            a(P) ? (s(), o("div", Pe, [
              i("p", We, c(a(P)), 1),
              n(a(B), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: e[3] || (e[3] = (t) => a(R)())
              })
            ])) : b("", !0),
            n(a(Be), {
              modelValue: m.value,
              "onUpdate:modelValue": e[4] || (e[4] = (t) => m.value = t),
              class: "work-pack-choices",
              options: G.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: r.value || !!f.value,
              "aria-label": "Board pack"
            }, {
              option: x(({ option: t }) => [
                i("span", Ze, [
                  i("span", ze, [
                    n(a(L), {
                      icon: t.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    i("strong", null, c(t.title), 1),
                    t.version ? (s(), o("span", Ge, c(t.version), 1)) : b("", !0)
                  ]),
                  i("span", He, c(t.description), 1),
                  t.disabled ? (s(), o("span", Je, c(t.unavailable), 1)) : b("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            m.value ? (s(), o("label", Ye, [
              n(a(Se), {
                modelValue: w.value,
                "onUpdate:modelValue": e[5] || (e[5] = (t) => w.value = t),
                disabled: r.value || !!f.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[11] || (e[11] = S("Include starter items", -1))
            ])) : b("", !0),
            E.value.length ? (s(), o("fieldset", {
              key: 3,
              disabled: r.value || !!f.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (s(!0), o(q, null, Y(E.value, (t) => (s(), o("section", {
                key: m.value + ":" + t.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                i("h3", null, c(t.title), 1),
                n(Ce, {
                  schema: t.schema,
                  "model-value": V.value[t.id] ?? W,
                  disabled: r.value || !!f.value,
                  "suggest-defaults": "",
                  "onUpdate:modelValue": (D) => V.value[t.id] = D,
                  onValidity: (D) => N(t.id, D)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Qe)) : b("", !0),
            i("div", Xe, [
              i("strong", null, c(C.value), 1),
              v.value ? (s(), o("p", ea, c(v.value), 1)) : b("", !0),
              i("span", aa, c(g.value) + "-1", 1),
              i("p", ta, c(F.value?.title), 1)
            ])
          ], 64)),
          $.value ? (s(), o("p", la, c($.value), 1)) : b("", !0),
          i("footer", sa, [
            n(a(B), {
              label: d.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: r.value || !!f.value,
              onClick: e[6] || (e[6] = (t) => d.value === 1 ? _("close") : d.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            n(a(B), {
              type: "submit",
              label: d.value === 1 ? "Continue" : f.value ? "Save description" : "Create board",
              loading: r.value,
              disabled: !H.value || r.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function ia() {
  const k = u([]), y = u(!0), p = u(""), _ = u(""), C = u(!1), v = M(() => k.value.filter((d) => `${d.title} ${d.description ?? ""} ${d.key_prefix ?? ""}`.toLocaleLowerCase().includes(_.value.trim().toLocaleLowerCase()))), g = xe();
  async function m(d = !1) {
    const r = g();
    d && (y.value = !0, p.value = "");
    try {
      const $ = await X.boards();
      if (!r()) return;
      k.value = $, C.value = !0, p.value = "";
    } catch ($) {
      r() && (p.value = te($, "Could not load boards."));
    } finally {
      r() && (y.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return z(k, (d) => {
    for (const [r, $] of w) d.some((U) => U.board_id === r) || ($(), w.delete(r));
    for (const r of d) w.has(r.board_id) || w.set(r.board_id, me(`component.${r.board_id}`, () => {
      m();
    }));
  }), ce(m), ie(() => {
    g();
    for (const d of w.values()) d();
  }), { boards: k, loading: y, error: p, search: _, visibleBoards: v, hasLoaded: C, load: m };
}
const ra = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, na = {
  key: 1,
  class: "kx-err work-alert-actions"
}, da = { role: "alert" }, ua = {
  key: 0,
  class: "picker-group"
}, ca = { class: "picker-list" }, va = ["aria-label", "aria-describedby", "aria-current", "disabled", "onClick"], ka = { class: "picker-name" }, ma = ["id"], fa = {
  key: 3,
  class: "picker-message",
  role: "status"
}, ba = ["board-id", "focus-back"], pa = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ya = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ha = /* @__PURE__ */ J({
  __name: "AdminApp",
  setup(k) {
    const y = u(!1), p = u(!1);
    async function _() {
      if (p.value) return !1;
      if (!y.value) return !0;
      p.value = !0;
      try {
        return await ee.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        p.value = !1;
      }
    }
    const C = u(!1), v = u(""), g = u(""), m = u(!1), w = u(!1), d = u(!0), r = u(), $ = u(), U = u(), { boards: T, loading: P, error: R, search: A, visibleBoards: f, hasLoaded: V, load: I } = ia(), W = re(), E = M(() => [
      { heading: "Available", boards: f.value.filter((h) => K(h.access)) },
      { heading: "Admin access required", boards: f.value.filter((h) => !K(h.access)) }
    ].filter((h) => h.boards.length));
    let N = !0;
    z(A, () => {
      N = !1;
    });
    function O(h, l = !0) {
      N = !1, C.value = l, l && r.value?.focus({ preventScroll: !0 }), g.value = v.value = h;
    }
    async function j() {
      return await _() ? (y.value = !1, v.value = "", await ue(), ($.value?.querySelector('[aria-current="true"]') ?? U.value?.querySelector("input"))?.focus(), !0) : !1;
    }
    function G() {
      N = !1, m.value = !0;
    }
    z(T, (h) => {
      if (g.value && !h.some((e) => e.board_id === g.value && K(e.access)) && (g.value = v.value = "", y.value = !1), !N) return;
      N = !1;
      const l = h[0];
      h.length === 1 && l && K(l.access) && O(l.board_id, !1);
    });
    async function F() {
      d.value = !0;
      try {
        w.value = await ve("kickside-work-board-settings");
      } finally {
        d.value = !1;
      }
    }
    ne(F);
    async function H(h) {
      m.value = !1, await I(), O(h);
    }
    return (h, l) => (s(), o("main", {
      class: ae(["kx-shell kx-settings-shell work-admin-shell", { "work-board-selected": v.value && w.value }])
    }, [
      !v.value || !w.value ? (s(), Z(Ve, {
        key: 0,
        settings: "",
        class: "work-board-directory",
        title: "Boards",
        count: a(V) ? a(T).length : void 0
      }, {
        actions: x(() => [
          n(Te, {
            "create-label": "Create board",
            onCreate: G,
            onDefaults: l[0] || (l[0] = (e) => a(ee).navigate("/system/settings"))
          })
        ]),
        toolbar: x(() => [
          i("div", {
            ref_key: "searchField",
            ref: U,
            class: "picker-search"
          }, [
            n(a(be), null, {
              default: x(() => [
                n(a(pe), null, {
                  default: x(() => [
                    n(a(L), {
                      icon: "tabler:search",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }),
                n(a(Q), {
                  type: "search",
                  modelValue: a(A),
                  "onUpdate:modelValue": l[1] || (l[1] = (e) => de(A) ? A.value = e : null),
                  class: "picker-search-input",
                  "aria-label": "Search boards",
                  placeholder: "Search boards…"
                }, null, 8, ["modelValue"]),
                a(A) ? (s(), Z(a(B), {
                  key: 0,
                  type: "button",
                  text: "",
                  severity: "secondary",
                  class: "picker-search-clear",
                  "aria-label": "Clear search",
                  onClick: l[2] || (l[2] = (e) => {
                    A.value = "", U.value?.querySelector("input")?.focus();
                  })
                }, {
                  icon: x(() => [
                    n(a(L), {
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
        default: x(() => [
          a(P) ? (s(), o("p", ra, "Loading boards…")) : a(R) ? (s(), o("div", na, [
            i("p", da, c(a(R)), 1),
            n(a(B), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              onClick: l[3] || (l[3] = (e) => a(I)(!0))
            }, {
              icon: x(() => [
                n(a(L), {
                  icon: "tabler:refresh",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])) : b("", !0),
          E.value.length ? (s(), o("ul", {
            key: 2,
            ref_key: "list",
            ref: $,
            class: "picker-list"
          }, [
            (s(!0), o(q, null, Y(E.value, (e) => (s(), o("li", {
              key: e.heading
            }, [
              E.value.length > 1 || e.heading !== "Available" ? (s(), o("h2", ua, c(e.heading), 1)) : b("", !0),
              i("ul", ca, [
                (s(!0), o(q, null, Y(e.boards, (t) => (s(), o("li", {
                  key: t.board_id
                }, [
                  i("button", {
                    type: "button",
                    class: "picker-row work-rail-row",
                    "aria-label": "Settings for " + (t.title || "Untitled board"),
                    "aria-describedby": a(W) + "-" + t.board_id,
                    "aria-current": g.value === t.board_id ? "true" : void 0,
                    disabled: !a(K)(t.access),
                    onClick: (D) => O(t.board_id)
                  }, [
                    i("span", ka, c(t.title || "Untitled board"), 1),
                    i("span", {
                      id: a(W) + "-" + t.board_id,
                      class: "work-sr-only"
                    }, [
                      t.key_prefix ? (s(), o(q, { key: 0 }, [
                        S(c(t.key_prefix) + " · ", 1)
                      ], 64)) : b("", !0),
                      S(c(t.open_count ?? 0) + "/" + c(t.item_count ?? 0) + " open", 1),
                      a(K)(t.access) ? b("", !0) : (s(), o(q, { key: 1 }, [
                        S(" · Admin access required")
                      ], 64))
                    ], 8, ma)
                  ], 8, va)
                ]))), 128))
              ])
            ]))), 128))
          ], 512)) : b("", !0),
          a(V) && !a(P) && !a(R) && !a(f).length ? (s(), o("p", fa, c(a(T).length ? "No boards match. Try another name or key." : "Create a board or ask a board administrator to grant you access."), 1)) : b("", !0)
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
        v.value && w.value ? (s(), o("kickside-work-board-settings", {
          key: v.value,
          "board-id": v.value,
          embedded: "true",
          "focus-back": String(C.value),
          onBackToBoards: j,
          onDirtyChange: l[4] || (l[4] = (e) => y.value = e.detail.dirty)
        }, null, 40, ba)) : v.value && d.value ? (s(), o("p", pa, "Loading board settings…")) : v.value ? (s(), o("p", ya, [
          l[6] || (l[6] = S("Board settings are unavailable.", -1)),
          n(a(B), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            onClick: j
          }),
          n(a(B), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: F
          }, {
            icon: x(() => [
              n(a(L), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : a(V) && !a(R) ? (s(), Z(qe, {
          key: 3,
          icon: "tabler:adjustments",
          title: a(T).length ? "Choose a board" : "No boards yet",
          hint: a(T).length ? "Select a board to manage its items, workflow, access and plugins." : "Create a board to set up its items, workflow, access and plugins."
        }, null, 8, ["title", "hint"])) : b("", !0)
      ], 512),
      n(oa, {
        visible: m.value,
        onClose: l[5] || (l[5] = (e) => m.value = !1),
        onCreated: H
      }, null, 8, ["visible"])
    ], 2));
  }
}), ga = ke(ha, { type: "object", properties: {} });
fe(import.meta.url, ga);
//# sourceMappingURL=admin.js.map
