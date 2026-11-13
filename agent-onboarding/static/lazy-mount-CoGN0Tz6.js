import le from "primevue/config";
import ce from "primevue/contextmenu";
import ue from "primevue/menu";
import de from "primevue/portal";
import { renderSlot as j, createCommentVNode as x, h as pe, Teleport as me, defineComponent as fe, ref as c, computed as w, onMounted as he, openBlock as p, createElementBlock as h, createElementVNode as n, toDisplayString as V, createVNode as m, unref as f, createBlock as ye, resolveDynamicComponent as ve, withModifiers as $ } from "vue";
import b from "primevue/button";
import ge from "primevue/inputtext";
import be from "primevue/checkbox";
import { Icon as z } from "@iconify/vue";
import { loadByTagName as B, api as P } from "@wippy-fe/proxy";
import { u as ke } from "./wc-runtime-DZZltuMO.js";
const we = "data-wippy-overlay-layer";
function ee() {
  return typeof window < "u" && typeof window.document < "u";
}
function te() {
  return ee() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function Ce() {
  return te() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const _e = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Le = 0;
const A = /* @__PURE__ */ new WeakMap();
function W(e, t) {
  const s = e.style;
  s.setProperty("position", "fixed", "important"), s.setProperty("inset", "auto", "important"), s.setProperty("margin", "0", "important"), s.setProperty("position-anchor", t), s.setProperty("position-area", "bottom span-right"), s.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), s.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), s.setProperty("max-width", "stretch", "important");
}
function Te(e, t) {
  if (!_e.test(e.className))
    return;
  const s = e.style.cssText;
  W(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = s;
    return;
  }
  if (!A.has(e)) {
    const l = new MutationObserver(() => {
      const i = e.style;
      (i.top !== "auto" || i.left !== "auto" || i.margin !== "0px" || i.getPropertyPriority("top") !== "important" || i.getPropertyPriority("left") !== "important" || i.getPropertyPriority("margin") !== "important" || i.getPropertyPriority("min-width") !== "important" || i.maxWidth !== "stretch" || i.getPropertyPriority("max-width") !== "important") && W(e, t);
    });
    l.observe(e, { attributes: !0, attributeFilter: ["style"] }), A.set(e, l);
  }
}
function I(e) {
  const t = A.get(e);
  t && (t.disconnect(), A.delete(e));
}
function Se(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function D(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const E = /* @__PURE__ */ new Set(), F = /* @__PURE__ */ new WeakMap();
let q = !1, H = !1;
function Pe() {
  H = !1;
  for (const e of E) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && I(t);
      E.delete(e), F.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && D(e);
  }
}
function J() {
  H || (H = !0, requestAnimationFrame(Pe));
}
function xe(e) {
  const t = document.createElement("div");
  t.setAttribute(we, "");
  const s = te();
  if (t.style.cssText = s ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", s && t.setAttribute("popover", "manual"), e.appendChild(t), s) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  D(t);
  const l = new MutationObserver((i) => {
    const v = t.__wippyAnchorName;
    for (const y of i) {
      if (v)
        for (const d of Array.from(y.addedNodes))
          d instanceof HTMLElement && Te(d, v);
      for (const d of Array.from(y.removedNodes))
        d instanceof HTMLElement && I(d);
    }
    t.isConnected && t.childElementCount > 0 && D(t);
  });
  return l.observe(t, { childList: !0 }), F.set(t, l), E.add(t), q || (q = !0, window.addEventListener("scroll", J, { capture: !0, passive: !0 }), window.addEventListener("resize", J, { passive: !0 })), t;
}
function X(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = xe(e.hostRoot), Ce())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Le}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function G(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && I(t);
    E.delete(e.layer), F.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let K = !1;
function Ae() {
  if (K)
    return;
  const e = ue;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const s = t.composedPath(), l = this.container && !s.includes(this.container), i = !(this.target && s.includes(this.target));
      this.overlayVisible && l && i ? this.hide() : !this.popup && l && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, K = !0);
}
let Q = !1;
function Ee() {
  if (Q)
    return;
  const e = ce;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const s = t.composedPath(), l = this.container && !s.includes(this.container), i = this.visible ? !(this.target && s.includes(this.target)) : !0;
      l && i && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, Q = !0);
}
let Z = !1;
function Oe() {
  if (Z)
    return;
  Z = !0;
  const e = de;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    ee() && (this.hostRoot = Se(this.$el), this.mounted = !0, this.hostRoot && (this.inline || X(this), this.$watch("inline", (t) => {
      t ? G(this) : X(this);
    })));
  }, e.render = function() {
    return this.inline ? j(this.$slots, "default", { key: 0 }) : this.mounted ? pe(me, { key: 1, to: this.resolvedTarget || document.body }, [
      j(this.$slots, "default")
    ]) : x("", !0);
  }, e.unmounted = function() {
    G(this);
  };
}
const Me = {
  install: (e) => {
    Ae(), Ee(), Oe(), e.use(le, { theme: "none" });
  }
}, Re = { class: "onboarding" }, Ne = {
  key: 0,
  class: "status",
  role: "status"
}, Ve = {
  key: 1,
  class: "stack"
}, $e = {
  class: "error",
  role: "alert"
}, Be = { class: "actions" }, De = {
  key: 2,
  class: "model-setup",
  "aria-labelledby": "model-setup-title"
}, He = { class: "head" }, Ie = {
  class: "head-icon",
  "aria-hidden": "true"
}, Fe = {
  key: 0,
  class: "error",
  role: "alert"
}, Ye = { class: "actions" }, Ue = {
  key: 3,
  class: "stack",
  "aria-labelledby": "model-config-title"
}, je = { class: "head" }, ze = {
  class: "head-icon",
  "aria-hidden": "true"
}, We = ["disabled"], qe = { class: "field-row" }, Je = { class: "field" }, Xe = { class: "field" }, Ge = ["value"], Ke = {
  key: 0,
  class: "hint"
}, Qe = { class: "field" }, Ze = { class: "memory-choice" }, et = ["value"], tt = {
  key: 0,
  class: "error",
  role: "alert"
}, ot = { class: "actions" }, nt = "My Assistant", it = /* @__PURE__ */ fe({
  __name: "Onboarding",
  setup(e) {
    const t = ke(), s = ["kickside.agents.traits:trait_master", "kickside.agents.traits:artifacts", "kickside.uploads.traits:file_manager"], l = c(nt), i = c(""), v = c(!0), y = c({ traits: [...s], trait_contexts: { "kickside.agents.traits:trait_master": { inject_trait_catalog: !0 } } }), d = c(!0), C = c(!1), g = c(!1), u = c(""), k = c(""), _ = c([]), O = c([]), Y = w(() => O.value.includes("class:fast")), oe = w(() => _.value.length > 0), L = c(!1), ne = w(() => i.value ? _.value.includes(i.value) || O.value.includes(i.value) : Y.value), U = w(() => C.value && !d.value && !g.value && !!l.value.trim() && ne.value), T = w(() => d.value ? "loading" : C.value ? L.value ? "configuring" : oe.value ? "create" : "model-setup" : "failed");
    function M(r) {
      const o = r;
      return o?.response?.data?.error || o?.message || String(r);
    }
    function ie(r) {
      const o = r.detail;
      y.value = { traits: [...o.traits], trait_contexts: { ...o.trait_contexts } };
    }
    function R() {
      t("done", { status: "skipped" });
    }
    async function N() {
      d.value = !0, C.value = !1, u.value = "";
      try {
        await Promise.all([
          B("wc-model-picker", { timeoutMs: 8e3 }),
          B("wc-agent-trait-picker", { timeoutMs: 8e3 })
        ]);
        const [r, o] = await Promise.all([
          P.get("/api/v1/models/list?capability=generate"),
          P.get("/api/v1/models/classes")
        ]);
        if (r.data?.success !== !0 || o.data?.success !== !0) throw new Error("Could not check model configuration.");
        _.value = r.data.models.map((a) => a.name), O.value = o.data.classes.filter((a) => a.models.length > 0 && _.value.includes(a.models[0].name)).map((a) => `class:${a.name}`), C.value = !0;
      } catch (r) {
        u.value = M(r);
      } finally {
        d.value = !1;
      }
    }
    async function se() {
      u.value = "";
      try {
        await B("kickside-onboard-models", { timeoutMs: 8e3 }), L.value = !0;
      } catch (r) {
        u.value = M(r);
      }
    }
    async function ae() {
      L.value = !1, await N();
    }
    async function re() {
      if (U.value) {
        g.value = !0, u.value = "";
        try {
          if (!k.value) {
            const a = { title: l.value.trim(), memory: v.value };
            i.value && (a.model = i.value), y.value.traits.length && (a.traits = [...y.value.traits], a.trait_contexts = { ...y.value.trait_contexts });
            const { data: S } = await P.post("/api/v1/agent-onboarding/agents", a);
            if (S?.success !== !0 || !S.component_id) throw new Error(S?.error || "Could not create your agent.");
            k.value = S.component_id;
          }
          const { data: r } = await P.get("/api/v1/agents/list");
          if (r?.success !== !0) throw new Error(r?.error || "Could not open your agent.");
          const o = r.agents.find((a) => a.name === `user_agent:${k.value}`);
          if (!o?.start_token) throw new Error("Your agent is created. Chat is unavailable; retry to open it.");
          t("navigate", { path: "/sessions", startToken: o.start_token });
        } catch (r) {
          u.value = M(r);
        } finally {
          g.value = !1;
        }
      }
    }
    return he(N), (r, o) => (p(), h("div", Re, [
      T.value === "loading" ? (p(), h("p", Ne, "Loading your choices…")) : T.value === "failed" ? (p(), h("div", Ve, [
        n("p", $e, V(u.value), 1),
        n("div", Be, [
          m(f(b), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            onClick: R
          }),
          m(f(b), {
            type: "button",
            label: "Retry",
            onClick: N
          })
        ])
      ])) : T.value === "model-setup" ? (p(), h("section", De, [
        n("header", He, [
          n("span", Ie, [
            m(f(z), { icon: "tabler:cpu" })
          ]),
          o[4] || (o[4] = n("h2", {
            id: "model-setup-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        o[5] || (o[5] = n("p", { class: "text" }, "Agents need a language model to respond, and none is connected to this workspace yet. Connect a model provider to continue, or ask an administrator if you do not manage models.", -1)),
        u.value ? (p(), h("p", Fe, V(u.value), 1)) : x("", !0),
        n("div", Ye, [
          m(f(b), {
            type: "button",
            "data-dismiss": "",
            label: "Cancel",
            severity: "secondary",
            onClick: R
          }),
          m(f(b), {
            type: "button",
            label: "Set up a model",
            onClick: se
          })
        ])
      ])) : T.value === "configuring" ? (p(), h("section", Ue, [
        n("header", je, [
          n("span", ze, [
            m(f(z), { icon: "tabler:cpu" })
          ]),
          o[6] || (o[6] = n("h2", {
            id: "model-config-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        (p(), ye(ve("kickside-onboard-models"), {
          class: "model-config",
          onDone: $(ae, ["stop"]),
          onBack: o[0] || (o[0] = $((a) => L.value = !1, ["stop"]))
        }, null, 32))
      ])) : (p(), h("form", {
        key: 4,
        class: "stack",
        "aria-labelledby": "create-agent-title",
        onSubmit: $(re, ["prevent"])
      }, [
        o[11] || (o[11] = n("h2", {
          id: "create-agent-title",
          class: "title"
        }, "Create your first agent", -1)),
        o[12] || (o[12] = n("p", { class: "intro" }, "Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.", -1)),
        n("fieldset", {
          disabled: g.value || !!k.value
        }, [
          n("div", qe, [
            n("div", Je, [
              o[7] || (o[7] = n("label", { for: "first-agent-title" }, "Agent name", -1)),
              m(f(ge), {
                id: "first-agent-title",
                modelValue: l.value,
                "onUpdate:modelValue": o[1] || (o[1] = (a) => l.value = a),
                name: "title",
                autocomplete: "off",
                maxlength: "120",
                fluid: ""
              }, null, 8, ["modelValue"])
            ]),
            n("div", Xe, [
              o[8] || (o[8] = n("span", {
                id: "first-agent-model",
                class: "label"
              }, "Model", -1)),
              n("wc-model-picker", {
                value: i.value,
                capability: "generate",
                "aria-labelledby": "first-agent-model",
                onSelect: o[2] || (o[2] = (a) => i.value = a.detail)
              }, null, 40, Ge),
              Y.value ? x("", !0) : (p(), h("p", Ke, "This workspace has no default model; choose one."))
            ])
          ]),
          n("div", Qe, [
            n("div", Ze, [
              m(f(be), {
                modelValue: v.value,
                "onUpdate:modelValue": o[3] || (o[3] = (a) => v.value = a),
                "input-id": "first-agent-memory",
                binary: ""
              }, null, 8, ["modelValue"]),
              o[9] || (o[9] = n("label", { for: "first-agent-memory" }, "Personal memory", -1))
            ]),
            o[10] || (o[10] = n("p", { class: "hint" }, "Remember your preferences and useful details across conversations.", -1))
          ]),
          n("wc-agent-trait-picker", {
            value: JSON.stringify(y.value),
            "aria-label": "Agent capabilities",
            onChange: ie
          }, null, 40, et)
        ], 8, We),
        u.value ? (p(), h("p", tt, V(u.value), 1)) : x("", !0),
        n("div", ot, [
          m(f(b), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            disabled: g.value,
            onClick: R
          }, null, 8, ["disabled"]),
          m(f(b), {
            type: "submit",
            label: g.value ? "Creating…" : k.value ? "Open agent chat" : "Create agent",
            disabled: !U.value
          }, null, 8, ["label", "disabled"])
        ])
      ], 32))
    ]));
  }
}), yt = {
  rootComponent: it,
  plugins: [Me]
};
export {
  yt as mountConfig
};
