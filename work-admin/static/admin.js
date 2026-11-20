import { defineComponent as Q, ref as d, computed as W, watch as O, openBlock as u, createBlock as X, withCtx as A, createElementVNode as t, withModifiers as le, toDisplayString as n, createElementBlock as v, Fragment as z, createTextVNode as D, createVNode as k, unref as l, createCommentVNode as y, renderList as ee, onUnmounted as te, onMounted as se, normalizeClass as H, isRef as oe, nextTick as J } from "vue";
import { u as ie, e as re, a as ne } from "./mount-3Ymcko7U.js";
import "pinia";
import { on as de, host as Y, define as ue } from "@wippy-fe/proxy";
import I from "primevue/button";
import { a as Z, w as K, _ as ce, b as ve, l as me, c as M, d as ke } from "./latestRequest-C7gISMH8.js";
import F from "primevue/inputtext";
import { Icon as T } from "@iconify/vue";
import pe from "primevue/selectbutton";
import be from "primevue/toggleswitch";
import fe from "primevue/textarea";
const we = { class: "work-stack work-tight" }, ye = { class: "work-muted work-small" }, ge = { class: "work-muted work-small" }, _e = { class: "work-stack work-tight" }, he = { class: "work-stack work-tight" }, xe = { class: "work-stack work-tight" }, $e = { class: "work-muted work-small" }, Ve = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ce = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Be = { class: "work-pack-choice" }, Se = { class: "work-row" }, Ue = {
  key: 0,
  class: "work-muted work-small"
}, qe = { class: "work-muted work-small" }, Le = {
  key: 0,
  class: "work-pack-unavailable"
}, Ae = {
  key: 2,
  class: "work-row work-small"
}, Te = ["disabled"], De = { class: "work-muted work-small" }, Ie = { class: "work-settings-card work-stack work-tight" }, Ee = {
  key: 0,
  class: "work-muted work-small"
}, Ne = { class: "work-mono work-muted" }, Re = { class: "work-muted work-small" }, We = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, je = { class: "work-dialog-actions" }, ze = /* @__PURE__ */ Q({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(E, { emit: V }) {
    const B = E, g = V, w = d(""), _ = d(""), h = d("WORK"), o = d(""), b = d(!1), r = d(1), i = d(!1), S = d(!1), C = d(""), x = d(""), L = d([]), p = d(""), $ = d({}), U = d(/* @__PURE__ */ new Set()), P = W(() => {
      const c = L.value.find((e) => e.id === o.value);
      return c && Z(c) ? c.plugins : [];
    });
    O(o, () => {
      $.value = {}, U.value.clear();
    });
    function j(c, e) {
      e ? U.value.delete(c) : U.value.add(c);
    }
    let N = crypto.randomUUID(), f = "", s = 0;
    const m = W(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...L.value.map((c) => ({ ...c, title: c.title ?? c.id, icon: c.icon ?? "tabler:package-off", disabled: !Z(c) || c.plugins.some((e) => !e.installed), unavailable: Z(c) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : c.problem.message }))]), R = W(() => m.value.find((c) => c.id === o.value)), G = W(() => !!w.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(h.value) && !!R.value && !R.value.disabled && !U.value.size);
    O(() => B.visible, async (c) => {
      const e = ++s;
      if (c) {
        p.value = "", $.value = {}, U.value.clear(), r.value = 1, C.value = "", x.value = "", w.value = "", _.value = "", h.value = "WORK", o.value = "", b.value = !1, N = crypto.randomUUID(), f = "", L.value = [], S.value = !0;
        try {
          const a = await K.packs();
          e === s && (L.value = a);
        } catch (a) {
          e === s && (x.value = a instanceof Error ? a.message : "Could not load packs.");
        } finally {
          e === s && (S.value = !1);
        }
      }
    }, { immediate: !0 });
    async function ae() {
      if (!G.value || i.value) return;
      if (r.value === 1) {
        r.value = 2;
        return;
      }
      i.value = !0, C.value = "";
      const c = o.value ? { pack: o.value, version: R.value?.version, starter: b.value, ...Object.keys($.value).length ? { plugin_configs: $.value } : {} } : {}, e = { key_prefix: h.value }, a = JSON.stringify([w.value.trim(), _.value, e, c]);
      f && f !== a && (N = crypto.randomUUID()), f = a;
      try {
        if (!p.value) {
          const q = await K.createBoard(w.value.trim(), e, N, c);
          p.value = q.board_id;
        }
        _.value && await K.updateBoard(p.value, { description: _.value }), g("created", p.value), g("close");
      } catch (q) {
        C.value = (p.value ? "Board created. Description was not saved. " : "") + (q instanceof Error ? q.message : "Could not save the board.");
      } finally {
        i.value = !1;
      }
    }
    return (c, e) => (u(), X(ce, {
      visible: E.visible,
      label: "New board",
      busy: i.value,
      onClose: e[6] || (e[6] = (a) => g("close"))
    }, {
      default: A(() => [
        t("form", {
          class: "work-dialog-box",
          onSubmit: le(ae, ["prevent"])
        }, [
          t("header", we, [
            t("span", ye, "Step " + n(r.value) + " of 2", 1),
            t("h2", null, n(r.value === 1 ? "Name your board" : "Choose a pack"), 1),
            t("p", ge, n(r.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          r.value === 1 ? (u(), v(z, { key: 0 }, [
            t("label", _e, [
              e[7] || (e[7] = D("Title", -1)),
              k(l(F), {
                id: "board-title",
                modelValue: w.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => w.value = a),
                autofocus: "",
                required: "",
                disabled: i.value || !!p.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", he, [
              e[8] || (e[8] = D("Description", -1)),
              k(l(fe), {
                id: "board-description",
                modelValue: _.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => _.value = a),
                rows: "3",
                disabled: i.value || !!p.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", xe, [
              e[9] || (e[9] = D("Item key prefix", -1)),
              k(l(F), {
                id: "board-prefix",
                modelValue: h.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => h.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: i.value || !!p.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("p", $e, " Keys look like " + n(h.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (u(), v(z, { key: 1 }, [
            S.value ? (u(), v("p", Ve, "Loading packs…")) : y("", !0),
            x.value ? (u(), v("p", Ce, n(x.value), 1)) : y("", !0),
            k(l(pe), {
              modelValue: o.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => o.value = a),
              class: "work-pack-choices",
              options: m.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: i.value || !!p.value,
              "aria-label": "Board pack"
            }, {
              option: A(({ option: a }) => [
                t("span", Be, [
                  t("span", Se, [
                    k(l(T), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    t("strong", null, n(a.title), 1),
                    a.version ? (u(), v("span", Ue, n(a.version), 1)) : y("", !0)
                  ]),
                  t("span", qe, n(a.description), 1),
                  a.disabled ? (u(), v("span", Le, n(a.unavailable), 1)) : y("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            o.value ? (u(), v("label", Ae, [
              k(l(be), {
                modelValue: b.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => b.value = a),
                disabled: i.value || !!p.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = D("Include starter items", -1))
            ])) : y("", !0),
            t("fieldset", {
              disabled: i.value || !!p.value,
              class: "work-settings-fieldset"
            }, [
              (u(!0), v(z, null, ee(P.value, (a) => (u(), v("div", {
                key: a.plugin,
                class: "work-stack work-tight"
              }, [
                t("p", De, "Provide any initial configuration required by " + n(a.plugin) + ". Work validates it before creating the board.", 1),
                k(ve, {
                  label: "Initial configuration for " + a.plugin,
                  shape: "object",
                  "model-value": $.value[a.plugin],
                  example: {},
                  "onUpdate:modelValue": (q) => q === void 0 ? delete $.value[a.plugin] : $.value[a.plugin] = q,
                  onValidity: (q) => j(a.plugin, q)
                }, null, 8, ["label", "model-value", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Te),
            t("div", Ie, [
              t("strong", null, n(w.value), 1),
              _.value ? (u(), v("p", Ee, n(_.value), 1)) : y("", !0),
              t("span", Ne, n(h.value) + "-1", 1),
              t("p", Re, n(R.value?.title), 1)
            ])
          ], 64)),
          C.value ? (u(), v("p", We, n(C.value), 1)) : y("", !0),
          t("footer", je, [
            k(l(I), {
              label: r.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: i.value || !!p.value,
              onClick: e[5] || (e[5] = (a) => r.value === 1 ? g("close") : r.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            k(l(I), {
              type: "submit",
              label: r.value === 1 ? "Continue" : p.value ? "Save description" : "Create board",
              loading: i.value,
              disabled: !G.value || i.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Ke(E = !0) {
  const V = d([]), B = d(!0), g = d(""), w = d(""), _ = W(() => V.value.filter((r) => `${r.title} ${r.description ?? ""} ${r.key_prefix ?? ""}`.toLocaleLowerCase().includes(w.value.trim().toLocaleLowerCase()))), h = me();
  async function o() {
    const r = h();
    E && (B.value = !0, g.value = "");
    try {
      const i = await K.boards();
      r() && (V.value = i);
    } catch (i) {
      r() && (g.value = i instanceof Error ? i.message : "Could not load boards.");
    } finally {
      r() && (B.value = !1);
    }
  }
  const b = /* @__PURE__ */ new Map();
  return O(V, (r) => {
    for (const [i, S] of b) r.some((C) => C.board_id === i) || (S(), b.delete(i));
    for (const i of r) b.has(i.board_id) || b.set(i.board_id, de(`component.${i.board_id}`, () => {
      o();
    }));
  }), ie(o), te(() => {
    h();
    for (const r of b.values()) r();
  }), { boards: V, loading: B, error: g, search: w, visibleBoards: _, load: o };
}
const Oe = { class: "work-railhead" }, Pe = ["aria-label"], Ze = {
  key: 0,
  class: "work-muted work-small"
}, Me = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Fe = {
  key: 2,
  class: "kx-loading"
}, Ge = { class: "work-stack work-tight" }, He = { class: "work-row work-wrap" }, Je = { class: "work-mono" }, Ye = { class: "work-muted work-small" }, Qe = {
  key: 0,
  class: "work-muted work-small"
}, Xe = {
  key: 3,
  class: "work-muted work-small"
}, ea = {
  key: 0,
  class: "work-mobile-board-back"
}, aa = ["board-id"], la = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ta = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, sa = {
  key: 4,
  class: "kx-empty"
}, oa = /* @__PURE__ */ Q({
  __name: "AdminApp",
  setup(E) {
    const V = d(!1), B = d(!1);
    async function g() {
      if (B.value) return !1;
      if (!V.value) return !0;
      B.value = !0;
      try {
        return await Y.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        B.value = !1;
      }
    }
    async function w(f) {
      if (o.value === f || !await g()) return;
      V.value = !1, o.value = f, await J();
      const s = C.value?.querySelector(".work-mobile-board-back button");
      s?.getClientRects().length && s.focus();
    }
    async function _() {
      if (!await g()) return;
      const f = S.value?.querySelector('[aria-current="page"]');
      V.value = !1, o.value = "", await J(), (f ?? S.value?.querySelector("input"))?.focus();
    }
    async function h() {
      await g() && Y.navigate("/system/settings");
    }
    const o = d(""), b = d(!1), r = d(!1), i = d(!0), S = d(), C = d(), { boards: x, loading: L, error: p, search: $, visibleBoards: U, load: P } = Ke(!1);
    O(x, (f) => {
      o.value && !f.some((s) => s.board_id === o.value && M(s.access)) && (o.value = "");
    });
    async function j() {
      i.value = !0, r.value = await re("kickside-work-board-settings"), i.value = !1;
    }
    se(j);
    async function N(f) {
      await P(), await w(f);
    }
    return (f, s) => (u(), v("main", {
      class: H(["work-admin-shell", { "work-board-selected": o.value }])
    }, [
      t("nav", {
        ref_key: "rail",
        ref: S,
        class: "work-rail",
        "aria-label": "Board settings navigation"
      }, [
        t("header", Oe, [
          t("h2", null, [
            s[4] || (s[4] = D("Boards ", -1)),
            t("span", {
              class: "work-count work-mono",
              "aria-label": l(x).length + (l(x).length === 1 ? " board" : " boards")
            }, n(l(x).length), 9, Pe)
          ]),
          k(l(I), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: s[0] || (s[0] = (m) => b.value = !0)
          }, {
            default: A(() => [
              k(l(T), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        k(l(F), {
          modelValue: l($),
          "onUpdate:modelValue": s[1] || (s[1] = (m) => oe($) ? $.value = m : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        l($).trim() ? (u(), v("p", Ze, n(l(U).length) + " of " + n(l(x).length) + " " + n(l(x).length === 1 ? "board" : "boards"), 1)) : y("", !0),
        l(p) ? (u(), v("p", Me, n(l(p)), 1)) : y("", !0),
        l(L) ? (u(), v("p", Fe, "Loading boards…")) : y("", !0),
        s[5] || (s[5] = t("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        k(l(I), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: h
        }, {
          icon: A(() => [
            k(l(T), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        s[6] || (s[6] = t("div", { class: "work-rail-group" }, "Workspace", -1)),
        (u(!0), v(z, null, ee(l(U), (m) => (u(), X(ke, {
          key: m.board_id,
          class: H(["work-rail-row", { "work-rail-active": o.value === m.board_id }]),
          "aria-label": "Settings for " + m.title,
          "aria-current": o.value === m.board_id ? "page" : void 0,
          disabled: !l(M)(m.access),
          onActivate: (R) => w(m.board_id)
        }, {
          default: A(() => [
            t("span", Ge, [
              t("strong", null, n(m.title || "Untitled board"), 1),
              t("span", He, [
                t("code", Je, n(m.key_prefix || "Board"), 1)
              ]),
              t("span", Ye, n(m.item_count ?? 0) + " " + n(m.item_count === 1 ? "item" : "items") + " · " + n(m.open_count ?? 0) + " open", 1),
              l(M)(m.access) ? y("", !0) : (u(), v("span", Qe, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !l(L) && !l(U).length ? (u(), v("p", Xe, n(l(x).length ? "No boards match this search." : "No readable boards."), 1)) : y("", !0)
      ], 512),
      t("section", {
        ref_key: "detail",
        ref: C,
        class: "work-admin-main",
        "aria-label": "Board settings detail"
      }, [
        o.value ? (u(), v("div", ea, [
          k(l(I), {
            label: "Back to boards",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: _
          }, {
            icon: A(() => [
              k(l(T), {
                icon: "tabler:arrow-left",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : y("", !0),
        o.value && r.value ? (u(), v("kickside-work-board-settings", {
          key: o.value,
          "board-id": o.value,
          embedded: "true",
          onDirtyChange: s[2] || (s[2] = (m) => V.value = m.detail.dirty)
        }, null, 40, aa)) : o.value && i.value ? (u(), v("p", la, "Loading board settings…")) : o.value ? (u(), v("p", ta, [
          s[7] || (s[7] = D("Board settings are unavailable.", -1)),
          k(l(I), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: j
          }, {
            icon: A(() => [
              k(l(T), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (u(), v("div", sa, [
          k(l(T), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          s[8] || (s[8] = t("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          s[9] || (s[9] = t("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ], 512),
      k(ze, {
        visible: b.value,
        onClose: s[3] || (s[3] = (m) => b.value = !1),
        onCreated: N
      }, null, 8, ["visible"])
    ], 2));
  }
}), ia = ne(oa, { type: "object", properties: {} });
ue(import.meta.url, ia);
//# sourceMappingURL=admin.js.map
