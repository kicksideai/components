import { ref as K, createApp as sr, inject as xe, onMounted as De, onUnmounted as $e, watch as ve, renderSlot as oe, createCommentVNode as lr, h as pr, Teleport as cr, defineComponent as Fe, openBlock as Be, createBlock as dr, resolveDynamicComponent as ur, withCtx as hr, onBeforeUnmount as fr, createElementBlock as mr, nextTick as gr } from "vue";
import { addCollection as wr } from "@iconify/vue";
import { config as Ne, addIcons as br, on as xr, applyThemeMode as Z, host as vr, hostCss as kr, loadCss as yr, api as Ue, loadByTagName as _r } from "@wippy-fe/proxy";
import { getActivePinia as Er, createPinia as Cr, setActivePinia as Or } from "pinia";
import Nr from "primevue/config";
import jr from "primevue/contextmenu";
import Ir from "primevue/menu";
import Lr from "primevue/portal";
var me = "data-wippy-visible";
function je(e) {
  const r = e.getAttribute(me);
  return r === "true" ? !0 : r === "false" ? !1 : null;
}
var Sr = Object.defineProperty, Rr = (e, r, i) => r in e ? Sr(e, r, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[r] = i, B = (e, r, i) => Rr(e, typeof r != "symbol" ? r + "" : r, i), Tr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Pr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Ie(e) {
  const r = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(r) ? r : null;
}
function Ar(...e) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e)
    if (i)
      for (const [c, u] of Object.entries(i)) {
        if ((c === "@light" || c === "@dark") && u && typeof u == "object") {
          for (const [p, n] of Object.entries(u)) {
            const o = typeof n == "string" ? Ie(p) : null;
            o && r.add(o);
          }
          continue;
        }
        const f = typeof u == "string" ? Ie(c) : null;
        f && r.add(f);
      }
  return [...r].sort();
}
function Mr(e) {
  if (e.length === 0)
    return "";
  const r = e.map((i) => `  ${i}: inherit;`).join(`
`);
  return `${Pr} {
${r}
}`;
}
function zr(e, r) {
  const i = Mr(r);
  i && Ge(e, i, "@wippy-fe/css-variables-bridge");
}
function Vr(e, r) {
  const c = (r ?? Tr).map(async (u) => {
    const f = kr[u];
    if (!f)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${u}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await yr(f);
    } catch (p) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${u}" (${f}):`, p), null;
    }
  });
  return Promise.all(c).then((u) => {
    for (const f of u) {
      if (!f)
        continue;
      const p = document.createElement("style");
      p.textContent = f, p.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(p);
    }
  });
}
function Dr(e, r) {
  const i = document.createElement("style");
  i.textContent = r, e.appendChild(i);
}
function Ge(e, r, i) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const u = new CSSStyleSheet();
    u.replaceSync(r), e.adoptedStyleSheets = [...e.adoptedStyleSheets, u];
    return;
  }
  const c = document.createElement("style");
  c.setAttribute("role", i), c.textContent = r, e.appendChild(c);
}
function $r(e, r) {
  Ge(e, r, "@wippy-fe/custom-css");
}
function We(e) {
  return e.__wippyHost ?? null;
}
function Fr(e) {
  return e.replace(/-([a-z])/g, (r, i) => i.toUpperCase());
}
function Br(e, r, i) {
  switch (i.type) {
    case "string":
      return { value: r };
    case "number": {
      const c = Number.parseFloat(r);
      return Number.isNaN(c) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: c };
    }
    case "integer": {
      const c = Number.parseInt(r, 10);
      return Number.isNaN(c) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: c };
    }
    case "boolean":
      return { value: r !== "false" };
    case "array":
    case "object":
      try {
        const c = JSON.parse(r);
        return i.type === "array" && !Array.isArray(c) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: c };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: r };
  }
}
function de(e, r) {
  const i = {}, c = [];
  for (const [u, f] of Object.entries(r.properties)) {
    const p = e.getAttribute(u), n = Fr(u);
    if (p === null) {
      f.default !== void 0 && (i[n] = f.default);
      continue;
    }
    const o = Br(u, p, f);
    o.error ? c.push(o.error) : i[n] = o.value;
  }
  return { props: i, errors: c };
}
var Ur = class {
  constructor(e, r) {
    B(this, "_props"), B(this, "_errors"), B(this, "_content"), B(this, "_hostVisibility"), B(this, "_propsListeners", /* @__PURE__ */ new Set()), B(this, "_contentListeners", /* @__PURE__ */ new Set()), B(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), B(this, "_disposed", !1), B(this, "_emitToDom"), B(this, "props"), B(this, "events"), B(this, "content"), B(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = r;
    const i = this;
    this.props = {
      get value() {
        return i._props;
      },
      get errors() {
        return i._errors;
      },
      subscribe(c, u) {
        return i._subscribeProps(c, u);
      }
    }, this.events = {
      emit(c, u) {
        i._disposed || i._emitToDom(c, u);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return i._content;
      },
      subscribe(c, u) {
        return i._subscribeContent(c, u);
      }
    } : null, this.hostVisibility = {
      get value() {
        return i._hostVisibility;
      },
      subscribe(c, u) {
        return i._subscribeHostVisibility(c, u);
      }
    };
  }
  /** @internal */
  notifyProps(e, r) {
    if (!this._disposed) {
      this._props = e, this._errors = r;
      for (const i of this._propsListeners)
        i(e, r);
    }
  }
  /** @internal */
  notifyContent(e) {
    if (!this._disposed) {
      this._content = e;
      for (const r of this._contentListeners)
        r(e);
    }
  }
  /** @internal */
  notifyHostVisibility(e, r) {
    if (!(this._disposed || e === r)) {
      this._hostVisibility = e;
      for (const i of this._hostVisibilityListeners)
        i(e, r);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(e, r) {
    if (this._disposed || r?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(e), r?.immediate && e(this._props, this._errors);
    const i = () => {
      this._propsListeners.delete(e), r?.signal?.removeEventListener("abort", i);
    };
    return r?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeContent(e, r) {
    if (this._disposed || r?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), r?.immediate && e(this._content);
    const i = () => {
      this._contentListeners.delete(e), r?.signal?.removeEventListener("abort", i);
    };
    return r?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
  _subscribeHostVisibility(e, r) {
    if (this._disposed || r?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), r?.immediate && e(this._hostVisibility, this._hostVisibility);
    const i = () => {
      this._hostVisibilityListeners.delete(e), r?.signal?.removeEventListener("abort", i);
    };
    return r?.signal?.addEventListener("abort", i, { once: !0 }), i;
  }
}, Gr = class extends HTMLElement {
  constructor() {
    super(), B(this, "_internals"), B(this, "_contentObserver", null), B(this, "_initialized", !1), B(this, "_container", null), B(this, "_reactive", null), B(this, "_lastProps", null), B(this, "_lastErrors", []), B(this, "_lastContent", null), B(this, "_themeUnsub", null), B(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = je(this);
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
    const e = this.wippyConfig, r = Object.keys(e.propsSchema.properties), i = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...r, ...i, me])];
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
    return We(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(e, r) {
    this.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      detail: r
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
      const e = this.constructor.wippyConfig, r = !!e.contentTemplate;
      let i, c;
      if (this._lastProps !== null)
        i = this._lastProps, c = this._lastErrors;
      else {
        const f = de(this, e.propsSchema);
        e.validateProps && f.errors.push(...e.validateProps(f.props)), i = f.props, c = f.errors, this._lastProps = i, this._lastErrors = c;
      }
      const u = r ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      r && this._lastContent === null && (this._lastContent = u), this._reactive = new Ur(
        { props: i, errors: c, content: u, hasContent: r, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, r = this._initialized, i = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let c;
      if (r)
        c = this._container;
      else {
        this.onInit(i), e.inlineCss && Dr(i, e.inlineCss);
        try {
          const t = Ne?.theming, d = Ar(
            t?.global?.cssVariables,
            t?.children?.cssVariables
          );
          zr(i, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const t = Ne?.theming, d = [t?.global?.customCSS, t?.children?.customCSS].filter(Boolean).join(`
`);
            d && $r(i, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Vr(i, e.hostCssKeys), c = document.createElement("div"), c.setAttribute("data-wippy-theme-root", "");
        const o = e.containerClasses ?? [];
        o.length > 0 && c.classList.add(...o), i.appendChild(c), this._container = c, br(wr);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = xr("@theme", (o) => this._applyTheme(o)));
      const { props: u, errors: f } = de(this, e.propsSchema);
      e.validateProps && f.push(...e.validateProps(u));
      const p = u;
      this._lastProps = p, this._lastErrors = f;
      let n = null;
      e.contentTemplate && (n = this._extractContent(e.contentTemplate), this._lastContent = n, this._contentObserver = new MutationObserver(() => {
        const o = this._extractContent(e.contentTemplate);
        this._lastContent = o, this._reactive?.notifyContent(o), this.onContentChanged(o);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(i, c, p, f, n, r), this._internals.states.delete("loading"), this._internals.states.add("ready"), r || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (e) {
      this.onError(e), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(e = vr.getThemeMode?.()) {
    Z(e, this), this._container && Z(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Z("auto", this), this._container && Z("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, r, i) {
    if (r === i)
      return;
    if (e === me) {
      const n = this._hostVisible, o = je(this);
      if (o === n)
        return;
      this._hostVisible = o, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(o, n), this.onHostVisibilityChanged(o, n));
      return;
    }
    const c = this.constructor.wippyConfig, { props: u, errors: f } = de(this, c.propsSchema);
    c.validateProps && f.push(...c.validateProps(u));
    const p = u;
    this._lastProps = p, this._lastErrors = f, this._reactive?.notifyProps(p, f), this.onPropsChanged(p, f);
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
  onPropsChanged(e, r) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(e, r) {
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
    const r = this.querySelector(`template[data-type="${e}"]`);
    return r ? r.content.textContent?.trim() || r.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
function Wr(e) {
  return e.__wippyHostBus ?? null;
}
function Hr(e) {
  return e.dataset.wippyPanelId ?? null;
}
var Yr = Object.defineProperty, Kr = (e, r, i) => r in e ? Yr(e, r, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[r] = i, J = (e, r, i) => Kr(e, typeof r != "symbol" ? r + "" : r, i), He = /* @__PURE__ */ Symbol("wippy:emit"), Ye = /* @__PURE__ */ Symbol("wippy:props"), Jr = /* @__PURE__ */ Symbol("wippy:props_error"), Xr = /* @__PURE__ */ Symbol("wippy:content"), Qr = /* @__PURE__ */ Symbol("wippy:panel-id"), qr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Zr = /* @__PURE__ */ Symbol("wippy:host"), Ke = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Lt() {
  const e = xe(Ye);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function St() {
  const e = xe(He);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function et() {
  const e = xe(Ke);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Rt(e) {
  const r = et();
  let i = !1, c = null, u = !1;
  function f() {
    if (c)
      return u = !0, c;
    let p;
    try {
      p = Promise.resolve(e());
    } catch (o) {
      p = Promise.reject(o);
    }
    const n = p.finally(() => {
      if (c === n && (c = null, i && u))
        return u = !1, f();
    });
    return c = n, n;
  }
  return De(() => (i = !0, f())), $e(() => {
    i = !1, u = !1;
  }), ve(r, (p, n) => {
    if (i && n === !1 && p === !0)
      return f();
  }), r;
}
var rt = class extends Gr {
  constructor() {
    super(...arguments), J(this, "_vueApp", null), J(this, "_propsRef", K({})), J(this, "_errorsRef", K([])), J(this, "_contentRef", K(null)), J(this, "_hostVisibilityRef", K(null)), J(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, r, i, c, u, f) {
    const p = this.constructor.vueConfig;
    this._propsRef.value = i, this._errorsRef.value = c, this._contentRef.value = u ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const t of c)
      this.emitEvent("invalid", { message: t });
    const n = new AbortController();
    this._bridgeAbort = n, this.reactive.props.subscribe((t, d) => {
      this._propsRef.value = t, this._errorsRef.value = [...d];
      for (const l of d)
        this.emitEvent("invalid", { message: l });
    }, { signal: n.signal }), this.reactive.content && this.reactive.content.subscribe((t) => {
      this._contentRef.value = t;
    }, { signal: n.signal }), this.reactive.hostVisibility.subscribe((t) => {
      this._hostVisibilityRef.value = t;
    }, { signal: n.signal });
    const o = (t) => {
      if (n.signal.aborted)
        return;
      const d = Er(), l = sr(t.rootComponent);
      this._vueApp = l;
      const h = Cr();
      if (t.piniaPlugins)
        for (const a of t.piniaPlugins)
          h.use(a);
      if (l.use(h), t.plugins)
        for (const a of t.plugins)
          l.use(a);
      l.provide(Ye, this._propsRef), l.provide(Jr, this._errorsRef), l.provide(He, this.emitEvent.bind(this)), l.provide(Xr, this._contentRef), l.provide(Ke, this._hostVisibilityRef), l.provide(Qr, Hr(this)), l.provide(qr, Wr(this)), l.provide(Zr, We(this)), t.providers && t.providers(l, this), l.mount(r), d && Or(d);
    };
    if (p.rootComponent)
      o(p);
    else if (p.lazyConfig) {
      const t = document.createElement("wippy-loading");
      t.setAttribute("no-bg", ""), r.appendChild(t), p.lazyConfig().then((d) => {
        n.signal.aborted || (t.remove(), o(d));
      }).catch((d) => {
        if (n.signal.aborted)
          return;
        const l = d instanceof Error ? d.message : String(d), h = document.createElement("wippy-error");
        h.setAttribute("title", "Failed to load"), h.setAttribute("message", l), t.replaceWith(h), this.emitEvent("error", { message: l });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const tt = "data-wippy-overlay-layer";
function Je() {
  return typeof window < "u" && typeof window.document < "u";
}
function Xe() {
  return Je() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function ot() {
  return Xe() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const it = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let nt = 0;
const ie = /* @__PURE__ */ new WeakMap();
function Le(e, r) {
  const i = e.style;
  i.setProperty("position", "fixed", "important"), i.setProperty("inset", "auto", "important"), i.setProperty("margin", "0", "important"), i.setProperty("position-anchor", r), i.setProperty("position-area", "bottom span-right"), i.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), i.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), i.setProperty("max-width", "stretch", "important");
}
function at(e, r) {
  if (!it.test(e.className))
    return;
  const i = e.style.cssText;
  Le(e, r), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = i;
    return;
  }
  if (!ie.has(e)) {
    const c = new MutationObserver(() => {
      const u = e.style;
      (u.top !== "auto" || u.left !== "auto" || u.margin !== "0px" || u.getPropertyPriority("top") !== "important" || u.getPropertyPriority("left") !== "important" || u.getPropertyPriority("margin") !== "important" || u.getPropertyPriority("min-width") !== "important" || u.maxWidth !== "stretch" || u.getPropertyPriority("max-width") !== "important") && Le(e, r);
    });
    c.observe(e, { attributes: !0, attributeFilter: ["style"] }), ie.set(e, c);
  }
}
function ke(e) {
  const r = ie.get(e);
  r && (r.disconnect(), ie.delete(e));
}
function st(e) {
  const r = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return r instanceof ShadowRoot ? r : null;
}
function ge(e) {
  e.style.top = "0px", e.style.left = "0px";
  const r = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - r.top}px`, e.style.left = `${-window.scrollX - r.left}px`;
}
const ne = /* @__PURE__ */ new Set(), ye = /* @__PURE__ */ new WeakMap();
let Se = !1, we = !1;
const Re = ["w-theme-dark", "w-theme-light"], ee = "data-wippy-theme-root", be = /* @__PURE__ */ new WeakMap();
function lt(e) {
  const r = [];
  let i = e ? e.parentNode : null;
  for (; i && i.nodeType === 1; )
    r.push(i), i = i.parentNode;
  return r;
}
function pt(e, r, i) {
  const c = [...lt(r), i.host], u = () => {
    let p;
    for (const n of c) {
      if (Re.some((o) => n.classList.contains(o))) {
        p = n;
        break;
      }
      if (n.hasAttribute(ee))
        break;
    }
    for (const n of Re)
      e.classList.toggle(n, !!(p && p.classList.contains(n)));
    p ? e.setAttribute(ee, "") : e.removeAttribute(ee);
  };
  u();
  const f = new MutationObserver(u);
  for (const p of c)
    f.observe(p, { attributes: !0, attributeFilter: ["class", ee] });
  be.set(e, f);
}
function Qe(e) {
  be.get(e)?.disconnect(), be.delete(e);
}
function ct() {
  we = !1;
  for (const e of ne) {
    if (!e.isConnected) {
      for (const r of Array.from(e.children))
        r instanceof HTMLElement && ke(r);
      ne.delete(e), ye.get(e)?.disconnect(), Qe(e);
      continue;
    }
    e.childElementCount > 0 && ge(e);
  }
}
function Te() {
  we || (we = !0, requestAnimationFrame(ct));
}
function dt(e) {
  const r = document.createElement("div");
  r.setAttribute(tt, "");
  const i = Xe();
  if (r.style.cssText = i ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", i && r.setAttribute("popover", "manual"), e.appendChild(r), i) {
    try {
      r.showPopover();
    } catch {
    }
    r.matches(":popover-open") || (r.removeAttribute("popover"), r.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  ge(r);
  const c = new MutationObserver((u) => {
    const f = r.__wippyAnchorName;
    for (const p of u) {
      if (f)
        for (const n of Array.from(p.addedNodes))
          n instanceof HTMLElement && at(n, f);
      for (const n of Array.from(p.removedNodes))
        n instanceof HTMLElement && ke(n);
    }
    r.isConnected && r.childElementCount > 0 && ge(r);
  });
  return c.observe(r, { childList: !0 }), ye.set(r, c), ne.add(r), Se || (Se = !0, window.addEventListener("scroll", Te, { capture: !0, passive: !0 }), window.addEventListener("resize", Te, { passive: !0 })), r;
}
function Pe(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = dt(e.hostRoot), pt(e.layer, e.$el, e.hostRoot), ot())) {
    const r = e.$el ? e.$el.parentElement : null;
    r && (e.anchorName = `--wippy-a-${++nt}`, e.anchorTrigger = r, r.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function Ae(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const r of Array.from(e.layer.children))
      r instanceof HTMLElement && ke(r);
    ne.delete(e.layer), ye.get(e.layer)?.disconnect(), Qe(e.layer), e.layer.remove(), e.layer = null;
  }
}
let Me = !1;
function ut() {
  if (Me)
    return;
  const e = Ir;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (r) => {
      const i = r.composedPath(), c = this.container && !i.includes(this.container), u = !(this.target && i.includes(this.target));
      this.overlayVisible && c && u ? this.hide() : !this.popup && c && u && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, Me = !0);
}
let ze = !1;
function ht() {
  if (ze)
    return;
  const e = jr;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (r) => {
      const i = r.composedPath(), c = this.container && !i.includes(this.container), u = this.visible ? !(this.target && i.includes(this.target)) : !0;
      c && u && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, ze = !0);
}
let Ve = !1;
function ft() {
  if (Ve)
    return;
  Ve = !0;
  const e = Lr;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Je() && (this.hostRoot = st(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Pe(this), this.$watch("inline", (r) => {
      r ? Ae(this) : Pe(this);
    })));
  }, e.render = function() {
    return this.inline ? oe(this.$slots, "default", { key: 0 }) : this.mounted ? pr(cr, { key: 1, to: this.resolvedTarget || document.body }, [
      oe(this.$slots, "default")
    ]) : lr("", !0);
  }, e.unmounted = function() {
    Ae(this);
  };
}
const mt = {
  install: (e) => {
    ut(), ht(), ft(), e.use(Nr, { theme: "none" });
  }
}, gt = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background);font-family:var(--kx-font-body);font-size:13px;line-height:1.5}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}h1,h2,h3,h4,p{margin:0}h2{font-size:16px;font-weight:700}h3,h4{font-size:14px;font-weight:600}.work-page{height:100%;min-height:0;overflow-y:auto}.work-row{display:flex;gap:8px;align-items:center;min-width:0}.work-wrap{flex-wrap:wrap}.work-spacer{flex:1}.work-stack{display:grid;gap:12px;min-width:0}.work-stack.work-tight{gap:6px}.work-small{font-size:12px}.work-muted,dt,.work-read-value{color:var(--p-text-muted-color)}.work-error{color:var(--p-danger-500)}.work-mono{width:fit-content;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:400;padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.work-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.work-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.kx-head-text{flex:1 1 160px}.kx-title,.kx-head-sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-head-actions>.p-inputtext{width:180px}.kx-head-actions .p-selectbutton{flex-wrap:wrap}.work-page>:not(.kx-head,.work-settings-shell,kickside-work-board-settings,.work-native-dialog,.p-drawer-mask){margin-inline:var(--kickside-system-surface-gutter, 24px)}.work-page>.kx-head,.work-settings-shell>.kx-head{padding-inline:var(--kickside-system-surface-gutter, 24px)}.work-pane{padding:18px var(--kickside-system-surface-gutter, 24px) 28px;overflow-y:auto;min-height:0}.work-pane>*{max-width:960px}.work-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding-block:8px 16px}.work-toolbar .p-select{min-width:180px;max-width:300px}.work-filter-row{margin-bottom:16px}.work-notice{margin-block:12px;padding:12px 14px;border-radius:8px;background:var(--kx-wash-warn);white-space:pre-wrap}.work-board-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:var(--kx-wash-primary);color:var(--p-primary-color);flex:none}.work-board-icon svg{width:20px;height:20px}.work-board-identity{min-width:0}.work-board-identity>.work-row{flex-wrap:wrap}.work-identity-edit{display:grid;grid-template-columns:minmax(100px,1fr) minmax(140px,1.5fr) auto;align-items:end;gap:8px}.work-admin-shell{height:100%;min-height:0;display:grid;grid-template-columns:232px minmax(0,1fr)}.work-rail{padding:16px 12px;border-right:1px solid var(--p-content-border-color);overflow-y:auto;min-height:0}.work-railhead{display:flex;align-items:center;justify-content:space-between;min-height:48px;gap:8px}.work-railhead h2{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-count{font-size:11px;font-weight:600;text-transform:none;white-space:nowrap;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.work-rail>.p-inputtext{width:100%;margin-bottom:12px}.work-rail-group{margin:12px 10px 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-rail .work-rail-row{width:100%;justify-content:flex-start;text-align:left;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;margin-block:2px}.work-rail-row strong{font-weight:500}.work-rail .work-rail-active{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.work-admin-main{min-width:0;min-height:0;overflow:hidden}.work-admin-main>.kx-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.work-settings-shell{min-width:0;height:100%;display:flex;flex-direction:column;container-type:inline-size}.work-settings-shell>.kx-head,.work-detail-head{flex:none}.work-detail-head{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:18px var(--kickside-system-surface-gutter, 24px) 14px}.work-detail-title{font-size:16px;font-weight:700}.work-draft-actions{margin-left:auto}.work-dirty{background:var(--kx-wash-warn);color:var(--p-warn-700);border-radius:8px;padding:7px 11px;font-size:12px;font-weight:600;white-space:nowrap}.work-settings-tabs{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding-inline:var(--kickside-system-surface-gutter, 24px);border-bottom:1px solid var(--p-content-border-color)}.work-advanced{margin-left:auto;white-space:nowrap}.work-settings-content{flex:1;min-height:0}.work-settings-fieldset{border:0;padding:0;margin:0;min-width:0}.work-settings-grid{display:grid;gap:11px;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}label.work-stack,.work-settings-grid label,.work-chip-picker legend{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-settings-grid .p-inputtext,.work-settings-grid .p-select,.work-settings-grid .p-inputnumber,.work-settings-grid .p-inputnumber-input,.work-field-control>.p-inputtext,.work-field-control>.p-select,.work-field-control>.p-inputnumber,.work-field-control .p-inputnumber-input,.work-field-control>.p-textarea{width:100%;min-width:0}.work-pane .p-inputtext,.work-pane .p-select,.work-pane .p-inputnumber-input{min-height:var(--kx-control-height)}:host .p-select,:host .p-select-label,:host .p-select-option,:host .p-inputtext,:host .p-inputnumber-input,:host .p-textarea{font-family:var(--kx-font-body);font-size:13px;font-weight:400;letter-spacing:normal;word-spacing:normal}.work-section-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.work-section-heading h2,.work-option-builder h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-section-heading p{font-size:12px;margin-top:4px}.work-definition-scroll{overflow-x:scroll;scrollbar-gutter:stable;scrollbar-color:var(--p-text-muted-color) var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-definition-scroll::-webkit-scrollbar{height:8px}.work-definition-scroll::-webkit-scrollbar-thumb{background:var(--p-content-border-color);border-radius:6px}.work-field-builder{display:grid;gap:0;grid-template-columns:52px minmax(160px,1.4fr) minmax(120px,1fr) 140px minmax(120px,1.2fr) 120px auto;min-width:936px}.work-definitions-types,.work-definitions-relations{grid-template-columns:24px minmax(160px,1.4fr) minmax(120px,1fr) 140px minmax(120px,1fr) auto;min-width:720px}.work-definitions-plugins{grid-template-columns:24px minmax(160px,1fr) 140px minmax(120px,1fr) auto;min-width:560px}.work-definition-columns,.work-definition,.work-definition-head{display:grid;grid-column:1 / -1;grid-template-columns:subgrid;min-width:0}.work-definition-head,.work-definition-columns{align-items:center;column-gap:8px;padding:12px 16px}.work-definition-columns{padding-block:8px;border-bottom:1px solid var(--p-content-border-color);font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.work-definition-toggle{display:grid;grid-column:1 / 3;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:8px;min-width:0}.work-definition-toggle .work-row-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.work-definition-code{min-width:0}.work-definition-code .work-mono{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}.work-definition-kind{min-width:0}.work-definition-kind>.p-tag{max-width:100%}.work-definition-usage{text-align:right;font-size:12px;min-width:0}.work-definition-usage details>span{display:block;white-space:normal}.work-definition-actions{display:flex;align-items:center;justify-content:flex-end;gap:0;min-width:0}.work-definition-body,.work-field-builder>.work-add-definition,.work-field-builder>.kx-empty{grid-column:1 / -1}.work-definitions-types .work-definition-flags,.work-definitions-relations .work-definition-flags,.work-definitions-plugins .work-definition-code,.work-definitions-plugins .work-definition-usage{display:none}.work-definition-meta{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}.work-definition-description{grid-column:1 / -1;padding-left:32px;font-size:12px;color:var(--p-text-muted-color)}.work-field-builder>.work-definition{border:0;border-bottom:1px solid var(--p-content-border-color);border-radius:0}.work-field-builder>.work-definition:last-child{border-bottom:0}.work-field-builder>.work-add-definition{border:0;border-radius:0}.work-row-title{font-size:14px;font-weight:600;color:var(--p-text-color)}.work-definition-affordances{display:flex;align-items:center;gap:4px}.work-definition-affordances>svg{width:16px;height:16px;flex:none}.work-definition-toggle.work-definition-has-handle{grid-template-columns:52px minmax(0,1fr)}.work-definition-flags{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.work-used-by{color:var(--p-text-muted-color);font-size:12px}.work-used-by summary{white-space:nowrap}.work-definition-body{width:min(960px,calc(100cqw - 2 * var(--kickside-system-surface-gutter, 24px) - 2px));max-width:100%;padding:16px;border-top:1px solid var(--p-content-border-color)}.work-definition-body>.p-button{justify-self:start}.work-config-widget{display:block;max-width:440px}.work-config-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:760px}.work-config-field{min-width:0;display:flex;flex-direction:column;gap:6px}.work-config-label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-config-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.work-config-chips .p-inputtext{min-width:100px;flex:1}.work-form-actions{display:flex;justify-content:flex-end;gap:8px}.work-map-zoom{display:flex;align-items:center;gap:2px}.work-pack-review-field{width:min(100%,360px)}.work-pack-choice{display:flex;flex-direction:column;gap:6px;width:100%}.work-pack-unavailable{font-size:12px;color:var(--p-warn-600)}.work-add-link{display:grid;grid-template-columns:minmax(110px,.7fr) minmax(0,1fr) auto;align-items:end;gap:8px}.work-link-search{position:relative;min-width:0}.work-link-search .p-autocomplete{width:100%;min-width:0}.work-link-search .p-autocomplete-input{min-width:0;width:100%}.work-link-board{padding:8px;border-bottom:1px solid var(--p-content-border-color)}.work-link-board .p-select{width:100%}@media(max-width:640px){.work-config-fields{grid-template-columns:minmax(0,1fr)}}.work-settings-card{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-reorder-handle{cursor:grab;touch-action:none}.work-reorder-handle:active{cursor:grabbing}.work-add-definition{align-items:end;padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);flex-wrap:wrap}.work-add-definition>label{width:min(260px,100%)}.work-option-builder{border-top:1px solid var(--p-content-border-color);padding-top:14px}.work-option-row{display:grid;grid-template-columns:28px minmax(120px,1fr) minmax(100px,.7fr) minmax(130px,1fr) auto;gap:8px;align-items:end;padding:8px 0}.work-color-swatch{width:12px;height:12px;border-radius:50%;flex:none;background:var(--p-text-muted-color)}.work-swatch-primary{background:var(--p-primary-color)}.work-swatch-success{background:var(--p-success-500)}.work-swatch-info{background:var(--p-info-500)}.work-swatch-warn{background:var(--p-warn-500)}.work-swatch-danger{background:var(--p-danger-500)}.work-chip-picker{border:0;padding:0;margin:0;display:grid;gap:8px;min-width:0}.work-chip-picker legend{padding:0;margin-bottom:8px}.work-schema-plan,.work-advanced-settings{margin-top:20px}.work-schema-plan ul{display:grid;gap:10px;padding-left:20px}.work-relation-preview{padding:12px;border-radius:8px;background:var(--kx-overlay-subtle)}.work-group-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-settings-list{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-settings-row{display:flex;align-items:center;flex-wrap:wrap;gap:16px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.work-settings-row:last-child{border-bottom:0}.work-row-main{flex:1 1 260px;min-width:0}.work-row-main .work-mono{margin-left:8px}.work-row-control{flex:0 1 360px;min-width:0}.work-row-control>.p-select,.work-row-control>.p-inputnumber{width:100%}.work-row-control .p-inputnumber{width:100%;max-width:none}.work-column-head{display:flex;align-items:center;gap:8px;min-height:32px;padding-inline:4px}.work-column-head h2{font-size:13px;font-weight:600}.work-state-dot{width:8px;height:8px;border-radius:50%;background:var(--p-text-muted-color)}.work-state-dot.work-complete{background:var(--p-success-500)}.work-wip-track{height:2px;background:var(--p-content-border-color);overflow:hidden;border-radius:2px}.work-wip-track span{display:block;height:100%;background:var(--p-primary-color)}.work-column-cards{display:flex;flex-direction:column;gap:12px;min-height:80px}dd{margin:0;overflow-wrap:anywhere}.work-column-empty{padding:28px 12px;border:1px dashed var(--p-content-border-color);border-radius:12px}.work-drag-ghost{opacity:.3}.work-settings-table{border-collapse:collapse;width:100%;text-align:left;font-size:13px}.work-settings-table th{font-size:12px;color:var(--p-text-muted-color);font-weight:600}.work-settings-table th,.work-settings-table td{position:relative;height:40px;padding:8px 16px;border-bottom:1px solid var(--p-content-border-color);vertical-align:middle}.work-settings-table tbody tr:hover{background:var(--kx-overlay-hover)}.work-column-choice{flex:1}.work-column-choice summary,.work-explanation summary{cursor:pointer}.work-column-choice[open]>div{padding-block:12px}.work-selection-bar,.work-selection-results{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-filter-node{display:grid;gap:11px;min-width:0;margin:0;padding:12px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-filter-node legend{color:var(--p-text-muted-color);padding-inline:6px}.work-filter-node .p-select{min-width:120px;max-width:300px}.work-operand-control{flex:1}.work-operand-control .p-textarea{width:100%}.work-native-dialog{padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);color:var(--p-text-color);background:var(--p-content-background);max-width:min(600px,calc(100vw - 40px));max-height:calc(100dvh - 40px);overflow:auto}.work-native-dialog::backdrop{background:color-mix(in srgb,var(--p-text-color) 28%,transparent)}.work-dialog-box{display:grid;gap:18px;padding:24px;width:min(560px,calc(100vw - 44px))}.work-dialog-actions{display:flex;justify-content:flex-end;gap:8px}.work-pack-choices.p-selectbutton{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.work-pack-choices>.p-togglebutton{text-align:left}.work-field-control>div{min-width:0}.work-plain-list{list-style:none;padding:0;margin:0 0 12px;display:grid;gap:12px}.work-pane>form:has(.work-process-editor:not([style*="display: none"])){max-width:none}.work-process-editor{min-width:0;width:100%}.work-process-builder{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(430px,auto);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden;background:var(--p-content-background)}.work-process-builder.work-process-inspecting{grid-template-columns:minmax(0,1fr) 340px}.work-process-controls{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--p-content-border-color)}.work-process-controls .p-select{max-width:220px}.work-process-title{font-weight:600;margin-right:8px}.work-process-canvas{position:relative;min-width:0;overflow:hidden;touch-action:none;background:radial-gradient(circle,color-mix(in srgb,var(--p-text-color) 13%,transparent) 1px,transparent 1.2px) 0 0 / 18px 18px,var(--p-content-background);cursor:grab}.work-process-canvas:active{cursor:grabbing}.work-process-canvas>svg{width:100%;display:block}.work-process-instruction{position:absolute;top:8px;left:16px;font-size:12px;color:var(--p-primary-color)}.work-graph-phase rect{fill:var(--kx-surface-1)}.work-graph-phase text{fill:var(--p-text-muted-color);font-size:11px;font-weight:600}.work-graph-parallel>rect{fill:none;stroke:var(--p-content-border-color);stroke-dasharray:2 3}.work-main-line,.work-edge-line{fill:none;stroke:color-mix(in srgb,var(--p-primary-color) 70%,var(--p-content-border-color));stroke-width:2.25;stroke-linecap:round;pointer-events:none}.work-edge-return .work-edge-line,.work-edge-side .work-edge-line{stroke:color-mix(in srgb,var(--p-text-muted-color) 62%,transparent);stroke-width:1.25;stroke-dasharray:4 4}.work-edge-forward .work-edge-line{stroke-width:1.25}.work-graph-edge,.work-graph-node,.work-any-transition{cursor:pointer}.work-edge-hit{fill:none;stroke:transparent;stroke-width:18}.work-graph-arrow{fill:var(--p-text-muted-color)}.work-edge-label-bg{fill:var(--p-content-background)}.work-edge-main .work-edge-label-bg{fill:var(--kx-surface-1)}.work-edge-label{font-size:10.5px;font-weight:500;fill:var(--p-text-muted-color)}.work-graph-edge.work-selected .work-edge-line{stroke:var(--p-primary-color);stroke-width:2.5}.work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color)}.work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}.work-stop-ring{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:2}.work-stop-unstarted .work-stop-ring,.work-stop-triage .work-stop-ring,.work-stop-backlog .work-stop-ring{stroke:color-mix(in srgb,var(--p-text-color) 45%,var(--p-content-border-color))}.work-stop-completed .work-stop-ring{fill:var(--p-primary-color)}.work-stop-canceled .work-stop-ring{stroke:var(--p-text-muted-color);stroke-dasharray:3 3}.work-stop-icon{color:var(--p-text-color);pointer-events:none}.work-stop-completed .work-stop-icon{color:var(--p-primary-contrast-color)}.work-stop-halo{fill:color-mix(in srgb,var(--p-primary-color) 16%,transparent)}.work-stop-focus{fill:color-mix(in srgb,var(--p-focus-ring-color) 16%,transparent);visibility:hidden}.work-graph-node:focus-visible,.work-graph-edge:focus-visible{outline:none}.work-graph-node:focus-visible .work-stop-focus{visibility:visible}.work-graph-node:focus-visible .work-stop-ring{stroke:var(--p-focus-ring-color)}.work-graph-edge:focus-visible .work-edge-label-bg{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-options{font-size:12px;color:var(--p-text-muted-color)}.work-process-options>summary{cursor:pointer}.work-process-options>:not(summary){margin-top:10px}.work-graph-node.work-selected .work-stop-ring{stroke-width:2.75}.work-graph-node.work-selected .work-node-name{fill:var(--p-primary-color)}.work-node-name{font-size:12.5px;font-weight:600;fill:var(--p-text-color)}.work-node-meta{font-size:11px;font-weight:400;fill:var(--p-text-muted-color)}.work-node-connector{fill:transparent;stroke:none;cursor:crosshair}.work-parallel-stop .work-stop-ring,.work-parallel-stop .work-stop-icon,.work-parallel-stop .work-node-connector{display:none}.work-limit-text{fill:var(--p-warn-600)}.work-connect-ghost{fill:none;stroke:var(--p-primary-color);stroke-width:2;stroke-dasharray:4 4;pointer-events:none}.work-process-legend{position:absolute;right:14px;bottom:12px;display:flex;gap:16px;color:var(--p-text-muted-color);font-size:11px;pointer-events:none}.work-process-legend i{display:inline-block;width:22px;border-top:2.25px solid var(--p-primary-color);margin-right:6px;vertical-align:middle}.work-process-legend i.work-return-key{border-top:1.25px dashed var(--p-text-muted-color)}.work-process-sideform{min-width:0;height:550px;overflow-y:auto;padding:16px;border-left:1px solid var(--p-content-border-color);display:flex;flex-direction:column;gap:14px}.work-process-sideform .work-settings-grid{grid-template-columns:1fr}.work-process-sideform .work-process-state-title{flex:1;font-size:16px;font-weight:700}.work-process-sideform h3{font-size:16px;font-weight:700}.work-process-sideform .work-process-name.p-inputtext{width:100%;min-width:0;font-size:16px;font-weight:700;padding:4px 0;background:transparent;border-color:transparent;box-shadow:none}.work-process-sideform .work-process-name.p-inputtext:focus{border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.work-block{display:block}.work-process-meaning{color:var(--p-text-muted-color);font-size:12px;margin:-6px 0 0}.work-process-group{color:var(--p-text-muted-color);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin:4px 0 -4px}.work-process-kinds{display:flex;width:100%}.work-process-kinds>*{flex:1;min-width:0}.work-process-kind{display:grid;justify-items:center;gap:4px;font-size:11px}.work-process-sideform .work-row .p-inputnumber{flex:0 0 78px;width:78px;min-width:0}.work-process-sideform .work-row .p-inputnumber-input{width:100%;min-width:0}.work-process-inspector-foot{margin-top:auto;padding-top:12px;border-top:1px solid var(--p-content-border-color)}.work-process-value{padding:10px;border:1px solid var(--p-content-border-color);border-radius:8px}.work-process-list{min-width:0;padding:16px;overflow:auto}.work-process-list>label{max-width:360px}.work-process-table{table-layout:fixed;width:100%}.work-process-table th:first-child{width:34%}.work-process-table th:last-child{width:92px}.work-process-table .p-inputtext{width:100%;min-width:0}.work-process-table td{height:40px;padding-block:2px;overflow-wrap:anywhere}.work-process-list-actions{white-space:nowrap;text-align:right}.work-process-table tr[aria-selected=true]{background:color-mix(in srgb,var(--p-primary-color) 9%,transparent)}@container (max-width: 700px){.work-process-builder.work-process-inspecting{grid-template-columns:minmax(0,1fr)}.work-process-sideform{border-left:0;border-top:1px solid var(--p-content-border-color)}}.work-node-connector:focus-visible,summary:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}@container (max-width: 1000px){.work-option-row{grid-template-columns:28px repeat(2,minmax(0,1fr))}}@media(max-width:720px){.work-admin-shell{grid-template-columns:190px minmax(0,1fr)}.work-settings-grid,.work-identity-edit{grid-template-columns:1fr}}.work-wip-container{overflow-x:auto}.work-wip-table{width:100%;border-collapse:collapse;text-align:left}.work-wip-table th{font-size:12px;font-weight:600;color:var(--p-text-muted-color);height:36px}.work-wip-table th,.work-wip-table td{padding:5px 16px;border-bottom:1px solid var(--p-content-border-color)}.work-wip-table tbody tr:last-child td{border-bottom:0}.work-wip-table td{height:44px;padding-block:4px}.work-wip-table td:first-child .work-mono{margin-left:8px}.work-wip-table th:nth-child(2),.work-wip-table td:nth-child(2){width:128px}.work-wip-table th:last-child,.work-wip-table td:last-child{width:112px;text-align:center}.work-wip-table .p-inputnumber,.work-wip-table .p-inputnumber-input{width:96px;min-width:0}.work-field-history .work-settings-row{padding-block:12px}.work-field-label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-duration-control{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px}.work-duration-control .p-inputnumber,.work-duration-control .p-inputnumber-input{width:100%;min-width:0}.work-json-disclosure{font-size:12px;min-width:0}.work-json-disclosure>summary{cursor:pointer;color:var(--p-text-muted-color)}.work-json-disclosure>label{margin-top:10px}.work-json-disclosure .p-textarea.work-json-input,.work-json-example{width:100%;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.work-json-example{margin:0;color:var(--p-text-muted-color)}.work-process-sideform .p-selectbutton,.work-process-sideform .p-selectbutton>*{flex-wrap:wrap}.work-add-option{padding-top:10px;border-top:1px solid var(--p-content-border-color)}.work-option-code.p-inputtext{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.work-content-action{font:inherit;letter-spacing:normal;word-spacing:normal;color:inherit;text-align:left;cursor:pointer}button.work-content-action{padding:0;border:0;background:transparent}.work-content-action[aria-disabled=true]{cursor:default;color:var(--p-text-muted-color)}.work-content-action:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}.work-section-navigation{min-width:0}.work-match-item.work-content-action{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--p-content-border-color)}.work-match-item:hover{background:var(--kx-overlay-hover)}';
function Tt(e, r) {
  return class extends rt {
    static get wippyConfig() {
      return { propsSchema: r, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: gt };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [mt] };
    }
  };
}
const Pt = /* @__PURE__ */ Fe({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: r }) {
    const i = e, c = r;
    function u(p) {
      if (i.disabled || p.defaultPrevented) return;
      const n = p.target;
      if (n instanceof Element && n !== p.currentTarget) {
        const o = n.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (o && o !== p.currentTarget) return;
      }
      c("activate", p);
    }
    function f(p) {
      p.target !== p.currentTarget || !["Enter", " "].includes(p.key) || (p.preventDefault(), i.disabled || c("activate", p));
    }
    return (p, n) => (Be(), dr(ur(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: u,
      onKeydown: f
    }, {
      default: hr(() => [
        oe(p.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), wt = ["aria-label", "aria-busy"], At = /* @__PURE__ */ Fe({
  __name: "NativeDialog",
  props: {
    visible: { type: Boolean },
    label: {},
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const i = e, c = r, u = K(null);
    let f = null;
    async function p() {
      await gr();
      const o = u.value;
      o && (i.visible && !o.open ? (f = o.getRootNode().activeElement, o.showModal()) : !i.visible && o.open && (o.close(), f?.focus()));
    }
    function n(o) {
      o.preventDefault(), i.busy || c("close");
    }
    return ve(() => i.visible, p), De(p), fr(() => {
      u.value?.open && u.value.close(), f?.focus();
    }), (o, t) => (Be(), mr("dialog", {
      ref_key: "dialog",
      ref: u,
      class: "work-native-dialog",
      "aria-label": e.label,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: n,
      onClose: t[0] || (t[0] = () => {
        e.visible && !e.busy && c("close");
      })
    }, [
      oe(o.$slots, "default")
    ], 40, wt));
  }
});
class Q extends Error {
  kind;
  details;
  retryable;
  status;
  constructor(r, i, c) {
    super(r.message ?? r.error ?? `${i} failed`), this.name = "ApiError", this.kind = r.kind, this.details = r.details, this.retryable = r.retryable, this.status = c;
  }
}
function qe(e, r) {
  const i = e;
  if (i && typeof i == "object" && i.success === !1) throw new Q(i, r);
  if (i && typeof i == "object" && i.success === !0 && i.data !== void 0) return i.data;
  throw new Q({ kind: "INTERNAL", message: `${r}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, r);
}
function Ze(e, r) {
  if (e instanceof Q) return e;
  const i = e?.response;
  return i?.data ? new Q(i.data, r, i.status) : e instanceof Error ? e : new Q({ kind: "Unavailable" }, r);
}
async function ue(e, r, i) {
  try {
    return qe((await Ue.get(e, { params: i })).data, r);
  } catch (c) {
    throw Ze(c, r);
  }
}
async function X(e, r, i) {
  try {
    return qe((await Ue.post(e, r)).data, i);
  } catch (c) {
    throw Ze(c, i);
  }
}
const te = "/api/v1/work", re = (e) => `${te}/boards/${encodeURIComponent(e)}`, Mt = {
  boards: async () => {
    const e = [];
    let r;
    do {
      const i = await ue(`${te}/boards${r ? "?after=" + encodeURIComponent(r) : ""}`, "Boards");
      e.push(...i.boards), r = i.next;
    } while (r);
    return e;
  },
  packs: () => ue(`${te}/packs`, "Packs").then((e) => e.packs),
  createBoard: (e, r, i, c = "", u = {}) => X(`${te}/boards`, { title: e, description: c, declaration: r, idempotency_key: i, ...u }, "Create board"),
  updateBoard: (e, r) => X(`${re(e)}/update`, r, "Update board"),
  schema: (e, r, i) => X(`${re(e)}/get_schema`, { generation: r, ...i ? { check_plugins: !0 } : {} }, "Schema"),
  // Typed operands in conditions and transition assignments can select an item.
  query: (e, r) => X(`${re(e)}/query`, r, "Item choices"),
  item: (e, r) => X(`${re(e)}/get`, { item: r }, "Item choice"),
  options: (e) => ue(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/options`, "Configuration options")
}, he = /* @__PURE__ */ new Map();
function zt(e) {
  let r = he.get(e);
  return r || (r = Promise.resolve(_r(e)).then(() => !0, () => (he.delete(e), !1)), he.set(e, r)), r;
}
function Vt(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
const le = (e) => /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|^[\w.]+:[\w.]+$/i.test(e), fe = /* @__PURE__ */ new Map();
function ae(e, r = /* @__PURE__ */ new Map()) {
  if (Array.isArray(e)) return e.map((c) => ae(c, r)).join(", ");
  if (typeof e == "string") return r.get("user:" + e) ?? (/^[^@\s]+@[^@\s]+$/.test(e) ? e : "Unavailable person");
  if (!e || typeof e != "object") return e ? "Unknown person" : "—";
  const i = e;
  for (const c of ["display_name", "displayName", "name", "label"]) if (typeof i[c] == "string" && i[c] && !le(i[c])) return i[c];
  return r.get(`${i.kind ?? "user"}:${i.id}`) ?? (typeof i.email == "string" && i.email ? i.email : i.kind === "group" ? "Unavailable group" : typeof i.id == "string" ? ae(i.id, r) : "Unavailable person");
}
async function bt(e, r) {
  const i = [...new Map(r.map((n) => [`${n.kind}:${n.id}`, { type: n.kind, id: n.id }])).values()].sort((n, o) => `${n.type}:${n.id}`.localeCompare(`${o.type}:${o.id}`)), c = JSON.stringify([e, i]), u = fe.get(c);
  if (u) return u;
  const p = (async () => {
    const n = /* @__PURE__ */ new Map();
    for (let o = 0; o < i.length; o += 200) {
      const t = await X(`/api/v1/work-admin/boards/${encodeURIComponent(e)}/principal_labels`, { refs: i.slice(o, o + 200) }, "Display names");
      for (const d of t.principals) d.label.trim() && !le(d.label) && d.label !== d.id && n.set(`${d.type}:${d.id}`, d.label.trim());
    }
    return n;
  })();
  fe.set(c, p);
  try {
    return await p;
  } finally {
    fe.delete(c);
  }
}
function xt(e, r) {
  const i = K(/* @__PURE__ */ new Map()), c = K("");
  let u = 0;
  return ve([e, r], async ([f, p]) => {
    const n = ++u;
    if (i.value = /* @__PURE__ */ new Map(), c.value = "", !(!f || !p.length))
      try {
        const o = await bt(f, p);
        n === u && (i.value = o);
      } catch (o) {
        n === u && (c.value = o instanceof Error ? o.message : "Display names are unavailable.");
      }
  }, { immediate: !0, deep: !0 }), $e(() => {
    u++, i.value.clear();
  }), {
    labels: i,
    error: c,
    label: (f) => ae(f, i.value),
    remember: (f, p) => {
      p.trim() && !le(p) && p !== f.id && i.value.set(`${f.kind}:${f.id}`, p.trim());
    }
  };
}
function _e(e) {
  if (le(e)) return "Untitled";
  const r = e.replace(/[_-]+/g, " ");
  return r.charAt(0).toUpperCase() + r.slice(1);
}
function Dt(e) {
  return e.title?.trim() || _e(e.code);
}
function er(e, r, i = ae) {
  return e == null ? "—" : r?.type === "principal" ? i(e) : Array.isArray(e) ? e.map((c) => er(c, r, i)).join(", ") : r?.type === "option" && typeof e == "string" ? r.options?.find((c) => c.id === e)?.label || _e(e) : typeof e == "boolean" ? e ? "Yes" : "No" : typeof e == "object" ? (r?.form === "ref" || r?.type === "item") && "unavailable" in e ? "Unavailable" : r?.form === "dec" && "m" in e && "e" in e && typeof e.m == "number" && typeof e.e == "number" ? (e.m * 10 ** e.e).toFixed(Math.max(0, -e.e)) : r?.form === "ref" && "ref" in e && Array.isArray(e.ref) || r?.form === "ref" && "id" in e && typeof e.id == "string" || r?.type === "item" && "item" in e && typeof e.item == "string" ? "Linked item" : JSON.stringify(e) : String(e);
}
function $t(e) {
  return ["formula", "rollup", "counter", "rank"].includes(e.type ?? "");
}
function Ft(e, r) {
  const i = xt(e, r);
  return {
    display: (c, u) => er(c, u, i.label),
    principalLabel: i.label,
    rememberPrincipal: i.remember,
    nameError: i.error,
    nameLabels: i.labels
  };
}
/*! @license MIT — @dagrejs/dagre 1.1.8 and @dagrejs/graphlib 2.2.4
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
const Bt = (function() {
  return (/* @__PURE__ */ (function() {
    function e(r, i, c) {
      function u(n, o) {
        if (!i[n]) {
          if (!r[n]) {
            var t = typeof require == "function" && require;
            if (!o && t) return t(n, !0);
            if (f) return f(n, !0);
            var d = new Error("Cannot find module '" + n + "'");
            throw d.code = "MODULE_NOT_FOUND", d;
          }
          var l = i[n] = { exports: {} };
          r[n][0].call(l.exports, function(h) {
            var a = r[n][1][h];
            return u(a || h);
          }, l, l.exports, e, r, i, c);
        }
        return i[n].exports;
      }
      for (var f = typeof require == "function" && require, p = 0; p < c.length; p++) u(c[p]);
      return u;
    }
    return e;
  })())({ 1: [function(e, r, i) {
    r.exports = { graphlib: e("@dagrejs/graphlib"), layout: e("./lib/layout"), debug: e("./lib/debug"), util: { time: e("./lib/util").time, notime: e("./lib/util").notime }, version: e("./lib/version") };
  }, { "./lib/debug": 6, "./lib/layout": 8, "./lib/util": 27, "./lib/version": 28, "@dagrejs/graphlib": 29 }], 2: [function(e, r, i) {
    let c = e("./greedy-fas"), u = e("./util").uniqueId;
    r.exports = { run: f, undo: n };
    function f(o) {
      (o.graph().acyclicer === "greedy" ? c(o, d(o)) : p(o)).forEach((l) => {
        let h = o.edge(l);
        o.removeEdge(l), h.forwardName = l.name, h.reversed = !0, o.setEdge(l.w, l.v, h, u("rev"));
      });
      function d(l) {
        return (h) => l.edge(h).weight;
      }
    }
    function p(o) {
      let t = [], d = {}, l = {};
      function h(a) {
        Object.hasOwn(l, a) || (l[a] = !0, d[a] = !0, o.outEdges(a).forEach((s) => {
          Object.hasOwn(d, s.w) ? t.push(s) : h(s.w);
        }), delete d[a]);
      }
      return o.nodes().forEach(h), t;
    }
    function n(o) {
      o.edges().forEach((t) => {
        let d = o.edge(t);
        if (d.reversed) {
          o.removeEdge(t);
          let l = d.forwardName;
          delete d.reversed, delete d.forwardName, o.setEdge(t.w, t.v, d, l);
        }
      });
    }
  }, { "./greedy-fas": 7, "./util": 27 }], 3: [function(e, r, i) {
    let c = e("./util");
    r.exports = u;
    function u(p) {
      function n(o) {
        let t = p.children(o), d = p.node(o);
        if (t.length && t.forEach(n), Object.hasOwn(d, "minRank")) {
          d.borderLeft = [], d.borderRight = [];
          for (let l = d.minRank, h = d.maxRank + 1; l < h; ++l)
            f(p, "borderLeft", "_bl", o, d, l), f(p, "borderRight", "_br", o, d, l);
        }
      }
      p.children().forEach(n);
    }
    function f(p, n, o, t, d, l) {
      let h = { width: 0, height: 0, rank: l, borderType: n }, a = d[n][l - 1], s = c.addDummyNode(p, "border", h, o);
      d[n][l] = s, p.setParent(s, t), a && p.setEdge(a, s, { weight: 1 });
    }
  }, { "./util": 27 }], 4: [function(e, r, i) {
    r.exports = { adjust: c, undo: u };
    function c(l) {
      let h = l.graph().rankdir.toLowerCase();
      (h === "lr" || h === "rl") && f(l);
    }
    function u(l) {
      let h = l.graph().rankdir.toLowerCase();
      (h === "bt" || h === "rl") && n(l), (h === "lr" || h === "rl") && (t(l), f(l));
    }
    function f(l) {
      l.nodes().forEach((h) => p(l.node(h))), l.edges().forEach((h) => p(l.edge(h)));
    }
    function p(l) {
      let h = l.width;
      l.width = l.height, l.height = h;
    }
    function n(l) {
      l.nodes().forEach((h) => o(l.node(h))), l.edges().forEach((h) => {
        let a = l.edge(h);
        a.points.forEach(o), Object.hasOwn(a, "y") && o(a);
      });
    }
    function o(l) {
      l.y = -l.y;
    }
    function t(l) {
      l.nodes().forEach((h) => d(l.node(h))), l.edges().forEach((h) => {
        let a = l.edge(h);
        a.points.forEach(d), Object.hasOwn(a, "x") && d(a);
      });
    }
    function d(l) {
      let h = l.x;
      l.x = l.y, l.y = h;
    }
  }, {}], 5: [function(e, r, i) {
    class c {
      constructor() {
        let n = {};
        n._next = n._prev = n, this._sentinel = n;
      }
      dequeue() {
        let n = this._sentinel, o = n._prev;
        if (o !== n)
          return u(o), o;
      }
      enqueue(n) {
        let o = this._sentinel;
        n._prev && n._next && u(n), n._next = o._next, o._next._prev = n, o._next = n, n._prev = o;
      }
      toString() {
        let n = [], o = this._sentinel, t = o._prev;
        for (; t !== o; )
          n.push(JSON.stringify(t, f)), t = t._prev;
        return "[" + n.join(", ") + "]";
      }
    }
    function u(p) {
      p._prev._next = p._next, p._next._prev = p._prev, delete p._next, delete p._prev;
    }
    function f(p, n) {
      if (p !== "_next" && p !== "_prev")
        return n;
    }
    r.exports = c;
  }, {}], 6: [function(e, r, i) {
    let c = e("./util"), u = e("@dagrejs/graphlib").Graph;
    r.exports = { debugOrdering: f };
    function f(p) {
      let n = c.buildLayerMatrix(p), o = new u({ compound: !0, multigraph: !0 }).setGraph({});
      return p.nodes().forEach((t) => {
        o.setNode(t, { label: t }), o.setParent(t, "layer" + p.node(t).rank);
      }), p.edges().forEach((t) => o.setEdge(t.v, t.w, {}, t.name)), n.forEach((t, d) => {
        let l = "layer" + d;
        o.setNode(l, { rank: "same" }), t.reduce((h, a) => (o.setEdge(h, a, { style: "invis" }), a));
      }), o;
    }
  }, { "./util": 27, "@dagrejs/graphlib": 29 }], 7: [function(e, r, i) {
    let c = e("@dagrejs/graphlib").Graph, u = e("./data/list");
    r.exports = p;
    let f = () => 1;
    function p(h, a) {
      if (h.nodeCount() <= 1)
        return [];
      let s = t(h, a || f);
      return n(s.graph, s.buckets, s.zeroIdx).flatMap((g) => h.outEdges(g.v, g.w));
    }
    function n(h, a, s) {
      let m = [], g = a[a.length - 1], y = a[0], L;
      for (; h.nodeCount(); ) {
        for (; L = y.dequeue(); )
          o(h, a, s, L);
        for (; L = g.dequeue(); )
          o(h, a, s, L);
        if (h.nodeCount()) {
          for (let b = a.length - 2; b > 0; --b)
            if (L = a[b].dequeue(), L) {
              m = m.concat(o(h, a, s, L, !0));
              break;
            }
        }
      }
      return m;
    }
    function o(h, a, s, m, g) {
      let y = g ? [] : void 0;
      return h.inEdges(m.v).forEach((L) => {
        let b = h.edge(L), _ = h.node(L.v);
        g && y.push({ v: L.v, w: L.w }), _.out -= b, d(a, s, _);
      }), h.outEdges(m.v).forEach((L) => {
        let b = h.edge(L), _ = L.w, x = h.node(_);
        x.in -= b, d(a, s, x);
      }), h.removeNode(m.v), y;
    }
    function t(h, a) {
      let s = new c(), m = 0, g = 0;
      h.nodes().forEach((b) => {
        s.setNode(b, { v: b, in: 0, out: 0 });
      }), h.edges().forEach((b) => {
        let _ = s.edge(b.v, b.w) || 0, x = a(b), N = _ + x;
        s.setEdge(b.v, b.w, N), g = Math.max(g, s.node(b.v).out += x), m = Math.max(m, s.node(b.w).in += x);
      });
      let y = l(g + m + 3).map(() => new u()), L = m + 1;
      return s.nodes().forEach((b) => {
        d(y, L, s.node(b));
      }), { graph: s, buckets: y, zeroIdx: L };
    }
    function d(h, a, s) {
      s.out ? s.in ? h[s.out - s.in + a].enqueue(s) : h[h.length - 1].enqueue(s) : h[0].enqueue(s);
    }
    function l(h) {
      const a = [];
      for (let s = 0; s < h; s++)
        a.push(s);
      return a;
    }
  }, { "./data/list": 5, "@dagrejs/graphlib": 29 }], 8: [function(e, r, i) {
    let c = e("./acyclic"), u = e("./normalize"), f = e("./rank"), p = e("./util").normalizeRanks, n = e("./parent-dummy-chains"), o = e("./util").removeEmptyRanks, t = e("./nesting-graph"), d = e("./add-border-segments"), l = e("./coordinate-system"), h = e("./order"), a = e("./position"), s = e("./util"), m = e("@dagrejs/graphlib").Graph;
    r.exports = g;
    function g(k, C) {
      let j = C && C.debugTiming ? s.time : s.notime;
      j("layout", () => {
        let P = j("  buildLayoutGraph", () => w(k));
        j("  runLayout", () => y(P, j, C)), j("  updateInputGraph", () => L(k, P));
      });
    }
    function y(k, C, j) {
      C("    makeSpaceForEdgeLabels", () => v(k)), C("    removeSelfEdges", () => ir(k)), C("    acyclic", () => c.run(k)), C("    nestingGraph.run", () => t.run(k)), C("    rank", () => f(s.asNonCompoundGraph(k))), C("    injectEdgeLabelProxies", () => E(k)), C("    removeEmptyRanks", () => o(k)), C("    nestingGraph.cleanup", () => t.cleanup(k)), C("    normalizeRanks", () => p(k)), C("    assignRankMinMax", () => O(k)), C("    removeEdgeLabelProxies", () => S(k)), C("    normalize.run", () => u.run(k)), C("    parentDummyChains", () => n(k)), C("    addBorderSegments", () => d(k)), C("    order", () => h(k, j)), C("    insertSelfEdges", () => nr(k)), C("    adjustCoordinateSystem", () => l.adjust(k)), C("    position", () => a(k)), C("    positionSelfEdges", () => ar(k)), C("    removeBorderNodes", () => Y(k)), C("    normalize.undo", () => u.undo(k)), C("    fixupEdgeLabelCoords", () => $(k)), C("    undoCoordinateSystem", () => l.undo(k)), C("    translateGraph", () => M(k)), C("    assignNodeIntersects", () => z(k)), C("    reversePoints", () => H(k)), C("    acyclic.undo", () => c.undo(k));
    }
    function L(k, C) {
      k.nodes().forEach((j) => {
        let P = k.node(j), V = C.node(j);
        P && (P.x = V.x, P.y = V.y, P.rank = V.rank, C.children(j).length && (P.width = V.width, P.height = V.height));
      }), k.edges().forEach((j) => {
        let P = k.edge(j), V = C.edge(j);
        P.points = V.points, Object.hasOwn(V, "x") && (P.x = V.x, P.y = V.y);
      }), k.graph().width = C.graph().width, k.graph().height = C.graph().height;
    }
    let b = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], _ = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, x = ["acyclicer", "ranker", "rankdir", "align"], N = ["width", "height", "rank"], I = { width: 0, height: 0 }, R = ["minlen", "weight", "width", "height", "labeloffset"], T = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" }, A = ["labelpos"];
    function w(k) {
      let C = new m({ multigraph: !0, compound: !0 }), j = ce(k.graph());
      return C.setGraph(Object.assign({}, _, pe(j, b), s.pick(j, x))), k.nodes().forEach((P) => {
        let V = ce(k.node(P));
        const D = pe(V, N);
        Object.keys(I).forEach((F) => {
          D[F] === void 0 && (D[F] = I[F]);
        }), C.setNode(P, D), C.setParent(P, k.parent(P));
      }), k.edges().forEach((P) => {
        let V = ce(k.edge(P));
        C.setEdge(P, Object.assign({}, T, pe(V, R), s.pick(V, A)));
      }), C;
    }
    function v(k) {
      let C = k.graph();
      C.ranksep /= 2, k.edges().forEach((j) => {
        let P = k.edge(j);
        P.minlen *= 2, P.labelpos.toLowerCase() !== "c" && (C.rankdir === "TB" || C.rankdir === "BT" ? P.width += P.labeloffset : P.height += P.labeloffset);
      });
    }
    function E(k) {
      k.edges().forEach((C) => {
        let j = k.edge(C);
        if (j.width && j.height) {
          let P = k.node(C.v), D = { rank: (k.node(C.w).rank - P.rank) / 2 + P.rank, e: C };
          s.addDummyNode(k, "edge-proxy", D, "_ep");
        }
      });
    }
    function O(k) {
      let C = 0;
      k.nodes().forEach((j) => {
        let P = k.node(j);
        P.borderTop && (P.minRank = k.node(P.borderTop).rank, P.maxRank = k.node(P.borderBottom).rank, C = Math.max(C, P.maxRank));
      }), k.graph().maxRank = C;
    }
    function S(k) {
      k.nodes().forEach((C) => {
        let j = k.node(C);
        j.dummy === "edge-proxy" && (k.edge(j.e).labelRank = j.rank, k.removeNode(C));
      });
    }
    function M(k) {
      let C = Number.POSITIVE_INFINITY, j = 0, P = Number.POSITIVE_INFINITY, V = 0, D = k.graph(), F = D.marginx || 0, G = D.marginy || 0;
      function Ee(W) {
        let U = W.x, q = W.y, Ce = W.width, Oe = W.height;
        C = Math.min(C, U - Ce / 2), j = Math.max(j, U + Ce / 2), P = Math.min(P, q - Oe / 2), V = Math.max(V, q + Oe / 2);
      }
      k.nodes().forEach((W) => Ee(k.node(W))), k.edges().forEach((W) => {
        let U = k.edge(W);
        Object.hasOwn(U, "x") && Ee(U);
      }), C -= F, P -= G, k.nodes().forEach((W) => {
        let U = k.node(W);
        U.x -= C, U.y -= P;
      }), k.edges().forEach((W) => {
        let U = k.edge(W);
        U.points.forEach((q) => {
          q.x -= C, q.y -= P;
        }), Object.hasOwn(U, "x") && (U.x -= C), Object.hasOwn(U, "y") && (U.y -= P);
      }), D.width = j - C + F, D.height = V - P + G;
    }
    function z(k) {
      k.edges().forEach((C) => {
        let j = k.edge(C), P = k.node(C.v), V = k.node(C.w), D, F;
        j.points ? (D = j.points[0], F = j.points[j.points.length - 1]) : (j.points = [], D = V, F = P), j.points.unshift(s.intersectRect(P, D)), j.points.push(s.intersectRect(V, F));
      });
    }
    function $(k) {
      k.edges().forEach((C) => {
        let j = k.edge(C);
        if (Object.hasOwn(j, "x"))
          switch ((j.labelpos === "l" || j.labelpos === "r") && (j.width -= j.labeloffset), j.labelpos) {
            case "l":
              j.x -= j.width / 2 + j.labeloffset;
              break;
            case "r":
              j.x += j.width / 2 + j.labeloffset;
              break;
          }
      });
    }
    function H(k) {
      k.edges().forEach((C) => {
        let j = k.edge(C);
        j.reversed && j.points.reverse();
      });
    }
    function Y(k) {
      k.nodes().forEach((C) => {
        if (k.children(C).length) {
          let j = k.node(C), P = k.node(j.borderTop), V = k.node(j.borderBottom), D = k.node(j.borderLeft[j.borderLeft.length - 1]), F = k.node(j.borderRight[j.borderRight.length - 1]);
          j.width = Math.abs(F.x - D.x), j.height = Math.abs(V.y - P.y), j.x = D.x + j.width / 2, j.y = P.y + j.height / 2;
        }
      }), k.nodes().forEach((C) => {
        k.node(C).dummy === "border" && k.removeNode(C);
      });
    }
    function ir(k) {
      k.edges().forEach((C) => {
        if (C.v === C.w) {
          var j = k.node(C.v);
          j.selfEdges || (j.selfEdges = []), j.selfEdges.push({ e: C, label: k.edge(C) }), k.removeEdge(C);
        }
      });
    }
    function nr(k) {
      var C = s.buildLayerMatrix(k);
      C.forEach((j) => {
        var P = 0;
        j.forEach((V, D) => {
          var F = k.node(V);
          F.order = D + P, (F.selfEdges || []).forEach((G) => {
            s.addDummyNode(k, "selfedge", { width: G.label.width, height: G.label.height, rank: F.rank, order: D + ++P, e: G.e, label: G.label }, "_se");
          }), delete F.selfEdges;
        });
      });
    }
    function ar(k) {
      k.nodes().forEach((C) => {
        var j = k.node(C);
        if (j.dummy === "selfedge") {
          var P = k.node(j.e.v), V = P.x + P.width / 2, D = P.y, F = j.x - V, G = P.height / 2;
          k.setEdge(j.e, j.label), k.removeNode(C), j.label.points = [{ x: V + 2 * F / 3, y: D - G }, { x: V + 5 * F / 6, y: D - G }, { x: V + F, y: D }, { x: V + 5 * F / 6, y: D + G }, { x: V + 2 * F / 3, y: D + G }], j.label.x = j.x, j.label.y = j.y;
        }
      });
    }
    function pe(k, C) {
      return s.mapValues(s.pick(k, C), Number);
    }
    function ce(k) {
      var C = {};
      return k && Object.entries(k).forEach(([j, P]) => {
        typeof j == "string" && (j = j.toLowerCase()), C[j] = P;
      }), C;
    }
  }, { "./acyclic": 2, "./add-border-segments": 3, "./coordinate-system": 4, "./nesting-graph": 9, "./normalize": 10, "./order": 15, "./parent-dummy-chains": 20, "./position": 22, "./rank": 24, "./util": 27, "@dagrejs/graphlib": 29 }], 9: [function(e, r, i) {
    let c = e("./util");
    r.exports = { run: u, cleanup: o };
    function u(t) {
      let d = c.addDummyNode(t, "root", {}, "_root"), l = p(t), h = Object.values(l), a = c.applyWithChunking(Math.max, h) - 1, s = 2 * a + 1;
      t.graph().nestingRoot = d, t.edges().forEach((g) => t.edge(g).minlen *= s);
      let m = n(t) + 1;
      t.children().forEach((g) => f(t, d, s, m, a, l, g)), t.graph().nodeRankFactor = s;
    }
    function f(t, d, l, h, a, s, m) {
      let g = t.children(m);
      if (!g.length) {
        m !== d && t.setEdge(d, m, { weight: 0, minlen: l });
        return;
      }
      let y = c.addBorderNode(t, "_bt"), L = c.addBorderNode(t, "_bb"), b = t.node(m);
      t.setParent(y, m), b.borderTop = y, t.setParent(L, m), b.borderBottom = L, g.forEach((_) => {
        f(t, d, l, h, a, s, _);
        let x = t.node(_), N = x.borderTop ? x.borderTop : _, I = x.borderBottom ? x.borderBottom : _, R = x.borderTop ? h : 2 * h, T = N !== I ? 1 : a - s[m] + 1;
        t.setEdge(y, N, { weight: R, minlen: T, nestingEdge: !0 }), t.setEdge(I, L, { weight: R, minlen: T, nestingEdge: !0 });
      }), t.parent(m) || t.setEdge(d, y, { weight: 0, minlen: a + s[m] });
    }
    function p(t) {
      var d = {};
      function l(h, a) {
        var s = t.children(h);
        s && s.length && s.forEach((m) => l(m, a + 1)), d[h] = a;
      }
      return t.children().forEach((h) => l(h, 1)), d;
    }
    function n(t) {
      return t.edges().reduce((d, l) => d + t.edge(l).weight, 0);
    }
    function o(t) {
      var d = t.graph();
      t.removeNode(d.nestingRoot), delete d.nestingRoot, t.edges().forEach((l) => {
        var h = t.edge(l);
        h.nestingEdge && t.removeEdge(l);
      });
    }
  }, { "./util": 27 }], 10: [function(e, r, i) {
    let c = e("./util");
    r.exports = { run: u, undo: p };
    function u(n) {
      n.graph().dummyChains = [], n.edges().forEach((o) => f(n, o));
    }
    function f(n, o) {
      let t = o.v, d = n.node(t).rank, l = o.w, h = n.node(l).rank, a = o.name, s = n.edge(o), m = s.labelRank;
      if (h === d + 1) return;
      n.removeEdge(o);
      let g, y, L;
      for (L = 0, ++d; d < h; ++L, ++d)
        s.points = [], y = { width: 0, height: 0, edgeLabel: s, edgeObj: o, rank: d }, g = c.addDummyNode(n, "edge", y, "_d"), d === m && (y.width = s.width, y.height = s.height, y.dummy = "edge-label", y.labelpos = s.labelpos), n.setEdge(t, g, { weight: s.weight }, a), L === 0 && n.graph().dummyChains.push(g), t = g;
      n.setEdge(t, l, { weight: s.weight }, a);
    }
    function p(n) {
      n.graph().dummyChains.forEach((o) => {
        let t = n.node(o), d = t.edgeLabel, l;
        for (n.setEdge(t.edgeObj, d); t.dummy; )
          l = n.successors(o)[0], n.removeNode(o), d.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (d.x = t.x, d.y = t.y, d.width = t.width, d.height = t.height), o = l, t = n.node(o);
      });
    }
  }, { "./util": 27 }], 11: [function(e, r, i) {
    r.exports = c;
    function c(u, f, p) {
      let n = {}, o;
      p.forEach((t) => {
        let d = u.parent(t), l, h;
        for (; d; ) {
          if (l = u.parent(d), l ? (h = n[l], n[l] = d) : (h = o, o = d), h && h !== d) {
            f.setEdge(h, d);
            return;
          }
          d = l;
        }
      });
    }
  }, {}], 12: [function(e, r, i) {
    r.exports = c;
    function c(u, f = []) {
      return f.map((p) => {
        let n = u.inEdges(p);
        if (n.length) {
          let o = n.reduce((t, d) => {
            let l = u.edge(d), h = u.node(d.v);
            return { sum: t.sum + l.weight * h.order, weight: t.weight + l.weight };
          }, { sum: 0, weight: 0 });
          return { v: p, barycenter: o.sum / o.weight, weight: o.weight };
        } else
          return { v: p };
      });
    }
  }, {}], 13: [function(e, r, i) {
    let c = e("@dagrejs/graphlib").Graph, u = e("../util");
    r.exports = f;
    function f(n, o, t, d) {
      d || (d = n.nodes());
      let l = p(n), h = new c({ compound: !0 }).setGraph({ root: l }).setDefaultNodeLabel((a) => n.node(a));
      return d.forEach((a) => {
        let s = n.node(a), m = n.parent(a);
        (s.rank === o || s.minRank <= o && o <= s.maxRank) && (h.setNode(a), h.setParent(a, m || l), n[t](a).forEach((g) => {
          let y = g.v === a ? g.w : g.v, L = h.edge(y, a), b = L !== void 0 ? L.weight : 0;
          h.setEdge(y, a, { weight: n.edge(g).weight + b });
        }), Object.hasOwn(s, "minRank") && h.setNode(a, { borderLeft: s.borderLeft[o], borderRight: s.borderRight[o] }));
      }), h;
    }
    function p(n) {
      for (var o; n.hasNode(o = u.uniqueId("_root")); ) ;
      return o;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 14: [function(e, r, i) {
    let c = e("../util").zipObject;
    r.exports = u;
    function u(p, n) {
      let o = 0;
      for (let t = 1; t < n.length; ++t)
        o += f(p, n[t - 1], n[t]);
      return o;
    }
    function f(p, n, o) {
      let t = c(o, o.map((m, g) => g)), d = n.flatMap((m) => p.outEdges(m).map((g) => ({ pos: t[g.w], weight: p.edge(g).weight })).sort((g, y) => g.pos - y.pos)), l = 1;
      for (; l < o.length; ) l <<= 1;
      let h = 2 * l - 1;
      l -= 1;
      let a = new Array(h).fill(0), s = 0;
      return d.forEach((m) => {
        let g = m.pos + l;
        a[g] += m.weight;
        let y = 0;
        for (; g > 0; )
          g % 2 && (y += a[g + 1]), g = g - 1 >> 1, a[g] += m.weight;
        s += m.weight * y;
      }), s;
    }
  }, { "../util": 27 }], 15: [function(e, r, i) {
    let c = e("./init-order"), u = e("./cross-count"), f = e("./sort-subgraph"), p = e("./build-layer-graph"), n = e("./add-subgraph-constraints"), o = e("@dagrejs/graphlib").Graph, t = e("../util");
    r.exports = d;
    function d(s, m) {
      if (m && typeof m.customOrder == "function") {
        m.customOrder(s, d);
        return;
      }
      let g = t.maxRank(s), y = l(s, t.range(1, g + 1), "inEdges"), L = l(s, t.range(g - 1, -1, -1), "outEdges"), b = c(s);
      if (a(s, b), m && m.disableOptimalOrderHeuristic)
        return;
      let _ = Number.POSITIVE_INFINITY, x;
      for (let N = 0, I = 0; I < 4; ++N, ++I) {
        h(N % 2 ? y : L, N % 4 >= 2), b = t.buildLayerMatrix(s);
        let R = u(s, b);
        R < _ && (I = 0, x = Object.assign({}, b), _ = R);
      }
      a(s, x);
    }
    function l(s, m, g) {
      const y = /* @__PURE__ */ new Map(), L = (b, _) => {
        y.has(b) || y.set(b, []), y.get(b).push(_);
      };
      for (const b of s.nodes()) {
        const _ = s.node(b);
        if (typeof _.rank == "number" && L(_.rank, b), typeof _.minRank == "number" && typeof _.maxRank == "number")
          for (let x = _.minRank; x <= _.maxRank; x++)
            x !== _.rank && L(x, b);
      }
      return m.map(function(b) {
        return p(s, b, g, y.get(b) || []);
      });
    }
    function h(s, m) {
      let g = new o();
      s.forEach(function(y) {
        let L = y.graph().root, b = f(y, L, g, m);
        b.vs.forEach((_, x) => y.node(_).order = x), n(y, g, b.vs);
      });
    }
    function a(s, m) {
      Object.values(m).forEach((g) => g.forEach((y, L) => s.node(y).order = L));
    }
  }, { "../util": 27, "./add-subgraph-constraints": 11, "./build-layer-graph": 13, "./cross-count": 14, "./init-order": 16, "./sort-subgraph": 18, "@dagrejs/graphlib": 29 }], 16: [function(e, r, i) {
    let c = e("../util");
    r.exports = u;
    function u(f) {
      let p = {}, n = f.nodes().filter((a) => !f.children(a).length), o = n.map((a) => f.node(a).rank), t = c.applyWithChunking(Math.max, o), d = c.range(t + 1).map(() => []);
      function l(a) {
        if (p[a]) return;
        p[a] = !0;
        let s = f.node(a);
        d[s.rank].push(a), f.successors(a).forEach(l);
      }
      return n.sort((a, s) => f.node(a).rank - f.node(s).rank).forEach(l), d;
    }
  }, { "../util": 27 }], 17: [function(e, r, i) {
    let c = e("../util");
    r.exports = u;
    function u(n, o) {
      let t = {};
      n.forEach((l, h) => {
        let a = t[l.v] = { indegree: 0, in: [], out: [], vs: [l.v], i: h };
        l.barycenter !== void 0 && (a.barycenter = l.barycenter, a.weight = l.weight);
      }), o.edges().forEach((l) => {
        let h = t[l.v], a = t[l.w];
        h !== void 0 && a !== void 0 && (a.indegree++, h.out.push(t[l.w]));
      });
      let d = Object.values(t).filter((l) => !l.indegree);
      return f(d);
    }
    function f(n) {
      let o = [];
      function t(l) {
        return (h) => {
          h.merged || (h.barycenter === void 0 || l.barycenter === void 0 || h.barycenter >= l.barycenter) && p(l, h);
        };
      }
      function d(l) {
        return (h) => {
          h.in.push(l), --h.indegree === 0 && n.push(h);
        };
      }
      for (; n.length; ) {
        let l = n.pop();
        o.push(l), l.in.reverse().forEach(t(l)), l.out.forEach(d(l));
      }
      return o.filter((l) => !l.merged).map((l) => c.pick(l, ["vs", "i", "barycenter", "weight"]));
    }
    function p(n, o) {
      let t = 0, d = 0;
      n.weight && (t += n.barycenter * n.weight, d += n.weight), o.weight && (t += o.barycenter * o.weight, d += o.weight), n.vs = o.vs.concat(n.vs), n.barycenter = t / d, n.weight = d, n.i = Math.min(o.i, n.i), o.merged = !0;
    }
  }, { "../util": 27 }], 18: [function(e, r, i) {
    let c = e("./barycenter"), u = e("./resolve-conflicts"), f = e("./sort");
    r.exports = p;
    function p(t, d, l, h) {
      let a = t.children(d), s = t.node(d), m = s ? s.borderLeft : void 0, g = s ? s.borderRight : void 0, y = {};
      m && (a = a.filter((x) => x !== m && x !== g));
      let L = c(t, a);
      L.forEach((x) => {
        if (t.children(x.v).length) {
          let N = p(t, x.v, l, h);
          y[x.v] = N, Object.hasOwn(N, "barycenter") && o(x, N);
        }
      });
      let b = u(L, l);
      n(b, y);
      let _ = f(b, h);
      if (m && (_.vs = [m, _.vs, g].flat(!0), t.predecessors(m).length)) {
        let x = t.node(t.predecessors(m)[0]), N = t.node(t.predecessors(g)[0]);
        Object.hasOwn(_, "barycenter") || (_.barycenter = 0, _.weight = 0), _.barycenter = (_.barycenter * _.weight + x.order + N.order) / (_.weight + 2), _.weight += 2;
      }
      return _;
    }
    function n(t, d) {
      t.forEach((l) => {
        l.vs = l.vs.flatMap((h) => d[h] ? d[h].vs : h);
      });
    }
    function o(t, d) {
      t.barycenter !== void 0 ? (t.barycenter = (t.barycenter * t.weight + d.barycenter * d.weight) / (t.weight + d.weight), t.weight += d.weight) : (t.barycenter = d.barycenter, t.weight = d.weight);
    }
  }, { "./barycenter": 12, "./resolve-conflicts": 17, "./sort": 19 }], 19: [function(e, r, i) {
    let c = e("../util");
    r.exports = u;
    function u(n, o) {
      let t = c.partition(n, (y) => Object.hasOwn(y, "barycenter")), d = t.lhs, l = t.rhs.sort((y, L) => L.i - y.i), h = [], a = 0, s = 0, m = 0;
      d.sort(p(!!o)), m = f(h, l, m), d.forEach((y) => {
        m += y.vs.length, h.push(y.vs), a += y.barycenter * y.weight, s += y.weight, m = f(h, l, m);
      });
      let g = { vs: h.flat(!0) };
      return s && (g.barycenter = a / s, g.weight = s), g;
    }
    function f(n, o, t) {
      let d;
      for (; o.length && (d = o[o.length - 1]).i <= t; )
        o.pop(), n.push(d.vs), t++;
      return t;
    }
    function p(n) {
      return (o, t) => o.barycenter < t.barycenter ? -1 : o.barycenter > t.barycenter ? 1 : n ? t.i - o.i : o.i - t.i;
    }
  }, { "../util": 27 }], 20: [function(e, r, i) {
    r.exports = c;
    function c(p) {
      let n = f(p);
      p.graph().dummyChains.forEach((o) => {
        let t = p.node(o), d = t.edgeObj, l = u(p, n, d.v, d.w), h = l.path, a = l.lca, s = 0, m = h[s], g = !0;
        for (; o !== d.w; ) {
          if (t = p.node(o), g) {
            for (; (m = h[s]) !== a && p.node(m).maxRank < t.rank; )
              s++;
            m === a && (g = !1);
          }
          if (!g) {
            for (; s < h.length - 1 && p.node(m = h[s + 1]).minRank <= t.rank; )
              s++;
            m = h[s];
          }
          p.setParent(o, m), o = p.successors(o)[0];
        }
      });
    }
    function u(p, n, o, t) {
      let d = [], l = [], h = Math.min(n[o].low, n[t].low), a = Math.max(n[o].lim, n[t].lim), s, m;
      s = o;
      do
        s = p.parent(s), d.push(s);
      while (s && (n[s].low > h || a > n[s].lim));
      for (m = s, s = t; (s = p.parent(s)) !== m; )
        l.push(s);
      return { path: d.concat(l.reverse()), lca: m };
    }
    function f(p) {
      let n = {}, o = 0;
      function t(d) {
        let l = o;
        p.children(d).forEach(t), n[d] = { low: l, lim: o++ };
      }
      return p.children().forEach(t), n;
    }
  }, {}], 21: [function(e, r, i) {
    let c = e("@dagrejs/graphlib").Graph, u = e("../util");
    r.exports = { positionX: g, findType1Conflicts: f, findType2Conflicts: p, addConflict: o, hasConflict: t, verticalAlignment: d, horizontalCompaction: l, alignCoordinates: s, findSmallestWidthAlignment: a, balance: m };
    function f(b, _) {
      let x = {};
      function N(I, R) {
        let T = 0, A = 0, w = I.length, v = R[R.length - 1];
        return R.forEach((E, O) => {
          let S = n(b, E), M = S ? b.node(S).order : w;
          (S || E === v) && (R.slice(A, O + 1).forEach((z) => {
            b.predecessors(z).forEach(($) => {
              let H = b.node($), Y = H.order;
              (Y < T || M < Y) && !(H.dummy && b.node(z).dummy) && o(x, $, z);
            });
          }), A = O + 1, T = M);
        }), R;
      }
      return _.length && _.reduce(N), x;
    }
    function p(b, _) {
      let x = {};
      function N(R, T, A, w, v) {
        let E;
        u.range(T, A).forEach((O) => {
          E = R[O], b.node(E).dummy && b.predecessors(E).forEach((S) => {
            let M = b.node(S);
            M.dummy && (M.order < w || M.order > v) && o(x, S, E);
          });
        });
      }
      function I(R, T) {
        let A = -1, w, v = 0;
        return T.forEach((E, O) => {
          if (b.node(E).dummy === "border") {
            let S = b.predecessors(E);
            S.length && (w = b.node(S[0]).order, N(T, v, O, A, w), v = O, A = w);
          }
          N(T, v, T.length, w, R.length);
        }), T;
      }
      return _.length && _.reduce(I), x;
    }
    function n(b, _) {
      if (b.node(_).dummy)
        return b.predecessors(_).find((x) => b.node(x).dummy);
    }
    function o(b, _, x) {
      if (_ > x) {
        let I = _;
        _ = x, x = I;
      }
      let N = b[_];
      N || (b[_] = N = {}), N[x] = !0;
    }
    function t(b, _, x) {
      if (_ > x) {
        let N = _;
        _ = x, x = N;
      }
      return !!b[_] && Object.hasOwn(b[_], x);
    }
    function d(b, _, x, N) {
      let I = {}, R = {}, T = {};
      return _.forEach((A) => {
        A.forEach((w, v) => {
          I[w] = w, R[w] = w, T[w] = v;
        });
      }), _.forEach((A) => {
        let w = -1;
        A.forEach((v) => {
          let E = N(v);
          if (E.length) {
            E = E.sort((S, M) => T[S] - T[M]);
            let O = (E.length - 1) / 2;
            for (let S = Math.floor(O), M = Math.ceil(O); S <= M; ++S) {
              let z = E[S];
              R[v] === v && w < T[z] && !t(x, v, z) && (R[z] = v, R[v] = I[v] = I[z], w = T[z]);
            }
          }
        });
      }), { root: I, align: R };
    }
    function l(b, _, x, N, I) {
      let R = {}, T = h(b, _, x, I), A = I ? "borderLeft" : "borderRight";
      function w(O, S) {
        let M = T.nodes(), z = M.pop(), $ = {};
        for (; z; )
          $[z] ? O(z) : ($[z] = !0, M.push(z), M = M.concat(S(z))), z = M.pop();
      }
      function v(O) {
        R[O] = T.inEdges(O).reduce((S, M) => Math.max(S, R[M.v] + T.edge(M)), 0);
      }
      function E(O) {
        let S = T.outEdges(O).reduce((z, $) => Math.min(z, R[$.w] - T.edge($)), Number.POSITIVE_INFINITY), M = b.node(O);
        S !== Number.POSITIVE_INFINITY && M.borderType !== A && (R[O] = Math.max(R[O], S));
      }
      return w(v, T.predecessors.bind(T)), w(E, T.successors.bind(T)), Object.keys(N).forEach((O) => R[O] = R[x[O]]), R;
    }
    function h(b, _, x, N) {
      let I = new c(), R = b.graph(), T = y(R.nodesep, R.edgesep, N);
      return _.forEach((A) => {
        let w;
        A.forEach((v) => {
          let E = x[v];
          if (I.setNode(E), w) {
            var O = x[w], S = I.edge(O, E);
            I.setEdge(O, E, Math.max(T(b, v, w), S || 0));
          }
          w = v;
        });
      }), I;
    }
    function a(b, _) {
      return Object.values(_).reduce((x, N) => {
        let I = Number.NEGATIVE_INFINITY, R = Number.POSITIVE_INFINITY;
        Object.entries(N).forEach(([A, w]) => {
          let v = L(b, A) / 2;
          I = Math.max(w + v, I), R = Math.min(w - v, R);
        });
        const T = I - R;
        return T < x[0] && (x = [T, N]), x;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function s(b, _) {
      let x = Object.values(_), N = u.applyWithChunking(Math.min, x), I = u.applyWithChunking(Math.max, x);
      ["u", "d"].forEach((R) => {
        ["l", "r"].forEach((T) => {
          let A = R + T, w = b[A];
          if (w === _) return;
          let v = Object.values(w), E = N - u.applyWithChunking(Math.min, v);
          T !== "l" && (E = I - u.applyWithChunking(Math.max, v)), E && (b[A] = u.mapValues(w, (O) => O + E));
        });
      });
    }
    function m(b, _) {
      return u.mapValues(b.ul, (x, N) => {
        if (_)
          return b[_.toLowerCase()][N];
        {
          let I = Object.values(b).map((R) => R[N]).sort((R, T) => R - T);
          return (I[1] + I[2]) / 2;
        }
      });
    }
    function g(b) {
      let _ = u.buildLayerMatrix(b), x = Object.assign(f(b, _), p(b, _)), N = {}, I;
      ["u", "d"].forEach((T) => {
        I = T === "u" ? _ : Object.values(_).reverse(), ["l", "r"].forEach((A) => {
          A === "r" && (I = I.map((O) => Object.values(O).reverse()));
          let w = (T === "u" ? b.predecessors : b.successors).bind(b), v = d(b, I, x, w), E = l(b, I, v.root, v.align, A === "r");
          A === "r" && (E = u.mapValues(E, (O) => -O)), N[T + A] = E;
        });
      });
      let R = a(b, N);
      return s(N, R), m(N, b.graph().align);
    }
    function y(b, _, x) {
      return (N, I, R) => {
        let T = N.node(I), A = N.node(R), w = 0, v;
        if (w += T.width / 2, Object.hasOwn(T, "labelpos"))
          switch (T.labelpos.toLowerCase()) {
            case "l":
              v = -T.width / 2;
              break;
            case "r":
              v = T.width / 2;
              break;
          }
        if (v && (w += x ? v : -v), v = 0, w += (T.dummy ? _ : b) / 2, w += (A.dummy ? _ : b) / 2, w += A.width / 2, Object.hasOwn(A, "labelpos"))
          switch (A.labelpos.toLowerCase()) {
            case "l":
              v = A.width / 2;
              break;
            case "r":
              v = -A.width / 2;
              break;
          }
        return v && (w += x ? v : -v), v = 0, w;
      };
    }
    function L(b, _) {
      return b.node(_).width;
    }
  }, { "../util": 27, "@dagrejs/graphlib": 29 }], 22: [function(e, r, i) {
    let c = e("../util"), u = e("./bk").positionX;
    r.exports = f;
    function f(n) {
      n = c.asNonCompoundGraph(n), p(n), Object.entries(u(n)).forEach(([o, t]) => n.node(o).x = t);
    }
    function p(n) {
      let o = c.buildLayerMatrix(n), t = n.graph().ranksep, d = 0;
      o.forEach((l) => {
        const h = l.reduce((a, s) => {
          const m = n.node(s).height;
          return a > m ? a : m;
        }, 0);
        l.forEach((a) => n.node(a).y = d + h / 2), d += h + t;
      });
    }
  }, { "../util": 27, "./bk": 21 }], 23: [function(e, r, i) {
    var c = e("@dagrejs/graphlib").Graph, u = e("./util").slack;
    r.exports = f;
    function f(t) {
      var d = new c({ directed: !1 }), l = t.nodes()[0], h = t.nodeCount();
      d.setNode(l, {});
      for (var a, s; p(d, t) < h; )
        a = n(d, t), s = d.hasNode(a.v) ? u(t, a) : -u(t, a), o(d, t, s);
      return d;
    }
    function p(t, d) {
      function l(h) {
        d.nodeEdges(h).forEach((a) => {
          var s = a.v, m = h === s ? a.w : s;
          !t.hasNode(m) && !u(d, a) && (t.setNode(m, {}), t.setEdge(h, m, {}), l(m));
        });
      }
      return t.nodes().forEach(l), t.nodeCount();
    }
    function n(t, d) {
      return d.edges().reduce((h, a) => {
        let s = Number.POSITIVE_INFINITY;
        return t.hasNode(a.v) !== t.hasNode(a.w) && (s = u(d, a)), s < h[0] ? [s, a] : h;
      }, [Number.POSITIVE_INFINITY, null])[1];
    }
    function o(t, d, l) {
      t.nodes().forEach((h) => d.node(h).rank += l);
    }
  }, { "./util": 26, "@dagrejs/graphlib": 29 }], 24: [function(e, r, i) {
    var c = e("./util"), u = c.longestPath, f = e("./feasible-tree"), p = e("./network-simplex");
    r.exports = n;
    function n(l) {
      var h = l.graph().ranker;
      if (h instanceof Function)
        return h(l);
      switch (l.graph().ranker) {
        case "network-simplex":
          d(l);
          break;
        case "tight-tree":
          t(l);
          break;
        case "longest-path":
          o(l);
          break;
        case "none":
          break;
        default:
          d(l);
      }
    }
    var o = u;
    function t(l) {
      u(l), f(l);
    }
    function d(l) {
      p(l);
    }
  }, { "./feasible-tree": 23, "./network-simplex": 25, "./util": 26 }], 25: [function(e, r, i) {
    var c = e("./feasible-tree"), u = e("./util").slack, f = e("./util").longestPath, p = e("@dagrejs/graphlib").alg.preorder, n = e("@dagrejs/graphlib").alg.postorder, o = e("../util").simplify;
    r.exports = t, t.initLowLimValues = a, t.initCutValues = d, t.calcCutValue = h, t.leaveEdge = m, t.enterEdge = g, t.exchangeEdges = y;
    function t(x) {
      x = o(x), f(x);
      var N = c(x);
      a(N), d(N, x);
      for (var I, R; I = m(N); )
        R = g(N, x, I), y(N, x, I, R);
    }
    function d(x, N) {
      var I = n(x, x.nodes());
      I = I.slice(0, I.length - 1), I.forEach((R) => l(x, N, R));
    }
    function l(x, N, I) {
      var R = x.node(I), T = R.parent;
      x.edge(I, T).cutvalue = h(x, N, I);
    }
    function h(x, N, I) {
      var R = x.node(I), T = R.parent, A = !0, w = N.edge(I, T), v = 0;
      return w || (A = !1, w = N.edge(T, I)), v = w.weight, N.nodeEdges(I).forEach((E) => {
        var O = E.v === I, S = O ? E.w : E.v;
        if (S !== T) {
          var M = O === A, z = N.edge(E).weight;
          if (v += M ? z : -z, b(x, I, S)) {
            var $ = x.edge(I, S).cutvalue;
            v += M ? -$ : $;
          }
        }
      }), v;
    }
    function a(x, N) {
      arguments.length < 2 && (N = x.nodes()[0]), s(x, {}, 1, N);
    }
    function s(x, N, I, R, T) {
      var A = I, w = x.node(R);
      return N[R] = !0, x.neighbors(R).forEach((v) => {
        Object.hasOwn(N, v) || (I = s(x, N, I, v, R));
      }), w.low = A, w.lim = I++, T ? w.parent = T : delete w.parent, I;
    }
    function m(x) {
      return x.edges().find((N) => x.edge(N).cutvalue < 0);
    }
    function g(x, N, I) {
      var R = I.v, T = I.w;
      N.hasEdge(R, T) || (R = I.w, T = I.v);
      var A = x.node(R), w = x.node(T), v = A, E = !1;
      A.lim > w.lim && (v = w, E = !0);
      var O = N.edges().filter((S) => E === _(x, x.node(S.v), v) && E !== _(x, x.node(S.w), v));
      return O.reduce((S, M) => u(N, M) < u(N, S) ? M : S);
    }
    function y(x, N, I, R) {
      var T = I.v, A = I.w;
      x.removeEdge(T, A), x.setEdge(R.v, R.w, {}), a(x), d(x, N), L(x, N);
    }
    function L(x, N) {
      var I = x.nodes().find((T) => !N.node(T).parent), R = p(x, I);
      R = R.slice(1), R.forEach((T) => {
        var A = x.node(T).parent, w = N.edge(T, A), v = !1;
        w || (w = N.edge(A, T), v = !0), N.node(T).rank = N.node(A).rank + (v ? w.minlen : -w.minlen);
      });
    }
    function b(x, N, I) {
      return x.hasEdge(N, I);
    }
    function _(x, N, I) {
      return I.low <= N.lim && N.lim <= I.lim;
    }
  }, { "../util": 27, "./feasible-tree": 23, "./util": 26, "@dagrejs/graphlib": 29 }], 26: [function(e, r, i) {
    const { applyWithChunking: c } = e("../util");
    r.exports = { longestPath: u, slack: f };
    function u(p) {
      var n = {};
      function o(t) {
        var d = p.node(t);
        if (Object.hasOwn(n, t))
          return d.rank;
        n[t] = !0;
        let l = p.outEdges(t).map((a) => a == null ? Number.POSITIVE_INFINITY : o(a.w) - p.edge(a).minlen);
        var h = c(Math.min, l);
        return h === Number.POSITIVE_INFINITY && (h = 0), d.rank = h;
      }
      p.sources().forEach(o);
    }
    function f(p, n) {
      return p.node(n.w).rank - p.node(n.v).rank - p.edge(n).minlen;
    }
  }, { "../util": 27 }], 27: [function(e, r, i) {
    let c = e("@dagrejs/graphlib").Graph;
    r.exports = { addBorderNode: a, addDummyNode: u, applyWithChunking: g, asNonCompoundGraph: p, buildLayerMatrix: d, intersectRect: t, mapValues: T, maxRank: y, normalizeRanks: l, notime: _, partition: L, pick: R, predecessorWeights: o, range: I, removeEmptyRanks: h, simplify: f, successorWeights: n, time: b, uniqueId: N, zipObject: A };
    function u(w, v, E, O) {
      for (var S = O; w.hasNode(S); )
        S = N(O);
      return E.dummy = v, w.setNode(S, E), S;
    }
    function f(w) {
      let v = new c().setGraph(w.graph());
      return w.nodes().forEach((E) => v.setNode(E, w.node(E))), w.edges().forEach((E) => {
        let O = v.edge(E.v, E.w) || { weight: 0, minlen: 1 }, S = w.edge(E);
        v.setEdge(E.v, E.w, { weight: O.weight + S.weight, minlen: Math.max(O.minlen, S.minlen) });
      }), v;
    }
    function p(w) {
      let v = new c({ multigraph: w.isMultigraph() }).setGraph(w.graph());
      return w.nodes().forEach((E) => {
        w.children(E).length || v.setNode(E, w.node(E));
      }), w.edges().forEach((E) => {
        v.setEdge(E, w.edge(E));
      }), v;
    }
    function n(w) {
      let v = w.nodes().map((E) => {
        let O = {};
        return w.outEdges(E).forEach((S) => {
          O[S.w] = (O[S.w] || 0) + w.edge(S).weight;
        }), O;
      });
      return A(w.nodes(), v);
    }
    function o(w) {
      let v = w.nodes().map((E) => {
        let O = {};
        return w.inEdges(E).forEach((S) => {
          O[S.v] = (O[S.v] || 0) + w.edge(S).weight;
        }), O;
      });
      return A(w.nodes(), v);
    }
    function t(w, v) {
      let E = w.x, O = w.y, S = v.x - E, M = v.y - O, z = w.width / 2, $ = w.height / 2;
      if (!S && !M)
        throw new Error("Not possible to find intersection inside of the rectangle");
      let H, Y;
      return Math.abs(M) * z > Math.abs(S) * $ ? (M < 0 && ($ = -$), H = $ * S / M, Y = $) : (S < 0 && (z = -z), H = z, Y = z * M / S), { x: E + H, y: O + Y };
    }
    function d(w) {
      let v = I(y(w) + 1).map(() => []);
      return w.nodes().forEach((E) => {
        let O = w.node(E), S = O.rank;
        S !== void 0 && (v[S][O.order] = E);
      }), v;
    }
    function l(w) {
      let v = w.nodes().map((O) => {
        let S = w.node(O).rank;
        return S === void 0 ? Number.MAX_VALUE : S;
      }), E = g(Math.min, v);
      w.nodes().forEach((O) => {
        let S = w.node(O);
        Object.hasOwn(S, "rank") && (S.rank -= E);
      });
    }
    function h(w) {
      let v = w.nodes().map((z) => w.node(z).rank), E = g(Math.min, v), O = [];
      w.nodes().forEach((z) => {
        let $ = w.node(z).rank - E;
        O[$] || (O[$] = []), O[$].push(z);
      });
      let S = 0, M = w.graph().nodeRankFactor;
      Array.from(O).forEach((z, $) => {
        z === void 0 && $ % M !== 0 ? --S : z !== void 0 && S && z.forEach((H) => w.node(H).rank += S);
      });
    }
    function a(w, v, E, O) {
      let S = { width: 0, height: 0 };
      return arguments.length >= 4 && (S.rank = E, S.order = O), u(w, "border", S, v);
    }
    function s(w, v = m) {
      const E = [];
      for (let O = 0; O < w.length; O += v) {
        const S = w.slice(O, O + v);
        E.push(S);
      }
      return E;
    }
    const m = 65535;
    function g(w, v) {
      if (v.length > m) {
        const E = s(v);
        return w.apply(null, E.map((O) => w.apply(null, O)));
      } else
        return w.apply(null, v);
    }
    function y(w) {
      const E = w.nodes().map((O) => {
        let S = w.node(O).rank;
        return S === void 0 ? Number.MIN_VALUE : S;
      });
      return g(Math.max, E);
    }
    function L(w, v) {
      let E = { lhs: [], rhs: [] };
      return w.forEach((O) => {
        v(O) ? E.lhs.push(O) : E.rhs.push(O);
      }), E;
    }
    function b(w, v) {
      let E = Date.now();
      try {
        return v();
      } finally {
        console.log(w + " time: " + (Date.now() - E) + "ms");
      }
    }
    function _(w, v) {
      return v();
    }
    let x = 0;
    function N(w) {
      var v = ++x;
      return w + ("" + v);
    }
    function I(w, v, E = 1) {
      v == null && (v = w, w = 0);
      let O = (M) => M < v;
      E < 0 && (O = (M) => v < M);
      const S = [];
      for (let M = w; O(M); M += E)
        S.push(M);
      return S;
    }
    function R(w, v) {
      const E = {};
      for (const O of v)
        w[O] !== void 0 && (E[O] = w[O]);
      return E;
    }
    function T(w, v) {
      let E = v;
      return typeof v == "string" && (E = (O) => O[v]), Object.entries(w).reduce((O, [S, M]) => (O[S] = E(M, S), O), {});
    }
    function A(w, v) {
      return w.reduce((E, O, S) => (E[O] = v[S], E), {});
    }
  }, { "@dagrejs/graphlib": 29 }], 28: [function(e, r, i) {
    r.exports = "1.1.8";
  }, {}], 29: [function(e, r, i) {
    var c = e("./lib");
    r.exports = { Graph: c.Graph, json: e("./lib/json"), alg: e("./lib/alg"), version: c.version };
  }, { "./lib": 45, "./lib/alg": 36, "./lib/json": 46 }], 30: [function(e, r, i) {
    r.exports = c;
    function c(u) {
      var f = {}, p = [], n;
      function o(t) {
        Object.hasOwn(f, t) || (f[t] = !0, n.push(t), u.successors(t).forEach(o), u.predecessors(t).forEach(o));
      }
      return u.nodes().forEach(function(t) {
        n = [], o(t), n.length && p.push(n);
      }), p;
    }
  }, {}], 31: [function(e, r, i) {
    r.exports = c;
    function c(n, o, t) {
      Array.isArray(o) || (o = [o]);
      var d = n.isDirected() ? (s) => n.successors(s) : (s) => n.neighbors(s), l = t === "post" ? u : f, h = [], a = {};
      return o.forEach((s) => {
        if (!n.hasNode(s))
          throw new Error("Graph does not have node: " + s);
        l(s, d, a, h);
      }), h;
    }
    function u(n, o, t, d) {
      for (var l = [[n, !1]]; l.length > 0; ) {
        var h = l.pop();
        h[1] ? d.push(h[0]) : Object.hasOwn(t, h[0]) || (t[h[0]] = !0, l.push([h[0], !0]), p(o(h[0]), (a) => l.push([a, !1])));
      }
    }
    function f(n, o, t, d) {
      for (var l = [n]; l.length > 0; ) {
        var h = l.pop();
        Object.hasOwn(t, h) || (t[h] = !0, d.push(h), p(o(h), (a) => l.push(a)));
      }
    }
    function p(n, o) {
      for (var t = n.length; t--; )
        o(n[t], t, n);
      return n;
    }
  }, {}], 32: [function(e, r, i) {
    var c = e("./dijkstra");
    r.exports = u;
    function u(f, p, n) {
      return f.nodes().reduce(function(o, t) {
        return o[t] = c(f, t, p, n), o;
      }, {});
    }
  }, { "./dijkstra": 33 }], 33: [function(e, r, i) {
    var c = e("../data/priority-queue");
    r.exports = f;
    var u = () => 1;
    function f(n, o, t, d) {
      return p(n, String(o), t || u, d || function(l) {
        return n.outEdges(l);
      });
    }
    function p(n, o, t, d) {
      var l = {}, h = new c(), a, s, m = function(g) {
        var y = g.v !== a ? g.v : g.w, L = l[y], b = t(g), _ = s.distance + b;
        if (b < 0)
          throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + g + " Weight: " + b);
        _ < L.distance && (L.distance = _, L.predecessor = a, h.decrease(y, _));
      };
      for (n.nodes().forEach(function(g) {
        var y = g === o ? 0 : Number.POSITIVE_INFINITY;
        l[g] = { distance: y }, h.add(g, y);
      }); h.size() > 0 && (a = h.removeMin(), s = l[a], s.distance !== Number.POSITIVE_INFINITY); )
        d(a).forEach(m);
      return l;
    }
  }, { "../data/priority-queue": 43 }], 34: [function(e, r, i) {
    var c = e("./tarjan");
    r.exports = u;
    function u(f) {
      return c(f).filter(function(p) {
        return p.length > 1 || p.length === 1 && f.hasEdge(p[0], p[0]);
      });
    }
  }, { "./tarjan": 41 }], 35: [function(e, r, i) {
    r.exports = u;
    var c = () => 1;
    function u(p, n, o) {
      return f(p, n || c, o || function(t) {
        return p.outEdges(t);
      });
    }
    function f(p, n, o) {
      var t = {}, d = p.nodes();
      return d.forEach(function(l) {
        t[l] = {}, t[l][l] = { distance: 0 }, d.forEach(function(h) {
          l !== h && (t[l][h] = { distance: Number.POSITIVE_INFINITY });
        }), o(l).forEach(function(h) {
          var a = h.v === l ? h.w : h.v, s = n(h);
          t[l][a] = { distance: s, predecessor: l };
        });
      }), d.forEach(function(l) {
        var h = t[l];
        d.forEach(function(a) {
          var s = t[a];
          d.forEach(function(m) {
            var g = s[l], y = h[m], L = s[m], b = g.distance + y.distance;
            b < L.distance && (L.distance = b, L.predecessor = y.predecessor);
          });
        });
      }), t;
    }
  }, {}], 36: [function(e, r, i) {
    r.exports = { components: e("./components"), dijkstra: e("./dijkstra"), dijkstraAll: e("./dijkstra-all"), findCycles: e("./find-cycles"), floydWarshall: e("./floyd-warshall"), isAcyclic: e("./is-acyclic"), postorder: e("./postorder"), preorder: e("./preorder"), prim: e("./prim"), tarjan: e("./tarjan"), topsort: e("./topsort") };
  }, { "./components": 30, "./dijkstra": 33, "./dijkstra-all": 32, "./find-cycles": 34, "./floyd-warshall": 35, "./is-acyclic": 37, "./postorder": 38, "./preorder": 39, "./prim": 40, "./tarjan": 41, "./topsort": 42 }], 37: [function(e, r, i) {
    var c = e("./topsort");
    r.exports = u;
    function u(f) {
      try {
        c(f);
      } catch (p) {
        if (p instanceof c.CycleException)
          return !1;
        throw p;
      }
      return !0;
    }
  }, { "./topsort": 42 }], 38: [function(e, r, i) {
    var c = e("./dfs");
    r.exports = u;
    function u(f, p) {
      return c(f, p, "post");
    }
  }, { "./dfs": 31 }], 39: [function(e, r, i) {
    var c = e("./dfs");
    r.exports = u;
    function u(f, p) {
      return c(f, p, "pre");
    }
  }, { "./dfs": 31 }], 40: [function(e, r, i) {
    var c = e("../graph"), u = e("../data/priority-queue");
    r.exports = f;
    function f(p, n) {
      var o = new c(), t = {}, d = new u(), l;
      function h(s) {
        var m = s.v === l ? s.w : s.v, g = d.priority(m);
        if (g !== void 0) {
          var y = n(s);
          y < g && (t[m] = l, d.decrease(m, y));
        }
      }
      if (p.nodeCount() === 0)
        return o;
      p.nodes().forEach(function(s) {
        d.add(s, Number.POSITIVE_INFINITY), o.setNode(s);
      }), d.decrease(p.nodes()[0], 0);
      for (var a = !1; d.size() > 0; ) {
        if (l = d.removeMin(), Object.hasOwn(t, l))
          o.setEdge(l, t[l]);
        else {
          if (a)
            throw new Error("Input graph is not connected: " + p);
          a = !0;
        }
        p.nodeEdges(l).forEach(h);
      }
      return o;
    }
  }, { "../data/priority-queue": 43, "../graph": 44 }], 41: [function(e, r, i) {
    r.exports = c;
    function c(u) {
      var f = 0, p = [], n = {}, o = [];
      function t(d) {
        var l = n[d] = { onStack: !0, lowlink: f, index: f++ };
        if (p.push(d), u.successors(d).forEach(function(s) {
          Object.hasOwn(n, s) ? n[s].onStack && (l.lowlink = Math.min(l.lowlink, n[s].index)) : (t(s), l.lowlink = Math.min(l.lowlink, n[s].lowlink));
        }), l.lowlink === l.index) {
          var h = [], a;
          do
            a = p.pop(), n[a].onStack = !1, h.push(a);
          while (d !== a);
          o.push(h);
        }
      }
      return u.nodes().forEach(function(d) {
        Object.hasOwn(n, d) || t(d);
      }), o;
    }
  }, {}], 42: [function(e, r, i) {
    function c(f) {
      var p = {}, n = {}, o = [];
      function t(d) {
        if (Object.hasOwn(n, d))
          throw new u();
        Object.hasOwn(p, d) || (n[d] = !0, p[d] = !0, f.predecessors(d).forEach(t), delete n[d], o.push(d));
      }
      if (f.sinks().forEach(t), Object.keys(p).length !== f.nodeCount())
        throw new u();
      return o;
    }
    class u extends Error {
      constructor() {
        super(...arguments);
      }
    }
    r.exports = c, c.CycleException = u;
  }, {}], 43: [function(e, r, i) {
    class c {
      _arr = [];
      _keyIndices = {};
      /**
         * Returns the number of elements in the queue. Takes `O(1)` time.
         */
      size() {
        return this._arr.length;
      }
      /**
         * Returns the keys that are in the queue. Takes `O(n)` time.
         */
      keys() {
        return this._arr.map(function(f) {
          return f.key;
        });
      }
      /**
         * Returns `true` if **key** is in the queue and `false` if not.
         */
      has(f) {
        return Object.hasOwn(this._keyIndices, f);
      }
      /**
         * Returns the priority for **key**. If **key** is not present in the queue
         * then this function returns `undefined`. Takes `O(1)` time.
         *
         * @param {Object} key
         */
      priority(f) {
        var p = this._keyIndices[f];
        if (p !== void 0)
          return this._arr[p].priority;
      }
      /**
         * Returns the key for the minimum element in this queue. If the queue is
         * empty this function throws an Error. Takes `O(1)` time.
         */
      min() {
        if (this.size() === 0)
          throw new Error("Queue underflow");
        return this._arr[0].key;
      }
      /**
         * Inserts a new key into the priority queue. If the key already exists in
         * the queue this function returns `false`; otherwise it will return `true`.
         * Takes `O(n)` time.
         *
         * @param {Object} key the key to add
         * @param {Number} priority the initial priority for the key
         */
      add(f, p) {
        var n = this._keyIndices;
        if (f = String(f), !Object.hasOwn(n, f)) {
          var o = this._arr, t = o.length;
          return n[f] = t, o.push({ key: f, priority: p }), this._decrease(t), !0;
        }
        return !1;
      }
      /**
         * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
         */
      removeMin() {
        this._swap(0, this._arr.length - 1);
        var f = this._arr.pop();
        return delete this._keyIndices[f.key], this._heapify(0), f.key;
      }
      /**
         * Decreases the priority for **key** to **priority**. If the new priority is
         * greater than the previous priority, this function will throw an Error.
         *
         * @param {Object} key the key for which to raise priority
         * @param {Number} priority the new priority for the key
         */
      decrease(f, p) {
        var n = this._keyIndices[f];
        if (p > this._arr[n].priority)
          throw new Error("New priority is greater than current priority. Key: " + f + " Old: " + this._arr[n].priority + " New: " + p);
        this._arr[n].priority = p, this._decrease(n);
      }
      _heapify(f) {
        var p = this._arr, n = 2 * f, o = n + 1, t = f;
        n < p.length && (t = p[n].priority < p[t].priority ? n : t, o < p.length && (t = p[o].priority < p[t].priority ? o : t), t !== f && (this._swap(f, t), this._heapify(t)));
      }
      _decrease(f) {
        for (var p = this._arr, n = p[f].priority, o; f !== 0 && (o = f >> 1, !(p[o].priority < n)); )
          this._swap(f, o), f = o;
      }
      _swap(f, p) {
        var n = this._arr, o = this._keyIndices, t = n[f], d = n[p];
        n[f] = d, n[p] = t, o[d.key] = f, o[t.key] = p;
      }
    }
    r.exports = c;
  }, {}], 44: [function(e, r, i) {
    var c = "\0", u = "\0", f = "";
    class p {
      _isDirected = !0;
      _isMultigraph = !1;
      _isCompound = !1;
      // Label for the graph itself
      _label;
      // Defaults to be set when creating a new node
      _defaultNodeLabelFn = () => {
      };
      // Defaults to be set when creating a new edge
      _defaultEdgeLabelFn = () => {
      };
      // v -> label
      _nodes = {};
      // v -> edgeObj
      _in = {};
      // u -> v -> Number
      _preds = {};
      // v -> edgeObj
      _out = {};
      // v -> w -> Number
      _sucs = {};
      // e -> edgeObj
      _edgeObjs = {};
      // e -> label
      _edgeLabels = {};
      /* Number of nodes in the graph. Should only be changed by the implementation. */
      _nodeCount = 0;
      /* Number of edges in the graph. Should only be changed by the implementation. */
      _edgeCount = 0;
      _parent;
      _children;
      constructor(a) {
        a && (this._isDirected = Object.hasOwn(a, "directed") ? a.directed : !0, this._isMultigraph = Object.hasOwn(a, "multigraph") ? a.multigraph : !1, this._isCompound = Object.hasOwn(a, "compound") ? a.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[u] = {});
      }
      /* === Graph functions ========= */
      /**
         * Whether graph was created with 'directed' flag set to true or not.
         */
      isDirected() {
        return this._isDirected;
      }
      /**
         * Whether graph was created with 'multigraph' flag set to true or not.
         */
      isMultigraph() {
        return this._isMultigraph;
      }
      /**
         * Whether graph was created with 'compound' flag set to true or not.
         */
      isCompound() {
        return this._isCompound;
      }
      /**
         * Sets the label of the graph.
         */
      setGraph(a) {
        return this._label = a, this;
      }
      /**
         * Gets the graph label.
         */
      graph() {
        return this._label;
      }
      /* === Node functions ========== */
      /**
         * Sets the default node label. If newDefault is a function, it will be
         * invoked ach time when setting a label for a node. Otherwise, this label
         * will be assigned as default label in case if no label was specified while
         * setting a node.
         * Complexity: O(1).
         */
      setDefaultNodeLabel(a) {
        return this._defaultNodeLabelFn = a, typeof a != "function" && (this._defaultNodeLabelFn = () => a), this;
      }
      /**
         * Gets the number of nodes in the graph.
         * Complexity: O(1).
         */
      nodeCount() {
        return this._nodeCount;
      }
      /**
         * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
         * not included in list.
         * Complexity: O(1).
         */
      nodes() {
        return Object.keys(this._nodes);
      }
      /**
         * Gets list of nodes without in-edges.
         * Complexity: O(|V|).
         */
      sources() {
        var a = this;
        return this.nodes().filter((s) => Object.keys(a._in[s]).length === 0);
      }
      /**
         * Gets list of nodes without out-edges.
         * Complexity: O(|V|).
         */
      sinks() {
        var a = this;
        return this.nodes().filter((s) => Object.keys(a._out[s]).length === 0);
      }
      /**
         * Invokes setNode method for each node in names list.
         * Complexity: O(|names|).
         */
      setNodes(a, s) {
        var m = arguments, g = this;
        return a.forEach(function(y) {
          m.length > 1 ? g.setNode(y, s) : g.setNode(y);
        }), this;
      }
      /**
         * Creates or updates the value for the node v in the graph. If label is supplied
         * it is set as the value for the node. If label is not supplied and the node was
         * created by this call then the default node label will be assigned.
         * Complexity: O(1).
         */
      setNode(a, s) {
        return Object.hasOwn(this._nodes, a) ? (arguments.length > 1 && (this._nodes[a] = s), this) : (this._nodes[a] = arguments.length > 1 ? s : this._defaultNodeLabelFn(a), this._isCompound && (this._parent[a] = u, this._children[a] = {}, this._children[u][a] = !0), this._in[a] = {}, this._preds[a] = {}, this._out[a] = {}, this._sucs[a] = {}, ++this._nodeCount, this);
      }
      /**
         * Gets the label of node with specified name.
         * Complexity: O(|V|).
         */
      node(a) {
        return this._nodes[a];
      }
      /**
         * Detects whether graph has a node with specified name or not.
         */
      hasNode(a) {
        return Object.hasOwn(this._nodes, a);
      }
      /**
         * Remove the node with the name from the graph or do nothing if the node is not in
         * the graph. If the node was removed this function also removes any incident
         * edges.
         * Complexity: O(1).
         */
      removeNode(a) {
        var s = this;
        if (Object.hasOwn(this._nodes, a)) {
          var m = (g) => s.removeEdge(s._edgeObjs[g]);
          delete this._nodes[a], this._isCompound && (this._removeFromParentsChildList(a), delete this._parent[a], this.children(a).forEach(function(g) {
            s.setParent(g);
          }), delete this._children[a]), Object.keys(this._in[a]).forEach(m), delete this._in[a], delete this._preds[a], Object.keys(this._out[a]).forEach(m), delete this._out[a], delete this._sucs[a], --this._nodeCount;
        }
        return this;
      }
      /**
         * Sets node p as a parent for node v if it is defined, or removes the
         * parent for v if p is undefined. Method throws an exception in case of
         * invoking it in context of noncompound graph.
         * Average-case complexity: O(1).
         */
      setParent(a, s) {
        if (!this._isCompound)
          throw new Error("Cannot set parent in a non-compound graph");
        if (s === void 0)
          s = u;
        else {
          s += "";
          for (var m = s; m !== void 0; m = this.parent(m))
            if (m === a)
              throw new Error("Setting " + s + " as parent of " + a + " would create a cycle");
          this.setNode(s);
        }
        return this.setNode(a), this._removeFromParentsChildList(a), this._parent[a] = s, this._children[s][a] = !0, this;
      }
      _removeFromParentsChildList(a) {
        delete this._children[this._parent[a]][a];
      }
      /**
         * Gets parent node for node v.
         * Complexity: O(1).
         */
      parent(a) {
        if (this._isCompound) {
          var s = this._parent[a];
          if (s !== u)
            return s;
        }
      }
      /**
         * Gets list of direct children of node v.
         * Complexity: O(1).
         */
      children(a = u) {
        if (this._isCompound) {
          var s = this._children[a];
          if (s)
            return Object.keys(s);
        } else {
          if (a === u)
            return this.nodes();
          if (this.hasNode(a))
            return [];
        }
      }
      /**
         * Return all nodes that are predecessors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      predecessors(a) {
        var s = this._preds[a];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are successors of the specified node or undefined if node v is not in
         * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
         * Complexity: O(|V|).
         */
      successors(a) {
        var s = this._sucs[a];
        if (s)
          return Object.keys(s);
      }
      /**
         * Return all nodes that are predecessors or successors of the specified node or undefined if
         * node v is not in the graph.
         * Complexity: O(|V|).
         */
      neighbors(a) {
        var s = this.predecessors(a);
        if (s) {
          const g = new Set(s);
          for (var m of this.successors(a))
            g.add(m);
          return Array.from(g.values());
        }
      }
      isLeaf(a) {
        var s;
        return this.isDirected() ? s = this.successors(a) : s = this.neighbors(a), s.length === 0;
      }
      /**
         * Creates new graph with nodes filtered via filter. Edges incident to rejected node
         * are also removed. In case of compound graph, if parent is rejected by filter,
         * than all its children are rejected too.
         * Average-case complexity: O(|E|+|V|).
         */
      filterNodes(a) {
        var s = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
        s.setGraph(this.graph());
        var m = this;
        Object.entries(this._nodes).forEach(function([L, b]) {
          a(L) && s.setNode(L, b);
        }), Object.values(this._edgeObjs).forEach(function(L) {
          s.hasNode(L.v) && s.hasNode(L.w) && s.setEdge(L, m.edge(L));
        });
        var g = {};
        function y(L) {
          var b = m.parent(L);
          return b === void 0 || s.hasNode(b) ? (g[L] = b, b) : b in g ? g[b] : y(b);
        }
        return this._isCompound && s.nodes().forEach((L) => s.setParent(L, y(L))), s;
      }
      /* === Edge functions ========== */
      /**
         * Sets the default edge label or factory function. This label will be
         * assigned as default label in case if no label was specified while setting
         * an edge or this function will be invoked each time when setting an edge
         * with no label specified and returned value * will be used as a label for edge.
         * Complexity: O(1).
         */
      setDefaultEdgeLabel(a) {
        return this._defaultEdgeLabelFn = a, typeof a != "function" && (this._defaultEdgeLabelFn = () => a), this;
      }
      /**
         * Gets the number of edges in the graph.
         * Complexity: O(1).
         */
      edgeCount() {
        return this._edgeCount;
      }
      /**
         * Gets edges of the graph. In case of compound graph subgraphs are not considered.
         * Complexity: O(|E|).
         */
      edges() {
        return Object.values(this._edgeObjs);
      }
      /**
         * Establish an edges path over the nodes in nodes list. If some edge is already
         * exists, it will update its label, otherwise it will create an edge between pair
         * of nodes with label provided or default label if no label provided.
         * Complexity: O(|nodes|).
         */
      setPath(a, s) {
        var m = this, g = arguments;
        return a.reduce(function(y, L) {
          return g.length > 1 ? m.setEdge(y, L, s) : m.setEdge(y, L), L;
        }), this;
      }
      /**
         * Creates or updates the label for the edge (v, w) with the optionally supplied
         * name. If label is supplied it is set as the value for the edge. If label is not
         * supplied and the edge was created by this call then the default edge label will
         * be assigned. The name parameter is only useful with multigraphs.
         */
      setEdge() {
        var a, s, m, g, y = !1, L = arguments[0];
        typeof L == "object" && L !== null && "v" in L ? (a = L.v, s = L.w, m = L.name, arguments.length === 2 && (g = arguments[1], y = !0)) : (a = L, s = arguments[1], m = arguments[3], arguments.length > 2 && (g = arguments[2], y = !0)), a = "" + a, s = "" + s, m !== void 0 && (m = "" + m);
        var b = t(this._isDirected, a, s, m);
        if (Object.hasOwn(this._edgeLabels, b))
          return y && (this._edgeLabels[b] = g), this;
        if (m !== void 0 && !this._isMultigraph)
          throw new Error("Cannot set a named edge when isMultigraph = false");
        this.setNode(a), this.setNode(s), this._edgeLabels[b] = y ? g : this._defaultEdgeLabelFn(a, s, m);
        var _ = d(this._isDirected, a, s, m);
        return a = _.v, s = _.w, Object.freeze(_), this._edgeObjs[b] = _, n(this._preds[s], a), n(this._sucs[a], s), this._in[s][b] = _, this._out[a][b] = _, this._edgeCount++, this;
      }
      /**
         * Gets the label for the specified edge.
         * Complexity: O(1).
         */
      edge(a, s, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, a, s, m);
        return this._edgeLabels[g];
      }
      /**
         * Gets the label for the specified edge and converts it to an object.
         * Complexity: O(1)
         */
      edgeAsObj() {
        const a = this.edge(...arguments);
        return typeof a != "object" ? { label: a } : a;
      }
      /**
         * Detects whether the graph contains specified edge or not. No subgraphs are considered.
         * Complexity: O(1).
         */
      hasEdge(a, s, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, a, s, m);
        return Object.hasOwn(this._edgeLabels, g);
      }
      /**
         * Removes the specified edge from the graph. No subgraphs are considered.
         * Complexity: O(1).
         */
      removeEdge(a, s, m) {
        var g = arguments.length === 1 ? l(this._isDirected, arguments[0]) : t(this._isDirected, a, s, m), y = this._edgeObjs[g];
        return y && (a = y.v, s = y.w, delete this._edgeLabels[g], delete this._edgeObjs[g], o(this._preds[s], a), o(this._sucs[a], s), delete this._in[s][g], delete this._out[a][g], this._edgeCount--), this;
      }
      /**
         * Return all edges that point to the node v. Optionally filters those edges down to just those
         * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      inEdges(a, s) {
        var m = this._in[a];
        if (m) {
          var g = Object.values(m);
          return s ? g.filter((y) => y.v === s) : g;
        }
      }
      /**
         * Return all edges that are pointed at by node v. Optionally filters those edges down to just
         * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
         * Complexity: O(|E|).
         */
      outEdges(a, s) {
        var m = this._out[a];
        if (m) {
          var g = Object.values(m);
          return s ? g.filter((y) => y.w === s) : g;
        }
      }
      /**
         * Returns all edges to or from node v regardless of direction. Optionally filters those edges
         * down to just those between nodes v and w regardless of direction.
         * Complexity: O(|E|).
         */
      nodeEdges(a, s) {
        var m = this.inEdges(a, s);
        if (m)
          return m.concat(this.outEdges(a, s));
      }
    }
    function n(h, a) {
      h[a] ? h[a]++ : h[a] = 1;
    }
    function o(h, a) {
      --h[a] || delete h[a];
    }
    function t(h, a, s, m) {
      var g = "" + a, y = "" + s;
      if (!h && g > y) {
        var L = g;
        g = y, y = L;
      }
      return g + f + y + f + (m === void 0 ? c : m);
    }
    function d(h, a, s, m) {
      var g = "" + a, y = "" + s;
      if (!h && g > y) {
        var L = g;
        g = y, y = L;
      }
      var b = { v: g, w: y };
      return m && (b.name = m), b;
    }
    function l(h, a) {
      return t(h, a.v, a.w, a.name);
    }
    r.exports = p;
  }, {}], 45: [function(e, r, i) {
    r.exports = { Graph: e("./graph"), version: e("./version") };
  }, { "./graph": 44, "./version": 47 }], 46: [function(e, r, i) {
    var c = e("./graph");
    r.exports = { write: u, read: n };
    function u(o) {
      var t = { options: { directed: o.isDirected(), multigraph: o.isMultigraph(), compound: o.isCompound() }, nodes: f(o), edges: p(o) };
      return o.graph() !== void 0 && (t.value = structuredClone(o.graph())), t;
    }
    function f(o) {
      return o.nodes().map(function(t) {
        var d = o.node(t), l = o.parent(t), h = { v: t };
        return d !== void 0 && (h.value = d), l !== void 0 && (h.parent = l), h;
      });
    }
    function p(o) {
      return o.edges().map(function(t) {
        var d = o.edge(t), l = { v: t.v, w: t.w };
        return t.name !== void 0 && (l.name = t.name), d !== void 0 && (l.value = d), l;
      });
    }
    function n(o) {
      var t = new c(o.options).setGraph(o.value);
      return o.nodes.forEach(function(d) {
        t.setNode(d.v, d.value), d.parent && t.setParent(d.v, d.parent);
      }), o.edges.forEach(function(d) {
        t.setEdge({ v: d.v, w: d.w, name: d.name }, d.value);
      }), t;
    }
  }, { "./graph": 44 }], 47: [function(e, r, i) {
    r.exports = "2.2.4";
  }, {}] }, {}, [1])(1);
})(), Ut = ["unstarted", "started", "completed", "canceled"];
function Gt(e, r) {
  let i = 1;
  const c = () => `${e.slice(0, 40 - String(i).length - 1)}_${i}`;
  for (; r.some((u) => u.id === c()); ) i++;
  return c();
}
function Wt(e, r) {
  return [
    ...e.initial === r.id ? ["the initial state"] : [],
    ...(e.transitions ?? []).filter((i) => i.to === r.id || i.from !== "any" && i.from.includes(r.id)).map((i) => `transition ${vt(i)}`),
    ...e.states.filter((i) => i.regions?.some((c) => c.initial === r.id)).map((i) => `lanes in ${rr(i)}`),
    ...Object.entries(e.map ?? {}).filter(([, i]) => i === r.id).map(() => "existing item migration")
  ];
}
function Ht(e, r) {
  return e.states.flatMap((i) => [
    ...["on_pass", "on_fail", "on_cancel", "on_exhausted"].filter((c) => i.run?.[c] === r.id).map((c) => `${{ on_pass: "success", on_fail: "failure", on_cancel: "cancellation", on_exhausted: "exhaustion" }[c]} handler in ${rr(i)}`),
    ...(i.timers ?? []).filter((c) => c.then?.transition === r.id).map(() => "a timer")
  ]);
}
const rr = (e) => e?.name || "Untitled state", vt = (e) => e.name?.trim() || _e(e.id), Yt = (e) => ({ unstarted: "Not started", triage: "Triage", backlog: "Backlog", started: "In progress", completed: "Done", canceled: "Canceled" })[e] ?? "In progress", Kt = (e) => ({ human: "Person", gate: "Approval", automated: "Automation", parallel: "Parallel" })[e ?? "human"] ?? "Person";
function Jt(e, r) {
  if (e.id === r.initial) return "Starts here";
  if (e.category === "completed") return "Finished";
  if (e.category === "canceled") return "Work stops here";
  if (e.kind === "gate") {
    const i = e.release_when?.approvals?.min;
    return i ? `Needs ${i} approval${i === 1 ? "" : "s"}` : "Waits for release";
  }
  return e.kind === "automated" ? "Runs automatically" : e.kind === "parallel" ? tr(e) : "A person moves it";
}
function tr(e) {
  return e.join === "any" ? "any may pass" : typeof e.join == "number" ? `${e.join} must pass` : e.regions?.length === 2 ? "both must pass" : "all must pass";
}
function Xt(e, r) {
  const i = e.release_when?.approvals?.min ?? 1, c = e.category === "completed" ? "Work is finished here." : e.category === "canceled" ? "Work stops here." : e.kind === "gate" ? e.release_when?.approvals ? `Items wait here until ${i === 1 ? "one person approves" : `${i} people approve`}.` : "Items wait until the release rules are met." : e.kind === "automated" ? "An automation runs when an item arrives." : e.kind === "parallel" ? `Items travel through lanes; ${tr(e)}.` : "A person chooses when to move the item on.", u = r.policy?.wip?.[e.id]?.limit;
  return c + (u !== void 0 ? ` At most ${u} at a time.` : "");
}
function Qt(e) {
  const r = e.transitions ?? [], i = [], c = /* @__PURE__ */ new Set();
  let u = e.states.find((p) => p.id === e.initial);
  const f = new Map(e.states.map((p, n) => [p.id, n]));
  for (; u && !c.has(u.id) && (i.push(u), c.add(u.id), !(u.category === "completed" || u.category === "canceled")); ) {
    const p = u, n = r.filter((t) => t.from !== "any" && t.from.includes(p.id)), o = n.find((t) => t.default) ?? n.find((t) => !c.has(t.to) && (f.get(t.to) ?? -1) > (f.get(p.id) ?? 0));
    u = e.states.find((t) => t.id === o?.to);
  }
  return i;
}
function or(e) {
  const r = e.states.find((i) => i.id === e.initial);
  return e.migration ?? (r?.kind === "automated" || r?.kind === "parallel" ? "pin" : "follow");
}
const se = (e) => JSON.parse(JSON.stringify(e));
function qt(e) {
  return e?.admin === !0;
}
function Zt(e, r, i) {
  const c = r + i;
  if (r < 0 || r >= e.length || c < 0 || c >= e.length) return;
  const [u] = e.splice(r, 1);
  e.splice(c, 0, u);
}
function eo(e, r, i) {
  const c = r.code;
  if (c === i) return;
  if (e.fields?.some((o) => o.expression)) throw new Error("Clear formula expressions before renaming a field, then restore them with the new code.");
  r.code = i;
  const u = (o) => o === c ? i : o;
  for (const o of e.item_types ?? [])
    o.fields = o.fields.map(u), o.inherit && (o.inherit = o.inherit.map(u));
  const f = (o) => {
    for (const t of o ?? []) "field" in t && t.field === c && (t.field = i);
  }, p = (o) => {
    o && typeof o == "object" && !Array.isArray(o) && "field" in o && typeof o.field == "string" && (o.field = u(o.field));
  }, n = (o) => {
    if (!(!o || typeof o != "object")) {
      if (Array.isArray(o)) {
        o.forEach(n);
        return;
      }
      p(o);
      for (const [t, d] of Object.entries(o)) ["value", "values", "ctx"].includes(t) || n(d);
    }
  };
  for (const o of e.fields ?? [])
    o.field && (o.field = u(o.field)), n(o.where), f(o.access?.read), f(o.access?.write);
  if (e.visibility) {
    e.visibility.field = u(e.visibility.field);
    for (const o of e.visibility.levels) f(o.holders);
  }
  for (const o of e.processes ?? []) {
    for (const t of o.states) {
      p(t.awaiting), p(t.release_when?.approvals?.from), n(t.release_when?.when), t.require && (t.require = t.require.map(u));
      for (const d of t.timers ?? [])
        d.at_field && (d.at_field = u(d.at_field)), d.by && (d.by = u(d.by));
    }
    for (const t of o.transitions ?? []) {
      n(t.when), t.require && (t.require = t.require.map(u));
      for (const d of t.set ?? [])
        d.field = u(d.field), d.copy && (d.copy = u(d.copy));
    }
  }
}
function ro(e, r) {
  const i = se(e), c = { ...i.remove };
  for (const u of ["fields", "item_types", "processes", "relation_types"]) {
    const f = (r[u] ?? []).filter((p) => {
      if (u === "fields") {
        const n = p;
        return !i.fields?.some((o) => n.id !== void 0 ? o.id === n.id : o.code === n.code);
      }
      return !(i[u] ?? []).some((n) => "id" in n && n.id === ("id" in p ? p.id : void 0));
    }).map((p) => "code" in p ? p.code : p.id);
    f.length ? c[u] = [.../* @__PURE__ */ new Set([...c[u] ?? [], ...f])] : delete c[u];
  }
  return Object.keys(c).length ? i.remove = c : delete i.remove, i;
}
function to(e, r, i) {
  const c = JSON.stringify({ declaration: e, configs: i });
  return {
    declaration: se(e),
    expected_generation: r,
    plugin_configs: se(i),
    matches: (u, f, p) => r === f && c === JSON.stringify({ declaration: u, configs: p })
  };
}
function oo(e) {
  const r = se(e), i = [...new Set(r.declaration.item_types?.flatMap((u) => u.fields) ?? [])], c = (u) => {
    const f = i.indexOf(u);
    return f < 0 ? i.length : f;
  };
  r.declaration.fields?.sort((u, f) => c(u.code) - c(f.code));
  for (const u of r.declaration.fields ?? []) {
    const f = r.compiled.fields?.find((p) => p.code === u.code);
    u.id ??= f?.id, u.form ??= f?.form ?? "text";
  }
  for (const u of r.declaration.processes ?? []) u.migration ??= r.compiled.processes?.find((f) => f.id === u.id)?.migration ?? or(u);
  return r;
}
function io(e, r) {
  return (r.processes ?? []).filter((i) => or(i) !== "pin" && e.changes.some((c) => c.code === "process " + i.id && c.class !== "cosmetic" && c.class !== "refused")).map((i) => i.id);
}
function no(e, r, i) {
  const c = [i, `item_type ${i}`, `relation ${i}`, `process ${i}`], u = e.refused.filter((f) => c.includes(f.code));
  return r === "fields" && u.push(...e.changes.filter((f) => f.code === i && f.what === "removed" && f.class === "semantic")), u.length ? u.map(kt).join(" ") : void 0;
}
function ao(e, r, i) {
  if (r === "fields") {
    e.fields = e.fields?.filter((c) => c.code !== i);
    for (const c of e.item_types ?? [])
      c.fields = c.fields.filter((u) => u !== i), c.inherit = c.inherit?.filter((u) => u !== i);
  } else r === "item_types" ? e.item_types = e.item_types?.filter((c) => c.id !== i) : r === "processes" ? e.processes = e.processes?.filter((c) => c.id !== i) : e.relation_types = e.relation_types?.filter((c) => c.id !== i);
}
function kt(e) {
  return e.what === "invalid" ? e.detail || "The definition is invalid." : [e.what === "removed" ? "Items still hold values in this field." : e.code.startsWith("item_type ") && e.what === "remove" ? "Items still use this item type." : e.code.startsWith("relation ") && e.what === "remove" ? "Links still use this relation type." : e.what === "options.remove" ? "Items still hold values in this option field." : e.what === "state.remove" ? "Items still occupy this state. Map them to a surviving state." : e.what === "process" ? "An existing item type cannot change process." : ["type", "form", "cardinality"].includes(e.what) || e.what.startsWith("config.") ? "This change alters the representation of stored values. Add a new field and migrate values first." : e.what === "state.kind" ? "An existing state cannot change kind. Create a new state and map existing items to it." : e.what === "shape" && e.code.startsWith("relation ") ? "Existing links prevent a cardinality or symmetry change." : "Stored data or a schema dependency prevents this change.", e.detail, e.count ? `${e.count} items` : ""].filter(Boolean).join(" ");
}
function so(e, r) {
  if (!(e instanceof Q)) return [];
  const i = e.details ?? {};
  let c = typeof i.field == "string" ? i.field : "";
  if (!c) {
    const u = r.processes?.find((f) => f.id === i.process || f.states.some((p) => p.id === i.state) || e.message.includes(`process ${f.id}`));
    u ? c = `process ${u.id}` : typeof i.item_type == "string" && (c = `item_type ${i.item_type}`);
  }
  return c ? [{ code: c, class: "refused", what: "invalid", detail: e.message }] : [];
}
const lo = {
  unchanged: "Nothing changes.",
  cosmetic: "Presentation or policy changes. Stored item values keep their meaning.",
  additive: "New definitions become available to items.",
  semantic: "The board updates its indexes or process generations after apply.",
  refused: "Resolve the refused changes before applying this draft.",
  initial: "The first schema defines the board."
};
function po() {
  let e = 0;
  return () => {
    const r = ++e;
    return () => r === e;
  };
}
export {
  Gt as A,
  Xt as B,
  Ht as C,
  Wt as D,
  or as E,
  se as F,
  lo as G,
  ro as H,
  io as I,
  oo as J,
  to as K,
  so as L,
  no as M,
  Lt as N,
  St as O,
  At as _,
  Pt as a,
  Tt as b,
  qt as c,
  Bt as d,
  zt as e,
  Jt as f,
  er as g,
  Vt as h,
  Dt as i,
  Ft as j,
  Ut as k,
  po as l,
  Qt as m,
  Yt as n,
  Zt as o,
  X as p,
  _e as q,
  $t as r,
  rr as s,
  vt as t,
  Rt as u,
  kt as v,
  Mt as w,
  ao as x,
  eo as y,
  Kt as z
};
//# sourceMappingURL=latestRequest-ChYtJT1O.js.map
