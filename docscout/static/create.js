import { defineComponent as N, ref as u, openBlock as p, createElementBlock as f, withModifiers as C, createElementVNode as m, createTextVNode as y, createVNode as g, unref as b, createStaticVNode as E, toDisplayString as k, createCommentVNode as V, computed as S, watch as x, createBlock as h } from "vue";
import "@iconify/vue";
import { define as B } from "@wippy-fe/proxy";
import { s as D, a as P, b as I, u as $, c as F, d as M, n as R, e as U } from "./index-CzyJHWsI.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const j = {
  key: 0,
  role: "alert",
  class: "error"
}, q = {
  key: 1,
  class: "row"
}, H = /* @__PURE__ */ N({
  __name: "CreateForm",
  props: {
    saving: { type: Boolean },
    error: {},
    inPopup: { type: Boolean }
  },
  emits: ["submit"],
  setup(n, { expose: c, emit: d }) {
    const l = n, i = d, o = u(""), a = u(""), s = u("");
    function t() {
      if (!l.saving) {
        if (!o.value.trim()) {
          s.value = "Name is required.";
          return;
        }
        s.value = "", i("submit", { title: o.value.trim(), description: a.value.trim() });
      }
    }
    return c({ submit: t }), (r, e) => (p(), f("form", {
      class: "create-pane",
      onSubmit: C(t, ["prevent"])
    }, [
      e[4] || (e[4] = m("header", null, [
        m("div", { class: "eyebrow" }, "Docscout"),
        m("h1", null, "New extractor")
      ], -1)),
      m("label", null, [
        e[2] || (e[2] = y("Name", -1)),
        g(b(D), {
          modelValue: o.value,
          "onUpdate:modelValue": e[0] || (e[0] = (v) => o.value = v),
          autofocus: "",
          placeholder: "Invoice reader",
          maxlength: "200"
        }, null, 8, ["modelValue"])
      ]),
      m("label", null, [
        e[3] || (e[3] = y("Description", -1)),
        g(b(P), {
          modelValue: a.value,
          "onUpdate:modelValue": e[1] || (e[1] = (v) => a.value = v),
          rows: "3",
          placeholder: "Optional",
          maxlength: "4000"
        }, null, 8, ["modelValue"])
      ]),
      e[5] || (e[5] = E('<div class="create-summary"><h2>Configuration</h2><dl><dt>Fields</dt><dd>None</dd><dt>Reading steps</dt><dd>Map, prefetch, scout, deep analysis, extract, verify</dd><dt>Extraction model</dt><dd>Premium</dd><dt>Search</dt><dd>Hybrid</dd></dl></div>', 1)),
      n.error || s.value ? (p(), f("p", j, k(n.error || s.value), 1)) : V("", !0),
      n.inPopup ? V("", !0) : (p(), f("footer", q, [
        g(b(I), {
          label: "Create Docscout",
          type: "submit",
          loading: n.saving,
          disabled: !o.value.trim()
        }, null, 8, ["loading", "disabled"])
      ]))
    ], 32));
  }
}), O = /* @__PURE__ */ N({
  __name: "CreateRoot",
  setup(n) {
    const c = $(), d = F(), l = u(!1), i = u(""), o = u(), a = S(() => c.value.parentId);
    x(l, (t) => d("submit-state", { saving: t })), x(() => c.value.submitNonce, (t, r) => {
      t && t !== r && o.value?.submit();
    });
    async function s(t) {
      l.value = !0, i.value = "";
      try {
        const r = await M.create({ ...t, config: R(), ...a.value ? { parent_id: a.value } : {} });
        d("created", { id: r.component_id });
      } catch (r) {
        i.value = r instanceof Error ? r.message : String(r), d("error", { message: i.value, error: r });
      } finally {
        l.value = !1;
      }
    }
    return (t, r) => (p(), h(H, {
      ref_key: "form",
      ref: o,
      saving: l.value,
      error: i.value,
      "in-popup": !!a.value,
      onSubmit: s
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), w = U(O, { type: "object", properties: { "parent-id": { type: "string" }, "submit-nonce": { type: "string" } } });
async function G() {
  return w;
}
B(import.meta.url, w);
export {
  G as webComponent
};
