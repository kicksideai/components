import { defineComponent as C, ref as d, onMounted as D, computed as E, openBlock as t, createElementBlock as n, createElementVNode as r, toDisplayString as u, createCommentVNode as v, withDirectives as B, vModelText as V, createVNode as m, unref as _, Fragment as F, renderList as z, watch as M, createBlock as b } from "vue";
import { Icon as g } from "@iconify/vue";
import { define as P } from "@wippy-fe/proxy";
import { s as w, c as x, n as j, u as q, a as I, d as O } from "./index-DmncycM2.js";
import { _ as R } from "./CreateForm.vue_vue_type_script_setup_true_lang-Mxo3BdIE.js";
import { _ as T } from "./Extractor.vue_vue_type_script_setup_true_lang-CwtlFikD.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const U = { class: "docscout list-page" }, A = { class: "toolbar" }, G = { class: "toolbar-title" }, H = {
  key: 0,
  class: "count"
}, J = { class: "toolbar-side" }, K = { class: "page-body" }, Q = {
  key: 0,
  class: "create-card",
  "aria-label": "New extractor"
}, W = {
  key: 1,
  class: "error",
  role: "alert"
}, X = {
  key: 2,
  class: "empty",
  role: "status"
}, Y = {
  key: 3,
  class: "empty-state"
}, Z = {
  key: 4,
  class: "cards"
}, ee = ["onClick"], te = { class: "card-icon" }, oe = { class: "card-main" }, se = { class: "card-title" }, ae = {
  key: 0,
  class: "card-desc"
}, ne = { class: "card-meta" }, re = {
  key: 0,
  class: "empty"
}, le = /* @__PURE__ */ C({
  __name: "ExtractorList",
  emits: ["open"],
  setup($, { emit: h }) {
    const f = h, s = d(), i = d(""), l = d(!1), c = d(!1), p = d(""), y = d("");
    async function L() {
      try {
        s.value = await x.list(), i.value = "";
      } catch (a) {
        i.value = a instanceof Error ? a.message : String(a);
      }
    }
    D(L);
    const k = E(() => {
      const a = y.value.trim().toLowerCase();
      return (s.value ?? []).filter((e) => !a || e.meta.title.toLowerCase().includes(a) || (e.meta.description ?? "").toLowerCase().includes(a));
    });
    async function N(a) {
      c.value = !0, p.value = "";
      try {
        const e = await x.create({ ...a, config: j() });
        l.value = !1, f("open", e.component_id);
      } catch (e) {
        p.value = e instanceof Error ? e.message : String(e);
      } finally {
        c.value = !1;
      }
    }
    const S = (a) => new Date(a).toLocaleDateString(void 0, { month: "short", day: "numeric" });
    return (a, e) => (t(), n("main", U, [
      r("div", A, [
        r("div", G, [
          e[4] || (e[4] = r("h1", null, "Docscout", -1)),
          s.value ? (t(), n("span", H, u(s.value.length), 1)) : v("", !0)
        ]),
        r("div", J, [
          s.value?.length ? B((t(), n("input", {
            key: 0,
            "onUpdate:modelValue": e[0] || (e[0] = (o) => y.value = o),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512)), [
            [V, y.value]
          ]) : v("", !0),
          m(_(w), {
            label: "New extractor",
            size: "small",
            onClick: e[1] || (e[1] = (o) => l.value = !0)
          })
        ])
      ]),
      r("div", K, [
        l.value ? (t(), n("section", Q, [
          m(R, {
            saving: c.value,
            error: p.value,
            onSubmit: N
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
        i.value ? (t(), n("p", W, u(i.value), 1)) : s.value ? !s.value.length && !l.value ? (t(), n("div", Y, [
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
        ])) : (t(), n("div", Z, [
          (t(!0), n(F, null, z(k.value, (o) => (t(), n("button", {
            key: o.component_id,
            type: "button",
            class: "card",
            onClick: (ue) => f("open", o.component_id)
          }, [
            r("span", te, [
              m(_(g), { icon: "tabler:file-search" })
            ]),
            r("span", oe, [
              r("span", se, u(o.meta.title), 1),
              o.meta.description ? (t(), n("span", ae, u(o.meta.description), 1)) : v("", !0),
              r("span", ne, u(o.meta.field_count ?? 0) + " " + u(o.meta.field_count === "1" ? "field" : "fields") + " · updated " + u(S(o.updated_at)), 1)
            ])
          ], 8, ee))), 128)),
          s.value.length && !k.value.length ? (t(), n("p", re, "No extractors match.")) : v("", !0)
        ])) : (t(), n("p", X, "Loading…"))
      ])
    ]));
  }
}), ce = /* @__PURE__ */ C({
  __name: "PageRoot",
  setup($) {
    const h = q(), f = I(), s = d("");
    M(() => h.value.route, (c) => {
      s.value = (c ?? "").split("/")[0];
    }, { immediate: !0 });
    function i(c) {
      s.value = c, f("navigate", c);
    }
    const l = E(() => s.value);
    return (c, p) => l.value ? (t(), b(T, {
      key: 0,
      id: l.value,
      back: "",
      onBack: p[0] || (p[0] = (y) => i(""))
    }, null, 8, ["id"])) : (t(), b(le, {
      key: 1,
      onOpen: i
    }));
  }
}), ie = O(ce, { type: "object", properties: { route: { type: "string", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
P(import.meta.url, ie);
