import { defineComponent as t, computed as r, openBlock as n, createBlock as p } from "vue";
import "@iconify/vue";
import { define as c } from "@wippy-fe/proxy";
import { u as i, d as s } from "./index-BKNQMwAG.js";
import { _ as m } from "./Extractor.vue_vue_type_script_setup_true_lang-BgXohDqf.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const a = /* @__PURE__ */ t({
  __name: "ManageRoot",
  setup(u) {
    const e = i(), o = r(() => e.value.entryId ?? "");
    return (l, _) => (n(), p(m, { id: o.value }, null, 8, ["id"]));
  }
}), d = s(a, { type: "object", properties: { "entry-id": { type: "string", description: "Selected component id supplied by the workspace." } } });
c(import.meta.url, d);
