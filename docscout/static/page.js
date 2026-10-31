import { defineComponent as B, ref as c, watch as L, onBeforeUnmount as F, openBlock as a, createElementBlock as l, createElementVNode as s, toDisplayString as n, createCommentVNode as v, withDirectives as P, vModelText as R, createVNode as y, unref as p, createBlock as b, Fragment as N, renderList as T, createTextVNode as S, computed as U } from "vue";
import { Icon as E } from "@iconify/vue";
import { define as j } from "@wippy-fe/proxy";
import { b as q, s as $, c as V, n as H, u as I, a as M, d as O } from "./index-BoH1WfqS.js";
import { _ as A } from "./CreateForm.vue_vue_type_script_setup_true_lang-DAyJc453.js";
import { w as G, _ as J } from "./Extractor.vue_vue_type_script_setup_true_lang-BO7zycYL.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const K = { class: "docscout list-page" }, Q = { class: "toolbar" }, W = { class: "toolbar-title" }, X = {
  key: 0,
  class: "count"
}, Y = { class: "toolbar-side" }, Z = { class: "page-body" }, ee = {
  key: 0,
  class: "create-card",
  "aria-label": "New extractor"
}, te = {
  key: 1,
  class: "error",
  role: "alert"
}, ae = {
  key: 2,
  class: "empty",
  role: "status"
}, se = {
  key: 3,
  class: "empty-state"
}, oe = {
  key: 4,
  class: "cards"
}, le = ["onClick"], ne = { class: "card-icon" }, re = { class: "card-main" }, ie = { class: "card-title-row" }, ce = { class: "card-title" }, ue = {
  key: 0,
  class: "access"
}, de = {
  key: 0,
  class: "card-desc"
}, me = { class: "card-meta" }, ve = /* @__PURE__ */ B({
  __name: "ExtractorList",
  emits: ["open"],
  setup(z, { emit: g }) {
    const k = g, o = c(), u = c(), m = c(!1), r = c(""), i = c(!1), h = c(!1), x = c(""), _ = c("");
    let f = 0;
    async function w(d) {
      const t = ++f;
      m.value = !0;
      try {
        const e = await V.list({ filter: _.value.trim(), ...d ? { cursor: d } : {} });
        if (t !== f) return;
        o.value = d ? [...o.value ?? [], ...e.items] : e.items, u.value = e.next_cursor, r.value = "";
      } catch (e) {
        t === f && (r.value = e instanceof Error ? e.message : String(e));
      } finally {
        t === f && (m.value = !1);
      }
    }
    L(_, () => {
      o.value = void 0, u.value = void 0, w();
    }), q(() => w()), F(() => {
      f++;
    });
    async function D(d) {
      h.value = !0, x.value = "";
      try {
        const t = await V.create({ ...d, config: H() });
        i.value = !1, k("open", t.component_id);
      } catch (t) {
        x.value = t instanceof Error ? t.message : String(t);
      } finally {
        h.value = !1;
      }
    }
    function C(d) {
      const t = d.access_level ?? 15;
      return t & 8 ? "" : t & 2 ? "Shared · can edit" : "Shared · can run";
    }
    return (d, t) => (a(), l("main", K, [
      s("div", Q, [
        s("div", W, [
          t[5] || (t[5] = s("h1", null, "Docscout", -1)),
          o.value ? (a(), l("span", X, n(o.value.length) + n(u.value ? "+" : ""), 1)) : v("", !0)
        ]),
        s("div", Y, [
          P(s("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (e) => _.value = e),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512), [
            [R, _.value]
          ]),
          y(p($), {
            label: "New extractor",
            size: "small",
            onClick: t[1] || (t[1] = (e) => i.value = !0)
          })
        ])
      ]),
      s("div", Z, [
        i.value ? (a(), l("section", ee, [
          y(A, {
            saving: h.value,
            error: x.value,
            onSubmit: D
          }, null, 8, ["saving", "error"]),
          s("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline create-close",
            "aria-label": "Cancel",
            onClick: t[2] || (t[2] = (e) => i.value = !1)
          }, [
            y(p(E), { icon: "tabler:x" })
          ])
        ])) : v("", !0),
        r.value ? (a(), l("p", te, n(r.value), 1)) : o.value ? !o.value.length && !i.value ? (a(), l("div", se, [
          y(p(E), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          s("p", null, n(_.value.trim() ? "No extractors match." : "Create an extractor to pull typed fields from documents."), 1),
          _.value.trim() ? v("", !0) : (a(), b(p($), {
            key: 0,
            label: "New extractor",
            size: "small",
            onClick: t[3] || (t[3] = (e) => i.value = !0)
          }))
        ])) : (a(), l("div", oe, [
          (a(!0), l(N, null, T(o.value, (e) => (a(), l("button", {
            key: e.component_id,
            type: "button",
            class: "card kx-focus-halo",
            onClick: (fe) => k("open", e.component_id)
          }, [
            s("span", ne, [
              y(p(E), { icon: "tabler:file-search" })
            ]),
            s("span", re, [
              s("span", ie, [
                s("span", ce, n(e.meta.title), 1),
                C(e) ? (a(), l("span", ue, n(C(e)), 1)) : v("", !0)
              ]),
              e.meta.description ? (a(), l("span", de, n(e.meta.description), 1)) : v("", !0),
              s("span", me, [
                S(n(e.meta.field_count ?? 0) + " " + n(e.meta.field_count === "1" ? "field" : "fields") + " · updated " + n(p(G)(e.updated_at)), 1),
                C(e) && e.meta.owner ? (a(), l(N, { key: 0 }, [
                  S(" · from " + n(e.meta.owner), 1)
                ], 64)) : v("", !0)
              ])
            ])
          ], 8, le))), 128)),
          u.value ? (a(), b(p($), {
            key: 0,
            label: "Load more",
            size: "small",
            severity: "secondary",
            loading: m.value,
            disabled: m.value,
            onClick: t[4] || (t[4] = (e) => w(u.value))
          }, null, 8, ["loading", "disabled"])) : v("", !0)
        ])) : (a(), l("p", ae, "Loading…"))
      ])
    ]));
  }
}), pe = /* @__PURE__ */ B({
  __name: "PageRoot",
  setup(z) {
    const g = I(), k = M(), o = c("");
    L(() => g.value.route, (r) => {
      o.value = (r ?? "").split("/")[0];
    }, { immediate: !0 });
    function u(r) {
      o.value = r, k("navigate", r);
    }
    const m = U(() => o.value);
    return (r, i) => m.value ? (a(), b(J, {
      key: 0,
      id: m.value,
      back: "",
      onBack: i[0] || (i[0] = (h) => u(""))
    }, null, 8, ["id"])) : (a(), b(ve, {
      key: 1,
      onOpen: u
    }));
  }
}), _e = O(pe, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
j(import.meta.url, _e);
