import { defineComponent as $, ref as u, onMounted as F, computed as L, openBlock as s, createElementBlock as o, createElementVNode as l, toDisplayString as c, createCommentVNode as i, withDirectives as z, vModelText as M, createVNode as v, unref as _, Fragment as x, renderList as P, createTextVNode as C, watch as T, createBlock as E } from "vue";
import { Icon as b } from "@iconify/vue";
import { define as j } from "@wippy-fe/proxy";
import { s as N, c as S, n as q, u as I, a as O, d as R } from "./index-DnSDhJct.js";
import { _ as U } from "./CreateForm.vue_vue_type_script_setup_true_lang-BAnkYylA.js";
import { w as A, _ as G } from "./Extractor.vue_vue_type_script_setup_true_lang-Cg2jtC-F.js";
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
}, se = {
  key: 4,
  class: "cards"
}, ae = ["onClick"], oe = { class: "card-icon" }, ne = { class: "card-main" }, re = { class: "card-title-row" }, le = { class: "card-title" }, ce = {
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
}, pe = /* @__PURE__ */ $({
  __name: "ExtractorList",
  emits: ["open"],
  setup(V, { emit: y }) {
    const f = y, n = u(), m = u(!1), d = u(""), r = u(!1), p = u(!1), h = u(""), g = u("");
    async function B() {
      try {
        const a = await S.list();
        n.value = a.items, m.value = a.truncated, d.value = "";
      } catch (a) {
        d.value = a instanceof Error ? a.message : String(a);
      }
    }
    F(B);
    const w = L(() => {
      const a = g.value.trim().toLowerCase();
      return (n.value ?? []).filter((e) => !a || e.meta.title.toLowerCase().includes(a) || (e.meta.description ?? "").toLowerCase().includes(a));
    });
    async function D(a) {
      p.value = !0, h.value = "";
      try {
        const e = await S.create({ ...a, config: q() });
        r.value = !1, f("open", e.component_id);
      } catch (e) {
        h.value = e instanceof Error ? e.message : String(e);
      } finally {
        p.value = !1;
      }
    }
    function k(a) {
      const e = a.access_level ?? 15;
      return e & 8 ? "" : e & 2 ? "Shared · can edit" : "Shared · can run";
    }
    return (a, e) => (s(), o("main", H, [
      l("div", J, [
        l("div", K, [
          e[4] || (e[4] = l("h1", null, "Docscout", -1)),
          n.value ? (s(), o("span", Q, c(n.value.length) + c(m.value ? "+" : ""), 1)) : i("", !0)
        ]),
        l("div", W, [
          n.value?.length ? z((s(), o("input", {
            key: 0,
            "onUpdate:modelValue": e[0] || (e[0] = (t) => g.value = t),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512)), [
            [M, g.value]
          ]) : i("", !0),
          v(_(N), {
            label: "New extractor",
            size: "small",
            onClick: e[1] || (e[1] = (t) => r.value = !0)
          })
        ])
      ]),
      l("div", X, [
        r.value ? (s(), o("section", Y, [
          v(U, {
            saving: p.value,
            error: h.value,
            onSubmit: D
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
        d.value ? (s(), o("p", Z, c(d.value), 1)) : n.value ? !n.value.length && !r.value ? (s(), o("div", te, [
          v(_(b), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          e[5] || (e[5] = l("p", null, "Create an extractor to pull typed fields from documents.", -1)),
          v(_(N), {
            label: "New extractor",
            size: "small",
            onClick: e[3] || (e[3] = (t) => r.value = !0)
          })
        ])) : (s(), o("div", se, [
          (s(!0), o(x, null, P(w.value, (t) => (s(), o("button", {
            key: t.component_id,
            type: "button",
            class: "card",
            onClick: (fe) => f("open", t.component_id)
          }, [
            l("span", oe, [
              v(_(b), { icon: "tabler:file-search" })
            ]),
            l("span", ne, [
              l("span", re, [
                l("span", le, c(t.meta.title), 1),
                k(t) ? (s(), o("span", ce, c(k(t)), 1)) : i("", !0)
              ]),
              t.meta.description ? (s(), o("span", ie, c(t.meta.description), 1)) : i("", !0),
              l("span", ue, [
                C(c(t.meta.field_count ?? 0) + " " + c(t.meta.field_count === "1" ? "field" : "fields") + " · updated " + c(_(A)(t.updated_at)), 1),
                k(t) && t.meta.owner ? (s(), o(x, { key: 0 }, [
                  C(" · from " + c(t.meta.owner), 1)
                ], 64)) : i("", !0)
              ])
            ])
          ], 8, ae))), 128)),
          n.value.length && !w.value.length ? (s(), o("p", de, "No extractors match.")) : i("", !0),
          m.value ? (s(), o("p", me, "Showing the first " + c(n.value.length) + " extractors.", 1)) : i("", !0)
        ])) : (s(), o("p", ee, "Loading…"))
      ])
    ]));
  }
}), ve = /* @__PURE__ */ $({
  __name: "PageRoot",
  setup(V) {
    const y = I(), f = O(), n = u("");
    T(() => y.value.route, (r) => {
      n.value = (r ?? "").split("/")[0];
    }, { immediate: !0 });
    function m(r) {
      n.value = r, f("navigate", r);
    }
    const d = L(() => n.value);
    return (r, p) => d.value ? (s(), E(G, {
      key: 0,
      id: d.value,
      back: "",
      onBack: p[0] || (p[0] = (h) => m(""))
    }, null, 8, ["id"])) : (s(), E(pe, {
      key: 1,
      onOpen: m
    }));
  }
}), _e = R(ve, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
j(import.meta.url, _e);
