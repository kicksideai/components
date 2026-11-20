import { defineComponent as Y, ref as u, computed as T, watch as O, openBlock as d, createBlock as Q, withCtx as q, createElementVNode as t, withModifiers as ae, toDisplayString as r, createElementBlock as m, Fragment as z, createTextVNode as I, createVNode as k, unref as l, createCommentVNode as y, renderList as X, onUnmounted as le, onMounted as te, normalizeClass as H, isRef as se } from "vue";
import { u as oe, e as ie, a as re } from "./mount-BjCFO9rr.js";
import "pinia";
import { on as ne, host as J, define as de } from "@wippy-fe/proxy";
import E from "primevue/button";
import { a as P, w as K, _ as ue, b as ce, l as ve, c as Z, d as me } from "./latestRequest-C7gISMH8.js";
import M from "primevue/inputtext";
import { Icon as D } from "@iconify/vue";
import ke from "primevue/selectbutton";
import pe from "primevue/toggleswitch";
import be from "primevue/textarea";
const fe = { class: "work-stack work-tight" }, we = { class: "work-muted work-small" }, ye = { class: "work-muted work-small" }, ge = { class: "work-stack work-tight" }, _e = { class: "work-stack work-tight" }, he = { class: "work-stack work-tight" }, $e = { class: "work-muted work-small" }, xe = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ve = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ce = { class: "work-pack-choice" }, Be = { class: "work-row" }, Ue = {
  key: 0,
  class: "work-muted work-small"
}, Se = { class: "work-muted work-small" }, Le = {
  key: 0,
  class: "work-pack-unavailable"
}, Ae = {
  key: 2,
  class: "work-row work-small"
}, qe = ["disabled"], De = { class: "work-muted work-small" }, Ie = { class: "work-settings-card work-stack work-tight" }, Ee = {
  key: 0,
  class: "work-muted work-small"
}, Ne = { class: "work-mono work-muted" }, Re = { class: "work-muted work-small" }, Te = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, We = { class: "work-dialog-actions" }, je = /* @__PURE__ */ Y({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(N, { emit: h }) {
    const V = N, _ = h, f = u(""), g = u(""), n = u("WORK"), p = u(""), w = u(!1), o = u(1), s = u(!1), S = u(!1), $ = u(""), C = u(""), L = u([]), b = u(""), x = u({}), A = u(/* @__PURE__ */ new Set()), B = T(() => {
      const v = L.value.find((e) => e.id === p.value);
      return v && P(v) ? v.plugins : [];
    });
    O(p, () => {
      x.value = {}, A.value.clear();
    });
    function i(v, e) {
      e ? A.value.delete(v) : A.value.add(v);
    }
    let c = crypto.randomUUID(), R = "", W = 0;
    const F = T(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...L.value.map((v) => ({ ...v, title: v.title ?? v.id, icon: v.icon ?? "tabler:package-off", disabled: !P(v) || v.plugins.some((e) => !e.installed), unavailable: P(v) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : v.problem.message }))]), j = T(() => F.value.find((v) => v.id === p.value)), G = T(() => !!f.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(n.value) && !!j.value && !j.value.disabled && !A.value.size);
    O(() => V.visible, async (v) => {
      const e = ++W;
      if (v) {
        b.value = "", x.value = {}, A.value.clear(), o.value = 1, $.value = "", C.value = "", f.value = "", g.value = "", n.value = "WORK", p.value = "", w.value = !1, c = crypto.randomUUID(), R = "", L.value = [], S.value = !0;
        try {
          const a = await K.packs();
          e === W && (L.value = a);
        } catch (a) {
          e === W && (C.value = a instanceof Error ? a.message : "Could not load packs.");
        } finally {
          e === W && (S.value = !1);
        }
      }
    }, { immediate: !0 });
    async function ee() {
      if (!G.value || s.value) return;
      if (o.value === 1) {
        o.value = 2;
        return;
      }
      s.value = !0, $.value = "";
      const v = p.value ? { pack: p.value, version: j.value?.version, starter: w.value, ...Object.keys(x.value).length ? { plugin_configs: x.value } : {} } : {}, e = { key_prefix: n.value }, a = JSON.stringify([f.value.trim(), g.value, e, v]);
      R && R !== a && (c = crypto.randomUUID()), R = a;
      try {
        if (!b.value) {
          const U = await K.createBoard(f.value.trim(), e, c, v);
          b.value = U.board_id;
        }
        g.value && await K.updateBoard(b.value, { description: g.value }), _("created", b.value), _("close");
      } catch (U) {
        $.value = (b.value ? "Board created. Description was not saved. " : "") + (U instanceof Error ? U.message : "Could not save the board.");
      } finally {
        s.value = !1;
      }
    }
    return (v, e) => (d(), Q(ue, {
      visible: N.visible,
      label: "New board",
      busy: s.value,
      onClose: e[6] || (e[6] = (a) => _("close"))
    }, {
      default: q(() => [
        t("form", {
          class: "work-dialog-box",
          onSubmit: ae(ee, ["prevent"])
        }, [
          t("header", fe, [
            t("span", we, "Step " + r(o.value) + " of 2", 1),
            t("h2", null, r(o.value === 1 ? "Name your board" : "Choose a pack"), 1),
            t("p", ye, r(o.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          o.value === 1 ? (d(), m(z, { key: 0 }, [
            t("label", ge, [
              e[7] || (e[7] = I("Title", -1)),
              k(l(M), {
                id: "board-title",
                modelValue: f.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => f.value = a),
                autofocus: "",
                required: "",
                disabled: s.value || !!b.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", _e, [
              e[8] || (e[8] = I("Description", -1)),
              k(l(be), {
                id: "board-description",
                modelValue: g.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => g.value = a),
                rows: "3",
                disabled: s.value || !!b.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", he, [
              e[9] || (e[9] = I("Item key prefix", -1)),
              k(l(M), {
                id: "board-prefix",
                modelValue: n.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => n.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: s.value || !!b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("p", $e, " Keys look like " + r(n.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), m(z, { key: 1 }, [
            S.value ? (d(), m("p", xe, "Loading packs…")) : y("", !0),
            C.value ? (d(), m("p", Ve, r(C.value), 1)) : y("", !0),
            k(l(ke), {
              modelValue: p.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => p.value = a),
              class: "work-pack-choices",
              options: F.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: s.value || !!b.value,
              "aria-label": "Board pack"
            }, {
              option: q(({ option: a }) => [
                t("span", Ce, [
                  t("span", Be, [
                    k(l(D), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    t("strong", null, r(a.title), 1),
                    a.version ? (d(), m("span", Ue, r(a.version), 1)) : y("", !0)
                  ]),
                  t("span", Se, r(a.description), 1),
                  a.disabled ? (d(), m("span", Le, r(a.unavailable), 1)) : y("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            p.value ? (d(), m("label", Ae, [
              k(l(pe), {
                modelValue: w.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => w.value = a),
                disabled: s.value || !!b.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = I("Include starter items", -1))
            ])) : y("", !0),
            t("fieldset", {
              disabled: s.value || !!b.value,
              class: "work-settings-fieldset"
            }, [
              (d(!0), m(z, null, X(B.value, (a) => (d(), m("div", {
                key: a.plugin,
                class: "work-stack work-tight"
              }, [
                t("p", De, "Provide any initial configuration required by " + r(a.plugin) + ". Work validates it before creating the board.", 1),
                k(ce, {
                  label: "Initial configuration for " + a.plugin,
                  shape: "object",
                  "model-value": x.value[a.plugin],
                  example: {},
                  "onUpdate:modelValue": (U) => U === void 0 ? delete x.value[a.plugin] : x.value[a.plugin] = U,
                  onValidity: (U) => i(a.plugin, U)
                }, null, 8, ["label", "model-value", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, qe),
            t("div", Ie, [
              t("strong", null, r(f.value), 1),
              g.value ? (d(), m("p", Ee, r(g.value), 1)) : y("", !0),
              t("span", Ne, r(n.value) + "-1", 1),
              t("p", Re, r(j.value?.title), 1)
            ])
          ], 64)),
          $.value ? (d(), m("p", Te, r($.value), 1)) : y("", !0),
          t("footer", We, [
            k(l(E), {
              label: o.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: s.value || !!b.value,
              onClick: e[5] || (e[5] = (a) => o.value === 1 ? _("close") : o.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            k(l(E), {
              type: "submit",
              label: o.value === 1 ? "Continue" : b.value ? "Save description" : "Create board",
              loading: s.value,
              disabled: !G.value || s.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function ze(N = !0) {
  const h = u([]), V = u(!0), _ = u(""), f = u(""), g = T(() => h.value.filter((o) => `${o.title} ${o.description ?? ""} ${o.key_prefix ?? ""}`.toLocaleLowerCase().includes(f.value.trim().toLocaleLowerCase()))), n = ve();
  async function p() {
    const o = n();
    N && (V.value = !0, _.value = "");
    try {
      const s = await K.boards();
      o() && (h.value = s);
    } catch (s) {
      o() && (_.value = s instanceof Error ? s.message : "Could not load boards.");
    } finally {
      o() && (V.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return O(h, (o) => {
    for (const [s, S] of w) o.some(($) => $.board_id === s) || (S(), w.delete(s));
    for (const s of o) w.has(s.board_id) || w.set(s.board_id, ne(`component.${s.board_id}`, () => {
      p();
    }));
  }), oe(p), le(() => {
    n();
    for (const o of w.values()) o();
  }), { boards: h, loading: V, error: _, search: f, visibleBoards: g, load: p };
}
const Ke = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Oe = { class: "work-railhead" }, Pe = ["aria-label"], Ze = {
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
}, aa = {
  class: "work-admin-main",
  "aria-label": "Board settings detail"
}, la = ["board-id"], ta = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, sa = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, oa = {
  key: 3,
  class: "kx-empty"
}, ia = /* @__PURE__ */ Y({
  __name: "AdminApp",
  setup(N) {
    const h = u(!1), V = u(!1);
    async function _() {
      if (V.value) return !1;
      if (!h.value) return !0;
      V.value = !0;
      try {
        return await J.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        V.value = !1;
      }
    }
    async function f(B) {
      n.value === B || !await _() || (h.value = !1, n.value = B);
    }
    async function g() {
      await _() && J.navigate("/system/settings");
    }
    const n = u(""), p = u(!1), w = u(!1), o = u(!0), { boards: s, loading: S, error: $, search: C, visibleBoards: L, load: b } = ze(!1);
    O(s, (B) => {
      n.value && !B.some((i) => i.board_id === n.value && Z(i.access)) && (n.value = "");
    });
    async function x() {
      o.value = !0, w.value = await ie("kickside-work-board-settings"), o.value = !1;
    }
    te(x);
    async function A(B) {
      await b(), await f(B);
    }
    return (B, i) => (d(), m("main", {
      class: H(["work-admin-shell", { "work-board-selected": n.value }])
    }, [
      t("nav", Ke, [
        t("header", Oe, [
          t("h2", null, [
            i[5] || (i[5] = I("Boards ", -1)),
            t("span", {
              class: "work-count work-mono",
              "aria-label": l(s).length + (l(s).length === 1 ? " board" : " boards")
            }, r(l(s).length), 9, Pe)
          ]),
          k(l(E), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: i[0] || (i[0] = (c) => p.value = !0)
          }, {
            default: q(() => [
              k(l(D), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        k(l(M), {
          modelValue: l(C),
          "onUpdate:modelValue": i[1] || (i[1] = (c) => se(C) ? C.value = c : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        l(C).trim() ? (d(), m("p", Ze, r(l(L).length) + " of " + r(l(s).length) + " " + r(l(s).length === 1 ? "board" : "boards"), 1)) : y("", !0),
        l($) ? (d(), m("p", Me, r(l($)), 1)) : y("", !0),
        l(S) ? (d(), m("p", Fe, "Loading boards…")) : y("", !0),
        i[6] || (i[6] = t("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        k(l(E), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: g
        }, {
          icon: q(() => [
            k(l(D), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        i[7] || (i[7] = t("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), m(z, null, X(l(L), (c) => (d(), Q(me, {
          key: c.board_id,
          class: H(["work-rail-row", { "work-rail-active": n.value === c.board_id }]),
          "aria-label": "Settings for " + c.title,
          "aria-current": n.value === c.board_id ? "page" : void 0,
          disabled: !l(Z)(c.access),
          onActivate: (R) => f(c.board_id)
        }, {
          default: q(() => [
            t("span", Ge, [
              t("strong", null, r(c.title || "Untitled board"), 1),
              t("span", He, [
                t("code", Je, r(c.key_prefix || "Board"), 1)
              ]),
              t("span", Ye, r(c.item_count ?? 0) + " " + r(c.item_count === 1 ? "item" : "items") + " · " + r(c.open_count ?? 0) + " open", 1),
              l(Z)(c.access) ? y("", !0) : (d(), m("span", Qe, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !l(S) && !l(L).length ? (d(), m("p", Xe, r(l(s).length ? "No boards match this search." : "No readable boards."), 1)) : y("", !0)
      ]),
      n.value ? (d(), m("div", ea, [
        k(l(E), {
          label: "Back to boards",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: i[2] || (i[2] = (c) => f(""))
        }, {
          icon: q(() => [
            k(l(D), {
              icon: "tabler:arrow-left",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ])) : y("", !0),
      t("section", aa, [
        n.value && w.value ? (d(), m("kickside-work-board-settings", {
          key: n.value,
          "board-id": n.value,
          embedded: "true",
          onDirtyChange: i[3] || (i[3] = (c) => h.value = c.detail.dirty)
        }, null, 40, la)) : n.value && o.value ? (d(), m("p", ta, "Loading board settings…")) : n.value ? (d(), m("p", sa, [
          i[8] || (i[8] = I("Board settings are unavailable.", -1)),
          k(l(E), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: x
          }, {
            icon: q(() => [
              k(l(D), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (d(), m("div", oa, [
          k(l(D), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          i[9] || (i[9] = t("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          i[10] || (i[10] = t("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ]),
      k(je, {
        visible: p.value,
        onClose: i[4] || (i[4] = (c) => p.value = !1),
        onCreated: A
      }, null, 8, ["visible"])
    ], 2));
  }
}), ra = re(ia, { type: "object", properties: {} });
de(import.meta.url, ra);
//# sourceMappingURL=admin.js.map
