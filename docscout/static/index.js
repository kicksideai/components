import { defineComponent as o, computed as r, openBlock as n, createBlock as p } from "vue";
import "@iconify/vue";
import { define as s } from "@wippy-fe/proxy";
import { u as a, d as m } from "./index-BBnkhKOj.js";
import { _ as c } from "./Extractor.vue_vue_type_script_setup_true_lang-CnaV8A6l.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const i = /* @__PURE__ */ o({
  __name: "ManageRoot",
  setup(u) {
    const e = a(), t = r(() => e.value.entryId ?? "");
    return (f, l) => (n(), p(c, { id: t.value }, null, 8, ["id"]));
  }
}), d = m(i, { type: "object", properties: { "entry-id": { type: "string", default: "", description: "Id of the extractor component to manage, supplied by the workspace. Empty shows a message instead of an extractor." } } });
s(import.meta.url, d);
