import { u as Fe, a as fl, b as bl, P as yl } from "./wc-runtime-UUwuoPn6.js";
import { defineComponent as ie, useId as ve, openBlock as l, createElementBlock as i, unref as a, normalizeClass as re, createElementVNode as t, createTextVNode as G, toDisplayString as b, createCommentVNode as S, renderSlot as De, computed as B, createBlock as D, resolveDynamicComponent as pl, normalizeProps as hl, guardReactiveProps as gl, createSlots as ya, withCtx as I, Fragment as K, renderList as me, inject as kl, reactive as Pa, ref as y, createVNode as s, watch as Q, nextTick as Be, onBeforeUnmount as ta, shallowRef as he, withModifiers as Te, useModel as Da, mergeModels as ua, defineAsyncComponent as da, withDirectives as $l, vShow as wl, provide as _l } from "vue";
import { host as qe, api as xl, on as Cl } from "@wippy-fe/proxy";
import { Icon as O } from "@iconify/vue";
import { u as Le, l as le, d as se, k as pe, b as sa, A as Vl, e as ke, p as ye, w as qa, a as Ve, _ as Je, c as pa, f as fe, s as Ba, i as We, g as we, h as Ha, j as ha, m as Ke, n as Fa, o as ia, q as Sl, r as na, t as ca, v as Ja, x as Wa, y as Ka, z as Tl, B as Ya, C as Ga, D as la, E as Rl, F as Ul, G as Al, H as Ll } from "./navigation-DC1TuBvs.js";
import Me from "primevue/skeleton";
import q from "primevue/button";
import ce from "primevue/column";
import ga from "primevue/datatable";
import ka from "primevue/iconfield";
import $a from "primevue/inputicon";
import ue from "primevue/inputtext";
import Ce from "primevue/selectbutton";
import Se from "primevue/dialog";
import jl from "primevue/progressbar";
import Ae from "primevue/tag";
import wa from "primevue/select";
import Il from "primevue/menu";
import El from "primevue/checkbox";
import Nl from "primevue/inputnumber";
import va from "primevue/textarea";
import Za from "primevue/drawer";
import Ml from "primevue/fileupload";
const zl = ["aria-labelledby"], Ol = { class: "kx-railhead" }, Pl = ["id"], Dl = { key: 0 }, ql = { class: "kx-railhead-acts" }, Bl = { class: "kx-rail-body" }, Hl = /* @__PURE__ */ ie({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const u = ve();
    return (n, d) => (l(), i("aside", {
      class: re(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(u)
    }, [
      t("div", Ol, [
        t("span", {
          id: a(u),
          class: "kx-railhead-title"
        }, [
          G(b(e.title), 1),
          e.count !== void 0 ? (l(), i("b", Dl, b(e.count), 1)) : S("", !0)
        ], 8, Pl),
        t("div", ql, [
          De(n.$slots, "actions")
        ])
      ]),
      De(n.$slots, "toolbar"),
      t("div", Bl, [
        De(n.$slots, "default")
      ])
    ], 10, zl));
  }
}), Fl = ["aria-label"], Jl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Wl = ["aria-current", "onClick"], Kl = { class: "kx-settings-rail-label" }, Yl = /* @__PURE__ */ ie({
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
    const u = e, n = B(() => u.leadingItem ? [{ items: [u.leadingItem] }, ...u.groups] : u.groups);
    function d(f) {
      const r = [...f.currentTarget.querySelectorAll(".kx-settings-rail-item")], x = r.indexOf(f.target);
      if (x < 0) return;
      let v;
      switch (f.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = (x + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = (x + r.length - 1) % r.length;
          break;
        case "Home":
          v = 0;
          break;
        case "End":
          v = r.length - 1;
          break;
        default:
          return;
      }
      f.preventDefault(), r[v]?.focus();
    }
    return (f, r) => (l(), D(pl(e.title ? Hl : "div"), hl(gl(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ya({
      default: I(() => [
        t("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: d
        }, [
          (l(!0), i(K, null, me(n.value, (x, v) => (l(), i("div", {
            key: x.items[0]?.value ?? v,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && v === 0 }])
          }, [
            x.heading ? (l(), i("div", Jl, b(x.heading), 1)) : S("", !0),
            (l(!0), i(K, null, me(x.items, (_) => (l(), i("button", {
              key: _.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": _.value === e.value ? "true" : void 0,
              onClick: (T) => f.$emit("update:value", _.value)
            }, [
              _.icon ? (l(), D(a(O), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: _.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              t("span", Kl, b(_.label), 1)
            ], 8, Wl))), 128))
          ], 2))), 128))
        ], 42, Fl)
      ]),
      _: 2
    }, [
      e.title && f.$slots.actions ? {
        name: "actions",
        fn: I(() => [
          De(f.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Qa = Symbol("mail-admin");
function be() {
  const e = kl(Qa);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function Xa(e) {
  const { kind: u, name: n, title: d, description: f, state: r, revision: x, origin: v, origin_label: _, base: T, author: o, author_label: h, updated_at: C, used_by: g } = e, V = g && {
    messages: g.messages?.length,
    recent_sources: g.recent_senders?.length
  };
  return { kind: u, name: n, title: d, description: f, state: r, revision: x, origin: v, origin_label: _, base: T, author: o, author_label: h, updated_at: C, used_by: V };
}
const Ne = 100, ma = 50;
function Gl() {
  const e = Pa(/* @__PURE__ */ new Map()), u = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Map(), f = y(""), r = y(0);
  let x = !1;
  const v = (c, A) => `${c}/${A}`;
  function _(c) {
    for (const A of c) e.set(v(A.kind, A.name), A);
  }
  async function T(c, A) {
    const z = r.value;
    for (let Z = 0; Z < A.length; Z += Ne) {
      const X = A.slice(Z, Z + Ne);
      try {
        const ee = await le.page({ kind: c, names: X, limit: Ne });
        if (z !== r.value) return;
        const H = new Map(ee.items.map((j) => [j.name, j]));
        for (const j of X) {
          const $ = v(c, j);
          e.has($) || e.set($, H.get(j) ?? null);
        }
      } catch (ee) {
        if (z !== r.value) return;
        for (const H of X) d.set(v(c, H), z);
        f.value = se(ee, "Library references could not be loaded.");
      } finally {
        if (z === r.value) for (const ee of X) n.delete(v(c, ee));
      }
    }
  }
  function o() {
    x = !1;
    const c = [...u.entries()];
    u.clear();
    for (const [A, z] of c) T(A, [...z]);
  }
  function h(c, A) {
    const z = v(c, A);
    if (d.get(z) === r.value || e.has(z) || n.has(z)) return;
    n.add(z);
    const Z = u.get(c) ?? /* @__PURE__ */ new Set();
    Z.add(A), u.set(c, Z), x || (x = !0, queueMicrotask(o));
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
    const Z = r.value, X = await le.page({ kind: c, q: A || void 0, names: z, limit: ma });
    return Z === r.value && _(X.items), X;
  }
  function k(c, A, z) {
    e.set(v(c, A), z ?? null);
  }
  function p() {
    r.value++, u.clear(), n.clear(), d.clear(), e.clear(), f.value = "";
  }
  return Le("mail.library", p), { find: C, exists: g, title: V, search: U, remember: _, patch: k, refresh: p, lookupError: f };
}
const Zl = { class: "kx-empty" }, Ql = { class: "kx-empty-ico" }, Xl = { class: "kx-empty-title" }, et = {
  key: 0,
  class: "kx-empty-sub"
}, _a = /* @__PURE__ */ ie({
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
    return (u, n) => (l(), i("div", Zl, [
      t("div", Ql, [
        s(a(O), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", Xl, b(e.title), 1),
      e.hint || u.$slots.hint ? (l(), i("p", et, [
        De(u.$slots, "hint", {}, () => [
          G(b(e.hint), 1)
        ])
      ])) : S("", !0),
      e.cta ? (l(), D(a(q), {
        key: 1,
        label: e.cta,
        onClick: n[0] || (n[0] = (d) => u.$emit("cta"))
      }, ya({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: I(({ class: d }) => [
            s(a(O), {
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
}), xa = {
  message: "messages",
  base: "bases",
  part: "parts"
}, el = Object.fromEntries(Object.entries(xa).map(([e, u]) => [u, e])), at = ["content", "variables", "used-by", "history"];
function fa(e) {
  return xa[e];
}
function lt(e) {
  return el[e];
}
function al(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : at;
}
function Ie(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${xa[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Ma(e) {
  const u = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [n, d, f] = u;
  if (!n) return { name: "library", section: "all" };
  try {
    if (n === "activity")
      return d === "template" && f ? { name: "activity", template: decodeURIComponent(f) } : d ? { name: "activity", message: decodeURIComponent(d) } : { name: "activity" };
    if (n === "assets") return d ? { name: "library", section: "assets", asset: decodeURIComponent(d) } : { name: "library", section: "assets" };
    const r = el[n];
    if (!r) return { name: "library", section: "all" };
    if (!d) return { name: "library", section: n };
    const v = al(r).find((_) => _ === f) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(d), section: v };
  } catch {
    return { name: "library", section: "all" };
  }
}
const tt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", st = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${tt}"><base target="_blank">`;
function Ca(e, u) {
  let n = e;
  for (const [d, f] of Object.entries(u ?? {}))
    n = n.split("cid:" + d).join(f);
  return st + n;
}
function it() {
  let e = document.activeElement;
  for (; e?.shadowRoot?.activeElement; ) e = e.shadowRoot.activeElement;
  return e instanceof HTMLElement ? e : null;
}
function $e(e) {
  let u = null;
  Q(e, (n) => {
    if (n) {
      u = it();
      return;
    }
    const d = u;
    u = null, Be(() => {
      d?.isConnected && d.focus();
    });
  });
}
const nt = {
  class: "mail-problem",
  role: "alert"
}, ot = { class: "mail-problem-lead" }, rt = {
  key: 0,
  class: "mail-problem-detail"
}, ut = {
  key: 1,
  class: "mail-problem-involved"
}, dt = {
  key: 0,
  class: "mail-problem-self"
}, ba = /* @__PURE__ */ ie({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const u = e, { library: n, go: d } = be(), f = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (o) => n.title(o.kind, o.name), x = (o) => !!o && !!u.draft && o.kind === u.draft.kind && o.name === u.draft.name, v = B(() => {
      const { resource: o, face: h, previewOf: C } = u.problem, g = h ? f[h] : "";
      if (o && u.draft && u.draft.kind !== "message" && o.kind === "message" && o.name === C)
        return `${r(o) ?? "The message"} does not render with your changes.`;
      if (u.problem.tooLarge) {
        const V = !o || x(o) ? u.draft ? `this ${pe[u.draft.kind].toLowerCase()}` : "it" : r(o) ?? "a resource it uses";
        return `The ${g || "content"} of ${V} is larger than Mail can send. Keep each rendered face under ${sa(u.problem.tooLarge)}.`;
      }
      if (!o || x(o)) {
        const V = u.draft ? `this ${pe[u.draft.kind].toLowerCase()}` : "it";
        return g ? `The ${g} of ${V} does not render.` : `${V[0].toUpperCase()}${V.slice(1)} does not render.`;
      }
      return `${r(o) ?? "A resource it uses"} does not render${g ? ` (${g})` : ""}.`;
    }), _ = B(() => u.problem.candidates ?? []);
    function T(o) {
      o.kind === "asset" ? d({ name: "library", section: "assets", asset: o.name }) : d({ name: "resource", kind: o.kind, resource: o.name, section: "content" });
    }
    return (o, h) => (l(), i("div", nt, [
      t("p", ot, [
        s(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(v.value), 1)
      ]),
      e.problem.tooLarge ? S("", !0) : (l(), i("code", rt, b(e.problem.engine ?? e.problem.message), 1)),
      _.value.length ? (l(), i("p", ut, [
        h[0] || (h[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), i(K, null, me(_.value, (C) => (l(), i(K, {
          key: C.kind + C.name
        }, [
          x(C) ? (l(), i("span", dt, "This " + b(a(pe)[C.kind].toLowerCase()), 1)) : r(C) === void 0 ? (l(), D(a(Me), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), D(a(q), {
            key: 2,
            link: "",
            size: "small",
            label: r(C),
            class: "mail-inline-link",
            onClick: (g) => T(C)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : S("", !0)
    ]));
  }
}), za = ["html", "text", "subject", "variables", "samples"];
function Oe(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function He(e) {
  if (!(e instanceof Vl)) return;
  const u = e.details ?? {}, n = ke(e);
  if (n === "mail_resource_in_use") {
    const T = Array.isArray(u.messages) ? u.messages.filter((h) => typeof h == "string") : [], o = u.dependent;
    return {
      message: e.message,
      dependents: T,
      references: Array.isArray(u.resources) ? u.resources.filter(Oe) : void 0,
      face: za.find((h) => h === o?.face),
      resource: Oe(o?.resource) ? o.resource : void 0
    };
  }
  const d = za.find((T) => T === u.face) ?? (n === "invalid_template_vars" ? "samples" : void 0);
  if (!d) return;
  const f = Array.isArray(u.dependent_messages) ? u.dependent_messages.filter((T) => typeof T == "string") : [], r = Array.isArray(u.errors) ? u.errors.flatMap((T) => {
    const o = T;
    return Oe(o.resource) && typeof o.message == "string" ? [{ name: o.resource.name, message: o.message }] : [];
  }) : [], x = Array.isArray(u.candidate_resources) ? u.candidate_resources.filter(Oe) : [], v = typeof u.engine_message == "string" ? u.engine_message : void 0, _ = (n === "html_too_large" || n === "text_too_large") && typeof u.maximum == "number" ? u.maximum : void 0;
  return {
    message: e.message,
    engine: v,
    tooLarge: _,
    face: d,
    resource: Oe(u.resource) ? u.resource : void 0,
    dependents: f.length ? f : void 0,
    reasons: r.length ? r : void 0,
    candidates: x.length ? x : void 0
  };
}
const ct = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, vt = { class: "kx-modal-head-icon" }, mt = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, ft = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, bt = {
  key: 2,
  class: "mail-muted"
}, yt = ["data-name"], pt = { class: "mail-gallery-title" }, ht = { class: "mail-sub" }, gt = {
  key: 0,
  class: "mail-gallery-warning",
  role: "status"
}, kt = { class: "mail-gallery-frame" }, $t = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, wt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, _t = {
  key: 2,
  class: "mail-gallery-problem"
}, xt = {
  key: 1,
  role: "alert"
}, Ct = ["srcdoc", "title"], Vt = {
  key: 3,
  class: "mail-more"
}, St = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Tt = 3, Rt = /* @__PURE__ */ ie({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: u }) {
    const n = e, d = u, { go: f } = be();
    $e(() => n.visible);
    const r = y([]), x = y(), v = y(), _ = y(!1), T = y("");
    let o = 0, h = [], C = 0, g;
    async function V(w, m) {
      w.state = "loading";
      try {
        const L = await le.preview(w.name, []);
        if (m !== o) return;
        w.subject = L.subject, w.warning = L.warnings?.length ? L.warnings.map(qa).join(" ") : void 0, w.document = L.html ? Ca(L.html, L.inline_assets) : "", w.state = "ready";
      } catch (L) {
        if (m !== o) return;
        w.problem = He(L), w.failure = w.problem ? "" : se(L, "This message could not be rendered."), w.state = "failed";
      }
    }
    function U(w) {
      for (; w === o && C < Tt && h.length; ) {
        const m = h.shift();
        m.state === "waiting" && (C++, V(m, w).finally(() => {
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
        for (const w of r.value) k(w);
        return;
      }
      g = new IntersectionObserver((w) => {
        for (const m of w) {
          if (!m.isIntersecting) continue;
          const L = r.value.find((ae) => ae.name === m.target.dataset.name);
          L && k(L);
        }
      }, { root: p.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const w of p.value.querySelectorAll("[data-name]")) g.observe(w);
    }
    async function A(w) {
      _.value = !0, T.value = "";
      try {
        const m = await le.page({ kind: "message", cursor: x.value });
        if (w !== o) return;
        r.value = [...r.value, ...m.items.map((L) => Pa({ name: L.name, title: L.title, state: "waiting" }))], x.value = m.next_cursor, v.value = m.total, await Be(), c();
      } catch (m) {
        w === o && (T.value = se(m, "The messages could not be listed."));
      } finally {
        w === o && (_.value = !1);
      }
    }
    function z() {
      o++, h = [], g?.disconnect(), g = void 0;
    }
    function Z() {
      z(), r.value = [], x.value = v.value = void 0, A(o);
    }
    function X() {
      const w = ++o;
      h = [];
      for (const m of r.value) Object.assign(m, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Be(() => {
        w === o && c();
      });
    }
    Q(() => n.visible, (w) => {
      w ? Z() : z();
    }), ta(z);
    const ee = B(() => r.value.filter((w) => w.state === "ready" || w.state === "failed").length), H = B(() => r.value.filter((w) => w.state === "failed").length), j = B(() => {
      if (!r.value.length) return "";
      const w = `${ee.value} of ${ye(v.value ?? r.value.length, "message")} rendered`;
      return H.value ? `${w}, ${H.value} with a problem.` : w + ".";
    });
    function $(w) {
      d("close"), f({ name: "resource", kind: "message", resource: w, section: "content" });
    }
    const P = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (w, m) => (l(), D(a(Se), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: P,
      "aria-label": "Preview all messages",
      "onUpdate:visible": m[1] || (m[1] = (L) => {
        L || d("close");
      })
    }, {
      header: I(() => [
        t("span", vt, [
          s(a(O), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        m[2] || (m[2] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !r.value.length,
          onClick: X
        }, {
          icon: I(() => [
            s(a(O), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: I(() => [
        r.value.length ? (l(), i("div", mt, [
          t("span", null, b(j.value), 1),
          s(a(jl), {
            value: Math.round(ee.value / (v.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : S("", !0),
        _.value && !r.value.length ? (l(), i("p", ft, [
          s(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          m[3] || (m[3] = G("Listing messages…", -1))
        ])) : !_.value && !T.value && !r.value.length ? (l(), i("p", bt, "There are no messages yet.")) : S("", !0),
        t("ul", {
          ref_key: "list",
          ref: p,
          class: "mail-gallery"
        }, [
          (l(!0), i(K, null, me(r.value, (L) => (l(), i("li", {
            key: L.name,
            "data-name": L.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": L.state === "failed" }])
          }, [
            s(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + L.title,
              onClick: (ae) => $(L.name)
            }, {
              default: I(() => [
                t("span", pt, b(L.title), 1),
                t("span", ht, b(L.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            L.warning ? (l(), i("p", gt, [
              s(a(O), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              G(b(L.warning), 1)
            ])) : S("", !0),
            t("div", kt, [
              L.state === "waiting" ? (l(), i("p", $t, "Renders when shown.")) : L.state === "loading" ? (l(), i("p", wt, [
                s(a(O), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                m[4] || (m[4] = G("Rendering…", -1))
              ])) : L.state === "failed" ? (l(), i("div", _t, [
                L.problem ? (l(), D(ba, {
                  key: 0,
                  problem: L.problem,
                  draft: { kind: "message", name: L.name }
                }, null, 8, ["problem", "draft"])) : (l(), i("p", xt, b(L.failure), 1))
              ])) : (l(), i("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: L.document,
                title: L.title + " preview",
                tabindex: "-1"
              }, null, 8, Ct))
            ])
          ], 10, yt))), 128))
        ], 512),
        x.value || T.value ? (l(), i("div", Vt, [
          T.value ? (l(), i("span", St, b(T.value), 1)) : S("", !0),
          s(a(q), {
            label: T.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: _.value,
            onClick: m[0] || (m[0] = (L) => A(a(o)))
          }, null, 8, ["label", "loading"])
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Ut = { class: "mail-source" }, At = { key: 0 }, Lt = { key: 1 }, Va = /* @__PURE__ */ ie({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (u, n) => (l(), i("span", Ut, [
      e.resource.state === "created" ? (l(), i("span", At, b((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(Ve)(e.resource.author_label, e.resource.author)), 1)) : (l(), i("span", Lt, "Included with " + b(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), D(a(Ae), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : S("", !0)
    ]));
  }
}), jt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, It = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Et = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Nt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Mt = { class: "mail-toolbar" }, zt = {
  class: "mail-count",
  role: "status"
}, Ot = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Pt = {
  key: 0,
  class: "mail-sub"
}, Dt = { class: "mail-kind" }, qt = { class: "mail-muted" }, Bt = {
  key: 2,
  class: "mail-more"
}, Ht = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ft = /* @__PURE__ */ ie({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const u = e, { library: n, go: d, create: f } = be(), r = B(() => lt(u.section)), x = y("all"), v = y(""), _ = y("");
    let T;
    Q(v, (N) => {
      clearTimeout(T), T = setTimeout(() => {
        _.value = N.trim();
      }, 250);
    }), Q(() => u.section, () => {
      v.value = _.value = "", x.value = "all";
    });
    const o = he([]), h = y(), C = y(), g = y(!0), V = y(!1), U = y(!1), k = y(!1), p = y(""), c = y(""), A = y(""), z = we(), Z = () => ({ kind: r.value, state: x.value === "all" ? void 0 : x.value, q: _.value || void 0 });
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
    Q([r, x, _], () => {
      X();
    }), Fe(() => X(V.value)), Le("mail.library", () => {
      X(V.value);
    });
    const H = B(() => {
      switch (r.value) {
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
      const N = r.value ? pe[r.value].toLowerCase() : "resource", E = C.value ?? o.value.length;
      return o.value.length < E ? `${o.value.length} of ${ye(E, N)}` : ye(E, N);
    });
    function P(N) {
      const E = N.used_by;
      return N.kind === "base" || N.kind === "asset" ? E?.messages ? ye(E.messages, "message") : "—" : N.kind === "message" ? E?.recent_sources ? ye(E.recent_sources, "recent sender") : "—" : "";
    }
    function w(N) {
      return N.base ? n.title("base", N.base) : "";
    }
    function m(N) {
      N.kind === "asset" ? d({ name: "library", section: "assets", asset: N.name }) : d({ name: "resource", kind: N.kind, resource: N.name, section: "content" });
    }
    const L = B(() => V.value && !p.value && r.value && !o.value.length && x.value === "all" && !_.value), ae = y(!1);
    return (N, E) => (l(), i(K, null, [
      s(Je, {
        title: H.value.title,
        description: H.value.description
      }, {
        actions: I(() => [
          !r.value || r.value === "message" ? (l(), D(a(q), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: E[0] || (E[0] = (R) => ae.value = !0)
          }, {
            icon: I(() => [
              s(a(O), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          s(a(q), {
            label: r.value ? "New " + a(pe)[r.value].toLowerCase() : "New",
            onClick: E[1] || (E[1] = (R) => a(f)({ kind: r.value }))
          }, {
            icon: I(() => [
              s(a(O), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      k.value ? (l(), i("p", jt, [
        s(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[9] || (E[9] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : p.value ? (l(), i("div", It, [
        t("span", null, b(p.value), 1),
        s(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[2] || (E[2] = (R) => X())
        })
      ])) : S("", !0),
      A.value ? (l(), i("div", Et, [
        t("span", null, b(A.value) + " The list shows what was loaded before.", 1),
        s(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[3] || (E[3] = (R) => X(!0))
        })
      ])) : g.value && !V.value ? (l(), i("p", Nt, [
        s(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        E[10] || (E[10] = G("Loading mail library…", -1))
      ])) : L.value && r.value ? (l(), D(_a, {
        key: 4,
        icon: a(fe)[r.value],
        title: "No " + a(pa)[r.value].toLowerCase() + " yet",
        hint: "Create a " + a(pe)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(pe)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: E[4] || (E[4] = (R) => a(f)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : V.value ? (l(), i(K, { key: 5 }, [
        t("div", Mt, [
          s(a(Ce), {
            modelValue: x.value,
            "onUpdate:modelValue": E[5] || (E[5] = (R) => x.value = R),
            options: j,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          s(a(ka), { class: "mail-search" }, {
            default: I(() => [
              s(a($a), null, {
                default: I(() => [
                  s(a(O), {
                    icon: g.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: g.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              s(a(ue), {
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
          t("span", zt, b($.value), 1)
        ]),
        o.value.length ? (l(), D(a(ga), {
          key: 1,
          value: o.value,
          "data-key": (R) => R.kind + "/" + R.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": H.value.title } },
          onRowClick: E[7] || (E[7] = (R) => m(R.data))
        }, {
          default: I(() => [
            s(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: I(({ data: R }) => [
                s(a(q), {
                  link: "",
                  class: "mail-name",
                  label: R.title,
                  onClick: Te((M) => m(R), ["stop"])
                }, null, 8, ["label", "onClick"]),
                R.description ? (l(), i("span", Pt, b(R.description), 1)) : S("", !0)
              ]),
              _: 1
            }),
            r.value ? S("", !0) : (l(), D(a(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: I(({ data: R }) => [
                t("span", Dt, [
                  s(a(O), {
                    icon: a(fe)[R.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  G(b(a(pe)[R.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), D(a(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: I(({ data: R }) => [
                w(R) === void 0 ? (l(), D(a(Me), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i(K, { key: 1 }, [
                  G(b(w(R)), 1)
                ], 64))
              ]),
              _: 1
            })) : S("", !0),
            s(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: I(({ data: R }) => [
                s(Va, { resource: R }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), D(a(ce), {
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
            s(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: R }) => [
                t("span", qt, b(R.state === "original" ? "—" : a(Ba)(R.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), i("p", Ot, "Nothing matches. Try another name or a word from the template.")),
        h.value ? (l(), i("div", Bt, [
          c.value ? (l(), i("span", Ht, b(c.value), 1)) : S("", !0),
          s(a(q), {
            label: c.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: U.value,
            disabled: g.value,
            onClick: ee
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      s(Rt, {
        visible: ae.value,
        onClose: E[8] || (E[8] = (R) => ae.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
}), Jt = /* @__PURE__ */ ie({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (u, n) => (l(), i(K, null, [
      s(a(Ae), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      s(a(q), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: n[0] || (n[0] = (d) => u.$emit("discard"))
      }, {
        icon: I(() => [
          s(a(O), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      s(a(q), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: n[1] || (n[1] = (d) => u.$emit("review", d.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
});
function Wt(e) {
  return JSON.parse(JSON.stringify(e));
}
function xe(e) {
  const u = Wt(e);
  return {
    kind: u.kind,
    name: u.name,
    title: u.title,
    description: u.description,
    html: u.html,
    text: u.text,
    base: u.base,
    subject: u.subject,
    schema: u.schema,
    samples: u.samples
  };
}
function Kt(e, u) {
  return JSON.stringify(xe(e)) === JSON.stringify(xe(u));
}
function Yt(e, u, n, d, f) {
  const r = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: u,
    title: n,
    description: d,
    base: f,
    subject: n,
    schema: r,
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
    name: u,
    title: n,
    description: d,
    schema: r,
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
  } : { kind: e, name: u, title: n, description: d, schema: r, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function Gt(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function Zt(e) {
  const u = [], n = e.samples;
  for (const [d, f] of Object.entries(e.schema.properties)) {
    const r = Gt(n[d] ?? f.default ?? (f.type === "string" ? "" : null));
    r !== void 0 && u.push(`${JSON.stringify(d)}, ${r}`);
  }
  return u.length ? `{{ include "/part/${e.name}" map(${u.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function ll(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function Qt(e, u, n) {
  return `<img src="${ll(e)}" alt="${u.replace(/"/g, "&quot;")}" style="display:block;border:0;max-width:100%;height:auto;">`;
}
const Xt = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function es(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !Xt.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const as = "{{ block body() }}{{ end }}", ls = { class: "mail-picker-search" }, ts = ["for"], ss = {
  key: 0,
  class: "mail-kind"
}, is = { key: 1 }, ns = {
  key: 0,
  class: "mail-picker-more"
}, Ye = /* @__PURE__ */ ie({
  __name: "ResourcePicker",
  props: /* @__PURE__ */ ua({
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
    const u = e, n = Da(e, "modelValue"), { library: d } = be(), f = y(""), r = he([]), x = y(!1), v = y(!1), _ = y(""), T = ve(), o = we();
    async function h() {
      const k = o();
      v.value = !0;
      try {
        const p = u.names?.slice(0, Ne), c = p && !p.length ? { items: [] } : await d.search(u.kind, f.value || void 0, p);
        if (!k()) return;
        r.value = c.items, x.value = !!c.next_cursor || (u.names?.length ?? 0) > Ne, _.value = "";
      } catch (p) {
        k() && (_.value = se(p, "The choices could not be loaded."));
      } finally {
        k() && (v.value = !1);
      }
    }
    let C;
    Q(f, () => {
      clearTimeout(C), C = setTimeout(() => {
        h();
      }, 250);
    }), Q(() => [u.kind, u.names?.join(",")], () => {
      h();
    }), ta(() => clearTimeout(C));
    function g() {
      !r.value.length && !v.value && h();
    }
    const V = B(() => {
      const k = r.value.filter((c) => c.name !== u.exclude).map((c) => ({ value: c.name, label: c.title })), p = n.value;
      return p && !k.some((c) => c.value === p) && !u.extra?.some((c) => c.value === p) && k.unshift({ value: p, label: d.title(u.kind, p) ?? p }), [...u.extra ?? [], ...k];
    }), U = B(() => {
      const k = n.value;
      return k ? u.extra?.find((p) => p.value === k)?.label ?? d.title(u.kind, k) : "";
    });
    return (k, p) => (l(), D(a(wa), {
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
      "empty-message": _.value || (f.value ? "Nothing matches." : "Nothing to choose yet."),
      onShow: g
    }, {
      header: I(() => [
        t("div", ls, [
          t("label", {
            class: "mail-sr-only",
            for: a(T)
          }, "Search " + b(e.label.toLowerCase()), 9, ts),
          s(a(ue), {
            id: a(T),
            modelValue: f.value,
            "onUpdate:modelValue": p[0] || (p[0] = (c) => f.value = c),
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
        c ? (l(), i("span", ss, [
          s(a(O), {
            icon: a(fe)[e.kind],
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          G(b(U.value ?? ""), 1)
        ])) : (l(), i("span", is, b(A), 1))
      ]),
      footer: I(() => [
        x.value ? (l(), i("p", ns, "Showing the first matches. Search to find others.")) : S("", !0)
      ]),
      _: 1
    }, 8, ["modelValue", "options", "input-id", "placeholder", "aria-label", "disabled", "show-clear", "fluid", "loading", "empty-message"]));
  }
}), os = {
  class: "mail-preview",
  "aria-label": "Preview"
}, rs = { class: "mail-preview-bar" }, us = {
  key: 0,
  class: "mail-preview-with"
}, ds = ["for"], cs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, vs = {
  key: 1,
  class: "mail-field-hint"
}, ms = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, fs = {
  key: 2,
  class: "mail-preview-envelope"
}, bs = ["aria-busy"], ys = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ps = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, hs = ["srcdoc", "title"], gs = {
  key: 1,
  class: "mail-preview-text"
}, ks = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, $s = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, ws = {
  key: 5,
  class: "mail-preview-foot"
}, _s = /* @__PURE__ */ ie({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, delivery: r } = be(), x = { message: ve() }, v = y("email"), _ = y("desktop"), T = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], o = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], h = y(""), C = y(""), g = y("");
    async function V() {
      if (n.draft.kind === "message") return;
      const m = n.messages?.slice(0, Ne);
      try {
        const L = m && !m.length ? void 0 : await f.search("message", void 0, m);
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
      const m = k.value;
      if (!m) return;
      if (ee) {
        H = !0;
        return;
      }
      ee = !0;
      const L = Z();
      c.value = !0;
      try {
        const ae = await le.preview(m, [n.draft]);
        if (!L()) return;
        p.value = ae, A.value = void 0, z.value = "";
      } catch (ae) {
        if (!L()) return;
        const N = He(ae);
        A.value = N ? { ...N, previewOf: m } : void 0, z.value = A.value ? "" : se(ae, "The preview could not be rendered.");
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
    }, { immediate: !0 }), Q(A, (m) => d("problem", m)), ta(() => clearTimeout(X));
    const P = B(() => p.value?.html ? Ca(p.value.html, p.value.inline_assets) : ""), w = B(() => {
      const m = r.value?.from;
      return m ? m.name ? `${m.name} <${m.address}>` : m.address : "";
    });
    return (m, L) => (l(), i("section", os, [
      t("div", rs, [
        s(a(Ce), {
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
            s(a(O), {
              icon: ae.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            G(b(ae.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : S("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), i("div", us, [
        t("label", {
          for: x.message
        }, "Preview with", 8, ds),
        s(Ye, {
          modelValue: h.value,
          "onUpdate:modelValue": L[2] || (L[2] = (ae) => h.value = ae),
          kind: "message",
          label: "Preview with",
          "input-id": x.message,
          names: e.messages,
          placeholder: "Choose a message…"
        }, null, 8, ["modelValue", "input-id", "names"]),
        g.value ? (l(), i("small", cs, b(g.value), 1)) : U.value ? (l(), i("small", vs, b(U.value), 1)) : S("", !0)
      ])) : S("", !0),
      c.value && p.value ? (l(), i("p", ms, [
        s(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        L[3] || (L[3] = G("Updating the preview…", -1))
      ])) : S("", !0),
      p.value ? (l(), i("dl", fs, [
        w.value ? (l(), i(K, { key: 0 }, [
          L[4] || (L[4] = t("dt", null, "From", -1)),
          t("dd", null, b(w.value), 1)
        ], 64)) : S("", !0),
        L[5] || (L[5] = t("dt", null, "Subject", -1)),
        t("dd", null, b(p.value.subject), 1)
      ])) : S("", !0),
      t("div", {
        class: re(["mail-preview-body", ["mail-preview-" + _.value, { "mail-preview-stale": A.value || z.value }]]),
        "aria-busy": c.value
      }, [
        !p.value && c.value ? (l(), i("p", ys, [
          s(a(O), {
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
          }, null, 8, hs)) : (l(), i("pre", gs, b(p.value.text), 1))
        ], 64)) : S("", !0) : (l(), i("p", ps, "Choose a message to see this " + b(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, bs),
      (l(!0), i(K, null, me(p.value?.warnings ?? [], (ae) => (l(), i("p", {
        key: ae.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        s(a(O), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, b(a(qa)(ae)), 1)
      ]))), 128)),
      A.value ? (l(), i("p", ks, [
        s(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(p.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : z.value ? (l(), i("p", $s, [
        s(a(O), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(z.value), 1)
      ])) : (l(), i("p", ws, [
        s(a(O), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        G(" " + b(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), xs = { class: "kx-modal-head-icon" }, Cs = { class: "kx-modal-head-text" }, Vs = { class: "kx-modal-head-sub" }, Ss = { class: "mail-change-list" }, Ts = { class: "mail-muted" }, Rs = { class: "mail-field" }, Us = ["for"], As = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Ls = { class: "mail-failure-body" }, js = { class: "mail-dependents" }, Is = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Es = /* @__PURE__ */ ie({
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
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, go: r } = be(), x = y(""), v = ve();
    Q(() => n.visible, (h) => {
      h && (x.value = n.suggestedNote ?? "");
    }), $e(() => n.visible);
    const _ = B(() => {
      const h = n.saved, C = n.draft, g = [];
      return (h.title !== C.title || h.description !== C.description) && g.push("Name and description"), h.base !== C.base && g.push(`Base template: ${f.title("base", C.base ?? "") ?? C.base}`), h.subject !== C.subject && g.push("Subject"), h.html !== C.html && g.push("HTML"), h.text !== C.text && g.push("Plain text"), (JSON.stringify(h.schema.properties) !== JSON.stringify(C.schema.properties) || JSON.stringify(h.schema.required ?? []) !== JSON.stringify(C.schema.required ?? [])) && g.push(C.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(h.samples) !== JSON.stringify(C.samples) && g.push("Sample values"), g;
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
        t("span", xs, [
          s(a(O), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", Cs, [
          C[4] || (C[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", Vs, b(e.draft.title), 1)
        ])
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: C[2] || (C[2] = (g) => d("close"))
        }, null, 8, ["disabled"]),
        s(a(q), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: I(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: C[1] || (C[1] = Te((g) => d("save", x.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            C[5] || (C[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", Ss, [
              (l(!0), i(K, null, me(_.value, (g) => (l(), i("li", { key: g }, b(g), 1))), 128))
            ])
          ]),
          t("p", Ts, b(T.value) + " The previous version stays in History.", 1),
          t("div", Rs, [
            t("label", {
              class: "mail-field-label",
              for: a(v)
            }, "Note for History", 8, Us),
            s(a(ue), {
              id: a(v),
              modelValue: x.value,
              "onUpdate:modelValue": C[0] || (C[0] = (g) => x.value = g),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), i("div", As, [
            s(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Ls, [
              t("strong", null, b(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, b(e.dependents.reason), 1),
              t("span", js, [
                (l(!0), i(K, null, me(e.dependents.names, (g) => (l(), D(a(q), {
                  key: g,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(f).title("message", g) ?? g,
                  onClick: (V) => {
                    d("close"), a(r)({ name: "resource", kind: "message", resource: g, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), i("p", Is, b(e.error), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Ns = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ms = { class: "kx-modal-head-icon" }, zs = { class: "kx-modal-head-text" }, Os = { class: "kx-modal-head-title" }, Ps = { class: "mail-field" }, Ds = ["for"], qs = { class: "kx-modal-head-icon" }, Bs = { class: "kx-modal-head-text" }, Hs = { class: "kx-modal-head-title" }, Fs = /* @__PURE__ */ ie({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: u, emit: n }) {
    const d = e, f = n, { library: r } = be(), x = y(), v = y(""), _ = y({});
    async function T(j) {
      try {
        const $ = await r.search(j);
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
      h.value = void 0, !(!j || !$) && (j === "part" ? p($) : Z($, r.title("asset", $) ?? $));
    }
    u({ toggle: o });
    const U = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], k = (j) => ({ label: j, disabled: !0, icon: "tabler:loader-2" });
    async function p(j) {
      v.value = "";
      try {
        f("insert", Zt(await le.get({ kind: "part", name: j })));
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
      c.value && (f("insert", Qt(c.value.name, A.value)), c.value = void 0);
    }
    const ee = B(() => {
      const j = Object.entries(d.draft.schema.properties).map(([m]) => ({
        label: m,
        icon: "tabler:variable",
        command: () => f("insert", d.draft.kind === "part" ? `{{ .${m} }}` : es(m))
      })), $ = [{
        label: d.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...j, ...U.map((m) => ({
          label: m.label,
          icon: "tabler:world",
          command: () => f("insert", `{{ ${m.name} }}`)
        }))]
      }], P = _.value.part, w = (P?.items ?? []).filter((m) => !(d.draft.kind === "part" && m.name === d.draft.name));
      if ($.push({ label: "Parts", items: P ? w.length ? [
        ...w.map((m) => ({ label: m.title, icon: fe.part, command: () => {
          p(m.name);
        } })),
        ...P.next_cursor ? [{ label: "Find another part…", icon: "tabler:search", command: () => g("part") }] : []
      ] : [{ label: "There are no parts to include yet.", disabled: !0 }] : [k("Loading parts…")] }), d.face === "html") {
        const m = _.value.asset, L = m?.items ?? [];
        $.push({ label: "Images", items: m ? L.length ? [
          ...L.map((ae) => ({ label: ae.title, icon: fe.asset, command: () => {
            Z(ae.name, ae.title);
          } })),
          ...m.next_cursor ? [{ label: "Find another image…", icon: "tabler:search", command: () => g("asset") }] : []
        ] : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [k("Loading images…")] });
      }
      return d.draft.kind === "base" && $.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => f("insert", as)
      }] }), $;
    }), H = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (j, $) => (l(), i(K, null, [
      s(a(Il), {
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
      v.value ? (l(), i("p", Ns, b(v.value), 1)) : S("", !0),
      s(a(Se), {
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
          t("span", Ms, [
            s(a(O), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", zs, [
            t("span", Os, "Insert " + b(c.value?.title), 1),
            $[6] || ($[6] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: I(() => [
          s(a(q), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: $[1] || ($[1] = (P) => c.value = void 0)
          }),
          s(a(q), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: I(() => [
          t("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Te(X, ["prevent"])
          }, [
            t("div", Ps, [
              t("label", {
                class: "mail-field-label",
                for: a(z)
              }, "Alternative text", 8, Ds),
              s(a(ue), {
                id: a(z),
                modelValue: A.value,
                "onUpdate:modelValue": $[0] || ($[0] = (P) => A.value = P),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              $[7] || ($[7] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"]),
      s(a(Se), {
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
          t("span", qs, [
            s(a(O), {
              icon: h.value === "part" ? a(fe).part : a(fe).asset,
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          t("span", Bs, [
            t("span", Hs, b(h.value === "part" ? "Insert a part" : "Insert an image"), 1),
            $[8] || ($[8] = t("span", { class: "kx-modal-head-sub" }, "Search the library, then insert at the cursor.", -1))
          ])
        ]),
        footer: I(() => [
          s(a(q), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: $[4] || ($[4] = (P) => h.value = void 0)
          }),
          s(a(q), {
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
}), Js = ["disabled", "inert"], Ws = { class: "mail-form" }, Ks = { class: "mail-field" }, Ys = ["for"], Gs = { class: "mail-field" }, Zs = ["for"], Qs = { class: "mail-field-hint" }, Xs = { class: "mail-mono" }, ei = { class: "mail-field" }, ai = ["for"], li = { class: "mail-base-row" }, ti = ["id"], si = { class: "mail-code-frame mail-code-subject" }, ii = { class: "mail-face-bar" }, ni = { class: "mail-code-frame mail-code-body" }, oi = /* @__PURE__ */ ie({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const u = da(() => import("./CodeEditor-CCN_mhSU.js")), n = e, { go: d } = be(), f = { base: ve(), title: ve(), description: ve(), face: ve() }, r = y("html"), x = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], v = y(), _ = y();
    function T(C) {
      v.value?.insert(C);
    }
    const o = B(() => {
      const C = n.problem;
      if (C)
        return C.face === "html" || C.face === "text" || C.face === "subject" ? C.face : r.value;
    }), h = B(() => (n.draft.kind === "message" ? "Body" : "Source") + (r.value === "html" ? ", HTML" : ", plain text"));
    return (C, g) => (l(), i("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s(Ha, { label: "Name and description" }, {
        default: I(() => [
          t("div", Ws, [
            t("div", Ks, [
              t("label", {
                class: "mail-field-label",
                for: f.title
              }, "Name", 8, Ys),
              s(a(ue), {
                id: f.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": g[0] || (g[0] = (V) => e.draft.title = V)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Gs, [
              t("label", {
                class: "mail-field-label",
                for: f.description
              }, "Description", 8, Zs),
              s(a(ue), {
                id: f.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": g[1] || (g[1] = (V) => e.draft.description = V)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Qs, [
              g[9] || (g[9] = G("Reference ", -1)),
              t("span", Xs, b(e.draft.name), 1),
              G(", used to " + b(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), i(K, { key: 0 }, [
        t("div", ei, [
          t("label", {
            class: "mail-field-label",
            for: f.base
          }, "Base template", 8, ai),
          t("div", li, [
            s(Ye, {
              modelValue: e.draft.base,
              "onUpdate:modelValue": g[2] || (g[2] = (V) => e.draft.base = V),
              kind: "base",
              label: "Base template",
              "input-id": f.base,
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
        t("div", {
          class: re(["mail-field", { "mail-field-invalid": o.value === "subject" }])
        }, [
          t("span", {
            id: f.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, ti),
          t("div", si, [
            s(a(u), {
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
      t("div", {
        class: re(["mail-field", { "mail-field-invalid": e.problem && o.value !== "subject" }])
      }, [
        t("div", ii, [
          s(a(Ce), {
            modelValue: r.value,
            "onUpdate:modelValue": g[5] || (g[5] = (V) => r.value = V),
            options: x,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          s(a(q), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: g[6] || (g[6] = (V) => _.value?.toggle(V))
          }, {
            icon: I(() => [
              s(a(O), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", ni, [
          r.value === "html" ? (l(), D(a(u), {
            ref_key: "editor",
            ref: v,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": g[7] || (g[7] = (V) => e.draft.html = V),
            label: h.value
          }, null, 8, ["modelValue", "label"])) : (l(), D(a(u), {
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
      s(Fs, {
        ref_key: "inserter",
        ref: _,
        draft: e.draft,
        face: r.value,
        onInsert: T
      }, null, 8, ["draft", "face"])
    ], 8, Js));
  }
}), ri = { class: "mail-value-field" }, ui = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Oa = /* @__PURE__ */ ie({
  __name: "ValueField",
  props: /* @__PURE__ */ ua({
    type: {},
    itemType: {},
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: [null, Boolean, Number, String, Array, Object] },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ ua(["invalid"], ["update:modelValue"]),
  setup(e, { emit: u }) {
    const n = e, d = Da(e, "modelValue"), f = u, r = (p) => p === null || ["string", "number", "boolean"].includes(typeof p), x = (p) => p === void 0 || Array.isArray(p) && p.every(r), v = (p) => p === void 0 || !!p && typeof p == "object" && !Array.isArray(p) && Object.values(p).every((c) => typeof c == "string"), _ = y(!1);
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
    Q(V, (p) => f("invalid", p), { immediate: !0 });
    const k = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (p, c) => (l(), i("div", ri, [
      T.value === "string" ? (l(), D(a(ue), {
        key: 0,
        "model-value": typeof d.value == "string" ? d.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": c[0] || (c[0] = (A) => d.value = A || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "number" || T.value === "integer" ? (l(), D(a(Nl), {
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
          s(a(ue), {
            modelValue: A.key,
            "onUpdate:modelValue": [(Z) => A.key = Z, C],
            "aria-label": e.label + ", name " + (z + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(a(ue), {
            modelValue: A.value,
            "onUpdate:modelValue": [(Z) => A.value = Z, C],
            "aria-label": e.label + ", value " + (z + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(a(q), {
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
              s(a(O), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        s(a(q), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: c[4] || (c[4] = (A) => h.value.push({ key: "", value: "" }))
        }, {
          icon: I(() => [
            s(a(O), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), i(K, { key: 5 }, [
        s(a(va), {
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
        V.value ? (l(), i("small", ui, b(V.value), 1)) : S("", !0)
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
}), di = ["disabled", "inert"], ci = { class: "mail-sr-only" }, vi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, mi = {
  key: 1,
  class: "mail-muted"
}, fi = ["aria-label"], bi = { class: "mail-variable-grid" }, yi = { class: "mail-field" }, pi = { class: "mail-field" }, hi = { class: "mail-field" }, gi = ["id"], ki = { class: "mail-variable-check" }, $i = { class: "mail-field" }, wi = { class: "mail-variable-values" }, _i = {
  key: 0,
  class: "mail-field"
}, xi = { class: "mail-field" }, Ci = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Vi = /* @__PURE__ */ ie({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: u }) {
    const n = e, d = u, f = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let r = 0;
    function x(V) {
      const U = new Set(V.schema.required ?? []);
      return Object.entries(V.schema.properties).map(([k, p]) => {
        const c = p.items;
        return {
          id: r++,
          name: k,
          schema: p,
          title: typeof p.title == "string" ? p.title : "",
          type: f.some((A) => A.value === p.type) ? p.type : "string",
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
        id: r++,
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
    const C = B(() => n.draft.kind === "part"), g = B(() => n.problem && (n.problem.face === "variables" || n.problem.face === "samples") ? `${ct[n.problem.face]}: ${n.problem.engine ?? n.problem.message}` : "");
    return (V, U) => (l(), i("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t("legend", ci, b(e.label), 1),
      g.value ? (l(), i("p", vi, b(g.value), 1)) : S("", !0),
      v.value.length ? (l(), i("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), i(K, null, me(v.value, (k, p) => (l(), i("li", {
          key: k.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": o.value[p] }])
        }, [
          t("div", bi, [
            t("label", yi, [
              U[0] || (U[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              s(a(ue), {
                modelValue: k.name,
                "onUpdate:modelValue": (c) => k.name = c,
                class: "mail-mono-input",
                invalid: !!o.value[p] && !k.valueErrors.sample && !k.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", pi, [
              U[1] || (U[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              s(a(ue), {
                modelValue: k.title,
                "onUpdate:modelValue": (c) => k.title = c,
                placeholder: k.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", hi, [
              t("span", {
                id: "type-" + k.id,
                class: "mail-field-label"
              }, "Type", 8, gi),
              s(a(wa), {
                "model-value": k.type,
                options: f,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + k.id,
                "onUpdate:modelValue": (c) => T(k, c)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", ki, [
              s(a(El), {
                modelValue: k.required,
                "onUpdate:modelValue": (c) => k.required = c,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              U[2] || (U[2] = t("span", null, "Required", -1))
            ]),
            s(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + k.name,
              title: "Remove " + k.name,
              onClick: (c) => v.value.splice(p, 1)
            }, {
              icon: I(() => [
                s(a(O), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", $i, [
            U[3] || (U[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            s(a(ue), {
              modelValue: k.description,
              "onUpdate:modelValue": (c) => k.description = c,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", wi, [
            C.value ? (l(), i("div", _i, [
              U[4] || (U[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              s(Oa, {
                modelValue: k.fallback,
                "onUpdate:modelValue": (c) => k.fallback = c,
                type: k.type,
                "item-type": k.itemType,
                label: "Default of " + k.name,
                onInvalid: (c) => k.valueErrors.fallback = c
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : S("", !0),
            t("div", xi, [
              U[5] || (U[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              s(Oa, {
                modelValue: k.sample,
                "onUpdate:modelValue": (c) => k.sample = c,
                type: k.type,
                "item-type": k.itemType,
                label: "Sample value of " + k.name,
                onInvalid: (c) => k.valueErrors.sample = c
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          o.value[p] ? (l(), i("small", Ci, b(k.name) + ": " + b(o.value[p]), 1)) : S("", !0)
        ], 2))), 128))
      ], 8, fi)) : (l(), i("p", mi, b(e.draft.title) + " takes no " + b(e.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        s(a(q), {
          label: C.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: h
        }, {
          icon: I(() => [
            s(a(O), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, di));
  }
}), Si = { class: "kx-modal-head-icon" }, Ti = {
  key: 0,
  class: "kx-modal-head-text"
}, Ri = { class: "kx-modal-head-title" }, Ui = {
  key: 0,
  class: "kx-modal-head-sub"
}, Ai = {
  key: 1,
  class: "kx-modal-head-sub"
}, Li = {
  key: 0,
  class: "mail-form"
}, ji = { class: "mail-face-bar" }, Ii = {
  key: 0,
  class: "mail-version-subject"
}, Ei = { class: "mail-mono-block" }, Ni = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Mi = /* @__PURE__ */ ie({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean },
    included: { type: Boolean }
  },
  emits: ["close", "restore", "reset"],
  setup(e, { emit: u }) {
    const n = da(() => import("./CodeEditor-CCN_mhSU.js")), d = da(() => import("./DiffView-CWHbdsJf.js")), f = e, r = u;
    $e(() => !!f.revision);
    const x = y("version"), v = y("html");
    Q(() => f.revision, (U) => {
      U && (x.value = f.compare ? "compare" : "version", v.value = "html");
    });
    const _ = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], T = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], o = B(() => !f.included && f.revision?.version === f.current.revision), h = B(() => {
      const U = f.revision;
      return U ? f.included || U.state === "original" && U.action === "reset" ? `${f.current.title}: the version included with ${f.current.origin_label}` : `${f.current.title}, version ${U.version}` : "";
    }), C = B(() => f.revision ? v.value === "html" ? f.revision.content.html : f.revision.content.text : ""), g = B(() => v.value === "html" ? f.current.html : f.current.text), V = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
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
        p || r("close");
      })
    }, {
      header: I(() => [
        t("span", Si, [
          s(a(O), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), i("span", Ti, [
          t("span", Ri, b(h.value), 1),
          e.included ? (l(), i("span", Ui, "Compare it with your customized version, or reset to it.")) : (l(), i("span", Ai, b(a(ha)[e.revision.action]) + " by " + b(a(Ve)(e.revision.author_label, e.revision.author)) + " · " + b(a(Ke)(e.revision.created_at)), 1))
        ])) : S("", !0)
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: k[2] || (k[2] = (p) => r("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), D(a(q), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: k[3] || (k[3] = (p) => r("reset"))
        }, {
          icon: I(() => [
            s(a(O), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !o.value ? (l(), D(a(q), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: k[4] || (k[4] = (p) => r("restore", e.revision))
        }, {
          icon: I(() => [
            s(a(O), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : S("", !0)
      ]),
      default: I(() => [
        e.revision ? (l(), i("div", Li, [
          t("div", ji, [
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
            s(a(Ce), {
              modelValue: v.value,
              "onUpdate:modelValue": k[1] || (k[1] = (p) => v.value = p),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && x.value === "version" ? (l(), i("p", Ii, [
            k[6] || (k[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            k[7] || (k[7] = G()),
            t("span", Ei, b(e.revision.content.subject), 1)
          ])) : S("", !0),
          x.value === "version" ? (l(), i("div", Ni, [
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
}), zi = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Oi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Pi = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Di = {
  key: 3,
  class: "mail-history"
}, qi = { class: "mail-history-head" }, Bi = { class: "mail-history-main" }, Hi = { class: "mail-history-title" }, Fi = { class: "mail-sub" }, Ji = {
  key: 0,
  class: "mail-history-note"
}, Wi = {
  key: 0,
  class: "mail-history-actions"
}, Ki = {
  key: 4,
  class: "mail-more"
}, Yi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Gi = /* @__PURE__ */ ie({
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
    return (u, n) => (l(), i(K, null, [
      e.error ? (l(), i("div", zi, [
        t("span", null, b(e.error), 1),
        s(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: n[0] || (n[0] = (d) => u.$emit("retry"))
        })
      ])) : e.loading && !e.revisions.length ? (l(), i("p", Oi, [
        s(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        n[2] || (n[2] = G("Loading history…", -1))
      ])) : e.revisions.length ? (l(), i("ol", Di, [
        (l(!0), i(K, null, me(e.revisions, (d) => (l(), i("li", {
          key: d.seq,
          class: "mail-history-row"
        }, [
          t("div", qi, [
            t("div", Bi, [
              t("span", Hi, [
                G(" Version " + b(d.version) + " · " + b(a(ha)[d.action]) + b(d.restored_from ? " from version " + d.restored_from : "") + " ", 1),
                d.version === e.resource.revision ? (l(), D(a(Ae), {
                  key: 0,
                  severity: "success",
                  value: "Current",
                  class: "kx-tag-sm"
                })) : S("", !0)
              ]),
              t("span", Fi, b(a(Ve)(d.author_label, d.author)) + " · " + b(a(Ke)(d.created_at)), 1),
              d.note ? (l(), i("span", Ji, b(d.note), 1)) : S("", !0)
            ]),
            a(Fa)(d) ? (l(), i("div", Wi, [
              s(a(q), {
                label: "Show this version",
                disabled: e.busy !== void 0,
                severity: "secondary",
                text: "",
                size: "small",
                onClick: (f) => u.$emit("show", d)
              }, {
                icon: I(() => [
                  s(a(O), {
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
                onClick: (f) => u.$emit("restore", d)
              }, {
                icon: I(() => [
                  s(a(O), {
                    icon: "tabler:restore",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
            ])) : S("", !0)
          ])
        ]))), 128))
      ])) : (l(), i("p", Pi, b(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1)),
      e.more && e.revisions.length ? (l(), i("div", Ki, [
        e.moreError ? (l(), i("span", Yi, b(e.moreError), 1)) : S("", !0),
        s(a(q), {
          label: e.moreError ? "Retry" : "Show older versions",
          severity: "secondary",
          outlined: "",
          loading: e.loading,
          onClick: n[1] || (n[1] = (d) => u.$emit("more"))
        }, null, 8, ["label", "loading"])
      ])) : S("", !0)
    ], 64));
  }
});
function Zi(e, u, n, d) {
  const f = d?.used_by?.messages?.length ?? 0, r = d?.used_by?.recent_senders?.find((_) => _.origin);
  return {
    content: {
      message: { title: "Message", description: "What recipients read." + (r?.origin ? ` Sent recently by “${ia(r.origin)}”.` : "") },
      base: { title: "Layout", description: f ? `The frame around the ${ye(f, "message")} that ${f === 1 ? "uses" : "use"} ${n}.` : `The frame around messages that use ${n}.` },
      part: { title: "Content", description: `Shown wherever ${n} is included.` }
    }[e],
    variables: e === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${n} where it is included, with their defaults.` },
    "used-by": {
      title: "Used by",
      description: e === "message" ? `Who sends ${n}.` : e === "base" ? `Messages that use ${n}.` : `Templates that include ${n}.`
    },
    history: { title: "History", description: `Every saved version of ${n}, newest first.` }
  }[u];
}
function Qi(e) {
  return e?.state !== "customized" ? "" : `Customized by ${Ve(e.author_label, e.author)} ${Sl(e.updated_at)} from the version included with ${e.origin_label}.`;
}
function Xi(e) {
  if (!e?.original) return;
  const { kind: u, name: n, title: d, description: f } = e;
  return {
    kind: u,
    name: n,
    seq: 0,
    version: 0,
    action: "reset",
    state: "original",
    author: "",
    created_at: 0,
    content: { kind: u, name: n, title: d, description: f, ...e.original }
  };
}
function en(e) {
  const u = he([]), n = y(!1), d = y(""), f = y(""), r = y(), x = we();
  async function v() {
    const T = x();
    n.value = !0;
    try {
      const o = await le.history(e.value);
      if (!T()) return;
      u.value = o.items, r.value = o.next_cursor, d.value = f.value = "";
    } catch (o) {
      if (!T()) return;
      d.value = na(o) ? "" : se(o, "History could not be loaded.");
    } finally {
      T() && (n.value = !1);
    }
  }
  async function _() {
    const T = r.value;
    if (!T || n.value) return;
    const o = x();
    n.value = !0;
    try {
      const h = await le.history(e.value, T);
      if (!o()) return;
      const C = new Set(u.value.map((g) => g.seq));
      u.value = [...u.value, ...h.items.filter((g) => !C.has(g.seq))], r.value = h.next_cursor, f.value = "";
    } catch (h) {
      o() && (f.value = se(h, "Older versions could not be loaded."));
    } finally {
      o() && (n.value = !1);
    }
  }
  return { revisions: u, historyLoading: n, historyError: d, historyMoreError: f, historyCursor: r, loadHistory: v, loadOlderHistory: _ };
}
const an = { class: "kx-modal-head-icon mail-head-warn" }, ln = { class: "kx-modal-head-text" }, tn = { class: "kx-modal-head-title" }, sn = { class: "mail-dialog-text" }, nn = {
  key: 0,
  class: "mail-list"
}, tl = /* @__PURE__ */ ie({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: u }) {
    const n = e;
    $e(() => !!n.refusal);
    const d = u, f = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(x) {
      d("close"), x();
    }
    return (x, v) => (l(), D(a(Se), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: f,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": v[1] || (v[1] = (_) => {
        _ || d("close");
      })
    }, {
      header: I(() => [
        t("span", an, [
          s(a(O), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", ln, [
          t("span", tn, b(e.refusal?.header), 1)
        ])
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Close",
          autofocus: "",
          onClick: v[0] || (v[0] = (_) => d("close"))
        })
      ]),
      default: I(() => [
        t("p", sn, b(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), i("ul", nn, [
          (l(!0), i(K, null, me(e.refusal.links, (_) => (l(), i("li", {
            key: _.label
          }, [
            s(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (T) => r(_.open)
            }, {
              default: I(() => [
                s(a(O), {
                  icon: _.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, b(_.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), on = { class: "mail-stack" }, rn = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, un = {
  key: 0,
  class: "mail-muted"
}, dn = {
  key: 1,
  class: "mail-list"
}, cn = { key: 1 }, vn = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, mn = { class: "mail-group-head" }, fn = {
  key: 0,
  class: "mail-muted"
}, bn = {
  key: 1,
  class: "mail-list"
}, yn = { class: "mail-list-main" }, pn = {
  key: 0,
  class: "mail-sub"
}, hn = { class: "mail-muted" }, gn = /* @__PURE__ */ ie({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const u = e, { library: n, go: d, capabilities: f } = be(), r = B(() => (u.resource.used_by?.messages ?? []).map((v) => ({
      name: v,
      title: n.title("message", v)
    }))), x = B(() => u.resource.used_by?.recent_senders ?? []);
    return (v, _) => (l(), i("div", on, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), i("section", rn, [
        _[1] || (_[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), i("ul", dn, [
          (l(!0), i(K, null, me(r.value, (T) => (l(), i("li", {
            key: T.name
          }, [
            s(a(q), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (o) => a(d)({ name: "resource", kind: "message", resource: T.name, section: "content" })
            }, {
              default: I(() => [
                s(a(O), {
                  icon: a(fe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                T.title === void 0 ? (l(), D(a(Me), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), i("span", cn, b(T.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), i("p", un, "No messages " + b(e.resource.kind === "asset" ? "show" : "use") + " " + b(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), i("section", vn, [
        t("div", mn, [
          _[2] || (_[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(f)?.administer_delivery ? (l(), D(a(q), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: _[0] || (_[0] = (T) => a(d)({ name: "activity", template: e.resource.name }))
          })) : S("", !0)
        ]),
        x.value.length ? (l(), i("ul", bn, [
          (l(!0), i(K, null, me(x.value, (T) => (l(), i("li", {
            key: T.sender + (T.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            s(a(O), {
              icon: T.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", yn, [
              t("span", null, b(a(Ve)(T.sender_label, T.sender)), 1),
              T.origin ? (l(), i("span", pn, b(a(ia)(T.origin)), 1)) : S("", !0)
            ]),
            t("span", hn, b(a(ye)(T.count, "message")), 1)
          ]))), 128))
        ])) : (l(), i("p", fn, "Nobody has sent " + b(e.resource.title) + " recently.", 1))
      ])) : S("", !0)
    ]));
  }
}), kn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, $n = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, wn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, _n = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, xn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, Cn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, Vn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Sn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, Tn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, Rn = {
  key: 6,
  class: "kx-notice mail-customized"
}, Un = { class: "mail-customized-text" }, An = { class: "mail-editor-layout" }, Ln = /* @__PURE__ */ ie({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const u = e, { library: n, capabilities: d, delivery: f, go: r, create: x, setDirty: v, setTitle: _ } = be(), T = B(() => ({ kind: u.kind, name: u.name })), o = he(), h = y(), C = y(!0), g = y(!1), V = y(!1), U = y(""), k = y(), p = we(), c = B(() => !!h.value && !!o.value && !Kt(h.value, o.value));
    Q(c, (J) => v(J), { immediate: !0 }), ta(() => v(!1));
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
        g.value = na(Y), V.value = We(Y), U.value = g.value || V.value ? "" : se(Y, "This resource could not be loaded."), g.value && (o.value = void 0, h.value = void 0);
      } finally {
        F() && (C.value = !1);
      }
    }
    const z = y(), { revisions: Z, historyLoading: X, historyError: ee, historyMoreError: H, historyCursor: j, loadHistory: $, loadOlderHistory: P } = en(T);
    async function w() {
      await Promise.all([A({ keepDraft: !0 }), $()]);
    }
    Fe(w), Le("mail.library", () => {
      w();
    });
    const m = y(), L = y(""), ae = y(!1), N = y(""), E = y(), R = B(() => o.value?.title ?? u.name), M = B(() => Zi(u.kind, u.section, R.value, o.value)), W = B(() => Qi(o.value)), te = B(() => Xi(o.value)), _e = y(), ge = y(), de = y(!1), Re = B(() => ge.value ?? _e.value);
    Q(() => JSON.stringify(h.value), () => {
      ge.value = void 0;
    });
    const nl = B(() => !!Re.value || de.value || !!k.value), Sa = B(() => k.value ? "Discard your changes to load the newer version first." : de.value ? "Fix the variables first." : Re.value ? "Fix the error first." : ""), Ta = y(!1);
    function oa(J, F) {
      Ta.value = ["invalid_config", "from_name_invalid"].includes(ke(J) ?? ""), ae.value = ["mail_revision_conflict", "mail_preview_stale"].includes(ke(J) ?? ""), ae.value && w(), L.value = se(J, F);
    }
    function Ra() {
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
      if (!(!F || !Y || m.value !== void 0)) {
        m.value = "save", Ge.value = L.value = N.value = "", Ze.value = void 0;
        try {
          const ne = z.value, oe = ne && JSON.stringify(Y) === JSON.stringify({ ...xe(ne.content), kind: F.kind, name: F.name }), Ue = oe ? await le.restore(T.value, ne.seq, F.revision, J || void 0) : await le.update(Y, F.revision, J || void 0);
          o.value = { ...F, ...Ue }, h.value = xe(o.value), je.value = !1, N.value = oe ? `Version ${ne.version} from ${Ke(ne.created_at)} is now in effect.` : `Saved ${Ue.title}.${u.kind === "message" ? "" : " Every message that uses it has the change."}`, z.value = void 0, await w();
        } catch (ne) {
          const oe = He(ne), Ue = oe?.resource?.kind === Y.kind && oe.resource.name === Y.name;
          oe?.dependents?.length && !Ue ? Ze.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (ge.value = oe, je.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes(ke(ne) ?? "") ? (je.value = !1, await A({ keepDraft: !0 })) : Ge.value = se(ne, `${Y.title} could not be saved.`);
        } finally {
          m.value = void 0;
        }
      }
    }
    async function ul() {
      const J = o.value;
      if (!(!J || m.value !== void 0)) {
        m.value = "test", L.value = N.value = "";
        try {
          await le.sendTest(J.name), N.value = d.value?.administer_delivery ? "The test is queued for delivery to you with the sample values. Activity shows when it is delivered." : "The test is queued for delivery to you with the sample values.";
        } catch (F) {
          oa(F, "The test could not be sent.");
        } finally {
          m.value = void 0;
        }
      }
    }
    const Qe = B(() => c.value ? "Save your changes to send a test." : d.value?.send ? f.value && !f.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Ua() {
      const J = o.value;
      if (!(!J || m.value !== void 0 || !await qe.confirm({
        header: `Reset ${J.title} to the original?`,
        message: `Your changes are replaced by the version included with ${J.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        m.value = "reset", L.value = N.value = "", ae.value = !1;
        try {
          o.value = await le.reset(T.value, J.revision), h.value = xe(o.value), N.value = `${J.title} is back to the original. Your changes are in History.`, await w();
        } catch (Y) {
          oa(Y, `${J.title} could not be reset.`);
        } finally {
          m.value = void 0;
        }
      }
    }
    const ze = y(), Aa = y(!1), La = y(!1);
    function ja(J, F = !1, Y = !1) {
      Aa.value = F, La.value = Y, ze.value = J;
    }
    async function Ia(J) {
      const F = T.value;
      m.value = J.seq, L.value = "";
      try {
        const Y = await le.revision(F, J.seq);
        if (T.value.kind === F.kind && T.value.name === F.name) return Y;
      } catch (Y) {
        T.value.kind === F.kind && T.value.name === F.name && (L.value = se(Y, "This version could not be loaded."));
      } finally {
        m.value === J.seq && (m.value = void 0);
      }
    }
    async function dl(J) {
      const F = await Ia(J);
      F && ja(F);
    }
    async function Ea(J) {
      const F = o.value;
      if (!F || m.value !== void 0 || c.value && !await qe.confirm({
        header: `Replace your unsaved changes with version ${J.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      const Y = "content" in J ? J : await Ia(J);
      if (!Y) return;
      h.value = { ...xe(Y.content), kind: F.kind, name: F.name }, z.value = Y, ze.value = void 0, L.value = "";
      const ne = `Version ${Y.version} is loaded as your draft. Review and save to restore it.`;
      u.section === "content" ? N.value = ne : (ra = ne, r({ name: "resource", kind: u.kind, resource: u.name, section: "content" }));
    }
    function Na(J, F, Y) {
      const ne = J.kind === "base" ? "use" : "include";
      E.value = {
        header: `${J.title} is in use`,
        get message() {
          const oe = F.map((Ue) => n.title("message", Ue) ?? Ue);
          return `${ye(F.length, "message")} ${F.length === 1 ? ne + "s" : ne} it: ${oe.join(", ")}. Remove it from ${F.length === 1 ? "that message" : "them"} first.`;
        },
        links: F.map((oe) => ({ get label() {
          return n.title("message", oe) ?? oe;
        }, open: () => r({ name: "resource", kind: "message", resource: oe, section: "content" }) }))
      };
    }
    async function cl() {
      const J = o.value;
      if (!J || J.state !== "created" || m.value !== void 0) return;
      const F = J.used_by?.messages ?? [];
      if (J.kind === "base" && F.length) {
        Na(J, F);
        return;
      }
      if (await qe.confirm({
        header: `Delete ${J.title}?`,
        message: J.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${pe[J.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        m.value = "delete", L.value = N.value = "";
        try {
          await le.remove(T.value, J.revision), v(!1), r({ name: "library", section: fa(u.kind) });
        } catch (ne) {
          const oe = He(ne);
          oe?.dependents?.length ? Na(J, oe.dependents) : oa(ne, `${J.title} could not be deleted.`);
        } finally {
          m.value = void 0;
        }
      }
    }
    function vl() {
      const J = o.value;
      J && x({ kind: u.kind, from: { kind: J.kind, name: J.name } });
    }
    const ml = B(() => u.kind === "base" ? o.value?.used_by?.messages : void 0), Xe = B(() => m.value === "save");
    A(), Q(() => u.section, (J) => {
      J === "history" && !Z.value.length && $();
    }, { immediate: !0 });
    let ra = "";
    return Q(() => u.section, () => {
      N.value = ra, ra = "", L.value = "";
    }), (J, F) => (l(), i(K, null, [
      g.value ? (l(), D(_a, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(pa)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: F[0] || (F[0] = (Y) => a(r)({ name: "library", section: a(fa)(e.kind) }))
      }, null, 8, ["cta"])) : V.value ? (l(), i("p", kn, [
        s(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        F[11] || (F[11] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), i(K, { key: 2 }, [
        s(Je, {
          title: M.value.title,
          description: M.value.description
        }, ya({ _: 2 }, [
          o.value ? {
            name: "actions",
            fn: I(() => [
              c.value ? (l(), D(Jt, {
                key: 0,
                busy: Xe.value,
                "review-disabled": nl.value,
                onDiscard: Ra,
                onReview: ol
              }, null, 8, ["busy", "review-disabled"])) : (l(), i(K, { key: 1 }, [
                e.kind === "message" ? (l(), D(a(q), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: m.value === "test",
                  disabled: !!Qe.value || m.value !== void 0,
                  title: Qe.value || void 0,
                  onClick: ul
                }, {
                  icon: I(() => [
                    s(a(O), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : S("", !0),
                s(a(q), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: m.value !== void 0,
                  onClick: vl
                }, {
                  icon: I(() => [
                    s(a(O), {
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
                  loading: m.value === "delete",
                  disabled: m.value !== void 0,
                  onClick: cl
                }, {
                  icon: I(() => [
                    s(a(O), {
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
        U.value ? (l(), i("div", $n, [
          t("span", null, b(U.value), 1),
          s(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: F[1] || (F[1] = (Y) => w())
          })
        ])) : C.value ? (l(), i("p", wn, [
          s(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          G("Loading " + b(R.value) + "…", 1)
        ])) : S("", !0),
        o.value && h.value ? (l(), i(K, { key: 2 }, [
          k.value ? (l(), i("p", _n, [
            s(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              G(b(k.value.by) + " saved " + b(o.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              s(a(q), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Ra
              })
            ])
          ])) : S("", !0),
          c.value && Sa.value && !k.value ? (l(), i("p", xn, b(Sa.value), 1)) : e.kind === "message" && !c.value && Qe.value ? (l(), i("p", Cn, [
            G(b(Qe.value) + " ", 1),
            a(d)?.administer_delivery && a(f) && !a(f).configured ? (l(), D(a(q), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: F[2] || (F[2] = (Y) => a(ca)(Y.currentTarget, "/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          L.value && ae.value ? (l(), i("p", Vn, [
            s(a(O), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            G(b(L.value), 1)
          ])) : L.value ? (l(), i("p", Sn, [
            t("span", null, b(L.value), 1),
            Ta.value && a(d)?.administer_delivery ? (l(), D(a(q), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: F[3] || (F[3] = (Y) => a(ca)(Y.currentTarget, "/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          N.value ? (l(), i("p", Tn, [
            s(a(O), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            G(b(N.value), 1)
          ])) : S("", !0),
          W.value && e.section === "content" ? (l(), i("div", Rn, [
            s(a(O), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", Un, [
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
              onClick: F[4] || (F[4] = (Y) => ja(te.value, !0, !0))
            }, {
              icon: I(() => [
                s(a(O), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            s(a(q), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: m.value === "reset",
              disabled: m.value !== void 0 || c.value,
              onClick: Ua
            }, {
              icon: I(() => [
                s(a(O), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : S("", !0),
          $l(t("div", An, [
            s(oi, {
              draft: h.value,
              problem: Re.value,
              disabled: Xe.value
            }, null, 8, ["draft", "problem", "disabled"]),
            s(_s, {
              draft: h.value,
              messages: ml.value,
              onProblem: F[5] || (F[5] = (Y) => _e.value = Y)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [wl, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), D(Vi, {
            key: 7,
            draft: h.value,
            label: M.value.title,
            problem: Re.value,
            disabled: Xe.value,
            onInvalid: F[6] || (F[6] = (Y) => de.value = Y)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), D(gn, {
            key: 8,
            resource: o.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), D(Gi, {
            key: 9,
            resource: o.value,
            revisions: a(Z),
            loading: a(X),
            error: a(ee),
            busy: typeof m.value == "number" ? m.value : m.value ? -1 : void 0,
            more: !!a(j),
            "more-error": a(H),
            onShow: dl,
            onRestore: Ea,
            onRetry: a($),
            onMore: a(P)
          }, null, 8, ["resource", "revisions", "loading", "error", "busy", "more", "more-error", "onRetry", "onMore"])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      o.value && h.value ? (l(), D(Es, {
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
      o.value ? (l(), D(Mi, {
        key: 4,
        revision: ze.value,
        current: o.value,
        compare: Aa.value,
        included: La.value,
        busy: typeof m.value == "number" || m.value === "reset",
        onClose: F[8] || (F[8] = (Y) => ze.value = void 0),
        onRestore: Ea,
        onReset: F[9] || (F[9] = (Y) => {
          ze.value = void 0, Ua();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : S("", !0),
      s(tl, {
        refusal: E.value,
        onClose: F[10] || (F[10] = (Y) => E.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), ea = /* @__PURE__ */ new Map();
function jn(e, u) {
  const n = ea.get(e);
  if (n && n.revision >= u) return n.url;
  const d = Promise.resolve(xl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((f) => f.data instanceof Blob ? URL.createObjectURL(f.data) : void 0, () => {
    ea.get(e)?.url === d && ea.delete(e);
  });
  return ea.set(e, { revision: u, url: d }), n && n.url.then((f) => {
    f && URL.revokeObjectURL(f);
  }), d;
}
const In = ["src", "alt"], En = {
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
    const u = e, n = y();
    Q(() => [u.name, u.revision], async ([f, r]) => {
      n.value = void 0, n.value = await jn(f, r);
    }, { immediate: !0 });
    const d = B(() => u.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (f, r) => (l(), i("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      n.value ? (l(), i("img", {
        key: 0,
        src: n.value,
        alt: e.alt ?? ""
      }, null, 8, In)) : (l(), i(K, { key: 1 }, [
        s(a(O), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        d.value ? (l(), i("span", En, b(d.value), 1)) : S("", !0)
      ], 64))
    ], 2));
  }
});
function Pe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Nn(e, u) {
  return e;
}
function Mn(e, u, n) {
  if (u !== void 0 && !u) return null;
  const d = Pe(e) ? e : {}, f = [
    d,
    Pe(d.data) ? d.data : null,
    Pe(d.payload) ? d.payload : null,
    Pe(d.detail) ? d.detail : null
  ].filter(Boolean);
  for (const r of f) {
    if (r.event !== "component.meta.changed" && r.event !== "component.deleting" && r.event !== "component.deleted") continue;
    const x = String(r.component_id || ""), v = String(d.topic || r.topic || "");
    if (u === void 0) {
      if (!x && (!v.startsWith("component.") || v === "component.")) continue;
    } else if (x && x !== u || !x && v !== `component.${u}`) continue;
    const _ = x || u || v.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: _, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: _ } : {
      event: "component.meta.changed",
      component_id: _,
      meta: Nn(Pe(r.meta) ? r.meta : {}),
      deleted: Array.isArray(r.deleted) ? r.deleted.map(String) : []
    };
  }
  return null;
}
function zn(e, u, n) {
  const d = Mn(e, u);
  return d?.event === "component.meta.changed" ? d : null;
}
function On(e, u, n) {
  if (!e) return null;
  const d = Cl(`component.${e}`, (f) => {
    const r = zn(f, e);
    r && u(r);
  });
  return typeof d == "function" ? d : null;
}
class aa extends Error {
}
function Pn(e, u) {
  return new Promise((n, d) => {
    let f = null, r = !1, x = !1, v = !1;
    const _ = (h) => {
      v || (v = !0, f?.(), u.removeEventListener("abort", T), h ? d(h) : n());
    }, T = () => _(new aa("cancelled"));
    if (u.aborted) {
      T();
      return;
    }
    u.addEventListener("abort", T);
    async function o() {
      if (!v) {
        if (r) {
          x = !0;
          return;
        }
        r = !0;
        try {
          const h = await Ja.state(e);
          h.status === "completed" ? _() : h.status === "error" ? _(new aa(h.error ?? "")) : f || (f = On(h.component_id, () => {
            o();
          }), f ? x = !0 : _(new aa("")));
        } catch (h) {
          _(h);
        } finally {
          r = !1, x && !v && (x = !1, o());
        }
      }
    }
    o();
  });
}
const Dn = { class: "kx-modal-head-icon" }, qn = { class: "kx-modal-head-text" }, Bn = { class: "kx-modal-head-title" }, Hn = { class: "kx-modal-head-sub" }, Fn = ["disabled", "inert"], Jn = ["for"], Wn = { class: "mail-muted" }, Kn = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Yn = {
  key: 0,
  class: "mail-field"
}, Gn = ["for"], Zn = ["for"], Qn = ["id"], Xn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, eo = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, ao = 1024 * 1024, il = /* @__PURE__ */ ie({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, go: r } = be(), x = { file: ve(), title: ve(), name: ve() };
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
      !n.replace && !h.value && (o.value = Wa(H));
    });
    function c(H) {
      const j = Array.isArray(H.files) ? H.files[0] : H.files;
      if (k.value = "", _.value = void 0, !!j) {
        if (!v.includes(j.type)) {
          k.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (j.size > ao) {
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
        const j = await Ja.add(_.value), $ = { name: o.value, upload_id: j, title: T.value.trim() }, P = () => n.replace ? le.replaceAsset($, n.replace.revision) : le.addAsset($);
        g.value = "save";
        let w;
        try {
          w = await P();
        } catch (m) {
          if (ke(m) !== "upload_still_processing") throw m;
          g.value = "process", await Pn(j, H.signal), g.value = "save", w = await P();
        }
        f.patch("asset", w.name, Xa(w)), d("done", w), d("close"), n.replace || r({ name: "library", section: "assets", asset: w.name });
      } catch (j) {
        if (H.signal.aborted) return;
        j instanceof aa ? U.value = "The image could not be processed. Try another file, or upload it again." : ke(j) === "mail_revision_conflict" && !n.replace ? p.value = `An image named ${o.value} already exists. Choose another name or replace ${o.value}.` : ke(j) === "invalid_mail_resource" && !n.replace ? p.value = Ka : U.value = se(j, "The image could not be uploaded.");
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
        t("span", Dn, [
          s(a(O), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", qn, [
          t("span", Bn, b(X.value), 1),
          t("span", Hn, b(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: C.value && g.value !== "process",
          onClick: j[3] || (j[3] = ($) => d("close"))
        }, null, 8, ["disabled"]),
        s(a(q), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: C.value,
          disabled: !_.value || !e.replace && !T.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: I(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Te(z, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: C.value,
            inert: C.value || void 0
          }, [
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: x.file
              }, "Image", 8, Jn),
              s(a(Ml), {
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
                  s(a(O), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: I(() => [
                  t("span", Wn, b(_.value ? `${_.value.name} · ${a(sa)(_.value.size)}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              k.value ? (l(), i("small", Kn, b(k.value), 1)) : S("", !0)
            ], 2),
            e.replace ? S("", !0) : (l(), i("div", Yn, [
              t("label", {
                class: "mail-field-label",
                for: x.title
              }, "Name", 8, Gn),
              s(a(ue), {
                id: x.title,
                modelValue: T.value,
                "onUpdate:modelValue": j[0] || (j[0] = ($) => T.value = $)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? S("", !0) : (l(), i("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": p.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: x.name
              }, "Reference", 8, Zn),
              s(a(ue), {
                id: x.name,
                modelValue: o.value,
                "onUpdate:modelValue": j[1] || (j[1] = ($) => o.value = $),
                class: "mail-mono-input",
                invalid: !!p.value,
                "aria-describedby": x.name + "-hint",
                onInput: j[2] || (j[2] = ($) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: x.name + "-hint",
                class: re(p.value ? "mail-field-error" : "mail-field-hint")
              }, b(p.value || "Templates show it with this name. It cannot change later."), 11, Qn)
            ], 2))
          ], 8, Fn),
          Z.value ? (l(), i("p", Xn, [
            s(a(O), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            G(b(Z.value), 1)
          ])) : S("", !0),
          U.value ? (l(), i("p", eo, b(U.value), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), lo = { class: "mail-drawer-head" }, to = { class: "mail-drawer-title" }, so = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, io = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, no = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, oo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ro = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, uo = { class: "mail-asset-actions" }, co = { class: "mail-asset-hero" }, vo = { class: "mail-facts mail-card" }, mo = { class: "mail-reference" }, fo = { class: "mail-mono-block" }, bo = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, yo = {
  key: 0,
  class: "mail-muted"
}, po = { class: "mail-list" }, ho = { key: 1 }, go = {
  key: 0,
  class: "mail-asset-context"
}, ko = ["srcdoc", "title"], $o = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, wo = {
  key: 0,
  class: "mail-muted"
}, _o = {
  key: 1,
  class: "mail-history"
}, xo = { class: "mail-history-head" }, Co = { class: "mail-history-main" }, Vo = { class: "mail-history-title" }, So = { class: "mail-sub" }, To = {
  key: 2,
  class: "mail-more"
}, Ro = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Uo = /* @__PURE__ */ ie({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, go: r } = be();
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
        C.value = na(M), g.value = C.value ? "" : se(M, "This image could not be loaded.");
      } finally {
        R() && (h.value = !1);
      }
    }
    Q(() => n.name, () => {
      p.value = c.value = !1, U.value = V.value = "", $();
    }, { immediate: !0 }), Le("mail.library", () => {
      n.name && $();
    });
    const P = B(() => (v.value?.used_by?.messages ?? []).map((E) => ({ name: E, title: f.title("message", E) })));
    async function w() {
      if (v.value)
        try {
          await navigator.clipboard.writeText(window.location.href), c.value = !0;
        } catch {
          c.value = !1;
        }
    }
    const m = B(() => v.value ? ll(v.value.name) : "");
    async function L() {
      try {
        await navigator.clipboard.writeText(m.value), p.value = !0;
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
          links: P.value.map((te) => ({ label: te.title ?? te.name, open: () => r({ name: "resource", kind: "message", resource: te.name, section: "content" }) }))
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
                  return f.title(de.kind, de.name) ?? de.name;
                },
                icon: fe[de.kind],
                open: () => r(de.kind === "asset" ? { name: "library", section: "assets", asset: de.name } : { name: "resource", kind: de.kind, resource: de.name, section: "content" })
              }))
            };
          } else
            V.value = ke(te) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : se(te, "The image could not be changed."), ke(te) === "mail_revision_conflict" && $();
        } finally {
          k.value = void 0;
        }
      }
    }
    const N = B(() => T.value?.html ? Ca(T.value.html, T.value.inline_assets) : "");
    return (E, R) => (l(), i(K, null, [
      s(a(Za), {
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
          t("div", {
            ref_key: "drawer",
            ref: x,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", lo, [
              t("div", to, [
                v.value?.state === "customized" ? (l(), D(a(Ae), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : S("", !0),
                t("h2", null, b(v.value?.title ?? "Image"), 1)
              ]),
              s(a(q), {
                text: "",
                severity: "secondary",
                disabled: !v.value,
                "aria-label": c.value ? "Link copied" : "Copy link",
                title: c.value ? "Link copied" : "Copy link",
                onClick: w
              }, {
                icon: I(() => [
                  s(a(O), {
                    icon: c.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              s(a(q), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: k.value !== void 0,
                onClick: R[0] || (R[0] = (M) => d("close"))
              }, {
                icon: I(() => [
                  s(a(O), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            h.value && !v.value ? (l(), i("p", so, [
              s(a(O), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              R[9] || (R[9] = G("Loading image…", -1))
            ])) : C.value ? (l(), i("p", io, [
              s(a(O), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              R[10] || (R[10] = G("This image no longer exists. It was deleted while you were away.", -1))
            ])) : g.value ? (l(), i("div", no, [
              t("span", null, b(g.value), 1),
              s(a(q), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: R[1] || (R[1] = (M) => $())
              })
            ])) : S("", !0),
            v.value ? (l(), i(K, { key: 3 }, [
              V.value ? (l(), i("p", oo, [
                s(a(O), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                G(b(V.value), 1)
              ])) : S("", !0),
              U.value ? (l(), i("p", ro, [
                s(a(O), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                G(b(U.value), 1)
              ])) : S("", !0),
              t("div", uo, [
                s(a(q), {
                  label: "Replace",
                  disabled: k.value !== void 0,
                  onClick: R[2] || (R[2] = (M) => A.value = !0)
                }, {
                  icon: I(() => [
                    s(a(O), {
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
                    s(a(O), {
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
                    s(a(O), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0)
              ]),
              t("div", co, [
                s(sl, {
                  name: v.value.name,
                  revision: v.value.revision,
                  asset: v.value.asset,
                  large: "",
                  alt: v.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", vo, [
                R[11] || (R[11] = t("dt", null, "Reference", -1)),
                t("dd", mo, [
                  t("span", fo, b(m.value), 1),
                  s(a(q), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": p.value ? "Reference copied" : "Copy reference",
                    title: p.value ? "Reference copied" : "Copy reference",
                    onClick: L
                  }, {
                    icon: I(() => [
                      s(a(O), {
                        icon: p.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                R[12] || (R[12] = t("dt", null, "File", -1)),
                t("dd", null, b(v.value.asset?.filename) + " · " + b(a(sa)(v.value.asset?.size)), 1),
                R[13] || (R[13] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  s(Va, { resource: v.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", bo, [
                R[14] || (R[14] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                P.value.length ? (l(), i(K, { key: 1 }, [
                  t("ul", po, [
                    (l(!0), i(K, null, me(P.value, (M) => (l(), i("li", {
                      key: M.name
                    }, [
                      s(a(q), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (W) => a(r)({ name: "resource", kind: "message", resource: M.name, section: "content" })
                      }, {
                        default: I(() => [
                          s(a(O), {
                            icon: a(fe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          M.title === void 0 ? (l(), D(a(Me), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), i("span", ho, b(M.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  N.value ? (l(), i("div", go, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: N.value,
                      title: "How " + v.value.title + " looks in " + (a(f).title("message", o.value) ?? "")
                    }, null, 8, ko)
                  ])) : S("", !0)
                ], 64)) : (l(), i("p", yo, "No message shows " + b(v.value.title) + " with its sample values.", 1))
              ]),
              t("section", $o, [
                R[15] || (R[15] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                _.value.length ? (l(), i("ol", _o, [
                  (l(!0), i(K, null, me(_.value, (M) => (l(), i("li", {
                    key: M.seq,
                    class: "mail-history-row"
                  }, [
                    t("div", xo, [
                      t("div", Co, [
                        t("span", Vo, [
                          G("Version " + b(M.version) + " · " + b(a(ha)[M.action]) + " ", 1),
                          M.version === v.value.revision ? (l(), D(a(Ae), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : S("", !0)
                        ]),
                        t("span", So, b(a(Ve)(M.author_label, M.author)) + " · " + b(a(Ke)(M.created_at)), 1)
                      ]),
                      a(Fa)(M) && M.version !== v.value.revision ? (l(), D(a(q), {
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
                          s(a(O), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), i("p", wo, b(v.value.title) + " has not been replaced.", 1)),
                X.value ? (l(), i("div", To, [
                  H.value ? (l(), i("span", Ro, b(H.value), 1)) : S("", !0),
                  s(a(q), {
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
      s(tl, {
        refusal: z.value,
        onClose: R[8] || (R[8] = (M) => z.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ao = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Lo = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, jo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Io = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Eo = { class: "mail-toolbar" }, No = {
  class: "mail-count",
  role: "status"
}, Mo = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, zo = { class: "mail-sub" }, Oo = { class: "mail-mono-block" }, Po = { class: "mail-muted" }, Do = { class: "mail-muted" }, qo = {
  key: 2,
  class: "mail-more"
}, Bo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ho = /* @__PURE__ */ ie({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const u = e, { go: n, upload: d } = be(), f = y(""), r = y("");
    let x;
    Q(f, (H) => {
      clearTimeout(x), x = setTimeout(() => {
        r.value = H.trim();
      }, 250);
    });
    const v = he([]), _ = y(), T = y(), o = y(!0), h = y(!1), C = y(!1), g = y(!1), V = y(""), U = y(""), k = y(""), p = we();
    async function c(H = !1) {
      const j = p();
      o.value = !0;
      try {
        const $ = await le.page({ kind: "asset", q: r.value || void 0, limit: ma });
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
        const j = await le.page({ kind: "asset", q: r.value || void 0, limit: ma, cursor: _.value });
        if (!H()) return;
        const $ = new Set(v.value.map((P) => P.name));
        v.value = [...v.value, ...j.items.filter((P) => !$.has(P.name))], _.value = j.next_cursor, k.value = "";
      } catch (j) {
        H() && (k.value = se(j, "More images could not be loaded."));
      } finally {
        g.value = !1;
      }
    }
    Q(r, () => {
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
      return j ? sa(j.size) : "";
    }
    function ee(H) {
      n({ name: "library", section: "assets", asset: H.name });
    }
    return (H, j) => (l(), i(K, null, [
      s(Je, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: I(() => [
          s(a(q), {
            label: "Upload image",
            onClick: j[0] || (j[0] = ($) => a(d)())
          }, {
            icon: I(() => [
              s(a(O), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      C.value ? (l(), i("p", Ao, [
        s(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        j[7] || (j[7] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : V.value ? (l(), i("div", Lo, [
        t("span", null, b(V.value), 1),
        s(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: j[1] || (j[1] = ($) => c())
        })
      ])) : S("", !0),
      U.value ? (l(), i("div", jo, [
        t("span", null, b(U.value) + " The list shows what was loaded before.", 1),
        s(a(q), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: j[2] || (j[2] = ($) => c(!0))
        })
      ])) : o.value && !h.value ? (l(), i("p", Io, [
        s(a(O), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        j[8] || (j[8] = G("Loading images…", -1))
      ])) : h.value && !v.value.length && !r.value ? (l(), D(_a, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: j[3] || (j[3] = ($) => a(d)())
      })) : h.value ? (l(), i(K, { key: 5 }, [
        t("div", Eo, [
          s(a(ka), { class: "mail-search" }, {
            default: I(() => [
              s(a($a), null, {
                default: I(() => [
                  s(a(O), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ue), {
                modelValue: f.value,
                "onUpdate:modelValue": j[4] || (j[4] = ($) => f.value = $),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", No, b(Z.value), 1)
        ]),
        v.value.length ? (l(), D(a(ga), {
          key: 1,
          value: v.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: j[5] || (j[5] = ($) => ee($.data))
        }, {
          default: I(() => [
            s(a(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: I(({ data: $ }) => [
                s(sl, {
                  name: $.name,
                  revision: $.revision,
                  asset: $.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            s(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: I(({ data: $ }) => [
                s(a(q), {
                  link: "",
                  class: "mail-name",
                  label: $.title,
                  onClick: Te((P) => ee($), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", zo, [
                  t("span", Oo, b($.name), 1),
                  $.asset?.filename ? (l(), i(K, { key: 0 }, [
                    G(" · " + b($.asset.filename), 1)
                  ], 64)) : S("", !0)
                ])
              ]),
              _: 1
            }),
            s(a(ce), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: $ }) => [
                t("span", Po, b(X($)), 1)
              ]),
              _: 1
            }),
            s(a(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: I(({ data: $ }) => [
                t("span", null, b(z($)), 1)
              ]),
              _: 1
            }),
            s(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: I(({ data: $ }) => [
                s(Va, { resource: $ }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            s(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: I(({ data: $ }) => [
                t("span", Do, b($.state === "original" ? "—" : a(Ba)($.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), i("p", Mo, "Nothing matches. Try another name.")),
        _.value ? (l(), i("div", qo, [
          k.value ? (l(), i("span", Bo, b(k.value), 1)) : S("", !0),
          s(a(q), {
            label: k.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: g.value,
            disabled: o.value,
            onClick: A
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      s(Uo, {
        name: u.asset,
        onClose: j[6] || (j[6] = ($) => a(n)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), Fo = { class: "kx-modal-head-icon" }, Jo = { class: "kx-modal-head-text" }, Wo = { class: "kx-modal-head-title" }, Ko = { class: "kx-modal-head-sub" }, Yo = ["id"], Go = ["disabled", "inert"], Zo = {
  key: 0,
  class: "mail-field"
}, Qo = {
  key: 1,
  class: "mail-field"
}, Xo = ["for"], er = { class: "mail-field" }, ar = ["for"], lr = ["for"], tr = ["id"], sr = { class: "mail-field" }, ir = ["for"], nr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ee = "\0blank", or = /* @__PURE__ */ ie({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, go: r } = be(), x = y("message"), v = y(""), _ = y(""), T = y(""), o = y(""), h = y(!1), C = y(!1), g = y(""), V = y(""), U = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, k = ["message", "base", "part"].map(($) => ({ value: $, label: pe[$] })), p = B(() => !!n.intent.from), c = [{ value: Ee, label: "Blank" }], A = B(() => !!v.value);
    function z($) {
      if (v.value = $ ?? "", !$ || $ === Ee) return;
      const P = f.find(x.value, $);
      P && (o.value = P.description, n.intent.from && (_.value = `${P.title} copy`, h.value = !1));
    }
    Q(() => n.visible, async ($) => {
      if ($)
        if (x.value = n.intent.from?.kind ?? n.intent.kind ?? "message", _.value = T.value = o.value = v.value = "", g.value = V.value = "", h.value = !1, n.intent.from) {
          const P = n.intent.from;
          v.value = P.name;
          try {
            await f.search(P.kind, void 0, [P.name]);
          } catch (w) {
            g.value = se(w, "The resource to copy could not be read.");
          }
          n.visible && z(P.name);
        } else
          v.value = Ee;
    }, { immediate: !0 }), Q(x, () => {
      n.intent.from || (v.value = Ee, o.value = "");
    }), $e(() => n.visible), Q(_, ($) => {
      h.value || (T.value = Wa($));
    });
    const Z = B(() => x.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function X() {
      return V.value = "", T.value || (V.value = "Enter a reference."), !V.value;
    }
    async function ee() {
      if (!(C.value || !_.value.trim() || !A.value || !X())) {
        C.value = !0, g.value = "";
        try {
          const $ = v.value === Ee ? await le.create(Yt(x.value, T.value, _.value.trim(), o.value.trim())) : await le.copy({
            kind: x.value,
            name: T.value,
            title: _.value.trim(),
            description: o.value.trim(),
            from: { kind: x.value, name: v.value }
          });
          f.patch($.kind, $.name, Xa($)), d("close"), r({ name: "resource", kind: $.kind, resource: $.name, section: "content" });
        } catch ($) {
          ke($) === "mail_revision_conflict" ? V.value = `A ${pe[x.value].toLowerCase()} with this reference already exists. Choose another.` : ke($) === "invalid_mail_resource" ? V.value = Ka : g.value = se($, "The resource could not be created.");
        } finally {
          C.value = !1;
        }
      }
    }
    const H = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, j = B(() => n.intent.from ? `Duplicate ${f.title(n.intent.from.kind, n.intent.from.name) ?? ""}`.trim() : `New ${pe[x.value].toLowerCase()}`);
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
        t("span", Fo, [
          s(a(O), {
            icon: a(fe)[x.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Jo, [
          t("span", Wo, b(j.value), 1),
          t("span", Ko, b(v.value === Ee ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: I(() => [
        s(a(q), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: C.value,
          onClick: P[5] || (P[5] = (w) => d("close"))
        }, null, 8, ["disabled"]),
        s(a(q), {
          label: "Create " + a(pe)[x.value].toLowerCase(),
          type: "submit",
          form: U.hint,
          loading: C.value,
          disabled: !_.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: I(() => [
        t("form", {
          id: U.hint,
          class: "mail-form",
          onSubmit: Te(ee, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: C.value,
            inert: C.value || void 0
          }, [
            p.value ? S("", !0) : (l(), i("div", Zo, [
              P[7] || (P[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              s(a(Ce), {
                modelValue: x.value,
                "onUpdate:modelValue": P[0] || (P[0] = (w) => x.value = w),
                options: a(k),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            p.value ? S("", !0) : (l(), i("div", Qo, [
              t("label", {
                class: "mail-field-label",
                for: U.source
              }, "Start from", 8, Xo),
              s(Ye, {
                "model-value": v.value,
                kind: x.value,
                label: "Start from",
                "input-id": U.source,
                extra: c,
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": z
              }, null, 8, ["model-value", "kind", "input-id"])
            ])),
            t("div", er, [
              t("label", {
                class: "mail-field-label",
                for: U.title
              }, "Name", 8, ar),
              s(a(ue), {
                id: U.title,
                modelValue: _.value,
                "onUpdate:modelValue": P[1] || (P[1] = (w) => _.value = w),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": V.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: U.reference
              }, "Reference", 8, lr),
              s(a(ue), {
                id: U.reference,
                modelValue: T.value,
                "onUpdate:modelValue": P[2] || (P[2] = (w) => T.value = w),
                class: "mail-mono-input",
                invalid: !!V.value,
                "aria-describedby": U.reference + "-hint",
                onInput: P[3] || (P[3] = (w) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: U.reference + "-hint",
                class: re(V.value ? "mail-field-error" : "mail-field-hint")
              }, b(V.value || Z.value), 11, tr)
            ], 2),
            t("div", sr, [
              t("label", {
                class: "mail-field-label",
                for: U.description
              }, "Description", 8, ir),
              s(a(va), {
                id: U.description,
                modelValue: o.value,
                "onUpdate:modelValue": P[4] || (P[4] = (w) => o.value = w),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Go),
          g.value ? (l(), i("p", nr, b(g.value), 1)) : S("", !0)
        ], 40, Yo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), rr = { class: "mail-drawer-head" }, ur = { class: "mail-drawer-title" }, dr = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, cr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, vr = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, mr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, fr = {
  key: 0,
  class: "kx-notice error mail-failure"
}, br = { class: "mail-failure-body" }, yr = { key: 0 }, pr = { key: 1 }, hr = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, gr = {
  key: 3,
  class: "mail-sub"
}, kr = {
  key: 4,
  class: "mail-field-error",
  role: "alert"
}, $r = {
  key: 5,
  class: "mail-failure-actions"
}, wr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, _r = { class: "mail-facts mail-card" }, xr = { key: 2 }, Cr = {
  key: 0,
  class: "mail-sub"
}, Vr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, Sr = { class: "mail-timeline" }, Tr = { class: "mail-muted" }, Rr = { class: "mail-facts" }, Ur = { class: "mail-mono-block" }, Ar = /* @__PURE__ */ ie({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: u }) {
    const n = e, d = u, { library: f, go: r, capabilities: x, delivery: v } = be();
    $e(() => !!n.messageId);
    const _ = y();
    Q(() => !!n.messageId, (w) => {
      w && Be(() => _.value?.focus());
    }, { immediate: !0 });
    const T = B(() => {
      const w = o.value?.last_error;
      if (!w) return;
      const m = v.value?.driver && v.value.driver.id === o.value?.driver_id ? v.value.driver.label : "The delivery service";
      return (x.value?.administer_delivery ? Tl(w.code, m) : void 0) ?? { lead: "", next: w.message };
    }), o = he(), h = y(!1), C = y(!1), g = y(!1), V = y(""), U = y(""), k = y(!1), p = y(), c = y(!1), A = we();
    async function z() {
      const w = n.messageId, m = A();
      if (!w) {
        o.value = void 0;
        return;
      }
      h.value = !0;
      try {
        const L = await la.get(w);
        if (!m()) return;
        o.value = L, V.value = "", C.value = g.value = !1;
      } catch (L) {
        if (!m()) return;
        o.value = void 0, C.value = na(L), g.value = We(L), V.value = C.value || g.value ? "" : se(L, "This message could not be loaded.");
      } finally {
        m() && (h.value = !1);
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
          p.value = await la.resend(w.message_id);
        } catch (m) {
          U.value = se(m, "The message could not be sent again.");
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
      return w ? f.title("message", w) : "";
    }), H = B(() => !!o.value?.template && f.exists("message", o.value.template) === !0), j = B(() => {
      const w = o.value;
      if (!w) return [];
      const m = [{ label: "Accepted for delivery", at: w.created_at }];
      return w.status === "queued" && w.next_attempt_at && m.push({ label: w.attempts ? `Attempt ${w.attempts} did not go through; trying again` : "Next delivery attempt", at: w.next_attempt_at }), w.sent_at ? m.push({ label: w.attempts > 1 ? `Sent after ${w.attempts} attempts` : "Sent", at: w.sent_at }) : w.status === "failed" && w.finished_at && m.push({ label: w.attempts > 1 ? `Failed after ${w.attempts} attempts` : "Failed", at: w.finished_at }), m;
    }), $ = B(() => (o.value?.attachments ?? []).map((w) => w.filename || "Attachment")), P = B(() => {
      const w = o.value;
      return w ? [
        { label: "Message ID", value: w.message_id },
        { label: "Delivery service", value: x.value?.administer_delivery ? w.driver_id : void 0 },
        { label: "Service message ID", value: w.provider_message_id },
        { label: "Error code", value: w.last_error?.code },
        { label: "Service response", value: w.last_error?.provider_detail }
      ].filter((m) => !!m.value) : [];
    });
    return (w, m) => (l(), D(a(Za), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !k.value,
      "close-on-escape": !k.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": m[6] || (m[6] = (L) => {
        L || d("close");
      })
    }, {
      default: I(() => [
        t("div", {
          ref_key: "drawer",
          ref: _,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", rr, [
            t("div", ur, [
              o.value ? (l(), D(a(Ae), {
                key: 0,
                severity: a(Ga)[o.value.status],
                value: a(Ya)[o.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : S("", !0),
              t("h2", null, b(o.value?.subject ?? "Message"), 1)
            ]),
            s(a(q), {
              text: "",
              severity: "secondary",
              disabled: !o.value,
              "aria-label": c.value ? "Link copied" : "Copy link",
              title: c.value ? "Link copied" : "Copy link",
              onClick: X
            }, {
              icon: I(() => [
                s(a(O), {
                  icon: c.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            s(a(q), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: k.value,
              onClick: m[0] || (m[0] = (L) => d("close"))
            }, {
              icon: I(() => [
                s(a(O), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          h.value && !o.value ? (l(), i("p", dr, [
            s(a(O), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            m[7] || (m[7] = G("Loading message…", -1))
          ])) : C.value ? (l(), i("p", cr, [
            s(a(O), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            m[8] || (m[8] = G("This message is no longer in Activity.", -1))
          ])) : g.value ? (l(), i("p", vr, [
            s(a(O), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            m[9] || (m[9] = G("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : V.value ? (l(), i("div", mr, [
            t("span", null, b(V.value), 1),
            s(a(q), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: m[1] || (m[1] = (L) => z())
            })
          ])) : S("", !0),
          o.value ? (l(), i(K, { key: 4 }, [
            o.value.status === "failed" ? (l(), i("div", fr, [
              s(a(O), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", br, [
                m[11] || (m[11] = t("strong", null, "This message was not delivered.", -1)),
                T.value?.lead ? (l(), i("span", yr, b(T.value.lead), 1)) : S("", !0),
                T.value ? (l(), i("span", pr, b(T.value.next), 1)) : S("", !0),
                p.value ? (l(), i("p", hr, [
                  m[10] || (m[10] = G(" Sent again as a new message. ", -1)),
                  s(a(q), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: m[2] || (m[2] = (L) => a(r)({ name: "activity", message: p.value.message_id }))
                  })
                ])) : o.value.can_resend ? S("", !0) : (l(), i("p", gr, "It cannot be sent again because its content was not kept.")),
                U.value ? (l(), i("p", kr, b(U.value), 1)) : S("", !0),
                p.value ? S("", !0) : (l(), i("div", $r, [
                  a(x)?.send && o.value.can_resend ? (l(), D(a(q), {
                    key: 0,
                    label: "Send again",
                    loading: k.value,
                    onClick: Z
                  }, {
                    icon: I(() => [
                      s(a(O), {
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
                    onClick: m[3] || (m[3] = (L) => a(ca)(L.currentTarget, "/system/settings/mail"))
                  })) : S("", !0)
                ]))
              ])
            ])) : o.value.status === "queued" ? (l(), i("p", wr, [
              s(a(O), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              m[12] || (m[12] = G("Waiting to be delivered. ", -1))
            ])) : S("", !0),
            t("dl", _r, [
              m[18] || (m[18] = t("dt", null, "To", -1)),
              t("dd", null, b(o.value.to.join(", ")), 1),
              o.value.cc?.length ? (l(), i(K, { key: 0 }, [
                m[13] || (m[13] = t("dt", null, "Cc", -1)),
                t("dd", null, b(o.value.cc.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.bcc?.length ? (l(), i(K, { key: 1 }, [
                m[14] || (m[14] = t("dt", null, "Bcc", -1)),
                t("dd", null, b(o.value.bcc.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.reply_to ? (l(), i(K, { key: 2 }, [
                m[15] || (m[15] = t("dt", null, "Reply-to", -1)),
                t("dd", null, b(o.value.reply_to), 1)
              ], 64)) : S("", !0),
              m[19] || (m[19] = t("dt", null, "Template", -1)),
              t("dd", null, [
                ee.value === void 0 ? (l(), D(a(Me), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : H.value ? (l(), D(a(q), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ee.value,
                  onClick: m[4] || (m[4] = (L) => a(r)({ name: "resource", kind: "message", resource: o.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), i("span", xr, b(ee.value || "Written directly"), 1))
              ]),
              m[20] || (m[20] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                G(b(a(Ve)(o.value.sender_label, o.value.sender)), 1),
                o.value.origin ? (l(), i("span", Cr, b(a(ia)(o.value.origin)), 1)) : S("", !0)
              ]),
              $.value.length ? (l(), i(K, { key: 3 }, [
                m[16] || (m[16] = t("dt", null, "Attachments", -1)),
                t("dd", null, b($.value.join(", ")), 1)
              ], 64)) : S("", !0),
              o.value.resend_of ? (l(), i(K, { key: 4 }, [
                m[17] || (m[17] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  s(a(q), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: m[5] || (m[5] = (L) => a(r)({ name: "activity", message: o.value.resend_of }))
                  })
                ])
              ], 64)) : S("", !0)
            ]),
            t("section", Vr, [
              m[21] || (m[21] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", Sr, [
                (l(!0), i(K, null, me(j.value, (L) => (l(), i("li", {
                  key: L.label
                }, [
                  t("span", null, b(L.label), 1),
                  t("span", Tr, b(a(Ke)(L.at)), 1)
                ]))), 128))
              ])
            ]),
            P.value.length ? (l(), D(Ha, {
              key: 2,
              label: "Technical details"
            }, {
              default: I(() => [
                t("dl", Rr, [
                  (l(!0), i(K, null, me(P.value, (L) => (l(), i(K, {
                    key: L.label
                  }, [
                    t("dt", null, b(L.label), 1),
                    t("dd", Ur, b(L.value), 1)
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
}), Lr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, jr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, Ir = { class: "mail-health-text" }, Er = { class: "mail-toolbar" }, Nr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, Mr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, zr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Or = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Pr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Dr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, qr = { class: "mail-sub" }, Br = {
  key: 0,
  class: "mail-sub"
}, Hr = { class: "mail-muted" }, Fr = {
  key: 2,
  class: "mail-more"
}, Jr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Wr = /* @__PURE__ */ ie({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const u = e, { library: n, go: d } = be(), f = y("all"), r = y(u.template ?? null), x = y(30), v = y(""), _ = y("");
    let T;
    Q(v, (R) => {
      clearTimeout(T), T = setTimeout(() => {
        _.value = R.trim();
      }, 250);
    }), Q(() => u.template, (R) => {
      R !== void 0 && (r.value = R);
    });
    const o = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], h = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], C = he([]), g = y(), V = y(!0), U = y(!1), k = y(!1), p = y(!1), c = y(""), A = y(""), z = y(""), Z = we();
    function X(R) {
      return {
        status: f.value === "all" ? void 0 : f.value,
        message: r.value || void 0,
        since: Date.now() - x.value * 24 * 60 * 60 * 1e3,
        q: _.value || void 0,
        cursor: R
      };
    }
    async function ee(R = !1) {
      const M = Z();
      V.value = !0;
      try {
        const W = await la.list(X());
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
        const M = await la.list(X(g.value));
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
    Q([f, r, x, _], () => {
      ee();
    }), Fe(() => ee(U.value)), Le("mail.activity", () => {
      ee(U.value);
    });
    const w = B(() => {
      const R = j.value ?? C.value.length;
      return $.value ? `${R.toLocaleString()}+ messages` : ye(R, "message");
    }), m = B(() => $.value && !!_.value), L = B(() => P.value ? `${ye(P.value, "message")} failed today.` : "");
    function ae(R) {
      return R ? n.title("message", R) : "—";
    }
    function N(R) {
      d({ name: "activity", message: R.message_id });
    }
    function E() {
      d({ name: "activity", template: r.value || void 0 });
    }
    return (R, M) => (l(), i(K, null, [
      s(Je, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      p.value ? (l(), i("p", Lr, [
        s(a(O), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[8] || (M[8] = G("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), i(K, { key: 1 }, [
        L.value ? (l(), i("p", jr, [
          s(a(O), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", Ir, [
            t("strong", null, b(L.value), 1),
            G(" " + b(f.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          f.value !== "failed" ? (l(), D(a(q), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[0] || (M[0] = (W) => f.value = "failed")
          })) : S("", !0)
        ])) : S("", !0),
        t("div", Er, [
          s(a(Ce), {
            modelValue: f.value,
            "onUpdate:modelValue": M[1] || (M[1] = (W) => f.value = W),
            options: o,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          s(Ye, {
            modelValue: r.value,
            "onUpdate:modelValue": M[2] || (M[2] = (W) => r.value = W),
            kind: "message",
            label: "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue"]),
          s(a(wa), {
            modelValue: x.value,
            "onUpdate:modelValue": M[3] || (M[3] = (W) => x.value = W),
            options: h,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          s(a(ka), { class: "mail-search" }, {
            default: I(() => [
              s(a($a), null, {
                default: I(() => [
                  s(a(O), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ue), {
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
          U.value ? (l(), i("span", Nr, b(w.value), 1)) : S("", !0)
        ]),
        m.value ? (l(), i("p", Mr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : S("", !0),
        c.value ? (l(), i("div", zr, [
          t("span", null, b(c.value), 1),
          s(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[5] || (M[5] = (W) => ee())
          })
        ])) : S("", !0),
        z.value ? (l(), i("div", Or, [
          t("span", null, b(z.value) + " The list shows what was loaded before.", 1),
          s(a(q), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[6] || (M[6] = (W) => ee(!0))
          })
        ])) : V.value && !U.value ? (l(), i("p", Pr, [
          s(a(O), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          M[9] || (M[9] = G("Loading activity…", -1))
        ])) : U.value ? (l(), i(K, { key: 5 }, [
          C.value.length ? (l(), D(a(ga), {
            key: 1,
            value: C.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: M[7] || (M[7] = (W) => N(W.data))
          }, {
            default: I(() => [
              s(a(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: I(({ data: W }) => [
                  s(a(Ae), {
                    severity: a(Ga)[W.status],
                    value: a(Ya)[W.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              s(a(ce), { header: "Message" }, {
                body: I(({ data: W }) => [
                  s(a(q), {
                    link: "",
                    class: "mail-name",
                    label: W.subject,
                    onClick: Te((te) => N(W), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", qr, b(a(Rl)(W.to)), 1)
                ]),
                _: 1
              }),
              s(a(ce), { header: "Template" }, {
                body: I(({ data: W }) => [
                  ae(W.template) === void 0 ? (l(), D(a(Me), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), i(K, { key: 1 }, [
                    G(b(ae(W.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              s(a(ce), { header: "Sent by" }, {
                body: I(({ data: W }) => [
                  t("span", null, b(a(Ve)(W.sender_label, W.sender)), 1),
                  W.origin ? (l(), i("span", Br, b(a(ia)(W.origin)), 1)) : S("", !0)
                ]),
                _: 1
              }),
              s(a(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: I(({ data: W }) => [
                  t("span", Hr, b(a(Ul)(W.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), i("p", Dr, b(_.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          g.value ? (l(), i("div", Fr, [
            A.value ? (l(), i("span", Jr, b(A.value), 1)) : S("", !0),
            s(a(q), {
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
      s(Ar, {
        "message-id": e.message,
        onClose: E
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Kr = { class: "kx-shell kx-settings-shell mail-admin" }, Yr = { class: "kx-main" }, Gr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Zr = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Qr = /* @__PURE__ */ ie({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: u }) {
    const n = e, d = u, f = he(Ma(n.route ?? "")), r = B(() => f.value), x = y(!1);
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
      !T(r.value, N) && !await _() || (T(r.value, N) || (x.value = !1), f.value = N, n.route !== void 0 && E !== n.route && d("navigate", E));
    }
    Q(() => n.route, async (N, E) => {
      if (N === void 0) return;
      const R = Ma(N);
      if (Ie(R) !== Ie(f.value)) {
        if (!T(f.value, R) && x.value) {
          if (!await _()) {
            E !== void 0 && n.route === N && d("navigate", Ie(f.value));
            return;
          }
          x.value = !1;
        }
        n.route === N && (f.value = R);
      }
    });
    const h = Gl(), { lookupError: C } = h, g = y(), V = y(), U = y(""), k = we();
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
    _l(Qa, {
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
    Q(() => Ie(r.value), () => {
      P.value = "";
    });
    const w = B(() => {
      const N = r.value;
      if (N.name === "resource")
        return {
          leading: { value: "all", label: "All " + pa[N.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: P.value || " ", items: al(N.kind).map((E) => ({
            value: E,
            label: X[E](N.kind),
            icon: ee[E](N.kind)
          })) }]
        };
    }), m = B(() => {
      const N = r.value;
      return N.name === "resource" ? N.section : N.name === "activity" ? "activity" : N.section;
    });
    function L(N) {
      const E = r.value;
      if (E.name === "resource") {
        o(N === "all" ? { name: "library", section: fa(E.kind) } : { ...E, section: N });
        return;
      }
      o(N === "activity" ? { name: "activity" } : { name: "library", section: N });
    }
    const ae = y();
    return Q(() => Ie(r.value), () => {
      ae.value?.scrollTo({ top: 0 });
    }), (N, E) => (l(), i("main", Kr, [
      s(Yl, {
        label: "Mail sections",
        title: "Mail",
        value: m.value,
        groups: w.value ? w.value.groups : j.value,
        "leading-item": w.value ? w.value.leading : $,
        "onUpdate:value": L
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", Yr, [
        t("div", {
          ref_key: "main",
          ref: ae,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          U.value ? (l(), i("p", Gr, b(U.value), 1)) : S("", !0),
          a(C) ? (l(), i("p", Zr, b(a(C)), 1)) : S("", !0),
          r.value.name === "resource" ? (l(), D(Ln, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), i(K, { key: 3 }, [
            H.value ? (l(), D(Wr, {
              key: 0,
              message: r.value.message,
              template: r.value.template
            }, null, 8, ["message", "template"])) : g.value ? (l(), i(K, { key: 1 }, [
              s(Je, {
                title: "Activity",
                description: ""
              }),
              E[2] || (E[2] = t("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : S("", !0)
          ], 64)) : r.value.section === "assets" ? (l(), D(Ho, {
            key: 4,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), D(Ft, {
            key: 5,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      s(or, {
        visible: c.value,
        intent: z.value,
        onClose: E[0] || (E[0] = (R) => c.value = !1)
      }, null, 8, ["visible", "intent"]),
      s(il, {
        visible: A.value,
        onClose: E[1] || (E[1] = (R) => A.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Xr = /* @__PURE__ */ ie({
  __name: "MailAdminRoot",
  setup(e) {
    const u = fl(), n = bl();
    return (d, f) => (l(), D(Qr, {
      route: a(u).route,
      onNavigate: f[0] || (f[0] = (r) => a(n)("navigate", { route: r })),
      onDirtyChange: f[1] || (f[1] = (r) => a(n)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), _u = { rootComponent: Xr, plugins: [yl] };
export {
  _u as config
};
