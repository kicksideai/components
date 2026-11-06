import x from "primevue/config";
import M from "primevue/contextmenu";
import R from "primevue/menu";
import N from "primevue/portal";
import { renderSlot as y, createCommentVNode as _, h as $, Teleport as H } from "vue";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
const V = "data-wippy-overlay-layer";
function A() {
  return typeof window < "u" && typeof window.document < "u";
}
function O() {
  return A() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function F() {
  return O() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const W = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let z = 0;
const u = /* @__PURE__ */ new WeakMap();
function w(t, e) {
  const o = t.style;
  o.setProperty("position", "fixed", "important"), o.setProperty("inset", "auto", "important"), o.setProperty("margin", "0", "important"), o.setProperty("position-anchor", e), o.setProperty("position-area", "bottom span-right"), o.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), o.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), o.setProperty("max-width", "stretch", "important");
}
function B(t, e) {
  if (!W.test(t.className))
    return;
  const o = t.style.cssText;
  w(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = o;
    return;
  }
  if (!u.has(t)) {
    const i = new MutationObserver(() => {
      const n = t.style;
      (n.top !== "auto" || n.left !== "auto" || n.margin !== "0px" || n.getPropertyPriority("top") !== "important" || n.getPropertyPriority("left") !== "important" || n.getPropertyPriority("margin") !== "important" || n.getPropertyPriority("min-width") !== "important" || n.maxWidth !== "stretch" || n.getPropertyPriority("max-width") !== "important") && w(t, e);
    });
    i.observe(t, { attributes: !0, attributeFilter: ["style"] }), u.set(t, i);
  }
}
function f(t) {
  const e = u.get(t);
  e && (e.disconnect(), u.delete(t));
}
function Y(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function p(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const l = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new WeakMap();
let b = !1, d = !1;
const g = ["w-theme-dark", "w-theme-light"], a = "data-wippy-theme-root", h = /* @__PURE__ */ new WeakMap();
function q(t) {
  const e = [];
  let o = t ? t.parentNode : null;
  for (; o && o.nodeType === 1; )
    e.push(o), o = o.parentNode;
  return e;
}
function D(t, e, o) {
  const i = [...q(e), o.host], n = () => {
    let s;
    for (const r of i) {
      if (g.some((E) => r.classList.contains(E))) {
        s = r;
        break;
      }
      if (r.hasAttribute(a))
        break;
    }
    for (const r of g)
      t.classList.toggle(r, !!(s && s.classList.contains(r)));
    s ? t.setAttribute(a, "") : t.removeAttribute(a);
  };
  n();
  const c = new MutationObserver(n);
  for (const s of i)
    c.observe(s, { attributes: !0, attributeFilter: ["class", a] });
  h.set(t, c);
}
function S(t) {
  h.get(t)?.disconnect(), h.delete(t);
}
function I() {
  d = !1;
  for (const t of l) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && f(e);
      l.delete(t), m.get(t)?.disconnect(), S(t);
      continue;
    }
    t.childElementCount > 0 && p(t);
  }
}
function v() {
  d || (d = !0, requestAnimationFrame(I));
}
function X(t) {
  const e = document.createElement("div");
  e.setAttribute(V, "");
  const o = O();
  if (e.style.cssText = o ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", o && e.setAttribute("popover", "manual"), t.appendChild(e), o) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  p(e);
  const i = new MutationObserver((n) => {
    const c = e.__wippyAnchorName;
    for (const s of n) {
      if (c)
        for (const r of Array.from(s.addedNodes))
          r instanceof HTMLElement && B(r, c);
      for (const r of Array.from(s.removedNodes))
        r instanceof HTMLElement && f(r);
    }
    e.isConnected && e.childElementCount > 0 && p(e);
  });
  return i.observe(e, { childList: !0 }), m.set(e, i), l.add(e), b || (b = !0, window.addEventListener("scroll", v, { capture: !0, passive: !0 }), window.addEventListener("resize", v, { passive: !0 })), e;
}
function L(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = X(t.hostRoot), D(t.layer, t.$el, t.hostRoot), F())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++z}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function C(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && f(e);
    l.delete(t.layer), m.get(t.layer)?.disconnect(), S(t.layer), t.layer.remove(), t.layer = null;
  }
}
let T = !1;
function j() {
  if (T)
    return;
  const t = R;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const o = e.composedPath(), i = this.container && !o.includes(this.container), n = !(this.target && o.includes(this.target));
      this.overlayVisible && i && n ? this.hide() : !this.popup && i && n && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, T = !0);
}
let P = !1;
function G() {
  if (P)
    return;
  const t = M;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const o = e.composedPath(), i = this.container && !o.includes(this.container), n = this.visible ? !(this.target && o.includes(this.target)) : !0;
      i && n && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, P = !0);
}
let k = !1;
function J() {
  if (k)
    return;
  k = !0;
  const t = N;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    A() && (this.hostRoot = Y(this.$el), this.mounted = !0, this.hostRoot && (this.inline || L(this), this.$watch("inline", (e) => {
      e ? C(this) : L(this);
    })));
  }, t.render = function() {
    return this.inline ? y(this.$slots, "default", { key: 0 }) : this.mounted ? $(H, { key: 1, to: this.resolvedTarget || document.body }, [
      y(this.$slots, "default")
    ]) : _("", !0);
  }, t.unmounted = function() {
    C(this);
  };
}
const et = {
  install: (t) => {
    j(), G(), J(), t.use(x, { theme: "none" });
  }
};
export {
  et as P
};
