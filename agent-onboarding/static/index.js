import { hasInjectionContext as mo, inject as fn, effectScope as vo, ref as V, markRaw as go, createApp as yo, readonly as _o, getCurrentInstance as Ot, onMounted as bn, nextTick as So, watch as Ce, reactive as $o, renderSlot as ee, openBlock as j, createBlock as pe, Teleport as mn, createCommentVNode as ie, useId as ko, mergeProps as N, h as xo, createElementBlock as R, createElementVNode as C, createTextVNode as wo, toDisplayString as Te, resolveComponent as Je, resolveDirective as Co, withDirectives as Po, resolveDynamicComponent as vn, withCtx as To, normalizeClass as ut, defineComponent as Oo, computed as xe, createVNode as Z, unref as J, withModifiers as ot } from "vue";
import { addCollection as Ao, Icon as At } from "@iconify/vue";
import { config as Et, addIcons as Eo, on as jo, applyThemeMode as He, host as Lo, hostCss as No, loadCss as Io, loadByTagName as rt, api as Ke, define as Vo } from "@wippy-fe/proxy";
var dt = "data-wippy-visible";
function jt(e) {
  const t = e.getAttribute(dt);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Ro = Object.defineProperty, Mo = (e, t, n) => t in e ? Ro(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, L = (e, t, n) => Mo(e, typeof t != "symbol" ? t + "" : t, n), Do = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Bo = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Lt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Fo(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [o, r] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && r && typeof r == "object") {
          for (const [l, s] of Object.entries(r)) {
            const a = typeof s == "string" ? Lt(l) : null;
            a && t.add(a);
          }
          continue;
        }
        const i = typeof r == "string" ? Lt(o) : null;
        i && t.add(i);
      }
  return [...t].sort();
}
function zo(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Bo} {
${t}
}`;
}
function Uo(e, t) {
  const n = zo(t);
  n && gn(e, n, "@wippy-fe/css-variables-bridge");
}
function Wo(e, t) {
  const o = (t ?? Do).map(async (r) => {
    const i = No[r];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Io(i);
    } catch (l) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${i}):`, l), null;
    }
  });
  return Promise.all(o).then((r) => {
    for (const i of r) {
      if (!i)
        continue;
      const l = document.createElement("style");
      l.textContent = i, l.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(l);
    }
  });
}
function Ho(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function gn(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, r];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = t, e.appendChild(o);
}
function Ko(e, t) {
  gn(e, t, "@wippy-fe/custom-css");
}
function yn(e) {
  return e.__wippyHost ?? null;
}
function Go(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Yo(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const o = Number.parseFloat(t);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: o };
    }
    case "integer": {
      const o = Number.parseInt(t, 10);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: o };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const o = JSON.parse(t);
        return n.type === "array" && !Array.isArray(o) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: o };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function it(e, t) {
  const n = {}, o = [];
  for (const [r, i] of Object.entries(t.properties)) {
    const l = e.getAttribute(r), s = Go(r);
    if (l === null) {
      i.default !== void 0 && (n[s] = i.default);
      continue;
    }
    const a = Yo(r, l, i);
    a.error ? o.push(a.error) : n[s] = a.value;
  }
  return { props: n, errors: o };
}
var qo = class {
  constructor(e, t) {
    L(this, "_props"), L(this, "_errors"), L(this, "_content"), L(this, "_hostVisibility"), L(this, "_propsListeners", /* @__PURE__ */ new Set()), L(this, "_contentListeners", /* @__PURE__ */ new Set()), L(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), L(this, "_disposed", !1), L(this, "_emitToDom"), L(this, "props"), L(this, "events"), L(this, "content"), L(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(o, r) {
        return n._subscribeProps(o, r);
      }
    }, this.events = {
      emit(o, r) {
        n._disposed || n._emitToDom(o, r);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(o, r) {
        return n._subscribeContent(o, r);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(o, r) {
        return n._subscribeHostVisibility(o, r);
      }
    };
  }
  /** @internal */
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const n of this._propsListeners)
        n(e, t);
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
      for (const n of this._hostVisibilityListeners)
        n(e, t);
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
    const n = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const n = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, Zo = class extends HTMLElement {
  constructor() {
    super(), L(this, "_internals"), L(this, "_contentObserver", null), L(this, "_initialized", !1), L(this, "_container", null), L(this, "_reactive", null), L(this, "_lastProps", null), L(this, "_lastErrors", []), L(this, "_lastContent", null), L(this, "_themeUnsub", null), L(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = jt(this);
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), n = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...n, dt])];
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
    return yn(this);
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
      let n, o;
      if (this._lastProps !== null)
        n = this._lastProps, o = this._lastErrors;
      else {
        const i = it(this, e.propsSchema);
        e.validateProps && i.errors.push(...e.validateProps(i.props)), n = i.props, o = i.errors, this._lastProps = n, this._lastErrors = o;
      }
      const r = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = r), this._reactive = new qo(
        { props: n, errors: o, content: r, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, n = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let o;
      if (t)
        o = this._container;
      else {
        this.onInit(n), e.inlineCss && Ho(n, e.inlineCss);
        try {
          const u = Et?.theming, d = Fo(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Uo(n, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = Et?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && Ko(n, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Wo(n, e.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const a = e.containerClasses ?? [];
        a.length > 0 && o.classList.add(...a), n.appendChild(o), this._container = o, Eo(Ao);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = jo("@theme", (a) => this._applyTheme(a)));
      const { props: r, errors: i } = it(this, e.propsSchema);
      e.validateProps && i.push(...e.validateProps(r));
      const l = r;
      this._lastProps = l, this._lastErrors = i;
      let s = null;
      e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const a = this._extractContent(e.contentTemplate);
        this._lastContent = a, this._reactive?.notifyContent(a), this.onContentChanged(a);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, o, l, i, s, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Lo.getThemeMode?.()) {
    He(e, this), this._container && He(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), He("auto", this), this._container && He("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === dt) {
      const s = this._hostVisible, a = jt(this);
      if (a === s)
        return;
      this._hostVisible = a, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(a, s), this.onHostVisibilityChanged(a, s));
      return;
    }
    const o = this.constructor.wippyConfig, { props: r, errors: i } = it(this, o.propsSchema);
    o.validateProps && i.push(...o.validateProps(r));
    const l = r;
    this._lastProps = l, this._lastErrors = i, this._reactive?.notifyProps(l, i), this.onPropsChanged(l, i);
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
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(e) {
    return this.querySelector(`template[data-type="${e}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
function Jo(e) {
  return e.__wippyHostBus ?? null;
}
function Qo(e) {
  return e.dataset.wippyPanelId ?? null;
}
let _n;
const Sn = (e) => _n = e, Xo = () => mo() && fn($n) || _n, $n = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
function er() {
  const e = vo(!0), t = e.run(() => V({}));
  let n = [], o = [];
  const r = go({
    install(i) {
      Sn(r), r._a = i, i.provide($n, r), i.config.globalProperties.$pinia = r, o.forEach((l) => n.push(l)), o = [];
    },
    use(i) {
      return this._a ? n.push(i) : o.push(i), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return r;
}
var tr = Object.defineProperty, nr = (e, t, n) => t in e ? tr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Se = (e, t, n) => nr(e, typeof t != "symbol" ? t + "" : t, n), kn = /* @__PURE__ */ Symbol("wippy:emit"), or = /* @__PURE__ */ Symbol("wippy:props"), rr = /* @__PURE__ */ Symbol("wippy:props_error"), ir = /* @__PURE__ */ Symbol("wippy:content"), ar = /* @__PURE__ */ Symbol("wippy:panel-id"), sr = /* @__PURE__ */ Symbol("wippy:layout-bus"), lr = /* @__PURE__ */ Symbol("wippy:host"), ur = /* @__PURE__ */ Symbol("wippy:host-visibility");
function dr() {
  const e = fn(kn);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
var cr = class extends Zo {
  constructor() {
    super(...arguments), Se(this, "_vueApp", null), Se(this, "_propsRef", V({})), Se(this, "_errorsRef", V([])), Se(this, "_contentRef", V(null)), Se(this, "_hostVisibilityRef", V(null)), Se(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, o, r, i) {
    const l = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = o, this._contentRef.value = r ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of o)
      this.emitEvent("invalid", { message: u });
    const s = new AbortController();
    this._bridgeAbort = s, this.reactive.props.subscribe((u, d) => {
      this._propsRef.value = u, this._errorsRef.value = [...d];
      for (const c of d)
        this.emitEvent("invalid", { message: c });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: s.signal });
    const a = (u) => {
      if (s.signal.aborted)
        return;
      const d = Xo(), c = yo(u.rootComponent);
      this._vueApp = c;
      const p = er();
      if (u.piniaPlugins)
        for (const h of u.piniaPlugins)
          p.use(h);
      if (c.use(p), u.plugins)
        for (const h of u.plugins)
          c.use(h);
      c.provide(or, this._propsRef), c.provide(rr, this._errorsRef), c.provide(kn, this.emitEvent.bind(this)), c.provide(ir, this._contentRef), c.provide(ur, this._hostVisibilityRef), c.provide(ar, Qo(this)), c.provide(sr, Jo(this)), c.provide(lr, yn(this)), u.providers && u.providers(c, this), c.mount(t), d && Sn(d);
    };
    if (l.rootComponent)
      a(l);
    else if (l.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), l.lazyConfig().then((d) => {
        s.signal.aborted || (u.remove(), a(d));
      }).catch((d) => {
        if (s.signal.aborted)
          return;
        const c = d instanceof Error ? d.message : String(d), p = document.createElement("wippy-error");
        p.setAttribute("title", "Failed to load"), p.setAttribute("message", c), u.replaceWith(p), this.emitEvent("error", { message: c });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, pr = Object.defineProperty, Nt = Object.getOwnPropertySymbols, hr = Object.prototype.hasOwnProperty, fr = Object.prototype.propertyIsEnumerable, It = (e, t, n) => t in e ? pr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, br = (e, t) => {
  for (var n in t || (t = {})) hr.call(t, n) && It(e, n, t[n]);
  if (Nt) for (var n of Nt(t)) fr.call(t, n) && It(e, n, t[n]);
  return e;
};
function me(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function ct(e, t, n = /* @__PURE__ */ new WeakSet()) {
  if (e === t) return !0;
  if (!e || !t || typeof e != "object" || typeof t != "object" || n.has(e) || n.has(t)) return !1;
  n.add(e).add(t);
  let o = Array.isArray(e), r = Array.isArray(t), i, l, s;
  if (o && r) {
    if (l = e.length, l != t.length) return !1;
    for (i = l; i-- !== 0; ) if (!ct(e[i], t[i], n)) return !1;
    return !0;
  }
  if (o != r) return !1;
  let a = e instanceof Date, u = t instanceof Date;
  if (a != u) return !1;
  if (a && u) return e.getTime() == t.getTime();
  let d = e instanceof RegExp, c = t instanceof RegExp;
  if (d != c) return !1;
  if (d && c) return e.toString() == t.toString();
  let p = Object.keys(e);
  if (l = p.length, l !== Object.keys(t).length) return !1;
  for (i = l; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t, p[i])) return !1;
  for (i = l; i-- !== 0; ) if (s = p[i], !ct(e[s], t[s], n)) return !1;
  return !0;
}
function mr(e, t) {
  return ct(e, t);
}
function $t(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function A(e) {
  return !me(e);
}
function Vt(e, t) {
  return null;
}
function xn(e, t, n) {
  return n ? Vt() === Vt() : mr(e, t);
}
function vr(e, t) {
  if (e != null && t && t.length) {
    for (let n of t) if (xn(e, n)) return !0;
  }
  return !1;
}
function te(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function wn(e = {}, t = {}) {
  let n = br({}, e);
  return Object.keys(t).forEach((o) => {
    let r = o;
    te(t[r]) && r in e && te(e[r]) ? n[r] = wn(e[r], t[r]) : n[r] = t[r];
  }), n;
}
function gr(...e) {
  return e.reduce((t, n, o) => o === 0 ? n : wn(t, n), {});
}
function W(e, ...t) {
  return $t(e) ? e(...t) : e;
}
function z(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function X(e) {
  return z(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function kt(e, t = "", n = {}) {
  let o = X(t).split("."), r = o.shift();
  if (r) {
    if (te(e)) {
      let i = Object.keys(e).find((l) => X(l) === r) || "";
      return kt(W(e[i], n), o.join("."), n);
    }
    return;
  }
  return W(e, n);
}
function Cn(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function yr(e) {
  return A(e) && !isNaN(e);
}
function he(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function _r(...e) {
  return gr(...e);
}
function Oe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Sr(e) {
  return z(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Pn(e) {
  return z(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function Tn() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let o = e.get(t);
    return o ? o.push(n) : o = [n], e.set(t, o), this;
  }, off(t, n) {
    let o = e.get(t);
    return o && o.splice(o.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let o = e.get(t);
    o && o.forEach((r) => {
      r(n);
    });
  }, clear() {
    e.clear();
  } };
}
function fe(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n];
      if (!o) continue;
      let r = typeof o;
      if (r === "string" || r === "number") t.push(o);
      else if (r === "object") {
        let i = Array.isArray(o) ? [fe(...o)] : Object.entries(o).map(([l, s]) => s ? l : void 0);
        t = i.length ? t.concat(i.filter((l) => !!l)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function $r(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function kr(e, t) {
  if (e && t) {
    let n = (o) => {
      $r(e, o) || (e.classList ? e.classList.add(o) : e.className += " " + o);
    };
    [t].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function at(e, t) {
  if (e && t) {
    let n = (o) => {
      e.classList ? e.classList.remove(o) : e.className = e.className.replace(new RegExp("(^|\\b)" + o.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function Rt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function xr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function wr(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Cr(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && wr(e));
}
function Ue(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Qe(e, t = {}) {
  if (Ue(e)) {
    let n = (o, r) => {
      var i, l;
      let s = (i = e?.$attrs) != null && i[o] ? [(l = e?.$attrs) == null ? void 0 : l[o]] : [];
      return [r].flat().reduce((a, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") a.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(o, u) : Object.entries(u).map(([p, h]) => o === "style" && (h || h === 0) ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${h}` : h ? p : void 0);
            a = c.length ? a.concat(c.filter((p) => !!p)) : a;
          }
        }
        return a;
      }, s);
    };
    Object.entries(t).forEach(([o, r]) => {
      if (r != null) {
        let i = o.match(/^on(.+)/);
        i ? e.addEventListener(i[1].toLowerCase(), r) : o === "p-bind" || o === "pBind" ? Qe(e, r) : (r = o === "class" ? [...new Set(n("class", r))].join(" ").trim() : o === "style" ? n("style", r).join(";").trim() : r, (e.$attrs = e.$attrs || {}) && (e.$attrs[o] = r), e.setAttribute(o, r));
      }
    });
  }
}
function Pr(e, t = {}, ...n) {
  {
    let o = document.createElement(e);
    return Qe(o, t), o.append(...n), o;
  }
}
function Tr(e, t) {
  return Ue(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Or(e, t) {
  if (Ue(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Mt(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Ar(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Rt(document.documentElement) || Rt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Er(e, t) {
  return e ? e.offsetHeight : 0;
}
function Dt(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function On() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function jr(e, t = "", n) {
  Ue(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ge = {};
function Lr(e = "pui_id_") {
  return Object.hasOwn(Ge, e) || (Ge[e] = 0), Ge[e]++, `${e}${Ge[e]}`;
}
var Nr = Object.defineProperty, Ir = Object.defineProperties, Vr = Object.getOwnPropertyDescriptors, Xe = Object.getOwnPropertySymbols, An = Object.prototype.hasOwnProperty, En = Object.prototype.propertyIsEnumerable, Bt = (e, t, n) => t in e ? Nr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, K = (e, t) => {
  for (var n in t || (t = {})) An.call(t, n) && Bt(e, n, t[n]);
  if (Xe) for (var n of Xe(t)) En.call(t, n) && Bt(e, n, t[n]);
  return e;
}, st = (e, t) => Ir(e, Vr(t)), re = (e, t) => {
  var n = {};
  for (var o in e) An.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Xe) for (var o of Xe(e)) t.indexOf(o) < 0 && En.call(e, o) && (n[o] = e[o]);
  return n;
}, Rr = Tn(), M = Rr, Ae = /{([^}]*)}/g, jn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Ln = /var\([^)]+\)/g;
function Ft(e) {
  return z(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Mr(e) {
  return te(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Dr(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function pt(e = "", t = "") {
  return Dr(`${z(e, !1) && z(t, !1) ? `${e}-` : e}${t}`);
}
function Nn(e = "", t = "") {
  return `--${pt(e, t)}`;
}
function Br(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function In(e, t = "", n = "", o = [], r) {
  if (z(e)) {
    let i = e.trim();
    if (Br(i)) return;
    if (he(i, Ae)) {
      let l = i.replaceAll(Ae, (s) => {
        let a = s.replace(/{|}/g, "").split(".").filter((u) => !o.some((d) => he(u, d)));
        return `var(${Nn(n, Pn(a.join("-")))}${A(r) ? `, ${r}` : ""})`;
      });
      return he(l.replace(Ln, "0"), jn) ? `calc(${l})` : l;
    }
    return i;
  } else if (yr(e)) return e;
}
function Fr(e, t, n) {
  z(t, !1) && e.push(`${t}:${n};`);
}
function $e(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Vn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(l, s) {
    let a = [], u = 0, d = "", c = null, p = 0;
    for (; u <= l.length; ) {
      let h = l[u];
      if ((h === '"' || h === "'" || h === "`") && l[u - 1] !== "\\" && (c = c === h ? null : h), !c && (h === "(" && p++, h === ")" && p--, (h === "," || u === l.length) && p === 0)) {
        let b = d.trim();
        b.startsWith("dt(") ? a.push(Vn(b, s)) : a.push(o(b)), d = "", u++;
        continue;
      }
      h !== void 0 && (d += h), u++;
    }
    return a;
  }
  function o(l) {
    let s = l[0];
    if ((s === '"' || s === "'" || s === "`") && l[l.length - 1] === s) return l.slice(1, -1);
    let a = Number(l);
    return isNaN(a) ? l : a;
  }
  let r = [], i = [];
  for (let l = 0; l < e.length; l++) if (e[l] === "d" && e.slice(l, l + 3) === "dt(") i.push(l), l += 2;
  else if (e[l] === ")" && i.length > 0) {
    let s = i.pop();
    i.length === 0 && r.push([s, l]);
  }
  if (!r.length) return e;
  for (let l = r.length - 1; l >= 0; l--) {
    let [s, a] = r[l], u = e.slice(s + 3, a), d = n(u, t), c = t(...d);
    e = e.slice(0, s) + c + e.slice(a + 1);
  }
  return e;
}
var be = (...e) => zr(T.getTheme(), ...e), zr = (e = {}, t, n, o) => {
  if (t) {
    let { variable: r, options: i } = T.defaults || {}, { prefix: l, transform: s } = e?.options || i || {}, a = he(t, Ae) ? t : `{${t}}`;
    return o === "value" || me(o) && s === "strict" ? T.getTokenValue(t) : In(a, void 0, l, [r.excludedKeyRegex], n);
  }
  return "";
};
function Ye(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((o, r, i) => {
      var l;
      return o + r + ((l = W(t[i], { dt: be })) != null ? l : "");
    }, "");
    return Vn(n, be);
  }
  return W(e, { dt: be });
}
function Ur(e, t = {}) {
  let n = T.defaults.variable, { prefix: o = n.prefix, selector: r = n.selector, excludedKeyRegex: i = n.excludedKeyRegex } = t, l = [], s = [], a = [{ node: e, path: o }];
  for (; a.length; ) {
    let { node: d, path: c } = a.pop();
    for (let p in d) {
      let h = d[p], b = Mr(h), v = he(p, i) ? pt(c) : pt(c, Pn(p));
      if (te(b)) a.push({ node: b, path: v });
      else {
        let m = Nn(v), g = In(b, v, o, [i]);
        Fr(s, m, g);
        let $ = v;
        o && $.startsWith(o + "-") && ($ = $.slice(o.length + 1)), l.push($.replace(/-/g, "."));
      }
    }
  }
  let u = s.join("");
  return { value: s, tokens: l, declarations: u, css: $e(r, u) };
}
var H = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e},:host${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: !0 };
} } }, resolve(e) {
  let t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [e].flat().map((n) => {
    var o;
    return (o = t.map((r) => r.resolve(n)).find((r) => r.matched)) != null ? o : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Ur(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var i, l, s, a, u, d, c;
  let { preset: p, options: h } = t, b, v, m, g, $, w, f;
  if (A(p) && h.transform !== "strict") {
    let { primitive: S, semantic: I, extend: D } = p, G = I || {}, { colorScheme: Y } = G, ne = re(G, ["colorScheme"]), O = D || {}, { colorScheme: y } = O, P = re(O, ["colorScheme"]), U = Y || {}, { dark: le } = U, ve = re(U, ["dark"]), ue = y || {}, { dark: ge } = ue, ye = re(ue, ["dark"]), oe = A(S) ? this._toVariables({ primitive: S }, h) : {}, q = A(ne) ? this._toVariables({ semantic: ne }, h) : {}, de = A(ve) ? this._toVariables({ light: ve }, h) : {}, We = A(le) ? this._toVariables({ dark: le }, h) : {}, _e = A(P) ? this._toVariables({ semantic: P }, h) : {}, Pt = A(ye) ? this._toVariables({ light: ye }, h) : {}, Tt = A(ge) ? this._toVariables({ dark: ge }, h) : {}, [Jn, Qn] = [(i = oe.declarations) != null ? i : "", oe.tokens], [Xn, eo] = [(l = q.declarations) != null ? l : "", q.tokens || []], [to, no] = [(s = de.declarations) != null ? s : "", de.tokens || []], [oo, ro] = [(a = We.declarations) != null ? a : "", We.tokens || []], [io, ao] = [(u = _e.declarations) != null ? u : "", _e.tokens || []], [so, lo] = [(d = Pt.declarations) != null ? d : "", Pt.tokens || []], [uo, co] = [(c = Tt.declarations) != null ? c : "", Tt.tokens || []];
    b = this.transformCSS(e, Jn, "light", "variable", h, o, r), v = Qn;
    let po = this.transformCSS(e, `${Xn}${to}`, "light", "variable", h, o, r), ho = this.transformCSS(e, `${oo}`, "dark", "variable", h, o, r);
    m = `${po}${ho}`, g = [.../* @__PURE__ */ new Set([...eo, ...no, ...ro])];
    let fo = this.transformCSS(e, `${io}${so}color-scheme:light`, "light", "variable", h, o, r), bo = this.transformCSS(e, `${uo}color-scheme:dark`, "dark", "variable", h, o, r);
    $ = `${fo}${bo}`, w = [.../* @__PURE__ */ new Set([...ao, ...lo, ...co])], f = W(p.css, { dt: be });
  }
  return { primitive: { css: b, tokens: v }, semantic: { css: m, tokens: g }, global: { css: $, tokens: w }, style: f };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: o, set: r, defaults: i, selector: l }) {
  var s, a, u;
  let d, c, p;
  if (A(t) && n.transform !== "strict") {
    let h = e.replace("-directive", ""), b = t, { colorScheme: v, extend: m, css: g } = b, $ = re(b, ["colorScheme", "extend", "css"]), w = m || {}, { colorScheme: f } = w, S = re(w, ["colorScheme"]), I = v || {}, { dark: D } = I, G = re(I, ["dark"]), Y = f || {}, { dark: ne } = Y, O = re(Y, ["dark"]), y = A($) ? this._toVariables({ [h]: K(K({}, $), S) }, n) : {}, P = A(G) ? this._toVariables({ [h]: K(K({}, G), O) }, n) : {}, U = A(D) ? this._toVariables({ [h]: K(K({}, D), ne) }, n) : {}, [le, ve] = [(s = y.declarations) != null ? s : "", y.tokens || []], [ue, ge] = [(a = P.declarations) != null ? a : "", P.tokens || []], [ye, oe] = [(u = U.declarations) != null ? u : "", U.tokens || []], q = this.transformCSS(h, `${le}${ue}`, "light", "variable", n, r, i, l), de = this.transformCSS(h, ye, "dark", "variable", n, r, i, l);
    d = `${q}${de}`, c = [.../* @__PURE__ */ new Set([...ve, ...ge, ...oe])], p = W(g, { dt: be });
  }
  return { css: d, tokens: c, style: p };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var i;
  let { preset: l, options: s } = t, a = (i = l?.components) == null ? void 0 : i[e];
  return this.getPreset({ name: e, preset: a, options: s, params: n, set: o, defaults: r });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var i, l;
  let s = e.replace("-directive", ""), { preset: a, options: u } = t, d = ((i = a?.components) == null ? void 0 : i[s]) || ((l = a?.directives) == null ? void 0 : l[s]);
  return this.getPreset({ name: s, preset: d, options: u, params: n, set: o, defaults: r });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, o) {
  let { cssLayer: r } = t;
  return r ? `@layer ${W(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: o = {}, set: r, defaults: i }) {
  let l = this.getCommon({ name: e, theme: t, params: n, set: r, defaults: i }), s = Object.entries(o).reduce((a, [u, d]) => a.push(`${u}="${d}"`) && a, []).join(" ");
  return Object.entries(l || {}).reduce((a, [u, d]) => {
    if (te(d) && Object.hasOwn(d, "css")) {
      let c = Oe(d.css), p = `${u}-variables`;
      a.push(`<style type="text/css" data-primevue-style-id="${p}" ${s}>${c}</style>`);
    }
    return a;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: o = {}, set: r, defaults: i }) {
  var l;
  let s = { name: e, theme: t, params: n, set: r, defaults: i }, a = (l = e.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : l.css, u = Object.entries(o).reduce((d, [c, p]) => d.push(`${c}="${p}"`) && d, []).join(" ");
  return a ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${Oe(a)}</style>` : "";
}, createTokens(e = {}, t, n = "", o = "", r = {}) {
  let i = function(s, a = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: a, value: void 0 };
    u.push(this.path), a.name = this.path, a.binding || (a.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && Ae.test(this.value)) {
      let c = this.value.trim().replace(Ae, (p) => {
        var h;
        let b = p.slice(1, -1), v = this.tokens[b];
        if (!v) return console.warn(`Token not found for path: ${b}`), "__UNRESOLVED__";
        let m = v.computed(s, a, u);
        return Array.isArray(m) && m.length === 2 ? `light-dark(${m[0].value},${m[1].value})` : (h = m?.value) != null ? h : "__UNRESOLVED__";
      });
      d = jn.test(c.replace(Ln, "0")) ? `calc(${c})` : c;
    }
    return me(a.binding) && delete a.binding, u.pop(), { colorScheme: s, path: this.path, paths: a, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, l = (s, a, u) => {
    Object.entries(s).forEach(([d, c]) => {
      let p = he(d, t.variable.excludedKeyRegex) ? a : a ? `${a}.${Ft(d)}` : Ft(d), h = u ? `${u}.${d}` : d;
      te(c) ? l(c, p, h) : (r[p] || (r[p] = { paths: [], computed: (b, v = {}, m = []) => {
        if (r[p].paths.length === 1) return r[p].paths[0].computed(r[p].paths[0].scheme, v.binding, m);
        if (b && b !== "none") for (let g = 0; g < r[p].paths.length; g++) {
          let $ = r[p].paths[g];
          if ($.scheme === b) return $.computed(b, v.binding, m);
        }
        return r[p].paths.map((g) => g.computed(g.scheme, v[g.scheme], m));
      } }), r[p].paths.push({ path: h, value: c, scheme: h.includes("colorScheme.light") ? "light" : h.includes("colorScheme.dark") ? "dark" : "none", computed: i, tokens: r }));
    });
  };
  return l(e, n, o), r;
}, getTokenValue(e, t, n) {
  var o;
  let r = ((s) => s.split(".").filter((a) => !he(a.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), i = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, l = [(o = e[r]) == null ? void 0 : o.computed(i)].flat().filter((s) => s);
  return l.length === 1 ? l[0].value : l.reduce((s = {}, a) => {
    let u = a, { colorScheme: d } = u, c = re(u, ["colorScheme"]);
    return s[d] = c, s;
  }, void 0);
}, getSelectorRule(e, t, n, o) {
  return n === "class" || n === "attr" ? $e(A(t) ? `${e}${t},${e} ${t}` : e, o) : $e(e, $e(t ?? ":root,:host", o));
}, transformCSS(e, t, n, o, r = {}, i, l, s) {
  if (A(t)) {
    let { cssLayer: a } = r;
    if (o !== "style") {
      let u = this.getColorSchemeOption(r, l);
      t = n === "dark" ? u.reduce((d, { type: c, selector: p }) => (A(p) && (d += p.includes("[CSS]") ? p.replace("[CSS]", t) : this.getSelectorRule(p, s, c, t)), d), "") : $e(s ?? ":root,:host", t);
    }
    if (a) {
      let u = { name: "primeui" };
      te(a) && (u.name = W(a.name, { name: e, type: o })), A(u.name) && (t = $e(`@layer ${u.name}`, t), i?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, T = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = st(K({}, t), { options: K(K({}, this.defaults.options), t.options) }), this._tokens = H.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), M.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = st(K({}, this.theme), { preset: e }), this._tokens = H.createTokens(e, this.defaults), this.clearLoadedStyleNames(), M.emit("preset:change", e), M.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = st(K({}, this.theme), { options: e }), this.clearLoadedStyleNames(), M.emit("options:change", e), M.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return H.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return H.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPresetD(n);
}, getCustomPreset(e = "", t, n, o) {
  let r = { name: e, preset: t, options: this.options, selector: n, params: o, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPreset(r);
}, getLayerOrderCSS(e = "") {
  return H.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", o) {
  return H.transformCSS(e, t, o, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return H.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return H.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), M.emit(`theme:${t}:load`, e), !this._loadingStyles.size && M.emit("theme:load"));
} }, B = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
}, Wr = `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .p-collapsible-enter-active {
        animation: p-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .p-collapsible-leave-active {
        animation: p-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes p-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .p-disabled,
    .p-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .p-disabled,
    .p-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .p-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .p-overlay-mask-enter-active {
        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .p-overlay-mask-leave-active {
        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes p-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes p-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .p-anchored-overlay-enter-active {
        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-anchored-overlay-leave-active {
        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
function Ee(e) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ee(e);
}
function zt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ut(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zt(Object(n), !0).forEach(function(o) {
      Hr(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : zt(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function Hr(e, t, n) {
  return (t = Kr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Kr(e) {
  var t = Gr(e, "string");
  return Ee(t) == "symbol" ? t : t + "";
}
function Gr(e, t) {
  if (Ee(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Ee(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Yr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Ot() && Ot().components ? bn(e) : t ? e() : So(e);
}
var qr = 0;
function Zr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = V(!1), o = V(e), r = V(null), i = On() ? window.document : void 0, l = t.document, s = l === void 0 ? i : l, a = t.immediate, u = a === void 0 ? !0 : a, d = t.manual, c = d === void 0 ? !1 : d, p = t.name, h = p === void 0 ? "style_".concat(++qr) : p, b = t.id, v = b === void 0 ? void 0 : b, m = t.media, g = m === void 0 ? void 0 : m, $ = t.nonce, w = $ === void 0 ? void 0 : $, f = t.first, S = f === void 0 ? !1 : f, I = t.onMounted, D = I === void 0 ? void 0 : I, G = t.onUpdated, Y = G === void 0 ? void 0 : G, ne = t.onLoad, O = ne === void 0 ? void 0 : ne, y = t.props, P = y === void 0 ? {} : y, U = function() {
  }, le = function(ge) {
    var ye = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var oe = Ut(Ut({}, P), ye), q = oe.name || h, de = oe.id || v, We = oe.nonce || w;
      r.value = s.querySelector('style[data-primevue-style-id="'.concat(q, '"]')) || s.getElementById(de) || s.createElement("style"), r.value.isConnected || (o.value = ge || e, Qe(r.value, {
        type: "text/css",
        id: de,
        media: g,
        nonce: We
      }), S ? s.head.prepend(r.value) : s.head.appendChild(r.value), jr(r.value, "data-primevue-style-id", q), Qe(r.value, oe), r.value.onload = function(_e) {
        return O?.(_e, {
          name: q
        });
      }, D?.(q)), !n.value && (U = Ce(o, function(_e) {
        r.value.textContent = _e, Y?.(q);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ve = function() {
    !s || !n.value || (U(), Cr(r.value) && s.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && Yr(le), {
    id: v,
    name: h,
    el: r,
    css: o,
    unload: ve,
    load: le,
    isLoaded: _o(n)
  };
}
function je(e) {
  "@babel/helpers - typeof";
  return je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, je(e);
}
var Wt, Ht, Kt, Gt;
function Yt(e, t) {
  return ei(e) || Xr(e, t) || Qr(e, t) || Jr();
}
function Jr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Qr(e, t) {
  if (e) {
    if (typeof e == "string") return qt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? qt(e, t) : void 0;
  }
}
function qt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Xr(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, i, l, s = [], a = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(a = (o = i.call(n)).done) && (s.push(o.value), s.length !== t); a = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!a && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function ei(e) {
  if (Array.isArray(e)) return e;
}
function Zt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function lt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zt(Object(n), !0).forEach(function(o) {
      ti(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Zt(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function ti(e, t, n) {
  return (t = ni(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ni(e) {
  var t = oi(e, "string");
  return je(t) == "symbol" ? t : t + "";
}
function oi(e, t) {
  if (je(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (je(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function qe(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var ri = function(t) {
  var n = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(n("scrollbar.width"), `;
}
`);
}, ii = {}, ai = {}, E = {
  name: "base",
  css: ri,
  style: Wr,
  classes: ii,
  inlineStyles: ai,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(i) {
      return i;
    }, r = o(Ye(Wt || (Wt = qe(["", ""])), t));
    return A(r) ? Zr(Oe(r), lt({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return T.transformCSS(n.name || t.name, "".concat(r).concat(Ye(Ht || (Ht = qe(["", ""])), o)));
    });
  },
  getCommonTheme: function(t) {
    return T.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return T.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return T.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, o) {
    return T.getCustomPreset(this.name, t, n, o);
  },
  getLayerOrderThemeCSS: function() {
    return T.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var o = W(this.css, {
        dt: be
      }) || "", r = Oe(Ye(Kt || (Kt = qe(["", "", ""])), o, t)), i = Object.entries(n).reduce(function(l, s) {
        var a = Yt(s, 2), u = a[0], d = a[1];
        return l.push("".concat(u, '="').concat(d, '"')) && l;
      }, []).join(" ");
      return A(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(i, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return T.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = [T.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), i = Ye(Gt || (Gt = qe(["", ""])), W(this.style, {
        dt: be
      })), l = Oe(T.transformCSS(r, i)), s = Object.entries(n).reduce(function(a, u) {
        var d = Yt(u, 2), c = d[0], p = d[1];
        return a.push("".concat(c, '="').concat(p, '"')) && a;
      }, []).join(" ");
      A(l) && o.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(s, ">").concat(l, "</style>"));
    }
    return o.join("");
  },
  extend: function(t) {
    return lt(lt({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, se = Tn();
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function Jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ze(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jt(Object(n), !0).forEach(function(o) {
      si(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Jt(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function si(e, t, n) {
  return (t = li(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function li(e) {
  var t = ui(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function ui(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Le(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var di = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [B.STARTS_WITH, B.CONTAINS, B.NOT_CONTAINS, B.ENDS_WITH, B.EQUALS, B.NOT_EQUALS],
    numeric: [B.EQUALS, B.NOT_EQUALS, B.LESS_THAN, B.LESS_THAN_OR_EQUAL_TO, B.GREATER_THAN, B.GREATER_THAN_OR_EQUAL_TO],
    date: [B.DATE_IS, B.DATE_IS_NOT, B.DATE_BEFORE, B.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, ci = /* @__PURE__ */ Symbol();
function pi(e, t) {
  var n = {
    config: $o(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(ci, n), hi(), fi(e, n), n;
}
var ke = [];
function hi() {
  M.clear(), ke.forEach(function(e) {
    return e?.();
  }), ke = [];
}
function fi(e, t) {
  var n = V(!1), o = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !T.isStyleNameLoaded("common")) {
      var d, c, p = ((d = E.getCommonTheme) === null || d === void 0 ? void 0 : d.call(E)) || {}, h = p.primitive, b = p.semantic, v = p.global, m = p.style, g = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      E.load(h?.css, Ze({
        name: "primitive-variables"
      }, g)), E.load(b?.css, Ze({
        name: "semantic-variables"
      }, g)), E.load(v?.css, Ze({
        name: "global-variables"
      }, g)), E.loadStyle(Ze({
        name: "global-style"
      }, g), m), T.setLoadedStyleName("common");
    }
  };
  M.on("theme:change", function(a) {
    n.value || (e.config.globalProperties.$primevue.config.theme = a, n.value = !0);
  });
  var r = Ce(t.config, function(a, u) {
    se.emit("config:change", {
      newValue: a,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = Ce(function() {
    return t.config.ripple;
  }, function(a, u) {
    se.emit("config:ripple:change", {
      newValue: a,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = Ce(function() {
    return t.config.theme;
  }, function(a, u) {
    n.value || T.setTheme(a), t.config.unstyled || o(), n.value = !1, se.emit("config:theme:change", {
      newValue: a,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = Ce(function() {
    return t.config.unstyled;
  }, function(a, u) {
    !a && t.config.theme && o(), se.emit("config:unstyled:change", {
      newValue: a,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ke.push(r), ke.push(i), ke.push(l), ke.push(s);
}
var bi = {
  install: function(t, n) {
    var o = _r(di, n);
    pi(t, o);
  }
}, Rn = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = On();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function mi(e, t, n, o, r, i) {
  return i.inline ? ee(e.$slots, "default", {
    key: 0
  }) : r.mounted ? (j(), pe(mn, {
    key: 1,
    to: n.appendTo
  }, [ee(e.$slots, "default")], 8, ["to"])) : ie("", !0);
}
Rn.render = mi;
var ae = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function vi() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = ko();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var Qt = E.extend({
  name: "common"
});
function Ne(e) {
  "@babel/helpers - typeof";
  return Ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ne(e);
}
function gi(e) {
  return Bn(e) || yi(e) || Dn(e) || Mn();
}
function yi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function we(e, t) {
  return Bn(e) || _i(e, t) || Dn(e, t) || Mn();
}
function Mn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Dn(e, t) {
  if (e) {
    if (typeof e == "string") return ht(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ht(e, t) : void 0;
  }
}
function ht(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function _i(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, i, l, s = [], a = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        a = !1;
      } else for (; !(a = (o = i.call(n)).done) && (s.push(o.value), s.length !== t); a = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!a && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function Bn(e) {
  if (Array.isArray(e)) return e;
}
function Xt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function k(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Xt(Object(n), !0).forEach(function(o) {
      Pe(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Xt(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function Pe(e, t, n) {
  return (t = Si(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Si(e) {
  var t = $i(e, "string");
  return Ne(t) == "symbol" ? t : t + "";
}
function $i(e, t) {
  if (Ne(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Ne(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var nt = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        M.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var o = this;
        M.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return o._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, o, r, i, l, s, a, u, d, c, p = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, h = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, b = p ? (o = this.pt) === null || o === void 0 || (o = o.value) === null || o === void 0 ? void 0 : o[this.$.type.name] : this.pt;
    (r = b || h) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (i = r.onBeforeCreate) === null || i === void 0 || i.call(r);
    var v = (l = this.$primevueConfig) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l._usept, m = v ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, g = v ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = g || m) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = vi(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Tr(Ue(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = k({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._removeThemeListeners(), this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), o = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), o?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return $t(t) ? t.apply(void 0, o) : N.apply(void 0, o);
    },
    _load: function() {
      ae.isStyleNameLoaded("base") || (E.loadCSS(this.$styleOptions), this._loadGlobalStyles(), ae.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !ae.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (Qt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), ae.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      A(t) && E.load(t, k({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!T.isStyleNameLoaded("common")) {
          var o, r, i = ((o = this.$style) === null || o === void 0 || (r = o.getCommonTheme) === null || r === void 0 ? void 0 : r.call(o)) || {}, l = i.primitive, s = i.semantic, a = i.global, u = i.style;
          E.load(l?.css, k({
            name: "primitive-variables"
          }, this.$styleOptions)), E.load(s?.css, k({
            name: "semantic-variables"
          }, this.$styleOptions)), E.load(a?.css, k({
            name: "global-variables"
          }, this.$styleOptions)), E.loadStyle(k({
            name: "global-style"
          }, this.$styleOptions), u), T.setLoadedStyleName("common");
        }
        if (!T.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, p, h, b = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, v = b.css, m = b.style;
          (p = this.$style) === null || p === void 0 || p.load(v, k({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (h = this.$style) === null || h === void 0 || h.loadStyle(k({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), m), T.setLoadedStyleName(this.$style.name);
        }
        if (!T.isStyleNameLoaded("layer-order")) {
          var g, $, w = (g = this.$style) === null || g === void 0 || ($ = g.getLayerOrderThemeCSS) === null || $ === void 0 ? void 0 : $.call(g);
          E.load(w, k({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), T.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, o, r, i = ((n = this.$style) === null || n === void 0 || (o = n.getPresetTheme) === null || o === void 0 ? void 0 : o.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, l = i.css, s = (r = this.$style) === null || r === void 0 ? void 0 : r.load(l, k({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = s.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      ae.clearLoadedStyleNames(), M.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      M.off("theme:change", this._loadCoreStyles), M.off("theme:change", this._load), M.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return kt(t, n, o);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, l = /./g.test(o) && !!r[o.split(".")[0]], s = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, a = s.mergeSections, u = a === void 0 ? !0 : a, d = s.mergeProps, c = d === void 0 ? !1 : d, p = i ? l ? this._useGlobalPT(this._getPTClassValue, o, r) : this._useDefaultPT(this._getPTClassValue, o, r) : void 0, h = l ? void 0 : this._getPTSelf(n, this._getPTClassValue, o, k(k({}, r), {}, {
        global: p || {}
      })), b = this._getPTDatasets(o);
      return u || !u && h ? c ? this._mergeProps(c, p, h, b) : k(k(k({}, p), h), b) : k(k({}, h), b);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return N(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(o)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(o))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", i = o === "root" && A((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return o !== "transition" && k(k({}, o === "root" && k(k(Pe({}, "".concat(r, "name"), X(i ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), i && Pe({}, "".concat(r, "extend"), X(this.$.type.name))), {}, Pe({}, "".concat(this.$attrSelector), ""))), {}, Pe({}, "".concat(r, "section"), X(o)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return z(t) || Cn(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, i = function(s) {
        var a, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(s) : s, c = X(o), p = X(n.$name);
        return (a = u ? c !== p ? d?.[c] : void 0 : d?.[c]) !== null && a !== void 0 ? a : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: i(t.originalValue),
        value: i(t.value)
      } : i(t, !0);
    },
    _usePT: function(t, n, o, r) {
      var i = function(v) {
        return n(v, o, r);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var l, s = t._usept || ((l = this.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, a = s.mergeSections, u = a === void 0 ? !0 : a, d = s.mergeProps, c = d === void 0 ? !1 : d, p = i(t.originalValue), h = i(t.value);
        return p === void 0 && h === void 0 ? void 0 : z(h) ? h : z(p) ? p : u || !u && h ? c ? this._mergeProps(c, p, h) : k(k({}, p), h) : h;
      }
      return i(t);
    },
    _useGlobalPT: function(t, n, o) {
      return this._usePT(this.globalPT, t, n, o);
    },
    _useDefaultPT: function(t, n, o) {
      return this._usePT(this.defaultPT, t, n, o);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, k(k({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = N(this.$_attrsWithoutPT, this.ptm(n, o));
      return r?.hasOwnProperty("id") && ((t = r.id) !== null && t !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, k({
        instance: this
      }, o), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, k(k({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, t, k(k({}, this.$params), o)), i = this._getOptionValue(Qt.inlineStyles, t, k(k({}, this.$params), o));
        return [i, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(o) {
        return W(o, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(o) {
        return n._getOptionValue(o, n.$name, k({}, n.$params)) || W(o, k({}, n.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var t, n = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(o) {
        var r = we(o, 1), i = r[0];
        return n?.includes(i);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return k(k({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadStyle: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t?.$props,
          state: t?.$data,
          attrs: t?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = we(t, 1), o = n[0];
        return o?.startsWith("pt:");
      }).reduce(function(t, n) {
        var o = we(n, 2), r = o[0], i = o[1], l = r.split(":"), s = gi(l), a = ht(s).slice(1);
        return a?.reduce(function(u, d, c, p) {
          return !u[d] && (u[d] = c === p.length - 1 ? i : {}), u[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = we(t, 1), o = n[0];
        return !(o != null && o.startsWith("pt:"));
      }).reduce(function(t, n) {
        var o = we(n, 2), r = o[0], i = o[1];
        return t[r] = i, t;
      }, {});
    }
  }
}, ki = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, xi = E.extend({
  name: "baseicon",
  css: ki
});
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
function en(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function tn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? en(Object(n), !0).forEach(function(o) {
      wi(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : en(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function wi(e, t, n) {
  return (t = Ci(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ci(e) {
  var t = Pi(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function Pi(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Ie(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var xt = {
  name: "BaseIcon",
  extends: nt,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: xi,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = me(this.label);
      return tn(tn({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
};
function Ve(e) {
  "@babel/helpers - typeof";
  return Ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ve(e);
}
function nn(e, t) {
  return Ei(e) || Ai(e, t) || Oi(e, t) || Ti();
}
function Ti() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Oi(e, t) {
  if (e) {
    if (typeof e == "string") return on(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? on(e, t) : void 0;
  }
}
function on(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Ai(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, i, l, s = [], a = !0, u = !1;
    try {
      if (i = (n = n.call(e)).next, t !== 0) for (; !(a = (o = i.call(n)).done) && (s.push(o.value), s.length !== t); a = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!a && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function Ei(e) {
  if (Array.isArray(e)) return e;
}
function rn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function x(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? rn(Object(n), !0).forEach(function(o) {
      ft(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : rn(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function ft(e, t, n) {
  return (t = ji(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ji(e) {
  var t = Li(e, "string");
  return Ve(t) == "symbol" ? t : t + "";
}
function Li(e, t) {
  if (Ve(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Ve(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var _ = {
  _getMeta: function() {
    return [te(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], W(te(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var o, r, i;
    return (o = (t == null || (r = t.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (i = n.ctx) === null || i === void 0 || (i = i.appContext) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.globalProperties) === null || i === void 0 ? void 0 : i.$primevue)) === null || o === void 0 ? void 0 : o.config;
  },
  _getOptionValue: kt,
  _getPTValue: function() {
    var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = function() {
      var $ = _._getOptionValue.apply(_, arguments);
      return z($) || Cn($) ? {
        class: $
      } : $;
    }, u = ((t = o.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = o.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, p = u.mergeProps, h = p === void 0 ? !1 : p, b = s ? _._useDefaultPT(o, o.defaultPT(), a, i, l) : void 0, v = _._usePT(o, _._getPT(r, o.$name), a, i, x(x({}, l), {}, {
      global: b || {}
    })), m = _._getPTDatasets(o, i);
    return c || !c && v ? h ? _._mergeProps(o, h, b, v, m) : x(x(x({}, b), v), m) : x(x({}, v), m);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = "data-pc-";
    return x(x({}, n === "root" && ft({}, "".concat(o, "name"), X(t.$name))), {}, ft({}, "".concat(o, "section"), X(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(l) {
      var s, a = o ? o(l) : l, u = X(n);
      return (s = a?.[u]) !== null && s !== void 0 ? s : a;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: r(t.originalValue),
      value: r(t.value)
    } : r(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0, l = function(m) {
      return o(m, r, i);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, a = n._usept || ((s = t.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, u = a.mergeSections, d = u === void 0 ? !0 : u, c = a.mergeProps, p = c === void 0 ? !1 : c, h = l(n.originalValue), b = l(n.value);
      return h === void 0 && b === void 0 ? void 0 : z(b) ? b : z(h) ? h : d || !d && b ? p ? _._mergeProps(t, p, h, b) : x(x({}, h), b) : b;
    }
    return l(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0;
    return _._usePT(t, n, o, r, i);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, i = _._getConfig(o, r), l = {
      nonce: i == null || (t = i.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    _._loadCoreStyles(n, l), _._loadThemeStyles(n, l), _._loadScopedThemeStyles(n, l), _._removeThemeListeners(n), n.$loadStyles = function() {
      return _._loadThemeStyles(n, l);
    }, _._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!ae.isStyleNameLoaded((t = o.$style) === null || t === void 0 ? void 0 : t.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
      var i;
      E.loadCSS(r), (i = o.$style) === null || i === void 0 || i.loadCSS(r), ae.setLoadedStyleName(o.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, o, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (t = r.theme) === null || t === void 0 ? void 0 : t.call(r)) === "none")) {
      if (!T.isStyleNameLoaded("common")) {
        var l, s, a = ((l = r.$style) === null || l === void 0 || (s = l.getCommonTheme) === null || s === void 0 ? void 0 : s.call(l)) || {}, u = a.primitive, d = a.semantic, c = a.global, p = a.style;
        E.load(u?.css, x({
          name: "primitive-variables"
        }, i)), E.load(d?.css, x({
          name: "semantic-variables"
        }, i)), E.load(c?.css, x({
          name: "global-variables"
        }, i)), E.loadStyle(x({
          name: "global-style"
        }, i), p), T.setLoadedStyleName("common");
      }
      if (!T.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (o = r.$style) !== null && o !== void 0 && o.name) {
        var h, b, v, m, g = ((h = r.$style) === null || h === void 0 || (b = h.getDirectiveTheme) === null || b === void 0 ? void 0 : b.call(h)) || {}, $ = g.css, w = g.style;
        (v = r.$style) === null || v === void 0 || v.load($, x({
          name: "".concat(r.$style.name, "-variables")
        }, i)), (m = r.$style) === null || m === void 0 || m.loadStyle(x({
          name: "".concat(r.$style.name, "-style")
        }, i), w), T.setLoadedStyleName(r.$style.name);
      }
      if (!T.isStyleNameLoaded("layer-order")) {
        var f, S, I = (f = r.$style) === null || f === void 0 || (S = f.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(f);
        E.load(I, x({
          name: "layer-order",
          first: !0
        }, i)), T.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = t.preset();
    if (o && t.$attrSelector) {
      var r, i, l, s = ((r = t.$style) === null || r === void 0 || (i = r.getPresetTheme) === null || i === void 0 ? void 0 : i.call(r, o, "[".concat(t.$attrSelector, "]"))) || {}, a = s.css, u = (l = t.$style) === null || l === void 0 ? void 0 : l.load(a, x({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    ae.clearLoadedStyleNames(), M.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    M.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, o, r, i, l) {
    var s, a, u = "on".concat(Sr(n)), d = _._getConfig(r, i), c = o?.$instance, p = _._usePT(c, _._getPT(r == null || (s = r.value) === null || s === void 0 ? void 0 : s.pt, t), _._getOptionValue, "hooks.".concat(u)), h = _._useDefaultPT(c, d == null || (a = d.pt) === null || a === void 0 || (a = a.directives) === null || a === void 0 ? void 0 : a[t], _._getOptionValue, "hooks.".concat(u)), b = {
      el: o,
      binding: r,
      vnode: i,
      prevVnode: l
    };
    p?.(c, b), h?.(c, b);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      o[r - 2] = arguments[r];
    return $t(t) ? t.apply(void 0, o) : N.apply(void 0, o);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = function(s, a, u, d, c) {
      var p, h, b, v;
      a._$instances = a._$instances || {};
      var m = _._getConfig(u, d), g = a._$instances[t] || {}, $ = me(g) ? x(x({}, n), n?.methods) : {};
      a._$instances[t] = x(x({}, g), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: a,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: g.$el || a || void 0,
        $style: x({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: m,
        $attrSelector: (p = a.$pd) === null || p === void 0 || (p = p[t]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return _._getPT(m?.pt, void 0, function(f) {
            var S;
            return f == null || (S = f.directives) === null || S === void 0 ? void 0 : S[t];
          });
        },
        isUnstyled: function() {
          var f, S;
          return ((f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.unstyled) !== void 0 ? (S = a._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : m?.unstyled;
        },
        theme: function() {
          var f;
          return (f = a._$instances[t]) === null || f === void 0 || (f = f.$primevueConfig) === null || f === void 0 ? void 0 : f.theme;
        },
        preset: function() {
          var f;
          return (f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.dt;
        },
        /* instance's methods */
        ptm: function() {
          var f, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return _._getPTValue(a._$instances[t], (f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.pt, S, x({}, I));
        },
        ptmo: function() {
          var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return _._getPTValue(a._$instances[t], f, S, I, !1);
        },
        cx: function() {
          var f, S, I = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (f = a._$instances[t]) !== null && f !== void 0 && f.isUnstyled() ? void 0 : _._getOptionValue((S = a._$instances[t]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, I, x({}, D));
        },
        sx: function() {
          var f, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, D = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return I ? _._getOptionValue((f = a._$instances[t]) === null || f === void 0 || (f = f.$style) === null || f === void 0 ? void 0 : f.inlineStyles, S, x({}, D)) : void 0;
        }
      }, $), a.$instance = a._$instances[t], (h = (b = a.$instance)[s]) === null || h === void 0 || h.call(b, a, u, d, c), a["$".concat(t)] = a.$instance, _._hook(t, s, a, u, d, c), a.$pd || (a.$pd = {}), a.$pd[t] = x(x({}, (v = a.$pd) === null || v === void 0 ? void 0 : v[t]), {}, {
        name: t,
        instance: a._$instances[t]
      });
    }, r = function(s) {
      var a, u, d, c = s._$instances[t], p = c?.watch, h = function(m) {
        var g, $ = m.newValue, w = m.oldValue;
        return p == null || (g = p.config) === null || g === void 0 ? void 0 : g.call(c, $, w);
      }, b = function(m) {
        var g, $ = m.newValue, w = m.oldValue;
        return p == null || (g = p["config.ripple"]) === null || g === void 0 ? void 0 : g.call(c, $, w);
      };
      c.$watchersCallback = {
        config: h,
        "config.ripple": b
      }, p == null || (a = p.config) === null || a === void 0 || a.call(c, c?.$primevueConfig), se.on("config:change", h), p == null || (u = p["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), se.on("config:ripple:change", b);
    }, i = function(s) {
      var a = s._$instances[t].$watchersCallback;
      a && (se.off("config:change", a.config), se.off("config:ripple:change", a["config.ripple"]), s._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(s, a, u, d) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: Lr("pd")
        }, o("created", s, a, u, d);
      },
      beforeMount: function(s, a, u, d) {
        var c;
        _._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, u), o("beforeMount", s, a, u, d), r(s);
      },
      mounted: function(s, a, u, d) {
        var c;
        _._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, u), o("mounted", s, a, u, d);
      },
      beforeUpdate: function(s, a, u, d) {
        o("beforeUpdate", s, a, u, d);
      },
      updated: function(s, a, u, d) {
        var c;
        _._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, a, u), o("updated", s, a, u, d);
      },
      beforeUnmount: function(s, a, u, d) {
        var c;
        i(s), _._removeThemeListeners((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance), o("beforeUnmount", s, a, u, d);
      },
      unmounted: function(s, a, u, d) {
        var c;
        (c = s.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), o("unmounted", s, a, u, d);
      }
    };
  },
  extend: function() {
    var t = _._getMeta.apply(_, arguments), n = nn(t, 2), o = n[0], r = n[1];
    return x({
      extend: function() {
        var l = _._getMeta.apply(_, arguments), s = nn(l, 2), a = s[0], u = s[1];
        return _.extend(a, x(x(x({}, r), r?.methods), u));
      }
    }, _._extend(o, r));
  }
}, Ni = `
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`, Ii = {
  root: "p-ink"
}, Vi = E.extend({
  name: "ripple-directive",
  style: Ni,
  classes: Ii
}), Ri = _.extend({
  style: Vi
});
function Re(e) {
  "@babel/helpers - typeof";
  return Re = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Re(e);
}
function Mi(e) {
  return zi(e) || Fi(e) || Bi(e) || Di();
}
function Di() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Bi(e, t) {
  if (e) {
    if (typeof e == "string") return bt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? bt(e, t) : void 0;
  }
}
function Fi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function zi(e) {
  if (Array.isArray(e)) return bt(e);
}
function bt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function an(e, t, n) {
  return (t = Ui(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ui(e) {
  var t = Wi(e, "string");
  return Re(t) == "symbol" ? t : t + "";
}
function Wi(e, t) {
  if (Re(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Re(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Hi = Ri.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var n = this.getInk(t);
      n || (n = Pr("span", an(an({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(n), this.$el = n);
    },
    remove: function(t) {
      var n = this.getInk(t);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(t) {
      var n = this, o = t.currentTarget, r = this.getInk(o);
      if (!(!r || getComputedStyle(r, null).display === "none")) {
        if (!this.isUnstyled() && at(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Mt(r) && !Dt(r)) {
          var i = Math.max(xr(o), Er(o));
          r.style.height = i + "px", r.style.width = i + "px";
        }
        var l = Ar(o), s = t.pageX - l.left + document.body.scrollTop - Dt(r) / 2, a = t.pageY - l.top + document.body.scrollLeft - Mt(r) / 2;
        r.style.top = a + "px", r.style.left = s + "px", !this.isUnstyled() && kr(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && at(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && at(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Mi(t.children).find(function(n) {
        return Or(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const Ki = "data-wippy-overlay-layer";
function Fn() {
  return typeof window < "u" && typeof window.document < "u";
}
function zn() {
  return Fn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function Gi() {
  return zn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Yi = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let qi = 0;
const et = /* @__PURE__ */ new WeakMap();
function sn(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Zi(e, t) {
  if (!Yi.test(e.className))
    return;
  const n = e.style.cssText;
  sn(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!et.has(e)) {
    const o = new MutationObserver(() => {
      const r = e.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && sn(e, t);
    });
    o.observe(e, { attributes: !0, attributeFilter: ["style"] }), et.set(e, o);
  }
}
function wt(e) {
  const t = et.get(e);
  t && (t.disconnect(), et.delete(e));
}
function Ji(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function mt(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const tt = /* @__PURE__ */ new Set(), Ct = /* @__PURE__ */ new WeakMap();
let ln = !1, vt = !1;
function Qi() {
  vt = !1;
  for (const e of tt) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && wt(t);
      tt.delete(e), Ct.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && mt(e);
  }
}
function un() {
  vt || (vt = !0, requestAnimationFrame(Qi));
}
function Xi(e) {
  const t = document.createElement("div");
  t.setAttribute(Ki, "");
  const n = zn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  mt(t);
  const o = new MutationObserver((r) => {
    const i = t.__wippyAnchorName;
    for (const l of r) {
      if (i)
        for (const s of Array.from(l.addedNodes))
          s instanceof HTMLElement && Zi(s, i);
      for (const s of Array.from(l.removedNodes))
        s instanceof HTMLElement && wt(s);
    }
    t.isConnected && t.childElementCount > 0 && mt(t);
  });
  return o.observe(t, { childList: !0 }), Ct.set(t, o), tt.add(t), ln || (ln = !0, window.addEventListener("scroll", un, { capture: !0, passive: !0 }), window.addEventListener("resize", un, { passive: !0 })), t;
}
function dn(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Xi(e.hostRoot), Gi())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++qi}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function cn(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && wt(t);
    tt.delete(e.layer), Ct.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let pn = !1;
function ea() {
  if (pn)
    return;
  pn = !0;
  const e = Rn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Fn() && (this.hostRoot = Ji(this.$el), this.mounted = !0, this.hostRoot && (this.inline || dn(this), this.$watch("inline", (t) => {
      t ? cn(this) : dn(this);
    })));
  }, e.render = function() {
    return this.inline ? ee(this.$slots, "default", { key: 0 }) : this.mounted ? xo(mn, { key: 1, to: this.resolvedTarget || document.body }, [
      ee(this.$slots, "default")
    ]) : ie("", !0);
  }, e.unmounted = function() {
    cn(this);
  };
}
const ta = {
  install: (e) => {
    ea(), e.use(bi, { theme: "none" });
  }
};
var Un = {
  name: "SpinnerIcon",
  extends: xt
};
function na(e) {
  return aa(e) || ia(e) || ra(e) || oa();
}
function oa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ra(e, t) {
  if (e) {
    if (typeof e == "string") return gt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? gt(e, t) : void 0;
  }
}
function ia(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function aa(e) {
  if (Array.isArray(e)) return gt(e);
}
function gt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function sa(e, t, n, o, r, i) {
  return j(), R("svg", N({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), na(t[0] || (t[0] = [C("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Un.render = sa;
var la = `
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`, ua = {
  root: function(t) {
    var n = t.props, o = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": A(n.value) && String(n.value).length === 1,
      "p-badge-dot": me(n.value) && !o.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, da = E.extend({
  name: "badge",
  style: la,
  classes: ua
}), ca = {
  name: "BaseBadge",
  extends: nt,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: da,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Me(e) {
  "@babel/helpers - typeof";
  return Me = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Me(e);
}
function hn(e, t, n) {
  return (t = pa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function pa(e) {
  var t = ha(e, "string");
  return Me(t) == "symbol" ? t : t + "";
}
function ha(e, t) {
  if (Me(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Me(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Wn = {
  name: "Badge",
  extends: ca,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return fe(hn(hn({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, fa = ["data-p"];
function ba(e, t, n, o, r, i) {
  return j(), R("span", N({
    class: e.cx("root"),
    "data-p": i.dataP
  }, e.ptmi("root")), [ee(e.$slots, "default", {}, function() {
    return [wo(Te(e.value), 1)];
  })], 16, fa);
}
Wn.render = ba;
var ma = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;
function De(e) {
  "@babel/helpers - typeof";
  return De = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, De(e);
}
function Q(e, t, n) {
  return (t = va(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function va(e) {
  var t = ga(e, "string");
  return De(t) == "symbol" ? t : t + "";
}
function ga(e, t) {
  if (De(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (De(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ya = {
  root: function(t) {
    var n = t.instance, o = t.props;
    return ["p-button p-component", Q(Q(Q(Q(Q(Q(Q(Q(Q({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", Q({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, _a = E.extend({
  name: "button",
  style: ma,
  classes: ya
}), Sa = {
  name: "BaseButton",
  extends: nt,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: _a,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Be(e) {
  "@babel/helpers - typeof";
  return Be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Be(e);
}
function F(e, t, n) {
  return (t = $a(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $a(e) {
  var t = ka(e, "string");
  return Be(t) == "symbol" ? t : t + "";
}
function ka(e, t) {
  if (Be(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Be(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ce = {
  name: "Button",
  extends: Sa,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return N(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return me(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return fe(F(F(F(F(F(F(F(F(F(F({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return fe(F(F({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return fe(F(F({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Un,
    Badge: Wn
  },
  directives: {
    ripple: Hi
  }
}, xa = ["data-p"], wa = ["data-p"];
function Ca(e, t, n, o, r, i) {
  var l = Je("SpinnerIcon"), s = Je("Badge"), a = Co("ripple");
  return e.asChild ? ee(e.$slots, "default", {
    key: 1,
    class: ut(e.cx("root")),
    a11yAttrs: i.a11yAttrs
  }) : Po((j(), pe(vn(e.as), N({
    key: 0,
    class: e.cx("root"),
    "data-p": i.dataP
  }, i.attrs), {
    default: To(function() {
      return [ee(e.$slots, "default", {}, function() {
        return [e.loading ? ee(e.$slots, "loadingicon", N({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (j(), R("span", N({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (j(), pe(l, N({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : ee(e.$slots, "icon", N({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (j(), R("span", N({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": i.dataIconP
          }, e.ptm("icon")), null, 16, xa)) : ie("", !0)];
        }), e.label ? (j(), R("span", N({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": i.dataLabelP
        }), Te(e.label), 17, wa)) : ie("", !0), e.badge ? (j(), pe(s, {
          key: 3,
          value: e.badge,
          class: ut(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : ie("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[a]]);
}
ce.render = Ca;
var Pa = {
  name: "BaseEditableHolder",
  extends: nt,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(t) {
        this.d_value = t;
      }
    },
    defaultValue: function(t) {
      this.d_value = t;
    },
    $formName: {
      immediate: !0,
      handler: function(t) {
        var n, o;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (o = n.register) === null || o === void 0 ? void 0 : o.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, o;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (o = n.register) === null || o === void 0 ? void 0 : o.call(n, this.$formName, t)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(t) {
        this.d_value !== t && (this.d_value = t);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(t) {
        var n;
        (n = this.$pcForm) !== null && n !== void 0 && n.getFieldState(this.$formName) && t !== this.d_value && (this.d_value = t);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(t, n) {
      var o, r;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (o = (r = this.formField).onChange) === null || o === void 0 || o.call(r, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++)
        n[o] = arguments[o];
      return n.find(A);
    }
  },
  computed: {
    $filled: function() {
      return A(this.d_value);
    },
    $invalid: function() {
      var t, n;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.invalid, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.invalid);
    },
    $formName: function() {
      var t;
      return this.$formNovalidate ? void 0 : this.name || ((t = this.$formControl) === null || t === void 0 ? void 0 : t.name);
    },
    $formControl: function() {
      var t;
      return this.formControl || ((t = this.$pcFormField) === null || t === void 0 ? void 0 : t.formControl);
    },
    $formNovalidate: function() {
      var t;
      return (t = this.$formControl) === null || t === void 0 ? void 0 : t.novalidate;
    },
    $formDefaultValue: function() {
      var t, n;
      return this.findNonEmpty(this.d_value, (t = this.$pcFormField) === null || t === void 0 ? void 0 : t.initialValue, (n = this.$pcForm) === null || n === void 0 || (n = n.initialValues) === null || n === void 0 ? void 0 : n[this.$formName]);
    },
    $formValue: function() {
      var t, n;
      return this.findNonEmpty((t = this.$pcFormField) === null || t === void 0 || (t = t.$field) === null || t === void 0 ? void 0 : t.value, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, Hn = {
  name: "BaseInput",
  extends: Pa,
  props: {
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcFluid: {
      default: void 0
    }
  },
  computed: {
    $variant: function() {
      var t;
      return (t = this.variant) !== null && t !== void 0 ? t : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var t;
      return (t = this.fluid) !== null && t !== void 0 ? t : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, Ta = `
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`, Oa = {
  root: function(t) {
    var n = t.instance, o = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": o.size === "small",
      "p-inputtext-lg p-inputfield-lg": o.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, Aa = E.extend({
  name: "inputtext",
  style: Ta,
  classes: Oa
}), Ea = {
  name: "BaseInputText",
  extends: Hn,
  style: Aa,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Fe(e) {
  "@babel/helpers - typeof";
  return Fe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fe(e);
}
function ja(e, t, n) {
  return (t = La(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function La(e) {
  var t = Na(e, "string");
  return Fe(t) == "symbol" ? t : t + "";
}
function Na(e, t) {
  if (Fe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (Fe(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Kn = {
  name: "InputText",
  extends: Ea,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return N(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return fe(ja({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, Ia = ["value", "name", "disabled", "aria-invalid", "data-p"];
function Va(e, t, n, o, r, i) {
  return j(), R("input", N({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": i.dataP,
    onInput: t[0] || (t[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, Ia);
}
Kn.render = Va;
var Gn = {
  name: "CheckIcon",
  extends: xt
};
function Ra(e) {
  return Fa(e) || Ba(e) || Da(e) || Ma();
}
function Ma() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Da(e, t) {
  if (e) {
    if (typeof e == "string") return yt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? yt(e, t) : void 0;
  }
}
function Ba(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Fa(e) {
  if (Array.isArray(e)) return yt(e);
}
function yt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function za(e, t, n, o, r, i) {
  return j(), R("svg", N({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Ra(t[0] || (t[0] = [C("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Gn.render = za;
var Yn = {
  name: "MinusIcon",
  extends: xt
};
function Ua(e) {
  return Ga(e) || Ka(e) || Ha(e) || Wa();
}
function Wa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ha(e, t) {
  if (e) {
    if (typeof e == "string") return _t(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _t(e, t) : void 0;
  }
}
function Ka(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ga(e) {
  if (Array.isArray(e)) return _t(e);
}
function _t(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Ya(e, t, n, o, r, i) {
  return j(), R("svg", N({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Ua(t[0] || (t[0] = [C("path", {
    d: "M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Yn.render = Ya;
var qa = `
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`, Za = {
  root: function(t) {
    var n = t.instance, o = t.props;
    return ["p-checkbox p-component", {
      "p-checkbox-checked": n.checked,
      "p-disabled": o.disabled,
      "p-invalid": n.$pcCheckboxGroup ? n.$pcCheckboxGroup.$invalid : n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-checkbox-sm p-inputfield-sm": o.size === "small",
      "p-checkbox-lg p-inputfield-lg": o.size === "large"
    }];
  },
  box: "p-checkbox-box",
  input: "p-checkbox-input",
  icon: "p-checkbox-icon"
}, Ja = E.extend({
  name: "checkbox",
  style: qa,
  classes: Za
}), Qa = {
  name: "BaseCheckbox",
  extends: Hn,
  props: {
    value: null,
    binary: Boolean,
    indeterminate: {
      type: Boolean,
      default: !1
    },
    trueValue: {
      type: null,
      default: !0
    },
    falseValue: {
      type: null,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    required: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },
  style: Ja,
  provide: function() {
    return {
      $pcCheckbox: this,
      $parentInstance: this
    };
  }
};
function ze(e) {
  "@babel/helpers - typeof";
  return ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ze(e);
}
function Xa(e, t, n) {
  return (t = es(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function es(e) {
  var t = ts(e, "string");
  return ze(t) == "symbol" ? t : t + "";
}
function ts(e, t) {
  if (ze(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (ze(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ns(e) {
  return as(e) || is(e) || rs(e) || os();
}
function os() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rs(e, t) {
  if (e) {
    if (typeof e == "string") return St(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? St(e, t) : void 0;
  }
}
function is(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function as(e) {
  if (Array.isArray(e)) return St(e);
}
function St(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
var qn = {
  name: "Checkbox",
  extends: Qa,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "update:indeterminate"],
  inject: {
    $pcCheckboxGroup: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_indeterminate: this.indeterminate
    };
  },
  watch: {
    indeterminate: function(t) {
      this.d_indeterminate = t, this.updateIndeterminate();
    }
  },
  mounted: function() {
    this.updateIndeterminate();
  },
  updated: function() {
    this.updateIndeterminate();
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
        context: {
          checked: this.checked,
          indeterminate: this.d_indeterminate,
          disabled: this.disabled
        }
      });
    },
    onChange: function(t) {
      var n = this;
      if (!this.disabled && !this.readonly) {
        var o = this.$pcCheckboxGroup ? this.$pcCheckboxGroup.d_value : this.d_value, r;
        this.binary ? r = this.d_indeterminate ? this.trueValue : this.checked ? this.falseValue : this.trueValue : this.checked || this.d_indeterminate ? r = o.filter(function(i) {
          return !xn(i, n.value);
        }) : r = o ? [].concat(ns(o), [this.value]) : [this.value], this.d_indeterminate && (this.d_indeterminate = !1, this.$emit("update:indeterminate", this.d_indeterminate)), this.$pcCheckboxGroup ? this.$pcCheckboxGroup.writeValue(r, t) : this.writeValue(r, t), this.$emit("change", t);
      }
    },
    onFocus: function(t) {
      this.$emit("focus", t);
    },
    onBlur: function(t) {
      var n, o;
      this.$emit("blur", t), (n = (o = this.formField).onBlur) === null || n === void 0 || n.call(o, t);
    },
    updateIndeterminate: function() {
      this.$refs.input && (this.$refs.input.indeterminate = this.d_indeterminate);
    }
  },
  computed: {
    groupName: function() {
      return this.$pcCheckboxGroup ? this.$pcCheckboxGroup.groupName : this.$formName;
    },
    checked: function() {
      var t = this.$pcCheckboxGroup ? this.$pcCheckboxGroup.d_value : this.d_value;
      return this.d_indeterminate ? !1 : this.binary ? t === this.trueValue : vr(this.value, t);
    },
    dataP: function() {
      return fe(Xa({
        invalid: this.$invalid,
        checked: this.checked,
        disabled: this.disabled,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  },
  components: {
    CheckIcon: Gn,
    MinusIcon: Yn
  }
}, ss = ["data-p-checked", "data-p-indeterminate", "data-p-disabled", "data-p"], ls = ["id", "value", "name", "checked", "tabindex", "disabled", "readonly", "required", "aria-labelledby", "aria-label", "aria-invalid"], us = ["data-p"];
function ds(e, t, n, o, r, i) {
  var l = Je("CheckIcon"), s = Je("MinusIcon");
  return j(), R("div", N({
    class: e.cx("root")
  }, i.getPTOptions("root"), {
    "data-p-checked": i.checked,
    "data-p-indeterminate": r.d_indeterminate || void 0,
    "data-p-disabled": e.disabled,
    "data-p": i.dataP
  }), [C("input", N({
    ref: "input",
    id: e.inputId,
    type: "checkbox",
    class: [e.cx("input"), e.inputClass],
    style: e.inputStyle,
    value: e.value,
    name: i.groupName,
    checked: i.checked,
    tabindex: e.tabindex,
    disabled: e.disabled,
    readonly: e.readonly,
    required: e.required,
    "aria-labelledby": e.ariaLabelledby,
    "aria-label": e.ariaLabel,
    "aria-invalid": e.invalid || void 0,
    onFocus: t[0] || (t[0] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: t[1] || (t[1] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onChange: t[2] || (t[2] = function() {
      return i.onChange && i.onChange.apply(i, arguments);
    })
  }, i.getPTOptions("input")), null, 16, ls), C("div", N({
    class: e.cx("box")
  }, i.getPTOptions("box"), {
    "data-p": i.dataP
  }), [ee(e.$slots, "icon", {
    checked: i.checked,
    indeterminate: r.d_indeterminate,
    class: ut(e.cx("icon")),
    dataP: i.dataP
  }, function() {
    return [i.checked ? (j(), pe(l, N({
      key: 0,
      class: e.cx("icon")
    }, i.getPTOptions("icon"), {
      "data-p": i.dataP
    }), null, 16, ["class", "data-p"])) : r.d_indeterminate ? (j(), pe(s, N({
      key: 1,
      class: e.cx("icon")
    }, i.getPTOptions("icon"), {
      "data-p": i.dataP
    }), null, 16, ["class", "data-p"])) : ie("", !0)];
  })], 16, us)], 16, ss);
}
qn.render = ds;
const cs = { class: "onboarding" }, ps = {
  key: 0,
  class: "status",
  role: "status"
}, hs = {
  key: 1,
  class: "stack"
}, fs = {
  class: "error",
  role: "alert"
}, bs = { class: "actions" }, ms = {
  key: 2,
  class: "model-setup",
  "aria-labelledby": "model-setup-title"
}, vs = { class: "head" }, gs = {
  class: "head-icon",
  "aria-hidden": "true"
}, ys = {
  key: 0,
  class: "error",
  role: "alert"
}, _s = { class: "actions" }, Ss = {
  key: 3,
  class: "stack",
  "aria-labelledby": "model-config-title"
}, $s = { class: "head" }, ks = {
  class: "head-icon",
  "aria-hidden": "true"
}, xs = ["disabled"], ws = { class: "field-row" }, Cs = { class: "field" }, Ps = { class: "field" }, Ts = ["value"], Os = {
  key: 0,
  class: "hint"
}, As = { class: "field" }, Es = { class: "memory-choice" }, js = ["value"], Ls = {
  key: 0,
  class: "error",
  role: "alert"
}, Ns = { class: "actions" }, Is = "My Assistant", Vs = /* @__PURE__ */ Oo({
  __name: "Onboarding",
  setup(e) {
    const t = dr(), n = ["kickside.agents.traits:trait_master", "kickside.agents.traits:artifacts", "kickside.uploads.traits:file_manager"], o = V(Is), r = V(""), i = V(!0), l = V({ traits: [...n], trait_contexts: { "kickside.agents.traits:trait_master": { inject_trait_catalog: !0 } } }), s = V(!0), a = V(!1), u = V(!1), d = V(""), c = V(""), p = V([]), h = V([]), b = xe(() => h.value.includes("class:fast")), v = xe(() => p.value.length > 0), m = V(!1), g = xe(() => r.value ? p.value.includes(r.value) || h.value.includes(r.value) : b.value), $ = xe(() => a.value && !s.value && !u.value && !!o.value.trim() && g.value), w = xe(() => s.value ? "loading" : a.value ? m.value ? "configuring" : v.value ? "create" : "model-setup" : "failed");
    function f(O) {
      const y = O;
      return y?.response?.data?.error || y?.message || String(O);
    }
    function S(O) {
      const y = O.detail;
      l.value = { traits: [...y.traits], trait_contexts: { ...y.trait_contexts } };
    }
    function I() {
      t("done", { status: "skipped" });
    }
    async function D() {
      s.value = !0, a.value = !1, d.value = "";
      try {
        await Promise.all([
          rt("wc-model-picker", { timeoutMs: 8e3 }),
          rt("wc-agent-trait-picker", { timeoutMs: 8e3 })
        ]);
        const [O, y] = await Promise.all([
          Ke.get("/api/v1/models/list?capability=generate"),
          Ke.get("/api/v1/models/classes")
        ]);
        if (O.data?.success !== !0 || y.data?.success !== !0) throw new Error("Could not check model configuration.");
        p.value = O.data.models.map((P) => P.name), h.value = y.data.classes.filter((P) => P.models.length > 0 && p.value.includes(P.models[0].name)).map((P) => `class:${P.name}`), a.value = !0;
      } catch (O) {
        d.value = f(O);
      } finally {
        s.value = !1;
      }
    }
    async function G() {
      d.value = "";
      try {
        await rt("kickside-onboard-models", { timeoutMs: 8e3 }), m.value = !0;
      } catch (O) {
        d.value = f(O);
      }
    }
    async function Y() {
      m.value = !1, await D();
    }
    async function ne() {
      if ($.value) {
        u.value = !0, d.value = "";
        try {
          if (!c.value) {
            const P = { title: o.value.trim(), memory: i.value };
            r.value && (P.model = r.value), l.value.traits.length && (P.traits = [...l.value.traits], P.trait_contexts = { ...l.value.trait_contexts });
            const { data: U } = await Ke.post("/api/v1/agent-onboarding/agents", P);
            if (U?.success !== !0 || !U.component_id) throw new Error(U?.error || "Could not create your agent.");
            c.value = U.component_id;
          }
          const { data: O } = await Ke.get("/api/v1/agents/list");
          if (O?.success !== !0) throw new Error(O?.error || "Could not open your agent.");
          const y = O.agents.find((P) => P.name === `user_agent:${c.value}`);
          if (!y?.start_token) throw new Error("Your agent is created. Chat is unavailable; retry to open it.");
          t("navigate", { path: "/sessions", startToken: y.start_token });
        } catch (O) {
          d.value = f(O);
        } finally {
          u.value = !1;
        }
      }
    }
    return bn(D), (O, y) => (j(), R("div", cs, [
      w.value === "loading" ? (j(), R("p", ps, "Loading your choices…")) : w.value === "failed" ? (j(), R("div", hs, [
        C("p", fs, Te(d.value), 1),
        C("div", bs, [
          Z(J(ce), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            onClick: I
          }),
          Z(J(ce), {
            type: "button",
            label: "Retry",
            onClick: D
          })
        ])
      ])) : w.value === "model-setup" ? (j(), R("section", ms, [
        C("header", vs, [
          C("span", gs, [
            Z(J(At), { icon: "tabler:cpu" })
          ]),
          y[4] || (y[4] = C("h2", {
            id: "model-setup-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        y[5] || (y[5] = C("p", { class: "text" }, "Agents need a language model to respond, and none is connected to this workspace yet. Connect a model provider to continue, or ask an administrator if you do not manage models.", -1)),
        d.value ? (j(), R("p", ys, Te(d.value), 1)) : ie("", !0),
        C("div", _s, [
          Z(J(ce), {
            type: "button",
            "data-dismiss": "",
            label: "Cancel",
            severity: "secondary",
            onClick: I
          }),
          Z(J(ce), {
            type: "button",
            label: "Set up a model",
            onClick: G
          })
        ])
      ])) : w.value === "configuring" ? (j(), R("section", Ss, [
        C("header", $s, [
          C("span", ks, [
            Z(J(At), { icon: "tabler:cpu" })
          ]),
          y[6] || (y[6] = C("h2", {
            id: "model-config-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        (j(), pe(vn("kickside-onboard-models"), {
          class: "model-config",
          onDone: ot(Y, ["stop"]),
          onBack: y[0] || (y[0] = ot((P) => m.value = !1, ["stop"]))
        }, null, 32))
      ])) : (j(), R("form", {
        key: 4,
        class: "stack",
        "aria-labelledby": "create-agent-title",
        onSubmit: ot(ne, ["prevent"])
      }, [
        y[11] || (y[11] = C("h2", {
          id: "create-agent-title",
          class: "title"
        }, "Create your first agent", -1)),
        y[12] || (y[12] = C("p", { class: "intro" }, "Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.", -1)),
        C("fieldset", {
          disabled: u.value || !!c.value
        }, [
          C("div", ws, [
            C("div", Cs, [
              y[7] || (y[7] = C("label", { for: "first-agent-title" }, "Agent name", -1)),
              Z(J(Kn), {
                id: "first-agent-title",
                modelValue: o.value,
                "onUpdate:modelValue": y[1] || (y[1] = (P) => o.value = P),
                name: "title",
                autocomplete: "off",
                maxlength: "120",
                fluid: ""
              }, null, 8, ["modelValue"])
            ]),
            C("div", Ps, [
              y[8] || (y[8] = C("span", {
                id: "first-agent-model",
                class: "label"
              }, "Model", -1)),
              C("wc-model-picker", {
                value: r.value,
                capability: "generate",
                "aria-labelledby": "first-agent-model",
                onSelect: y[2] || (y[2] = (P) => r.value = P.detail)
              }, null, 40, Ts),
              b.value ? ie("", !0) : (j(), R("p", Os, "This workspace has no default model; choose one."))
            ])
          ]),
          C("div", As, [
            C("div", Es, [
              Z(J(qn), {
                modelValue: i.value,
                "onUpdate:modelValue": y[3] || (y[3] = (P) => i.value = P),
                "input-id": "first-agent-memory",
                binary: ""
              }, null, 8, ["modelValue"]),
              y[9] || (y[9] = C("label", { for: "first-agent-memory" }, "Personal memory", -1))
            ]),
            y[10] || (y[10] = C("p", { class: "hint" }, "Remember your preferences and useful details across conversations.", -1))
          ]),
          C("wc-agent-trait-picker", {
            value: JSON.stringify(l.value),
            "aria-label": "Agent capabilities",
            onChange: S
          }, null, 40, js)
        ], 8, xs),
        d.value ? (j(), R("p", Ls, Te(d.value), 1)) : ie("", !0),
        C("div", Ns, [
          Z(J(ce), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            disabled: u.value,
            onClick: I
          }, null, 8, ["disabled"]),
          Z(J(ce), {
            type: "submit",
            label: u.value ? "Creating…" : c.value ? "Open agent chat" : "Create agent",
            disabled: !$.value
          }, null, 8, ["label", "disabled"])
        ])
      ], 32))
    ]));
  }
}), Rs = ":host{display:block;min-width:0;color:var(--p-text-color)}.onboarding{box-sizing:border-box;width:100%;min-width:0}p{line-height:1.5;margin:0}.stack{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.status{color:var(--p-text-muted-color)}.hint{color:var(--p-text-muted-color);font-size:.8125rem}.intro{color:var(--p-text-muted-color)}fieldset{border:0;padding:0;margin:0;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.field-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.field{display:grid;gap:6px;min-width:0;align-content:start}.field label,.field .label{font-weight:700;font-size:13.5px}wc-model-picker{display:block;width:100%}wc-agent-trait-picker{display:block;min-width:0}.title{margin:0;padding-right:32px;font-family:var(--kx-font-heading);font-size:24px;font-weight:800;line-height:1.15;letter-spacing:-.6px;color:var(--p-text-color)}.head{display:flex;align-items:center;gap:12px;padding-right:32px}.head .title{padding-right:0}.head-icon{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:var(--kx-radius-10);background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);font-size:22px}.text{color:var(--p-text-muted-color)}.model-setup{display:grid;gap:12px}.model-setup .actions{margin-top:8px}.model-config{display:block;min-width:0}.error{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-600, var(--p-danger-500)) 8%,transparent);border-radius:var(--kx-radius-10);padding:12px}.actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}.memory-choice{display:flex;align-items:center;gap:8px}", Ms = { props: { type: "object", properties: {} } }, Ds = {
  wippy: Ms
};
class Zn extends cr {
  static get wippyConfig() {
    return { propsSchema: Ds.wippy.props, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: Rs };
  }
  static get vueConfig() {
    return { rootComponent: Vs, plugins: [ta] };
  }
}
async function Us() {
  return Zn;
}
Vo(import.meta.url, Zn);
export {
  Us as webComponent
};
