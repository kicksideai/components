import { hasInjectionContext as _r, inject as Cr, effectScope as Sr, ref as _, markRaw as Er, createApp as Vr, defineComponent as Pr, computed as Rr, onMounted as Tr, onBeforeUnmount as Ar, resolveComponent as Y, openBlock as v, createElementBlock as f, createElementVNode as p, createVNode as S, unref as w, withModifiers as Ir, withDirectives as J, vModelText as G, normalizeClass as A, createTextVNode as P, toDisplayString as y, createCommentVNode as R, createBlock as Q, Fragment as T, renderList as U } from "vue";
import { addCollection as zr, Icon as E } from "@iconify/vue";
import { config as X, addIcons as Or, on as ir, applyThemeMode as j, host as Lr, hostCss as Nr, loadCss as Ur, loadByTagName as Z, api as I, define as jr } from "@wippy-fe/proxy";
var H = "data-wippy-visible";
function rr(r) {
  const e = r.getAttribute(H);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Br = Object.defineProperty, Dr = (r, e, t) => e in r ? Br(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, g = (r, e, t) => Dr(r, typeof e != "symbol" ? e + "" : e, t), $r = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Hr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function er(r) {
  const e = r.startsWith("--") ? r : `--${r}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Mr(...r) {
  const e = /* @__PURE__ */ new Set();
  for (const t of r)
    if (t)
      for (const [o, s] of Object.entries(t)) {
        if ((o === "@light" || o === "@dark") && s && typeof s == "object") {
          for (const [u, l] of Object.entries(s)) {
            const d = typeof l == "string" ? er(u) : null;
            d && e.add(d);
          }
          continue;
        }
        const c = typeof s == "string" ? er(o) : null;
        c && e.add(c);
      }
  return [...e].sort();
}
function Fr(r) {
  if (r.length === 0)
    return "";
  const e = r.map((t) => `  ${t}: inherit;`).join(`
`);
  return `${Hr} {
${e}
}`;
}
function Wr(r, e) {
  const t = Fr(e);
  t && ar(r, t, "@wippy-fe/css-variables-bridge");
}
function Kr(r, e) {
  const o = (e ?? $r).map(async (s) => {
    const c = Nr[s];
    if (!c)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${s}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Ur(c);
    } catch (u) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${s}" (${c}):`, u), null;
    }
  });
  return Promise.all(o).then((s) => {
    for (const c of s) {
      if (!c)
        continue;
      const u = document.createElement("style");
      u.textContent = c, u.setAttribute("role", "@wippy-fe/host-css"), r.appendChild(u);
    }
  });
}
function qr(r, e) {
  const t = document.createElement("style");
  t.textContent = e, r.appendChild(t);
}
function ar(r, e, t) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const s = new CSSStyleSheet();
    s.replaceSync(e), r.adoptedStyleSheets = [...r.adoptedStyleSheets, s];
    return;
  }
  const o = document.createElement("style");
  o.setAttribute("role", t), o.textContent = e, r.appendChild(o);
}
function Yr(r, e) {
  ar(r, e, "@wippy-fe/custom-css");
}
function sr(r) {
  return r.__wippyHost ?? null;
}
function Jr(r) {
  return r.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function Gr(r, e, t) {
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
function D(r, e) {
  const t = {}, o = [];
  for (const [s, c] of Object.entries(e.properties)) {
    const u = r.getAttribute(s), l = Jr(s);
    if (u === null) {
      c.default !== void 0 && (t[l] = c.default);
      continue;
    }
    const d = Gr(s, u, c);
    d.error ? o.push(d.error) : t[l] = d.value;
  }
  return { props: t, errors: o };
}
var Qr = class {
  constructor(r, e) {
    g(this, "_props"), g(this, "_errors"), g(this, "_content"), g(this, "_hostVisibility"), g(this, "_propsListeners", /* @__PURE__ */ new Set()), g(this, "_contentListeners", /* @__PURE__ */ new Set()), g(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), g(this, "_disposed", !1), g(this, "_emitToDom"), g(this, "props"), g(this, "events"), g(this, "content"), g(this, "hostVisibility"), this._props = r.props, this._errors = r.errors, this._content = r.content, this._hostVisibility = r.hostVisibility, this._emitToDom = e;
    const t = this;
    this.props = {
      get value() {
        return t._props;
      },
      get errors() {
        return t._errors;
      },
      subscribe(o, s) {
        return t._subscribeProps(o, s);
      }
    }, this.events = {
      emit(o, s) {
        t._disposed || t._emitToDom(o, s);
      }
    }, this.content = r.hasContent ? {
      get value() {
        return t._content;
      },
      subscribe(o, s) {
        return t._subscribeContent(o, s);
      }
    } : null, this.hostVisibility = {
      get value() {
        return t._hostVisibility;
      },
      subscribe(o, s) {
        return t._subscribeHostVisibility(o, s);
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
}, Xr = class extends HTMLElement {
  constructor() {
    super(), g(this, "_internals"), g(this, "_contentObserver", null), g(this, "_initialized", !1), g(this, "_container", null), g(this, "_reactive", null), g(this, "_lastProps", null), g(this, "_lastErrors", []), g(this, "_lastContent", null), g(this, "_themeUnsub", null), g(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = rr(this);
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
    return [.../* @__PURE__ */ new Set([...e, ...t, H])];
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
    return sr(this);
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
        const c = D(this, r.propsSchema);
        r.validateProps && c.errors.push(...r.validateProps(c.props)), t = c.props, o = c.errors, this._lastProps = t, this._lastErrors = o;
      }
      const s = e ? this._lastContent ?? this._extractContent(r.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = s), this._reactive = new Qr(
        { props: t, errors: o, content: s, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const r = this.constructor.wippyConfig, e = this._initialized, t = this.shadowRoot ?? this.attachShadow({ mode: r.shadowMode ?? "open" });
      let o;
      if (e)
        o = this._container;
      else {
        this.onInit(t), r.inlineCss && qr(t, r.inlineCss);
        try {
          const h = X?.theming, b = Mr(
            h?.global?.cssVariables,
            h?.children?.cssVariables
          );
          Wr(t, b);
        } catch {
        }
        if (r.customCss !== !1)
          try {
            const h = X?.theming, b = [h?.global?.customCSS, h?.children?.customCSS].filter(Boolean).join(`
`);
            b && Yr(t, b);
          } catch {
          }
        (r.hostCssKeys === void 0 || r.hostCssKeys.length > 0) && Kr(t, r.hostCssKeys), o = document.createElement("div"), o.setAttribute("data-wippy-theme-root", "");
        const d = r.containerClasses ?? [];
        d.length > 0 && o.classList.add(...d), t.appendChild(o), this._container = o, Or(zr);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = ir("@theme", (d) => this._applyTheme(d)));
      const { props: s, errors: c } = D(this, r.propsSchema);
      r.validateProps && c.push(...r.validateProps(s));
      const u = s;
      this._lastProps = u, this._lastErrors = c;
      let l = null;
      r.contentTemplate && (l = this._extractContent(r.contentTemplate), this._lastContent = l, this._contentObserver = new MutationObserver(() => {
        const d = this._extractContent(r.contentTemplate);
        this._lastContent = d, this._reactive?.notifyContent(d), this.onContentChanged(d);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(t, o, u, c, l, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
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
  _applyTheme(r = Lr.getThemeMode?.()) {
    j(r, this), this._container && j(r, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), j("auto", this), this._container && j("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(r, e, t) {
    if (e === t)
      return;
    if (r === H) {
      const l = this._hostVisible, d = rr(this);
      if (d === l)
        return;
      this._hostVisible = d, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(d, l), this.onHostVisibilityChanged(d, l));
      return;
    }
    const o = this.constructor.wippyConfig, { props: s, errors: c } = D(this, o.propsSchema);
    o.validateProps && c.push(...o.validateProps(s));
    const u = s;
    this._lastProps = u, this._lastErrors = c, this._reactive?.notifyProps(u, c), this.onPropsChanged(u, c);
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
function Zr(r) {
  return r.__wippyHostBus ?? null;
}
function re(r) {
  return r.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let nr;
const pr = (r) => nr = r, ee = () => _r() && Cr(cr) || nr, cr = (
  /* istanbul ignore next */
  Symbol()
);
function te() {
  const r = Sr(!0), e = r.run(() => _({}));
  let t = [], o = [];
  const s = Er({
    install(c) {
      pr(s), s._a = c, c.provide(cr, s), c.config.globalProperties.$pinia = s, o.forEach((u) => t.push(u)), o = [];
    },
    use(c) {
      return this._a ? t.push(c) : o.push(c), this;
    },
    _p: t,
    _a: null,
    _e: r,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return s;
}
var oe = Object.defineProperty, ie = (r, e, t) => e in r ? oe(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, z = (r, e, t) => ie(r, typeof e != "symbol" ? e + "" : e, t), ae = /* @__PURE__ */ Symbol("wippy:emit"), se = /* @__PURE__ */ Symbol("wippy:props"), ne = /* @__PURE__ */ Symbol("wippy:props_error"), pe = /* @__PURE__ */ Symbol("wippy:content"), ce = /* @__PURE__ */ Symbol("wippy:panel-id"), le = /* @__PURE__ */ Symbol("wippy:layout-bus"), de = /* @__PURE__ */ Symbol("wippy:host"), ue = /* @__PURE__ */ Symbol("wippy:host-visibility"), he = class extends Xr {
  constructor() {
    super(...arguments), z(this, "_vueApp", null), z(this, "_propsRef", _({})), z(this, "_errorsRef", _([])), z(this, "_contentRef", _(null)), z(this, "_hostVisibilityRef", _(null)), z(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(r, e, t, o, s, c) {
    const u = this.constructor.vueConfig;
    this._propsRef.value = t, this._errorsRef.value = o, this._contentRef.value = s ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const h of o)
      this.emitEvent("invalid", { message: h });
    const l = new AbortController();
    this._bridgeAbort = l, this.reactive.props.subscribe((h, b) => {
      this._propsRef.value = h, this._errorsRef.value = [...b];
      for (const m of b)
        this.emitEvent("invalid", { message: m });
    }, { signal: l.signal }), this.reactive.content && this.reactive.content.subscribe((h) => {
      this._contentRef.value = h;
    }, { signal: l.signal }), this.reactive.hostVisibility.subscribe((h) => {
      this._hostVisibilityRef.value = h;
    }, { signal: l.signal });
    const d = (h) => {
      if (l.signal.aborted)
        return;
      const b = ee(), m = Vr(h.rootComponent);
      this._vueApp = m;
      const V = te();
      if (h.piniaPlugins)
        for (const L of h.piniaPlugins)
          V.use(L);
      if (m.use(V), h.plugins)
        for (const L of h.plugins)
          m.use(L);
      m.provide(se, this._propsRef), m.provide(ne, this._errorsRef), m.provide(ae, this.emitEvent.bind(this)), m.provide(pe, this._contentRef), m.provide(ue, this._hostVisibilityRef), m.provide(ce, re(this)), m.provide(le, Zr(this)), m.provide(de, sr(this)), h.providers && h.providers(m, this), m.mount(e), b && pr(b);
    };
    if (u.rootComponent)
      d(u);
    else if (u.lazyConfig) {
      const h = document.createElement("wippy-loading");
      h.setAttribute("no-bg", ""), e.appendChild(h), u.lazyConfig().then((b) => {
        l.signal.aborted || (h.remove(), d(b));
      }).catch((b) => {
        if (l.signal.aborted)
          return;
        const m = b instanceof Error ? b.message : String(b), V = document.createElement("wippy-error");
        V.setAttribute("title", "Failed to load"), V.setAttribute("message", m), h.replaceWith(V), this.emitEvent("error", { message: m });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
};
const tr = {
  request: "kickside.research.events:request",
  progress: "kickside.research.events:progress",
  result: "kickside.research.events:result",
  failed: "kickside.research.events:failed"
}, ve = Object.fromEntries(
  Object.keys(tr).map((r) => [tr[r], r])
);
function O(r) {
  return ve[String(r?.type ?? "")] ?? "progress";
}
function or(r) {
  const e = typeof r == "string" ? r : "";
  return e.trim() ? e : "";
}
function me(r, e) {
  for (const t of r) {
    if (O(t) !== "result") continue;
    const o = or(t.body?.markdown);
    if (o) return o;
  }
  return or(e);
}
function fe(r) {
  return r === "failed" ? "No report was produced." : r === "complete" ? "This run completed without a report." : "The report will appear here when the run completes.";
}
const ge = { class: "kx" }, xe = { class: "kx-head" }, be = { class: "kx-head-icon" }, ye = { class: "kx-body" }, ke = ["disabled"], we = { class: "kx-controls" }, _e = { class: "kx-field" }, Ce = { class: "kx-field" }, Se = ["disabled"], Ee = ["disabled"], Ve = {
  key: 0,
  class: "kx-err"
}, Pe = {
  key: 1,
  class: "kx-empty"
}, Re = {
  key: 2,
  class: "kx-section"
}, Te = { class: "kx-section-title" }, Ae = { class: "kx-list" }, Ie = ["onClick"], ze = { class: "kx-id" }, Oe = ["title"], Le = { class: "kx-sub" }, Ne = {
  key: 0,
  class: "kx-detail"
}, Ue = { class: "kx-detail-head" }, je = { class: "kx-run-summary" }, Be = {
  key: 0,
  class: "kx-run-time"
}, De = {
  key: 0,
  class: "kx-source-strip",
  "aria-label": "Sources"
}, $e = ["href"], He = {
  key: 0,
  class: "kx-source-more"
}, Me = { class: "kx-detail-grid" }, Fe = { class: "kx-panel kx-timeline-panel" }, We = { class: "kx-panel-title" }, Ke = { class: "kx-timeline" }, qe = { class: "kx-timeline-dot" }, Ye = { class: "kx-timeline-body" }, Je = { class: "kx-timeline-title" }, Ge = { class: "kx-timeline-text" }, Qe = {
  key: 0,
  class: "kx-finding-list"
}, Xe = {
  key: 1,
  class: "kx-next-step"
}, Ze = {
  key: 0,
  class: "kx-timeline-row live"
}, rt = { class: "kx-timeline-dot" }, et = { class: "kx-timeline-body" }, tt = { class: "kx-timeline-title" }, ot = { class: "kx-timeline-text" }, it = { class: "kx-panel kx-report-panel" }, at = { class: "kx-panel-title" }, st = {
  key: 1,
  class: "kx-report-empty"
}, nt = {
  key: 3,
  class: "kx-empty"
}, $ = "kickside.research.agents:researcher", pt = "kickside.threads", ct = /* @__PURE__ */ Pr({
  __name: "research",
  setup(r) {
    const e = _(""), t = _(!1), o = _(""), s = _($), c = _(20), u = _([]), l = _(""), d = _([]), h = _(!0);
    let b = null, m = null;
    async function V() {
      if (I)
        try {
          const { data: i } = await I.get("/api/v1/research/list?limit=100");
          i?.success && (u.value = i.items ?? []), o.value = "";
        } catch (i) {
          o.value = i?.message || "failed to load research";
        } finally {
          h.value = !1;
        }
    }
    function L(i) {
      const a = i.detail, k = a && Array.isArray(a.selected) ? a.selected.map(String) : [];
      s.value = k[0] || $;
    }
    async function B(i) {
      if (!(!I || !i))
        try {
          const { data: a } = await I.get(`/api/v1/research/${encodeURIComponent(i)}/events`);
          a?.success && l.value === i && (d.value = a.events ?? []);
        } catch {
        }
    }
    function dr() {
      m || (m = setTimeout(() => {
        m = null, V(), l.value && B(l.value);
      }, 400));
    }
    async function ur() {
      const i = e.value.trim();
      if (!(!i || t.value || !I)) {
        t.value = !0, o.value = "";
        try {
          const a = s.value || $, k = Math.max(1, Math.min(Number(c.value) || 20, 50)), { data: C } = await I.post("/api/v1/research", { prompt: i, agent_id: a, max_iterations: k });
          if (!C?.success) {
            o.value = C?.error || "failed to start research";
            return;
          }
          e.value = "", u.value.unshift({
            research_id: C.research_id,
            thread_id: C.thread_id,
            agent_id: a,
            status: C.status || "running",
            title: i
          }), l.value = C.research_id, d.value = [], B(C.research_id);
        } catch (a) {
          o.value = a?.message || "request failed";
        } finally {
          t.value = !1;
        }
      }
    }
    function hr(i) {
      if (l.value === i) {
        l.value = "", d.value = [];
        return;
      }
      l.value = i, d.value = [], B(i);
    }
    function M() {
      return d.value.filter((i) => O(i) !== "result");
    }
    function vr(i) {
      const a = O(i), k = i.body || {};
      return a === "request" ? "Brief received" : a === "failed" ? "Run failed" : a === "result" ? "Report ready" : k.status ? String(k.status) : "Progress update";
    }
    function mr(i) {
      const a = i.body || {}, k = O(i);
      return k === "request" ? a.prompt || "The research brief was queued." : k === "progress" ? a.step || "Working through the research plan." : k === "failed" ? a.error || "The research run failed." : "The final report is ready.";
    }
    function fr(i) {
      const a = O(i);
      return a === "request" ? "tabler:clipboard-text" : a === "failed" ? "tabler:alert-triangle" : a === "result" ? "tabler:file-check" : "tabler:activity";
    }
    function F(i) {
      return (i.body && Array.isArray(i.body.findings) ? i.body.findings : []).map(String).filter(Boolean);
    }
    function gr(i) {
      return (i.body && Array.isArray(i.body.urls) ? i.body.urls : []).map(String).filter(Boolean);
    }
    function W(i) {
      return me(d.value, i?.result_md);
    }
    function N(i) {
      const a = /* @__PURE__ */ new Set(), k = [], C = (n) => {
        const x = String(n || "").trim();
        !x || a.has(x) || (a.add(x), k.push(x));
      };
      for (const n of i.urls || []) C(n);
      for (const n of d.value) for (const x of gr(n)) C(x);
      return k;
    }
    function xr(i) {
      try {
        return new URL(i).hostname.replace(/^www\./, "");
      } catch {
        return i;
      }
    }
    function K(i) {
      if (!i) return "";
      const a = new Date(i);
      return Number.isNaN(a.getTime()) ? "" : a.toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    function q(i) {
      return i === "complete" ? "tabler:circle-check" : i === "failed" ? "tabler:alert-circle" : "tabler:loader-2";
    }
    function br(i) {
      return i === "complete" ? "Complete" : i === "failed" ? "Failed" : i === "pending" ? "Queued" : "Running";
    }
    const yr = Rr(() => u.value.some((i) => i.status === "running" || i.status === "pending"));
    return Tr(async () => {
      try {
        Z("wc-agent-picker", { timeoutMs: 8e3 }).catch(() => {
        }), Z("wc-render-markdown", { timeoutMs: 8e3 }).catch(() => {
        }), await V(), b = ir(pt, dr);
      } catch (i) {
        o.value = i instanceof Error ? i.message : "host API unavailable", h.value = !1;
      }
    }), Ar(() => {
      if (b)
        try {
          b();
        } catch {
        }
      m && clearTimeout(m);
    }), (i, a) => {
      const k = Y("wc-agent-picker"), C = Y("wc-render-markdown");
      return v(), f("div", ge, [
        p("header", xe, [
          p("div", be, [
            S(w(E), {
              icon: "tabler:world-search",
              "aria-hidden": "true"
            })
          ]),
          a[2] || (a[2] = p("div", { class: "kx-head-text" }, [
            p("h1", { class: "kx-title" }, "Research"),
            p("p", { class: "kx-sub" }, "Enter a prompt — an agent researches it and reports back here live.")
          ], -1))
        ]),
        p("div", ye, [
          p("form", {
            class: "kx-compose",
            onSubmit: Ir(ur, ["prevent"])
          }, [
            J(p("textarea", {
              "onUpdate:modelValue": a[0] || (a[0] = (n) => e.value = n),
              rows: "2",
              class: "kx-input kx-prompt",
              placeholder: "What should the agent research? e.g. The economic impact of solar power in 2026",
              disabled: t.value
            }, null, 8, ke), [
              [G, e.value]
            ]),
            p("div", we, [
              p("label", _e, [
                a[3] || (a[3] = p("span", { class: "kx-field-label" }, "Agent", -1)),
                S(k, {
                  placeholder: "Pick an agent…",
                  multi: "false",
                  selected: JSON.stringify([s.value]),
                  onChange: L
                }, null, 8, ["selected"])
              ]),
              p("label", Ce, [
                a[4] || (a[4] = p("span", { class: "kx-field-label" }, "Iterations", -1)),
                J(p("input", {
                  "onUpdate:modelValue": a[1] || (a[1] = (n) => c.value = n),
                  type: "number",
                  min: "1",
                  max: "50",
                  class: "kx-input kx-iter-input",
                  disabled: t.value
                }, null, 8, Se), [
                  [
                    G,
                    c.value,
                    void 0,
                    { number: !0 }
                  ]
                ])
              ]),
              p("button", {
                type: "submit",
                class: "kx-btn kx-btn-primary kx-controls-btn",
                disabled: t.value || !e.value.trim()
              }, [
                S(w(E), {
                  icon: t.value ? "tabler:loader-2" : "tabler:search",
                  class: A(t.value && "spin"),
                  "aria-hidden": "true"
                }, null, 8, ["icon", "class"]),
                P(" " + y(t.value ? "Starting…" : "Research"), 1)
              ], 8, Ee)
            ])
          ], 32),
          o.value ? (v(), f("div", Ve, y(o.value), 1)) : R("", !0),
          h.value ? (v(), f("div", Pe, [...a[5] || (a[5] = [
            p("div", { class: "kx-empty-sub" }, "Loading…", -1)
          ])])) : u.value.length ? (v(), f("section", Re, [
            p("h2", Te, [
              a[6] || (a[6] = P(" Your research ", -1)),
              yr.value ? (v(), Q(w(E), {
                key: 0,
                icon: "tabler:loader-2",
                class: "spin kx-live",
                "aria-hidden": "true"
              })) : R("", !0)
            ]),
            p("ul", Ae, [
              (v(!0), f(T, null, U(u.value, (n) => (v(), f("li", {
                key: n.research_id,
                class: A(["kx-row", { open: l.value === n.research_id }])
              }, [
                p("button", {
                  class: "kx-row-head",
                  onClick: (x) => hr(n.research_id)
                }, [
                  S(w(E), {
                    icon: q(n.status),
                    class: A(["kx-row-ico", n.status, (n.status === "running" || n.status === "pending") && "spin"]),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"]),
                  p("div", ze, [
                    p("div", {
                      class: "kx-name",
                      title: n.title
                    }, y(n.title || "Untitled research"), 9, Oe),
                    p("div", Le, [
                      n.status === "complete" ? (v(), f(T, { key: 0 }, [
                        P("Complete")
                      ], 64)) : n.status === "failed" ? (v(), f(T, { key: 1 }, [
                        P("Failed" + y(n.latest_step ? ": " + n.latest_step : ""), 1)
                      ], 64)) : (v(), f(T, { key: 2 }, [
                        P(y(n.latest_step || "Researching…"), 1)
                      ], 64))
                    ])
                  ]),
                  S(w(E), {
                    icon: l.value === n.research_id ? "tabler:chevron-up" : "tabler:chevron-down",
                    class: "kx-chev",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ], 8, Ie),
                l.value === n.research_id ? (v(), f("div", Ne, [
                  p("div", Ue, [
                    p("div", je, [
                      p("span", {
                        class: A(["kx-status-pill", n.status])
                      }, [
                        S(w(E), {
                          icon: q(n.status),
                          class: A((n.status === "running" || n.status === "pending") && "spin"),
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "class"]),
                        P(" " + y(br(n.status)), 1)
                      ], 2),
                      K(n.updated_at || n.created_at) ? (v(), f("span", Be, y(K(n.updated_at || n.created_at)), 1)) : R("", !0)
                    ]),
                    N(n).length ? (v(), f("div", De, [
                      (v(!0), f(T, null, U(N(n).slice(0, 6), (x) => (v(), f("a", {
                        key: x,
                        class: "kx-source-chip",
                        href: x,
                        target: "_blank",
                        rel: "noreferrer"
                      }, [
                        S(w(E), {
                          icon: "tabler:link",
                          "aria-hidden": "true"
                        }),
                        P(" " + y(xr(x)), 1)
                      ], 8, $e))), 128)),
                      N(n).length > 6 ? (v(), f("span", He, "+" + y(N(n).length - 6), 1)) : R("", !0)
                    ])) : R("", !0)
                  ]),
                  p("div", Me, [
                    p("section", Fe, [
                      p("div", We, [
                        S(w(E), {
                          icon: "tabler:timeline-event",
                          "aria-hidden": "true"
                        }),
                        a[7] || (a[7] = P(" Progress ", -1))
                      ]),
                      p("ol", Ke, [
                        (v(!0), f(T, null, U(M(), (x) => (v(), f("li", {
                          key: x.seq,
                          class: A(["kx-timeline-row", w(O)(x)])
                        }, [
                          p("div", qe, [
                            S(w(E), {
                              icon: fr(x),
                              "aria-hidden": "true"
                            }, null, 8, ["icon"])
                          ]),
                          p("div", Ye, [
                            p("div", Je, y(vr(x)), 1),
                            p("div", Ge, y(mr(x)), 1),
                            F(x).length ? (v(), f("ul", Qe, [
                              (v(!0), f(T, null, U(F(x), (kr, wr) => (v(), f("li", { key: wr }, y(kr), 1))), 128))
                            ])) : R("", !0),
                            x.body && x.body.eta ? (v(), f("div", Xe, "Next: " + y(x.body.eta), 1)) : R("", !0)
                          ])
                        ], 2))), 128)),
                        n.status === "running" || n.status === "pending" ? (v(), f("li", Ze, [
                          p("div", rt, [
                            S(w(E), {
                              icon: "tabler:loader-2",
                              class: "spin",
                              "aria-hidden": "true"
                            })
                          ]),
                          p("div", et, [
                            p("div", tt, y(M().length ? "Agent working" : "Waiting for first update"), 1),
                            p("div", ot, y(n.latest_step || "The run is active. Progress appears here as the agent reports back."), 1)
                          ])
                        ])) : R("", !0)
                      ])
                    ]),
                    p("section", it, [
                      p("div", at, [
                        S(w(E), {
                          icon: "tabler:file-analytics",
                          "aria-hidden": "true"
                        }),
                        a[8] || (a[8] = P(" Report ", -1))
                      ]),
                      W(n) ? (v(), Q(C, {
                        key: 0,
                        class: "kx-result",
                        source: W(n)
                      }, null, 8, ["source"])) : (v(), f("div", st, [
                        S(w(E), {
                          icon: "tabler:hourglass",
                          "aria-hidden": "true"
                        }),
                        p("span", null, y(w(fe)(n.status)), 1)
                      ]))
                    ])
                  ])
                ])) : R("", !0)
              ], 2))), 128))
            ])
          ])) : (v(), f("div", nt, [...a[9] || (a[9] = [
            p("div", { class: "kx-empty-title" }, "No research yet", -1),
            p("div", { class: "kx-empty-sub" }, "Enter a prompt above to run a research pass. Progress appears here live.", -1)
          ])]))
        ])
      ]);
    };
  }
}), lt = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.kx{font-family:inherit;color:var(--p-text-color);background:var(--p-content-background);height:100%;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-body{flex:1;min-height:0;padding:6px 24px 24px;display:flex;flex-direction:column;gap:18px}.kx-compose{display:flex;flex-direction:column;gap:12px;padding:16px;box-sizing:border-box;max-width:1100px;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background)}.kx-input{width:100%;box-sizing:border-box;height:34px;padding:0 12px;font:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:8px;transition:border-color .15s,box-shadow .15s}.kx-prompt{height:auto;min-height:46px;padding:9px 12px;line-height:1.45;resize:vertical}.kx-input:focus{outline:none;border-color:var(--p-primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--p-primary-color) 18%,transparent)}.kx-input:disabled{opacity:.55;cursor:default}.kx-input::placeholder{color:var(--p-text-muted-color)}.kx-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 16px;border-radius:8px;border:1px solid transparent;font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:filter .15s,background .15s,opacity .15s}.kx-btn:disabled{opacity:.45;cursor:default}.kx-btn svg{width:16px;height:16px}.kx-btn-primary{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.kx-btn-primary:hover:not(:disabled){filter:brightness(1.05)}.kx-err{padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-section{display:flex;flex-direction:column;gap:10px}.kx-section-title{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color);margin:0}.kx-list{display:flex;flex-direction:column;list-style:none;margin:0;padding:0;border:1px solid var(--p-content-border-color);border-radius:14px;overflow:hidden;background:var(--p-content-background);max-width:1100px}.kx-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--p-content-border-color)}.kx-row:last-child{border-bottom:none}.kx-row-ico{width:18px;height:18px;flex:none;color:var(--p-primary-color)}.kx-row-ico.done{color:var(--p-success-500)}.kx-id{min-width:0}.kx-name{font-size:14px;font-weight:600;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-empty{text-align:center;padding:56px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color)}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:360px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}.kx-row{display:block;padding:0}.kx-row-head{display:flex;align-items:center;gap:12px;width:100%;padding:12px 16px;background:none;border:none;cursor:pointer;text-align:left;color:inherit;font:inherit}.kx-row-head:hover{background:color-mix(in srgb,var(--p-text-color) 4%,transparent)}.kx-row.open>.kx-row-head{background:color-mix(in srgb,var(--p-primary-color) 7%,transparent)}.kx-id{flex:1}.kx-row-ico.complete{color:var(--p-success-500)}.kx-row-ico.failed{color:var(--p-danger-500)}.kx-chev{width:16px;height:16px;flex:none;color:var(--p-text-muted-color)}.kx-live{width:14px;height:14px;color:var(--p-primary-color);vertical-align:-2px;margin-left:6px}.kx-result{padding:6px 16px 16px 46px;font-size:13px;line-height:1.55;color:var(--p-text-color);border-top:1px solid var(--p-content-border-color)}.kx-result h3{font-size:15px;font-weight:700;margin:12px 0 4px}.kx-result h4{font-size:13px;font-weight:700;color:var(--p-text-muted-color);margin:10px 0 2px}.kx-result p{margin:6px 0}.kx-result li{margin:2px 0 2px 18px}.kx-result a{color:var(--p-primary-color);text-decoration:none}.kx-result a:hover{text-decoration:underline}.kx-result-empty{color:var(--p-text-muted-color);font-style:italic}.kx-controls{display:grid;grid-template-columns:1fr 110px auto;gap:12px;align-items:end}.kx-field{display:flex;flex-direction:column;gap:4px;min-width:0}.kx-field-label{font-size:11px;font-weight:600;color:var(--p-text-muted-color);text-transform:uppercase;letter-spacing:.03em}.kx-field wc-agent-picker{display:block;width:100%}.kx-iter-input{width:100%;text-align:center}.kx-controls-btn{height:34px;white-space:nowrap}@media(max-width:560px){.kx-controls{grid-template-columns:1fr}}.kx-log-body{min-width:0;flex:1}.kx-log-find{margin:3px 0 0;padding-left:16px;list-style:disc;color:var(--p-text-muted-color)}.kx-log-find li{margin:1px 0}.kx-log-eta{font-size:11px;color:var(--p-text-muted-color);margin-top:2px}.kx-detail{border-top:1px solid var(--p-content-border-color);background:color-mix(in srgb,var(--p-text-color) 2%,transparent)}.kx-detail-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px 10px 46px;border-bottom:1px solid var(--p-content-border-color)}.kx-run-summary{display:flex;align-items:center;gap:10px;min-width:0}.kx-status-pill{display:inline-flex;align-items:center;gap:6px;min-height:24px;padding:2px 9px;border:1px solid var(--p-content-border-color);border-radius:999px;font-size:12px;font-weight:700;color:var(--p-text-color);background:var(--p-content-background)}.kx-status-pill svg{width:14px;height:14px}.kx-status-pill.running,.kx-status-pill.pending{color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 10%,transparent);border-color:color-mix(in srgb,var(--p-primary-color) 22%,var(--p-content-border-color))}.kx-status-pill.complete{color:var(--p-success-600, var(--p-success-500));background:color-mix(in srgb,var(--p-success-500) 11%,transparent);border-color:color-mix(in srgb,var(--p-success-500) 24%,var(--p-content-border-color))}.kx-status-pill.failed{color:var(--p-danger-600, var(--p-danger-500));background:color-mix(in srgb,var(--p-danger-500) 10%,transparent);border-color:color-mix(in srgb,var(--p-danger-500) 24%,var(--p-content-border-color))}.kx-run-time{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap}.kx-source-strip{display:flex;align-items:center;justify-content:flex-end;gap:6px;min-width:0;flex-wrap:wrap}.kx-source-chip{display:inline-flex;align-items:center;gap:5px;max-width:170px;min-height:24px;padding:2px 8px;border-radius:999px;border:1px solid var(--p-content-border-color);color:var(--p-primary-color);background:var(--p-content-background);text-decoration:none;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kx-source-chip svg{width:13px;height:13px;flex:none}.kx-source-chip:hover{background:color-mix(in srgb,var(--p-primary-color) 8%,transparent)}.kx-source-more{font-size:12px;color:var(--p-text-muted-color);white-space:nowrap}.kx-detail-grid{display:grid;grid-template-columns:minmax(270px,.44fr) minmax(0,1fr);gap:12px;padding:12px 16px 16px 46px;align-items:start}.kx-panel{min-width:0;border:1px solid var(--p-content-border-color);border-radius:10px;background:var(--p-content-background);overflow:hidden}.kx-panel-title{display:flex;align-items:center;gap:7px;min-height:34px;padding:8px 11px;border-bottom:1px solid var(--p-content-border-color);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--p-text-muted-color)}.kx-panel-title svg{width:15px;height:15px;color:var(--p-primary-color)}.kx-timeline{list-style:none;margin:0;padding:10px 12px 12px;display:flex;flex-direction:column;gap:0}.kx-timeline-row{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);gap:9px;padding:0 0 13px}.kx-timeline-row:not(:last-child):after{content:"";position:absolute;left:11px;top:24px;bottom:0;width:1px;background:var(--p-content-border-color)}.kx-timeline-dot{position:relative;z-index:1;width:24px;height:24px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:var(--p-primary-color);background:color-mix(in srgb,var(--p-primary-color) 10%,var(--p-content-background));border:1px solid color-mix(in srgb,var(--p-primary-color) 22%,var(--p-content-border-color))}.kx-timeline-row.failed .kx-timeline-dot{color:var(--p-danger-500);background:color-mix(in srgb,var(--p-danger-500) 10%,var(--p-content-background));border-color:color-mix(in srgb,var(--p-danger-500) 24%,var(--p-content-border-color))}.kx-timeline-row.live .kx-timeline-dot{color:var(--p-primary-color)}.kx-timeline-dot svg{width:14px;height:14px}.kx-timeline-body{min-width:0;padding-top:1px}.kx-timeline-title{font-size:13px;font-weight:750;color:var(--p-text-color)}.kx-timeline-text{margin-top:2px;font-size:12.5px;line-height:1.45;color:var(--p-text-muted-color);overflow-wrap:anywhere}.kx-finding-list{margin:7px 0 0;padding-left:16px;color:var(--p-text-color);font-size:12.5px;line-height:1.45}.kx-finding-list li{margin:2px 0}.kx-next-step{margin-top:6px;font-size:11.5px;color:var(--p-text-muted-color)}.kx-report-panel{min-height:210px}.kx-report-empty{display:flex;align-items:center;justify-content:center;gap:8px;min-height:166px;padding:18px;text-align:center;color:var(--p-text-muted-color);font-size:13px}.kx-report-empty svg{width:17px;height:17px;color:var(--p-primary-color)}.kx-log{list-style:none;margin:0;padding:8px 16px 8px 46px;display:flex;flex-direction:column;gap:4px}.kx-log-row{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;line-height:1.5;color:var(--p-text-color)}.kx-log-ico{width:14px;height:14px;flex:none;margin-top:2px;color:var(--p-primary-color)}.kx-log-row.failed .kx-log-ico{color:var(--p-danger-500)}.kx-log-row.result .kx-log-ico{color:var(--p-success-500)}.kx-log-text{min-width:0;word-break:break-word}.kx-muted{color:var(--p-text-muted-color)}.kx-detail .kx-result{padding-top:8px}@media(max-width:860px){.kx-detail-head{align-items:flex-start;flex-direction:column;padding-left:16px}.kx-source-strip{justify-content:flex-start}.kx-detail-grid{grid-template-columns:1fr;padding-left:16px}}@media(prefers-color-scheme:dark){:host{--p-primary-contrast-color: var(--p-surface-0) !important}}', dt = { props: { type: "object", properties: {} } }, ut = {
  wippy: dt
};
class lr extends he {
  static get wippyConfig() {
    return {
      propsSchema: ut.wippy.props,
      hostCssKeys: ["themeConfigUrl"],
      inlineCss: lt
    };
  }
  static get vueConfig() {
    return { rootComponent: ct };
  }
}
async function ft() {
  return lr;
}
jr(import.meta.url, lr);
export {
  ft as webComponent
};
//# sourceMappingURL=index.js.map
