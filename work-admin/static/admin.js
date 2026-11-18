import { defineComponent as J, ref as n, computed as N, watch as z, openBlock as d, createBlock as Y, withCtx as q, createElementVNode as l, withModifiers as ee, toDisplayString as i, createElementBlock as m, Fragment as K, createTextVNode as D, createVNode as p, unref as s, createCommentVNode as g, renderList as Q, onUnmounted as ae, onMounted as le, isRef as te, normalizeClass as se } from "vue";
import { u as oe, e as ie, a as re } from "./mount-DgmSMmP5.js";
import "pinia";
import { on as ne, host as H, define as de } from "@wippy-fe/proxy";
import T from "primevue/button";
import { a as P, w as O, _ as ue, b as ce, l as ve, c as Z, d as me } from "./latestRequest-C9n6N5u0.js";
import M from "primevue/inputtext";
import { Icon as R } from "@iconify/vue";
import pe from "primevue/selectbutton";
import ke from "primevue/toggleswitch";
import be from "primevue/textarea";
const fe = { class: "work-stack work-tight" }, we = { class: "work-muted work-small" }, ye = { class: "work-muted work-small" }, ge = { class: "work-stack work-tight" }, _e = { class: "work-stack work-tight" }, he = { class: "work-stack work-tight" }, $e = { class: "work-muted work-small" }, Ve = {
  key: 0,
  class: "work-muted",
  role: "status"
}, xe = {
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
}, We = { class: "work-dialog-actions" }, je = /* @__PURE__ */ J({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(I, { emit: h }) {
    const x = I, _ = h, f = n(""), y = n(""), u = n("WORK"), k = n(""), w = n(!1), o = n(1), t = n(!1), S = n(!1), $ = n(""), C = n(""), L = n([]), b = n(""), V = n({}), A = n(/* @__PURE__ */ new Set()), B = N(() => {
      const c = L.value.find((e) => e.id === k.value);
      return c && P(c) ? c.plugins : [];
    });
    z(k, () => {
      V.value = {}, A.value.clear();
    });
    function r(c, e) {
      e ? A.value.delete(c) : A.value.add(c);
    }
    let v = crypto.randomUUID(), E = "", W = 0;
    const F = N(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...L.value.map((c) => ({ ...c, title: c.title ?? c.id, icon: c.icon ?? "tabler:package-off", disabled: !P(c) || c.plugins.some((e) => !e.installed), unavailable: P(c) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : c.problem.message }))]), j = N(() => F.value.find((c) => c.id === k.value)), G = N(() => !!f.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(u.value) && !!j.value && !j.value.disabled && !A.value.size);
    z(() => x.visible, async (c) => {
      const e = ++W;
      if (c) {
        b.value = "", V.value = {}, A.value.clear(), o.value = 1, $.value = "", C.value = "", f.value = "", y.value = "", u.value = "WORK", k.value = "", w.value = !1, v = crypto.randomUUID(), E = "", L.value = [], S.value = !0;
        try {
          const a = await O.packs();
          e === W && (L.value = a);
        } catch (a) {
          e === W && (C.value = a instanceof Error ? a.message : "Could not load packs.");
        } finally {
          e === W && (S.value = !1);
        }
      }
    }, { immediate: !0 });
    async function X() {
      if (!G.value || t.value) return;
      if (o.value === 1) {
        o.value = 2;
        return;
      }
      t.value = !0, $.value = "";
      const c = k.value ? { pack: k.value, version: j.value?.version, starter: w.value, ...Object.keys(V.value).length ? { plugin_configs: V.value } : {} } : {}, e = { key_prefix: u.value }, a = JSON.stringify([f.value.trim(), y.value, e, c]);
      E && E !== a && (v = crypto.randomUUID()), E = a;
      try {
        if (!b.value) {
          const U = await O.createBoard(f.value.trim(), e, v, c);
          b.value = U.board_id;
        }
        y.value && await O.updateBoard(b.value, { description: y.value }), _("created", b.value), _("close");
      } catch (U) {
        $.value = (b.value ? "Board created. Description was not saved. " : "") + (U instanceof Error ? U.message : "Could not save the board.");
      } finally {
        t.value = !1;
      }
    }
    return (c, e) => (d(), Y(ue, {
      visible: I.visible,
      label: "New board",
      busy: t.value,
      onClose: e[6] || (e[6] = (a) => _("close"))
    }, {
      default: q(() => [
        l("form", {
          class: "work-dialog-box",
          onSubmit: ee(X, ["prevent"])
        }, [
          l("header", fe, [
            l("span", we, "Step " + i(o.value) + " of 2", 1),
            l("h2", null, i(o.value === 1 ? "Name your board" : "Choose a pack"), 1),
            l("p", ye, i(o.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          o.value === 1 ? (d(), m(K, { key: 0 }, [
            l("label", ge, [
              e[7] || (e[7] = D("Title", -1)),
              p(s(M), {
                id: "board-title",
                modelValue: f.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => f.value = a),
                autofocus: "",
                required: "",
                disabled: t.value || !!b.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", _e, [
              e[8] || (e[8] = D("Description", -1)),
              p(s(be), {
                id: "board-description",
                modelValue: y.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => y.value = a),
                rows: "3",
                disabled: t.value || !!b.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", he, [
              e[9] || (e[9] = D("Item key prefix", -1)),
              p(s(M), {
                id: "board-prefix",
                modelValue: u.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => u.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: t.value || !!b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("p", $e, " Keys look like " + i(u.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), m(K, { key: 1 }, [
            S.value ? (d(), m("p", Ve, "Loading packs…")) : g("", !0),
            C.value ? (d(), m("p", xe, i(C.value), 1)) : g("", !0),
            p(s(pe), {
              modelValue: k.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => k.value = a),
              class: "work-pack-choices",
              options: F.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: t.value || !!b.value,
              "aria-label": "Board pack"
            }, {
              option: q(({ option: a }) => [
                l("span", Ce, [
                  l("span", Be, [
                    p(s(R), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    l("strong", null, i(a.title), 1),
                    a.version ? (d(), m("span", Ue, i(a.version), 1)) : g("", !0)
                  ]),
                  l("span", Se, i(a.description), 1),
                  a.disabled ? (d(), m("span", Le, i(a.unavailable), 1)) : g("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            k.value ? (d(), m("label", Ae, [
              p(s(ke), {
                modelValue: w.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => w.value = a),
                disabled: t.value || !!b.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = D("Include starter items", -1))
            ])) : g("", !0),
            l("fieldset", {
              disabled: t.value || !!b.value,
              class: "work-settings-fieldset"
            }, [
              (d(!0), m(K, null, Q(B.value, (a) => (d(), m("div", {
                key: a.plugin,
                class: "work-stack work-tight"
              }, [
                l("p", De, "Provide any initial configuration required by " + i(a.plugin) + ". Work validates it before creating the board.", 1),
                p(ce, {
                  label: "Initial configuration for " + a.plugin,
                  shape: "object",
                  "model-value": V.value[a.plugin],
                  example: {},
                  "onUpdate:modelValue": (U) => U === void 0 ? delete V.value[a.plugin] : V.value[a.plugin] = U,
                  onValidity: (U) => r(a.plugin, U)
                }, null, 8, ["label", "model-value", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, qe),
            l("div", Ie, [
              l("strong", null, i(f.value), 1),
              y.value ? (d(), m("p", Ee, i(y.value), 1)) : g("", !0),
              l("span", Ne, i(u.value) + "-1", 1),
              l("p", Re, i(j.value?.title), 1)
            ])
          ], 64)),
          $.value ? (d(), m("p", Te, i($.value), 1)) : g("", !0),
          l("footer", We, [
            p(s(T), {
              label: o.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: t.value || !!b.value,
              onClick: e[5] || (e[5] = (a) => o.value === 1 ? _("close") : o.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            p(s(T), {
              type: "submit",
              label: o.value === 1 ? "Continue" : b.value ? "Save description" : "Create board",
              loading: t.value,
              disabled: !G.value || t.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Ke(I = !0) {
  const h = n([]), x = n(!0), _ = n(""), f = n(""), y = N(() => h.value.filter((o) => `${o.title} ${o.description ?? ""} ${o.key_prefix ?? ""}`.toLocaleLowerCase().includes(f.value.trim().toLocaleLowerCase()))), u = ve();
  async function k() {
    const o = u();
    I && (x.value = !0, _.value = "");
    try {
      const t = await O.boards();
      o() && (h.value = t);
    } catch (t) {
      o() && (_.value = t instanceof Error ? t.message : "Could not load boards.");
    } finally {
      o() && (x.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return z(h, (o) => {
    for (const [t, S] of w) o.some(($) => $.board_id === t) || (S(), w.delete(t));
    for (const t of o) w.has(t.board_id) || w.set(t.board_id, ne(`component.${t.board_id}`, () => {
      k();
    }));
  }), oe(k), ae(() => {
    u();
    for (const o of w.values()) o();
  }), { boards: h, loading: x, error: _, search: f, visibleBoards: y, load: k };
}
const Oe = { class: "work-admin-shell" }, ze = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Pe = { class: "work-railhead" }, Ze = ["aria-label"], Me = {
  key: 0,
  class: "work-muted work-small"
}, Fe = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Ge = {
  key: 2,
  class: "kx-loading"
}, He = { class: "work-stack work-tight" }, Je = { class: "work-row work-wrap" }, Ye = { class: "work-mono" }, Qe = { class: "work-muted work-small" }, Xe = {
  key: 0,
  class: "work-muted work-small"
}, ea = {
  key: 3,
  class: "work-muted work-small"
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
}, ia = /* @__PURE__ */ J({
  __name: "AdminApp",
  setup(I) {
    const h = n(!1), x = n(!1);
    async function _() {
      if (x.value) return !1;
      if (!h.value) return !0;
      x.value = !0;
      try {
        return await H.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        x.value = !1;
      }
    }
    async function f(B) {
      u.value === B || !await _() || (h.value = !1, u.value = B);
    }
    async function y() {
      await _() && H.navigate("/system/settings");
    }
    const u = n(""), k = n(!1), w = n(!1), o = n(!0), { boards: t, loading: S, error: $, search: C, visibleBoards: L, load: b } = Ke(!1);
    z(t, (B) => {
      u.value && !B.some((r) => r.board_id === u.value && Z(r.access)) && (u.value = "");
    });
    async function V() {
      o.value = !0, w.value = await ie("kickside-work-board-settings"), o.value = !1;
    }
    le(V);
    async function A(B) {
      await b(), await f(B);
    }
    return (B, r) => (d(), m("main", Oe, [
      l("nav", ze, [
        l("header", Pe, [
          l("h2", null, [
            r[4] || (r[4] = D("Boards ", -1)),
            l("span", {
              class: "work-count work-mono",
              "aria-label": s(t).length + (s(t).length === 1 ? " board" : " boards")
            }, i(s(t).length), 9, Ze)
          ]),
          p(s(T), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: r[0] || (r[0] = (v) => k.value = !0)
          }, {
            default: q(() => [
              p(s(R), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        p(s(M), {
          modelValue: s(C),
          "onUpdate:modelValue": r[1] || (r[1] = (v) => te(C) ? C.value = v : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        s(C).trim() ? (d(), m("p", Me, i(s(L).length) + " of " + i(s(t).length) + " " + i(s(t).length === 1 ? "board" : "boards"), 1)) : g("", !0),
        s($) ? (d(), m("p", Fe, i(s($)), 1)) : g("", !0),
        s(S) ? (d(), m("p", Ge, "Loading boards…")) : g("", !0),
        r[5] || (r[5] = l("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        p(s(T), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: y
        }, {
          icon: q(() => [
            p(s(R), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        r[6] || (r[6] = l("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), m(K, null, Q(s(L), (v) => (d(), Y(me, {
          key: v.board_id,
          class: se(["work-rail-row", { "work-rail-active": u.value === v.board_id }]),
          "aria-label": "Settings for " + v.title,
          "aria-current": u.value === v.board_id ? "page" : void 0,
          disabled: !s(Z)(v.access),
          onActivate: (E) => f(v.board_id)
        }, {
          default: q(() => [
            l("span", He, [
              l("strong", null, i(v.title || "Untitled board"), 1),
              l("span", Je, [
                l("code", Ye, i(v.key_prefix || "Board"), 1)
              ]),
              l("span", Qe, i(v.item_count ?? 0) + " " + i(v.item_count === 1 ? "item" : "items") + " · " + i(v.open_count ?? 0) + " open", 1),
              s(Z)(v.access) ? g("", !0) : (d(), m("span", Xe, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !s(S) && !s(L).length ? (d(), m("p", ea, i(s(t).length ? "No boards match this search." : "No readable boards."), 1)) : g("", !0)
      ]),
      l("section", aa, [
        u.value && w.value ? (d(), m("kickside-work-board-settings", {
          key: u.value,
          "board-id": u.value,
          embedded: "true",
          onDirtyChange: r[2] || (r[2] = (v) => h.value = v.detail.dirty)
        }, null, 40, la)) : u.value && o.value ? (d(), m("p", ta, "Loading board settings…")) : u.value ? (d(), m("p", sa, [
          r[7] || (r[7] = D("Board settings are unavailable.", -1)),
          p(s(T), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: V
          }, {
            icon: q(() => [
              p(s(R), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (d(), m("div", oa, [
          p(s(R), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          r[8] || (r[8] = l("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          r[9] || (r[9] = l("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ]),
      p(je, {
        visible: k.value,
        onClose: r[3] || (r[3] = (v) => k.value = !1),
        onCreated: A
      }, null, 8, ["visible"])
    ]));
  }
}), ra = re(ia, { type: "object", properties: {} });
de(import.meta.url, ra);
//# sourceMappingURL=admin.js.map
