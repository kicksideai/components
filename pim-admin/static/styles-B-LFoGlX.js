import vt from "primevue/config";
import kt from "primevue/contextmenu";
import _t from "primevue/menu";
import Ct from "primevue/portal";
import { renderSlot as H, createCommentVNode as St, h as Et, Teleport as zt, ref as P, onMounted as Pt, onUnmounted as Tt, watch as At, createApp as Lt, inject as D, defineComponent as Rt, openBlock as Ot, createElementBlock as Vt } from "vue";
import { addCollection as It } from "@iconify/vue";
import { config as Y, addIcons as $t, on as Mt, applyThemeMode as T, host as Nt, hostCss as Ht, loadCss as jt, api as pt, loadByTagName as Ut } from "@wippy-fe/proxy";
import { getActivePinia as Wt, createPinia as Bt, setActivePinia as Dt } from "pinia";
const Ft = "data-wippy-overlay-layer";
function lt() {
  return typeof window < "u" && typeof window.document < "u";
}
function ct() {
  return lt() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function qt() {
  return ct() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Kt = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Yt = 0;
const V = /* @__PURE__ */ new WeakMap();
function J(t, e) {
  const i = t.style;
  i.setProperty("position", "fixed", "important"), i.setProperty("inset", "auto", "important"), i.setProperty("margin", "0", "important"), i.setProperty("position-anchor", e), i.setProperty("position-area", "bottom span-right"), i.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), i.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), i.setProperty("max-width", "stretch", "important");
}
function Jt(t, e) {
  if (!Kt.test(t.className))
    return;
  const i = t.style.cssText;
  J(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = i;
    return;
  }
  if (!V.has(t)) {
    const r = new MutationObserver(() => {
      const o = t.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && J(t, e);
    });
    r.observe(t, { attributes: !0, attributeFilter: ["style"] }), V.set(t, r);
  }
}
function F(t) {
  const e = V.get(t);
  e && (e.disconnect(), V.delete(t));
}
function Gt(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function j(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const I = /* @__PURE__ */ new Set(), q = /* @__PURE__ */ new WeakMap();
let G = !1, U = !1;
const Q = ["w-theme-dark", "w-theme-light"], A = "data-wippy-theme-root", W = /* @__PURE__ */ new WeakMap();
function Qt(t) {
  const e = [];
  let i = t ? t.parentNode : null;
  for (; i && i.nodeType === 1; )
    e.push(i), i = i.parentNode;
  return e;
}
function Xt(t, e, i) {
  const r = [...Qt(e), i.host], o = () => {
    let a;
    for (const n of r) {
      if (Q.some((l) => n.classList.contains(l))) {
        a = n;
        break;
      }
      if (n.hasAttribute(A))
        break;
    }
    for (const n of Q)
      t.classList.toggle(n, !!(a && a.classList.contains(n)));
    a ? t.setAttribute(A, "") : t.removeAttribute(A);
  };
  o();
  const s = new MutationObserver(o);
  for (const a of r)
    s.observe(a, { attributes: !0, attributeFilter: ["class", A] });
  W.set(t, s);
}
function dt(t) {
  W.get(t)?.disconnect(), W.delete(t);
}
function Zt() {
  U = !1;
  for (const t of I) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && F(e);
      I.delete(t), q.get(t)?.disconnect(), dt(t);
      continue;
    }
    t.childElementCount > 0 && j(t);
  }
}
function X() {
  U || (U = !0, requestAnimationFrame(Zt));
}
function te(t) {
  const e = document.createElement("div");
  e.setAttribute(Ft, "");
  const i = ct();
  if (e.style.cssText = i ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", i && e.setAttribute("popover", "manual"), t.appendChild(e), i) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  j(e);
  const r = new MutationObserver((o) => {
    const s = e.__wippyAnchorName;
    for (const a of o) {
      if (s)
        for (const n of Array.from(a.addedNodes))
          n instanceof HTMLElement && Jt(n, s);
      for (const n of Array.from(a.removedNodes))
        n instanceof HTMLElement && F(n);
    }
    e.isConnected && e.childElementCount > 0 && j(e);
  });
  return r.observe(e, { childList: !0 }), q.set(e, r), I.add(e), G || (G = !0, window.addEventListener("scroll", X, { capture: !0, passive: !0 }), window.addEventListener("resize", X, { passive: !0 })), e;
}
function Z(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = te(t.hostRoot), Xt(t.layer, t.$el, t.hostRoot), qt())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++Yt}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function tt(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && F(e);
    I.delete(t.layer), q.get(t.layer)?.disconnect(), dt(t.layer), t.layer.remove(), t.layer = null;
  }
}
let et = !1;
function ee() {
  if (et)
    return;
  const t = _t;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const i = e.composedPath(), r = this.container && !i.includes(this.container), o = !(this.target && i.includes(this.target));
      this.overlayVisible && r && o ? this.hide() : !this.popup && r && o && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, et = !0);
}
let it = !1;
function ie() {
  if (it)
    return;
  const t = kt;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const i = e.composedPath(), r = this.container && !i.includes(this.container), o = this.visible ? !(this.target && i.includes(this.target)) : !0;
      r && o && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, it = !0);
}
let rt = !1;
function re() {
  if (rt)
    return;
  rt = !0;
  const t = Ct;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    lt() && (this.hostRoot = Gt(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Z(this), this.$watch("inline", (e) => {
      e ? tt(this) : Z(this);
    })));
  }, t.render = function() {
    return this.inline ? H(this.$slots, "default", { key: 0 }) : this.mounted ? Et(zt, { key: 1, to: this.resolvedTarget || document.body }, [
      H(this.$slots, "default")
    ]) : St("", !0);
  }, t.unmounted = function() {
    tt(this);
  };
}
const je = {
  install: (t) => {
    ee(), ie(), re(), t.use(vt, { theme: "none" });
  }
};
var B = "data-wippy-visible";
function ot(t) {
  const e = t.getAttribute(B);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var oe = Object.defineProperty, mt = (t) => {
  throw TypeError(t);
}, ne = (t, e, i) => e in t ? oe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i, d = (t, e, i) => ne(t, typeof e != "symbol" ? e + "" : e, i), ht = (t, e, i) => e.has(t) || mt("Cannot " + i), se = (t, e, i) => (ht(t, e, "read from private field"), i ? i.call(t) : e.get(t)), ae = (t, e, i) => e.has(t) ? mt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), pe = (t, e, i, r) => (ht(t, e, "write to private field"), e.set(t, i), i), le = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], ce = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function nt(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function de(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const i of t)
    if (i)
      for (const [r, o] of Object.entries(i)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [a, n] of Object.entries(o)) {
            const l = typeof n == "string" ? nt(a) : null;
            l && e.add(l);
          }
          continue;
        }
        const s = typeof o == "string" ? nt(r) : null;
        s && e.add(s);
      }
  return [...e].sort();
}
function me(t) {
  if (t.length === 0)
    return "";
  const e = t.map((i) => `  ${i}: inherit;`).join(`
`);
  return `${ce} {
${e}
}`;
}
function he(t, e) {
  const i = me(e);
  i && ut(t, i, "@wippy-fe/css-variables-bridge");
}
function ue(t, e) {
  const r = (e ?? le).map(async (o) => {
    const s = Ht[o];
    if (!s)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await jt(s);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${s}):`, a), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const s of o) {
      if (!s)
        continue;
      const a = document.createElement("style");
      a.textContent = s, a.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(a);
    }
  });
}
function fe(t, e) {
  const i = document.createElement("style");
  i.textContent = e, t.appendChild(i);
}
function ut(t, e, i) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", i), r.textContent = e, t.appendChild(r);
}
function ge(t, e) {
  ut(t, e, "@wippy-fe/custom-css");
}
function ft(t) {
  return t.__wippyHost ?? null;
}
function xe(t) {
  return t.replace(/-([a-z])/g, (e, i) => i.toUpperCase());
}
function be(t, e, i) {
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
function M(t, e) {
  const i = {}, r = [];
  for (const [o, s] of Object.entries(e.properties)) {
    const a = t.getAttribute(o), n = xe(o);
    if (a === null) {
      s.default !== void 0 && (i[n] = s.default);
      continue;
    }
    const l = be(o, a, s);
    l.error ? r.push(l.error) : i[n] = l.value;
  }
  return { props: i, errors: r };
}
var we = class {
  constructor(t, e) {
    d(this, "_props"), d(this, "_errors"), d(this, "_content"), d(this, "_hostVisibility"), d(this, "_propsListeners", /* @__PURE__ */ new Set()), d(this, "_contentListeners", /* @__PURE__ */ new Set()), d(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), d(this, "_disposed", !1), d(this, "_emitToDom"), d(this, "props"), d(this, "events"), d(this, "content"), d(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
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
}, R, ye = class extends HTMLElement {
  constructor() {
    super(), d(this, "_internals"), d(this, "_contentObserver", null), d(this, "_initialized", !1), d(this, "_container", null), ae(this, R, null), d(this, "_attachment", 0), d(this, "_reactive", null), d(this, "_lastProps", null), d(this, "_lastErrors", []), d(this, "_lastContent", null), d(this, "_themeUnsub", null), d(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ot(this);
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
    return [.../* @__PURE__ */ new Set([...e, ...i, B])];
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
    return ft(this);
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
        const s = M(this, t.propsSchema);
        t.validateProps && s.errors.push(...t.validateProps(s.props)), i = s.props, r = s.errors, this._lastProps = i, this._lastErrors = r;
      }
      const o = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = o), this._reactive = new we(
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
      const e = this.constructor.wippyConfig, i = this._initialized, r = se(this, R) ?? pe(this, R, this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" }));
      let o;
      if (this._container)
        o = this._container;
      else {
        if (this.onInit(r), t !== this._attachment)
          return;
        e.inlineCss && fe(r, e.inlineCss);
        try {
          const g = Y?.theming, p = de(
            g?.global?.cssVariables,
            g?.children?.cssVariables
          );
          he(r, p);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const g = Y?.theming, p = [g?.global?.customCSS, g?.children?.customCSS].filter(Boolean).join(`
`);
            p && ge(r, p);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && ue(r, e.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const m = e.containerClasses ?? [];
        m.length > 0 && o.classList.add(...m), r.appendChild(o), this._container = o, $t(It);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Mt("@theme", (m) => this._applyTheme(m)));
      const { props: s, errors: a } = M(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(s));
      const n = s;
      this._lastProps = n, this._lastErrors = a;
      let l = null;
      if (e.contentTemplate && (l = this._extractContent(e.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const m = this._extractContent(e.contentTemplate);
        this._lastContent = m, this._reactive?.notifyContent(m), this.onContentChanged(m);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, o, n, a, l, i), t !== this._attachment)
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
  _applyTheme(t = Nt.getThemeMode?.()) {
    T(t, this), this._container && T(t, this._container);
  }
  disconnectedCallback() {
    const t = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), T("auto", this), this._container && T("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), t === this._attachment && (this.emitEvent("unload"), t === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(t, e, i) {
    if (e === i)
      return;
    if (t === B) {
      const n = this._hostVisible, l = ot(this);
      if (l === n)
        return;
      this._hostVisible = l, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(l, n), this.onHostVisibilityChanged(l, n));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: s } = M(this, r.propsSchema);
    r.validateProps && s.push(...r.validateProps(o));
    const a = o;
    this._lastProps = a, this._lastErrors = s, this._reactive?.notifyProps(a, s), this.onPropsChanged(a, s);
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
R = /* @__PURE__ */ new WeakMap();
function ve(t) {
  return t.__wippyHostBus ?? null;
}
function ke(t) {
  return t.dataset.wippyPanelId ?? null;
}
var _e = Object.defineProperty, Ce = (t, e, i) => e in t ? _e(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i, b = (t, e, i) => Ce(t, typeof e != "symbol" ? e + "" : e, i);
function st(t, e, i) {
  const r = t.createElement("div"), o = i ? e.failed : e.loading;
  r.dataset.lazyState = i ? "failed" : "loading", r.setAttribute("role", i ? "alert" : "status"), r.setAttribute("aria-label", o), r.style.cssText = "display:grid;place-items:center;text-align:center;";
  const s = e.surface === "page";
  if (r.style.cssText += s ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", i)
    r.style.color = "var(--p-danger-500, currentColor)", r.textContent = !s && e.iconOnly ? "⚠" : o, !s && e.iconOnly && (r.title = o);
  else {
    const a = t.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const n = t.createElement("span");
    n.dataset.wippySpinner = "", n.setAttribute("aria-hidden", "true"), n.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", n.style.fontSize = s ? "2rem" : "1em", r.append(a, n);
  }
  return r;
}
var gt = /* @__PURE__ */ Symbol("wippy:emit"), xt = /* @__PURE__ */ Symbol("wippy:props"), Se = /* @__PURE__ */ Symbol("wippy:props_error"), Ee = /* @__PURE__ */ Symbol("wippy:content"), ze = /* @__PURE__ */ Symbol("wippy:panel-id"), Pe = /* @__PURE__ */ Symbol("wippy:layout-bus"), Te = /* @__PURE__ */ Symbol("wippy:host"), bt = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Ue() {
  const t = D(xt);
  if (!t)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return t;
}
function We() {
  const t = D(gt);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
function Ae() {
  const t = D(bt);
  if (!t)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return t;
}
function Be(t) {
  const e = Ae();
  let i = !1, r = null, o = !1;
  function s() {
    if (r)
      return o = !0, r;
    let a;
    try {
      a = Promise.resolve(t());
    } catch (l) {
      a = Promise.reject(l);
    }
    const n = a.finally(() => {
      if (r === n && (r = null, i && o))
        return o = !1, s();
    });
    return r = n, n;
  }
  return Pt(() => (i = !0, s())), Tt(() => {
    i = !1, o = !1;
  }), At(e, (a, n) => {
    if (i && n === !1 && a === !0)
      return s();
  }), e;
}
var L = /* @__PURE__ */ new WeakMap();
function at(t, e) {
  const i = L.get(t);
  if (i)
    return i;
  const r = Promise.resolve().then(e);
  return L.set(t, r), r.catch(() => {
    L.get(t) === r && L.delete(t);
  }), r;
}
var De = class extends ye {
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
    const t = this.vueConfig;
    t.mountLifecycle && !t.rootComponent && t.lazyConfig && await at(this, t.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(t, e, i, r, o, s) {
    const a = this.constructor, n = a.vueConfig, l = new AbortController();
    this._bridgeAbort = l;
    const m = () => !l.signal.aborted && this._bridgeAbort === l;
    this._mountState = "mounting", this._propsRef.value = i, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const p of r)
      if (this.emitEvent("invalid", { message: p }), !m())
        return;
    this.reactive.props.subscribe((p, h) => {
      this._propsRef.value = p, this._errorsRef.value = [...h];
      for (const c of h)
        this.emitEvent("invalid", { message: c });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((p) => {
      this._contentRef.value = p;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((p) => {
      this._hostVisibilityRef.value = p;
    }, { signal: l.signal });
    const g = (p) => {
      if (!m())
        return;
      const h = Wt(), c = Lt(p.rootComponent);
      let y = !1, w = !1, v, k;
      this._mountingApp = !0;
      try {
        const _ = Bt();
        if (p.piniaPlugins)
          for (const x of p.piniaPlugins)
            _.use(x);
        c.use(_);
        for (const x of p.plugins ?? [])
          c.use(x);
        if (c.provide(xt, this._propsRef), c.provide(Se, this._errorsRef), c.provide(gt, this.emitEvent.bind(this)), c.provide(Ee, this._contentRef), c.provide(bt, this._hostVisibilityRef), c.provide(ze, ke(this)), c.provide(Pe, ve(this)), c.provide(Te, ft(this)), p.providers?.(c, this), !m())
          return;
        if (k = c.config.errorHandler, n.mountLifecycle && (c.config.errorHandler = (x, K, u) => {
          w || (v = x), w = !0, k?.(x, K, u);
        }), c.mount(e), y = !0, w)
          throw v;
        m() && (this._vueApp = c);
      } finally {
        n.mountLifecycle && y && (c.config.errorHandler = k);
        try {
          y && (w || !m()) && c.unmount();
        } finally {
          Dt(h), this._mountingApp = !1;
        }
      }
      n.mountLifecycle && queueMicrotask(() => {
        m() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (n.rootComponent) {
      if (this._mountingApp && n.mountLifecycle) {
        queueMicrotask(() => {
          try {
            g(n);
          } catch (p) {
            m() && (this._mountState = "failed", this.emitEvent("error", { message: p instanceof Error ? p.message : String(p), error: p }));
          }
        });
        return;
      }
      try {
        g(n);
      } catch (p) {
        if (m())
          throw this._mountState = "failed", p;
      }
    } else if (n.lazyConfig) {
      const p = e.ownerDocument, h = n.lazyUi;
      h?.surface === "page" && (e.style.blockSize = "100%", e.style.minBlockSize = "0");
      let c = !1, y, w;
      const v = () => {
        clearTimeout(y), clearTimeout(w), this._feedback?.remove(), this._feedback = null;
      };
      l.signal.addEventListener("abort", v, { once: !0 });
      const k = () => {
        if (!m() || c)
          return;
        const u = h ? st(p, h, !1) : p.createElement("wippy-loading");
        u.setAttribute("no-bg", ""), this._feedback = u, e.appendChild(u);
      }, _ = (u) => {
        if (!m())
          return;
        c = !0, v(), this._mountState = "failed";
        const $ = h?.failed ?? (u instanceof Error ? u.message : String(u)), z = h ? st(p, h, !0) : p.createElement("wippy-error");
        h || (z.setAttribute("title", "Failed to load"), z.setAttribute("message", $)), this._feedback = z, e.appendChild(z), this.emitEvent("error", h ? { message: $, error: u } : { message: $ });
      }, x = h?.delay ?? (h?.surface === "compact" ? 200 : 0);
      x > 0 ? y = setTimeout(k, x) : k(), h && (w = setTimeout(() => _(new Error("The component did not load in time.")), h.timeout ?? 3e4)), (n.mountLifecycle ? at(a, n.lazyConfig) : n.lazyConfig()).then((u) => {
        !m() || c || (c = !0, v(), g(u));
      }, (u) => {
        c || _(u);
      }).catch(_);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const t = this._vueApp;
    this._vueApp = null, t?.unmount();
  }
};
const Le = ["aria-label"], Fe = /* @__PURE__ */ Rt({
  __name: "InteractiveSurface",
  props: {
    label: {}
  },
  setup(t) {
    return (e, i) => (Ot(), Vt("button", {
      type: "button",
      class: "pim-interactive",
      "aria-label": t.label
    }, [
      H(e.$slots, "default")
    ], 8, Le));
  }
});
function qe() {
  let t = 0;
  return { begin: () => ++t, current: (e) => e === t };
}
class O extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(e, i, r) {
    super(e.message ?? e.error ?? `${i} failed`), this.name = "ApiError", this.kind = e.kind, this.details = e.details, this.retryable = e.retryable, this.status = r;
  }
}
function wt(t, e) {
  const i = t;
  if (i && typeof i == "object" && i.success === !1) throw new O(i, e);
  return i && typeof i == "object" && i.data !== void 0 ? i.data : t;
}
function yt(t, e) {
  if (t instanceof O) return t;
  const i = t?.response;
  return i?.data ? new O(i.data, e, i.status) : t instanceof Error ? t : new O({ kind: "Unavailable" }, e);
}
async function C(t, e, i) {
  try {
    return wt((await pt.get(t, { params: i })).data, e);
  } catch (r) {
    throw yt(r, e);
  }
}
async function E(t, e, i) {
  try {
    return wt((await pt.post(t, e)).data, i);
  } catch (r) {
    throw yt(r, i);
  }
}
const f = "/api/v1/pim/catalogs", S = /* @__PURE__ */ new Map(), Ke = {
  catalogSummary: (t) => C(`${f}/${encodeURIComponent(t)}/summary`, "catalog summary"),
  listCatalogs: (t, e) => C(f, "catalog list", {
    admin_only: "true",
    ...t == null ? {} : { after: String(t) },
    ...e ? { text: e } : {}
  }),
  createCatalog: (t, e, i = {}) => E(f, { idempotency_key: `ui-${Date.now()}`, title: t, declaration: e, plugin_configs: i }, "catalog create"),
  history: (t, e = {}) => C(`${f}/${encodeURIComponent(t)}/history`, "catalog history", Object.fromEntries(Object.entries(e).filter(([, i]) => i !== void 0).map(([i, r]) => [i, String(r)]))),
  schema: (t) => C(`${f}/${encodeURIComponent(t)}/schema`, "schema"),
  applySchema: (t, e, i, r = {}) => E(`${f}/${encodeURIComponent(t)}/schema`, { declaration: e, expected_generation: i, plugin_configs: r }, "schema apply"),
  planSchema: (t, e, i, r = {}) => E(`${f}/${encodeURIComponent(t)}/schema/plan`, { declaration: e, expected_generation: i, plugin_configs: r }, "schema plan"),
  configurePlugin: (t, e, i) => E(`${f}/${encodeURIComponent(t)}/plugins/configure`, { plugin: e, config: i }, "plugin configuration"),
  schemaOptions: (t) => C(`${f}/${encodeURIComponent(t)}/schema/options`, "schema options"),
  apply: (t, e) => E(`${f}/${encodeURIComponent(t)}/apply`, { items: e }, "term change"),
  termsPage: (t, e, i) => {
    const r = JSON.stringify([t, e, i]);
    let o = S.get(r);
    return o || (o = C(`${f}/${encodeURIComponent(t)}/terms`, "terms", { vocabulary: e, limit: "50", ...i ? { after: i } : {} }), S.set(r, o), o.catch(() => {
      S.get(r) === o && S.delete(r);
    })), o;
  },
  invalidateTerms: (t) => {
    for (const e of S.keys()) JSON.parse(e)[0] === t && S.delete(e);
  }
}, N = /* @__PURE__ */ new Map();
function Ye(t) {
  let e = N.get(t);
  return e || (e = Promise.resolve().then(() => Ut(t)).then(() => !0, () => (N.delete(t), !1)), N.set(t, e)), e;
}
const Je = ':host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.pim-system{display:grid;grid-template-columns:232px minmax(0,1fr);height:100%;min-height:0}.pim-rail{padding:16px 12px;border-right:1px solid var(--p-content-border-color);overflow-y:auto}.pim-railhead{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:48px}.pim-railhead h2{margin:0;font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}.pim-rail-search{width:100%;margin-bottom:12px}.pim-rail-error{overflow-wrap:anywhere}.pim-rail-list{display:grid;gap:4px}.pim-rail .pim-rail-row{display:flex;flex-direction:column;align-items:start;gap:4px;width:100%;padding:8px 10px;border-radius:8px;text-align:left;color:var(--p-text-color);font-size:13px;font-weight:500}.pim-rail .pim-rail-row.active{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.pim-system-main{min-width:0;min-height:0;overflow-y:auto}.pim-detail-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:18px var(--kickside-system-surface-gutter, 24px)}.pim-detail-head h2{min-width:0;max-width:100%;margin:0;font-size:16px;font-weight:700;overflow-wrap:anywhere}.pim-detail-actions{display:flex;align-items:center;gap:8px;margin-left:auto}.pim-settings-pane{padding:18px var(--kickside-system-surface-gutter, 24px) 28px}.pim-readable{max-width:960px}.pim-section-tabs{padding-inline:var(--kickside-system-surface-gutter, 24px)}.pim-responsive-table{container:pim-responsive-table / inline-size}.pim-responsive-table>.pim-grid{overflow-wrap:anywhere}.pim-stacked-list{display:none;margin:0;padding:0;list-style:none}.pim-stacked-row{padding:10px 12px;overflow-wrap:break-word}.pim-stacked-row+.pim-stacked-row{border-top:1px solid var(--p-content-border-color)}.pim-stacked-meta{display:flex;flex-wrap:wrap;gap:2px 10px;margin-top:4px}.pim-stacked-meta>*{min-width:0}@container pim-responsive-table (max-width: 600px){.pim-responsive-table>.pim-grid{display:none}.pim-stacked-list{display:block}}.pim-definition{border-bottom:1px solid var(--p-content-border-color)}.pim-definition:last-child{border-bottom:0}.pim-definition-list{container:pim-definition-list / inline-size}.pim-definition-scroll{overflow-x:auto}.pim-definition-grid{display:grid;grid-template-columns:var(--pim-definition-columns);column-gap:10px;min-width:min-content}.pim-definition-grid>.pim-definition,.pim-definition-grid>.pim-definition-columns{grid-column:1 / -1}.pim-definition-grid>.pim-definition{display:grid;grid-template-columns:subgrid}.pim-definition-columns,.pim-definition-head{display:grid;grid-template-columns:subgrid;align-items:center;column-gap:10px;padding:16px;grid-column:1 / -1}.pim-definition-columns{padding-block:8px;font-size:12px;font-weight:600;color:var(--p-text-muted-color);border-bottom:1px solid var(--p-content-border-color)}.pim-definition-head .pim-definition-toggle{display:grid;grid-column:1 / -2;grid-template-columns:subgrid;align-items:center;column-gap:10px;min-width:0;width:100%;color:inherit}.pim-definition-meta{display:contents}.pim-definition-lead{display:flex;align-items:center;gap:2px}.pim-definition-lead svg{width:14px;height:14px;flex:none}.pim-definition-code{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pim-definition-code code{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}.pim-definition-kind{min-width:0}.pim-definition-details{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0}.pim-definition-usage{text-align:right;font-size:12px;color:var(--p-text-muted-color)}.pim-definition-actions{display:flex;align-items:center;justify-content:end;gap:4px}.pim-definition-body{grid-column:1 / -1;width:100cqw;position:sticky;left:0;min-width:0}.pim-row-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}.pim-definition-body{padding:0 16px 16px}.pim-definition-body .pim-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.pim-definition-body .pim-f[class]{grid-column:auto}.pim-definition-body .pim-f[class].pim-w-full{grid-column:1 / -1}@container pim-definition-list (max-width: 560px){.pim-definition-grid{grid-template-columns:minmax(0,1fr);min-width:0}.pim-definition-columns{display:none}.pim-definition-head{grid-template-columns:minmax(0,1fr) auto;gap:8px}.pim-definition-head .pim-definition-toggle{grid-template-columns:auto minmax(0,1fr);gap:4px 8px}.pim-definition-meta{grid-column:2;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}.pim-definition-meta>:empty{display:none}.pim-definition-meta>*{min-width:0;max-width:100%}.pim-definition-meta .pim-definition-code,.pim-definition-meta code,.pim-row-title{white-space:normal;overflow-wrap:break-word}.pim-definition-usage{text-align:left}.pim-definition-body{width:auto;position:static}}.pim-policy-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-policy-row:last-child{border-bottom:0}.pim-policy-copy{flex:1 1 260px}.pim-policy-copy label{font-size:14px;font-weight:600}.pim-policy-copy p{margin:4px 0 0;font-size:12px;color:var(--p-text-muted-color)}.pim-policy-control{flex:0 1 360px;width:min(100%,360px)}@media(max-width:720px){.pim-system{grid-template-columns:180px minmax(0,1fr)}.pim-policy-row{flex-wrap:wrap}.pim-definition-body .pim-fields{grid-template-columns:minmax(0,1fr)}}.pim-definition-list>.pim-add-row{border-top:1px solid var(--p-content-border-color)}.pim-definition-grid>.pim-aspect{grid-column:1 / -1}.pim-policy-intro{margin:0;padding:14px 16px 0}.pim-policy-group{min-width:0}.pim-policy-advanced{display:flex;align-items:center;flex-wrap:wrap;gap:8px;width:100%;padding:16px;background:var(--p-content-background);color:var(--p-text-color);border:1px solid var(--p-content-border-color);border-radius:8px;font:inherit;font-weight:600;text-align:left;cursor:pointer}.pim-policy-advanced:focus-visible{outline:2px solid var(--p-primary-color);outline-offset:2px}.pim-policy-advanced .small{font-weight:400}.pim-policy-advanced svg{flex-shrink:0}@media(max-width:540px){.pim-system{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}.pim-rail{border-right:0;border-bottom:1px solid var(--p-content-border-color);padding:8px 12px}.pim-railhead{min-height:32px}.pim-rail-search{margin-bottom:8px}.pim-rail-list{display:flex;overflow-x:auto}.pim-rail .pim-rail-row{flex:0 0 auto;width:auto;max-width:220px}.pim-rail-row>span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pim-detail-head{padding:14px 16px}.pim-detail-actions{flex-wrap:wrap;margin-left:0;width:100%}.pim-settings-pane{padding:16px}.pim-section-tabs{padding-inline:16px}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:var(--p-font-family, inherit);font-size:13px;line-height:1.45}*,*:before,*:after{box-sizing:border-box}.muted{color:var(--p-text-muted-color)}.small{font-size:12px}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}code.mono,span.mono{padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.row{display:flex;align-items:center;gap:10px}.pim-grid{width:100%;border-collapse:collapse}.pim-grid th{text-align:left;font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.pim-grid th,.pim-grid td{height:40px;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}.pim-grid tbody tr:hover{background:var(--kx-overlay-hover)}.pim-grid tr:last-child td{border-bottom:0}.pim-table{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:auto}.pim-interactive{appearance:none;border:0;border-radius:0;background:transparent;color:inherit;font:inherit;letter-spacing:inherit;text-align:left;cursor:pointer;padding:0}.pim-principal-list{display:grid;gap:8px}.pim-principal-service{display:grid;gap:4px}.row.wrap{flex-wrap:wrap}.pim-principal-service>span{font-size:11.5px;font-weight:680}.pim-group-head{display:flex;align-items:center;gap:8px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.pim-group-head h3{margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-group-head svg{width:16px;height:16px;color:var(--p-text-muted-color)}.kx-head-text{flex:1}.kx-head-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-head-actions .search{width:180px}.pim-panel-head .kx-title{font-size:16px}.pim-title-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.native-dialog{color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:0;max-width:min(680px,92vw);max-height:85vh;overflow:auto}.native-dialog::backdrop{background:var(--p-mask-background)}.native-dialog .dialog-box,.native-dialog .pim-sheet{width:auto;max-width:100%}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;font-family:var(--kx-font-body)}:host>div{height:100%;min-height:0}.pim-page{height:100%;overflow-y:auto;padding-bottom:32px}.pim-stack{display:grid;gap:14px}.pim-card-body{padding:10px 18px}.pim-card-body.pad{padding:16px 18px}.pim-grid .num{text-align:right;font-variant-numeric:tabular-nums}.pim-table-foot{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-top:1px solid var(--p-content-border-color);color:var(--p-text-muted-color);font-size:12px}.pim-notice{padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--p-warn-500) 12%,transparent);color:var(--p-text-color)}.pim-notice.ok{background:color-mix(in srgb,var(--p-success-500) 12%,transparent)}.pim-aspect{padding:14px 20px 18px;border-top:1px solid var(--p-content-border-color)}.pim-aspect:first-child{border-top:0}.pim-aspect-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}.pim-aspect-head h3{margin:0}.pim-fields{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px 16px}.pim-f{grid-column:span 6;display:grid;gap:4px;align-content:start;min-width:0;position:relative}.pim-f.pim-w-full{grid-column:1 / -1}.pim-f.pim-w-half{grid-column:span 6}.pim-f.pim-w-third{grid-column:span 4}.pim-f.pim-w-quarter{grid-column:span 3}.pim-f-label{display:flex;align-items:baseline;gap:8px;min-width:0;min-height:17px;font-size:11.5px;line-height:17px}.pim-f-label label{font-weight:680;color:var(--p-text-muted-color);white-space:nowrap}.pim-f-label .pim-req{margin-left:2px;color:var(--p-warn-500);font-weight:600;cursor:help}.pim-f-note{margin-left:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--p-text-muted-color)}.pim-f-note.on{color:var(--p-primary-color)}.pim-f.dirty:before{content:"";position:absolute;left:-10px;top:20px;bottom:0;width:2px;border-radius:2px;background:var(--p-primary-color)}@media(max-width:1100px){.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:span 6}}@media(max-width:720px){.pim-f,.pim-f.pim-w-half,.pim-f.pim-w-third,.pim-f.pim-w-quarter{grid-column:1 / -1}}.pim-choices{display:flex;flex-wrap:wrap;gap:6px}.pim-picker{display:grid;gap:8px}.pim-chips{display:flex;flex-wrap:wrap;gap:6px}.dialog-box{width:min(520px,calc(100% - 32px));background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:18px;display:grid;gap:12px}.dialog-box h2{margin:0;font-size:16px}.dialog-actions{display:flex;justify-content:flex-end;gap:8px}.pim-builder{min-width:0;height:100%;min-height:0;display:flex;flex-direction:column;overflow-y:auto}.pim-builder-main{display:grid;gap:14px;min-width:0}.pim-bsection-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 20px 10px}.pim-bsection-head h3{margin:0 0 6px}.pim-bsection-head h3 .mono,.pim-aspect-head h3 .mono{margin-left:8px;font-weight:400}.pim-bsection-head+.pim-aspect{border-top:0}.row.end{justify-content:flex-end;margin-top:10px}.pim-stack.tight{gap:8px}.pim-attr-row:hover{background:var(--kx-overlay-hover)}.pim-add-row{padding:12px 14px;gap:8px}.pim-level{padding:10px 12px;border:1px solid var(--p-content-border-color);border-radius:10px}.pim-level-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;font-size:13px}.pim-terms{margin-top:10px}.pim-picker-chips{align-items:center}.pim-chip-entry{width:150px}.pim-plan .pim-plan-list{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px}.pim-plan .pim-plan-list li{display:flex;align-items:center;gap:10px;font-size:13px}.pim-editor-surface{border:0;padding:0;margin:0;min-width:0}.pim-scope-filters h2{margin:0 0 12px}.pim-page>.pim-table,.pim-page>.pim-editor,.pim-page>.form{margin:18px var(--kickside-system-surface-gutter, 24px) 28px}.form{border:1px solid var(--p-content-border-color);border-radius:14px;overflow:hidden}.form .form{border:0;border-radius:0}.pim-bsection-head h3,.pim-aspect-head h3,.pim-column-group h3{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.pim-f .p-inputtext,.pim-f .p-textarea,.pim-f .p-select,.pim-f .p-inputnumber{width:100%;min-width:0}.pim-add-row{display:flex;flex-wrap:wrap}.pim-add-row .p-inputtext{max-width:220px}.pim-json-edit{width:100%}kickside-pim-catalog-settings{display:block;height:100%;min-height:0}.pim-scope-filters-row{padding:12px var(--kickside-system-surface-gutter, 24px)}.pim-scope-filters{padding:16px;margin-bottom:12px}.pim-builder>.kx-head,.pim-builder>.pim-detail-head,.pim-builder>.pim-section-tabs{flex-shrink:0}.pim-settings-pane{flex:1;min-height:0;overflow-y:auto}.pim-source-permissions{display:grid;gap:6px;max-width:440px}.pim-source-permissions>label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.pim-contexts{display:grid;gap:8px}.pim-context-row{display:flex;align-items:end;gap:8px;min-width:0}.pim-context-field{display:grid;gap:4px;flex:0 1 180px;min-width:120px}.pim-contexts>.p-button{margin-top:2px;justify-self:start}.pim-builder .pim-policy-status{padding-inline:16px}@media(max-width:540px){.pim-builder>.kx-head{gap:10px}.pim-builder>.kx-head .kx-head-actions{width:100%;margin-left:0}.pim-builder>.kx-head .kx-head-actions>button{flex:1 1 auto}.pim-builder .pim-bsection-head{flex-wrap:wrap}.pim-builder .pim-source-permissions{min-width:0}.pim-builder .pim-bsection-head>button{margin-left:auto}}.pim-canvas{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:10px 14px}.pim-lcard{display:grid;gap:8px;min-width:0;padding:10px 12px;border:1px dashed color-mix(in srgb,var(--p-text-color) 22%,transparent);border-radius:10px;background:color-mix(in srgb,var(--p-text-color) 3%,transparent);cursor:grab}.pim-lcard.dragging{opacity:.45}.pim-lcard.over{border-color:var(--p-primary-color);border-style:solid;box-shadow:inset 0 0 0 1px var(--p-primary-color)}.pim-lcard.fixed{cursor:default;border-style:solid;border-color:var(--p-content-border-color);background:transparent}.pim-lcard-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.pim-lcard .pim-grip{display:inline-flex;color:var(--p-text-muted-color)}.pim-lcard .pim-grip svg{width:14px;height:14px}.pim-lcard-name{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pim-lcard-type{font-size:11.5px;color:var(--p-text-muted-color);white-space:nowrap}.pim-lcard-move{display:inline-flex;gap:2px;margin-left:auto}.pim-layout-help{margin:0;padding:16px 20px}.pim-lcard .p-selectbutton{display:flex;flex-wrap:wrap}.pim-lcard .p-togglebutton{flex:1;min-width:0;padding-inline:8px}.pim-history-caption{margin:0;padding:8px 12px;border-bottom:1px solid var(--p-content-border-color)}@media(max-width:600px){.pim-layout .pim-lcard{grid-column:1 / -1!important}}';
export {
  O as A,
  je as P,
  De as W,
  Fe as _,
  E as a,
  Ue as b,
  We as c,
  Ye as e,
  C as g,
  Ke as p,
  qe as r,
  Je as s,
  Be as u
};
