import { defineComponent as l, ref as s, computed as f, watch as u, openBlock as d, createBlock as v } from "vue";
import "@iconify/vue";
import { define as g } from "@wippy-fe/proxy";
import { u as _, a as b, P as h } from "./wc-runtime-CWPiLYui.js";
import { d as y } from "./element-CSPa56BT.js";
import { c as w, n as C } from "./index-DsWOWvnx.js";
import { _ as k } from "./CreateForm.vue_vue_type_script_setup_true_lang-eLkqoebJ.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const E = /* @__PURE__ */ l({
  __name: "CreateRoot",
  setup(P) {
    const i = _(), n = b(), o = s(!1), r = s(""), p = s(), a = f(() => i.value.parentId);
    u(o, (t) => n("submit-state", { saving: t })), u(() => i.value.submitNonce, (t, e) => {
      t && t !== e && p.value?.submit();
    });
    async function m(t) {
      o.value = !0, r.value = "";
      try {
        const e = await w.create({ ...t, config: C(), ...a.value ? { parent_id: a.value } : {} });
        n("created", { id: e.component_id });
      } catch (e) {
        r.value = e instanceof Error ? e.message : String(e), n("error", { message: r.value, error: e });
      } finally {
        o.value = !1;
      }
    }
    return (t, e) => (d(), v(k, {
      ref_key: "form",
      ref: p,
      saving: o.value,
      error: r.value,
      "in-popup": !!a.value,
      onSubmit: m
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), c = y({ rootComponent: E, plugins: [h] }, { type: "object", properties: { "parent-id": { type: "string", default: "", description: "Workspace folder the new extractor is placed in; empty places it at the root." }, "submit-nonce": { type: "string", default: "", description: "Changing value the host sets to submit the form from its own button." } } });
async function V() {
  return c;
}
g(import.meta.url, c);
export {
  V as webComponent
};
