import { defineComponent as X, ref as r, computed as j, watch as P, openBlock as d, createBlock as ee, withCtx as A, createElementVNode as t, withModifiers as te, toDisplayString as n, createElementBlock as v, Fragment as K, createTextVNode as W, createVNode as k, unref as e, createCommentVNode as w, renderList as ae, onUnmounted as se, onMounted as oe, normalizeClass as J, isRef as ie, nextTick as Y } from "vue";
import { u as re, e as ne, a as de } from "./mount-DH0eHrQ3.js";
import "pinia";
import { on as ue, host as Q, define as ce } from "@wippy-fe/proxy";
import I from "primevue/button";
import { a as M, w as O, f as G, _ as ve, b as me, l as ke, c as F, d as pe } from "./latestRequest-DbPJ4unS.js";
import H from "primevue/inputtext";
import { Icon as D } from "@iconify/vue";
import be from "primevue/selectbutton";
import fe from "primevue/toggleswitch";
import we from "primevue/textarea";
const ye = { class: "work-stack work-tight" }, ge = { class: "work-muted work-small" }, _e = { class: "work-muted work-small" }, he = { class: "work-stack work-tight" }, $e = { class: "work-stack work-tight" }, xe = { class: "work-stack work-tight" }, Ce = { class: "work-muted work-small" }, Ve = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Be = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Se = { class: "work-pack-choice" }, Ue = { class: "work-row" }, Le = {
  key: 0,
  class: "work-muted work-small"
}, qe = { class: "work-muted work-small" }, Ae = {
  key: 0,
  class: "work-pack-unavailable"
}, Te = {
  key: 2,
  class: "work-row work-small"
}, De = ["disabled"], Ie = { class: "work-muted work-small" }, Re = { class: "work-settings-card work-stack work-tight" }, Ne = {
  key: 0,
  class: "work-muted work-small"
}, Ee = { class: "work-mono work-muted" }, We = { class: "work-muted work-small" }, je = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ze = { class: "work-dialog-actions" }, Ke = /* @__PURE__ */ X({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(L, { emit: V }) {
    const B = L, C = V, y = r(""), h = r(""), $ = r("WORK"), o = r(""), b = r(!1), u = r(1), i = r(!1), g = r(!1), S = r(""), _ = r(""), T = r([]), p = r(""), x = r({}), U = r(/* @__PURE__ */ new Set()), R = j(() => {
      const m = T.value.find((a) => a.id === o.value);
      return m && M(m) ? m.plugins : [];
    });
    P(o, () => {
      x.value = {}, U.value.clear();
    });
    function z(m, a) {
      a ? U.value.delete(m) : U.value.add(m);
    }
    let N = crypto.randomUUID(), E = "", f = 0;
    const s = j(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...T.value.map((m) => ({ ...m, title: m.title ?? m.id, icon: m.icon ?? "tabler:package-off", disabled: !M(m) || m.plugins.some((a) => !a.installed), unavailable: M(m) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : m.problem.message }))]), c = j(() => s.value.find((m) => m.id === o.value)), Z = j(() => !!y.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test($.value) && !!c.value && !c.value.disabled && !U.value.size);
    P(() => B.visible, async (m) => {
      const a = ++f;
      if (m) {
        p.value = "", x.value = {}, U.value.clear(), u.value = 1, S.value = "", _.value = "", y.value = "", h.value = "", $.value = "WORK", o.value = "", b.value = !1, N = crypto.randomUUID(), E = "", T.value = [], g.value = !0;
        try {
          const l = await O.packs();
          a === f && (T.value = l);
        } catch (l) {
          a === f && (_.value = G(l, "Could not load packs."));
        } finally {
          a === f && (g.value = !1);
        }
      }
    }, { immediate: !0 });
    async function le() {
      if (!Z.value || i.value) return;
      if (u.value === 1) {
        u.value = 2;
        return;
      }
      i.value = !0, S.value = "";
      const m = o.value ? { pack: o.value, version: c.value?.version, starter: b.value, ...Object.keys(x.value).length ? { plugin_configs: x.value } : {} } : {}, a = { key_prefix: $.value }, l = JSON.stringify([y.value.trim(), h.value, a, m]);
      E && E !== l && (N = crypto.randomUUID()), E = l;
      try {
        if (!p.value) {
          const q = await O.createBoard(y.value.trim(), a, N, m);
          p.value = q.board_id;
        }
        h.value && await O.updateBoard(p.value, { description: h.value }), C("created", p.value), C("close");
      } catch (q) {
        S.value = (p.value ? "Board created. Description was not saved. " : "") + G(q, "Could not save the board.");
      } finally {
        i.value = !1;
      }
    }
    return (m, a) => (d(), ee(ve, {
      visible: L.visible,
      label: "New board",
      busy: i.value,
      onClose: a[6] || (a[6] = (l) => C("close"))
    }, {
      default: A(() => [
        t("form", {
          class: "work-dialog-box",
          onSubmit: te(le, ["prevent"])
        }, [
          t("header", ye, [
            t("span", ge, "Step " + n(u.value) + " of 2", 1),
            t("h2", null, n(u.value === 1 ? "Name your board" : "Choose a pack"), 1),
            t("p", _e, n(u.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          u.value === 1 ? (d(), v(K, { key: 0 }, [
            t("label", he, [
              a[7] || (a[7] = W("Title", -1)),
              k(e(H), {
                id: "board-title",
                modelValue: y.value,
                "onUpdate:modelValue": a[0] || (a[0] = (l) => y.value = l),
                autofocus: "",
                required: "",
                disabled: i.value || !!p.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", $e, [
              a[8] || (a[8] = W("Description", -1)),
              k(e(we), {
                id: "board-description",
                modelValue: h.value,
                "onUpdate:modelValue": a[1] || (a[1] = (l) => h.value = l),
                rows: "3",
                disabled: i.value || !!p.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", xe, [
              a[9] || (a[9] = W("Item key prefix", -1)),
              k(e(H), {
                id: "board-prefix",
                modelValue: $.value,
                "onUpdate:modelValue": a[2] || (a[2] = (l) => $.value = l),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: i.value || !!p.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("p", Ce, " Keys look like " + n($.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), v(K, { key: 1 }, [
            g.value ? (d(), v("p", Ve, "Loading packs…")) : w("", !0),
            _.value ? (d(), v("p", Be, n(_.value), 1)) : w("", !0),
            k(e(be), {
              modelValue: o.value,
              "onUpdate:modelValue": a[3] || (a[3] = (l) => o.value = l),
              class: "work-pack-choices",
              options: s.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: i.value || !!p.value,
              "aria-label": "Board pack"
            }, {
              option: A(({ option: l }) => [
                t("span", Se, [
                  t("span", Ue, [
                    k(e(D), {
                      icon: l.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    t("strong", null, n(l.title), 1),
                    l.version ? (d(), v("span", Le, n(l.version), 1)) : w("", !0)
                  ]),
                  t("span", qe, n(l.description), 1),
                  l.disabled ? (d(), v("span", Ae, n(l.unavailable), 1)) : w("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            o.value ? (d(), v("label", Te, [
              k(e(fe), {
                modelValue: b.value,
                "onUpdate:modelValue": a[4] || (a[4] = (l) => b.value = l),
                disabled: i.value || !!p.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              a[10] || (a[10] = W("Include starter items", -1))
            ])) : w("", !0),
            t("fieldset", {
              disabled: i.value || !!p.value,
              class: "work-settings-fieldset"
            }, [
              (d(!0), v(K, null, ae(R.value, (l) => (d(), v("div", {
                key: l.plugin,
                class: "work-stack work-tight"
              }, [
                t("p", Ie, "Provide any initial configuration required by " + n(l.plugin) + ". Work validates it before creating the board.", 1),
                k(me, {
                  label: "Initial configuration for " + l.plugin,
                  shape: "object",
                  "model-value": x.value[l.plugin],
                  example: {},
                  "onUpdate:modelValue": (q) => q === void 0 ? delete x.value[l.plugin] : x.value[l.plugin] = q,
                  onValidity: (q) => z(l.plugin, q)
                }, null, 8, ["label", "model-value", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, De),
            t("div", Re, [
              t("strong", null, n(y.value), 1),
              h.value ? (d(), v("p", Ne, n(h.value), 1)) : w("", !0),
              t("span", Ee, n($.value) + "-1", 1),
              t("p", We, n(c.value?.title), 1)
            ])
          ], 64)),
          S.value ? (d(), v("p", je, n(S.value), 1)) : w("", !0),
          t("footer", ze, [
            k(e(I), {
              label: u.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: i.value || !!p.value,
              onClick: a[5] || (a[5] = (l) => u.value === 1 ? C("close") : u.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            k(e(I), {
              type: "submit",
              label: u.value === 1 ? "Continue" : p.value ? "Save description" : "Create board",
              loading: i.value,
              disabled: !Z.value || i.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Oe() {
  const L = r([]), V = r(!0), B = r(""), C = r(""), y = r(!1), h = j(() => L.value.filter((u) => `${u.title} ${u.description ?? ""} ${u.key_prefix ?? ""}`.toLocaleLowerCase().includes(C.value.trim().toLocaleLowerCase()))), $ = ke();
  async function o(u = !1) {
    const i = $();
    u && (V.value = !0, B.value = "");
    try {
      const g = await O.boards();
      if (!i()) return;
      L.value = g, y.value = !0, B.value = "";
    } catch (g) {
      i() && (B.value = G(g, "Could not load boards."));
    } finally {
      i() && (V.value = !1);
    }
  }
  const b = /* @__PURE__ */ new Map();
  return P(L, (u) => {
    for (const [i, g] of b) u.some((S) => S.board_id === i) || (g(), b.delete(i));
    for (const i of u) b.has(i.board_id) || b.set(i.board_id, ue(`component.${i.board_id}`, () => {
      o();
    }));
  }), re(o), se(() => {
    $();
    for (const u of b.values()) u();
  }), { boards: L, loading: V, error: B, search: C, visibleBoards: h, hasLoaded: y, load: o };
}
const Pe = { class: "work-railhead" }, Ze = ["aria-label"], Me = {
  key: 0,
  class: "work-muted work-small"
}, Fe = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ge = {
  key: 2,
  class: "kx-err work-alert-actions"
}, He = { role: "alert" }, Je = { class: "work-stack work-tight" }, Ye = { class: "work-row work-wrap" }, Qe = { class: "work-mono" }, Xe = { class: "work-muted work-small" }, ea = {
  key: 0,
  class: "work-muted work-small"
}, aa = {
  key: 3,
  class: "work-muted work-small"
}, la = {
  key: 0,
  class: "work-mobile-board-back"
}, ta = ["board-id"], sa = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, oa = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, ia = {
  key: 4,
  class: "kx-empty"
}, ra = /* @__PURE__ */ X({
  __name: "AdminApp",
  setup(L) {
    const V = r(!1), B = r(!1);
    async function C() {
      if (B.value) return !1;
      if (!V.value) return !0;
      B.value = !0;
      try {
        return await Q.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        B.value = !1;
      }
    }
    async function y(f) {
      if (o.value === f || !await C()) return;
      V.value = !1, o.value = f, await Y();
      const s = S.value?.querySelector(".work-mobile-board-back button");
      s?.getClientRects().length && s.focus();
    }
    async function h() {
      if (!await C()) return;
      const f = g.value?.querySelector('[aria-current="page"]');
      V.value = !1, o.value = "", await Y(), (f ?? g.value?.querySelector("input"))?.focus();
    }
    async function $() {
      await C() && Q.navigate("/system/settings");
    }
    const o = r(""), b = r(!1), u = r(!1), i = r(!0), g = r(), S = r(), { boards: _, loading: T, error: p, search: x, visibleBoards: U, hasLoaded: R, load: z } = Oe();
    P(_, (f) => {
      o.value && !f.some((s) => s.board_id === o.value && F(s.access)) && (o.value = "");
    });
    async function N() {
      i.value = !0, u.value = await ne("kickside-work-board-settings"), i.value = !1;
    }
    oe(N);
    async function E(f) {
      await z(), await y(f);
    }
    return (f, s) => (d(), v("main", {
      class: J(["work-admin-shell", { "work-board-selected": o.value }])
    }, [
      t("nav", {
        ref_key: "rail",
        ref: g,
        class: "work-rail",
        "aria-label": "Board settings navigation"
      }, [
        t("header", Pe, [
          t("h2", null, [
            s[5] || (s[5] = W("Boards ", -1)),
            e(R) ? (d(), v("span", {
              key: 0,
              class: "work-count work-mono",
              "aria-label": e(_).length + (e(_).length === 1 ? " board" : " boards")
            }, n(e(_).length), 9, Ze)) : w("", !0)
          ]),
          k(e(I), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: s[0] || (s[0] = (c) => b.value = !0)
          }, {
            default: A(() => [
              k(e(D), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        k(e(H), {
          modelValue: e(x),
          "onUpdate:modelValue": s[1] || (s[1] = (c) => ie(x) ? x.value = c : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        e(R) && e(x).trim() ? (d(), v("p", Me, n(e(U).length) + " of " + n(e(_).length) + " " + n(e(_).length === 1 ? "board" : "boards"), 1)) : w("", !0),
        e(T) ? (d(), v("p", Fe, "Loading boards…")) : e(p) ? (d(), v("div", Ge, [
          t("p", He, n(e(p)), 1),
          k(e(I), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: s[2] || (s[2] = (c) => e(z)(!0))
          }, {
            icon: A(() => [
              k(e(D), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : w("", !0),
        s[6] || (s[6] = t("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        k(e(I), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: $
        }, {
          icon: A(() => [
            k(e(D), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        s[7] || (s[7] = t("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), v(K, null, ae(e(U), (c) => (d(), ee(pe, {
          key: c.board_id,
          class: J(["work-rail-row", { "work-rail-active": o.value === c.board_id }]),
          "aria-label": "Settings for " + c.title,
          "aria-current": o.value === c.board_id ? "page" : void 0,
          disabled: !e(F)(c.access),
          onActivate: (Z) => y(c.board_id)
        }, {
          default: A(() => [
            t("span", Je, [
              t("strong", null, n(c.title || "Untitled board"), 1),
              t("span", Ye, [
                t("code", Qe, n(c.key_prefix || "Board"), 1)
              ]),
              t("span", Xe, n(c.item_count ?? 0) + " " + n(c.item_count === 1 ? "item" : "items") + " · " + n(c.open_count ?? 0) + " open", 1),
              e(F)(c.access) ? w("", !0) : (d(), v("span", ea, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        e(R) && !e(T) && !e(p) && !e(U).length ? (d(), v("p", aa, n(e(_).length ? "No boards match this search." : "No readable boards."), 1)) : w("", !0)
      ], 512),
      t("section", {
        ref_key: "detail",
        ref: S,
        class: "work-admin-main",
        "aria-label": "Board settings detail"
      }, [
        o.value ? (d(), v("div", la, [
          k(e(I), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: h
          }, {
            icon: A(() => [
              k(e(D), {
                icon: "tabler:arrow-left",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : w("", !0),
        o.value && u.value ? (d(), v("kickside-work-board-settings", {
          key: o.value,
          "board-id": o.value,
          embedded: "true",
          onDirtyChange: s[3] || (s[3] = (c) => V.value = c.detail.dirty)
        }, null, 40, ta)) : o.value && i.value ? (d(), v("p", sa, "Loading board settings…")) : o.value ? (d(), v("p", oa, [
          s[8] || (s[8] = W("Board settings are unavailable.", -1)),
          k(e(I), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: N
          }, {
            icon: A(() => [
              k(e(D), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : e(R) && e(_).length ? (d(), v("div", ia, [
          k(e(D), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          s[9] || (s[9] = t("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          s[10] || (s[10] = t("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ])) : w("", !0)
      ], 512),
      k(Ke, {
        visible: b.value,
        onClose: s[4] || (s[4] = (c) => b.value = !1),
        onCreated: E
      }, null, 8, ["visible"])
    ], 2));
  }
}), na = de(ra, { type: "object", properties: {} });
ce(import.meta.url, na);
//# sourceMappingURL=admin.js.map
