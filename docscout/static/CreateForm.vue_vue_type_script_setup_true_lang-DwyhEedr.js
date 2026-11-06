import { defineComponent as O, ref as m, openBlock as p, createElementBlock as f, withModifiers as S, createElementVNode as t, createTextVNode as g, createVNode as v, unref as o, toDisplayString as i, createCommentVNode as x } from "vue";
import T from "primevue/button";
import U from "primevue/inputtext";
import c from "primevue/textarea";
import { n as j, s as V, i as D, m as F } from "./config-mzfyYps4.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const I = { class: "create-summary" }, L = {
  key: 0,
  role: "alert",
  class: "error"
}, P = {
  key: 1,
  class: "row"
}, G = /* @__PURE__ */ O({
  __name: "CreateForm",
  props: {
    saving: { type: Boolean },
    error: {},
    inPopup: { type: Boolean }
  },
  emits: ["submit"],
  setup(r, { expose: y, emit: N }) {
    const s = j(), C = Object.keys(V).filter((l) => D(s, l)).map((l) => V[l]).join(", "), w = F(s.stages.extract.model), k = s.retrieval.search_mode.replace(/^\w/, (l) => l.toUpperCase()), B = r, E = N, n = m(""), u = m(""), a = m("");
    function b() {
      if (!B.saving) {
        if (!n.value.trim()) {
          a.value = "Name is required.";
          return;
        }
        a.value = "", E("submit", { title: n.value.trim(), description: u.value.trim() });
      }
    }
    return y({ submit: b }), (l, e) => (p(), f("form", {
      class: "create-pane",
      onSubmit: S(b, ["prevent"])
    }, [
      e[10] || (e[10] = t("header", null, [
        t("h2", null, "New extractor")
      ], -1)),
      t("label", null, [
        e[2] || (e[2] = g("Name", -1)),
        v(o(U), {
          modelValue: n.value,
          "onUpdate:modelValue": e[0] || (e[0] = (d) => n.value = d),
          autofocus: "",
          placeholder: "Invoice reader",
          maxlength: "200"
        }, null, 8, ["modelValue"])
      ]),
      t("label", null, [
        e[3] || (e[3] = g("Description", -1)),
        v(o(c), {
          modelValue: u.value,
          "onUpdate:modelValue": e[1] || (e[1] = (d) => u.value = d),
          rows: "3",
          placeholder: "Optional",
          maxlength: "4000"
        }, null, 8, ["modelValue"])
      ]),
      t("div", I, [
        e[9] || (e[9] = t("h2", null, "Configuration", -1)),
        t("dl", null, [
          e[4] || (e[4] = t("dt", null, "Fields", -1)),
          e[5] || (e[5] = t("dd", null, "None", -1)),
          e[6] || (e[6] = t("dt", null, "Reading steps", -1)),
          t("dd", null, i(o(C)), 1),
          e[7] || (e[7] = t("dt", null, "Extraction model", -1)),
          t("dd", null, i(o(w)), 1),
          e[8] || (e[8] = t("dt", null, "Search", -1)),
          t("dd", null, i(o(k)), 1)
        ])
      ]),
      r.error || a.value ? (p(), f("p", L, i(r.error || a.value), 1)) : x("", !0),
      r.inPopup ? x("", !0) : (p(), f("footer", P, [
        v(o(T), {
          label: "Create extractor",
          type: "submit",
          loading: r.saving,
          disabled: !n.value.trim()
        }, null, 8, ["loading", "disabled"])
      ]))
    ], 32));
  }
});
export {
  G as _
};
