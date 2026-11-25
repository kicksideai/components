import { u as Fe, a as fl, b as bl, P as yl } from "./wc-runtime-UUwuoPn6.js";
import { defineComponent as ie, useId as ve, openBlock as l, createElementBlock as i, unref as a, normalizeClass as re, createElementVNode as s, createTextVNode as G, toDisplayString as b, createCommentVNode as S, renderSlot as Ne, computed as B, createBlock as D, resolveDynamicComponent as pl, normalizeProps as hl, guardReactiveProps as gl, createSlots as ya, withCtx as I, Fragment as K, renderList as me, inject as kl, reactive as Da, ref as y, createVNode as t, watch as Q, nextTick as Be, onBeforeUnmount as sa, shallowRef as he, withModifiers as Te, useModel as pa, mergeModels as la, defineAsyncComponent as da, withDirectives as $l, vShow as wl, provide as _l } from "vue";
import { host as qe, api as xl, on as Cl } from "@wippy-fe/proxy";
import { Icon as O } from "@iconify/vue";
import { u as Le, l as le, d as se, k as pe, b as ia, A as Vl, e as ke, p as ye, w as qa, a as Ve, _ as Je, c as ha, f as fe, s as Ba, i as We, g as we, h as ga, j as Ke, m as Ha, o as na, n as Sl, q as oa, r as ca, t as Fa, v as Ja, x as Wa, y as Tl, z as Ka, B as Ya, C as ta, D as Rl, E as Ul, F as Al, G as Ll } from "./navigation-B2wAj0uZ.js";
import ze from "primevue/skeleton";
import q from "primevue/button";
import ce from "primevue/column";
import ka from "primevue/datatable";
import $a from "primevue/iconfield";
import wa from "primevue/inputicon";
import ue from "primevue/inputtext";
import Ce from "primevue/selectbutton";
import Se from "primevue/dialog";
import jl from "primevue/progressbar";
import Ae from "primevue/tag";
import _a from "primevue/select";
import Il from "primevue/accordion";
import El from "primevue/accordioncontent";
import Nl from "primevue/accordionheader";
import Ml from "primevue/accordionpanel";
import zl from "primevue/menu";
import Ol from "primevue/checkbox";
import Pl from "primevue/inputnumber";
import va from "primevue/textarea";
import Ga from "primevue/drawer";
import Dl from "primevue/fileupload";
const ql = ["aria-labelledby"], Bl = { class: "kx-railhead" }, Hl = ["id"], Fl = { key: 0 }, Jl = { class: "kx-railhead-acts" }, Wl = { class: "kx-rail-body" }, Kl = /* @__PURE__ */ ie({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const r = ve();
    return (n, d) => (l(), i("aside", {
      class: re(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(r)
    }, [
      s("div", Bl, [
        s("span", {
          id: a(r),
          class: "kx-railhead-title"
        }, [
          G(b(e.title), 1),
          e.count !== void 0 ? (l(), i("b", Fl, b(e.count), 1)) : S("", !0)
        ], 8, Hl),
        s("div", Jl, [
          Ne(n.$slots, "actions")
        ])
      ]),
      Ne(n.$slots, "toolbar"),
      s("div", Wl, [
        Ne(n.$slots, "default")
      ])
    ], 10, ql));
  }
}), Yl = ["aria-label"], Gl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Zl = ["aria-current", "onClick"], Ql = { class: "kx-settings-rail-label" }, Xl = /* @__PURE__ */ ie({
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
    const r = e, n = B(() => r.leadingItem ? [{ items: [r.leadingItem] }, ...r.groups] : r.groups);
    function d(m) {
      const u = [...m.currentTarget.querySelectorAll(".kx-settings-rail-item")], x = u.indexOf(m.target);
      if (x < 0) return;
      let v;
      switch (m.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = (x + 1) % u.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = (x + u.length - 1) % u.length;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = u.length - 1;
          break;
        default:
          return;
      }
      m.preventDefault(), u[v]?.focus();
    }
    return (m, u) => (l(), D(pl(e.title ? Kl : "div"), hl(gl(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ya({
      default: I(() => [
        s("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: d
        }, [
          (l(!0), i(K, null, me(n.value, (x, v) => (l(), i("div", {
            key: x.items[0]?.value ?? v,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && v === 0 }])
          }, [
            x.heading ? (l(), i("div", Gl, b(x.heading), 1)) : S("", !0),
            (l(!0), i(K, null, me(x.items, (_) => (l(), i("button", {
              key: _.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": _.value === e.value ? "true" : void 0,
              onClick: (T) => m.$emit("update:value", _.value)
            }, [
              _.icon ? (l(), D(a(O), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: _.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", Ql, b(_.label), 1)
            ], 8, Zl))), 128))
          ], 2))), 128))
        ], 42, Yl)
      ]),
      _: 2
    }, [
      e.title && m.$slots.actions ? {
        name: "actions",
        fn: I(() => [
          Ne(m.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Za = Symbol("mail-admin");
function be() {
  const e = kl(Za);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function Qa(e) {
  const { kind: r, name: n, title: d, description: m, state: u, revision: x, origin: v, origin_label: _, base: T, author: o, author_label: h, updated_at: C, used_by: g } = e, V = g && {
    messages: g.messages?.length,
    recent_sources: g.recent_senders?.length
  };
  return { kind: r, name: n, title: d, description: m, state: u, revision: x, origin: v, origin_label: _, base: T, author: o, author_label: h, updated_at: C, used_by: V };
}
const Me = 100, ma = 50;
function et() {
  const e = Da(/* @__PURE__ */ new Map()), r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Map(), m = y(""), u = y(0);
  let x = !1;
  const v = (c, A) => `${c}/${A}`;
  function _(c) {
    for (const A of c) e.set(v(A.kind, A.name), A);
  }
  async function T(c, A) {
    const z = u.value;
    for (let Z = 0; Z < A.length; Z += Me) {
      const X = A.slice(Z, Z + Me);
      try {
        const ee = await le.page({ kind: c, names: X, limit: Me });
        if (z !== u.value) return;
        const H = new Map(ee.items.map((j) => [j.name, j]));
        for (const j of X) {
          const $ = v(c, j);
          e.has($) || e.set($, H.get(j) ?? null);
        }
      } catch (ee) {
        if (z !== u.value) return;
        for (const H of X) d.set(v(c, H), z);
        m.value = se(ee, "Library references could not be loaded.");
      } finally {
        if (z === u.value) for (const ee of X) n.delete(v(c, ee));
      }
    }
  }
  function o() {
    x = !1;
    const c = [...r.entries()];
    r.clear();
    for (const [A, z] of c) T(A, [...z]);
  }
  function h(c, A) {
    const z = v(c, A);
    if (d.get(z) === u.value || e.has(z) || n.has(z)) return;
    n.add(z);
    const Z = r.get(c) ?? /* @__PURE__ */ new Set();
    Z.add(A), r.set(c, Z), x || (x = !0, queueMicrotask(o));
  }
  function C(c, A) {
    const z = e.get(v(c, A));
    return z === void 0 && h(c, A), z ?? void 0;
  }
  function g(c, A) {
    const z = e.get(v(c, A));
    if (z === void 0) {
      h(c, A);
      return;
    }
    return z !== null;
  }
  function V(c, A) {
    const z = e.get(v(c, A));
    if (z === void 0) {
      h(c, A);
      return;
    }
    return z?.title ?? A;
  }
  async function U(c, A, z) {
    const Z = u.value, X = await le.page({ kind: c, q: A || void 0, names: z, limit: ma });
    return Z === u.value && _(X.items), X;
  }
  function k(c, A, z) {
    e.set(v(c, A), z ?? null);
  }
  function p() {
    u.value++, r.clear(), n.clear(), d.clear(), e.clear(), m.value = "";
  }
  return Le("mail.library", p), { find: C, exists: g, title: V, search: U, remember: _, patch: k, refresh: p, lookupError: m };
}
const at = { class: "kx-empty" }, lt = { class: "kx-empty-ico" }, tt = { class: "kx-empty-title" }, st = {
  key: 0,
  class: "kx-empty-sub"
}, xa = /* @__PURE__ */ ie({
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
    return (r, n) => (l(), i("div", at, [
      s("div", lt, [
        t(a(O), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      s("div", tt, b(e.title), 1),
      e.hint || r.$slots.hint ? (l(), i("p", st, [
        Ne(r.$slots, "hint", {}, () => [
          G(b(e.hint), 1)
        ])
      ])) : S("", !0),
      e.cta ? (l(), D(a(q), {
        key: 1,
        label: e.cta,
        onClick: n[0] || (n[0] = (d) => r.$emit("cta"))
      }, ya({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: I(({ class: d }) => [
            t(a(O), {
              icon: e.ctaIcon,
              class: re(d),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : S("", !0)
    ]));
  }
}), Ca = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Xa = Object.fromEntries(Object.entries(Ca).map(([e, r]) => [r, e])), it = ["content", "variables", "used-by", "history"];
function fa(e) {
  return Ca[e];
}
function nt(e) {
  return Xa[e];
}
function el(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : it;
}
function Ie(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${Ca[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function za(e) {
  const r = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [n, d, m] = r;
  if (!n) return { name: "library", section: "all" };
  try {
    if (n === "activity")
      return d === "template" && m ? { name: "activity", template: decodeURIComponent(m) } : d ? { name: "activity", message: decodeURIComponent(d) } : { name: "activity" };
    if (n === "assets") return d ? { name: "library", section: "assets", asset: decodeURIComponent(d) } : { name: "library", section: "assets" };
    const u = Xa[n];
    if (!u) return { name: "library", section: "all" };
    if (!d) return { name: "library", section: n };
    const v = el(u).find((_) => _ === m) ?? "content";
    return { name: "resource", kind: u, resource: decodeURIComponent(d), section: v };
  } catch {
    return { name: "library", section: "all" };
  }
}
const ot = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", rt = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${ot}"><base target="_blank">`;
function Va(e, r) {
  let n = e;
  for (const [d, m] of Object.entries(r ?? {}))
    n = n.split("cid:" + d).join(m);
  return rt + n;
}
function ut() {
  let e = document.activeElement;
  for (; e?.shadowRoot?.activeElement; ) e = e.shadowRoot.activeElement;
  return e instanceof HTMLElement ? e : null;
}
function $e(e) {
  let r = null;
  Q(e, (n) => {
    if (n) {
      r = ut();
      return;
    }
    const d = r;
    r = null, Be(() => {
      d?.isConnected && d.focus();
    });
  });
}
const dt = {
  class: "mail-problem",
  role: "alert"
}, ct = { class: "mail-problem-lead" }, vt = {
  key: 0,
  class: "mail-problem-detail"
}, mt = {
  key: 1,
  class: "mail-problem-involved"
}, ft = {
  key: 0,
  class: "mail-problem-self"
}, ba = /* @__PURE__ */ ie({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const r = e, { library: n, go: d } = be(), m = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, u = (o) => n.title(o.kind, o.name), x = (o) => !!o && !!r.draft && o.kind === r.draft.kind && o.name === r.draft.name, v = B(() => {
      const { resource: o, face: h, previewOf: C } = r.problem, g = h ? m[h] : "";
      if (o && r.draft && r.draft.kind !== "message" && o.kind === "message" && o.name === C)
        return `${u(o) ?? "The message"} does not render with your changes.`;
      if (r.problem.tooLarge) {
        const V = !o || x(o) ? r.draft ? `this ${pe[r.draft.kind].toLowerCase()}` : "it" : u(o) ?? "a resource it uses";
        return `The ${g || "content"} of ${V} is larger than Mail can send. Keep each rendered face under ${ia(r.problem.tooLarge)}.`;
      }
      if (!o || x(o)) {
        const V = r.draft ? `this ${pe[r.draft.kind].toLowerCase()}` : "it";
        return g ? `The ${g} of ${V} does not render.` : `${V[0].toUpperCase()}${V.slice(1)} does not render.`;
      }
      return `${u(o) ?? "A resource it uses"} does not render${g ? ` (${g})` : ""}.`;
    }), _ = B(() => r.problem.candidates ?? []);
    function T(o) {
      o.kind === "asset" ? d({ name: "library", section: "assets", asset: o.name }) : d({ name: "resource", kind: o.kind, resource: o.name, section: "content" });
    }
    return (o, h) => (l(), i("div", dt, [
      s("p", ct, [
        t(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, b(v.value), 1)
      ]),
      e.problem.tooLarge ? S("", !0) : (l(), i("code", vt, b(e.problem.engine ?? e.problem.message), 1)),
      _.value.length ? (l(), i("p", mt, [
        h[0] || (h[0] = s("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), i(K, null, me(_.value, (C) => (l(), i(K, {
          key: C.kind + C.name
        }, [
          x(C) ? (l(), i("span", ft, "This " + b(a(pe)[C.kind].toLowerCase()), 1)) : u(C) === void 0 ? (l(), D(a(ze), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), D(a(q), {
            key: 2,
            link: "",
            size: "small",
            label: u(C),
            class: "mail-inline-link",
            onClick: (g) => T(C)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : S("", !0)
    ]));
  }
}), Oa = ["html", "text", "subject", "variables", "samples"];
function Pe(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function He(e) {
  if (!(e instanceof Vl)) return;
  const r = e.details ?? {}, n = ke(e);
  if (n === "mail_resource_in_use") {
    const T = Array.isArray(r.messages) ? r.messages.filter((h) => typeof h == "string") : [], o = r.dependent;
    return {
      message: e.message,
      dependents: T,
      references: Array.isArray(r.resources) ? r.resources.filter(Pe) : void 0,
      face: Oa.find((h) => h === o?.face),
      resource: Pe(o?.resource) ? o.resource : void 0
    };
  }
  const d = Oa.find((T) => T === r.face) ?? (n === "invalid_template_vars" ? "samples" : void 0);
  if (!d) return;
  const m = Array.isArray(r.dependent_messages) ? r.dependent_messages.filter((T) => typeof T == "string") : [], u = Array.isArray(r.errors) ? r.errors.flatMap((T) => {
    const o = T;
    return Pe(o.resource) && typeof o.message == "string" ? [{ name: o.resource.name, message: o.message }] : [];
  }) : [], x = Array.isArray(r.candidate_resources) ? r.candidate_resources.filter(Pe) : [], v = typeof r.engine_message == "string" ? r.engine_message : void 0, _ = (n === "html_too_large" || n === "text_too_large") && typeof r.maximum == "number" ? r.maximum : void 0;
  return {
    message: e.message,
    engine: v,
    tooLarge: _,
    face: d,
    resource: Pe(r.resource) ? r.resource : void 0,
    dependents: m.length ? m : void 0,
    reasons: u.length ? u : void 0,
    candidates: x.length ? x : void 0
  };
}
const bt = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, yt = { class: "kx-modal-head-icon" }, pt = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, ht = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, gt = {
  key: 2,
  class: "mail-muted"
}, kt = ["data-name"], $t = { class: "mail-gallery-title" }, wt = { class: "mail-sub" }, _t = {
  key: 0,
  class: "mail-gallery-warning",
  role: "status"
}, xt = { class: "mail-gallery-frame" }, Ct = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, Vt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, St = {
  key: 2,
  class: "mail-gallery-problem"
}, Tt = {
  key: 1,
  role: "alert"
}, Rt = ["srcdoc", "title"], Ut = {
  key: 3,
  class: "mail-more"
}, At = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Lt = 3, jt = /* @__PURE__ */ ie({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const n = e, d = r, { go: m } = be();
    $e(() => n.visible);
    const u = y([]), x = y(), v = y(), _ = y(!1), T = y("");
    let o = 0, h = [], C = 0, g;
    async function V(w, f) {
      w.state = "loading";
      try {
        const L = await le.preview(w.name, []);
        if (f !== o) return;
        w.subject = L.subject, w.warning = L.warnings?.length ? L.warnings.map(qa).join(" ") : void 0, w.document = L.html ? Va(L.html, L.inline_assets) : "", w.state = "ready";
      } catch (L) {
        if (f !== o) return;
        w.problem = He(L), w.failure = w.problem ? "" : se(L, "This message could not be rendered."), w.state = "failed";
      }
    }
    function U(w) {
      for (; w === o && C < Lt && h.length; ) {
        const f = h.shift();
        f.state === "waiting" && (C++, V(f, w).finally(() => {
          C--, U(w);
        }));
      }
    }
    function k(w) {
      w.state !== "waiting" || h.includes(w) || (h.push(w), U(o));
    }
    const p = y();
    function c() {
      if (g?.disconnect(), typeof IntersectionObserver > "u" || !p.value) {
        for (const w of u.value) k(w);
        return;
      }
      g = new IntersectionObserver((w) => {
        for (const f of w) {
          if (!f.isIntersecting) continue;
          const L = u.value.find((ae) => ae.name === f.target.dataset.name);
          L && k(L);
        }
      }, { root: p.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const w of p.value.querySelectorAll("[data-name]")) g.observe(w);
    }
    async function A(w) {
      _.value = !0, T.value = "";
      try {
        const f = await le.page({ kind: "message", cursor: x.value });
        if (w !== o) return;
        u.value = [...u.value, ...f.items.map((L) => Da({ name: L.name, title: L.title, state: "waiting" }))], x.value = f.next_cursor, v.value = f.total, await Be(), c();
      } catch (f) {
        w === o && (T.value = se(f, "The messages could not be listed."));
      } finally {
        w === o && (_.value = !1);
      }
    }
    function z() {
      o++, h = [], g?.disconnect(), g = void 0;
    }
    function Z() {
      z(), u.value = [], x.value = v.value = void 0, A(o);
    }
    function X() {
      const w = ++o;
      h = [];
      for (const f of u.value) Object.assign(f, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Be(() => {
        w === o && c();
      });
    }
    Q(() => n.visible, (w) => {
      w ? Z() : z();
    }), sa(z);
    const ee = B(() => u.value.filter((w) => w.state === "ready" || w.state === "failed").length), H = B(() => u.value.filter((w) => w.state === "failed").length), j = B(() => {
      if (!u.value.length) return "";
      const w = `${ee.value} of ${ye(v.value ?? u.value.length, "message")} rendered`;
      return H.value ? `${w}, ${H.value} with a problem.` : w + ".";
    });
    function $(w) {
      d("close"), m({ name: "resource", kind: "message", resource: w, section: "content" });
    }
    const P = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (w, f) => (l(), D(a(Se), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: P,
      "aria-label": "Preview all messages",
      "onUpdate:visible": f[1] || (f[1] = (L) => {
        L || d("close");
      })
    }, {
      header: I(() => [
        s("span", yt, [
          t(a(O), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        f[2] || (f[2] = s("span", { class: "kx-modal-head-text" }, [
          s("span", { class: "kx-modal-head-title" }, "All messages"),
          s("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !u.value.length,
          onClick: X
        }, {
          icon: I(() => [
            t(a(O), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: I(() => [
        u.value.length ? (l(), i("div", pt, [
          s("span", null, b(j.value), 1),
          t(a(jl), {
            value: Math.round(ee.value / (v.value ?? u.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : S("", !0),
        _.value && !u.value.length ? (l(), i("p", ht, [
          t(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          f[3] || (f[3] = G("Listing messages…", -1))
        ])) : !_.value && !T.value && !u.value.length ? (l(), i("p", gt, "There are no messages yet.")) : S("", !0),
        s("ul", {
          ref_key: "list",
          ref: p,
          class: "mail-gallery"
        }, [
          (l(!0), i(K, null, me(u.value, (L) => (l(), i("li", {
            key: L.name,
            "data-name": L.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": L.state === "failed" }])
          }, [
            t(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + L.title,
              onClick: (ae) => $(L.name)
            }, {
              default: I(() => [
                s("span", $t, b(L.title), 1),
                s("span", wt, b(L.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            L.warning ? (l(), i("p", _t, [
              t(a(O), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              G(b(L.warning), 1)
            ])) : S("", !0),
            s("div", xt, [
              L.state === "waiting" ? (l(), i("p", Ct, "Renders when shown.")) : L.state === "loading" ? (l(), i("p", Vt, [
                t(a(O), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                f[4] || (f[4] = G("Rendering…", -1))
              ])) : L.state === "failed" ? (l(), i("div", St, [
                L.problem ? (l(), D(ba, {
                  key: 0,
                  problem: L.problem,
                  draft: { kind: "message", name: L.name }
                }, null, 8, ["problem", "draft"])) : (l(), i("p", Tt, b(L.failure), 1))
              ])) : (l(), i("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: L.document,
                title: L.title + " preview",
                tabindex: "-1"
              }, null, 8, Rt))
            ])
          ], 10, kt))), 128))
        ], 512),
        x.value || T.value ? (l(), i("div", Ut, [
          T.value ? (l(), i("span", At, b(T.value), 1)) : S("", !0),
          t(a(q), {
            label: T.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: _.value,
            onClick: f[0] || (f[0] = (L) => A(a(o)))
          }, null, 8, ["label", "loading"])
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), It = { class: "mail-source" }, Et = { key: 0 }, Nt = { key: 1 }, Sa = /* @__PURE__ */ ie({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (r, n) => (l(), i("span", It, [
      e.resource.state === "created" ? (l(), i("span", Et, b((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(Ve)(e.resource.author_label, e.resource.author)), 1)) : (l(), i("span", Nt, "Included with " + b(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), D(a(Ae), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : S("", !0)
    ]));
  }
}), Mt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, zt = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Ot = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Pt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Dt = { class: "mail-toolbar" }, qt = {
  class: "mail-count",
  role: "status"
}, Bt = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Ht = {
  key: 0,
  class: "mail-sub"
}, Ft = { class: "mail-kind" }, Jt = { class: "mail-muted" }, Wt = {
  key: 2,
  class: "mail-more"
}, Kt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Yt = /* @__PURE__ */ ie({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const r = e, { library: n, go: d, create: m } = be(), u = B(() => nt(r.section)), x = y("all"), v = y(""), _ = y("");
    let T;
    Q(v, (N) => {
      clearTimeout(T), T = setTimeout(() => {
        _.value = N.trim();
      }, 250);
    }), Q(() => r.section, () => {
      v.value = _.value = "", x.value = "all";
    });
    const o = he([]), h = y(), C = y(), g = y(!0), V = y(!1), U = y(!1), k = y(!1), p = y(""), c = y(""), A = y(""), z = we(), Z = () => ({ kind: u.value, state: x.value === "all" ? void 0 : x.value, q: _.value || void 0 });
    async function X(N = !1) {
      const E = z();
      g.value = !0;
      try {
        const R = await le.page(Z());
        if (!E()) return;
        o.value = R.items, h.value = R.next_cursor, C.value = R.total, p.value = c.value = A.value = "", k.value = !1, V.value = !0;
      } catch (R) {
        if (!E()) return;
        k.value = We(R);
        const M = k.value ? "" : se(R, "The mail library could not be loaded.");
        N && V.value && !k.value ? A.value = M : p.value = M;
      } finally {
        E() && (g.value = !1);
      }
    }
    async function ee() {
      if (g.value || !h.value || U.value) return;
      const N = z();
      U.value = !0, c.value = "";
      try {
        const E = await le.page({ ...Z(), cursor: h.value });
        if (!N()) return;
        o.value = [...o.value, ...E.items], h.value = E.next_cursor, C.value = E.total;
      } catch (E) {
        N() && (c.value = se(E, "More resources could not be loaded."));
      } finally {
        U.value = !1;
      }
    }
    Q([u, x, _], () => {
      X();
    }), Fe(() => X(V.value)), Le("mail.library", () => {
      X(V.value);
    });
    const H = B(() => {
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
    }), j = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], $ = B(() => {
      const N = u.value ? pe[u.value].toLowerCase() : "resource", E = C.value ?? o.value.length;
      return o.value.length < E ? `${o.value.length} of ${ye(E, N)}` : ye(E, N);
    });
    function P(N) {
      const E = N.used_by;
      return N.kind === "base" || N.kind === "asset" ? E?.messages ? ye(E.messages, "message") : "—" : N.kind === "message" ? E?.recent_sources ? ye(E.recent_sources, "recent sender") : "—" : "";
    }
    function w(N) {
      return N.base ? n.title("base", N.base) : "";
    }
    function f(N) {
      N.kind === "asset" ? d({ name: "library", section: "assets", asset: N.name }) : d({ name: "resource", kind: N.kind, resource: N.name, section: "content" });
    }
    const L = B(() => V.value && !p.value && u.value && !o.value.length && x.value === "all" && !_.value), ae = y(!1);
    return (N, E) => (l(), i(K, null, [
      t(Je, {
        title: H.value.title,
        description: H.value.description
      }, {
        actions: I(() => [
          !u.value || u.value === "message" ? (l(), D(a(q), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: E[0] || (E[0] = (R) => ae.value = !0)
          }, {
            icon: I(() => [
              t(a(O), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          t(a(q), {
            label: u.value ? "New " + a(pe)[u.value].toLowerCase() : "New",
            onClick: E[1] || (E[1] = (R) => a(m)({ kind: u.value }))
          }, {
            icon: I(() => [
              t(a(O), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      k.value ? (l(), i("p", Mt, [
        t(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[9] || (E[9] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : p.value ? (l(), i("div", zt, [
        s("span", null, b(p.value), 1),
        t(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[2] || (E[2] = (R) => X())
        })
      ])) : S("", !0),
      A.value ? (l(), i("div", Ot, [
        s("span", null, b(A.value) + " The list shows what was loaded before.", 1),
        t(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[3] || (E[3] = (R) => X(!0))
        })
      ])) : g.value && !V.value ? (l(), i("p", Pt, [
        t(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        E[10] || (E[10] = G("Loading mail library…", -1))
      ])) : L.value && u.value ? (l(), D(xa, {
        key: 4,
        icon: a(fe)[u.value],
        title: "No " + a(ha)[u.value].toLowerCase() + " yet",
        hint: "Create a " + a(pe)[u.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(pe)[u.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: E[4] || (E[4] = (R) => a(m)({ kind: u.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : V.value ? (l(), i(K, { key: 5 }, [
        s("div", Dt, [
          t(a(Ce), {
            modelValue: x.value,
            "onUpdate:modelValue": E[5] || (E[5] = (R) => x.value = R),
            options: j,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          t(a($a), { class: "mail-search" }, {
            default: I(() => [
              t(a(wa), null, {
                default: I(() => [
                  t(a(O), {
                    icon: g.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: g.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              t(a(ue), {
                modelValue: v.value,
                "onUpdate:modelValue": E[6] || (E[6] = (R) => v.value = R),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + H.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          s("span", qt, b($.value), 1)
        ]),
        o.value.length ? (l(), D(a(ka), {
          key: 1,
          value: o.value,
          "data-key": (R) => R.kind + "/" + R.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": H.value.title } },
          onRowClick: E[7] || (E[7] = (R) => f(R.data))
        }, {
          default: I(() => [
            t(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: I(({ data: R }) => [
                t(a(q), {
                  link: "",
                  class: "mail-name",
                  label: R.title,
                  onClick: Te((M) => f(R), ["stop"])
                }, null, 8, ["label", "onClick"]),
                R.description ? (l(), i("span", Ht, b(R.description), 1)) : S("", !0)
              ]),
              _: 1
            }),
            u.value ? S("", !0) : (l(), D(a(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: I(({ data: R }) => [
                s("span", Ft, [
                  t(a(O), {
                    icon: a(fe)[R.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  G(b(a(pe)[R.kind]), 1)
                ])
              ]),
              _: 1
            })),
            u.value === "message" ? (l(), D(a(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: I(({ data: R }) => [
                w(R) === void 0 ? (l(), D(a(ze), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i(K, { key: 1 }, [
                  G(b(w(R)), 1)
                ], 64))
              ]),
              _: 1
            })) : S("", !0),
            t(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: I(({ data: R }) => [
                t(Sa, { resource: R }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            u.value !== "part" ? (l(), D(a(ce), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: I(({ data: R }) => [
                G(b(P(R)), 1)
              ]),
              _: 1
            })) : S("", !0),
            t(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: R }) => [
                s("span", Jt, b(R.state === "original" ? "—" : a(Ba)(R.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), i("p", Bt, "Nothing matches. Try another name or a word from the template.")),
        h.value ? (l(), i("div", Wt, [
          c.value ? (l(), i("span", Kt, b(c.value), 1)) : S("", !0),
          t(a(q), {
            label: c.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: U.value,
            disabled: g.value,
            onClick: ee
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      t(jt, {
        visible: ae.value,
        onClose: E[8] || (E[8] = (R) => ae.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
}), Gt = /* @__PURE__ */ ie({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (r, n) => (l(), i(K, null, [
      t(a(Ae), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      t(a(q), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: n[0] || (n[0] = (d) => r.$emit("discard"))
      }, {
        icon: I(() => [
          t(a(O), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      t(a(q), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: n[1] || (n[1] = (d) => r.$emit("review", d.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
});
function Zt(e) {
  return JSON.parse(JSON.stringify(e));
}
function xe(e) {
  const r = Zt(e);
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
function Qt(e, r) {
  return JSON.stringify(xe(e)) === JSON.stringify(xe(r));
}
function Xt(e, r, n, d, m) {
  const u = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: r,
    title: n,
    description: d,
    base: m,
    subject: n,
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
    title: n,
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
  } : { kind: e, name: r, title: n, description: d, schema: u, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function es(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function as(e) {
  const r = [], n = e.samples;
  for (const [d, m] of Object.entries(e.schema.properties)) {
    const u = es(n[d] ?? m.default ?? (m.type === "string" ? "" : null));
    u !== void 0 && r.push(`${JSON.stringify(d)}, ${u}`);
  }
  return r.length ? `{{ include "/part/${e.name}" map(${r.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function al(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function ls(e, r, n) {
  return `<img src="${al(e)}" alt="${r.replace(/"/g, "&quot;")}" style="display:block;border:0;max-width:100%;height:auto;">`;
}
const ts = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function ss(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !ts.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const is = "{{ block body() }}{{ end }}", ns = { class: "mail-picker-search" }, os = ["for"], rs = {
  key: 0,
  class: "mail-kind"
}, us = { key: 1 }, ds = {
  key: 0,
  class: "mail-picker-more"
}, Ye = /* @__PURE__ */ ie({
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
    const r = e, n = pa(e, "modelValue"), { library: d } = be(), m = y(""), u = he([]), x = y(!1), v = y(!1), _ = y(""), T = ve(), o = we();
    async function h() {
      const k = o();
      v.value = !0;
      try {
        const p = r.names?.slice(0, Me), c = p && !p.length ? { items: [] } : await d.search(r.kind, m.value || void 0, p);
        if (!k()) return;
        u.value = c.items, x.value = !!c.next_cursor || (r.names?.length ?? 0) > Me, _.value = "";
      } catch (p) {
        k() && (_.value = se(p, "The choices could not be loaded."));
      } finally {
        k() && (v.value = !1);
      }
    }
    let C;
    Q(m, () => {
      clearTimeout(C), C = setTimeout(() => {
        h();
      }, 250);
    }), Q(() => [r.kind, r.names?.join(",")], () => {
      h();
    }), sa(() => clearTimeout(C));
    function g() {
      !u.value.length && !v.value && h();
    }
    const V = B(() => {
      const k = u.value.filter((c) => c.name !== r.exclude).map((c) => ({ value: c.name, label: c.title })), p = n.value;
      return p && !k.some((c) => c.value === p) && !r.extra?.some((c) => c.value === p) && k.unshift({ value: p, label: d.title(r.kind, p) ?? p }), [...r.extra ?? [], ...k];
    }), U = B(() => {
      const k = n.value;
      return k ? r.extra?.find((p) => p.value === k)?.label ?? d.title(r.kind, k) : "";
    });
    return (k, p) => (l(), D(a(_a), {
      modelValue: n.value,
      "onUpdate:modelValue": p[2] || (p[2] = (c) => n.value = c),
      options: V.value,
      "option-label": "label",
      "option-value": "value",
      "append-to": "self",
      "input-id": e.inputId,
      placeholder: e.placeholder,
      "aria-label": e.label,
      disabled: e.disabled,
      "show-clear": e.showClear,
      fluid: e.fluid,
      loading: v.value,
      "empty-message": _.value || (m.value ? "Nothing matches." : "Nothing to choose yet."),
      onShow: g
    }, {
      header: I(() => [
        s("div", ns, [
          s("label", {
            class: "mail-sr-only",
            for: a(T)
          }, "Search " + b(e.label.toLowerCase()), 9, os),
          t(a(ue), {
            id: a(T),
            modelValue: m.value,
            "onUpdate:modelValue": p[0] || (p[0] = (c) => m.value = c),
            type: "search",
            size: "small",
            fluid: "",
            placeholder: "Search…",
            onKeydown: p[1] || (p[1] = Te(() => {
            }, ["stop"]))
          }, null, 8, ["id", "modelValue"])
        ])
      ]),
      value: I(({ value: c, placeholder: A }) => [
        c ? (l(), i("span", rs, [
          t(a(O), {
            icon: a(fe)[e.kind],
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          G(b(U.value ?? ""), 1)
        ])) : (l(), i("span", us, b(A), 1))
      ]),
      footer: I(() => [
        x.value ? (l(), i("p", ds, "Showing the first matches. Search to find others.")) : S("", !0)
      ]),
      _: 1
    }, 8, ["modelValue", "options", "input-id", "placeholder", "aria-label", "disabled", "show-clear", "fluid", "loading", "empty-message"]));
  }
}), cs = {
  class: "mail-preview",
  "aria-label": "Preview"
}, vs = { class: "mail-preview-bar" }, ms = {
  key: 0,
  class: "mail-preview-with"
}, fs = ["for"], bs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ys = {
  key: 1,
  class: "mail-field-hint"
}, ps = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, hs = {
  key: 2,
  class: "mail-preview-envelope"
}, gs = ["aria-busy"], ks = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, $s = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, ws = ["srcdoc", "title"], _s = {
  key: 1,
  class: "mail-preview-text"
}, xs = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, Cs = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, Vs = {
  key: 5,
  class: "mail-preview-foot"
}, Ss = /* @__PURE__ */ ie({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: r }) {
    const n = e, d = r, { library: m, delivery: u } = be(), x = { message: ve() }, v = y("email"), _ = y("desktop"), T = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], o = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], h = y(""), C = y(""), g = y("");
    async function V() {
      if (n.draft.kind === "message") return;
      const f = n.messages?.slice(0, Me);
      try {
        const L = f && !f.length ? void 0 : await m.search("message", void 0, f);
        C.value = L?.items[0]?.name ?? "", (!h.value || n.messages && !n.messages.includes(h.value)) && (h.value = C.value), g.value = "";
      } catch (L) {
        g.value = se(L, "The messages could not be loaded.");
      }
    }
    Q(() => n.messages?.join(","), () => {
      V();
    }, { immediate: !0 });
    const U = B(() => n.draft.kind !== "message" && h.value && h.value === C.value ? "The first message in the library. Choose another to see it around different content." : ""), k = B(() => n.draft.kind === "message" ? n.draft.name : h.value), p = he(), c = y(!1), A = y(), z = y(""), Z = we();
    let X, ee = !1, H = !1;
    async function j() {
      const f = k.value;
      if (!f) return;
      if (ee) {
        H = !0;
        return;
      }
      ee = !0;
      const L = Z();
      c.value = !0;
      try {
        const ae = await le.preview(f, [n.draft]);
        if (!L()) return;
        p.value = ae, A.value = void 0, z.value = "";
      } catch (ae) {
        if (!L()) return;
        const N = He(ae);
        A.value = N ? { ...N, previewOf: f } : void 0, z.value = A.value ? "" : se(ae, "The preview could not be rendered.");
      } finally {
        ee = !1, L() && (c.value = !1), H && (H = !1, j());
      }
    }
    function $() {
      clearTimeout(X), X = setTimeout(() => {
        j();
      }, 450);
    }
    Q(() => JSON.stringify(n.draft), $), Q(k, () => {
      p.value = void 0, j();
    }, { immediate: !0 }), Q(A, (f) => d("problem", f)), sa(() => clearTimeout(X));
    const P = B(() => p.value?.html ? Va(p.value.html, p.value.inline_assets) : ""), w = B(() => {
      const f = u.value?.from;
      return f ? f.name ? `${f.name} <${f.address}>` : f.address : "";
    });
    return (f, L) => (l(), i("section", cs, [
      s("div", vs, [
        t(a(Ce), {
          modelValue: v.value,
          "onUpdate:modelValue": L[0] || (L[0] = (ae) => v.value = ae),
          options: T,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        v.value === "email" ? (l(), D(a(Ce), {
          key: 0,
          modelValue: _.value,
          "onUpdate:modelValue": L[1] || (L[1] = (ae) => _.value = ae),
          options: o,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: I(({ option: ae }) => [
            t(a(O), {
              icon: ae.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            G(b(ae.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : S("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), i("div", ms, [
        s("label", {
          for: x.message
        }, "Preview with", 8, fs),
        t(Ye, {
          modelValue: h.value,
          "onUpdate:modelValue": L[2] || (L[2] = (ae) => h.value = ae),
          kind: "message",
          label: "Preview with",
          "input-id": x.message,
          names: e.messages,
          placeholder: "Choose a message…"
        }, null, 8, ["modelValue", "input-id", "names"]),
        g.value ? (l(), i("small", bs, b(g.value), 1)) : U.value ? (l(), i("small", ys, b(U.value), 1)) : S("", !0)
      ])) : S("", !0),
      c.value && p.value ? (l(), i("p", ps, [
        t(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        L[3] || (L[3] = G("Updating the preview…", -1))
      ])) : S("", !0),
      p.value ? (l(), i("dl", hs, [
        w.value ? (l(), i(K, { key: 0 }, [
          L[4] || (L[4] = s("dt", null, "From", -1)),
          s("dd", null, b(w.value), 1)
        ], 64)) : S("", !0),
        L[5] || (L[5] = s("dt", null, "Subject", -1)),
        s("dd", null, b(p.value.subject), 1)
      ])) : S("", !0),
      s("div", {
        class: re(["mail-preview-body", ["mail-preview-" + _.value, { "mail-preview-stale": A.value || z.value }]]),
        "aria-busy": c.value
      }, [
        !p.value && c.value ? (l(), i("p", ks, [
          t(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          L[6] || (L[6] = G("Rendering preview…", -1))
        ])) : k.value ? p.value ? (l(), i(K, { key: 2 }, [
          v.value === "email" ? (l(), i("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: P.value,
            title: "Email preview: " + (p.value.subject ?? "")
          }, null, 8, ws)) : (l(), i("pre", _s, b(p.value.text), 1))
        ], 64)) : S("", !0) : (l(), i("p", $s, "Choose a message to see this " + b(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, gs),
      (l(!0), i(K, null, me(p.value?.warnings ?? [], (ae) => (l(), i("p", {
        key: ae.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        t(a(O), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        s("span", null, b(a(qa)(ae)), 1)
      ]))), 128)),
      A.value ? (l(), i("p", xs, [
        t(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, b(p.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : z.value ? (l(), i("p", Cs, [
        t(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, b(z.value), 1)
      ])) : (l(), i("p", Vs, [
        t(a(O), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        G(" " + b(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), Ts = { class: "kx-modal-head-icon" }, Rs = { class: "kx-modal-head-text" }, Us = { class: "kx-modal-head-sub" }, As = { class: "mail-change-list" }, Ls = { class: "mail-muted" }, js = { class: "mail-field" }, Is = ["for"], Es = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Ns = { class: "mail-failure-body" }, Ms = { class: "mail-dependents" }, zs = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Os = /* @__PURE__ */ ie({
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
    const n = e, d = r, { library: m, go: u } = be(), x = y(""), v = ve();
    Q(() => n.visible, (h) => {
      h && (x.value = n.suggestedNote ?? "");
    }), $e(() => n.visible);
    const _ = B(() => {
      const h = n.saved, C = n.draft, g = [];
      return (h.title !== C.title || h.description !== C.description) && g.push("Name and description"), h.base !== C.base && g.push(`Base template: ${m.title("base", C.base ?? "") ?? C.base}`), h.subject !== C.subject && g.push("Subject"), h.html !== C.html && g.push("HTML"), h.text !== C.text && g.push("Plain text"), (JSON.stringify(h.schema.properties) !== JSON.stringify(C.schema.properties) || JSON.stringify(h.schema.required ?? []) !== JSON.stringify(C.schema.required ?? [])) && g.push(C.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(h.samples) !== JSON.stringify(C.samples) && g.push("Sample values"), g;
    }), T = B(() => n.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${pe[n.draft.kind].toLowerCase()} changes when you save.`), o = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (h, C) => (l(), D(a(Se), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: o,
      "aria-label": "Review changes",
      "onUpdate:visible": C[3] || (C[3] = (g) => {
        g || d("close");
      })
    }, {
      header: I(() => [
        s("span", Ts, [
          t(a(O), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        s("span", Rs, [
          C[4] || (C[4] = s("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          s("span", Us, b(e.draft.title), 1)
        ])
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: C[2] || (C[2] = (g) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(q), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: I(() => [
        s("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: C[1] || (C[1] = Te((g) => d("save", x.value.trim()), ["prevent"]))
        }, [
          s("div", null, [
            C[5] || (C[5] = s("p", { class: "mail-field-label" }, "Changed", -1)),
            s("ul", As, [
              (l(!0), i(K, null, me(_.value, (g) => (l(), i("li", { key: g }, b(g), 1))), 128))
            ])
          ]),
          s("p", Ls, b(T.value) + " The previous version stays in History.", 1),
          s("div", js, [
            s("label", {
              class: "mail-field-label",
              for: a(v)
            }, "Note for History", 8, Is),
            t(a(ue), {
              id: a(v),
              modelValue: x.value,
              "onUpdate:modelValue": C[0] || (C[0] = (g) => x.value = g),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), i("div", Es, [
            t(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("div", Ns, [
              s("strong", null, b(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              s("span", null, b(e.dependents.reason), 1),
              s("span", Ms, [
                (l(!0), i(K, null, me(e.dependents.names, (g) => (l(), D(a(q), {
                  key: g,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(m).title("message", g) ?? g,
                  onClick: (V) => {
                    d("close"), a(u)({ name: "resource", kind: "message", resource: g, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), i("p", zs, b(e.error), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), ll = /* @__PURE__ */ ie({
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
    return (n, d) => (l(), D(a(Il), {
      class: "kx-disclosure",
      value: r.value ? "content" : void 0,
      "onUpdate:value": d[0] || (d[0] = (m) => r.value = m === "content")
    }, {
      default: I(() => [
        t(a(Ml), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: I(() => [
            t(a(Nl), { class: "kx-disclosure-toggle" }, {
              default: I(() => [
                G(b(e.label), 1)
              ]),
              _: 1
            }),
            t(a(El), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: I(() => [
                Ne(n.$slots, "default")
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
}), Ps = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ds = { class: "kx-modal-head-icon" }, qs = { class: "kx-modal-head-text" }, Bs = { class: "kx-modal-head-title" }, Hs = { class: "mail-field" }, Fs = ["for"], Js = { class: "kx-modal-head-icon" }, Ws = { class: "kx-modal-head-text" }, Ks = { class: "kx-modal-head-title" }, Ys = /* @__PURE__ */ ie({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: r, emit: n }) {
    const d = e, m = n, { library: u } = be(), x = y(), v = y(""), _ = y({});
    async function T(j) {
      try {
        const $ = await u.search(j);
        _.value = { ..._.value, [j]: $ };
      } catch ($) {
        v.value = se($, j === "part" ? "The parts could not be loaded." : "The images could not be loaded.");
      }
    }
    function o(j) {
      v.value = "", _.value = {}, T("part"), d.face === "html" && T("asset"), x.value?.toggle(j);
    }
    const h = y(), C = y();
    $e(() => !!h.value);
    function g(j) {
      C.value = void 0, h.value = j;
    }
    function V() {
      const j = h.value, $ = C.value;
      h.value = void 0, !(!j || !$) && (j === "part" ? p($) : Z($, u.title("asset", $) ?? $));
    }
    r({ toggle: o });
    const U = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], k = (j) => ({ label: j, disabled: !0, icon: "tabler:loader-2" });
    async function p(j) {
      v.value = "";
      try {
        m("insert", as(await le.get({ kind: "part", name: j })));
      } catch ($) {
        v.value = se($, "The part could not be read.");
      }
    }
    const c = y(), A = y(""), z = ve();
    $e(() => !!c.value);
    async function Z(j, $) {
      v.value = "";
      try {
        await le.get({ kind: "asset", name: j }), c.value = { name: j, title: $ }, A.value = $;
      } catch (P) {
        v.value = se(P, "The image could not be read.");
      }
    }
    function X() {
      c.value && (m("insert", ls(c.value.name, A.value)), c.value = void 0);
    }
    const ee = B(() => {
      const j = Object.entries(d.draft.schema.properties).map(([f]) => ({
        label: f,
        icon: "tabler:variable",
        command: () => m("insert", d.draft.kind === "part" ? `{{ .${f} }}` : ss(f))
      })), $ = [{
        label: d.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...j, ...U.map((f) => ({
          label: f.label,
          icon: "tabler:world",
          command: () => m("insert", `{{ ${f.name} }}`)
        }))]
      }], P = _.value.part, w = (P?.items ?? []).filter((f) => !(d.draft.kind === "part" && f.name === d.draft.name));
      if ($.push({ label: "Parts", items: P ? w.length ? [
        ...w.map((f) => ({ label: f.title, icon: fe.part, command: () => {
          p(f.name);
        } })),
        ...P.next_cursor ? [{ label: "Find another part…", icon: "tabler:search", command: () => g("part") }] : []
      ] : [{ label: "There are no parts to include yet.", disabled: !0 }] : [k("Loading parts…")] }), d.face === "html") {
        const f = _.value.asset, L = f?.items ?? [];
        $.push({ label: "Images", items: f ? L.length ? [
          ...L.map((ae) => ({ label: ae.title, icon: fe.asset, command: () => {
            Z(ae.name, ae.title);
          } })),
          ...f.next_cursor ? [{ label: "Find another image…", icon: "tabler:search", command: () => g("asset") }] : []
        ] : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [k("Loading images…")] });
      }
      return d.draft.kind === "base" && $.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => m("insert", is)
      }] }), $;
    }), H = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (j, $) => (l(), i(K, null, [
      t(a(zl), {
        ref_key: "menu",
        ref: x,
        model: ee.value,
        popup: "",
        "aria-label": "Insert into " + (e.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: I(({ item: P, class: w }) => [
          P.icon ? (l(), D(a(O), {
            key: 0,
            icon: P.icon,
            class: re(w),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : S("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      v.value ? (l(), i("p", Ps, b(v.value), 1)) : S("", !0),
      t(a(Se), {
        visible: !!c.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: H,
        "aria-label": "Insert image",
        "onUpdate:visible": $[2] || ($[2] = (P) => {
          P || (c.value = void 0);
        })
      }, {
        header: I(() => [
          s("span", Ds, [
            t(a(O), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          s("span", qs, [
            s("span", Bs, "Insert " + b(c.value?.title), 1),
            $[6] || ($[6] = s("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: I(() => [
          t(a(q), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: $[1] || ($[1] = (P) => c.value = void 0)
          }),
          t(a(q), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: I(() => [
          s("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Te(X, ["prevent"])
          }, [
            s("div", Hs, [
              s("label", {
                class: "mail-field-label",
                for: a(z)
              }, "Alternative text", 8, Fs),
              t(a(ue), {
                id: a(z),
                modelValue: A.value,
                "onUpdate:modelValue": $[0] || ($[0] = (P) => A.value = P),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              $[7] || ($[7] = s("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"]),
      t(a(Se), {
        visible: !!h.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: H,
        "aria-label": h.value === "part" ? "Find a part" : "Find an image",
        "onUpdate:visible": $[5] || ($[5] = (P) => {
          P || (h.value = void 0);
        })
      }, {
        header: I(() => [
          s("span", Js, [
            t(a(O), {
              icon: h.value === "part" ? a(fe).part : a(fe).asset,
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          s("span", Ws, [
            s("span", Ks, b(h.value === "part" ? "Insert a part" : "Insert an image"), 1),
            $[8] || ($[8] = s("span", { class: "kx-modal-head-sub" }, "Search the library, then insert at the cursor.", -1))
          ])
        ]),
        footer: I(() => [
          t(a(q), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: $[4] || ($[4] = (P) => h.value = void 0)
          }),
          t(a(q), {
            label: "Insert",
            disabled: !C.value,
            onClick: V
          }, null, 8, ["disabled"])
        ]),
        default: I(() => [
          h.value ? (l(), D(Ye, {
            key: 0,
            modelValue: C.value,
            "onUpdate:modelValue": $[3] || ($[3] = (P) => C.value = P),
            kind: h.value,
            label: h.value === "part" ? "Part" : "Image",
            fluid: "",
            exclude: h.value === "part" && e.draft.kind === "part" ? e.draft.name : void 0,
            placeholder: "Choose…"
          }, null, 8, ["modelValue", "kind", "label", "exclude"])) : S("", !0)
        ]),
        _: 1
      }, 8, ["visible", "aria-label"])
    ], 64));
  }
}), Gs = ["disabled", "inert"], Zs = { class: "mail-form" }, Qs = { class: "mail-field" }, Xs = ["for"], ei = { class: "mail-field" }, ai = ["for"], li = { class: "mail-field-hint" }, ti = { class: "mail-mono" }, si = { class: "mail-field" }, ii = ["for"], ni = { class: "mail-base-row" }, oi = ["id"], ri = { class: "mail-code-frame mail-code-subject" }, ui = { class: "mail-face-bar" }, di = { class: "mail-code-frame mail-code-body" }, ci = /* @__PURE__ */ ie({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const r = da(() => import("./CodeEditor-CCN_mhSU.js")), n = e, { go: d } = be(), m = { base: ve(), title: ve(), description: ve(), face: ve() }, u = y("html"), x = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], v = y(), _ = y();
    function T(C) {
      v.value?.insert(C);
    }
    const o = B(() => {
      const C = n.problem;
      if (C)
        return C.face === "html" || C.face === "text" || C.face === "subject" ? C.face : u.value;
    }), h = B(() => (n.draft.kind === "message" ? "Body" : "Source") + (u.value === "html" ? ", HTML" : ", plain text"));
    return (C, g) => (l(), i("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t(ll, { label: "Name and description" }, {
        default: I(() => [
          s("div", Zs, [
            s("div", Qs, [
              s("label", {
                class: "mail-field-label",
                for: m.title
              }, "Name", 8, Xs),
              t(a(ue), {
                id: m.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": g[0] || (g[0] = (V) => e.draft.title = V)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", ei, [
              s("label", {
                class: "mail-field-label",
                for: m.description
              }, "Description", 8, ai),
              t(a(ue), {
                id: m.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": g[1] || (g[1] = (V) => e.draft.description = V)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("p", li, [
              g[9] || (g[9] = G("Reference ", -1)),
              s("span", ti, b(e.draft.name), 1),
              G(", used to " + b(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), i(K, { key: 0 }, [
        s("div", si, [
          s("label", {
            class: "mail-field-label",
            for: m.base
          }, "Base template", 8, ii),
          s("div", ni, [
            t(Ye, {
              modelValue: e.draft.base,
              "onUpdate:modelValue": g[2] || (g[2] = (V) => e.draft.base = V),
              kind: "base",
              label: "Base template",
              "input-id": m.base,
              class: "mail-base-select"
            }, null, 8, ["modelValue", "input-id"]),
            e.draft.base ? (l(), D(a(q), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: g[3] || (g[3] = (V) => a(d)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : S("", !0)
          ])
        ]),
        s("div", {
          class: re(["mail-field", { "mail-field-invalid": o.value === "subject" }])
        }, [
          s("span", {
            id: m.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, oi),
          s("div", ri, [
            t(a(r), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": g[4] || (g[4] = (V) => e.draft.subject = V),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          e.problem && o.value === "subject" ? (l(), D(ba, {
            key: 0,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : S("", !0)
        ], 2)
      ], 64)) : S("", !0),
      s("div", {
        class: re(["mail-field", { "mail-field-invalid": e.problem && o.value !== "subject" }])
      }, [
        s("div", ui, [
          t(a(Ce), {
            modelValue: u.value,
            "onUpdate:modelValue": g[5] || (g[5] = (V) => u.value = V),
            options: x,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          t(a(q), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: g[6] || (g[6] = (V) => _.value?.toggle(V))
          }, {
            icon: I(() => [
              t(a(O), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        s("div", di, [
          u.value === "html" ? (l(), D(a(r), {
            ref_key: "editor",
            ref: v,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": g[7] || (g[7] = (V) => e.draft.html = V),
            label: h.value
          }, null, 8, ["modelValue", "label"])) : (l(), D(a(r), {
            ref_key: "editor",
            ref: v,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": g[8] || (g[8] = (V) => e.draft.text = V),
            label: h.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && o.value !== "subject" ? (l(), D(ba, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : S("", !0)
      ], 2),
      t(Ys, {
        ref_key: "inserter",
        ref: _,
        draft: e.draft,
        face: u.value,
        onInsert: T
      }, null, 8, ["draft", "face"])
    ], 8, Gs));
  }
}), vi = { class: "mail-value-field" }, mi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Pa = /* @__PURE__ */ ie({
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
    const n = e, d = pa(e, "modelValue"), m = r, u = (p) => p === null || ["string", "number", "boolean"].includes(typeof p), x = (p) => p === void 0 || Array.isArray(p) && p.every(u), v = (p) => p === void 0 || !!p && typeof p == "object" && !Array.isArray(p) && Object.values(p).every((c) => typeof c == "string"), _ = y(!1);
    Q(() => n.type, () => {
      _.value = !1;
    });
    const T = B(() => _.value ? "written" : n.type === "array" ? x(d.value) ? "list" : "written" : n.type === "object" ? v(d.value) ? "record" : "written" : n.type), o = B({
      get: () => Array.isArray(d.value) ? d.value.map((p) => p === null ? "" : String(p)).join(`
`) : "",
      set: (p) => {
        const c = p.split(`
`).map((z) => z.trim()).filter(Boolean), A = n.itemType === "number" || n.itemType === "integer";
        d.value = c.length ? c.map((z) => A && z !== "" && !Number.isNaN(Number(z)) ? Number(z) : z) : void 0;
      }
    }), h = y([]);
    Q(d, (p) => {
      if (T.value !== "record") return;
      const c = p ?? {};
      JSON.stringify(Object.fromEntries(h.value.filter((A) => A.key).map((A) => [A.key, A.value]))) !== JSON.stringify(c) && (h.value = Object.entries(c).map(([A, z]) => ({ key: A, value: z })));
    }, { immediate: !0 });
    function C() {
      const p = h.value.filter((c) => c.key.trim());
      d.value = p.length ? Object.fromEntries(p.map((c) => [c.key.trim(), c.value])) : void 0;
    }
    const g = y(""), V = y("");
    Q([d, T], () => {
      T.value === "written" && !V.value && (g.value = d.value === void 0 ? "" : JSON.stringify(d.value, null, 2));
    }, { immediate: !0 });
    function U(p) {
      if (g.value = p, !p.trim()) {
        V.value = "", d.value = void 0;
        return;
      }
      try {
        const c = JSON.parse(p), A = n.type === "array" ? Array.isArray(c) : !!c && typeof c == "object" && !Array.isArray(c);
        V.value = A ? "" : n.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', A && (d.value = c);
      } catch {
        V.value = n.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    Q(V, (p) => m("invalid", p), { immediate: !0 });
    const k = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (p, c) => (l(), i("div", vi, [
      T.value === "string" ? (l(), D(a(ue), {
        key: 0,
        "model-value": typeof d.value == "string" ? d.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": c[0] || (c[0] = (A) => d.value = A || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "number" || T.value === "integer" ? (l(), D(a(Pl), {
        key: 1,
        "model-value": typeof d.value == "number" ? d.value : null,
        "aria-label": e.label,
        "max-fraction-digits": T.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": c[1] || (c[1] = (A) => d.value = A ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : T.value === "boolean" ? (l(), D(a(Ce), {
        key: 2,
        "model-value": typeof d.value == "boolean" ? d.value : null,
        options: k,
        "option-label": "label",
        "option-value": "value",
        "aria-label": e.label,
        disabled: e.disabled,
        "onUpdate:modelValue": c[2] || (c[2] = (A) => d.value = typeof A == "boolean" ? A : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "list" ? (l(), D(a(va), {
        key: 3,
        modelValue: o.value,
        "onUpdate:modelValue": c[3] || (c[3] = (A) => o.value = A),
        "aria-label": e.label,
        rows: "3",
        "auto-resize": "",
        disabled: e.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : T.value === "record" ? (l(), i(K, { key: 4 }, [
        (l(!0), i(K, null, me(h.value, (A, z) => (l(), i("div", {
          key: z,
          class: "mail-value-entry"
        }, [
          t(a(ue), {
            modelValue: A.key,
            "onUpdate:modelValue": [(Z) => A.key = Z, C],
            "aria-label": e.label + ", name " + (z + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(ue), {
            modelValue: A.value,
            "onUpdate:modelValue": [(Z) => A.value = Z, C],
            "aria-label": e.label + ", value " + (z + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(q), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (A.key || "entry"),
            disabled: e.disabled,
            onClick: (Z) => {
              h.value.splice(z, 1), C();
            }
          }, {
            icon: I(() => [
              t(a(O), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        t(a(q), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: c[4] || (c[4] = (A) => h.value.push({ key: "", value: "" }))
        }, {
          icon: I(() => [
            t(a(O), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), i(K, { key: 5 }, [
        t(a(va), {
          "model-value": g.value,
          "aria-label": e.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!V.value,
          disabled: e.disabled,
          fluid: "",
          "onUpdate:modelValue": U
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        V.value ? (l(), i("small", mi, b(V.value), 1)) : S("", !0)
      ], 64)),
      (e.type === "array" || e.type === "object") && T.value !== "written" ? (l(), D(a(q), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: e.disabled,
        onClick: c[5] || (c[5] = (A) => _.value = !0)
      }, null, 8, ["disabled"])) : S("", !0)
    ]));
  }
}), fi = ["disabled", "inert"], bi = { class: "mail-sr-only" }, yi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, pi = {
  key: 1,
  class: "mail-muted"
}, hi = ["aria-label"], gi = { class: "mail-variable-grid" }, ki = { class: "mail-field" }, $i = { class: "mail-field" }, wi = { class: "mail-field" }, _i = ["id"], xi = { class: "mail-variable-check" }, Ci = { class: "mail-field" }, Vi = { class: "mail-variable-values" }, Si = {
  key: 0,
  class: "mail-field"
}, Ti = { class: "mail-field" }, Ri = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ui = /* @__PURE__ */ ie({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: r }) {
    const n = e, d = r, m = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let u = 0;
    function x(V) {
      const U = new Set(V.schema.required ?? []);
      return Object.entries(V.schema.properties).map(([k, p]) => {
        const c = p.items;
        return {
          id: u++,
          name: k,
          schema: p,
          title: typeof p.title == "string" ? p.title : "",
          type: m.some((A) => A.value === p.type) ? p.type : "string",
          itemType: typeof c?.type == "string" ? c.type : void 0,
          required: U.has(k),
          description: typeof p.description == "string" ? p.description : "",
          sample: V.samples[k],
          fallback: p.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const v = y([]);
    v.value = x(n.draft), Q(() => n.draft, (V) => {
      v.value = x(V);
    });
    function _(V, U) {
      if (U === void 0) return !0;
      switch (V.type) {
        case "string":
          return typeof U == "string";
        case "number":
          return typeof U == "number";
        case "integer":
          return typeof U == "number" && Number.isInteger(U);
        case "boolean":
          return typeof U == "boolean";
        case "array":
          return Array.isArray(U);
        default:
          return !!U && typeof U == "object" && !Array.isArray(U);
      }
    }
    function T(V, U) {
      V.type = U, _(V, V.sample) || (V.sample = void 0), _(V, V.fallback) || (V.fallback = void 0);
    }
    const o = B(() => v.value.map((V) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(V.name) ? v.value.some((U) => U !== V && U.name === V.name) ? "Another one has this name." : V.valueErrors.sample || V.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    Q(o, (V) => d("invalid", V.some(Boolean)), { immediate: !0 }), Q(v, (V) => {
      if (o.value.some(Boolean)) return;
      const U = {}, k = {};
      for (const c of V) {
        const A = { ...c.schema, type: c.type };
        for (const [z, Z] of [["title", c.title], ["description", c.description]])
          Z ? A[z] = Z : delete A[z];
        c.fallback !== void 0 ? A.default = c.fallback : delete A.default, U[c.name] = A, c.sample !== void 0 && (k[c.name] = c.sample);
      }
      const p = V.filter((c) => c.required).map((c) => c.name);
      n.draft.schema = { ...n.draft.schema, properties: U, required: p.length ? p : void 0 }, n.draft.samples = k;
    }, { deep: !0 });
    function h() {
      let V = v.value.length + 1;
      for (; v.value.some((U) => U.name === `value_${V}`); ) V++;
      v.value.push({
        id: u++,
        name: `value_${V}`,
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
    const C = B(() => n.draft.kind === "part"), g = B(() => n.problem && (n.problem.face === "variables" || n.problem.face === "samples") ? `${bt[n.problem.face]}: ${n.problem.engine ?? n.problem.message}` : "");
    return (V, U) => (l(), i("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s("legend", bi, b(e.label), 1),
      g.value ? (l(), i("p", yi, b(g.value), 1)) : S("", !0),
      v.value.length ? (l(), i("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), i(K, null, me(v.value, (k, p) => (l(), i("li", {
          key: k.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": o.value[p] }])
        }, [
          s("div", gi, [
            s("label", ki, [
              U[0] || (U[0] = s("span", { class: "mail-field-label" }, "Name in templates", -1)),
              t(a(ue), {
                modelValue: k.name,
                "onUpdate:modelValue": (c) => k.name = c,
                class: "mail-mono-input",
                invalid: !!o.value[p] && !k.valueErrors.sample && !k.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            s("label", $i, [
              U[1] || (U[1] = s("span", { class: "mail-field-label" }, "Label", -1)),
              t(a(ue), {
                modelValue: k.title,
                "onUpdate:modelValue": (c) => k.title = c,
                placeholder: k.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            s("div", wi, [
              s("span", {
                id: "type-" + k.id,
                class: "mail-field-label"
              }, "Type", 8, _i),
              t(a(_a), {
                "model-value": k.type,
                options: m,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + k.id,
                "onUpdate:modelValue": (c) => T(k, c)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            s("label", xi, [
              t(a(Ol), {
                modelValue: k.required,
                "onUpdate:modelValue": (c) => k.required = c,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              U[2] || (U[2] = s("span", null, "Required", -1))
            ]),
            t(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + k.name,
              title: "Remove " + k.name,
              onClick: (c) => v.value.splice(p, 1)
            }, {
              icon: I(() => [
                t(a(O), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          s("label", Ci, [
            U[3] || (U[3] = s("span", { class: "mail-field-label" }, "Description", -1)),
            t(a(ue), {
              modelValue: k.description,
              "onUpdate:modelValue": (c) => k.description = c,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("div", Vi, [
            C.value ? (l(), i("div", Si, [
              U[4] || (U[4] = s("span", { class: "mail-field-label" }, "Default", -1)),
              t(Pa, {
                modelValue: k.fallback,
                "onUpdate:modelValue": (c) => k.fallback = c,
                type: k.type,
                "item-type": k.itemType,
                label: "Default of " + k.name,
                onInvalid: (c) => k.valueErrors.fallback = c
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : S("", !0),
            s("div", Ti, [
              U[5] || (U[5] = s("span", { class: "mail-field-label" }, "Sample value", -1)),
              t(Pa, {
                modelValue: k.sample,
                "onUpdate:modelValue": (c) => k.sample = c,
                type: k.type,
                "item-type": k.itemType,
                label: "Sample value of " + k.name,
                onInvalid: (c) => k.valueErrors.sample = c
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          o.value[p] ? (l(), i("small", Ri, b(k.name) + ": " + b(o.value[p]), 1)) : S("", !0)
        ], 2))), 128))
      ], 8, hi)) : (l(), i("p", pi, b(e.draft.title) + " takes no " + b(e.label.toLowerCase()) + " yet.", 1)),
      s("div", null, [
        t(a(q), {
          label: C.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: h
        }, {
          icon: I(() => [
            t(a(O), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, fi));
  }
}), Ai = { class: "kx-modal-head-icon" }, Li = {
  key: 0,
  class: "kx-modal-head-text"
}, ji = { class: "kx-modal-head-title" }, Ii = {
  key: 0,
  class: "kx-modal-head-sub"
}, Ei = {
  key: 1,
  class: "kx-modal-head-sub"
}, Ni = {
  key: 0,
  class: "mail-form"
}, Mi = { class: "mail-face-bar" }, zi = {
  key: 0,
  class: "mail-version-subject"
}, Oi = { class: "mail-mono-block" }, Pi = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Di = /* @__PURE__ */ ie({
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
    const n = da(() => import("./CodeEditor-CCN_mhSU.js")), d = da(() => import("./DiffView-CWHbdsJf.js")), m = e, u = r;
    $e(() => !!m.revision);
    const x = y("version"), v = y("html");
    Q(() => m.revision, (U) => {
      U && (x.value = m.compare ? "compare" : "version", v.value = "html");
    });
    const _ = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], T = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], o = B(() => !m.included && m.revision?.version === m.current.revision), h = B(() => {
      const U = m.revision;
      return U ? m.included || U.state === "original" && U.action === "reset" ? `${m.current.title}: the version included with ${m.current.origin_label}` : `${m.current.title}, version ${U.version}` : "";
    }), C = B(() => m.revision ? v.value === "html" ? m.revision.content.html : m.revision.content.text : ""), g = B(() => v.value === "html" ? m.current.html : m.current.text), V = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (U, k) => (l(), D(a(Se), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: V,
      "aria-label": h.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": k[5] || (k[5] = (p) => {
        p || u("close");
      })
    }, {
      header: I(() => [
        s("span", Ai, [
          t(a(O), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), i("span", Li, [
          s("span", ji, b(h.value), 1),
          e.included ? (l(), i("span", Ii, "Compare it with your customized version, or reset to it.")) : (l(), i("span", Ei, b(a(ga)[e.revision.action]) + " by " + b(a(Ve)(e.revision.author_label, e.revision.author)) + " · " + b(a(Ke)(e.revision.created_at)), 1))
        ])) : S("", !0)
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: k[2] || (k[2] = (p) => u("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), D(a(q), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: k[3] || (k[3] = (p) => u("reset"))
        }, {
          icon: I(() => [
            t(a(O), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !o.value ? (l(), D(a(q), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: k[4] || (k[4] = (p) => u("restore", e.revision))
        }, {
          icon: I(() => [
            t(a(O), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : S("", !0)
      ]),
      default: I(() => [
        e.revision ? (l(), i("div", Ni, [
          s("div", Mi, [
            o.value ? S("", !0) : (l(), D(a(Ce), {
              key: 0,
              modelValue: x.value,
              "onUpdate:modelValue": k[0] || (k[0] = (p) => x.value = p),
              options: _,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            t(a(Ce), {
              modelValue: v.value,
              "onUpdate:modelValue": k[1] || (k[1] = (p) => v.value = p),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && x.value === "version" ? (l(), i("p", zi, [
            k[6] || (k[6] = s("span", { class: "mail-muted" }, "Subject", -1)),
            k[7] || (k[7] = G()),
            s("span", Oi, b(e.revision.content.subject), 1)
          ])) : S("", !0),
          x.value === "version" ? (l(), i("div", Pi, [
            (l(), D(a(n), {
              key: v.value,
              "model-value": C.value,
              label: h.value + (v.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), D(a(d), {
            key: "diff-" + v.value,
            before: C.value,
            after: g.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), qi = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Bi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Hi = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Fi = {
  key: 3,
  class: "mail-history"
}, Ji = { class: "mail-history-head" }, Wi = { class: "mail-history-main" }, Ki = { class: "mail-history-title" }, Yi = { class: "mail-sub" }, Gi = {
  key: 0,
  class: "mail-history-note"
}, Zi = {
  key: 0,
  class: "mail-history-actions"
}, Qi = {
  key: 4,
  class: "mail-more"
}, Xi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, en = /* @__PURE__ */ ie({
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
    return (r, n) => (l(), i(K, null, [
      e.error ? (l(), i("div", qi, [
        s("span", null, b(e.error), 1),
        t(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: n[0] || (n[0] = (d) => r.$emit("retry"))
        })
      ])) : e.loading && !e.revisions.length ? (l(), i("p", Bi, [
        t(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        n[2] || (n[2] = G("Loading history…", -1))
      ])) : e.revisions.length ? (l(), i("ol", Fi, [
        (l(!0), i(K, null, me(e.revisions, (d) => (l(), i("li", {
          key: d.seq,
          class: "mail-history-row"
        }, [
          s("div", Ji, [
            s("div", Wi, [
              s("span", Ki, [
                G(" Version " + b(d.version) + " · " + b(a(ga)[d.action]) + b(d.restored_from ? " from version " + d.restored_from : "") + " ", 1),
                d.version === e.resource.revision ? (l(), D(a(Ae), {
                  key: 0,
                  severity: "success",
                  value: "Current",
                  class: "kx-tag-sm"
                })) : S("", !0)
              ]),
              s("span", Yi, b(a(Ve)(d.author_label, d.author)) + " · " + b(a(Ke)(d.created_at)), 1),
              d.note ? (l(), i("span", Gi, b(d.note), 1)) : S("", !0)
            ]),
            a(Ha)(d) ? (l(), i("div", Zi, [
              t(a(q), {
                label: "Show this version",
                disabled: e.busy !== void 0,
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (m) => r.$emit("show", d)
              }, {
                icon: I(() => [
                  t(a(O), {
                    icon: "tabler:eye",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"]),
              d.version !== e.resource.revision ? (l(), D(a(q), {
                key: 0,
                label: "Restore",
                severity: "secondary",
                outlined: "",
                size: "small",
                loading: e.busy === d.seq,
                disabled: e.busy !== void 0,
                onClick: (m) => r.$emit("restore", d)
              }, {
                icon: I(() => [
                  t(a(O), {
                    icon: "tabler:restore",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
            ])) : S("", !0)
          ])
        ]))), 128))
      ])) : (l(), i("p", Hi, b(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1)),
      e.more && e.revisions.length ? (l(), i("div", Qi, [
        e.moreError ? (l(), i("span", Xi, b(e.moreError), 1)) : S("", !0),
        t(a(q), {
          label: e.moreError ? "Retry" : "Show older versions",
          severity: "secondary",
          outlined: "",
          loading: e.loading,
          onClick: n[1] || (n[1] = (d) => r.$emit("more"))
        }, null, 8, ["label", "loading"])
      ])) : S("", !0)
    ], 64));
  }
});
function an(e, r, n, d) {
  const m = d?.used_by?.messages?.length ?? 0, u = d?.used_by?.recent_senders?.find((_) => _.origin);
  return {
    content: {
      message: { title: "Message", description: "What recipients read." + (u?.origin ? ` Sent recently by “${na(u.origin)}”.` : "") },
      base: { title: "Layout", description: m ? `The frame around the ${ye(m, "message")} that ${m === 1 ? "uses" : "use"} ${n}.` : `The frame around messages that use ${n}.` },
      part: { title: "Content", description: `Shown wherever ${n} is included.` }
    }[e],
    variables: e === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${n} where it is included, with their defaults.` },
    "used-by": {
      title: "Used by",
      description: e === "message" ? `Who sends ${n}.` : e === "base" ? `Messages that use ${n}.` : `Templates that include ${n}.`
    },
    history: { title: "History", description: `Every saved version of ${n}, newest first.` }
  }[r];
}
function ln(e) {
  return e?.state !== "customized" ? "" : `Customized by ${Ve(e.author_label, e.author)} ${Sl(e.updated_at)} from the version included with ${e.origin_label}.`;
}
function tn(e) {
  if (!e?.original) return;
  const { kind: r, name: n, title: d, description: m } = e;
  return {
    kind: r,
    name: n,
    seq: 0,
    version: 0,
    action: "reset",
    state: "original",
    author: "",
    created_at: 0,
    content: { kind: r, name: n, title: d, description: m, ...e.original }
  };
}
function sn(e) {
  const r = he([]), n = y(!1), d = y(""), m = y(""), u = y(), x = we();
  async function v() {
    const T = x();
    n.value = !0;
    try {
      const o = await le.history(e.value);
      if (!T()) return;
      r.value = o.items, u.value = o.next_cursor, d.value = m.value = "";
    } catch (o) {
      if (!T()) return;
      d.value = oa(o) ? "" : se(o, "History could not be loaded.");
    } finally {
      T() && (n.value = !1);
    }
  }
  async function _() {
    const T = u.value;
    if (!T || n.value) return;
    const o = x();
    n.value = !0;
    try {
      const h = await le.history(e.value, T);
      if (!o()) return;
      const C = new Set(r.value.map((g) => g.seq));
      r.value = [...r.value, ...h.items.filter((g) => !C.has(g.seq))], u.value = h.next_cursor, m.value = "";
    } catch (h) {
      o() && (m.value = se(h, "Older versions could not be loaded."));
    } finally {
      o() && (n.value = !1);
    }
  }
  return { revisions: r, historyLoading: n, historyError: d, historyMoreError: m, historyCursor: u, loadHistory: v, loadOlderHistory: _ };
}
const nn = { class: "kx-modal-head-icon mail-head-warn" }, on = { class: "kx-modal-head-text" }, rn = { class: "kx-modal-head-title" }, un = { class: "mail-dialog-text" }, dn = {
  key: 0,
  class: "mail-list"
}, tl = /* @__PURE__ */ ie({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const n = e;
    $e(() => !!n.refusal);
    const d = r, m = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function u(x) {
      d("close"), x();
    }
    return (x, v) => (l(), D(a(Se), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: m,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": v[1] || (v[1] = (_) => {
        _ || d("close");
      })
    }, {
      header: I(() => [
        s("span", nn, [
          t(a(O), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        s("span", on, [
          s("span", rn, b(e.refusal?.header), 1)
        ])
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Close",
          autofocus: "",
          onClick: v[0] || (v[0] = (_) => d("close"))
        })
      ]),
      default: I(() => [
        s("p", un, b(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), i("ul", dn, [
          (l(!0), i(K, null, me(e.refusal.links, (_) => (l(), i("li", {
            key: _.label
          }, [
            t(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (T) => u(_.open)
            }, {
              default: I(() => [
                t(a(O), {
                  icon: _.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                s("span", null, b(_.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), cn = { class: "mail-stack" }, vn = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, mn = {
  key: 0,
  class: "mail-muted"
}, fn = {
  key: 1,
  class: "mail-list"
}, bn = { key: 1 }, yn = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, pn = { class: "mail-group-head" }, hn = {
  key: 0,
  class: "mail-muted"
}, gn = {
  key: 1,
  class: "mail-list"
}, kn = { class: "mail-list-main" }, $n = {
  key: 0,
  class: "mail-sub"
}, wn = { class: "mail-muted" }, _n = /* @__PURE__ */ ie({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const r = e, { library: n, go: d, capabilities: m } = be(), u = B(() => (r.resource.used_by?.messages ?? []).map((v) => ({
      name: v,
      title: n.title("message", v)
    }))), x = B(() => r.resource.used_by?.recent_senders ?? []);
    return (v, _) => (l(), i("div", cn, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), i("section", vn, [
        _[1] || (_[1] = s("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        u.value.length ? (l(), i("ul", fn, [
          (l(!0), i(K, null, me(u.value, (T) => (l(), i("li", {
            key: T.name
          }, [
            t(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (o) => a(d)({ name: "resource", kind: "message", resource: T.name, section: "content" })
            }, {
              default: I(() => [
                t(a(O), {
                  icon: a(fe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                T.title === void 0 ? (l(), D(a(ze), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i("span", bn, b(T.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), i("p", mn, "No messages " + b(e.resource.kind === "asset" ? "show" : "use") + " " + b(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), i("section", yn, [
        s("div", pn, [
          _[2] || (_[2] = s("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(m)?.administer_delivery ? (l(), D(a(q), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: _[0] || (_[0] = (T) => a(d)({ name: "activity", template: e.resource.name }))
          })) : S("", !0)
        ]),
        x.value.length ? (l(), i("ul", gn, [
          (l(!0), i(K, null, me(x.value, (T) => (l(), i("li", {
            key: T.sender + (T.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            t(a(O), {
              icon: T.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("span", kn, [
              s("span", null, b(a(Ve)(T.sender_label, T.sender)), 1),
              T.origin ? (l(), i("span", $n, b(a(na)(T.origin)), 1)) : S("", !0)
            ]),
            s("span", wn, b(a(ye)(T.count, "message")), 1)
          ]))), 128))
        ])) : (l(), i("p", hn, "Nobody has sent " + b(e.resource.title) + " recently.", 1))
      ])) : S("", !0)
    ]));
  }
}), xn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Cn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Vn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Sn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Tn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, Rn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, Un = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, An = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, Ln = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, jn = {
  key: 6,
  class: "kx-notice mail-customized"
}, In = { class: "mail-customized-text" }, En = { class: "mail-editor-layout" }, Nn = /* @__PURE__ */ ie({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const r = e, { library: n, capabilities: d, delivery: m, go: u, create: x, setDirty: v, setTitle: _ } = be(), T = B(() => ({ kind: r.kind, name: r.name })), o = he(), h = y(), C = y(!0), g = y(!1), V = y(!1), U = y(""), k = y(), p = we(), c = B(() => !!h.value && !!o.value && !Qt(h.value, o.value));
    Q(c, (J) => v(J), { immediate: !0 }), sa(() => v(!1));
    async function A(J = {}) {
      const F = p();
      try {
        const Y = await le.get(T.value);
        if (!F()) return;
        const ne = J.keepDraft && c.value;
        if (ne && o.value && Y.revision !== o.value.revision) {
          k.value = { revision: Y.revision, by: Ve(Y.author_label, Y.author) || "Someone" };
          return;
        }
        o.value = Y, ne || (h.value = xe(Y), z.value = void 0), _(Y.title), k.value = void 0, g.value = V.value = !1, U.value = "";
      } catch (Y) {
        if (!F()) return;
        g.value = oa(Y), V.value = We(Y), U.value = g.value || V.value ? "" : se(Y, "This resource could not be loaded."), g.value && (o.value = void 0, h.value = void 0);
      } finally {
        F() && (C.value = !1);
      }
    }
    const z = y(), { revisions: Z, historyLoading: X, historyError: ee, historyMoreError: H, historyCursor: j, loadHistory: $, loadOlderHistory: P } = sn(T);
    async function w() {
      await Promise.all([A({ keepDraft: !0 }), $()]);
    }
    Fe(w), Le("mail.library", () => {
      w();
    });
    const f = y(), L = y(""), ae = y(!1), N = y(""), E = y(), R = B(() => o.value?.title ?? r.name), M = B(() => an(r.kind, r.section, R.value, o.value)), W = B(() => ln(o.value)), te = B(() => tn(o.value)), _e = y(), ge = y(), de = y(!1), Re = B(() => ge.value ?? _e.value);
    Q(() => JSON.stringify(h.value), () => {
      ge.value = void 0;
    });
    const nl = B(() => !!Re.value || de.value || !!k.value), Ta = B(() => k.value ? "Discard your changes to load the newer version first." : de.value ? "Fix the variables first." : Re.value ? "Fix the error first." : ""), Ra = y(!1);
    function ra(J, F) {
      Ra.value = ["invalid_config", "from_name_invalid"].includes(ke(J) ?? ""), ae.value = ["mail_revision_conflict", "mail_preview_stale"].includes(ke(J) ?? ""), ae.value && w(), L.value = se(J, F);
    }
    function Ua() {
      if (!o.value) return;
      const J = !!k.value;
      h.value = xe(o.value), k.value = void 0, ge.value = void 0, z.value = void 0, J && A();
    }
    const je = y(!1), Ge = y(""), Ze = y();
    function ol() {
      Ge.value = "", Ze.value = void 0, je.value = !0;
    }
    async function rl(J) {
      const F = o.value, Y = h.value;
      if (!(!F || !Y || f.value !== void 0)) {
        f.value = "save", Ge.value = L.value = N.value = "", Ze.value = void 0;
        try {
          const ne = z.value, oe = ne && JSON.stringify(Y) === JSON.stringify({ ...xe(ne.content), kind: F.kind, name: F.name }), Ue = oe ? await le.restore(T.value, ne.seq, F.revision, J || void 0) : await le.update(Y, F.revision, J || void 0);
          o.value = { ...F, ...Ue }, h.value = xe(o.value), je.value = !1, N.value = oe ? `Version ${ne.version} from ${Ke(ne.created_at)} is now in effect.` : `Saved ${Ue.title}.${r.kind === "message" ? "" : " Every message that uses it has the change."}`, z.value = void 0, await w();
        } catch (ne) {
          const oe = He(ne), Ue = oe?.resource?.kind === Y.kind && oe.resource.name === Y.name;
          oe?.dependents?.length && !Ue ? Ze.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (ge.value = oe, je.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes(ke(ne) ?? "") ? (je.value = !1, await A({ keepDraft: !0 })) : Ge.value = se(ne, `${Y.title} could not be saved.`);
        } finally {
          f.value = void 0;
        }
      }
    }
    async function ul() {
      const J = o.value;
      if (!(!J || f.value !== void 0)) {
        f.value = "test", L.value = N.value = "";
        try {
          await le.sendTest(J.name), N.value = d.value?.administer_delivery ? "The test is queued for delivery to you with the sample values. Activity shows when it is delivered." : "The test is queued for delivery to you with the sample values.";
        } catch (F) {
          ra(F, "The test could not be sent.");
        } finally {
          f.value = void 0;
        }
      }
    }
    const Qe = B(() => c.value ? "Save your changes to send a test." : d.value?.send ? m.value && !m.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Aa() {
      const J = o.value;
      if (!(!J || f.value !== void 0 || !await qe.confirm({
        header: `Reset ${J.title} to the original?`,
        message: `Your changes are replaced by the version included with ${J.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        f.value = "reset", L.value = N.value = "", ae.value = !1;
        try {
          o.value = await le.reset(T.value, J.revision), h.value = xe(o.value), N.value = `${J.title} is back to the original. Your changes are in History.`, await w();
        } catch (Y) {
          ra(Y, `${J.title} could not be reset.`);
        } finally {
          f.value = void 0;
        }
      }
    }
    const Oe = y(), La = y(!1), ja = y(!1);
    function Ia(J, F = !1, Y = !1) {
      La.value = F, ja.value = Y, Oe.value = J;
    }
    async function Ea(J) {
      const F = T.value;
      f.value = J.seq, L.value = "";
      try {
        const Y = await le.revision(F, J.seq);
        if (T.value.kind === F.kind && T.value.name === F.name) return Y;
      } catch (Y) {
        T.value.kind === F.kind && T.value.name === F.name && (L.value = se(Y, "This version could not be loaded."));
      } finally {
        f.value === J.seq && (f.value = void 0);
      }
    }
    async function dl(J) {
      const F = await Ea(J);
      F && Ia(F);
    }
    async function Na(J) {
      const F = o.value;
      if (!F || f.value !== void 0 || c.value && !await qe.confirm({
        header: `Replace your unsaved changes with version ${J.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      const Y = "content" in J ? J : await Ea(J);
      if (!Y) return;
      h.value = { ...xe(Y.content), kind: F.kind, name: F.name }, z.value = Y, Oe.value = void 0, L.value = "";
      const ne = `Version ${Y.version} is loaded as your draft. Review and save to restore it.`;
      r.section === "content" ? N.value = ne : (ua = ne, u({ name: "resource", kind: r.kind, resource: r.name, section: "content" }));
    }
    function Ma(J, F, Y) {
      const ne = J.kind === "base" ? "use" : "include";
      E.value = {
        header: `${J.title} is in use`,
        get message() {
          const oe = F.map((Ue) => n.title("message", Ue) ?? Ue);
          return `${ye(F.length, "message")} ${F.length === 1 ? ne + "s" : ne} it: ${oe.join(", ")}. Remove it from ${F.length === 1 ? "that message" : "them"} first.`;
        },
        links: F.map((oe) => ({ get label() {
          return n.title("message", oe) ?? oe;
        }, open: () => u({ name: "resource", kind: "message", resource: oe, section: "content" }) }))
      };
    }
    async function cl() {
      const J = o.value;
      if (!J || J.state !== "created" || f.value !== void 0) return;
      const F = J.used_by?.messages ?? [];
      if (J.kind === "base" && F.length) {
        Ma(J, F);
        return;
      }
      if (await qe.confirm({
        header: `Delete ${J.title}?`,
        message: J.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${pe[J.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        f.value = "delete", L.value = N.value = "";
        try {
          await le.remove(T.value, J.revision), v(!1), u({ name: "library", section: fa(r.kind) });
        } catch (ne) {
          const oe = He(ne);
          oe?.dependents?.length ? Ma(J, oe.dependents) : ra(ne, `${J.title} could not be deleted.`);
        } finally {
          f.value = void 0;
        }
      }
    }
    function vl() {
      const J = o.value;
      J && x({ kind: r.kind, from: { kind: J.kind, name: J.name } });
    }
    const ml = B(() => r.kind === "base" ? o.value?.used_by?.messages : void 0), Xe = B(() => f.value === "save");
    A(), Q(() => r.section, (J) => {
      J === "history" && !Z.value.length && $();
    }, { immediate: !0 });
    let ua = "";
    return Q(() => r.section, () => {
      N.value = ua, ua = "", L.value = "";
    }), (J, F) => (l(), i(K, null, [
      g.value ? (l(), D(xa, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(ha)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: F[0] || (F[0] = (Y) => a(u)({ name: "library", section: a(fa)(e.kind) }))
      }, null, 8, ["cta"])) : V.value ? (l(), i("p", xn, [
        t(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        F[11] || (F[11] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), i(K, { key: 2 }, [
        t(Je, {
          title: M.value.title,
          description: M.value.description
        }, ya({ _: 2 }, [
          o.value ? {
            name: "actions",
            fn: I(() => [
              c.value ? (l(), D(Gt, {
                key: 0,
                busy: Xe.value,
                "review-disabled": nl.value,
                onDiscard: Ua,
                onReview: ol
              }, null, 8, ["busy", "review-disabled"])) : (l(), i(K, { key: 1 }, [
                e.kind === "message" ? (l(), D(a(q), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: f.value === "test",
                  disabled: !!Qe.value || f.value !== void 0,
                  title: Qe.value || void 0,
                  onClick: ul
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : S("", !0),
                t(a(q), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: f.value !== void 0,
                  onClick: vl
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                o.value.state === "created" ? (l(), D(a(q), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: f.value === "delete",
                  disabled: f.value !== void 0,
                  onClick: cl
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0)
              ], 64))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "description"]),
        U.value ? (l(), i("div", Cn, [
          s("span", null, b(U.value), 1),
          t(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: F[1] || (F[1] = (Y) => w())
          })
        ])) : C.value ? (l(), i("p", Vn, [
          t(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          G("Loading " + b(R.value) + "…", 1)
        ])) : S("", !0),
        o.value && h.value ? (l(), i(K, { key: 2 }, [
          k.value ? (l(), i("p", Sn, [
            t(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("span", null, [
              G(b(k.value.by) + " saved " + b(o.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              t(a(q), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Ua
              })
            ])
          ])) : S("", !0),
          c.value && Ta.value && !k.value ? (l(), i("p", Tn, b(Ta.value), 1)) : e.kind === "message" && !c.value && Qe.value ? (l(), i("p", Rn, [
            G(b(Qe.value) + " ", 1),
            a(d)?.administer_delivery && a(m) && !a(m).configured ? (l(), D(a(q), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: F[2] || (F[2] = (Y) => a(ca)(Y.currentTarget, "/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          L.value && ae.value ? (l(), i("p", Un, [
            t(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            G(b(L.value), 1)
          ])) : L.value ? (l(), i("p", An, [
            s("span", null, b(L.value), 1),
            Ra.value && a(d)?.administer_delivery ? (l(), D(a(q), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: F[3] || (F[3] = (Y) => a(ca)(Y.currentTarget, "/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          N.value ? (l(), i("p", Ln, [
            t(a(O), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            G(b(N.value), 1)
          ])) : S("", !0),
          W.value && e.section === "content" ? (l(), i("div", jn, [
            t(a(O), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            s("span", In, [
              G(b(W.value), 1),
              c.value ? (l(), i(K, { key: 0 }, [
                G(" Save or discard your changes to reset it.")
              ], 64)) : S("", !0)
            ]),
            te.value ? (l(), D(a(q), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: F[4] || (F[4] = (Y) => Ia(te.value, !0, !0))
            }, {
              icon: I(() => [
                t(a(O), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            t(a(q), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: f.value === "reset",
              disabled: f.value !== void 0 || c.value,
              onClick: Aa
            }, {
              icon: I(() => [
                t(a(O), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : S("", !0),
          $l(s("div", En, [
            t(ci, {
              draft: h.value,
              problem: Re.value,
              disabled: Xe.value
            }, null, 8, ["draft", "problem", "disabled"]),
            t(Ss, {
              draft: h.value,
              messages: ml.value,
              onProblem: F[5] || (F[5] = (Y) => _e.value = Y)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [wl, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), D(Ui, {
            key: 7,
            draft: h.value,
            label: M.value.title,
            problem: Re.value,
            disabled: Xe.value,
            onInvalid: F[6] || (F[6] = (Y) => de.value = Y)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), D(_n, {
            key: 8,
            resource: o.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), D(en, {
            key: 9,
            resource: o.value,
            revisions: a(Z),
            loading: a(X),
            error: a(ee),
            busy: typeof f.value == "number" ? f.value : f.value ? -1 : void 0,
            more: !!a(j),
            "more-error": a(H),
            onShow: dl,
            onRestore: Na,
            onRetry: a($),
            onMore: a(P)
          }, null, 8, ["resource", "revisions", "loading", "error", "busy", "more", "more-error", "onRetry", "onMore"])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      o.value && h.value ? (l(), D(Os, {
        key: 3,
        visible: je.value,
        saved: a(xe)(o.value),
        draft: h.value,
        busy: Xe.value,
        error: Ge.value,
        dependents: Ze.value,
        "suggested-note": z.value ? `Restore version ${z.value.version}` : void 0,
        onClose: F[7] || (F[7] = (Y) => je.value = !1),
        onSave: rl
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : S("", !0),
      o.value ? (l(), D(Di, {
        key: 4,
        revision: Oe.value,
        current: o.value,
        compare: La.value,
        included: ja.value,
        busy: typeof f.value == "number" || f.value === "reset",
        onClose: F[8] || (F[8] = (Y) => Oe.value = void 0),
        onRestore: Na,
        onReset: F[9] || (F[9] = (Y) => {
          Oe.value = void 0, Aa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : S("", !0),
      t(tl, {
        refusal: E.value,
        onClose: F[10] || (F[10] = (Y) => E.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), ea = /* @__PURE__ */ new Map();
function Mn(e, r) {
  const n = ea.get(e);
  if (n && n.revision >= r) return n.url;
  const d = Promise.resolve(xl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((m) => m.data instanceof Blob ? URL.createObjectURL(m.data) : void 0, () => {
    ea.get(e)?.url === d && ea.delete(e);
  });
  return ea.set(e, { revision: r, url: d }), n && n.url.then((m) => {
    m && URL.revokeObjectURL(m);
  }), d;
}
const zn = ["src", "alt"], On = {
  key: 0,
  "aria-hidden": "true"
}, sl = /* @__PURE__ */ ie({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(e) {
    const r = e, n = y();
    Q(() => [r.name, r.revision], async ([m, u]) => {
      n.value = void 0, n.value = await Mn(m, u);
    }, { immediate: !0 });
    const d = B(() => r.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (m, u) => (l(), i("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      n.value ? (l(), i("img", {
        key: 0,
        src: n.value,
        alt: e.alt ?? ""
      }, null, 8, zn)) : (l(), i(K, { key: 1 }, [
        t(a(O), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        d.value ? (l(), i("span", On, b(d.value), 1)) : S("", !0)
      ], 64))
    ], 2));
  }
});
function De(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Pn(e, r) {
  return e;
}
function Dn(e, r, n) {
  if (r !== void 0 && !r) return null;
  const d = De(e) ? e : {}, m = [
    d,
    De(d.data) ? d.data : null,
    De(d.payload) ? d.payload : null,
    De(d.detail) ? d.detail : null
  ].filter(Boolean);
  for (const u of m) {
    if (u.event !== "component.meta.changed" && u.event !== "component.deleting" && u.event !== "component.deleted") continue;
    const x = String(u.component_id || ""), v = String(d.topic || u.topic || "");
    if (r === void 0) {
      if (!x && (!v.startsWith("component.") || v === "component.")) continue;
    } else if (x && x !== r || !x && v !== `component.${r}`) continue;
    const _ = x || r || v.slice(10);
    return u.event === "component.deleting" && typeof u.deletion_job_id == "string" && u.deletion_job_id ? { event: u.event, component_id: _, deletion_job_id: u.deletion_job_id } : u.event !== "component.meta.changed" ? { event: u.event, component_id: _ } : {
      event: "component.meta.changed",
      component_id: _,
      meta: Pn(De(u.meta) ? u.meta : {}),
      deleted: Array.isArray(u.deleted) ? u.deleted.map(String) : []
    };
  }
  return null;
}
function qn(e, r, n) {
  const d = Dn(e, r);
  return d?.event === "component.meta.changed" ? d : null;
}
function Bn(e, r, n) {
  if (!e) return null;
  const d = Cl(`component.${e}`, (m) => {
    const u = qn(m, e);
    u && r(u);
  });
  return typeof d == "function" ? d : null;
}
class aa extends Error {
}
function Hn(e, r) {
  return new Promise((n, d) => {
    let m = null, u = !1, x = !1, v = !1;
    const _ = (h) => {
      v || (v = !0, m?.(), r.removeEventListener("abort", T), h ? d(h) : n());
    }, T = () => _(new aa("cancelled"));
    if (r.aborted) {
      T();
      return;
    }
    r.addEventListener("abort", T);
    async function o() {
      if (!v) {
        if (u) {
          x = !0;
          return;
        }
        u = !0;
        try {
          const h = await Fa.state(e);
          h.status === "completed" ? _() : h.status === "error" ? _(new aa(h.error ?? "")) : m || (m = Bn(h.component_id, () => {
            o();
          }), m ? x = !0 : _(new aa("")));
        } catch (h) {
          _(h);
        } finally {
          u = !1, x && !v && (x = !1, o());
        }
      }
    }
    o();
  });
}
const Fn = { class: "kx-modal-head-icon" }, Jn = { class: "kx-modal-head-text" }, Wn = { class: "kx-modal-head-title" }, Kn = { class: "kx-modal-head-sub" }, Yn = ["disabled", "inert"], Gn = ["for"], Zn = { class: "mail-muted" }, Qn = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Xn = {
  key: 0,
  class: "mail-field"
}, eo = ["for"], ao = ["for"], lo = ["id"], to = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, so = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, io = 1024 * 1024, il = /* @__PURE__ */ ie({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: r }) {
    const n = e, d = r, { library: m, go: u } = be(), x = { file: ve(), title: ve(), name: ve() };
    $e(() => n.visible);
    const v = ["image/png", "image/jpeg", "image/gif"], _ = y(), T = y(""), o = y(""), h = y(!1), C = y(!1), g = y();
    let V = new AbortController();
    const U = y(""), k = y(""), p = y("");
    Q(() => n.visible, (H) => {
      if (!H) {
        V.abort();
        return;
      }
      V = new AbortController(), _.value = void 0, T.value = n.replace?.title ?? "", o.value = n.replace?.name ?? "", h.value = !1, U.value = k.value = p.value = "";
    }), Q(T, (H) => {
      !n.replace && !h.value && (o.value = Ja(H));
    });
    function c(H) {
      const j = Array.isArray(H.files) ? H.files[0] : H.files;
      if (k.value = "", _.value = void 0, !!j) {
        if (!v.includes(j.type)) {
          k.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (j.size > io) {
          k.value = "Images must be 1 MB or smaller.";
          return;
        }
        _.value = j, !n.replace && !T.value && (T.value = j.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function A() {
      return p.value = "", n.replace ? !0 : (o.value || (p.value = "Enter a reference."), !p.value);
    }
    async function z() {
      if (C.value || !_.value || !T.value.trim() || !A()) return;
      C.value = !0, U.value = "";
      const H = V;
      try {
        g.value = "upload";
        const j = await Fa.add(_.value), $ = { name: o.value, upload_id: j, title: T.value.trim() }, P = () => n.replace ? le.replaceAsset($, n.replace.revision) : le.addAsset($);
        g.value = "save";
        let w;
        try {
          w = await P();
        } catch (f) {
          if (ke(f) !== "upload_still_processing") throw f;
          g.value = "process", await Hn(j, H.signal), g.value = "save", w = await P();
        }
        m.patch("asset", w.name, Qa(w)), d("done", w), d("close"), n.replace || u({ name: "library", section: "assets", asset: w.name });
      } catch (j) {
        if (H.signal.aborted) return;
        j instanceof aa ? U.value = "The image could not be processed. Try another file, or upload it again." : ke(j) === "mail_revision_conflict" && !n.replace ? p.value = `An image named ${o.value} already exists. Choose another name or replace ${o.value}.` : ke(j) === "invalid_mail_resource" && !n.replace ? p.value = Wa : U.value = se(j, "The image could not be uploaded.");
      } finally {
        C.value = !1, g.value = void 0;
      }
    }
    const Z = B(() => g.value === "upload" ? "Uploading the image…" : g.value === "process" ? "Processing the image…" : g.value === "save" ? "Adding it to the library…" : ""), X = B(() => n.replace ? `Replace ${n.replace.title}` : "Upload image"), ee = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (H, j) => (l(), D(a(Se), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !C.value || g.value === "process",
      "close-on-escape": !C.value || g.value === "process",
      class: "mail-dialog",
      pt: ee,
      "aria-label": X.value,
      "onUpdate:visible": j[4] || (j[4] = ($) => {
        $ || d("close");
      })
    }, {
      header: I(() => [
        s("span", Fn, [
          t(a(O), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        s("span", Jn, [
          s("span", Wn, b(X.value), 1),
          s("span", Kn, b(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: C.value && g.value !== "process",
          onClick: j[3] || (j[3] = ($) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(q), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: C.value,
          disabled: !_.value || !e.replace && !T.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: I(() => [
        s("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Te(z, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: C.value,
            inert: C.value || void 0
          }, [
            s("div", {
              class: re(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: x.file
              }, "Image", 8, Gn),
              t(a(Dl), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": _.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: x.file, "aria-label": "Image file" } },
                onSelect: c
              }, {
                chooseicon: I(() => [
                  t(a(O), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: I(() => [
                  s("span", Zn, b(_.value ? `${_.value.name} · ${a(ia)(_.value.size)}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              k.value ? (l(), i("small", Qn, b(k.value), 1)) : S("", !0)
            ], 2),
            e.replace ? S("", !0) : (l(), i("div", Xn, [
              s("label", {
                class: "mail-field-label",
                for: x.title
              }, "Name", 8, eo),
              t(a(ue), {
                id: x.title,
                modelValue: T.value,
                "onUpdate:modelValue": j[0] || (j[0] = ($) => T.value = $)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? S("", !0) : (l(), i("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": p.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: x.name
              }, "Reference", 8, ao),
              t(a(ue), {
                id: x.name,
                modelValue: o.value,
                "onUpdate:modelValue": j[1] || (j[1] = ($) => o.value = $),
                class: "mail-mono-input",
                invalid: !!p.value,
                "aria-describedby": x.name + "-hint",
                onInput: j[2] || (j[2] = ($) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: x.name + "-hint",
                class: re(p.value ? "mail-field-error" : "mail-field-hint")
              }, b(p.value || "Templates show it with this name. It cannot change later."), 11, lo)
            ], 2))
          ], 8, Yn),
          Z.value ? (l(), i("p", to, [
            t(a(O), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            G(b(Z.value), 1)
          ])) : S("", !0),
          U.value ? (l(), i("p", so, b(U.value), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), no = { class: "mail-drawer-head" }, oo = { class: "mail-drawer-title" }, ro = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, uo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, co = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, vo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, mo = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, fo = { class: "mail-asset-actions" }, bo = { class: "mail-asset-hero" }, yo = { class: "mail-facts mail-card" }, po = { class: "mail-reference" }, ho = { class: "mail-mono-block" }, go = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, ko = {
  key: 0,
  class: "mail-muted"
}, $o = { class: "mail-list" }, wo = { key: 1 }, _o = {
  key: 0,
  class: "mail-asset-context"
}, xo = ["srcdoc", "title"], Co = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, Vo = {
  key: 0,
  class: "mail-muted"
}, So = {
  key: 1,
  class: "mail-history"
}, To = { class: "mail-history-head" }, Ro = { class: "mail-history-main" }, Uo = { class: "mail-history-title" }, Ao = { class: "mail-sub" }, Lo = {
  key: 2,
  class: "mail-more"
}, jo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Io = /* @__PURE__ */ ie({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const n = e, d = r, { library: m, go: u } = be();
    $e(() => !!n.name);
    const x = y();
    Q(() => !!n.name, (E) => {
      E && Be(() => x.value?.focus());
    }, { immediate: !0 });
    const v = he(), _ = he([]), T = he(), o = y(""), h = y(!1), C = y(!1), g = y(""), V = y(""), U = y(""), k = y(), p = y(!1), c = y(!1), A = y(!1), z = y(), Z = we(), X = y(), ee = y(!1), H = y("");
    async function j() {
      const E = n.name, R = X.value;
      if (!(!E || !R || ee.value)) {
        ee.value = !0;
        try {
          const M = await le.history({ kind: "asset", name: E }, R);
          if (n.name !== E) return;
          const W = new Set(_.value.map((te) => te.seq));
          _.value = [..._.value, ...M.items.filter((te) => !W.has(te.seq))], X.value = M.next_cursor, H.value = "";
        } catch (M) {
          H.value = se(M, "Older versions could not be loaded.");
        } finally {
          ee.value = !1;
        }
      }
    }
    async function $() {
      const E = n.name, R = Z();
      if (!E) {
        v.value = void 0;
        return;
      }
      h.value = !0;
      try {
        const [M, W] = await Promise.all([le.get({ kind: "asset", name: E }), le.history({ kind: "asset", name: E })]);
        if (!R()) return;
        v.value = M, _.value = W.items, X.value = W.next_cursor, C.value = !1, g.value = "";
        const te = M.used_by?.messages?.[0];
        o.value = te ?? "";
        const _e = te ? await le.preview(te, []) : void 0;
        R() && (T.value = _e);
      } catch (M) {
        if (!R()) return;
        C.value = oa(M), g.value = C.value ? "" : se(M, "This image could not be loaded.");
      } finally {
        R() && (h.value = !1);
      }
    }
    Q(() => n.name, () => {
      p.value = c.value = !1, U.value = V.value = "", $();
    }, { immediate: !0 }), Le("mail.library", () => {
      n.name && $();
    });
    const P = B(() => (v.value?.used_by?.messages ?? []).map((E) => ({ name: E, title: m.title("message", E) })));
    async function w() {
      if (v.value)
        try {
          await navigator.clipboard.writeText(window.location.href), c.value = !0;
        } catch {
          c.value = !1;
        }
    }
    const f = B(() => v.value ? al(v.value.name) : "");
    async function L() {
      try {
        await navigator.clipboard.writeText(f.value), p.value = !0;
      } catch {
        p.value = !1;
      }
    }
    async function ae(E, R) {
      const M = v.value;
      if (!M || k.value !== void 0) return;
      if (E === "delete" && P.value.length) {
        z.value = {
          header: `${M.title} is in use`,
          message: `${ye(P.value.length, "message")} ${P.value.length === 1 ? "shows" : "show"} it: ${P.value.map((te) => te.title ?? te.name).join(", ")}. Remove it from ${P.value.length === 1 ? "that message" : "them"} first.`,
          links: P.value.map((te) => ({ label: te.title ?? te.name, open: () => u({ name: "resource", kind: "message", resource: te.name, section: "content" }) }))
        };
        return;
      }
      const W = {
        reset: { header: `Reset ${M.title} to the original?`, message: `The image included with ${M.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${M.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${R?.version} of ${M.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[E];
      if (await qe.confirm({ header: W.header, message: W.message, acceptLabel: W.accept, rejectLabel: "Cancel", ...E === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        k.value = R ? R.seq : E, V.value = U.value = "";
        try {
          if (E === "delete") {
            await le.remove({ kind: "asset", name: M.name }, M.revision), d("close");
            return;
          }
          v.value = E === "reset" ? await le.reset({ kind: "asset", name: M.name }, M.revision) : await le.restore({ kind: "asset", name: M.name }, R.seq, M.revision), U.value = E === "reset" ? `${M.title} is back to the original.` : `Version ${R.version} is shown again everywhere.`, await $();
        } catch (te) {
          const _e = He(te);
          if (_e?.dependents?.length || _e?.references?.length) {
            const ge = [...(_e.references ?? []).filter((de) => de.kind !== "asset")];
            for (const de of _e.dependents ?? []) ge.some((Re) => Re.kind === "message" && Re.name === de) || ge.push({ kind: "message", name: de });
            z.value = {
              header: `${M.title} is in use`,
              message: `${ye(ge.length, "template")} ${ge.length === 1 ? "names" : "name"} ${M.title}, in the current version or one kept in History. Remove it from ${ge.length === 1 ? "that template" : "them"} first.`,
              links: ge.map((de) => ({
                get label() {
                  return m.title(de.kind, de.name) ?? de.name;
                },
                icon: fe[de.kind],
                open: () => u(de.kind === "asset" ? { name: "library", section: "assets", asset: de.name } : { name: "resource", kind: de.kind, resource: de.name, section: "content" })
              }))
            };
          } else
            V.value = ke(te) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : se(te, "The image could not be changed."), ke(te) === "mail_revision_conflict" && $();
        } finally {
          k.value = void 0;
        }
      }
    }
    const N = B(() => T.value?.html ? Va(T.value.html, T.value.inline_assets) : "");
    return (E, R) => (l(), i(K, null, [
      t(a(Ga), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: k.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": R[5] || (R[5] = (M) => {
          M || d("close");
        })
      }, {
        default: I(() => [
          s("div", {
            ref_key: "drawer",
            ref: x,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            s("header", no, [
              s("div", oo, [
                v.value?.state === "customized" ? (l(), D(a(Ae), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : S("", !0),
                s("h2", null, b(v.value?.title ?? "Image"), 1)
              ]),
              t(a(q), {
                text: "",
                severity: "secondary",
                disabled: !v.value,
                "aria-label": c.value ? "Link copied" : "Copy link",
                title: c.value ? "Link copied" : "Copy link",
                onClick: w
              }, {
                icon: I(() => [
                  t(a(O), {
                    icon: c.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              t(a(q), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: k.value !== void 0,
                onClick: R[0] || (R[0] = (M) => d("close"))
              }, {
                icon: I(() => [
                  t(a(O), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            h.value && !v.value ? (l(), i("p", ro, [
              t(a(O), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              R[9] || (R[9] = G("Loading image…", -1))
            ])) : C.value ? (l(), i("p", uo, [
              t(a(O), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              R[10] || (R[10] = G("This image no longer exists. It was deleted while you were away.", -1))
            ])) : g.value ? (l(), i("div", co, [
              s("span", null, b(g.value), 1),
              t(a(q), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: R[1] || (R[1] = (M) => $())
              })
            ])) : S("", !0),
            v.value ? (l(), i(K, { key: 3 }, [
              V.value ? (l(), i("p", vo, [
                t(a(O), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                G(b(V.value), 1)
              ])) : S("", !0),
              U.value ? (l(), i("p", mo, [
                t(a(O), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                G(b(U.value), 1)
              ])) : S("", !0),
              s("div", fo, [
                t(a(q), {
                  label: "Replace",
                  disabled: k.value !== void 0,
                  onClick: R[2] || (R[2] = (M) => A.value = !0)
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                v.value.state === "customized" ? (l(), D(a(q), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: k.value === "reset",
                  disabled: k.value !== void 0,
                  onClick: R[3] || (R[3] = (M) => ae("reset"))
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0),
                v.value.state === "created" ? (l(), D(a(q), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: k.value === "delete",
                  disabled: k.value !== void 0,
                  onClick: R[4] || (R[4] = (M) => ae("delete"))
                }, {
                  icon: I(() => [
                    t(a(O), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0)
              ]),
              s("div", bo, [
                t(sl, {
                  name: v.value.name,
                  revision: v.value.revision,
                  asset: v.value.asset,
                  large: "",
                  alt: v.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              s("dl", yo, [
                R[11] || (R[11] = s("dt", null, "Reference", -1)),
                s("dd", po, [
                  s("span", ho, b(f.value), 1),
                  t(a(q), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": p.value ? "Reference copied" : "Copy reference",
                    title: p.value ? "Reference copied" : "Copy reference",
                    onClick: L
                  }, {
                    icon: I(() => [
                      t(a(O), {
                        icon: p.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                R[12] || (R[12] = s("dt", null, "File", -1)),
                s("dd", null, b(v.value.asset?.filename) + " · " + b(a(ia)(v.value.asset?.size)), 1),
                R[13] || (R[13] = s("dt", null, "Source", -1)),
                s("dd", null, [
                  t(Sa, { resource: v.value }, null, 8, ["resource"])
                ])
              ]),
              s("section", go, [
                R[14] || (R[14] = s("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                P.value.length ? (l(), i(K, { key: 1 }, [
                  s("ul", $o, [
                    (l(!0), i(K, null, me(P.value, (M) => (l(), i("li", {
                      key: M.name
                    }, [
                      t(a(q), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (W) => a(u)({ name: "resource", kind: "message", resource: M.name, section: "content" })
                      }, {
                        default: I(() => [
                          t(a(O), {
                            icon: a(fe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          M.title === void 0 ? (l(), D(a(ze), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), i("span", wo, b(M.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  N.value ? (l(), i("div", _o, [
                    s("iframe", {
                      sandbox: "",
                      srcdoc: N.value,
                      title: "How " + v.value.title + " looks in " + (a(m).title("message", o.value) ?? "")
                    }, null, 8, xo)
                  ])) : S("", !0)
                ], 64)) : (l(), i("p", ko, "No message shows " + b(v.value.title) + " with its sample values.", 1))
              ]),
              s("section", Co, [
                R[15] || (R[15] = s("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                _.value.length ? (l(), i("ol", So, [
                  (l(!0), i(K, null, me(_.value, (M) => (l(), i("li", {
                    key: M.seq,
                    class: "mail-history-row"
                  }, [
                    s("div", To, [
                      s("div", Ro, [
                        s("span", Uo, [
                          G("Version " + b(M.version) + " · " + b(a(ga)[M.action]) + " ", 1),
                          M.version === v.value.revision ? (l(), D(a(Ae), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : S("", !0)
                        ]),
                        s("span", Ao, b(a(Ve)(M.author_label, M.author)) + " · " + b(a(Ke)(M.created_at)), 1)
                      ]),
                      a(Ha)(M) && M.version !== v.value.revision ? (l(), D(a(q), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: k.value === M.seq,
                        disabled: k.value !== void 0,
                        onClick: (W) => ae("restore", M)
                      }, {
                        icon: I(() => [
                          t(a(O), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), i("p", Vo, b(v.value.title) + " has not been replaced.", 1)),
                X.value ? (l(), i("div", Lo, [
                  H.value ? (l(), i("span", jo, b(H.value), 1)) : S("", !0),
                  t(a(q), {
                    label: H.value ? "Retry" : "Show older versions",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    loading: ee.value,
                    onClick: j
                  }, null, 8, ["label", "loading"])
                ])) : S("", !0)
              ])
            ], 64)) : S("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      v.value ? (l(), D(il, {
        key: 0,
        visible: A.value,
        replace: v.value,
        onClose: R[6] || (R[6] = (M) => A.value = !1),
        onDone: R[7] || (R[7] = (M) => $())
      }, null, 8, ["visible", "replace"])) : S("", !0),
      t(tl, {
        refusal: z.value,
        onClose: R[8] || (R[8] = (M) => z.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Eo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, No = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Mo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, zo = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Oo = { class: "mail-toolbar" }, Po = {
  class: "mail-count",
  role: "status"
}, Do = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, qo = { class: "mail-sub" }, Bo = { class: "mail-mono-block" }, Ho = { class: "mail-muted" }, Fo = { class: "mail-muted" }, Jo = {
  key: 2,
  class: "mail-more"
}, Wo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ko = /* @__PURE__ */ ie({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const r = e, { go: n, upload: d } = be(), m = y(""), u = y("");
    let x;
    Q(m, (H) => {
      clearTimeout(x), x = setTimeout(() => {
        u.value = H.trim();
      }, 250);
    });
    const v = he([]), _ = y(), T = y(), o = y(!0), h = y(!1), C = y(!1), g = y(!1), V = y(""), U = y(""), k = y(""), p = we();
    async function c(H = !1) {
      const j = p();
      o.value = !0;
      try {
        const $ = await le.page({ kind: "asset", q: u.value || void 0, limit: ma });
        if (!j()) return;
        v.value = $.items, _.value = $.next_cursor, T.value = $.total, V.value = U.value = k.value = "", C.value = !1, h.value = !0;
      } catch ($) {
        if (!j()) return;
        C.value = We($);
        const P = C.value ? "" : se($, "Images could not be loaded.");
        H && h.value && !C.value ? U.value = P : V.value = P;
      } finally {
        j() && (o.value = !1);
      }
    }
    async function A() {
      if (o.value || !_.value || g.value) return;
      const H = p();
      g.value = !0;
      try {
        const j = await le.page({ kind: "asset", q: u.value || void 0, limit: ma, cursor: _.value });
        if (!H()) return;
        const $ = new Set(v.value.map((P) => P.name));
        v.value = [...v.value, ...j.items.filter((P) => !$.has(P.name))], _.value = j.next_cursor, k.value = "";
      } catch (j) {
        H() && (k.value = se(j, "More images could not be loaded."));
      } finally {
        g.value = !1;
      }
    }
    Q(u, () => {
      c();
    }), Fe(() => c(h.value)), Le("mail.library", () => {
      c(h.value);
    });
    function z(H) {
      const j = H.used_by?.messages;
      return j ? ye(j, "message") : "—";
    }
    const Z = B(() => {
      const H = T.value ?? v.value.length;
      return v.value.length < H ? `${v.value.length} of ${ye(H, "image")}` : ye(H, "image");
    });
    function X(H) {
      const j = H.asset;
      return j ? ia(j.size) : "";
    }
    function ee(H) {
      n({ name: "library", section: "assets", asset: H.name });
    }
    return (H, j) => (l(), i(K, null, [
      t(Je, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: I(() => [
          t(a(q), {
            label: "Upload image",
            onClick: j[0] || (j[0] = ($) => a(d)())
          }, {
            icon: I(() => [
              t(a(O), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      C.value ? (l(), i("p", Eo, [
        t(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        j[7] || (j[7] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : V.value ? (l(), i("div", No, [
        s("span", null, b(V.value), 1),
        t(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: j[1] || (j[1] = ($) => c())
        })
      ])) : S("", !0),
      U.value ? (l(), i("div", Mo, [
        s("span", null, b(U.value) + " The list shows what was loaded before.", 1),
        t(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: j[2] || (j[2] = ($) => c(!0))
        })
      ])) : o.value && !h.value ? (l(), i("p", zo, [
        t(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        j[8] || (j[8] = G("Loading images…", -1))
      ])) : h.value && !v.value.length && !u.value ? (l(), D(xa, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: j[3] || (j[3] = ($) => a(d)())
      })) : h.value ? (l(), i(K, { key: 5 }, [
        s("div", Oo, [
          t(a($a), { class: "mail-search" }, {
            default: I(() => [
              t(a(wa), null, {
                default: I(() => [
                  t(a(O), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(ue), {
                modelValue: m.value,
                "onUpdate:modelValue": j[4] || (j[4] = ($) => m.value = $),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          s("span", Po, b(Z.value), 1)
        ]),
        v.value.length ? (l(), D(a(ka), {
          key: 1,
          value: v.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: j[5] || (j[5] = ($) => ee($.data))
        }, {
          default: I(() => [
            t(a(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: I(({ data: $ }) => [
                t(sl, {
                  name: $.name,
                  revision: $.revision,
                  asset: $.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: I(({ data: $ }) => [
                t(a(q), {
                  link: "",
                  class: "mail-name",
                  label: $.title,
                  onClick: Te((P) => ee($), ["stop"])
                }, null, 8, ["label", "onClick"]),
                s("span", qo, [
                  s("span", Bo, b($.name), 1),
                  $.asset?.filename ? (l(), i(K, { key: 0 }, [
                    G(" · " + b($.asset.filename), 1)
                  ], 64)) : S("", !0)
                ])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: $ }) => [
                s("span", Ho, b(X($)), 1)
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: I(({ data: $ }) => [
                s("span", null, b(z($)), 1)
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: I(({ data: $ }) => [
                t(Sa, { resource: $ }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            t(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: $ }) => [
                s("span", Fo, b($.state === "original" ? "—" : a(Ba)($.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), i("p", Do, "Nothing matches. Try another name.")),
        _.value ? (l(), i("div", Jo, [
          k.value ? (l(), i("span", Wo, b(k.value), 1)) : S("", !0),
          t(a(q), {
            label: k.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: g.value,
            disabled: o.value,
            onClick: A
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      t(Io, {
        name: r.asset,
        onClose: j[6] || (j[6] = ($) => a(n)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), Yo = { class: "kx-modal-head-icon" }, Go = { class: "kx-modal-head-text" }, Zo = { class: "kx-modal-head-title" }, Qo = { class: "kx-modal-head-sub" }, Xo = ["id"], er = ["disabled", "inert"], ar = {
  key: 0,
  class: "mail-field"
}, lr = {
  key: 1,
  class: "mail-field"
}, tr = ["for"], sr = { class: "mail-field" }, ir = ["for"], nr = ["for"], or = ["id"], rr = { class: "mail-field" }, ur = ["for"], dr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ee = "\0blank", cr = /* @__PURE__ */ ie({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const n = e, d = r, { library: m, go: u } = be(), x = y("message"), v = y(""), _ = y(""), T = y(""), o = y(""), h = y(!1), C = y(!1), g = y(""), V = y(""), U = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, k = ["message", "base", "part"].map(($) => ({ value: $, label: pe[$] })), p = B(() => !!n.intent.from), c = [{ value: Ee, label: "Blank" }], A = B(() => !!v.value);
    function z($) {
      if (v.value = $ ?? "", !$ || $ === Ee) return;
      const P = m.find(x.value, $);
      P && (o.value = P.description, n.intent.from && (_.value = `${P.title} copy`, h.value = !1));
    }
    Q(() => n.visible, async ($) => {
      if ($)
        if (x.value = n.intent.from?.kind ?? n.intent.kind ?? "message", _.value = T.value = o.value = v.value = "", g.value = V.value = "", h.value = !1, n.intent.from) {
          const P = n.intent.from;
          v.value = P.name;
          try {
            await m.search(P.kind, void 0, [P.name]);
          } catch (w) {
            g.value = se(w, "The resource to copy could not be read.");
          }
          n.visible && z(P.name);
        } else
          v.value = Ee;
    }, { immediate: !0 }), Q(x, () => {
      n.intent.from || (v.value = Ee, o.value = "");
    }), $e(() => n.visible), Q(_, ($) => {
      h.value || (T.value = Ja($));
    });
    const Z = B(() => x.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function X() {
      return V.value = "", T.value || (V.value = "Enter a reference."), !V.value;
    }
    async function ee() {
      if (!(C.value || !_.value.trim() || !A.value || !X())) {
        C.value = !0, g.value = "";
        try {
          const $ = v.value === Ee ? await le.create(Xt(x.value, T.value, _.value.trim(), o.value.trim())) : await le.copy({
            kind: x.value,
            name: T.value,
            title: _.value.trim(),
            description: o.value.trim(),
            from: { kind: x.value, name: v.value }
          });
          m.patch($.kind, $.name, Qa($)), d("close"), u({ name: "resource", kind: $.kind, resource: $.name, section: "content" });
        } catch ($) {
          ke($) === "mail_revision_conflict" ? V.value = `A ${pe[x.value].toLowerCase()} with this reference already exists. Choose another.` : ke($) === "invalid_mail_resource" ? V.value = Wa : g.value = se($, "The resource could not be created.");
        } finally {
          C.value = !1;
        }
      }
    }
    const H = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, j = B(() => n.intent.from ? `Duplicate ${m.title(n.intent.from.kind, n.intent.from.name) ?? ""}`.trim() : `New ${pe[x.value].toLowerCase()}`);
    return ($, P) => (l(), D(a(Se), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !C.value,
      "close-on-escape": !C.value,
      class: "mail-dialog",
      pt: H,
      "aria-label": j.value,
      "onUpdate:visible": P[6] || (P[6] = (w) => {
        w || d("close");
      })
    }, {
      header: I(() => [
        s("span", Yo, [
          t(a(O), {
            icon: a(fe)[x.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        s("span", Go, [
          s("span", Zo, b(j.value), 1),
          s("span", Qo, b(v.value === Ee ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: I(() => [
        t(a(q), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: C.value,
          onClick: P[5] || (P[5] = (w) => d("close"))
        }, null, 8, ["disabled"]),
        t(a(q), {
          label: "Create " + a(pe)[x.value].toLowerCase(),
          type: "submit",
          form: U.hint,
          loading: C.value,
          disabled: !_.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: I(() => [
        s("form", {
          id: U.hint,
          class: "mail-form",
          onSubmit: Te(ee, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: C.value,
            inert: C.value || void 0
          }, [
            p.value ? S("", !0) : (l(), i("div", ar, [
              P[7] || (P[7] = s("span", { class: "mail-field-label" }, "Kind", -1)),
              t(a(Ce), {
                modelValue: x.value,
                "onUpdate:modelValue": P[0] || (P[0] = (w) => x.value = w),
                options: a(k),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            p.value ? S("", !0) : (l(), i("div", lr, [
              s("label", {
                class: "mail-field-label",
                for: U.source
              }, "Start from", 8, tr),
              t(Ye, {
                "model-value": v.value,
                kind: x.value,
                label: "Start from",
                "input-id": U.source,
                extra: c,
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": z
              }, null, 8, ["model-value", "kind", "input-id"])
            ])),
            s("div", sr, [
              s("label", {
                class: "mail-field-label",
                for: U.title
              }, "Name", 8, ir),
              t(a(ue), {
                id: U.title,
                modelValue: _.value,
                "onUpdate:modelValue": P[1] || (P[1] = (w) => _.value = w),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", {
              class: re(["mail-field", { "mail-field-invalid": V.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: U.reference
              }, "Reference", 8, nr),
              t(a(ue), {
                id: U.reference,
                modelValue: T.value,
                "onUpdate:modelValue": P[2] || (P[2] = (w) => T.value = w),
                class: "mail-mono-input",
                invalid: !!V.value,
                "aria-describedby": U.reference + "-hint",
                onInput: P[3] || (P[3] = (w) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: U.reference + "-hint",
                class: re(V.value ? "mail-field-error" : "mail-field-hint")
              }, b(V.value || Z.value), 11, or)
            ], 2),
            s("div", rr, [
              s("label", {
                class: "mail-field-label",
                for: U.description
              }, "Description", 8, ur),
              t(a(va), {
                id: U.description,
                modelValue: o.value,
                "onUpdate:modelValue": P[4] || (P[4] = (w) => o.value = w),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, er),
          g.value ? (l(), i("p", dr, b(g.value), 1)) : S("", !0)
        ], 40, Xo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), vr = { class: "mail-drawer-head" }, mr = { class: "mail-drawer-title" }, fr = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, br = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, yr = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, pr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, hr = {
  key: 0,
  class: "kx-notice error mail-failure"
}, gr = { class: "mail-failure-body" }, kr = { key: 0 }, $r = { key: 1 }, wr = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, _r = {
  key: 3,
  class: "mail-sub"
}, xr = {
  key: 4,
  class: "mail-field-error",
  role: "alert"
}, Cr = {
  key: 5,
  class: "mail-failure-actions"
}, Vr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Sr = { class: "mail-facts mail-card" }, Tr = { key: 2 }, Rr = {
  key: 0,
  class: "mail-sub"
}, Ur = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, Ar = { class: "mail-timeline" }, Lr = { class: "mail-muted" }, jr = { class: "mail-facts" }, Ir = { class: "mail-mono-block" }, Er = /* @__PURE__ */ ie({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: r }) {
    const n = e, d = r, { library: m, go: u, capabilities: x, delivery: v } = be();
    $e(() => !!n.messageId);
    const _ = y();
    Q(() => !!n.messageId, (w) => {
      w && Be(() => _.value?.focus());
    }, { immediate: !0 });
    const T = B(() => {
      const w = o.value?.last_error;
      if (!w) return;
      const f = v.value?.driver && v.value.driver.id === o.value?.driver_id ? v.value.driver.label : "The delivery service";
      return (x.value?.administer_delivery ? Tl(w.code, f) : void 0) ?? { lead: "", next: w.message };
    }), o = he(), h = y(!1), C = y(!1), g = y(!1), V = y(""), U = y(""), k = y(!1), p = y(), c = y(!1), A = we();
    async function z() {
      const w = n.messageId, f = A();
      if (!w) {
        o.value = void 0;
        return;
      }
      h.value = !0;
      try {
        const L = await ta.get(w);
        if (!f()) return;
        o.value = L, V.value = "", C.value = g.value = !1;
      } catch (L) {
        if (!f()) return;
        o.value = void 0, C.value = oa(L), g.value = We(L), V.value = C.value || g.value ? "" : se(L, "This message could not be loaded.");
      } finally {
        f() && (h.value = !1);
      }
    }
    Q(() => n.messageId, (w) => {
      p.value = void 0, U.value = "", c.value = !1, w !== o.value?.message_id && (o.value = void 0), z();
    }, { immediate: !0 }), Le("mail.activity", () => {
      n.messageId && z();
    });
    async function Z() {
      const w = o.value;
      if (!(!w || k.value)) {
        k.value = !0, U.value = "";
        try {
          p.value = await ta.resend(w.message_id);
        } catch (f) {
          U.value = se(f, "The message could not be sent again.");
        } finally {
          k.value = !1;
        }
      }
    }
    async function X() {
      if (o.value)
        try {
          await navigator.clipboard.writeText(window.location.href), c.value = !0;
        } catch {
          c.value = !1;
        }
    }
    const ee = B(() => {
      const w = o.value?.template;
      return w ? m.title("message", w) : "";
    }), H = B(() => !!o.value?.template && m.exists("message", o.value.template) === !0), j = B(() => {
      const w = o.value;
      if (!w) return [];
      const f = [{ label: "Accepted for delivery", at: w.created_at }];
      return w.status === "queued" && w.next_attempt_at && f.push({ label: w.attempts ? `Attempt ${w.attempts} did not go through; trying again` : "Next delivery attempt", at: w.next_attempt_at }), w.sent_at ? f.push({ label: w.attempts > 1 ? `Sent after ${w.attempts} attempts` : "Sent", at: w.sent_at }) : w.status === "failed" && w.finished_at && f.push({ label: w.attempts > 1 ? `Failed after ${w.attempts} attempts` : "Failed", at: w.finished_at }), f;
    }), $ = B(() => (o.value?.attachments ?? []).map((w) => w.filename || "Attachment")), P = B(() => {
      const w = o.value;
      return w ? [
        { label: "Message ID", value: w.message_id },
        { label: "Delivery service", value: x.value?.administer_delivery ? w.driver_id : void 0 },
        { label: "Service message ID", value: w.provider_message_id },
        { label: "Error code", value: w.last_error?.code },
        { label: "Service response", value: w.last_error?.provider_detail }
      ].filter((f) => !!f.value) : [];
    });
    return (w, f) => (l(), D(a(Ga), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !k.value,
      "close-on-escape": !k.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": f[6] || (f[6] = (L) => {
        L || d("close");
      })
    }, {
      default: I(() => [
        s("div", {
          ref_key: "drawer",
          ref: _,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          s("header", vr, [
            s("div", mr, [
              o.value ? (l(), D(a(Ae), {
                key: 0,
                severity: a(Ya)[o.value.status],
                value: a(Ka)[o.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : S("", !0),
              s("h2", null, b(o.value?.subject ?? "Message"), 1)
            ]),
            t(a(q), {
              text: "",
              severity: "secondary",
              disabled: !o.value,
              "aria-label": c.value ? "Link copied" : "Copy link",
              title: c.value ? "Link copied" : "Copy link",
              onClick: X
            }, {
              icon: I(() => [
                t(a(O), {
                  icon: c.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            t(a(q), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: k.value,
              onClick: f[0] || (f[0] = (L) => d("close"))
            }, {
              icon: I(() => [
                t(a(O), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          h.value && !o.value ? (l(), i("p", fr, [
            t(a(O), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            f[7] || (f[7] = G("Loading message…", -1))
          ])) : C.value ? (l(), i("p", br, [
            t(a(O), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            f[8] || (f[8] = G("This message is no longer in Activity.", -1))
          ])) : g.value ? (l(), i("p", yr, [
            t(a(O), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            f[9] || (f[9] = G("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : V.value ? (l(), i("div", pr, [
            s("span", null, b(V.value), 1),
            t(a(q), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: f[1] || (f[1] = (L) => z())
            })
          ])) : S("", !0),
          o.value ? (l(), i(K, { key: 4 }, [
            o.value.status === "failed" ? (l(), i("div", hr, [
              t(a(O), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              s("div", gr, [
                f[11] || (f[11] = s("strong", null, "This message was not delivered.", -1)),
                T.value?.lead ? (l(), i("span", kr, b(T.value.lead), 1)) : S("", !0),
                T.value ? (l(), i("span", $r, b(T.value.next), 1)) : S("", !0),
                p.value ? (l(), i("p", wr, [
                  f[10] || (f[10] = G(" Sent again as a new message. ", -1)),
                  t(a(q), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: f[2] || (f[2] = (L) => a(u)({ name: "activity", message: p.value.message_id }))
                  })
                ])) : o.value.can_resend ? S("", !0) : (l(), i("p", _r, "It cannot be sent again because its content was not kept.")),
                U.value ? (l(), i("p", xr, b(U.value), 1)) : S("", !0),
                p.value ? S("", !0) : (l(), i("div", Cr, [
                  a(x)?.send && o.value.can_resend ? (l(), D(a(q), {
                    key: 0,
                    label: "Send again",
                    loading: k.value,
                    onClick: Z
                  }, {
                    icon: I(() => [
                      t(a(O), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])) : S("", !0),
                  a(x)?.administer_delivery ? (l(), D(a(q), {
                    key: 1,
                    label: "Open delivery settings",
                    severity: "secondary",
                    outlined: "",
                    onClick: f[3] || (f[3] = (L) => a(ca)(L.currentTarget, "/system/settings/mail"))
                  })) : S("", !0)
                ]))
              ])
            ])) : o.value.status === "queued" ? (l(), i("p", Vr, [
              t(a(O), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              f[12] || (f[12] = G("Waiting to be delivered. ", -1))
            ])) : S("", !0),
            s("dl", Sr, [
              f[18] || (f[18] = s("dt", null, "To", -1)),
              s("dd", null, b(o.value.to.join(", ")), 1),
              o.value.cc?.length ? (l(), i(K, { key: 0 }, [
                f[13] || (f[13] = s("dt", null, "Cc", -1)),
                s("dd", null, b(o.value.cc.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.bcc?.length ? (l(), i(K, { key: 1 }, [
                f[14] || (f[14] = s("dt", null, "Bcc", -1)),
                s("dd", null, b(o.value.bcc.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.reply_to ? (l(), i(K, { key: 2 }, [
                f[15] || (f[15] = s("dt", null, "Reply-to", -1)),
                s("dd", null, b(o.value.reply_to), 1)
              ], 64)) : S("", !0),
              f[19] || (f[19] = s("dt", null, "Template", -1)),
              s("dd", null, [
                ee.value === void 0 ? (l(), D(a(ze), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : H.value ? (l(), D(a(q), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ee.value,
                  onClick: f[4] || (f[4] = (L) => a(u)({ name: "resource", kind: "message", resource: o.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), i("span", Tr, b(ee.value || "Written directly"), 1))
              ]),
              f[20] || (f[20] = s("dt", null, "Sent by", -1)),
              s("dd", null, [
                G(b(a(Ve)(o.value.sender_label, o.value.sender)), 1),
                o.value.origin ? (l(), i("span", Rr, b(a(na)(o.value.origin)), 1)) : S("", !0)
              ]),
              $.value.length ? (l(), i(K, { key: 3 }, [
                f[16] || (f[16] = s("dt", null, "Attachments", -1)),
                s("dd", null, b($.value.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.resend_of ? (l(), i(K, { key: 4 }, [
                f[17] || (f[17] = s("dt", null, "Sent again from", -1)),
                s("dd", null, [
                  t(a(q), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: f[5] || (f[5] = (L) => a(u)({ name: "activity", message: o.value.resend_of }))
                  })
                ])
              ], 64)) : S("", !0)
            ]),
            s("section", Ur, [
              f[21] || (f[21] = s("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              s("ol", Ar, [
                (l(!0), i(K, null, me(j.value, (L) => (l(), i("li", {
                  key: L.label
                }, [
                  s("span", null, b(L.label), 1),
                  s("span", Lr, b(a(Ke)(L.at)), 1)
                ]))), 128))
              ])
            ]),
            P.value.length ? (l(), D(ll, {
              key: 2,
              label: "Technical details"
            }, {
              default: I(() => [
                s("dl", jr, [
                  (l(!0), i(K, null, me(P.value, (L) => (l(), i(K, {
                    key: L.label
                  }, [
                    s("dt", null, b(L.label), 1),
                    s("dd", Ir, b(L.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : S("", !0)
          ], 64)) : S("", !0)
        ], 512)
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), Nr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Mr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, zr = { class: "mail-health-text" }, Or = { class: "mail-toolbar" }, Pr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, Dr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, qr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Br = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Hr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Fr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Jr = { class: "mail-sub" }, Wr = {
  key: 0,
  class: "mail-sub"
}, Kr = { class: "mail-muted" }, Yr = {
  key: 2,
  class: "mail-more"
}, Gr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Zr = /* @__PURE__ */ ie({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const r = e, { library: n, go: d } = be(), m = y("all"), u = y(r.template ?? null), x = y(30), v = y(""), _ = y("");
    let T;
    Q(v, (R) => {
      clearTimeout(T), T = setTimeout(() => {
        _.value = R.trim();
      }, 250);
    }), Q(() => r.template, (R) => {
      R !== void 0 && (u.value = R);
    });
    const o = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], h = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], C = he([]), g = y(), V = y(!0), U = y(!1), k = y(!1), p = y(!1), c = y(""), A = y(""), z = y(""), Z = we();
    function X(R) {
      return {
        status: m.value === "all" ? void 0 : m.value,
        message: u.value || void 0,
        since: Date.now() - x.value * 24 * 60 * 60 * 1e3,
        q: _.value || void 0,
        cursor: R
      };
    }
    async function ee(R = !1) {
      const M = Z();
      V.value = !0;
      try {
        const W = await ta.list(X());
        if (!M()) return;
        C.value = W.items, g.value = W.next_cursor, j.value = W.total, $.value = !!W.total_is_lower_bound, P.value = W.failed_today ?? 0, c.value = A.value = z.value = "", p.value = !1, U.value = !0;
      } catch (W) {
        if (!M()) return;
        p.value = We(W);
        const te = p.value ? "" : se(W, "Activity could not be loaded.");
        R && U.value && !p.value ? z.value = te : c.value = te;
      } finally {
        M() && (V.value = !1);
      }
    }
    async function H() {
      if (V.value || !g.value || k.value) return;
      const R = Z();
      k.value = !0, A.value = "";
      try {
        const M = await ta.list(X(g.value));
        if (!R()) return;
        const W = new Set(C.value.map((te) => te.message_id));
        C.value = [...C.value, ...M.items.filter((te) => !W.has(te.message_id))], g.value = M.next_cursor;
      } catch (M) {
        R() && (A.value = se(M, "More activity could not be loaded."));
      } finally {
        k.value = !1;
      }
    }
    const j = y(), $ = y(!1), P = y(0);
    Q([m, u, x, _], () => {
      ee();
    }), Fe(() => ee(U.value)), Le("mail.activity", () => {
      ee(U.value);
    });
    const w = B(() => {
      const R = j.value ?? C.value.length;
      return $.value ? `${R.toLocaleString()}+ messages` : ye(R, "message");
    }), f = B(() => $.value && !!_.value), L = B(() => P.value ? `${ye(P.value, "message")} failed today.` : "");
    function ae(R) {
      return R ? n.title("message", R) : "—";
    }
    function N(R) {
      d({ name: "activity", message: R.message_id });
    }
    function E() {
      d({ name: "activity", template: u.value || void 0 });
    }
    return (R, M) => (l(), i(K, null, [
      t(Je, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      p.value ? (l(), i("p", Nr, [
        t(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[8] || (M[8] = G("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), i(K, { key: 1 }, [
        L.value ? (l(), i("p", Mr, [
          t(a(O), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", zr, [
            s("strong", null, b(L.value), 1),
            G(" " + b(m.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          m.value !== "failed" ? (l(), D(a(q), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[0] || (M[0] = (W) => m.value = "failed")
          })) : S("", !0)
        ])) : S("", !0),
        s("div", Or, [
          t(a(Ce), {
            modelValue: m.value,
            "onUpdate:modelValue": M[1] || (M[1] = (W) => m.value = W),
            options: o,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          t(Ye, {
            modelValue: u.value,
            "onUpdate:modelValue": M[2] || (M[2] = (W) => u.value = W),
            kind: "message",
            label: "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue"]),
          t(a(_a), {
            modelValue: x.value,
            "onUpdate:modelValue": M[3] || (M[3] = (W) => x.value = W),
            options: h,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          t(a($a), { class: "mail-search" }, {
            default: I(() => [
              t(a(wa), null, {
                default: I(() => [
                  t(a(O), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(ue), {
                modelValue: v.value,
                "onUpdate:modelValue": M[4] || (M[4] = (W) => v.value = W),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          U.value ? (l(), i("span", Pr, b(w.value), 1)) : S("", !0)
        ]),
        f.value ? (l(), i("p", Dr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : S("", !0),
        c.value ? (l(), i("div", qr, [
          s("span", null, b(c.value), 1),
          t(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[5] || (M[5] = (W) => ee())
          })
        ])) : S("", !0),
        z.value ? (l(), i("div", Br, [
          s("span", null, b(z.value) + " The list shows what was loaded before.", 1),
          t(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[6] || (M[6] = (W) => ee(!0))
          })
        ])) : V.value && !U.value ? (l(), i("p", Hr, [
          t(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          M[9] || (M[9] = G("Loading activity…", -1))
        ])) : U.value ? (l(), i(K, { key: 5 }, [
          C.value.length ? (l(), D(a(ka), {
            key: 1,
            value: C.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: M[7] || (M[7] = (W) => N(W.data))
          }, {
            default: I(() => [
              t(a(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: I(({ data: W }) => [
                  t(a(Ae), {
                    severity: a(Ya)[W.status],
                    value: a(Ka)[W.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              t(a(ce), { header: "Message" }, {
                body: I(({ data: W }) => [
                  t(a(q), {
                    link: "",
                    class: "mail-name",
                    label: W.subject,
                    onClick: Te((te) => N(W), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  s("span", Jr, b(a(Rl)(W.to)), 1)
                ]),
                _: 1
              }),
              t(a(ce), { header: "Template" }, {
                body: I(({ data: W }) => [
                  ae(W.template) === void 0 ? (l(), D(a(ze), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), i(K, { key: 1 }, [
                    G(b(ae(W.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              t(a(ce), { header: "Sent by" }, {
                body: I(({ data: W }) => [
                  s("span", null, b(a(Ve)(W.sender_label, W.sender)), 1),
                  W.origin ? (l(), i("span", Wr, b(a(na)(W.origin)), 1)) : S("", !0)
                ]),
                _: 1
              }),
              t(a(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: I(({ data: W }) => [
                  s("span", Kr, b(a(Ul)(W.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), i("p", Fr, b(_.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          g.value ? (l(), i("div", Yr, [
            A.value ? (l(), i("span", Gr, b(A.value), 1)) : S("", !0),
            t(a(q), {
              label: A.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: k.value,
              disabled: V.value,
              onClick: H
            }, null, 8, ["label", "loading", "disabled"])
          ])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      t(Er, {
        "message-id": e.message,
        onClose: E
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Qr = { class: "kx-shell kx-settings-shell mail-admin" }, Xr = { class: "kx-main" }, eu = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, au = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, lu = /* @__PURE__ */ ie({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: r }) {
    const n = e, d = r, m = he(za(n.route ?? "")), u = B(() => m.value), x = y(!1);
    Q(x, (N) => d("dirty-change", N), { flush: "sync" });
    let v = !1;
    async function _() {
      if (!x.value) return !0;
      if (v) return !1;
      v = !0;
      try {
        return await qe.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        v = !1;
      }
    }
    function T(N, E) {
      return N.name === "resource" && E.name === "resource" && N.kind === E.kind && N.resource === E.resource;
    }
    async function o(N) {
      const E = Ie(N);
      !T(u.value, N) && !await _() || (T(u.value, N) || (x.value = !1), m.value = N, n.route !== void 0 && E !== n.route && d("navigate", E));
    }
    Q(() => n.route, async (N, E) => {
      if (N === void 0) return;
      const R = za(N);
      if (Ie(R) !== Ie(m.value)) {
        if (!T(m.value, R) && x.value) {
          if (!await _()) {
            E !== void 0 && n.route === N && d("navigate", Ie(m.value));
            return;
          }
          x.value = !1;
        }
        n.route === N && (m.value = R);
      }
    });
    const h = et(), { lookupError: C } = h, g = y(), V = y(), U = y(""), k = we();
    async function p() {
      const N = k();
      U.value = "";
      try {
        const E = await Al.capabilities();
        if (!N()) return;
        if (g.value = E, !E.administer_delivery) {
          V.value = void 0;
          return;
        }
        const R = await Ll.status();
        N() && (V.value = R);
      } catch (E) {
        N() && (U.value = se(E, "Mail access and delivery settings could not be loaded."));
      }
    }
    Fe(async () => {
      h.refresh(), await p();
    });
    const c = y(!1), A = y(!1), z = y({});
    function Z(N) {
      z.value = N, c.value = !0;
    }
    _l(Za, {
      library: h,
      capabilities: g,
      delivery: V,
      go: (N) => {
        o(N);
      },
      create: Z,
      upload: () => {
        A.value = !0;
      },
      setDirty: (N) => {
        x.value = N;
      },
      setTitle: (N) => {
        P.value = N;
      }
    });
    const X = {
      content: (N) => N === "message" ? "Message" : N === "base" ? "Layout" : "Content",
      variables: (N) => N === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, ee = {
      content: (N) => fe[N],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, H = B(() => !!g.value?.administer_delivery), j = B(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: fe.message },
        { value: "bases", label: "Base templates", icon: fe.base },
        { value: "parts", label: "Parts", icon: fe.part },
        { value: "assets", label: "Images", icon: fe.asset }
      ] },
      ...H.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), $ = { value: "all", label: "All resources", icon: "tabler:table" }, P = y("");
    Q(() => Ie(u.value), () => {
      P.value = "";
    });
    const w = B(() => {
      const N = u.value;
      if (N.name === "resource")
        return {
          leading: { value: "all", label: "All " + ha[N.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: P.value || " ", items: el(N.kind).map((E) => ({
            value: E,
            label: X[E](N.kind),
            icon: ee[E](N.kind)
          })) }]
        };
    }), f = B(() => {
      const N = u.value;
      return N.name === "resource" ? N.section : N.name === "activity" ? "activity" : N.section;
    });
    function L(N) {
      const E = u.value;
      if (E.name === "resource") {
        o(N === "all" ? { name: "library", section: fa(E.kind) } : { ...E, section: N });
        return;
      }
      o(N === "activity" ? { name: "activity" } : { name: "library", section: N });
    }
    const ae = y();
    return Q(() => Ie(u.value), () => {
      ae.value?.scrollTo({ top: 0 });
    }), (N, E) => (l(), i("main", Qr, [
      t(Xl, {
        label: "Mail sections",
        title: "Mail",
        value: f.value,
        groups: w.value ? w.value.groups : j.value,
        "leading-item": w.value ? w.value.leading : $,
        "onUpdate:value": L
      }, null, 8, ["value", "groups", "leading-item"]),
      s("div", Xr, [
        s("div", {
          ref_key: "main",
          ref: ae,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": u.value.name === "resource" && u.value.section === "content" }])
        }, [
          U.value ? (l(), i("p", eu, b(U.value), 1)) : S("", !0),
          a(C) ? (l(), i("p", au, b(a(C)), 1)) : S("", !0),
          u.value.name === "resource" ? (l(), D(Nn, {
            key: u.value.kind + "/" + u.value.resource,
            kind: u.value.kind,
            name: u.value.resource,
            section: u.value.section
          }, null, 8, ["kind", "name", "section"])) : u.value.name === "activity" ? (l(), i(K, { key: 3 }, [
            H.value ? (l(), D(Zr, {
              key: 0,
              message: u.value.message,
              template: u.value.template
            }, null, 8, ["message", "template"])) : g.value ? (l(), i(K, { key: 1 }, [
              t(Je, {
                title: "Activity",
                description: ""
              }),
              E[2] || (E[2] = s("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : S("", !0)
          ], 64)) : u.value.section === "assets" ? (l(), D(Ko, {
            key: 4,
            asset: u.value.asset
          }, null, 8, ["asset"])) : (l(), D(Yt, {
            key: 5,
            section: u.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      t(cr, {
        visible: c.value,
        intent: z.value,
        onClose: E[0] || (E[0] = (R) => c.value = !1)
      }, null, 8, ["visible", "intent"]),
      t(il, {
        visible: A.value,
        onClose: E[1] || (E[1] = (R) => A.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), tu = /* @__PURE__ */ ie({
  __name: "MailAdminRoot",
  setup(e) {
    const r = fl(), n = bl();
    return (d, m) => (l(), D(lu, {
      route: a(r).route,
      onNavigate: m[0] || (m[0] = (u) => a(n)("navigate", { route: u })),
      onDirtyChange: m[1] || (m[1] = (u) => a(n)("dirty-change", { dirty: u }))
    }, null, 8, ["route"]));
  }
}), Au = { rootComponent: tu, plugins: [yl] };
export {
  Au as config
};
