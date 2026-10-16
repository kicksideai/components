import { hasInjectionContext as U, inject as P, effectScope as j, ref as f, markRaw as B, onMounted as W, onUnmounted as F, watch as K, createApp as M, defineComponent as Y, openBlock as v, createElementBlock as m, createElementVNode as u, createVNode as y, unref as x, toDisplayString as _, createCommentVNode as k, createTextVNode as J, Fragment as q, renderList as G, normalizeClass as Q } from "vue";
import { addCollection as X, Icon as w } from "@iconify/vue";
import { config as R, addIcons as Z, on as rr, applyThemeMode as C, host as er, hostCss as or, loadCss as tr, api as ar, define as ir } from "@wippy-fe/proxy";
var V = "data-wippy-visible";
function I(r) {
  const e = r.getAttribute(V);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var sr = Object.defineProperty, nr = (r, e, o) => e in r ? sr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[e] = o, l = (r, e, o) => nr(r, typeof e != "symbol" ? e + "" : e, o), pr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], cr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function A(r) {
  const e = r.startsWith("--") ? r : `--${r}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function lr(...r) {
  const e = /* @__PURE__ */ new Set();
  for (const o of r)
    if (o)
      for (const [t, a] of Object.entries(o)) {
        if ((t === "@light" || t === "@dark") && a && typeof a == "object") {
          for (const [c, i] of Object.entries(a)) {
            const p = typeof i == "string" ? A(c) : null;
            p && e.add(p);
          }
          continue;
        }
        const s = typeof a == "string" ? A(t) : null;
        s && e.add(s);
      }
  return [...e].sort();
}
function hr(r) {
  if (r.length === 0)
    return "";
  const e = r.map((o) => `  ${o}: inherit;`).join(`
`);
  return `${cr} {
${e}
}`;
}
function dr(r, e) {
  const o = hr(e);
  o && O(r, o, "@wippy-fe/css-variables-bridge");
}
function ur(r, e) {
  const t = (e ?? pr).map(async (a) => {
    const s = or[a];
    if (!s)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${a}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await tr(s);
    } catch (c) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${a}" (${s}):`, c), null;
    }
  });
  return Promise.all(t).then((a) => {
    for (const s of a) {
      if (!s)
        continue;
      const c = document.createElement("style");
      c.textContent = s, c.setAttribute("role", "@wippy-fe/host-css"), r.appendChild(c);
    }
  });
}
function vr(r, e) {
  const o = document.createElement("style");
  o.textContent = e, r.appendChild(o);
}
function O(r, e, o) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const a = new CSSStyleSheet();
    a.replaceSync(e), r.adoptedStyleSheets = [...r.adoptedStyleSheets, a];
    return;
  }
  const t = document.createElement("style");
  t.setAttribute("role", o), t.textContent = e, r.appendChild(t);
}
function mr(r, e) {
  O(r, e, "@wippy-fe/custom-css");
}
function L(r) {
  return r.__wippyHost ?? null;
}
function fr(r) {
  return r.replace(/-([a-z])/g, (e, o) => o.toUpperCase());
}
function gr(r, e, o) {
  switch (o.type) {
    case "string":
      return { value: e };
    case "number": {
      const t = Number.parseFloat(e);
      return Number.isNaN(t) ? { value: void 0, error: `Invalid ${r}: expected a number` } : { value: t };
    }
    case "integer": {
      const t = Number.parseInt(e, 10);
      return Number.isNaN(t) ? { value: void 0, error: `Invalid ${r}: expected an integer` } : { value: t };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const t = JSON.parse(e);
        return o.type === "array" && !Array.isArray(t) ? { value: void 0, error: `Invalid ${r}: expected a JSON array` } : { value: t };
      } catch {
        return { value: void 0, error: `Invalid ${r}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function S(r, e) {
  const o = {}, t = [];
  for (const [a, s] of Object.entries(e.properties)) {
    const c = r.getAttribute(a), i = fr(a);
    if (c === null) {
      s.default !== void 0 && (o[i] = s.default);
      continue;
    }
    const p = gr(a, c, s);
    p.error ? t.push(p.error) : o[i] = p.value;
  }
  return { props: o, errors: t };
}
var br = class {
  constructor(r, e) {
    l(this, "_props"), l(this, "_errors"), l(this, "_content"), l(this, "_hostVisibility"), l(this, "_propsListeners", /* @__PURE__ */ new Set()), l(this, "_contentListeners", /* @__PURE__ */ new Set()), l(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), l(this, "_disposed", !1), l(this, "_emitToDom"), l(this, "props"), l(this, "events"), l(this, "content"), l(this, "hostVisibility"), this._props = r.props, this._errors = r.errors, this._content = r.content, this._hostVisibility = r.hostVisibility, this._emitToDom = e;
    const o = this;
    this.props = {
      get value() {
        return o._props;
      },
      get errors() {
        return o._errors;
      },
      subscribe(t, a) {
        return o._subscribeProps(t, a);
      }
    }, this.events = {
      emit(t, a) {
        o._disposed || o._emitToDom(t, a);
      }
    }, this.content = r.hasContent ? {
      get value() {
        return o._content;
      },
      subscribe(t, a) {
        return o._subscribeContent(t, a);
      }
    } : null, this.hostVisibility = {
      get value() {
        return o._hostVisibility;
      },
      subscribe(t, a) {
        return o._subscribeHostVisibility(t, a);
      }
    };
  }
  /** @internal */
  notifyProps(r, e) {
    if (!this._disposed) {
      this._props = r, this._errors = e;
      for (const o of this._propsListeners)
        o(r, e);
    }
  }
  /** @internal */
  notifyContent(r) {
    if (!this._disposed) {
      this._content = r;
      for (const e of this._contentListeners)
        e(r);
    }
  }
  /** @internal */
  notifyHostVisibility(r, e) {
    if (!(this._disposed || r === e)) {
      this._hostVisibility = r;
      for (const o of this._hostVisibilityListeners)
        o(r, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(r), e?.immediate && r(this._props, this._errors);
    const o = () => {
      this._propsListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
  _subscribeContent(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(r), e?.immediate && r(this._content);
    const o = () => {
      this._contentListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
  _subscribeHostVisibility(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(r), e?.immediate && r(this._hostVisibility, this._hostVisibility);
    const o = () => {
      this._hostVisibilityListeners.delete(r), e?.signal?.removeEventListener("abort", o);
    };
    return e?.signal?.addEventListener("abort", o, { once: !0 }), o;
  }
}, yr = class extends HTMLElement {
  constructor() {
    super(), l(this, "_internals"), l(this, "_contentObserver", null), l(this, "_initialized", !1), l(this, "_container", null), l(this, "_reactive", null), l(this, "_lastProps", null), l(this, "_lastErrors", []), l(this, "_lastContent", null), l(this, "_themeUnsub", null), l(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = I(this);
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
    const r = this.wippyConfig, e = Object.keys(r.propsSchema.properties), o = r.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...o, V])];
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
    return L(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(r, e) {
    this.dispatchEvent(new CustomEvent(r, {
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
      const r = this.constructor.wippyConfig, e = !!r.contentTemplate;
      let o, t;
      if (this._lastProps !== null)
        o = this._lastProps, t = this._lastErrors;
      else {
        const s = S(this, r.propsSchema);
        r.validateProps && s.errors.push(...r.validateProps(s.props)), o = s.props, t = s.errors, this._lastProps = o, this._lastErrors = t;
      }
      const a = e ? this._lastContent ?? this._extractContent(r.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = a), this._reactive = new br(
        { props: o, errors: t, content: a, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const r = this.constructor.wippyConfig, e = this._initialized, o = this.shadowRoot ?? this.attachShadow({ mode: r.shadowMode ?? "open" });
      let t;
      if (e)
        t = this._container;
      else {
        this.onInit(o), r.inlineCss && vr(o, r.inlineCss);
        try {
          const n = R?.theming, d = lr(
            n?.global?.cssVariables,
            n?.children?.cssVariables
          );
          dr(o, d);
        } catch {
        }
        if (r.customCss !== !1)
          try {
            const n = R?.theming, d = [n?.global?.customCSS, n?.children?.customCSS].filter(Boolean).join(`
`);
            d && mr(o, d);
          } catch {
          }
        (r.hostCssKeys === void 0 || r.hostCssKeys.length > 0) && ur(o, r.hostCssKeys), t = document.createElement("div"), t.setAttribute("data-wippy-theme-root", "");
        const p = r.containerClasses ?? [];
        p.length > 0 && t.classList.add(...p), o.appendChild(t), this._container = t, Z(X);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = rr("@theme", (p) => this._applyTheme(p)));
      const { props: a, errors: s } = S(this, r.propsSchema);
      r.validateProps && s.push(...r.validateProps(a));
      const c = a;
      this._lastProps = c, this._lastErrors = s;
      let i = null;
      r.contentTemplate && (i = this._extractContent(r.contentTemplate), this._lastContent = i, this._contentObserver = new MutationObserver(() => {
        const p = this._extractContent(r.contentTemplate);
        this._lastContent = p, this._reactive?.notifyContent(p), this.onContentChanged(p);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(o, t, c, s, i, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (r) {
      this.onError(r), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: r instanceof Error ? r.message : String(r),
        error: r
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
  _applyTheme(r = er.getThemeMode?.()) {
    C(r, this), this._container && C(r, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), C("auto", this), this._container && C("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(r, e, o) {
    if (e === o)
      return;
    if (r === V) {
      const i = this._hostVisible, p = I(this);
      if (p === i)
        return;
      this._hostVisible = p, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(p, i), this.onHostVisibilityChanged(p, i));
      return;
    }
    const t = this.constructor.wippyConfig, { props: a, errors: s } = S(this, t.propsSchema);
    t.validateProps && s.push(...t.validateProps(a));
    const c = a;
    this._lastProps = c, this._lastErrors = s, this._reactive?.notifyProps(c, s), this.onPropsChanged(c, s);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(r) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(r) {
    console.error(`${this.constructor.name} initialization failed:`, r);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(r, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(r, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(r) {
    return this.querySelector(`template[data-type="${r}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(r) {
  }
};
function xr(r) {
  return r.__wippyHostBus ?? null;
}
function _r(r) {
  return r.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let T;
const N = (r) => T = r, wr = () => U() && P(z) || T, z = (
  /* istanbul ignore next */
  Symbol()
);
function kr() {
  const r = j(!0), e = r.run(() => f({}));
  let o = [], t = [];
  const a = B({
    install(s) {
      N(a), a._a = s, s.provide(z, a), s.config.globalProperties.$pinia = a, t.forEach((c) => o.push(c)), t = [];
    },
    use(s) {
      return this._a ? o.push(s) : t.push(s), this;
    },
    _p: o,
    _a: null,
    _e: r,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return a;
}
var Cr = Object.defineProperty, Er = (r, e, o) => e in r ? Cr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[e] = o, b = (r, e, o) => Er(r, typeof e != "symbol" ? e + "" : e, o), $ = /* @__PURE__ */ Symbol("wippy:emit"), Sr = /* @__PURE__ */ Symbol("wippy:props"), Vr = /* @__PURE__ */ Symbol("wippy:props_error"), Pr = /* @__PURE__ */ Symbol("wippy:content"), Rr = /* @__PURE__ */ Symbol("wippy:panel-id"), Ir = /* @__PURE__ */ Symbol("wippy:layout-bus"), Ar = /* @__PURE__ */ Symbol("wippy:host"), H = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Or() {
  const r = P($);
  if (!r)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return r;
}
function Lr() {
  const r = P(H);
  if (!r)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return r;
}
function Tr(r) {
  const e = Lr();
  let o = !1, t = null, a = !1;
  function s() {
    if (t)
      return a = !0, t;
    let c;
    try {
      c = Promise.resolve(r());
    } catch (p) {
      c = Promise.reject(p);
    }
    const i = c.finally(() => {
      if (t === i && (t = null, o && a))
        return a = !1, s();
    });
    return t = i, i;
  }
  return W(() => (o = !0, s())), F(() => {
    o = !1, a = !1;
  }), K(e, (c, i) => {
    if (o && i === !1 && c === !0)
      return s();
  }), e;
}
var Nr = class extends yr {
  constructor() {
    super(...arguments), b(this, "_vueApp", null), b(this, "_propsRef", f({})), b(this, "_errorsRef", f([])), b(this, "_contentRef", f(null)), b(this, "_hostVisibilityRef", f(null)), b(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(r, e, o, t, a, s) {
    const c = this.constructor.vueConfig;
    this._propsRef.value = o, this._errorsRef.value = t, this._contentRef.value = a ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const n of t)
      this.emitEvent("invalid", { message: n });
    const i = new AbortController();
    this._bridgeAbort = i, this.reactive.props.subscribe((n, d) => {
      this._propsRef.value = n, this._errorsRef.value = [...d];
      for (const h of d)
        this.emitEvent("invalid", { message: h });
    }, { signal: i.signal }), this.reactive.content && this.reactive.content.subscribe((n) => {
      this._contentRef.value = n;
    }, { signal: i.signal }), this.reactive.hostVisibility.subscribe((n) => {
      this._hostVisibilityRef.value = n;
    }, { signal: i.signal });
    const p = (n) => {
      if (i.signal.aborted)
        return;
      const d = wr(), h = M(n.rootComponent);
      this._vueApp = h;
      const g = kr();
      if (n.piniaPlugins)
        for (const E of n.piniaPlugins)
          g.use(E);
      if (h.use(g), n.plugins)
        for (const E of n.plugins)
          h.use(E);
      h.provide(Sr, this._propsRef), h.provide(Vr, this._errorsRef), h.provide($, this.emitEvent.bind(this)), h.provide(Pr, this._contentRef), h.provide(H, this._hostVisibilityRef), h.provide(Rr, _r(this)), h.provide(Ir, xr(this)), h.provide(Ar, L(this)), n.providers && n.providers(h, this), h.mount(e), d && N(d);
    };
    if (c.rootComponent)
      p(c);
    else if (c.lazyConfig) {
      const n = document.createElement("wippy-loading");
      n.setAttribute("no-bg", ""), e.appendChild(n), c.lazyConfig().then((d) => {
        i.signal.aborted || (n.remove(), p(d));
      }).catch((d) => {
        if (i.signal.aborted)
          return;
        const h = d instanceof Error ? d.message : String(d), g = document.createElement("wippy-error");
        g.setAttribute("title", "Failed to load"), g.setAttribute("message", h), n.replaceWith(g), this.emitEvent("error", { message: h });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const zr = () => Or(), $r = { class: "kx" }, Hr = { class: "kx-hero" }, Dr = { class: "kx-hero-inner" }, Ur = { class: "kx-hero-mark" }, jr = {
  key: 0,
  class: "kx-hero-chip"
}, Br = {
  key: 0,
  class: "kx-err"
}, Wr = { class: "kx-body" }, Fr = {
  key: 0,
  class: "kx-loading"
}, Kr = {
  key: 1,
  class: "kx-empty"
}, Mr = {
  key: 2,
  class: "kx-grid"
}, Yr = ["disabled", "aria-label", "onClick"], Jr = { class: "kx-card-icon" }, qr = { class: "kx-card-name" }, Gr = {
  key: 0,
  class: "kx-card-desc"
}, Qr = {
  key: 1,
  class: "kx-card-go"
}, Xr = /* @__PURE__ */ Y({
  __name: "dashboard",
  setup(r) {
    const e = zr(), o = f([]), t = f(!1), a = f("");
    async function s() {
      t.value = !0, a.value = "";
      try {
        const { data: i } = await ar.get("/api/v1/dashboard/overview");
        o.value = i.success ? i.surfaces || [] : [], !i.success && i.error && (a.value = i.error);
      } catch (i) {
        o.value = [], a.value = i instanceof Error ? i.message : "failed to load overview";
      } finally {
        t.value = !1;
      }
    }
    function c(i) {
      i.route_name && e("navigate", { path: `/${i.route_name}`, route_name: i.route_name, component_tag: i.component_tag, id: i.id });
    }
    return Tr(s), (i, p) => (v(), m("div", $r, [
      u("header", Hr, [
        u("div", Dr, [
          u("div", Ur, [
            y(x(w), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            })
          ]),
          p[0] || (p[0] = u("div", { class: "kx-hero-text" }, [
            u("h1", { class: "kx-hero-title" }, "Welcome to KickSide"),
            u("p", { class: "kx-hero-sub" }, "Everything installed in this workspace, ready to use.")
          ], -1)),
          o.value.length ? (v(), m("span", jr, _(o.value.length) + " surface" + _(o.value.length === 1 ? "" : "s"), 1)) : k("", !0)
        ])
      ]),
      a.value ? (v(), m("div", Br, _(a.value), 1)) : k("", !0),
      u("div", Wr, [
        t.value && !o.value.length ? (v(), m("div", Fr, [
          y(x(w), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          p[1] || (p[1] = J(" Loading… ", -1))
        ])) : o.value.length ? (v(), m("div", Mr, [
          (v(!0), m(q, null, G(o.value, (n) => (v(), m("button", {
            key: n.id,
            class: Q(["kx-card", { "kx-card-static": !n.route_name }]),
            disabled: !n.route_name,
            "aria-label": n.route_name ? `Open ${n.label}` : n.label,
            onClick: (d) => c(n)
          }, [
            u("span", Jr, [
              y(x(w), {
                icon: n.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ]),
            u("span", qr, _(n.label), 1),
            n.description ? (v(), m("span", Gr, _(n.description), 1)) : k("", !0),
            n.route_name ? (v(), m("span", Qr, [
              y(x(w), {
                icon: "tabler:arrow-right",
                "aria-hidden": "true"
              })
            ])) : k("", !0)
          ], 10, Yr))), 128))
        ])) : (v(), m("div", Kr, [
          y(x(w), {
            icon: "tabler:layout-dashboard",
            class: "kx-empty-ico",
            "aria-hidden": "true"
          }),
          p[2] || (p[2] = u("div", { class: "kx-empty-title" }, "Nothing installed yet", -1)),
          p[3] || (p[3] = u("div", { class: "kx-empty-sub" }, "Install a feature module that declares a surface and it appears here.", -1))
        ]))
      ])
    ]));
  }
}), Zr = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.kx{font-family:inherit;color:var(--p-text-color);background:var(--p-content-background);height:100%;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}.kx-hero{position:relative;overflow:hidden;padding:30px 28px 28px;border-bottom:1px solid var(--p-content-border-color);background:radial-gradient(820px 240px at 0% -60%,color-mix(in srgb,var(--p-primary-color) 20%,transparent),transparent 70%),radial-gradient(620px 200px at 100% -80%,color-mix(in srgb,var(--p-primary-color) 12%,transparent),transparent 70%),var(--p-content-background)}.kx-hero-inner{display:flex;align-items:center;gap:16px;width:100%}.kx-hero-mark{width:54px;height:54px;border-radius:14px;flex:none;display:flex;align-items:center;justify-content:center;color:#fff;background:linear-gradient(135deg,color-mix(in srgb,var(--p-primary-color) 88%,#fff),color-mix(in srgb,var(--p-primary-color) 70%,#000));box-shadow:0 10px 24px color-mix(in srgb,var(--p-primary-color) 38%,transparent)}.kx-hero-mark svg{width:28px;height:28px}.kx-hero-text{min-width:0;flex:1}.kx-hero-title{font-size:23px;font-weight:800;letter-spacing:-.02em;margin:0;color:var(--p-text-color)}.kx-hero-sub{font-size:13.5px;color:var(--p-text-muted-color);margin:4px 0 0}.kx-hero-chip{flex:none;align-self:flex-start;font-size:12px;font-weight:600;padding:5px 11px;border-radius:6px;color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 26%,transparent)}.kx-err{margin:16px 24px 0;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-body{flex:1;min-height:0;padding:22px 28px 28px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-empty{text-align:center;padding:56px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:40px;height:40px;color:var(--p-text-muted-color);opacity:.6}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color)}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:360px}.kx-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))}.kx-card{position:relative;overflow:hidden;text-align:left;font:inherit;cursor:pointer;display:grid;grid-template-columns:46px 1fr;grid-template-rows:auto 1fr;column-gap:14px;row-gap:6px;align-items:start;padding:18px 18px 20px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);color:var(--p-text-color);transition:border-color .18s,box-shadow .18s,transform .18s}.kx-card:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(440px 150px at 100% 0%,color-mix(in srgb,var(--p-primary-color) 12%,transparent),transparent 60%);opacity:0;transition:opacity .18s}.kx-card>*{position:relative}.kx-card:hover:not(:disabled){border-color:color-mix(in srgb,var(--p-primary-color) 45%,var(--p-content-border-color));box-shadow:0 12px 30px color-mix(in srgb,var(--p-text-color) 10%,transparent);transform:translateY(-2px)}.kx-card:hover:not(:disabled):before{opacity:1}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-card-static{cursor:default}.kx-card-icon{grid-row:1 / span 2;width:46px;height:46px;border-radius:11px;display:flex;align-items:center;justify-content:center;color:var(--p-primary-color);background:linear-gradient(135deg,color-mix(in srgb,var(--p-primary-color) 18%,transparent),color-mix(in srgb,var(--p-primary-color) 8%,transparent));border:1px solid color-mix(in srgb,var(--p-primary-color) 18%,transparent);transition:transform .18s}.kx-card:hover:not(:disabled) .kx-card-icon{transform:scale(1.06)}.kx-card-icon svg{width:23px;height:23px}.kx-card-name{grid-column:2;align-self:center;font-size:15.5px;font-weight:700;color:var(--p-text-color);padding-right:22px;letter-spacing:-.01em}.kx-card-desc{grid-column:2;font-size:12.5px;line-height:1.5;color:var(--p-text-muted-color)}.kx-card-go{position:absolute;top:18px;right:16px;color:var(--p-text-muted-color);opacity:0;transition:opacity .18s,transform .18s,color .18s}.kx-card-go svg{width:17px;height:17px}.kx-card:hover:not(:disabled) .kx-card-go{opacity:1;transform:translate(3px);color:var(--p-primary-color)}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(max-width:640px){.kx-hero{padding:22px 18px 20px}.kx-hero-inner{flex-wrap:wrap;gap:12px}.kx-hero-mark{width:46px;height:46px;border-radius:14px}.kx-hero-mark svg{width:24px;height:24px}.kx-hero-title{font-size:20px}.kx-body{padding:18px 18px 22px}}', re = { props: { type: "object", properties: {} } }, ee = {
  wippy: re
};
class D extends Nr {
  static get wippyConfig() {
    return {
      propsSchema: ee.wippy.props,
      hostCssKeys: ["themeConfigUrl"],
      inlineCss: Zr
    };
  }
  static get vueConfig() {
    return { rootComponent: Xr };
  }
}
async function ie() {
  return D;
}
ir(import.meta.url, D);
export {
  ie as webComponent
};
//# sourceMappingURL=index.js.map
