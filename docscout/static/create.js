import { defineComponent as l, ref as s, computed as f, watch as c, openBlock as d, createBlock as v } from "vue";
import { u as g, a as _, P as b } from "./wc-runtime-CBjtO5xN.js";
import { d as h } from "./element-BJNC4XNO.js";
import { c as y, n as w } from "./index-c2UiBMav.js";
import { _ as C } from "./CreateForm.vue_vue_type_script_setup_true_lang-Wes4bQWB.js";
import { define as k } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const E = /* @__PURE__ */ l({
  __name: "CreateRoot",
  setup(P) {
    const i = g(), n = _(), o = s(!1), r = s(""), u = s(), a = f(() => i.value.parentId);
    c(o, (t) => n("submit-state", { saving: t })), c(() => i.value.submitNonce, (t, e) => {
      t && t !== e && u.value?.submit();
    });
    async function m(t) {
      o.value = !0, r.value = "";
      try {
        const e = await y.create({ ...t, config: w(), ...a.value ? { parent_id: a.value } : {} });
        n("created", { id: e.component_id });
      } catch (e) {
        r.value = e instanceof Error ? e.message : String(e), n("error", { message: r.value, error: e });
      } finally {
        o.value = !1;
      }
    }
    return (t, e) => (d(), v(C, {
      ref_key: "form",
      ref: u,
      saving: o.value,
      error: r.value,
      "in-popup": !!a.value,
      onSubmit: m
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), p = h({ rootComponent: E, plugins: [b] }, { type: "object", properties: { "parent-id": { type: "string", default: "", description: "Workspace folder the new extractor is placed in; empty places it at the root." }, "submit-nonce": { type: "string", default: "", description: "Changing value the host sets to submit the form from its own button." } } });
async function R() {
  return p;
}
k(import.meta.url, p);
export {
  R as webComponent
};
