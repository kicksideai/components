import { defineComponent as se, useId as fe, openBlock as l, createElementBlock as n, unref as a, normalizeClass as re, createElementVNode as t, createTextVNode as Z, toDisplayString as g, createCommentVNode as V, renderSlot as Oe, computed as P, createBlock as E, resolveDynamicComponent as rl, normalizeProps as ul, guardReactiveProps as dl, createSlots as ya, withCtx as L, Fragment as Y, renderList as me, inject as cl, ref as w, shallowRef as ke, onBeforeUnmount as Fe, onMounted as vl, createVNode as i, watch as X, reactive as ml, nextTick as ta, withModifiers as Ie, useModel as Ea, mergeModels as ca, defineAsyncComponent as va, withDirectives as fl, vShow as bl, provide as yl } from "vue";
import { u as sa, a as pl, b as gl, c as hl } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Oa, l as ie, d as oe, i as Je, k as be, b as We, A as kl, e as we, a as Ce, p as ge, w as Pa, c as _e, _ as ia, f as pa, g as pe, s as Ma, h as Ye, j as ga, m as Ge, o as na, n as $l, q as wl, r as Da, t as Ba, v as qa, x as _l, y as xl, z as Ha, B as Fa, C as Ja, D as He, E as Cl, F as Vl, G as Sl, H as Tl, I as Rl, J as Ul } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-Boigvu4O.js";
import { host as Te, api as jl, on as Al, define as Ll } from "@wippy-fe/proxy";
import { Icon as z } from "@iconify/vue";
import Ue from "primevue/skeleton";
import D from "primevue/button";
import ce from "primevue/column";
import ha from "primevue/datatable";
import ka from "primevue/iconfield";
import $a from "primevue/inputicon";
import ve from "primevue/inputtext";
import xe from "primevue/selectbutton";
import Ne from "primevue/dialog";
import Il from "primevue/progressbar";
import Pe from "primevue/tag";
import Me from "primevue/select";
import Nl from "primevue/accordion";
import zl from "primevue/accordioncontent";
import El from "primevue/accordionheader";
import Ol from "primevue/accordionpanel";
import Pl from "primevue/menu";
import Ml from "primevue/checkbox";
import Dl from "primevue/inputnumber";
import ma from "primevue/textarea";
import Wa from "primevue/drawer";
import Bl from "primevue/fileupload";
const ql = ["aria-labelledby"], Hl = { class: "kx-railhead" }, Fl = ["id"], Jl = { key: 0 }, Wl = { class: "kx-railhead-acts" }, Kl = { class: "kx-rail-body" }, Yl = /* @__PURE__ */ se({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const d = fe();
    return (o, c) => (l(), n("aside", {
      class: re(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(d)
    }, [
      t("div", Hl, [
        t("span", {
          id: a(d),
          class: "kx-railhead-title"
        }, [
          Z(g(e.title), 1),
          e.count !== void 0 ? (l(), n("b", Jl, g(e.count), 1)) : V("", !0)
        ], 8, Fl),
        t("div", Wl, [
          Oe(o.$slots, "actions")
        ])
      ]),
      Oe(o.$slots, "toolbar"),
      t("div", Kl, [
        Oe(o.$slots, "default")
      ])
    ], 10, ql));
  }
}), Gl = ["aria-label"], Zl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ql = ["aria-current", "onClick"], Xl = { class: "kx-settings-rail-label" }, et = /* @__PURE__ */ se({
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
    const d = e, o = P(() => d.leadingItem ? [{ items: [d.leadingItem] }, ...d.groups] : d.groups);
    function c(b) {
      const r = [...b.currentTarget.querySelectorAll(".kx-settings-rail-item")], k = r.indexOf(b.target);
      if (k < 0) return;
      let y;
      switch (b.key) {
        case "ArrowDown":
        case "ArrowRight":
          y = (k + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          y = (k + r.length - 1) % r.length;
          break;
        case "Home":
          y = 0;
          break;
        case "End":
          y = r.length - 1;
          break;
        default:
          return;
      }
      b.preventDefault(), r[y]?.focus();
    }
    return (b, r) => (l(), E(rl(e.title ? Yl : "div"), ul(dl(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ya({
      default: L(() => [
        t("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: c
        }, [
          (l(!0), n(Y, null, me(o.value, (k, y) => (l(), n("div", {
            key: k.items[0]?.value ?? y,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && y === 0 }])
          }, [
            k.heading ? (l(), n("div", Zl, g(k.heading), 1)) : V("", !0),
            (l(!0), n(Y, null, me(k.items, (C) => (l(), n("button", {
              key: C.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": C.value === e.value ? "true" : void 0,
              onClick: (R) => b.$emit("update:value", C.value)
            }, [
              C.icon ? (l(), E(a(z), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: C.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Xl, g(C.label), 1)
            ], 8, Ql))), 128))
          ], 2))), 128))
        ], 42, Gl)
      ]),
      _: 2
    }, [
      e.title && b.$slots.actions ? {
        name: "actions",
        fn: L(() => [
          Oe(b.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ka = Symbol("mail-admin");
function ye() {
  const e = cl(Ka);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function wa(e) {
  const { kind: d, name: o, title: c, description: b, state: r, revision: k, origin: y, origin_label: C, base: R, author: u, author_label: p, updated_at: S, used_by: T } = e, _ = T && {
    messages: T.messages?.length,
    recent_sources: T.recent_senders?.length
  };
  return { kind: d, name: o, title: c, description: b, state: r, revision: k, origin: y, origin_label: C, base: R, author: u, author_label: p, updated_at: S, used_by: _ };
}
function at() {
  const e = Object.fromEntries(["message", "base", "part", "asset"].map((v) => [v, { rows: ke([]), loaded: w(!1), loading: w(!1), error: w(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
  function c(v) {
    const m = d.get(v);
    if (m) return m;
    const f = e[v];
    f.loading.value = !0;
    const $ = (async () => {
      try {
        const A = [];
        let N;
        do {
          const M = await ie.page({ kind: v, cursor: N });
          A.push(...M.items), N = M.next_cursor;
        } while (N);
        f.rows.value = A, f.loaded.value = !0, f.stale = !1, f.error.value = "";
      } catch (A) {
        f.error.value = oe(A, "The mail library could not be loaded.");
      } finally {
        f.loading.value = !1, d.delete(v);
      }
    })();
    return d.set(v, $), $;
  }
  function b(v) {
    const m = e[v];
    (!m.loaded.value || m.stale) && !m.loading.value && c(v);
  }
  function r(...v) {
    vl(() => {
      for (const m of v)
        e[m].users++, b(m);
    }), Fe(() => {
      for (const m of v) e[m].users--;
    });
  }
  function k(v, m, f) {
    const $ = e[v];
    if (!$.loaded.value) return;
    const A = $.rows.value.filter((N) => N.name !== m);
    f && A.push(f), $.rows.value = A;
  }
  async function y(v) {
    let m, f;
    try {
      f = await ie.get(v), m = wa(f);
    } catch ($) {
      if (!Je($)) {
        e[v.kind].stale = !0, e[v.kind].users > 0 && b(v.kind);
        return;
      }
    }
    k(v.kind, v.name, m);
    for (const $ of o) $(v, m, f);
  }
  Oa((v) => {
    y(v);
  });
  function C() {
    for (const v of Object.values(e)) v.stale = v.loaded.value;
    for (const [v, m] of Object.entries(e)) m.users > 0 && b(v);
  }
  function R(v) {
    o.add(v), Fe(() => o.delete(v));
  }
  const u = (v, m) => e[v].rows.value.find((f) => f.name === m);
  function p(v, m) {
    const f = u(v, m);
    return f ? f.title : (b(v), e[v].loaded.value ? m : void 0);
  }
  return { kinds: e, use: r, ensure: b, load: c, find: u, title: p, ofKind: (v) => [...e[v].rows.value].sort((m, f) => m.title.localeCompare(f.title)), ready: (v) => e[v].loaded.value, failed: (v) => e[v].error.value, onRow: R, refresh: C, patch: k };
}
function Re() {
  let e = 0;
  return () => {
    const d = ++e;
    return () => d === e;
  };
}
const lt = { class: "kx-empty" }, tt = { class: "kx-empty-ico" }, st = { class: "kx-empty-title" }, it = {
  key: 0,
  class: "kx-empty-sub"
}, _a = /* @__PURE__ */ se({
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
    return (d, o) => (l(), n("div", lt, [
      t("div", tt, [
        i(a(z), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", st, g(e.title), 1),
      e.hint || d.$slots.hint ? (l(), n("p", it, [
        Oe(d.$slots, "hint", {}, () => [
          Z(g(e.hint), 1)
        ])
      ])) : V("", !0),
      e.cta ? (l(), E(a(D), {
        key: 1,
        label: e.cta,
        onClick: o[0] || (o[0] = (c) => d.$emit("cta"))
      }, ya({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: L(({ class: c }) => [
            i(a(z), {
              icon: e.ctaIcon,
              class: re(c),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : V("", !0)
    ]));
  }
}), xa = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Ya = Object.fromEntries(Object.entries(xa).map(([e, d]) => [d, e])), nt = ["content", "variables", "used-by", "history"];
function fa(e) {
  return xa[e];
}
function ot(e) {
  return Ya[e];
}
function Ga(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : nt;
}
function Ee(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${xa[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Ia(e) {
  const d = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, c, b] = d;
  if (!o) return { name: "library", section: "all" };
  try {
    if (o === "activity")
      return c === "template" && b ? { name: "activity", template: decodeURIComponent(b) } : c ? { name: "activity", message: decodeURIComponent(c) } : { name: "activity" };
    if (o === "assets") return c ? { name: "library", section: "assets", asset: decodeURIComponent(c) } : { name: "library", section: "assets" };
    const r = Ya[o];
    if (!r) return { name: "library", section: "all" };
    if (!c) return { name: "library", section: o };
    const y = Ga(r).find((C) => C === b) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(c), section: y };
  } catch {
    return { name: "library", section: "all" };
  }
}
const rt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", da = `<meta http-equiv="Content-Security-Policy" content="${rt}">`;
function Ca(e, d) {
  let o = e;
  for (const [r, k] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join(k);
  const c = /<head(\s[^>]*)?>/i.exec(o);
  if (c) return o.slice(0, c.index + c[0].length) + da + o.slice(c.index + c[0].length);
  const b = /<html(\s[^>]*)?>/i.exec(o);
  return b ? o.slice(0, b.index + b[0].length) + "<head>" + da + "</head>" + o.slice(b.index + b[0].length) : da + o;
}
const ut = {
  class: "mail-problem",
  role: "alert"
}, dt = { class: "mail-problem-lead" }, ct = {
  key: 0,
  class: "mail-problem-detail"
}, vt = {
  key: 1,
  class: "mail-problem-involved"
}, mt = {
  key: 0,
  class: "mail-problem-self"
}, ba = /* @__PURE__ */ se({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const d = e, { library: o, go: c } = ye(), b = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (u) => o.title(u.kind, u.name), k = (u) => !!u && !!d.draft && u.kind === d.draft.kind && u.name === d.draft.name, y = P(() => {
      const { resource: u, face: p, previewOf: S } = d.problem, T = p ? b[p] : "";
      if (u && d.draft && d.draft.kind !== "message" && u.kind === "message" && u.name === S)
        return `${r(u) ?? "The message"} does not render with your changes.`;
      if (d.problem.tooLarge) {
        const _ = !u || k(u) ? d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it" : r(u) ?? "a resource it uses";
        return `The ${T || "content"} of ${_} is larger than Mail can send. Keep each rendered face under ${We(d.problem.tooLarge)}.`;
      }
      if (!u || k(u)) {
        const _ = d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it";
        return T ? `The ${T} of ${_} does not render.` : `${_[0].toUpperCase()}${_.slice(1)} does not render.`;
      }
      return `${r(u) ?? "A resource it uses"} does not render${T ? ` (${T})` : ""}.`;
    }), C = P(() => d.problem.candidates ?? []);
    function R(u) {
      u.kind === "asset" ? c({ name: "library", section: "assets", asset: u.name }) : c({ name: "resource", kind: u.kind, resource: u.name, section: "content" });
    }
    return (u, p) => (l(), n("div", ut, [
      t("p", dt, [
        i(a(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, g(y.value), 1)
      ]),
      e.problem.tooLarge ? V("", !0) : (l(), n("code", ct, g(e.problem.engine ?? e.problem.message), 1)),
      C.value.length ? (l(), n("p", vt, [
        p[0] || (p[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(Y, null, me(C.value, (S) => (l(), n(Y, {
          key: S.kind + S.name
        }, [
          k(S) ? (l(), n("span", mt, "This " + g(a(be)[S.kind].toLowerCase()), 1)) : r(S) === void 0 ? (l(), E(a(Ue), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), E(a(D), {
            key: 2,
            link: "",
            size: "small",
            label: r(S),
            class: "mail-inline-link",
            onClick: (T) => R(S)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : V("", !0)
    ]));
  }
}), Na = ["html", "text", "subject", "variables", "samples"];
function Be(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function Ke(e) {
  if (!(e instanceof kl)) return;
  const d = e.details ?? {}, o = we(e);
  if (o === "mail_resource_in_use") {
    const R = Array.isArray(d.messages) ? d.messages.filter((p) => typeof p == "string") : [], u = d.dependent;
    return {
      message: e.message,
      dependents: R,
      references: Array.isArray(d.resources) ? d.resources.filter(Be) : void 0,
      face: Na.find((p) => p === u?.face),
      resource: Be(u?.resource) ? u.resource : void 0
    };
  }
  const c = Na.find((R) => R === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!c) return;
  const b = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((R) => typeof R == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((R) => {
    const u = R;
    return Be(u.resource) && typeof u.message == "string" ? [{ name: u.resource.name, message: u.message }] : [];
  }) : [], k = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(Be) : [], y = typeof d.engine_message == "string" ? d.engine_message : void 0, C = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: e.message,
    engine: y,
    tooLarge: C,
    face: c,
    resource: Be(d.resource) ? d.resource : void 0,
    dependents: b.length ? b : void 0,
    reasons: r.length ? r : void 0,
    candidates: k.length ? k : void 0
  };
}
const ft = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, bt = { class: "kx-modal-head-icon" }, yt = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, pt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, gt = {
  key: 2,
  class: "mail-muted"
}, ht = ["data-name"], kt = { class: "mail-gallery-title" }, $t = { class: "mail-sub" }, wt = {
  key: 0,
  class: "mail-gallery-warning",
  role: "status"
}, _t = { class: "mail-gallery-frame" }, xt = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, Ct = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Vt = {
  key: 2,
  class: "mail-gallery-problem"
}, St = {
  key: 1,
  role: "alert"
}, Tt = ["srcdoc", "title"], Rt = {
  key: 3,
  class: "mail-more"
}, Ut = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, jt = 3, At = /* @__PURE__ */ se({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, c = d, { go: b } = ye();
    Ce(() => o.visible);
    const r = w([]), k = w(), y = w(), C = w(!1), R = w("");
    let u = 0, p = [], S = 0, T;
    async function _(x, h) {
      x.state = "loading";
      try {
        const s = await ie.preview(x.name, []);
        if (h !== u) return;
        x.subject = s.subject, x.warning = s.warnings?.length ? s.warnings.map(Pa).join(" ") : void 0, x.document = s.html ? Ca(s.html, s.inline_assets) : "", x.state = "ready";
      } catch (s) {
        if (h !== u) return;
        x.problem = Ke(s), x.failure = x.problem ? "" : oe(s, "This message could not be rendered."), x.state = "failed";
      }
    }
    function v(x) {
      for (; x === u && S < jt && p.length; ) {
        const h = p.shift();
        h.state === "waiting" && (S++, _(h, x).finally(() => {
          S--, v(x);
        }));
      }
    }
    function m(x) {
      x.state !== "waiting" || p.includes(x) || (p.push(x), v(u));
    }
    const f = w();
    function $() {
      if (T?.disconnect(), typeof IntersectionObserver > "u" || !f.value) {
        for (const x of r.value) m(x);
        return;
      }
      T = new IntersectionObserver((x) => {
        for (const h of x) {
          if (!h.isIntersecting) continue;
          const s = r.value.find((j) => j.name === h.target.dataset.name);
          s && m(s);
        }
      }, { root: f.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const x of f.value.querySelectorAll("[data-name]")) T.observe(x);
    }
    async function A(x) {
      C.value = !0, R.value = "";
      try {
        const h = await ie.page({ kind: "message", cursor: k.value });
        if (x !== u) return;
        r.value = [...r.value, ...h.items.map((s) => ml({ name: s.name, title: s.title, state: "waiting" }))], k.value = h.next_cursor, y.value = h.total, await ta(), $();
      } catch (h) {
        x === u && (R.value = oe(h, "The messages could not be listed."));
      } finally {
        x === u && (C.value = !1);
      }
    }
    function N() {
      u++, p = [], T?.disconnect(), T = void 0;
    }
    function M() {
      N(), r.value = [], k.value = y.value = void 0, A(u);
    }
    function I() {
      const x = ++u;
      p = [];
      for (const h of r.value) Object.assign(h, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      ta(() => {
        x === u && $();
      });
    }
    X(() => o.visible, (x) => {
      x ? M() : N();
    }), Fe(N);
    const O = P(() => r.value.filter((x) => x.state === "ready" || x.state === "failed").length), ae = P(() => r.value.filter((x) => x.state === "failed").length), le = P(() => {
      if (!r.value.length) return "";
      const x = `${O.value} of ${ge(y.value ?? r.value.length, "message")} rendered`;
      return ae.value ? `${x}, ${ae.value} with a problem.` : x + ".";
    });
    function H(x) {
      c("close"), b({ name: "resource", kind: "message", resource: x, section: "content" });
    }
    const U = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (x, h) => (l(), E(a(Ne), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: U,
      "aria-label": "Preview all messages",
      "onUpdate:visible": h[1] || (h[1] = (s) => {
        s || c("close");
      })
    }, {
      header: L(() => [
        t("span", bt, [
          i(a(z), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        h[2] || (h[2] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !r.value.length,
          onClick: I
        }, {
          icon: L(() => [
            i(a(z), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: L(() => [
        r.value.length ? (l(), n("div", yt, [
          t("span", null, g(le.value), 1),
          i(a(Il), {
            value: Math.round(O.value / (y.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : V("", !0),
        C.value && !r.value.length ? (l(), n("p", pt, [
          i(a(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          h[3] || (h[3] = Z("Listing messages…", -1))
        ])) : !C.value && !R.value && !r.value.length ? (l(), n("p", gt, "There are no messages yet.")) : V("", !0),
        t("ul", {
          ref_key: "list",
          ref: f,
          class: "mail-gallery"
        }, [
          (l(!0), n(Y, null, me(r.value, (s) => (l(), n("li", {
            key: s.name,
            "data-name": s.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": s.state === "failed" }])
          }, [
            i(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + s.title,
              onClick: (j) => H(s.name)
            }, {
              default: L(() => [
                t("span", kt, g(s.title), 1),
                t("span", $t, g(s.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            s.warning ? (l(), n("p", wt, [
              i(a(z), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              Z(g(s.warning), 1)
            ])) : V("", !0),
            t("div", _t, [
              s.state === "waiting" ? (l(), n("p", xt, "Renders when shown.")) : s.state === "loading" ? (l(), n("p", Ct, [
                i(a(z), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                h[4] || (h[4] = Z("Rendering…", -1))
              ])) : s.state === "failed" ? (l(), n("div", Vt, [
                s.problem ? (l(), E(ba, {
                  key: 0,
                  problem: s.problem,
                  draft: { kind: "message", name: s.name }
                }, null, 8, ["problem", "draft"])) : (l(), n("p", St, g(s.failure), 1))
              ])) : (l(), n("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: s.document,
                title: s.title + " preview",
                tabindex: "-1"
              }, null, 8, Tt))
            ])
          ], 10, ht))), 128))
        ], 512),
        k.value || R.value ? (l(), n("div", Rt, [
          R.value ? (l(), n("span", Ut, g(R.value), 1)) : V("", !0),
          i(a(D), {
            label: R.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: C.value,
            onClick: h[0] || (h[0] = (s) => A(a(u)))
          }, null, 8, ["label", "loading"])
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Lt = { class: "mail-source" }, It = { key: 0 }, Nt = { key: 1 }, Va = /* @__PURE__ */ se({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (d, o) => (l(), n("span", Lt, [
      e.resource.state === "created" ? (l(), n("span", It, g((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(_e)(e.resource.author_label, e.resource.author)), 1)) : (l(), n("span", Nt, "Included with " + g(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), E(a(Pe), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : V("", !0)
    ]));
  }
}), zt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Et = {
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
}, Mt = { class: "mail-toolbar" }, Dt = {
  class: "mail-count",
  role: "status"
}, Bt = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, qt = {
  key: 0,
  class: "mail-sub"
}, Ht = { class: "mail-kind" }, Ft = { class: "mail-muted" }, Jt = {
  key: 2,
  class: "mail-more"
}, Wt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Kt = /* @__PURE__ */ se({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const d = e, { library: o, go: c, create: b } = ye(), r = P(() => ot(d.section));
    X(r, (K) => {
      K === "message" && o.ensure("base");
    }, { immediate: !0 });
    const k = w("all"), y = w(""), C = w("");
    let R;
    X(y, (K) => {
      clearTimeout(R), R = setTimeout(() => {
        C.value = K.trim();
      }, 250);
    }), X(() => d.section, () => {
      y.value = C.value = "", k.value = "all";
    });
    const u = ke([]), p = w(), S = w(), T = w(!0), _ = w(!1), v = w(!1), m = w(!1), f = w(""), $ = w(""), A = w(""), N = Re(), M = () => ({ kind: r.value, state: k.value === "all" ? void 0 : k.value, q: C.value || void 0 });
    async function I(K = !1) {
      const F = N();
      T.value = !0;
      try {
        const J = await ie.page(M());
        if (!F()) return;
        u.value = J.items, p.value = J.next_cursor, S.value = J.total, f.value = $.value = A.value = "", m.value = !1, _.value = !0;
      } catch (J) {
        if (!F()) return;
        m.value = Ye(J);
        const te = m.value ? "" : oe(J, "The mail library could not be loaded.");
        K && _.value && !m.value ? A.value = te : f.value = te;
      } finally {
        F() && (T.value = !1);
      }
    }
    async function O() {
      if (!p.value || v.value) return;
      const K = N();
      v.value = !0, $.value = "";
      try {
        const F = await ie.page({ ...M(), cursor: p.value });
        if (!K()) return;
        u.value = [...u.value, ...F.items], p.value = F.next_cursor, S.value = F.total;
      } catch (F) {
        K() && ($.value = oe(F, "More resources could not be loaded."));
      } finally {
        v.value = !1;
      }
    }
    X([r, k, C], () => {
      I();
    }), sa(() => I(_.value));
    const ae = (K) => K.kind + "/" + K.name;
    o.onRow((K, F) => {
      const J = ae(K), te = u.value.findIndex((W) => ae(W) === J), he = (!r.value || K.kind === r.value) && k.value === "all" && !C.value;
      if (te >= 0) {
        const W = [...u.value];
        F ? W[te] = F : W.splice(te, 1), u.value = W, !F && S.value !== void 0 && S.value--;
        return;
      }
      if (!he) return;
      if (!F) {
        S.value !== void 0 && S.value--;
        return;
      }
      F.revision === 1 && F.state === "created" && S.value !== void 0 && S.value++;
      const Ve = u.value[u.value.length - 1];
      if (p.value && Ve && J > ae(Ve)) return;
      const ee = u.value.findIndex((W) => ae(W) > J), G = [...u.value];
      G.splice(ee < 0 ? G.length : ee, 0, F), u.value = G;
    });
    const le = P(() => {
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
    }), H = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], U = P(() => {
      const K = r.value ? be[r.value].toLowerCase() : "resource", F = S.value ?? u.value.length;
      return u.value.length < F ? `${u.value.length} of ${ge(F, K)}` : ge(F, K);
    });
    function x(K) {
      const F = K.used_by;
      return K.kind === "base" || K.kind === "asset" ? F?.messages ? ge(F.messages, "message") : "—" : K.kind === "message" ? F?.recent_sources ? ge(F.recent_sources, "recent sender") : "—" : "";
    }
    function h(K) {
      return K.base ? o.title("base", K.base) : "";
    }
    function s(K) {
      K.kind === "asset" ? c({ name: "library", section: "assets", asset: K.name }) : c({ name: "resource", kind: K.kind, resource: K.name, section: "content" });
    }
    const j = P(() => _.value && !f.value && r.value && !u.value.length && k.value === "all" && !C.value), ne = w(!1);
    return (K, F) => (l(), n(Y, null, [
      i(ia, {
        title: le.value.title,
        description: le.value.description
      }, {
        actions: L(() => [
          !r.value || r.value === "message" ? (l(), E(a(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: F[0] || (F[0] = (J) => ne.value = !0)
          }, {
            icon: L(() => [
              i(a(z), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          i(a(D), {
            label: r.value ? "New " + a(be)[r.value].toLowerCase() : "New",
            onClick: F[1] || (F[1] = (J) => a(b)({ kind: r.value }))
          }, {
            icon: L(() => [
              i(a(z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      m.value ? (l(), n("p", zt, [
        i(a(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        F[9] || (F[9] = Z("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : f.value ? (l(), n("div", Et, [
        t("span", null, g(f.value), 1),
        i(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[2] || (F[2] = (J) => I())
        })
      ])) : V("", !0),
      A.value ? (l(), n("div", Ot, [
        t("span", null, g(A.value) + " The list shows what was loaded before.", 1),
        i(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[3] || (F[3] = (J) => I(!0))
        })
      ])) : T.value && !_.value ? (l(), n("p", Pt, [
        i(a(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        F[10] || (F[10] = Z("Loading mail library…", -1))
      ])) : j.value && r.value ? (l(), E(_a, {
        key: 4,
        icon: a(pe)[r.value],
        title: "No " + a(pa)[r.value].toLowerCase() + " yet",
        hint: "Create a " + a(be)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(be)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: F[4] || (F[4] = (J) => a(b)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : _.value ? (l(), n(Y, { key: 5 }, [
        t("div", Mt, [
          i(a(xe), {
            modelValue: k.value,
            "onUpdate:modelValue": F[5] || (F[5] = (J) => k.value = J),
            options: H,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          i(a(ka), { class: "mail-search" }, {
            default: L(() => [
              i(a($a), null, {
                default: L(() => [
                  i(a(z), {
                    icon: T.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: T.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              i(a(ve), {
                modelValue: y.value,
                "onUpdate:modelValue": F[6] || (F[6] = (J) => y.value = J),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + le.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Dt, g(U.value), 1)
        ]),
        u.value.length ? (l(), E(a(ha), {
          key: 1,
          value: u.value,
          "data-key": (J) => J.kind + "/" + J.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": le.value.title } },
          onRowClick: F[7] || (F[7] = (J) => s(J.data))
        }, {
          default: L(() => [
            i(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: L(({ data: J }) => [
                i(a(D), {
                  link: "",
                  class: "mail-name",
                  label: J.title,
                  onClick: Ie((te) => s(J), ["stop"])
                }, null, 8, ["label", "onClick"]),
                J.description ? (l(), n("span", qt, g(J.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            r.value ? V("", !0) : (l(), E(a(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: L(({ data: J }) => [
                t("span", Ht, [
                  i(a(z), {
                    icon: a(pe)[J.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  Z(g(a(be)[J.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), E(a(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: L(({ data: J }) => [
                h(J) === void 0 ? (l(), E(a(Ue), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(Y, { key: 1 }, [
                  Z(g(h(J)), 1)
                ], 64))
              ]),
              _: 1
            })) : V("", !0),
            i(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: L(({ data: J }) => [
                i(Va, { resource: J }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), E(a(ce), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: L(({ data: J }) => [
                Z(g(x(J)), 1)
              ]),
              _: 1
            })) : V("", !0),
            i(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: J }) => [
                t("span", Ft, g(J.state === "original" ? "—" : a(Ma)(J.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", Bt, "Nothing matches. Try another name or a word from the template.")),
        p.value ? (l(), n("div", Jt, [
          $.value ? (l(), n("span", Wt, g($.value), 1)) : V("", !0),
          i(a(D), {
            label: $.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: v.value,
            onClick: O
          }, null, 8, ["label", "loading"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      i(At, {
        visible: ne.value,
        onClose: F[8] || (F[8] = (J) => ne.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function Yt(e) {
  return JSON.parse(JSON.stringify(e));
}
function Se(e) {
  const d = Yt(e);
  return {
    kind: d.kind,
    name: d.name,
    title: d.title,
    description: d.description,
    html: d.html,
    text: d.text,
    base: d.base,
    subject: d.subject,
    schema: d.schema,
    samples: d.samples
  };
}
function Gt(e, d) {
  return JSON.stringify(Se(e)) === JSON.stringify(Se(d));
}
function Zt(e, d, o, c, b) {
  const r = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: d,
    title: o,
    description: c,
    base: b,
    subject: o,
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
    name: d,
    title: o,
    description: c,
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
  } : { kind: e, name: d, title: o, description: c, schema: r, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function Qt(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function Xt(e) {
  const d = [], o = e.samples;
  for (const [c, b] of Object.entries(e.schema.properties)) {
    const r = Qt(o[c] ?? b.default ?? (b.type === "string" ? "" : null));
    r !== void 0 && d.push(`${JSON.stringify(c)}, ${r}`);
  }
  return d.length ? `{{ include "/part/${e.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function Za(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function es(e, d, o) {
  const c = o ? ` width="${o}"` : "";
  return `<img src="${Za(e)}" alt="${d.replace(/"/g, "&quot;")}"${c} style="display:block;border:0;max-width:100%;height:auto;">`;
}
const as = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function ls(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !as.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const ts = "{{ block body() }}{{ end }}", ss = {
  class: "mail-preview",
  "aria-label": "Preview"
}, is = { class: "mail-preview-bar" }, ns = {
  key: 0,
  class: "mail-preview-with"
}, os = ["for"], rs = {
  key: 0,
  class: "mail-field-hint"
}, us = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, ds = {
  key: 2,
  class: "mail-preview-envelope"
}, cs = ["aria-busy"], vs = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ms = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, fs = ["srcdoc", "title"], bs = {
  key: 1,
  class: "mail-preview-text"
}, ys = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, ps = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, gs = {
  key: 5,
  class: "mail-preview-foot"
}, hs = /* @__PURE__ */ se({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, delivery: r } = ye();
    o.draft.kind !== "message" && b.ensure("message");
    const k = { message: fe() }, y = w("email"), C = w("desktop"), R = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], u = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], p = P(() => b.ready("message") ? (o.messages ?? b.ofKind("message").map((x) => x.name)).map((x) => ({ value: x, label: b.title("message", x) ?? x })).sort((x, h) => x.label.localeCompare(h.label)) : []), S = w("");
    X(p, (U) => {
      o.draft.kind !== "message" && (U.some((x) => x.value === S.value) || (S.value = U[0]?.value ?? ""));
    }, { immediate: !0 });
    const T = P(() => o.draft.kind !== "message" && S.value && S.value === p.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), _ = P(() => o.draft.kind === "message" ? o.draft.name : S.value), v = ke(), m = w(!1), f = w(), $ = w(""), A = Re();
    let N, M = !1, I = !1;
    async function O() {
      const U = _.value;
      if (!U) return;
      if (M) {
        I = !0;
        return;
      }
      M = !0;
      const x = A();
      m.value = !0;
      try {
        const h = await ie.preview(U, [o.draft]);
        if (!x()) return;
        v.value = h, f.value = void 0, $.value = "";
      } catch (h) {
        if (!x()) return;
        const s = Ke(h);
        f.value = s ? { ...s, previewOf: U } : void 0, $.value = f.value ? "" : oe(h, "The preview could not be rendered.");
      } finally {
        M = !1, x() && (m.value = !1), I && (I = !1, O());
      }
    }
    function ae() {
      clearTimeout(N), N = setTimeout(() => {
        O();
      }, 450);
    }
    X(() => JSON.stringify(o.draft), ae), X(_, () => {
      v.value = void 0, O();
    }, { immediate: !0 }), X(f, (U) => c("problem", U)), Fe(() => clearTimeout(N));
    const le = P(() => v.value?.html ? Ca(v.value.html, v.value.inline_assets) : ""), H = P(() => {
      const U = r.value?.from;
      return U ? U.name ? `${U.name} <${U.address}>` : U.address : "";
    });
    return (U, x) => (l(), n("section", ss, [
      t("div", is, [
        i(a(xe), {
          modelValue: y.value,
          "onUpdate:modelValue": x[0] || (x[0] = (h) => y.value = h),
          options: R,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        y.value === "email" ? (l(), E(a(xe), {
          key: 0,
          modelValue: C.value,
          "onUpdate:modelValue": x[1] || (x[1] = (h) => C.value = h),
          options: u,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: L(({ option: h }) => [
            i(a(z), {
              icon: h.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            Z(g(h.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), n("div", ns, [
        t("label", {
          for: k.message
        }, "Preview with", 8, os),
        i(a(Me), {
          modelValue: S.value,
          "onUpdate:modelValue": x[2] || (x[2] = (h) => S.value = h),
          "input-id": k.message,
          options: p.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !a(b).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        T.value ? (l(), n("small", rs, g(T.value), 1)) : V("", !0)
      ])) : V("", !0),
      m.value && v.value ? (l(), n("p", us, [
        i(a(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        x[3] || (x[3] = Z("Updating the preview…", -1))
      ])) : V("", !0),
      v.value ? (l(), n("dl", ds, [
        H.value ? (l(), n(Y, { key: 0 }, [
          x[4] || (x[4] = t("dt", null, "From", -1)),
          t("dd", null, g(H.value), 1)
        ], 64)) : V("", !0),
        x[5] || (x[5] = t("dt", null, "Subject", -1)),
        t("dd", null, g(v.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: re(["mail-preview-body", ["mail-preview-" + C.value, { "mail-preview-stale": f.value || $.value }]]),
        "aria-busy": m.value
      }, [
        !v.value && m.value ? (l(), n("p", vs, [
          i(a(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          x[6] || (x[6] = Z("Rendering preview…", -1))
        ])) : _.value ? v.value ? (l(), n(Y, { key: 2 }, [
          y.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: le.value,
            title: "Email preview: " + (v.value.subject ?? "")
          }, null, 8, fs)) : (l(), n("pre", bs, g(v.value.text), 1))
        ], 64)) : V("", !0) : (l(), n("p", ms, "Choose a message to see this " + g(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, cs),
      (l(!0), n(Y, null, me(v.value?.warnings ?? [], (h) => (l(), n("p", {
        key: h.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        i(a(z), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, g(a(Pa)(h)), 1)
      ]))), 128)),
      f.value ? (l(), n("p", ys, [
        i(a(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, g(v.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : $.value ? (l(), n("p", ps, [
        i(a(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, g($.value), 1)
      ])) : (l(), n("p", gs, [
        i(a(z), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        Z(" " + g(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), ks = { class: "kx-modal-head-icon" }, $s = { class: "kx-modal-head-text" }, ws = { class: "kx-modal-head-sub" }, _s = { class: "mail-change-list" }, xs = { class: "mail-muted" }, Cs = { class: "mail-field" }, Vs = ["for"], Ss = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Ts = { class: "mail-failure-body" }, Rs = { class: "mail-dependents" }, Us = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, js = /* @__PURE__ */ se({
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
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, go: r } = ye(), k = w(""), y = fe();
    X(() => o.visible, (p) => {
      p && (k.value = o.suggestedNote ?? "");
    }), Ce(() => o.visible);
    const C = P(() => {
      const p = o.saved, S = o.draft, T = [];
      return (p.title !== S.title || p.description !== S.description) && T.push("Name and description"), p.base !== S.base && T.push(`Base template: ${b.title("base", S.base ?? "") ?? S.base}`), p.subject !== S.subject && T.push("Subject"), p.html !== S.html && T.push("HTML"), p.text !== S.text && T.push("Plain text"), (JSON.stringify(p.schema.properties) !== JSON.stringify(S.schema.properties) || JSON.stringify(p.schema.required ?? []) !== JSON.stringify(S.schema.required ?? [])) && T.push(S.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(p.samples) !== JSON.stringify(S.samples) && T.push("Sample values"), T;
    }), R = P(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${be[o.draft.kind].toLowerCase()} changes when you save.`), u = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (p, S) => (l(), E(a(Ne), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: u,
      "aria-label": "Review changes",
      "onUpdate:visible": S[3] || (S[3] = (T) => {
        T || c("close");
      })
    }, {
      header: L(() => [
        t("span", ks, [
          i(a(z), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", $s, [
          S[4] || (S[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", ws, g(e.draft.title), 1)
        ])
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: S[2] || (S[2] = (T) => c("close"))
        }, null, 8, ["disabled"]),
        i(a(D), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: L(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: S[1] || (S[1] = Ie((T) => c("save", k.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            S[5] || (S[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", _s, [
              (l(!0), n(Y, null, me(C.value, (T) => (l(), n("li", { key: T }, g(T), 1))), 128))
            ])
          ]),
          t("p", xs, g(R.value) + " The previous version stays in History.", 1),
          t("div", Cs, [
            t("label", {
              class: "mail-field-label",
              for: a(y)
            }, "Note for History", 8, Vs),
            i(a(ve), {
              id: a(y),
              modelValue: k.value,
              "onUpdate:modelValue": S[0] || (S[0] = (T) => k.value = T),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), n("div", Ss, [
            i(a(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Ts, [
              t("strong", null, g(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, g(e.dependents.reason), 1),
              t("span", Rs, [
                (l(!0), n(Y, null, me(e.dependents.names, (T) => (l(), E(a(D), {
                  key: T,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(b).title("message", T) ?? T,
                  onClick: (_) => {
                    c("close"), a(r)({ name: "resource", kind: "message", resource: T, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), n("p", Us, g(e.error), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Qa = /* @__PURE__ */ se({
  __name: "Disclosure",
  props: /* @__PURE__ */ ca({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const d = Ea(e, "open");
    return (o, c) => (l(), E(a(Nl), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": c[0] || (c[0] = (b) => d.value = b === "content")
    }, {
      default: L(() => [
        i(a(Ol), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: L(() => [
            i(a(El), { class: "kx-disclosure-toggle" }, {
              default: L(() => [
                Z(g(e.label), 1)
              ]),
              _: 1
            }),
            i(a(zl), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: L(() => [
                Oe(o.$slots, "default")
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
}), As = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ls = { class: "kx-modal-head-icon" }, Is = { class: "kx-modal-head-text" }, Ns = { class: "kx-modal-head-title" }, zs = { class: "mail-field" }, Es = ["for"], Os = /* @__PURE__ */ se({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: d, emit: o }) {
    const c = e, b = o, { library: r } = ye(), k = w(), y = w("");
    function C(A) {
      y.value = "", r.ensure("part"), c.face === "html" && r.ensure("asset"), k.value?.toggle(A);
    }
    d({ toggle: C });
    const R = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], u = (A) => ({ label: A, disabled: !0, icon: "tabler:loader-2" });
    async function p(A) {
      y.value = "";
      try {
        b("insert", Xt(await ie.get({ kind: "part", name: A })));
      } catch (N) {
        y.value = oe(N, "The part could not be read.");
      }
    }
    const S = w(), T = w(""), _ = fe();
    Ce(() => !!S.value);
    async function v(A, N) {
      y.value = "";
      try {
        const M = await ie.get({ kind: "asset", name: A });
        S.value = { name: A, title: N, width: M.asset?.width }, T.value = N;
      } catch (M) {
        y.value = oe(M, "The image could not be read.");
      }
    }
    function m() {
      S.value && (b("insert", es(S.value.name, T.value, S.value.width)), S.value = void 0);
    }
    const f = P(() => {
      const A = Object.entries(c.draft.schema.properties).map(([I]) => ({
        label: I,
        icon: "tabler:variable",
        command: () => b("insert", c.draft.kind === "part" ? `{{ .${I} }}` : ls(I))
      })), N = [{
        label: c.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...A, ...R.map((I) => ({
          label: I.label,
          icon: "tabler:world",
          command: () => b("insert", `{{ ${I.name} }}`)
        }))]
      }], M = r.ofKind("part").filter((I) => !(c.draft.kind === "part" && I.name === c.draft.name));
      if (N.push({ label: "Parts", items: r.ready("part") ? M.length ? M.map((I) => ({ label: I.title, icon: pe.part, command: () => {
        p(I.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [u("Loading parts…")] }), c.face === "html") {
        const I = r.ofKind("asset");
        N.push({ label: "Images", items: r.ready("asset") ? I.length ? I.map((O) => ({ label: O.title, icon: pe.asset, command: () => {
          v(O.name, O.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [u("Loading images…")] });
      }
      return c.draft.kind === "base" && N.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => b("insert", ts)
      }] }), N;
    }), $ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (A, N) => (l(), n(Y, null, [
      i(a(Pl), {
        ref_key: "menu",
        ref: k,
        model: f.value,
        popup: "",
        "aria-label": "Insert into " + (e.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: L(({ item: M, class: I }) => [
          M.icon ? (l(), E(a(z), {
            key: 0,
            icon: M.icon,
            class: re(I),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : V("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      y.value ? (l(), n("p", As, g(y.value), 1)) : V("", !0),
      i(a(Ne), {
        visible: !!S.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: $,
        "aria-label": "Insert image",
        "onUpdate:visible": N[2] || (N[2] = (M) => {
          M || (S.value = void 0);
        })
      }, {
        header: L(() => [
          t("span", Ls, [
            i(a(z), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", Is, [
            t("span", Ns, "Insert " + g(S.value?.title), 1),
            N[3] || (N[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: L(() => [
          i(a(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: N[1] || (N[1] = (M) => S.value = void 0)
          }),
          i(a(D), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: L(() => [
          t("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Ie(m, ["prevent"])
          }, [
            t("div", zs, [
              t("label", {
                class: "mail-field-label",
                for: a(_)
              }, "Alternative text", 8, Es),
              i(a(ve), {
                id: a(_),
                modelValue: T.value,
                "onUpdate:modelValue": N[0] || (N[0] = (M) => T.value = M),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              N[4] || (N[4] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 64));
  }
}), Ps = ["disabled", "inert"], Ms = { class: "mail-form" }, Ds = { class: "mail-field" }, Bs = ["for"], qs = { class: "mail-field" }, Hs = ["for"], Fs = { class: "mail-field-hint" }, Js = { class: "mail-mono" }, Ws = { class: "mail-field" }, Ks = ["for"], Ys = { class: "mail-base-row" }, Gs = { class: "mail-kind" }, Zs = ["id"], Qs = { class: "mail-code-frame mail-code-subject" }, Xs = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, ei = { class: "mail-face-bar" }, ai = { class: "mail-code-frame mail-code-body" }, li = /* @__PURE__ */ se({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const d = va(() => import("./CodeEditor-CIrhfC0V.js")), o = e, { library: c, go: b } = ye();
    c.use("base");
    const r = { base: fe(), title: fe(), description: fe(), face: fe() }, k = w("html"), y = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], C = P(() => c.ofKind("base").map((v) => ({ value: v.name, label: v.title }))), R = P(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), u = w(), p = w();
    function S(v) {
      u.value?.insert(v);
    }
    const T = P(() => {
      const v = o.problem;
      if (v)
        return v.face === "html" || v.face === "text" || v.face === "subject" ? v.face : k.value;
    }), _ = P(() => (o.draft.kind === "message" ? "Body" : "Source") + (k.value === "html" ? ", HTML" : ", plain text"));
    return (v, m) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      i(Qa, { label: "Name and description" }, {
        default: L(() => [
          t("div", Ms, [
            t("div", Ds, [
              t("label", {
                class: "mail-field-label",
                for: r.title
              }, "Name", 8, Bs),
              i(a(ve), {
                id: r.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": m[0] || (m[0] = (f) => e.draft.title = f)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", qs, [
              t("label", {
                class: "mail-field-label",
                for: r.description
              }, "Description", 8, Hs),
              i(a(ve), {
                id: r.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": m[1] || (m[1] = (f) => e.draft.description = f)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Fs, [
              m[9] || (m[9] = Z("Reference ", -1)),
              t("span", Js, g(e.draft.name), 1),
              Z(", used to " + g(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), n(Y, { key: 0 }, [
        t("div", Ws, [
          t("label", {
            class: "mail-field-label",
            for: r.base
          }, "Base template", 8, Ks),
          t("div", Ys, [
            i(a(Me), {
              modelValue: e.draft.base,
              "onUpdate:modelValue": m[2] || (m[2] = (f) => e.draft.base = f),
              "input-id": r.base,
              options: C.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !a(c).ready("base")
            }, {
              value: L(({ value: f }) => [
                t("span", Gs, [
                  i(a(z), {
                    icon: a(pe).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  f && a(c).title("base", f) === void 0 ? (l(), E(a(Ue), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(Y, { key: 1 }, [
                    Z(g(a(c).title("base", f)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            e.draft.base ? (l(), E(a(D), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: m[3] || (m[3] = (f) => a(b)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: re(["mail-field", { "mail-field-invalid": T.value === "subject" || R.value }])
        }, [
          t("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Zs),
          t("div", Qs, [
            i(a(d), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": m[4] || (m[4] = (f) => e.draft.subject = f),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          R.value ? (l(), n("small", Xs, "A subject is one line. Remove the line break.")) : e.problem && T.value === "subject" ? (l(), E(ba, {
            key: 1,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: re(["mail-field", { "mail-field-invalid": e.problem && T.value !== "subject" }])
      }, [
        t("div", ei, [
          i(a(xe), {
            modelValue: k.value,
            "onUpdate:modelValue": m[5] || (m[5] = (f) => k.value = f),
            options: y,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          i(a(D), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: m[6] || (m[6] = (f) => p.value?.toggle(f))
          }, {
            icon: L(() => [
              i(a(z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", ai, [
          k.value === "html" ? (l(), E(a(d), {
            ref_key: "editor",
            ref: u,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": m[7] || (m[7] = (f) => e.draft.html = f),
            label: _.value
          }, null, 8, ["modelValue", "label"])) : (l(), E(a(d), {
            ref_key: "editor",
            ref: u,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": m[8] || (m[8] = (f) => e.draft.text = f),
            label: _.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && T.value !== "subject" ? (l(), E(ba, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : V("", !0)
      ], 2),
      i(Os, {
        ref_key: "inserter",
        ref: p,
        draft: e.draft,
        face: k.value,
        onInsert: S
      }, null, 8, ["draft", "face"])
    ], 8, Ps));
  }
}), ti = { class: "mail-value-field" }, si = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, za = /* @__PURE__ */ se({
  __name: "ValueField",
  props: /* @__PURE__ */ ca({
    type: {},
    itemType: {},
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: [null, Boolean, Number, String, Array, Object] },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ ca(["invalid"], ["update:modelValue"]),
  setup(e, { emit: d }) {
    const o = e, c = Ea(e, "modelValue"), b = d, r = (f) => f === null || ["string", "number", "boolean"].includes(typeof f), k = (f) => f === void 0 || Array.isArray(f) && f.every(r), y = (f) => f === void 0 || !!f && typeof f == "object" && !Array.isArray(f) && Object.values(f).every(($) => typeof $ == "string"), C = w(!1);
    X(() => o.type, () => {
      C.value = !1;
    });
    const R = P(() => C.value ? "written" : o.type === "array" ? k(c.value) ? "list" : "written" : o.type === "object" ? y(c.value) ? "record" : "written" : o.type), u = P({
      get: () => Array.isArray(c.value) ? c.value.map((f) => f === null ? "" : String(f)).join(`
`) : "",
      set: (f) => {
        const $ = f.split(`
`).map((N) => N.trim()).filter(Boolean), A = o.itemType === "number" || o.itemType === "integer";
        c.value = $.length ? $.map((N) => A && N !== "" && !Number.isNaN(Number(N)) ? Number(N) : N) : void 0;
      }
    }), p = w([]);
    X(c, (f) => {
      if (R.value !== "record") return;
      const $ = f ?? {};
      JSON.stringify(Object.fromEntries(p.value.filter((A) => A.key).map((A) => [A.key, A.value]))) !== JSON.stringify($) && (p.value = Object.entries($).map(([A, N]) => ({ key: A, value: N })));
    }, { immediate: !0 });
    function S() {
      const f = p.value.filter(($) => $.key.trim());
      c.value = f.length ? Object.fromEntries(f.map(($) => [$.key.trim(), $.value])) : void 0;
    }
    const T = w(""), _ = w("");
    X([c, R], () => {
      R.value === "written" && !_.value && (T.value = c.value === void 0 ? "" : JSON.stringify(c.value, null, 2));
    }, { immediate: !0 });
    function v(f) {
      if (T.value = f, !f.trim()) {
        _.value = "", c.value = void 0;
        return;
      }
      try {
        const $ = JSON.parse(f), A = o.type === "array" ? Array.isArray($) : !!$ && typeof $ == "object" && !Array.isArray($);
        _.value = A ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', A && (c.value = $);
      } catch {
        _.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    X(_, (f) => b("invalid", f), { immediate: !0 });
    const m = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (f, $) => (l(), n("div", ti, [
      R.value === "string" ? (l(), E(a(ve), {
        key: 0,
        "model-value": typeof c.value == "string" ? c.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": $[0] || ($[0] = (A) => c.value = A || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : R.value === "number" || R.value === "integer" ? (l(), E(a(Dl), {
        key: 1,
        "model-value": typeof c.value == "number" ? c.value : null,
        "aria-label": e.label,
        "max-fraction-digits": R.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": $[1] || ($[1] = (A) => c.value = A ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : R.value === "boolean" ? (l(), E(a(xe), {
        key: 2,
        "model-value": typeof c.value == "boolean" ? c.value : null,
        options: m,
        "option-label": "label",
        "option-value": "value",
        "aria-label": e.label,
        disabled: e.disabled,
        "onUpdate:modelValue": $[2] || ($[2] = (A) => c.value = typeof A == "boolean" ? A : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : R.value === "list" ? (l(), E(a(ma), {
        key: 3,
        modelValue: u.value,
        "onUpdate:modelValue": $[3] || ($[3] = (A) => u.value = A),
        "aria-label": e.label,
        rows: "3",
        "auto-resize": "",
        disabled: e.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : R.value === "record" ? (l(), n(Y, { key: 4 }, [
        (l(!0), n(Y, null, me(p.value, (A, N) => (l(), n("div", {
          key: N,
          class: "mail-value-entry"
        }, [
          i(a(ve), {
            modelValue: A.key,
            "onUpdate:modelValue": [(M) => A.key = M, S],
            "aria-label": e.label + ", name " + (N + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(a(ve), {
            modelValue: A.value,
            "onUpdate:modelValue": [(M) => A.value = M, S],
            "aria-label": e.label + ", value " + (N + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(a(D), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (A.key || "entry"),
            disabled: e.disabled,
            onClick: (M) => {
              p.value.splice(N, 1), S();
            }
          }, {
            icon: L(() => [
              i(a(z), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        i(a(D), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: $[4] || ($[4] = (A) => p.value.push({ key: "", value: "" }))
        }, {
          icon: L(() => [
            i(a(z), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(Y, { key: 5 }, [
        i(a(ma), {
          "model-value": T.value,
          "aria-label": e.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!_.value,
          disabled: e.disabled,
          fluid: "",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        _.value ? (l(), n("small", si, g(_.value), 1)) : V("", !0)
      ], 64)),
      (e.type === "array" || e.type === "object") && R.value !== "written" ? (l(), E(a(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: e.disabled,
        onClick: $[5] || ($[5] = (A) => C.value = !0)
      }, null, 8, ["disabled"])) : V("", !0)
    ]));
  }
}), ii = ["disabled", "inert"], ni = { class: "mail-sr-only" }, oi = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ri = {
  key: 1,
  class: "mail-muted"
}, ui = ["aria-label"], di = { class: "mail-variable-grid" }, ci = { class: "mail-field" }, vi = { class: "mail-field" }, mi = { class: "mail-field" }, fi = ["id"], bi = { class: "mail-variable-check" }, yi = { class: "mail-field" }, pi = { class: "mail-variable-values" }, gi = {
  key: 0,
  class: "mail-field"
}, hi = { class: "mail-field" }, ki = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, $i = /* @__PURE__ */ se({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: d }) {
    const o = e, c = d, b = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let r = 0;
    function k(_) {
      const v = new Set(_.schema.required ?? []);
      return Object.entries(_.schema.properties).map(([m, f]) => {
        const $ = f.items;
        return {
          id: r++,
          name: m,
          schema: f,
          title: typeof f.title == "string" ? f.title : "",
          type: b.some((A) => A.value === f.type) ? f.type : "string",
          itemType: typeof $?.type == "string" ? $.type : void 0,
          required: v.has(m),
          description: typeof f.description == "string" ? f.description : "",
          sample: _.samples[m],
          fallback: f.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const y = w([]);
    y.value = k(o.draft), X(() => o.draft, (_) => {
      y.value = k(_);
    });
    function C(_, v) {
      if (v === void 0) return !0;
      switch (_.type) {
        case "string":
          return typeof v == "string";
        case "number":
          return typeof v == "number";
        case "integer":
          return typeof v == "number" && Number.isInteger(v);
        case "boolean":
          return typeof v == "boolean";
        case "array":
          return Array.isArray(v);
        default:
          return !!v && typeof v == "object" && !Array.isArray(v);
      }
    }
    function R(_, v) {
      _.type = v, C(_, _.sample) || (_.sample = void 0), C(_, _.fallback) || (_.fallback = void 0);
    }
    const u = P(() => y.value.map((_) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(_.name) ? y.value.some((v) => v !== _ && v.name === _.name) ? "Another one has this name." : _.valueErrors.sample || _.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    X(u, (_) => c("invalid", _.some(Boolean)), { immediate: !0 }), X(y, (_) => {
      if (u.value.some(Boolean)) return;
      const v = {}, m = {};
      for (const $ of _) {
        const A = { ...$.schema, type: $.type };
        for (const [N, M] of [["title", $.title], ["description", $.description]])
          M ? A[N] = M : delete A[N];
        $.fallback !== void 0 ? A.default = $.fallback : delete A.default, v[$.name] = A, $.sample !== void 0 && (m[$.name] = $.sample);
      }
      const f = _.filter(($) => $.required).map(($) => $.name);
      o.draft.schema = { ...o.draft.schema, properties: v, required: f.length ? f : void 0 }, o.draft.samples = m;
    }, { deep: !0 });
    function p() {
      let _ = y.value.length + 1;
      for (; y.value.some((v) => v.name === `value_${_}`); ) _++;
      y.value.push({
        id: r++,
        name: `value_${_}`,
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
    const S = P(() => o.draft.kind === "part"), T = P(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${ft[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (_, v) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t("legend", ni, g(e.label), 1),
      T.value ? (l(), n("p", oi, g(T.value), 1)) : V("", !0),
      y.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), n(Y, null, me(y.value, (m, f) => (l(), n("li", {
          key: m.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": u.value[f] }])
        }, [
          t("div", di, [
            t("label", ci, [
              v[0] || (v[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              i(a(ve), {
                modelValue: m.name,
                "onUpdate:modelValue": ($) => m.name = $,
                class: "mail-mono-input",
                invalid: !!u.value[f] && !m.valueErrors.sample && !m.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", vi, [
              v[1] || (v[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              i(a(ve), {
                modelValue: m.title,
                "onUpdate:modelValue": ($) => m.title = $,
                placeholder: m.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", mi, [
              t("span", {
                id: "type-" + m.id,
                class: "mail-field-label"
              }, "Type", 8, fi),
              i(a(Me), {
                "model-value": m.type,
                options: b,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + m.id,
                "onUpdate:modelValue": ($) => R(m, $)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", bi, [
              i(a(Ml), {
                modelValue: m.required,
                "onUpdate:modelValue": ($) => m.required = $,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              v[2] || (v[2] = t("span", null, "Required", -1))
            ]),
            i(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + m.name,
              title: "Remove " + m.name,
              onClick: ($) => y.value.splice(f, 1)
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", yi, [
            v[3] || (v[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            i(a(ve), {
              modelValue: m.description,
              "onUpdate:modelValue": ($) => m.description = $,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", pi, [
            S.value ? (l(), n("div", gi, [
              v[4] || (v[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              i(za, {
                modelValue: m.fallback,
                "onUpdate:modelValue": ($) => m.fallback = $,
                type: m.type,
                "item-type": m.itemType,
                label: "Default of " + m.name,
                onInvalid: ($) => m.valueErrors.fallback = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : V("", !0),
            t("div", hi, [
              v[5] || (v[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              i(za, {
                modelValue: m.sample,
                "onUpdate:modelValue": ($) => m.sample = $,
                type: m.type,
                "item-type": m.itemType,
                label: "Sample value of " + m.name,
                onInvalid: ($) => m.valueErrors.sample = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          u.value[f] ? (l(), n("small", ki, g(m.name) + ": " + g(u.value[f]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, ui)) : (l(), n("p", ri, g(e.draft.title) + " takes no " + g(e.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        i(a(D), {
          label: S.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: p
        }, {
          icon: L(() => [
            i(a(z), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, ii));
  }
}), wi = { class: "kx-modal-head-icon" }, _i = {
  key: 0,
  class: "kx-modal-head-text"
}, xi = { class: "kx-modal-head-title" }, Ci = {
  key: 0,
  class: "kx-modal-head-sub"
}, Vi = {
  key: 1,
  class: "kx-modal-head-sub"
}, Si = {
  key: 0,
  class: "mail-form"
}, Ti = { class: "mail-face-bar" }, Ri = {
  key: 0,
  class: "mail-version-subject"
}, Ui = { class: "mail-mono-block" }, ji = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Ai = /* @__PURE__ */ se({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean },
    included: { type: Boolean }
  },
  emits: ["close", "restore", "reset"],
  setup(e, { emit: d }) {
    const o = va(() => import("./CodeEditor-CIrhfC0V.js")), c = va(() => import("./DiffView-CjA70e3n.js")), b = e, r = d;
    Ce(() => !!b.revision);
    const k = w("version"), y = w("html");
    X(() => b.revision, (v) => {
      v && (k.value = b.compare ? "compare" : "version", y.value = "html");
    });
    const C = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], R = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], u = P(() => b.revision?.revision === b.current.revision), p = P(() => {
      const v = b.revision;
      return v ? b.included || v.state === "original" && v.action === "reset" ? `${b.current.title}: the version included with ${b.current.origin_label}` : `${b.current.title}, version ${v.version}` : "";
    }), S = P(() => b.revision ? y.value === "html" ? b.revision.content.html : b.revision.content.text : ""), T = P(() => y.value === "html" ? b.current.html : b.current.text), _ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (v, m) => (l(), E(a(Ne), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: _,
      "aria-label": p.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": m[5] || (m[5] = (f) => {
        f || r("close");
      })
    }, {
      header: L(() => [
        t("span", wi, [
          i(a(z), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), n("span", _i, [
          t("span", xi, g(p.value), 1),
          e.included ? (l(), n("span", Ci, "Compare it with your customized version, or reset to it.")) : (l(), n("span", Vi, g(a(ga)[e.revision.action]) + " by " + g(a(_e)(e.revision.author_label, e.revision.author)) + " · " + g(a(Ge)(e.revision.created_at)), 1))
        ])) : V("", !0)
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: m[2] || (m[2] = (f) => r("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), E(a(D), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: m[3] || (m[3] = (f) => r("reset"))
        }, {
          icon: L(() => [
            i(a(z), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !u.value ? (l(), E(a(D), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: m[4] || (m[4] = (f) => r("restore", e.revision))
        }, {
          icon: L(() => [
            i(a(z), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : V("", !0)
      ]),
      default: L(() => [
        e.revision ? (l(), n("div", Si, [
          t("div", Ti, [
            u.value ? V("", !0) : (l(), E(a(xe), {
              key: 0,
              modelValue: k.value,
              "onUpdate:modelValue": m[0] || (m[0] = (f) => k.value = f),
              options: C,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            i(a(xe), {
              modelValue: y.value,
              "onUpdate:modelValue": m[1] || (m[1] = (f) => y.value = f),
              options: R,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && k.value === "version" ? (l(), n("p", Ri, [
            m[6] || (m[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            m[7] || (m[7] = Z()),
            t("span", Ui, g(e.revision.content.subject), 1)
          ])) : V("", !0),
          k.value === "version" ? (l(), n("div", ji, [
            (l(), E(a(o), {
              key: y.value,
              "model-value": S.value,
              label: p.value + (y.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), E(a(c), {
            key: "diff-" + y.value,
            before: S.value,
            after: T.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Li = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ii = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ni = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, zi = {
  key: 3,
  class: "mail-history"
}, Ei = { class: "mail-history-head" }, Oi = { class: "mail-history-main" }, Pi = { class: "mail-history-title" }, Mi = { class: "mail-sub" }, Di = {
  key: 0,
  class: "mail-history-note"
}, Bi = { class: "mail-history-actions" }, qi = /* @__PURE__ */ se({
  __name: "HistoryList",
  props: {
    resource: {},
    revisions: {},
    loading: { type: Boolean },
    error: {},
    busy: {}
  },
  emits: ["show", "restore", "retry"],
  setup(e) {
    return (d, o) => e.error ? (l(), n("div", Li, [
      t("span", null, g(e.error), 1),
      i(a(D), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o[0] || (o[0] = (c) => d.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (l(), n("p", Ii, [
      i(a(z), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = Z("Loading history…", -1))
    ])) : e.revisions.length ? (l(), n("ol", zi, [
      (l(!0), n(Y, null, me(e.revisions, (c) => (l(), n("li", {
        key: c.revision,
        class: "mail-history-row"
      }, [
        t("div", Ei, [
          t("div", Oi, [
            t("span", Pi, [
              Z(" Version " + g(c.version) + " · " + g(a(ga)[c.action]) + g(c.restored_from ? " from version " + c.restored_from : "") + " ", 1),
              c.revision === e.resource.revision ? (l(), E(a(Pe), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Mi, g(a(_e)(c.author_label, c.author)) + " · " + g(a(Ge)(c.created_at)), 1),
            c.note ? (l(), n("span", Di, g(c.note), 1)) : V("", !0)
          ]),
          t("div", Bi, [
            i(a(D), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (b) => d.$emit("show", c)
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            c.revision !== e.resource.revision ? (l(), E(a(D), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: e.busy === c.revision,
              disabled: e.busy !== void 0,
              onClick: (b) => d.$emit("restore", c)
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
          ])
        ])
      ]))), 128))
    ])) : (l(), n("p", Ni, g(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Hi = { class: "kx-modal-head-icon mail-head-warn" }, Fi = { class: "kx-modal-head-text" }, Ji = { class: "kx-modal-head-title" }, Wi = { class: "mail-dialog-text" }, Ki = {
  key: 0,
  class: "mail-list"
}, Xa = /* @__PURE__ */ se({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e;
    Ce(() => !!o.refusal);
    const c = d, b = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(k) {
      c("close"), k();
    }
    return (k, y) => (l(), E(a(Ne), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: b,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": y[1] || (y[1] = (C) => {
        C || c("close");
      })
    }, {
      header: L(() => [
        t("span", Hi, [
          i(a(z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", Fi, [
          t("span", Ji, g(e.refusal?.header), 1)
        ])
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Close",
          autofocus: "",
          onClick: y[0] || (y[0] = (C) => c("close"))
        })
      ]),
      default: L(() => [
        t("p", Wi, g(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), n("ul", Ki, [
          (l(!0), n(Y, null, me(e.refusal.links, (C) => (l(), n("li", {
            key: C.label
          }, [
            i(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (R) => r(C.open)
            }, {
              default: L(() => [
                i(a(z), {
                  icon: C.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, g(C.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Yi = { class: "mail-stack" }, Gi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Zi = {
  key: 0,
  class: "mail-muted"
}, Qi = {
  key: 1,
  class: "mail-list"
}, Xi = { key: 1 }, en = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, an = { class: "mail-group-head" }, ln = {
  key: 0,
  class: "mail-muted"
}, tn = {
  key: 1,
  class: "mail-list"
}, sn = { class: "mail-list-main" }, nn = {
  key: 0,
  class: "mail-sub"
}, on = { class: "mail-muted" }, rn = /* @__PURE__ */ se({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const d = e, { library: o, go: c, capabilities: b } = ye(), r = P(() => (d.resource.used_by?.messages ?? []).map((y) => ({
      name: y,
      title: o.title("message", y)
    }))), k = P(() => d.resource.used_by?.recent_senders ?? []);
    return (y, C) => (l(), n("div", Yi, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), n("section", Gi, [
        C[1] || (C[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", Qi, [
          (l(!0), n(Y, null, me(r.value, (R) => (l(), n("li", {
            key: R.name
          }, [
            i(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (u) => a(c)({ name: "resource", kind: "message", resource: R.name, section: "content" })
            }, {
              default: L(() => [
                i(a(z), {
                  icon: a(pe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                R.title === void 0 ? (l(), E(a(Ue), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", Xi, g(R.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Zi, "No messages " + g(e.resource.kind === "asset" ? "show" : "use") + " " + g(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), n("section", en, [
        t("div", an, [
          C[2] || (C[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(b)?.administer_delivery ? (l(), E(a(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: C[0] || (C[0] = (R) => a(c)({ name: "activity", template: e.resource.name }))
          })) : V("", !0)
        ]),
        k.value.length ? (l(), n("ul", tn, [
          (l(!0), n(Y, null, me(k.value, (R) => (l(), n("li", {
            key: R.sender + (R.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            i(a(z), {
              icon: R.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", sn, [
              t("span", null, g(a(_e)(R.sender_label, R.sender)), 1),
              R.origin ? (l(), n("span", nn, g(a(na)(R.origin)), 1)) : V("", !0)
            ]),
            t("span", on, g(a(ge)(R.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", ln, "Nobody has sent " + g(e.resource.title) + " recently.", 1))
      ])) : V("", !0)
    ]));
  }
}), un = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, dn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, cn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, vn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, mn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, fn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, bn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, yn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, pn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, gn = {
  key: 6,
  class: "kx-notice mail-customized"
}, hn = { class: "mail-customized-text" }, kn = { class: "mail-editor-layout" }, $n = /* @__PURE__ */ se({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const d = e, { library: o, capabilities: c, delivery: b, go: r, create: k, setDirty: y, setTitle: C } = ye(), R = P(() => ({ kind: d.kind, name: d.name })), u = ke(), p = w(), S = w(!0), T = w(!1), _ = w(!1), v = w(""), m = w(), f = Re(), $ = P(() => !!p.value && !!u.value && !Gt(p.value, u.value));
    X($, (B) => y(B), { immediate: !0 }), Fe(() => y(!1));
    async function A(B = {}) {
      const q = f();
      try {
        const Q = await ie.get(R.value);
        if (!q()) return;
        if (B.keepDraft && $.value && u.value && Q.revision !== u.value.revision) {
          m.value = { revision: Q.revision, by: _e(Q.author_label, Q.author) || "Someone" };
          return;
        }
        u.value = Q, p.value = Se(Q), N.value = void 0, C(Q.title), m.value = void 0, T.value = _.value = !1, v.value = "";
      } catch (Q) {
        if (!q()) return;
        T.value = Je(Q), _.value = Ye(Q), v.value = T.value || _.value ? "" : oe(Q, "This resource could not be loaded."), T.value && (u.value = void 0, p.value = void 0);
      } finally {
        q() && (S.value = !1);
      }
    }
    const N = w(), M = ke([]), I = w(!1), O = w(""), ae = Re();
    async function le() {
      const B = ae();
      I.value = !0;
      try {
        const q = await ie.history(R.value);
        if (!B()) return;
        M.value = q, O.value = "";
      } catch (q) {
        if (!B()) return;
        O.value = Je(q) ? "" : oe(q, "History could not be loaded.");
      } finally {
        B() && (I.value = !1);
      }
    }
    async function H() {
      await Promise.all([A({ keepDraft: !0 }), le()]);
    }
    sa(H), Oa((B) => {
      B.kind === d.kind && B.name === d.name ? H() : d.kind === "base" && B.kind === "message" && A({ keepDraft: !0 });
    });
    const U = w(), x = w(""), h = w(!1), s = w(""), j = w(), ne = P(() => u.value?.title ?? d.name), K = P(() => {
      const B = u.value, q = ne.value, Q = B?.used_by?.messages?.length ?? 0, ue = B?.used_by?.recent_senders?.find((ua) => ua.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ue?.origin ? ` Sent recently by “${na(ue.origin)}”.` : "") },
          base: { title: "Layout", description: Q ? `The frame around the ${ge(Q, "message")} that ${Q === 1 ? "uses" : "use"} ${q}.` : `The frame around messages that use ${q}.` },
          part: { title: "Content", description: `Shown wherever ${q} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${q} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${q}.` : d.kind === "base" ? `Messages that use ${q}.` : `Templates that include ${q}.`
        },
        history: { title: "History", description: `Every saved version of ${q}, newest first.` }
      }[d.section];
    }), F = P(() => {
      const B = u.value;
      return B?.state !== "customized" ? "" : `Customized by ${_e(B.author_label, B.author)} ${$l(B.updated_at)} from the version included with ${B.origin_label}.`;
    }), J = P(() => {
      const B = u.value;
      if (!B?.original) return;
      const { kind: q, name: Q, title: ue, description: de } = B;
      return {
        kind: q,
        name: Q,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: q, name: Q, title: ue, description: de, ...B.original }
      };
    }), te = w(), he = w(), Ve = w(!1), ee = P(() => he.value ?? te.value);
    X(() => JSON.stringify(p.value), () => {
      he.value = void 0;
    });
    const G = P(() => d.kind === "message" && /[\r\n]/.test(p.value?.subject ?? "")), W = P(() => !!ee.value || Ve.value || !!m.value || G.value), $e = P(() => m.value ? "Discard your changes to load the newer version first." : Ve.value ? "Fix the variables first." : G.value ? "Put the subject on one line first." : ee.value ? "Fix the error first." : ""), je = w(!1);
    function oa(B, q) {
      je.value = ["invalid_config", "from_name_invalid"].includes(we(B) ?? ""), h.value = we(B) === "mail_revision_conflict", h.value && H(), x.value = oe(B, q);
    }
    function Sa() {
      if (!u.value) return;
      const B = !!m.value;
      p.value = Se(u.value), m.value = void 0, he.value = void 0, N.value = void 0, B && A();
    }
    const ze = w(!1), Ze = w(""), Qe = w();
    function ll() {
      Ze.value = "", Qe.value = void 0, ze.value = !0;
    }
    async function tl(B) {
      const q = u.value, Q = p.value;
      if (!(!q || !Q || U.value !== void 0)) {
        U.value = "save", Ze.value = x.value = s.value = "", Qe.value = void 0;
        try {
          const ue = await ie.update(Q, q.revision, B || void 0);
          u.value = { ...q, ...ue }, p.value = Se(u.value), ze.value = !1, s.value = N.value ? `Version ${N.value.version} from ${Ge(N.value.created_at)} is now in effect.` : `Saved ${ue.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, N.value = void 0, await H();
        } catch (ue) {
          const de = Ke(ue), Ae = de?.resource?.kind === Q.kind && de.resource.name === Q.name;
          de?.dependents?.length && !Ae ? Qe.value = { names: de.dependents, reason: de.reasons?.[0]?.message ?? de.message } : de ? (he.value = de, ze.value = !1) : we(ue) === "mail_revision_conflict" ? (ze.value = !1, await A({ keepDraft: !0 })) : Ze.value = oe(ue, `${Q.title} could not be saved.`);
        } finally {
          U.value = void 0;
        }
      }
    }
    async function sl() {
      const B = u.value;
      if (!(!B || U.value !== void 0)) {
        U.value = "test", x.value = s.value = "";
        try {
          await ie.sendTest(B.name), s.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (q) {
          oa(q, "The test could not be sent.");
        } finally {
          U.value = void 0;
        }
      }
    }
    const Xe = P(() => $.value ? "Save your changes to send a test." : c.value?.send ? b.value && !b.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Ta() {
      const B = u.value;
      if (!(!B || U.value !== void 0 || !await Te.confirm({
        header: `Reset ${B.title} to the original?`,
        message: `Your changes are replaced by the version included with ${B.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        U.value = "reset", x.value = s.value = "", h.value = !1;
        try {
          u.value = await ie.reset(R.value, B.revision), p.value = Se(u.value), s.value = `${B.title} is back to the original. Your changes are in History.`, await H();
        } catch (Q) {
          oa(Q, `${B.title} could not be reset.`);
        } finally {
          U.value = void 0;
        }
      }
    }
    const De = w(), Ra = w(!1), Ua = w(!1);
    function ja(B, q = !1, Q = !1) {
      Ra.value = q, Ua.value = Q, De.value = B;
    }
    async function Aa(B) {
      const q = u.value;
      if (!q || U.value !== void 0 || $.value && !await Te.confirm({
        header: `Replace your unsaved changes with version ${B.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      p.value = { ...Se(B.content), kind: q.kind, name: q.name }, N.value = B, De.value = void 0, x.value = "";
      const Q = `Version ${B.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? s.value = Q : (ra = Q, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function La(B, q, Q) {
      const ue = q.map((Ae) => o.title("message", Ae) ?? Ae), de = B.kind === "base" ? "use" : "include";
      j.value = {
        header: `${B.title} is in use`,
        message: `${ge(q.length, "message")} ${q.length === 1 ? de + "s" : de} it: ${ue.join(", ")}. Remove it from ${q.length === 1 ? "that message" : "them"} first.`,
        links: q.map((Ae, ua) => ({ label: ue[ua], open: () => r({ name: "resource", kind: "message", resource: Ae, section: "content" }) }))
      };
    }
    async function il() {
      const B = u.value;
      if (!B || B.state !== "created" || U.value !== void 0) return;
      const q = B.used_by?.messages ?? [];
      if (B.kind === "base" && q.length) {
        La(B, q);
        return;
      }
      if (await Te.confirm({
        header: `Delete ${B.title}?`,
        message: B.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${be[B.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        U.value = "delete", x.value = s.value = "";
        try {
          await ie.remove(R.value, B.revision), y(!1), r({ name: "library", section: fa(d.kind) });
        } catch (ue) {
          const de = Ke(ue);
          de?.dependents?.length ? La(B, de.dependents) : oa(ue, `${B.title} could not be deleted.`);
        } finally {
          U.value = void 0;
        }
      }
    }
    function nl() {
      const B = u.value;
      B && k({ kind: d.kind, from: { kind: B.kind, name: B.name } });
    }
    const ol = P(() => d.kind === "base" ? u.value?.used_by?.messages : void 0), ea = P(() => U.value === "save");
    A(), X(() => d.section, (B) => {
      B === "history" && !M.value.length && le();
    }, { immediate: !0 });
    let ra = "";
    return X(() => d.section, () => {
      s.value = ra, ra = "", x.value = "";
    }), (B, q) => (l(), n(Y, null, [
      T.value ? (l(), E(_a, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(pa)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: q[0] || (q[0] = (Q) => a(r)({ name: "library", section: a(fa)(e.kind) }))
      }, null, 8, ["cta"])) : _.value ? (l(), n("p", un, [
        i(a(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        q[11] || (q[11] = Z("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(Y, { key: 2 }, [
        i(ia, {
          title: K.value.title,
          description: K.value.description
        }, ya({ _: 2 }, [
          u.value ? {
            name: "actions",
            fn: L(() => [
              $.value ? (l(), E(wl, {
                key: 0,
                busy: ea.value,
                "review-disabled": W.value,
                onDiscard: Sa,
                onReview: ll
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(Y, { key: 1 }, [
                e.kind === "message" ? (l(), E(a(D), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: U.value === "test",
                  disabled: !!Xe.value || U.value !== void 0,
                  title: Xe.value || void 0,
                  onClick: sl
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : V("", !0),
                i(a(D), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: U.value !== void 0,
                  onClick: nl
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                u.value.state === "created" ? (l(), E(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: U.value === "delete",
                  disabled: U.value !== void 0,
                  onClick: il
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ], 64))
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "description"]),
        v.value ? (l(), n("div", dn, [
          t("span", null, g(v.value), 1),
          i(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: q[1] || (q[1] = (Q) => H())
          })
        ])) : S.value ? (l(), n("p", cn, [
          i(a(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          Z("Loading " + g(ne.value) + "…", 1)
        ])) : V("", !0),
        u.value && p.value ? (l(), n(Y, { key: 2 }, [
          m.value ? (l(), n("p", vn, [
            i(a(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              Z(g(m.value.by) + " saved " + g(u.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              i(a(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Sa
              })
            ])
          ])) : V("", !0),
          $.value && $e.value && !m.value ? (l(), n("p", mn, g($e.value), 1)) : e.kind === "message" && !$.value && Xe.value ? (l(), n("p", fn, [
            Z(g(Xe.value) + " ", 1),
            a(c)?.administer_delivery && a(b) && !a(b).configured ? (l(), E(a(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: q[2] || (q[2] = (Q) => a(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          x.value && h.value ? (l(), n("p", bn, [
            i(a(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            Z(g(x.value), 1)
          ])) : x.value ? (l(), n("p", yn, [
            t("span", null, g(x.value), 1),
            je.value && a(c)?.administer_delivery ? (l(), E(a(D), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: q[3] || (q[3] = (Q) => a(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          s.value ? (l(), n("p", pn, [
            i(a(z), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            Z(g(s.value), 1)
          ])) : V("", !0),
          F.value && e.section === "content" ? (l(), n("div", gn, [
            i(a(z), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", hn, [
              Z(g(F.value), 1),
              $.value ? (l(), n(Y, { key: 0 }, [
                Z(" Save or discard your changes to reset it.")
              ], 64)) : V("", !0)
            ]),
            J.value ? (l(), E(a(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: q[4] || (q[4] = (Q) => ja(J.value, !0, !0))
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : V("", !0),
            i(a(D), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: U.value === "reset",
              disabled: U.value !== void 0 || $.value,
              onClick: Ta
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : V("", !0),
          fl(t("div", kn, [
            i(li, {
              draft: p.value,
              problem: ee.value,
              disabled: ea.value
            }, null, 8, ["draft", "problem", "disabled"]),
            i(hs, {
              draft: p.value,
              messages: ol.value,
              onProblem: q[5] || (q[5] = (Q) => te.value = Q)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [bl, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), E($i, {
            key: 7,
            draft: p.value,
            label: K.value.title,
            problem: ee.value,
            disabled: ea.value,
            onInvalid: q[6] || (q[6] = (Q) => Ve.value = Q)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), E(rn, {
            key: 8,
            resource: u.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), E(qi, {
            key: 9,
            resource: u.value,
            revisions: M.value,
            loading: I.value,
            error: O.value,
            busy: typeof U.value == "number" ? U.value : U.value ? -1 : void 0,
            onShow: ja,
            onRestore: Aa,
            onRetry: le
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      u.value && p.value ? (l(), E(js, {
        key: 3,
        visible: ze.value,
        saved: a(Se)(u.value),
        draft: p.value,
        busy: ea.value,
        error: Ze.value,
        dependents: Qe.value,
        "suggested-note": N.value ? `Restore version ${N.value.version}` : void 0,
        onClose: q[7] || (q[7] = (Q) => ze.value = !1),
        onSave: tl
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : V("", !0),
      u.value ? (l(), E(Ai, {
        key: 4,
        revision: De.value,
        current: u.value,
        compare: Ra.value,
        included: Ua.value,
        busy: typeof U.value == "number" || U.value === "reset",
        onClose: q[8] || (q[8] = (Q) => De.value = void 0),
        onRestore: Aa,
        onReset: q[9] || (q[9] = (Q) => {
          De.value = void 0, Ta();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : V("", !0),
      i(Xa, {
        refusal: j.value,
        onClose: q[10] || (q[10] = (Q) => j.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), aa = /* @__PURE__ */ new Map();
function wn(e, d) {
  const o = aa.get(e);
  if (o && o.revision >= d) return o.url;
  const c = Promise.resolve(jl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((b) => b.data instanceof Blob ? URL.createObjectURL(b.data) : void 0, () => {
    aa.get(e)?.url === c && aa.delete(e);
  });
  return aa.set(e, { revision: d, url: c }), o && o.url.then((b) => {
    b && URL.revokeObjectURL(b);
  }), c;
}
const _n = ["src", "alt"], xn = {
  key: 0,
  "aria-hidden": "true"
}, el = /* @__PURE__ */ se({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(e) {
    const d = e, o = w();
    X(() => [d.name, d.revision], async ([b, r]) => {
      o.value = void 0, o.value = await wn(b, r);
    }, { immediate: !0 });
    const c = P(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (b, r) => (l(), n("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: e.alt ?? ""
      }, null, 8, _n)) : (l(), n(Y, { key: 1 }, [
        i(a(z), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        c.value ? (l(), n("span", xn, g(c.value), 1)) : V("", !0)
      ], 64))
    ], 2));
  }
});
function qe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Cn(e, d) {
  return e;
}
function Vn(e, d, o) {
  if (d !== void 0 && !d) return null;
  const c = qe(e) ? e : {}, b = [
    c,
    qe(c.data) ? c.data : null,
    qe(c.payload) ? c.payload : null,
    qe(c.detail) ? c.detail : null
  ].filter(Boolean);
  for (const r of b) {
    if (r.event !== "component.meta.changed" && r.event !== "component.deleting" && r.event !== "component.deleted") continue;
    const k = String(r.component_id || ""), y = String(c.topic || r.topic || "");
    if (d === void 0) {
      if (!k && (!y.startsWith("component.") || y === "component.")) continue;
    } else if (k && k !== d || !k && y !== `component.${d}`) continue;
    const C = k || d || y.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: C, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: C } : {
      event: "component.meta.changed",
      component_id: C,
      meta: Cn(qe(r.meta) ? r.meta : {}),
      deleted: Array.isArray(r.deleted) ? r.deleted.map(String) : []
    };
  }
  return null;
}
function Sn(e, d, o) {
  const c = Vn(e, d);
  return c?.event === "component.meta.changed" ? c : null;
}
function Tn(e, d, o) {
  if (!e) return null;
  const c = Al(`component.${e}`, (b) => {
    const r = Sn(b, e);
    r && d(r);
  });
  return typeof c == "function" ? c : null;
}
class la extends Error {
}
function Rn(e, d) {
  return new Promise((o, c) => {
    let b = null, r = !1, k = !1, y = !1;
    const C = (u) => {
      y || (y = !0, b?.(), u ? c(u) : o());
    };
    async function R() {
      if (!y) {
        if (d.cancelled) {
          C(new la("cancelled"));
          return;
        }
        if (r) {
          k = !0;
          return;
        }
        r = !0;
        try {
          const u = await Da.state(e);
          u.status === "completed" ? C() : u.status === "error" ? C(new la(u.error ?? "")) : b || (b = Tn(u.component_id, () => {
            R();
          }), b ? k = !0 : C(new la("")));
        } catch (u) {
          C(u);
        } finally {
          r = !1, k && !y && (k = !1, R());
        }
      }
    }
    R();
  });
}
const Un = { class: "kx-modal-head-icon" }, jn = { class: "kx-modal-head-text" }, An = { class: "kx-modal-head-title" }, Ln = { class: "kx-modal-head-sub" }, In = ["disabled", "inert"], Nn = ["for"], zn = { class: "mail-muted" }, En = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, On = {
  key: 0,
  class: "mail-field"
}, Pn = ["for"], Mn = ["for"], Dn = ["id"], Bn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, qn = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Hn = 1024 * 1024, al = /* @__PURE__ */ se({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, go: r } = ye(), k = { file: fe(), title: fe(), name: fe() };
    Ce(() => o.visible);
    const y = ["image/png", "image/jpeg", "image/gif"], C = w(), R = w(), u = w(""), p = w(""), S = w(!1), T = w(!1), _ = w();
    let v = { cancelled: !1 };
    const m = w(""), f = w(""), $ = w("");
    X(() => o.visible, (H) => {
      if (!H) {
        v.cancelled = !0;
        return;
      }
      v = { cancelled: !1 }, o.replace || b.ensure("asset"), C.value = R.value = void 0, u.value = o.replace?.title ?? "", p.value = o.replace?.name ?? "", S.value = !1, m.value = f.value = $.value = "";
    }), X(u, (H) => {
      !o.replace && !S.value && (p.value = Ba(H));
    });
    function A(H) {
      return new Promise((U) => {
        const x = URL.createObjectURL(H), h = new Image();
        h.onload = () => {
          U({ width: h.naturalWidth, height: h.naturalHeight }), URL.revokeObjectURL(x);
        }, h.onerror = () => {
          U(void 0), URL.revokeObjectURL(x);
        }, h.src = x;
      });
    }
    async function N(H) {
      const U = Array.isArray(H.files) ? H.files[0] : H.files;
      if (f.value = "", C.value = void 0, !!U) {
        if (!y.includes(U.type)) {
          f.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (U.size > Hn) {
          f.value = "Images must be 1 MB or smaller.";
          return;
        }
        C.value = U, R.value = await A(U), !o.replace && !u.value && (u.value = U.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function M() {
      return $.value = "", o.replace ? !0 : (qa.test(p.value) ? b.find("asset", p.value) && ($.value = `An image named ${p.value} already exists. Choose another name or replace ${p.value}.`) : $.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !$.value);
    }
    async function I() {
      if (T.value || !C.value || !u.value.trim() || !M()) return;
      T.value = !0, m.value = "";
      const H = v;
      try {
        _.value = "upload";
        const U = await Da.add(C.value), x = { name: p.value, upload_id: U, title: u.value.trim(), ...R.value }, h = () => o.replace ? ie.replaceAsset(x, o.replace.revision) : ie.addAsset(x);
        _.value = "save";
        let s;
        try {
          s = await h();
        } catch (j) {
          if (we(j) !== "upload_still_processing") throw j;
          _.value = "process", await Rn(U, H), _.value = "save", s = await h();
        }
        b.patch("asset", s.name, wa(s)), c("done", s), c("close"), o.replace || r({ name: "library", section: "assets", asset: s.name });
      } catch (U) {
        if (H.cancelled) return;
        U instanceof la ? m.value = "The image could not be processed. Try another file, or upload it again." : we(U) === "mail_revision_conflict" && !o.replace ? $.value = `An image named ${p.value} already exists. Choose another name or replace ${p.value}.` : m.value = oe(U, "The image could not be uploaded.");
      } finally {
        T.value = !1, _.value = void 0;
      }
    }
    const O = P(() => _.value === "upload" ? "Uploading the image…" : _.value === "process" ? "Processing the image…" : _.value === "save" ? "Adding it to the library…" : ""), ae = P(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), le = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (H, U) => (l(), E(a(Ne), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !T.value || _.value === "process",
      "close-on-escape": !T.value || _.value === "process",
      class: "mail-dialog",
      pt: le,
      "aria-label": ae.value,
      "onUpdate:visible": U[4] || (U[4] = (x) => {
        x || c("close");
      })
    }, {
      header: L(() => [
        t("span", Un, [
          i(a(z), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", jn, [
          t("span", An, g(ae.value), 1),
          t("span", Ln, g(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: T.value && _.value !== "process",
          onClick: U[3] || (U[3] = (x) => c("close"))
        }, null, 8, ["disabled"]),
        i(a(D), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: T.value,
          disabled: !C.value || !e.replace && !u.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: L(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Ie(I, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: T.value,
            inert: T.value || void 0
          }, [
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": f.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: k.file
              }, "Image", 8, Nn),
              i(a(Bl), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": C.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: k.file, "aria-label": "Image file" } },
                onSelect: N
              }, {
                chooseicon: L(() => [
                  i(a(z), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: L(() => [
                  t("span", zn, g(C.value ? `${C.value.name} · ${a(We)(C.value.size)}${R.value ? ` · ${R.value.width} × ${R.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              f.value ? (l(), n("small", En, g(f.value), 1)) : V("", !0)
            ], 2),
            e.replace ? V("", !0) : (l(), n("div", On, [
              t("label", {
                class: "mail-field-label",
                for: k.title
              }, "Name", 8, Pn),
              i(a(ve), {
                id: k.title,
                modelValue: u.value,
                "onUpdate:modelValue": U[0] || (U[0] = (x) => u.value = x)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? V("", !0) : (l(), n("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": $.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: k.name
              }, "Reference", 8, Mn),
              i(a(ve), {
                id: k.name,
                modelValue: p.value,
                "onUpdate:modelValue": U[1] || (U[1] = (x) => p.value = x),
                class: "mail-mono-input",
                invalid: !!$.value,
                "aria-describedby": k.name + "-hint",
                onInput: U[2] || (U[2] = (x) => S.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: k.name + "-hint",
                class: re($.value ? "mail-field-error" : "mail-field-hint")
              }, g($.value || "Templates show it with this name. It cannot change later."), 11, Dn)
            ], 2))
          ], 8, In),
          O.value ? (l(), n("p", Bn, [
            i(a(z), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            Z(g(O.value), 1)
          ])) : V("", !0),
          m.value ? (l(), n("p", qn, g(m.value), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Fn = { class: "mail-drawer-head" }, Jn = { class: "mail-drawer-title" }, Wn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Kn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Yn = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Gn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Zn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, Qn = { class: "mail-asset-actions" }, Xn = { class: "mail-asset-hero" }, eo = { class: "mail-facts mail-card" }, ao = { class: "mail-reference" }, lo = { class: "mail-mono-block" }, to = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, so = {
  key: 0,
  class: "mail-muted"
}, io = { class: "mail-list" }, no = { key: 1 }, oo = {
  key: 0,
  class: "mail-asset-context"
}, ro = ["srcdoc", "title"], uo = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, co = {
  key: 0,
  class: "mail-muted"
}, vo = {
  key: 1,
  class: "mail-history"
}, mo = { class: "mail-history-head" }, fo = { class: "mail-history-main" }, bo = { class: "mail-history-title" }, yo = { class: "mail-sub" }, po = /* @__PURE__ */ se({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, go: r } = ye();
    Ce(() => !!o.name);
    const k = w();
    X(() => !!o.name, (h) => {
      h && (b.ensure("message"), ta(() => k.value?.focus()));
    }, { immediate: !0 });
    const y = ke(), C = ke([]), R = ke(), u = w(""), p = w(!1), S = w(!1), T = w(""), _ = w(""), v = w(""), m = w(), f = w(!1), $ = w(!1), A = w(!1), N = w(), M = Re();
    async function I() {
      const h = o.name, s = M();
      if (!h) {
        y.value = void 0;
        return;
      }
      p.value = !0;
      try {
        const [j, ne] = await Promise.all([ie.get({ kind: "asset", name: h }), ie.history({ kind: "asset", name: h })]);
        if (!s()) return;
        y.value = j, C.value = ne, S.value = !1, T.value = "";
        const K = j.used_by?.messages?.[0];
        u.value = K ?? "", R.value = K ? await ie.preview(K, []) : void 0;
      } catch (j) {
        if (!s()) return;
        S.value = Je(j), T.value = S.value ? "" : oe(j, "This image could not be loaded.");
      } finally {
        s() && (p.value = !1);
      }
    }
    X(() => o.name, () => {
      f.value = $.value = !1, v.value = _.value = "", I();
    }, { immediate: !0 }), b.onRow((h) => {
      h.kind === "asset" && h.name === o.name && I();
    });
    const O = P(() => (y.value?.used_by?.messages ?? []).map((h) => ({ name: h, title: b.title("message", h) })));
    async function ae() {
      const h = y.value;
      if (h)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(h.name)}`), $.value = !0;
        } catch {
          $.value = !1;
        }
    }
    const le = P(() => y.value ? Za(y.value.name) : "");
    async function H() {
      try {
        await navigator.clipboard.writeText(le.value), f.value = !0;
      } catch {
        f.value = !1;
      }
    }
    async function U(h, s) {
      const j = y.value;
      if (!j || m.value !== void 0) return;
      if (h === "delete" && O.value.length) {
        N.value = {
          header: `${j.title} is in use`,
          message: `${ge(O.value.length, "message")} ${O.value.length === 1 ? "shows" : "show"} it: ${O.value.map((K) => K.title ?? K.name).join(", ")}. Remove it from ${O.value.length === 1 ? "that message" : "them"} first.`,
          links: O.value.map((K) => ({ label: K.title ?? K.name, open: () => r({ name: "resource", kind: "message", resource: K.name, section: "content" }) }))
        };
        return;
      }
      const ne = {
        reset: { header: `Reset ${j.title} to the original?`, message: `The image included with ${j.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${j.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${s?.version} of ${j.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[h];
      if (await Te.confirm({ header: ne.header, message: ne.message, acceptLabel: ne.accept, rejectLabel: "Cancel", ...h === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        m.value = s ? s.revision : h, _.value = v.value = "";
        try {
          if (h === "delete") {
            await ie.remove({ kind: "asset", name: j.name }, j.revision), c("close");
            return;
          }
          y.value = h === "reset" ? await ie.reset({ kind: "asset", name: j.name }, j.revision) : await ie.restore({ kind: "asset", name: j.name }, s.revision, j.revision), v.value = h === "reset" ? `${j.title} is back to the original.` : `Version ${s.version} is shown again everywhere.`, await I();
        } catch (K) {
          const F = Ke(K);
          if (F?.dependents?.length || F?.references?.length) {
            const J = [...(F.references ?? []).filter((te) => te.kind !== "asset")];
            for (const te of F.dependents ?? []) J.some((he) => he.kind === "message" && he.name === te) || J.push({ kind: "message", name: te });
            await Promise.all([...new Set(J.map((te) => te.kind))].map((te) => b.ready(te) ? void 0 : b.load(te))), N.value = {
              header: `${j.title} is in use`,
              message: `${ge(J.length, "template")} ${J.length === 1 ? "names" : "name"} ${j.title}, in the current version or one kept in History. Remove it from ${J.length === 1 ? "that template" : "them"} first.`,
              links: J.map((te) => ({
                label: b.title(te.kind, te.name) ?? te.name,
                icon: pe[te.kind],
                open: () => r(te.kind === "asset" ? { name: "library", section: "assets", asset: te.name } : { name: "resource", kind: te.kind, resource: te.name, section: "content" })
              }))
            };
          } else
            _.value = we(K) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : oe(K, "The image could not be changed."), we(K) === "mail_revision_conflict" && I();
        } finally {
          m.value = void 0;
        }
      }
    }
    const x = P(() => R.value?.html ? Ca(R.value.html, R.value.inline_assets) : "");
    return (h, s) => (l(), n(Y, null, [
      i(a(Wa), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: m.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": s[5] || (s[5] = (j) => {
          j || c("close");
        })
      }, {
        default: L(() => [
          t("div", {
            ref_key: "drawer",
            ref: k,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", Fn, [
              t("div", Jn, [
                y.value?.state === "customized" ? (l(), E(a(Pe), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, g(y.value?.title ?? "Image"), 1)
              ]),
              i(a(D), {
                text: "",
                severity: "secondary",
                disabled: !y.value,
                "aria-label": $.value ? "Link copied" : "Copy link",
                title: $.value ? "Link copied" : "Copy link",
                onClick: ae
              }, {
                icon: L(() => [
                  i(a(z), {
                    icon: $.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              i(a(D), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: m.value !== void 0,
                onClick: s[0] || (s[0] = (j) => c("close"))
              }, {
                icon: L(() => [
                  i(a(z), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            p.value && !y.value ? (l(), n("p", Wn, [
              i(a(z), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              s[9] || (s[9] = Z("Loading image…", -1))
            ])) : S.value ? (l(), n("p", Kn, [
              i(a(z), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              s[10] || (s[10] = Z("This image no longer exists. It was deleted while you were away.", -1))
            ])) : T.value ? (l(), n("div", Yn, [
              t("span", null, g(T.value), 1),
              i(a(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: s[1] || (s[1] = (j) => I())
              })
            ])) : V("", !0),
            y.value ? (l(), n(Y, { key: 3 }, [
              _.value ? (l(), n("p", Gn, [
                i(a(z), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                Z(g(_.value), 1)
              ])) : V("", !0),
              v.value ? (l(), n("p", Zn, [
                i(a(z), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                Z(g(v.value), 1)
              ])) : V("", !0),
              t("div", Qn, [
                i(a(D), {
                  label: "Replace",
                  disabled: m.value !== void 0,
                  onClick: s[2] || (s[2] = (j) => A.value = !0)
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                y.value.state === "customized" ? (l(), E(a(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: m.value === "reset",
                  disabled: m.value !== void 0,
                  onClick: s[3] || (s[3] = (j) => U("reset"))
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                y.value.state === "created" ? (l(), E(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: m.value === "delete",
                  disabled: m.value !== void 0,
                  onClick: s[4] || (s[4] = (j) => U("delete"))
                }, {
                  icon: L(() => [
                    i(a(z), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ]),
              t("div", Xn, [
                i(el, {
                  name: y.value.name,
                  revision: y.value.revision,
                  asset: y.value.asset,
                  large: "",
                  alt: y.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", eo, [
                s[12] || (s[12] = t("dt", null, "Reference", -1)),
                t("dd", ao, [
                  t("span", lo, g(le.value), 1),
                  i(a(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": f.value ? "Reference copied" : "Copy reference",
                    title: f.value ? "Reference copied" : "Copy reference",
                    onClick: H
                  }, {
                    icon: L(() => [
                      i(a(z), {
                        icon: f.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                s[13] || (s[13] = t("dt", null, "File", -1)),
                t("dd", null, g(y.value.asset?.filename) + " · " + g(a(We)(y.value.asset?.size)), 1),
                y.value.asset?.width ? (l(), n(Y, { key: 0 }, [
                  s[11] || (s[11] = t("dt", null, "Size", -1)),
                  t("dd", null, g(y.value.asset.width) + " × " + g(y.value.asset.height), 1)
                ], 64)) : V("", !0),
                s[14] || (s[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  i(Va, { resource: y.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", to, [
                s[15] || (s[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                O.value.length ? (l(), n(Y, { key: 1 }, [
                  t("ul", io, [
                    (l(!0), n(Y, null, me(O.value, (j) => (l(), n("li", {
                      key: j.name
                    }, [
                      i(a(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (ne) => a(r)({ name: "resource", kind: "message", resource: j.name, section: "content" })
                      }, {
                        default: L(() => [
                          i(a(z), {
                            icon: a(pe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          j.title === void 0 ? (l(), E(a(Ue), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", no, g(j.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  x.value ? (l(), n("div", oo, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: x.value,
                      title: "How " + y.value.title + " looks in " + (a(b).title("message", u.value) ?? "")
                    }, null, 8, ro)
                  ])) : V("", !0)
                ], 64)) : (l(), n("p", so, "No message shows " + g(y.value.title) + " with its sample values.", 1))
              ]),
              t("section", uo, [
                s[16] || (s[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                C.value.length ? (l(), n("ol", vo, [
                  (l(!0), n(Y, null, me(C.value, (j) => (l(), n("li", {
                    key: j.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", mo, [
                      t("div", fo, [
                        t("span", bo, [
                          Z("Version " + g(j.version) + " · " + g(a(ga)[j.action]) + " ", 1),
                          j.revision === y.value.revision ? (l(), E(a(Pe), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", yo, [
                          Z(g(a(_e)(j.author_label, j.author)) + " · " + g(a(Ge)(j.created_at)) + " ", 1),
                          j.content.asset?.filename ? (l(), n(Y, { key: 0 }, [
                            Z(" · " + g(j.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      j.revision !== y.value.revision ? (l(), E(a(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: m.value === j.revision,
                        disabled: m.value !== void 0,
                        onClick: (ne) => U("restore", j)
                      }, {
                        icon: L(() => [
                          i(a(z), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", co, g(y.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      y.value ? (l(), E(al, {
        key: 0,
        visible: A.value,
        replace: y.value,
        onClose: s[6] || (s[6] = (j) => A.value = !1),
        onDone: s[7] || (s[7] = (j) => I())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      i(Xa, {
        refusal: N.value,
        onClose: s[8] || (s[8] = (j) => N.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), go = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ho = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, ko = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, $o = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, wo = { class: "mail-toolbar" }, _o = {
  class: "mail-count",
  role: "status"
}, xo = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Co = { class: "mail-sub" }, Vo = { class: "mail-mono-block" }, So = { class: "mail-muted" }, To = { key: 1 }, Ro = { class: "mail-muted" }, Uo = /* @__PURE__ */ se({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const d = e, { go: o, upload: c, library: b } = ye();
    b.use("asset");
    const r = w(""), k = w("");
    let y;
    X(r, (M) => {
      clearTimeout(y), y = setTimeout(() => {
        k.value = M.trim();
      }, 250);
    });
    const C = ke([]), R = w(!0), u = w(!1), p = w(!1), S = w(""), T = w(""), _ = Re();
    async function v(M = !1) {
      const I = _();
      R.value = !0;
      try {
        const O = await ie.assets(k.value || void 0);
        if (!I()) return;
        C.value = O, S.value = T.value = "", p.value = !1, u.value = !0;
      } catch (O) {
        if (!I()) return;
        p.value = Ye(O);
        const ae = p.value ? "" : oe(O, "Images could not be loaded.");
        M && u.value && !p.value ? T.value = ae : S.value = ae;
      } finally {
        I() && (R.value = !1);
      }
    }
    X(k, () => {
      v();
    }), sa(() => v(u.value)), b.onRow((M, I, O) => {
      if (M.kind !== "asset") return;
      const ae = C.value.findIndex((H) => H.name === M.name), le = [...C.value];
      if (ae >= 0)
        O ? le[ae] = O : le.splice(ae, 1);
      else if (O && !k.value) le.push(O);
      else return;
      C.value = le;
    });
    function m(M) {
      const I = b.find("asset", M.name)?.used_by?.messages;
      return I === void 0 ? b.ready("asset") ? "—" : void 0 : I ? ge(I, "message") : "—";
    }
    const f = P(() => C.value.reduce((M, I) => M + (I.asset?.size ?? 0), 0)), $ = P(() => `${ge(C.value.length, "image")} · ${We(f.value)}`);
    function A(M) {
      const I = M.asset;
      return I ? (I.width && I.height ? `${I.width} × ${I.height} · ` : "") + We(I.size) : "";
    }
    function N(M) {
      o({ name: "library", section: "assets", asset: M.name });
    }
    return (M, I) => (l(), n(Y, null, [
      i(ia, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: L(() => [
          i(a(D), {
            label: "Upload image",
            onClick: I[0] || (I[0] = (O) => a(c)())
          }, {
            icon: L(() => [
              i(a(z), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      p.value ? (l(), n("p", go, [
        i(a(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        I[7] || (I[7] = Z("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : S.value ? (l(), n("div", ho, [
        t("span", null, g(S.value), 1),
        i(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[1] || (I[1] = (O) => v())
        })
      ])) : V("", !0),
      T.value ? (l(), n("div", ko, [
        t("span", null, g(T.value) + " The list shows what was loaded before.", 1),
        i(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[2] || (I[2] = (O) => v(!0))
        })
      ])) : R.value && !u.value ? (l(), n("p", $o, [
        i(a(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        I[8] || (I[8] = Z("Loading images…", -1))
      ])) : u.value && !C.value.length && !k.value ? (l(), E(_a, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: I[3] || (I[3] = (O) => a(c)())
      })) : u.value ? (l(), n(Y, { key: 5 }, [
        t("div", wo, [
          i(a(ka), { class: "mail-search" }, {
            default: L(() => [
              i(a($a), null, {
                default: L(() => [
                  i(a(z), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(a(ve), {
                modelValue: r.value,
                "onUpdate:modelValue": I[4] || (I[4] = (O) => r.value = O),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", _o, g($.value), 1)
        ]),
        C.value.length ? (l(), E(a(ha), {
          key: 1,
          value: C.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: I[5] || (I[5] = (O) => N(O.data))
        }, {
          default: L(() => [
            i(a(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: L(({ data: O }) => [
                i(el, {
                  name: O.name,
                  revision: O.revision,
                  asset: O.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            i(a(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: L(({ data: O }) => [
                i(a(D), {
                  link: "",
                  class: "mail-name",
                  label: O.title,
                  onClick: Ie((ae) => N(O), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", Co, [
                  t("span", Vo, g(O.name), 1),
                  O.asset?.filename ? (l(), n(Y, { key: 0 }, [
                    Z(" · " + g(O.asset.filename), 1)
                  ], 64)) : V("", !0)
                ])
              ]),
              _: 1
            }),
            i(a(ce), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: O }) => [
                t("span", So, g(A(O)), 1)
              ]),
              _: 1
            }),
            i(a(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: L(({ data: O }) => [
                m(O) === void 0 ? (l(), E(a(Ue), {
                  key: 0,
                  width: "5rem",
                  height: "1rem"
                })) : (l(), n("span", To, g(m(O)), 1))
              ]),
              _: 1
            }),
            i(a(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: L(({ data: O }) => [
                i(Va, { resource: O }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            i(a(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: L(({ data: O }) => [
                t("span", Ro, g(O.state === "original" ? "—" : a(Ma)(O.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", xo, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      i(po, {
        name: d.asset,
        onClose: I[6] || (I[6] = (O) => a(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), jo = { class: "kx-modal-head-icon" }, Ao = { class: "kx-modal-head-text" }, Lo = { class: "kx-modal-head-title" }, Io = { class: "kx-modal-head-sub" }, No = ["id"], zo = ["disabled", "inert"], Eo = {
  key: 0,
  class: "mail-field"
}, Oo = {
  key: 1,
  class: "mail-field"
}, Po = ["for"], Mo = { class: "mail-field" }, Do = ["for"], Bo = ["for"], qo = ["id"], Ho = { class: "mail-field" }, Fo = ["for"], Jo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Le = "\0blank", Wo = /* @__PURE__ */ se({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, go: r } = ye(), k = w("message"), y = w(""), C = w(""), R = w(""), u = w(""), p = w(!1), S = w(!1), T = w(""), _ = w(""), v = { title: fe(), reference: fe(), description: fe(), source: fe(), hint: fe() }, m = ["message", "base", "part"].map((H) => ({ value: H, label: be[H] })), f = P(() => !!o.intent.from), $ = P(() => [
      { value: Le, label: "Blank" },
      ...b.ofKind(k.value).map((H) => ({ value: H.name, label: H.title }))
    ]), A = P(() => y.value === Le || !!b.find(k.value, y.value));
    function N(H) {
      if (y.value = H, H === Le) return;
      const U = b.find(k.value, H);
      U && (u.value = U.description, o.intent.from && (C.value = `${U.title} copy`, p.value = !1));
    }
    X(() => o.visible, async (H) => {
      H && (k.value = o.intent.from?.kind ?? o.intent.kind ?? "message", C.value = R.value = u.value = y.value = "", T.value = _.value = "", p.value = !1, o.intent.from ? (y.value = o.intent.from.name, b.ready(k.value) || await b.load(k.value), o.visible && N(o.intent.from.name)) : (y.value = Le, b.ensure(k.value)));
    }, { immediate: !0 }), X(k, (H) => {
      o.intent.from || (y.value = Le, u.value = "", o.visible && b.ensure(H));
    }), Ce(() => o.visible), X(C, (H) => {
      p.value || (R.value = Ba(H));
    });
    const M = P(() => k.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function I() {
      return _.value = "", R.value ? qa.test(R.value) ? b.find(k.value, R.value) && (_.value = `A ${be[k.value].toLowerCase()} with this reference already exists. Choose another.`) : _.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : _.value = "Enter a reference.", !_.value;
    }
    async function O() {
      if (!(S.value || !C.value.trim() || !A.value || !I())) {
        S.value = !0, T.value = "";
        try {
          const H = y.value === Le ? await ie.create(Zt(k.value, R.value, C.value.trim(), u.value.trim())) : await ie.copy({
            kind: k.value,
            name: R.value,
            title: C.value.trim(),
            description: u.value.trim(),
            from: { kind: k.value, name: y.value }
          });
          b.patch(H.kind, H.name, wa(H)), c("close"), r({ name: "resource", kind: H.kind, resource: H.name, section: "content" });
        } catch (H) {
          we(H) === "mail_revision_conflict" ? _.value = `A ${be[k.value].toLowerCase()} with this reference already exists. Choose another.` : T.value = oe(H, "The resource could not be created.");
        } finally {
          S.value = !1;
        }
      }
    }
    const ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, le = P(() => o.intent.from ? `Duplicate ${b.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${be[k.value].toLowerCase()}`);
    return (H, U) => (l(), E(a(Ne), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !S.value,
      "close-on-escape": !S.value,
      class: "mail-dialog",
      pt: ae,
      "aria-label": le.value,
      "onUpdate:visible": U[6] || (U[6] = (x) => {
        x || c("close");
      })
    }, {
      header: L(() => [
        t("span", jo, [
          i(a(z), {
            icon: a(pe)[k.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Ao, [
          t("span", Lo, g(le.value), 1),
          t("span", Io, g(y.value === Le ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: L(() => [
        i(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: S.value,
          onClick: U[5] || (U[5] = (x) => c("close"))
        }, null, 8, ["disabled"]),
        i(a(D), {
          label: "Create " + a(be)[k.value].toLowerCase(),
          type: "submit",
          form: v.hint,
          loading: S.value,
          disabled: !C.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: L(() => [
        t("form", {
          id: v.hint,
          class: "mail-form",
          onSubmit: Ie(O, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: S.value,
            inert: S.value || void 0
          }, [
            f.value ? V("", !0) : (l(), n("div", Eo, [
              U[7] || (U[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              i(a(xe), {
                modelValue: k.value,
                "onUpdate:modelValue": U[0] || (U[0] = (x) => k.value = x),
                options: a(m),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            f.value ? V("", !0) : (l(), n("div", Oo, [
              t("label", {
                class: "mail-field-label",
                for: v.source
              }, "Start from", 8, Po),
              i(a(Me), {
                "model-value": y.value,
                "input-id": v.source,
                options: $.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !a(b).ready(k.value),
                "onUpdate:modelValue": N
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", Mo, [
              t("label", {
                class: "mail-field-label",
                for: v.title
              }, "Name", 8, Do),
              i(a(ve), {
                id: v.title,
                modelValue: C.value,
                "onUpdate:modelValue": U[1] || (U[1] = (x) => C.value = x),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": _.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: v.reference
              }, "Reference", 8, Bo),
              i(a(ve), {
                id: v.reference,
                modelValue: R.value,
                "onUpdate:modelValue": U[2] || (U[2] = (x) => R.value = x),
                class: "mail-mono-input",
                invalid: !!_.value,
                "aria-describedby": v.reference + "-hint",
                onInput: U[3] || (U[3] = (x) => p.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: v.reference + "-hint",
                class: re(_.value ? "mail-field-error" : "mail-field-hint")
              }, g(_.value || M.value), 11, qo)
            ], 2),
            t("div", Ho, [
              t("label", {
                class: "mail-field-label",
                for: v.description
              }, "Description", 8, Fo),
              i(a(ma), {
                id: v.description,
                modelValue: u.value,
                "onUpdate:modelValue": U[4] || (U[4] = (x) => u.value = x),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, zo),
          T.value ? (l(), n("p", Jo, g(T.value), 1)) : V("", !0)
        ], 40, No)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Ko = { class: "mail-drawer-head" }, Yo = { class: "mail-drawer-title" }, Go = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Zo = {
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
}, er = {
  key: 0,
  class: "kx-notice error mail-failure"
}, ar = { class: "mail-failure-body" }, lr = { key: 0 }, tr = { key: 1 }, sr = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, ir = {
  key: 3,
  class: "mail-sub"
}, nr = {
  key: 4,
  class: "mail-sub"
}, or = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, rr = { key: 6 }, ur = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, dr = { class: "mail-facts mail-card" }, cr = { key: 2 }, vr = {
  key: 0,
  class: "mail-sub"
}, mr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, fr = { class: "mail-timeline" }, br = { class: "mail-muted" }, yr = { class: "mail-facts" }, pr = { class: "mail-mono-block" }, gr = /* @__PURE__ */ se({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, c = d, { library: b, go: r, capabilities: k, delivery: y } = ye();
    Ce(() => !!o.messageId);
    const C = w();
    X(() => !!o.messageId, (h) => {
      h && ta(() => C.value?.focus());
    }, { immediate: !0 });
    const R = P(() => !!p.value?.last_error && _l.has(p.value.last_error.code)), u = P(() => {
      const h = p.value?.last_error;
      if (!h) return;
      const s = y.value?.driver && y.value.driver.id === p.value?.driver_id ? y.value.driver.label : "The delivery service";
      return (k.value?.administer_delivery ? xl(h.code, s) : void 0) ?? { lead: "", next: h.message };
    }), p = ke(), S = w(!1), T = w(!1), _ = w(!1), v = w(""), m = w(""), f = w(!1), $ = w(), A = w(!1), N = Re();
    async function M() {
      const h = o.messageId, s = N();
      if (!h) {
        p.value = void 0;
        return;
      }
      S.value = !0;
      try {
        const j = await He.get(h);
        if (!s()) return;
        p.value = j, v.value = "", T.value = _.value = !1;
      } catch (j) {
        if (!s()) return;
        p.value = void 0, T.value = Je(j), _.value = Ye(j), v.value = T.value || _.value ? "" : oe(j, "This message could not be loaded.");
      } finally {
        s() && (S.value = !1);
      }
    }
    X(() => o.messageId, (h) => {
      $.value = void 0, m.value = "", A.value = !1, h !== p.value?.message_id && (p.value = void 0), M();
    }, { immediate: !0 }), Ha((h) => {
      h.message_id === o.messageId && M();
    });
    async function I() {
      const h = p.value;
      if (!(!h || f.value)) {
        f.value = !0, m.value = "";
        try {
          $.value = await He.resend(h.message_id);
        } catch (s) {
          m.value = oe(s, "The message could not be sent again.");
        } finally {
          f.value = !1;
        }
      }
    }
    async function O() {
      const h = p.value;
      if (h)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(h.message_id)}`), A.value = !0;
        } catch {
          A.value = !1;
        }
    }
    const ae = P(() => {
      const h = p.value?.template;
      return h ? b.title("message", h) : "";
    }), le = P(() => !!p.value?.template && !!b.find("message", p.value.template)), H = P(() => {
      const h = p.value;
      if (!h) return [];
      const s = [{ label: "Accepted for delivery", at: h.created_at }];
      return h.status === "queued" && h.next_attempt_at && s.push({ label: h.attempts ? `Attempt ${h.attempts} did not go through; trying again` : "Next delivery attempt", at: h.next_attempt_at }), h.sent_at ? s.push({ label: h.attempts > 1 ? `Sent after ${h.attempts} attempts` : "Sent", at: h.sent_at }) : h.status === "failed" && h.finished_at && s.push({ label: h.attempts > 1 ? `Failed after ${h.attempts} attempts` : "Failed", at: h.finished_at }), s;
    }), U = P(() => (p.value?.attachments ?? []).map((h) => h.filename || "Attachment")), x = P(() => {
      const h = p.value;
      return h ? [
        { label: "Message ID", value: h.message_id },
        { label: "Delivery service", value: k.value?.administer_delivery ? h.driver_id : void 0 },
        { label: "Service message ID", value: h.provider_message_id },
        { label: "Error code", value: h.last_error?.code },
        { label: "Service response", value: h.last_error?.provider_detail }
      ].filter((s) => !!s.value) : [];
    });
    return (h, s) => (l(), E(a(Wa), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !f.value,
      "close-on-escape": !f.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": s[6] || (s[6] = (j) => {
        j || c("close");
      })
    }, {
      default: L(() => [
        t("div", {
          ref_key: "drawer",
          ref: C,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", Ko, [
            t("div", Yo, [
              p.value ? (l(), E(a(Pe), {
                key: 0,
                severity: a(Ja)[p.value.status],
                value: a(Fa)[p.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : V("", !0),
              t("h2", null, g(p.value?.subject ?? "Message"), 1)
            ]),
            i(a(D), {
              text: "",
              severity: "secondary",
              disabled: !p.value,
              "aria-label": A.value ? "Link copied" : "Copy link",
              title: A.value ? "Link copied" : "Copy link",
              onClick: O
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: A.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            i(a(D), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: f.value,
              onClick: s[0] || (s[0] = (j) => c("close"))
            }, {
              icon: L(() => [
                i(a(z), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          S.value && !p.value ? (l(), n("p", Go, [
            i(a(z), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            s[7] || (s[7] = Z("Loading message…", -1))
          ])) : T.value ? (l(), n("p", Zo, [
            i(a(z), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            s[8] || (s[8] = Z("This message is no longer in Activity.", -1))
          ])) : _.value ? (l(), n("p", Qo, [
            i(a(z), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            s[9] || (s[9] = Z("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : v.value ? (l(), n("div", Xo, [
            t("span", null, g(v.value), 1),
            i(a(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: s[1] || (s[1] = (j) => M())
            })
          ])) : V("", !0),
          p.value ? (l(), n(Y, { key: 4 }, [
            p.value.status === "failed" ? (l(), n("div", er, [
              i(a(z), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", ar, [
                s[12] || (s[12] = t("strong", null, "This message was not delivered.", -1)),
                u.value?.lead ? (l(), n("span", lr, g(u.value.lead), 1)) : V("", !0),
                u.value ? (l(), n("span", tr, g(u.value.next), 1)) : V("", !0),
                $.value ? (l(), n("p", sr, [
                  s[10] || (s[10] = Z(" Sent again as a new message. ", -1)),
                  i(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: s[2] || (s[2] = (j) => a(r)({ name: "activity", message: $.value.message_id }))
                  })
                ])) : R.value ? (l(), n("p", ir, [
                  s[11] || (s[11] = Z("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  a(k)?.administer_delivery ? (l(), E(a(D), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: s[3] || (s[3] = (j) => a(Te).navigate("/system/settings/mail"))
                  })) : V("", !0)
                ])) : p.value.can_resend ? V("", !0) : (l(), n("p", nr, "It cannot be sent again because its content was not kept.")),
                m.value ? (l(), n("p", or, g(m.value), 1)) : V("", !0),
                p.value.can_resend && !$.value && !R.value ? (l(), n("div", rr, [
                  i(a(D), {
                    label: "Send again",
                    loading: f.value,
                    onClick: I
                  }, {
                    icon: L(() => [
                      i(a(z), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : p.value.status === "queued" ? (l(), n("p", ur, [
              i(a(z), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              s[13] || (s[13] = Z("Waiting to be delivered. ", -1))
            ])) : V("", !0),
            t("dl", dr, [
              s[19] || (s[19] = t("dt", null, "To", -1)),
              t("dd", null, g(p.value.to.join(", ")), 1),
              p.value.cc?.length ? (l(), n(Y, { key: 0 }, [
                s[14] || (s[14] = t("dt", null, "Cc", -1)),
                t("dd", null, g(p.value.cc.join(", ")), 1)
              ], 64)) : V("", !0),
              p.value.bcc?.length ? (l(), n(Y, { key: 1 }, [
                s[15] || (s[15] = t("dt", null, "Bcc", -1)),
                t("dd", null, g(p.value.bcc.join(", ")), 1)
              ], 64)) : V("", !0),
              p.value.reply_to ? (l(), n(Y, { key: 2 }, [
                s[16] || (s[16] = t("dt", null, "Reply-to", -1)),
                t("dd", null, g(p.value.reply_to), 1)
              ], 64)) : V("", !0),
              s[20] || (s[20] = t("dt", null, "Template", -1)),
              t("dd", null, [
                ae.value === void 0 ? (l(), E(a(Ue), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : le.value ? (l(), E(a(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ae.value,
                  onClick: s[4] || (s[4] = (j) => a(r)({ name: "resource", kind: "message", resource: p.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", cr, g(ae.value || "Written directly"), 1))
              ]),
              s[21] || (s[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                Z(g(a(_e)(p.value.sender_label, p.value.sender)), 1),
                p.value.origin ? (l(), n("span", vr, g(a(na)(p.value.origin)), 1)) : V("", !0)
              ]),
              U.value.length ? (l(), n(Y, { key: 3 }, [
                s[17] || (s[17] = t("dt", null, "Attachments", -1)),
                t("dd", null, g(U.value.join(", ")), 1)
              ], 64)) : V("", !0),
              p.value.resend_of ? (l(), n(Y, { key: 4 }, [
                s[18] || (s[18] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  i(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: s[5] || (s[5] = (j) => a(r)({ name: "activity", message: p.value.resend_of }))
                  })
                ])
              ], 64)) : V("", !0)
            ]),
            t("section", mr, [
              s[22] || (s[22] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", fr, [
                (l(!0), n(Y, null, me(H.value, (j) => (l(), n("li", {
                  key: j.label
                }, [
                  t("span", null, g(j.label), 1),
                  t("span", br, g(a(Ge)(j.at)), 1)
                ]))), 128))
              ])
            ]),
            x.value.length ? (l(), E(Qa, {
              key: 2,
              label: "Technical details"
            }, {
              default: L(() => [
                t("dl", yr, [
                  (l(!0), n(Y, null, me(x.value, (j) => (l(), n(Y, {
                    key: j.label
                  }, [
                    t("dt", null, g(j.label), 1),
                    t("dd", pr, g(j.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : V("", !0)
          ], 64)) : V("", !0)
        ], 512)
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), hr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, kr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, $r = { class: "mail-health-text" }, wr = { class: "mail-toolbar" }, _r = {
  key: 0,
  class: "mail-count",
  role: "status"
}, xr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, Cr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Vr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Sr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Tr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Rr = { class: "mail-sub" }, Ur = {
  key: 0,
  class: "mail-sub"
}, jr = { class: "mail-muted" }, Ar = {
  key: 2,
  class: "mail-more"
}, Lr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ir = /* @__PURE__ */ se({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const d = e, { library: o, go: c, capabilities: b } = ye();
    o.use("message");
    const r = w("all"), k = w(d.template ?? null), y = w(30), C = w(""), R = w("");
    let u;
    X(C, (ee) => {
      clearTimeout(u), u = setTimeout(() => {
        R.value = ee.trim();
      }, 250);
    }), X(() => d.template, (ee) => {
      ee !== void 0 && (k.value = ee);
    });
    const p = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], S = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], T = P(() => o.ofKind("message").map((ee) => ({ label: ee.title, value: ee.name }))), _ = ke([]), v = w(), m = w(!0), f = w(!1), $ = w(!1), A = w(!1), N = w(""), M = w(""), I = w(""), O = Re();
    function ae(ee) {
      return {
        status: r.value === "all" ? void 0 : r.value,
        message: k.value || void 0,
        since: Date.now() - y.value * 24 * 60 * 60 * 1e3,
        q: R.value || void 0,
        cursor: ee
      };
    }
    async function le(ee = !1) {
      const G = O();
      m.value = !0;
      try {
        const W = await He.list(ae());
        if (!G()) return;
        _.value = W.items, v.value = W.next_cursor, U.value = W.total, x.value = !!W.total_is_lower_bound, h.value = W.failed_today ?? 0, N.value = M.value = I.value = "", A.value = !1, f.value = !0;
      } catch (W) {
        if (!G()) return;
        A.value = Ye(W);
        const $e = A.value ? "" : oe(W, "Activity could not be loaded.");
        ee && f.value && !A.value ? I.value = $e : N.value = $e;
      } finally {
        G() && (m.value = !1);
      }
    }
    async function H() {
      if (!v.value || $.value) return;
      const ee = O();
      $.value = !0, M.value = "";
      try {
        const G = await He.list(ae(v.value));
        if (!ee()) return;
        const W = new Set(_.value.map(($e) => $e.message_id));
        _.value = [..._.value, ...G.items.filter(($e) => !W.has($e.message_id))], v.value = G.next_cursor;
      } catch (G) {
        ee() && (M.value = oe(G, "More activity could not be loaded."));
      } finally {
        $.value = !1;
      }
    }
    const U = w(), x = w(!1), h = w(0);
    X([r, k, y, R], () => {
      le();
    }), sa(() => le(f.value));
    function s(ee) {
      const G = ae();
      return G.q ? !1 : (!G.status || ee.status === G.status) && (!G.message || ee.template === G.message) && ee.created_at >= G.since;
    }
    Ha(async (ee) => {
      if (!f.value) return;
      let G;
      try {
        G = await He.get(ee.message_id);
      } catch {
        return;
      }
      const W = _.value.findIndex((je) => je.message_id === G.message_id);
      if ((W >= 0 ? _.value[W] : void 0)?.status !== "failed" && G.status === "failed" && G.created_at >= Cl() && h.value++, W >= 0) {
        const je = [..._.value];
        je[W] = G, _.value = je;
      } else s(G) && (_.value = [G, ..._.value], U.value !== void 0 && U.value++);
    });
    const j = P(() => {
      const ee = U.value ?? _.value.length;
      return x.value ? `${ee.toLocaleString()}+ messages` : ge(ee, "message");
    }), ne = P(() => x.value && !!R.value), K = P(() => h.value ? `${ge(h.value, "message")} failed today.` : ""), F = P(() => !!b.value?.administer_delivery), J = P(() => F.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function te(ee) {
      return ee ? o.title("message", ee) : "—";
    }
    function he(ee) {
      c({ name: "activity", message: ee.message_id });
    }
    function Ve() {
      c({ name: "activity", template: k.value || void 0 });
    }
    return (ee, G) => (l(), n(Y, null, [
      i(ia, {
        title: "Activity",
        description: J.value
      }, null, 8, ["description"]),
      A.value ? (l(), n("p", hr, [
        i(a(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        G[8] || (G[8] = Z("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(Y, { key: 1 }, [
        K.value ? (l(), n("p", kr, [
          i(a(z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", $r, [
            t("strong", null, g(K.value), 1),
            Z(" " + g(r.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          r.value !== "failed" ? (l(), E(a(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: G[0] || (G[0] = (W) => r.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", wr, [
          i(a(xe), {
            modelValue: r.value,
            "onUpdate:modelValue": G[1] || (G[1] = (W) => r.value = W),
            options: p,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          i(a(Me), {
            modelValue: k.value,
            "onUpdate:modelValue": G[2] || (G[2] = (W) => k.value = W),
            options: T.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          i(a(Me), {
            modelValue: y.value,
            "onUpdate:modelValue": G[3] || (G[3] = (W) => y.value = W),
            options: S,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          i(a(ka), { class: "mail-search" }, {
            default: L(() => [
              i(a($a), null, {
                default: L(() => [
                  i(a(z), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(a(ve), {
                modelValue: C.value,
                "onUpdate:modelValue": G[4] || (G[4] = (W) => C.value = W),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          f.value ? (l(), n("span", _r, g(j.value), 1)) : V("", !0)
        ]),
        ne.value ? (l(), n("p", xr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : V("", !0),
        N.value ? (l(), n("div", Cr, [
          t("span", null, g(N.value), 1),
          i(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: G[5] || (G[5] = (W) => le())
          })
        ])) : V("", !0),
        I.value ? (l(), n("div", Vr, [
          t("span", null, g(I.value) + " The list shows what was loaded before.", 1),
          i(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: G[6] || (G[6] = (W) => le(!0))
          })
        ])) : m.value && !f.value ? (l(), n("p", Sr, [
          i(a(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          G[9] || (G[9] = Z("Loading activity…", -1))
        ])) : f.value ? (l(), n(Y, { key: 5 }, [
          _.value.length ? (l(), E(a(ha), {
            key: 1,
            value: _.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: G[7] || (G[7] = (W) => he(W.data))
          }, {
            default: L(() => [
              i(a(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: L(({ data: W }) => [
                  i(a(Pe), {
                    severity: a(Ja)[W.status],
                    value: a(Fa)[W.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              i(a(ce), { header: "Message" }, {
                body: L(({ data: W }) => [
                  i(a(D), {
                    link: "",
                    class: "mail-name",
                    label: W.subject,
                    onClick: Ie(($e) => he(W), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", Rr, g(a(Vl)(W.to)), 1)
                ]),
                _: 1
              }),
              i(a(ce), { header: "Template" }, {
                body: L(({ data: W }) => [
                  te(W.template) === void 0 ? (l(), E(a(Ue), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(Y, { key: 1 }, [
                    Z(g(te(W.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              i(a(ce), { header: "Sent by" }, {
                body: L(({ data: W }) => [
                  t("span", null, g(a(_e)(W.sender_label, W.sender)), 1),
                  W.origin ? (l(), n("span", Ur, g(a(na)(W.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              i(a(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: L(({ data: W }) => [
                  t("span", jr, g(a(Sl)(W.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Tr, g(R.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          v.value ? (l(), n("div", Ar, [
            M.value ? (l(), n("span", Lr, g(M.value), 1)) : V("", !0),
            i(a(D), {
              label: M.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: $.value,
              onClick: H
            }, null, 8, ["label", "loading"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      i(gr, {
        "message-id": e.message,
        onClose: Ve
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Nr = { class: "kx-shell kx-settings-shell mail-admin" }, zr = { class: "kx-main" }, Er = /* @__PURE__ */ se({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: d }) {
    const o = e, c = d, b = ke(Ia(o.route ?? "")), r = P(() => b.value), k = w(!1);
    X(k, (s) => c("dirty-change", s), { flush: "sync" });
    let y = !1;
    async function C() {
      if (!k.value) return !0;
      if (y) return !1;
      y = !0;
      try {
        return await Te.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        y = !1;
      }
    }
    function R(s, j) {
      return s.name === "resource" && j.name === "resource" && s.kind === j.kind && s.resource === j.resource;
    }
    async function u(s) {
      const j = Ee(s);
      !R(r.value, s) && !await C() || (R(r.value, s) || (k.value = !1), b.value = s, o.route !== void 0 && j !== o.route && c("navigate", j));
    }
    X(() => o.route, async (s, j) => {
      if (s === void 0) return;
      const ne = Ia(s);
      if (Ee(ne) !== Ee(b.value)) {
        if (!R(b.value, ne) && k.value) {
          if (!await C()) {
            j !== void 0 && o.route === s && c("navigate", Ee(b.value));
            return;
          }
          k.value = !1;
        }
        o.route === s && (b.value = ne);
      }
    });
    const p = at(), S = pl();
    X(S, (s, j) => {
      j === !1 && s === !0 && p.refresh();
    });
    const T = w(), _ = w();
    async function v() {
      try {
        T.value = await Tl.capabilities();
      } catch {
        T.value = void 0;
      }
      if (T.value?.administer_delivery)
        try {
          _.value = await Rl.status();
        } catch {
          _.value = void 0;
        }
    }
    v();
    const m = w(!1), f = w(!1), $ = w({});
    function A(s) {
      $.value = s, m.value = !0;
    }
    yl(Ka, {
      library: p,
      capabilities: T,
      delivery: _,
      go: (s) => {
        u(s);
      },
      create: A,
      upload: () => {
        f.value = !0;
      },
      setDirty: (s) => {
        k.value = s;
      },
      setTitle: (s) => {
        le.value = s;
      }
    });
    const N = {
      content: (s) => s === "message" ? "Message" : s === "base" ? "Layout" : "Content",
      variables: (s) => s === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, M = {
      content: (s) => pe[s],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, I = P(() => !!T.value && (T.value.administer_delivery || T.value.send)), O = P(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: pe.message },
        { value: "bases", label: "Base templates", icon: pe.base },
        { value: "parts", label: "Parts", icon: pe.part },
        { value: "assets", label: "Images", icon: pe.asset }
      ] },
      ...I.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ae = { value: "all", label: "All resources", icon: "tabler:table" }, le = w("");
    X(() => Ee(r.value), () => {
      le.value = "";
    });
    const H = P(() => {
      const s = r.value;
      if (s.name === "resource")
        return {
          leading: { value: "all", label: "All " + pa[s.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: le.value || " ", items: Ga(s.kind).map((j) => ({
            value: j,
            label: N[j](s.kind),
            icon: M[j](s.kind)
          })) }]
        };
    }), U = P(() => {
      const s = r.value;
      return s.name === "resource" ? s.section : s.name === "activity" ? "activity" : s.section;
    });
    function x(s) {
      const j = r.value;
      if (j.name === "resource") {
        u(s === "all" ? { name: "library", section: fa(j.kind) } : { ...j, section: s });
        return;
      }
      u(s === "activity" ? { name: "activity" } : { name: "library", section: s });
    }
    const h = w();
    return X(() => Ee(r.value), () => {
      h.value?.scrollTo({ top: 0 });
    }), (s, j) => (l(), n("main", Nr, [
      i(et, {
        label: "Mail sections",
        title: "Mail",
        value: U.value,
        groups: H.value ? H.value.groups : O.value,
        "leading-item": H.value ? H.value.leading : ae,
        "onUpdate:value": x
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", zr, [
        t("div", {
          ref_key: "main",
          ref: h,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), E($n, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), E(Ir, {
            key: 1,
            message: r.value.message,
            template: r.value.template
          }, null, 8, ["message", "template"])) : r.value.section === "assets" ? (l(), E(Uo, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), E(Kt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      i(Wo, {
        visible: m.value,
        intent: $.value,
        onClose: j[0] || (j[0] = (ne) => m.value = !1)
      }, null, 8, ["visible", "intent"]),
      i(al, {
        visible: f.value,
        onClose: j[1] || (j[1] = (ne) => f.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Or = /* @__PURE__ */ se({
  __name: "MailAdminRoot",
  setup(e) {
    const d = gl(), o = hl();
    return (c, b) => (l(), E(Er, {
      route: a(d).route,
      onNavigate: b[0] || (b[0] = (r) => a(o)("navigate", { route: r })),
      onDirtyChange: b[1] || (b[1] = (r) => a(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), Pr = Ul(Or, { type: "object", properties: { route: { type: "string", default: "" } } });
Ll(import.meta.url, Pr);
//# sourceMappingURL=admin.js.map
