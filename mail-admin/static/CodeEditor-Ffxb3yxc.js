import { defineComponent as i, ref as c, onMounted as m, onBeforeUnmount as u, watch as f, openBlock as p, createElementBlock as y, normalizeClass as h } from "vue";
import { c as C, r as V, i as _ } from "./codemirror-AyaUW9O0.js";
const b = /* @__PURE__ */ i({
  __name: "CodeEditor",
  props: {
    modelValue: {},
    label: {},
    readOnly: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(r, { expose: n, emit: s }) {
    const t = r, d = s, a = c();
    let o;
    return m(() => {
      const e = a.value;
      e && (o = C({
        doc: t.modelValue,
        label: t.label,
        readOnly: !!t.readOnly,
        root: e.getRootNode(),
        parent: e,
        onChange: (l) => d("update:modelValue", l)
      }));
    }), u(() => o?.destroy()), f(() => t.modelValue, (e) => {
      o && V(o, e);
    }), n({
      insert(e) {
        o && _(o, e);
      },
      focus() {
        o?.focus();
      }
    }), (e, l) => (p(), y("div", {
      ref_key: "host",
      ref: a,
      class: h(["mail-editor", { "mail-editor-readonly": r.readOnly }])
    }, null, 2));
  }
});
export {
  b as default
};
//# sourceMappingURL=CodeEditor-Ffxb3yxc.js.map
