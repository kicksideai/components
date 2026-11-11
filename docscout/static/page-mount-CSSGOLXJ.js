import { P as D } from "./primevue-plugin-UREsRVxx.js";
import { defineComponent as S, ref as c, watch as P, onBeforeUnmount as F, openBlock as a, createElementBlock as l, createElementVNode as o, toDisplayString as n, createCommentVNode as v, withDirectives as R, vModelText as T, createVNode as y, unref as p, createBlock as h, Fragment as E, renderList as U, createTextVNode as V, computed as q } from "vue";
import { b as H, u as I, a as M } from "./wc-runtime-DUvG5Zds.js";
import { Icon as $ } from "@iconify/vue";
import N from "primevue/button";
import { c as B, n as O } from "./config-DmObsT0z.js";
import { _ as j } from "./CreateForm.vue_vue_type_script_setup_true_lang-H6H7a3-o.js";
import { w as A, _ as G } from "./Extractor.vue_vue_type_script_setup_true_lang-NwUK29Ds.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const J = { class: "docscout list-page" }, K = { class: "toolbar" }, Q = { class: "toolbar-title" }, W = {
  key: 0,
  class: "count"
}, X = { class: "toolbar-side" }, Y = { class: "page-body" }, Z = {
  key: 0,
  class: "create-card",
  "aria-label": "New extractor"
}, ee = {
  key: 1,
  class: "error",
  role: "alert"
}, te = {
  key: 2,
  class: "empty",
  role: "status"
}, ae = {
  key: 3,
  class: "empty-state"
}, oe = {
  key: 4,
  class: "cards"
}, se = ["onClick"], le = { class: "card-icon" }, ne = { class: "card-main" }, re = { class: "card-title-row" }, ie = { class: "card-title" }, ce = {
  key: 0,
  class: "access"
}, ue = {
  key: 0,
  class: "card-desc"
}, de = { class: "card-meta" }, me = /* @__PURE__ */ S({
  __name: "ExtractorList",
  emits: ["open"],
  setup(L, { emit: b }) {
    const k = b, s = c(), u = c(), m = c(!1), r = c(""), i = c(!1), g = c(!1), x = c(""), _ = c("");
    let f = 0;
    async function C(d) {
      const t = ++f;
      m.value = !0;
      try {
        const e = await B.list({ filter: _.value.trim(), ...d ? { cursor: d } : {} });
        if (t !== f) return;
        s.value = d ? [...s.value ?? [], ...e.items] : e.items, u.value = e.next_cursor, r.value = "";
      } catch (e) {
        t === f && (r.value = e instanceof Error ? e.message : String(e));
      } finally {
        t === f && (m.value = !1);
      }
    }
    P(_, () => {
      s.value = void 0, u.value = void 0, C();
    }), H(() => C()), F(() => {
      f++;
    });
    async function z(d) {
      g.value = !0, x.value = "";
      try {
        const t = await B.create({ ...d, config: O() });
        i.value = !1, k("open", t.component_id);
      } catch (t) {
        x.value = t instanceof Error ? t.message : String(t);
      } finally {
        g.value = !1;
      }
    }
    function w(d) {
      const t = d.access_level ?? 15;
      return t & 8 ? "" : t & 2 ? "Shared · can edit" : "Shared · can run";
    }
    return (d, t) => (a(), l("main", J, [
      o("div", K, [
        o("div", Q, [
          t[5] || (t[5] = o("h1", null, "Docscout", -1)),
          s.value ? (a(), l("span", W, n(s.value.length) + n(u.value ? "+" : ""), 1)) : v("", !0)
        ]),
        o("div", X, [
          R(o("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (e) => _.value = e),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512), [
            [T, _.value]
          ]),
          y(p(N), {
            label: "New extractor",
            size: "small",
            onClick: t[1] || (t[1] = (e) => i.value = !0)
          })
        ])
      ]),
      o("div", Y, [
        i.value ? (a(), l("section", Z, [
          y(j, {
            saving: g.value,
            error: x.value,
            onSubmit: z
          }, null, 8, ["saving", "error"]),
          o("button", {
            type: "button",
            class: "kx-iconbtn kx-focus-outline create-close",
            "aria-label": "Cancel",
            onClick: t[2] || (t[2] = (e) => i.value = !1)
          }, [
            y(p($), { icon: "tabler:x" })
          ])
        ])) : v("", !0),
        r.value ? (a(), l("p", ee, n(r.value), 1)) : s.value ? !s.value.length && !i.value ? (a(), l("div", ae, [
          y(p($), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          o("p", null, n(_.value.trim() ? "No extractors match." : "Create an extractor to pull typed fields from documents."), 1),
          _.value.trim() ? v("", !0) : (a(), h(p(N), {
            key: 0,
            label: "New extractor",
            size: "small",
            onClick: t[3] || (t[3] = (e) => i.value = !0)
          }))
        ])) : (a(), l("div", oe, [
          (a(!0), l(E, null, U(s.value, (e) => (a(), l("button", {
            key: e.component_id,
            type: "button",
            class: "card kx-focus-halo",
            onClick: (pe) => k("open", e.component_id)
          }, [
            o("span", le, [
              y(p($), { icon: "tabler:file-search" })
            ]),
            o("span", ne, [
              o("span", re, [
                o("span", ie, n(e.meta.title), 1),
                w(e) ? (a(), l("span", ce, n(w(e)), 1)) : v("", !0)
              ]),
              e.meta.description ? (a(), l("span", ue, n(e.meta.description), 1)) : v("", !0),
              o("span", de, [
                V(n(e.meta.field_count ?? 0) + " " + n(e.meta.field_count === "1" ? "field" : "fields") + " · updated " + n(p(A)(e.updated_at)), 1),
                w(e) && e.meta.owner ? (a(), l(E, { key: 0 }, [
                  V(" · from " + n(e.meta.owner), 1)
                ], 64)) : v("", !0)
              ])
            ])
          ], 8, se))), 128)),
          u.value ? (a(), h(p(N), {
            key: 0,
            label: "Load more",
            size: "small",
            severity: "secondary",
            loading: m.value,
            disabled: m.value,
            onClick: t[4] || (t[4] = (e) => C(u.value))
          }, null, 8, ["loading", "disabled"])) : v("", !0)
        ])) : (a(), l("p", te, "Loading…"))
      ])
    ]));
  }
}), ve = /* @__PURE__ */ S({
  __name: "PageRoot",
  setup(L) {
    const b = I(), k = M(), s = c("");
    P(() => b.value.route, (r) => {
      s.value = (r ?? "").split("/")[0];
    }, { immediate: !0 });
    function u(r) {
      s.value = r, k("navigate", r);
    }
    const m = q(() => s.value);
    return (r, i) => m.value ? (a(), h(G, {
      key: 0,
      id: m.value,
      back: "",
      onBack: i[0] || (i[0] = (g) => u(""))
    }, null, 8, ["id"])) : (a(), h(me, {
      key: 1,
      onOpen: u
    }));
  }
}), Ce = {
  rootComponent: ve,
  plugins: [D]
};
export {
  Ce as mountConfig
};
