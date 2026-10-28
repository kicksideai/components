import { defineComponent as C, ref as d, onMounted as B, computed as E, openBlock as t, createElementBlock as n, createElementVNode as r, toDisplayString as u, createCommentVNode as v, withDirectives as V, vModelText as F, createVNode as m, unref as _, Fragment as z, renderList as M, watch as P, createBlock as b } from "vue";
import { Icon as g } from "@iconify/vue";
import { define as j } from "@wippy-fe/proxy";
import { s as w, c as x, n as q, u as I, a as O, d as R } from "./index-D4Z7Rr2F.js";
import { _ as T } from "./CreateForm.vue_vue_type_script_setup_true_lang-Ch2xRVPD.js";
import { _ as U } from "./Extractor.vue_vue_type_script_setup_true_lang-COFUptvW.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const A = { class: "docscout list-page" }, G = { class: "toolbar" }, H = { class: "toolbar-title" }, J = {
  key: 0,
  class: "count"
}, K = { class: "toolbar-side" }, Q = { class: "page-body" }, W = {
  key: 0,
  class: "create-card",
  "aria-label": "New extractor"
}, X = {
  key: 1,
  class: "error",
  role: "alert"
}, Y = {
  key: 2,
  class: "empty",
  role: "status"
}, Z = {
  key: 3,
  class: "empty-state"
}, ee = {
  key: 4,
  class: "cards"
}, te = ["onClick"], oe = { class: "card-icon" }, se = { class: "card-main" }, ae = { class: "card-title" }, ne = {
  key: 0,
  class: "card-desc"
}, re = { class: "card-meta" }, le = {
  key: 0,
  class: "empty"
}, ce = /* @__PURE__ */ C({
  __name: "ExtractorList",
  emits: ["open"],
  setup(L, { emit: h }) {
    const f = h, s = d(), i = d(""), l = d(!1), c = d(!1), p = d(""), y = d("");
    async function N() {
      try {
        s.value = await x.list(), i.value = "";
      } catch (a) {
        i.value = a instanceof Error ? a.message : String(a);
      }
    }
    B(N);
    const k = E(() => {
      const a = y.value.trim().toLowerCase();
      return (s.value ?? []).filter((e) => !a || e.meta.title.toLowerCase().includes(a) || (e.meta.description ?? "").toLowerCase().includes(a));
    });
    async function S(a) {
      c.value = !0, p.value = "";
      try {
        const e = await x.create({ ...a, config: q() });
        l.value = !1, f("open", e.component_id);
      } catch (e) {
        p.value = e instanceof Error ? e.message : String(e);
      } finally {
        c.value = !1;
      }
    }
    const D = (a) => new Date(a).toLocaleDateString(void 0, { month: "short", day: "numeric" });
    return (a, e) => (t(), n("main", A, [
      r("div", G, [
        r("div", H, [
          e[4] || (e[4] = r("h1", null, "Docscout", -1)),
          s.value ? (t(), n("span", J, u(s.value.length), 1)) : v("", !0)
        ]),
        r("div", K, [
          s.value?.length ? V((t(), n("input", {
            key: 0,
            "onUpdate:modelValue": e[0] || (e[0] = (o) => y.value = o),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512)), [
            [F, y.value]
          ]) : v("", !0),
          m(_(w), {
            label: "New extractor",
            size: "small",
            onClick: e[1] || (e[1] = (o) => l.value = !0)
          })
        ])
      ]),
      r("div", Q, [
        l.value ? (t(), n("section", W, [
          m(T, {
            saving: c.value,
            error: p.value,
            onSubmit: S
          }, null, 8, ["saving", "error"]),
          r("button", {
            type: "button",
            class: "icon-btn create-close",
            "aria-label": "Cancel",
            onClick: e[2] || (e[2] = (o) => l.value = !1)
          }, [
            m(_(g), { icon: "tabler:x" })
          ])
        ])) : v("", !0),
        i.value ? (t(), n("p", X, u(i.value), 1)) : s.value ? !s.value.length && !l.value ? (t(), n("div", Z, [
          m(_(g), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          e[5] || (e[5] = r("p", null, "Create an extractor to pull typed fields from documents.", -1)),
          m(_(w), {
            label: "New extractor",
            size: "small",
            onClick: e[3] || (e[3] = (o) => l.value = !0)
          })
        ])) : (t(), n("div", ee, [
          (t(!0), n(z, null, M(k.value, (o) => (t(), n("button", {
            key: o.component_id,
            type: "button",
            class: "card",
            onClick: (ue) => f("open", o.component_id)
          }, [
            r("span", oe, [
              m(_(g), { icon: "tabler:file-search" })
            ]),
            r("span", se, [
              r("span", ae, u(o.meta.title), 1),
              o.meta.description ? (t(), n("span", ne, u(o.meta.description), 1)) : v("", !0),
              r("span", re, u(o.meta.field_count ?? 0) + " " + u(o.meta.field_count === "1" ? "field" : "fields") + " · updated " + u(D(o.updated_at)), 1)
            ])
          ], 8, te))), 128)),
          s.value.length && !k.value.length ? (t(), n("p", le, "No extractors match.")) : v("", !0)
        ])) : (t(), n("p", Y, "Loading…"))
      ])
    ]));
  }
}), ie = /* @__PURE__ */ C({
  __name: "PageRoot",
  setup(L) {
    const h = I(), f = O(), s = d("");
    P(() => h.value.route, (c) => {
      s.value = (c ?? "").split("/")[0];
    }, { immediate: !0 });
    function i(c) {
      s.value = c, f("navigate", c);
    }
    const l = E(() => s.value);
    return (c, p) => l.value ? (t(), b(U, {
      key: 0,
      id: l.value,
      back: "",
      onBack: p[0] || (p[0] = (y) => i(""))
    }, null, 8, ["id"])) : (t(), b(ce, {
      key: 1,
      onOpen: i
    }));
  }
}), $ = R(ie, { type: "object", properties: { route: { type: "string", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
async function ye() {
  return $;
}
j(import.meta.url, $);
export {
  ye as webComponent
};
