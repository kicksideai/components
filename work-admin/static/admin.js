import { defineComponent as M, ref as u, computed as E, watch as Z, openBlock as c, createBlock as P, withCtx as A, createElementVNode as l, withModifiers as G, toDisplayString as i, createElementBlock as v, Fragment as K, createTextVNode as U, createVNode as b, unref as a, createCommentVNode as y, onUnmounted as H, onMounted as J, isRef as Y, renderList as Q, normalizeClass as X } from "vue";
import { Icon as I } from "@iconify/vue";
import { on as ee, host as ae, define as le } from "@wippy-fe/proxy";
import "pinia";
import { a as z, w as N, _ as se, u as te, l as oe, c as W, b as re, e as ie, d as ne } from "./latestRequest-beXyVEdS.js";
import R from "primevue/button";
import O from "primevue/inputtext";
import de from "primevue/selectbutton";
import ue from "primevue/toggleswitch";
import ce from "primevue/textarea";
const ve = { class: "work-stack work-tight" }, me = { class: "work-muted work-small" }, pe = { class: "work-muted work-small" }, ke = { class: "work-stack work-tight" }, be = { class: "work-stack work-tight" }, fe = { class: "work-stack work-tight" }, we = { class: "work-muted work-small" }, _e = {
  key: 0,
  class: "work-muted",
  role: "status"
}, ye = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, ge = { class: "work-pack-choice" }, he = { class: "work-row" }, $e = {
  key: 0,
  class: "work-muted work-small"
}, xe = { class: "work-muted work-small" }, Ce = {
  key: 0,
  class: "work-pack-unavailable"
}, Ve = {
  key: 2,
  class: "work-row work-small"
}, Be = { class: "work-settings-card work-stack work-tight" }, Se = {
  key: 0,
  class: "work-muted work-small"
}, Ue = { class: "work-mono work-muted" }, Le = { class: "work-muted work-small" }, Ae = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, De = { class: "work-dialog-actions" }, qe = /* @__PURE__ */ M({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(L, { emit: x }) {
    const V = L, g = x, n = u(""), f = u(""), w = u("WORK"), p = u(""), m = u(!1), s = u(1), t = u(!1), C = u(!1), h = u(""), B = u(""), S = u([]), k = u("");
    let $ = crypto.randomUUID(), r = "", d = 0;
    const T = E(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...S.value.map((_) => ({ ..._, disabled: !z(_) || _.plugins.some((e) => !e.installed), unavailable: z(_) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : _.problem.message }))]), D = E(() => T.value.find((_) => _.id === p.value)), j = E(() => !!n.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(w.value) && !!D.value && !D.value.disabled);
    Z(() => V.visible, async (_) => {
      const e = ++d;
      if (_) {
        k.value = "", s.value = 1, h.value = "", B.value = "", n.value = "", f.value = "", w.value = "WORK", p.value = "", m.value = !1, $ = crypto.randomUUID(), r = "", S.value = [], C.value = !0;
        try {
          const o = await N.packs();
          e === d && (S.value = o);
        } catch (o) {
          e === d && (B.value = o instanceof Error ? o.message : "Could not load packs.");
        } finally {
          e === d && (C.value = !1);
        }
      }
    }, { immediate: !0 });
    async function F() {
      if (!j.value || t.value) return;
      if (s.value === 1) {
        s.value = 2;
        return;
      }
      t.value = !0, h.value = "";
      const _ = p.value ? { pack: p.value, version: D.value?.version, starter: m.value } : {}, e = { key_prefix: w.value }, o = JSON.stringify([n.value.trim(), f.value, e, _]);
      r && r !== o && ($ = crypto.randomUUID()), r = o;
      try {
        if (!k.value) {
          const q = await N.createBoard(n.value.trim(), e, $, _);
          k.value = q.board_id;
        }
        f.value && await N.updateBoard(k.value, { description: f.value }), g("created", k.value), g("close");
      } catch (q) {
        h.value = (k.value ? "Board created. Description was not saved. " : "") + (q instanceof Error ? q.message : "Could not save the board.");
      } finally {
        t.value = !1;
      }
    }
    return (_, e) => (c(), P(se, {
      visible: L.visible,
      label: "New board",
      busy: t.value,
      onClose: e[6] || (e[6] = (o) => g("close"))
    }, {
      default: A(() => [
        l("form", {
          class: "work-dialog-box",
          onSubmit: G(F, ["prevent"])
        }, [
          l("header", ve, [
            l("span", me, "Step " + i(s.value) + " of 2", 1),
            l("h2", null, i(s.value === 1 ? "Name your board" : "Choose a pack"), 1),
            l("p", pe, i(s.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          s.value === 1 ? (c(), v(K, { key: 0 }, [
            l("label", ke, [
              e[7] || (e[7] = U("Title", -1)),
              b(a(O), {
                id: "board-title",
                modelValue: n.value,
                "onUpdate:modelValue": e[0] || (e[0] = (o) => n.value = o),
                autofocus: "",
                required: "",
                disabled: t.value || !!k.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", be, [
              e[8] || (e[8] = U("Description", -1)),
              b(a(ce), {
                id: "board-description",
                modelValue: f.value,
                "onUpdate:modelValue": e[1] || (e[1] = (o) => f.value = o),
                rows: "3",
                disabled: t.value || !!k.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("label", fe, [
              e[9] || (e[9] = U("Item key prefix", -1)),
              b(a(O), {
                id: "board-prefix",
                modelValue: w.value,
                "onUpdate:modelValue": e[2] || (e[2] = (o) => w.value = o),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: t.value || !!k.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            l("p", we, " Keys look like " + i(w.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (c(), v(K, { key: 1 }, [
            C.value ? (c(), v("p", _e, "Loading packs…")) : y("", !0),
            B.value ? (c(), v("p", ye, i(B.value), 1)) : y("", !0),
            b(a(de), {
              modelValue: p.value,
              "onUpdate:modelValue": e[3] || (e[3] = (o) => p.value = o),
              class: "work-pack-choices",
              options: T.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: t.value || !!k.value,
              "aria-label": "Board pack"
            }, {
              option: A(({ option: o }) => [
                l("span", ge, [
                  l("span", he, [
                    b(a(I), {
                      icon: o.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    l("strong", null, i(o.title), 1),
                    o.version ? (c(), v("span", $e, i(o.version), 1)) : y("", !0)
                  ]),
                  l("span", xe, i(o.description), 1),
                  o.disabled ? (c(), v("span", Ce, i(o.unavailable), 1)) : y("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            p.value ? (c(), v("label", Ve, [
              b(a(ue), {
                modelValue: m.value,
                "onUpdate:modelValue": e[4] || (e[4] = (o) => m.value = o),
                disabled: t.value || !!k.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              e[10] || (e[10] = U("Include starter items", -1))
            ])) : y("", !0),
            l("div", Be, [
              l("strong", null, i(n.value), 1),
              f.value ? (c(), v("p", Se, i(f.value), 1)) : y("", !0),
              l("span", Ue, i(w.value) + "-1", 1),
              l("p", Le, i(D.value?.title), 1)
            ])
          ], 64)),
          h.value ? (c(), v("p", Ae, i(h.value), 1)) : y("", !0),
          l("footer", De, [
            b(a(R), {
              label: s.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: t.value || !!k.value,
              onClick: e[5] || (e[5] = (o) => s.value === 1 ? g("close") : s.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            b(a(R), {
              type: "submit",
              label: s.value === 1 ? "Continue" : k.value ? "Save description" : "Create board",
              loading: t.value,
              disabled: !j.value || t.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Ee(L = !0) {
  const x = u([]), V = u(!0), g = u(""), n = u(""), f = E(() => x.value.filter((s) => `${s.title} ${s.description ?? ""} ${s.key_prefix ?? ""}`.toLocaleLowerCase().includes(n.value.trim().toLocaleLowerCase()))), w = oe();
  async function p() {
    const s = w();
    L && (V.value = !0, g.value = "");
    try {
      const t = await N.boards();
      s() && (x.value = t);
    } catch (t) {
      s() && (g.value = t instanceof Error ? t.message : "Could not load boards.");
    } finally {
      s() && (V.value = !1);
    }
  }
  const m = /* @__PURE__ */ new Map();
  return Z(x, (s) => {
    for (const [t, C] of m) s.some((h) => h.board_id === t) || (C(), m.delete(t));
    for (const t of s) m.has(t.board_id) || m.set(t.board_id, ee(`component.${t.board_id}`, () => {
      p();
    }));
  }), te(p), H(() => {
    w();
    for (const s of m.values()) s();
  }), { boards: x, loading: V, error: g, search: n, visibleBoards: f, load: p };
}
const Ie = { class: "work-admin-shell" }, Ne = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Re = { class: "work-railhead" }, Te = ["aria-label"], We = {
  key: 0,
  class: "work-muted work-small"
}, Ke = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Oe = {
  key: 2,
  class: "kx-loading"
}, Ze = { class: "work-stack work-tight" }, je = { class: "work-row work-wrap" }, ze = { class: "work-mono" }, Me = { class: "work-muted work-small" }, Pe = {
  key: 0,
  class: "work-muted work-small"
}, Fe = {
  key: 3,
  class: "work-muted work-small"
}, Ge = {
  class: "work-admin-main",
  "aria-label": "Board settings detail"
}, He = ["board-id"], Je = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ye = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Qe = {
  key: 3,
  class: "kx-empty"
}, Xe = /* @__PURE__ */ M({
  __name: "AdminApp",
  setup(L) {
    const x = u(!1), V = u(!1);
    async function g($) {
      if (!(n.value === $ || V.value)) {
        if (x.value) {
          V.value = !0;
          try {
            if (!await ae.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" })) return;
          } finally {
            V.value = !1;
          }
        }
        x.value = !1, n.value = $;
      }
    }
    const n = u(""), f = u(!1), w = u(!1), p = u(!0), { boards: m, loading: s, error: t, search: C, visibleBoards: h, load: B } = Ee(!1);
    Z(m, ($) => {
      n.value && !$.some((r) => r.board_id === n.value && W(r.access)) && (n.value = "");
    });
    async function S() {
      p.value = !0, w.value = await ie("kickside-work-board-settings"), p.value = !1;
    }
    J(S);
    async function k($) {
      await B(), await g($);
    }
    return ($, r) => (c(), v("main", Ie, [
      l("nav", Ne, [
        l("header", Re, [
          l("h2", null, [
            r[4] || (r[4] = U("Boards ", -1)),
            l("span", {
              class: "work-count work-mono",
              "aria-label": a(m).length + (a(m).length === 1 ? " board" : " boards")
            }, i(a(m).length), 9, Te)
          ]),
          b(a(R), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: r[0] || (r[0] = (d) => f.value = !0)
          }, {
            default: A(() => [
              b(a(I), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        b(a(O), {
          modelValue: a(C),
          "onUpdate:modelValue": r[1] || (r[1] = (d) => Y(C) ? C.value = d : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        a(C).trim() ? (c(), v("p", We, i(a(h).length) + " of " + i(a(m).length) + " " + i(a(m).length === 1 ? "board" : "boards"), 1)) : y("", !0),
        a(t) ? (c(), v("p", Ke, i(a(t)), 1)) : y("", !0),
        a(s) ? (c(), v("p", Oe, "Loading boards…")) : y("", !0),
        r[5] || (r[5] = l("div", { class: "work-rail-group" }, "Workspace", -1)),
        (c(!0), v(K, null, Q(a(h), (d) => (c(), P(re, {
          key: d.board_id,
          class: X(["work-rail-row", { "work-rail-active": n.value === d.board_id }]),
          "aria-label": "Settings for " + d.title,
          "aria-current": n.value === d.board_id ? "page" : void 0,
          disabled: !a(W)(d.access),
          onActivate: (T) => g(d.board_id)
        }, {
          default: A(() => [
            l("span", Ze, [
              l("strong", null, i(d.title || "Untitled board"), 1),
              l("span", je, [
                l("code", ze, i(d.key_prefix || "Board"), 1)
              ]),
              l("span", Me, i(d.item_count ?? 0) + " " + i(d.item_count === 1 ? "item" : "items") + " · " + i(d.open_count ?? 0) + " open", 1),
              a(W)(d.access) ? y("", !0) : (c(), v("span", Pe, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        !a(s) && !a(h).length ? (c(), v("p", Fe, i(a(m).length ? "No boards match this search." : "No readable boards."), 1)) : y("", !0)
      ]),
      l("section", Ge, [
        n.value && w.value ? (c(), v("kickside-work-board-settings", {
          key: n.value,
          "board-id": n.value,
          embedded: "true",
          onDirtyChange: r[2] || (r[2] = (d) => x.value = d.detail.dirty)
        }, null, 40, He)) : n.value && p.value ? (c(), v("p", Je, "Loading board settings…")) : n.value ? (c(), v("p", Ye, [
          r[6] || (r[6] = U("Board settings are unavailable.", -1)),
          b(a(R), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: S
          }, {
            icon: A(() => [
              b(a(I), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : (c(), v("div", Qe, [
          b(a(I), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          r[7] || (r[7] = l("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          r[8] || (r[8] = l("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ]))
      ]),
      b(qe, {
        visible: f.value,
        onClose: r[3] || (r[3] = (d) => f.value = !1),
        onCreated: k
      }, null, 8, ["visible"])
    ]));
  }
}), ea = ne(Xe, { type: "object", properties: {} });
le(import.meta.url, ea);
//# sourceMappingURL=admin.js.map
