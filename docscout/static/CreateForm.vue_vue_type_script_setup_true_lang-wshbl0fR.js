import { defineComponent as B, ref as m, openBlock as p, createElementBlock as f, withModifiers as E, createElementVNode as l, createTextVNode as g, createVNode as v, unref as o, toDisplayString as i, createCommentVNode as x } from "vue";
import { n as S, b as U, m as D, e as F, f as L, s as P } from "./index-CmKPKov9.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const $ = { class: "create-summary" }, j = {
  key: 0,
  role: "alert",
  class: "error"
}, q = {
  key: 1,
  class: "row"
}, O = /* @__PURE__ */ B({
  __name: "CreateForm",
  props: {
    saving: { type: Boolean },
    error: {},
    inPopup: { type: Boolean }
  },
  emits: ["submit"],
  setup(r, { expose: w, emit: V }) {
    const s = S(), k = s.workflow.filter((t) => t.enabled).map((t) => U[t.kind]).join(", "), N = D(s.workflow.find((t) => t.kind === "extract")?.model), y = s.retrieval.search_mode.replace(/^\w/, (t) => t.toUpperCase()), C = r, c = V, n = m(""), u = m(""), a = m("");
    function b() {
      if (!C.saving) {
        if (!n.value.trim()) {
          a.value = "Name is required.";
          return;
        }
        a.value = "", c("submit", { title: n.value.trim(), description: u.value.trim() });
      }
    }
    return w({ submit: b }), (t, e) => (p(), f("form", {
      class: "create-pane",
      onSubmit: E(b, ["prevent"])
    }, [
      e[10] || (e[10] = l("header", null, [
        l("h2", null, "New extractor")
      ], -1)),
      l("label", null, [
        e[2] || (e[2] = g("Name", -1)),
        v(o(F), {
          modelValue: n.value,
          "onUpdate:modelValue": e[0] || (e[0] = (d) => n.value = d),
          autofocus: "",
          placeholder: "Invoice reader",
          maxlength: "200"
        }, null, 8, ["modelValue"])
      ]),
      l("label", null, [
        e[3] || (e[3] = g("Description", -1)),
        v(o(L), {
          modelValue: u.value,
          "onUpdate:modelValue": e[1] || (e[1] = (d) => u.value = d),
          rows: "3",
          placeholder: "Optional",
          maxlength: "4000"
        }, null, 8, ["modelValue"])
      ]),
      l("div", $, [
        e[9] || (e[9] = l("h2", null, "Configuration", -1)),
        l("dl", null, [
          e[4] || (e[4] = l("dt", null, "Fields", -1)),
          e[5] || (e[5] = l("dd", null, "None", -1)),
          e[6] || (e[6] = l("dt", null, "Reading steps", -1)),
          l("dd", null, i(o(k)), 1),
          e[7] || (e[7] = l("dt", null, "Extraction model", -1)),
          l("dd", null, i(o(N)), 1),
          e[8] || (e[8] = l("dt", null, "Search", -1)),
          l("dd", null, i(o(y)), 1)
        ])
      ]),
      r.error || a.value ? (p(), f("p", j, i(r.error || a.value), 1)) : x("", !0),
      r.inPopup ? x("", !0) : (p(), f("footer", q, [
        v(o(P), {
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
  O as _
};
