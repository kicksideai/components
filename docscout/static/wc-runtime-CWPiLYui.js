import { hasInjectionContext as si, inject as Ye, effectScope as ai, ref as K, markRaw as li, createApp as ui, onMounted as un, onUnmounted as di, watch as he, readonly as ci, getCurrentInstance as _t, nextTick as mi, reactive as pi, renderSlot as oe, openBlock as x, createBlock as ye, Teleport as dn, createCommentVNode as U, useId as fi, mergeProps as L, resolveDirective as hi, createElementBlock as N, createElementVNode as Xe, withDirectives as vi, resolveDynamicComponent as St, normalizeClass as yi, toDisplayString as cn, resolveComponent as $t, withCtx as Ot, createVNode as gi, Transition as bi, Fragment as ge, renderList as wt, createTextVNode as _i, h as Si } from "vue";
import { addCollection as $i } from "@iconify/vue";
import { config as Pt, addIcons as Oi, on as wi, applyThemeMode as Ne, host as Pi, hostCss as Ci, loadCss as Ti } from "@wippy-fe/proxy";
/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */
var et = "data-wippy-visible";
function Ct(e) {
  const t = e.getAttribute(et);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var ki = Object.defineProperty, xi = (e, t, n) => t in e ? ki(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, k = (e, t, n) => xi(e, typeof t != "symbol" ? t + "" : t, n), Li = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Ei = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Tt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Ai(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [i, r] of Object.entries(n)) {
        if ((i === "@light" || i === "@dark") && r && typeof r == "object") {
          for (const [a, l] of Object.entries(r)) {
            const s = typeof l == "string" ? Tt(a) : null;
            s && t.add(s);
          }
          continue;
        }
        const o = typeof r == "string" ? Tt(i) : null;
        o && t.add(o);
      }
  return [...t].sort();
}
function Ii(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Ei} {
${t}
}`;
}
function Ni(e, t) {
  const n = Ii(t);
  n && mn(e, n, "@wippy-fe/css-variables-bridge");
}
function ji(e, t) {
  const i = (t ?? Li).map(async (r) => {
    const o = Ci[r];
    if (!o)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${r}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Ti(o);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${r}" (${o}):`, a), null;
    }
  });
  return Promise.all(i).then((r) => {
    for (const o of r) {
      if (!o)
        continue;
      const a = document.createElement("style");
      a.textContent = o, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function Ri(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function mn(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const r = new CSSStyleSheet();
    r.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, r];
    return;
  }
  const i = document.createElement("style");
  i.setAttribute("role", n), i.textContent = t, e.appendChild(i);
}
function Vi(e, t) {
  mn(e, t, "@wippy-fe/custom-css");
}
function pn(e) {
  return e.__wippyHost ?? null;
}
function Mi(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function Di(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const i = Number.parseFloat(t);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: i };
    }
    case "integer": {
      const i = Number.parseInt(t, 10);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: i };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const i = JSON.parse(t);
        return n.type === "array" && !Array.isArray(i) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: i };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function Ge(e, t) {
  const n = {}, i = [];
  for (const [r, o] of Object.entries(t.properties)) {
    const a = e.getAttribute(r), l = Mi(r);
    if (a === null) {
      o.default !== void 0 && (n[l] = o.default);
      continue;
    }
    const s = Di(r, a, o);
    s.error ? i.push(s.error) : n[l] = s.value;
  }
  return { props: n, errors: i };
}
var Hi = class {
  constructor(e, t) {
    k(this, "_props"), k(this, "_errors"), k(this, "_content"), k(this, "_hostVisibility"), k(this, "_propsListeners", /* @__PURE__ */ new Set()), k(this, "_contentListeners", /* @__PURE__ */ new Set()), k(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), k(this, "_disposed", !1), k(this, "_emitToDom"), k(this, "props"), k(this, "events"), k(this, "content"), k(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(i, r) {
        return n._subscribeProps(i, r);
      }
    }, this.events = {
      emit(i, r) {
        n._disposed || n._emitToDom(i, r);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(i, r) {
        return n._subscribeContent(i, r);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(i, r) {
        return n._subscribeHostVisibility(i, r);
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
}, Ui = class extends HTMLElement {
  constructor() {
    super(), k(this, "_internals"), k(this, "_contentObserver", null), k(this, "_initialized", !1), k(this, "_container", null), k(this, "_reactive", null), k(this, "_lastProps", null), k(this, "_lastErrors", []), k(this, "_lastContent", null), k(this, "_themeUnsub", null), k(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = Ct(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...n, et])];
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
      let n, i;
      if (this._lastProps !== null)
        n = this._lastProps, i = this._lastErrors;
      else {
        const o = Ge(this, e.propsSchema);
        e.validateProps && o.errors.push(...e.validateProps(o.props)), n = o.props, i = o.errors, this._lastProps = n, this._lastErrors = i;
      }
      const r = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = r), this._reactive = new Hi(
        { props: n, errors: i, content: r, hasContent: t, hostVisibility: this._hostVisible },
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
      let i;
      if (t)
        i = this._container;
      else {
        this.onInit(n), e.inlineCss && Ri(n, e.inlineCss);
        try {
          const u = Pt?.theming, d = Ai(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Ni(n, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = Pt?.theming, d = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            d && Vi(n, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && ji(n, e.hostCssKeys), i = document.createElement("div"), i.setAttribute("data-wippy-theme-root", "");
        const s = e.containerClasses ?? [];
        s.length > 0 && i.classList.add(...s), n.appendChild(i), this._container = i, Oi($i);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = wi("@theme", (s) => this._applyTheme(s)));
      const { props: r, errors: o } = Ge(this, e.propsSchema);
      e.validateProps && o.push(...e.validateProps(r));
      const a = r;
      this._lastProps = a, this._lastErrors = o;
      let l = null;
      e.contentTemplate && (l = this._extractContent(e.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const s = this._extractContent(e.contentTemplate);
        this._lastContent = s, this._reactive?.notifyContent(s), this.onContentChanged(s);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, i, a, o, l, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(e = Pi.getThemeMode?.()) {
    Ne(e, this), this._container && Ne(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Ne("auto", this), this._container && Ne("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === et) {
      const l = this._hostVisible, s = Ct(this);
      if (s === l)
        return;
      this._hostVisible = s, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(s, l), this.onHostVisibilityChanged(s, l));
      return;
    }
    const i = this.constructor.wippyConfig, { props: r, errors: o } = Ge(this, i.propsSchema);
    i.validateProps && o.push(...i.validateProps(r));
    const a = r;
    this._lastProps = a, this._lastErrors = o, this._reactive?.notifyProps(a, o), this.onPropsChanged(a, o);
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
function Bi(e) {
  return e.__wippyHostBus ?? null;
}
function Wi(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.1.0
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let fn;
const hn = (e) => fn = e, Fi = () => si() && Ye(vn) || fn, vn = (
  /* istanbul ignore next */
  Symbol()
);
function zi() {
  const e = ai(!0), t = e.run(() => K({}));
  let n = [], i = [];
  const r = li({
    install(o) {
      hn(r), r._a = o, o.provide(vn, r), o.config.globalProperties.$pinia = r, i.forEach((a) => n.push(a)), i = [];
    },
    use(o) {
      return this._a ? n.push(o) : i.push(o), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return r;
}
var Ki = Object.defineProperty, Yi = (e, t, n) => t in e ? Ki(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, pe = (e, t, n) => Yi(e, typeof t != "symbol" ? t + "" : t, n), yn = /* @__PURE__ */ Symbol("wippy:emit"), gn = /* @__PURE__ */ Symbol("wippy:props"), Gi = /* @__PURE__ */ Symbol("wippy:props_error"), qi = /* @__PURE__ */ Symbol("wippy:content"), Zi = /* @__PURE__ */ Symbol("wippy:panel-id"), Qi = /* @__PURE__ */ Symbol("wippy:layout-bus"), Ji = /* @__PURE__ */ Symbol("wippy:host"), bn = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ks() {
  const e = Ye(gn);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function xs() {
  const e = Ye(yn);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function Xi() {
  const e = Ye(bn);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function Ls(e) {
  const t = Xi();
  let n = !1, i = null, r = !1;
  function o() {
    if (i)
      return r = !0, i;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (s) {
      a = Promise.reject(s);
    }
    const l = a.finally(() => {
      if (i === l && (i = null, n && r))
        return r = !1, o();
    });
    return i = l, l;
  }
  return un(() => (n = !0, o())), di(() => {
    n = !1, r = !1;
  }), he(t, (a, l) => {
    if (n && l === !1 && a === !0)
      return o();
  }), t;
}
var Es = class extends Ui {
  constructor() {
    super(...arguments), pe(this, "_vueApp", null), pe(this, "_propsRef", K({})), pe(this, "_errorsRef", K([])), pe(this, "_contentRef", K(null)), pe(this, "_hostVisibilityRef", K(null)), pe(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, i, r, o) {
    const a = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = i, this._contentRef.value = r ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of i)
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
      const d = Fi(), c = ui(u.rootComponent);
      this._vueApp = c;
      const m = zi();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          m.use(p);
      if (c.use(m), u.plugins)
        for (const p of u.plugins)
          c.use(p);
      c.provide(gn, this._propsRef), c.provide(Gi, this._errorsRef), c.provide(yn, this.emitEvent.bind(this)), c.provide(qi, this._contentRef), c.provide(bn, this._hostVisibilityRef), c.provide(Zi, Wi(this)), c.provide(Qi, Bi(this)), c.provide(Ji, pn(this)), u.providers && u.providers(c, this), c.mount(t), d && hn(d);
    };
    if (a.rootComponent)
      s(a);
    else if (a.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), a.lazyConfig().then((d) => {
        l.signal.aborted || (u.remove(), s(d));
      }).catch((d) => {
        if (l.signal.aborted)
          return;
        const c = d instanceof Error ? d.message : String(d), m = document.createElement("wippy-error");
        m.setAttribute("title", "Failed to load"), m.setAttribute("message", c), u.replaceWith(m), this.emitEvent("error", { message: c });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, er = Object.defineProperty, kt = Object.getOwnPropertySymbols, tr = Object.prototype.hasOwnProperty, nr = Object.prototype.propertyIsEnumerable, xt = (e, t, n) => t in e ? er(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ir = (e, t) => {
  for (var n in t || (t = {})) tr.call(t, n) && xt(e, n, t[n]);
  if (kt) for (var n of kt(t)) nr.call(t, n) && xt(e, n, t[n]);
  return e;
};
function Ae(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function dt(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function T(e) {
  return !Ae(e);
}
function W(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function _n(e = {}, t = {}) {
  let n = ir({}, e);
  return Object.keys(t).forEach((i) => {
    let r = i;
    W(t[r]) && r in e && W(e[r]) ? n[r] = _n(e[r], t[r]) : n[r] = t[r];
  }), n;
}
function rr(...e) {
  return e.reduce((t, n, i) => i === 0 ? n : _n(t, n), {});
}
function j(e, ...t) {
  return dt(e) ? e(...t) : e;
}
function R(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function B(e) {
  return R(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function ct(e, t = "", n = {}) {
  let i = B(t).split("."), r = i.shift();
  if (r) {
    if (W(e)) {
      let o = Object.keys(e).find((a) => B(a) === r) || "";
      return ct(j(e[o], n), i.join("."), n);
    }
    return;
  }
  return j(e, n);
}
function Sn(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function or(e) {
  return T(e) && !isNaN(e);
}
function se(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function sr(...e) {
  return rr(...e);
}
function $e(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function ar(e) {
  return R(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function $n(e) {
  return R(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function mt() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let i = e.get(t);
    return i ? i.push(n) : i = [n], e.set(t, i), this;
  }, off(t, n) {
    let i = e.get(t);
    return i && i.splice(i.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let i = e.get(t);
    i && i.forEach((r) => {
      r(n);
    });
  }, clear() {
    e.clear();
  } };
}
function pt(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let i = e[n];
      if (!i) continue;
      let r = typeof i;
      if (r === "string" || r === "number") t.push(i);
      else if (r === "object") {
        let o = Array.isArray(i) ? [pt(...i)] : Object.entries(i).map(([a, l]) => l ? a : void 0);
        t = o.length ? t.concat(o.filter((a) => !!a)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function lr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function ur(e, t) {
  if (e && t) {
    let n = (i) => {
      lr(e, i) || (e.classList ? e.classList.add(i) : e.className += " " + i);
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function qe(e, t) {
  if (e && t) {
    let n = (i) => {
      e.classList ? e.classList.remove(i) : e.className = e.className.replace(new RegExp("(^|\\b)" + i.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((i) => i.split(" ").forEach(n));
  }
}
function Lt(e) {
  for (let t of document?.styleSheets) try {
    for (let n of t?.cssRules) for (let i of n?.style) if (e.test(i)) return { name: i, value: n.style.getPropertyValue(i).trim() };
  } catch {
  }
  return null;
}
function dr(e) {
  let t = { width: 0, height: 0 };
  if (e) {
    let [n, i] = [e.style.visibility, e.style.display], r = e.getBoundingClientRect();
    e.style.visibility = "hidden", e.style.display = "block", t.width = r.width || e.offsetWidth, t.height = r.height || e.offsetHeight, e.style.display = i, e.style.visibility = n;
  }
  return t;
}
function cr() {
  let e = window, t = document, n = t.documentElement, i = t.getElementsByTagName("body")[0], r = e.innerWidth || n.clientWidth || i.clientWidth, o = e.innerHeight || n.clientHeight || i.clientHeight;
  return { width: r, height: o };
}
function tt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function mr() {
  let e = document.documentElement;
  return (window.pageXOffset || tt(e)) - (e.clientLeft || 0);
}
function pr() {
  let e = document.documentElement;
  return (window.pageYOffset || e.scrollTop) - (e.clientTop || 0);
}
function fr(e) {
  return e ? getComputedStyle(e).direction === "rtl" : !1;
}
function hr(e, t, n = !0) {
  var i, r, o, a;
  if (e) {
    let l = e.offsetParent ? { width: e.offsetWidth, height: e.offsetHeight } : dr(e), s = l.height, u = l.width, d = t.offsetHeight, c = t.offsetWidth, m = t.getBoundingClientRect(), p = pr(), f = mr(), y = cr(), v, g, _ = "top";
    m.top + d + s > y.height ? (v = m.top + p - s, _ = "bottom", v < 0 && (v = p)) : v = d + m.top + p, m.left + u > y.width ? g = Math.max(0, m.left + f + c - u) : g = m.left + f, fr(e) ? e.style.insetInlineEnd = g + "px" : e.style.insetInlineStart = g + "px", e.style.top = v + "px", e.style.transformOrigin = _, n && (e.style.marginTop = _ === "bottom" ? `calc(${(r = (i = Lt(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? r : "2px"} * -1)` : (a = (o = Lt(/-anchor-gutter$/)) == null ? void 0 : o.value) != null ? a : "");
  }
}
function vr(e, t) {
  e && (typeof t == "string" ? e.style.cssText = t : Object.entries(t || {}).forEach(([n, i]) => e.style[n] = i));
}
function Ue(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function On(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function yr(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && On(e));
}
function le(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Be(e, t = {}) {
  if (le(e)) {
    let n = (i, r) => {
      var o, a;
      let l = (o = e?.$attrs) != null && o[i] ? [(a = e?.$attrs) == null ? void 0 : a[i]] : [];
      return [r].flat().reduce((s, u) => {
        if (u != null) {
          let d = typeof u;
          if (d === "string" || d === "number") s.push(u);
          else if (d === "object") {
            let c = Array.isArray(u) ? n(i, u) : Object.entries(u).map(([m, p]) => i === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            s = c.length ? s.concat(c.filter((m) => !!m)) : s;
          }
        }
        return s;
      }, l);
    };
    Object.entries(t).forEach(([i, r]) => {
      if (r != null) {
        let o = i.match(/^on(.+)/);
        o ? e.addEventListener(o[1].toLowerCase(), r) : i === "p-bind" || i === "pBind" ? Be(e, r) : (r = i === "class" ? [...new Set(n("class", r))].join(" ").trim() : i === "style" ? n("style", r).join(";").trim() : r, (e.$attrs = e.$attrs || {}) && (e.$attrs[i] = r), e.setAttribute(i, r));
      }
    });
  }
}
function gr(e, t = {}, ...n) {
  {
    let i = document.createElement(e);
    return Be(i, t), i.append(...n), i;
  }
}
function _e(e, t) {
  return le(e) ? Array.from(e.querySelectorAll(t)) : [];
}
function We(e, t) {
  return le(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function je(e, t) {
  e && document.activeElement !== e && e.focus(t);
}
function br(e, t) {
  if (le(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function wn(e, t = "") {
  let n = _e(e, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`), i = [];
  for (let r of n) getComputedStyle(r).display != "none" && getComputedStyle(r).visibility != "hidden" && i.push(r);
  return i;
}
function As(e, t) {
  let n = wn(e, t);
  return n.length > 0 ? n[0] : null;
}
function Et(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Is(e, t) {
  let n = wn(e, t);
  return n.length > 0 ? n[n.length - 1] : null;
}
function _r(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || tt(document.documentElement) || tt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Sr(e, t) {
  return e ? e.offsetHeight : 0;
}
function Pn(e, t = []) {
  let n = On(e);
  return n === null ? t : Pn(n, t.concat([n]));
}
function $r(e) {
  let t = [];
  if (e) {
    let n = Pn(e), i = /(auto|scroll)/, r = (o) => {
      try {
        let a = window.getComputedStyle(o, null);
        return i.test(a.getPropertyValue("overflow")) || i.test(a.getPropertyValue("overflowX")) || i.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let o of n) {
      let a = o.nodeType === 1 && o.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let s of l) {
          let u = We(o, s);
          u && r(u) && t.push(u);
        }
      }
      o.nodeType !== 9 && r(o) && t.push(o);
    }
  }
  return t;
}
function At(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Cn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Ns(e, t = "") {
  return le(e) ? e.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`) : !1;
}
function Or() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function wr(e, t = "", n) {
  le(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Re = {};
function Pr(e = "pui_id_") {
  return Object.hasOwn(Re, e) || (Re[e] = 0), Re[e]++, `${e}${Re[e]}`;
}
function Cr() {
  let e = [], t = (a, l, s = 999) => {
    let u = r(a, l, s), d = u.value + (u.key === a ? 0 : s) + 1;
    return e.push({ key: a, value: d }), d;
  }, n = (a) => {
    e = e.filter((l) => l.value !== a);
  }, i = (a, l) => r(a).value, r = (a, l, s = 0) => [...e].reverse().find((u) => !0) || { key: a, value: s }, o = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: o, set: (a, l, s) => {
    l && (l.style.zIndex = String(t(a, !0, s)));
  }, clear: (a) => {
    a && (n(o(a)), a.style.zIndex = "");
  }, getCurrent: (a) => i(a) };
}
var Ze = Cr(), Tr = Object.defineProperty, kr = Object.defineProperties, xr = Object.getOwnPropertyDescriptors, Fe = Object.getOwnPropertySymbols, Tn = Object.prototype.hasOwnProperty, kn = Object.prototype.propertyIsEnumerable, It = (e, t, n) => t in e ? Tr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, D = (e, t) => {
  for (var n in t || (t = {})) Tn.call(t, n) && It(e, n, t[n]);
  if (Fe) for (var n of Fe(t)) kn.call(t, n) && It(e, n, t[n]);
  return e;
}, Qe = (e, t) => kr(e, xr(t)), z = (e, t) => {
  var n = {};
  for (var i in e) Tn.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
  if (e != null && Fe) for (var i of Fe(e)) t.indexOf(i) < 0 && kn.call(e, i) && (n[i] = e[i]);
  return n;
}, Lr = mt(), A = Lr, Oe = /{([^}]*)}/g, xn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Ln = /var\([^)]+\)/g;
function Nt(e) {
  return R(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Er(e) {
  return W(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Ar(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function nt(e = "", t = "") {
  return Ar(`${R(e, !1) && R(t, !1) ? `${e}-` : e}${t}`);
}
function En(e = "", t = "") {
  return `--${nt(e, t)}`;
}
function Ir(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function An(e, t = "", n = "", i = [], r) {
  if (R(e)) {
    let o = e.trim();
    if (Ir(o)) return;
    if (se(o, Oe)) {
      let a = o.replaceAll(Oe, (l) => {
        let s = l.replace(/{|}/g, "").split(".").filter((u) => !i.some((d) => se(u, d)));
        return `var(${En(n, $n(s.join("-")))}${T(r) ? `, ${r}` : ""})`;
      });
      return se(a.replace(Ln, "0"), xn) ? `calc(${a})` : a;
    }
    return o;
  } else if (or(e)) return e;
}
function Nr(e, t, n) {
  R(t, !1) && e.push(`${t}:${n};`);
}
function fe(e, t) {
  return e ? `${e}{${t}}` : "";
}
function In(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(a, l) {
    let s = [], u = 0, d = "", c = null, m = 0;
    for (; u <= a.length; ) {
      let p = a[u];
      if ((p === '"' || p === "'" || p === "`") && a[u - 1] !== "\\" && (c = c === p ? null : p), !c && (p === "(" && m++, p === ")" && m--, (p === "," || u === a.length) && m === 0)) {
        let f = d.trim();
        f.startsWith("dt(") ? s.push(In(f, l)) : s.push(i(f)), d = "", u++;
        continue;
      }
      p !== void 0 && (d += p), u++;
    }
    return s;
  }
  function i(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let s = Number(a);
    return isNaN(s) ? a : s;
  }
  let r = [], o = [];
  for (let a = 0; a < e.length; a++) if (e[a] === "d" && e.slice(a, a + 3) === "dt(") o.push(a), a += 2;
  else if (e[a] === ")" && o.length > 0) {
    let l = o.pop();
    o.length === 0 && r.push([l, a]);
  }
  if (!r.length) return e;
  for (let a = r.length - 1; a >= 0; a--) {
    let [l, s] = r[a], u = e.slice(l + 3, s), d = n(u, t), c = t(...d);
    e = e.slice(0, l) + c + e.slice(s + 1);
  }
  return e;
}
var ae = (...e) => jr(w.getTheme(), ...e), jr = (e = {}, t, n, i) => {
  if (t) {
    let { variable: r, options: o } = w.defaults || {}, { prefix: a, transform: l } = e?.options || o || {}, s = se(t, Oe) ? t : `{${t}}`;
    return i === "value" || Ae(i) && l === "strict" ? w.getTokenValue(t) : An(s, void 0, a, [r.excludedKeyRegex], n);
  }
  return "";
};
function Ve(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((i, r, o) => {
      var a;
      return i + r + ((a = j(t[o], { dt: ae })) != null ? a : "");
    }, "");
    return In(n, ae);
  }
  return j(e, { dt: ae });
}
function Rr(e, t = {}) {
  let n = w.defaults.variable, { prefix: i = n.prefix, selector: r = n.selector, excludedKeyRegex: o = n.excludedKeyRegex } = t, a = [], l = [], s = [{ node: e, path: i }];
  for (; s.length; ) {
    let { node: d, path: c } = s.pop();
    for (let m in d) {
      let p = d[m], f = Er(p), y = se(m, o) ? nt(c) : nt(c, $n(m));
      if (W(f)) s.push({ node: f, path: y });
      else {
        let v = En(y), g = An(f, y, i, [o]);
        Nr(l, v, g);
        let _ = y;
        i && _.startsWith(i + "-") && (_ = _.slice(i.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: fe(r, u) };
}
var M = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
    var i;
    return (i = t.map((r) => r.resolve(n)).find((r) => r.matched)) != null ? i : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Rr(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o, a, l, s, u, d, c;
  let { preset: m, options: p } = t, f, y, v, g, _, P, h;
  if (T(m) && p.transform !== "strict") {
    let { primitive: S, semantic: E, extend: V } = m, Y = E || {}, { colorScheme: G } = Y, X = z(Y, ["colorScheme"]), q = V || {}, { colorScheme: ee } = q, te = z(q, ["colorScheme"]), Z = G || {}, { dark: ne } = Z, ue = z(Z, ["dark"]), ie = ee || {}, { dark: de } = ie, ce = z(ie, ["dark"]), F = T(S) ? this._toVariables({ primitive: S }, p) : {}, H = T(X) ? this._toVariables({ semantic: X }, p) : {}, re = T(ue) ? this._toVariables({ light: ue }, p) : {}, Ie = T(ne) ? this._toVariables({ dark: ne }, p) : {}, me = T(te) ? this._toVariables({ semantic: te }, p) : {}, gt = T(ce) ? this._toVariables({ light: ce }, p) : {}, bt = T(de) ? this._toVariables({ dark: de }, p) : {}, [Bn, Wn] = [(o = F.declarations) != null ? o : "", F.tokens], [Fn, zn] = [(a = H.declarations) != null ? a : "", H.tokens || []], [Kn, Yn] = [(l = re.declarations) != null ? l : "", re.tokens || []], [Gn, qn] = [(s = Ie.declarations) != null ? s : "", Ie.tokens || []], [Zn, Qn] = [(u = me.declarations) != null ? u : "", me.tokens || []], [Jn, Xn] = [(d = gt.declarations) != null ? d : "", gt.tokens || []], [ei, ti] = [(c = bt.declarations) != null ? c : "", bt.tokens || []];
    f = this.transformCSS(e, Bn, "light", "variable", p, i, r), y = Wn;
    let ni = this.transformCSS(e, `${Fn}${Kn}`, "light", "variable", p, i, r), ii = this.transformCSS(e, `${Gn}`, "dark", "variable", p, i, r);
    v = `${ni}${ii}`, g = [.../* @__PURE__ */ new Set([...zn, ...Yn, ...qn])];
    let ri = this.transformCSS(e, `${Zn}${Jn}color-scheme:light`, "light", "variable", p, i, r), oi = this.transformCSS(e, `${ei}color-scheme:dark`, "dark", "variable", p, i, r);
    _ = `${ri}${oi}`, P = [.../* @__PURE__ */ new Set([...Qn, ...Xn, ...ti])], h = j(m.css, { dt: ae });
  }
  return { primitive: { css: f, tokens: y }, semantic: { css: v, tokens: g }, global: { css: _, tokens: P }, style: h };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: i, set: r, defaults: o, selector: a }) {
  var l, s, u;
  let d, c, m;
  if (T(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), f = t, { colorScheme: y, extend: v, css: g } = f, _ = z(f, ["colorScheme", "extend", "css"]), P = v || {}, { colorScheme: h } = P, S = z(P, ["colorScheme"]), E = y || {}, { dark: V } = E, Y = z(E, ["dark"]), G = h || {}, { dark: X } = G, q = z(G, ["dark"]), ee = T(_) ? this._toVariables({ [p]: D(D({}, _), S) }, n) : {}, te = T(Y) ? this._toVariables({ [p]: D(D({}, Y), q) }, n) : {}, Z = T(V) ? this._toVariables({ [p]: D(D({}, V), X) }, n) : {}, [ne, ue] = [(l = ee.declarations) != null ? l : "", ee.tokens || []], [ie, de] = [(s = te.declarations) != null ? s : "", te.tokens || []], [ce, F] = [(u = Z.declarations) != null ? u : "", Z.tokens || []], H = this.transformCSS(p, `${ne}${ie}`, "light", "variable", n, r, o, a), re = this.transformCSS(p, ce, "dark", "variable", n, r, o, a);
    d = `${H}${re}`, c = [.../* @__PURE__ */ new Set([...ue, ...de, ...F])], m = j(g, { dt: ae });
  }
  return { css: d, tokens: c, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o;
  let { preset: a, options: l } = t, s = (o = a?.components) == null ? void 0 : o[e];
  return this.getPreset({ name: e, preset: s, options: l, params: n, set: i, defaults: r });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: i, defaults: r }) {
  var o, a;
  let l = e.replace("-directive", ""), { preset: s, options: u } = t, d = ((o = s?.components) == null ? void 0 : o[l]) || ((a = s?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: d, options: u, params: n, set: i, defaults: r });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, i) {
  let { cssLayer: r } = t;
  return r ? `@layer ${j(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: r, defaults: o }) {
  let a = this.getCommon({ name: e, theme: t, params: n, set: r, defaults: o }), l = Object.entries(i).reduce((s, [u, d]) => s.push(`${u}="${d}"`) && s, []).join(" ");
  return Object.entries(a || {}).reduce((s, [u, d]) => {
    if (W(d) && Object.hasOwn(d, "css")) {
      let c = $e(d.css), m = `${u}-variables`;
      s.push(`<style type="text/css" data-primevue-style-id="${m}" ${l}>${c}</style>`);
    }
    return s;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: i = {}, set: r, defaults: o }) {
  var a;
  let l = { name: e, theme: t, params: n, set: r, defaults: o }, s = (a = e.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(i).reduce((d, [c, m]) => d.push(`${c}="${m}"`) && d, []).join(" ");
  return s ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${$e(s)}</style>` : "";
}, createTokens(e = {}, t, n = "", i = "", r = {}) {
  let o = function(l, s = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: s, value: void 0 };
    u.push(this.path), s.name = this.path, s.binding || (s.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && Oe.test(this.value)) {
      let c = this.value.trim().replace(Oe, (m) => {
        var p;
        let f = m.slice(1, -1), y = this.tokens[f];
        if (!y) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
        let v = y.computed(l, s, u);
        return Array.isArray(v) && v.length === 2 ? `light-dark(${v[0].value},${v[1].value})` : (p = v?.value) != null ? p : "__UNRESOLVED__";
      });
      d = xn.test(c.replace(Ln, "0")) ? `calc(${c})` : c;
    }
    return Ae(s.binding) && delete s.binding, u.pop(), { colorScheme: l, path: this.path, paths: s, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, a = (l, s, u) => {
    Object.entries(l).forEach(([d, c]) => {
      let m = se(d, t.variable.excludedKeyRegex) ? s : s ? `${s}.${Nt(d)}` : Nt(d), p = u ? `${u}.${d}` : d;
      W(c) ? a(c, m, p) : (r[m] || (r[m] = { paths: [], computed: (f, y = {}, v = []) => {
        if (r[m].paths.length === 1) return r[m].paths[0].computed(r[m].paths[0].scheme, y.binding, v);
        if (f && f !== "none") for (let g = 0; g < r[m].paths.length; g++) {
          let _ = r[m].paths[g];
          if (_.scheme === f) return _.computed(f, y.binding, v);
        }
        return r[m].paths.map((g) => g.computed(g.scheme, y[g.scheme], v));
      } }), r[m].paths.push({ path: p, value: c, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: o, tokens: r }));
    });
  };
  return a(e, n, i), r;
}, getTokenValue(e, t, n) {
  var i;
  let r = ((l) => l.split(".").filter((s) => !se(s.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), o = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, a = [(i = e[r]) == null ? void 0 : i.computed(o)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, s) => {
    let u = s, { colorScheme: d } = u, c = z(u, ["colorScheme"]);
    return l[d] = c, l;
  }, void 0);
}, getSelectorRule(e, t, n, i) {
  return n === "class" || n === "attr" ? fe(T(t) ? `${e}${t},${e} ${t}` : e, i) : fe(e, fe(t ?? ":root,:host", i));
}, transformCSS(e, t, n, i, r = {}, o, a, l) {
  if (T(t)) {
    let { cssLayer: s } = r;
    if (i !== "style") {
      let u = this.getColorSchemeOption(r, a);
      t = n === "dark" ? u.reduce((d, { type: c, selector: m }) => (T(m) && (d += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, l, c, t)), d), "") : fe(l ?? ":root,:host", t);
    }
    if (s) {
      let u = { name: "primeui" };
      W(s) && (u.name = j(s.name, { name: e, type: i })), T(u.name) && (t = fe(`@layer ${u.name}`, t), o?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, w = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Qe(D({}, t), { options: D(D({}, this.defaults.options), t.options) }), this._tokens = M.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this._theme = Qe(D({}, this.theme), { preset: e }), this._tokens = M.createTokens(e, this.defaults), this.clearLoadedStyleNames(), A.emit("preset:change", e), A.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Qe(D({}, this.theme), { options: e }), this.clearLoadedStyleNames(), A.emit("options:change", e), A.emit("theme:change", this.theme);
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
  return M.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return M.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetD(n);
}, getCustomPreset(e = "", t, n, i) {
  let r = { name: e, preset: t, options: this.options, selector: n, params: i, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPreset(r);
}, getLayerOrderCSS(e = "") {
  return M.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", i) {
  return M.transformCSS(e, t, i, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return M.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return M.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), A.emit(`theme:${t}:load`, e), !this._loadingStyles.size && A.emit("theme:load"));
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
}, Vr = `
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
function we(e) {
  "@babel/helpers - typeof";
  return we = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, we(e);
}
function jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Rt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jt(Object(n), !0).forEach(function(i) {
      Mr(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Mr(e, t, n) {
  return (t = Dr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Dr(e) {
  var t = Hr(e, "string");
  return we(t) == "symbol" ? t : t + "";
}
function Hr(e, t) {
  if (we(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (we(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ur(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  _t() && _t().components ? un(e) : t ? e() : mi(e);
}
var Br = 0;
function Wr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = K(!1), i = K(e), r = K(null), o = Cn() ? window.document : void 0, a = t.document, l = a === void 0 ? o : a, s = t.immediate, u = s === void 0 ? !0 : s, d = t.manual, c = d === void 0 ? !1 : d, m = t.name, p = m === void 0 ? "style_".concat(++Br) : m, f = t.id, y = f === void 0 ? void 0 : f, v = t.media, g = v === void 0 ? void 0 : v, _ = t.nonce, P = _ === void 0 ? void 0 : _, h = t.first, S = h === void 0 ? !1 : h, E = t.onMounted, V = E === void 0 ? void 0 : E, Y = t.onUpdated, G = Y === void 0 ? void 0 : Y, X = t.onLoad, q = X === void 0 ? void 0 : X, ee = t.props, te = ee === void 0 ? {} : ee, Z = function() {
  }, ne = function(de) {
    var ce = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var F = Rt(Rt({}, te), ce), H = F.name || p, re = F.id || y, Ie = F.nonce || P;
      r.value = l.querySelector('style[data-primevue-style-id="'.concat(H, '"]')) || l.getElementById(re) || l.createElement("style"), r.value.isConnected || (i.value = de || e, Be(r.value, {
        type: "text/css",
        id: re,
        media: g,
        nonce: Ie
      }), S ? l.head.prepend(r.value) : l.head.appendChild(r.value), wr(r.value, "data-primevue-style-id", H), Be(r.value, F), r.value.onload = function(me) {
        return q?.(me, {
          name: H
        });
      }, V?.(H)), !n.value && (Z = he(i, function(me) {
        r.value.textContent = me, G?.(H);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ue = function() {
    !l || !n.value || (Z(), yr(r.value) && l.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return u && !c && Ur(ne), {
    id: y,
    name: p,
    el: r,
    css: i,
    unload: ue,
    load: ne,
    isLoaded: ci(n)
  };
}
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pe(e);
}
var Vt, Mt, Dt, Ht;
function Ut(e, t) {
  return Yr(e) || Kr(e, t) || zr(e, t) || Fr();
}
function Fr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zr(e, t) {
  if (e) {
    if (typeof e == "string") return Bt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Bt(e, t) : void 0;
  }
}
function Bt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Kr(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t !== 0) for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
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
function Yr(e) {
  if (Array.isArray(e)) return e;
}
function Wt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Je(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Wt(Object(n), !0).forEach(function(i) {
      Gr(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Gr(e, t, n) {
  return (t = qr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function qr(e) {
  var t = Zr(e, "string");
  return Pe(t) == "symbol" ? t : t + "";
}
function Zr(e, t) {
  if (Pe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Pe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Me(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Qr = function(t) {
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
}, Jr = {}, Xr = {}, C = {
  name: "base",
  css: Qr,
  style: Vr,
  classes: Jr,
  inlineStyles: Xr,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(o) {
      return o;
    }, r = i(Ve(Vt || (Vt = Me(["", ""])), t));
    return T(r) ? Wr($e(r), Je({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return w.transformCSS(n.name || t.name, "".concat(r).concat(Ve(Mt || (Mt = Me(["", ""])), i)));
    });
  },
  getCommonTheme: function(t) {
    return w.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return w.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return w.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, i) {
    return w.getCustomPreset(this.name, t, n, i);
  },
  getLayerOrderThemeCSS: function() {
    return w.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var i = j(this.css, {
        dt: ae
      }) || "", r = $e(Ve(Dt || (Dt = Me(["", "", ""])), i, t)), o = Object.entries(n).reduce(function(a, l) {
        var s = Ut(l, 2), u = s[0], d = s[1];
        return a.push("".concat(u, '="').concat(d, '"')) && a;
      }, []).join(" ");
      return T(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(o, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return w.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = [w.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), o = Ve(Ht || (Ht = Me(["", ""])), j(this.style, {
        dt: ae
      })), a = $e(w.transformCSS(r, o)), l = Object.entries(n).reduce(function(s, u) {
        var d = Ut(u, 2), c = d[0], m = d[1];
        return s.push("".concat(c, '="').concat(m, '"')) && s;
      }, []).join(" ");
      T(a) && i.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return i.join("");
  },
  extend: function(t) {
    return Je(Je({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, J = mt();
function Ce(e) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ce(e);
}
function Ft(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function De(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ft(Object(n), !0).forEach(function(i) {
      eo(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ft(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function eo(e, t, n) {
  return (t = to(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function to(e) {
  var t = no(e, "string");
  return Ce(t) == "symbol" ? t : t + "";
}
function no(e, t) {
  if (Ce(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ce(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var io = {
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
}, ro = Symbol();
function oo(e, t) {
  var n = {
    config: pi(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(ro, n), so(), ao(e, n), n;
}
var ve = [];
function so() {
  A.clear(), ve.forEach(function(e) {
    return e?.();
  }), ve = [];
}
function ao(e, t) {
  var n = K(!1), i = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !w.isStyleNameLoaded("common")) {
      var d, c, m = ((d = C.getCommonTheme) === null || d === void 0 ? void 0 : d.call(C)) || {}, p = m.primitive, f = m.semantic, y = m.global, v = m.style, g = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      C.load(p?.css, De({
        name: "primitive-variables"
      }, g)), C.load(f?.css, De({
        name: "semantic-variables"
      }, g)), C.load(y?.css, De({
        name: "global-variables"
      }, g)), C.loadStyle(De({
        name: "global-style"
      }, g), v), w.setLoadedStyleName("common");
    }
  };
  A.on("theme:change", function(s) {
    n.value || (e.config.globalProperties.$primevue.config.theme = s, n.value = !0);
  });
  var r = he(t.config, function(s, u) {
    J.emit("config:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), o = he(function() {
    return t.config.ripple;
  }, function(s, u) {
    J.emit("config:ripple:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = he(function() {
    return t.config.theme;
  }, function(s, u) {
    n.value || w.setTheme(s), t.config.unstyled || i(), n.value = !1, J.emit("config:theme:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = he(function() {
    return t.config.unstyled;
  }, function(s, u) {
    !s && t.config.theme && i(), J.emit("config:unstyled:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ve.push(r), ve.push(o), ve.push(a), ve.push(l);
}
var lo = {
  install: function(t, n) {
    var i = sr(io, n);
    oo(t, i);
  }
}, ft = {
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
    this.mounted = Cn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function uo(e, t, n, i, r, o) {
  return o.inline ? oe(e.$slots, "default", {
    key: 0
  }) : r.mounted ? (x(), ye(dn, {
    key: 1,
    to: n.appendTo
  }, [oe(e.$slots, "default")], 8, ["to"])) : U("", !0);
}
ft.render = uo;
var Q = {
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
function co() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = fi();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var zt = C.extend({
  name: "common"
});
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
function mo(e) {
  return Rn(e) || po(e) || jn(e) || Nn();
}
function po(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function be(e, t) {
  return Rn(e) || fo(e, t) || jn(e, t) || Nn();
}
function Nn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jn(e, t) {
  if (e) {
    if (typeof e == "string") return it(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? it(e, t) : void 0;
  }
}
function it(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function fo(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        s = !1;
      } else for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
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
function Rn(e) {
  if (Array.isArray(e)) return e;
}
function Kt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function $(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kt(Object(n), !0).forEach(function(i) {
      Se(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Kt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function Se(e, t, n) {
  return (t = ho(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ho(e) {
  var t = vo(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function vo(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Te(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ht = {
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
        var i = this;
        A.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return i._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, i, r, o, a, l, s, u, d, c, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, f = m ? (i = this.pt) === null || i === void 0 || (i = i.value) === null || i === void 0 ? void 0 : i[this.$.type.name] : this.pt;
    (r = f || p) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (o = r.onBeforeCreate) === null || o === void 0 || o.call(r);
    var y = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, v = y ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, g = y ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (d = g || v) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (c = d.onBeforeCreate) === null || c === void 0 || c.call(d), this.$attrSelector = co(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = We(le(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), i = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), i?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        i[r - 1] = arguments[r];
      return dt(t) ? t.apply(void 0, i) : L.apply(void 0, i);
    },
    _load: function() {
      Q.isStyleNameLoaded("base") || (C.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Q.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Q.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (zt.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Q.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      T(t) && C.load(t, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!w.isStyleNameLoaded("common")) {
          var i, r, o = ((i = this.$style) === null || i === void 0 || (r = i.getCommonTheme) === null || r === void 0 ? void 0 : r.call(i)) || {}, a = o.primitive, l = o.semantic, s = o.global, u = o.style;
          C.load(a?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), C.load(l?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), C.load(s?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), C.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), w.setLoadedStyleName("common");
        }
        if (!w.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, c, m, p, f = ((d = this.$style) === null || d === void 0 || (c = d.getComponentTheme) === null || c === void 0 ? void 0 : c.call(d)) || {}, y = f.css, v = f.style;
          (m = this.$style) === null || m === void 0 || m.load(y, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), v), w.setLoadedStyleName(this.$style.name);
        }
        if (!w.isStyleNameLoaded("layer-order")) {
          var g, _, P = (g = this.$style) === null || g === void 0 || (_ = g.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(g);
          C.load(P, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), w.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, i, r, o = ((n = this.$style) === null || n === void 0 || (i = n.getPresetTheme) === null || i === void 0 ? void 0 : i.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, a = o.css, l = (r = this.$style) === null || r === void 0 ? void 0 : r.load(a, $({
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
      Q.clearLoadedStyleNames(), A.on("theme:change", t);
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
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return ct(t, n, i);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(i) && !!r[i.split(".")[0]], l = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = o ? a ? this._useGlobalPT(this._getPTClassValue, i, r) : this._useDefaultPT(this._getPTClassValue, i, r) : void 0, p = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, i, $($({}, r), {}, {
        global: m || {}
      })), f = this._getPTDatasets(i);
      return u || !u && p ? c ? this._mergeProps(c, m, p, f) : $($($({}, m), p), f) : $($({}, p), f);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        i[r - 1] = arguments[r];
      return L(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(i)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(i))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", o = i === "root" && T((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return i !== "transition" && $($({}, i === "root" && $($(Se({}, "".concat(r, "name"), B(o ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), o && Se({}, "".concat(r, "extend"), B(this.$.type.name))), {}, Se({}, "".concat(this.$attrSelector), ""))), {}, Se({}, "".concat(r, "section"), B(i)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return R(t) || Sn(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(l) {
        var s, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = r ? r(l) : l, c = B(i), m = B(n.$name);
        return (s = u ? c !== m ? d?.[c] : void 0 : d?.[c]) !== null && s !== void 0 ? s : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: o(t.originalValue),
        value: o(t.value)
      } : o(t, !0);
    },
    _usePT: function(t, n, i, r) {
      var o = function(y) {
        return n(y, i, r);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var a, l = t._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, d = l.mergeProps, c = d === void 0 ? !1 : d, m = o(t.originalValue), p = o(t.value);
        return m === void 0 && p === void 0 ? void 0 : R(p) ? p : R(m) ? m : u || !u && p ? c ? this._mergeProps(c, m, p) : $($({}, m), p) : p;
      }
      return o(t);
    },
    _useGlobalPT: function(t, n, i) {
      return this._usePT(this.globalPT, t, n, i);
    },
    _useDefaultPT: function(t, n, i) {
      return this._usePT(this.defaultPT, t, n, i);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, $($({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = L(this.$_attrsWithoutPT, this.ptm(n, i));
      return r?.hasOwnProperty("id") && ((t = r.id) !== null && t !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, $({
        instance: this
      }, i), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, $($({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, t, $($({}, this.$params), i)), o = this._getOptionValue(zt.inlineStyles, t, $($({}, this.$params), i));
        return [o, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return j(i, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(i) {
        return n._getOptionValue(i, n.$name, $({}, n.$params)) || j(i, $({}, n.$params));
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
      return Object.fromEntries(Object.entries(this.$props).filter(function(i) {
        var r = be(i, 1), o = r[0];
        return n?.includes(o);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
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
        var n = be(t, 1), i = n[0];
        return i?.startsWith("pt:");
      }).reduce(function(t, n) {
        var i = be(n, 2), r = i[0], o = i[1], a = r.split(":"), l = mo(a), s = it(l).slice(1);
        return s?.reduce(function(u, d, c, m) {
          return !u[d] && (u[d] = c === m.length - 1 ? o : {}), u[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = be(t, 1), i = n[0];
        return !(i != null && i.startsWith("pt:"));
      }).reduce(function(t, n) {
        var i = be(n, 2), r = i[0], o = i[1];
        return t[r] = o, t;
      }, {});
    }
  }
}, yo = `
    .p-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .p-contextmenu-root-list,
    .p-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .p-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .p-contextmenu-item {
        position: relative;
    }

    .p-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .p-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .p-contextmenu-item-label {
        line-height: 1;
    }

    .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .p-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .p-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .p-contextmenu-mobile .p-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-contextmenu-mobile .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`, go = {
  root: function(t) {
    var n = t.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(t) {
    var n = t.instance, i = t.processedItem;
    return ["p-contextmenu-item", {
      "p-contextmenu-item-active": n.isItemActive(i),
      "p-focus": n.isItemFocused(i),
      "p-disabled": n.isItemDisabled(i)
    }];
  },
  itemContent: "p-contextmenu-item-content",
  itemLink: "p-contextmenu-item-link",
  itemIcon: "p-contextmenu-item-icon",
  itemLabel: "p-contextmenu-item-label",
  submenuIcon: "p-contextmenu-submenu-icon",
  submenu: "p-contextmenu-submenu",
  separator: "p-contextmenu-separator"
};
C.extend({
  name: "contextmenu",
  style: yo,
  classes: go
});
var bo = `
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
`, _o = C.extend({
  name: "baseicon",
  css: bo
});
function ke(e) {
  "@babel/helpers - typeof";
  return ke = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ke(e);
}
function Yt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Gt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yt(Object(n), !0).forEach(function(i) {
      So(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Yt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function So(e, t, n) {
  return (t = $o(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function $o(e) {
  var t = Oo(e, "string");
  return ke(t) == "symbol" ? t : t + "";
}
function Oo(e, t) {
  if (ke(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (ke(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var js = {
  name: "BaseIcon",
  extends: ht,
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
  style: _o,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = Ae(this.label);
      return Gt(Gt({}, !this.isUnstyled && {
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
function xe(e) {
  "@babel/helpers - typeof";
  return xe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xe(e);
}
function qt(e, t) {
  return To(e) || Co(e, t) || Po(e, t) || wo();
}
function wo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Po(e, t) {
  if (e) {
    if (typeof e == "string") return Zt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Zt(e, t) : void 0;
  }
}
function Zt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Co(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(e)).next, t !== 0) for (; !(s = (i = o.call(n)).done) && (l.push(i.value), l.length !== t); s = !0) ;
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
function To(e) {
  if (Array.isArray(e)) return e;
}
function Qt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    t && (i = i.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function O(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qt(Object(n), !0).forEach(function(i) {
      rt(e, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qt(Object(n)).forEach(function(i) {
      Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return e;
}
function rt(e, t, n) {
  return (t = ko(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ko(e) {
  var t = xo(e, "string");
  return xe(t) == "symbol" ? t : t + "";
}
function xo(e, t) {
  if (xe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (xe(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var b = {
  _getMeta: function() {
    return [W(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], j(W(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var i, r, o;
    return (i = (t == null || (r = t.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (o = n.ctx) === null || o === void 0 || (o = o.appContext) === null || o === void 0 || (o = o.config) === null || o === void 0 || (o = o.globalProperties) === null || o === void 0 ? void 0 : o.$primevue)) === null || i === void 0 ? void 0 : i.config;
  },
  _getOptionValue: ct,
  _getPTValue: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = function() {
      var _ = b._getOptionValue.apply(b, arguments);
      return R(_) || Sn(_) ? {
        class: _
      } : _;
    }, u = ((t = i.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = i.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = u.mergeSections, c = d === void 0 ? !0 : d, m = u.mergeProps, p = m === void 0 ? !1 : m, f = l ? b._useDefaultPT(i, i.defaultPT(), s, o, a) : void 0, y = b._usePT(i, b._getPT(r, i.$name), s, o, O(O({}, a), {}, {
      global: f || {}
    })), v = b._getPTDatasets(i, o);
    return c || !c && y ? p ? b._mergeProps(i, p, f, y, v) : O(O(O({}, f), y), v) : O(O({}, y), v);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = "data-pc-";
    return O(O({}, n === "root" && rt({}, "".concat(i, "name"), B(t.$name))), {}, rt({}, "".concat(i, "section"), B(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 ? arguments[2] : void 0, r = function(a) {
      var l, s = i ? i(a) : a, u = B(n);
      return (l = s?.[u]) !== null && l !== void 0 ? l : s;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: r(t.originalValue),
      value: r(t.value)
    } : r(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0, a = function(v) {
      return i(v, r, o);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, s = n._usept || ((l = t.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = s.mergeSections, d = u === void 0 ? !0 : u, c = s.mergeProps, m = c === void 0 ? !1 : c, p = a(n.originalValue), f = a(n.value);
      return p === void 0 && f === void 0 ? void 0 : R(f) ? f : R(p) ? p : d || !d && f ? m ? b._mergeProps(t, m, p, f) : O(O({}, p), f) : f;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0;
    return b._usePT(t, n, i, r, o);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = b._getConfig(i, r), a = {
      nonce: o == null || (t = o.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    b._loadCoreStyles(n, a), b._loadThemeStyles(n, a), b._loadScopedThemeStyles(n, a), b._removeThemeListeners(n), n.$loadStyles = function() {
      return b._loadThemeStyles(n, a);
    }, b._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!Q.isStyleNameLoaded((t = i.$style) === null || t === void 0 ? void 0 : t.name) && (n = i.$style) !== null && n !== void 0 && n.name) {
      var o;
      C.loadCSS(r), (o = i.$style) === null || o === void 0 || o.loadCSS(r), Q.setLoadedStyleName(i.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, i, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (t = r.theme) === null || t === void 0 ? void 0 : t.call(r)) === "none")) {
      if (!w.isStyleNameLoaded("common")) {
        var a, l, s = ((a = r.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = s.primitive, d = s.semantic, c = s.global, m = s.style;
        C.load(u?.css, O({
          name: "primitive-variables"
        }, o)), C.load(d?.css, O({
          name: "semantic-variables"
        }, o)), C.load(c?.css, O({
          name: "global-variables"
        }, o)), C.loadStyle(O({
          name: "global-style"
        }, o), m), w.setLoadedStyleName("common");
      }
      if (!w.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (i = r.$style) !== null && i !== void 0 && i.name) {
        var p, f, y, v, g = ((p = r.$style) === null || p === void 0 || (f = p.getDirectiveTheme) === null || f === void 0 ? void 0 : f.call(p)) || {}, _ = g.css, P = g.style;
        (y = r.$style) === null || y === void 0 || y.load(_, O({
          name: "".concat(r.$style.name, "-variables")
        }, o)), (v = r.$style) === null || v === void 0 || v.loadStyle(O({
          name: "".concat(r.$style.name, "-style")
        }, o), P), w.setLoadedStyleName(r.$style.name);
      }
      if (!w.isStyleNameLoaded("layer-order")) {
        var h, S, E = (h = r.$style) === null || h === void 0 || (S = h.getLayerOrderThemeCSS) === null || S === void 0 ? void 0 : S.call(h);
        C.load(E, O({
          name: "layer-order",
          first: !0
        }, o)), w.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, i = t.preset();
    if (i && t.$attrSelector) {
      var r, o, a, l = ((r = t.$style) === null || r === void 0 || (o = r.getPresetTheme) === null || o === void 0 ? void 0 : o.call(r, i, "[".concat(t.$attrSelector, "]"))) || {}, s = l.css, u = (a = t.$style) === null || a === void 0 ? void 0 : a.load(s, O({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Q.clearLoadedStyleNames(), A.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    A.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, i, r, o, a) {
    var l, s, u = "on".concat(ar(n)), d = b._getConfig(r, o), c = i?.$instance, m = b._usePT(c, b._getPT(r == null || (l = r.value) === null || l === void 0 ? void 0 : l.pt, t), b._getOptionValue, "hooks.".concat(u)), p = b._useDefaultPT(c, d == null || (s = d.pt) === null || s === void 0 || (s = s.directives) === null || s === void 0 ? void 0 : s[t], b._getOptionValue, "hooks.".concat(u)), f = {
      el: i,
      binding: r,
      vnode: o,
      prevVnode: a
    };
    m?.(c, f), p?.(c, f);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      i[r - 2] = arguments[r];
    return dt(t) ? t.apply(void 0, i) : L.apply(void 0, i);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = function(l, s, u, d, c) {
      var m, p, f, y;
      s._$instances = s._$instances || {};
      var v = b._getConfig(u, d), g = s._$instances[t] || {}, _ = Ae(g) ? O(O({}, n), n?.methods) : {};
      s._$instances[t] = O(O({}, g), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: s,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: g.$el || s || void 0,
        $style: O({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: v,
        $attrSelector: (m = s.$pd) === null || m === void 0 || (m = m[t]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return b._getPT(v?.pt, void 0, function(h) {
            var S;
            return h == null || (S = h.directives) === null || S === void 0 ? void 0 : S[t];
          });
        },
        isUnstyled: function() {
          var h, S;
          return ((h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (S = s._$instances[t]) === null || S === void 0 || (S = S.$binding) === null || S === void 0 || (S = S.value) === null || S === void 0 ? void 0 : S.unstyled : v?.unstyled;
        },
        theme: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return b._getPTValue(s._$instances[t], (h = s._$instances[t]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, S, O({}, E));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", E = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return b._getPTValue(s._$instances[t], h, S, E, !1);
        },
        cx: function() {
          var h, S, E = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", V = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = s._$instances[t]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : b._getOptionValue((S = s._$instances[t]) === null || S === void 0 || (S = S.$style) === null || S === void 0 ? void 0 : S.classes, E, O({}, V));
        },
        sx: function() {
          var h, S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", E = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, V = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return E ? b._getOptionValue((h = s._$instances[t]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, S, O({}, V)) : void 0;
        }
      }, _), s.$instance = s._$instances[t], (p = (f = s.$instance)[l]) === null || p === void 0 || p.call(f, s, u, d, c), s["$".concat(t)] = s.$instance, b._hook(t, l, s, u, d, c), s.$pd || (s.$pd = {}), s.$pd[t] = O(O({}, (y = s.$pd) === null || y === void 0 ? void 0 : y[t]), {}, {
        name: t,
        instance: s._$instances[t]
      });
    }, r = function(l) {
      var s, u, d, c = l._$instances[t], m = c?.watch, p = function(v) {
        var g, _ = v.newValue, P = v.oldValue;
        return m == null || (g = m.config) === null || g === void 0 ? void 0 : g.call(c, _, P);
      }, f = function(v) {
        var g, _ = v.newValue, P = v.oldValue;
        return m == null || (g = m["config.ripple"]) === null || g === void 0 ? void 0 : g.call(c, _, P);
      };
      c.$watchersCallback = {
        config: p,
        "config.ripple": f
      }, m == null || (s = m.config) === null || s === void 0 || s.call(c, c?.$primevueConfig), J.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(c, c == null || (d = c.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), J.on("config:ripple:change", f);
    }, o = function(l) {
      var s = l._$instances[t].$watchersCallback;
      s && (J.off("config:change", s.config), J.off("config:ripple:change", s["config.ripple"]), l._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(l, s, u, d) {
        l.$pd || (l.$pd = {}), l.$pd[t] = {
          name: t,
          attrSelector: Pr("pd")
        }, i("created", l, s, u, d);
      },
      beforeMount: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("beforeMount", l, s, u, d), r(l);
      },
      mounted: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("mounted", l, s, u, d);
      },
      beforeUpdate: function(l, s, u, d) {
        i("beforeUpdate", l, s, u, d);
      },
      updated: function(l, s, u, d) {
        var c;
        b._loadStyles((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance, s, u), i("updated", l, s, u, d);
      },
      beforeUnmount: function(l, s, u, d) {
        var c;
        o(l), b._removeThemeListeners((c = l.$pd[t]) === null || c === void 0 ? void 0 : c.instance), i("beforeUnmount", l, s, u, d);
      },
      unmounted: function(l, s, u, d) {
        var c;
        (c = l.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), i("unmounted", l, s, u, d);
      }
    };
  },
  extend: function() {
    var t = b._getMeta.apply(b, arguments), n = qt(t, 2), i = n[0], r = n[1];
    return O({
      extend: function() {
        var a = b._getMeta.apply(b, arguments), l = qt(a, 2), s = l[0], u = l[1];
        return b.extend(s, O(O(O({}, r), r?.methods), u));
      }
    }, b._extend(i, r));
  }
}, Lo = `
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
`, Eo = {
  root: "p-ink"
}, Ao = C.extend({
  name: "ripple-directive",
  style: Lo,
  classes: Eo
}), Io = b.extend({
  style: Ao
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function No(e) {
  return Mo(e) || Vo(e) || Ro(e) || jo();
}
function jo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ro(e, t) {
  if (e) {
    if (typeof e == "string") return ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ot(e, t) : void 0;
  }
}
function Vo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Mo(e) {
  if (Array.isArray(e)) return ot(e);
}
function ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function Jt(e, t, n) {
  return (t = Do(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Do(e) {
  var t = Ho(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function Ho(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Le(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Uo = Io.extend("ripple", {
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
      n || (n = gr("span", Jt(Jt({
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
      var n = this, i = t.currentTarget, r = this.getInk(i);
      if (!(!r || getComputedStyle(r, null).display === "none")) {
        if (!this.isUnstyled() && qe(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Et(r) && !At(r)) {
          var o = Math.max(Ue(i), Sr(i));
          r.style.height = o + "px", r.style.width = o + "px";
        }
        var a = _r(i), l = t.pageX - a.left + document.body.scrollTop - At(r) / 2, s = t.pageY - a.top + document.body.scrollLeft - Et(r) / 2;
        r.style.top = s + "px", r.style.left = l + "px", !this.isUnstyled() && ur(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && qe(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && qe(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? No(t.children).find(function(n) {
        return br(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Ee(e) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ee(e);
}
function Bo(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Wo(e, t) {
  for (var n = 0; n < t.length; n++) {
    var i = t[n];
    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, zo(i.key), i);
  }
}
function Fo(e, t, n) {
  return t && Wo(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function zo(e) {
  var t = Ko(e, "string");
  return Ee(t) == "symbol" ? t : t + "";
}
function Ko(e, t) {
  if (Ee(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(e, t);
    if (Ee(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Yo = /* @__PURE__ */ (function() {
  function e(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    Bo(this, e), this.element = t, this.listener = n;
  }
  return Fo(e, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = $r(this.element);
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
})(), Go = mt(), qo = `
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
`, Zo = {
  root: function(t) {
    var n = t.props;
    return ["p-menu p-component", {
      "p-menu-overlay": n.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(t) {
    var n = t.instance;
    return ["p-menu-item", {
      "p-focus": n.id === n.focusedOptionId,
      "p-disabled": n.disabled()
    }];
  },
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: "p-menu-item-icon",
  itemLabel: "p-menu-item-label"
}, Qo = C.extend({
  name: "menu",
  style: qo,
  classes: Zo
}), Jo = {
  name: "BaseMenu",
  extends: ht,
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
  style: Qo,
  provide: function() {
    return {
      $pcMenu: this,
      $parentInstance: this
    };
  }
}, Vn = {
  name: "Menuitem",
  hostName: "Menu",
  extends: ht,
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
    getItemProp: function(t, n) {
      return t && t.item ? j(t.item[n]) : void 0;
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
      var n = this.getItemProp(this.item, "command");
      n && n({
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
        action: L({
          class: this.cx("itemLink"),
          tabindex: "-1"
        }, this.getPTOptions("itemLink")),
        icon: L({
          class: [this.cx("itemIcon"), t.icon]
        }, this.getPTOptions("itemIcon")),
        label: L({
          class: this.cx("itemLabel")
        }, this.getPTOptions("itemLabel"))
      };
    }
  },
  computed: {
    dataP: function() {
      return pt({
        focus: this.isItemFocused(),
        disabled: this.disabled()
      });
    }
  },
  directives: {
    ripple: Uo
  }
}, Xo = ["id", "aria-label", "aria-disabled", "data-p-focused", "data-p-disabled", "data-p"], es = ["data-p"], ts = ["href", "target"], ns = ["data-p"], is = ["data-p"];
function rs(e, t, n, i, r, o) {
  var a = hi("ripple");
  return o.visible() ? (x(), N("li", L({
    key: 0,
    id: n.id,
    class: [e.cx("item"), n.item.class],
    role: "menuitem",
    style: n.item.style,
    "aria-label": o.label(),
    "aria-disabled": o.disabled(),
    "data-p-focused": o.isItemFocused(),
    "data-p-disabled": o.disabled() || !1,
    "data-p": o.dataP
  }, o.getPTOptions("item")), [Xe("div", L({
    class: e.cx("itemContent"),
    onClick: t[0] || (t[0] = function(l) {
      return o.onItemClick(l);
    }),
    onMousemove: t[1] || (t[1] = function(l) {
      return o.onItemMouseMove(l);
    }),
    "data-p": o.dataP
  }, o.getPTOptions("itemContent")), [n.templates.item ? n.templates.item ? (x(), ye(St(n.templates.item), {
    key: 1,
    item: n.item,
    label: o.label(),
    props: o.getMenuItemProps(n.item)
  }, null, 8, ["item", "label", "props"])) : U("", !0) : vi((x(), N("a", L({
    key: 0,
    href: n.item.url,
    class: e.cx("itemLink"),
    target: n.item.target,
    tabindex: "-1"
  }, o.getPTOptions("itemLink")), [n.templates.itemicon ? (x(), ye(St(n.templates.itemicon), {
    key: 0,
    item: n.item,
    class: yi(e.cx("itemIcon"))
  }, null, 8, ["item", "class"])) : n.item.icon ? (x(), N("span", L({
    key: 1,
    class: [e.cx("itemIcon"), n.item.icon],
    "data-p": o.dataP
  }, o.getPTOptions("itemIcon")), null, 16, ns)) : U("", !0), Xe("span", L({
    class: e.cx("itemLabel"),
    "data-p": o.dataP
  }, o.getPTOptions("itemLabel")), cn(o.label()), 17, is)], 16, ts)), [[a]])], 16, es)], 16, Xo)) : U("", !0);
}
Vn.render = rs;
function Xt(e) {
  return ls(e) || as(e) || ss(e) || os();
}
function os() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ss(e, t) {
  if (e) {
    if (typeof e == "string") return st(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? st(e, t) : void 0;
  }
}
function as(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ls(e) {
  if (Array.isArray(e)) return st(e);
}
function st(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
var Mn = {
  name: "Menu",
  extends: Jo,
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
    this.unbindResizeListener(), this.unbindOutsideClickListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.target = null, this.container && this.autoZIndex && Ze.clear(this.container), this.container = null;
  },
  methods: {
    itemClick: function(t) {
      var n = t.item;
      this.disabled(n) || (n.command && n.command(t), this.overlayVisible && this.hide(), !this.popup && this.focusedOptionIndex !== t.id && (this.focusedOptionIndex = t.id));
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
          this.popup && (je(this.target), this.hide());
        case "Tab":
          this.overlayVisible && this.hide();
          break;
      }
    },
    onArrowDownKey: function(t) {
      var n = this.findNextOptionIndex(this.focusedOptionIndex);
      this.changeFocusedOptionIndex(n), t.preventDefault();
    },
    onArrowUpKey: function(t) {
      if (t.altKey && this.popup)
        je(this.target), this.hide(), t.preventDefault();
      else {
        var n = this.findPrevOptionIndex(this.focusedOptionIndex);
        this.changeFocusedOptionIndex(n), t.preventDefault();
      }
    },
    onHomeKey: function(t) {
      this.changeFocusedOptionIndex(0), t.preventDefault();
    },
    onEndKey: function(t) {
      this.changeFocusedOptionIndex(_e(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1), t.preventDefault();
    },
    onEnterKey: function(t) {
      var n = We(this.list, 'li[id="'.concat("".concat(this.focusedOptionIndex), '"]')), i = n && We(n, 'a[data-pc-section="itemlink"]');
      this.popup && je(this.target), i ? i.click() : n && n.click(), t.preventDefault();
    },
    onSpaceKey: function(t) {
      this.onEnterKey(t);
    },
    findNextOptionIndex: function(t) {
      var n = _e(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = Xt(n).findIndex(function(r) {
        return r.id === t;
      });
      return i > -1 ? i + 1 : 0;
    },
    findPrevOptionIndex: function(t) {
      var n = _e(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = Xt(n).findIndex(function(r) {
        return r.id === t;
      });
      return i > -1 ? i - 1 : 0;
    },
    changeFocusedOptionIndex: function(t) {
      var n = _e(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), i = t >= n.length ? n.length - 1 : t < 0 ? 0 : t;
      i > -1 && (this.focusedOptionIndex = n[i].getAttribute("id"));
    },
    toggle: function(t, n) {
      this.overlayVisible ? this.hide() : this.show(t, n);
    },
    show: function(t, n) {
      this.overlayVisible = !0, this.target = n ?? t.currentTarget;
    },
    hide: function() {
      this.overlayVisible = !1, this.target = null;
    },
    onEnter: function(t) {
      vr(t, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.bindOutsideClickListener(), this.bindResizeListener(), this.bindScrollListener(), this.autoZIndex && Ze.set("menu", t, this.baseZIndex || this.$primevue.config.zIndex.menu), this.popup && je(this.list), this.$emit("show");
    },
    onLeave: function() {
      this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindScrollListener(), this.$emit("hide");
    },
    onAfterLeave: function(t) {
      this.autoZIndex && Ze.clear(t);
    },
    alignOverlay: function() {
      hr(this.container, this.target);
      var t = Ue(this.target);
      t > Ue(this.container) && (this.container.style.minWidth = Ue(this.target) + "px");
    },
    bindOutsideClickListener: function() {
      var t = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var i = t.container && !t.container.contains(n.target), r = !(t.target && (t.target === n.target || t.target.contains(n.target)));
        t.overlayVisible && i && r ? t.hide() : !t.popup && i && r && (t.focusedOptionIndex = -1);
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var t = this;
      this.scrollHandler || (this.scrollHandler = new Yo(this.target, function() {
        t.overlayVisible && t.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var t = this;
      this.resizeListener || (this.resizeListener = function() {
        t.overlayVisible && !Or() && t.hide();
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
      Go.emit("overlay-click", {
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
      return pt({
        popup: this.popup
      });
    }
  },
  components: {
    PVMenuitem: Vn,
    Portal: ft
  }
}, us = ["id", "data-p"], ds = ["id", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby"], cs = ["id"];
function ms(e, t, n, i, r, o) {
  var a = $t("PVMenuitem"), l = $t("Portal");
  return x(), ye(l, {
    appendTo: e.appendTo,
    disabled: !e.popup
  }, {
    default: Ot(function() {
      return [gi(bi, L({
        name: "p-anchored-overlay",
        onEnter: o.onEnter,
        onLeave: o.onLeave,
        onAfterLeave: o.onAfterLeave
      }, e.ptm("transition")), {
        default: Ot(function() {
          return [!e.popup || r.overlayVisible ? (x(), N("div", L({
            key: 0,
            ref: o.containerRef,
            id: e.$id,
            class: e.cx("root"),
            onClick: t[3] || (t[3] = function() {
              return o.onOverlayClick && o.onOverlayClick.apply(o, arguments);
            }),
            "data-p": o.dataP
          }, e.ptmi("root")), [e.$slots.start ? (x(), N("div", L({
            key: 0,
            class: e.cx("start")
          }, e.ptm("start")), [oe(e.$slots, "start")], 16)) : U("", !0), Xe("ul", L({
            ref: o.listRef,
            id: e.$id + "_list",
            class: e.cx("list"),
            role: "menu",
            tabindex: e.tabindex,
            "aria-activedescendant": r.focused ? o.focusedOptionId : void 0,
            "aria-label": e.ariaLabel,
            "aria-labelledby": e.ariaLabelledby,
            onFocus: t[0] || (t[0] = function() {
              return o.onListFocus && o.onListFocus.apply(o, arguments);
            }),
            onBlur: t[1] || (t[1] = function() {
              return o.onListBlur && o.onListBlur.apply(o, arguments);
            }),
            onKeydown: t[2] || (t[2] = function() {
              return o.onListKeyDown && o.onListKeyDown.apply(o, arguments);
            })
          }, e.ptm("list")), [(x(!0), N(ge, null, wt(e.model, function(s, u) {
            return x(), N(ge, {
              key: o.label(s) + u.toString()
            }, [s.items && o.visible(s) && !s.separator ? (x(), N(ge, {
              key: 0
            }, [s.items ? (x(), N("li", L({
              key: 0,
              id: e.$id + "_" + u,
              class: [e.cx("submenuLabel"), s.class],
              role: "none"
            }, {
              ref_for: !0
            }, e.ptm("submenuLabel")), [oe(e.$slots, e.$slots.submenulabel ? "submenulabel" : "submenuheader", {
              item: s
            }, function() {
              return [_i(cn(o.label(s)), 1)];
            })], 16, cs)) : U("", !0), (x(!0), N(ge, null, wt(s.items, function(d, c) {
              return x(), N(ge, {
                key: d.label + u + "_" + c
              }, [o.visible(d) && !d.separator ? (x(), ye(a, {
                key: 0,
                id: e.$id + "_" + u + "_" + c,
                item: d,
                templates: e.$slots,
                focusedOptionId: o.focusedOptionId,
                unstyled: e.unstyled,
                onItemClick: o.itemClick,
                onItemMousemove: o.itemMouseMove,
                pt: e.pt
              }, null, 8, ["id", "item", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"])) : o.visible(d) && d.separator ? (x(), N("li", L({
                key: "separator" + u + c,
                class: [e.cx("separator"), s.class],
                style: d.style,
                role: "separator"
              }, {
                ref_for: !0
              }, e.ptm("separator")), null, 16)) : U("", !0)], 64);
            }), 128))], 64)) : o.visible(s) && s.separator ? (x(), N("li", L({
              key: "separator" + u.toString(),
              class: [e.cx("separator"), s.class],
              style: s.style,
              role: "separator"
            }, {
              ref_for: !0
            }, e.ptm("separator")), null, 16)) : (x(), ye(a, {
              key: o.label(s) + u.toString(),
              id: e.$id + "_" + u,
              item: s,
              index: u,
              templates: e.$slots,
              focusedOptionId: o.focusedOptionId,
              unstyled: e.unstyled,
              onItemClick: o.itemClick,
              onItemMousemove: o.itemMouseMove,
              pt: e.pt
            }, null, 8, ["id", "item", "index", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"]))], 64);
          }), 128))], 16, ds), e.$slots.end ? (x(), N("div", L({
            key: 1,
            class: e.cx("end")
          }, e.ptm("end")), [oe(e.$slots, "end")], 16)) : U("", !0)], 16, us)) : U("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo", "disabled"]);
}
Mn.render = ms;
const ps = "data-wippy-overlay-layer";
function Dn() {
  return typeof window < "u" && typeof window.document < "u";
}
function Hn() {
  return Dn() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function fs() {
  return Hn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const hs = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let vs = 0;
const ze = /* @__PURE__ */ new WeakMap();
function en(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function ys(e, t) {
  if (!hs.test(e.className))
    return;
  const n = e.style.cssText;
  en(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!ze.has(e)) {
    const i = new MutationObserver(() => {
      const r = e.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && en(e, t);
    });
    i.observe(e, { attributes: !0, attributeFilter: ["style"] }), ze.set(e, i);
  }
}
function vt(e) {
  const t = ze.get(e);
  t && (t.disconnect(), ze.delete(e));
}
function gs(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function at(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Ke = /* @__PURE__ */ new Set(), yt = /* @__PURE__ */ new WeakMap();
let tn = !1, lt = !1;
const nn = ["w-theme-dark", "w-theme-light"], He = "data-wippy-theme-root", ut = /* @__PURE__ */ new WeakMap();
function bs(e) {
  const t = [];
  let n = e ? e.parentNode : null;
  for (; n && n.nodeType === 1; )
    t.push(n), n = n.parentNode;
  return t;
}
function _s(e, t, n) {
  const i = [...bs(t), n.host], r = () => {
    let a;
    for (const l of i) {
      if (nn.some((s) => l.classList.contains(s))) {
        a = l;
        break;
      }
      if (l.hasAttribute(He))
        break;
    }
    for (const l of nn)
      e.classList.toggle(l, !!(a && a.classList.contains(l)));
    a ? e.setAttribute(He, "") : e.removeAttribute(He);
  };
  r();
  const o = new MutationObserver(r);
  for (const a of i)
    o.observe(a, { attributes: !0, attributeFilter: ["class", He] });
  ut.set(e, o);
}
function Un(e) {
  ut.get(e)?.disconnect(), ut.delete(e);
}
function Ss() {
  lt = !1;
  for (const e of Ke) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && vt(t);
      Ke.delete(e), yt.get(e)?.disconnect(), Un(e);
      continue;
    }
    e.childElementCount > 0 && at(e);
  }
}
function rn() {
  lt || (lt = !0, requestAnimationFrame(Ss));
}
function $s(e) {
  const t = document.createElement("div");
  t.setAttribute(ps, "");
  const n = Hn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  at(t);
  const i = new MutationObserver((r) => {
    const o = t.__wippyAnchorName;
    for (const a of r) {
      if (o)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && ys(l, o);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && vt(l);
    }
    t.isConnected && t.childElementCount > 0 && at(t);
  });
  return i.observe(t, { childList: !0 }), yt.set(t, i), Ke.add(t), tn || (tn = !0, window.addEventListener("scroll", rn, { capture: !0, passive: !0 }), window.addEventListener("resize", rn, { passive: !0 })), t;
}
function on(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = $s(e.hostRoot), _s(e.layer, e.$el, e.hostRoot), fs())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++vs}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function sn(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && vt(t);
    Ke.delete(e.layer), yt.get(e.layer)?.disconnect(), Un(e.layer), e.layer.remove(), e.layer = null;
  }
}
let an = !1;
function Os() {
  if (an)
    return;
  const e = Mn;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const n = t.composedPath(), i = this.container && !n.includes(this.container), r = !(this.target && n.includes(this.target));
      this.overlayVisible && i && r ? this.hide() : !this.popup && i && r && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, an = !0);
}
let ln = !1;
function ws() {
  if (ln)
    return;
  ln = !0;
  const e = ft;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Dn() && (this.hostRoot = gs(this.$el), this.mounted = !0, this.hostRoot && (this.inline || on(this), this.$watch("inline", (t) => {
      t ? sn(this) : on(this);
    })));
  }, e.render = function() {
    return this.inline ? oe(this.$slots, "default", { key: 0 }) : this.mounted ? Si(dn, { key: 1, to: this.resolvedTarget || document.body }, [
      oe(this.$slots, "default")
    ]) : U("", !0);
  }, e.unmounted = function() {
    sn(this);
  };
}
const Rs = {
  install: (e) => {
    Os(), ws(), e.use(lo, { theme: "none" });
  }
};
export {
  C as B,
  Ns as I,
  Is as L,
  Rs as P,
  Uo as R,
  gr as U,
  Es as W,
  xs as a,
  Ls as b,
  T as c,
  je as d,
  b as e,
  pt as f,
  Mn as g,
  js as h,
  Ae as l,
  ht as s,
  ks as u,
  As as v
};
