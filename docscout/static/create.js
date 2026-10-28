import { defineComponent as l, ref as s, computed as f, watch as u, openBlock as v, createBlock as _ } from "vue";
import "@iconify/vue";
import { define as d } from "@wippy-fe/proxy";
import { u as g, a as y, c as b, n as w, d as C } from "./index-DC4KoVbP.js";
import { _ as E } from "./CreateForm.vue_vue_type_script_setup_true_lang-DgclropJ.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const h = /* @__PURE__ */ l({
  __name: "CreateRoot",
  setup(k) {
    const i = g(), o = y(), r = s(!1), n = s(""), c = s(), a = f(() => i.value.parentId);
    u(r, (t) => o("submit-state", { saving: t })), u(() => i.value.submitNonce, (t, e) => {
      t && t !== e && c.value?.submit();
    });
    async function m(t) {
      r.value = !0, n.value = "";
      try {
        const e = await b.create({ ...t, config: w(), ...a.value ? { parent_id: a.value } : {} });
        o("created", { id: e.component_id });
      } catch (e) {
        n.value = e instanceof Error ? e.message : String(e), o("error", { message: n.value, error: e });
      } finally {
        r.value = !1;
      }
    }
    return (t, e) => (v(), _(E, {
      ref_key: "form",
      ref: c,
      saving: r.value,
      error: n.value,
      "in-popup": !!a.value,
      onSubmit: m
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), p = C(h, { type: "object", properties: { "parent-id": { type: "string" }, "submit-nonce": { type: "string" } } });
async function N() {
  return p;
}
d(import.meta.url, p);
export {
  N as webComponent
};
