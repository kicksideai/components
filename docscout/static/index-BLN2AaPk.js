import { hasInjectionContext as rr, inject as ft, effectScope as or, ref as q, markRaw as ir, createApp as ar, readonly as sr, getCurrentInstance as wt, onMounted as lr, nextTick as dr, watch as Se, reactive as cr, renderSlot as K, openBlock as R, createBlock as Ye, Teleport as ln, createCommentVNode as $e, useId as ur, mergeProps as T, h as pr, createElementBlock as le, createElementVNode as fr, createTextVNode as mr, toDisplayString as dn, resolveComponent as _t, resolveDirective as hr, withDirectives as br, resolveDynamicComponent as gr, withCtx as vr, normalizeClass as St } from "vue";
import { addCollection as yr } from "@iconify/vue";
import { config as kt, addIcons as xr, on as wr, applyThemeMode as Be, host as _r, hostCss as Sr, loadCss as kr, api as ae } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var ot = "data-wippy-visible";
function $t(e) {
  const t = e.getAttribute(ot);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var $r = Object.defineProperty, Pr = (e, t, n) => t in e ? $r(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, O = (e, t, n) => Pr(e, typeof t != "symbol" ? t + "" : t, n), Cr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Or = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Pt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Tr(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [l, s] of Object.entries(o)) {
            const i = typeof s == "string" ? Pt(l) : null;
            i && t.add(i);
          }
          continue;
        }
        const a = typeof o == "string" ? Pt(r) : null;
        a && t.add(a);
      }
  return [...t].sort();
}
function Er(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Or} {
${t}
}`;
}
function Ar(e, t) {
  const n = Er(t);
  n && cn(e, n, "@wippy-fe/css-variables-bridge");
}
function jr(e, t) {
  const r = (t ?? Cr).map(async (o) => {
    const a = Sr[o];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await kr(a);
    } catch (l) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${a}):`, l), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const a of o) {
      if (!a)
        continue;
      const l = document.createElement("style");
      l.textContent = a, l.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(l);
    }
  });
}
function Nr(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function cn(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function Lr(e, t) {
  cn(e, t, "@wippy-fe/custom-css");
}
function un(e) {
  return e.__wippyHost ?? null;
}
function zr(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Ir(e, t, n) {
  switch (n.type) {
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
        return n.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function et(e, t) {
  const n = {}, r = [];
  for (const [o, a] of Object.entries(t.properties)) {
    const l = e.getAttribute(o), s = zr(o);
    if (l === null) {
      a.default !== void 0 && (n[s] = a.default);
      continue;
    }
    const i = Ir(o, l, a);
    i.error ? r.push(i.error) : n[s] = i.value;
  }
  return { props: n, errors: r };
}
var Vr = class {
  constructor(e, t) {
    O(this, "_props"), O(this, "_errors"), O(this, "_content"), O(this, "_hostVisibility"), O(this, "_propsListeners", /* @__PURE__ */ new Set()), O(this, "_contentListeners", /* @__PURE__ */ new Set()), O(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), O(this, "_disposed", !1), O(this, "_emitToDom"), O(this, "props"), O(this, "events"), O(this, "content"), O(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(r, o) {
        return n._subscribeProps(r, o);
      }
    }, this.events = {
      emit(r, o) {
        n._disposed || n._emitToDom(r, o);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(r, o) {
        return n._subscribeContent(r, o);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(r, o) {
        return n._subscribeHostVisibility(r, o);
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
}, Rr = class extends HTMLElement {
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), n = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...n, ot])];
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
    return un(this);
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
      let n, r;
      if (this._lastProps !== null)
        n = this._lastProps, r = this._lastErrors;
      else {
        const a = et(this, e.propsSchema);
        e.validateProps && a.errors.push(...e.validateProps(a.props)), n = a.props, r = a.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new Vr(
        { props: n, errors: r, content: o, hasContent: t, hostVisibility: this._hostVisible },
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
      let r;
      if (t)
        r = this._container;
      else {
        this.onInit(n), e.inlineCss && Nr(n, e.inlineCss);
        try {
          const d = kt?.theming, c = Tr(
            d?.global?.cssVariables,
            d?.children?.cssVariables
          );
          Ar(n, c);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const d = kt?.theming, c = [d?.global?.customCSS, d?.children?.customCSS].filter(Boolean).join(`
`);
            c && Lr(n, c);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && jr(n, e.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const i = e.containerClasses ?? [];
        i.length > 0 && r.classList.add(...i), n.appendChild(r), this._container = r, xr(yr);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = wr("@theme", (i) => this._applyTheme(i)));
      const { props: o, errors: a } = et(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(o));
      const l = o;
      this._lastProps = l, this._lastErrors = a;
      let s = null;
      e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(e.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, l, a, s, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = _r.getThemeMode?.()) {
    Be(e, this), this._container && Be(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Be("auto", this), this._container && Be("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === ot) {
      const s = this._hostVisible, i = $t(this);
      if (i === s)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, s), this.onHostVisibilityChanged(i, s));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: a } = et(this, r.propsSchema);
    r.validateProps && a.push(...r.validateProps(o));
    const l = o;
    this._lastProps = l, this._lastErrors = a, this._reactive?.notifyProps(l, a), this.onPropsChanged(l, a);
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
function Mr(e) {
  return e.__wippyHostBus ?? null;
}
function Dr(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.1.0
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let pn;
const fn = (e) => pn = e, Fr = () => rr() && ft(mn) || pn, mn = (
  /* istanbul ignore next */
  Symbol()
);
function Br() {
  const e = or(!0), t = e.run(() => q({}));
  let n = [], r = [];
  const o = ir({
    install(a) {
      fn(o), o._a = a, a.provide(mn, o), a.config.globalProperties.$pinia = o, r.forEach((l) => n.push(l)), r = [];
    },
    use(a) {
      return this._a ? n.push(a) : r.push(a), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var Ur = Object.defineProperty, Hr = (e, t, n) => t in e ? Ur(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ge = (e, t, n) => Hr(e, typeof t != "symbol" ? t + "" : t, n), hn = /* @__PURE__ */ Symbol("wippy:emit"), bn = /* @__PURE__ */ Symbol("wippy:props"), Wr = /* @__PURE__ */ Symbol("wippy:props_error"), qr = /* @__PURE__ */ Symbol("wippy:content"), Kr = /* @__PURE__ */ Symbol("wippy:panel-id"), Yr = /* @__PURE__ */ Symbol("wippy:layout-bus"), Gr = /* @__PURE__ */ Symbol("wippy:host"), Jr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Ua() {
  const e = ft(bn);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function Ha() {
  const e = ft(hn);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
var Qr = class extends Rr {
  constructor() {
    super(...arguments), ge(this, "_vueApp", null), ge(this, "_propsRef", q({})), ge(this, "_errorsRef", q([])), ge(this, "_contentRef", q(null)), ge(this, "_hostVisibilityRef", q(null)), ge(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, r, o, a) {
    const l = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const d of r)
      this.emitEvent("invalid", { message: d });
    const s = new AbortController();
    this._bridgeAbort = s, this.reactive.props.subscribe((d, c) => {
      this._propsRef.value = d, this._errorsRef.value = [...c];
      for (const u of c)
        this.emitEvent("invalid", { message: u });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((d) => {
      this._contentRef.value = d;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((d) => {
      this._hostVisibilityRef.value = d;
    }, { signal: s.signal });
    const i = (d) => {
      if (s.signal.aborted)
        return;
      const c = Fr(), u = ar(d.rootComponent);
      this._vueApp = u;
      const p = Br();
      if (d.piniaPlugins)
        for (const f of d.piniaPlugins)
          p.use(f);
      if (u.use(p), d.plugins)
        for (const f of d.plugins)
          u.use(f);
      u.provide(bn, this._propsRef), u.provide(Wr, this._errorsRef), u.provide(hn, this.emitEvent.bind(this)), u.provide(qr, this._contentRef), u.provide(Jr, this._hostVisibilityRef), u.provide(Kr, Dr(this)), u.provide(Yr, Mr(this)), u.provide(Gr, un(this)), d.providers && d.providers(u, this), u.mount(t), c && fn(c);
    };
    if (l.rootComponent)
      i(l);
    else if (l.lazyConfig) {
      const d = document.createElement("wippy-loading");
      d.setAttribute("no-bg", ""), t.appendChild(d), l.lazyConfig().then((c) => {
        s.signal.aborted || (d.remove(), i(c));
      }).catch((c) => {
        if (s.signal.aborted)
          return;
        const u = c instanceof Error ? c.message : String(c), p = document.createElement("wippy-error");
        p.setAttribute("title", "Failed to load"), p.setAttribute("message", u), d.replaceWith(p), this.emitEvent("error", { message: u });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, Zr = Object.defineProperty, Ct = Object.getOwnPropertySymbols, Xr = Object.prototype.hasOwnProperty, eo = Object.prototype.propertyIsEnumerable, Ot = (e, t, n) => t in e ? Zr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, to = (e, t) => {
  for (var n in t || (t = {})) Xr.call(t, n) && Ot(e, n, t[n]);
  if (Ct) for (var n of Ct(t)) eo.call(t, n) && Ot(e, n, t[n]);
  return e;
};
function pe(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function mt(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function P(e) {
  return !pe(e);
}
function U(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function gn(e = {}, t = {}) {
  let n = to({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    U(t[o]) && o in e && U(e[o]) ? n[o] = gn(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function no(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : gn(t, n), {});
}
function z(e, ...t) {
  return mt(e) ? e(...t) : e;
}
function L(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function B(e) {
  return L(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function ht(e, t = "", n = {}) {
  let r = B(t).split("."), o = r.shift();
  if (o) {
    if (U(e)) {
      let a = Object.keys(e).find((l) => B(l) === o) || "";
      return ht(z(e[a], n), r.join("."), n);
    }
    return;
  }
  return z(e, n);
}
function vn(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function ro(e) {
  return P(e) && !isNaN(e);
}
function de(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function oo(...e) {
  return no(...e);
}
function Pe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function io(e) {
  return L(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function yn(e) {
  return L(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function xn() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let r = e.get(t);
    return r ? r.push(n) : r = [n], e.set(t, r), this;
  }, off(t, n) {
    let r = e.get(t);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let r = e.get(t);
    r && r.forEach((o) => {
      o(n);
    });
  }, clear() {
    e.clear();
  } };
}
function ce(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") t.push(r);
      else if (o === "object") {
        let a = Array.isArray(r) ? [ce(...r)] : Object.entries(r).map(([l, s]) => s ? l : void 0);
        t = a.length ? t.concat(a.filter((l) => !!l)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function ao(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function so(e, t) {
  if (e && t) {
    let n = (r) => {
      ao(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function tt(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Tt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function lo(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function co(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function uo(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && co(e));
}
function De(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Ge(e, t = {}) {
  if (De(e)) {
    let n = (r, o) => {
      var a, l;
      let s = (a = e?.$attrs) != null && a[r] ? [(l = e?.$attrs) == null ? void 0 : l[r]] : [];
      return [o].flat().reduce((i, d) => {
        if (d != null) {
          let c = typeof d;
          if (c === "string" || c === "number") i.push(d);
          else if (c === "object") {
            let u = Array.isArray(d) ? n(r, d) : Object.entries(d).map(([p, f]) => r === "style" && (f || f === 0) ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}` : f ? p : void 0);
            i = u.length ? i.concat(u.filter((p) => !!p)) : i;
          }
        }
        return i;
      }, s);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let a = r.match(/^on(.+)/);
        a ? e.addEventListener(a[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Ge(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function po(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return Ge(r, t), r.append(...n), r;
  }
}
function fo(e, t) {
  return De(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function mo(e, t) {
  if (De(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Et(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function ho(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Tt(document.documentElement) || Tt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function bo(e, t) {
  return e ? e.offsetHeight : 0;
}
function At(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function wn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function go(e, t = "", n) {
  De(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ue = {};
function vo(e = "pui_id_") {
  return Object.hasOwn(Ue, e) || (Ue[e] = 0), Ue[e]++, `${e}${Ue[e]}`;
}
var yo = Object.defineProperty, xo = Object.defineProperties, wo = Object.getOwnPropertyDescriptors, Je = Object.getOwnPropertySymbols, _n = Object.prototype.hasOwnProperty, Sn = Object.prototype.propertyIsEnumerable, jt = (e, t, n) => t in e ? yo(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, M = (e, t) => {
  for (var n in t || (t = {})) _n.call(t, n) && jt(e, n, t[n]);
  if (Je) for (var n of Je(t)) Sn.call(t, n) && jt(e, n, t[n]);
  return e;
}, nt = (e, t) => xo(e, wo(t)), W = (e, t) => {
  var n = {};
  for (var r in e) _n.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Je) for (var r of Je(e)) t.indexOf(r) < 0 && Sn.call(e, r) && (n[r] = e[r]);
  return n;
}, _o = xn(), A = _o, Ce = /{([^}]*)}/g, kn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, $n = /var\([^)]+\)/g;
function Nt(e) {
  return L(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function So(e) {
  return U(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function ko(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function it(e = "", t = "") {
  return ko(`${L(e, !1) && L(t, !1) ? `${e}-` : e}${t}`);
}
function Pn(e = "", t = "") {
  return `--${it(e, t)}`;
}
function $o(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function Cn(e, t = "", n = "", r = [], o) {
  if (L(e)) {
    let a = e.trim();
    if ($o(a)) return;
    if (de(a, Ce)) {
      let l = a.replaceAll(Ce, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((d) => !r.some((c) => de(d, c)));
        return `var(${Pn(n, yn(i.join("-")))}${P(o) ? `, ${o}` : ""})`;
      });
      return de(l.replace($n, "0"), kn) ? `calc(${l})` : l;
    }
    return a;
  } else if (ro(e)) return e;
}
function Po(e, t, n) {
  L(t, !1) && e.push(`${t}:${n};`);
}
function ve(e, t) {
  return e ? `${e}{${t}}` : "";
}
function On(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(l, s) {
    let i = [], d = 0, c = "", u = null, p = 0;
    for (; d <= l.length; ) {
      let f = l[d];
      if ((f === '"' || f === "'" || f === "`") && l[d - 1] !== "\\" && (u = u === f ? null : f), !u && (f === "(" && p++, f === ")" && p--, (f === "," || d === l.length) && p === 0)) {
        let h = c.trim();
        h.startsWith("dt(") ? i.push(On(h, s)) : i.push(r(h)), c = "", d++;
        continue;
      }
      f !== void 0 && (c += f), d++;
    }
    return i;
  }
  function r(l) {
    let s = l[0];
    if ((s === '"' || s === "'" || s === "`") && l[l.length - 1] === s) return l.slice(1, -1);
    let i = Number(l);
    return isNaN(i) ? l : i;
  }
  let o = [], a = [];
  for (let l = 0; l < e.length; l++) if (e[l] === "d" && e.slice(l, l + 3) === "dt(") a.push(l), l += 2;
  else if (e[l] === ")" && a.length > 0) {
    let s = a.pop();
    a.length === 0 && o.push([s, l]);
  }
  if (!o.length) return e;
  for (let l = o.length - 1; l >= 0; l--) {
    let [s, i] = o[l], d = e.slice(s + 3, i), c = n(d, t), u = t(...c);
    e = e.slice(0, s) + u + e.slice(i + 1);
  }
  return e;
}
var ue = (...e) => Co(k.getTheme(), ...e), Co = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: a } = k.defaults || {}, { prefix: l, transform: s } = e?.options || a || {}, i = de(t, Ce) ? t : `{${t}}`;
    return r === "value" || pe(r) && s === "strict" ? k.getTokenValue(t) : Cn(i, void 0, l, [o.excludedKeyRegex], n);
  }
  return "";
};
function He(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, a) => {
      var l;
      return r + o + ((l = z(t[a], { dt: ue })) != null ? l : "");
    }, "");
    return On(n, ue);
  }
  return z(e, { dt: ue });
}
function Oo(e, t = {}) {
  let n = k.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: a = n.excludedKeyRegex } = t, l = [], s = [], i = [{ node: e, path: r }];
  for (; i.length; ) {
    let { node: c, path: u } = i.pop();
    for (let p in c) {
      let f = c[p], h = So(f), g = de(p, a) ? it(u) : it(u, yn(p));
      if (U(h)) i.push({ node: h, path: g });
      else {
        let b = Pn(g), v = Cn(h, g, r, [a]);
        Po(s, b, v);
        let _ = g;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), l.push(_.replace(/-/g, "."));
      }
    }
  }
  let d = s.join("");
  return { value: s, tokens: l, declarations: d, css: ve(o, d) };
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
  let t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [e].flat().map((n) => {
    var r;
    return (r = t.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Oo(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a, l, s, i, d, c, u;
  let { preset: p, options: f } = t, h, g, b, v, _, $, m;
  if (P(p) && f.transform !== "strict") {
    let { primitive: x, semantic: E, extend: I } = p, Y = E || {}, { colorScheme: G } = Y, ee = W(Y, ["colorScheme"]), J = I || {}, { colorScheme: te } = J, ne = W(J, ["colorScheme"]), Q = G || {}, { dark: re } = Q, fe = W(Q, ["dark"]), oe = te || {}, { dark: me } = oe, he = W(oe, ["dark"]), H = P(x) ? this._toVariables({ primitive: x }, f) : {}, D = P(ee) ? this._toVariables({ semantic: ee }, f) : {}, ie = P(fe) ? this._toVariables({ light: fe }, f) : {}, Fe = P(re) ? this._toVariables({ dark: re }, f) : {}, be = P(ne) ? this._toVariables({ semantic: ne }, f) : {}, yt = P(he) ? this._toVariables({ light: he }, f) : {}, xt = P(me) ? this._toVariables({ dark: me }, f) : {}, [Mn, Dn] = [(a = H.declarations) != null ? a : "", H.tokens], [Fn, Bn] = [(l = D.declarations) != null ? l : "", D.tokens || []], [Un, Hn] = [(s = ie.declarations) != null ? s : "", ie.tokens || []], [Wn, qn] = [(i = Fe.declarations) != null ? i : "", Fe.tokens || []], [Kn, Yn] = [(d = be.declarations) != null ? d : "", be.tokens || []], [Gn, Jn] = [(c = yt.declarations) != null ? c : "", yt.tokens || []], [Qn, Zn] = [(u = xt.declarations) != null ? u : "", xt.tokens || []];
    h = this.transformCSS(e, Mn, "light", "variable", f, r, o), g = Dn;
    let Xn = this.transformCSS(e, `${Fn}${Un}`, "light", "variable", f, r, o), er = this.transformCSS(e, `${Wn}`, "dark", "variable", f, r, o);
    b = `${Xn}${er}`, v = [.../* @__PURE__ */ new Set([...Bn, ...Hn, ...qn])];
    let tr = this.transformCSS(e, `${Kn}${Gn}color-scheme:light`, "light", "variable", f, r, o), nr = this.transformCSS(e, `${Qn}color-scheme:dark`, "dark", "variable", f, r, o);
    _ = `${tr}${nr}`, $ = [.../* @__PURE__ */ new Set([...Yn, ...Jn, ...Zn])], m = z(p.css, { dt: ue });
  }
  return { primitive: { css: h, tokens: g }, semantic: { css: b, tokens: v }, global: { css: _, tokens: $ }, style: m };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: a, selector: l }) {
  var s, i, d;
  let c, u, p;
  if (P(t) && n.transform !== "strict") {
    let f = e.replace("-directive", ""), h = t, { colorScheme: g, extend: b, css: v } = h, _ = W(h, ["colorScheme", "extend", "css"]), $ = b || {}, { colorScheme: m } = $, x = W($, ["colorScheme"]), E = g || {}, { dark: I } = E, Y = W(E, ["dark"]), G = m || {}, { dark: ee } = G, J = W(G, ["dark"]), te = P(_) ? this._toVariables({ [f]: M(M({}, _), x) }, n) : {}, ne = P(Y) ? this._toVariables({ [f]: M(M({}, Y), J) }, n) : {}, Q = P(I) ? this._toVariables({ [f]: M(M({}, I), ee) }, n) : {}, [re, fe] = [(s = te.declarations) != null ? s : "", te.tokens || []], [oe, me] = [(i = ne.declarations) != null ? i : "", ne.tokens || []], [he, H] = [(d = Q.declarations) != null ? d : "", Q.tokens || []], D = this.transformCSS(f, `${re}${oe}`, "light", "variable", n, o, a, l), ie = this.transformCSS(f, he, "dark", "variable", n, o, a, l);
    c = `${D}${ie}`, u = [.../* @__PURE__ */ new Set([...fe, ...me, ...H])], p = z(v, { dt: ue });
  }
  return { css: c, tokens: u, style: p };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a;
  let { preset: l, options: s } = t, i = (a = l?.components) == null ? void 0 : a[e];
  return this.getPreset({ name: e, preset: i, options: s, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a, l;
  let s = e.replace("-directive", ""), { preset: i, options: d } = t, c = ((a = i?.components) == null ? void 0 : a[s]) || ((l = i?.directives) == null ? void 0 : l[s]);
  return this.getPreset({ name: s, preset: c, options: d, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${z(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: a }) {
  let l = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: a }), s = Object.entries(r).reduce((i, [d, c]) => i.push(`${d}="${c}"`) && i, []).join(" ");
  return Object.entries(l || {}).reduce((i, [d, c]) => {
    if (U(c) && Object.hasOwn(c, "css")) {
      let u = Pe(c.css), p = `${d}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${p}" ${s}>${u}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: a }) {
  var l;
  let s = { name: e, theme: t, params: n, set: o, defaults: a }, i = (l = e.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : l.css, d = Object.entries(r).reduce((c, [u, p]) => c.push(`${u}="${p}"`) && c, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${d}>${Pe(i)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let a = function(s, i = {}, d = []) {
    if (d.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    d.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let c = this.value;
    if (typeof this.value == "string" && Ce.test(this.value)) {
      let u = this.value.trim().replace(Ce, (p) => {
        var f;
        let h = p.slice(1, -1), g = this.tokens[h];
        if (!g) return console.warn(`Token not found for path: ${h}`), "__UNRESOLVED__";
        let b = g.computed(s, i, d);
        return Array.isArray(b) && b.length === 2 ? `light-dark(${b[0].value},${b[1].value})` : (f = b?.value) != null ? f : "__UNRESOLVED__";
      });
      c = kn.test(u.replace($n, "0")) ? `calc(${u})` : u;
    }
    return pe(i.binding) && delete i.binding, d.pop(), { colorScheme: s, path: this.path, paths: i, value: c.includes("__UNRESOLVED__") ? void 0 : c };
  }, l = (s, i, d) => {
    Object.entries(s).forEach(([c, u]) => {
      let p = de(c, t.variable.excludedKeyRegex) ? i : i ? `${i}.${Nt(c)}` : Nt(c), f = d ? `${d}.${c}` : c;
      U(u) ? l(u, p, f) : (o[p] || (o[p] = { paths: [], computed: (h, g = {}, b = []) => {
        if (o[p].paths.length === 1) return o[p].paths[0].computed(o[p].paths[0].scheme, g.binding, b);
        if (h && h !== "none") for (let v = 0; v < o[p].paths.length; v++) {
          let _ = o[p].paths[v];
          if (_.scheme === h) return _.computed(h, g.binding, b);
        }
        return o[p].paths.map((v) => v.computed(v.scheme, g[v.scheme], b));
      } }), o[p].paths.push({ path: f, value: u, scheme: f.includes("colorScheme.light") ? "light" : f.includes("colorScheme.dark") ? "dark" : "none", computed: a, tokens: o }));
    });
  };
  return l(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((s) => s.split(".").filter((i) => !de(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), a = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, l = [(r = e[o]) == null ? void 0 : r.computed(a)].flat().filter((s) => s);
  return l.length === 1 ? l[0].value : l.reduce((s = {}, i) => {
    let d = i, { colorScheme: c } = d, u = W(d, ["colorScheme"]);
    return s[c] = u, s;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? ve(P(t) ? `${e}${t},${e} ${t}` : e, r) : ve(e, ve(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, a, l, s) {
  if (P(t)) {
    let { cssLayer: i } = o;
    if (r !== "style") {
      let d = this.getColorSchemeOption(o, l);
      t = n === "dark" ? d.reduce((c, { type: u, selector: p }) => (P(p) && (c += p.includes("[CSS]") ? p.replace("[CSS]", t) : this.getSelectorRule(p, s, u, t)), c), "") : ve(s ?? ":root,:host", t);
    }
    if (i) {
      let d = { name: "primeui" };
      U(i) && (d.name = z(i.name, { name: e, type: r })), P(d.name) && (t = ve(`@layer ${d.name}`, t), a?.layerNames(d.name));
    }
    return t;
  }
  return "";
} }, k = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = nt(M({}, t), { options: M(M({}, this.defaults.options), t.options) }), this._tokens = V.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), A.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = nt(M({}, this.theme), { preset: e }), this._tokens = V.createTokens(e, this.defaults), this.clearLoadedStyleNames(), A.emit("preset:change", e), A.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = nt(M({}, this.theme), { options: e }), this.clearLoadedStyleNames(), A.emit("options:change", e), A.emit("theme:change", this.theme);
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
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPresetD(n);
}, getCustomPreset(e = "", t, n, r) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return V.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return V.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", r) {
  return V.transformCSS(e, t, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return V.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return V.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), A.emit(`theme:${t}:load`, e), !this._loadingStyles.size && A.emit("theme:load"));
} }, j = {
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
}, To = `
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
function Oe(e) {
  "@babel/helpers - typeof";
  return Oe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oe(e);
}
function Lt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function zt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Lt(Object(n), !0).forEach(function(r) {
      Eo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Lt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Eo(e, t, n) {
  return (t = Ao(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ao(e) {
  var t = jo(e, "string");
  return Oe(t) == "symbol" ? t : t + "";
}
function jo(e, t) {
  if (Oe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Oe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function No(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  wt() && wt().components ? lr(e) : t ? e() : dr(e);
}
var Lo = 0;
function zo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = q(!1), r = q(e), o = q(null), a = wn() ? window.document : void 0, l = t.document, s = l === void 0 ? a : l, i = t.immediate, d = i === void 0 ? !0 : i, c = t.manual, u = c === void 0 ? !1 : c, p = t.name, f = p === void 0 ? "style_".concat(++Lo) : p, h = t.id, g = h === void 0 ? void 0 : h, b = t.media, v = b === void 0 ? void 0 : b, _ = t.nonce, $ = _ === void 0 ? void 0 : _, m = t.first, x = m === void 0 ? !1 : m, E = t.onMounted, I = E === void 0 ? void 0 : E, Y = t.onUpdated, G = Y === void 0 ? void 0 : Y, ee = t.onLoad, J = ee === void 0 ? void 0 : ee, te = t.props, ne = te === void 0 ? {} : te, Q = function() {
  }, re = function(me) {
    var he = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var H = zt(zt({}, ne), he), D = H.name || f, ie = H.id || g, Fe = H.nonce || $;
      o.value = s.querySelector('style[data-primevue-style-id="'.concat(D, '"]')) || s.getElementById(ie) || s.createElement("style"), o.value.isConnected || (r.value = me || e, Ge(o.value, {
        type: "text/css",
        id: ie,
        media: v,
        nonce: Fe
      }), x ? s.head.prepend(o.value) : s.head.appendChild(o.value), go(o.value, "data-primevue-style-id", D), Ge(o.value, H), o.value.onload = function(be) {
        return J?.(be, {
          name: D
        });
      }, I?.(D)), !n.value && (Q = Se(r, function(be) {
        o.value.textContent = be, G?.(D);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, fe = function() {
    !s || !n.value || (Q(), uo(o.value) && s.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return d && !u && No(re), {
    id: g,
    name: f,
    el: o,
    css: r,
    unload: fe,
    load: re,
    isLoaded: sr(n)
  };
}
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
var It, Vt, Rt, Mt;
function Dt(e, t) {
  return Mo(e) || Ro(e, t) || Vo(e, t) || Io();
}
function Io() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Vo(e, t) {
  if (e) {
    if (typeof e == "string") return Ft(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ft(e, t) : void 0;
  }
}
function Ft(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Ro(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, d = !1;
    try {
      if (a = (n = n.call(e)).next, t !== 0) for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw o;
      }
    }
    return s;
  }
}
function Mo(e) {
  if (Array.isArray(e)) return e;
}
function Bt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function rt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Bt(Object(n), !0).forEach(function(r) {
      Do(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Bt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Do(e, t, n) {
  return (t = Fo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Fo(e) {
  var t = Bo(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function Bo(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function We(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Uo = function(t) {
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
}, Ho = {}, Wo = {}, C = {
  name: "base",
  css: Uo,
  style: To,
  classes: Ho,
  inlineStyles: Wo,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, o = r(He(It || (It = We(["", ""])), t));
    return P(o) ? zo(Pe(o), rt({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return k.transformCSS(n.name || t.name, "".concat(o).concat(He(Vt || (Vt = We(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return k.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return k.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return k.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return k.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return k.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = z(this.css, {
        dt: ue
      }) || "", o = Pe(He(Rt || (Rt = We(["", "", ""])), r, t)), a = Object.entries(n).reduce(function(l, s) {
        var i = Dt(s, 2), d = i[0], c = i[1];
        return l.push("".concat(d, '="').concat(c, '"')) && l;
      }, []).join(" ");
      return P(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return k.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [k.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = He(Mt || (Mt = We(["", ""])), z(this.style, {
        dt: ue
      })), l = Pe(k.transformCSS(o, a)), s = Object.entries(n).reduce(function(i, d) {
        var c = Dt(d, 2), u = c[0], p = c[1];
        return i.push("".concat(u, '="').concat(p, '"')) && i;
      }, []).join(" ");
      P(l) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(s, ">").concat(l, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return rt(rt({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, X = xn();
function Ee(e) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ee(e);
}
function Ut(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function qe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ut(Object(n), !0).forEach(function(r) {
      qo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ut(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function qo(e, t, n) {
  return (t = Ko(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ko(e) {
  var t = Yo(e, "string");
  return Ee(t) == "symbol" ? t : t + "";
}
function Yo(e, t) {
  if (Ee(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ee(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Go = {
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
    text: [j.STARTS_WITH, j.CONTAINS, j.NOT_CONTAINS, j.ENDS_WITH, j.EQUALS, j.NOT_EQUALS],
    numeric: [j.EQUALS, j.NOT_EQUALS, j.LESS_THAN, j.LESS_THAN_OR_EQUAL_TO, j.GREATER_THAN, j.GREATER_THAN_OR_EQUAL_TO],
    date: [j.DATE_IS, j.DATE_IS_NOT, j.DATE_BEFORE, j.DATE_AFTER]
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
}, Jo = Symbol();
function Qo(e, t) {
  var n = {
    config: cr(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(Jo, n), Zo(), Xo(e, n), n;
}
var ye = [];
function Zo() {
  A.clear(), ye.forEach(function(e) {
    return e?.();
  }), ye = [];
}
function Xo(e, t) {
  var n = q(!1), r = function() {
    var d;
    if (((d = t.config) === null || d === void 0 ? void 0 : d.theme) !== "none" && !k.isStyleNameLoaded("common")) {
      var c, u, p = ((c = C.getCommonTheme) === null || c === void 0 ? void 0 : c.call(C)) || {}, f = p.primitive, h = p.semantic, g = p.global, b = p.style, v = {
        nonce: (u = t.config) === null || u === void 0 || (u = u.csp) === null || u === void 0 ? void 0 : u.nonce
      };
      C.load(f?.css, qe({
        name: "primitive-variables"
      }, v)), C.load(h?.css, qe({
        name: "semantic-variables"
      }, v)), C.load(g?.css, qe({
        name: "global-variables"
      }, v)), C.loadStyle(qe({
        name: "global-style"
      }, v), b), k.setLoadedStyleName("common");
    }
  };
  A.on("theme:change", function(i) {
    n.value || (e.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var o = Se(t.config, function(i, d) {
    X.emit("config:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = Se(function() {
    return t.config.ripple;
  }, function(i, d) {
    X.emit("config:ripple:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = Se(function() {
    return t.config.theme;
  }, function(i, d) {
    n.value || k.setTheme(i), t.config.unstyled || r(), n.value = !1, X.emit("config:theme:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = Se(function() {
    return t.config.unstyled;
  }, function(i, d) {
    !i && t.config.theme && r(), X.emit("config:unstyled:change", {
      newValue: i,
      oldValue: d
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ye.push(o), ye.push(a), ye.push(l), ye.push(s);
}
var ei = {
  install: function(t, n) {
    var r = oo(Go, n);
    Qo(t, r);
  }
}, Tn = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = wn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function ti(e, t, n, r, o, a) {
  return a.inline ? K(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (R(), Ye(ln, {
    key: 1,
    to: n.appendTo
  }, [K(e.$slots, "default")], 8, ["to"])) : $e("", !0);
}
Tn.render = ti;
var Z = {
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
function ni() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = ur();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var Ht = C.extend({
  name: "common"
});
function Ae(e) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ae(e);
}
function ri(e) {
  return jn(e) || oi(e) || An(e) || En();
}
function oi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function xe(e, t) {
  return jn(e) || ii(e, t) || An(e, t) || En();
}
function En() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function An(e, t) {
  if (e) {
    if (typeof e == "string") return at(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? at(e, t) : void 0;
  }
}
function at(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ii(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, d = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw o;
      }
    }
    return s;
  }
}
function jn(e) {
  if (Array.isArray(e)) return e;
}
function Wt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Wt(Object(n), !0).forEach(function(r) {
      ke(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ke(e, t, n) {
  return (t = ai(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ai(e) {
  var t = si(e, "string");
  return Ae(t) == "symbol" ? t : t + "";
}
function si(e, t) {
  if (Ae(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ae(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Xe = {
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
        A.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        A.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, r, o, a, l, s, i, d, c, u, p = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, f = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, h = p ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = h || f) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (a = o.onBeforeCreate) === null || a === void 0 || a.call(o);
    var g = (l = this.$primevueConfig) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l._usept, b = g ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, v = g ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (d = this.$primevue) === null || d === void 0 || (d = d.config) === null || d === void 0 ? void 0 : d.pt;
    (c = v || b) === null || c === void 0 || (c = c[this.$.type.name]) === null || c === void 0 || (c = c.hooks) === null || c === void 0 || (u = c.onBeforeCreate) === null || u === void 0 || u.call(c), this.$attrSelector = ni(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = fo(De(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = w({
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
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), r?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return mt(t) ? t.apply(void 0, r) : T.apply(void 0, r);
    },
    _load: function() {
      Z.isStyleNameLoaded("base") || (C.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Z.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Z.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (Ht.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Z.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      P(t) && C.load(t, w({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!k.isStyleNameLoaded("common")) {
          var r, o, a = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, l = a.primitive, s = a.semantic, i = a.global, d = a.style;
          C.load(l?.css, w({
            name: "primitive-variables"
          }, this.$styleOptions)), C.load(s?.css, w({
            name: "semantic-variables"
          }, this.$styleOptions)), C.load(i?.css, w({
            name: "global-variables"
          }, this.$styleOptions)), C.loadStyle(w({
            name: "global-style"
          }, this.$styleOptions), d), k.setLoadedStyleName("common");
        }
        if (!k.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var c, u, p, f, h = ((c = this.$style) === null || c === void 0 || (u = c.getComponentTheme) === null || u === void 0 ? void 0 : u.call(c)) || {}, g = h.css, b = h.style;
          (p = this.$style) === null || p === void 0 || p.load(g, w({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (f = this.$style) === null || f === void 0 || f.loadStyle(w({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), b), k.setLoadedStyleName(this.$style.name);
        }
        if (!k.isStyleNameLoaded("layer-order")) {
          var v, _, $ = (v = this.$style) === null || v === void 0 || (_ = v.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(v);
          C.load($, w({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), k.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, a = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, l = a.css, s = (o = this.$style) === null || o === void 0 ? void 0 : o.load(l, w({
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
      Z.clearLoadedStyleNames(), A.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      A.off("theme:change", this._loadCoreStyles), A.off("theme:change", this._load), A.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return ht(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, l = /./g.test(r) && !!o[r.split(".")[0]], s = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = s.mergeSections, d = i === void 0 ? !0 : i, c = s.mergeProps, u = c === void 0 ? !1 : c, p = a ? l ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, f = l ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, w(w({}, o), {}, {
        global: p || {}
      })), h = this._getPTDatasets(r);
      return d || !d && f ? u ? this._mergeProps(u, p, f, h) : w(w(w({}, p), f), h) : w(w({}, f), h);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return T(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", a = r === "root" && P((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && w(w({}, r === "root" && w(w(ke({}, "".concat(o, "name"), B(a ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), a && ke({}, "".concat(o, "extend"), B(this.$.type.name))), {}, ke({}, "".concat(this.$attrSelector), ""))), {}, ke({}, "".concat(o, "section"), B(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return L(t) || vn(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, a = function(s) {
        var i, d = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, c = o ? o(s) : s, u = B(r), p = B(n.$name);
        return (i = d ? u !== p ? c?.[u] : void 0 : c?.[u]) !== null && i !== void 0 ? i : c;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: a(t.originalValue),
        value: a(t.value)
      } : a(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var a = function(g) {
        return n(g, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var l, s = t._usept || ((l = this.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, i = s.mergeSections, d = i === void 0 ? !0 : i, c = s.mergeProps, u = c === void 0 ? !1 : c, p = a(t.originalValue), f = a(t.value);
        return p === void 0 && f === void 0 ? void 0 : L(f) ? f : L(p) ? p : d || !d && f ? u ? this._mergeProps(u, p, f) : w(w({}, p), f) : f;
      }
      return a(t);
    },
    _useGlobalPT: function(t, n, r) {
      return this._usePT(this.globalPT, t, n, r);
    },
    _useDefaultPT: function(t, n, r) {
      return this._usePT(this.defaultPT, t, n, r);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, w(w({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = T(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, w({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, w(w({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, w(w({}, this.$params), r)), a = this._getOptionValue(Ht.inlineStyles, t, w(w({}, this.$params), r));
        return [a, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return z(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, w({}, n.$params)) || z(r, w({}, n.$params));
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
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var o = xe(r, 1), a = o[0];
        return n?.includes(a);
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
        var n = xe(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = xe(n, 2), o = r[0], a = r[1], l = o.split(":"), s = ri(l), i = at(s).slice(1);
        return i?.reduce(function(d, c, u, p) {
          return !d[c] && (d[c] = u === p.length - 1 ? a : {}), d[c];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = xe(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = xe(n, 2), o = r[0], a = r[1];
        return t[o] = a, t;
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
`, di = C.extend({
  name: "baseicon",
  css: li
});
function je(e) {
  "@babel/helpers - typeof";
  return je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, je(e);
}
function qt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Kt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? qt(Object(n), !0).forEach(function(r) {
      ci(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : qt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ci(e, t, n) {
  return (t = ui(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ui(e) {
  var t = pi(e, "string");
  return je(t) == "symbol" ? t : t + "";
}
function pi(e, t) {
  if (je(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (je(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var fi = {
  name: "BaseIcon",
  extends: Xe,
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
      var t = pe(this.label);
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
function Ne(e) {
  "@babel/helpers - typeof";
  return Ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ne(e);
}
function Yt(e, t) {
  return gi(e) || bi(e, t) || hi(e, t) || mi();
}
function mi() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hi(e, t) {
  if (e) {
    if (typeof e == "string") return Gt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gt(e, t) : void 0;
  }
}
function Gt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function bi(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, d = !1;
    try {
      if (a = (n = n.call(e)).next, t !== 0) for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      d = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw o;
      }
    }
    return s;
  }
}
function gi(e) {
  if (Array.isArray(e)) return e;
}
function Jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function S(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jt(Object(n), !0).forEach(function(r) {
      st(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Jt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function st(e, t, n) {
  return (t = vi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function vi(e) {
  var t = yi(e, "string");
  return Ne(t) == "symbol" ? t : t + "";
}
function yi(e, t) {
  if (Ne(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ne(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var y = {
  _getMeta: function() {
    return [U(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], z(U(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, a;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (a = n.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: ht,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var _ = y._getOptionValue.apply(y, arguments);
      return L(_) || vn(_) ? {
        class: _
      } : _;
    }, d = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, c = d.mergeSections, u = c === void 0 ? !0 : c, p = d.mergeProps, f = p === void 0 ? !1 : p, h = s ? y._useDefaultPT(r, r.defaultPT(), i, a, l) : void 0, g = y._usePT(r, y._getPT(o, r.$name), i, a, S(S({}, l), {}, {
      global: h || {}
    })), b = y._getPTDatasets(r, a);
    return u || !u && g ? f ? y._mergeProps(r, f, h, g, b) : S(S(S({}, h), g), b) : S(S({}, g), b);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return S(S({}, n === "root" && st({}, "".concat(r, "name"), B(t.$name))), {}, st({}, "".concat(r, "section"), B(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(l) {
      var s, i = r ? r(l) : l, d = B(n);
      return (s = i?.[d]) !== null && s !== void 0 ? s : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0, l = function(b) {
      return r(b, o, a);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, i = n._usept || ((s = t.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, d = i.mergeSections, c = d === void 0 ? !0 : d, u = i.mergeProps, p = u === void 0 ? !1 : u, f = l(n.originalValue), h = l(n.value);
      return f === void 0 && h === void 0 ? void 0 : L(h) ? h : L(f) ? f : c || !c && h ? p ? y._mergeProps(t, p, f, h) : S(S({}, f), h) : h;
    }
    return l(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return y._usePT(t, n, r, o, a);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, a = y._getConfig(r, o), l = {
      nonce: a == null || (t = a.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    y._loadCoreStyles(n, l), y._loadThemeStyles(n, l), y._loadScopedThemeStyles(n, l), y._removeThemeListeners(n), n.$loadStyles = function() {
      return y._loadThemeStyles(n, l);
    }, y._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!Z.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var a;
      C.loadCSS(o), (a = r.$style) === null || a === void 0 || a.loadCSS(o), Z.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!k.isStyleNameLoaded("common")) {
        var l, s, i = ((l = o.$style) === null || l === void 0 || (s = l.getCommonTheme) === null || s === void 0 ? void 0 : s.call(l)) || {}, d = i.primitive, c = i.semantic, u = i.global, p = i.style;
        C.load(d?.css, S({
          name: "primitive-variables"
        }, a)), C.load(c?.css, S({
          name: "semantic-variables"
        }, a)), C.load(u?.css, S({
          name: "global-variables"
        }, a)), C.loadStyle(S({
          name: "global-style"
        }, a), p), k.setLoadedStyleName("common");
      }
      if (!k.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var f, h, g, b, v = ((f = o.$style) === null || f === void 0 || (h = f.getDirectiveTheme) === null || h === void 0 ? void 0 : h.call(f)) || {}, _ = v.css, $ = v.style;
        (g = o.$style) === null || g === void 0 || g.load(_, S({
          name: "".concat(o.$style.name, "-variables")
        }, a)), (b = o.$style) === null || b === void 0 || b.loadStyle(S({
          name: "".concat(o.$style.name, "-style")
        }, a), $), k.setLoadedStyleName(o.$style.name);
      }
      if (!k.isStyleNameLoaded("layer-order")) {
        var m, x, E = (m = o.$style) === null || m === void 0 || (x = m.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(m);
        C.load(E, S({
          name: "layer-order",
          first: !0
        }, a)), k.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, a, l, s = ((o = t.$style) === null || o === void 0 || (a = o.getPresetTheme) === null || a === void 0 ? void 0 : a.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, i = s.css, d = (l = t.$style) === null || l === void 0 ? void 0 : l.load(i, S({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = d.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Z.clearLoadedStyleNames(), A.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    A.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, a, l) {
    var s, i, d = "on".concat(io(n)), c = y._getConfig(o, a), u = r?.$instance, p = y._usePT(u, y._getPT(o == null || (s = o.value) === null || s === void 0 ? void 0 : s.pt, t), y._getOptionValue, "hooks.".concat(d)), f = y._useDefaultPT(u, c == null || (i = c.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], y._getOptionValue, "hooks.".concat(d)), h = {
      el: r,
      binding: o,
      vnode: a,
      prevVnode: l
    };
    p?.(u, h), f?.(u, h);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return mt(t) ? t.apply(void 0, r) : T.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(s, i, d, c, u) {
      var p, f, h, g;
      i._$instances = i._$instances || {};
      var b = y._getConfig(d, c), v = i._$instances[t] || {}, _ = pe(v) ? S(S({}, n), n?.methods) : {};
      i._$instances[t] = S(S({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: d,
        $modifiers: d?.modifiers,
        $value: d?.value,
        $el: v.$el || i || void 0,
        $style: S({
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
        $attrSelector: (p = i.$pd) === null || p === void 0 || (p = p[t]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return y._getPT(b?.pt, void 0, function(m) {
            var x;
            return m == null || (x = m.directives) === null || x === void 0 ? void 0 : x[t];
          });
        },
        isUnstyled: function() {
          var m, x;
          return ((m = i._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.unstyled) !== void 0 ? (x = i._$instances[t]) === null || x === void 0 || (x = x.$binding) === null || x === void 0 || (x = x.value) === null || x === void 0 ? void 0 : x.unstyled : b?.unstyled;
        },
        theme: function() {
          var m;
          return (m = i._$instances[t]) === null || m === void 0 || (m = m.$primevueConfig) === null || m === void 0 ? void 0 : m.theme;
        },
        preset: function() {
          var m;
          return (m = i._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.dt;
        },
        /* instance's methods */
        ptm: function() {
          var m, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return y._getPTValue(i._$instances[t], (m = i._$instances[t]) === null || m === void 0 || (m = m.$binding) === null || m === void 0 || (m = m.value) === null || m === void 0 ? void 0 : m.pt, x, S({}, E));
        },
        ptmo: function() {
          var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return y._getPTValue(i._$instances[t], m, x, E, !1);
        },
        cx: function() {
          var m, x, E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (m = i._$instances[t]) !== null && m !== void 0 && m.isUnstyled() ? void 0 : y._getOptionValue((x = i._$instances[t]) === null || x === void 0 || (x = x.$style) === null || x === void 0 ? void 0 : x.classes, E, S({}, I));
        },
        sx: function() {
          var m, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, I = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return E ? y._getOptionValue((m = i._$instances[t]) === null || m === void 0 || (m = m.$style) === null || m === void 0 ? void 0 : m.inlineStyles, x, S({}, I)) : void 0;
        }
      }, _), i.$instance = i._$instances[t], (f = (h = i.$instance)[s]) === null || f === void 0 || f.call(h, i, d, c, u), i["$".concat(t)] = i.$instance, y._hook(t, s, i, d, c, u), i.$pd || (i.$pd = {}), i.$pd[t] = S(S({}, (g = i.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, o = function(s) {
      var i, d, c, u = s._$instances[t], p = u?.watch, f = function(b) {
        var v, _ = b.newValue, $ = b.oldValue;
        return p == null || (v = p.config) === null || v === void 0 ? void 0 : v.call(u, _, $);
      }, h = function(b) {
        var v, _ = b.newValue, $ = b.oldValue;
        return p == null || (v = p["config.ripple"]) === null || v === void 0 ? void 0 : v.call(u, _, $);
      };
      u.$watchersCallback = {
        config: f,
        "config.ripple": h
      }, p == null || (i = p.config) === null || i === void 0 || i.call(u, u?.$primevueConfig), X.on("config:change", f), p == null || (d = p["config.ripple"]) === null || d === void 0 || d.call(u, u == null || (c = u.$primevueConfig) === null || c === void 0 ? void 0 : c.ripple), X.on("config:ripple:change", h);
    }, a = function(s) {
      var i = s._$instances[t].$watchersCallback;
      i && (X.off("config:change", i.config), X.off("config:ripple:change", i["config.ripple"]), s._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, d, c) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: vo("pd")
        }, r("created", s, i, d, c);
      },
      beforeMount: function(s, i, d, c) {
        var u;
        y._loadStyles((u = s.$pd[t]) === null || u === void 0 ? void 0 : u.instance, i, d), r("beforeMount", s, i, d, c), o(s);
      },
      mounted: function(s, i, d, c) {
        var u;
        y._loadStyles((u = s.$pd[t]) === null || u === void 0 ? void 0 : u.instance, i, d), r("mounted", s, i, d, c);
      },
      beforeUpdate: function(s, i, d, c) {
        r("beforeUpdate", s, i, d, c);
      },
      updated: function(s, i, d, c) {
        var u;
        y._loadStyles((u = s.$pd[t]) === null || u === void 0 ? void 0 : u.instance, i, d), r("updated", s, i, d, c);
      },
      beforeUnmount: function(s, i, d, c) {
        var u;
        a(s), y._removeThemeListeners((u = s.$pd[t]) === null || u === void 0 ? void 0 : u.instance), r("beforeUnmount", s, i, d, c);
      },
      unmounted: function(s, i, d, c) {
        var u;
        (u = s.$pd[t]) === null || u === void 0 || (u = u.instance) === null || u === void 0 || (u = u.scopedStyleEl) === null || u === void 0 || (u = u.value) === null || u === void 0 || u.remove(), r("unmounted", s, i, d, c);
      }
    };
  },
  extend: function() {
    var t = y._getMeta.apply(y, arguments), n = Yt(t, 2), r = n[0], o = n[1];
    return S({
      extend: function() {
        var l = y._getMeta.apply(y, arguments), s = Yt(l, 2), i = s[0], d = s[1];
        return y.extend(i, S(S(S({}, o), o?.methods), d));
      }
    }, y._extend(r, o));
  }
}, xi = `
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
`, wi = {
  root: "p-ink"
}, _i = C.extend({
  name: "ripple-directive",
  style: xi,
  classes: wi
}), Si = y.extend({
  style: _i
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function ki(e) {
  return Oi(e) || Ci(e) || Pi(e) || $i();
}
function $i() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Pi(e, t) {
  if (e) {
    if (typeof e == "string") return lt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? lt(e, t) : void 0;
  }
}
function Ci(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Oi(e) {
  if (Array.isArray(e)) return lt(e);
}
function lt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Qt(e, t, n) {
  return (t = Ti(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ti(e) {
  var t = Ei(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function Ei(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ai = Si.extend("ripple", {
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
      n || (n = po("span", Qt(Qt({
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
      var n = this, r = t.currentTarget, o = this.getInk(r);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && tt(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !Et(o) && !At(o)) {
          var a = Math.max(lo(r), bo(r));
          o.style.height = a + "px", o.style.width = a + "px";
        }
        var l = ho(r), s = t.pageX - l.left + document.body.scrollTop - At(o) / 2, i = t.pageY - l.top + document.body.scrollLeft - Et(o) / 2;
        o.style.top = i + "px", o.style.left = s + "px", !this.isUnstyled() && so(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && tt(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && tt(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? ki(t.children).find(function(n) {
        return mo(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const ji = "data-wippy-overlay-layer";
function Nn() {
  return typeof window < "u" && typeof window.document < "u";
}
function Ln() {
  return Nn() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function Ni() {
  return Ln() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Li = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let zi = 0;
const Qe = /* @__PURE__ */ new WeakMap();
function Zt(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ii(e, t) {
  if (!Li.test(e.className))
    return;
  const n = e.style.cssText;
  Zt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Qe.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && Zt(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), Qe.set(e, r);
  }
}
function bt(e) {
  const t = Qe.get(e);
  t && (t.disconnect(), Qe.delete(e));
}
function Vi(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function dt(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Ze = /* @__PURE__ */ new Set(), gt = /* @__PURE__ */ new WeakMap();
let Xt = !1, ct = !1;
const en = ["w-theme-dark", "w-theme-light"], Ke = "data-wippy-theme-root", ut = /* @__PURE__ */ new WeakMap();
function Ri(e) {
  const t = [];
  let n = e ? e.parentNode : null;
  for (; n && n.nodeType === 1; )
    t.push(n), n = n.parentNode;
  return t;
}
function Mi(e, t, n) {
  const r = [...Ri(t), n.host], o = () => {
    let l;
    for (const s of r) {
      if (en.some((i) => s.classList.contains(i))) {
        l = s;
        break;
      }
      if (s.hasAttribute(Ke))
        break;
    }
    for (const s of en)
      e.classList.toggle(s, !!(l && l.classList.contains(s)));
    l ? e.setAttribute(Ke, "") : e.removeAttribute(Ke);
  };
  o();
  const a = new MutationObserver(o);
  for (const l of r)
    a.observe(l, { attributes: !0, attributeFilter: ["class", Ke] });
  ut.set(e, a);
}
function zn(e) {
  ut.get(e)?.disconnect(), ut.delete(e);
}
function Di() {
  ct = !1;
  for (const e of Ze) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && bt(t);
      Ze.delete(e), gt.get(e)?.disconnect(), zn(e);
      continue;
    }
    e.childElementCount > 0 && dt(e);
  }
}
function tn() {
  ct || (ct = !0, requestAnimationFrame(Di));
}
function Fi(e) {
  const t = document.createElement("div");
  t.setAttribute(ji, "");
  const n = Ln();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  dt(t);
  const r = new MutationObserver((o) => {
    const a = t.__wippyAnchorName;
    for (const l of o) {
      if (a)
        for (const s of Array.from(l.addedNodes))
          s instanceof HTMLElement && Ii(s, a);
      for (const s of Array.from(l.removedNodes))
        s instanceof HTMLElement && bt(s);
    }
    t.isConnected && t.childElementCount > 0 && dt(t);
  });
  return r.observe(t, { childList: !0 }), gt.set(t, r), Ze.add(t), Xt || (Xt = !0, window.addEventListener("scroll", tn, { capture: !0, passive: !0 }), window.addEventListener("resize", tn, { passive: !0 })), t;
}
function nn(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Fi(e.hostRoot), Mi(e.layer, e.$el, e.hostRoot), Ni())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++zi}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function rn(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && bt(t);
    Ze.delete(e.layer), gt.get(e.layer)?.disconnect(), zn(e.layer), e.layer.remove(), e.layer = null;
  }
}
let on = !1;
function Bi() {
  if (on)
    return;
  on = !0;
  const e = Tn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Nn() && (this.hostRoot = Vi(this.$el), this.mounted = !0, this.hostRoot && (this.inline || nn(this), this.$watch("inline", (t) => {
      t ? rn(this) : nn(this);
    })));
  }, e.render = function() {
    return this.inline ? K(this.$slots, "default", { key: 0 }) : this.mounted ? pr(ln, { key: 1, to: this.resolvedTarget || document.body }, [
      K(this.$slots, "default")
    ]) : $e("", !0);
  }, e.unmounted = function() {
    rn(this);
  };
}
const Ui = {
  install: (e) => {
    Bi(), e.use(ei, { theme: "none" });
  }
}, Hi = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);font-family:inherit}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}button,input,textarea,select{font:inherit}h1,h2,h3,p{margin:0}h1{font-size:24px;line-height:1.3;font-weight:600;overflow-wrap:anywhere}h2{font-size:16px;font-weight:600;line-height:1.4}h3{font-size:14px;font-weight:600}p{line-height:1.5}button{cursor:pointer}button:disabled{cursor:default}label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}small{font-size:12px;color:var(--p-text-muted-color);font-weight:400}input:not([type=checkbox]),select,textarea{width:100%;min-width:0;background:var(--p-content-background);color:var(--p-text-color);border:1px solid var(--p-content-border-color);border-radius:var(--p-form-field-border-radius);padding:9px 11px;line-height:1.4}input:focus,textarea:focus,select:focus-visible{outline:none;border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}button:focus-visible,input[type=checkbox]:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}textarea{resize:vertical}wc-model-picker,wc-multiselect{display:block;min-width:0}.docscout{container-type:inline-size;container-name:docscout;height:100%;min-height:0;display:flex;flex-direction:column;background:var(--p-content-background);color:var(--p-text-color);font-size:14px}.description{color:var(--p-text-muted-color);margin-top:8px;max-width:680px;overflow-wrap:anywhere}.row{display:flex;align-items:center;gap:12px;min-width:0}.wrap{flex-wrap:wrap}.push{margin-left:auto}.grow{flex:1;min-width:220px}.muted,.meta-line,.retention{font-size:13px;color:var(--p-text-muted-color)}.meta-line{margin-top:12px}.badge{display:inline-flex;align-items:center;white-space:nowrap;border-radius:var(--p-content-border-radius);padding:2px 7px;background:var(--p-content-hover-background);color:var(--p-text-muted-color);font-size:12px}.tabs{display:flex;gap:22px;flex-shrink:0;overflow-x:auto;min-width:0}.tabs button{background:transparent;border:0;border-bottom:2px solid transparent;padding:13px 0 11px;color:var(--p-text-muted-color);font-size:13px;font-weight:500;white-space:nowrap}.tabs button[aria-selected=true]{color:var(--p-primary-color);border-bottom-color:var(--p-primary-color)}.page-body{overflow-y:auto;min-height:0;flex:1;padding:22px 24px 36px}.panel{max-width:1000px}.section-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.section-head p{margin-top:5px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.three{grid-template-columns:repeat(3,minmax(0,1fr))}.field-card,.run-card{border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius);padding:20px;background:var(--p-content-background);margin-bottom:16px}.field-card>header{margin-bottom:18px}.field-card>label,.field-card>.grid{margin-bottom:18px}.field-card>:last-child{margin-bottom:0}.ordinal{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:var(--p-content-border-radius);background:var(--p-content-hover-background);font-size:12px;color:var(--p-text-muted-color);flex-shrink:0}.check{display:inline-flex;flex-direction:row;align-items:center;gap:8px;font-weight:400}.check input{accent-color:var(--p-primary-color);width:16px;height:16px;flex-shrink:0}.panel>section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--p-content-border-color)}section>h2{margin-bottom:20px}section>.grid,section>.check{margin-bottom:18px}.identity{padding-bottom:24px}.empty{padding:24px 0;color:var(--p-text-muted-color);font-size:13px}.error{color:var(--p-danger-color);padding:12px 0;overflow-wrap:anywhere}.retention{margin-top:12px}.test-input>.muted{margin-top:14px}.value{font-size:20px;font-weight:500;margin:6px 0}.confidence{font-size:12px;color:var(--p-text-muted-color)}blockquote{border-left:2px solid var(--p-primary-color);margin:16px 0 0;padding:2px 0 2px 14px}blockquote p{font-size:14px}cite{display:block;font-size:12px;color:var(--p-text-muted-color);font-style:normal;margin-top:6px}.trace{padding-left:20px;margin:20px 0}.trace>li{padding:0 0 24px 12px}.trace p,.trace ul{margin-top:8px}.comparison .field-card{margin:0}.values{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.values dd{text-align:right}.values small{display:block;margin-top:4px}dd{margin:0;overflow-wrap:anywhere}dt{color:var(--p-text-muted-color)}.delta{color:var(--p-text-muted-color);font-size:13px;margin-top:10px}.run-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.run-card{margin:0}.run-card dl{display:grid;grid-template-columns:auto 1fr;gap:10px;margin:18px 0 0;font-size:13px}.run-card dd{text-align:right}.capitalize{text-transform:capitalize}.create-pane{padding:24px;max-width:640px;margin:auto;color:var(--p-text-color)}.create-pane>header,.create-pane>label,.create-summary{margin-bottom:24px}.create-summary{padding:18px;border:1px solid var(--p-content-border-color);border-radius:var(--p-content-border-radius)}.create-summary dl{display:grid;grid-template-columns:110px 1fr;gap:12px;font-size:13px;margin-bottom:0}.create-summary h2{margin:0}@container docscout (max-width:600px){.page-body{padding:22px 20px 32px}.grid,.three,.run-list{grid-template-columns:1fr;gap:16px}.field-card,.run-card{padding:16px}.field-card>header{gap:8px}.field-card header h3{overflow-wrap:anywhere;min-width:0}.section-head{align-items:flex-start;gap:12px}.create-pane{padding:20px}.comparison{grid-template-columns:1fr}.confidence{max-width:112px;text-align:right}.create-summary dl{grid-template-columns:85px 1fr}}.title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.title-row .badge{font-weight:500}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 20px;border-bottom:1px solid var(--p-content-border-color);flex-shrink:0;min-height:46px}.toolbar-side{display:flex;align-items:center;gap:12px;min-width:0}.stats{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sep{opacity:.6}.save-area{display:flex;align-items:center;gap:12px;flex-shrink:0}.unsaved{font-size:12px;color:var(--p-text-muted-color);display:inline-flex;align-items:center;gap:6px}.unsaved:before{content:"";width:7px;height:7px;border-radius:999px;background:var(--p-primary-color)}.banner{padding:8px 20px;border-bottom:1px solid var(--p-content-border-color)}.builder-body{flex:1;min-height:0;display:flex}.builder{flex:1;min-height:0;display:grid;grid-template-columns:260px minmax(0,1fr) 380px}.pane{min-height:0;overflow-y:auto;display:flex;flex-direction:column}.fields-pane{border-right:1px solid var(--p-content-border-color);padding:14px 10px}.inspector{border-left:1px solid var(--p-content-border-color)}.pane-head{display:flex;align-items:center;gap:8px;min-height:32px}.fields-pane .pane-head{padding:0 6px 8px}.inspector .pane-head{padding:12px 20px;border-bottom:1px solid var(--p-content-border-color);position:sticky;top:0;background:var(--p-content-background);z-index:1}.pane-head h2{font-size:14px;overflow-wrap:anywhere}.count{font-size:12px;color:var(--p-text-muted-color);background:color-mix(in srgb,var(--p-text-color) 8%,transparent);border-radius:999px;padding:1px 8px}.pad{padding:6px}.field-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}.field-list li{position:relative}.field-item{width:100%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:8px;text-align:left;background:transparent;border:1px solid transparent;border-radius:8px;padding:7px 8px 7px 10px;color:var(--p-text-color)}.field-item:hover{background:color-mix(in srgb,var(--p-text-color) 6%,transparent)}.field-item.active{background:color-mix(in srgb,var(--p-primary-color) 10%,transparent);border-color:color-mix(in srgb,var(--p-primary-color) 35%,transparent)}.field-name{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.field-item .chips{flex-wrap:nowrap;flex-shrink:0}.req{color:var(--p-primary-color);margin-left:2px}.reorder{display:flex;justify-content:flex-end;gap:2px;padding:2px 4px 4px}.add-field{margin:8px 0 0 4px;align-self:flex-start}.chips{display:flex;flex-wrap:wrap;gap:5px}.chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;line-height:1.5;border-radius:6px;padding:1px 7px;background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-muted-color);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.chip.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.chip.muted-chip{background:transparent;border:1px dashed var(--p-content-border-color)}.chip.model{background:color-mix(in srgb,var(--p-primary-color) 10%,transparent);color:var(--p-text-color)}.flow{min-height:0;overflow-y:auto;padding:20px 28px 40px;display:flex;flex-direction:column;align-items:stretch;background:color-mix(in srgb,var(--p-text-color) 2.5%,transparent)}.node{display:flex;align-items:flex-start;gap:14px;width:100%;max-width:680px;margin:0 auto;text-align:left;background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:14px;padding:12px 14px 12px 12px;color:var(--p-text-color);cursor:pointer;transition:border-color .12s,box-shadow .12s}.node:hover{border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.node.active{border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.node.off{background:transparent;border-style:dashed}.node.off .node-icon,.node.off .node-title{opacity:.55}.node:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:2px}.node-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:18px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.fixed .node-icon{background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-color)}.node-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.node-title{font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}.scope{font-size:11px;font-weight:500;color:var(--p-text-muted-color);text-transform:capitalize}.scope:before{content:"· "}.node-summary{font-size:13px;color:var(--p-text-muted-color)}.trace-line{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--p-primary-color)}.node-side{display:flex;align-items:center;gap:8px;flex-shrink:0}.node-actions{display:flex;align-items:center;gap:2px}.node-actions .switch{margin-left:6px}.connector{width:2px;height:18px;flex-shrink:0;margin:0 auto;background:color-mix(in srgb,var(--p-text-color) 18%,transparent);position:relative}.connector:after{content:"";position:absolute;bottom:-1px;left:-3px;width:8px;height:8px;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 25%,transparent)}.connector.off{background:repeating-linear-gradient(to bottom,color-mix(in srgb,var(--p-text-color) 18%,transparent) 0 4px,transparent 4px 8px)}.icon-btn{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:var(--p-text-muted-color);font-size:16px}.icon-btn:hover:not(:disabled){background:color-mix(in srgb,var(--p-text-color) 8%,transparent);color:var(--p-text-color)}.icon-btn:disabled{opacity:.35}.btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:8px;background:var(--p-content-background);color:var(--p-text-color);padding:6px 12px;font-size:13px;font-weight:500}.btn:hover{background:color-mix(in srgb,var(--p-text-color) 6%,transparent)}.btn.subtle{border-color:transparent;color:var(--p-text-muted-color);padding:4px 8px;font-size:12px}.btn.danger-text{border-color:transparent;color:var(--p-danger-600,var(--p-danger-500));padding-left:0;align-self:flex-start}.switch{position:relative;width:40px;height:23px;border:0;border-radius:999px;background:color-mix(in srgb,var(--p-text-color) 16%,transparent);flex-shrink:0;padding:0;transition:background .15s}.switch span{position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:999px;background:#fff;box-shadow:0 1px 2px #00000040;transition:transform .15s}.switch[aria-checked=true]{background:var(--p-primary-color)}.switch[aria-checked=true] span{transform:translate(17px)}.switch:disabled{opacity:.5}.inspector-body{padding:16px 20px 28px}.inspector-form{border:0;margin:0;padding:0;min-width:0;display:flex;flex-direction:column;gap:14px}.inspector-form h4{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);margin:8px 0 -4px}.inspector-form .grid{gap:12px}.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:13px}.toggle-row>span{display:flex;flex-direction:column;gap:2px;min-width:0}.toggle-row small{overflow-wrap:anywhere}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}.segmented{display:flex;padding:3px;gap:3px;border-radius:8px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.segmented button{flex:1;border:0;border-radius:6px;background:transparent;padding:6px 8px;font-size:13px;color:var(--p-text-muted-color)}.segmented button[aria-checked=true]{background:var(--p-content-background);color:var(--p-text-color);box-shadow:0 1px 2px #0000001f;font-weight:500}.query-row{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--p-content-border-color);border-radius:10px}.query-row .btn.subtle{align-self:flex-start;padding-left:0}.output-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.output-list li{display:flex;justify-content:space-between;gap:12px;align-items:center}@container docscout (max-width:1180px){.builder{grid-template-columns:minmax(0,1fr) 340px;grid-template-rows:auto minmax(0,1fr)}.fields-pane{grid-column:1;grid-row:1;border-right:0;border-bottom:1px solid var(--p-content-border-color);padding:10px 16px;flex-direction:row;align-items:center;flex-wrap:wrap;gap:6px;overflow:visible}.fields-pane .pane-head{padding:0 6px 0 0}.fields-pane .pane-head .icon-btn{display:none}.fields-pane .pad{padding:0}.field-list{flex-direction:row;flex-wrap:wrap;gap:6px}.field-list li{display:flex;align-items:center}.field-item{width:auto;border-color:var(--p-content-border-color);padding:4px 6px 4px 10px}.reorder{padding:0 0 0 2px}.reorder .icon-btn{width:24px;height:24px}.add-field{margin:0;padding:4px 10px}.flow{grid-column:1;grid-row:2;padding:18px 20px 36px}.inspector{grid-column:2;grid-row:1 / span 2}}@container docscout (max-width:680px){.builder-body{overflow-y:auto;display:block}.builder{display:flex;flex-direction:column}.pane{overflow:visible}.fields-pane{border-right:0;border-bottom:1px solid var(--p-content-border-color)}.inspector{border-left:0;border-top:1px solid var(--p-content-border-color)}.inspector .pane-head{position:static}.flow{overflow:visible;padding:20px 16px 28px}.node{padding:14px 12px}.banner{padding:10px 20px}}@container docscout (max-width:600px){.toolbar{padding:0 14px 0 52px;gap:10px}.stats,.node-side .chip.model{display:none}.inspector-form .grid{grid-template-columns:1fr}}.label-block{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:500;min-width:0}.toolbar-lead{display:flex;align-items:center;gap:14px;min-width:0}.crumb{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;padding-right:10px;border-right:1px solid var(--p-content-border-color)}.toolbar-title{display:flex;align-items:center;gap:8px}.toolbar-title h1{font-size:15px;font-weight:600}.filter{width:220px!important;padding:5px 10px!important;font-size:13px}.pad-page{padding:24px}.list-page .page-body{padding:20px 24px 36px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.card{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:14px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);color:var(--p-text-color);min-width:0}.card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color))}.card-icon{width:32px;height:32px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color)}.card-main{display:flex;flex-direction:column;gap:4px;min-width:0}.card-title{font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-desc{font-size:13px;color:var(--p-text-muted-color);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.card-meta{font-size:12px;color:var(--p-text-muted-color)}.create-card{position:relative;border:1px solid var(--p-content-border-color);border-radius:14px;margin-bottom:16px;max-width:640px}.create-card .create-pane{margin:0;padding:18px 20px}.create-card .create-pane>header,.create-card .create-pane>label,.create-card .create-summary{margin-bottom:16px}.create-close{position:absolute;top:12px;right:12px}.empty-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:64px 16px;color:var(--p-text-muted-color);font-size:13px;text-align:center}.empty-icon{font-size:30px}@container docscout (max-width:900px){.crumb{display:none}.filter{width:150px!important}}@container docscout (max-width:600px){.filter{display:none}.list-page .page-body{padding:16px 14px 28px}}';
function Wa(e, t) {
  return class extends Qr {
    static get wippyConfig() {
      return { propsSchema: t, inlineCss: Hi };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [Ui] };
    }
  };
}
const we = (e) => `/api/v1/docscout/${encodeURIComponent(e)}`;
function se(e) {
  if (e.success === !1) throw new Error(e.error || "Request failed");
  return e;
}
const qa = {
  async list() {
    return se((await ae.get("/api/v1/docscout")).data).items;
  },
  async get(e) {
    return se((await ae.get(we(e))).data);
  },
  async create(e) {
    return se((await ae.post("/api/v1/docscout", e)).data);
  },
  async update(e, t) {
    return se((await ae.put(we(e), t)).data);
  },
  async addCase(e, t) {
    return se((await ae.post(we(e) + "/cases", t)).data);
  },
  async deleteCase(e, t) {
    se((await ae.delete(we(e) + "/cases/" + encodeURIComponent(t))).data);
  },
  async remove(e) {
    se((await ae.delete(we(e))).data);
  }
}, Wi = { fields: { items: { default: { name: "", type: "text", description: "", enum_values: [], item_type: "text", required: !1, search_hints: "", validation_hints: "", expected_format: "", strategy: "standard", evidence_required: !0, chunks: 5 } } } }, vt = {
  properties: Wi,
  default: { fields: [], workflow: [{ kind: "map", enabled: !1, scope: "section", model: "class:fast", options: { outline_mode: "find_or_build" } }, { kind: "prefetch", enabled: !0, scope: "section", options: { queries: [] } }, { kind: "scout", enabled: !0, scope: "chunk", model: "class:fast", options: { max_iterations: 0, target_confidence: 0.7, max_extra_queries: 3, drop_noise: !0, max_tokens: 4096 } }, { kind: "deep", enabled: !0, scope: "section", model: "class:fast", options: { parallel_fields: 4, query_model: "class:fast", max_queries: 5, chunks_per_query: 50, chunk_cap: 100, min_similarity: 0.2, query_temperature: 0.2, analysis_temperature: 0.2 } }, { kind: "extract", enabled: !0, scope: "chunk", model: "class:premium", options: { max_output_tokens: 4096, structured_output: !0 } }, { kind: "verify", enabled: !1, scope: "chunk", model: "class:fast", options: { require_all_values: !0 } }], retrieval: { chunk_size: 1200, overlap: 150, split_headings: !0, search_mode: "hybrid", top_results: 6, contextual_embeddings: !0, highlighter: !1, highlighter_model: "class:fast", embedding_model: "class:embed" }, tools: ["kickside.docscout.tools:keyword_search", "kickside.docscout.tools:semantic_search", "kickside.docscout.tools:read_section", "kickside.docscout.tools:read_outline"], tags: [], shared_context: !0 }
}, Ka = () => structuredClone(vt.default), Ya = () => structuredClone(vt.properties.fields.items.default), Ga = () => ({ name: "", query: "", chunks: 5 }), Ja = () => [...vt.default.tools], Qa = { map: "Map the document", prefetch: "Prefetch", scout: "Scout loop", deep: "Deep analysis", extract: "Extract", verify: "Verify" }, Za = { map: "tabler:list-tree", prefetch: "tabler:search", scout: "tabler:radar-2", deep: "tabler:microscope", extract: "tabler:table-export", verify: "tabler:shield-check" }, Xa = { map: "Find the table of contents or build an outline before reading.", prefetch: "Run fixed queries before scouting.", scout: "Judge the evidence, drop noise and ask for more until confident.", deep: "Analyse deep fields on their own, in parallel.", extract: "Fill every field with structured output.", verify: "Check each value against its cited evidence." }, an = ["prefetch", "scout", "deep"], qi = (e, t, n) => {
  const r = e.workflow[t], o = e.workflow[t + n];
  return !!r && !!o && an.includes(r.kind) && an.includes(o.kind);
};
function es(e, t, n) {
  if (!qi(e, t, n)) return;
  const [r] = e.workflow.splice(t, 1);
  e.workflow.splice(t + n, 0, r);
}
const _e = (e, t) => `${e} ${e === 1 ? t : t.endsWith("y") ? t.slice(0, -1) + "ies" : t + "s"}`;
function ts(e, t) {
  const n = e.options;
  switch (e.kind) {
    case "map":
      return n.outline_mode === "build" ? "Build an outline" : "Use the table of contents, or build an outline";
    case "prefetch": {
      const r = t.fields.filter((o) => o.search_hints.trim()).length;
      return [_e(n.queries.length, "query"), r ? `${_e(r, "field hint")}` : ""].filter(Boolean).join(" · ");
    }
    case "scout":
      return n.max_iterations ? `Up to ${_e(n.max_iterations, "round")} · stop at ${Math.round(n.target_confidence * 100)}% · ${_e(n.max_extra_queries, "extra query")}` : "Single pass, no extra rounds";
    case "deep": {
      const r = t.fields.filter((o) => o.strategy === "deep").length;
      return r ? `${_e(r, "field")} · ${n.parallel_fields} at a time` : "No deep fields";
    }
    case "extract":
      return `${n.structured_output ? "Structured output" : "Free text"} · up to ${n.max_output_tokens.toLocaleString()} tokens`;
    case "verify":
      return n.require_all_values ? "Every value against its evidence" : "Values that carry evidence";
  }
}
function ns(e) {
  return `${e.chunk_size.toLocaleString()}-token chunks · ${e.search_mode} search${e.contextual_embeddings ? " · contextual" : ""}${e.highlighter ? " · highlighter" : ""}`;
}
function rs(e) {
  return e ? e.startsWith("class:") ? e.slice(6).replace(/^\w/, (t) => t.toUpperCase()) : e.split("/").pop() ?? e : "";
}
function os(e) {
  return (e.split(":").pop() ?? e).replace(/_/g, " ").replace(/^\w/, (n) => n.toUpperCase());
}
function is(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.fields) {
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(r.name)) return "Field names start with a letter and contain letters, numbers, and underscores.";
    if (t.has(r.name)) return "Field names must be unique.";
    if (t.add(r.name), r.type === "enum" && !r.enum_values.length) return "Enum fields need at least one value.";
  }
  return e.workflow.find((r) => r.kind === "prefetch")?.options.queries.some((r) => !r.name.trim() || !r.query.trim()) ? "Prefetch queries need a name and a query." : e.retrieval.overlap >= e.retrieval.chunk_size ? "Overlap must be smaller than chunk size." : "";
}
function as(e, t) {
  const n = (r, o) => o !== null && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.keys(o).sort().map((a) => [a, o[a]])) : o;
  return JSON.stringify(e, n) === JSON.stringify(t, n);
}
var In = {
  name: "SpinnerIcon",
  extends: fi
};
function Ki(e) {
  return Qi(e) || Ji(e) || Gi(e) || Yi();
}
function Yi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Gi(e, t) {
  if (e) {
    if (typeof e == "string") return pt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? pt(e, t) : void 0;
  }
}
function Ji(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Qi(e) {
  if (Array.isArray(e)) return pt(e);
}
function pt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Zi(e, t, n, r, o, a) {
  return R(), le("svg", T({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Ki(t[0] || (t[0] = [fr("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
In.render = Zi;
var Xi = `
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
`, ea = {
  root: function(t) {
    var n = t.props, r = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": P(n.value) && String(n.value).length === 1,
      "p-badge-dot": pe(n.value) && !r.$slots.default,
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
}, ta = C.extend({
  name: "badge",
  style: Xi,
  classes: ea
}), na = {
  name: "BaseBadge",
  extends: Xe,
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
  style: ta,
  provide: function() {
    return {
      $pcBadge: this,
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
function sn(e, t, n) {
  return (t = ra(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ra(e) {
  var t = oa(e, "string");
  return ze(t) == "symbol" ? t : t + "";
}
function oa(e, t) {
  if (ze(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ze(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Vn = {
  name: "Badge",
  extends: na,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return ce(sn(sn({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, ia = ["data-p"];
function aa(e, t, n, r, o, a) {
  return R(), le("span", T({
    class: e.cx("root"),
    "data-p": a.dataP
  }, e.ptmi("root")), [K(e.$slots, "default", {}, function() {
    return [mr(dn(e.value), 1)];
  })], 16, ia);
}
Vn.render = aa;
var sa = `
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
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
function F(e, t, n) {
  return (t = la(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function la(e) {
  var t = da(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function da(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ie(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ca = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-button p-component", F(F(F(F(F(F(F(F(F({
      "p-button-icon-only": n.hasIcon && !r.label && !r.badge,
      "p-button-vertical": (r.iconPos === "top" || r.iconPos === "bottom") && r.label,
      "p-button-loading": r.loading,
      "p-button-link": r.link || r.variant === "link"
    }, "p-button-".concat(r.severity), r.severity), "p-button-raised", r.raised), "p-button-rounded", r.rounded), "p-button-text", r.text || r.variant === "text"), "p-button-outlined", r.outlined || r.variant === "outlined"), "p-button-sm", r.size === "small"), "p-button-lg", r.size === "large"), "p-button-plain", r.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", F({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, ua = C.extend({
  name: "button",
  style: sa,
  classes: ca
}), pa = {
  name: "BaseButton",
  extends: Xe,
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
  style: ua,
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
function N(e, t, n) {
  return (t = fa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function fa(e) {
  var t = ma(e, "string");
  return Ve(t) == "symbol" ? t : t + "";
}
function ma(e, t) {
  if (Ve(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ve(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ha = {
  name: "Button",
  extends: pa,
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
      return T(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return pe(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return ce(N(N(N(N(N(N(N(N(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return ce(N(N({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return ce(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: In,
    Badge: Vn
  },
  directives: {
    ripple: Ai
  }
}, ba = ["data-p"], ga = ["data-p"];
function va(e, t, n, r, o, a) {
  var l = _t("SpinnerIcon"), s = _t("Badge"), i = hr("ripple");
  return e.asChild ? K(e.$slots, "default", {
    key: 1,
    class: St(e.cx("root")),
    a11yAttrs: a.a11yAttrs
  }) : br((R(), Ye(gr(e.as), T({
    key: 0,
    class: e.cx("root"),
    "data-p": a.dataP
  }, a.attrs), {
    default: vr(function() {
      return [K(e.$slots, "default", {}, function() {
        return [e.loading ? K(e.$slots, "loadingicon", T({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (R(), le("span", T({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (R(), Ye(l, T({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : K(e.$slots, "icon", T({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (R(), le("span", T({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": a.dataIconP
          }, e.ptm("icon")), null, 16, ba)) : $e("", !0)];
        }), e.label ? (R(), le("span", T({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": a.dataLabelP
        }), dn(e.label), 17, ga)) : $e("", !0), e.badge ? (R(), Ye(s, {
          key: 3,
          value: e.badge,
          class: St(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : $e("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[i]]);
}
ha.render = va;
var ya = {
  name: "BaseEditableHolder",
  extends: Xe,
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
        var n, r;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (r = n.register) === null || r === void 0 ? void 0 : r.call(n, t, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(t) {
        var n, r;
        this.formField = ((n = this.$pcForm) === null || n === void 0 || (r = n.register) === null || r === void 0 ? void 0 : r.call(n, this.$formName, t)) || {};
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
      var r, o;
      this.controlled && (this.d_value = t, this.$emit("update:modelValue", t)), this.$emit("value-change", t), (r = (o = this.formField).onChange) === null || r === void 0 || r.call(o, {
        originalEvent: n,
        value: t
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
        n[r] = arguments[r];
      return n.find(P);
    }
  },
  computed: {
    $filled: function() {
      return P(this.d_value);
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
}, Rn = {
  name: "BaseInput",
  extends: ya,
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
}, xa = `
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
`, wa = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-inputtext p-component", {
      "p-filled": n.$filled,
      "p-inputtext-sm p-inputfield-sm": r.size === "small",
      "p-inputtext-lg p-inputfield-lg": r.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-inputtext-fluid": n.$fluid
    }];
  }
}, _a = C.extend({
  name: "inputtext",
  style: xa,
  classes: wa
}), Sa = {
  name: "BaseInputText",
  extends: Rn,
  style: _a,
  provide: function() {
    return {
      $pcInputText: this,
      $parentInstance: this
    };
  }
};
function Re(e) {
  "@babel/helpers - typeof";
  return Re = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Re(e);
}
function ka(e, t, n) {
  return (t = $a(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $a(e) {
  var t = Pa(e, "string");
  return Re(t) == "symbol" ? t : t + "";
}
function Pa(e, t) {
  if (Re(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Re(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ca = {
  name: "InputText",
  extends: Sa,
  inheritAttrs: !1,
  methods: {
    onInput: function(t) {
      this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return T(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ce(ka({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, Oa = ["value", "name", "disabled", "aria-invalid", "data-p"];
function Ta(e, t, n, r, o, a) {
  return R(), le("input", T({
    type: "text",
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.$invalid || void 0,
    "data-p": a.dataP,
    onInput: t[0] || (t[0] = function() {
      return a.onInput && a.onInput.apply(a, arguments);
    })
  }, a.attrs), null, 16, Oa);
}
Ca.render = Ta;
var Ea = `
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`, Aa = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-textarea p-component", {
      "p-filled": n.$filled,
      "p-textarea-resizable ": r.autoResize,
      "p-textarea-sm p-inputfield-sm": r.size === "small",
      "p-textarea-lg p-inputfield-lg": r.size === "large",
      "p-invalid": n.$invalid,
      "p-variant-filled": n.$variant === "filled",
      "p-textarea-fluid": n.$fluid
    }];
  }
}, ja = C.extend({
  name: "textarea",
  style: Ea,
  classes: Aa
}), Na = {
  name: "BaseTextarea",
  extends: Rn,
  props: {
    autoResize: Boolean
  },
  style: ja,
  provide: function() {
    return {
      $pcTextarea: this,
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
function La(e, t, n) {
  return (t = za(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function za(e) {
  var t = Ia(e, "string");
  return Me(t) == "symbol" ? t : t + "";
}
function Ia(e, t) {
  if (Me(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Me(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Va = {
  name: "Textarea",
  extends: Na,
  inheritAttrs: !1,
  observer: null,
  mounted: function() {
    var t = this;
    this.autoResize && (this.observer = new ResizeObserver(function() {
      requestAnimationFrame(function() {
        t.resize();
      });
    }), this.observer.observe(this.$el));
  },
  updated: function() {
    this.autoResize && this.resize();
  },
  beforeUnmount: function() {
    this.observer && this.observer.disconnect();
  },
  methods: {
    resize: function() {
      if (this.$el.offsetParent) {
        var t = this.$el.style.height, n = parseInt(t) || 0, r = this.$el.scrollHeight, o = !n || r > n, a = n && r < n;
        a ? (this.$el.style.height = "auto", this.$el.style.height = "".concat(this.$el.scrollHeight, "px")) : o && (this.$el.style.height = "".concat(r, "px"));
      }
    },
    onInput: function(t) {
      this.autoResize && this.resize(), this.writeValue(t.target.value, t);
    }
  },
  computed: {
    attrs: function() {
      return T(this.ptmi("root", {
        context: {
          filled: this.$filled,
          disabled: this.disabled
        }
      }), this.formField);
    },
    dataP: function() {
      return ce(La({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size));
    }
  }
}, Ra = ["value", "name", "disabled", "aria-invalid", "data-p"];
function Ma(e, t, n, r, o, a) {
  return R(), le("textarea", T({
    class: e.cx("root"),
    value: e.d_value,
    name: e.name,
    disabled: e.disabled,
    "aria-invalid": e.invalid || void 0,
    "data-p": a.dataP,
    onInput: t[0] || (t[0] = function() {
      return a.onInput && a.onInput.apply(a, arguments);
    })
  }, a.attrs), null, 16, Ra);
}
Va.render = Ma;
export {
  Ha as a,
  Qa as b,
  qa as c,
  Wa as d,
  Ca as e,
  Va as f,
  Ja as g,
  Xa as h,
  Ga as i,
  ns as j,
  Za as k,
  ts as l,
  rs as m,
  Ka as n,
  qi as o,
  es as p,
  Ya as q,
  is as r,
  ha as s,
  os as t,
  Ua as u,
  as as v
};
