import { defineComponent as n, computed as r, openBlock as p, createBlock as c } from "vue";
import "@iconify/vue";
import { define as i } from "@wippy-fe/proxy";
import { u as s, d as m } from "./index-DC4KoVbP.js";
import { _ as a } from "./Extractor.vue_vue_type_script_setup_true_lang-DHvf5FOR.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const d = /* @__PURE__ */ n({
  __name: "ManageRoot",
  setup(u) {
    const o = s(), t = r(() => o.value.entryId ?? "");
    return (l, _) => (p(), c(a, { id: t.value }, null, 8, ["id"]));
  }
}), e = m(d, { type: "object", properties: { "entry-id": { type: "string", description: "Selected component id supplied by the workspace." } } });
async function h() {
  return e;
}
i(import.meta.url, e);
export {
  h as webComponent
};
