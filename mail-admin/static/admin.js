import { defineComponent as le, useId as ve, openBlock as l, createElementBlock as n, unref as e, normalizeClass as re, createElementVNode as t, createTextVNode as K, toDisplayString as b, createCommentVNode as V, renderSlot as Ie, computed as P, createBlock as O, resolveDynamicComponent as ol, normalizeProps as rl, guardReactiveProps as ul, createSlots as ma, withCtx as A, Fragment as F, renderList as ce, inject as dl, ref as w, shallowRef as pe, onMounted as cl, onBeforeUnmount as aa, createVNode as i, watch as Q, reactive as vl, nextTick as Qe, withModifiers as Te, useModel as za, mergeModels as ra, defineAsyncComponent as ua, withDirectives as ml, vShow as fl, provide as bl } from "vue";
import { u as la, a as yl, b as pl, c as gl } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Ue, l as te, d as ne, k as me, b as Me, A as hl, e as $e, a as xe, p as ye, w as Ea, c as we, _ as Be, f as fa, g as be, s as Oa, i as qe, h as Ve, j as ba, m as He, o as ta, n as kl, q as $l, r as Xe, t as Pa, v as Ma, x as Da, y as wl, z as _l, B as Ba, C as qa, D as ea, E as xl, F as Cl, G as Vl, H as Sl, I as Tl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-BUEYdgcR.js";
import { host as Ce, api as Ul, on as Rl, define as jl } from "@wippy-fe/proxy";
import { Icon as z } from "@iconify/vue";
import Re from "primevue/skeleton";
import D from "primevue/button";
import ue from "primevue/column";
import ya from "primevue/datatable";
import pa from "primevue/iconfield";
import ga from "primevue/inputicon";
import de from "primevue/inputtext";
import _e from "primevue/selectbutton";
import je from "primevue/dialog";
import Al from "primevue/progressbar";
import Ne from "primevue/tag";
import ze from "primevue/select";
import Ll from "primevue/accordion";
import Il from "primevue/accordioncontent";
import Nl from "primevue/accordionheader";
import zl from "primevue/accordionpanel";
import El from "primevue/menu";
import Ol from "primevue/checkbox";
import Pl from "primevue/inputnumber";
import da from "primevue/textarea";
import Ha from "primevue/drawer";
import Ml from "primevue/fileupload";
const Dl = ["aria-labelledby"], Bl = { class: "kx-railhead" }, ql = ["id"], Hl = { key: 0 }, Fl = { class: "kx-railhead-acts" }, Jl = { class: "kx-rail-body" }, Wl = /* @__PURE__ */ le({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(a) {
    const d = ve();
    return (o, u) => (l(), n("aside", {
      class: re(["kx-rail", { "kx-settings-list-rail": a.settings }]),
      "aria-labelledby": e(d)
    }, [
      t("div", Bl, [
        t("span", {
          id: e(d),
          class: "kx-railhead-title"
        }, [
          K(b(a.title), 1),
          a.count !== void 0 ? (l(), n("b", Hl, b(a.count), 1)) : V("", !0)
        ], 8, ql),
        t("div", Fl, [
          Ie(o.$slots, "actions")
        ])
      ]),
      Ie(o.$slots, "toolbar"),
      t("div", Jl, [
        Ie(o.$slots, "default")
      ])
    ], 10, Dl));
  }
}), Kl = ["aria-label"], Yl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Gl = ["aria-current", "onClick"], Zl = { class: "kx-settings-rail-label" }, Ql = /* @__PURE__ */ le({
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
  setup(a) {
    const d = a, o = P(() => d.leadingItem ? [{ items: [d.leadingItem] }, ...d.groups] : d.groups);
    function u(v) {
      const r = [...v.currentTarget.querySelectorAll(".kx-settings-rail-item")], _ = r.indexOf(v.target);
      if (_ < 0) return;
      let m;
      switch (v.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (_ + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (_ + r.length - 1) % r.length;
          break;
        case "Home":
          m = 0;
          break;
        case "End":
          m = r.length - 1;
          break;
        default:
          return;
      }
      v.preventDefault(), r[m]?.focus();
    }
    return (v, r) => (l(), O(ol(a.title ? Wl : "div"), rl(ul(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ma({
      default: A(() => [
        t("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: u
        }, [
          (l(!0), n(F, null, ce(o.value, (_, m) => (l(), n("div", {
            key: _.items[0]?.value ?? m,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && m === 0 }])
          }, [
            _.heading ? (l(), n("div", Yl, b(_.heading), 1)) : V("", !0),
            (l(!0), n(F, null, ce(_.items, (S) => (l(), n("button", {
              key: S.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": S.value === a.value ? "true" : void 0,
              onClick: (T) => v.$emit("update:value", S.value)
            }, [
              S.icon ? (l(), O(e(z), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: S.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Zl, b(S.label), 1)
            ], 8, Gl))), 128))
          ], 2))), 128))
        ], 42, Kl)
      ]),
      _: 2
    }, [
      a.title && v.$slots.actions ? {
        name: "actions",
        fn: A(() => [
          Ie(v.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Fa = Symbol("mail-admin");
function fe() {
  const a = dl(Fa);
  if (!a) throw new Error("Mail administration context is missing");
  return a;
}
function Ja(a) {
  const { kind: d, name: o, title: u, description: v, state: r, revision: _, origin: m, origin_label: S, base: T, author: c, author_label: y, updated_at: R, used_by: g } = a, p = g && {
    messages: g.messages?.length,
    recent_sources: g.recent_senders?.length
  };
  return { kind: d, name: o, title: u, description: v, state: r, revision: _, origin: m, origin_label: S, base: T, author: c, author_label: y, updated_at: R, used_by: p };
}
function Xl() {
  const a = Object.fromEntries(["message", "base", "part", "asset"].map((g) => [g, { rows: pe([]), loaded: w(!1), loading: w(!1), error: w(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map();
  let o = 0;
  function u(g) {
    const p = d.get(g);
    if (p) return p;
    const h = a[g];
    h.loading.value = !0;
    const f = o, k = (async () => {
      try {
        const $ = [];
        let L;
        do {
          const I = await te.page({ kind: g, cursor: L });
          $.push(...I.items), L = I.next_cursor;
        } while (L);
        h.rows.value = $, h.loaded.value = !0, h.stale = f !== o, h.error.value = "";
      } catch ($) {
        h.error.value = ne($, "The mail library could not be loaded.");
      } finally {
        h.loading.value = !1, d.delete(g), f !== o && h.users > 0 && v(g);
      }
    })();
    return d.set(g, k), k;
  }
  function v(g) {
    const p = a[g];
    (!p.loaded.value || p.stale) && !p.loading.value && u(g);
  }
  function r(...g) {
    cl(() => {
      for (const p of g)
        a[p].users++, v(p);
    }), aa(() => {
      for (const p of g) a[p].users--;
    });
  }
  function _(g, p, h) {
    const f = a[g];
    if (!f.loaded.value) return;
    const k = f.rows.value.filter(($) => $.name !== p);
    h && k.push(h), f.rows.value = k;
  }
  function m() {
    o++;
    for (const [g, p] of Object.entries(a))
      p.stale = p.loaded.value, p.users > 0 && v(g);
  }
  Ue("mail.library", m);
  const S = (g, p) => a[g].rows.value.find((h) => h.name === p);
  function T(g, p) {
    const h = S(g, p);
    return h ? h.title : (v(g), a[g].loaded.value ? p : void 0);
  }
  return { kinds: a, use: r, ensure: v, load: u, find: S, title: T, ofKind: (g) => [...a[g].rows.value].sort((p, h) => p.title.localeCompare(h.title)), ready: (g) => a[g].loaded.value, failed: (g) => a[g].error.value, refresh: m, patch: _ };
}
const et = { class: "kx-empty" }, at = { class: "kx-empty-ico" }, lt = { class: "kx-empty-title" }, tt = {
  key: 0,
  class: "kx-empty-sub"
}, ha = /* @__PURE__ */ le({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(a) {
    return (d, o) => (l(), n("div", et, [
      t("div", at, [
        i(e(z), {
          icon: a.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", lt, b(a.title), 1),
      a.hint || d.$slots.hint ? (l(), n("p", tt, [
        Ie(d.$slots, "hint", {}, () => [
          K(b(a.hint), 1)
        ])
      ])) : V("", !0),
      a.cta ? (l(), O(e(D), {
        key: 1,
        label: a.cta,
        onClick: o[0] || (o[0] = (u) => d.$emit("cta"))
      }, ma({ _: 2 }, [
        a.ctaIcon ? {
          name: "icon",
          fn: A(({ class: u }) => [
            i(e(z), {
              icon: a.ctaIcon,
              class: re(u),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : V("", !0)
    ]));
  }
}), ka = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Wa = Object.fromEntries(Object.entries(ka).map(([a, d]) => [d, a])), st = ["content", "variables", "used-by", "history"];
function ca(a) {
  return ka[a];
}
function it(a) {
  return Wa[a];
}
function Ka(a) {
  return a === "base" ? ["content", "used-by", "history"] : a === "part" ? ["content", "variables", "history"] : st;
}
function Le(a) {
  return a.name === "activity" ? a.message ? `activity/${encodeURIComponent(a.message)}` : a.template ? `activity/template/${encodeURIComponent(a.template)}` : "activity" : a.name === "library" ? a.section === "assets" && a.asset ? `assets/${encodeURIComponent(a.asset)}` : a.section === "all" ? "" : a.section : `${ka[a.kind]}/${encodeURIComponent(a.resource)}/${a.section}`;
}
function La(a) {
  const d = (a ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, u, v] = d;
  if (!o) return { name: "library", section: "all" };
  try {
    if (o === "activity")
      return u === "template" && v ? { name: "activity", template: decodeURIComponent(v) } : u ? { name: "activity", message: decodeURIComponent(u) } : { name: "activity" };
    if (o === "assets") return u ? { name: "library", section: "assets", asset: decodeURIComponent(u) } : { name: "library", section: "assets" };
    const r = Wa[o];
    if (!r) return { name: "library", section: "all" };
    if (!u) return { name: "library", section: o };
    const m = Ka(r).find((S) => S === v) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(u), section: m };
  } catch {
    return { name: "library", section: "all" };
  }
}
const nt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", oa = `<meta http-equiv="Content-Security-Policy" content="${nt}">`;
function $a(a, d) {
  let o = a;
  for (const [r, _] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join(_);
  const u = /<head(\s[^>]*)?>/i.exec(o);
  if (u) return o.slice(0, u.index + u[0].length) + oa + o.slice(u.index + u[0].length);
  const v = /<html(\s[^>]*)?>/i.exec(o);
  return v ? o.slice(0, v.index + v[0].length) + "<head>" + oa + "</head>" + o.slice(v.index + v[0].length) : oa + o;
}
const ot = {
  class: "mail-problem",
  role: "alert"
}, rt = { class: "mail-problem-lead" }, ut = {
  key: 0,
  class: "mail-problem-detail"
}, dt = {
  key: 1,
  class: "mail-problem-involved"
}, ct = {
  key: 0,
  class: "mail-problem-self"
}, va = /* @__PURE__ */ le({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = fe(), v = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (c) => o.title(c.kind, c.name), _ = (c) => !!c && !!d.draft && c.kind === d.draft.kind && c.name === d.draft.name, m = P(() => {
      const { resource: c, face: y, previewOf: R } = d.problem, g = y ? v[y] : "";
      if (c && d.draft && d.draft.kind !== "message" && c.kind === "message" && c.name === R)
        return `${r(c) ?? "The message"} does not render with your changes.`;
      if (d.problem.tooLarge) {
        const p = !c || _(c) ? d.draft ? `this ${me[d.draft.kind].toLowerCase()}` : "it" : r(c) ?? "a resource it uses";
        return `The ${g || "content"} of ${p} is larger than Mail can send. Keep each rendered face under ${Me(d.problem.tooLarge)}.`;
      }
      if (!c || _(c)) {
        const p = d.draft ? `this ${me[d.draft.kind].toLowerCase()}` : "it";
        return g ? `The ${g} of ${p} does not render.` : `${p[0].toUpperCase()}${p.slice(1)} does not render.`;
      }
      return `${r(c) ?? "A resource it uses"} does not render${g ? ` (${g})` : ""}.`;
    }), S = P(() => d.problem.candidates ?? []);
    function T(c) {
      c.kind === "asset" ? u({ name: "library", section: "assets", asset: c.name }) : u({ name: "resource", kind: c.kind, resource: c.name, section: "content" });
    }
    return (c, y) => (l(), n("div", ot, [
      t("p", rt, [
        i(e(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(m.value), 1)
      ]),
      a.problem.tooLarge ? V("", !0) : (l(), n("code", ut, b(a.problem.engine ?? a.problem.message), 1)),
      S.value.length ? (l(), n("p", dt, [
        y[0] || (y[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(F, null, ce(S.value, (R) => (l(), n(F, {
          key: R.kind + R.name
        }, [
          _(R) ? (l(), n("span", ct, "This " + b(e(me)[R.kind].toLowerCase()), 1)) : r(R) === void 0 ? (l(), O(e(Re), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), O(e(D), {
            key: 2,
            link: "",
            size: "small",
            label: r(R),
            class: "mail-inline-link",
            onClick: (g) => T(R)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : V("", !0)
    ]));
  }
}), Ia = ["html", "text", "subject", "variables", "samples"];
function Oe(a) {
  return !!a && typeof a == "object" && typeof a.kind == "string" && typeof a.name == "string";
}
function De(a) {
  if (!(a instanceof hl)) return;
  const d = a.details ?? {}, o = $e(a);
  if (o === "mail_resource_in_use") {
    const T = Array.isArray(d.messages) ? d.messages.filter((y) => typeof y == "string") : [], c = d.dependent;
    return {
      message: a.message,
      dependents: T,
      references: Array.isArray(d.resources) ? d.resources.filter(Oe) : void 0,
      face: Ia.find((y) => y === c?.face),
      resource: Oe(c?.resource) ? c.resource : void 0
    };
  }
  const u = Ia.find((T) => T === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!u) return;
  const v = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((T) => typeof T == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((T) => {
    const c = T;
    return Oe(c.resource) && typeof c.message == "string" ? [{ name: c.resource.name, message: c.message }] : [];
  }) : [], _ = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(Oe) : [], m = typeof d.engine_message == "string" ? d.engine_message : void 0, S = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: a.message,
    engine: m,
    tooLarge: S,
    face: u,
    resource: Oe(d.resource) ? d.resource : void 0,
    dependents: v.length ? v : void 0,
    reasons: r.length ? r : void 0,
    candidates: _.length ? _ : void 0
  };
}
const vt = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, mt = { class: "kx-modal-head-icon" }, ft = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, bt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, yt = {
  key: 2,
  class: "mail-muted"
}, pt = ["data-name"], gt = { class: "mail-gallery-title" }, ht = { class: "mail-sub" }, kt = {
  key: 0,
  class: "mail-gallery-warning",
  role: "status"
}, $t = { class: "mail-gallery-frame" }, wt = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, _t = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, xt = {
  key: 2,
  class: "mail-gallery-problem"
}, Ct = {
  key: 1,
  role: "alert"
}, Vt = ["srcdoc", "title"], St = {
  key: 3,
  class: "mail-more"
}, Tt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ut = 3, Rt = /* @__PURE__ */ le({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { go: v } = fe();
    xe(() => o.visible);
    const r = w([]), _ = w(), m = w(), S = w(!1), T = w("");
    let c = 0, y = [], R = 0, g;
    async function p(C, x) {
      C.state = "loading";
      try {
        const s = await te.preview(C.name, []);
        if (x !== c) return;
        C.subject = s.subject, C.warning = s.warnings?.length ? s.warnings.map(Ea).join(" ") : void 0, C.document = s.html ? $a(s.html, s.inline_assets) : "", C.state = "ready";
      } catch (s) {
        if (x !== c) return;
        C.problem = De(s), C.failure = C.problem ? "" : ne(s, "This message could not be rendered."), C.state = "failed";
      }
    }
    function h(C) {
      for (; C === c && R < Ut && y.length; ) {
        const x = y.shift();
        x.state === "waiting" && (R++, p(x, C).finally(() => {
          R--, h(C);
        }));
      }
    }
    function f(C) {
      C.state !== "waiting" || y.includes(C) || (y.push(C), h(c));
    }
    const k = w();
    function $() {
      if (g?.disconnect(), typeof IntersectionObserver > "u" || !k.value) {
        for (const C of r.value) f(C);
        return;
      }
      g = new IntersectionObserver((C) => {
        for (const x of C) {
          if (!x.isIntersecting) continue;
          const s = r.value.find((U) => U.name === x.target.dataset.name);
          s && f(s);
        }
      }, { root: k.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const C of k.value.querySelectorAll("[data-name]")) g.observe(C);
    }
    async function L(C) {
      S.value = !0, T.value = "";
      try {
        const x = await te.page({ kind: "message", cursor: _.value });
        if (C !== c) return;
        r.value = [...r.value, ...x.items.map((s) => vl({ name: s.name, title: s.title, state: "waiting" }))], _.value = x.next_cursor, m.value = x.total, await Qe(), $();
      } catch (x) {
        C === c && (T.value = ne(x, "The messages could not be listed."));
      } finally {
        C === c && (S.value = !1);
      }
    }
    function I() {
      c++, y = [], g?.disconnect(), g = void 0;
    }
    function N() {
      I(), r.value = [], _.value = m.value = void 0, L(c);
    }
    function E() {
      const C = ++c;
      y = [];
      for (const x of r.value) Object.assign(x, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Qe(() => {
        C === c && $();
      });
    }
    Q(() => o.visible, (C) => {
      C ? N() : I();
    }), aa(I);
    const X = P(() => r.value.filter((C) => C.state === "ready" || C.state === "failed").length), ae = P(() => r.value.filter((C) => C.state === "failed").length), se = P(() => {
      if (!r.value.length) return "";
      const C = `${X.value} of ${ye(m.value ?? r.value.length, "message")} rendered`;
      return ae.value ? `${C}, ${ae.value} with a problem.` : C + ".";
    });
    function q(C) {
      u("close"), v({ name: "resource", kind: "message", resource: C, section: "content" });
    }
    const j = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (C, x) => (l(), O(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: j,
      "aria-label": "Preview all messages",
      "onUpdate:visible": x[1] || (x[1] = (s) => {
        s || u("close");
      })
    }, {
      header: A(() => [
        t("span", mt, [
          i(e(z), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        x[2] || (x[2] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !r.value.length,
          onClick: E
        }, {
          icon: A(() => [
            i(e(z), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: A(() => [
        r.value.length ? (l(), n("div", ft, [
          t("span", null, b(se.value), 1),
          i(e(Al), {
            value: Math.round(X.value / (m.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : V("", !0),
        S.value && !r.value.length ? (l(), n("p", bt, [
          i(e(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = K("Listing messages…", -1))
        ])) : !S.value && !T.value && !r.value.length ? (l(), n("p", yt, "There are no messages yet.")) : V("", !0),
        t("ul", {
          ref_key: "list",
          ref: k,
          class: "mail-gallery"
        }, [
          (l(!0), n(F, null, ce(r.value, (s) => (l(), n("li", {
            key: s.name,
            "data-name": s.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": s.state === "failed" }])
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + s.title,
              onClick: (U) => q(s.name)
            }, {
              default: A(() => [
                t("span", gt, b(s.title), 1),
                t("span", ht, b(s.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            s.warning ? (l(), n("p", kt, [
              i(e(z), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              K(b(s.warning), 1)
            ])) : V("", !0),
            t("div", $t, [
              s.state === "waiting" ? (l(), n("p", wt, "Renders when shown.")) : s.state === "loading" ? (l(), n("p", _t, [
                i(e(z), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                x[4] || (x[4] = K("Rendering…", -1))
              ])) : s.state === "failed" ? (l(), n("div", xt, [
                s.problem ? (l(), O(va, {
                  key: 0,
                  problem: s.problem,
                  draft: { kind: "message", name: s.name }
                }, null, 8, ["problem", "draft"])) : (l(), n("p", Ct, b(s.failure), 1))
              ])) : (l(), n("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: s.document,
                title: s.title + " preview",
                tabindex: "-1"
              }, null, 8, Vt))
            ])
          ], 10, pt))), 128))
        ], 512),
        _.value || T.value ? (l(), n("div", St, [
          T.value ? (l(), n("span", Tt, b(T.value), 1)) : V("", !0),
          i(e(D), {
            label: T.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: S.value,
            onClick: x[0] || (x[0] = (s) => L(e(c)))
          }, null, 8, ["label", "loading"])
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), jt = { class: "mail-source" }, At = { key: 0 }, Lt = { key: 1 }, wa = /* @__PURE__ */ le({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(a) {
    return (d, o) => (l(), n("span", jt, [
      a.resource.state === "created" ? (l(), n("span", At, b((a.resource.kind === "asset" ? "Uploaded by " : "Created by ") + e(we)(a.resource.author_label, a.resource.author)), 1)) : (l(), n("span", Lt, "Included with " + b(a.resource.origin_label), 1)),
      a.resource.state === "customized" ? (l(), O(e(Ne), {
        key: 2,
        severity: "info",
        value: a.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : V("", !0)
    ]));
  }
}), It = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Nt = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, zt = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Et = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Ot = { class: "mail-toolbar" }, Pt = {
  class: "mail-count",
  role: "status"
}, Mt = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Dt = {
  key: 0,
  class: "mail-sub"
}, Bt = { class: "mail-kind" }, qt = { class: "mail-muted" }, Ht = {
  key: 2,
  class: "mail-more"
}, Ft = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Jt = /* @__PURE__ */ le({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, create: v } = fe(), r = P(() => it(d.section));
    Q(r, (Z) => {
      Z === "message" && o.ensure("base");
    }, { immediate: !0 });
    const _ = w("all"), m = w(""), S = w("");
    let T;
    Q(m, (Z) => {
      clearTimeout(T), T = setTimeout(() => {
        S.value = Z.trim();
      }, 250);
    }), Q(() => d.section, () => {
      m.value = S.value = "", _.value = "all";
    });
    const c = pe([]), y = w(), R = w(), g = w(!0), p = w(!1), h = w(!1), f = w(!1), k = w(""), $ = w(""), L = w(""), I = Ve(), N = () => ({ kind: r.value, state: _.value === "all" ? void 0 : _.value, q: S.value || void 0 });
    async function E(Z = !1) {
      const H = I();
      g.value = !0;
      try {
        const J = await te.page(N());
        if (!H()) return;
        c.value = J.items, y.value = J.next_cursor, R.value = J.total, k.value = $.value = L.value = "", f.value = !1, p.value = !0;
      } catch (J) {
        if (!H()) return;
        f.value = qe(J);
        const ee = f.value ? "" : ne(J, "The mail library could not be loaded.");
        Z && p.value && !f.value ? L.value = ee : k.value = ee;
      } finally {
        H() && (g.value = !1);
      }
    }
    async function X() {
      if (g.value || !y.value || h.value) return;
      const Z = I();
      h.value = !0, $.value = "";
      try {
        const H = await te.page({ ...N(), cursor: y.value });
        if (!Z()) return;
        c.value = [...c.value, ...H.items], y.value = H.next_cursor, R.value = H.total;
      } catch (H) {
        Z() && ($.value = ne(H, "More resources could not be loaded."));
      } finally {
        h.value = !1;
      }
    }
    Q([r, _, S], () => {
      E();
    }), la(() => E(p.value)), Ue("mail.library", () => {
      r.value === "message" && o.ensure("base"), E(p.value);
    });
    const ae = P(() => {
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
    }), se = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], q = P(() => {
      const Z = r.value ? me[r.value].toLowerCase() : "resource", H = R.value ?? c.value.length;
      return c.value.length < H ? `${c.value.length} of ${ye(H, Z)}` : ye(H, Z);
    });
    function j(Z) {
      const H = Z.used_by;
      return Z.kind === "base" || Z.kind === "asset" ? H?.messages ? ye(H.messages, "message") : "—" : Z.kind === "message" ? H?.recent_sources ? ye(H.recent_sources, "recent sender") : "—" : "";
    }
    function C(Z) {
      return Z.base ? o.title("base", Z.base) : "";
    }
    function x(Z) {
      Z.kind === "asset" ? u({ name: "library", section: "assets", asset: Z.name }) : u({ name: "resource", kind: Z.kind, resource: Z.name, section: "content" });
    }
    const s = P(() => p.value && !k.value && r.value && !c.value.length && _.value === "all" && !S.value), U = w(!1);
    return (Z, H) => (l(), n(F, null, [
      i(Be, {
        title: ae.value.title,
        description: ae.value.description
      }, {
        actions: A(() => [
          !r.value || r.value === "message" ? (l(), O(e(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: H[0] || (H[0] = (J) => U.value = !0)
          }, {
            icon: A(() => [
              i(e(z), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          i(e(D), {
            label: r.value ? "New " + e(me)[r.value].toLowerCase() : "New",
            onClick: H[1] || (H[1] = (J) => e(v)({ kind: r.value }))
          }, {
            icon: A(() => [
              i(e(z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      f.value ? (l(), n("p", It, [
        i(e(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        H[9] || (H[9] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : k.value ? (l(), n("div", Nt, [
        t("span", null, b(k.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: H[2] || (H[2] = (J) => E())
        })
      ])) : V("", !0),
      L.value ? (l(), n("div", zt, [
        t("span", null, b(L.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: H[3] || (H[3] = (J) => E(!0))
        })
      ])) : g.value && !p.value ? (l(), n("p", Et, [
        i(e(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        H[10] || (H[10] = K("Loading mail library…", -1))
      ])) : s.value && r.value ? (l(), O(ha, {
        key: 4,
        icon: e(be)[r.value],
        title: "No " + e(fa)[r.value].toLowerCase() + " yet",
        hint: "Create a " + e(me)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + e(me)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: H[4] || (H[4] = (J) => e(v)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : p.value ? (l(), n(F, { key: 5 }, [
        t("div", Ot, [
          i(e(_e), {
            modelValue: _.value,
            "onUpdate:modelValue": H[5] || (H[5] = (J) => _.value = J),
            options: se,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          i(e(pa), { class: "mail-search" }, {
            default: A(() => [
              i(e(ga), null, {
                default: A(() => [
                  i(e(z), {
                    icon: g.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: g.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              i(e(de), {
                modelValue: m.value,
                "onUpdate:modelValue": H[6] || (H[6] = (J) => m.value = J),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + ae.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Pt, b(q.value), 1)
        ]),
        c.value.length ? (l(), O(e(ya), {
          key: 1,
          value: c.value,
          "data-key": (J) => J.kind + "/" + J.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": ae.value.title } },
          onRowClick: H[7] || (H[7] = (J) => x(J.data))
        }, {
          default: A(() => [
            i(e(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: J }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: J.title,
                  onClick: Te((ee) => x(J), ["stop"])
                }, null, 8, ["label", "onClick"]),
                J.description ? (l(), n("span", Dt, b(J.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            r.value ? V("", !0) : (l(), O(e(ue), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: A(({ data: J }) => [
                t("span", Bt, [
                  i(e(z), {
                    icon: e(be)[J.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  K(b(e(me)[J.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), O(e(ue), {
              key: 1,
              header: "Base template"
            }, {
              body: A(({ data: J }) => [
                C(J) === void 0 ? (l(), O(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(F, { key: 1 }, [
                  K(b(C(J)), 1)
                ], 64))
              ]),
              _: 1
            })) : V("", !0),
            i(e(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: J }) => [
                i(wa, { resource: J }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), O(e(ue), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: J }) => [
                K(b(j(J)), 1)
              ]),
              _: 1
            })) : V("", !0),
            i(e(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: J }) => [
                t("span", qt, b(J.state === "original" ? "—" : e(Oa)(J.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", Mt, "Nothing matches. Try another name or a word from the template.")),
        y.value ? (l(), n("div", Ht, [
          $.value ? (l(), n("span", Ft, b($.value), 1)) : V("", !0),
          i(e(D), {
            label: $.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: h.value,
            disabled: g.value,
            onClick: X
          }, null, 8, ["label", "loading", "disabled"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      i(Rt, {
        visible: U.value,
        onClose: H[8] || (H[8] = (J) => U.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function Wt(a) {
  return JSON.parse(JSON.stringify(a));
}
function ke(a) {
  const d = Wt(a);
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
function Kt(a, d) {
  return JSON.stringify(ke(a)) === JSON.stringify(ke(d));
}
function Yt(a, d, o, u, v) {
  const r = { type: "object", properties: {} };
  return a === "message" ? {
    kind: a,
    name: d,
    title: o,
    description: u,
    base: v,
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
  } : a === "base" ? {
    kind: a,
    name: d,
    title: o,
    description: u,
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
  } : { kind: a, name: d, title: o, description: u, schema: r, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function Gt(a) {
  if (typeof a == "string") return JSON.stringify(a);
  if (typeof a == "number" || typeof a == "boolean") return String(a);
}
function Zt(a) {
  const d = [], o = a.samples;
  for (const [u, v] of Object.entries(a.schema.properties)) {
    const r = Gt(o[u] ?? v.default ?? (v.type === "string" ? "" : null));
    r !== void 0 && d.push(`${JSON.stringify(u)}, ${r}`);
  }
  return d.length ? `{{ include "/part/${a.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${a.name}" }}`;
}
function Ya(a) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) ? `{{ assets.${a} }}` : `{{ assets[${JSON.stringify(a)}] }}`;
}
function Qt(a, d, o) {
  const u = o ? ` width="${o}"` : "";
  return `<img src="${Ya(a)}" alt="${d.replace(/"/g, "&quot;")}"${u} style="display:block;border:0;max-width:100%;height:auto;">`;
}
const Xt = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function es(a) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) && !Xt.has(a) ? `{{ ${a} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) ? `{{ vars.${a} }}` : `{{ vars[${JSON.stringify(a)}] }}`;
}
const as = "{{ block body() }}{{ end }}", ls = {
  class: "mail-preview",
  "aria-label": "Preview"
}, ts = { class: "mail-preview-bar" }, ss = {
  key: 0,
  class: "mail-preview-with"
}, is = ["for"], ns = {
  key: 0,
  class: "mail-field-hint"
}, os = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, rs = {
  key: 2,
  class: "mail-preview-envelope"
}, us = ["aria-busy"], ds = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, cs = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, vs = ["srcdoc", "title"], ms = {
  key: 1,
  class: "mail-preview-text"
}, fs = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, bs = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, ys = {
  key: 5,
  class: "mail-preview-foot"
}, ps = /* @__PURE__ */ le({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, delivery: r } = fe();
    o.draft.kind !== "message" && v.use("message");
    const _ = { message: ve() }, m = w("email"), S = w("desktop"), T = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], c = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], y = P(() => v.ready("message") ? (o.messages ?? v.ofKind("message").map((C) => C.name)).map((C) => ({ value: C, label: v.title("message", C) ?? C })).sort((C, x) => C.label.localeCompare(x.label)) : []), R = w("");
    Q(y, (j) => {
      o.draft.kind !== "message" && (j.some((C) => C.value === R.value) || (R.value = j[0]?.value ?? ""));
    }, { immediate: !0 });
    const g = P(() => o.draft.kind !== "message" && R.value && R.value === y.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), p = P(() => o.draft.kind === "message" ? o.draft.name : R.value), h = pe(), f = w(!1), k = w(), $ = w(""), L = Ve();
    let I, N = !1, E = !1;
    async function X() {
      const j = p.value;
      if (!j) return;
      if (N) {
        E = !0;
        return;
      }
      N = !0;
      const C = L();
      f.value = !0;
      try {
        const x = await te.preview(j, [o.draft]);
        if (!C()) return;
        h.value = x, k.value = void 0, $.value = "";
      } catch (x) {
        if (!C()) return;
        const s = De(x);
        k.value = s ? { ...s, previewOf: j } : void 0, $.value = k.value ? "" : ne(x, "The preview could not be rendered.");
      } finally {
        N = !1, C() && (f.value = !1), E && (E = !1, X());
      }
    }
    function ae() {
      clearTimeout(I), I = setTimeout(() => {
        X();
      }, 450);
    }
    Q(() => JSON.stringify(o.draft), ae), Q(p, () => {
      h.value = void 0, X();
    }, { immediate: !0 }), Q(k, (j) => u("problem", j)), aa(() => clearTimeout(I));
    const se = P(() => h.value?.html ? $a(h.value.html, h.value.inline_assets) : ""), q = P(() => {
      const j = r.value?.from;
      return j ? j.name ? `${j.name} <${j.address}>` : j.address : "";
    });
    return (j, C) => (l(), n("section", ls, [
      t("div", ts, [
        i(e(_e), {
          modelValue: m.value,
          "onUpdate:modelValue": C[0] || (C[0] = (x) => m.value = x),
          options: T,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        m.value === "email" ? (l(), O(e(_e), {
          key: 0,
          modelValue: S.value,
          "onUpdate:modelValue": C[1] || (C[1] = (x) => S.value = x),
          options: c,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: A(({ option: x }) => [
            i(e(z), {
              icon: x.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            K(b(x.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      a.draft.kind !== "message" ? (l(), n("div", ss, [
        t("label", {
          for: _.message
        }, "Preview with", 8, is),
        i(e(ze), {
          modelValue: R.value,
          "onUpdate:modelValue": C[2] || (C[2] = (x) => R.value = x),
          "input-id": _.message,
          options: y.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !e(v).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        g.value ? (l(), n("small", ns, b(g.value), 1)) : V("", !0)
      ])) : V("", !0),
      f.value && h.value ? (l(), n("p", os, [
        i(e(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        C[3] || (C[3] = K("Updating the preview…", -1))
      ])) : V("", !0),
      h.value ? (l(), n("dl", rs, [
        q.value ? (l(), n(F, { key: 0 }, [
          C[4] || (C[4] = t("dt", null, "From", -1)),
          t("dd", null, b(q.value), 1)
        ], 64)) : V("", !0),
        C[5] || (C[5] = t("dt", null, "Subject", -1)),
        t("dd", null, b(h.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: re(["mail-preview-body", ["mail-preview-" + S.value, { "mail-preview-stale": k.value || $.value }]]),
        "aria-busy": f.value
      }, [
        !h.value && f.value ? (l(), n("p", ds, [
          i(e(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          C[6] || (C[6] = K("Rendering preview…", -1))
        ])) : p.value ? h.value ? (l(), n(F, { key: 2 }, [
          m.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: se.value,
            title: "Email preview: " + (h.value.subject ?? "")
          }, null, 8, vs)) : (l(), n("pre", ms, b(h.value.text), 1))
        ], 64)) : V("", !0) : (l(), n("p", cs, "Choose a message to see this " + b(a.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, us),
      (l(!0), n(F, null, ce(h.value?.warnings ?? [], (x) => (l(), n("p", {
        key: x.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        i(e(z), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, b(e(Ea)(x)), 1)
      ]))), 128)),
      k.value ? (l(), n("p", fs, [
        i(e(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(h.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : $.value ? (l(), n("p", bs, [
        i(e(z), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b($.value), 1)
      ])) : (l(), n("p", ys, [
        i(e(z), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        K(" " + b(a.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), gs = { class: "kx-modal-head-icon" }, hs = { class: "kx-modal-head-text" }, ks = { class: "kx-modal-head-sub" }, $s = { class: "mail-change-list" }, ws = { class: "mail-muted" }, _s = { class: "mail-field" }, xs = ["for"], Cs = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Vs = { class: "mail-failure-body" }, Ss = { class: "mail-dependents" }, Ts = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Us = /* @__PURE__ */ le({
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
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe(), _ = w(""), m = ve();
    Q(() => o.visible, (y) => {
      y && (_.value = o.suggestedNote ?? "");
    }), xe(() => o.visible);
    const S = P(() => {
      const y = o.saved, R = o.draft, g = [];
      return (y.title !== R.title || y.description !== R.description) && g.push("Name and description"), y.base !== R.base && g.push(`Base template: ${v.title("base", R.base ?? "") ?? R.base}`), y.subject !== R.subject && g.push("Subject"), y.html !== R.html && g.push("HTML"), y.text !== R.text && g.push("Plain text"), (JSON.stringify(y.schema.properties) !== JSON.stringify(R.schema.properties) || JSON.stringify(y.schema.required ?? []) !== JSON.stringify(R.schema.required ?? [])) && g.push(R.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(y.samples) !== JSON.stringify(R.samples) && g.push("Sample values"), g;
    }), T = P(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${me[o.draft.kind].toLowerCase()} changes when you save.`), c = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (y, R) => (l(), O(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !a.busy,
      "close-on-escape": !a.busy,
      class: "mail-dialog",
      pt: c,
      "aria-label": "Review changes",
      "onUpdate:visible": R[3] || (R[3] = (g) => {
        g || u("close");
      })
    }, {
      header: A(() => [
        t("span", gs, [
          i(e(z), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", hs, [
          R[4] || (R[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", ks, b(a.draft.title), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: R[2] || (R[2] = (g) => u("close"))
        }, null, 8, ["disabled"]),
        i(e(D), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: a.busy,
          disabled: !!a.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: R[1] || (R[1] = Te((g) => u("save", _.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            R[5] || (R[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", $s, [
              (l(!0), n(F, null, ce(S.value, (g) => (l(), n("li", { key: g }, b(g), 1))), 128))
            ])
          ]),
          t("p", ws, b(T.value) + " The previous version stays in History.", 1),
          t("div", _s, [
            t("label", {
              class: "mail-field-label",
              for: e(m)
            }, "Note for History", 8, xs),
            i(e(de), {
              id: e(m),
              modelValue: _.value,
              "onUpdate:modelValue": R[0] || (R[0] = (g) => _.value = g),
              placeholder: "What changed and why…",
              disabled: a.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          a.dependents ? (l(), n("div", Cs, [
            i(e(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Vs, [
              t("strong", null, b(a.dependents.names.length === 1 ? "1 message would break" : a.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, b(a.dependents.reason), 1),
              t("span", Ss, [
                (l(!0), n(F, null, ce(a.dependents.names, (g) => (l(), O(e(D), {
                  key: g,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: e(v).title("message", g) ?? g,
                  onClick: (p) => {
                    u("close"), e(r)({ name: "resource", kind: "message", resource: g, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : a.error ? (l(), n("p", Ts, b(a.error), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Ga = /* @__PURE__ */ le({
  __name: "Disclosure",
  props: /* @__PURE__ */ ra({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(a) {
    const d = za(a, "open");
    return (o, u) => (l(), O(e(Ll), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = (v) => d.value = v === "content")
    }, {
      default: A(() => [
        i(e(zl), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: A(() => [
            i(e(Nl), { class: "kx-disclosure-toggle" }, {
              default: A(() => [
                K(b(a.label), 1)
              ]),
              _: 1
            }),
            i(e(Il), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: A(() => [
                Ie(o.$slots, "default")
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
}), Rs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, js = { class: "kx-modal-head-icon" }, As = { class: "kx-modal-head-text" }, Ls = { class: "kx-modal-head-title" }, Is = { class: "mail-field" }, Ns = ["for"], zs = /* @__PURE__ */ le({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(a, { expose: d, emit: o }) {
    const u = a, v = o, { library: r } = fe(), _ = w(), m = w("");
    function S(L) {
      m.value = "", r.ensure("part"), u.face === "html" && r.ensure("asset"), _.value?.toggle(L);
    }
    d({ toggle: S });
    const T = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], c = (L) => ({ label: L, disabled: !0, icon: "tabler:loader-2" });
    async function y(L) {
      m.value = "";
      try {
        v("insert", Zt(await te.get({ kind: "part", name: L })));
      } catch (I) {
        m.value = ne(I, "The part could not be read.");
      }
    }
    const R = w(), g = w(""), p = ve();
    xe(() => !!R.value);
    async function h(L, I) {
      m.value = "";
      try {
        const N = await te.get({ kind: "asset", name: L });
        R.value = { name: L, title: I, width: N.asset?.width }, g.value = I;
      } catch (N) {
        m.value = ne(N, "The image could not be read.");
      }
    }
    function f() {
      R.value && (v("insert", Qt(R.value.name, g.value, R.value.width)), R.value = void 0);
    }
    const k = P(() => {
      const L = Object.entries(u.draft.schema.properties).map(([E]) => ({
        label: E,
        icon: "tabler:variable",
        command: () => v("insert", u.draft.kind === "part" ? `{{ .${E} }}` : es(E))
      })), I = [{
        label: u.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...L, ...T.map((E) => ({
          label: E.label,
          icon: "tabler:world",
          command: () => v("insert", `{{ ${E.name} }}`)
        }))]
      }], N = r.ofKind("part").filter((E) => !(u.draft.kind === "part" && E.name === u.draft.name));
      if (I.push({ label: "Parts", items: r.ready("part") ? N.length ? N.map((E) => ({ label: E.title, icon: be.part, command: () => {
        y(E.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [c("Loading parts…")] }), u.face === "html") {
        const E = r.ofKind("asset");
        I.push({ label: "Images", items: r.ready("asset") ? E.length ? E.map((X) => ({ label: X.title, icon: be.asset, command: () => {
          h(X.name, X.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [c("Loading images…")] });
      }
      return u.draft.kind === "base" && I.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => v("insert", as)
      }] }), I;
    }), $ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (L, I) => (l(), n(F, null, [
      i(e(El), {
        ref_key: "menu",
        ref: _,
        model: k.value,
        popup: "",
        "aria-label": "Insert into " + (a.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: A(({ item: N, class: E }) => [
          N.icon ? (l(), O(e(z), {
            key: 0,
            icon: N.icon,
            class: re(E),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : V("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      m.value ? (l(), n("p", Rs, b(m.value), 1)) : V("", !0),
      i(e(je), {
        visible: !!R.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: $,
        "aria-label": "Insert image",
        "onUpdate:visible": I[2] || (I[2] = (N) => {
          N || (R.value = void 0);
        })
      }, {
        header: A(() => [
          t("span", js, [
            i(e(z), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", As, [
            t("span", Ls, "Insert " + b(R.value?.title), 1),
            I[3] || (I[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: A(() => [
          i(e(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: I[1] || (I[1] = (N) => R.value = void 0)
          }),
          i(e(D), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: A(() => [
          t("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Te(f, ["prevent"])
          }, [
            t("div", Is, [
              t("label", {
                class: "mail-field-label",
                for: e(p)
              }, "Alternative text", 8, Ns),
              i(e(de), {
                id: e(p),
                modelValue: g.value,
                "onUpdate:modelValue": I[0] || (I[0] = (N) => g.value = N),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              I[4] || (I[4] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 64));
  }
}), Es = ["disabled", "inert"], Os = { class: "mail-form" }, Ps = { class: "mail-field" }, Ms = ["for"], Ds = { class: "mail-field" }, Bs = ["for"], qs = { class: "mail-field-hint" }, Hs = { class: "mail-mono" }, Fs = { class: "mail-field" }, Js = ["for"], Ws = { class: "mail-base-row" }, Ks = { class: "mail-kind" }, Ys = ["id"], Gs = { class: "mail-code-frame mail-code-subject" }, Zs = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Qs = { class: "mail-face-bar" }, Xs = { class: "mail-code-frame mail-code-body" }, ei = /* @__PURE__ */ le({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(a) {
    const d = ua(() => import("./CodeEditor-CIrhfC0V.js")), o = a, { library: u, go: v } = fe();
    u.use("base");
    const r = { base: ve(), title: ve(), description: ve(), face: ve() }, _ = w("html"), m = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], S = P(() => u.ofKind("base").map((h) => ({ value: h.name, label: h.title }))), T = P(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), c = w(), y = w();
    function R(h) {
      c.value?.insert(h);
    }
    const g = P(() => {
      const h = o.problem;
      if (h)
        return h.face === "html" || h.face === "text" || h.face === "subject" ? h.face : _.value;
    }), p = P(() => (o.draft.kind === "message" ? "Body" : "Source") + (_.value === "html" ? ", HTML" : ", plain text"));
    return (h, f) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      i(Ga, { label: "Name and description" }, {
        default: A(() => [
          t("div", Os, [
            t("div", Ps, [
              t("label", {
                class: "mail-field-label",
                for: r.title
              }, "Name", 8, Ms),
              i(e(de), {
                id: r.title,
                modelValue: a.draft.title,
                "onUpdate:modelValue": f[0] || (f[0] = (k) => a.draft.title = k)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Ds, [
              t("label", {
                class: "mail-field-label",
                for: r.description
              }, "Description", 8, Bs),
              i(e(de), {
                id: r.description,
                modelValue: a.draft.description,
                "onUpdate:modelValue": f[1] || (f[1] = (k) => a.draft.description = k)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", qs, [
              f[9] || (f[9] = K("Reference ", -1)),
              t("span", Hs, b(a.draft.name), 1),
              K(", used to " + b(a.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      a.draft.kind === "message" ? (l(), n(F, { key: 0 }, [
        t("div", Fs, [
          t("label", {
            class: "mail-field-label",
            for: r.base
          }, "Base template", 8, Js),
          t("div", Ws, [
            i(e(ze), {
              modelValue: a.draft.base,
              "onUpdate:modelValue": f[2] || (f[2] = (k) => a.draft.base = k),
              "input-id": r.base,
              options: S.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !e(u).ready("base")
            }, {
              value: A(({ value: k }) => [
                t("span", Ks, [
                  i(e(z), {
                    icon: e(be).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  k && e(u).title("base", k) === void 0 ? (l(), O(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    K(b(e(u).title("base", k)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            a.draft.base ? (l(), O(e(D), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: f[3] || (f[3] = (k) => e(v)({ name: "resource", kind: "base", resource: a.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: re(["mail-field", { "mail-field-invalid": g.value === "subject" || T.value }])
        }, [
          t("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Ys),
          t("div", Gs, [
            i(e(d), {
              modelValue: a.draft.subject,
              "onUpdate:modelValue": f[4] || (f[4] = (k) => a.draft.subject = k),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          T.value ? (l(), n("small", Zs, "A subject is one line. Remove the line break.")) : a.problem && g.value === "subject" ? (l(), O(va, {
            key: 1,
            problem: a.problem,
            draft: a.draft
          }, null, 8, ["problem", "draft"])) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: re(["mail-field", { "mail-field-invalid": a.problem && g.value !== "subject" }])
      }, [
        t("div", Qs, [
          i(e(_e), {
            modelValue: _.value,
            "onUpdate:modelValue": f[5] || (f[5] = (k) => _.value = k),
            options: m,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (a.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          i(e(D), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: f[6] || (f[6] = (k) => y.value?.toggle(k))
          }, {
            icon: A(() => [
              i(e(z), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", Xs, [
          _.value === "html" ? (l(), O(e(d), {
            ref_key: "editor",
            ref: c,
            key: "html",
            modelValue: a.draft.html,
            "onUpdate:modelValue": f[7] || (f[7] = (k) => a.draft.html = k),
            label: p.value
          }, null, 8, ["modelValue", "label"])) : (l(), O(e(d), {
            ref_key: "editor",
            ref: c,
            key: "text",
            modelValue: a.draft.text,
            "onUpdate:modelValue": f[8] || (f[8] = (k) => a.draft.text = k),
            label: p.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        a.problem && g.value !== "subject" ? (l(), O(va, {
          key: 0,
          problem: a.problem,
          draft: a.draft
        }, null, 8, ["problem", "draft"])) : V("", !0)
      ], 2),
      i(zs, {
        ref_key: "inserter",
        ref: y,
        draft: a.draft,
        face: _.value,
        onInsert: R
      }, null, 8, ["draft", "face"])
    ], 8, Es));
  }
}), ai = { class: "mail-value-field" }, li = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Na = /* @__PURE__ */ le({
  __name: "ValueField",
  props: /* @__PURE__ */ ra({
    type: {},
    itemType: {},
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: [null, Boolean, Number, String, Array, Object] },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ ra(["invalid"], ["update:modelValue"]),
  setup(a, { emit: d }) {
    const o = a, u = za(a, "modelValue"), v = d, r = (k) => k === null || ["string", "number", "boolean"].includes(typeof k), _ = (k) => k === void 0 || Array.isArray(k) && k.every(r), m = (k) => k === void 0 || !!k && typeof k == "object" && !Array.isArray(k) && Object.values(k).every(($) => typeof $ == "string"), S = w(!1);
    Q(() => o.type, () => {
      S.value = !1;
    });
    const T = P(() => S.value ? "written" : o.type === "array" ? _(u.value) ? "list" : "written" : o.type === "object" ? m(u.value) ? "record" : "written" : o.type), c = P({
      get: () => Array.isArray(u.value) ? u.value.map((k) => k === null ? "" : String(k)).join(`
`) : "",
      set: (k) => {
        const $ = k.split(`
`).map((I) => I.trim()).filter(Boolean), L = o.itemType === "number" || o.itemType === "integer";
        u.value = $.length ? $.map((I) => L && I !== "" && !Number.isNaN(Number(I)) ? Number(I) : I) : void 0;
      }
    }), y = w([]);
    Q(u, (k) => {
      if (T.value !== "record") return;
      const $ = k ?? {};
      JSON.stringify(Object.fromEntries(y.value.filter((L) => L.key).map((L) => [L.key, L.value]))) !== JSON.stringify($) && (y.value = Object.entries($).map(([L, I]) => ({ key: L, value: I })));
    }, { immediate: !0 });
    function R() {
      const k = y.value.filter(($) => $.key.trim());
      u.value = k.length ? Object.fromEntries(k.map(($) => [$.key.trim(), $.value])) : void 0;
    }
    const g = w(""), p = w("");
    Q([u, T], () => {
      T.value === "written" && !p.value && (g.value = u.value === void 0 ? "" : JSON.stringify(u.value, null, 2));
    }, { immediate: !0 });
    function h(k) {
      if (g.value = k, !k.trim()) {
        p.value = "", u.value = void 0;
        return;
      }
      try {
        const $ = JSON.parse(k), L = o.type === "array" ? Array.isArray($) : !!$ && typeof $ == "object" && !Array.isArray($);
        p.value = L ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', L && (u.value = $);
      } catch {
        p.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    Q(p, (k) => v("invalid", k), { immediate: !0 });
    const f = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (k, $) => (l(), n("div", ai, [
      T.value === "string" ? (l(), O(e(de), {
        key: 0,
        "model-value": typeof u.value == "string" ? u.value : "",
        "aria-label": a.label,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": $[0] || ($[0] = (L) => u.value = L || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "number" || T.value === "integer" ? (l(), O(e(Pl), {
        key: 1,
        "model-value": typeof u.value == "number" ? u.value : null,
        "aria-label": a.label,
        "max-fraction-digits": T.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": $[1] || ($[1] = (L) => u.value = L ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : T.value === "boolean" ? (l(), O(e(_e), {
        key: 2,
        "model-value": typeof u.value == "boolean" ? u.value : null,
        options: f,
        "option-label": "label",
        "option-value": "value",
        "aria-label": a.label,
        disabled: a.disabled,
        "onUpdate:modelValue": $[2] || ($[2] = (L) => u.value = typeof L == "boolean" ? L : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "list" ? (l(), O(e(da), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": $[3] || ($[3] = (L) => c.value = L),
        "aria-label": a.label,
        rows: "3",
        "auto-resize": "",
        disabled: a.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : T.value === "record" ? (l(), n(F, { key: 4 }, [
        (l(!0), n(F, null, ce(y.value, (L, I) => (l(), n("div", {
          key: I,
          class: "mail-value-entry"
        }, [
          i(e(de), {
            modelValue: L.key,
            "onUpdate:modelValue": [(N) => L.key = N, R],
            "aria-label": a.label + ", name " + (I + 1),
            placeholder: "Name",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(e(de), {
            modelValue: L.value,
            "onUpdate:modelValue": [(N) => L.value = N, R],
            "aria-label": a.label + ", value " + (I + 1),
            placeholder: "Value",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(e(D), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (L.key || "entry"),
            disabled: a.disabled,
            onClick: (N) => {
              y.value.splice(I, 1), R();
            }
          }, {
            icon: A(() => [
              i(e(z), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        i(e(D), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: a.disabled,
          onClick: $[4] || ($[4] = (L) => y.value.push({ key: "", value: "" }))
        }, {
          icon: A(() => [
            i(e(z), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(F, { key: 5 }, [
        i(e(da), {
          "model-value": g.value,
          "aria-label": a.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!p.value,
          disabled: a.disabled,
          fluid: "",
          "onUpdate:modelValue": h
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        p.value ? (l(), n("small", li, b(p.value), 1)) : V("", !0)
      ], 64)),
      (a.type === "array" || a.type === "object") && T.value !== "written" ? (l(), O(e(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: a.disabled,
        onClick: $[5] || ($[5] = (L) => S.value = !0)
      }, null, 8, ["disabled"])) : V("", !0)
    ]));
  }
}), ti = ["disabled", "inert"], si = { class: "mail-sr-only" }, ii = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ni = {
  key: 1,
  class: "mail-muted"
}, oi = ["aria-label"], ri = { class: "mail-variable-grid" }, ui = { class: "mail-field" }, di = { class: "mail-field" }, ci = { class: "mail-field" }, vi = ["id"], mi = { class: "mail-variable-check" }, fi = { class: "mail-field" }, bi = { class: "mail-variable-values" }, yi = {
  key: 0,
  class: "mail-field"
}, pi = { class: "mail-field" }, gi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, hi = /* @__PURE__ */ le({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(a, { emit: d }) {
    const o = a, u = d, v = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let r = 0;
    function _(p) {
      const h = new Set(p.schema.required ?? []);
      return Object.entries(p.schema.properties).map(([f, k]) => {
        const $ = k.items;
        return {
          id: r++,
          name: f,
          schema: k,
          title: typeof k.title == "string" ? k.title : "",
          type: v.some((L) => L.value === k.type) ? k.type : "string",
          itemType: typeof $?.type == "string" ? $.type : void 0,
          required: h.has(f),
          description: typeof k.description == "string" ? k.description : "",
          sample: p.samples[f],
          fallback: k.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const m = w([]);
    m.value = _(o.draft), Q(() => o.draft, (p) => {
      m.value = _(p);
    });
    function S(p, h) {
      if (h === void 0) return !0;
      switch (p.type) {
        case "string":
          return typeof h == "string";
        case "number":
          return typeof h == "number";
        case "integer":
          return typeof h == "number" && Number.isInteger(h);
        case "boolean":
          return typeof h == "boolean";
        case "array":
          return Array.isArray(h);
        default:
          return !!h && typeof h == "object" && !Array.isArray(h);
      }
    }
    function T(p, h) {
      p.type = h, S(p, p.sample) || (p.sample = void 0), S(p, p.fallback) || (p.fallback = void 0);
    }
    const c = P(() => m.value.map((p) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(p.name) ? m.value.some((h) => h !== p && h.name === p.name) ? "Another one has this name." : p.valueErrors.sample || p.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    Q(c, (p) => u("invalid", p.some(Boolean)), { immediate: !0 }), Q(m, (p) => {
      if (c.value.some(Boolean)) return;
      const h = {}, f = {};
      for (const $ of p) {
        const L = { ...$.schema, type: $.type };
        for (const [I, N] of [["title", $.title], ["description", $.description]])
          N ? L[I] = N : delete L[I];
        $.fallback !== void 0 ? L.default = $.fallback : delete L.default, h[$.name] = L, $.sample !== void 0 && (f[$.name] = $.sample);
      }
      const k = p.filter(($) => $.required).map(($) => $.name);
      o.draft.schema = { ...o.draft.schema, properties: h, required: k.length ? k : void 0 }, o.draft.samples = f;
    }, { deep: !0 });
    function y() {
      let p = m.value.length + 1;
      for (; m.value.some((h) => h.name === `value_${p}`); ) p++;
      m.value.push({
        id: r++,
        name: `value_${p}`,
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
    const R = P(() => o.draft.kind === "part"), g = P(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${vt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (p, h) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      t("legend", si, b(a.label), 1),
      g.value ? (l(), n("p", ii, b(g.value), 1)) : V("", !0),
      m.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": a.label
      }, [
        (l(!0), n(F, null, ce(m.value, (f, k) => (l(), n("li", {
          key: f.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": c.value[k] }])
        }, [
          t("div", ri, [
            t("label", ui, [
              h[0] || (h[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              i(e(de), {
                modelValue: f.name,
                "onUpdate:modelValue": ($) => f.name = $,
                class: "mail-mono-input",
                invalid: !!c.value[k] && !f.valueErrors.sample && !f.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", di, [
              h[1] || (h[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              i(e(de), {
                modelValue: f.title,
                "onUpdate:modelValue": ($) => f.title = $,
                placeholder: f.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", ci, [
              t("span", {
                id: "type-" + f.id,
                class: "mail-field-label"
              }, "Type", 8, vi),
              i(e(ze), {
                "model-value": f.type,
                options: v,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + f.id,
                "onUpdate:modelValue": ($) => T(f, $)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", mi, [
              i(e(Ol), {
                modelValue: f.required,
                "onUpdate:modelValue": ($) => f.required = $,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              h[2] || (h[2] = t("span", null, "Required", -1))
            ]),
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + f.name,
              title: "Remove " + f.name,
              onClick: ($) => m.value.splice(k, 1)
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", fi, [
            h[3] || (h[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            i(e(de), {
              modelValue: f.description,
              "onUpdate:modelValue": ($) => f.description = $,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", bi, [
            R.value ? (l(), n("div", yi, [
              h[4] || (h[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              i(Na, {
                modelValue: f.fallback,
                "onUpdate:modelValue": ($) => f.fallback = $,
                type: f.type,
                "item-type": f.itemType,
                label: "Default of " + f.name,
                onInvalid: ($) => f.valueErrors.fallback = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : V("", !0),
            t("div", pi, [
              h[5] || (h[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              i(Na, {
                modelValue: f.sample,
                "onUpdate:modelValue": ($) => f.sample = $,
                type: f.type,
                "item-type": f.itemType,
                label: "Sample value of " + f.name,
                onInvalid: ($) => f.valueErrors.sample = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          c.value[k] ? (l(), n("small", gi, b(f.name) + ": " + b(c.value[k]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, oi)) : (l(), n("p", ni, b(a.draft.title) + " takes no " + b(a.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        i(e(D), {
          label: R.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: y
        }, {
          icon: A(() => [
            i(e(z), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, ti));
  }
}), ki = { class: "kx-modal-head-icon" }, $i = {
  key: 0,
  class: "kx-modal-head-text"
}, wi = { class: "kx-modal-head-title" }, _i = {
  key: 0,
  class: "kx-modal-head-sub"
}, xi = {
  key: 1,
  class: "kx-modal-head-sub"
}, Ci = {
  key: 0,
  class: "mail-form"
}, Vi = { class: "mail-face-bar" }, Si = {
  key: 0,
  class: "mail-version-subject"
}, Ti = { class: "mail-mono-block" }, Ui = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Ri = /* @__PURE__ */ le({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean },
    included: { type: Boolean }
  },
  emits: ["close", "restore", "reset"],
  setup(a, { emit: d }) {
    const o = ua(() => import("./CodeEditor-CIrhfC0V.js")), u = ua(() => import("./DiffView-CjA70e3n.js")), v = a, r = d;
    xe(() => !!v.revision);
    const _ = w("version"), m = w("html");
    Q(() => v.revision, (h) => {
      h && (_.value = v.compare ? "compare" : "version", m.value = "html");
    });
    const S = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], T = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], c = P(() => v.revision?.revision === v.current.revision), y = P(() => {
      const h = v.revision;
      return h ? v.included || h.state === "original" && h.action === "reset" ? `${v.current.title}: the version included with ${v.current.origin_label}` : `${v.current.title}, version ${h.version}` : "";
    }), R = P(() => v.revision ? m.value === "html" ? v.revision.content.html : v.revision.content.text : ""), g = P(() => m.value === "html" ? v.current.html : v.current.text), p = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (h, f) => (l(), O(e(je), {
      visible: !!a.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: p,
      "aria-label": y.value,
      closable: !1,
      "close-on-escape": !a.busy,
      "onUpdate:visible": f[5] || (f[5] = (k) => {
        k || r("close");
      })
    }, {
      header: A(() => [
        t("span", ki, [
          i(e(z), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        a.revision ? (l(), n("span", $i, [
          t("span", wi, b(y.value), 1),
          a.included ? (l(), n("span", _i, "Compare it with your customized version, or reset to it.")) : (l(), n("span", xi, b(e(ba)[a.revision.action]) + " by " + b(e(we)(a.revision.author_label, a.revision.author)) + " · " + b(e(He)(a.revision.created_at)), 1))
        ])) : V("", !0)
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: f[2] || (f[2] = (k) => r("close"))
        }, null, 8, ["disabled"]),
        a.revision && a.included ? (l(), O(e(D), {
          key: 0,
          label: "Reset to original",
          loading: a.busy,
          onClick: f[3] || (f[3] = (k) => r("reset"))
        }, {
          icon: A(() => [
            i(e(z), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : a.revision && !c.value ? (l(), O(e(D), {
          key: 1,
          label: "Restore this version",
          loading: a.busy,
          onClick: f[4] || (f[4] = (k) => r("restore", a.revision))
        }, {
          icon: A(() => [
            i(e(z), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : V("", !0)
      ]),
      default: A(() => [
        a.revision ? (l(), n("div", Ci, [
          t("div", Vi, [
            c.value ? V("", !0) : (l(), O(e(_e), {
              key: 0,
              modelValue: _.value,
              "onUpdate:modelValue": f[0] || (f[0] = (k) => _.value = k),
              options: S,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            i(e(_e), {
              modelValue: m.value,
              "onUpdate:modelValue": f[1] || (f[1] = (k) => m.value = k),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          a.revision.content.subject !== void 0 && _.value === "version" ? (l(), n("p", Si, [
            f[6] || (f[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            f[7] || (f[7] = K()),
            t("span", Ti, b(a.revision.content.subject), 1)
          ])) : V("", !0),
          _.value === "version" ? (l(), n("div", Ui, [
            (l(), O(e(o), {
              key: m.value,
              "model-value": R.value,
              label: y.value + (m.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), O(e(u), {
            key: "diff-" + m.value,
            before: R.value,
            after: g.value,
            "before-label": a.included || a.revision.state === "original" && a.revision.action === "reset" ? "Included version" : "Version " + a.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), ji = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ai = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Li = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Ii = {
  key: 3,
  class: "mail-history"
}, Ni = { class: "mail-history-head" }, zi = { class: "mail-history-main" }, Ei = { class: "mail-history-title" }, Oi = { class: "mail-sub" }, Pi = {
  key: 0,
  class: "mail-history-note"
}, Mi = { class: "mail-history-actions" }, Di = /* @__PURE__ */ le({
  __name: "HistoryList",
  props: {
    resource: {},
    revisions: {},
    loading: { type: Boolean },
    error: {},
    busy: {}
  },
  emits: ["show", "restore", "retry"],
  setup(a) {
    return (d, o) => a.error ? (l(), n("div", ji, [
      t("span", null, b(a.error), 1),
      i(e(D), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o[0] || (o[0] = (u) => d.$emit("retry"))
      })
    ])) : a.loading && !a.revisions.length ? (l(), n("p", Ai, [
      i(e(z), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = K("Loading history…", -1))
    ])) : a.revisions.length ? (l(), n("ol", Ii, [
      (l(!0), n(F, null, ce(a.revisions, (u) => (l(), n("li", {
        key: u.revision,
        class: "mail-history-row"
      }, [
        t("div", Ni, [
          t("div", zi, [
            t("span", Ei, [
              K(" Version " + b(u.version) + " · " + b(e(ba)[u.action]) + b(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.revision === a.resource.revision ? (l(), O(e(Ne), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Oi, b(e(we)(u.author_label, u.author)) + " · " + b(e(He)(u.created_at)), 1),
            u.note ? (l(), n("span", Pi, b(u.note), 1)) : V("", !0)
          ]),
          t("div", Mi, [
            i(e(D), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (v) => d.$emit("show", u)
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            u.revision !== a.resource.revision ? (l(), O(e(D), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: a.busy === u.revision,
              disabled: a.busy !== void 0,
              onClick: (v) => d.$emit("restore", u)
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
          ])
        ])
      ]))), 128))
    ])) : (l(), n("p", Li, b(a.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Bi = { class: "kx-modal-head-icon mail-head-warn" }, qi = { class: "kx-modal-head-text" }, Hi = { class: "kx-modal-head-title" }, Fi = { class: "mail-dialog-text" }, Ji = {
  key: 0,
  class: "mail-list"
}, Za = /* @__PURE__ */ le({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a;
    xe(() => !!o.refusal);
    const u = d, v = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(_) {
      u("close"), _();
    }
    return (_, m) => (l(), O(e(je), {
      visible: !!a.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: v,
      role: "alertdialog",
      "aria-label": a.refusal?.header,
      "onUpdate:visible": m[1] || (m[1] = (S) => {
        S || u("close");
      })
    }, {
      header: A(() => [
        t("span", Bi, [
          i(e(z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", qi, [
          t("span", Hi, b(a.refusal?.header), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Close",
          autofocus: "",
          onClick: m[0] || (m[0] = (S) => u("close"))
        })
      ]),
      default: A(() => [
        t("p", Fi, b(a.refusal?.message), 1),
        a.refusal?.links.length ? (l(), n("ul", Ji, [
          (l(!0), n(F, null, ce(a.refusal.links, (S) => (l(), n("li", {
            key: S.label
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (T) => r(S.open)
            }, {
              default: A(() => [
                i(e(z), {
                  icon: S.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, b(S.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Wi = { class: "mail-stack" }, Ki = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Yi = {
  key: 0,
  class: "mail-muted"
}, Gi = {
  key: 1,
  class: "mail-list"
}, Zi = { key: 1 }, Qi = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, Xi = { class: "mail-group-head" }, en = {
  key: 0,
  class: "mail-muted"
}, an = {
  key: 1,
  class: "mail-list"
}, ln = { class: "mail-list-main" }, tn = {
  key: 0,
  class: "mail-sub"
}, sn = { class: "mail-muted" }, nn = /* @__PURE__ */ le({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, capabilities: v } = fe(), r = P(() => (d.resource.used_by?.messages ?? []).map((m) => ({
      name: m,
      title: o.title("message", m)
    }))), _ = P(() => d.resource.used_by?.recent_senders ?? []);
    return (m, S) => (l(), n("div", Wi, [
      a.resource.kind === "base" || a.resource.kind === "asset" ? (l(), n("section", Ki, [
        S[1] || (S[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", Gi, [
          (l(!0), n(F, null, ce(r.value, (T) => (l(), n("li", {
            key: T.name
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (c) => e(u)({ name: "resource", kind: "message", resource: T.name, section: "content" })
            }, {
              default: A(() => [
                i(e(z), {
                  icon: e(be).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                T.title === void 0 ? (l(), O(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", Zi, b(T.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Yi, "No messages " + b(a.resource.kind === "asset" ? "show" : "use") + " " + b(a.resource.title) + ".", 1))
      ])) : a.resource.kind === "message" ? (l(), n("section", Qi, [
        t("div", Xi, [
          S[2] || (S[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          e(v)?.administer_delivery ? (l(), O(e(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: S[0] || (S[0] = (T) => e(u)({ name: "activity", template: a.resource.name }))
          })) : V("", !0)
        ]),
        _.value.length ? (l(), n("ul", an, [
          (l(!0), n(F, null, ce(_.value, (T) => (l(), n("li", {
            key: T.sender + (T.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            i(e(z), {
              icon: T.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", ln, [
              t("span", null, b(e(we)(T.sender_label, T.sender)), 1),
              T.origin ? (l(), n("span", tn, b(e(ta)(T.origin)), 1)) : V("", !0)
            ]),
            t("span", sn, b(e(ye)(T.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", en, "Nobody has sent " + b(a.resource.title) + " recently.", 1))
      ])) : V("", !0)
    ]));
  }
}), on = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, rn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, un = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, dn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, cn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, vn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, mn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, fn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, bn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, yn = {
  key: 6,
  class: "kx-notice mail-customized"
}, pn = { class: "mail-customized-text" }, gn = { class: "mail-editor-layout" }, hn = /* @__PURE__ */ le({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(a) {
    const d = a, { library: o, capabilities: u, delivery: v, go: r, create: _, setDirty: m, setTitle: S } = fe(), T = P(() => ({ kind: d.kind, name: d.name })), c = pe(), y = w(), R = w(!0), g = w(!1), p = w(!1), h = w(""), f = w(), k = Ve(), $ = P(() => !!y.value && !!c.value && !Kt(y.value, c.value));
    Q($, (B) => m(B), { immediate: !0 }), aa(() => m(!1));
    async function L(B = {}) {
      const M = k();
      try {
        const G = await te.get(T.value);
        if (!M()) return;
        const ie = B.keepDraft && $.value;
        if (ie && c.value && G.revision !== c.value.revision) {
          f.value = { revision: G.revision, by: we(G.author_label, G.author) || "Someone" };
          return;
        }
        c.value = G, ie || (y.value = ke(G), I.value = void 0), S(G.title), f.value = void 0, g.value = p.value = !1, h.value = "";
      } catch (G) {
        if (!M()) return;
        g.value = Xe(G), p.value = qe(G), h.value = g.value || p.value ? "" : ne(G, "This resource could not be loaded."), g.value && (c.value = void 0, y.value = void 0);
      } finally {
        M() && (R.value = !1);
      }
    }
    const I = w(), N = pe([]), E = w(!1), X = w(""), ae = Ve();
    async function se() {
      const B = ae();
      E.value = !0;
      try {
        const M = await te.history(T.value);
        if (!B()) return;
        N.value = M, X.value = "";
      } catch (M) {
        if (!B()) return;
        X.value = Xe(M) ? "" : ne(M, "History could not be loaded.");
      } finally {
        B() && (E.value = !1);
      }
    }
    async function q() {
      await Promise.all([L({ keepDraft: !0 }), se()]);
    }
    la(q), Ue("mail.library", () => {
      q();
    });
    const j = w(), C = w(""), x = w(!1), s = w(""), U = w(), Z = P(() => c.value?.title ?? d.name), H = P(() => {
      const B = c.value, M = Z.value, G = B?.used_by?.messages?.length ?? 0, ie = B?.used_by?.recent_senders?.find((na) => na.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ie?.origin ? ` Sent recently by “${ta(ie.origin)}”.` : "") },
          base: { title: "Layout", description: G ? `The frame around the ${ye(G, "message")} that ${G === 1 ? "uses" : "use"} ${M}.` : `The frame around messages that use ${M}.` },
          part: { title: "Content", description: `Shown wherever ${M} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${M} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${M}.` : d.kind === "base" ? `Messages that use ${M}.` : `Templates that include ${M}.`
        },
        history: { title: "History", description: `Every saved version of ${M}, newest first.` }
      }[d.section];
    }), J = P(() => {
      const B = c.value;
      return B?.state !== "customized" ? "" : `Customized by ${we(B.author_label, B.author)} ${kl(B.updated_at)} from the version included with ${B.origin_label}.`;
    }), ee = P(() => {
      const B = c.value;
      if (!B?.original) return;
      const { kind: M, name: G, title: ie, description: oe } = B;
      return {
        kind: M,
        name: G,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: M, name: G, title: ie, description: oe, ...B.original }
      };
    }), W = w(), Y = w(), ge = w(!1), Fe = P(() => Y.value ?? W.value);
    Q(() => JSON.stringify(y.value), () => {
      Y.value = void 0;
    });
    const _a = P(() => d.kind === "message" && /[\r\n]/.test(y.value?.subject ?? "")), el = P(() => !!Fe.value || ge.value || !!f.value || _a.value), xa = P(() => f.value ? "Discard your changes to load the newer version first." : ge.value ? "Fix the variables first." : _a.value ? "Put the subject on one line first." : Fe.value ? "Fix the error first." : ""), Ca = w(!1);
    function sa(B, M) {
      Ca.value = ["invalid_config", "from_name_invalid"].includes($e(B) ?? ""), x.value = ["mail_revision_conflict", "mail_preview_stale"].includes($e(B) ?? ""), x.value && q(), C.value = ne(B, M);
    }
    function Va() {
      if (!c.value) return;
      const B = !!f.value;
      y.value = ke(c.value), f.value = void 0, Y.value = void 0, I.value = void 0, B && L();
    }
    const Ae = w(!1), Je = w(""), We = w();
    function al() {
      Je.value = "", We.value = void 0, Ae.value = !0;
    }
    async function ll(B) {
      const M = c.value, G = y.value;
      if (!(!M || !G || j.value !== void 0)) {
        j.value = "save", Je.value = C.value = s.value = "", We.value = void 0;
        try {
          const ie = I.value, oe = ie && JSON.stringify(G) === JSON.stringify({ ...ke(ie.content), kind: M.kind, name: M.name }), he = oe ? await te.restore(T.value, ie.revision, M.revision, B || void 0) : await te.update(G, M.revision, B || void 0);
          c.value = { ...M, ...he }, y.value = ke(c.value), Ae.value = !1, s.value = oe ? `Version ${ie.version} from ${He(ie.created_at)} is now in effect.` : `Saved ${he.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, I.value = void 0, await q();
        } catch (ie) {
          const oe = De(ie), he = oe?.resource?.kind === G.kind && oe.resource.name === G.name;
          oe?.dependents?.length && !he ? We.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (Y.value = oe, Ae.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes($e(ie) ?? "") ? (Ae.value = !1, await L({ keepDraft: !0 })) : Je.value = ne(ie, `${G.title} could not be saved.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    async function tl() {
      const B = c.value;
      if (!(!B || j.value !== void 0)) {
        j.value = "test", C.value = s.value = "";
        try {
          await te.sendTest(B.name), s.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (M) {
          sa(M, "The test could not be sent.");
        } finally {
          j.value = void 0;
        }
      }
    }
    const Ke = P(() => $.value ? "Save your changes to send a test." : u.value?.send ? v.value && !v.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Sa() {
      const B = c.value;
      if (!(!B || j.value !== void 0 || !await Ce.confirm({
        header: `Reset ${B.title} to the original?`,
        message: `Your changes are replaced by the version included with ${B.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        j.value = "reset", C.value = s.value = "", x.value = !1;
        try {
          c.value = await te.reset(T.value, B.revision), y.value = ke(c.value), s.value = `${B.title} is back to the original. Your changes are in History.`, await q();
        } catch (G) {
          sa(G, `${B.title} could not be reset.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    const Ee = w(), Ta = w(!1), Ua = w(!1);
    function Ra(B, M = !1, G = !1) {
      Ta.value = M, Ua.value = G, Ee.value = B;
    }
    async function ja(B) {
      const M = c.value;
      if (!M || j.value !== void 0 || $.value && !await Ce.confirm({
        header: `Replace your unsaved changes with version ${B.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      y.value = { ...ke(B.content), kind: M.kind, name: M.name }, I.value = B, Ee.value = void 0, C.value = "";
      const G = `Version ${B.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? s.value = G : (ia = G, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function Aa(B, M, G) {
      const ie = M.map((he) => o.title("message", he) ?? he), oe = B.kind === "base" ? "use" : "include";
      U.value = {
        header: `${B.title} is in use`,
        message: `${ye(M.length, "message")} ${M.length === 1 ? oe + "s" : oe} it: ${ie.join(", ")}. Remove it from ${M.length === 1 ? "that message" : "them"} first.`,
        links: M.map((he, na) => ({ label: ie[na], open: () => r({ name: "resource", kind: "message", resource: he, section: "content" }) }))
      };
    }
    async function sl() {
      const B = c.value;
      if (!B || B.state !== "created" || j.value !== void 0) return;
      const M = B.used_by?.messages ?? [];
      if (B.kind === "base" && M.length) {
        Aa(B, M);
        return;
      }
      if (await Ce.confirm({
        header: `Delete ${B.title}?`,
        message: B.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${me[B.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        j.value = "delete", C.value = s.value = "";
        try {
          await te.remove(T.value, B.revision), m(!1), r({ name: "library", section: ca(d.kind) });
        } catch (ie) {
          const oe = De(ie);
          oe?.dependents?.length ? Aa(B, oe.dependents) : sa(ie, `${B.title} could not be deleted.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    function il() {
      const B = c.value;
      B && _({ kind: d.kind, from: { kind: B.kind, name: B.name } });
    }
    const nl = P(() => d.kind === "base" ? c.value?.used_by?.messages : void 0), Ye = P(() => j.value === "save");
    L(), Q(() => d.section, (B) => {
      B === "history" && !N.value.length && se();
    }, { immediate: !0 });
    let ia = "";
    return Q(() => d.section, () => {
      s.value = ia, ia = "", C.value = "";
    }), (B, M) => (l(), n(F, null, [
      g.value ? (l(), O(ha, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + e(fa)[a.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: M[0] || (M[0] = (G) => e(r)({ name: "library", section: e(ca)(a.kind) }))
      }, null, 8, ["cta"])) : p.value ? (l(), n("p", on, [
        i(e(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[11] || (M[11] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(F, { key: 2 }, [
        i(Be, {
          title: H.value.title,
          description: H.value.description
        }, ma({ _: 2 }, [
          c.value ? {
            name: "actions",
            fn: A(() => [
              $.value ? (l(), O($l, {
                key: 0,
                busy: Ye.value,
                "review-disabled": el.value,
                onDiscard: Va,
                onReview: al
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(F, { key: 1 }, [
                a.kind === "message" ? (l(), O(e(D), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: j.value === "test",
                  disabled: !!Ke.value || j.value !== void 0,
                  title: Ke.value || void 0,
                  onClick: tl
                }, {
                  icon: A(() => [
                    i(e(z), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : V("", !0),
                i(e(D), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: j.value !== void 0,
                  onClick: il
                }, {
                  icon: A(() => [
                    i(e(z), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                c.value.state === "created" ? (l(), O(e(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: j.value === "delete",
                  disabled: j.value !== void 0,
                  onClick: sl
                }, {
                  icon: A(() => [
                    i(e(z), {
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
        h.value ? (l(), n("div", rn, [
          t("span", null, b(h.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[1] || (M[1] = (G) => q())
          })
        ])) : R.value ? (l(), n("p", un, [
          i(e(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          K("Loading " + b(Z.value) + "…", 1)
        ])) : V("", !0),
        c.value && y.value ? (l(), n(F, { key: 2 }, [
          f.value ? (l(), n("p", dn, [
            i(e(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              K(b(f.value.by) + " saved " + b(c.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              i(e(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Va
              })
            ])
          ])) : V("", !0),
          $.value && xa.value && !f.value ? (l(), n("p", cn, b(xa.value), 1)) : a.kind === "message" && !$.value && Ke.value ? (l(), n("p", vn, [
            K(b(Ke.value) + " ", 1),
            e(u)?.administer_delivery && e(v) && !e(v).configured ? (l(), O(e(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: M[2] || (M[2] = (G) => e(Ce).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          C.value && x.value ? (l(), n("p", mn, [
            i(e(z), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            K(b(C.value), 1)
          ])) : C.value ? (l(), n("p", fn, [
            t("span", null, b(C.value), 1),
            Ca.value && e(u)?.administer_delivery ? (l(), O(e(D), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[3] || (M[3] = (G) => e(Ce).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          s.value ? (l(), n("p", bn, [
            i(e(z), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            K(b(s.value), 1)
          ])) : V("", !0),
          J.value && a.section === "content" ? (l(), n("div", yn, [
            i(e(z), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", pn, [
              K(b(J.value), 1),
              $.value ? (l(), n(F, { key: 0 }, [
                K(" Save or discard your changes to reset it.")
              ], 64)) : V("", !0)
            ]),
            ee.value ? (l(), O(e(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[4] || (M[4] = (G) => Ra(ee.value, !0, !0))
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : V("", !0),
            i(e(D), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: j.value === "reset",
              disabled: j.value !== void 0 || $.value,
              onClick: Sa
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : V("", !0),
          ml(t("div", gn, [
            i(ei, {
              draft: y.value,
              problem: Fe.value,
              disabled: Ye.value
            }, null, 8, ["draft", "problem", "disabled"]),
            i(ps, {
              draft: y.value,
              messages: nl.value,
              onProblem: M[5] || (M[5] = (G) => W.value = G)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [fl, a.section === "content"]
          ]),
          a.section === "variables" ? (l(), O(hi, {
            key: 7,
            draft: y.value,
            label: H.value.title,
            problem: Fe.value,
            disabled: Ye.value,
            onInvalid: M[6] || (M[6] = (G) => ge.value = G)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : a.section === "used-by" ? (l(), O(nn, {
            key: 8,
            resource: c.value
          }, null, 8, ["resource"])) : a.section === "history" ? (l(), O(Di, {
            key: 9,
            resource: c.value,
            revisions: N.value,
            loading: E.value,
            error: X.value,
            busy: typeof j.value == "number" ? j.value : j.value ? -1 : void 0,
            onShow: Ra,
            onRestore: ja,
            onRetry: se
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      c.value && y.value ? (l(), O(Us, {
        key: 3,
        visible: Ae.value,
        saved: e(ke)(c.value),
        draft: y.value,
        busy: Ye.value,
        error: Je.value,
        dependents: We.value,
        "suggested-note": I.value ? `Restore version ${I.value.version}` : void 0,
        onClose: M[7] || (M[7] = (G) => Ae.value = !1),
        onSave: ll
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : V("", !0),
      c.value ? (l(), O(Ri, {
        key: 4,
        revision: Ee.value,
        current: c.value,
        compare: Ta.value,
        included: Ua.value,
        busy: typeof j.value == "number" || j.value === "reset",
        onClose: M[8] || (M[8] = (G) => Ee.value = void 0),
        onRestore: ja,
        onReset: M[9] || (M[9] = (G) => {
          Ee.value = void 0, Sa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : V("", !0),
      i(Za, {
        refusal: U.value,
        onClose: M[10] || (M[10] = (G) => U.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ge = /* @__PURE__ */ new Map();
function kn(a, d) {
  const o = Ge.get(a);
  if (o && o.revision >= d) return o.url;
  const u = Promise.resolve(Ul.get(`/api/v1/mail/library/asset/${encodeURIComponent(a)}/content`, { responseType: "blob" })).then((v) => v.data instanceof Blob ? URL.createObjectURL(v.data) : void 0, () => {
    Ge.get(a)?.url === u && Ge.delete(a);
  });
  return Ge.set(a, { revision: d, url: u }), o && o.url.then((v) => {
    v && URL.revokeObjectURL(v);
  }), u;
}
const $n = ["src", "alt"], wn = {
  key: 0,
  "aria-hidden": "true"
}, Qa = /* @__PURE__ */ le({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(a) {
    const d = a, o = w();
    Q(() => [d.name, d.revision], async ([v, r]) => {
      o.value = void 0, o.value = await kn(v, r);
    }, { immediate: !0 });
    const u = P(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (v, r) => (l(), n("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": a.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: a.alt ?? ""
      }, null, 8, $n)) : (l(), n(F, { key: 1 }, [
        i(e(z), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        u.value ? (l(), n("span", wn, b(u.value), 1)) : V("", !0)
      ], 64))
    ], 2));
  }
});
function Pe(a) {
  return !!a && typeof a == "object" && !Array.isArray(a);
}
function _n(a, d) {
  return a;
}
function xn(a, d, o) {
  if (d !== void 0 && !d) return null;
  const u = Pe(a) ? a : {}, v = [
    u,
    Pe(u.data) ? u.data : null,
    Pe(u.payload) ? u.payload : null,
    Pe(u.detail) ? u.detail : null
  ].filter(Boolean);
  for (const r of v) {
    if (r.event !== "component.meta.changed" && r.event !== "component.deleting" && r.event !== "component.deleted") continue;
    const _ = String(r.component_id || ""), m = String(u.topic || r.topic || "");
    if (d === void 0) {
      if (!_ && (!m.startsWith("component.") || m === "component.")) continue;
    } else if (_ && _ !== d || !_ && m !== `component.${d}`) continue;
    const S = _ || d || m.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: S, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: S } : {
      event: "component.meta.changed",
      component_id: S,
      meta: _n(Pe(r.meta) ? r.meta : {}),
      deleted: Array.isArray(r.deleted) ? r.deleted.map(String) : []
    };
  }
  return null;
}
function Cn(a, d, o) {
  const u = xn(a, d);
  return u?.event === "component.meta.changed" ? u : null;
}
function Vn(a, d, o) {
  if (!a) return null;
  const u = Rl(`component.${a}`, (v) => {
    const r = Cn(v, a);
    r && d(r);
  });
  return typeof u == "function" ? u : null;
}
class Ze extends Error {
}
function Sn(a, d) {
  return new Promise((o, u) => {
    let v = null, r = !1, _ = !1, m = !1;
    const S = (c) => {
      m || (m = !0, v?.(), c ? u(c) : o());
    };
    async function T() {
      if (!m) {
        if (d.cancelled) {
          S(new Ze("cancelled"));
          return;
        }
        if (r) {
          _ = !0;
          return;
        }
        r = !0;
        try {
          const c = await Pa.state(a);
          c.status === "completed" ? S() : c.status === "error" ? S(new Ze(c.error ?? "")) : v || (v = Vn(c.component_id, () => {
            T();
          }), v ? _ = !0 : S(new Ze("")));
        } catch (c) {
          S(c);
        } finally {
          r = !1, _ && !m && (_ = !1, T());
        }
      }
    }
    T();
  });
}
const Tn = { class: "kx-modal-head-icon" }, Un = { class: "kx-modal-head-text" }, Rn = { class: "kx-modal-head-title" }, jn = { class: "kx-modal-head-sub" }, An = ["disabled", "inert"], Ln = ["for"], In = { class: "mail-muted" }, Nn = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, zn = {
  key: 0,
  class: "mail-field"
}, En = ["for"], On = ["for"], Pn = ["id"], Mn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Dn = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Bn = 1024 * 1024, Xa = /* @__PURE__ */ le({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe(), _ = { file: ve(), title: ve(), name: ve() };
    xe(() => o.visible);
    const m = ["image/png", "image/jpeg", "image/gif"], S = w(), T = w(), c = w(""), y = w(""), R = w(!1), g = w(!1), p = w();
    let h = { cancelled: !1 };
    const f = w(""), k = w(""), $ = w("");
    Q(() => o.visible, (q) => {
      if (!q) {
        h.cancelled = !0;
        return;
      }
      h = { cancelled: !1 }, o.replace || v.ensure("asset"), S.value = T.value = void 0, c.value = o.replace?.title ?? "", y.value = o.replace?.name ?? "", R.value = !1, f.value = k.value = $.value = "";
    }), Q(c, (q) => {
      !o.replace && !R.value && (y.value = Ma(q));
    });
    function L(q) {
      return new Promise((j) => {
        const C = URL.createObjectURL(q), x = new Image();
        x.onload = () => {
          j({ width: x.naturalWidth, height: x.naturalHeight }), URL.revokeObjectURL(C);
        }, x.onerror = () => {
          j(void 0), URL.revokeObjectURL(C);
        }, x.src = C;
      });
    }
    async function I(q) {
      const j = Array.isArray(q.files) ? q.files[0] : q.files;
      if (k.value = "", S.value = void 0, !!j) {
        if (!m.includes(j.type)) {
          k.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (j.size > Bn) {
          k.value = "Images must be 1 MB or smaller.";
          return;
        }
        S.value = j, T.value = await L(j), !o.replace && !c.value && (c.value = j.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function N() {
      return $.value = "", o.replace ? !0 : (Da.test(y.value) ? v.find("asset", y.value) && ($.value = `An image named ${y.value} already exists. Choose another name or replace ${y.value}.`) : $.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !$.value);
    }
    async function E() {
      if (g.value || !S.value || !c.value.trim() || !N()) return;
      g.value = !0, f.value = "";
      const q = h;
      try {
        p.value = "upload";
        const j = await Pa.add(S.value), C = { name: y.value, upload_id: j, title: c.value.trim(), ...T.value }, x = () => o.replace ? te.replaceAsset(C, o.replace.revision) : te.addAsset(C);
        p.value = "save";
        let s;
        try {
          s = await x();
        } catch (U) {
          if ($e(U) !== "upload_still_processing") throw U;
          p.value = "process", await Sn(j, q), p.value = "save", s = await x();
        }
        v.patch("asset", s.name, Ja(s)), u("done", s), u("close"), o.replace || r({ name: "library", section: "assets", asset: s.name });
      } catch (j) {
        if (q.cancelled) return;
        j instanceof Ze ? f.value = "The image could not be processed. Try another file, or upload it again." : $e(j) === "mail_revision_conflict" && !o.replace ? $.value = `An image named ${y.value} already exists. Choose another name or replace ${y.value}.` : f.value = ne(j, "The image could not be uploaded.");
      } finally {
        g.value = !1, p.value = void 0;
      }
    }
    const X = P(() => p.value === "upload" ? "Uploading the image…" : p.value === "process" ? "Processing the image…" : p.value === "save" ? "Adding it to the library…" : ""), ae = P(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), se = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (q, j) => (l(), O(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !g.value || p.value === "process",
      "close-on-escape": !g.value || p.value === "process",
      class: "mail-dialog",
      pt: se,
      "aria-label": ae.value,
      "onUpdate:visible": j[4] || (j[4] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", Tn, [
          i(e(z), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", Un, [
          t("span", Rn, b(ae.value), 1),
          t("span", jn, b(a.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: g.value && p.value !== "process",
          onClick: j[3] || (j[3] = (C) => u("close"))
        }, null, 8, ["disabled"]),
        i(e(D), {
          label: a.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: g.value,
          disabled: !S.value || !a.replace && !c.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Te(E, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: g.value,
            inert: g.value || void 0
          }, [
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: _.file
              }, "Image", 8, Ln),
              i(e(Ml), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": S.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: _.file, "aria-label": "Image file" } },
                onSelect: I
              }, {
                chooseicon: A(() => [
                  i(e(z), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: A(() => [
                  t("span", In, b(S.value ? `${S.value.name} · ${e(Me)(S.value.size)}${T.value ? ` · ${T.value.width} × ${T.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              k.value ? (l(), n("small", Nn, b(k.value), 1)) : V("", !0)
            ], 2),
            a.replace ? V("", !0) : (l(), n("div", zn, [
              t("label", {
                class: "mail-field-label",
                for: _.title
              }, "Name", 8, En),
              i(e(de), {
                id: _.title,
                modelValue: c.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => c.value = C)
              }, null, 8, ["id", "modelValue"])
            ])),
            a.replace ? V("", !0) : (l(), n("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": $.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: _.name
              }, "Reference", 8, On),
              i(e(de), {
                id: _.name,
                modelValue: y.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => y.value = C),
                class: "mail-mono-input",
                invalid: !!$.value,
                "aria-describedby": _.name + "-hint",
                onInput: j[2] || (j[2] = (C) => R.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: _.name + "-hint",
                class: re($.value ? "mail-field-error" : "mail-field-hint")
              }, b($.value || "Templates show it with this name. It cannot change later."), 11, Pn)
            ], 2))
          ], 8, An),
          X.value ? (l(), n("p", Mn, [
            i(e(z), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            K(b(X.value), 1)
          ])) : V("", !0),
          f.value ? (l(), n("p", Dn, b(f.value), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), qn = { class: "mail-drawer-head" }, Hn = { class: "mail-drawer-title" }, Fn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Jn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Wn = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Kn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Yn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, Gn = { class: "mail-asset-actions" }, Zn = { class: "mail-asset-hero" }, Qn = { class: "mail-facts mail-card" }, Xn = { class: "mail-reference" }, eo = { class: "mail-mono-block" }, ao = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, lo = {
  key: 0,
  class: "mail-muted"
}, to = { class: "mail-list" }, so = { key: 1 }, io = {
  key: 0,
  class: "mail-asset-context"
}, no = ["srcdoc", "title"], oo = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, ro = {
  key: 0,
  class: "mail-muted"
}, uo = {
  key: 1,
  class: "mail-history"
}, co = { class: "mail-history-head" }, vo = { class: "mail-history-main" }, mo = { class: "mail-history-title" }, fo = { class: "mail-sub" }, bo = /* @__PURE__ */ le({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe();
    xe(() => !!o.name);
    const _ = w();
    Q(() => !!o.name, (x) => {
      x && (v.ensure("message"), Qe(() => _.value?.focus()));
    }, { immediate: !0 });
    const m = pe(), S = pe([]), T = pe(), c = w(""), y = w(!1), R = w(!1), g = w(""), p = w(""), h = w(""), f = w(), k = w(!1), $ = w(!1), L = w(!1), I = w(), N = Ve();
    async function E() {
      const x = o.name, s = N();
      if (!x) {
        m.value = void 0;
        return;
      }
      y.value = !0;
      try {
        const [U, Z] = await Promise.all([te.get({ kind: "asset", name: x }), te.history({ kind: "asset", name: x })]);
        if (!s()) return;
        m.value = U, S.value = Z, R.value = !1, g.value = "";
        const H = U.used_by?.messages?.[0];
        c.value = H ?? "";
        const J = H ? await te.preview(H, []) : void 0;
        s() && (T.value = J);
      } catch (U) {
        if (!s()) return;
        R.value = Xe(U), g.value = R.value ? "" : ne(U, "This image could not be loaded.");
      } finally {
        s() && (y.value = !1);
      }
    }
    Q(() => o.name, () => {
      k.value = $.value = !1, h.value = p.value = "", E();
    }, { immediate: !0 }), Ue("mail.library", () => {
      o.name && E();
    });
    const X = P(() => (m.value?.used_by?.messages ?? []).map((x) => ({ name: x, title: v.title("message", x) })));
    async function ae() {
      const x = m.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(x.name)}`), $.value = !0;
        } catch {
          $.value = !1;
        }
    }
    const se = P(() => m.value ? Ya(m.value.name) : "");
    async function q() {
      try {
        await navigator.clipboard.writeText(se.value), k.value = !0;
      } catch {
        k.value = !1;
      }
    }
    async function j(x, s) {
      const U = m.value;
      if (!U || f.value !== void 0) return;
      if (x === "delete" && X.value.length) {
        I.value = {
          header: `${U.title} is in use`,
          message: `${ye(X.value.length, "message")} ${X.value.length === 1 ? "shows" : "show"} it: ${X.value.map((H) => H.title ?? H.name).join(", ")}. Remove it from ${X.value.length === 1 ? "that message" : "them"} first.`,
          links: X.value.map((H) => ({ label: H.title ?? H.name, open: () => r({ name: "resource", kind: "message", resource: H.name, section: "content" }) }))
        };
        return;
      }
      const Z = {
        reset: { header: `Reset ${U.title} to the original?`, message: `The image included with ${U.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${U.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${s?.version} of ${U.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[x];
      if (await Ce.confirm({ header: Z.header, message: Z.message, acceptLabel: Z.accept, rejectLabel: "Cancel", ...x === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        f.value = s ? s.revision : x, p.value = h.value = "";
        try {
          if (x === "delete") {
            await te.remove({ kind: "asset", name: U.name }, U.revision), u("close");
            return;
          }
          m.value = x === "reset" ? await te.reset({ kind: "asset", name: U.name }, U.revision) : await te.restore({ kind: "asset", name: U.name }, s.revision, U.revision), h.value = x === "reset" ? `${U.title} is back to the original.` : `Version ${s.version} is shown again everywhere.`, await E();
        } catch (H) {
          const J = De(H);
          if (J?.dependents?.length || J?.references?.length) {
            const ee = [...(J.references ?? []).filter((W) => W.kind !== "asset")];
            for (const W of J.dependents ?? []) ee.some((Y) => Y.kind === "message" && Y.name === W) || ee.push({ kind: "message", name: W });
            await Promise.all([...new Set(ee.map((W) => W.kind))].map((W) => v.ready(W) ? void 0 : v.load(W))), I.value = {
              header: `${U.title} is in use`,
              message: `${ye(ee.length, "template")} ${ee.length === 1 ? "names" : "name"} ${U.title}, in the current version or one kept in History. Remove it from ${ee.length === 1 ? "that template" : "them"} first.`,
              links: ee.map((W) => ({
                label: v.title(W.kind, W.name) ?? W.name,
                icon: be[W.kind],
                open: () => r(W.kind === "asset" ? { name: "library", section: "assets", asset: W.name } : { name: "resource", kind: W.kind, resource: W.name, section: "content" })
              }))
            };
          } else
            p.value = $e(H) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ne(H, "The image could not be changed."), $e(H) === "mail_revision_conflict" && E();
        } finally {
          f.value = void 0;
        }
      }
    }
    const C = P(() => T.value?.html ? $a(T.value.html, T.value.inline_assets) : "");
    return (x, s) => (l(), n(F, null, [
      i(e(Ha), {
        visible: !!a.name,
        position: "right",
        modal: !0,
        dismissable: f.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": s[5] || (s[5] = (U) => {
          U || u("close");
        })
      }, {
        default: A(() => [
          t("div", {
            ref_key: "drawer",
            ref: _,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", qn, [
              t("div", Hn, [
                m.value?.state === "customized" ? (l(), O(e(Ne), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, b(m.value?.title ?? "Image"), 1)
              ]),
              i(e(D), {
                text: "",
                severity: "secondary",
                disabled: !m.value,
                "aria-label": $.value ? "Link copied" : "Copy link",
                title: $.value ? "Link copied" : "Copy link",
                onClick: ae
              }, {
                icon: A(() => [
                  i(e(z), {
                    icon: $.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              i(e(D), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: f.value !== void 0,
                onClick: s[0] || (s[0] = (U) => u("close"))
              }, {
                icon: A(() => [
                  i(e(z), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            y.value && !m.value ? (l(), n("p", Fn, [
              i(e(z), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              s[9] || (s[9] = K("Loading image…", -1))
            ])) : R.value ? (l(), n("p", Jn, [
              i(e(z), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              s[10] || (s[10] = K("This image no longer exists. It was deleted while you were away.", -1))
            ])) : g.value ? (l(), n("div", Wn, [
              t("span", null, b(g.value), 1),
              i(e(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: s[1] || (s[1] = (U) => E())
              })
            ])) : V("", !0),
            m.value ? (l(), n(F, { key: 3 }, [
              p.value ? (l(), n("p", Kn, [
                i(e(z), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                K(b(p.value), 1)
              ])) : V("", !0),
              h.value ? (l(), n("p", Yn, [
                i(e(z), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                K(b(h.value), 1)
              ])) : V("", !0),
              t("div", Gn, [
                i(e(D), {
                  label: "Replace",
                  disabled: f.value !== void 0,
                  onClick: s[2] || (s[2] = (U) => L.value = !0)
                }, {
                  icon: A(() => [
                    i(e(z), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                m.value.state === "customized" ? (l(), O(e(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: f.value === "reset",
                  disabled: f.value !== void 0,
                  onClick: s[3] || (s[3] = (U) => j("reset"))
                }, {
                  icon: A(() => [
                    i(e(z), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                m.value.state === "created" ? (l(), O(e(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: f.value === "delete",
                  disabled: f.value !== void 0,
                  onClick: s[4] || (s[4] = (U) => j("delete"))
                }, {
                  icon: A(() => [
                    i(e(z), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ]),
              t("div", Zn, [
                i(Qa, {
                  name: m.value.name,
                  revision: m.value.revision,
                  asset: m.value.asset,
                  large: "",
                  alt: m.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", Qn, [
                s[12] || (s[12] = t("dt", null, "Reference", -1)),
                t("dd", Xn, [
                  t("span", eo, b(se.value), 1),
                  i(e(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": k.value ? "Reference copied" : "Copy reference",
                    title: k.value ? "Reference copied" : "Copy reference",
                    onClick: q
                  }, {
                    icon: A(() => [
                      i(e(z), {
                        icon: k.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                s[13] || (s[13] = t("dt", null, "File", -1)),
                t("dd", null, b(m.value.asset?.filename) + " · " + b(e(Me)(m.value.asset?.size)), 1),
                m.value.asset?.width ? (l(), n(F, { key: 0 }, [
                  s[11] || (s[11] = t("dt", null, "Size", -1)),
                  t("dd", null, b(m.value.asset.width) + " × " + b(m.value.asset.height), 1)
                ], 64)) : V("", !0),
                s[14] || (s[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  i(wa, { resource: m.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", ao, [
                s[15] || (s[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                X.value.length ? (l(), n(F, { key: 1 }, [
                  t("ul", to, [
                    (l(!0), n(F, null, ce(X.value, (U) => (l(), n("li", {
                      key: U.name
                    }, [
                      i(e(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (Z) => e(r)({ name: "resource", kind: "message", resource: U.name, section: "content" })
                      }, {
                        default: A(() => [
                          i(e(z), {
                            icon: e(be).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U.title === void 0 ? (l(), O(e(Re), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", so, b(U.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  C.value ? (l(), n("div", io, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: C.value,
                      title: "How " + m.value.title + " looks in " + (e(v).title("message", c.value) ?? "")
                    }, null, 8, no)
                  ])) : V("", !0)
                ], 64)) : (l(), n("p", lo, "No message shows " + b(m.value.title) + " with its sample values.", 1))
              ]),
              t("section", oo, [
                s[16] || (s[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                S.value.length ? (l(), n("ol", uo, [
                  (l(!0), n(F, null, ce(S.value, (U) => (l(), n("li", {
                    key: U.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", co, [
                      t("div", vo, [
                        t("span", mo, [
                          K("Version " + b(U.version) + " · " + b(e(ba)[U.action]) + " ", 1),
                          U.revision === m.value.revision ? (l(), O(e(Ne), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", fo, [
                          K(b(e(we)(U.author_label, U.author)) + " · " + b(e(He)(U.created_at)) + " ", 1),
                          U.content.asset?.filename ? (l(), n(F, { key: 0 }, [
                            K(" · " + b(U.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      U.revision !== m.value.revision ? (l(), O(e(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: f.value === U.revision,
                        disabled: f.value !== void 0,
                        onClick: (Z) => j("restore", U)
                      }, {
                        icon: A(() => [
                          i(e(z), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", ro, b(m.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      m.value ? (l(), O(Xa, {
        key: 0,
        visible: L.value,
        replace: m.value,
        onClose: s[6] || (s[6] = (U) => L.value = !1),
        onDone: s[7] || (s[7] = (U) => E())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      i(Za, {
        refusal: I.value,
        onClose: s[8] || (s[8] = (U) => I.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), yo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, po = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, go = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, ho = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, ko = { class: "mail-toolbar" }, $o = {
  class: "mail-count",
  role: "status"
}, wo = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, _o = { class: "mail-sub" }, xo = { class: "mail-mono-block" }, Co = { class: "mail-muted" }, Vo = { class: "mail-muted" }, So = /* @__PURE__ */ le({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(a) {
    const d = a, { go: o, upload: u } = fe(), v = w(""), r = w("");
    let _;
    Q(v, (I) => {
      clearTimeout(_), _ = setTimeout(() => {
        r.value = I.trim();
      }, 250);
    });
    const m = pe([]), S = w(!0), T = w(!1), c = w(!1), y = w(""), R = w(""), g = Ve();
    async function p(I = !1) {
      const N = g();
      S.value = !0;
      try {
        const E = await te.assets(r.value || void 0);
        if (!N()) return;
        m.value = E, y.value = R.value = "", c.value = !1, T.value = !0;
      } catch (E) {
        if (!N()) return;
        c.value = qe(E);
        const X = c.value ? "" : ne(E, "Images could not be loaded.");
        I && T.value && !c.value ? R.value = X : y.value = X;
      } finally {
        N() && (S.value = !1);
      }
    }
    Q(r, () => {
      p();
    }), la(() => p(T.value)), Ue("mail.library", () => {
      p(T.value);
    });
    function h(I) {
      const N = I.used_by?.messages;
      return N ? ye(N, "message") : "—";
    }
    const f = P(() => m.value.reduce((I, N) => I + (N.asset?.size ?? 0), 0)), k = P(() => `${ye(m.value.length, "image")} · ${Me(f.value)}`);
    function $(I) {
      const N = I.asset;
      return N ? (N.width && N.height ? `${N.width} × ${N.height} · ` : "") + Me(N.size) : "";
    }
    function L(I) {
      o({ name: "library", section: "assets", asset: I.name });
    }
    return (I, N) => (l(), n(F, null, [
      i(Be, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: A(() => [
          i(e(D), {
            label: "Upload image",
            onClick: N[0] || (N[0] = (E) => e(u)())
          }, {
            icon: A(() => [
              i(e(z), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      c.value ? (l(), n("p", yo, [
        i(e(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        N[7] || (N[7] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : y.value ? (l(), n("div", po, [
        t("span", null, b(y.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: N[1] || (N[1] = (E) => p())
        })
      ])) : V("", !0),
      R.value ? (l(), n("div", go, [
        t("span", null, b(R.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: N[2] || (N[2] = (E) => p(!0))
        })
      ])) : S.value && !T.value ? (l(), n("p", ho, [
        i(e(z), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        N[8] || (N[8] = K("Loading images…", -1))
      ])) : T.value && !m.value.length && !r.value ? (l(), O(ha, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: N[3] || (N[3] = (E) => e(u)())
      })) : T.value ? (l(), n(F, { key: 5 }, [
        t("div", ko, [
          i(e(pa), { class: "mail-search" }, {
            default: A(() => [
              i(e(ga), null, {
                default: A(() => [
                  i(e(z), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(de), {
                modelValue: v.value,
                "onUpdate:modelValue": N[4] || (N[4] = (E) => v.value = E),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", $o, b(k.value), 1)
        ]),
        m.value.length ? (l(), O(e(ya), {
          key: 1,
          value: m.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: N[5] || (N[5] = (E) => L(E.data))
        }, {
          default: A(() => [
            i(e(ue), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: A(({ data: E }) => [
                i(Qa, {
                  name: E.name,
                  revision: E.revision,
                  asset: E.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            i(e(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: E }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: E.title,
                  onClick: Te((X) => L(E), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", _o, [
                  t("span", xo, b(E.name), 1),
                  E.asset?.filename ? (l(), n(F, { key: 0 }, [
                    K(" · " + b(E.asset.filename), 1)
                  ], 64)) : V("", !0)
                ])
              ]),
              _: 1
            }),
            i(e(ue), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: E }) => [
                t("span", Co, b($(E)), 1)
              ]),
              _: 1
            }),
            i(e(ue), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: E }) => [
                t("span", null, b(h(E)), 1)
              ]),
              _: 1
            }),
            i(e(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: E }) => [
                i(wa, { resource: E }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            i(e(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: E }) => [
                t("span", Vo, b(E.state === "original" ? "—" : e(Oa)(E.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", wo, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      i(bo, {
        name: d.asset,
        onClose: N[6] || (N[6] = (E) => e(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), To = { class: "kx-modal-head-icon" }, Uo = { class: "kx-modal-head-text" }, Ro = { class: "kx-modal-head-title" }, jo = { class: "kx-modal-head-sub" }, Ao = ["id"], Lo = ["disabled", "inert"], Io = {
  key: 0,
  class: "mail-field"
}, No = {
  key: 1,
  class: "mail-field"
}, zo = ["for"], Eo = { class: "mail-field" }, Oo = ["for"], Po = ["for"], Mo = ["id"], Do = { class: "mail-field" }, Bo = ["for"], qo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Se = "\0blank", Ho = /* @__PURE__ */ le({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe(), _ = w("message"), m = w(""), S = w(""), T = w(""), c = w(""), y = w(!1), R = w(!1), g = w(""), p = w(""), h = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, f = ["message", "base", "part"].map((q) => ({ value: q, label: me[q] })), k = P(() => !!o.intent.from), $ = P(() => [
      { value: Se, label: "Blank" },
      ...v.ofKind(_.value).map((q) => ({ value: q.name, label: q.title }))
    ]), L = P(() => m.value === Se || !!v.find(_.value, m.value));
    function I(q) {
      if (m.value = q, q === Se) return;
      const j = v.find(_.value, q);
      j && (c.value = j.description, o.intent.from && (S.value = `${j.title} copy`, y.value = !1));
    }
    Q(() => o.visible, async (q) => {
      q && (_.value = o.intent.from?.kind ?? o.intent.kind ?? "message", S.value = T.value = c.value = m.value = "", g.value = p.value = "", y.value = !1, o.intent.from ? (m.value = o.intent.from.name, v.ready(_.value) || await v.load(_.value), o.visible && I(o.intent.from.name)) : (m.value = Se, v.ensure(_.value)));
    }, { immediate: !0 }), Q(_, (q) => {
      o.intent.from || (m.value = Se, c.value = "", o.visible && v.ensure(q));
    }), xe(() => o.visible), Q(S, (q) => {
      y.value || (T.value = Ma(q));
    });
    const N = P(() => _.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function E() {
      return p.value = "", T.value ? Da.test(T.value) ? v.find(_.value, T.value) && (p.value = `A ${me[_.value].toLowerCase()} with this reference already exists. Choose another.`) : p.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : p.value = "Enter a reference.", !p.value;
    }
    async function X() {
      if (!(R.value || !S.value.trim() || !L.value || !E())) {
        R.value = !0, g.value = "";
        try {
          const q = m.value === Se ? await te.create(Yt(_.value, T.value, S.value.trim(), c.value.trim())) : await te.copy({
            kind: _.value,
            name: T.value,
            title: S.value.trim(),
            description: c.value.trim(),
            from: { kind: _.value, name: m.value }
          });
          v.patch(q.kind, q.name, Ja(q)), u("close"), r({ name: "resource", kind: q.kind, resource: q.name, section: "content" });
        } catch (q) {
          $e(q) === "mail_revision_conflict" ? p.value = `A ${me[_.value].toLowerCase()} with this reference already exists. Choose another.` : g.value = ne(q, "The resource could not be created.");
        } finally {
          R.value = !1;
        }
      }
    }
    const ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, se = P(() => o.intent.from ? `Duplicate ${v.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${me[_.value].toLowerCase()}`);
    return (q, j) => (l(), O(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !R.value,
      "close-on-escape": !R.value,
      class: "mail-dialog",
      pt: ae,
      "aria-label": se.value,
      "onUpdate:visible": j[6] || (j[6] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", To, [
          i(e(z), {
            icon: e(be)[_.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Uo, [
          t("span", Ro, b(se.value), 1),
          t("span", jo, b(m.value === Se ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: R.value,
          onClick: j[5] || (j[5] = (C) => u("close"))
        }, null, 8, ["disabled"]),
        i(e(D), {
          label: "Create " + e(me)[_.value].toLowerCase(),
          type: "submit",
          form: h.hint,
          loading: R.value,
          disabled: !S.value.trim() || !L.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: h.hint,
          class: "mail-form",
          onSubmit: Te(X, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: R.value,
            inert: R.value || void 0
          }, [
            k.value ? V("", !0) : (l(), n("div", Io, [
              j[7] || (j[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              i(e(_e), {
                modelValue: _.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => _.value = C),
                options: e(f),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            k.value ? V("", !0) : (l(), n("div", No, [
              t("label", {
                class: "mail-field-label",
                for: h.source
              }, "Start from", 8, zo),
              i(e(ze), {
                "model-value": m.value,
                "input-id": h.source,
                options: $.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !e(v).ready(_.value),
                "onUpdate:modelValue": I
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", Eo, [
              t("label", {
                class: "mail-field-label",
                for: h.title
              }, "Name", 8, Oo),
              i(e(de), {
                id: h.title,
                modelValue: S.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => S.value = C),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": p.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: h.reference
              }, "Reference", 8, Po),
              i(e(de), {
                id: h.reference,
                modelValue: T.value,
                "onUpdate:modelValue": j[2] || (j[2] = (C) => T.value = C),
                class: "mail-mono-input",
                invalid: !!p.value,
                "aria-describedby": h.reference + "-hint",
                onInput: j[3] || (j[3] = (C) => y.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: h.reference + "-hint",
                class: re(p.value ? "mail-field-error" : "mail-field-hint")
              }, b(p.value || N.value), 11, Mo)
            ], 2),
            t("div", Do, [
              t("label", {
                class: "mail-field-label",
                for: h.description
              }, "Description", 8, Bo),
              i(e(da), {
                id: h.description,
                modelValue: c.value,
                "onUpdate:modelValue": j[4] || (j[4] = (C) => c.value = C),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Lo),
          g.value ? (l(), n("p", qo, b(g.value), 1)) : V("", !0)
        ], 40, Ao)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Fo = { class: "mail-drawer-head" }, Jo = { class: "mail-drawer-title" }, Wo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Ko = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Yo = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Go = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Zo = {
  key: 0,
  class: "kx-notice error mail-failure"
}, Qo = { class: "mail-failure-body" }, Xo = { key: 0 }, er = { key: 1 }, ar = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, lr = {
  key: 3,
  class: "mail-sub"
}, tr = {
  key: 4,
  class: "mail-sub"
}, sr = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, ir = { key: 6 }, nr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, or = { class: "mail-facts mail-card" }, rr = { key: 2 }, ur = {
  key: 0,
  class: "mail-sub"
}, dr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, cr = { class: "mail-timeline" }, vr = { class: "mail-muted" }, mr = { class: "mail-facts" }, fr = { class: "mail-mono-block" }, br = /* @__PURE__ */ le({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r, capabilities: _, delivery: m } = fe();
    xe(() => !!o.messageId);
    const S = w();
    Q(() => !!o.messageId, (x) => {
      x && Qe(() => S.value?.focus());
    }, { immediate: !0 });
    const T = P(() => !!y.value?.last_error && wl.has(y.value.last_error.code)), c = P(() => {
      const x = y.value?.last_error;
      if (!x) return;
      const s = m.value?.driver && m.value.driver.id === y.value?.driver_id ? m.value.driver.label : "The delivery service";
      return (_.value?.administer_delivery ? _l(x.code, s) : void 0) ?? { lead: "", next: x.message };
    }), y = pe(), R = w(!1), g = w(!1), p = w(!1), h = w(""), f = w(""), k = w(!1), $ = w(), L = w(!1), I = Ve();
    async function N() {
      const x = o.messageId, s = I();
      if (!x) {
        y.value = void 0;
        return;
      }
      R.value = !0;
      try {
        const U = await ea.get(x);
        if (!s()) return;
        y.value = U, h.value = "", g.value = p.value = !1;
      } catch (U) {
        if (!s()) return;
        y.value = void 0, g.value = Xe(U), p.value = qe(U), h.value = g.value || p.value ? "" : ne(U, "This message could not be loaded.");
      } finally {
        s() && (R.value = !1);
      }
    }
    Q(() => o.messageId, (x) => {
      $.value = void 0, f.value = "", L.value = !1, x !== y.value?.message_id && (y.value = void 0), N();
    }, { immediate: !0 }), Ue("mail.activity", () => {
      o.messageId && N();
    });
    async function E() {
      const x = y.value;
      if (!(!x || k.value)) {
        k.value = !0, f.value = "";
        try {
          $.value = await ea.resend(x.message_id);
        } catch (s) {
          f.value = ne(s, "The message could not be sent again.");
        } finally {
          k.value = !1;
        }
      }
    }
    async function X() {
      const x = y.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(x.message_id)}`), L.value = !0;
        } catch {
          L.value = !1;
        }
    }
    const ae = P(() => {
      const x = y.value?.template;
      return x ? v.title("message", x) : "";
    }), se = P(() => !!y.value?.template && !!v.find("message", y.value.template)), q = P(() => {
      const x = y.value;
      if (!x) return [];
      const s = [{ label: "Accepted for delivery", at: x.created_at }];
      return x.status === "queued" && x.next_attempt_at && s.push({ label: x.attempts ? `Attempt ${x.attempts} did not go through; trying again` : "Next delivery attempt", at: x.next_attempt_at }), x.sent_at ? s.push({ label: x.attempts > 1 ? `Sent after ${x.attempts} attempts` : "Sent", at: x.sent_at }) : x.status === "failed" && x.finished_at && s.push({ label: x.attempts > 1 ? `Failed after ${x.attempts} attempts` : "Failed", at: x.finished_at }), s;
    }), j = P(() => (y.value?.attachments ?? []).map((x) => x.filename || "Attachment")), C = P(() => {
      const x = y.value;
      return x ? [
        { label: "Message ID", value: x.message_id },
        { label: "Delivery service", value: _.value?.administer_delivery ? x.driver_id : void 0 },
        { label: "Service message ID", value: x.provider_message_id },
        { label: "Error code", value: x.last_error?.code },
        { label: "Service response", value: x.last_error?.provider_detail }
      ].filter((s) => !!s.value) : [];
    });
    return (x, s) => (l(), O(e(Ha), {
      visible: !!a.messageId,
      position: "right",
      modal: !0,
      dismissable: !k.value,
      "close-on-escape": !k.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": s[6] || (s[6] = (U) => {
        U || u("close");
      })
    }, {
      default: A(() => [
        t("div", {
          ref_key: "drawer",
          ref: S,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", Fo, [
            t("div", Jo, [
              y.value ? (l(), O(e(Ne), {
                key: 0,
                severity: e(qa)[y.value.status],
                value: e(Ba)[y.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : V("", !0),
              t("h2", null, b(y.value?.subject ?? "Message"), 1)
            ]),
            i(e(D), {
              text: "",
              severity: "secondary",
              disabled: !y.value,
              "aria-label": L.value ? "Link copied" : "Copy link",
              title: L.value ? "Link copied" : "Copy link",
              onClick: X
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: L.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            i(e(D), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: k.value,
              onClick: s[0] || (s[0] = (U) => u("close"))
            }, {
              icon: A(() => [
                i(e(z), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          R.value && !y.value ? (l(), n("p", Wo, [
            i(e(z), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            s[7] || (s[7] = K("Loading message…", -1))
          ])) : g.value ? (l(), n("p", Ko, [
            i(e(z), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            s[8] || (s[8] = K("This message is no longer in Activity.", -1))
          ])) : p.value ? (l(), n("p", Yo, [
            i(e(z), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            s[9] || (s[9] = K("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : h.value ? (l(), n("div", Go, [
            t("span", null, b(h.value), 1),
            i(e(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: s[1] || (s[1] = (U) => N())
            })
          ])) : V("", !0),
          y.value ? (l(), n(F, { key: 4 }, [
            y.value.status === "failed" ? (l(), n("div", Zo, [
              i(e(z), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Qo, [
                s[12] || (s[12] = t("strong", null, "This message was not delivered.", -1)),
                c.value?.lead ? (l(), n("span", Xo, b(c.value.lead), 1)) : V("", !0),
                c.value ? (l(), n("span", er, b(c.value.next), 1)) : V("", !0),
                $.value ? (l(), n("p", ar, [
                  s[10] || (s[10] = K(" Sent again as a new message. ", -1)),
                  i(e(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: s[2] || (s[2] = (U) => e(r)({ name: "activity", message: $.value.message_id }))
                  })
                ])) : T.value ? (l(), n("p", lr, [
                  s[11] || (s[11] = K("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  e(_)?.administer_delivery ? (l(), O(e(D), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: s[3] || (s[3] = (U) => e(Ce).navigate("/system/settings/mail"))
                  })) : V("", !0)
                ])) : y.value.can_resend ? V("", !0) : (l(), n("p", tr, "It cannot be sent again because its content was not kept.")),
                f.value ? (l(), n("p", sr, b(f.value), 1)) : V("", !0),
                e(_)?.send && y.value.can_resend && !$.value && !T.value ? (l(), n("div", ir, [
                  i(e(D), {
                    label: "Send again",
                    loading: k.value,
                    onClick: E
                  }, {
                    icon: A(() => [
                      i(e(z), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : y.value.status === "queued" ? (l(), n("p", nr, [
              i(e(z), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              s[13] || (s[13] = K("Waiting to be delivered. ", -1))
            ])) : V("", !0),
            t("dl", or, [
              s[19] || (s[19] = t("dt", null, "To", -1)),
              t("dd", null, b(y.value.to.join(", ")), 1),
              y.value.cc?.length ? (l(), n(F, { key: 0 }, [
                s[14] || (s[14] = t("dt", null, "Cc", -1)),
                t("dd", null, b(y.value.cc.join(", ")), 1)
              ], 64)) : V("", !0),
              y.value.bcc?.length ? (l(), n(F, { key: 1 }, [
                s[15] || (s[15] = t("dt", null, "Bcc", -1)),
                t("dd", null, b(y.value.bcc.join(", ")), 1)
              ], 64)) : V("", !0),
              y.value.reply_to ? (l(), n(F, { key: 2 }, [
                s[16] || (s[16] = t("dt", null, "Reply-to", -1)),
                t("dd", null, b(y.value.reply_to), 1)
              ], 64)) : V("", !0),
              s[20] || (s[20] = t("dt", null, "Template", -1)),
              t("dd", null, [
                ae.value === void 0 ? (l(), O(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : se.value ? (l(), O(e(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ae.value,
                  onClick: s[4] || (s[4] = (U) => e(r)({ name: "resource", kind: "message", resource: y.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", rr, b(ae.value || "Written directly"), 1))
              ]),
              s[21] || (s[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                K(b(e(we)(y.value.sender_label, y.value.sender)), 1),
                y.value.origin ? (l(), n("span", ur, b(e(ta)(y.value.origin)), 1)) : V("", !0)
              ]),
              j.value.length ? (l(), n(F, { key: 3 }, [
                s[17] || (s[17] = t("dt", null, "Attachments", -1)),
                t("dd", null, b(j.value.join(", ")), 1)
              ], 64)) : V("", !0),
              y.value.resend_of ? (l(), n(F, { key: 4 }, [
                s[18] || (s[18] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  i(e(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: s[5] || (s[5] = (U) => e(r)({ name: "activity", message: y.value.resend_of }))
                  })
                ])
              ], 64)) : V("", !0)
            ]),
            t("section", dr, [
              s[22] || (s[22] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", cr, [
                (l(!0), n(F, null, ce(q.value, (U) => (l(), n("li", {
                  key: U.label
                }, [
                  t("span", null, b(U.label), 1),
                  t("span", vr, b(e(He)(U.at)), 1)
                ]))), 128))
              ])
            ]),
            C.value.length ? (l(), O(Ga, {
              key: 2,
              label: "Technical details"
            }, {
              default: A(() => [
                t("dl", mr, [
                  (l(!0), n(F, null, ce(C.value, (U) => (l(), n(F, {
                    key: U.label
                  }, [
                    t("dt", null, b(U.label), 1),
                    t("dd", fr, b(U.value), 1)
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
}), yr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, pr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, gr = { class: "mail-health-text" }, hr = { class: "mail-toolbar" }, kr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, $r = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, wr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, _r = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, xr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Cr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Vr = { class: "mail-sub" }, Sr = {
  key: 0,
  class: "mail-sub"
}, Tr = { class: "mail-muted" }, Ur = {
  key: 2,
  class: "mail-more"
}, Rr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, jr = /* @__PURE__ */ le({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = fe();
    o.use("message");
    const v = w("all"), r = w(d.template ?? null), _ = w(30), m = w(""), S = w("");
    let T;
    Q(m, (ee) => {
      clearTimeout(T), T = setTimeout(() => {
        S.value = ee.trim();
      }, 250);
    }), Q(() => d.template, (ee) => {
      ee !== void 0 && (r.value = ee);
    });
    const c = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], y = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], R = P(() => o.ofKind("message").map((ee) => ({ label: ee.title, value: ee.name }))), g = pe([]), p = w(), h = w(!0), f = w(!1), k = w(!1), $ = w(!1), L = w(""), I = w(""), N = w(""), E = Ve();
    function X(ee) {
      return {
        status: v.value === "all" ? void 0 : v.value,
        message: r.value || void 0,
        since: Date.now() - _.value * 24 * 60 * 60 * 1e3,
        q: S.value || void 0,
        cursor: ee
      };
    }
    async function ae(ee = !1) {
      const W = E();
      h.value = !0;
      try {
        const Y = await ea.list(X());
        if (!W()) return;
        g.value = Y.items, p.value = Y.next_cursor, q.value = Y.total, j.value = !!Y.total_is_lower_bound, C.value = Y.failed_today ?? 0, L.value = I.value = N.value = "", $.value = !1, f.value = !0;
      } catch (Y) {
        if (!W()) return;
        $.value = qe(Y);
        const ge = $.value ? "" : ne(Y, "Activity could not be loaded.");
        ee && f.value && !$.value ? N.value = ge : L.value = ge;
      } finally {
        W() && (h.value = !1);
      }
    }
    async function se() {
      if (h.value || !p.value || k.value) return;
      const ee = E();
      k.value = !0, I.value = "";
      try {
        const W = await ea.list(X(p.value));
        if (!ee()) return;
        const Y = new Set(g.value.map((ge) => ge.message_id));
        g.value = [...g.value, ...W.items.filter((ge) => !Y.has(ge.message_id))], p.value = W.next_cursor;
      } catch (W) {
        ee() && (I.value = ne(W, "More activity could not be loaded."));
      } finally {
        k.value = !1;
      }
    }
    const q = w(), j = w(!1), C = w(0);
    Q([v, r, _, S], () => {
      ae();
    }), la(() => ae(f.value)), Ue("mail.activity", () => {
      ae(f.value);
    });
    const x = P(() => {
      const ee = q.value ?? g.value.length;
      return j.value ? `${ee.toLocaleString()}+ messages` : ye(ee, "message");
    }), s = P(() => j.value && !!S.value), U = P(() => C.value ? `${ye(C.value, "message")} failed today.` : "");
    function Z(ee) {
      return ee ? o.title("message", ee) : "—";
    }
    function H(ee) {
      u({ name: "activity", message: ee.message_id });
    }
    function J() {
      u({ name: "activity", template: r.value || void 0 });
    }
    return (ee, W) => (l(), n(F, null, [
      i(Be, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      $.value ? (l(), n("p", yr, [
        i(e(z), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        W[8] || (W[8] = K("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(F, { key: 1 }, [
        U.value ? (l(), n("p", pr, [
          i(e(z), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", gr, [
            t("strong", null, b(U.value), 1),
            K(" " + b(v.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          v.value !== "failed" ? (l(), O(e(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[0] || (W[0] = (Y) => v.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", hr, [
          i(e(_e), {
            modelValue: v.value,
            "onUpdate:modelValue": W[1] || (W[1] = (Y) => v.value = Y),
            options: c,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          i(e(ze), {
            modelValue: r.value,
            "onUpdate:modelValue": W[2] || (W[2] = (Y) => r.value = Y),
            options: R.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          i(e(ze), {
            modelValue: _.value,
            "onUpdate:modelValue": W[3] || (W[3] = (Y) => _.value = Y),
            options: y,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          i(e(pa), { class: "mail-search" }, {
            default: A(() => [
              i(e(ga), null, {
                default: A(() => [
                  i(e(z), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(de), {
                modelValue: m.value,
                "onUpdate:modelValue": W[4] || (W[4] = (Y) => m.value = Y),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          f.value ? (l(), n("span", kr, b(x.value), 1)) : V("", !0)
        ]),
        s.value ? (l(), n("p", $r, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : V("", !0),
        L.value ? (l(), n("div", wr, [
          t("span", null, b(L.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[5] || (W[5] = (Y) => ae())
          })
        ])) : V("", !0),
        N.value ? (l(), n("div", _r, [
          t("span", null, b(N.value) + " The list shows what was loaded before.", 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[6] || (W[6] = (Y) => ae(!0))
          })
        ])) : h.value && !f.value ? (l(), n("p", xr, [
          i(e(z), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          W[9] || (W[9] = K("Loading activity…", -1))
        ])) : f.value ? (l(), n(F, { key: 5 }, [
          g.value.length ? (l(), O(e(ya), {
            key: 1,
            value: g.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: W[7] || (W[7] = (Y) => H(Y.data))
          }, {
            default: A(() => [
              i(e(ue), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: A(({ data: Y }) => [
                  i(e(Ne), {
                    severity: e(qa)[Y.status],
                    value: e(Ba)[Y.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              i(e(ue), { header: "Message" }, {
                body: A(({ data: Y }) => [
                  i(e(D), {
                    link: "",
                    class: "mail-name",
                    label: Y.subject,
                    onClick: Te((ge) => H(Y), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", Vr, b(e(xl)(Y.to)), 1)
                ]),
                _: 1
              }),
              i(e(ue), { header: "Template" }, {
                body: A(({ data: Y }) => [
                  Z(Y.template) === void 0 ? (l(), O(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    K(b(Z(Y.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              i(e(ue), { header: "Sent by" }, {
                body: A(({ data: Y }) => [
                  t("span", null, b(e(we)(Y.sender_label, Y.sender)), 1),
                  Y.origin ? (l(), n("span", Sr, b(e(ta)(Y.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              i(e(ue), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: A(({ data: Y }) => [
                  t("span", Tr, b(e(Cl)(Y.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Cr, b(S.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          p.value ? (l(), n("div", Ur, [
            I.value ? (l(), n("span", Rr, b(I.value), 1)) : V("", !0),
            i(e(D), {
              label: I.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: k.value,
              disabled: h.value,
              onClick: se
            }, null, 8, ["label", "loading", "disabled"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      i(br, {
        "message-id": a.message,
        onClose: J
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Ar = { class: "kx-shell kx-settings-shell mail-admin" }, Lr = { class: "kx-main" }, Ir = /* @__PURE__ */ le({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(a, { emit: d }) {
    const o = a, u = d, v = pe(La(o.route ?? "")), r = P(() => v.value), _ = w(!1);
    Q(_, (s) => u("dirty-change", s), { flush: "sync" });
    let m = !1;
    async function S() {
      if (!_.value) return !0;
      if (m) return !1;
      m = !0;
      try {
        return await Ce.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        m = !1;
      }
    }
    function T(s, U) {
      return s.name === "resource" && U.name === "resource" && s.kind === U.kind && s.resource === U.resource;
    }
    async function c(s) {
      const U = Le(s);
      !T(r.value, s) && !await S() || (T(r.value, s) || (_.value = !1), v.value = s, o.route !== void 0 && U !== o.route && u("navigate", U));
    }
    Q(() => o.route, async (s, U) => {
      if (s === void 0) return;
      const Z = La(s);
      if (Le(Z) !== Le(v.value)) {
        if (!T(v.value, Z) && _.value) {
          if (!await S()) {
            U !== void 0 && o.route === s && u("navigate", Le(v.value));
            return;
          }
          _.value = !1;
        }
        o.route === s && (v.value = Z);
      }
    });
    const y = Xl(), R = yl();
    Q(R, (s, U) => {
      U === !1 && s === !0 && y.refresh();
    });
    const g = w(), p = w();
    async function h() {
      try {
        g.value = await Vl.capabilities();
      } catch {
        g.value = void 0;
      }
      if (g.value?.administer_delivery)
        try {
          p.value = await Sl.status();
        } catch {
          p.value = void 0;
        }
    }
    h();
    const f = w(!1), k = w(!1), $ = w({});
    function L(s) {
      $.value = s, f.value = !0;
    }
    bl(Fa, {
      library: y,
      capabilities: g,
      delivery: p,
      go: (s) => {
        c(s);
      },
      create: L,
      upload: () => {
        k.value = !0;
      },
      setDirty: (s) => {
        _.value = s;
      },
      setTitle: (s) => {
        se.value = s;
      }
    });
    const I = {
      content: (s) => s === "message" ? "Message" : s === "base" ? "Layout" : "Content",
      variables: (s) => s === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, N = {
      content: (s) => be[s],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, E = P(() => !!g.value?.administer_delivery), X = P(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: be.message },
        { value: "bases", label: "Base templates", icon: be.base },
        { value: "parts", label: "Parts", icon: be.part },
        { value: "assets", label: "Images", icon: be.asset }
      ] },
      ...E.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ae = { value: "all", label: "All resources", icon: "tabler:table" }, se = w("");
    Q(() => Le(r.value), () => {
      se.value = "";
    });
    const q = P(() => {
      const s = r.value;
      if (s.name === "resource")
        return {
          leading: { value: "all", label: "All " + fa[s.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: se.value || " ", items: Ka(s.kind).map((U) => ({
            value: U,
            label: I[U](s.kind),
            icon: N[U](s.kind)
          })) }]
        };
    }), j = P(() => {
      const s = r.value;
      return s.name === "resource" ? s.section : s.name === "activity" ? "activity" : s.section;
    });
    function C(s) {
      const U = r.value;
      if (U.name === "resource") {
        c(s === "all" ? { name: "library", section: ca(U.kind) } : { ...U, section: s });
        return;
      }
      c(s === "activity" ? { name: "activity" } : { name: "library", section: s });
    }
    const x = w();
    return Q(() => Le(r.value), () => {
      x.value?.scrollTo({ top: 0 });
    }), (s, U) => (l(), n("main", Ar, [
      i(Ql, {
        label: "Mail sections",
        title: "Mail",
        value: j.value,
        groups: q.value ? q.value.groups : X.value,
        "leading-item": q.value ? q.value.leading : ae,
        "onUpdate:value": C
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", Lr, [
        t("div", {
          ref_key: "main",
          ref: x,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), O(hn, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), n(F, { key: 1 }, [
            E.value ? (l(), O(jr, {
              key: 0,
              message: r.value.message,
              template: r.value.template
            }, null, 8, ["message", "template"])) : g.value ? (l(), n(F, { key: 1 }, [
              i(Be, {
                title: "Activity",
                description: ""
              }),
              U[2] || (U[2] = t("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : V("", !0)
          ], 64)) : r.value.section === "assets" ? (l(), O(So, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), O(Jt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      i(Ho, {
        visible: f.value,
        intent: $.value,
        onClose: U[0] || (U[0] = (Z) => f.value = !1)
      }, null, 8, ["visible", "intent"]),
      i(Xa, {
        visible: k.value,
        onClose: U[1] || (U[1] = (Z) => k.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Nr = /* @__PURE__ */ le({
  __name: "MailAdminRoot",
  setup(a) {
    const d = pl(), o = gl();
    return (u, v) => (l(), O(Ir, {
      route: e(d).route,
      onNavigate: v[0] || (v[0] = (r) => e(o)("navigate", { route: r })),
      onDirtyChange: v[1] || (v[1] = (r) => e(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), zr = Tl(Nr, { type: "object", properties: { route: { type: "string", default: "" } } });
jl(import.meta.url, zr);
//# sourceMappingURL=admin.js.map
