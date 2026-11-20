import { defineComponent as X, ref as u, computed as N, watch as M, openBlock as d, createBlock as ee, withCtx as q, createElementVNode as s, withModifiers as te, toDisplayString as n, createElementBlock as v, Fragment as j, createTextVNode as D, createVNode as p, unref as t, createCommentVNode as y, renderList as ae, onUnmounted as se, onMounted as oe, isRef as ie, normalizeClass as re } from "vue";
import { u as ne, e as de, a as ue } from "./mount-B0GaBFyy.js";
import "pinia";
import { on as ce, host as Y, define as ve } from "@wippy-fe/proxy";
import R from "primevue/button";
import { a as Z, c as me, b as ke, w as K, e as Q, _ as pe, d as fe, l as be, f as F, g as we } from "./latestRequest-DkiZG7QS.js";
import P from "primevue/inputtext";
import { Icon as I } from "@iconify/vue";
import ye from "primevue/selectbutton";
import ge from "primevue/toggleswitch";
import _e from "primevue/textarea";
const he = { class: "work-stack work-tight" }, $e = { class: "work-muted work-small" }, Ve = { class: "work-muted work-small" }, Ce = { class: "work-stack work-tight" }, xe = { class: "work-stack work-tight" }, Be = { class: "work-stack work-tight" }, Ue = { class: "work-muted work-small" }, Se = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ae = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Le = { class: "work-pack-choice" }, qe = { class: "work-row" }, De = {
  key: 0,
  class: "work-muted work-small"
}, Ee = { class: "work-muted work-small" }, Ne = {
  key: 0,
  class: "work-pack-unavailable"
}, Ie = {
  key: 2,
  class: "work-row work-small"
}, Re = ["disabled"], Te = { class: "work-settings-card work-stack work-tight" }, Oe = {
  key: 0,
  class: "work-muted work-small"
}, We = { class: "work-mono work-muted" }, je = { class: "work-muted work-small" }, Ke = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Me = { class: "work-dialog-actions" }, ze = /* @__PURE__ */ X({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(E, { emit: h }) {
    const x = E, _ = h, b = u(""), g = u(""), c = u("WORK"), k = u(""), w = u(!1), o = u(1), l = u(!1), U = u(!1), $ = u(""), B = u(""), S = u([]), f = u(""), V = u({}), A = u(/* @__PURE__ */ new Set()), C = {}, r = N(() => {
      const i = S.value.find((e) => e.id === k.value);
      return !i || !Z(i) ? [] : i.plugins.flatMap((e) => e.config_schema && me(e.config_schema).length ? [{ id: e.plugin, title: e.title || "Required plugin", schema: e.config_schema }] : []);
    });
    function m(i) {
      const e = Z(i) ? i.plugins.find((a) => a.problem && a.installed)?.problem : i.problem;
      if (e) return `${e.message} (Error code: ${e.code})`;
      if (Z(i) && i.plugins.some((a) => !a.installed)) return "A required plugin is unavailable.";
    }
    M(k, () => {
      V.value = {}, A.value.clear();
    });
    function G(i, e) {
      e ? A.value.delete(i) : A.value.add(i);
    }
    let z = crypto.randomUUID(), T = "", O = 0;
    const H = N(() => [{ id: "", title: "Empty board", description: "Set up the fields and process in Board settings.", icon: "tabler:square", version: "", disabled: !1 }, ...S.value.map((i) => {
      const e = m(i);
      return { ...i, title: i.title ?? "Unnamed pack", icon: i.icon ?? "tabler:package-off", disabled: !!e, unavailable: e };
    })]), W = N(() => H.value.find((i) => i.id === k.value)), J = N(() => !!b.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(c.value) && !!W.value && !W.value.disabled && !A.value.size && (o.value === 1 || r.value.every((i) => !Object.keys(ke(i.schema, V.value[i.id] ?? C)).length)));
    M(() => x.visible, async (i) => {
      const e = ++O;
      if (i) {
        f.value = "", V.value = {}, A.value.clear(), o.value = 1, $.value = "", B.value = "", b.value = "", g.value = "", c.value = "WORK", k.value = "", w.value = !1, z = crypto.randomUUID(), T = "", S.value = [], U.value = !0;
        try {
          const a = await K.packs();
          e === O && (S.value = a);
        } catch (a) {
          e === O && (B.value = Q(a, "Could not load packs."));
        } finally {
          e === O && (U.value = !1);
        }
      }
    }, { immediate: !0 });
    async function le() {
      if (!J.value || l.value) return;
      if (o.value === 1) {
        o.value = 2;
        return;
      }
      l.value = !0, $.value = "";
      const i = k.value ? { pack: k.value, version: W.value?.version, starter: w.value, ...Object.keys(V.value).length ? { plugin_configs: V.value } : {} } : {}, e = { key_prefix: c.value }, a = JSON.stringify([b.value.trim(), g.value, e, i]);
      T && T !== a && (z = crypto.randomUUID()), T = a;
      try {
        if (!f.value) {
          const L = await K.createBoard(b.value.trim(), e, z, i);
          f.value = L.board_id;
        }
        g.value && await K.updateBoard(f.value, { description: g.value }), _("created", f.value), _("close");
      } catch (L) {
        $.value = (f.value ? "Board created. Description was not saved. " : "") + Q(L, "Could not save the board.");
      } finally {
        l.value = !1;
      }
    }
    return (i, e) => (d(), ee(pe, {
      visible: E.visible,
      label: "New board",
      busy: l.value,
      onClose: e[6] || (e[6] = (a) => _("close"))
    }, {
      default: q(() => [
        s("form", {
          class: "work-dialog-box",
          onSubmit: te(le, ["prevent"])
        }, [
          s("header", he, [
            s("span", $e, "Step " + n(o.value) + " of 2", 1),
            s("h2", null, n(o.value === 1 ? "Name your board" : "Choose a pack"), 1),
            s("p", Ve, n(o.value === 1 ? "Give this work a home and a recognizable item key." : "Packs give your board a starting process and settings you can edit later."), 1)
          ]),
          o.value === 1 ? (d(), v(j, { key: 0 }, [
            s("label", Ce, [
              e[7] || (e[7] = D("Title", -1)),
              p(t(P), {
                id: "board-title",
                modelValue: b.value,
                "onUpdate:modelValue": e[0] || (e[0] = (a) => b.value = a),
                autofocus: "",
                required: "",
                disabled: l.value || !!f.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", xe, [
              e[8] || (e[8] = D("Description", -1)),
              p(t(_e), {
                id: "board-description",
                modelValue: g.value,
                "onUpdate:modelValue": e[1] || (e[1] = (a) => g.value = a),
                rows: "3",
                disabled: l.value || !!f.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("label", Be, [
              e[9] || (e[9] = D("Item key prefix", -1)),
              p(t(P), {
                id: "board-prefix",
                modelValue: c.value,
                "onUpdate:modelValue": e[2] || (e[2] = (a) => c.value = a),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: l.value || !!f.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("p", Ue, " Keys look like " + n(c.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), v(j, { key: 1 }, [
            U.value ? (d(), v("p", Se, "Loading packs…")) : y("", !0),
            B.value ? (d(), v("p", Ae, n(B.value), 1)) : y("", !0),
            p(t(ye), {
              modelValue: k.value,
              "onUpdate:modelValue": e[3] || (e[3] = (a) => k.value = a),
              class: "work-pack-choices",
              options: H.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: l.value || !!f.value,
              "aria-label": "Board pack"
            }, {
              option: q(({ option: a }) => [
                s("span", Le, [
                  s("span", qe, [
                    p(t(I), {
                      icon: a.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    s("strong", null, n(a.title), 1),
                    a.version ? (d(), v("span", De, n(a.version), 1)) : y("", !0)
                  ]),
                  s("span", Ee, n(a.description), 1),
                  a.disabled ? (d(), v("span", Ne, n(a.unavailable), 1)) : y("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            k.value ? (d(), v("label", Ie, [
              p(t(ge), {
                modelValue: w.value,
                "onUpdate:modelValue": e[4] || (e[4] = (a) => w.value = a),
                disabled: l.value || !!f.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = D("Include starter items", -1))
            ])) : y("", !0),
            r.value.length ? (d(), v("fieldset", {
              key: 3,
              disabled: l.value || !!f.value,
              class: "work-settings-fieldset work-stack"
            }, [
              (d(!0), v(j, null, ae(r.value, (a) => (d(), v("section", {
                key: k.value + ":" + a.id,
                class: "work-settings-card work-stack work-tight"
              }, [
                s("h3", null, n(a.title), 1),
                p(fe, {
                  schema: a.schema,
                  "model-value": V.value[a.id] ?? C,
                  disabled: l.value || !!f.value,
                  "onUpdate:modelValue": (L) => V.value[a.id] = L,
                  onValidity: (L) => G(a.id, L)
                }, null, 8, ["schema", "model-value", "disabled", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, Re)) : y("", !0),
            s("div", Te, [
              s("strong", null, n(b.value), 1),
              g.value ? (d(), v("p", Oe, n(g.value), 1)) : y("", !0),
              s("span", We, n(c.value) + "-1", 1),
              s("p", je, n(W.value?.title), 1)
            ])
          ], 64)),
          $.value ? (d(), v("p", Ke, n($.value), 1)) : y("", !0),
          s("footer", Me, [
            p(t(R), {
              label: o.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: l.value || !!f.value,
              onClick: e[5] || (e[5] = (a) => o.value === 1 ? _("close") : o.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            p(t(R), {
              type: "submit",
              label: o.value === 1 ? "Continue" : f.value ? "Save description" : "Create board",
              loading: l.value,
              disabled: !J.value || l.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Ze(E = !0) {
  const h = u([]), x = u(!0), _ = u(""), b = u(""), g = N(() => h.value.filter((o) => `${o.title} ${o.description ?? ""} ${o.key_prefix ?? ""}`.toLocaleLowerCase().includes(b.value.trim().toLocaleLowerCase()))), c = be();
  async function k() {
    const o = c();
    E && (x.value = !0, _.value = "");
    try {
      const l = await K.boards();
      o() && (h.value = l);
    } catch (l) {
      o() && (_.value = l instanceof Error ? l.message : "Could not load boards.");
    } finally {
      o() && (x.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return M(h, (o) => {
    for (const [l, U] of w) o.some(($) => $.board_id === l) || (U(), w.delete(l));
    for (const l of o) w.has(l.board_id) || w.set(l.board_id, ce(`component.${l.board_id}`, () => {
      k();
    }));
  }), ne(k), se(() => {
    c();
    for (const o of w.values()) o();
  }), { boards: h, loading: x, error: _, search: b, visibleBoards: g, load: k };
}
const Fe = { class: "work-admin-shell" }, Pe = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Ge = { class: "work-railhead" }, He = ["aria-label"], Je = {
  key: 0,
  class: "work-muted work-small"
}, Ye = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Qe = {
  key: 2,
  class: "kx-loading"
}, Xe = { class: "work-stack work-tight" }, ea = { class: "work-row work-wrap" }, aa = { class: "work-mono" }, la = { class: "work-muted work-small" }, ta = {
  key: 0,
  class: "work-muted work-small"
}, sa = {
  key: 3,
  class: "work-muted work-small"
}, oa = {
  class: "work-admin-main",
  "aria-label": "Board settings detail"
}, ia = ["board-id"], ra = {
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
}, ua = /* @__PURE__ */ X({
  __name: "AdminApp",
  setup(E) {
    const h = u(!1), x = u(!1);
    async function _() {
      if (x.value) return !1;
      if (!h.value) return !0;
      x.value = !0;
      try {
        return await Y.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        x.value = !1;
      }
    }
    async function b(C) {
      c.value === C || !await _() || (h.value = !1, c.value = C);
    }
    async function g() {
      await _() && Y.navigate("/system/settings");
    }
    const c = u(""), k = u(!1), w = u(!1), o = u(!0), { boards: l, loading: U, error: $, search: B, visibleBoards: S, load: f } = Ze(!1);
    M(l, (C) => {
      c.value && !C.some((r) => r.board_id === c.value && F(r.access)) && (c.value = "");
    });
    async function V() {
      o.value = !0, w.value = await de("kickside-work-board-settings"), o.value = !1;
    }
    oe(V);
    async function A(C) {
      await f(), await b(C);
    }
    return (C, r) => (d(), v("main", Fe, [
      s("nav", Pe, [
        s("header", Ge, [
          s("h2", null, [
            r[4] || (r[4] = D("Boards ", -1)),
            s("span", {
              class: "work-count work-mono",
              "aria-label": t(l).length + (t(l).length === 1 ? " board" : " boards")
            }, n(t(l).length), 9, He)
          ]),
          p(t(R), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: r[0] || (r[0] = (m) => k.value = !0)
          }, {
            default: q(() => [
              p(t(I), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        p(t(P), {
          modelValue: t(B),
          "onUpdate:modelValue": r[1] || (r[1] = (m) => ie(B) ? B.value = m : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        t(B).trim() ? (d(), v("p", Je, n(t(S).length) + " of " + n(t(l).length) + " " + n(t(l).length === 1 ? "board" : "boards"), 1)) : y("", !0),
        t($) ? (d(), v("p", Ye, n(t($)), 1)) : y("", !0),
        t(U) ? (d(), v("p", Qe, "Loading boards…")) : y("", !0),
        r[5] || (r[5] = s("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        p(t(R), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: g
        }, {
          icon: q(() => [
            p(t(I), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        r[6] || (r[6] = s("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), v(j, null, ae(t(S), (m) => (d(), ee(we, {
          key: m.board_id,
          class: re(["work-rail-row", { "work-rail-active": c.value === m.board_id }]),
          "aria-label": "Settings for " + m.title,
          "aria-current": c.value === m.board_id ? "page" : void 0,
          disabled: !t(F)(m.access),
          onActivate: (G) => b(m.board_id)
        }, {
          default: q(() => [
            s("span", Xe, [
              s("strong", null, n(m.title || "Untitled board"), 1),
              s("span", ea, [
                s("code", aa, n(m.key_prefix || "Board"), 1)
              ]),
              s("span", la, n(m.item_count ?? 0) + " " + n(m.item_count === 1 ? "item" : "items") + " · " + n(m.open_count ?? 0) + " open", 1),
              t(F)(m.access) ? y("", !0) : (d(), v("span", ta, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !t(U) && !t(S).length ? (d(), v("p", sa, n(t(l).length ? "No boards match this search." : "No readable boards."), 1)) : y("", !0)
      ]),
      s("section", oa, [
        c.value && w.value ? (d(), v("kickside-work-board-settings", {
          key: c.value,
          "board-id": c.value,
          embedded: "true",
          onDirtyChange: r[2] || (r[2] = (m) => h.value = m.detail.dirty)
        }, null, 40, ia)) : c.value && o.value ? (d(), v("p", ra, "Loading board settings…")) : c.value ? (d(), v("p", na, [
          r[7] || (r[7] = D("Board settings are unavailable.", -1)),
          p(t(R), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: V
          }, {
            icon: q(() => [
              p(t(I), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (d(), v("div", da, [
          p(t(I), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          r[8] || (r[8] = s("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          r[9] || (r[9] = s("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ]),
      p(ze, {
        visible: k.value,
        onClose: r[3] || (r[3] = (m) => k.value = !1),
        onCreated: A
      }, null, 8, ["visible"])
    ]));
  }
}), ca = ue(ua, { type: "object", properties: {} });
ve(import.meta.url, ca);
//# sourceMappingURL=admin.js.map
