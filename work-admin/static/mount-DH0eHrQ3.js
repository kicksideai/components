import { ref as C, createApp as ur, inject as j, onMounted as mr, onUnmounted as fr, watch as gr, renderSlot as D, createCommentVNode as wr, h as xr, Teleport as br } from "vue";
import { addCollection as vr } from "@iconify/vue";
import { config as W, addIcons as kr, on as yr, applyThemeMode as z, host as _r, hostCss as Cr, loadCss as zr, loadByTagName as Sr } from "@wippy-fe/proxy";
import { getActivePinia as Er, createPinia as Pr, setActivePinia as Lr } from "pinia";
import Tr from "primevue/config";
import Ar from "primevue/contextmenu";
import Vr from "primevue/menu";
import Rr from "primevue/portal";
var O = "data-wippy-visible";
function F(r) {
  const e = r.getAttribute(O);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Or = Object.defineProperty, or = (r) => {
  throw TypeError(r);
}, Mr = (r, e, t) => e in r ? Or(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, d = (r, e, t) => Mr(r, typeof e != "symbol" ? e + "" : e, t), ir = (r, e, t) => e.has(r) || or("Cannot " + t), Ir = (r, e, t) => (ir(r, e, "read from private field"), t ? t.call(r) : e.get(r)), Nr = (r, e, t) => e.has(r) ? or("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), jr = (r, e, t, o) => (ir(r, e, "write to private field"), e.set(r, t), t), Hr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], $r = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function B(r) {
  const e = r.startsWith("--") ? r : `--${r}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Ur(...r) {
  const e = /* @__PURE__ */ new Set();
  for (const t of r)
    if (t)
      for (const [o, i] of Object.entries(t)) {
        if ((o === "@light" || o === "@dark") && i && typeof i == "object") {
          for (const [s, n] of Object.entries(i)) {
            const c = typeof n == "string" ? B(s) : null;
            c && e.add(c);
          }
          continue;
        }
        const a = typeof i == "string" ? B(o) : null;
        a && e.add(a);
      }
  return [...e].sort();
}
function Dr(r) {
  if (r.length === 0)
    return "";
  const e = r.map((t) => `  ${t}: inherit;`).join(`
`);
  return `${$r} {
${e}
}`;
}
function Wr(r, e) {
  const t = Dr(e);
  t && nr(r, t, "@wippy-fe/css-variables-bridge");
}
function Fr(r, e) {
  const o = (e ?? Hr).map(async (i) => {
    const a = Cr[i];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${i}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await zr(a);
    } catch (s) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${i}" (${a}):`, s), null;
    }
  });
  return Promise.all(o).then((i) => {
    for (const a of i) {
      if (!a)
        continue;
      const s = document.createElement("style");
      s.textContent = a, s.setAttribute("role", "@wippy-fe/host-css"), r.appendChild(s);
    }
  });
}
function Br(r, e) {
  const t = document.createElement("style");
  t.textContent = e, r.appendChild(t);
}
function nr(r, e, t) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const i = new CSSStyleSheet();
    i.replaceSync(e), r.adoptedStyleSheets = [...r.adoptedStyleSheets, i];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", t), o.textContent = e, r.appendChild(o);
}
function Kr(r, e) {
  nr(r, e, "@wippy-fe/custom-css");
}
function ar(r) {
  return r.__wippyHost ?? null;
}
function Yr(r) {
  return r.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function qr(r, e, t) {
  switch (t.type) {
    case "string":
      return { value: e };
    case "number": {
      const o = Number.parseFloat(e);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${r}: expected a number` } : { value: o };
    }
    case "integer": {
      const o = Number.parseInt(e, 10);
      return Number.isNaN(o) ? { value: void 0, error: `Invalid ${r}: expected an integer` } : { value: o };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const o = JSON.parse(e);
        return t.type === "array" && !Array.isArray(o) ? { value: void 0, error: `Invalid ${r}: expected a JSON array` } : { value: o };
      } catch {
        return { value: void 0, error: `Invalid ${r}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function V(r, e) {
  const t = {}, o = [];
  for (const [i, a] of Object.entries(e.properties)) {
    const s = r.getAttribute(i), n = Yr(i);
    if (s === null) {
      a.default !== void 0 && (t[n] = a.default);
      continue;
    }
    const c = qr(i, s, a);
    c.error ? o.push(c.error) : t[n] = c.value;
  }
  return { props: t, errors: o };
}
var Jr = class {
  constructor(r, e) {
    d(this, "_props"), d(this, "_errors"), d(this, "_content"), d(this, "_hostVisibility"), d(this, "_propsListeners", /* @__PURE__ */ new Set()), d(this, "_contentListeners", /* @__PURE__ */ new Set()), d(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), d(this, "_disposed", !1), d(this, "_emitToDom"), d(this, "props"), d(this, "events"), d(this, "content"), d(this, "hostVisibility"), this._props = r.props, this._errors = r.errors, this._content = r.content, this._hostVisibility = r.hostVisibility, this._emitToDom = e;
    const t = this;
    this.props = {
      get value() {
        return t._props;
      },
      get errors() {
        return t._errors;
      },
      subscribe(o, i) {
        return t._subscribeProps(o, i);
      }
    }, this.events = {
      emit(o, i) {
        t._disposed || t._emitToDom(o, i);
      }
    }, this.content = r.hasContent ? {
      get value() {
        return t._content;
      },
      subscribe(o, i) {
        return t._subscribeContent(o, i);
      }
    } : null, this.hostVisibility = {
      get value() {
        return t._hostVisibility;
      },
      subscribe(o, i) {
        return t._subscribeHostVisibility(o, i);
      }
    };
  }
  /** @internal */
  notifyProps(r, e) {
    if (!this._disposed) {
      this._props = r, this._errors = e;
      for (const t of this._propsListeners)
        t(r, e);
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
      for (const t of this._hostVisibilityListeners)
        t(r, e);
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
    const t = () => {
      this._propsListeners.delete(r), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
  _subscribeContent(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(r), e?.immediate && r(this._content);
    const t = () => {
      this._contentListeners.delete(r), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
  _subscribeHostVisibility(r, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(r), e?.immediate && r(this._hostVisibility, this._hostVisibility);
    const t = () => {
      this._hostVisibilityListeners.delete(r), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
}, P, Gr = class extends HTMLElement {
  constructor() {
    super(), d(this, "_internals"), d(this, "_contentObserver", null), d(this, "_initialized", !1), d(this, "_container", null), Nr(this, P, null), d(this, "_attachment", 0), d(this, "_reactive", null), d(this, "_lastProps", null), d(this, "_lastErrors", []), d(this, "_lastContent", null), d(this, "_themeUnsub", null), d(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = F(this);
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
    const r = this.wippyConfig, e = Object.keys(r.propsSchema.properties), t = r.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...t, O])];
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
    return ar(this);
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
      let t, o;
      if (this._lastProps !== null)
        t = this._lastProps, o = this._lastErrors;
      else {
        const a = V(this, r.propsSchema);
        r.validateProps && a.errors.push(...r.validateProps(a.props)), t = a.props, o = a.errors, this._lastProps = t, this._lastErrors = o;
      }
      const i = e ? this._lastContent ?? this._extractContent(r.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = i), this._reactive = new Jr(
        { props: t, errors: o, content: i, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const r = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, o = Ir(this, P) ?? jr(this, P, this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" }));
      let i;
      if (this._container)
        i = this._container;
      else {
        if (this.onInit(o), r !== this._attachment)
          return;
        e.inlineCss && Br(o, e.inlineCss);
        try {
          const f = W?.theming, p = Ur(
            f?.global?.cssVariables,
            f?.children?.cssVariables
          );
          Wr(o, p);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const f = W?.theming, p = [f?.global?.customCSS, f?.children?.customCSS].filter(Boolean).join(`
`);
            p && Kr(o, p);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Fr(o, e.hostCssKeys), i = document.createElement("div"), i.setAttribute("data-wippy-theme-root", "");
        const h = e.containerClasses ?? [];
        h.length > 0 && i.classList.add(...h), o.appendChild(i), this._container = i, kr(vr);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = yr("@theme", (h) => this._applyTheme(h)));
      const { props: a, errors: s } = V(this, e.propsSchema);
      e.validateProps && s.push(...e.validateProps(a));
      const n = a;
      this._lastProps = n, this._lastErrors = s;
      let c = null;
      if (e.contentTemplate && (c = this._extractContent(e.contentTemplate), this._lastContent = c, this._contentObserver = new MutationObserver(() => {
        const h = this._extractContent(e.contentTemplate);
        this._lastContent = h, this._reactive?.notifyContent(h), this.onContentChanged(h);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(o, i, n, s, c, t), r !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), r === this._attachment && this.emitEvent("load");
    } catch (e) {
      if (r !== this._attachment || (this.onError(e), r !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(r = _r.getThemeMode?.()) {
    z(r, this), this._container && z(r, this._container);
  }
  disconnectedCallback() {
    const r = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), z("auto", this), this._container && z("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), r === this._attachment && (this.emitEvent("unload"), r === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(r, e, t) {
    if (e === t)
      return;
    if (r === O) {
      const n = this._hostVisible, c = F(this);
      if (c === n)
        return;
      this._hostVisible = c, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(c, n), this.onHostVisibilityChanged(c, n));
      return;
    }
    const o = this.constructor.wippyConfig, { props: i, errors: a } = V(this, o.propsSchema);
    o.validateProps && a.push(...o.validateProps(i));
    const s = i;
    this._lastProps = s, this._lastErrors = a, this._reactive?.notifyProps(s, a), this.onPropsChanged(s, a);
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
   *
   * A template keeps its children in one of two places. Parsed HTML (page
   * markup, `innerHTML`) puts them in `template.content`, a DocumentFragment.
   * DOM APIs add them as the template element's own child nodes and leave
   * `template.content` empty: that is how a Vue SFC sets
   * `<template data-type="...">{{ text }}</template>`. The content fragment is
   * read first, then the element's own children. Only text is returned, never
   * markup, in both cases.
   */
  _extractContent(r) {
    const e = this.querySelector(`template[data-type="${r}"]`);
    return e ? e.content.textContent?.trim() || e.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(r) {
  }
};
P = /* @__PURE__ */ new WeakMap();
function Qr(r) {
  return r.__wippyHostBus ?? null;
}
function Xr(r) {
  return r.dataset.wippyPanelId ?? null;
}
var Zr = Object.defineProperty, re = (r, e, t) => e in r ? Zr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, w = (r, e, t) => re(r, typeof e != "symbol" ? e + "" : e, t);
function K(r, e, t) {
  const o = r.createElement("div"), i = t ? e.failed : e.loading;
  o.dataset.lazyState = t ? "failed" : "loading", o.setAttribute("role", t ? "alert" : "status"), o.setAttribute("aria-label", i), o.style.cssText = "display:grid;place-items:center;text-align:center;";
  const a = e.surface === "page";
  if (o.style.cssText += a ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", t)
    o.style.color = "var(--p-danger-500, currentColor)", o.textContent = !a && e.iconOnly ? "⚠" : i, !a && e.iconOnly && (o.title = i);
  else {
    const s = r.createElement("style");
    s.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const n = r.createElement("span");
    n.dataset.wippySpinner = "", n.setAttribute("aria-hidden", "true"), n.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", n.style.fontSize = a ? "2rem" : "1em", o.append(s, n);
  }
  return o;
}
var sr = /* @__PURE__ */ Symbol("wippy:emit"), pr = /* @__PURE__ */ Symbol("wippy:props"), ee = /* @__PURE__ */ Symbol("wippy:props_error"), te = /* @__PURE__ */ Symbol("wippy:content"), oe = /* @__PURE__ */ Symbol("wippy:panel-id"), ie = /* @__PURE__ */ Symbol("wippy:layout-bus"), ne = /* @__PURE__ */ Symbol("wippy:host"), cr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Ae() {
  const r = j(pr);
  if (!r)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return r;
}
function Ve() {
  const r = j(sr);
  if (!r)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return r;
}
function ae() {
  const r = j(cr);
  if (!r)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return r;
}
function Re(r) {
  const e = ae();
  let t = !1, o = null, i = !1;
  function a() {
    if (o)
      return i = !0, o;
    let s;
    try {
      s = Promise.resolve(r());
    } catch (c) {
      s = Promise.reject(c);
    }
    const n = s.finally(() => {
      if (o === n && (o = null, t && i))
        return i = !1, a();
    });
    return o = n, n;
  }
  return mr(() => (t = !0, a())), fr(() => {
    t = !1, i = !1;
  }), gr(e, (s, n) => {
    if (t && n === !1 && s === !0)
      return a();
  }), e;
}
var S = /* @__PURE__ */ new WeakMap();
function Y(r, e) {
  const t = S.get(r);
  if (t)
    return t;
  const o = Promise.resolve().then(e);
  return S.set(r, o), o.catch(() => {
    S.get(r) === o && S.delete(r);
  }), o;
}
var se = class extends Gr {
  constructor() {
    super(...arguments), w(this, "_vueApp", null), w(this, "_mountingApp", !1), w(this, "_mountState", "idle"), w(this, "_feedback", null), w(this, "_propsRef", C({})), w(this, "_errorsRef", C([])), w(this, "_contentRef", C(null)), w(this, "_hostVisibilityRef", C(null)), w(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const r = this.vueConfig;
    r.mountLifecycle && !r.rootComponent && r.lazyConfig && await Y(this, r.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(r, e, t, o, i, a) {
    const s = this.constructor, n = s.vueConfig, c = new AbortController();
    this._bridgeAbort = c;
    const h = () => !c.signal.aborted && this._bridgeAbort === c;
    this._mountState = "mounting", this._propsRef.value = t, this._errorsRef.value = o, this._contentRef.value = i ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const p of o)
      if (this.emitEvent("invalid", { message: p }), !h())
        return;
    this.reactive.props.subscribe((p, u) => {
      this._propsRef.value = p, this._errorsRef.value = [...u];
      for (const l of u)
        this.emitEvent("invalid", { message: l });
    }, { signal: c.signal }), this.reactive.content && this.reactive.content.subscribe((p) => {
      this._contentRef.value = p;
    }, { signal: c.signal }), this.reactive.hostVisibility.subscribe((p) => {
      this._hostVisibilityRef.value = p;
    }, { signal: c.signal });
    const f = (p) => {
      if (!h())
        return;
      const u = Er(), l = ur(p.rootComponent);
      let b = !1, x = !1, v, k;
      this._mountingApp = !0;
      try {
        const y = Pr();
        if (p.piniaPlugins)
          for (const g of p.piniaPlugins)
            y.use(g);
        l.use(y);
        for (const g of p.plugins ?? [])
          l.use(g);
        if (l.provide(pr, this._propsRef), l.provide(ee, this._errorsRef), l.provide(sr, this.emitEvent.bind(this)), l.provide(te, this._contentRef), l.provide(cr, this._hostVisibilityRef), l.provide(oe, Xr(this)), l.provide(ie, Qr(this)), l.provide(ne, ar(this)), p.providers?.(l, this), !h())
          return;
        if (k = l.config.errorHandler, n.mountLifecycle && (l.config.errorHandler = (g, U, m) => {
          x || (v = g), x = !0, k?.(g, U, m);
        }), l.mount(e), b = !0, x)
          throw v;
        h() && (this._vueApp = l);
      } finally {
        n.mountLifecycle && b && (l.config.errorHandler = k);
        try {
          b && (x || !h()) && l.unmount();
        } finally {
          Lr(u), this._mountingApp = !1;
        }
      }
      n.mountLifecycle && queueMicrotask(() => {
        h() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (n.rootComponent) {
      if (this._mountingApp && n.mountLifecycle) {
        queueMicrotask(() => {
          try {
            f(n);
          } catch (p) {
            h() && (this._mountState = "failed", this.emitEvent("error", { message: p instanceof Error ? p.message : String(p), error: p }));
          }
        });
        return;
      }
      try {
        f(n);
      } catch (p) {
        if (h())
          throw this._mountState = "failed", p;
      }
    } else if (n.lazyConfig) {
      const p = e.ownerDocument, u = n.lazyUi;
      u?.surface === "page" && (e.style.blockSize = "100%", e.style.minBlockSize = "0");
      let l = !1, b, x;
      const v = () => {
        clearTimeout(b), clearTimeout(x), this._feedback?.remove(), this._feedback = null;
      };
      c.signal.addEventListener("abort", v, { once: !0 });
      const k = () => {
        if (!h() || l)
          return;
        const m = u ? K(p, u, !1) : p.createElement("wippy-loading");
        m.setAttribute("no-bg", ""), this._feedback = m, e.appendChild(m);
      }, y = (m) => {
        if (!h())
          return;
        l = !0, v(), this._mountState = "failed";
        const A = u?.failed ?? (m instanceof Error ? m.message : String(m)), _ = u ? K(p, u, !0) : p.createElement("wippy-error");
        u || (_.setAttribute("title", "Failed to load"), _.setAttribute("message", A)), this._feedback = _, e.appendChild(_), this.emitEvent("error", u ? { message: A, error: m } : { message: A });
      }, g = u?.delay ?? (u?.surface === "compact" ? 200 : 0);
      g > 0 ? b = setTimeout(k, g) : k(), u && (x = setTimeout(() => y(new Error("The component did not load in time.")), u.timeout ?? 3e4)), (n.mountLifecycle ? Y(s, n.lazyConfig) : n.lazyConfig()).then((m) => {
        !h() || l || (l = !0, v(), f(m));
      }, (m) => {
        l || y(m);
      }).catch(y);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const r = this._vueApp;
    this._vueApp = null, r?.unmount();
  }
};
const pe = "data-wippy-overlay-layer";
function lr() {
  return typeof window < "u" && typeof window.document < "u";
}
function dr() {
  return lr() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function ce() {
  return dr() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const le = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let de = 0;
const L = /* @__PURE__ */ new WeakMap();
function q(r, e) {
  const t = r.style;
  t.setProperty("position", "fixed", "important"), t.setProperty("inset", "auto", "important"), t.setProperty("margin", "0", "important"), t.setProperty("position-anchor", e), t.setProperty("position-area", "bottom span-right"), t.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), t.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), t.setProperty("max-width", "stretch", "important");
}
function he(r, e) {
  if (!le.test(r.className))
    return;
  const t = r.style.cssText;
  q(r, e), r.getAttribute("popover") !== "manual" && r.setAttribute("popover", "manual");
  try {
    r.matches(":popover-open") || r.showPopover();
  } catch {
  }
  if (!r.matches(":popover-open")) {
    r.removeAttribute("popover"), r.style.cssText = t;
    return;
  }
  if (!L.has(r)) {
    const o = new MutationObserver(() => {
      const i = r.style;
      (i.top !== "auto" || i.left !== "auto" || i.margin !== "0px" || i.getPropertyPriority("top") !== "important" || i.getPropertyPriority("left") !== "important" || i.getPropertyPriority("margin") !== "important" || i.getPropertyPriority("min-width") !== "important" || i.maxWidth !== "stretch" || i.getPropertyPriority("max-width") !== "important") && q(r, e);
    });
    o.observe(r, { attributes: !0, attributeFilter: ["style"] }), L.set(r, o);
  }
}
function H(r) {
  const e = L.get(r);
  e && (e.disconnect(), L.delete(r));
}
function ue(r) {
  const e = r && typeof r.getRootNode == "function" ? r.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function M(r) {
  r.style.top = "0px", r.style.left = "0px";
  const e = r.getBoundingClientRect();
  r.style.top = `${-window.scrollY - e.top}px`, r.style.left = `${-window.scrollX - e.left}px`;
}
const T = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new WeakMap();
let J = !1, I = !1;
const G = ["w-theme-dark", "w-theme-light"], E = "data-wippy-theme-root", N = /* @__PURE__ */ new WeakMap();
function me(r) {
  const e = [];
  let t = r ? r.parentNode : null;
  for (; t && t.nodeType === 1; )
    e.push(t), t = t.parentNode;
  return e;
}
function fe(r, e, t) {
  const o = [...me(e), t.host], i = () => {
    let s;
    for (const n of o) {
      if (G.some((c) => n.classList.contains(c))) {
        s = n;
        break;
      }
      if (n.hasAttribute(E))
        break;
    }
    for (const n of G)
      r.classList.toggle(n, !!(s && s.classList.contains(n)));
    s ? r.setAttribute(E, "") : r.removeAttribute(E);
  };
  i();
  const a = new MutationObserver(i);
  for (const s of o)
    a.observe(s, { attributes: !0, attributeFilter: ["class", E] });
  N.set(r, a);
}
function hr(r) {
  N.get(r)?.disconnect(), N.delete(r);
}
function ge() {
  I = !1;
  for (const r of T) {
    if (!r.isConnected) {
      for (const e of Array.from(r.children))
        e instanceof HTMLElement && H(e);
      T.delete(r), $.get(r)?.disconnect(), hr(r);
      continue;
    }
    r.childElementCount > 0 && M(r);
  }
}
function Q() {
  I || (I = !0, requestAnimationFrame(ge));
}
function we(r) {
  const e = document.createElement("div");
  e.setAttribute(pe, "");
  const t = dr();
  if (e.style.cssText = t ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", t && e.setAttribute("popover", "manual"), r.appendChild(e), t) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  M(e);
  const o = new MutationObserver((i) => {
    const a = e.__wippyAnchorName;
    for (const s of i) {
      if (a)
        for (const n of Array.from(s.addedNodes))
          n instanceof HTMLElement && he(n, a);
      for (const n of Array.from(s.removedNodes))
        n instanceof HTMLElement && H(n);
    }
    e.isConnected && e.childElementCount > 0 && M(e);
  });
  return o.observe(e, { childList: !0 }), $.set(e, o), T.add(e), J || (J = !0, window.addEventListener("scroll", Q, { capture: !0, passive: !0 }), window.addEventListener("resize", Q, { passive: !0 })), e;
}
function X(r) {
  if (!(!r.hostRoot || r.layer) && (r.layer = we(r.hostRoot), fe(r.layer, r.$el, r.hostRoot), ce())) {
    const e = r.$el ? r.$el.parentElement : null;
    e && (r.anchorName = `--wippy-a-${++de}`, r.anchorTrigger = e, e.style.setProperty("anchor-name", r.anchorName), r.layer.__wippyAnchorName = r.anchorName);
  }
}
function Z(r) {
  if (r.anchorTrigger && (r.anchorTrigger.style.removeProperty("anchor-name"), r.anchorTrigger = null), r.anchorName = null, r.layer) {
    for (const e of Array.from(r.layer.children))
      e instanceof HTMLElement && H(e);
    T.delete(r.layer), $.get(r.layer)?.disconnect(), hr(r.layer), r.layer.remove(), r.layer = null;
  }
}
let rr = !1;
function xe() {
  if (rr)
    return;
  const r = Vr;
  !r.methods || typeof r.methods.bindOutsideClickListener != "function" || (r.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const t = e.composedPath(), o = this.container && !t.includes(this.container), i = !(this.target && t.includes(this.target));
      this.overlayVisible && o && i ? this.hide() : !this.popup && o && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, rr = !0);
}
let er = !1;
function be() {
  if (er)
    return;
  const r = Ar;
  !r.methods || typeof r.methods.bindOutsideClickListener != "function" || (r.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const t = e.composedPath(), o = this.container && !t.includes(this.container), i = this.visible ? !(this.target && t.includes(this.target)) : !0;
      o && i && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, er = !0);
}
let tr = !1;
function ve() {
  if (tr)
    return;
  tr = !0;
  const r = Rr;
  r.computed = r.computed || {}, r.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, r.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, r.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, r.mounted = function() {
    lr() && (this.hostRoot = ue(this.$el), this.mounted = !0, this.hostRoot && (this.inline || X(this), this.$watch("inline", (e) => {
      e ? Z(this) : X(this);
    })));
  }, r.render = function() {
    return this.inline ? D(this.$slots, "default", { key: 0 }) : this.mounted ? xr(br, { key: 1, to: this.resolvedTarget || document.body }, [
      D(this.$slots, "default")
    ]) : wr("", !0);
  }, r.unmounted = function() {
    Z(this);
  };
}
const ke = {
  install: (r) => {
    xe(), be(), ve(), r.use(Tr, { theme: "none" });
  }
}, ye = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background);font-family:var(--kx-font-body);font-size:13px;line-height:1.5}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}h1,h2,h3,h4,p{margin:0}h2{font-size:16px;font-weight:700}h3,h4{font-size:14px;font-weight:600}.work-page{height:100%;min-height:0;overflow-y:auto}.work-row{display:flex;gap:8px;align-items:center;min-width:0}.work-wrap{flex-wrap:wrap}.work-spacer{flex:1}.work-stack{display:grid;gap:12px;min-width:0}.work-stack.work-tight{gap:6px}.work-small{font-size:12px}.work-muted,dt,.work-read-value{color:var(--p-text-muted-color)}.kx-err,.work-error{color:var(--p-danger-active-color);white-space:pre-line;overflow-wrap:anywhere}.work-alert-actions{display:grid;justify-items:start;gap:8px}.work-mono{width:fit-content;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;font-weight:400;padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.work-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.work-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}.kx-head-text{flex:1 1 160px}.kx-title,.kx-head-sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-head-actions>.p-inputtext{width:180px}.kx-head-actions .p-selectbutton{flex-wrap:wrap}.work-page>:not(.kx-head,.work-settings-shell,kickside-work-board-settings,.work-native-dialog,.p-drawer-mask){margin-inline:var(--kickside-system-surface-gutter, 24px)}.work-page>.kx-head,.work-settings-shell>.kx-head{padding-inline:var(--kickside-system-surface-gutter, 24px)}.work-pane{padding:18px var(--kickside-system-surface-gutter, 24px) 28px;overflow-y:auto;min-height:0}.work-pane>*{max-width:960px}.work-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding-block:8px 16px}.work-toolbar .p-select{min-width:180px;max-width:300px}.work-filter-row{margin-bottom:16px}.work-notice{margin-block:12px;padding:12px 14px;border-radius:8px;background:var(--kx-wash-warn);white-space:pre-wrap}.work-board-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:var(--kx-wash-primary);color:var(--p-primary-color);flex:none}.work-board-icon svg{width:20px;height:20px}.work-board-identity{min-width:0}.work-board-identity>.work-row{flex-wrap:wrap}.work-board-title{align-items:baseline}.work-board-title>svg{flex:none}.work-board-identity :is(h1,h2){min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere}.work-identity-edit{display:grid;grid-template-columns:minmax(100px,1fr) minmax(140px,1.5fr) auto;align-items:end;gap:8px}.work-admin-shell{height:100%;min-height:0;display:grid;grid-template-columns:232px minmax(0,1fr)}.work-rail{padding:16px 12px;border-right:1px solid var(--p-content-border-color);overflow-y:auto;min-width:0;min-height:0}.work-rail>.kx-err{margin-inline:0}.work-railhead{display:flex;align-items:center;justify-content:space-between;min-height:48px;gap:8px}.work-railhead h2{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-count{font-size:11px;font-weight:600;text-transform:none;white-space:nowrap;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.work-rail>.p-inputtext{width:100%;margin-bottom:12px}.work-rail-group{margin:12px 10px 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-rail .work-rail-row{width:100%;justify-content:flex-start;text-align:left;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;margin-block:2px}.work-rail-row>.work-stack{min-width:0}.work-rail-row strong{font-weight:500;overflow-wrap:anywhere}.work-rail .work-rail-active{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.work-admin-main{min-width:0;min-height:0;overflow:hidden}.work-admin-main>.kx-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.work-mobile-board-back{display:none}.work-settings-shell{min-width:0;height:100%;display:flex;flex-direction:column;container-type:inline-size}.work-settings-shell>.kx-head,.work-detail-head{flex:none}.work-detail-head{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:18px var(--kickside-system-surface-gutter, 24px) 14px}.work-detail-title{font-size:16px;font-weight:700}.work-draft-actions{margin-left:auto}.work-dirty{background:var(--kx-wash-warn);color:var(--p-warn-700);border-radius:8px;padding:7px 11px;font-size:12px;font-weight:600;white-space:nowrap}.work-settings-tabs{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding-inline:var(--kickside-system-surface-gutter, 24px);border-bottom:1px solid var(--p-content-border-color)}.work-advanced{margin-left:auto;white-space:nowrap}.work-settings-content{flex:1;min-height:0}.work-settings-fieldset{border:0;padding:0;margin:0;min-width:0}.work-settings-grid{display:grid;gap:11px;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}label.work-stack,.work-settings-grid label,.work-chip-picker legend{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-settings-grid .p-inputtext,.work-settings-grid .p-select,.work-settings-grid .p-inputnumber,.work-settings-grid .p-inputnumber-input,.work-field-control>.p-inputtext,.work-field-control>.p-select,.work-field-control>.p-inputnumber,.work-field-control .p-inputnumber-input,.work-field-control>.p-textarea{width:100%;min-width:0}.work-pane .p-inputtext,.work-pane .p-select,.work-pane .p-inputnumber-input{min-height:var(--kx-control-height)}:host .p-select,:host .p-select-label,:host .p-select-option,:host .p-inputtext,:host .p-inputnumber-input,:host .p-textarea{font-family:var(--kx-font-body);font-size:13px;font-weight:400;letter-spacing:normal;word-spacing:normal}.work-section-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.work-section-heading h2,.work-option-builder h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-section-heading p{font-size:12px;margin-top:4px}.work-definition-scroll{overflow-x:auto;scrollbar-color:var(--p-text-muted-color) var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-definition-scroll::-webkit-scrollbar{height:8px}.work-definition-scroll::-webkit-scrollbar-thumb{background:var(--p-content-border-color);border-radius:6px}.work-field-builder{display:grid;gap:0;grid-template-columns:52px minmax(160px,1.4fr) minmax(120px,1fr) 140px minmax(120px,1.2fr) 120px auto;min-width:936px}.work-definitions-types,.work-definitions-relations{grid-template-columns:24px minmax(160px,1.4fr) minmax(120px,1fr) 140px minmax(120px,1fr) auto;min-width:720px}.work-definitions-plugins{grid-template-columns:24px minmax(160px,1fr) 140px minmax(120px,1fr) auto;min-width:560px}.work-definition-columns,.work-definition,.work-definition-head{display:grid;grid-column:1 / -1;grid-template-columns:subgrid;min-width:0}.work-definition-head,.work-definition-columns{align-items:center;column-gap:8px;padding:12px 16px}.work-definition-columns{padding-block:8px;border-bottom:1px solid var(--p-content-border-color);font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.work-definition-toggle{display:grid;grid-column:1 / 3;grid-template-columns:16px minmax(0,1fr);align-items:center;justify-content:start;gap:8px;min-width:0;text-align:left}.work-definition-has-handle .work-definition-toggle{grid-column:2}.work-definition-handle{grid-column:1}.work-definition-toggle>svg{width:16px;height:16px}.work-definition-toggle .work-row-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.work-definition-details{display:contents}.work-definition-code{min-width:0}.work-definition-code .work-mono{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}.work-definition-kind{min-width:0}.work-definition-kind>.p-tag{max-width:100%}.work-definition-usage{text-align:right;font-size:12px;min-width:0}.work-definition-usage details>span{display:block;white-space:normal}.work-definition-actions{display:flex;align-items:center;justify-content:flex-end;gap:0;min-width:0}.work-definition-body,.work-field-builder>.work-add-definition,.work-field-builder>.kx-empty{grid-column:1 / -1}.work-definitions-types .work-definition-flags,.work-definitions-relations .work-definition-flags,.work-definitions-plugins .work-definition-code,.work-definitions-plugins .work-definition-usage{display:none}.work-definition-meta{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}.work-definition-description{grid-column:1 / -1;padding-left:32px;font-size:12px;color:var(--p-text-muted-color)}.work-field-builder>.work-definition{border:0;border-bottom:1px solid var(--p-content-border-color);border-radius:0}.work-field-builder>.work-definition:last-child{border-bottom:0}.work-field-builder>.work-add-definition{border:0;border-radius:0}.work-row-title{font-size:14px;font-weight:600;color:var(--p-text-color)}.work-definition-flags{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.work-used-by{color:var(--p-text-muted-color);font-size:12px}.work-used-by summary{white-space:nowrap}.work-definition-body{width:min(960px,100%);padding:16px;border-top:1px solid var(--p-content-border-color)}.work-definition-body>.p-button{justify-self:start}@container (width < 990px){.work-field-builder{min-width:0;grid-template-columns:minmax(0,1fr)}.work-definition-columns{display:none}.work-definition{display:block}.work-definition-head{grid-template-columns:auto minmax(0,1fr) auto;gap:6px 8px;padding:10px 12px}.work-definition-toggle{grid-area:1 / 1 / 2 / -1}.work-definition-has-handle .work-definition-toggle{grid-column:2 / -1}.work-definition-toggle .work-row-title{white-space:normal;overflow-wrap:anywhere}.work-definition-details{grid-area:2 / 1 / 3 / 3;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-width:0;overflow-wrap:anywhere}.work-definition-kind{order:-1}.work-definition-details>:empty{display:none}.work-definition-usage,.work-definition-meta{text-align:left;justify-content:flex-start}.work-definition-actions{grid-area:2 / 3}.work-definition-description{padding-left:0;overflow-wrap:anywhere}}@container (width < 410px){.work-definitions-plugins .work-definition-details{grid-column:1 / -1}.work-definitions-plugins .work-definition-actions{grid-area:3 / 1 / 4 / -1;justify-content:flex-start}.work-definitions-plugins .work-definition-actions>.work-spacer{display:none}}.work-config-widget{display:block;max-width:440px}.work-config-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;max-width:760px}.work-config-field{min-width:0;display:flex;flex-direction:column;gap:6px}.work-config-label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-config-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.work-config-chips .p-inputtext{min-width:100px;flex:1}.work-form-actions{display:flex;justify-content:flex-end;gap:8px}.work-map-zoom{display:flex;align-items:center;gap:2px}.work-pack-review-field{width:min(100%,360px)}.work-pack-choice{display:flex;flex-direction:column;gap:6px;width:100%}.work-pack-unavailable{font-size:12px;color:var(--p-warn-600)}.work-add-link{display:grid;grid-template-columns:minmax(110px,.7fr) minmax(0,1fr) auto;align-items:end;gap:8px}.work-link-search{position:relative;min-width:0}.work-link-search .p-autocomplete{width:100%;min-width:0}.work-link-search .p-autocomplete-input{min-width:0;width:100%}.work-link-board{padding:8px;border-bottom:1px solid var(--p-content-border-color)}.work-link-board .p-select{width:100%}@media(max-width:640px){.work-config-fields{grid-template-columns:minmax(0,1fr)}}.work-settings-card{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-reorder-handle{cursor:grab;touch-action:none}.work-reorder-handle:active{cursor:grabbing}.work-add-definition{align-items:end;padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);flex-wrap:wrap}.work-add-definition>label{width:min(260px,100%)}.work-option-builder{border-top:1px solid var(--p-content-border-color);padding-top:14px}.work-option-row{display:grid;grid-template-columns:28px minmax(120px,1fr) minmax(100px,.7fr) minmax(130px,1fr) auto;gap:8px;align-items:end;padding:8px 0}.work-color-swatch{width:12px;height:12px;border-radius:50%;flex:none;background:var(--p-text-muted-color)}.work-swatch-primary{background:var(--p-primary-color)}.work-swatch-success{background:var(--p-success-500)}.work-swatch-info{background:var(--p-info-500)}.work-swatch-warn{background:var(--p-warn-500)}.work-swatch-danger{background:var(--p-danger-500)}.work-chip-picker{border:0;padding:0;margin:0;display:grid;gap:8px;min-width:0}.work-chip-picker legend{padding:0;margin-bottom:8px}.work-schema-plan,.work-advanced-settings{margin-top:20px}.work-schema-plan ul{display:grid;gap:10px;padding-left:20px}.work-relation-preview{padding:12px;border-radius:8px;background:var(--kx-overlay-subtle)}.work-group-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.work-settings-list{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-settings-row{display:flex;align-items:center;flex-wrap:wrap;gap:16px;padding:16px;border-bottom:1px solid var(--p-content-border-color)}.work-settings-row:last-child{border-bottom:0}.work-row-main{flex:1 1 260px;min-width:0}.work-row-main .work-mono{margin-left:8px}.work-row-control{flex:0 1 360px;min-width:0}.work-row-control>.p-select,.work-row-control>.p-inputnumber{width:100%}.work-row-control .p-inputnumber{width:100%;max-width:none}.work-column-head{display:flex;align-items:center;gap:8px;min-height:32px;padding-inline:4px}.work-column-head h2{font-size:13px;font-weight:600}.work-state-dot{width:8px;height:8px;border-radius:50%;background:var(--p-text-muted-color)}.work-state-dot.work-complete{background:var(--p-success-500)}.work-wip-track{height:2px;background:var(--p-content-border-color);overflow:hidden;border-radius:2px}.work-wip-track span{display:block;height:100%;background:var(--p-primary-color)}.work-column-cards{display:flex;flex-direction:column;gap:12px;min-height:80px}dd{margin:0;overflow-wrap:anywhere}.work-column-empty{padding:28px 12px;border:1px dashed var(--p-content-border-color);border-radius:12px}.work-drag-ghost{opacity:.3}.work-settings-table{border-collapse:collapse;width:100%;text-align:left;font-size:13px}.work-settings-table th{font-size:12px;color:var(--p-text-muted-color);font-weight:600}.work-settings-table th,.work-settings-table td{position:relative;height:40px;padding:8px 16px;border-bottom:1px solid var(--p-content-border-color);vertical-align:middle}.work-settings-table tbody tr:hover{background:var(--kx-overlay-hover)}.work-column-choice{flex:1}.work-column-choice summary,.work-explanation summary{cursor:pointer}.work-column-choice[open]>div{padding-block:12px}.work-selection-bar,.work-selection-results{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-filter-node{display:grid;gap:11px;min-width:0;margin:0;padding:12px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.work-filter-node legend{color:var(--p-text-muted-color);padding-inline:6px}.work-filter-node .p-select{min-width:120px;max-width:300px}.work-operand-control{flex:1}.work-operand-control .p-textarea{width:100%}.work-native-dialog{padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);color:var(--p-text-color);background:var(--p-content-background);max-width:min(600px,calc(100vw - 40px));max-height:calc(100dvh - 40px);overflow:auto}.work-native-dialog::backdrop{background:color-mix(in srgb,var(--p-text-color) 28%,transparent)}.work-dialog-box{display:grid;gap:18px;padding:24px;width:min(560px,calc(100vw - 44px))}.work-dialog-actions{display:flex;justify-content:flex-end;gap:8px}.work-pack-choices.p-selectbutton{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.work-pack-choices>.p-togglebutton{text-align:left}.work-field-control>div{min-width:0}.work-plain-list{list-style:none;padding:0;margin:0 0 12px;display:grid;gap:12px}.work-pane>form:has(.work-process-editor:not([style*="display: none"])){max-width:none}.work-process-editor{min-width:0;width:100%}.work-process-builder{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(430px,auto);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden;background:var(--p-content-background)}.work-process-builder.work-process-inspecting{grid-template-columns:minmax(0,1fr) 340px}.work-process-controls{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--p-content-border-color)}.work-process-controls .p-select{max-width:220px}.work-process-title{font-weight:600;margin-right:8px}.work-process-canvas{position:relative;min-width:0;overflow:hidden;touch-action:none;background:radial-gradient(circle,color-mix(in srgb,var(--p-text-color) 13%,transparent) 1px,transparent 1.2px) 0 0 / 18px 18px,var(--p-content-background);cursor:grab}.work-process-canvas:active{cursor:grabbing}.work-process-canvas>svg{width:100%;display:block}.work-process-instruction{position:absolute;top:8px;left:16px;font-size:12px;color:var(--p-primary-color)}.work-graph-phase rect{fill:var(--kx-surface-1)}.work-graph-phase text{fill:var(--p-text-muted-color);font-size:11px;font-weight:600}.work-graph-parallel>rect{fill:none;stroke:var(--p-content-border-color);stroke-dasharray:2 3}.work-main-line,.work-edge-line{fill:none;stroke:color-mix(in srgb,var(--p-primary-color) 70%,var(--p-content-border-color));stroke-width:2.25;stroke-linecap:round;pointer-events:none}.work-edge-return .work-edge-line,.work-edge-side .work-edge-line{stroke:color-mix(in srgb,var(--p-text-muted-color) 62%,transparent);stroke-width:1.25;stroke-dasharray:4 4}.work-edge-forward .work-edge-line{stroke-width:1.25}.work-graph-edge,.work-graph-node,.work-any-transition{cursor:pointer}.work-edge-hit{fill:none;stroke:transparent;stroke-width:18}.work-graph-arrow{fill:var(--p-text-muted-color)}.work-edge-label-bg{fill:var(--p-content-background)}.work-edge-main .work-edge-label-bg{fill:var(--kx-surface-1)}.work-edge-label{font-size:10.5px;font-weight:500;fill:var(--p-text-muted-color)}.work-graph-edge.work-selected .work-edge-line{stroke:var(--p-primary-color);stroke-width:2.5}.work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color)}.work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}.work-stop-ring{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:2}.work-stop-unstarted .work-stop-ring,.work-stop-triage .work-stop-ring,.work-stop-backlog .work-stop-ring{stroke:color-mix(in srgb,var(--p-text-color) 45%,var(--p-content-border-color))}.work-stop-completed .work-stop-ring{fill:var(--p-primary-color)}.work-stop-canceled .work-stop-ring{stroke:var(--p-text-muted-color);stroke-dasharray:3 3}.work-stop-icon{color:var(--p-text-color);pointer-events:none}.work-stop-completed .work-stop-icon{color:var(--p-primary-contrast-color)}.work-stop-halo{fill:color-mix(in srgb,var(--p-primary-color) 16%,transparent)}.work-stop-focus{fill:color-mix(in srgb,var(--p-focus-ring-color) 16%,transparent);visibility:hidden}.work-graph-node:focus-visible,.work-graph-edge:focus-visible{outline:none}.work-graph-node:focus-visible .work-stop-focus{visibility:visible}.work-graph-node:focus-visible .work-stop-ring{stroke:var(--p-focus-ring-color)}.work-graph-edge:focus-visible .work-edge-label-bg{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-options{font-size:12px;color:var(--p-text-muted-color)}.work-process-options>summary{cursor:pointer}.work-process-options>:not(summary){margin-top:10px}.work-graph-node.work-selected .work-stop-ring{stroke-width:2.75}.work-graph-node.work-selected .work-node-name{fill:var(--p-primary-color)}.work-node-name{font-size:12.5px;font-weight:600;fill:var(--p-text-color)}.work-node-meta{font-size:11px;font-weight:400;fill:var(--p-text-muted-color)}.work-node-connector{fill:transparent;stroke:none;cursor:crosshair}.work-parallel-stop .work-stop-ring,.work-parallel-stop .work-stop-icon,.work-parallel-stop .work-node-connector{display:none}.work-limit-text{fill:var(--p-warn-600)}.work-connect-ghost{fill:none;stroke:var(--p-primary-color);stroke-width:2;stroke-dasharray:4 4;pointer-events:none}.work-process-legend{position:absolute;right:14px;bottom:12px;display:flex;gap:16px;color:var(--p-text-muted-color);font-size:11px;pointer-events:none}.work-process-legend i{display:inline-block;width:22px;border-top:2.25px solid var(--p-primary-color);margin-right:6px;vertical-align:middle}.work-process-legend i.work-return-key{border-top:1.25px dashed var(--p-text-muted-color)}.work-process-sideform{min-width:0;height:550px;overflow-y:auto;padding:16px;border-left:1px solid var(--p-content-border-color);display:flex;flex-direction:column;gap:14px}.work-process-sideform .work-settings-grid{grid-template-columns:1fr}.work-process-sideform .work-process-state-title{flex:1;font-size:16px;font-weight:700}.work-process-sideform h3{font-size:16px;font-weight:700}.work-process-sideform .work-process-name.p-inputtext{width:100%;min-width:0;font-size:16px;font-weight:700;padding:4px 0;background:transparent;border-color:transparent;box-shadow:none}.work-process-sideform .work-process-name.p-inputtext:focus{border-color:var(--p-focus-ring-color);box-shadow:var(--p-focus-ring-shadow)}.work-block{display:block}.work-process-meaning{color:var(--p-text-muted-color);font-size:12px;margin:-6px 0 0}.work-process-group{color:var(--p-text-muted-color);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin:4px 0 -4px}.work-process-kinds{display:flex;width:100%}.work-process-kinds>*{flex:1;min-width:0}.work-process-kind{display:grid;justify-items:center;gap:4px;font-size:11px}.work-process-sideform .work-row .p-inputnumber{flex:0 0 78px;width:78px;min-width:0}.work-process-sideform .work-row .p-inputnumber-input{width:100%;min-width:0}.work-process-inspector-foot{margin-top:auto;padding-top:12px;border-top:1px solid var(--p-content-border-color)}.work-process-value{padding:10px;border:1px solid var(--p-content-border-color);border-radius:8px}.work-process-list{min-width:0;padding:16px;overflow:auto}.work-process-list>label{max-width:360px}.work-process-table{table-layout:fixed;width:100%}.work-process-table th:first-child{width:34%}.work-process-table th:last-child{width:92px}.work-process-table .p-inputtext{width:100%;min-width:0}.work-process-table td{height:40px;padding-block:2px;overflow-wrap:anywhere}.work-process-list-actions{white-space:nowrap;text-align:right}.work-process-table tr[aria-selected=true]{background:color-mix(in srgb,var(--p-primary-color) 9%,transparent)}.work-process-cell-label{display:none}@container (max-width: 700px){.work-process-builder.work-process-inspecting{grid-template-columns:minmax(0,1fr)}.work-process-sideform{border-left:0;border-top:1px solid var(--p-content-border-color)}}@container (width < 650px){.work-process-table,.work-process-table tbody{display:block}.work-process-table thead{position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%)}.work-process-table tbody tr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:start;gap:6px 8px;padding-block:8px;border-bottom:1px solid var(--p-content-border-color)}.work-process-table td{height:auto;padding:0;border:0}.work-process-table td:first-child{grid-area:1 / 1 / 2 / 3}.work-process-table td:nth-child(3){grid-column:2 / -1}.work-process-list-actions{grid-area:1 / 3}.work-process-cell-label{display:block;font-size:12px;font-weight:600;color:var(--p-text-muted-color)}}.work-node-connector:focus-visible,summary:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}@container (max-width: 1000px){.work-option-row{grid-template-columns:28px repeat(2,minmax(0,1fr))}}@media(max-width:720px){.work-admin-shell{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.work-admin-shell>.work-rail{border-right:0}.work-board-selected>.work-rail,.work-admin-shell:not(.work-board-selected)>.work-admin-main{display:none}.work-board-selected>.work-admin-main{display:flex;flex-direction:column}.work-admin-main>kickside-work-board-settings{display:block;flex:1;min-height:0}.work-mobile-board-back{display:block;flex:none;padding:8px var(--kickside-system-surface-gutter, 24px) 0}}@container (max-width: 720px){.work-settings-grid,.work-identity-edit{grid-template-columns:minmax(0,1fr)}.work-detail-head{align-items:flex-start;flex-direction:column;padding-block:10px}.work-draft-actions{margin-left:0}.work-section-heading{flex-wrap:wrap}.work-section-heading>div{flex:1 1 180px;min-width:0}}.work-wip-container{overflow-x:auto}.work-wip-table{width:100%;border-collapse:collapse;text-align:left}.work-wip-table th{font-size:12px;font-weight:600;color:var(--p-text-muted-color);height:36px}.work-wip-table th,.work-wip-table td{padding:5px 16px;border-bottom:1px solid var(--p-content-border-color)}.work-wip-table tbody tr:last-child td{border-bottom:0}.work-wip-table td{height:44px;padding-block:4px}.work-wip-table td:first-child .work-mono{margin-left:8px}.work-wip-table th:nth-child(2),.work-wip-table td:nth-child(2){width:128px}.work-wip-table th:last-child,.work-wip-table td:last-child{width:112px;text-align:center}.work-wip-table .p-inputnumber,.work-wip-table .p-inputnumber-input{width:96px;min-width:0}.work-field-history .work-settings-row{padding-block:12px}.work-field-label{font-size:11.5px;font-weight:680;color:var(--p-text-muted-color)}.work-duration-control{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px}.work-duration-control .p-inputnumber,.work-duration-control .p-inputnumber-input{width:100%;min-width:0}.work-json-disclosure{font-size:12px;min-width:0}.work-json-disclosure>summary{cursor:pointer;color:var(--p-text-muted-color)}.work-json-disclosure>label{margin-top:10px}.work-json-disclosure .p-textarea.work-json-input,.work-json-example{width:100%;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.work-json-example{margin:0;color:var(--p-text-muted-color)}.work-process-sideform .p-selectbutton,.work-process-sideform .p-selectbutton>*{flex-wrap:wrap}.work-add-option{padding-top:10px;border-top:1px solid var(--p-content-border-color)}.work-option-code.p-inputtext{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}.work-content-action{font:inherit;letter-spacing:normal;word-spacing:normal;color:inherit;text-align:left;cursor:pointer}button.work-content-action{padding:0;border:0;background:transparent}.work-content-action[aria-disabled=true]{cursor:default;color:var(--p-text-muted-color)}.work-content-action:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:var(--p-focus-ring-shadow)}.work-section-navigation{min-width:0}.work-match-item.work-content-action{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--p-content-border-color)}.work-match-item:hover{background:var(--kx-overlay-hover)}';
function Oe(r, e) {
  return class extends se {
    static get wippyConfig() {
      return { propsSchema: e, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: ye };
    }
    static get vueConfig() {
      return { rootComponent: r, plugins: [ke] };
    }
  };
}
const R = /* @__PURE__ */ new Map();
function Me(r) {
  let e = R.get(r);
  return e || (e = Promise.resolve(Sr(r)).then(() => !0, () => (R.delete(r), !1)), R.set(r, e)), e;
}
export {
  Oe as a,
  Ae as b,
  Ve as c,
  Me as e,
  Re as u
};
//# sourceMappingURL=mount-DH0eHrQ3.js.map
