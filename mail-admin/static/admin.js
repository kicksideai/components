import { defineComponent as le, useId as fe, openBlock as l, createElementBlock as n, unref as e, normalizeClass as ue, createElementVNode as t, createTextVNode as K, toDisplayString as f, createCommentVNode as V, renderSlot as Ee, computed as O, createBlock as E, resolveDynamicComponent as ol, normalizeProps as rl, guardReactiveProps as ul, createSlots as ba, withCtx as A, Fragment as J, renderList as me, inject as dl, ref as _, shallowRef as ge, onMounted as cl, onBeforeUnmount as la, createVNode as i, watch as Q, reactive as vl, nextTick as Xe, withModifiers as Ae, useModel as Ea, mergeModels as da, defineAsyncComponent as ca, withDirectives as ml, vShow as fl, provide as bl } from "vue";
import { u as ta, a as yl, b as pl, c as hl } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Le, l as se, d as oe, k as be, b as qe, A as gl, e as xe, a as Se, p as he, w as Oa, c as Ce, _ as sa, f as ya, g as pe, s as Pa, i as Fe, h as Ue, j as pa, m as Je, o as ia, n as kl, q as $l, r as ea, t as Ma, v as Da, x as Ba, y as wl, z as _l, B as qa, C as Ha, D as aa, E as xl, F as Cl, G as Vl, H as Sl, I as Tl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-Dy7oKH3y.js";
import { host as Te, api as Ul, on as Rl, define as jl } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import Re from "primevue/skeleton";
import D from "primevue/button";
import ce from "primevue/column";
import ha from "primevue/datatable";
import ga from "primevue/iconfield";
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
const Dl = ["aria-labelledby"], Bl = { class: "kx-railhead" }, ql = ["id"], Hl = { key: 0 }, Fl = { class: "kx-railhead-acts" }, Jl = { class: "kx-rail-body" }, Wl = /* @__PURE__ */ le({
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
          K(f(a.title), 1),
          a.count !== void 0 ? (l(), n("b", Hl, f(a.count), 1)) : V("", !0)
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
    const d = a, o = O(() => d.leadingItem ? [{ items: [d.leadingItem] }, ...d.groups] : d.groups);
    function u(m) {
      const r = [...m.currentTarget.querySelectorAll(".kx-settings-rail-item")], $ = r.indexOf(m.target);
      if ($ < 0) return;
      let v;
      switch (m.key) {
        case "ArrowDown":
        case "ArrowRight":
          v = ($ + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          v = ($ + r.length - 1) % r.length;
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
    return (m, r) => (l(), E(ol(a.title ? Wl : "div"), rl(ul(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ba({
      default: A(() => [
        t("nav", {
          class: ue(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: u
        }, [
          (l(!0), n(J, null, me(o.value, ($, v) => (l(), n("div", {
            key: $.items[0]?.value ?? v,
            class: ue(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && v === 0 }])
          }, [
            $.heading ? (l(), n("div", Yl, f($.heading), 1)) : V("", !0),
            (l(!0), n(J, null, me($.items, (S) => (l(), n("button", {
              key: S.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": S.value === a.value ? "true" : void 0,
              onClick: (T) => m.$emit("update:value", S.value)
            }, [
              S.icon ? (l(), E(e(N), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: S.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Zl, f(S.label), 1)
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
  const { kind: d, name: o, title: u, description: m, state: r, revision: $, origin: v, origin_label: S, base: T, author: c, author_label: b, updated_at: U, used_by: g } = a, p = g && {
    messages: g.messages?.length,
    recent_sources: g.recent_senders?.length
  };
  return { kind: d, name: o, title: u, description: m, state: r, revision: $, origin: v, origin_label: S, base: T, author: c, author_label: b, updated_at: U, used_by: p };
}
function Xl() {
  const a = Object.fromEntries(["message", "base", "part", "asset"].map((g) => [g, { rows: ge([]), loaded: _(!1), loading: _(!1), error: _(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map();
  let o = 0;
  function u(g) {
    const p = d.get(g);
    if (p) return p;
    const h = a[g];
    h.loading.value = !0;
    const y = o, k = (async () => {
      try {
        const w = [];
        let L;
        do {
          const z = await se.page({ kind: g, cursor: L });
          w.push(...z.items), L = z.next_cursor;
        } while (L);
        h.rows.value = w, h.loaded.value = !0, h.stale = y !== o, h.error.value = "";
      } catch (w) {
        h.error.value = oe(w, "The mail library could not be loaded.");
      } finally {
        h.loading.value = !1, d.delete(g), y !== o && h.users > 0 && m(g);
      }
    })();
    return d.set(g, k), k;
  }
  function m(g) {
    const p = a[g];
    (!p.loaded.value || p.stale) && !p.loading.value && u(g);
  }
  function r(...g) {
    cl(() => {
      for (const p of g)
        a[p].users++, m(p);
    }), la(() => {
      for (const p of g) a[p].users--;
    });
  }
  function $(g, p, h) {
    const y = a[g];
    if (!y.loaded.value) return;
    const k = y.rows.value.filter((w) => w.name !== p);
    h && k.push(h), y.rows.value = k;
  }
  function v() {
    o++;
    for (const [g, p] of Object.entries(a))
      p.stale = p.loaded.value, p.users > 0 && m(g);
  }
  Le("mail.library", v);
  const S = (g, p) => a[g].rows.value.find((h) => h.name === p);
  function T(g, p) {
    const h = S(g, p);
    return h ? h.title : (m(g), a[g].loaded.value ? p : void 0);
  }
  return { kinds: a, use: r, ensure: m, load: u, find: S, title: T, ofKind: (g) => [...a[g].rows.value].sort((p, h) => p.title.localeCompare(h.title)), ready: (g) => a[g].loaded.value, failed: (g) => a[g].error.value, refresh: v, patch: $ };
}
const et = { class: "kx-empty" }, at = { class: "kx-empty-ico" }, lt = { class: "kx-empty-title" }, tt = {
  key: 0,
  class: "kx-empty-sub"
}, $a = /* @__PURE__ */ le({
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
        i(e(N), {
          icon: a.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", lt, f(a.title), 1),
      a.hint || d.$slots.hint ? (l(), n("p", tt, [
        Ee(d.$slots, "hint", {}, () => [
          K(f(a.hint), 1)
        ])
      ])) : V("", !0),
      a.cta ? (l(), E(e(D), {
        key: 1,
        label: a.cta,
        onClick: o[0] || (o[0] = (u) => d.$emit("cta"))
      }, ba({ _: 2 }, [
        a.ctaIcon ? {
          name: "icon",
          fn: A(({ class: u }) => [
            i(e(N), {
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
    const v = Ya(r).find((S) => S === m) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(u), section: v };
  } catch {
    return { name: "library", section: "all" };
  }
}
const nt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", ua = `<meta http-equiv="Content-Security-Policy" content="${nt}">`;
function _a(a, d) {
  let o = a;
  for (const [r, $] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join($);
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
}, fa = /* @__PURE__ */ le({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = ye(), m = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (c) => o.title(c.kind, c.name), $ = (c) => !!c && !!d.draft && c.kind === d.draft.kind && c.name === d.draft.name, v = O(() => {
      const { resource: c, face: b, previewOf: U } = d.problem, g = b ? m[b] : "";
      if (c && d.draft && d.draft.kind !== "message" && c.kind === "message" && c.name === U)
        return `${r(c) ?? "The message"} does not render with your changes.`;
      if (d.problem.tooLarge) {
        const p = !c || $(c) ? d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it" : r(c) ?? "a resource it uses";
        return `The ${g || "content"} of ${p} is larger than Mail can send. Keep each rendered face under ${qe(d.problem.tooLarge)}.`;
      }
      if (!c || $(c)) {
        const p = d.draft ? `this ${be[d.draft.kind].toLowerCase()}` : "it";
        return g ? `The ${g} of ${p} does not render.` : `${p[0].toUpperCase()}${p.slice(1)} does not render.`;
      }
      return `${r(c) ?? "A resource it uses"} does not render${g ? ` (${g})` : ""}.`;
    }), S = O(() => d.problem.candidates ?? []);
    function T(c) {
      c.kind === "asset" ? u({ name: "library", section: "assets", asset: c.name }) : u({ name: "resource", kind: c.kind, resource: c.name, section: "content" });
    }
    return (c, b) => (l(), n("div", ot, [
      t("p", rt, [
        i(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, f(v.value), 1)
      ]),
      a.problem.tooLarge ? V("", !0) : (l(), n("code", ut, f(a.problem.engine ?? a.problem.message), 1)),
      S.value.length ? (l(), n("p", dt, [
        b[0] || (b[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(J, null, me(S.value, (U) => (l(), n(J, {
          key: U.kind + U.name
        }, [
          $(U) ? (l(), n("span", ct, "This " + f(e(be)[U.kind].toLowerCase()), 1)) : r(U) === void 0 ? (l(), E(e(Re), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), E(e(D), {
            key: 2,
            link: "",
            size: "small",
            label: r(U),
            class: "mail-inline-link",
            onClick: (g) => T(U)
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
  if (!(a instanceof gl)) return;
  const d = a.details ?? {}, o = xe(a);
  if (o === "mail_resource_in_use") {
    const T = Array.isArray(d.messages) ? d.messages.filter((b) => typeof b == "string") : [], c = d.dependent;
    return {
      message: a.message,
      dependents: T,
      references: Array.isArray(d.resources) ? d.resources.filter(De) : void 0,
      face: Na.find((b) => b === c?.face),
      resource: De(c?.resource) ? c.resource : void 0
    };
  }
  const u = Na.find((T) => T === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!u) return;
  const m = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((T) => typeof T == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((T) => {
    const c = T;
    return De(c.resource) && typeof c.message == "string" ? [{ name: c.resource.name, message: c.message }] : [];
  }) : [], $ = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(De) : [], v = typeof d.engine_message == "string" ? d.engine_message : void 0, S = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: a.message,
    engine: v,
    tooLarge: S,
    face: u,
    resource: De(d.resource) ? d.resource : void 0,
    dependents: m.length ? m : void 0,
    reasons: r.length ? r : void 0,
    candidates: $.length ? $ : void 0
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
}, pt = ["data-name"], ht = { class: "mail-gallery-title" }, gt = { class: "mail-sub" }, kt = {
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
    const o = a, u = d, { go: m } = ye();
    Se(() => o.visible);
    const r = _([]), $ = _(), v = _(), S = _(!1), T = _("");
    let c = 0, b = [], U = 0, g;
    async function p(C, x) {
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
    function h(C) {
      for (; C === c && U < Ut && b.length; ) {
        const x = b.shift();
        x.state === "waiting" && (U++, p(x, C).finally(() => {
          U--, h(C);
        }));
      }
    }
    function y(C) {
      C.state !== "waiting" || b.includes(C) || (b.push(C), h(c));
    }
    const k = _();
    function w() {
      if (g?.disconnect(), typeof IntersectionObserver > "u" || !k.value) {
        for (const C of r.value) y(C);
        return;
      }
      g = new IntersectionObserver((C) => {
        for (const x of C) {
          if (!x.isIntersecting) continue;
          const s = r.value.find((R) => R.name === x.target.dataset.name);
          s && y(s);
        }
      }, { root: k.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const C of k.value.querySelectorAll("[data-name]")) g.observe(C);
    }
    async function L(C) {
      S.value = !0, T.value = "";
      try {
        const x = await se.page({ kind: "message", cursor: $.value });
        if (C !== c) return;
        r.value = [...r.value, ...x.items.map((s) => vl({ name: s.name, title: s.title, state: "waiting" }))], $.value = x.next_cursor, v.value = x.total, await Xe(), w();
      } catch (x) {
        C === c && (T.value = oe(x, "The messages could not be listed."));
      } finally {
        C === c && (S.value = !1);
      }
    }
    function z() {
      c++, b = [], g?.disconnect(), g = void 0;
    }
    function q() {
      z(), r.value = [], $.value = v.value = void 0, L(c);
    }
    function I() {
      const C = ++c;
      b = [];
      for (const x of r.value) Object.assign(x, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Xe(() => {
        C === c && w();
      });
    }
    Q(() => o.visible, (C) => {
      C ? q() : z();
    }), la(z);
    const P = O(() => r.value.filter((C) => C.state === "ready" || C.state === "failed").length), ee = O(() => r.value.filter((C) => C.state === "failed").length), ae = O(() => {
      if (!r.value.length) return "";
      const C = `${P.value} of ${he(v.value ?? r.value.length, "message")} rendered`;
      return ee.value ? `${C}, ${ee.value} with a problem.` : C + ".";
    });
    function H(C) {
      u("close"), m({ name: "resource", kind: "message", resource: C, section: "content" });
    }
    const j = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (C, x) => (l(), E(e(Ie), {
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
          i(e(N), {
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
          onClick: I
        }, {
          icon: A(() => [
            i(e(N), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: A(() => [
        r.value.length ? (l(), n("div", ft, [
          t("span", null, f(ae.value), 1),
          i(e(Al), {
            value: Math.round(P.value / (v.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : V("", !0),
        S.value && !r.value.length ? (l(), n("p", bt, [
          i(e(N), {
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
          (l(!0), n(J, null, me(r.value, (s) => (l(), n("li", {
            key: s.name,
            "data-name": s.name,
            class: ue(["mail-gallery-tile", { "mail-gallery-failed": s.state === "failed" }])
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + s.title,
              onClick: (R) => H(s.name)
            }, {
              default: A(() => [
                t("span", ht, f(s.title), 1),
                t("span", gt, f(s.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            s.warning ? (l(), n("p", kt, [
              i(e(N), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              K(f(s.warning), 1)
            ])) : V("", !0),
            t("div", $t, [
              s.state === "waiting" ? (l(), n("p", wt, "Renders when shown.")) : s.state === "loading" ? (l(), n("p", _t, [
                i(e(N), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                x[4] || (x[4] = K("Rendering…", -1))
              ])) : s.state === "failed" ? (l(), n("div", xt, [
                s.problem ? (l(), E(fa, {
                  key: 0,
                  problem: s.problem,
                  draft: { kind: "message", name: s.name }
                }, null, 8, ["problem", "draft"])) : (l(), n("p", Ct, f(s.failure), 1))
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
        $.value || T.value ? (l(), n("div", St, [
          T.value ? (l(), n("span", Tt, f(T.value), 1)) : V("", !0),
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
}), jt = { class: "mail-source" }, At = { key: 0 }, Lt = { key: 1 }, xa = /* @__PURE__ */ le({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(a) {
    return (d, o) => (l(), n("span", jt, [
      a.resource.state === "created" ? (l(), n("span", At, f((a.resource.kind === "asset" ? "Uploaded by " : "Created by ") + e(Ce)(a.resource.author_label, a.resource.author)), 1)) : (l(), n("span", Lt, "Included with " + f(a.resource.origin_label), 1)),
      a.resource.state === "customized" ? (l(), E(e(Oe), {
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
    const d = a, { library: o, go: u, create: m } = ye(), r = O(() => it(d.section));
    Q(r, (G) => {
      G === "message" && o.ensure("base");
    }, { immediate: !0 });
    const $ = _("all"), v = _(""), S = _("");
    let T;
    Q(v, (G) => {
      clearTimeout(T), T = setTimeout(() => {
        S.value = G.trim();
      }, 250);
    }), Q(() => d.section, () => {
      v.value = S.value = "", $.value = "all";
    });
    const c = ge([]), b = _(), U = _(), g = _(!0), p = _(!1), h = _(!1), y = _(!1), k = _(""), w = _(""), L = _(""), z = Ue(), q = () => ({ kind: r.value, state: $.value === "all" ? void 0 : $.value, q: S.value || void 0 });
    async function I(G = !1) {
      const F = z();
      g.value = !0;
      try {
        const W = await se.page(q());
        if (!F()) return;
        c.value = W.items, b.value = W.next_cursor, U.value = W.total, k.value = w.value = L.value = "", y.value = !1, p.value = !0;
      } catch (W) {
        if (!F()) return;
        y.value = Fe(W);
        const de = y.value ? "" : oe(W, "The mail library could not be loaded.");
        G && p.value && !y.value ? L.value = de : k.value = de;
      } finally {
        F() && (g.value = !1);
      }
    }
    async function P() {
      if (g.value || !b.value || h.value) return;
      const G = z();
      h.value = !0, w.value = "";
      try {
        const F = await se.page({ ...q(), cursor: b.value });
        if (!G()) return;
        c.value = [...c.value, ...F.items], b.value = F.next_cursor, U.value = F.total;
      } catch (F) {
        G() && (w.value = oe(F, "More resources could not be loaded."));
      } finally {
        h.value = !1;
      }
    }
    Q([r, $, S], () => {
      I();
    }), ta(() => I(p.value)), Le("mail.library", () => {
      r.value === "message" && o.ensure("base"), I(p.value);
    });
    const ee = O(() => {
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
    }), ae = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], H = O(() => {
      const G = r.value ? be[r.value].toLowerCase() : "resource", F = U.value ?? c.value.length;
      return c.value.length < F ? `${c.value.length} of ${he(F, G)}` : he(F, G);
    });
    function j(G) {
      const F = G.used_by;
      return G.kind === "base" || G.kind === "asset" ? F?.messages ? he(F.messages, "message") : "—" : G.kind === "message" ? F?.recent_sources ? he(F.recent_sources, "recent sender") : "—" : "";
    }
    function C(G) {
      return G.base ? o.title("base", G.base) : "";
    }
    function x(G) {
      G.kind === "asset" ? u({ name: "library", section: "assets", asset: G.name }) : u({ name: "resource", kind: G.kind, resource: G.name, section: "content" });
    }
    const s = O(() => p.value && !k.value && r.value && !c.value.length && $.value === "all" && !S.value), R = _(!1);
    return (G, F) => (l(), n(J, null, [
      i(sa, {
        title: ee.value.title,
        description: ee.value.description
      }, {
        actions: A(() => [
          !r.value || r.value === "message" ? (l(), E(e(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: F[0] || (F[0] = (W) => R.value = !0)
          }, {
            icon: A(() => [
              i(e(N), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          i(e(D), {
            label: r.value ? "New " + e(be)[r.value].toLowerCase() : "New",
            onClick: F[1] || (F[1] = (W) => e(m)({ kind: r.value }))
          }, {
            icon: A(() => [
              i(e(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      y.value ? (l(), n("p", It, [
        i(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        F[9] || (F[9] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : k.value ? (l(), n("div", Nt, [
        t("span", null, f(k.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[2] || (F[2] = (W) => I())
        })
      ])) : V("", !0),
      L.value ? (l(), n("div", zt, [
        t("span", null, f(L.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[3] || (F[3] = (W) => I(!0))
        })
      ])) : g.value && !p.value ? (l(), n("p", Et, [
        i(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        F[10] || (F[10] = K("Loading mail library…", -1))
      ])) : s.value && r.value ? (l(), E($a, {
        key: 4,
        icon: e(pe)[r.value],
        title: "No " + e(ya)[r.value].toLowerCase() + " yet",
        hint: "Create a " + e(be)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + e(be)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: F[4] || (F[4] = (W) => e(m)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : p.value ? (l(), n(J, { key: 5 }, [
        t("div", Ot, [
          i(e(Ve), {
            modelValue: $.value,
            "onUpdate:modelValue": F[5] || (F[5] = (W) => $.value = W),
            options: ae,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          i(e(ga), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(N), {
                    icon: g.value ? "tabler:loader-2" : "tabler:search",
                    class: ue({ spin: g.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: v.value,
                "onUpdate:modelValue": F[6] || (F[6] = (W) => v.value = W),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + ee.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Pt, f(H.value), 1)
        ]),
        c.value.length ? (l(), E(e(ha), {
          key: 1,
          value: c.value,
          "data-key": (W) => W.kind + "/" + W.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": ee.value.title } },
          onRowClick: F[7] || (F[7] = (W) => x(W.data))
        }, {
          default: A(() => [
            i(e(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: W }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: W.title,
                  onClick: Ae((de) => x(W), ["stop"])
                }, null, 8, ["label", "onClick"]),
                W.description ? (l(), n("span", Dt, f(W.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            r.value ? V("", !0) : (l(), E(e(ce), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: A(({ data: W }) => [
                t("span", Bt, [
                  i(e(N), {
                    icon: e(pe)[W.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  K(f(e(be)[W.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), E(e(ce), {
              key: 1,
              header: "Base template"
            }, {
              body: A(({ data: W }) => [
                C(W) === void 0 ? (l(), E(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(J, { key: 1 }, [
                  K(f(C(W)), 1)
                ], 64))
              ]),
              _: 1
            })) : V("", !0),
            i(e(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: W }) => [
                i(xa, { resource: W }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), E(e(ce), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: W }) => [
                K(f(j(W)), 1)
              ]),
              _: 1
            })) : V("", !0),
            i(e(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: W }) => [
                t("span", qt, f(W.state === "original" ? "—" : e(Pa)(W.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", Mt, "Nothing matches. Try another name or a word from the template.")),
        b.value ? (l(), n("div", Ht, [
          w.value ? (l(), n("span", Ft, f(w.value), 1)) : V("", !0),
          i(e(D), {
            label: w.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: h.value,
            disabled: g.value,
            onClick: P
          }, null, 8, ["label", "loading", "disabled"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      i(Rt, {
        visible: R.value,
        onClose: F[8] || (F[8] = (W) => R.value = !1)
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
}, ps = /* @__PURE__ */ le({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, delivery: r } = ye();
    o.draft.kind !== "message" && m.use("message");
    const $ = { message: fe() }, v = _("email"), S = _("desktop"), T = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], c = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], b = O(() => m.ready("message") ? (o.messages ?? m.ofKind("message").map((C) => C.name)).map((C) => ({ value: C, label: m.title("message", C) ?? C })).sort((C, x) => C.label.localeCompare(x.label)) : []), U = _("");
    Q(b, (j) => {
      o.draft.kind !== "message" && (j.some((C) => C.value === U.value) || (U.value = j[0]?.value ?? ""));
    }, { immediate: !0 });
    const g = O(() => o.draft.kind !== "message" && U.value && U.value === b.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), p = O(() => o.draft.kind === "message" ? o.draft.name : U.value), h = ge(), y = _(!1), k = _(), w = _(""), L = Ue();
    let z, q = !1, I = !1;
    async function P() {
      const j = p.value;
      if (!j) return;
      if (q) {
        I = !0;
        return;
      }
      q = !0;
      const C = L();
      y.value = !0;
      try {
        const x = await se.preview(j, [o.draft]);
        if (!C()) return;
        h.value = x, k.value = void 0, w.value = "";
      } catch (x) {
        if (!C()) return;
        const s = He(x);
        k.value = s ? { ...s, previewOf: j } : void 0, w.value = k.value ? "" : oe(x, "The preview could not be rendered.");
      } finally {
        q = !1, C() && (y.value = !1), I && (I = !1, P());
      }
    }
    function ee() {
      clearTimeout(z), z = setTimeout(() => {
        P();
      }, 450);
    }
    Q(() => JSON.stringify(o.draft), ee), Q(p, () => {
      h.value = void 0, P();
    }, { immediate: !0 }), Q(k, (j) => u("problem", j)), la(() => clearTimeout(z));
    const ae = O(() => h.value?.html ? _a(h.value.html, h.value.inline_assets) : ""), H = O(() => {
      const j = r.value?.from;
      return j ? j.name ? `${j.name} <${j.address}>` : j.address : "";
    });
    return (j, C) => (l(), n("section", ls, [
      t("div", ts, [
        i(e(Ve), {
          modelValue: v.value,
          "onUpdate:modelValue": C[0] || (C[0] = (x) => v.value = x),
          options: T,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        v.value === "email" ? (l(), E(e(Ve), {
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
            i(e(N), {
              icon: x.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            K(f(x.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      a.draft.kind !== "message" ? (l(), n("div", ss, [
        t("label", {
          for: $.message
        }, "Preview with", 8, is),
        i(e(Pe), {
          modelValue: U.value,
          "onUpdate:modelValue": C[2] || (C[2] = (x) => U.value = x),
          "input-id": $.message,
          options: b.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !e(m).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        g.value ? (l(), n("small", ns, f(g.value), 1)) : V("", !0)
      ])) : V("", !0),
      y.value && h.value ? (l(), n("p", os, [
        i(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        C[3] || (C[3] = K("Updating the preview…", -1))
      ])) : V("", !0),
      h.value ? (l(), n("dl", rs, [
        H.value ? (l(), n(J, { key: 0 }, [
          C[4] || (C[4] = t("dt", null, "From", -1)),
          t("dd", null, f(H.value), 1)
        ], 64)) : V("", !0),
        C[5] || (C[5] = t("dt", null, "Subject", -1)),
        t("dd", null, f(h.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: ue(["mail-preview-body", ["mail-preview-" + S.value, { "mail-preview-stale": k.value || w.value }]]),
        "aria-busy": y.value
      }, [
        !h.value && y.value ? (l(), n("p", ds, [
          i(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          C[6] || (C[6] = K("Rendering preview…", -1))
        ])) : p.value ? h.value ? (l(), n(J, { key: 2 }, [
          v.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: ae.value,
            title: "Email preview: " + (h.value.subject ?? "")
          }, null, 8, vs)) : (l(), n("pre", ms, f(h.value.text), 1))
        ], 64)) : V("", !0) : (l(), n("p", cs, "Choose a message to see this " + f(a.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, us),
      (l(!0), n(J, null, me(h.value?.warnings ?? [], (x) => (l(), n("p", {
        key: x.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        i(e(N), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, f(e(Oa)(x)), 1)
      ]))), 128)),
      k.value ? (l(), n("p", fs, [
        i(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, f(h.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : w.value ? (l(), n("p", bs, [
        i(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, f(w.value), 1)
      ])) : (l(), n("p", ys, [
        i(e(N), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        K(" " + f(a.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), hs = { class: "kx-modal-head-icon" }, gs = { class: "kx-modal-head-text" }, ks = { class: "kx-modal-head-sub" }, $s = { class: "mail-change-list" }, ws = { class: "mail-muted" }, _s = { class: "mail-field" }, xs = ["for"], Cs = {
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
    const o = a, u = d, { library: m, go: r } = ye(), $ = _(""), v = fe();
    Q(() => o.visible, (b) => {
      b && ($.value = o.suggestedNote ?? "");
    }), Se(() => o.visible);
    const S = O(() => {
      const b = o.saved, U = o.draft, g = [];
      return (b.title !== U.title || b.description !== U.description) && g.push("Name and description"), b.base !== U.base && g.push(`Base template: ${m.title("base", U.base ?? "") ?? U.base}`), b.subject !== U.subject && g.push("Subject"), b.html !== U.html && g.push("HTML"), b.text !== U.text && g.push("Plain text"), (JSON.stringify(b.schema.properties) !== JSON.stringify(U.schema.properties) || JSON.stringify(b.schema.required ?? []) !== JSON.stringify(U.schema.required ?? [])) && g.push(U.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(b.samples) !== JSON.stringify(U.samples) && g.push("Sample values"), g;
    }), T = O(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${be[o.draft.kind].toLowerCase()} changes when you save.`), c = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (b, U) => (l(), E(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !a.busy,
      "close-on-escape": !a.busy,
      class: "mail-dialog",
      pt: c,
      "aria-label": "Review changes",
      "onUpdate:visible": U[3] || (U[3] = (g) => {
        g || u("close");
      })
    }, {
      header: A(() => [
        t("span", hs, [
          i(e(N), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", gs, [
          U[4] || (U[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", ks, f(a.draft.title), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: U[2] || (U[2] = (g) => u("close"))
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
          onSubmit: U[1] || (U[1] = Ae((g) => u("save", $.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            U[5] || (U[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", $s, [
              (l(!0), n(J, null, me(S.value, (g) => (l(), n("li", { key: g }, f(g), 1))), 128))
            ])
          ]),
          t("p", ws, f(T.value) + " The previous version stays in History.", 1),
          t("div", _s, [
            t("label", {
              class: "mail-field-label",
              for: e(v)
            }, "Note for History", 8, xs),
            i(e(ve), {
              id: e(v),
              modelValue: $.value,
              "onUpdate:modelValue": U[0] || (U[0] = (g) => $.value = g),
              placeholder: "What changed and why…",
              disabled: a.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          a.dependents ? (l(), n("div", Cs, [
            i(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Vs, [
              t("strong", null, f(a.dependents.names.length === 1 ? "1 message would break" : a.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, f(a.dependents.reason), 1),
              t("span", Ss, [
                (l(!0), n(J, null, me(a.dependents.names, (g) => (l(), E(e(D), {
                  key: g,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: e(m).title("message", g) ?? g,
                  onClick: (p) => {
                    u("close"), e(r)({ name: "resource", kind: "message", resource: g, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : a.error ? (l(), n("p", Ts, f(a.error), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Za = /* @__PURE__ */ le({
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
    return (o, u) => (l(), E(e(Ll), {
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
                K(f(a.label), 1)
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
}, js = { class: "kx-modal-head-icon" }, As = { class: "kx-modal-head-text" }, Ls = { class: "kx-modal-head-title" }, Is = { class: "mail-field" }, Ns = ["for"], zs = /* @__PURE__ */ le({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(a, { expose: d, emit: o }) {
    const u = a, m = o, { library: r } = ye(), $ = _(), v = _("");
    function S(L) {
      v.value = "", r.ensure("part"), u.face === "html" && r.ensure("asset"), $.value?.toggle(L);
    }
    d({ toggle: S });
    const T = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], c = (L) => ({ label: L, disabled: !0, icon: "tabler:loader-2" });
    async function b(L) {
      v.value = "";
      try {
        m("insert", Zt(await se.get({ kind: "part", name: L })));
      } catch (z) {
        v.value = oe(z, "The part could not be read.");
      }
    }
    const U = _(), g = _(""), p = fe();
    Se(() => !!U.value);
    async function h(L, z) {
      v.value = "";
      try {
        const q = await se.get({ kind: "asset", name: L });
        U.value = { name: L, title: z, width: q.asset?.width }, g.value = z;
      } catch (q) {
        v.value = oe(q, "The image could not be read.");
      }
    }
    function y() {
      U.value && (m("insert", Qt(U.value.name, g.value, U.value.width)), U.value = void 0);
    }
    const k = O(() => {
      const L = Object.entries(u.draft.schema.properties).map(([I]) => ({
        label: I,
        icon: "tabler:variable",
        command: () => m("insert", u.draft.kind === "part" ? `{{ .${I} }}` : es(I))
      })), z = [{
        label: u.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...L, ...T.map((I) => ({
          label: I.label,
          icon: "tabler:world",
          command: () => m("insert", `{{ ${I.name} }}`)
        }))]
      }], q = r.ofKind("part").filter((I) => !(u.draft.kind === "part" && I.name === u.draft.name));
      if (z.push({ label: "Parts", items: r.ready("part") ? q.length ? q.map((I) => ({ label: I.title, icon: pe.part, command: () => {
        b(I.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [c("Loading parts…")] }), u.face === "html") {
        const I = r.ofKind("asset");
        z.push({ label: "Images", items: r.ready("asset") ? I.length ? I.map((P) => ({ label: P.title, icon: pe.asset, command: () => {
          h(P.name, P.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [c("Loading images…")] });
      }
      return u.draft.kind === "base" && z.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => m("insert", as)
      }] }), z;
    }), w = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (L, z) => (l(), n(J, null, [
      i(e(El), {
        ref_key: "menu",
        ref: $,
        model: k.value,
        popup: "",
        "aria-label": "Insert into " + (a.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: A(({ item: q, class: I }) => [
          q.icon ? (l(), E(e(N), {
            key: 0,
            icon: q.icon,
            class: ue(I),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : V("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      v.value ? (l(), n("p", Rs, f(v.value), 1)) : V("", !0),
      i(e(Ie), {
        visible: !!U.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: w,
        "aria-label": "Insert image",
        "onUpdate:visible": z[2] || (z[2] = (q) => {
          q || (U.value = void 0);
        })
      }, {
        header: A(() => [
          t("span", js, [
            i(e(N), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", As, [
            t("span", Ls, "Insert " + f(U.value?.title), 1),
            z[3] || (z[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: A(() => [
          i(e(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: z[1] || (z[1] = (q) => U.value = void 0)
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
            onSubmit: Ae(y, ["prevent"])
          }, [
            t("div", Is, [
              t("label", {
                class: "mail-field-label",
                for: e(p)
              }, "Alternative text", 8, Ns),
              i(e(ve), {
                id: e(p),
                modelValue: g.value,
                "onUpdate:modelValue": z[0] || (z[0] = (q) => g.value = q),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              z[4] || (z[4] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
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
    const d = ca(() => import("./CodeEditor-CIrhfC0V.js")), o = a, { library: u, go: m } = ye();
    u.use("base");
    const r = { base: fe(), title: fe(), description: fe(), face: fe() }, $ = _("html"), v = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], S = O(() => u.ofKind("base").map((h) => ({ value: h.name, label: h.title }))), T = O(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), c = _(), b = _();
    function U(h) {
      c.value?.insert(h);
    }
    const g = O(() => {
      const h = o.problem;
      if (h)
        return h.face === "html" || h.face === "text" || h.face === "subject" ? h.face : $.value;
    }), p = O(() => (o.draft.kind === "message" ? "Body" : "Source") + ($.value === "html" ? ", HTML" : ", plain text"));
    return (h, y) => (l(), n("fieldset", {
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
                "onUpdate:modelValue": y[0] || (y[0] = (k) => a.draft.title = k)
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
                "onUpdate:modelValue": y[1] || (y[1] = (k) => a.draft.description = k)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", qs, [
              y[9] || (y[9] = K("Reference ", -1)),
              t("span", Hs, f(a.draft.name), 1),
              K(", used to " + f(a.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      a.draft.kind === "message" ? (l(), n(J, { key: 0 }, [
        t("div", Fs, [
          t("label", {
            class: "mail-field-label",
            for: r.base
          }, "Base template", 8, Js),
          t("div", Ws, [
            i(e(Pe), {
              modelValue: a.draft.base,
              "onUpdate:modelValue": y[2] || (y[2] = (k) => a.draft.base = k),
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
                  i(e(N), {
                    icon: e(pe).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  k && e(u).title("base", k) === void 0 ? (l(), E(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(J, { key: 1 }, [
                    K(f(e(u).title("base", k)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            a.draft.base ? (l(), E(e(D), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: y[3] || (y[3] = (k) => e(m)({ name: "resource", kind: "base", resource: a.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: ue(["mail-field", { "mail-field-invalid": g.value === "subject" || T.value }])
        }, [
          t("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Ys),
          t("div", Gs, [
            i(e(d), {
              modelValue: a.draft.subject,
              "onUpdate:modelValue": y[4] || (y[4] = (k) => a.draft.subject = k),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          T.value ? (l(), n("small", Zs, "A subject is one line. Remove the line break.")) : a.problem && g.value === "subject" ? (l(), E(fa, {
            key: 1,
            problem: a.problem,
            draft: a.draft
          }, null, 8, ["problem", "draft"])) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: ue(["mail-field", { "mail-field-invalid": a.problem && g.value !== "subject" }])
      }, [
        t("div", Qs, [
          i(e(Ve), {
            modelValue: $.value,
            "onUpdate:modelValue": y[5] || (y[5] = (k) => $.value = k),
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
            onClick: y[6] || (y[6] = (k) => b.value?.toggle(k))
          }, {
            icon: A(() => [
              i(e(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", Xs, [
          $.value === "html" ? (l(), E(e(d), {
            ref_key: "editor",
            ref: c,
            key: "html",
            modelValue: a.draft.html,
            "onUpdate:modelValue": y[7] || (y[7] = (k) => a.draft.html = k),
            label: p.value
          }, null, 8, ["modelValue", "label"])) : (l(), E(e(d), {
            ref_key: "editor",
            ref: c,
            key: "text",
            modelValue: a.draft.text,
            "onUpdate:modelValue": y[8] || (y[8] = (k) => a.draft.text = k),
            label: p.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        a.problem && g.value !== "subject" ? (l(), E(fa, {
          key: 0,
          problem: a.problem,
          draft: a.draft
        }, null, 8, ["problem", "draft"])) : V("", !0)
      ], 2),
      i(zs, {
        ref_key: "inserter",
        ref: b,
        draft: a.draft,
        face: $.value,
        onInsert: U
      }, null, 8, ["draft", "face"])
    ], 8, Es));
  }
}), ai = { class: "mail-value-field" }, li = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, za = /* @__PURE__ */ le({
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
    const o = a, u = Ea(a, "modelValue"), m = d, r = (k) => k === null || ["string", "number", "boolean"].includes(typeof k), $ = (k) => k === void 0 || Array.isArray(k) && k.every(r), v = (k) => k === void 0 || !!k && typeof k == "object" && !Array.isArray(k) && Object.values(k).every((w) => typeof w == "string"), S = _(!1);
    Q(() => o.type, () => {
      S.value = !1;
    });
    const T = O(() => S.value ? "written" : o.type === "array" ? $(u.value) ? "list" : "written" : o.type === "object" ? v(u.value) ? "record" : "written" : o.type), c = O({
      get: () => Array.isArray(u.value) ? u.value.map((k) => k === null ? "" : String(k)).join(`
`) : "",
      set: (k) => {
        const w = k.split(`
`).map((z) => z.trim()).filter(Boolean), L = o.itemType === "number" || o.itemType === "integer";
        u.value = w.length ? w.map((z) => L && z !== "" && !Number.isNaN(Number(z)) ? Number(z) : z) : void 0;
      }
    }), b = _([]);
    Q(u, (k) => {
      if (T.value !== "record") return;
      const w = k ?? {};
      JSON.stringify(Object.fromEntries(b.value.filter((L) => L.key).map((L) => [L.key, L.value]))) !== JSON.stringify(w) && (b.value = Object.entries(w).map(([L, z]) => ({ key: L, value: z })));
    }, { immediate: !0 });
    function U() {
      const k = b.value.filter((w) => w.key.trim());
      u.value = k.length ? Object.fromEntries(k.map((w) => [w.key.trim(), w.value])) : void 0;
    }
    const g = _(""), p = _("");
    Q([u, T], () => {
      T.value === "written" && !p.value && (g.value = u.value === void 0 ? "" : JSON.stringify(u.value, null, 2));
    }, { immediate: !0 });
    function h(k) {
      if (g.value = k, !k.trim()) {
        p.value = "", u.value = void 0;
        return;
      }
      try {
        const w = JSON.parse(k), L = o.type === "array" ? Array.isArray(w) : !!w && typeof w == "object" && !Array.isArray(w);
        p.value = L ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', L && (u.value = w);
      } catch {
        p.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    Q(p, (k) => m("invalid", k), { immediate: !0 });
    const y = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (k, w) => (l(), n("div", ai, [
      T.value === "string" ? (l(), E(e(ve), {
        key: 0,
        "model-value": typeof u.value == "string" ? u.value : "",
        "aria-label": a.label,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": w[0] || (w[0] = (L) => u.value = L || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "number" || T.value === "integer" ? (l(), E(e(Pl), {
        key: 1,
        "model-value": typeof u.value == "number" ? u.value : null,
        "aria-label": a.label,
        "max-fraction-digits": T.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": w[1] || (w[1] = (L) => u.value = L ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : T.value === "boolean" ? (l(), E(e(Ve), {
        key: 2,
        "model-value": typeof u.value == "boolean" ? u.value : null,
        options: y,
        "option-label": "label",
        "option-value": "value",
        "aria-label": a.label,
        disabled: a.disabled,
        "onUpdate:modelValue": w[2] || (w[2] = (L) => u.value = typeof L == "boolean" ? L : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : T.value === "list" ? (l(), E(e(va), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": w[3] || (w[3] = (L) => c.value = L),
        "aria-label": a.label,
        rows: "3",
        "auto-resize": "",
        disabled: a.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : T.value === "record" ? (l(), n(J, { key: 4 }, [
        (l(!0), n(J, null, me(b.value, (L, z) => (l(), n("div", {
          key: z,
          class: "mail-value-entry"
        }, [
          i(e(ve), {
            modelValue: L.key,
            "onUpdate:modelValue": [(q) => L.key = q, U],
            "aria-label": a.label + ", name " + (z + 1),
            placeholder: "Name",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(e(ve), {
            modelValue: L.value,
            "onUpdate:modelValue": [(q) => L.value = q, U],
            "aria-label": a.label + ", value " + (z + 1),
            placeholder: "Value",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          i(e(D), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (L.key || "entry"),
            disabled: a.disabled,
            onClick: (q) => {
              b.value.splice(z, 1), U();
            }
          }, {
            icon: A(() => [
              i(e(N), {
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
          onClick: w[4] || (w[4] = (L) => b.value.push({ key: "", value: "" }))
        }, {
          icon: A(() => [
            i(e(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(J, { key: 5 }, [
        i(e(va), {
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
        p.value ? (l(), n("small", li, f(p.value), 1)) : V("", !0)
      ], 64)),
      (a.type === "array" || a.type === "object") && T.value !== "written" ? (l(), E(e(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: a.disabled,
        onClick: w[5] || (w[5] = (L) => S.value = !0)
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
}, pi = { class: "mail-field" }, hi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, gi = /* @__PURE__ */ le({
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
    function $(p) {
      const h = new Set(p.schema.required ?? []);
      return Object.entries(p.schema.properties).map(([y, k]) => {
        const w = k.items;
        return {
          id: r++,
          name: y,
          schema: k,
          title: typeof k.title == "string" ? k.title : "",
          type: m.some((L) => L.value === k.type) ? k.type : "string",
          itemType: typeof w?.type == "string" ? w.type : void 0,
          required: h.has(y),
          description: typeof k.description == "string" ? k.description : "",
          sample: p.samples[y],
          fallback: k.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const v = _([]);
    v.value = $(o.draft), Q(() => o.draft, (p) => {
      v.value = $(p);
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
    const c = O(() => v.value.map((p) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(p.name) ? v.value.some((h) => h !== p && h.name === p.name) ? "Another one has this name." : p.valueErrors.sample || p.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    Q(c, (p) => u("invalid", p.some(Boolean)), { immediate: !0 }), Q(v, (p) => {
      if (c.value.some(Boolean)) return;
      const h = {}, y = {};
      for (const w of p) {
        const L = { ...w.schema, type: w.type };
        for (const [z, q] of [["title", w.title], ["description", w.description]])
          q ? L[z] = q : delete L[z];
        w.fallback !== void 0 ? L.default = w.fallback : delete L.default, h[w.name] = L, w.sample !== void 0 && (y[w.name] = w.sample);
      }
      const k = p.filter((w) => w.required).map((w) => w.name);
      o.draft.schema = { ...o.draft.schema, properties: h, required: k.length ? k : void 0 }, o.draft.samples = y;
    }, { deep: !0 });
    function b() {
      let p = v.value.length + 1;
      for (; v.value.some((h) => h.name === `value_${p}`); ) p++;
      v.value.push({
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
    const U = O(() => o.draft.kind === "part"), g = O(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${vt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (p, h) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      t("legend", si, f(a.label), 1),
      g.value ? (l(), n("p", ii, f(g.value), 1)) : V("", !0),
      v.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": a.label
      }, [
        (l(!0), n(J, null, me(v.value, (y, k) => (l(), n("li", {
          key: y.id,
          class: ue(["mail-variable-card", { "mail-variable-invalid": c.value[k] }])
        }, [
          t("div", ri, [
            t("label", ui, [
              h[0] || (h[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              i(e(ve), {
                modelValue: y.name,
                "onUpdate:modelValue": (w) => y.name = w,
                class: "mail-mono-input",
                invalid: !!c.value[k] && !y.valueErrors.sample && !y.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", di, [
              h[1] || (h[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              i(e(ve), {
                modelValue: y.title,
                "onUpdate:modelValue": (w) => y.title = w,
                placeholder: y.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", ci, [
              t("span", {
                id: "type-" + y.id,
                class: "mail-field-label"
              }, "Type", 8, vi),
              i(e(Pe), {
                "model-value": y.type,
                options: m,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + y.id,
                "onUpdate:modelValue": (w) => T(y, w)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", mi, [
              i(e(Ol), {
                modelValue: y.required,
                "onUpdate:modelValue": (w) => y.required = w,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              h[2] || (h[2] = t("span", null, "Required", -1))
            ]),
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + y.name,
              title: "Remove " + y.name,
              onClick: (w) => v.value.splice(k, 1)
            }, {
              icon: A(() => [
                i(e(N), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", fi, [
            h[3] || (h[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            i(e(ve), {
              modelValue: y.description,
              "onUpdate:modelValue": (w) => y.description = w,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", bi, [
            U.value ? (l(), n("div", yi, [
              h[4] || (h[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              i(za, {
                modelValue: y.fallback,
                "onUpdate:modelValue": (w) => y.fallback = w,
                type: y.type,
                "item-type": y.itemType,
                label: "Default of " + y.name,
                onInvalid: (w) => y.valueErrors.fallback = w
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : V("", !0),
            t("div", pi, [
              h[5] || (h[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              i(za, {
                modelValue: y.sample,
                "onUpdate:modelValue": (w) => y.sample = w,
                type: y.type,
                "item-type": y.itemType,
                label: "Sample value of " + y.name,
                onInvalid: (w) => y.valueErrors.sample = w
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          c.value[k] ? (l(), n("small", hi, f(y.name) + ": " + f(c.value[k]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, oi)) : (l(), n("p", ni, f(a.draft.title) + " takes no " + f(a.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        i(e(D), {
          label: U.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: b
        }, {
          icon: A(() => [
            i(e(N), {
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
    const o = ca(() => import("./CodeEditor-CIrhfC0V.js")), u = ca(() => import("./DiffView-CjA70e3n.js")), m = a, r = d;
    Se(() => !!m.revision);
    const $ = _("version"), v = _("html");
    Q(() => m.revision, (h) => {
      h && ($.value = m.compare ? "compare" : "version", v.value = "html");
    });
    const S = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], T = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], c = O(() => m.revision?.revision === m.current.revision), b = O(() => {
      const h = m.revision;
      return h ? m.included || h.state === "original" && h.action === "reset" ? `${m.current.title}: the version included with ${m.current.origin_label}` : `${m.current.title}, version ${h.version}` : "";
    }), U = O(() => m.revision ? v.value === "html" ? m.revision.content.html : m.revision.content.text : ""), g = O(() => v.value === "html" ? m.current.html : m.current.text), p = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (h, y) => (l(), E(e(Ie), {
      visible: !!a.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: p,
      "aria-label": b.value,
      closable: !1,
      "close-on-escape": !a.busy,
      "onUpdate:visible": y[5] || (y[5] = (k) => {
        k || r("close");
      })
    }, {
      header: A(() => [
        t("span", ki, [
          i(e(N), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        a.revision ? (l(), n("span", $i, [
          t("span", wi, f(b.value), 1),
          a.included ? (l(), n("span", _i, "Compare it with your customized version, or reset to it.")) : (l(), n("span", xi, f(e(pa)[a.revision.action]) + " by " + f(e(Ce)(a.revision.author_label, a.revision.author)) + " · " + f(e(Je)(a.revision.created_at)), 1))
        ])) : V("", !0)
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: y[2] || (y[2] = (k) => r("close"))
        }, null, 8, ["disabled"]),
        a.revision && a.included ? (l(), E(e(D), {
          key: 0,
          label: "Reset to original",
          loading: a.busy,
          onClick: y[3] || (y[3] = (k) => r("reset"))
        }, {
          icon: A(() => [
            i(e(N), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : a.revision && !c.value ? (l(), E(e(D), {
          key: 1,
          label: "Restore this version",
          loading: a.busy,
          onClick: y[4] || (y[4] = (k) => r("restore", a.revision))
        }, {
          icon: A(() => [
            i(e(N), {
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
            c.value ? V("", !0) : (l(), E(e(Ve), {
              key: 0,
              modelValue: $.value,
              "onUpdate:modelValue": y[0] || (y[0] = (k) => $.value = k),
              options: S,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            i(e(Ve), {
              modelValue: v.value,
              "onUpdate:modelValue": y[1] || (y[1] = (k) => v.value = k),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          a.revision.content.subject !== void 0 && $.value === "version" ? (l(), n("p", Si, [
            y[6] || (y[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            y[7] || (y[7] = K()),
            t("span", Ti, f(a.revision.content.subject), 1)
          ])) : V("", !0),
          $.value === "version" ? (l(), n("div", Ui, [
            (l(), E(e(o), {
              key: v.value,
              "model-value": U.value,
              label: b.value + (v.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), E(e(u), {
            key: "diff-" + v.value,
            before: U.value,
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
      t("span", null, f(a.error), 1),
      i(e(D), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o[0] || (o[0] = (u) => d.$emit("retry"))
      })
    ])) : a.loading && !a.revisions.length ? (l(), n("p", Ai, [
      i(e(N), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = K("Loading history…", -1))
    ])) : a.revisions.length ? (l(), n("ol", Ii, [
      (l(!0), n(J, null, me(a.revisions, (u) => (l(), n("li", {
        key: u.revision,
        class: "mail-history-row"
      }, [
        t("div", Ni, [
          t("div", zi, [
            t("span", Ei, [
              K(" Version " + f(u.version) + " · " + f(e(pa)[u.action]) + f(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.revision === a.resource.revision ? (l(), E(e(Oe), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Oi, f(e(Ce)(u.author_label, u.author)) + " · " + f(e(Je)(u.created_at)), 1),
            u.note ? (l(), n("span", Pi, f(u.note), 1)) : V("", !0)
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
                i(e(N), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            u.revision !== a.resource.revision ? (l(), E(e(D), {
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
                i(e(N), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
          ])
        ])
      ]))), 128))
    ])) : (l(), n("p", Li, f(a.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Bi = { class: "kx-modal-head-icon mail-head-warn" }, qi = { class: "kx-modal-head-text" }, Hi = { class: "kx-modal-head-title" }, Fi = { class: "mail-dialog-text" }, Ji = {
  key: 0,
  class: "mail-list"
}, Qa = /* @__PURE__ */ le({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a;
    Se(() => !!o.refusal);
    const u = d, m = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r($) {
      u("close"), $();
    }
    return ($, v) => (l(), E(e(Ie), {
      visible: !!a.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: m,
      role: "alertdialog",
      "aria-label": a.refusal?.header,
      "onUpdate:visible": v[1] || (v[1] = (S) => {
        S || u("close");
      })
    }, {
      header: A(() => [
        t("span", Bi, [
          i(e(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", qi, [
          t("span", Hi, f(a.refusal?.header), 1)
        ])
      ]),
      footer: A(() => [
        i(e(D), {
          label: "Close",
          autofocus: "",
          onClick: v[0] || (v[0] = (S) => u("close"))
        })
      ]),
      default: A(() => [
        t("p", Fi, f(a.refusal?.message), 1),
        a.refusal?.links.length ? (l(), n("ul", Ji, [
          (l(!0), n(J, null, me(a.refusal.links, (S) => (l(), n("li", {
            key: S.label
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (T) => r(S.open)
            }, {
              default: A(() => [
                i(e(N), {
                  icon: S.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, f(S.label), 1)
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
    const d = a, { library: o, go: u, capabilities: m } = ye(), r = O(() => (d.resource.used_by?.messages ?? []).map((v) => ({
      name: v,
      title: o.title("message", v)
    }))), $ = O(() => d.resource.used_by?.recent_senders ?? []);
    return (v, S) => (l(), n("div", Wi, [
      a.resource.kind === "base" || a.resource.kind === "asset" ? (l(), n("section", Ki, [
        S[1] || (S[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", Gi, [
          (l(!0), n(J, null, me(r.value, (T) => (l(), n("li", {
            key: T.name
          }, [
            i(e(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (c) => e(u)({ name: "resource", kind: "message", resource: T.name, section: "content" })
            }, {
              default: A(() => [
                i(e(N), {
                  icon: e(pe).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                T.title === void 0 ? (l(), E(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", Zi, f(T.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Yi, "No messages " + f(a.resource.kind === "asset" ? "show" : "use") + " " + f(a.resource.title) + ".", 1))
      ])) : a.resource.kind === "message" ? (l(), n("section", Qi, [
        t("div", Xi, [
          S[2] || (S[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          e(m)?.administer_delivery ? (l(), E(e(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: S[0] || (S[0] = (T) => e(u)({ name: "activity", template: a.resource.name }))
          })) : V("", !0)
        ]),
        $.value.length ? (l(), n("ul", an, [
          (l(!0), n(J, null, me($.value, (T) => (l(), n("li", {
            key: T.sender + (T.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            i(e(N), {
              icon: T.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", ln, [
              t("span", null, f(e(Ce)(T.sender_label, T.sender)), 1),
              T.origin ? (l(), n("span", tn, f(e(ia)(T.origin)), 1)) : V("", !0)
            ]),
            t("span", sn, f(e(he)(T.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", en, "Nobody has sent " + f(a.resource.title) + " recently.", 1))
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
}, pn = { class: "mail-customized-text" }, hn = { class: "mail-editor-layout" }, gn = /* @__PURE__ */ le({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(a) {
    const d = a, { library: o, capabilities: u, delivery: m, go: r, create: $, setDirty: v, setTitle: S } = ye(), T = O(() => ({ kind: d.kind, name: d.name })), c = ge(), b = _(), U = _(!0), g = _(!1), p = _(!1), h = _(""), y = _(), k = Ue(), w = O(() => !!b.value && !!c.value && !Kt(b.value, c.value));
    Q(w, (B) => v(B), { immediate: !0 }), la(() => v(!1));
    async function L(B = {}) {
      const M = k();
      try {
        const Y = await se.get(T.value);
        if (!M()) return;
        const ne = B.keepDraft && w.value;
        if (ne && c.value && Y.revision !== c.value.revision) {
          y.value = { revision: Y.revision, by: Ce(Y.author_label, Y.author) || "Someone" };
          return;
        }
        c.value = Y, ne || (b.value = _e(Y), z.value = void 0), S(Y.title), y.value = void 0, g.value = p.value = !1, h.value = "";
      } catch (Y) {
        if (!M()) return;
        g.value = ea(Y), p.value = Fe(Y), h.value = g.value || p.value ? "" : oe(Y, "This resource could not be loaded."), g.value && (c.value = void 0, b.value = void 0);
      } finally {
        M() && (U.value = !1);
      }
    }
    const z = _(), q = ge([]), I = _(!1), P = _(""), ee = Ue();
    async function ae() {
      const B = ee();
      I.value = !0;
      try {
        const M = await se.history(T.value);
        if (!B()) return;
        q.value = M, P.value = "";
      } catch (M) {
        if (!B()) return;
        P.value = ea(M) ? "" : oe(M, "History could not be loaded.");
      } finally {
        B() && (I.value = !1);
      }
    }
    async function H() {
      await Promise.all([L({ keepDraft: !0 }), ae()]);
    }
    ta(H), Le("mail.library", () => {
      H();
    });
    const j = _(), C = _(""), x = _(!1), s = _(""), R = _(), G = O(() => c.value?.title ?? d.name), F = O(() => {
      const B = c.value, M = G.value, Y = B?.used_by?.messages?.length ?? 0, ne = B?.used_by?.recent_senders?.find((ra) => ra.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ne?.origin ? ` Sent recently by “${ia(ne.origin)}”.` : "") },
          base: { title: "Layout", description: Y ? `The frame around the ${he(Y, "message")} that ${Y === 1 ? "uses" : "use"} ${M}.` : `The frame around messages that use ${M}.` },
          part: { title: "Content", description: `Shown wherever ${M} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${M} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${M}.` : d.kind === "base" ? `Messages that use ${M}.` : `Templates that include ${M}.`
        },
        history: { title: "History", description: `Every saved version of ${M}, newest first.` }
      }[d.section];
    }), W = O(() => {
      const B = c.value;
      return B?.state !== "customized" ? "" : `Customized by ${Ce(B.author_label, B.author)} ${kl(B.updated_at)} from the version included with ${B.origin_label}.`;
    }), de = O(() => {
      const B = c.value;
      if (!B?.original) return;
      const { kind: M, name: Y, title: ne, description: re } = B;
      return {
        kind: M,
        name: Y,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: M, name: Y, title: ne, description: re, ...B.original }
      };
    }), ie = _(), $e = _(), te = _(!1), X = O(() => $e.value ?? ie.value);
    Q(() => JSON.stringify(b.value), () => {
      $e.value = void 0;
    });
    const Z = O(() => d.kind === "message" && /[\r\n]/.test(b.value?.subject ?? "")), we = O(() => !!X.value || te.value || !!y.value || Z.value), Ca = O(() => y.value ? "Discard your changes to load the newer version first." : te.value ? "Fix the variables first." : Z.value ? "Put the subject on one line first." : X.value ? "Fix the error first." : ""), Va = _(!1);
    function na(B, M) {
      Va.value = ["invalid_config", "from_name_invalid"].includes(xe(B) ?? ""), x.value = ["mail_revision_conflict", "mail_preview_stale"].includes(xe(B) ?? ""), x.value && H(), C.value = oe(B, M);
    }
    function Sa() {
      if (!c.value) return;
      const B = !!y.value;
      b.value = _e(c.value), y.value = void 0, $e.value = void 0, z.value = void 0, B && L();
    }
    const Ne = _(!1), We = _(""), Ke = _();
    function al() {
      We.value = "", Ke.value = void 0, Ne.value = !0;
    }
    async function ll(B) {
      const M = c.value, Y = b.value;
      if (!(!M || !Y || j.value !== void 0)) {
        j.value = "save", We.value = C.value = s.value = "", Ke.value = void 0;
        try {
          const ne = z.value, re = ne && JSON.stringify(Y) === JSON.stringify({ ..._e(ne.content), kind: M.kind, name: M.name }), ke = re ? await se.restore(T.value, ne.revision, M.revision, B || void 0) : await se.update(Y, M.revision, B || void 0);
          c.value = { ...M, ...ke }, b.value = _e(c.value), Ne.value = !1, s.value = re ? `Version ${ne.version} from ${Je(ne.created_at)} is now in effect.` : `Saved ${ke.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, z.value = void 0, await H();
        } catch (ne) {
          const re = He(ne), ke = re?.resource?.kind === Y.kind && re.resource.name === Y.name;
          re?.dependents?.length && !ke ? Ke.value = { names: re.dependents, reason: re.reasons?.[0]?.message ?? re.message } : re ? ($e.value = re, Ne.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes(xe(ne) ?? "") ? (Ne.value = !1, await L({ keepDraft: !0 })) : We.value = oe(ne, `${Y.title} could not be saved.`);
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
    const Ye = O(() => w.value ? "Save your changes to send a test." : u.value?.send ? m.value && !m.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
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
          c.value = await se.reset(T.value, B.revision), b.value = _e(c.value), s.value = `${B.title} is back to the original. Your changes are in History.`, await H();
        } catch (Y) {
          na(Y, `${B.title} could not be reset.`);
        } finally {
          j.value = void 0;
        }
      }
    }
    const Me = _(), Ua = _(!1), Ra = _(!1);
    function ja(B, M = !1, Y = !1) {
      Ua.value = M, Ra.value = Y, Me.value = B;
    }
    async function Aa(B) {
      const M = c.value;
      if (!M || j.value !== void 0 || w.value && !await Te.confirm({
        header: `Replace your unsaved changes with version ${B.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      b.value = { ..._e(B.content), kind: M.kind, name: M.name }, z.value = B, Me.value = void 0, C.value = "";
      const Y = `Version ${B.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? s.value = Y : (oa = Y, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function La(B, M, Y) {
      const ne = M.map((ke) => o.title("message", ke) ?? ke), re = B.kind === "base" ? "use" : "include";
      R.value = {
        header: `${B.title} is in use`,
        message: `${he(M.length, "message")} ${M.length === 1 ? re + "s" : re} it: ${ne.join(", ")}. Remove it from ${M.length === 1 ? "that message" : "them"} first.`,
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
          await se.remove(T.value, B.revision), v(!1), r({ name: "library", section: ma(d.kind) });
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
      B && $({ kind: d.kind, from: { kind: B.kind, name: B.name } });
    }
    const nl = O(() => d.kind === "base" ? c.value?.used_by?.messages : void 0), Ge = O(() => j.value === "save");
    L(), Q(() => d.section, (B) => {
      B === "history" && !q.value.length && ae();
    }, { immediate: !0 });
    let oa = "";
    return Q(() => d.section, () => {
      s.value = oa, oa = "", C.value = "";
    }), (B, M) => (l(), n(J, null, [
      g.value ? (l(), E($a, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + e(ya)[a.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: M[0] || (M[0] = (Y) => e(r)({ name: "library", section: e(ma)(a.kind) }))
      }, null, 8, ["cta"])) : p.value ? (l(), n("p", on, [
        i(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[11] || (M[11] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(J, { key: 2 }, [
        i(sa, {
          title: F.value.title,
          description: F.value.description
        }, ba({ _: 2 }, [
          c.value ? {
            name: "actions",
            fn: A(() => [
              w.value ? (l(), E($l, {
                key: 0,
                busy: Ge.value,
                "review-disabled": we.value,
                onDiscard: Sa,
                onReview: al
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(J, { key: 1 }, [
                a.kind === "message" ? (l(), E(e(D), {
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
                    i(e(N), {
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
                    i(e(N), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                c.value.state === "created" ? (l(), E(e(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: j.value === "delete",
                  disabled: j.value !== void 0,
                  onClick: sl
                }, {
                  icon: A(() => [
                    i(e(N), {
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
          t("span", null, f(h.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[1] || (M[1] = (Y) => H())
          })
        ])) : U.value ? (l(), n("p", un, [
          i(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          K("Loading " + f(G.value) + "…", 1)
        ])) : V("", !0),
        c.value && b.value ? (l(), n(J, { key: 2 }, [
          y.value ? (l(), n("p", dn, [
            i(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              K(f(y.value.by) + " saved " + f(c.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              i(e(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Sa
              })
            ])
          ])) : V("", !0),
          w.value && Ca.value && !y.value ? (l(), n("p", cn, f(Ca.value), 1)) : a.kind === "message" && !w.value && Ye.value ? (l(), n("p", vn, [
            K(f(Ye.value) + " ", 1),
            e(u)?.administer_delivery && e(m) && !e(m).configured ? (l(), E(e(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: M[2] || (M[2] = (Y) => e(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          C.value && x.value ? (l(), n("p", mn, [
            i(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            K(f(C.value), 1)
          ])) : C.value ? (l(), n("p", fn, [
            t("span", null, f(C.value), 1),
            Va.value && e(u)?.administer_delivery ? (l(), E(e(D), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[3] || (M[3] = (Y) => e(Te).navigate("/system/settings/mail"))
            })) : V("", !0)
          ])) : V("", !0),
          s.value ? (l(), n("p", bn, [
            i(e(N), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            K(f(s.value), 1)
          ])) : V("", !0),
          W.value && a.section === "content" ? (l(), n("div", yn, [
            i(e(N), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", pn, [
              K(f(W.value), 1),
              w.value ? (l(), n(J, { key: 0 }, [
                K(" Save or discard your changes to reset it.")
              ], 64)) : V("", !0)
            ]),
            de.value ? (l(), E(e(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[4] || (M[4] = (Y) => ja(de.value, !0, !0))
            }, {
              icon: A(() => [
                i(e(N), {
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
              disabled: j.value !== void 0 || w.value,
              onClick: Ta
            }, {
              icon: A(() => [
                i(e(N), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : V("", !0),
          ml(t("div", hn, [
            i(ei, {
              draft: b.value,
              problem: X.value,
              disabled: Ge.value
            }, null, 8, ["draft", "problem", "disabled"]),
            i(ps, {
              draft: b.value,
              messages: nl.value,
              onProblem: M[5] || (M[5] = (Y) => ie.value = Y)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [fl, a.section === "content"]
          ]),
          a.section === "variables" ? (l(), E(gi, {
            key: 7,
            draft: b.value,
            label: F.value.title,
            problem: X.value,
            disabled: Ge.value,
            onInvalid: M[6] || (M[6] = (Y) => te.value = Y)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : a.section === "used-by" ? (l(), E(nn, {
            key: 8,
            resource: c.value
          }, null, 8, ["resource"])) : a.section === "history" ? (l(), E(Di, {
            key: 9,
            resource: c.value,
            revisions: q.value,
            loading: I.value,
            error: P.value,
            busy: typeof j.value == "number" ? j.value : j.value ? -1 : void 0,
            onShow: ja,
            onRestore: Aa,
            onRetry: ae
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      c.value && b.value ? (l(), E(Us, {
        key: 3,
        visible: Ne.value,
        saved: e(_e)(c.value),
        draft: b.value,
        busy: Ge.value,
        error: We.value,
        dependents: Ke.value,
        "suggested-note": z.value ? `Restore version ${z.value.version}` : void 0,
        onClose: M[7] || (M[7] = (Y) => Ne.value = !1),
        onSave: ll
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : V("", !0),
      c.value ? (l(), E(Ri, {
        key: 4,
        revision: Me.value,
        current: c.value,
        compare: Ua.value,
        included: Ra.value,
        busy: typeof j.value == "number" || j.value === "reset",
        onClose: M[8] || (M[8] = (Y) => Me.value = void 0),
        onRestore: Aa,
        onReset: M[9] || (M[9] = (Y) => {
          Me.value = void 0, Ta();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : V("", !0),
      i(Qa, {
        refusal: R.value,
        onClose: M[10] || (M[10] = (Y) => R.value = void 0)
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
}, Xa = /* @__PURE__ */ le({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(a) {
    const d = a, o = _();
    Q(() => [d.name, d.revision], async ([m, r]) => {
      o.value = void 0, o.value = await kn(m, r);
    }, { immediate: !0 });
    const u = O(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (m, r) => (l(), n("span", {
      class: ue(["mail-asset-tile", { "mail-asset-tile-large": a.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: a.alt ?? ""
      }, null, 8, $n)) : (l(), n(J, { key: 1 }, [
        i(e(N), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        u.value ? (l(), n("span", wn, f(u.value), 1)) : V("", !0)
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
    const $ = String(r.component_id || ""), v = String(u.topic || r.topic || "");
    if (d === void 0) {
      if (!$ && (!v.startsWith("component.") || v === "component.")) continue;
    } else if ($ && $ !== d || !$ && v !== `component.${d}`) continue;
    const S = $ || d || v.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: S, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: S } : {
      event: "component.meta.changed",
      component_id: S,
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
    let m = null, r = !1, $ = !1, v = !1;
    const S = (c) => {
      v || (v = !0, m?.(), c ? u(c) : o());
    };
    async function T() {
      if (!v) {
        if (d.cancelled) {
          S(new Qe("cancelled"));
          return;
        }
        if (r) {
          $ = !0;
          return;
        }
        r = !0;
        try {
          const c = await Ma.state(a);
          c.status === "completed" ? S() : c.status === "error" ? S(new Qe(c.error ?? "")) : m || (m = Vn(c.component_id, () => {
            T();
          }), m ? $ = !0 : S(new Qe("")));
        } catch (c) {
          S(c);
        } finally {
          r = !1, $ && !v && ($ = !1, T());
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
}, Bn = 1024 * 1024, el = /* @__PURE__ */ le({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r } = ye(), $ = { file: fe(), title: fe(), name: fe() };
    Se(() => o.visible);
    const v = ["image/png", "image/jpeg", "image/gif"], S = _(), T = _(), c = _(""), b = _(""), U = _(!1), g = _(!1), p = _();
    let h = { cancelled: !1 };
    const y = _(""), k = _(""), w = _("");
    Q(() => o.visible, (H) => {
      if (!H) {
        h.cancelled = !0;
        return;
      }
      h = { cancelled: !1 }, o.replace || m.ensure("asset"), S.value = T.value = void 0, c.value = o.replace?.title ?? "", b.value = o.replace?.name ?? "", U.value = !1, y.value = k.value = w.value = "";
    }), Q(c, (H) => {
      !o.replace && !U.value && (b.value = Da(H));
    });
    function L(H) {
      return new Promise((j) => {
        const C = URL.createObjectURL(H), x = new Image();
        x.onload = () => {
          j({ width: x.naturalWidth, height: x.naturalHeight }), URL.revokeObjectURL(C);
        }, x.onerror = () => {
          j(void 0), URL.revokeObjectURL(C);
        }, x.src = C;
      });
    }
    async function z(H) {
      const j = Array.isArray(H.files) ? H.files[0] : H.files;
      if (k.value = "", S.value = void 0, !!j) {
        if (!v.includes(j.type)) {
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
    function q() {
      return w.value = "", o.replace ? !0 : (Ba.test(b.value) ? m.find("asset", b.value) && (w.value = `An image named ${b.value} already exists. Choose another name or replace ${b.value}.`) : w.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !w.value);
    }
    async function I() {
      if (g.value || !S.value || !c.value.trim() || !q()) return;
      g.value = !0, y.value = "";
      const H = h;
      try {
        p.value = "upload";
        const j = await Ma.add(S.value), C = { name: b.value, upload_id: j, title: c.value.trim(), ...T.value }, x = () => o.replace ? se.replaceAsset(C, o.replace.revision) : se.addAsset(C);
        p.value = "save";
        let s;
        try {
          s = await x();
        } catch (R) {
          if (xe(R) !== "upload_still_processing") throw R;
          p.value = "process", await Sn(j, H), p.value = "save", s = await x();
        }
        m.patch("asset", s.name, Wa(s)), u("done", s), u("close"), o.replace || r({ name: "library", section: "assets", asset: s.name });
      } catch (j) {
        if (H.cancelled) return;
        j instanceof Qe ? y.value = "The image could not be processed. Try another file, or upload it again." : xe(j) === "mail_revision_conflict" && !o.replace ? w.value = `An image named ${b.value} already exists. Choose another name or replace ${b.value}.` : y.value = oe(j, "The image could not be uploaded.");
      } finally {
        g.value = !1, p.value = void 0;
      }
    }
    const P = O(() => p.value === "upload" ? "Uploading the image…" : p.value === "process" ? "Processing the image…" : p.value === "save" ? "Adding it to the library…" : ""), ee = O(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (H, j) => (l(), E(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !g.value || p.value === "process",
      "close-on-escape": !g.value || p.value === "process",
      class: "mail-dialog",
      pt: ae,
      "aria-label": ee.value,
      "onUpdate:visible": j[4] || (j[4] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", Tn, [
          i(e(N), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", Un, [
          t("span", Rn, f(ee.value), 1),
          t("span", jn, f(a.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
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
          onSubmit: Ae(I, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: g.value,
            inert: g.value || void 0
          }, [
            t("div", {
              class: ue(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: $.file
              }, "Image", 8, Ln),
              i(e(Ml), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": S.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: $.file, "aria-label": "Image file" } },
                onSelect: z
              }, {
                chooseicon: A(() => [
                  i(e(N), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: A(() => [
                  t("span", In, f(S.value ? `${S.value.name} · ${e(qe)(S.value.size)}${T.value ? ` · ${T.value.width} × ${T.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              k.value ? (l(), n("small", Nn, f(k.value), 1)) : V("", !0)
            ], 2),
            a.replace ? V("", !0) : (l(), n("div", zn, [
              t("label", {
                class: "mail-field-label",
                for: $.title
              }, "Name", 8, En),
              i(e(ve), {
                id: $.title,
                modelValue: c.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => c.value = C)
              }, null, 8, ["id", "modelValue"])
            ])),
            a.replace ? V("", !0) : (l(), n("div", {
              key: 1,
              class: ue(["mail-field", { "mail-field-invalid": w.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: $.name
              }, "Reference", 8, On),
              i(e(ve), {
                id: $.name,
                modelValue: b.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => b.value = C),
                class: "mail-mono-input",
                invalid: !!w.value,
                "aria-describedby": $.name + "-hint",
                onInput: j[2] || (j[2] = (C) => U.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: $.name + "-hint",
                class: ue(w.value ? "mail-field-error" : "mail-field-hint")
              }, f(w.value || "Templates show it with this name. It cannot change later."), 11, Pn)
            ], 2))
          ], 8, An),
          P.value ? (l(), n("p", Mn, [
            i(e(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            K(f(P.value), 1)
          ])) : V("", !0),
          y.value ? (l(), n("p", Dn, f(y.value), 1)) : V("", !0)
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
    const o = a, u = d, { library: m, go: r } = ye();
    Se(() => !!o.name);
    const $ = _();
    Q(() => !!o.name, (x) => {
      x && (m.ensure("message"), Xe(() => $.value?.focus()));
    }, { immediate: !0 });
    const v = ge(), S = ge([]), T = ge(), c = _(""), b = _(!1), U = _(!1), g = _(""), p = _(""), h = _(""), y = _(), k = _(!1), w = _(!1), L = _(!1), z = _(), q = Ue();
    async function I() {
      const x = o.name, s = q();
      if (!x) {
        v.value = void 0;
        return;
      }
      b.value = !0;
      try {
        const [R, G] = await Promise.all([se.get({ kind: "asset", name: x }), se.history({ kind: "asset", name: x })]);
        if (!s()) return;
        v.value = R, S.value = G, U.value = !1, g.value = "";
        const F = R.used_by?.messages?.[0];
        c.value = F ?? "";
        const W = F ? await se.preview(F, []) : void 0;
        s() && (T.value = W);
      } catch (R) {
        if (!s()) return;
        U.value = ea(R), g.value = U.value ? "" : oe(R, "This image could not be loaded.");
      } finally {
        s() && (b.value = !1);
      }
    }
    Q(() => o.name, () => {
      k.value = w.value = !1, h.value = p.value = "", I();
    }, { immediate: !0 }), Le("mail.library", () => {
      o.name && I();
    });
    const P = O(() => (v.value?.used_by?.messages ?? []).map((x) => ({ name: x, title: m.title("message", x) })));
    async function ee() {
      const x = v.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(x.name)}`), w.value = !0;
        } catch {
          w.value = !1;
        }
    }
    const ae = O(() => v.value ? Ga(v.value.name) : "");
    async function H() {
      try {
        await navigator.clipboard.writeText(ae.value), k.value = !0;
      } catch {
        k.value = !1;
      }
    }
    async function j(x, s) {
      const R = v.value;
      if (!R || y.value !== void 0) return;
      if (x === "delete" && P.value.length) {
        z.value = {
          header: `${R.title} is in use`,
          message: `${he(P.value.length, "message")} ${P.value.length === 1 ? "shows" : "show"} it: ${P.value.map((F) => F.title ?? F.name).join(", ")}. Remove it from ${P.value.length === 1 ? "that message" : "them"} first.`,
          links: P.value.map((F) => ({ label: F.title ?? F.name, open: () => r({ name: "resource", kind: "message", resource: F.name, section: "content" }) }))
        };
        return;
      }
      const G = {
        reset: { header: `Reset ${R.title} to the original?`, message: `The image included with ${R.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${R.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${s?.version} of ${R.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[x];
      if (await Te.confirm({ header: G.header, message: G.message, acceptLabel: G.accept, rejectLabel: "Cancel", ...x === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        y.value = s ? s.revision : x, p.value = h.value = "";
        try {
          if (x === "delete") {
            await se.remove({ kind: "asset", name: R.name }, R.revision), u("close");
            return;
          }
          v.value = x === "reset" ? await se.reset({ kind: "asset", name: R.name }, R.revision) : await se.restore({ kind: "asset", name: R.name }, s.revision, R.revision), h.value = x === "reset" ? `${R.title} is back to the original.` : `Version ${s.version} is shown again everywhere.`, await I();
        } catch (F) {
          const W = He(F);
          if (W?.dependents?.length || W?.references?.length) {
            const de = [...(W.references ?? []).filter((ie) => ie.kind !== "asset")];
            for (const ie of W.dependents ?? []) de.some(($e) => $e.kind === "message" && $e.name === ie) || de.push({ kind: "message", name: ie });
            await Promise.all([...new Set(de.map((ie) => ie.kind))].map((ie) => m.ready(ie) ? void 0 : m.load(ie))), z.value = {
              header: `${R.title} is in use`,
              message: `${he(de.length, "template")} ${de.length === 1 ? "names" : "name"} ${R.title}, in the current version or one kept in History. Remove it from ${de.length === 1 ? "that template" : "them"} first.`,
              links: de.map((ie) => ({
                label: m.title(ie.kind, ie.name) ?? ie.name,
                icon: pe[ie.kind],
                open: () => r(ie.kind === "asset" ? { name: "library", section: "assets", asset: ie.name } : { name: "resource", kind: ie.kind, resource: ie.name, section: "content" })
              }))
            };
          } else
            p.value = xe(F) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : oe(F, "The image could not be changed."), xe(F) === "mail_revision_conflict" && I();
        } finally {
          y.value = void 0;
        }
      }
    }
    const C = O(() => T.value?.html ? _a(T.value.html, T.value.inline_assets) : "");
    return (x, s) => (l(), n(J, null, [
      i(e(Fa), {
        visible: !!a.name,
        position: "right",
        modal: !0,
        dismissable: y.value === void 0,
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
            ref: $,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", qn, [
              t("div", Hn, [
                v.value?.state === "customized" ? (l(), E(e(Oe), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, f(v.value?.title ?? "Image"), 1)
              ]),
              i(e(D), {
                text: "",
                severity: "secondary",
                disabled: !v.value,
                "aria-label": w.value ? "Link copied" : "Copy link",
                title: w.value ? "Link copied" : "Copy link",
                onClick: ee
              }, {
                icon: A(() => [
                  i(e(N), {
                    icon: w.value ? "tabler:check" : "tabler:link",
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
                disabled: y.value !== void 0,
                onClick: s[0] || (s[0] = (R) => u("close"))
              }, {
                icon: A(() => [
                  i(e(N), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            b.value && !v.value ? (l(), n("p", Fn, [
              i(e(N), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              s[9] || (s[9] = K("Loading image…", -1))
            ])) : U.value ? (l(), n("p", Jn, [
              i(e(N), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              s[10] || (s[10] = K("This image no longer exists. It was deleted while you were away.", -1))
            ])) : g.value ? (l(), n("div", Wn, [
              t("span", null, f(g.value), 1),
              i(e(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: s[1] || (s[1] = (R) => I())
              })
            ])) : V("", !0),
            v.value ? (l(), n(J, { key: 3 }, [
              p.value ? (l(), n("p", Kn, [
                i(e(N), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                K(f(p.value), 1)
              ])) : V("", !0),
              h.value ? (l(), n("p", Yn, [
                i(e(N), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                K(f(h.value), 1)
              ])) : V("", !0),
              t("div", Gn, [
                i(e(D), {
                  label: "Replace",
                  disabled: y.value !== void 0,
                  onClick: s[2] || (s[2] = (R) => L.value = !0)
                }, {
                  icon: A(() => [
                    i(e(N), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                v.value.state === "customized" ? (l(), E(e(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: y.value === "reset",
                  disabled: y.value !== void 0,
                  onClick: s[3] || (s[3] = (R) => j("reset"))
                }, {
                  icon: A(() => [
                    i(e(N), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                v.value.state === "created" ? (l(), E(e(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: y.value === "delete",
                  disabled: y.value !== void 0,
                  onClick: s[4] || (s[4] = (R) => j("delete"))
                }, {
                  icon: A(() => [
                    i(e(N), {
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
                  t("span", eo, f(ae.value), 1),
                  i(e(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": k.value ? "Reference copied" : "Copy reference",
                    title: k.value ? "Reference copied" : "Copy reference",
                    onClick: H
                  }, {
                    icon: A(() => [
                      i(e(N), {
                        icon: k.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                s[13] || (s[13] = t("dt", null, "File", -1)),
                t("dd", null, f(v.value.asset?.filename) + " · " + f(e(qe)(v.value.asset?.size)), 1),
                v.value.asset?.width ? (l(), n(J, { key: 0 }, [
                  s[11] || (s[11] = t("dt", null, "Size", -1)),
                  t("dd", null, f(v.value.asset.width) + " × " + f(v.value.asset.height), 1)
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
                P.value.length ? (l(), n(J, { key: 1 }, [
                  t("ul", to, [
                    (l(!0), n(J, null, me(P.value, (R) => (l(), n("li", {
                      key: R.name
                    }, [
                      i(e(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (G) => e(r)({ name: "resource", kind: "message", resource: R.name, section: "content" })
                      }, {
                        default: A(() => [
                          i(e(N), {
                            icon: e(pe).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          R.title === void 0 ? (l(), E(e(Re), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", so, f(R.title), 1))
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
                ], 64)) : (l(), n("p", lo, "No message shows " + f(v.value.title) + " with its sample values.", 1))
              ]),
              t("section", oo, [
                s[16] || (s[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                S.value.length ? (l(), n("ol", uo, [
                  (l(!0), n(J, null, me(S.value, (R) => (l(), n("li", {
                    key: R.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", co, [
                      t("div", vo, [
                        t("span", mo, [
                          K("Version " + f(R.version) + " · " + f(e(pa)[R.action]) + " ", 1),
                          R.revision === v.value.revision ? (l(), E(e(Oe), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", fo, [
                          K(f(e(Ce)(R.author_label, R.author)) + " · " + f(e(Je)(R.created_at)) + " ", 1),
                          R.content.asset?.filename ? (l(), n(J, { key: 0 }, [
                            K(" · " + f(R.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      R.revision !== v.value.revision ? (l(), E(e(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: y.value === R.revision,
                        disabled: y.value !== void 0,
                        onClick: (G) => j("restore", R)
                      }, {
                        icon: A(() => [
                          i(e(N), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", ro, f(v.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      v.value ? (l(), E(el, {
        key: 0,
        visible: L.value,
        replace: v.value,
        onClose: s[6] || (s[6] = (R) => L.value = !1),
        onDone: s[7] || (s[7] = (R) => I())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      i(Qa, {
        refusal: z.value,
        onClose: s[8] || (s[8] = (R) => z.value = void 0)
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
}, ho = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, go = {
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
}, _o = { class: "mail-sub" }, xo = { class: "mail-mono-block" }, Co = { class: "mail-muted" }, Vo = { key: 1 }, So = { class: "mail-muted" }, To = /* @__PURE__ */ le({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(a) {
    const d = a, { go: o, upload: u, library: m } = ye();
    m.use("asset");
    const r = _(""), $ = _("");
    let v;
    Q(r, (q) => {
      clearTimeout(v), v = setTimeout(() => {
        $.value = q.trim();
      }, 250);
    });
    const S = ge([]), T = _(!0), c = _(!1), b = _(!1), U = _(""), g = _(""), p = Ue();
    async function h(q = !1) {
      const I = p();
      T.value = !0;
      try {
        const P = await se.assets($.value || void 0);
        if (!I()) return;
        S.value = P, U.value = g.value = "", b.value = !1, c.value = !0;
      } catch (P) {
        if (!I()) return;
        b.value = Fe(P);
        const ee = b.value ? "" : oe(P, "Images could not be loaded.");
        q && c.value && !b.value ? g.value = ee : U.value = ee;
      } finally {
        I() && (T.value = !1);
      }
    }
    Q($, () => {
      h();
    }), ta(() => h(c.value)), Le("mail.library", () => {
      h(c.value);
    });
    function y(q) {
      const I = m.find("asset", q.name)?.used_by?.messages;
      return I === void 0 ? m.ready("asset") ? "—" : void 0 : I ? he(I, "message") : "—";
    }
    const k = O(() => S.value.reduce((q, I) => q + (I.asset?.size ?? 0), 0)), w = O(() => `${he(S.value.length, "image")} · ${qe(k.value)}`);
    function L(q) {
      const I = q.asset;
      return I ? (I.width && I.height ? `${I.width} × ${I.height} · ` : "") + qe(I.size) : "";
    }
    function z(q) {
      o({ name: "library", section: "assets", asset: q.name });
    }
    return (q, I) => (l(), n(J, null, [
      i(sa, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: A(() => [
          i(e(D), {
            label: "Upload image",
            onClick: I[0] || (I[0] = (P) => e(u)())
          }, {
            icon: A(() => [
              i(e(N), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      b.value ? (l(), n("p", yo, [
        i(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        I[7] || (I[7] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : U.value ? (l(), n("div", po, [
        t("span", null, f(U.value), 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[1] || (I[1] = (P) => h())
        })
      ])) : V("", !0),
      g.value ? (l(), n("div", ho, [
        t("span", null, f(g.value) + " The list shows what was loaded before.", 1),
        i(e(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: I[2] || (I[2] = (P) => h(!0))
        })
      ])) : T.value && !c.value ? (l(), n("p", go, [
        i(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        I[8] || (I[8] = K("Loading images…", -1))
      ])) : c.value && !S.value.length && !$.value ? (l(), E($a, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: I[3] || (I[3] = (P) => e(u)())
      })) : c.value ? (l(), n(J, { key: 5 }, [
        t("div", ko, [
          i(e(ga), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: r.value,
                "onUpdate:modelValue": I[4] || (I[4] = (P) => r.value = P),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", $o, f(w.value), 1)
        ]),
        S.value.length ? (l(), E(e(ha), {
          key: 1,
          value: S.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: I[5] || (I[5] = (P) => z(P.data))
        }, {
          default: A(() => [
            i(e(ce), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: A(({ data: P }) => [
                i(Xa, {
                  name: P.name,
                  revision: P.revision,
                  asset: P.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: P }) => [
                i(e(D), {
                  link: "",
                  class: "mail-name",
                  label: P.title,
                  onClick: Ae((ee) => z(P), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", _o, [
                  t("span", xo, f(P.name), 1),
                  P.asset?.filename ? (l(), n(J, { key: 0 }, [
                    K(" · " + f(P.asset.filename), 1)
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
              body: A(({ data: P }) => [
                t("span", Co, f(L(P)), 1)
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: P }) => [
                y(P) === void 0 ? (l(), E(e(Re), {
                  key: 0,
                  width: "5rem",
                  height: "1rem"
                })) : (l(), n("span", Vo, f(y(P)), 1))
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: P }) => [
                i(xa, { resource: P }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            i(e(ce), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: P }) => [
                t("span", So, f(P.state === "original" ? "—" : e(Pa)(P.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", wo, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      i(bo, {
        name: d.asset,
        onClose: I[6] || (I[6] = (P) => e(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), Uo = { class: "kx-modal-head-icon" }, Ro = { class: "kx-modal-head-text" }, jo = { class: "kx-modal-head-title" }, Ao = { class: "kx-modal-head-sub" }, Lo = ["id"], Io = ["disabled", "inert"], No = {
  key: 0,
  class: "mail-field"
}, zo = {
  key: 1,
  class: "mail-field"
}, Eo = ["for"], Oo = { class: "mail-field" }, Po = ["for"], Mo = ["for"], Do = ["id"], Bo = { class: "mail-field" }, qo = ["for"], Ho = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, je = "\0blank", Fo = /* @__PURE__ */ le({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r } = ye(), $ = _("message"), v = _(""), S = _(""), T = _(""), c = _(""), b = _(!1), U = _(!1), g = _(""), p = _(""), h = { title: fe(), reference: fe(), description: fe(), source: fe(), hint: fe() }, y = ["message", "base", "part"].map((H) => ({ value: H, label: be[H] })), k = O(() => !!o.intent.from), w = O(() => [
      { value: je, label: "Blank" },
      ...m.ofKind($.value).map((H) => ({ value: H.name, label: H.title }))
    ]), L = O(() => v.value === je || !!m.find($.value, v.value));
    function z(H) {
      if (v.value = H, H === je) return;
      const j = m.find($.value, H);
      j && (c.value = j.description, o.intent.from && (S.value = `${j.title} copy`, b.value = !1));
    }
    Q(() => o.visible, async (H) => {
      H && ($.value = o.intent.from?.kind ?? o.intent.kind ?? "message", S.value = T.value = c.value = v.value = "", g.value = p.value = "", b.value = !1, o.intent.from ? (v.value = o.intent.from.name, m.ready($.value) || await m.load($.value), o.visible && z(o.intent.from.name)) : (v.value = je, m.ensure($.value)));
    }, { immediate: !0 }), Q($, (H) => {
      o.intent.from || (v.value = je, c.value = "", o.visible && m.ensure(H));
    }), Se(() => o.visible), Q(S, (H) => {
      b.value || (T.value = Da(H));
    });
    const q = O(() => $.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function I() {
      return p.value = "", T.value ? Ba.test(T.value) ? m.find($.value, T.value) && (p.value = `A ${be[$.value].toLowerCase()} with this reference already exists. Choose another.`) : p.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : p.value = "Enter a reference.", !p.value;
    }
    async function P() {
      if (!(U.value || !S.value.trim() || !L.value || !I())) {
        U.value = !0, g.value = "";
        try {
          const H = v.value === je ? await se.create(Yt($.value, T.value, S.value.trim(), c.value.trim())) : await se.copy({
            kind: $.value,
            name: T.value,
            title: S.value.trim(),
            description: c.value.trim(),
            from: { kind: $.value, name: v.value }
          });
          m.patch(H.kind, H.name, Wa(H)), u("close"), r({ name: "resource", kind: H.kind, resource: H.name, section: "content" });
        } catch (H) {
          xe(H) === "mail_revision_conflict" ? p.value = `A ${be[$.value].toLowerCase()} with this reference already exists. Choose another.` : g.value = oe(H, "The resource could not be created.");
        } finally {
          U.value = !1;
        }
      }
    }
    const ee = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, ae = O(() => o.intent.from ? `Duplicate ${m.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${be[$.value].toLowerCase()}`);
    return (H, j) => (l(), E(e(Ie), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !U.value,
      "close-on-escape": !U.value,
      class: "mail-dialog",
      pt: ee,
      "aria-label": ae.value,
      "onUpdate:visible": j[6] || (j[6] = (C) => {
        C || u("close");
      })
    }, {
      header: A(() => [
        t("span", Uo, [
          i(e(N), {
            icon: e(pe)[$.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Ro, [
          t("span", jo, f(ae.value), 1),
          t("span", Ao, f(v.value === je ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
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
          label: "Create " + e(be)[$.value].toLowerCase(),
          type: "submit",
          form: h.hint,
          loading: U.value,
          disabled: !S.value.trim() || !L.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: A(() => [
        t("form", {
          id: h.hint,
          class: "mail-form",
          onSubmit: Ae(P, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: U.value,
            inert: U.value || void 0
          }, [
            k.value ? V("", !0) : (l(), n("div", No, [
              j[7] || (j[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              i(e(Ve), {
                modelValue: $.value,
                "onUpdate:modelValue": j[0] || (j[0] = (C) => $.value = C),
                options: e(y),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            k.value ? V("", !0) : (l(), n("div", zo, [
              t("label", {
                class: "mail-field-label",
                for: h.source
              }, "Start from", 8, Eo),
              i(e(Pe), {
                "model-value": v.value,
                "input-id": h.source,
                options: w.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !e(m).ready($.value),
                "onUpdate:modelValue": z
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", Oo, [
              t("label", {
                class: "mail-field-label",
                for: h.title
              }, "Name", 8, Po),
              i(e(ve), {
                id: h.title,
                modelValue: S.value,
                "onUpdate:modelValue": j[1] || (j[1] = (C) => S.value = C),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: ue(["mail-field", { "mail-field-invalid": p.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: h.reference
              }, "Reference", 8, Mo),
              i(e(ve), {
                id: h.reference,
                modelValue: T.value,
                "onUpdate:modelValue": j[2] || (j[2] = (C) => T.value = C),
                class: "mail-mono-input",
                invalid: !!p.value,
                "aria-describedby": h.reference + "-hint",
                onInput: j[3] || (j[3] = (C) => b.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: h.reference + "-hint",
                class: ue(p.value ? "mail-field-error" : "mail-field-hint")
              }, f(p.value || q.value), 11, Do)
            ], 2),
            t("div", Bo, [
              t("label", {
                class: "mail-field-label",
                for: h.description
              }, "Description", 8, qo),
              i(e(va), {
                id: h.description,
                modelValue: c.value,
                "onUpdate:modelValue": j[4] || (j[4] = (C) => c.value = C),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, Io),
          g.value ? (l(), n("p", Ho, f(g.value), 1)) : V("", !0)
        ], 40, Lo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Jo = { class: "mail-drawer-head" }, Wo = { class: "mail-drawer-title" }, Ko = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Yo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Go = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Zo = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Qo = {
  key: 0,
  class: "kx-notice error mail-failure"
}, Xo = { class: "mail-failure-body" }, er = { key: 0 }, ar = { key: 1 }, lr = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, tr = {
  key: 3,
  class: "mail-sub"
}, sr = {
  key: 4,
  class: "mail-sub"
}, ir = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, nr = { key: 6 }, or = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, rr = { class: "mail-facts mail-card" }, ur = { key: 2 }, dr = {
  key: 0,
  class: "mail-sub"
}, cr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, vr = { class: "mail-timeline" }, mr = { class: "mail-muted" }, fr = { class: "mail-facts" }, br = { class: "mail-mono-block" }, yr = /* @__PURE__ */ le({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: m, go: r, capabilities: $, delivery: v } = ye();
    Se(() => !!o.messageId);
    const S = _();
    Q(() => !!o.messageId, (x) => {
      x && Xe(() => S.value?.focus());
    }, { immediate: !0 });
    const T = O(() => !!b.value?.last_error && wl.has(b.value.last_error.code)), c = O(() => {
      const x = b.value?.last_error;
      if (!x) return;
      const s = v.value?.driver && v.value.driver.id === b.value?.driver_id ? v.value.driver.label : "The delivery service";
      return ($.value?.administer_delivery ? _l(x.code, s) : void 0) ?? { lead: "", next: x.message };
    }), b = ge(), U = _(!1), g = _(!1), p = _(!1), h = _(""), y = _(""), k = _(!1), w = _(), L = _(!1), z = Ue();
    async function q() {
      const x = o.messageId, s = z();
      if (!x) {
        b.value = void 0;
        return;
      }
      U.value = !0;
      try {
        const R = await aa.get(x);
        if (!s()) return;
        b.value = R, h.value = "", g.value = p.value = !1;
      } catch (R) {
        if (!s()) return;
        b.value = void 0, g.value = ea(R), p.value = Fe(R), h.value = g.value || p.value ? "" : oe(R, "This message could not be loaded.");
      } finally {
        s() && (U.value = !1);
      }
    }
    Q(() => o.messageId, (x) => {
      w.value = void 0, y.value = "", L.value = !1, x !== b.value?.message_id && (b.value = void 0), q();
    }, { immediate: !0 }), Le("mail.activity", () => {
      o.messageId && q();
    });
    async function I() {
      const x = b.value;
      if (!(!x || k.value)) {
        k.value = !0, y.value = "";
        try {
          w.value = await aa.resend(x.message_id);
        } catch (s) {
          y.value = oe(s, "The message could not be sent again.");
        } finally {
          k.value = !1;
        }
      }
    }
    async function P() {
      const x = b.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(x.message_id)}`), L.value = !0;
        } catch {
          L.value = !1;
        }
    }
    const ee = O(() => {
      const x = b.value?.template;
      return x ? m.title("message", x) : "";
    }), ae = O(() => !!b.value?.template && !!m.find("message", b.value.template)), H = O(() => {
      const x = b.value;
      if (!x) return [];
      const s = [{ label: "Accepted for delivery", at: x.created_at }];
      return x.status === "queued" && x.next_attempt_at && s.push({ label: x.attempts ? `Attempt ${x.attempts} did not go through; trying again` : "Next delivery attempt", at: x.next_attempt_at }), x.sent_at ? s.push({ label: x.attempts > 1 ? `Sent after ${x.attempts} attempts` : "Sent", at: x.sent_at }) : x.status === "failed" && x.finished_at && s.push({ label: x.attempts > 1 ? `Failed after ${x.attempts} attempts` : "Failed", at: x.finished_at }), s;
    }), j = O(() => (b.value?.attachments ?? []).map((x) => x.filename || "Attachment")), C = O(() => {
      const x = b.value;
      return x ? [
        { label: "Message ID", value: x.message_id },
        { label: "Delivery service", value: $.value?.administer_delivery ? x.driver_id : void 0 },
        { label: "Service message ID", value: x.provider_message_id },
        { label: "Error code", value: x.last_error?.code },
        { label: "Service response", value: x.last_error?.provider_detail }
      ].filter((s) => !!s.value) : [];
    });
    return (x, s) => (l(), E(e(Fa), {
      visible: !!a.messageId,
      position: "right",
      modal: !0,
      dismissable: !k.value,
      "close-on-escape": !k.value,
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
          ref: S,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", Jo, [
            t("div", Wo, [
              b.value ? (l(), E(e(Oe), {
                key: 0,
                severity: e(Ha)[b.value.status],
                value: e(qa)[b.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : V("", !0),
              t("h2", null, f(b.value?.subject ?? "Message"), 1)
            ]),
            i(e(D), {
              text: "",
              severity: "secondary",
              disabled: !b.value,
              "aria-label": L.value ? "Link copied" : "Copy link",
              title: L.value ? "Link copied" : "Copy link",
              onClick: P
            }, {
              icon: A(() => [
                i(e(N), {
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
              onClick: s[0] || (s[0] = (R) => u("close"))
            }, {
              icon: A(() => [
                i(e(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          U.value && !b.value ? (l(), n("p", Ko, [
            i(e(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            s[7] || (s[7] = K("Loading message…", -1))
          ])) : g.value ? (l(), n("p", Yo, [
            i(e(N), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            s[8] || (s[8] = K("This message is no longer in Activity.", -1))
          ])) : p.value ? (l(), n("p", Go, [
            i(e(N), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            s[9] || (s[9] = K("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : h.value ? (l(), n("div", Zo, [
            t("span", null, f(h.value), 1),
            i(e(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: s[1] || (s[1] = (R) => q())
            })
          ])) : V("", !0),
          b.value ? (l(), n(J, { key: 4 }, [
            b.value.status === "failed" ? (l(), n("div", Qo, [
              i(e(N), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Xo, [
                s[12] || (s[12] = t("strong", null, "This message was not delivered.", -1)),
                c.value?.lead ? (l(), n("span", er, f(c.value.lead), 1)) : V("", !0),
                c.value ? (l(), n("span", ar, f(c.value.next), 1)) : V("", !0),
                w.value ? (l(), n("p", lr, [
                  s[10] || (s[10] = K(" Sent again as a new message. ", -1)),
                  i(e(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: s[2] || (s[2] = (R) => e(r)({ name: "activity", message: w.value.message_id }))
                  })
                ])) : T.value ? (l(), n("p", tr, [
                  s[11] || (s[11] = K("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  e($)?.administer_delivery ? (l(), E(e(D), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: s[3] || (s[3] = (R) => e(Te).navigate("/system/settings/mail"))
                  })) : V("", !0)
                ])) : b.value.can_resend ? V("", !0) : (l(), n("p", sr, "It cannot be sent again because its content was not kept.")),
                y.value ? (l(), n("p", ir, f(y.value), 1)) : V("", !0),
                b.value.can_resend && !w.value && !T.value ? (l(), n("div", nr, [
                  i(e(D), {
                    label: "Send again",
                    loading: k.value,
                    onClick: I
                  }, {
                    icon: A(() => [
                      i(e(N), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : b.value.status === "queued" ? (l(), n("p", or, [
              i(e(N), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              s[13] || (s[13] = K("Waiting to be delivered. ", -1))
            ])) : V("", !0),
            t("dl", rr, [
              s[19] || (s[19] = t("dt", null, "To", -1)),
              t("dd", null, f(b.value.to.join(", ")), 1),
              b.value.cc?.length ? (l(), n(J, { key: 0 }, [
                s[14] || (s[14] = t("dt", null, "Cc", -1)),
                t("dd", null, f(b.value.cc.join(", ")), 1)
              ], 64)) : V("", !0),
              b.value.bcc?.length ? (l(), n(J, { key: 1 }, [
                s[15] || (s[15] = t("dt", null, "Bcc", -1)),
                t("dd", null, f(b.value.bcc.join(", ")), 1)
              ], 64)) : V("", !0),
              b.value.reply_to ? (l(), n(J, { key: 2 }, [
                s[16] || (s[16] = t("dt", null, "Reply-to", -1)),
                t("dd", null, f(b.value.reply_to), 1)
              ], 64)) : V("", !0),
              s[20] || (s[20] = t("dt", null, "Template", -1)),
              t("dd", null, [
                ee.value === void 0 ? (l(), E(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : ae.value ? (l(), E(e(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ee.value,
                  onClick: s[4] || (s[4] = (R) => e(r)({ name: "resource", kind: "message", resource: b.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", ur, f(ee.value || "Written directly"), 1))
              ]),
              s[21] || (s[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                K(f(e(Ce)(b.value.sender_label, b.value.sender)), 1),
                b.value.origin ? (l(), n("span", dr, f(e(ia)(b.value.origin)), 1)) : V("", !0)
              ]),
              j.value.length ? (l(), n(J, { key: 3 }, [
                s[17] || (s[17] = t("dt", null, "Attachments", -1)),
                t("dd", null, f(j.value.join(", ")), 1)
              ], 64)) : V("", !0),
              b.value.resend_of ? (l(), n(J, { key: 4 }, [
                s[18] || (s[18] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  i(e(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: s[5] || (s[5] = (R) => e(r)({ name: "activity", message: b.value.resend_of }))
                  })
                ])
              ], 64)) : V("", !0)
            ]),
            t("section", cr, [
              s[22] || (s[22] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", vr, [
                (l(!0), n(J, null, me(H.value, (R) => (l(), n("li", {
                  key: R.label
                }, [
                  t("span", null, f(R.label), 1),
                  t("span", mr, f(e(Je)(R.at)), 1)
                ]))), 128))
              ])
            ]),
            C.value.length ? (l(), E(Za, {
              key: 2,
              label: "Technical details"
            }, {
              default: A(() => [
                t("dl", fr, [
                  (l(!0), n(J, null, me(C.value, (R) => (l(), n(J, {
                    key: R.label
                  }, [
                    t("dt", null, f(R.label), 1),
                    t("dd", br, f(R.value), 1)
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
}), pr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, hr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, gr = { class: "mail-health-text" }, kr = { class: "mail-toolbar" }, $r = {
  key: 0,
  class: "mail-count",
  role: "status"
}, wr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, _r = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, xr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Cr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Vr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Sr = { class: "mail-sub" }, Tr = {
  key: 0,
  class: "mail-sub"
}, Ur = { class: "mail-muted" }, Rr = {
  key: 2,
  class: "mail-more"
}, jr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ar = /* @__PURE__ */ le({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, capabilities: m } = ye();
    o.use("message");
    const r = _("all"), $ = _(d.template ?? null), v = _(30), S = _(""), T = _("");
    let c;
    Q(S, (te) => {
      clearTimeout(c), c = setTimeout(() => {
        T.value = te.trim();
      }, 250);
    }), Q(() => d.template, (te) => {
      te !== void 0 && ($.value = te);
    });
    const b = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], U = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], g = O(() => o.ofKind("message").map((te) => ({ label: te.title, value: te.name }))), p = ge([]), h = _(), y = _(!0), k = _(!1), w = _(!1), L = _(!1), z = _(""), q = _(""), I = _(""), P = Ue();
    function ee(te) {
      return {
        status: r.value === "all" ? void 0 : r.value,
        message: $.value || void 0,
        since: Date.now() - v.value * 24 * 60 * 60 * 1e3,
        q: T.value || void 0,
        cursor: te
      };
    }
    async function ae(te = !1) {
      const X = P();
      y.value = !0;
      try {
        const Z = await aa.list(ee());
        if (!X()) return;
        p.value = Z.items, h.value = Z.next_cursor, j.value = Z.total, C.value = !!Z.total_is_lower_bound, x.value = Z.failed_today ?? 0, z.value = q.value = I.value = "", L.value = !1, k.value = !0;
      } catch (Z) {
        if (!X()) return;
        L.value = Fe(Z);
        const we = L.value ? "" : oe(Z, "Activity could not be loaded.");
        te && k.value && !L.value ? I.value = we : z.value = we;
      } finally {
        X() && (y.value = !1);
      }
    }
    async function H() {
      if (y.value || !h.value || w.value) return;
      const te = P();
      w.value = !0, q.value = "";
      try {
        const X = await aa.list(ee(h.value));
        if (!te()) return;
        const Z = new Set(p.value.map((we) => we.message_id));
        p.value = [...p.value, ...X.items.filter((we) => !Z.has(we.message_id))], h.value = X.next_cursor;
      } catch (X) {
        te() && (q.value = oe(X, "More activity could not be loaded."));
      } finally {
        w.value = !1;
      }
    }
    const j = _(), C = _(!1), x = _(0);
    Q([r, $, v, T], () => {
      ae();
    }), ta(() => ae(k.value)), Le("mail.activity", () => {
      ae(k.value);
    });
    const s = O(() => {
      const te = j.value ?? p.value.length;
      return C.value ? `${te.toLocaleString()}+ messages` : he(te, "message");
    }), R = O(() => C.value && !!T.value), G = O(() => x.value ? `${he(x.value, "message")} failed today.` : ""), F = O(() => !!m.value?.administer_delivery), W = O(() => F.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function de(te) {
      return te ? o.title("message", te) : "—";
    }
    function ie(te) {
      u({ name: "activity", message: te.message_id });
    }
    function $e() {
      u({ name: "activity", template: $.value || void 0 });
    }
    return (te, X) => (l(), n(J, null, [
      i(sa, {
        title: "Activity",
        description: W.value
      }, null, 8, ["description"]),
      L.value ? (l(), n("p", pr, [
        i(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        X[8] || (X[8] = K("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(J, { key: 1 }, [
        G.value ? (l(), n("p", hr, [
          i(e(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", gr, [
            t("strong", null, f(G.value), 1),
            K(" " + f(r.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          r.value !== "failed" ? (l(), E(e(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[0] || (X[0] = (Z) => r.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", kr, [
          i(e(Ve), {
            modelValue: r.value,
            "onUpdate:modelValue": X[1] || (X[1] = (Z) => r.value = Z),
            options: b,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          i(e(Pe), {
            modelValue: $.value,
            "onUpdate:modelValue": X[2] || (X[2] = (Z) => $.value = Z),
            options: g.value,
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
            "onUpdate:modelValue": X[3] || (X[3] = (Z) => v.value = Z),
            options: U,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          i(e(ga), { class: "mail-search" }, {
            default: A(() => [
              i(e(ka), null, {
                default: A(() => [
                  i(e(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              i(e(ve), {
                modelValue: S.value,
                "onUpdate:modelValue": X[4] || (X[4] = (Z) => S.value = Z),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          k.value ? (l(), n("span", $r, f(s.value), 1)) : V("", !0)
        ]),
        R.value ? (l(), n("p", wr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : V("", !0),
        z.value ? (l(), n("div", _r, [
          t("span", null, f(z.value), 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[5] || (X[5] = (Z) => ae())
          })
        ])) : V("", !0),
        I.value ? (l(), n("div", xr, [
          t("span", null, f(I.value) + " The list shows what was loaded before.", 1),
          i(e(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: X[6] || (X[6] = (Z) => ae(!0))
          })
        ])) : y.value && !k.value ? (l(), n("p", Cr, [
          i(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          X[9] || (X[9] = K("Loading activity…", -1))
        ])) : k.value ? (l(), n(J, { key: 5 }, [
          p.value.length ? (l(), E(e(ha), {
            key: 1,
            value: p.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: X[7] || (X[7] = (Z) => ie(Z.data))
          }, {
            default: A(() => [
              i(e(ce), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: A(({ data: Z }) => [
                  i(e(Oe), {
                    severity: e(Ha)[Z.status],
                    value: e(qa)[Z.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              i(e(ce), { header: "Message" }, {
                body: A(({ data: Z }) => [
                  i(e(D), {
                    link: "",
                    class: "mail-name",
                    label: Z.subject,
                    onClick: Ae((we) => ie(Z), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", Sr, f(e(xl)(Z.to)), 1)
                ]),
                _: 1
              }),
              i(e(ce), { header: "Template" }, {
                body: A(({ data: Z }) => [
                  de(Z.template) === void 0 ? (l(), E(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(J, { key: 1 }, [
                    K(f(de(Z.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              i(e(ce), { header: "Sent by" }, {
                body: A(({ data: Z }) => [
                  t("span", null, f(e(Ce)(Z.sender_label, Z.sender)), 1),
                  Z.origin ? (l(), n("span", Tr, f(e(ia)(Z.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              i(e(ce), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: A(({ data: Z }) => [
                  t("span", Ur, f(e(Cl)(Z.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Vr, f(T.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          h.value ? (l(), n("div", Rr, [
            q.value ? (l(), n("span", jr, f(q.value), 1)) : V("", !0),
            i(e(D), {
              label: q.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: w.value,
              disabled: y.value,
              onClick: H
            }, null, 8, ["label", "loading", "disabled"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      i(yr, {
        "message-id": a.message,
        onClose: $e
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Lr = { class: "kx-shell kx-settings-shell mail-admin" }, Ir = { class: "kx-main" }, Nr = /* @__PURE__ */ le({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(a, { emit: d }) {
    const o = a, u = d, m = ge(Ia(o.route ?? "")), r = O(() => m.value), $ = _(!1);
    Q($, (s) => u("dirty-change", s), { flush: "sync" });
    let v = !1;
    async function S() {
      if (!$.value) return !0;
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
    function T(s, R) {
      return s.name === "resource" && R.name === "resource" && s.kind === R.kind && s.resource === R.resource;
    }
    async function c(s) {
      const R = ze(s);
      !T(r.value, s) && !await S() || (T(r.value, s) || ($.value = !1), m.value = s, o.route !== void 0 && R !== o.route && u("navigate", R));
    }
    Q(() => o.route, async (s, R) => {
      if (s === void 0) return;
      const G = Ia(s);
      if (ze(G) !== ze(m.value)) {
        if (!T(m.value, G) && $.value) {
          if (!await S()) {
            R !== void 0 && o.route === s && u("navigate", ze(m.value));
            return;
          }
          $.value = !1;
        }
        o.route === s && (m.value = G);
      }
    });
    const b = Xl(), U = yl();
    Q(U, (s, R) => {
      R === !1 && s === !0 && b.refresh();
    });
    const g = _(), p = _();
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
    const y = _(!1), k = _(!1), w = _({});
    function L(s) {
      w.value = s, y.value = !0;
    }
    bl(Ja, {
      library: b,
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
        $.value = s;
      },
      setTitle: (s) => {
        ae.value = s;
      }
    });
    const z = {
      content: (s) => s === "message" ? "Message" : s === "base" ? "Layout" : "Content",
      variables: (s) => s === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, q = {
      content: (s) => pe[s],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, I = O(() => !!g.value && (g.value.administer_delivery || g.value.send)), P = O(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: pe.message },
        { value: "bases", label: "Base templates", icon: pe.base },
        { value: "parts", label: "Parts", icon: pe.part },
        { value: "assets", label: "Images", icon: pe.asset }
      ] },
      ...I.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ee = { value: "all", label: "All resources", icon: "tabler:table" }, ae = _("");
    Q(() => ze(r.value), () => {
      ae.value = "";
    });
    const H = O(() => {
      const s = r.value;
      if (s.name === "resource")
        return {
          leading: { value: "all", label: "All " + ya[s.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: ae.value || " ", items: Ya(s.kind).map((R) => ({
            value: R,
            label: z[R](s.kind),
            icon: q[R](s.kind)
          })) }]
        };
    }), j = O(() => {
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
    const x = _();
    return Q(() => ze(r.value), () => {
      x.value?.scrollTo({ top: 0 });
    }), (s, R) => (l(), n("main", Lr, [
      i(Ql, {
        label: "Mail sections",
        title: "Mail",
        value: j.value,
        groups: H.value ? H.value.groups : P.value,
        "leading-item": H.value ? H.value.leading : ee,
        "onUpdate:value": C
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", Ir, [
        t("div", {
          ref_key: "main",
          ref: x,
          class: ue(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), E(gn, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), E(Ar, {
            key: 1,
            message: r.value.message,
            template: r.value.template
          }, null, 8, ["message", "template"])) : r.value.section === "assets" ? (l(), E(To, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), E(Jt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      i(Fo, {
        visible: y.value,
        intent: w.value,
        onClose: R[0] || (R[0] = (G) => y.value = !1)
      }, null, 8, ["visible", "intent"]),
      i(el, {
        visible: k.value,
        onClose: R[1] || (R[1] = (G) => k.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), zr = /* @__PURE__ */ le({
  __name: "MailAdminRoot",
  setup(a) {
    const d = pl(), o = hl();
    return (u, m) => (l(), E(Nr, {
      route: e(d).route,
      onNavigate: m[0] || (m[0] = (r) => e(o)("navigate", { route: r })),
      onDirtyChange: m[1] || (m[1] = (r) => e(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), Er = Tl(zr, { type: "object", properties: { route: { type: "string", default: "" } } });
jl(import.meta.url, Er);
//# sourceMappingURL=admin.js.map
