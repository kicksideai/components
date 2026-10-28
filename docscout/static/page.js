import { defineComponent as L, ref as u, onMounted as T, computed as N, openBlock as o, createElementBlock as s, createElementVNode as l, toDisplayString as c, createCommentVNode as i, withDirectives as z, vModelText as M, createVNode as v, unref as _, Fragment as x, renderList as P, createTextVNode as C, watch as j, createBlock as S } from "vue";
import { Icon as b } from "@iconify/vue";
import { define as q } from "@wippy-fe/proxy";
import { s as E, c as D, n as I, u as O, a as R, d as U } from "./index-BH2a6VVq.js";
import { _ as A } from "./CreateForm.vue_vue_type_script_setup_true_lang-9gfvHny3.js";
import { _ as G } from "./Extractor.vue_vue_type_script_setup_true_lang-b-ZqLL1n.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const H = { class: "docscout list-page" }, J = { class: "toolbar" }, K = { class: "toolbar-title" }, Q = {
  key: 0,
  class: "count"
}, W = { class: "toolbar-side" }, X = { class: "page-body" }, Y = {
  key: 0,
  class: "create-card",
  "aria-label": "New extractor"
}, Z = {
  key: 1,
  class: "error",
  role: "alert"
}, ee = {
  key: 2,
  class: "empty",
  role: "status"
}, te = {
  key: 3,
  class: "empty-state"
}, ae = {
  key: 4,
  class: "cards"
}, oe = ["onClick"], se = { class: "card-icon" }, ne = { class: "card-main" }, re = { class: "card-title-row" }, le = { class: "card-title" }, ce = {
  key: 0,
  class: "access"
}, ie = {
  key: 0,
  class: "card-desc"
}, ue = { class: "card-meta" }, de = {
  key: 0,
  class: "empty"
}, me = {
  key: 1,
  class: "muted"
}, pe = /* @__PURE__ */ L({
  __name: "ExtractorList",
  emits: ["open"],
  setup($, { emit: y }) {
    const f = y, n = u(), m = u(!1), d = u(""), r = u(!1), p = u(!1), h = u(""), g = u("");
    async function V() {
      try {
        const a = await D.list();
        n.value = a.items, m.value = a.truncated, d.value = "";
      } catch (a) {
        d.value = a instanceof Error ? a.message : String(a);
      }
    }
    T(V);
    const w = N(() => {
      const a = g.value.trim().toLowerCase();
      return (n.value ?? []).filter((e) => !a || e.meta.title.toLowerCase().includes(a) || (e.meta.description ?? "").toLowerCase().includes(a));
    });
    async function B(a) {
      p.value = !0, h.value = "";
      try {
        const e = await D.create({ ...a, config: I() });
        r.value = !1, f("open", e.component_id);
      } catch (e) {
        h.value = e instanceof Error ? e.message : String(e);
      } finally {
        p.value = !1;
      }
    }
    function F(a) {
      const e = new Date(a);
      return e.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? e.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" }) : e.toLocaleDateString(void 0, { month: "short", day: "numeric" });
    }
    function k(a) {
      const e = a.access_level ?? 15;
      return e & 8 ? "" : e & 2 ? "Shared · can edit" : "Shared · can run";
    }
    return (a, e) => (o(), s("main", H, [
      l("div", J, [
        l("div", K, [
          e[4] || (e[4] = l("h1", null, "Docscout", -1)),
          n.value ? (o(), s("span", Q, c(n.value.length) + c(m.value ? "+" : ""), 1)) : i("", !0)
        ]),
        l("div", W, [
          n.value?.length ? z((o(), s("input", {
            key: 0,
            "onUpdate:modelValue": e[0] || (e[0] = (t) => g.value = t),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512)), [
            [M, g.value]
          ]) : i("", !0),
          v(_(E), {
            label: "New extractor",
            size: "small",
            onClick: e[1] || (e[1] = (t) => r.value = !0)
          })
        ])
      ]),
      l("div", X, [
        r.value ? (o(), s("section", Y, [
          v(A, {
            saving: p.value,
            error: h.value,
            onSubmit: B
          }, null, 8, ["saving", "error"]),
          l("button", {
            type: "button",
            class: "icon-btn create-close",
            "aria-label": "Cancel",
            onClick: e[2] || (e[2] = (t) => r.value = !1)
          }, [
            v(_(b), { icon: "tabler:x" })
          ])
        ])) : i("", !0),
        d.value ? (o(), s("p", Z, c(d.value), 1)) : n.value ? !n.value.length && !r.value ? (o(), s("div", te, [
          v(_(b), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          e[5] || (e[5] = l("p", null, "Create an extractor to pull typed fields from documents.", -1)),
          v(_(E), {
            label: "New extractor",
            size: "small",
            onClick: e[3] || (e[3] = (t) => r.value = !0)
          })
        ])) : (o(), s("div", ae, [
          (o(!0), s(x, null, P(w.value, (t) => (o(), s("button", {
            key: t.component_id,
            type: "button",
            class: "card",
            onClick: (fe) => f("open", t.component_id)
          }, [
            l("span", se, [
              v(_(b), { icon: "tabler:file-search" })
            ]),
            l("span", ne, [
              l("span", re, [
                l("span", le, c(t.meta.title), 1),
                k(t) ? (o(), s("span", ce, c(k(t)), 1)) : i("", !0)
              ]),
              t.meta.description ? (o(), s("span", ie, c(t.meta.description), 1)) : i("", !0),
              l("span", ue, [
                C(c(t.meta.field_count ?? 0) + " " + c(t.meta.field_count === "1" ? "field" : "fields") + " · updated " + c(F(t.updated_at)), 1),
                k(t) && t.meta.owner ? (o(), s(x, { key: 0 }, [
                  C(" · from " + c(t.meta.owner), 1)
                ], 64)) : i("", !0)
              ])
            ])
          ], 8, oe))), 128)),
          n.value.length && !w.value.length ? (o(), s("p", de, "No extractors match.")) : i("", !0),
          m.value ? (o(), s("p", me, "Showing the first " + c(n.value.length) + " extractors.", 1)) : i("", !0)
        ])) : (o(), s("p", ee, "Loading…"))
      ])
    ]));
  }
}), ve = /* @__PURE__ */ L({
  __name: "PageRoot",
  setup($) {
    const y = O(), f = R(), n = u("");
    j(() => y.value.route, (r) => {
      n.value = (r ?? "").split("/")[0];
    }, { immediate: !0 });
    function m(r) {
      n.value = r, f("navigate", r);
    }
    const d = N(() => n.value);
    return (r, p) => d.value ? (o(), S(G, {
      key: 0,
      id: d.value,
      back: "",
      onBack: p[0] || (p[0] = (h) => m(""))
    }, null, 8, ["id"])) : (o(), S(pe, {
      key: 1,
      onOpen: m
    }));
  }
}), _e = U(ve, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
q(import.meta.url, _e);
