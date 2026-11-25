import { defineComponent as te, useId as ve, openBlock as l, createElementBlock as n, unref as e, normalizeClass as re, createElementVNode as t, createTextVNode as Y, toDisplayString as y, createCommentVNode as S, renderSlot as Ie, computed as P, createBlock as M, resolveDynamicComponent as dl, normalizeProps as cl, guardReactiveProps as vl, createSlots as ma, withCtx as j, Fragment as J, renderList as ce, inject as ml, ref as $, shallowRef as pe, onMounted as fl, onBeforeUnmount as aa, createVNode as s, watch as X, reactive as bl, nextTick as Qe, withModifiers as Te, useModel as Ea, mergeModels as ra, defineAsyncComponent as ua, withDirectives as yl, vShow as pl, provide as gl } from "vue";
import { u as la, a as hl, b as kl, c as $l } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Ue, l as se, d as ne, k as me, b as Pe, A as wl, e as $e, a as xe, p as ye, w as Oa, c as we, _ as Be, f as fa, g as be, s as Ma, i as qe, h as Ve, j as ba, m as He, n as Pa, o as ta, q as _l, r as xl, t as Xe, v as Da, x as Ba, y as qa, z as Cl, B as Vl, C as Ha, D as Fa, E as ea, F as Sl, G as Tl, H as Ul, I as Rl, J as jl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-CMfF3-zi.js";
import { host as Ce, api as Al, on as Ll, define as Il } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import Re from "primevue/skeleton";
import B from "primevue/button";
import ue from "primevue/column";
import ya from "primevue/datatable";
import pa from "primevue/iconfield";
import ga from "primevue/inputicon";
import de from "primevue/inputtext";
import _e from "primevue/selectbutton";
import je from "primevue/dialog";
import Nl from "primevue/progressbar";
import Ne from "primevue/tag";
import ze from "primevue/select";
import zl from "primevue/accordion";
import El from "primevue/accordioncontent";
import Ol from "primevue/accordionheader";
import Ml from "primevue/accordionpanel";
import Pl from "primevue/menu";
import Dl from "primevue/checkbox";
import Bl from "primevue/inputnumber";
import da from "primevue/textarea";
import Ja from "primevue/drawer";
import ql from "primevue/fileupload";
const Hl = ["aria-labelledby"], Fl = { class: "kx-railhead" }, Jl = ["id"], Kl = { key: 0 }, Wl = { class: "kx-railhead-acts" }, Yl = { class: "kx-rail-body" }, Gl = /* @__PURE__ */ te({
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
      t("div", Fl, [
        t("span", {
          id: e(d),
          class: "kx-railhead-title"
        }, [
          Y(y(a.title), 1),
          a.count !== void 0 ? (l(), n("b", Kl, y(a.count), 1)) : S("", !0)
        ], 8, Jl),
        t("div", Wl, [
          Ie(o.$slots, "actions")
        ])
      ]),
      Ie(o.$slots, "toolbar"),
      t("div", Yl, [
        Ie(o.$slots, "default")
      ])
    ], 10, Hl));
  }
}), Zl = ["aria-label"], Ql = {
  key: 0,
  class: "kx-settings-rail-group"
}, Xl = ["aria-current", "onClick"], et = { class: "kx-settings-rail-label" }, at = /* @__PURE__ */ te({
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
      const r = [...v.currentTarget.querySelectorAll(".kx-settings-rail-item")], w = r.indexOf(v.target);
      if (w < 0) return;
      let m;
      switch (v.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (w + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (w + r.length - 1) % r.length;
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
    return (v, r) => (l(), M(dl(a.title ? Gl : "div"), cl(vl(a.title ? { title: a.title, count: a.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ma({
      default: j(() => [
        t("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": a.title }]),
          "aria-label": a.label,
          onKeydown: u
        }, [
          (l(!0), n(J, null, ce(o.value, (w, m) => (l(), n("div", {
            key: w.items[0]?.value ?? m,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": a.leadingItem && m === 0 }])
          }, [
            w.heading ? (l(), n("div", Ql, y(w.heading), 1)) : S("", !0),
            (l(!0), n(J, null, ce(w.items, (T) => (l(), n("button", {
              key: T.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": T.value === a.value ? "true" : void 0,
              onClick: (C) => v.$emit("update:value", T.value)
            }, [
              T.icon ? (l(), M(e(N), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: T.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              t("span", et, y(T.label), 1)
            ], 8, Xl))), 128))
          ], 2))), 128))
        ], 42, Zl)
      ]),
      _: 2
    }, [
      a.title && v.$slots.actions ? {
        name: "actions",
        fn: j(() => [
          Ie(v.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ka = Symbol("mail-admin");
function fe() {
  const a = ml(Ka);
  if (!a) throw new Error("Mail administration context is missing");
  return a;
}
function Wa(a) {
  const { kind: d, name: o, title: u, description: v, state: r, revision: w, origin: m, origin_label: T, base: C, author: c, author_label: h, updated_at: U, used_by: b } = a, k = b && {
    messages: b.messages?.length,
    recent_sources: b.recent_senders?.length
  };
  return { kind: d, name: o, title: u, description: v, state: r, revision: w, origin: m, origin_label: T, base: C, author: c, author_label: h, updated_at: U, used_by: k };
}
function lt() {
  const a = Object.fromEntries(["message", "base", "part", "asset"].map((b) => [b, { rows: pe([]), loaded: $(!1), loading: $(!1), error: $(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map();
  let o = 0;
  function u(b) {
    const k = d.get(b);
    if (k) return k;
    const p = a[b];
    p.loading.value = !0;
    const f = o, g = (async () => {
      try {
        const _ = [];
        let A;
        do {
          const L = await se.page({ kind: b, cursor: A });
          _.push(...L.items), A = L.next_cursor;
        } while (A);
        p.rows.value = _, p.loaded.value = !0, p.stale = f !== o, p.error.value = "";
      } catch (_) {
        p.error.value = ne(_, "The mail library could not be loaded.");
      } finally {
        p.loading.value = !1, d.delete(b), f !== o && p.users > 0 && v(b);
      }
    })();
    return d.set(b, g), g;
  }
  function v(b) {
    const k = a[b];
    (!k.loaded.value || k.stale) && !k.loading.value && u(b);
  }
  function r(...b) {
    fl(() => {
      for (const k of b)
        a[k].users++, v(k);
    }), aa(() => {
      for (const k of b) a[k].users--;
    });
  }
  function w(b, k, p) {
    const f = a[b];
    if (!f.loaded.value) return;
    const g = f.rows.value.filter((_) => _.name !== k);
    p && g.push(p), f.rows.value = g;
  }
  function m() {
    o++;
    for (const [b, k] of Object.entries(a))
      k.stale = k.loaded.value, k.users > 0 && v(b);
  }
  Ue("mail.library", m);
  const T = (b, k) => a[b].rows.value.find((p) => p.name === k);
  function C(b, k) {
    const p = T(b, k);
    return p ? p.title : (v(b), a[b].loaded.value ? k : void 0);
  }
  return { kinds: a, use: r, ensure: v, load: u, find: T, title: C, ofKind: (b) => [...a[b].rows.value].sort((k, p) => k.title.localeCompare(p.title)), ready: (b) => a[b].loaded.value, failed: (b) => a[b].error.value, refresh: m, patch: w };
}
const tt = { class: "kx-empty" }, st = { class: "kx-empty-ico" }, it = { class: "kx-empty-title" }, nt = {
  key: 0,
  class: "kx-empty-sub"
}, ha = /* @__PURE__ */ te({
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
    return (d, o) => (l(), n("div", tt, [
      t("div", st, [
        s(e(N), {
          icon: a.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", it, y(a.title), 1),
      a.hint || d.$slots.hint ? (l(), n("p", nt, [
        Ie(d.$slots, "hint", {}, () => [
          Y(y(a.hint), 1)
        ])
      ])) : S("", !0),
      a.cta ? (l(), M(e(B), {
        key: 1,
        label: a.cta,
        onClick: o[0] || (o[0] = (u) => d.$emit("cta"))
      }, ma({ _: 2 }, [
        a.ctaIcon ? {
          name: "icon",
          fn: j(({ class: u }) => [
            s(e(N), {
              icon: a.ctaIcon,
              class: re(u),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : S("", !0)
    ]));
  }
}), ka = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Ya = Object.fromEntries(Object.entries(ka).map(([a, d]) => [d, a])), ot = ["content", "variables", "used-by", "history"];
function ca(a) {
  return ka[a];
}
function rt(a) {
  return Ya[a];
}
function Ga(a) {
  return a === "base" ? ["content", "used-by", "history"] : a === "part" ? ["content", "variables", "history"] : ot;
}
function Le(a) {
  return a.name === "activity" ? a.message ? `activity/${encodeURIComponent(a.message)}` : a.template ? `activity/template/${encodeURIComponent(a.template)}` : "activity" : a.name === "library" ? a.section === "assets" && a.asset ? `assets/${encodeURIComponent(a.asset)}` : a.section === "all" ? "" : a.section : `${ka[a.kind]}/${encodeURIComponent(a.resource)}/${a.section}`;
}
function Ia(a) {
  const d = (a ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, u, v] = d;
  if (!o) return { name: "library", section: "all" };
  try {
    if (o === "activity")
      return u === "template" && v ? { name: "activity", template: decodeURIComponent(v) } : u ? { name: "activity", message: decodeURIComponent(u) } : { name: "activity" };
    if (o === "assets") return u ? { name: "library", section: "assets", asset: decodeURIComponent(u) } : { name: "library", section: "assets" };
    const r = Ya[o];
    if (!r) return { name: "library", section: "all" };
    if (!u) return { name: "library", section: o };
    const m = Ga(r).find((T) => T === v) ?? "content";
    return { name: "resource", kind: r, resource: decodeURIComponent(u), section: m };
  } catch {
    return { name: "library", section: "all" };
  }
}
const ut = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", oa = `<meta http-equiv="Content-Security-Policy" content="${ut}">`;
function $a(a, d) {
  let o = a;
  for (const [r, w] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join(w);
  const u = /<head(\s[^>]*)?>/i.exec(o);
  if (u) return o.slice(0, u.index + u[0].length) + oa + o.slice(u.index + u[0].length);
  const v = /<html(\s[^>]*)?>/i.exec(o);
  return v ? o.slice(0, v.index + v[0].length) + "<head>" + oa + "</head>" + o.slice(v.index + v[0].length) : oa + o;
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
}, va = /* @__PURE__ */ te({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = fe(), v = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (c) => o.title(c.kind, c.name), w = (c) => !!c && !!d.draft && c.kind === d.draft.kind && c.name === d.draft.name, m = P(() => {
      const { resource: c, face: h, previewOf: U } = d.problem, b = h ? v[h] : "";
      if (c && d.draft && d.draft.kind !== "message" && c.kind === "message" && c.name === U)
        return `${r(c) ?? "The message"} does not render with your changes.`;
      if (d.problem.tooLarge) {
        const k = !c || w(c) ? d.draft ? `this ${me[d.draft.kind].toLowerCase()}` : "it" : r(c) ?? "a resource it uses";
        return `The ${b || "content"} of ${k} is larger than Mail can send. Keep each rendered face under ${Pe(d.problem.tooLarge)}.`;
      }
      if (!c || w(c)) {
        const k = d.draft ? `this ${me[d.draft.kind].toLowerCase()}` : "it";
        return b ? `The ${b} of ${k} does not render.` : `${k[0].toUpperCase()}${k.slice(1)} does not render.`;
      }
      return `${r(c) ?? "A resource it uses"} does not render${b ? ` (${b})` : ""}.`;
    }), T = P(() => d.problem.candidates ?? []);
    function C(c) {
      c.kind === "asset" ? u({ name: "library", section: "assets", asset: c.name }) : u({ name: "resource", kind: c.kind, resource: c.name, section: "content" });
    }
    return (c, h) => (l(), n("div", dt, [
      t("p", ct, [
        s(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, y(m.value), 1)
      ]),
      a.problem.tooLarge ? S("", !0) : (l(), n("code", vt, y(a.problem.engine ?? a.problem.message), 1)),
      T.value.length ? (l(), n("p", mt, [
        h[0] || (h[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(J, null, ce(T.value, (U) => (l(), n(J, {
          key: U.kind + U.name
        }, [
          w(U) ? (l(), n("span", ft, "This " + y(e(me)[U.kind].toLowerCase()), 1)) : r(U) === void 0 ? (l(), M(e(Re), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), M(e(B), {
            key: 2,
            link: "",
            size: "small",
            label: r(U),
            class: "mail-inline-link",
            onClick: (b) => C(U)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : S("", !0)
    ]));
  }
}), Na = ["html", "text", "subject", "variables", "samples"];
function Oe(a) {
  return !!a && typeof a == "object" && typeof a.kind == "string" && typeof a.name == "string";
}
function De(a) {
  if (!(a instanceof wl)) return;
  const d = a.details ?? {}, o = $e(a);
  if (o === "mail_resource_in_use") {
    const C = Array.isArray(d.messages) ? d.messages.filter((h) => typeof h == "string") : [], c = d.dependent;
    return {
      message: a.message,
      dependents: C,
      references: Array.isArray(d.resources) ? d.resources.filter(Oe) : void 0,
      face: Na.find((h) => h === c?.face),
      resource: Oe(c?.resource) ? c.resource : void 0
    };
  }
  const u = Na.find((C) => C === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!u) return;
  const v = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((C) => typeof C == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((C) => {
    const c = C;
    return Oe(c.resource) && typeof c.message == "string" ? [{ name: c.resource.name, message: c.message }] : [];
  }) : [], w = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(Oe) : [], m = typeof d.engine_message == "string" ? d.engine_message : void 0, T = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: a.message,
    engine: m,
    tooLarge: T,
    face: u,
    resource: Oe(d.resource) ? d.resource : void 0,
    dependents: v.length ? v : void 0,
    reasons: r.length ? r : void 0,
    candidates: w.length ? w : void 0
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
}, gt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ht = {
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
}, Ut = ["srcdoc", "title"], Rt = {
  key: 3,
  class: "mail-more"
}, jt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, At = 3, Lt = /* @__PURE__ */ te({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { go: v } = fe();
    xe(() => o.visible);
    const r = $([]), w = $(), m = $(), T = $(!1), C = $("");
    let c = 0, h = [], U = 0, b;
    async function k(V, x) {
      V.state = "loading";
      try {
        const i = await se.preview(V.name, []);
        if (x !== c) return;
        V.subject = i.subject, V.warning = i.warnings?.length ? i.warnings.map(Oa).join(" ") : void 0, V.document = i.html ? $a(i.html, i.inline_assets) : "", V.state = "ready";
      } catch (i) {
        if (x !== c) return;
        V.problem = De(i), V.failure = V.problem ? "" : ne(i, "This message could not be rendered."), V.state = "failed";
      }
    }
    function p(V) {
      for (; V === c && U < At && h.length; ) {
        const x = h.shift();
        x.state === "waiting" && (U++, k(x, V).finally(() => {
          U--, p(V);
        }));
      }
    }
    function f(V) {
      V.state !== "waiting" || h.includes(V) || (h.push(V), p(c));
    }
    const g = $();
    function _() {
      if (b?.disconnect(), typeof IntersectionObserver > "u" || !g.value) {
        for (const V of r.value) f(V);
        return;
      }
      b = new IntersectionObserver((V) => {
        for (const x of V) {
          if (!x.isIntersecting) continue;
          const i = r.value.find((R) => R.name === x.target.dataset.name);
          i && f(i);
        }
      }, { root: g.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const V of g.value.querySelectorAll("[data-name]")) b.observe(V);
    }
    async function A(V) {
      T.value = !0, C.value = "";
      try {
        const x = await se.page({ kind: "message", cursor: w.value });
        if (V !== c) return;
        r.value = [...r.value, ...x.items.map((i) => bl({ name: i.name, title: i.title, state: "waiting" }))], w.value = x.next_cursor, m.value = x.total, await Qe(), _();
      } catch (x) {
        V === c && (C.value = ne(x, "The messages could not be listed."));
      } finally {
        V === c && (T.value = !1);
      }
    }
    function L() {
      c++, h = [], b?.disconnect(), b = void 0;
    }
    function E() {
      L(), r.value = [], w.value = m.value = void 0, A(c);
    }
    function z() {
      const V = ++c;
      h = [];
      for (const x of r.value) Object.assign(x, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Qe(() => {
        V === c && _();
      });
    }
    X(() => o.visible, (V) => {
      V ? E() : L();
    }), aa(L);
    const ee = P(() => r.value.filter((V) => V.state === "ready" || V.state === "failed").length), ae = P(() => r.value.filter((V) => V.state === "failed").length), Z = P(() => {
      if (!r.value.length) return "";
      const V = `${ee.value} of ${ye(m.value ?? r.value.length, "message")} rendered`;
      return ae.value ? `${V}, ${ae.value} with a problem.` : V + ".";
    });
    function H(V) {
      u("close"), v({ name: "resource", kind: "message", resource: V, section: "content" });
    }
    const I = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (V, x) => (l(), M(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: I,
      "aria-label": "Preview all messages",
      "onUpdate:visible": x[1] || (x[1] = (i) => {
        i || u("close");
      })
    }, {
      header: j(() => [
        t("span", yt, [
          s(e(N), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        x[2] || (x[2] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !r.value.length,
          onClick: z
        }, {
          icon: j(() => [
            s(e(N), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: j(() => [
        r.value.length ? (l(), n("div", pt, [
          t("span", null, y(Z.value), 1),
          s(e(Nl), {
            value: Math.round(ee.value / (m.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : S("", !0),
        T.value && !r.value.length ? (l(), n("p", gt, [
          s(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = Y("Listing messages…", -1))
        ])) : !T.value && !C.value && !r.value.length ? (l(), n("p", ht, "There are no messages yet.")) : S("", !0),
        t("ul", {
          ref_key: "list",
          ref: g,
          class: "mail-gallery"
        }, [
          (l(!0), n(J, null, ce(r.value, (i) => (l(), n("li", {
            key: i.name,
            "data-name": i.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": i.state === "failed" }])
          }, [
            s(e(B), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + i.title,
              onClick: (R) => H(i.name)
            }, {
              default: j(() => [
                t("span", $t, y(i.title), 1),
                t("span", wt, y(i.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            i.warning ? (l(), n("p", _t, [
              s(e(N), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              Y(y(i.warning), 1)
            ])) : S("", !0),
            t("div", xt, [
              i.state === "waiting" ? (l(), n("p", Ct, "Renders when shown.")) : i.state === "loading" ? (l(), n("p", Vt, [
                s(e(N), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                x[4] || (x[4] = Y("Rendering…", -1))
              ])) : i.state === "failed" ? (l(), n("div", St, [
                i.problem ? (l(), M(va, {
                  key: 0,
                  problem: i.problem,
                  draft: { kind: "message", name: i.name }
                }, null, 8, ["problem", "draft"])) : (l(), n("p", Tt, y(i.failure), 1))
              ])) : (l(), n("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: i.document,
                title: i.title + " preview",
                tabindex: "-1"
              }, null, 8, Ut))
            ])
          ], 10, kt))), 128))
        ], 512),
        w.value || C.value ? (l(), n("div", Rt, [
          C.value ? (l(), n("span", jt, y(C.value), 1)) : S("", !0),
          s(e(B), {
            label: C.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: T.value,
            onClick: x[0] || (x[0] = (i) => A(e(c)))
          }, null, 8, ["label", "loading"])
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), It = { class: "mail-source" }, Nt = { key: 0 }, zt = { key: 1 }, wa = /* @__PURE__ */ te({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(a) {
    return (d, o) => (l(), n("span", It, [
      a.resource.state === "created" ? (l(), n("span", Nt, y((a.resource.kind === "asset" ? "Uploaded by " : "Created by ") + e(we)(a.resource.author_label, a.resource.author)), 1)) : (l(), n("span", zt, "Included with " + y(a.resource.origin_label), 1)),
      a.resource.state === "customized" ? (l(), M(e(Ne), {
        key: 2,
        severity: "info",
        value: a.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : S("", !0)
    ]));
  }
}), Et = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Ot = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Mt = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Pt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Dt = { class: "mail-toolbar" }, Bt = {
  class: "mail-count",
  role: "status"
}, qt = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Ht = {
  key: 0,
  class: "mail-sub"
}, Ft = { class: "mail-kind" }, Jt = { class: "mail-muted" }, Kt = {
  key: 2,
  class: "mail-more"
}, Wt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Yt = /* @__PURE__ */ te({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, create: v } = fe(), r = P(() => rt(d.section));
    X(r, (Q) => {
      Q === "message" && o.ensure("base");
    }, { immediate: !0 });
    const w = $("all"), m = $(""), T = $("");
    let C;
    X(m, (Q) => {
      clearTimeout(C), C = setTimeout(() => {
        T.value = Q.trim();
      }, 250);
    }), X(() => d.section, () => {
      m.value = T.value = "", w.value = "all";
    });
    const c = pe([]), h = $(), U = $(), b = $(!0), k = $(!1), p = $(!1), f = $(!1), g = $(""), _ = $(""), A = $(""), L = Ve(), E = () => ({ kind: r.value, state: w.value === "all" ? void 0 : w.value, q: T.value || void 0 });
    async function z(Q = !1) {
      const q = L();
      b.value = !0;
      try {
        const K = await se.page(E());
        if (!q()) return;
        c.value = K.items, h.value = K.next_cursor, U.value = K.total, g.value = _.value = A.value = "", f.value = !1, k.value = !0;
      } catch (K) {
        if (!q()) return;
        f.value = qe(K);
        const le = f.value ? "" : ne(K, "The mail library could not be loaded.");
        Q && k.value && !f.value ? A.value = le : g.value = le;
      } finally {
        q() && (b.value = !1);
      }
    }
    async function ee() {
      if (b.value || !h.value || p.value) return;
      const Q = L();
      p.value = !0, _.value = "";
      try {
        const q = await se.page({ ...E(), cursor: h.value });
        if (!Q()) return;
        c.value = [...c.value, ...q.items], h.value = q.next_cursor, U.value = q.total;
      } catch (q) {
        Q() && (_.value = ne(q, "More resources could not be loaded."));
      } finally {
        p.value = !1;
      }
    }
    X([r, w, T], () => {
      z();
    }), la(() => z(k.value)), Ue("mail.library", () => {
      r.value === "message" && o.ensure("base"), z(k.value);
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
    }), Z = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], H = P(() => {
      const Q = r.value ? me[r.value].toLowerCase() : "resource", q = U.value ?? c.value.length;
      return c.value.length < q ? `${c.value.length} of ${ye(q, Q)}` : ye(q, Q);
    });
    function I(Q) {
      const q = Q.used_by;
      return Q.kind === "base" || Q.kind === "asset" ? q?.messages ? ye(q.messages, "message") : "—" : Q.kind === "message" ? q?.recent_sources ? ye(q.recent_sources, "recent sender") : "—" : "";
    }
    function V(Q) {
      return Q.base ? o.title("base", Q.base) : "";
    }
    function x(Q) {
      Q.kind === "asset" ? u({ name: "library", section: "assets", asset: Q.name }) : u({ name: "resource", kind: Q.kind, resource: Q.name, section: "content" });
    }
    const i = P(() => k.value && !g.value && r.value && !c.value.length && w.value === "all" && !T.value), R = $(!1);
    return (Q, q) => (l(), n(J, null, [
      s(Be, {
        title: ae.value.title,
        description: ae.value.description
      }, {
        actions: j(() => [
          !r.value || r.value === "message" ? (l(), M(e(B), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: q[0] || (q[0] = (K) => R.value = !0)
          }, {
            icon: j(() => [
              s(e(N), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          s(e(B), {
            label: r.value ? "New " + e(me)[r.value].toLowerCase() : "New",
            onClick: q[1] || (q[1] = (K) => e(v)({ kind: r.value }))
          }, {
            icon: j(() => [
              s(e(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      f.value ? (l(), n("p", Et, [
        s(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        q[9] || (q[9] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : g.value ? (l(), n("div", Ot, [
        t("span", null, y(g.value), 1),
        s(e(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[2] || (q[2] = (K) => z())
        })
      ])) : S("", !0),
      A.value ? (l(), n("div", Mt, [
        t("span", null, y(A.value) + " The list shows what was loaded before.", 1),
        s(e(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[3] || (q[3] = (K) => z(!0))
        })
      ])) : b.value && !k.value ? (l(), n("p", Pt, [
        s(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        q[10] || (q[10] = Y("Loading mail library…", -1))
      ])) : i.value && r.value ? (l(), M(ha, {
        key: 4,
        icon: e(be)[r.value],
        title: "No " + e(fa)[r.value].toLowerCase() + " yet",
        hint: "Create a " + e(me)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + e(me)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: q[4] || (q[4] = (K) => e(v)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : k.value ? (l(), n(J, { key: 5 }, [
        t("div", Dt, [
          s(e(_e), {
            modelValue: w.value,
            "onUpdate:modelValue": q[5] || (q[5] = (K) => w.value = K),
            options: Z,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          s(e(pa), { class: "mail-search" }, {
            default: j(() => [
              s(e(ga), null, {
                default: j(() => [
                  s(e(N), {
                    icon: b.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: b.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              s(e(de), {
                modelValue: m.value,
                "onUpdate:modelValue": q[6] || (q[6] = (K) => m.value = K),
                type: "search",
                maxlength: "1024",
                "aria-label": "Search " + ae.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", Bt, y(H.value), 1)
        ]),
        c.value.length ? (l(), M(e(ya), {
          key: 1,
          value: c.value,
          "data-key": (K) => K.kind + "/" + K.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": ae.value.title } },
          onRowClick: q[7] || (q[7] = (K) => x(K.data))
        }, {
          default: j(() => [
            s(e(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: K }) => [
                s(e(B), {
                  link: "",
                  class: "mail-name",
                  label: K.title,
                  onClick: Te((le) => x(K), ["stop"])
                }, null, 8, ["label", "onClick"]),
                K.description ? (l(), n("span", Ht, y(K.description), 1)) : S("", !0)
              ]),
              _: 1
            }),
            r.value ? S("", !0) : (l(), M(e(ue), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: j(({ data: K }) => [
                t("span", Ft, [
                  s(e(N), {
                    icon: e(be)[K.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  Y(y(e(me)[K.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), M(e(ue), {
              key: 1,
              header: "Base template"
            }, {
              body: j(({ data: K }) => [
                V(K) === void 0 ? (l(), M(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(J, { key: 1 }, [
                  Y(y(V(K)), 1)
                ], 64))
              ]),
              _: 1
            })) : S("", !0),
            s(e(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: K }) => [
                s(wa, { resource: K }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), M(e(ue), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: K }) => [
                Y(y(I(K)), 1)
              ]),
              _: 1
            })) : S("", !0),
            s(e(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: K }) => [
                t("span", Jt, y(K.state === "original" ? "—" : e(Ma)(K.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", qt, "Nothing matches. Try another name or a word from the template.")),
        h.value ? (l(), n("div", Kt, [
          _.value ? (l(), n("span", Wt, y(_.value), 1)) : S("", !0),
          s(e(B), {
            label: _.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: p.value,
            disabled: b.value,
            onClick: ee
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      s(Lt, {
        visible: R.value,
        onClose: q[8] || (q[8] = (K) => R.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function Gt(a) {
  return JSON.parse(JSON.stringify(a));
}
function ke(a) {
  const d = Gt(a);
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
function Zt(a, d) {
  return JSON.stringify(ke(a)) === JSON.stringify(ke(d));
}
function Qt(a, d, o, u, v) {
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
function Xt(a) {
  if (typeof a == "string") return JSON.stringify(a);
  if (typeof a == "number" || typeof a == "boolean") return String(a);
}
function es(a) {
  const d = [], o = a.samples;
  for (const [u, v] of Object.entries(a.schema.properties)) {
    const r = Xt(o[u] ?? v.default ?? (v.type === "string" ? "" : null));
    r !== void 0 && d.push(`${JSON.stringify(u)}, ${r}`);
  }
  return d.length ? `{{ include "/part/${a.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${a.name}" }}`;
}
function Za(a) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) ? `{{ assets.${a} }}` : `{{ assets[${JSON.stringify(a)}] }}`;
}
function as(a, d, o) {
  return `<img src="${Za(a)}" alt="${d.replace(/"/g, "&quot;")}" style="display:block;border:0;max-width:100%;height:auto;">`;
}
const ls = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function ts(a) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) && !ls.has(a) ? `{{ ${a} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(a) ? `{{ vars.${a} }}` : `{{ vars[${JSON.stringify(a)}] }}`;
}
const ss = "{{ block body() }}{{ end }}", is = {
  class: "mail-preview",
  "aria-label": "Preview"
}, ns = { class: "mail-preview-bar" }, os = {
  key: 0,
  class: "mail-preview-with"
}, rs = ["for"], us = {
  key: 0,
  class: "mail-field-hint"
}, ds = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, cs = {
  key: 2,
  class: "mail-preview-envelope"
}, vs = ["aria-busy"], ms = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, fs = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, bs = ["srcdoc", "title"], ys = {
  key: 1,
  class: "mail-preview-text"
}, ps = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, gs = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, hs = {
  key: 5,
  class: "mail-preview-foot"
}, ks = /* @__PURE__ */ te({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, delivery: r } = fe();
    o.draft.kind !== "message" && v.use("message");
    const w = { message: ve() }, m = $("email"), T = $("desktop"), C = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], c = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], h = P(() => v.ready("message") ? (o.messages ?? v.ofKind("message").map((V) => V.name)).map((V) => ({ value: V, label: v.title("message", V) ?? V })).sort((V, x) => V.label.localeCompare(x.label)) : []), U = $("");
    X(h, (I) => {
      o.draft.kind !== "message" && (I.some((V) => V.value === U.value) || (U.value = I[0]?.value ?? ""));
    }, { immediate: !0 });
    const b = P(() => o.draft.kind !== "message" && U.value && U.value === h.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), k = P(() => o.draft.kind === "message" ? o.draft.name : U.value), p = pe(), f = $(!1), g = $(), _ = $(""), A = Ve();
    let L, E = !1, z = !1;
    async function ee() {
      const I = k.value;
      if (!I) return;
      if (E) {
        z = !0;
        return;
      }
      E = !0;
      const V = A();
      f.value = !0;
      try {
        const x = await se.preview(I, [o.draft]);
        if (!V()) return;
        p.value = x, g.value = void 0, _.value = "";
      } catch (x) {
        if (!V()) return;
        const i = De(x);
        g.value = i ? { ...i, previewOf: I } : void 0, _.value = g.value ? "" : ne(x, "The preview could not be rendered.");
      } finally {
        E = !1, V() && (f.value = !1), z && (z = !1, ee());
      }
    }
    function ae() {
      clearTimeout(L), L = setTimeout(() => {
        ee();
      }, 450);
    }
    X(() => JSON.stringify(o.draft), ae), X(k, () => {
      p.value = void 0, ee();
    }, { immediate: !0 }), X(g, (I) => u("problem", I)), aa(() => clearTimeout(L));
    const Z = P(() => p.value?.html ? $a(p.value.html, p.value.inline_assets) : ""), H = P(() => {
      const I = r.value?.from;
      return I ? I.name ? `${I.name} <${I.address}>` : I.address : "";
    });
    return (I, V) => (l(), n("section", is, [
      t("div", ns, [
        s(e(_e), {
          modelValue: m.value,
          "onUpdate:modelValue": V[0] || (V[0] = (x) => m.value = x),
          options: C,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        m.value === "email" ? (l(), M(e(_e), {
          key: 0,
          modelValue: T.value,
          "onUpdate:modelValue": V[1] || (V[1] = (x) => T.value = x),
          options: c,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: j(({ option: x }) => [
            s(e(N), {
              icon: x.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            Y(y(x.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : S("", !0)
      ]),
      a.draft.kind !== "message" ? (l(), n("div", os, [
        t("label", {
          for: w.message
        }, "Preview with", 8, rs),
        s(e(ze), {
          modelValue: U.value,
          "onUpdate:modelValue": V[2] || (V[2] = (x) => U.value = x),
          "input-id": w.message,
          options: h.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !e(v).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        b.value ? (l(), n("small", us, y(b.value), 1)) : S("", !0)
      ])) : S("", !0),
      f.value && p.value ? (l(), n("p", ds, [
        s(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        V[3] || (V[3] = Y("Updating the preview…", -1))
      ])) : S("", !0),
      p.value ? (l(), n("dl", cs, [
        H.value ? (l(), n(J, { key: 0 }, [
          V[4] || (V[4] = t("dt", null, "From", -1)),
          t("dd", null, y(H.value), 1)
        ], 64)) : S("", !0),
        V[5] || (V[5] = t("dt", null, "Subject", -1)),
        t("dd", null, y(p.value.subject), 1)
      ])) : S("", !0),
      t("div", {
        class: re(["mail-preview-body", ["mail-preview-" + T.value, { "mail-preview-stale": g.value || _.value }]]),
        "aria-busy": f.value
      }, [
        !p.value && f.value ? (l(), n("p", ms, [
          s(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          V[6] || (V[6] = Y("Rendering preview…", -1))
        ])) : k.value ? p.value ? (l(), n(J, { key: 2 }, [
          m.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: Z.value,
            title: "Email preview: " + (p.value.subject ?? "")
          }, null, 8, bs)) : (l(), n("pre", ys, y(p.value.text), 1))
        ], 64)) : S("", !0) : (l(), n("p", fs, "Choose a message to see this " + y(a.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, vs),
      (l(!0), n(J, null, ce(p.value?.warnings ?? [], (x) => (l(), n("p", {
        key: x.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        s(e(N), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        t("span", null, y(e(Oa)(x)), 1)
      ]))), 128)),
      g.value ? (l(), n("p", ps, [
        s(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, y(p.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : _.value ? (l(), n("p", gs, [
        s(e(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, y(_.value), 1)
      ])) : (l(), n("p", hs, [
        s(e(N), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        Y(" " + y(a.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), $s = { class: "kx-modal-head-icon" }, ws = { class: "kx-modal-head-text" }, _s = { class: "kx-modal-head-sub" }, xs = { class: "mail-change-list" }, Cs = { class: "mail-muted" }, Vs = { class: "mail-field" }, Ss = ["for"], Ts = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Us = { class: "mail-failure-body" }, Rs = { class: "mail-dependents" }, js = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, As = /* @__PURE__ */ te({
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
    const o = a, u = d, { library: v, go: r } = fe(), w = $(""), m = ve();
    X(() => o.visible, (h) => {
      h && (w.value = o.suggestedNote ?? "");
    }), xe(() => o.visible);
    const T = P(() => {
      const h = o.saved, U = o.draft, b = [];
      return (h.title !== U.title || h.description !== U.description) && b.push("Name and description"), h.base !== U.base && b.push(`Base template: ${v.title("base", U.base ?? "") ?? U.base}`), h.subject !== U.subject && b.push("Subject"), h.html !== U.html && b.push("HTML"), h.text !== U.text && b.push("Plain text"), (JSON.stringify(h.schema.properties) !== JSON.stringify(U.schema.properties) || JSON.stringify(h.schema.required ?? []) !== JSON.stringify(U.schema.required ?? [])) && b.push(U.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(h.samples) !== JSON.stringify(U.samples) && b.push("Sample values"), b;
    }), C = P(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${me[o.draft.kind].toLowerCase()} changes when you save.`), c = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (h, U) => (l(), M(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !a.busy,
      "close-on-escape": !a.busy,
      class: "mail-dialog",
      pt: c,
      "aria-label": "Review changes",
      "onUpdate:visible": U[3] || (U[3] = (b) => {
        b || u("close");
      })
    }, {
      header: j(() => [
        t("span", $s, [
          s(e(N), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", ws, [
          U[4] || (U[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", _s, y(a.draft.title), 1)
        ])
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: U[2] || (U[2] = (b) => u("close"))
        }, null, 8, ["disabled"]),
        s(e(B), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: a.busy,
          disabled: !!a.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: U[1] || (U[1] = Te((b) => u("save", w.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            U[5] || (U[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", xs, [
              (l(!0), n(J, null, ce(T.value, (b) => (l(), n("li", { key: b }, y(b), 1))), 128))
            ])
          ]),
          t("p", Cs, y(C.value) + " The previous version stays in History.", 1),
          t("div", Vs, [
            t("label", {
              class: "mail-field-label",
              for: e(m)
            }, "Note for History", 8, Ss),
            s(e(de), {
              id: e(m),
              modelValue: w.value,
              "onUpdate:modelValue": U[0] || (U[0] = (b) => w.value = b),
              placeholder: "What changed and why…",
              disabled: a.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          a.dependents ? (l(), n("div", Ts, [
            s(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Us, [
              t("strong", null, y(a.dependents.names.length === 1 ? "1 message would break" : a.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, y(a.dependents.reason), 1),
              t("span", Rs, [
                (l(!0), n(J, null, ce(a.dependents.names, (b) => (l(), M(e(B), {
                  key: b,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: e(v).title("message", b) ?? b,
                  onClick: (k) => {
                    u("close"), e(r)({ name: "resource", kind: "message", resource: b, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : a.error ? (l(), n("p", js, y(a.error), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Qa = /* @__PURE__ */ te({
  __name: "Disclosure",
  props: /* @__PURE__ */ ra({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(a) {
    const d = Ea(a, "open");
    return (o, u) => (l(), M(e(zl), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = (v) => d.value = v === "content")
    }, {
      default: j(() => [
        s(e(Ml), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: j(() => [
            s(e(Ol), { class: "kx-disclosure-toggle" }, {
              default: j(() => [
                Y(y(a.label), 1)
              ]),
              _: 1
            }),
            s(e(El), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: j(() => [
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
}), Ls = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Is = { class: "kx-modal-head-icon" }, Ns = { class: "kx-modal-head-text" }, zs = { class: "kx-modal-head-title" }, Es = { class: "mail-field" }, Os = ["for"], Ms = /* @__PURE__ */ te({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(a, { expose: d, emit: o }) {
    const u = a, v = o, { library: r } = fe(), w = $(), m = $("");
    function T(A) {
      m.value = "", r.ensure("part"), u.face === "html" && r.ensure("asset"), w.value?.toggle(A);
    }
    d({ toggle: T });
    const C = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], c = (A) => ({ label: A, disabled: !0, icon: "tabler:loader-2" });
    async function h(A) {
      m.value = "";
      try {
        v("insert", es(await se.get({ kind: "part", name: A })));
      } catch (L) {
        m.value = ne(L, "The part could not be read.");
      }
    }
    const U = $(), b = $(""), k = ve();
    xe(() => !!U.value);
    async function p(A, L) {
      m.value = "";
      try {
        await se.get({ kind: "asset", name: A }), U.value = { name: A, title: L }, b.value = L;
      } catch (E) {
        m.value = ne(E, "The image could not be read.");
      }
    }
    function f() {
      U.value && (v("insert", as(U.value.name, b.value)), U.value = void 0);
    }
    const g = P(() => {
      const A = Object.entries(u.draft.schema.properties).map(([z]) => ({
        label: z,
        icon: "tabler:variable",
        command: () => v("insert", u.draft.kind === "part" ? `{{ .${z} }}` : ts(z))
      })), L = [{
        label: u.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...A, ...C.map((z) => ({
          label: z.label,
          icon: "tabler:world",
          command: () => v("insert", `{{ ${z.name} }}`)
        }))]
      }], E = r.ofKind("part").filter((z) => !(u.draft.kind === "part" && z.name === u.draft.name));
      if (L.push({ label: "Parts", items: r.ready("part") ? E.length ? E.map((z) => ({ label: z.title, icon: be.part, command: () => {
        h(z.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [c("Loading parts…")] }), u.face === "html") {
        const z = r.ofKind("asset");
        L.push({ label: "Images", items: r.ready("asset") ? z.length ? z.map((ee) => ({ label: ee.title, icon: be.asset, command: () => {
          p(ee.name, ee.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [c("Loading images…")] });
      }
      return u.draft.kind === "base" && L.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => v("insert", ss)
      }] }), L;
    }), _ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (A, L) => (l(), n(J, null, [
      s(e(Pl), {
        ref_key: "menu",
        ref: w,
        model: g.value,
        popup: "",
        "aria-label": "Insert into " + (a.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: j(({ item: E, class: z }) => [
          E.icon ? (l(), M(e(N), {
            key: 0,
            icon: E.icon,
            class: re(z),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : S("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      m.value ? (l(), n("p", Ls, y(m.value), 1)) : S("", !0),
      s(e(je), {
        visible: !!U.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: _,
        "aria-label": "Insert image",
        "onUpdate:visible": L[2] || (L[2] = (E) => {
          E || (U.value = void 0);
        })
      }, {
        header: j(() => [
          t("span", Is, [
            s(e(N), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", Ns, [
            t("span", zs, "Insert " + y(U.value?.title), 1),
            L[3] || (L[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: j(() => [
          s(e(B), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: L[1] || (L[1] = (E) => U.value = void 0)
          }),
          s(e(B), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: j(() => [
          t("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Te(f, ["prevent"])
          }, [
            t("div", Es, [
              t("label", {
                class: "mail-field-label",
                for: e(k)
              }, "Alternative text", 8, Os),
              s(e(de), {
                id: e(k),
                modelValue: b.value,
                "onUpdate:modelValue": L[0] || (L[0] = (E) => b.value = E),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              L[4] || (L[4] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 64));
  }
}), Ps = ["disabled", "inert"], Ds = { class: "mail-form" }, Bs = { class: "mail-field" }, qs = ["for"], Hs = { class: "mail-field" }, Fs = ["for"], Js = { class: "mail-field-hint" }, Ks = { class: "mail-mono" }, Ws = { class: "mail-field" }, Ys = ["for"], Gs = { class: "mail-base-row" }, Zs = { class: "mail-kind" }, Qs = ["id"], Xs = { class: "mail-code-frame mail-code-subject" }, ei = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, ai = { class: "mail-face-bar" }, li = { class: "mail-code-frame mail-code-body" }, ti = /* @__PURE__ */ te({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(a) {
    const d = ua(() => import("./CodeEditor-CIrhfC0V.js")), o = a, { library: u, go: v } = fe();
    u.use("base");
    const r = { base: ve(), title: ve(), description: ve(), face: ve() }, w = $("html"), m = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], T = P(() => u.ofKind("base").map((p) => ({ value: p.name, label: p.title }))), C = P(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), c = $(), h = $();
    function U(p) {
      c.value?.insert(p);
    }
    const b = P(() => {
      const p = o.problem;
      if (p)
        return p.face === "html" || p.face === "text" || p.face === "subject" ? p.face : w.value;
    }), k = P(() => (o.draft.kind === "message" ? "Body" : "Source") + (w.value === "html" ? ", HTML" : ", plain text"));
    return (p, f) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      s(Qa, { label: "Name and description" }, {
        default: j(() => [
          t("div", Ds, [
            t("div", Bs, [
              t("label", {
                class: "mail-field-label",
                for: r.title
              }, "Name", 8, qs),
              s(e(de), {
                id: r.title,
                modelValue: a.draft.title,
                "onUpdate:modelValue": f[0] || (f[0] = (g) => a.draft.title = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Hs, [
              t("label", {
                class: "mail-field-label",
                for: r.description
              }, "Description", 8, Fs),
              s(e(de), {
                id: r.description,
                modelValue: a.draft.description,
                "onUpdate:modelValue": f[1] || (f[1] = (g) => a.draft.description = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Js, [
              f[9] || (f[9] = Y("Reference ", -1)),
              t("span", Ks, y(a.draft.name), 1),
              Y(", used to " + y(a.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      a.draft.kind === "message" ? (l(), n(J, { key: 0 }, [
        t("div", Ws, [
          t("label", {
            class: "mail-field-label",
            for: r.base
          }, "Base template", 8, Ys),
          t("div", Gs, [
            s(e(ze), {
              modelValue: a.draft.base,
              "onUpdate:modelValue": f[2] || (f[2] = (g) => a.draft.base = g),
              "input-id": r.base,
              options: T.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !e(u).ready("base")
            }, {
              value: j(({ value: g }) => [
                t("span", Zs, [
                  s(e(N), {
                    icon: e(be).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  g && e(u).title("base", g) === void 0 ? (l(), M(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(J, { key: 1 }, [
                    Y(y(e(u).title("base", g)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            a.draft.base ? (l(), M(e(B), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: f[3] || (f[3] = (g) => e(v)({ name: "resource", kind: "base", resource: a.draft.base, section: "content" }))
            })) : S("", !0)
          ])
        ]),
        t("div", {
          class: re(["mail-field", { "mail-field-invalid": b.value === "subject" || C.value }])
        }, [
          t("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Qs),
          t("div", Xs, [
            s(e(d), {
              modelValue: a.draft.subject,
              "onUpdate:modelValue": f[4] || (f[4] = (g) => a.draft.subject = g),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          C.value ? (l(), n("small", ei, "A subject is one line. Remove the line break.")) : a.problem && b.value === "subject" ? (l(), M(va, {
            key: 1,
            problem: a.problem,
            draft: a.draft
          }, null, 8, ["problem", "draft"])) : S("", !0)
        ], 2)
      ], 64)) : S("", !0),
      t("div", {
        class: re(["mail-field", { "mail-field-invalid": a.problem && b.value !== "subject" }])
      }, [
        t("div", ai, [
          s(e(_e), {
            modelValue: w.value,
            "onUpdate:modelValue": f[5] || (f[5] = (g) => w.value = g),
            options: m,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (a.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          s(e(B), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: f[6] || (f[6] = (g) => h.value?.toggle(g))
          }, {
            icon: j(() => [
              s(e(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", li, [
          w.value === "html" ? (l(), M(e(d), {
            ref_key: "editor",
            ref: c,
            key: "html",
            modelValue: a.draft.html,
            "onUpdate:modelValue": f[7] || (f[7] = (g) => a.draft.html = g),
            label: k.value
          }, null, 8, ["modelValue", "label"])) : (l(), M(e(d), {
            ref_key: "editor",
            ref: c,
            key: "text",
            modelValue: a.draft.text,
            "onUpdate:modelValue": f[8] || (f[8] = (g) => a.draft.text = g),
            label: k.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        a.problem && b.value !== "subject" ? (l(), M(va, {
          key: 0,
          problem: a.problem,
          draft: a.draft
        }, null, 8, ["problem", "draft"])) : S("", !0)
      ], 2),
      s(Ms, {
        ref_key: "inserter",
        ref: h,
        draft: a.draft,
        face: w.value,
        onInsert: U
      }, null, 8, ["draft", "face"])
    ], 8, Ps));
  }
}), si = { class: "mail-value-field" }, ii = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, za = /* @__PURE__ */ te({
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
    const o = a, u = Ea(a, "modelValue"), v = d, r = (g) => g === null || ["string", "number", "boolean"].includes(typeof g), w = (g) => g === void 0 || Array.isArray(g) && g.every(r), m = (g) => g === void 0 || !!g && typeof g == "object" && !Array.isArray(g) && Object.values(g).every((_) => typeof _ == "string"), T = $(!1);
    X(() => o.type, () => {
      T.value = !1;
    });
    const C = P(() => T.value ? "written" : o.type === "array" ? w(u.value) ? "list" : "written" : o.type === "object" ? m(u.value) ? "record" : "written" : o.type), c = P({
      get: () => Array.isArray(u.value) ? u.value.map((g) => g === null ? "" : String(g)).join(`
`) : "",
      set: (g) => {
        const _ = g.split(`
`).map((L) => L.trim()).filter(Boolean), A = o.itemType === "number" || o.itemType === "integer";
        u.value = _.length ? _.map((L) => A && L !== "" && !Number.isNaN(Number(L)) ? Number(L) : L) : void 0;
      }
    }), h = $([]);
    X(u, (g) => {
      if (C.value !== "record") return;
      const _ = g ?? {};
      JSON.stringify(Object.fromEntries(h.value.filter((A) => A.key).map((A) => [A.key, A.value]))) !== JSON.stringify(_) && (h.value = Object.entries(_).map(([A, L]) => ({ key: A, value: L })));
    }, { immediate: !0 });
    function U() {
      const g = h.value.filter((_) => _.key.trim());
      u.value = g.length ? Object.fromEntries(g.map((_) => [_.key.trim(), _.value])) : void 0;
    }
    const b = $(""), k = $("");
    X([u, C], () => {
      C.value === "written" && !k.value && (b.value = u.value === void 0 ? "" : JSON.stringify(u.value, null, 2));
    }, { immediate: !0 });
    function p(g) {
      if (b.value = g, !g.trim()) {
        k.value = "", u.value = void 0;
        return;
      }
      try {
        const _ = JSON.parse(g), A = o.type === "array" ? Array.isArray(_) : !!_ && typeof _ == "object" && !Array.isArray(_);
        k.value = A ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', A && (u.value = _);
      } catch {
        k.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    X(k, (g) => v("invalid", g), { immediate: !0 });
    const f = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (g, _) => (l(), n("div", si, [
      C.value === "string" ? (l(), M(e(de), {
        key: 0,
        "model-value": typeof u.value == "string" ? u.value : "",
        "aria-label": a.label,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": _[0] || (_[0] = (A) => u.value = A || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : C.value === "number" || C.value === "integer" ? (l(), M(e(Bl), {
        key: 1,
        "model-value": typeof u.value == "number" ? u.value : null,
        "aria-label": a.label,
        "max-fraction-digits": C.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: a.disabled,
        fluid: "",
        "onUpdate:modelValue": _[1] || (_[1] = (A) => u.value = A ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : C.value === "boolean" ? (l(), M(e(_e), {
        key: 2,
        "model-value": typeof u.value == "boolean" ? u.value : null,
        options: f,
        "option-label": "label",
        "option-value": "value",
        "aria-label": a.label,
        disabled: a.disabled,
        "onUpdate:modelValue": _[2] || (_[2] = (A) => u.value = typeof A == "boolean" ? A : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : C.value === "list" ? (l(), M(e(da), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": _[3] || (_[3] = (A) => c.value = A),
        "aria-label": a.label,
        rows: "3",
        "auto-resize": "",
        disabled: a.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : C.value === "record" ? (l(), n(J, { key: 4 }, [
        (l(!0), n(J, null, ce(h.value, (A, L) => (l(), n("div", {
          key: L,
          class: "mail-value-entry"
        }, [
          s(e(de), {
            modelValue: A.key,
            "onUpdate:modelValue": [(E) => A.key = E, U],
            "aria-label": a.label + ", name " + (L + 1),
            placeholder: "Name",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(e(de), {
            modelValue: A.value,
            "onUpdate:modelValue": [(E) => A.value = E, U],
            "aria-label": a.label + ", value " + (L + 1),
            placeholder: "Value",
            disabled: a.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(e(B), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (A.key || "entry"),
            disabled: a.disabled,
            onClick: (E) => {
              h.value.splice(L, 1), U();
            }
          }, {
            icon: j(() => [
              s(e(N), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        s(e(B), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: a.disabled,
          onClick: _[4] || (_[4] = (A) => h.value.push({ key: "", value: "" }))
        }, {
          icon: j(() => [
            s(e(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(J, { key: 5 }, [
        s(e(da), {
          "model-value": b.value,
          "aria-label": a.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!k.value,
          disabled: a.disabled,
          fluid: "",
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        k.value ? (l(), n("small", ii, y(k.value), 1)) : S("", !0)
      ], 64)),
      (a.type === "array" || a.type === "object") && C.value !== "written" ? (l(), M(e(B), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: a.disabled,
        onClick: _[5] || (_[5] = (A) => T.value = !0)
      }, null, 8, ["disabled"])) : S("", !0)
    ]));
  }
}), ni = ["disabled", "inert"], oi = { class: "mail-sr-only" }, ri = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ui = {
  key: 1,
  class: "mail-muted"
}, di = ["aria-label"], ci = { class: "mail-variable-grid" }, vi = { class: "mail-field" }, mi = { class: "mail-field" }, fi = { class: "mail-field" }, bi = ["id"], yi = { class: "mail-variable-check" }, pi = { class: "mail-field" }, gi = { class: "mail-variable-values" }, hi = {
  key: 0,
  class: "mail-field"
}, ki = { class: "mail-field" }, $i = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, wi = /* @__PURE__ */ te({
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
    function w(k) {
      const p = new Set(k.schema.required ?? []);
      return Object.entries(k.schema.properties).map(([f, g]) => {
        const _ = g.items;
        return {
          id: r++,
          name: f,
          schema: g,
          title: typeof g.title == "string" ? g.title : "",
          type: v.some((A) => A.value === g.type) ? g.type : "string",
          itemType: typeof _?.type == "string" ? _.type : void 0,
          required: p.has(f),
          description: typeof g.description == "string" ? g.description : "",
          sample: k.samples[f],
          fallback: g.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const m = $([]);
    m.value = w(o.draft), X(() => o.draft, (k) => {
      m.value = w(k);
    });
    function T(k, p) {
      if (p === void 0) return !0;
      switch (k.type) {
        case "string":
          return typeof p == "string";
        case "number":
          return typeof p == "number";
        case "integer":
          return typeof p == "number" && Number.isInteger(p);
        case "boolean":
          return typeof p == "boolean";
        case "array":
          return Array.isArray(p);
        default:
          return !!p && typeof p == "object" && !Array.isArray(p);
      }
    }
    function C(k, p) {
      k.type = p, T(k, k.sample) || (k.sample = void 0), T(k, k.fallback) || (k.fallback = void 0);
    }
    const c = P(() => m.value.map((k) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(k.name) ? m.value.some((p) => p !== k && p.name === k.name) ? "Another one has this name." : k.valueErrors.sample || k.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    X(c, (k) => u("invalid", k.some(Boolean)), { immediate: !0 }), X(m, (k) => {
      if (c.value.some(Boolean)) return;
      const p = {}, f = {};
      for (const _ of k) {
        const A = { ..._.schema, type: _.type };
        for (const [L, E] of [["title", _.title], ["description", _.description]])
          E ? A[L] = E : delete A[L];
        _.fallback !== void 0 ? A.default = _.fallback : delete A.default, p[_.name] = A, _.sample !== void 0 && (f[_.name] = _.sample);
      }
      const g = k.filter((_) => _.required).map((_) => _.name);
      o.draft.schema = { ...o.draft.schema, properties: p, required: g.length ? g : void 0 }, o.draft.samples = f;
    }, { deep: !0 });
    function h() {
      let k = m.value.length + 1;
      for (; m.value.some((p) => p.name === `value_${k}`); ) k++;
      m.value.push({
        id: r++,
        name: `value_${k}`,
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
    const U = P(() => o.draft.kind === "part"), b = P(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${bt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (k, p) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: a.disabled,
      inert: a.disabled || void 0
    }, [
      t("legend", oi, y(a.label), 1),
      b.value ? (l(), n("p", ri, y(b.value), 1)) : S("", !0),
      m.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": a.label
      }, [
        (l(!0), n(J, null, ce(m.value, (f, g) => (l(), n("li", {
          key: f.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": c.value[g] }])
        }, [
          t("div", ci, [
            t("label", vi, [
              p[0] || (p[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              s(e(de), {
                modelValue: f.name,
                "onUpdate:modelValue": (_) => f.name = _,
                class: "mail-mono-input",
                invalid: !!c.value[g] && !f.valueErrors.sample && !f.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", mi, [
              p[1] || (p[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              s(e(de), {
                modelValue: f.title,
                "onUpdate:modelValue": (_) => f.title = _,
                placeholder: f.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", fi, [
              t("span", {
                id: "type-" + f.id,
                class: "mail-field-label"
              }, "Type", 8, bi),
              s(e(ze), {
                "model-value": f.type,
                options: v,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + f.id,
                "onUpdate:modelValue": (_) => C(f, _)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", yi, [
              s(e(Dl), {
                modelValue: f.required,
                "onUpdate:modelValue": (_) => f.required = _,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              p[2] || (p[2] = t("span", null, "Required", -1))
            ]),
            s(e(B), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + f.name,
              title: "Remove " + f.name,
              onClick: (_) => m.value.splice(g, 1)
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", pi, [
            p[3] || (p[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            s(e(de), {
              modelValue: f.description,
              "onUpdate:modelValue": (_) => f.description = _,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", gi, [
            U.value ? (l(), n("div", hi, [
              p[4] || (p[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              s(za, {
                modelValue: f.fallback,
                "onUpdate:modelValue": (_) => f.fallback = _,
                type: f.type,
                "item-type": f.itemType,
                label: "Default of " + f.name,
                onInvalid: (_) => f.valueErrors.fallback = _
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : S("", !0),
            t("div", ki, [
              p[5] || (p[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              s(za, {
                modelValue: f.sample,
                "onUpdate:modelValue": (_) => f.sample = _,
                type: f.type,
                "item-type": f.itemType,
                label: "Sample value of " + f.name,
                onInvalid: (_) => f.valueErrors.sample = _
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          c.value[g] ? (l(), n("small", $i, y(f.name) + ": " + y(c.value[g]), 1)) : S("", !0)
        ], 2))), 128))
      ], 8, di)) : (l(), n("p", ui, y(a.draft.title) + " takes no " + y(a.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        s(e(B), {
          label: U.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: h
        }, {
          icon: j(() => [
            s(e(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, ni));
  }
}), _i = { class: "kx-modal-head-icon" }, xi = {
  key: 0,
  class: "kx-modal-head-text"
}, Ci = { class: "kx-modal-head-title" }, Vi = {
  key: 0,
  class: "kx-modal-head-sub"
}, Si = {
  key: 1,
  class: "kx-modal-head-sub"
}, Ti = {
  key: 0,
  class: "mail-form"
}, Ui = { class: "mail-face-bar" }, Ri = {
  key: 0,
  class: "mail-version-subject"
}, ji = { class: "mail-mono-block" }, Ai = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Li = /* @__PURE__ */ te({
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
    const w = $("version"), m = $("html");
    X(() => v.revision, (p) => {
      p && (w.value = v.compare ? "compare" : "version", m.value = "html");
    });
    const T = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], C = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], c = P(() => !v.included && v.revision?.version === v.current.revision), h = P(() => {
      const p = v.revision;
      return p ? v.included || p.state === "original" && p.action === "reset" ? `${v.current.title}: the version included with ${v.current.origin_label}` : `${v.current.title}, version ${p.version}` : "";
    }), U = P(() => v.revision ? m.value === "html" ? v.revision.content.html : v.revision.content.text : ""), b = P(() => m.value === "html" ? v.current.html : v.current.text), k = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (p, f) => (l(), M(e(je), {
      visible: !!a.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: k,
      "aria-label": h.value,
      closable: !1,
      "close-on-escape": !a.busy,
      "onUpdate:visible": f[5] || (f[5] = (g) => {
        g || r("close");
      })
    }, {
      header: j(() => [
        t("span", _i, [
          s(e(N), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        a.revision ? (l(), n("span", xi, [
          t("span", Ci, y(h.value), 1),
          a.included ? (l(), n("span", Vi, "Compare it with your customized version, or reset to it.")) : (l(), n("span", Si, y(e(ba)[a.revision.action]) + " by " + y(e(we)(a.revision.author_label, a.revision.author)) + " · " + y(e(He)(a.revision.created_at)), 1))
        ])) : S("", !0)
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: a.busy,
          onClick: f[2] || (f[2] = (g) => r("close"))
        }, null, 8, ["disabled"]),
        a.revision && a.included ? (l(), M(e(B), {
          key: 0,
          label: "Reset to original",
          loading: a.busy,
          onClick: f[3] || (f[3] = (g) => r("reset"))
        }, {
          icon: j(() => [
            s(e(N), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : a.revision && !c.value ? (l(), M(e(B), {
          key: 1,
          label: "Restore this version",
          loading: a.busy,
          onClick: f[4] || (f[4] = (g) => r("restore", a.revision))
        }, {
          icon: j(() => [
            s(e(N), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : S("", !0)
      ]),
      default: j(() => [
        a.revision ? (l(), n("div", Ti, [
          t("div", Ui, [
            c.value ? S("", !0) : (l(), M(e(_e), {
              key: 0,
              modelValue: w.value,
              "onUpdate:modelValue": f[0] || (f[0] = (g) => w.value = g),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            s(e(_e), {
              modelValue: m.value,
              "onUpdate:modelValue": f[1] || (f[1] = (g) => m.value = g),
              options: C,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          a.revision.content.subject !== void 0 && w.value === "version" ? (l(), n("p", Ri, [
            f[6] || (f[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            f[7] || (f[7] = Y()),
            t("span", ji, y(a.revision.content.subject), 1)
          ])) : S("", !0),
          w.value === "version" ? (l(), n("div", Ai, [
            (l(), M(e(o), {
              key: m.value,
              "model-value": U.value,
              label: h.value + (m.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), M(e(u), {
            key: "diff-" + m.value,
            before: U.value,
            after: b.value,
            "before-label": a.included || a.revision.state === "original" && a.revision.action === "reset" ? "Included version" : "Version " + a.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Ii = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ni = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, zi = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Ei = {
  key: 3,
  class: "mail-history"
}, Oi = { class: "mail-history-head" }, Mi = { class: "mail-history-main" }, Pi = { class: "mail-history-title" }, Di = { class: "mail-sub" }, Bi = {
  key: 0,
  class: "mail-history-note"
}, qi = {
  key: 0,
  class: "mail-history-actions"
}, Hi = /* @__PURE__ */ te({
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
    return (d, o) => a.error ? (l(), n("div", Ii, [
      t("span", null, y(a.error), 1),
      s(e(B), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o[0] || (o[0] = (u) => d.$emit("retry"))
      })
    ])) : a.loading && !a.revisions.length ? (l(), n("p", Ni, [
      s(e(N), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = Y("Loading history…", -1))
    ])) : a.revisions.length ? (l(), n("ol", Ei, [
      (l(!0), n(J, null, ce(a.revisions, (u) => (l(), n("li", {
        key: u.seq,
        class: "mail-history-row"
      }, [
        t("div", Oi, [
          t("div", Mi, [
            t("span", Pi, [
              Y(" Version " + y(u.version) + " · " + y(e(ba)[u.action]) + y(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.version === a.resource.revision ? (l(), M(e(Ne), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : S("", !0)
            ]),
            t("span", Di, y(e(we)(u.author_label, u.author)) + " · " + y(e(He)(u.created_at)), 1),
            u.note ? (l(), n("span", Bi, y(u.note), 1)) : S("", !0)
          ]),
          e(Pa)(u) ? (l(), n("div", qi, [
            s(e(B), {
              label: "Show this version",
              disabled: a.busy !== void 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (v) => d.$emit("show", u)
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            u.version !== a.resource.revision ? (l(), M(e(B), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: a.busy === u.seq,
              disabled: a.busy !== void 0,
              onClick: (v) => d.$emit("restore", u)
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
          ])) : S("", !0)
        ])
      ]))), 128))
    ])) : (l(), n("p", zi, y(a.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Fi = { class: "kx-modal-head-icon mail-head-warn" }, Ji = { class: "kx-modal-head-text" }, Ki = { class: "kx-modal-head-title" }, Wi = { class: "mail-dialog-text" }, Yi = {
  key: 0,
  class: "mail-list"
}, Xa = /* @__PURE__ */ te({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a;
    xe(() => !!o.refusal);
    const u = d, v = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(w) {
      u("close"), w();
    }
    return (w, m) => (l(), M(e(je), {
      visible: !!a.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: v,
      role: "alertdialog",
      "aria-label": a.refusal?.header,
      "onUpdate:visible": m[1] || (m[1] = (T) => {
        T || u("close");
      })
    }, {
      header: j(() => [
        t("span", Fi, [
          s(e(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", Ji, [
          t("span", Ki, y(a.refusal?.header), 1)
        ])
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Close",
          autofocus: "",
          onClick: m[0] || (m[0] = (T) => u("close"))
        })
      ]),
      default: j(() => [
        t("p", Wi, y(a.refusal?.message), 1),
        a.refusal?.links.length ? (l(), n("ul", Yi, [
          (l(!0), n(J, null, ce(a.refusal.links, (T) => (l(), n("li", {
            key: T.label
          }, [
            s(e(B), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (C) => r(T.open)
            }, {
              default: j(() => [
                s(e(N), {
                  icon: T.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                t("span", null, y(T.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Gi = { class: "mail-stack" }, Zi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Qi = {
  key: 0,
  class: "mail-muted"
}, Xi = {
  key: 1,
  class: "mail-list"
}, en = { key: 1 }, an = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, ln = { class: "mail-group-head" }, tn = {
  key: 0,
  class: "mail-muted"
}, sn = {
  key: 1,
  class: "mail-list"
}, nn = { class: "mail-list-main" }, on = {
  key: 0,
  class: "mail-sub"
}, rn = { class: "mail-muted" }, un = /* @__PURE__ */ te({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(a) {
    const d = a, { library: o, go: u, capabilities: v } = fe(), r = P(() => (d.resource.used_by?.messages ?? []).map((m) => ({
      name: m,
      title: o.title("message", m)
    }))), w = P(() => d.resource.used_by?.recent_senders ?? []);
    return (m, T) => (l(), n("div", Gi, [
      a.resource.kind === "base" || a.resource.kind === "asset" ? (l(), n("section", Zi, [
        T[1] || (T[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", Xi, [
          (l(!0), n(J, null, ce(r.value, (C) => (l(), n("li", {
            key: C.name
          }, [
            s(e(B), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (c) => e(u)({ name: "resource", kind: "message", resource: C.name, section: "content" })
            }, {
              default: j(() => [
                s(e(N), {
                  icon: e(be).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                C.title === void 0 ? (l(), M(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", en, y(C.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Qi, "No messages " + y(a.resource.kind === "asset" ? "show" : "use") + " " + y(a.resource.title) + ".", 1))
      ])) : a.resource.kind === "message" ? (l(), n("section", an, [
        t("div", ln, [
          T[2] || (T[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          e(v)?.administer_delivery ? (l(), M(e(B), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: T[0] || (T[0] = (C) => e(u)({ name: "activity", template: a.resource.name }))
          })) : S("", !0)
        ]),
        w.value.length ? (l(), n("ul", sn, [
          (l(!0), n(J, null, ce(w.value, (C) => (l(), n("li", {
            key: C.sender + (C.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            s(e(N), {
              icon: C.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", nn, [
              t("span", null, y(e(we)(C.sender_label, C.sender)), 1),
              C.origin ? (l(), n("span", on, y(e(ta)(C.origin)), 1)) : S("", !0)
            ]),
            t("span", rn, y(e(ye)(C.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", tn, "Nobody has sent " + y(a.resource.title) + " recently.", 1))
      ])) : S("", !0)
    ]));
  }
}), dn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, cn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, vn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, mn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, fn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, bn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, yn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, pn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, gn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, hn = {
  key: 6,
  class: "kx-notice mail-customized"
}, kn = { class: "mail-customized-text" }, $n = { class: "mail-editor-layout" }, wn = /* @__PURE__ */ te({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(a) {
    const d = a, { library: o, capabilities: u, delivery: v, go: r, create: w, setDirty: m, setTitle: T } = fe(), C = P(() => ({ kind: d.kind, name: d.name })), c = pe(), h = $(), U = $(!0), b = $(!1), k = $(!1), p = $(""), f = $(), g = Ve(), _ = P(() => !!h.value && !!c.value && !Zt(h.value, c.value));
    X(_, (D) => m(D), { immediate: !0 }), aa(() => m(!1));
    async function A(D = {}) {
      const O = g();
      try {
        const F = await se.get(C.value);
        if (!O()) return;
        const ie = D.keepDraft && _.value;
        if (ie && c.value && F.revision !== c.value.revision) {
          f.value = { revision: F.revision, by: we(F.author_label, F.author) || "Someone" };
          return;
        }
        c.value = F, ie || (h.value = ke(F), L.value = void 0), T(F.title), f.value = void 0, b.value = k.value = !1, p.value = "";
      } catch (F) {
        if (!O()) return;
        b.value = Xe(F), k.value = qe(F), p.value = b.value || k.value ? "" : ne(F, "This resource could not be loaded."), b.value && (c.value = void 0, h.value = void 0);
      } finally {
        O() && (U.value = !1);
      }
    }
    const L = $(), E = pe([]), z = $(!1), ee = $(""), ae = Ve();
    async function Z() {
      const D = ae();
      z.value = !0;
      try {
        const O = await se.history(C.value);
        if (!D()) return;
        E.value = O, ee.value = "";
      } catch (O) {
        if (!D()) return;
        ee.value = Xe(O) ? "" : ne(O, "History could not be loaded.");
      } finally {
        D() && (z.value = !1);
      }
    }
    async function H() {
      await Promise.all([A({ keepDraft: !0 }), Z()]);
    }
    la(H), Ue("mail.library", () => {
      H();
    });
    const I = $(), V = $(""), x = $(!1), i = $(""), R = $(), Q = P(() => c.value?.title ?? d.name), q = P(() => {
      const D = c.value, O = Q.value, F = D?.used_by?.messages?.length ?? 0, ie = D?.used_by?.recent_senders?.find((na) => na.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ie?.origin ? ` Sent recently by “${ta(ie.origin)}”.` : "") },
          base: { title: "Layout", description: F ? `The frame around the ${ye(F, "message")} that ${F === 1 ? "uses" : "use"} ${O}.` : `The frame around messages that use ${O}.` },
          part: { title: "Content", description: `Shown wherever ${O} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${O} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${O}.` : d.kind === "base" ? `Messages that use ${O}.` : `Templates that include ${O}.`
        },
        history: { title: "History", description: `Every saved version of ${O}, newest first.` }
      }[d.section];
    }), K = P(() => {
      const D = c.value;
      return D?.state !== "customized" ? "" : `Customized by ${we(D.author_label, D.author)} ${_l(D.updated_at)} from the version included with ${D.origin_label}.`;
    }), le = P(() => {
      const D = c.value;
      if (!D?.original) return;
      const { kind: O, name: F, title: ie, description: oe } = D;
      return {
        kind: O,
        name: F,
        seq: 0,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: O, name: F, title: ie, description: oe, ...D.original }
      };
    }), W = $(), G = $(), ge = $(!1), Fe = P(() => G.value ?? W.value);
    X(() => JSON.stringify(h.value), () => {
      G.value = void 0;
    });
    const _a = P(() => d.kind === "message" && /[\r\n]/.test(h.value?.subject ?? "")), ll = P(() => !!Fe.value || ge.value || !!f.value || _a.value), xa = P(() => f.value ? "Discard your changes to load the newer version first." : ge.value ? "Fix the variables first." : _a.value ? "Put the subject on one line first." : Fe.value ? "Fix the error first." : ""), Ca = $(!1);
    function sa(D, O) {
      Ca.value = ["invalid_config", "from_name_invalid"].includes($e(D) ?? ""), x.value = ["mail_revision_conflict", "mail_preview_stale"].includes($e(D) ?? ""), x.value && H(), V.value = ne(D, O);
    }
    function Va() {
      if (!c.value) return;
      const D = !!f.value;
      h.value = ke(c.value), f.value = void 0, G.value = void 0, L.value = void 0, D && A();
    }
    const Ae = $(!1), Je = $(""), Ke = $();
    function tl() {
      Je.value = "", Ke.value = void 0, Ae.value = !0;
    }
    async function sl(D) {
      const O = c.value, F = h.value;
      if (!(!O || !F || I.value !== void 0)) {
        I.value = "save", Je.value = V.value = i.value = "", Ke.value = void 0;
        try {
          const ie = L.value, oe = ie && JSON.stringify(F) === JSON.stringify({ ...ke(ie.content), kind: O.kind, name: O.name }), he = oe ? await se.restore(C.value, ie.seq, O.revision, D || void 0) : await se.update(F, O.revision, D || void 0);
          c.value = { ...O, ...he }, h.value = ke(c.value), Ae.value = !1, i.value = oe ? `Version ${ie.version} from ${He(ie.created_at)} is now in effect.` : `Saved ${he.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, L.value = void 0, await H();
        } catch (ie) {
          const oe = De(ie), he = oe?.resource?.kind === F.kind && oe.resource.name === F.name;
          oe?.dependents?.length && !he ? Ke.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (G.value = oe, Ae.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes($e(ie) ?? "") ? (Ae.value = !1, await A({ keepDraft: !0 })) : Je.value = ne(ie, `${F.title} could not be saved.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    async function il() {
      const D = c.value;
      if (!(!D || I.value !== void 0)) {
        I.value = "test", V.value = i.value = "";
        try {
          await se.sendTest(D.name), i.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (O) {
          sa(O, "The test could not be sent.");
        } finally {
          I.value = void 0;
        }
      }
    }
    const We = P(() => _.value ? "Save your changes to send a test." : u.value?.send ? v.value && !v.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Sa() {
      const D = c.value;
      if (!(!D || I.value !== void 0 || !await Ce.confirm({
        header: `Reset ${D.title} to the original?`,
        message: `Your changes are replaced by the version included with ${D.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        I.value = "reset", V.value = i.value = "", x.value = !1;
        try {
          c.value = await se.reset(C.value, D.revision), h.value = ke(c.value), i.value = `${D.title} is back to the original. Your changes are in History.`, await H();
        } catch (F) {
          sa(F, `${D.title} could not be reset.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    const Ee = $(), Ta = $(!1), Ua = $(!1);
    function Ra(D, O = !1, F = !1) {
      Ta.value = O, Ua.value = F, Ee.value = D;
    }
    async function ja(D) {
      const O = C.value;
      I.value = D.seq, V.value = "";
      try {
        const F = await se.revision(O, D.seq);
        if (C.value.kind === O.kind && C.value.name === O.name) return F;
      } catch (F) {
        C.value.kind === O.kind && C.value.name === O.name && (V.value = ne(F, "This version could not be loaded."));
      } finally {
        I.value === D.seq && (I.value = void 0);
      }
    }
    async function nl(D) {
      const O = await ja(D);
      O && Ra(O);
    }
    async function Aa(D) {
      const O = c.value;
      if (!O || I.value !== void 0 || _.value && !await Ce.confirm({
        header: `Replace your unsaved changes with version ${D.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      const F = "content" in D ? D : await ja(D);
      if (!F) return;
      h.value = { ...ke(F.content), kind: O.kind, name: O.name }, L.value = F, Ee.value = void 0, V.value = "";
      const ie = `Version ${F.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? i.value = ie : (ia = ie, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function La(D, O, F) {
      const ie = O.map((he) => o.title("message", he) ?? he), oe = D.kind === "base" ? "use" : "include";
      R.value = {
        header: `${D.title} is in use`,
        message: `${ye(O.length, "message")} ${O.length === 1 ? oe + "s" : oe} it: ${ie.join(", ")}. Remove it from ${O.length === 1 ? "that message" : "them"} first.`,
        links: O.map((he, na) => ({ label: ie[na], open: () => r({ name: "resource", kind: "message", resource: he, section: "content" }) }))
      };
    }
    async function ol() {
      const D = c.value;
      if (!D || D.state !== "created" || I.value !== void 0) return;
      const O = D.used_by?.messages ?? [];
      if (D.kind === "base" && O.length) {
        La(D, O);
        return;
      }
      if (await Ce.confirm({
        header: `Delete ${D.title}?`,
        message: D.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${me[D.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        I.value = "delete", V.value = i.value = "";
        try {
          await se.remove(C.value, D.revision), m(!1), r({ name: "library", section: ca(d.kind) });
        } catch (ie) {
          const oe = De(ie);
          oe?.dependents?.length ? La(D, oe.dependents) : sa(ie, `${D.title} could not be deleted.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    function rl() {
      const D = c.value;
      D && w({ kind: d.kind, from: { kind: D.kind, name: D.name } });
    }
    const ul = P(() => d.kind === "base" ? c.value?.used_by?.messages : void 0), Ye = P(() => I.value === "save");
    A(), X(() => d.section, (D) => {
      D === "history" && !E.value.length && Z();
    }, { immediate: !0 });
    let ia = "";
    return X(() => d.section, () => {
      i.value = ia, ia = "", V.value = "";
    }), (D, O) => (l(), n(J, null, [
      b.value ? (l(), M(ha, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + e(fa)[a.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: O[0] || (O[0] = (F) => e(r)({ name: "library", section: e(ca)(a.kind) }))
      }, null, 8, ["cta"])) : k.value ? (l(), n("p", dn, [
        s(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        O[11] || (O[11] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(J, { key: 2 }, [
        s(Be, {
          title: q.value.title,
          description: q.value.description
        }, ma({ _: 2 }, [
          c.value ? {
            name: "actions",
            fn: j(() => [
              _.value ? (l(), M(xl, {
                key: 0,
                busy: Ye.value,
                "review-disabled": ll.value,
                onDiscard: Va,
                onReview: tl
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(J, { key: 1 }, [
                a.kind === "message" ? (l(), M(e(B), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: I.value === "test",
                  disabled: !!We.value || I.value !== void 0,
                  title: We.value || void 0,
                  onClick: il
                }, {
                  icon: j(() => [
                    s(e(N), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : S("", !0),
                s(e(B), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: I.value !== void 0,
                  onClick: rl
                }, {
                  icon: j(() => [
                    s(e(N), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                c.value.state === "created" ? (l(), M(e(B), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: I.value === "delete",
                  disabled: I.value !== void 0,
                  onClick: ol
                }, {
                  icon: j(() => [
                    s(e(N), {
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
        p.value ? (l(), n("div", cn, [
          t("span", null, y(p.value), 1),
          s(e(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: O[1] || (O[1] = (F) => H())
          })
        ])) : U.value ? (l(), n("p", vn, [
          s(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          Y("Loading " + y(Q.value) + "…", 1)
        ])) : S("", !0),
        c.value && h.value ? (l(), n(J, { key: 2 }, [
          f.value ? (l(), n("p", mn, [
            s(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              Y(y(f.value.by) + " saved " + y(c.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              s(e(B), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Va
              })
            ])
          ])) : S("", !0),
          _.value && xa.value && !f.value ? (l(), n("p", fn, y(xa.value), 1)) : a.kind === "message" && !_.value && We.value ? (l(), n("p", bn, [
            Y(y(We.value) + " ", 1),
            e(u)?.administer_delivery && e(v) && !e(v).configured ? (l(), M(e(B), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: O[2] || (O[2] = (F) => e(Ce).navigate("/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          V.value && x.value ? (l(), n("p", yn, [
            s(e(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            Y(y(V.value), 1)
          ])) : V.value ? (l(), n("p", pn, [
            t("span", null, y(V.value), 1),
            Ca.value && e(u)?.administer_delivery ? (l(), M(e(B), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: O[3] || (O[3] = (F) => e(Ce).navigate("/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          i.value ? (l(), n("p", gn, [
            s(e(N), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            Y(y(i.value), 1)
          ])) : S("", !0),
          K.value && a.section === "content" ? (l(), n("div", hn, [
            s(e(N), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", kn, [
              Y(y(K.value), 1),
              _.value ? (l(), n(J, { key: 0 }, [
                Y(" Save or discard your changes to reset it.")
              ], 64)) : S("", !0)
            ]),
            le.value ? (l(), M(e(B), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: O[4] || (O[4] = (F) => Ra(le.value, !0, !0))
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            s(e(B), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: I.value === "reset",
              disabled: I.value !== void 0 || _.value,
              onClick: Sa
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : S("", !0),
          yl(t("div", $n, [
            s(ti, {
              draft: h.value,
              problem: Fe.value,
              disabled: Ye.value
            }, null, 8, ["draft", "problem", "disabled"]),
            s(ks, {
              draft: h.value,
              messages: ul.value,
              onProblem: O[5] || (O[5] = (F) => W.value = F)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [pl, a.section === "content"]
          ]),
          a.section === "variables" ? (l(), M(wi, {
            key: 7,
            draft: h.value,
            label: q.value.title,
            problem: Fe.value,
            disabled: Ye.value,
            onInvalid: O[6] || (O[6] = (F) => ge.value = F)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : a.section === "used-by" ? (l(), M(un, {
            key: 8,
            resource: c.value
          }, null, 8, ["resource"])) : a.section === "history" ? (l(), M(Hi, {
            key: 9,
            resource: c.value,
            revisions: E.value,
            loading: z.value,
            error: ee.value,
            busy: typeof I.value == "number" ? I.value : I.value ? -1 : void 0,
            onShow: nl,
            onRestore: Aa,
            onRetry: Z
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      c.value && h.value ? (l(), M(As, {
        key: 3,
        visible: Ae.value,
        saved: e(ke)(c.value),
        draft: h.value,
        busy: Ye.value,
        error: Je.value,
        dependents: Ke.value,
        "suggested-note": L.value ? `Restore version ${L.value.version}` : void 0,
        onClose: O[7] || (O[7] = (F) => Ae.value = !1),
        onSave: sl
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : S("", !0),
      c.value ? (l(), M(Li, {
        key: 4,
        revision: Ee.value,
        current: c.value,
        compare: Ta.value,
        included: Ua.value,
        busy: typeof I.value == "number" || I.value === "reset",
        onClose: O[8] || (O[8] = (F) => Ee.value = void 0),
        onRestore: Aa,
        onReset: O[9] || (O[9] = (F) => {
          Ee.value = void 0, Sa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : S("", !0),
      s(Xa, {
        refusal: R.value,
        onClose: O[10] || (O[10] = (F) => R.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ge = /* @__PURE__ */ new Map();
function _n(a, d) {
  const o = Ge.get(a);
  if (o && o.revision >= d) return o.url;
  const u = Promise.resolve(Al.get(`/api/v1/mail/library/asset/${encodeURIComponent(a)}/content`, { responseType: "blob" })).then((v) => v.data instanceof Blob ? URL.createObjectURL(v.data) : void 0, () => {
    Ge.get(a)?.url === u && Ge.delete(a);
  });
  return Ge.set(a, { revision: d, url: u }), o && o.url.then((v) => {
    v && URL.revokeObjectURL(v);
  }), u;
}
const xn = ["src", "alt"], Cn = {
  key: 0,
  "aria-hidden": "true"
}, el = /* @__PURE__ */ te({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(a) {
    const d = a, o = $();
    X(() => [d.name, d.revision], async ([v, r]) => {
      o.value = void 0, o.value = await _n(v, r);
    }, { immediate: !0 });
    const u = P(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (v, r) => (l(), n("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": a.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: a.alt ?? ""
      }, null, 8, xn)) : (l(), n(J, { key: 1 }, [
        s(e(N), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        u.value ? (l(), n("span", Cn, y(u.value), 1)) : S("", !0)
      ], 64))
    ], 2));
  }
});
function Me(a) {
  return !!a && typeof a == "object" && !Array.isArray(a);
}
function Vn(a, d) {
  return a;
}
function Sn(a, d, o) {
  if (d !== void 0 && !d) return null;
  const u = Me(a) ? a : {}, v = [
    u,
    Me(u.data) ? u.data : null,
    Me(u.payload) ? u.payload : null,
    Me(u.detail) ? u.detail : null
  ].filter(Boolean);
  for (const r of v) {
    if (r.event !== "component.meta.changed" && r.event !== "component.deleting" && r.event !== "component.deleted") continue;
    const w = String(r.component_id || ""), m = String(u.topic || r.topic || "");
    if (d === void 0) {
      if (!w && (!m.startsWith("component.") || m === "component.")) continue;
    } else if (w && w !== d || !w && m !== `component.${d}`) continue;
    const T = w || d || m.slice(10);
    return r.event === "component.deleting" && typeof r.deletion_job_id == "string" && r.deletion_job_id ? { event: r.event, component_id: T, deletion_job_id: r.deletion_job_id } : r.event !== "component.meta.changed" ? { event: r.event, component_id: T } : {
      event: "component.meta.changed",
      component_id: T,
      meta: Vn(Me(r.meta) ? r.meta : {}),
      deleted: Array.isArray(r.deleted) ? r.deleted.map(String) : []
    };
  }
  return null;
}
function Tn(a, d, o) {
  const u = Sn(a, d);
  return u?.event === "component.meta.changed" ? u : null;
}
function Un(a, d, o) {
  if (!a) return null;
  const u = Ll(`component.${a}`, (v) => {
    const r = Tn(v, a);
    r && d(r);
  });
  return typeof u == "function" ? u : null;
}
class Ze extends Error {
}
function Rn(a, d) {
  return new Promise((o, u) => {
    let v = null, r = !1, w = !1, m = !1;
    const T = (c) => {
      m || (m = !0, v?.(), c ? u(c) : o());
    };
    async function C() {
      if (!m) {
        if (d.cancelled) {
          T(new Ze("cancelled"));
          return;
        }
        if (r) {
          w = !0;
          return;
        }
        r = !0;
        try {
          const c = await Da.state(a);
          c.status === "completed" ? T() : c.status === "error" ? T(new Ze(c.error ?? "")) : v || (v = Un(c.component_id, () => {
            C();
          }), v ? w = !0 : T(new Ze("")));
        } catch (c) {
          T(c);
        } finally {
          r = !1, w && !m && (w = !1, C());
        }
      }
    }
    C();
  });
}
const jn = { class: "kx-modal-head-icon" }, An = { class: "kx-modal-head-text" }, Ln = { class: "kx-modal-head-title" }, In = { class: "kx-modal-head-sub" }, Nn = ["disabled", "inert"], zn = ["for"], En = { class: "mail-muted" }, On = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Mn = {
  key: 0,
  class: "mail-field"
}, Pn = ["for"], Dn = ["for"], Bn = ["id"], qn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Hn = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Fn = 1024 * 1024, al = /* @__PURE__ */ te({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe(), w = { file: ve(), title: ve(), name: ve() };
    xe(() => o.visible);
    const m = ["image/png", "image/jpeg", "image/gif"], T = $(), C = $(""), c = $(""), h = $(!1), U = $(!1), b = $();
    let k = { cancelled: !1 };
    const p = $(""), f = $(""), g = $("");
    X(() => o.visible, (ae) => {
      if (!ae) {
        k.cancelled = !0;
        return;
      }
      k = { cancelled: !1 }, o.replace || v.ensure("asset"), T.value = void 0, C.value = o.replace?.title ?? "", c.value = o.replace?.name ?? "", h.value = !1, p.value = f.value = g.value = "";
    }), X(C, (ae) => {
      !o.replace && !h.value && (c.value = Ba(ae));
    });
    function _(ae) {
      const Z = Array.isArray(ae.files) ? ae.files[0] : ae.files;
      if (f.value = "", T.value = void 0, !!Z) {
        if (!m.includes(Z.type)) {
          f.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (Z.size > Fn) {
          f.value = "Images must be 1 MB or smaller.";
          return;
        }
        T.value = Z, !o.replace && !C.value && (C.value = Z.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function A() {
      return g.value = "", o.replace ? !0 : (qa.test(c.value) ? v.find("asset", c.value) && (g.value = `An image named ${c.value} already exists. Choose another name or replace ${c.value}.`) : g.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !g.value);
    }
    async function L() {
      if (U.value || !T.value || !C.value.trim() || !A()) return;
      U.value = !0, p.value = "";
      const ae = k;
      try {
        b.value = "upload";
        const Z = await Da.add(T.value), H = { name: c.value, upload_id: Z, title: C.value.trim() }, I = () => o.replace ? se.replaceAsset(H, o.replace.revision) : se.addAsset(H);
        b.value = "save";
        let V;
        try {
          V = await I();
        } catch (x) {
          if ($e(x) !== "upload_still_processing") throw x;
          b.value = "process", await Rn(Z, ae), b.value = "save", V = await I();
        }
        v.patch("asset", V.name, Wa(V)), u("done", V), u("close"), o.replace || r({ name: "library", section: "assets", asset: V.name });
      } catch (Z) {
        if (ae.cancelled) return;
        Z instanceof Ze ? p.value = "The image could not be processed. Try another file, or upload it again." : $e(Z) === "mail_revision_conflict" && !o.replace ? g.value = `An image named ${c.value} already exists. Choose another name or replace ${c.value}.` : p.value = ne(Z, "The image could not be uploaded.");
      } finally {
        U.value = !1, b.value = void 0;
      }
    }
    const E = P(() => b.value === "upload" ? "Uploading the image…" : b.value === "process" ? "Processing the image…" : b.value === "save" ? "Adding it to the library…" : ""), z = P(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), ee = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (ae, Z) => (l(), M(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !U.value || b.value === "process",
      "close-on-escape": !U.value || b.value === "process",
      class: "mail-dialog",
      pt: ee,
      "aria-label": z.value,
      "onUpdate:visible": Z[4] || (Z[4] = (H) => {
        H || u("close");
      })
    }, {
      header: j(() => [
        t("span", jn, [
          s(e(N), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", An, [
          t("span", Ln, y(z.value), 1),
          t("span", In, y(a.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: U.value && b.value !== "process",
          onClick: Z[3] || (Z[3] = (H) => u("close"))
        }, null, 8, ["disabled"]),
        s(e(B), {
          label: a.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: U.value,
          disabled: !T.value || !a.replace && !C.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Te(L, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: U.value,
            inert: U.value || void 0
          }, [
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": f.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: w.file
              }, "Image", 8, zn),
              s(e(ql), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": T.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: w.file, "aria-label": "Image file" } },
                onSelect: _
              }, {
                chooseicon: j(() => [
                  s(e(N), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: j(() => [
                  t("span", En, y(T.value ? `${T.value.name} · ${e(Pe)(T.value.size)}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              f.value ? (l(), n("small", On, y(f.value), 1)) : S("", !0)
            ], 2),
            a.replace ? S("", !0) : (l(), n("div", Mn, [
              t("label", {
                class: "mail-field-label",
                for: w.title
              }, "Name", 8, Pn),
              s(e(de), {
                id: w.title,
                modelValue: C.value,
                "onUpdate:modelValue": Z[0] || (Z[0] = (H) => C.value = H)
              }, null, 8, ["id", "modelValue"])
            ])),
            a.replace ? S("", !0) : (l(), n("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": g.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: w.name
              }, "Reference", 8, Dn),
              s(e(de), {
                id: w.name,
                modelValue: c.value,
                "onUpdate:modelValue": Z[1] || (Z[1] = (H) => c.value = H),
                class: "mail-mono-input",
                invalid: !!g.value,
                "aria-describedby": w.name + "-hint",
                onInput: Z[2] || (Z[2] = (H) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: w.name + "-hint",
                class: re(g.value ? "mail-field-error" : "mail-field-hint")
              }, y(g.value || "Templates show it with this name. It cannot change later."), 11, Bn)
            ], 2))
          ], 8, Nn),
          E.value ? (l(), n("p", qn, [
            s(e(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            Y(y(E.value), 1)
          ])) : S("", !0),
          p.value ? (l(), n("p", Hn, y(p.value), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Jn = { class: "mail-drawer-head" }, Kn = { class: "mail-drawer-title" }, Wn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Yn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Gn = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Zn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Qn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, Xn = { class: "mail-asset-actions" }, eo = { class: "mail-asset-hero" }, ao = { class: "mail-facts mail-card" }, lo = { class: "mail-reference" }, to = { class: "mail-mono-block" }, so = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, io = {
  key: 0,
  class: "mail-muted"
}, no = { class: "mail-list" }, oo = { key: 1 }, ro = {
  key: 0,
  class: "mail-asset-context"
}, uo = ["srcdoc", "title"], co = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, vo = {
  key: 0,
  class: "mail-muted"
}, mo = {
  key: 1,
  class: "mail-history"
}, fo = { class: "mail-history-head" }, bo = { class: "mail-history-main" }, yo = { class: "mail-history-title" }, po = { class: "mail-sub" }, go = /* @__PURE__ */ te({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe();
    xe(() => !!o.name);
    const w = $();
    X(() => !!o.name, (x) => {
      x && (v.ensure("message"), Qe(() => w.value?.focus()));
    }, { immediate: !0 });
    const m = pe(), T = pe([]), C = pe(), c = $(""), h = $(!1), U = $(!1), b = $(""), k = $(""), p = $(""), f = $(), g = $(!1), _ = $(!1), A = $(!1), L = $(), E = Ve();
    async function z() {
      const x = o.name, i = E();
      if (!x) {
        m.value = void 0;
        return;
      }
      h.value = !0;
      try {
        const [R, Q] = await Promise.all([se.get({ kind: "asset", name: x }), se.history({ kind: "asset", name: x })]);
        if (!i()) return;
        m.value = R, T.value = Q, U.value = !1, b.value = "";
        const q = R.used_by?.messages?.[0];
        c.value = q ?? "";
        const K = q ? await se.preview(q, []) : void 0;
        i() && (C.value = K);
      } catch (R) {
        if (!i()) return;
        U.value = Xe(R), b.value = U.value ? "" : ne(R, "This image could not be loaded.");
      } finally {
        i() && (h.value = !1);
      }
    }
    X(() => o.name, () => {
      g.value = _.value = !1, p.value = k.value = "", z();
    }, { immediate: !0 }), Ue("mail.library", () => {
      o.name && z();
    });
    const ee = P(() => (m.value?.used_by?.messages ?? []).map((x) => ({ name: x, title: v.title("message", x) })));
    async function ae() {
      const x = m.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(x.name)}`), _.value = !0;
        } catch {
          _.value = !1;
        }
    }
    const Z = P(() => m.value ? Za(m.value.name) : "");
    async function H() {
      try {
        await navigator.clipboard.writeText(Z.value), g.value = !0;
      } catch {
        g.value = !1;
      }
    }
    async function I(x, i) {
      const R = m.value;
      if (!R || f.value !== void 0) return;
      if (x === "delete" && ee.value.length) {
        L.value = {
          header: `${R.title} is in use`,
          message: `${ye(ee.value.length, "message")} ${ee.value.length === 1 ? "shows" : "show"} it: ${ee.value.map((q) => q.title ?? q.name).join(", ")}. Remove it from ${ee.value.length === 1 ? "that message" : "them"} first.`,
          links: ee.value.map((q) => ({ label: q.title ?? q.name, open: () => r({ name: "resource", kind: "message", resource: q.name, section: "content" }) }))
        };
        return;
      }
      const Q = {
        reset: { header: `Reset ${R.title} to the original?`, message: `The image included with ${R.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${R.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${i?.version} of ${R.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[x];
      if (await Ce.confirm({ header: Q.header, message: Q.message, acceptLabel: Q.accept, rejectLabel: "Cancel", ...x === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        f.value = i ? i.seq : x, k.value = p.value = "";
        try {
          if (x === "delete") {
            await se.remove({ kind: "asset", name: R.name }, R.revision), u("close");
            return;
          }
          m.value = x === "reset" ? await se.reset({ kind: "asset", name: R.name }, R.revision) : await se.restore({ kind: "asset", name: R.name }, i.seq, R.revision), p.value = x === "reset" ? `${R.title} is back to the original.` : `Version ${i.version} is shown again everywhere.`, await z();
        } catch (q) {
          const K = De(q);
          if (K?.dependents?.length || K?.references?.length) {
            const le = [...(K.references ?? []).filter((W) => W.kind !== "asset")];
            for (const W of K.dependents ?? []) le.some((G) => G.kind === "message" && G.name === W) || le.push({ kind: "message", name: W });
            await Promise.all([...new Set(le.map((W) => W.kind))].map((W) => v.ready(W) ? void 0 : v.load(W))), L.value = {
              header: `${R.title} is in use`,
              message: `${ye(le.length, "template")} ${le.length === 1 ? "names" : "name"} ${R.title}, in the current version or one kept in History. Remove it from ${le.length === 1 ? "that template" : "them"} first.`,
              links: le.map((W) => ({
                label: v.title(W.kind, W.name) ?? W.name,
                icon: be[W.kind],
                open: () => r(W.kind === "asset" ? { name: "library", section: "assets", asset: W.name } : { name: "resource", kind: W.kind, resource: W.name, section: "content" })
              }))
            };
          } else
            k.value = $e(q) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ne(q, "The image could not be changed."), $e(q) === "mail_revision_conflict" && z();
        } finally {
          f.value = void 0;
        }
      }
    }
    const V = P(() => C.value?.html ? $a(C.value.html, C.value.inline_assets) : "");
    return (x, i) => (l(), n(J, null, [
      s(e(Ja), {
        visible: !!a.name,
        position: "right",
        modal: !0,
        dismissable: f.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": i[5] || (i[5] = (R) => {
          R || u("close");
        })
      }, {
        default: j(() => [
          t("div", {
            ref_key: "drawer",
            ref: w,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", Jn, [
              t("div", Kn, [
                m.value?.state === "customized" ? (l(), M(e(Ne), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : S("", !0),
                t("h2", null, y(m.value?.title ?? "Image"), 1)
              ]),
              s(e(B), {
                text: "",
                severity: "secondary",
                disabled: !m.value,
                "aria-label": _.value ? "Link copied" : "Copy link",
                title: _.value ? "Link copied" : "Copy link",
                onClick: ae
              }, {
                icon: j(() => [
                  s(e(N), {
                    icon: _.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              s(e(B), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: f.value !== void 0,
                onClick: i[0] || (i[0] = (R) => u("close"))
              }, {
                icon: j(() => [
                  s(e(N), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            h.value && !m.value ? (l(), n("p", Wn, [
              s(e(N), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              i[9] || (i[9] = Y("Loading image…", -1))
            ])) : U.value ? (l(), n("p", Yn, [
              s(e(N), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              i[10] || (i[10] = Y("This image no longer exists. It was deleted while you were away.", -1))
            ])) : b.value ? (l(), n("div", Gn, [
              t("span", null, y(b.value), 1),
              s(e(B), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: i[1] || (i[1] = (R) => z())
              })
            ])) : S("", !0),
            m.value ? (l(), n(J, { key: 3 }, [
              k.value ? (l(), n("p", Zn, [
                s(e(N), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                Y(y(k.value), 1)
              ])) : S("", !0),
              p.value ? (l(), n("p", Qn, [
                s(e(N), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                Y(y(p.value), 1)
              ])) : S("", !0),
              t("div", Xn, [
                s(e(B), {
                  label: "Replace",
                  disabled: f.value !== void 0,
                  onClick: i[2] || (i[2] = (R) => A.value = !0)
                }, {
                  icon: j(() => [
                    s(e(N), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                m.value.state === "customized" ? (l(), M(e(B), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: f.value === "reset",
                  disabled: f.value !== void 0,
                  onClick: i[3] || (i[3] = (R) => I("reset"))
                }, {
                  icon: j(() => [
                    s(e(N), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0),
                m.value.state === "created" ? (l(), M(e(B), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: f.value === "delete",
                  disabled: f.value !== void 0,
                  onClick: i[4] || (i[4] = (R) => I("delete"))
                }, {
                  icon: j(() => [
                    s(e(N), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0)
              ]),
              t("div", eo, [
                s(el, {
                  name: m.value.name,
                  revision: m.value.revision,
                  asset: m.value.asset,
                  large: "",
                  alt: m.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", ao, [
                i[11] || (i[11] = t("dt", null, "Reference", -1)),
                t("dd", lo, [
                  t("span", to, y(Z.value), 1),
                  s(e(B), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": g.value ? "Reference copied" : "Copy reference",
                    title: g.value ? "Reference copied" : "Copy reference",
                    onClick: H
                  }, {
                    icon: j(() => [
                      s(e(N), {
                        icon: g.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                i[12] || (i[12] = t("dt", null, "File", -1)),
                t("dd", null, y(m.value.asset?.filename) + " · " + y(e(Pe)(m.value.asset?.size)), 1),
                i[13] || (i[13] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  s(wa, { resource: m.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", so, [
                i[14] || (i[14] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                ee.value.length ? (l(), n(J, { key: 1 }, [
                  t("ul", no, [
                    (l(!0), n(J, null, ce(ee.value, (R) => (l(), n("li", {
                      key: R.name
                    }, [
                      s(e(B), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (Q) => e(r)({ name: "resource", kind: "message", resource: R.name, section: "content" })
                      }, {
                        default: j(() => [
                          s(e(N), {
                            icon: e(be).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          R.title === void 0 ? (l(), M(e(Re), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", oo, y(R.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  V.value ? (l(), n("div", ro, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: V.value,
                      title: "How " + m.value.title + " looks in " + (e(v).title("message", c.value) ?? "")
                    }, null, 8, uo)
                  ])) : S("", !0)
                ], 64)) : (l(), n("p", io, "No message shows " + y(m.value.title) + " with its sample values.", 1))
              ]),
              t("section", co, [
                i[15] || (i[15] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                T.value.length ? (l(), n("ol", mo, [
                  (l(!0), n(J, null, ce(T.value, (R) => (l(), n("li", {
                    key: R.seq,
                    class: "mail-history-row"
                  }, [
                    t("div", fo, [
                      t("div", bo, [
                        t("span", yo, [
                          Y("Version " + y(R.version) + " · " + y(e(ba)[R.action]) + " ", 1),
                          R.version === m.value.revision ? (l(), M(e(Ne), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : S("", !0)
                        ]),
                        t("span", po, y(e(we)(R.author_label, R.author)) + " · " + y(e(He)(R.created_at)), 1)
                      ]),
                      e(Pa)(R) && R.version !== m.value.revision ? (l(), M(e(B), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: f.value === R.seq,
                        disabled: f.value !== void 0,
                        onClick: (Q) => I("restore", R)
                      }, {
                        icon: j(() => [
                          s(e(N), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", vo, y(m.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : S("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      m.value ? (l(), M(al, {
        key: 0,
        visible: A.value,
        replace: m.value,
        onClose: i[6] || (i[6] = (R) => A.value = !1),
        onDone: i[7] || (i[7] = (R) => z())
      }, null, 8, ["visible", "replace"])) : S("", !0),
      s(Xa, {
        refusal: L.value,
        onClose: i[8] || (i[8] = (R) => L.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), ho = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ko = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, $o = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, wo = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, _o = { class: "mail-toolbar" }, xo = {
  class: "mail-count",
  role: "status"
}, Co = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Vo = { class: "mail-sub" }, So = { class: "mail-mono-block" }, To = { class: "mail-muted" }, Uo = { class: "mail-muted" }, Ro = /* @__PURE__ */ te({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(a) {
    const d = a, { go: o, upload: u } = fe(), v = $(""), r = $("");
    let w;
    X(v, (L) => {
      clearTimeout(w), w = setTimeout(() => {
        r.value = L.trim();
      }, 250);
    });
    const m = pe([]), T = $(!0), C = $(!1), c = $(!1), h = $(""), U = $(""), b = Ve();
    async function k(L = !1) {
      const E = b();
      T.value = !0;
      try {
        const z = await se.assets(r.value || void 0);
        if (!E()) return;
        m.value = z, h.value = U.value = "", c.value = !1, C.value = !0;
      } catch (z) {
        if (!E()) return;
        c.value = qe(z);
        const ee = c.value ? "" : ne(z, "Images could not be loaded.");
        L && C.value && !c.value ? U.value = ee : h.value = ee;
      } finally {
        E() && (T.value = !1);
      }
    }
    X(r, () => {
      k();
    }), la(() => k(C.value)), Ue("mail.library", () => {
      k(C.value);
    });
    function p(L) {
      const E = L.used_by?.messages;
      return E ? ye(E, "message") : "—";
    }
    const f = P(() => m.value.reduce((L, E) => L + (E.asset?.size ?? 0), 0)), g = P(() => `${ye(m.value.length, "image")} · ${Pe(f.value)}`);
    function _(L) {
      const E = L.asset;
      return E ? Pe(E.size) : "";
    }
    function A(L) {
      o({ name: "library", section: "assets", asset: L.name });
    }
    return (L, E) => (l(), n(J, null, [
      s(Be, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: j(() => [
          s(e(B), {
            label: "Upload image",
            onClick: E[0] || (E[0] = (z) => e(u)())
          }, {
            icon: j(() => [
              s(e(N), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      c.value ? (l(), n("p", ho, [
        s(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        E[7] || (E[7] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : h.value ? (l(), n("div", ko, [
        t("span", null, y(h.value), 1),
        s(e(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[1] || (E[1] = (z) => k())
        })
      ])) : S("", !0),
      U.value ? (l(), n("div", $o, [
        t("span", null, y(U.value) + " The list shows what was loaded before.", 1),
        s(e(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: E[2] || (E[2] = (z) => k(!0))
        })
      ])) : T.value && !C.value ? (l(), n("p", wo, [
        s(e(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        E[8] || (E[8] = Y("Loading images…", -1))
      ])) : C.value && !m.value.length && !r.value ? (l(), M(ha, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: E[3] || (E[3] = (z) => e(u)())
      })) : C.value ? (l(), n(J, { key: 5 }, [
        t("div", _o, [
          s(e(pa), { class: "mail-search" }, {
            default: j(() => [
              s(e(ga), null, {
                default: j(() => [
                  s(e(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(e(de), {
                modelValue: v.value,
                "onUpdate:modelValue": E[4] || (E[4] = (z) => v.value = z),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", xo, y(g.value), 1)
        ]),
        m.value.length ? (l(), M(e(ya), {
          key: 1,
          value: m.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: E[5] || (E[5] = (z) => A(z.data))
        }, {
          default: j(() => [
            s(e(ue), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: j(({ data: z }) => [
                s(el, {
                  name: z.name,
                  revision: z.revision,
                  asset: z.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            s(e(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: z }) => [
                s(e(B), {
                  link: "",
                  class: "mail-name",
                  label: z.title,
                  onClick: Te((ee) => A(z), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", Vo, [
                  t("span", So, y(z.name), 1),
                  z.asset?.filename ? (l(), n(J, { key: 0 }, [
                    Y(" · " + y(z.asset.filename), 1)
                  ], 64)) : S("", !0)
                ])
              ]),
              _: 1
            }),
            s(e(ue), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: z }) => [
                t("span", To, y(_(z)), 1)
              ]),
              _: 1
            }),
            s(e(ue), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: z }) => [
                t("span", null, y(p(z)), 1)
              ]),
              _: 1
            }),
            s(e(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: z }) => [
                s(wa, { resource: z }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            s(e(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: z }) => [
                t("span", Uo, y(z.state === "original" ? "—" : e(Ma)(z.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", Co, "Nothing matches. Try another name."))
      ], 64)) : S("", !0),
      s(go, {
        name: d.asset,
        onClose: E[6] || (E[6] = (z) => e(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), jo = { class: "kx-modal-head-icon" }, Ao = { class: "kx-modal-head-text" }, Lo = { class: "kx-modal-head-title" }, Io = { class: "kx-modal-head-sub" }, No = ["id"], zo = ["disabled", "inert"], Eo = {
  key: 0,
  class: "mail-field"
}, Oo = {
  key: 1,
  class: "mail-field"
}, Mo = ["for"], Po = { class: "mail-field" }, Do = ["for"], Bo = ["for"], qo = ["id"], Ho = { class: "mail-field" }, Fo = ["for"], Jo = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Se = "\0blank", Ko = /* @__PURE__ */ te({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r } = fe(), w = $("message"), m = $(""), T = $(""), C = $(""), c = $(""), h = $(!1), U = $(!1), b = $(""), k = $(""), p = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, f = ["message", "base", "part"].map((H) => ({ value: H, label: me[H] })), g = P(() => !!o.intent.from), _ = P(() => [
      { value: Se, label: "Blank" },
      ...v.ofKind(w.value).map((H) => ({ value: H.name, label: H.title }))
    ]), A = P(() => m.value === Se || !!v.find(w.value, m.value));
    function L(H) {
      if (m.value = H, H === Se) return;
      const I = v.find(w.value, H);
      I && (c.value = I.description, o.intent.from && (T.value = `${I.title} copy`, h.value = !1));
    }
    X(() => o.visible, async (H) => {
      H && (w.value = o.intent.from?.kind ?? o.intent.kind ?? "message", T.value = C.value = c.value = m.value = "", b.value = k.value = "", h.value = !1, o.intent.from ? (m.value = o.intent.from.name, v.ready(w.value) || await v.load(w.value), o.visible && L(o.intent.from.name)) : (m.value = Se, v.ensure(w.value)));
    }, { immediate: !0 }), X(w, (H) => {
      o.intent.from || (m.value = Se, c.value = "", o.visible && v.ensure(H));
    }), xe(() => o.visible), X(T, (H) => {
      h.value || (C.value = Ba(H));
    });
    const E = P(() => w.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function z() {
      return k.value = "", C.value ? qa.test(C.value) ? v.find(w.value, C.value) && (k.value = `A ${me[w.value].toLowerCase()} with this reference already exists. Choose another.`) : k.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : k.value = "Enter a reference.", !k.value;
    }
    async function ee() {
      if (!(U.value || !T.value.trim() || !A.value || !z())) {
        U.value = !0, b.value = "";
        try {
          const H = m.value === Se ? await se.create(Qt(w.value, C.value, T.value.trim(), c.value.trim())) : await se.copy({
            kind: w.value,
            name: C.value,
            title: T.value.trim(),
            description: c.value.trim(),
            from: { kind: w.value, name: m.value }
          });
          v.patch(H.kind, H.name, Wa(H)), u("close"), r({ name: "resource", kind: H.kind, resource: H.name, section: "content" });
        } catch (H) {
          $e(H) === "mail_revision_conflict" ? k.value = `A ${me[w.value].toLowerCase()} with this reference already exists. Choose another.` : b.value = ne(H, "The resource could not be created.");
        } finally {
          U.value = !1;
        }
      }
    }
    const ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, Z = P(() => o.intent.from ? `Duplicate ${v.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${me[w.value].toLowerCase()}`);
    return (H, I) => (l(), M(e(je), {
      visible: a.visible,
      modal: "",
      draggable: !1,
      closable: !U.value,
      "close-on-escape": !U.value,
      class: "mail-dialog",
      pt: ae,
      "aria-label": Z.value,
      "onUpdate:visible": I[6] || (I[6] = (V) => {
        V || u("close");
      })
    }, {
      header: j(() => [
        t("span", jo, [
          s(e(N), {
            icon: e(be)[w.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", Ao, [
          t("span", Lo, y(Z.value), 1),
          t("span", Io, y(m.value === Se ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: j(() => [
        s(e(B), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: U.value,
          onClick: I[5] || (I[5] = (V) => u("close"))
        }, null, 8, ["disabled"]),
        s(e(B), {
          label: "Create " + e(me)[w.value].toLowerCase(),
          type: "submit",
          form: p.hint,
          loading: U.value,
          disabled: !T.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: p.hint,
          class: "mail-form",
          onSubmit: Te(ee, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: U.value,
            inert: U.value || void 0
          }, [
            g.value ? S("", !0) : (l(), n("div", Eo, [
              I[7] || (I[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              s(e(_e), {
                modelValue: w.value,
                "onUpdate:modelValue": I[0] || (I[0] = (V) => w.value = V),
                options: e(f),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            g.value ? S("", !0) : (l(), n("div", Oo, [
              t("label", {
                class: "mail-field-label",
                for: p.source
              }, "Start from", 8, Mo),
              s(e(ze), {
                "model-value": m.value,
                "input-id": p.source,
                options: _.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !e(v).ready(w.value),
                "onUpdate:modelValue": L
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", Po, [
              t("label", {
                class: "mail-field-label",
                for: p.title
              }, "Name", 8, Do),
              s(e(de), {
                id: p.title,
                modelValue: T.value,
                "onUpdate:modelValue": I[1] || (I[1] = (V) => T.value = V),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: re(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: p.reference
              }, "Reference", 8, Bo),
              s(e(de), {
                id: p.reference,
                modelValue: C.value,
                "onUpdate:modelValue": I[2] || (I[2] = (V) => C.value = V),
                class: "mail-mono-input",
                invalid: !!k.value,
                "aria-describedby": p.reference + "-hint",
                onInput: I[3] || (I[3] = (V) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: p.reference + "-hint",
                class: re(k.value ? "mail-field-error" : "mail-field-hint")
              }, y(k.value || E.value), 11, qo)
            ], 2),
            t("div", Ho, [
              t("label", {
                class: "mail-field-label",
                for: p.description
              }, "Description", 8, Fo),
              s(e(da), {
                id: p.description,
                modelValue: c.value,
                "onUpdate:modelValue": I[4] || (I[4] = (V) => c.value = V),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, zo),
          b.value ? (l(), n("p", Jo, y(b.value), 1)) : S("", !0)
        ], 40, No)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Wo = { class: "mail-drawer-head" }, Yo = { class: "mail-drawer-title" }, Go = {
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
}, fr = { class: "mail-timeline" }, br = { class: "mail-muted" }, yr = { class: "mail-facts" }, pr = { class: "mail-mono-block" }, gr = /* @__PURE__ */ te({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(a, { emit: d }) {
    const o = a, u = d, { library: v, go: r, capabilities: w, delivery: m } = fe();
    xe(() => !!o.messageId);
    const T = $();
    X(() => !!o.messageId, (x) => {
      x && Qe(() => T.value?.focus());
    }, { immediate: !0 });
    const C = P(() => !!h.value?.last_error && Cl.has(h.value.last_error.code)), c = P(() => {
      const x = h.value?.last_error;
      if (!x) return;
      const i = m.value?.driver && m.value.driver.id === h.value?.driver_id ? m.value.driver.label : "The delivery service";
      return (w.value?.administer_delivery ? Vl(x.code, i) : void 0) ?? { lead: "", next: x.message };
    }), h = pe(), U = $(!1), b = $(!1), k = $(!1), p = $(""), f = $(""), g = $(!1), _ = $(), A = $(!1), L = Ve();
    async function E() {
      const x = o.messageId, i = L();
      if (!x) {
        h.value = void 0;
        return;
      }
      U.value = !0;
      try {
        const R = await ea.get(x);
        if (!i()) return;
        h.value = R, p.value = "", b.value = k.value = !1;
      } catch (R) {
        if (!i()) return;
        h.value = void 0, b.value = Xe(R), k.value = qe(R), p.value = b.value || k.value ? "" : ne(R, "This message could not be loaded.");
      } finally {
        i() && (U.value = !1);
      }
    }
    X(() => o.messageId, (x) => {
      _.value = void 0, f.value = "", A.value = !1, x !== h.value?.message_id && (h.value = void 0), E();
    }, { immediate: !0 }), Ue("mail.activity", () => {
      o.messageId && E();
    });
    async function z() {
      const x = h.value;
      if (!(!x || g.value)) {
        g.value = !0, f.value = "";
        try {
          _.value = await ea.resend(x.message_id);
        } catch (i) {
          f.value = ne(i, "The message could not be sent again.");
        } finally {
          g.value = !1;
        }
      }
    }
    async function ee() {
      const x = h.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(x.message_id)}`), A.value = !0;
        } catch {
          A.value = !1;
        }
    }
    const ae = P(() => {
      const x = h.value?.template;
      return x ? v.title("message", x) : "";
    }), Z = P(() => !!h.value?.template && !!v.find("message", h.value.template)), H = P(() => {
      const x = h.value;
      if (!x) return [];
      const i = [{ label: "Accepted for delivery", at: x.created_at }];
      return x.status === "queued" && x.next_attempt_at && i.push({ label: x.attempts ? `Attempt ${x.attempts} did not go through; trying again` : "Next delivery attempt", at: x.next_attempt_at }), x.sent_at ? i.push({ label: x.attempts > 1 ? `Sent after ${x.attempts} attempts` : "Sent", at: x.sent_at }) : x.status === "failed" && x.finished_at && i.push({ label: x.attempts > 1 ? `Failed after ${x.attempts} attempts` : "Failed", at: x.finished_at }), i;
    }), I = P(() => (h.value?.attachments ?? []).map((x) => x.filename || "Attachment")), V = P(() => {
      const x = h.value;
      return x ? [
        { label: "Message ID", value: x.message_id },
        { label: "Delivery service", value: w.value?.administer_delivery ? x.driver_id : void 0 },
        { label: "Service message ID", value: x.provider_message_id },
        { label: "Error code", value: x.last_error?.code },
        { label: "Service response", value: x.last_error?.provider_detail }
      ].filter((i) => !!i.value) : [];
    });
    return (x, i) => (l(), M(e(Ja), {
      visible: !!a.messageId,
      position: "right",
      modal: !0,
      dismissable: !g.value,
      "close-on-escape": !g.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": i[6] || (i[6] = (R) => {
        R || u("close");
      })
    }, {
      default: j(() => [
        t("div", {
          ref_key: "drawer",
          ref: T,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", Wo, [
            t("div", Yo, [
              h.value ? (l(), M(e(Ne), {
                key: 0,
                severity: e(Fa)[h.value.status],
                value: e(Ha)[h.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : S("", !0),
              t("h2", null, y(h.value?.subject ?? "Message"), 1)
            ]),
            s(e(B), {
              text: "",
              severity: "secondary",
              disabled: !h.value,
              "aria-label": A.value ? "Link copied" : "Copy link",
              title: A.value ? "Link copied" : "Copy link",
              onClick: ee
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: A.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            s(e(B), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: g.value,
              onClick: i[0] || (i[0] = (R) => u("close"))
            }, {
              icon: j(() => [
                s(e(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          U.value && !h.value ? (l(), n("p", Go, [
            s(e(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            i[7] || (i[7] = Y("Loading message…", -1))
          ])) : b.value ? (l(), n("p", Zo, [
            s(e(N), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            i[8] || (i[8] = Y("This message is no longer in Activity.", -1))
          ])) : k.value ? (l(), n("p", Qo, [
            s(e(N), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            i[9] || (i[9] = Y("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : p.value ? (l(), n("div", Xo, [
            t("span", null, y(p.value), 1),
            s(e(B), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: i[1] || (i[1] = (R) => E())
            })
          ])) : S("", !0),
          h.value ? (l(), n(J, { key: 4 }, [
            h.value.status === "failed" ? (l(), n("div", er, [
              s(e(N), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", ar, [
                i[12] || (i[12] = t("strong", null, "This message was not delivered.", -1)),
                c.value?.lead ? (l(), n("span", lr, y(c.value.lead), 1)) : S("", !0),
                c.value ? (l(), n("span", tr, y(c.value.next), 1)) : S("", !0),
                _.value ? (l(), n("p", sr, [
                  i[10] || (i[10] = Y(" Sent again as a new message. ", -1)),
                  s(e(B), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: i[2] || (i[2] = (R) => e(r)({ name: "activity", message: _.value.message_id }))
                  })
                ])) : C.value ? (l(), n("p", ir, [
                  i[11] || (i[11] = Y("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  e(w)?.administer_delivery ? (l(), M(e(B), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: i[3] || (i[3] = (R) => e(Ce).navigate("/system/settings/mail"))
                  })) : S("", !0)
                ])) : h.value.can_resend ? S("", !0) : (l(), n("p", nr, "It cannot be sent again because its content was not kept.")),
                f.value ? (l(), n("p", or, y(f.value), 1)) : S("", !0),
                e(w)?.send && h.value.can_resend && !_.value && !C.value ? (l(), n("div", rr, [
                  s(e(B), {
                    label: "Send again",
                    loading: g.value,
                    onClick: z
                  }, {
                    icon: j(() => [
                      s(e(N), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : S("", !0)
              ])
            ])) : h.value.status === "queued" ? (l(), n("p", ur, [
              s(e(N), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              i[13] || (i[13] = Y("Waiting to be delivered. ", -1))
            ])) : S("", !0),
            t("dl", dr, [
              i[19] || (i[19] = t("dt", null, "To", -1)),
              t("dd", null, y(h.value.to.join(", ")), 1),
              h.value.cc?.length ? (l(), n(J, { key: 0 }, [
                i[14] || (i[14] = t("dt", null, "Cc", -1)),
                t("dd", null, y(h.value.cc.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.bcc?.length ? (l(), n(J, { key: 1 }, [
                i[15] || (i[15] = t("dt", null, "Bcc", -1)),
                t("dd", null, y(h.value.bcc.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.reply_to ? (l(), n(J, { key: 2 }, [
                i[16] || (i[16] = t("dt", null, "Reply-to", -1)),
                t("dd", null, y(h.value.reply_to), 1)
              ], 64)) : S("", !0),
              i[20] || (i[20] = t("dt", null, "Template", -1)),
              t("dd", null, [
                ae.value === void 0 ? (l(), M(e(Re), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : Z.value ? (l(), M(e(B), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ae.value,
                  onClick: i[4] || (i[4] = (R) => e(r)({ name: "resource", kind: "message", resource: h.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", cr, y(ae.value || "Written directly"), 1))
              ]),
              i[21] || (i[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                Y(y(e(we)(h.value.sender_label, h.value.sender)), 1),
                h.value.origin ? (l(), n("span", vr, y(e(ta)(h.value.origin)), 1)) : S("", !0)
              ]),
              I.value.length ? (l(), n(J, { key: 3 }, [
                i[17] || (i[17] = t("dt", null, "Attachments", -1)),
                t("dd", null, y(I.value.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.resend_of ? (l(), n(J, { key: 4 }, [
                i[18] || (i[18] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  s(e(B), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: i[5] || (i[5] = (R) => e(r)({ name: "activity", message: h.value.resend_of }))
                  })
                ])
              ], 64)) : S("", !0)
            ]),
            t("section", mr, [
              i[22] || (i[22] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", fr, [
                (l(!0), n(J, null, ce(H.value, (R) => (l(), n("li", {
                  key: R.label
                }, [
                  t("span", null, y(R.label), 1),
                  t("span", br, y(e(He)(R.at)), 1)
                ]))), 128))
              ])
            ]),
            V.value.length ? (l(), M(Qa, {
              key: 2,
              label: "Technical details"
            }, {
              default: j(() => [
                t("dl", yr, [
                  (l(!0), n(J, null, ce(V.value, (R) => (l(), n(J, {
                    key: R.label
                  }, [
                    t("dt", null, y(R.label), 1),
                    t("dd", pr, y(R.value), 1)
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
}, Ur = { class: "mail-sub" }, Rr = {
  key: 0,
  class: "mail-sub"
}, jr = { class: "mail-muted" }, Ar = {
  key: 2,
  class: "mail-more"
}, Lr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ir = /* @__PURE__ */ te({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(a) {
    const d = a, { library: o, go: u } = fe();
    o.use("message");
    const v = $("all"), r = $(d.template ?? null), w = $(30), m = $(""), T = $("");
    let C;
    X(m, (le) => {
      clearTimeout(C), C = setTimeout(() => {
        T.value = le.trim();
      }, 250);
    }), X(() => d.template, (le) => {
      le !== void 0 && (r.value = le);
    });
    const c = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], h = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], U = P(() => o.ofKind("message").map((le) => ({ label: le.title, value: le.name }))), b = pe([]), k = $(), p = $(!0), f = $(!1), g = $(!1), _ = $(!1), A = $(""), L = $(""), E = $(""), z = Ve();
    function ee(le) {
      return {
        status: v.value === "all" ? void 0 : v.value,
        message: r.value || void 0,
        since: Date.now() - w.value * 24 * 60 * 60 * 1e3,
        q: T.value || void 0,
        cursor: le
      };
    }
    async function ae(le = !1) {
      const W = z();
      p.value = !0;
      try {
        const G = await ea.list(ee());
        if (!W()) return;
        b.value = G.items, k.value = G.next_cursor, H.value = G.total, I.value = !!G.total_is_lower_bound, V.value = G.failed_today ?? 0, A.value = L.value = E.value = "", _.value = !1, f.value = !0;
      } catch (G) {
        if (!W()) return;
        _.value = qe(G);
        const ge = _.value ? "" : ne(G, "Activity could not be loaded.");
        le && f.value && !_.value ? E.value = ge : A.value = ge;
      } finally {
        W() && (p.value = !1);
      }
    }
    async function Z() {
      if (p.value || !k.value || g.value) return;
      const le = z();
      g.value = !0, L.value = "";
      try {
        const W = await ea.list(ee(k.value));
        if (!le()) return;
        const G = new Set(b.value.map((ge) => ge.message_id));
        b.value = [...b.value, ...W.items.filter((ge) => !G.has(ge.message_id))], k.value = W.next_cursor;
      } catch (W) {
        le() && (L.value = ne(W, "More activity could not be loaded."));
      } finally {
        g.value = !1;
      }
    }
    const H = $(), I = $(!1), V = $(0);
    X([v, r, w, T], () => {
      ae();
    }), la(() => ae(f.value)), Ue("mail.activity", () => {
      ae(f.value);
    });
    const x = P(() => {
      const le = H.value ?? b.value.length;
      return I.value ? `${le.toLocaleString()}+ messages` : ye(le, "message");
    }), i = P(() => I.value && !!T.value), R = P(() => V.value ? `${ye(V.value, "message")} failed today.` : "");
    function Q(le) {
      return le ? o.title("message", le) : "—";
    }
    function q(le) {
      u({ name: "activity", message: le.message_id });
    }
    function K() {
      u({ name: "activity", template: r.value || void 0 });
    }
    return (le, W) => (l(), n(J, null, [
      s(Be, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      _.value ? (l(), n("p", hr, [
        s(e(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        W[8] || (W[8] = Y("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(J, { key: 1 }, [
        R.value ? (l(), n("p", kr, [
          s(e(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", $r, [
            t("strong", null, y(R.value), 1),
            Y(" " + y(v.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          v.value !== "failed" ? (l(), M(e(B), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[0] || (W[0] = (G) => v.value = "failed")
          })) : S("", !0)
        ])) : S("", !0),
        t("div", wr, [
          s(e(_e), {
            modelValue: v.value,
            "onUpdate:modelValue": W[1] || (W[1] = (G) => v.value = G),
            options: c,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          s(e(ze), {
            modelValue: r.value,
            "onUpdate:modelValue": W[2] || (W[2] = (G) => r.value = G),
            options: U.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          s(e(ze), {
            modelValue: w.value,
            "onUpdate:modelValue": W[3] || (W[3] = (G) => w.value = G),
            options: h,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          s(e(pa), { class: "mail-search" }, {
            default: j(() => [
              s(e(ga), null, {
                default: j(() => [
                  s(e(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(e(de), {
                modelValue: m.value,
                "onUpdate:modelValue": W[4] || (W[4] = (G) => m.value = G),
                type: "search",
                maxlength: "256",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          f.value ? (l(), n("span", _r, y(x.value), 1)) : S("", !0)
        ]),
        i.value ? (l(), n("p", xr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : S("", !0),
        A.value ? (l(), n("div", Cr, [
          t("span", null, y(A.value), 1),
          s(e(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[5] || (W[5] = (G) => ae())
          })
        ])) : S("", !0),
        E.value ? (l(), n("div", Vr, [
          t("span", null, y(E.value) + " The list shows what was loaded before.", 1),
          s(e(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[6] || (W[6] = (G) => ae(!0))
          })
        ])) : p.value && !f.value ? (l(), n("p", Sr, [
          s(e(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          W[9] || (W[9] = Y("Loading activity…", -1))
        ])) : f.value ? (l(), n(J, { key: 5 }, [
          b.value.length ? (l(), M(e(ya), {
            key: 1,
            value: b.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: W[7] || (W[7] = (G) => q(G.data))
          }, {
            default: j(() => [
              s(e(ue), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: j(({ data: G }) => [
                  s(e(Ne), {
                    severity: e(Fa)[G.status],
                    value: e(Ha)[G.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              s(e(ue), { header: "Message" }, {
                body: j(({ data: G }) => [
                  s(e(B), {
                    link: "",
                    class: "mail-name",
                    label: G.subject,
                    onClick: Te((ge) => q(G), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", Ur, y(e(Sl)(G.to)), 1)
                ]),
                _: 1
              }),
              s(e(ue), { header: "Template" }, {
                body: j(({ data: G }) => [
                  Q(G.template) === void 0 ? (l(), M(e(Re), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(J, { key: 1 }, [
                    Y(y(Q(G.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              s(e(ue), { header: "Sent by" }, {
                body: j(({ data: G }) => [
                  t("span", null, y(e(we)(G.sender_label, G.sender)), 1),
                  G.origin ? (l(), n("span", Rr, y(e(ta)(G.origin)), 1)) : S("", !0)
                ]),
                _: 1
              }),
              s(e(ue), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: j(({ data: G }) => [
                  t("span", jr, y(e(Tl)(G.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Tr, y(T.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          k.value ? (l(), n("div", Ar, [
            L.value ? (l(), n("span", Lr, y(L.value), 1)) : S("", !0),
            s(e(B), {
              label: L.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: g.value,
              disabled: p.value,
              onClick: Z
            }, null, 8, ["label", "loading", "disabled"])
          ])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      s(gr, {
        "message-id": a.message,
        onClose: K
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Nr = { class: "kx-shell kx-settings-shell mail-admin" }, zr = { class: "kx-main" }, Er = /* @__PURE__ */ te({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(a, { emit: d }) {
    const o = a, u = d, v = pe(Ia(o.route ?? "")), r = P(() => v.value), w = $(!1);
    X(w, (i) => u("dirty-change", i), { flush: "sync" });
    let m = !1;
    async function T() {
      if (!w.value) return !0;
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
    function C(i, R) {
      return i.name === "resource" && R.name === "resource" && i.kind === R.kind && i.resource === R.resource;
    }
    async function c(i) {
      const R = Le(i);
      !C(r.value, i) && !await T() || (C(r.value, i) || (w.value = !1), v.value = i, o.route !== void 0 && R !== o.route && u("navigate", R));
    }
    X(() => o.route, async (i, R) => {
      if (i === void 0) return;
      const Q = Ia(i);
      if (Le(Q) !== Le(v.value)) {
        if (!C(v.value, Q) && w.value) {
          if (!await T()) {
            R !== void 0 && o.route === i && u("navigate", Le(v.value));
            return;
          }
          w.value = !1;
        }
        o.route === i && (v.value = Q);
      }
    });
    const h = lt(), U = hl();
    X(U, (i, R) => {
      R === !1 && i === !0 && h.refresh();
    });
    const b = $(), k = $();
    async function p() {
      try {
        b.value = await Ul.capabilities();
      } catch {
        b.value = void 0;
      }
      if (b.value?.administer_delivery)
        try {
          k.value = await Rl.status();
        } catch {
          k.value = void 0;
        }
    }
    p();
    const f = $(!1), g = $(!1), _ = $({});
    function A(i) {
      _.value = i, f.value = !0;
    }
    gl(Ka, {
      library: h,
      capabilities: b,
      delivery: k,
      go: (i) => {
        c(i);
      },
      create: A,
      upload: () => {
        g.value = !0;
      },
      setDirty: (i) => {
        w.value = i;
      },
      setTitle: (i) => {
        Z.value = i;
      }
    });
    const L = {
      content: (i) => i === "message" ? "Message" : i === "base" ? "Layout" : "Content",
      variables: (i) => i === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, E = {
      content: (i) => be[i],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, z = P(() => !!b.value?.administer_delivery), ee = P(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: be.message },
        { value: "bases", label: "Base templates", icon: be.base },
        { value: "parts", label: "Parts", icon: be.part },
        { value: "assets", label: "Images", icon: be.asset }
      ] },
      ...z.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ae = { value: "all", label: "All resources", icon: "tabler:table" }, Z = $("");
    X(() => Le(r.value), () => {
      Z.value = "";
    });
    const H = P(() => {
      const i = r.value;
      if (i.name === "resource")
        return {
          leading: { value: "all", label: "All " + fa[i.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: Z.value || " ", items: Ga(i.kind).map((R) => ({
            value: R,
            label: L[R](i.kind),
            icon: E[R](i.kind)
          })) }]
        };
    }), I = P(() => {
      const i = r.value;
      return i.name === "resource" ? i.section : i.name === "activity" ? "activity" : i.section;
    });
    function V(i) {
      const R = r.value;
      if (R.name === "resource") {
        c(i === "all" ? { name: "library", section: ca(R.kind) } : { ...R, section: i });
        return;
      }
      c(i === "activity" ? { name: "activity" } : { name: "library", section: i });
    }
    const x = $();
    return X(() => Le(r.value), () => {
      x.value?.scrollTo({ top: 0 });
    }), (i, R) => (l(), n("main", Nr, [
      s(at, {
        label: "Mail sections",
        title: "Mail",
        value: I.value,
        groups: H.value ? H.value.groups : ee.value,
        "leading-item": H.value ? H.value.leading : ae,
        "onUpdate:value": V
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", zr, [
        t("div", {
          ref_key: "main",
          ref: x,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), M(wn, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), n(J, { key: 1 }, [
            z.value ? (l(), M(Ir, {
              key: 0,
              message: r.value.message,
              template: r.value.template
            }, null, 8, ["message", "template"])) : b.value ? (l(), n(J, { key: 1 }, [
              s(Be, {
                title: "Activity",
                description: ""
              }),
              R[2] || (R[2] = t("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : S("", !0)
          ], 64)) : r.value.section === "assets" ? (l(), M(Ro, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), M(Yt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      s(Ko, {
        visible: f.value,
        intent: _.value,
        onClose: R[0] || (R[0] = (Q) => f.value = !1)
      }, null, 8, ["visible", "intent"]),
      s(al, {
        visible: g.value,
        onClose: R[1] || (R[1] = (Q) => g.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Or = /* @__PURE__ */ te({
  __name: "MailAdminRoot",
  setup(a) {
    const d = kl(), o = $l();
    return (u, v) => (l(), M(Er, {
      route: e(d).route,
      onNavigate: v[0] || (v[0] = (r) => e(o)("navigate", { route: r })),
      onDirtyChange: v[1] || (v[1] = (r) => e(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), Mr = jl(Or, { type: "object", properties: { route: { type: "string", default: "" } } });
Il(import.meta.url, Mr);
//# sourceMappingURL=admin.js.map
