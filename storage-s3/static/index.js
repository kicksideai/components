import { hasInjectionContext as dr, inject as cr, effectScope as pr, ref as W, markRaw as fr, createApp as hr, readonly as mr, getCurrentInstance as cn, onMounted as oo, nextTick as gr, watch as ze, reactive as br, renderSlot as T, openBlock as S, createBlock as H, Teleport as ro, createCommentVNode as F, useId as vr, mergeProps as v, h as yr, createElementBlock as O, createElementVNode as j, createTextVNode as Fe, toDisplayString as oe, resolveComponent as Q, resolveDirective as Jt, withDirectives as Qt, resolveDynamicComponent as mt, withCtx as pe, normalizeClass as _e, Fragment as Ie, renderList as xt, createVNode as re, Transition as io, normalizeProps as Sr, createSlots as wr, withModifiers as so, defineComponent as $r, computed as pn, unref as de } from "vue";
import { addCollection as Or } from "@iconify/vue";
import { config as fn, addIcons as kr, on as Cr, applyThemeMode as lt, host as _r, hostCss as Ir, loadCss as Pr, api as ut, define as xr } from "@wippy-fe/proxy";
var Tt = "data-wippy-visible";
function hn(t) {
  const e = t.getAttribute(Tt);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Tr = Object.defineProperty, Lr = (t, e, n) => e in t ? Tr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, N = (t, e, n) => Lr(t, typeof e != "symbol" ? e + "" : e, n), Ar = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Er = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function mn(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Vr(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    if (n)
      for (const [o, r] of Object.entries(n)) {
        if ((o === "@light" || o === "@dark") && r && typeof r == "object") {
          for (const [a, l] of Object.entries(r)) {
            const s = typeof l == "string" ? mn(a) : null;
            s && e.add(s);
          }
          continue;
        }
        const i = typeof r == "string" ? mn(o) : null;
        i && e.add(i);
      }
  return [...e].sort();
}
function zr(t) {
  if (t.length === 0)
    return "";
  const e = t.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Er} {
${e}
}`;
}
function jr(t, e) {
  const n = zr(e);
  n && ao(t, n, "@wippy-fe/css-variables-bridge");
}
function Fr(t, e) {
  const o = (e ?? Ar).map(async (r) => {
    const i = Ir[r];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Pr(i);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${i}):`, a), null;
    }
  });
  return Promise.all(o).then((r) => {
    for (const i of r) {
      if (!i)
        continue;
      const a = document.createElement("style");
      a.textContent = i, a.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(a);
    }
  });
}
function Nr(t, e) {
  const n = document.createElement("style");
  n.textContent = e, t.appendChild(n);
}
function ao(t, e, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, r];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", n), o.textContent = e, t.appendChild(o);
}
function Mr(t, e) {
  ao(t, e, "@wippy-fe/custom-css");
}
function lo(t) {
  return t.__wippyHost ?? null;
}
function Dr(t) {
  return t.replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function Rr(t, e, n) {
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
function kt(t, e) {
  const n = {}, o = [];
  for (const [r, i] of Object.entries(e.properties)) {
    const a = t.getAttribute(r), l = Dr(r);
    if (a === null) {
      i.default !== void 0 && (n[l] = i.default);
      continue;
    }
    const s = Rr(r, a, i);
    s.error ? o.push(s.error) : n[l] = s.value;
  }
  return { props: n, errors: o };
}
var Br = class {
  constructor(t, e) {
    N(this, "_props"), N(this, "_errors"), N(this, "_content"), N(this, "_hostVisibility"), N(this, "_propsListeners", /* @__PURE__ */ new Set()), N(this, "_contentListeners", /* @__PURE__ */ new Set()), N(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), N(this, "_disposed", !1), N(this, "_emitToDom"), N(this, "props"), N(this, "events"), N(this, "content"), N(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
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
}, Hr = class extends HTMLElement {
  constructor() {
    super(), N(this, "_internals"), N(this, "_contentObserver", null), N(this, "_initialized", !1), N(this, "_container", null), N(this, "_reactive", null), N(this, "_lastProps", null), N(this, "_lastErrors", []), N(this, "_lastContent", null), N(this, "_themeUnsub", null), N(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = hn(this);
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
    return [.../* @__PURE__ */ new Set([...e, ...n, Tt])];
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
    return lo(this);
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
        const i = kt(this, t.propsSchema);
        t.validateProps && i.errors.push(...t.validateProps(i.props)), n = i.props, o = i.errors, this._lastProps = n, this._lastErrors = o;
      }
      const r = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = r), this._reactive = new Br(
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
        this.onInit(n), t.inlineCss && Nr(n, t.inlineCss);
        try {
          const u = fn?.theming, d = Vr(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          jr(n, d);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const u = fn?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && Mr(n, d);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && Fr(n, t.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const s = t.containerClasses ?? [];
        s.length > 0 && o.classList.add(...s), n.appendChild(o), this._container = o, kr(Or);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Cr("@theme", (s) => this._applyTheme(s)));
      const { props: r, errors: i } = kt(this, t.propsSchema);
      t.validateProps && i.push(...t.validateProps(r));
      const a = r;
      this._lastProps = a, this._lastErrors = i;
      let l = null;
      t.contentTemplate && (l = this._extractContent(t.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const s = this._extractContent(t.contentTemplate);
        this._lastContent = s, this._reactive?.notifyContent(s), this.onContentChanged(s);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, o, a, i, l, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(t = _r.getThemeMode?.()) {
    lt(t, this), this._container && lt(t, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), lt("auto", this), this._container && lt("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(t, e, n) {
    if (e === n)
      return;
    if (t === Tt) {
      const l = this._hostVisible, s = hn(this);
      if (s === l)
        return;
      this._hostVisible = s, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(s, l), this.onHostVisibilityChanged(s, l));
      return;
    }
    const o = this.constructor.wippyConfig, { props: r, errors: i } = kt(this, o.propsSchema);
    o.validateProps && i.push(...o.validateProps(r));
    const a = r;
    this._lastProps = a, this._lastErrors = i, this._reactive?.notifyProps(a, i), this.onPropsChanged(a, i);
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
function Kr(t) {
  return t.__wippyHostBus ?? null;
}
function Ur(t) {
  return t.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.1.0
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let uo;
const co = (t) => uo = t, Wr = () => dr() && cr(po) || uo, po = (
  /* istanbul ignore next */
  Symbol()
);
function Gr() {
  const t = pr(!0), e = t.run(() => W({}));
  let n = [], o = [];
  const r = fr({
    install(i) {
      co(r), r._a = i, i.provide(po, r), i.config.globalProperties.$pinia = r, o.forEach((a) => n.push(a)), o = [];
    },
    use(i) {
      return this._a ? n.push(i) : o.push(i), this;
    },
    _p: n,
    _a: null,
    _e: t,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return r;
}
var qr = Object.defineProperty, Yr = (t, e, n) => e in t ? qr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ae = (t, e, n) => Yr(t, typeof e != "symbol" ? e + "" : e, n), Zr = /* @__PURE__ */ Symbol("wippy:emit"), Jr = /* @__PURE__ */ Symbol("wippy:props"), Qr = /* @__PURE__ */ Symbol("wippy:props_error"), Xr = /* @__PURE__ */ Symbol("wippy:content"), ei = /* @__PURE__ */ Symbol("wippy:panel-id"), ti = /* @__PURE__ */ Symbol("wippy:layout-bus"), ni = /* @__PURE__ */ Symbol("wippy:host"), oi = /* @__PURE__ */ Symbol("wippy:host-visibility"), ri = class extends Hr {
  constructor() {
    super(...arguments), Ae(this, "_vueApp", null), Ae(this, "_propsRef", W({})), Ae(this, "_errorsRef", W([])), Ae(this, "_contentRef", W(null)), Ae(this, "_hostVisibilityRef", W(null)), Ae(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(t, e, n, o, r, i) {
    const a = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = o, this._contentRef.value = r ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of o)
      this.emitEvent("invalid", { message: u });
    const l = new AbortController();
    this._bridgeAbort = l, this.reactive.props.subscribe((u, d) => {
      this._propsRef.value = u, this._errorsRef.value = [...d];
      for (const c of d)
        this.emitEvent("invalid", { message: c });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: l.signal });
    const s = (u) => {
      if (l.signal.aborted)
        return;
      const d = Wr(), c = hr(u.rootComponent);
      this._vueApp = c;
      const p = Gr();
      if (u.piniaPlugins)
        for (const f of u.piniaPlugins)
          p.use(f);
      if (c.use(p), u.plugins)
        for (const f of u.plugins)
          c.use(f);
      c.provide(Jr, this._propsRef), c.provide(Qr, this._errorsRef), c.provide(Zr, this.emitEvent.bind(this)), c.provide(Xr, this._contentRef), c.provide(oi, this._hostVisibilityRef), c.provide(ei, Ur(this)), c.provide(ti, Kr(this)), c.provide(ni, lo(this)), u.providers && u.providers(c, this), c.mount(e), d && co(d);
    };
    if (a.rootComponent)
      s(a);
    else if (a.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), e.appendChild(u), a.lazyConfig().then((d) => {
        l.signal.aborted || (u.remove(), s(d));
      }).catch((d) => {
        if (l.signal.aborted)
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
}, ii = Object.defineProperty, gn = Object.getOwnPropertySymbols, si = Object.prototype.hasOwnProperty, ai = Object.prototype.propertyIsEnumerable, bn = (t, e, n) => e in t ? ii(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, li = (t, e) => {
  for (var n in e || (e = {})) si.call(e, n) && bn(t, n, e[n]);
  if (gn) for (var n of gn(e)) ai.call(e, n) && bn(t, n, e[n]);
  return t;
};
function Te(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0 || !(t instanceof Date) && typeof t == "object" && Object.keys(t).length === 0;
}
function Lt(t, e, n = /* @__PURE__ */ new WeakSet()) {
  if (t === e) return !0;
  if (!t || !e || typeof t != "object" || typeof e != "object" || n.has(t) || n.has(e)) return !1;
  n.add(t).add(e);
  let o = Array.isArray(t), r = Array.isArray(e), i, a, l;
  if (o && r) {
    if (a = t.length, a != e.length) return !1;
    for (i = a; i-- !== 0; ) if (!Lt(t[i], e[i], n)) return !1;
    return !0;
  }
  if (o != r) return !1;
  let s = t instanceof Date, u = e instanceof Date;
  if (s != u) return !1;
  if (s && u) return t.getTime() == e.getTime();
  let d = t instanceof RegExp, c = e instanceof RegExp;
  if (d != c) return !1;
  if (d && c) return t.toString() == e.toString();
  let p = Object.keys(t);
  if (a = p.length, a !== Object.keys(e).length) return !1;
  for (i = a; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(e, p[i])) return !1;
  for (i = a; i-- !== 0; ) if (l = p[i], !Lt(t[l], e[l], n)) return !1;
  return !0;
}
function ui(t, e) {
  return Lt(t, e);
}
function wt(t) {
  return typeof t == "function" && "call" in t && "apply" in t;
}
function x(t) {
  return !Te(t);
}
function be(t, e) {
  if (!t || !e) return null;
  try {
    let n = t[e];
    if (x(n)) return n;
  } catch {
  }
  if (Object.keys(t).length) {
    if (wt(e)) return e(t);
    if (e.indexOf(".") === -1) return t[e];
    {
      let n = e.split("."), o = t;
      for (let r = 0, i = n.length; r < i; ++r) {
        if (o == null) return null;
        o = o[n[r]];
      }
      return o;
    }
  }
  return null;
}
function fo(t, e, n) {
  return n ? be(t, n) === be(e, n) : ui(t, e);
}
function he(t, e = !0) {
  return t instanceof Object && t.constructor === Object && (e || Object.keys(t).length !== 0);
}
function ho(t = {}, e = {}) {
  let n = li({}, t);
  return Object.keys(e).forEach((o) => {
    let r = o;
    he(e[r]) && r in t && he(t[r]) ? n[r] = ho(t[r], e[r]) : n[r] = e[r];
  }), n;
}
function di(...t) {
  return t.reduce((e, n, o) => o === 0 ? n : ho(e, n), {});
}
function vn(t, e) {
  let n = -1;
  if (x(t)) try {
    n = t.findLastIndex(e);
  } catch {
    n = t.lastIndexOf([...t].reverse().find(e));
  }
  return n;
}
function X(t, ...e) {
  return wt(t) ? t(...e) : t;
}
function Y(t, e = !0) {
  return typeof t == "string" && (e || t !== "");
}
function fe(t) {
  return Y(t) ? t.replace(/(-|_)/g, "").toLowerCase() : t;
}
function Xt(t, e = "", n = {}) {
  let o = fe(e).split("."), r = o.shift();
  if (r) {
    if (he(t)) {
      let i = Object.keys(t).find((a) => fe(a) === r) || "";
      return Xt(X(t[i], n), o.join("."), n);
    }
    return;
  }
  return X(t, n);
}
function mo(t, e = !0) {
  return Array.isArray(t) && (e || t.length !== 0);
}
function ci(t) {
  return x(t) && !isNaN(t);
}
function pi(t = "") {
  return x(t) && t.length === 1 && !!t.match(/\S| /);
}
function Pe(t, e) {
  if (e) {
    let n = e.test(t);
    return e.lastIndex = 0, n;
  }
  return !1;
}
function fi(...t) {
  return di(...t);
}
function He(t) {
  return t && t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function ne(t) {
  if (t && /[\xC0-\xFF\u0100-\u017E]/.test(t)) {
    let e = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in e) t = t.replace(e[n], n);
  }
  return t;
}
function hi(t) {
  return Y(t, !1) ? t[0].toUpperCase() + t.slice(1) : t;
}
function go(t) {
  return Y(t) ? t.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : t;
}
function en() {
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
function ae(...t) {
  if (t) {
    let e = [];
    for (let n = 0; n < t.length; n++) {
      let o = t[n];
      if (!o) continue;
      let r = typeof o;
      if (r === "string" || r === "number") e.push(o);
      else if (r === "object") {
        let i = Array.isArray(o) ? [ae(...o)] : Object.entries(o).map(([a, l]) => l ? a : void 0);
        e = i.length ? e.concat(i.filter((a) => !!a)) : e;
      }
    }
    return e.join(" ").trim();
  }
}
function mi(t, e) {
  return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function gi(t, e) {
  if (t && e) {
    let n = (o) => {
      mi(t, o) || (t.classList ? t.classList.add(o) : t.className += " " + o);
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function Ct(t, e) {
  if (t && e) {
    let n = (o) => {
      t.classList ? t.classList.remove(o) : t.className = t.className.replace(new RegExp("(^|\\b)" + o.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function At(t) {
  for (let e of document?.styleSheets) try {
    for (let n of e?.cssRules) for (let o of n?.style) if (t.test(o)) return { name: o, value: n.style.getPropertyValue(o).trim() };
  } catch {
  }
  return null;
}
function bo(t) {
  let e = { width: 0, height: 0 };
  if (t) {
    let [n, o] = [t.style.visibility, t.style.display], r = t.getBoundingClientRect();
    t.style.visibility = "hidden", t.style.display = "block", e.width = r.width || t.offsetWidth, e.height = r.height || t.offsetHeight, t.style.display = o, t.style.visibility = n;
  }
  return e;
}
function vo() {
  let t = window, e = document, n = e.documentElement, o = e.getElementsByTagName("body")[0], r = t.innerWidth || n.clientWidth || o.clientWidth, i = t.innerHeight || n.clientHeight || o.clientHeight;
  return { width: r, height: i };
}
function Et(t) {
  return t ? Math.abs(t.scrollLeft) : 0;
}
function bi() {
  let t = document.documentElement;
  return (window.pageXOffset || Et(t)) - (t.clientLeft || 0);
}
function vi() {
  let t = document.documentElement;
  return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
}
function yi(t) {
  return t ? getComputedStyle(t).direction === "rtl" : !1;
}
function Si(t, e, n = !0) {
  var o, r, i, a;
  if (t) {
    let l = t.offsetParent ? { width: t.offsetWidth, height: t.offsetHeight } : bo(t), s = l.height, u = l.width, d = e.offsetHeight, c = e.offsetWidth, p = e.getBoundingClientRect(), f = vi(), h = bi(), g = vo(), m, y, w = "top";
    p.top + d + s > g.height ? (m = p.top + f - s, w = "bottom", m < 0 && (m = f)) : m = d + p.top + f, p.left + u > g.width ? y = Math.max(0, p.left + h + c - u) : y = p.left + h, yi(t) ? t.style.insetInlineEnd = y + "px" : t.style.insetInlineStart = y + "px", t.style.top = m + "px", t.style.transformOrigin = w, n && (t.style.marginTop = w === "bottom" ? `calc(${(r = (o = At(/-anchor-gutter$/)) == null ? void 0 : o.value) != null ? r : "2px"} * -1)` : (a = (i = At(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? a : "");
  }
}
function wi(t, e) {
  t && (typeof e == "string" ? t.style.cssText = e : Object.entries(e || {}).forEach(([n, o]) => t.style[n] = o));
}
function yo(t, e) {
  return t instanceof HTMLElement ? t.offsetWidth : 0;
}
function $i(t, e, n = !0, o = void 0) {
  var r;
  if (t) {
    let i = t.offsetParent ? { width: t.offsetWidth, height: t.offsetHeight } : bo(t), a = e.offsetHeight, l = e.getBoundingClientRect(), s = vo(), u, d, c = o ?? "top";
    if (!o && l.top + a + i.height > s.height ? (u = -1 * i.height, c = "bottom", l.top + u < 0 && (u = -1 * l.top)) : u = a, i.width > s.width ? d = l.left * -1 : l.left + i.width > s.width ? d = (l.left + i.width - s.width) * -1 : d = 0, t.style.top = u + "px", t.style.insetInlineStart = d + "px", t.style.transformOrigin = c, n) {
      let p = (r = At(/-anchor-gutter$/)) == null ? void 0 : r.value;
      t.style.marginTop = c === "bottom" ? `calc(${p ?? "2px"} * -1)` : p ?? "";
    }
  }
}
function So(t) {
  if (t) {
    let e = t.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function Oi(t) {
  return !!(t !== null && typeof t < "u" && t.nodeName && So(t));
}
function Ne(t) {
  return typeof Element < "u" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function gt(t, e = {}) {
  if (Ne(t)) {
    let n = (o, r) => {
      var i, a;
      let l = (i = t?.$attrs) != null && i[o] ? [(a = t?.$attrs) == null ? void 0 : a[o]] : [];
      return [r].flat().reduce((s, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") s.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(o, u) : Object.entries(u).map(([p, f]) => o === "style" && (f || f === 0) ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}` : f ? p : void 0);
            s = c.length ? s.concat(c.filter((p) => !!p)) : s;
          }
        }
        return s;
      }, l);
    };
    Object.entries(e).forEach(([o, r]) => {
      if (r != null) {
        let i = o.match(/^on(.+)/);
        i ? t.addEventListener(i[1].toLowerCase(), r) : o === "p-bind" || o === "pBind" ? gt(t, r) : (r = o === "class" ? [...new Set(n("class", r))].join(" ").trim() : o === "style" ? n("style", r).join(";").trim() : r, (t.$attrs = t.$attrs || {}) && (t.$attrs[o] = r), t.setAttribute(o, r));
      }
    });
  }
}
function ki(t, e = {}, ...n) {
  {
    let o = document.createElement(t);
    return gt(o, e), o.append(...n), o;
  }
}
function Ci(t, e) {
  return Ne(t) ? Array.from(t.querySelectorAll(e)) : [];
}
function $t(t, e) {
  return Ne(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function me(t, e) {
  t && document.activeElement !== t && t.focus(e);
}
function _i(t, e) {
  if (Ne(t)) {
    let n = t.getAttribute(e);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function tn(t, e = "") {
  let n = Ci(t, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), o = [];
  for (let r of n) getComputedStyle(r).display != "none" && getComputedStyle(r).visibility != "hidden" && o.push(r);
  return o;
}
function Ii(t, e) {
  let n = tn(t, e);
  return n.length > 0 ? n[0] : null;
}
function ke(t) {
  if (t) {
    let e = t.offsetHeight, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), e;
  }
  return 0;
}
function Pi(t, e) {
  let n = tn(t, e);
  return n.length > 0 ? n[n.length - 1] : null;
}
function xi(t) {
  if (t) {
    let e = t.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || Et(document.documentElement) || Et(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Ti(t, e) {
  return t ? t.offsetHeight : 0;
}
function wo(t, e = []) {
  let n = So(t);
  return n === null ? e : wo(n, e.concat([n]));
}
function Li(t) {
  let e = [];
  if (t) {
    let n = wo(t), o = /(auto|scroll)/, r = (i) => {
      try {
        let a = window.getComputedStyle(i, null);
        return o.test(a.getPropertyValue("overflow")) || o.test(a.getPropertyValue("overflowX")) || o.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let i of n) {
      let a = i.nodeType === 1 && i.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let s of l) {
          let u = $t(i, s);
          u && r(u) && e.push(u);
        }
      }
      i.nodeType !== 9 && r(i) && e.push(i);
    }
  }
  return e;
}
function Ce(t) {
  if (t) {
    let e = t.offsetWidth, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), e;
  }
  return 0;
}
function Ai() {
  return /(android)/i.test(navigator.userAgent);
}
function $o() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function bt(t) {
  return !!(t && t.offsetParent != null);
}
function Ei() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Vi(t, e = "", n) {
  Ne(t) && n !== null && n !== void 0 && t.setAttribute(e, n);
}
var dt = {};
function zi(t = "pui_id_") {
  return Object.hasOwn(dt, t) || (dt[t] = 0), dt[t]++, `${t}${dt[t]}`;
}
function ji() {
  let t = [], e = (a, l, s = 999) => {
    let u = r(a, l, s), d = u.value + (u.key === a ? 0 : s) + 1;
    return t.push({ key: a, value: d }), d;
  }, n = (a) => {
    t = t.filter((l) => l.value !== a);
  }, o = (a, l) => r(a).value, r = (a, l, s = 0) => [...t].reverse().find((u) => !0) || { key: a, value: s }, i = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: i, set: (a, l, s) => {
    l && (l.style.zIndex = String(e(a, !0, s)));
  }, clear: (a) => {
    a && (n(i(a)), a.style.zIndex = "");
  }, getCurrent: (a) => o(a) };
}
var _t = ji(), Fi = Object.defineProperty, Ni = Object.defineProperties, Mi = Object.getOwnPropertyDescriptors, vt = Object.getOwnPropertySymbols, Oo = Object.prototype.hasOwnProperty, ko = Object.prototype.propertyIsEnumerable, yn = (t, e, n) => e in t ? Fi(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, se = (t, e) => {
  for (var n in e || (e = {})) Oo.call(e, n) && yn(t, n, e[n]);
  if (vt) for (var n of vt(e)) ko.call(e, n) && yn(t, n, e[n]);
  return t;
}, It = (t, e) => Ni(t, Mi(e)), ge = (t, e) => {
  var n = {};
  for (var o in t) Oo.call(t, o) && e.indexOf(o) < 0 && (n[o] = t[o]);
  if (t != null && vt) for (var o of vt(t)) e.indexOf(o) < 0 && ko.call(t, o) && (n[o] = t[o]);
  return n;
}, Di = en(), K = Di, Ke = /{([^}]*)}/g, Co = /(\d+\s+[\+\-\*\/]\s+\d+)/g, _o = /var\([^)]+\)/g;
function Sn(t) {
  return Y(t) ? t.replace(/[A-Z]/g, (e, n) => n === 0 ? e : "." + e.toLowerCase()).toLowerCase() : t;
}
function Ri(t) {
  return he(t) && t.hasOwnProperty("$value") && t.hasOwnProperty("$type") ? t.$value : t;
}
function Bi(t) {
  return t.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Vt(t = "", e = "") {
  return Bi(`${Y(t, !1) && Y(e, !1) ? `${t}-` : t}${e}`);
}
function Io(t = "", e = "") {
  return `--${Vt(t, e)}`;
}
function Hi(t = "") {
  let e = (t.match(/{/g) || []).length, n = (t.match(/}/g) || []).length;
  return (e + n) % 2 !== 0;
}
function Po(t, e = "", n = "", o = [], r) {
  if (Y(t)) {
    let i = t.trim();
    if (Hi(i)) return;
    if (Pe(i, Ke)) {
      let a = i.replaceAll(Ke, (l) => {
        let s = l.replace(/{|}/g, "").split(".").filter((u) => !o.some((d) => Pe(u, d)));
        return `var(${Io(n, go(s.join("-")))}${x(r) ? `, ${r}` : ""})`;
      });
      return Pe(a.replace(_o, "0"), Co) ? `calc(${a})` : a;
    }
    return i;
  } else if (ci(t)) return t;
}
function Ki(t, e, n) {
  Y(e, !1) && t.push(`${e}:${n};`);
}
function Ee(t, e) {
  return t ? `${t}{${e}}` : "";
}
function xo(t, e) {
  if (t.indexOf("dt(") === -1) return t;
  function n(a, l) {
    let s = [], u = 0, d = "", c = null, p = 0;
    for (; u <= a.length; ) {
      let f = a[u];
      if ((f === '"' || f === "'" || f === "`") && a[u - 1] !== "\\" && (c = c === f ? null : f), !c && (f === "(" && p++, f === ")" && p--, (f === "," || u === a.length) && p === 0)) {
        let h = d.trim();
        h.startsWith("dt(") ? s.push(xo(h, l)) : s.push(o(h)), d = "", u++;
        continue;
      }
      f !== void 0 && (d += f), u++;
    }
    return s;
  }
  function o(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let s = Number(a);
    return isNaN(s) ? a : s;
  }
  let r = [], i = [];
  for (let a = 0; a < t.length; a++) if (t[a] === "d" && t.slice(a, a + 3) === "dt(") i.push(a), a += 2;
  else if (t[a] === ")" && i.length > 0) {
    let l = i.pop();
    i.length === 0 && r.push([l, a]);
  }
  if (!r.length) return t;
  for (let a = r.length - 1; a >= 0; a--) {
    let [l, s] = r[a], u = t.slice(l + 3, s), d = n(u, e), c = e(...d);
    t = t.slice(0, l) + c + t.slice(s + 1);
  }
  return t;
}
var xe = (...t) => Ui(V.getTheme(), ...t), Ui = (t = {}, e, n, o) => {
  if (e) {
    let { variable: r, options: i } = V.defaults || {}, { prefix: a, transform: l } = t?.options || i || {}, s = Pe(e, Ke) ? e : `{${e}}`;
    return o === "value" || Te(o) && l === "strict" ? V.getTokenValue(e) : Po(s, void 0, a, [r.excludedKeyRegex], n);
  }
  return "";
};
function ct(t, ...e) {
  if (t instanceof Array) {
    let n = t.reduce((o, r, i) => {
      var a;
      return o + r + ((a = X(e[i], { dt: xe })) != null ? a : "");
    }, "");
    return xo(n, xe);
  }
  return X(t, { dt: xe });
}
function Wi(t, e = {}) {
  let n = V.defaults.variable, { prefix: o = n.prefix, selector: r = n.selector, excludedKeyRegex: i = n.excludedKeyRegex } = e, a = [], l = [], s = [{ node: t, path: o }];
  for (; s.length; ) {
    let { node: d, path: c } = s.pop();
    for (let p in d) {
      let f = d[p], h = Ri(f), g = Pe(p, i) ? Vt(c) : Vt(c, go(p));
      if (he(h)) s.push({ node: h, path: g });
      else {
        let m = Io(g), y = Po(h, g, o, [i]);
        Ki(l, m, y);
        let w = g;
        o && w.startsWith(o + "-") && (w = w.slice(o.length + 1)), a.push(w.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: Ee(r, u) };
}
var ie = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(t) {
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
  return Wi(t, { prefix: e?.prefix });
}, getCommon({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var i, a, l, s, u, d, c;
  let { preset: p, options: f } = e, h, g, m, y, w, C, b;
  if (x(p) && f.transform !== "strict") {
    let { primitive: $, semantic: A, extend: _ } = p, L = A || {}, { colorScheme: D } = L, R = ge(L, ["colorScheme"]), z = _ || {}, { colorScheme: M } = z, Z = ge(z, ["colorScheme"]), J = D || {}, { dark: B } = J, G = ge(J, ["dark"]), ee = M || {}, { dark: ve } = ee, le = ge(ee, ["dark"]), te = x($) ? this._toVariables({ primitive: $ }, f) : {}, ue = x(R) ? this._toVariables({ semantic: R }, f) : {}, $e = x(G) ? this._toVariables({ light: G }, f) : {}, at = x(B) ? this._toVariables({ dark: B }, f) : {}, Le = x(Z) ? this._toVariables({ semantic: Z }, f) : {}, un = x(le) ? this._toVariables({ light: le }, f) : {}, dn = x(ve) ? this._toVariables({ dark: ve }, f) : {}, [Wo, Go] = [(i = te.declarations) != null ? i : "", te.tokens], [qo, Yo] = [(a = ue.declarations) != null ? a : "", ue.tokens || []], [Zo, Jo] = [(l = $e.declarations) != null ? l : "", $e.tokens || []], [Qo, Xo] = [(s = at.declarations) != null ? s : "", at.tokens || []], [er, tr] = [(u = Le.declarations) != null ? u : "", Le.tokens || []], [nr, or] = [(d = un.declarations) != null ? d : "", un.tokens || []], [rr, ir] = [(c = dn.declarations) != null ? c : "", dn.tokens || []];
    h = this.transformCSS(t, Wo, "light", "variable", f, o, r), g = Go;
    let sr = this.transformCSS(t, `${qo}${Zo}`, "light", "variable", f, o, r), ar = this.transformCSS(t, `${Qo}`, "dark", "variable", f, o, r);
    m = `${sr}${ar}`, y = [.../* @__PURE__ */ new Set([...Yo, ...Jo, ...Xo])];
    let lr = this.transformCSS(t, `${er}${nr}color-scheme:light`, "light", "variable", f, o, r), ur = this.transformCSS(t, `${rr}color-scheme:dark`, "dark", "variable", f, o, r);
    w = `${lr}${ur}`, C = [.../* @__PURE__ */ new Set([...tr, ...or, ...ir])], b = X(p.css, { dt: xe });
  }
  return { primitive: { css: h, tokens: g }, semantic: { css: m, tokens: y }, global: { css: w, tokens: C }, style: b };
}, getPreset({ name: t = "", preset: e = {}, options: n, params: o, set: r, defaults: i, selector: a }) {
  var l, s, u;
  let d, c, p;
  if (x(e) && n.transform !== "strict") {
    let f = t.replace("-directive", ""), h = e, { colorScheme: g, extend: m, css: y } = h, w = ge(h, ["colorScheme", "extend", "css"]), C = m || {}, { colorScheme: b } = C, $ = ge(C, ["colorScheme"]), A = g || {}, { dark: _ } = A, L = ge(A, ["dark"]), D = b || {}, { dark: R } = D, z = ge(D, ["dark"]), M = x(w) ? this._toVariables({ [f]: se(se({}, w), $) }, n) : {}, Z = x(L) ? this._toVariables({ [f]: se(se({}, L), z) }, n) : {}, J = x(_) ? this._toVariables({ [f]: se(se({}, _), R) }, n) : {}, [B, G] = [(l = M.declarations) != null ? l : "", M.tokens || []], [ee, ve] = [(s = Z.declarations) != null ? s : "", Z.tokens || []], [le, te] = [(u = J.declarations) != null ? u : "", J.tokens || []], ue = this.transformCSS(f, `${B}${ee}`, "light", "variable", n, r, i, a), $e = this.transformCSS(f, le, "dark", "variable", n, r, i, a);
    d = `${ue}${$e}`, c = [.../* @__PURE__ */ new Set([...G, ...ve, ...te])], p = X(y, { dt: xe });
  }
  return { css: d, tokens: c, style: p };
}, getPresetC({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var i;
  let { preset: a, options: l } = e, s = (i = a?.components) == null ? void 0 : i[t];
  return this.getPreset({ name: t, preset: s, options: l, params: n, set: o, defaults: r });
}, getPresetD({ name: t = "", theme: e = {}, params: n, set: o, defaults: r }) {
  var i, a;
  let l = t.replace("-directive", ""), { preset: s, options: u } = e, d = ((i = s?.components) == null ? void 0 : i[l]) || ((a = s?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: d, options: u, params: n, set: o, defaults: r });
}, applyDarkColorScheme(t) {
  return !(t.darkModeSelector === "none" || t.darkModeSelector === !1);
}, getColorSchemeOption(t, e) {
  var n;
  return this.applyDarkColorScheme(t) ? this.regex.resolve(t.darkModeSelector === !0 ? e.options.darkModeSelector : (n = t.darkModeSelector) != null ? n : e.options.darkModeSelector) : [];
}, getLayerOrder(t, e = {}, n, o) {
  let { cssLayer: r } = e;
  return r ? `@layer ${X(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: i }) {
  let a = this.getCommon({ name: t, theme: e, params: n, set: r, defaults: i }), l = Object.entries(o).reduce((s, [u, d]) => s.push(`${u}="${d}"`) && s, []).join(" ");
  return Object.entries(a || {}).reduce((s, [u, d]) => {
    if (he(d) && Object.hasOwn(d, "css")) {
      let c = He(d.css), p = `${u}-variables`;
      s.push(`<style type="text/css" data-primevue-style-id="${p}" ${l}>${c}</style>`);
    }
    return s;
  }, []).join("");
}, getStyleSheet({ name: t = "", theme: e = {}, params: n, props: o = {}, set: r, defaults: i }) {
  var a;
  let l = { name: t, theme: e, params: n, set: r, defaults: i }, s = (a = t.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(o).reduce((d, [c, p]) => d.push(`${c}="${p}"`) && d, []).join(" ");
  return s ? `<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${He(s)}</style>` : "";
}, createTokens(t = {}, e, n = "", o = "", r = {}) {
  let i = function(l, s = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: s, value: void 0 };
    u.push(this.path), s.name = this.path, s.binding || (s.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && Ke.test(this.value)) {
      let c = this.value.trim().replace(Ke, (p) => {
        var f;
        let h = p.slice(1, -1), g = this.tokens[h];
        if (!g) return console.warn(`Token not found for path: ${h}`), "__UNRESOLVED__";
        let m = g.computed(l, s, u);
        return Array.isArray(m) && m.length === 2 ? `light-dark(${m[0].value},${m[1].value})` : (f = m?.value) != null ? f : "__UNRESOLVED__";
      });
      d = Co.test(c.replace(_o, "0")) ? `calc(${c})` : c;
    }
    return Te(s.binding) && delete s.binding, u.pop(), { colorScheme: l, path: this.path, paths: s, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (l, s, u) => {
    Object.entries(l).forEach(([d, c]) => {
      let p = Pe(d, e.variable.excludedKeyRegex) ? s : s ? `${s}.${Sn(d)}` : Sn(d), f = u ? `${u}.${d}` : d;
      he(c) ? a(c, p, f) : (r[p] || (r[p] = { paths: [], computed: (h, g = {}, m = []) => {
        if (r[p].paths.length === 1) return r[p].paths[0].computed(r[p].paths[0].scheme, g.binding, m);
        if (h && h !== "none") for (let y = 0; y < r[p].paths.length; y++) {
          let w = r[p].paths[y];
          if (w.scheme === h) return w.computed(h, g.binding, m);
        }
        return r[p].paths.map((y) => y.computed(y.scheme, g[y.scheme], m));
      } }), r[p].paths.push({ path: f, value: c, scheme: f.includes("colorScheme.light") ? "light" : f.includes("colorScheme.dark") ? "dark" : "none", computed: i, tokens: r }));
    });
  };
  return a(t, n, o), r;
}, getTokenValue(t, e, n) {
  var o;
  let r = ((l) => l.split(".").filter((s) => !Pe(s.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(e), i = e.includes("colorScheme.light") ? "light" : e.includes("colorScheme.dark") ? "dark" : void 0, a = [(o = t[r]) == null ? void 0 : o.computed(i)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, s) => {
    let u = s, { colorScheme: d } = u, c = ge(u, ["colorScheme"]);
    return l[d] = c, l;
  }, void 0);
}, getSelectorRule(t, e, n, o) {
  return n === "class" || n === "attr" ? Ee(x(e) ? `${t}${e},${t} ${e}` : t, o) : Ee(t, Ee(e ?? ":root,:host", o));
}, transformCSS(t, e, n, o, r = {}, i, a, l) {
  if (x(e)) {
    let { cssLayer: s } = r;
    if (o !== "style") {
      let u = this.getColorSchemeOption(r, a);
      e = n === "dark" ? u.reduce((d, { type: c, selector: p }) => (x(p) && (d += p.includes("[CSS]") ? p.replace("[CSS]", e) : this.getSelectorRule(p, l, c, e)), d), "") : Ee(l ?? ":root,:host", e);
    }
    if (s) {
      let u = { name: "primeui" };
      he(s) && (u.name = X(s.name, { name: t, type: o })), x(u.name) && (e = Ee(`@layer ${u.name}`, e), i?.layerNames(u.name));
    }
    return e;
  }
  return "";
} }, V = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(t = {}) {
  let { theme: e } = t;
  e && (this._theme = It(se({}, e), { options: se(se({}, this.defaults.options), e.options) }), this._tokens = ie.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: t }), K.emit("theme:change", t);
}, getPreset() {
  return this.preset;
}, setPreset(t) {
  this._theme = It(se({}, this.theme), { preset: t }), this._tokens = ie.createTokens(t, this.defaults), this.clearLoadedStyleNames(), K.emit("preset:change", t), K.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(t) {
  this._theme = It(se({}, this.theme), { options: t }), this.clearLoadedStyleNames(), K.emit("options:change", t), K.emit("theme:change", this.theme);
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
  return ie.getTokenValue(this.tokens, t, this.defaults);
}, getCommon(t = "", e) {
  return ie.getCommon({ name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ie.getPresetC(n);
}, getDirective(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ie.getPresetD(n);
}, getCustomPreset(t = "", e, n, o) {
  let r = { name: t, preset: e, options: this.options, selector: n, params: o, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return ie.getPreset(r);
}, getLayerOrderCSS(t = "") {
  return ie.getLayerOrder(t, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(t = "", e, n = "style", o) {
  return ie.transformCSS(t, e, o, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(t = "", e, n = {}) {
  return ie.getCommonStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(t, e, n = {}) {
  return ie.getStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(t) {
  this._loadingStyles.add(t);
}, onStyleUpdated(t) {
  this._loadingStyles.add(t);
}, onStyleLoaded(t, { name: e }) {
  this._loadingStyles.size && (this._loadingStyles.delete(e), K.emit(`theme:${e}:load`, t), !this._loadingStyles.size && K.emit("theme:load"));
} }, U = {
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
};
function wn(t, e) {
  var n = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!n) {
    if (Array.isArray(t) || (n = Gi(t)) || e) {
      n && (t = n);
      var o = 0, r = function() {
      };
      return { s: r, n: function() {
        return o >= t.length ? { done: !0 } : { done: !1, value: t[o++] };
      }, e: function(u) {
        throw u;
      }, f: r };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var i, a = !0, l = !1;
  return { s: function() {
    n = n.call(t);
  }, n: function() {
    var u = n.next();
    return a = u.done, u;
  }, e: function(u) {
    l = !0, i = u;
  }, f: function() {
    try {
      a || n.return == null || n.return();
    } finally {
      if (l) throw i;
    }
  } };
}
function Gi(t, e) {
  if (t) {
    if (typeof t == "string") return $n(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? $n(t, e) : void 0;
  }
}
function $n(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
var qi = {
  filter: function(e, n, o, r, i) {
    var a = [];
    if (!e)
      return a;
    var l = wn(e), s;
    try {
      for (l.s(); !(s = l.n()).done; ) {
        var u = s.value;
        if (typeof u == "string") {
          if (this.filters[r](u, o, i)) {
            a.push(u);
            continue;
          }
        } else {
          var d = wn(n), c;
          try {
            for (d.s(); !(c = d.n()).done; ) {
              var p = c.value, f = be(u, p);
              if (this.filters[r](f, o, i)) {
                a.push(u);
                break;
              }
            }
          } catch (h) {
            d.e(h);
          } finally {
            d.f();
          }
        }
      }
    } catch (h) {
      l.e(h);
    } finally {
      l.f();
    }
    return a;
  },
  filters: {
    startsWith: function(e, n, o) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var r = ne(n.toString()).toLocaleLowerCase(o), i = ne(e.toString()).toLocaleLowerCase(o);
      return i.slice(0, r.length) === r;
    },
    contains: function(e, n, o) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var r = ne(n.toString()).toLocaleLowerCase(o), i = ne(e.toString()).toLocaleLowerCase(o);
      return i.indexOf(r) !== -1;
    },
    notContains: function(e, n, o) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var r = ne(n.toString()).toLocaleLowerCase(o), i = ne(e.toString()).toLocaleLowerCase(o);
      return i.indexOf(r) === -1;
    },
    endsWith: function(e, n, o) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var r = ne(n.toString()).toLocaleLowerCase(o), i = ne(e.toString()).toLocaleLowerCase(o);
      return i.indexOf(r, i.length - r.length) !== -1;
    },
    equals: function(e, n, o) {
      return n == null || n === "" ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() === n.getTime() : ne(e.toString()).toLocaleLowerCase(o) == ne(n.toString()).toLocaleLowerCase(o);
    },
    notEquals: function(e, n, o) {
      return n == null || n === "" ? !1 : e == null ? !0 : e.getTime && n.getTime ? e.getTime() !== n.getTime() : ne(e.toString()).toLocaleLowerCase(o) != ne(n.toString()).toLocaleLowerCase(o);
    },
    in: function(e, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var o = 0; o < n.length; o++)
        if (fo(e, n[o]))
          return !0;
      return !1;
    },
    between: function(e, n) {
      return n == null || n[0] == null || n[1] == null ? !0 : e == null ? !1 : e.getTime ? n[0].getTime() <= e.getTime() && e.getTime() <= n[1].getTime() : n[0] <= e && e <= n[1];
    },
    lt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() < n.getTime() : e < n;
    },
    lte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() <= n.getTime() : e <= n;
    },
    gt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() > n.getTime() : e > n;
    },
    gte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() >= n.getTime() : e >= n;
    },
    dateIs: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() === n.toDateString());
    },
    dateIsNot: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() !== n.toDateString());
    },
    dateBefore: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() < n.getTime());
    },
    dateAfter: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() > n.getTime());
    }
  },
  register: function(e, n) {
    this.filters[e] = n;
  }
}, Yi = `
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
function Ue(t) {
  "@babel/helpers - typeof";
  return Ue = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ue(t);
}
function On(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function kn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? On(Object(n), !0).forEach(function(o) {
      Zi(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : On(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Zi(t, e, n) {
  return (e = Ji(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ji(t) {
  var e = Qi(t, "string");
  return Ue(e) == "symbol" ? e : e + "";
}
function Qi(t, e) {
  if (Ue(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ue(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Xi(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  cn() && cn().components ? oo(t) : e ? t() : gr(t);
}
var es = 0;
function ts(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = W(!1), o = W(t), r = W(null), i = $o() ? window.document : void 0, a = e.document, l = a === void 0 ? i : a, s = e.immediate, u = s === void 0 ? !0 : s, d = e.manual, c = d === void 0 ? !1 : d, p = e.name, f = p === void 0 ? "style_".concat(++es) : p, h = e.id, g = h === void 0 ? void 0 : h, m = e.media, y = m === void 0 ? void 0 : m, w = e.nonce, C = w === void 0 ? void 0 : w, b = e.first, $ = b === void 0 ? !1 : b, A = e.onMounted, _ = A === void 0 ? void 0 : A, L = e.onUpdated, D = L === void 0 ? void 0 : L, R = e.onLoad, z = R === void 0 ? void 0 : R, M = e.props, Z = M === void 0 ? {} : M, J = function() {
  }, B = function(ve) {
    var le = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var te = kn(kn({}, Z), le), ue = te.name || f, $e = te.id || g, at = te.nonce || C;
      r.value = l.querySelector('style[data-primevue-style-id="'.concat(ue, '"]')) || l.getElementById($e) || l.createElement("style"), r.value.isConnected || (o.value = ve || t, gt(r.value, {
        type: "text/css",
        id: $e,
        media: y,
        nonce: at
      }), $ ? l.head.prepend(r.value) : l.head.appendChild(r.value), Vi(r.value, "data-primevue-style-id", ue), gt(r.value, te), r.value.onload = function(Le) {
        return z?.(Le, {
          name: ue
        });
      }, _?.(ue)), !n.value && (J = ze(o, function(Le) {
        r.value.textContent = Le, D?.(ue);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, G = function() {
    !l || !n.value || (J(), Oi(r.value) && l.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && Xi(B), {
    id: g,
    name: f,
    el: r,
    css: o,
    unload: G,
    load: B,
    isLoaded: mr(n)
  };
}
function We(t) {
  "@babel/helpers - typeof";
  return We = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, We(t);
}
var Cn, _n, In, Pn;
function xn(t, e) {
  return is(t) || rs(t, e) || os(t, e) || ns();
}
function ns() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function os(t, e) {
  if (t) {
    if (typeof t == "string") return Tn(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tn(t, e) : void 0;
  }
}
function Tn(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function rs(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(t)).next, e !== 0) for (; !(s = (o = i.call(n)).done) && (l.push(o.value), l.length !== e); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function is(t) {
  if (Array.isArray(t)) return t;
}
function Ln(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Pt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ln(Object(n), !0).forEach(function(o) {
      ss(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ln(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function ss(t, e, n) {
  return (e = as(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function as(t) {
  var e = ls(t, "string");
  return We(e) == "symbol" ? e : e + "";
}
function ls(t, e) {
  if (We(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (We(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function pt(t, e) {
  return e || (e = t.slice(0)), Object.freeze(Object.defineProperties(t, { raw: { value: Object.freeze(e) } }));
}
var us = function(e) {
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
}, ds = {}, cs = {}, E = {
  name: "base",
  css: us,
  style: Yi,
  classes: ds,
  inlineStyles: cs,
  load: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(i) {
      return i;
    }, r = o(ct(Cn || (Cn = pt(["", ""])), e));
    return x(r) ? ts(He(r), Pt({
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
      return V.transformCSS(n.name || e.name, "".concat(r).concat(ct(_n || (_n = pt(["", ""])), o)));
    });
  },
  getCommonTheme: function(e) {
    return V.getCommon(this.name, e);
  },
  getComponentTheme: function(e) {
    return V.getComponent(this.name, e);
  },
  getDirectiveTheme: function(e) {
    return V.getDirective(this.name, e);
  },
  getPresetTheme: function(e, n, o) {
    return V.getCustomPreset(this.name, e, n, o);
  },
  getLayerOrderThemeCSS: function() {
    return V.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var o = X(this.css, {
        dt: xe
      }) || "", r = He(ct(In || (In = pt(["", "", ""])), o, e)), i = Object.entries(n).reduce(function(a, l) {
        var s = xn(l, 2), u = s[0], d = s[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return x(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(i, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return V.getCommonStyleSheet(this.name, e, n);
  },
  getThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = [V.getStyleSheet(this.name, e, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), i = ct(Pn || (Pn = pt(["", ""])), X(this.style, {
        dt: xe
      })), a = He(V.transformCSS(r, i)), l = Object.entries(n).reduce(function(s, u) {
        var d = xn(u, 2), c = d[0], p = d[1];
        return s.push("".concat(c, '="').concat(p, '"')) && s;
      }, []).join(" ");
      x(a) && o.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return o.join("");
  },
  extend: function(e) {
    return Pt(Pt({}, this), {}, {
      css: void 0,
      style: void 0
    }, e);
  }
}, Se = en();
function Ge(t) {
  "@babel/helpers - typeof";
  return Ge = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ge(t);
}
function An(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function ft(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? An(Object(n), !0).forEach(function(o) {
      ps(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : An(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function ps(t, e, n) {
  return (e = fs(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function fs(t) {
  var e = hs(t, "string");
  return Ge(e) == "symbol" ? e : e + "";
}
function hs(t, e) {
  if (Ge(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ge(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ms = {
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
    text: [U.STARTS_WITH, U.CONTAINS, U.NOT_CONTAINS, U.ENDS_WITH, U.EQUALS, U.NOT_EQUALS],
    numeric: [U.EQUALS, U.NOT_EQUALS, U.LESS_THAN, U.LESS_THAN_OR_EQUAL_TO, U.GREATER_THAN, U.GREATER_THAN_OR_EQUAL_TO],
    date: [U.DATE_IS, U.DATE_IS_NOT, U.DATE_BEFORE, U.DATE_AFTER]
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
}, gs = Symbol();
function bs(t, e) {
  var n = {
    config: br(e)
  };
  return t.config.globalProperties.$primevue = n, t.provide(gs, n), vs(), ys(t, n), n;
}
var je = [];
function vs() {
  K.clear(), je.forEach(function(t) {
    return t?.();
  }), je = [];
}
function ys(t, e) {
  var n = W(!1), o = function() {
    var u;
    if (((u = e.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !V.isStyleNameLoaded("common")) {
      var d, c, p = ((d = E.getCommonTheme) === null || d === void 0 ? void 0 : d.call(E)) || {}, f = p.primitive, h = p.semantic, g = p.global, m = p.style, y = {
        nonce: (c = e.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      E.load(f?.css, ft({
        name: "primitive-variables"
      }, y)), E.load(h?.css, ft({
        name: "semantic-variables"
      }, y)), E.load(g?.css, ft({
        name: "global-variables"
      }, y)), E.loadStyle(ft({
        name: "global-style"
      }, y), m), V.setLoadedStyleName("common");
    }
  };
  K.on("theme:change", function(s) {
    n.value || (t.config.globalProperties.$primevue.config.theme = s, n.value = !0);
  });
  var r = ze(e.config, function(s, u) {
    Se.emit("config:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), i = ze(function() {
    return e.config.ripple;
  }, function(s, u) {
    Se.emit("config:ripple:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = ze(function() {
    return e.config.theme;
  }, function(s, u) {
    n.value || V.setTheme(s), e.config.unstyled || o(), n.value = !1, Se.emit("config:theme:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = ze(function() {
    return e.config.unstyled;
  }, function(s, u) {
    !s && e.config.theme && o(), Se.emit("config:unstyled:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  je.push(r), je.push(i), je.push(a), je.push(l);
}
var Ss = {
  install: function(e, n) {
    var o = fi(ms, n);
    bs(e, o);
  }
}, nn = {
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
    this.mounted = $o();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function ws(t, e, n, o, r, i) {
  return i.inline ? T(t.$slots, "default", {
    key: 0
  }) : r.mounted ? (S(), H(ro, {
    key: 1,
    to: n.appendTo
  }, [T(t.$slots, "default")], 8, ["to"])) : F("", !0);
}
nn.render = ws;
var ye = {
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
function $s() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", e = vr();
  return "".concat(t).concat(e.replace("v-", "").replaceAll("-", "_"));
}
var En = E.extend({
  name: "common"
});
function qe(t) {
  "@babel/helpers - typeof";
  return qe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, qe(t);
}
function Os(t) {
  return Ao(t) || ks(t) || Lo(t) || To();
}
function ks(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function De(t, e) {
  return Ao(t) || Cs(t, e) || Lo(t, e) || To();
}
function To() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Lo(t, e) {
  if (t) {
    if (typeof t == "string") return zt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? zt(t, e) : void 0;
  }
}
function zt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Cs(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(t)).next, e === 0) {
        if (Object(n) !== n) return;
        s = !1;
      } else for (; !(s = (o = i.call(n)).done) && (l.push(o.value), l.length !== e); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function Ao(t) {
  if (Array.isArray(t)) return t;
}
function Vn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function I(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Vn(Object(n), !0).forEach(function(o) {
      Be(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Vn(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Be(t, e, n) {
  return (e = _s(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function _s(t) {
  var e = Is(t, "string");
  return qe(e) == "symbol" ? e : e + "";
}
function Is(t, e) {
  if (qe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (qe(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var we = {
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
        K.off("theme:change", this._loadCoreStyles), e || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(e, n) {
        var o = this;
        K.off("theme:change", this._themeScopedListener), e ? (this._loadScopedThemeStyles(e), this._themeScopedListener = function() {
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
    var e, n, o, r, i, a, l, s, u, d, c, p = (e = this.pt) === null || e === void 0 ? void 0 : e._usept, f = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, h = p ? (o = this.pt) === null || o === void 0 || (o = o.value) === null || o === void 0 ? void 0 : o[this.$.type.name] : this.pt;
    (r = h || f) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (i = r.onBeforeCreate) === null || i === void 0 || i.call(r);
    var g = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, m = g ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, y = g ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = y || m) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = $s(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var e;
    this.rootEl = $t(Ne(this.$el) ? this.$el : (e = this.$el) === null || e === void 0 ? void 0 : e.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = I({
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
      return wt(e) ? e.apply(void 0, o) : v.apply(void 0, o);
    },
    _load: function() {
      ye.isStyleNameLoaded("base") || (E.loadCSS(this.$styleOptions), this._loadGlobalStyles(), ye.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var e, n;
      !ye.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name && (En.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), ye.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var e = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      x(e) && E.load(e, I({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var e, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!V.isStyleNameLoaded("common")) {
          var o, r, i = ((o = this.$style) === null || o === void 0 || (r = o.getCommonTheme) === null || r === void 0 ? void 0 : r.call(o)) || {}, a = i.primitive, l = i.semantic, s = i.global, u = i.style;
          E.load(a?.css, I({
            name: "primitive-variables"
          }, this.$styleOptions)), E.load(l?.css, I({
            name: "semantic-variables"
          }, this.$styleOptions)), E.load(s?.css, I({
            name: "global-variables"
          }, this.$styleOptions)), E.loadStyle(I({
            name: "global-style"
          }, this.$styleOptions), u), V.setLoadedStyleName("common");
        }
        if (!V.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, p, f, h = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, g = h.css, m = h.style;
          (p = this.$style) === null || p === void 0 || p.load(g, I({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (f = this.$style) === null || f === void 0 || f.loadStyle(I({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), m), V.setLoadedStyleName(this.$style.name);
        }
        if (!V.isStyleNameLoaded("layer-order")) {
          var y, w, C = (y = this.$style) === null || y === void 0 || (w = y.getLayerOrderThemeCSS) === null || w === void 0 ? void 0 : w.call(y);
          E.load(C, I({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), V.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(e) {
      var n, o, r, i = ((n = this.$style) === null || n === void 0 || (o = n.getPresetTheme) === null || o === void 0 ? void 0 : o.call(n, e, "[".concat(this.$attrSelector, "]"))) || {}, a = i.css, l = (r = this.$style) === null || r === void 0 ? void 0 : r.load(a, I({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var e;
      (e = this.scopedStyleEl) === null || e === void 0 || (e = e.value) === null || e === void 0 || e.remove();
    },
    _themeChangeListener: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      ye.clearLoadedStyleNames(), K.on("theme:change", e);
    },
    _removeThemeListeners: function() {
      K.off("theme:change", this._loadCoreStyles), K.off("theme:change", this._load), K.off("theme:change", this._themeScopedListener);
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
      return Xt(e, n, o);
    },
    _getPTValue: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(o) && !!r[o.split(".")[0]], l = this._getPropValue("ptOptions") || ((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, p = i ? a ? this._useGlobalPT(this._getPTClassValue, o, r) : this._useDefaultPT(this._getPTClassValue, o, r) : void 0, f = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, o, I(I({}, r), {}, {
        global: p || {}
      })), h = this._getPTDatasets(o);
      return u || !u && f ? c ? this._mergeProps(c, p, f, h) : I(I(I({}, p), f), h) : I(I({}, f), h);
    },
    _getPTSelf: function() {
      for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return v(
        this._usePT.apply(this, [this._getPT(e, this.$name)].concat(o)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(o))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", i = o === "root" && x((e = this.pt) === null || e === void 0 ? void 0 : e["data-pc-section"]);
      return o !== "transition" && I(I({}, o === "root" && I(I(Be({}, "".concat(r, "name"), fe(i ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), i && Be({}, "".concat(r, "extend"), fe(this.$.type.name))), {}, Be({}, "".concat(this.$attrSelector), ""))), {}, Be({}, "".concat(r, "section"), fe(o)));
    },
    _getPTClassValue: function() {
      var e = this._getOptionValue.apply(this, arguments);
      return Y(e) || mo(e) ? {
        class: e
      } : e;
    },
    _getPT: function(e) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, i = function(l) {
        var s, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(l) : l, c = fe(o), p = fe(n.$name);
        return (s = u ? c !== p ? d?.[c] : void 0 : d?.[c]) !== null && s !== void 0 ? s : d;
      };
      return e != null && e.hasOwnProperty("_usept") ? {
        _usept: e._usept,
        originalValue: i(e.originalValue),
        value: i(e.value)
      } : i(e, !0);
    },
    _usePT: function(e, n, o, r) {
      var i = function(g) {
        return n(g, o, r);
      };
      if (e != null && e.hasOwnProperty("_usept")) {
        var a, l = e._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, p = i(e.originalValue), f = i(e.value);
        return p === void 0 && f === void 0 ? void 0 : Y(f) ? f : Y(p) ? p : u || !u && f ? c ? this._mergeProps(c, p, f) : I(I({}, p), f) : f;
      }
      return i(e);
    },
    _useGlobalPT: function(e, n, o) {
      return this._usePT(this.globalPT, e, n, o);
    },
    _useDefaultPT: function(e, n, o) {
      return this._usePT(this.defaultPT, e, n, o);
    },
    ptm: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, e, I(I({}, this.$params), n));
    },
    ptmi: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = v(this.$_attrsWithoutPT, this.ptm(n, o));
      return r?.hasOwnProperty("id") && ((e = r.id) !== null && e !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(e, n, I({
        instance: this
      }, o), !1);
    },
    cx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, e, I(I({}, this.$params), n));
    },
    sx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, e, I(I({}, this.$params), o)), i = this._getOptionValue(En.inlineStyles, e, I(I({}, this.$params), o));
        return [i, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return X(o, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(o) {
        return n._getOptionValue(o, n.$name, I({}, n.$params)) || X(o, I({}, n.$params));
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
        var r = De(o, 1), i = r[0];
        return n?.includes(i);
      }));
    },
    $theme: function() {
      var e;
      return (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.theme;
    },
    $style: function() {
      return I(I({
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
        var n = De(e, 1), o = n[0];
        return o?.startsWith("pt:");
      }).reduce(function(e, n) {
        var o = De(n, 2), r = o[0], i = o[1], a = r.split(":"), l = Os(a), s = zt(l).slice(1);
        return s?.reduce(function(u, d, c, p) {
          return !u[d] && (u[d] = c === p.length - 1 ? i : {}), u[d];
        }, e), e;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = De(e, 1), o = n[0];
        return !(o != null && o.startsWith("pt:"));
      }).reduce(function(e, n) {
        var o = De(n, 2), r = o[0], i = o[1];
        return e[r] = i, e;
      }, {});
    }
  }
}, Ps = `
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
`, xs = E.extend({
  name: "baseicon",
  css: Ps
});
function Ye(t) {
  "@babel/helpers - typeof";
  return Ye = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ye(t);
}
function zn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function jn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? zn(Object(n), !0).forEach(function(o) {
      Ts(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : zn(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Ts(t, e, n) {
  return (e = Ls(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ls(t) {
  var e = As(t, "string");
  return Ye(e) == "symbol" ? e : e + "";
}
function As(t, e) {
  if (Ye(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ye(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Me = {
  name: "BaseIcon",
  extends: we,
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
  style: xs,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var e = Te(this.label);
      return jn(jn({}, !this.isUnstyled && {
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
function Ze(t) {
  "@babel/helpers - typeof";
  return Ze = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ze(t);
}
function Fn(t, e) {
  return js(t) || zs(t, e) || Vs(t, e) || Es();
}
function Es() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Vs(t, e) {
  if (t) {
    if (typeof t == "string") return Nn(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Nn(t, e) : void 0;
  }
}
function Nn(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function zs(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var o, r, i, a, l = [], s = !0, u = !1;
    try {
      if (i = (n = n.call(t)).next, e !== 0) for (; !(s = (o = i.call(n)).done) && (l.push(o.value), l.length !== e); s = !0) ;
    } catch (d) {
      u = !0, r = d;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw r;
      }
    }
    return l;
  }
}
function js(t) {
  if (Array.isArray(t)) return t;
}
function Mn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function P(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Mn(Object(n), !0).forEach(function(o) {
      jt(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Mn(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function jt(t, e, n) {
  return (e = Fs(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Fs(t) {
  var e = Ns(t, "string");
  return Ze(e) == "symbol" ? e : e + "";
}
function Ns(t, e) {
  if (Ze(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ze(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var k = {
  _getMeta: function() {
    return [he(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], X(he(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(e, n) {
    var o, r, i;
    return (o = (e == null || (r = e.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (i = n.ctx) === null || i === void 0 || (i = i.appContext) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.globalProperties) === null || i === void 0 ? void 0 : i.$primevue)) === null || o === void 0 ? void 0 : o.config;
  },
  _getOptionValue: Xt,
  _getPTValue: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = function() {
      var w = k._getOptionValue.apply(k, arguments);
      return Y(w) || mo(w) ? {
        class: w
      } : w;
    }, u = ((e = o.binding) === null || e === void 0 || (e = e.value) === null || e === void 0 ? void 0 : e.ptOptions) || ((n = o.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, p = u.mergeProps, f = p === void 0 ? !1 : p, h = l ? k._useDefaultPT(o, o.defaultPT(), s, i, a) : void 0, g = k._usePT(o, k._getPT(r, o.$name), s, i, P(P({}, a), {}, {
      global: h || {}
    })), m = k._getPTDatasets(o, i);
    return c || !c && g ? f ? k._mergeProps(o, f, h, g, m) : P(P(P({}, h), g), m) : P(P({}, g), m);
  },
  _getPTDatasets: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = "data-pc-";
    return P(P({}, n === "root" && jt({}, "".concat(o, "name"), fe(e.$name))), {}, jt({}, "".concat(o, "section"), fe(n)));
  },
  _getPT: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(a) {
      var l, s = o ? o(a) : a, u = fe(n);
      return (l = s?.[u]) !== null && l !== void 0 ? l : s;
    };
    return e && Object.hasOwn(e, "_usept") ? {
      _usept: e._usept,
      originalValue: r(e.originalValue),
      value: r(e.value)
    } : r(e);
  },
  _usePT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0, a = function(m) {
      return o(m, r, i);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, s = n._usept || ((l = e.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = s.mergeSections, d = u === void 0 ? !0 : u, c = s.mergeProps, p = c === void 0 ? !1 : c, f = a(n.originalValue), h = a(n.value);
      return f === void 0 && h === void 0 ? void 0 : Y(h) ? h : Y(f) ? f : d || !d && h ? p ? k._mergeProps(e, p, f, h) : P(P({}, f), h) : h;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, i = arguments.length > 4 ? arguments[4] : void 0;
    return k._usePT(e, n, o, r, i);
  },
  _loadStyles: function() {
    var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, i = k._getConfig(o, r), a = {
      nonce: i == null || (e = i.csp) === null || e === void 0 ? void 0 : e.nonce
    };
    k._loadCoreStyles(n, a), k._loadThemeStyles(n, a), k._loadScopedThemeStyles(n, a), k._removeThemeListeners(n), n.$loadStyles = function() {
      return k._loadThemeStyles(n, a);
    }, k._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!ye.isStyleNameLoaded((e = o.$style) === null || e === void 0 ? void 0 : e.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
      var i;
      E.loadCSS(r), (i = o.$style) === null || i === void 0 || i.loadCSS(r), ye.setLoadedStyleName(o.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var e, n, o, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (e = r.theme) === null || e === void 0 ? void 0 : e.call(r)) === "none")) {
      if (!V.isStyleNameLoaded("common")) {
        var a, l, s = ((a = r.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = s.primitive, d = s.semantic, c = s.global, p = s.style;
        E.load(u?.css, P({
          name: "primitive-variables"
        }, i)), E.load(d?.css, P({
          name: "semantic-variables"
        }, i)), E.load(c?.css, P({
          name: "global-variables"
        }, i)), E.loadStyle(P({
          name: "global-style"
        }, i), p), V.setLoadedStyleName("common");
      }
      if (!V.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (o = r.$style) !== null && o !== void 0 && o.name) {
        var f, h, g, m, y = ((f = r.$style) === null || f === void 0 || (h = f.getDirectiveTheme) === null || h === void 0 ? void 0 : h.call(f)) || {}, w = y.css, C = y.style;
        (g = r.$style) === null || g === void 0 || g.load(w, P({
          name: "".concat(r.$style.name, "-variables")
        }, i)), (m = r.$style) === null || m === void 0 || m.loadStyle(P({
          name: "".concat(r.$style.name, "-style")
        }, i), C), V.setLoadedStyleName(r.$style.name);
      }
      if (!V.isStyleNameLoaded("layer-order")) {
        var b, $, A = (b = r.$style) === null || b === void 0 || ($ = b.getLayerOrderThemeCSS) === null || $ === void 0 ? void 0 : $.call(b);
        E.load(A, P({
          name: "layer-order",
          first: !0
        }, i)), V.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = e.preset();
    if (o && e.$attrSelector) {
      var r, i, a, l = ((r = e.$style) === null || r === void 0 || (i = r.getPresetTheme) === null || i === void 0 ? void 0 : i.call(r, o, "[".concat(e.$attrSelector, "]"))) || {}, s = l.css, u = (a = e.$style) === null || a === void 0 ? void 0 : a.load(s, P({
        name: "".concat(e.$attrSelector, "-").concat(e.$style.name)
      }, n));
      e.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    ye.clearLoadedStyleNames(), K.on("theme:change", e);
  },
  _removeThemeListeners: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    K.off("theme:change", e.$loadStyles), e.$loadStyles = void 0;
  },
  _hook: function(e, n, o, r, i, a) {
    var l, s, u = "on".concat(hi(n)), d = k._getConfig(r, i), c = o?.$instance, p = k._usePT(c, k._getPT(r == null || (l = r.value) === null || l === void 0 ? void 0 : l.pt, e), k._getOptionValue, "hooks.".concat(u)), f = k._useDefaultPT(c, d == null || (s = d.pt) === null || s === void 0 || (s = s.directives) === null || s === void 0 ? void 0 : s[e], k._getOptionValue, "hooks.".concat(u)), h = {
      el: o,
      binding: r,
      vnode: i,
      prevVnode: a
    };
    p?.(c, h), f?.(c, h);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      o[r - 2] = arguments[r];
    return wt(e) ? e.apply(void 0, o) : v.apply(void 0, o);
  },
  _extend: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = function(l, s, u, d, c) {
      var p, f, h, g;
      s._$instances = s._$instances || {};
      var m = k._getConfig(u, d), y = s._$instances[e] || {}, w = Te(y) ? P(P({}, n), n?.methods) : {};
      s._$instances[e] = P(P({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: e,
        $host: s,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || s || void 0,
        $style: P({
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
        $attrSelector: (p = s.$pd) === null || p === void 0 || (p = p[e]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return k._getPT(m?.pt, void 0, function(b) {
            var $;
            return b == null || ($ = b.directives) === null || $ === void 0 ? void 0 : $[e];
          });
        },
        isUnstyled: function() {
          var b, $;
          return ((b = s._$instances[e]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.unstyled) !== void 0 ? ($ = s._$instances[e]) === null || $ === void 0 || ($ = $.$binding) === null || $ === void 0 || ($ = $.value) === null || $ === void 0 ? void 0 : $.unstyled : m?.unstyled;
        },
        theme: function() {
          var b;
          return (b = s._$instances[e]) === null || b === void 0 || (b = b.$primevueConfig) === null || b === void 0 ? void 0 : b.theme;
        },
        preset: function() {
          var b;
          return (b = s._$instances[e]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.dt;
        },
        /* instance's methods */
        ptm: function() {
          var b, $ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return k._getPTValue(s._$instances[e], (b = s._$instances[e]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.pt, $, P({}, A));
        },
        ptmo: function() {
          var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, $ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k._getPTValue(s._$instances[e], b, $, A, !1);
        },
        cx: function() {
          var b, $, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", _ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (b = s._$instances[e]) !== null && b !== void 0 && b.isUnstyled() ? void 0 : k._getOptionValue(($ = s._$instances[e]) === null || $ === void 0 || ($ = $.$style) === null || $ === void 0 ? void 0 : $.classes, A, P({}, _));
        },
        sx: function() {
          var b, $ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, _ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return A ? k._getOptionValue((b = s._$instances[e]) === null || b === void 0 || (b = b.$style) === null || b === void 0 ? void 0 : b.inlineStyles, $, P({}, _)) : void 0;
        }
      }, w), s.$instance = s._$instances[e], (f = (h = s.$instance)[l]) === null || f === void 0 || f.call(h, s, u, d, c), s["$".concat(e)] = s.$instance, k._hook(e, l, s, u, d, c), s.$pd || (s.$pd = {}), s.$pd[e] = P(P({}, (g = s.$pd) === null || g === void 0 ? void 0 : g[e]), {}, {
        name: e,
        instance: s._$instances[e]
      });
    }, r = function(l) {
      var s, u, d, c = l._$instances[e], p = c?.watch, f = function(m) {
        var y, w = m.newValue, C = m.oldValue;
        return p == null || (y = p.config) === null || y === void 0 ? void 0 : y.call(c, w, C);
      }, h = function(m) {
        var y, w = m.newValue, C = m.oldValue;
        return p == null || (y = p["config.ripple"]) === null || y === void 0 ? void 0 : y.call(c, w, C);
      };
      c.$watchersCallback = {
        config: f,
        "config.ripple": h
      }, p == null || (s = p.config) === null || s === void 0 || s.call(c, c?.$primevueConfig), Se.on("config:change", f), p == null || (u = p["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), Se.on("config:ripple:change", h);
    }, i = function(l) {
      var s = l._$instances[e].$watchersCallback;
      s && (Se.off("config:change", s.config), Se.off("config:ripple:change", s["config.ripple"]), l._$instances[e].$watchersCallback = void 0);
    };
    return {
      created: function(l, s, u, d) {
        l.$pd || (l.$pd = {}), l.$pd[e] = {
          name: e,
          attrSelector: zi("pd")
        }, o("created", l, s, u, d);
      },
      beforeMount: function(l, s, u, d) {
        var c;
        k._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, s, u), o("beforeMount", l, s, u, d), r(l);
      },
      mounted: function(l, s, u, d) {
        var c;
        k._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, s, u), o("mounted", l, s, u, d);
      },
      beforeUpdate: function(l, s, u, d) {
        o("beforeUpdate", l, s, u, d);
      },
      updated: function(l, s, u, d) {
        var c;
        k._loadStyles((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance, s, u), o("updated", l, s, u, d);
      },
      beforeUnmount: function(l, s, u, d) {
        var c;
        i(l), k._removeThemeListeners((c = l.$pd[e]) === null || c === void 0 ? void 0 : c.instance), o("beforeUnmount", l, s, u, d);
      },
      unmounted: function(l, s, u, d) {
        var c;
        (c = l.$pd[e]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), o("unmounted", l, s, u, d);
      }
    };
  },
  extend: function() {
    var e = k._getMeta.apply(k, arguments), n = Fn(e, 2), o = n[0], r = n[1];
    return P({
      extend: function() {
        var a = k._getMeta.apply(k, arguments), l = Fn(a, 2), s = l[0], u = l[1];
        return k.extend(s, P(P(P({}, r), r?.methods), u));
      }
    }, k._extend(o, r));
  }
}, Ms = `
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
`, Ds = {
  root: "p-ink"
}, Rs = E.extend({
  name: "ripple-directive",
  style: Ms,
  classes: Ds
}), Bs = k.extend({
  style: Rs
});
function Je(t) {
  "@babel/helpers - typeof";
  return Je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Je(t);
}
function Hs(t) {
  return Gs(t) || Ws(t) || Us(t) || Ks();
}
function Ks() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Us(t, e) {
  if (t) {
    if (typeof t == "string") return Ft(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ft(t, e) : void 0;
  }
}
function Ws(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Gs(t) {
  if (Array.isArray(t)) return Ft(t);
}
function Ft(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Dn(t, e, n) {
  return (e = qs(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function qs(t) {
  var e = Ys(t, "string");
  return Je(e) == "symbol" ? e : e + "";
}
function Ys(t, e) {
  if (Je(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Je(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var on = Bs.extend("ripple", {
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
      n || (n = ki("span", Dn(Dn({
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
        if (!this.isUnstyled() && Ct(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !ke(r) && !Ce(r)) {
          var i = Math.max(yo(o), Ti(o));
          r.style.height = i + "px", r.style.width = i + "px";
        }
        var a = xi(o), l = e.pageX - a.left + document.body.scrollTop - Ce(r) / 2, s = e.pageY - a.top + document.body.scrollLeft - ke(r) / 2;
        r.style.top = s + "px", r.style.left = l + "px", !this.isUnstyled() && gi(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && Ct(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(e) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Ct(e.currentTarget, "p-ink-active"), e.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(e) {
      return e && e.children ? Hs(e.children).find(function(n) {
        return _i(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Qe(t) {
  "@babel/helpers - typeof";
  return Qe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Qe(t);
}
function Zs(t, e) {
  if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function Js(t, e) {
  for (var n = 0; n < e.length; n++) {
    var o = e[n];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(t, Xs(o.key), o);
  }
}
function Qs(t, e, n) {
  return e && Js(t.prototype, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function Xs(t) {
  var e = ea(t, "string");
  return Qe(e) == "symbol" ? e : e + "";
}
function ea(t, e) {
  if (Qe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Qe(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var ta = /* @__PURE__ */ (function() {
  function t(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Zs(this, t), this.element = e, this.listener = n;
  }
  return Qs(t, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Li(this.element);
      for (var n = 0; n < this.scrollableParents.length; n++)
        this.scrollableParents[n].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var n = 0; n < this.scrollableParents.length; n++)
          this.scrollableParents[n].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
})(), na = en();
const oa = "data-wippy-overlay-layer";
function Eo() {
  return typeof window < "u" && typeof window.document < "u";
}
function Vo() {
  return Eo() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function ra() {
  return Vo() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const ia = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let sa = 0;
const yt = /* @__PURE__ */ new WeakMap();
function Rn(t, e) {
  const n = t.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", e), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function aa(t, e) {
  if (!ia.test(t.className))
    return;
  const n = t.style.cssText;
  Rn(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = n;
    return;
  }
  if (!yt.has(t)) {
    const o = new MutationObserver(() => {
      const r = t.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && Rn(t, e);
    });
    o.observe(t, { attributes: !0, attributeFilter: ["style"] }), yt.set(t, o);
  }
}
function rn(t) {
  const e = yt.get(t);
  e && (e.disconnect(), yt.delete(t));
}
function la(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function Nt(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const St = /* @__PURE__ */ new Set(), sn = /* @__PURE__ */ new WeakMap();
let Bn = !1, Mt = !1;
const Hn = ["w-theme-dark", "w-theme-light"], ht = "data-wippy-theme-root", Dt = /* @__PURE__ */ new WeakMap();
function ua(t) {
  const e = [];
  let n = t ? t.parentNode : null;
  for (; n && n.nodeType === 1; )
    e.push(n), n = n.parentNode;
  return e;
}
function da(t, e, n) {
  const o = [...ua(e), n.host], r = () => {
    let a;
    for (const l of o) {
      if (Hn.some((s) => l.classList.contains(s))) {
        a = l;
        break;
      }
      if (l.hasAttribute(ht))
        break;
    }
    for (const l of Hn)
      t.classList.toggle(l, !!(a && a.classList.contains(l)));
    a ? t.setAttribute(ht, "") : t.removeAttribute(ht);
  };
  r();
  const i = new MutationObserver(r);
  for (const a of o)
    i.observe(a, { attributes: !0, attributeFilter: ["class", ht] });
  Dt.set(t, i);
}
function zo(t) {
  Dt.get(t)?.disconnect(), Dt.delete(t);
}
function ca() {
  Mt = !1;
  for (const t of St) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && rn(e);
      St.delete(t), sn.get(t)?.disconnect(), zo(t);
      continue;
    }
    t.childElementCount > 0 && Nt(t);
  }
}
function Kn() {
  Mt || (Mt = !0, requestAnimationFrame(ca));
}
function pa(t) {
  const e = document.createElement("div");
  e.setAttribute(oa, "");
  const n = Vo();
  if (e.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && e.setAttribute("popover", "manual"), t.appendChild(e), n) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Nt(e);
  const o = new MutationObserver((r) => {
    const i = e.__wippyAnchorName;
    for (const a of r) {
      if (i)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && aa(l, i);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && rn(l);
    }
    e.isConnected && e.childElementCount > 0 && Nt(e);
  });
  return o.observe(e, { childList: !0 }), sn.set(e, o), St.add(e), Bn || (Bn = !0, window.addEventListener("scroll", Kn, { capture: !0, passive: !0 }), window.addEventListener("resize", Kn, { passive: !0 })), e;
}
function Un(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = pa(t.hostRoot), da(t.layer, t.$el, t.hostRoot), ra())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++sa}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function Wn(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && rn(e);
    St.delete(t.layer), sn.get(t.layer)?.disconnect(), zo(t.layer), t.layer.remove(), t.layer = null;
  }
}
let Gn = !1;
function fa() {
  if (Gn)
    return;
  Gn = !0;
  const t = nn;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    Eo() && (this.hostRoot = la(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Un(this), this.$watch("inline", (e) => {
      e ? Wn(this) : Un(this);
    })));
  }, t.render = function() {
    return this.inline ? T(this.$slots, "default", { key: 0 }) : this.mounted ? yr(ro, { key: 1, to: this.resolvedTarget || document.body }, [
      T(this.$slots, "default")
    ]) : F("", !0);
  }, t.unmounted = function() {
    Wn(this);
  };
}
const ha = {
  install: (t) => {
    fa(), t.use(Ss, { theme: "none" });
  }
};
var Ot = {
  name: "SpinnerIcon",
  extends: Me
};
function ma(t) {
  return ya(t) || va(t) || ba(t) || ga();
}
function ga() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ba(t, e) {
  if (t) {
    if (typeof t == "string") return Rt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Rt(t, e) : void 0;
  }
}
function va(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ya(t) {
  if (Array.isArray(t)) return Rt(t);
}
function Rt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Sa(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ma(e[0] || (e[0] = [j("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ot.render = Sa;
var wa = `
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
`, $a = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": x(n.value) && String(n.value).length === 1,
      "p-badge-dot": Te(n.value) && !o.$slots.default,
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
}, Oa = E.extend({
  name: "badge",
  style: wa,
  classes: $a
}), ka = {
  name: "BaseBadge",
  extends: we,
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
  style: Oa,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Xe(t) {
  "@babel/helpers - typeof";
  return Xe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Xe(t);
}
function qn(t, e, n) {
  return (e = Ca(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ca(t) {
  var e = _a(t, "string");
  return Xe(e) == "symbol" ? e : e + "";
}
function _a(t, e) {
  if (Xe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Xe(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var jo = {
  name: "Badge",
  extends: ka,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ae(qn(qn({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ia = ["data-p"];
function Pa(t, e, n, o, r, i) {
  return S(), O("span", v({
    class: t.cx("root"),
    "data-p": i.dataP
  }, t.ptmi("root")), [T(t.$slots, "default", {}, function() {
    return [Fe(oe(t.value), 1)];
  })], 16, Ia);
}
jo.render = Pa;
var xa = `
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
function et(t) {
  "@babel/helpers - typeof";
  return et = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, et(t);
}
function ce(t, e, n) {
  return (e = Ta(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ta(t) {
  var e = La(t, "string");
  return et(e) == "symbol" ? e : e + "";
}
function La(t, e) {
  if (et(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (et(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Aa = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", ce(ce(ce(ce(ce(ce(ce(ce(ce({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", ce({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, Ea = E.extend({
  name: "button",
  style: xa,
  classes: Aa
}), Va = {
  name: "BaseButton",
  extends: we,
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
  style: Ea,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function tt(t) {
  "@babel/helpers - typeof";
  return tt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, tt(t);
}
function q(t, e, n) {
  return (e = za(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function za(t) {
  var e = ja(t, "string");
  return tt(e) == "symbol" ? e : e + "";
}
function ja(t, e) {
  if (tt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (tt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Ve = {
  name: "Button",
  extends: Va,
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
      return v(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Te(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return ae(q(q(q(q(q(q(q(q(q(q({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return ae(q(q({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return ae(q(q({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Ot,
    Badge: jo
  },
  directives: {
    ripple: on
  }
}, Fa = ["data-p"], Na = ["data-p"];
function Ma(t, e, n, o, r, i) {
  var a = Q("SpinnerIcon"), l = Q("Badge"), s = Jt("ripple");
  return t.asChild ? T(t.$slots, "default", {
    key: 1,
    class: _e(t.cx("root")),
    a11yAttrs: i.a11yAttrs
  }) : Qt((S(), H(mt(t.as), v({
    key: 0,
    class: t.cx("root"),
    "data-p": i.dataP
  }, i.attrs), {
    default: pe(function() {
      return [T(t.$slots, "default", {}, function() {
        return [t.loading ? T(t.$slots, "loadingicon", v({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (S(), O("span", v({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (S(), H(a, v({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : T(t.$slots, "icon", v({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (S(), O("span", v({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": i.dataIconP
          }, t.ptm("icon")), null, 16, Fa)) : F("", !0)];
        }), t.label ? (S(), O("span", v({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": i.dataLabelP
        }), oe(t.label), 17, Na)) : F("", !0), t.badge ? (S(), H(l, {
          key: 3,
          value: t.badge,
          class: _e(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : F("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[s]]);
}
Ve.render = Ma;
var Fo = {
  name: "BlankIcon",
  extends: Me
};
function Da(t) {
  return Ka(t) || Ha(t) || Ba(t) || Ra();
}
function Ra() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ba(t, e) {
  if (t) {
    if (typeof t == "string") return Bt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Bt(t, e) : void 0;
  }
}
function Ha(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ka(t) {
  if (Array.isArray(t)) return Bt(t);
}
function Bt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Ua(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Da(e[0] || (e[0] = [j("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
Fo.render = Ua;
var No = {
  name: "CheckIcon",
  extends: Me
};
function Wa(t) {
  return Za(t) || Ya(t) || qa(t) || Ga();
}
function Ga() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qa(t, e) {
  if (t) {
    if (typeof t == "string") return Ht(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ht(t, e) : void 0;
  }
}
function Ya(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Za(t) {
  if (Array.isArray(t)) return Ht(t);
}
function Ht(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Ja(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Wa(e[0] || (e[0] = [j("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
No.render = Ja;
var Mo = {
  name: "ChevronDownIcon",
  extends: Me
};
function Qa(t) {
  return nl(t) || tl(t) || el(t) || Xa();
}
function Xa() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function el(t, e) {
  if (t) {
    if (typeof t == "string") return Kt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Kt(t, e) : void 0;
  }
}
function tl(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function nl(t) {
  if (Array.isArray(t)) return Kt(t);
}
function Kt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function ol(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Qa(e[0] || (e[0] = [j("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Mo.render = ol;
var Do = {
  name: "SearchIcon",
  extends: Me
};
function rl(t) {
  return ll(t) || al(t) || sl(t) || il();
}
function il() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function sl(t, e) {
  if (t) {
    if (typeof t == "string") return Ut(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ut(t, e) : void 0;
  }
}
function al(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ll(t) {
  if (Array.isArray(t)) return Ut(t);
}
function Ut(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function ul(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), rl(e[0] || (e[0] = [j("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Do.render = ul;
var an = {
  name: "TimesIcon",
  extends: Me
};
function dl(t) {
  return hl(t) || fl(t) || pl(t) || cl();
}
function cl() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pl(t, e) {
  if (t) {
    if (typeof t == "string") return Wt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Wt(t, e) : void 0;
  }
}
function fl(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function hl(t) {
  if (Array.isArray(t)) return Wt(t);
}
function Wt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function ml(t, e, n, o, r, i) {
  return S(), O("svg", v({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), dl(e[0] || (e[0] = [j("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
an.render = ml;
var gl = `
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`, bl = {
  root: "p-iconfield"
}, vl = E.extend({
  name: "iconfield",
  style: gl,
  classes: bl
}), yl = {
  name: "BaseIconField",
  extends: we,
  style: vl,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, Ro = {
  name: "IconField",
  extends: yl,
  inheritAttrs: !1
};
function Sl(t, e, n, o, r, i) {
  return S(), O("div", v({
    class: t.cx("root")
  }, t.ptmi("root")), [T(t.$slots, "default")], 16);
}
Ro.render = Sl;
var wl = {
  root: "p-inputicon"
}, $l = E.extend({
  name: "inputicon",
  classes: wl
}), Ol = {
  name: "BaseInputIcon",
  extends: we,
  style: $l,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, Bo = {
  name: "InputIcon",
  extends: Ol,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function kl(t, e, n, o, r, i) {
  return S(), O("span", v({
    class: i.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [T(t.$slots, "default")], 16);
}
Bo.render = kl;
var Cl = {
  name: "BaseEditableHolder",
  extends: we,
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
      return n.find(x);
    }
  },
  computed: {
    $filled: function() {
      return x(this.d_value);
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
}, Ho = {
  name: "BaseInput",
  extends: Cl,
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
}, _l = `
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
`, Il = {
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
}, Pl = E.extend({
  name: "inputtext",
  style: _l,
  classes: Il
}), xl = {
  name: "BaseInputText",
  extends: Ho,
  style: Pl,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function nt(t) {
  "@babel/helpers - typeof";
  return nt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, nt(t);
}
function Tl(t, e, n) {
  return (e = Ll(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ll(t) {
  var e = Al(t, "string");
  return nt(e) == "symbol" ? e : e + "";
}
function Al(t, e) {
  if (nt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (nt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ln = {
  name: "InputText",
  extends: xl,
  inheritAttrs: !1,
  methods: {
    onInput: function(e) {
      this.writeValue(e.target.value, e);
    }
  },
  computed: {
    attrs: function() {
      return v(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ae(Tl({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, El = ["value", "name", "disabled", "aria-invalid", "data-p"];
function Vl(t, e, n, o, r, i) {
  return S(), O("input", v({
    type: "text",
    class: t.cx("root"),
    value: t.d_value,
    name: t.name,
    disabled: t.disabled,
    "aria-invalid": t.$invalid || void 0,
    "data-p": i.dataP,
    onInput: e[0] || (e[0] = function() {
      return i.onInput && i.onInput.apply(i, arguments);
    })
  }, i.attrs), null, 16, El);
}
ln.render = Vl;
var zl = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, jl = `
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}

.p-virtualscroller .p-virtualscroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
}
`, Yn = E.extend({
  name: "virtualscroller",
  css: jl,
  style: zl
}), Fl = {
  name: "BaseVirtualScroller",
  extends: we,
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    loaderDisabled: {
      type: Boolean,
      default: !1
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: !1
    },
    showSpacer: {
      type: Boolean,
      default: !0
    },
    showLoader: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: !1
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: !1
    },
    autoSize: {
      type: Boolean,
      default: !1
    }
  },
  style: Yn,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var e;
    Yn.loadCSS({
      nonce: (e = this.$primevueConfig) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce
    });
  }
};
function ot(t) {
  "@babel/helpers - typeof";
  return ot = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ot(t);
}
function Zn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Re(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Zn(Object(n), !0).forEach(function(o) {
      Ko(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Zn(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Ko(t, e, n) {
  return (e = Nl(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Nl(t) {
  var e = Ml(t, "string");
  return ot(e) == "symbol" ? e : e + "";
}
function Ml(t, e) {
  if (ot(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (ot(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Uo = {
  name: "VirtualScroller",
  extends: Fl,
  inheritAttrs: !1,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  data: function() {
    var e = this.isBoth();
    return {
      first: e ? {
        rows: 0,
        cols: 0
      } : 0,
      last: e ? {
        rows: 0,
        cols: 0
      } : 0,
      page: e ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: e ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: e ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: !1,
  lazyLoadState: {},
  resizeListener: null,
  resizeObserver: null,
  initialized: !1,
  watch: {
    numToleratedItems: function(e) {
      this.d_numToleratedItems = e;
    },
    loading: function(e, n) {
      this.lazy && e !== n && e !== this.d_loading && (this.d_loading = e);
    },
    items: {
      handler: function(e, n) {
        (!n || n.length !== (e || []).length) && (this.init(), this.calculateAutoSize());
      },
      deep: !0
    },
    itemSize: function() {
      this.init(), this.calculateAutoSize();
    },
    orientation: function() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    },
    scrollHeight: function() {
      this.init(), this.calculateAutoSize();
    },
    scrollWidth: function() {
      this.init(), this.calculateAutoSize();
    }
  },
  mounted: function() {
    this.viewInit(), this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0, this.lazyLoadState = this.lazyLoadState || {};
  },
  updated: function() {
    !this.initialized && this.viewInit();
  },
  unmounted: function() {
    this.unbindResizeListener(), this.initialized = !1;
  },
  methods: {
    viewInit: function() {
      bt(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = Ce(this.element), this.defaultHeight = ke(this.element), this.defaultContentWidth = Ce(this.content), this.defaultContentHeight = ke(this.content), this.initialized = !0), this.element && this.bindResizeListener();
    },
    init: function() {
      this.disabled || (this.setSize(), this.calculateOptions(), this.setSpacerSize());
    },
    isVertical: function() {
      return this.orientation === "vertical";
    },
    isHorizontal: function() {
      return this.orientation === "horizontal";
    },
    isBoth: function() {
      return this.orientation === "both";
    },
    scrollTo: function(e) {
      this.element && this.element.scrollTo(e);
    },
    scrollToIndex: function(e) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", r = this.isBoth(), i = this.isHorizontal(), a = r ? e.every(function(_) {
        return _ > -1;
      }) : e > -1;
      if (a) {
        var l = this.first, s = this.element, u = s.scrollTop, d = u === void 0 ? 0 : u, c = s.scrollLeft, p = c === void 0 ? 0 : c, f = this.calculateNumItems(), h = f.numToleratedItems, g = this.getContentPosition(), m = this.itemSize, y = function() {
          var L = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, D = arguments.length > 1 ? arguments[1] : void 0;
          return L <= D ? 0 : L;
        }, w = function(L, D, R) {
          return L * D + R;
        }, C = function() {
          var L = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: L,
            top: D,
            behavior: o
          });
        }, b = r ? {
          rows: 0,
          cols: 0
        } : 0, $ = !1, A = !1;
        r ? (b = {
          rows: y(e[0], h[0]),
          cols: y(e[1], h[1])
        }, C(w(b.cols, m[1], g.left), w(b.rows, m[0], g.top)), A = this.lastScrollPos.top !== d || this.lastScrollPos.left !== p, $ = b.rows !== l.rows || b.cols !== l.cols) : (b = y(e, h), i ? C(w(b, m, g.left), d) : C(p, w(b, m, g.top)), A = this.lastScrollPos !== (i ? p : d), $ = b !== l), this.isRangeChanged = $, A && (this.first = b);
      }
    },
    scrollInView: function(e, n) {
      var o = this, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var i = this.isBoth(), a = this.isHorizontal(), l = i ? e.every(function(m) {
          return m > -1;
        }) : e > -1;
        if (l) {
          var s = this.getRenderedRange(), u = s.first, d = s.viewport, c = function() {
            var y = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, w = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return o.scrollTo({
              left: y,
              top: w,
              behavior: r
            });
          }, p = n === "to-start", f = n === "to-end";
          if (p) {
            if (i)
              d.first.rows - u.rows > e[0] ? c(d.first.cols * this.itemSize[1], (d.first.rows - 1) * this.itemSize[0]) : d.first.cols - u.cols > e[1] && c((d.first.cols - 1) * this.itemSize[1], d.first.rows * this.itemSize[0]);
            else if (d.first - u > e) {
              var h = (d.first - 1) * this.itemSize;
              a ? c(h, 0) : c(0, h);
            }
          } else if (f) {
            if (i)
              d.last.rows - u.rows <= e[0] + 1 ? c(d.first.cols * this.itemSize[1], (d.first.rows + 1) * this.itemSize[0]) : d.last.cols - u.cols <= e[1] + 1 && c((d.first.cols + 1) * this.itemSize[1], d.first.rows * this.itemSize[0]);
            else if (d.last - u <= e + 1) {
              var g = (d.first + 1) * this.itemSize;
              a ? c(g, 0) : c(0, g);
            }
          }
        }
      } else
        this.scrollToIndex(e, r);
    },
    getRenderedRange: function() {
      var e = function(c, p) {
        return Math.floor(c / (p || c));
      }, n = this.first, o = 0;
      if (this.element) {
        var r = this.isBoth(), i = this.isHorizontal(), a = this.element, l = a.scrollTop, s = a.scrollLeft;
        if (r)
          n = {
            rows: e(l, this.itemSize[0]),
            cols: e(s, this.itemSize[1])
          }, o = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var u = i ? s : l;
          n = e(u, this.itemSize), o = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: o
        }
      };
    },
    calculateNumItems: function() {
      var e = this.isBoth(), n = this.isHorizontal(), o = this.itemSize, r = this.getContentPosition(), i = this.element ? this.element.offsetWidth - r.left : 0, a = this.element ? this.element.offsetHeight - r.top : 0, l = function(p, f) {
        return Math.ceil(p / (f || p));
      }, s = function(p) {
        return Math.ceil(p / 2);
      }, u = e ? {
        rows: l(a, o[0]),
        cols: l(i, o[1])
      } : l(n ? i : a, o), d = this.d_numToleratedItems || (e ? [s(u.rows), s(u.cols)] : s(u));
      return {
        numItemsInViewport: u,
        numToleratedItems: d
      };
    },
    calculateOptions: function() {
      var e = this, n = this.isBoth(), o = this.first, r = this.calculateNumItems(), i = r.numItemsInViewport, a = r.numToleratedItems, l = function(d, c, p) {
        var f = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return e.getLast(d + c + (d < p ? 2 : 3) * p, f);
      }, s = n ? {
        rows: l(o.rows, i.rows, a[0]),
        cols: l(o.cols, i.cols, a[1], !0)
      } : l(o, i, a);
      this.last = s, this.numItemsInViewport = i, this.d_numToleratedItems = a, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: i.rows
      }).map(function() {
        return Array.from({
          length: i.cols
        });
      }) : Array.from({
        length: i
      })), this.lazy && Promise.resolve().then(function() {
        var u;
        e.lazyLoadState = {
          first: e.step ? n ? {
            rows: 0,
            cols: o.cols
          } : 0 : o,
          last: Math.min(e.step ? e.step : s, ((u = e.items) === null || u === void 0 ? void 0 : u.length) || 0)
        }, e.$emit("lazy-load", e.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var e = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (e.content) {
          var n = e.isBoth(), o = e.isHorizontal(), r = e.isVertical();
          e.content.style.minHeight = e.content.style.minWidth = "auto", e.content.style.position = "relative", e.element.style.contain = "none";
          var i = [Ce(e.element), ke(e.element)], a = i[0], l = i[1];
          (n || o) && (e.element.style.width = a < e.defaultWidth ? a + "px" : e.scrollWidth || e.defaultWidth + "px"), (n || r) && (e.element.style.height = l < e.defaultHeight ? l + "px" : e.scrollHeight || e.defaultHeight + "px"), e.content.style.minHeight = e.content.style.minWidth = "", e.content.style.position = "", e.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var e, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, r = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(r ? ((e = this.columns || this.items[0]) === null || e === void 0 ? void 0 : e.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, o) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var e = getComputedStyle(this.content), n = parseFloat(e.paddingLeft) + Math.max(parseFloat(e.left) || 0, 0), o = parseFloat(e.paddingRight) + Math.max(parseFloat(e.right) || 0, 0), r = parseFloat(e.paddingTop) + Math.max(parseFloat(e.top) || 0, 0), i = parseFloat(e.paddingBottom) + Math.max(parseFloat(e.bottom) || 0, 0);
        return {
          left: n,
          right: o,
          top: r,
          bottom: i,
          x: n + o,
          y: r + i
        };
      }
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },
    setSize: function() {
      var e = this;
      if (this.element) {
        var n = this.isBoth(), o = this.isHorizontal(), r = this.element.parentElement, i = this.scrollWidth || "".concat(this.element.offsetWidth || r.offsetWidth, "px"), a = this.scrollHeight || "".concat(this.element.offsetHeight || r.offsetHeight, "px"), l = function(u, d) {
          return e.element.style[u] = d;
        };
        n || o ? (l("height", a), l("width", i)) : l("height", a);
      }
    },
    setSpacerSize: function() {
      var e = this, n = this.items;
      if (n) {
        var o = this.isBoth(), r = this.isHorizontal(), i = this.getContentPosition(), a = function(s, u, d) {
          var c = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return e.spacerStyle = Re(Re({}, e.spacerStyle), Ko({}, "".concat(s), (u || []).length * d + c + "px"));
        };
        o ? (a("height", n, this.itemSize[0], i.y), a("width", this.columns || n[1], this.itemSize[1], i.x)) : r ? a("width", this.columns || n, this.itemSize, i.x) : a("height", n, this.itemSize, i.y);
      }
    },
    setContentPosition: function(e) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var o = this.isBoth(), r = this.isHorizontal(), i = e ? e.first : this.first, a = function(d, c) {
          return d * c;
        }, l = function() {
          var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = Re(Re({}, n.contentStyle), {
            transform: "translate3d(".concat(d, "px, ").concat(c, "px, 0)")
          });
        };
        if (o)
          l(a(i.cols, this.itemSize[1]), a(i.rows, this.itemSize[0]));
        else {
          var s = a(i, this.itemSize);
          r ? l(s, 0) : l(0, s);
        }
      }
    },
    onScrollPositionChange: function(e) {
      var n = this, o = e.target, r = this.isBoth(), i = this.isHorizontal(), a = this.getContentPosition(), l = function(z, M) {
        return z ? z > M ? z - M : z : 0;
      }, s = function(z, M) {
        return Math.floor(z / (M || z));
      }, u = function(z, M, Z, J, B, G) {
        return z <= B ? B : G ? Z - J - B : M + B - 1;
      }, d = function(z, M, Z, J, B, G, ee, ve) {
        if (z <= G) return 0;
        var le = Math.max(0, ee ? z < M ? Z : z - G : z > M ? Z : z - 2 * G), te = n.getLast(le, ve);
        return le > te ? te - B : le;
      }, c = function(z, M, Z, J, B, G) {
        var ee = M + J + 2 * B;
        return z >= B && (ee += B + 1), n.getLast(ee, G);
      }, p = l(o.scrollTop, a.top), f = l(o.scrollLeft, a.left), h = r ? {
        rows: 0,
        cols: 0
      } : 0, g = this.last, m = !1, y = this.lastScrollPos;
      if (r) {
        var w = this.lastScrollPos.top <= p, C = this.lastScrollPos.left <= f;
        if (!this.appendOnly || this.appendOnly && (w || C)) {
          var b = {
            rows: s(p, this.itemSize[0]),
            cols: s(f, this.itemSize[1])
          }, $ = {
            rows: u(b.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], w),
            cols: u(b.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], C)
          };
          h = {
            rows: d(b.rows, $.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], w),
            cols: d(b.cols, $.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], C, !0)
          }, g = {
            rows: c(b.rows, h.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: c(b.cols, h.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, m = h.rows !== this.first.rows || g.rows !== this.last.rows || h.cols !== this.first.cols || g.cols !== this.last.cols || this.isRangeChanged, y = {
            top: p,
            left: f
          };
        }
      } else {
        var A = i ? f : p, _ = this.lastScrollPos <= A;
        if (!this.appendOnly || this.appendOnly && _) {
          var L = s(A, this.itemSize), D = u(L, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, _);
          h = d(L, D, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, _), g = c(L, h, this.last, this.numItemsInViewport, this.d_numToleratedItems), m = h !== this.first || g !== this.last || this.isRangeChanged, y = A;
        }
      }
      return {
        first: h,
        last: g,
        isRangeChanged: m,
        scrollPos: y
      };
    },
    onScrollChange: function(e) {
      var n = this.onScrollPositionChange(e), o = n.first, r = n.last, i = n.isRangeChanged, a = n.scrollPos;
      if (i) {
        var l = {
          first: o,
          last: r
        };
        if (this.setContentPosition(l), this.first = o, this.last = r, this.lastScrollPos = a, this.$emit("scroll-index-change", l), this.lazy && this.isPageChanged(o)) {
          var s, u, d = {
            first: this.step ? Math.min(this.getPageByFirst(o) * this.step, (((s = this.items) === null || s === void 0 ? void 0 : s.length) || 0) - this.step) : o,
            last: Math.min(this.step ? (this.getPageByFirst(o) + 1) * this.step : r, ((u = this.items) === null || u === void 0 ? void 0 : u.length) || 0)
          }, c = this.lazyLoadState.first !== d.first || this.lazyLoadState.last !== d.last;
          c && this.$emit("lazy-load", d), this.lazyLoadState = d;
        }
      }
    },
    onScroll: function(e) {
      var n = this;
      if (this.$emit("scroll", e), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var o = this.onScrollPositionChange(e), r = o.isRangeChanged, i = r || (this.step ? this.isPageChanged() : !1);
            i && (this.d_loading = !0);
          }
          this.scrollTimeout = setTimeout(function() {
            n.onScrollChange(e), n.d_loading && n.showLoader && (!n.lazy || n.loading === void 0) && (n.d_loading = !1, n.page = n.getPageByFirst());
          }, this.delay);
        }
      } else
        this.onScrollChange(e);
    },
    onResize: function() {
      var e = this;
      this.resizeTimeout && clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
        if (bt(e.element)) {
          var n = e.isBoth(), o = e.isVertical(), r = e.isHorizontal(), i = [Ce(e.element), ke(e.element)], a = i[0], l = i[1], s = a !== e.defaultWidth, u = l !== e.defaultHeight, d = n ? s || u : r ? s : o ? u : !1;
          d && (e.d_numToleratedItems = e.numToleratedItems, e.defaultWidth = a, e.defaultHeight = l, e.defaultContentWidth = Ce(e.content), e.defaultContentHeight = ke(e.content), e.init());
        }
      }, this.resizeDelay);
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = this.onResize.bind(this), window.addEventListener("resize", this.resizeListener), window.addEventListener("orientationchange", this.resizeListener), this.resizeObserver = new ResizeObserver(function() {
        e.onResize();
      }), this.resizeObserver.observe(this.element));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), window.removeEventListener("orientationchange", this.resizeListener), this.resizeListener = null), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
    },
    getOptions: function(e) {
      var n = (this.items || []).length, o = this.isBoth() ? this.first.rows + e : this.first + e;
      return {
        index: o,
        count: n,
        first: o === 0,
        last: o === n - 1,
        even: o % 2 === 0,
        odd: o % 2 !== 0
      };
    },
    getLoaderOptions: function(e, n) {
      var o = this.loaderArr.length;
      return Re({
        index: e,
        count: o,
        first: e === 0,
        last: e === o - 1,
        even: e % 2 === 0,
        odd: e % 2 !== 0
      }, n);
    },
    getPageByFirst: function(e) {
      return Math.floor(((e ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged: function(e) {
      return this.step && !this.lazy ? this.page !== this.getPageByFirst(e ?? this.first) : !0;
    },
    setContentEl: function(e) {
      this.content = e || this.content || $t(this.element, '[data-pc-section="content"]');
    },
    elementRef: function(e) {
      this.element = e;
    },
    contentRef: function(e) {
      this.content = e;
    }
  },
  computed: {
    containerClass: function() {
      return ["p-virtualscroller", this.class, {
        "p-virtualscroller-inline": this.inline,
        "p-virtualscroller-both p-both-scroll": this.isBoth(),
        "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
      }];
    },
    contentClass: function() {
      return ["p-virtualscroller-content", {
        "p-virtualscroller-loading": this.d_loading
      }];
    },
    loaderClass: function() {
      return ["p-virtualscroller-loader", {
        "p-virtualscroller-loader-mask": !this.$slots.loader
      }];
    },
    loadedItems: function() {
      var e = this;
      return this.items && !this.d_loading ? this.isBoth() ? this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(n) {
        return e.columns ? n : n.slice(e.appendOnly ? 0 : e.first.cols, e.last.cols);
      }) : this.isHorizontal() && this.columns ? this.items : this.items.slice(this.appendOnly ? 0 : this.first, this.last) : [];
    },
    loadedRows: function() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns: function() {
      if (this.columns) {
        var e = this.isBoth(), n = this.isHorizontal();
        if (e || n)
          return this.d_loading && this.loaderDisabled ? e ? this.loaderArr[0] : this.loaderArr : this.columns.slice(e ? this.first.cols : this.first, e ? this.last.cols : this.last);
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: Ot
  }
}, Dl = ["tabindex"];
function Rl(t, e, n, o, r, i) {
  var a = Q("SpinnerIcon");
  return t.disabled ? (S(), O(Ie, {
    key: 1
  }, [T(t.$slots, "default"), T(t.$slots, "content", {
    items: t.items,
    rows: t.items,
    columns: i.loadedColumns
  })], 64)) : (S(), O("div", v({
    key: 0,
    ref: i.elementRef,
    class: i.containerClass,
    tabindex: t.tabindex,
    style: t.style,
    onScroll: e[0] || (e[0] = function() {
      return i.onScroll && i.onScroll.apply(i, arguments);
    })
  }, t.ptmi("root")), [T(t.$slots, "content", {
    styleClass: i.contentClass,
    items: i.loadedItems,
    getItemOptions: i.getOptions,
    loading: r.d_loading,
    getLoaderOptions: i.getLoaderOptions,
    itemSize: t.itemSize,
    rows: i.loadedRows,
    columns: i.loadedColumns,
    contentRef: i.contentRef,
    spacerStyle: r.spacerStyle,
    contentStyle: r.contentStyle,
    vertical: i.isVertical(),
    horizontal: i.isHorizontal(),
    both: i.isBoth()
  }, function() {
    return [j("div", v({
      ref: i.contentRef,
      class: i.contentClass,
      style: r.contentStyle
    }, t.ptm("content")), [(S(!0), O(Ie, null, xt(i.loadedItems, function(l, s) {
      return T(t.$slots, "item", {
        key: s,
        item: l,
        options: i.getOptions(s)
      });
    }), 128))], 16)];
  }), t.showSpacer ? (S(), O("div", v({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: r.spacerStyle
  }, t.ptm("spacer")), null, 16)) : F("", !0), !t.loaderDisabled && t.showLoader && r.d_loading ? (S(), O("div", v({
    key: 1,
    class: i.loaderClass
  }, t.ptm("loader")), [t.$slots && t.$slots.loader ? (S(!0), O(Ie, {
    key: 0
  }, xt(r.loaderArr, function(l, s) {
    return T(t.$slots, "loader", {
      key: s,
      options: i.getLoaderOptions(s, i.isBoth() && {
        numCols: t.d_numItemsInViewport.cols
      })
    });
  }), 128)) : F("", !0), T(t.$slots, "loadingicon", {}, function() {
    return [re(a, v({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, t.ptm("loadingIcon")), null, 16)];
  })], 16)) : F("", !0)], 16, Dl));
}
Uo.render = Rl;
var Bl = `
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
        transform-origin: inherit;
        will-change: transform;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }

    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .p-floatlabel-in .p-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`, Hl = {
  root: function(e) {
    var n = e.instance, o = e.props, r = e.state;
    return ["p-select p-component p-inputwrapper", {
      "p-disabled": o.disabled,
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-focus": r.focused,
      "p-inputwrapper-filled": n.$filled,
      "p-inputwrapper-focus": r.focused || r.overlayVisible,
      "p-select-open": r.overlayVisible,
      "p-select-fluid": n.$fluid,
      "p-select-sm p-inputfield-sm": o.size === "small",
      "p-select-lg p-inputfield-lg": o.size === "large"
    }];
  },
  label: function(e) {
    var n, o = e.instance, r = e.props;
    return ["p-select-label", {
      "p-placeholder": !r.editable && o.label === r.placeholder,
      "p-select-label-empty": !r.editable && !o.$slots.value && (o.label === "p-emptylabel" || ((n = o.label) === null || n === void 0 ? void 0 : n.length) === 0)
    }];
  },
  clearIcon: "p-select-clear-icon",
  dropdown: "p-select-dropdown",
  loadingicon: "p-select-loading-icon",
  dropdownIcon: "p-select-dropdown-icon",
  overlay: "p-select-overlay p-component",
  header: "p-select-header",
  pcFilter: "p-select-filter",
  listContainer: "p-select-list-container",
  list: "p-select-list",
  optionGroup: "p-select-option-group",
  optionGroupLabel: "p-select-option-group-label",
  option: function(e) {
    var n = e.instance, o = e.props, r = e.state, i = e.option, a = e.focusedOption;
    return ["p-select-option", {
      "p-select-option-selected": n.isSelected(i) && o.highlightOnSelect,
      "p-focus": r.focusedOptionIndex === a,
      "p-disabled": n.isOptionDisabled(i)
    }];
  },
  optionLabel: "p-select-option-label",
  optionCheckIcon: "p-select-option-check-icon",
  optionBlankIcon: "p-select-option-blank-icon",
  emptyMessage: "p-select-empty-message"
}, Kl = E.extend({
  name: "select",
  style: Bl,
  classes: Hl
}), Ul = {
  name: "BaseSelect",
  extends: Ho,
  props: {
    options: Array,
    optionLabel: [String, Function],
    optionValue: [String, Function],
    optionDisabled: [String, Function],
    optionGroupLabel: [String, Function],
    optionGroupChildren: [String, Function],
    scrollHeight: {
      type: String,
      default: "14rem"
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    editable: Boolean,
    placeholder: {
      type: String,
      default: null
    },
    dataKey: null,
    showClear: {
      type: Boolean,
      default: !1
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
    labelId: {
      type: String,
      default: null
    },
    labelClass: {
      type: [String, Object],
      default: null
    },
    labelStyle: {
      type: Object,
      default: null
    },
    panelClass: {
      type: [String, Object],
      default: null
    },
    overlayStyle: {
      type: Object,
      default: null
    },
    overlayClass: {
      type: [String, Object],
      default: null
    },
    panelStyle: {
      type: Object,
      default: null
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    clearIcon: {
      type: String,
      default: void 0
    },
    dropdownIcon: {
      type: String,
      default: void 0
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    resetFilterOnHide: {
      type: Boolean,
      default: !1
    },
    resetFilterOnClear: {
      type: Boolean,
      default: !1
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: !1
    },
    autoFilterFocus: {
      type: Boolean,
      default: !1
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    focusOnHover: {
      type: Boolean,
      default: !0
    },
    highlightOnSelect: {
      type: Boolean,
      default: !0
    },
    checkmark: {
      type: Boolean,
      default: !1
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
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
  style: Kl,
  provide: function() {
    return {
      $pcSelect: this,
      $parentInstance: this
    };
  }
};
function rt(t) {
  "@babel/helpers - typeof";
  return rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, rt(t);
}
function Wl(t) {
  return Zl(t) || Yl(t) || ql(t) || Gl();
}
function Gl() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ql(t, e) {
  if (t) {
    if (typeof t == "string") return Gt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gt(t, e) : void 0;
  }
}
function Yl(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Zl(t) {
  if (Array.isArray(t)) return Gt(t);
}
function Gt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function Jn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Qn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Jn(Object(n), !0).forEach(function(o) {
      Oe(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Jn(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function Oe(t, e, n) {
  return (e = Jl(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Jl(t) {
  var e = Ql(t, "string");
  return rt(e) == "symbol" ? e : e + "";
}
function Ql(t, e) {
  if (rt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (rt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var qt = {
  name: "Select",
  extends: Ul,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "before-show", "before-hide", "show", "hide", "filter"],
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  labelClickListener: null,
  matchMediaOrientationListener: null,
  overlay: null,
  list: null,
  virtualScroller: null,
  searchTimeout: null,
  searchValue: null,
  isModelValueChanged: !1,
  data: function() {
    return {
      clicked: !1,
      focused: !1,
      focusedOptionIndex: -1,
      filterValue: null,
      overlayVisible: !1,
      queryOrientation: null
    };
  },
  watch: {
    modelValue: function() {
      this.isModelValueChanged = !0;
    },
    options: function() {
      this.autoUpdateModel();
    }
  },
  mounted: function() {
    this.autoUpdateModel(), this.bindLabelClickListener(), this.bindMatchMediaOrientationListener();
  },
  updated: function() {
    this.overlayVisible && this.isModelValueChanged && this.scrollInView(this.findSelectedOptionIndex()), this.isModelValueChanged = !1;
  },
  beforeUnmount: function() {
    this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindLabelClickListener(), this.unbindMatchMediaOrientationListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.overlay && (_t.clear(this.overlay), this.overlay = null);
  },
  methods: {
    getOptionIndex: function(e, n) {
      return this.virtualScrollerDisabled ? e : n && n(e).index;
    },
    getOptionLabel: function(e) {
      return this.optionLabel ? be(e, this.optionLabel) : e;
    },
    getOptionValue: function(e) {
      return this.optionValue ? be(e, this.optionValue) : e;
    },
    getOptionRenderKey: function(e, n) {
      return (this.dataKey ? be(e, this.dataKey) : this.getOptionLabel(e)) + "_" + n;
    },
    getPTItemOptions: function(e, n, o, r) {
      return this.ptm(r, {
        context: {
          option: e,
          index: o,
          selected: this.isSelected(e),
          focused: this.focusedOptionIndex === this.getOptionIndex(o, n),
          disabled: this.isOptionDisabled(e)
        }
      });
    },
    isOptionDisabled: function(e) {
      return this.optionDisabled ? be(e, this.optionDisabled) : !1;
    },
    isOptionGroup: function(e) {
      return this.optionGroupLabel && e.optionGroup && e.group;
    },
    getOptionGroupLabel: function(e) {
      return be(e, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(e) {
      return be(e, this.optionGroupChildren);
    },
    getAriaPosInset: function(e) {
      var n = this;
      return (this.optionGroupLabel ? e - this.visibleOptions.slice(0, e).filter(function(o) {
        return n.isOptionGroup(o);
      }).length : e) + 1;
    },
    show: function(e) {
      this.$emit("before-show"), this.overlayVisible = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), e && me(this.$refs.focusInput);
    },
    hide: function(e) {
      var n = this, o = function() {
        n.$emit("before-hide"), n.overlayVisible = !1, n.clicked = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.resetFilterOnHide && (n.filterValue = null), e && me(n.$refs.focusInput);
      };
      setTimeout(function() {
        o();
      }, 0);
    },
    onFocus: function(e) {
      this.disabled || (this.focused = !0, this.overlayVisible && (this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.editable ? -1 : this.findSelectedOptionIndex(), this.scrollInView(this.focusedOptionIndex)), this.$emit("focus", e));
    },
    onBlur: function(e) {
      var n = this;
      setTimeout(function() {
        var o, r;
        n.focused = !1, n.focusedOptionIndex = -1, n.searchValue = "", n.$emit("blur", e), (o = (r = n.formField).onBlur) === null || o === void 0 || o.call(r, e);
      }, 100);
    },
    onKeyDown: function(e) {
      var n = this;
      if (this.disabled) {
        e.preventDefault();
        return;
      }
      if (Ai())
        switch (e.code) {
          case "Backspace":
            this.onBackspaceKey(e, this.editable);
            break;
          case "Enter":
          case "NumpadDecimal":
            this.onEnterKey(e);
            break;
          default:
            e.preventDefault();
            return;
        }
      var o = e.metaKey || e.ctrlKey;
      switch (e.code) {
        case "ArrowDown":
          this.onArrowDownKey(e);
          break;
        case "ArrowUp":
          this.onArrowUpKey(e, this.editable);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(e, this.editable);
          break;
        case "Home":
          this.onHomeKey(e, this.editable);
          break;
        case "End":
          this.onEndKey(e, this.editable);
          break;
        case "PageDown":
          this.onPageDownKey(e);
          break;
        case "PageUp":
          this.onPageUpKey(e);
          break;
        case "Space":
          this.onSpaceKey(e, this.editable);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(e);
          break;
        case "Escape":
          this.onEscapeKey(e);
          break;
        case "Tab":
          this.onTabKey(e);
          break;
        case "Backspace":
          this.onBackspaceKey(e, this.editable);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          break;
        default:
          !o && pi(e.key) && (!this.overlayVisible && this.show(), !this.editable && this.searchOptions(e, e.key), this.filter && this.$nextTick(function() {
            n.$refs.filterInput && me(n.$refs.filterInput.$el);
          }));
          break;
      }
      this.clicked = !1;
    },
    onEditableInput: function(e) {
      var n = e.target.value;
      this.searchValue = "";
      var o = this.searchOptions(e, n);
      !o && (this.focusedOptionIndex = -1), this.updateModel(e, n), !this.overlayVisible && x(n) && this.show();
    },
    onContainerClick: function(e) {
      this.disabled || this.loading || e.target.tagName === "INPUT" || e.target.getAttribute("data-pc-section") === "clearicon" || e.target.closest('[data-pc-section="clearicon"]') || ((!this.overlay || !this.overlay.contains(e.target)) && (this.overlayVisible ? this.hide(!0) : this.show(!0)), this.clicked = !0);
    },
    onClearClick: function(e) {
      this.updateModel(e, null), this.resetFilterOnClear && (this.filterValue = null);
    },
    onFirstHiddenFocus: function(e) {
      var n = e.relatedTarget === this.$refs.focusInput ? Ii(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      me(n);
    },
    onLastHiddenFocus: function(e) {
      var n = e.relatedTarget === this.$refs.focusInput ? Pi(this.overlay, ':not([data-p-hidden-focusable="true"])') : this.$refs.focusInput;
      me(n);
    },
    onOptionSelect: function(e, n) {
      var o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (this.overlayVisible) {
        var r = this.getOptionValue(n);
        this.updateModel(e, r), o && this.hide(!0);
      }
    },
    onOptionMouseMove: function(e, n) {
      this.focusOnHover && this.changeFocusedOptionIndex(e, n);
    },
    onFilterChange: function(e) {
      var n = e.target.value;
      this.filterValue = n, this.focusedOptionIndex = -1, this.$emit("filter", {
        originalEvent: e,
        value: n
      }), !this.virtualScrollerDisabled && this.virtualScroller.scrollToIndex(0);
    },
    onFilterKeyDown: function(e) {
      if (!e.isComposing)
        switch (e.code) {
          case "ArrowDown":
            this.onArrowDownKey(e);
            break;
          case "ArrowUp":
            this.onArrowUpKey(e, !0);
            break;
          case "ArrowLeft":
          case "ArrowRight":
            this.onArrowLeftKey(e, !0);
            break;
          case "Home":
            this.onHomeKey(e, !0);
            break;
          case "End":
            this.onEndKey(e, !0);
            break;
          case "Enter":
          case "NumpadEnter":
            this.onEnterKey(e);
            break;
          case "Escape":
            this.onEscapeKey(e);
            break;
          case "Tab":
            this.onTabKey(e);
            break;
        }
    },
    onFilterBlur: function() {
      this.focusedOptionIndex = -1;
    },
    onFilterUpdated: function() {
      this.overlayVisible && this.alignOverlay();
    },
    onOverlayClick: function(e) {
      na.emit("overlay-click", {
        originalEvent: e,
        target: this.$el
      });
    },
    onOverlayKeyDown: function(e) {
      switch (e.code) {
        case "Escape":
          this.onEscapeKey(e);
          break;
      }
    },
    onArrowDownKey: function(e) {
      if (!this.overlayVisible)
        this.show(), this.editable && this.changeFocusedOptionIndex(e, this.findSelectedOptionIndex());
      else {
        var n = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();
        this.changeFocusedOptionIndex(e, n);
      }
      e.preventDefault();
    },
    onArrowUpKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (e.altKey && !n)
        this.focusedOptionIndex !== -1 && this.onOptionSelect(e, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(), e.preventDefault();
      else {
        var o = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.clicked ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();
        this.changeFocusedOptionIndex(e, o), !this.overlayVisible && this.show(), e.preventDefault();
      }
    },
    onArrowLeftKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var o = e.currentTarget;
        e.shiftKey ? o.setSelectionRange(0, e.target.selectionStart) : (o.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else
        this.changeFocusedOptionIndex(e, this.findFirstOptionIndex()), !this.overlayVisible && this.show();
      e.preventDefault();
    },
    onEndKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var o = e.currentTarget;
        if (e.shiftKey)
          o.setSelectionRange(e.target.selectionStart, o.value.length);
        else {
          var r = o.value.length;
          o.setSelectionRange(r, r), this.focusedOptionIndex = -1;
        }
      } else
        this.changeFocusedOptionIndex(e, this.findLastOptionIndex()), !this.overlayVisible && this.show();
      e.preventDefault();
    },
    onPageUpKey: function(e) {
      this.scrollInView(0), e.preventDefault();
    },
    onPageDownKey: function(e) {
      this.scrollInView(this.visibleOptions.length - 1), e.preventDefault();
    },
    onEnterKey: function(e) {
      this.overlayVisible ? (this.focusedOptionIndex !== -1 && this.onOptionSelect(e, this.visibleOptions[this.focusedOptionIndex]), this.hide(!0)) : (this.focusedOptionIndex = -1, this.onArrowDownKey(e)), e.preventDefault();
    },
    onSpaceKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      !n && this.onEnterKey(e);
    },
    onEscapeKey: function(e) {
      this.overlayVisible && this.hide(!0), e.preventDefault(), e.stopPropagation();
    },
    onTabKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n || (this.overlayVisible && this.hasFocusableElements() ? (me(this.$refs.firstHiddenFocusableElementOnOverlay), e.preventDefault()) : (this.focusedOptionIndex !== -1 && this.onOptionSelect(e, this.visibleOptions[this.focusedOptionIndex]), this.overlayVisible && this.hide(this.filter)));
    },
    onBackspaceKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && !this.overlayVisible && this.show();
    },
    onOverlayEnter: function(e) {
      var n = this;
      _t.set("overlay", e, this.$primevue.config.zIndex.overlay), wi(e, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.scrollInView(), this.$attrSelector && e.setAttribute(this.$attrSelector, ""), setTimeout(function() {
        n.autoFilterFocus && n.filter && me(n.$refs.filterInput.$el), n.autoUpdateModel();
      }, 1);
    },
    onOverlayAfterEnter: function() {
      this.bindOutsideClickListener(), this.bindScrollListener(), this.bindResizeListener(), this.$emit("show");
    },
    onOverlayLeave: function(e) {
      var n = this;
      e.style.pointerEvents = "none", this.unbindOutsideClickListener(), this.unbindScrollListener(), this.unbindResizeListener(), this.autoFilterFocus && this.filter && !this.editable && this.$nextTick(function() {
        n.$refs.filterInput && me(n.$refs.filterInput.$el);
      }), this.$emit("hide"), this.overlay = null;
    },
    onOverlayAfterLeave: function(e) {
      _t.clear(e);
    },
    alignOverlay: function() {
      this.appendTo === "self" ? $i(this.overlay, this.$el) : this.overlay && (this.overlay.style.minWidth = yo(this.$el) + "px", Si(this.overlay, this.$el));
    },
    bindOutsideClickListener: function() {
      var e = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var o = n.composedPath();
        e.overlayVisible && e.overlay && !o.includes(e.$el) && !o.includes(e.overlay) && e.hide();
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var e = this;
      this.scrollHandler || (this.scrollHandler = new ta(this.$refs.container, function() {
        e.overlayVisible && e.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = function() {
        e.overlayVisible && !Ei() && e.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    bindLabelClickListener: function() {
      var e = this;
      if (!this.editable && !this.labelClickListener) {
        var n = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        n && bt(n) && (this.labelClickListener = function() {
          me(e.$refs.focusInput);
        }, n.addEventListener("click", this.labelClickListener));
      }
    },
    unbindLabelClickListener: function() {
      if (this.labelClickListener) {
        var e = document.querySelector('label[for="'.concat(this.labelId, '"]'));
        e && bt(e) && e.removeEventListener("click", this.labelClickListener);
      }
    },
    bindMatchMediaOrientationListener: function() {
      var e = this;
      if (!this.matchMediaOrientationListener) {
        var n = matchMedia("(orientation: portrait)");
        this.queryOrientation = n, this.matchMediaOrientationListener = function() {
          e.alignOverlay();
        }, this.queryOrientation.addEventListener("change", this.matchMediaOrientationListener);
      }
    },
    unbindMatchMediaOrientationListener: function() {
      this.matchMediaOrientationListener && (this.queryOrientation.removeEventListener("change", this.matchMediaOrientationListener), this.queryOrientation = null, this.matchMediaOrientationListener = null);
    },
    hasFocusableElements: function() {
      return tn(this.overlay, ':not([data-p-hidden-focusable="true"])').length > 0;
    },
    isOptionExactMatched: function(e) {
      var n;
      return this.isValidOption(e) && typeof this.getOptionLabel(e) == "string" && ((n = this.getOptionLabel(e)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale)) == this.searchValue.toLocaleLowerCase(this.filterLocale);
    },
    isOptionStartsWith: function(e) {
      var n;
      return this.isValidOption(e) && typeof this.getOptionLabel(e) == "string" && ((n = this.getOptionLabel(e)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function(e) {
      return x(e) && !(this.isOptionDisabled(e) || this.isOptionGroup(e));
    },
    isValidSelectedOption: function(e) {
      return this.isValidOption(e) && this.isSelected(e);
    },
    isSelected: function(e) {
      return fo(this.d_value, this.getOptionValue(e), this.equalityKey);
    },
    findFirstOptionIndex: function() {
      var e = this;
      return this.visibleOptions.findIndex(function(n) {
        return e.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var e = this;
      return vn(this.visibleOptions, function(n) {
        return e.isValidOption(n);
      });
    },
    findNextOptionIndex: function(e) {
      var n = this, o = e < this.visibleOptions.length - 1 ? this.visibleOptions.slice(e + 1).findIndex(function(r) {
        return n.isValidOption(r);
      }) : -1;
      return o > -1 ? o + e + 1 : e;
    },
    findPrevOptionIndex: function(e) {
      var n = this, o = e > 0 ? vn(this.visibleOptions.slice(0, e), function(r) {
        return n.isValidOption(r);
      }) : -1;
      return o > -1 ? o : e;
    },
    findSelectedOptionIndex: function() {
      var e = this;
      return this.visibleOptions.findIndex(function(n) {
        return e.isValidSelectedOption(n);
      });
    },
    findFirstFocusedOptionIndex: function() {
      var e = this.findSelectedOptionIndex();
      return e < 0 ? this.findFirstOptionIndex() : e;
    },
    findLastFocusedOptionIndex: function() {
      var e = this.findSelectedOptionIndex();
      return e < 0 ? this.findLastOptionIndex() : e;
    },
    searchOptions: function(e, n) {
      var o = this;
      this.searchValue = (this.searchValue || "") + n;
      var r = -1, i = !1;
      return x(this.searchValue) && (r = this.visibleOptions.findIndex(function(a) {
        return o.isOptionExactMatched(a);
      }), r === -1 && (r = this.visibleOptions.findIndex(function(a) {
        return o.isOptionStartsWith(a);
      })), r !== -1 && (i = !0), r === -1 && this.focusedOptionIndex === -1 && (r = this.findFirstFocusedOptionIndex()), r !== -1 && this.changeFocusedOptionIndex(e, r)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        o.searchValue = "", o.searchTimeout = null;
      }, 500), i;
    },
    changeFocusedOptionIndex: function(e, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && this.onOptionSelect(e, this.visibleOptions[n], !1));
    },
    scrollInView: function() {
      var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var o = n !== -1 ? "".concat(e.$id, "_").concat(n) : e.focusedOptionId, r = $t(e.list, 'li[id="'.concat(o, '"]'));
        r ? r.scrollIntoView && r.scrollIntoView({
          block: "nearest",
          inline: "nearest"
        }) : e.virtualScrollerDisabled || e.virtualScroller && e.virtualScroller.scrollToIndex(n !== -1 ? n : e.focusedOptionIndex);
      });
    },
    autoUpdateModel: function() {
      this.autoOptionFocus && (this.focusedOptionIndex = this.findFirstFocusedOptionIndex()), this.selectOnFocus && this.autoOptionFocus && !this.$filled && this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex], !1);
    },
    updateModel: function(e, n) {
      this.writeValue(n, e), this.$emit("change", {
        originalEvent: e,
        value: n
      });
    },
    flatOptions: function(e) {
      var n = this;
      return (e || []).reduce(function(o, r, i) {
        o.push({
          optionGroup: r,
          group: !0,
          index: i
        });
        var a = n.getOptionGroupChildren(r);
        return a && a.forEach(function(l) {
          return o.push(l);
        }), o;
      }, []);
    },
    overlayRef: function(e) {
      this.overlay = e;
    },
    listRef: function(e, n) {
      this.list = e, n && n(e);
    },
    virtualScrollerRef: function(e) {
      this.virtualScroller = e;
    }
  },
  computed: {
    visibleOptions: function() {
      var e = this, n = this.optionGroupLabel ? this.flatOptions(this.options) : this.options || [];
      if (this.filterValue) {
        var o = qi.filter(n, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
        if (this.optionGroupLabel) {
          var r = this.options || [], i = [];
          return r.forEach(function(a) {
            var l = e.getOptionGroupChildren(a), s = l.filter(function(u) {
              return o.includes(u);
            });
            s.length > 0 && i.push(Qn(Qn({}, a), {}, Oe({}, typeof e.optionGroupChildren == "string" ? e.optionGroupChildren : "items", Wl(s))));
          }), this.flatOptions(i);
        }
        return o;
      }
      return n;
    },
    // @deprecated use $filled instead
    hasSelectedOption: function() {
      return this.$filled;
    },
    label: function() {
      var e = this.findSelectedOptionIndex();
      return e !== -1 ? this.getOptionLabel(this.visibleOptions[e]) : this.placeholder || "p-emptylabel";
    },
    editableInputValue: function() {
      var e = this.findSelectedOptionIndex();
      return e !== -1 ? this.getOptionLabel(this.visibleOptions[e]) : this.d_value || "";
    },
    equalityKey: function() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function() {
      return x(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function() {
      return this.$filled ? this.selectionMessageText.replaceAll("{0}", "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.$id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function() {
      var e = this;
      return this.visibleOptions.filter(function(n) {
        return !e.isOptionGroup(n);
      }).length;
    },
    isClearIconVisible: function() {
      return this.showClear && this.d_value != null && !this.disabled && !this.loading;
    },
    virtualScrollerDisabled: function() {
      return !this.virtualScrollerOptions;
    },
    containerDataP: function() {
      return ae(Oe({
        invalid: this.$invalid,
        disabled: this.disabled,
        focus: this.focused,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    },
    labelDataP: function() {
      return ae(Oe(Oe({
        placeholder: !this.editable && this.label === this.placeholder,
        clearable: this.showClear,
        disabled: this.disabled,
        editable: this.editable
      }, this.size, this.size), "empty", !this.editable && !this.$slots.value && (this.label === "p-emptylabel" || this.label.length === 0)));
    },
    dropdownIconDataP: function() {
      return ae(Oe({}, this.size, this.size));
    },
    overlayDataP: function() {
      return ae(Oe({}, "portal-" + this.appendTo, "portal-" + this.appendTo));
    }
  },
  directives: {
    ripple: on
  },
  components: {
    InputText: ln,
    VirtualScroller: Uo,
    Portal: nn,
    InputIcon: Bo,
    IconField: Ro,
    TimesIcon: an,
    ChevronDownIcon: Mo,
    SpinnerIcon: Ot,
    SearchIcon: Do,
    CheckIcon: No,
    BlankIcon: Fo
  }
}, Xl = ["id", "data-p"], eu = ["name", "id", "value", "placeholder", "tabindex", "disabled", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "data-p"], tu = ["name", "id", "tabindex", "aria-label", "aria-labelledby", "aria-expanded", "aria-controls", "aria-activedescendant", "aria-invalid", "aria-disabled", "data-p"], nu = ["data-p"], ou = ["id"], ru = ["id"], iu = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onMousedown", "onMousemove", "data-p-selected", "data-p-focused", "data-p-disabled"];
function su(t, e, n, o, r, i) {
  var a = Q("SpinnerIcon"), l = Q("InputText"), s = Q("SearchIcon"), u = Q("InputIcon"), d = Q("IconField"), c = Q("CheckIcon"), p = Q("BlankIcon"), f = Q("VirtualScroller"), h = Q("Portal"), g = Jt("ripple");
  return S(), O("div", v({
    ref: "container",
    id: t.$id,
    class: t.cx("root"),
    onClick: e[12] || (e[12] = function() {
      return i.onContainerClick && i.onContainerClick.apply(i, arguments);
    }),
    "data-p": i.containerDataP
  }, t.ptmi("root")), [t.editable ? (S(), O("input", v({
    key: 0,
    ref: "focusInput",
    name: t.name,
    id: t.labelId || t.inputId,
    type: "text",
    class: [t.cx("label"), t.inputClass, t.labelClass],
    style: [t.inputStyle, t.labelStyle],
    value: i.editableInputValue,
    placeholder: t.placeholder,
    tabindex: t.disabled ? -1 : t.tabindex,
    disabled: t.disabled,
    autocomplete: "off",
    role: "combobox",
    "aria-label": t.ariaLabel,
    "aria-labelledby": t.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": r.overlayVisible,
    "aria-controls": r.overlayVisible ? t.$id + "_list" : void 0,
    "aria-activedescendant": r.focused ? i.focusedOptionId : void 0,
    "aria-invalid": t.invalid || void 0,
    onFocus: e[0] || (e[0] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: e[1] || (e[1] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: e[2] || (e[2] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    onInput: e[3] || (e[3] = function() {
      return i.onEditableInput && i.onEditableInput.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, t.ptm("label")), null, 16, eu)) : (S(), O("span", v({
    key: 1,
    ref: "focusInput",
    name: t.name,
    id: t.labelId || t.inputId,
    class: [t.cx("label"), t.inputClass, t.labelClass],
    style: [t.inputStyle, t.labelStyle],
    tabindex: t.disabled ? -1 : t.tabindex,
    role: "combobox",
    "aria-label": t.ariaLabel || (i.label === "p-emptylabel" ? void 0 : i.label),
    "aria-labelledby": t.ariaLabelledby,
    "aria-haspopup": "listbox",
    "aria-expanded": r.overlayVisible,
    "aria-controls": t.$id + "_list",
    "aria-activedescendant": r.focused ? i.focusedOptionId : void 0,
    "aria-invalid": t.invalid || void 0,
    "aria-disabled": t.disabled,
    onFocus: e[4] || (e[4] = function() {
      return i.onFocus && i.onFocus.apply(i, arguments);
    }),
    onBlur: e[5] || (e[5] = function() {
      return i.onBlur && i.onBlur.apply(i, arguments);
    }),
    onKeydown: e[6] || (e[6] = function() {
      return i.onKeyDown && i.onKeyDown.apply(i, arguments);
    }),
    "data-p": i.labelDataP
  }, t.ptm("label")), [T(t.$slots, "value", {
    value: t.d_value,
    placeholder: t.placeholder
  }, function() {
    var m;
    return [Fe(oe(i.label === "p-emptylabel" ? " " : (m = i.label) !== null && m !== void 0 ? m : "empty"), 1)];
  })], 16, tu)), i.isClearIconVisible ? T(t.$slots, "clearicon", {
    key: 2,
    class: _e(t.cx("clearIcon")),
    clearCallback: i.onClearClick
  }, function() {
    return [(S(), H(mt(t.clearIcon ? "i" : "TimesIcon"), v({
      ref: "clearIcon",
      class: [t.cx("clearIcon"), t.clearIcon],
      onClick: i.onClearClick
    }, t.ptm("clearIcon"), {
      "data-pc-section": "clearicon"
    }), null, 16, ["class", "onClick"]))];
  }) : F("", !0), j("div", v({
    class: t.cx("dropdown")
  }, t.ptm("dropdown")), [t.loading ? T(t.$slots, "loadingicon", {
    key: 0,
    class: _e(t.cx("loadingIcon"))
  }, function() {
    return [t.loadingIcon ? (S(), O("span", v({
      key: 0,
      class: [t.cx("loadingIcon"), "pi-spin", t.loadingIcon],
      "aria-hidden": "true"
    }, t.ptm("loadingIcon")), null, 16)) : (S(), H(a, v({
      key: 1,
      class: t.cx("loadingIcon"),
      spin: "",
      "aria-hidden": "true"
    }, t.ptm("loadingIcon")), null, 16, ["class"]))];
  }) : T(t.$slots, "dropdownicon", {
    key: 1,
    class: _e(t.cx("dropdownIcon"))
  }, function() {
    return [(S(), H(mt(t.dropdownIcon ? "span" : "ChevronDownIcon"), v({
      class: [t.cx("dropdownIcon"), t.dropdownIcon],
      "aria-hidden": "true",
      "data-p": i.dropdownIconDataP
    }, t.ptm("dropdownIcon")), null, 16, ["class", "data-p"]))];
  })], 16), re(h, {
    appendTo: t.appendTo
  }, {
    default: pe(function() {
      return [re(io, v({
        name: "p-anchored-overlay",
        onEnter: i.onOverlayEnter,
        onAfterEnter: i.onOverlayAfterEnter,
        onLeave: i.onOverlayLeave,
        onAfterLeave: i.onOverlayAfterLeave
      }, t.ptm("transition")), {
        default: pe(function() {
          return [r.overlayVisible ? (S(), O("div", v({
            key: 0,
            ref: i.overlayRef,
            class: [t.cx("overlay"), t.panelClass, t.overlayClass],
            style: [t.panelStyle, t.overlayStyle],
            onClick: e[10] || (e[10] = function() {
              return i.onOverlayClick && i.onOverlayClick.apply(i, arguments);
            }),
            onKeydown: e[11] || (e[11] = function() {
              return i.onOverlayKeyDown && i.onOverlayKeyDown.apply(i, arguments);
            }),
            "data-p": i.overlayDataP
          }, t.ptm("overlay")), [j("span", v({
            ref: "firstHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: e[7] || (e[7] = function() {
              return i.onFirstHiddenFocus && i.onFirstHiddenFocus.apply(i, arguments);
            })
          }, t.ptm("hiddenFirstFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16), T(t.$slots, "header", {
            value: t.d_value,
            options: i.visibleOptions
          }), t.filter ? (S(), O("div", v({
            key: 0,
            class: t.cx("header")
          }, t.ptm("header")), [re(d, {
            unstyled: t.unstyled,
            pt: t.ptm("pcFilterContainer")
          }, {
            default: pe(function() {
              return [re(l, {
                ref: "filterInput",
                type: "text",
                value: r.filterValue,
                onVnodeMounted: i.onFilterUpdated,
                onVnodeUpdated: i.onFilterUpdated,
                class: _e(t.cx("pcFilter")),
                placeholder: t.filterPlaceholder,
                variant: t.variant,
                unstyled: t.unstyled,
                role: "searchbox",
                autocomplete: "off",
                "aria-owns": t.$id + "_list",
                "aria-activedescendant": i.focusedOptionId,
                onKeydown: i.onFilterKeyDown,
                onBlur: i.onFilterBlur,
                onInput: i.onFilterChange,
                pt: t.ptm("pcFilter"),
                formControl: {
                  novalidate: !0
                }
              }, null, 8, ["value", "onVnodeMounted", "onVnodeUpdated", "class", "placeholder", "variant", "unstyled", "aria-owns", "aria-activedescendant", "onKeydown", "onBlur", "onInput", "pt"]), re(u, {
                unstyled: t.unstyled,
                pt: t.ptm("pcFilterIconContainer")
              }, {
                default: pe(function() {
                  return [T(t.$slots, "filtericon", {}, function() {
                    return [t.filterIcon ? (S(), O("span", v({
                      key: 0,
                      class: t.filterIcon
                    }, t.ptm("filterIcon")), null, 16)) : (S(), H(s, Sr(v({
                      key: 1
                    }, t.ptm("filterIcon"))), null, 16))];
                  })];
                }),
                _: 3
              }, 8, ["unstyled", "pt"])];
            }),
            _: 3
          }, 8, ["unstyled", "pt"]), j("span", v({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, t.ptm("hiddenFilterResult"), {
            "data-p-hidden-accessible": !0
          }), oe(i.filterResultMessageText), 17)], 16)) : F("", !0), j("div", v({
            class: t.cx("listContainer"),
            style: {
              "max-height": i.virtualScrollerDisabled ? t.scrollHeight : ""
            }
          }, t.ptm("listContainer")), [re(f, v({
            ref: i.virtualScrollerRef
          }, t.virtualScrollerOptions, {
            items: i.visibleOptions,
            style: {
              height: t.scrollHeight
            },
            tabindex: -1,
            disabled: i.virtualScrollerDisabled,
            pt: t.ptm("virtualScroller")
          }), wr({
            content: pe(function(m) {
              var y = m.styleClass, w = m.contentRef, C = m.items, b = m.getItemOptions, $ = m.contentStyle, A = m.itemSize;
              return [j("ul", v({
                ref: function(L) {
                  return i.listRef(L, w);
                },
                id: t.$id + "_list",
                class: [t.cx("list"), y],
                style: $,
                role: "listbox"
              }, t.ptm("list")), [(S(!0), O(Ie, null, xt(C, function(_, L) {
                return S(), O(Ie, {
                  key: i.getOptionRenderKey(_, i.getOptionIndex(L, b))
                }, [i.isOptionGroup(_) ? (S(), O("li", v({
                  key: 0,
                  id: t.$id + "_" + i.getOptionIndex(L, b),
                  style: {
                    height: A ? A + "px" : void 0
                  },
                  class: t.cx("optionGroup"),
                  role: "option"
                }, {
                  ref_for: !0
                }, t.ptm("optionGroup")), [T(t.$slots, "optiongroup", {
                  option: _.optionGroup,
                  index: i.getOptionIndex(L, b)
                }, function() {
                  return [j("span", v({
                    class: t.cx("optionGroupLabel")
                  }, {
                    ref_for: !0
                  }, t.ptm("optionGroupLabel")), oe(i.getOptionGroupLabel(_.optionGroup)), 17)];
                })], 16, ru)) : Qt((S(), O("li", v({
                  key: 1,
                  id: t.$id + "_" + i.getOptionIndex(L, b),
                  class: t.cx("option", {
                    option: _,
                    focusedOption: i.getOptionIndex(L, b)
                  }),
                  style: {
                    height: A ? A + "px" : void 0
                  },
                  role: "option",
                  "aria-label": i.getOptionLabel(_),
                  "aria-selected": i.isSelected(_),
                  "aria-disabled": i.isOptionDisabled(_),
                  "aria-setsize": i.ariaSetSize,
                  "aria-posinset": i.getAriaPosInset(i.getOptionIndex(L, b)),
                  onMousedown: function(R) {
                    return i.onOptionSelect(R, _);
                  },
                  onMousemove: function(R) {
                    return i.onOptionMouseMove(R, i.getOptionIndex(L, b));
                  },
                  onClick: e[8] || (e[8] = so(function() {
                  }, ["stop"])),
                  "data-p-selected": !t.checkmark && i.isSelected(_),
                  "data-p-focused": r.focusedOptionIndex === i.getOptionIndex(L, b),
                  "data-p-disabled": i.isOptionDisabled(_)
                }, {
                  ref_for: !0
                }, i.getPTItemOptions(_, b, L, "option")), [t.checkmark ? (S(), O(Ie, {
                  key: 0
                }, [i.isSelected(_) ? (S(), H(c, v({
                  key: 0,
                  class: t.cx("optionCheckIcon")
                }, {
                  ref_for: !0
                }, t.ptm("optionCheckIcon")), null, 16, ["class"])) : (S(), H(p, v({
                  key: 1,
                  class: t.cx("optionBlankIcon")
                }, {
                  ref_for: !0
                }, t.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : F("", !0), T(t.$slots, "option", {
                  option: _,
                  selected: i.isSelected(_),
                  index: i.getOptionIndex(L, b)
                }, function() {
                  return [j("span", v({
                    class: t.cx("optionLabel")
                  }, {
                    ref_for: !0
                  }, t.ptm("optionLabel")), oe(i.getOptionLabel(_)), 17)];
                })], 16, iu)), [[g]])], 64);
              }), 128)), r.filterValue && (!C || C && C.length === 0) ? (S(), O("li", v({
                key: 0,
                class: t.cx("emptyMessage"),
                role: "option"
              }, t.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [T(t.$slots, "emptyfilter", {}, function() {
                return [Fe(oe(i.emptyFilterMessageText), 1)];
              })], 16)) : !t.options || t.options && t.options.length === 0 ? (S(), O("li", v({
                key: 1,
                class: t.cx("emptyMessage"),
                role: "option"
              }, t.ptm("emptyMessage"), {
                "data-p-hidden-accessible": !0
              }), [T(t.$slots, "empty", {}, function() {
                return [Fe(oe(i.emptyMessageText), 1)];
              })], 16)) : F("", !0)], 16, ou)];
            }),
            _: 2
          }, [t.$slots.loader ? {
            name: "loader",
            fn: pe(function(m) {
              var y = m.options;
              return [T(t.$slots, "loader", {
                options: y
              })];
            }),
            key: "0"
          } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), T(t.$slots, "footer", {
            value: t.d_value,
            options: i.visibleOptions
          }), !t.options || t.options && t.options.length === 0 ? (S(), O("span", v({
            key: 1,
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, t.ptm("hiddenEmptyMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(i.emptyMessageText), 17)) : F("", !0), j("span", v({
            role: "status",
            "aria-live": "polite",
            class: "p-hidden-accessible"
          }, t.ptm("hiddenSelectedMessage"), {
            "data-p-hidden-accessible": !0
          }), oe(i.selectedMessageText), 17), j("span", v({
            ref: "lastHiddenFocusableElementOnOverlay",
            role: "presentation",
            "aria-hidden": "true",
            class: "p-hidden-accessible p-hidden-focusable",
            tabindex: 0,
            onFocus: e[9] || (e[9] = function() {
              return i.onLastHiddenFocus && i.onLastHiddenFocus.apply(i, arguments);
            })
          }, t.ptm("hiddenLastFocusableEl"), {
            "data-p-hidden-accessible": !0,
            "data-p-hidden-focusable": !0
          }), null, 16)], 16, nu)) : F("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onAfterEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo"])], 16, Xl);
}
qt.render = su;
var au = `
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`, lu = {
  root: function(e) {
    var n = e.props;
    return ["p-message p-component p-message-" + n.severity, {
      "p-message-outlined": n.variant === "outlined",
      "p-message-simple": n.variant === "simple",
      "p-message-sm": n.size === "small",
      "p-message-lg": n.size === "large"
    }];
  },
  contentWrapper: "p-message-content-wrapper",
  content: "p-message-content",
  icon: "p-message-icon",
  text: "p-message-text",
  closeButton: "p-message-close-button",
  closeIcon: "p-message-close-icon"
}, uu = E.extend({
  name: "message",
  style: au,
  classes: lu
}), du = {
  name: "BaseMessage",
  extends: we,
  props: {
    severity: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: !1
    },
    life: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: void 0
    },
    closeIcon: {
      type: String,
      default: void 0
    },
    closeButtonProps: {
      type: null,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  style: uu,
  provide: function() {
    return {
      $pcMessage: this,
      $parentInstance: this
    };
  }
};
function it(t) {
  "@babel/helpers - typeof";
  return it = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, it(t);
}
function Xn(t, e, n) {
  return (e = cu(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function cu(t) {
  var e = pu(t, "string");
  return it(e) == "symbol" ? e : e + "";
}
function pu(t, e) {
  if (it(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (it(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Yt = {
  name: "Message",
  extends: du,
  inheritAttrs: !1,
  emits: ["close", "life-end"],
  timeout: null,
  data: function() {
    return {
      visible: !0
    };
  },
  mounted: function() {
    var e = this;
    this.life && setTimeout(function() {
      e.visible = !1, e.$emit("life-end");
    }, this.life);
  },
  methods: {
    close: function(e) {
      this.visible = !1, this.$emit("close", e);
    }
  },
  computed: {
    closeAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    dataP: function() {
      return ae(Xn(Xn({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: on
  },
  components: {
    TimesIcon: an
  }
};
function st(t) {
  "@babel/helpers - typeof";
  return st = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, st(t);
}
function eo(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function to(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? eo(Object(n), !0).forEach(function(o) {
      fu(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : eo(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function fu(t, e, n) {
  return (e = hu(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function hu(t) {
  var e = mu(t, "string");
  return st(e) == "symbol" ? e : e + "";
}
function mu(t, e) {
  if (st(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (st(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var gu = ["data-p"], bu = ["data-p"], vu = ["data-p"], yu = ["aria-label", "data-p"], Su = ["data-p"];
function wu(t, e, n, o, r, i) {
  var a = Q("TimesIcon"), l = Jt("ripple");
  return S(), H(io, v({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: pe(function() {
      return [r.visible ? (S(), O("div", v({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": i.dataP
      }, t.ptm("root")), [j("div", v({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? T(t.$slots, "container", {
        key: 0,
        closeCallback: i.close
      }) : (S(), O("div", v({
        key: 1,
        class: t.cx("content"),
        "data-p": i.dataP
      }, t.ptm("content")), [T(t.$slots, "icon", {
        class: _e(t.cx("icon"))
      }, function() {
        return [(S(), H(mt(t.icon ? "span" : null), v({
          class: [t.cx("icon"), t.icon],
          "data-p": i.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (S(), O("div", v({
        key: 0,
        class: t.cx("text"),
        "data-p": i.dataP
      }, t.ptm("text")), [T(t.$slots, "default")], 16, vu)) : F("", !0), t.closable ? Qt((S(), O("button", v({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": i.closeAriaLabel,
        type: "button",
        onClick: e[0] || (e[0] = function(s) {
          return i.close(s);
        }),
        "data-p": i.dataP
      }, to(to({}, t.closeButtonProps), t.ptm("closeButton"))), [T(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (S(), O("i", v({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": i.dataP
        }, t.ptm("closeIcon")), null, 16, Su)) : (S(), H(a, v({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": i.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, yu)), [[l]]) : F("", !0)], 16, bu))], 16)], 16, gu)) : F("", !0)];
    }),
    _: 3
  }, 16);
}
Yt.render = wu;
function Zt(t) {
  const e = t?.error || "Storage request failed";
  return {
    error: e,
    savedNotice: t?.saved ? `Storage policy was saved. ${e}` : ""
  };
}
function no(t) {
  const e = t?.response?.data;
  if (e?.error || e?.saved) return Zt(e);
  const n = t instanceof Error && t.message ? t.message : String(t || "Storage request failed");
  return Zt({ error: n });
}
const $u = {
  class: "storage-s3",
  "aria-labelledby": "storage-s3-title"
}, Ou = {
  key: 2,
  role: "status"
}, ku = { key: 0 }, Cu = { class: "storage-s3-actions" }, _u = /* @__PURE__ */ $r({
  __name: "storage",
  setup(t) {
    const e = W({ mode: "local", resource_id: "", prefix: "uploads" }), n = W([]), o = W(!0), r = W(!1), i = W(!1), a = W(""), l = W("");
    let s = "";
    const u = [{ label: "Keep processed files locally", value: "local" }, { label: "Move processed files to S3", value: "s3" }], d = pn(() => JSON.stringify(e.value) !== s), c = pn(() => e.value.mode === "local" || n.value.some((h) => h.id === e.value.resource_id) && e.value.prefix.length > 0 && e.value.prefix.length <= 256 && e.value.prefix.split("/").every((h) => h !== "" && h !== "." && h !== "..") && /^[a-zA-Z0-9_/.\-]+$/.test(e.value.prefix));
    ze(e, () => {
      l.value = "";
    }, { deep: !0 });
    async function p() {
      o.value = !0, a.value = "";
      try {
        const [h, g] = await Promise.all([
          ut.get("/api/v1/settings?namespace=kickside.storage_s3"),
          ut.get("/api/v1/storage-s3")
        ]);
        if (!h.data?.success) throw new Error(h.data?.error || "Could not load the storage policy");
        if (!g.data?.success) throw new Error(g.data?.error || "Could not load destinations");
        const m = h.data.settings?.find((y) => y.key === "policy")?.value;
        return e.value = m ? { ...m } : { mode: "local", resource_id: "", prefix: "uploads" }, n.value = g.data.resources || [], s = JSON.stringify(e.value), r.value = !0, !0;
      } catch (h) {
        return a.value = no(h).error, !1;
      } finally {
        o.value = !1;
      }
    }
    async function f(h) {
      i.value = !0, a.value = "", l.value = "";
      try {
        const g = h === "reset" ? await ut.delete("/api/v1/storage-s3") : await ut.post(h === "test" ? "/api/v1/storage-s3/test" : "/api/v1/storage-s3", { ...e.value });
        if (!g.data?.success) {
          const m = Zt(g.data);
          m.savedNotice && (await p(), l.value = m.savedNotice), a.value = m.error;
          return;
        }
        if (h !== "test" && !await p()) return;
        l.value = h === "test" ? "Upload, size verification, and deletion succeeded." : h === "reset" ? "Future file placement is disabled. Existing S3 files remain readable." : "Storage policy saved.";
      } catch (g) {
        const m = no(g);
        m.savedNotice && (await p(), l.value = m.savedNotice), a.value = m.error;
      } finally {
        i.value = !1;
      }
    }
    return oo(p), (h, g) => (S(), O("main", $u, [
      g[11] || (g[11] = j("header", null, [
        j("h2", { id: "storage-s3-title" }, "S3 storage"),
        j("p", null, "Move original files and their derived content to private S3 storage after processing. Attachments and Knowledge references keep their existing addresses.")
      ], -1)),
      a.value ? (S(), H(de(Yt), {
        key: 0,
        severity: "error",
        closable: !1,
        role: "alert"
      }, {
        default: pe(() => [
          Fe(oe(a.value), 1)
        ]),
        _: 1
      })) : F("", !0),
      l.value ? (S(), H(de(Yt), {
        key: 1,
        severity: "success",
        closable: !1,
        role: "status"
      }, {
        default: pe(() => [
          Fe(oe(l.value), 1)
        ]),
        _: 1
      })) : F("", !0),
      o.value ? (S(), O("p", Ou, "Loading storage settings…")) : r.value ? (S(), O("form", {
        key: 3,
        onSubmit: g[5] || (g[5] = so((m) => f("save"), ["prevent"]))
      }, [
        g[9] || (g[9] = j("label", { id: "storage-s3-mode-label" }, "Processed file storage", -1)),
        re(de(qt), {
          modelValue: e.value.mode,
          "onUpdate:modelValue": g[0] || (g[0] = (m) => e.value.mode = m),
          options: u,
          "option-label": "label",
          "option-value": "value",
          "aria-labelledby": "storage-s3-mode-label",
          disabled: i.value
        }, null, 8, ["modelValue", "disabled"]),
        e.value.mode === "s3" ? (S(), O(Ie, { key: 0 }, [
          g[6] || (g[6] = j("label", { id: "storage-s3-destination-label" }, "Destination", -1)),
          re(de(qt), {
            modelValue: e.value.resource_id,
            "onUpdate:modelValue": g[1] || (g[1] = (m) => e.value.resource_id = m),
            options: n.value,
            "option-label": "title",
            "option-value": "id",
            placeholder: "Select a configured destination",
            "aria-labelledby": "storage-s3-destination-label",
            disabled: i.value
          }, null, 8, ["modelValue", "options", "disabled"]),
          n.value.length ? F("", !0) : (S(), O("p", ku, "No S3 destination is declared by this host.")),
          g[7] || (g[7] = j("label", { for: "storage-s3-prefix" }, "Folder prefix", -1)),
          re(de(ln), {
            id: "storage-s3-prefix",
            modelValue: e.value.prefix,
            "onUpdate:modelValue": g[2] || (g[2] = (m) => e.value.prefix = m),
            disabled: i.value,
            maxlength: "256",
            "aria-describedby": "storage-s3-prefix-help"
          }, null, 8, ["modelValue", "disabled"]),
          g[8] || (g[8] = j("small", { id: "storage-s3-prefix-help" }, "Use a relative folder path, such as uploads or processed/files.", -1))
        ], 64)) : F("", !0),
        g[10] || (g[10] = j("p", null, "Changes apply to future processing. Disabling placement keeps existing files at their saved destinations.", -1)),
        j("div", Cu, [
          e.value.mode === "s3" ? (S(), H(de(Ve), {
            key: 0,
            type: "button",
            label: "Test storage",
            severity: "secondary",
            disabled: i.value || !c.value,
            onClick: g[3] || (g[3] = (m) => f("test"))
          }, null, 8, ["disabled"])) : F("", !0),
          re(de(Ve), {
            type: "submit",
            label: "Save",
            loading: i.value,
            disabled: i.value || !d.value || !c.value
          }, null, 8, ["loading", "disabled"]),
          re(de(Ve), {
            type: "button",
            label: "Reset to local storage",
            severity: "secondary",
            disabled: i.value,
            onClick: g[4] || (g[4] = (m) => f("reset"))
          }, null, 8, ["disabled"]),
          a.value ? (S(), H(de(Ve), {
            key: 1,
            type: "button",
            label: "Reload",
            severity: "secondary",
            disabled: i.value,
            onClick: p
          }, null, 8, ["disabled"])) : F("", !0)
        ])
      ], 32)) : F("", !0),
      a.value && !r.value ? (S(), H(de(Ve), {
        key: 4,
        label: "Reload",
        severity: "secondary",
        disabled: i.value || o.value,
        onClick: p
      }, null, 8, ["disabled"])) : F("", !0)
    ]));
  }
}), Iu = ":host{display:block;height:100%;min-height:0;color:var(--p-text-color)}.storage-s3{box-sizing:border-box;height:100%;overflow:auto;padding:1.5rem;background:var(--p-content-background)}.storage-s3 header,.storage-s3 form{max-width:48rem}.storage-s3 h2{margin:0 0 .75rem;font-size:1.25rem}.storage-s3 p,.storage-s3 small{color:var(--p-text-muted-color);line-height:1.5}.storage-s3 form{display:grid;gap:.75rem;margin-top:1.25rem}.storage-s3 label{font-weight:600}.storage-s3-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.5rem}";
class Pu extends ri {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: {} },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl"],
      inlineCss: Iu
    };
  }
  static get vueConfig() {
    return { rootComponent: _u, plugins: [ha] };
  }
}
xr(import.meta.url, Pu);
//# sourceMappingURL=index.js.map
