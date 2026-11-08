import { hasInjectionContext as oo, inject as sn, effectScope as ro, ref as L, markRaw as io, createApp as ao, readonly as so, getCurrentInstance as Se, onMounted as ln, nextTick as lo, watch as Pt, reactive as uo, renderSlot as ot, openBlock as V, createBlock as Ct, Teleport as un, createCommentVNode as st, useId as co, mergeProps as D, h as po, createElementBlock as M, createElementVNode as N, createTextVNode as fo, toDisplayString as Ot, resolveComponent as $e, resolveDirective as ho, withDirectives as mo, resolveDynamicComponent as dn, withCtx as bo, normalizeClass as we, defineComponent as vo, computed as wt, createVNode as tt, unref as et, withModifiers as ee } from "vue";
import { addCollection as go, Icon as ke } from "@iconify/vue";
import { config as Pe, addIcons as yo, on as _o, applyThemeMode as Wt, host as So, hostCss as $o, loadCss as wo, loadByTagName as ne, api as Ht, define as ko } from "@wippy-fe/proxy";
var se = "data-wippy-visible";
function xe(t) {
  const e = t.getAttribute(se);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Po = Object.defineProperty, xo = (t, e, n) => e in t ? Po(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, E = (t, e, n) => xo(t, typeof e != "symbol" ? e + "" : e, n), Co = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Oo = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Ce(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function To(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    if (n)
      for (const [o, r] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && r && typeof r == "object") {
          for (const [l, s] of Object.entries(r)) {
            const i = typeof s == "string" ? Ce(l) : null;
            i && e.add(i);
          }
          continue;
        }
        const a = typeof r == "string" ? Ce(o) : null;
        a && e.add(a);
      }
  return [...e].sort();
}
function Ao(t) {
  if (t.length === 0)
    return "";
  const e = t.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Oo} {
${e}
}`;
}
function Eo(t, e) {
  const n = Ao(e);
  n && cn(t, n, "@wippy-fe/css-variables-bridge");
}
function No(t, e) {
  const o = (e ?? Co).map(async (r) => {
    const a = $o[r];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await wo(a);
    } catch (l) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${a}):`, l), null;
    }
  });
  return Promise.all(o).then((r) => {
    for (const a of r) {
      if (!a)
        continue;
      const l = document.createElement("style");
      l.textContent = a, l.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(l);
    }
  });
}
function jo(t, e) {
  const n = document.createElement("style");
  n.textContent = e, t.appendChild(n);
}
function cn(t, e, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, r];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = e, t.appendChild(o);
}
function Lo(t, e) {
  cn(t, e, "@wippy-fe/custom-css");
}
function pn(t) {
  return t.__wippyHost ?? null;
}
function Vo(t) {
  return t.replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function Io(t, e, n) {
  switch (n.type) {
    case "string":
      return { value: e };
    case "number": {
      const o = Number.parseFloat(e);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${t}: expected a number` } : { value: o };
    }
    case "integer": {
      const o = Number.parseInt(e, 10);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${t}: expected an integer` } : { value: o };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const o = JSON.parse(e);
        return n.type === "array" && !Array.isArray(o) ? { value: void 0, error: `Invalid ${t}: expected a JSON array` } : { value: o };
      } catch {
        return { value: void 0, error: `Invalid ${t}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function oe(t, e) {
  const n = {}, o = [];
  for (const [r, a] of Object.entries(e.properties)) {
    const l = t.getAttribute(r), s = Vo(r);
    if (l === null) {
      a.default !== void 0 && (n[s] = a.default);
      continue;
    }
    const i = Io(r, l, a);
    i.error ? o.push(i.error) : n[s] = i.value;
  }
  return { props: n, errors: o };
}
var Ro = class {
  constructor(t, e) {
    E(this, "_props"), E(this, "_errors"), E(this, "_content"), E(this, "_hostVisibility"), E(this, "_propsListeners", /* @__PURE__ */ new Set()), E(this, "_contentListeners", /* @__PURE__ */ new Set()), E(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), E(this, "_disposed", !1), E(this, "_emitToDom"), E(this, "props"), E(this, "events"), E(this, "content"), E(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
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
    }, this.content = t.hasContent ? {
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
  notifyProps(t, e) {
    if (!this._disposed) {
      this._props = t, this._errors = e;
      for (const n of this._propsListeners)
        n(t, e);
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
      for (const n of this._hostVisibilityListeners)
        n(t, e);
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
    const n = () => {
      this._propsListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(t), e?.immediate && t(this._content);
    const n = () => {
      this._contentListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(t), e?.immediate && t(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, Do = class extends HTMLElement {
  constructor() {
    super(), E(this, "_internals"), E(this, "_contentObserver", null), E(this, "_initialized", !1), E(this, "_container", null), E(this, "_reactive", null), E(this, "_lastProps", null), E(this, "_lastErrors", []), E(this, "_lastContent", null), E(this, "_themeUnsub", null), E(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = xe(this);
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
    const t = this.wippyConfig, e = Object.keys(t.propsSchema.properties), n = t.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...n, se])];
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
    return pn(this);
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
      let n, o;
      if (this._lastProps !== null)
        n = this._lastProps, o = this._lastErrors;
      else {
        const a = oe(this, t.propsSchema);
        t.validateProps && a.errors.push(...t.validateProps(a.props)), n = a.props, o = a.errors, this._lastProps = n, this._lastErrors = o;
      }
      const r = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = r), this._reactive = new Ro(
        { props: n, errors: o, content: r, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, e = this._initialized, n = this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" });
      let o;
      if (e)
        o = this._container;
      else {
        this.onInit(n), t.inlineCss && jo(n, t.inlineCss);
        try {
          const u = Pe?.theming, d = To(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Eo(n, d);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const u = Pe?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && Lo(n, d);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && No(n, t.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const i = t.containerClasses ?? [];
        i.length > 0 && o.classList.add(...i), n.appendChild(o), this._container = o, yo(go);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = _o("@theme", (i) => this._applyTheme(i)));
      const { props: r, errors: a } = oe(this, t.propsSchema);
      t.validateProps && a.push(...t.validateProps(r));
      const l = r;
      this._lastProps = l, this._lastErrors = a;
      let s = null;
      t.contentTemplate && (s = this._extractContent(t.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(t.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, o, l, a, s, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (t) {
      this.onError(t), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(t = So.getThemeMode?.()) {
    Wt(t, this), this._container && Wt(t, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Wt("auto", this), this._container && Wt("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(t, e, n) {
    if (e === n)
      return;
    if (t === se) {
      const s = this._hostVisible, i = xe(this);
      if (i === s)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, s), this.onHostVisibilityChanged(i, s));
      return;
    }
    const o = this.constructor.wippyConfig, { props: r, errors: a } = oe(this, o.propsSchema);
    o.validateProps && a.push(...o.validateProps(r));
    const l = r;
    this._lastProps = l, this._lastErrors = a, this._reactive?.notifyProps(l, a), this.onPropsChanged(l, a);
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
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(t) {
    return this.querySelector(`template[data-type="${t}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(t) {
  }
};
function Mo(t) {
  return t.__wippyHostBus ?? null;
}
function Fo(t) {
  return t.dataset.wippyPanelId ?? null;
}
let fn;
const hn = (t) => fn = t, Bo = () => oo() && sn(mn) || fn, mn = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
function zo() {
  const t = ro(!0), e = t.run(() => L({}));
  let n = [], o = [];
  const r = io({
    install(a) {
      hn(r), r._a = a, a.provide(mn, r), a.config.globalProperties.$pinia = r, o.forEach((l) => n.push(l)), o = [];
    },
    use(a) {
      return this._a ? n.push(a) : o.push(a), this;
    },
    _p: n,
    _a: null,
    _e: t,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return r;
}
var Uo = Object.defineProperty, Wo = (t, e, n) => e in t ? Uo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, yt = (t, e, n) => Wo(t, typeof e != "symbol" ? e + "" : e, n), bn = /* @__PURE__ */ Symbol("wippy:emit"), Ho = /* @__PURE__ */ Symbol("wippy:props"), Ko = /* @__PURE__ */ Symbol("wippy:props_error"), Yo = /* @__PURE__ */ Symbol("wippy:content"), Go = /* @__PURE__ */ Symbol("wippy:panel-id"), qo = /* @__PURE__ */ Symbol("wippy:layout-bus"), Jo = /* @__PURE__ */ Symbol("wippy:host"), Qo = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Zo() {
  const t = sn(bn);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
var Xo = class extends Do {
  constructor() {
    super(...arguments), yt(this, "_vueApp", null), yt(this, "_propsRef", L({})), yt(this, "_errorsRef", L([])), yt(this, "_contentRef", L(null)), yt(this, "_hostVisibilityRef", L(null)), yt(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(t, e, n, o, r, a) {
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
    const i = (u) => {
      if (s.signal.aborted)
        return;
      const d = Bo(), c = ao(u.rootComponent);
      this._vueApp = c;
      const p = zo();
      if (u.piniaPlugins)
        for (const f of u.piniaPlugins)
          p.use(f);
      if (c.use(p), u.plugins)
        for (const f of u.plugins)
          c.use(f);
      c.provide(Ho, this._propsRef), c.provide(Ko, this._errorsRef), c.provide(bn, this.emitEvent.bind(this)), c.provide(Yo, this._contentRef), c.provide(Qo, this._hostVisibilityRef), c.provide(Go, Fo(this)), c.provide(qo, Mo(this)), c.provide(Jo, pn(this)), u.providers && u.providers(c, this), c.mount(e), d && hn(d);
    };
    if (l.rootComponent)
      i(l);
    else if (l.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), e.appendChild(u), l.lazyConfig().then((d) => {
        s.signal.aborted || (u.remove(), i(d));
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
}, tr = Object.defineProperty, Oe = Object.getOwnPropertySymbols, er = Object.prototype.hasOwnProperty, nr = Object.prototype.propertyIsEnumerable, Te = (t, e, n) => e in t ? tr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, or = (t, e) => {
  for (var n in e || (e = {})) er.call(e, n) && Te(t, n, e[n]);
  if (Oe) for (var n of Oe(e)) nr.call(e, n) && Te(t, n, e[n]);
  return t;
};
function ht(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0 || !(t instanceof Date) && typeof t == "object" && Object.keys(t).length === 0;
}
function me(t) {
  return typeof t == "function" && "call" in t && "apply" in t;
}
function T(t) {
  return !ht(t);
}
function Z(t, e = !0) {
  return t instanceof Object && t.constructor === Object && (e || Object.keys(t).length !== 0);
}
function vn(t = {}, e = {}) {
  let n = or({}, t);
  return Object.keys(e).forEach((o) => {
    let r = o;
    Z(e[r]) && r in t && Z(t[r]) ? n[r] = vn(t[r], e[r]) : n[r] = e[r];
  }), n;
}
function rr(...t) {
  return t.reduce((e, n, o) => o === 0 ? n : vn(e, n), {});
}
function U(t, ...e) {
  return me(t) ? t(...e) : t;
}
function z(t, e = !0) {
  return typeof t == "string" && (e || t !== "");
}
function Q(t) {
  return z(t) ? t.replace(/(-|_)/g, "").toLowerCase() : t;
}
function be(t, e = "", n = {}) {
  let o = Q(e).split("."), r = o.shift();
  if (r) {
    if (Z(t)) {
      let a = Object.keys(t).find((l) => Q(l) === r) || "";
      return be(U(t[a], n), o.join("."), n);
    }
    return;
  }
  return U(t, n);
}
function gn(t, e = !0) {
  return Array.isArray(t) && (e || t.length !== 0);
}
function ir(t) {
  return T(t) && !isNaN(t);
}
function pt(t, e) {
  if (e) {
    let n = e.test(t);
    return e.lastIndex = 0, n;
  }
  return !1;
}
function ar(...t) {
  return rr(...t);
}
function Tt(t) {
  return t && t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function sr(t) {
  return z(t, !1) ? t[0].toUpperCase() + t.slice(1) : t;
}
function yn(t) {
  return z(t) ? t.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : t;
}
function _n() {
  let t = /* @__PURE__ */ new Map();
  return { on(e, n) {
    let o = t.get(e);
    return o ? o.push(n) : o = [n], t.set(e, o), this;
  }, off(e, n) {
    let o = t.get(e);
    return o && o.splice(o.indexOf(n) >>> 0, 1), this;
  }, emit(e, n) {
    let o = t.get(e);
    o && o.forEach((r) => {
      r(n);
    });
  }, clear() {
    t.clear();
  } };
}
function $t(...t) {
  if (t) {
    let e = [];
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      if (!o) continue;
      let r = typeof o;
      if (r === "string" || r === "number") e.push(o);
      else if (r === "object") {
        let a = Array.isArray(o) ? [$t(...o)] : Object.entries(o).map(([l, s]) => s ? l : void 0);
        e = a.length ? e.concat(a.filter((l) => !!l)) : e;
      }
    }
    return e.join(" ").trim();
  }
}
function lr(t, e) {
  return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function ur(t, e) {
  if (t && e) {
    let n = (o) => {
      lr(t, o) || (t.classList ? t.classList.add(o) : t.className += " " + o);
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function re(t, e) {
  if (t && e) {
    let n = (o) => {
      t.classList ? t.classList.remove(o) : t.className = t.className.replace(new RegExp("(^|\\b)" + o.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function Ae(t) {
  return t ? Math.abs(t.scrollLeft) : 0;
}
function dr(t, e) {
  return t instanceof HTMLElement ? t.offsetWidth : 0;
}
function cr(t) {
  if (t) {
    let e = t.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function pr(t) {
  return !!(t !== null && typeof t < "u" && t.nodeName && cr(t));
}
function zt(t) {
  return typeof Element < "u" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function Jt(t, e = {}) {
  if (zt(t)) {
    let n = (o, r) => {
      var a, l;
      let s = (a = t?.$attrs) != null && a[o] ? [(l = t?.$attrs) == null ? void 0 : l[o]] : [];
      return [r].flat().reduce((i, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") i.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(o, u) : Object.entries(u).map(([p, f]) => o === "style" && (f || f === 0) ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}` : f ? p : void 0);
            i = c.length ? i.concat(c.filter((p) => !!p)) : i;
          }
        }
        return i;
      }, s);
    };
    Object.entries(e).forEach(([o, r]) => {
      if (r != null) {
        let a = o.match(/^on(.+)/);
        a ? t.addEventListener(a[1].toLowerCase(), r) : o === "p-bind" || o === "pBind" ? Jt(t, r) : (r = o === "class" ? [...new Set(n("class", r))].join(" ").trim() : o === "style" ? n("style", r).join(";").trim() : r, (t.$attrs = t.$attrs || {}) && (t.$attrs[o] = r), t.setAttribute(o, r));
      }
    });
  }
}
function fr(t, e = {}, ...n) {
  {
    let o = document.createElement(t);
    return Jt(o, e), o.append(...n), o;
  }
}
function hr(t, e) {
  return zt(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function mr(t, e) {
  if (zt(t)) {
    let n = t.getAttribute(e);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Ee(t) {
  if (t) {
    let e = t.offsetHeight, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), e;
  }
  return 0;
}
function br(t) {
  if (t) {
    let e = t.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || Ae(document.documentElement) || Ae(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function vr(t, e) {
  return t ? t.offsetHeight : 0;
}
function Ne(t) {
  if (t) {
    let e = t.offsetWidth, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), e;
  }
  return 0;
}
function Sn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function gr(t, e = "", n) {
  zt(t) && n !== null && n !== void 0 && t.setAttribute(e, n);
}
var Kt = {};
function yr(t = "pui_id_") {
  return Object.hasOwn(Kt, t) || (Kt[t] = 0), Kt[t]++, `${t}${Kt[t]}`;
}
var _r = Object.defineProperty, Sr = Object.defineProperties, $r = Object.getOwnPropertyDescriptors, Qt = Object.getOwnPropertySymbols, $n = Object.prototype.hasOwnProperty, wn = Object.prototype.propertyIsEnumerable, je = (t, e, n) => e in t ? _r(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, K = (t, e) => {
  for (var n in e || (e = {})) $n.call(e, n) && je(t, n, e[n]);
  if (Qt) for (var n of Qt(e)) wn.call(e, n) && je(t, n, e[n]);
  return t;
}, ie = (t, e) => Sr(t, $r(e)), nt = (t, e) => {
  var n = {};
  for (var o in t) $n.call(t, o) && e.indexOf(o) < 0 && (n[o] = t[o]);
  if (t != null && Qt) for (var o of Qt(t)) e.indexOf(o) < 0 && wn.call(t, o) && (n[o] = t[o]);
  return n;
}, wr = _n(), I = wr, At = /{([^}]*)}/g, kn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Pn = /var\([^)]+\)/g;
function Le(t) {
  return z(t) ? t.replace(/[A-Z]/g, (e, n) => n === 0 ? e : "." + e.toLowerCase()).toLowerCase() : t;
}
function kr(t) {
  return Z(t) && t.hasOwnProperty("$value") && t.hasOwnProperty("$type") ? t.$value : t;
}
function Pr(t) {
  return t.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function le(t = "", e = "") {
  return Pr(`${z(t, !1) && z(e, !1) ? `${t}-` : t}${e}`);
}
function xn(t = "", e = "") {
  return `--${le(t, e)}`;
}
function xr(t = "") {
  let e = (t.match(/{/g) || []).length, n = (t.match(/}/g) || []).length;
  return (e + n) % 2 !== 0;
}
function Cn(t, e = "", n = "", o = [], r) {
  if (z(t)) {
    let a = t.trim();
    if (xr(a)) return;
    if (pt(a, At)) {
      let l = a.replaceAll(At, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((u) => !o.some((d) => pt(u, d)));
        return `var(${xn(n, yn(i.join("-")))}${T(r) ? `, ${r}` : ""})`;
      });
      return pt(l.replace(Pn, "0"), kn) ? `calc(${l})` : l;
    }
    return a;
  } else if (ir(t)) return t;
}
function Cr(t, e, n) {
  z(e, !1) && t.push(`${e}:${n};`);
}
function _t(t, e) {
  return t ? `${t}{${e}}` : "";
}
function On(t, e) {
  if (t.indexOf("dt(") === -1) return t;
  function n(l, s) {
    let i = [], u = 0, d = "", c = null, p = 0;
    for (; u <= l.length; ) {
      let f = l[u];
      if ((f === '"' || f === "'" || f === "`") && l[u - 1] !== "\\" && (c = c === f ? null : f), !c && (f === "(" && p++, f === ")" && p--, (f === "," || u === l.length) && p === 0)) {
        let m = d.trim();
        m.startsWith("dt(") ? i.push(On(m, s)) : i.push(o(m)), d = "", u++;
        continue;
      }
      f !== void 0 && (d += f), u++;
    }
    return i;
  }
  function o(l) {
    let s = l[0];
    if ((s === '"' || s === "'" || s === "`") && l[l.length - 1] === s) return l.slice(1, -1);
    let i = Number(l);
    return isNaN(i) ? l : i;
  }
  let r = [], a = [];
  for (let l = 0; l < t.length; l++) if (t[l] === "d" && t.slice(l, l + 3) === "dt(") a.push(l), l += 2;
  else if (t[l] === ")" && a.length > 0) {
    let s = a.pop();
    a.length === 0 && r.push([s, l]);
  }
  if (!r.length) return t;
  for (let l = r.length - 1; l >= 0; l--) {
    let [s, i] = r[l], u = t.slice(s + 3, i), d = n(u, e), c = e(...d);
    t = t.slice(0, s) + c + t.slice(i + 1);
  }
  return t;
}
var ft = (...t) => Or(x.getTheme(), ...t), Or = (t = {}, e, n, o) => {
  if (e) {
    let { variable: r, options: a } = x.defaults || {}, { prefix: l, transform: s } = t?.options || a || {}, i = pt(e, At) ? e : `{${e}}`;
    return o === "value" || ht(o) && s === "strict" ? x.getTokenValue(e) : Cn(i, void 0, l, [r.excludedKeyRegex], n);
  }
  return "";
};
function Yt(t, ...e) {
  if (t instanceof Array) {
    let n = t.reduce((o, r, a) => {
      var l;
      return o + r + ((l = U(e[a], { dt: ft })) != null ? l : "");
    }, "");
    return On(n, ft);
  }
  return U(t, { dt: ft });
}
function Tr(t, e = {}) {
  let n = x.defaults.variable, { prefix: o = n.prefix, selector: r = n.selector, excludedKeyRegex: a = n.excludedKeyRegex } = e, l = [], s = [], i = [{ node: t, path: o }];
  for (; i.length; ) {
    let { node: d, path: c } = i.pop();
    for (let p in d) {
      let f = d[p], m = kr(f), v = pt(p, a) ? le(c) : le(c, yn(p));
      if (Z(m)) i.push({ node: m, path: v });
      else {
        let b = xn(v), g = Cn(m, v, o, [a]);
        Cr(s, b, g);
        let $ = v;
        o && $.startsWith(o + "-") && ($ = $.slice(o.length + 1)), l.push($.replace(/-/g, "."));
      }
    }
  }
  let u = s.join("");
  return { value: s, tokens: l, declarations: u, css: _t(r, u) };
}
var H = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(t) {
  return { type: "class", selector: t, matched: this.pattern.test(t.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(t) {
  return { type: "attr", selector: `:root${t},:host${t}`, matched: this.pattern.test(t.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(t) {
  return { type: "media", selector: t, matched: this.pattern.test(t.trim()) };
} }, system: { pattern: /^system$/, resolve(t) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(t.trim()) };
} }, custom: { resolve(t) {
  return { type: "custom", selector: t, matched: !0 };
} } }, resolve(t) {
  let e = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [t].flat().map((n) => {
    var o;
    return (o = e.map((r) => r.resolve(n)).find((r) => r.matched)) != null ? o : this.rules.custom.resolve(n);
  });
} }, _toVariables(t, e) {
  return Tr(t, { prefix: e?.prefix });
}, getCommon({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var a, l, s, i, u, d, c;
  let { preset: p, options: f } = e, m, v, b, g, $, P, h;
  if (T(p) && f.transform !== "strict") {
    let { primitive: y, semantic: j, extend: F } = p, Y = j || {}, { colorScheme: G } = Y, C = nt(Y, ["colorScheme"]), _ = F || {}, { colorScheme: O } = _, W = nt(_, ["colorScheme"]), rt = G || {}, { dark: lt } = rt, mt = nt(rt, ["dark"]), ut = O || {}, { dark: bt } = ut, vt = nt(ut, ["dark"]), X = T(y) ? this._toVariables({ primitive: y }, f) : {}, q = T(C) ? this._toVariables({ semantic: C }, f) : {}, dt = T(mt) ? this._toVariables({ light: mt }, f) : {}, Ut = T(lt) ? this._toVariables({ dark: lt }, f) : {}, gt = T(W) ? this._toVariables({ semantic: W }, f) : {}, ye = T(vt) ? this._toVariables({ light: vt }, f) : {}, _e = T(bt) ? this._toVariables({ dark: bt }, f) : {}, [Mn, Fn] = [(a = X.declarations) != null ? a : "", X.tokens], [Bn, zn] = [(l = q.declarations) != null ? l : "", q.tokens || []], [Un, Wn] = [(s = dt.declarations) != null ? s : "", dt.tokens || []], [Hn, Kn] = [(i = Ut.declarations) != null ? i : "", Ut.tokens || []], [Yn, Gn] = [(u = gt.declarations) != null ? u : "", gt.tokens || []], [qn, Jn] = [(d = ye.declarations) != null ? d : "", ye.tokens || []], [Qn, Zn] = [(c = _e.declarations) != null ? c : "", _e.tokens || []];
    m = this.transformCSS(t, Mn, "light", "variable", f, o, r), v = Fn;
    let Xn = this.transformCSS(t, `${Bn}${Un}`, "light", "variable", f, o, r), to = this.transformCSS(t, `${Hn}`, "dark", "variable", f, o, r);
    b = `${Xn}${to}`, g = [.../* @__PURE__ */ new Set([...zn, ...Wn, ...Kn])];
    let eo = this.transformCSS(t, `${Yn}${qn}color-scheme:light`, "light", "variable", f, o, r), no = this.transformCSS(t, `${Qn}color-scheme:dark`, "dark", "variable", f, o, r);
    $ = `${eo}${no}`, P = [.../* @__PURE__ */ new Set([...Gn, ...Jn, ...Zn])], h = U(p.css, { dt: ft });
  }
  return { primitive: { css: m, tokens: v }, semantic: { css: b, tokens: g }, global: { css: $, tokens: P }, style: h };
}, getPreset({ name: t = "", preset: e = {}, options: n, params: o, set: r, defaults: a, selector: l }) {
  var s, i, u;
  let d, c, p;
  if (T(e) && n.transform !== "strict") {
    let f = t.replace("-directive", ""), m = e, { colorScheme: v, extend: b, css: g } = m, $ = nt(m, ["colorScheme", "extend", "css"]), P = b || {}, { colorScheme: h } = P, y = nt(P, ["colorScheme"]), j = v || {}, { dark: F } = j, Y = nt(j, ["dark"]), G = h || {}, { dark: C } = G, _ = nt(G, ["dark"]), O = T($) ? this._toVariables({ [f]: K(K({}, $), y) }, n) : {}, W = T(Y) ? this._toVariables({ [f]: K(K({}, Y), _) }, n) : {}, rt = T(F) ? this._toVariables({ [f]: K(K({}, F), C) }, n) : {}, [lt, mt] = [(s = O.declarations) != null ? s : "", O.tokens || []], [ut, bt] = [(i = W.declarations) != null ? i : "", W.tokens || []], [vt, X] = [(u = rt.declarations) != null ? u : "", rt.tokens || []], q = this.transformCSS(f, `${lt}${ut}`, "light", "variable", n, r, a, l), dt = this.transformCSS(f, vt, "dark", "variable", n, r, a, l);
    d = `${q}${dt}`, c = [.../* @__PURE__ */ new Set([...mt, ...bt, ...X])], p = U(g, { dt: ft });
  }
  return { css: d, tokens: c, style: p };
}, getPresetC({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var a;
  let { preset: l, options: s } = e, i = (a = l?.components) == null ? void 0 : a[t];
  return this.getPreset({ name: t, preset: i, options: s, params: n, set: o, defaults: r });
}, getPresetD({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var a, l;
  let s = t.replace("-directive", ""), { preset: i, options: u } = e, d = ((a = i?.components) == null ? void 0 : a[s]) || ((l = i?.directives) == null ? void 0 : l[s]);
  return this.getPreset({ name: s, preset: d, options: u, params: n, set: o, defaults: r });
}, applyDarkColorScheme(t) {
  return !(t.darkModeSelector === "none" || t.darkModeSelector === !1);
}, getColorSchemeOption(t, e) {
  var n;
  return this.applyDarkColorScheme(t) ? this.regex.resolve(t.darkModeSelector === !0 ? e.options.darkModeSelector : (n = t.darkModeSelector) != null ? n : e.options.darkModeSelector) : [];
}, getLayerOrder(t, e = {}, n, o) {
  let { cssLayer: r } = e;
  return r ? `@layer ${U(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: a }) {
  let l = this.getCommon({ name: t, theme: e, params: n, set: r, defaults: a }), s = Object.entries(o).reduce((i, [u, d]) => i.push(`${u}="${d}"`) && i, []).join(" ");
  return Object.entries(l || {}).reduce((i, [u, d]) => {
    if (Z(d) && Object.hasOwn(d, "css")) {
      let c = Tt(d.css), p = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${p}" ${s}>${c}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: a }) {
  var l;
  let s = { name: t, theme: e, params: n, set: r, defaults: a }, i = (l = t.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : l.css, u = Object.entries(o).reduce((d, [c, p]) => d.push(`${c}="${p}"`) && d, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${Tt(i)}</style>` : "";
}, createTokens(t = {}, e, n = "", o = "", r = {}) {
  let a = function(s, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && At.test(this.value)) {
      let c = this.value.trim().replace(At, (p) => {
        var f;
        let m = p.slice(1, -1), v = this.tokens[m];
        if (!v) return console.warn(`Token not found for path: ${m}`), "__UNRESOLVED__";
        let b = v.computed(s, i, u);
        return Array.isArray(b) && b.length === 2 ? `light-dark(${b[0].value},${b[1].value})` : (f = b?.value) != null ? f : "__UNRESOLVED__";
      });
      d = kn.test(c.replace(Pn, "0")) ? `calc(${c})` : c;
    }
    return ht(i.binding) && delete i.binding, u.pop(), { colorScheme: s, path: this.path, paths: i, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, l = (s, i, u) => {
    Object.entries(s).forEach(([d, c]) => {
      let p = pt(d, e.variable.excludedKeyRegex) ? i : i ? `${i}.${Le(d)}` : Le(d), f = u ? `${u}.${d}` : d;
      Z(c) ? l(c, p, f) : (r[p] || (r[p] = { paths: [], computed: (m, v = {}, b = []) => {
        if (r[p].paths.length === 1) return r[p].paths[0].computed(r[p].paths[0].scheme, v.binding, b);
        if (m && m !== "none") for (let g = 0; g < r[p].paths.length; g++) {
          let $ = r[p].paths[g];
          if ($.scheme === m) return $.computed(m, v.binding, b);
        }
        return r[p].paths.map((g) => g.computed(g.scheme, v[g.scheme], b));
      } }), r[p].paths.push({ path: f, value: c, scheme: f.includes("colorScheme.light") ? "light" : f.includes("colorScheme.dark") ? "dark" : "none", computed: a, tokens: r }));
    });
  };
  return l(t, n, o), r;
}, getTokenValue(t, e, n) {
  var o;
  let r = ((s) => s.split(".").filter((i) => !pt(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(e), a = e.includes("colorScheme.light") ? "light" : e.includes("colorScheme.dark") ? "dark" : void 0, l = [(o = t[r]) == null ? void 0 : o.computed(a)].flat().filter((s) => s);
  return l.length === 1 ? l[0].value : l.reduce((s = {}, i) => {
    let u = i, { colorScheme: d } = u, c = nt(u, ["colorScheme"]);
    return s[d] = c, s;
  }, void 0);
}, getSelectorRule(t, e, n, o) {
  return n === "class" || n === "attr" ? _t(T(e) ? `${t}${e},${t} ${e}` : t, o) : _t(t, _t(e ?? ":root,:host", o));
}, transformCSS(t, e, n, o, r = {}, a, l, s) {
  if (T(e)) {
    let { cssLayer: i } = r;
    if (o !== "style") {
      let u = this.getColorSchemeOption(r, l);
      e = n === "dark" ? u.reduce((d, { type: c, selector: p }) => (T(p) && (d += p.includes("[CSS]") ? p.replace("[CSS]", e) : this.getSelectorRule(p, s, c, e)), d), "") : _t(s ?? ":root,:host", e);
    }
    if (i) {
      let u = { name: "primeui" };
      Z(i) && (u.name = U(i.name, { name: t, type: o })), T(u.name) && (e = _t(`@layer ${u.name}`, e), a?.layerNames(u.name));
    }
    return e;
  }
  return "";
} }, x = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(t = {}) {
  let { theme: e } = t;
  e && (this._theme = ie(K({}, e), { options: K(K({}, this.defaults.options), e.options) }), this._tokens = H.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.preset) || {};
}, get options() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(t) {
  this.update({ theme: t }), I.emit("theme:change", t);
}, getPreset() {
  return this.preset;
}, setPreset(t) {
  this._theme = ie(K({}, this.theme), { preset: t }), this._tokens = H.createTokens(t, this.defaults), this.clearLoadedStyleNames(), I.emit("preset:change", t), I.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(t) {
  this._theme = ie(K({}, this.theme), { options: t }), this.clearLoadedStyleNames(), I.emit("options:change", t), I.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(t) {
  this._layerNames.add(t);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(t) {
  return this._loadedStyleNames.has(t);
}, setLoadedStyleName(t) {
  this._loadedStyleNames.add(t);
}, deleteLoadedStyleName(t) {
  this._loadedStyleNames.delete(t);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(t) {
  return H.getTokenValue(this.tokens, t, this.defaults);
}, getCommon(t = "", e) {
  return H.getCommon({ name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPresetC(n);
}, getDirective(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPresetD(n);
}, getCustomPreset(t = "", e, n, o) {
  let r = { name: t, preset: e, options: this.options, selector: n, params: o, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return H.getPreset(r);
}, getLayerOrderCSS(t = "") {
  return H.getLayerOrder(t, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(t = "", e, n = "style", o) {
  return H.transformCSS(t, e, o, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(t = "", e, n = {}) {
  return H.getCommonStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(t, e, n = {}) {
  return H.getStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(t) {
  this._loadingStyles.add(t);
}, onStyleUpdated(t) {
  this._loadingStyles.add(t);
}, onStyleLoaded(t, { name: e }) {
  this._loadingStyles.size && (this._loadingStyles.delete(e), I.emit(`theme:${e}:load`, t), !this._loadingStyles.size && I.emit("theme:load"));
} }, R = {
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
}, Ar = `
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
function Et(t) {
  "@babel/helpers - typeof";
  return Et = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Et(t);
}
function Ve(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ie(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ve(Object(n), !0).forEach(function(o) {
      Er(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ve(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Er(t, e, n) {
  return (e = Nr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Nr(t) {
  var e = jr(t, "string");
  return Et(e) == "symbol" ? e : e + "";
}
function jr(t, e) {
  if (Et(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Et(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Lr(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Se() && Se().components ? ln(t) : e ? t() : lo(t);
}
var Vr = 0;
function Ir(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = L(!1), o = L(t), r = L(null), a = Sn() ? window.document : void 0, l = e.document, s = l === void 0 ? a : l, i = e.immediate, u = i === void 0 ? !0 : i, d = e.manual, c = d === void 0 ? !1 : d, p = e.name, f = p === void 0 ? "style_".concat(++Vr) : p, m = e.id, v = m === void 0 ? void 0 : m, b = e.media, g = b === void 0 ? void 0 : b, $ = e.nonce, P = $ === void 0 ? void 0 : $, h = e.first, y = h === void 0 ? !1 : h, j = e.onMounted, F = j === void 0 ? void 0 : j, Y = e.onUpdated, G = Y === void 0 ? void 0 : Y, C = e.onLoad, _ = C === void 0 ? void 0 : C, O = e.props, W = O === void 0 ? {} : O, rt = function() {
  }, lt = function(bt) {
    var vt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var X = Ie(Ie({}, W), vt), q = X.name || f, dt = X.id || v, Ut = X.nonce || P;
      r.value = s.querySelector('style[data-primevue-style-id="'.concat(q, '"]')) || s.getElementById(dt) || s.createElement("style"), r.value.isConnected || (o.value = bt || t, Jt(r.value, {
        type: "text/css",
        id: dt,
        media: g,
        nonce: Ut
      }), y ? s.head.prepend(r.value) : s.head.appendChild(r.value), gr(r.value, "data-primevue-style-id", q), Jt(r.value, X), r.value.onload = function(gt) {
        return _?.(gt, {
          name: q
        });
      }, F?.(q)), !n.value && (rt = Pt(o, function(gt) {
        r.value.textContent = gt, G?.(q);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, mt = function() {
    !s || !n.value || (rt(), pr(r.value) && s.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && Lr(lt), {
    id: v,
    name: f,
    el: r,
    css: o,
    unload: mt,
    load: lt,
    isLoaded: so(n)
  };
}
function Nt(t) {
  "@babel/helpers - typeof";
  return Nt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Nt(t);
}
var Re, De, Me, Fe;
function Be(t, e) {
  return Fr(t) || Mr(t, e) || Dr(t, e) || Rr();
}
function Rr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Dr(t, e) {
  if (t) {
    if (typeof t == "string") return ze(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ze(t, e) : void 0;
  }
}
function ze(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Mr(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(t)).next, e !== 0) for (; !(i = (o = a.call(n)).done) && (s.push(o.value), s.length !== e); i = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function Fr(t) {
  if (Array.isArray(t)) return t;
}
function Ue(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function ae(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ue(Object(n), !0).forEach(function(o) {
      Br(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ue(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Br(t, e, n) {
  return (e = zr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function zr(t) {
  var e = Ur(t, "string");
  return Nt(e) == "symbol" ? e : e + "";
}
function Ur(t, e) {
  if (Nt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Nt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Gt(t, e) {
  return e || (e = t.slice(0)), Object.freeze(Object.defineProperties(t, { raw: { value: Object.freeze(e) } }));
}
var Wr = function(e) {
  var n = e.dt;
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
}, Hr = {}, Kr = {}, A = {
  name: "base",
  css: Wr,
  style: Ar,
  classes: Hr,
  inlineStyles: Kr,
  load: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, r = o(Yt(Re || (Re = Gt(["", ""])), e));
    return T(r) ? Ir(Tt(r), ae({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, e);
  },
  loadStyle: function() {
    var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return x.transformCSS(n.name || e.name, "".concat(r).concat(Yt(De || (De = Gt(["", ""])), o)));
    });
  },
  getCommonTheme: function(e) {
    return x.getCommon(this.name, e);
  },
  getComponentTheme: function(e) {
    return x.getComponent(this.name, e);
  },
  getDirectiveTheme: function(e) {
    return x.getDirective(this.name, e);
  },
  getPresetTheme: function(e, n, o) {
    return x.getCustomPreset(this.name, e, n, o);
  },
  getLayerOrderThemeCSS: function() {
    return x.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var o = U(this.css, {
        dt: ft
      }) || "", r = Tt(Yt(Me || (Me = Gt(["", "", ""])), o, e)), a = Object.entries(n).reduce(function(l, s) {
        var i = Be(s, 2), u = i[0], d = i[1];
        return l.push("".concat(u, '="').concat(d, '"')) && l;
      }, []).join(" ");
      return T(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return x.getCommonStyleSheet(this.name, e, n);
  },
  getThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = [x.getStyleSheet(this.name, e, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = Yt(Fe || (Fe = Gt(["", ""])), U(this.style, {
        dt: ft
      })), l = Tt(x.transformCSS(r, a)), s = Object.entries(n).reduce(function(i, u) {
        var d = Be(u, 2), c = d[0], p = d[1];
        return i.push("".concat(c, '="').concat(p, '"')) && i;
      }, []).join(" ");
      T(l) && o.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(s, ">").concat(l, "</style>"));
    }
    return o.join("");
  },
  extend: function(e) {
    return ae(ae({}, this), {}, {
      css: void 0,
      style: void 0
    }, e);
  }
}, at = _n();
function jt(t) {
  "@babel/helpers - typeof";
  return jt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, jt(t);
}
function We(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function qt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? We(Object(n), !0).forEach(function(o) {
      Yr(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : We(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Yr(t, e, n) {
  return (e = Gr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Gr(t) {
  var e = qr(t, "string");
  return jt(e) == "symbol" ? e : e + "";
}
function qr(t, e) {
  if (jt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (jt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Jr = {
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
    text: [R.STARTS_WITH, R.CONTAINS, R.NOT_CONTAINS, R.ENDS_WITH, R.EQUALS, R.NOT_EQUALS],
    numeric: [R.EQUALS, R.NOT_EQUALS, R.LESS_THAN, R.LESS_THAN_OR_EQUAL_TO, R.GREATER_THAN, R.GREATER_THAN_OR_EQUAL_TO],
    date: [R.DATE_IS, R.DATE_IS_NOT, R.DATE_BEFORE, R.DATE_AFTER]
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
}, Qr = /* @__PURE__ */ Symbol();
function Zr(t, e) {
  var n = {
    config: uo(e)
  };
  return t.config.globalProperties.$primevue = n, t.provide(Qr, n), Xr(), ti(t, n), n;
}
var St = [];
function Xr() {
  I.clear(), St.forEach(function(t) {
    return t?.();
  }), St = [];
}
function ti(t, e) {
  var n = L(!1), o = function() {
    var u;
    if (((u = e.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !x.isStyleNameLoaded("common")) {
      var d, c, p = ((d = A.getCommonTheme) === null || d === void 0 ? void 0 : d.call(A)) || {}, f = p.primitive, m = p.semantic, v = p.global, b = p.style, g = {
        nonce: (c = e.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      A.load(f?.css, qt({
        name: "primitive-variables"
      }, g)), A.load(m?.css, qt({
        name: "semantic-variables"
      }, g)), A.load(v?.css, qt({
        name: "global-variables"
      }, g)), A.loadStyle(qt({
        name: "global-style"
      }, g), b), x.setLoadedStyleName("common");
    }
  };
  I.on("theme:change", function(i) {
    n.value || (t.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var r = Pt(e.config, function(i, u) {
    at.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = Pt(function() {
    return e.config.ripple;
  }, function(i, u) {
    at.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = Pt(function() {
    return e.config.theme;
  }, function(i, u) {
    n.value || x.setTheme(i), e.config.unstyled || o(), n.value = !1, at.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = Pt(function() {
    return e.config.unstyled;
  }, function(i, u) {
    !i && e.config.theme && o(), at.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  St.push(r), St.push(a), St.push(l), St.push(s);
}
var ei = {
  install: function(e, n) {
    var o = ar(Jr, n);
    Zr(e, o);
  }
}, Tn = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = Sn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function ni(t, e, n, o, r, a) {
  return a.inline ? ot(t.$slots, "default", {
    key: 0
  }) : r.mounted ? (V(), Ct(un, {
    key: 1,
    to: n.appendTo
  }, [ot(t.$slots, "default")], 8, ["to"])) : st("", !0);
}
Tn.render = ni;
var it = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(e) {
    return this._loadedStyleNames.has(e);
  },
  setLoadedStyleName: function(e) {
    this._loadedStyleNames.add(e);
  },
  deleteLoadedStyleName: function(e) {
    this._loadedStyleNames.delete(e);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function oi() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", e = co();
  return "".concat(t).concat(e.replace("v-", "").replaceAll("-", "_"));
}
var He = A.extend({
  name: "common"
});
function Lt(t) {
  "@babel/helpers - typeof";
  return Lt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Lt(t);
}
function ri(t) {
  return Nn(t) || ii(t) || En(t) || An();
}
function ii(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function kt(t, e) {
  return Nn(t) || ai(t, e) || En(t, e) || An();
}
function An() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function En(t, e) {
  if (t) {
    if (typeof t == "string") return ue(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ue(t, e) : void 0;
  }
}
function ue(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function ai(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(t)).next, e === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (o = a.call(n)).done) && (s.push(o.value), s.length !== e); i = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function Nn(t) {
  if (Array.isArray(t)) return t;
}
function Ke(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function w(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ke(Object(n), !0).forEach(function(o) {
      xt(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ke(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function xt(t, e, n) {
  return (e = si(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function si(t) {
  var e = li(t, "string");
  return Lt(e) == "symbol" ? e : e + "";
}
function li(t, e) {
  if (Lt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Lt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var te = {
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
      handler: function(e) {
        I.off("theme:change", this._loadCoreStyles), e || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(e, n) {
        var o = this;
        I.off("theme:change", this._themeScopedListener), e ? (this._loadScopedThemeStyles(e), this._themeScopedListener = function() {
          return o._loadScopedThemeStyles(e);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var e, n, o, r, a, l, s, i, u, d, c, p = (e = this.pt) === null || e === void 0 ? void 0 : e._usept, f = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, m = p ? (o = this.pt) === null || o === void 0 || (o = o.value) === null || o === void 0 ? void 0 : o[this.$.type.name] : this.pt;
    (r = m || f) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (a = r.onBeforeCreate) === null || a === void 0 || a.call(r);
    var v = (l = this.$primevueConfig) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l._usept, b = v ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, g = v ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = g || b) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = oi(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var e;
    this.rootEl = hr(zt(this.$el) ? this.$el : (e = this.$el) === null || e === void 0 ? void 0 : e.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = w({
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
    _hook: function(e) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(e)), o = this._useDefaultPT(this._getOptionValue, "hooks.".concat(e));
        n?.(), o?.();
      }
    },
    _mergeProps: function(e) {
      for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return me(e) ? e.apply(void 0, o) : D.apply(void 0, o);
    },
    _load: function() {
      it.isStyleNameLoaded("base") || (A.loadCSS(this.$styleOptions), this._loadGlobalStyles(), it.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var e, n;
      !it.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name && (He.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), it.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var e = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      T(e) && A.load(e, w({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var e, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!x.isStyleNameLoaded("common")) {
          var o, r, a = ((o = this.$style) === null || o === void 0 || (r = o.getCommonTheme) === null || r === void 0 ? void 0 : r.call(o)) || {}, l = a.primitive, s = a.semantic, i = a.global, u = a.style;
          A.load(l?.css, w({
            name: "primitive-variables"
          }, this.$styleOptions)), A.load(s?.css, w({
            name: "semantic-variables"
          }, this.$styleOptions)), A.load(i?.css, w({
            name: "global-variables"
          }, this.$styleOptions)), A.loadStyle(w({
            name: "global-style"
          }, this.$styleOptions), u), x.setLoadedStyleName("common");
        }
        if (!x.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, p, f, m = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, v = m.css, b = m.style;
          (p = this.$style) === null || p === void 0 || p.load(v, w({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (f = this.$style) === null || f === void 0 || f.loadStyle(w({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), b), x.setLoadedStyleName(this.$style.name);
        }
        if (!x.isStyleNameLoaded("layer-order")) {
          var g, $, P = (g = this.$style) === null || g === void 0 || ($ = g.getLayerOrderThemeCSS) === null || $ === void 0 ? void 0 : $.call(g);
          A.load(P, w({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), x.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(e) {
      var n, o, r, a = ((n = this.$style) === null || n === void 0 || (o = n.getPresetTheme) === null || o === void 0 ? void 0 : o.call(n, e, "[".concat(this.$attrSelector, "]"))) || {}, l = a.css, s = (r = this.$style) === null || r === void 0 ? void 0 : r.load(l, w({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = s.el;
    },
    _unloadScopedThemeStyles: function() {
      var e;
      (e = this.scopedStyleEl) === null || e === void 0 || (e = e.value) === null || e === void 0 || e.remove();
    },
    _themeChangeListener: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      it.clearLoadedStyleNames(), I.on("theme:change", e);
    },
    _removeThemeListeners: function() {
      I.off("theme:change", this._loadCoreStyles), I.off("theme:change", this._load), I.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(e) {
      return e ? this.$options.hostName ? e.$.type.name === this.$options.hostName ? e : this._getHostInstance(e.$parentInstance) : e.$parentInstance : void 0;
    },
    _getPropValue: function(e) {
      var n;
      return this[e] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[e]);
    },
    _getOptionValue: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return be(e, n, o);
    },
    _getPTValue: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, l = /./g.test(o) && !!r[o.split(".")[0]], s = this._getPropValue("ptOptions") || ((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, d = s.mergeProps, c = d === void 0 ? !1 : d, p = a ? l ? this._useGlobalPT(this._getPTClassValue, o, r) : this._useDefaultPT(this._getPTClassValue, o, r) : void 0, f = l ? void 0 : this._getPTSelf(n, this._getPTClassValue, o, w(w({}, r), {}, {
        global: p || {}
      })), m = this._getPTDatasets(o);
      return u || !u && f ? c ? this._mergeProps(c, p, f, m) : w(w(w({}, p), f), m) : w(w({}, f), m);
    },
    _getPTSelf: function() {
      for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return D(
        this._usePT.apply(this, [this._getPT(e, this.$name)].concat(o)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(o))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", a = o === "root" && T((e = this.pt) === null || e === void 0 ? void 0 : e["data-pc-section"]);
      return o !== "transition" && w(w({}, o === "root" && w(w(xt({}, "".concat(r, "name"), Q(a ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), a && xt({}, "".concat(r, "extend"), Q(this.$.type.name))), {}, xt({}, "".concat(this.$attrSelector), ""))), {}, xt({}, "".concat(r, "section"), Q(o)));
    },
    _getPTClassValue: function() {
      var e = this._getOptionValue.apply(this, arguments);
      return z(e) || gn(e) ? {
        class: e
      } : e;
    },
    _getPT: function(e) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, a = function(s) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(s) : s, c = Q(o), p = Q(n.$name);
        return (i = u ? c !== p ? d?.[c] : void 0 : d?.[c]) !== null && i !== void 0 ? i : d;
      };
      return e != null && e.hasOwnProperty("_usept") ? {
        _usept: e._usept,
        originalValue: a(e.originalValue),
        value: a(e.value)
      } : a(e, !0);
    },
    _usePT: function(e, n, o, r) {
      var a = function(v) {
        return n(v, o, r);
      };
      if (e != null && e.hasOwnProperty("_usept")) {
        var l, s = e._usept || ((l = this.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, d = s.mergeProps, c = d === void 0 ? !1 : d, p = a(e.originalValue), f = a(e.value);
        return p === void 0 && f === void 0 ? void 0 : z(f) ? f : z(p) ? p : u || !u && f ? c ? this._mergeProps(c, p, f) : w(w({}, p), f) : f;
      }
      return a(e);
    },
    _useGlobalPT: function(e, n, o) {
      return this._usePT(this.globalPT, e, n, o);
    },
    _useDefaultPT: function(e, n, o) {
      return this._usePT(this.defaultPT, e, n, o);
    },
    ptm: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, e, w(w({}, this.$params), n));
    },
    ptmi: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = D(this.$_attrsWithoutPT, this.ptm(n, o));
      return r?.hasOwnProperty("id") && ((e = r.id) !== null && e !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(e, n, w({
        instance: this
      }, o), !1);
    },
    cx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, e, w(w({}, this.$params), n));
    },
    sx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, e, w(w({}, this.$params), o)), a = this._getOptionValue(He.inlineStyles, e, w(w({}, this.$params), o));
        return [a, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return U(o, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return n._getOptionValue(o, n.$name, w({}, n.$params)) || U(o, w({}, n.$params));
      });
    },
    isUnstyled: function() {
      var e;
      return this.unstyled !== void 0 ? this.unstyled : (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var e, n = Object.keys(((e = this.$.vnode) === null || e === void 0 ? void 0 : e.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(o) {
        var r = kt(o, 1), a = r[0];
        return n?.includes(a);
      }));
    },
    $theme: function() {
      var e;
      return (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.theme;
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
      var e;
      return {
        nonce: (e = this.$primevueConfig) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce
      };
    },
    $primevueConfig: function() {
      var e;
      return (e = this.$primevue) === null || e === void 0 ? void 0 : e.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var e = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: e,
          props: e?.$props,
          state: e?.$data,
          attrs: e?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = kt(e, 1), o = n[0];
        return o?.startsWith("pt:");
      }).reduce(function(e, n) {
        var o = kt(n, 2), r = o[0], a = o[1], l = r.split(":"), s = ri(l), i = ue(s).slice(1);
        return i?.reduce(function(u, d, c, p) {
          return !u[d] && (u[d] = c === p.length - 1 ? a : {}), u[d];
        }, e), e;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = kt(e, 1), o = n[0];
        return !(o != null && o.startsWith("pt:"));
      }).reduce(function(e, n) {
        var o = kt(n, 2), r = o[0], a = o[1];
        return e[r] = a, e;
      }, {});
    }
  }
}, ui = `
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
`, di = A.extend({
  name: "baseicon",
  css: ui
});
function Vt(t) {
  "@babel/helpers - typeof";
  return Vt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Vt(t);
}
function Ye(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ge(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ye(Object(n), !0).forEach(function(o) {
      ci(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ye(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function ci(t, e, n) {
  return (e = pi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function pi(t) {
  var e = fi(t, "string");
  return Vt(e) == "symbol" ? e : e + "";
}
function fi(t, e) {
  if (Vt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Vt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var hi = {
  name: "BaseIcon",
  extends: te,
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
  style: di,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var e = ht(this.label);
      return Ge(Ge({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: e ? void 0 : "img",
        "aria-label": e ? void 0 : this.label,
        "aria-hidden": e
      });
    }
  }
};
function It(t) {
  "@babel/helpers - typeof";
  return It = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, It(t);
}
function qe(t, e) {
  return gi(t) || vi(t, e) || bi(t, e) || mi();
}
function mi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function bi(t, e) {
  if (t) {
    if (typeof t == "string") return Je(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Je(t, e) : void 0;
  }
}
function Je(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function vi(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(t)).next, e !== 0) for (; !(i = (o = a.call(n)).done) && (s.push(o.value), s.length !== e); i = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw r;
      }
    }
    return s;
  }
}
function gi(t) {
  if (Array.isArray(t)) return t;
}
function Qe(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function k(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Qe(Object(n), !0).forEach(function(o) {
      de(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Qe(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function de(t, e, n) {
  return (e = yi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function yi(t) {
  var e = _i(t, "string");
  return It(e) == "symbol" ? e : e + "";
}
function _i(t, e) {
  if (It(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (It(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var S = {
  _getMeta: function() {
    return [Z(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], U(Z(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(e, n) {
    var o, r, a;
    return (o = (e == null || (r = e.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (a = n.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || o === void 0 ? void 0 : o.config;
  },
  _getOptionValue: be,
  _getPTValue: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var $ = S._getOptionValue.apply(S, arguments);
      return z($) || gn($) ? {
        class: $
      } : $;
    }, u = ((e = o.binding) === null || e === void 0 || (e = e.value) === null || e === void 0 ? void 0 : e.ptOptions) || ((n = o.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, p = u.mergeProps, f = p === void 0 ? !1 : p, m = s ? S._useDefaultPT(o, o.defaultPT(), i, a, l) : void 0, v = S._usePT(o, S._getPT(r, o.$name), i, a, k(k({}, l), {}, {
      global: m || {}
    })), b = S._getPTDatasets(o, a);
    return c || !c && v ? f ? S._mergeProps(o, f, m, v, b) : k(k(k({}, m), v), b) : k(k({}, v), b);
  },
  _getPTDatasets: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = "data-pc-";
    return k(k({}, n === "root" && de({}, "".concat(o, "name"), Q(e.$name))), {}, de({}, "".concat(o, "section"), Q(n)));
  },
  _getPT: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(l) {
      var s, i = o ? o(l) : l, u = Q(n);
      return (s = i?.[u]) !== null && s !== void 0 ? s : i;
    };
    return e && Object.hasOwn(e, "_usept") ? {
      _usept: e._usept,
      originalValue: r(e.originalValue),
      value: r(e.value)
    } : r(e);
  },
  _usePT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0, l = function(b) {
      return o(b, r, a);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, i = n._usept || ((s = e.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, u = i.mergeSections, d = u === void 0 ? !0 : u, c = i.mergeProps, p = c === void 0 ? !1 : c, f = l(n.originalValue), m = l(n.value);
      return f === void 0 && m === void 0 ? void 0 : z(m) ? m : z(f) ? f : d || !d && m ? p ? S._mergeProps(e, p, f, m) : k(k({}, f), m) : m;
    }
    return l(n);
  },
  _useDefaultPT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return S._usePT(e, n, o, r, a);
  },
  _loadStyles: function() {
    var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, a = S._getConfig(o, r), l = {
      nonce: a == null || (e = a.csp) === null || e === void 0 ? void 0 : e.nonce
    };
    S._loadCoreStyles(n, l), S._loadThemeStyles(n, l), S._loadScopedThemeStyles(n, l), S._removeThemeListeners(n), n.$loadStyles = function() {
      return S._loadThemeStyles(n, l);
    }, S._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!it.isStyleNameLoaded((e = o.$style) === null || e === void 0 ? void 0 : e.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
      var a;
      A.loadCSS(r), (a = o.$style) === null || a === void 0 || a.loadCSS(r), it.setLoadedStyleName(o.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var e, n, o, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (e = r.theme) === null || e === void 0 ? void 0 : e.call(r)) === "none")) {
      if (!x.isStyleNameLoaded("common")) {
        var l, s, i = ((l = r.$style) === null || l === void 0 || (s = l.getCommonTheme) === null || s === void 0 ? void 0 : s.call(l)) || {}, u = i.primitive, d = i.semantic, c = i.global, p = i.style;
        A.load(u?.css, k({
          name: "primitive-variables"
        }, a)), A.load(d?.css, k({
          name: "semantic-variables"
        }, a)), A.load(c?.css, k({
          name: "global-variables"
        }, a)), A.loadStyle(k({
          name: "global-style"
        }, a), p), x.setLoadedStyleName("common");
      }
      if (!x.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (o = r.$style) !== null && o !== void 0 && o.name) {
        var f, m, v, b, g = ((f = r.$style) === null || f === void 0 || (m = f.getDirectiveTheme) === null || m === void 0 ? void 0 : m.call(f)) || {}, $ = g.css, P = g.style;
        (v = r.$style) === null || v === void 0 || v.load($, k({
          name: "".concat(r.$style.name, "-variables")
        }, a)), (b = r.$style) === null || b === void 0 || b.loadStyle(k({
          name: "".concat(r.$style.name, "-style")
        }, a), P), x.setLoadedStyleName(r.$style.name);
      }
      if (!x.isStyleNameLoaded("layer-order")) {
        var h, y, j = (h = r.$style) === null || h === void 0 || (y = h.getLayerOrderThemeCSS) === null || y === void 0 ? void 0 : y.call(h);
        A.load(j, k({
          name: "layer-order",
          first: !0
        }, a)), x.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = e.preset();
    if (o && e.$attrSelector) {
      var r, a, l, s = ((r = e.$style) === null || r === void 0 || (a = r.getPresetTheme) === null || a === void 0 ? void 0 : a.call(r, o, "[".concat(e.$attrSelector, "]"))) || {}, i = s.css, u = (l = e.$style) === null || l === void 0 ? void 0 : l.load(i, k({
        name: "".concat(e.$attrSelector, "-").concat(e.$style.name)
      }, n));
      e.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    it.clearLoadedStyleNames(), I.on("theme:change", e);
  },
  _removeThemeListeners: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    I.off("theme:change", e.$loadStyles), e.$loadStyles = void 0;
  },
  _hook: function(e, n, o, r, a, l) {
    var s, i, u = "on".concat(sr(n)), d = S._getConfig(r, a), c = o?.$instance, p = S._usePT(c, S._getPT(r == null || (s = r.value) === null || s === void 0 ? void 0 : s.pt, e), S._getOptionValue, "hooks.".concat(u)), f = S._useDefaultPT(c, d == null || (i = d.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[e], S._getOptionValue, "hooks.".concat(u)), m = {
      el: o,
      binding: r,
      vnode: a,
      prevVnode: l
    };
    p?.(c, m), f?.(c, m);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      o[r - 2] = arguments[r];
    return me(e) ? e.apply(void 0, o) : D.apply(void 0, o);
  },
  _extend: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = function(s, i, u, d, c) {
      var p, f, m, v;
      i._$instances = i._$instances || {};
      var b = S._getConfig(u, d), g = i._$instances[e] || {}, $ = ht(g) ? k(k({}, n), n?.methods) : {};
      i._$instances[e] = k(k({}, g), {}, {
        /* new instance variables to pass in directive methods */
        $name: e,
        $host: i,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: g.$el || i || void 0,
        $style: k({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: b,
        $attrSelector: (p = i.$pd) === null || p === void 0 || (p = p[e]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return S._getPT(b?.pt, void 0, function(h) {
            var y;
            return h == null || (y = h.directives) === null || y === void 0 ? void 0 : y[e];
          });
        },
        isUnstyled: function() {
          var h, y;
          return ((h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (y = i._$instances[e]) === null || y === void 0 || (y = y.$binding) === null || y === void 0 || (y = y.value) === null || y === void 0 ? void 0 : y.unstyled : b?.unstyled;
        },
        theme: function() {
          var h;
          return (h = i._$instances[e]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return S._getPTValue(i._$instances[e], (h = i._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, y, k({}, j));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", j = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return S._getPTValue(i._$instances[e], h, y, j, !1);
        },
        cx: function() {
          var h, y, j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = i._$instances[e]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : S._getOptionValue((y = i._$instances[e]) === null || y === void 0 || (y = y.$style) === null || y === void 0 ? void 0 : y.classes, j, k({}, F));
        },
        sx: function() {
          var h, y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return j ? S._getOptionValue((h = i._$instances[e]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, y, k({}, F)) : void 0;
        }
      }, $), i.$instance = i._$instances[e], (f = (m = i.$instance)[s]) === null || f === void 0 || f.call(m, i, u, d, c), i["$".concat(e)] = i.$instance, S._hook(e, s, i, u, d, c), i.$pd || (i.$pd = {}), i.$pd[e] = k(k({}, (v = i.$pd) === null || v === void 0 ? void 0 : v[e]), {}, {
        name: e,
        instance: i._$instances[e]
      });
    }, r = function(s) {
      var i, u, d, c = s._$instances[e], p = c?.watch, f = function(b) {
        var g, $ = b.newValue, P = b.oldValue;
        return p == null || (g = p.config) === null || g === void 0 ? void 0 : g.call(c, $, P);
      }, m = function(b) {
        var g, $ = b.newValue, P = b.oldValue;
        return p == null || (g = p["config.ripple"]) === null || g === void 0 ? void 0 : g.call(c, $, P);
      };
      c.$watchersCallback = {
        config: f,
        "config.ripple": m
      }, p == null || (i = p.config) === null || i === void 0 || i.call(c, c?.$primevueConfig), at.on("config:change", f), p == null || (u = p["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), at.on("config:ripple:change", m);
    }, a = function(s) {
      var i = s._$instances[e].$watchersCallback;
      i && (at.off("config:change", i.config), at.off("config:ripple:change", i["config.ripple"]), s._$instances[e].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, u, d) {
        s.$pd || (s.$pd = {}), s.$pd[e] = {
          name: e,
          attrSelector: yr("pd")
        }, o("created", s, i, u, d);
      },
      beforeMount: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("beforeMount", s, i, u, d), r(s);
      },
      mounted: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("mounted", s, i, u, d);
      },
      beforeUpdate: function(s, i, u, d) {
        o("beforeUpdate", s, i, u, d);
      },
      updated: function(s, i, u, d) {
        var c;
        S._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("updated", s, i, u, d);
      },
      beforeUnmount: function(s, i, u, d) {
        var c;
        a(s), S._removeThemeListeners((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance), o("beforeUnmount", s, i, u, d);
      },
      unmounted: function(s, i, u, d) {
        var c;
        (c = s.$pd[e]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), o("unmounted", s, i, u, d);
      }
    };
  },
  extend: function() {
    var e = S._getMeta.apply(S, arguments), n = qe(e, 2), o = n[0], r = n[1];
    return k({
      extend: function() {
        var l = S._getMeta.apply(S, arguments), s = qe(l, 2), i = s[0], u = s[1];
        return S.extend(i, k(k(k({}, r), r?.methods), u));
      }
    }, S._extend(o, r));
  }
}, Si = `
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
`, $i = {
  root: "p-ink"
}, wi = A.extend({
  name: "ripple-directive",
  style: Si,
  classes: $i
}), ki = S.extend({
  style: wi
});
function Rt(t) {
  "@babel/helpers - typeof";
  return Rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Rt(t);
}
function Pi(t) {
  return Ti(t) || Oi(t) || Ci(t) || xi();
}
function xi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ci(t, e) {
  if (t) {
    if (typeof t == "string") return ce(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ce(t, e) : void 0;
  }
}
function Oi(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ti(t) {
  if (Array.isArray(t)) return ce(t);
}
function ce(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Ze(t, e, n) {
  return (e = Ai(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ai(t) {
  var e = Ei(t, "string");
  return Rt(e) == "symbol" ? e : e + "";
}
function Ei(t, e) {
  if (Rt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Rt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Ni = ki.extend("ripple", {
  watch: {
    "config.ripple": function(e) {
      e ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(e) {
    this.remove(e);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(e) {
      e.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(e) {
      e.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(e) {
      var n = this.getInk(e);
      n || (n = fr("span", Ze(Ze({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), e.appendChild(n), this.$el = n);
    },
    remove: function(e) {
      var n = this.getInk(e);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(e), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(e) {
      var n = this, o = e.currentTarget, r = this.getInk(o);
      if (!(!r || getComputedStyle(r, null).display === "none")) {
        if (!this.isUnstyled() && re(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Ee(r) && !Ne(r)) {
          var a = Math.max(dr(o), vr(o));
          r.style.height = a + "px", r.style.width = a + "px";
        }
        var l = br(o), s = e.pageX - l.left + document.body.scrollTop - Ne(r) / 2, i = e.pageY - l.top + document.body.scrollLeft - Ee(r) / 2;
        r.style.top = i + "px", r.style.left = s + "px", !this.isUnstyled() && ur(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && re(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(e) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && re(e.currentTarget, "p-ink-active"), e.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(e) {
      return e && e.children ? Pi(e.children).find(function(n) {
        return mr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const ji = "data-wippy-overlay-layer";
function jn() {
  return typeof window < "u" && typeof window.document < "u";
}
function Ln() {
  return jn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function Li() {
  return Ln() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Vi = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ii = 0;
const Zt = /* @__PURE__ */ new WeakMap();
function Xe(t, e) {
  const n = t.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", e), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ri(t, e) {
  if (!Vi.test(t.className))
    return;
  const n = t.style.cssText;
  Xe(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = n;
    return;
  }
  if (!Zt.has(t)) {
    const o = new MutationObserver(() => {
      const r = t.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && Xe(t, e);
    });
    o.observe(t, { attributes: !0, attributeFilter: ["style"] }), Zt.set(t, o);
  }
}
function ve(t) {
  const e = Zt.get(t);
  e && (e.disconnect(), Zt.delete(t));
}
function Di(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function pe(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const Xt = /* @__PURE__ */ new Set(), ge = /* @__PURE__ */ new WeakMap();
let tn = !1, fe = !1;
function Mi() {
  fe = !1;
  for (const t of Xt) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && ve(e);
      Xt.delete(t), ge.get(t)?.disconnect();
      continue;
    }
    t.childElementCount > 0 && pe(t);
  }
}
function en() {
  fe || (fe = !0, requestAnimationFrame(Mi));
}
function Fi(t) {
  const e = document.createElement("div");
  e.setAttribute(ji, "");
  const n = Ln();
  if (e.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && e.setAttribute("popover", "manual"), t.appendChild(e), n) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  pe(e);
  const o = new MutationObserver((r) => {
    const a = e.__wippyAnchorName;
    for (const l of r) {
      if (a)
        for (const s of Array.from(l.addedNodes))
          s instanceof HTMLElement && Ri(s, a);
      for (const s of Array.from(l.removedNodes))
        s instanceof HTMLElement && ve(s);
    }
    e.isConnected && e.childElementCount > 0 && pe(e);
  });
  return o.observe(e, { childList: !0 }), ge.set(e, o), Xt.add(e), tn || (tn = !0, window.addEventListener("scroll", en, { capture: !0, passive: !0 }), window.addEventListener("resize", en, { passive: !0 })), e;
}
function nn(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = Fi(t.hostRoot), Li())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++Ii}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function on(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && ve(e);
    Xt.delete(t.layer), ge.get(t.layer)?.disconnect(), t.layer.remove(), t.layer = null;
  }
}
let rn = !1;
function Bi() {
  if (rn)
    return;
  rn = !0;
  const t = Tn;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    jn() && (this.hostRoot = Di(this.$el), this.mounted = !0, this.hostRoot && (this.inline || nn(this), this.$watch("inline", (e) => {
      e ? on(this) : nn(this);
    })));
  }, t.render = function() {
    return this.inline ? ot(this.$slots, "default", { key: 0 }) : this.mounted ? po(un, { key: 1, to: this.resolvedTarget || document.body }, [
      ot(this.$slots, "default")
    ]) : st("", !0);
  }, t.unmounted = function() {
    on(this);
  };
}
const zi = {
  install: (t) => {
    Bi(), t.use(ei, { theme: "none" });
  }
};
var Vn = {
  name: "SpinnerIcon",
  extends: hi
};
function Ui(t) {
  return Yi(t) || Ki(t) || Hi(t) || Wi();
}
function Wi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Hi(t, e) {
  if (t) {
    if (typeof t == "string") return he(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? he(t, e) : void 0;
  }
}
function Ki(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Yi(t) {
  if (Array.isArray(t)) return he(t);
}
function he(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Gi(t, e, n, o, r, a) {
  return V(), M("svg", D({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Ui(e[0] || (e[0] = [N("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Vn.render = Gi;
var qi = `
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
`, Ji = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": T(n.value) && String(n.value).length === 1,
      "p-badge-dot": ht(n.value) && !o.$slots.default,
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
}, Qi = A.extend({
  name: "badge",
  style: qi,
  classes: Ji
}), Zi = {
  name: "BaseBadge",
  extends: te,
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
  style: Qi,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Dt(t) {
  "@babel/helpers - typeof";
  return Dt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Dt(t);
}
function an(t, e, n) {
  return (e = Xi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Xi(t) {
  var e = ta(t, "string");
  return Dt(e) == "symbol" ? e : e + "";
}
function ta(t, e) {
  if (Dt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Dt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var In = {
  name: "Badge",
  extends: Zi,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return $t(an(an({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, ea = ["data-p"];
function na(t, e, n, o, r, a) {
  return V(), M("span", D({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [ot(t.$slots, "default", {}, function() {
    return [fo(Ot(t.value), 1)];
  })], 16, ea);
}
In.render = na;
var oa = `
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
function Mt(t) {
  "@babel/helpers - typeof";
  return Mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Mt(t);
}
function J(t, e, n) {
  return (e = ra(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ra(t) {
  var e = ia(t, "string");
  return Mt(e) == "symbol" ? e : e + "";
}
function ia(t, e) {
  if (Mt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var aa = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", J(J(J(J(J(J(J(J(J({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", J({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, sa = A.extend({
  name: "button",
  style: oa,
  classes: aa
}), la = {
  name: "BaseButton",
  extends: te,
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
  style: sa,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Ft(t) {
  "@babel/helpers - typeof";
  return Ft = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ft(t);
}
function B(t, e, n) {
  return (e = ua(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ua(t) {
  var e = da(t, "string");
  return Ft(e) == "symbol" ? e : e + "";
}
function da(t, e) {
  if (Ft(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ft(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ct = {
  name: "Button",
  extends: la,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(e) {
      var n = e === "root" ? this.ptmi : this.ptm;
      return n(e, {
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
      return D(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return ht(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return $t(B(B(B(B(B(B(B(B(B(B({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return $t(B(B({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return $t(B(B({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Vn,
    Badge: In
  },
  directives: {
    ripple: Ni
  }
}, ca = ["data-p"], pa = ["data-p"];
function fa(t, e, n, o, r, a) {
  var l = $e("SpinnerIcon"), s = $e("Badge"), i = ho("ripple");
  return t.asChild ? ot(t.$slots, "default", {
    key: 1,
    class: we(t.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : mo((V(), Ct(dn(t.as), D({
    key: 0,
    class: t.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: bo(function() {
      return [ot(t.$slots, "default", {}, function() {
        return [t.loading ? ot(t.$slots, "loadingicon", D({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (V(), M("span", D({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (V(), Ct(l, D({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : ot(t.$slots, "icon", D({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (V(), M("span", D({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": a.dataIconP
          }, t.ptm("icon")), null, 16, ca)) : st("", !0)];
        }), t.label ? (V(), M("span", D({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": a.dataLabelP
        }), Ot(t.label), 17, pa)) : st("", !0), t.badge ? (V(), Ct(s, {
          key: 3,
          value: t.badge,
          class: we(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : st("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[i]]);
}
ct.render = fa;
var ha = {
  name: "BaseEditableHolder",
  extends: te,
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
      handler: function(e) {
        this.d_value = e;
      }
    },
    defaultValue: function(e) {
      this.d_value = e;
    },
    $formName: {
      immediate: !0,
      handler: function(e) {
        var n, o;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (o = n.register) === null || o === void 0 ? void 0 : o.call(n, e, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(e) {
        var n, o;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (o = n.register) === null || o === void 0 ? void 0 : o.call(n, this.$formName, e)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(e) {
        this.d_value !== e && (this.d_value = e);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(e) {
        var n;
        (n = this.$pcForm) !== null && n !== void 0 && n.getFieldState(this.$formName) && e !== this.d_value && (this.d_value = e);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(e, n) {
      var o, r;
      this.controlled && (this.d_value = e, this.$emit("update:modelValue", e)), this.$emit("value-change", e), (o = (r = this.formField).onChange) === null || o === void 0 || o.call(r, {
        originalEvent: n,
        value: e
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++)
        n[o] = arguments[o];
      return n.find(T);
    }
  },
  computed: {
    $filled: function() {
      return T(this.d_value);
    },
    $invalid: function() {
      var e, n;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (e = this.$pcFormField) === null || e === void 0 || (e = e.$field) === null || e === void 0 ? void 0 : e.invalid, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.invalid);
    },
    $formName: function() {
      var e;
      return this.$formNovalidate ? void 0 : this.name || ((e = this.$formControl) === null || e === void 0 ? void 0 : e.name);
    },
    $formControl: function() {
      var e;
      return this.formControl || ((e = this.$pcFormField) === null || e === void 0 ? void 0 : e.formControl);
    },
    $formNovalidate: function() {
      var e;
      return (e = this.$formControl) === null || e === void 0 ? void 0 : e.novalidate;
    },
    $formDefaultValue: function() {
      var e, n;
      return this.findNonEmpty(this.d_value, (e = this.$pcFormField) === null || e === void 0 ? void 0 : e.initialValue, (n = this.$pcForm) === null || n === void 0 || (n = n.initialValues) === null || n === void 0 ? void 0 : n[this.$formName]);
    },
    $formValue: function() {
      var e, n;
      return this.findNonEmpty((e = this.$pcFormField) === null || e === void 0 || (e = e.$field) === null || e === void 0 ? void 0 : e.value, (n = this.$pcForm) === null || n === void 0 || (n = n.getFieldState(this.$formName)) === null || n === void 0 ? void 0 : n.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
}, ma = {
  name: "BaseInput",
  extends: ha,
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
      var e;
      return (e = this.variant) !== null && e !== void 0 ? e : this.$primevue.config.inputStyle || this.$primevue.config.inputVariant;
    },
    $fluid: function() {
      var e;
      return (e = this.fluid) !== null && e !== void 0 ? e : !!this.$pcFluid;
    },
    // @deprecated use $fluid instead
    hasFluid: function() {
      return this.$fluid;
    }
  }
}, ba = `
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
`, va = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": o.size === "small",
      "p-inputtext-lg p-inputfield-lg": o.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, ga = A.extend({
  name: "inputtext",
  style: ba,
  classes: va
}), ya = {
  name: "BaseInputText",
  extends: ma,
  style: ga,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Bt(t) {
  "@babel/helpers - typeof";
  return Bt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Bt(t);
}
function _a(t, e, n) {
  return (e = Sa(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Sa(t) {
  var e = $a(t, "string");
  return Bt(e) == "symbol" ? e : e + "";
}
function $a(t, e) {
  if (Bt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Bt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Rn = {
  name: "InputText",
  extends: ya,
  inheritAttrs: !1,
  methods: {
    onInput: function(e) {
      this.writeValue(e.target.value, e);
    }
  },
  computed: {
    attrs: function() {
      return D(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return $t(_a({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, wa = ["value", "name", "disabled", "aria-invalid", "data-p"];
function ka(t, e, n, o, r, a) {
  return V(), M("input", D({
    type: "text",
    class: t.cx("root"),
    value: t.d_value,
    name: t.name,
    disabled: t.disabled,
    "aria-invalid": t.$invalid || void 0,
    "data-p": a.dataP,
    onInput: e[0] || (e[0] = function() {
      return a.onInput && a.onInput.apply(a, arguments);
    })
  }, a.attrs), null, 16, wa);
}
Rn.render = ka;
const Pa = { class: "onboarding" }, xa = {
  key: 0,
  class: "status",
  role: "status"
}, Ca = {
  key: 1,
  class: "stack"
}, Oa = {
  class: "error",
  role: "alert"
}, Ta = { class: "actions" }, Aa = {
  key: 2,
  class: "model-setup",
  "aria-labelledby": "model-setup-title"
}, Ea = { class: "head" }, Na = {
  class: "head-icon",
  "aria-hidden": "true"
}, ja = {
  key: 0,
  class: "error",
  role: "alert"
}, La = { class: "actions" }, Va = {
  key: 3,
  class: "stack",
  "aria-labelledby": "model-config-title"
}, Ia = { class: "head" }, Ra = {
  class: "head-icon",
  "aria-hidden": "true"
}, Da = ["disabled"], Ma = { class: "field-row" }, Fa = { class: "field" }, Ba = { class: "field" }, za = ["value"], Ua = {
  key: 0,
  class: "hint"
}, Wa = ["value"], Ha = {
  key: 0,
  class: "error",
  role: "alert"
}, Ka = { class: "actions" }, Ya = "My Assistant", Ga = /* @__PURE__ */ vo({
  __name: "Onboarding",
  setup(t) {
    const e = Zo(), n = ["kickside.agents.traits:trait_master", "kickside.agents.traits:artifacts", "kickside.uploads.traits:file_manager"], o = L(Ya), r = L(""), a = L({ traits: [...n], trait_contexts: { "kickside.agents.traits:trait_master": { inject_trait_catalog: !0 } } }), l = L(!0), s = L(!1), i = L(!1), u = L(""), d = L(""), c = L([]), p = L([]), f = wt(() => p.value.includes("class:fast")), m = wt(() => c.value.length > 0), v = L(!1), b = wt(() => r.value ? c.value.includes(r.value) || p.value.includes(r.value) : f.value), g = wt(() => s.value && !l.value && !i.value && !!o.value.trim() && b.value), $ = wt(() => l.value ? "loading" : s.value ? v.value ? "configuring" : m.value ? "create" : "model-setup" : "failed");
    function P(C) {
      const _ = C;
      return _?.response?.data?.error || _?.message || String(C);
    }
    function h(C) {
      const _ = C.detail;
      a.value = { traits: [..._.traits], trait_contexts: { ..._.trait_contexts } };
    }
    function y() {
      e("done", { status: "skipped" });
    }
    async function j() {
      l.value = !0, s.value = !1, u.value = "";
      try {
        await Promise.all([
          ne("wc-model-picker", { timeoutMs: 8e3 }),
          ne("wc-agent-trait-picker", { timeoutMs: 8e3 })
        ]);
        const [C, _] = await Promise.all([
          Ht.get("/api/v1/models/list?capability=generate"),
          Ht.get("/api/v1/models/classes")
        ]);
        if (C.data?.success !== !0 || _.data?.success !== !0) throw new Error("Could not check model configuration.");
        c.value = C.data.models.map((O) => O.name), p.value = _.data.classes.filter((O) => O.models.length > 0 && c.value.includes(O.models[0].name)).map((O) => `class:${O.name}`), s.value = !0;
      } catch (C) {
        u.value = P(C);
      } finally {
        l.value = !1;
      }
    }
    async function F() {
      u.value = "";
      try {
        await ne("kickside-onboard-models", { timeoutMs: 8e3 }), v.value = !0;
      } catch (C) {
        u.value = P(C);
      }
    }
    async function Y() {
      v.value = !1, await j();
    }
    async function G() {
      if (g.value) {
        i.value = !0, u.value = "";
        try {
          if (!d.value) {
            const O = { title: o.value.trim() };
            r.value && (O.model = r.value), a.value.traits.length && (O.traits = [...a.value.traits], O.trait_contexts = { ...a.value.trait_contexts });
            const { data: W } = await Ht.post("/api/v1/user-agents", O);
            if (W?.success !== !0 || !W.component_id) throw new Error(W?.error || "Could not create your agent.");
            d.value = W.component_id;
          }
          const { data: C } = await Ht.get("/api/v1/agents/list");
          if (C?.success !== !0) throw new Error(C?.error || "Could not open your agent.");
          const _ = C.agents.find((O) => O.name === `user_agent:${d.value}`);
          if (!_?.start_token) throw new Error("Your agent is created. Chat is unavailable; retry to open it.");
          e("navigate", { path: "/sessions", startToken: _.start_token });
        } catch (C) {
          u.value = P(C);
        } finally {
          i.value = !1;
        }
      }
    }
    return ln(j), (C, _) => (V(), M("div", Pa, [
      $.value === "loading" ? (V(), M("p", xa, "Loading your choices…")) : $.value === "failed" ? (V(), M("div", Ca, [
        N("p", Oa, Ot(u.value), 1),
        N("div", Ta, [
          tt(et(ct), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            onClick: y
          }),
          tt(et(ct), {
            type: "button",
            label: "Retry",
            onClick: j
          })
        ])
      ])) : $.value === "model-setup" ? (V(), M("section", Aa, [
        N("header", Ea, [
          N("span", Na, [
            tt(et(ke), { icon: "tabler:cpu" })
          ]),
          _[3] || (_[3] = N("h2", {
            id: "model-setup-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        _[4] || (_[4] = N("p", { class: "text" }, "Agents need a language model to respond, and none is connected to this workspace yet. Connect a model provider to continue, or ask an administrator if you do not manage models.", -1)),
        u.value ? (V(), M("p", ja, Ot(u.value), 1)) : st("", !0),
        N("div", La, [
          tt(et(ct), {
            type: "button",
            "data-dismiss": "",
            label: "Cancel",
            severity: "secondary",
            onClick: y
          }),
          tt(et(ct), {
            type: "button",
            label: "Set up a model",
            onClick: F
          })
        ])
      ])) : $.value === "configuring" ? (V(), M("section", Va, [
        N("header", Ia, [
          N("span", Ra, [
            tt(et(ke), { icon: "tabler:cpu" })
          ]),
          _[5] || (_[5] = N("h2", {
            id: "model-config-title",
            class: "title"
          }, "Set up a model", -1))
        ]),
        (V(), Ct(dn("kickside-onboard-models"), {
          class: "model-config",
          onDone: ee(Y, ["stop"]),
          onBack: _[0] || (_[0] = ee((O) => v.value = !1, ["stop"]))
        }, null, 32))
      ])) : (V(), M("form", {
        key: 4,
        class: "stack",
        "aria-labelledby": "create-agent-title",
        onSubmit: ee(G, ["prevent"])
      }, [
        _[8] || (_[8] = N("h2", {
          id: "create-agent-title",
          class: "title"
        }, "Create your first agent", -1)),
        _[9] || (_[9] = N("p", { class: "intro" }, "Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.", -1)),
        N("fieldset", {
          disabled: i.value || !!d.value
        }, [
          N("div", Ma, [
            N("div", Fa, [
              _[6] || (_[6] = N("label", { for: "first-agent-title" }, "Agent name", -1)),
              tt(et(Rn), {
                id: "first-agent-title",
                modelValue: o.value,
                "onUpdate:modelValue": _[1] || (_[1] = (O) => o.value = O),
                name: "title",
                autocomplete: "off",
                maxlength: "120",
                fluid: ""
              }, null, 8, ["modelValue"])
            ]),
            N("div", Ba, [
              _[7] || (_[7] = N("span", {
                id: "first-agent-model",
                class: "label"
              }, "Model", -1)),
              N("wc-model-picker", {
                value: r.value,
                capability: "generate",
                "aria-labelledby": "first-agent-model",
                onSelect: _[2] || (_[2] = (O) => r.value = O.detail)
              }, null, 40, za),
              f.value ? st("", !0) : (V(), M("p", Ua, "This workspace has no default model; choose one."))
            ])
          ]),
          N("wc-agent-trait-picker", {
            value: JSON.stringify(a.value),
            "aria-label": "Agent capabilities",
            onChange: h
          }, null, 40, Wa)
        ], 8, Da),
        u.value ? (V(), M("p", Ha, Ot(u.value), 1)) : st("", !0),
        N("div", Ka, [
          tt(et(ct), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            disabled: i.value,
            onClick: y
          }, null, 8, ["disabled"]),
          tt(et(ct), {
            type: "submit",
            label: i.value ? "Creating…" : d.value ? "Open agent chat" : "Create agent",
            disabled: !g.value
          }, null, 8, ["label", "disabled"])
        ])
      ], 32))
    ]));
  }
}), qa = ":host{display:block;min-width:0;color:var(--p-text-color)}.onboarding{box-sizing:border-box;width:100%;min-width:0}p{line-height:1.5;margin:0}.stack{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.status{color:var(--p-text-muted-color)}.hint{color:var(--p-text-muted-color);font-size:.8125rem}.intro{color:var(--p-text-muted-color)}fieldset{border:0;padding:0;margin:0;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);gap:16px}.field-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}.field{display:grid;gap:6px;min-width:0;align-content:start}.field label,.field .label{font-weight:700;font-size:13.5px}wc-model-picker{display:block;width:100%}wc-agent-trait-picker{display:block;min-width:0}.title{margin:0;padding-right:32px;font-family:var(--kx-font-heading);font-size:24px;font-weight:800;line-height:1.15;letter-spacing:-.6px;color:var(--p-text-color)}.head{display:flex;align-items:center;gap:12px;padding-right:32px}.head .title{padding-right:0}.head-icon{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:var(--kx-radius-10);background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);font-size:22px}.text{color:var(--p-text-muted-color)}.model-setup{display:grid;gap:12px}.model-setup .actions{margin-top:8px}.model-config{display:block;min-width:0}.error{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-600, var(--p-danger-500)) 8%,transparent);border-radius:var(--kx-radius-10);padding:12px}.actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}", Ja = { props: { type: "object", properties: {} } }, Qa = {
  wippy: Ja
};
class Dn extends Xo {
  static get wippyConfig() {
    return { propsSchema: Qa.wippy.props, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: qa };
  }
  static get vueConfig() {
    return { rootComponent: Ga, plugins: [zi] };
  }
}
async function es() {
  return Dn;
}
ko(import.meta.url, Dn);
export {
  es as webComponent
};
