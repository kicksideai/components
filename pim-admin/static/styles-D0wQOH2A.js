import Ve from "primevue/config";
import $e from "primevue/contextmenu";
import Ie from "primevue/menu";
import Me from "primevue/portal";
import { renderSlot as R, createCommentVNode as ve, h as Ne, Teleport as je, ref as P, onMounted as ye, onUnmounted as He, watch as ke, createApp as Ue, inject as Q, defineComponent as X, useModel as Be, openBlock as N, createBlock as F, unref as A, withCtx as z, createVNode as B, createTextVNode as _e, toDisplayString as q, mergeModels as De, createElementVNode as O, onBeforeUnmount as We, createElementBlock as Fe, nextTick as qe } from "vue";
import { addCollection as Ye } from "@iconify/vue";
import { config as ne, addIcons as Ke, on as Je, applyThemeMode as V, host as Ge, hostCss as Qe, loadCss as Xe, api as Z, loadByTagName as Ze } from "@wippy-fe/proxy";
import { getActivePinia as et, createPinia as tt, setActivePinia as it } from "pinia";
import rt from "primevue/accordion";
import ot from "primevue/accordioncontent";
import nt from "primevue/accordionheader";
import at from "primevue/accordionpanel";
import st from "primevue/message";
const pt = "data-wippy-overlay-layer";
function Ce() {
  return typeof window < "u" && typeof window.document < "u";
}
function Se() {
  return Ce() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function lt() {
  return Se() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const ct = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let dt = 0;
const j = /* @__PURE__ */ new WeakMap();
function ae(e, t) {
  const i = e.style;
  i.setProperty("position", "fixed", "important"), i.setProperty("inset", "auto", "important"), i.setProperty("margin", "0", "important"), i.setProperty("position-anchor", t), i.setProperty("position-area", "bottom span-right"), i.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), i.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), i.setProperty("max-width", "stretch", "important");
}
function mt(e, t) {
  if (!ct.test(e.className))
    return;
  const i = e.style.cssText;
  ae(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = i;
    return;
  }
  if (!j.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && ae(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), j.set(e, r);
  }
}
function ee(e) {
  const t = j.get(e);
  t && (t.disconnect(), j.delete(e));
}
function ut(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function Y(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const H = /* @__PURE__ */ new Set(), te = /* @__PURE__ */ new WeakMap();
let se = !1, K = !1;
const pe = ["w-theme-dark", "w-theme-light"], $ = "data-wippy-theme-root", J = /* @__PURE__ */ new WeakMap();
function ht(e) {
  const t = [];
  let i = e ? e.parentNode : null;
  for (; i && i.nodeType === 1; )
    t.push(i), i = i.parentNode;
  return t;
}
function xt(e, t, i) {
  const r = [...ht(t), i.host], o = () => {
    let s;
    for (const n of r) {
      if (pe.some((p) => n.classList.contains(p))) {
        s = n;
        break;
      }
      if (n.hasAttribute($))
        break;
    }
    for (const n of pe)
      e.classList.toggle(n, !!(s && s.classList.contains(n)));
    s ? e.setAttribute($, "") : e.removeAttribute($);
  };
  o();
  const a = new MutationObserver(o);
  for (const s of r)
    a.observe(s, { attributes: !0, attributeFilter: ["class", $] });
  J.set(e, a);
}
function Ee(e) {
  J.get(e)?.disconnect(), J.delete(e);
}
function ft() {
  K = !1;
  for (const e of H) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && ee(t);
      H.delete(e), te.get(e)?.disconnect(), Ee(e);
      continue;
    }
    e.childElementCount > 0 && Y(e);
  }
}
function le() {
  K || (K = !0, requestAnimationFrame(ft));
}
function gt(e) {
  const t = document.createElement("div");
  t.setAttribute(pt, "");
  const i = Se();
  if (t.style.cssText = i ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", i && t.setAttribute("popover", "manual"), e.appendChild(t), i) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Y(t);
  const r = new MutationObserver((o) => {
    const a = t.__wippyAnchorName;
    for (const s of o) {
      if (a)
        for (const n of Array.from(s.addedNodes))
          n instanceof HTMLElement && mt(n, a);
      for (const n of Array.from(s.removedNodes))
        n instanceof HTMLElement && ee(n);
    }
    t.isConnected && t.childElementCount > 0 && Y(t);
  });
  return r.observe(t, { childList: !0 }), te.set(t, r), H.add(t), se || (se = !0, window.addEventListener("scroll", le, { capture: !0, passive: !0 }), window.addEventListener("resize", le, { passive: !0 })), t;
}
function ce(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = gt(e.hostRoot), xt(e.layer, e.$el, e.hostRoot), lt())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++dt}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function de(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && ee(t);
    H.delete(e.layer), te.get(e.layer)?.disconnect(), Ee(e.layer), e.layer.remove(), e.layer = null;
  }
}
let me = !1;
function bt() {
  if (me)
    return;
  const e = Ie;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const i = t.composedPath(), r = this.container && !i.includes(this.container), o = !(this.target && i.includes(this.target));
      this.overlayVisible && r && o ? this.hide() : !this.popup && r && o && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, me = !0);
}
let ue = !1;
function wt() {
  if (ue)
    return;
  const e = $e;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const i = t.composedPath(), r = this.container && !i.includes(this.container), o = this.visible ? !(this.target && i.includes(this.target)) : !0;
      r && o && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, ue = !0);
}
let he = !1;
function vt() {
  if (he)
    return;
  he = !0;
  const e = Me;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Ce() && (this.hostRoot = ut(this.$el), this.mounted = !0, this.hostRoot && (this.inline || ce(this), this.$watch("inline", (t) => {
      t ? de(this) : ce(this);
    })));
  }, e.render = function() {
    return this.inline ? R(this.$slots, "default", { key: 0 }) : this.mounted ? Ne(je, { key: 1, to: this.resolvedTarget || document.body }, [
      R(this.$slots, "default")
    ]) : ve("", !0);
  }, e.unmounted = function() {
    de(this);
  };
}
const mi = {
  install: (e) => {
    bt(), wt(), vt(), e.use(Ve, { theme: "none" });
  }
};
var G = "data-wippy-visible";
function xe(e) {
  const t = e.getAttribute(G);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var yt = Object.defineProperty, ze = (e) => {
  throw TypeError(e);
}, kt = (e, t, i) => t in e ? yt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, m = (e, t, i) => kt(e, typeof t != "symbol" ? t + "" : t, i), Pe = (e, t, i) => t.has(e) || ze("Cannot " + i), _t = (e, t, i) => (Pe(e, t, "read from private field"), i ? i.call(e) : t.get(e)), Ct = (e, t, i) => t.has(e) ? ze("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), St = (e, t, i, r) => (Pe(e, t, "write to private field"), t.set(e, i), i), Et = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], zt = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function fe(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Pt(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of e)
    if (i)
      for (const [r, o] of Object.entries(i)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [s, n] of Object.entries(o)) {
            const p = typeof n == "string" ? fe(s) : null;
            p && t.add(p);
          }
          continue;
        }
        const a = typeof o == "string" ? fe(r) : null;
        a && t.add(a);
      }
  return [...t].sort();
}
function At(e) {
  if (e.length === 0)
    return "";
  const t = e.map((i) => `  ${i}: inherit;`).join(`
`);
  return `${zt} {
${t}
}`;
}
function Tt(e, t) {
  const i = At(t);
  i && Ae(e, i, "@wippy-fe/css-variables-bridge");
}
function Rt(e, t) {
  const r = (t ?? Et).map(async (o) => {
    const a = Qe[o];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Xe(a);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${a}):`, s), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const a of o) {
      if (!a)
        continue;
      const s = document.createElement("style");
      s.textContent = a, s.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(s);
    }
  });
}
function Lt(e, t) {
  const i = document.createElement("style");
  i.textContent = t, e.appendChild(i);
}
function Ae(e, t, i) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", i), r.textContent = t, e.appendChild(r);
}
function Ot(e, t) {
  Ae(e, t, "@wippy-fe/custom-css");
}
function Te(e) {
  return e.__wippyHost ?? null;
}
function Vt(e) {
  return e.replace(/-([a-z])/g, (t, i) => i.toUpperCase());
}
function $t(e, t, i) {
  switch (i.type) {
    case "string":
      return { value: t };
    case "number": {
      const r = Number.parseFloat(t);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(t, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(t);
        return i.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function D(e, t) {
  const i = {}, r = [];
  for (const [o, a] of Object.entries(t.properties)) {
    const s = e.getAttribute(o), n = Vt(o);
    if (s === null) {
      a.default !== void 0 && (i[n] = a.default);
      continue;
    }
    const p = $t(o, s, a);
    p.error ? r.push(p.error) : i[n] = p.value;
  }
  return { props: i, errors: r };
}
var It = class {
  constructor(e, t) {
    m(this, "_props"), m(this, "_errors"), m(this, "_content"), m(this, "_hostVisibility"), m(this, "_propsListeners", /* @__PURE__ */ new Set()), m(this, "_contentListeners", /* @__PURE__ */ new Set()), m(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), m(this, "_disposed", !1), m(this, "_emitToDom"), m(this, "props"), m(this, "events"), m(this, "content"), m(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
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
    }, this.content = e.hasContent ? {
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
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const i of this._propsListeners)
        i(e, t);
    }
  }
  /** @internal */
  notifyContent(e) {
    if (!this._disposed) {
      this._content = e;
      for (const t of this._contentListeners)
        t(e);
    }
  }
  /** @internal */
  notifyHostVisibility(e, t) {
    if (!(this._disposed || e === t)) {
      this._hostVisibility = e;
      for (const i of this._hostVisibilityListeners)
        i(e, t);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(e), t?.immediate && e(this._props, this._errors);
    const i = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", i);
    };
    return t?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const i = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", i);
    };
    return t?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const i = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", i);
    };
    return t?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
}, M, Mt = class extends HTMLElement {
  constructor() {
    super(), m(this, "_internals"), m(this, "_contentObserver", null), m(this, "_initialized", !1), m(this, "_container", null), Ct(this, M, null), m(this, "_attachment", 0), m(this, "_reactive", null), m(this, "_lastProps", null), m(this, "_lastErrors", []), m(this, "_lastContent", null), m(this, "_themeUnsub", null), m(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = xe(this);
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), i = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...i, G])];
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
    return Te(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(e, t) {
    this.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      detail: t
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
      const e = this.constructor.wippyConfig, t = !!e.contentTemplate;
      let i, r;
      if (this._lastProps !== null)
        i = this._lastProps, r = this._lastErrors;
      else {
        const a = D(this, e.propsSchema);
        e.validateProps && a.errors.push(...e.validateProps(a.props)), i = a.props, r = a.errors, this._lastProps = i, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new It(
        { props: i, errors: r, content: o, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const e = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, i = this._initialized, r = _t(this, M) ?? St(this, M, this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" }));
      let o;
      if (this._container)
        o = this._container;
      else {
        if (this.onInit(r), e !== this._attachment)
          return;
        t.inlineCss && Lt(r, t.inlineCss);
        try {
          const f = ne?.theming, l = Pt(
            f?.global?.cssVariables,
            f?.children?.cssVariables
          );
          Tt(r, l);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const f = ne?.theming, l = [f?.global?.customCSS, f?.children?.customCSS].filter(Boolean).join(`
`);
            l && Ot(r, l);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && Rt(r, t.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const d = t.containerClasses ?? [];
        d.length > 0 && o.classList.add(...d), r.appendChild(o), this._container = o, Ke(Ye);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Je("@theme", (d) => this._applyTheme(d)));
      const { props: a, errors: s } = D(this, t.propsSchema);
      t.validateProps && s.push(...t.validateProps(a));
      const n = a;
      this._lastProps = n, this._lastErrors = s;
      let p = null;
      if (t.contentTemplate && (p = this._extractContent(t.contentTemplate), this._lastContent = p, this._contentObserver = new MutationObserver(() => {
        const d = this._extractContent(t.contentTemplate);
        this._lastContent = d, this._reactive?.notifyContent(d), this.onContentChanged(d);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, o, n, s, p, i), e !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), i || (this._initialized = !0), this.onReady(), e === this._attachment && this.emitEvent("load");
    } catch (t) {
      if (e !== this._attachment || (this.onError(t), e !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: t instanceof Error ? t.message : String(t),
        error: t
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
  _applyTheme(e = Ge.getThemeMode?.()) {
    V(e, this), this._container && V(e, this._container);
  }
  disconnectedCallback() {
    const e = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), V("auto", this), this._container && V("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), e === this._attachment && (this.emitEvent("unload"), e === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(e, t, i) {
    if (t === i)
      return;
    if (e === G) {
      const n = this._hostVisible, p = xe(this);
      if (p === n)
        return;
      this._hostVisible = p, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(p, n), this.onHostVisibilityChanged(p, n));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: a } = D(this, r.propsSchema);
    r.validateProps && a.push(...r.validateProps(o));
    const s = o;
    this._lastProps = s, this._lastErrors = a, this._reactive?.notifyProps(s, a), this.onPropsChanged(s, a);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(e) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(e) {
    console.error(`${this.constructor.name} initialization failed:`, e);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(e, t) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(e, t) {
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
  _extractContent(e) {
    const t = this.querySelector(`template[data-type="${e}"]`);
    return t ? t.content.textContent?.trim() || t.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
M = /* @__PURE__ */ new WeakMap();
function Nt(e) {
  return e.__wippyHostBus ?? null;
}
function jt(e) {
  return e.dataset.wippyPanelId ?? null;
}
var Ht = Object.defineProperty, Ut = (e, t, i) => t in e ? Ht(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, b = (e, t, i) => Ut(e, typeof t != "symbol" ? t + "" : t, i);
function ge(e, t, i) {
  const r = e.createElement("div"), o = i ? t.failed : t.loading;
  r.dataset.lazyState = i ? "failed" : "loading", r.setAttribute("role", i ? "alert" : "status"), r.setAttribute("aria-label", o), r.style.cssText = "display:grid;place-items:center;text-align:center;";
  const a = t.surface === "page";
  if (r.style.cssText += a ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", i)
    r.style.color = "var(--p-danger-500, currentColor)", r.textContent = !a && t.iconOnly ? "⚠" : o, !a && t.iconOnly && (r.title = o);
  else {
    const s = e.createElement("style");
    s.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const n = e.createElement("span");
    n.dataset.wippySpinner = "", n.setAttribute("aria-hidden", "true"), n.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", n.style.fontSize = a ? "2rem" : "1em", r.append(s, n);
  }
  return r;
}
var Re = /* @__PURE__ */ Symbol("wippy:emit"), Le = /* @__PURE__ */ Symbol("wippy:props"), Bt = /* @__PURE__ */ Symbol("wippy:props_error"), Dt = /* @__PURE__ */ Symbol("wippy:content"), Wt = /* @__PURE__ */ Symbol("wippy:panel-id"), Ft = /* @__PURE__ */ Symbol("wippy:layout-bus"), qt = /* @__PURE__ */ Symbol("wippy:host"), Oe = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ui() {
  const e = Q(Le);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function hi() {
  const e = Q(Re);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function Yt() {
  const e = Q(Oe);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function xi(e) {
  const t = Yt();
  let i = !1, r = null, o = !1;
  function a() {
    if (r)
      return o = !0, r;
    let s;
    try {
      s = Promise.resolve(e());
    } catch (p) {
      s = Promise.reject(p);
    }
    const n = s.finally(() => {
      if (r === n && (r = null, i && o))
        return o = !1, a();
    });
    return r = n, n;
  }
  return ye(() => (i = !0, a())), He(() => {
    i = !1, o = !1;
  }), ke(t, (s, n) => {
    if (i && n === !1 && s === !0)
      return a();
  }), t;
}
var I = /* @__PURE__ */ new WeakMap();
function be(e, t) {
  const i = I.get(e);
  if (i)
    return i;
  const r = Promise.resolve().then(t);
  return I.set(e, r), r.catch(() => {
    I.get(e) === r && I.delete(e);
  }), r;
}
var fi = class extends Mt {
  constructor() {
    super(...arguments), b(this, "_vueApp", null), b(this, "_mountingApp", !1), b(this, "_mountState", "idle"), b(this, "_feedback", null), b(this, "_propsRef", P({})), b(this, "_errorsRef", P([])), b(this, "_contentRef", P(null)), b(this, "_hostVisibilityRef", P(null)), b(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const e = this.vueConfig;
    e.mountLifecycle && !e.rootComponent && e.lazyConfig && await be(this, e.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(e, t, i, r, o, a) {
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
      const u = et(), c = Ue(l.rootComponent);
      let v = !1, w = !1, y, k;
      this._mountingApp = !0;
      try {
        const _ = tt();
        if (l.piniaPlugins)
          for (const g of l.piniaPlugins)
            _.use(g);
        c.use(_);
        for (const g of l.plugins ?? [])
          c.use(g);
        if (c.provide(Le, this._propsRef), c.provide(Bt, this._errorsRef), c.provide(Re, this.emitEvent.bind(this)), c.provide(Dt, this._contentRef), c.provide(Oe, this._hostVisibilityRef), c.provide(Wt, jt(this)), c.provide(Ft, Nt(this)), c.provide(qt, Te(this)), l.providers?.(c, this), !d())
          return;
        if (k = c.config.errorHandler, n.mountLifecycle && (c.config.errorHandler = (g, oe, h) => {
          w || (y = g), w = !0, k?.(g, oe, h);
        }), c.mount(t), v = !0, w)
          throw y;
        d() && (this._vueApp = c);
      } finally {
        n.mountLifecycle && v && (c.config.errorHandler = k);
        try {
          v && (w || !d()) && c.unmount();
        } finally {
          it(u), this._mountingApp = !1;
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
      const l = t.ownerDocument, u = n.lazyUi;
      u?.surface === "page" && (t.style.blockSize = "100%", t.style.minBlockSize = "0");
      let c = !1, v, w;
      const y = () => {
        clearTimeout(v), clearTimeout(w), this._feedback?.remove(), this._feedback = null;
      };
      p.signal.addEventListener("abort", y, { once: !0 });
      const k = () => {
        if (!d() || c)
          return;
        const h = u ? ge(l, u, !1) : l.createElement("wippy-loading");
        h.setAttribute("no-bg", ""), this._feedback = h, t.appendChild(h);
      }, _ = (h) => {
        if (!d())
          return;
        c = !0, y(), this._mountState = "failed";
        const U = u?.failed ?? (h instanceof Error ? h.message : String(h)), L = u ? ge(l, u, !0) : l.createElement("wippy-error");
        u || (L.setAttribute("title", "Failed to load"), L.setAttribute("message", U)), this._feedback = L, t.appendChild(L), this.emitEvent("error", u ? { message: U, error: h } : { message: U });
      }, g = u?.delay ?? (u?.surface === "compact" ? 200 : 0);
      g > 0 ? v = setTimeout(k, g) : k(), u && (w = setTimeout(() => _(new Error("The component did not load in time.")), u.timeout ?? 3e4)), (n.mountLifecycle ? be(s, n.lazyConfig) : n.lazyConfig()).then((h) => {
        !d() || c || (c = !0, y(), f(h));
      }, (h) => {
        c || _(h);
      }).catch(_);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const e = this._vueApp;
    this._vueApp = null, e?.unmount();
  }
};
function gi() {
  let e = 0;
  return { begin: () => ++e, current: (t) => t === e };
}
const Kt = /* @__PURE__ */ X({
  __name: "Disclosure",
  props: /* @__PURE__ */ De({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Be(e, "open");
    return (i, r) => (N(), F(A(rt), {
      class: "kx-disclosure",
      value: t.value ? "content" : void 0,
      "onUpdate:value": r[0] || (r[0] = (o) => t.value = o === "content")
    }, {
      default: z(() => [
        B(A(at), { value: "content" }, {
          default: z(() => [
            B(A(nt), { class: "kx-disclosure-toggle" }, {
              default: z(() => [
                _e(q(e.label), 1)
              ]),
              _: 1
            }),
            B(A(ot), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: z(() => [
                R(i.$slots, "default")
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
}), Jt = { class: "row wrap pim-error-content" }, bi = /* @__PURE__ */ X({
  __name: "AdminError",
  props: {
    error: {}
  },
  setup(e) {
    return (t, i) => (N(), F(A(st), {
      severity: "error",
      role: "alert"
    }, {
      default: z(() => [
        O("div", Jt, [
          O("div", null, [
            O("div", null, q(e.error.message), 1),
            e.error.code ? (N(), F(Kt, {
              key: 0,
              class: "small pim-error-code pim-ia-disclosure",
              label: "Technical details"
            }, {
              default: z(() => [
                i[0] || (i[0] = _e(" Error code ", -1)),
                O("code", null, q(e.error.code), 1)
              ]),
              _: 1
            })) : ve("", !0)
          ]),
          R(t.$slots, "default")
        ])
      ]),
      _: 3
    }));
  }
});
class T extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(t, i, r) {
    super(t.message ?? t.error ?? `${i} failed`), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.retryable = t.retryable, this.status = r;
  }
}
const Gt = "schema_generation_conflict", we = {
  [Gt]: "This catalog’s settings changed while you were editing.",
  catalog_access_denied: "You don’t have access to this catalog.",
  plugin_cleanup_unavailable: "Restore the plugin package before removing it. The catalog needs the package to clean up the plugin’s data."
};
function wi(e, t) {
  const i = e instanceof T ? e.details?.code : void 0, r = typeof i == "string" && i ? i : void 0, o = e instanceof Error && e.message ? e.message : t;
  return { message: r && Object.prototype.hasOwnProperty.call(we, r) ? we[r] : o, code: r };
}
function ie(e, t) {
  const i = e;
  if (i && typeof i == "object" && i.success === !1) throw new T(i, t);
  return i && typeof i == "object" && i.data !== void 0 ? i.data : e;
}
function re(e, t) {
  if (e instanceof T) return e;
  const i = e?.response;
  return i?.data ? new T(i.data, t, i.status) : e instanceof Error ? e : new T({ kind: "Unavailable" }, t);
}
async function C(e, t, i) {
  try {
    return ie((await Z.get(e, { params: i })).data, t);
  } catch (r) {
    throw re(r, t);
  }
}
async function S(e, t, i) {
  try {
    return ie((await Z.post(e, t)).data, i);
  } catch (r) {
    throw re(r, i);
  }
}
async function Qt(e, t, i) {
  try {
    return ie((await Z.put(e, t)).data, i);
  } catch (r) {
    throw re(r, i);
  }
}
const x = "/api/v1/pim/catalogs", E = /* @__PURE__ */ new Map(), vi = {
  catalogSummary: (e) => C(`${x}/${encodeURIComponent(e)}/summary`, "catalog summary"),
  listCatalogs: (e, t) => C(x, "catalog list", {
    admin_only: "true",
    ...e == null ? {} : { after: String(e) },
    ...t ? { text: t } : {}
  }),
  createCatalog: (e, t, i = {}) => S(x, { idempotency_key: `ui-${Date.now()}`, title: e, declaration: t, plugin_configs: i }, "catalog create"),
  history: (e, t = {}) => C(`${x}/${encodeURIComponent(e)}/history`, "catalog history", Object.fromEntries(Object.entries(t).filter(([, i]) => i !== void 0).map(([i, r]) => [i, String(r)]))),
  schema: (e) => C(`${x}/${encodeURIComponent(e)}/schema`, "schema"),
  applySchema: (e, t, i, r = {}) => S(`${x}/${encodeURIComponent(e)}/schema`, { declaration: t, expected_generation: i, plugin_configs: r }, "schema apply"),
  planSchema: (e, t, i, r = {}) => S(`${x}/${encodeURIComponent(e)}/schema/plan`, { declaration: t, expected_generation: i, plugin_configs: r }, "schema plan"),
  resumePluginProjection: (e, t) => Qt(`/api/v1/threads/${encodeURIComponent(e)}/projections/resume`, { cursor_id: t }, "resume background update"),
  updateCatalogApp: (e, t) => S(`${x}/${encodeURIComponent(e)}/settings`, { ui_app: t }, "catalog app settings"),
  configurePlugin: (e, t, i, r = !1) => S(`${x}/${encodeURIComponent(e)}/plugins/configure`, { plugin: t, config: i, ...r ? { reset: !0 } : {} }, "plugin configuration"),
  schemaOptions: (e) => C(`${x}/${encodeURIComponent(e)}/schema/options`, "schema options"),
  apply: (e, t) => S(`${x}/${encodeURIComponent(e)}/apply`, { items: t }, "term change"),
  termsPage: (e, t, i) => {
    const r = JSON.stringify([e, t, i]);
    let o = E.get(r);
    return o || (o = C(`${x}/${encodeURIComponent(e)}/terms`, "terms", { vocabulary: t, retired: "true", limit: "50", ...i ? { after: i } : {} }), E.set(r, o), o.catch(() => {
      E.get(r) === o && E.delete(r);
    })), o;
  },
  invalidateTerms: (e) => {
    for (const t of E.keys()) JSON.parse(t)[0] === e && E.delete(t);
  }
}, W = /* @__PURE__ */ new Map();
function yi(e) {
  let t = W.get(e);
  return t || (t = Promise.resolve().then(() => Ze(e)).then(() => !0, () => (W.delete(e), !1)), W.set(e, t)), t;
}
const Xt = ["aria-label", "aria-busy"], ki = /* @__PURE__ */ X({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close", "closed"],
  setup(e, { emit: t }) {
    const i = e, r = t, o = P(null);
    let a = null;
    async function s() {
      await qe();
      const p = o.value;
      p && (i.visible && !p.open ? (a = p.getRootNode().activeElement, p.showModal()) : !i.visible && p.open && (p.close(), a?.focus(), await Promise.allSettled(p.getAnimations?.().map((d) => d.finished) ?? []), i.visible || r("closed")));
    }
    function n(p) {
      p.preventDefault(), i.busy || r("close");
    }
    return ke(() => i.visible, s), ye(s), We(() => {
      o.value?.open && o.value.close(), a?.focus();
    }), (p, d) => (N(), Fe("dialog", {
      ref_key: "dialog",
      ref: o,
      class: "native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: n
    }, [
      R(p.$slots, "default")
    ], 40, Xt));
  }
}), _i = '.kx-settings-rail{flex:0 0 232px;min-width:0;overflow-y:auto;overflow-x:hidden;padding:16px 12px;display:flex;flex-direction:column;gap:14px;border-right:1px solid var(--p-content-border-color)}.kx-settings-rail-section{display:flex;flex-direction:column;gap:2px}.kx-settings-rail-group{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color);margin:2px 0 4px 10px}.kx-settings-rail-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:8px 10px;border:none;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:500;color:var(--p-text-color);background:transparent;transition:background .15s,color .15s}.kx-settings-rail-item:hover{background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-rail-item:where([aria-current=true]){background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-rail-icon{flex:0 0 auto;width:18px;height:18px}.kx-settings-rail-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-rail-leading{display:contents}@media(max-width:640px){.kx-settings-rail{flex:0 0 auto;max-height:40%;flex-direction:row;flex-wrap:wrap;gap:6px;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-settings-rail-section{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}.kx-settings-rail-group{margin:0 6px 0 2px}}.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active{display:grid;grid-template-rows:1fr;overflow:hidden;transition:grid-template-rows var(--p-form-field-transition-duration, .2s) ease-in-out}.kx-disclosure .kx-disclosure-motion-enter-from,.kx-disclosure .kx-disclosure-motion-leave-to{grid-template-rows:0fr}.kx-disclosure .kx-disclosure-content{min-height:0;overflow:hidden}@media(prefers-reduced-motion:reduce){.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active,.kx-disclosure .kx-disclosure-toggle{transition:none}}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-shell{flex:1;min-height:0;display:grid;grid-template-columns:var(--kx-rail-width) minmax(0,1fr);background:var(--p-content-background)}.kx-rail{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--p-content-border-color);background:color-mix(in srgb,var(--p-text-color) 2.5%,var(--p-content-background))}.kx-rail-body{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 12px}.kx-main{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.kx-main-scroll{flex:1;min-height:0;overflow-y:auto;padding:18px 28px 80px 24px;display:flex;flex-direction:column;gap:16px}@media(max-width:760px){.kx-shell{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto minmax(0,1fr)}.kx-rail{max-height:40vh;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-main-scroll{padding:20px 22px 64px}}.kx-railhead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--p-content-border-color)}.kx-railhead-title{font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railhead-title b{color:var(--p-text-muted-color);margin-left:4px;font-variant-numeric:tabular-nums}.kx-railhead-acts{display:flex;align-items:center;gap:2px}.kx-railsec+.kx-railsec{border-top:1px solid var(--p-content-border-color)}.kx-railsec-h{display:flex;align-items:center;gap:6px;width:100%;padding:9px 12px 7px;background:none;border:none;cursor:pointer;font:inherit;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railsec-h:hover{color:var(--p-text-muted-color)}.kx-railsec-chev{width:13px;height:13px;flex:none;transition:transform .15s ease}.kx-railsec:not(.closed) .kx-railsec-chev{transform:rotate(90deg)}.kx-railsec-ic{width:14px;height:14px;flex:none}.kx-railsec-t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-railsec-h .count{margin-left:auto;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.kx-railsec-b{padding:2px 0 8px}.kx-system-tabs.p-tabs{margin-bottom:0;flex:none;min-width:0;border-bottom:1px solid var(--p-content-border-color)}.kx-system-tabs .p-tablist-tab-list{padding-inline:var(--kickside-system-surface-gutter, 24px)}.kx-system-tab-count{padding-inline:6px;border-radius:999px;font-size:inherit;line-height:inherit;background:color-mix(in srgb,currentColor 10%,transparent);font-variant-numeric:tabular-nums}.kx-system-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:12px var(--kickside-system-surface-gutter, 24px);color:var(--p-text-muted-color);font-size:12.5px}.kx-system-pane{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:auto}.kx-system-tools{grid-row:1;min-width:0}.kx-system-body{grid-row:2;min-width:0;min-height:0;overflow:auto}.kx-system-pane:has(>.kx-system-body>.kx-empty){grid-template-rows:minmax(120px,auto) minmax(0,1fr)}.kx-iconbtn{width:28px;height:28px;flex:none;display:grid;place-items:center;cursor:pointer;border:1px solid transparent;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-muted-color);transition:color .14s,background .14s,border-color .14s}.kx-iconbtn:hover:not(:disabled){color:var(--p-text-color);background:var(--kx-surface-2)}.kx-iconbtn.on{color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.kx-iconbtn:disabled{opacity:.55;cursor:default}.kx-iconbtn svg{width:16px;height:16px}.kx-iconbtn.lg{width:var(--kx-control-height);height:var(--kx-control-height)}.kx-iconbtn.sm{width:var(--kx-control-height-sm);height:var(--kx-control-height-sm)}.kx-iconbtn.bordered{border-color:var(--p-content-border-color);background:var(--kx-surface-1);color:var(--p-text-muted-color)}.kx-iconbtn.bordered:hover:not(:disabled){border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-iconbtn.danger:hover:not(:disabled),.kx-iconbtn.danger.on{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-500)}.kx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:var(--kx-control-height);padding:0 14px;border-radius:var(--kx-radius-8);cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;white-space:nowrap;border:1px solid transparent;transition:filter .15s,transform .15s,background .14s,border-color .14s,color .14s}.kx-btn svg{width:15px;height:15px}.kx-btn:disabled{opacity:.5;cursor:not-allowed}.kx-btn.sm{height:var(--kx-control-height-sm);padding:0 12px}.kx-btn-primary{background:var(--p-primary-color);color:var(--p-button-primary-color);border-color:var(--p-primary-color)}.kx-btn-primary:hover:not(:disabled){background:var(--p-primary-hover-color);color:var(--p-button-primary-hover-color);border-color:var(--p-primary-hover-color);transform:translateY(-1px)}.kx-btn-primary:active:not(:disabled){background:var(--p-primary-active-color);color:var(--p-button-primary-active-color);border-color:var(--p-primary-active-color);transform:translateY(0)}.kx-btn-ghost{background:transparent;color:var(--p-text-color);border-color:var(--p-content-border-color)}.kx-btn-ghost:hover:not(:disabled){background:var(--kx-surface-2);border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-btn-soft{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color);border-color:color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.kx-btn-soft:hover:not(:disabled){background:color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.kx-btn-danger{background:var(--p-danger-500);color:var(--p-danger-contrast-color);border-color:var(--p-danger-500)}.kx-btn-danger:hover:not(:disabled){filter:brightness(1.07)}.kx-search{position:relative;display:flex;align-items:center}.kx-search-ico{position:absolute;left:10px;width:15px;height:15px;color:var(--p-text-muted-color);pointer-events:none}.kx-search-input{width:100%;height:var(--kx-control-height);padding:0 30px 0 31px;font:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);transition:border-color .14s,box-shadow .14s}.kx-search-input::placeholder{color:var(--p-text-muted-color)}.kx-search-input:focus{outline:none;border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.kx-search-clear{position:absolute;right:6px;width:22px;height:22px;border-radius:var(--kx-radius-8);display:grid;place-items:center;cursor:pointer;background:transparent;border:none;color:var(--p-text-muted-color)}.kx-search-clear:hover{color:var(--p-text-color);background:var(--kx-surface-2)}.kx-search-clear svg{width:14px;height:14px}.kx-chip{font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:var(--kx-radius-6);background:var(--kx-surface-2);color:var(--p-text-muted-color);border:1px solid var(--p-content-border-color)}.kx-count{min-width:18px;height:16px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color)}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.p-button.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color)!important;outline:none!important;box-shadow:var(--p-focus-ring-shadow)!important}.p-button.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color)!important;outline-offset:var(--p-focus-ring-offset)!important;box-shadow:none!important}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.pim-system{height:100%}.pim-system.pim-catalog-selected{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.pim-system-main{min-width:0;min-height:0;overflow:hidden}.pim-system-main>.kx-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.picker-search{flex:none;padding:8px 10px}.picker-search-input{width:100%}.picker-search-input::-webkit-search-cancel-button{display:none}.picker-search-clear{position:absolute;right:0;top:0;height:100%}.picker-search:has(.picker-search-clear) .picker-search-input{padding-inline-end:34px}.pim-catalog-picker .kx-rail-body{padding:0 8px 10px}.picker-group{margin:0;padding:10px 6px 4px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--p-text-muted-color)}.picker-list{margin:0;padding:0;list-style:none}.picker-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:none;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-color);cursor:pointer;text-align:left;transition:background .12s;font:inherit}.picker-row:hover:where(:not(:disabled)){background:var(--kx-overlay-hover)}.picker-row[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.picker-row:disabled{color:var(--p-text-muted-color);cursor:default}.picker-name{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.picker-message{color:var(--p-text-muted-color);font-size:11.5px;line-height:1.3;padding:7px 10px}.picker-row-description{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}:is(.picker-row,.kx-settings-rail-item):focus:not(:focus-visible){outline:none;box-shadow:none}:is(.picker-row,.kx-settings-rail-item):focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:-2px;box-shadow:none}.pim-responsive-table{container:pim-responsive-table / inline-size}.pim-responsive-table>.pim-grid{overflow-wrap:anywhere}.pim-stacked-list{display:none;margin:0;padding:0;list-style:none}.pim-stacked-row{padding:10px 12px;overflow-wrap:break-word}.pim-stacked-row+.pim-stacked-row{border-top:1px solid var(--p-content-border-color)}.pim-stacked-meta{display:flex;flex-wrap:wrap;gap:2px 10px;margin-top:4px}.pim-stacked-meta>*{min-width:0}@container pim-responsive-table (max-width: 600px){.pim-responsive-table>.pim-grid{display:none}.pim-stacked-list{display:block}}.pim-definition{border-bottom:1px solid var(--p-content-border-color)}.pim-definition:last-child{border-bottom:0}.pim-definition-list{container:pim-definition-list / inline-size}.pim-definition-scroll{overflow-x:auto}.pim-definition-grid{display:grid;grid-template-columns:var(--pim-definition-columns);column-gap:10px;min-width:min-content}.pim-definition-grid>.pim-definition,.pim-definition-grid>.pim-definition-columns{grid-column:1 / -1}.pim-definition-grid>.pim-definition{display:grid;grid-template-columns:subgrid}.pim-definition-columns,.pim-definition-head{display:grid;grid-template-columns:subgrid;align-items:center;column-gap:10px;padding:16px;grid-column:1 / -1}.pim-definition-columns{padding-block:8px;font-size:12px;font-weight:600;color:var(--p-text-muted-color);border-bottom:1px solid var(--p-content-border-color)}.pim-definition-head .pim-definition-toggle{display:grid;grid-column:1 / -2;grid-template-columns:subgrid;align-items:center;column-gap:10px;min-width:0;width:100%;color:inherit}.pim-definition-meta{display:contents}.pim-definition-lead{display:flex;align-items:center;gap:2px}.pim-definition-lead svg{width:14px;height:14px;flex:none}.pim-definition-code{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pim-definition-code code{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}.pim-definition-kind{min-width:0}.pim-definition-details{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0}.pim-definition-usage{text-align:right;font-size:12px;color:var(--p-text-muted-color)}.pim-definition-actions{display:flex;align-items:center;justify-content:end;gap:4px}.pim-definition-body{grid-column:1 / -1;width:100cqw;position:sticky;left:0;min-width:0}.pim-row-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}.pim-definition-body{padding:0 16px 16px}.pim-definition-body .pim-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.pim-definition-body .pim-f[class]{grid-column:auto}.pim-definition-body .pim-f[class].pim-w-full{grid-column:1 / -1}@container pim-definition-list (max-width: 560px){.pim-definition-grid{grid-template-columns:minmax(0,1fr);min-width:0}.pim-definition-columns{display:none}.pim-definition-head{grid-template-columns:minmax(0,1fr) auto;gap:8px}.pim-definition-head .pim-definition-toggle{grid-template-columns:auto minmax(0,1fr);gap:4px 8px}.pim-definition-meta{grid-column:2;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}.pim-definition-meta>:empty{display:none}.pim-definition-meta>*{min-width:0;max-width:100%}.pim-definition-meta .pim-definition-code,.pim-definition-meta code,.pim-row-title{white-space:normal;overflow-wrap:break-word}.pim-definition-usage{text-align:left}.pim-definition-body{width:auto;position:static}}.pim-policy-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-policy-row:last-child{border-bottom:0}.pim-policy-copy{flex:1 1 260px}.pim-policy-copy label{font-size:14px;font-weight:600}.pim-policy-copy p{margin:4px 0 0;font-size:12px;color:var(--p-text-muted-color)}.pim-policy-control{flex:0 1 360px;width:min(100%,360px)}@media(max-width:720px){.pim-policy-row{flex-wrap:wrap}.pim-definition-body .pim-fields{grid-template-columns:minmax(0,1fr)}}.pim-definition-list>.pim-add-row{border-top:1px solid var(--p-content-border-color)}.pim-definition-grid>.pim-aspect{grid-column:1 / -1}.pim-policy-intro{margin:0;padding:14px 16px 0}.pim-policy-group{min-width:0}.pim-builder{container:pim-builder / inline-size;overflow:hidden}.pim-ia-content{display:grid;gap:14px;min-width:0}.pim-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.pim-overview-card{cursor:default}.pim-overview-action{align-self:flex-start;margin-top:auto}.pim-overview-action:after{content:"";position:absolute;inset:0}.pim-ia-action h3{font-size:14px;font-weight:600}.pim-ia-action{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.pim-plugin-recovery>button{justify-self:start}.pim-ia-action>div:first-child{flex:1 0 min(220px,100%);min-width:0}.pim-ia-action>.pim-add-row,.pim-list-header .pim-add-row,.pim-aspect .pim-add-row{padding:0}.pim-list-header{align-items:center;border-bottom:1px solid var(--p-content-border-color)}.pim-list-header p{margin:0}.pim-list-actions{flex-wrap:wrap}.pim-list-actions>.p-button,.pim-attr-row .pim-definition-actions>.p-button{width:36px;height:36px;padding:0;justify-content:center;flex:none}.pim-attr-row .pim-definition-actions svg,.pim-list-actions>.p-button svg{width:16px;height:16px}.pim-advanced-actions{display:grid;gap:12px}.pim-advanced-actions>.pim-ia-action+.pim-ia-action{border-top:1px solid var(--p-content-border-color);padding-top:12px}.pim-family-fields{align-items:end}.pim-family-fields .p-multiselect{width:100%;min-width:0}.pim-family-fields .p-multiselect-label{flex-wrap:wrap;white-space:normal}.pim-add-level{justify-self:start}.pim-family-requirements-head{margin-bottom:12px}.pim-family-requirements-head h3{margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-family-requirements-head p{margin:0}.pim-family-filter.form{overflow:visible}.pim-field-advanced{margin-top:14px}.pim-group-dialog-actions{flex-wrap:wrap;justify-content:space-between}.pim-group-dialog-actions>:last-child{margin-inline-start:auto}.pim-definition-meta>.pim-definition-details>span+span{margin-left:6px}.pim-ia-dialog{width:min(620px,84vw);padding:20px;display:grid;gap:16px}.pim-ia-dialog-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.pim-ia-dialog h2{margin:0;font-size:21px;line-height:1.2}.pim-ia-dialog h3{margin:0;font-size:15px}.pim-ia-dialog p{margin:4px 0 0}.pim-ia-dialog-head p,.pim-ia-review-impact p{color:var(--p-text-muted-color)}.pim-ia-review-impact{padding:12px 14px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.pim-ia-dialog-actions{padding-top:12px;border-top:1px solid var(--p-content-border-color);flex-wrap:wrap}.pim-plan-list{max-height:38dvh;overflow-y:auto;overflow-wrap:anywhere}.pim-policy-value{color:var(--p-text-color);margin:0}.pim-definition-toggle[aria-expanded=true] .pim-definition-chevron{transform:rotate(90deg)}.pim-definition-head:hover,.pim-definition-head:focus-within{background:var(--kx-overlay-hover)}.pim-definition-head:active{background:var(--kx-surface-1)}.pim-definition-toggle:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.pim-access-roles{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr));gap:14px 20px}.pim-access-roles dt{font-weight:600}.pim-access-roles dd{margin:4px 0 0;color:var(--p-text-muted-color)}@media(prefers-reduced-motion:no-preference){.pim-definition-head{transition:background-color .14s}.pim-definition-chevron{transition:transform .15s ease}.pim-expand-enter-active,.pim-expand-leave-active{transition:opacity .15s ease}.pim-expand-enter-from,.pim-expand-leave-to{opacity:0}.pim-ia-content{animation:pim-section-enter .15s ease}@keyframes pim-section-enter{0%{opacity:0}to{opacity:1}}}@container pim-builder (max-width: 600px){.pim-ia-dialog{padding:14px}.pim-overview-grid{grid-template-columns:minmax(0,1fr)}}.pim-review-confirm{margin-top:10px}.pim-section-layout{flex:1;min-height:0;display:flex;align-items:stretch}.pim-section-layout>.kx-main{flex:1}.pim-section-layout .kx-settings-rail-group{overflow-wrap:anywhere}.pim-section-layout .kx-main-scroll{overflow-x:hidden;padding:18px var(--kickside-system-surface-gutter, 24px) 28px}.pim-section-layout .system-section-head{margin-bottom:4px}@media(max-width:640px){.pim-section-layout{flex-direction:column}.pim-section-layout .kx-main-scroll{padding:14px 16px 28px}}.pim-section-facts{margin:0 0 16px}@media(prefers-reduced-motion:reduce){.pim-overview-card{transition:none}.pim-overview-card:hover{transform:none}}.system-section-head{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:12px;margin:0}.system-section-head-text{flex:1 1 180px;min-width:0}.system-section-head-text h1{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px;color:var(--p-text-color)}.system-section-head-text p{margin:2px 0 0;font-size:13px;color:var(--p-text-muted-color)}.system-section-head .kx-head-actions{justify-content:flex-end}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:var(--p-font-family, inherit);font-size:13px;line-height:1.45}*,*:before,*:after{box-sizing:border-box}.muted{color:var(--p-text-muted-color)}.small{font-size:12px}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}code.mono,span.mono{padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.row{display:flex;align-items:center;gap:10px}.pim-grid{width:100%;border-collapse:collapse}.pim-grid th{text-align:left;font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.pim-grid th,.pim-grid td{height:40px;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}.pim-grid tbody tr:hover{background:var(--kx-overlay-hover)}.pim-grid tr:last-child td{border-bottom:0}.pim-table{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:auto}.pim-interactive{appearance:none;border:0;border-radius:0;background:transparent;color:inherit;font:inherit;letter-spacing:inherit;text-align:left;cursor:pointer;padding:0}.pim-principal-list{display:grid;gap:8px}.pim-principal-service{display:grid;gap:4px}.row.wrap{flex-wrap:wrap}.pim-error-content{color:var(--p-text-color)}.pim-error-code{overflow-wrap:anywhere}.pim-error-code code{margin-inline-start:4px}.pim-principal-service>span{font-size:11.5px;font-weight:680}.pim-group-head{display:flex;align-items:center;gap:8px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-group-head h3{margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-group-head svg{width:16px;height:16px;color:var(--p-text-muted-color)}.kx-head-text{flex:1}.kx-head-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-head-actions .search{width:180px}.pim-panel-head .kx-title{font-size:16px}.pim-title-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.native-dialog{color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:0;max-width:min(680px,92vw);max-height:85vh;overflow:auto}.native-dialog::backdrop{background:var(--p-mask-background)}.native-dialog .dialog-box,.native-dialog .pim-sheet{width:auto;max-width:100%}@media(prefers-reduced-motion:no-preference){.native-dialog{opacity:0;transform:translateY(6px);transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete}.native-dialog[open]{opacity:1;transform:translateY(0)}.native-dialog::backdrop{opacity:0;transition:opacity .18s ease,display .18s allow-discrete,overlay .18s allow-discrete}.native-dialog[open]::backdrop{opacity:1}@starting-style{.native-dialog[open]{opacity:0;transform:translateY(6px)}.native-dialog[open]::backdrop{opacity:0}}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;font-family:var(--kx-font-body)}:host>div{height:100%;min-height:0}.pim-page{height:100%;overflow-y:auto;padding-bottom:32px}.pim-stack{display:grid;gap:14px}.pim-card-body{padding:10px 18px}.pim-card-body.pad{padding:16px 18px}.pim-grid .num{text-align:right;font-variant-numeric:tabular-nums}.pim-table-foot{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--p-content-border-color);color:var(--p-text-muted-color);font-size:12px}.pim-notice{padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--p-warn-500) 12%,transparent);color:var(--p-text-color)}.pim-notice.ok{background:color-mix(in srgb,var(--p-success-500) 12%,transparent)}.pim-aspect{padding:14px 20px 18px;border-top:1px solid var(--p-content-border-color)}.pim-aspect:first-child{border-top:0}.pim-aspect-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}.pim-aspect-head h3{margin:0}.pim-fields{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px 16px}.pim-f{grid-column:span 6;display:grid;gap:4px;align-content:start;min-width:0;position:relative}.pim-f.pim-w-full{grid-column:1 / -1}.pim-f.pim-w-half{grid-column:span 6}.pim-f.pim-w-third{grid-column:span 4}.pim-f.pim-w-quarter{grid-column:span 3}.pim-f-label{display:flex;align-items:baseline;gap:8px;min-width:0;min-height:17px;font-size:11.5px;line-height:17px}.pim-f-label label{font-weight:680;color:var(--p-text-muted-color);white-space:nowrap}.pim-f-label .pim-req{margin-left:2px;color:var(--p-warn-500);font-weight:600;cursor:help}.pim-f-note{margin-left:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--p-text-muted-color)}.pim-f-note.on{color:var(--p-primary-color)}.pim-f.dirty:before{content:"";position:absolute;left:-10px;top:20px;bottom:0;width:2px;border-radius:2px;background:var(--p-primary-color)}@media(max-width:1100px){.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:span 6}}@media(max-width:720px){.pim-f,.pim-f.pim-w-half,.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:1 / -1}}.pim-choices{display:flex;flex-wrap:wrap;gap:6px}.pim-picker{display:grid;gap:8px}.pim-chips{display:flex;flex-wrap:wrap;gap:6px}.dialog-box{width:min(520px,calc(100% - 32px));background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:18px;display:grid;gap:12px}.dialog-box h2{margin:0;font-size:16px}.dialog-actions{display:flex;justify-content:flex-end;gap:8px}.pim-builder{min-width:0;height:100%;min-height:0;display:flex;flex-direction:column;overflow-y:auto}.pim-builder-main{display:grid;gap:14px;min-width:0}.pim-bsection-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 20px 10px}.pim-bsection-head h3{margin:0 0 6px}.pim-bsection-head h3 .mono,.pim-aspect-head h3 .mono{margin-left:8px;font-weight:400}.pim-bsection-head+.pim-aspect{border-top:0}.row.end{justify-content:flex-end;margin-top:10px}.pim-stack.tight{gap:8px}.pim-attr-row:hover{background:var(--kx-overlay-hover)}.pim-add-row{padding:12px 14px;gap:8px}.pim-add-editor{display:flex;flex-wrap:wrap;gap:8px;min-width:0}.pim-add-code-error{flex-basis:100%;margin:0;color:var(--p-message-error-color)}.pim-level{padding:10px 12px;border:1px solid var(--p-content-border-color);border-radius:10px}.pim-level-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px}.pim-axis-help{margin:0 0 6px}.pim-terms{margin-top:10px}.pim-picker-chips{align-items:center}.pim-chip-entry{width:150px;max-width:100%}.pim-plan .pim-plan-list{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px}.pim-plan .pim-plan-list li{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;font-size:13px}.pim-plan .pim-group-head{flex-wrap:wrap}.pim-plan h3,.pim-builder-main>[tabindex="-1"]{scroll-margin-block:24px}.pim-plan .pim-card-body>p{margin:0}.pim-error-copy{color:var(--p-text-color);overflow-wrap:anywhere}.pim-error-code{display:block;font-size:12px;overflow-wrap:anywhere}.pim-editor-surface{border:0;padding:0;margin:0;min-width:0}.pim-readonly{margin-bottom:12px}.pim-config-overrides{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:4px 12px;margin:0;overflow-wrap:anywhere}.pim-config-overrides dd{margin:0}.pim-scope-filters h2{margin:0 0 12px}.pim-page>.pim-table,.pim-page>.pim-editor,.pim-page>.form{margin:18px var(--kickside-system-surface-gutter, 24px) 28px}.form{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:hidden}.form .form{border:0;border-radius:0}.pim-bsection-head h3,.pim-aspect-head h3,.pim-column-group h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-f .p-inputtext,.pim-f .p-textarea,.pim-f .p-select,.pim-f .p-inputnumber{width:100%;min-width:0}.pim-add-row{display:flex;flex-wrap:wrap}.pim-add-editor .p-inputtext{width:min(210px,100%);min-width:0}.pim-json-edit{width:100%}kickside-pim-catalog-settings{display:block;height:100%;min-height:0}.pim-scope-filters-row{padding:12px var(--kickside-system-surface-gutter, 24px)}.pim-scope-filters{padding:16px;margin-bottom:12px}.pim-source-permissions{display:grid;gap:6px;max-width:440px}.pim-source-permissions>label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.pim-contexts{display:grid;gap:8px}.pim-context-row{display:flex;align-items:end;gap:8px;min-width:0}.pim-context-field{display:grid;gap:4px;flex:0 1 180px;min-width:120px}.pim-contexts>.p-button{margin-top:2px;justify-self:start}.pim-builder .pim-policy-status{padding-inline:16px}@media(max-width:540px){.pim-builder .pim-bsection-head{flex-wrap:wrap}.pim-builder .pim-source-permissions{min-width:0}.pim-builder .pim-bsection-head>button{margin-left:auto}}.pim-canvas{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:10px 14px}.pim-lcard{display:grid;gap:8px;min-width:0;padding:10px 12px;border:1px dashed color-mix(in srgb,var(--p-text-color) 22%,transparent);border-radius:10px;background:color-mix(in srgb,var(--p-text-color) 3%,transparent)}.pim-lcard[draggable=true]{cursor:grab}.pim-lcard.dragging{opacity:.45}.pim-lcard.over{border-color:var(--p-primary-color);border-style:solid;box-shadow:inset 0 0 0 1px var(--p-primary-color)}.pim-lcard.fixed{cursor:default;border-style:solid;border-color:var(--p-content-border-color);background:transparent}.pim-lcard-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.pim-lcard .pim-grip{display:inline-flex;color:var(--p-text-muted-color)}.pim-lcard .pim-grip svg{width:14px;height:14px}.pim-lcard-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pim-lcard-type{font-size:11.5px;color:var(--p-text-muted-color);white-space:nowrap}.pim-lcard-move{display:inline-flex;gap:2px;margin-left:auto}.pim-layout-help{margin:0;padding:16px 20px}.pim-lcard .p-selectbutton{display:flex;flex-wrap:wrap}.pim-lcard .p-togglebutton{flex:1;min-width:0;padding-inline:8px}.pim-history-caption{margin:0;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}@media(max-width:600px){.pim-layout .pim-lcard{grid-column:1 / -1!important}}';
export {
  mi as P,
  Gt as S,
  fi as W,
  ki as _,
  bi as a,
  wi as b,
  S as c,
  Kt as d,
  yi as e,
  ui as f,
  C as g,
  hi as h,
  vi as p,
  gi as r,
  _i as s,
  xi as u
};
