import { defineComponent as Y, ref as n, computed as E, watch as O, openBlock as d, createBlock as Q, withCtx as D, createElementVNode as t, withModifiers as ae, toDisplayString as r, createElementBlock as m, Fragment as j, createTextVNode as N, createVNode as p, unref as e, createCommentVNode as y, renderList as X, onUnmounted as le, onMounted as te, isRef as se, normalizeClass as oe } from "vue";
import { u as ie, e as re, a as ne } from "./mount-BPppzRAk.js";
import "pinia";
import { on as de, host as J, define as ue } from "@wippy-fe/proxy";
import R from "primevue/button";
import { a as P, w as K, f as M, _ as ce, b as ve, l as me, c as Z, d as pe } from "./latestRequest-DbPJ4unS.js";
import F from "primevue/inputtext";
import { Icon as I } from "@iconify/vue";
import ke from "primevue/selectbutton";
import be from "primevue/toggleswitch";
import fe from "primevue/textarea";
const we = { class: "work-stack work-tight" }, ye = { class: "work-muted work-small" }, ge = { class: "work-muted work-small" }, _e = { class: "work-stack work-tight" }, he = { class: "work-stack work-tight" }, $e = { class: "work-stack work-tight" }, Ve = { class: "work-muted work-small" }, xe = {
  key: 0,
  class: "work-muted",
  role: "status"
}, Ce = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, Be = { class: "work-pack-choice" }, Ue = { class: "work-row" }, Le = {
  key: 0,
  class: "work-muted work-small"
}, Se = { class: "work-muted work-small" }, Ae = {
  key: 0,
  class: "work-pack-unavailable"
}, qe = {
  key: 2,
  class: "work-row work-small"
}, De = ["disabled"], Ie = { class: "work-muted work-small" }, Ne = { class: "work-settings-card work-stack work-tight" }, Re = {
  key: 0,
  class: "work-muted work-small"
}, Te = { class: "work-mono work-muted" }, Ee = { class: "work-muted work-small" }, We = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, je = { class: "work-dialog-actions" }, Ke = /* @__PURE__ */ Y({
  __name: "CreateBoard",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close", "created"],
  setup(L, { emit: C }) {
    const $ = L, V = C, f = n(""), g = n(""), c = n("WORK"), b = n(""), w = n(!1), i = n(1), s = n(!1), _ = n(!1), h = n(""), B = n(""), S = n([]), k = n(""), x = n({}), A = n(/* @__PURE__ */ new Set()), z = E(() => {
      const v = S.value.find((a) => a.id === b.value);
      return v && P(v) ? v.plugins : [];
    });
    O(b, () => {
      x.value = {}, A.value.clear();
    });
    function U(v, a) {
      a ? A.value.delete(v) : A.value.add(v);
    }
    let o = crypto.randomUUID(), u = "", T = 0;
    const G = E(() => [{ id: "", title: "Empty board", description: "Start with an empty board and build its schema in Settings.", icon: "tabler:square", version: "", disabled: !1 }, ...S.value.map((v) => ({ ...v, title: v.title ?? v.id, icon: v.icon ?? "tabler:package-off", disabled: !P(v) || v.plugins.some((a) => !a.installed), unavailable: P(v) ? "Required plugin unavailable. Install the pack’s required capabilities to use it." : v.problem.message }))]), W = E(() => G.value.find((v) => v.id === b.value)), H = E(() => !!f.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(c.value) && !!W.value && !W.value.disabled && !A.value.size);
    O(() => $.visible, async (v) => {
      const a = ++T;
      if (v) {
        k.value = "", x.value = {}, A.value.clear(), i.value = 1, h.value = "", B.value = "", f.value = "", g.value = "", c.value = "WORK", b.value = "", w.value = !1, o = crypto.randomUUID(), u = "", S.value = [], _.value = !0;
        try {
          const l = await K.packs();
          a === T && (S.value = l);
        } catch (l) {
          a === T && (B.value = M(l, "Could not load packs."));
        } finally {
          a === T && (_.value = !1);
        }
      }
    }, { immediate: !0 });
    async function ee() {
      if (!H.value || s.value) return;
      if (i.value === 1) {
        i.value = 2;
        return;
      }
      s.value = !0, h.value = "";
      const v = b.value ? { pack: b.value, version: W.value?.version, starter: w.value, ...Object.keys(x.value).length ? { plugin_configs: x.value } : {} } : {}, a = { key_prefix: c.value }, l = JSON.stringify([f.value.trim(), g.value, a, v]);
      u && u !== l && (o = crypto.randomUUID()), u = l;
      try {
        if (!k.value) {
          const q = await K.createBoard(f.value.trim(), a, o, v);
          k.value = q.board_id;
        }
        g.value && await K.updateBoard(k.value, { description: g.value }), V("created", k.value), V("close");
      } catch (q) {
        h.value = (k.value ? "Board created. Description was not saved. " : "") + M(q, "Could not save the board.");
      } finally {
        s.value = !1;
      }
    }
    return (v, a) => (d(), Q(ce, {
      visible: L.visible,
      label: "New board",
      busy: s.value,
      onClose: a[6] || (a[6] = (l) => V("close"))
    }, {
      default: D(() => [
        t("form", {
          class: "work-dialog-box",
          onSubmit: ae(ee, ["prevent"])
        }, [
          t("header", we, [
            t("span", ye, "Step " + r(i.value) + " of 2", 1),
            t("h2", null, r(i.value === 1 ? "Name your board" : "Choose a pack"), 1),
            t("p", ge, r(i.value === 1 ? "Give this work a home and a recognizable item key." : "Packs provide a process and schema you can edit in Board settings."), 1)
          ]),
          i.value === 1 ? (d(), m(j, { key: 0 }, [
            t("label", _e, [
              a[7] || (a[7] = N("Title", -1)),
              p(e(F), {
                id: "board-title",
                modelValue: f.value,
                "onUpdate:modelValue": a[0] || (a[0] = (l) => f.value = l),
                autofocus: "",
                required: "",
                disabled: s.value || !!k.value,
                placeholder: "Team delivery"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", he, [
              a[8] || (a[8] = N("Description", -1)),
              p(e(fe), {
                id: "board-description",
                modelValue: g.value,
                "onUpdate:modelValue": a[1] || (a[1] = (l) => g.value = l),
                rows: "3",
                disabled: s.value || !!k.value,
                placeholder: "What does this board help the team deliver?"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("label", $e, [
              a[9] || (a[9] = N("Item key prefix", -1)),
              p(e(F), {
                id: "board-prefix",
                modelValue: c.value,
                "onUpdate:modelValue": a[2] || (a[2] = (l) => c.value = l),
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10",
                disabled: s.value || !!k.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            t("p", Ve, " Keys look like " + r(c.value || "WORK") + "-1. The prefix must be unique in this installation. ", 1)
          ], 64)) : (d(), m(j, { key: 1 }, [
            _.value ? (d(), m("p", xe, "Loading packs…")) : y("", !0),
            B.value ? (d(), m("p", Ce, r(B.value), 1)) : y("", !0),
            p(e(ke), {
              modelValue: b.value,
              "onUpdate:modelValue": a[3] || (a[3] = (l) => b.value = l),
              class: "work-pack-choices",
              options: G.value,
              optionLabel: "title",
              optionValue: "id",
              optionDisabled: "disabled",
              allowEmpty: !1,
              disabled: s.value || !!k.value,
              "aria-label": "Board pack"
            }, {
              option: D(({ option: l }) => [
                t("span", Be, [
                  t("span", Ue, [
                    p(e(I), {
                      icon: l.icon,
                      "aria-hidden": "true"
                    }, null, 8, ["icon"]),
                    t("strong", null, r(l.title), 1),
                    l.version ? (d(), m("span", Le, r(l.version), 1)) : y("", !0)
                  ]),
                  t("span", Se, r(l.description), 1),
                  l.disabled ? (d(), m("span", Ae, r(l.unavailable), 1)) : y("", !0)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "options", "disabled"]),
            b.value ? (d(), m("label", qe, [
              p(e(be), {
                modelValue: w.value,
                "onUpdate:modelValue": a[4] || (a[4] = (l) => w.value = l),
                disabled: s.value || !!k.value,
                "aria-label": "Include starter items"
              }, null, 8, ["modelValue", "disabled"]),
              a[10] || (a[10] = N("Include starter items", -1))
            ])) : y("", !0),
            t("fieldset", {
              disabled: s.value || !!k.value,
              class: "work-settings-fieldset"
            }, [
              (d(!0), m(j, null, X(z.value, (l) => (d(), m("div", {
                key: l.plugin,
                class: "work-stack work-tight"
              }, [
                t("p", Ie, "Provide any initial configuration required by " + r(l.plugin) + ". Work validates it before creating the board.", 1),
                p(ve, {
                  label: "Initial configuration for " + l.plugin,
                  shape: "object",
                  "model-value": x.value[l.plugin],
                  example: {},
                  "onUpdate:modelValue": (q) => q === void 0 ? delete x.value[l.plugin] : x.value[l.plugin] = q,
                  onValidity: (q) => U(l.plugin, q)
                }, null, 8, ["label", "model-value", "onUpdate:modelValue", "onValidity"])
              ]))), 128))
            ], 8, De),
            t("div", Ne, [
              t("strong", null, r(f.value), 1),
              g.value ? (d(), m("p", Re, r(g.value), 1)) : y("", !0),
              t("span", Te, r(c.value) + "-1", 1),
              t("p", Ee, r(W.value?.title), 1)
            ])
          ], 64)),
          h.value ? (d(), m("p", We, r(h.value), 1)) : y("", !0),
          t("footer", je, [
            p(e(R), {
              label: i.value === 1 ? "Cancel" : "Back",
              severity: "secondary",
              disabled: s.value || !!k.value,
              onClick: a[5] || (a[5] = (l) => i.value === 1 ? V("close") : i.value = 1),
              outlined: ""
            }, null, 8, ["label", "disabled"]),
            p(e(R), {
              type: "submit",
              label: i.value === 1 ? "Continue" : k.value ? "Save description" : "Create board",
              loading: s.value,
              disabled: !H.value || s.value
            }, null, 8, ["label", "loading", "disabled"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "busy"]));
  }
});
function Oe() {
  const L = n([]), C = n(!0), $ = n(""), V = n(""), f = n(!1), g = E(() => L.value.filter((i) => `${i.title} ${i.description ?? ""} ${i.key_prefix ?? ""}`.toLocaleLowerCase().includes(V.value.trim().toLocaleLowerCase()))), c = me();
  async function b(i = !1) {
    const s = c();
    i && (C.value = !0, $.value = "");
    try {
      const _ = await K.boards();
      if (!s()) return;
      L.value = _, f.value = !0, $.value = "";
    } catch (_) {
      s() && ($.value = M(_, "Could not load boards."));
    } finally {
      s() && (C.value = !1);
    }
  }
  const w = /* @__PURE__ */ new Map();
  return O(L, (i) => {
    for (const [s, _] of w) i.some((h) => h.board_id === s) || (_(), w.delete(s));
    for (const s of i) w.has(s.board_id) || w.set(s.board_id, de(`component.${s.board_id}`, () => {
      b();
    }));
  }), ie(b), le(() => {
    c();
    for (const i of w.values()) i();
  }), { boards: L, loading: C, error: $, search: V, visibleBoards: g, hasLoaded: f, load: b };
}
const ze = { class: "work-admin-shell" }, Pe = {
  class: "work-rail",
  "aria-label": "Board settings navigation"
}, Ze = { class: "work-railhead" }, Me = ["aria-label"], Fe = {
  key: 0,
  class: "work-muted work-small"
}, Ge = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, He = {
  key: 2,
  class: "kx-err work-alert-actions"
}, Je = { role: "alert" }, Ye = { class: "work-stack work-tight" }, Qe = { class: "work-row work-wrap" }, Xe = { class: "work-mono" }, ea = { class: "work-muted work-small" }, aa = {
  key: 0,
  class: "work-muted work-small"
}, la = {
  key: 3,
  class: "work-muted work-small"
}, ta = {
  class: "work-admin-main",
  "aria-label": "Board settings detail"
}, sa = ["board-id"], oa = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ia = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ra = {
  key: 3,
  class: "kx-empty"
}, na = /* @__PURE__ */ Y({
  __name: "AdminApp",
  setup(L) {
    const C = n(!1), $ = n(!1);
    async function V() {
      if ($.value) return !1;
      if (!C.value) return !0;
      $.value = !0;
      try {
        return await J.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" });
      } finally {
        $.value = !1;
      }
    }
    async function f(U) {
      c.value === U || !await V() || (C.value = !1, c.value = U);
    }
    async function g() {
      await V() && J.navigate("/system/settings");
    }
    const c = n(""), b = n(!1), w = n(!1), i = n(!0), { boards: s, loading: _, error: h, search: B, visibleBoards: S, hasLoaded: k, load: x } = Oe();
    O(s, (U) => {
      c.value && !U.some((o) => o.board_id === c.value && Z(o.access)) && (c.value = "");
    });
    async function A() {
      i.value = !0, w.value = await re("kickside-work-board-settings"), i.value = !1;
    }
    te(A);
    async function z(U) {
      await x(), await f(U);
    }
    return (U, o) => (d(), m("main", ze, [
      t("nav", Pe, [
        t("header", Ze, [
          t("h2", null, [
            o[5] || (o[5] = N("Boards ", -1)),
            e(k) ? (d(), m("span", {
              key: 0,
              class: "work-count work-mono",
              "aria-label": e(s).length + (e(s).length === 1 ? " board" : " boards")
            }, r(e(s).length), 9, Me)) : y("", !0)
          ]),
          p(e(R), {
            "aria-label": "Create board",
            title: "Create board",
            severity: "secondary",
            text: "",
            size: "small",
            onClick: o[0] || (o[0] = (u) => b.value = !0)
          }, {
            default: D(() => [
              p(e(I), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ]),
        p(e(F), {
          modelValue: e(B),
          "onUpdate:modelValue": o[1] || (o[1] = (u) => se(B) ? B.value = u : null),
          type: "search",
          "aria-label": "Search boards",
          placeholder: "Search boards…"
        }, null, 8, ["modelValue"]),
        e(k) && e(B).trim() ? (d(), m("p", Fe, r(e(S).length) + " of " + r(e(s).length) + " " + r(e(s).length === 1 ? "board" : "boards"), 1)) : y("", !0),
        e(_) ? (d(), m("p", Ge, "Loading boards…")) : e(h) ? (d(), m("div", He, [
          t("p", Je, r(e(h)), 1),
          p(e(R), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            onClick: o[2] || (o[2] = (u) => e(x)(!0))
          }, {
            icon: D(() => [
              p(e(I), {
                icon: "tabler:refresh",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])) : y("", !0),
        o[6] || (o[6] = t("p", { class: "work-muted work-small" }, "Board settings override application defaults.", -1)),
        p(e(R), {
          label: "Application defaults",
          severity: "secondary",
          outlined: "",
          onClick: g
        }, {
          icon: D(() => [
            p(e(I), {
              icon: "tabler:settings",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }),
        o[7] || (o[7] = t("div", { class: "work-rail-group" }, "Workspace", -1)),
        (d(!0), m(j, null, X(e(S), (u) => (d(), Q(pe, {
          key: u.board_id,
          class: oe(["work-rail-row", { "work-rail-active": c.value === u.board_id }]),
          "aria-label": "Settings for " + u.title,
          "aria-current": c.value === u.board_id ? "page" : void 0,
          disabled: !e(Z)(u.access),
          onActivate: (T) => f(u.board_id)
        }, {
          default: D(() => [
            t("span", Ye, [
              t("strong", null, r(u.title || "Untitled board"), 1),
              t("span", Qe, [
                t("code", Xe, r(u.key_prefix || "Board"), 1)
              ]),
              t("span", ea, r(u.item_count ?? 0) + " " + r(u.item_count === 1 ? "item" : "items") + " · " + r(u.open_count ?? 0) + " open", 1),
              e(Z)(u.access) ? y("", !0) : (d(), m("span", aa, "Administrator access required"))
            ])
          ]),
          _: 2
        }, 1032, ["class", "aria-label", "aria-current", "disabled", "onActivate"]))), 128)),
        e(k) && !e(_) && !e(h) && !e(S).length ? (d(), m("p", la, r(e(s).length ? "No boards match this search." : "No readable boards."), 1)) : y("", !0)
      ]),
      t("section", ta, [
        c.value && w.value ? (d(), m("kickside-work-board-settings", {
          key: c.value,
          "board-id": c.value,
          embedded: "true",
          onDirtyChange: o[3] || (o[3] = (u) => C.value = u.detail.dirty)
        }, null, 40, sa)) : c.value && i.value ? (d(), m("p", oa, "Loading board settings…")) : c.value ? (d(), m("p", ia, [
          o[8] || (o[8] = N("Board settings are unavailable.", -1)),
          p(e(R), {
            label: "Reload settings",
            severity: "secondary",
            outlined: "",
            onClick: A
          }, {
            icon: D(() => [
              p(e(I), { icon: "tabler:refresh" })
            ]),
            _: 1
          })
        ])) : e(k) && e(s).length ? (d(), m("div", ra, [
          p(e(I), {
            class: "kx-empty-ico",
            icon: "tabler:adjustments"
          }),
          o[9] || (o[9] = t("h2", { class: "kx-empty-title" }, "Choose a board", -1)),
          o[10] || (o[10] = t("p", { class: "kx-empty-sub" }, "Select a board to edit its fields, process and policy.", -1))
        ])) : y("", !0)
      ]),
      p(Ke, {
        visible: b.value,
        onClose: o[4] || (o[4] = (u) => b.value = !1),
        onCreated: z
      }, null, 8, ["visible"])
    ]));
  }
}), da = ne(na, { type: "object", properties: {} });
ue(import.meta.url, da);
//# sourceMappingURL=admin.js.map
