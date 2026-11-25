import { u as ia, a as bl, b as yl, c as pl, P as hl } from "./wc-runtime-Ch_wJl3O.js";
import { defineComponent as se, useId as ve, openBlock as l, createElementBlock as i, unref as a, normalizeClass as ue, createElementVNode as s, createTextVNode as G, toDisplayString as p, createCommentVNode as T, renderSlot as ze, computed as H, createBlock as P, resolveDynamicComponent as gl, normalizeProps as kl, guardReactiveProps as $l, createSlots as ya, withCtx as L, Fragment as Y, renderList as me, inject as wl, reactive as Da, createVNode as t, watch as Z, nextTick as Be, ref as h, onBeforeUnmount as na, shallowRef as he, withModifiers as Ue, useModel as pa, mergeModels as la, defineAsyncComponent as ca, withDirectives as _l, vShow as xl, provide as Cl } from "vue";
import { host as Te, api as Vl, on as Sl } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import { u as Ie, l as le, k as pe, b as oa, A as Tl, e as ge, p as ye, d as ne, w as qa, a as xe, _ as Fe, c as ha, f as fe, s as Ba, i as Je, g as Ce, h as ga, j as We, m as Ha, o as ra, n as Rl, q as ta, r as Fa, t as Ja, v as Wa, x as Ul, y as Ka, z as Ya, B as sa, C as Al, D as Il, E as Ll, F as jl } from "./latestRequest-9-3hn826.js";
import Pe from "primevue/skeleton";
import D from "primevue/button";
import ce from "primevue/column";
import ka from "primevue/datatable";
import $a from "primevue/iconfield";
import wa from "primevue/inputicon";
import de from "primevue/inputtext";
import Ve from "primevue/selectbutton";
import Re from "primevue/dialog";
import El from "primevue/progressbar";
import Ae from "primevue/tag";
import _a from "primevue/select";
import Nl from "primevue/accordion";
import zl from "primevue/accordioncontent";
import Ml from "primevue/accordionheader";
import Pl from "primevue/accordionpanel";
import Ol from "primevue/menu";
import Dl from "primevue/checkbox";
import ql from "primevue/inputnumber";
import va from "primevue/textarea";
import Ga from "primevue/drawer";
import Bl from "primevue/fileupload";
const Hl = ["aria-labelledby"], Fl = { class: "kx-railhead" }, Jl = ["id"], Wl = { key: 0 }, Kl = { class: "kx-railhead-acts" }, Yl = { class: "kx-rail-body" }, Gl = /* @__PURE__ */ se({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const r = ve();
    return (o, d) => (l(), i("aside", {
      class: ue(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(r)
    }, [
      s("div", Fl, [
        s("span", {
          id: a(r),
          class: "kx-railhead-title"
        }, [
          G(p(e.title), 1),
          e.count !== void 0 ? (l(), i("b", Wl, p(e.count), 1)) : T("", !0)
        ], 8, Jl),
        s("div", Kl, [
          ze(o.$slots, "actions")
        ])
      ]),
      ze(o.$slots, "toolbar"),
      s("div", Yl, [
        ze(o.$slots, "default")
      ])
    ], 10, Hl));
  }
}), Zl = ["aria-label"], Ql = {
  key: 0,
  class: "kx-settings-rail-group"
}, Xl = ["aria-current", "onClick"], et = { class: "kx-settings-rail-label" }, at = /* @__PURE__ */ se({
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
    const r = e, o = H(() => r.leadingItem ? [{ items: [r.leadingItem] }, ...r.groups] : r.groups);
    function d(y) {
      const u = [...y.currentTarget.querySelectorAll(".kx-settings-rail-item")], R = u.indexOf(y.target);
      if (R < 0) return;
      let f;
      switch (y.key) {
        case "ArrowDown":
        case "ArrowRight":
          f = (R + 1) % u.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          f = (R + u.length - 1) % u.length;
          break;
        case "Home":
          f = 0;
          break;
        case "End":
          f = u.length - 1;
          break;
        default:
          return;
      }
      y.preventDefault(), u[f]?.focus();
    }
    return (y, u) => (l(), P(gl(e.title ? Gl : "div"), kl($l(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ya({
      default: L(() => [
        s("nav", {
          class: ue(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: d
        }, [
          (l(!0), i(Y, null, me(o.value, (R, f) => (l(), i("div", {
            key: R.items[0]?.value ?? f,
            class: ue(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && f === 0 }])
          }, [
            R.heading ? (l(), i("div", Ql, p(R.heading), 1)) : T("", !0),
            (l(!0), i(Y, null, me(R.items, (C) => (l(), i("button", {
              key: C.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": C.value === e.value ? "true" : void 0,
              onClick: (U) => y.$emit("update:value", C.value)
            }, [
              C.icon ? (l(), P(a(N), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: C.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : T("", !0),
              s("span", et, p(C.label), 1)
            ], 8, Xl))), 128))
          ], 2))), 128))
        ], 42, Zl)
      ]),
      _: 2
    }, [
      e.title && y.$slots.actions ? {
        name: "actions",
        fn: L(() => [
          ze(y.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Za = Symbol("mail-admin");
function be() {
  const e = wl(Za);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function Qa(e) {
  const { kind: r, name: o, title: d, description: y, state: u, revision: R, origin: f, origin_label: C, base: U, author: n, author_label: $, updated_at: S, used_by: g } = e, x = g && {
    messages: g.messages?.length,
    recent_sources: g.recent_senders?.length
  };
  return { kind: r, name: o, title: d, description: y, state: u, revision: R, origin: f, origin_label: C, base: U, author: n, author_label: $, updated_at: S, used_by: x };
}
const Me = 100, ma = 50;
function lt() {
  const e = Da(/* @__PURE__ */ new Map()), r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  let d = !1;
  const y = (w, m) => `${w}/${m}`;
  function u(w) {
    for (const m of w) e.set(y(m.kind, m.name), m);
  }
  async function R(w, m) {
    for (let c = 0; c < m.length; c += Me) {
      const b = m.slice(c, c + Me);
      try {
        const j = await le.page({ kind: w, names: b, limit: Me });
        u(j.items);
      } catch {
      } finally {
        for (const j of b)
          o.delete(y(w, j)), e.has(y(w, j)) || e.set(y(w, j), null);
      }
    }
  }
  function f() {
    d = !1;
    const w = [...r.entries()];
    r.clear();
    for (const [m, c] of w) R(m, [...c]);
  }
  function C(w, m) {
    const c = y(w, m);
    if (e.has(c) || o.has(c)) return;
    o.add(c);
    const b = r.get(w) ?? /* @__PURE__ */ new Set();
    b.add(m), r.set(w, b), d || (d = !0, queueMicrotask(f));
  }
  function U(w, m) {
    const c = e.get(y(w, m));
    return c === void 0 && C(w, m), c ?? void 0;
  }
  function n(w, m) {
    const c = e.get(y(w, m));
    if (c === void 0) {
      C(w, m);
      return;
    }
    return c !== null;
  }
  function $(w, m) {
    const c = e.get(y(w, m));
    if (c === void 0) {
      C(w, m);
      return;
    }
    return c?.title ?? m;
  }
  async function S(w, m, c) {
    const b = await le.page({ kind: w, q: m || void 0, names: c, limit: ma });
    return u(b.items), b;
  }
  function g(w, m, c) {
    e.set(y(w, m), c ?? null);
  }
  function x() {
    e.clear();
  }
  return Ie("mail.library", x), { find: U, exists: n, title: $, search: S, remember: u, patch: g, refresh: x };
}
const tt = { class: "kx-empty" }, st = { class: "kx-empty-ico" }, it = { class: "kx-empty-title" }, nt = {
  key: 0,
  class: "kx-empty-sub"
}, xa = /* @__PURE__ */ se({
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
    return (r, o) => (l(), i("div", tt, [
      s("div", st, [
        t(a(N), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      s("div", it, p(e.title), 1),
      e.hint || r.$slots.hint ? (l(), i("p", nt, [
        ze(r.$slots, "hint", {}, () => [
          G(p(e.hint), 1)
        ])
      ])) : T("", !0),
      e.cta ? (l(), P(a(D), {
        key: 1,
        label: e.cta,
        onClick: o[0] || (o[0] = (d) => r.$emit("cta"))
      }, ya({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: L(({ class: d }) => [
            t(a(N), {
              icon: e.ctaIcon,
              class: ue(d),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : T("", !0)
    ]));
  }
}), Ca = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Xa = Object.fromEntries(Object.entries(Ca).map(([e, r]) => [r, e])), ot = ["content", "variables", "used-by", "history"];
function fa(e) {
  return Ca[e];
}
function rt(e) {
  return Xa[e];
}
function el(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : ot;
}
function Ee(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${Ca[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Ma(e) {
  const r = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, d, y] = r;
  if (!o) return { name: "library", section: "all" };
  try {
    if (o === "activity")
      return d === "template" && y ? { name: "activity", template: decodeURIComponent(y) } : d ? { name: "activity", message: decodeURIComponent(d) } : { name: "activity" };
    if (o === "assets") return d ? { name: "library", section: "assets", asset: decodeURIComponent(d) } : { name: "library", section: "assets" };
    const u = Xa[o];
    if (!u) return { name: "library", section: "all" };
    if (!d) return { name: "library", section: o };
    const f = el(u).find((C) => C === y) ?? "content";
    return { name: "resource", kind: u, resource: decodeURIComponent(d), section: f };
  } catch {
    return { name: "library", section: "all" };
  }
}
const ut = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", dt = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${ut}"><base target="_blank">`;
function Va(e, r) {
  let o = e;
  for (const [d, y] of Object.entries(r ?? {}))
    o = o.split("cid:" + d).join(y);
  return dt + o;
}
function ct() {
  let e = document.activeElement;
  for (; e?.shadowRoot?.activeElement; ) e = e.shadowRoot.activeElement;
  return e instanceof HTMLElement ? e : null;
}
function ke(e) {
  let r = null;
  Z(e, (o) => {
    if (o) {
      r = ct();
      return;
    }
    const d = r;
    r = null, Be(() => {
      d?.isConnected && d.focus();
    });
  });
}
const vt = {
  class: "mail-problem",
  role: "alert"
}, mt = { class: "mail-problem-lead" }, ft = {
  key: 0,
  class: "mail-problem-detail"
}, bt = {
  key: 1,
  class: "mail-problem-involved"
}, yt = {
  key: 0,
  class: "mail-problem-self"
}, ba = /* @__PURE__ */ se({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const r = e, { library: o, go: d } = be(), y = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, u = (n) => o.title(n.kind, n.name), R = (n) => !!n && !!r.draft && n.kind === r.draft.kind && n.name === r.draft.name, f = H(() => {
      const { resource: n, face: $, previewOf: S } = r.problem, g = $ ? y[$] : "";
      if (n && r.draft && r.draft.kind !== "message" && n.kind === "message" && n.name === S)
        return `${u(n) ?? "The message"} does not render with your changes.`;
      if (r.problem.tooLarge) {
        const x = !n || R(n) ? r.draft ? `this ${pe[r.draft.kind].toLowerCase()}` : "it" : u(n) ?? "a resource it uses";
        return `The ${g || "content"} of ${x} is larger than Mail can send. Keep each rendered face under ${oa(r.problem.tooLarge)}.`;
      }
      if (!n || R(n)) {
        const x = r.draft ? `this ${pe[r.draft.kind].toLowerCase()}` : "it";
        return g ? `The ${g} of ${x} does not render.` : `${x[0].toUpperCase()}${x.slice(1)} does not render.`;
      }
      return `${u(n) ?? "A resource it uses"} does not render${g ? ` (${g})` : ""}.`;
    }), C = H(() => r.problem.candidates ?? []);
    function U(n) {
      n.kind === "asset" ? d({ name: "library", section: "assets", asset: n.name }) : d({ name: "resource", kind: n.kind, resource: n.name, section: "content" });
    }
    return (n, $) => (l(), i("div", vt, [
      s("p", mt, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, p(f.value), 1)
      ]),
      e.problem.tooLarge ? T("", !0) : (l(), i("code", ft, p(e.problem.engine ?? e.problem.message), 1)),
      C.value.length ? (l(), i("p", bt, [
        $[0] || ($[0] = s("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), i(Y, null, me(C.value, (S) => (l(), i(Y, {
          key: S.kind + S.name
        }, [
          R(S) ? (l(), i("span", yt, "This " + p(a(pe)[S.kind].toLowerCase()), 1)) : u(S) === void 0 ? (l(), P(a(Pe), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), P(a(D), {
            key: 2,
            link: "",
            size: "small",
            label: u(S),
            class: "mail-inline-link",
            onClick: (g) => U(S)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : T("", !0)
    ]));
  }
}), Pa = ["html", "text", "subject", "variables", "samples"];
function De(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function He(e) {
  if (!(e instanceof Tl)) return;
  const r = e.details ?? {}, o = ge(e);
  if (o === "mail_resource_in_use") {
    const U = Array.isArray(r.messages) ? r.messages.filter(($) => typeof $ == "string") : [], n = r.dependent;
    return {
      message: e.message,
      dependents: U,
      references: Array.isArray(r.resources) ? r.resources.filter(De) : void 0,
      face: Pa.find(($) => $ === n?.face),
      resource: De(n?.resource) ? n.resource : void 0
    };
  }
  const d = Pa.find((U) => U === r.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!d) return;
  const y = Array.isArray(r.dependent_messages) ? r.dependent_messages.filter((U) => typeof U == "string") : [], u = Array.isArray(r.errors) ? r.errors.flatMap((U) => {
    const n = U;
    return De(n.resource) && typeof n.message == "string" ? [{ name: n.resource.name, message: n.message }] : [];
  }) : [], R = Array.isArray(r.candidate_resources) ? r.candidate_resources.filter(De) : [], f = typeof r.engine_message == "string" ? r.engine_message : void 0, C = (o === "html_too_large" || o === "text_too_large") && typeof r.maximum == "number" ? r.maximum : void 0;
  return {
    message: e.message,
    engine: f,
    tooLarge: C,
    face: d,
    resource: De(r.resource) ? r.resource : void 0,
    dependents: y.length ? y : void 0,
    reasons: u.length ? u : void 0,
    candidates: R.length ? R : void 0
  };
}
const pt = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, ht = { class: "kx-modal-head-icon" }, gt = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, kt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, $t = {
  key: 2,
  class: "mail-muted"
}, wt = ["data-name"], _t = { class: "mail-gallery-title" }, xt = { class: "mail-sub" }, Ct = {
  key: 0,
  class: "mail-gallery-warning",
  role: "status"
}, Vt = { class: "mail-gallery-frame" }, St = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, Tt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Rt = {
  key: 2,
  class: "mail-gallery-problem"
}, Ut = {
  key: 1,
  role: "alert"
}, At = ["srcdoc", "title"], It = {
  key: 3,
  class: "mail-more"
}, Lt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, jt = 3, Et = /* @__PURE__ */ se({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e, d = r, { go: y } = be();
    ke(() => o.visible);
    const u = h([]), R = h(), f = h(), C = h(!1), U = h("");
    let n = 0, $ = [], S = 0, g;
    async function x(V, k) {
      V.state = "loading";
      try {
        const v = await le.preview(V.name, []);
        if (k !== n) return;
        V.subject = v.subject, V.warning = v.warnings?.length ? v.warnings.map(qa).join(" ") : void 0, V.document = v.html ? Va(v.html, v.inline_assets) : "", V.state = "ready";
      } catch (v) {
        if (k !== n) return;
        V.problem = He(v), V.failure = V.problem ? "" : ne(v, "This message could not be rendered."), V.state = "failed";
      }
    }
    function w(V) {
      for (; V === n && S < jt && $.length; ) {
        const k = $.shift();
        k.state === "waiting" && (S++, x(k, V).finally(() => {
          S--, w(V);
        }));
      }
    }
    function m(V) {
      V.state !== "waiting" || $.includes(V) || ($.push(V), w(n));
    }
    const c = h();
    function b() {
      if (g?.disconnect(), typeof IntersectionObserver > "u" || !c.value) {
        for (const V of u.value) m(V);
        return;
      }
      g = new IntersectionObserver((V) => {
        for (const k of V) {
          if (!k.isIntersecting) continue;
          const v = u.value.find((B) => B.name === k.target.dataset.name);
          v && m(v);
        }
      }, { root: c.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const V of c.value.querySelectorAll("[data-name]")) g.observe(V);
    }
    async function j(V) {
      C.value = !0, U.value = "";
      try {
        const k = await le.page({ kind: "message", cursor: R.value });
        if (V !== n) return;
        u.value = [...u.value, ...k.items.map((v) => Da({ name: v.name, title: v.title, state: "waiting" }))], R.value = k.next_cursor, f.value = k.total, await Be(), b();
      } catch (k) {
        V === n && (U.value = ne(k, "The messages could not be listed."));
      } finally {
        V === n && (C.value = !1);
      }
    }
    function F() {
      n++, $ = [], g?.disconnect(), g = void 0;
    }
    function X() {
      F(), u.value = [], R.value = f.value = void 0, j(n);
    }
    function ee() {
      const V = ++n;
      $ = [];
      for (const k of u.value) Object.assign(k, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Be(() => {
        V === n && b();
      });
    }
    Z(() => o.visible, (V) => {
      V ? X() : F();
    }), na(F);
    const ae = H(() => u.value.filter((V) => V.state === "ready" || V.state === "failed").length), J = H(() => u.value.filter((V) => V.state === "failed").length), I = H(() => {
      if (!u.value.length) return "";
      const V = `${ae.value} of ${ye(f.value ?? u.value.length, "message")} rendered`;
      return J.value ? `${V}, ${J.value} with a problem.` : V + ".";
    });
    function _(V) {
      d("close"), y({ name: "resource", kind: "message", resource: V, section: "content" });
    }
    const M = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (V, k) => (l(), P(a(Re), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: M,
      "aria-label": "Preview all messages",
      "onUpdate:visible": k[1] || (k[1] = (v) => {
        v || d("close");
      })
    }, {
      header: L(() => [
        s("span", ht, [
          t(a(N), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        k[2] || (k[2] = s("span", { class: "kx-modal-head-text" }, [
          s("span", { class: "kx-modal-head-title" }, "All messages"),
          s("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !u.value.length,
          onClick: ee
        }, {
          icon: L(() => [
            t(a(N), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: L(() => [
        u.value.length ? (l(), i("div", gt, [
          s("span", null, p(I.value), 1),
          t(a(El), {
            value: Math.round(ae.value / (f.value ?? u.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : T("", !0),
        C.value && !u.value.length ? (l(), i("p", kt, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          k[3] || (k[3] = G("Listing messages…", -1))
        ])) : !C.value && !U.value && !u.value.length ? (l(), i("p", $t, "There are no messages yet.")) : T("", !0),
        s("ul", {
          ref_key: "list",
          ref: c,
          class: "mail-gallery"
        }, [
          (l(!0), i(Y, null, me(u.value, (v) => (l(), i("li", {
            key: v.name,
            "data-name": v.name,
            class: ue(["mail-gallery-tile", { "mail-gallery-failed": v.state === "failed" }])
          }, [
            t(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + v.title,
              onClick: (B) => _(v.name)
            }, {
              default: L(() => [
                s("span", _t, p(v.title), 1),
                s("span", xt, p(v.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            v.warning ? (l(), i("p", Ct, [
              t(a(N), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              G(p(v.warning), 1)
            ])) : T("", !0),
            s("div", Vt, [
              v.state === "waiting" ? (l(), i("p", St, "Renders when shown.")) : v.state === "loading" ? (l(), i("p", Tt, [
                t(a(N), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                k[4] || (k[4] = G("Rendering…", -1))
              ])) : v.state === "failed" ? (l(), i("div", Rt, [
                v.problem ? (l(), P(ba, {
                  key: 0,
                  problem: v.problem,
                  draft: { kind: "message", name: v.name }
                }, null, 8, ["problem", "draft"])) : (l(), i("p", Ut, p(v.failure), 1))
              ])) : (l(), i("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: v.document,
                title: v.title + " preview",
                tabindex: "-1"
              }, null, 8, At))
            ])
          ], 10, wt))), 128))
        ], 512),
        R.value || U.value ? (l(), i("div", It, [
          U.value ? (l(), i("span", Lt, p(U.value), 1)) : T("", !0),
          t(a(D), {
            label: U.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: C.value,
            onClick: k[0] || (k[0] = (v) => j(a(n)))
          }, null, 8, ["label", "loading"])
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Nt = { class: "mail-source" }, zt = { key: 0 }, Mt = { key: 1 }, Sa = /* @__PURE__ */ se({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (r, o) => (l(), i("span", Nt, [
      e.resource.state === "created" ? (l(), i("span", zt, p((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(xe)(e.resource.author_label, e.resource.author)), 1)) : (l(), i("span", Mt, "Included with " + p(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), P(a(Ae), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : T("", !0)
    ]));
  }
}), Pt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Ot = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Dt = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, qt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Bt = { class: "mail-toolbar" }, Ht = {
  class: "mail-count",
  role: "status"
}, Ft = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Jt = {
  key: 0,
  class: "mail-sub"
}, Wt = { class: "mail-kind" }, Kt = { class: "mail-muted" }, Yt = {
  key: 2,
  class: "mail-more"
}, Gt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Zt = /* @__PURE__ */ se({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const r = e, { library: o, go: d, create: y } = be(), u = H(() => rt(r.section)), R = h("all"), f = h(""), C = h("");
    let U;
    Z(f, (Q) => {
      clearTimeout(U), U = setTimeout(() => {
        C.value = Q.trim();
      }, 250);
    }), Z(() => r.section, () => {
      f.value = C.value = "", R.value = "all";
    });
    const n = he([]), $ = h(), S = h(), g = h(!0), x = h(!1), w = h(!1), m = h(!1), c = h(""), b = h(""), j = h(""), F = Ce(), X = () => ({ kind: u.value, state: R.value === "all" ? void 0 : R.value, q: C.value || void 0 });
    async function ee(Q = !1) {
      const O = F();
      g.value = !0;
      try {
        const A = await le.page(X());
        if (!O()) return;
        n.value = A.items, $.value = A.next_cursor, S.value = A.total, c.value = b.value = j.value = "", m.value = !1, x.value = !0;
      } catch (A) {
        if (!O()) return;
        m.value = Je(A);
        const E = m.value ? "" : ne(A, "The mail library could not be loaded.");
        Q && x.value && !m.value ? j.value = E : c.value = E;
      } finally {
        O() && (g.value = !1);
      }
    }
    async function ae() {
      if (g.value || !$.value || w.value) return;
      const Q = F();
      w.value = !0, b.value = "";
      try {
        const O = await le.page({ ...X(), cursor: $.value });
        if (!Q()) return;
        n.value = [...n.value, ...O.items], $.value = O.next_cursor, S.value = O.total;
      } catch (O) {
        Q() && (b.value = ne(O, "More resources could not be loaded."));
      } finally {
        w.value = !1;
      }
    }
    Z([u, R, C], () => {
      ee();
    }), ia(() => ee(x.value)), Ie("mail.library", () => {
      ee(x.value);
    });
    const J = H(() => {
      switch (u.value) {
        case "message":
          return { title: "Messages", description: "What recipients read. Each message follows its base template." };
        case "base":
          return { title: "Base templates", description: "The frame around messages: the page, the header and the footer." };
        case "part":
          return { title: "Parts", description: "Reusable pieces that templates include, such as the header, footer and buttons." };
        default:
          return { title: "All resources", description: "Everything your email is made of. Messages follow the base templates and parts they use." };
      }
    }), I = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], _ = H(() => {
      const Q = u.value ? pe[u.value].toLowerCase() : "resource", O = S.value ?? n.value.length;
      return n.value.length < O ? `${n.value.length} of ${ye(O, Q)}` : ye(O, Q);
    });
    function M(Q) {
      const O = Q.used_by;
      return Q.kind === "base" || Q.kind === "asset" ? O?.messages ? ye(O.messages, "message") : "—" : Q.kind === "message" ? O?.recent_sources ? ye(O.recent_sources, "recent sender") : "—" : "";
    }
    function V(Q) {
      return Q.base ? o.title("base", Q.base) : "";
    }
    function k(Q) {
      Q.kind === "asset" ? d({ name: "library", section: "assets", asset: Q.name }) : d({ name: "resource", kind: Q.kind, resource: Q.name, section: "content" });
    }
    const v = H(() => x.value && !c.value && u.value && !n.value.length && R.value === "all" && !C.value), B = h(!1);
    return (Q, O) => (l(), i(Y, null, [
      t(Fe, {
        title: J.value.title,
        description: J.value.description
      }, {
        actions: L(() => [
          !u.value || u.value === "message" ? (l(), P(a(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: O[0] || (O[0] = (A) => B.value = !0)
          }, {
            icon: L(() => [
              t(a(N), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : T("", !0),
          t(a(D), {
            label: u.value ? "New " + a(pe)[u.value].toLowerCase() : "New",
            onClick: O[1] || (O[1] = (A) => a(y)({ kind: u.value }))
          }, {
            icon: L(() => [
              t(a(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      m.value ? (l(), i("p", Pt, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        O[9] || (O[9] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : c.value ? (l(), i("div", Ot, [
        s("span", null, p(c.value), 1),
        t(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: O[2] || (O[2] = (A) => ee())
        })
      ])) : T("", !0),
      j.value ? (l(), i("div", Dt, [
        s("span", null, p(j.value) + " The list shows what was loaded before.", 1),
        t(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: O[3] || (O[3] = (A) => ee(!0))
        })
      ])) : g.value && !x.value ? (l(), i("p", qt, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        O[10] || (O[10] = G("Loading mail library…", -1))
      ])) : v.value && u.value ? (l(), P(xa, {
        key: 4,
        icon: a(fe)[u.value],
        title: "No " + a(ha)[u.value].toLowerCase() + " yet",
        hint: "Create a " + a(pe)[u.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(pe)[u.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: O[4] || (O[4] = (A) => a(y)({ kind: u.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : x.value ? (l(), i(Y, { key: 5 }, [
        s("div", Bt, [
          t(a(Ve), {
            modelValue: R.value,
            "onUpdate:modelValue": O[5] || (O[5] = (A) => R.value = A),
            options: I,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          t(a($a), { class: "mail-search" }, {
            default: L(() => [
              t(a(wa), null, {
                default: L(() => [
                  t(a(N), {
                    icon: g.value ? "tabler:loader-2" : "tabler:search",
                    class: ue({ spin: g.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              t(a(de), {
                modelValue: f.value,
                "onUpdate:modelValue": O[6] || (O[6] = (A) => f.value = A),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + J.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          s("span", Ht, p(_.value), 1)
        ]),
        n.value.length ? (l(), P(a(ka), {
          key: 1,
          value: n.value,
          "data-key": (A) => A.kind + "/" + A.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": J.value.title } },
          onRowClick: O[7] || (O[7] = (A) => k(A.data))
        }, {
          default: L(() => [
            t(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: L(({ data: A }) => [
                t(a(D), {
                  link: "",
                  class: "mail-name",
                  label: A.title,
                  onClick: Ue((E) => k(A), ["stop"])
                }, null, 8, ["label", "onClick"]),
                A.description ? (l(), i("span", Jt, p(A.description), 1)) : T("", !0)
              ]),
              _: 1
            }),
            u.value ? T("", !0) : (l(), P(a(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: L(({ data: A }) => [
                s("span", Wt, [
                  t(a(N), {
                    icon: a(fe)[A.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  G(p(a(pe)[A.kind]), 1)
                ])
              ]),
              _: 1
            })),
            u.value === "message" ? (l(), P(a(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: L(({ data: A }) => [
                V(A) === void 0 ? (l(), P(a(Pe), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i(Y, { key: 1 }, [
                  G(p(V(A)), 1)
                ], 64))
              ]),
              _: 1
            })) : T("", !0),
            t(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: L(({ data: A }) => [
                t(Sa, { resource: A }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            u.value !== "part" ? (l(), P(a(ce), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: L(({ data: A }) => [
                G(p(M(A)), 1)
              ]),
              _: 1
            })) : T("", !0),
            t(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: A }) => [
                s("span", Kt, p(A.state === "original" ? "—" : a(Ba)(A.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), i("p", Ft, "Nothing matches. Try another name or a word from the template.")),
        $.value ? (l(), i("div", Yt, [
          b.value ? (l(), i("span", Gt, p(b.value), 1)) : T("", !0),
          t(a(D), {
            label: b.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: w.value,
            disabled: g.value,
            onClick: ae
          }, null, 8, ["label", "loading", "disabled"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      t(Et, {
        visible: B.value,
        onClose: O[8] || (O[8] = (A) => B.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
}), Qt = /* @__PURE__ */ se({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (r, o) => (l(), i(Y, null, [
      t(a(Ae), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      t(a(D), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: o[0] || (o[0] = (d) => r.$emit("discard"))
      }, {
        icon: L(() => [
          t(a(N), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      t(a(D), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: o[1] || (o[1] = (d) => r.$emit("review", d.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
});
function Xt(e) {
  return JSON.parse(JSON.stringify(e));
}
function _e(e) {
  const r = Xt(e);
  return {
    kind: r.kind,
    name: r.name,
    title: r.title,
    description: r.description,
    html: r.html,
    text: r.text,
    base: r.base,
    subject: r.subject,
    schema: r.schema,
    samples: r.samples
  };
}
function es(e, r) {
  return JSON.stringify(_e(e)) === JSON.stringify(_e(r));
}
function as(e, r, o, d, y) {
  const u = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: r,
    title: o,
    description: d,
    base: y,
    subject: o,
    schema: u,
    samples: {},
    html: `{{ block body() }}
  <p>Write your message here.</p>
{{ end }}
`,
    text: `{{ block body() }}
Write your message here.
{{ end }}
`
  } : e === "base" ? {
    kind: e,
    name: r,
    title: o,
    description: d,
    schema: u,
    samples: {},
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{ message.subject }}</title>
</head>
<body>
  {{ block body() }}{{ end }}
</body>
</html>
`,
    text: `{{ block body() }}{{ end }}
`
  } : { kind: e, name: r, title: o, description: d, schema: u, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function ls(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function ts(e) {
  const r = [], o = e.samples;
  for (const [d, y] of Object.entries(e.schema.properties)) {
    const u = ls(o[d] ?? y.default ?? (y.type === "string" ? "" : null));
    u !== void 0 && r.push(`${JSON.stringify(d)}, ${u}`);
  }
  return r.length ? `{{ include "/part/${e.name}" map(${r.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function al(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function ss(e, r, o) {
  return `<img src="${al(e)}" alt="${r.replace(/"/g, "&quot;")}" style="display:block;border:0;max-width:100%;height:auto;">`;
}
const is = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function ns(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !is.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const os = "{{ block body() }}{{ end }}", rs = { class: "mail-picker-search" }, us = ["for"], ds = {
  key: 0,
  class: "mail-kind"
}, cs = { key: 1 }, vs = {
  key: 0,
  class: "mail-picker-more"
}, Ke = /* @__PURE__ */ se({
  __name: "ResourcePicker",
  props: /* @__PURE__ */ la({
    kind: {},
    label: {},
    placeholder: {},
    names: {},
    exclude: {},
    extra: {},
    disabled: { type: Boolean },
    showClear: { type: Boolean },
    fluid: { type: Boolean },
    inputId: {}
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const r = e, o = pa(e, "modelValue"), { library: d } = be(), y = h(""), u = he([]), R = h(!1), f = h(!1), C = h(""), U = ve(), n = Ce();
    async function $() {
      const m = n();
      f.value = !0;
      try {
        const c = r.names?.slice(0, Me), b = c && !c.length ? { items: [] } : await d.search(r.kind, y.value || void 0, c);
        if (!m()) return;
        u.value = b.items, R.value = !!b.next_cursor || (r.names?.length ?? 0) > Me, C.value = "";
      } catch (c) {
        m() && (C.value = ne(c, "The choices could not be loaded."));
      } finally {
        m() && (f.value = !1);
      }
    }
    let S;
    Z(y, () => {
      clearTimeout(S), S = setTimeout(() => {
        $();
      }, 250);
    }), Z(() => [r.kind, r.names?.join(",")], () => {
      $();
    }), na(() => clearTimeout(S));
    function g() {
      !u.value.length && !f.value && $();
    }
    const x = H(() => {
      const m = u.value.filter((b) => b.name !== r.exclude).map((b) => ({ value: b.name, label: b.title })), c = o.value;
      return c && !m.some((b) => b.value === c) && !r.extra?.some((b) => b.value === c) && m.unshift({ value: c, label: d.title(r.kind, c) ?? c }), [...r.extra ?? [], ...m];
    }), w = H(() => {
      const m = o.value;
      return m ? r.extra?.find((c) => c.value === m)?.label ?? d.title(r.kind, m) : "";
    });
    return (m, c) => (l(), P(a(_a), {
      modelValue: o.value,
      "onUpdate:modelValue": c[2] || (c[2] = (b) => o.value = b),
      options: x.value,
      "option-label": "label",
      "option-value": "value",
      "append-to": "self",
      "input-id": e.inputId,
      placeholder: e.placeholder,
      "aria-label": e.label,
      disabled: e.disabled,
      "show-clear": e.showClear,
      fluid: e.fluid,
      loading: f.value,
      "empty-message": C.value || (y.value ? "Nothing matches." : "Nothing to choose yet."),
      onShow: g
    }, {
      header: L(() => [
        s("div", rs, [
          s("label", {
            class: "mail-sr-only",
            for: a(U)
          }, "Search " + p(e.label.toLowerCase()), 9, us),
          t(a(de), {
            id: a(U),
            modelValue: y.value,
            "onUpdate:modelValue": c[0] || (c[0] = (b) => y.value = b),
            type: "search",
            size: "small",
            fluid: "",
            placeholder: "Search…",
            onKeydown: c[1] || (c[1] = Ue(() => {
            }, ["stop"]))
          }, null, 8, ["id", "modelValue"])
        ])
      ]),
      value: L(({ value: b, placeholder: j }) => [
        b ? (l(), i("span", ds, [
          t(a(N), {
            icon: a(fe)[e.kind],
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          G(p(w.value ?? ""), 1)
        ])) : (l(), i("span", cs, p(j), 1))
      ]),
      footer: L(() => [
        R.value ? (l(), i("p", vs, "Showing the first matches. Search to find others.")) : T("", !0)
      ]),
      _: 1
    }, 8, ["modelValue", "options", "input-id", "placeholder", "aria-label", "disabled", "show-clear", "fluid", "loading", "empty-message"]));
  }
}), ms = {
  class: "mail-preview",
  "aria-label": "Preview"
}, fs = { class: "mail-preview-bar" }, bs = {
  key: 0,
  class: "mail-preview-with"
}, ys = ["for"], ps = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, hs = {
  key: 1,
  class: "mail-field-hint"
}, gs = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, ks = {
  key: 2,
  class: "mail-preview-envelope"
}, $s = ["aria-busy"], ws = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, _s = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, xs = ["srcdoc", "title"], Cs = {
  key: 1,
  class: "mail-preview-text"
}, Vs = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, Ss = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, Ts = {
  key: 5,
  class: "mail-preview-foot"
}, Rs = /* @__PURE__ */ se({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, delivery: u } = be(), R = { message: ve() }, f = h("email"), C = h("desktop"), U = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], n = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], $ = h(""), S = h(""), g = h("");
    async function x() {
      if (o.draft.kind === "message") return;
      const k = o.messages?.slice(0, Me);
      try {
        const v = k && !k.length ? void 0 : await y.search("message", void 0, k);
        S.value = v?.items[0]?.name ?? "", (!$.value || o.messages && !o.messages.includes($.value)) && ($.value = S.value), g.value = "";
      } catch (v) {
        g.value = ne(v, "The messages could not be loaded.");
      }
    }
    Z(() => o.messages?.join(","), () => {
      x();
    }, { immediate: !0 });
    const w = H(() => o.draft.kind !== "message" && $.value && $.value === S.value ? "The first message in the library. Choose another to see it around different content." : ""), m = H(() => o.draft.kind === "message" ? o.draft.name : $.value), c = he(), b = h(!1), j = h(), F = h(""), X = Ce();
    let ee, ae = !1, J = !1;
    async function I() {
      const k = m.value;
      if (!k) return;
      if (ae) {
        J = !0;
        return;
      }
      ae = !0;
      const v = X();
      b.value = !0;
      try {
        const B = await le.preview(k, [o.draft]);
        if (!v()) return;
        c.value = B, j.value = void 0, F.value = "";
      } catch (B) {
        if (!v()) return;
        const Q = He(B);
        j.value = Q ? { ...Q, previewOf: k } : void 0, F.value = j.value ? "" : ne(B, "The preview could not be rendered.");
      } finally {
        ae = !1, v() && (b.value = !1), J && (J = !1, I());
      }
    }
    function _() {
      clearTimeout(ee), ee = setTimeout(() => {
        I();
      }, 450);
    }
    Z(() => JSON.stringify(o.draft), _), Z(m, () => {
      c.value = void 0, I();
    }, { immediate: !0 }), Z(j, (k) => d("problem", k)), na(() => clearTimeout(ee));
    const M = H(() => c.value?.html ? Va(c.value.html, c.value.inline_assets) : ""), V = H(() => {
      const k = u.value?.from;
      return k ? k.name ? `${k.name} <${k.address}>` : k.address : "";
    });
    return (k, v) => (l(), i("section", ms, [
      s("div", fs, [
        t(a(Ve), {
          modelValue: f.value,
          "onUpdate:modelValue": v[0] || (v[0] = (B) => f.value = B),
          options: U,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        f.value === "email" ? (l(), P(a(Ve), {
          key: 0,
          modelValue: C.value,
          "onUpdate:modelValue": v[1] || (v[1] = (B) => C.value = B),
          options: n,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: L(({ option: B }) => [
            t(a(N), {
              icon: B.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            G(p(B.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : T("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), i("div", bs, [
        s("label", {
          for: R.message
        }, "Preview with", 8, ys),
        t(Ke, {
          modelValue: $.value,
          "onUpdate:modelValue": v[2] || (v[2] = (B) => $.value = B),
          kind: "message",
          label: "Preview with",
          "input-id": R.message,
          names: e.messages,
          placeholder: "Choose a message…"
        }, null, 8, ["modelValue", "input-id", "names"]),
        g.value ? (l(), i("small", ps, p(g.value), 1)) : w.value ? (l(), i("small", hs, p(w.value), 1)) : T("", !0)
      ])) : T("", !0),
      b.value && c.value ? (l(), i("p", gs, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        v[3] || (v[3] = G("Updating the preview…", -1))
      ])) : T("", !0),
      c.value ? (l(), i("dl", ks, [
        V.value ? (l(), i(Y, { key: 0 }, [
          v[4] || (v[4] = s("dt", null, "From", -1)),
          s("dd", null, p(V.value), 1)
        ], 64)) : T("", !0),
        v[5] || (v[5] = s("dt", null, "Subject", -1)),
        s("dd", null, p(c.value.subject), 1)
      ])) : T("", !0),
      s("div", {
        class: ue(["mail-preview-body", ["mail-preview-" + C.value, { "mail-preview-stale": j.value || F.value }]]),
        "aria-busy": b.value
      }, [
        !c.value && b.value ? (l(), i("p", ws, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          v[6] || (v[6] = G("Rendering preview…", -1))
        ])) : m.value ? c.value ? (l(), i(Y, { key: 2 }, [
          f.value === "email" ? (l(), i("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: M.value,
            title: "Email preview: " + (c.value.subject ?? "")
          }, null, 8, xs)) : (l(), i("pre", Cs, p(c.value.text), 1))
        ], 64)) : T("", !0) : (l(), i("p", _s, "Choose a message to see this " + p(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, $s),
      (l(!0), i(Y, null, me(c.value?.warnings ?? [], (B) => (l(), i("p", {
        key: B.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        t(a(N), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        s("span", null, p(a(qa)(B)), 1)
      ]))), 128)),
      j.value ? (l(), i("p", Vs, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, p(c.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : F.value ? (l(), i("p", Ss, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, p(F.value), 1)
      ])) : (l(), i("p", Ts, [
        t(a(N), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        G(" " + p(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), Us = { class: "kx-modal-head-icon" }, As = { class: "kx-modal-head-text" }, Is = { class: "kx-modal-head-sub" }, Ls = { class: "mail-change-list" }, js = { class: "mail-muted" }, Es = { class: "mail-field" }, Ns = ["for"], zs = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Ms = { class: "mail-failure-body" }, Ps = { class: "mail-dependents" }, Os = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Ds = /* @__PURE__ */ se({
  __name: "ReviewDialog",
  props: {
    visible: { type: Boolean },
    saved: {},
    draft: {},
    busy: { type: Boolean },
    error: {},
    dependents: {},
    suggestedNote: {}
  },
  emits: ["close", "save"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, go: u } = be(), R = h(""), f = ve();
    Z(() => o.visible, ($) => {
      $ && (R.value = o.suggestedNote ?? "");
    }), ke(() => o.visible);
    const C = H(() => {
      const $ = o.saved, S = o.draft, g = [];
      return ($.title !== S.title || $.description !== S.description) && g.push("Name and description"), $.base !== S.base && g.push(`Base template: ${y.title("base", S.base ?? "") ?? S.base}`), $.subject !== S.subject && g.push("Subject"), $.html !== S.html && g.push("HTML"), $.text !== S.text && g.push("Plain text"), (JSON.stringify($.schema.properties) !== JSON.stringify(S.schema.properties) || JSON.stringify($.schema.required ?? []) !== JSON.stringify(S.schema.required ?? [])) && g.push(S.kind === "message" ? "Variables" : "Inputs"), JSON.stringify($.samples) !== JSON.stringify(S.samples) && g.push("Sample values"), g;
    }), U = H(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${pe[o.draft.kind].toLowerCase()} changes when you save.`), n = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return ($, S) => (l(), P(a(Re), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: n,
      "aria-label": "Review changes",
      "onUpdate:visible": S[3] || (S[3] = (g) => {
        g || d("close");
      })
    }, {
      header: L(() => [
        s("span", Us, [
          t(a(N), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        s("span", As, [
          S[4] || (S[4] = s("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          s("span", Is, p(e.draft.title), 1)
        ])
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: S[2] || (S[2] = (g) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(D), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: L(() => [
        s("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: S[1] || (S[1] = Ue((g) => d("save", R.value.trim()), ["prevent"]))
        }, [
          s("div", null, [
            S[5] || (S[5] = s("p", { class: "mail-field-label" }, "Changed", -1)),
            s("ul", Ls, [
              (l(!0), i(Y, null, me(C.value, (g) => (l(), i("li", { key: g }, p(g), 1))), 128))
            ])
          ]),
          s("p", js, p(U.value) + " The previous version stays in History.", 1),
          s("div", Es, [
            s("label", {
              class: "mail-field-label",
              for: a(f)
            }, "Note for History", 8, Ns),
            t(a(de), {
              id: a(f),
              modelValue: R.value,
              "onUpdate:modelValue": S[0] || (S[0] = (g) => R.value = g),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), i("div", zs, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("div", Ms, [
              s("strong", null, p(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              s("span", null, p(e.dependents.reason), 1),
              s("span", Ps, [
                (l(!0), i(Y, null, me(e.dependents.names, (g) => (l(), P(a(D), {
                  key: g,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(y).title("message", g) ?? g,
                  onClick: (x) => {
                    d("close"), a(u)({ name: "resource", kind: "message", resource: g, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), i("p", Os, p(e.error), 1)) : T("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), ll = /* @__PURE__ */ se({
  __name: "Disclosure",
  props: /* @__PURE__ */ la({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const r = pa(e, "open");
    return (o, d) => (l(), P(a(Nl), {
      class: "kx-disclosure",
      value: r.value ? "content" : void 0,
      "onUpdate:value": d[0] || (d[0] = (y) => r.value = y === "content")
    }, {
      default: L(() => [
        t(a(Pl), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: L(() => [
            t(a(Ml), { class: "kx-disclosure-toggle" }, {
              default: L(() => [
                G(p(e.label), 1)
              ]),
              _: 1
            }),
            t(a(zl), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: L(() => [
                ze(o.$slots, "default")
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
}), qs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Bs = { class: "kx-modal-head-icon" }, Hs = { class: "kx-modal-head-text" }, Fs = { class: "kx-modal-head-title" }, Js = { class: "mail-field" }, Ws = ["for"], Ks = { class: "kx-modal-head-icon" }, Ys = { class: "kx-modal-head-text" }, Gs = { class: "kx-modal-head-title" }, Zs = /* @__PURE__ */ se({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: r, emit: o }) {
    const d = e, y = o, { library: u } = be(), R = h(), f = h(""), C = h({});
    async function U(I) {
      try {
        const _ = await u.search(I);
        C.value = { ...C.value, [I]: _ };
      } catch (_) {
        f.value = ne(_, I === "part" ? "The parts could not be loaded." : "The images could not be loaded.");
      }
    }
    function n(I) {
      f.value = "", C.value = {}, U("part"), d.face === "html" && U("asset"), R.value?.toggle(I);
    }
    const $ = h(), S = h();
    ke(() => !!$.value);
    function g(I) {
      S.value = void 0, $.value = I;
    }
    function x() {
      const I = $.value, _ = S.value;
      $.value = void 0, !(!I || !_) && (I === "part" ? c(_) : X(_, u.title("asset", _) ?? _));
    }
    r({ toggle: n });
    const w = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], m = (I) => ({ label: I, disabled: !0, icon: "tabler:loader-2" });
    async function c(I) {
      f.value = "";
      try {
        y("insert", ts(await le.get({ kind: "part", name: I })));
      } catch (_) {
        f.value = ne(_, "The part could not be read.");
      }
    }
    const b = h(), j = h(""), F = ve();
    ke(() => !!b.value);
    async function X(I, _) {
      f.value = "";
      try {
        await le.get({ kind: "asset", name: I }), b.value = { name: I, title: _ }, j.value = _;
      } catch (M) {
        f.value = ne(M, "The image could not be read.");
      }
    }
    function ee() {
      b.value && (y("insert", ss(b.value.name, j.value)), b.value = void 0);
    }
    const ae = H(() => {
      const I = Object.entries(d.draft.schema.properties).map(([k]) => ({
        label: k,
        icon: "tabler:variable",
        command: () => y("insert", d.draft.kind === "part" ? `{{ .${k} }}` : ns(k))
      })), _ = [{
        label: d.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...I, ...w.map((k) => ({
          label: k.label,
          icon: "tabler:world",
          command: () => y("insert", `{{ ${k.name} }}`)
        }))]
      }], M = C.value.part, V = (M?.items ?? []).filter((k) => !(d.draft.kind === "part" && k.name === d.draft.name));
      if (_.push({ label: "Parts", items: M ? V.length ? [
        ...V.map((k) => ({ label: k.title, icon: fe.part, command: () => {
          c(k.name);
        } })),
        ...M.next_cursor ? [{ label: "Find another part…", icon: "tabler:search", command: () => g("part") }] : []
      ] : [{ label: "There are no parts to include yet.", disabled: !0 }] : [m("Loading parts…")] }), d.face === "html") {
        const k = C.value.asset, v = k?.items ?? [];
        _.push({ label: "Images", items: k ? v.length ? [
          ...v.map((B) => ({ label: B.title, icon: fe.asset, command: () => {
            X(B.name, B.title);
          } })),
          ...k.next_cursor ? [{ label: "Find another image…", icon: "tabler:search", command: () => g("asset") }] : []
        ] : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [m("Loading images…")] });
      }
      return d.draft.kind === "base" && _.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => y("insert", os)
      }] }), _;
    }), J = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (I, _) => (l(), i(Y, null, [
      t(a(Ol), {
        ref_key: "menu",
        ref: R,
        model: ae.value,
        popup: "",
        "aria-label": "Insert into " + (e.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: L(({ item: M, class: V }) => [
          M.icon ? (l(), P(a(N), {
            key: 0,
            icon: M.icon,
            class: ue(V),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : T("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      f.value ? (l(), i("p", qs, p(f.value), 1)) : T("", !0),
      t(a(Re), {
        visible: !!b.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: J,
        "aria-label": "Insert image",
        "onUpdate:visible": _[2] || (_[2] = (M) => {
          M || (b.value = void 0);
        })
      }, {
        header: L(() => [
          s("span", Bs, [
            t(a(N), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          s("span", Hs, [
            s("span", Fs, "Insert " + p(b.value?.title), 1),
            _[6] || (_[6] = s("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: L(() => [
          t(a(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: _[1] || (_[1] = (M) => b.value = void 0)
          }),
          t(a(D), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: L(() => [
          s("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Ue(ee, ["prevent"])
          }, [
            s("div", Js, [
              s("label", {
                class: "mail-field-label",
                for: a(F)
              }, "Alternative text", 8, Ws),
              t(a(de), {
                id: a(F),
                modelValue: j.value,
                "onUpdate:modelValue": _[0] || (_[0] = (M) => j.value = M),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              _[7] || (_[7] = s("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"]),
      t(a(Re), {
        visible: !!$.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: J,
        "aria-label": $.value === "part" ? "Find a part" : "Find an image",
        "onUpdate:visible": _[5] || (_[5] = (M) => {
          M || ($.value = void 0);
        })
      }, {
        header: L(() => [
          s("span", Ks, [
            t(a(N), {
              icon: $.value === "part" ? a(fe).part : a(fe).asset,
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          s("span", Ys, [
            s("span", Gs, p($.value === "part" ? "Insert a part" : "Insert an image"), 1),
            _[8] || (_[8] = s("span", { class: "kx-modal-head-sub" }, "Search the library, then insert at the cursor.", -1))
          ])
        ]),
        footer: L(() => [
          t(a(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: _[4] || (_[4] = (M) => $.value = void 0)
          }),
          t(a(D), {
            label: "Insert",
            disabled: !S.value,
            onClick: x
          }, null, 8, ["disabled"])
        ]),
        default: L(() => [
          $.value ? (l(), P(Ke, {
            key: 0,
            modelValue: S.value,
            "onUpdate:modelValue": _[3] || (_[3] = (M) => S.value = M),
            kind: $.value,
            label: $.value === "part" ? "Part" : "Image",
            fluid: "",
            exclude: $.value === "part" && e.draft.kind === "part" ? e.draft.name : void 0,
            placeholder: "Choose…"
          }, null, 8, ["modelValue", "kind", "label", "exclude"])) : T("", !0)
        ]),
        _: 1
      }, 8, ["visible", "aria-label"])
    ], 64));
  }
}), Qs = ["disabled", "inert"], Xs = { class: "mail-form" }, ei = { class: "mail-field" }, ai = ["for"], li = { class: "mail-field" }, ti = ["for"], si = { class: "mail-field-hint" }, ii = { class: "mail-mono" }, ni = { class: "mail-field" }, oi = ["for"], ri = { class: "mail-base-row" }, ui = ["id"], di = { class: "mail-code-frame mail-code-subject" }, ci = { class: "mail-face-bar" }, vi = { class: "mail-code-frame mail-code-body" }, mi = /* @__PURE__ */ se({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const r = ca(() => import("./CodeEditor-CIrhfC0V.js")), o = e, { go: d } = be(), y = { base: ve(), title: ve(), description: ve(), face: ve() }, u = h("html"), R = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], f = h(), C = h();
    function U(S) {
      f.value?.insert(S);
    }
    const n = H(() => {
      const S = o.problem;
      if (S)
        return S.face === "html" || S.face === "text" || S.face === "subject" ? S.face : u.value;
    }), $ = H(() => (o.draft.kind === "message" ? "Body" : "Source") + (u.value === "html" ? ", HTML" : ", plain text"));
    return (S, g) => (l(), i("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t(ll, { label: "Name and description" }, {
        default: L(() => [
          s("div", Xs, [
            s("div", ei, [
              s("label", {
                class: "mail-field-label",
                for: y.title
              }, "Name", 8, ai),
              t(a(de), {
                id: y.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": g[0] || (g[0] = (x) => e.draft.title = x)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", li, [
              s("label", {
                class: "mail-field-label",
                for: y.description
              }, "Description", 8, ti),
              t(a(de), {
                id: y.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": g[1] || (g[1] = (x) => e.draft.description = x)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("p", si, [
              g[9] || (g[9] = G("Reference ", -1)),
              s("span", ii, p(e.draft.name), 1),
              G(", used to " + p(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), i(Y, { key: 0 }, [
        s("div", ni, [
          s("label", {
            class: "mail-field-label",
            for: y.base
          }, "Base template", 8, oi),
          s("div", ri, [
            t(Ke, {
              modelValue: e.draft.base,
              "onUpdate:modelValue": g[2] || (g[2] = (x) => e.draft.base = x),
              kind: "base",
              label: "Base template",
              "input-id": y.base,
              class: "mail-base-select"
            }, null, 8, ["modelValue", "input-id"]),
            e.draft.base ? (l(), P(a(D), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: g[3] || (g[3] = (x) => a(d)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : T("", !0)
          ])
        ]),
        s("div", {
          class: ue(["mail-field", { "mail-field-invalid": n.value === "subject" }])
        }, [
          s("span", {
            id: y.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, ui),
          s("div", di, [
            t(a(r), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": g[4] || (g[4] = (x) => e.draft.subject = x),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          e.problem && n.value === "subject" ? (l(), P(ba, {
            key: 0,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : T("", !0)
        ], 2)
      ], 64)) : T("", !0),
      s("div", {
        class: ue(["mail-field", { "mail-field-invalid": e.problem && n.value !== "subject" }])
      }, [
        s("div", ci, [
          t(a(Ve), {
            modelValue: u.value,
            "onUpdate:modelValue": g[5] || (g[5] = (x) => u.value = x),
            options: R,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          t(a(D), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: g[6] || (g[6] = (x) => C.value?.toggle(x))
          }, {
            icon: L(() => [
              t(a(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        s("div", vi, [
          u.value === "html" ? (l(), P(a(r), {
            ref_key: "editor",
            ref: f,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": g[7] || (g[7] = (x) => e.draft.html = x),
            label: $.value
          }, null, 8, ["modelValue", "label"])) : (l(), P(a(r), {
            ref_key: "editor",
            ref: f,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": g[8] || (g[8] = (x) => e.draft.text = x),
            label: $.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && n.value !== "subject" ? (l(), P(ba, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : T("", !0)
      ], 2),
      t(Zs, {
        ref_key: "inserter",
        ref: C,
        draft: e.draft,
        face: u.value,
        onInsert: U
      }, null, 8, ["draft", "face"])
    ], 8, Qs));
  }
}), fi = { class: "mail-value-field" }, bi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Oa = /* @__PURE__ */ se({
  __name: "ValueField",
  props: /* @__PURE__ */ la({
    type: {},
    itemType: {},
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: [null, Boolean, Number, String, Array, Object] },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ la(["invalid"], ["update:modelValue"]),
  setup(e, { emit: r }) {
    const o = e, d = pa(e, "modelValue"), y = r, u = (c) => c === null || ["string", "number", "boolean"].includes(typeof c), R = (c) => c === void 0 || Array.isArray(c) && c.every(u), f = (c) => c === void 0 || !!c && typeof c == "object" && !Array.isArray(c) && Object.values(c).every((b) => typeof b == "string"), C = h(!1);
    Z(() => o.type, () => {
      C.value = !1;
    });
    const U = H(() => C.value ? "written" : o.type === "array" ? R(d.value) ? "list" : "written" : o.type === "object" ? f(d.value) ? "record" : "written" : o.type), n = H({
      get: () => Array.isArray(d.value) ? d.value.map((c) => c === null ? "" : String(c)).join(`
`) : "",
      set: (c) => {
        const b = c.split(`
`).map((F) => F.trim()).filter(Boolean), j = o.itemType === "number" || o.itemType === "integer";
        d.value = b.length ? b.map((F) => j && F !== "" && !Number.isNaN(Number(F)) ? Number(F) : F) : void 0;
      }
    }), $ = h([]);
    Z(d, (c) => {
      if (U.value !== "record") return;
      const b = c ?? {};
      JSON.stringify(Object.fromEntries($.value.filter((j) => j.key).map((j) => [j.key, j.value]))) !== JSON.stringify(b) && ($.value = Object.entries(b).map(([j, F]) => ({ key: j, value: F })));
    }, { immediate: !0 });
    function S() {
      const c = $.value.filter((b) => b.key.trim());
      d.value = c.length ? Object.fromEntries(c.map((b) => [b.key.trim(), b.value])) : void 0;
    }
    const g = h(""), x = h("");
    Z([d, U], () => {
      U.value === "written" && !x.value && (g.value = d.value === void 0 ? "" : JSON.stringify(d.value, null, 2));
    }, { immediate: !0 });
    function w(c) {
      if (g.value = c, !c.trim()) {
        x.value = "", d.value = void 0;
        return;
      }
      try {
        const b = JSON.parse(c), j = o.type === "array" ? Array.isArray(b) : !!b && typeof b == "object" && !Array.isArray(b);
        x.value = j ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', j && (d.value = b);
      } catch {
        x.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    Z(x, (c) => y("invalid", c), { immediate: !0 });
    const m = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (c, b) => (l(), i("div", fi, [
      U.value === "string" ? (l(), P(a(de), {
        key: 0,
        "model-value": typeof d.value == "string" ? d.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": b[0] || (b[0] = (j) => d.value = j || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : U.value === "number" || U.value === "integer" ? (l(), P(a(ql), {
        key: 1,
        "model-value": typeof d.value == "number" ? d.value : null,
        "aria-label": e.label,
        "max-fraction-digits": U.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": b[1] || (b[1] = (j) => d.value = j ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : U.value === "boolean" ? (l(), P(a(Ve), {
        key: 2,
        "model-value": typeof d.value == "boolean" ? d.value : null,
        options: m,
        "option-label": "label",
        "option-value": "value",
        "aria-label": e.label,
        disabled: e.disabled,
        "onUpdate:modelValue": b[2] || (b[2] = (j) => d.value = typeof j == "boolean" ? j : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : U.value === "list" ? (l(), P(a(va), {
        key: 3,
        modelValue: n.value,
        "onUpdate:modelValue": b[3] || (b[3] = (j) => n.value = j),
        "aria-label": e.label,
        rows: "3",
        "auto-resize": "",
        disabled: e.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : U.value === "record" ? (l(), i(Y, { key: 4 }, [
        (l(!0), i(Y, null, me($.value, (j, F) => (l(), i("div", {
          key: F,
          class: "mail-value-entry"
        }, [
          t(a(de), {
            modelValue: j.key,
            "onUpdate:modelValue": [(X) => j.key = X, S],
            "aria-label": e.label + ", name " + (F + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(de), {
            modelValue: j.value,
            "onUpdate:modelValue": [(X) => j.value = X, S],
            "aria-label": e.label + ", value " + (F + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(D), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (j.key || "entry"),
            disabled: e.disabled,
            onClick: (X) => {
              $.value.splice(F, 1), S();
            }
          }, {
            icon: L(() => [
              t(a(N), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        t(a(D), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: b[4] || (b[4] = (j) => $.value.push({ key: "", value: "" }))
        }, {
          icon: L(() => [
            t(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), i(Y, { key: 5 }, [
        t(a(va), {
          "model-value": g.value,
          "aria-label": e.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!x.value,
          disabled: e.disabled,
          fluid: "",
          "onUpdate:modelValue": w
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        x.value ? (l(), i("small", bi, p(x.value), 1)) : T("", !0)
      ], 64)),
      (e.type === "array" || e.type === "object") && U.value !== "written" ? (l(), P(a(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: e.disabled,
        onClick: b[5] || (b[5] = (j) => C.value = !0)
      }, null, 8, ["disabled"])) : T("", !0)
    ]));
  }
}), yi = ["disabled", "inert"], pi = { class: "mail-sr-only" }, hi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, gi = {
  key: 1,
  class: "mail-muted"
}, ki = ["aria-label"], $i = { class: "mail-variable-grid" }, wi = { class: "mail-field" }, _i = { class: "mail-field" }, xi = { class: "mail-field" }, Ci = ["id"], Vi = { class: "mail-variable-check" }, Si = { class: "mail-field" }, Ti = { class: "mail-variable-values" }, Ri = {
  key: 0,
  class: "mail-field"
}, Ui = { class: "mail-field" }, Ai = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ii = /* @__PURE__ */ se({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: r }) {
    const o = e, d = r, y = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let u = 0;
    function R(x) {
      const w = new Set(x.schema.required ?? []);
      return Object.entries(x.schema.properties).map(([m, c]) => {
        const b = c.items;
        return {
          id: u++,
          name: m,
          schema: c,
          title: typeof c.title == "string" ? c.title : "",
          type: y.some((j) => j.value === c.type) ? c.type : "string",
          itemType: typeof b?.type == "string" ? b.type : void 0,
          required: w.has(m),
          description: typeof c.description == "string" ? c.description : "",
          sample: x.samples[m],
          fallback: c.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const f = h([]);
    f.value = R(o.draft), Z(() => o.draft, (x) => {
      f.value = R(x);
    });
    function C(x, w) {
      if (w === void 0) return !0;
      switch (x.type) {
        case "string":
          return typeof w == "string";
        case "number":
          return typeof w == "number";
        case "integer":
          return typeof w == "number" && Number.isInteger(w);
        case "boolean":
          return typeof w == "boolean";
        case "array":
          return Array.isArray(w);
        default:
          return !!w && typeof w == "object" && !Array.isArray(w);
      }
    }
    function U(x, w) {
      x.type = w, C(x, x.sample) || (x.sample = void 0), C(x, x.fallback) || (x.fallback = void 0);
    }
    const n = H(() => f.value.map((x) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(x.name) ? f.value.some((w) => w !== x && w.name === x.name) ? "Another one has this name." : x.valueErrors.sample || x.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    Z(n, (x) => d("invalid", x.some(Boolean)), { immediate: !0 }), Z(f, (x) => {
      if (n.value.some(Boolean)) return;
      const w = {}, m = {};
      for (const b of x) {
        const j = { ...b.schema, type: b.type };
        for (const [F, X] of [["title", b.title], ["description", b.description]])
          X ? j[F] = X : delete j[F];
        b.fallback !== void 0 ? j.default = b.fallback : delete j.default, w[b.name] = j, b.sample !== void 0 && (m[b.name] = b.sample);
      }
      const c = x.filter((b) => b.required).map((b) => b.name);
      o.draft.schema = { ...o.draft.schema, properties: w, required: c.length ? c : void 0 }, o.draft.samples = m;
    }, { deep: !0 });
    function $() {
      let x = f.value.length + 1;
      for (; f.value.some((w) => w.name === `value_${x}`); ) x++;
      f.value.push({
        id: u++,
        name: `value_${x}`,
        title: "",
        type: "string",
        required: !1,
        description: "",
        sample: void 0,
        fallback: void 0,
        schema: {},
        valueErrors: { sample: "", fallback: "" }
      });
    }
    const S = H(() => o.draft.kind === "part"), g = H(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${pt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (x, w) => (l(), i("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s("legend", pi, p(e.label), 1),
      g.value ? (l(), i("p", hi, p(g.value), 1)) : T("", !0),
      f.value.length ? (l(), i("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), i(Y, null, me(f.value, (m, c) => (l(), i("li", {
          key: m.id,
          class: ue(["mail-variable-card", { "mail-variable-invalid": n.value[c] }])
        }, [
          s("div", $i, [
            s("label", wi, [
              w[0] || (w[0] = s("span", { class: "mail-field-label" }, "Name in templates", -1)),
              t(a(de), {
                modelValue: m.name,
                "onUpdate:modelValue": (b) => m.name = b,
                class: "mail-mono-input",
                invalid: !!n.value[c] && !m.valueErrors.sample && !m.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            s("label", _i, [
              w[1] || (w[1] = s("span", { class: "mail-field-label" }, "Label", -1)),
              t(a(de), {
                modelValue: m.title,
                "onUpdate:modelValue": (b) => m.title = b,
                placeholder: m.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            s("div", xi, [
              s("span", {
                id: "type-" + m.id,
                class: "mail-field-label"
              }, "Type", 8, Ci),
              t(a(_a), {
                "model-value": m.type,
                options: y,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + m.id,
                "onUpdate:modelValue": (b) => U(m, b)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            s("label", Vi, [
              t(a(Dl), {
                modelValue: m.required,
                "onUpdate:modelValue": (b) => m.required = b,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              w[2] || (w[2] = s("span", null, "Required", -1))
            ]),
            t(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + m.name,
              title: "Remove " + m.name,
              onClick: (b) => f.value.splice(c, 1)
            }, {
              icon: L(() => [
                t(a(N), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          s("label", Si, [
            w[3] || (w[3] = s("span", { class: "mail-field-label" }, "Description", -1)),
            t(a(de), {
              modelValue: m.description,
              "onUpdate:modelValue": (b) => m.description = b,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("div", Ti, [
            S.value ? (l(), i("div", Ri, [
              w[4] || (w[4] = s("span", { class: "mail-field-label" }, "Default", -1)),
              t(Oa, {
                modelValue: m.fallback,
                "onUpdate:modelValue": (b) => m.fallback = b,
                type: m.type,
                "item-type": m.itemType,
                label: "Default of " + m.name,
                onInvalid: (b) => m.valueErrors.fallback = b
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : T("", !0),
            s("div", Ui, [
              w[5] || (w[5] = s("span", { class: "mail-field-label" }, "Sample value", -1)),
              t(Oa, {
                modelValue: m.sample,
                "onUpdate:modelValue": (b) => m.sample = b,
                type: m.type,
                "item-type": m.itemType,
                label: "Sample value of " + m.name,
                onInvalid: (b) => m.valueErrors.sample = b
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          n.value[c] ? (l(), i("small", Ai, p(m.name) + ": " + p(n.value[c]), 1)) : T("", !0)
        ], 2))), 128))
      ], 8, ki)) : (l(), i("p", gi, p(e.draft.title) + " takes no " + p(e.label.toLowerCase()) + " yet.", 1)),
      s("div", null, [
        t(a(D), {
          label: S.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: $
        }, {
          icon: L(() => [
            t(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, yi));
  }
}), Li = { class: "kx-modal-head-icon" }, ji = {
  key: 0,
  class: "kx-modal-head-text"
}, Ei = { class: "kx-modal-head-title" }, Ni = {
  key: 0,
  class: "kx-modal-head-sub"
}, zi = {
  key: 1,
  class: "kx-modal-head-sub"
}, Mi = {
  key: 0,
  class: "mail-form"
}, Pi = { class: "mail-face-bar" }, Oi = {
  key: 0,
  class: "mail-version-subject"
}, Di = { class: "mail-mono-block" }, qi = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Bi = /* @__PURE__ */ se({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean },
    included: { type: Boolean }
  },
  emits: ["close", "restore", "reset"],
  setup(e, { emit: r }) {
    const o = ca(() => import("./CodeEditor-CIrhfC0V.js")), d = ca(() => import("./DiffView-CjA70e3n.js")), y = e, u = r;
    ke(() => !!y.revision);
    const R = h("version"), f = h("html");
    Z(() => y.revision, (w) => {
      w && (R.value = y.compare ? "compare" : "version", f.value = "html");
    });
    const C = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], U = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], n = H(() => !y.included && y.revision?.version === y.current.revision), $ = H(() => {
      const w = y.revision;
      return w ? y.included || w.state === "original" && w.action === "reset" ? `${y.current.title}: the version included with ${y.current.origin_label}` : `${y.current.title}, version ${w.version}` : "";
    }), S = H(() => y.revision ? f.value === "html" ? y.revision.content.html : y.revision.content.text : ""), g = H(() => f.value === "html" ? y.current.html : y.current.text), x = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (w, m) => (l(), P(a(Re), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: x,
      "aria-label": $.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": m[5] || (m[5] = (c) => {
        c || u("close");
      })
    }, {
      header: L(() => [
        s("span", Li, [
          t(a(N), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), i("span", ji, [
          s("span", Ei, p($.value), 1),
          e.included ? (l(), i("span", Ni, "Compare it with your customized version, or reset to it.")) : (l(), i("span", zi, p(a(ga)[e.revision.action]) + " by " + p(a(xe)(e.revision.author_label, e.revision.author)) + " · " + p(a(We)(e.revision.created_at)), 1))
        ])) : T("", !0)
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: m[2] || (m[2] = (c) => u("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), P(a(D), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: m[3] || (m[3] = (c) => u("reset"))
        }, {
          icon: L(() => [
            t(a(N), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !n.value ? (l(), P(a(D), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: m[4] || (m[4] = (c) => u("restore", e.revision))
        }, {
          icon: L(() => [
            t(a(N), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : T("", !0)
      ]),
      default: L(() => [
        e.revision ? (l(), i("div", Mi, [
          s("div", Pi, [
            n.value ? T("", !0) : (l(), P(a(Ve), {
              key: 0,
              modelValue: R.value,
              "onUpdate:modelValue": m[0] || (m[0] = (c) => R.value = c),
              options: C,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            t(a(Ve), {
              modelValue: f.value,
              "onUpdate:modelValue": m[1] || (m[1] = (c) => f.value = c),
              options: U,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && R.value === "version" ? (l(), i("p", Oi, [
            m[6] || (m[6] = s("span", { class: "mail-muted" }, "Subject", -1)),
            m[7] || (m[7] = G()),
            s("span", Di, p(e.revision.content.subject), 1)
          ])) : T("", !0),
          R.value === "version" ? (l(), i("div", qi, [
            (l(), P(a(o), {
              key: f.value,
              "model-value": S.value,
              label: $.value + (f.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), P(a(d), {
            key: "diff-" + f.value,
            before: S.value,
            after: g.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Hi = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Fi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ji = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Wi = {
  key: 3,
  class: "mail-history"
}, Ki = { class: "mail-history-head" }, Yi = { class: "mail-history-main" }, Gi = { class: "mail-history-title" }, Zi = { class: "mail-sub" }, Qi = {
  key: 0,
  class: "mail-history-note"
}, Xi = {
  key: 0,
  class: "mail-history-actions"
}, en = {
  key: 4,
  class: "mail-more"
}, an = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ln = /* @__PURE__ */ se({
  __name: "HistoryList",
  props: {
    resource: {},
    revisions: {},
    loading: { type: Boolean },
    error: {},
    busy: {},
    more: { type: Boolean },
    moreError: {}
  },
  emits: ["show", "restore", "retry", "more"],
  setup(e) {
    return (r, o) => (l(), i(Y, null, [
      e.error ? (l(), i("div", Hi, [
        s("span", null, p(e.error), 1),
        t(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: o[0] || (o[0] = (d) => r.$emit("retry"))
        })
      ])) : e.loading && !e.revisions.length ? (l(), i("p", Fi, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        o[2] || (o[2] = G("Loading history…", -1))
      ])) : e.revisions.length ? (l(), i("ol", Wi, [
        (l(!0), i(Y, null, me(e.revisions, (d) => (l(), i("li", {
          key: d.seq,
          class: "mail-history-row"
        }, [
          s("div", Ki, [
            s("div", Yi, [
              s("span", Gi, [
                G(" Version " + p(d.version) + " · " + p(a(ga)[d.action]) + p(d.restored_from ? " from version " + d.restored_from : "") + " ", 1),
                d.version === e.resource.revision ? (l(), P(a(Ae), {
                  key: 0,
                  severity: "success",
                  value: "Current",
                  class: "kx-tag-sm"
                })) : T("", !0)
              ]),
              s("span", Zi, p(a(xe)(d.author_label, d.author)) + " · " + p(a(We)(d.created_at)), 1),
              d.note ? (l(), i("span", Qi, p(d.note), 1)) : T("", !0)
            ]),
            a(Ha)(d) ? (l(), i("div", Xi, [
              t(a(D), {
                label: "Show this version",
                disabled: e.busy !== void 0,
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (y) => r.$emit("show", d)
              }, {
                icon: L(() => [
                  t(a(N), {
                    icon: "tabler:eye",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"]),
              d.version !== e.resource.revision ? (l(), P(a(D), {
                key: 0,
                label: "Restore",
                severity: "secondary",
                outlined: "",
                size: "small",
                loading: e.busy === d.seq,
                disabled: e.busy !== void 0,
                onClick: (y) => r.$emit("restore", d)
              }, {
                icon: L(() => [
                  t(a(N), {
                    icon: "tabler:restore",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled", "onClick"])) : T("", !0)
            ])) : T("", !0)
          ])
        ]))), 128))
      ])) : (l(), i("p", Ji, p(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1)),
      e.more && e.revisions.length ? (l(), i("div", en, [
        e.moreError ? (l(), i("span", an, p(e.moreError), 1)) : T("", !0),
        t(a(D), {
          label: e.moreError ? "Retry" : "Show older versions",
          severity: "secondary",
          outlined: "",
          loading: e.loading,
          onClick: o[1] || (o[1] = (d) => r.$emit("more"))
        }, null, 8, ["label", "loading"])
      ])) : T("", !0)
    ], 64));
  }
}), tn = { class: "kx-modal-head-icon mail-head-warn" }, sn = { class: "kx-modal-head-text" }, nn = { class: "kx-modal-head-title" }, on = { class: "mail-dialog-text" }, rn = {
  key: 0,
  class: "mail-list"
}, tl = /* @__PURE__ */ se({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e;
    ke(() => !!o.refusal);
    const d = r, y = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function u(R) {
      d("close"), R();
    }
    return (R, f) => (l(), P(a(Re), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: y,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": f[1] || (f[1] = (C) => {
        C || d("close");
      })
    }, {
      header: L(() => [
        s("span", tn, [
          t(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        s("span", sn, [
          s("span", nn, p(e.refusal?.header), 1)
        ])
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Close",
          autofocus: "",
          onClick: f[0] || (f[0] = (C) => d("close"))
        })
      ]),
      default: L(() => [
        s("p", on, p(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), i("ul", rn, [
          (l(!0), i(Y, null, me(e.refusal.links, (C) => (l(), i("li", {
            key: C.label
          }, [
            t(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (U) => u(C.open)
            }, {
              default: L(() => [
                t(a(N), {
                  icon: C.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                s("span", null, p(C.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), un = { class: "mail-stack" }, dn = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, cn = {
  key: 0,
  class: "mail-muted"
}, vn = {
  key: 1,
  class: "mail-list"
}, mn = { key: 1 }, fn = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, bn = { class: "mail-group-head" }, yn = {
  key: 0,
  class: "mail-muted"
}, pn = {
  key: 1,
  class: "mail-list"
}, hn = { class: "mail-list-main" }, gn = {
  key: 0,
  class: "mail-sub"
}, kn = { class: "mail-muted" }, $n = /* @__PURE__ */ se({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const r = e, { library: o, go: d, capabilities: y } = be(), u = H(() => (r.resource.used_by?.messages ?? []).map((f) => ({
      name: f,
      title: o.title("message", f)
    }))), R = H(() => r.resource.used_by?.recent_senders ?? []);
    return (f, C) => (l(), i("div", un, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), i("section", dn, [
        C[1] || (C[1] = s("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        u.value.length ? (l(), i("ul", vn, [
          (l(!0), i(Y, null, me(u.value, (U) => (l(), i("li", {
            key: U.name
          }, [
            t(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (n) => a(d)({ name: "resource", kind: "message", resource: U.name, section: "content" })
            }, {
              default: L(() => [
                t(a(N), {
                  icon: a(fe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                U.title === void 0 ? (l(), P(a(Pe), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i("span", mn, p(U.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), i("p", cn, "No messages " + p(e.resource.kind === "asset" ? "show" : "use") + " " + p(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), i("section", fn, [
        s("div", bn, [
          C[2] || (C[2] = s("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(y)?.administer_delivery ? (l(), P(a(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: C[0] || (C[0] = (U) => a(d)({ name: "activity", template: e.resource.name }))
          })) : T("", !0)
        ]),
        R.value.length ? (l(), i("ul", pn, [
          (l(!0), i(Y, null, me(R.value, (U) => (l(), i("li", {
            key: U.sender + (U.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            t(a(N), {
              icon: U.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("span", hn, [
              s("span", null, p(a(xe)(U.sender_label, U.sender)), 1),
              U.origin ? (l(), i("span", gn, p(a(ra)(U.origin)), 1)) : T("", !0)
            ]),
            s("span", kn, p(a(ye)(U.count, "message")), 1)
          ]))), 128))
        ])) : (l(), i("p", yn, "Nobody has sent " + p(e.resource.title) + " recently.", 1))
      ])) : T("", !0)
    ]));
  }
}), wn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, _n = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, xn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Cn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Vn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, Sn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, Tn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Rn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, Un = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, An = {
  key: 6,
  class: "kx-notice mail-customized"
}, In = { class: "mail-customized-text" }, Ln = { class: "mail-editor-layout" }, jn = /* @__PURE__ */ se({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const r = e, { library: o, capabilities: d, delivery: y, go: u, create: R, setDirty: f, setTitle: C } = be(), U = H(() => ({ kind: r.kind, name: r.name })), n = he(), $ = h(), S = h(!0), g = h(!1), x = h(!1), w = h(""), m = h(), c = Ce(), b = H(() => !!$.value && !!n.value && !es($.value, n.value));
    Z(b, (q) => f(q), { immediate: !0 }), na(() => f(!1));
    async function j(q = {}) {
      const z = c();
      try {
        const W = await le.get(U.value);
        if (!z()) return;
        const ie = q.keepDraft && b.value;
        if (ie && n.value && W.revision !== n.value.revision) {
          m.value = { revision: W.revision, by: xe(W.author_label, W.author) || "Someone" };
          return;
        }
        n.value = W, ie || ($.value = _e(W), F.value = void 0), C(W.title), m.value = void 0, g.value = x.value = !1, w.value = "";
      } catch (W) {
        if (!z()) return;
        g.value = ta(W), x.value = Je(W), w.value = g.value || x.value ? "" : ne(W, "This resource could not be loaded."), g.value && (n.value = void 0, $.value = void 0);
      } finally {
        z() && (S.value = !1);
      }
    }
    const F = h(), X = he([]), ee = h(!1), ae = h(""), J = h(""), I = h(), _ = Ce();
    async function M() {
      const q = _();
      ee.value = !0;
      try {
        const z = await le.history(U.value);
        if (!q()) return;
        X.value = z.items, I.value = z.next_cursor, ae.value = J.value = "";
      } catch (z) {
        if (!q()) return;
        ae.value = ta(z) ? "" : ne(z, "History could not be loaded.");
      } finally {
        q() && (ee.value = !1);
      }
    }
    async function V() {
      const q = I.value;
      if (!q || ee.value) return;
      const z = _();
      ee.value = !0;
      try {
        const W = await le.history(U.value, q);
        if (!z()) return;
        const ie = new Set(X.value.map((oe) => oe.seq));
        X.value = [...X.value, ...W.items.filter((oe) => !ie.has(oe.seq))], I.value = W.next_cursor, J.value = "";
      } catch (W) {
        z() && (J.value = ne(W, "Older versions could not be loaded."));
      } finally {
        z() && (ee.value = !1);
      }
    }
    async function k() {
      await Promise.all([j({ keepDraft: !0 }), M()]);
    }
    ia(k), Ie("mail.library", () => {
      k();
    });
    const v = h(), B = h(""), Q = h(!1), O = h(""), A = h(), E = H(() => n.value?.title ?? r.name), K = H(() => {
      const q = n.value, z = E.value, W = q?.used_by?.messages?.length ?? 0, ie = q?.used_by?.recent_senders?.find((fl) => fl.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ie?.origin ? ` Sent recently by “${ra(ie.origin)}”.` : "") },
          base: { title: "Layout", description: W ? `The frame around the ${ye(W, "message")} that ${W === 1 ? "uses" : "use"} ${z}.` : `The frame around messages that use ${z}.` },
          part: { title: "Content", description: `Shown wherever ${z} is included.` }
        }[r.kind],
        variables: r.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${z} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: r.kind === "message" ? `Who sends ${z}.` : r.kind === "base" ? `Messages that use ${z}.` : `Templates that include ${z}.`
        },
        history: { title: "History", description: `Every saved version of ${z}, newest first.` }
      }[r.section];
    }), te = H(() => {
      const q = n.value;
      return q?.state !== "customized" ? "" : `Customized by ${xe(q.author_label, q.author)} ${Rl(q.updated_at)} from the version included with ${q.origin_label}.`;
    }), $e = H(() => {
      const q = n.value;
      if (!q?.original) return;
      const { kind: z, name: W, title: ie, description: oe } = q;
      return {
        kind: z,
        name: W,
        seq: 0,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: z, name: W, title: ie, description: oe, ...q.original }
      };
    }), we = h(), re = h(), Le = h(!1), Ye = H(() => re.value ?? we.value);
    Z(() => JSON.stringify($.value), () => {
      re.value = void 0;
    });
    const nl = H(() => !!Ye.value || Le.value || !!m.value), Ta = H(() => m.value ? "Discard your changes to load the newer version first." : Le.value ? "Fix the variables first." : Ye.value ? "Fix the error first." : ""), Ra = h(!1);
    function ua(q, z) {
      Ra.value = ["invalid_config", "from_name_invalid"].includes(ge(q) ?? ""), Q.value = ["mail_revision_conflict", "mail_preview_stale"].includes(ge(q) ?? ""), Q.value && k(), B.value = ne(q, z);
    }
    function Ua() {
      if (!n.value) return;
      const q = !!m.value;
      $.value = _e(n.value), m.value = void 0, re.value = void 0, F.value = void 0, q && j();
    }
    const je = h(!1), Ge = h(""), Ze = h();
    function ol() {
      Ge.value = "", Ze.value = void 0, je.value = !0;
    }
    async function rl(q) {
      const z = n.value, W = $.value;
      if (!(!z || !W || v.value !== void 0)) {
        v.value = "save", Ge.value = B.value = O.value = "", Ze.value = void 0;
        try {
          const ie = F.value, oe = ie && JSON.stringify(W) === JSON.stringify({ ..._e(ie.content), kind: z.kind, name: z.name }), Se = oe ? await le.restore(U.value, ie.seq, z.revision, q || void 0) : await le.update(W, z.revision, q || void 0);
          n.value = { ...z, ...Se }, $.value = _e(n.value), je.value = !1, O.value = oe ? `Version ${ie.version} from ${We(ie.created_at)} is now in effect.` : `Saved ${Se.title}.${r.kind === "message" ? "" : " Every message that uses it has the change."}`, F.value = void 0, await k();
        } catch (ie) {
          const oe = He(ie), Se = oe?.resource?.kind === W.kind && oe.resource.name === W.name;
          oe?.dependents?.length && !Se ? Ze.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (re.value = oe, je.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes(ge(ie) ?? "") ? (je.value = !1, await j({ keepDraft: !0 })) : Ge.value = ne(ie, `${W.title} could not be saved.`);
        } finally {
          v.value = void 0;
        }
      }
    }
    async function ul() {
      const q = n.value;
      if (!(!q || v.value !== void 0)) {
        v.value = "test", B.value = O.value = "";
        try {
          await le.sendTest(q.name), O.value = d.value?.administer_delivery ? "The test is queued for delivery to you with the sample values. Activity shows when it is delivered." : "The test is queued for delivery to you with the sample values.";
        } catch (z) {
          ua(z, "The test could not be sent.");
        } finally {
          v.value = void 0;
        }
      }
    }
    const Qe = H(() => b.value ? "Save your changes to send a test." : d.value?.send ? y.value && !y.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Aa() {
      const q = n.value;
      if (!(!q || v.value !== void 0 || !await Te.confirm({
        header: `Reset ${q.title} to the original?`,
        message: `Your changes are replaced by the version included with ${q.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        v.value = "reset", B.value = O.value = "", Q.value = !1;
        try {
          n.value = await le.reset(U.value, q.revision), $.value = _e(n.value), O.value = `${q.title} is back to the original. Your changes are in History.`, await k();
        } catch (W) {
          ua(W, `${q.title} could not be reset.`);
        } finally {
          v.value = void 0;
        }
      }
    }
    const Oe = h(), Ia = h(!1), La = h(!1);
    function ja(q, z = !1, W = !1) {
      Ia.value = z, La.value = W, Oe.value = q;
    }
    async function Ea(q) {
      const z = U.value;
      v.value = q.seq, B.value = "";
      try {
        const W = await le.revision(z, q.seq);
        if (U.value.kind === z.kind && U.value.name === z.name) return W;
      } catch (W) {
        U.value.kind === z.kind && U.value.name === z.name && (B.value = ne(W, "This version could not be loaded."));
      } finally {
        v.value === q.seq && (v.value = void 0);
      }
    }
    async function dl(q) {
      const z = await Ea(q);
      z && ja(z);
    }
    async function Na(q) {
      const z = n.value;
      if (!z || v.value !== void 0 || b.value && !await Te.confirm({
        header: `Replace your unsaved changes with version ${q.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      const W = "content" in q ? q : await Ea(q);
      if (!W) return;
      $.value = { ..._e(W.content), kind: z.kind, name: z.name }, F.value = W, Oe.value = void 0, B.value = "";
      const ie = `Version ${W.version} is loaded as your draft. Review and save to restore it.`;
      r.section === "content" ? O.value = ie : (da = ie, u({ name: "resource", kind: r.kind, resource: r.name, section: "content" }));
    }
    function za(q, z, W) {
      const ie = q.kind === "base" ? "use" : "include";
      A.value = {
        header: `${q.title} is in use`,
        get message() {
          const oe = z.map((Se) => o.title("message", Se) ?? Se);
          return `${ye(z.length, "message")} ${z.length === 1 ? ie + "s" : ie} it: ${oe.join(", ")}. Remove it from ${z.length === 1 ? "that message" : "them"} first.`;
        },
        links: z.map((oe) => ({ get label() {
          return o.title("message", oe) ?? oe;
        }, open: () => u({ name: "resource", kind: "message", resource: oe, section: "content" }) }))
      };
    }
    async function cl() {
      const q = n.value;
      if (!q || q.state !== "created" || v.value !== void 0) return;
      const z = q.used_by?.messages ?? [];
      if (q.kind === "base" && z.length) {
        za(q, z);
        return;
      }
      if (await Te.confirm({
        header: `Delete ${q.title}?`,
        message: q.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${pe[q.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        v.value = "delete", B.value = O.value = "";
        try {
          await le.remove(U.value, q.revision), f(!1), u({ name: "library", section: fa(r.kind) });
        } catch (ie) {
          const oe = He(ie);
          oe?.dependents?.length ? za(q, oe.dependents) : ua(ie, `${q.title} could not be deleted.`);
        } finally {
          v.value = void 0;
        }
      }
    }
    function vl() {
      const q = n.value;
      q && R({ kind: r.kind, from: { kind: q.kind, name: q.name } });
    }
    const ml = H(() => r.kind === "base" ? n.value?.used_by?.messages : void 0), Xe = H(() => v.value === "save");
    j(), Z(() => r.section, (q) => {
      q === "history" && !X.value.length && M();
    }, { immediate: !0 });
    let da = "";
    return Z(() => r.section, () => {
      O.value = da, da = "", B.value = "";
    }), (q, z) => (l(), i(Y, null, [
      g.value ? (l(), P(xa, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(ha)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: z[0] || (z[0] = (W) => a(u)({ name: "library", section: a(fa)(e.kind) }))
      }, null, 8, ["cta"])) : x.value ? (l(), i("p", wn, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        z[11] || (z[11] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), i(Y, { key: 2 }, [
        t(Fe, {
          title: K.value.title,
          description: K.value.description
        }, ya({ _: 2 }, [
          n.value ? {
            name: "actions",
            fn: L(() => [
              b.value ? (l(), P(Qt, {
                key: 0,
                busy: Xe.value,
                "review-disabled": nl.value,
                onDiscard: Ua,
                onReview: ol
              }, null, 8, ["busy", "review-disabled"])) : (l(), i(Y, { key: 1 }, [
                e.kind === "message" ? (l(), P(a(D), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: v.value === "test",
                  disabled: !!Qe.value || v.value !== void 0,
                  title: Qe.value || void 0,
                  onClick: ul
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : T("", !0),
                t(a(D), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: v.value !== void 0,
                  onClick: vl
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                n.value.state === "created" ? (l(), P(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: v.value === "delete",
                  disabled: v.value !== void 0,
                  onClick: cl
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : T("", !0)
              ], 64))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "description"]),
        w.value ? (l(), i("div", _n, [
          s("span", null, p(w.value), 1),
          t(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: z[1] || (z[1] = (W) => k())
          })
        ])) : S.value ? (l(), i("p", xn, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          G("Loading " + p(E.value) + "…", 1)
        ])) : T("", !0),
        n.value && $.value ? (l(), i(Y, { key: 2 }, [
          m.value ? (l(), i("p", Cn, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("span", null, [
              G(p(m.value.by) + " saved " + p(n.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              t(a(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Ua
              })
            ])
          ])) : T("", !0),
          b.value && Ta.value && !m.value ? (l(), i("p", Vn, p(Ta.value), 1)) : e.kind === "message" && !b.value && Qe.value ? (l(), i("p", Sn, [
            G(p(Qe.value) + " ", 1),
            a(d)?.administer_delivery && a(y) && !a(y).configured ? (l(), P(a(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: z[2] || (z[2] = (W) => a(Te).navigate("/system/settings/mail"))
            })) : T("", !0)
          ])) : T("", !0),
          B.value && Q.value ? (l(), i("p", Tn, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            G(p(B.value), 1)
          ])) : B.value ? (l(), i("p", Rn, [
            s("span", null, p(B.value), 1),
            Ra.value && a(d)?.administer_delivery ? (l(), P(a(D), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: z[3] || (z[3] = (W) => a(Te).navigate("/system/settings/mail"))
            })) : T("", !0)
          ])) : T("", !0),
          O.value ? (l(), i("p", Un, [
            t(a(N), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            G(p(O.value), 1)
          ])) : T("", !0),
          te.value && e.section === "content" ? (l(), i("div", An, [
            t(a(N), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            s("span", In, [
              G(p(te.value), 1),
              b.value ? (l(), i(Y, { key: 0 }, [
                G(" Save or discard your changes to reset it.")
              ], 64)) : T("", !0)
            ]),
            $e.value ? (l(), P(a(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: z[4] || (z[4] = (W) => ja($e.value, !0, !0))
            }, {
              icon: L(() => [
                t(a(N), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : T("", !0),
            t(a(D), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: v.value === "reset",
              disabled: v.value !== void 0 || b.value,
              onClick: Aa
            }, {
              icon: L(() => [
                t(a(N), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : T("", !0),
          _l(s("div", Ln, [
            t(mi, {
              draft: $.value,
              problem: Ye.value,
              disabled: Xe.value
            }, null, 8, ["draft", "problem", "disabled"]),
            t(Rs, {
              draft: $.value,
              messages: ml.value,
              onProblem: z[5] || (z[5] = (W) => we.value = W)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [xl, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), P(Ii, {
            key: 7,
            draft: $.value,
            label: K.value.title,
            problem: Ye.value,
            disabled: Xe.value,
            onInvalid: z[6] || (z[6] = (W) => Le.value = W)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), P($n, {
            key: 8,
            resource: n.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), P(ln, {
            key: 9,
            resource: n.value,
            revisions: X.value,
            loading: ee.value,
            error: ae.value,
            busy: typeof v.value == "number" ? v.value : v.value ? -1 : void 0,
            more: !!I.value,
            "more-error": J.value,
            onShow: dl,
            onRestore: Na,
            onRetry: M,
            onMore: V
          }, null, 8, ["resource", "revisions", "loading", "error", "busy", "more", "more-error"])) : T("", !0)
        ], 64)) : T("", !0)
      ], 64)),
      n.value && $.value ? (l(), P(Ds, {
        key: 3,
        visible: je.value,
        saved: a(_e)(n.value),
        draft: $.value,
        busy: Xe.value,
        error: Ge.value,
        dependents: Ze.value,
        "suggested-note": F.value ? `Restore version ${F.value.version}` : void 0,
        onClose: z[7] || (z[7] = (W) => je.value = !1),
        onSave: rl
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : T("", !0),
      n.value ? (l(), P(Bi, {
        key: 4,
        revision: Oe.value,
        current: n.value,
        compare: Ia.value,
        included: La.value,
        busy: typeof v.value == "number" || v.value === "reset",
        onClose: z[8] || (z[8] = (W) => Oe.value = void 0),
        onRestore: Na,
        onReset: z[9] || (z[9] = (W) => {
          Oe.value = void 0, Aa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : T("", !0),
      t(tl, {
        refusal: A.value,
        onClose: z[10] || (z[10] = (W) => A.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), ea = /* @__PURE__ */ new Map();
function En(e, r) {
  const o = ea.get(e);
  if (o && o.revision >= r) return o.url;
  const d = Promise.resolve(Vl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((y) => y.data instanceof Blob ? URL.createObjectURL(y.data) : void 0, () => {
    ea.get(e)?.url === d && ea.delete(e);
  });
  return ea.set(e, { revision: r, url: d }), o && o.url.then((y) => {
    y && URL.revokeObjectURL(y);
  }), d;
}
const Nn = ["src", "alt"], zn = {
  key: 0,
  "aria-hidden": "true"
}, sl = /* @__PURE__ */ se({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(e) {
    const r = e, o = h();
    Z(() => [r.name, r.revision], async ([y, u]) => {
      o.value = void 0, o.value = await En(y, u);
    }, { immediate: !0 });
    const d = H(() => r.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (y, u) => (l(), i("span", {
      class: ue(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      o.value ? (l(), i("img", {
        key: 0,
        src: o.value,
        alt: e.alt ?? ""
      }, null, 8, Nn)) : (l(), i(Y, { key: 1 }, [
        t(a(N), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        d.value ? (l(), i("span", zn, p(d.value), 1)) : T("", !0)
      ], 64))
    ], 2));
  }
});
function qe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Mn(e, r) {
  return e;
}
function Pn(e, r, o) {
  if (r !== void 0 && !r) return null;
  const d = qe(e) ? e : {}, y = [
    d,
    qe(d.data) ? d.data : null,
    qe(d.payload) ? d.payload : null,
    qe(d.detail) ? d.detail : null
  ].filter(Boolean);
  for (const u of y) {
    if (u.event !== "component.meta.changed" && u.event !== "component.deleting" && u.event !== "component.deleted") continue;
    const R = String(u.component_id || ""), f = String(d.topic || u.topic || "");
    if (r === void 0) {
      if (!R && (!f.startsWith("component.") || f === "component.")) continue;
    } else if (R && R !== r || !R && f !== `component.${r}`) continue;
    const C = R || r || f.slice(10);
    return u.event === "component.deleting" && typeof u.deletion_job_id == "string" && u.deletion_job_id ? { event: u.event, component_id: C, deletion_job_id: u.deletion_job_id } : u.event !== "component.meta.changed" ? { event: u.event, component_id: C } : {
      event: "component.meta.changed",
      component_id: C,
      meta: Mn(qe(u.meta) ? u.meta : {}),
      deleted: Array.isArray(u.deleted) ? u.deleted.map(String) : []
    };
  }
  return null;
}
function On(e, r, o) {
  const d = Pn(e, r);
  return d?.event === "component.meta.changed" ? d : null;
}
function Dn(e, r, o) {
  if (!e) return null;
  const d = Sl(`component.${e}`, (y) => {
    const u = On(y, e);
    u && r(u);
  });
  return typeof d == "function" ? d : null;
}
class aa extends Error {
}
function qn(e, r) {
  return new Promise((o, d) => {
    let y = null, u = !1, R = !1, f = !1;
    const C = ($) => {
      f || (f = !0, y?.(), r.removeEventListener("abort", U), $ ? d($) : o());
    }, U = () => C(new aa("cancelled"));
    if (r.aborted) {
      U();
      return;
    }
    r.addEventListener("abort", U);
    async function n() {
      if (!f) {
        if (u) {
          R = !0;
          return;
        }
        u = !0;
        try {
          const $ = await Fa.state(e);
          $.status === "completed" ? C() : $.status === "error" ? C(new aa($.error ?? "")) : y || (y = Dn($.component_id, () => {
            n();
          }), y ? R = !0 : C(new aa("")));
        } catch ($) {
          C($);
        } finally {
          u = !1, R && !f && (R = !1, n());
        }
      }
    }
    n();
  });
}
const Bn = { class: "kx-modal-head-icon" }, Hn = { class: "kx-modal-head-text" }, Fn = { class: "kx-modal-head-title" }, Jn = { class: "kx-modal-head-sub" }, Wn = ["disabled", "inert"], Kn = ["for"], Yn = { class: "mail-muted" }, Gn = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Zn = {
  key: 0,
  class: "mail-field"
}, Qn = ["for"], Xn = ["for"], eo = ["id"], ao = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, lo = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, to = 1024 * 1024, il = /* @__PURE__ */ se({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, go: u } = be(), R = { file: ve(), title: ve(), name: ve() };
    ke(() => o.visible);
    const f = ["image/png", "image/jpeg", "image/gif"], C = h(), U = h(""), n = h(""), $ = h(!1), S = h(!1), g = h();
    let x = new AbortController();
    const w = h(""), m = h(""), c = h("");
    Z(() => o.visible, (J) => {
      if (!J) {
        x.abort();
        return;
      }
      x = new AbortController(), C.value = void 0, U.value = o.replace?.title ?? "", n.value = o.replace?.name ?? "", $.value = !1, w.value = m.value = c.value = "";
    }), Z(U, (J) => {
      !o.replace && !$.value && (n.value = Ja(J));
    });
    function b(J) {
      const I = Array.isArray(J.files) ? J.files[0] : J.files;
      if (m.value = "", C.value = void 0, !!I) {
        if (!f.includes(I.type)) {
          m.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (I.size > to) {
          m.value = "Images must be 1 MB or smaller.";
          return;
        }
        C.value = I, !o.replace && !U.value && (U.value = I.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function j() {
      return c.value = "", o.replace ? !0 : (n.value || (c.value = "Enter a reference."), !c.value);
    }
    async function F() {
      if (S.value || !C.value || !U.value.trim() || !j()) return;
      S.value = !0, w.value = "";
      const J = x;
      try {
        g.value = "upload";
        const I = await Fa.add(C.value), _ = { name: n.value, upload_id: I, title: U.value.trim() }, M = () => o.replace ? le.replaceAsset(_, o.replace.revision) : le.addAsset(_);
        g.value = "save";
        let V;
        try {
          V = await M();
        } catch (k) {
          if (ge(k) !== "upload_still_processing") throw k;
          g.value = "process", await qn(I, J.signal), g.value = "save", V = await M();
        }
        y.patch("asset", V.name, Qa(V)), d("done", V), d("close"), o.replace || u({ name: "library", section: "assets", asset: V.name });
      } catch (I) {
        if (J.signal.aborted) return;
        I instanceof aa ? w.value = "The image could not be processed. Try another file, or upload it again." : ge(I) === "mail_revision_conflict" && !o.replace ? c.value = `An image named ${n.value} already exists. Choose another name or replace ${n.value}.` : ge(I) === "invalid_mail_resource" && !o.replace ? c.value = Wa : w.value = ne(I, "The image could not be uploaded.");
      } finally {
        S.value = !1, g.value = void 0;
      }
    }
    const X = H(() => g.value === "upload" ? "Uploading the image…" : g.value === "process" ? "Processing the image…" : g.value === "save" ? "Adding it to the library…" : ""), ee = H(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (J, I) => (l(), P(a(Re), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !S.value || g.value === "process",
      "close-on-escape": !S.value || g.value === "process",
      class: "mail-dialog",
      pt: ae,
      "aria-label": ee.value,
      "onUpdate:visible": I[4] || (I[4] = (_) => {
        _ || d("close");
      })
    }, {
      header: L(() => [
        s("span", Bn, [
          t(a(N), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        s("span", Hn, [
          s("span", Fn, p(ee.value), 1),
          s("span", Jn, p(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: S.value && g.value !== "process",
          onClick: I[3] || (I[3] = (_) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(D), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: S.value,
          disabled: !C.value || !e.replace && !U.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: L(() => [
        s("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Ue(F, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: S.value,
            inert: S.value || void 0
          }, [
            s("div", {
              class: ue(["mail-field", { "mail-field-invalid": m.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: R.file
              }, "Image", 8, Kn),
              t(a(Bl), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": C.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: R.file, "aria-label": "Image file" } },
                onSelect: b
              }, {
                chooseicon: L(() => [
                  t(a(N), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: L(() => [
                  s("span", Yn, p(C.value ? `${C.value.name} · ${a(oa)(C.value.size)}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              m.value ? (l(), i("small", Gn, p(m.value), 1)) : T("", !0)
            ], 2),
            e.replace ? T("", !0) : (l(), i("div", Zn, [
              s("label", {
                class: "mail-field-label",
                for: R.title
              }, "Name", 8, Qn),
              t(a(de), {
                id: R.title,
                modelValue: U.value,
                "onUpdate:modelValue": I[0] || (I[0] = (_) => U.value = _)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? T("", !0) : (l(), i("div", {
              key: 1,
              class: ue(["mail-field", { "mail-field-invalid": c.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: R.name
              }, "Reference", 8, Xn),
              t(a(de), {
                id: R.name,
                modelValue: n.value,
                "onUpdate:modelValue": I[1] || (I[1] = (_) => n.value = _),
                class: "mail-mono-input",
                invalid: !!c.value,
                "aria-describedby": R.name + "-hint",
                onInput: I[2] || (I[2] = (_) => $.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: R.name + "-hint",
                class: ue(c.value ? "mail-field-error" : "mail-field-hint")
              }, p(c.value || "Templates show it with this name. It cannot change later."), 11, eo)
            ], 2))
          ], 8, Wn),
          X.value ? (l(), i("p", ao, [
            t(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            G(p(X.value), 1)
          ])) : T("", !0),
          w.value ? (l(), i("p", lo, p(w.value), 1)) : T("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), so = { class: "mail-drawer-head" }, io = { class: "mail-drawer-title" }, no = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, oo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, ro = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, uo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, co = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, vo = { class: "mail-asset-actions" }, mo = { class: "mail-asset-hero" }, fo = { class: "mail-facts mail-card" }, bo = { class: "mail-reference" }, yo = { class: "mail-mono-block" }, po = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, ho = {
  key: 0,
  class: "mail-muted"
}, go = { class: "mail-list" }, ko = { key: 1 }, $o = {
  key: 0,
  class: "mail-asset-context"
}, wo = ["srcdoc", "title"], _o = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, xo = {
  key: 0,
  class: "mail-muted"
}, Co = {
  key: 1,
  class: "mail-history"
}, Vo = { class: "mail-history-head" }, So = { class: "mail-history-main" }, To = { class: "mail-history-title" }, Ro = { class: "mail-sub" }, Uo = {
  key: 2,
  class: "mail-more"
}, Ao = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Io = /* @__PURE__ */ se({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, go: u } = be();
    ke(() => !!o.name);
    const R = h();
    Z(() => !!o.name, (O) => {
      O && Be(() => R.value?.focus());
    }, { immediate: !0 });
    const f = he(), C = he([]), U = he(), n = h(""), $ = h(!1), S = h(!1), g = h(""), x = h(""), w = h(""), m = h(), c = h(!1), b = h(!1), j = h(!1), F = h(), X = Ce(), ee = h(), ae = h(!1), J = h("");
    async function I() {
      const O = o.name, A = ee.value;
      if (!(!O || !A || ae.value)) {
        ae.value = !0;
        try {
          const E = await le.history({ kind: "asset", name: O }, A);
          if (o.name !== O) return;
          const K = new Set(C.value.map((te) => te.seq));
          C.value = [...C.value, ...E.items.filter((te) => !K.has(te.seq))], ee.value = E.next_cursor, J.value = "";
        } catch (E) {
          J.value = ne(E, "Older versions could not be loaded.");
        } finally {
          ae.value = !1;
        }
      }
    }
    async function _() {
      const O = o.name, A = X();
      if (!O) {
        f.value = void 0;
        return;
      }
      $.value = !0;
      try {
        const [E, K] = await Promise.all([le.get({ kind: "asset", name: O }), le.history({ kind: "asset", name: O })]);
        if (!A()) return;
        f.value = E, C.value = K.items, ee.value = K.next_cursor, S.value = !1, g.value = "";
        const te = E.used_by?.messages?.[0];
        n.value = te ?? "";
        const $e = te ? await le.preview(te, []) : void 0;
        A() && (U.value = $e);
      } catch (E) {
        if (!A()) return;
        S.value = ta(E), g.value = S.value ? "" : ne(E, "This image could not be loaded.");
      } finally {
        A() && ($.value = !1);
      }
    }
    Z(() => o.name, () => {
      c.value = b.value = !1, w.value = x.value = "", _();
    }, { immediate: !0 }), Ie("mail.library", () => {
      o.name && _();
    });
    const M = H(() => (f.value?.used_by?.messages ?? []).map((O) => ({ name: O, title: y.title("message", O) })));
    async function V() {
      const O = f.value;
      if (O)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(O.name)}`), b.value = !0;
        } catch {
          b.value = !1;
        }
    }
    const k = H(() => f.value ? al(f.value.name) : "");
    async function v() {
      try {
        await navigator.clipboard.writeText(k.value), c.value = !0;
      } catch {
        c.value = !1;
      }
    }
    async function B(O, A) {
      const E = f.value;
      if (!E || m.value !== void 0) return;
      if (O === "delete" && M.value.length) {
        F.value = {
          header: `${E.title} is in use`,
          message: `${ye(M.value.length, "message")} ${M.value.length === 1 ? "shows" : "show"} it: ${M.value.map((te) => te.title ?? te.name).join(", ")}. Remove it from ${M.value.length === 1 ? "that message" : "them"} first.`,
          links: M.value.map((te) => ({ label: te.title ?? te.name, open: () => u({ name: "resource", kind: "message", resource: te.name, section: "content" }) }))
        };
        return;
      }
      const K = {
        reset: { header: `Reset ${E.title} to the original?`, message: `The image included with ${E.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${E.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${A?.version} of ${E.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[O];
      if (await Te.confirm({ header: K.header, message: K.message, acceptLabel: K.accept, rejectLabel: "Cancel", ...O === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        m.value = A ? A.seq : O, x.value = w.value = "";
        try {
          if (O === "delete") {
            await le.remove({ kind: "asset", name: E.name }, E.revision), d("close");
            return;
          }
          f.value = O === "reset" ? await le.reset({ kind: "asset", name: E.name }, E.revision) : await le.restore({ kind: "asset", name: E.name }, A.seq, E.revision), w.value = O === "reset" ? `${E.title} is back to the original.` : `Version ${A.version} is shown again everywhere.`, await _();
        } catch (te) {
          const $e = He(te);
          if ($e?.dependents?.length || $e?.references?.length) {
            const we = [...($e.references ?? []).filter((re) => re.kind !== "asset")];
            for (const re of $e.dependents ?? []) we.some((Le) => Le.kind === "message" && Le.name === re) || we.push({ kind: "message", name: re });
            F.value = {
              header: `${E.title} is in use`,
              message: `${ye(we.length, "template")} ${we.length === 1 ? "names" : "name"} ${E.title}, in the current version or one kept in History. Remove it from ${we.length === 1 ? "that template" : "them"} first.`,
              links: we.map((re) => ({
                get label() {
                  return y.title(re.kind, re.name) ?? re.name;
                },
                icon: fe[re.kind],
                open: () => u(re.kind === "asset" ? { name: "library", section: "assets", asset: re.name } : { name: "resource", kind: re.kind, resource: re.name, section: "content" })
              }))
            };
          } else
            x.value = ge(te) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ne(te, "The image could not be changed."), ge(te) === "mail_revision_conflict" && _();
        } finally {
          m.value = void 0;
        }
      }
    }
    const Q = H(() => U.value?.html ? Va(U.value.html, U.value.inline_assets) : "");
    return (O, A) => (l(), i(Y, null, [
      t(a(Ga), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: m.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": A[5] || (A[5] = (E) => {
          E || d("close");
        })
      }, {
        default: L(() => [
          s("div", {
            ref_key: "drawer",
            ref: R,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            s("header", so, [
              s("div", io, [
                f.value?.state === "customized" ? (l(), P(a(Ae), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : T("", !0),
                s("h2", null, p(f.value?.title ?? "Image"), 1)
              ]),
              t(a(D), {
                text: "",
                severity: "secondary",
                disabled: !f.value,
                "aria-label": b.value ? "Link copied" : "Copy link",
                title: b.value ? "Link copied" : "Copy link",
                onClick: V
              }, {
                icon: L(() => [
                  t(a(N), {
                    icon: b.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              t(a(D), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: m.value !== void 0,
                onClick: A[0] || (A[0] = (E) => d("close"))
              }, {
                icon: L(() => [
                  t(a(N), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            $.value && !f.value ? (l(), i("p", no, [
              t(a(N), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              A[9] || (A[9] = G("Loading image…", -1))
            ])) : S.value ? (l(), i("p", oo, [
              t(a(N), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              A[10] || (A[10] = G("This image no longer exists. It was deleted while you were away.", -1))
            ])) : g.value ? (l(), i("div", ro, [
              s("span", null, p(g.value), 1),
              t(a(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: A[1] || (A[1] = (E) => _())
              })
            ])) : T("", !0),
            f.value ? (l(), i(Y, { key: 3 }, [
              x.value ? (l(), i("p", uo, [
                t(a(N), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                G(p(x.value), 1)
              ])) : T("", !0),
              w.value ? (l(), i("p", co, [
                t(a(N), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                G(p(w.value), 1)
              ])) : T("", !0),
              s("div", vo, [
                t(a(D), {
                  label: "Replace",
                  disabled: m.value !== void 0,
                  onClick: A[2] || (A[2] = (E) => j.value = !0)
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                f.value.state === "customized" ? (l(), P(a(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: m.value === "reset",
                  disabled: m.value !== void 0,
                  onClick: A[3] || (A[3] = (E) => B("reset"))
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : T("", !0),
                f.value.state === "created" ? (l(), P(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: m.value === "delete",
                  disabled: m.value !== void 0,
                  onClick: A[4] || (A[4] = (E) => B("delete"))
                }, {
                  icon: L(() => [
                    t(a(N), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : T("", !0)
              ]),
              s("div", mo, [
                t(sl, {
                  name: f.value.name,
                  revision: f.value.revision,
                  asset: f.value.asset,
                  large: "",
                  alt: f.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              s("dl", fo, [
                A[11] || (A[11] = s("dt", null, "Reference", -1)),
                s("dd", bo, [
                  s("span", yo, p(k.value), 1),
                  t(a(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": c.value ? "Reference copied" : "Copy reference",
                    title: c.value ? "Reference copied" : "Copy reference",
                    onClick: v
                  }, {
                    icon: L(() => [
                      t(a(N), {
                        icon: c.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                A[12] || (A[12] = s("dt", null, "File", -1)),
                s("dd", null, p(f.value.asset?.filename) + " · " + p(a(oa)(f.value.asset?.size)), 1),
                A[13] || (A[13] = s("dt", null, "Source", -1)),
                s("dd", null, [
                  t(Sa, { resource: f.value }, null, 8, ["resource"])
                ])
              ]),
              s("section", po, [
                A[14] || (A[14] = s("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                M.value.length ? (l(), i(Y, { key: 1 }, [
                  s("ul", go, [
                    (l(!0), i(Y, null, me(M.value, (E) => (l(), i("li", {
                      key: E.name
                    }, [
                      t(a(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (K) => a(u)({ name: "resource", kind: "message", resource: E.name, section: "content" })
                      }, {
                        default: L(() => [
                          t(a(N), {
                            icon: a(fe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          E.title === void 0 ? (l(), P(a(Pe), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), i("span", ko, p(E.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  Q.value ? (l(), i("div", $o, [
                    s("iframe", {
                      sandbox: "",
                      srcdoc: Q.value,
                      title: "How " + f.value.title + " looks in " + (a(y).title("message", n.value) ?? "")
                    }, null, 8, wo)
                  ])) : T("", !0)
                ], 64)) : (l(), i("p", ho, "No message shows " + p(f.value.title) + " with its sample values.", 1))
              ]),
              s("section", _o, [
                A[15] || (A[15] = s("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                C.value.length ? (l(), i("ol", Co, [
                  (l(!0), i(Y, null, me(C.value, (E) => (l(), i("li", {
                    key: E.seq,
                    class: "mail-history-row"
                  }, [
                    s("div", Vo, [
                      s("div", So, [
                        s("span", To, [
                          G("Version " + p(E.version) + " · " + p(a(ga)[E.action]) + " ", 1),
                          E.version === f.value.revision ? (l(), P(a(Ae), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : T("", !0)
                        ]),
                        s("span", Ro, p(a(xe)(E.author_label, E.author)) + " · " + p(a(We)(E.created_at)), 1)
                      ]),
                      a(Ha)(E) && E.version !== f.value.revision ? (l(), P(a(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: m.value === E.seq,
                        disabled: m.value !== void 0,
                        onClick: (K) => B("restore", E)
                      }, {
                        icon: L(() => [
                          t(a(N), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : T("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), i("p", xo, p(f.value.title) + " has not been replaced.", 1)),
                ee.value ? (l(), i("div", Uo, [
                  J.value ? (l(), i("span", Ao, p(J.value), 1)) : T("", !0),
                  t(a(D), {
                    label: J.value ? "Retry" : "Show older versions",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    loading: ae.value,
                    onClick: I
                  }, null, 8, ["label", "loading"])
                ])) : T("", !0)
              ])
            ], 64)) : T("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      f.value ? (l(), P(il, {
        key: 0,
        visible: j.value,
        replace: f.value,
        onClose: A[6] || (A[6] = (E) => j.value = !1),
        onDone: A[7] || (A[7] = (E) => _())
      }, null, 8, ["visible", "replace"])) : T("", !0),
      t(tl, {
        refusal: F.value,
        onClose: A[8] || (A[8] = (E) => F.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Lo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, jo = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Eo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, No = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, zo = { class: "mail-toolbar" }, Mo = {
  class: "mail-count",
  role: "status"
}, Po = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Oo = { class: "mail-sub" }, Do = { class: "mail-mono-block" }, qo = { class: "mail-muted" }, Bo = { class: "mail-muted" }, Ho = {
  key: 2,
  class: "mail-more"
}, Fo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Jo = /* @__PURE__ */ se({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const r = e, { go: o, upload: d } = be(), y = h(""), u = h("");
    let R;
    Z(y, (J) => {
      clearTimeout(R), R = setTimeout(() => {
        u.value = J.trim();
      }, 250);
    });
    const f = he([]), C = h(), U = h(), n = h(!0), $ = h(!1), S = h(!1), g = h(!1), x = h(""), w = h(""), m = h(""), c = Ce();
    async function b(J = !1) {
      const I = c();
      n.value = !0;
      try {
        const _ = await le.page({ kind: "asset", q: u.value || void 0, limit: ma });
        if (!I()) return;
        f.value = _.items, C.value = _.next_cursor, U.value = _.total, x.value = w.value = m.value = "", S.value = !1, $.value = !0;
      } catch (_) {
        if (!I()) return;
        S.value = Je(_);
        const M = S.value ? "" : ne(_, "Images could not be loaded.");
        J && $.value && !S.value ? w.value = M : x.value = M;
      } finally {
        I() && (n.value = !1);
      }
    }
    async function j() {
      if (n.value || !C.value || g.value) return;
      const J = c();
      g.value = !0;
      try {
        const I = await le.page({ kind: "asset", q: u.value || void 0, limit: ma, cursor: C.value });
        if (!J()) return;
        const _ = new Set(f.value.map((M) => M.name));
        f.value = [...f.value, ...I.items.filter((M) => !_.has(M.name))], C.value = I.next_cursor, m.value = "";
      } catch (I) {
        J() && (m.value = ne(I, "More images could not be loaded."));
      } finally {
        g.value = !1;
      }
    }
    Z(u, () => {
      b();
    }), ia(() => b($.value)), Ie("mail.library", () => {
      b($.value);
    });
    function F(J) {
      const I = J.used_by?.messages;
      return I ? ye(I, "message") : "—";
    }
    const X = H(() => {
      const J = U.value ?? f.value.length;
      return f.value.length < J ? `${f.value.length} of ${ye(J, "image")}` : ye(J, "image");
    });
    function ee(J) {
      const I = J.asset;
      return I ? oa(I.size) : "";
    }
    function ae(J) {
      o({ name: "library", section: "assets", asset: J.name });
    }
    return (J, I) => (l(), i(Y, null, [
      t(Fe, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: L(() => [
          t(a(D), {
            label: "Upload image",
            onClick: I[0] || (I[0] = (_) => a(d)())
          }, {
            icon: L(() => [
              t(a(N), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      S.value ? (l(), i("p", Lo, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        I[7] || (I[7] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : x.value ? (l(), i("div", jo, [
        s("span", null, p(x.value), 1),
        t(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[1] || (I[1] = (_) => b())
        })
      ])) : T("", !0),
      w.value ? (l(), i("div", Eo, [
        s("span", null, p(w.value) + " The list shows what was loaded before.", 1),
        t(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[2] || (I[2] = (_) => b(!0))
        })
      ])) : n.value && !$.value ? (l(), i("p", No, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        I[8] || (I[8] = G("Loading images…", -1))
      ])) : $.value && !f.value.length && !u.value ? (l(), P(xa, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: I[3] || (I[3] = (_) => a(d)())
      })) : $.value ? (l(), i(Y, { key: 5 }, [
        s("div", zo, [
          t(a($a), { class: "mail-search" }, {
            default: L(() => [
              t(a(wa), null, {
                default: L(() => [
                  t(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(de), {
                modelValue: y.value,
                "onUpdate:modelValue": I[4] || (I[4] = (_) => y.value = _),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          s("span", Mo, p(X.value), 1)
        ]),
        f.value.length ? (l(), P(a(ka), {
          key: 1,
          value: f.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: I[5] || (I[5] = (_) => ae(_.data))
        }, {
          default: L(() => [
            t(a(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: L(({ data: _ }) => [
                t(sl, {
                  name: _.name,
                  revision: _.revision,
                  asset: _.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: L(({ data: _ }) => [
                t(a(D), {
                  link: "",
                  class: "mail-name",
                  label: _.title,
                  onClick: Ue((M) => ae(_), ["stop"])
                }, null, 8, ["label", "onClick"]),
                s("span", Oo, [
                  s("span", Do, p(_.name), 1),
                  _.asset?.filename ? (l(), i(Y, { key: 0 }, [
                    G(" · " + p(_.asset.filename), 1)
                  ], 64)) : T("", !0)
                ])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: _ }) => [
                s("span", qo, p(ee(_)), 1)
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: L(({ data: _ }) => [
                s("span", null, p(F(_)), 1)
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: L(({ data: _ }) => [
                t(Sa, { resource: _ }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: _ }) => [
                s("span", Bo, p(_.state === "original" ? "—" : a(Ba)(_.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), i("p", Po, "Nothing matches. Try another name.")),
        C.value ? (l(), i("div", Ho, [
          m.value ? (l(), i("span", Fo, p(m.value), 1)) : T("", !0),
          t(a(D), {
            label: m.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: g.value,
            disabled: n.value,
            onClick: j
          }, null, 8, ["label", "loading", "disabled"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      t(Io, {
        name: r.asset,
        onClose: I[6] || (I[6] = (_) => a(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), Wo = { class: "kx-modal-head-icon" }, Ko = { class: "kx-modal-head-text" }, Yo = { class: "kx-modal-head-title" }, Go = { class: "kx-modal-head-sub" }, Zo = ["id"], Qo = ["disabled", "inert"], Xo = {
  key: 0,
  class: "mail-field"
}, er = {
  key: 1,
  class: "mail-field"
}, ar = ["for"], lr = { class: "mail-field" }, tr = ["for"], sr = ["for"], ir = ["id"], nr = { class: "mail-field" }, or = ["for"], rr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ne = "\0blank", ur = /* @__PURE__ */ se({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, go: u } = be(), R = h("message"), f = h(""), C = h(""), U = h(""), n = h(""), $ = h(!1), S = h(!1), g = h(""), x = h(""), w = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, m = ["message", "base", "part"].map((_) => ({ value: _, label: pe[_] })), c = H(() => !!o.intent.from), b = [{ value: Ne, label: "Blank" }], j = H(() => !!f.value);
    function F(_) {
      if (f.value = _ ?? "", !_ || _ === Ne) return;
      const M = y.find(R.value, _);
      M && (n.value = M.description, o.intent.from && (C.value = `${M.title} copy`, $.value = !1));
    }
    Z(() => o.visible, async (_) => {
      if (_)
        if (R.value = o.intent.from?.kind ?? o.intent.kind ?? "message", C.value = U.value = n.value = f.value = "", g.value = x.value = "", $.value = !1, o.intent.from) {
          const M = o.intent.from;
          f.value = M.name;
          try {
            await y.search(M.kind, void 0, [M.name]);
          } catch (V) {
            g.value = ne(V, "The resource to copy could not be read.");
          }
          o.visible && F(M.name);
        } else
          f.value = Ne;
    }, { immediate: !0 }), Z(R, () => {
      o.intent.from || (f.value = Ne, n.value = "");
    }), ke(() => o.visible), Z(C, (_) => {
      $.value || (U.value = Ja(_));
    });
    const X = H(() => R.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function ee() {
      return x.value = "", U.value || (x.value = "Enter a reference."), !x.value;
    }
    async function ae() {
      if (!(S.value || !C.value.trim() || !j.value || !ee())) {
        S.value = !0, g.value = "";
        try {
          const _ = f.value === Ne ? await le.create(as(R.value, U.value, C.value.trim(), n.value.trim())) : await le.copy({
            kind: R.value,
            name: U.value,
            title: C.value.trim(),
            description: n.value.trim(),
            from: { kind: R.value, name: f.value }
          });
          y.patch(_.kind, _.name, Qa(_)), d("close"), u({ name: "resource", kind: _.kind, resource: _.name, section: "content" });
        } catch (_) {
          ge(_) === "mail_revision_conflict" ? x.value = `A ${pe[R.value].toLowerCase()} with this reference already exists. Choose another.` : ge(_) === "invalid_mail_resource" ? x.value = Wa : g.value = ne(_, "The resource could not be created.");
        } finally {
          S.value = !1;
        }
      }
    }
    const J = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, I = H(() => o.intent.from ? `Duplicate ${y.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${pe[R.value].toLowerCase()}`);
    return (_, M) => (l(), P(a(Re), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !S.value,
      "close-on-escape": !S.value,
      class: "mail-dialog",
      pt: J,
      "aria-label": I.value,
      "onUpdate:visible": M[6] || (M[6] = (V) => {
        V || d("close");
      })
    }, {
      header: L(() => [
        s("span", Wo, [
          t(a(N), {
            icon: a(fe)[R.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        s("span", Ko, [
          s("span", Yo, p(I.value), 1),
          s("span", Go, p(f.value === Ne ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: L(() => [
        t(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: S.value,
          onClick: M[5] || (M[5] = (V) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(D), {
          label: "Create " + a(pe)[R.value].toLowerCase(),
          type: "submit",
          form: w.hint,
          loading: S.value,
          disabled: !C.value.trim() || !j.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: L(() => [
        s("form", {
          id: w.hint,
          class: "mail-form",
          onSubmit: Ue(ae, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: S.value,
            inert: S.value || void 0
          }, [
            c.value ? T("", !0) : (l(), i("div", Xo, [
              M[7] || (M[7] = s("span", { class: "mail-field-label" }, "Kind", -1)),
              t(a(Ve), {
                modelValue: R.value,
                "onUpdate:modelValue": M[0] || (M[0] = (V) => R.value = V),
                options: a(m),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            c.value ? T("", !0) : (l(), i("div", er, [
              s("label", {
                class: "mail-field-label",
                for: w.source
              }, "Start from", 8, ar),
              t(Ke, {
                "model-value": f.value,
                kind: R.value,
                label: "Start from",
                "input-id": w.source,
                extra: b,
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": F
              }, null, 8, ["model-value", "kind", "input-id"])
            ])),
            s("div", lr, [
              s("label", {
                class: "mail-field-label",
                for: w.title
              }, "Name", 8, tr),
              t(a(de), {
                id: w.title,
                modelValue: C.value,
                "onUpdate:modelValue": M[1] || (M[1] = (V) => C.value = V),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", {
              class: ue(["mail-field", { "mail-field-invalid": x.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: w.reference
              }, "Reference", 8, sr),
              t(a(de), {
                id: w.reference,
                modelValue: U.value,
                "onUpdate:modelValue": M[2] || (M[2] = (V) => U.value = V),
                class: "mail-mono-input",
                invalid: !!x.value,
                "aria-describedby": w.reference + "-hint",
                onInput: M[3] || (M[3] = (V) => $.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: w.reference + "-hint",
                class: ue(x.value ? "mail-field-error" : "mail-field-hint")
              }, p(x.value || X.value), 11, ir)
            ], 2),
            s("div", nr, [
              s("label", {
                class: "mail-field-label",
                for: w.description
              }, "Description", 8, or),
              t(a(va), {
                id: w.description,
                modelValue: n.value,
                "onUpdate:modelValue": M[4] || (M[4] = (V) => n.value = V),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Qo),
          g.value ? (l(), i("p", rr, p(g.value), 1)) : T("", !0)
        ], 40, Zo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), dr = { class: "mail-drawer-head" }, cr = { class: "mail-drawer-title" }, vr = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, mr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, fr = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, br = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, yr = {
  key: 0,
  class: "kx-notice error mail-failure"
}, pr = { class: "mail-failure-body" }, hr = { key: 0 }, gr = { key: 1 }, kr = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, $r = {
  key: 3,
  class: "mail-sub"
}, wr = {
  key: 4,
  class: "mail-field-error",
  role: "alert"
}, _r = {
  key: 5,
  class: "mail-failure-actions"
}, xr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Cr = { class: "mail-facts mail-card" }, Vr = { key: 2 }, Sr = {
  key: 0,
  class: "mail-sub"
}, Tr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, Rr = { class: "mail-timeline" }, Ur = { class: "mail-muted" }, Ar = { class: "mail-facts" }, Ir = { class: "mail-mono-block" }, Lr = /* @__PURE__ */ se({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e, d = r, { library: y, go: u, capabilities: R, delivery: f } = be();
    ke(() => !!o.messageId);
    const C = h();
    Z(() => !!o.messageId, (V) => {
      V && Be(() => C.value?.focus());
    }, { immediate: !0 });
    const U = H(() => {
      const V = n.value?.last_error;
      if (!V) return;
      const k = f.value?.driver && f.value.driver.id === n.value?.driver_id ? f.value.driver.label : "The delivery service";
      return (R.value?.administer_delivery ? Ul(V.code, k) : void 0) ?? { lead: "", next: V.message };
    }), n = he(), $ = h(!1), S = h(!1), g = h(!1), x = h(""), w = h(""), m = h(!1), c = h(), b = h(!1), j = Ce();
    async function F() {
      const V = o.messageId, k = j();
      if (!V) {
        n.value = void 0;
        return;
      }
      $.value = !0;
      try {
        const v = await sa.get(V);
        if (!k()) return;
        n.value = v, x.value = "", S.value = g.value = !1;
      } catch (v) {
        if (!k()) return;
        n.value = void 0, S.value = ta(v), g.value = Je(v), x.value = S.value || g.value ? "" : ne(v, "This message could not be loaded.");
      } finally {
        k() && ($.value = !1);
      }
    }
    Z(() => o.messageId, (V) => {
      c.value = void 0, w.value = "", b.value = !1, V !== n.value?.message_id && (n.value = void 0), F();
    }, { immediate: !0 }), Ie("mail.activity", () => {
      o.messageId && F();
    });
    async function X() {
      const V = n.value;
      if (!(!V || m.value)) {
        m.value = !0, w.value = "";
        try {
          c.value = await sa.resend(V.message_id);
        } catch (k) {
          w.value = ne(k, "The message could not be sent again.");
        } finally {
          m.value = !1;
        }
      }
    }
    async function ee() {
      const V = n.value;
      if (V)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(V.message_id)}`), b.value = !0;
        } catch {
          b.value = !1;
        }
    }
    const ae = H(() => {
      const V = n.value?.template;
      return V ? y.title("message", V) : "";
    }), J = H(() => !!n.value?.template && y.exists("message", n.value.template) === !0), I = H(() => {
      const V = n.value;
      if (!V) return [];
      const k = [{ label: "Accepted for delivery", at: V.created_at }];
      return V.status === "queued" && V.next_attempt_at && k.push({ label: V.attempts ? `Attempt ${V.attempts} did not go through; trying again` : "Next delivery attempt", at: V.next_attempt_at }), V.sent_at ? k.push({ label: V.attempts > 1 ? `Sent after ${V.attempts} attempts` : "Sent", at: V.sent_at }) : V.status === "failed" && V.finished_at && k.push({ label: V.attempts > 1 ? `Failed after ${V.attempts} attempts` : "Failed", at: V.finished_at }), k;
    }), _ = H(() => (n.value?.attachments ?? []).map((V) => V.filename || "Attachment")), M = H(() => {
      const V = n.value;
      return V ? [
        { label: "Message ID", value: V.message_id },
        { label: "Delivery service", value: R.value?.administer_delivery ? V.driver_id : void 0 },
        { label: "Service message ID", value: V.provider_message_id },
        { label: "Error code", value: V.last_error?.code },
        { label: "Service response", value: V.last_error?.provider_detail }
      ].filter((k) => !!k.value) : [];
    });
    return (V, k) => (l(), P(a(Ga), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !m.value,
      "close-on-escape": !m.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": k[6] || (k[6] = (v) => {
        v || d("close");
      })
    }, {
      default: L(() => [
        s("div", {
          ref_key: "drawer",
          ref: C,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          s("header", dr, [
            s("div", cr, [
              n.value ? (l(), P(a(Ae), {
                key: 0,
                severity: a(Ya)[n.value.status],
                value: a(Ka)[n.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : T("", !0),
              s("h2", null, p(n.value?.subject ?? "Message"), 1)
            ]),
            t(a(D), {
              text: "",
              severity: "secondary",
              disabled: !n.value,
              "aria-label": b.value ? "Link copied" : "Copy link",
              title: b.value ? "Link copied" : "Copy link",
              onClick: ee
            }, {
              icon: L(() => [
                t(a(N), {
                  icon: b.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            t(a(D), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: m.value,
              onClick: k[0] || (k[0] = (v) => d("close"))
            }, {
              icon: L(() => [
                t(a(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          $.value && !n.value ? (l(), i("p", vr, [
            t(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            k[7] || (k[7] = G("Loading message…", -1))
          ])) : S.value ? (l(), i("p", mr, [
            t(a(N), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            k[8] || (k[8] = G("This message is no longer in Activity.", -1))
          ])) : g.value ? (l(), i("p", fr, [
            t(a(N), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            k[9] || (k[9] = G("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : x.value ? (l(), i("div", br, [
            s("span", null, p(x.value), 1),
            t(a(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: k[1] || (k[1] = (v) => F())
            })
          ])) : T("", !0),
          n.value ? (l(), i(Y, { key: 4 }, [
            n.value.status === "failed" ? (l(), i("div", yr, [
              t(a(N), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              s("div", pr, [
                k[11] || (k[11] = s("strong", null, "This message was not delivered.", -1)),
                U.value?.lead ? (l(), i("span", hr, p(U.value.lead), 1)) : T("", !0),
                U.value ? (l(), i("span", gr, p(U.value.next), 1)) : T("", !0),
                c.value ? (l(), i("p", kr, [
                  k[10] || (k[10] = G(" Sent again as a new message. ", -1)),
                  t(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: k[2] || (k[2] = (v) => a(u)({ name: "activity", message: c.value.message_id }))
                  })
                ])) : n.value.can_resend ? T("", !0) : (l(), i("p", $r, "It cannot be sent again because its content was not kept.")),
                w.value ? (l(), i("p", wr, p(w.value), 1)) : T("", !0),
                c.value ? T("", !0) : (l(), i("div", _r, [
                  a(R)?.send && n.value.can_resend ? (l(), P(a(D), {
                    key: 0,
                    label: "Send again",
                    loading: m.value,
                    onClick: X
                  }, {
                    icon: L(() => [
                      t(a(N), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])) : T("", !0),
                  a(R)?.administer_delivery ? (l(), P(a(D), {
                    key: 1,
                    label: "Open delivery settings",
                    severity: "secondary",
                    outlined: "",
                    onClick: k[3] || (k[3] = (v) => a(Te).navigate("/system/settings/mail"))
                  })) : T("", !0)
                ]))
              ])
            ])) : n.value.status === "queued" ? (l(), i("p", xr, [
              t(a(N), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              k[12] || (k[12] = G("Waiting to be delivered. ", -1))
            ])) : T("", !0),
            s("dl", Cr, [
              k[18] || (k[18] = s("dt", null, "To", -1)),
              s("dd", null, p(n.value.to.join(", ")), 1),
              n.value.cc?.length ? (l(), i(Y, { key: 0 }, [
                k[13] || (k[13] = s("dt", null, "Cc", -1)),
                s("dd", null, p(n.value.cc.join(", ")), 1)
              ], 64)) : T("", !0),
              n.value.bcc?.length ? (l(), i(Y, { key: 1 }, [
                k[14] || (k[14] = s("dt", null, "Bcc", -1)),
                s("dd", null, p(n.value.bcc.join(", ")), 1)
              ], 64)) : T("", !0),
              n.value.reply_to ? (l(), i(Y, { key: 2 }, [
                k[15] || (k[15] = s("dt", null, "Reply-to", -1)),
                s("dd", null, p(n.value.reply_to), 1)
              ], 64)) : T("", !0),
              k[19] || (k[19] = s("dt", null, "Template", -1)),
              s("dd", null, [
                ae.value === void 0 ? (l(), P(a(Pe), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : J.value ? (l(), P(a(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ae.value,
                  onClick: k[4] || (k[4] = (v) => a(u)({ name: "resource", kind: "message", resource: n.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), i("span", Vr, p(ae.value || "Written directly"), 1))
              ]),
              k[20] || (k[20] = s("dt", null, "Sent by", -1)),
              s("dd", null, [
                G(p(a(xe)(n.value.sender_label, n.value.sender)), 1),
                n.value.origin ? (l(), i("span", Sr, p(a(ra)(n.value.origin)), 1)) : T("", !0)
              ]),
              _.value.length ? (l(), i(Y, { key: 3 }, [
                k[16] || (k[16] = s("dt", null, "Attachments", -1)),
                s("dd", null, p(_.value.join(", ")), 1)
              ], 64)) : T("", !0),
              n.value.resend_of ? (l(), i(Y, { key: 4 }, [
                k[17] || (k[17] = s("dt", null, "Sent again from", -1)),
                s("dd", null, [
                  t(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: k[5] || (k[5] = (v) => a(u)({ name: "activity", message: n.value.resend_of }))
                  })
                ])
              ], 64)) : T("", !0)
            ]),
            s("section", Tr, [
              k[21] || (k[21] = s("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              s("ol", Rr, [
                (l(!0), i(Y, null, me(I.value, (v) => (l(), i("li", {
                  key: v.label
                }, [
                  s("span", null, p(v.label), 1),
                  s("span", Ur, p(a(We)(v.at)), 1)
                ]))), 128))
              ])
            ]),
            M.value.length ? (l(), P(ll, {
              key: 2,
              label: "Technical details"
            }, {
              default: L(() => [
                s("dl", Ar, [
                  (l(!0), i(Y, null, me(M.value, (v) => (l(), i(Y, {
                    key: v.label
                  }, [
                    s("dt", null, p(v.label), 1),
                    s("dd", Ir, p(v.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : T("", !0)
          ], 64)) : T("", !0)
        ], 512)
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), jr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Er = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, Nr = { class: "mail-health-text" }, zr = { class: "mail-toolbar" }, Mr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, Pr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, Or = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Dr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, qr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Br = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Hr = { class: "mail-sub" }, Fr = {
  key: 0,
  class: "mail-sub"
}, Jr = { class: "mail-muted" }, Wr = {
  key: 2,
  class: "mail-more"
}, Kr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Yr = /* @__PURE__ */ se({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const r = e, { library: o, go: d } = be(), y = h("all"), u = h(r.template ?? null), R = h(30), f = h(""), C = h("");
    let U;
    Z(f, (A) => {
      clearTimeout(U), U = setTimeout(() => {
        C.value = A.trim();
      }, 250);
    }), Z(() => r.template, (A) => {
      A !== void 0 && (u.value = A);
    });
    const n = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], $ = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], S = he([]), g = h(), x = h(!0), w = h(!1), m = h(!1), c = h(!1), b = h(""), j = h(""), F = h(""), X = Ce();
    function ee(A) {
      return {
        status: y.value === "all" ? void 0 : y.value,
        message: u.value || void 0,
        since: Date.now() - R.value * 24 * 60 * 60 * 1e3,
        q: C.value || void 0,
        cursor: A
      };
    }
    async function ae(A = !1) {
      const E = X();
      x.value = !0;
      try {
        const K = await sa.list(ee());
        if (!E()) return;
        S.value = K.items, g.value = K.next_cursor, I.value = K.total, _.value = !!K.total_is_lower_bound, M.value = K.failed_today ?? 0, b.value = j.value = F.value = "", c.value = !1, w.value = !0;
      } catch (K) {
        if (!E()) return;
        c.value = Je(K);
        const te = c.value ? "" : ne(K, "Activity could not be loaded.");
        A && w.value && !c.value ? F.value = te : b.value = te;
      } finally {
        E() && (x.value = !1);
      }
    }
    async function J() {
      if (x.value || !g.value || m.value) return;
      const A = X();
      m.value = !0, j.value = "";
      try {
        const E = await sa.list(ee(g.value));
        if (!A()) return;
        const K = new Set(S.value.map((te) => te.message_id));
        S.value = [...S.value, ...E.items.filter((te) => !K.has(te.message_id))], g.value = E.next_cursor;
      } catch (E) {
        A() && (j.value = ne(E, "More activity could not be loaded."));
      } finally {
        m.value = !1;
      }
    }
    const I = h(), _ = h(!1), M = h(0);
    Z([y, u, R, C], () => {
      ae();
    }), ia(() => ae(w.value)), Ie("mail.activity", () => {
      ae(w.value);
    });
    const V = H(() => {
      const A = I.value ?? S.value.length;
      return _.value ? `${A.toLocaleString()}+ messages` : ye(A, "message");
    }), k = H(() => _.value && !!C.value), v = H(() => M.value ? `${ye(M.value, "message")} failed today.` : "");
    function B(A) {
      return A ? o.title("message", A) : "—";
    }
    function Q(A) {
      d({ name: "activity", message: A.message_id });
    }
    function O() {
      d({ name: "activity", template: u.value || void 0 });
    }
    return (A, E) => (l(), i(Y, null, [
      t(Fe, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      c.value ? (l(), i("p", jr, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[8] || (E[8] = G("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), i(Y, { key: 1 }, [
        v.value ? (l(), i("p", Er, [
          t(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", Nr, [
            s("strong", null, p(v.value), 1),
            G(" " + p(y.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          y.value !== "failed" ? (l(), P(a(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: E[0] || (E[0] = (K) => y.value = "failed")
          })) : T("", !0)
        ])) : T("", !0),
        s("div", zr, [
          t(a(Ve), {
            modelValue: y.value,
            "onUpdate:modelValue": E[1] || (E[1] = (K) => y.value = K),
            options: n,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          t(Ke, {
            modelValue: u.value,
            "onUpdate:modelValue": E[2] || (E[2] = (K) => u.value = K),
            kind: "message",
            label: "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue"]),
          t(a(_a), {
            modelValue: R.value,
            "onUpdate:modelValue": E[3] || (E[3] = (K) => R.value = K),
            options: $,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          t(a($a), { class: "mail-search" }, {
            default: L(() => [
              t(a(wa), null, {
                default: L(() => [
                  t(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(de), {
                modelValue: f.value,
                "onUpdate:modelValue": E[4] || (E[4] = (K) => f.value = K),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          w.value ? (l(), i("span", Mr, p(V.value), 1)) : T("", !0)
        ]),
        k.value ? (l(), i("p", Pr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : T("", !0),
        b.value ? (l(), i("div", Or, [
          s("span", null, p(b.value), 1),
          t(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: E[5] || (E[5] = (K) => ae())
          })
        ])) : T("", !0),
        F.value ? (l(), i("div", Dr, [
          s("span", null, p(F.value) + " The list shows what was loaded before.", 1),
          t(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: E[6] || (E[6] = (K) => ae(!0))
          })
        ])) : x.value && !w.value ? (l(), i("p", qr, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          E[9] || (E[9] = G("Loading activity…", -1))
        ])) : w.value ? (l(), i(Y, { key: 5 }, [
          S.value.length ? (l(), P(a(ka), {
            key: 1,
            value: S.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: E[7] || (E[7] = (K) => Q(K.data))
          }, {
            default: L(() => [
              t(a(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: L(({ data: K }) => [
                  t(a(Ae), {
                    severity: a(Ya)[K.status],
                    value: a(Ka)[K.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              t(a(ce), { header: "Message" }, {
                body: L(({ data: K }) => [
                  t(a(D), {
                    link: "",
                    class: "mail-name",
                    label: K.subject,
                    onClick: Ue((te) => Q(K), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  s("span", Hr, p(a(Al)(K.to)), 1)
                ]),
                _: 1
              }),
              t(a(ce), { header: "Template" }, {
                body: L(({ data: K }) => [
                  B(K.template) === void 0 ? (l(), P(a(Pe), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), i(Y, { key: 1 }, [
                    G(p(B(K.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              t(a(ce), { header: "Sent by" }, {
                body: L(({ data: K }) => [
                  s("span", null, p(a(xe)(K.sender_label, K.sender)), 1),
                  K.origin ? (l(), i("span", Fr, p(a(ra)(K.origin)), 1)) : T("", !0)
                ]),
                _: 1
              }),
              t(a(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: L(({ data: K }) => [
                  s("span", Jr, p(a(Il)(K.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), i("p", Br, p(C.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          g.value ? (l(), i("div", Wr, [
            j.value ? (l(), i("span", Kr, p(j.value), 1)) : T("", !0),
            t(a(D), {
              label: j.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: m.value,
              disabled: x.value,
              onClick: J
            }, null, 8, ["label", "loading", "disabled"])
          ])) : T("", !0)
        ], 64)) : T("", !0)
      ], 64)),
      t(Lr, {
        "message-id": e.message,
        onClose: O
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Gr = { class: "kx-shell kx-settings-shell mail-admin" }, Zr = { class: "kx-main" }, Qr = /* @__PURE__ */ se({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: r }) {
    const o = e, d = r, y = he(Ma(o.route ?? "")), u = H(() => y.value), R = h(!1);
    Z(R, (v) => d("dirty-change", v), { flush: "sync" });
    let f = !1;
    async function C() {
      if (!R.value) return !0;
      if (f) return !1;
      f = !0;
      try {
        return await Te.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        f = !1;
      }
    }
    function U(v, B) {
      return v.name === "resource" && B.name === "resource" && v.kind === B.kind && v.resource === B.resource;
    }
    async function n(v) {
      const B = Ee(v);
      !U(u.value, v) && !await C() || (U(u.value, v) || (R.value = !1), y.value = v, o.route !== void 0 && B !== o.route && d("navigate", B));
    }
    Z(() => o.route, async (v, B) => {
      if (v === void 0) return;
      const Q = Ma(v);
      if (Ee(Q) !== Ee(y.value)) {
        if (!U(y.value, Q) && R.value) {
          if (!await C()) {
            B !== void 0 && o.route === v && d("navigate", Ee(y.value));
            return;
          }
          R.value = !1;
        }
        o.route === v && (y.value = Q);
      }
    });
    const $ = lt(), S = bl();
    Z(S, (v, B) => {
      B === !1 && v === !0 && $.refresh();
    });
    const g = h(), x = h();
    async function w() {
      try {
        g.value = await Ll.capabilities();
      } catch {
        g.value = void 0;
      }
      if (g.value?.administer_delivery)
        try {
          x.value = await jl.status();
        } catch {
          x.value = void 0;
        }
    }
    w();
    const m = h(!1), c = h(!1), b = h({});
    function j(v) {
      b.value = v, m.value = !0;
    }
    Cl(Za, {
      library: $,
      capabilities: g,
      delivery: x,
      go: (v) => {
        n(v);
      },
      create: j,
      upload: () => {
        c.value = !0;
      },
      setDirty: (v) => {
        R.value = v;
      },
      setTitle: (v) => {
        I.value = v;
      }
    });
    const F = {
      content: (v) => v === "message" ? "Message" : v === "base" ? "Layout" : "Content",
      variables: (v) => v === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, X = {
      content: (v) => fe[v],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, ee = H(() => !!g.value?.administer_delivery), ae = H(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: fe.message },
        { value: "bases", label: "Base templates", icon: fe.base },
        { value: "parts", label: "Parts", icon: fe.part },
        { value: "assets", label: "Images", icon: fe.asset }
      ] },
      ...ee.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), J = { value: "all", label: "All resources", icon: "tabler:table" }, I = h("");
    Z(() => Ee(u.value), () => {
      I.value = "";
    });
    const _ = H(() => {
      const v = u.value;
      if (v.name === "resource")
        return {
          leading: { value: "all", label: "All " + ha[v.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: I.value || " ", items: el(v.kind).map((B) => ({
            value: B,
            label: F[B](v.kind),
            icon: X[B](v.kind)
          })) }]
        };
    }), M = H(() => {
      const v = u.value;
      return v.name === "resource" ? v.section : v.name === "activity" ? "activity" : v.section;
    });
    function V(v) {
      const B = u.value;
      if (B.name === "resource") {
        n(v === "all" ? { name: "library", section: fa(B.kind) } : { ...B, section: v });
        return;
      }
      n(v === "activity" ? { name: "activity" } : { name: "library", section: v });
    }
    const k = h();
    return Z(() => Ee(u.value), () => {
      k.value?.scrollTo({ top: 0 });
    }), (v, B) => (l(), i("main", Gr, [
      t(at, {
        label: "Mail sections",
        title: "Mail",
        value: M.value,
        groups: _.value ? _.value.groups : ae.value,
        "leading-item": _.value ? _.value.leading : J,
        "onUpdate:value": V
      }, null, 8, ["value", "groups", "leading-item"]),
      s("div", Zr, [
        s("div", {
          ref_key: "main",
          ref: k,
          class: ue(["kx-main-scroll mail-main", { "mail-main-wide": u.value.name === "resource" && u.value.section === "content" }])
        }, [
          u.value.name === "resource" ? (l(), P(jn, {
            key: u.value.kind + "/" + u.value.resource,
            kind: u.value.kind,
            name: u.value.resource,
            section: u.value.section
          }, null, 8, ["kind", "name", "section"])) : u.value.name === "activity" ? (l(), i(Y, { key: 1 }, [
            ee.value ? (l(), P(Yr, {
              key: 0,
              message: u.value.message,
              template: u.value.template
            }, null, 8, ["message", "template"])) : g.value ? (l(), i(Y, { key: 1 }, [
              t(Fe, {
                title: "Activity",
                description: ""
              }),
              B[2] || (B[2] = s("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : T("", !0)
          ], 64)) : u.value.section === "assets" ? (l(), P(Jo, {
            key: 2,
            asset: u.value.asset
          }, null, 8, ["asset"])) : (l(), P(Zt, {
            key: 3,
            section: u.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      t(ur, {
        visible: m.value,
        intent: b.value,
        onClose: B[0] || (B[0] = (Q) => m.value = !1)
      }, null, 8, ["visible", "intent"]),
      t(il, {
        visible: c.value,
        onClose: B[1] || (B[1] = (Q) => c.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Xr = /* @__PURE__ */ se({
  __name: "MailAdminRoot",
  setup(e) {
    const r = yl(), o = pl();
    return (d, y) => (l(), P(Qr, {
      route: a(r).route,
      onNavigate: y[0] || (y[0] = (u) => a(o)("navigate", { route: u })),
      onDirtyChange: y[1] || (y[1] = (u) => a(o)("dirty-change", { dirty: u }))
    }, null, 8, ["route"]));
  }
}), Su = { rootComponent: Xr, plugins: [hl] };
export {
  Su as config
};
//# sourceMappingURL=mount-XYoQIHd5.js.map
