import { hasInjectionContext as ln, inject as Qe, effectScope as cn, ref as J, markRaw as dn, createApp as pn, onMounted as ir, onUnmounted as un, watch as xe, readonly as mn, getCurrentInstance as wt, nextTick as fn, reactive as hn, renderSlot as Q, openBlock as G, createBlock as He, Teleport as sr, createCommentVNode as Se, useId as gn, mergeProps as E, h as bn, createElementBlock as $e, createElementVNode as vn, createTextVNode as yn, toDisplayString as lr, resolveComponent as kt, resolveDirective as xn, withDirectives as wn, resolveDynamicComponent as kn, withCtx as _n, normalizeClass as _t } from "vue";
import { addCollection as Sn } from "@iconify/vue";
import { config as St, addIcons as $n, on as Pn, applyThemeMode as De, host as Cn, hostCss as On, loadCss as Tn, api as R } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var nt = "data-wippy-visible";
function $t(e) {
  const t = e.getAttribute(nt);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var jn = Object.defineProperty, An = (e, t, r) => t in e ? jn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, O = (e, t, r) => An(e, typeof t != "symbol" ? t + "" : t, r), Ln = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], En = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Pt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function zn(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    if (r)
      for (const [n, o] of Object.entries(r)) {
        if ((n === "@light" || n === "@dark") && o && typeof o == "object") {
          for (const [s, l] of Object.entries(o)) {
            const a = typeof l == "string" ? Pt(s) : null;
            a && t.add(a);
          }
          continue;
        }
        const i = typeof o == "string" ? Pt(n) : null;
        i && t.add(i);
      }
  return [...t].sort();
}
function Nn(e) {
  if (e.length === 0)
    return "";
  const t = e.map((r) => `  ${r}: inherit;`).join(`
`);
  return `${En} {
${t}
}`;
}
function In(e, t) {
  const r = Nn(t);
  r && cr(e, r, "@wippy-fe/css-variables-bridge");
}
function Rn(e, t) {
  const n = (t ?? Ln).map(async (o) => {
    const i = On[o];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Tn(i);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${i}):`, s), null;
    }
  });
  return Promise.all(n).then((o) => {
    for (const i of o) {
      if (!i)
        continue;
      const s = document.createElement("style");
      s.textContent = i, s.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(s);
    }
  });
}
function Vn(e, t) {
  const r = document.createElement("style");
  r.textContent = t, e.appendChild(r);
}
function cr(e, t, r) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const n = document.createElement("style");
  n.setAttribute("role", r), n.textContent = t, e.appendChild(n);
}
function Mn(e, t) {
  cr(e, t, "@wippy-fe/custom-css");
}
function dr(e) {
  return e.__wippyHost ?? null;
}
function Dn(e) {
  return e.replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function Bn(e, t, r) {
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
function Xe(e, t) {
  const r = {}, n = [];
  for (const [o, i] of Object.entries(t.properties)) {
    const s = e.getAttribute(o), l = Dn(o);
    if (s === null) {
      i.default !== void 0 && (r[l] = i.default);
      continue;
    }
    const a = Bn(o, s, i);
    a.error ? n.push(a.error) : r[l] = a.value;
  }
  return { props: r, errors: n };
}
var Un = class {
  constructor(e, t) {
    O(this, "_props"), O(this, "_errors"), O(this, "_content"), O(this, "_hostVisibility"), O(this, "_propsListeners", /* @__PURE__ */ new Set()), O(this, "_contentListeners", /* @__PURE__ */ new Set()), O(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), O(this, "_disposed", !1), O(this, "_emitToDom"), O(this, "props"), O(this, "events"), O(this, "content"), O(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
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
}, qn = class extends HTMLElement {
  constructor() {
    super(), O(this, "_internals"), O(this, "_contentObserver", null), O(this, "_initialized", !1), O(this, "_container", null), O(this, "_reactive", null), O(this, "_lastProps", null), O(this, "_lastErrors", []), O(this, "_lastContent", null), O(this, "_themeUnsub", null), O(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = $t(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...r, nt])];
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
    return dr(this);
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
        const i = Xe(this, e.propsSchema);
        e.validateProps && i.errors.push(...e.validateProps(i.props)), r = i.props, n = i.errors, this._lastProps = r, this._lastErrors = n;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new Un(
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
        this.onInit(r), e.inlineCss && Vn(r, e.inlineCss);
        try {
          const c = St?.theming, d = zn(
            c?.global?.cssVariables,
            c?.children?.cssVariables
          );
          In(r, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const c = St?.theming, d = [c?.global?.customCSS, c?.children?.customCSS].filter(Boolean).join(`
`);
            d && Mn(r, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Rn(r, e.hostCssKeys), n = document.createElement("div"), n.setAttribute("data-wippy-theme-root", "");
        const a = e.containerClasses ?? [];
        a.length > 0 && n.classList.add(...a), r.appendChild(n), this._container = n, $n(Sn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Pn("@theme", (a) => this._applyTheme(a)));
      const { props: o, errors: i } = Xe(this, e.propsSchema);
      e.validateProps && i.push(...e.validateProps(o));
      const s = o;
      this._lastProps = s, this._lastErrors = i;
      let l = null;
      e.contentTemplate && (l = this._extractContent(e.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const a = this._extractContent(e.contentTemplate);
        this._lastContent = a, this._reactive?.notifyContent(a), this.onContentChanged(a);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, n, s, i, l, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Cn.getThemeMode?.()) {
    De(e, this), this._container && De(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), De("auto", this), this._container && De("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, r) {
    if (t === r)
      return;
    if (e === nt) {
      const l = this._hostVisible, a = $t(this);
      if (a === l)
        return;
      this._hostVisible = a, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(a, l), this.onHostVisibilityChanged(a, l));
      return;
    }
    const n = this.constructor.wippyConfig, { props: o, errors: i } = Xe(this, n.propsSchema);
    n.validateProps && i.push(...n.validateProps(o));
    const s = o;
    this._lastProps = s, this._lastErrors = i, this._reactive?.notifyProps(s, i), this.onPropsChanged(s, i);
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
function Wn(e) {
  return e.__wippyHostBus ?? null;
}
function Fn(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.1.0
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let pr;
const ur = (e) => pr = e, Hn = () => ln() && Qe(mr) || pr, mr = (
  /* istanbul ignore next */
  Symbol()
);
function Kn() {
  const e = cn(!0), t = e.run(() => J({}));
  let r = [], n = [];
  const o = dn({
    install(i) {
      ur(o), o._a = i, i.provide(mr, o), i.config.globalProperties.$pinia = o, n.forEach((s) => r.push(s)), n = [];
    },
    use(i) {
      return this._a ? r.push(i) : n.push(i), this;
    },
    _p: r,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var Yn = Object.defineProperty, Gn = (e, t, r) => t in e ? Yn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, ve = (e, t, r) => Gn(e, typeof t != "symbol" ? t + "" : t, r), fr = /* @__PURE__ */ Symbol("wippy:emit"), hr = /* @__PURE__ */ Symbol("wippy:props"), Jn = /* @__PURE__ */ Symbol("wippy:props_error"), Qn = /* @__PURE__ */ Symbol("wippy:content"), Zn = /* @__PURE__ */ Symbol("wippy:panel-id"), Xn = /* @__PURE__ */ Symbol("wippy:layout-bus"), eo = /* @__PURE__ */ Symbol("wippy:host"), gr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Li() {
  const e = Qe(hr);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function Ei() {
  const e = Qe(fr);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function to() {
  const e = Qe(gr);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function zi(e) {
  const t = to();
  let r = !1, n = null, o = !1;
  function i() {
    if (n)
      return o = !0, n;
    let s;
    try {
      s = Promise.resolve(e());
    } catch (a) {
      s = Promise.reject(a);
    }
    const l = s.finally(() => {
      if (n === l && (n = null, r && o))
        return o = !1, i();
    });
    return n = l, l;
  }
  return ir(() => (r = !0, i())), un(() => {
    r = !1, o = !1;
  }), xe(t, (s, l) => {
    if (r && l === !1 && s === !0)
      return i();
  }), t;
}
var ro = class extends qn {
  constructor() {
    super(...arguments), ve(this, "_vueApp", null), ve(this, "_propsRef", J({})), ve(this, "_errorsRef", J([])), ve(this, "_contentRef", J(null)), ve(this, "_hostVisibilityRef", J(null)), ve(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, r, n, o, i) {
    const s = this.constructor.vueConfig;
    this._propsRef.value = r, this._errorsRef.value = n, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const c of n)
      this.emitEvent("invalid", { message: c });
    const l = new AbortController();
    this._bridgeAbort = l, this.reactive.props.subscribe((c, d) => {
      this._propsRef.value = c, this._errorsRef.value = [...d];
      for (const p of d)
        this.emitEvent("invalid", { message: p });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((c) => {
      this._contentRef.value = c;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((c) => {
      this._hostVisibilityRef.value = c;
    }, { signal: l.signal });
    const a = (c) => {
      if (l.signal.aborted)
        return;
      const d = Hn(), p = pn(c.rootComponent);
      this._vueApp = p;
      const u = Kn();
      if (c.piniaPlugins)
        for (const m of c.piniaPlugins)
          u.use(m);
      if (p.use(u), c.plugins)
        for (const m of c.plugins)
          p.use(m);
      p.provide(hr, this._propsRef), p.provide(Jn, this._errorsRef), p.provide(fr, this.emitEvent.bind(this)), p.provide(Qn, this._contentRef), p.provide(gr, this._hostVisibilityRef), p.provide(Zn, Fn(this)), p.provide(Xn, Wn(this)), p.provide(eo, dr(this)), c.providers && c.providers(p, this), p.mount(t), d && ur(d);
    };
    if (s.rootComponent)
      a(s);
    else if (s.lazyConfig) {
      const c = document.createElement("wippy-loading");
      c.setAttribute("no-bg", ""), t.appendChild(c), s.lazyConfig().then((d) => {
        l.signal.aborted || (c.remove(), a(d));
      }).catch((d) => {
        if (l.signal.aborted)
          return;
        const p = d instanceof Error ? d.message : String(d), u = document.createElement("wippy-error");
        u.setAttribute("title", "Failed to load"), u.setAttribute("message", p), c.replaceWith(u), this.emitEvent("error", { message: p });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, no = Object.defineProperty, Ct = Object.getOwnPropertySymbols, oo = Object.prototype.hasOwnProperty, ao = Object.prototype.propertyIsEnumerable, Ot = (e, t, r) => t in e ? no(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, io = (e, t) => {
  for (var r in t || (t = {})) oo.call(t, r) && Ot(e, r, t[r]);
  if (Ct) for (var r of Ct(t)) ao.call(t, r) && Ot(e, r, t[r]);
  return e;
};
function ue(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function ft(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function P(e) {
  return !ue(e);
}
function W(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function br(e = {}, t = {}) {
  let r = io({}, e);
  return Object.keys(t).forEach((n) => {
    let o = n;
    W(t[o]) && o in e && W(e[o]) ? r[o] = br(e[o], t[o]) : r[o] = t[o];
  }), r;
}
function so(...e) {
  return e.reduce((t, r, n) => n === 0 ? r : br(t, r), {});
}
function N(e, ...t) {
  return ft(e) ? e(...t) : e;
}
function z(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function q(e) {
  return z(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function ht(e, t = "", r = {}) {
  let n = q(t).split("."), o = n.shift();
  if (o) {
    if (W(e)) {
      let i = Object.keys(e).find((s) => q(s) === o) || "";
      return ht(N(e[i], r), n.join("."), r);
    }
    return;
  }
  return N(e, r);
}
function vr(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function lo(e) {
  return P(e) && !isNaN(e);
}
function de(e, t) {
  if (t) {
    let r = t.test(e);
    return t.lastIndex = 0, r;
  }
  return !1;
}
function co(...e) {
  return so(...e);
}
function Pe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function po(e) {
  return z(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function yr(e) {
  return z(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function xr() {
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
function Ce(...e) {
  if (e) {
    let t = [];
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      if (!n) continue;
      let o = typeof n;
      if (o === "string" || o === "number") t.push(n);
      else if (o === "object") {
        let i = Array.isArray(n) ? [Ce(...n)] : Object.entries(n).map(([s, l]) => l ? s : void 0);
        t = i.length ? t.concat(i.filter((s) => !!s)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function uo(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function mo(e, t) {
  if (e && t) {
    let r = (n) => {
      uo(e, n) || (e.classList ? e.classList.add(n) : e.className += " " + n);
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function et(e, t) {
  if (e && t) {
    let r = (n) => {
      e.classList ? e.classList.remove(n) : e.className = e.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(r));
  }
}
function Tt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function fo(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function ho(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function go(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && ho(e));
}
function me(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Ke(e, t = {}) {
  if (me(e)) {
    let r = (n, o) => {
      var i, s;
      let l = (i = e?.$attrs) != null && i[n] ? [(s = e?.$attrs) == null ? void 0 : s[n]] : [];
      return [o].flat().reduce((a, c) => {
        if (c != null) {
          let d = typeof c;
          if (d === "string" || d === "number") a.push(c);
          else if (d === "object") {
            let p = Array.isArray(c) ? r(n, c) : Object.entries(c).map(([u, m]) => n === "style" && (m || m === 0) ? `${u.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${m}` : m ? u : void 0);
            a = p.length ? a.concat(p.filter((u) => !!u)) : a;
          }
        }
        return a;
      }, l);
    };
    Object.entries(t).forEach(([n, o]) => {
      if (o != null) {
        let i = n.match(/^on(.+)/);
        i ? e.addEventListener(i[1].toLowerCase(), o) : n === "p-bind" || n === "pBind" ? Ke(e, o) : (o = n === "class" ? [...new Set(r("class", o))].join(" ").trim() : n === "style" ? r("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[n] = o), e.setAttribute(n, o));
      }
    });
  }
}
function bo(e, t = {}, ...r) {
  {
    let n = document.createElement(e);
    return Ke(n, t), n.append(...r), n;
  }
}
function vo(e, t) {
  return me(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function yo(e, t) {
  return me(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Ni(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function xo(e, t) {
  if (me(e)) {
    let r = e.getAttribute(t);
    return isNaN(r) ? r === "true" || r === "false" ? r === "true" : r : +r;
  }
}
function wr(e, t = "") {
  let r = vo(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), n = [];
  for (let o of r) getComputedStyle(o).display != "none" && getComputedStyle(o).visibility != "hidden" && n.push(o);
  return n;
}
function Ii(e, t) {
  let r = wr(e, t);
  return r.length > 0 ? r[0] : null;
}
function jt(e) {
  if (e) {
    let t = e.offsetHeight, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingTop) + parseFloat(r.paddingBottom) + parseFloat(r.borderTopWidth) + parseFloat(r.borderBottomWidth), t;
  }
  return 0;
}
function Ri(e, t) {
  let r = wr(e, t);
  return r.length > 0 ? r[r.length - 1] : null;
}
function wo(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Tt(document.documentElement) || Tt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function ko(e, t) {
  return e ? e.offsetHeight : 0;
}
function At(e) {
  if (e) {
    let t = e.offsetWidth, r = getComputedStyle(e);
    return t -= parseFloat(r.paddingLeft) + parseFloat(r.paddingRight) + parseFloat(r.borderLeftWidth) + parseFloat(r.borderRightWidth), t;
  }
  return 0;
}
function kr() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Vi(e, t = "") {
  return me(e) ? e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`) : !1;
}
function _o(e, t = "", r) {
  me(e) && r !== null && r !== void 0 && e.setAttribute(t, r);
}
var Be = {};
function So(e = "pui_id_") {
  return Object.hasOwn(Be, e) || (Be[e] = 0), Be[e]++, `${e}${Be[e]}`;
}
var $o = Object.defineProperty, Po = Object.defineProperties, Co = Object.getOwnPropertyDescriptors, Ye = Object.getOwnPropertySymbols, _r = Object.prototype.hasOwnProperty, Sr = Object.prototype.propertyIsEnumerable, Lt = (e, t, r) => t in e ? $o(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, D = (e, t) => {
  for (var r in t || (t = {})) _r.call(t, r) && Lt(e, r, t[r]);
  if (Ye) for (var r of Ye(t)) Sr.call(t, r) && Lt(e, r, t[r]);
  return e;
}, tt = (e, t) => Po(e, Co(t)), H = (e, t) => {
  var r = {};
  for (var n in e) _r.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && Ye) for (var n of Ye(e)) t.indexOf(n) < 0 && Sr.call(e, n) && (r[n] = e[n]);
  return r;
}, Oo = xr(), j = Oo, Oe = /{([^}]*)}/g, $r = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Pr = /var\([^)]+\)/g;
function Et(e) {
  return z(e) ? e.replace(/[A-Z]/g, (t, r) => r === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function To(e) {
  return W(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function jo(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function ot(e = "", t = "") {
  return jo(`${z(e, !1) && z(t, !1) ? `${e}-` : e}${t}`);
}
function Cr(e = "", t = "") {
  return `--${ot(e, t)}`;
}
function Ao(e = "") {
  let t = (e.match(/{/g) || []).length, r = (e.match(/}/g) || []).length;
  return (t + r) % 2 !== 0;
}
function Or(e, t = "", r = "", n = [], o) {
  if (z(e)) {
    let i = e.trim();
    if (Ao(i)) return;
    if (de(i, Oe)) {
      let s = i.replaceAll(Oe, (l) => {
        let a = l.replace(/{|}/g, "").split(".").filter((c) => !n.some((d) => de(c, d)));
        return `var(${Cr(r, yr(a.join("-")))}${P(o) ? `, ${o}` : ""})`;
      });
      return de(s.replace(Pr, "0"), $r) ? `calc(${s})` : s;
    }
    return i;
  } else if (lo(e)) return e;
}
function Lo(e, t, r) {
  z(t, !1) && e.push(`${t}:${r};`);
}
function ye(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Tr(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function r(s, l) {
    let a = [], c = 0, d = "", p = null, u = 0;
    for (; c <= s.length; ) {
      let m = s[c];
      if ((m === '"' || m === "'" || m === "`") && s[c - 1] !== "\\" && (p = p === m ? null : m), !p && (m === "(" && u++, m === ")" && u--, (m === "," || c === s.length) && u === 0)) {
        let h = d.trim();
        h.startsWith("dt(") ? a.push(Tr(h, l)) : a.push(n(h)), d = "", c++;
        continue;
      }
      m !== void 0 && (d += m), c++;
    }
    return a;
  }
  function n(s) {
    let l = s[0];
    if ((l === '"' || l === "'" || l === "`") && s[s.length - 1] === l) return s.slice(1, -1);
    let a = Number(s);
    return isNaN(a) ? s : a;
  }
  let o = [], i = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") i.push(s), s += 2;
  else if (e[s] === ")" && i.length > 0) {
    let l = i.pop();
    i.length === 0 && o.push([l, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [l, a] = o[s], c = e.slice(l + 3, a), d = r(c, t), p = t(...d);
    e = e.slice(0, l) + p + e.slice(a + 1);
  }
  return e;
}
var pe = (...e) => Eo(S.getTheme(), ...e), Eo = (e = {}, t, r, n) => {
  if (t) {
    let { variable: o, options: i } = S.defaults || {}, { prefix: s, transform: l } = e?.options || i || {}, a = de(t, Oe) ? t : `{${t}}`;
    return n === "value" || ue(n) && l === "strict" ? S.getTokenValue(t) : Or(a, void 0, s, [o.excludedKeyRegex], r);
  }
  return "";
};
function Ue(e, ...t) {
  if (e instanceof Array) {
    let r = e.reduce((n, o, i) => {
      var s;
      return n + o + ((s = N(t[i], { dt: pe })) != null ? s : "");
    }, "");
    return Tr(r, pe);
  }
  return N(e, { dt: pe });
}
function zo(e, t = {}) {
  let r = S.defaults.variable, { prefix: n = r.prefix, selector: o = r.selector, excludedKeyRegex: i = r.excludedKeyRegex } = t, s = [], l = [], a = [{ node: e, path: n }];
  for (; a.length; ) {
    let { node: d, path: p } = a.pop();
    for (let u in d) {
      let m = d[u], h = To(m), b = de(u, i) ? ot(p) : ot(p, yr(u));
      if (W(h)) a.push({ node: h, path: b });
      else {
        let g = Cr(b), v = Or(h, b, n, [i]);
        Lo(l, g, v);
        let k = b;
        n && k.startsWith(n + "-") && (k = k.slice(n.length + 1)), s.push(k.replace(/-/g, "."));
      }
    }
  }
  let c = l.join("");
  return { value: l, tokens: s, declarations: c, css: ye(o, c) };
}
var V = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
  return zo(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var i, s, l, a, c, d, p;
  let { preset: u, options: m } = t, h, b, g, v, k, $, f;
  if (P(u) && m.transform !== "strict") {
    let { primitive: x, semantic: T, extend: I } = u, Z = T || {}, { colorScheme: X } = Z, oe = H(Z, ["colorScheme"]), ee = I || {}, { colorScheme: ae } = ee, ie = H(ee, ["colorScheme"]), te = X || {}, { dark: se } = te, fe = H(te, ["dark"]), le = ae || {}, { dark: he } = le, ge = H(le, ["dark"]), F = P(x) ? this._toVariables({ primitive: x }, m) : {}, B = P(oe) ? this._toVariables({ semantic: oe }, m) : {}, ce = P(fe) ? this._toVariables({ light: fe }, m) : {}, Me = P(se) ? this._toVariables({ dark: se }, m) : {}, be = P(ie) ? this._toVariables({ semantic: ie }, m) : {}, yt = P(ge) ? this._toVariables({ light: ge }, m) : {}, xt = P(he) ? this._toVariables({ dark: he }, m) : {}, [qr, Wr] = [(i = F.declarations) != null ? i : "", F.tokens], [Fr, Hr] = [(s = B.declarations) != null ? s : "", B.tokens || []], [Kr, Yr] = [(l = ce.declarations) != null ? l : "", ce.tokens || []], [Gr, Jr] = [(a = Me.declarations) != null ? a : "", Me.tokens || []], [Qr, Zr] = [(c = be.declarations) != null ? c : "", be.tokens || []], [Xr, en] = [(d = yt.declarations) != null ? d : "", yt.tokens || []], [tn, rn] = [(p = xt.declarations) != null ? p : "", xt.tokens || []];
    h = this.transformCSS(e, qr, "light", "variable", m, n, o), b = Wr;
    let nn = this.transformCSS(e, `${Fr}${Kr}`, "light", "variable", m, n, o), on = this.transformCSS(e, `${Gr}`, "dark", "variable", m, n, o);
    g = `${nn}${on}`, v = [.../* @__PURE__ */ new Set([...Hr, ...Yr, ...Jr])];
    let an = this.transformCSS(e, `${Qr}${Xr}color-scheme:light`, "light", "variable", m, n, o), sn = this.transformCSS(e, `${tn}color-scheme:dark`, "dark", "variable", m, n, o);
    k = `${an}${sn}`, $ = [.../* @__PURE__ */ new Set([...Zr, ...en, ...rn])], f = N(u.css, { dt: pe });
  }
  return { primitive: { css: h, tokens: b }, semantic: { css: g, tokens: v }, global: { css: k, tokens: $ }, style: f };
}, getPreset({ name: e = "", preset: t = {}, options: r, params: n, set: o, defaults: i, selector: s }) {
  var l, a, c;
  let d, p, u;
  if (P(t) && r.transform !== "strict") {
    let m = e.replace("-directive", ""), h = t, { colorScheme: b, extend: g, css: v } = h, k = H(h, ["colorScheme", "extend", "css"]), $ = g || {}, { colorScheme: f } = $, x = H($, ["colorScheme"]), T = b || {}, { dark: I } = T, Z = H(T, ["dark"]), X = f || {}, { dark: oe } = X, ee = H(X, ["dark"]), ae = P(k) ? this._toVariables({ [m]: D(D({}, k), x) }, r) : {}, ie = P(Z) ? this._toVariables({ [m]: D(D({}, Z), ee) }, r) : {}, te = P(I) ? this._toVariables({ [m]: D(D({}, I), oe) }, r) : {}, [se, fe] = [(l = ae.declarations) != null ? l : "", ae.tokens || []], [le, he] = [(a = ie.declarations) != null ? a : "", ie.tokens || []], [ge, F] = [(c = te.declarations) != null ? c : "", te.tokens || []], B = this.transformCSS(m, `${se}${le}`, "light", "variable", r, o, i, s), ce = this.transformCSS(m, ge, "dark", "variable", r, o, i, s);
    d = `${B}${ce}`, p = [.../* @__PURE__ */ new Set([...fe, ...he, ...F])], u = N(v, { dt: pe });
  }
  return { css: d, tokens: p, style: u };
}, getPresetC({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var i;
  let { preset: s, options: l } = t, a = (i = s?.components) == null ? void 0 : i[e];
  return this.getPreset({ name: e, preset: a, options: l, params: r, set: n, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: r, set: n, defaults: o }) {
  var i, s;
  let l = e.replace("-directive", ""), { preset: a, options: c } = t, d = ((i = a?.components) == null ? void 0 : i[l]) || ((s = a?.directives) == null ? void 0 : s[l]);
  return this.getPreset({ name: l, preset: d, options: c, params: r, set: n, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var r;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (r = e.darkModeSelector) != null ? r : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, r, n) {
  let { cssLayer: o } = t;
  return o ? `@layer ${N(o.order || o.name || "primeui", r)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: i }) {
  let s = this.getCommon({ name: e, theme: t, params: r, set: o, defaults: i }), l = Object.entries(n).reduce((a, [c, d]) => a.push(`${c}="${d}"`) && a, []).join(" ");
  return Object.entries(s || {}).reduce((a, [c, d]) => {
    if (W(d) && Object.hasOwn(d, "css")) {
      let p = Pe(d.css), u = `${c}-variables`;
      a.push(`<style type="text/css" data-primevue-style-id="${u}" ${l}>${p}</style>`);
    }
    return a;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: r, props: n = {}, set: o, defaults: i }) {
  var s;
  let l = { name: e, theme: t, params: r, set: o, defaults: i }, a = (s = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : s.css, c = Object.entries(n).reduce((d, [p, u]) => d.push(`${p}="${u}"`) && d, []).join(" ");
  return a ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${Pe(a)}</style>` : "";
}, createTokens(e = {}, t, r = "", n = "", o = {}) {
  let i = function(l, a = {}, c = []) {
    if (c.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: a, value: void 0 };
    c.push(this.path), a.name = this.path, a.binding || (a.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && Oe.test(this.value)) {
      let p = this.value.trim().replace(Oe, (u) => {
        var m;
        let h = u.slice(1, -1), b = this.tokens[h];
        if (!b) return console.warn(`Token not found for path: ${h}`), "__UNRESOLVED__";
        let g = b.computed(l, a, c);
        return Array.isArray(g) && g.length === 2 ? `light-dark(${g[0].value},${g[1].value})` : (m = g?.value) != null ? m : "__UNRESOLVED__";
      });
      d = $r.test(p.replace(Pr, "0")) ? `calc(${p})` : p;
    }
    return ue(a.binding) && delete a.binding, c.pop(), { colorScheme: l, path: this.path, paths: a, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, s = (l, a, c) => {
    Object.entries(l).forEach(([d, p]) => {
      let u = de(d, t.variable.excludedKeyRegex) ? a : a ? `${a}.${Et(d)}` : Et(d), m = c ? `${c}.${d}` : d;
      W(p) ? s(p, u, m) : (o[u] || (o[u] = { paths: [], computed: (h, b = {}, g = []) => {
        if (o[u].paths.length === 1) return o[u].paths[0].computed(o[u].paths[0].scheme, b.binding, g);
        if (h && h !== "none") for (let v = 0; v < o[u].paths.length; v++) {
          let k = o[u].paths[v];
          if (k.scheme === h) return k.computed(h, b.binding, g);
        }
        return o[u].paths.map((v) => v.computed(v.scheme, b[v.scheme], g));
      } }), o[u].paths.push({ path: m, value: p, scheme: m.includes("colorScheme.light") ? "light" : m.includes("colorScheme.dark") ? "dark" : "none", computed: i, tokens: o }));
    });
  };
  return s(e, r, n), o;
}, getTokenValue(e, t, r) {
  var n;
  let o = ((l) => l.split(".").filter((a) => !de(a.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t), i = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(n = e[o]) == null ? void 0 : n.computed(i)].flat().filter((l) => l);
  return s.length === 1 ? s[0].value : s.reduce((l = {}, a) => {
    let c = a, { colorScheme: d } = c, p = H(c, ["colorScheme"]);
    return l[d] = p, l;
  }, void 0);
}, getSelectorRule(e, t, r, n) {
  return r === "class" || r === "attr" ? ye(P(t) ? `${e}${t},${e} ${t}` : e, n) : ye(e, ye(t ?? ":root,:host", n));
}, transformCSS(e, t, r, n, o = {}, i, s, l) {
  if (P(t)) {
    let { cssLayer: a } = o;
    if (n !== "style") {
      let c = this.getColorSchemeOption(o, s);
      t = r === "dark" ? c.reduce((d, { type: p, selector: u }) => (P(u) && (d += u.includes("[CSS]") ? u.replace("[CSS]", t) : this.getSelectorRule(u, l, p, t)), d), "") : ye(l ?? ":root,:host", t);
    }
    if (a) {
      let c = { name: "primeui" };
      W(a) && (c.name = N(a.name, { name: e, type: n })), P(c.name) && (t = ye(`@layer ${c.name}`, t), i?.layerNames(c.name));
    }
    return t;
  }
  return "";
} }, S = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = tt(D({}, t), { options: D(D({}, this.defaults.options), t.options) }), this._tokens = V.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this._theme = tt(D({}, this.theme), { preset: e }), this._tokens = V.createTokens(e, this.defaults), this.clearLoadedStyleNames(), j.emit("preset:change", e), j.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = tt(D({}, this.theme), { options: e }), this.clearLoadedStyleNames(), j.emit("options:change", e), j.emit("theme:change", this.theme);
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
  return V.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return V.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPresetC(r);
}, getDirective(e = "", t) {
  let r = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPresetD(r);
}, getCustomPreset(e = "", t, r, n) {
  let o = { name: e, preset: t, options: this.options, selector: r, params: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return V.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, r = "style", n) {
  return V.transformCSS(e, t, n, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, r = {}) {
  return V.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, r = {}) {
  return V.getStyleSheet({ name: e, theme: this.theme, params: t, props: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), j.emit(`theme:${t}:load`, e), !this._loadingStyles.size && j.emit("theme:load"));
} }, A = {
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
}, No = `
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
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function zt(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Nt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zt(Object(r), !0).forEach(function(n) {
      Io(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : zt(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Io(e, t, r) {
  return (t = Ro(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ro(e) {
  var t = Vo(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function Vo(e, t) {
  if (Te(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Te(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Mo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  wt() && wt().components ? ir(e) : t ? e() : fn(e);
}
var Do = 0;
function Bo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = J(!1), n = J(e), o = J(null), i = kr() ? window.document : void 0, s = t.document, l = s === void 0 ? i : s, a = t.immediate, c = a === void 0 ? !0 : a, d = t.manual, p = d === void 0 ? !1 : d, u = t.name, m = u === void 0 ? "style_".concat(++Do) : u, h = t.id, b = h === void 0 ? void 0 : h, g = t.media, v = g === void 0 ? void 0 : g, k = t.nonce, $ = k === void 0 ? void 0 : k, f = t.first, x = f === void 0 ? !1 : f, T = t.onMounted, I = T === void 0 ? void 0 : T, Z = t.onUpdated, X = Z === void 0 ? void 0 : Z, oe = t.onLoad, ee = oe === void 0 ? void 0 : oe, ae = t.props, ie = ae === void 0 ? {} : ae, te = function() {
  }, se = function(he) {
    var ge = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var F = Nt(Nt({}, ie), ge), B = F.name || m, ce = F.id || b, Me = F.nonce || $;
      o.value = l.querySelector('style[data-primevue-style-id="'.concat(B, '"]')) || l.getElementById(ce) || l.createElement("style"), o.value.isConnected || (n.value = he || e, Ke(o.value, {
        type: "text/css",
        id: ce,
        media: v,
        nonce: Me
      }), x ? l.head.prepend(o.value) : l.head.appendChild(o.value), _o(o.value, "data-primevue-style-id", B), Ke(o.value, F), o.value.onload = function(be) {
        return ee?.(be, {
          name: B
        });
      }, I?.(B)), !r.value && (te = xe(n, function(be) {
        o.value.textContent = be, X?.(B);
      }, {
        immediate: !0
      }), r.value = !0);
    }
  }, fe = function() {
    !l || !r.value || (te(), go(o.value) && l.head.removeChild(o.value), r.value = !1, o.value = null);
  };
  return c && !p && Mo(se), {
    id: b,
    name: m,
    el: o,
    css: n,
    unload: fe,
    load: se,
    isLoaded: mn(r)
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
var It, Rt, Vt, Mt;
function Dt(e, t) {
  return Fo(e) || Wo(e, t) || qo(e, t) || Uo();
}
function Uo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qo(e, t) {
  if (e) {
    if (typeof e == "string") return Bt(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Bt(e, t) : void 0;
  }
}
function Bt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Wo(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (r = r.call(e)).next, t !== 0) for (; !(a = (n = i.call(r)).done) && (l.push(n.value), l.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function Fo(e) {
  if (Array.isArray(e)) return e;
}
function Ut(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ut(Object(r), !0).forEach(function(n) {
      Ho(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ut(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ho(e, t, r) {
  return (t = Ko(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Ko(e) {
  var t = Yo(e, "string");
  return je(t) == "symbol" ? t : t + "";
}
function Yo(e, t) {
  if (je(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (je(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function qe(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Go = function(t) {
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
}, Jo = {}, Qo = {}, C = {
  name: "base",
  css: Go,
  style: No,
  classes: Jo,
  inlineStyles: Qo,
  load: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(i) {
      return i;
    }, o = n(Ue(It || (It = qe(["", ""])), t));
    return P(o) ? Bo(Pe(o), rt({
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
      return S.transformCSS(r.name || t.name, "".concat(o).concat(Ue(Rt || (Rt = qe(["", ""])), n)));
    });
  },
  getCommonTheme: function(t) {
    return S.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return S.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return S.getDirective(this.name, t);
  },
  getPresetTheme: function(t, r, n) {
    return S.getCustomPreset(this.name, t, r, n);
  },
  getLayerOrderThemeCSS: function() {
    return S.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var n = N(this.css, {
        dt: pe
      }) || "", o = Pe(Ue(Vt || (Vt = qe(["", "", ""])), n, t)), i = Object.entries(r).reduce(function(s, l) {
        var a = Dt(l, 2), c = a[0], d = a[1];
        return s.push("".concat(c, '="').concat(d, '"')) && s;
      }, []).join(" ");
      return P(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(i, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return S.getCommonStyleSheet(this.name, t, r);
  },
  getThemeStyleSheet: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = [S.getStyleSheet(this.name, t, r)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), i = Ue(Mt || (Mt = qe(["", ""])), N(this.style, {
        dt: pe
      })), s = Pe(S.transformCSS(o, i)), l = Object.entries(r).reduce(function(a, c) {
        var d = Dt(c, 2), p = d[0], u = d[1];
        return a.push("".concat(p, '="').concat(u, '"')) && a;
      }, []).join(" ");
      P(s) && n.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(l, ">").concat(s, "</style>"));
    }
    return n.join("");
  },
  extend: function(t) {
    return rt(rt({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, ne = xr();
function Ae(e) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ae(e);
}
function qt(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function We(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? qt(Object(r), !0).forEach(function(n) {
      Zo(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : qt(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Zo(e, t, r) {
  return (t = Xo(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Xo(e) {
  var t = ea(e, "string");
  return Ae(t) == "symbol" ? t : t + "";
}
function ea(e, t) {
  if (Ae(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ae(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ta = {
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
    text: [A.STARTS_WITH, A.CONTAINS, A.NOT_CONTAINS, A.ENDS_WITH, A.EQUALS, A.NOT_EQUALS],
    numeric: [A.EQUALS, A.NOT_EQUALS, A.LESS_THAN, A.LESS_THAN_OR_EQUAL_TO, A.GREATER_THAN, A.GREATER_THAN_OR_EQUAL_TO],
    date: [A.DATE_IS, A.DATE_IS_NOT, A.DATE_BEFORE, A.DATE_AFTER]
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
}, ra = Symbol();
function na(e, t) {
  var r = {
    config: hn(t)
  };
  return e.config.globalProperties.$primevue = r, e.provide(ra, r), oa(), aa(e, r), r;
}
var we = [];
function oa() {
  j.clear(), we.forEach(function(e) {
    return e?.();
  }), we = [];
}
function aa(e, t) {
  var r = J(!1), n = function() {
    var c;
    if (((c = t.config) === null || c === void 0 ? void 0 : c.theme) !== "none" && !S.isStyleNameLoaded("common")) {
      var d, p, u = ((d = C.getCommonTheme) === null || d === void 0 ? void 0 : d.call(C)) || {}, m = u.primitive, h = u.semantic, b = u.global, g = u.style, v = {
        nonce: (p = t.config) === null || p === void 0 || (p = p.csp) === null || p === void 0 ? void 0 : p.nonce
      };
      C.load(m?.css, We({
        name: "primitive-variables"
      }, v)), C.load(h?.css, We({
        name: "semantic-variables"
      }, v)), C.load(b?.css, We({
        name: "global-variables"
      }, v)), C.loadStyle(We({
        name: "global-style"
      }, v), g), S.setLoadedStyleName("common");
    }
  };
  j.on("theme:change", function(a) {
    r.value || (e.config.globalProperties.$primevue.config.theme = a, r.value = !0);
  });
  var o = xe(t.config, function(a, c) {
    ne.emit("config:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = xe(function() {
    return t.config.ripple;
  }, function(a, c) {
    ne.emit("config:ripple:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = xe(function() {
    return t.config.theme;
  }, function(a, c) {
    r.value || S.setTheme(a), t.config.unstyled || n(), r.value = !1, ne.emit("config:theme:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = xe(function() {
    return t.config.unstyled;
  }, function(a, c) {
    !a && t.config.theme && n(), ne.emit("config:unstyled:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  });
  we.push(o), we.push(i), we.push(s), we.push(l);
}
var ia = {
  install: function(t, r) {
    var n = co(ta, r);
    na(t, n);
  }
}, jr = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = kr();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function sa(e, t, r, n, o, i) {
  return i.inline ? Q(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (G(), He(sr, {
    key: 1,
    to: r.appendTo
  }, [Q(e.$slots, "default")], 8, ["to"])) : Se("", !0);
}
jr.render = sa;
var re = {
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
function la() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = gn();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var Wt = C.extend({
  name: "common"
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function ca(e) {
  return Er(e) || da(e) || Lr(e) || Ar();
}
function da(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ke(e, t) {
  return Er(e) || pa(e, t) || Lr(e, t) || Ar();
}
function Ar() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Lr(e, t) {
  if (e) {
    if (typeof e == "string") return at(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? at(e, t) : void 0;
  }
}
function at(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function pa(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        a = !1;
      } else for (; !(a = (n = i.call(r)).done) && (l.push(n.value), l.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function Er(e) {
  if (Array.isArray(e)) return e;
}
function Ft(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ft(Object(r), !0).forEach(function(n) {
      _e(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ft(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function _e(e, t, r) {
  return (t = ua(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ua(e) {
  var t = ma(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function ma(e, t) {
  if (Le(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Le(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var gt = {
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
    var t, r, n, o, i, s, l, a, c, d, p, u = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, m = u ? (r = this.pt) === null || r === void 0 || (r = r.originalValue) === null || r === void 0 ? void 0 : r[this.$.type.name] : void 0, h = u ? (n = this.pt) === null || n === void 0 || (n = n.value) === null || n === void 0 ? void 0 : n[this.$.type.name] : this.pt;
    (o = h || m) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (i = o.onBeforeCreate) === null || i === void 0 || i.call(o);
    var b = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, g = b ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, v = b ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.value : (c = this.$primevue) === null || c === void 0 || (c = c.config) === null || c === void 0 ? void 0 : c.pt;
    (d = v || g) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (p = d.onBeforeCreate) === null || p === void 0 || p.call(d), this.$attrSelector = la(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = yo(me(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = w({
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
      return ft(t) ? t.apply(void 0, n) : E.apply(void 0, n);
    },
    _load: function() {
      re.isStyleNameLoaded("base") || (C.loadCSS(this.$styleOptions), this._loadGlobalStyles(), re.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, r;
      !re.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name && (Wt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), re.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      P(t) && C.load(t, w({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, r;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!S.isStyleNameLoaded("common")) {
          var n, o, i = ((n = this.$style) === null || n === void 0 || (o = n.getCommonTheme) === null || o === void 0 ? void 0 : o.call(n)) || {}, s = i.primitive, l = i.semantic, a = i.global, c = i.style;
          C.load(s?.css, w({
            name: "primitive-variables"
          }, this.$styleOptions)), C.load(l?.css, w({
            name: "semantic-variables"
          }, this.$styleOptions)), C.load(a?.css, w({
            name: "global-variables"
          }, this.$styleOptions)), C.loadStyle(w({
            name: "global-style"
          }, this.$styleOptions), c), S.setLoadedStyleName("common");
        }
        if (!S.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (r = this.$style) !== null && r !== void 0 && r.name) {
          var d, p, u, m, h = ((d = this.$style) === null || d === void 0 || (p = d.getComponentTheme) === null || p === void 0 ? void 0 : p.call(d)) || {}, b = h.css, g = h.style;
          (u = this.$style) === null || u === void 0 || u.load(b, w({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (m = this.$style) === null || m === void 0 || m.loadStyle(w({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), g), S.setLoadedStyleName(this.$style.name);
        }
        if (!S.isStyleNameLoaded("layer-order")) {
          var v, k, $ = (v = this.$style) === null || v === void 0 || (k = v.getLayerOrderThemeCSS) === null || k === void 0 ? void 0 : k.call(v);
          C.load($, w({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), S.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var r, n, o, i = ((r = this.$style) === null || r === void 0 || (n = r.getPresetTheme) === null || n === void 0 ? void 0 : n.call(r, t, "[".concat(this.$attrSelector, "]"))) || {}, s = i.css, l = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, w({
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
      re.clearLoadedStyleNames(), j.on("theme:change", t);
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
      return ht(t, r, n);
    },
    _getPTValue: function() {
      var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(n) && !!o[n.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, a = l.mergeSections, c = a === void 0 ? !0 : a, d = l.mergeProps, p = d === void 0 ? !1 : d, u = i ? s ? this._useGlobalPT(this._getPTClassValue, n, o) : this._useDefaultPT(this._getPTClassValue, n, o) : void 0, m = s ? void 0 : this._getPTSelf(r, this._getPTClassValue, n, w(w({}, o), {}, {
        global: u || {}
      })), h = this._getPTDatasets(n);
      return c || !c && m ? p ? this._mergeProps(p, u, m, h) : w(w(w({}, u), m), h) : w(w({}, m), h);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
        n[o - 1] = arguments[o];
      return E(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(n)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(n))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", i = n === "root" && P((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return n !== "transition" && w(w({}, n === "root" && w(w(_e({}, "".concat(o, "name"), q(i ? (r = this.pt) === null || r === void 0 ? void 0 : r["data-pc-section"] : this.$.type.name)), i && _e({}, "".concat(o, "extend"), q(this.$.type.name))), {}, _e({}, "".concat(this.$attrSelector), ""))), {}, _e({}, "".concat(o, "section"), q(n)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return z(t) || vr(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var r = this, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, i = function(l) {
        var a, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = o ? o(l) : l, p = q(n), u = q(r.$name);
        return (a = c ? p !== u ? d?.[p] : void 0 : d?.[p]) !== null && a !== void 0 ? a : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: i(t.originalValue),
        value: i(t.value)
      } : i(t, !0);
    },
    _usePT: function(t, r, n, o) {
      var i = function(b) {
        return r(b, n, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, l = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, a = l.mergeSections, c = a === void 0 ? !0 : a, d = l.mergeProps, p = d === void 0 ? !1 : d, u = i(t.originalValue), m = i(t.value);
        return u === void 0 && m === void 0 ? void 0 : z(m) ? m : z(u) ? u : c || !c && m ? p ? this._mergeProps(p, u, m) : w(w({}, u), m) : m;
      }
      return i(t);
    },
    _useGlobalPT: function(t, r, n) {
      return this._usePT(this.globalPT, t, r, n);
    },
    _useDefaultPT: function(t, r, n) {
      return this._usePT(this.defaultPT, t, r, n);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, w(w({}, this.$params), r));
    },
    ptmi: function() {
      var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = E(this.$_attrsWithoutPT, this.ptm(r, n));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, r, w({
        instance: this
      }, n), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, w(w({}, this.$params), r));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (r) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, w(w({}, this.$params), n)), i = this._getOptionValue(Wt.inlineStyles, t, w(w({}, this.$params), n));
        return [i, o];
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
        return r._getOptionValue(n, r.$name, w({}, r.$params)) || N(n, w({}, r.$params));
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
        var o = ke(n, 1), i = o[0];
        return r?.includes(i);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return w(w({
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
        var r = ke(t, 1), n = r[0];
        return n?.startsWith("pt:");
      }).reduce(function(t, r) {
        var n = ke(r, 2), o = n[0], i = n[1], s = o.split(":"), l = ca(s), a = at(l).slice(1);
        return a?.reduce(function(c, d, p, u) {
          return !c[d] && (c[d] = p === u.length - 1 ? i : {}), c[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var r = ke(t, 1), n = r[0];
        return !(n != null && n.startsWith("pt:"));
      }).reduce(function(t, r) {
        var n = ke(r, 2), o = n[0], i = n[1];
        return t[o] = i, t;
      }, {});
    }
  }
}, fa = `
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
`, ha = C.extend({
  name: "baseicon",
  css: fa
});
function Ee(e) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ee(e);
}
function Ht(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Kt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ht(Object(r), !0).forEach(function(n) {
      ga(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ht(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ga(e, t, r) {
  return (t = ba(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ba(e) {
  var t = va(e, "string");
  return Ee(t) == "symbol" ? t : t + "";
}
function va(e, t) {
  if (Ee(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ee(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ya = {
  name: "BaseIcon",
  extends: gt,
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
  style: ha,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = ue(this.label);
      return Kt(Kt({}, !this.isUnstyled && {
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
function ze(e) {
  "@babel/helpers - typeof";
  return ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ze(e);
}
function Yt(e, t) {
  return _a(e) || ka(e, t) || wa(e, t) || xa();
}
function xa() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wa(e, t) {
  if (e) {
    if (typeof e == "string") return Gt(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Gt(e, t) : void 0;
  }
}
function Gt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ka(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, o, i, s, l = [], a = !0, c = !1;
    try {
      if (i = (r = r.call(e)).next, t !== 0) for (; !(a = (n = i.call(r)).done) && (l.push(n.value), l.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && r.return != null && (s = r.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return l;
  }
}
function _a(e) {
  if (Array.isArray(e)) return e;
}
function Jt(e, t) {
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
    t % 2 ? Jt(Object(r), !0).forEach(function(n) {
      it(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jt(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function it(e, t, r) {
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
var y = {
  _getMeta: function() {
    return [W(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], N(W(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, r) {
    var n, o, i;
    return (n = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (r == null || (i = r.ctx) === null || i === void 0 || (i = i.appContext) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.globalProperties) === null || i === void 0 ? void 0 : i.$primevue)) === null || n === void 0 ? void 0 : n.config;
  },
  _getOptionValue: ht,
  _getPTValue: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = function() {
      var k = y._getOptionValue.apply(y, arguments);
      return z(k) || vr(k) ? {
        class: k
      } : k;
    }, c = ((t = n.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((r = n.$primevueConfig) === null || r === void 0 ? void 0 : r.ptOptions) || {}, d = c.mergeSections, p = d === void 0 ? !0 : d, u = c.mergeProps, m = u === void 0 ? !1 : u, h = l ? y._useDefaultPT(n, n.defaultPT(), a, i, s) : void 0, b = y._usePT(n, y._getPT(o, n.$name), a, i, _(_({}, s), {}, {
      global: h || {}
    })), g = y._getPTDatasets(n, i);
    return p || !p && b ? m ? y._mergeProps(n, m, h, b, g) : _(_(_({}, h), b), g) : _(_({}, b), g);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = "data-pc-";
    return _(_({}, r === "root" && it({}, "".concat(n, "name"), q(t.$name))), {}, it({}, "".concat(n, "section"), q(r)));
  },
  _getPT: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", n = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var l, a = n ? n(s) : s, c = q(r);
      return (l = a?.[c]) !== null && l !== void 0 ? l : a;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0, s = function(g) {
      return n(g, o, i);
    };
    if (r && Object.hasOwn(r, "_usept")) {
      var l, a = r._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, c = a.mergeSections, d = c === void 0 ? !0 : c, p = a.mergeProps, u = p === void 0 ? !1 : p, m = s(r.originalValue), h = s(r.value);
      return m === void 0 && h === void 0 ? void 0 : z(h) ? h : z(m) ? m : d || !d && h ? u ? y._mergeProps(t, u, m, h) : _(_({}, m), h) : h;
    }
    return s(r);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0;
    return y._usePT(t, r, n, o, i);
  },
  _loadStyles: function() {
    var t, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, i = y._getConfig(n, o), s = {
      nonce: i == null || (t = i.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    y._loadCoreStyles(r, s), y._loadThemeStyles(r, s), y._loadScopedThemeStyles(r, s), y._removeThemeListeners(r), r.$loadStyles = function() {
      return y._loadThemeStyles(r, s);
    }, y._themeChangeListener(r.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, r, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!re.isStyleNameLoaded((t = n.$style) === null || t === void 0 ? void 0 : t.name) && (r = n.$style) !== null && r !== void 0 && r.name) {
      var i;
      C.loadCSS(o), (i = n.$style) === null || i === void 0 || i.loadCSS(o), re.setLoadedStyleName(n.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, r, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!S.isStyleNameLoaded("common")) {
        var s, l, a = ((s = o.$style) === null || s === void 0 || (l = s.getCommonTheme) === null || l === void 0 ? void 0 : l.call(s)) || {}, c = a.primitive, d = a.semantic, p = a.global, u = a.style;
        C.load(c?.css, _({
          name: "primitive-variables"
        }, i)), C.load(d?.css, _({
          name: "semantic-variables"
        }, i)), C.load(p?.css, _({
          name: "global-variables"
        }, i)), C.loadStyle(_({
          name: "global-style"
        }, i), u), S.setLoadedStyleName("common");
      }
      if (!S.isStyleNameLoaded((r = o.$style) === null || r === void 0 ? void 0 : r.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
        var m, h, b, g, v = ((m = o.$style) === null || m === void 0 || (h = m.getDirectiveTheme) === null || h === void 0 ? void 0 : h.call(m)) || {}, k = v.css, $ = v.style;
        (b = o.$style) === null || b === void 0 || b.load(k, _({
          name: "".concat(o.$style.name, "-variables")
        }, i)), (g = o.$style) === null || g === void 0 || g.loadStyle(_({
          name: "".concat(o.$style.name, "-style")
        }, i), $), S.setLoadedStyleName(o.$style.name);
      }
      if (!S.isStyleNameLoaded("layer-order")) {
        var f, x, T = (f = o.$style) === null || f === void 0 || (x = f.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(f);
        C.load(T, _({
          name: "layer-order",
          first: !0
        }, i)), S.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, n = t.preset();
    if (n && t.$attrSelector) {
      var o, i, s, l = ((o = t.$style) === null || o === void 0 || (i = o.getPresetTheme) === null || i === void 0 ? void 0 : i.call(o, n, "[".concat(t.$attrSelector, "]"))) || {}, a = l.css, c = (s = t.$style) === null || s === void 0 ? void 0 : s.load(a, _({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, r));
      t.scopedStyleEl = c.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    re.clearLoadedStyleNames(), j.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    j.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, r, n, o, i, s) {
    var l, a, c = "on".concat(po(r)), d = y._getConfig(o, i), p = n?.$instance, u = y._usePT(p, y._getPT(o == null || (l = o.value) === null || l === void 0 ? void 0 : l.pt, t), y._getOptionValue, "hooks.".concat(c)), m = y._useDefaultPT(p, d == null || (a = d.pt) === null || a === void 0 || (a = a.directives) === null || a === void 0 ? void 0 : a[t], y._getOptionValue, "hooks.".concat(c)), h = {
      el: n,
      binding: o,
      vnode: i,
      prevVnode: s
    };
    u?.(p, h), m?.(p, h);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++)
      n[o - 2] = arguments[o];
    return ft(t) ? t.apply(void 0, n) : E.apply(void 0, n);
  },
  _extend: function(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = function(l, a, c, d, p) {
      var u, m, h, b;
      a._$instances = a._$instances || {};
      var g = y._getConfig(c, d), v = a._$instances[t] || {}, k = ue(v) ? _(_({}, r), r?.methods) : {};
      a._$instances[t] = _(_({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: a,
        $binding: c,
        $modifiers: c?.modifiers,
        $value: c?.value,
        $el: v.$el || a || void 0,
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
        $primevueConfig: g,
        $attrSelector: (u = a.$pd) === null || u === void 0 || (u = u[t]) === null || u === void 0 ? void 0 : u.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return y._getPT(g?.pt, void 0, function(f) {
            var x;
            return f == null || (x = f.directives) === null || x === void 0 ? void 0 : x[t];
          });
        },
        isUnstyled: function() {
          var f, x;
          return ((f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.unstyled) !== void 0 ? (x = a._$instances[t]) === null || x === void 0 || (x = x.$binding) === null || x === void 0 || (x = x.value) === null || x === void 0 ? void 0 : x.unstyled : g?.unstyled;
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
          var f, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return y._getPTValue(a._$instances[t], (f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.pt, x, _({}, T));
        },
        ptmo: function() {
          var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", T = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return y._getPTValue(a._$instances[t], f, x, T, !1);
        },
        cx: function() {
          var f, x, T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (f = a._$instances[t]) !== null && f !== void 0 && f.isUnstyled() ? void 0 : y._getOptionValue((x = a._$instances[t]) === null || x === void 0 || (x = x.$style) === null || x === void 0 ? void 0 : x.classes, T, _({}, I));
        },
        sx: function() {
          var f, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return T ? y._getOptionValue((f = a._$instances[t]) === null || f === void 0 || (f = f.$style) === null || f === void 0 ? void 0 : f.inlineStyles, x, _({}, I)) : void 0;
        }
      }, k), a.$instance = a._$instances[t], (m = (h = a.$instance)[l]) === null || m === void 0 || m.call(h, a, c, d, p), a["$".concat(t)] = a.$instance, y._hook(t, l, a, c, d, p), a.$pd || (a.$pd = {}), a.$pd[t] = _(_({}, (b = a.$pd) === null || b === void 0 ? void 0 : b[t]), {}, {
        name: t,
        instance: a._$instances[t]
      });
    }, o = function(l) {
      var a, c, d, p = l._$instances[t], u = p?.watch, m = function(g) {
        var v, k = g.newValue, $ = g.oldValue;
        return u == null || (v = u.config) === null || v === void 0 ? void 0 : v.call(p, k, $);
      }, h = function(g) {
        var v, k = g.newValue, $ = g.oldValue;
        return u == null || (v = u["config.ripple"]) === null || v === void 0 ? void 0 : v.call(p, k, $);
      };
      p.$watchersCallback = {
        config: m,
        "config.ripple": h
      }, u == null || (a = u.config) === null || a === void 0 || a.call(p, p?.$primevueConfig), ne.on("config:change", m), u == null || (c = u["config.ripple"]) === null || c === void 0 || c.call(p, p == null || (d = p.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), ne.on("config:ripple:change", h);
    }, i = function(l) {
      var a = l._$instances[t].$watchersCallback;
      a && (ne.off("config:change", a.config), ne.off("config:ripple:change", a["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, a, c, d) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: So("pd")
        }, n("created", l, a, c, d);
      },
      beforeMount: function(l, a, c, d) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, a, c), n("beforeMount", l, a, c, d), o(l);
      },
      mounted: function(l, a, c, d) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, a, c), n("mounted", l, a, c, d);
      },
      beforeUpdate: function(l, a, c, d) {
        n("beforeUpdate", l, a, c, d);
      },
      updated: function(l, a, c, d) {
        var p;
        y._loadStyles((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance, a, c), n("updated", l, a, c, d);
      },
      beforeUnmount: function(l, a, c, d) {
        var p;
        i(l), y._removeThemeListeners((p = l.$pd[t]) === null || p === void 0 ? void 0 : p.instance), n("beforeUnmount", l, a, c, d);
      },
      unmounted: function(l, a, c, d) {
        var p;
        (p = l.$pd[t]) === null || p === void 0 || (p = p.instance) === null || p === void 0 || (p = p.scopedStyleEl) === null || p === void 0 || (p = p.value) === null || p === void 0 || p.remove(), n("unmounted", l, a, c, d);
      }
    };
  },
  extend: function() {
    var t = y._getMeta.apply(y, arguments), r = Yt(t, 2), n = r[0], o = r[1];
    return _({
      extend: function() {
        var s = y._getMeta.apply(y, arguments), l = Yt(s, 2), a = l[0], c = l[1];
        return y.extend(a, _(_(_({}, o), o?.methods), c));
      }
    }, y._extend(n, o));
  }
}, Pa = `
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
`, Ca = {
  root: "p-ink"
}, Oa = C.extend({
  name: "ripple-directive",
  style: Pa,
  classes: Ca
}), Ta = y.extend({
  style: Oa
});
function Ne(e) {
  "@babel/helpers - typeof";
  return Ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ne(e);
}
function ja(e) {
  return za(e) || Ea(e) || La(e) || Aa();
}
function Aa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function La(e, t) {
  if (e) {
    if (typeof e == "string") return st(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? st(e, t) : void 0;
  }
}
function Ea(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function za(e) {
  if (Array.isArray(e)) return st(e);
}
function st(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Qt(e, t, r) {
  return (t = Na(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Na(e) {
  var t = Ia(e, "string");
  return Ne(t) == "symbol" ? t : t + "";
}
function Ia(e, t) {
  if (Ne(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ne(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ra = Ta.extend("ripple", {
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
      r || (r = bo("span", Qt(Qt({
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
        if (!this.isUnstyled() && et(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !jt(o) && !At(o)) {
          var i = Math.max(fo(n), ko(n));
          o.style.height = i + "px", o.style.width = i + "px";
        }
        var s = wo(n), l = t.pageX - s.left + document.body.scrollTop - At(o) / 2, a = t.pageY - s.top + document.body.scrollLeft - jt(o) / 2;
        o.style.top = a + "px", o.style.left = l + "px", !this.isUnstyled() && mo(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!r.isUnstyled() && et(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && et(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? ja(t.children).find(function(r) {
        return xo(r, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const Va = "data-wippy-overlay-layer";
function zr() {
  return typeof window < "u" && typeof window.document < "u";
}
function Nr() {
  return zr() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function Ma() {
  return Nr() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Da = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ba = 0;
const Ge = /* @__PURE__ */ new WeakMap();
function Zt(e, t) {
  const r = e.style;
  r.setProperty("position", "fixed", "important"), r.setProperty("inset", "auto", "important"), r.setProperty("margin", "0", "important"), r.setProperty("position-anchor", t), r.setProperty("position-area", "bottom span-right"), r.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), r.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), r.setProperty("max-width", "stretch", "important");
}
function Ua(e, t) {
  if (!Da.test(e.className))
    return;
  const r = e.style.cssText;
  Zt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = r;
    return;
  }
  if (!Ge.has(e)) {
    const n = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && Zt(e, t);
    });
    n.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ge.set(e, n);
  }
}
function bt(e) {
  const t = Ge.get(e);
  t && (t.disconnect(), Ge.delete(e));
}
function qa(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function lt(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Je = /* @__PURE__ */ new Set(), vt = /* @__PURE__ */ new WeakMap();
let Xt = !1, ct = !1;
const er = ["w-theme-dark", "w-theme-light"], Fe = "data-wippy-theme-root", dt = /* @__PURE__ */ new WeakMap();
function Wa(e) {
  const t = [];
  let r = e ? e.parentNode : null;
  for (; r && r.nodeType === 1; )
    t.push(r), r = r.parentNode;
  return t;
}
function Fa(e, t, r) {
  const n = [...Wa(t), r.host], o = () => {
    let s;
    for (const l of n) {
      if (er.some((a) => l.classList.contains(a))) {
        s = l;
        break;
      }
      if (l.hasAttribute(Fe))
        break;
    }
    for (const l of er)
      e.classList.toggle(l, !!(s && s.classList.contains(l)));
    s ? e.setAttribute(Fe, "") : e.removeAttribute(Fe);
  };
  o();
  const i = new MutationObserver(o);
  for (const s of n)
    i.observe(s, { attributes: !0, attributeFilter: ["class", Fe] });
  dt.set(e, i);
}
function Ir(e) {
  dt.get(e)?.disconnect(), dt.delete(e);
}
function Ha() {
  ct = !1;
  for (const e of Je) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && bt(t);
      Je.delete(e), vt.get(e)?.disconnect(), Ir(e);
      continue;
    }
    e.childElementCount > 0 && lt(e);
  }
}
function tr() {
  ct || (ct = !0, requestAnimationFrame(Ha));
}
function Ka(e) {
  const t = document.createElement("div");
  t.setAttribute(Va, "");
  const r = Nr();
  if (t.style.cssText = r ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", r && t.setAttribute("popover", "manual"), e.appendChild(t), r) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  lt(t);
  const n = new MutationObserver((o) => {
    const i = t.__wippyAnchorName;
    for (const s of o) {
      if (i)
        for (const l of Array.from(s.addedNodes))
          l instanceof HTMLElement && Ua(l, i);
      for (const l of Array.from(s.removedNodes))
        l instanceof HTMLElement && bt(l);
    }
    t.isConnected && t.childElementCount > 0 && lt(t);
  });
  return n.observe(t, { childList: !0 }), vt.set(t, n), Je.add(t), Xt || (Xt = !0, window.addEventListener("scroll", tr, { capture: !0, passive: !0 }), window.addEventListener("resize", tr, { passive: !0 })), t;
}
function rr(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Ka(e.hostRoot), Fa(e.layer, e.$el, e.hostRoot), Ma())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Ba}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function nr(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && bt(t);
    Je.delete(e.layer), vt.get(e.layer)?.disconnect(), Ir(e.layer), e.layer.remove(), e.layer = null;
  }
}
let or = !1;
function Ya() {
  if (or)
    return;
  or = !0;
  const e = jr;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    zr() && (this.hostRoot = qa(this.$el), this.mounted = !0, this.hostRoot && (this.inline || rr(this), this.$watch("inline", (t) => {
      t ? nr(this) : rr(this);
    })));
  }, e.render = function() {
    return this.inline ? Q(this.$slots, "default", { key: 0 }) : this.mounted ? bn(sr, { key: 1, to: this.resolvedTarget || document.body }, [
      Q(this.$slots, "default")
    ]) : Se("", !0);
  }, e.unmounted = function() {
    nr(this);
  };
}
const Ga = {
  install: (e) => {
    Ya(), e.use(ia, { theme: "none" });
  }
}, Ja = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-iconbtn{width:28px;height:28px;flex:none;display:grid;place-items:center;cursor:pointer;border:1px solid transparent;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-muted-color);transition:color .14s,background .14s,border-color .14s}.kx-iconbtn:hover:not(:disabled){color:var(--p-text-color);background:var(--kx-surface-2)}.kx-iconbtn.on{color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.kx-iconbtn:disabled{opacity:.55;cursor:default}.kx-iconbtn svg{width:16px;height:16px}.kx-iconbtn.lg{width:var(--kx-control-height);height:var(--kx-control-height)}.kx-iconbtn.sm{width:var(--kx-control-height-sm);height:var(--kx-control-height-sm)}.kx-iconbtn.bordered{border-color:var(--p-content-border-color);background:var(--kx-surface-1);color:var(--p-text-muted-color)}.kx-iconbtn.bordered:hover:not(:disabled){border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-iconbtn.danger:hover:not(:disabled),.kx-iconbtn.danger.on{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-500)}.kx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:var(--kx-control-height);padding:0 14px;border-radius:var(--kx-radius-8);cursor:pointer;font:inherit;font-size:12.5px;font-weight:600;white-space:nowrap;border:1px solid transparent;transition:filter .15s,transform .15s,background .14s,border-color .14s,color .14s}.kx-btn svg{width:15px;height:15px}.kx-btn:disabled{opacity:.5;cursor:not-allowed}.kx-btn.sm{height:var(--kx-control-height-sm);padding:0 12px}.kx-btn-primary{background:var(--p-primary-color);color:var(--p-primary-contrast-color);border-color:var(--p-primary-color)}.kx-btn-primary:hover:not(:disabled){filter:brightness(1.07);transform:translateY(-1px)}.kx-btn-ghost{background:transparent;color:var(--p-text-color);border-color:var(--p-content-border-color)}.kx-btn-ghost:hover:not(:disabled){background:var(--kx-surface-2);border-color:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.kx-btn-soft{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color);border-color:color-mix(in srgb,var(--p-primary-color) 30%,transparent)}.kx-btn-soft:hover:not(:disabled){background:color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.kx-btn-danger{background:var(--p-danger-500);color:var(--p-danger-contrast-color);border-color:var(--p-danger-500)}.kx-btn-danger:hover:not(:disabled){filter:brightness(1.07)}.kx-search{position:relative;display:flex;align-items:center}.kx-search-ico{position:absolute;left:10px;width:15px;height:15px;color:var(--p-text-muted-color);pointer-events:none}.kx-search-input{width:100%;height:var(--kx-control-height);padding:0 30px 0 31px;font:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);transition:border-color .14s,box-shadow .14s}.kx-search-input::placeholder{color:var(--p-text-muted-color)}.kx-search-input:focus{outline:none;border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.kx-search-clear{position:absolute;right:6px;width:22px;height:22px;border-radius:var(--kx-radius-8);display:grid;place-items:center;cursor:pointer;background:transparent;border:none;color:var(--p-text-muted-color)}.kx-search-clear:hover{color:var(--p-text-color);background:var(--kx-surface-2)}.kx-search-clear svg{width:14px;height:14px}.kx-chip{font-size:9.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:var(--kx-radius-6);background:var(--kx-surface-2);color:var(--p-text-muted-color);border:1px solid var(--p-content-border-color)}.kx-count{min-width:18px;height:16px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-variant-numeric:tabular-nums;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:inherit}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}button,input,textarea,select{font:inherit}h1,h2,h3,p{margin:0}h1{font-size:24px;line-height:1.3;font-weight:600;overflow-wrap:anywhere}h2{font-size:16px;font-weight:600;line-height:1.4}h3{font-size:14px;font-weight:600}p{line-height:1.5}button{cursor:pointer}button:disabled{cursor:default}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}small{font-size:12px;color:var(--p-text-muted-color);font-weight:400}input:not([type=checkbox]),select,textarea{width:100%;min-width:0;background:var(--p-content-background);color:var(--p-text-color);border:1px solid var(--p-content-border-color);border-radius:var(--p-form-field-border-radius);padding:9px 11px;line-height:1.4}textarea{resize:vertical}wc-model-picker,wc-multiselect{display:block;min-width:0}.docscout{container-type:inline-size;container-name:docscout;height:100%;min-height:0;overflow-y:auto;display:flex;flex-direction:column;background:var(--p-content-background);color:var(--p-text-color);font-size:14px}.description{color:var(--p-text-muted-color);margin-top:8px;max-width:680px;overflow-wrap:anywhere}.row{display:flex;align-items:center;gap:12px;min-width:0}.wrap{flex-wrap:wrap}.push{margin-left:auto}.grow{flex:1;min-width:220px}.muted,.meta-line,.retention{font-size:13px;color:var(--p-text-muted-color)}.meta-line{margin-top:12px}.badge{display:inline-flex;align-items:center;white-space:nowrap;border-radius:var(--p-content-border-radius);padding:2px 7px;background:var(--p-content-hover-background);color:var(--p-text-muted-color);font-size:12px}.tabs{display:flex;gap:22px;flex-shrink:0;overflow-x:auto;min-width:0}.tabs button{background:transparent;border:0;border-bottom:2px solid transparent;padding:13px 0 11px;color:var(--p-text-muted-color);font-size:13px;font-weight:500;white-space:nowrap}.tabs button[aria-selected=true]{color:var(--p-primary-color);border-bottom-color:var(--p-primary-color)}.page-body{overflow-y:auto;min-height:0;flex:1;padding:22px 24px 36px}.panel{max-width:1000px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.section-head p{margin-top:5px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.three{grid-template-columns:repeat(3,minmax(0,1fr))}.field-card{border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius);padding:20px;background:var(--p-content-background);margin-bottom:16px}.field-card>header{margin-bottom:18px}.field-card>label,.field-card>.grid{margin-bottom:18px}.field-card>:last-child{margin-bottom:0}.ordinal{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:var(--p-content-border-radius);background:var(--p-content-hover-background);font-size:12px;color:var(--p-text-muted-color);flex-shrink:0}.check{display:inline-flex;flex-direction:row;align-items:center;gap:8px;font-weight:400}.check input{accent-color:var(--p-primary-color);width:16px;height:16px;flex-shrink:0}.panel>section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--p-content-border-color)}section>h2{margin-bottom:20px}section>.grid,section>.check{margin-bottom:18px}.identity{padding-bottom:24px}.empty{padding:24px 0;color:var(--p-text-muted-color);font-size:13px}.error{color:var(--p-danger-color);padding:12px 0;overflow-wrap:anywhere}.retention{margin-top:12px}.test-input>.muted{margin-top:14px}.value{font-size:20px;font-weight:500;margin:6px 0}.confidence{font-size:12px;color:var(--p-text-muted-color)}blockquote{border-left:2px solid var(--p-primary-color);margin:16px 0 0;padding:2px 0 2px 14px}blockquote p{font-size:14px}cite{display:block;font-size:12px;color:var(--p-text-muted-color);font-style:normal;margin-top:6px}.trace{padding-left:20px;margin:20px 0}.trace>li{padding:0 0 24px 12px}.trace p,.trace ul{margin-top:8px}.comparison .field-card{margin:0}.values{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.values dd{text-align:right}.values small{display:block;margin-top:4px}dd{margin:0;overflow-wrap:anywhere}dt{color:var(--p-text-muted-color)}.delta{color:var(--p-text-muted-color);font-size:13px;margin-top:10px}.capitalize{text-transform:capitalize}.create-pane{max-height:100%;overflow-y:auto;padding:24px;max-width:640px;margin:auto;color:var(--p-text-color)}.create-pane>header,.create-pane>label,.create-summary{margin-bottom:24px}.create-summary{padding:18px;border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius)}.create-summary dl{display:grid;grid-template-columns:110px 1fr;gap:12px;font-size:13px;margin-bottom:0}.create-summary h2{margin:0 0 14px}@container docscout (max-width:600px){.page-body{padding:22px 20px 32px}.grid,.three,.run-list{grid-template-columns:1fr;gap:16px}.field-card{padding:16px}.field-card>header{gap:8px}.field-card header h3{overflow-wrap:anywhere;min-width:0}.section-head{align-items:flex-start;gap:12px}.create-pane{max-height:100%;overflow-y:auto;padding:20px}.comparison{grid-template-columns:1fr}.confidence{max-width:112px;text-align:right}.create-summary dl{grid-template-columns:85px 1fr}}.title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.title-row .badge{font-weight:500}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 20px;border-bottom:1px solid var(--p-content-border-color);flex-shrink:0;min-height:46px}.toolbar-side{display:flex;align-items:center;gap:12px;min-width:0}.stats{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sep{opacity:.6}.save-area{display:flex;align-items:center;gap:12px;flex-shrink:0}.unsaved{font-size:12px;color:var(--p-text-muted-color);display:inline-flex;align-items:center;gap:6px}.unsaved:before{content:"";width:7px;height:7px;border-radius:999px;background:var(--p-primary-color)}.banner{padding:8px 20px;border-bottom:1px solid var(--p-content-border-color)}.chips{display:flex;flex-wrap:wrap;gap:5px}.chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;line-height:1.5;border-radius:6px;padding:1px 7px;background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-muted-color);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.chip.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.chip.muted-chip{background:transparent;border:1px dashed var(--p-content-border-color)}.chip.model{background:color-mix(in srgb,var(--p-primary-color) 10%,transparent);color:var(--p-text-color)}.node{display:flex;align-items:flex-start;gap:14px;width:100%;margin:0;text-align:left;background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:12px 14px 12px 12px;color:var(--p-text-color);cursor:pointer;transition:border-color .12s,box-shadow .12s}.node:where(:hover){border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.node:where(.active){border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.node.off{background:transparent;border-style:dashed}.node.off .node-icon,.node.off .node-title{opacity:.55}.node-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.fixed .node-icon{background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-color)}.node-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.node-title{font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}.scope{font-size:11px;font-weight:500;color:var(--p-text-muted-color);text-transform:capitalize}.scope:before{content:"· "}.node-summary{font-size:13px;color:var(--p-text-muted-color)}.trace-line{display:inline-flex;align-items:flex-start;gap:6px;font-size:12px;line-height:1.5;color:var(--p-primary-color)}.trace-line>svg{flex-shrink:0;margin-top:3px}.node-side{display:flex;align-items:center;gap:8px;flex-shrink:0}.node-actions{display:flex;align-items:center;gap:2px}.node-actions .switch{margin-left:6px}.connector{width:2px;height:18px;flex-shrink:0;margin:0 auto;background:color-mix(in srgb,var(--p-text-color) 18%,transparent);position:relative}.connector:after{content:"";position:absolute;bottom:-1px;left:-3px;width:8px;height:8px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 25%,transparent)}.connector.off{background:repeating-linear-gradient(to bottom,color-mix(in srgb,var(--p-text-color) 18%,transparent) 0 4px,transparent 4px 8px)}.switch{position:relative;width:40px;height:23px;border:0;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 16%,transparent);flex-shrink:0;padding:0;transition:background .15s}.switch span{position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:999px;background:var(--p-toggleswitch-handle-background,var(--p-content-background));box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent);transition:transform .15s}.switch[aria-checked=true]{background:var(--p-primary-color)}.switch[aria-checked=true] span{transform:translate(17px)}.switch:disabled{opacity:.5}.inspector-body{padding:16px 20px 28px}.inspector-form{border:0;margin:0;padding:0;min-width:0;display:flex;flex-direction:column;gap:14px}.inspector-form h4{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);margin:8px 0 -4px}.inspector-form .grid{gap:12px}.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px}.toggle-row>span{display:flex;flex-direction:column;gap:2px;min-width:0}.toggle-row small{overflow-wrap:anywhere}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.segmented{display:flex;padding:3px;gap:3px;border-radius:8px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.segmented button{flex:1;border:0;border-radius:6px;background:transparent;padding:6px 8px;font-size:13px;color:var(--p-text-muted-color)}.segmented button[aria-checked=true]{background:var(--p-content-background);color:var(--p-text-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 12%,transparent);font-weight:500}.query-row{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--p-content-border-color);border-radius:10px}.query-row .kx-btn{align-self:flex-start}.output-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.output-list li{display:flex;justify-content:space-between;gap:12px;align-items:center}@container docscout (max-width:600px){.toolbar{padding:0 14px 0 20px;gap:10px}.crumb-row,.toolbar-title{padding-left:32px}.stats,.node-side .chip.model{display:none}.inspector-form .grid{grid-template-columns:1fr}}.label-block{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}.toolbar-lead{display:flex;align-items:center;gap:14px;min-width:0}.crumb{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;padding-right:10px;border-right:1px solid var(--p-content-border-color)}.toolbar-title{display:flex;align-items:center;gap:8px}.toolbar-title h1{font-size:15px;font-weight:600}.filter{width:220px!important;padding:5px 10px!important;font-size:13px}.pad-page{padding:24px}.list-page .page-body{padding:20px 24px 36px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.card{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:14px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);color:var(--p-text-color);min-width:0}.card:where(:hover){border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.card-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.card-main{display:flex;flex-direction:column;gap:4px;min-width:0}.card-title{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-desc{font-size:13px;color:var(--p-text-muted-color);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.card-meta{font-size:12px;color:var(--p-text-muted-color)}.create-card{position:relative;border:1px solid var(--p-content-border-color);border-radius:14px;margin-bottom:16px;max-width:640px}.create-card .create-pane{margin:0;padding:18px 20px}.create-card .create-pane>header,.create-card .create-pane>label,.create-card .create-summary{margin-bottom:16px}.create-close{position:absolute;top:12px;right:12px}.empty-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:64px 16px;color:var(--p-text-muted-color);font-size:13px;text-align:center}.empty-icon{font-size:30px}@container docscout (max-width:900px){.filter{width:150px!important}}@container docscout (max-width:600px){.filter{display:none}.list-page .page-body{padding:16px 14px 28px}}.builder-body{flex:1;min-height:0;display:flex}.builder{position:relative;flex:1;min-width:0;min-height:0;display:flex}.canvas{flex:1;min-width:0;overflow-y:auto;background:color-mix(in srgb,var(--p-text-color) 2.5%,transparent)}.canvas-inner{max-width:760px;margin:0 auto;padding:20px 24px 48px;display:flex;flex-direction:column;gap:18px}.block{background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;min-width:0}.block-head{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 8px;min-width:0}.collapse{display:inline-flex;align-items:center;gap:8px;border:0;background:transparent;color:var(--p-text-color);padding:4px 6px;border-radius:8px;flex-shrink:0}.collapse:hover{background:color-mix(in srgb,var(--p-text-color) 6%,transparent)}.collapse h2{font-size:14px}.collapse>svg{color:var(--p-text-muted-color)}.count{font-size:12px;color:var(--p-text-muted-color);background:color-mix(in srgb,var(--p-text-color) 8%,transparent);border-radius:999px;padding:1px 8px;white-space:nowrap}.block-peek{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.block-body{border-top:1px solid var(--p-content-border-color)}.block-empty{padding:18px 20px;font-size:13px;color:var(--p-text-muted-color)}.rows{list-style:none;margin:0;padding:6px}.row-item{display:flex;align-items:center;gap:4px;border-radius:10px;border:1px solid transparent}.row-item:hover{background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.row-item.active{background:color-mix(in srgb,var(--p-primary-color) 9%,transparent);border-color:color-mix(in srgb,var(--p-primary-color) 35%,transparent)}.row-main{flex:1;min-width:0;display:grid;grid-template-columns:minmax(120px,190px) minmax(0,1fr) auto;align-items:center;gap:14px;border:0;background:transparent;color:var(--p-text-color);text-align:left;padding:9px 10px}.row-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.row-desc{font-size:13px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.row-main .chips{flex-wrap:nowrap}.req{color:var(--p-primary-color);margin-left:2px}.row-actions{display:flex;gap:0;padding-right:6px;opacity:0;transition:opacity .12s}.row-item:hover .row-actions,.row-item.active .row-actions,.row-actions:focus-within{opacity:1}.flow{border-top:1px solid var(--p-content-border-color);padding:16px;display:flex;flex-direction:column}.side-panel{position:relative;width:400px;flex-shrink:0;display:flex;flex-direction:column;min-height:0;border-left:1px solid var(--p-content-border-color);background:var(--p-content-background)}.side-panel-head{display:flex;align-items:center;gap:10px;padding:10px 12px 10px 18px;border-bottom:1px solid var(--p-content-border-color);min-height:52px}.side-panel-head h2{font-size:14px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.side-panel-icon{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.side-panel-body{flex:1;min-height:0;overflow-y:auto;padding:16px 18px 28px}.rail{width:44px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px 0;border:0;border-left:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:18px}.rail:hover{color:var(--p-text-color);background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.rail-label{writing-mode:vertical-rl;font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:240px}.builder.narrow .side-panel{position:absolute;top:0;right:0;bottom:0;width:min(420px,100%);z-index:5;box-shadow:-12px 0 32px color-mix(in srgb,var(--p-text-color) 18%,transparent)}.scrim{position:absolute;inset:0;z-index:4;background:color-mix(in srgb,var(--p-text-color) 18%,transparent)}@container docscout (max-width:760px){.canvas-inner{padding:14px 12px 36px;gap:14px}.row-main{grid-template-columns:minmax(0,1fr) auto}.row-desc{display:none}.flow,.node{padding:12px}.block-peek{display:none}}.resizer{position:absolute;top:0;bottom:0;left:-4px;width:8px;cursor:col-resize;z-index:2;touch-action:none}.resizer:after{content:"";position:absolute;top:0;bottom:0;left:3px;width:2px;background:transparent;transition:background .12s}.resizer:hover:after,.resizer.active:after,.resizer:focus-visible:after{background:var(--p-primary-color)}.builder.resizing{cursor:col-resize;user-select:none}.field-error,.field-note{display:flex;align-items:flex-start;gap:6px;font-size:12px;margin-top:-6px}.field-error{color:var(--p-danger-color)}.field-note{color:var(--p-text-muted-color)}.field-error svg,.field-note svg{flex-shrink:0;margin-top:2px}.mono-input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px}input[aria-invalid=true]{border-color:var(--p-danger-color)}.row-warn{display:inline-block;color:var(--p-danger-color);margin-left:6px;vertical-align:-2px}.row-desc.missing{font-style:italic;opacity:.75}.inspector-form>.kx-btn{align-self:flex-start}.invalid{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--p-danger-color);max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.invalid svg{flex-shrink:0}@container docscout (max-width:760px){.invalid{max-width:140px}}.test,.evals{display:flex;flex-direction:column;gap:16px;max-width:1180px}.block-title{font-size:14px;padding-left:6px}.block-foot{padding:10px 18px 14px;font-size:12px;border-top:1px solid var(--p-content-border-color)}.run-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.run-input{flex:1;min-width:240px;max-width:520px}.run-note{flex-basis:100%;font-size:12px}.test-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:16px;align-items:start}.value-list{list-style:none;margin:0;padding:4px 6px 6px}.value-row+.value-row{border-top:1px solid var(--p-content-border-color)}.value-main{width:100%;display:grid;grid-template-columns:minmax(100px,150px) minmax(0,1fr) 172px 84px 18px;align-items:center;gap:12px;border:0;background:transparent;color:var(--p-text-color);text-align:left;padding:11px 10px}.value-main:hover{background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.value-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--p-text-muted-color);overflow:hidden;text-overflow:ellipsis}.value-text{font-size:14px;font-weight:600;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;overflow-wrap:anywhere}.value-caret{color:var(--p-text-muted-color)}.confidence{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--p-text-muted-color);white-space:nowrap}.bar{position:relative;display:inline-block;width:56px;height:6px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 10%,transparent);overflow:hidden;flex-shrink:0}.bar>span{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--p-primary-color)}.confidence.mid .bar>span{background:color-mix(in srgb,var(--p-primary-color) 60%,var(--p-text-color))}.confidence.low .bar>span{background:var(--p-danger-color)}.evidence{padding:0 12px 12px 10px}.evidence blockquote{margin:6px 0 0;padding:6px 0 6px 12px;border-left:2px solid var(--p-primary-color)}.evidence blockquote p{font-size:13px}.timeline{list-style:none;margin:0;padding:8px 14px 14px}.timeline li{display:flex;gap:12px;padding:10px 0;position:relative}.timeline li+li{border-top:1px dashed var(--p-content-border-color)}.tl-icon{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.timeline li.failed .tl-icon{background:color-mix(in srgb,var(--p-danger-color) 14%,transparent);color:var(--p-danger-color)}.tl-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}.tl-head{display:flex;align-items:center;gap:8px;font-size:13px}.tl-bar{height:4px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 8%,transparent);overflow:hidden}.tl-bar>span{display:block;height:100%;background:color-mix(in srgb,var(--p-primary-color) 70%,transparent);border-radius:999px}.tl-main p{font-size:12px}.tl-msg{color:var(--p-text-color)}.stat-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.stat{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);min-width:0}.stat-label{font-size:12px;color:var(--p-text-muted-color)}.stat-value{font-size:24px;font-weight:600;line-height:1.2}.stat-delta{font-size:12px;color:var(--p-text-muted-color)}.stat-delta.up,.trend.up{color:var(--p-primary-color)}.stat-delta.down,.trend.down{color:var(--p-danger-color)}.metric-table{width:100%;border-collapse:collapse;font-size:13px}.metric-table th{text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);padding:10px 14px;border-top:1px solid var(--p-content-border-color);border-bottom:1px solid var(--p-content-border-color);white-space:nowrap}.metric-table td{padding:10px 14px;border-bottom:1px solid var(--p-content-border-color);white-space:nowrap}.metric-table tr:last-child td{border-bottom:0}.metric-table .num{text-align:right}.metric-table .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;text-transform:none;letter-spacing:0}.acc{display:inline-flex;align-items:center;gap:8px}.acc.strong{font-weight:600}.trend{display:inline-flex;align-items:center;gap:4px;font-weight:500}.trend.flat{color:var(--p-text-muted-color)}.table-scroll{overflow-x:auto}.case-form{display:flex;flex-direction:column;gap:14px;padding:14px 18px;border-top:1px solid var(--p-content-border-color)}@container docscout (max-width:980px){.test-grid{grid-template-columns:1fr}.stat-row{grid-template-columns:repeat(2,minmax(0,1fr))}}@container docscout (max-width:640px){.value-main{grid-template-columns:minmax(0,1fr) auto auto 18px}.conf-word{display:none}.value-name{grid-column:1/-1}.value-main .confidence .bar{display:none}}.metric-table td svg{display:inline-block;vertical-align:-2px}.slider{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500}.slider-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.slider-value{font-size:12px;font-weight:600;font-variant-numeric:tabular-nums;padding:1px 8px;border-radius:6px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.slider input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;padding:0;border:0;border-radius:999px;background:linear-gradient(to right,var(--p-primary-color) var(--fill),color-mix(in srgb,var(--p-text-color) 12%,transparent) var(--fill));cursor:pointer}.slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:999px;background:var(--p-slider-handle-content-background,var(--p-content-background));border:2px solid var(--p-primary-color);box-shadow:0 1px 2px color-mix(in srgb,var(--p-text-color) 25%,transparent)}.slider input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:999px;background:var(--p-slider-handle-content-background,var(--p-content-background));border:2px solid var(--p-primary-color)}.slider input[type=range]:disabled{opacity:.5;cursor:default}.slider-hints{display:flex;justify-content:space-between;font-size:11px;font-weight:400;color:var(--p-text-muted-color)}.slider small{font-weight:400}.model-role{display:grid;grid-template-columns:96px minmax(0,1fr);align-items:center;gap:10px;font-size:13px}.model-role>span{color:var(--p-text-muted-color)}.diagram{margin:0;padding:12px;border-radius:10px;background:color-mix(in srgb,var(--p-text-color) 4%,transparent);display:flex;flex-direction:column;gap:8px}.diagram figcaption{font-size:12px;color:var(--p-text-muted-color);line-height:1.45}.chunk-diagram svg{width:100%;height:46px;display:block}.chunk-diagram .chunk{fill:color-mix(in srgb,var(--p-primary-color) 22%,transparent);stroke:var(--p-primary-color);stroke-width:.4;vector-effect:non-scaling-stroke}.chunk-diagram .shared{fill:color-mix(in srgb,var(--p-primary-color) 35%,transparent)}.fd-track{display:flex;align-items:center;gap:0;overflow-x:auto;padding-bottom:2px}.fd-track.wrap{flex-wrap:wrap;row-gap:8px}.fd-node{display:inline-flex;flex-direction:column;align-items:center;gap:3px;padding:5px 9px;border-radius:8px;border:1px solid color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));background:var(--p-content-background);font-size:11px;white-space:nowrap;line-height:1.2}.fd-node b{font-size:13px}.fd-node small{font-size:10px;color:var(--p-text-muted-color)}.fd-node.solid{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent)}.fd-node.goal{border-style:dashed;color:var(--p-primary-color);font-weight:600}.fd-dots{display:flex;gap:2px}.fd-dots i{width:4px;height:4px;border-radius:999px;background:var(--p-primary-color)}.fd-link{width:12px;height:2px;background:color-mix(in srgb,var(--p-primary-color) 40%,transparent);flex-shrink:0}.fd-arrow{color:var(--p-text-muted-color);padding:0 6px;font-size:12px}.fd-more{font-size:11px;color:var(--p-text-muted-color);padding:0 4px}.fd-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.fd-grid .fd-node{position:relative;min-width:0;white-space:normal;text-align:center;padding:6px 4px}.fd-grid .fd-node:not(:last-child):after{content:"";position:absolute;right:-12px;top:50%;width:10px;height:2px;background:color-mix(in srgb,var(--p-primary-color) 45%,transparent)}.fork,.join{position:relative;height:22px;margin:0 25%}.fork span,.join span{position:absolute;left:0;right:0;border:2px solid color-mix(in srgb,var(--p-text-color) 18%,transparent)}.fork span{top:10px;bottom:0;border-bottom:0;border-radius:10px 10px 0 0}.join span{top:0;bottom:10px;border-top:0;border-radius:0 0 10px 10px}.fork:before,.join:after{content:"";position:absolute;left:50%;width:2px;height:10px;margin-left:-1px;background:color-mix(in srgb,var(--p-text-color) 18%,transparent)}.fork:before{top:0}.join:after{bottom:0}.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}.branch{display:flex;flex-direction:column;min-width:0}.branch-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);text-align:center;margin-bottom:6px}.branch .node{padding:11px 12px}.branch .node-side .chip.model{display:none}@container docscout (max-width:900px){.branches{grid-template-columns:1fr}.fork,.join{margin:0 auto;width:2px}.fork span,.join span{display:none}.branch+.branch{margin-top:14px}}.run-failed{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:color-mix(in srgb,var(--p-danger-color) 10%,transparent);color:var(--p-danger-color);font-size:13px}.value-text.missing{font-weight:400;font-style:italic;color:var(--p-text-muted-color)}.chip.warn{background:color-mix(in srgb,var(--p-button-text-warn-color) 16%,transparent);color:var(--p-text-color)}blockquote.unfound{border-left-color:var(--p-button-text-warn-color)}.full-value{font-size:13px;line-height:1.5;padding:2px 0 4px;white-space:pre-wrap;overflow-wrap:anywhere}.eval-run{padding:16px 18px}.eval-run-main{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.eval-run-main .muted{margin-top:4px;max-width:560px}.eval-note{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:13px;color:var(--p-primary-color)}.eval-progress{display:flex;align-items:center;gap:12px;margin-top:14px}.eval-progress .bar{flex:1;height:6px;border-radius:999px;background:var(--p-content-hover-background);overflow:hidden}.eval-progress .bar>span{display:block;height:100%;background:var(--p-primary-color);transition:width .3s}.evals{display:flex;flex-direction:column;gap:18px}.stat-value small{font-size:14px;font-weight:500;color:var(--p-text-muted-color)}.result-matrix td,.result-matrix th{white-space:nowrap}.result-row.active td{background:var(--p-content-hover-background)}.case-toggle{display:inline-flex;align-items:center;gap:6px;border:0;background:transparent;color:var(--p-text-color);padding:0;font-weight:500;max-width:280px;overflow:hidden;text-overflow:ellipsis}.cell{display:inline-flex;align-items:center;justify-content:center;min-width:46px;padding:2px 8px;border-radius:var(--p-content-border-radius);font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}.cell.pass{background:color-mix(in srgb,var(--p-primary-color) 16%,transparent);color:var(--p-primary-color)}.cell.partial{background:color-mix(in srgb,var(--p-button-text-warn-color) 18%,transparent);color:var(--p-button-text-warn-color)}.cell.fail{background:color-mix(in srgb,var(--p-danger-color) 16%,transparent);color:var(--p-danger-color)}.cell.none{color:var(--p-text-muted-color)}.cell-state{display:inline-flex;align-items:center;gap:6px;white-space:normal}.cell-state.fail{color:var(--p-danger-color)}.spin{animation:docscout-spin 1s linear infinite}@keyframes docscout-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}.result-detail>td{padding:12px 16px 16px;white-space:normal}.compare{display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:10px 16px;margin:0;max-width:860px}.compare dt{padding-top:3px;font-size:13px}.compare dd{display:grid;grid-template-columns:56px minmax(0,1fr) minmax(0,1fr) auto;align-items:start;gap:12px}.cmp{display:flex;flex-direction:column;min-width:0;font-size:13px;overflow-wrap:anywhere}.cmp-label{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color)}.case-meta{margin-top:10px}.eval-history{list-style:none;margin:0;padding:0}.eval-history li+li{border-top:1px solid var(--p-content-border-color)}.eval-history button{display:flex;align-items:center;gap:12px;width:100%;padding:10px 18px;border:0;background:transparent;color:var(--p-text-color);text-align:left;font-size:13px}.eval-history button:hover,.eval-history button.active{background:var(--p-content-hover-background)}.badge[data-status=completed]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.badge[data-status=failed]{background:color-mix(in srgb,var(--p-danger-color) 14%,transparent);color:var(--p-danger-color)}.badge[data-status=running],.badge[data-status=queued]{background:var(--p-content-hover-background);color:var(--p-text-color)}.caller{display:inline-flex;align-items:center;gap:6px}@container docscout (max-width:600px){.eval-run-main{flex-direction:column}.compare{grid-template-columns:1fr}.compare dd{grid-template-columns:56px minmax(0,1fr)}.compare dd>:last-child{grid-column:2}.matrix-hint{display:none}.compare-pick{width:100%;margin-left:0}.block-head:has(.compare-pick){flex-wrap:wrap}}.eval-run .block-title{padding:0}.compare-pick{flex-direction:row;align-items:center;gap:8px;font-weight:400}.compare-pick select{width:auto;max-width:100%;padding:5px 9px;font-size:13px}.eval-warning{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:var(--p-content-border-radius);background:var(--p-content-hover-background);color:var(--p-text-color);font-size:13px}.crumb-row{display:flex;align-items:center;gap:14px;min-width:0}@container docscout (max-width:900px){.toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"crumb side" "tabs tabs";column-gap:12px;row-gap:0}.toolbar-lead{display:contents}.crumb-row{grid-area:crumb;min-height:46px;gap:10px}.crumb{border-right:0;padding-right:0;max-width:none}.toolbar>.toolbar-lead>.tabs{grid-area:tabs}.toolbar-side{grid-area:side;min-height:46px}}@container docscout (max-width:600px){.btn-label{display:none}}.card-title-row{display:flex;align-items:center;gap:8px;min-width:0}.card-title-row .card-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access{flex-shrink:0;font-size:11px;font-weight:500;line-height:1.5;border-radius:6px;padding:1px 7px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);white-space:nowrap}.card-meta{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@container docscout (max-width:600px){.metric-table th,.metric-table td{padding:9px 10px}.accuracy-table td:first-child{white-space:normal;overflow-wrap:anywhere}.acc .bar{width:32px}.row-main{grid-template-columns:minmax(0,1fr);gap:6px}.row-main .chips{flex-wrap:wrap}}.value-main>.confidence{justify-self:end}.value-main>.chip{justify-self:start}.cmp-label{white-space:nowrap}@container docscout (max-width:600px){.result-matrix,.result-matrix tbody{display:block}.result-matrix thead{display:none}.result-matrix tr.result-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;padding:12px 14px;border-bottom:1px solid var(--p-content-border-color)}.result-matrix tr.result-row.active{background:var(--p-content-hover-background)}.result-matrix tr.result-row td{display:flex;align-items:center;gap:6px;padding:0;border:0;white-space:normal;background:transparent}.result-matrix tr.result-row td:first-child{flex-basis:100%}.result-matrix td[data-label]:before{content:attr(data-label);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--p-text-muted-color)}.case-toggle{max-width:100%;overflow-wrap:anywhere;text-align:left}.result-matrix tr.result-detail{display:block;border-bottom:1px solid var(--p-content-border-color)}.result-matrix tr.result-detail>td{display:block;padding:12px 14px 14px}.accuracy-table.comparing th:nth-child(3),.accuracy-table.comparing td:nth-child(3),.accuracy-table.comparing th:nth-child(4),.accuracy-table.comparing td:nth-child(4){display:none}.compare-pick{flex-wrap:nowrap}.compare-pick>.muted{white-space:nowrap}.compare-pick select{flex:1;min-width:0}.compare dd{grid-template-columns:56px minmax(0,1fr) minmax(0,1fr)}.compare dd>:last-child{grid-column:2/4}.case-table,.case-table tbody{display:block}.case-table thead{display:none}.case-table tr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 14px;border-bottom:1px solid var(--p-content-border-color)}.case-table tr:last-child{border-bottom:0}.case-table td{display:flex;align-items:center;gap:6px;padding:0;border:0;white-space:normal;overflow-wrap:anywhere}.case-table td:first-child{flex:1 1 calc(100% - 44px);font-weight:500}.case-table td.num{order:-1;margin-left:auto;flex:0 0 auto}.case-table td:first-child{order:-2}.case-table td[data-label]{flex-basis:100%}.case-table td[data-label]:before{content:attr(data-label);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:var(--p-text-muted-color);min-width:96px}}.eval-history button>span{white-space:nowrap}@container docscout (max-width:600px){.eval-history button{display:grid;grid-template-columns:auto minmax(0,1fr) auto;row-gap:2px;column-gap:10px;padding:10px 14px}.eval-history button>.muted{grid-column:2;grid-row:2;font-size:12px}.eval-history button>strong{grid-column:3;grid-row:1/3;align-self:center}}.value-main{border-radius:8px}@container docscout (max-width:600px){.runs-table,.runs-table tbody{display:block}.runs-table thead{display:none}.runs-table tr{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 4px;border-bottom:1px solid var(--p-content-border-color)}.runs-table tr:after{content:"";flex-basis:100%;height:0;order:3}.runs-table td{display:flex;align-items:center;gap:5px;padding:0;border:0}.runs-table td:nth-child(1){order:1;flex:1;font-weight:500}.runs-table td:nth-child(3){order:2}.runs-table td:nth-child(2){order:4}.runs-table td:nth-child(4){order:5}.runs-table td:nth-child(5){order:6}.runs-table td:nth-child(6){display:none}.runs-table td:nth-child(n+2):not(:nth-child(3)){font-size:12px;color:var(--p-text-muted-color)}.runs-table td[data-label]:before{content:attr(data-label)}}.field-group{min-width:0;border-inline-start:1px solid var(--p-content-border-color);margin-block:12px;padding-inline-start:12px}.field-group>summary{cursor:pointer;font-weight:600;color:var(--p-text-color);overflow-wrap:anywhere;padding-block:8px}.group-content,.shape-editor{display:flex;flex-direction:column;gap:12px;min-width:0}.group-rename{max-width:24rem}.group-add{flex-wrap:wrap;align-items:end;padding-block:12px}.property-editor{min-width:0;margin:0;padding:12px;border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius)}.nested-value{min-width:0;overflow-wrap:anywhere;white-space:normal}.nested-value dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:8px;margin:0}.nested-value dt{color:var(--p-text-muted-color);font-weight:500}.nested-value dd{min-width:0;margin:0}.nested-value ol{padding-inline-start:16px;margin:0}.nested-value li+li{margin-block-start:8px}.case-value{display:flex;flex-direction:column;gap:8px}@container docscout (max-width:600px){.nested-value dl{grid-template-columns:minmax(0,1fr)}.nested-value dd{padding-inline-start:12px}.field-group{padding-inline-start:8px}}.structured-value{padding:12px 16px}.rows>.value-row,.value-list .rows>li{list-style:none}.case-table td:has(.case-value){white-space:normal}@container docscout (max-width:600px){.runs-table .result-detail{display:block}.runs-table .result-detail>td{display:block;width:100%}.case-table td:has(.case-value){flex-basis:100%;display:block}.structured-value{padding-inline:8px}}';
function Mi(e, t) {
  return class extends ro {
    static get wippyConfig() {
      return { propsSchema: t, inlineCss: Ja };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [Ga] };
    }
  };
}
const K = (e) => `/api/v1/docscout/${encodeURIComponent(e)}`;
function M(e) {
  if (e.success === !1) throw new Error(e.error || "Request failed");
  return e;
}
const Qa = (e) => e.response?.data, Di = {
  async list(e = {}) {
    return M((await R.get("/api/v1/docscout", { params: e })).data);
  },
  async get(e) {
    return M((await R.get(K(e))).data);
  },
  async create(e) {
    return M((await R.post("/api/v1/docscout", e)).data);
  },
  async update(e, t) {
    return M((await R.put(K(e), t)).data);
  },
  async addCase(e, t) {
    return M((await R.post(K(e) + "/cases", t)).data);
  },
  async deleteCase(e, t) {
    M((await R.delete(K(e) + "/cases/" + encodeURIComponent(t))).data);
  },
  // A run that stops partway still answers with its run id and step trace.
  async run(e, t) {
    try {
      return M((await R.post(K(e) + "/run", { upload_id: t })).data);
    } catch (r) {
      const n = Qa(r), o = n?.details?.trace;
      if (!o) throw r;
      return { run_id: n?.details?.run_id ?? "", upload_id: t, config_revision: 0, values: {}, fields: [], trace: o, duration_ms: o.reduce((i, s) => i + s.duration_ms, 0), tokens: o.reduce((i, s) => i + s.input_tokens + s.output_tokens, 0), status: "failed", error: n?.error };
    }
  },
  async evaluate(e) {
    return M((await R.post(K(e) + "/evaluations", {})).data);
  },
  async evaluations(e) {
    return M((await R.get(K(e) + "/evaluations")).data).items;
  },
  async evaluation(e, t) {
    return M((await R.get(K(e) + "/evaluations/" + encodeURIComponent(t))).data).evaluation;
  },
  async remove(e) {
    M((await R.delete(K(e))).data);
  }
}, Za = { fields: { items: { default: { name: "", type: "text", description: "", enum_values: [], required: !1, search_hints: "", validation_hints: "", expected_format: "", strategy: "standard", search_within: "document", group: "", evidence_required: !0, chunks: 5 } } }, stages: { properties: { map: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, outline: { type: "string", default: "find_or_build", enum: ["find_or_build", "build"] }, section_summaries: { type: "boolean", default: !1 } }, required: ["enabled", "model", "outline", "section_summaries"], default: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 } }, prefetch: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, queries: { type: "array", default: [], items: { type: "object", additionalProperties: !1, properties: { name: { type: "string", minLength: 1, maxLength: 200, default: "" }, query: { type: "string", minLength: 1, maxLength: 4e3, default: "" }, chunks: { type: "integer", default: 5, minimum: 1, maximum: 1e3 } }, required: ["name", "query", "chunks"], default: { name: "", query: "", chunks: 5 } }, maxItems: 100 } }, required: ["enabled", "queries"], default: { enabled: !0, queries: [] } }, scout: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, mode: { type: "string", default: "loop", enum: ["loop", "agent"] }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, max_rounds: { type: "integer", default: 0, minimum: 0, maximum: 30 }, target_confidence: { type: "number", default: 0.7, minimum: 0, maximum: 1 }, max_extra_queries: { type: "integer", default: 3, minimum: 0, maximum: 20 }, max_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, drop_noise: { type: "boolean", default: !0 }, share_notes: { type: "boolean", default: !0 }, tools: { type: "array", default: ["keyword_search", "semantic_search", "read_section", "read_outline"], items: { type: "string", enum: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, uniqueItems: !0 } }, required: ["enabled", "mode", "model", "max_rounds", "target_confidence", "max_extra_queries", "max_tokens", "drop_noise", "share_notes", "tools"], default: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] } }, deep: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !0 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, query_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, read: { type: "string", default: "chunks", enum: ["chunks", "sections"] }, parallel_fields: { type: "integer", default: 4, minimum: 1, maximum: 20 }, max_queries: { type: "integer", default: 5, minimum: 1, maximum: 100 }, chunks_per_query: { type: "integer", default: 50, minimum: 1, maximum: 1e3 }, chunk_cap: { type: "integer", default: 100, minimum: 1, maximum: 1e4 }, min_similarity: { type: "number", default: 0.2, minimum: 0, maximum: 1 }, query_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 }, analysis_temperature: { type: "number", default: 0.2, minimum: 0, maximum: 2 } }, required: ["enabled", "model", "query_model", "read", "parallel_fields", "max_queries", "chunks_per_query", "chunk_cap", "min_similarity", "query_temperature", "analysis_temperature"], default: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 } }, extract: { type: "object", additionalProperties: !1, properties: { model: { type: "string", default: "class:premium", minLength: 1, maxLength: 200 }, max_output_tokens: { type: "integer", default: 4096, minimum: 256, maximum: 64e3 }, max_fields_per_call: { type: "integer", default: 20, minimum: 1, maximum: 100 } }, required: ["model", "max_output_tokens", "max_fields_per_call"], default: { model: "class:premium", max_output_tokens: 4096, max_fields_per_call: 20 } }, verify: { type: "object", additionalProperties: !1, properties: { enabled: { type: "boolean", default: !1 }, model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, check_quotes: { type: "boolean", default: !0 }, check_support: { type: "boolean", default: !0 } }, required: ["enabled", "model", "check_quotes", "check_support"], default: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } } } }, retrieval: { properties: { chunk_size: { type: "integer", default: 1200, minimum: 100, maximum: 16e3 }, overlap: { type: "integer", default: 150, minimum: 0, maximum: 4e3 }, split_headings: { type: "boolean", default: !0 }, keep_tables: { type: "boolean", default: !0 }, search_mode: { type: "string", default: "hybrid", enum: ["keyword", "semantic", "hybrid"] }, embedding_model: { type: "string", default: "class:embed", minLength: 1, maxLength: 200 }, context: { type: "string", default: "headings", enum: ["none", "headings", "generated"] }, context_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, highlighter: { type: "boolean", default: !1 }, highlighter_model: { type: "string", default: "class:fast", minLength: 1, maxLength: 200 }, section_budget: { type: "integer", default: 6e3, minimum: 500, maximum: 64e3 } } } }, Ze = {
  properties: Za,
  default: { fields: [], stages: { map: { enabled: !0, model: "class:fast", outline: "find_or_build", section_summaries: !1 }, prefetch: { enabled: !0, queries: [] }, scout: { enabled: !0, mode: "loop", model: "class:fast", max_rounds: 0, target_confidence: 0.7, max_extra_queries: 3, max_tokens: 4096, drop_noise: !0, share_notes: !0, tools: ["keyword_search", "semantic_search", "read_section", "read_outline"] }, deep: { enabled: !0, model: "class:fast", query_model: "class:fast", read: "chunks", parallel_fields: 4, max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 }, extract: { model: "class:premium", max_output_tokens: 4096, max_fields_per_call: 20 }, verify: { enabled: !1, model: "class:fast", check_quotes: !0, check_support: !0 } }, retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, keep_tables: !0, search_mode: "hybrid", embedding_model: "class:embed", context: "headings", context_model: "class:fast", highlighter: !1, highlighter_model: "class:fast", section_budget: 6e3 }, tags: [] }
}, Xa = 4, Bi = () => ({ name: "", type: "text", description: "", enum_values: [], expected_format: "", required: !1 }), Ui = () => ({ type: "text", description: "", enum_values: [], expected_format: "" }), pt = (e) => e.group ? `${e.group}.${e.name}` : e.name, ei = /^(?:[a-z][a-z0-9]*(?:_[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:_[a-z0-9]+)*)*)?$/;
function qi(e, t) {
  let r = e;
  for (const n of t.split(".")) {
    if (r === null || typeof r != "object" || !Object.hasOwn(r, n)) return;
    r = r[n];
  }
  return r;
}
function Wi(e, t, r) {
  const n = t.split(".");
  let o = e;
  for (const i of n.slice(0, -1))
    Object.hasOwn(o, i) || (o[i] = {}), o = o[i];
  Object.defineProperty(o, n.at(-1), { value: r, writable: !0, enumerable: !0, configurable: !0 });
}
function Fi(e) {
  const t = { name: "", path: "", indices: [], children: [] };
  return e.forEach((r, n) => {
    let o = t;
    for (const i of r.split(".").slice(0, -1)) {
      let s = o.children.find((l) => l.name === i);
      s || (s = { name: i, path: o.path ? `${o.path}.${i}` : i, indices: [], children: [] }, o.children.push(s)), o = s;
    }
    o.indices.push(n);
  }), t;
}
function Hi() {
  const e = structuredClone(Ze.default), { model: t, max_output_tokens: r, max_fields_per_call: n } = e.stages.extract;
  return { ...e, stages: { ...e.stages, extract: { model: t, max_output_tokens: r, max_fields_per_call: n } } };
}
const Ki = () => structuredClone(Ze.properties.fields.items.default), Yi = () => ({ name: "", query: "", chunks: 5 }), Gi = () => [...Ze.properties.stages.properties.scout.properties.tools.default], Rr = Ze, Vr = (e) => ({ min: e?.minimum ?? 0, max: e?.maximum ?? 100 }), Ji = (e, t) => Vr(Rr.properties.stages.properties[e]?.properties[t]), Qi = (e) => Vr(Rr.properties.retrieval.properties[e]), Zi = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, Xi = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, es = {
  map: "Find the table of contents or build an outline, then pick the sections each field should read.",
  prefetch: "Search for every field by its name, description and hints, plus any fixed queries, to fill the evidence pool.",
  scout: "Judge the evidence, drop noise and look for more until confident.",
  deep: "Give each deep field its own searches and a written analysis, several fields at a time.",
  extract: "Fill the fields from the evidence, one group of fields per call.",
  verify: "Check that each quote exists in the document and supports its value."
}, ts = (e, t) => t === "extract" || e.stages[t].enabled, Y = (e, t) => `${e} ${e === 1 ? t : t.endsWith("y") ? t.slice(0, -1) + "ies" : t + "s"}`;
function Mr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.fields) {
    const n = r.group.trim() || "Default";
    t.set(n, [...t.get(n) ?? [], r]);
  }
  return [...t].map(([r, n]) => ({ name: r, fields: n }));
}
function ti(e) {
  return Mr(e).reduce((t, r) => t + Math.max(1, Math.ceil(r.fields.length / e.stages.extract.max_fields_per_call)), 0);
}
function rs(e, t) {
  const r = t.stages;
  switch (e) {
    case "map": {
      const n = t.fields.filter((o) => o.search_within === "sections").length;
      return [r.map.outline === "build" ? "Always build an outline" : "Contents first, else build", n ? `${Y(n, "field")} read Map's sections` : ""].filter(Boolean).join(" · ");
    }
    case "prefetch": {
      const n = t.fields.filter((i) => i.strategy !== "deep" || !r.deep.enabled).length, o = t.fields.filter((i) => i.search_hints.trim()).length;
      return [Y(n, "field"), o ? Y(o, "field hint") : "", r.prefetch.queries.length ? Y(r.prefetch.queries.length, "query") : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return r.scout.mode === "agent" ? `Agent with tools · up to ${Y(r.scout.max_rounds * r.scout.max_extra_queries, "tool call")}` : `Structured loop · ${r.scout.max_rounds ? `up to ${Y(r.scout.max_rounds, "round")}, stop at ${Math.round(r.scout.target_confidence * 100)}%` : "single pass"}`;
    case "deep": {
      const n = t.fields.filter((o) => o.strategy === "deep").length;
      return n ? `${Y(n, "field")} · reads ${r.deep.read} · ${r.deep.parallel_fields} at a time` : "No deep fields";
    }
    case "extract": {
      const n = ti(t);
      return `Structured output · ${Y(Mr(t).length, "group")}, ${Y(n, "call")}`;
    }
    case "verify":
      return [r.verify.check_quotes ? "quotes exist" : "", r.verify.check_support ? "quotes support values" : ""].filter(Boolean).join(" · ") || "No checks";
  }
}
function ns(e) {
  const t = e.context === "generated" ? "generated context" : e.context === "headings" ? "heading context" : "";
  return [`${e.chunk_size.toLocaleString()}-token chunks`, `${e.search_mode} search`, t, e.highlighter ? "highlighter" : ""].filter(Boolean).join(" · ");
}
function os(e) {
  return e ? e.startsWith("class:") ? e.slice(6).replace(/^\w/, (t) => t.toUpperCase()) : e.split("/").pop() ?? e : "";
}
function as(e) {
  return e.replace(/_/g, " ").replace(/^\w/, (t) => t.toUpperCase());
}
const is = (e, t = !0) => e.type === "enum" || !t && e.type === "text";
function ut(e, t = 1) {
  if (t > Xa) return "Shapes support at most four levels.";
  if (e.type === "enum" && !e.enum_values?.length) return "Add at least one allowed value.";
  if (e.enum_values?.length && e.type !== "enum" && e.type !== "text") return "Allowed values apply to enum fields and text items.";
  if (e.type === "object") {
    if (!e.properties?.length) return "Add at least one declared property.";
    const r = /* @__PURE__ */ new Set();
    for (const n of e.properties) {
      const o = Dr(n.name, [...r]) || ut(n, t + 1);
      if (o) return `${n.name || "New property"}: ${o}`;
      r.add(n.name);
    }
  } else if (e.properties) return "Properties apply to object shapes.";
  return e.type === "list" ? e.item ? ut(e.item, t + 1) : "Declare the item shape." : e.item ? "Item shapes apply to lists." : "";
}
function Dr(e, t) {
  return e ? /^[A-Za-z][A-Za-z0-9_]*$/.test(e) ? t.includes(e) ? "Another field already uses this name." : "" : "Start with a letter; use letters, numbers and underscores." : "Name the field.";
}
function ri(e, t) {
  const r = Dr(e.name, t.includes(pt(e)) ? [e.name] : []);
  return r || (ei.test(e.group) ? e.enum_values.length && e.type !== "enum" ? "Allowed values apply to enum fields and text items." : ut(e) : "Use a dotted path of snake_case group names.");
}
function ss(e) {
  const t = e.type === "list" ? e.item?.type : e.type;
  return { text: "For example, full legal name", number: "For example, decimal with 2 places", date: "For example, YYYY-MM-DD", object: "Describe the object format", boolean: "", enum: "" }[t ?? ""] ?? "";
}
function ls(e) {
  for (const [o, i] of e.fields.entries()) {
    const s = ri(i, e.fields.filter((l, a) => a !== o).map(pt));
    if (s) return `${i.name || "New field"}: ${s}`;
  }
  const t = e.fields.map(pt);
  for (const o of t)
    if (t.some((i) => i !== o && i.startsWith(o + "."))) return `Group path collides with field ${o}.`;
  const r = e.stages;
  if (r.prefetch.queries.some((o) => !o.name.trim() || !o.query.trim())) return "Prefetch queries need a name and a query.";
  if (!r.map.enabled && e.fields.some((o) => o.search_within === "sections")) return "Fields that read sections need Map the document.";
  const n = e.fields.find((o) => !(o.strategy === "deep" && r.deep.enabled) && !r.prefetch.enabled && !r.scout.enabled);
  return n ? `Turn on Prefetch or Scout so extraction has passages to read for ${n.name}.` : r.scout.enabled && r.scout.mode === "agent" && !r.scout.tools.length ? "Agent scouting needs at least one tool." : r.scout.enabled && r.scout.mode === "agent" && (!r.scout.max_rounds || !r.scout.max_extra_queries) ? "Agent scouting needs at least one round and one tool call per round." : r.verify.enabled && !r.verify.check_quotes && !r.verify.check_support ? "Verify needs at least one check." : e.retrieval.overlap >= e.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function cs(e, t) {
  const r = (n, o) => o !== null && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.keys(o).sort().map((i) => [i, o[i]])) : o;
  return JSON.stringify(e, r) === JSON.stringify(t, r);
}
var Br = {
  name: "SpinnerIcon",
  extends: ya
};
function ni(e) {
  return si(e) || ii(e) || ai(e) || oi();
}
function oi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ai(e, t) {
  if (e) {
    if (typeof e == "string") return mt(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? mt(e, t) : void 0;
  }
}
function ii(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function si(e) {
  if (Array.isArray(e)) return mt(e);
}
function mt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function li(e, t, r, n, o, i) {
  return G(), $e("svg", E({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), ni(t[0] || (t[0] = [vn("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Br.render = li;
var ci = `
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
`, di = {
  root: function(t) {
    var r = t.props, n = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": P(r.value) && String(r.value).length === 1,
      "p-badge-dot": ue(r.value) && !n.$slots.default,
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
}, pi = C.extend({
  name: "badge",
  style: ci,
  classes: di
}), ui = {
  name: "BaseBadge",
  extends: gt,
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
  style: pi,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
function ar(e, t, r) {
  return (t = mi(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function mi(e) {
  var t = fi(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function fi(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ie(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ur = {
  name: "Badge",
  extends: ui,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return Ce(ar(ar({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, hi = ["data-p"];
function gi(e, t, r, n, o, i) {
  return G(), $e("span", E({
    class: e.cx("root"),
    "data-p": i.dataP
  }, e.ptmi("root")), [Q(e.$slots, "default", {}, function() {
    return [yn(lr(e.value), 1)];
  })], 16, hi);
}
Ur.render = gi;
var bi = `
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
function Re(e) {
  "@babel/helpers - typeof";
  return Re = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Re(e);
}
function U(e, t, r) {
  return (t = vi(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function vi(e) {
  var t = yi(e, "string");
  return Re(t) == "symbol" ? t : t + "";
}
function yi(e, t) {
  if (Re(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Re(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var xi = {
  root: function(t) {
    var r = t.instance, n = t.props;
    return ["p-button p-component", U(U(U(U(U(U(U(U(U({
      "p-button-icon-only": r.hasIcon && !n.label && !n.badge,
      "p-button-vertical": (n.iconPos === "top" || n.iconPos === "bottom") && n.label,
      "p-button-loading": n.loading,
      "p-button-link": n.link || n.variant === "link"
    }, "p-button-".concat(n.severity), n.severity), "p-button-raised", n.raised), "p-button-rounded", n.rounded), "p-button-text", n.text || n.variant === "text"), "p-button-outlined", n.outlined || n.variant === "outlined"), "p-button-sm", n.size === "small"), "p-button-lg", n.size === "large"), "p-button-plain", n.plain), "p-button-fluid", r.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var r = t.props;
    return ["p-button-icon", U({}, "p-button-icon-".concat(r.iconPos), r.label)];
  },
  label: "p-button-label"
}, wi = C.extend({
  name: "button",
  style: bi,
  classes: xi
}), ki = {
  name: "BaseButton",
  extends: gt,
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
  style: wi,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
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
function L(e, t, r) {
  return (t = _i(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _i(e) {
  var t = Si(e, "string");
  return Ve(t) == "symbol" ? t : t + "";
}
function Si(e, t) {
  if (Ve(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ve(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var $i = {
  name: "Button",
  extends: ki,
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
      return E(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return ue(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return Ce(L(L(L(L(L(L(L(L(L(L({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return Ce(L(L({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return Ce(L(L({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Br,
    Badge: Ur
  },
  directives: {
    ripple: Ra
  }
}, Pi = ["data-p"], Ci = ["data-p"];
function Oi(e, t, r, n, o, i) {
  var s = kt("SpinnerIcon"), l = kt("Badge"), a = xn("ripple");
  return e.asChild ? Q(e.$slots, "default", {
    key: 1,
    class: _t(e.cx("root")),
    a11yAttrs: i.a11yAttrs
  }) : wn((G(), He(kn(e.as), E({
    key: 0,
    class: e.cx("root"),
    "data-p": i.dataP
  }, i.attrs), {
    default: _n(function() {
      return [Q(e.$slots, "default", {}, function() {
        return [e.loading ? Q(e.$slots, "loadingicon", E({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (G(), $e("span", E({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (G(), He(s, E({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : Q(e.$slots, "icon", E({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (G(), $e("span", E({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": i.dataIconP
          }, e.ptm("icon")), null, 16, Pi)) : Se("", !0)];
        }), e.label ? (G(), $e("span", E({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": i.dataLabelP
        }), lr(e.label), 17, Ci)) : Se("", !0), e.badge ? (G(), He(l, {
          key: 3,
          value: e.badge,
          class: _t(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : Se("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[a]]);
}
$i.render = Oi;
export {
  es as A,
  C as B,
  Yi as C,
  ti as D,
  Ji as E,
  Qi as F,
  pt as G,
  Fi as H,
  Vi as I,
  ns as J,
  ei as K,
  Ri as L,
  Xa as M,
  Ki as N,
  qi as O,
  Wi as P,
  ls as Q,
  cs as R,
  bo as U,
  Ei as a,
  zi as b,
  Di as c,
  Mi as d,
  gt as e,
  P as f,
  Ce as g,
  Zi as h,
  ts as i,
  Ni as j,
  y as k,
  Mr as l,
  os as m,
  Hi as n,
  Xi as o,
  rs as p,
  is as q,
  ss as r,
  $i as s,
  as as t,
  Li as u,
  Ii as v,
  Bi as w,
  Ui as x,
  ri as y,
  Gi as z
};
