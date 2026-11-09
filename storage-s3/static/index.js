import { W as $, u as _ } from "./wc-runtime-eQeq_mpT.js";
import z from "primevue/config";
import H from "primevue/contextmenu";
import V from "primevue/menu";
import W from "primevue/portal";
import { renderSlot as g, createCommentVNode as F, h as a, Teleport as I, defineAsyncComponent as q, defineComponent as B, onMounted as Y } from "vue";
import { Icon as w } from "@iconify/vue";
import { define as j } from "@wippy-fe/proxy";
const D = "data-wippy-overlay-layer";
function A() {
  return typeof window < "u" && typeof window.document < "u";
}
function E() {
  return A() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function U() {
  return E() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const K = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let X = 0;
const p = /* @__PURE__ */ new WeakMap();
function b(t, e) {
  const o = t.style;
  o.setProperty("position", "fixed", "important"), o.setProperty("inset", "auto", "important"), o.setProperty("margin", "0", "important"), o.setProperty("position-anchor", e), o.setProperty("position-area", "bottom span-right"), o.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), o.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), o.setProperty("max-width", "stretch", "important");
}
function G(t, e) {
  if (!K.test(t.className))
    return;
  const o = t.style.cssText;
  b(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = o;
    return;
  }
  if (!p.has(t)) {
    const r = new MutationObserver(() => {
      const n = t.style;
      (n.top !== "auto" || n.left !== "auto" || n.margin !== "0px" || n.getPropertyPriority("top") !== "important" || n.getPropertyPriority("left") !== "important" || n.getPropertyPriority("margin") !== "important" || n.getPropertyPriority("min-width") !== "important" || n.maxWidth !== "stretch" || n.getPropertyPriority("max-width") !== "important") && b(t, e);
    });
    r.observe(t, { attributes: !0, attributeFilter: ["style"] }), p.set(t, r);
  }
}
function m(t) {
  const e = p.get(t);
  e && (e.disconnect(), p.delete(t));
}
function J(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function u(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const d = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new WeakMap();
let C = !1, h = !1;
const v = ["w-theme-dark", "w-theme-light"], l = "data-wippy-theme-root", f = /* @__PURE__ */ new WeakMap();
function Q(t) {
  const e = [];
  let o = t ? t.parentNode : null;
  for (; o && o.nodeType === 1; )
    e.push(o), o = o.parentNode;
  return e;
}
function Z(t, e, o) {
  const r = [...Q(e), o.host], n = () => {
    let s;
    for (const i of r) {
      if (v.some((N) => i.classList.contains(N))) {
        s = i;
        break;
      }
      if (i.hasAttribute(l))
        break;
    }
    for (const i of v)
      t.classList.toggle(i, !!(s && s.classList.contains(i)));
    s ? t.setAttribute(l, "") : t.removeAttribute(l);
  };
  n();
  const c = new MutationObserver(n);
  for (const s of r)
    c.observe(s, { attributes: !0, attributeFilter: ["class", l] });
  f.set(t, c);
}
function M(t) {
  f.get(t)?.disconnect(), f.delete(t);
}
function tt() {
  h = !1;
  for (const t of d) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && m(e);
      d.delete(t), y.get(t)?.disconnect(), M(t);
      continue;
    }
    t.childElementCount > 0 && u(t);
  }
}
function x() {
  h || (h = !0, requestAnimationFrame(tt));
}
function et(t) {
  const e = document.createElement("div");
  e.setAttribute(D, "");
  const o = E();
  if (e.style.cssText = o ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", o && e.setAttribute("popover", "manual"), t.appendChild(e), o) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  u(e);
  const r = new MutationObserver((n) => {
    const c = e.__wippyAnchorName;
    for (const s of n) {
      if (c)
        for (const i of Array.from(s.addedNodes))
          i instanceof HTMLElement && G(i, c);
      for (const i of Array.from(s.removedNodes))
        i instanceof HTMLElement && m(i);
    }
    e.isConnected && e.childElementCount > 0 && u(e);
  });
  return r.observe(e, { childList: !0 }), y.set(e, r), d.add(e), C || (C = !0, window.addEventListener("scroll", x, { capture: !0, passive: !0 }), window.addEventListener("resize", x, { passive: !0 })), e;
}
function L(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = et(t.hostRoot), Z(t.layer, t.$el, t.hostRoot), U())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++X}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function T(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && m(e);
    d.delete(t.layer), y.get(t.layer)?.disconnect(), M(t.layer), t.layer.remove(), t.layer = null;
  }
}
let S = !1;
function ot() {
  if (S)
    return;
  const t = V;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const o = e.composedPath(), r = this.container && !o.includes(this.container), n = !(this.target && o.includes(this.target));
      this.overlayVisible && r && n ? this.hide() : !this.popup && r && n && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, S = !0);
}
let k = !1;
function nt() {
  if (k)
    return;
  const t = H;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const o = e.composedPath(), r = this.container && !o.includes(this.container), n = this.visible ? !(this.target && o.includes(this.target)) : !0;
      r && n && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, k = !0);
}
let P = !1;
function rt() {
  if (P)
    return;
  P = !0;
  const t = W;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    A() && (this.hostRoot = J(this.$el), this.mounted = !0, this.hostRoot && (this.inline || L(this), this.$watch("inline", (e) => {
      e ? T(this) : L(this);
    })));
  }, t.render = function() {
    return this.inline ? g(this.$slots, "default", { key: 0 }) : this.mounted ? a(I, { key: 1, to: this.resolvedTarget || document.body }, [
      g(this.$slots, "default")
    ]) : F("", !0);
  }, t.unmounted = function() {
    T(this);
  };
}
const it = {
  install: (t) => {
    ot(), nt(), rt(), t.use(z, { theme: "none" });
  }
}, st = 3e4, O = "display:flex;align-items:center;justify-content:center;min-height:2rem;font-size:.875rem;", at = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;";
function ct(t) {
  matchMedia("(prefers-reduced-motion: reduce)").matches || t.el.animate({ rotate: ["0deg", "360deg"] }, { duration: 1e3, iterations: 1 / 0 });
}
function lt(t, e, o) {
  const r = o();
  Y(() => r("error", { message: t, error: e }));
}
function pt(t, e, o) {
  return q({
    loader: t,
    loadingComponent: {
      render: () => a("span", {
        role: "status",
        "data-lazy-state": "loading",
        "aria-label": e.loading,
        style: `${O}color:var(--p-text-muted-color);`
      }, a("span", { style: "display:inline-flex;", onVnodeMounted: ct }, a(w, { icon: "tabler:loader-2", "aria-hidden": "true" })))
    },
    errorComponent: B({
      props: { error: { type: Error, required: !0 } },
      setup(r) {
        return lt(e.failed, r.error, o), () => a("span", {
          role: "alert",
          "data-lazy-state": "failed",
          title: e.iconOnly ? e.failed : void 0,
          style: `${O}color:var(--p-danger-500);`
        }, e.iconOnly ? [a(w, { icon: "tabler:alert-circle", "aria-hidden": "true" }), a("span", { style: at }, e.failed)] : e.failed);
      }
    }),
    delay: e.immediate ? 0 : 200,
    timeout: st,
    suspensible: !1
  });
}
const dt = ":host{display:block;height:100%;min-height:0;color:var(--p-text-color)}.storage-s3{box-sizing:border-box;height:100%;overflow:auto;padding:1.5rem;background:var(--p-content-background)}.storage-s3 header,.storage-s3 form{max-width:48rem}.storage-s3 h2{margin:0 0 .75rem;font-size:1.25rem}.storage-s3 p,.storage-s3 small{color:var(--p-text-muted-color);line-height:1.5}.storage-s3 form{display:grid;gap:.75rem;margin-top:1.25rem}.storage-s3:has(>p[role=status]){min-height:329px}.storage-s3 label{font-weight:600}.storage-s3-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.5rem}:host>div:empty,:host>div:has(>[data-lazy-state]){min-height:329px}", ut = pt(
  () => import("./storage-DwQdL1M2.js"),
  { loading: "Loading the S3 storage settings…", failed: "Could not load the S3 storage settings. Reload the page to try again." },
  _
);
class R extends $ {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: dt
    };
  }
  static get vueConfig() {
    return { rootComponent: ut, plugins: [it] };
  }
}
async function vt() {
  return R;
}
j(import.meta.url, R);
export {
  vt as webComponent
};
