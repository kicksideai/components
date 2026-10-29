import { hasInjectionContext as En, inject as st, effectScope as An, ref as X, markRaw as jn, createApp as In, onMounted as Sr, onUnmounted as zn, watch as $e, readonly as Nn, getCurrentInstance as Vt, nextTick as Rn, reactive as Vn, renderSlot as D, openBlock as $, createBlock as ee, Teleport as $r, createCommentVNode as V, useId as Mn, mergeProps as S, resolveDirective as Pr, createElementBlock as E, createElementVNode as et, withDirectives as Or, resolveDynamicComponent as ht, normalizeClass as bt, toDisplayString as lt, resolveComponent as tt, withCtx as gt, createVNode as Dn, Transition as Bn, Fragment as Oe, renderList as Mt, createTextVNode as Cr, h as Un } from "vue";
import { addCollection as Hn } from "@iconify/vue";
import { config as Dt, addIcons as qn, on as Wn, applyThemeMode as Fe, host as Fn, hostCss as Kn, loadCss as Yn, api as B } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var vt = "data-wippy-visible";
function Bt(e) {
  const t = e.getAttribute(vt);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Gn = Object.defineProperty, Zn = (e, t, r) => t in e ? Gn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, L = (e, t, r) => Zn(e, typeof t != "symbol" ? t + "" : t, r), Jn = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Qn = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Ut(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Xn(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    if (r)
      for (const [n, o] of Object.entries(r)) {
        if ((n === "@light" || n === "@dark") && o && typeof o == "object") {
          for (const [s, l] of Object.entries(o)) {
            const i = typeof l == "string" ? Ut(s) : null;
            i && t.add(i);
          }
          continue;
        }
        const a = typeof o == "string" ? Ut(n) : null;
        a && t.add(a);
      }
  return [...t].sort();
}
function eo(e) {
  if (e.length === 0)
    return "";
  const t = e.map((r) => `  ${r}: inherit;`).join(`
`);
  return `${Qn} {
${t}
}`;
}
function to(e, t) {
  const r = eo(t);
  r && Tr(e, r, "@wippy-fe/css-variables-bridge");
}
function ro(e, t) {
  const n = (t ?? Jn).map(async (o) => {
    const a = Kn[o];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Yn(a);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${a}):`, s), null;
    }
  });
  return Promise.all(n).then((o) => {
    for (const a of o) {
      if (!a)
        continue;
      const s = document.createElement("style");
      s.textContent = a, s.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(s);
    }
  });
}
function no(e, t) {
  const r = document.createElement("style");
  r.textContent = t, e.appendChild(r);
}
function Tr(e, t, r) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const n = document.createElement("style");
  n.setAttribute("role", r), n.textContent = t, e.appendChild(n);
}
function oo(e, t) {
  Tr(e, t, "@wippy-fe/custom-css");
}
function Lr(e) {
  return e.__wippyHost ?? null;
}
function ao(e) {
  return e.replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function io(e, t, r) {
  switch (r.type) {
    case "string":
      return { value: t };
    case "number": {
      const n = Number.parseFloat(t);
      return Number.isNaN(n) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: n };
    }
    case "integer": {
      const n = Number.parseInt(t, 10);
      return Number.isNaN(n) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: n };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const n = JSON.parse(t);
        return r.type === "array" && !Array.isArray(n) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: n };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function ct(e, t) {
  const r = {}, n = [];
  for (const [o, a] of Object.entries(t.properties)) {
    const s = e.getAttribute(o), l = ao(o);
    if (s === null) {
      a.default !== void 0 && (r[l] = a.default);
      continue;
    }
    const i = io(o, s, a);
    i.error ? n.push(i.error) : r[l] = i.value;
  }
  return { props: r, errors: n };
}
var so = class {
  constructor(e, t) {
    L(this, "_props"), L(this, "_errors"), L(this, "_content"), L(this, "_hostVisibility"), L(this, "_propsListeners", /* @__PURE__ */ new Set()), L(this, "_contentListeners", /* @__PURE__ */ new Set()), L(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), L(this, "_disposed", !1), L(this, "_emitToDom"), L(this, "props"), L(this, "events"), L(this, "content"), L(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const r = this;
    this.props = {
      get value() {
        return r._props;
      },
      get errors() {
        return r._errors;
      },
      subscribe(n, o) {
        return r._subscribeProps(n, o);
      }
    }, this.events = {
      emit(n, o) {
        r._disposed || r._emitToDom(n, o);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return r._content;
      },
      subscribe(n, o) {
        return r._subscribeContent(n, o);
      }
    } : null, this.hostVisibility = {
      get value() {
        return r._hostVisibility;
      },
      subscribe(n, o) {
        return r._subscribeHostVisibility(n, o);
      }
    };
  }
  /** @internal */
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const r of this._propsListeners)
        r(e, t);
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
      for (const r of this._hostVisibilityListeners)
        r(e, t);
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
    const r = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const r = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const r = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", r);
    };
    return t?.signal?.addEventListener("abort", r, { once: !0 }), r;
  }
}, lo = class extends HTMLElement {
  constructor() {
    super(), L(this, "_internals"), L(this, "_contentObserver", null), L(this, "_initialized", !1), L(this, "_container", null), L(this, "_reactive", null), L(this, "_lastProps", null), L(this, "_lastErrors", []), L(this, "_lastContent", null), L(this, "_themeUnsub", null), L(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = Bt(this);
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), r = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...r, vt])];
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
    return Lr(this);
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
      let r, n;
      if (this._lastProps !== null)
        r = this._lastProps, n = this._lastErrors;
      else {
        const a = ct(this, e.propsSchema);
        e.validateProps && a.errors.push(...e.validateProps(a.props)), r = a.props, n = a.errors, this._lastProps = r, this._lastErrors = n;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new so(
        { props: r, errors: n, content: o, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, r = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let n;
      if (t)
        n = this._container;
      else {
        this.onInit(r), e.inlineCss && no(r, e.inlineCss);
        try {
          const d = Dt?.theming, c = Xn(
            d?.global?.cssVariables,
            d?.children?.cssVariables
          );
          to(r, c);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const d = Dt?.theming, c = [d?.global?.customCSS, d?.children?.customCSS].filter(Boolean).join(`
`);
            c && oo(r, c);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && ro(r, e.hostCssKeys), n = document.createElement("div"), n.setAttribute("data-wippy-theme-root", "");
        const i = e.containerClasses ?? [];
        i.length > 0 && n.classList.add(...i), r.appendChild(n), this._container = n, qn(Hn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Wn("@theme", (i) => this._applyTheme(i)));
      const { props: o, errors: a } = ct(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(o));
      const s = o;
      this._lastProps = s, this._lastErrors = a;
      let l = null;
      e.contentTemplate && (l = this._extractContent(e.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(e.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, n, s, a, l, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Fn.getThemeMode?.()) {
    Fe(e, this), this._container && Fe(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Fe("auto", this), this._container && Fe("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, r) {
    if (t === r)
      return;
    if (e === vt) {
      const l = this._hostVisible, i = Bt(this);
      if (i === l)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, l), this.onHostVisibilityChanged(i, l));
      return;
    }
    const n = this.constructor.wippyConfig, { props: o, errors: a } = ct(this, n.propsSchema);
    n.validateProps && a.push(...n.validateProps(o));
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
function co(e) {
  return e.__wippyHostBus ?? null;
}
function po(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.1.0
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let Er;
const Ar = (e) => Er = e, uo = () => En() && st(jr) || Er, jr = (
  /* istanbul ignore next */
  Symbol()
);
function mo() {
  const e = An(!0), t = e.run(() => X({}));
  let r = [], n = [];
  const o = jn({
    install(a) {
      Ar(o), o._a = a, a.provide(jr, o), a.config.globalProperties.$pinia = o, n.forEach((s) => r.push(s)), n = [];
    },
    use(a) {
      return this._a ? r.push(a) : n.push(a), this;
    },
    _p: r,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var fo = Object.defineProperty, ho = (e, t, r) => t in e ? fo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, ke = (e, t, r) => ho(e, typeof t != "symbol" ? t + "" : t, r), Ir = /* @__PURE__ */ Symbol("wippy:emit"), zr = /* @__PURE__ */ Symbol("wippy:props"), bo = /* @__PURE__ */ Symbol("wippy:props_error"), go = /* @__PURE__ */ Symbol("wippy:content"), vo = /* @__PURE__ */ Symbol("wippy:panel-id"), yo = /* @__PURE__ */ Symbol("wippy:layout-bus"), xo = /* @__PURE__ */ Symbol("wippy:host"), Nr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Cs() {
  const e = st(zr);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function Ts() {
  const e = st(Ir);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function wo() {
  const e = st(Nr);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Ls(e) {
  const t = wo();
  let r = !1, n = null, o = !1;
  function a() {
    if (n)
      return o = !0, n;
    let s;
    try {
      s = Promise.resolve(e());
    } catch (i) {
      s = Promise.reject(i);
    }
    const l = s.finally(() => {
      if (n === l && (n = null, r && o))
        return o = !1, a();
    });
    return n = l, l;
  }
  return Sr(() => (r = !0, a())), zn(() => {
    r = !1, o = !1;
  }), $e(t, (s, l) => {
    if (r && l === !1 && s === !0)
      return a();
  }), t;
}
var ko = class extends lo {
  constructor() {
    super(...arguments), ke(this, "_vueApp", null), ke(this, "_propsRef", X({})), ke(this, "_errorsRef", X([])), ke(this, "_contentRef", X(null)), ke(this, "_hostVisibilityRef", X(null)), ke(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, r, n, o, a) {
    const s = this.constructor.vueConfig;
    this._propsRef.value = r, this._errorsRef.value = n, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const d of n)
      this.emitEvent("invalid", { message: d });
    const l = new AbortController();
    this._bridgeAbort = l, this.reactive.props.subscribe((d, c) => {
      this._propsRef.value = d, this._errorsRef.value = [...c];
      for (const p of c)
        this.emitEvent("invalid", { message: p });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((d) => {
      this._contentRef.value = d;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((d) => {
      this._hostVisibilityRef.value = d;
    }, { signal: l.signal });
    const i = (d) => {
      if (l.signal.aborted)
        return;
      const c = uo(), p = In(d.rootComponent);
      this._vueApp = p;
      const u = mo();
      if (d.piniaPlugins)
        for (const m of d.piniaPlugins)
          u.use(m);
      if (p.use(u), d.plugins)
        for (const m of d.plugins)
          p.use(m);
      p.provide(zr, this._propsRef), p.provide(bo, this._errorsRef), p.provide(Ir, this.emitEvent.bind(this)), p.provide(go, this._contentRef), p.provide(Nr, this._hostVisibilityRef), p.provide(vo, po(this)), p.provide(yo, co(this)), p.provide(xo, Lr(this)), d.providers && d.providers(p, this), p.mount(t), c && Ar(c);
    };
    if (s.rootComponent)
      i(s);
    else if (s.lazyConfig) {
      const d = document.createElement("wippy-loading");
      d.setAttribute("no-bg", ""), t.appendChild(d), s.lazyConfig().then((c) => {
        l.signal.aborted || (d.remove(), i(c));
      }).catch((c) => {
        if (l.signal.aborted)
          return;
        const p = c instanceof Error ? c.message : String(c), u = document.createElement("wippy-error");
        u.setAttribute("title", "Failed to load"), u.setAttribute("message", p), d.replaceWith(u), this.emitEvent("error", { message: p });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, _o = Object.defineProperty, Ht = Object.getOwnPropertySymbols, So = Object.prototype.hasOwnProperty, $o = Object.prototype.propertyIsEnumerable, qt = (e, t, r) => t in e ? _o(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, Po = (e, t) => {
  for (var r in t || (t = {})) So.call(t, r) && qt(e, r, t[r]);
  if (Ht) for (var r of Ht(t)) $o.call(t, r) && qt(e, r, t[r]);
  return e;
};
function be(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Lt(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function T(e) {
  return !be(e);
}
function Y(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Rr(e = {}, t = {}) {
  let r = Po({}, e);
  return Object.keys(t).forEach((n) => {
    let o = n;
    Y(t[o]) && o in e && Y(e[o]) ? r[o] = Rr(e[o], t[o]) : r[o] = t[o];
  }), r;
}
function Oo(...e) {
  return e.reduce((t, r, n) => n === 0 ? r : Rr(t, r), {});
}
function N(e, ...t) {
  return Lt(e) ? e(...t) : e;
}
function R(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function K(e) {
  return R(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function Et(e, t = "", r = {}) {
  let n = K(t).split("."), o = n.shift();
  if (o) {
    if (Y(e)) {
      let a = Object.keys(e).find((s) => K(s) === o) || "";
      return Et(N(e[a], r), n.join("."), r);
    }
    return;
  }
  return N(e, r);
}
function Vr(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function Co(e) {
  return T(e) && !isNaN(e);
}
function me(e, t) {
  if (t) {
    let r = t.test(e);
    return t.lastIndex = 0, r;
  }
  return !1;
}
function To(...e) {
  return Oo(...e);
}
function Ee(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Lo(e) {
  return R(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Mr(e) {
  return R(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function At() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, r) {
    let n = e.get(t);
    return n ? n.push(r) : n = [r], e.set(t, n), this;
  }, off(t, r) {
    let n = e.get(t);
    return n && n.splice(n.indexOf(r) >>> 0, 1), this;
  }, emit(t, r) {
    let n = e.get(t);
    n && n.forEach((o) => {
      o(r);
    });
  }, clear() {
    e.clear();
  } };
}
function fe(...e) {
  if (e) {
    let t = [];
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      if (!n) continue;
      let o = typeof n;
      if (o === "string" || o === "number") t.push(n);
      else if (o === "object") {
        let a = Array.isArray(n) ? [fe(...n)] : Object.entries(n).map(([s, l]) => l ? s : void 0);
        t = a.length ? t.concat(a.filter((s) => !!s)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function Eo(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Ao(e, t) {
  if (e && t) {
    let r = (n) => {
      Eo(e, n) || (e.classList ? e.classList.add(n) : e.className += " " + n);
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function pt(e, t) {
  if (e && t) {
    let r = (n) => {
      e.classList ? e.classList.remove(n) : e.className = e.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function Wt(e) {
  for (let t of document?.styleSheets) try {
    for (let r of t?.cssRules) for (let n of r?.style) if (e.test(n)) return { name: n, value: r.style.getPropertyValue(n).trim() };
  } catch {
  }
  return null;
}
function jo(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [r, n] = [e.style.visibility, e.style.display], o = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = o.width || e.offsetWidth, t.height = o.height || e.offsetHeight, e.style.display = n, e.style.visibility = r;
  }
  return t;
}
function Io() {
  let e = window, t = document, r = t.documentElement, n = t.getElementsByTagName("body")[0], o = e.innerWidth || r.clientWidth || n.clientWidth, a = e.innerHeight || r.clientHeight || n.clientHeight;
  return { width: o, height: a };
}
function yt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function zo() {
  let e = document.documentElement;
  return (window.pageXOffset || yt(e)) - (e.clientLeft || 0);
}
function No() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function Ro(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function Vo(e, t, r = !0) {
  var n, o, a, s;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : jo(e), i = l.height, d = l.width, c = t.offsetHeight, p = t.offsetWidth, u = t.getBoundingClientRect(), m = No(), f = zo(), g = Io(), b, v, x = "top";
    u.top + c + i > g.height ? (b = u.top + m - i, x = "bottom", b < 0 && (b = m)) : b = c + u.top + m, u.left + d > g.width ? v = Math.max(0, u.left + f + p - d) : v = u.left + f, Ro(e) ? e.style.insetInlineEnd = v + "px" : e.style.insetInlineStart = v + "px", e.style.top = b + "px", e.style.transformOrigin = x, r && (e.style.marginTop = x === "bottom" ? `calc(${(o = (n = Wt(/-anchor-gutter$/)) == null ? void 0 : n.value) != null ? o : "2px"} * -1)` : (s = (a = Wt(/-anchor-gutter$/)) == null ? void 0 : a.value) != null ? s : "");
  }
}
function Mo(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([r, n]) => e.style[r] = n));
}
function Xe(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Dr(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Do(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Dr(e));
}
function ge(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function rt(e, t = {}) {
  if (ge(e)) {
    let r = (n, o) => {
      var a, s;
      let l = (a = e?.$attrs) != null && a[n] ? [(s = e?.$attrs) == null ? void 0 : s[n]] : [];
      return [o].flat().reduce((i, d) => {
        if (d != null) {
          let c = typeof d;
          if (c === "string" || c === "number") i.push(d);
          else if (c === "object") {
            let p = Array.isArray(d) ? r(n, d) : Object.entries(d).map(([u, m]) => n === "style" && (m || m === 0) ? `${u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${m}` : m ? u : void 0);
            i = p.length ? i.concat(p.filter((u) => !!u)) : i;
          }
        }
        return i;
      }, l);
    };
    Object.entries(t).forEach(([n, o]) => {
      if (o != null) {
        let a = n.match(/^on(.+)/);
        a ? e.addEventListener(a[1].toLowerCase(), o) : n === "p-bind" || n === "pBind" ? rt(e, o) : (o = n === "class" ? [...new Set(r("class", o))].join(" ").trim() : n === "style" ? r("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[n] = o), e.setAttribute(n, o));
      }
    });
  }
}
function Bo(e, t = {}, ...r) {
  {
    let n = document.createElement(e);
    return rt(n, t), n.append(...r), n;
  }
}
function Te(e, t) {
  return ge(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function nt(e, t) {
  return ge(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Ke(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function Uo(e, t) {
  if (ge(e)) {
    let r = e.getAttribute(t);
    return isNaN(r) ? r === "true" || r === "false" ? r === "true" : r : +r;
  }
}
function Br(e, t = "") {
  let r = Te(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), n = [];
  for (let o of r) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && n.push(o);
  return n;
}
function Es(e, t) {
  let r = Br(e, t);
  return r.length > 0 ? r[0] : null;
}
function Ft(e) {
  if (e) {
    let t = e.offsetHeight, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingTop) + parseFloat(r.paddingBottom) + parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth), t;
  }
  return 0;
}
function As(e, t) {
  let r = Br(e, t);
  return r.length > 0 ? r[r.length - 1] : null;
}
function Ho(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || yt(document.documentElement) || yt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function qo(e, t) {
  return e ? e.offsetHeight : 0;
}
function Ur(e, t = []) {
  let r = Dr(e);
  return r === null ? t : Ur(r, t.concat([r]));
}
function Wo(e) {
  let t = [];
  if (e) {
    let r = Ur(e), n = /(auto|scroll)/, o = (a) => {
      try {
        let s = window.getComputedStyle(a, null);
        return n.test(s.getPropertyValue("overflow")) || n.test(s.getPropertyValue("overflowX")) || n.test(s.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let a of r) {
      let s = a.nodeType === 1 && a.dataset.scrollselectors;
      if (s) {
        let l = s.split(",");
        for (let i of l) {
          let d = nt(a, i);
          d && o(d) && t.push(d);
        }
      }
      a.nodeType !== 9 && o(a) && t.push(a);
    }
  }
  return t;
}
function Kt(e) {
  if (e) {
    let t = e.offsetWidth, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingLeft) + parseFloat(r.paddingRight) + parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), t;
  }
  return 0;
}
function Hr() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function js(e, t = "") {
  return ge(e) ? e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`) : !1;
}
function Fo() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Ko(e, t = "", r) {
  ge(e) && r !== null && r !== void 0 && e.setAttribute(t, r);
}
var Ye = {};
function Yo(e = "pui_id_") {
  return Object.hasOwn(Ye, e) || (Ye[e] = 0), Ye[e]++, `${e}${Ye[e]}`;
}
function Go() {
  let e = [], t = (s, l, i = 999) => {
    let d = o(s, l, i), c = d.value + (d.key === s ? 0 : i) + 1;
    return e.push({ key: s, value: c }), c;
  }, r = (s) => {
    e = e.filter((l) => l.value !== s);
  }, n = (s, l) => o(s).value, o = (s, l, i = 0) => [...e].reverse().find((d) => !0) || { key: s, value: i }, a = (s) => s && parseInt(s.style.zIndex, 10) || 0;
  return { get: a, set: (s, l, i) => {
    l && (l.style.zIndex = String(t(s, !0, i)));
  }, clear: (s) => {
    s && (r(a(s)), s.style.zIndex = "");
  }, getCurrent: (s) => n(s) };
}
var ut = Go(), Zo = Object.defineProperty, Jo = Object.defineProperties, Qo = Object.getOwnPropertyDescriptors, ot = Object.getOwnPropertySymbols, qr = Object.prototype.hasOwnProperty, Wr = Object.prototype.propertyIsEnumerable, Yt = (e, t, r) => t in e ? Zo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, q = (e, t) => {
  for (var r in t || (t = {})) qr.call(t, r) && Yt(e, r, t[r]);
  if (ot) for (var r of ot(t)) Wr.call(t, r) && Yt(e, r, t[r]);
  return e;
}, mt = (e, t) => Jo(e, Qo(t)), Z = (e, t) => {
  var r = {};
  for (var n in e) qr.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && ot) for (var n of ot(e)) t.indexOf(n) < 0 && Wr.call(e, n) && (r[n] = e[n]);
  return r;
}, Xo = At(), j = Xo, Ae = /{([^}]*)}/g, Fr = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Kr = /var\([^)]+\)/g;
function Gt(e) {
  return R(e) ? e.replace(/[A-Z]/g, (t, r) => r === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function ea(e) {
  return Y(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function ta(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function xt(e = "", t = "") {
  return ta(`${R(e, !1) && R(t, !1) ? `${e}-` : e}${t}`);
}
function Yr(e = "", t = "") {
  return `--${xt(e, t)}`;
}
function ra(e = "") {
  let t = (e.match(/{/g) || []).length, r = (e.match(/}/g) || []).length;
  return (t + r) % 2 !== 0;
}
function Gr(e, t = "", r = "", n = [], o) {
  if (R(e)) {
    let a = e.trim();
    if (ra(a)) return;
    if (me(a, Ae)) {
      let s = a.replaceAll(Ae, (l) => {
        let i = l.replace(/{|}/g, "").split(".").filter((d) => !n.some((c) => me(d, c)));
        return `var(${Yr(r, Mr(i.join("-")))}${T(o) ? `, ${o}` : ""})`;
      });
      return me(s.replace(Kr, "0"), Fr) ? `calc(${s})` : s;
    }
    return a;
  } else if (Co(e)) return e;
}
function na(e, t, r) {
  R(t, !1) && e.push(`${t}:${r};`);
}
function _e(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Zr(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function r(s, l) {
    let i = [], d = 0, c = "", p = null, u = 0;
    for (; d <= s.length; ) {
      let m = s[d];
      if ((m === '"' || m === "'" || m === "`") && s[d - 1] !== "\\" && (p = p === m ? null : m), !p && (m === "(" && u++, m === ")" && u--, (m === "," || d === s.length) && u === 0)) {
        let f = c.trim();
        f.startsWith("dt(") ? i.push(Zr(f, l)) : i.push(n(f)), c = "", d++;
        continue;
      }
      m !== void 0 && (c += m), d++;
    }
    return i;
  }
  function n(s) {
    let l = s[0];
    if ((l === '"' || l === "'" || l === "`") && s[s.length - 1] === l) return s.slice(1, -1);
    let i = Number(s);
    return isNaN(i) ? s : i;
  }
  let o = [], a = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") a.push(s), s += 2;
  else if (e[s] === ")" && a.length > 0) {
    let l = a.pop();
    a.length === 0 && o.push([l, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [l, i] = o[s], d = e.slice(l + 3, i), c = r(d, t), p = t(...c);
    e = e.slice(0, l) + p + e.slice(i + 1);
  }
  return e;
}
var he = (...e) => oa(P.getTheme(), ...e), oa = (e = {}, t, r, n) => {
  if (t) {
    let { variable: o, options: a } = P.defaults || {}, { prefix: s, transform: l } = e?.options || a || {}, i = me(t, Ae) ? t : `{${t}}`;
    return n === "value" || be(n) && l === "strict" ? P.getTokenValue(t) : Gr(i, void 0, s, [o.excludedKeyRegex], r);
  }
  return "";
};
function Ge(e, ...t) {
  if (e instanceof Array) {
    let r = e.reduce((n, o, a) => {
      var s;
      return n + o + ((s = N(t[a], { dt: he })) != null ? s : "");
    }, "");
    return Zr(r, he);
  }
  return N(e, { dt: he });
}
function aa(e, t = {}) {
  let r = P.defaults.variable, { prefix: n = r.prefix, selector: o = r.selector, excludedKeyRegex: a = r.excludedKeyRegex } = t, s = [], l = [], i = [{ node: e, path: n }];
  for (; i.length; ) {
    let { node: c, path: p } = i.pop();
    for (let u in c) {
      let m = c[u], f = ea(m), g = me(u, a) ? xt(p) : xt(p, Mr(u));
      if (Y(f)) i.push({ node: f, path: g });
      else {
        let b = Yr(g), v = Gr(f, g, n, [a]);
        na(l, b, v);
        let x = g;
        n && x.startsWith(n + "-") && (x = x.slice(n.length + 1)), s.push(x.replace(/-/g, "."));
      }
    }
  }
  let d = l.join("");
  return { value: l, tokens: s, declarations: d, css: _e(o, d) };
}
var U = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
  let t = Object.keys(this.rules).filter((r) => r !== "custom").map((r) => this.rules[r]);
  return [e].flat().map((r) => {
    var n;
    return (n = t.map((o) => o.resolve(r)).find((o) => o.matched)) != null ? n : this.rules.custom.resolve(r);
  });
} }, _toVariables(e, t) {
  return aa(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var a, s, l, i, d, c, p;
  let { preset: u, options: m } = t, f, g, b, v, x, O, h;
  if (T(u) && m.transform !== "strict") {
    let { primitive: w, semantic: A, extend: M } = u, te = A || {}, { colorScheme: re } = te, se = Z(te, ["colorScheme"]), ne = M || {}, { colorScheme: le } = ne, de = Z(ne, ["colorScheme"]), oe = re || {}, { dark: ce } = oe, ve = Z(oe, ["dark"]), pe = le || {}, { dark: ye } = pe, xe = Z(pe, ["dark"]), G = T(w) ? this._toVariables({ primitive: w }, m) : {}, W = T(se) ? this._toVariables({ semantic: se }, m) : {}, ue = T(ve) ? this._toVariables({ light: ve }, m) : {}, We = T(ce) ? this._toVariables({ dark: ce }, m) : {}, we = T(de) ? this._toVariables({ semantic: de }, m) : {}, Nt = T(xe) ? this._toVariables({ light: xe }, m) : {}, Rt = T(ye) ? this._toVariables({ dark: ye }, m) : {}, [mn, fn] = [(a = G.declarations) != null ? a : "", G.tokens], [hn, bn] = [(s = W.declarations) != null ? s : "", W.tokens || []], [gn, vn] = [(l = ue.declarations) != null ? l : "", ue.tokens || []], [yn, xn] = [(i = We.declarations) != null ? i : "", We.tokens || []], [wn, kn] = [(d = we.declarations) != null ? d : "", we.tokens || []], [_n, Sn] = [(c = Nt.declarations) != null ? c : "", Nt.tokens || []], [$n, Pn] = [(p = Rt.declarations) != null ? p : "", Rt.tokens || []];
    f = this.transformCSS(e, mn, "light", "variable", m, n, o), g = fn;
    let On = this.transformCSS(e, `${hn}${gn}`, "light", "variable", m, n, o), Cn = this.transformCSS(e, `${yn}`, "dark", "variable", m, n, o);
    b = `${On}${Cn}`, v = [.../* @__PURE__ */ new Set([...bn, ...vn, ...xn])];
    let Tn = this.transformCSS(e, `${wn}${_n}color-scheme:light`, "light", "variable", m, n, o), Ln = this.transformCSS(e, `${$n}color-scheme:dark`, "dark", "variable", m, n, o);
    x = `${Tn}${Ln}`, O = [.../* @__PURE__ */ new Set([...kn, ...Sn, ...Pn])], h = N(u.css, { dt: he });
  }
  return { primitive: { css: f, tokens: g }, semantic: { css: b, tokens: v }, global: { css: x, tokens: O }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: r, params: n, set: o, defaults: a, selector: s }) {
  var l, i, d;
  let c, p, u;
  if (T(t) && r.transform !== "strict") {
    let m = e.replace("-directive", ""), f = t, { colorScheme: g, extend: b, css: v } = f, x = Z(f, ["colorScheme", "extend", "css"]), O = b || {}, { colorScheme: h } = O, w = Z(O, ["colorScheme"]), A = g || {}, { dark: M } = A, te = Z(A, ["dark"]), re = h || {}, { dark: se } = re, ne = Z(re, ["dark"]), le = T(x) ? this._toVariables({ [m]: q(q({}, x), w) }, r) : {}, de = T(te) ? this._toVariables({ [m]: q(q({}, te), ne) }, r) : {}, oe = T(M) ? this._toVariables({ [m]: q(q({}, M), se) }, r) : {}, [ce, ve] = [(l = le.declarations) != null ? l : "", le.tokens || []], [pe, ye] = [(i = de.declarations) != null ? i : "", de.tokens || []], [xe, G] = [(d = oe.declarations) != null ? d : "", oe.tokens || []], W = this.transformCSS(m, `${ce}${pe}`, "light", "variable", r, o, a, s), ue = this.transformCSS(m, xe, "dark", "variable", r, o, a, s);
    c = `${W}${ue}`, p = [.../* @__PURE__ */ new Set([...ve, ...ye, ...G])], u = N(v, { dt: he });
  }
  return { css: c, tokens: p, style: u };
}, getPresetC({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var a;
  let { preset: s, options: l } = t, i = (a = s?.components) == null ? void 0 : a[e];
  return this.getPreset({ name: e, preset: i, options: l, params: r, set: n, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var a, s;
  let l = e.replace("-directive", ""), { preset: i, options: d } = t, c = ((a = i?.components) == null ? void 0 : a[l]) || ((s = i?.directives) == null ? void 0 : s[l]);
  return this.getPreset({ name: l, preset: c, options: d, params: r, set: n, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var r;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (r = e.darkModeSelector) != null ? r : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, r, n) {
  let { cssLayer: o } = t;
  return o ? `@layer ${N(o.order || o.name || "primeui", r)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: a }) {
  let s = this.getCommon({ name: e, theme: t, params: r, set: o, defaults: a }), l = Object.entries(n).reduce((i, [d, c]) => i.push(`${d}="${c}"`) && i, []).join(" ");
  return Object.entries(s || {}).reduce((i, [d, c]) => {
    if (Y(c) && Object.hasOwn(c, "css")) {
      let p = Ee(c.css), u = `${d}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${u}" ${l}>${p}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: a }) {
  var s;
  let l = { name: e, theme: t, params: r, set: o, defaults: a }, i = (s = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : s.css, d = Object.entries(n).reduce((c, [p, u]) => c.push(`${p}="${u}"`) && c, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${d}>${Ee(i)}</style>` : "";
}, createTokens(e = {}, t, r = "", n = "", o = {}) {
  let a = function(l, i = {}, d = []) {
    if (d.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: i, value: void 0 };
    d.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let c = this.value;
    if (typeof this.value == "string" && Ae.test(this.value)) {
      let p = this.value.trim().replace(Ae, (u) => {
        var m;
        let f = u.slice(1, -1), g = this.tokens[f];
        if (!g) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let b = g.computed(l, i, d);
        return Array.isArray(b) && b.length === 2 ? `light-dark(${b[0].value},${b[1].value})` : (m = b?.value) != null ? m : "__UNRESOLVED__";
      });
      c = Fr.test(p.replace(Kr, "0")) ? `calc(${p})` : p;
    }
    return be(i.binding) && delete i.binding, d.pop(), { colorScheme: l, path: this.path, paths: i, value: c.includes("__UNRESOLVED__") ? void 0 : c };
  }, s = (l, i, d) => {
    Object.entries(l).forEach(([c, p]) => {
      let u = me(c, t.variable.excludedKeyRegex) ? i : i ? `${i}.${Gt(c)}` : Gt(c), m = d ? `${d}.${c}` : c;
      Y(p) ? s(p, u, m) : (o[u] || (o[u] = { paths: [], computed: (f, g = {}, b = []) => {
        if (o[u].paths.length === 1) return o[u].paths[0].computed(o[u].paths[0].scheme, g.binding, b);
        if (f && f !== "none") for (let v = 0; v < o[u].paths.length; v++) {
          let x = o[u].paths[v];
          if (x.scheme === f) return x.computed(f, g.binding, b);
        }
        return o[u].paths.map((v) => v.computed(v.scheme, g[v.scheme], b));
      } }), o[u].paths.push({ path: m, value: p, scheme: m.includes("colorScheme.light") ? "light" : m.includes("colorScheme.dark") ? "dark" : "none", computed: a, tokens: o }));
    });
  };
  return s(e, r, n), o;
}, getTokenValue(e, t, r) {
  var n;
  let o = ((l) => l.split(".").filter((i) => !me(i.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t), a = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(n = e[o]) == null ? void 0 : n.computed(a)].flat().filter((l) => l);
  return s.length === 1 ? s[0].value : s.reduce((l = {}, i) => {
    let d = i, { colorScheme: c } = d, p = Z(d, ["colorScheme"]);
    return l[c] = p, l;
  }, void 0);
}, getSelectorRule(e, t, r, n) {
  return r === "class" || r === "attr" ? _e(T(t) ? `${e}${t},${e} ${t}` : e, n) : _e(e, _e(t ?? ":root,:host", n));
}, transformCSS(e, t, r, n, o = {}, a, s, l) {
  if (T(t)) {
    let { cssLayer: i } = o;
    if (n !== "style") {
      let d = this.getColorSchemeOption(o, s);
      t = r === "dark" ? d.reduce((c, { type: p, selector: u }) => (T(u) && (c += u.includes("[CSS]") ? u.replace("[CSS]", t) : this.getSelectorRule(u, l, p, t)), c), "") : _e(l ?? ":root,:host", t);
    }
    if (i) {
      let d = { name: "primeui" };
      Y(i) && (d.name = N(i.name, { name: e, type: n })), T(d.name) && (t = _e(`@layer ${d.name}`, t), a?.layerNames(d.name));
    }
    return t;
  }
  return "";
} }, P = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = mt(q({}, t), { options: q(q({}, this.defaults.options), t.options) }), this._tokens = U.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), j.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = mt(q({}, this.theme), { preset: e }), this._tokens = U.createTokens(e, this.defaults), this.clearLoadedStyleNames(), j.emit("preset:change", e), j.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = mt(q({}, this.theme), { options: e }), this.clearLoadedStyleNames(), j.emit("options:change", e), j.emit("theme:change", this.theme);
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
  return U.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return U.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return U.getPresetC(r);
}, getDirective(e = "", t) {
  let r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return U.getPresetD(r);
}, getCustomPreset(e = "", t, r, n) {
  let o = { name: e, preset: t, options: this.options, selector: r, params: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return U.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return U.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, r = "style", n) {
  return U.transformCSS(e, t, n, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, r = {}) {
  return U.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, r = {}) {
  return U.getStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), j.emit(`theme:${t}:load`, e), !this._loadingStyles.size && j.emit("theme:load"));
} }, I = {
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
}, ia = `
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
function je(e) {
  "@babel/helpers - typeof";
  return je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, je(e);
}
function Zt(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Jt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zt(Object(r), !0).forEach(function(n) {
      sa(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zt(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function sa(e, t, r) {
  return (t = la(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function la(e) {
  var t = da(e, "string");
  return je(t) == "symbol" ? t : t + "";
}
function da(e, t) {
  if (je(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (je(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ca(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Vt() && Vt().components ? Sr(e) : t ? e() : Rn(e);
}
var pa = 0;
function ua(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = X(!1), n = X(e), o = X(null), a = Hr() ? window.document : void 0, s = t.document, l = s === void 0 ? a : s, i = t.immediate, d = i === void 0 ? !0 : i, c = t.manual, p = c === void 0 ? !1 : c, u = t.name, m = u === void 0 ? "style_".concat(++pa) : u, f = t.id, g = f === void 0 ? void 0 : f, b = t.media, v = b === void 0 ? void 0 : b, x = t.nonce, O = x === void 0 ? void 0 : x, h = t.first, w = h === void 0 ? !1 : h, A = t.onMounted, M = A === void 0 ? void 0 : A, te = t.onUpdated, re = te === void 0 ? void 0 : te, se = t.onLoad, ne = se === void 0 ? void 0 : se, le = t.props, de = le === void 0 ? {} : le, oe = function() {
  }, ce = function(ye) {
    var xe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var G = Jt(Jt({}, de), xe), W = G.name || m, ue = G.id || g, We = G.nonce || O;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(W, '"]')) || l.getElementById(ue) || l.createElement("style"), o.value.isConnected || (n.value = ye || e, rt(o.value, {
        type: "text/css",
        id: ue,
        media: v,
        nonce: We
      }), w ? l.head.prepend(o.value) : l.head.appendChild(o.value), Ko(o.value, "data-primevue-style-id", W), rt(o.value, G), o.value.onload = function(we) {
        return ne?.(we, {
          name: W
        });
      }, M?.(W)), !r.value && (oe = $e(n, function(we) {
        o.value.textContent = we, re?.(W);
      }, {
        immediate: !0
      }), r.value = !0);
    }
  }, ve = function() {
    !l || !r.value || (oe(), Do(o.value) && l.head.removeChild(o.value), r.value = !1, o.value = null);
  };
  return d && !p && ca(ce), {
    id: g,
    name: m,
    el: o,
    css: n,
    unload: ve,
    load: ce,
    isLoaded: Nn(r)
  };
}
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
var Qt, Xt, er, tr;
function rr(e, t) {
  return ba(e) || ha(e, t) || fa(e, t) || ma();
}
function ma() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fa(e, t) {
  if (e) {
    if (typeof e == "string") return nr(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? nr(e, t) : void 0;
  }
}
function nr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ha(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, l = [], i = !0, d = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(i = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function ba(e) {
  if (Array.isArray(e)) return e;
}
function or(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ft(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? or(Object(r), !0).forEach(function(n) {
      ga(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : or(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ga(e, t, r) {
  return (t = va(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function va(e) {
  var t = ya(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function ya(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ie(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ze(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var xa = function(t) {
  var r = t.dt;
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
    padding-right: `.concat(r("scrollbar.width"), `;
}
`);
}, wa = {}, ka = {}, C = {
  name: "base",
  css: xa,
  style: ia,
  classes: wa,
  inlineStyles: ka,
  load: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, o = n(Ge(Qt || (Qt = Ze(["", ""])), t));
    return T(o) ? ua(Ee(o), ft({
      name: this.name
    }, r)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, r, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return P.transformCSS(r.name || t.name, "".concat(o).concat(Ge(Xt || (Xt = Ze(["", ""])), n)));
    });
  },
  getCommonTheme: function(t) {
    return P.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return P.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return P.getDirective(this.name, t);
  },
  getPresetTheme: function(t, r, n) {
    return P.getCustomPreset(this.name, t, r, n);
  },
  getLayerOrderThemeCSS: function() {
    return P.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var n = N(this.css, {
        dt: he
      }) || "", o = Ee(Ge(er || (er = Ze(["", "", ""])), n, t)), a = Object.entries(r).reduce(function(s, l) {
        var i = rr(l, 2), d = i[0], c = i[1];
        return s.push("".concat(d, '="').concat(c, '"')) && s;
      }, []).join(" ");
      return T(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return P.getCommonStyleSheet(this.name, t, r);
  },
  getThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [P.getStyleSheet(this.name, t, r)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = Ge(tr || (tr = Ze(["", ""])), N(this.style, {
        dt: he
      })), s = Ee(P.transformCSS(o, a)), l = Object.entries(r).reduce(function(i, d) {
        var c = rr(d, 2), p = c[0], u = c[1];
        return i.push("".concat(p, '="').concat(u, '"')) && i;
      }, []).join(" ");
      T(s) && n.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(s, "</style>"));
    }
    return n.join("");
  },
  extend: function(t) {
    return ft(ft({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, ie = At();
function ze(e) {
  "@babel/helpers - typeof";
  return ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ze(e);
}
function ar(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Je(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ar(Object(r), !0).forEach(function(n) {
      _a(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ar(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _a(e, t, r) {
  return (t = Sa(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Sa(e) {
  var t = $a(e, "string");
  return ze(t) == "symbol" ? t : t + "";
}
function $a(e, t) {
  if (ze(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ze(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Pa = {
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
    text: [I.STARTS_WITH, I.CONTAINS, I.NOT_CONTAINS, I.ENDS_WITH, I.EQUALS, I.NOT_EQUALS],
    numeric: [I.EQUALS, I.NOT_EQUALS, I.LESS_THAN, I.LESS_THAN_OR_EQUAL_TO, I.GREATER_THAN, I.GREATER_THAN_OR_EQUAL_TO],
    date: [I.DATE_IS, I.DATE_IS_NOT, I.DATE_BEFORE, I.DATE_AFTER]
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
}, Oa = Symbol();
function Ca(e, t) {
  var r = {
    config: Vn(t)
  };
  return e.config.globalProperties.$primevue = r, e.provide(Oa, r), Ta(), La(e, r), r;
}
var Pe = [];
function Ta() {
  j.clear(), Pe.forEach(function(e) {
    return e?.();
  }), Pe = [];
}
function La(e, t) {
  var r = X(!1), n = function() {
    var d;
    if (((d = t.config) === null || d === void 0 ? void 0 : d.theme) !== "none" && !P.isStyleNameLoaded("common")) {
      var c, p, u = ((c = C.getCommonTheme) === null || c === void 0 ? void 0 : c.call(C)) || {}, m = u.primitive, f = u.semantic, g = u.global, b = u.style, v = {
        nonce: (p = t.config) === null || p === void 0 || (p = p.csp) === null || p === void 0 ? void 0 : p.nonce
      };
      C.load(m?.css, Je({
        name: "primitive-variables"
      }, v)), C.load(f?.css, Je({
        name: "semantic-variables"
      }, v)), C.load(g?.css, Je({
        name: "global-variables"
      }, v)), C.loadStyle(Je({
        name: "global-style"
      }, v), b), P.setLoadedStyleName("common");
    }
  };
  j.on("theme:change", function(i) {
    r.value || (e.config.globalProperties.$primevue.config.theme = i, r.value = !0);
  });
  var o = $e(t.config, function(i, d) {
    ie.emit("config:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = $e(function() {
    return t.config.ripple;
  }, function(i, d) {
    ie.emit("config:ripple:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = $e(function() {
    return t.config.theme;
  }, function(i, d) {
    r.value || P.setTheme(i), t.config.unstyled || n(), r.value = !1, ie.emit("config:theme:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = $e(function() {
    return t.config.unstyled;
  }, function(i, d) {
    !i && t.config.theme && n(), ie.emit("config:unstyled:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  });
  Pe.push(o), Pe.push(a), Pe.push(s), Pe.push(l);
}
var Ea = {
  install: function(t, r) {
    var n = To(Pa, r);
    Ca(t, n);
  }
}, jt = {
  name: "Portal",
  props: {
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: !1
    }
  },
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = Hr();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function Aa(e, t, r, n, o, a) {
  return a.inline ? D(e.$slots, "default", {
    key: 0
  }) : o.mounted ? ($(), ee($r, {
    key: 1,
    to: r.appendTo
  }, [D(e.$slots, "default")], 8, ["to"])) : V("", !0);
}
jt.render = Aa;
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
function ja() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = Mn();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var ir = C.extend({
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
function Ia(e) {
  return Xr(e) || za(e) || Qr(e) || Jr();
}
function za(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ce(e, t) {
  return Xr(e) || Na(e, t) || Qr(e, t) || Jr();
}
function Jr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Qr(e, t) {
  if (e) {
    if (typeof e == "string") return wt(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? wt(e, t) : void 0;
  }
}
function wt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Na(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, l = [], i = !0, d = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        i = !1;
      } else for (; !(i = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function Xr(e) {
  if (Array.isArray(e)) return e;
}
function sr(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function k(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sr(Object(r), !0).forEach(function(n) {
      Le(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : sr(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Le(e, t, r) {
  return (t = Ra(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ra(e) {
  var t = Va(e, "string");
  return Ne(t) == "symbol" ? t : t + "";
}
function Va(e, t) {
  if (Ne(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ne(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qe = {
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
        j.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, r) {
        var n = this;
        j.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return n._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, r, n, o, a, s, l, i, d, c, p, u = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, m = u ? (r = this.pt) === null || r === void 0 || (r = r.originalValue) === null || r === void 0 ? void 0 : r[this.$.type.name] : void 0, f = u ? (n = this.pt) === null || n === void 0 || (n = n.value) === null || n === void 0 ? void 0 : n[this.$.type.name] : this.pt;
    (o = f || m) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (a = o.onBeforeCreate) === null || a === void 0 || a.call(o);
    var g = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, b = g ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, v = g ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (d = this.$primevue) === null || d === void 0 || (d = d.config) === null || d === void 0 ? void 0 : d.pt;
    (c = v || b) === null || c === void 0 || (c = c[this.$.type.name]) === null || c === void 0 || (c = c.hooks) === null || c === void 0 || (p = c.onBeforeCreate) === null || p === void 0 || p.call(c), this.$attrSelector = ja(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = nt(ge(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = k({
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
        var r = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), n = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        r?.(), n?.();
      }
    },
    _mergeProps: function(t) {
      for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
        n[o - 1] = arguments[o];
      return Lt(t) ? t.apply(void 0, n) : S.apply(void 0, n);
    },
    _load: function() {
      ae.isStyleNameLoaded("base") || (C.loadCSS(this.$styleOptions), this._loadGlobalStyles(), ae.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, r;
      !ae.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name && (ir.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), ae.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      T(t) && C.load(t, k({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, r;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!P.isStyleNameLoaded("common")) {
          var n, o, a = ((n = this.$style) === null || n === void 0 || (o = n.getCommonTheme) === null || o === void 0 ? void 0 : o.call(n)) || {}, s = a.primitive, l = a.semantic, i = a.global, d = a.style;
          C.load(s?.css, k({
            name: "primitive-variables"
          }, this.$styleOptions)), C.load(l?.css, k({
            name: "semantic-variables"
          }, this.$styleOptions)), C.load(i?.css, k({
            name: "global-variables"
          }, this.$styleOptions)), C.loadStyle(k({
            name: "global-style"
          }, this.$styleOptions), d), P.setLoadedStyleName("common");
        }
        if (!P.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name) {
          var c, p, u, m, f = ((c = this.$style) === null || c === void 0 || (p = c.getComponentTheme) === null || p === void 0 ? void 0 : p.call(c)) || {}, g = f.css, b = f.style;
          (u = this.$style) === null || u === void 0 || u.load(g, k({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (m = this.$style) === null || m === void 0 || m.loadStyle(k({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), b), P.setLoadedStyleName(this.$style.name);
        }
        if (!P.isStyleNameLoaded("layer-order")) {
          var v, x, O = (v = this.$style) === null || v === void 0 || (x = v.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(v);
          C.load(O, k({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), P.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var r, n, o, a = ((r = this.$style) === null || r === void 0 || (n = r.getPresetTheme) === null || n === void 0 ? void 0 : n.call(r, t, "[".concat(this.$attrSelector, "]"))) || {}, s = a.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, k({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      ae.clearLoadedStyleNames(), j.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      j.off("theme:change", this._loadCoreStyles), j.off("theme:change", this._load), j.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var r;
      return this[t] || ((r = this._getHostInstance(this)) === null || r === void 0 ? void 0 : r[t]);
    },
    _getOptionValue: function(t) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return Et(t, r, n);
    },
    _getPTValue: function() {
      var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(n) && !!o[n.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = l.mergeSections, d = i === void 0 ? !0 : i, c = l.mergeProps, p = c === void 0 ? !1 : c, u = a ? s ? this._useGlobalPT(this._getPTClassValue, n, o) : this._useDefaultPT(this._getPTClassValue, n, o) : void 0, m = s ? void 0 : this._getPTSelf(r, this._getPTClassValue, n, k(k({}, o), {}, {
        global: u || {}
      })), f = this._getPTDatasets(n);
      return d || !d && m ? p ? this._mergeProps(p, u, m, f) : k(k(k({}, u), m), f) : k(k({}, m), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
        n[o - 1] = arguments[o];
      return S(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(n)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(n))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", a = n === "root" && T((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return n !== "transition" && k(k({}, n === "root" && k(k(Le({}, "".concat(o, "name"), K(a ? (r = this.pt) === null || r === void 0 ? void 0 : r["data-pc-section"] : this.$.type.name)), a && Le({}, "".concat(o, "extend"), K(this.$.type.name))), {}, Le({}, "".concat(this.$attrSelector), ""))), {}, Le({}, "".concat(o, "section"), K(n)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return R(t) || Vr(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var r = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, a = function(l) {
        var i, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, c = o ? o(l) : l, p = K(n), u = K(r.$name);
        return (i = d ? p !== u ? c?.[p] : void 0 : c?.[p]) !== null && i !== void 0 ? i : c;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: a(t.originalValue),
        value: a(t.value)
      } : a(t, !0);
    },
    _usePT: function(t, r, n, o) {
      var a = function(g) {
        return r(g, n, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, l = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, i = l.mergeSections, d = i === void 0 ? !0 : i, c = l.mergeProps, p = c === void 0 ? !1 : c, u = a(t.originalValue), m = a(t.value);
        return u === void 0 && m === void 0 ? void 0 : R(m) ? m : R(u) ? u : d || !d && m ? p ? this._mergeProps(p, u, m) : k(k({}, u), m) : m;
      }
      return a(t);
    },
    _useGlobalPT: function(t, r, n) {
      return this._usePT(this.globalPT, t, r, n);
    },
    _useDefaultPT: function(t, r, n) {
      return this._usePT(this.defaultPT, t, r, n);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, k(k({}, this.$params), r));
    },
    ptmi: function() {
      var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = S(this.$_attrsWithoutPT, this.ptm(r, n));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, r, k({
        instance: this
      }, n), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, k(k({}, this.$params), r));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (r) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, k(k({}, this.$params), n)), a = this._getOptionValue(ir.inlineStyles, t, k(k({}, this.$params), n));
        return [a, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, r = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(n) {
        return N(n, {
          instance: r
        });
      });
    },
    defaultPT: function() {
      var t, r = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(n) {
        return r._getOptionValue(n, r.$name, k({}, r.$params)) || N(n, k({}, r.$params));
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
      var t, r = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(n) {
        var o = Ce(n, 1), a = o[0];
        return r?.includes(a);
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
        var r = Ce(t, 1), n = r[0];
        return n?.startsWith("pt:");
      }).reduce(function(t, r) {
        var n = Ce(r, 2), o = n[0], a = n[1], s = o.split(":"), l = Ia(s), i = wt(l).slice(1);
        return i?.reduce(function(d, c, p, u) {
          return !d[c] && (d[c] = p === u.length - 1 ? a : {}), d[c];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var r = Ce(t, 1), n = r[0];
        return !(n != null && n.startsWith("pt:"));
      }).reduce(function(t, r) {
        var n = Ce(r, 2), o = n[0], a = n[1];
        return t[o] = a, t;
      }, {});
    }
  }
}, Ma = `
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
`, Da = C.extend({
  name: "baseicon",
  css: Ma
});
function Re(e) {
  "@babel/helpers - typeof";
  return Re = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Re(e);
}
function lr(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function dr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lr(Object(r), !0).forEach(function(n) {
      Ba(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : lr(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ba(e, t, r) {
  return (t = Ua(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ua(e) {
  var t = Ha(e, "string");
  return Re(t) == "symbol" ? t : t + "";
}
function Ha(e, t) {
  if (Re(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Re(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qa = {
  name: "BaseIcon",
  extends: qe,
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
  style: Da,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = be(this.label);
      return dr(dr({}, !this.isUnstyled && {
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
function cr(e, t) {
  return Ya(e) || Ka(e, t) || Fa(e, t) || Wa();
}
function Wa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Fa(e, t) {
  if (e) {
    if (typeof e == "string") return pr(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? pr(e, t) : void 0;
  }
}
function pr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Ka(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, a, s, l = [], i = !0, d = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(i = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (d) throw o;
      }
    }
    return l;
  }
}
function Ya(e) {
  if (Array.isArray(e)) return e;
}
function ur(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ur(Object(r), !0).forEach(function(n) {
      kt(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ur(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function kt(e, t, r) {
  return (t = Ga(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ga(e) {
  var t = Za(e, "string");
  return Ve(t) == "symbol" ? t : t + "";
}
function Za(e, t) {
  if (Ve(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ve(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var y = {
  _getMeta: function() {
    return [Y(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], N(Y(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, r) {
    var n, o, a;
    return (n = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (r == null || (a = r.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || n === void 0 ? void 0 : n.config;
  },
  _getOptionValue: Et,
  _getPTValue: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var x = y._getOptionValue.apply(y, arguments);
      return R(x) || Vr(x) ? {
        class: x
      } : x;
    }, d = ((t = n.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((r = n.$primevueConfig) === null || r === void 0 ? void 0 : r.ptOptions) || {}, c = d.mergeSections, p = c === void 0 ? !0 : c, u = d.mergeProps, m = u === void 0 ? !1 : u, f = l ? y._useDefaultPT(n, n.defaultPT(), i, a, s) : void 0, g = y._usePT(n, y._getPT(o, n.$name), i, a, _(_({}, s), {}, {
      global: f || {}
    })), b = y._getPTDatasets(n, a);
    return p || !p && g ? m ? y._mergeProps(n, m, f, g, b) : _(_(_({}, f), g), b) : _(_({}, g), b);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = "data-pc-";
    return _(_({}, r === "root" && kt({}, "".concat(n, "name"), K(t.$name))), {}, kt({}, "".concat(n, "section"), K(r)));
  },
  _getPT: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var l, i = n ? n(s) : s, d = K(r);
      return (l = i?.[d]) !== null && l !== void 0 ? l : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0, s = function(b) {
      return n(b, o, a);
    };
    if (r && Object.hasOwn(r, "_usept")) {
      var l, i = r._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, d = i.mergeSections, c = d === void 0 ? !0 : d, p = i.mergeProps, u = p === void 0 ? !1 : p, m = s(r.originalValue), f = s(r.value);
      return m === void 0 && f === void 0 ? void 0 : R(f) ? f : R(m) ? m : c || !c && f ? u ? y._mergeProps(t, u, m, f) : _(_({}, m), f) : f;
    }
    return s(r);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return y._usePT(t, r, n, o, a);
  },
  _loadStyles: function() {
    var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, a = y._getConfig(n, o), s = {
      nonce: a == null || (t = a.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    y._loadCoreStyles(r, s), y._loadThemeStyles(r, s), y._loadScopedThemeStyles(r, s), y._removeThemeListeners(r), r.$loadStyles = function() {
      return y._loadThemeStyles(r, s);
    }, y._themeChangeListener(r.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!ae.isStyleNameLoaded((t = n.$style) === null || t === void 0 ? void 0 : t.name) && (r = n.$style) !== null && r !== void 0 && r.name) {
      var a;
      C.loadCSS(o), (a = n.$style) === null || a === void 0 || a.loadCSS(o), ae.setLoadedStyleName(n.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, r, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!P.isStyleNameLoaded("common")) {
        var s, l, i = ((s = o.$style) === null || s === void 0 || (l = s.getCommonTheme) === null || l === void 0 ? void 0 : l.call(s)) || {}, d = i.primitive, c = i.semantic, p = i.global, u = i.style;
        C.load(d?.css, _({
          name: "primitive-variables"
        }, a)), C.load(c?.css, _({
          name: "semantic-variables"
        }, a)), C.load(p?.css, _({
          name: "global-variables"
        }, a)), C.loadStyle(_({
          name: "global-style"
        }, a), u), P.setLoadedStyleName("common");
      }
      if (!P.isStyleNameLoaded((r = o.$style) === null || r === void 0 ? void 0 : r.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
        var m, f, g, b, v = ((m = o.$style) === null || m === void 0 || (f = m.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(m)) || {}, x = v.css, O = v.style;
        (g = o.$style) === null || g === void 0 || g.load(x, _({
          name: "".concat(o.$style.name, "-variables")
        }, a)), (b = o.$style) === null || b === void 0 || b.loadStyle(_({
          name: "".concat(o.$style.name, "-style")
        }, a), O), P.setLoadedStyleName(o.$style.name);
      }
      if (!P.isStyleNameLoaded("layer-order")) {
        var h, w, A = (h = o.$style) === null || h === void 0 || (w = h.getLayerOrderThemeCSS) === null || w === void 0 ? void 0 : w.call(h);
        C.load(A, _({
          name: "layer-order",
          first: !0
        }, a)), P.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = t.preset();
    if (n && t.$attrSelector) {
      var o, a, s, l = ((o = t.$style) === null || o === void 0 || (a = o.getPresetTheme) === null || a === void 0 ? void 0 : a.call(o, n, "[".concat(t.$attrSelector, "]"))) || {}, i = l.css, d = (s = t.$style) === null || s === void 0 ? void 0 : s.load(i, _({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, r));
      t.scopedStyleEl = d.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    ae.clearLoadedStyleNames(), j.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    j.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, r, n, o, a, s) {
    var l, i, d = "on".concat(Lo(r)), c = y._getConfig(o, a), p = n?.$instance, u = y._usePT(p, y._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, t), y._getOptionValue, "hooks.".concat(d)), m = y._useDefaultPT(p, c == null || (i = c.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], y._getOptionValue, "hooks.".concat(d)), f = {
      el: n,
      binding: o,
      vnode: a,
      prevVnode: s
    };
    u?.(p, f), m?.(p, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++)
      n[o - 2] = arguments[o];
    return Lt(t) ? t.apply(void 0, n) : S.apply(void 0, n);
  },
  _extend: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = function(l, i, d, c, p) {
      var u, m, f, g;
      i._$instances = i._$instances || {};
      var b = y._getConfig(d, c), v = i._$instances[t] || {}, x = be(v) ? _(_({}, r), r?.methods) : {};
      i._$instances[t] = _(_({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: d,
        $modifiers: d?.modifiers,
        $value: d?.value,
        $el: v.$el || i || void 0,
        $style: _({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, r?.style),
        $primevueConfig: b,
        $attrSelector: (u = i.$pd) === null || u === void 0 || (u = u[t]) === null || u === void 0 ? void 0 : u.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return y._getPT(b?.pt, void 0, function(h) {
            var w;
            return h == null || (w = h.directives) === null || w === void 0 ? void 0 : w[t];
          });
        },
        isUnstyled: function() {
          var h, w;
          return ((h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (w = i._$instances[t]) === null || w === void 0 || (w = w.$binding) === null || w === void 0 || (w = w.value) === null || w === void 0 ? void 0 : w.unstyled : b?.unstyled;
        },
        theme: function() {
          var h;
          return (h = i._$instances[t]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, w = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return y._getPTValue(i._$instances[t], (h = i._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, w, _({}, A));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return y._getPTValue(i._$instances[t], h, w, A, !1);
        },
        cx: function() {
          var h, w, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", M = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = i._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : y._getOptionValue((w = i._$instances[t]) === null || w === void 0 || (w = w.$style) === null || w === void 0 ? void 0 : w.classes, A, _({}, M));
        },
        sx: function() {
          var h, w = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, M = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return A ? y._getOptionValue((h = i._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, w, _({}, M)) : void 0;
        }
      }, x), i.$instance = i._$instances[t], (m = (f = i.$instance)[l]) === null || m === void 0 || m.call(f, i, d, c, p), i["$".concat(t)] = i.$instance, y._hook(t, l, i, d, c, p), i.$pd || (i.$pd = {}), i.$pd[t] = _(_({}, (g = i.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, o = function(l) {
      var i, d, c, p = l._$instances[t], u = p?.watch, m = function(b) {
        var v, x = b.newValue, O = b.oldValue;
        return u == null || (v = u.config) === null || v === void 0 ? void 0 : v.call(p, x, O);
      }, f = function(b) {
        var v, x = b.newValue, O = b.oldValue;
        return u == null || (v = u["config.ripple"]) === null || v === void 0 ? void 0 : v.call(p, x, O);
      };
      p.$watchersCallback = {
        config: m,
        "config.ripple": f
      }, u == null || (i = u.config) === null || i === void 0 || i.call(p, p?.$primevueConfig), ie.on("config:change", m), u == null || (d = u["config.ripple"]) === null || d === void 0 || d.call(p, p == null || (c = p.$primevueConfig) === null || c === void 0 ? void 0 : c.ripple), ie.on("config:ripple:change", f);
    }, a = function(l) {
      var i = l._$instances[t].$watchersCallback;
      i && (ie.off("config:change", i.config), ie.off("config:ripple:change", i["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, i, d, c) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: Yo("pd")
        }, n("created", l, i, d, c);
      },
      beforeMount: function(l, i, d, c) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, i, d), n("beforeMount", l, i, d, c), o(l);
      },
      mounted: function(l, i, d, c) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, i, d), n("mounted", l, i, d, c);
      },
      beforeUpdate: function(l, i, d, c) {
        n("beforeUpdate", l, i, d, c);
      },
      updated: function(l, i, d, c) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, i, d), n("updated", l, i, d, c);
      },
      beforeUnmount: function(l, i, d, c) {
        var p;
        a(l), y._removeThemeListeners((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance), n("beforeUnmount", l, i, d, c);
      },
      unmounted: function(l, i, d, c) {
        var p;
        (p = l.$pd[t]) === null || p === void 0 || (p = p.instance) === null || p === void 0 || (p = p.scopedStyleEl) === null || p === void 0 || (p = p.value) === null || p === void 0 || p.remove(), n("unmounted", l, i, d, c);
      }
    };
  },
  extend: function() {
    var t = y._getMeta.apply(y, arguments), r = cr(t, 2), n = r[0], o = r[1];
    return _({
      extend: function() {
        var s = y._getMeta.apply(y, arguments), l = cr(s, 2), i = l[0], d = l[1];
        return y.extend(i, _(_(_({}, o), o?.methods), d));
      }
    }, y._extend(n, o));
  }
}, Ja = `
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
`, Qa = {
  root: "p-ink"
}, Xa = C.extend({
  name: "ripple-directive",
  style: Ja,
  classes: Qa
}), ei = y.extend({
  style: Xa
});
function Me(e) {
  "@babel/helpers - typeof";
  return Me = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Me(e);
}
function ti(e) {
  return ai(e) || oi(e) || ni(e) || ri();
}
function ri() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ni(e, t) {
  if (e) {
    if (typeof e == "string") return _t(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _t(e, t) : void 0;
  }
}
function oi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ai(e) {
  if (Array.isArray(e)) return _t(e);
}
function _t(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function mr(e, t, r) {
  return (t = ii(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ii(e) {
  var t = si(e, "string");
  return Me(t) == "symbol" ? t : t + "";
}
function si(e, t) {
  if (Me(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Me(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var en = ei.extend("ripple", {
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
      var r = this.getInk(t);
      r || (r = Bo("span", mr(mr({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(r), this.$el = r);
    },
    remove: function(t) {
      var r = this.getInk(t);
      r && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), r.removeEventListener("animationend", this.onAnimationEnd), r.remove());
    },
    onMouseDown: function(t) {
      var r = this, n = t.currentTarget, o = this.getInk(n);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && pt(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !Ft(o) && !Kt(o)) {
          var a = Math.max(Xe(n), qo(n));
          o.style.height = a + "px", o.style.width = a + "px";
        }
        var s = Ho(n), l = t.pageX - s.left + document.body.scrollTop - Kt(o) / 2, i = t.pageY - s.top + document.body.scrollLeft - Ft(o) / 2;
        o.style.top = i + "px", o.style.left = l + "px", !this.isUnstyled() && Ao(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!r.isUnstyled() && pt(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && pt(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? ti(t.children).find(function(r) {
        return Uo(r, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function De(e) {
  "@babel/helpers - typeof";
  return De = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, De(e);
}
function li(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function di(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, pi(n.key), n);
  }
}
function ci(e, t, r) {
  return t && di(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function pi(e) {
  var t = ui(e, "string");
  return De(t) == "symbol" ? t : t + "";
}
function ui(e, t) {
  if (De(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (De(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var mi = /* @__PURE__ */ (function() {
  function e(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    li(this, e), this.element = t, this.listener = r;
  }
  return ci(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Wo(this.element);
      for (var r = 0; r < this.scrollableParents.length; r++)
        this.scrollableParents[r].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var r = 0; r < this.scrollableParents.length; r++)
          this.scrollableParents[r].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
})(), fi = At(), hi = `
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`, bi = {
  root: function(t) {
    var r = t.props;
    return ["p-menu p-component", {
      "p-menu-overlay": r.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(t) {
    var r = t.instance;
    return ["p-menu-item", {
      "p-focus": r.id === r.focusedOptionId,
      "p-disabled": r.disabled()
    }];
  },
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: "p-menu-item-icon",
  itemLabel: "p-menu-item-label"
}, gi = C.extend({
  name: "menu",
  style: hi,
  classes: bi
}), vi = {
  name: "BaseMenu",
  extends: qe,
  props: {
    popup: {
      type: Boolean,
      default: !1
    },
    model: {
      type: Array,
      default: null
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    autoZIndex: {
      type: Boolean,
      default: !0
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: gi,
  provide: function() {
    return {
      $pcMenu: this,
      $parentInstance: this
    };
  }
}, tn = {
  name: "Menuitem",
  hostName: "Menu",
  extends: qe,
  inheritAttrs: !1,
  emits: ["item-click", "item-mousemove"],
  props: {
    item: null,
    templates: null,
    id: null,
    focusedOptionId: null,
    index: null
  },
  methods: {
    getItemProp: function(t, r) {
      return t && t.item ? N(t.item[r]) : void 0;
    },
    getPTOptions: function(t) {
      return this.ptm(t, {
        context: {
          item: this.item,
          index: this.index,
          focused: this.isItemFocused(),
          disabled: this.disabled()
        }
      });
    },
    isItemFocused: function() {
      return this.focusedOptionId === this.id;
    },
    onItemClick: function(t) {
      var r = this.getItemProp(this.item, "command");
      r && r({
        originalEvent: t,
        item: this.item.item
      }), this.$emit("item-click", {
        originalEvent: t,
        item: this.item,
        id: this.id
      });
    },
    onItemMouseMove: function(t) {
      this.$emit("item-mousemove", {
        originalEvent: t,
        item: this.item,
        id: this.id
      });
    },
    visible: function() {
      return typeof this.item.visible == "function" ? this.item.visible() : this.item.visible !== !1;
    },
    disabled: function() {
      return typeof this.item.disabled == "function" ? this.item.disabled() : this.item.disabled;
    },
    label: function() {
      return typeof this.item.label == "function" ? this.item.label() : this.item.label;
    },
    getMenuItemProps: function(t) {
      return {
        action: S({
          class: this.cx("itemLink"),
          tabindex: "-1"
        }, this.getPTOptions("itemLink")),
        icon: S({
          class: [this.cx("itemIcon"), t.icon]
        }, this.getPTOptions("itemIcon")),
        label: S({
          class: this.cx("itemLabel")
        }, this.getPTOptions("itemLabel"))
      };
    }
  },
  computed: {
    dataP: function() {
      return fe({
        focus: this.isItemFocused(),
        disabled: this.disabled()
      });
    }
  },
  directives: {
    ripple: en
  }
}, yi = ["id", "aria-label", "aria-disabled", "data-p-focused", "data-p-disabled", "data-p"], xi = ["data-p"], wi = ["href", "target"], ki = ["data-p"], _i = ["data-p"];
function Si(e, t, r, n, o, a) {
  var s = Pr("ripple");
  return a.visible() ? ($(), E("li", S({
    key: 0,
    id: r.id,
    class: [e.cx("item"), r.item.class],
    role: "menuitem",
    style: r.item.style,
    "aria-label": a.label(),
    "aria-disabled": a.disabled(),
    "data-p-focused": a.isItemFocused(),
    "data-p-disabled": a.disabled() || !1,
    "data-p": a.dataP
  }, a.getPTOptions("item")), [et("div", S({
    class: e.cx("itemContent"),
    onClick: t[0] || (t[0] = function(l) {
      return a.onItemClick(l);
    }),
    onMousemove: t[1] || (t[1] = function(l) {
      return a.onItemMouseMove(l);
    }),
    "data-p": a.dataP
  }, a.getPTOptions("itemContent")), [r.templates.item ? r.templates.item ? ($(), ee(ht(r.templates.item), {
    key: 1,
    item: r.item,
    label: a.label(),
    props: a.getMenuItemProps(r.item)
  }, null, 8, ["item", "label", "props"])) : V("", !0) : Or(($(), E("a", S({
    key: 0,
    href: r.item.url,
    class: e.cx("itemLink"),
    target: r.item.target,
    tabindex: "-1"
  }, a.getPTOptions("itemLink")), [r.templates.itemicon ? ($(), ee(ht(r.templates.itemicon), {
    key: 0,
    item: r.item,
    class: bt(e.cx("itemIcon"))
  }, null, 8, ["item", "class"])) : r.item.icon ? ($(), E("span", S({
    key: 1,
    class: [e.cx("itemIcon"), r.item.icon],
    "data-p": a.dataP
  }, a.getPTOptions("itemIcon")), null, 16, ki)) : V("", !0), et("span", S({
    class: e.cx("itemLabel"),
    "data-p": a.dataP
  }, a.getPTOptions("itemLabel")), lt(a.label()), 17, _i)], 16, wi)), [[s]])], 16, xi)], 16, yi)) : V("", !0);
}
tn.render = Si;
function fr(e) {
  return Ci(e) || Oi(e) || Pi(e) || $i();
}
function $i() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pi(e, t) {
  if (e) {
    if (typeof e == "string") return St(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? St(e, t) : void 0;
  }
}
function Oi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Ci(e) {
  if (Array.isArray(e)) return St(e);
}
function St(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var rn = {
  name: "Menu",
  extends: vi,
  inheritAttrs: !1,
  emits: ["show", "hide", "focus", "blur"],
  data: function() {
    return {
      overlayVisible: !1,
      focused: !1,
      focusedOptionIndex: -1,
      selectedOptionIndex: -1
    };
  },
  target: null,
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  container: null,
  list: null,
  mounted: function() {
    this.popup || (this.bindResizeListener(), this.bindOutsideClickListener());
  },
  beforeUnmount: function() {
    this.unbindResizeListener(), this.unbindOutsideClickListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.target = null, this.container && this.autoZIndex && ut.clear(this.container), this.container = null;
  },
  methods: {
    itemClick: function(t) {
      var r = t.item;
      this.disabled(r) || (r.command && r.command(t), this.overlayVisible && this.hide(), !this.popup && this.focusedOptionIndex !== t.id && (this.focusedOptionIndex = t.id));
    },
    itemMouseMove: function(t) {
      this.focused && (this.focusedOptionIndex = t.id);
    },
    onListFocus: function(t) {
      this.focused = !0, !this.popup && this.changeFocusedOptionIndex(0), this.$emit("focus", t);
    },
    onListBlur: function(t) {
      this.focused = !1, this.focusedOptionIndex = -1, this.$emit("blur", t);
    },
    onListKeyDown: function(t) {
      switch (t.code) {
        case "ArrowDown":
          this.onArrowDownKey(t);
          break;
        case "ArrowUp":
          this.onArrowUpKey(t);
          break;
        case "Home":
          this.onHomeKey(t);
          break;
        case "End":
          this.onEndKey(t);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(t);
          break;
        case "Space":
          this.onSpaceKey(t);
          break;
        case "Escape":
          this.popup && (Ke(this.target), this.hide());
        case "Tab":
          this.overlayVisible && this.hide();
          break;
      }
    },
    onArrowDownKey: function(t) {
      var r = this.findNextOptionIndex(this.focusedOptionIndex);
      this.changeFocusedOptionIndex(r), t.preventDefault();
    },
    onArrowUpKey: function(t) {
      if (t.altKey && this.popup)
        Ke(this.target), this.hide(), t.preventDefault();
      else {
        var r = this.findPrevOptionIndex(this.focusedOptionIndex);
        this.changeFocusedOptionIndex(r), t.preventDefault();
      }
    },
    onHomeKey: function(t) {
      this.changeFocusedOptionIndex(0), t.preventDefault();
    },
    onEndKey: function(t) {
      this.changeFocusedOptionIndex(Te(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      var r = nt(this.list, 'li[id="'.concat("".concat(this.focusedOptionIndex), '"]')), n = r && nt(r, 'a[data-pc-section="itemlink"]');
      this.popup && Ke(this.target), n ? n.click() : r && r.click(), t.preventDefault();
    },
    onSpaceKey: function(t) {
      this.onEnterKey(t);
    },
    findNextOptionIndex: function(t) {
      var r = Te(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), n = fr(r).findIndex(function(o) {
        return o.id === t;
      });
      return n > -1 ? n + 1 : 0;
    },
    findPrevOptionIndex: function(t) {
      var r = Te(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), n = fr(r).findIndex(function(o) {
        return o.id === t;
      });
      return n > -1 ? n - 1 : 0;
    },
    changeFocusedOptionIndex: function(t) {
      var r = Te(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), n = t >= r.length ? r.length - 1 : t < 0 ? 0 : t;
      n > -1 && (this.focusedOptionIndex = r[n].getAttribute("id"));
    },
    toggle: function(t, r) {
      this.overlayVisible ? this.hide() : this.show(t, r);
    },
    show: function(t, r) {
      this.overlayVisible = !0, this.target = r ?? t.currentTarget;
    },
    hide: function() {
      this.overlayVisible = !1, this.target = null;
    },
    onEnter: function(t) {
      Mo(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.bindOutsideClickListener(), this.bindResizeListener(), this.bindScrollListener(), this.autoZIndex && ut.set("menu", t, this.baseZIndex || this.$primevue.config.zIndex.menu), this.popup && Ke(this.list), this.$emit("show");
    },
    onLeave: function() {
      this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindScrollListener(), this.$emit("hide");
    },
    onAfterLeave: function(t) {
      this.autoZIndex && ut.clear(t);
    },
    alignOverlay: function() {
      Vo(this.container, this.target);
      var t = Xe(this.target);
      t > Xe(this.container) && (this.container.style.minWidth = Xe(this.target) + "px");
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(r) {
        var n = t.container && !t.container.contains(r.target), o = !(t.target && (t.target === r.target || t.target.contains(r.target)));
        t.overlayVisible && n && o ? t.hide() : !t.popup && n && o && (t.focusedOptionIndex = -1);
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new mi(this.target, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !Fo() && t.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    visible: function(t) {
      return typeof t.visible == "function" ? t.visible() : t.visible !== !1;
    },
    disabled: function(t) {
      return typeof t.disabled == "function" ? t.disabled() : t.disabled;
    },
    label: function(t) {
      return typeof t.label == "function" ? t.label() : t.label;
    },
    onOverlayClick: function(t) {
      fi.emit("overlay-click", {
        originalEvent: t,
        target: this.target
      });
    },
    containerRef: function(t) {
      this.container = t;
    },
    listRef: function(t) {
      this.list = t;
    }
  },
  computed: {
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
    },
    dataP: function() {
      return fe({
        popup: this.popup
      });
    }
  },
  components: {
    PVMenuitem: tn,
    Portal: jt
  }
}, Ti = ["id", "data-p"], Li = ["id", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby"], Ei = ["id"];
function Ai(e, t, r, n, o, a) {
  var s = tt("PVMenuitem"), l = tt("Portal");
  return $(), ee(l, {
    appendTo: e.appendTo,
    disabled: !e.popup
  }, {
    default: gt(function() {
      return [Dn(Bn, S({
        name: "p-anchored-overlay",
        onEnter: a.onEnter,
        onLeave: a.onLeave,
        onAfterLeave: a.onAfterLeave
      }, e.ptm("transition")), {
        default: gt(function() {
          return [!e.popup || o.overlayVisible ? ($(), E("div", S({
            key: 0,
            ref: a.containerRef,
            id: e.$id,
            class: e.cx("root"),
            onClick: t[3] || (t[3] = function() {
              return a.onOverlayClick && a.onOverlayClick.apply(a, arguments);
            }),
            "data-p": a.dataP
          }, e.ptmi("root")), [e.$slots.start ? ($(), E("div", S({
            key: 0,
            class: e.cx("start")
          }, e.ptm("start")), [D(e.$slots, "start")], 16)) : V("", !0), et("ul", S({
            ref: a.listRef,
            id: e.$id + "_list",
            class: e.cx("list"),
            role: "menu",
            tabindex: e.tabindex,
            "aria-activedescendant": o.focused ? a.focusedOptionId : void 0,
            "aria-label": e.ariaLabel,
            "aria-labelledby": e.ariaLabelledby,
            onFocus: t[0] || (t[0] = function() {
              return a.onListFocus && a.onListFocus.apply(a, arguments);
            }),
            onBlur: t[1] || (t[1] = function() {
              return a.onListBlur && a.onListBlur.apply(a, arguments);
            }),
            onKeydown: t[2] || (t[2] = function() {
              return a.onListKeyDown && a.onListKeyDown.apply(a, arguments);
            })
          }, e.ptm("list")), [($(!0), E(Oe, null, Mt(e.model, function(i, d) {
            return $(), E(Oe, {
              key: a.label(i) + d.toString()
            }, [i.items && a.visible(i) && !i.separator ? ($(), E(Oe, {
              key: 0
            }, [i.items ? ($(), E("li", S({
              key: 0,
              id: e.$id + "_" + d,
              class: [e.cx("submenuLabel"), i.class],
              role: "none"
            }, {
              ref_for: !0
            }, e.ptm("submenuLabel")), [D(e.$slots, e.$slots.submenulabel ? "submenulabel" : "submenuheader", {
              item: i
            }, function() {
              return [Cr(lt(a.label(i)), 1)];
            })], 16, Ei)) : V("", !0), ($(!0), E(Oe, null, Mt(i.items, function(c, p) {
              return $(), E(Oe, {
                key: c.label + d + "_" + p
              }, [a.visible(c) && !c.separator ? ($(), ee(s, {
                key: 0,
                id: e.$id + "_" + d + "_" + p,
                item: c,
                templates: e.$slots,
                focusedOptionId: a.focusedOptionId,
                unstyled: e.unstyled,
                onItemClick: a.itemClick,
                onItemMousemove: a.itemMouseMove,
                pt: e.pt
              }, null, 8, ["id", "item", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"])) : a.visible(c) && c.separator ? ($(), E("li", S({
                key: "separator" + d + p,
                class: [e.cx("separator"), i.class],
                style: c.style,
                role: "separator"
              }, {
                ref_for: !0
              }, e.ptm("separator")), null, 16)) : V("", !0)], 64);
            }), 128))], 64)) : a.visible(i) && i.separator ? ($(), E("li", S({
              key: "separator" + d.toString(),
              class: [e.cx("separator"), i.class],
              style: i.style,
              role: "separator"
            }, {
              ref_for: !0
            }, e.ptm("separator")), null, 16)) : ($(), ee(s, {
              key: a.label(i) + d.toString(),
              id: e.$id + "_" + d,
              item: i,
              index: d,
              templates: e.$slots,
              focusedOptionId: a.focusedOptionId,
              unstyled: e.unstyled,
              onItemClick: a.itemClick,
              onItemMousemove: a.itemMouseMove,
              pt: e.pt
            }, null, 8, ["id", "item", "index", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"]))], 64);
          }), 128))], 16, Li), e.$slots.end ? ($(), E("div", S({
            key: 1,
            class: e.cx("end")
          }, e.ptm("end")), [D(e.$slots, "end")], 16)) : V("", !0)], 16, Ti)) : V("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo", "disabled"]);
}
rn.render = Ai;
const ji = "data-wippy-overlay-layer";
function nn() {
  return typeof window < "u" && typeof window.document < "u";
}
function on() {
  return nn() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function Ii() {
  return on() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const zi = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ni = 0;
const at = /* @__PURE__ */ new WeakMap();
function hr(e, t) {
  const r = e.style;
  r.setProperty("position", "fixed", "important"), r.setProperty("inset", "auto", "important"), r.setProperty("margin", "0", "important"), r.setProperty("position-anchor", t), r.setProperty("position-area", "bottom span-right"), r.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), r.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), r.setProperty("max-width", "stretch", "important");
}
function Ri(e, t) {
  if (!zi.test(e.className))
    return;
  const r = e.style.cssText;
  hr(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = r;
    return;
  }
  if (!at.has(e)) {
    const n = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && hr(e, t);
    });
    n.observe(e, { attributes: !0, attributeFilter: ["style"] }), at.set(e, n);
  }
}
function It(e) {
  const t = at.get(e);
  t && (t.disconnect(), at.delete(e));
}
function Vi(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function $t(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const it = /* @__PURE__ */ new Set(), zt = /* @__PURE__ */ new WeakMap();
let br = !1, Pt = !1;
const gr = ["w-theme-dark", "w-theme-light"], Qe = "data-wippy-theme-root", Ot = /* @__PURE__ */ new WeakMap();
function Mi(e) {
  const t = [];
  let r = e ? e.parentNode : null;
  for (; r && r.nodeType === 1; )
    t.push(r), r = r.parentNode;
  return t;
}
function Di(e, t, r) {
  const n = [...Mi(t), r.host], o = () => {
    let s;
    for (const l of n) {
      if (gr.some((i) => l.classList.contains(i))) {
        s = l;
        break;
      }
      if (l.hasAttribute(Qe))
        break;
    }
    for (const l of gr)
      e.classList.toggle(l, !!(s && s.classList.contains(l)));
    s ? e.setAttribute(Qe, "") : e.removeAttribute(Qe);
  };
  o();
  const a = new MutationObserver(o);
  for (const s of n)
    a.observe(s, { attributes: !0, attributeFilter: ["class", Qe] });
  Ot.set(e, a);
}
function an(e) {
  Ot.get(e)?.disconnect(), Ot.delete(e);
}
function Bi() {
  Pt = !1;
  for (const e of it) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && It(t);
      it.delete(e), zt.get(e)?.disconnect(), an(e);
      continue;
    }
    e.childElementCount > 0 && $t(e);
  }
}
function vr() {
  Pt || (Pt = !0, requestAnimationFrame(Bi));
}
function Ui(e) {
  const t = document.createElement("div");
  t.setAttribute(ji, "");
  const r = on();
  if (t.style.cssText = r ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", r && t.setAttribute("popover", "manual"), e.appendChild(t), r) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  $t(t);
  const n = new MutationObserver((o) => {
    const a = t.__wippyAnchorName;
    for (const s of o) {
      if (a)
        for (const l of Array.from(s.addedNodes))
          l instanceof HTMLElement && Ri(l, a);
      for (const l of Array.from(s.removedNodes))
        l instanceof HTMLElement && It(l);
    }
    t.isConnected && t.childElementCount > 0 && $t(t);
  });
  return n.observe(t, { childList: !0 }), zt.set(t, n), it.add(t), br || (br = !0, window.addEventListener("scroll", vr, { capture: !0, passive: !0 }), window.addEventListener("resize", vr, { passive: !0 })), t;
}
function yr(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Ui(e.hostRoot), Di(e.layer, e.$el, e.hostRoot), Ii())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Ni}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function xr(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && It(t);
    it.delete(e.layer), zt.get(e.layer)?.disconnect(), an(e.layer), e.layer.remove(), e.layer = null;
  }
}
let wr = !1;
function Hi() {
  if (wr)
    return;
  const e = rn;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const r = t.composedPath(), n = this.container && !r.includes(this.container), o = !(this.target && r.includes(this.target));
      this.overlayVisible && n && o ? this.hide() : !this.popup && n && o && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, wr = !0);
}
let kr = !1;
function qi() {
  if (kr)
    return;
  kr = !0;
  const e = jt;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    nn() && (this.hostRoot = Vi(this.$el), this.mounted = !0, this.hostRoot && (this.inline || yr(this), this.$watch("inline", (t) => {
      t ? xr(this) : yr(this);
    })));
  }, e.render = function() {
    return this.inline ? D(this.$slots, "default", { key: 0 }) : this.mounted ? Un($r, { key: 1, to: this.resolvedTarget || document.body }, [
      D(this.$slots, "default")
    ]) : V("", !0);
  }, e.unmounted = function() {
    xr(this);
  };
}
const Wi = {
  install: (e) => {
    Hi(), qi(), e.use(Ea, { theme: "none" });
  }
}, Fi = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-iconbtn{width:28px;height:28px;flex:none;display:grid;place-items:center;cursor:pointer;border:1px solid transparent;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-muted-color);transition:color .14s,background .14s,border-color .14s}.kx-iconbtn:hover:not(:disabled){color:var(--p-text-color);background:var(--kx-surface-2)}.kx-iconbtn.on{color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.kx-iconbtn:disabled{opacity:.55;cursor:default}.kx-iconbtn svg{width:16px;height:16px}.kx-iconbtn.lg{width:var(--kx-control-height);height:var(--kx-control-height)}.kx-iconbtn.sm{width:var(--kx-control-height-sm);height:var(--kx-control-height-sm)}.kx-iconbtn.bordered{border-color:var(--p-content-border-color);background:var(--kx-surface-1);color:var(--p-text-muted-color)}.kx-iconbtn.bordered:hover:not(:disabled){border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-iconbtn.danger:hover:not(:disabled),.kx-iconbtn.danger.on{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-500)}.kx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:var(--kx-control-height);padding:0 14px;border-radius:var(--kx-radius-8);cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;white-space:nowrap;border:1px solid transparent;transition:filter .15s,transform .15s,background .14s,border-color .14s,color .14s}.kx-btn svg{width:15px;height:15px}.kx-btn:disabled{opacity:.5;cursor:not-allowed}.kx-btn.sm{height:var(--kx-control-height-sm);padding:0 12px}.kx-btn-primary{background:var(--p-primary-color);color:var(--p-primary-contrast-color);border-color:var(--p-primary-color)}.kx-btn-primary:hover:not(:disabled){filter:brightness(1.07);transform:translateY(-1px)}.kx-btn-ghost{background:transparent;color:var(--p-text-color);border-color:var(--p-content-border-color)}.kx-btn-ghost:hover:not(:disabled){background:var(--kx-surface-2);border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-btn-soft{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color);border-color:color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.kx-btn-soft:hover:not(:disabled){background:color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.kx-btn-danger{background:var(--p-danger-500);color:var(--p-danger-contrast-color);border-color:var(--p-danger-500)}.kx-btn-danger:hover:not(:disabled){filter:brightness(1.07)}.kx-search{position:relative;display:flex;align-items:center}.kx-search-ico{position:absolute;left:10px;width:15px;height:15px;color:var(--p-text-muted-color);pointer-events:none}.kx-search-input{width:100%;height:var(--kx-control-height);padding:0 30px 0 31px;font:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);transition:border-color .14s,box-shadow .14s}.kx-search-input::placeholder{color:var(--p-text-muted-color)}.kx-search-input:focus{outline:none;border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.kx-search-clear{position:absolute;right:6px;width:22px;height:22px;border-radius:var(--kx-radius-8);display:grid;place-items:center;cursor:pointer;background:transparent;border:none;color:var(--p-text-muted-color)}.kx-search-clear:hover{color:var(--p-text-color);background:var(--kx-surface-2)}.kx-search-clear svg{width:14px;height:14px}.kx-chip{font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:var(--kx-radius-6);background:var(--kx-surface-2);color:var(--p-text-muted-color);border:1px solid var(--p-content-border-color)}.kx-count{min-width:18px;height:16px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:var(--kx-font-body)}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}button,input,textarea,select{font:inherit}h1,h2,h3,p{margin:0}h1{font-size:24px;line-height:1.3;font-weight:600;overflow-wrap:anywhere}h2{font-size:16px;font-weight:600;line-height:1.4}h3{font-size:14px;font-weight:600}p{line-height:1.5}button{cursor:pointer}button:disabled{cursor:default}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}small{font-size:12px;color:var(--p-text-muted-color);font-weight:400}input:not([type=checkbox]),select,textarea{width:100%;min-width:0;background:var(--p-content-background);color:var(--p-text-color);border:1px solid var(--p-content-border-color);border-radius:var(--p-form-field-border-radius);padding:9px 11px;line-height:1.4}textarea{resize:vertical}wc-model-picker,wc-multiselect{display:block;min-width:0}.docscout{font-family:var(--kx-font-body);container-type:inline-size;container-name:docscout;height:100%;min-height:0;overflow-y:auto;display:flex;flex-direction:column;background:var(--p-content-background);color:var(--p-text-color);font-size:14px}.description{color:var(--p-text-muted-color);margin-top:8px;max-width:680px;overflow-wrap:anywhere}.row{display:flex;align-items:center;gap:12px;min-width:0}.wrap{flex-wrap:wrap}.push{margin-left:auto}.grow{flex:1;min-width:220px}.muted,.meta-line,.retention{font-size:13px;color:var(--p-text-muted-color)}.meta-line{margin-top:12px}.badge{display:inline-flex;align-items:center;white-space:nowrap;border-radius:var(--p-content-border-radius);padding:2px 7px;background:var(--p-content-hover-background);color:var(--p-text-muted-color);font-size:12px}.tabs{display:flex;gap:22px;flex-shrink:0;overflow-x:auto;min-width:0}.tabs button{background:transparent;border:0;border-bottom:2px solid transparent;padding:13px 0 11px;color:var(--p-text-muted-color);font-size:13px;font-weight:500;white-space:nowrap}.tabs button[aria-selected=true]{color:var(--p-primary-color);border-bottom-color:var(--p-primary-color)}.page-body{overflow-y:auto;min-height:0;flex:1;padding:22px 24px 36px}.panel{max-width:1000px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.section-head p{margin-top:5px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.three{grid-template-columns:repeat(3,minmax(0,1fr))}.field-card{border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius);padding:20px;background:var(--p-content-background);margin-bottom:16px}.field-card>header{margin-bottom:18px}.field-card>label,.field-card>.grid{margin-bottom:18px}.field-card>:last-child{margin-bottom:0}.ordinal{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:var(--p-content-border-radius);background:var(--p-content-hover-background);font-size:12px;color:var(--p-text-muted-color);flex-shrink:0}.check{display:inline-flex;flex-direction:row;align-items:center;gap:8px;font-weight:400}.check input{accent-color:var(--p-primary-color);width:16px;height:16px;flex-shrink:0}.panel>section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--p-content-border-color)}section>h2{margin-bottom:20px}section>.grid,section>.check{margin-bottom:18px}.identity{padding-bottom:24px}.empty{padding:24px 0;color:var(--p-text-muted-color);font-size:13px}.error{color:var(--p-danger-color);padding:12px 0;overflow-wrap:anywhere}.retention{margin-top:12px}.test-input>.muted{margin-top:14px}.value{font-size:20px;font-weight:500;margin:6px 0}.confidence{font-size:12px;color:var(--p-text-muted-color)}blockquote{border-left:2px solid var(--p-primary-color);margin:16px 0 0;padding:2px 0 2px 14px}blockquote p{font-size:14px}cite{display:block;font-size:12px;color:var(--p-text-muted-color);font-style:normal;margin-top:6px}.trace{padding-left:20px;margin:20px 0}.trace>li{padding:0 0 24px 12px}.trace p,.trace ul{margin-top:8px}.comparison .field-card{margin:0}.values{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.values dd{text-align:right}.values small{display:block;margin-top:4px}dd{margin:0;overflow-wrap:anywhere}dt{color:var(--p-text-muted-color)}.delta{color:var(--p-text-muted-color);font-size:13px;margin-top:10px}.capitalize{text-transform:capitalize}.create-pane{max-height:100%;overflow-y:auto;padding:24px;max-width:640px;margin:auto;color:var(--p-text-color)}.create-pane>header,.create-pane>label,.create-summary{margin-bottom:24px}.create-summary{padding:18px;border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius)}.create-summary dl{display:grid;grid-template-columns:110px 1fr;gap:12px;font-size:13px;margin-bottom:0}.create-summary h2{margin:0 0 14px}@container docscout (max-width:600px){.page-body{padding:22px 20px 32px}.grid,.three,.run-list{grid-template-columns:1fr;gap:16px}.field-card{padding:16px}.field-card>header{gap:8px}.field-card header h3{overflow-wrap:anywhere;min-width:0}.section-head{align-items:flex-start;gap:12px}.create-pane{max-height:100%;overflow-y:auto;padding:20px}.comparison{grid-template-columns:1fr}.confidence{max-width:112px;text-align:right}.create-summary dl{grid-template-columns:85px 1fr}}.title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.title-row .badge{font-weight:500}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 20px;border-bottom:1px solid var(--p-content-border-color);flex-shrink:0;min-height:46px}.toolbar-side{display:flex;align-items:center;gap:12px;min-width:0}.stats{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sep{opacity:.6}.save-area{display:flex;align-items:center;gap:12px;flex-shrink:0}.unsaved{font-size:12px;color:var(--p-text-muted-color);display:inline-flex;align-items:center;gap:6px}.unsaved:before{content:"";width:7px;height:7px;border-radius:999px;background:var(--p-primary-color)}.banner{padding:8px 20px;border-bottom:1px solid var(--p-content-border-color)}.chips{display:flex;flex-wrap:wrap;gap:5px}.chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;line-height:1.5;border-radius:6px;padding:1px 7px;background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-muted-color);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.chip.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.chip.muted-chip{background:transparent;border:1px dashed var(--p-content-border-color)}.chip.model{background:color-mix(in srgb,var(--p-primary-color) 10%,transparent);color:var(--p-text-color)}.node{display:flex;align-items:flex-start;gap:14px;width:100%;margin:0;text-align:left;background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:12px 14px 12px 12px;color:var(--p-text-color);cursor:pointer;transition:border-color .12s,box-shadow .12s}.node:where(:hover){border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.node:where(.active){border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.node.off{background:transparent;border-style:dashed}.node.off .node-icon,.node.off .node-title{opacity:.55}.node-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.fixed .node-icon{background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-color)}.node-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.node-title{font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}.scope{font-size:11px;font-weight:500;color:var(--p-text-muted-color);text-transform:capitalize}.scope:before{content:"· "}.node-summary{font-size:13px;color:var(--p-text-muted-color)}.trace-line{display:inline-flex;align-items:flex-start;gap:6px;font-size:12px;line-height:1.5;color:var(--p-primary-color)}.trace-line>svg{flex-shrink:0;margin-top:3px}.node-side{display:flex;align-items:center;gap:8px;flex-shrink:0}.node-actions{display:flex;align-items:center;gap:2px}.node-actions .switch{margin-left:6px}.connector{width:2px;height:18px;flex-shrink:0;margin:0 auto;background:color-mix(in srgb,var(--p-text-color) 18%,transparent);position:relative}.connector:after{content:"";position:absolute;bottom:-1px;left:-3px;width:8px;height:8px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 25%,transparent)}.connector.off{background:repeating-linear-gradient(to bottom,color-mix(in srgb,var(--p-text-color) 18%,transparent) 0 4px,transparent 4px 8px)}.switch{position:relative;width:40px;height:23px;border:0;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 16%,transparent);flex-shrink:0;padding:0;transition:background .15s}.switch span{position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:999px;background:var(--p-toggleswitch-handle-background,var(--p-content-background));box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent);transition:transform .15s}.switch[aria-checked=true]{background:var(--p-primary-color)}.switch[aria-checked=true] span{transform:translate(17px)}.switch:disabled{opacity:.5}.inspector-body{padding:16px 20px 28px}.inspector-form{border:0;margin:0;padding:0;min-width:0;display:flex;flex-direction:column;gap:14px}.inspector-form h4{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);margin:8px 0 -4px}.inspector-form .grid{gap:12px}.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px}.toggle-row>span{display:flex;flex-direction:column;gap:2px;min-width:0}.toggle-row small{overflow-wrap:anywhere}.mono{font-family:var(--p-font-mono-family);font-size:11px}.segmented{display:flex;padding:3px;gap:3px;border-radius:8px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.segmented button{flex:1;border:0;border-radius:6px;background:transparent;padding:6px 8px;font-size:13px;color:var(--p-text-muted-color)}.segmented button[aria-checked=true]{background:var(--p-content-background);color:var(--p-text-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 12%,transparent);font-weight:500}.query-row{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--p-content-border-color);border-radius:10px}.query-row .kx-btn{align-self:flex-start}.output-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.output-list li{display:flex;justify-content:space-between;gap:12px;align-items:center}@container docscout (max-width:600px){.toolbar{padding:0 14px 0 20px;gap:10px}.crumb-row,.toolbar-title{padding-left:32px}.stats,.node-side .chip.model{display:none}.inspector-form .grid{grid-template-columns:1fr}}.label-block{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}.toolbar-lead{display:flex;align-items:center;gap:14px;min-width:0}.crumb{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;padding-right:10px;border-right:1px solid var(--p-content-border-color)}.toolbar-title{display:flex;align-items:center;gap:8px}.toolbar-title h1{font-size:15px;font-weight:600}.filter{width:220px!important;padding:5px 10px!important;font-size:13px}.pad-page{padding:24px}.list-page .page-body{padding:20px 24px 36px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.card{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:14px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);color:var(--p-text-color);min-width:0}.card:where(:hover){border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.card-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.card-main{display:flex;flex-direction:column;gap:4px;min-width:0}.card-title{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-desc{font-size:13px;color:var(--p-text-muted-color);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.card-meta{font-size:12px;color:var(--p-text-muted-color)}.create-card{position:relative;border:1px solid var(--p-content-border-color);border-radius:14px;margin-bottom:16px;max-width:640px}.create-card .create-pane{margin:0;padding:18px 20px}.create-card .create-pane>header,.create-card .create-pane>label,.create-card .create-summary{margin-bottom:16px}.create-close{position:absolute;top:12px;right:12px}.empty-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:64px 16px;color:var(--p-text-muted-color);font-size:13px;text-align:center}.empty-icon{font-size:30px}@container docscout (max-width:900px){.filter{width:150px!important}}@container docscout (max-width:600px){.filter{display:none}.list-page .page-body{padding:16px 14px 28px}}.builder-body{flex:1;min-height:0;display:flex}.builder{position:relative;flex:1;min-width:0;min-height:0;display:flex}.canvas{flex:1;min-width:0;overflow-y:auto;background:color-mix(in srgb,var(--p-text-color) 2.5%,transparent)}.canvas-inner{max-width:760px;margin:0 auto;padding:20px 24px 48px;display:flex;flex-direction:column;gap:18px}.block{background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;min-width:0}.block-head{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 8px;min-width:0}.collapse{display:inline-flex;align-items:center;gap:8px;border:0;background:transparent;color:var(--p-text-color);padding:4px 6px;border-radius:8px;flex-shrink:0}.collapse:hover{background:color-mix(in srgb,var(--p-text-color) 6%,transparent)}.collapse h2{font-size:14px}.collapse>svg{color:var(--p-text-muted-color)}.count{font-size:12px;color:var(--p-text-muted-color);background:color-mix(in srgb,var(--p-text-color) 8%,transparent);border-radius:999px;padding:1px 8px;white-space:nowrap}.block-peek{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.block-body{border-top:1px solid var(--p-content-border-color)}.block-empty{padding:18px 20px;font-size:13px;color:var(--p-text-muted-color)}.rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--docscout-space)}.row-item{display:flex;align-items:center;gap:var(--docscout-space);border-radius:var(--kx-radius-8);border:1px solid transparent;min-width:0}.row-item:hover{background:var(--kx-overlay-subtle)}.row-item.active{background:var(--kx-wash-primary);border-color:color-mix(in srgb,var(--p-primary-color) 35%,var(--p-content-border-color))}.row-main{border:0;background:transparent;color:var(--p-text-color);text-align:left}.row-desc{color:var(--p-text-muted-color);font-size:12px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}.row-actions{display:flex;flex-direction:column;flex:none;opacity:0;transition:opacity .12s}.row-item:hover .row-actions,.row-item:focus-within .row-actions{opacity:1}.flow{border-top:1px solid var(--p-content-border-color);padding:16px;display:flex;flex-direction:column}.side-panel{position:relative;width:400px;flex-shrink:0;display:flex;flex-direction:column;min-height:0;border-left:1px solid var(--p-content-border-color);background:var(--p-content-background)}.side-panel-head{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 18px;border-bottom:1px solid var(--p-content-border-color);min-height:52px}.side-panel-head h2{font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.side-panel-icon{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.side-panel-body{flex:1;min-height:0;overflow-y:auto;padding:16px 18px 28px}.rail{width:44px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px 0;border:0;border-left:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:18px}.rail:hover{color:var(--p-text-color);background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.rail-label{writing-mode:vertical-rl;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:240px}.builder.narrow .side-panel{position:absolute;top:0;right:0;bottom:0;width:min(420px,100%);z-index:5;box-shadow:-12px 0 32px color-mix(in srgb,var(--p-text-color) 18%,transparent)}.scrim{position:absolute;inset:0;z-index:4;background:color-mix(in srgb,var(--p-text-color) 18%,transparent)}@container docscout (max-width:760px){.canvas-inner{padding:14px 12px 36px;gap:14px}.flow,.node{padding:12px}.block-peek{display:none}}.resizer{position:absolute;top:0;bottom:0;left:-4px;width:8px;cursor:col-resize;z-index:2;touch-action:none}.resizer:after{content:"";position:absolute;top:0;bottom:0;left:3px;width:2px;background:transparent;transition:background .12s}.resizer:hover:after,.resizer.active:after,.resizer:focus-visible:after{background:var(--p-primary-color)}.builder.resizing{cursor:col-resize;user-select:none}.field-error,.field-note{display:flex;align-items:flex-start;gap:6px;font-size:12px;margin-top:-6px}.field-error{color:var(--p-danger-color)}.field-note{color:var(--p-text-muted-color)}.field-error svg,.field-note svg{flex-shrink:0;margin-top:2px}.mono-input{font-family:var(--p-font-mono-family);font-size:13px}input[aria-invalid=true]{border-color:var(--p-danger-color)}.row-warn{display:inline-block;color:var(--p-danger-color);margin-left:6px;vertical-align:-2px}.row-desc.missing{font-style:italic;opacity:.75}.inspector-form>.kx-btn{align-self:flex-start}.invalid{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--p-danger-color);max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.invalid svg{flex-shrink:0}@container docscout (max-width:760px){.invalid{max-width:140px}}.test,.evals{display:flex;flex-direction:column;gap:16px;max-width:1180px}.block-title{font-size:14px;padding-left:6px}.block-foot{padding:10px 18px 14px;font-size:12px;border-top:1px solid var(--p-content-border-color)}.run-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.run-input{flex:1;min-width:240px;max-width:520px}.run-note{flex-basis:100%;font-size:12px}.test-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:16px;align-items:start}.value-list{list-style:none;margin:0;padding:4px 6px 6px}.value-row+.value-row{border-top:1px solid var(--p-content-border-color)}.value-main{width:100%;display:grid;grid-template-columns:minmax(100px,150px) minmax(0,1fr) 172px 84px 18px;align-items:center;gap:12px;border:0;background:transparent;color:var(--p-text-color);text-align:left;padding:11px 10px}.value-main:hover{background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.value-name{font-family:var(--p-font-mono-family);font-size:12px;color:var(--p-text-muted-color);overflow:hidden;text-overflow:ellipsis}.value-text{font-size:14px;font-weight:600;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;overflow-wrap:anywhere}.value-caret{color:var(--p-text-muted-color)}.confidence{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--p-text-muted-color);white-space:nowrap}.bar{position:relative;display:inline-block;width:56px;height:6px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 10%,transparent);overflow:hidden;flex-shrink:0}.bar>span{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--p-primary-color)}.confidence.mid .bar>span{background:color-mix(in srgb,var(--p-primary-color) 60%,var(--p-text-color))}.confidence.low .bar>span{background:var(--p-danger-color)}.evidence{padding:0 12px 12px 10px}.evidence blockquote{margin:6px 0 0;padding:6px 0 6px 12px;border-left:2px solid var(--p-primary-color)}.evidence blockquote p{font-size:13px}.timeline{list-style:none;margin:0;padding:8px 14px 14px}.timeline li{display:flex;gap:12px;padding:10px 0;position:relative}.timeline li+li{border-top:1px dashed var(--p-content-border-color)}.tl-icon{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.timeline li.failed .tl-icon{background:color-mix(in srgb,var(--p-danger-color) 14%,transparent);color:var(--p-danger-color)}.tl-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}.tl-head{display:flex;align-items:center;gap:8px;font-size:13px}.tl-bar{height:4px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 8%,transparent);overflow:hidden}.tl-bar>span{display:block;height:100%;background:color-mix(in srgb,var(--p-primary-color) 70%,transparent);border-radius:999px}.tl-main p{font-size:12px}.tl-msg{color:var(--p-text-color)}.stat-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.stat{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);min-width:0}.stat-label{font-size:12px;color:var(--p-text-muted-color)}.stat-value{font-size:24px;font-weight:600;line-height:1.2}.stat-delta{font-size:12px;color:var(--p-text-muted-color)}.stat-delta.up,.trend.up{color:var(--p-primary-color)}.stat-delta.down,.trend.down{color:var(--p-danger-color)}.metric-table{width:100%;border-collapse:collapse;font-size:13px}.metric-table th{text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);padding:10px 14px;border-top:1px solid var(--p-content-border-color);border-bottom:1px solid var(--p-content-border-color);white-space:nowrap}.metric-table td{padding:10px 14px;border-bottom:1px solid var(--p-content-border-color);white-space:nowrap}.metric-table tr:last-child td{border-bottom:0}.metric-table .num{text-align:right}.metric-table .mono{font-family:var(--p-font-mono-family);font-size:12px;text-transform:none;letter-spacing:0}.acc{display:inline-flex;align-items:center;gap:8px}.acc.strong{font-weight:600}.trend{display:inline-flex;align-items:center;gap:4px;font-weight:500}.trend.flat{color:var(--p-text-muted-color)}.table-scroll{overflow-x:auto}.case-form{display:flex;flex-direction:column;gap:14px;padding:14px 18px;border-top:1px solid var(--p-content-border-color)}@container docscout (max-width:980px){.test-grid{grid-template-columns:1fr}.stat-row{grid-template-columns:repeat(2,minmax(0,1fr))}}@container docscout (max-width:640px){.value-main{grid-template-columns:minmax(0,1fr) auto auto 18px}.conf-word{display:none}.value-name{grid-column:1/-1}.value-main .confidence .bar{display:none}}.metric-table td svg{display:inline-block;vertical-align:-2px}.slider{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500}.slider-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.slider-value{font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;padding:1px 8px;border-radius:6px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.slider input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;padding:0;border:0;border-radius:999px;background:linear-gradient(to right,var(--p-primary-color) var(--fill),color-mix(in srgb,var(--p-text-color) 12%,transparent) var(--fill));cursor:pointer}.slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:999px;background:var(--p-slider-handle-content-background,var(--p-content-background));border:2px solid var(--p-primary-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent)}.slider input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:999px;background:var(--p-slider-handle-content-background,var(--p-content-background));border:2px solid var(--p-primary-color)}.slider input[type=range]:disabled{opacity:.5;cursor:default}.slider-hints{display:flex;justify-content:space-between;font-size:11px;font-weight:400;color:var(--p-text-muted-color)}.slider small{font-weight:400}.model-role{display:grid;grid-template-columns:96px minmax(0,1fr);align-items:center;gap:10px;font-size:13px}.model-role>span{color:var(--p-text-muted-color)}.diagram{margin:0;padding:12px;border-radius:10px;background:color-mix(in srgb,var(--p-text-color) 4%,transparent);display:flex;flex-direction:column;gap:8px}.diagram figcaption{font-size:12px;color:var(--p-text-muted-color);line-height:1.45}.chunk-diagram svg{width:100%;height:46px;display:block}.chunk-diagram .chunk{fill:color-mix(in srgb,var(--p-primary-color) 22%,transparent);stroke:var(--p-primary-color);stroke-width:.4;vector-effect:non-scaling-stroke}.chunk-diagram .shared{fill:color-mix(in srgb,var(--p-primary-color) 35%,transparent)}.fd-track{display:flex;align-items:center;gap:0;overflow-x:auto;padding-bottom:2px}.fd-track.wrap{flex-wrap:wrap;row-gap:8px}.fd-node{display:inline-flex;flex-direction:column;align-items:center;gap:3px;padding:5px 9px;border-radius:8px;border:1px solid color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));background:var(--p-content-background);font-size:11px;white-space:nowrap;line-height:1.2}.fd-node b{font-size:13px}.fd-node small{font-size:10px;color:var(--p-text-muted-color)}.fd-node.solid{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.fd-node.goal{border-style:dashed;color:var(--p-primary-color);font-weight:600}.fd-dots{display:flex;gap:2px}.fd-dots i{width:4px;height:4px;border-radius:999px;background:var(--p-primary-color)}.fd-link{width:12px;height:2px;background:color-mix(in srgb,var(--p-primary-color) 40%,transparent);flex-shrink:0}.fd-arrow{color:var(--p-text-muted-color);padding:0 6px;font-size:12px}.fd-more{font-size:11px;color:var(--p-text-muted-color);padding:0 4px}.fd-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.fd-grid .fd-node{position:relative;min-width:0;white-space:normal;text-align:center;padding:6px 4px}.fd-grid .fd-node:not(:last-child):after{content:"";position:absolute;right:-12px;top:50%;width:10px;height:2px;background:color-mix(in srgb,var(--p-primary-color) 45%,transparent)}.fork,.join{position:relative;height:22px;margin:0 25%}.fork span,.join span{position:absolute;left:0;right:0;border:2px solid color-mix(in srgb,var(--p-text-color) 18%,transparent)}.fork span{top:10px;bottom:0;border-bottom:0;border-radius:10px 10px 0 0}.join span{top:0;bottom:10px;border-top:0;border-radius:0 0 10px 10px}.fork:before,.join:after{content:"";position:absolute;left:50%;width:2px;height:10px;margin-left:-1px;background:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.fork:before{top:0}.join:after{bottom:0}.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}.branch{display:flex;flex-direction:column;min-width:0}.branch-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);text-align:center;margin-bottom:6px}.branch .node{padding:11px 12px}.branch .node-side .chip.model{display:none}@container docscout (max-width:900px){.branches{grid-template-columns:1fr}.fork,.join{margin:0 auto;width:2px}.fork span,.join span{display:none}.branch+.branch{margin-top:14px}}.run-failed{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:color-mix(in srgb,var(--p-danger-color) 10%,transparent);color:var(--p-danger-color);font-size:13px}.value-text.missing{font-weight:400;font-style:italic;color:var(--p-text-muted-color)}.chip.warn{background:color-mix(in srgb,var(--p-button-text-warn-color) 16%,transparent);color:var(--p-text-color)}blockquote.unfound{border-left-color:var(--p-button-text-warn-color)}.full-value{font-size:13px;line-height:1.5;padding:2px 0 4px;white-space:pre-wrap;overflow-wrap:anywhere}.eval-run{padding:16px 18px}.eval-run-main{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.eval-run-main .muted{margin-top:4px;max-width:560px}.eval-note{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:13px;color:var(--p-primary-color)}.eval-progress{display:flex;align-items:center;gap:12px;margin-top:14px}.eval-progress .bar{flex:1;height:6px;border-radius:999px;background:var(--p-content-hover-background);overflow:hidden}.eval-progress .bar>span{display:block;height:100%;background:var(--p-primary-color);transition:width .3s}.evals{display:flex;flex-direction:column;gap:18px}.stat-value small{font-size:14px;font-weight:500;color:var(--p-text-muted-color)}.result-matrix td,.result-matrix th{white-space:nowrap}.result-row.active td{background:var(--p-content-hover-background)}.case-toggle{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--p-text-color);padding:0;font-weight:500;max-width:280px;overflow:hidden;text-overflow:ellipsis}.cell{display:inline-flex;align-items:center;justify-content:center;min-width:46px;padding:2px 8px;border-radius:var(--p-content-border-radius);font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}.cell.pass{background:color-mix(in srgb,var(--p-primary-color) 16%,transparent);color:var(--p-primary-color)}.cell.partial{background:color-mix(in srgb,var(--p-button-text-warn-color) 18%,transparent);color:var(--p-button-text-warn-color)}.cell.fail{background:color-mix(in srgb,var(--p-danger-color) 16%,transparent);color:var(--p-danger-color)}.cell.none{color:var(--p-text-muted-color)}.cell-state{display:inline-flex;align-items:center;gap:6px;white-space:normal}.cell-state.fail{color:var(--p-danger-color)}.spin{animation:docscout-spin 1s linear infinite}@keyframes docscout-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}.result-detail>td{padding:12px 16px 16px;white-space:normal}.compare{display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:10px 16px;margin:0;max-width:860px}.compare dt{padding-top:3px;font-size:13px}.compare dd{display:grid;grid-template-columns:56px minmax(0,1fr) minmax(0,1fr) auto;align-items:start;gap:12px}.cmp{display:flex;flex-direction:column;min-width:0;font-size:13px;overflow-wrap:anywhere}.cmp-label{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color)}.case-meta{margin-top:10px}.eval-history{list-style:none;margin:0;padding:0}.eval-history li+li{border-top:1px solid var(--p-content-border-color)}.eval-history button{display:flex;align-items:center;gap:12px;width:100%;padding:10px 18px;border:0;background:transparent;color:var(--p-text-color);text-align:left;font-size:13px}.eval-history button:hover,.eval-history button.active{background:var(--p-content-hover-background)}.badge[data-status=completed]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.badge[data-status=failed]{background:color-mix(in srgb,var(--p-danger-color) 14%,transparent);color:var(--p-danger-color)}.badge[data-status=running],.badge[data-status=queued]{background:var(--p-content-hover-background);color:var(--p-text-color)}.caller{display:inline-flex;align-items:center;gap:6px}@container docscout (max-width:600px){.eval-run-main{flex-direction:column}.compare{grid-template-columns:1fr}.compare dd{grid-template-columns:56px minmax(0,1fr)}.compare dd>:last-child{grid-column:2}.matrix-hint{display:none}.compare-pick{width:100%;margin-left:0}.block-head:has(.compare-pick){flex-wrap:wrap}}.eval-run .block-title{padding:0}.compare-pick{flex-direction:row;align-items:center;gap:8px;font-weight:400}.compare-pick select{width:auto;max-width:100%;padding:5px 9px;font-size:13px}.eval-warning{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:var(--p-content-border-radius);background:var(--p-content-hover-background);color:var(--p-text-color);font-size:13px}.crumb-row{display:flex;align-items:center;gap:14px;min-width:0}@container docscout (max-width:900px){.toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"crumb side" "tabs tabs";column-gap:12px;row-gap:0}.toolbar-lead{display:contents}.crumb-row{grid-area:crumb;min-height:46px;gap:10px}.crumb{border-right:0;padding-right:0;max-width:none}.toolbar>.toolbar-lead>.tabs{grid-area:tabs}.toolbar-side{grid-area:side;min-height:46px}}@container docscout (max-width:600px){.btn-label{display:none}}.card-title-row{display:flex;align-items:center;gap:8px;min-width:0}.card-title-row .card-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access{flex-shrink:0;font-size:11px;font-weight:500;line-height:1.5;border-radius:6px;padding:1px 7px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);white-space:nowrap}.card-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@container docscout (max-width:600px){.metric-table th,.metric-table td{padding:9px 10px}.accuracy-table td:first-child{white-space:normal;overflow-wrap:anywhere}.acc .bar{width:32px}}.value-main>.confidence{justify-self:end}.value-main>.chip{justify-self:start}.cmp-label{white-space:nowrap}@container docscout (max-width:600px){.result-matrix,.result-matrix tbody{display:block}.result-matrix thead{display:none}.result-matrix tr.result-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:12px 14px;border-bottom:1px solid var(--p-content-border-color)}.result-matrix tr.result-row.active{background:var(--p-content-hover-background)}.result-matrix tr.result-row td{display:flex;align-items:center;gap:6px;padding:0;border:0;white-space:normal;background:transparent}.result-matrix tr.result-row td:first-child{flex-basis:100%}.result-matrix td[data-label]:before{content:attr(data-label);font-family:var(--p-font-mono-family);font-size:11px;color:var(--p-text-muted-color)}.case-toggle{max-width:100%;overflow-wrap:anywhere;text-align:left}.result-matrix tr.result-detail{display:block;border-bottom:1px solid var(--p-content-border-color)}.result-matrix tr.result-detail>td{display:block;padding:12px 14px 14px}.accuracy-table.comparing th:nth-child(3),.accuracy-table.comparing td:nth-child(3),.accuracy-table.comparing th:nth-child(4),.accuracy-table.comparing td:nth-child(4){display:none}.compare-pick{flex-wrap:nowrap}.compare-pick>.muted{white-space:nowrap}.compare-pick select{flex:1;min-width:0}.compare dd{grid-template-columns:56px minmax(0,1fr) minmax(0,1fr)}.compare dd>:last-child{grid-column:2/4}.case-table,.case-table tbody{display:block}.case-table thead{display:none}.case-table tr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 14px;border-bottom:1px solid var(--p-content-border-color)}.case-table tr:last-child{border-bottom:0}.case-table td{display:flex;align-items:center;gap:6px;padding:0;border:0;white-space:normal;overflow-wrap:anywhere}.case-table td:first-child{flex:1 1 calc(100% - 44px);font-weight:500}.case-table td.num{order:-1;margin-left:auto;flex:0 0 auto}.case-table td:first-child{order:-2}.case-table td[data-label]{flex-basis:100%}.case-table td[data-label]:before{content:attr(data-label);font-family:var(--p-font-mono-family);font-size:11px;color:var(--p-text-muted-color);min-width:96px}}.eval-history button>span{white-space:nowrap}@container docscout (max-width:600px){.eval-history button{display:grid;grid-template-columns:auto minmax(0,1fr) auto;row-gap:2px;column-gap:10px;padding:10px 14px}.eval-history button>.muted{grid-column:2;grid-row:2;font-size:12px}.eval-history button>strong{grid-column:3;grid-row:1/3;align-self:center}}.value-main{border-radius:8px}@container docscout (max-width:600px){.runs-table,.runs-table tbody{display:block}.runs-table thead{display:none}.runs-table tr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 4px;border-bottom:1px solid var(--p-content-border-color)}.runs-table tr:after{content:"";flex-basis:100%;height:0;order:3}.runs-table td{display:flex;align-items:center;gap:5px;padding:0;border:0}.runs-table td:nth-child(1){order:1;flex:1;font-weight:500}.runs-table td:nth-child(3){order:2}.runs-table td:nth-child(2){order:4}.runs-table td:nth-child(4){order:5}.runs-table td:nth-child(5){order:6}.runs-table td:nth-child(6){display:none}.runs-table td:nth-child(n+2):not(:nth-child(3)){font-size:12px;color:var(--p-text-muted-color)}.runs-table td[data-label]:before{content:attr(data-label)}}.builder,.field-groups{--docscout-space:calc(var(--kx-row-height)/8)}.fields-block>.block-head{padding:calc(var(--docscout-space)*3) calc(var(--docscout-space)*4);gap:calc(var(--docscout-space)*2)}.fields-block>.block-head .collapse{padding:0;min-height:var(--kx-row-height)}#fields-body{container-type:inline-size;container-name:fields;padding:calc(var(--docscout-space)*4)}#fields-body>.block-empty{padding:calc(var(--docscout-space)*2) 0 calc(var(--docscout-space)*4)}.group-add{display:flex;flex-wrap:wrap;align-items:end;gap:calc(var(--docscout-space)*2);padding:0 0 calc(var(--docscout-space)*4);margin-block-end:calc(var(--docscout-space)*4);border-block-end:1px solid var(--p-content-border-color)}.group-add>label{flex:1;min-width:0}.group-add input{height:var(--kx-control-height)}.group-add>.kx-btn{height:var(--kx-control-height)}.field-groups{display:flex;flex-direction:column;gap:calc(var(--docscout-space)*4);min-width:0}.field-group{min-width:0;margin:0;padding:0}.field-group-head{display:flex;align-items:center;gap:calc(var(--docscout-space)*2);min-height:calc(var(--kx-row-height) + var(--docscout-space)*2);padding-block:var(--docscout-space);min-width:0}.group-heading{display:flex;align-items:center;gap:calc(var(--docscout-space)*2);flex:1;min-width:0}.group-title{font-family:var(--kx-font-heading);font-size:14px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.group-name-button{border:0;padding:0;justify-content:flex-start;background:transparent;height:var(--kx-row-height);max-width:100%}.group-name-button>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.group-name-button>svg{width:12px;height:12px;flex:none;color:var(--p-text-muted-color);opacity:0}.group-name-button:hover>svg,.group-name-button:focus-visible>svg{opacity:1}.group-count{flex:none;font-size:11px}.group-actions{display:flex;align-items:center;gap:var(--docscout-space);margin-inline-start:auto;position:relative;flex:none}.group-actions .p-menu{left:auto!important;right:0}.group-rename{display:flex;flex-wrap:wrap;align-items:center;gap:var(--docscout-space);width:100%;min-width:0;margin:0}.group-rename>input{flex:1;min-width:0;height:var(--kx-control-height)}.group-rename>.field-error{flex-basis:100%;margin:0}.group-content{margin-inline-start:calc(var(--docscout-space)*4);padding-inline-start:calc(var(--docscout-space)*4 - 1px);border-inline-start:1px solid var(--p-content-border-color);min-width:0}.shape-editor{display:flex;flex-direction:column;gap:12px;min-width:0}.nested-value{min-width:0;overflow-wrap:anywhere;white-space:normal}.nested-value dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:8px;margin:0}.nested-value dt{color:var(--p-text-muted-color);font-weight:500}.nested-value dd{min-width:0;margin:0}.nested-value ol{padding-inline-start:16px;margin:0}.nested-value li+li{margin-block-start:8px}.case-value{display:flex;flex-direction:column;gap:8px}@container docscout (max-width:600px){.nested-value dl{grid-template-columns:minmax(0,1fr)}.nested-value dd{padding-inline-start:12px}}.structured-value{padding:12px 16px}.rows>.value-row,.value-list .rows>li{list-style:none}.case-table td:has(.case-value){white-space:normal}@container docscout (max-width:600px){.runs-table .result-detail{display:block}.runs-table .result-detail>td{display:block;width:100%}.case-table td:has(.case-value){flex-basis:100%;display:block}.structured-value{padding-inline:8px}}.tree-toggle.kx-iconbtn,.tree-indent{width:var(--kx-row-height);height:var(--kx-row-height);flex:none}.shape-tree-node{min-width:0}.tree-children{list-style:none;margin-block:0;margin-inline:calc(var(--docscout-space)*4) 0;padding-block:0;padding-inline:calc(var(--docscout-space)*4 - 1px) 0;border-inline-start:1px solid var(--p-content-border-color)}.tree-children>li{min-width:0}.tree-children>li+li{margin-block-start:var(--docscout-space)}.shape-tree-node .row-main{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:calc(var(--docscout-space)*2);min-height:calc(var(--kx-row-height)*2);padding:calc(var(--docscout-space)*2) var(--docscout-space);min-width:0;flex:1;border-radius:var(--kx-radius-8)}.row-copy{display:flex;flex-direction:column;gap:var(--docscout-space);min-width:0}.shape-tree-node .row-name{display:flex;align-items:center;gap:calc(var(--docscout-space)*2);font-family:var(--kx-font-body);font-size:13px;font-weight:600;line-height:20px;min-width:0}.row-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.shape-tree-node .row-name>svg{width:16px;height:16px;flex:none;color:var(--p-text-muted-color)}.shape-tree-node .row-name>.row-warn{color:var(--p-danger-color);margin-inline-start:0}.field-badges{display:flex;flex-direction:column;align-items:flex-end;gap:var(--docscout-space);width:calc(var(--docscout-space)*24);min-width:0}.field-type{height:calc(var(--docscout-space)*5);max-width:100%}.field-flags{display:flex;align-items:center;justify-content:flex-end;gap:var(--docscout-space);height:calc(var(--docscout-space)*5);flex:none}.field-flag.chip{display:inline-flex;align-items:center;justify-content:center;width:calc(var(--docscout-space)*5);height:calc(var(--docscout-space)*5);padding:0;flex:none}.field-flag>svg{width:14px;height:14px}.type-picker{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.type-picker button{flex-direction:column;gap:5px;min-height:58px;white-space:normal;font-size:12px}.type-picker button>svg{font-size:20px}.type-picker button:last-child{grid-column:auto}.context-stepper{display:flex;align-items:center;gap:4px}.context-stepper input{flex:1}.context-stepper .kx-btn{padding:7px 12px}.shape-preview{margin-block-start:18px;border-block-start:1px solid var(--p-content-border-color);padding-block:14px}.shape-preview summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;margin-block-end:12px}.preview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.preview-grid h3{font-size:12px;color:var(--p-text-muted-color);margin-block-end:8px}.preview-grid pre,.field-failure pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;background:var(--p-content-hover-background);border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius);padding:12px;font-size:12px}.node-breadcrumb{overflow-wrap:anywhere;margin-block-end:16px;color:var(--p-text-muted-color)}.move-node{display:flex;align-items:end;gap:8px;margin:20px 0 0;padding:14px 0 0;border:0;border-block-start:1px solid var(--p-content-border-color)}.move-node>label{flex:1}.field-failure{padding:10px 14px;color:var(--p-danger-color);overflow-wrap:anywhere}.field-failure details{margin-block-start:6px;color:var(--p-text-color)}.field-failure summary{cursor:pointer}.field-failure p{font-size:13px}.badge[data-status=partial]{background:color-mix(in srgb,var(--p-button-text-warn-color) 14%,transparent);color:var(--p-button-text-warn-color)}wc-agent-picker{display:block;min-width:0}@container docscout (max-width:600px){.preview-grid{grid-template-columns:minmax(0,1fr)}}.preview-grid pre,.field-failure pre{font-family:var(--p-font-mono-family)}h1,h2,h3,h4{font-family:var(--kx-font-heading)}@container fields (max-width:400px){.shape-tree-node .row-main{grid-template-columns:minmax(0,1fr);min-height:calc(var(--kx-row-height)*2 + var(--docscout-space)*4);gap:var(--docscout-space)}.field-badges{flex-direction:row;align-items:center;justify-content:space-between;width:auto;gap:var(--docscout-space)}.shape-tree-node .row-actions{opacity:1}.group-name-button>svg{opacity:1}.group-heading{gap:var(--docscout-space)}}';
function Is(e, t) {
  return class extends ko {
    static get wippyConfig() {
      return { propsSchema: t, inlineCss: Fi };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [Wi] };
    }
  };
}
const J = (e) => `/api/v1/docscout/${encodeURIComponent(e)}`;
function H(e) {
  if (e.success === !1) throw new Error(e.error || "Request failed");
  return e;
}
const Ki = (e) => e.response?.data, zs = {
  async list(e = {}) {
    return H((await B.get("/api/v1/docscout", { params: e })).data);
  },
  async get(e) {
    return H((await B.get(J(e))).data);
  },
  async create(e) {
    return H((await B.post("/api/v1/docscout", e)).data);
  },
  async update(e, t) {
    return H((await B.put(J(e), t)).data);
  },
  async addCase(e, t) {
    return H((await B.post(J(e) + "/cases", t)).data);
  },
  async deleteCase(e, t) {
    H((await B.delete(J(e) + "/cases/" + encodeURIComponent(t))).data);
  },
  // A run that stops partway still answers with its run id and step trace.
  async run(e, t) {
    try {
      return H((await B.post(J(e) + "/run", { upload_id: t })).data);
    } catch (r) {
      const n = Ki(r), o = n?.details?.trace;
      if (!o) throw r;
      return { run_id: n?.details?.run_id ?? "", upload_id: t, config_revision: 0, values: {}, fields: [], trace: o, duration_ms: o.reduce((a, s) => a + s.duration_ms, 0), tokens: o.reduce((a, s) => a + s.input_tokens + s.output_tokens, 0), status: "failed", error: n?.error };
    }
  },
  async evaluate(e) {
    return H((await B.post(J(e) + "/evaluations", {})).data);
  },
  async evaluations(e) {
    return H((await B.get(J(e) + "/evaluations")).data).items;
  },
  async evaluation(e, t) {
    return H((await B.get(J(e) + "/evaluations/" + encodeURIComponent(t))).data).evaluation;
  },
  async remove(e) {
    H((await B.delete(J(e))).data);
  }
}, Yi = { fields: { items: { default: { name: "", type: "text", description: "", enum_values: [], required: !1, search_hints: "", validation_hints: "", expected_format: "", strategy: "standard", search_within: "document", group: "", evidence_required: !0, chunks: 5 } } }, stages: { properties: { map: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, outline: { type: "string", default: "find_or_build", enum: ["find_or_build", "build"] }, section_summaries: { type: "boolean", default: !1 } }, required: ["enabled", "model", "outline", "section_summaries"], default: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 } }, prefetch: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, queries: { type: "array", default: [], items: { type: "object", additionalProperties: !1, properties: { name: { type: "string", minLength: 1, maxLength: 200, default: "" }, query: { type: "string", minLength: 1, maxLength: 4e3, default: "" }, chunks: { type: "integer", default: 5, minimum: 1, maximum: 1e3 } }, required: ["name", "query", "chunks"], default: { name: "", query: "", chunks: 5 } }, maxItems: 100 } }, required: ["enabled", "queries"], default: { enabled: !0, queries: [] } }, scout: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, mode: { type: "string", default: "loop", enum: ["loop", "agent"] }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, max_rounds: { type: "integer", default: 0, minimum: 0, maximum: 30 }, target_confidence: { type: "number", default: 0.7, minimum: 0, maximum: 1 }, max_extra_queries: { type: "integer", default: 3, minimum: 0, maximum: 20 }, max_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, drop_noise: { type: "boolean", default: !0 }, share_notes: { type: "boolean", default: !0 }, tools: { type: "array", default: ["keyword_search", "semantic_search", "read_section", "read_outline"], items: { type: "string", enum: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, uniqueItems: !0 } }, required: ["enabled", "mode", "model", "max_rounds", "target_confidence", "max_extra_queries", "max_tokens", "drop_noise", "share_notes", "tools"], default: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] } }, deep: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, query_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, read: { type: "string", default: "chunks", enum: ["chunks", "sections"] }, parallel_fields: { type: "integer", default: 4, minimum: 1, maximum: 20 }, max_queries: { type: "integer", default: 5, minimum: 1, maximum: 100 }, chunks_per_query: { type: "integer", default: 50, minimum: 1, maximum: 1e3 }, chunk_cap: { type: "integer", default: 100, minimum: 1, maximum: 1e4 }, min_similarity: { type: "number", default: 0.2, minimum: 0, maximum: 1 }, query_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 }, analysis_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 } }, required: ["enabled", "model", "query_model", "read", "parallel_fields", "max_queries", "chunks_per_query", "chunk_cap", "min_similarity", "query_temperature", "analysis_temperature"], default: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 } }, extract: { type: "object", additionalProperties: !1, properties: { model: { type: "string", default: "class:premium", minLength: 1, maxLength: 200 }, max_output_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, max_fields_per_call: { type: "integer", default: 20, minimum: 1, maximum: 100 } }, required: ["model", "max_output_tokens", "max_fields_per_call"], default: { model: "class:premium", max_output_tokens: 4096, max_fields_per_call: 20 } }, verify: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !1 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, check_quotes: { type: "boolean", default: !0 }, check_support: { type: "boolean", default: !0 } }, required: ["enabled", "model", "check_quotes", "check_support"], default: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } } } }, retrieval: { properties: { chunk_size: { type: "integer", default: 1200, minimum: 100, maximum: 16e3 }, overlap: { type: "integer", default: 150, minimum: 0, maximum: 4e3 }, split_headings: { type: "boolean", default: !0 }, keep_tables: { type: "boolean", default: !0 }, search_mode: { type: "string", default: "hybrid", enum: ["keyword", "semantic", "hybrid"] }, embedding_model: { type: "string", default: "class:embed", minLength: 1, maxLength: 200 }, context: { type: "string", default: "headings", enum: ["none", "headings", "generated"] }, context_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, highlighter: { type: "boolean", default: !1 }, highlighter_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, section_budget: { type: "integer", default: 6e3, minimum: 500, maximum: 64e3 } } } }, dt = {
  properties: Yi,
  default: { fields: [], stages: { map: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 }, prefetch: { enabled: !0, queries: [] }, scout: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, deep: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 }, extract: { model: "class:premium", max_output_tokens: 4096, max_fields_per_call: 20 }, verify: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } }, retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, keep_tables: !0, search_mode: "hybrid", embedding_model: "class:embed", context: "headings", context_model: "class:fast", highlighter: !1, highlighter_model: "class:fast", section_budget: 6e3 }, tags: [] }
}, Gi = 4, Ns = () => ({ name: "", type: "text", description: "", enum_values: [], expected_format: "", required: !1 }), Rs = () => ({ type: "text", description: "", enum_values: [], expected_format: "" }), Se = (e) => e.group ? `${e.group}.${e.name}` : e.name, Zi = /^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/;
function Vs(e) {
  return e.find((t) => e.some((r) => r !== t && r.startsWith(t + ".")));
}
function Ms(e, t) {
  let r = e;
  for (const n of t.split(".")) {
    if (r === null || typeof r != "object" || !Object.hasOwn(r, n)) return;
    r = r[n];
  }
  return r;
}
function Ds(e, t, r) {
  const n = t.split(".");
  let o = e;
  for (const a of n.slice(0, -1))
    Object.hasOwn(o, a) || (o[a] = {}), o = o[a];
  Object.defineProperty(o, n.at(-1), { value: r, writable: !0, enumerable: !0, configurable: !0 });
}
function Bs(e) {
  const t = { name: "", path: "", indices: [], children: [] };
  return e.forEach((r, n) => {
    let o = t;
    for (const a of r.split(".").slice(0, -1)) {
      let s = o.children.find((l) => l.name === a);
      s || (s = { name: a, path: o.path ? `${o.path}.${a}` : a, indices: [], children: [] }, o.children.push(s)), o = s;
    }
    o.indices.push(n);
  }), t;
}
function Us() {
  const e = structuredClone(dt.default), { max_output_tokens: t, max_fields_per_call: r } = e.stages.extract;
  return { ...e, stages: { ...e.stages, extract: { model: "class:fast", max_output_tokens: t, max_fields_per_call: r } } };
}
const Hs = () => structuredClone(dt.properties.fields.items.default), qs = () => ({ name: "", query: "", chunks: 5 }), Ws = () => [...dt.properties.stages.properties.scout.properties.tools.default], sn = dt, ln = (e) => ({ min: e?.minimum ?? 0, max: e?.maximum ?? 100 }), Fs = (e, t) => ln(sn.properties.stages.properties[e]?.properties[t]), Ks = (e) => ln(sn.properties.retrieval.properties[e]), Ys = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, Gs = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, Zs = {
  map: "Find the table of contents or build an outline, then pick the sections each field should read.",
  prefetch: "Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.",
  scout: "Judge the evidence, drop noise and look for more until confident.",
  deep: "Give each deep field its own searches and a written analysis, several fields at a time.",
  extract: "Fill the fields from the evidence, one group of fields per call.",
  verify: "Check that each quote exists in the document and supports its value."
}, Js = (e, t) => t === "extract" || e.stages[t].enabled, Q = (e, t) => `${e} ${e === 1 ? t : t.endsWith("y") ? t.slice(0, -1) + "ies" : t + "s"}`;
function dn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.fields) {
    const n = r.group.trim() || "Default";
    t.set(n, [...t.get(n) ?? [], r]);
  }
  return [...t].map(([r, n]) => ({ name: r, fields: n }));
}
function Ji(e) {
  return dn(e).reduce((t, r) => t + Math.max(1, Math.ceil(r.fields.length / e.stages.extract.max_fields_per_call)), 0);
}
function Qs(e, t) {
  const r = t.stages;
  switch (e) {
    case "map": {
      const n = t.fields.filter((o) => o.search_within === "sections").length;
      return [r.map.outline === "build" ? "Always build an outline" : "Contents first, else build", n ? `${Q(n, "field")} read Map's sections` : ""].filter(Boolean).join(" · ");
    }
    case "prefetch": {
      const n = t.fields.filter((a) => a.strategy !== "deep" || !r.deep.enabled).length, o = t.fields.filter((a) => a.search_hints.trim()).length;
      return [Q(n, "field"), o ? Q(o, "field hint") : "", r.prefetch.queries.length ? Q(r.prefetch.queries.length, "query") : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return r.scout.mode === "agent" ? `Agent with tools · up to ${Q(r.scout.max_rounds * r.scout.max_extra_queries, "tool call")}` : `Structured loop · ${r.scout.max_rounds ? `up to ${Q(r.scout.max_rounds, "round")}, stop at ${Math.round(r.scout.target_confidence * 100)}%` : "single pass"}`;
    case "deep": {
      const n = t.fields.filter((o) => o.strategy === "deep").length;
      return n ? `${Q(n, "field")} · reads ${r.deep.read} · ${r.deep.parallel_fields} at a time` : "No deep fields";
    }
    case "extract": {
      const n = Ji(t);
      return `Structured output · ${Q(dn(t).length, "group")}, ${Q(n, "call")}`;
    }
    case "verify":
      return [r.verify.check_quotes ? "quotes exist" : "", r.verify.check_support ? "quotes support values" : ""].filter(Boolean).join(" · ") || "No checks";
  }
}
function Xs(e) {
  const t = e.context === "generated" ? "generated context" : e.context === "headings" ? "heading context" : "";
  return [`${e.chunk_size.toLocaleString()}-token chunks`, `${e.search_mode} search`, t, e.highlighter ? "highlighter" : ""].filter(Boolean).join(" · ");
}
function el(e) {
  return e ? e.startsWith("class:") ? e.slice(6).replace(/^\w/, (t) => t.toUpperCase()) : e.split("/").pop() ?? e : "";
}
function tl(e) {
  return e.replace(/_/g, " ").replace(/^\w/, (t) => t.toUpperCase());
}
const rl = (e, t = !0) => e.type === "enum" || !t && e.type === "text";
function Ct(e, t = 1) {
  if (t > Gi) return "Shapes support at most four levels.";
  if ((e.description?.length ?? 0) > 4e3) return "Use at most 4000 characters for the description.";
  if ((e.expected_format?.length ?? 0) > 400) return "Use at most 400 characters for the expected format.";
  if ((e.enum_values?.length ?? 0) > 100) return "Use at most 100 allowed values.";
  if (e.enum_values?.some((r) => !r.length || r.length > 200)) return "Allowed values need 1 to 200 characters.";
  if (new Set(e.enum_values).size !== (e.enum_values?.length ?? 0)) return "Allowed values must be unique.";
  if (e.type === "enum" && !e.enum_values?.length) return "Add at least one allowed value.";
  if (e.enum_values?.length && e.type !== "enum" && e.type !== "text") return "Allowed values apply to enum fields and text items.";
  if (e.type === "object") {
    if (!e.properties?.length) return "Add at least one declared property.";
    if (e.properties.length > 100) return "Use at most 100 properties.";
    const r = /* @__PURE__ */ new Set();
    for (const n of e.properties) {
      const o = cn(n.name, [...r]) || Ct(n, t + 1);
      if (o) return `${n.name || "New property"}: ${o}`;
      r.add(n.name);
    }
  } else if (e.properties) return "Properties apply to object shapes.";
  return e.type === "list" ? e.item ? Ct(e.item, t + 1) : "Declare the item shape." : e.item ? "Item shapes apply to lists." : "";
}
function cn(e, t) {
  return e ? e.length > 80 ? "Use at most 80 characters for a name." : /^[A-Za-z][A-Za-z0-9_]*$/.test(e) ? t.includes(e) ? "Another field already uses this name." : "" : "Start with a letter; use letters, numbers and underscores." : "Name the field.";
}
function Qi(e, t) {
  const r = cn(e.name, t.includes(Se(e)) ? [e.name] : []);
  return r || (t.some((n) => n !== Se(e) && (n.startsWith(Se(e) + ".") || Se(e).startsWith(n + "."))) ? `Group path collides with field ${Se(e)}.` : e.group.length > 320 ? "Use at most 320 characters for a group path." : Zi.test(e.group) ? e.search_hints.length > 4e3 || e.validation_hints.length > 4e3 ? "Use at most 4000 characters for hints." : !Number.isInteger(e.chunks) || e.chunks < 1 || e.chunks > 1e3 ? "Chunks to read must be an integer from 1 to 1000." : e.enum_values.length && e.type !== "enum" ? "Allowed values apply to enum fields and text items." : Ct(e) : "Use a dotted path of snake_case group names.");
}
function nl(e) {
  const t = e.type === "list" ? e.item?.type : e.type;
  return { text: "For example, full legal name", number: "For example, decimal with 2 places", date: "For example, YYYY-MM-DD", object: "Describe the object format", boolean: "", enum: "" }[t ?? ""] ?? "";
}
function ol(e) {
  if (e.fields.length > 100) return "Use at most 100 fields.";
  for (const [n, o] of e.fields.entries()) {
    const a = Qi(o, e.fields.filter((s, l) => l !== n).map(Se));
    if (a) return `${o.name || "New field"}: ${a}`;
  }
  const t = e.stages;
  if (t.prefetch.queries.some((n) => !n.name.trim() || !n.query.trim())) return "Prefetch queries need a name and a query.";
  if (!t.map.enabled && e.fields.some((n) => n.search_within === "sections")) return "Fields that read sections need Map the document.";
  const r = e.fields.find((n) => !(n.strategy === "deep" && t.deep.enabled) && !t.prefetch.enabled && !t.scout.enabled);
  return r ? `Turn on Prefetch or Scout so extraction has passages to read for ${r.name}.` : t.scout.enabled && t.scout.mode === "agent" && !t.scout.tools.length ? "Agent scouting needs at least one tool." : t.scout.enabled && t.scout.mode === "agent" && (!t.scout.max_rounds || !t.scout.max_extra_queries) ? "Agent scouting needs at least one round and one tool call per round." : t.verify.enabled && !t.verify.check_quotes && !t.verify.check_support ? "Verify needs at least one check." : e.retrieval.overlap >= e.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function al(e, t) {
  const r = (n, o) => o !== null && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.keys(o).sort().map((a) => [a, o[a]])) : o;
  return JSON.stringify(e, r) === JSON.stringify(t, r);
}
var pn = {
  name: "SpinnerIcon",
  extends: qa
};
function Xi(e) {
  return ns(e) || rs(e) || ts(e) || es();
}
function es() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ts(e, t) {
  if (e) {
    if (typeof e == "string") return Tt(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Tt(e, t) : void 0;
  }
}
function rs(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ns(e) {
  if (Array.isArray(e)) return Tt(e);
}
function Tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function os(e, t, r, n, o, a) {
  return $(), E("svg", S({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Xi(t[0] || (t[0] = [et("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
pn.render = os;
var as = `
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
`, is = {
  root: function(t) {
    var r = t.props, n = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": T(r.value) && String(r.value).length === 1,
      "p-badge-dot": be(r.value) && !n.$slots.default,
      "p-badge-sm": r.size === "small",
      "p-badge-lg": r.size === "large",
      "p-badge-xl": r.size === "xlarge",
      "p-badge-info": r.severity === "info",
      "p-badge-success": r.severity === "success",
      "p-badge-warn": r.severity === "warn",
      "p-badge-danger": r.severity === "danger",
      "p-badge-secondary": r.severity === "secondary",
      "p-badge-contrast": r.severity === "contrast"
    }];
  }
}, ss = C.extend({
  name: "badge",
  style: as,
  classes: is
}), ls = {
  name: "BaseBadge",
  extends: qe,
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
  style: ss,
  provide: function() {
    return {
      $pcBadge: this,
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
function _r(e, t, r) {
  return (t = ds(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ds(e) {
  var t = cs(e, "string");
  return Be(t) == "symbol" ? t : t + "";
}
function cs(e, t) {
  if (Be(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Be(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var un = {
  name: "Badge",
  extends: ls,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return fe(_r(_r({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, ps = ["data-p"];
function us(e, t, r, n, o, a) {
  return $(), E("span", S({
    class: e.cx("root"),
    "data-p": a.dataP
  }, e.ptmi("root")), [D(e.$slots, "default", {}, function() {
    return [Cr(lt(e.value), 1)];
  })], 16, ps);
}
un.render = us;
var ms = `
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
function Ue(e) {
  "@babel/helpers - typeof";
  return Ue = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ue(e);
}
function F(e, t, r) {
  return (t = fs(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function fs(e) {
  var t = hs(e, "string");
  return Ue(t) == "symbol" ? t : t + "";
}
function hs(e, t) {
  if (Ue(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ue(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var bs = {
  root: function(t) {
    var r = t.instance, n = t.props;
    return ["p-button p-component", F(F(F(F(F(F(F(F(F({
      "p-button-icon-only": r.hasIcon && !n.label && !n.badge,
      "p-button-vertical": (n.iconPos === "top" || n.iconPos === "bottom") && n.label,
      "p-button-loading": n.loading,
      "p-button-link": n.link || n.variant === "link"
    }, "p-button-".concat(n.severity), n.severity), "p-button-raised", n.raised), "p-button-rounded", n.rounded), "p-button-text", n.text || n.variant === "text"), "p-button-outlined", n.outlined || n.variant === "outlined"), "p-button-sm", n.size === "small"), "p-button-lg", n.size === "large"), "p-button-plain", n.plain), "p-button-fluid", r.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var r = t.props;
    return ["p-button-icon", F({}, "p-button-icon-".concat(r.iconPos), r.label)];
  },
  label: "p-button-label"
}, gs = C.extend({
  name: "button",
  style: ms,
  classes: bs
}), vs = {
  name: "BaseButton",
  extends: qe,
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
  style: gs,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function He(e) {
  "@babel/helpers - typeof";
  return He = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, He(e);
}
function z(e, t, r) {
  return (t = ys(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ys(e) {
  var t = xs(e, "string");
  return He(t) == "symbol" ? t : t + "";
}
function xs(e, t) {
  if (He(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (He(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ws = {
  name: "Button",
  extends: vs,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var r = t === "root" ? this.ptmi : this.ptm;
      return r(t, {
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
      return S(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return be(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return fe(z(z(z(z(z(z(z(z(z(z({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return fe(z(z({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return fe(z(z({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: pn,
    Badge: un
  },
  directives: {
    ripple: en
  }
}, ks = ["data-p"], _s = ["data-p"];
function Ss(e, t, r, n, o, a) {
  var s = tt("SpinnerIcon"), l = tt("Badge"), i = Pr("ripple");
  return e.asChild ? D(e.$slots, "default", {
    key: 1,
    class: bt(e.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : Or(($(), ee(ht(e.as), S({
    key: 0,
    class: e.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: gt(function() {
      return [D(e.$slots, "default", {}, function() {
        return [e.loading ? D(e.$slots, "loadingicon", S({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? ($(), E("span", S({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : ($(), ee(s, S({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : D(e.$slots, "icon", S({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? ($(), E("span", S({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": a.dataIconP
          }, e.ptm("icon")), null, 16, ks)) : V("", !0)];
        }), e.label ? ($(), E("span", S({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": a.dataLabelP
        }), lt(e.label), 17, _s)) : V("", !0), e.badge ? ($(), ee(l, {
          key: 3,
          value: e.badge,
          class: bt(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : V("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[i]]);
}
ws.render = Ss;
export {
  Ct as A,
  C as B,
  rl as C,
  nl as D,
  Qi as E,
  rn as F,
  Zi as G,
  Ws as H,
  js as I,
  Zs as J,
  qs as K,
  As as L,
  Gi as M,
  Ji as N,
  Fs as O,
  Ks as P,
  Vs as Q,
  Bs as R,
  Xs as S,
  Ms as T,
  Bo as U,
  ol as V,
  al as W,
  Ts as a,
  Ls as b,
  zs as c,
  Is as d,
  qe as e,
  T as f,
  fe as g,
  Ys as h,
  Js as i,
  Ke as j,
  y as k,
  dn as l,
  el as m,
  Us as n,
  Gs as o,
  Qs as p,
  Se as q,
  Ds as r,
  ws as s,
  tl as t,
  Cs as u,
  Es as v,
  Ns as w,
  Hs as x,
  Rs as y,
  cn as z
};
