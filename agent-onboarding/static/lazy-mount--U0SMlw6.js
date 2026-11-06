import oe from "primevue/config";
import ne from "primevue/contextmenu";
import ie from "primevue/menu";
import re from "primevue/portal";
import { renderSlot as F, createCommentVNode as g, h as se, Teleport as ae, defineComponent as le, ref as c, computed as M, onMounted as ue, openBlock as f, createElementBlock as y, createElementVNode as l, withModifiers as ce, createVNode as w, unref as h, createBlock as I, resolveDynamicComponent as de, createTextVNode as pe, toDisplayString as fe } from "vue";
import k from "primevue/button";
import me from "primevue/inputtext";
import { loadByTagName as N, api as _ } from "@wippy-fe/proxy";
import { u as he } from "./wc-runtime-DZZltuMO.js";
const ve = "data-wippy-overlay-layer";
function G() {
  return typeof window < "u" && typeof window.document < "u";
}
function K() {
  return G() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ye() {
  return K() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const ge = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let be = 0;
const P = /* @__PURE__ */ new WeakMap();
function Y(e, t) {
  const i = e.style;
  i.setProperty("position", "fixed", "important"), i.setProperty("inset", "auto", "important"), i.setProperty("margin", "0", "important"), i.setProperty("position-anchor", t), i.setProperty("position-area", "bottom span-right"), i.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), i.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), i.setProperty("max-width", "stretch", "important");
}
function we(e, t) {
  if (!ge.test(e.className))
    return;
  const i = e.style.cssText;
  Y(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = i;
    return;
  }
  if (!P.has(e)) {
    const a = new MutationObserver(() => {
      const n = e.style;
      (n.top !== "auto" || n.left !== "auto" || n.margin !== "0px" || n.getPropertyPriority("top") !== "important" || n.getPropertyPriority("left") !== "important" || n.getPropertyPriority("margin") !== "important" || n.getPropertyPriority("min-width") !== "important" || n.maxWidth !== "stretch" || n.getPropertyPriority("max-width") !== "important") && Y(e, t);
    });
    a.observe(e, { attributes: !0, attributeFilter: ["style"] }), P.set(e, a);
  }
}
function V(e) {
  const t = P.get(e);
  t && (t.disconnect(), P.delete(e));
}
function ke(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function R(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const x = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new WeakMap();
let j = !1, $ = !1;
function Ce() {
  $ = !1;
  for (const e of x) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && V(t);
      x.delete(e), B.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && R(e);
  }
}
function z() {
  $ || ($ = !0, requestAnimationFrame(Ce));
}
function Le(e) {
  const t = document.createElement("div");
  t.setAttribute(ve, "");
  const i = K();
  if (t.style.cssText = i ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", i && t.setAttribute("popover", "manual"), e.appendChild(t), i) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  R(t);
  const a = new MutationObserver((n) => {
    const d = t.__wippyAnchorName;
    for (const m of n) {
      if (d)
        for (const u of Array.from(m.addedNodes))
          u instanceof HTMLElement && we(u, d);
      for (const u of Array.from(m.removedNodes))
        u instanceof HTMLElement && V(u);
    }
    t.isConnected && t.childElementCount > 0 && R(t);
  });
  return a.observe(t, { childList: !0 }), B.set(t, a), x.add(t), j || (j = !0, window.addEventListener("scroll", z, { capture: !0, passive: !0 }), window.addEventListener("resize", z, { passive: !0 })), t;
}
function U(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Le(e.hostRoot), ye())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++be}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function W(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && V(t);
    x.delete(e.layer), B.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let q = !1;
function Te() {
  if (q)
    return;
  const e = ie;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const i = t.composedPath(), a = this.container && !i.includes(this.container), n = !(this.target && i.includes(this.target));
      this.overlayVisible && a && n ? this.hide() : !this.popup && a && n && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, q = !0);
}
let J = !1;
function _e() {
  if (J)
    return;
  const e = ne;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const i = t.composedPath(), a = this.container && !i.includes(this.container), n = this.visible ? !(this.target && i.includes(this.target)) : !0;
      a && n && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, J = !0);
}
let X = !1;
function Pe() {
  if (X)
    return;
  X = !0;
  const e = re;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    G() && (this.hostRoot = ke(this.$el), this.mounted = !0, this.hostRoot && (this.inline || U(this), this.$watch("inline", (t) => {
      t ? W(this) : U(this);
    })));
  }, e.render = function() {
    return this.inline ? F(this.$slots, "default", { key: 0 }) : this.mounted ? se(ae, { key: 1, to: this.resolvedTarget || document.body }, [
      F(this.$slots, "default")
    ]) : g("", !0);
  }, e.unmounted = function() {
    W(this);
  };
}
const xe = {
  install: (e) => {
    Te(), _e(), Pe(), e.use(oe, { theme: "none" });
  }
}, Ae = { class: "onboarding" }, Se = {
  key: 0,
  role: "status"
}, Ee = {
  key: 0,
  "aria-label": "Configure a model"
}, Oe = ["disabled"], Me = { class: "capabilities" }, Ne = ["value"], Re = ["open"], $e = {
  key: 0,
  class: "hint"
}, Ve = ["value"], Be = {
  key: 1,
  class: "error",
  role: "alert"
}, De = { class: "actions" }, He = "My Assistant", Fe = /* @__PURE__ */ le({
  __name: "Onboarding",
  setup(e) {
    const t = he(), i = ["kickside.agents.traits:trait_master", "kickside.agents.traits:artifacts", "kickside.uploads.traits:file_manager"], a = c(He), n = c(""), d = c({ traits: [...i], trait_contexts: { "kickside.agents.traits:trait_master": { inject_trait_catalog: !0 } } }), m = c(!0), u = c(!1), v = c(!1), p = c(""), b = c(""), A = c([]), S = c([]), E = M(() => S.value.includes("class:fast")), C = c(!1), D = M(() => n.value ? A.value.includes(n.value) || S.value.includes(n.value) : E.value), H = M(() => u.value && !m.value && !v.value && !!a.value.trim() && D.value);
    function O(s) {
      const o = s;
      return o?.response?.data?.error || o?.message || String(s);
    }
    function Q(s) {
      const o = s.detail;
      d.value = { traits: [...o.traits], trait_contexts: { ...o.trait_contexts } };
    }
    async function L() {
      m.value = !0, u.value = !1, p.value = "";
      try {
        await Promise.all([
          N("wc-model-picker", { timeoutMs: 8e3 }),
          N("wc-agent-trait-picker", { timeoutMs: 8e3 })
        ]);
        const [s, o] = await Promise.all([
          _.get("/api/v1/models/list?capability=generate"),
          _.get("/api/v1/models/classes")
        ]);
        if (s.data?.success !== !0 || o.data?.success !== !0) throw new Error("Could not check model configuration.");
        A.value = s.data.models.map((r) => r.name), S.value = o.data.classes.filter((r) => r.models.length > 0 && A.value.includes(r.models[0].name)).map((r) => `class:${r.name}`), u.value = !0;
      } catch (s) {
        p.value = O(s);
      } finally {
        m.value = !1;
      }
    }
    async function Z() {
      p.value = "";
      try {
        await N("kickside-onboard-models", { timeoutMs: 8e3 }), C.value = !0;
      } catch (s) {
        p.value = O(s);
      }
    }
    async function ee() {
      C.value = !1, await L();
    }
    async function te() {
      if (H.value) {
        v.value = !0, p.value = "";
        try {
          if (!b.value) {
            const r = { title: a.value.trim() };
            n.value && (r.model = n.value), d.value.traits.length && (r.traits = [...d.value.traits], r.trait_contexts = { ...d.value.trait_contexts });
            const { data: T } = await _.post("/api/v1/user-agents", r);
            if (T?.success !== !0 || !T.component_id) throw new Error(T?.error || "Could not create your agent.");
            b.value = T.component_id;
          }
          const { data: s } = await _.get("/api/v1/agents/list");
          if (s?.success !== !0) throw new Error(s?.error || "Could not open your agent.");
          const o = s.agents.find((r) => r.name === `user_agent:${b.value}`);
          if (!o?.start_token) throw new Error("Your agent is created. Chat is unavailable; retry to open it.");
          t("navigate", { path: "/sessions", startToken: o.start_token });
        } catch (s) {
          p.value = O(s);
        } finally {
          v.value = !1;
        }
      }
    }
    return ue(L), (s, o) => (f(), y("div", Ae, [
      o[9] || (o[9] = l("div", { class: "onboarding-intro" }, [
        l("p", null, "Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.")
      ], -1)),
      m.value ? (f(), y("p", Se, "Loading your choices…")) : (f(), y("form", {
        key: 1,
        class: "onboarding-form",
        onSubmit: ce(te, ["prevent"])
      }, [
        D.value ? g("", !0) : (f(), y("section", Ee, [
          o[4] || (o[4] = l("h3", null, "Configure a model", -1)),
          o[5] || (o[5] = l("p", null, "Connect a generation model before creating your agent. Ask an administrator to configure one if you do not have model settings access.", -1)),
          w(h(k), {
            type: "button",
            label: "Configure a model",
            onClick: Z
          }),
          w(h(k), {
            type: "button",
            label: "Check model configuration",
            onClick: L
          }),
          C.value ? (f(), I(de("kickside-onboard-models"), {
            key: 0,
            onDone: ee,
            onBack: o[0] || (o[0] = (r) => C.value = !1)
          }, null, 32)) : g("", !0)
        ])),
        l("fieldset", {
          disabled: v.value || !!b.value || !u.value
        }, [
          o[8] || (o[8] = l("label", { for: "first-agent-title" }, "Agent name", -1)),
          w(h(me), {
            id: "first-agent-title",
            modelValue: a.value,
            "onUpdate:modelValue": o[1] || (o[1] = (r) => a.value = r),
            name: "title",
            autocomplete: "off",
            maxlength: "120"
          }, null, 8, ["modelValue"]),
          l("div", Me, [
            l("wc-agent-trait-picker", {
              value: JSON.stringify(d.value),
              "aria-label": "Agent capabilities",
              onChange: Q
            }, null, 40, Ne)
          ]),
          l("details", {
            open: !E.value
          }, [
            l("summary", null, [
              o[6] || (o[6] = pe("Choose a model ", -1)),
              E.value ? (f(), y("span", $e, "(optional)")) : g("", !0)
            ]),
            o[7] || (o[7] = l("p", { class: "hint" }, "Choose a configured model, or use the platform default when one is available.", -1)),
            l("wc-model-picker", {
              value: n.value,
              capability: "generate",
              "aria-label": "Agent model",
              onSelect: o[2] || (o[2] = (r) => n.value = r.detail)
            }, null, 40, Ve)
          ], 8, Re)
        ], 8, Oe),
        p.value ? (f(), y("p", Be, fe(p.value), 1)) : g("", !0),
        u.value ? g("", !0) : (f(), I(h(k), {
          key: 2,
          type: "button",
          label: "Retry loading choices",
          onClick: L
        })),
        l("div", De, [
          w(h(k), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            disabled: v.value,
            onClick: o[3] || (o[3] = (r) => h(t)("done", { status: "skipped" }))
          }, null, 8, ["disabled"]),
          w(h(k), {
            type: "submit",
            label: v.value ? "Creating…" : b.value ? "Open agent chat" : "Create agent",
            disabled: !H.value
          }, null, 8, ["label", "disabled"])
        ])
      ], 32))
    ]));
  }
}), Ge = {
  rootComponent: Fe,
  plugins: [xe]
};
export {
  Ge as mountConfig
};
