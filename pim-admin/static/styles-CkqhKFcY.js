import Mt from "primevue/config";
import Nt from "primevue/contextmenu";
import jt from "primevue/menu";
import Ht from "primevue/portal";
import { renderSlot as k, createCommentVNode as Z, h as Ut, Teleport as Bt, ref as O, onMounted as St, onUnmounted as Dt, watch as Et, createApp as Wt, inject as tt, defineComponent as I, useId as Ft, openBlock as S, createElementBlock as B, unref as g, normalizeClass as qt, createElementVNode as v, createTextVNode as et, toDisplayString as $, Fragment as Yt, createVNode as C, withCtx as y, useModel as Kt, createBlock as K, mergeModels as Jt, onBeforeUnmount as Gt, nextTick as Qt } from "vue";
import { addCollection as Xt, Icon as pt } from "@iconify/vue";
import { config as lt, addIcons as Zt, on as te, applyThemeMode as N, host as ee, hostCss as ie, loadCss as re, api as it, loadByTagName as oe } from "@wippy-fe/proxy";
import { getActivePinia as ne, createPinia as ae, setActivePinia as se } from "pinia";
import ct from "primevue/button";
import pe from "primevue/accordion";
import le from "primevue/accordioncontent";
import ce from "primevue/accordionheader";
import de from "primevue/accordionpanel";
import me from "primevue/message";
const ue = "data-wippy-overlay-layer";
function zt() {
  return typeof window < "u" && typeof window.document < "u";
}
function Pt() {
  return zt() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function he() {
  return Pt() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const xe = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let ge = 0;
const D = /* @__PURE__ */ new WeakMap();
function dt(t, e) {
  const i = t.style;
  i.setProperty("position", "fixed", "important"), i.setProperty("inset", "auto", "important"), i.setProperty("margin", "0", "important"), i.setProperty("position-anchor", e), i.setProperty("position-area", "bottom span-right"), i.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), i.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), i.setProperty("max-width", "stretch", "important");
}
function fe(t, e) {
  if (!xe.test(t.className))
    return;
  const i = t.style.cssText;
  dt(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = i;
    return;
  }
  if (!D.has(t)) {
    const r = new MutationObserver(() => {
      const o = t.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && dt(t, e);
    });
    r.observe(t, { attributes: !0, attributeFilter: ["style"] }), D.set(t, r);
  }
}
function rt(t) {
  const e = D.get(t);
  e && (e.disconnect(), D.delete(t));
}
function be(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function J(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const W = /* @__PURE__ */ new Set(), ot = /* @__PURE__ */ new WeakMap();
let mt = !1, G = !1;
const ut = ["w-theme-dark", "w-theme-light"], j = "data-wippy-theme-root", Q = /* @__PURE__ */ new WeakMap();
function we(t) {
  const e = [];
  let i = t ? t.parentNode : null;
  for (; i && i.nodeType === 1; )
    e.push(i), i = i.parentNode;
  return e;
}
function ve(t, e, i) {
  const r = [...we(e), i.host], o = () => {
    let s;
    for (const n of r) {
      if (ut.some((p) => n.classList.contains(p))) {
        s = n;
        break;
      }
      if (n.hasAttribute(j))
        break;
    }
    for (const n of ut)
      t.classList.toggle(n, !!(s && s.classList.contains(n)));
    s ? t.setAttribute(j, "") : t.removeAttribute(j);
  };
  o();
  const a = new MutationObserver(o);
  for (const s of r)
    a.observe(s, { attributes: !0, attributeFilter: ["class", j] });
  Q.set(t, a);
}
function At(t) {
  Q.get(t)?.disconnect(), Q.delete(t);
}
function ye() {
  G = !1;
  for (const t of W) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && rt(e);
      W.delete(t), ot.get(t)?.disconnect(), At(t);
      continue;
    }
    t.childElementCount > 0 && J(t);
  }
}
function ht() {
  G || (G = !0, requestAnimationFrame(ye));
}
function ke(t) {
  const e = document.createElement("div");
  e.setAttribute(ue, "");
  const i = Pt();
  if (e.style.cssText = i ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", i && e.setAttribute("popover", "manual"), t.appendChild(e), i) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  J(e);
  const r = new MutationObserver((o) => {
    const a = e.__wippyAnchorName;
    for (const s of o) {
      if (a)
        for (const n of Array.from(s.addedNodes))
          n instanceof HTMLElement && fe(n, a);
      for (const n of Array.from(s.removedNodes))
        n instanceof HTMLElement && rt(n);
    }
    e.isConnected && e.childElementCount > 0 && J(e);
  });
  return r.observe(e, { childList: !0 }), ot.set(e, r), W.add(e), mt || (mt = !0, window.addEventListener("scroll", ht, { capture: !0, passive: !0 }), window.addEventListener("resize", ht, { passive: !0 })), e;
}
function xt(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = ke(t.hostRoot), ve(t.layer, t.$el, t.hostRoot), he())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++ge}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function gt(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && rt(e);
    W.delete(t.layer), ot.get(t.layer)?.disconnect(), At(t.layer), t.layer.remove(), t.layer = null;
  }
}
let ft = !1;
function _e() {
  if (ft)
    return;
  const t = jt;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const i = e.composedPath(), r = this.container && !i.includes(this.container), o = !(this.target && i.includes(this.target));
      this.overlayVisible && r && o ? this.hide() : !this.popup && r && o && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, ft = !0);
}
let bt = !1;
function Ce() {
  if (bt)
    return;
  const t = Nt;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const i = e.composedPath(), r = this.container && !i.includes(this.container), o = this.visible ? !(this.target && i.includes(this.target)) : !0;
      r && o && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, bt = !0);
}
let wt = !1;
function Se() {
  if (wt)
    return;
  wt = !0;
  const t = Ht;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    zt() && (this.hostRoot = be(this.$el), this.mounted = !0, this.hostRoot && (this.inline || xt(this), this.$watch("inline", (e) => {
      e ? gt(this) : xt(this);
    })));
  }, t.render = function() {
    return this.inline ? k(this.$slots, "default", { key: 0 }) : this.mounted ? Ut(Bt, { key: 1, to: this.resolvedTarget || document.body }, [
      k(this.$slots, "default")
    ]) : Z("", !0);
  }, t.unmounted = function() {
    gt(this);
  };
}
const Ci = {
  install: (t) => {
    _e(), Ce(), Se(), t.use(Mt, { theme: "none" });
  }
};
var X = "data-wippy-visible";
function vt(t) {
  const e = t.getAttribute(X);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Ee = Object.defineProperty, Tt = (t) => {
  throw TypeError(t);
}, ze = (t, e, i) => e in t ? Ee(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i, m = (t, e, i) => ze(t, typeof e != "symbol" ? e + "" : e, i), Lt = (t, e, i) => e.has(t) || Tt("Cannot " + i), Pe = (t, e, i) => (Lt(t, e, "read from private field"), i ? i.call(t) : e.get(t)), Ae = (t, e, i) => e.has(t) ? Tt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), Te = (t, e, i, r) => (Lt(t, e, "write to private field"), e.set(t, i), i), Le = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Re = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function yt(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Oe(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const i of t)
    if (i)
      for (const [r, o] of Object.entries(i)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [s, n] of Object.entries(o)) {
            const p = typeof n == "string" ? yt(s) : null;
            p && e.add(p);
          }
          continue;
        }
        const a = typeof o == "string" ? yt(r) : null;
        a && e.add(a);
      }
  return [...e].sort();
}
function Ve(t) {
  if (t.length === 0)
    return "";
  const e = t.map((i) => `  ${i}: inherit;`).join(`
`);
  return `${Re} {
${e}
}`;
}
function $e(t, e) {
  const i = Ve(e);
  i && Rt(t, i, "@wippy-fe/css-variables-bridge");
}
function Ie(t, e) {
  const r = (e ?? Le).map(async (o) => {
    const a = ie[o];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await re(a);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${a}):`, s), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const a of o) {
      if (!a)
        continue;
      const s = document.createElement("style");
      s.textContent = a, s.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(s);
    }
  });
}
function Me(t, e) {
  const i = document.createElement("style");
  i.textContent = e, t.appendChild(i);
}
function Rt(t, e, i) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", i), r.textContent = e, t.appendChild(r);
}
function Ne(t, e) {
  Rt(t, e, "@wippy-fe/custom-css");
}
function Ot(t) {
  return t.__wippyHost ?? null;
}
function je(t) {
  return t.replace(/-([a-z])/g, (e, i) => i.toUpperCase());
}
function He(t, e, i) {
  switch (i.type) {
    case "string":
      return { value: e };
    case "number": {
      const r = Number.parseFloat(e);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(e, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(e);
        return i.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${t}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${t}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function q(t, e) {
  const i = {}, r = [];
  for (const [o, a] of Object.entries(e.properties)) {
    const s = t.getAttribute(o), n = je(o);
    if (s === null) {
      a.default !== void 0 && (i[n] = a.default);
      continue;
    }
    const p = He(o, s, a);
    p.error ? r.push(p.error) : i[n] = p.value;
  }
  return { props: i, errors: r };
}
var Ue = class {
  constructor(t, e) {
    m(this, "_props"), m(this, "_errors"), m(this, "_content"), m(this, "_hostVisibility"), m(this, "_propsListeners", /* @__PURE__ */ new Set()), m(this, "_contentListeners", /* @__PURE__ */ new Set()), m(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), m(this, "_disposed", !1), m(this, "_emitToDom"), m(this, "props"), m(this, "events"), m(this, "content"), m(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
    const i = this;
    this.props = {
      get value() {
        return i._props;
      },
      get errors() {
        return i._errors;
      },
      subscribe(r, o) {
        return i._subscribeProps(r, o);
      }
    }, this.events = {
      emit(r, o) {
        i._disposed || i._emitToDom(r, o);
      }
    }, this.content = t.hasContent ? {
      get value() {
        return i._content;
      },
      subscribe(r, o) {
        return i._subscribeContent(r, o);
      }
    } : null, this.hostVisibility = {
      get value() {
        return i._hostVisibility;
      },
      subscribe(r, o) {
        return i._subscribeHostVisibility(r, o);
      }
    };
  }
  /** @internal */
  notifyProps(t, e) {
    if (!this._disposed) {
      this._props = t, this._errors = e;
      for (const i of this._propsListeners)
        i(t, e);
    }
  }
  /** @internal */
  notifyContent(t) {
    if (!this._disposed) {
      this._content = t;
      for (const e of this._contentListeners)
        e(t);
    }
  }
  /** @internal */
  notifyHostVisibility(t, e) {
    if (!(this._disposed || t === e)) {
      this._hostVisibility = t;
      for (const i of this._hostVisibilityListeners)
        i(t, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(t), e?.immediate && t(this._props, this._errors);
    const i = () => {
      this._propsListeners.delete(t), e?.signal?.removeEventListener("abort", i);
    };
    return e?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeContent(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(t), e?.immediate && t(this._content);
    const i = () => {
      this._contentListeners.delete(t), e?.signal?.removeEventListener("abort", i);
    };
    return e?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeHostVisibility(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(t), e?.immediate && t(this._hostVisibility, this._hostVisibility);
    const i = () => {
      this._hostVisibilityListeners.delete(t), e?.signal?.removeEventListener("abort", i);
    };
    return e?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
}, U, Be = class extends HTMLElement {
  constructor() {
    super(), m(this, "_internals"), m(this, "_contentObserver", null), m(this, "_initialized", !1), m(this, "_container", null), Ae(this, U, null), m(this, "_attachment", 0), m(this, "_reactive", null), m(this, "_lastProps", null), m(this, "_lastErrors", []), m(this, "_lastContent", null), m(this, "_themeUnsub", null), m(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = vt(this);
  }
  /**
   * Override to provide the component's configuration.
   * Must be static because `observedAttributes` reads it before construction.
   *
   * Specify the generic to get typed `validateProps`:
   * ```ts
   * static get wippyConfig(): WippyElementConfig<MyProps> { ... }
   * ```
   */
  static get wippyConfig() {
    return { propsSchema: { properties: {} } };
  }
  /**
   * Derived from the props schema + any `extraObservedAttributes`.
   */
  static get observedAttributes() {
    const t = this.wippyConfig, e = Object.keys(t.propsSchema.properties), i = t.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...i, X])];
  }
  /**
   * Host-owned logical activity. `null` means no host manages this element.
   * It is not CSS visibility or viewport intersection.
   */
  get hostVisible() {
    return this._hostVisible;
  }
  /**
   * Panel-scoped `host` wrapper attached by the managed-layout shell's
   * content resolvers (`ComponentResolver` / `WebComponentPackageLoader`).
   *
   * Inside a managed-layout panel, this is a wrapper around the universal
   * `host` API where context-aware calls (`layout.broadcast / send / on`)
   * are routed through the panel-bound bus — so `sourcePanelId` is
   * attributed correctly without postMessage indirection. Layout
   * mutations and other host methods pass through unchanged.
   *
   * `null` outside a managed-layout context (compat shell, chat sidebar,
   * standalone playground). Subclass code that needs a host in those
   * cases can fall back to `import { host } from '@wippy-fe/proxy'`.
   */
  get host() {
    return Ot(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(t, e) {
    this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      composed: !0,
      detail: e
    }));
  }
  /**
   * Opt-in reactive adapter — framework-agnostic. Subscribe to prop
   * changes, content changes, or emit typed events from a non-Vue
   * consumer without re-rolling reactivity.
   *
   * ```ts
   * class MyEl extends WippyElement<{ count: number }, { tick: { n: number } }> {
   *   protected onMount() {
   *     const ctrl = new AbortController()
   *     this.reactive.props.subscribe(({ count }) => {
   *       this.shadowRoot!.querySelector('.n')!.textContent = String(count)
   *     }, { signal: ctrl.signal, immediate: true })
   *   }
   *   tick(n: number) { this.reactive.events.emit('tick', { n }) }
   * }
   * ```
   *
   * Allocation cost is zero unless this getter is touched. Disposed on
   * `disconnectedCallback`; a fresh adapter is allocated on the next
   * access after reconnect.
   */
  get reactive() {
    if (!this._reactive) {
      const t = this.constructor.wippyConfig, e = !!t.contentTemplate;
      let i, r;
      if (this._lastProps !== null)
        i = this._lastProps, r = this._lastErrors;
      else {
        const a = q(this, t.propsSchema);
        t.validateProps && a.errors.push(...t.validateProps(a.props)), i = a.props, r = a.errors, this._lastProps = i, this._lastErrors = r;
      }
      const o = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = o), this._reactive = new Ue(
        { props: i, errors: r, content: o, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const t = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, i = this._initialized, r = Pe(this, U) ?? Te(this, U, this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" }));
      let o;
      if (this._container)
        o = this._container;
      else {
        if (this.onInit(r), t !== this._attachment)
          return;
        e.inlineCss && Me(r, e.inlineCss);
        try {
          const f = lt?.theming, l = Oe(
            f?.global?.cssVariables,
            f?.children?.cssVariables
          );
          $e(r, l);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const f = lt?.theming, l = [f?.global?.customCSS, f?.children?.customCSS].filter(Boolean).join(`
`);
            l && Ne(r, l);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Ie(r, e.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const d = e.containerClasses ?? [];
        d.length > 0 && o.classList.add(...d), r.appendChild(o), this._container = o, Zt(Xt);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = te("@theme", (d) => this._applyTheme(d)));
      const { props: a, errors: s } = q(this, e.propsSchema);
      e.validateProps && s.push(...e.validateProps(a));
      const n = a;
      this._lastProps = n, this._lastErrors = s;
      let p = null;
      if (e.contentTemplate && (p = this._extractContent(e.contentTemplate), this._lastContent = p, this._contentObserver = new MutationObserver(() => {
        const d = this._extractContent(e.contentTemplate);
        this._lastContent = d, this._reactive?.notifyContent(d), this.onContentChanged(d);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, o, n, s, p, i), t !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), i || (this._initialized = !0), this.onReady(), t === this._attachment && this.emitEvent("load");
    } catch (e) {
      if (t !== this._attachment || (this.onError(e), t !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: e instanceof Error ? e.message : String(e),
        error: e
      });
    }
  }
  /**
   * Applies a forced theme mode to this host element AND the shadow container.
   * The container class drives in-shadow selectors (Tailwind `dark:` utilities,
   * `.w-theme-dark &`); the host-element class drives `:host(.w-theme-*)`
   * selectors. On `@theme` broadcasts the resolved `mode` is passed in directly
   * (don't re-read `getThemeMode()` — the proxy's config-vs-emit order isn't a
   * contract); on the initial connect it defaults to the host's current mode.
   * No-op for an older proxy without `getThemeMode` — `applyThemeMode` clamps
   * `undefined` to 'auto'.
   */
  _applyTheme(t = ee.getThemeMode?.()) {
    N(t, this), this._container && N(t, this._container);
  }
  disconnectedCallback() {
    const t = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), N("auto", this), this._container && N("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), t === this._attachment && (this.emitEvent("unload"), t === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(t, e, i) {
    if (e === i)
      return;
    if (t === X) {
      const n = this._hostVisible, p = vt(this);
      if (p === n)
        return;
      this._hostVisible = p, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(p, n), this.onHostVisibilityChanged(p, n));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: a } = q(this, r.propsSchema);
    r.validateProps && a.push(...r.validateProps(o));
    const s = o;
    this._lastProps = s, this._lastErrors = a, this._reactive?.notifyProps(s, a), this.onPropsChanged(s, a);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(t) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(t) {
    console.error(`${this.constructor.name} initialization failed:`, t);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(t, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(t, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   *
   * A template keeps its children in one of two places. Parsed HTML (page
   * markup, `innerHTML`) puts them in `template.content`, a DocumentFragment.
   * DOM APIs add them as the template element's own child nodes and leave
   * `template.content` empty: that is how a Vue SFC sets
   * `<template data-type="...">{{ text }}</template>`. The content fragment is
   * read first, then the element's own children. Only text is returned, never
   * markup, in both cases.
   */
  _extractContent(t) {
    const e = this.querySelector(`template[data-type="${t}"]`);
    return e ? e.content.textContent?.trim() || e.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(t) {
  }
};
U = /* @__PURE__ */ new WeakMap();
function De(t) {
  return t.__wippyHostBus ?? null;
}
function We(t) {
  return t.dataset.wippyPanelId ?? null;
}
var Fe = Object.defineProperty, qe = (t, e, i) => e in t ? Fe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i, w = (t, e, i) => qe(t, typeof e != "symbol" ? e + "" : e, i);
function kt(t, e, i) {
  const r = t.createElement("div"), o = i ? e.failed : e.loading;
  r.dataset.lazyState = i ? "failed" : "loading", r.setAttribute("role", i ? "alert" : "status"), r.setAttribute("aria-label", o), r.style.cssText = "display:grid;place-items:center;text-align:center;";
  const a = e.surface === "page";
  if (r.style.cssText += a ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", i)
    r.style.color = "var(--p-danger-500, currentColor)", r.textContent = !a && e.iconOnly ? "⚠" : o, !a && e.iconOnly && (r.title = o);
  else {
    const s = t.createElement("style");
    s.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const n = t.createElement("span");
    n.dataset.wippySpinner = "", n.setAttribute("aria-hidden", "true"), n.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", n.style.fontSize = a ? "2rem" : "1em", r.append(s, n);
  }
  return r;
}
var Vt = /* @__PURE__ */ Symbol("wippy:emit"), $t = /* @__PURE__ */ Symbol("wippy:props"), Ye = /* @__PURE__ */ Symbol("wippy:props_error"), Ke = /* @__PURE__ */ Symbol("wippy:content"), Je = /* @__PURE__ */ Symbol("wippy:panel-id"), Ge = /* @__PURE__ */ Symbol("wippy:layout-bus"), Qe = /* @__PURE__ */ Symbol("wippy:host"), It = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Si() {
  const t = tt($t);
  if (!t)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return t;
}
function Ei() {
  const t = tt(Vt);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
function Xe() {
  const t = tt(It);
  if (!t)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return t;
}
function zi(t) {
  const e = Xe();
  let i = !1, r = null, o = !1;
  function a() {
    if (r)
      return o = !0, r;
    let s;
    try {
      s = Promise.resolve(t());
    } catch (p) {
      s = Promise.reject(p);
    }
    const n = s.finally(() => {
      if (r === n && (r = null, i && o))
        return o = !1, a();
    });
    return r = n, n;
  }
  return St(() => (i = !0, a())), Dt(() => {
    i = !1, o = !1;
  }), Et(e, (s, n) => {
    if (i && n === !1 && s === !0)
      return a();
  }), e;
}
var H = /* @__PURE__ */ new WeakMap();
function _t(t, e) {
  const i = H.get(t);
  if (i)
    return i;
  const r = Promise.resolve().then(e);
  return H.set(t, r), r.catch(() => {
    H.get(t) === r && H.delete(t);
  }), r;
}
var Pi = class extends Be {
  constructor() {
    super(...arguments), w(this, "_vueApp", null), w(this, "_mountingApp", !1), w(this, "_mountState", "idle"), w(this, "_feedback", null), w(this, "_propsRef", O({})), w(this, "_errorsRef", O([])), w(this, "_contentRef", O(null)), w(this, "_hostVisibilityRef", O(null)), w(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const t = this.vueConfig;
    t.mountLifecycle && !t.rootComponent && t.lazyConfig && await _t(this, t.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(t, e, i, r, o, a) {
    const s = this.constructor, n = s.vueConfig, p = new AbortController();
    this._bridgeAbort = p;
    const d = () => !p.signal.aborted && this._bridgeAbort === p;
    this._mountState = "mounting", this._propsRef.value = i, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const l of r)
      if (this.emitEvent("invalid", { message: l }), !d())
        return;
    this.reactive.props.subscribe((l, u) => {
      this._propsRef.value = l, this._errorsRef.value = [...u];
      for (const c of u)
        this.emitEvent("invalid", { message: c });
    }, { signal: p.signal }), this.reactive.content && this.reactive.content.subscribe((l) => {
      this._contentRef.value = l;
    }, { signal: p.signal }), this.reactive.hostVisibility.subscribe((l) => {
      this._hostVisibilityRef.value = l;
    }, { signal: p.signal });
    const f = (l) => {
      if (!d())
        return;
      const u = ne(), c = Wt(l.rootComponent);
      let E = !1, _ = !1, z, P;
      this._mountingApp = !0;
      try {
        const A = ae();
        if (l.piniaPlugins)
          for (const b of l.piniaPlugins)
            A.use(b);
        c.use(A);
        for (const b of l.plugins ?? [])
          c.use(b);
        if (c.provide($t, this._propsRef), c.provide(Ye, this._errorsRef), c.provide(Vt, this.emitEvent.bind(this)), c.provide(Ke, this._contentRef), c.provide(It, this._hostVisibilityRef), c.provide(Je, We(this)), c.provide(Ge, De(this)), c.provide(Qe, Ot(this)), l.providers?.(c, this), !d())
          return;
        if (P = c.config.errorHandler, n.mountLifecycle && (c.config.errorHandler = (b, st, h) => {
          _ || (z = b), _ = !0, P?.(b, st, h);
        }), c.mount(e), E = !0, _)
          throw z;
        d() && (this._vueApp = c);
      } finally {
        n.mountLifecycle && E && (c.config.errorHandler = P);
        try {
          E && (_ || !d()) && c.unmount();
        } finally {
          se(u), this._mountingApp = !1;
        }
      }
      n.mountLifecycle && queueMicrotask(() => {
        d() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (n.rootComponent) {
      if (this._mountingApp && n.mountLifecycle) {
        queueMicrotask(() => {
          try {
            f(n);
          } catch (l) {
            d() && (this._mountState = "failed", this.emitEvent("error", { message: l instanceof Error ? l.message : String(l), error: l }));
          }
        });
        return;
      }
      try {
        f(n);
      } catch (l) {
        if (d())
          throw this._mountState = "failed", l;
      }
    } else if (n.lazyConfig) {
      const l = e.ownerDocument, u = n.lazyUi;
      u?.surface === "page" && (e.style.blockSize = "100%", e.style.minBlockSize = "0");
      let c = !1, E, _;
      const z = () => {
        clearTimeout(E), clearTimeout(_), this._feedback?.remove(), this._feedback = null;
      };
      p.signal.addEventListener("abort", z, { once: !0 });
      const P = () => {
        if (!d() || c)
          return;
        const h = u ? kt(l, u, !1) : l.createElement("wippy-loading");
        h.setAttribute("no-bg", ""), this._feedback = h, e.appendChild(h);
      }, A = (h) => {
        if (!d())
          return;
        c = !0, z(), this._mountState = "failed";
        const F = u?.failed ?? (h instanceof Error ? h.message : String(h)), M = u ? kt(l, u, !0) : l.createElement("wippy-error");
        u || (M.setAttribute("title", "Failed to load"), M.setAttribute("message", F)), this._feedback = M, e.appendChild(M), this.emitEvent("error", u ? { message: F, error: h } : { message: F });
      }, b = u?.delay ?? (u?.surface === "compact" ? 200 : 0);
      b > 0 ? E = setTimeout(P, b) : P(), u && (_ = setTimeout(() => A(new Error("The component did not load in time.")), u.timeout ?? 3e4)), (n.mountLifecycle ? _t(s, n.lazyConfig) : n.lazyConfig()).then((h) => {
        !d() || c || (c = !0, z(), f(h));
      }, (h) => {
        c || A(h);
      }).catch(A);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const t = this._vueApp;
    this._vueApp = null, t?.unmount();
  }
};
function Ai() {
  let t = 0;
  return { begin: () => ++t, current: (e) => e === t };
}
const Ze = ["aria-labelledby"], ti = { class: "kx-railhead" }, ei = ["id"], ii = { key: 0 }, ri = { class: "kx-railhead-acts" }, oi = { class: "kx-rail-body" }, Ti = /* @__PURE__ */ I({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(t) {
    const e = Ft();
    return (i, r) => (S(), B("aside", {
      class: qt(["kx-rail", { "kx-settings-list-rail": t.settings }]),
      "aria-labelledby": g(e)
    }, [
      v("div", ti, [
        v("span", {
          id: g(e),
          class: "kx-railhead-title"
        }, [
          et($(t.title), 1),
          t.count !== void 0 ? (S(), B("b", ii, $(t.count), 1)) : Z("", !0)
        ], 8, ei),
        v("div", ri, [
          k(i.$slots, "actions")
        ])
      ]),
      k(i.$slots, "toolbar"),
      v("div", oi, [
        k(i.$slots, "default")
      ])
    ], 10, Ze));
  }
}), Li = /* @__PURE__ */ I({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(t) {
    return (e, i) => (S(), B(Yt, null, [
      C(g(ct), {
        type: "button",
        text: "",
        "aria-label": t.createLabel,
        title: t.createLabel,
        onClick: i[0] || (i[0] = (r) => e.$emit("create"))
      }, {
        icon: y(() => [
          C(g(pt), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      C(g(ct), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: i[1] || (i[1] = (r) => e.$emit("defaults"))
      }, {
        icon: y(() => [
          C(g(pt), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), ni = /* @__PURE__ */ I({
  __name: "Disclosure",
  props: /* @__PURE__ */ Jt({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(t) {
    const e = Kt(t, "open");
    return (i, r) => (S(), K(g(pe), {
      class: "kx-disclosure",
      value: e.value ? "content" : void 0,
      "onUpdate:value": r[0] || (r[0] = (o) => e.value = o === "content")
    }, {
      default: y(() => [
        C(g(de), { value: "content" }, {
          default: y(() => [
            C(g(ce), { class: "kx-disclosure-toggle" }, {
              default: y(() => [
                et($(t.label), 1)
              ]),
              _: 1
            }),
            C(g(le), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: y(() => [
                k(i.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
}), ai = { class: "row wrap pim-error-content" }, Ri = /* @__PURE__ */ I({
  __name: "AdminError",
  props: {
    error: {}
  },
  setup(t) {
    return (e, i) => (S(), K(g(me), {
      severity: "error",
      role: "alert"
    }, {
      default: y(() => [
        v("div", ai, [
          v("div", null, [
            v("div", null, $(t.error.message), 1),
            t.error.code ? (S(), K(ni, {
              key: 0,
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: y(() => [
                i[0] || (i[0] = et(" Error code ", -1)),
                v("code", null, $(t.error.code), 1)
              ]),
              _: 1
            })) : Z("", !0)
          ]),
          k(e.$slots, "default")
        ])
      ]),
      _: 3
    }));
  }
});
class V extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(e, i, r) {
    super(e.message ?? e.error ?? `${i} failed`), this.name = "ApiError", this.kind = e.kind, this.details = e.details, this.retryable = e.retryable, this.status = r;
  }
}
const si = "schema_generation_conflict", Ct = {
  [si]: "This catalog’s settings changed while you were editing.",
  catalog_access_denied: "You don’t have access to this catalog.",
  plugin_cleanup_unavailable: "Restore the plugin package before removing it. The catalog needs the package to clean up the plugin’s data."
};
function Oi(t, e) {
  const i = t instanceof V ? t.details?.code : void 0, r = typeof i == "string" && i ? i : void 0, o = t instanceof Error && t.message ? t.message : e;
  return { message: r && Object.prototype.hasOwnProperty.call(Ct, r) ? Ct[r] : o, code: r };
}
function nt(t, e) {
  const i = t;
  if (i && typeof i == "object" && i.success === !1) throw new V(i, e);
  return i && typeof i == "object" && i.data !== void 0 ? i.data : t;
}
function at(t, e) {
  if (t instanceof V) return t;
  const i = t?.response;
  return i?.data ? new V(i.data, e, i.status) : t instanceof Error ? t : new V({ kind: "Unavailable" }, e);
}
async function T(t, e, i) {
  try {
    return nt((await it.get(t, { params: i })).data, e);
  } catch (r) {
    throw at(r, e);
  }
}
async function L(t, e, i) {
  try {
    return nt((await it.post(t, e)).data, i);
  } catch (r) {
    throw at(r, i);
  }
}
async function pi(t, e, i) {
  try {
    return nt((await it.put(t, e)).data, i);
  } catch (r) {
    throw at(r, i);
  }
}
const x = "/api/v1/pim/catalogs", R = /* @__PURE__ */ new Map(), Vi = {
  catalogSummary: (t) => T(`${x}/${encodeURIComponent(t)}/summary`, "catalog summary"),
  listCatalogs: (t, e) => T(x, "catalog list", {
    admin_only: "true",
    ...t == null ? {} : { after: String(t) },
    ...e ? { text: e } : {}
  }),
  createCatalog: (t, e, i = {}) => L(x, { idempotency_key: `ui-${Date.now()}`, title: t, declaration: e, plugin_configs: i }, "catalog create"),
  history: (t, e = {}) => T(`${x}/${encodeURIComponent(t)}/history`, "catalog history", Object.fromEntries(Object.entries(e).filter(([, i]) => i !== void 0).map(([i, r]) => [i, String(r)]))),
  schema: (t) => T(`${x}/${encodeURIComponent(t)}/schema`, "schema"),
  applySchema: (t, e, i, r = {}) => L(`${x}/${encodeURIComponent(t)}/schema`, { declaration: e, expected_generation: i, plugin_configs: r }, "schema apply"),
  planSchema: (t, e, i, r = {}) => L(`${x}/${encodeURIComponent(t)}/schema/plan`, { declaration: e, expected_generation: i, plugin_configs: r }, "schema plan"),
  resumePluginProjection: (t, e) => pi(`/api/v1/threads/${encodeURIComponent(t)}/projections/resume`, { cursor_id: e }, "resume background update"),
  updateCatalogApp: (t, e) => L(`${x}/${encodeURIComponent(t)}/settings`, { ui_app: e }, "catalog app settings"),
  configurePlugin: (t, e, i, r = !1) => L(`${x}/${encodeURIComponent(t)}/plugins/configure`, { plugin: e, config: i, ...r ? { reset: !0 } : {} }, "plugin configuration"),
  schemaOptions: (t) => T(`${x}/${encodeURIComponent(t)}/schema/options`, "schema options"),
  apply: (t, e) => L(`${x}/${encodeURIComponent(t)}/apply`, { items: e }, "term change"),
  termsPage: (t, e, i) => {
    const r = JSON.stringify([t, e, i]);
    let o = R.get(r);
    return o || (o = T(`${x}/${encodeURIComponent(t)}/terms`, "terms", { vocabulary: e, retired: "true", limit: "50", ...i ? { after: i } : {} }), R.set(r, o), o.catch(() => {
      R.get(r) === o && R.delete(r);
    })), o;
  },
  invalidateTerms: (t) => {
    for (const e of R.keys()) JSON.parse(e)[0] === t && R.delete(e);
  }
}, Y = /* @__PURE__ */ new Map();
function $i(t) {
  let e = Y.get(t);
  return e || (e = Promise.resolve().then(() => oe(t)).then(() => !0, () => (Y.delete(t), !1)), Y.set(t, e)), e;
}
const li = ["aria-label", "aria-busy"], Ii = /* @__PURE__ */ I({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close", "closed"],
  setup(t, { emit: e }) {
    const i = t, r = e, o = O(null);
    let a = null;
    async function s() {
      await Qt();
      const p = o.value;
      p && (i.visible && !p.open ? (a = p.getRootNode().activeElement, p.showModal()) : !i.visible && p.open && (p.close(), a?.focus(), await Promise.allSettled(p.getAnimations?.().map((d) => d.finished) ?? []), i.visible || r("closed")));
    }
    function n(p) {
      p.preventDefault(), i.busy || r("close");
    }
    return Et(() => i.visible, s), St(s), Gt(() => {
      o.value?.open && o.value.close(), a?.focus();
    }), (p, d) => (S(), B("dialog", {
      ref_key: "dialog",
      ref: o,
      class: "native-dialog",
      "aria-label": t.label,
      "aria-modal": "true",
      "aria-busy": t.busy || void 0,
      onCancel: n
    }, [
      k(p.$slots, "default")
    ], 40, li));
  }
}), Mi = '.kx-settings-shell.kx-shell{grid-template-columns:232px minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 232px;min-width:0;background:var(--p-content-background)}.kx-settings-list-rail .kx-railhead{min-height:53px}.kx-settings-list-rail .kx-rail-body{padding:8px 12px 12px}.kx-settings-rail-standalone{display:contents}.kx-settings-rail{flex:0 0 232px;min-width:0;overflow-y:auto;overflow-x:hidden;padding:16px 12px;display:flex;flex-direction:column;gap:14px;border-right:1px solid var(--p-content-border-color)}.kx-settings-rail-section{display:flex;flex-direction:column;gap:2px}.kx-settings-rail-group{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color);margin:2px 0 4px 10px}.kx-settings-rail-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:8px 10px;border:none;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:500;color:var(--p-text-color);background:transparent;transition:background .15s,color .15s}.kx-settings-rail-item:hover:where(:not([aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-rail-item[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-rail-icon{flex:0 0 auto;width:18px;height:18px}.kx-settings-rail-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-rail-leading{display:contents}@media(max-width:640px){.kx-settings-rail{flex:0 0 auto;max-height:40%;flex-direction:row;flex-wrap:wrap;gap:6px;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-settings-rail-section{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}.kx-settings-rail-group{margin:0 6px 0 2px}}.kx-settings-list-rail .kx-settings-rail-framed{padding:0;border:0;overflow:visible}@media(max-width:760px){.kx-settings-shell.kx-shell{grid-template-columns:minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 auto}.kx-settings-rail-framed{gap:8px}.kx-settings-rail-framed .kx-settings-rail-section{flex-flow:row wrap;gap:4px}.kx-settings-rail-framed .kx-settings-rail-group{flex-basis:100%}.kx-settings-rail-framed .kx-settings-rail-item{width:auto}}.kx-settings-list-rail .picker-search{flex:none;padding:8px 10px}.kx-settings-list-rail .picker-search-input{width:100%}.kx-settings-list-rail .picker-search-input::-webkit-search-cancel-button{display:none}.kx-settings-list-rail .picker-search-clear{position:absolute;right:0;top:0;height:100%}.kx-settings-list-rail .picker-search:has(.picker-search-clear) .picker-search-input{padding-inline-end:34px}.kx-settings-list-rail .picker-group{margin:0;padding:10px 6px 4px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--p-text-muted-color)}.kx-settings-list-rail .picker-list{margin:0;padding:0;list-style:none}.kx-settings-list-rail .picker-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:none;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-color);cursor:pointer;text-align:left;transition:background .12s;font:inherit}.kx-settings-list-rail .picker-row:hover:where(:not(:disabled,[aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-list-rail .picker-row[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-list-rail .picker-row:disabled{color:var(--p-text-muted-color);cursor:default}.kx-settings-list-rail .picker-name{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-list-rail .picker-message{color:var(--p-text-muted-color);font-size:11.5px;line-height:1.3;padding:7px 10px}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus:not(:focus-visible){outline:none;box-shadow:none}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:calc(-1 * var(--p-focus-ring-width, 2px));box-shadow:none}.system-section-head{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:12px;margin:0}.system-section-head-text{flex:1 1 180px;min-width:0}.system-section-head-text h1{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px;color:var(--p-text-color)}.system-section-head-text p{margin:2px 0 0;font-size:13px;color:var(--p-text-muted-color)}.system-section-head .kx-head-actions{justify-content:flex-end}.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active{display:grid;grid-template-rows:1fr;overflow:hidden;transition:grid-template-rows var(--p-form-field-transition-duration, .2s) ease-in-out}.kx-disclosure .kx-disclosure-motion-enter-from,.kx-disclosure .kx-disclosure-motion-leave-to{grid-template-rows:0fr}.kx-disclosure .kx-disclosure-content{min-height:0;overflow:hidden}@media(prefers-reduced-motion:reduce){.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active,.kx-disclosure .kx-disclosure-toggle{transition:none}}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-shell{flex:1;min-height:0;display:grid;grid-template-columns:var(--kx-rail-width) minmax(0,1fr);background:var(--p-content-background)}.kx-rail{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--p-content-border-color);background:color-mix(in srgb,var(--p-text-color) 2.5%,var(--p-content-background))}.kx-rail-body{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 12px}.kx-main{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.kx-main-scroll{flex:1;min-height:0;overflow-y:auto;padding:18px 28px 80px 24px;display:flex;flex-direction:column;gap:16px}@media(max-width:760px){.kx-shell{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto minmax(0,1fr)}.kx-rail{max-height:40vh;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-main-scroll{padding:20px 22px 64px}}.kx-railhead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--p-content-border-color)}.kx-railhead-title{font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railhead-title b{color:var(--p-text-muted-color);margin-left:4px;font-variant-numeric:tabular-nums}.kx-railhead-acts{display:flex;align-items:center;gap:2px}.kx-railsec+.kx-railsec{border-top:1px solid var(--p-content-border-color)}.kx-railsec-h{display:flex;align-items:center;gap:6px;width:100%;padding:9px 12px 7px;background:none;border:none;cursor:pointer;font:inherit;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railsec-h:hover{color:var(--p-text-muted-color)}.kx-railsec-chev{width:13px;height:13px;flex:none;transition:transform .15s ease}.kx-railsec:not(.closed) .kx-railsec-chev{transform:rotate(90deg)}.kx-railsec-ic{width:14px;height:14px;flex:none}.kx-railsec-t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-railsec-h .count{margin-left:auto;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.kx-railsec-b{padding:2px 0 8px}.kx-system-tabs.p-tabs{margin-bottom:0;flex:none;min-width:0;border-bottom:1px solid var(--p-content-border-color)}.kx-system-tabs .p-tablist-tab-list{padding-inline:var(--kickside-system-surface-gutter, 24px)}.kx-system-tab-count{padding-inline:6px;border-radius:999px;font-size:inherit;line-height:inherit;background:color-mix(in srgb,currentColor 10%,transparent);font-variant-numeric:tabular-nums}.kx-system-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:12px var(--kickside-system-surface-gutter, 24px);color:var(--p-text-muted-color);font-size:12.5px}.kx-system-pane{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:auto}.kx-system-tools{grid-row:1;min-width:0}.kx-system-body{grid-row:2;min-width:0;min-height:0;overflow:auto}.kx-system-pane:has(>.kx-system-body>.kx-empty){grid-template-rows:minmax(120px,auto) minmax(0,1fr)}.kx-iconbtn{width:28px;height:28px;flex:none;display:grid;place-items:center;cursor:pointer;border:1px solid transparent;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-muted-color);transition:color .14s,background .14s,border-color .14s}.kx-iconbtn:hover:not(:disabled){color:var(--p-text-color);background:var(--kx-surface-2)}.kx-iconbtn.on{color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.kx-iconbtn:disabled{opacity:.55;cursor:default}.kx-iconbtn svg{width:16px;height:16px}.kx-iconbtn.lg{width:var(--kx-control-height);height:var(--kx-control-height)}.kx-iconbtn.sm{width:var(--kx-control-height-sm);height:var(--kx-control-height-sm)}.kx-iconbtn.bordered{border-color:var(--p-content-border-color);background:var(--kx-surface-1);color:var(--p-text-muted-color)}.kx-iconbtn.bordered:hover:not(:disabled){border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-iconbtn.danger:hover:not(:disabled),.kx-iconbtn.danger.on{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-500)}.kx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:var(--kx-control-height);padding:0 14px;border-radius:var(--kx-radius-8);cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;white-space:nowrap;border:1px solid transparent;transition:filter .15s,transform .15s,background .14s,border-color .14s,color .14s}.kx-btn svg{width:15px;height:15px}.kx-btn:disabled{opacity:.5;cursor:not-allowed}.kx-btn.sm{height:var(--kx-control-height-sm);padding:0 12px}.kx-btn-primary{background:var(--p-primary-color);color:var(--p-button-primary-color);border-color:var(--p-primary-color)}.kx-btn-primary:hover:not(:disabled){background:var(--p-primary-hover-color);color:var(--p-button-primary-hover-color);border-color:var(--p-primary-hover-color);transform:translateY(-1px)}.kx-btn-primary:active:not(:disabled){background:var(--p-primary-active-color);color:var(--p-button-primary-active-color);border-color:var(--p-primary-active-color);transform:translateY(0)}.kx-btn-ghost{background:transparent;color:var(--p-text-color);border-color:var(--p-content-border-color)}.kx-btn-ghost:hover:not(:disabled){background:var(--kx-surface-2);border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-btn-soft{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color);border-color:color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.kx-btn-soft:hover:not(:disabled){background:color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.kx-btn-danger{background:var(--p-danger-500);color:var(--p-danger-contrast-color);border-color:var(--p-danger-500)}.kx-btn-danger:hover:not(:disabled){filter:brightness(1.07)}.kx-search{position:relative;display:flex;align-items:center}.kx-search-ico{position:absolute;left:10px;width:15px;height:15px;color:var(--p-text-muted-color);pointer-events:none}.kx-search-input{width:100%;height:var(--kx-control-height);padding:0 30px 0 31px;font:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);transition:border-color .14s,box-shadow .14s}.kx-search-input::placeholder{color:var(--p-text-muted-color)}.kx-search-input:focus{outline:none;border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.kx-search-clear{position:absolute;right:6px;width:22px;height:22px;border-radius:var(--kx-radius-8);display:grid;place-items:center;cursor:pointer;background:transparent;border:none;color:var(--p-text-muted-color)}.kx-search-clear:hover{color:var(--p-text-color);background:var(--kx-surface-2)}.kx-search-clear svg{width:14px;height:14px}.kx-chip{font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:var(--kx-radius-6);background:var(--kx-surface-2);color:var(--p-text-muted-color);border:1px solid var(--p-content-border-color)}.kx-count{min-width:18px;height:16px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color)}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.p-button.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color)!important;outline:none!important;box-shadow:var(--p-focus-ring-shadow)!important}.p-button.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color)!important;outline-offset:var(--p-focus-ring-offset)!important;box-shadow:none!important}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.pim-system{height:100%}.pim-system.pim-catalog-selected{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.pim-system-main{min-width:0;min-height:0;overflow:hidden}.pim-system-main>.kx-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.picker-row-description{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.pim-responsive-table{container:pim-responsive-table / inline-size}.pim-responsive-table>.pim-grid{overflow-wrap:anywhere}.pim-stacked-list{display:none;margin:0;padding:0;list-style:none}.pim-stacked-row{padding:10px 12px;overflow-wrap:break-word}.pim-stacked-row+.pim-stacked-row{border-top:1px solid var(--p-content-border-color)}.pim-stacked-meta{display:flex;flex-wrap:wrap;gap:2px 10px;margin-top:4px}.pim-stacked-meta>*{min-width:0}@container pim-responsive-table (max-width: 600px){.pim-responsive-table>.pim-grid{display:none}.pim-stacked-list{display:block}}.pim-definition{border-bottom:1px solid var(--p-content-border-color)}.pim-definition:last-child{border-bottom:0}.pim-definition-list{container:pim-definition-list / inline-size}.pim-definition-scroll{overflow-x:auto}.pim-definition-grid{display:grid;grid-template-columns:var(--pim-definition-columns);column-gap:10px;min-width:min-content}.pim-definition-grid>.pim-definition,.pim-definition-grid>.pim-definition-columns{grid-column:1 / -1}.pim-definition-grid>.pim-definition{display:grid;grid-template-columns:subgrid}.pim-definition-columns,.pim-definition-head{display:grid;grid-template-columns:subgrid;align-items:center;column-gap:10px;padding:16px;grid-column:1 / -1}.pim-definition-columns{padding-block:8px;font-size:12px;font-weight:600;color:var(--p-text-muted-color);border-bottom:1px solid var(--p-content-border-color)}.pim-definition-head .pim-definition-toggle{display:grid;grid-column:1 / -2;grid-template-columns:subgrid;align-items:center;column-gap:10px;min-width:0;width:100%;color:inherit}.pim-definition-meta{display:contents}.pim-definition-lead{display:flex;align-items:center;gap:2px}.pim-definition-lead svg{width:14px;height:14px;flex:none}.pim-definition-code{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pim-definition-code code{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}.pim-definition-kind{min-width:0}.pim-definition-details{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0}.pim-definition-usage{text-align:right;font-size:12px;color:var(--p-text-muted-color)}.pim-definition-actions{display:flex;align-items:center;justify-content:end;gap:4px}.pim-definition-body{grid-column:1 / -1;width:100cqw;position:sticky;left:0;min-width:0}.pim-row-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}.pim-definition-body{padding:0 16px 16px}.pim-definition-body .pim-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.pim-definition-body .pim-f[class]{grid-column:auto}.pim-definition-body .pim-f[class].pim-w-full{grid-column:1 / -1}@container pim-definition-list (max-width: 560px){.pim-definition-grid{grid-template-columns:minmax(0,1fr);min-width:0}.pim-definition-columns{display:none}.pim-definition-head{grid-template-columns:minmax(0,1fr) auto;gap:8px}.pim-definition-head .pim-definition-toggle{grid-template-columns:auto minmax(0,1fr);gap:4px 8px}.pim-definition-meta{grid-column:2;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}.pim-definition-meta>:empty{display:none}.pim-definition-meta>*{min-width:0;max-width:100%}.pim-definition-meta .pim-definition-code,.pim-definition-meta code,.pim-row-title{white-space:normal;overflow-wrap:break-word}.pim-definition-usage{text-align:left}.pim-definition-body{width:auto;position:static}}.pim-policy-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-policy-row:last-child{border-bottom:0}.pim-policy-copy{flex:1 1 260px}.pim-policy-copy label{font-size:14px;font-weight:600}.pim-policy-copy p{margin:4px 0 0;font-size:12px;color:var(--p-text-muted-color)}.pim-policy-control{flex:0 1 360px;width:min(100%,360px)}@media(max-width:720px){.pim-policy-row{flex-wrap:wrap}.pim-definition-body .pim-fields{grid-template-columns:minmax(0,1fr)}}.pim-definition-list>.pim-add-row{border-top:1px solid var(--p-content-border-color)}.pim-definition-grid>.pim-aspect{grid-column:1 / -1}.pim-policy-intro{margin:0;padding:14px 16px 0}.pim-policy-group{min-width:0}.pim-builder{container:pim-builder / inline-size;overflow:hidden}.pim-ia-content{display:grid;gap:14px;min-width:0}.pim-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pim-overview-card{cursor:default}.pim-overview-action{align-self:flex-start;margin-top:auto}.pim-overview-action:after{content:"";position:absolute;inset:0}.pim-ia-action h3{font-size:14px;font-weight:600}.pim-ia-action{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.pim-plugin-recovery>button{justify-self:start}.pim-ia-action>div:first-child{flex:1 0 min(220px,100%);min-width:0}.pim-ia-action>.pim-add-row,.pim-list-header .pim-add-row,.pim-aspect .pim-add-row{padding:0}.pim-list-header{align-items:center;border-bottom:1px solid var(--p-content-border-color)}.pim-list-header p{margin:0}.pim-list-actions{flex-wrap:wrap}.pim-list-actions>.p-button,.pim-attr-row .pim-definition-actions>.p-button{width:36px;height:36px;padding:0;justify-content:center;flex:none}.pim-attr-row .pim-definition-actions svg,.pim-list-actions>.p-button svg{width:16px;height:16px}.pim-advanced-actions{display:grid;gap:12px}.pim-advanced-actions>.pim-ia-action+.pim-ia-action{border-top:1px solid var(--p-content-border-color);padding-top:12px}.pim-family-fields{align-items:end}.pim-family-fields .p-multiselect{width:100%;min-width:0}.pim-family-fields .p-multiselect-label{flex-wrap:wrap;white-space:normal}.pim-add-level{justify-self:start}.pim-family-requirements-head{margin-bottom:12px}.pim-family-requirements-head h3{margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-family-requirements-head p{margin:0}.pim-field-advanced{margin-top:14px}.pim-group-dialog-actions{flex-wrap:wrap;justify-content:space-between}.pim-group-dialog-actions>:last-child{margin-inline-start:auto}.pim-definition-meta>.pim-definition-details>span+span{margin-left:6px}.pim-ia-dialog{width:min(620px,84vw);padding:20px;display:grid;gap:16px}.pim-ia-dialog-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pim-ia-dialog h2{margin:0;font-size:21px;line-height:1.2}.pim-ia-dialog h3{margin:0;font-size:15px}.pim-ia-dialog p{margin:4px 0 0}.pim-ia-dialog-head p,.pim-ia-review-impact p{color:var(--p-text-muted-color)}.pim-ia-review-impact{padding:12px 14px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.pim-ia-dialog-actions{padding-top:12px;border-top:1px solid var(--p-content-border-color);flex-wrap:wrap}.pim-plan-list{max-height:38dvh;overflow-y:auto;overflow-wrap:anywhere}.pim-policy-value{color:var(--p-text-color);margin:0}.pim-definition-toggle[aria-expanded=true] .pim-definition-chevron{transform:rotate(90deg)}.pim-definition-head:hover,.pim-definition-head:focus-within{background:var(--kx-overlay-hover)}.pim-definition-head:active{background:var(--kx-surface-1)}.pim-definition-toggle:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.pim-access-roles{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr));gap:14px 20px}.pim-access-roles dt{font-weight:600}.pim-access-roles dd{margin:4px 0 0;color:var(--p-text-muted-color)}@media(prefers-reduced-motion:no-preference){.pim-definition-head{transition:background-color .14s}.pim-definition-chevron{transition:transform .15s ease}.pim-expand-enter-active,.pim-expand-leave-active{transition:opacity .15s ease}.pim-expand-enter-from,.pim-expand-leave-to{opacity:0}.pim-ia-content{animation:pim-section-enter .15s ease}@keyframes pim-section-enter{0%{opacity:0}to{opacity:1}}}@container pim-builder (max-width: 600px){.pim-ia-dialog{padding:14px}.pim-overview-grid{grid-template-columns:minmax(0,1fr)}}.pim-review-confirm{margin-top:10px}.pim-section-layout{flex:1;min-height:0;display:flex;align-items:stretch}.pim-section-layout>.kx-main{flex:1}.pim-section-layout .kx-settings-rail-group{overflow-wrap:anywhere}.pim-section-layout .kx-main-scroll{overflow-x:hidden;padding:18px var(--kickside-system-surface-gutter, 24px) 28px}.pim-section-layout .system-section-head{margin-bottom:4px}@media(max-width:760px){.pim-section-layout{flex-direction:column}.pim-section-layout .kx-main-scroll{padding:14px 16px 28px}}@media(prefers-reduced-motion:reduce){.pim-overview-card{transition:none}.pim-overview-card:hover{transform:none}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:var(--p-font-family, inherit);font-size:13px;line-height:1.45}*,*:before,*:after{box-sizing:border-box}.muted{color:var(--p-text-muted-color)}.small{font-size:12px}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}code.mono,span.mono{padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.row{display:flex;align-items:center;gap:10px}.pim-grid{width:100%;border-collapse:collapse}.pim-grid th{text-align:left;font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.pim-grid th,.pim-grid td{height:40px;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}.pim-grid tbody tr:hover{background:var(--kx-overlay-hover)}.pim-grid tr:last-child td{border-bottom:0}.pim-table{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:auto}.pim-interactive{appearance:none;border:0;border-radius:0;background:transparent;color:inherit;font:inherit;letter-spacing:inherit;text-align:left;cursor:pointer;padding:0}.pim-principal-list{display:grid;gap:8px}.pim-principal-service{display:grid;gap:4px}.row.wrap{flex-wrap:wrap}.pim-error-content{color:var(--p-text-color)}.pim-error-code{overflow-wrap:anywhere}.pim-error-code code{margin-inline-start:4px}.pim-principal-service>span{font-size:11.5px;font-weight:680}.pim-group-head{display:flex;align-items:center;gap:8px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-group-head h3{margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-group-head svg{width:16px;height:16px;color:var(--p-text-muted-color)}.kx-head-text{flex:1}.kx-head-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-head-actions .search{width:180px}.pim-panel-head .kx-title{font-size:16px}.pim-title-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.native-dialog{color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:0;max-width:min(680px,92vw);max-height:85vh;overflow:auto}.native-dialog::backdrop{background:var(--p-mask-background)}.native-dialog .dialog-box,.native-dialog .pim-sheet{width:auto;max-width:100%}@media(prefers-reduced-motion:no-preference){.native-dialog{opacity:0;transform:translateY(6px);transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete}.native-dialog[open]{opacity:1;transform:translateY(0)}.native-dialog::backdrop{opacity:0;transition:opacity .18s ease,display .18s allow-discrete,overlay .18s allow-discrete}.native-dialog[open]::backdrop{opacity:1}@starting-style{.native-dialog[open]{opacity:0;transform:translateY(6px)}.native-dialog[open]::backdrop{opacity:0}}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;font-family:var(--kx-font-body)}:host>div{height:100%;min-height:0}.pim-page{height:100%;overflow-y:auto;padding-bottom:32px}.pim-stack{display:grid;gap:14px}.pim-card-body{padding:10px 18px}.pim-card-body.pad{padding:16px 18px}.pim-grid .num{text-align:right;font-variant-numeric:tabular-nums}.pim-table-foot{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--p-content-border-color);color:var(--p-text-muted-color);font-size:12px}.pim-notice{padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--p-warn-500) 12%,transparent);color:var(--p-text-color)}.pim-notice.ok{background:color-mix(in srgb,var(--p-success-500) 12%,transparent)}.pim-aspect{padding:14px 20px 18px;border-top:1px solid var(--p-content-border-color)}.pim-aspect:first-child{border-top:0}.pim-aspect-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}.pim-aspect-head h3{margin:0}.pim-fields{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px 16px}.pim-f{grid-column:span 6;display:grid;gap:4px;align-content:start;min-width:0;position:relative}.pim-f.pim-w-full{grid-column:1 / -1}.pim-f.pim-w-half{grid-column:span 6}.pim-f.pim-w-third{grid-column:span 4}.pim-f.pim-w-quarter{grid-column:span 3}.pim-f-label{display:flex;align-items:baseline;gap:8px;min-width:0;min-height:17px;font-size:11.5px;line-height:17px}.pim-f-label label{font-weight:680;color:var(--p-text-muted-color);white-space:nowrap}.pim-f-label .pim-req{margin-left:2px;color:var(--p-warn-500);font-weight:600;cursor:help}.pim-f-note{margin-left:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--p-text-muted-color)}.pim-f-note.on{color:var(--p-primary-color)}.pim-f.dirty:before{content:"";position:absolute;left:-10px;top:20px;bottom:0;width:2px;border-radius:2px;background:var(--p-primary-color)}@media(max-width:1100px){.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:span 6}}@media(max-width:720px){.pim-f,.pim-f.pim-w-half,.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:1 / -1}}.pim-choices{display:flex;flex-wrap:wrap;gap:6px}.pim-picker{display:grid;gap:8px}.pim-chips{display:flex;flex-wrap:wrap;gap:6px}.dialog-box{width:min(520px,calc(100% - 32px));background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:18px;display:grid;gap:12px}.dialog-box h2{margin:0;font-size:16px}.dialog-actions{display:flex;justify-content:flex-end;gap:8px}.pim-builder{min-width:0;height:100%;min-height:0;display:flex;flex-direction:column;overflow-y:auto}.pim-builder-main{display:grid;gap:14px;min-width:0}.pim-bsection-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 20px 10px}.pim-bsection-head h3{margin:0 0 6px}.pim-bsection-head h3 .mono,.pim-aspect-head h3 .mono{margin-left:8px;font-weight:400}.pim-bsection-head+.pim-aspect{border-top:0}.row.end{justify-content:flex-end;margin-top:10px}.pim-stack.tight{gap:8px}.pim-attr-row:hover{background:var(--kx-overlay-hover)}.pim-add-row{padding:12px 14px;gap:8px}.pim-add-editor{display:flex;flex-wrap:wrap;gap:8px;min-width:0}.pim-add-code-error{flex-basis:100%;margin:0;color:var(--p-message-error-color)}.pim-level{padding:10px 12px;border:1px solid var(--p-content-border-color);border-radius:10px}.pim-level-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px}.pim-axis-help{margin:0 0 6px}.pim-terms{margin-top:10px}.pim-picker-chips{align-items:center}.pim-chip-entry{width:150px;max-width:100%}.pim-plan .pim-plan-list{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px}.pim-plan .pim-plan-list li{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;font-size:13px}.pim-plan .pim-group-head{flex-wrap:wrap}.pim-plan h3,.pim-builder-main>[tabindex="-1"]{scroll-margin-block:24px}.pim-plan .pim-card-body>p{margin:0}.pim-error-copy{color:var(--p-text-color);overflow-wrap:anywhere}.pim-error-code{display:block;font-size:12px;overflow-wrap:anywhere}.pim-editor-surface{border:0;padding:0;margin:0;min-width:0}.pim-readonly{margin-bottom:12px}.pim-config-overrides{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:4px 12px;margin:0;overflow-wrap:anywhere}.pim-config-overrides dd{margin:0}.pim-scope-filters h2{margin:0 0 12px}.pim-page>.pim-table,.pim-page>.pim-editor,.pim-page>.form{margin:18px var(--kickside-system-surface-gutter, 24px) 28px}.form{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:hidden}.form .form{border:0;border-radius:0}.pim-bsection-head h3,.pim-aspect-head h3,.pim-column-group h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-f .p-inputtext,.pim-f .p-textarea,.pim-f .p-select,.pim-f .p-inputnumber{width:100%;min-width:0}.pim-add-row{display:flex;flex-wrap:wrap}.pim-add-editor .p-inputtext{width:min(210px,100%);min-width:0}.pim-json-edit{width:100%}kickside-pim-catalog-settings{display:block;height:100%;min-height:0}.pim-scope-filters-row{padding:12px var(--kickside-system-surface-gutter, 24px)}.pim-scope-filters{padding:16px;margin-bottom:12px}.pim-source-permissions{display:grid;gap:6px;max-width:440px}.pim-source-permissions>label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.pim-contexts{display:grid;gap:8px}.pim-context-row{display:flex;align-items:end;gap:8px;min-width:0}.pim-context-field{display:grid;gap:4px;flex:0 1 180px;min-width:120px}.pim-contexts>.p-button{margin-top:2px;justify-self:start}.pim-builder .pim-policy-status{padding-inline:16px}@media(max-width:540px){.pim-builder .pim-bsection-head{flex-wrap:wrap}.pim-builder .pim-source-permissions{min-width:0}.pim-builder .pim-bsection-head>button{margin-left:auto}}.pim-canvas{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:10px 14px}.pim-lcard{display:grid;gap:8px;min-width:0;padding:10px 12px;border:1px dashed color-mix(in srgb,var(--p-text-color) 22%,transparent);border-radius:10px;background:color-mix(in srgb,var(--p-text-color) 3%,transparent)}.pim-lcard[draggable=true]{cursor:grab}.pim-lcard.dragging{opacity:.45}.pim-lcard.over{border-color:var(--p-primary-color);border-style:solid;box-shadow:inset 0 0 0 1px var(--p-primary-color)}.pim-lcard.fixed{cursor:default;border-style:solid;border-color:var(--p-content-border-color);background:transparent}.pim-lcard-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.pim-lcard .pim-grip{display:inline-flex;color:var(--p-text-muted-color)}.pim-lcard .pim-grip svg{width:14px;height:14px}.pim-lcard-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pim-lcard-type{font-size:11.5px;color:var(--p-text-muted-color);white-space:nowrap}.pim-lcard-move{display:inline-flex;gap:2px;margin-left:auto}.pim-layout-help{margin:0;padding:16px 20px}.pim-lcard .p-selectbutton{display:flex;flex-wrap:wrap}.pim-lcard .p-togglebutton{flex:1;min-width:0;padding-inline:8px}.pim-history-caption{margin:0;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}@media(max-width:600px){.pim-layout .pim-lcard{grid-column:1 / -1!important}}';
export {
  Ci as P,
  si as S,
  Pi as W,
  Ii as _,
  Ri as a,
  Oi as b,
  Ti as c,
  Li as d,
  $i as e,
  L as f,
  ni as g,
  T as h,
  Si as i,
  Ei as j,
  Vi as p,
  Ai as r,
  Mi as s,
  zi as u
};
