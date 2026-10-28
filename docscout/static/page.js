import { defineComponent as E, ref as i, onMounted as B, computed as $, openBlock as o, createElementBlock as n, createElementVNode as r, toDisplayString as c, createCommentVNode as m, withDirectives as V, vModelText as F, createVNode as p, unref as _, Fragment as z, renderList as M, watch as P, createBlock as w } from "vue";
import { Icon as k } from "@iconify/vue";
import { define as j } from "@wippy-fe/proxy";
import { s as x, c as C, n as q, u as I, a as O, d as R } from "./index-BBnkhKOj.js";
import { _ as T } from "./CreateForm.vue_vue_type_script_setup_true_lang-CBNufO4T.js";
import { _ as U } from "./Extractor.vue_vue_type_script_setup_true_lang-DtuC8gVv.js";
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
}, le = { class: "card-meta" }, re = {
  key: 0,
  class: "empty"
}, ce = {
  key: 1,
  class: "muted"
}, ie = /* @__PURE__ */ E({
  __name: "ExtractorList",
  emits: ["open"],
  setup(L, { emit: h }) {
    const f = h, s = i(), v = i(!1), u = i(""), l = i(!1), d = i(!1), y = i(""), g = i("");
    async function N() {
      try {
        const t = await C.list();
        s.value = t.items, v.value = t.truncated, u.value = "";
      } catch (t) {
        u.value = t instanceof Error ? t.message : String(t);
      }
    }
    B(N);
    const b = $(() => {
      const t = g.value.trim().toLowerCase();
      return (s.value ?? []).filter((e) => !t || e.meta.title.toLowerCase().includes(t) || (e.meta.description ?? "").toLowerCase().includes(t));
    });
    async function S(t) {
      d.value = !0, y.value = "";
      try {
        const e = await C.create({ ...t, config: q() });
        l.value = !1, f("open", e.component_id);
      } catch (e) {
        y.value = e instanceof Error ? e.message : String(e);
      } finally {
        d.value = !1;
      }
    }
    const D = (t) => new Date(t).toLocaleDateString(void 0, { month: "short", day: "numeric" });
    return (t, e) => (o(), n("main", A, [
      r("div", G, [
        r("div", H, [
          e[4] || (e[4] = r("h1", null, "Docscout", -1)),
          s.value ? (o(), n("span", J, c(s.value.length), 1)) : m("", !0)
        ]),
        r("div", K, [
          s.value?.length ? V((o(), n("input", {
            key: 0,
            "onUpdate:modelValue": e[0] || (e[0] = (a) => g.value = a),
            class: "filter",
            type: "search",
            placeholder: "Filter extractors",
            "aria-label": "Filter extractors"
          }, null, 512)), [
            [F, g.value]
          ]) : m("", !0),
          p(_(x), {
            label: "New extractor",
            size: "small",
            onClick: e[1] || (e[1] = (a) => l.value = !0)
          })
        ])
      ]),
      r("div", Q, [
        l.value ? (o(), n("section", W, [
          p(T, {
            saving: d.value,
            error: y.value,
            onSubmit: S
          }, null, 8, ["saving", "error"]),
          r("button", {
            type: "button",
            class: "icon-btn create-close",
            "aria-label": "Cancel",
            onClick: e[2] || (e[2] = (a) => l.value = !1)
          }, [
            p(_(k), { icon: "tabler:x" })
          ])
        ])) : m("", !0),
        u.value ? (o(), n("p", X, c(u.value), 1)) : s.value ? !s.value.length && !l.value ? (o(), n("div", Z, [
          p(_(k), {
            icon: "tabler:file-search",
            class: "empty-icon"
          }),
          e[5] || (e[5] = r("p", null, "Create an extractor to pull typed fields from documents.", -1)),
          p(_(x), {
            label: "New extractor",
            size: "small",
            onClick: e[3] || (e[3] = (a) => l.value = !0)
          })
        ])) : (o(), n("div", ee, [
          (o(!0), n(z, null, M(b.value, (a) => (o(), n("button", {
            key: a.component_id,
            type: "button",
            class: "card",
            onClick: (me) => f("open", a.component_id)
          }, [
            r("span", oe, [
              p(_(k), { icon: "tabler:file-search" })
            ]),
            r("span", se, [
              r("span", ae, c(a.meta.title), 1),
              a.meta.description ? (o(), n("span", ne, c(a.meta.description), 1)) : m("", !0),
              r("span", le, c(a.meta.field_count ?? 0) + " " + c(a.meta.field_count === "1" ? "field" : "fields") + " · updated " + c(D(a.updated_at)), 1)
            ])
          ], 8, te))), 128)),
          s.value.length && !b.value.length ? (o(), n("p", re, "No extractors match.")) : m("", !0),
          v.value ? (o(), n("p", ce, "Showing the first " + c(s.value.length) + " extractors.", 1)) : m("", !0)
        ])) : (o(), n("p", Y, "Loading…"))
      ])
    ]));
  }
}), ue = /* @__PURE__ */ E({
  __name: "PageRoot",
  setup(L) {
    const h = I(), f = O(), s = i("");
    P(() => h.value.route, (l) => {
      s.value = (l ?? "").split("/")[0];
    }, { immediate: !0 });
    function v(l) {
      s.value = l, f("navigate", l);
    }
    const u = $(() => s.value);
    return (l, d) => u.value ? (o(), w(U, {
      key: 0,
      id: u.value,
      back: "",
      onBack: d[0] || (d[0] = (y) => v(""))
    }, null, 8, ["id"])) : (o(), w(ie, {
      key: 1,
      onOpen: v
    }));
  }
}), de = R(ue, { type: "object", properties: { route: { type: "string", default: "", description: "Sub-path under /docscout: empty for the list, an extractor id to open it." } } });
j(import.meta.url, de);
