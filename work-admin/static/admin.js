import { defineComponent as ae, ref as n, computed as O, watch as M, openBlock as d, createBlock as le, withCtx as A, createElementVNode as s, withModifiers as oe, toDisplayString as c, createElementBlock as v, Fragment as z, createTextVNode as I, createVNode as k, unref as a, createCommentVNode as b, renderList as te, onUnmounted as re, onMounted as ie, normalizeClass as Q, isRef as ne, nextTick as X } from "vue";
import { u as de, e as ue, a as ce } from "./mount-6xLuMEcF.js";
import "pinia";
import { on as ve, host as ee, define as me } from "@wippy-fe/proxy";
import E from "primevue/button";
import { a as P, c as ke, b as fe, w as K, f as H, _ as be, d as pe, l as we, e as G, g as ye } from "./latestRequest-DwIpRsvA.js";
import J from "primevue/inputtext";
import { Icon as R } from "@iconify/vue";
import ge from "primevue/selectbutton";
import he from "primevue/toggleswitch";
import _e from "primevue/textarea";
const $e = { class: "work-stack work-tight" }, Ce = { class: "work-muted work-small" }, xe = { class: "work-muted work-small" }, Ve = { class: "work-stack work-tight" }, Be = { class: "work-stack work-tight" }, Se = { class: "work-stack work-tight" }, Ue = { class: "work-muted work-small" }, Le = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ae = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, qe = { class: "work-pack-choice" }, Te = { class: "work-row" }, De = {
  key: 0,
  class: "work-muted work-small"
}, Re = { class: "work-muted work-small" }, Ee = {
  key: 0,
  class: "work-pack-unavailable"
}, Ne = {
  key: 2,
  class: "work-row work-small"
}, Ie = ["disabled"], Oe = { class: "work-settings-card work-stack work-tight" }, We = {
  key: 0,
  class: "work-muted work-small"
}, je = { class: "work-mono work-muted" }, ze = { class: "work-muted work-small" }, Ke = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Me = { class: "work-dialog-actions" }, Ze = /* @__PURE__ */ ae({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(L, { emit: V }) {
    const B = L, x = V, w = n(""), _ = n(""), $ = n("WORK"), o = n(""), p = n(!1), u = n(1), r = n(!1), y = n(!1), S = n(""), g = n(""), q = n([]), f = n(""), C = n({}), U = n(/* @__PURE__ */ new Set()), T = {}, N = O(() => {
      const i = q.value.find((e) => e.id === o.value);
      return !i || !P(i) ? [] : i.plugins.flatMap((e) => e.config_schema && ke(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    function W(i) {
      const e = P(i) ? i.plugins.find((l) => l.problem && l.installed)?.problem : i.problem;
      if (e) return `${e.message} (Error code: ${e.code})`;
      if (P(i) && i.plugins.some((l) => !l.installed)) return "A required plugin is unavailable.";
    }
    M(o, () => {
      C.value = {}, U.value.clear();
    });
    function Z(i, e) {
      e ? U.value.delete(i) : U.value.add(i);
    }
    let h = crypto.randomUUID(), t = "", m = 0;
    const F = O(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...q.value.map((i) => {
      const e = W(i);
      return { ...i, title: i.title ?? "Unnamed pack", icon: i.icon ?? "tabler:package-off", disabled: !!e, unavailable: e };
    })]), j = O(() => F.value.find((i) => i.id === o.value)), Y = O(() => !!w.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test($.value) && !!j.value && !j.value.disabled && !U.value.size && (u.value === 1 || N.value.every((i) => !Object.keys(fe(i.schema, C.value[i.id] ?? T)).length)));
    M(() => B.visible, async (i) => {
      const e = ++m;
      if (i) {
        f.value = "", C.value = {}, U.value.clear(), u.value = 1, S.value = "", g.value = "", w.value = "", _.value = "", $.value = "WORK", o.value = "", p.value = !1, h = crypto.randomUUID(), t = "", q.value = [], y.value = !0;
        try {
          const l = await K.packs();
          e === m && (q.value = l);
        } catch (l) {
          e === m && (g.value = H(l, "Could not load packs."));
        } finally {
          e === m && (y.value = !1);
        }
      }
    }, { immediate: !0 });
    async function se() {
      if (!Y.value || r.value) return;
      if (u.value === 1) {
        u.value = 2;
        return;
      }
      r.value = !0, S.value = "";
      const i = o.value ? { pack: o.value, version: j.value?.version, starter: p.value, ...Object.keys(C.value).length ? { plugin_configs: C.value } : {} } : {}, e = { key_prefix: $.value }, l = JSON.stringify([w.value.trim(), _.value, e, i]);
      t && t !== l && (h = crypto.randomUUID()), t = l;
      try {
        if (!f.value) {
          const D = await K.createBoard(w.value.trim(), e, h, i);
          f.value = D.board_id;
        }
        _.value && await K.updateBoard(f.value, { description: _.value }), x("created", f.value), x("close");
      } catch (D) {
        S.value = (f.value ? "Board created. Description was not saved. " : "") + H(D, "Could not save the board.");
      } finally {
        r.value = !1;
      }
    }
    return (i, e) => (d(), le(be, {
      visible: L.visible,
      label: "New board",
      busy: r.value,
      onClose: e[6] || (e[6] = (l) => x("close"))
    }, {
      default: A(() => [
        s("form", {
          class: "work-dialog-box",
          onSubmit: oe(se, ["prevent"])
        }, [
          s("header", $e, [
            s("span", Ce, "Step " + c(u.value) + " of 2", 1),
            s("h2", null, c(u.value === 1 ? "Name your board" : "Choose a pack"), 1),
            s("p", xe, c(u.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          u.value === 1 ? (d(), v(z, { key: 0 }, [
            s("label", Ve, [
              e[7] || (e[7] = I("Title", -1)),
              k(a(J), {
                id: "board-title",
                modelValue: w.value,
                "onUpdate:modelValue": e[0] || (e[0] = (l) => w.value = l),
                autofocus: "",
                required: "",
                disabled: r.value || !!f.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", Be, [
              e[8] || (e[8] = I("Description", -1)),
              k(a(_e), {
                id: "board-description",
                modelValue: _.value,
                "onUpdate:modelValue": e[1] || (e[1] = (l) => _.value = l),
                rows: "3",
                disabled: r.value || !!f.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", Se, [
              e[9] || (e[9] = I("Item key prefix", -1)),
              k(a(J), {
                id: "board-prefix",
                modelValue: $.value,
                "onUpdate:modelValue": e[2] || (e[2] = (l) => $.value = l),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: r.value || !!f.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("p", Ue, " Keys look like " + c($.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), v(z, { key: 1 }, [
            y.value ? (d(), v("p", Le, "Loading packs…")) : b("", !0),
            g.value ? (d(), v("p", Ae, c(g.value), 1)) : b("", !0),
            k(a(ge), {
              modelValue: o.value,
              "onUpdate:modelValue": e[3] || (e[3] = (l) => o.value = l),
              class: "work-pack-choices",
              options: F.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: r.value || !!f.value,
              "aria-label": "Board pack"
            }, {
              option: A(({ option: l }) => [
                s("span", qe, [
                  s("span", Te, [
                    k(a(R), {
                      icon: l.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    s("strong", null, c(l.title), 1),
                    l.version ? (d(), v("span", De, c(l.version), 1)) : b("", !0)
                  ]),
                  s("span", Re, c(l.description), 1),
                  l.disabled ? (d(), v("span", Ee, c(l.unavailable), 1)) : b("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            o.value ? (d(), v("label", Ne, [
              k(a(he), {
                modelValue: p.value,
                "onUpdate:modelValue": e[4] || (e[4] = (l) => p.value = l),
                disabled: r.value || !!f.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = I("Include starter items", -1))
            ])) : b("", !0),
            N.value.length ? (d(), v("fieldset", {
              key: 3,
              disabled: r.value || !!f.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (d(!0), v(z, null, te(N.value, (l) => (d(), v("section", {
                key: o.value + ":" + l.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                s("h3", null, c(l.title), 1),
                k(pe, {
                  schema: l.schema,
                  "model-value": C.value[l.id] ?? T,
                  disabled: r.value || !!f.value,
                  "onUpdate:modelValue": (D) => C.value[l.id] = D,
                  onValidity: (D) => Z(l.id, D)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Ie)) : b("", !0),
            s("div", Oe, [
              s("strong", null, c(w.value), 1),
              _.value ? (d(), v("p", We, c(_.value), 1)) : b("", !0),
              s("span", je, c($.value) + "-1", 1),
              s("p", ze, c(j.value?.title), 1)
            ])
          ], 64)),
          S.value ? (d(), v("p", Ke, c(S.value), 1)) : b("", !0),
          s("footer", Me, [
            k(a(E), {
              label: u.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: r.value || !!f.value,
              onClick: e[5] || (e[5] = (l) => u.value === 1 ? x("close") : u.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            k(a(E), {
              type: "submit",
              label: u.value === 1 ? "Continue" : f.value ? "Save description" : "Create board",
              loading: r.value,
              disabled: !Y.value || r.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Fe() {
  const L = n([]), V = n(!0), B = n(""), x = n(""), w = n(!1), _ = O(() => L.value.filter((u) => `${u.title} ${u.description ?? ""} ${u.key_prefix ?? ""}`.toLocaleLowerCase().includes(x.value.trim().toLocaleLowerCase()))), $ = we();
  async function o(u = !1) {
    const r = $();
    u && (V.value = !0, B.value = "");
    try {
      const y = await K.boards();
      if (!r()) return;
      L.value = y, w.value = !0, B.value = "";
    } catch (y) {
      r() && (B.value = H(y, "Could not load boards."));
    } finally {
      r() && (V.value = !1);
    }
  }
  const p = /* @__PURE__ */ new Map();
  return M(L, (u) => {
    for (const [r, y] of p) u.some((S) => S.board_id === r) || (y(), p.delete(r));
    for (const r of u) p.has(r.board_id) || p.set(r.board_id, ve(`component.${r.board_id}`, () => {
      o();
    }));
  }), de(o), re(() => {
    $();
    for (const u of p.values()) u();
  }), { boards: L, loading: V, error: B, search: x, visibleBoards: _, hasLoaded: w, load: o };
}
const Pe = { class: "work-railhead" }, Ge = ["aria-label"], He = {
  key: 0,
  class: "work-muted work-small"
}, Je = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ye = {
  key: 2,
  class: "kx-err work-alert-actions"
}, Qe = { role: "alert" }, Xe = { class: "work-stack work-tight" }, ea = { class: "work-row work-wrap" }, aa = { class: "work-mono" }, la = { class: "work-muted work-small" }, ta = {
  key: 0,
  class: "work-muted work-small"
}, sa = {
  key: 3,
  class: "work-muted work-small"
}, oa = {
  key: 0,
  class: "work-mobile-board-back"
}, ra = ["board-id"], ia = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, na = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, da = {
  key: 4,
  class: "kx-empty"
}, ua = /* @__PURE__ */ ae({
  __name: "AdminApp",
  setup(L) {
    const V = n(!1), B = n(!1);
    async function x() {
      if (B.value) return !1;
      if (!V.value) return !0;
      B.value = !0;
      try {
        return await ee.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        B.value = !1;
      }
    }
    async function w(h) {
      if (o.value === h || !await x()) return;
      V.value = !1, o.value = h, await X();
      const t = S.value?.querySelector(".work-mobile-board-back button");
      t?.getClientRects().length && t.focus();
    }
    async function _() {
      if (!await x()) return;
      const h = y.value?.querySelector('[aria-current="page"]');
      V.value = !1, o.value = "", await X(), (h ?? y.value?.querySelector("input"))?.focus();
    }
    async function $() {
      await x() && ee.navigate("/system/settings");
    }
    const o = n(""), p = n(!1), u = n(!1), r = n(!0), y = n(), S = n(), { boards: g, loading: q, error: f, search: C, visibleBoards: U, hasLoaded: T, load: N } = Fe();
    M(g, (h) => {
      o.value && !h.some((t) => t.board_id === o.value && G(t.access)) && (o.value = "");
    });
    async function W() {
      r.value = !0, u.value = await ue("kickside-work-board-settings"), r.value = !1;
    }
    ie(W);
    async function Z(h) {
      await N(), await w(h);
    }
    return (h, t) => (d(), v("main", {
      class: Q(["work-admin-shell", { "work-board-selected": o.value }])
    }, [
      s("nav", {
        ref_key: "rail",
        ref: y,
        class: "work-rail",
        "aria-label": "Board settings navigation"
      }, [
        s("header", Pe, [
          s("h2", null, [
            t[5] || (t[5] = I("Boards ", -1)),
            a(T) ? (d(), v("span", {
              key: 0,
              class: "work-count work-mono",
              "aria-label": a(g).length + (a(g).length === 1 ? " board" : " boards")
            }, c(a(g).length), 9, Ge)) : b("", !0)
          ]),
          k(a(E), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: t[0] || (t[0] = (m) => p.value = !0)
          }, {
            default: A(() => [
              k(a(R), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        k(a(J), {
          modelValue: a(C),
          "onUpdate:modelValue": t[1] || (t[1] = (m) => ne(C) ? C.value = m : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        a(T) && a(C).trim() ? (d(), v("p", He, c(a(U).length) + " of " + c(a(g).length) + " " + c(a(g).length === 1 ? "board" : "boards"), 1)) : b("", !0),
        a(q) ? (d(), v("p", Je, "Loading boards…")) : a(f) ? (d(), v("div", Ye, [
          s("p", Qe, c(a(f)), 1),
          k(a(E), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: t[2] || (t[2] = (m) => a(N)(!0))
          }, {
            icon: A(() => [
              k(a(R), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : b("", !0),
        t[6] || (t[6] = s("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        k(a(E), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: $
        }, {
          icon: A(() => [
            k(a(R), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        t[7] || (t[7] = s("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), v(z, null, te(a(U), (m) => (d(), le(ye, {
          key: m.board_id,
          class: Q(["work-rail-row", { "work-rail-active": o.value === m.board_id }]),
          "aria-label": "Settings for " + m.title,
          "aria-current": o.value === m.board_id ? "page" : void 0,
          disabled: !a(G)(m.access),
          onActivate: (F) => w(m.board_id)
        }, {
          default: A(() => [
            s("span", Xe, [
              s("strong", null, c(m.title || "Untitled board"), 1),
              s("span", ea, [
                s("code", aa, c(m.key_prefix || "Board"), 1)
              ]),
              s("span", la, c(m.item_count ?? 0) + " " + c(m.item_count === 1 ? "item" : "items") + " · " + c(m.open_count ?? 0) + " open", 1),
              a(G)(m.access) ? b("", !0) : (d(), v("span", ta, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        a(T) && !a(q) && !a(f) && !a(U).length ? (d(), v("p", sa, c(a(g).length ? "No boards match this search." : "No readable boards."), 1)) : b("", !0)
      ], 512),
      s("section", {
        ref_key: "detail",
        ref: S,
        class: "work-admin-main",
        "aria-label": "Board settings detail"
      }, [
        o.value ? (d(), v("div", oa, [
          k(a(E), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: _
          }, {
            icon: A(() => [
              k(a(R), {
                icon: "tabler:arrow-left",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : b("", !0),
        o.value && u.value ? (d(), v("kickside-work-board-settings", {
          key: o.value,
          "board-id": o.value,
          embedded: "true",
          onDirtyChange: t[3] || (t[3] = (m) => V.value = m.detail.dirty)
        }, null, 40, ra)) : o.value && r.value ? (d(), v("p", ia, "Loading board settings…")) : o.value ? (d(), v("p", na, [
          t[8] || (t[8] = I("Board settings are unavailable.", -1)),
          k(a(E), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: W
          }, {
            icon: A(() => [
              k(a(R), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : a(T) && a(g).length ? (d(), v("div", da, [
          k(a(R), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          t[9] || (t[9] = s("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          t[10] || (t[10] = s("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ])) : b("", !0)
      ], 512),
      k(Ze, {
        visible: p.value,
        onClose: t[4] || (t[4] = (m) => p.value = !1),
        onCreated: Z
      }, null, 8, ["visible"])
    ], 2));
  }
}), ca = ce(ua, { type: "object", properties: {} });
me(import.meta.url, ca);
//# sourceMappingURL=admin.js.map
