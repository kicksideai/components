import { defineComponent as m, ref as s, computed as l, watch as u, openBlock as f, createBlock as d } from "vue";
import "@iconify/vue";
import { define as v } from "@wippy-fe/proxy";
import { u as _, a as g, c as h, n as b, d as y } from "./index-BKNQMwAG.js";
import { _ as w } from "./CreateForm.vue_vue_type_script_setup_true_lang-Cltbce0S.js";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const k = /* @__PURE__ */ m({
  __name: "CreateRoot",
  setup(E) {
    const i = _(), a = g(), r = s(!1), o = s(""), c = s(), n = l(() => i.value.parentId);
    u(r, (t) => a("submit-state", { saving: t })), u(() => i.value.submitNonce, (t, e) => {
      t && t !== e && c.value?.submit();
    });
    async function p(t) {
      r.value = !0, o.value = "";
      try {
        const e = await h.create({ ...t, config: b(), ...n.value ? { parent_id: n.value } : {} });
        a("created", { id: e.component_id });
      } catch (e) {
        o.value = e instanceof Error ? e.message : String(e), a("error", { message: o.value, error: e });
      } finally {
        r.value = !1;
      }
    }
    return (t, e) => (f(), d(w, {
      ref_key: "form",
      ref: c,
      saving: r.value,
      error: o.value,
      "in-popup": !!n.value,
      onSubmit: p
    }, null, 8, ["saving", "error", "in-popup"]));
  }
}), C = y(k, { type: "object", properties: { "parent-id": { type: "string", default: "", description: "Workspace folder the new extractor is placed in; empty places it at the root." }, "submit-nonce": { type: "string", default: "", description: "Changing value the host sets to submit the form from its own button." } } });
v(import.meta.url, C);
