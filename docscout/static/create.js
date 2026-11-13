import { defineComponent as l, ref as s, computed as f, watch as m, openBlock as d, createBlock as v } from "vue";
import "@iconify/vue";
import { define as g } from "@wippy-fe/proxy";
import "pinia";
import { P as _ } from "./primevue-plugin-UREsRVxx.js";
import { d as b } from "./element-vGzRkDdj.js";
import { u as h, a as y } from "./wc-runtime-DUvG5Zds.js";
import { c as w, n as C } from "./config-Y09Qqq2I.js";
import { _ as k } from "./CreateForm.vue_vue_type_script_setup_true_lang-rXh7a6Vh.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const E = /* @__PURE__ */ l({
  __name: "CreateRoot",
  setup(P) {
    const i = h(), n = y(), o = s(!1), r = s(""), p = s(), a = f(() => i.value.parentId);
    m(o, (t) => n("submit-state", { saving: t })), m(() => i.value.submitNonce, (t, e) => {
      t && t !== e && p.value?.submit();
    });
    async function c(t) {
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
      onSubmit: c
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), u = b({ rootComponent: E, plugins: [_] }, { type: "object", properties: { "parent-id": { type: "string", default: "", description: "Workspace folder the new extractor is placed in; empty places it at the root." }, "submit-nonce": { type: "string", default: "", description: "Changing value the host sets to submit the form from its own button." } } });
async function $() {
  return u;
}
g(import.meta.url, u);
export {
  $ as webComponent
};
