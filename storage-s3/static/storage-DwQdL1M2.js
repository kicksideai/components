import { defineComponent as F, ref as u, computed as h, watch as T, onMounted as z, openBlock as o, createElementBlock as f, createElementVNode as i, createBlock as g, unref as r, withCtx as E, createTextVNode as N, toDisplayString as M, createCommentVNode as n, withModifiers as A, createVNode as c, Fragment as J } from "vue";
import b from "primevue/button";
import U from "primevue/select";
import K from "primevue/inputtext";
import B from "primevue/message";
import { api as k } from "@wippy-fe/proxy";
function R(v) {
  const l = v?.response?.data;
  return typeof l?.error == "string" && l.error ? l.error : v instanceof Error && v.message ? v.message : "Storage request failed";
}
const O = {
  class: "storage-s3",
  "aria-labelledby": "storage-s3-title"
}, P = {
  key: 2,
  role: "status"
}, I = { key: 0 }, L = { class: "storage-s3-actions" }, W = /* @__PURE__ */ F({
  __name: "storage",
  setup(v) {
    const l = u({ mode: "local", resource_id: "", prefix: "uploads" }), m = u([]), y = u(!0), S = u(!1), t = u(!1), d = u(""), p = u("");
    let V = "";
    const $ = [{ label: "Keep processed files locally", value: "local" }, { label: "Move processed files to S3", value: "s3" }], q = h(() => JSON.stringify(l.value) !== V), C = h(() => l.value.mode === "local" || m.value.some((a) => a.id === l.value.resource_id) && l.value.prefix.length > 0 && l.value.prefix.length <= 256 && l.value.prefix.split("/").every((a) => a !== "" && a !== "." && a !== "..") && /^[a-zA-Z0-9_/.\-]+$/.test(l.value.prefix));
    T(l, () => {
      p.value = "";
    }, { deep: !0 });
    async function x() {
      y.value = !0, d.value = "";
      try {
        const [a, e] = await Promise.all([
          k.get("/api/v1/settings?namespace=kickside.storage_s3"),
          k.get("/api/v1/storage-s3")
        ]);
        if (!a.data?.success) throw new Error(a.data?.error || "Could not load the storage policy");
        if (!e.data?.success) throw new Error(e.data?.error || "Could not load destinations");
        const s = a.data.settings?.find((D) => D.key === "policy")?.value;
        return l.value = s ? { ...s } : { mode: "local", resource_id: "", prefix: "uploads" }, m.value = e.data.resources || [], V = JSON.stringify(l.value), S.value = !0, !0;
      } catch (a) {
        return d.value = R(a), !1;
      } finally {
        y.value = !1;
      }
    }
    async function w(a) {
      t.value = !0, d.value = "", p.value = "";
      try {
        const e = a === "reset" ? await k.delete("/api/v1/storage-s3") : await k.post(a === "test" ? "/api/v1/storage-s3/test" : "/api/v1/storage-s3", { ...l.value });
        if (!e.data?.success) throw new Error(e.data?.error || "Storage request failed");
        if (a !== "test" && !await x()) return;
        p.value = a === "test" ? "Upload, size verification, and deletion succeeded." : a === "reset" ? "Future file placement is disabled. Existing S3 files remain readable." : "Storage policy saved.";
      } catch (e) {
        d.value = R(e);
      } finally {
        t.value = !1;
      }
    }
    return z(x), (a, e) => (o(), f("main", O, [
      e[11] || (e[11] = i("header", null, [
        i("h2", { id: "storage-s3-title" }, "S3 storage"),
        i("p", null, "Move original files and their derived content to private S3 storage after processing. Attachments and Knowledge references keep their existing addresses.")
      ], -1)),
      d.value ? (o(), g(r(B), {
        key: 0,
        severity: "error",
        closable: !1,
        role: "alert"
      }, {
        default: E(() => [
          N(M(d.value), 1)
        ]),
        _: 1
      })) : n("", !0),
      p.value ? (o(), g(r(B), {
        key: 1,
        severity: "success",
        closable: !1,
        role: "status"
      }, {
        default: E(() => [
          N(M(p.value), 1)
        ]),
        _: 1
      })) : n("", !0),
      y.value ? (o(), f("p", P, "Loading storage settings…")) : S.value ? (o(), f("form", {
        key: 3,
        onSubmit: e[5] || (e[5] = A((s) => w("save"), ["prevent"]))
      }, [
        e[9] || (e[9] = i("label", { id: "storage-s3-mode-label" }, "Processed file storage", -1)),
        c(r(U), {
          modelValue: l.value.mode,
          "onUpdate:modelValue": e[0] || (e[0] = (s) => l.value.mode = s),
          options: $,
          "option-label": "label",
          "option-value": "value",
          "aria-labelledby": "storage-s3-mode-label",
          disabled: t.value
        }, null, 8, ["modelValue", "disabled"]),
        l.value.mode === "s3" ? (o(), f(J, { key: 0 }, [
          e[6] || (e[6] = i("label", { id: "storage-s3-destination-label" }, "Destination", -1)),
          c(r(U), {
            modelValue: l.value.resource_id,
            "onUpdate:modelValue": e[1] || (e[1] = (s) => l.value.resource_id = s),
            options: m.value,
            "option-label": "title",
            "option-value": "id",
            placeholder: "Select a configured destination",
            "aria-labelledby": "storage-s3-destination-label",
            disabled: t.value
          }, null, 8, ["modelValue", "options", "disabled"]),
          m.value.length ? n("", !0) : (o(), f("p", I, "No S3 destination is declared by this host.")),
          e[7] || (e[7] = i("label", { for: "storage-s3-prefix" }, "Folder prefix", -1)),
          c(r(K), {
            id: "storage-s3-prefix",
            modelValue: l.value.prefix,
            "onUpdate:modelValue": e[2] || (e[2] = (s) => l.value.prefix = s),
            disabled: t.value,
            maxlength: "256",
            "aria-describedby": "storage-s3-prefix-help"
          }, null, 8, ["modelValue", "disabled"]),
          e[8] || (e[8] = i("small", { id: "storage-s3-prefix-help" }, "Use a relative folder path, such as uploads or processed/files.", -1))
        ], 64)) : n("", !0),
        e[10] || (e[10] = i("p", null, "Changes apply to future processing. Disabling placement keeps existing files at their saved destinations.", -1)),
        i("div", L, [
          l.value.mode === "s3" ? (o(), g(r(b), {
            key: 0,
            type: "button",
            label: "Test storage",
            severity: "secondary",
            disabled: t.value || !C.value,
            onClick: e[3] || (e[3] = (s) => w("test"))
          }, null, 8, ["disabled"])) : n("", !0),
          c(r(b), {
            type: "submit",
            label: "Save",
            loading: t.value,
            disabled: t.value || !q.value || !C.value
          }, null, 8, ["loading", "disabled"]),
          c(r(b), {
            type: "button",
            label: "Reset to local storage",
            severity: "secondary",
            disabled: t.value,
            onClick: e[4] || (e[4] = (s) => w("reset"))
          }, null, 8, ["disabled"]),
          d.value ? (o(), g(r(b), {
            key: 1,
            type: "button",
            label: "Reload",
            severity: "secondary",
            disabled: t.value,
            onClick: x
          }, null, 8, ["disabled"])) : n("", !0)
        ])
      ], 32)) : n("", !0),
      d.value && !S.value ? (o(), g(r(b), {
        key: 4,
        label: "Reload",
        severity: "secondary",
        disabled: t.value || y.value,
        onClick: x
      }, null, 8, ["disabled"])) : n("", !0)
    ]));
  }
});
export {
  W as default
};
