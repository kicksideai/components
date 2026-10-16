import { hasInjectionContext as no, inject as rn, effectScope as oo, ref as N, markRaw as ro, createApp as io, readonly as ao, getCurrentInstance as _e, onMounted as an, nextTick as so, watch as Pt, reactive as lo, renderSlot as X, openBlock as L, createBlock as St, Teleport as sn, createCommentVNode as G, useId as uo, mergeProps as R, h as co, createElementBlock as U, createElementVNode as M, createTextVNode as ln, toDisplayString as fe, resolveComponent as Se, resolveDirective as po, withDirectives as fo, resolveDynamicComponent as un, withCtx as ho, normalizeClass as $e, defineComponent as mo, computed as Xt, withModifiers as bo, createVNode as wt, unref as ut } from "vue";
import { addCollection as vo } from "@iconify/vue";
import { config as we, addIcons as go, on as yo, applyThemeMode as zt, host as _o, hostCss as So, loadCss as $o, loadByTagName as te, api as Ut, define as wo } from "@wippy-fe/proxy";
var ie = "data-wippy-visible";
function ke(t) {
  const e = t.getAttribute(ie);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var ko = Object.defineProperty, Po = (t, e, n) => e in t ? ko(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, E = (t, e, n) => Po(t, typeof e != "symbol" ? e + "" : e, n), Co = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], xo = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Pe(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Oo(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    if (n)
      for (const [o, r] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && r && typeof r == "object") {
          for (const [l, s] of Object.entries(r)) {
            const i = typeof s == "string" ? Pe(l) : null;
            i && e.add(i);
          }
          continue;
        }
        const a = typeof r == "string" ? Pe(o) : null;
        a && e.add(a);
      }
  return [...e].sort();
}
function To(t) {
  if (t.length === 0)
    return "";
  const e = t.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${xo} {
${e}
}`;
}
function Ao(t, e) {
  const n = To(e);
  n && dn(t, n, "@wippy-fe/css-variables-bridge");
}
function Eo(t, e) {
  const o = (e ?? Co).map(async (r) => {
    const a = So[r];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await $o(a);
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
function No(t, e) {
  const n = document.createElement("style");
  n.textContent = e, t.appendChild(n);
}
function dn(t, e, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, r];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = e, t.appendChild(o);
}
function jo(t, e) {
  dn(t, e, "@wippy-fe/custom-css");
}
function cn(t) {
  return t.__wippyHost ?? null;
}
function Lo(t) {
  return t.replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function Vo(t, e, n) {
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
function ee(t, e) {
  const n = {}, o = [];
  for (const [r, a] of Object.entries(e.properties)) {
    const l = t.getAttribute(r), s = Lo(r);
    if (l === null) {
      a.default !== void 0 && (n[s] = a.default);
      continue;
    }
    const i = Vo(r, l, a);
    i.error ? o.push(i.error) : n[s] = i.value;
  }
  return { props: n, errors: o };
}
var Io = class {
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
}, Ro = class extends HTMLElement {
  constructor() {
    super(), E(this, "_internals"), E(this, "_contentObserver", null), E(this, "_initialized", !1), E(this, "_container", null), E(this, "_reactive", null), E(this, "_lastProps", null), E(this, "_lastErrors", []), E(this, "_lastContent", null), E(this, "_themeUnsub", null), E(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ke(this);
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
    return [.../* @__PURE__ */ new Set([...e, ...n, ie])];
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
    return cn(this);
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
        const a = ee(this, t.propsSchema);
        t.validateProps && a.errors.push(...t.validateProps(a.props)), n = a.props, o = a.errors, this._lastProps = n, this._lastErrors = o;
      }
      const r = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = r), this._reactive = new Io(
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
        this.onInit(n), t.inlineCss && No(n, t.inlineCss);
        try {
          const u = we?.theming, d = Oo(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Ao(n, d);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const u = we?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && jo(n, d);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && Eo(n, t.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const i = t.containerClasses ?? [];
        i.length > 0 && o.classList.add(...i), n.appendChild(o), this._container = o, go(vo);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = yo("@theme", (i) => this._applyTheme(i)));
      const { props: r, errors: a } = ee(this, t.propsSchema);
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
  _applyTheme(t = _o.getThemeMode?.()) {
    zt(t, this), this._container && zt(t, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), zt("auto", this), this._container && zt("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(t, e, n) {
    if (e === n)
      return;
    if (t === ie) {
      const s = this._hostVisible, i = ke(this);
      if (i === s)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, s), this.onHostVisibilityChanged(i, s));
      return;
    }
    const o = this.constructor.wippyConfig, { props: r, errors: a } = ee(this, o.propsSchema);
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
function Do(t) {
  return t.__wippyHostBus ?? null;
}
function Mo(t) {
  return t.dataset.wippyPanelId ?? null;
}
let pn;
const fn = (t) => pn = t, Fo = () => no() && rn(hn) || pn, hn = (
  /* istanbul ignore next */
  /* @__PURE__ */ Symbol()
);
function Bo() {
  const t = oo(!0), e = t.run(() => N({}));
  let n = [], o = [];
  const r = ro({
    install(a) {
      fn(r), r._a = a, a.provide(hn, r), a.config.globalProperties.$pinia = r, o.forEach((l) => n.push(l)), o = [];
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
var zo = Object.defineProperty, Uo = (t, e, n) => e in t ? zo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, vt = (t, e, n) => Uo(t, typeof e != "symbol" ? e + "" : e, n), mn = /* @__PURE__ */ Symbol("wippy:emit"), Wo = /* @__PURE__ */ Symbol("wippy:props"), Ho = /* @__PURE__ */ Symbol("wippy:props_error"), Ko = /* @__PURE__ */ Symbol("wippy:content"), Yo = /* @__PURE__ */ Symbol("wippy:panel-id"), Go = /* @__PURE__ */ Symbol("wippy:layout-bus"), qo = /* @__PURE__ */ Symbol("wippy:host"), Jo = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Qo() {
  const t = rn(mn);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
var Zo = class extends Ro {
  constructor() {
    super(...arguments), vt(this, "_vueApp", null), vt(this, "_propsRef", N({})), vt(this, "_errorsRef", N([])), vt(this, "_contentRef", N(null)), vt(this, "_hostVisibilityRef", N(null)), vt(this, "_bridgeAbort", null);
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
      const d = Fo(), c = io(u.rootComponent);
      this._vueApp = c;
      const p = Bo();
      if (u.piniaPlugins)
        for (const f of u.piniaPlugins)
          p.use(f);
      if (c.use(p), u.plugins)
        for (const f of u.plugins)
          c.use(f);
      c.provide(Wo, this._propsRef), c.provide(Ho, this._errorsRef), c.provide(mn, this.emitEvent.bind(this)), c.provide(Ko, this._contentRef), c.provide(Jo, this._hostVisibilityRef), c.provide(Yo, Mo(this)), c.provide(Go, Do(this)), c.provide(qo, cn(this)), u.providers && u.providers(c, this), c.mount(e), d && fn(d);
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
}, Xo = Object.defineProperty, Ce = Object.getOwnPropertySymbols, tr = Object.prototype.hasOwnProperty, er = Object.prototype.propertyIsEnumerable, xe = (t, e, n) => e in t ? Xo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, nr = (t, e) => {
  for (var n in e || (e = {})) tr.call(e, n) && xe(t, n, e[n]);
  if (Ce) for (var n of Ce(e)) er.call(e, n) && xe(t, n, e[n]);
  return t;
};
function pt(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0 || !(t instanceof Date) && typeof t == "object" && Object.keys(t).length === 0;
}
function he(t) {
  return typeof t == "function" && "call" in t && "apply" in t;
}
function T(t) {
  return !pt(t);
}
function J(t, e = !0) {
  return t instanceof Object && t.constructor === Object && (e || Object.keys(t).length !== 0);
}
function bn(t = {}, e = {}) {
  let n = nr({}, t);
  return Object.keys(e).forEach((o) => {
    let r = o;
    J(e[r]) && r in t && J(t[r]) ? n[r] = bn(t[r], e[r]) : n[r] = e[r];
  }), n;
}
function or(...t) {
  return t.reduce((e, n, o) => o === 0 ? n : bn(e, n), {});
}
function B(t, ...e) {
  return he(t) ? t(...e) : t;
}
function F(t, e = !0) {
  return typeof t == "string" && (e || t !== "");
}
function q(t) {
  return F(t) ? t.replace(/(-|_)/g, "").toLowerCase() : t;
}
function me(t, e = "", n = {}) {
  let o = q(e).split("."), r = o.shift();
  if (r) {
    if (J(t)) {
      let a = Object.keys(t).find((l) => q(l) === r) || "";
      return me(B(t[a], n), o.join("."), n);
    }
    return;
  }
  return B(t, n);
}
function vn(t, e = !0) {
  return Array.isArray(t) && (e || t.length !== 0);
}
function rr(t) {
  return T(t) && !isNaN(t);
}
function dt(t, e) {
  if (e) {
    let n = e.test(t);
    return e.lastIndex = 0, n;
  }
  return !1;
}
function ir(...t) {
  return or(...t);
}
function xt(t) {
  return t && t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function ar(t) {
  return F(t, !1) ? t[0].toUpperCase() + t.slice(1) : t;
}
function gn(t) {
  return F(t) ? t.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : t;
}
function yn() {
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
function sr(t, e) {
  return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function lr(t, e) {
  if (t && e) {
    let n = (o) => {
      sr(t, o) || (t.classList ? t.classList.add(o) : t.className += " " + o);
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function ne(t, e) {
  if (t && e) {
    let n = (o) => {
      t.classList ? t.classList.remove(o) : t.className = t.className.replace(new RegExp("(^|\\b)" + o.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function Oe(t) {
  return t ? Math.abs(t.scrollLeft) : 0;
}
function ur(t, e) {
  return t instanceof HTMLElement ? t.offsetWidth : 0;
}
function dr(t) {
  if (t) {
    let e = t.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function cr(t) {
  return !!(t !== null && typeof t < "u" && t.nodeName && dr(t));
}
function Ft(t) {
  return typeof Element < "u" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function Gt(t, e = {}) {
  if (Ft(t)) {
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
        a ? t.addEventListener(a[1].toLowerCase(), r) : o === "p-bind" || o === "pBind" ? Gt(t, r) : (r = o === "class" ? [...new Set(n("class", r))].join(" ").trim() : o === "style" ? n("style", r).join(";").trim() : r, (t.$attrs = t.$attrs || {}) && (t.$attrs[o] = r), t.setAttribute(o, r));
      }
    });
  }
}
function pr(t, e = {}, ...n) {
  {
    let o = document.createElement(t);
    return Gt(o, e), o.append(...n), o;
  }
}
function fr(t, e) {
  return Ft(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function hr(t, e) {
  if (Ft(t)) {
    let n = t.getAttribute(e);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Te(t) {
  if (t) {
    let e = t.offsetHeight, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), e;
  }
  return 0;
}
function mr(t) {
  if (t) {
    let e = t.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || Oe(document.documentElement) || Oe(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function br(t, e) {
  return t ? t.offsetHeight : 0;
}
function Ae(t) {
  if (t) {
    let e = t.offsetWidth, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), e;
  }
  return 0;
}
function _n() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function vr(t, e = "", n) {
  Ft(t) && n !== null && n !== void 0 && t.setAttribute(e, n);
}
var Wt = {};
function gr(t = "pui_id_") {
  return Object.hasOwn(Wt, t) || (Wt[t] = 0), Wt[t]++, `${t}${Wt[t]}`;
}
var yr = Object.defineProperty, _r = Object.defineProperties, Sr = Object.getOwnPropertyDescriptors, qt = Object.getOwnPropertySymbols, Sn = Object.prototype.hasOwnProperty, $n = Object.prototype.propertyIsEnumerable, Ee = (t, e, n) => e in t ? yr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, H = (t, e) => {
  for (var n in e || (e = {})) Sn.call(e, n) && Ee(t, n, e[n]);
  if (qt) for (var n of qt(e)) $n.call(e, n) && Ee(t, n, e[n]);
  return t;
}, oe = (t, e) => _r(t, Sr(e)), Z = (t, e) => {
  var n = {};
  for (var o in t) Sn.call(t, o) && e.indexOf(o) < 0 && (n[o] = t[o]);
  if (t != null && qt) for (var o of qt(t)) e.indexOf(o) < 0 && $n.call(t, o) && (n[o] = t[o]);
  return n;
}, $r = yn(), V = $r, Ot = /{([^}]*)}/g, wn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, kn = /var\([^)]+\)/g;
function Ne(t) {
  return F(t) ? t.replace(/[A-Z]/g, (e, n) => n === 0 ? e : "." + e.toLowerCase()).toLowerCase() : t;
}
function wr(t) {
  return J(t) && t.hasOwnProperty("$value") && t.hasOwnProperty("$type") ? t.$value : t;
}
function kr(t) {
  return t.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function ae(t = "", e = "") {
  return kr(`${F(t, !1) && F(e, !1) ? `${t}-` : t}${e}`);
}
function Pn(t = "", e = "") {
  return `--${ae(t, e)}`;
}
function Pr(t = "") {
  let e = (t.match(/{/g) || []).length, n = (t.match(/}/g) || []).length;
  return (e + n) % 2 !== 0;
}
function Cn(t, e = "", n = "", o = [], r) {
  if (F(t)) {
    let a = t.trim();
    if (Pr(a)) return;
    if (dt(a, Ot)) {
      let l = a.replaceAll(Ot, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((u) => !o.some((d) => dt(u, d)));
        return `var(${Pn(n, gn(i.join("-")))}${T(r) ? `, ${r}` : ""})`;
      });
      return dt(l.replace(kn, "0"), wn) ? `calc(${l})` : l;
    }
    return a;
  } else if (rr(t)) return t;
}
function Cr(t, e, n) {
  F(e, !1) && t.push(`${e}:${n};`);
}
function gt(t, e) {
  return t ? `${t}{${e}}` : "";
}
function xn(t, e) {
  if (t.indexOf("dt(") === -1) return t;
  function n(l, s) {
    let i = [], u = 0, d = "", c = null, p = 0;
    for (; u <= l.length; ) {
      let f = l[u];
      if ((f === '"' || f === "'" || f === "`") && l[u - 1] !== "\\" && (c = c === f ? null : f), !c && (f === "(" && p++, f === ")" && p--, (f === "," || u === l.length) && p === 0)) {
        let h = d.trim();
        h.startsWith("dt(") ? i.push(xn(h, s)) : i.push(o(h)), d = "", u++;
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
var ct = (...t) => xr(O.getTheme(), ...t), xr = (t = {}, e, n, o) => {
  if (e) {
    let { variable: r, options: a } = O.defaults || {}, { prefix: l, transform: s } = t?.options || a || {}, i = dt(e, Ot) ? e : `{${e}}`;
    return o === "value" || pt(o) && s === "strict" ? O.getTokenValue(e) : Cn(i, void 0, l, [r.excludedKeyRegex], n);
  }
  return "";
};
function Ht(t, ...e) {
  if (t instanceof Array) {
    let n = t.reduce((o, r, a) => {
      var l;
      return o + r + ((l = B(e[a], { dt: ct })) != null ? l : "");
    }, "");
    return xn(n, ct);
  }
  return B(t, { dt: ct });
}
function Or(t, e = {}) {
  let n = O.defaults.variable, { prefix: o = n.prefix, selector: r = n.selector, excludedKeyRegex: a = n.excludedKeyRegex } = e, l = [], s = [], i = [{ node: t, path: o }];
  for (; i.length; ) {
    let { node: d, path: c } = i.pop();
    for (let p in d) {
      let f = d[p], h = wr(f), v = dt(p, a) ? ae(c) : ae(c, gn(p));
      if (J(h)) i.push({ node: h, path: v });
      else {
        let b = Pn(v), g = Cn(h, v, o, [a]);
        Cr(s, b, g);
        let w = v;
        o && w.startsWith(o + "-") && (w = w.slice(o.length + 1)), l.push(w.replace(/-/g, "."));
      }
    }
  }
  let u = s.join("");
  return { value: s, tokens: l, declarations: u, css: gt(r, u) };
}
var W = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(t) {
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
  return Or(t, { prefix: e?.prefix });
}, getCommon({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var a, l, s, i, u, d, c;
  let { preset: p, options: f } = e, h, v, b, g, w, P, m;
  if (T(p) && f.transform !== "strict") {
    let { primitive: S, semantic: j, extend: C } = p, y = j || {}, { colorScheme: x } = y, z = Z(y, ["colorScheme"]), tt = C || {}, { colorScheme: rt } = tt, it = Z(tt, ["colorScheme"]), et = x || {}, { dark: at } = et, ft = Z(et, ["dark"]), st = rt || {}, { dark: ht } = st, mt = Z(st, ["dark"]), Q = T(S) ? this._toVariables({ primitive: S }, f) : {}, K = T(z) ? this._toVariables({ semantic: z }, f) : {}, lt = T(ft) ? this._toVariables({ light: ft }, f) : {}, Bt = T(at) ? this._toVariables({ dark: at }, f) : {}, bt = T(it) ? this._toVariables({ semantic: it }, f) : {}, ge = T(mt) ? this._toVariables({ light: mt }, f) : {}, ye = T(ht) ? this._toVariables({ dark: ht }, f) : {}, [Dn, Mn] = [(a = Q.declarations) != null ? a : "", Q.tokens], [Fn, Bn] = [(l = K.declarations) != null ? l : "", K.tokens || []], [zn, Un] = [(s = lt.declarations) != null ? s : "", lt.tokens || []], [Wn, Hn] = [(i = Bt.declarations) != null ? i : "", Bt.tokens || []], [Kn, Yn] = [(u = bt.declarations) != null ? u : "", bt.tokens || []], [Gn, qn] = [(d = ge.declarations) != null ? d : "", ge.tokens || []], [Jn, Qn] = [(c = ye.declarations) != null ? c : "", ye.tokens || []];
    h = this.transformCSS(t, Dn, "light", "variable", f, o, r), v = Mn;
    let Zn = this.transformCSS(t, `${Fn}${zn}`, "light", "variable", f, o, r), Xn = this.transformCSS(t, `${Wn}`, "dark", "variable", f, o, r);
    b = `${Zn}${Xn}`, g = [.../* @__PURE__ */ new Set([...Bn, ...Un, ...Hn])];
    let to = this.transformCSS(t, `${Kn}${Gn}color-scheme:light`, "light", "variable", f, o, r), eo = this.transformCSS(t, `${Jn}color-scheme:dark`, "dark", "variable", f, o, r);
    w = `${to}${eo}`, P = [.../* @__PURE__ */ new Set([...Yn, ...qn, ...Qn])], m = B(p.css, { dt: ct });
  }
  return { primitive: { css: h, tokens: v }, semantic: { css: b, tokens: g }, global: { css: w, tokens: P }, style: m };
}, getPreset({ name: t = "", preset: e = {}, options: n, params: o, set: r, defaults: a, selector: l }) {
  var s, i, u;
  let d, c, p;
  if (T(e) && n.transform !== "strict") {
    let f = t.replace("-directive", ""), h = e, { colorScheme: v, extend: b, css: g } = h, w = Z(h, ["colorScheme", "extend", "css"]), P = b || {}, { colorScheme: m } = P, S = Z(P, ["colorScheme"]), j = v || {}, { dark: C } = j, y = Z(j, ["dark"]), x = m || {}, { dark: z } = x, tt = Z(x, ["dark"]), rt = T(w) ? this._toVariables({ [f]: H(H({}, w), S) }, n) : {}, it = T(y) ? this._toVariables({ [f]: H(H({}, y), tt) }, n) : {}, et = T(C) ? this._toVariables({ [f]: H(H({}, C), z) }, n) : {}, [at, ft] = [(s = rt.declarations) != null ? s : "", rt.tokens || []], [st, ht] = [(i = it.declarations) != null ? i : "", it.tokens || []], [mt, Q] = [(u = et.declarations) != null ? u : "", et.tokens || []], K = this.transformCSS(f, `${at}${st}`, "light", "variable", n, r, a, l), lt = this.transformCSS(f, mt, "dark", "variable", n, r, a, l);
    d = `${K}${lt}`, c = [.../* @__PURE__ */ new Set([...ft, ...ht, ...Q])], p = B(g, { dt: ct });
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
  return r ? `@layer ${B(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: a }) {
  let l = this.getCommon({ name: t, theme: e, params: n, set: r, defaults: a }), s = Object.entries(o).reduce((i, [u, d]) => i.push(`${u}="${d}"`) && i, []).join(" ");
  return Object.entries(l || {}).reduce((i, [u, d]) => {
    if (J(d) && Object.hasOwn(d, "css")) {
      let c = xt(d.css), p = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${p}" ${s}>${c}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: a }) {
  var l;
  let s = { name: t, theme: e, params: n, set: r, defaults: a }, i = (l = t.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : l.css, u = Object.entries(o).reduce((d, [c, p]) => d.push(`${c}="${p}"`) && d, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${xt(i)}</style>` : "";
}, createTokens(t = {}, e, n = "", o = "", r = {}) {
  let a = function(s, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && Ot.test(this.value)) {
      let c = this.value.trim().replace(Ot, (p) => {
        var f;
        let h = p.slice(1, -1), v = this.tokens[h];
        if (!v) return console.warn(`Token not found for path: ${h}`), "__UNRESOLVED__";
        let b = v.computed(s, i, u);
        return Array.isArray(b) && b.length === 2 ? `light-dark(${b[0].value},${b[1].value})` : (f = b?.value) != null ? f : "__UNRESOLVED__";
      });
      d = wn.test(c.replace(kn, "0")) ? `calc(${c})` : c;
    }
    return pt(i.binding) && delete i.binding, u.pop(), { colorScheme: s, path: this.path, paths: i, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, l = (s, i, u) => {
    Object.entries(s).forEach(([d, c]) => {
      let p = dt(d, e.variable.excludedKeyRegex) ? i : i ? `${i}.${Ne(d)}` : Ne(d), f = u ? `${u}.${d}` : d;
      J(c) ? l(c, p, f) : (r[p] || (r[p] = { paths: [], computed: (h, v = {}, b = []) => {
        if (r[p].paths.length === 1) return r[p].paths[0].computed(r[p].paths[0].scheme, v.binding, b);
        if (h && h !== "none") for (let g = 0; g < r[p].paths.length; g++) {
          let w = r[p].paths[g];
          if (w.scheme === h) return w.computed(h, v.binding, b);
        }
        return r[p].paths.map((g) => g.computed(g.scheme, v[g.scheme], b));
      } }), r[p].paths.push({ path: f, value: c, scheme: f.includes("colorScheme.light") ? "light" : f.includes("colorScheme.dark") ? "dark" : "none", computed: a, tokens: r }));
    });
  };
  return l(t, n, o), r;
}, getTokenValue(t, e, n) {
  var o;
  let r = ((s) => s.split(".").filter((i) => !dt(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(e), a = e.includes("colorScheme.light") ? "light" : e.includes("colorScheme.dark") ? "dark" : void 0, l = [(o = t[r]) == null ? void 0 : o.computed(a)].flat().filter((s) => s);
  return l.length === 1 ? l[0].value : l.reduce((s = {}, i) => {
    let u = i, { colorScheme: d } = u, c = Z(u, ["colorScheme"]);
    return s[d] = c, s;
  }, void 0);
}, getSelectorRule(t, e, n, o) {
  return n === "class" || n === "attr" ? gt(T(e) ? `${t}${e},${t} ${e}` : t, o) : gt(t, gt(e ?? ":root,:host", o));
}, transformCSS(t, e, n, o, r = {}, a, l, s) {
  if (T(e)) {
    let { cssLayer: i } = r;
    if (o !== "style") {
      let u = this.getColorSchemeOption(r, l);
      e = n === "dark" ? u.reduce((d, { type: c, selector: p }) => (T(p) && (d += p.includes("[CSS]") ? p.replace("[CSS]", e) : this.getSelectorRule(p, s, c, e)), d), "") : gt(s ?? ":root,:host", e);
    }
    if (i) {
      let u = { name: "primeui" };
      J(i) && (u.name = B(i.name, { name: t, type: o })), T(u.name) && (e = gt(`@layer ${u.name}`, e), a?.layerNames(u.name));
    }
    return e;
  }
  return "";
} }, O = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(t = {}) {
  let { theme: e } = t;
  e && (this._theme = oe(H({}, e), { options: H(H({}, this.defaults.options), e.options) }), this._tokens = W.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: t }), V.emit("theme:change", t);
}, getPreset() {
  return this.preset;
}, setPreset(t) {
  this._theme = oe(H({}, this.theme), { preset: t }), this._tokens = W.createTokens(t, this.defaults), this.clearLoadedStyleNames(), V.emit("preset:change", t), V.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(t) {
  this._theme = oe(H({}, this.theme), { options: t }), this.clearLoadedStyleNames(), V.emit("options:change", t), V.emit("theme:change", this.theme);
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
  return W.getTokenValue(this.tokens, t, this.defaults);
}, getCommon(t = "", e) {
  return W.getCommon({ name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return W.getPresetC(n);
}, getDirective(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return W.getPresetD(n);
}, getCustomPreset(t = "", e, n, o) {
  let r = { name: t, preset: e, options: this.options, selector: n, params: o, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return W.getPreset(r);
}, getLayerOrderCSS(t = "") {
  return W.getLayerOrder(t, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(t = "", e, n = "style", o) {
  return W.transformCSS(t, e, o, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(t = "", e, n = {}) {
  return W.getCommonStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(t, e, n = {}) {
  return W.getStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(t) {
  this._loadingStyles.add(t);
}, onStyleUpdated(t) {
  this._loadingStyles.add(t);
}, onStyleLoaded(t, { name: e }) {
  this._loadingStyles.size && (this._loadingStyles.delete(e), V.emit(`theme:${e}:load`, t), !this._loadingStyles.size && V.emit("theme:load"));
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
}, Tr = `
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
function Tt(t) {
  "@babel/helpers - typeof";
  return Tt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Tt(t);
}
function je(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Le(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? je(Object(n), !0).forEach(function(o) {
      Ar(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : je(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Ar(t, e, n) {
  return (e = Er(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Er(t) {
  var e = Nr(t, "string");
  return Tt(e) == "symbol" ? e : e + "";
}
function Nr(t, e) {
  if (Tt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Tt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function jr(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  _e() && _e().components ? an(t) : e ? t() : so(t);
}
var Lr = 0;
function Vr(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = N(!1), o = N(t), r = N(null), a = _n() ? window.document : void 0, l = e.document, s = l === void 0 ? a : l, i = e.immediate, u = i === void 0 ? !0 : i, d = e.manual, c = d === void 0 ? !1 : d, p = e.name, f = p === void 0 ? "style_".concat(++Lr) : p, h = e.id, v = h === void 0 ? void 0 : h, b = e.media, g = b === void 0 ? void 0 : b, w = e.nonce, P = w === void 0 ? void 0 : w, m = e.first, S = m === void 0 ? !1 : m, j = e.onMounted, C = j === void 0 ? void 0 : j, y = e.onUpdated, x = y === void 0 ? void 0 : y, z = e.onLoad, tt = z === void 0 ? void 0 : z, rt = e.props, it = rt === void 0 ? {} : rt, et = function() {
  }, at = function(ht) {
    var mt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var Q = Le(Le({}, it), mt), K = Q.name || f, lt = Q.id || v, Bt = Q.nonce || P;
      r.value = s.querySelector('style[data-primevue-style-id="'.concat(K, '"]')) || s.getElementById(lt) || s.createElement("style"), r.value.isConnected || (o.value = ht || t, Gt(r.value, {
        type: "text/css",
        id: lt,
        media: g,
        nonce: Bt
      }), S ? s.head.prepend(r.value) : s.head.appendChild(r.value), vr(r.value, "data-primevue-style-id", K), Gt(r.value, Q), r.value.onload = function(bt) {
        return tt?.(bt, {
          name: K
        });
      }, C?.(K)), !n.value && (et = Pt(o, function(bt) {
        r.value.textContent = bt, x?.(K);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ft = function() {
    !s || !n.value || (et(), cr(r.value) && s.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && jr(at), {
    id: v,
    name: f,
    el: r,
    css: o,
    unload: ft,
    load: at,
    isLoaded: ao(n)
  };
}
function At(t) {
  "@babel/helpers - typeof";
  return At = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, At(t);
}
var Ve, Ie, Re, De;
function Me(t, e) {
  return Mr(t) || Dr(t, e) || Rr(t, e) || Ir();
}
function Ir() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Rr(t, e) {
  if (t) {
    if (typeof t == "string") return Fe(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fe(t, e) : void 0;
  }
}
function Fe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Dr(t, e) {
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
function Mr(t) {
  if (Array.isArray(t)) return t;
}
function Be(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function re(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Be(Object(n), !0).forEach(function(o) {
      Fr(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Be(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Fr(t, e, n) {
  return (e = Br(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Br(t) {
  var e = zr(t, "string");
  return At(e) == "symbol" ? e : e + "";
}
function zr(t, e) {
  if (At(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (At(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Kt(t, e) {
  return e || (e = t.slice(0)), Object.freeze(Object.defineProperties(t, { raw: { value: Object.freeze(e) } }));
}
var Ur = function(e) {
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
}, Wr = {}, Hr = {}, A = {
  name: "base",
  css: Ur,
  style: Tr,
  classes: Wr,
  inlineStyles: Hr,
  load: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, r = o(Ht(Ve || (Ve = Kt(["", ""])), e));
    return T(r) ? Vr(xt(r), re({
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
      return O.transformCSS(n.name || e.name, "".concat(r).concat(Ht(Ie || (Ie = Kt(["", ""])), o)));
    });
  },
  getCommonTheme: function(e) {
    return O.getCommon(this.name, e);
  },
  getComponentTheme: function(e) {
    return O.getComponent(this.name, e);
  },
  getDirectiveTheme: function(e) {
    return O.getDirective(this.name, e);
  },
  getPresetTheme: function(e, n, o) {
    return O.getCustomPreset(this.name, e, n, o);
  },
  getLayerOrderThemeCSS: function() {
    return O.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var o = B(this.css, {
        dt: ct
      }) || "", r = xt(Ht(Re || (Re = Kt(["", "", ""])), o, e)), a = Object.entries(n).reduce(function(l, s) {
        var i = Me(s, 2), u = i[0], d = i[1];
        return l.push("".concat(u, '="').concat(d, '"')) && l;
      }, []).join(" ");
      return T(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return O.getCommonStyleSheet(this.name, e, n);
  },
  getThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = [O.getStyleSheet(this.name, e, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = Ht(De || (De = Kt(["", ""])), B(this.style, {
        dt: ct
      })), l = xt(O.transformCSS(r, a)), s = Object.entries(n).reduce(function(i, u) {
        var d = Me(u, 2), c = d[0], p = d[1];
        return i.push("".concat(c, '="').concat(p, '"')) && i;
      }, []).join(" ");
      T(l) && o.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(s, ">").concat(l, "</style>"));
    }
    return o.join("");
  },
  extend: function(e) {
    return re(re({}, this), {}, {
      css: void 0,
      style: void 0
    }, e);
  }
}, ot = yn();
function Et(t) {
  "@babel/helpers - typeof";
  return Et = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Et(t);
}
function ze(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Yt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ze(Object(n), !0).forEach(function(o) {
      Kr(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ze(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Kr(t, e, n) {
  return (e = Yr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Yr(t) {
  var e = Gr(t, "string");
  return Et(e) == "symbol" ? e : e + "";
}
function Gr(t, e) {
  if (Et(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Et(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var qr = {
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
}, Jr = /* @__PURE__ */ Symbol();
function Qr(t, e) {
  var n = {
    config: lo(e)
  };
  return t.config.globalProperties.$primevue = n, t.provide(Jr, n), Zr(), Xr(t, n), n;
}
var _t = [];
function Zr() {
  V.clear(), _t.forEach(function(t) {
    return t?.();
  }), _t = [];
}
function Xr(t, e) {
  var n = N(!1), o = function() {
    var u;
    if (((u = e.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !O.isStyleNameLoaded("common")) {
      var d, c, p = ((d = A.getCommonTheme) === null || d === void 0 ? void 0 : d.call(A)) || {}, f = p.primitive, h = p.semantic, v = p.global, b = p.style, g = {
        nonce: (c = e.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      A.load(f?.css, Yt({
        name: "primitive-variables"
      }, g)), A.load(h?.css, Yt({
        name: "semantic-variables"
      }, g)), A.load(v?.css, Yt({
        name: "global-variables"
      }, g)), A.loadStyle(Yt({
        name: "global-style"
      }, g), b), O.setLoadedStyleName("common");
    }
  };
  V.on("theme:change", function(i) {
    n.value || (t.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var r = Pt(e.config, function(i, u) {
    ot.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = Pt(function() {
    return e.config.ripple;
  }, function(i, u) {
    ot.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = Pt(function() {
    return e.config.theme;
  }, function(i, u) {
    n.value || O.setTheme(i), e.config.unstyled || o(), n.value = !1, ot.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = Pt(function() {
    return e.config.unstyled;
  }, function(i, u) {
    !i && e.config.theme && o(), ot.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  _t.push(r), _t.push(a), _t.push(l), _t.push(s);
}
var ti = {
  install: function(e, n) {
    var o = ir(qr, n);
    Qr(e, o);
  }
}, On = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = _n();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function ei(t, e, n, o, r, a) {
  return a.inline ? X(t.$slots, "default", {
    key: 0
  }) : r.mounted ? (L(), St(sn, {
    key: 1,
    to: n.appendTo
  }, [X(t.$slots, "default")], 8, ["to"])) : G("", !0);
}
On.render = ei;
var nt = {
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
function ni() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", e = uo();
  return "".concat(t).concat(e.replace("v-", "").replaceAll("-", "_"));
}
var Ue = A.extend({
  name: "common"
});
function Nt(t) {
  "@babel/helpers - typeof";
  return Nt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Nt(t);
}
function oi(t) {
  return En(t) || ri(t) || An(t) || Tn();
}
function ri(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function kt(t, e) {
  return En(t) || ii(t, e) || An(t, e) || Tn();
}
function Tn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function An(t, e) {
  if (t) {
    if (typeof t == "string") return se(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? se(t, e) : void 0;
  }
}
function se(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function ii(t, e) {
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
function En(t) {
  if (Array.isArray(t)) return t;
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
function $(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? We(Object(n), !0).forEach(function(o) {
      Ct(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : We(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Ct(t, e, n) {
  return (e = ai(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ai(t) {
  var e = si(t, "string");
  return Nt(e) == "symbol" ? e : e + "";
}
function si(t, e) {
  if (Nt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Nt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Zt = {
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
        V.off("theme:change", this._loadCoreStyles), e || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(e, n) {
        var o = this;
        V.off("theme:change", this._themeScopedListener), e ? (this._loadScopedThemeStyles(e), this._themeScopedListener = function() {
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
    var e, n, o, r, a, l, s, i, u, d, c, p = (e = this.pt) === null || e === void 0 ? void 0 : e._usept, f = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, h = p ? (o = this.pt) === null || o === void 0 || (o = o.value) === null || o === void 0 ? void 0 : o[this.$.type.name] : this.pt;
    (r = h || f) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (a = r.onBeforeCreate) === null || a === void 0 || a.call(r);
    var v = (l = this.$primevueConfig) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l._usept, b = v ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, g = v ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = g || b) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = ni(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var e;
    this.rootEl = fr(Ft(this.$el) ? this.$el : (e = this.$el) === null || e === void 0 ? void 0 : e.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
      return he(e) ? e.apply(void 0, o) : R.apply(void 0, o);
    },
    _load: function() {
      nt.isStyleNameLoaded("base") || (A.loadCSS(this.$styleOptions), this._loadGlobalStyles(), nt.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var e, n;
      !nt.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name && (Ue.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), nt.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var e = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      T(e) && A.load(e, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var e, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!O.isStyleNameLoaded("common")) {
          var o, r, a = ((o = this.$style) === null || o === void 0 || (r = o.getCommonTheme) === null || r === void 0 ? void 0 : r.call(o)) || {}, l = a.primitive, s = a.semantic, i = a.global, u = a.style;
          A.load(l?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), A.load(s?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), A.load(i?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), A.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), O.setLoadedStyleName("common");
        }
        if (!O.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, p, f, h = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, v = h.css, b = h.style;
          (p = this.$style) === null || p === void 0 || p.load(v, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (f = this.$style) === null || f === void 0 || f.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), b), O.setLoadedStyleName(this.$style.name);
        }
        if (!O.isStyleNameLoaded("layer-order")) {
          var g, w, P = (g = this.$style) === null || g === void 0 || (w = g.getLayerOrderThemeCSS) === null || w === void 0 ? void 0 : w.call(g);
          A.load(P, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), O.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(e) {
      var n, o, r, a = ((n = this.$style) === null || n === void 0 || (o = n.getPresetTheme) === null || o === void 0 ? void 0 : o.call(n, e, "[".concat(this.$attrSelector, "]"))) || {}, l = a.css, s = (r = this.$style) === null || r === void 0 ? void 0 : r.load(l, $({
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
      nt.clearLoadedStyleNames(), V.on("theme:change", e);
    },
    _removeThemeListeners: function() {
      V.off("theme:change", this._loadCoreStyles), V.off("theme:change", this._load), V.off("theme:change", this._themeScopedListener);
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
      return me(e, n, o);
    },
    _getPTValue: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, l = /./g.test(o) && !!r[o.split(".")[0]], s = this._getPropValue("ptOptions") || ((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, d = s.mergeProps, c = d === void 0 ? !1 : d, p = a ? l ? this._useGlobalPT(this._getPTClassValue, o, r) : this._useDefaultPT(this._getPTClassValue, o, r) : void 0, f = l ? void 0 : this._getPTSelf(n, this._getPTClassValue, o, $($({}, r), {}, {
        global: p || {}
      })), h = this._getPTDatasets(o);
      return u || !u && f ? c ? this._mergeProps(c, p, f, h) : $($($({}, p), f), h) : $($({}, f), h);
    },
    _getPTSelf: function() {
      for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return R(
        this._usePT.apply(this, [this._getPT(e, this.$name)].concat(o)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(o))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", a = o === "root" && T((e = this.pt) === null || e === void 0 ? void 0 : e["data-pc-section"]);
      return o !== "transition" && $($({}, o === "root" && $($(Ct({}, "".concat(r, "name"), q(a ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), a && Ct({}, "".concat(r, "extend"), q(this.$.type.name))), {}, Ct({}, "".concat(this.$attrSelector), ""))), {}, Ct({}, "".concat(r, "section"), q(o)));
    },
    _getPTClassValue: function() {
      var e = this._getOptionValue.apply(this, arguments);
      return F(e) || vn(e) ? {
        class: e
      } : e;
    },
    _getPT: function(e) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, a = function(s) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(s) : s, c = q(o), p = q(n.$name);
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
        return p === void 0 && f === void 0 ? void 0 : F(f) ? f : F(p) ? p : u || !u && f ? c ? this._mergeProps(c, p, f) : $($({}, p), f) : f;
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
      return this._getPTValue(this.pt, e, $($({}, this.$params), n));
    },
    ptmi: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = R(this.$_attrsWithoutPT, this.ptm(n, o));
      return r?.hasOwnProperty("id") && ((e = r.id) !== null && e !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(e, n, $({
        instance: this
      }, o), !1);
    },
    cx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, e, $($({}, this.$params), n));
    },
    sx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, e, $($({}, this.$params), o)), a = this._getOptionValue(Ue.inlineStyles, e, $($({}, this.$params), o));
        return [a, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return B(o, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return n._getOptionValue(o, n.$name, $({}, n.$params)) || B(o, $({}, n.$params));
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
      return $($({
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
        var o = kt(n, 2), r = o[0], a = o[1], l = r.split(":"), s = oi(l), i = se(s).slice(1);
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
}, li = `
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
`, ui = A.extend({
  name: "baseicon",
  css: li
});
function jt(t) {
  "@babel/helpers - typeof";
  return jt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, jt(t);
}
function He(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Ke(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? He(Object(n), !0).forEach(function(o) {
      di(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : He(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function di(t, e, n) {
  return (e = ci(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ci(t) {
  var e = pi(t, "string");
  return jt(e) == "symbol" ? e : e + "";
}
function pi(t, e) {
  if (jt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (jt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var fi = {
  name: "BaseIcon",
  extends: Zt,
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
  style: ui,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var e = pt(this.label);
      return Ke(Ke({}, !this.isUnstyled && {
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
function Lt(t) {
  "@babel/helpers - typeof";
  return Lt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Lt(t);
}
function Ye(t, e) {
  return vi(t) || bi(t, e) || mi(t, e) || hi();
}
function hi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function mi(t, e) {
  if (t) {
    if (typeof t == "string") return Ge(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ge(t, e) : void 0;
  }
}
function Ge(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function bi(t, e) {
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
function vi(t) {
  if (Array.isArray(t)) return t;
}
function qe(t, e) {
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
    e % 2 ? qe(Object(n), !0).forEach(function(o) {
      le(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : qe(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function le(t, e, n) {
  return (e = gi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function gi(t) {
  var e = yi(t, "string");
  return Lt(e) == "symbol" ? e : e + "";
}
function yi(t, e) {
  if (Lt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Lt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var _ = {
  _getMeta: function() {
    return [J(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], B(J(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(e, n) {
    var o, r, a;
    return (o = (e == null || (r = e.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (a = n.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || o === void 0 ? void 0 : o.config;
  },
  _getOptionValue: me,
  _getPTValue: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var w = _._getOptionValue.apply(_, arguments);
      return F(w) || vn(w) ? {
        class: w
      } : w;
    }, u = ((e = o.binding) === null || e === void 0 || (e = e.value) === null || e === void 0 ? void 0 : e.ptOptions) || ((n = o.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, p = u.mergeProps, f = p === void 0 ? !1 : p, h = s ? _._useDefaultPT(o, o.defaultPT(), i, a, l) : void 0, v = _._usePT(o, _._getPT(r, o.$name), i, a, k(k({}, l), {}, {
      global: h || {}
    })), b = _._getPTDatasets(o, a);
    return c || !c && v ? f ? _._mergeProps(o, f, h, v, b) : k(k(k({}, h), v), b) : k(k({}, v), b);
  },
  _getPTDatasets: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = "data-pc-";
    return k(k({}, n === "root" && le({}, "".concat(o, "name"), q(e.$name))), {}, le({}, "".concat(o, "section"), q(n)));
  },
  _getPT: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(l) {
      var s, i = o ? o(l) : l, u = q(n);
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
      var s, i = n._usept || ((s = e.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, u = i.mergeSections, d = u === void 0 ? !0 : u, c = i.mergeProps, p = c === void 0 ? !1 : c, f = l(n.originalValue), h = l(n.value);
      return f === void 0 && h === void 0 ? void 0 : F(h) ? h : F(f) ? f : d || !d && h ? p ? _._mergeProps(e, p, f, h) : k(k({}, f), h) : h;
    }
    return l(n);
  },
  _useDefaultPT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return _._usePT(e, n, o, r, a);
  },
  _loadStyles: function() {
    var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, a = _._getConfig(o, r), l = {
      nonce: a == null || (e = a.csp) === null || e === void 0 ? void 0 : e.nonce
    };
    _._loadCoreStyles(n, l), _._loadThemeStyles(n, l), _._loadScopedThemeStyles(n, l), _._removeThemeListeners(n), n.$loadStyles = function() {
      return _._loadThemeStyles(n, l);
    }, _._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!nt.isStyleNameLoaded((e = o.$style) === null || e === void 0 ? void 0 : e.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
      var a;
      A.loadCSS(r), (a = o.$style) === null || a === void 0 || a.loadCSS(r), nt.setLoadedStyleName(o.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var e, n, o, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (e = r.theme) === null || e === void 0 ? void 0 : e.call(r)) === "none")) {
      if (!O.isStyleNameLoaded("common")) {
        var l, s, i = ((l = r.$style) === null || l === void 0 || (s = l.getCommonTheme) === null || s === void 0 ? void 0 : s.call(l)) || {}, u = i.primitive, d = i.semantic, c = i.global, p = i.style;
        A.load(u?.css, k({
          name: "primitive-variables"
        }, a)), A.load(d?.css, k({
          name: "semantic-variables"
        }, a)), A.load(c?.css, k({
          name: "global-variables"
        }, a)), A.loadStyle(k({
          name: "global-style"
        }, a), p), O.setLoadedStyleName("common");
      }
      if (!O.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (o = r.$style) !== null && o !== void 0 && o.name) {
        var f, h, v, b, g = ((f = r.$style) === null || f === void 0 || (h = f.getDirectiveTheme) === null || h === void 0 ? void 0 : h.call(f)) || {}, w = g.css, P = g.style;
        (v = r.$style) === null || v === void 0 || v.load(w, k({
          name: "".concat(r.$style.name, "-variables")
        }, a)), (b = r.$style) === null || b === void 0 || b.loadStyle(k({
          name: "".concat(r.$style.name, "-style")
        }, a), P), O.setLoadedStyleName(r.$style.name);
      }
      if (!O.isStyleNameLoaded("layer-order")) {
        var m, S, j = (m = r.$style) === null || m === void 0 || (S = m.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(m);
        A.load(j, k({
          name: "layer-order",
          first: !0
        }, a)), O.setLoadedStyleName("layer-order");
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
    nt.clearLoadedStyleNames(), V.on("theme:change", e);
  },
  _removeThemeListeners: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    V.off("theme:change", e.$loadStyles), e.$loadStyles = void 0;
  },
  _hook: function(e, n, o, r, a, l) {
    var s, i, u = "on".concat(ar(n)), d = _._getConfig(r, a), c = o?.$instance, p = _._usePT(c, _._getPT(r == null || (s = r.value) === null || s === void 0 ? void 0 : s.pt, e), _._getOptionValue, "hooks.".concat(u)), f = _._useDefaultPT(c, d == null || (i = d.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[e], _._getOptionValue, "hooks.".concat(u)), h = {
      el: o,
      binding: r,
      vnode: a,
      prevVnode: l
    };
    p?.(c, h), f?.(c, h);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      o[r - 2] = arguments[r];
    return he(e) ? e.apply(void 0, o) : R.apply(void 0, o);
  },
  _extend: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = function(s, i, u, d, c) {
      var p, f, h, v;
      i._$instances = i._$instances || {};
      var b = _._getConfig(u, d), g = i._$instances[e] || {}, w = pt(g) ? k(k({}, n), n?.methods) : {};
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
          return _._getPT(b?.pt, void 0, function(m) {
            var S;
            return m == null || (S = m.directives) === null || S === void 0 ? void 0 : S[e];
          });
        },
        isUnstyled: function() {
          var m, S;
          return ((m = i._$instances[e]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.unstyled) !== void 0 ? (S = i._$instances[e]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : b?.unstyled;
        },
        theme: function() {
          var m;
          return (m = i._$instances[e]) === null || m === void 0 || (m = m.$primevueConfig) === null || m === void 0 ? void 0 : m.theme;
        },
        preset: function() {
          var m;
          return (m = i._$instances[e]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.dt;
        },
        /* instance's methods */
        ptm: function() {
          var m, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return _._getPTValue(i._$instances[e], (m = i._$instances[e]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.pt, S, k({}, j));
        },
        ptmo: function() {
          var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", j = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return _._getPTValue(i._$instances[e], m, S, j, !1);
        },
        cx: function() {
          var m, S, j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", C = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (m = i._$instances[e]) !== null && m !== void 0 && m.isUnstyled() ? void 0 : _._getOptionValue((S = i._$instances[e]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, j, k({}, C));
        },
        sx: function() {
          var m, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", j = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, C = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return j ? _._getOptionValue((m = i._$instances[e]) === null || m === void 0 || (m = m.$style) === null || m === void 0 ? void 0 : m.inlineStyles, S, k({}, C)) : void 0;
        }
      }, w), i.$instance = i._$instances[e], (f = (h = i.$instance)[s]) === null || f === void 0 || f.call(h, i, u, d, c), i["$".concat(e)] = i.$instance, _._hook(e, s, i, u, d, c), i.$pd || (i.$pd = {}), i.$pd[e] = k(k({}, (v = i.$pd) === null || v === void 0 ? void 0 : v[e]), {}, {
        name: e,
        instance: i._$instances[e]
      });
    }, r = function(s) {
      var i, u, d, c = s._$instances[e], p = c?.watch, f = function(b) {
        var g, w = b.newValue, P = b.oldValue;
        return p == null || (g = p.config) === null || g === void 0 ? void 0 : g.call(c, w, P);
      }, h = function(b) {
        var g, w = b.newValue, P = b.oldValue;
        return p == null || (g = p["config.ripple"]) === null || g === void 0 ? void 0 : g.call(c, w, P);
      };
      c.$watchersCallback = {
        config: f,
        "config.ripple": h
      }, p == null || (i = p.config) === null || i === void 0 || i.call(c, c?.$primevueConfig), ot.on("config:change", f), p == null || (u = p["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), ot.on("config:ripple:change", h);
    }, a = function(s) {
      var i = s._$instances[e].$watchersCallback;
      i && (ot.off("config:change", i.config), ot.off("config:ripple:change", i["config.ripple"]), s._$instances[e].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, u, d) {
        s.$pd || (s.$pd = {}), s.$pd[e] = {
          name: e,
          attrSelector: gr("pd")
        }, o("created", s, i, u, d);
      },
      beforeMount: function(s, i, u, d) {
        var c;
        _._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("beforeMount", s, i, u, d), r(s);
      },
      mounted: function(s, i, u, d) {
        var c;
        _._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("mounted", s, i, u, d);
      },
      beforeUpdate: function(s, i, u, d) {
        o("beforeUpdate", s, i, u, d);
      },
      updated: function(s, i, u, d) {
        var c;
        _._loadStyles((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance, i, u), o("updated", s, i, u, d);
      },
      beforeUnmount: function(s, i, u, d) {
        var c;
        a(s), _._removeThemeListeners((c = s.$pd[e]) === null || c === void 0 ? void 0 : c.instance), o("beforeUnmount", s, i, u, d);
      },
      unmounted: function(s, i, u, d) {
        var c;
        (c = s.$pd[e]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), o("unmounted", s, i, u, d);
      }
    };
  },
  extend: function() {
    var e = _._getMeta.apply(_, arguments), n = Ye(e, 2), o = n[0], r = n[1];
    return k({
      extend: function() {
        var l = _._getMeta.apply(_, arguments), s = Ye(l, 2), i = s[0], u = s[1];
        return _.extend(i, k(k(k({}, r), r?.methods), u));
      }
    }, _._extend(o, r));
  }
}, _i = `
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
`, Si = {
  root: "p-ink"
}, $i = A.extend({
  name: "ripple-directive",
  style: _i,
  classes: Si
}), wi = _.extend({
  style: $i
});
function Vt(t) {
  "@babel/helpers - typeof";
  return Vt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Vt(t);
}
function ki(t) {
  return Oi(t) || xi(t) || Ci(t) || Pi();
}
function Pi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ci(t, e) {
  if (t) {
    if (typeof t == "string") return ue(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ue(t, e) : void 0;
  }
}
function xi(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Oi(t) {
  if (Array.isArray(t)) return ue(t);
}
function ue(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Je(t, e, n) {
  return (e = Ti(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ti(t) {
  var e = Ai(t, "string");
  return Vt(e) == "symbol" ? e : e + "";
}
function Ai(t, e) {
  if (Vt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Vt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Ei = wi.extend("ripple", {
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
      n || (n = pr("span", Je(Je({
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
        if (!this.isUnstyled() && ne(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Te(r) && !Ae(r)) {
          var a = Math.max(ur(o), br(o));
          r.style.height = a + "px", r.style.width = a + "px";
        }
        var l = mr(o), s = e.pageX - l.left + document.body.scrollTop - Ae(r) / 2, i = e.pageY - l.top + document.body.scrollLeft - Te(r) / 2;
        r.style.top = i + "px", r.style.left = s + "px", !this.isUnstyled() && lr(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && ne(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(e) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && ne(e.currentTarget, "p-ink-active"), e.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(e) {
      return e && e.children ? ki(e.children).find(function(n) {
        return hr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const Ni = "data-wippy-overlay-layer";
function Nn() {
  return typeof window < "u" && typeof window.document < "u";
}
function jn() {
  return Nn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ji() {
  return jn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Li = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Vi = 0;
const Jt = /* @__PURE__ */ new WeakMap();
function Qe(t, e) {
  const n = t.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", e), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ii(t, e) {
  if (!Li.test(t.className))
    return;
  const n = t.style.cssText;
  Qe(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = n;
    return;
  }
  if (!Jt.has(t)) {
    const o = new MutationObserver(() => {
      const r = t.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && Qe(t, e);
    });
    o.observe(t, { attributes: !0, attributeFilter: ["style"] }), Jt.set(t, o);
  }
}
function be(t) {
  const e = Jt.get(t);
  e && (e.disconnect(), Jt.delete(t));
}
function Ri(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function de(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const Qt = /* @__PURE__ */ new Set(), ve = /* @__PURE__ */ new WeakMap();
let Ze = !1, ce = !1;
function Di() {
  ce = !1;
  for (const t of Qt) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && be(e);
      Qt.delete(t), ve.get(t)?.disconnect();
      continue;
    }
    t.childElementCount > 0 && de(t);
  }
}
function Xe() {
  ce || (ce = !0, requestAnimationFrame(Di));
}
function Mi(t) {
  const e = document.createElement("div");
  e.setAttribute(Ni, "");
  const n = jn();
  if (e.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && e.setAttribute("popover", "manual"), t.appendChild(e), n) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  de(e);
  const o = new MutationObserver((r) => {
    const a = e.__wippyAnchorName;
    for (const l of r) {
      if (a)
        for (const s of Array.from(l.addedNodes))
          s instanceof HTMLElement && Ii(s, a);
      for (const s of Array.from(l.removedNodes))
        s instanceof HTMLElement && be(s);
    }
    e.isConnected && e.childElementCount > 0 && de(e);
  });
  return o.observe(e, { childList: !0 }), ve.set(e, o), Qt.add(e), Ze || (Ze = !0, window.addEventListener("scroll", Xe, { capture: !0, passive: !0 }), window.addEventListener("resize", Xe, { passive: !0 })), e;
}
function tn(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = Mi(t.hostRoot), ji())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++Vi}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function en(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && be(e);
    Qt.delete(t.layer), ve.get(t.layer)?.disconnect(), t.layer.remove(), t.layer = null;
  }
}
let nn = !1;
function Fi() {
  if (nn)
    return;
  nn = !0;
  const t = On;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    Nn() && (this.hostRoot = Ri(this.$el), this.mounted = !0, this.hostRoot && (this.inline || tn(this), this.$watch("inline", (e) => {
      e ? en(this) : tn(this);
    })));
  }, t.render = function() {
    return this.inline ? X(this.$slots, "default", { key: 0 }) : this.mounted ? co(sn, { key: 1, to: this.resolvedTarget || document.body }, [
      X(this.$slots, "default")
    ]) : G("", !0);
  }, t.unmounted = function() {
    en(this);
  };
}
const Bi = {
  install: (t) => {
    Fi(), t.use(ti, { theme: "none" });
  }
};
var Ln = {
  name: "SpinnerIcon",
  extends: fi
};
function zi(t) {
  return Ki(t) || Hi(t) || Wi(t) || Ui();
}
function Ui() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Wi(t, e) {
  if (t) {
    if (typeof t == "string") return pe(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? pe(t, e) : void 0;
  }
}
function Hi(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ki(t) {
  if (Array.isArray(t)) return pe(t);
}
function pe(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Yi(t, e, n, o, r, a) {
  return L(), U("svg", R({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), zi(e[0] || (e[0] = [M("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ln.render = Yi;
var Gi = `
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
`, qi = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": T(n.value) && String(n.value).length === 1,
      "p-badge-dot": pt(n.value) && !o.$slots.default,
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
}, Ji = A.extend({
  name: "badge",
  style: Gi,
  classes: qi
}), Qi = {
  name: "BaseBadge",
  extends: Zt,
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
  style: Ji,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
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
function on(t, e, n) {
  return (e = Zi(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Zi(t) {
  var e = Xi(t, "string");
  return It(e) == "symbol" ? e : e + "";
}
function Xi(t, e) {
  if (It(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (It(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Vn = {
  name: "Badge",
  extends: Qi,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return $t(on(on({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, ta = ["data-p"];
function ea(t, e, n, o, r, a) {
  return L(), U("span", R({
    class: t.cx("root"),
    "data-p": a.dataP
  }, t.ptmi("root")), [X(t.$slots, "default", {}, function() {
    return [ln(fe(t.value), 1)];
  })], 16, ta);
}
Vn.render = ea;
var na = `
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
function Rt(t) {
  "@babel/helpers - typeof";
  return Rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Rt(t);
}
function Y(t, e, n) {
  return (e = oa(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function oa(t) {
  var e = ra(t, "string");
  return Rt(e) == "symbol" ? e : e + "";
}
function ra(t, e) {
  if (Rt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Rt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ia = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", Y(Y(Y(Y(Y(Y(Y(Y(Y({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", Y({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, aa = A.extend({
  name: "button",
  style: na,
  classes: ia
}), sa = {
  name: "BaseButton",
  extends: Zt,
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
  style: aa,
  provide: function() {
    return {
      $pcButton: this,
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
function D(t, e, n) {
  return (e = la(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function la(t) {
  var e = ua(t, "string");
  return Dt(e) == "symbol" ? e : e + "";
}
function ua(t, e) {
  if (Dt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Dt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var yt = {
  name: "Button",
  extends: sa,
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
      return R(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return pt(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return $t(D(D(D(D(D(D(D(D(D(D({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return $t(D(D({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return $t(D(D({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Ln,
    Badge: Vn
  },
  directives: {
    ripple: Ei
  }
}, da = ["data-p"], ca = ["data-p"];
function pa(t, e, n, o, r, a) {
  var l = Se("SpinnerIcon"), s = Se("Badge"), i = po("ripple");
  return t.asChild ? X(t.$slots, "default", {
    key: 1,
    class: $e(t.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : fo((L(), St(un(t.as), R({
    key: 0,
    class: t.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: ho(function() {
      return [X(t.$slots, "default", {}, function() {
        return [t.loading ? X(t.$slots, "loadingicon", R({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (L(), U("span", R({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (L(), St(l, R({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : X(t.$slots, "icon", R({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (L(), U("span", R({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": a.dataIconP
          }, t.ptm("icon")), null, 16, da)) : G("", !0)];
        }), t.label ? (L(), U("span", R({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": a.dataLabelP
        }), fe(t.label), 17, ca)) : G("", !0), t.badge ? (L(), St(s, {
          key: 3,
          value: t.badge,
          class: $e(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : G("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[i]]);
}
yt.render = pa;
var fa = {
  name: "BaseEditableHolder",
  extends: Zt,
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
}, ha = {
  name: "BaseInput",
  extends: fa,
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
}, ma = `
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
`, ba = {
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
}, va = A.extend({
  name: "inputtext",
  style: ma,
  classes: ba
}), ga = {
  name: "BaseInputText",
  extends: ha,
  style: va,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Mt(t) {
  "@babel/helpers - typeof";
  return Mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Mt(t);
}
function ya(t, e, n) {
  return (e = _a(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function _a(t) {
  var e = Sa(t, "string");
  return Mt(e) == "symbol" ? e : e + "";
}
function Sa(t, e) {
  if (Mt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var In = {
  name: "InputText",
  extends: ga,
  inheritAttrs: !1,
  methods: {
    onInput: function(e) {
      this.writeValue(e.target.value, e);
    }
  },
  computed: {
    attrs: function() {
      return R(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return $t(ya({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, $a = ["value", "name", "disabled", "aria-invalid", "data-p"];
function wa(t, e, n, o, r, a) {
  return L(), U("input", R({
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
  }, a.attrs), null, 16, $a);
}
In.render = wa;
const ka = { class: "onboarding" }, Pa = {
  key: 0,
  role: "status"
}, Ca = {
  key: 0,
  "aria-label": "Configure a model"
}, xa = ["disabled"], Oa = { class: "capabilities" }, Ta = ["value"], Aa = ["open"], Ea = {
  key: 0,
  class: "hint"
}, Na = ["value"], ja = {
  key: 1,
  class: "error",
  role: "alert"
}, La = { class: "actions" }, Va = "My Assistant", Ia = /* @__PURE__ */ mo({
  __name: "Onboarding",
  setup(t) {
    const e = Qo(), n = ["kickside.agents.traits:trait_master", "kickside.agents.traits:artifacts", "kickside.uploads.traits:file_manager"], o = N(Va), r = N(""), a = N({ traits: [...n], trait_contexts: { "kickside.agents.traits:trait_master": { inject_trait_catalog: !0 } } }), l = N(!0), s = N(!1), i = N(!1), u = N(""), d = N(""), c = N([]), p = N([]), f = Xt(() => p.value.includes("class:fast")), h = N(!1), v = Xt(() => r.value ? c.value.includes(r.value) || p.value.includes(r.value) : f.value), b = Xt(() => s.value && !l.value && !i.value && !!o.value.trim() && v.value);
    function g(C) {
      const y = C;
      return y?.response?.data?.error || y?.message || String(C);
    }
    function w(C) {
      const y = C.detail;
      a.value = { traits: [...y.traits], trait_contexts: { ...y.trait_contexts } };
    }
    async function P() {
      l.value = !0, s.value = !1, u.value = "";
      try {
        await Promise.all([
          te("wc-model-picker", { timeoutMs: 8e3 }),
          te("wc-agent-trait-picker", { timeoutMs: 8e3 })
        ]);
        const [C, y] = await Promise.all([
          Ut.get("/api/v1/models/list?capability=generate"),
          Ut.get("/api/v1/models/classes")
        ]);
        if (C.data?.success !== !0 || y.data?.success !== !0) throw new Error("Could not check model configuration.");
        c.value = C.data.models.map((x) => x.name), p.value = y.data.classes.filter((x) => x.models.length > 0 && c.value.includes(x.models[0].name)).map((x) => `class:${x.name}`), s.value = !0;
      } catch (C) {
        u.value = g(C);
      } finally {
        l.value = !1;
      }
    }
    async function m() {
      u.value = "";
      try {
        await te("kickside-onboard-models", { timeoutMs: 8e3 }), h.value = !0;
      } catch (C) {
        u.value = g(C);
      }
    }
    async function S() {
      h.value = !1, await P();
    }
    async function j() {
      if (b.value) {
        i.value = !0, u.value = "";
        try {
          if (!d.value) {
            const x = { title: o.value.trim() };
            r.value && (x.model = r.value), a.value.traits.length && (x.traits = [...a.value.traits], x.trait_contexts = { ...a.value.trait_contexts });
            const { data: z } = await Ut.post("/api/v1/user-agents", x);
            if (z?.success !== !0 || !z.component_id) throw new Error(z?.error || "Could not create your agent.");
            d.value = z.component_id;
          }
          const { data: C } = await Ut.get("/api/v1/agents/list");
          if (C?.success !== !0) throw new Error(C?.error || "Could not open your agent.");
          const y = C.agents.find((x) => x.name === `user_agent:${d.value}`);
          if (!y?.start_token) throw new Error("Your agent is created. Chat is unavailable; retry to open it.");
          e("navigate", { path: "/sessions", startToken: y.start_token });
        } catch (C) {
          u.value = g(C);
        } finally {
          i.value = !1;
        }
      }
    }
    return an(P), (C, y) => (L(), U("div", ka, [
      y[9] || (y[9] = M("div", { class: "onboarding-intro" }, [
        M("p", null, "Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.")
      ], -1)),
      l.value ? (L(), U("p", Pa, "Loading your choices…")) : (L(), U("form", {
        key: 1,
        class: "onboarding-form",
        onSubmit: bo(j, ["prevent"])
      }, [
        v.value ? G("", !0) : (L(), U("section", Ca, [
          y[4] || (y[4] = M("h3", null, "Configure a model", -1)),
          y[5] || (y[5] = M("p", null, "Connect a generation model before creating your agent. Ask an administrator to configure one if you do not have model settings access.", -1)),
          wt(ut(yt), {
            type: "button",
            label: "Configure a model",
            onClick: m
          }),
          wt(ut(yt), {
            type: "button",
            label: "Check model configuration",
            onClick: P
          }),
          h.value ? (L(), St(un("kickside-onboard-models"), {
            key: 0,
            onDone: S,
            onBack: y[0] || (y[0] = (x) => h.value = !1)
          }, null, 32)) : G("", !0)
        ])),
        M("fieldset", {
          disabled: i.value || !!d.value || !s.value
        }, [
          y[8] || (y[8] = M("label", { for: "first-agent-title" }, "Agent name", -1)),
          wt(ut(In), {
            id: "first-agent-title",
            modelValue: o.value,
            "onUpdate:modelValue": y[1] || (y[1] = (x) => o.value = x),
            name: "title",
            autocomplete: "off",
            maxlength: "120"
          }, null, 8, ["modelValue"]),
          M("div", Oa, [
            M("wc-agent-trait-picker", {
              value: JSON.stringify(a.value),
              "aria-label": "Agent capabilities",
              onChange: w
            }, null, 40, Ta)
          ]),
          M("details", {
            open: !f.value
          }, [
            M("summary", null, [
              y[6] || (y[6] = ln("Choose a model ", -1)),
              f.value ? (L(), U("span", Ea, "(optional)")) : G("", !0)
            ]),
            y[7] || (y[7] = M("p", { class: "hint" }, "Choose a configured model, or use the platform default when one is available.", -1)),
            M("wc-model-picker", {
              value: r.value,
              capability: "generate",
              "aria-label": "Agent model",
              onSelect: y[2] || (y[2] = (x) => r.value = x.detail)
            }, null, 40, Na)
          ], 8, Aa)
        ], 8, xa),
        u.value ? (L(), U("p", ja, fe(u.value), 1)) : G("", !0),
        s.value ? G("", !0) : (L(), St(ut(yt), {
          key: 2,
          type: "button",
          label: "Retry loading choices",
          onClick: P
        })),
        M("div", La, [
          wt(ut(yt), {
            type: "button",
            "data-dismiss": "",
            label: "Skip for now",
            severity: "secondary",
            disabled: i.value,
            onClick: y[3] || (y[3] = (x) => ut(e)("done", { status: "skipped" }))
          }, null, 8, ["disabled"]),
          wt(ut(yt), {
            type: "submit",
            label: i.value ? "Creating…" : d.value ? "Open agent chat" : "Create agent",
            disabled: !b.value
          }, null, 8, ["label", "disabled"])
        ])
      ], 32))
    ]));
  }
}), Ra = ":host{display:block;min-width:0;color:var(--p-text-color)}.onboarding{box-sizing:border-box;width:100%}.onboarding-intro{margin-bottom:16px}.onboarding-intro p{margin:0}p{line-height:1.5}.onboarding-form{display:grid;gap:16px}fieldset{border:0;padding:0;margin:0;display:grid;gap:10px;min-width:0}label{font-weight:600}summary:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}.hint{color:var(--p-text-muted-color);font-size:.9rem;margin:0 0 8px}.capabilities{border:1px solid var(--p-content-border-color);border-radius:14px;padding:14px;display:grid;gap:12px}details{margin-top:8px}summary{cursor:pointer;padding:8px 0}.error{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-600, var(--p-danger-500)) 8%,transparent);border-radius:10px;padding:12px;margin:0}.actions{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;margin-top:8px}", Da = { props: { type: "object", properties: {} } }, Ma = {
  wippy: Da
};
class Rn extends Zo {
  static get wippyConfig() {
    return { propsSchema: Ma.wippy.props, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: Ra };
  }
  static get vueConfig() {
    return { rootComponent: Ia, plugins: [Bi] };
  }
}
async function Ua() {
  return Rn;
}
wo(import.meta.url, Rn);
export {
  Ua as webComponent
};
