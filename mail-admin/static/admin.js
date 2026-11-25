import { defineComponent as ae, useId as fe, openBlock as l, createElementBlock as n, unref as e, normalizeClass as ue, createElementVNode as t, createTextVNode as W, toDisplayString as b, createCommentVNode as V, renderSlot as Ee, computed as P, createBlock as O, resolveDynamicComponent as ol, normalizeProps as rl, guardReactiveProps as ul, createSlots as ba, withCtx as A, Fragment as F, renderList as me, inject as dl, ref as w, shallowRef as he, onMounted as cl, onBeforeUnmount as la, createVNode as i, watch as Z, reactive as vl, nextTick as Xe, withModifiers as je, useModel as Ea, mergeModels as da, defineAsyncComponent as ca, withDirectives as ml, vShow as fl, provide as bl } from "vue";
import { u as ta, a as yl, b as pl, c as gl } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Ae, l as se, d as oe, k as be, b as qe, A as hl, e as xe, a as Se, p as ge, w as Oa, c as Ce, _ as sa, f as ya, g as pe, s as Pa, i as Fe, h as Ue, j as pa, m as Je, o as ia, n as kl, q as $l, r as ea, t as Ma, v as Da, x as Ba, y as wl, z as _l, B as qa, C as Ha, D as aa, E as xl, F as Cl, G as Vl, H as Sl, I as Tl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-DYPXSEr5.js";
import { host as Te, api as Ul, on as Rl, define as jl } from "@wippy-fe/proxy";
import { Icon as E } from "@iconify/vue";
import Le from "primevue/skeleton";
import D from "primevue/button";
import ce from "primevue/column";
import ga from "primevue/datatable";
import ha from "primevue/iconfield";
import ka from "primevue/inputicon";
import ve from "primevue/inputtext";
import Ve from "primevue/selectbutton";
import Ie from "primevue/dialog";
import Al from "primevue/progressbar";
import Oe from "primevue/tag";
import Pe from "primevue/select";
import Ll from "primevue/accordion";
import Il from "primevue/accordioncontent";
import Nl from "primevue/accordionheader";
import zl from "primevue/accordionpanel";
import El from "primevue/menu";
import Ol from "primevue/checkbox";
import Pl from "primevue/inputnumber";
import va from "primevue/textarea";
import Fa from "primevue/drawer";
import Ml from "primevue/fileupload";
const Dl = ["aria-labelledby"], Bl = { class: "kx-railhead" }, ql = ["id"], Hl = { key: 0 }, Fl = { class: "kx-railhead-acts" }, Jl = { class: "kx-rail-body" }, Wl = /* @__PURE__ */ ae({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(a) {
    const d = fe();
    return (o, u) => (l(), n("aside", {
      class: ue(["kx-rail", { "kx-settings-list-rail": a.settings }]),
      "aria-labelledby": e(d)
    }, [
      t("div", Bl, [
        t("span", {
          id: e(d),
          class: "kx-railhead-title"
        }, [
          W(b(a.title), 1),
          a.count !== void 0 ? (l(), n("b", Hl, b(a.count), 1)) : V("", !0)
        ], 8, ql),
        t("div", Fl, [
          Ee(o.$slots, "actions")
        ])
      ]),
      Ee(o.$slots, "toolbar"),
      t("div", Jl, [
        Ee(o.$slots, "default")
      ])
    ], 10, Dl));
  }
}), Kl = ["aria-label"], Yl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Gl = ["aria-current", "onClick"], Zl = { class: "kx-settings-rail-label" }, Ql = /* @__PURE__ */ ae({
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
    function u(m) {
      const r = [...m.currentTarget.querySelectorAll(".kx-settings-rail-item")], _ = r.indexOf(m.target);
      if (_ < 0) return;
      let v;
      switch (m.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = (_ + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = (_ + r.length - 1) % r.length;
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
      m.preventDefault(), r[v]?.focus();
    }
    return (m, r) => (l(), O(ol(a.title ? Wl : "div"), rl(ul(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ba({
      default: A(() => [
        t("nav", {
          class: ue(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: u
        }, [
          (l(!0), n(F, null, me(o.value, (_, v) => (l(), n("div", {
            key: _.items[0]?.value ?? v,
            class: ue(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && v === 0 }])
          }, [
            _.heading ? (l(), n("div", Yl, b(_.heading), 1)) : V("", !0),
            (l(!0), n(F, null, me(_.items, (T) => (l(), n("button", {
              key: T.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": T.value === a.value ? "true" : void 0,
              onClick: (S) => m.$emit("update:value", T.value)
            }, [
              T.icon ? (l(), O(e(E), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: T.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Zl, b(T.label), 1)
            ], 8, Gl))), 128))
          ], 2))), 128))
        ], 42, Kl)
      ]),
      _: 2
    }, [
      a.title && m.$slots.actions ? {
        name: "actions",
        fn: A(() => [
          Ee(m.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ja = Symbol("mail-admin");
function ye() {
  const a = dl(Ja);
  if (!a) throw new Error("Mail administration context is missing");
  return a;
}
function Wa(a) {
  const { kind: d, name: o, title: u, description: m, state: r, revision: _, origin: v, origin_label: T, base: S, author: c, author_label: y, updated_at: U, used_by: h } = a, f = h && {
    messages: h.messages?.length,
    recent_sources: h.recent_senders?.length
  };
  return { kind: d, name: o, title: u, description: m, state: r, revision: _, origin: v, origin_label: T, base: S, author: c, author_label: y, updated_at: U, used_by: f };
}
function Xl() {
  const a = Object.fromEntries(["message", "base", "part", "asset"].map((h) => [h, { rows: he([]), loaded: w(!1), loading: w(!1), error: w(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map();
  let o = 0;
  function u(h) {
    const f = d.get(h);
    if (f) return f;
    const k = a[h];
    k.loading.value = !0;
    const p = o, g = (async () => {
      try {
        const $ = [];
        let L;
        do {
          const I = await se.page({ kind: h, cursor: L });
          $.push(...I.items), L = I.next_cursor;
        } while (L);
        k.rows.value = $, k.loaded.value = !0, k.stale = p !== o, k.error.value = "";
      } catch ($) {
        k.error.value = oe($, "The mail library could not be loaded.");
      } finally {
        k.loading.value = !1, d.delete(h), p !== o && k.users > 0 && m(h);
      }
    })();
    return d.set(h, g), g;
  }
  function m(h) {
    const f = a[h];
    (!f.loaded.value || f.stale) && !f.loading.value && u(h);
  }
  function r(...h) {
    cl(() => {
      for (const f of h)
        a[f].users++, m(f);
    }), la(() => {
      for (const f of h) a[f].users--;
    });
  }
  function _(h, f, k) {
    const p = a[h];
    if (!p.loaded.value) return;
    const g = p.rows.value.filter(($) => $.name !== f);
    k && g.push(k), p.rows.value = g;
  }
  function v() {
    o++;
    for (const [h, f] of Object.entries(a))
      f.stale = f.loaded.value, f.users > 0 && m(h);
  }
  Ae("mail.library", v);
  const T = (h, f) => a[h].rows.value.find((k) => k.name === f);
  function S(h, f) {
    const k = T(h, f);
    return k ? k.title : (m(h), a[h].loaded.value ? f : void 0);
  }
  return { kinds: a, use: r, ensure: m, load: u, find: T, title: S, ofKind: (h) => [...a[h].rows.value].sort((f, k) => f.title.localeCompare(k.title)), ready: (h) => a[h].loaded.value, failed: (h) => a[h].error.value, refresh: v, patch: _ };
}
const et = { class: "kx-empty" }, at = { class: "kx-empty-ico" }, lt = { class: "kx-empty-title" }, tt = {
  key: 0,
  class: "kx-empty-sub"
}, $a = /* @__PURE__ */ ae({
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
        i(e(E), {
          icon: a.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", lt, b(a.title), 1),
      a.hint || d.$slots.hint ? (l(), n("p", tt, [
        Ee(d.$slots, "hint", {}, () => [
          W(b(a.hint), 1)
        ])
      ])) : V("", !0),
      a.cta ? (l(), O(e(D), {
        key: 1,
        label: a.cta,
        onClick: o[0] || (o[0] = (u) => d.$emit("cta"))
      }, ba({ _: 2 }, [
        a.ctaIcon ? {
          name: "icon",
          fn: A(({ class: u }) => [
            i(e(E), {
              icon: a.ctaIcon,
              class: ue(u),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : V("", !0)
    ]));
  }
}), wa = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Ka = Object.fromEntries(Object.entries(wa).map(([a, d]) => [d, a])), st = ["content", "variables", "used-by", "history"];
function ma(a) {
  return wa[a];
}
function it(a) {
  return Ka[a];
}
function Ya(a) {
  return a === "base" ? ["content", "used-by", "history"] : a === "part" ? ["content", "variables", "history"] : st;
}
function ze(a) {
  return a.name === "activity" ? a.message ? `activity/${encodeURIComponent(a.message)}` : a.template ? `activity/template/${encodeURIComponent(a.template)}` : "activity" : a.name === "library" ? a.section === "assets" && a.asset ? `assets/${encodeURIComponent(a.asset)}` : a.section === "all" ? "" : a.section : `${wa[a.kind]}/${encodeURIComponent(a.resource)}/${a.section}`;
}
function Ia(a) {
  const d = (a ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, u, m] = d;
  if (!o) return { name: "library", section: "all" };
  try {
    if (o === "activity")
      return u === "template" && m ? { name: "activity", template: decodeURIComponent(m) } : u ? { name: "activity", message: decodeURIComponent(u) } : { name: "activity" };
    if (o === "assets") return u ? { name: "library", section: "assets", asset: decodeURIComponent(u) } : { name: "library", section: "assets" };
    const r = Ka[o];
    if (!r) return { name: "library", section: "all" };
    if (!u) return { name: "library", section: o };
    const v = Ya(r).find((T) => T === m) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(u), section: v };
  } catch {
    return { name: "library", section: "all" };
  }
}
const nt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", ua = `<meta http-equiv="Content-Security-Policy" content="${nt}">`;
function _a(a, d) {
  let o = a;
  for (const [r, _] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join(_);
  const u = /<head(\s[^>]*)?>/i.exec(o);
  if (u) return o.slice(0, u.index + u[0].length) + ua + o.slice(u.index + u[0].length);
  const m = /<html(\s[^>]*)?>/i.exec(o);
  return m ? o.slice(0, m.index + m[0].length) + "<head>" + ua + "</head>" + o.slice(m.index + m[0].length) : ua + o;
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
}, fa = /* @__PURE__ */ ae({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = ye(), m = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (c) => o.title(c.kind, c.name), _ = (c) => !!c && !!d.draft && c.kind === d.draft.kind && c.name === d.draft.name, v = P(() => {
      const { resource: c, face: y, previewOf: U } = d.problem, h = y ? m[y] : "";
      if (c && d.draft && d.draft.kind !== "message" && c.kind === "message" && c.name === U)
        return `${r(c) ?? "The message"} does not render with your changes.`;
      if (d.problem.tooLarge) {
        const f = !c || _(c) ? d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it" : r(c) ?? "a resource it uses";
        return `The ${h || "content"} of ${f} is larger than Mail can send. Keep each rendered face under ${qe(d.problem.tooLarge)}.`;
      }
      if (!c || _(c)) {
        const f = d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it";
        return h ? `The ${h} of ${f} does not render.` : `${f[0].toUpperCase()}${f.slice(1)} does not render.`;
      }
      return `${r(c) ?? "A resource it uses"} does not render${h ? ` (${h})` : ""}.`;
    }), T = P(() => d.problem.candidates ?? []);
    function S(c) {
      c.kind === "asset" ? u({ name: "library", section: "assets", asset: c.name }) : u({ name: "resource", kind: c.kind, resource: c.name, section: "content" });
    }
    return (c, y) => (l(), n("div", ot, [
      t("p", rt, [
        i(e(E), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(v.value), 1)
      ]),
      a.problem.tooLarge ? V("", !0) : (l(), n("code", ut, b(a.problem.engine ?? a.problem.message), 1)),
      T.value.length ? (l(), n("p", dt, [
        y[0] || (y[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(F, null, me(T.value, (U) => (l(), n(F, {
          key: U.kind + U.name
        }, [
          _(U) ? (l(), n("span", ct, "This " + b(e(be)[U.kind].toLowerCase()), 1)) : r(U) === void 0 ? (l(), O(e(Le), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), O(e(D), {
            key: 2,
            link: "",
            size: "small",
            label: r(U),
            class: "mail-inline-link",
            onClick: (h) => S(U)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : V("", !0)
    ]));
  }
}), Na = ["html", "text", "subject", "variables", "samples"];
function De(a) {
  return !!a && typeof a == "object" && typeof a.kind == "string" && typeof a.name == "string";
}
function He(a) {
  if (!(a instanceof hl)) return;
  const d = a.details ?? {}, o = xe(a);
  if (o === "mail_resource_in_use") {
    const S = Array.isArray(d.messages) ? d.messages.filter((y) => typeof y == "string") : [], c = d.dependent;
    return {
      message: a.message,
      dependents: S,
      references: Array.isArray(d.resources) ? d.resources.filter(De) : void 0,
      face: Na.find((y) => y === c?.face),
      resource: De(c?.resource) ? c.resource : void 0
    };
  }
  const u = Na.find((S) => S === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!u) return;
  const m = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((S) => typeof S == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((S) => {
    const c = S;
    return De(c.resource) && typeof c.message == "string" ? [{ name: c.resource.name, message: c.message }] : [];
  }) : [], _ = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(De) : [], v = typeof d.engine_message == "string" ? d.engine_message : void 0, T = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: a.message,
    engine: v,
    tooLarge: T,
    face: u,
    resource: De(d.resource) ? d.resource : void 0,
    dependents: m.length ? m : void 0,
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
}, Ut = 3, Rt = /* @__PURE__ */ ae({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { go: m } = ye();
    Se(() => o.visible);
    const r = w([]), _ = w(), v = w(), T = w(!1), S = w("");
    let c = 0, y = [], U = 0, h;
    async function f(C, x) {
      C.state = "loading";
      try {
        const s = await se.preview(C.name, []);
        if (x !== c) return;
        C.subject = s.subject, C.warning = s.warnings?.length ? s.warnings.map(Oa).join(" ") : void 0, C.document = s.html ? _a(s.html, s.inline_assets) : "", C.state = "ready";
      } catch (s) {
        if (x !== c) return;
        C.problem = He(s), C.failure = C.problem ? "" : oe(s, "This message could not be rendered."), C.state = "failed";
      }
    }
    function k(C) {
      for (; C === c && U < Ut && y.length; ) {
        const x = y.shift();
        x.state === "waiting" && (U++, f(x, C).finally(() => {
          U--, k(C);
        }));
      }
    }
    function p(C) {
      C.state !== "waiting" || y.includes(C) || (y.push(C), k(c));
    }
    const g = w();
    function $() {
      if (h?.disconnect(), typeof IntersectionObserver > "u" || !g.value) {
        for (const C of r.value) p(C);
        return;
      }
      h = new IntersectionObserver((C) => {
        for (const x of C) {
          if (!x.isIntersecting) continue;
          const s = r.value.find((R) => R.name === x.target.dataset.name);
          s && p(s);
        }
      }, { root: g.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const C of g.value.querySelectorAll("[data-name]")) h.observe(C);
    }
    async function L(C) {
      T.value = !0, S.value = "";
      try {
        const x = await se.page({ kind: "message", cursor: _.value });
        if (C !== c) return;
        r.value = [...r.value, ...x.items.map((s) => vl({ name: s.name, title: s.title, state: "waiting" }))], _.value = x.next_cursor, v.value = x.total, await Xe(), $();
      } catch (x) {
        C === c && (S.value = oe(x, "The messages could not be listed."));
      } finally {
        C === c && (T.value = !1);
      }
    }
    function I() {
      c++, y = [], h?.disconnect(), h = void 0;
    }
    function N() {
      I(), r.value = [], _.value = v.value = void 0, L(c);
    }
    function z() {
      const C = ++c;
      y = [];
      for (const x of r.value) Object.assign(x, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Xe(() => {
        C === c && $();
      });
    }
    Z(() => o.visible, (C) => {
      C ? N() : I();
    }), la(I);
    const Q = P(() => r.value.filter((C) => C.state === "ready" || C.state === "failed").length), le = P(() => r.value.filter((C) => C.state === "failed").length), ee = P(() => {
      if (!r.value.length) return "";
      const C = `${Q.value} of ${ge(v.value ?? r.value.length, "message")} rendered`;
      return le.value ? `${C}, ${le.value} with a problem.` : C + ".";
    });
    function q(C) {
      u("close"), m({ name: "resource", kind: "message", resource: C, section: "content" });
    }
    const j = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (C, x) => (l(), O(e(Ie), {
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
          i(e(E), {
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
          onClick: z
        }, {
          icon: A(() => [
            i(e(E), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: A(() => [
        r.value.length ? (l(), n("div", ft, [
          t("span", null, b(ee.value), 1),
          i(e(Al), {
            value: Math.round(Q.value / (v.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : V("", !0),
        T.value && !r.value.length ? (l(), n("p", bt, [
          i(e(E), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = W("Listing messages…", -1))
        ])) : !T.value && !S.value && !r.value.length ? (l(), n("p", yt, "There are no messages yet.")) : V("", !0),
        t("ul", {
          ref_key: "list",
          ref: g,
          class: "mail-gallery"
        }, [
          (l(!0), n(F, null, me(r.value, (s) => (l(), n("li", {
            key: s.name,
            "data-name": s.name,
            class: ue(["mail-gallery-tile", { "mail-gallery-failed": s.state === "failed" }])
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + s.title,
              onClick: (R) => q(s.name)
            }, {
              default: A(() => [
                t("span", gt, b(s.title), 1),
                t("span", ht, b(s.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            s.warning ? (l(), n("p", kt, [
              i(e(E), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              W(b(s.warning), 1)
            ])) : V("", !0),
            t("div", $t, [
              s.state === "waiting" ? (l(), n("p", wt, "Renders when shown.")) : s.state === "loading" ? (l(), n("p", _t, [
                i(e(E), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                x[4] || (x[4] = W("Rendering…", -1))
              ])) : s.state === "failed" ? (l(), n("div", xt, [
                s.problem ? (l(), O(fa, {
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
        _.value || S.value ? (l(), n("div", St, [
          S.value ? (l(), n("span", Tt, b(S.value), 1)) : V("", !0),
          i(e(D), {
            label: S.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: T.value,
            onClick: x[0] || (x[0] = (s) => L(e(c)))
          }, null, 8, ["label", "loading"])
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), jt = { class: "mail-source" }, At = { key: 0 }, Lt = { key: 1 }, xa = /* @__PURE__ */ ae({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(a) {
    return (d, o) => (l(), n("span", jt, [
      a.resource.state === "created" ? (l(), n("span", At, b((a.resource.kind === "asset" ? "Uploaded by " : "Created by ") + e(Ce)(a.resource.author_label, a.resource.author)), 1)) : (l(), n("span", Lt, "Included with " + b(a.resource.origin_label), 1)),
      a.resource.state === "customized" ? (l(), O(e(Oe), {
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
}, Jt = /* @__PURE__ */ ae({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, create: m } = ye(), r = P(() => it(d.section));
    Z(r, (Y) => {
      Y === "message" && o.ensure("base");
    }, { immediate: !0 });
    const _ = w("all"), v = w(""), T = w("");
    let S;
    Z(v, (Y) => {
      clearTimeout(S), S = setTimeout(() => {
        T.value = Y.trim();
      }, 250);
    }), Z(() => d.section, () => {
      v.value = T.value = "", _.value = "all";
    });
    const c = he([]), y = w(), U = w(), h = w(!0), f = w(!1), k = w(!1), p = w(!1), g = w(""), $ = w(""), L = w(""), I = Ue(), N = () => ({ kind: r.value, state: _.value === "all" ? void 0 : _.value, q: T.value || void 0 });
    async function z(Y = !1) {
      const H = I();
      h.value = !0;
      try {
        const J = await se.page(N());
        if (!H()) return;
        c.value = J.items, y.value = J.next_cursor, U.value = J.total, g.value = $.value = L.value = "", p.value = !1, f.value = !0;
      } catch (J) {
        if (!H()) return;
        p.value = Fe(J);
        const de = p.value ? "" : oe(J, "The mail library could not be loaded.");
        Y && f.value && !p.value ? L.value = de : g.value = de;
      } finally {
        H() && (h.value = !1);
      }
    }
    async function Q() {
      if (h.value || !y.value || k.value) return;
      const Y = I();
      k.value = !0, $.value = "";
      try {
        const H = await se.page({ ...N(), cursor: y.value });
        if (!Y()) return;
        c.value = [...c.value, ...H.items], y.value = H.next_cursor, U.value = H.total;
      } catch (H) {
        Y() && ($.value = oe(H, "More resources could not be loaded."));
      } finally {
        k.value = !1;
      }
    }
    Z([r, _, T], () => {
      z();
    }), ta(() => z(f.value)), Ae("mail.library", () => {
      r.value === "message" && o.ensure("base"), z(f.value);
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
    }), ee = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], q = P(() => {
      const Y = r.value ? be[r.value].toLowerCase() : "resource", H = U.value ?? c.value.length;
      return c.value.length < H ? `${c.value.length} of ${ge(H, Y)}` : ge(H, Y);
    });
    function j(Y) {
      const H = Y.used_by;
      return Y.kind === "base" || Y.kind === "asset" ? H?.messages ? ge(H.messages, "message") : "—" : Y.kind === "message" ? H?.recent_sources ? ge(H.recent_sources, "recent sender") : "—" : "";
    }
    function C(Y) {
      return Y.base ? o.title("base", Y.base) : "";
    }
    function x(Y) {
      Y.kind === "asset" ? u({ name: "library", section: "assets", asset: Y.name }) : u({ name: "resource", kind: Y.kind, resource: Y.name, section: "content" });
    }
    const s = P(() => f.value && !g.value && r.value && !c.value.length && _.value === "all" && !T.value), R = w(!1);
    return (Y, H) => (l(), n(F, null, [
      i(sa, {
        title: le.value.title,
        description: le.value.description
      }, {
        actions: A(() => [
          !r.value || r.value === "message" ? (l(), O(e(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: H[0] || (H[0] = (J) => R.value = !0)
          }, {
            icon: A(() => [
              i(e(E), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          i(e(D), {
            label: r.value ? "New " + e(be)[r.value].toLowerCase() : "New",
            onClick: H[1] || (H[1] = (J) => e(m)({ kind: r.value }))
          }, {
            icon: A(() => [
              i(e(E), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      p.value ? (l(), n("p", It, [
        i(e(E), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        H[9] || (H[9] = W("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : g.value ? (l(), n("div", Nt, [
        t("span", null, b(g.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: H[2] || (H[2] = (J) => z())
        })
      ])) : V("", !0),
      L.value ? (l(), n("div", zt, [
        t("span", null, b(L.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: H[3] || (H[3] = (J) => z(!0))
        })
      ])) : h.value && !f.value ? (l(), n("p", Et, [
        i(e(E), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        H[10] || (H[10] = W("Loading mail library…", -1))
      ])) : s.value && r.value ? (l(), O($a, {
        key: 4,
        icon: e(pe)[r.value],
        title: "No " + e(ya)[r.value].toLowerCase() + " yet",
        hint: "Create a " + e(be)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + e(be)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: H[4] || (H[4] = (J) => e(m)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : f.value ? (l(), n(F, { key: 5 }, [
        t("div", Ot, [
          i(e(Ve), {
            modelValue: _.value,
            "onUpdate:modelValue": H[5] || (H[5] = (J) => _.value = J),
            options: ee,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          i(e(ha), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(E), {
                    icon: h.value ? "tabler:loader-2" : "tabler:search",
                    class: ue({ spin: h.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: v.value,
                "onUpdate:modelValue": H[6] || (H[6] = (J) => v.value = J),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + le.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Pt, b(q.value), 1)
        ]),
        c.value.length ? (l(), O(e(ga), {
          key: 1,
          value: c.value,
          "data-key": (J) => J.kind + "/" + J.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": le.value.title } },
          onRowClick: H[7] || (H[7] = (J) => x(J.data))
        }, {
          default: A(() => [
            i(e(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: J }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: J.title,
                  onClick: je((de) => x(J), ["stop"])
                }, null, 8, ["label", "onClick"]),
                J.description ? (l(), n("span", Dt, b(J.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            r.value ? V("", !0) : (l(), O(e(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: A(({ data: J }) => [
                t("span", Bt, [
                  i(e(E), {
                    icon: e(pe)[J.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  W(b(e(be)[J.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), O(e(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: A(({ data: J }) => [
                C(J) === void 0 ? (l(), O(e(Le), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(F, { key: 1 }, [
                  W(b(C(J)), 1)
                ], 64))
              ]),
              _: 1
            })) : V("", !0),
            i(e(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: J }) => [
                i(xa, { resource: J }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), O(e(ce), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: J }) => [
                W(b(j(J)), 1)
              ]),
              _: 1
            })) : V("", !0),
            i(e(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: J }) => [
                t("span", qt, b(J.state === "original" ? "—" : e(Pa)(J.updated_at)), 1)
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
            loading: k.value,
            disabled: h.value,
            onClick: Q
          }, null, 8, ["label", "loading", "disabled"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      i(Rt, {
        visible: R.value,
        onClose: H[8] || (H[8] = (J) => R.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function Wt(a) {
  return JSON.parse(JSON.stringify(a));
}
function _e(a) {
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
  return JSON.stringify(_e(a)) === JSON.stringify(_e(d));
}
function Yt(a, d, o, u, m) {
  const r = { type: "object", properties: {} };
  return a === "message" ? {
    kind: a,
    name: d,
    title: o,
    description: u,
    base: m,
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
  for (const [u, m] of Object.entries(a.schema.properties)) {
    const r = Gt(o[u] ?? m.default ?? (m.type === "string" ? "" : null));
    r !== void 0 && d.push(`${JSON.stringify(u)}, ${r}`);
  }
  return d.length ? `{{ include "/part/${a.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${a.name}" }}`;
}
function Ga(a) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) ? `{{ assets.${a} }}` : `{{ assets[${JSON.stringify(a)}] }}`;
}
function Qt(a, d, o) {
  const u = o ? ` width="${o}"` : "";
  return `<img src="${Ga(a)}" alt="${d.replace(/"/g, "&quot;")}"${u} style="display:block;border:0;max-width:100%;height:auto;">`;
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
}, ps = /* @__PURE__ */ ae({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, delivery: r } = ye();
    o.draft.kind !== "message" && m.use("message");
    const _ = { message: fe() }, v = w("email"), T = w("desktop"), S = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], c = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], y = P(() => m.ready("message") ? (o.messages ?? m.ofKind("message").map((C) => C.name)).map((C) => ({ value: C, label: m.title("message", C) ?? C })).sort((C, x) => C.label.localeCompare(x.label)) : []), U = w("");
    Z(y, (j) => {
      o.draft.kind !== "message" && (j.some((C) => C.value === U.value) || (U.value = j[0]?.value ?? ""));
    }, { immediate: !0 });
    const h = P(() => o.draft.kind !== "message" && U.value && U.value === y.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), f = P(() => o.draft.kind === "message" ? o.draft.name : U.value), k = he(), p = w(!1), g = w(), $ = w(""), L = Ue();
    let I, N = !1, z = !1;
    async function Q() {
      const j = f.value;
      if (!j) return;
      if (N) {
        z = !0;
        return;
      }
      N = !0;
      const C = L();
      p.value = !0;
      try {
        const x = await se.preview(j, [o.draft]);
        if (!C()) return;
        k.value = x, g.value = void 0, $.value = "";
      } catch (x) {
        if (!C()) return;
        const s = He(x);
        g.value = s ? { ...s, previewOf: j } : void 0, $.value = g.value ? "" : oe(x, "The preview could not be rendered.");
      } finally {
        N = !1, C() && (p.value = !1), z && (z = !1, Q());
      }
    }
    function le() {
      clearTimeout(I), I = setTimeout(() => {
        Q();
      }, 450);
    }
    Z(() => JSON.stringify(o.draft), le), Z(f, () => {
      k.value = void 0, Q();
    }, { immediate: !0 }), Z(g, (j) => u("problem", j)), la(() => clearTimeout(I));
    const ee = P(() => k.value?.html ? _a(k.value.html, k.value.inline_assets) : ""), q = P(() => {
      const j = r.value?.from;
      return j ? j.name ? `${j.name} <${j.address}>` : j.address : "";
    });
    return (j, C) => (l(), n("section", ls, [
      t("div", ts, [
        i(e(Ve), {
          modelValue: v.value,
          "onUpdate:modelValue": C[0] || (C[0] = (x) => v.value = x),
          options: S,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        v.value === "email" ? (l(), O(e(Ve), {
          key: 0,
          modelValue: T.value,
          "onUpdate:modelValue": C[1] || (C[1] = (x) => T.value = x),
          options: c,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: A(({ option: x }) => [
            i(e(E), {
              icon: x.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            W(b(x.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      a.draft.kind !== "message" ? (l(), n("div", ss, [
        t("label", {
          for: _.message
        }, "Preview with", 8, is),
        i(e(Pe), {
          modelValue: U.value,
          "onUpdate:modelValue": C[2] || (C[2] = (x) => U.value = x),
          "input-id": _.message,
          options: y.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !e(m).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        h.value ? (l(), n("small", ns, b(h.value), 1)) : V("", !0)
      ])) : V("", !0),
      p.value && k.value ? (l(), n("p", os, [
        i(e(E), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        C[3] || (C[3] = W("Updating the preview…", -1))
      ])) : V("", !0),
      k.value ? (l(), n("dl", rs, [
        q.value ? (l(), n(F, { key: 0 }, [
          C[4] || (C[4] = t("dt", null, "From", -1)),
          t("dd", null, b(q.value), 1)
        ], 64)) : V("", !0),
        C[5] || (C[5] = t("dt", null, "Subject", -1)),
        t("dd", null, b(k.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: ue(["mail-preview-body", ["mail-preview-" + T.value, { "mail-preview-stale": g.value || $.value }]]),
        "aria-busy": p.value
      }, [
        !k.value && p.value ? (l(), n("p", ds, [
          i(e(E), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          C[6] || (C[6] = W("Rendering preview…", -1))
        ])) : f.value ? k.value ? (l(), n(F, { key: 2 }, [
          v.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: ee.value,
            title: "Email preview: " + (k.value.subject ?? "")
          }, null, 8, vs)) : (l(), n("pre", ms, b(k.value.text), 1))
        ], 64)) : V("", !0) : (l(), n("p", cs, "Choose a message to see this " + b(a.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, us),
      (l(!0), n(F, null, me(k.value?.warnings ?? [], (x) => (l(), n("p", {
        key: x.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        i(e(E), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, b(e(Oa)(x)), 1)
      ]))), 128)),
      g.value ? (l(), n("p", fs, [
        i(e(E), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b(k.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : $.value ? (l(), n("p", bs, [
        i(e(E), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, b($.value), 1)
      ])) : (l(), n("p", ys, [
        i(e(E), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        W(" " + b(a.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
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
}, Us = /* @__PURE__ */ ae({
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
    const o = a, u = d, { library: m, go: r } = ye(), _ = w(""), v = fe();
    Z(() => o.visible, (y) => {
      y && (_.value = o.suggestedNote ?? "");
    }), Se(() => o.visible);
    const T = P(() => {
      const y = o.saved, U = o.draft, h = [];
      return (y.title !== U.title || y.description !== U.description) && h.push("Name and description"), y.base !== U.base && h.push(`Base template: ${m.title("base", U.base ?? "") ?? U.base}`), y.subject !== U.subject && h.push("Subject"), y.html !== U.html && h.push("HTML"), y.text !== U.text && h.push("Plain text"), (JSON.stringify(y.schema.properties) !== JSON.stringify(U.schema.properties) || JSON.stringify(y.schema.required ?? []) !== JSON.stringify(U.schema.required ?? [])) && h.push(U.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(y.samples) !== JSON.stringify(U.samples) && h.push("Sample values"), h;
    }), S = P(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${be[o.draft.kind].toLowerCase()} changes when you save.`), c = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (y, U) => (l(), O(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !a.busy,
      "close-on-escape": !a.busy,
      class: "mail-dialog",
      pt: c,
      "aria-label": "Review changes",
      "onUpdate:visible": U[3] || (U[3] = (h) => {
        h || u("close");
      })
    }, {
      header: A(() => [
        t("span", gs, [
          i(e(E), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", hs, [
          U[4] || (U[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", ks, b(a.draft.title), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: U[2] || (U[2] = (h) => u("close"))
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
          onSubmit: U[1] || (U[1] = je((h) => u("save", _.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            U[5] || (U[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", $s, [
              (l(!0), n(F, null, me(T.value, (h) => (l(), n("li", { key: h }, b(h), 1))), 128))
            ])
          ]),
          t("p", ws, b(S.value) + " The previous version stays in History.", 1),
          t("div", _s, [
            t("label", {
              class: "mail-field-label",
              for: e(v)
            }, "Note for History", 8, xs),
            i(e(ve), {
              id: e(v),
              modelValue: _.value,
              "onUpdate:modelValue": U[0] || (U[0] = (h) => _.value = h),
              placeholder: "What changed and why…",
              disabled: a.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          a.dependents ? (l(), n("div", Cs, [
            i(e(E), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Vs, [
              t("strong", null, b(a.dependents.names.length === 1 ? "1 message would break" : a.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, b(a.dependents.reason), 1),
              t("span", Ss, [
                (l(!0), n(F, null, me(a.dependents.names, (h) => (l(), O(e(D), {
                  key: h,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: e(m).title("message", h) ?? h,
                  onClick: (f) => {
                    u("close"), e(r)({ name: "resource", kind: "message", resource: h, section: "content" });
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
}), Za = /* @__PURE__ */ ae({
  __name: "Disclosure",
  props: /* @__PURE__ */ da({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(a) {
    const d = Ea(a, "open");
    return (o, u) => (l(), O(e(Ll), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = (m) => d.value = m === "content")
    }, {
      default: A(() => [
        i(e(zl), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: A(() => [
            i(e(Nl), { class: "kx-disclosure-toggle" }, {
              default: A(() => [
                W(b(a.label), 1)
              ]),
              _: 1
            }),
            i(e(Il), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: A(() => [
                Ee(o.$slots, "default")
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
}, js = { class: "kx-modal-head-icon" }, As = { class: "kx-modal-head-text" }, Ls = { class: "kx-modal-head-title" }, Is = { class: "mail-field" }, Ns = ["for"], zs = /* @__PURE__ */ ae({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(a, { expose: d, emit: o }) {
    const u = a, m = o, { library: r } = ye(), _ = w(), v = w("");
    function T(L) {
      v.value = "", r.ensure("part"), u.face === "html" && r.ensure("asset"), _.value?.toggle(L);
    }
    d({ toggle: T });
    const S = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], c = (L) => ({ label: L, disabled: !0, icon: "tabler:loader-2" });
    async function y(L) {
      v.value = "";
      try {
        m("insert", Zt(await se.get({ kind: "part", name: L })));
      } catch (I) {
        v.value = oe(I, "The part could not be read.");
      }
    }
    const U = w(), h = w(""), f = fe();
    Se(() => !!U.value);
    async function k(L, I) {
      v.value = "";
      try {
        const N = await se.get({ kind: "asset", name: L });
        U.value = { name: L, title: I, width: N.asset?.width }, h.value = I;
      } catch (N) {
        v.value = oe(N, "The image could not be read.");
      }
    }
    function p() {
      U.value && (m("insert", Qt(U.value.name, h.value, U.value.width)), U.value = void 0);
    }
    const g = P(() => {
      const L = Object.entries(u.draft.schema.properties).map(([z]) => ({
        label: z,
        icon: "tabler:variable",
        command: () => m("insert", u.draft.kind === "part" ? `{{ .${z} }}` : es(z))
      })), I = [{
        label: u.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...L, ...S.map((z) => ({
          label: z.label,
          icon: "tabler:world",
          command: () => m("insert", `{{ ${z.name} }}`)
        }))]
      }], N = r.ofKind("part").filter((z) => !(u.draft.kind === "part" && z.name === u.draft.name));
      if (I.push({ label: "Parts", items: r.ready("part") ? N.length ? N.map((z) => ({ label: z.title, icon: pe.part, command: () => {
        y(z.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [c("Loading parts…")] }), u.face === "html") {
        const z = r.ofKind("asset");
        I.push({ label: "Images", items: r.ready("asset") ? z.length ? z.map((Q) => ({ label: Q.title, icon: pe.asset, command: () => {
          k(Q.name, Q.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [c("Loading images…")] });
      }
      return u.draft.kind === "base" && I.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => m("insert", as)
      }] }), I;
    }), $ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (L, I) => (l(), n(F, null, [
      i(e(El), {
        ref_key: "menu",
        ref: _,
        model: g.value,
        popup: "",
        "aria-label": "Insert into " + (a.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: A(({ item: N, class: z }) => [
          N.icon ? (l(), O(e(E), {
            key: 0,
            icon: N.icon,
            class: ue(z),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : V("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      v.value ? (l(), n("p", Rs, b(v.value), 1)) : V("", !0),
      i(e(Ie), {
        visible: !!U.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: $,
        "aria-label": "Insert image",
        "onUpdate:visible": I[2] || (I[2] = (N) => {
          N || (U.value = void 0);
        })
      }, {
        header: A(() => [
          t("span", js, [
            i(e(E), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", As, [
            t("span", Ls, "Insert " + b(U.value?.title), 1),
            I[3] || (I[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: A(() => [
          i(e(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: I[1] || (I[1] = (N) => U.value = void 0)
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
            onSubmit: je(p, ["prevent"])
          }, [
            t("div", Is, [
              t("label", {
                class: "mail-field-label",
                for: e(f)
              }, "Alternative text", 8, Ns),
              i(e(ve), {
                id: e(f),
                modelValue: h.value,
                "onUpdate:modelValue": I[0] || (I[0] = (N) => h.value = N),
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
}, Qs = { class: "mail-face-bar" }, Xs = { class: "mail-code-frame mail-code-body" }, ei = /* @__PURE__ */ ae({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(a) {
    const d = ca(() => import("./CodeEditor-CIrhfC0V.js")), o = a, { library: u, go: m } = ye();
    u.use("base");
    const r = { base: fe(), title: fe(), description: fe(), face: fe() }, _ = w("html"), v = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], T = P(() => u.ofKind("base").map((k) => ({ value: k.name, label: k.title }))), S = P(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), c = w(), y = w();
    function U(k) {
      c.value?.insert(k);
    }
    const h = P(() => {
      const k = o.problem;
      if (k)
        return k.face === "html" || k.face === "text" || k.face === "subject" ? k.face : _.value;
    }), f = P(() => (o.draft.kind === "message" ? "Body" : "Source") + (_.value === "html" ? ", HTML" : ", plain text"));
    return (k, p) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      i(Za, { label: "Name and description" }, {
        default: A(() => [
          t("div", Os, [
            t("div", Ps, [
              t("label", {
                class: "mail-field-label",
                for: r.title
              }, "Name", 8, Ms),
              i(e(ve), {
                id: r.title,
                modelValue: a.draft.title,
                "onUpdate:modelValue": p[0] || (p[0] = (g) => a.draft.title = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Ds, [
              t("label", {
                class: "mail-field-label",
                for: r.description
              }, "Description", 8, Bs),
              i(e(ve), {
                id: r.description,
                modelValue: a.draft.description,
                "onUpdate:modelValue": p[1] || (p[1] = (g) => a.draft.description = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", qs, [
              p[9] || (p[9] = W("Reference ", -1)),
              t("span", Hs, b(a.draft.name), 1),
              W(", used to " + b(a.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
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
            i(e(Pe), {
              modelValue: a.draft.base,
              "onUpdate:modelValue": p[2] || (p[2] = (g) => a.draft.base = g),
              "input-id": r.base,
              options: T.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !e(u).ready("base")
            }, {
              value: A(({ value: g }) => [
                t("span", Ks, [
                  i(e(E), {
                    icon: e(pe).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  g && e(u).title("base", g) === void 0 ? (l(), O(e(Le), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    W(b(e(u).title("base", g)), 1)
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
              onClick: p[3] || (p[3] = (g) => e(m)({ name: "resource", kind: "base", resource: a.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: ue(["mail-field", { "mail-field-invalid": h.value === "subject" || S.value }])
        }, [
          t("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Ys),
          t("div", Gs, [
            i(e(d), {
              modelValue: a.draft.subject,
              "onUpdate:modelValue": p[4] || (p[4] = (g) => a.draft.subject = g),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          S.value ? (l(), n("small", Zs, "A subject is one line. Remove the line break.")) : a.problem && h.value === "subject" ? (l(), O(fa, {
            key: 1,
            problem: a.problem,
            draft: a.draft
          }, null, 8, ["problem", "draft"])) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: ue(["mail-field", { "mail-field-invalid": a.problem && h.value !== "subject" }])
      }, [
        t("div", Qs, [
          i(e(Ve), {
            modelValue: _.value,
            "onUpdate:modelValue": p[5] || (p[5] = (g) => _.value = g),
            options: v,
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
            onClick: p[6] || (p[6] = (g) => y.value?.toggle(g))
          }, {
            icon: A(() => [
              i(e(E), {
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
            "onUpdate:modelValue": p[7] || (p[7] = (g) => a.draft.html = g),
            label: f.value
          }, null, 8, ["modelValue", "label"])) : (l(), O(e(d), {
            ref_key: "editor",
            ref: c,
            key: "text",
            modelValue: a.draft.text,
            "onUpdate:modelValue": p[8] || (p[8] = (g) => a.draft.text = g),
            label: f.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        a.problem && h.value !== "subject" ? (l(), O(fa, {
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
        onInsert: U
      }, null, 8, ["draft", "face"])
    ], 8, Es));
  }
}), ai = { class: "mail-value-field" }, li = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, za = /* @__PURE__ */ ae({
  __name: "ValueField",
  props: /* @__PURE__ */ da({
    type: {},
    itemType: {},
    label: {},
    disabled: { type: Boolean }
  }, {
    modelValue: { type: [null, Boolean, Number, String, Array, Object] },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ da(["invalid"], ["update:modelValue"]),
  setup(a, { emit: d }) {
    const o = a, u = Ea(a, "modelValue"), m = d, r = (g) => g === null || ["string", "number", "boolean"].includes(typeof g), _ = (g) => g === void 0 || Array.isArray(g) && g.every(r), v = (g) => g === void 0 || !!g && typeof g == "object" && !Array.isArray(g) && Object.values(g).every(($) => typeof $ == "string"), T = w(!1);
    Z(() => o.type, () => {
      T.value = !1;
    });
    const S = P(() => T.value ? "written" : o.type === "array" ? _(u.value) ? "list" : "written" : o.type === "object" ? v(u.value) ? "record" : "written" : o.type), c = P({
      get: () => Array.isArray(u.value) ? u.value.map((g) => g === null ? "" : String(g)).join(`
`) : "",
      set: (g) => {
        const $ = g.split(`
`).map((I) => I.trim()).filter(Boolean), L = o.itemType === "number" || o.itemType === "integer";
        u.value = $.length ? $.map((I) => L && I !== "" && !Number.isNaN(Number(I)) ? Number(I) : I) : void 0;
      }
    }), y = w([]);
    Z(u, (g) => {
      if (S.value !== "record") return;
      const $ = g ?? {};
      JSON.stringify(Object.fromEntries(y.value.filter((L) => L.key).map((L) => [L.key, L.value]))) !== JSON.stringify($) && (y.value = Object.entries($).map(([L, I]) => ({ key: L, value: I })));
    }, { immediate: !0 });
    function U() {
      const g = y.value.filter(($) => $.key.trim());
      u.value = g.length ? Object.fromEntries(g.map(($) => [$.key.trim(), $.value])) : void 0;
    }
    const h = w(""), f = w("");
    Z([u, S], () => {
      S.value === "written" && !f.value && (h.value = u.value === void 0 ? "" : JSON.stringify(u.value, null, 2));
    }, { immediate: !0 });
    function k(g) {
      if (h.value = g, !g.trim()) {
        f.value = "", u.value = void 0;
        return;
      }
      try {
        const $ = JSON.parse(g), L = o.type === "array" ? Array.isArray($) : !!$ && typeof $ == "object" && !Array.isArray($);
        f.value = L ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', L && (u.value = $);
      } catch {
        f.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    Z(f, (g) => m("invalid", g), { immediate: !0 });
    const p = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (g, $) => (l(), n("div", ai, [
      S.value === "string" ? (l(), O(e(ve), {
        key: 0,
        "model-value": typeof u.value == "string" ? u.value : "",
        "aria-label": a.label,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": $[0] || ($[0] = (L) => u.value = L || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : S.value === "number" || S.value === "integer" ? (l(), O(e(Pl), {
        key: 1,
        "model-value": typeof u.value == "number" ? u.value : null,
        "aria-label": a.label,
        "max-fraction-digits": S.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": $[1] || ($[1] = (L) => u.value = L ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : S.value === "boolean" ? (l(), O(e(Ve), {
        key: 2,
        "model-value": typeof u.value == "boolean" ? u.value : null,
        options: p,
        "option-label": "label",
        "option-value": "value",
        "aria-label": a.label,
        disabled: a.disabled,
        "onUpdate:modelValue": $[2] || ($[2] = (L) => u.value = typeof L == "boolean" ? L : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : S.value === "list" ? (l(), O(e(va), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": $[3] || ($[3] = (L) => c.value = L),
        "aria-label": a.label,
        rows: "3",
        "auto-resize": "",
        disabled: a.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : S.value === "record" ? (l(), n(F, { key: 4 }, [
        (l(!0), n(F, null, me(y.value, (L, I) => (l(), n("div", {
          key: I,
          class: "mail-value-entry"
        }, [
          i(e(ve), {
            modelValue: L.key,
            "onUpdate:modelValue": [(N) => L.key = N, U],
            "aria-label": a.label + ", name " + (I + 1),
            placeholder: "Name",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(e(ve), {
            modelValue: L.value,
            "onUpdate:modelValue": [(N) => L.value = N, U],
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
              y.value.splice(I, 1), U();
            }
          }, {
            icon: A(() => [
              i(e(E), {
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
            i(e(E), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(F, { key: 5 }, [
        i(e(va), {
          "model-value": h.value,
          "aria-label": a.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!f.value,
          disabled: a.disabled,
          fluid: "",
          "onUpdate:modelValue": k
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        f.value ? (l(), n("small", li, b(f.value), 1)) : V("", !0)
      ], 64)),
      (a.type === "array" || a.type === "object") && S.value !== "written" ? (l(), O(e(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: a.disabled,
        onClick: $[5] || ($[5] = (L) => T.value = !0)
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
}, hi = /* @__PURE__ */ ae({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(a, { emit: d }) {
    const o = a, u = d, m = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let r = 0;
    function _(f) {
      const k = new Set(f.schema.required ?? []);
      return Object.entries(f.schema.properties).map(([p, g]) => {
        const $ = g.items;
        return {
          id: r++,
          name: p,
          schema: g,
          title: typeof g.title == "string" ? g.title : "",
          type: m.some((L) => L.value === g.type) ? g.type : "string",
          itemType: typeof $?.type == "string" ? $.type : void 0,
          required: k.has(p),
          description: typeof g.description == "string" ? g.description : "",
          sample: f.samples[p],
          fallback: g.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const v = w([]);
    v.value = _(o.draft), Z(() => o.draft, (f) => {
      v.value = _(f);
    });
    function T(f, k) {
      if (k === void 0) return !0;
      switch (f.type) {
        case "string":
          return typeof k == "string";
        case "number":
          return typeof k == "number";
        case "integer":
          return typeof k == "number" && Number.isInteger(k);
        case "boolean":
          return typeof k == "boolean";
        case "array":
          return Array.isArray(k);
        default:
          return !!k && typeof k == "object" && !Array.isArray(k);
      }
    }
    function S(f, k) {
      f.type = k, T(f, f.sample) || (f.sample = void 0), T(f, f.fallback) || (f.fallback = void 0);
    }
    const c = P(() => v.value.map((f) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(f.name) ? v.value.some((k) => k !== f && k.name === f.name) ? "Another one has this name." : f.valueErrors.sample || f.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    Z(c, (f) => u("invalid", f.some(Boolean)), { immediate: !0 }), Z(v, (f) => {
      if (c.value.some(Boolean)) return;
      const k = {}, p = {};
      for (const $ of f) {
        const L = { ...$.schema, type: $.type };
        for (const [I, N] of [["title", $.title], ["description", $.description]])
          N ? L[I] = N : delete L[I];
        $.fallback !== void 0 ? L.default = $.fallback : delete L.default, k[$.name] = L, $.sample !== void 0 && (p[$.name] = $.sample);
      }
      const g = f.filter(($) => $.required).map(($) => $.name);
      o.draft.schema = { ...o.draft.schema, properties: k, required: g.length ? g : void 0 }, o.draft.samples = p;
    }, { deep: !0 });
    function y() {
      let f = v.value.length + 1;
      for (; v.value.some((k) => k.name === `value_${f}`); ) f++;
      v.value.push({
        id: r++,
        name: `value_${f}`,
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
    const U = P(() => o.draft.kind === "part"), h = P(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${vt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (f, k) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      t("legend", si, b(a.label), 1),
      h.value ? (l(), n("p", ii, b(h.value), 1)) : V("", !0),
      v.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": a.label
      }, [
        (l(!0), n(F, null, me(v.value, (p, g) => (l(), n("li", {
          key: p.id,
          class: ue(["mail-variable-card", { "mail-variable-invalid": c.value[g] }])
        }, [
          t("div", ri, [
            t("label", ui, [
              k[0] || (k[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              i(e(ve), {
                modelValue: p.name,
                "onUpdate:modelValue": ($) => p.name = $,
                class: "mail-mono-input",
                invalid: !!c.value[g] && !p.valueErrors.sample && !p.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", di, [
              k[1] || (k[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              i(e(ve), {
                modelValue: p.title,
                "onUpdate:modelValue": ($) => p.title = $,
                placeholder: p.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", ci, [
              t("span", {
                id: "type-" + p.id,
                class: "mail-field-label"
              }, "Type", 8, vi),
              i(e(Pe), {
                "model-value": p.type,
                options: m,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + p.id,
                "onUpdate:modelValue": ($) => S(p, $)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", mi, [
              i(e(Ol), {
                modelValue: p.required,
                "onUpdate:modelValue": ($) => p.required = $,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              k[2] || (k[2] = t("span", null, "Required", -1))
            ]),
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + p.name,
              title: "Remove " + p.name,
              onClick: ($) => v.value.splice(g, 1)
            }, {
              icon: A(() => [
                i(e(E), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", fi, [
            k[3] || (k[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            i(e(ve), {
              modelValue: p.description,
              "onUpdate:modelValue": ($) => p.description = $,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", bi, [
            U.value ? (l(), n("div", yi, [
              k[4] || (k[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              i(za, {
                modelValue: p.fallback,
                "onUpdate:modelValue": ($) => p.fallback = $,
                type: p.type,
                "item-type": p.itemType,
                label: "Default of " + p.name,
                onInvalid: ($) => p.valueErrors.fallback = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : V("", !0),
            t("div", pi, [
              k[5] || (k[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              i(za, {
                modelValue: p.sample,
                "onUpdate:modelValue": ($) => p.sample = $,
                type: p.type,
                "item-type": p.itemType,
                label: "Sample value of " + p.name,
                onInvalid: ($) => p.valueErrors.sample = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          c.value[g] ? (l(), n("small", gi, b(p.name) + ": " + b(c.value[g]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, oi)) : (l(), n("p", ni, b(a.draft.title) + " takes no " + b(a.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        i(e(D), {
          label: U.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: y
        }, {
          icon: A(() => [
            i(e(E), {
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
}, Ri = /* @__PURE__ */ ae({
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
    const o = ca(() => import("./CodeEditor-CIrhfC0V.js")), u = ca(() => import("./DiffView-CjA70e3n.js")), m = a, r = d;
    Se(() => !!m.revision);
    const _ = w("version"), v = w("html");
    Z(() => m.revision, (k) => {
      k && (_.value = m.compare ? "compare" : "version", v.value = "html");
    });
    const T = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], S = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], c = P(() => m.revision?.revision === m.current.revision), y = P(() => {
      const k = m.revision;
      return k ? m.included || k.state === "original" && k.action === "reset" ? `${m.current.title}: the version included with ${m.current.origin_label}` : `${m.current.title}, version ${k.version}` : "";
    }), U = P(() => m.revision ? v.value === "html" ? m.revision.content.html : m.revision.content.text : ""), h = P(() => v.value === "html" ? m.current.html : m.current.text), f = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (k, p) => (l(), O(e(Ie), {
      visible: !!a.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: f,
      "aria-label": y.value,
      closable: !1,
      "close-on-escape": !a.busy,
      "onUpdate:visible": p[5] || (p[5] = (g) => {
        g || r("close");
      })
    }, {
      header: A(() => [
        t("span", ki, [
          i(e(E), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        a.revision ? (l(), n("span", $i, [
          t("span", wi, b(y.value), 1),
          a.included ? (l(), n("span", _i, "Compare it with your customized version, or reset to it.")) : (l(), n("span", xi, b(e(pa)[a.revision.action]) + " by " + b(e(Ce)(a.revision.author_label, a.revision.author)) + " · " + b(e(Je)(a.revision.created_at)), 1))
        ])) : V("", !0)
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: p[2] || (p[2] = (g) => r("close"))
        }, null, 8, ["disabled"]),
        a.revision && a.included ? (l(), O(e(D), {
          key: 0,
          label: "Reset to original",
          loading: a.busy,
          onClick: p[3] || (p[3] = (g) => r("reset"))
        }, {
          icon: A(() => [
            i(e(E), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : a.revision && !c.value ? (l(), O(e(D), {
          key: 1,
          label: "Restore this version",
          loading: a.busy,
          onClick: p[4] || (p[4] = (g) => r("restore", a.revision))
        }, {
          icon: A(() => [
            i(e(E), {
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
            c.value ? V("", !0) : (l(), O(e(Ve), {
              key: 0,
              modelValue: _.value,
              "onUpdate:modelValue": p[0] || (p[0] = (g) => _.value = g),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            i(e(Ve), {
              modelValue: v.value,
              "onUpdate:modelValue": p[1] || (p[1] = (g) => v.value = g),
              options: S,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          a.revision.content.subject !== void 0 && _.value === "version" ? (l(), n("p", Si, [
            p[6] || (p[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            p[7] || (p[7] = W()),
            t("span", Ti, b(a.revision.content.subject), 1)
          ])) : V("", !0),
          _.value === "version" ? (l(), n("div", Ui, [
            (l(), O(e(o), {
              key: v.value,
              "model-value": U.value,
              label: y.value + (v.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), O(e(u), {
            key: "diff-" + v.value,
            before: U.value,
            after: h.value,
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
}, Mi = { class: "mail-history-actions" }, Di = /* @__PURE__ */ ae({
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
      i(e(E), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = W("Loading history…", -1))
    ])) : a.revisions.length ? (l(), n("ol", Ii, [
      (l(!0), n(F, null, me(a.revisions, (u) => (l(), n("li", {
        key: u.revision,
        class: "mail-history-row"
      }, [
        t("div", Ni, [
          t("div", zi, [
            t("span", Ei, [
              W(" Version " + b(u.version) + " · " + b(e(pa)[u.action]) + b(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.revision === a.resource.revision ? (l(), O(e(Oe), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Oi, b(e(Ce)(u.author_label, u.author)) + " · " + b(e(Je)(u.created_at)), 1),
            u.note ? (l(), n("span", Pi, b(u.note), 1)) : V("", !0)
          ]),
          t("div", Mi, [
            i(e(D), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (m) => d.$emit("show", u)
            }, {
              icon: A(() => [
                i(e(E), {
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
              onClick: (m) => d.$emit("restore", u)
            }, {
              icon: A(() => [
                i(e(E), {
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
}, Qa = /* @__PURE__ */ ae({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a;
    Se(() => !!o.refusal);
    const u = d, m = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(_) {
      u("close"), _();
    }
    return (_, v) => (l(), O(e(Ie), {
      visible: !!a.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: m,
      role: "alertdialog",
      "aria-label": a.refusal?.header,
      "onUpdate:visible": v[1] || (v[1] = (T) => {
        T || u("close");
      })
    }, {
      header: A(() => [
        t("span", Bi, [
          i(e(E), {
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
          onClick: v[0] || (v[0] = (T) => u("close"))
        })
      ]),
      default: A(() => [
        t("p", Fi, b(a.refusal?.message), 1),
        a.refusal?.links.length ? (l(), n("ul", Ji, [
          (l(!0), n(F, null, me(a.refusal.links, (T) => (l(), n("li", {
            key: T.label
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (S) => r(T.open)
            }, {
              default: A(() => [
                i(e(E), {
                  icon: T.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, b(T.label), 1)
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
}, sn = { class: "mail-muted" }, nn = /* @__PURE__ */ ae({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, capabilities: m } = ye(), r = P(() => (d.resource.used_by?.messages ?? []).map((v) => ({
      name: v,
      title: o.title("message", v)
    }))), _ = P(() => d.resource.used_by?.recent_senders ?? []);
    return (v, T) => (l(), n("div", Wi, [
      a.resource.kind === "base" || a.resource.kind === "asset" ? (l(), n("section", Ki, [
        T[1] || (T[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", Gi, [
          (l(!0), n(F, null, me(r.value, (S) => (l(), n("li", {
            key: S.name
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (c) => e(u)({ name: "resource", kind: "message", resource: S.name, section: "content" })
            }, {
              default: A(() => [
                i(e(E), {
                  icon: e(pe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                S.title === void 0 ? (l(), O(e(Le), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", Zi, b(S.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Yi, "No messages " + b(a.resource.kind === "asset" ? "show" : "use") + " " + b(a.resource.title) + ".", 1))
      ])) : a.resource.kind === "message" ? (l(), n("section", Qi, [
        t("div", Xi, [
          T[2] || (T[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          e(m)?.administer_delivery ? (l(), O(e(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: T[0] || (T[0] = (S) => e(u)({ name: "activity", template: a.resource.name }))
          })) : V("", !0)
        ]),
        _.value.length ? (l(), n("ul", an, [
          (l(!0), n(F, null, me(_.value, (S) => (l(), n("li", {
            key: S.sender + (S.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            i(e(E), {
              icon: S.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", ln, [
              t("span", null, b(e(Ce)(S.sender_label, S.sender)), 1),
              S.origin ? (l(), n("span", tn, b(e(ia)(S.origin)), 1)) : V("", !0)
            ]),
            t("span", sn, b(e(ge)(S.count, "message")), 1)
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
}, pn = { class: "mail-customized-text" }, gn = { class: "mail-editor-layout" }, hn = /* @__PURE__ */ ae({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(a) {
    const d = a, { library: o, capabilities: u, delivery: m, go: r, create: _, setDirty: v, setTitle: T } = ye(), S = P(() => ({ kind: d.kind, name: d.name })), c = he(), y = w(), U = w(!0), h = w(!1), f = w(!1), k = w(""), p = w(), g = Ue(), $ = P(() => !!y.value && !!c.value && !Kt(y.value, c.value));
    Z($, (B) => v(B), { immediate: !0 }), la(() => v(!1));
    async function L(B = {}) {
      const M = g();
      try {
        const K = await se.get(S.value);
        if (!M()) return;
        const ne = B.keepDraft && $.value;
        if (ne && c.value && K.revision !== c.value.revision) {
          p.value = { revision: K.revision, by: Ce(K.author_label, K.author) || "Someone" };
          return;
        }
        c.value = K, ne || (y.value = _e(K), I.value = void 0), T(K.title), p.value = void 0, h.value = f.value = !1, k.value = "";
      } catch (K) {
        if (!M()) return;
        h.value = ea(K), f.value = Fe(K), k.value = h.value || f.value ? "" : oe(K, "This resource could not be loaded."), h.value && (c.value = void 0, y.value = void 0);
      } finally {
        M() && (U.value = !1);
      }
    }
    const I = w(), N = he([]), z = w(!1), Q = w(""), le = Ue();
    async function ee() {
      const B = le();
      z.value = !0;
      try {
        const M = await se.history(S.value);
        if (!B()) return;
        N.value = M, Q.value = "";
      } catch (M) {
        if (!B()) return;
        Q.value = ea(M) ? "" : oe(M, "History could not be loaded.");
      } finally {
        B() && (z.value = !1);
      }
    }
    async function q() {
      await Promise.all([L({ keepDraft: !0 }), ee()]);
    }
    ta(q), Ae("mail.library", () => {
      q();
    });
    const j = w(), C = w(""), x = w(!1), s = w(""), R = w(), Y = P(() => c.value?.title ?? d.name), H = P(() => {
      const B = c.value, M = Y.value, K = B?.used_by?.messages?.length ?? 0, ne = B?.used_by?.recent_senders?.find((ra) => ra.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ne?.origin ? ` Sent recently by “${ia(ne.origin)}”.` : "") },
          base: { title: "Layout", description: K ? `The frame around the ${ge(K, "message")} that ${K === 1 ? "uses" : "use"} ${M}.` : `The frame around messages that use ${M}.` },
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
      return B?.state !== "customized" ? "" : `Customized by ${Ce(B.author_label, B.author)} ${kl(B.updated_at)} from the version included with ${B.origin_label}.`;
    }), de = P(() => {
      const B = c.value;
      if (!B?.original) return;
      const { kind: M, name: K, title: ne, description: re } = B;
      return {
        kind: M,
        name: K,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: M, name: K, title: ne, description: re, ...B.original }
      };
    }), ie = w(), $e = w(), te = w(!1), X = P(() => $e.value ?? ie.value);
    Z(() => JSON.stringify(y.value), () => {
      $e.value = void 0;
    });
    const G = P(() => d.kind === "message" && /[\r\n]/.test(y.value?.subject ?? "")), we = P(() => !!X.value || te.value || !!p.value || G.value), Ca = P(() => p.value ? "Discard your changes to load the newer version first." : te.value ? "Fix the variables first." : G.value ? "Put the subject on one line first." : X.value ? "Fix the error first." : ""), Va = w(!1);
    function na(B, M) {
      Va.value = ["invalid_config", "from_name_invalid"].includes(xe(B) ?? ""), x.value = ["mail_revision_conflict", "mail_preview_stale"].includes(xe(B) ?? ""), x.value && q(), C.value = oe(B, M);
    }
    function Sa() {
      if (!c.value) return;
      const B = !!p.value;
      y.value = _e(c.value), p.value = void 0, $e.value = void 0, I.value = void 0, B && L();
    }
    const Ne = w(!1), We = w(""), Ke = w();
    function al() {
      We.value = "", Ke.value = void 0, Ne.value = !0;
    }
    async function ll(B) {
      const M = c.value, K = y.value;
      if (!(!M || !K || j.value !== void 0)) {
        j.value = "save", We.value = C.value = s.value = "", Ke.value = void 0;
        try {
          const ne = I.value, re = ne && JSON.stringify(K) === JSON.stringify({ ..._e(ne.content), kind: M.kind, name: M.name }), ke = re ? await se.restore(S.value, ne.revision, M.revision, B || void 0) : await se.update(K, M.revision, B || void 0);
          c.value = { ...M, ...ke }, y.value = _e(c.value), Ne.value = !1, s.value = re ? `Version ${ne.version} from ${Je(ne.created_at)} is now in effect.` : `Saved ${ke.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, I.value = void 0, await q();
        } catch (ne) {
          const re = He(ne), ke = re?.resource?.kind === K.kind && re.resource.name === K.name;
          re?.dependents?.length && !ke ? Ke.value = { names: re.dependents, reason: re.reasons?.[0]?.message ?? re.message } : re ? ($e.value = re, Ne.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes(xe(ne) ?? "") ? (Ne.value = !1, await L({ keepDraft: !0 })) : We.value = oe(ne, `${K.title} could not be saved.`);
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
          await se.sendTest(B.name), s.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (M) {
          na(M, "The test could not be sent.");
        } finally {
          j.value = void 0;
        }
      }
    }
    const Ye = P(() => $.value ? "Save your changes to send a test." : u.value?.send ? m.value && !m.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Ta() {
      const B = c.value;
      if (!(!B || j.value !== void 0 || !await Te.confirm({
        header: `Reset ${B.title} to the original?`,
        message: `Your changes are replaced by the version included with ${B.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        j.value = "reset", C.value = s.value = "", x.value = !1;
        try {
          c.value = await se.reset(S.value, B.revision), y.value = _e(c.value), s.value = `${B.title} is back to the original. Your changes are in History.`, await q();
        } catch (K) {
          na(K, `${B.title} could not be reset.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    const Me = w(), Ua = w(!1), Ra = w(!1);
    function ja(B, M = !1, K = !1) {
      Ua.value = M, Ra.value = K, Me.value = B;
    }
    async function Aa(B) {
      const M = c.value;
      if (!M || j.value !== void 0 || $.value && !await Te.confirm({
        header: `Replace your unsaved changes with version ${B.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      y.value = { ..._e(B.content), kind: M.kind, name: M.name }, I.value = B, Me.value = void 0, C.value = "";
      const K = `Version ${B.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? s.value = K : (oa = K, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function La(B, M, K) {
      const ne = M.map((ke) => o.title("message", ke) ?? ke), re = B.kind === "base" ? "use" : "include";
      R.value = {
        header: `${B.title} is in use`,
        message: `${ge(M.length, "message")} ${M.length === 1 ? re + "s" : re} it: ${ne.join(", ")}. Remove it from ${M.length === 1 ? "that message" : "them"} first.`,
        links: M.map((ke, ra) => ({ label: ne[ra], open: () => r({ name: "resource", kind: "message", resource: ke, section: "content" }) }))
      };
    }
    async function sl() {
      const B = c.value;
      if (!B || B.state !== "created" || j.value !== void 0) return;
      const M = B.used_by?.messages ?? [];
      if (B.kind === "base" && M.length) {
        La(B, M);
        return;
      }
      if (await Te.confirm({
        header: `Delete ${B.title}?`,
        message: B.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${be[B.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        j.value = "delete", C.value = s.value = "";
        try {
          await se.remove(S.value, B.revision), v(!1), r({ name: "library", section: ma(d.kind) });
        } catch (ne) {
          const re = He(ne);
          re?.dependents?.length ? La(B, re.dependents) : na(ne, `${B.title} could not be deleted.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    function il() {
      const B = c.value;
      B && _({ kind: d.kind, from: { kind: B.kind, name: B.name } });
    }
    const nl = P(() => d.kind === "base" ? c.value?.used_by?.messages : void 0), Ge = P(() => j.value === "save");
    L(), Z(() => d.section, (B) => {
      B === "history" && !N.value.length && ee();
    }, { immediate: !0 });
    let oa = "";
    return Z(() => d.section, () => {
      s.value = oa, oa = "", C.value = "";
    }), (B, M) => (l(), n(F, null, [
      h.value ? (l(), O($a, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + e(ya)[a.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: M[0] || (M[0] = (K) => e(r)({ name: "library", section: e(ma)(a.kind) }))
      }, null, 8, ["cta"])) : f.value ? (l(), n("p", on, [
        i(e(E), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[11] || (M[11] = W("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(F, { key: 2 }, [
        i(sa, {
          title: H.value.title,
          description: H.value.description
        }, ba({ _: 2 }, [
          c.value ? {
            name: "actions",
            fn: A(() => [
              $.value ? (l(), O($l, {
                key: 0,
                busy: Ge.value,
                "review-disabled": we.value,
                onDiscard: Sa,
                onReview: al
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(F, { key: 1 }, [
                a.kind === "message" ? (l(), O(e(D), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: j.value === "test",
                  disabled: !!Ye.value || j.value !== void 0,
                  title: Ye.value || void 0,
                  onClick: tl
                }, {
                  icon: A(() => [
                    i(e(E), {
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
                    i(e(E), {
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
                    i(e(E), {
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
        k.value ? (l(), n("div", rn, [
          t("span", null, b(k.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[1] || (M[1] = (K) => q())
          })
        ])) : U.value ? (l(), n("p", un, [
          i(e(E), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          W("Loading " + b(Y.value) + "…", 1)
        ])) : V("", !0),
        c.value && y.value ? (l(), n(F, { key: 2 }, [
          p.value ? (l(), n("p", dn, [
            i(e(E), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              W(b(p.value.by) + " saved " + b(c.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              i(e(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Sa
              })
            ])
          ])) : V("", !0),
          $.value && Ca.value && !p.value ? (l(), n("p", cn, b(Ca.value), 1)) : a.kind === "message" && !$.value && Ye.value ? (l(), n("p", vn, [
            W(b(Ye.value) + " ", 1),
            e(u)?.administer_delivery && e(m) && !e(m).configured ? (l(), O(e(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: M[2] || (M[2] = (K) => e(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          C.value && x.value ? (l(), n("p", mn, [
            i(e(E), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            W(b(C.value), 1)
          ])) : C.value ? (l(), n("p", fn, [
            t("span", null, b(C.value), 1),
            Va.value && e(u)?.administer_delivery ? (l(), O(e(D), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[3] || (M[3] = (K) => e(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          s.value ? (l(), n("p", bn, [
            i(e(E), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            W(b(s.value), 1)
          ])) : V("", !0),
          J.value && a.section === "content" ? (l(), n("div", yn, [
            i(e(E), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", pn, [
              W(b(J.value), 1),
              $.value ? (l(), n(F, { key: 0 }, [
                W(" Save or discard your changes to reset it.")
              ], 64)) : V("", !0)
            ]),
            de.value ? (l(), O(e(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[4] || (M[4] = (K) => ja(de.value, !0, !0))
            }, {
              icon: A(() => [
                i(e(E), {
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
              onClick: Ta
            }, {
              icon: A(() => [
                i(e(E), {
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
              problem: X.value,
              disabled: Ge.value
            }, null, 8, ["draft", "problem", "disabled"]),
            i(ps, {
              draft: y.value,
              messages: nl.value,
              onProblem: M[5] || (M[5] = (K) => ie.value = K)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [fl, a.section === "content"]
          ]),
          a.section === "variables" ? (l(), O(hi, {
            key: 7,
            draft: y.value,
            label: H.value.title,
            problem: X.value,
            disabled: Ge.value,
            onInvalid: M[6] || (M[6] = (K) => te.value = K)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : a.section === "used-by" ? (l(), O(nn, {
            key: 8,
            resource: c.value
          }, null, 8, ["resource"])) : a.section === "history" ? (l(), O(Di, {
            key: 9,
            resource: c.value,
            revisions: N.value,
            loading: z.value,
            error: Q.value,
            busy: typeof j.value == "number" ? j.value : j.value ? -1 : void 0,
            onShow: ja,
            onRestore: Aa,
            onRetry: ee
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      c.value && y.value ? (l(), O(Us, {
        key: 3,
        visible: Ne.value,
        saved: e(_e)(c.value),
        draft: y.value,
        busy: Ge.value,
        error: We.value,
        dependents: Ke.value,
        "suggested-note": I.value ? `Restore version ${I.value.version}` : void 0,
        onClose: M[7] || (M[7] = (K) => Ne.value = !1),
        onSave: ll
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : V("", !0),
      c.value ? (l(), O(Ri, {
        key: 4,
        revision: Me.value,
        current: c.value,
        compare: Ua.value,
        included: Ra.value,
        busy: typeof j.value == "number" || j.value === "reset",
        onClose: M[8] || (M[8] = (K) => Me.value = void 0),
        onRestore: Aa,
        onReset: M[9] || (M[9] = (K) => {
          Me.value = void 0, Ta();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : V("", !0),
      i(Qa, {
        refusal: R.value,
        onClose: M[10] || (M[10] = (K) => R.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ze = /* @__PURE__ */ new Map();
function kn(a, d) {
  const o = Ze.get(a);
  if (o && o.revision >= d) return o.url;
  const u = Promise.resolve(Ul.get(`/api/v1/mail/library/asset/${encodeURIComponent(a)}/content`, { responseType: "blob" })).then((m) => m.data instanceof Blob ? URL.createObjectURL(m.data) : void 0, () => {
    Ze.get(a)?.url === u && Ze.delete(a);
  });
  return Ze.set(a, { revision: d, url: u }), o && o.url.then((m) => {
    m && URL.revokeObjectURL(m);
  }), u;
}
const $n = ["src", "alt"], wn = {
  key: 0,
  "aria-hidden": "true"
}, Xa = /* @__PURE__ */ ae({
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
    Z(() => [d.name, d.revision], async ([m, r]) => {
      o.value = void 0, o.value = await kn(m, r);
    }, { immediate: !0 });
    const u = P(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (m, r) => (l(), n("span", {
      class: ue(["mail-asset-tile", { "mail-asset-tile-large": a.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: a.alt ?? ""
      }, null, 8, $n)) : (l(), n(F, { key: 1 }, [
        i(e(E), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        u.value ? (l(), n("span", wn, b(u.value), 1)) : V("", !0)
      ], 64))
    ], 2));
  }
});
function Be(a) {
  return !!a && typeof a == "object" && !Array.isArray(a);
}
function _n(a, d) {
  return a;
}
function xn(a, d, o) {
  if (d !== void 0 && !d) return null;
  const u = Be(a) ? a : {}, m = [
    u,
    Be(u.data) ? u.data : null,
    Be(u.payload) ? u.payload : null,
    Be(u.detail) ? u.detail : null
  ].filter(Boolean);
  for (const r of m) {
    if (r.event !== "component.meta.changed" && r.event !== "component.deleting" && r.event !== "component.deleted") continue;
    const _ = String(r.component_id || ""), v = String(u.topic || r.topic || "");
    if (d === void 0) {
      if (!_ && (!v.startsWith("component.") || v === "component.")) continue;
    } else if (_ && _ !== d || !_ && v !== `component.${d}`) continue;
    const T = _ || d || v.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: T, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: T } : {
      event: "component.meta.changed",
      component_id: T,
      meta: _n(Be(r.meta) ? r.meta : {}),
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
  const u = Rl(`component.${a}`, (m) => {
    const r = Cn(m, a);
    r && d(r);
  });
  return typeof u == "function" ? u : null;
}
class Qe extends Error {
}
function Sn(a, d) {
  return new Promise((o, u) => {
    let m = null, r = !1, _ = !1, v = !1;
    const T = (c) => {
      v || (v = !0, m?.(), c ? u(c) : o());
    };
    async function S() {
      if (!v) {
        if (d.cancelled) {
          T(new Qe("cancelled"));
          return;
        }
        if (r) {
          _ = !0;
          return;
        }
        r = !0;
        try {
          const c = await Ma.state(a);
          c.status === "completed" ? T() : c.status === "error" ? T(new Qe(c.error ?? "")) : m || (m = Vn(c.component_id, () => {
            S();
          }), m ? _ = !0 : T(new Qe("")));
        } catch (c) {
          T(c);
        } finally {
          r = !1, _ && !v && (_ = !1, S());
        }
      }
    }
    S();
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
}, Bn = 1024 * 1024, el = /* @__PURE__ */ ae({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r } = ye(), _ = { file: fe(), title: fe(), name: fe() };
    Se(() => o.visible);
    const v = ["image/png", "image/jpeg", "image/gif"], T = w(), S = w(), c = w(""), y = w(""), U = w(!1), h = w(!1), f = w();
    let k = { cancelled: !1 };
    const p = w(""), g = w(""), $ = w("");
    Z(() => o.visible, (q) => {
      if (!q) {
        k.cancelled = !0;
        return;
      }
      k = { cancelled: !1 }, o.replace || m.ensure("asset"), T.value = S.value = void 0, c.value = o.replace?.title ?? "", y.value = o.replace?.name ?? "", U.value = !1, p.value = g.value = $.value = "";
    }), Z(c, (q) => {
      !o.replace && !U.value && (y.value = Da(q));
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
      if (g.value = "", T.value = void 0, !!j) {
        if (!v.includes(j.type)) {
          g.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (j.size > Bn) {
          g.value = "Images must be 1 MB or smaller.";
          return;
        }
        T.value = j, S.value = await L(j), !o.replace && !c.value && (c.value = j.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function N() {
      return $.value = "", o.replace ? !0 : (Ba.test(y.value) ? m.find("asset", y.value) && ($.value = `An image named ${y.value} already exists. Choose another name or replace ${y.value}.`) : $.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !$.value);
    }
    async function z() {
      if (h.value || !T.value || !c.value.trim() || !N()) return;
      h.value = !0, p.value = "";
      const q = k;
      try {
        f.value = "upload";
        const j = await Ma.add(T.value), C = { name: y.value, upload_id: j, title: c.value.trim(), ...S.value }, x = () => o.replace ? se.replaceAsset(C, o.replace.revision) : se.addAsset(C);
        f.value = "save";
        let s;
        try {
          s = await x();
        } catch (R) {
          if (xe(R) !== "upload_still_processing") throw R;
          f.value = "process", await Sn(j, q), f.value = "save", s = await x();
        }
        m.patch("asset", s.name, Wa(s)), u("done", s), u("close"), o.replace || r({ name: "library", section: "assets", asset: s.name });
      } catch (j) {
        if (q.cancelled) return;
        j instanceof Qe ? p.value = "The image could not be processed. Try another file, or upload it again." : xe(j) === "mail_revision_conflict" && !o.replace ? $.value = `An image named ${y.value} already exists. Choose another name or replace ${y.value}.` : p.value = oe(j, "The image could not be uploaded.");
      } finally {
        h.value = !1, f.value = void 0;
      }
    }
    const Q = P(() => f.value === "upload" ? "Uploading the image…" : f.value === "process" ? "Processing the image…" : f.value === "save" ? "Adding it to the library…" : ""), le = P(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), ee = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (q, j) => (l(), O(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !h.value || f.value === "process",
      "close-on-escape": !h.value || f.value === "process",
      class: "mail-dialog",
      pt: ee,
      "aria-label": le.value,
      "onUpdate:visible": j[4] || (j[4] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", Tn, [
          i(e(E), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", Un, [
          t("span", Rn, b(le.value), 1),
          t("span", jn, b(a.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: h.value && f.value !== "process",
          onClick: j[3] || (j[3] = (C) => u("close"))
        }, null, 8, ["disabled"]),
        i(e(D), {
          label: a.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: h.value,
          disabled: !T.value || !a.replace && !c.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: je(z, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: h.value,
            inert: h.value || void 0
          }, [
            t("div", {
              class: ue(["mail-field", { "mail-field-invalid": g.value }])
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
                "choose-label": T.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: _.file, "aria-label": "Image file" } },
                onSelect: I
              }, {
                chooseicon: A(() => [
                  i(e(E), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: A(() => [
                  t("span", In, b(T.value ? `${T.value.name} · ${e(qe)(T.value.size)}${S.value ? ` · ${S.value.width} × ${S.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              g.value ? (l(), n("small", Nn, b(g.value), 1)) : V("", !0)
            ], 2),
            a.replace ? V("", !0) : (l(), n("div", zn, [
              t("label", {
                class: "mail-field-label",
                for: _.title
              }, "Name", 8, En),
              i(e(ve), {
                id: _.title,
                modelValue: c.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => c.value = C)
              }, null, 8, ["id", "modelValue"])
            ])),
            a.replace ? V("", !0) : (l(), n("div", {
              key: 1,
              class: ue(["mail-field", { "mail-field-invalid": $.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: _.name
              }, "Reference", 8, On),
              i(e(ve), {
                id: _.name,
                modelValue: y.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => y.value = C),
                class: "mail-mono-input",
                invalid: !!$.value,
                "aria-describedby": _.name + "-hint",
                onInput: j[2] || (j[2] = (C) => U.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: _.name + "-hint",
                class: ue($.value ? "mail-field-error" : "mail-field-hint")
              }, b($.value || "Templates show it with this name. It cannot change later."), 11, Pn)
            ], 2))
          ], 8, An),
          Q.value ? (l(), n("p", Mn, [
            i(e(E), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            W(b(Q.value), 1)
          ])) : V("", !0),
          p.value ? (l(), n("p", Dn, b(p.value), 1)) : V("", !0)
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
}, co = { class: "mail-history-head" }, vo = { class: "mail-history-main" }, mo = { class: "mail-history-title" }, fo = { class: "mail-sub" }, bo = /* @__PURE__ */ ae({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r } = ye();
    Se(() => !!o.name);
    const _ = w();
    Z(() => !!o.name, (x) => {
      x && (m.ensure("message"), Xe(() => _.value?.focus()));
    }, { immediate: !0 });
    const v = he(), T = he([]), S = he(), c = w(""), y = w(!1), U = w(!1), h = w(""), f = w(""), k = w(""), p = w(), g = w(!1), $ = w(!1), L = w(!1), I = w(), N = Ue();
    async function z() {
      const x = o.name, s = N();
      if (!x) {
        v.value = void 0;
        return;
      }
      y.value = !0;
      try {
        const [R, Y] = await Promise.all([se.get({ kind: "asset", name: x }), se.history({ kind: "asset", name: x })]);
        if (!s()) return;
        v.value = R, T.value = Y, U.value = !1, h.value = "";
        const H = R.used_by?.messages?.[0];
        c.value = H ?? "";
        const J = H ? await se.preview(H, []) : void 0;
        s() && (S.value = J);
      } catch (R) {
        if (!s()) return;
        U.value = ea(R), h.value = U.value ? "" : oe(R, "This image could not be loaded.");
      } finally {
        s() && (y.value = !1);
      }
    }
    Z(() => o.name, () => {
      g.value = $.value = !1, k.value = f.value = "", z();
    }, { immediate: !0 }), Ae("mail.library", () => {
      o.name && z();
    });
    const Q = P(() => (v.value?.used_by?.messages ?? []).map((x) => ({ name: x, title: m.title("message", x) })));
    async function le() {
      const x = v.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(x.name)}`), $.value = !0;
        } catch {
          $.value = !1;
        }
    }
    const ee = P(() => v.value ? Ga(v.value.name) : "");
    async function q() {
      try {
        await navigator.clipboard.writeText(ee.value), g.value = !0;
      } catch {
        g.value = !1;
      }
    }
    async function j(x, s) {
      const R = v.value;
      if (!R || p.value !== void 0) return;
      if (x === "delete" && Q.value.length) {
        I.value = {
          header: `${R.title} is in use`,
          message: `${ge(Q.value.length, "message")} ${Q.value.length === 1 ? "shows" : "show"} it: ${Q.value.map((H) => H.title ?? H.name).join(", ")}. Remove it from ${Q.value.length === 1 ? "that message" : "them"} first.`,
          links: Q.value.map((H) => ({ label: H.title ?? H.name, open: () => r({ name: "resource", kind: "message", resource: H.name, section: "content" }) }))
        };
        return;
      }
      const Y = {
        reset: { header: `Reset ${R.title} to the original?`, message: `The image included with ${R.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${R.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${s?.version} of ${R.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[x];
      if (await Te.confirm({ header: Y.header, message: Y.message, acceptLabel: Y.accept, rejectLabel: "Cancel", ...x === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        p.value = s ? s.revision : x, f.value = k.value = "";
        try {
          if (x === "delete") {
            await se.remove({ kind: "asset", name: R.name }, R.revision), u("close");
            return;
          }
          v.value = x === "reset" ? await se.reset({ kind: "asset", name: R.name }, R.revision) : await se.restore({ kind: "asset", name: R.name }, s.revision, R.revision), k.value = x === "reset" ? `${R.title} is back to the original.` : `Version ${s.version} is shown again everywhere.`, await z();
        } catch (H) {
          const J = He(H);
          if (J?.dependents?.length || J?.references?.length) {
            const de = [...(J.references ?? []).filter((ie) => ie.kind !== "asset")];
            for (const ie of J.dependents ?? []) de.some(($e) => $e.kind === "message" && $e.name === ie) || de.push({ kind: "message", name: ie });
            await Promise.all([...new Set(de.map((ie) => ie.kind))].map((ie) => m.ready(ie) ? void 0 : m.load(ie))), I.value = {
              header: `${R.title} is in use`,
              message: `${ge(de.length, "template")} ${de.length === 1 ? "names" : "name"} ${R.title}, in the current version or one kept in History. Remove it from ${de.length === 1 ? "that template" : "them"} first.`,
              links: de.map((ie) => ({
                label: m.title(ie.kind, ie.name) ?? ie.name,
                icon: pe[ie.kind],
                open: () => r(ie.kind === "asset" ? { name: "library", section: "assets", asset: ie.name } : { name: "resource", kind: ie.kind, resource: ie.name, section: "content" })
              }))
            };
          } else
            f.value = xe(H) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : oe(H, "The image could not be changed."), xe(H) === "mail_revision_conflict" && z();
        } finally {
          p.value = void 0;
        }
      }
    }
    const C = P(() => S.value?.html ? _a(S.value.html, S.value.inline_assets) : "");
    return (x, s) => (l(), n(F, null, [
      i(e(Fa), {
        visible: !!a.name,
        position: "right",
        modal: !0,
        dismissable: p.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": s[5] || (s[5] = (R) => {
          R || u("close");
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
                v.value?.state === "customized" ? (l(), O(e(Oe), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, b(v.value?.title ?? "Image"), 1)
              ]),
              i(e(D), {
                text: "",
                severity: "secondary",
                disabled: !v.value,
                "aria-label": $.value ? "Link copied" : "Copy link",
                title: $.value ? "Link copied" : "Copy link",
                onClick: le
              }, {
                icon: A(() => [
                  i(e(E), {
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
                disabled: p.value !== void 0,
                onClick: s[0] || (s[0] = (R) => u("close"))
              }, {
                icon: A(() => [
                  i(e(E), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            y.value && !v.value ? (l(), n("p", Fn, [
              i(e(E), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              s[9] || (s[9] = W("Loading image…", -1))
            ])) : U.value ? (l(), n("p", Jn, [
              i(e(E), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              s[10] || (s[10] = W("This image no longer exists. It was deleted while you were away.", -1))
            ])) : h.value ? (l(), n("div", Wn, [
              t("span", null, b(h.value), 1),
              i(e(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: s[1] || (s[1] = (R) => z())
              })
            ])) : V("", !0),
            v.value ? (l(), n(F, { key: 3 }, [
              f.value ? (l(), n("p", Kn, [
                i(e(E), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                W(b(f.value), 1)
              ])) : V("", !0),
              k.value ? (l(), n("p", Yn, [
                i(e(E), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                W(b(k.value), 1)
              ])) : V("", !0),
              t("div", Gn, [
                i(e(D), {
                  label: "Replace",
                  disabled: p.value !== void 0,
                  onClick: s[2] || (s[2] = (R) => L.value = !0)
                }, {
                  icon: A(() => [
                    i(e(E), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                v.value.state === "customized" ? (l(), O(e(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: p.value === "reset",
                  disabled: p.value !== void 0,
                  onClick: s[3] || (s[3] = (R) => j("reset"))
                }, {
                  icon: A(() => [
                    i(e(E), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                v.value.state === "created" ? (l(), O(e(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: p.value === "delete",
                  disabled: p.value !== void 0,
                  onClick: s[4] || (s[4] = (R) => j("delete"))
                }, {
                  icon: A(() => [
                    i(e(E), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ]),
              t("div", Zn, [
                i(Xa, {
                  name: v.value.name,
                  revision: v.value.revision,
                  asset: v.value.asset,
                  large: "",
                  alt: v.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", Qn, [
                s[12] || (s[12] = t("dt", null, "Reference", -1)),
                t("dd", Xn, [
                  t("span", eo, b(ee.value), 1),
                  i(e(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": g.value ? "Reference copied" : "Copy reference",
                    title: g.value ? "Reference copied" : "Copy reference",
                    onClick: q
                  }, {
                    icon: A(() => [
                      i(e(E), {
                        icon: g.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                s[13] || (s[13] = t("dt", null, "File", -1)),
                t("dd", null, b(v.value.asset?.filename) + " · " + b(e(qe)(v.value.asset?.size)), 1),
                v.value.asset?.width ? (l(), n(F, { key: 0 }, [
                  s[11] || (s[11] = t("dt", null, "Size", -1)),
                  t("dd", null, b(v.value.asset.width) + " × " + b(v.value.asset.height), 1)
                ], 64)) : V("", !0),
                s[14] || (s[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  i(xa, { resource: v.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", ao, [
                s[15] || (s[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                Q.value.length ? (l(), n(F, { key: 1 }, [
                  t("ul", to, [
                    (l(!0), n(F, null, me(Q.value, (R) => (l(), n("li", {
                      key: R.name
                    }, [
                      i(e(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (Y) => e(r)({ name: "resource", kind: "message", resource: R.name, section: "content" })
                      }, {
                        default: A(() => [
                          i(e(E), {
                            icon: e(pe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          R.title === void 0 ? (l(), O(e(Le), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", so, b(R.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  C.value ? (l(), n("div", io, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: C.value,
                      title: "How " + v.value.title + " looks in " + (e(m).title("message", c.value) ?? "")
                    }, null, 8, no)
                  ])) : V("", !0)
                ], 64)) : (l(), n("p", lo, "No message shows " + b(v.value.title) + " with its sample values.", 1))
              ]),
              t("section", oo, [
                s[16] || (s[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                T.value.length ? (l(), n("ol", uo, [
                  (l(!0), n(F, null, me(T.value, (R) => (l(), n("li", {
                    key: R.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", co, [
                      t("div", vo, [
                        t("span", mo, [
                          W("Version " + b(R.version) + " · " + b(e(pa)[R.action]) + " ", 1),
                          R.revision === v.value.revision ? (l(), O(e(Oe), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", fo, [
                          W(b(e(Ce)(R.author_label, R.author)) + " · " + b(e(Je)(R.created_at)) + " ", 1),
                          R.content.asset?.filename ? (l(), n(F, { key: 0 }, [
                            W(" · " + b(R.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      R.revision !== v.value.revision ? (l(), O(e(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: p.value === R.revision,
                        disabled: p.value !== void 0,
                        onClick: (Y) => j("restore", R)
                      }, {
                        icon: A(() => [
                          i(e(E), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", ro, b(v.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      v.value ? (l(), O(el, {
        key: 0,
        visible: L.value,
        replace: v.value,
        onClose: s[6] || (s[6] = (R) => L.value = !1),
        onDone: s[7] || (s[7] = (R) => z())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      i(Qa, {
        refusal: I.value,
        onClose: s[8] || (s[8] = (R) => I.value = void 0)
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
}, _o = { class: "mail-sub" }, xo = { class: "mail-mono-block" }, Co = { class: "mail-muted" }, Vo = { class: "mail-muted" }, So = /* @__PURE__ */ ae({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(a) {
    const d = a, { go: o, upload: u } = ye(), m = w(""), r = w("");
    let _;
    Z(m, (I) => {
      clearTimeout(_), _ = setTimeout(() => {
        r.value = I.trim();
      }, 250);
    });
    const v = he([]), T = w(!0), S = w(!1), c = w(!1), y = w(""), U = w(""), h = Ue();
    async function f(I = !1) {
      const N = h();
      T.value = !0;
      try {
        const z = await se.assets(r.value || void 0);
        if (!N()) return;
        v.value = z, y.value = U.value = "", c.value = !1, S.value = !0;
      } catch (z) {
        if (!N()) return;
        c.value = Fe(z);
        const Q = c.value ? "" : oe(z, "Images could not be loaded.");
        I && S.value && !c.value ? U.value = Q : y.value = Q;
      } finally {
        N() && (T.value = !1);
      }
    }
    Z(r, () => {
      f();
    }), ta(() => f(S.value)), Ae("mail.library", () => {
      f(S.value);
    });
    function k(I) {
      const N = I.used_by?.messages;
      return N ? ge(N, "message") : "—";
    }
    const p = P(() => v.value.reduce((I, N) => I + (N.asset?.size ?? 0), 0)), g = P(() => `${ge(v.value.length, "image")} · ${qe(p.value)}`);
    function $(I) {
      const N = I.asset;
      return N ? (N.width && N.height ? `${N.width} × ${N.height} · ` : "") + qe(N.size) : "";
    }
    function L(I) {
      o({ name: "library", section: "assets", asset: I.name });
    }
    return (I, N) => (l(), n(F, null, [
      i(sa, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: A(() => [
          i(e(D), {
            label: "Upload image",
            onClick: N[0] || (N[0] = (z) => e(u)())
          }, {
            icon: A(() => [
              i(e(E), {
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
        i(e(E), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        N[7] || (N[7] = W("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : y.value ? (l(), n("div", po, [
        t("span", null, b(y.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: N[1] || (N[1] = (z) => f())
        })
      ])) : V("", !0),
      U.value ? (l(), n("div", go, [
        t("span", null, b(U.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: N[2] || (N[2] = (z) => f(!0))
        })
      ])) : T.value && !S.value ? (l(), n("p", ho, [
        i(e(E), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        N[8] || (N[8] = W("Loading images…", -1))
      ])) : S.value && !v.value.length && !r.value ? (l(), O($a, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: N[3] || (N[3] = (z) => e(u)())
      })) : S.value ? (l(), n(F, { key: 5 }, [
        t("div", ko, [
          i(e(ha), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(E), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: m.value,
                "onUpdate:modelValue": N[4] || (N[4] = (z) => m.value = z),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", $o, b(g.value), 1)
        ]),
        v.value.length ? (l(), O(e(ga), {
          key: 1,
          value: v.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: N[5] || (N[5] = (z) => L(z.data))
        }, {
          default: A(() => [
            i(e(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: A(({ data: z }) => [
                i(Xa, {
                  name: z.name,
                  revision: z.revision,
                  asset: z.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: z }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: z.title,
                  onClick: je((Q) => L(z), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", _o, [
                  t("span", xo, b(z.name), 1),
                  z.asset?.filename ? (l(), n(F, { key: 0 }, [
                    W(" · " + b(z.asset.filename), 1)
                  ], 64)) : V("", !0)
                ])
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: z }) => [
                t("span", Co, b($(z)), 1)
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: z }) => [
                t("span", null, b(k(z)), 1)
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: z }) => [
                i(xa, { resource: z }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: z }) => [
                t("span", Vo, b(z.state === "original" ? "—" : e(Pa)(z.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", wo, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      i(bo, {
        name: d.asset,
        onClose: N[6] || (N[6] = (z) => e(o)({ name: "library", section: "assets" }))
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
}, Re = "\0blank", Ho = /* @__PURE__ */ ae({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r } = ye(), _ = w("message"), v = w(""), T = w(""), S = w(""), c = w(""), y = w(!1), U = w(!1), h = w(""), f = w(""), k = { title: fe(), reference: fe(), description: fe(), source: fe(), hint: fe() }, p = ["message", "base", "part"].map((q) => ({ value: q, label: be[q] })), g = P(() => !!o.intent.from), $ = P(() => [
      { value: Re, label: "Blank" },
      ...m.ofKind(_.value).map((q) => ({ value: q.name, label: q.title }))
    ]), L = P(() => v.value === Re || !!m.find(_.value, v.value));
    function I(q) {
      if (v.value = q, q === Re) return;
      const j = m.find(_.value, q);
      j && (c.value = j.description, o.intent.from && (T.value = `${j.title} copy`, y.value = !1));
    }
    Z(() => o.visible, async (q) => {
      q && (_.value = o.intent.from?.kind ?? o.intent.kind ?? "message", T.value = S.value = c.value = v.value = "", h.value = f.value = "", y.value = !1, o.intent.from ? (v.value = o.intent.from.name, m.ready(_.value) || await m.load(_.value), o.visible && I(o.intent.from.name)) : (v.value = Re, m.ensure(_.value)));
    }, { immediate: !0 }), Z(_, (q) => {
      o.intent.from || (v.value = Re, c.value = "", o.visible && m.ensure(q));
    }), Se(() => o.visible), Z(T, (q) => {
      y.value || (S.value = Da(q));
    });
    const N = P(() => _.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function z() {
      return f.value = "", S.value ? Ba.test(S.value) ? m.find(_.value, S.value) && (f.value = `A ${be[_.value].toLowerCase()} with this reference already exists. Choose another.`) : f.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : f.value = "Enter a reference.", !f.value;
    }
    async function Q() {
      if (!(U.value || !T.value.trim() || !L.value || !z())) {
        U.value = !0, h.value = "";
        try {
          const q = v.value === Re ? await se.create(Yt(_.value, S.value, T.value.trim(), c.value.trim())) : await se.copy({
            kind: _.value,
            name: S.value,
            title: T.value.trim(),
            description: c.value.trim(),
            from: { kind: _.value, name: v.value }
          });
          m.patch(q.kind, q.name, Wa(q)), u("close"), r({ name: "resource", kind: q.kind, resource: q.name, section: "content" });
        } catch (q) {
          xe(q) === "mail_revision_conflict" ? f.value = `A ${be[_.value].toLowerCase()} with this reference already exists. Choose another.` : h.value = oe(q, "The resource could not be created.");
        } finally {
          U.value = !1;
        }
      }
    }
    const le = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, ee = P(() => o.intent.from ? `Duplicate ${m.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${be[_.value].toLowerCase()}`);
    return (q, j) => (l(), O(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !U.value,
      "close-on-escape": !U.value,
      class: "mail-dialog",
      pt: le,
      "aria-label": ee.value,
      "onUpdate:visible": j[6] || (j[6] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", To, [
          i(e(E), {
            icon: e(pe)[_.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Uo, [
          t("span", Ro, b(ee.value), 1),
          t("span", jo, b(v.value === Re ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: U.value,
          onClick: j[5] || (j[5] = (C) => u("close"))
        }, null, 8, ["disabled"]),
        i(e(D), {
          label: "Create " + e(be)[_.value].toLowerCase(),
          type: "submit",
          form: k.hint,
          loading: U.value,
          disabled: !T.value.trim() || !L.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: k.hint,
          class: "mail-form",
          onSubmit: je(Q, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: U.value,
            inert: U.value || void 0
          }, [
            g.value ? V("", !0) : (l(), n("div", Io, [
              j[7] || (j[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              i(e(Ve), {
                modelValue: _.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => _.value = C),
                options: e(p),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            g.value ? V("", !0) : (l(), n("div", No, [
              t("label", {
                class: "mail-field-label",
                for: k.source
              }, "Start from", 8, zo),
              i(e(Pe), {
                "model-value": v.value,
                "input-id": k.source,
                options: $.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !e(m).ready(_.value),
                "onUpdate:modelValue": I
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", Eo, [
              t("label", {
                class: "mail-field-label",
                for: k.title
              }, "Name", 8, Oo),
              i(e(ve), {
                id: k.title,
                modelValue: T.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => T.value = C),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: ue(["mail-field", { "mail-field-invalid": f.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: k.reference
              }, "Reference", 8, Po),
              i(e(ve), {
                id: k.reference,
                modelValue: S.value,
                "onUpdate:modelValue": j[2] || (j[2] = (C) => S.value = C),
                class: "mail-mono-input",
                invalid: !!f.value,
                "aria-describedby": k.reference + "-hint",
                onInput: j[3] || (j[3] = (C) => y.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: k.reference + "-hint",
                class: ue(f.value ? "mail-field-error" : "mail-field-hint")
              }, b(f.value || N.value), 11, Mo)
            ], 2),
            t("div", Do, [
              t("label", {
                class: "mail-field-label",
                for: k.description
              }, "Description", 8, Bo),
              i(e(va), {
                id: k.description,
                modelValue: c.value,
                "onUpdate:modelValue": j[4] || (j[4] = (C) => c.value = C),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Lo),
          h.value ? (l(), n("p", qo, b(h.value), 1)) : V("", !0)
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
}, cr = { class: "mail-timeline" }, vr = { class: "mail-muted" }, mr = { class: "mail-facts" }, fr = { class: "mail-mono-block" }, br = /* @__PURE__ */ ae({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r, capabilities: _, delivery: v } = ye();
    Se(() => !!o.messageId);
    const T = w();
    Z(() => !!o.messageId, (x) => {
      x && Xe(() => T.value?.focus());
    }, { immediate: !0 });
    const S = P(() => !!y.value?.last_error && wl.has(y.value.last_error.code)), c = P(() => {
      const x = y.value?.last_error;
      if (!x) return;
      const s = v.value?.driver && v.value.driver.id === y.value?.driver_id ? v.value.driver.label : "The delivery service";
      return (_.value?.administer_delivery ? _l(x.code, s) : void 0) ?? { lead: "", next: x.message };
    }), y = he(), U = w(!1), h = w(!1), f = w(!1), k = w(""), p = w(""), g = w(!1), $ = w(), L = w(!1), I = Ue();
    async function N() {
      const x = o.messageId, s = I();
      if (!x) {
        y.value = void 0;
        return;
      }
      U.value = !0;
      try {
        const R = await aa.get(x);
        if (!s()) return;
        y.value = R, k.value = "", h.value = f.value = !1;
      } catch (R) {
        if (!s()) return;
        y.value = void 0, h.value = ea(R), f.value = Fe(R), k.value = h.value || f.value ? "" : oe(R, "This message could not be loaded.");
      } finally {
        s() && (U.value = !1);
      }
    }
    Z(() => o.messageId, (x) => {
      $.value = void 0, p.value = "", L.value = !1, x !== y.value?.message_id && (y.value = void 0), N();
    }, { immediate: !0 }), Ae("mail.activity", () => {
      o.messageId && N();
    });
    async function z() {
      const x = y.value;
      if (!(!x || g.value)) {
        g.value = !0, p.value = "";
        try {
          $.value = await aa.resend(x.message_id);
        } catch (s) {
          p.value = oe(s, "The message could not be sent again.");
        } finally {
          g.value = !1;
        }
      }
    }
    async function Q() {
      const x = y.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(x.message_id)}`), L.value = !0;
        } catch {
          L.value = !1;
        }
    }
    const le = P(() => {
      const x = y.value?.template;
      return x ? m.title("message", x) : "";
    }), ee = P(() => !!y.value?.template && !!m.find("message", y.value.template)), q = P(() => {
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
    return (x, s) => (l(), O(e(Fa), {
      visible: !!a.messageId,
      position: "right",
      modal: !0,
      dismissable: !g.value,
      "close-on-escape": !g.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": s[6] || (s[6] = (R) => {
        R || u("close");
      })
    }, {
      default: A(() => [
        t("div", {
          ref_key: "drawer",
          ref: T,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", Fo, [
            t("div", Jo, [
              y.value ? (l(), O(e(Oe), {
                key: 0,
                severity: e(Ha)[y.value.status],
                value: e(qa)[y.value.status],
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
              onClick: Q
            }, {
              icon: A(() => [
                i(e(E), {
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
              disabled: g.value,
              onClick: s[0] || (s[0] = (R) => u("close"))
            }, {
              icon: A(() => [
                i(e(E), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          U.value && !y.value ? (l(), n("p", Wo, [
            i(e(E), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            s[7] || (s[7] = W("Loading message…", -1))
          ])) : h.value ? (l(), n("p", Ko, [
            i(e(E), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            s[8] || (s[8] = W("This message is no longer in Activity.", -1))
          ])) : f.value ? (l(), n("p", Yo, [
            i(e(E), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            s[9] || (s[9] = W("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : k.value ? (l(), n("div", Go, [
            t("span", null, b(k.value), 1),
            i(e(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: s[1] || (s[1] = (R) => N())
            })
          ])) : V("", !0),
          y.value ? (l(), n(F, { key: 4 }, [
            y.value.status === "failed" ? (l(), n("div", Zo, [
              i(e(E), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Qo, [
                s[12] || (s[12] = t("strong", null, "This message was not delivered.", -1)),
                c.value?.lead ? (l(), n("span", Xo, b(c.value.lead), 1)) : V("", !0),
                c.value ? (l(), n("span", er, b(c.value.next), 1)) : V("", !0),
                $.value ? (l(), n("p", ar, [
                  s[10] || (s[10] = W(" Sent again as a new message. ", -1)),
                  i(e(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: s[2] || (s[2] = (R) => e(r)({ name: "activity", message: $.value.message_id }))
                  })
                ])) : S.value ? (l(), n("p", lr, [
                  s[11] || (s[11] = W("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  e(_)?.administer_delivery ? (l(), O(e(D), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: s[3] || (s[3] = (R) => e(Te).navigate("/system/settings/mail"))
                  })) : V("", !0)
                ])) : y.value.can_resend ? V("", !0) : (l(), n("p", tr, "It cannot be sent again because its content was not kept.")),
                p.value ? (l(), n("p", sr, b(p.value), 1)) : V("", !0),
                y.value.can_resend && !$.value && !S.value ? (l(), n("div", ir, [
                  i(e(D), {
                    label: "Send again",
                    loading: g.value,
                    onClick: z
                  }, {
                    icon: A(() => [
                      i(e(E), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : y.value.status === "queued" ? (l(), n("p", nr, [
              i(e(E), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              s[13] || (s[13] = W("Waiting to be delivered. ", -1))
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
                le.value === void 0 ? (l(), O(e(Le), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : ee.value ? (l(), O(e(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: le.value,
                  onClick: s[4] || (s[4] = (R) => e(r)({ name: "resource", kind: "message", resource: y.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", rr, b(le.value || "Written directly"), 1))
              ]),
              s[21] || (s[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                W(b(e(Ce)(y.value.sender_label, y.value.sender)), 1),
                y.value.origin ? (l(), n("span", ur, b(e(ia)(y.value.origin)), 1)) : V("", !0)
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
                    onClick: s[5] || (s[5] = (R) => e(r)({ name: "activity", message: y.value.resend_of }))
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
                (l(!0), n(F, null, me(q.value, (R) => (l(), n("li", {
                  key: R.label
                }, [
                  t("span", null, b(R.label), 1),
                  t("span", vr, b(e(Je)(R.at)), 1)
                ]))), 128))
              ])
            ]),
            C.value.length ? (l(), O(Za, {
              key: 2,
              label: "Technical details"
            }, {
              default: A(() => [
                t("dl", mr, [
                  (l(!0), n(F, null, me(C.value, (R) => (l(), n(F, {
                    key: R.label
                  }, [
                    t("dt", null, b(R.label), 1),
                    t("dd", fr, b(R.value), 1)
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
}, jr = /* @__PURE__ */ ae({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, capabilities: m } = ye();
    o.use("message");
    const r = w("all"), _ = w(d.template ?? null), v = w(30), T = w(""), S = w("");
    let c;
    Z(T, (te) => {
      clearTimeout(c), c = setTimeout(() => {
        S.value = te.trim();
      }, 250);
    }), Z(() => d.template, (te) => {
      te !== void 0 && (_.value = te);
    });
    const y = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], U = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], h = P(() => o.ofKind("message").map((te) => ({ label: te.title, value: te.name }))), f = he([]), k = w(), p = w(!0), g = w(!1), $ = w(!1), L = w(!1), I = w(""), N = w(""), z = w(""), Q = Ue();
    function le(te) {
      return {
        status: r.value === "all" ? void 0 : r.value,
        message: _.value || void 0,
        since: Date.now() - v.value * 24 * 60 * 60 * 1e3,
        q: S.value || void 0,
        cursor: te
      };
    }
    async function ee(te = !1) {
      const X = Q();
      p.value = !0;
      try {
        const G = await aa.list(le());
        if (!X()) return;
        f.value = G.items, k.value = G.next_cursor, j.value = G.total, C.value = !!G.total_is_lower_bound, x.value = G.failed_today ?? 0, I.value = N.value = z.value = "", L.value = !1, g.value = !0;
      } catch (G) {
        if (!X()) return;
        L.value = Fe(G);
        const we = L.value ? "" : oe(G, "Activity could not be loaded.");
        te && g.value && !L.value ? z.value = we : I.value = we;
      } finally {
        X() && (p.value = !1);
      }
    }
    async function q() {
      if (p.value || !k.value || $.value) return;
      const te = Q();
      $.value = !0, N.value = "";
      try {
        const X = await aa.list(le(k.value));
        if (!te()) return;
        const G = new Set(f.value.map((we) => we.message_id));
        f.value = [...f.value, ...X.items.filter((we) => !G.has(we.message_id))], k.value = X.next_cursor;
      } catch (X) {
        te() && (N.value = oe(X, "More activity could not be loaded."));
      } finally {
        $.value = !1;
      }
    }
    const j = w(), C = w(!1), x = w(0);
    Z([r, _, v, S], () => {
      ee();
    }), ta(() => ee(g.value)), Ae("mail.activity", () => {
      ee(g.value);
    });
    const s = P(() => {
      const te = j.value ?? f.value.length;
      return C.value ? `${te.toLocaleString()}+ messages` : ge(te, "message");
    }), R = P(() => C.value && !!S.value), Y = P(() => x.value ? `${ge(x.value, "message")} failed today.` : ""), H = P(() => !!m.value?.administer_delivery), J = P(() => H.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function de(te) {
      return te ? o.title("message", te) : "—";
    }
    function ie(te) {
      u({ name: "activity", message: te.message_id });
    }
    function $e() {
      u({ name: "activity", template: _.value || void 0 });
    }
    return (te, X) => (l(), n(F, null, [
      i(sa, {
        title: "Activity",
        description: J.value
      }, null, 8, ["description"]),
      L.value ? (l(), n("p", yr, [
        i(e(E), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        X[8] || (X[8] = W("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(F, { key: 1 }, [
        Y.value ? (l(), n("p", pr, [
          i(e(E), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", gr, [
            t("strong", null, b(Y.value), 1),
            W(" " + b(r.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          r.value !== "failed" ? (l(), O(e(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[0] || (X[0] = (G) => r.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", hr, [
          i(e(Ve), {
            modelValue: r.value,
            "onUpdate:modelValue": X[1] || (X[1] = (G) => r.value = G),
            options: y,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          i(e(Pe), {
            modelValue: _.value,
            "onUpdate:modelValue": X[2] || (X[2] = (G) => _.value = G),
            options: h.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          i(e(Pe), {
            modelValue: v.value,
            "onUpdate:modelValue": X[3] || (X[3] = (G) => v.value = G),
            options: U,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          i(e(ha), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(E), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: T.value,
                "onUpdate:modelValue": X[4] || (X[4] = (G) => T.value = G),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          g.value ? (l(), n("span", kr, b(s.value), 1)) : V("", !0)
        ]),
        R.value ? (l(), n("p", $r, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : V("", !0),
        I.value ? (l(), n("div", wr, [
          t("span", null, b(I.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[5] || (X[5] = (G) => ee())
          })
        ])) : V("", !0),
        z.value ? (l(), n("div", _r, [
          t("span", null, b(z.value) + " The list shows what was loaded before.", 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[6] || (X[6] = (G) => ee(!0))
          })
        ])) : p.value && !g.value ? (l(), n("p", xr, [
          i(e(E), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          X[9] || (X[9] = W("Loading activity…", -1))
        ])) : g.value ? (l(), n(F, { key: 5 }, [
          f.value.length ? (l(), O(e(ga), {
            key: 1,
            value: f.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: X[7] || (X[7] = (G) => ie(G.data))
          }, {
            default: A(() => [
              i(e(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: A(({ data: G }) => [
                  i(e(Oe), {
                    severity: e(Ha)[G.status],
                    value: e(qa)[G.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              i(e(ce), { header: "Message" }, {
                body: A(({ data: G }) => [
                  i(e(D), {
                    link: "",
                    class: "mail-name",
                    label: G.subject,
                    onClick: je((we) => ie(G), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", Vr, b(e(xl)(G.to)), 1)
                ]),
                _: 1
              }),
              i(e(ce), { header: "Template" }, {
                body: A(({ data: G }) => [
                  de(G.template) === void 0 ? (l(), O(e(Le), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    W(b(de(G.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              i(e(ce), { header: "Sent by" }, {
                body: A(({ data: G }) => [
                  t("span", null, b(e(Ce)(G.sender_label, G.sender)), 1),
                  G.origin ? (l(), n("span", Sr, b(e(ia)(G.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              i(e(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: A(({ data: G }) => [
                  t("span", Tr, b(e(Cl)(G.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Cr, b(S.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          k.value ? (l(), n("div", Ur, [
            N.value ? (l(), n("span", Rr, b(N.value), 1)) : V("", !0),
            i(e(D), {
              label: N.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: $.value,
              disabled: p.value,
              onClick: q
            }, null, 8, ["label", "loading", "disabled"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      i(br, {
        "message-id": a.message,
        onClose: $e
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Ar = { class: "kx-shell kx-settings-shell mail-admin" }, Lr = { class: "kx-main" }, Ir = /* @__PURE__ */ ae({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(a, { emit: d }) {
    const o = a, u = d, m = he(Ia(o.route ?? "")), r = P(() => m.value), _ = w(!1);
    Z(_, (s) => u("dirty-change", s), { flush: "sync" });
    let v = !1;
    async function T() {
      if (!_.value) return !0;
      if (v) return !1;
      v = !0;
      try {
        return await Te.confirm({
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
    function S(s, R) {
      return s.name === "resource" && R.name === "resource" && s.kind === R.kind && s.resource === R.resource;
    }
    async function c(s) {
      const R = ze(s);
      !S(r.value, s) && !await T() || (S(r.value, s) || (_.value = !1), m.value = s, o.route !== void 0 && R !== o.route && u("navigate", R));
    }
    Z(() => o.route, async (s, R) => {
      if (s === void 0) return;
      const Y = Ia(s);
      if (ze(Y) !== ze(m.value)) {
        if (!S(m.value, Y) && _.value) {
          if (!await T()) {
            R !== void 0 && o.route === s && u("navigate", ze(m.value));
            return;
          }
          _.value = !1;
        }
        o.route === s && (m.value = Y);
      }
    });
    const y = Xl(), U = yl();
    Z(U, (s, R) => {
      R === !1 && s === !0 && y.refresh();
    });
    const h = w(), f = w();
    async function k() {
      try {
        h.value = await Vl.capabilities();
      } catch {
        h.value = void 0;
      }
      if (h.value?.administer_delivery)
        try {
          f.value = await Sl.status();
        } catch {
          f.value = void 0;
        }
    }
    k();
    const p = w(!1), g = w(!1), $ = w({});
    function L(s) {
      $.value = s, p.value = !0;
    }
    bl(Ja, {
      library: y,
      capabilities: h,
      delivery: f,
      go: (s) => {
        c(s);
      },
      create: L,
      upload: () => {
        g.value = !0;
      },
      setDirty: (s) => {
        _.value = s;
      },
      setTitle: (s) => {
        ee.value = s;
      }
    });
    const I = {
      content: (s) => s === "message" ? "Message" : s === "base" ? "Layout" : "Content",
      variables: (s) => s === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, N = {
      content: (s) => pe[s],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, z = P(() => !!h.value && (h.value.administer_delivery || h.value.send)), Q = P(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: pe.message },
        { value: "bases", label: "Base templates", icon: pe.base },
        { value: "parts", label: "Parts", icon: pe.part },
        { value: "assets", label: "Images", icon: pe.asset }
      ] },
      ...z.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), le = { value: "all", label: "All resources", icon: "tabler:table" }, ee = w("");
    Z(() => ze(r.value), () => {
      ee.value = "";
    });
    const q = P(() => {
      const s = r.value;
      if (s.name === "resource")
        return {
          leading: { value: "all", label: "All " + ya[s.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: ee.value || " ", items: Ya(s.kind).map((R) => ({
            value: R,
            label: I[R](s.kind),
            icon: N[R](s.kind)
          })) }]
        };
    }), j = P(() => {
      const s = r.value;
      return s.name === "resource" ? s.section : s.name === "activity" ? "activity" : s.section;
    });
    function C(s) {
      const R = r.value;
      if (R.name === "resource") {
        c(s === "all" ? { name: "library", section: ma(R.kind) } : { ...R, section: s });
        return;
      }
      c(s === "activity" ? { name: "activity" } : { name: "library", section: s });
    }
    const x = w();
    return Z(() => ze(r.value), () => {
      x.value?.scrollTo({ top: 0 });
    }), (s, R) => (l(), n("main", Ar, [
      i(Ql, {
        label: "Mail sections",
        title: "Mail",
        value: j.value,
        groups: q.value ? q.value.groups : Q.value,
        "leading-item": q.value ? q.value.leading : le,
        "onUpdate:value": C
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", Lr, [
        t("div", {
          ref_key: "main",
          ref: x,
          class: ue(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), O(hn, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), O(jr, {
            key: 1,
            message: r.value.message,
            template: r.value.template
          }, null, 8, ["message", "template"])) : r.value.section === "assets" ? (l(), O(So, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), O(Jt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      i(Ho, {
        visible: p.value,
        intent: $.value,
        onClose: R[0] || (R[0] = (Y) => p.value = !1)
      }, null, 8, ["visible", "intent"]),
      i(el, {
        visible: g.value,
        onClose: R[1] || (R[1] = (Y) => g.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Nr = /* @__PURE__ */ ae({
  __name: "MailAdminRoot",
  setup(a) {
    const d = pl(), o = gl();
    return (u, m) => (l(), O(Ir, {
      route: e(d).route,
      onNavigate: m[0] || (m[0] = (r) => e(o)("navigate", { route: r })),
      onDirtyChange: m[1] || (m[1] = (r) => e(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), zr = Tl(Nr, { type: "object", properties: { route: { type: "string", default: "" } } });
jl(import.meta.url, zr);
//# sourceMappingURL=admin.js.map
