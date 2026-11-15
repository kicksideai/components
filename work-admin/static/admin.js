import { defineComponent as z, ref as v, computed as E, watch as K, openBlock as n, createBlock as M, withCtx as S, createElementVNode as l, withModifiers as F, toDisplayString as r, createElementBlock as u, Fragment as T, createTextVNode as C, createVNode as p, unref as a, createCommentVNode as _, onUnmounted as G, onMounted as H, isRef as J, renderList as P, normalizeClass as Q } from "vue";
import { Icon as I } from "@iconify/vue";
import { on as X, define as Y } from "@wippy-fe/proxy";
import "pinia";
import { w as D, _ as ee, u as ae, l as le, c as R, a as se, e as te, b as oe } from "./latestRequest-ChYtJT1O.js";
import N from "primevue/button";
import W from "primevue/inputtext";
import re from "primevue/selectbutton";
import ie from "primevue/toggleswitch";
import ne from "primevue/textarea";
const de = { class: "work-stack work-tight" }, ue = { class: "work-muted work-small" }, ce = { class: "work-muted work-small" }, ve = { class: "work-stack work-tight" }, me = { class: "work-stack work-tight" }, ke = { class: "work-stack work-tight" }, pe = { class: "work-muted work-small" }, be = {
  key: 0,
  class: "work-muted",
  role: "status"
}, fe = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, we = { class: "work-pack-choice" }, _e = { class: "work-row" }, ye = {
  key: 0,
  class: "work-muted work-small"
}, he = { class: "work-muted work-small" }, ge = {
  key: 0,
  class: "work-pack-unavailable"
}, $e = {
  key: 2,
  class: "work-row work-small"
}, xe = { class: "work-settings-card work-stack work-tight" }, Ve = {
  key: 0,
  class: "work-muted work-small"
}, Ce = { class: "work-mono work-muted" }, Be = { class: "work-muted work-small" }, Ue = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Se = { class: "work-dialog-actions" }, Ae = /* @__PURE__ */ z({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(B, { emit: c }) {
    const g = B, y = c, b = v(""), m = v(""), w = v("WORK"), f = v(""), k = v(!1), s = v(1), t = v(!1), V = v(!1), $ = v(""), x = v(""), i = v([]);
    let d = crypto.randomUUID(), U = "", A = 0;
    const O = E(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...i.value.map((h) => ({ ...h, disabled: h.plugins.some((e) => !e.installed) }))]), L = E(() => O.value.find((h) => h.id === f.value)), Z = E(() => !!b.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(w.value) && !!L.value && !L.value.disabled);
    K(() => g.visible, async (h) => {
      const e = ++A;
      if (h) {
        s.value = 1, $.value = "", x.value = "", b.value = "", m.value = "", w.value = "WORK", f.value = "", k.value = !1, d = crypto.randomUUID(), U = "", i.value = [], V.value = !0;
        try {
          const o = await D.packs();
          e === A && (i.value = o);
        } catch (o) {
          e === A && (x.value = o instanceof Error ? o.message : "Could not load packs.");
        } finally {
          e === A && (V.value = !1);
        }
      }
    }, { immediate: !0 });
    async function j() {
      if (!Z.value || t.value) return;
      if (s.value === 1) {
        s.value = 2;
        return;
      }
      t.value = !0, $.value = "";
      const h = f.value ? { pack: f.value, version: L.value?.version, starter: k.value } : {}, e = { key_prefix: w.value }, o = JSON.stringify([b.value.trim(), m.value, e, h]);
      U && U !== o && (d = crypto.randomUUID()), U = o;
      try {
        const q = await D.createBoard(b.value.trim(), e, d, m.value, h);
        y("created", q.board_id), y("close");
      } catch (q) {
        $.value = q instanceof Error ? q.message : "Could not create the board.";
      } finally {
        t.value = !1;
      }
    }
    return (h, e) => (n(), M(ee, {
      visible: B.visible,
      label: "New board",
      busy: t.value,
      onClose: e[6] || (e[6] = (o) => y("close"))
    }, {
      default: S(() => [
        l("form", {
          class: "work-dialog-box",
          onSubmit: F(j, ["prevent"])
        }, [
          l("header", de, [
            l("span", ue, "Step " + r(s.value) + " of 2", 1),
            l("h2", null, r(s.value === 1 ? "Name your board" : "Choose a pack"), 1),
            l("p", ce, r(s.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          s.value === 1 ? (n(), u(T, { key: 0 }, [
            l("label", ve, [
              e[7] || (e[7] = C("Title", -1)),
              p(a(W), {
                id: "board-title",
                modelValue: b.value,
                "onUpdate:modelValue": e[0] || (e[0] = (o) => b.value = o),
                autofocus: "",
                required: "",
                disabled: t.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", me, [
              e[8] || (e[8] = C("Description", -1)),
              p(a(ne), {
                id: "board-description",
                modelValue: m.value,
                "onUpdate:modelValue": e[1] || (e[1] = (o) => m.value = o),
                rows: "3",
                disabled: t.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", ke, [
              e[9] || (e[9] = C("Item key prefix", -1)),
              p(a(W), {
                id: "board-prefix",
                modelValue: w.value,
                "onUpdate:modelValue": e[2] || (e[2] = (o) => w.value = o),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: t.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("p", pe, " Keys look like " + r(w.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (n(), u(T, { key: 1 }, [
            V.value ? (n(), u("p", be, "Loading packs…")) : _("", !0),
            x.value ? (n(), u("p", fe, r(x.value), 1)) : _("", !0),
            p(a(re), {
              modelValue: f.value,
              "onUpdate:modelValue": e[3] || (e[3] = (o) => f.value = o),
              class: "work-pack-choices",
              options: O.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: t.value,
              "aria-label": "Board pack"
            }, {
              option: S(({ option: o }) => [
                l("span", we, [
                  l("span", _e, [
                    p(a(I), {
                      icon: o.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    l("strong", null, r(o.title), 1),
                    o.version ? (n(), u("span", ye, r(o.version), 1)) : _("", !0)
                  ]),
                  l("span", he, r(o.description), 1),
                  o.disabled ? (n(), u("span", ge, "Required plugin unavailable. Install the pack's required capabilities to use it.")) : _("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            f.value ? (n(), u("label", $e, [
              p(a(ie), {
                modelValue: k.value,
                "onUpdate:modelValue": e[4] || (e[4] = (o) => k.value = o),
                disabled: t.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = C("Include starter items", -1))
            ])) : _("", !0),
            l("div", xe, [
              l("strong", null, r(b.value), 1),
              m.value ? (n(), u("p", Ve, r(m.value), 1)) : _("", !0),
              l("span", Ce, r(w.value) + "-1", 1),
              l("p", Be, r(L.value?.title), 1)
            ])
          ], 64)),
          $.value ? (n(), u("p", Ue, r($.value), 1)) : _("", !0),
          l("footer", Se, [
            p(a(N), {
              label: s.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: t.value,
              onClick: e[5] || (e[5] = (o) => s.value === 1 ? y("close") : s.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            p(a(N), {
              type: "submit",
              label: s.value === 1 ? "Continue" : "Create board",
              loading: t.value,
              disabled: !Z.value || t.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Le(B = !0) {
  const c = v([]), g = v(!0), y = v(""), b = v(""), m = E(() => c.value.filter((s) => `${s.title} ${s.description ?? ""} ${s.key_prefix ?? ""}`.toLocaleLowerCase().includes(b.value.trim().toLocaleLowerCase()))), w = le();
  async function f() {
    const s = w();
    B && (g.value = !0, y.value = "");
    try {
      const t = await D.boards();
      s() && (c.value = t);
    } catch (t) {
      s() && (y.value = t instanceof Error ? t.message : "Could not load boards.");
    } finally {
      s() && (g.value = !1);
    }
  }
  const k = /* @__PURE__ */ new Map();
  return K(c, (s) => {
    for (const [t, V] of k) s.some(($) => $.board_id === t) || (V(), k.delete(t));
    for (const t of s) k.has(t.board_id) || k.set(t.board_id, X(`component.${t.board_id}`, () => {
      f();
    }));
  }), ae(f), G(() => {
    w();
    for (const s of k.values()) s();
  }), { boards: c, loading: g, error: y, search: b, visibleBoards: m, load: f };
}
const qe = { class: "work-admin-shell" }, Ee = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Ie = { class: "work-railhead" }, Ne = ["aria-label"], Re = {
  key: 0,
  class: "work-muted work-small"
}, Te = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, De = {
  key: 2,
  class: "kx-loading"
}, We = { class: "work-stack work-tight" }, Ke = { class: "work-row work-wrap" }, Oe = { class: "work-mono" }, Ze = { class: "work-muted work-small" }, ze = {
  key: 0,
  class: "work-muted work-small"
}, Me = {
  key: 3,
  class: "work-muted work-small"
}, je = {
  class: "work-admin-main",
  "aria-label": "Board settings detail"
}, Fe = ["board-id"], Ge = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, He = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Je = {
  key: 3,
  class: "kx-empty"
}, Pe = /* @__PURE__ */ z({
  __name: "AdminApp",
  setup(B) {
    const c = v(""), g = v(!1), y = v(!1), b = v(!0), { boards: m, loading: w, error: f, search: k, visibleBoards: s, load: t } = Le(!1);
    K(m, (x) => {
      c.value && !x.some((i) => i.board_id === c.value && R(i.access)) && (c.value = "");
    });
    async function V() {
      b.value = !0, y.value = await te("kickside-work-board-settings"), b.value = !1;
    }
    H(V);
    async function $(x) {
      await t(), c.value = x;
    }
    return (x, i) => (n(), u("main", qe, [
      l("nav", Ee, [
        l("header", Ie, [
          l("h2", null, [
            i[3] || (i[3] = C("Boards ", -1)),
            l("span", {
              class: "work-count work-mono",
              "aria-label": a(m).length + (a(m).length === 1 ? " board" : " boards")
            }, r(a(m).length), 9, Ne)
          ]),
          p(a(N), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: i[0] || (i[0] = (d) => g.value = !0)
          }, {
            default: S(() => [
              p(a(I), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        p(a(W), {
          modelValue: a(k),
          "onUpdate:modelValue": i[1] || (i[1] = (d) => J(k) ? k.value = d : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        a(k).trim() ? (n(), u("p", Re, r(a(s).length) + " of " + r(a(m).length) + " " + r(a(m).length === 1 ? "board" : "boards"), 1)) : _("", !0),
        a(f) ? (n(), u("p", Te, r(a(f)), 1)) : _("", !0),
        a(w) ? (n(), u("p", De, "Loading boards…")) : _("", !0),
        i[4] || (i[4] = l("div", { class: "work-rail-group" }, "Workspace", -1)),
        (n(!0), u(T, null, P(a(s), (d) => (n(), M(se, {
          key: d.board_id,
          class: Q(["work-rail-row", { "work-rail-active": c.value === d.board_id }]),
          "aria-label": "Settings for " + d.title,
          "aria-current": c.value === d.board_id ? "page" : void 0,
          disabled: !a(R)(d.access),
          onActivate: (U) => c.value = d.board_id
        }, {
          default: S(() => [
            l("span", We, [
              l("strong", null, r(d.title || "Untitled board"), 1),
              l("span", Ke, [
                l("code", Oe, r(d.key_prefix || "Board"), 1)
              ]),
              l("span", Ze, r(d.item_count ?? 0) + " " + r(d.item_count === 1 ? "item" : "items") + " · " + r(d.open_count ?? 0) + " open", 1),
              a(R)(d.access) ? _("", !0) : (n(), u("span", ze, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !a(w) && !a(s).length ? (n(), u("p", Me, r(a(m).length ? "No boards match this search." : "No readable boards."), 1)) : _("", !0)
      ]),
      l("section", je, [
        c.value && y.value ? (n(), u("kickside-work-board-settings", {
          key: c.value,
          "board-id": c.value,
          embedded: "true"
        }, null, 8, Fe)) : c.value && b.value ? (n(), u("p", Ge, "Loading board settings…")) : c.value ? (n(), u("p", He, [
          i[5] || (i[5] = C("Board settings are unavailable.", -1)),
          p(a(N), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: V
          }, {
            icon: S(() => [
              p(a(I), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (n(), u("div", Je, [
          p(a(I), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          i[6] || (i[6] = l("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          i[7] || (i[7] = l("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ]),
      p(Ae, {
        visible: g.value,
        onClose: i[2] || (i[2] = (d) => g.value = !1),
        onCreated: $
      }, null, 8, ["visible"])
    ]));
  }
}), Qe = oe(Pe, { type: "object", properties: {} });
Y(import.meta.url, Qe);
//# sourceMappingURL=admin.js.map
