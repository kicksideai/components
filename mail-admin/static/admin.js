import { ref as C, createApp as sr, inject as Ne, onMounted as nr, onUnmounted as lr, watch as ie, renderSlot as ne, createCommentVNode as S, h as cr, Teleport as pr, defineComponent as Q, useId as ue, openBlock as l, createElementBlock as u, unref as o, normalizeClass as ge, createElementVNode as s, createTextVNode as W, toDisplayString as h, computed as V, createBlock as U, resolveDynamicComponent as dr, normalizeProps as ur, guardReactiveProps as mr, createSlots as et, withCtx as A, Fragment as H, renderList as ce, createVNode as m, shallowReactive as fr, onBeforeUnmount as At, shallowRef as be, withModifiers as tt, useModel as hr, mergeModels as vr, provide as gr } from "vue";
import { addCollection as br, Icon as I } from "@iconify/vue";
import { config as dt, addIcons as yr, on as rt, applyThemeMode as Le, host as Ce, hostCss as xr, loadCss as kr, api as ee, define as wr } from "@wippy-fe/proxy";
import { getActivePinia as _r, createPinia as Cr, setActivePinia as $r } from "pinia";
import Sr from "primevue/config";
import Tr from "primevue/contextmenu";
import Ar from "primevue/menu";
import Lr from "primevue/portal";
import G from "primevue/button";
import X from "primevue/column";
import at from "primevue/datatable";
import Lt from "primevue/iconfield";
import Et from "primevue/inputicon";
import Pe from "primevue/inputtext";
import je from "primevue/selectbutton";
import Se from "primevue/tag";
import Er from "primevue/accordion";
import Rr from "primevue/accordioncontent";
import zr from "primevue/accordionheader";
import Vr from "primevue/accordionpanel";
import Rt from "primevue/dialog";
import Ke from "primevue/select";
import Pr from "primevue/textarea";
import Ir from "primevue/drawer";
var Ye = "data-wippy-visible";
function ut(e) {
  const t = e.getAttribute(Ye);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var Mr = Object.defineProperty, zt = (e) => {
  throw TypeError(e);
}, Or = (e, t, r) => t in e ? Mr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, K = (e, t, r) => Or(e, typeof t != "symbol" ? t + "" : t, r), Vt = (e, t, r) => t.has(e) || zt("Cannot " + r), Dr = (e, t, r) => (Vt(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Nr = (e, t, r) => t.has(e) ? zt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), jr = (e, t, r, i) => (Vt(e, t, "write to private field"), t.set(e, r), r), Ur = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Hr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function mt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function Fr(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    if (r)
      for (const [i, n] of Object.entries(r)) {
        if ((i === "@light" || i === "@dark") && n && typeof n == "object") {
          for (const [a, c] of Object.entries(n)) {
            const d = typeof c == "string" ? mt(a) : null;
            d && t.add(d);
          }
          continue;
        }
        const p = typeof n == "string" ? mt(i) : null;
        p && t.add(p);
      }
  return [...t].sort();
}
function Br(e) {
  if (e.length === 0)
    return "";
  const t = e.map((r) => `  ${r}: inherit;`).join(`
`);
  return `${Hr} {
${t}
}`;
}
function Wr(e, t) {
  const r = Br(t);
  r && Pt(e, r, "@wippy-fe/css-variables-bridge");
}
function qr(e, t) {
  const i = (t ?? Ur).map(async (n) => {
    const p = xr[n];
    if (!p)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${n}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await kr(p);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${n}" (${p}):`, a), null;
    }
  });
  return Promise.all(i).then((n) => {
    for (const p of n) {
      if (!p)
        continue;
      const a = document.createElement("style");
      a.textContent = p, a.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(a);
    }
  });
}
function Kr(e, t) {
  const r = document.createElement("style");
  r.textContent = t, e.appendChild(r);
}
function Pt(e, t, r) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const n = new CSSStyleSheet();
    n.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, n];
    return;
  }
  const i = document.createElement("style");
  i.setAttribute("role", r), i.textContent = t, e.appendChild(i);
}
function Yr(e, t) {
  Pt(e, t, "@wippy-fe/custom-css");
}
function It(e) {
  return e.__wippyHost ?? null;
}
function Jr(e) {
  return e.replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function Gr(e, t, r) {
  switch (r.type) {
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
        return r.type === "array" && !Array.isArray(i) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: i };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function Be(e, t) {
  const r = {}, i = [];
  for (const [n, p] of Object.entries(t.properties)) {
    const a = e.getAttribute(n), c = Jr(n);
    if (a === null) {
      p.default !== void 0 && (r[c] = p.default);
      continue;
    }
    const d = Gr(n, a, p);
    d.error ? i.push(d.error) : r[c] = d.value;
  }
  return { props: r, errors: i };
}
var Qr = class {
  constructor(e, t) {
    K(this, "_props"), K(this, "_errors"), K(this, "_content"), K(this, "_hostVisibility"), K(this, "_propsListeners", /* @__PURE__ */ new Set()), K(this, "_contentListeners", /* @__PURE__ */ new Set()), K(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), K(this, "_disposed", !1), K(this, "_emitToDom"), K(this, "props"), K(this, "events"), K(this, "content"), K(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const r = this;
    this.props = {
      get value() {
        return r._props;
      },
      get errors() {
        return r._errors;
      },
      subscribe(i, n) {
        return r._subscribeProps(i, n);
      }
    }, this.events = {
      emit(i, n) {
        r._disposed || r._emitToDom(i, n);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return r._content;
      },
      subscribe(i, n) {
        return r._subscribeContent(i, n);
      }
    } : null, this.hostVisibility = {
      get value() {
        return r._hostVisibility;
      },
      subscribe(i, n) {
        return r._subscribeHostVisibility(i, n);
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
}, ze, Xr = class extends HTMLElement {
  constructor() {
    super(), K(this, "_internals"), K(this, "_contentObserver", null), K(this, "_initialized", !1), K(this, "_container", null), Nr(this, ze, null), K(this, "_attachment", 0), K(this, "_reactive", null), K(this, "_lastProps", null), K(this, "_lastErrors", []), K(this, "_lastContent", null), K(this, "_themeUnsub", null), K(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ut(this);
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
    return [.../* @__PURE__ */ new Set([...t, ...r, Ye])];
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
    return It(this);
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
      let r, i;
      if (this._lastProps !== null)
        r = this._lastProps, i = this._lastErrors;
      else {
        const p = Be(this, e.propsSchema);
        e.validateProps && p.errors.push(...e.validateProps(p.props)), r = p.props, i = p.errors, this._lastProps = r, this._lastErrors = i;
      }
      const n = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = n), this._reactive = new Qr(
        { props: r, errors: i, content: n, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const e = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const t = this.constructor.wippyConfig, r = this._initialized, i = Dr(this, ze) ?? jr(this, ze, this.shadowRoot ?? this.attachShadow({ mode: t.shadowMode ?? "open" }));
      let n;
      if (this._container)
        n = this._container;
      else {
        if (this.onInit(i), e !== this._attachment)
          return;
        t.inlineCss && Kr(i, t.inlineCss);
        try {
          const $ = dt?.theming, b = Fr(
            $?.global?.cssVariables,
            $?.children?.cssVariables
          );
          Wr(i, b);
        } catch {
        }
        if (t.customCss !== !1)
          try {
            const $ = dt?.theming, b = [$?.global?.customCSS, $?.children?.customCSS].filter(Boolean).join(`
`);
            b && Yr(i, b);
          } catch {
          }
        (t.hostCssKeys === void 0 || t.hostCssKeys.length > 0) && qr(i, t.hostCssKeys), n = document.createElement("div"), n.setAttribute("data-wippy-theme-root", "");
        const g = t.containerClasses ?? [];
        g.length > 0 && n.classList.add(...g), i.appendChild(n), this._container = n, yr(br);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = rt("@theme", (g) => this._applyTheme(g)));
      const { props: p, errors: a } = Be(this, t.propsSchema);
      t.validateProps && a.push(...t.validateProps(p));
      const c = p;
      this._lastProps = c, this._lastErrors = a;
      let d = null;
      if (t.contentTemplate && (d = this._extractContent(t.contentTemplate), this._lastContent = d, this._contentObserver = new MutationObserver(() => {
        const g = this._extractContent(t.contentTemplate);
        this._lastContent = g, this._reactive?.notifyContent(g), this.onContentChanged(g);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(i, n, c, a, d, r), e !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), r || (this._initialized = !0), this.onReady(), e === this._attachment && this.emitEvent("load");
    } catch (t) {
      if (e !== this._attachment || (this.onError(t), e !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(e = Ce.getThemeMode?.()) {
    Le(e, this), this._container && Le(e, this._container);
  }
  disconnectedCallback() {
    const e = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Le("auto", this), this._container && Le("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), e === this._attachment && (this.emitEvent("unload"), e === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(e, t, r) {
    if (t === r)
      return;
    if (e === Ye) {
      const c = this._hostVisible, d = ut(this);
      if (d === c)
        return;
      this._hostVisible = d, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(d, c), this.onHostVisibilityChanged(d, c));
      return;
    }
    const i = this.constructor.wippyConfig, { props: n, errors: p } = Be(this, i.propsSchema);
    i.validateProps && p.push(...i.validateProps(n));
    const a = n;
    this._lastProps = a, this._lastErrors = p, this._reactive?.notifyProps(a, p), this.onPropsChanged(a, p);
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
ze = /* @__PURE__ */ new WeakMap();
function Zr(e) {
  return e.__wippyHostBus ?? null;
}
function ea(e) {
  return e.dataset.wippyPanelId ?? null;
}
var ta = Object.defineProperty, ra = (e, t, r) => t in e ? ta(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, se = (e, t, r) => ra(e, typeof t != "symbol" ? t + "" : t, r);
function ft(e, t, r) {
  const i = e.createElement("div"), n = r ? t.failed : t.loading;
  i.dataset.lazyState = r ? "failed" : "loading", i.setAttribute("role", r ? "alert" : "status"), i.setAttribute("aria-label", n), i.style.cssText = "display:grid;place-items:center;text-align:center;";
  const p = t.surface === "page";
  if (i.style.cssText += p ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", r)
    i.style.color = "var(--p-danger-500, currentColor)", i.textContent = !p && t.iconOnly ? "⚠" : n, !p && t.iconOnly && (i.title = n);
  else {
    const a = e.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const c = e.createElement("span");
    c.dataset.wippySpinner = "", c.setAttribute("aria-hidden", "true"), c.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", c.style.fontSize = p ? "2rem" : "1em", i.append(a, c);
  }
  return i;
}
var Mt = /* @__PURE__ */ Symbol("wippy:emit"), Ot = /* @__PURE__ */ Symbol("wippy:props"), aa = /* @__PURE__ */ Symbol("wippy:props_error"), ia = /* @__PURE__ */ Symbol("wippy:content"), oa = /* @__PURE__ */ Symbol("wippy:panel-id"), sa = /* @__PURE__ */ Symbol("wippy:layout-bus"), na = /* @__PURE__ */ Symbol("wippy:host"), Dt = /* @__PURE__ */ Symbol("wippy:host-visibility");
function la() {
  const e = Ne(Ot);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function ca() {
  const e = Ne(Mt);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
function pa() {
  const e = Ne(Dt);
  if (!e)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return e;
}
function it(e) {
  const t = pa();
  let r = !1, i = null, n = !1;
  function p() {
    if (i)
      return n = !0, i;
    let a;
    try {
      a = Promise.resolve(e());
    } catch (d) {
      a = Promise.reject(d);
    }
    const c = a.finally(() => {
      if (i === c && (i = null, r && n))
        return n = !1, p();
    });
    return i = c, c;
  }
  return nr(() => (r = !0, p())), lr(() => {
    r = !1, n = !1;
  }), ie(t, (a, c) => {
    if (r && c === !1 && a === !0)
      return p();
  }), t;
}
var Ee = /* @__PURE__ */ new WeakMap();
function ht(e, t) {
  const r = Ee.get(e);
  if (r)
    return r;
  const i = Promise.resolve().then(t);
  return Ee.set(e, i), i.catch(() => {
    Ee.get(e) === i && Ee.delete(e);
  }), i;
}
var da = class extends Xr {
  constructor() {
    super(...arguments), se(this, "_vueApp", null), se(this, "_mountingApp", !1), se(this, "_mountState", "idle"), se(this, "_feedback", null), se(this, "_propsRef", C({})), se(this, "_errorsRef", C([])), se(this, "_contentRef", C(null)), se(this, "_hostVisibilityRef", C(null)), se(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const e = this.vueConfig;
    e.mountLifecycle && !e.rootComponent && e.lazyConfig && await ht(this, e.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(e, t, r, i, n, p) {
    const a = this.constructor, c = a.vueConfig, d = new AbortController();
    this._bridgeAbort = d;
    const g = () => !d.signal.aborted && this._bridgeAbort === d;
    this._mountState = "mounting", this._propsRef.value = r, this._errorsRef.value = i, this._contentRef.value = n ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const b of i)
      if (this.emitEvent("invalid", { message: b }), !g())
        return;
    this.reactive.props.subscribe((b, _) => {
      this._propsRef.value = b, this._errorsRef.value = [..._];
      for (const y of _)
        this.emitEvent("invalid", { message: y });
    }, { signal: d.signal }), this.reactive.content && this.reactive.content.subscribe((b) => {
      this._contentRef.value = b;
    }, { signal: d.signal }), this.reactive.hostVisibility.subscribe((b) => {
      this._hostVisibilityRef.value = b;
    }, { signal: d.signal });
    const $ = (b) => {
      if (!g())
        return;
      const _ = _r(), y = sr(b.rootComponent);
      let R = !1, P = !1, F, B;
      this._mountingApp = !0;
      try {
        const Y = Cr();
        if (b.piniaPlugins)
          for (const D of b.piniaPlugins)
            Y.use(D);
        y.use(Y);
        for (const D of b.plugins ?? [])
          y.use(D);
        if (y.provide(Ot, this._propsRef), y.provide(aa, this._errorsRef), y.provide(Mt, this.emitEvent.bind(this)), y.provide(ia, this._contentRef), y.provide(Dt, this._hostVisibilityRef), y.provide(oa, ea(this)), y.provide(sa, Zr(this)), y.provide(na, It(this)), b.providers?.(y, this), !g())
          return;
        if (B = y.config.errorHandler, c.mountLifecycle && (y.config.errorHandler = (D, O, N) => {
          P || (F = D), P = !0, B?.(D, O, N);
        }), y.mount(t), R = !0, P)
          throw F;
        g() && (this._vueApp = y);
      } finally {
        c.mountLifecycle && R && (y.config.errorHandler = B);
        try {
          R && (P || !g()) && y.unmount();
        } finally {
          $r(_), this._mountingApp = !1;
        }
      }
      c.mountLifecycle && queueMicrotask(() => {
        g() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (c.rootComponent) {
      if (this._mountingApp && c.mountLifecycle) {
        queueMicrotask(() => {
          try {
            $(c);
          } catch (b) {
            g() && (this._mountState = "failed", this.emitEvent("error", { message: b instanceof Error ? b.message : String(b), error: b }));
          }
        });
        return;
      }
      try {
        $(c);
      } catch (b) {
        if (g())
          throw this._mountState = "failed", b;
      }
    } else if (c.lazyConfig) {
      const b = t.ownerDocument, _ = c.lazyUi;
      _?.surface === "page" && (t.style.blockSize = "100%", t.style.minBlockSize = "0");
      let y = !1, R, P;
      const F = () => {
        clearTimeout(R), clearTimeout(P), this._feedback?.remove(), this._feedback = null;
      };
      d.signal.addEventListener("abort", F, { once: !0 });
      const B = () => {
        if (!g() || y)
          return;
        const N = _ ? ft(b, _, !1) : b.createElement("wippy-loading");
        N.setAttribute("no-bg", ""), this._feedback = N, t.appendChild(N);
      }, Y = (N) => {
        if (!g())
          return;
        y = !0, F(), this._mountState = "failed";
        const q = _?.failed ?? (N instanceof Error ? N.message : String(N)), J = _ ? ft(b, _, !0) : b.createElement("wippy-error");
        _ || (J.setAttribute("title", "Failed to load"), J.setAttribute("message", q)), this._feedback = J, t.appendChild(J), this.emitEvent("error", _ ? { message: q, error: N } : { message: q });
      }, D = _?.delay ?? (_?.surface === "compact" ? 200 : 0);
      D > 0 ? R = setTimeout(B, D) : B(), _ && (P = setTimeout(() => Y(new Error("The component did not load in time.")), _.timeout ?? 3e4)), (c.mountLifecycle ? ht(a, c.lazyConfig) : c.lazyConfig()).then((N) => {
        !g() || y || (y = !0, F(), $(N));
      }, (N) => {
        y || Y(N);
      }).catch(Y);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const e = this._vueApp;
    this._vueApp = null, e?.unmount();
  }
};
const ua = "data-wippy-overlay-layer";
function Nt() {
  return typeof window < "u" && typeof window.document < "u";
}
function jt() {
  return Nt() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function ma() {
  return jt() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const fa = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let ha = 0;
const Ie = /* @__PURE__ */ new WeakMap();
function vt(e, t) {
  const r = e.style;
  r.setProperty("position", "fixed", "important"), r.setProperty("inset", "auto", "important"), r.setProperty("margin", "0", "important"), r.setProperty("position-anchor", t), r.setProperty("position-area", "bottom span-right"), r.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), r.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), r.setProperty("max-width", "stretch", "important");
}
function va(e, t) {
  if (!fa.test(e.className))
    return;
  const r = e.style.cssText;
  vt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = r;
    return;
  }
  if (!Ie.has(e)) {
    const i = new MutationObserver(() => {
      const n = e.style;
      (n.top !== "auto" || n.left !== "auto" || n.margin !== "0px" || n.getPropertyPriority("top") !== "important" || n.getPropertyPriority("left") !== "important" || n.getPropertyPriority("margin") !== "important" || n.getPropertyPriority("min-width") !== "important" || n.maxWidth !== "stretch" || n.getPropertyPriority("max-width") !== "important") && vt(e, t);
    });
    i.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ie.set(e, i);
  }
}
function ot(e) {
  const t = Ie.get(e);
  t && (t.disconnect(), Ie.delete(e));
}
function ga(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function Je(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Me = /* @__PURE__ */ new Set(), st = /* @__PURE__ */ new WeakMap();
let gt = !1, Ge = !1;
const bt = ["w-theme-dark", "w-theme-light"], Re = "data-wippy-theme-root", Qe = /* @__PURE__ */ new WeakMap();
function ba(e) {
  const t = [];
  let r = e ? e.parentNode : null;
  for (; r && r.nodeType === 1; )
    t.push(r), r = r.parentNode;
  return t;
}
function ya(e, t, r) {
  const i = [...ba(t), r.host], n = () => {
    let a;
    for (const c of i) {
      if (bt.some((d) => c.classList.contains(d))) {
        a = c;
        break;
      }
      if (c.hasAttribute(Re))
        break;
    }
    for (const c of bt)
      e.classList.toggle(c, !!(a && a.classList.contains(c)));
    a ? e.setAttribute(Re, "") : e.removeAttribute(Re);
  };
  n();
  const p = new MutationObserver(n);
  for (const a of i)
    p.observe(a, { attributes: !0, attributeFilter: ["class", Re] });
  Qe.set(e, p);
}
function Ut(e) {
  Qe.get(e)?.disconnect(), Qe.delete(e);
}
function xa() {
  Ge = !1;
  for (const e of Me) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && ot(t);
      Me.delete(e), st.get(e)?.disconnect(), Ut(e);
      continue;
    }
    e.childElementCount > 0 && Je(e);
  }
}
function yt() {
  Ge || (Ge = !0, requestAnimationFrame(xa));
}
function ka(e) {
  const t = document.createElement("div");
  t.setAttribute(ua, "");
  const r = jt();
  if (t.style.cssText = r ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", r && t.setAttribute("popover", "manual"), e.appendChild(t), r) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Je(t);
  const i = new MutationObserver((n) => {
    const p = t.__wippyAnchorName;
    for (const a of n) {
      if (p)
        for (const c of Array.from(a.addedNodes))
          c instanceof HTMLElement && va(c, p);
      for (const c of Array.from(a.removedNodes))
        c instanceof HTMLElement && ot(c);
    }
    t.isConnected && t.childElementCount > 0 && Je(t);
  });
  return i.observe(t, { childList: !0 }), st.set(t, i), Me.add(t), gt || (gt = !0, window.addEventListener("scroll", yt, { capture: !0, passive: !0 }), window.addEventListener("resize", yt, { passive: !0 })), t;
}
function xt(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = ka(e.hostRoot), ya(e.layer, e.$el, e.hostRoot), ma())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++ha}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function kt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && ot(t);
    Me.delete(e.layer), st.get(e.layer)?.disconnect(), Ut(e.layer), e.layer.remove(), e.layer = null;
  }
}
let wt = !1;
function wa() {
  if (wt)
    return;
  const e = Ar;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const r = t.composedPath(), i = this.container && !r.includes(this.container), n = !(this.target && r.includes(this.target));
      this.overlayVisible && i && n ? this.hide() : !this.popup && i && n && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, wt = !0);
}
let _t = !1;
function _a() {
  if (_t)
    return;
  const e = Tr;
  !e.methods || typeof e.methods.bindOutsideClickListener != "function" || (e.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (t) => {
      const r = t.composedPath(), i = this.container && !r.includes(this.container), n = this.visible ? !(this.target && r.includes(this.target)) : !0;
      i && n && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, _t = !0);
}
let Ct = !1;
function Ca() {
  if (Ct)
    return;
  Ct = !0;
  const e = Lr;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Nt() && (this.hostRoot = ga(this.$el), this.mounted = !0, this.hostRoot && (this.inline || xt(this), this.$watch("inline", (t) => {
      t ? kt(this) : xt(this);
    })));
  }, e.render = function() {
    return this.inline ? ne(this.$slots, "default", { key: 0 }) : this.mounted ? cr(pr, { key: 1, to: this.resolvedTarget || document.body }, [
      ne(this.$slots, "default")
    ]) : S("", !0);
  }, e.unmounted = function() {
    kt(this);
  };
}
const $a = {
  install: (e) => {
    wa(), _a(), Ca(), e.use(Sr, { theme: "none" });
  }
}, Sa = '.kx-settings-shell.kx-shell{grid-template-columns:232px minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 232px;min-width:0;background:var(--p-content-background)}.kx-settings-list-rail .kx-railhead{min-height:53px}.kx-settings-list-rail .kx-rail-body{padding:8px 12px 12px}.kx-settings-rail-standalone{display:contents}.kx-settings-rail{flex:0 0 232px;min-width:0;overflow-y:auto;overflow-x:hidden;padding:16px 12px;display:flex;flex-direction:column;gap:14px;border-right:1px solid var(--p-content-border-color)}.kx-settings-rail-section{display:flex;flex-direction:column;gap:2px}.kx-settings-rail-group{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color);margin:2px 0 4px 10px}.kx-settings-rail-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:8px 10px;border:none;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;font-weight:500;color:var(--p-text-color);background:transparent;transition:background .15s,color .15s}.kx-settings-rail-item:hover:where(:not([aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-rail-item[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-rail-icon{flex:0 0 auto;width:18px;height:18px}.kx-settings-rail-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-rail-leading{display:contents}@media(max-width:640px){.kx-settings-rail{flex:0 0 auto;max-height:40%;flex-direction:row;flex-wrap:wrap;gap:6px;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-settings-rail-section{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}.kx-settings-rail-group{margin:0 6px 0 2px}.kx-settings-rail:not(.kx-settings-rail-framed) .kx-settings-rail-section{display:flex;flex:0 0 100%}}.kx-settings-list-rail .kx-settings-rail-framed{padding:0;border:0;overflow:visible}@media(max-width:760px){.kx-settings-shell.kx-shell{grid-template-columns:minmax(0,1fr)}.kx-rail.kx-settings-list-rail{flex:0 0 auto}.kx-settings-rail-framed{gap:8px}.kx-settings-rail-framed .kx-settings-rail-section{flex-flow:row wrap;gap:4px}.kx-settings-rail-framed .kx-settings-rail-group{flex-basis:100%}.kx-settings-rail-framed .kx-settings-rail-item{width:auto}}.kx-settings-list-rail .picker-search{flex:none;padding:8px 10px}.kx-settings-list-rail .picker-search-input{width:100%}.kx-settings-list-rail .picker-search-input::-webkit-search-cancel-button{display:none}.kx-settings-list-rail .picker-search-clear{position:absolute;right:0;top:0;height:100%}.kx-settings-list-rail .picker-search:has(.picker-search-clear) .picker-search-input{padding-inline-end:34px}.kx-settings-list-rail .picker-group{margin:0;padding:10px 6px 4px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--p-text-muted-color)}.kx-settings-list-rail .picker-list{margin:0;padding:0;list-style:none}.kx-settings-list-rail .picker-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:none;border-radius:var(--kx-radius-8);background:transparent;color:var(--p-text-color);cursor:pointer;text-align:left;transition:background .12s;font:inherit}.kx-settings-list-rail .picker-row:hover:where(:not(:disabled,[aria-current=true])){background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.kx-settings-list-rail .picker-row[aria-current=true]{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-settings-list-rail .picker-row:disabled{color:var(--p-text-muted-color);cursor:default}.kx-settings-list-rail .picker-name{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-settings-list-rail .picker-message{color:var(--p-text-muted-color);font-size:11.5px;line-height:1.3;padding:7px 10px}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus:not(:focus-visible){outline:none;box-shadow:none}:is(.kx-settings-rail-item,.kx-settings-list-rail .picker-row):focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:calc(-1 * var(--p-focus-ring-width, 2px));box-shadow:none}.system-section-head{display:flex;flex:none;flex-wrap:wrap;align-items:center;gap:12px;margin:0}.system-section-head-text{flex:1 1 180px;min-width:0}.system-section-head-text h1{margin:0;font-size:17px;font-weight:700;letter-spacing:-.2px;color:var(--p-text-color)}.system-section-head-text p{margin:2px 0 0;font-size:13px;color:var(--p-text-muted-color)}.system-section-head .kx-head-actions{justify-content:flex-end}.kx-disclosure-panel:has(>.kx-disclosure-toggle[aria-expanded=false]){border-bottom-width:0}.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active{display:grid;grid-template-rows:1fr;overflow:hidden;transition:grid-template-rows var(--p-form-field-transition-duration, .2s) ease-in-out}.kx-disclosure .kx-disclosure-motion-enter-from,.kx-disclosure .kx-disclosure-motion-leave-to{grid-template-rows:0fr}.kx-disclosure .kx-disclosure-content{min-height:0;overflow:hidden}@media(prefers-reduced-motion:reduce){.kx-disclosure .kx-disclosure-motion-enter-active,.kx-disclosure .kx-disclosure-motion-leave-active,.kx-disclosure .kx-disclosure-toggle{transition:none}}:root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-control-height-sm: 30px;--kx-rail-width: 264px;--kx-reading-measure: 880px;--kx-row-height: 32px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-shell{flex:1;min-height:0;display:grid;grid-template-columns:var(--kx-rail-width) minmax(0,1fr);background:var(--p-content-background)}.kx-rail{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--p-content-border-color);background:color-mix(in srgb,var(--p-text-color) 2.5%,var(--p-content-background))}.kx-rail-body{flex:1;min-height:0;overflow-y:auto;padding:4px 8px 12px}.kx-main{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.kx-main-scroll{flex:1;min-height:0;overflow-y:auto;padding:18px 28px 80px 24px;display:flex;flex-direction:column;gap:16px}@media(max-width:760px){.kx-shell{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto minmax(0,1fr)}.kx-rail{max-height:40vh;border-right:none;border-bottom:1px solid var(--p-content-border-color)}.kx-main-scroll{padding:20px 22px 64px}}.kx-railhead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 10px;border-bottom:1px solid var(--p-content-border-color)}.kx-railhead-title{font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railhead-title b{color:var(--p-text-muted-color);margin-left:4px;font-variant-numeric:tabular-nums}.kx-railhead-acts{display:flex;align-items:center;gap:2px}.kx-railsec+.kx-railsec{border-top:1px solid var(--p-content-border-color)}.kx-railsec-h{display:flex;align-items:center;gap:6px;width:100%;padding:9px 12px 7px;background:none;border:none;cursor:pointer;font:inherit;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--p-text-muted-color)}.kx-railsec-h:hover{color:var(--p-text-muted-color)}.kx-railsec-chev{width:13px;height:13px;flex:none;transition:transform .15s ease}.kx-railsec:not(.closed) .kx-railsec-chev{transform:rotate(90deg)}.kx-railsec-ic{width:14px;height:14px;flex:none}.kx-railsec-t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-railsec-h .count{margin-left:auto;color:var(--p-text-muted-color);font-variant-numeric:tabular-nums}.kx-railsec-b{padding:2px 0 8px}.kx-system-tabs.p-tabs{margin-bottom:0;flex:none;min-width:0;border-bottom:1px solid var(--p-content-border-color)}.kx-system-tabs .p-tablist-tab-list{padding-inline:var(--kickside-system-surface-gutter, 24px)}.kx-system-tab-count{padding-inline:6px;border-radius:999px;font-size:inherit;line-height:inherit;background:color-mix(in srgb,currentColor 10%,transparent);font-variant-numeric:tabular-nums}.kx-system-toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;min-height:58px;padding:12px var(--kickside-system-surface-gutter, 24px);color:var(--p-text-muted-color);font-size:12.5px}.kx-system-pane{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:auto}.kx-system-tools{grid-row:1;min-width:0}.kx-system-body{grid-row:2;min-width:0;min-height:0;overflow:auto}.kx-system-pane:has(>.kx-system-body>.kx-empty){grid-template-rows:minmax(120px,auto) minmax(0,1fr)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color)}.kx-err.inline{margin:12px 0 0}.kx-empty.kx-empty-spacious{padding:60px 24px;gap:9px}.kx-empty-spacious .kx-empty-ico{width:58px;height:58px;margin-bottom:5px}.kx-empty-spacious .kx-empty-ico svg{width:27px;height:27px}.kx-empty-spacious .kx-empty-title{font-size:14.5px}.kx-empty-spacious .kx-empty-sub{font-size:12.5px;max-width:360px;line-height:1.55}.kx-empty-ico.primary{background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);border:1px solid color-mix(in srgb,var(--p-primary-color) 28%,transparent)}.kx-empty-ico.muted{background:var(--kx-surface-2);color:color-mix(in srgb,var(--p-text-color) 45%,transparent);border:1px solid var(--p-content-border-color)}.kx-empty>.kx-empty-cta{margin-top:8px;padding-inline:16px}.kx-loading.kx-loading-centered{flex:1;display:grid;place-items:center;padding:64px 20px}.kx-loading-inner{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:13px}.kx-loading-inner svg{width:24px;height:24px}.kx-notice{display:flex;align-items:flex-start;gap:9px;padding:11px 14px;border-radius:var(--kx-radius-14);font-size:13px;line-height:1.5;background:var(--kx-surface-2);color:var(--p-text-muted-color)}.kx-notice svg{width:16px;height:16px;flex:none;margin-top:1px}.kx-notice.info svg{color:var(--p-primary-color)}.kx-notice.warn{background:color-mix(in srgb,var(--p-warn-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-warn-500) 30%,transparent)}.kx-notice.error{background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-danger-500) 30%,transparent)}.kx-notice.help{background:color-mix(in srgb,var(--p-help-500) 12%,transparent);color:var(--p-text-color);border:1px solid color-mix(in srgb,var(--p-help-500) 30%,transparent)}.kx-notice.warn svg{color:var(--p-warn-500)}.kx-notice.error svg{color:var(--p-danger-500)}.kx-notice.help svg{color:var(--p-help-500)}.kx-notice-action{margin-left:8px;padding:2px 10px;border-radius:var(--kx-radius-8);font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:inherit;border:1px solid currentColor}.kx-notice-action:hover:not(:disabled){background:color-mix(in srgb,currentColor 10%,transparent)}.kx-notice-action:disabled{opacity:.6;cursor:default}.kx-drawer-mask{position:fixed;inset:0;z-index:1000;display:flex;justify-content:flex-end;overflow:clip;background:color-mix(in srgb,var(--p-text-color) 32%,transparent);backdrop-filter:blur(2px)}.kx-drawer{width:min(560px,100%);min-width:0;box-sizing:border-box;height:100%;display:flex;flex-direction:column;background:var(--p-content-background);border-left:1px solid var(--p-content-border-color);box-shadow:-16px 0 50px -12px color-mix(in srgb,var(--p-text-color) 40%,transparent)}.kx-drawer-h{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--p-content-border-color);flex:none}.kx-drawer-title{display:inline-flex;align-items:center;gap:9px;font-size:15px;font-weight:700;color:var(--p-text-color)}.kx-drawer-title svg{width:18px;height:18px;color:var(--p-primary-color)}.kx-drawer-b{flex:1;min-height:0;overflow-y:auto;padding:20px 20px 36px}.kx-drawer-enter-active,.kx-drawer-leave-active{transition:opacity .22s ease}.kx-drawer-enter-active .kx-drawer,.kx-drawer-leave-active .kx-drawer{transition:transform .26s cubic-bezier(.4,0,.2,1)}.kx-drawer-enter-from,.kx-drawer-leave-to{opacity:0}.kx-drawer-enter-from .kx-drawer,.kx-drawer-leave-to .kx-drawer{transform:translate(100%)}.kx-modal-mask{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:20px;background:color-mix(in srgb,var(--p-text-color) 45%,transparent)}.kx-modal{width:min(460px,100%);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);overflow:hidden;box-shadow:0 20px 60px color-mix(in srgb,var(--p-text-color) 28%,transparent)}.kx-modal-h{display:flex;align-items:center;gap:11px;padding:14px 16px 4px}.kx-modal-h-ico{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:var(--kx-radius-14);background:var(--kx-surface-2);color:var(--p-text-muted-color)}.kx-modal.danger .kx-modal-h-ico{background:color-mix(in srgb,var(--p-danger-500) 14%,transparent);color:var(--p-danger-500)}.kx-modal-h-ico svg{width:17px;height:17px}.kx-modal-h-text{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}.kx-modal-h-title{font-size:14px;font-weight:700;color:var(--p-text-color)}.kx-modal-h-sub{font-size:12px;color:var(--p-text-muted-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-modal-body{padding:8px 16px 14px;font-size:13px;line-height:1.55;color:var(--p-text-muted-color)}.kx-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--p-content-border-color);background:var(--kx-surface-1)}.kx-modal-enter-active,.kx-modal-leave-active{transition:opacity .18s ease}.kx-modal-enter-from,.kx-modal-leave-to{opacity:0}.kx-modal-head-icon{width:38px;height:38px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-modal-head-icon svg{width:20px;height:20px}.kx-modal-head-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.kx-modal-head-title{font-size:15.5px;font-weight:700;color:var(--p-text-color);line-height:1.2}.kx-modal-head-sub{font-size:12.5px;font-weight:400;color:var(--p-text-muted-color);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}@supports (-moz-appearance:none){*{scrollbar-color:initial;scrollbar-width:initial}}:host{display:block;height:100%;min-height:0;color:var(--p-text-color);background:var(--p-content-background);font-family:var(--kx-font-body);font-size:13px;line-height:1.5}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}h1,h2,h3,p,dl,dd,ol,ul{margin:0}.mail-admin{height:100%}.mail-main>*{max-width:1120px}.mail-muted{color:var(--p-text-muted-color)}.mail-sub{display:block;margin-top:2px;font-size:12px;color:var(--p-text-muted-color)}.mail-sub.mail-inline{display:inline;margin:0}.mail-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p-text-muted-color)}.mail-block{margin:0}.mail-error{margin:0;display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-stack{display:flex;flex-direction:column;gap:20px}.mail-mono,.mail-mono-block,.mail-mono-input{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.mail-mono{font-size:12px;padding:1px 6px;border-radius:6px;background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.mail-mono-block,.mail-value{font-size:12px;overflow-wrap:anywhere}.mail-name,.mail-text-link,.mail-row-link{padding:0;border:0;background:none;font:inherit;color:inherit;cursor:pointer;text-align:left}.mail-name{font-weight:600;color:var(--p-text-color)}.mail-name:hover,.mail-text-link:hover{text-decoration:underline}.mail-text-link{color:var(--p-primary-color);font-weight:600}.mail-name:focus-visible,.mail-text-link:focus-visible,.mail-row-link:focus-visible{outline:var(--p-focus-ring-width, 2px) var(--p-focus-ring-style, solid) var(--p-focus-ring-color, currentColor);outline-offset:2px;border-radius:4px}.mail-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.mail-search{flex:0 1 260px;min-width:180px}.mail-search .p-inputtext{width:100%}.mail-filter{width:150px}.mail-count{margin-left:auto;font-size:12.5px;color:var(--p-text-muted-color);white-space:nowrap}.mail-nomatch{padding:8px 0}.mail-more{display:flex;justify-content:center}.mail-table .p-datatable-tbody>tr{cursor:pointer}.mail-table .p-datatable-tbody>tr>td{vertical-align:middle}.mail-col-name{min-width:260px}.mail-col-kind,.mail-col-status,.mail-col-when,.mail-col-updated,.mail-col-used{white-space:nowrap}.mail-col-source{min-width:170px}.mail-kind{display:inline-flex;align-items:center;gap:6px}.mail-kind svg{width:16px;height:16px;color:var(--p-text-muted-color)}.mail-source{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px}.mail-required{margin-left:6px}.mail-card{padding:16px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-facts{display:grid;grid-template-columns:minmax(120px,max-content) minmax(0,1fr);gap:8px 20px}.mail-facts dt{color:var(--p-text-muted-color)}.mail-facts dd{min-width:0;overflow-wrap:anywhere}.mail-customized{align-items:center}.mail-customized-text{flex:1;min-width:0}.mail-source-faces{display:flex;flex-direction:column;gap:8px}.mail-face-bar{display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-code{margin:0;padding:12px 0;max-height:560px;overflow:auto;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.6;color:var(--p-text-color);background:var(--p-content-background)}.mail-code code{display:block;min-width:max-content}.mail-code-line{display:flex}.mail-code-number{flex:none;width:44px;padding-right:12px;text-align:right;color:var(--p-text-muted-color);user-select:none}.mail-code-text{white-space:pre;padding-right:16px}.mail-group{display:flex;flex-direction:column;gap:8px}.mail-group-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mail-list{list-style:none;padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-list>li{border-bottom:1px solid var(--p-content-border-color)}.mail-list>li:last-child{border-bottom:0}.mail-row-link,.mail-list-row{display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px}.mail-row-link:hover{background:color-mix(in srgb,var(--p-text-color) 7%,transparent)}.mail-row-link svg,.mail-list-row svg{width:18px;height:18px;flex:none;color:var(--p-text-muted-color)}.mail-list-main{flex:1;min-width:0}.mail-history{list-style:none;padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.mail-history-row{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-bottom:1px solid var(--p-content-border-color)}.mail-history-row:last-child{border-bottom:0}.mail-history-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.mail-history-main{display:flex;flex-direction:column;min-width:0}.mail-history-title{display:inline-flex;align-items:center;gap:8px;font-weight:600}.mail-history-note{margin-top:4px}.mail-history-row .mail-facts{margin-bottom:12px}.mail-dialog{width:min(520px,calc(100vw - 32px))}.mail-dialog .mail-dialog-header{display:flex;align-items:center;gap:12px}.mail-dialog .mail-dialog-footer{display:flex;justify-content:flex-end;gap:8px}.mail-head-warn{background:color-mix(in srgb,var(--p-warn-500) 14%,transparent);color:var(--p-warn-500)}.mail-dialog-text{margin-bottom:12px}.mail-form,.mail-fieldset{display:flex;flex-direction:column;gap:14px}.mail-fieldset{border:0;padding:0;margin:0;min-width:0}.mail-field{display:flex;flex-direction:column;gap:6px}.mail-field>.p-inputtext,.mail-field>.p-select,.mail-field>.p-textarea{width:100%}.mail-field-label{font-size:12px;font-weight:600;color:var(--p-text-color)}.mail-field-hint{font-size:12px;color:var(--p-text-muted-color)}.mail-field-error{font-size:12px;color:var(--p-danger-500)}.mail-field-invalid{margin-inline:-8px;padding:6px 8px;border-radius:var(--kx-radius-8);background:color-mix(in srgb,var(--p-danger-500) 5%,transparent)}.mail-drawer-body{display:flex;flex-direction:column;gap:16px}.mail-drawer-head{display:flex;align-items:flex-start;gap:4px}.mail-drawer-title{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:6px}.mail-drawer-title h2{font-size:16px;font-weight:700;overflow-wrap:anywhere}.mail-failure-body{display:flex;flex-direction:column;gap:8px;min-width:0}.mail-failure-done{display:flex;flex-wrap:wrap;gap:6px}.mail-timeline{list-style:none;padding:0;display:flex;flex-direction:column;gap:6px}.mail-timeline li{display:flex;justify-content:space-between;gap:12px}';
function Ta(e, t) {
  return class extends da {
    static get wippyConfig() {
      return { propsSchema: t, hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"], inlineCss: Sa };
    }
    static get vueConfig() {
      return { rootComponent: e, plugins: [$a] };
    }
  };
}
const Aa = ["aria-labelledby"], La = { class: "kx-railhead" }, Ea = ["id"], Ra = { key: 0 }, za = { class: "kx-railhead-acts" }, Va = { class: "kx-rail-body" }, Pa = /* @__PURE__ */ Q({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const t = ue();
    return (r, i) => (l(), u("aside", {
      class: ge(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": o(t)
    }, [
      s("div", La, [
        s("span", {
          id: o(t),
          class: "kx-railhead-title"
        }, [
          W(h(e.title), 1),
          e.count !== void 0 ? (l(), u("b", Ra, h(e.count), 1)) : S("", !0)
        ], 8, Ea),
        s("div", za, [
          ne(r.$slots, "actions")
        ])
      ]),
      ne(r.$slots, "toolbar"),
      s("div", Va, [
        ne(r.$slots, "default")
      ])
    ], 10, Aa));
  }
}), Ia = ["aria-label"], Ma = {
  key: 0,
  class: "kx-settings-rail-group"
}, Oa = ["aria-current", "onClick"], Da = { class: "kx-settings-rail-label" }, Na = /* @__PURE__ */ Q({
  __name: "SettingsRail",
  props: {
    label: {},
    title: {},
    count: {},
    value: {},
    groups: {},
    leadingItem: {}
  },
  emits: ["update:value"],
  setup(e) {
    const t = e, r = V(() => t.leadingItem ? [{ items: [t.leadingItem] }, ...t.groups] : t.groups);
    function i(n) {
      const p = [...n.currentTarget.querySelectorAll(".kx-settings-rail-item")], a = p.indexOf(n.target);
      if (a < 0) return;
      let c;
      switch (n.key) {
        case "ArrowDown":
        case "ArrowRight":
          c = (a + 1) % p.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          c = (a + p.length - 1) % p.length;
          break;
        case "Home":
          c = 0;
          break;
        case "End":
          c = p.length - 1;
          break;
        default:
          return;
      }
      n.preventDefault(), p[c]?.focus();
    }
    return (n, p) => (l(), U(dr(e.title ? Pa : "div"), ur(mr(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), et({
      default: A(() => [
        s("nav", {
          class: ge(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: i
        }, [
          (l(!0), u(H, null, ce(r.value, (a, c) => (l(), u("div", {
            key: a.items[0]?.value ?? c,
            class: ge(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && c === 0 }])
          }, [
            a.heading ? (l(), u("div", Ma, h(a.heading), 1)) : S("", !0),
            (l(!0), u(H, null, ce(a.items, (d) => (l(), u("button", {
              key: d.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": d.value === e.value ? "true" : void 0,
              onClick: (g) => n.$emit("update:value", d.value)
            }, [
              d.icon ? (l(), U(o(I), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: d.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", Da, h(d.label), 1)
            ], 8, Oa))), 128))
          ], 2))), 128))
        ], 42, Ia)
      ]),
      _: 2
    }, [
      e.title && n.$slots.actions ? {
        name: "actions",
        fn: A(() => [
          ne(n.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), ja = /* @__PURE__ */ Q({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(e) {
    return (t, r) => (l(), u(H, null, [
      m(o(G), {
        type: "button",
        text: "",
        "aria-label": e.createLabel,
        title: e.createLabel,
        onClick: r[0] || (r[0] = (i) => t.$emit("create"))
      }, {
        icon: A(() => [
          m(o(I), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      m(o(G), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: r[1] || (r[1] = (i) => t.$emit("defaults"))
      }, {
        icon: A(() => [
          m(o(I), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
});
class de extends Error {
  constructor(t, r, i) {
    super(t.message ?? t.error ?? `${r} failed`), this.name = "ApiError", this.kind = t.kind, this.details = t.details, this.retryable = t.retryable, this.status = i;
  }
}
function Ve(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ht(e, t, r) {
  return new de({
    message: typeof e.message == "string" ? e.message : void 0,
    error: typeof e.error == "string" ? e.error : void 0,
    kind: typeof e.kind == "string" ? e.kind : void 0,
    details: Ve(e.details) ? e.details : void 0,
    retryable: typeof e.retryable == "boolean" ? e.retryable : void 0
  }, t, r);
}
function Ua(e, t) {
  if (e instanceof de) return e;
  if (Ve(e) && Ve(e.response) && Ve(e.response.data)) {
    const { data: r, status: i } = e.response;
    return Ht(r, t, typeof i == "number" ? i : void 0);
  }
  return e instanceof Error ? e : new de({ kind: "UNAVAILABLE" }, t);
}
async function re(e, t) {
  let r;
  try {
    r = (await e()).data;
  } catch (i) {
    throw Ua(i, t);
  }
  if (r?.success === !0 && r.data !== void 0) return r.data;
  throw r?.success === !1 ? Ht(r, t) : new de({ kind: "INTERNAL", message: `${t}: invalid response envelope`, details: { code: "response_envelope_invalid" } }, t);
}
const fe = "/api/v1/mail", _e = (e) => `${fe}/library/${e.kind}/${encodeURIComponent(e.name)}`;
function Ft(e) {
  const t = {};
  for (const [r, i] of Object.entries(e)) i !== void 0 && i !== "" && (t[r] = String(i));
  return t;
}
const me = {
  list: (e = {}) => re(() => ee.get(`${fe}/library`, { params: Ft({ ...e }) }), "Mail library").then((t) => t.items),
  get: (e) => re(() => ee.get(_e(e)), "Mail resource"),
  history: (e) => re(() => ee.get(`${_e(e)}/history`), "Resource history").then((t) => t.items),
  create: (e) => re(() => ee.post(`${fe}/library`, e), "Create resource"),
  reset: (e, t) => re(() => ee.post(`${_e(e)}/reset`, { expected_revision: t }), "Reset resource"),
  restore: (e, t, r) => re(() => ee.post(`${_e(e)}/restore`, { revision: t, expected_revision: r }), "Restore revision"),
  remove: (e, t) => re(() => ee.delete(_e(e), { data: { expected_revision: t } }), "Delete resource")
}, $e = {
  list: (e) => re(() => ee.get(`${fe}/activity`, { params: Ft({ limit: 50, ...e }) }), "Mail activity"),
  get: (e) => re(() => ee.get(`${fe}/activity/${encodeURIComponent(e)}`), "Mail message"),
  resend: (e) => re(() => ee.post(`${fe}/activity/${encodeURIComponent(e)}/resend`, {}), "Send again")
}, Ha = {
  status: () => re(() => ee.get(`${fe}/delivery`), "Delivery status")
};
function Oe(e) {
  if (!(e instanceof de)) return;
  const t = e.details?.code;
  return typeof t == "string" ? t : void 0;
}
function Te(e) {
  return e instanceof de && (e.status === 403 || e.kind === "PERMISSION_DENIED");
}
function Xe(e) {
  return e instanceof de && (e.status === 404 || e.kind === "NOT_FOUND");
}
const Bt = Symbol("mail-admin");
function xe() {
  const e = Ne(Bt);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
const ae = { message: "Message", base: "Base template", part: "Part" }, nt = { message: "Messages", base: "Base templates", part: "Parts" }, pe = { message: "tabler:mail", base: "tabler:layout", part: "tabler:puzzle" }, Wt = { queued: "Pending", sent: "Sent", failed: "Failed" }, qt = { queued: "secondary", sent: "success", failed: "danger" }, Fa = {
  workflow: "Workflow",
  automation: "Automation",
  agent: "Agent",
  module: "Module",
  test: "Test send"
};
function Ue(e) {
  if (!e) return "";
  const t = Fa[e.kind] ?? e.kind;
  return e.label ? `${t} · ${e.label}` : t;
}
const Kt = 1440 * 60 * 1e3, Yt = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }), Jt = new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric", year: "numeric" }), Ba = new Intl.DateTimeFormat(void 0, { hour: "2-digit", minute: "2-digit" }), Wa = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function lt(e) {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t.getTime();
}
function Gt(e, t = Date.now()) {
  if (!e) return "—";
  const r = lt(t);
  return e >= r ? "Today" : e >= r - Kt ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? Yt.format(e) : Jt.format(e);
}
function qa(e, t = Date.now()) {
  const r = Gt(e, t);
  return r === "Today" || r === "Yesterday" ? r.toLowerCase() : "on " + r;
}
function Ka(e, t = Date.now()) {
  const r = lt(t);
  return e >= r ? Ba.format(e) : e >= r - Kt ? "Yesterday" : new Date(e).getFullYear() === new Date(t).getFullYear() ? Yt.format(e) : Jt.format(e);
}
function De(e) {
  return e ? Wa.format(e) : "—";
}
function Ya(e = Date.now()) {
  return lt(e);
}
function Ja(e) {
  return e.length ? e.length === 1 ? `To ${e[0]}` : `To ${e[0]} +${e.length - 1}` : "";
}
function he(e, t, r = t + "s") {
  return `${e} ${e === 1 ? t : r}`;
}
const We = {
  mail_revision_conflict: "Someone saved this resource while you were looking at it. The latest version is shown now; review it and try again.",
  mail_resource_not_found: "This resource no longer exists.",
  mail_revision_not_found: "That version is no longer in History.",
  mail_resource_is_shipped: "An included resource cannot be deleted. Reset it to the original instead.",
  mail_resource_not_customized: "This resource already matches the original.",
  mail_library_denied: "Ask an administrator to grant you access to the mail library.",
  mail_delivery_denied: "Ask an administrator to grant you access to mail delivery.",
  mail_send_denied: "Ask an administrator to grant you permission to send mail.",
  mail_content_unavailable: "This message can no longer be sent again because its content was not kept.",
  mail_projection_failed: "The change was saved, but email is still using the previous version. Try again in a moment.",
  duplicate_template_name: "Two installed modules include a resource with this name. Ask an administrator to remove one of them.",
  mail_resource_collision: "An installed module now includes a resource with this name. Rename yours to keep both."
};
function le(e, t) {
  if (!(e instanceof de) || e.status === void 0) return `${t} Check your connection and try again.`;
  const r = Oe(e);
  return r && We[r] ? We[r] : e.status === 403 ? We.mail_library_denied : e.status >= 500 ? `${t} Try again in a moment.` : e.message || t;
}
function Ga(e) {
  return e.trim().toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}
const Qa = /^[a-z0-9][a-z0-9_-]*$/;
function ye() {
  let e = 0;
  return () => {
    const t = ++e;
    return () => t === e;
  };
}
const Qt = fr(/* @__PURE__ */ new Map()), qe = /* @__PURE__ */ new Set();
async function ve(e) {
  const t = [...new Set(e.filter((r) => !!r && !qe.has(r)))];
  for (const r of t) qe.add(r);
  for (let r = 0; r < t.length; r += 50) {
    const i = t.slice(r, r + 50);
    try {
      const { data: n } = await ee.post("/api/v1/principals/resolve", { refs: i.map((a) => ({ type: "user", id: a })) }), p = n?.success && Array.isArray(n.principals) ? n.principals : [];
      for (const a of p) i.includes(a.id) && a.label && a.label !== a.id && Qt.set(a.id, a.label);
    } catch {
      for (const n of i) qe.delete(n);
    }
  }
}
function ke(e) {
  return e ? Qt.get(e) ?? e : "";
}
function $t(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Xt(e) {
  return $t(e) ? $t(e.data) ? e.data : e : {};
}
function Xa(e) {
  const t = Xt(e);
  if ((t.kind === "message" || t.kind === "base" || t.kind === "part") && typeof t.name == "string" && typeof t.revision == "number")
    return { kind: t.kind, name: t.name, revision: t.revision };
}
function Za(e) {
  const t = Xt(e);
  if (typeof t.message_id == "string" && (t.status === "queued" || t.status === "sent" || t.status === "failed"))
    return { message_id: t.message_id, status: t.status };
}
function Zt(e) {
  const t = rt("mail.library.changed", (r) => {
    const i = Xa(r);
    i && e(i);
  });
  At(() => {
    typeof t == "function" && t();
  });
}
function er(e) {
  const t = rt("mail.message.changed", (r) => {
    const i = Za(r);
    i && e(i);
  });
  At(() => {
    typeof t == "function" && t();
  });
}
function ei() {
  const e = be([]), t = C(!0), r = C(!1), i = C(!1), n = C(""), p = ye();
  async function a() {
    const $ = p();
    r.value || (t.value = !0);
    try {
      const b = await me.list();
      if (!$()) return;
      e.value = b, n.value = "", i.value = !1, r.value = !0, ve(b.map((_) => _.author));
    } catch (b) {
      if (!$()) return;
      i.value = Te(b), n.value = i.value ? "" : le(b, "The mail library could not be loaded.");
    } finally {
      $() && (t.value = !1);
    }
  }
  Zt(() => {
    a();
  }), it(a);
  const c = V(() => new Map(e.value.map(($) => [$.kind + "/" + $.name, $]))), d = V(() => {
    const $ = /* @__PURE__ */ new Map();
    for (const b of e.value) {
      if (b.kind !== "message" || !b.base) continue;
      const _ = $.get(b.base) ?? [];
      _.push(b.name), $.set(b.base, _);
    }
    return $;
  });
  return { resources: e, loading: t, loaded: r, denied: i, error: n, load: a, find: ($, b) => c.value.get($ + "/" + b), usage: d };
}
function ti(e, t) {
  const r = t.trim().toLowerCase();
  return r ? [e.title, e.name, e.description, e.subject ?? "", e.html, e.text].some((i) => i.toLowerCase().includes(r)) : !0;
}
const ri = { class: "kx-empty" }, ai = { class: "kx-empty-ico" }, ii = { class: "kx-empty-title" }, oi = {
  key: 0,
  class: "kx-empty-sub"
}, ct = /* @__PURE__ */ Q({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(e) {
    return (t, r) => (l(), u("div", ri, [
      s("div", ai, [
        m(o(I), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      s("div", ii, h(e.title), 1),
      e.hint || t.$slots.hint ? (l(), u("p", oi, [
        ne(t.$slots, "hint", {}, () => [
          W(h(e.hint), 1)
        ])
      ])) : S("", !0),
      e.cta ? (l(), U(o(G), {
        key: 1,
        label: e.cta,
        onClick: r[0] || (r[0] = (i) => t.$emit("cta"))
      }, et({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: A(({ class: i }) => [
            m(o(I), {
              icon: e.ctaIcon,
              class: ge(i),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : S("", !0)
    ]));
  }
}), si = { class: "system-section-head" }, ni = { class: "system-section-head-text" }, li = {
  key: 0,
  class: "kx-head-actions"
}, He = /* @__PURE__ */ Q({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (t, r) => (l(), u("header", si, [
      s("div", ni, [
        s("h1", null, h(e.title), 1),
        s("p", null, h(e.description), 1)
      ]),
      t.$slots.actions ? (l(), u("div", li, [
        ne(t.$slots, "actions")
      ])) : S("", !0)
    ]));
  }
}), pt = {
  message: "messages",
  base: "bases",
  part: "parts"
}, tr = Object.fromEntries(Object.entries(pt).map(([e, t]) => [t, e])), ci = ["content", "variables", "used-by", "history"];
function Ze(e) {
  return pt[e];
}
function pi(e) {
  return tr[e];
}
function rr(e) {
  return e === "base" ? ["content", "used-by", "history"] : ci;
}
function St(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "all" ? "" : e.section : `${pt[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Tt(e) {
  const t = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [r, i, n] = t;
  if (!r) return { name: "library", section: "all" };
  try {
    if (r === "activity")
      return i === "template" && n ? { name: "activity", template: decodeURIComponent(n) } : i ? { name: "activity", message: decodeURIComponent(i) } : { name: "activity" };
    if (r === "assets") return { name: "library", section: "assets" };
    const p = tr[r];
    if (!p) return { name: "library", section: "all" };
    if (!i) return { name: "library", section: r };
    const c = rr(p).find((d) => d === n) ?? "content";
    return { name: "resource", kind: p, resource: decodeURIComponent(i), section: c };
  } catch {
    return { name: "library", section: "all" };
  }
}
const di = { class: "mail-source" }, ui = /* @__PURE__ */ Q({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (t, r) => (l(), u("span", di, [
      s("span", null, h(e.resource.state === "created" ? "Created by " + o(ke)(e.resource.author) : "Included"), 1),
      e.resource.state === "customized" ? (l(), U(o(Se), {
        key: 0,
        severity: "info",
        value: "Customized",
        class: "kx-tag-sm"
      })) : S("", !0)
    ]));
  }
}), mi = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, fi = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, hi = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, vi = { class: "mail-toolbar" }, gi = {
  class: "mail-count",
  role: "status"
}, bi = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, yi = ["onClick"], xi = {
  key: 0,
  class: "mail-sub"
}, ki = { class: "mail-kind" }, wi = { class: "mail-sub mail-inline" }, _i = { class: "mail-muted" }, Ci = /* @__PURE__ */ Q({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const t = e, { library: r, go: i, create: n } = xe(), { resources: p, loading: a, loaded: c, denied: d, error: g, load: $, find: b, usage: _ } = r, y = V(() => pi(t.section)), R = C("all"), P = C("");
    ie(() => t.section, () => {
      P.value = "", R.value = "all";
    });
    const F = V(() => {
      switch (y.value) {
        case "message":
          return { title: "Messages", description: "What recipients read. Each message follows its base template." };
        case "base":
          return { title: "Base templates", description: "The frame around messages. New messages start with the default." };
        case "part":
          return { title: "Parts", description: "Reusable pieces that templates include, such as the header, footer and buttons." };
        default:
          return { title: "All resources", description: "Everything your email is made of. Messages follow the base templates and parts they use." };
      }
    }), B = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], Y = { base: 0, part: 1, message: 2 }, D = V(() => p.value.filter((T) => !y.value || T.kind === y.value)), O = V(() => D.value.filter((T) => R.value === "all" || T.state === R.value).filter((T) => ti(T, P.value)).sort((T, L) => Y[T.kind] - Y[L.kind] || T.title.localeCompare(L.title))), N = V(() => {
      const T = y.value ? ae[y.value].toLowerCase() : "resource";
      return he(O.value.length, T);
    });
    function q(T) {
      if (T.kind !== "base") return "";
      const L = _.value.get(T.name)?.length ?? 0;
      return L ? he(L, "message") : "—";
    }
    function J(T) {
      return T.base ? b("base", T.base)?.title ?? T.base : "";
    }
    function f(T) {
      const L = Object.keys(T.schema.properties);
      return L.length ? L.join(", ") : "—";
    }
    function v(T) {
      i({ name: "resource", kind: T.kind, resource: T.name, section: "content" });
    }
    const w = V(() => c.value && !g.value && y.value && !D.value.length);
    return (T, L) => (l(), u(H, null, [
      m(He, {
        title: F.value.title,
        description: F.value.description
      }, {
        actions: A(() => [
          m(o(G), {
            label: y.value ? "New " + o(ae)[y.value].toLowerCase() : "New",
            onClick: L[0] || (L[0] = (M) => o(n)({ kind: y.value }))
          }, {
            icon: A(() => [
              m(o(I), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      o(d) ? (l(), u("p", mi, [
        m(o(I), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        L[6] || (L[6] = W("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : o(g) ? (l(), u("div", fi, [
        s("span", null, h(o(g)), 1),
        m(o(G), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: L[1] || (L[1] = (M) => o($)())
        })
      ])) : o(a) && !o(c) ? (l(), u("p", hi, [
        m(o(I), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        L[7] || (L[7] = W("Loading mail library…", -1))
      ])) : w.value && y.value ? (l(), U(ct, {
        key: 3,
        icon: o(pe)[y.value],
        title: "No " + o(nt)[y.value].toLowerCase() + " yet",
        hint: "Create a " + o(ae)[y.value].toLowerCase() + " from an existing one, then change it to suit.",
        cta: "New " + o(ae)[y.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: L[2] || (L[2] = (M) => o(n)({ kind: y.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : o(c) ? (l(), u(H, { key: 4 }, [
        s("div", vi, [
          m(o(je), {
            modelValue: R.value,
            "onUpdate:modelValue": L[3] || (L[3] = (M) => R.value = M),
            options: B,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          m(o(Lt), { class: "mail-search" }, {
            default: A(() => [
              m(o(Et), null, {
                default: A(() => [
                  m(o(I), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              m(o(Pe), {
                modelValue: P.value,
                "onUpdate:modelValue": L[4] || (L[4] = (M) => P.value = M),
                type: "search",
                "aria-label": "Search " + F.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          s("span", gi, h(N.value), 1)
        ]),
        O.value.length ? (l(), U(o(at), {
          key: 1,
          value: O.value,
          "data-key": (M) => M.kind + "/" + M.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": F.value.title } },
          onRowClick: L[5] || (L[5] = (M) => v(M.data))
        }, {
          default: A(() => [
            m(o(X), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: M }) => [
                s("button", {
                  type: "button",
                  class: "mail-name",
                  onClick: tt((we) => v(M), ["stop"])
                }, h(M.title), 9, yi),
                M.description ? (l(), u("span", xi, h(M.description), 1)) : S("", !0)
              ]),
              _: 1
            }),
            y.value ? S("", !0) : (l(), U(o(X), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: A(({ data: M }) => [
                s("span", ki, [
                  m(o(I), {
                    icon: o(pe)[M.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  W(h(o(ae)[M.kind]), 1)
                ])
              ]),
              _: 1
            })),
            y.value === "message" ? (l(), U(o(X), {
              key: 1,
              header: "Base template"
            }, {
              body: A(({ data: M }) => [
                W(h(J(M)), 1)
              ]),
              _: 1
            })) : S("", !0),
            y.value === "part" ? (l(), U(o(X), {
              key: 2,
              header: "Inputs"
            }, {
              body: A(({ data: M }) => [
                s("span", wi, h(f(M)), 1)
              ]),
              _: 1
            })) : S("", !0),
            m(o(X), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: M }) => [
                m(ui, { resource: M }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            !y.value || y.value === "base" ? (l(), U(o(X), {
              key: 3,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: M }) => [
                W(h(q(M)), 1)
              ]),
              _: 1
            })) : S("", !0),
            m(o(X), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: M }) => [
                s("span", _i, h(M.state === "original" ? "—" : o(Gt)(M.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), u("p", bi, "Nothing matches. Try another name or a word from the template."))
      ], 64)) : S("", !0)
    ], 64));
  }
}), ar = /* @__PURE__ */ Q({
  __name: "Disclosure",
  props: /* @__PURE__ */ vr({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = hr(e, "open");
    return (r, i) => (l(), U(o(Er), {
      class: "kx-disclosure",
      value: t.value ? "content" : void 0,
      "onUpdate:value": i[0] || (i[0] = (n) => t.value = n === "content")
    }, {
      default: A(() => [
        m(o(Vr), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: A(() => [
            m(o(zr), { class: "kx-disclosure-toggle" }, {
              default: A(() => [
                W(h(e.label), 1)
              ]),
              _: 1
            }),
            m(o(Rr), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: A(() => [
                ne(r.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
}), $i = ["aria-labelledby"], Si = { class: "mail-face-bar" }, Ti = ["id"], Ai = ["aria-label"], Li = {
  class: "mail-code-number",
  "aria-hidden": "true"
}, Ei = { class: "mail-code-text" }, ir = /* @__PURE__ */ Q({
  __name: "SourceFaces",
  props: {
    html: {},
    text: {},
    label: {}
  },
  setup(e) {
    const t = e, r = C("html"), i = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], n = V(() => r.value === "html" ? t.html : t.text), p = V(() => n.value.split(`
`)), a = ue();
    return (c, d) => (l(), u("section", {
      class: "mail-source-faces",
      "aria-labelledby": o(a)
    }, [
      s("div", Si, [
        s("h2", {
          id: o(a),
          class: "mail-label"
        }, h(e.label), 9, Ti),
        m(o(je), {
          modelValue: r.value,
          "onUpdate:modelValue": d[0] || (d[0] = (g) => r.value = g),
          options: i,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": e.label + " version"
        }, null, 8, ["modelValue", "aria-label"])
      ]),
      s("pre", {
        class: "mail-code",
        tabindex: "0",
        "aria-label": e.label + (r.value === "html" ? ", HTML" : ", plain text")
      }, [
        s("code", null, [
          (l(!0), u(H, null, ce(p.value, (g, $) => (l(), u("span", {
            key: $,
            class: "mail-code-line"
          }, [
            s("span", Li, h($ + 1), 1),
            s("span", Ei, h(g), 1),
            d[1] || (d[1] = W(`
`, -1))
          ]))), 128))
        ])
      ], 8, Ai)
    ], 8, $i));
  }
}), Ri = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, zi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Vi = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Pi = {
  key: 3,
  class: "mail-history"
}, Ii = { class: "mail-history-head" }, Mi = { class: "mail-history-main" }, Oi = { class: "mail-history-title" }, Di = { class: "mail-sub" }, Ni = { class: "mail-facts" }, ji = { class: "mail-mono-block" }, Ui = /* @__PURE__ */ Q({
  __name: "HistoryList",
  props: {
    resource: {},
    revisions: {},
    loading: { type: Boolean },
    error: {},
    busy: {}
  },
  emits: ["restore", "retry"],
  setup(e) {
    return (t, r) => e.error ? (l(), u("div", Ri, [
      s("span", null, h(e.error), 1),
      m(o(G), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: r[0] || (r[0] = (i) => t.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (l(), u("p", zi, [
      m(o(I), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      r[1] || (r[1] = W("Loading history…", -1))
    ])) : e.revisions.length ? (l(), u("ol", Pi, [
      (l(!0), u(H, null, ce(e.revisions, (i) => (l(), u("li", {
        key: i.revision,
        class: "mail-history-row"
      }, [
        s("div", Ii, [
          s("div", Mi, [
            s("span", Oi, [
              W(h(i.note || "Saved without a note") + " ", 1),
              i.revision === e.resource.revision ? (l(), U(o(Se), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : S("", !0)
            ]),
            s("span", Di, h(o(ke)(i.author)) + " · " + h(o(De)(i.created_at)), 1)
          ]),
          i.revision !== e.resource.revision ? (l(), U(o(G), {
            key: 0,
            label: "Restore this version",
            severity: "secondary",
            outlined: "",
            size: "small",
            loading: e.busy === i.revision,
            disabled: e.busy !== void 0,
            onClick: (n) => t.$emit("restore", i)
          }, {
            icon: A(() => [
              m(o(I), {
                icon: "tabler:restore",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
        ]),
        m(ar, { label: "Show this version" }, {
          default: A(() => [
            s("dl", Ni, [
              i.content.subject !== void 0 ? (l(), u(H, { key: 0 }, [
                r[2] || (r[2] = s("dt", null, "Subject", -1)),
                s("dd", ji, h(i.content.subject), 1)
              ], 64)) : S("", !0),
              r[3] || (r[3] = s("dt", null, "Title", -1)),
              s("dd", null, h(i.content.title), 1)
            ]),
            m(ir, {
              html: i.content.html,
              text: i.content.text,
              label: "Source"
            }, null, 8, ["html", "text"])
          ]),
          _: 2
        }, 1024)
      ]))), 128))
    ])) : (l(), u("p", Vi, h(e.resource.title) + " has no saved versions. Each change is kept here, newest first. ", 1));
  }
}), Hi = { class: "kx-modal-head-icon mail-head-warn" }, Fi = { class: "kx-modal-head-text" }, Bi = { class: "kx-modal-head-title" }, Wi = { class: "mail-dialog-text" }, qi = {
  key: 0,
  class: "mail-list"
}, Ki = ["onClick"], Yi = /* @__PURE__ */ Q({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const r = t, i = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function n(p) {
      r("close"), p();
    }
    return (p, a) => (l(), U(o(Rt), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: i,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": a[1] || (a[1] = (c) => {
        c || r("close");
      })
    }, {
      header: A(() => [
        s("span", Hi, [
          m(o(I), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        s("span", Fi, [
          s("span", Bi, h(e.refusal?.header), 1)
        ])
      ]),
      footer: A(() => [
        m(o(G), {
          label: "Close",
          autofocus: "",
          onClick: a[0] || (a[0] = (c) => r("close"))
        })
      ]),
      default: A(() => [
        s("p", Wi, h(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), u("ul", qi, [
          (l(!0), u(H, null, ce(e.refusal.links, (c) => (l(), u("li", {
            key: c.label
          }, [
            s("button", {
              type: "button",
              class: "mail-row-link",
              onClick: (d) => n(c.open)
            }, [
              m(o(I), {
                icon: "tabler:mail",
                "aria-hidden": "true"
              }),
              s("span", null, h(c.label), 1)
            ], 8, Ki)
          ]))), 128))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Ji = { class: "mail-stack" }, Gi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Qi = {
  key: 0,
  class: "mail-muted"
}, Xi = {
  key: 1,
  class: "mail-list"
}, Zi = ["onClick"], eo = {
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, to = { class: "mail-group-head" }, ro = {
  key: 0,
  class: "mail-muted"
}, ao = {
  key: 1,
  class: "mail-list"
}, io = { class: "mail-list-main" }, oo = {
  key: 0,
  class: "mail-sub"
}, so = { class: "mail-muted" }, no = {
  key: 2,
  class: "mail-group",
  "aria-labelledby": "used-by-templates"
}, lo = { class: "mail-muted" }, co = /* @__PURE__ */ Q({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const t = e, { library: r, go: i, deliveryAdmin: n } = xe(), p = V(() => (t.resource.used_by?.messages ?? []).map((c) => ({
      name: c,
      title: r.find("message", c)?.title ?? c
    }))), a = V(() => t.resource.used_by?.recent_senders ?? []);
    return ie(a, (c) => {
      ve(c.map((d) => d.sender));
    }, { immediate: !0 }), (c, d) => (l(), u("div", Ji, [
      e.resource.kind === "base" ? (l(), u("section", Gi, [
        d[1] || (d[1] = s("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        p.value.length ? (l(), u("ul", Xi, [
          (l(!0), u(H, null, ce(p.value, (g) => (l(), u("li", {
            key: g.name
          }, [
            s("button", {
              type: "button",
              class: "mail-row-link",
              onClick: ($) => o(i)({ name: "resource", kind: "message", resource: g.name, section: "content" })
            }, [
              m(o(I), {
                icon: o(pe).message,
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              s("span", null, h(g.title), 1)
            ], 8, Zi)
          ]))), 128))
        ])) : (l(), u("p", Qi, "No messages use " + h(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), u(H, { key: 1 }, [
        s("section", eo, [
          s("div", to, [
            d[2] || (d[2] = s("h2", {
              id: "used-by-recent",
              class: "mail-label"
            }, "Sent in the last 30 days", -1)),
            o(n) ? (l(), u("button", {
              key: 0,
              type: "button",
              class: "mail-text-link",
              onClick: d[0] || (d[0] = (g) => o(i)({ name: "activity", template: e.resource.name }))
            }, "Open in Activity")) : S("", !0)
          ]),
          a.value.length ? (l(), u("ul", ao, [
            (l(!0), u(H, null, ce(a.value, (g) => (l(), u("li", {
              key: g.sender + (g.origin?.id ?? ""),
              class: "mail-list-row"
            }, [
              m(o(I), {
                icon: g.origin ? "tabler:bolt" : "tabler:user",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              s("span", io, [
                s("span", null, h(o(ke)(g.sender)), 1),
                g.origin ? (l(), u("span", oo, h(o(Ue)(g.origin)), 1)) : S("", !0)
              ]),
              s("span", so, h(o(he)(g.count, "message")), 1)
            ]))), 128))
          ])) : (l(), u("p", ro, "Nobody has sent " + h(e.resource.title) + " recently.", 1))
        ]),
        d[3] || (d[3] = s("section", {
          class: "mail-group",
          "aria-labelledby": "used-by-setup"
        }, [
          s("h2", {
            id: "used-by-setup",
            class: "mail-label"
          }, "Set up to send"),
          s("p", { class: "mail-muted" }, "Workflows, automations and agents that name this message are not listed here yet.")
        ], -1))
      ], 64)) : (l(), u("section", no, [
        d[4] || (d[4] = s("h2", {
          id: "used-by-templates",
          class: "mail-label"
        }, "Templates", -1)),
        s("p", lo, "Templates that include " + h(e.resource.title) + " are not listed here yet. Deleting a part checks every message first.", 1)
      ]))
    ]));
  }
}), po = {
  key: 0,
  class: "mail-muted",
  role: "status"
}, uo = { class: "mail-mono" }, mo = { class: "mail-sub mail-inline" }, fo = { class: "mail-value" }, ho = { class: "mail-value" }, vo = /* @__PURE__ */ Q({
  __name: "VariablesTable",
  props: {
    resource: {},
    label: {}
  },
  setup(e) {
    const t = e;
    function r(a) {
      const c = a.type;
      if (c === "array") {
        const g = a.items, $ = g && typeof g == "object" && !Array.isArray(g) ? g.type : void 0;
        return $ === "object" ? "List of records" : $ ? "List of " + String($) + "s" : "List";
      }
      return typeof c == "string" ? { string: "Text", integer: "Whole number", number: "Number", boolean: "Yes or no", object: "Record" }[c] ?? c : "Any";
    }
    function i(a) {
      return a == null ? "—" : typeof a == "string" ? a : JSON.stringify(a);
    }
    const n = V(() => {
      const a = new Set(t.resource.schema.required ?? []);
      return Object.entries(t.resource.schema.properties).map(([c, d]) => ({
        name: c,
        type: r(d),
        required: a.has(c),
        description: typeof d.description == "string" ? d.description : "",
        sample: i(t.resource.samples[c]),
        fallback: i(d.default)
      }));
    }), p = V(() => n.value.some((a) => a.fallback !== "—"));
    return (a, c) => n.value.length ? (l(), U(o(at), {
      key: 1,
      value: n.value,
      "data-key": "name",
      class: "mail-table",
      pt: { table: { "aria-label": e.label } }
    }, {
      default: A(() => [
        m(o(X), { header: "Name" }, {
          body: A(({ data: d }) => [
            s("span", uo, h(d.name), 1),
            d.required ? (l(), U(o(Se), {
              key: 0,
              severity: "secondary",
              value: "Required",
              class: "kx-tag-sm mail-required"
            })) : S("", !0)
          ]),
          _: 1
        }),
        m(o(X), {
          header: "Type",
          field: "type"
        }),
        m(o(X), { header: "Description" }, {
          body: A(({ data: d }) => [
            s("span", mo, h(d.description || "—"), 1)
          ]),
          _: 1
        }),
        p.value ? (l(), U(o(X), {
          key: 0,
          header: "Default"
        }, {
          body: A(({ data: d }) => [
            s("span", fo, h(d.fallback), 1)
          ]),
          _: 1
        })) : S("", !0),
        m(o(X), { header: "Sample value" }, {
          body: A(({ data: d }) => [
            s("span", ho, h(d.sample), 1)
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["value", "pt"])) : (l(), u("p", po, h(e.resource.title) + " takes no " + h(e.label.toLowerCase()) + ".", 1));
  }
}), go = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, bo = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, yo = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, xo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ko = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, wo = {
  key: 2,
  class: "kx-notice info mail-block",
  role: "status"
}, _o = {
  key: 3,
  class: "kx-notice mail-customized"
}, Co = { class: "mail-customized-text" }, $o = { class: "mail-facts mail-card" }, So = { class: "mail-mono" }, To = { class: "mail-mono-block" }, Ao = /* @__PURE__ */ Q({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const t = e, { library: r, go: i, create: n } = xe(), p = V(() => ({ kind: t.kind, name: t.name })), a = be(), c = C(!0), d = C(!1), g = C(!1), $ = C(""), b = ye();
    async function _() {
      const x = b();
      try {
        const k = await me.get(p.value);
        if (!x()) return;
        a.value = k, d.value = g.value = !1, $.value = "", ve([k.author]);
      } catch (k) {
        if (!x()) return;
        d.value = Xe(k), g.value = Te(k), $.value = d.value || g.value ? "" : le(k, "This resource could not be loaded."), d.value && (a.value = void 0);
      } finally {
        x() && (c.value = !1);
      }
    }
    const y = be([]), R = C(!1), P = C(""), F = ye();
    async function B() {
      const x = F();
      R.value = !0;
      try {
        const k = await me.history(p.value);
        if (!x()) return;
        y.value = k, P.value = "", ve(k.map((Z) => Z.author));
      } catch (k) {
        if (!x()) return;
        P.value = Xe(k) ? "" : le(k, "History could not be loaded.");
      } finally {
        x() && (R.value = !1);
      }
    }
    let Y = !1;
    ie(() => t.section, (x) => {
      x === "history" && !Y && (Y = !0, B());
    }, { immediate: !0 });
    async function D() {
      await _(), Y && !d.value && await B();
    }
    it(D), Zt((x) => {
      x.kind === t.kind && x.name === t.name ? D() : t.kind === "base" && x.kind === "message" && _();
    });
    const O = C(), N = C(""), q = C(""), J = C(), f = V(() => a.value?.title ?? t.name), v = V(() => {
      const x = a.value, k = f.value, Z = x?.used_by?.messages?.length ?? 0, te = x?.used_by?.recent_senders?.find((or) => or.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (te?.origin ? ` Sent recently by “${Ue(te.origin)}”.` : "") },
          base: { title: "Layout", description: Z ? `The frame around the ${he(Z, "message")} that ${Z === 1 ? "uses" : "use"} ${k}.` : `The frame around messages that use ${k}.` },
          part: { title: "Content", description: `Shown wherever ${k} is included.` }
        }[t.kind],
        variables: t.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${k} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: t.kind === "message" ? `Who sends ${k}.` : t.kind === "base" ? `Messages that use ${k}.` : `Templates that include ${k}.`
        },
        history: { title: "History", description: `Every saved version of ${k}, newest first.` }
      }[t.section];
    }), w = V(() => {
      const x = a.value;
      return x?.state !== "customized" ? "" : `Customized by ${ke(x.author)} ${qa(x.updated_at)} from the included version.`;
    }), T = V(() => {
      const x = a.value?.base;
      return x ? r.find("base", x)?.title ?? x : "";
    }), L = C(!1);
    function M(x, k) {
      L.value = Oe(x) === "mail_revision_conflict", L.value && D(), N.value = le(x, k);
    }
    async function we() {
      const x = a.value;
      if (!(!x || O.value !== void 0 || !await Ce.confirm({
        header: `Reset ${x.title} to the original?`,
        message: "Your changes are replaced by the included version. They stay in History, so you can restore them.",
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        O.value = "reset", N.value = q.value = "", L.value = !1;
        try {
          a.value = await me.reset(p.value, x.revision), q.value = `${x.title} is back to the original. Your changes are in History.`, await D();
        } catch (Z) {
          M(Z, `${x.title} could not be reset.`);
        } finally {
          O.value = void 0;
        }
      }
    }
    async function Fe(x) {
      const k = a.value;
      if (!(!k || O.value !== void 0 || !await Ce.confirm({
        header: `Restore the version of ${k.title} from ${De(x.created_at)}?`,
        message: "It becomes the current version. The current version stays in History.",
        acceptLabel: "Restore this version",
        rejectLabel: "Cancel"
      }))) {
        O.value = x.revision, N.value = q.value = "";
        try {
          a.value = await me.restore(p.value, x.revision, k.revision), q.value = `The version from ${De(x.created_at)} is now in effect.`, await D();
        } catch (te) {
          M(te, "That version could not be restored.");
        } finally {
          O.value = void 0;
        }
      }
    }
    function z(x, k) {
      const Z = k.map((oe) => r.find("message", oe)?.title ?? oe), te = x.kind === "base" ? "use" : "include";
      J.value = {
        header: `${x.title} is in use`,
        message: `${he(k.length, "message")} ${k.length === 1 ? te + "s" : te} it: ${Z.join(", ")}. Remove it from ${k.length === 1 ? "that message" : "them"} first.`,
        links: k.map((oe, Ae) => ({ label: Z[Ae], open: () => i({ name: "resource", kind: "message", resource: oe, section: "content" }) }))
      };
    }
    async function E() {
      const x = a.value;
      if (!x || x.state !== "created" || O.value !== void 0) return;
      const k = x.used_by?.messages ?? [];
      if (x.kind === "base" && k.length) {
        z(x, k);
        return;
      }
      if (await Ce.confirm({
        header: `Delete ${x.title}?`,
        message: x.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${ae[x.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        O.value = "delete", N.value = q.value = "";
        try {
          await me.remove(p.value, x.revision), i({ name: "library", section: Ze(x.kind) });
        } catch (te) {
          const oe = Oe(te) === "mail_resource_in_use" ? te.details?.messages : void 0;
          Array.isArray(oe) && oe.every((Ae) => typeof Ae == "string") ? z(x, oe) : M(te, `${x.title} could not be deleted.`);
        } finally {
          O.value = void 0;
        }
      }
    }
    function j() {
      const x = a.value;
      x && n({ kind: x.kind, from: { kind: x.kind, name: x.name } });
    }
    return (x, k) => (l(), u(H, null, [
      d.value ? (l(), U(ct, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + o(nt)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: k[0] || (k[0] = (Z) => o(i)({ name: "library", section: o(Ze)(e.kind) }))
      }, null, 8, ["cta"])) : g.value ? (l(), u("p", go, [
        m(o(I), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        k[4] || (k[4] = W("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), u(H, { key: 2 }, [
        m(He, {
          title: v.value.title,
          description: v.value.description
        }, et({ _: 2 }, [
          a.value ? {
            name: "actions",
            fn: A(() => [
              m(o(G), {
                label: "Duplicate",
                severity: "secondary",
                outlined: "",
                disabled: O.value !== void 0,
                onClick: j
              }, {
                icon: A(() => [
                  m(o(I), {
                    icon: "tabler:copy",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]),
              a.value.state === "created" ? (l(), U(o(G), {
                key: 0,
                label: "Delete",
                severity: "danger",
                outlined: "",
                loading: O.value === "delete",
                disabled: O.value !== void 0,
                onClick: E
              }, {
                icon: A(() => [
                  m(o(I), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled"])) : S("", !0)
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "description"]),
        $.value ? (l(), u("div", bo, [
          s("span", null, h($.value), 1),
          m(o(G), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: k[1] || (k[1] = (Z) => D())
          })
        ])) : c.value ? (l(), u("p", yo, [
          m(o(I), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          W("Loading " + h(f.value) + "…", 1)
        ])) : S("", !0),
        a.value ? (l(), u(H, { key: 2 }, [
          N.value && L.value ? (l(), u("p", xo, [
            m(o(I), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            W(h(N.value), 1)
          ])) : N.value ? (l(), u("p", ko, [
            s("span", null, h(N.value), 1)
          ])) : S("", !0),
          q.value ? (l(), u("p", wo, [
            m(o(I), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            W(h(q.value), 1)
          ])) : S("", !0),
          w.value && e.section === "content" ? (l(), u("div", _o, [
            m(o(I), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            s("span", Co, h(w.value), 1),
            m(o(G), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: O.value === "reset",
              disabled: O.value !== void 0,
              onClick: we
            }, {
              icon: A(() => [
                m(o(I), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : S("", !0),
          e.section === "content" ? (l(), u(H, { key: 4 }, [
            s("dl", $o, [
              k[7] || (k[7] = s("dt", null, "Name", -1)),
              s("dd", null, h(a.value.title), 1),
              k[8] || (k[8] = s("dt", null, "Description", -1)),
              s("dd", null, h(a.value.description || "—"), 1),
              k[9] || (k[9] = s("dt", null, "Reference", -1)),
              s("dd", null, [
                s("span", So, h(a.value.name), 1)
              ]),
              a.value.kind === "message" ? (l(), u(H, { key: 0 }, [
                k[5] || (k[5] = s("dt", null, "Base template", -1)),
                s("dd", null, [
                  a.value.base ? (l(), u("button", {
                    key: 0,
                    type: "button",
                    class: "mail-text-link",
                    onClick: k[2] || (k[2] = (Z) => o(i)({ name: "resource", kind: "base", resource: a.value.base, section: "content" }))
                  }, h(T.value), 1)) : S("", !0)
                ]),
                k[6] || (k[6] = s("dt", null, "Subject", -1)),
                s("dd", null, [
                  s("span", To, h(a.value.subject), 1)
                ])
              ], 64)) : S("", !0)
            ]),
            m(ir, {
              html: a.value.html,
              text: a.value.text,
              label: e.kind === "message" ? "Body" : "Source"
            }, null, 8, ["html", "text", "label"])
          ], 64)) : e.section === "variables" ? (l(), U(vo, {
            key: 5,
            resource: a.value,
            label: v.value.title
          }, null, 8, ["resource", "label"])) : e.section === "used-by" ? (l(), U(co, {
            key: 6,
            resource: a.value
          }, null, 8, ["resource"])) : (l(), U(Ui, {
            key: 7,
            resource: a.value,
            revisions: y.value,
            loading: R.value,
            error: P.value,
            busy: typeof O.value == "number" ? O.value : O.value ? -1 : void 0,
            onRestore: Fe,
            onRetry: B
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"]))
        ], 64)) : S("", !0)
      ], 64)),
      m(Yi, {
        refusal: J.value,
        onClose: k[3] || (k[3] = (Z) => J.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Lo = /* @__PURE__ */ Q({
  __name: "AssetsPage",
  setup(e) {
    return (t, r) => (l(), u(H, null, [
      m(He, {
        title: "Assets",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }),
      m(ct, {
        icon: "tabler:photo",
        title: "Assets are not available yet",
        hint: "This workspace cannot keep email images yet. Templates can show images hosted at a web address in the meantime."
      })
    ], 64));
  }
}), Eo = { class: "kx-modal-head-icon" }, Ro = { class: "kx-modal-head-text" }, zo = { class: "kx-modal-head-title" }, Vo = ["id"], Po = ["disabled", "inert"], Io = {
  key: 0,
  class: "mail-field"
}, Mo = {
  key: 1,
  class: "mail-field"
}, Oo = ["for"], Do = { class: "mail-field" }, No = ["for"], jo = ["for"], Uo = ["id"], Ho = { class: "mail-field" }, Fo = ["for"], Bo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Wo = /* @__PURE__ */ Q({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const r = e, i = t, { library: n, go: p } = xe(), a = C("message"), c = C(""), d = C(""), g = C(""), $ = C(""), b = C(!1), _ = C(!1), y = C(""), R = C(""), P = { title: ue(), reference: ue(), description: ue(), source: ue(), hint: ue() }, F = ["message", "base", "part"].map((w) => ({ value: w, label: ae[w] })), B = V(() => !!r.intent.from), Y = V(() => n.resources.value.filter((w) => w.kind === a.value).sort((w, T) => w.title.localeCompare(T.title)).map((w) => ({ value: w.name, label: w.title }))), D = V(() => n.find(a.value, c.value));
    function O(w) {
      c.value = w;
      const T = n.find(a.value, w);
      T && ($.value = T.description, r.intent.from && (d.value = `${T.title} copy`, b.value = !1));
    }
    ie(() => r.visible, (w) => {
      w && (a.value = r.intent.from?.kind ?? r.intent.kind ?? "message", d.value = g.value = $.value = c.value = "", y.value = R.value = "", b.value = !1, r.intent.from && O(r.intent.from.name));
    }, { immediate: !0 }), ie(a, () => {
      r.intent.from || (c.value = $.value = "");
    }), ie(d, (w) => {
      b.value || (g.value = Ga(w));
    });
    const N = V(() => a.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function q() {
      return R.value = "", g.value ? Qa.test(g.value) ? n.find(a.value, g.value) && (R.value = `A ${ae[a.value].toLowerCase()} with this reference already exists. Choose another.`) : R.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : R.value = "Enter a reference.", !R.value;
    }
    async function J() {
      if (!(_.value || !d.value.trim() || !D.value || !q())) {
        _.value = !0, y.value = "";
        try {
          const w = await me.create({
            kind: a.value,
            name: g.value,
            title: d.value.trim(),
            description: $.value.trim(),
            from: { kind: a.value, name: c.value }
          });
          await n.load(), i("close"), p({ name: "resource", kind: w.kind, resource: w.name, section: "content" });
        } catch (w) {
          Oe(w) === "mail_revision_conflict" ? R.value = `A ${ae[a.value].toLowerCase()} with this reference already exists. Choose another.` : y.value = le(w, "The resource could not be created.");
        } finally {
          _.value = !1;
        }
      }
    }
    const f = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, v = V(() => r.intent.from ? `Duplicate ${n.find(r.intent.from.kind, r.intent.from.name)?.title ?? ""}` : `New ${ae[a.value].toLowerCase()}`);
    return (w, T) => (l(), U(o(Rt), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !_.value,
      "close-on-escape": !_.value,
      class: "mail-dialog",
      pt: f,
      "aria-label": v.value,
      "onUpdate:visible": T[6] || (T[6] = (L) => {
        L || i("close");
      })
    }, {
      header: A(() => [
        s("span", Eo, [
          m(o(I), {
            icon: o(pe)[a.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        s("span", Ro, [
          s("span", zo, h(v.value), 1),
          T[7] || (T[7] = s("span", { class: "kx-modal-head-sub" }, "It starts as a copy and is yours to change.", -1))
        ])
      ]),
      footer: A(() => [
        m(o(G), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: _.value,
          onClick: T[5] || (T[5] = (L) => i("close"))
        }, null, 8, ["disabled"]),
        m(o(G), {
          label: "Create " + o(ae)[a.value].toLowerCase(),
          type: "submit",
          form: P.hint,
          loading: _.value,
          disabled: !d.value.trim() || !D.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: A(() => [
        s("form", {
          id: P.hint,
          class: "mail-form",
          onSubmit: tt(J, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: _.value,
            inert: _.value || void 0
          }, [
            B.value ? S("", !0) : (l(), u("div", Io, [
              T[8] || (T[8] = s("span", { class: "mail-field-label" }, "Kind", -1)),
              m(o(je), {
                modelValue: a.value,
                "onUpdate:modelValue": T[0] || (T[0] = (L) => a.value = L),
                options: o(F),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            B.value ? S("", !0) : (l(), u("div", Mo, [
              s("label", {
                class: "mail-field-label",
                for: P.source
              }, "Start from", 8, Oo),
              m(o(Ke), {
                "model-value": c.value,
                "input-id": P.source,
                options: Y.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": O
              }, null, 8, ["model-value", "input-id", "options"])
            ])),
            s("div", Do, [
              s("label", {
                class: "mail-field-label",
                for: P.title
              }, "Name", 8, No),
              m(o(Pe), {
                id: P.title,
                modelValue: d.value,
                "onUpdate:modelValue": T[1] || (T[1] = (L) => d.value = L),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", {
              class: ge(["mail-field", { "mail-field-invalid": R.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: P.reference
              }, "Reference", 8, jo),
              m(o(Pe), {
                id: P.reference,
                modelValue: g.value,
                "onUpdate:modelValue": T[2] || (T[2] = (L) => g.value = L),
                class: "mail-mono-input",
                invalid: !!R.value,
                "aria-describedby": P.reference + "-hint",
                onInput: T[3] || (T[3] = (L) => b.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: P.reference + "-hint",
                class: ge(R.value ? "mail-field-error" : "mail-field-hint")
              }, h(R.value || N.value), 11, Uo)
            ], 2),
            s("div", Ho, [
              s("label", {
                class: "mail-field-label",
                for: P.description
              }, "Description", 8, Fo),
              m(o(Pr), {
                id: P.description,
                modelValue: $.value,
                "onUpdate:modelValue": T[4] || (T[4] = (L) => $.value = L),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Po),
          y.value ? (l(), u("p", Bo, h(y.value), 1)) : S("", !0)
        ], 40, Vo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), qo = { class: "mail-drawer-body" }, Ko = { class: "mail-drawer-head" }, Yo = { class: "mail-drawer-title" }, Jo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Go = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Qo = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Xo = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Zo = {
  key: 0,
  class: "kx-notice error mail-failure"
}, es = { class: "mail-failure-body" }, ts = { key: 0 }, rs = {
  key: 1,
  class: "mail-failure-done",
  role: "status"
}, as = {
  key: 2,
  class: "mail-sub"
}, is = {
  key: 3,
  class: "mail-field-error",
  role: "alert"
}, os = { key: 4 }, ss = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, ns = { class: "mail-facts mail-card" }, ls = { key: 1 }, cs = {
  key: 0,
  class: "mail-sub"
}, ps = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, ds = { class: "mail-timeline" }, us = { class: "mail-muted" }, ms = { class: "mail-facts" }, fs = { class: "mail-mono-block" }, hs = /* @__PURE__ */ Q({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close", "changed"],
  setup(e, { emit: t }) {
    const r = e, i = t, { library: n, go: p } = xe(), a = be(), c = C(!1), d = C(!1), g = C(!1), $ = C(""), b = C(""), _ = C(!1), y = C(), R = C(!1), P = ye();
    async function F() {
      const f = r.messageId, v = P();
      if (!f) {
        a.value = void 0;
        return;
      }
      c.value = !0;
      try {
        const w = await $e.get(f);
        if (!v()) return;
        a.value = w, $.value = "", d.value = g.value = !1, ve([w.sender]);
      } catch (w) {
        if (!v()) return;
        a.value = void 0, d.value = Xe(w), g.value = Te(w), $.value = d.value || g.value ? "" : le(w, "This message could not be loaded.");
      } finally {
        v() && (c.value = !1);
      }
    }
    ie(() => r.messageId, (f) => {
      y.value = void 0, b.value = "", R.value = !1, f !== a.value?.message_id && (a.value = void 0), F();
    }, { immediate: !0 }), er((f) => {
      f.message_id === r.messageId && F();
    });
    async function B() {
      const f = a.value;
      if (!(!f || _.value)) {
        _.value = !0, b.value = "";
        try {
          y.value = await $e.resend(f.message_id), i("changed");
        } catch (v) {
          b.value = le(v, "The message could not be sent again.");
        } finally {
          _.value = !1;
        }
      }
    }
    async function Y() {
      const f = a.value;
      if (f)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(f.message_id)}`), R.value = !0;
        } catch {
          R.value = !1;
        }
    }
    const D = V(() => {
      const f = a.value?.template;
      return f ? n.find("message", f)?.title ?? f : "";
    }), O = V(() => !!a.value?.template && !!n.find("message", a.value.template)), N = V(() => {
      const f = a.value;
      if (!f) return [];
      const v = [{ label: "Accepted for delivery", at: f.created_at }];
      return f.status === "queued" && f.next_attempt_at && v.push({ label: f.attempts ? `Attempt ${f.attempts} did not go through; trying again` : "Next delivery attempt", at: f.next_attempt_at }), f.sent_at ? v.push({ label: f.attempts > 1 ? `Sent after ${f.attempts} attempts` : "Sent", at: f.sent_at }) : f.status === "failed" && f.finished_at && v.push({ label: f.attempts > 1 ? `Failed after ${f.attempts} attempts` : "Failed", at: f.finished_at }), v;
    }), q = V(() => (a.value?.attachments ?? []).map((f) => f.filename || "Attachment")), J = V(() => {
      const f = a.value;
      return f ? [
        { label: "Message ID", value: f.message_id },
        { label: "Delivery service", value: f.driver_id },
        { label: "Service message ID", value: f.provider_message_id },
        { label: "Error code", value: f.last_error?.code },
        { label: "Service response", value: f.last_error?.provider_detail }
      ].filter((v) => !!v.value) : [];
    });
    return (f, v) => (l(), U(o(Ir), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !_.value,
      "close-on-escape": !_.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": v[5] || (v[5] = (w) => {
        w || i("close");
      })
    }, {
      default: A(() => [
        s("div", qo, [
          s("header", Ko, [
            s("div", Yo, [
              a.value ? (l(), U(o(Se), {
                key: 0,
                severity: o(qt)[a.value.status],
                value: o(Wt)[a.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : S("", !0),
              s("h2", null, h(a.value?.subject ?? "Message"), 1)
            ]),
            m(o(G), {
              text: "",
              severity: "secondary",
              disabled: !a.value,
              "aria-label": R.value ? "Link copied" : "Copy link",
              title: R.value ? "Link copied" : "Copy link",
              onClick: Y
            }, {
              icon: A(() => [
                m(o(I), {
                  icon: R.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            m(o(G), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: _.value,
              onClick: v[0] || (v[0] = (w) => i("close"))
            }, {
              icon: A(() => [
                m(o(I), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          c.value && !a.value ? (l(), u("p", Jo, [
            m(o(I), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            v[6] || (v[6] = W("Loading message…", -1))
          ])) : d.value ? (l(), u("p", Go, [
            m(o(I), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            v[7] || (v[7] = W("This message is no longer in Activity.", -1))
          ])) : g.value ? (l(), u("p", Qo, [
            m(o(I), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            v[8] || (v[8] = W("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : $.value ? (l(), u("div", Xo, [
            s("span", null, h($.value), 1),
            m(o(G), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: v[1] || (v[1] = (w) => F())
            })
          ])) : S("", !0),
          a.value ? (l(), u(H, { key: 4 }, [
            a.value.status === "failed" ? (l(), u("div", Zo, [
              m(o(I), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              s("div", es, [
                v[10] || (v[10] = s("strong", null, "This message was not delivered.", -1)),
                a.value.last_error ? (l(), u("span", ts, h(a.value.last_error.message), 1)) : S("", !0),
                y.value ? (l(), u("p", rs, [
                  v[9] || (v[9] = W(" Sent again as a new message. ", -1)),
                  s("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: v[2] || (v[2] = (w) => o(p)({ name: "activity", message: y.value.message_id }))
                  }, "Open the new message")
                ])) : a.value.can_resend ? S("", !0) : (l(), u("p", as, "It cannot be sent again because its content was not kept.")),
                b.value ? (l(), u("p", is, h(b.value), 1)) : S("", !0),
                a.value.can_resend && !y.value ? (l(), u("div", os, [
                  m(o(G), {
                    label: "Send again",
                    loading: _.value,
                    onClick: B
                  }, {
                    icon: A(() => [
                      m(o(I), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : S("", !0)
              ])
            ])) : a.value.status === "queued" ? (l(), u("p", ss, [
              m(o(I), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              v[11] || (v[11] = W("Waiting to be delivered. ", -1))
            ])) : S("", !0),
            s("dl", ns, [
              v[17] || (v[17] = s("dt", null, "To", -1)),
              s("dd", null, h(a.value.to.join(", ")), 1),
              a.value.cc?.length ? (l(), u(H, { key: 0 }, [
                v[12] || (v[12] = s("dt", null, "Cc", -1)),
                s("dd", null, h(a.value.cc.join(", ")), 1)
              ], 64)) : S("", !0),
              a.value.bcc?.length ? (l(), u(H, { key: 1 }, [
                v[13] || (v[13] = s("dt", null, "Bcc", -1)),
                s("dd", null, h(a.value.bcc.join(", ")), 1)
              ], 64)) : S("", !0),
              a.value.reply_to ? (l(), u(H, { key: 2 }, [
                v[14] || (v[14] = s("dt", null, "Reply-to", -1)),
                s("dd", null, h(a.value.reply_to), 1)
              ], 64)) : S("", !0),
              v[18] || (v[18] = s("dt", null, "Template", -1)),
              s("dd", null, [
                O.value ? (l(), u("button", {
                  key: 0,
                  type: "button",
                  class: "mail-text-link",
                  onClick: v[3] || (v[3] = (w) => o(p)({ name: "resource", kind: "message", resource: a.value.template, section: "content" }))
                }, h(D.value), 1)) : (l(), u("span", ls, h(D.value || "Written directly"), 1))
              ]),
              v[19] || (v[19] = s("dt", null, "Sent by", -1)),
              s("dd", null, [
                W(h(o(ke)(a.value.sender)), 1),
                a.value.origin ? (l(), u("span", cs, h(o(Ue)(a.value.origin)), 1)) : S("", !0)
              ]),
              q.value.length ? (l(), u(H, { key: 3 }, [
                v[15] || (v[15] = s("dt", null, "Attachments", -1)),
                s("dd", null, h(q.value.join(", ")), 1)
              ], 64)) : S("", !0),
              a.value.resend_of ? (l(), u(H, { key: 4 }, [
                v[16] || (v[16] = s("dt", null, "Sent again from", -1)),
                s("dd", null, [
                  s("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: v[4] || (v[4] = (w) => o(p)({ name: "activity", message: a.value.resend_of }))
                  }, "The original message")
                ])
              ], 64)) : S("", !0)
            ]),
            s("section", ps, [
              v[20] || (v[20] = s("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              s("ol", ds, [
                (l(!0), u(H, null, ce(N.value, (w) => (l(), u("li", {
                  key: w.label
                }, [
                  s("span", null, h(w.label), 1),
                  s("span", us, h(o(De)(w.at)), 1)
                ]))), 128))
              ])
            ]),
            J.value.length ? (l(), U(ar, {
              key: 2,
              label: "Technical details"
            }, {
              default: A(() => [
                s("dl", ms, [
                  (l(!0), u(H, null, ce(J.value, (w) => (l(), u(H, {
                    key: w.label
                  }, [
                    s("dt", null, h(w.label), 1),
                    s("dd", fs, h(w.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : S("", !0)
          ], 64)) : S("", !0)
        ])
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), vs = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, gs = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, bs = { class: "mail-toolbar" }, ys = {
  key: 0,
  class: "mail-count",
  role: "status"
}, xs = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, ks = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ws = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, _s = ["onClick"], Cs = { class: "mail-sub" }, $s = {
  key: 0,
  class: "mail-sub"
}, Ss = { class: "mail-muted" }, Ts = {
  key: 2,
  class: "mail-more"
}, As = /* @__PURE__ */ Q({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const t = e, { library: r, go: i } = xe(), n = C("all"), p = C(t.template ?? null), a = C(30), c = C("");
    ie(() => t.template, (z) => {
      z !== void 0 && (p.value = z);
    });
    const d = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], g = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], $ = V(() => r.resources.value.filter((z) => z.kind === "message").sort((z, E) => z.title.localeCompare(E.title)).map((z) => ({ label: z.title, value: z.name }))), b = be([]), _ = C(), y = C(!0), R = C(!1), P = C(!1), F = C(!1), B = C(""), Y = ye();
    function D(z) {
      return {
        status: n.value === "all" ? void 0 : n.value,
        message: p.value || void 0,
        since: Date.now() - a.value * 24 * 60 * 60 * 1e3,
        cursor: z
      };
    }
    async function O() {
      const z = Y();
      y.value = !0;
      try {
        const E = await $e.list(D());
        if (!z()) return;
        b.value = E.items, _.value = E.next_cursor, B.value = "", F.value = !1, R.value = !0, ve(E.items.map((j) => j.sender));
      } catch (E) {
        if (!z()) return;
        F.value = Te(E), B.value = F.value ? "" : le(E, "Activity could not be loaded.");
      } finally {
        z() && (y.value = !1);
      }
    }
    async function N() {
      if (!_.value || P.value) return;
      const z = Y();
      P.value = !0;
      try {
        const E = await $e.list(D(_.value));
        if (!z()) return;
        b.value = [...b.value, ...E.items], _.value = E.next_cursor, ve(E.items.map((j) => j.sender));
      } catch (E) {
        z() && (B.value = le(E, "More activity could not be loaded."));
      } finally {
        P.value = !1;
      }
    }
    const q = be({ count: 0, capped: !1 }), J = ye();
    async function f() {
      const z = J();
      try {
        const E = await $e.list({ status: "failed", since: Ya(), limit: 200 });
        z() && (q.value = { count: E.items.length, capped: E.has_more, latest: E.items[0] });
      } catch {
        z() && (q.value = { count: 0, capped: !1 });
      }
    }
    async function v() {
      await Promise.all([O(), f()]);
    }
    ie([n, p, a], () => {
      O();
    }), it(v), er(() => {
      v();
    });
    const w = V(() => {
      const z = c.value.trim().toLowerCase();
      return z ? b.value.filter((E) => [E.subject, ...E.to, ...E.cc ?? [], ...E.bcc ?? []].some((j) => j.toLowerCase().includes(z))) : b.value;
    }), T = V(() => he(w.value.length, "message") + (_.value && !c.value ? " so far" : "")), L = V(() => {
      const z = q.value;
      return z.count ? { title: `${z.capped ? `${z.count}+ messages` : he(z.count, "message")} failed today.`, reason: z.latest?.last_error?.message ?? "" } : void 0;
    });
    function M(z) {
      return z ? r.find("message", z)?.title ?? z : "—";
    }
    function we(z) {
      i({ name: "activity", message: z.message_id });
    }
    function Fe() {
      i({ name: "activity", template: p.value || void 0 });
    }
    return (z, E) => (l(), u(H, null, [
      m(He, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      F.value ? (l(), u("p", vs, [
        m(o(I), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[6] || (E[6] = W("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), u(H, { key: 1 }, [
        L.value ? (l(), u("p", gs, [
          m(o(I), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", null, [
            s("strong", null, h(L.value.title), 1),
            W(" " + h(L.value.reason), 1)
          ])
        ])) : S("", !0),
        s("div", bs, [
          m(o(je), {
            modelValue: n.value,
            "onUpdate:modelValue": E[0] || (E[0] = (j) => n.value = j),
            options: d,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          m(o(Ke), {
            modelValue: p.value,
            "onUpdate:modelValue": E[1] || (E[1] = (j) => p.value = j),
            options: $.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          m(o(Ke), {
            modelValue: a.value,
            "onUpdate:modelValue": E[2] || (E[2] = (j) => a.value = j),
            options: g,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          m(o(Lt), { class: "mail-search" }, {
            default: A(() => [
              m(o(Et), null, {
                default: A(() => [
                  m(o(I), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              m(o(Pe), {
                modelValue: c.value,
                "onUpdate:modelValue": E[3] || (E[3] = (j) => c.value = j),
                type: "search",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          R.value ? (l(), u("span", ys, h(T.value), 1)) : S("", !0)
        ]),
        B.value ? (l(), u("div", xs, [
          s("span", null, h(B.value), 1),
          m(o(G), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: E[4] || (E[4] = (j) => v())
          })
        ])) : y.value && !R.value ? (l(), u("p", ks, [
          m(o(I), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          E[7] || (E[7] = W("Loading activity…", -1))
        ])) : R.value ? (l(), u(H, { key: 3 }, [
          w.value.length ? (l(), U(o(at), {
            key: 1,
            value: w.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: E[5] || (E[5] = (j) => we(j.data))
          }, {
            default: A(() => [
              m(o(X), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: A(({ data: j }) => [
                  m(o(Se), {
                    severity: o(qt)[j.status],
                    value: o(Wt)[j.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              m(o(X), { header: "Message" }, {
                body: A(({ data: j }) => [
                  s("button", {
                    type: "button",
                    class: "mail-name",
                    onClick: tt((x) => we(j), ["stop"])
                  }, h(j.subject), 9, _s),
                  s("span", Cs, h(o(Ja)(j.to)), 1)
                ]),
                _: 1
              }),
              m(o(X), { header: "Template" }, {
                body: A(({ data: j }) => [
                  W(h(M(j.template)), 1)
                ]),
                _: 1
              }),
              m(o(X), { header: "Sent by" }, {
                body: A(({ data: j }) => [
                  s("span", null, h(o(ke)(j.sender)), 1),
                  j.origin ? (l(), u("span", $s, h(o(Ue)(j.origin)), 1)) : S("", !0)
                ]),
                _: 1
              }),
              m(o(X), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: A(({ data: j }) => [
                  s("span", Ss, h(o(Ka)(j.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), u("p", ws, h(b.value.length || c.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          _.value ? (l(), u("div", Ts, [
            m(o(G), {
              label: "Show more",
              severity: "secondary",
              outlined: "",
              loading: P.value,
              onClick: N
            }, null, 8, ["loading"])
          ])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      m(hs, {
        "message-id": e.message,
        onClose: Fe,
        onChanged: v
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Ls = { class: "kx-shell kx-settings-shell mail-admin" }, Es = { class: "kx-main" }, Rs = /* @__PURE__ */ Q({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate"],
  setup(e, { emit: t }) {
    const r = e, i = t, n = C(Tt("")), p = V(() => r.route === void 0 ? n.value : Tt(r.route));
    function a(f) {
      const v = St(f);
      r.route === void 0 ? n.value = f : v !== r.route && i("navigate", v);
    }
    const c = ei(), d = C(), g = C(!1);
    async function $() {
      try {
        d.value = await Ha.status(), g.value = !0;
      } catch (f) {
        d.value = void 0, g.value = !Te(f);
      }
    }
    $();
    const b = C(!1), _ = C({});
    function y(f) {
      _.value = f, b.value = !0;
    }
    gr(Bt, { library: c, delivery: d, deliveryAdmin: g, go: a, create: y });
    const R = {
      content: (f) => f === "message" ? "Message" : f === "base" ? "Layout" : "Content",
      variables: (f) => f === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, P = {
      content: (f) => pe[f],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, F = V(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: pe.message },
        { value: "bases", label: "Base templates", icon: pe.base },
        { value: "parts", label: "Parts", icon: pe.part },
        { value: "assets", label: "Assets", icon: "tabler:photo" }
      ] },
      ...g.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), B = { value: "all", label: "All resources", icon: "tabler:table" }, Y = V(() => {
      const f = p.value;
      return f.name !== "resource" ? "" : c.find(f.kind, f.resource)?.title ?? f.resource;
    }), D = V(() => {
      const f = p.value;
      if (f.name === "resource")
        return {
          leading: { value: "all", label: "All " + nt[f.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: Y.value, items: rr(f.kind).map((v) => ({
            value: v,
            label: R[v](f.kind),
            icon: P[v](f.kind)
          })) }]
        };
    }), O = V(() => {
      const f = p.value;
      return f.name === "resource" ? f.section : f.name === "activity" ? "activity" : f.section;
    });
    function N(f) {
      const v = p.value;
      if (v.name === "resource") {
        a(f === "all" ? { name: "library", section: Ze(v.kind) } : { ...v, section: f });
        return;
      }
      a(f === "activity" ? { name: "activity" } : { name: "library", section: f });
    }
    function q() {
      const f = p.value;
      f.name === "resource" ? y({ kind: f.kind }) : f.name === "library" ? y({ kind: f.section === "bases" ? "base" : f.section === "parts" ? "part" : "message" }) : y({});
    }
    const J = C();
    return ie(() => St(p.value), () => {
      J.value?.scrollTo({ top: 0 });
    }), (f, v) => (l(), u("main", Ls, [
      m(Na, {
        label: "Mail sections",
        title: "Mail",
        value: O.value,
        groups: D.value ? D.value.groups : F.value,
        "leading-item": D.value ? D.value.leading : B,
        "onUpdate:value": N
      }, {
        actions: A(() => [
          m(ja, {
            "create-label": "New resource",
            onCreate: q,
            onDefaults: v[0] || (v[0] = (w) => o(Ce).navigate("/system/settings/mail"))
          })
        ]),
        _: 1
      }, 8, ["value", "groups", "leading-item"]),
      s("div", Es, [
        s("div", {
          ref_key: "main",
          ref: J,
          class: "kx-main-scroll mail-main"
        }, [
          p.value.name === "resource" ? (l(), U(Ao, {
            key: p.value.kind + "/" + p.value.resource,
            kind: p.value.kind,
            name: p.value.resource,
            section: p.value.section
          }, null, 8, ["kind", "name", "section"])) : p.value.name === "activity" ? (l(), U(As, {
            key: 1,
            message: p.value.message,
            template: p.value.template
          }, null, 8, ["message", "template"])) : p.value.section === "assets" ? (l(), U(Lo, { key: 2 })) : (l(), U(Ci, {
            key: 3,
            section: p.value.section
          }, null, 8, ["section"]))
        ], 512)
      ]),
      m(Wo, {
        visible: b.value,
        intent: _.value,
        onClose: v[1] || (v[1] = (w) => b.value = !1)
      }, null, 8, ["visible", "intent"])
    ]));
  }
}), zs = /* @__PURE__ */ Q({
  __name: "MailAdminRoot",
  setup(e) {
    const t = la(), r = ca();
    return (i, n) => (l(), U(Rs, {
      route: o(t).route,
      onNavigate: n[0] || (n[0] = (p) => o(r)("navigate", { route: p }))
    }, null, 8, ["route"]));
  }
}), Vs = Ta(zs, { type: "object", properties: { route: { type: "string", default: "" } } });
wr(import.meta.url, Vs);
//# sourceMappingURL=admin.js.map
