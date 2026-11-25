import { defineComponent as te, useId as ve, openBlock as l, createElementBlock as n, unref as a, normalizeClass as re, createElementVNode as s, createTextVNode as Y, toDisplayString as y, createCommentVNode as S, renderSlot as Ne, computed as M, createBlock as O, resolveDynamicComponent as dl, normalizeProps as cl, guardReactiveProps as vl, createSlots as ma, withCtx as A, Fragment as F, renderList as ce, inject as ml, ref as $, shallowRef as pe, onMounted as fl, onBeforeUnmount as aa, createVNode as t, watch as X, nextTick as Me, reactive as bl, withModifiers as Re, useModel as za, mergeModels as ra, defineAsyncComponent as ua, withDirectives as yl, vShow as pl, provide as gl } from "vue";
import { u as la, a as hl, b as kl, c as $l } from "./wc-runtime-Ch_wJl3O.js";
import "pinia";
import { u as Ue, l as se, d as ne, k as me, b as Pe, A as wl, e as $e, p as ye, w as Da, a as we, _ as qe, c as fa, f as be, s as Oa, i as He, g as Ve, h as ba, j as Fe, m as Ma, o as ta, n as _l, q as Xe, r as Pa, t as Ba, v as qa, x as xl, y as Cl, z as Ha, B as Fa, C as ea, D as Vl, E as Sl, F as Tl, G as Rl, H as Ul } from "./latestRequest-BxeovKA8.js";
import { host as Ce, api as Al, on as jl, define as Ll } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import Ae from "primevue/skeleton";
import B from "primevue/button";
import ue from "primevue/column";
import ya from "primevue/datatable";
import pa from "primevue/iconfield";
import ga from "primevue/inputicon";
import de from "primevue/inputtext";
import _e from "primevue/selectbutton";
import je from "primevue/dialog";
import Il from "primevue/progressbar";
import Te from "primevue/tag";
import Ee from "primevue/select";
import Nl from "primevue/accordion";
import El from "primevue/accordioncontent";
import zl from "primevue/accordionheader";
import Dl from "primevue/accordionpanel";
import Ol from "primevue/menu";
import Ml from "primevue/checkbox";
import Pl from "primevue/inputnumber";
import da from "primevue/textarea";
import Ja from "primevue/drawer";
import Bl from "primevue/fileupload";
const ql = ["aria-labelledby"], Hl = { class: "kx-railhead" }, Fl = ["id"], Jl = { key: 0 }, Kl = { class: "kx-railhead-acts" }, Wl = { class: "kx-rail-body" }, Yl = /* @__PURE__ */ te({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const d = ve();
    return (o, u) => (l(), n("aside", {
      class: re(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(d)
    }, [
      s("div", Hl, [
        s("span", {
          id: a(d),
          class: "kx-railhead-title"
        }, [
          Y(y(e.title), 1),
          e.count !== void 0 ? (l(), n("b", Jl, y(e.count), 1)) : S("", !0)
        ], 8, Fl),
        s("div", Kl, [
          Ne(o.$slots, "actions")
        ])
      ]),
      Ne(o.$slots, "toolbar"),
      s("div", Wl, [
        Ne(o.$slots, "default")
      ])
    ], 10, ql));
  }
}), Gl = ["aria-label"], Zl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ql = ["aria-current", "onClick"], Xl = { class: "kx-settings-rail-label" }, et = /* @__PURE__ */ te({
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
    const d = e, o = M(() => d.leadingItem ? [{ items: [d.leadingItem] }, ...d.groups] : d.groups);
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
    return (v, r) => (l(), O(dl(e.title ? Yl : "div"), cl(vl(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), ma({
      default: A(() => [
        s("nav", {
          class: re(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: u
        }, [
          (l(!0), n(F, null, ce(o.value, (w, m) => (l(), n("div", {
            key: w.items[0]?.value ?? m,
            class: re(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            w.heading ? (l(), n("div", Zl, y(w.heading), 1)) : S("", !0),
            (l(!0), n(F, null, ce(w.items, (T) => (l(), n("button", {
              key: T.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": T.value === e.value ? "true" : void 0,
              onClick: (C) => v.$emit("update:value", T.value)
            }, [
              T.icon ? (l(), O(a(N), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: T.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", Xl, y(T.label), 1)
            ], 8, Ql))), 128))
          ], 2))), 128))
        ], 42, Gl)
      ]),
      _: 2
    }, [
      e.title && v.$slots.actions ? {
        name: "actions",
        fn: A(() => [
          Ne(v.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ka = Symbol("mail-admin");
function fe() {
  const e = ml(Ka);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function Wa(e) {
  const { kind: d, name: o, title: u, description: v, state: r, revision: w, origin: m, origin_label: T, base: C, author: c, author_label: h, updated_at: R, used_by: b } = e, k = b && {
    messages: b.messages?.length,
    recent_sources: b.recent_senders?.length
  };
  return { kind: d, name: o, title: u, description: v, state: r, revision: w, origin: m, origin_label: T, base: C, author: c, author_label: h, updated_at: R, used_by: k };
}
function at() {
  const e = Object.fromEntries(["message", "base", "part", "asset"].map((b) => [b, { rows: pe([]), loaded: $(!1), loading: $(!1), error: $(""), users: 0, stale: !1 }])), d = /* @__PURE__ */ new Map();
  let o = 0;
  function u(b) {
    const k = d.get(b);
    if (k) return k;
    const p = e[b];
    p.loading.value = !0;
    const f = o, g = (async () => {
      try {
        const _ = [];
        let j;
        do {
          const L = await se.page({ kind: b, cursor: j });
          _.push(...L.items), j = L.next_cursor;
        } while (j);
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
    const k = e[b];
    (!k.loaded.value || k.stale) && !k.loading.value && u(b);
  }
  function r(...b) {
    fl(() => {
      for (const k of b)
        e[k].users++, v(k);
    }), aa(() => {
      for (const k of b) e[k].users--;
    });
  }
  function w(b, k, p) {
    const f = e[b];
    if (!f.loaded.value) return;
    const g = f.rows.value.filter((_) => _.name !== k);
    p && g.push(p), f.rows.value = g;
  }
  function m() {
    o++;
    for (const [b, k] of Object.entries(e))
      k.stale = k.loaded.value, k.users > 0 && v(b);
  }
  Ue("mail.library", m);
  const T = (b, k) => e[b].rows.value.find((p) => p.name === k);
  function C(b, k) {
    const p = T(b, k);
    return p ? p.title : (v(b), e[b].loaded.value ? k : void 0);
  }
  return { kinds: e, use: r, ensure: v, load: u, find: T, title: C, ofKind: (b) => [...e[b].rows.value].sort((k, p) => k.title.localeCompare(p.title)), ready: (b) => e[b].loaded.value, failed: (b) => e[b].error.value, refresh: m, patch: w };
}
const lt = { class: "kx-empty" }, tt = { class: "kx-empty-ico" }, st = { class: "kx-empty-title" }, it = {
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
  setup(e) {
    return (d, o) => (l(), n("div", lt, [
      s("div", tt, [
        t(a(N), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      s("div", st, y(e.title), 1),
      e.hint || d.$slots.hint ? (l(), n("p", it, [
        Ne(d.$slots, "hint", {}, () => [
          Y(y(e.hint), 1)
        ])
      ])) : S("", !0),
      e.cta ? (l(), O(a(B), {
        key: 1,
        label: e.cta,
        onClick: o[0] || (o[0] = (u) => d.$emit("cta"))
      }, ma({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: A(({ class: u }) => [
            t(a(N), {
              icon: e.ctaIcon,
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
}, Ya = Object.fromEntries(Object.entries(ka).map(([e, d]) => [d, e])), nt = ["content", "variables", "used-by", "history"];
function ca(e) {
  return ka[e];
}
function ot(e) {
  return Ya[e];
}
function Ga(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : nt;
}
function Ie(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${ka[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Ia(e) {
  const d = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [o, u, v] = d;
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
const rt = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", oa = `<meta http-equiv="Content-Security-Policy" content="${rt}">`;
function $a(e, d) {
  let o = e;
  for (const [r, w] of Object.entries(d ?? {}))
    o = o.split("cid:" + r).join(w);
  const u = /<head(\s[^>]*)?>/i.exec(o);
  if (u) return o.slice(0, u.index + u[0].length) + oa + o.slice(u.index + u[0].length);
  const v = /<html(\s[^>]*)?>/i.exec(o);
  return v ? o.slice(0, v.index + v[0].length) + "<head>" + oa + "</head>" + o.slice(v.index + v[0].length) : oa + o;
}
function ut() {
  let e = document.activeElement;
  for (; e?.shadowRoot?.activeElement; ) e = e.shadowRoot.activeElement;
  return e instanceof HTMLElement ? e : null;
}
function xe(e) {
  let d = null;
  X(e, (o) => {
    if (o) {
      d = ut();
      return;
    }
    const u = d;
    d = null, Me(() => {
      u?.isConnected && u.focus();
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
}, va = /* @__PURE__ */ te({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const d = e, { library: o, go: u } = fe(), v = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, r = (c) => o.title(c.kind, c.name), w = (c) => !!c && !!d.draft && c.kind === d.draft.kind && c.name === d.draft.name, m = M(() => {
      const { resource: c, face: h, previewOf: R } = d.problem, b = h ? v[h] : "";
      if (c && d.draft && d.draft.kind !== "message" && c.kind === "message" && c.name === R)
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
    }), T = M(() => d.problem.candidates ?? []);
    function C(c) {
      c.kind === "asset" ? u({ name: "library", section: "assets", asset: c.name }) : u({ name: "resource", kind: c.kind, resource: c.name, section: "content" });
    }
    return (c, h) => (l(), n("div", dt, [
      s("p", ct, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, y(m.value), 1)
      ]),
      e.problem.tooLarge ? S("", !0) : (l(), n("code", vt, y(e.problem.engine ?? e.problem.message), 1)),
      T.value.length ? (l(), n("p", mt, [
        h[0] || (h[0] = s("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(F, null, ce(T.value, (R) => (l(), n(F, {
          key: R.kind + R.name
        }, [
          w(R) ? (l(), n("span", ft, "This " + y(a(me)[R.kind].toLowerCase()), 1)) : r(R) === void 0 ? (l(), O(a(Ae), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), O(a(B), {
            key: 2,
            link: "",
            size: "small",
            label: r(R),
            class: "mail-inline-link",
            onClick: (b) => C(R)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : S("", !0)
    ]));
  }
}), Na = ["html", "text", "subject", "variables", "samples"];
function De(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function Be(e) {
  if (!(e instanceof wl)) return;
  const d = e.details ?? {}, o = $e(e);
  if (o === "mail_resource_in_use") {
    const C = Array.isArray(d.messages) ? d.messages.filter((h) => typeof h == "string") : [], c = d.dependent;
    return {
      message: e.message,
      dependents: C,
      references: Array.isArray(d.resources) ? d.resources.filter(De) : void 0,
      face: Na.find((h) => h === c?.face),
      resource: De(c?.resource) ? c.resource : void 0
    };
  }
  const u = Na.find((C) => C === d.face) ?? (o === "invalid_template_vars" ? "samples" : void 0);
  if (!u) return;
  const v = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((C) => typeof C == "string") : [], r = Array.isArray(d.errors) ? d.errors.flatMap((C) => {
    const c = C;
    return De(c.resource) && typeof c.message == "string" ? [{ name: c.resource.name, message: c.message }] : [];
  }) : [], w = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(De) : [], m = typeof d.engine_message == "string" ? d.engine_message : void 0, T = (o === "html_too_large" || o === "text_too_large") && typeof d.maximum == "number" ? d.maximum : void 0;
  return {
    message: e.message,
    engine: m,
    tooLarge: T,
    face: u,
    resource: De(d.resource) ? d.resource : void 0,
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
}, Rt = ["srcdoc", "title"], Ut = {
  key: 3,
  class: "mail-more"
}, At = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, jt = 3, Lt = /* @__PURE__ */ te({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, u = d, { go: v } = fe();
    xe(() => o.visible);
    const r = $([]), w = $(), m = $(), T = $(!1), C = $("");
    let c = 0, h = [], R = 0, b;
    async function k(V, x) {
      V.state = "loading";
      try {
        const i = await se.preview(V.name, []);
        if (x !== c) return;
        V.subject = i.subject, V.warning = i.warnings?.length ? i.warnings.map(Da).join(" ") : void 0, V.document = i.html ? $a(i.html, i.inline_assets) : "", V.state = "ready";
      } catch (i) {
        if (x !== c) return;
        V.problem = Be(i), V.failure = V.problem ? "" : ne(i, "This message could not be rendered."), V.state = "failed";
      }
    }
    function p(V) {
      for (; V === c && R < jt && h.length; ) {
        const x = h.shift();
        x.state === "waiting" && (R++, k(x, V).finally(() => {
          R--, p(V);
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
          const i = r.value.find((U) => U.name === x.target.dataset.name);
          i && f(i);
        }
      }, { root: g.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const V of g.value.querySelectorAll("[data-name]")) b.observe(V);
    }
    async function j(V) {
      T.value = !0, C.value = "";
      try {
        const x = await se.page({ kind: "message", cursor: w.value });
        if (V !== c) return;
        r.value = [...r.value, ...x.items.map((i) => bl({ name: i.name, title: i.title, state: "waiting" }))], w.value = x.next_cursor, m.value = x.total, await Me(), _();
      } catch (x) {
        V === c && (C.value = ne(x, "The messages could not be listed."));
      } finally {
        V === c && (T.value = !1);
      }
    }
    function L() {
      c++, h = [], b?.disconnect(), b = void 0;
    }
    function z() {
      L(), r.value = [], w.value = m.value = void 0, j(c);
    }
    function E() {
      const V = ++c;
      h = [];
      for (const x of r.value) Object.assign(x, { state: "waiting", subject: void 0, document: void 0, warning: void 0, problem: void 0, failure: void 0 });
      Me(() => {
        V === c && _();
      });
    }
    X(() => o.visible, (V) => {
      V ? z() : L();
    }), aa(L);
    const ee = M(() => r.value.filter((V) => V.state === "ready" || V.state === "failed").length), ae = M(() => r.value.filter((V) => V.state === "failed").length), Z = M(() => {
      if (!r.value.length) return "";
      const V = `${ee.value} of ${ye(m.value ?? r.value.length, "message")} rendered`;
      return ae.value ? `${V}, ${ae.value} with a problem.` : V + ".";
    });
    function H(V) {
      u("close"), v({ name: "resource", kind: "message", resource: V, section: "content" });
    }
    const I = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (V, x) => (l(), O(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: I,
      "aria-label": "Preview all messages",
      "onUpdate:visible": x[1] || (x[1] = (i) => {
        i || u("close");
      })
    }, {
      header: A(() => [
        s("span", yt, [
          t(a(N), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        x[2] || (x[2] = s("span", { class: "kx-modal-head-text" }, [
          s("span", { class: "kx-modal-head-title" }, "All messages"),
          s("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !r.value.length,
          onClick: E
        }, {
          icon: A(() => [
            t(a(N), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: A(() => [
        r.value.length ? (l(), n("div", pt, [
          s("span", null, y(Z.value), 1),
          t(a(Il), {
            value: Math.round(ee.value / (m.value ?? r.value.length) * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : S("", !0),
        T.value && !r.value.length ? (l(), n("p", gt, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          x[3] || (x[3] = Y("Listing messages…", -1))
        ])) : !T.value && !C.value && !r.value.length ? (l(), n("p", ht, "There are no messages yet.")) : S("", !0),
        s("ul", {
          ref_key: "list",
          ref: g,
          class: "mail-gallery"
        }, [
          (l(!0), n(F, null, ce(r.value, (i) => (l(), n("li", {
            key: i.name,
            "data-name": i.name,
            class: re(["mail-gallery-tile", { "mail-gallery-failed": i.state === "failed" }])
          }, [
            t(a(B), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + i.title,
              onClick: (U) => H(i.name)
            }, {
              default: A(() => [
                s("span", $t, y(i.title), 1),
                s("span", wt, y(i.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            i.warning ? (l(), n("p", _t, [
              t(a(N), {
                icon: "tabler:scissors",
                "aria-hidden": "true"
              }),
              Y(y(i.warning), 1)
            ])) : S("", !0),
            s("div", xt, [
              i.state === "waiting" ? (l(), n("p", Ct, "Renders when shown.")) : i.state === "loading" ? (l(), n("p", Vt, [
                t(a(N), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                x[4] || (x[4] = Y("Rendering…", -1))
              ])) : i.state === "failed" ? (l(), n("div", St, [
                i.problem ? (l(), O(va, {
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
              }, null, 8, Rt))
            ])
          ], 10, kt))), 128))
        ], 512),
        w.value || C.value ? (l(), n("div", Ut, [
          C.value ? (l(), n("span", At, y(C.value), 1)) : S("", !0),
          t(a(B), {
            label: C.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: T.value,
            onClick: x[0] || (x[0] = (i) => j(a(c)))
          }, null, 8, ["label", "loading"])
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), It = { class: "mail-source" }, Nt = { key: 0 }, Et = { key: 1 }, wa = /* @__PURE__ */ te({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (d, o) => (l(), n("span", It, [
      e.resource.state === "created" ? (l(), n("span", Nt, y((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(we)(e.resource.author_label, e.resource.author)), 1)) : (l(), n("span", Et, "Included with " + y(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), O(a(Te), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : S("", !0)
    ]));
  }
}), zt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Dt = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, Ot = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Mt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Pt = { class: "mail-toolbar" }, Bt = {
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
  setup(e) {
    const d = e, { library: o, go: u, create: v } = fe(), r = M(() => ot(d.section));
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
    const c = pe([]), h = $(), R = $(), b = $(!0), k = $(!1), p = $(!1), f = $(!1), g = $(""), _ = $(""), j = $(""), L = Ve(), z = () => ({ kind: r.value, state: w.value === "all" ? void 0 : w.value, q: T.value || void 0 });
    async function E(Q = !1) {
      const q = L();
      b.value = !0;
      try {
        const K = await se.page(z());
        if (!q()) return;
        c.value = K.items, h.value = K.next_cursor, R.value = K.total, g.value = _.value = j.value = "", f.value = !1, k.value = !0;
      } catch (K) {
        if (!q()) return;
        f.value = He(K);
        const le = f.value ? "" : ne(K, "The mail library could not be loaded.");
        Q && k.value && !f.value ? j.value = le : g.value = le;
      } finally {
        q() && (b.value = !1);
      }
    }
    async function ee() {
      if (b.value || !h.value || p.value) return;
      const Q = L();
      p.value = !0, _.value = "";
      try {
        const q = await se.page({ ...z(), cursor: h.value });
        if (!Q()) return;
        c.value = [...c.value, ...q.items], h.value = q.next_cursor, R.value = q.total;
      } catch (q) {
        Q() && (_.value = ne(q, "More resources could not be loaded."));
      } finally {
        p.value = !1;
      }
    }
    X([r, w, T], () => {
      E();
    }), la(() => E(k.value)), Ue("mail.library", () => {
      r.value === "message" && o.ensure("base"), E(k.value);
    });
    const ae = M(() => {
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
    ], H = M(() => {
      const Q = r.value ? me[r.value].toLowerCase() : "resource", q = R.value ?? c.value.length;
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
    const i = M(() => k.value && !g.value && r.value && !c.value.length && w.value === "all" && !T.value), U = $(!1);
    return (Q, q) => (l(), n(F, null, [
      t(qe, {
        title: ae.value.title,
        description: ae.value.description
      }, {
        actions: A(() => [
          !r.value || r.value === "message" ? (l(), O(a(B), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: q[0] || (q[0] = (K) => U.value = !0)
          }, {
            icon: A(() => [
              t(a(N), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          t(a(B), {
            label: r.value ? "New " + a(me)[r.value].toLowerCase() : "New",
            onClick: q[1] || (q[1] = (K) => a(v)({ kind: r.value }))
          }, {
            icon: A(() => [
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
      f.value ? (l(), n("p", zt, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        q[9] || (q[9] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : g.value ? (l(), n("div", Dt, [
        s("span", null, y(g.value), 1),
        t(a(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[2] || (q[2] = (K) => E())
        })
      ])) : S("", !0),
      j.value ? (l(), n("div", Ot, [
        s("span", null, y(j.value) + " The list shows what was loaded before.", 1),
        t(a(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[3] || (q[3] = (K) => E(!0))
        })
      ])) : b.value && !k.value ? (l(), n("p", Mt, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        q[10] || (q[10] = Y("Loading mail library…", -1))
      ])) : i.value && r.value ? (l(), O(ha, {
        key: 4,
        icon: a(be)[r.value],
        title: "No " + a(fa)[r.value].toLowerCase() + " yet",
        hint: "Create a " + a(me)[r.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(me)[r.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: q[4] || (q[4] = (K) => a(v)({ kind: r.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : k.value ? (l(), n(F, { key: 5 }, [
        s("div", Pt, [
          t(a(_e), {
            modelValue: w.value,
            "onUpdate:modelValue": q[5] || (q[5] = (K) => w.value = K),
            options: Z,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          t(a(pa), { class: "mail-search" }, {
            default: A(() => [
              t(a(ga), null, {
                default: A(() => [
                  t(a(N), {
                    icon: b.value ? "tabler:loader-2" : "tabler:search",
                    class: re({ spin: b.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              t(a(de), {
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
          s("span", Bt, y(H.value), 1)
        ]),
        c.value.length ? (l(), O(a(ya), {
          key: 1,
          value: c.value,
          "data-key": (K) => K.kind + "/" + K.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": ae.value.title } },
          onRowClick: q[7] || (q[7] = (K) => x(K.data))
        }, {
          default: A(() => [
            t(a(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: K }) => [
                t(a(B), {
                  link: "",
                  class: "mail-name",
                  label: K.title,
                  onClick: Re((le) => x(K), ["stop"])
                }, null, 8, ["label", "onClick"]),
                K.description ? (l(), n("span", Ht, y(K.description), 1)) : S("", !0)
              ]),
              _: 1
            }),
            r.value ? S("", !0) : (l(), O(a(ue), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: A(({ data: K }) => [
                s("span", Ft, [
                  t(a(N), {
                    icon: a(be)[K.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  Y(y(a(me)[K.kind]), 1)
                ])
              ]),
              _: 1
            })),
            r.value === "message" ? (l(), O(a(ue), {
              key: 1,
              header: "Base template"
            }, {
              body: A(({ data: K }) => [
                V(K) === void 0 ? (l(), O(a(Ae), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(F, { key: 1 }, [
                  Y(y(V(K)), 1)
                ], 64))
              ]),
              _: 1
            })) : S("", !0),
            t(a(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: K }) => [
                t(wa, { resource: K }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            r.value !== "part" ? (l(), O(a(ue), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: K }) => [
                Y(y(I(K)), 1)
              ]),
              _: 1
            })) : S("", !0),
            t(a(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: K }) => [
                s("span", Jt, y(K.state === "original" ? "—" : a(Oa)(K.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", qt, "Nothing matches. Try another name or a word from the template.")),
        h.value ? (l(), n("div", Kt, [
          _.value ? (l(), n("span", Wt, y(_.value), 1)) : S("", !0),
          t(a(B), {
            label: _.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: p.value,
            disabled: b.value,
            onClick: ee
          }, null, 8, ["label", "loading", "disabled"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      t(Lt, {
        visible: U.value,
        onClose: q[8] || (q[8] = (K) => U.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
}), Gt = /* @__PURE__ */ te({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (d, o) => (l(), n(F, null, [
      t(a(Te), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      t(a(B), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: o[0] || (o[0] = (u) => d.$emit("discard"))
      }, {
        icon: A(() => [
          t(a(N), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      t(a(B), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: o[1] || (o[1] = (u) => d.$emit("review", u.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
});
function Zt(e) {
  return JSON.parse(JSON.stringify(e));
}
function ke(e) {
  const d = Zt(e);
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
function Qt(e, d) {
  return JSON.stringify(ke(e)) === JSON.stringify(ke(d));
}
function Xt(e, d, o, u, v) {
  const r = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
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
  } : e === "base" ? {
    kind: e,
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
  } : { kind: e, name: d, title: o, description: u, schema: r, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function es(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function as(e) {
  const d = [], o = e.samples;
  for (const [u, v] of Object.entries(e.schema.properties)) {
    const r = es(o[u] ?? v.default ?? (v.type === "string" ? "" : null));
    r !== void 0 && d.push(`${JSON.stringify(u)}, ${r}`);
  }
  return d.length ? `{{ include "/part/${e.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function Za(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function ls(e, d, o) {
  return `<img src="${Za(e)}" alt="${d.replace(/"/g, "&quot;")}" style="display:block;border:0;max-width:100%;height:auto;">`;
}
const ts = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function ss(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !ts.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const is = "{{ block body() }}{{ end }}", ns = {
  class: "mail-preview",
  "aria-label": "Preview"
}, os = { class: "mail-preview-bar" }, rs = {
  key: 0,
  class: "mail-preview-with"
}, us = ["for"], ds = {
  key: 0,
  class: "mail-field-hint"
}, cs = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, vs = {
  key: 2,
  class: "mail-preview-envelope"
}, ms = ["aria-busy"], fs = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, bs = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, ys = ["srcdoc", "title"], ps = {
  key: 1,
  class: "mail-preview-text"
}, gs = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, hs = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, ks = {
  key: 5,
  class: "mail-preview-foot"
}, $s = /* @__PURE__ */ te({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: d }) {
    const o = e, u = d, { library: v, delivery: r } = fe();
    o.draft.kind !== "message" && v.use("message");
    const w = { message: ve() }, m = $("email"), T = $("desktop"), C = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], c = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], h = M(() => v.ready("message") ? (o.messages ?? v.ofKind("message").map((V) => V.name)).map((V) => ({ value: V, label: v.title("message", V) ?? V })).sort((V, x) => V.label.localeCompare(x.label)) : []), R = $("");
    X(h, (I) => {
      o.draft.kind !== "message" && (I.some((V) => V.value === R.value) || (R.value = I[0]?.value ?? ""));
    }, { immediate: !0 });
    const b = M(() => o.draft.kind !== "message" && R.value && R.value === h.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), k = M(() => o.draft.kind === "message" ? o.draft.name : R.value), p = pe(), f = $(!1), g = $(), _ = $(""), j = Ve();
    let L, z = !1, E = !1;
    async function ee() {
      const I = k.value;
      if (!I) return;
      if (z) {
        E = !0;
        return;
      }
      z = !0;
      const V = j();
      f.value = !0;
      try {
        const x = await se.preview(I, [o.draft]);
        if (!V()) return;
        p.value = x, g.value = void 0, _.value = "";
      } catch (x) {
        if (!V()) return;
        const i = Be(x);
        g.value = i ? { ...i, previewOf: I } : void 0, _.value = g.value ? "" : ne(x, "The preview could not be rendered.");
      } finally {
        z = !1, V() && (f.value = !1), E && (E = !1, ee());
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
    const Z = M(() => p.value?.html ? $a(p.value.html, p.value.inline_assets) : ""), H = M(() => {
      const I = r.value?.from;
      return I ? I.name ? `${I.name} <${I.address}>` : I.address : "";
    });
    return (I, V) => (l(), n("section", ns, [
      s("div", os, [
        t(a(_e), {
          modelValue: m.value,
          "onUpdate:modelValue": V[0] || (V[0] = (x) => m.value = x),
          options: C,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        m.value === "email" ? (l(), O(a(_e), {
          key: 0,
          modelValue: T.value,
          "onUpdate:modelValue": V[1] || (V[1] = (x) => T.value = x),
          options: c,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: A(({ option: x }) => [
            t(a(N), {
              icon: x.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            Y(y(x.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : S("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), n("div", rs, [
        s("label", {
          for: w.message
        }, "Preview with", 8, us),
        t(a(Ee), {
          modelValue: R.value,
          "onUpdate:modelValue": V[2] || (V[2] = (x) => R.value = x),
          "input-id": w.message,
          options: h.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !a(v).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        b.value ? (l(), n("small", ds, y(b.value), 1)) : S("", !0)
      ])) : S("", !0),
      f.value && p.value ? (l(), n("p", cs, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        V[3] || (V[3] = Y("Updating the preview…", -1))
      ])) : S("", !0),
      p.value ? (l(), n("dl", vs, [
        H.value ? (l(), n(F, { key: 0 }, [
          V[4] || (V[4] = s("dt", null, "From", -1)),
          s("dd", null, y(H.value), 1)
        ], 64)) : S("", !0),
        V[5] || (V[5] = s("dt", null, "Subject", -1)),
        s("dd", null, y(p.value.subject), 1)
      ])) : S("", !0),
      s("div", {
        class: re(["mail-preview-body", ["mail-preview-" + T.value, { "mail-preview-stale": g.value || _.value }]]),
        "aria-busy": f.value
      }, [
        !p.value && f.value ? (l(), n("p", fs, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          V[6] || (V[6] = Y("Rendering preview…", -1))
        ])) : k.value ? p.value ? (l(), n(F, { key: 2 }, [
          m.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: Z.value,
            title: "Email preview: " + (p.value.subject ?? "")
          }, null, 8, ys)) : (l(), n("pre", ps, y(p.value.text), 1))
        ], 64)) : S("", !0) : (l(), n("p", bs, "Choose a message to see this " + y(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, ms),
      (l(!0), n(F, null, ce(p.value?.warnings ?? [], (x) => (l(), n("p", {
        key: x.code,
        class: "mail-preview-foot mail-preview-warning",
        role: "status"
      }, [
        t(a(N), {
          icon: "tabler:scissors",
          "aria-hidden": "true"
        }),
        s("span", null, y(a(Da)(x)), 1)
      ]))), 128)),
      g.value ? (l(), n("p", gs, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, y(p.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : _.value ? (l(), n("p", hs, [
        t(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        s("span", null, y(_.value), 1)
      ])) : (l(), n("p", ks, [
        t(a(N), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        Y(" " + y(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), ws = { class: "kx-modal-head-icon" }, _s = { class: "kx-modal-head-text" }, xs = { class: "kx-modal-head-sub" }, Cs = { class: "mail-change-list" }, Vs = { class: "mail-muted" }, Ss = { class: "mail-field" }, Ts = ["for"], Rs = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Us = { class: "mail-failure-body" }, As = { class: "mail-dependents" }, js = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Ls = /* @__PURE__ */ te({
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
    const o = e, u = d, { library: v, go: r } = fe(), w = $(""), m = ve();
    X(() => o.visible, (h) => {
      h && (w.value = o.suggestedNote ?? "");
    }), xe(() => o.visible);
    const T = M(() => {
      const h = o.saved, R = o.draft, b = [];
      return (h.title !== R.title || h.description !== R.description) && b.push("Name and description"), h.base !== R.base && b.push(`Base template: ${v.title("base", R.base ?? "") ?? R.base}`), h.subject !== R.subject && b.push("Subject"), h.html !== R.html && b.push("HTML"), h.text !== R.text && b.push("Plain text"), (JSON.stringify(h.schema.properties) !== JSON.stringify(R.schema.properties) || JSON.stringify(h.schema.required ?? []) !== JSON.stringify(R.schema.required ?? [])) && b.push(R.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(h.samples) !== JSON.stringify(R.samples) && b.push("Sample values"), b;
    }), C = M(() => o.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${me[o.draft.kind].toLowerCase()} changes when you save.`), c = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (h, R) => (l(), O(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: c,
      "aria-label": "Review changes",
      "onUpdate:visible": R[3] || (R[3] = (b) => {
        b || u("close");
      })
    }, {
      header: A(() => [
        s("span", ws, [
          t(a(N), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        s("span", _s, [
          R[4] || (R[4] = s("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          s("span", xs, y(e.draft.title), 1)
        ])
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: R[2] || (R[2] = (b) => u("close"))
        }, null, 8, ["disabled"]),
        t(a(B), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: A(() => [
        s("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: R[1] || (R[1] = Re((b) => u("save", w.value.trim()), ["prevent"]))
        }, [
          s("div", null, [
            R[5] || (R[5] = s("p", { class: "mail-field-label" }, "Changed", -1)),
            s("ul", Cs, [
              (l(!0), n(F, null, ce(T.value, (b) => (l(), n("li", { key: b }, y(b), 1))), 128))
            ])
          ]),
          s("p", Vs, y(C.value) + " The previous version stays in History.", 1),
          s("div", Ss, [
            s("label", {
              class: "mail-field-label",
              for: a(m)
            }, "Note for History", 8, Ts),
            t(a(de), {
              id: a(m),
              modelValue: w.value,
              "onUpdate:modelValue": R[0] || (R[0] = (b) => w.value = b),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), n("div", Rs, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("div", Us, [
              s("strong", null, y(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              s("span", null, y(e.dependents.reason), 1),
              s("span", As, [
                (l(!0), n(F, null, ce(e.dependents.names, (b) => (l(), O(a(B), {
                  key: b,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(v).title("message", b) ?? b,
                  onClick: (k) => {
                    u("close"), a(r)({ name: "resource", kind: "message", resource: b, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), n("p", js, y(e.error), 1)) : S("", !0)
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
  setup(e) {
    const d = za(e, "open");
    return (o, u) => (l(), O(a(Nl), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": u[0] || (u[0] = (v) => d.value = v === "content")
    }, {
      default: A(() => [
        t(a(Dl), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: A(() => [
            t(a(zl), { class: "kx-disclosure-toggle" }, {
              default: A(() => [
                Y(y(e.label), 1)
              ]),
              _: 1
            }),
            t(a(El), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: A(() => [
                Ne(o.$slots, "default")
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
}), Is = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ns = { class: "kx-modal-head-icon" }, Es = { class: "kx-modal-head-text" }, zs = { class: "kx-modal-head-title" }, Ds = { class: "mail-field" }, Os = ["for"], Ms = /* @__PURE__ */ te({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: d, emit: o }) {
    const u = e, v = o, { library: r } = fe(), w = $(), m = $("");
    function T(j) {
      m.value = "", r.ensure("part"), u.face === "html" && r.ensure("asset"), w.value?.toggle(j);
    }
    d({ toggle: T });
    const C = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], c = (j) => ({ label: j, disabled: !0, icon: "tabler:loader-2" });
    async function h(j) {
      m.value = "";
      try {
        v("insert", as(await se.get({ kind: "part", name: j })));
      } catch (L) {
        m.value = ne(L, "The part could not be read.");
      }
    }
    const R = $(), b = $(""), k = ve();
    xe(() => !!R.value);
    async function p(j, L) {
      m.value = "";
      try {
        await se.get({ kind: "asset", name: j }), R.value = { name: j, title: L }, b.value = L;
      } catch (z) {
        m.value = ne(z, "The image could not be read.");
      }
    }
    function f() {
      R.value && (v("insert", ls(R.value.name, b.value)), R.value = void 0);
    }
    const g = M(() => {
      const j = Object.entries(u.draft.schema.properties).map(([E]) => ({
        label: E,
        icon: "tabler:variable",
        command: () => v("insert", u.draft.kind === "part" ? `{{ .${E} }}` : ss(E))
      })), L = [{
        label: u.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...j, ...C.map((E) => ({
          label: E.label,
          icon: "tabler:world",
          command: () => v("insert", `{{ ${E.name} }}`)
        }))]
      }], z = r.ofKind("part").filter((E) => !(u.draft.kind === "part" && E.name === u.draft.name));
      if (L.push({ label: "Parts", items: r.ready("part") ? z.length ? z.map((E) => ({ label: E.title, icon: be.part, command: () => {
        h(E.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [c("Loading parts…")] }), u.face === "html") {
        const E = r.ofKind("asset");
        L.push({ label: "Images", items: r.ready("asset") ? E.length ? E.map((ee) => ({ label: ee.title, icon: be.asset, command: () => {
          p(ee.name, ee.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [c("Loading images…")] });
      }
      return u.draft.kind === "base" && L.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => v("insert", is)
      }] }), L;
    }), _ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (j, L) => (l(), n(F, null, [
      t(a(Ol), {
        ref_key: "menu",
        ref: w,
        model: g.value,
        popup: "",
        "aria-label": "Insert into " + (e.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: A(({ item: z, class: E }) => [
          z.icon ? (l(), O(a(N), {
            key: 0,
            icon: z.icon,
            class: re(E),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : S("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      m.value ? (l(), n("p", Is, y(m.value), 1)) : S("", !0),
      t(a(je), {
        visible: !!R.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: _,
        "aria-label": "Insert image",
        "onUpdate:visible": L[2] || (L[2] = (z) => {
          z || (R.value = void 0);
        })
      }, {
        header: A(() => [
          s("span", Ns, [
            t(a(N), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          s("span", Es, [
            s("span", zs, "Insert " + y(R.value?.title), 1),
            L[3] || (L[3] = s("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: A(() => [
          t(a(B), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: L[1] || (L[1] = (z) => R.value = void 0)
          }),
          t(a(B), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: A(() => [
          s("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: Re(f, ["prevent"])
          }, [
            s("div", Ds, [
              s("label", {
                class: "mail-field-label",
                for: a(k)
              }, "Alternative text", 8, Os),
              t(a(de), {
                id: a(k),
                modelValue: b.value,
                "onUpdate:modelValue": L[0] || (L[0] = (z) => b.value = z),
                autofocus: ""
              }, null, 8, ["id", "modelValue"]),
              L[4] || (L[4] = s("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible"])
    ], 64));
  }
}), Ps = ["disabled", "inert"], Bs = { class: "mail-form" }, qs = { class: "mail-field" }, Hs = ["for"], Fs = { class: "mail-field" }, Js = ["for"], Ks = { class: "mail-field-hint" }, Ws = { class: "mail-mono" }, Ys = { class: "mail-field" }, Gs = ["for"], Zs = { class: "mail-base-row" }, Qs = { class: "mail-kind" }, Xs = ["id"], ei = { class: "mail-code-frame mail-code-subject" }, ai = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, li = { class: "mail-face-bar" }, ti = { class: "mail-code-frame mail-code-body" }, si = /* @__PURE__ */ te({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const d = ua(() => import("./CodeEditor-CIrhfC0V.js")), o = e, { library: u, go: v } = fe();
    u.use("base");
    const r = { base: ve(), title: ve(), description: ve(), face: ve() }, w = $("html"), m = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], T = M(() => u.ofKind("base").map((p) => ({ value: p.name, label: p.title }))), C = M(() => o.draft.kind === "message" && /[\r\n]/.test(o.draft.subject ?? "")), c = $(), h = $();
    function R(p) {
      c.value?.insert(p);
    }
    const b = M(() => {
      const p = o.problem;
      if (p)
        return p.face === "html" || p.face === "text" || p.face === "subject" ? p.face : w.value;
    }), k = M(() => (o.draft.kind === "message" ? "Body" : "Source") + (w.value === "html" ? ", HTML" : ", plain text"));
    return (p, f) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t(Qa, { label: "Name and description" }, {
        default: A(() => [
          s("div", Bs, [
            s("div", qs, [
              s("label", {
                class: "mail-field-label",
                for: r.title
              }, "Name", 8, Hs),
              t(a(de), {
                id: r.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": f[0] || (f[0] = (g) => e.draft.title = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", Fs, [
              s("label", {
                class: "mail-field-label",
                for: r.description
              }, "Description", 8, Js),
              t(a(de), {
                id: r.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": f[1] || (f[1] = (g) => e.draft.description = g)
              }, null, 8, ["id", "modelValue"])
            ]),
            s("p", Ks, [
              f[9] || (f[9] = Y("Reference ", -1)),
              s("span", Ws, y(e.draft.name), 1),
              Y(", used to " + y(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), n(F, { key: 0 }, [
        s("div", Ys, [
          s("label", {
            class: "mail-field-label",
            for: r.base
          }, "Base template", 8, Gs),
          s("div", Zs, [
            t(a(Ee), {
              modelValue: e.draft.base,
              "onUpdate:modelValue": f[2] || (f[2] = (g) => e.draft.base = g),
              "input-id": r.base,
              options: T.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !a(u).ready("base")
            }, {
              value: A(({ value: g }) => [
                s("span", Qs, [
                  t(a(N), {
                    icon: a(be).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  g && a(u).title("base", g) === void 0 ? (l(), O(a(Ae), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    Y(y(a(u).title("base", g)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            e.draft.base ? (l(), O(a(B), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: f[3] || (f[3] = (g) => a(v)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : S("", !0)
          ])
        ]),
        s("div", {
          class: re(["mail-field", { "mail-field-invalid": b.value === "subject" || C.value }])
        }, [
          s("span", {
            id: r.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Xs),
          s("div", ei, [
            t(a(d), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": f[4] || (f[4] = (g) => e.draft.subject = g),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          C.value ? (l(), n("small", ai, "A subject is one line. Remove the line break.")) : e.problem && b.value === "subject" ? (l(), O(va, {
            key: 1,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : S("", !0)
        ], 2)
      ], 64)) : S("", !0),
      s("div", {
        class: re(["mail-field", { "mail-field-invalid": e.problem && b.value !== "subject" }])
      }, [
        s("div", li, [
          t(a(_e), {
            modelValue: w.value,
            "onUpdate:modelValue": f[5] || (f[5] = (g) => w.value = g),
            options: m,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          t(a(B), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: f[6] || (f[6] = (g) => h.value?.toggle(g))
          }, {
            icon: A(() => [
              t(a(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        s("div", ti, [
          w.value === "html" ? (l(), O(a(d), {
            ref_key: "editor",
            ref: c,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": f[7] || (f[7] = (g) => e.draft.html = g),
            label: k.value
          }, null, 8, ["modelValue", "label"])) : (l(), O(a(d), {
            ref_key: "editor",
            ref: c,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": f[8] || (f[8] = (g) => e.draft.text = g),
            label: k.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && b.value !== "subject" ? (l(), O(va, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : S("", !0)
      ], 2),
      t(Ms, {
        ref_key: "inserter",
        ref: h,
        draft: e.draft,
        face: w.value,
        onInsert: R
      }, null, 8, ["draft", "face"])
    ], 8, Ps));
  }
}), ii = { class: "mail-value-field" }, ni = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ea = /* @__PURE__ */ te({
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
  setup(e, { emit: d }) {
    const o = e, u = za(e, "modelValue"), v = d, r = (g) => g === null || ["string", "number", "boolean"].includes(typeof g), w = (g) => g === void 0 || Array.isArray(g) && g.every(r), m = (g) => g === void 0 || !!g && typeof g == "object" && !Array.isArray(g) && Object.values(g).every((_) => typeof _ == "string"), T = $(!1);
    X(() => o.type, () => {
      T.value = !1;
    });
    const C = M(() => T.value ? "written" : o.type === "array" ? w(u.value) ? "list" : "written" : o.type === "object" ? m(u.value) ? "record" : "written" : o.type), c = M({
      get: () => Array.isArray(u.value) ? u.value.map((g) => g === null ? "" : String(g)).join(`
`) : "",
      set: (g) => {
        const _ = g.split(`
`).map((L) => L.trim()).filter(Boolean), j = o.itemType === "number" || o.itemType === "integer";
        u.value = _.length ? _.map((L) => j && L !== "" && !Number.isNaN(Number(L)) ? Number(L) : L) : void 0;
      }
    }), h = $([]);
    X(u, (g) => {
      if (C.value !== "record") return;
      const _ = g ?? {};
      JSON.stringify(Object.fromEntries(h.value.filter((j) => j.key).map((j) => [j.key, j.value]))) !== JSON.stringify(_) && (h.value = Object.entries(_).map(([j, L]) => ({ key: j, value: L })));
    }, { immediate: !0 });
    function R() {
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
        const _ = JSON.parse(g), j = o.type === "array" ? Array.isArray(_) : !!_ && typeof _ == "object" && !Array.isArray(_);
        k.value = j ? "" : o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', j && (u.value = _);
      } catch {
        k.value = o.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    X(k, (g) => v("invalid", g), { immediate: !0 });
    const f = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (g, _) => (l(), n("div", ii, [
      C.value === "string" ? (l(), O(a(de), {
        key: 0,
        "model-value": typeof u.value == "string" ? u.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": _[0] || (_[0] = (j) => u.value = j || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : C.value === "number" || C.value === "integer" ? (l(), O(a(Pl), {
        key: 1,
        "model-value": typeof u.value == "number" ? u.value : null,
        "aria-label": e.label,
        "max-fraction-digits": C.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": _[1] || (_[1] = (j) => u.value = j ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : C.value === "boolean" ? (l(), O(a(_e), {
        key: 2,
        "model-value": typeof u.value == "boolean" ? u.value : null,
        options: f,
        "option-label": "label",
        "option-value": "value",
        "aria-label": e.label,
        disabled: e.disabled,
        "onUpdate:modelValue": _[2] || (_[2] = (j) => u.value = typeof j == "boolean" ? j : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : C.value === "list" ? (l(), O(a(da), {
        key: 3,
        modelValue: c.value,
        "onUpdate:modelValue": _[3] || (_[3] = (j) => c.value = j),
        "aria-label": e.label,
        rows: "3",
        "auto-resize": "",
        disabled: e.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : C.value === "record" ? (l(), n(F, { key: 4 }, [
        (l(!0), n(F, null, ce(h.value, (j, L) => (l(), n("div", {
          key: L,
          class: "mail-value-entry"
        }, [
          t(a(de), {
            modelValue: j.key,
            "onUpdate:modelValue": [(z) => j.key = z, R],
            "aria-label": e.label + ", name " + (L + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(de), {
            modelValue: j.value,
            "onUpdate:modelValue": [(z) => j.value = z, R],
            "aria-label": e.label + ", value " + (L + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          t(a(B), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (j.key || "entry"),
            disabled: e.disabled,
            onClick: (z) => {
              h.value.splice(L, 1), R();
            }
          }, {
            icon: A(() => [
              t(a(N), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        t(a(B), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: _[4] || (_[4] = (j) => h.value.push({ key: "", value: "" }))
        }, {
          icon: A(() => [
            t(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(F, { key: 5 }, [
        t(a(da), {
          "model-value": b.value,
          "aria-label": e.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!k.value,
          disabled: e.disabled,
          fluid: "",
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        k.value ? (l(), n("small", ni, y(k.value), 1)) : S("", !0)
      ], 64)),
      (e.type === "array" || e.type === "object") && C.value !== "written" ? (l(), O(a(B), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: e.disabled,
        onClick: _[5] || (_[5] = (j) => T.value = !0)
      }, null, 8, ["disabled"])) : S("", !0)
    ]));
  }
}), oi = ["disabled", "inert"], ri = { class: "mail-sr-only" }, ui = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, di = {
  key: 1,
  class: "mail-muted"
}, ci = ["aria-label"], vi = { class: "mail-variable-grid" }, mi = { class: "mail-field" }, fi = { class: "mail-field" }, bi = { class: "mail-field" }, yi = ["id"], pi = { class: "mail-variable-check" }, gi = { class: "mail-field" }, hi = { class: "mail-variable-values" }, ki = {
  key: 0,
  class: "mail-field"
}, $i = { class: "mail-field" }, wi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, _i = /* @__PURE__ */ te({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: d }) {
    const o = e, u = d, v = [
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
          type: v.some((j) => j.value === g.type) ? g.type : "string",
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
    const c = M(() => m.value.map((k) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(k.name) ? m.value.some((p) => p !== k && p.name === k.name) ? "Another one has this name." : k.valueErrors.sample || k.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    X(c, (k) => u("invalid", k.some(Boolean)), { immediate: !0 }), X(m, (k) => {
      if (c.value.some(Boolean)) return;
      const p = {}, f = {};
      for (const _ of k) {
        const j = { ..._.schema, type: _.type };
        for (const [L, z] of [["title", _.title], ["description", _.description]])
          z ? j[L] = z : delete j[L];
        _.fallback !== void 0 ? j.default = _.fallback : delete j.default, p[_.name] = j, _.sample !== void 0 && (f[_.name] = _.sample);
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
    const R = M(() => o.draft.kind === "part"), b = M(() => o.problem && (o.problem.face === "variables" || o.problem.face === "samples") ? `${bt[o.problem.face]}: ${o.problem.engine ?? o.problem.message}` : "");
    return (k, p) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s("legend", ri, y(e.label), 1),
      b.value ? (l(), n("p", ui, y(b.value), 1)) : S("", !0),
      m.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), n(F, null, ce(m.value, (f, g) => (l(), n("li", {
          key: f.id,
          class: re(["mail-variable-card", { "mail-variable-invalid": c.value[g] }])
        }, [
          s("div", vi, [
            s("label", mi, [
              p[0] || (p[0] = s("span", { class: "mail-field-label" }, "Name in templates", -1)),
              t(a(de), {
                modelValue: f.name,
                "onUpdate:modelValue": (_) => f.name = _,
                class: "mail-mono-input",
                invalid: !!c.value[g] && !f.valueErrors.sample && !f.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            s("label", fi, [
              p[1] || (p[1] = s("span", { class: "mail-field-label" }, "Label", -1)),
              t(a(de), {
                modelValue: f.title,
                "onUpdate:modelValue": (_) => f.title = _,
                placeholder: f.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            s("div", bi, [
              s("span", {
                id: "type-" + f.id,
                class: "mail-field-label"
              }, "Type", 8, yi),
              t(a(Ee), {
                "model-value": f.type,
                options: v,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + f.id,
                "onUpdate:modelValue": (_) => C(f, _)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            s("label", pi, [
              t(a(Ml), {
                modelValue: f.required,
                "onUpdate:modelValue": (_) => f.required = _,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              p[2] || (p[2] = s("span", null, "Required", -1))
            ]),
            t(a(B), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + f.name,
              title: "Remove " + f.name,
              onClick: (_) => m.value.splice(g, 1)
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          s("label", gi, [
            p[3] || (p[3] = s("span", { class: "mail-field-label" }, "Description", -1)),
            t(a(de), {
              modelValue: f.description,
              "onUpdate:modelValue": (_) => f.description = _,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("div", hi, [
            R.value ? (l(), n("div", ki, [
              p[4] || (p[4] = s("span", { class: "mail-field-label" }, "Default", -1)),
              t(Ea, {
                modelValue: f.fallback,
                "onUpdate:modelValue": (_) => f.fallback = _,
                type: f.type,
                "item-type": f.itemType,
                label: "Default of " + f.name,
                onInvalid: (_) => f.valueErrors.fallback = _
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : S("", !0),
            s("div", $i, [
              p[5] || (p[5] = s("span", { class: "mail-field-label" }, "Sample value", -1)),
              t(Ea, {
                modelValue: f.sample,
                "onUpdate:modelValue": (_) => f.sample = _,
                type: f.type,
                "item-type": f.itemType,
                label: "Sample value of " + f.name,
                onInvalid: (_) => f.valueErrors.sample = _
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          c.value[g] ? (l(), n("small", wi, y(f.name) + ": " + y(c.value[g]), 1)) : S("", !0)
        ], 2))), 128))
      ], 8, ci)) : (l(), n("p", di, y(e.draft.title) + " takes no " + y(e.label.toLowerCase()) + " yet.", 1)),
      s("div", null, [
        t(a(B), {
          label: R.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: h
        }, {
          icon: A(() => [
            t(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, oi));
  }
}), xi = { class: "kx-modal-head-icon" }, Ci = {
  key: 0,
  class: "kx-modal-head-text"
}, Vi = { class: "kx-modal-head-title" }, Si = {
  key: 0,
  class: "kx-modal-head-sub"
}, Ti = {
  key: 1,
  class: "kx-modal-head-sub"
}, Ri = {
  key: 0,
  class: "mail-form"
}, Ui = { class: "mail-face-bar" }, Ai = {
  key: 0,
  class: "mail-version-subject"
}, ji = { class: "mail-mono-block" }, Li = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Ii = /* @__PURE__ */ te({
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
    const o = ua(() => import("./CodeEditor-CIrhfC0V.js")), u = ua(() => import("./DiffView-CjA70e3n.js")), v = e, r = d;
    xe(() => !!v.revision);
    const w = $("version"), m = $("html");
    X(() => v.revision, (p) => {
      p && (w.value = v.compare ? "compare" : "version", m.value = "html");
    });
    const T = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], C = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], c = M(() => !v.included && v.revision?.version === v.current.revision), h = M(() => {
      const p = v.revision;
      return p ? v.included || p.state === "original" && p.action === "reset" ? `${v.current.title}: the version included with ${v.current.origin_label}` : `${v.current.title}, version ${p.version}` : "";
    }), R = M(() => v.revision ? m.value === "html" ? v.revision.content.html : v.revision.content.text : ""), b = M(() => m.value === "html" ? v.current.html : v.current.text), k = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (p, f) => (l(), O(a(je), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: k,
      "aria-label": h.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": f[5] || (f[5] = (g) => {
        g || r("close");
      })
    }, {
      header: A(() => [
        s("span", xi, [
          t(a(N), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), n("span", Ci, [
          s("span", Vi, y(h.value), 1),
          e.included ? (l(), n("span", Si, "Compare it with your customized version, or reset to it.")) : (l(), n("span", Ti, y(a(ba)[e.revision.action]) + " by " + y(a(we)(e.revision.author_label, e.revision.author)) + " · " + y(a(Fe)(e.revision.created_at)), 1))
        ])) : S("", !0)
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: f[2] || (f[2] = (g) => r("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), O(a(B), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: f[3] || (f[3] = (g) => r("reset"))
        }, {
          icon: A(() => [
            t(a(N), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !c.value ? (l(), O(a(B), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: f[4] || (f[4] = (g) => r("restore", e.revision))
        }, {
          icon: A(() => [
            t(a(N), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : S("", !0)
      ]),
      default: A(() => [
        e.revision ? (l(), n("div", Ri, [
          s("div", Ui, [
            c.value ? S("", !0) : (l(), O(a(_e), {
              key: 0,
              modelValue: w.value,
              "onUpdate:modelValue": f[0] || (f[0] = (g) => w.value = g),
              options: T,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            t(a(_e), {
              modelValue: m.value,
              "onUpdate:modelValue": f[1] || (f[1] = (g) => m.value = g),
              options: C,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && w.value === "version" ? (l(), n("p", Ai, [
            f[6] || (f[6] = s("span", { class: "mail-muted" }, "Subject", -1)),
            f[7] || (f[7] = Y()),
            s("span", ji, y(e.revision.content.subject), 1)
          ])) : S("", !0),
          w.value === "version" ? (l(), n("div", Li, [
            (l(), O(a(o), {
              key: m.value,
              "model-value": R.value,
              label: h.value + (m.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), O(a(u), {
            key: "diff-" + m.value,
            before: R.value,
            after: b.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Ni = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ei = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, zi = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, Di = {
  key: 3,
  class: "mail-history"
}, Oi = { class: "mail-history-head" }, Mi = { class: "mail-history-main" }, Pi = { class: "mail-history-title" }, Bi = { class: "mail-sub" }, qi = {
  key: 0,
  class: "mail-history-note"
}, Hi = {
  key: 0,
  class: "mail-history-actions"
}, Fi = /* @__PURE__ */ te({
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
    return (d, o) => e.error ? (l(), n("div", Ni, [
      s("span", null, y(e.error), 1),
      t(a(B), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: o[0] || (o[0] = (u) => d.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (l(), n("p", Ei, [
      t(a(N), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      o[1] || (o[1] = Y("Loading history…", -1))
    ])) : e.revisions.length ? (l(), n("ol", Di, [
      (l(!0), n(F, null, ce(e.revisions, (u) => (l(), n("li", {
        key: u.seq,
        class: "mail-history-row"
      }, [
        s("div", Oi, [
          s("div", Mi, [
            s("span", Pi, [
              Y(" Version " + y(u.version) + " · " + y(a(ba)[u.action]) + y(u.restored_from ? " from version " + u.restored_from : "") + " ", 1),
              u.version === e.resource.revision ? (l(), O(a(Te), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : S("", !0)
            ]),
            s("span", Bi, y(a(we)(u.author_label, u.author)) + " · " + y(a(Fe)(u.created_at)), 1),
            u.note ? (l(), n("span", qi, y(u.note), 1)) : S("", !0)
          ]),
          a(Ma)(u) ? (l(), n("div", Hi, [
            t(a(B), {
              label: "Show this version",
              disabled: e.busy !== void 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (v) => d.$emit("show", u)
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            u.version !== e.resource.revision ? (l(), O(a(B), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: e.busy === u.seq,
              disabled: e.busy !== void 0,
              onClick: (v) => d.$emit("restore", u)
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
          ])) : S("", !0)
        ])
      ]))), 128))
    ])) : (l(), n("p", zi, y(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Ji = { class: "kx-modal-head-icon mail-head-warn" }, Ki = { class: "kx-modal-head-text" }, Wi = { class: "kx-modal-head-title" }, Yi = { class: "mail-dialog-text" }, Gi = {
  key: 0,
  class: "mail-list"
}, Xa = /* @__PURE__ */ te({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e;
    xe(() => !!o.refusal);
    const u = d, v = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function r(w) {
      u("close"), w();
    }
    return (w, m) => (l(), O(a(je), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: v,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": m[1] || (m[1] = (T) => {
        T || u("close");
      })
    }, {
      header: A(() => [
        s("span", Ji, [
          t(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        s("span", Ki, [
          s("span", Wi, y(e.refusal?.header), 1)
        ])
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Close",
          autofocus: "",
          onClick: m[0] || (m[0] = (T) => u("close"))
        })
      ]),
      default: A(() => [
        s("p", Yi, y(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), n("ul", Gi, [
          (l(!0), n(F, null, ce(e.refusal.links, (T) => (l(), n("li", {
            key: T.label
          }, [
            t(a(B), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (C) => r(T.open)
            }, {
              default: A(() => [
                t(a(N), {
                  icon: T.icon ?? "tabler:mail",
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                s("span", null, y(T.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : S("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Zi = { class: "mail-stack" }, Qi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Xi = {
  key: 0,
  class: "mail-muted"
}, en = {
  key: 1,
  class: "mail-list"
}, an = { key: 1 }, ln = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, tn = { class: "mail-group-head" }, sn = {
  key: 0,
  class: "mail-muted"
}, nn = {
  key: 1,
  class: "mail-list"
}, on = { class: "mail-list-main" }, rn = {
  key: 0,
  class: "mail-sub"
}, un = { class: "mail-muted" }, dn = /* @__PURE__ */ te({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const d = e, { library: o, go: u, capabilities: v } = fe(), r = M(() => (d.resource.used_by?.messages ?? []).map((m) => ({
      name: m,
      title: o.title("message", m)
    }))), w = M(() => d.resource.used_by?.recent_senders ?? []);
    return (m, T) => (l(), n("div", Zi, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), n("section", Qi, [
        T[1] || (T[1] = s("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        r.value.length ? (l(), n("ul", en, [
          (l(!0), n(F, null, ce(r.value, (C) => (l(), n("li", {
            key: C.name
          }, [
            t(a(B), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (c) => a(u)({ name: "resource", kind: "message", resource: C.name, section: "content" })
            }, {
              default: A(() => [
                t(a(N), {
                  icon: a(be).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                C.title === void 0 ? (l(), O(a(Ae), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", an, y(C.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Xi, "No messages " + y(e.resource.kind === "asset" ? "show" : "use") + " " + y(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), n("section", ln, [
        s("div", tn, [
          T[2] || (T[2] = s("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(v)?.administer_delivery ? (l(), O(a(B), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: T[0] || (T[0] = (C) => a(u)({ name: "activity", template: e.resource.name }))
          })) : S("", !0)
        ]),
        w.value.length ? (l(), n("ul", nn, [
          (l(!0), n(F, null, ce(w.value, (C) => (l(), n("li", {
            key: C.sender + (C.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            t(a(N), {
              icon: C.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("span", on, [
              s("span", null, y(a(we)(C.sender_label, C.sender)), 1),
              C.origin ? (l(), n("span", rn, y(a(ta)(C.origin)), 1)) : S("", !0)
            ]),
            s("span", un, y(a(ye)(C.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", sn, "Nobody has sent " + y(e.resource.title) + " recently.", 1))
      ])) : S("", !0)
    ]));
  }
}), cn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, vn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, mn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, fn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, bn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, yn = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, pn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, gn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, hn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, kn = {
  key: 6,
  class: "kx-notice mail-customized"
}, $n = { class: "mail-customized-text" }, wn = { class: "mail-editor-layout" }, _n = /* @__PURE__ */ te({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const d = e, { library: o, capabilities: u, delivery: v, go: r, create: w, setDirty: m, setTitle: T } = fe(), C = M(() => ({ kind: d.kind, name: d.name })), c = pe(), h = $(), R = $(!0), b = $(!1), k = $(!1), p = $(""), f = $(), g = Ve(), _ = M(() => !!h.value && !!c.value && !Qt(h.value, c.value));
    X(_, (P) => m(P), { immediate: !0 }), aa(() => m(!1));
    async function j(P = {}) {
      const D = g();
      try {
        const J = await se.get(C.value);
        if (!D()) return;
        const ie = P.keepDraft && _.value;
        if (ie && c.value && J.revision !== c.value.revision) {
          f.value = { revision: J.revision, by: we(J.author_label, J.author) || "Someone" };
          return;
        }
        c.value = J, ie || (h.value = ke(J), L.value = void 0), T(J.title), f.value = void 0, b.value = k.value = !1, p.value = "";
      } catch (J) {
        if (!D()) return;
        b.value = Xe(J), k.value = He(J), p.value = b.value || k.value ? "" : ne(J, "This resource could not be loaded."), b.value && (c.value = void 0, h.value = void 0);
      } finally {
        D() && (R.value = !1);
      }
    }
    const L = $(), z = pe([]), E = $(!1), ee = $(""), ae = Ve();
    async function Z() {
      const P = ae();
      E.value = !0;
      try {
        const D = await se.history(C.value);
        if (!P()) return;
        z.value = D, ee.value = "";
      } catch (D) {
        if (!P()) return;
        ee.value = Xe(D) ? "" : ne(D, "History could not be loaded.");
      } finally {
        P() && (E.value = !1);
      }
    }
    async function H() {
      await Promise.all([j({ keepDraft: !0 }), Z()]);
    }
    la(H), Ue("mail.library", () => {
      H();
    });
    const I = $(), V = $(""), x = $(!1), i = $(""), U = $(), Q = M(() => c.value?.title ?? d.name), q = M(() => {
      const P = c.value, D = Q.value, J = P?.used_by?.messages?.length ?? 0, ie = P?.used_by?.recent_senders?.find((na) => na.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ie?.origin ? ` Sent recently by “${ta(ie.origin)}”.` : "") },
          base: { title: "Layout", description: J ? `The frame around the ${ye(J, "message")} that ${J === 1 ? "uses" : "use"} ${D}.` : `The frame around messages that use ${D}.` },
          part: { title: "Content", description: `Shown wherever ${D} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${D} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${D}.` : d.kind === "base" ? `Messages that use ${D}.` : `Templates that include ${D}.`
        },
        history: { title: "History", description: `Every saved version of ${D}, newest first.` }
      }[d.section];
    }), K = M(() => {
      const P = c.value;
      return P?.state !== "customized" ? "" : `Customized by ${we(P.author_label, P.author)} ${_l(P.updated_at)} from the version included with ${P.origin_label}.`;
    }), le = M(() => {
      const P = c.value;
      if (!P?.original) return;
      const { kind: D, name: J, title: ie, description: oe } = P;
      return {
        kind: D,
        name: J,
        seq: 0,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: D, name: J, title: ie, description: oe, ...P.original }
      };
    }), W = $(), G = $(), ge = $(!1), Je = M(() => G.value ?? W.value);
    X(() => JSON.stringify(h.value), () => {
      G.value = void 0;
    });
    const _a = M(() => d.kind === "message" && /[\r\n]/.test(h.value?.subject ?? "")), ll = M(() => !!Je.value || ge.value || !!f.value || _a.value), xa = M(() => f.value ? "Discard your changes to load the newer version first." : ge.value ? "Fix the variables first." : _a.value ? "Put the subject on one line first." : Je.value ? "Fix the error first." : ""), Ca = $(!1);
    function sa(P, D) {
      Ca.value = ["invalid_config", "from_name_invalid"].includes($e(P) ?? ""), x.value = ["mail_revision_conflict", "mail_preview_stale"].includes($e(P) ?? ""), x.value && H(), V.value = ne(P, D);
    }
    function Va() {
      if (!c.value) return;
      const P = !!f.value;
      h.value = ke(c.value), f.value = void 0, G.value = void 0, L.value = void 0, P && j();
    }
    const Le = $(!1), Ke = $(""), We = $();
    function tl() {
      Ke.value = "", We.value = void 0, Le.value = !0;
    }
    async function sl(P) {
      const D = c.value, J = h.value;
      if (!(!D || !J || I.value !== void 0)) {
        I.value = "save", Ke.value = V.value = i.value = "", We.value = void 0;
        try {
          const ie = L.value, oe = ie && JSON.stringify(J) === JSON.stringify({ ...ke(ie.content), kind: D.kind, name: D.name }), he = oe ? await se.restore(C.value, ie.seq, D.revision, P || void 0) : await se.update(J, D.revision, P || void 0);
          c.value = { ...D, ...he }, h.value = ke(c.value), Le.value = !1, i.value = oe ? `Version ${ie.version} from ${Fe(ie.created_at)} is now in effect.` : `Saved ${he.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, L.value = void 0, await H();
        } catch (ie) {
          const oe = Be(ie), he = oe?.resource?.kind === J.kind && oe.resource.name === J.name;
          oe?.dependents?.length && !he ? We.value = { names: oe.dependents, reason: oe.reasons?.[0]?.message ?? oe.message } : oe ? (G.value = oe, Le.value = !1) : ["mail_revision_conflict", "mail_preview_stale"].includes($e(ie) ?? "") ? (Le.value = !1, await j({ keepDraft: !0 })) : Ke.value = ne(ie, `${J.title} could not be saved.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    async function il() {
      const P = c.value;
      if (!(!P || I.value !== void 0)) {
        I.value = "test", V.value = i.value = "";
        try {
          await se.sendTest(P.name), i.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (D) {
          sa(D, "The test could not be sent.");
        } finally {
          I.value = void 0;
        }
      }
    }
    const Ye = M(() => _.value ? "Save your changes to send a test." : u.value?.send ? v.value && !v.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Sa() {
      const P = c.value;
      if (!(!P || I.value !== void 0 || !await Ce.confirm({
        header: `Reset ${P.title} to the original?`,
        message: `Your changes are replaced by the version included with ${P.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        I.value = "reset", V.value = i.value = "", x.value = !1;
        try {
          c.value = await se.reset(C.value, P.revision), h.value = ke(c.value), i.value = `${P.title} is back to the original. Your changes are in History.`, await H();
        } catch (J) {
          sa(J, `${P.title} could not be reset.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    const ze = $(), Ta = $(!1), Ra = $(!1);
    function Ua(P, D = !1, J = !1) {
      Ta.value = D, Ra.value = J, ze.value = P;
    }
    async function Aa(P) {
      const D = C.value;
      I.value = P.seq, V.value = "";
      try {
        const J = await se.revision(D, P.seq);
        if (C.value.kind === D.kind && C.value.name === D.name) return J;
      } catch (J) {
        C.value.kind === D.kind && C.value.name === D.name && (V.value = ne(J, "This version could not be loaded."));
      } finally {
        I.value === P.seq && (I.value = void 0);
      }
    }
    async function nl(P) {
      const D = await Aa(P);
      D && Ua(D);
    }
    async function ja(P) {
      const D = c.value;
      if (!D || I.value !== void 0 || _.value && !await Ce.confirm({
        header: `Replace your unsaved changes with version ${P.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      const J = "content" in P ? P : await Aa(P);
      if (!J) return;
      h.value = { ...ke(J.content), kind: D.kind, name: D.name }, L.value = J, ze.value = void 0, V.value = "";
      const ie = `Version ${J.version} is loaded as your draft. Review and save to restore it.`;
      d.section === "content" ? i.value = ie : (ia = ie, r({ name: "resource", kind: d.kind, resource: d.name, section: "content" }));
    }
    function La(P, D, J) {
      const ie = D.map((he) => o.title("message", he) ?? he), oe = P.kind === "base" ? "use" : "include";
      U.value = {
        header: `${P.title} is in use`,
        message: `${ye(D.length, "message")} ${D.length === 1 ? oe + "s" : oe} it: ${ie.join(", ")}. Remove it from ${D.length === 1 ? "that message" : "them"} first.`,
        links: D.map((he, na) => ({ label: ie[na], open: () => r({ name: "resource", kind: "message", resource: he, section: "content" }) }))
      };
    }
    async function ol() {
      const P = c.value;
      if (!P || P.state !== "created" || I.value !== void 0) return;
      const D = P.used_by?.messages ?? [];
      if (P.kind === "base" && D.length) {
        La(P, D);
        return;
      }
      if (await Ce.confirm({
        header: `Delete ${P.title}?`,
        message: P.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${me[P.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        I.value = "delete", V.value = i.value = "";
        try {
          await se.remove(C.value, P.revision), m(!1), r({ name: "library", section: ca(d.kind) });
        } catch (ie) {
          const oe = Be(ie);
          oe?.dependents?.length ? La(P, oe.dependents) : sa(ie, `${P.title} could not be deleted.`);
        } finally {
          I.value = void 0;
        }
      }
    }
    function rl() {
      const P = c.value;
      P && w({ kind: d.kind, from: { kind: P.kind, name: P.name } });
    }
    const ul = M(() => d.kind === "base" ? c.value?.used_by?.messages : void 0), Ge = M(() => I.value === "save");
    j(), X(() => d.section, (P) => {
      P === "history" && !z.value.length && Z();
    }, { immediate: !0 });
    let ia = "";
    return X(() => d.section, () => {
      i.value = ia, ia = "", V.value = "";
    }), (P, D) => (l(), n(F, null, [
      b.value ? (l(), O(ha, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(fa)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: D[0] || (D[0] = (J) => a(r)({ name: "library", section: a(ca)(e.kind) }))
      }, null, 8, ["cta"])) : k.value ? (l(), n("p", cn, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        D[11] || (D[11] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(F, { key: 2 }, [
        t(qe, {
          title: q.value.title,
          description: q.value.description
        }, ma({ _: 2 }, [
          c.value ? {
            name: "actions",
            fn: A(() => [
              _.value ? (l(), O(Gt, {
                key: 0,
                busy: Ge.value,
                "review-disabled": ll.value,
                onDiscard: Va,
                onReview: tl
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(F, { key: 1 }, [
                e.kind === "message" ? (l(), O(a(B), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: I.value === "test",
                  disabled: !!Ye.value || I.value !== void 0,
                  title: Ye.value || void 0,
                  onClick: il
                }, {
                  icon: A(() => [
                    t(a(N), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : S("", !0),
                t(a(B), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: I.value !== void 0,
                  onClick: rl
                }, {
                  icon: A(() => [
                    t(a(N), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                c.value.state === "created" ? (l(), O(a(B), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: I.value === "delete",
                  disabled: I.value !== void 0,
                  onClick: ol
                }, {
                  icon: A(() => [
                    t(a(N), {
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
        p.value ? (l(), n("div", vn, [
          s("span", null, y(p.value), 1),
          t(a(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: D[1] || (D[1] = (J) => H())
          })
        ])) : R.value ? (l(), n("p", mn, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          Y("Loading " + y(Q.value) + "…", 1)
        ])) : S("", !0),
        c.value && h.value ? (l(), n(F, { key: 2 }, [
          f.value ? (l(), n("p", fn, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            s("span", null, [
              Y(y(f.value.by) + " saved " + y(c.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              t(a(B), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Va
              })
            ])
          ])) : S("", !0),
          _.value && xa.value && !f.value ? (l(), n("p", bn, y(xa.value), 1)) : e.kind === "message" && !_.value && Ye.value ? (l(), n("p", yn, [
            Y(y(Ye.value) + " ", 1),
            a(u)?.administer_delivery && a(v) && !a(v).configured ? (l(), O(a(B), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: D[2] || (D[2] = (J) => a(Ce).navigate("/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          V.value && x.value ? (l(), n("p", pn, [
            t(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            Y(y(V.value), 1)
          ])) : V.value ? (l(), n("p", gn, [
            s("span", null, y(V.value), 1),
            Ca.value && a(u)?.administer_delivery ? (l(), O(a(B), {
              key: 0,
              label: "Open delivery settings",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: D[3] || (D[3] = (J) => a(Ce).navigate("/system/settings/mail"))
            })) : S("", !0)
          ])) : S("", !0),
          i.value ? (l(), n("p", hn, [
            t(a(N), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            Y(y(i.value), 1)
          ])) : S("", !0),
          K.value && e.section === "content" ? (l(), n("div", kn, [
            t(a(N), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            s("span", $n, [
              Y(y(K.value), 1),
              _.value ? (l(), n(F, { key: 0 }, [
                Y(" Save or discard your changes to reset it.")
              ], 64)) : S("", !0)
            ]),
            le.value ? (l(), O(a(B), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: D[4] || (D[4] = (J) => Ua(le.value, !0, !0))
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            t(a(B), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: I.value === "reset",
              disabled: I.value !== void 0 || _.value,
              onClick: Sa
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : S("", !0),
          yl(s("div", wn, [
            t(si, {
              draft: h.value,
              problem: Je.value,
              disabled: Ge.value
            }, null, 8, ["draft", "problem", "disabled"]),
            t($s, {
              draft: h.value,
              messages: ul.value,
              onProblem: D[5] || (D[5] = (J) => W.value = J)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [pl, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), O(_i, {
            key: 7,
            draft: h.value,
            label: q.value.title,
            problem: Je.value,
            disabled: Ge.value,
            onInvalid: D[6] || (D[6] = (J) => ge.value = J)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), O(dn, {
            key: 8,
            resource: c.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), O(Fi, {
            key: 9,
            resource: c.value,
            revisions: z.value,
            loading: E.value,
            error: ee.value,
            busy: typeof I.value == "number" ? I.value : I.value ? -1 : void 0,
            onShow: nl,
            onRestore: ja,
            onRetry: Z
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : S("", !0)
        ], 64)) : S("", !0)
      ], 64)),
      c.value && h.value ? (l(), O(Ls, {
        key: 3,
        visible: Le.value,
        saved: a(ke)(c.value),
        draft: h.value,
        busy: Ge.value,
        error: Ke.value,
        dependents: We.value,
        "suggested-note": L.value ? `Restore version ${L.value.version}` : void 0,
        onClose: D[7] || (D[7] = (J) => Le.value = !1),
        onSave: sl
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : S("", !0),
      c.value ? (l(), O(Ii, {
        key: 4,
        revision: ze.value,
        current: c.value,
        compare: Ta.value,
        included: Ra.value,
        busy: typeof I.value == "number" || I.value === "reset",
        onClose: D[8] || (D[8] = (J) => ze.value = void 0),
        onRestore: ja,
        onReset: D[9] || (D[9] = (J) => {
          ze.value = void 0, Sa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : S("", !0),
      t(Xa, {
        refusal: U.value,
        onClose: D[10] || (D[10] = (J) => U.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Ze = /* @__PURE__ */ new Map();
function xn(e, d) {
  const o = Ze.get(e);
  if (o && o.revision >= d) return o.url;
  const u = Promise.resolve(Al.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((v) => v.data instanceof Blob ? URL.createObjectURL(v.data) : void 0, () => {
    Ze.get(e)?.url === u && Ze.delete(e);
  });
  return Ze.set(e, { revision: d, url: u }), o && o.url.then((v) => {
    v && URL.revokeObjectURL(v);
  }), u;
}
const Cn = ["src", "alt"], Vn = {
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
  setup(e) {
    const d = e, o = $();
    X(() => [d.name, d.revision], async ([v, r]) => {
      o.value = void 0, o.value = await xn(v, r);
    }, { immediate: !0 });
    const u = M(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (v, r) => (l(), n("span", {
      class: re(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      o.value ? (l(), n("img", {
        key: 0,
        src: o.value,
        alt: e.alt ?? ""
      }, null, 8, Cn)) : (l(), n(F, { key: 1 }, [
        t(a(N), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        u.value ? (l(), n("span", Vn, y(u.value), 1)) : S("", !0)
      ], 64))
    ], 2));
  }
});
function Oe(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Sn(e, d) {
  return e;
}
function Tn(e, d, o) {
  if (d !== void 0 && !d) return null;
  const u = Oe(e) ? e : {}, v = [
    u,
    Oe(u.data) ? u.data : null,
    Oe(u.payload) ? u.payload : null,
    Oe(u.detail) ? u.detail : null
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
      meta: Sn(Oe(r.meta) ? r.meta : {}),
      deleted: Array.isArray(r.deleted) ? r.deleted.map(String) : []
    };
  }
  return null;
}
function Rn(e, d, o) {
  const u = Tn(e, d);
  return u?.event === "component.meta.changed" ? u : null;
}
function Un(e, d, o) {
  if (!e) return null;
  const u = jl(`component.${e}`, (v) => {
    const r = Rn(v, e);
    r && d(r);
  });
  return typeof u == "function" ? u : null;
}
class Qe extends Error {
}
function An(e, d) {
  return new Promise((o, u) => {
    let v = null, r = !1, w = !1, m = !1;
    const T = (c) => {
      m || (m = !0, v?.(), c ? u(c) : o());
    };
    async function C() {
      if (!m) {
        if (d.cancelled) {
          T(new Qe("cancelled"));
          return;
        }
        if (r) {
          w = !0;
          return;
        }
        r = !0;
        try {
          const c = await Pa.state(e);
          c.status === "completed" ? T() : c.status === "error" ? T(new Qe(c.error ?? "")) : v || (v = Un(c.component_id, () => {
            C();
          }), v ? w = !0 : T(new Qe("")));
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
const jn = { class: "kx-modal-head-icon" }, Ln = { class: "kx-modal-head-text" }, In = { class: "kx-modal-head-title" }, Nn = { class: "kx-modal-head-sub" }, En = ["disabled", "inert"], zn = ["for"], Dn = { class: "mail-muted" }, On = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Mn = {
  key: 0,
  class: "mail-field"
}, Pn = ["for"], Bn = ["for"], qn = ["id"], Hn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Fn = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Jn = 1024 * 1024, al = /* @__PURE__ */ te({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: d }) {
    const o = e, u = d, { library: v, go: r } = fe(), w = { file: ve(), title: ve(), name: ve() };
    xe(() => o.visible);
    const m = ["image/png", "image/jpeg", "image/gif"], T = $(), C = $(""), c = $(""), h = $(!1), R = $(!1), b = $();
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
        if (Z.size > Jn) {
          f.value = "Images must be 1 MB or smaller.";
          return;
        }
        T.value = Z, !o.replace && !C.value && (C.value = Z.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function j() {
      return g.value = "", o.replace ? !0 : (qa.test(c.value) ? v.find("asset", c.value) && (g.value = `An image named ${c.value} already exists. Choose another name or replace ${c.value}.`) : g.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !g.value);
    }
    async function L() {
      if (R.value || !T.value || !C.value.trim() || !j()) return;
      R.value = !0, p.value = "";
      const ae = k;
      try {
        b.value = "upload";
        const Z = await Pa.add(T.value), H = { name: c.value, upload_id: Z, title: C.value.trim() }, I = () => o.replace ? se.replaceAsset(H, o.replace.revision) : se.addAsset(H);
        b.value = "save";
        let V;
        try {
          V = await I();
        } catch (x) {
          if ($e(x) !== "upload_still_processing") throw x;
          b.value = "process", await An(Z, ae), b.value = "save", V = await I();
        }
        v.patch("asset", V.name, Wa(V)), u("done", V), u("close"), o.replace || r({ name: "library", section: "assets", asset: V.name });
      } catch (Z) {
        if (ae.cancelled) return;
        Z instanceof Qe ? p.value = "The image could not be processed. Try another file, or upload it again." : $e(Z) === "mail_revision_conflict" && !o.replace ? g.value = `An image named ${c.value} already exists. Choose another name or replace ${c.value}.` : p.value = ne(Z, "The image could not be uploaded.");
      } finally {
        R.value = !1, b.value = void 0;
      }
    }
    const z = M(() => b.value === "upload" ? "Uploading the image…" : b.value === "process" ? "Processing the image…" : b.value === "save" ? "Adding it to the library…" : ""), E = M(() => o.replace ? `Replace ${o.replace.title}` : "Upload image"), ee = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (ae, Z) => (l(), O(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !R.value || b.value === "process",
      "close-on-escape": !R.value || b.value === "process",
      class: "mail-dialog",
      pt: ee,
      "aria-label": E.value,
      "onUpdate:visible": Z[4] || (Z[4] = (H) => {
        H || u("close");
      })
    }, {
      header: A(() => [
        s("span", jn, [
          t(a(N), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        s("span", Ln, [
          s("span", In, y(E.value), 1),
          s("span", Nn, y(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: R.value && b.value !== "process",
          onClick: Z[3] || (Z[3] = (H) => u("close"))
        }, null, 8, ["disabled"]),
        t(a(B), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: R.value,
          disabled: !T.value || !e.replace && !C.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: A(() => [
        s("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: Re(L, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: R.value,
            inert: R.value || void 0
          }, [
            s("div", {
              class: re(["mail-field", { "mail-field-invalid": f.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: w.file
              }, "Image", 8, zn),
              t(a(Bl), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": T.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: w.file, "aria-label": "Image file" } },
                onSelect: _
              }, {
                chooseicon: A(() => [
                  t(a(N), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: A(() => [
                  s("span", Dn, y(T.value ? `${T.value.name} · ${a(Pe)(T.value.size)}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              f.value ? (l(), n("small", On, y(f.value), 1)) : S("", !0)
            ], 2),
            e.replace ? S("", !0) : (l(), n("div", Mn, [
              s("label", {
                class: "mail-field-label",
                for: w.title
              }, "Name", 8, Pn),
              t(a(de), {
                id: w.title,
                modelValue: C.value,
                "onUpdate:modelValue": Z[0] || (Z[0] = (H) => C.value = H)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? S("", !0) : (l(), n("div", {
              key: 1,
              class: re(["mail-field", { "mail-field-invalid": g.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: w.name
              }, "Reference", 8, Bn),
              t(a(de), {
                id: w.name,
                modelValue: c.value,
                "onUpdate:modelValue": Z[1] || (Z[1] = (H) => c.value = H),
                class: "mail-mono-input",
                invalid: !!g.value,
                "aria-describedby": w.name + "-hint",
                onInput: Z[2] || (Z[2] = (H) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: w.name + "-hint",
                class: re(g.value ? "mail-field-error" : "mail-field-hint")
              }, y(g.value || "Templates show it with this name. It cannot change later."), 11, qn)
            ], 2))
          ], 8, En),
          z.value ? (l(), n("p", Hn, [
            t(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            Y(y(z.value), 1)
          ])) : S("", !0),
          p.value ? (l(), n("p", Fn, y(p.value), 1)) : S("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Kn = { class: "mail-drawer-head" }, Wn = { class: "mail-drawer-title" }, Yn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Gn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Zn = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Qn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Xn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, eo = { class: "mail-asset-actions" }, ao = { class: "mail-asset-hero" }, lo = { class: "mail-facts mail-card" }, to = { class: "mail-reference" }, so = { class: "mail-mono-block" }, io = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, no = {
  key: 0,
  class: "mail-muted"
}, oo = { class: "mail-list" }, ro = { key: 1 }, uo = {
  key: 0,
  class: "mail-asset-context"
}, co = ["srcdoc", "title"], vo = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, mo = {
  key: 0,
  class: "mail-muted"
}, fo = {
  key: 1,
  class: "mail-history"
}, bo = { class: "mail-history-head" }, yo = { class: "mail-history-main" }, po = { class: "mail-history-title" }, go = { class: "mail-sub" }, ho = /* @__PURE__ */ te({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, u = d, { library: v, go: r } = fe();
    xe(() => !!o.name);
    const w = $();
    X(() => !!o.name, (x) => {
      x && (v.ensure("message"), Me(() => w.value?.focus()));
    }, { immediate: !0 });
    const m = pe(), T = pe([]), C = pe(), c = $(""), h = $(!1), R = $(!1), b = $(""), k = $(""), p = $(""), f = $(), g = $(!1), _ = $(!1), j = $(!1), L = $(), z = Ve();
    async function E() {
      const x = o.name, i = z();
      if (!x) {
        m.value = void 0;
        return;
      }
      h.value = !0;
      try {
        const [U, Q] = await Promise.all([se.get({ kind: "asset", name: x }), se.history({ kind: "asset", name: x })]);
        if (!i()) return;
        m.value = U, T.value = Q, R.value = !1, b.value = "";
        const q = U.used_by?.messages?.[0];
        c.value = q ?? "";
        const K = q ? await se.preview(q, []) : void 0;
        i() && (C.value = K);
      } catch (U) {
        if (!i()) return;
        R.value = Xe(U), b.value = R.value ? "" : ne(U, "This image could not be loaded.");
      } finally {
        i() && (h.value = !1);
      }
    }
    X(() => o.name, () => {
      g.value = _.value = !1, p.value = k.value = "", E();
    }, { immediate: !0 }), Ue("mail.library", () => {
      o.name && E();
    });
    const ee = M(() => (m.value?.used_by?.messages ?? []).map((x) => ({ name: x, title: v.title("message", x) })));
    async function ae() {
      const x = m.value;
      if (x)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(x.name)}`), _.value = !0;
        } catch {
          _.value = !1;
        }
    }
    const Z = M(() => m.value ? Za(m.value.name) : "");
    async function H() {
      try {
        await navigator.clipboard.writeText(Z.value), g.value = !0;
      } catch {
        g.value = !1;
      }
    }
    async function I(x, i) {
      const U = m.value;
      if (!U || f.value !== void 0) return;
      if (x === "delete" && ee.value.length) {
        L.value = {
          header: `${U.title} is in use`,
          message: `${ye(ee.value.length, "message")} ${ee.value.length === 1 ? "shows" : "show"} it: ${ee.value.map((q) => q.title ?? q.name).join(", ")}. Remove it from ${ee.value.length === 1 ? "that message" : "them"} first.`,
          links: ee.value.map((q) => ({ label: q.title ?? q.name, open: () => r({ name: "resource", kind: "message", resource: q.name, section: "content" }) }))
        };
        return;
      }
      const Q = {
        reset: { header: `Reset ${U.title} to the original?`, message: `The image included with ${U.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${U.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${i?.version} of ${U.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[x];
      if (await Ce.confirm({ header: Q.header, message: Q.message, acceptLabel: Q.accept, rejectLabel: "Cancel", ...x === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        f.value = i ? i.seq : x, k.value = p.value = "";
        try {
          if (x === "delete") {
            await se.remove({ kind: "asset", name: U.name }, U.revision), u("close");
            return;
          }
          m.value = x === "reset" ? await se.reset({ kind: "asset", name: U.name }, U.revision) : await se.restore({ kind: "asset", name: U.name }, i.seq, U.revision), p.value = x === "reset" ? `${U.title} is back to the original.` : `Version ${i.version} is shown again everywhere.`, await E();
        } catch (q) {
          const K = Be(q);
          if (K?.dependents?.length || K?.references?.length) {
            const le = [...(K.references ?? []).filter((W) => W.kind !== "asset")];
            for (const W of K.dependents ?? []) le.some((G) => G.kind === "message" && G.name === W) || le.push({ kind: "message", name: W });
            await Promise.all([...new Set(le.map((W) => W.kind))].map((W) => v.ready(W) ? void 0 : v.load(W))), L.value = {
              header: `${U.title} is in use`,
              message: `${ye(le.length, "template")} ${le.length === 1 ? "names" : "name"} ${U.title}, in the current version or one kept in History. Remove it from ${le.length === 1 ? "that template" : "them"} first.`,
              links: le.map((W) => ({
                label: v.title(W.kind, W.name) ?? W.name,
                icon: be[W.kind],
                open: () => r(W.kind === "asset" ? { name: "library", section: "assets", asset: W.name } : { name: "resource", kind: W.kind, resource: W.name, section: "content" })
              }))
            };
          } else
            k.value = $e(q) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ne(q, "The image could not be changed."), $e(q) === "mail_revision_conflict" && E();
        } finally {
          f.value = void 0;
        }
      }
    }
    const V = M(() => C.value?.html ? $a(C.value.html, C.value.inline_assets) : "");
    return (x, i) => (l(), n(F, null, [
      t(a(Ja), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: f.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": i[5] || (i[5] = (U) => {
          U || u("close");
        })
      }, {
        default: A(() => [
          s("div", {
            ref_key: "drawer",
            ref: w,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            s("header", Kn, [
              s("div", Wn, [
                m.value?.state === "customized" ? (l(), O(a(Te), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : S("", !0),
                s("h2", null, y(m.value?.title ?? "Image"), 1)
              ]),
              t(a(B), {
                text: "",
                severity: "secondary",
                disabled: !m.value,
                "aria-label": _.value ? "Link copied" : "Copy link",
                title: _.value ? "Link copied" : "Copy link",
                onClick: ae
              }, {
                icon: A(() => [
                  t(a(N), {
                    icon: _.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              t(a(B), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: f.value !== void 0,
                onClick: i[0] || (i[0] = (U) => u("close"))
              }, {
                icon: A(() => [
                  t(a(N), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            h.value && !m.value ? (l(), n("p", Yn, [
              t(a(N), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              i[9] || (i[9] = Y("Loading image…", -1))
            ])) : R.value ? (l(), n("p", Gn, [
              t(a(N), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              i[10] || (i[10] = Y("This image no longer exists. It was deleted while you were away.", -1))
            ])) : b.value ? (l(), n("div", Zn, [
              s("span", null, y(b.value), 1),
              t(a(B), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: i[1] || (i[1] = (U) => E())
              })
            ])) : S("", !0),
            m.value ? (l(), n(F, { key: 3 }, [
              k.value ? (l(), n("p", Qn, [
                t(a(N), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                Y(y(k.value), 1)
              ])) : S("", !0),
              p.value ? (l(), n("p", Xn, [
                t(a(N), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                Y(y(p.value), 1)
              ])) : S("", !0),
              s("div", eo, [
                t(a(B), {
                  label: "Replace",
                  disabled: f.value !== void 0,
                  onClick: i[2] || (i[2] = (U) => j.value = !0)
                }, {
                  icon: A(() => [
                    t(a(N), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                m.value.state === "customized" ? (l(), O(a(B), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: f.value === "reset",
                  disabled: f.value !== void 0,
                  onClick: i[3] || (i[3] = (U) => I("reset"))
                }, {
                  icon: A(() => [
                    t(a(N), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0),
                m.value.state === "created" ? (l(), O(a(B), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: f.value === "delete",
                  disabled: f.value !== void 0,
                  onClick: i[4] || (i[4] = (U) => I("delete"))
                }, {
                  icon: A(() => [
                    t(a(N), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : S("", !0)
              ]),
              s("div", ao, [
                t(el, {
                  name: m.value.name,
                  revision: m.value.revision,
                  asset: m.value.asset,
                  large: "",
                  alt: m.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              s("dl", lo, [
                i[11] || (i[11] = s("dt", null, "Reference", -1)),
                s("dd", to, [
                  s("span", so, y(Z.value), 1),
                  t(a(B), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": g.value ? "Reference copied" : "Copy reference",
                    title: g.value ? "Reference copied" : "Copy reference",
                    onClick: H
                  }, {
                    icon: A(() => [
                      t(a(N), {
                        icon: g.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                i[12] || (i[12] = s("dt", null, "File", -1)),
                s("dd", null, y(m.value.asset?.filename) + " · " + y(a(Pe)(m.value.asset?.size)), 1),
                i[13] || (i[13] = s("dt", null, "Source", -1)),
                s("dd", null, [
                  t(wa, { resource: m.value }, null, 8, ["resource"])
                ])
              ]),
              s("section", io, [
                i[14] || (i[14] = s("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                ee.value.length ? (l(), n(F, { key: 1 }, [
                  s("ul", oo, [
                    (l(!0), n(F, null, ce(ee.value, (U) => (l(), n("li", {
                      key: U.name
                    }, [
                      t(a(B), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (Q) => a(r)({ name: "resource", kind: "message", resource: U.name, section: "content" })
                      }, {
                        default: A(() => [
                          t(a(N), {
                            icon: a(be).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          U.title === void 0 ? (l(), O(a(Ae), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", ro, y(U.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  V.value ? (l(), n("div", uo, [
                    s("iframe", {
                      sandbox: "",
                      srcdoc: V.value,
                      title: "How " + m.value.title + " looks in " + (a(v).title("message", c.value) ?? "")
                    }, null, 8, co)
                  ])) : S("", !0)
                ], 64)) : (l(), n("p", no, "No message shows " + y(m.value.title) + " with its sample values.", 1))
              ]),
              s("section", vo, [
                i[15] || (i[15] = s("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                T.value.length ? (l(), n("ol", fo, [
                  (l(!0), n(F, null, ce(T.value, (U) => (l(), n("li", {
                    key: U.seq,
                    class: "mail-history-row"
                  }, [
                    s("div", bo, [
                      s("div", yo, [
                        s("span", po, [
                          Y("Version " + y(U.version) + " · " + y(a(ba)[U.action]) + " ", 1),
                          U.version === m.value.revision ? (l(), O(a(Te), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : S("", !0)
                        ]),
                        s("span", go, y(a(we)(U.author_label, U.author)) + " · " + y(a(Fe)(U.created_at)), 1)
                      ]),
                      a(Ma)(U) && U.version !== m.value.revision ? (l(), O(a(B), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: f.value === U.seq,
                        disabled: f.value !== void 0,
                        onClick: (Q) => I("restore", U)
                      }, {
                        icon: A(() => [
                          t(a(N), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : S("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", mo, y(m.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : S("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      m.value ? (l(), O(al, {
        key: 0,
        visible: j.value,
        replace: m.value,
        onClose: i[6] || (i[6] = (U) => j.value = !1),
        onDone: i[7] || (i[7] = (U) => E())
      }, null, 8, ["visible", "replace"])) : S("", !0),
      t(Xa, {
        refusal: L.value,
        onClose: i[8] || (i[8] = (U) => L.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), ko = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, $o = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, wo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, _o = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, xo = { class: "mail-toolbar" }, Co = {
  class: "mail-count",
  role: "status"
}, Vo = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, So = { class: "mail-sub" }, To = { class: "mail-mono-block" }, Ro = { class: "mail-muted" }, Uo = { class: "mail-muted" }, Ao = /* @__PURE__ */ te({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const d = e, { go: o, upload: u } = fe(), v = $(""), r = $("");
    let w;
    X(v, (L) => {
      clearTimeout(w), w = setTimeout(() => {
        r.value = L.trim();
      }, 250);
    });
    const m = pe([]), T = $(!0), C = $(!1), c = $(!1), h = $(""), R = $(""), b = Ve();
    async function k(L = !1) {
      const z = b();
      T.value = !0;
      try {
        const E = await se.assets(r.value || void 0);
        if (!z()) return;
        m.value = E, h.value = R.value = "", c.value = !1, C.value = !0;
      } catch (E) {
        if (!z()) return;
        c.value = He(E);
        const ee = c.value ? "" : ne(E, "Images could not be loaded.");
        L && C.value && !c.value ? R.value = ee : h.value = ee;
      } finally {
        z() && (T.value = !1);
      }
    }
    X(r, () => {
      k();
    }), la(() => k(C.value)), Ue("mail.library", () => {
      k(C.value);
    });
    function p(L) {
      const z = L.used_by?.messages;
      return z ? ye(z, "message") : "—";
    }
    const f = M(() => m.value.reduce((L, z) => L + (z.asset?.size ?? 0), 0)), g = M(() => `${ye(m.value.length, "image")} · ${Pe(f.value)}`);
    function _(L) {
      const z = L.asset;
      return z ? Pe(z.size) : "";
    }
    function j(L) {
      o({ name: "library", section: "assets", asset: L.name });
    }
    return (L, z) => (l(), n(F, null, [
      t(qe, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: A(() => [
          t(a(B), {
            label: "Upload image",
            onClick: z[0] || (z[0] = (E) => a(u)())
          }, {
            icon: A(() => [
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
      c.value ? (l(), n("p", ko, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        z[7] || (z[7] = Y("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : h.value ? (l(), n("div", $o, [
        s("span", null, y(h.value), 1),
        t(a(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: z[1] || (z[1] = (E) => k())
        })
      ])) : S("", !0),
      R.value ? (l(), n("div", wo, [
        s("span", null, y(R.value) + " The list shows what was loaded before.", 1),
        t(a(B), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: z[2] || (z[2] = (E) => k(!0))
        })
      ])) : T.value && !C.value ? (l(), n("p", _o, [
        t(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        z[8] || (z[8] = Y("Loading images…", -1))
      ])) : C.value && !m.value.length && !r.value ? (l(), O(ha, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: z[3] || (z[3] = (E) => a(u)())
      })) : C.value ? (l(), n(F, { key: 5 }, [
        s("div", xo, [
          t(a(pa), { class: "mail-search" }, {
            default: A(() => [
              t(a(ga), null, {
                default: A(() => [
                  t(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(de), {
                modelValue: v.value,
                "onUpdate:modelValue": z[4] || (z[4] = (E) => v.value = E),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          s("span", Co, y(g.value), 1)
        ]),
        m.value.length ? (l(), O(a(ya), {
          key: 1,
          value: m.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: z[5] || (z[5] = (E) => j(E.data))
        }, {
          default: A(() => [
            t(a(ue), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: A(({ data: E }) => [
                t(el, {
                  name: E.name,
                  revision: E.revision,
                  asset: E.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            t(a(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: A(({ data: E }) => [
                t(a(B), {
                  link: "",
                  class: "mail-name",
                  label: E.title,
                  onClick: Re((ee) => j(E), ["stop"])
                }, null, 8, ["label", "onClick"]),
                s("span", So, [
                  s("span", To, y(E.name), 1),
                  E.asset?.filename ? (l(), n(F, { key: 0 }, [
                    Y(" · " + y(E.asset.filename), 1)
                  ], 64)) : S("", !0)
                ])
              ]),
              _: 1
            }),
            t(a(ue), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: E }) => [
                s("span", Ro, y(_(E)), 1)
              ]),
              _: 1
            }),
            t(a(ue), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: A(({ data: E }) => [
                s("span", null, y(p(E)), 1)
              ]),
              _: 1
            }),
            t(a(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: A(({ data: E }) => [
                t(wa, { resource: E }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            t(a(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: A(({ data: E }) => [
                s("span", Uo, y(E.state === "original" ? "—" : a(Oa)(E.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", Vo, "Nothing matches. Try another name."))
      ], 64)) : S("", !0),
      t(ho, {
        name: d.asset,
        onClose: z[6] || (z[6] = (E) => a(o)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), jo = { class: "kx-modal-head-icon" }, Lo = { class: "kx-modal-head-text" }, Io = { class: "kx-modal-head-title" }, No = { class: "kx-modal-head-sub" }, Eo = ["id"], zo = ["disabled", "inert"], Do = {
  key: 0,
  class: "mail-field"
}, Oo = {
  key: 1,
  class: "mail-field"
}, Mo = ["for"], Po = { class: "mail-field" }, Bo = ["for"], qo = ["for"], Ho = ["id"], Fo = { class: "mail-field" }, Jo = ["for"], Ko = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Se = "\0blank", Wo = /* @__PURE__ */ te({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, u = d, { library: v, go: r } = fe(), w = $("message"), m = $(""), T = $(""), C = $(""), c = $(""), h = $(!1), R = $(!1), b = $(""), k = $(""), p = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, f = ["message", "base", "part"].map((H) => ({ value: H, label: me[H] })), g = M(() => !!o.intent.from), _ = M(() => [
      { value: Se, label: "Blank" },
      ...v.ofKind(w.value).map((H) => ({ value: H.name, label: H.title }))
    ]), j = M(() => m.value === Se || !!v.find(w.value, m.value));
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
    const z = M(() => w.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function E() {
      return k.value = "", C.value ? qa.test(C.value) ? v.find(w.value, C.value) && (k.value = `A ${me[w.value].toLowerCase()} with this reference already exists. Choose another.`) : k.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : k.value = "Enter a reference.", !k.value;
    }
    async function ee() {
      if (!(R.value || !T.value.trim() || !j.value || !E())) {
        R.value = !0, b.value = "";
        try {
          const H = m.value === Se ? await se.create(Xt(w.value, C.value, T.value.trim(), c.value.trim())) : await se.copy({
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
          R.value = !1;
        }
      }
    }
    const ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, Z = M(() => o.intent.from ? `Duplicate ${v.title(o.intent.from.kind, o.intent.from.name) ?? ""}`.trim() : `New ${me[w.value].toLowerCase()}`);
    return (H, I) => (l(), O(a(je), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !R.value,
      "close-on-escape": !R.value,
      class: "mail-dialog",
      pt: ae,
      "aria-label": Z.value,
      "onUpdate:visible": I[6] || (I[6] = (V) => {
        V || u("close");
      })
    }, {
      header: A(() => [
        s("span", jo, [
          t(a(N), {
            icon: a(be)[w.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        s("span", Lo, [
          s("span", Io, y(Z.value), 1),
          s("span", No, y(m.value === Se ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: A(() => [
        t(a(B), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: R.value,
          onClick: I[5] || (I[5] = (V) => u("close"))
        }, null, 8, ["disabled"]),
        t(a(B), {
          label: "Create " + a(me)[w.value].toLowerCase(),
          type: "submit",
          form: p.hint,
          loading: R.value,
          disabled: !T.value.trim() || !j.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: A(() => [
        s("form", {
          id: p.hint,
          class: "mail-form",
          onSubmit: Re(ee, ["prevent"])
        }, [
          s("fieldset", {
            class: "mail-fieldset",
            disabled: R.value,
            inert: R.value || void 0
          }, [
            g.value ? S("", !0) : (l(), n("div", Do, [
              I[7] || (I[7] = s("span", { class: "mail-field-label" }, "Kind", -1)),
              t(a(_e), {
                modelValue: w.value,
                "onUpdate:modelValue": I[0] || (I[0] = (V) => w.value = V),
                options: a(f),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            g.value ? S("", !0) : (l(), n("div", Oo, [
              s("label", {
                class: "mail-field-label",
                for: p.source
              }, "Start from", 8, Mo),
              t(a(Ee), {
                "model-value": m.value,
                "input-id": p.source,
                options: _.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !a(v).ready(w.value),
                "onUpdate:modelValue": L
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            s("div", Po, [
              s("label", {
                class: "mail-field-label",
                for: p.title
              }, "Name", 8, Bo),
              t(a(de), {
                id: p.title,
                modelValue: T.value,
                "onUpdate:modelValue": I[1] || (I[1] = (V) => T.value = V),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            s("div", {
              class: re(["mail-field", { "mail-field-invalid": k.value }])
            }, [
              s("label", {
                class: "mail-field-label",
                for: p.reference
              }, "Reference", 8, qo),
              t(a(de), {
                id: p.reference,
                modelValue: C.value,
                "onUpdate:modelValue": I[2] || (I[2] = (V) => C.value = V),
                class: "mail-mono-input",
                invalid: !!k.value,
                "aria-describedby": p.reference + "-hint",
                onInput: I[3] || (I[3] = (V) => h.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              s("small", {
                id: p.reference + "-hint",
                class: re(k.value ? "mail-field-error" : "mail-field-hint")
              }, y(k.value || z.value), 11, Ho)
            ], 2),
            s("div", Fo, [
              s("label", {
                class: "mail-field-label",
                for: p.description
              }, "Description", 8, Jo),
              t(a(da), {
                id: p.description,
                modelValue: c.value,
                "onUpdate:modelValue": I[4] || (I[4] = (V) => c.value = V),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, zo),
          b.value ? (l(), n("p", Ko, y(b.value), 1)) : S("", !0)
        ], 40, Eo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Yo = { class: "mail-drawer-head" }, Go = { class: "mail-drawer-title" }, Zo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Qo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Xo = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, er = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, ar = {
  key: 0,
  class: "kx-notice error mail-failure"
}, lr = { class: "mail-failure-body" }, tr = { key: 0 }, sr = { key: 1 }, ir = {
  key: 2,
  class: "mail-failure-done",
  role: "status"
}, nr = {
  key: 3,
  class: "mail-sub"
}, or = {
  key: 4,
  class: "mail-sub"
}, rr = {
  key: 5,
  class: "mail-field-error",
  role: "alert"
}, ur = { key: 6 }, dr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, cr = { class: "mail-facts mail-card" }, vr = { key: 2 }, mr = {
  key: 0,
  class: "mail-sub"
}, fr = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, br = { class: "mail-timeline" }, yr = { class: "mail-muted" }, pr = { class: "mail-facts" }, gr = { class: "mail-mono-block" }, hr = /* @__PURE__ */ te({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const o = e, u = d, { library: v, go: r, capabilities: w, delivery: m } = fe();
    xe(() => !!o.messageId);
    const T = $();
    X(() => !!o.messageId, (x) => {
      x && Me(() => T.value?.focus());
    }, { immediate: !0 });
    const C = M(() => !!h.value?.last_error && xl.has(h.value.last_error.code)), c = M(() => {
      const x = h.value?.last_error;
      if (!x) return;
      const i = m.value?.driver && m.value.driver.id === h.value?.driver_id ? m.value.driver.label : "The delivery service";
      return (w.value?.administer_delivery ? Cl(x.code, i) : void 0) ?? { lead: "", next: x.message };
    }), h = pe(), R = $(!1), b = $(!1), k = $(!1), p = $(""), f = $(""), g = $(!1), _ = $(), j = $(!1), L = Ve();
    async function z() {
      const x = o.messageId, i = L();
      if (!x) {
        h.value = void 0;
        return;
      }
      R.value = !0;
      try {
        const U = await ea.get(x);
        if (!i()) return;
        h.value = U, p.value = "", b.value = k.value = !1;
      } catch (U) {
        if (!i()) return;
        h.value = void 0, b.value = Xe(U), k.value = He(U), p.value = b.value || k.value ? "" : ne(U, "This message could not be loaded.");
      } finally {
        i() && (R.value = !1);
      }
    }
    X(() => o.messageId, (x) => {
      _.value = void 0, f.value = "", j.value = !1, x !== h.value?.message_id && (h.value = void 0), z();
    }, { immediate: !0 }), Ue("mail.activity", () => {
      o.messageId && z();
    });
    async function E() {
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
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(x.message_id)}`), j.value = !0;
        } catch {
          j.value = !1;
        }
    }
    const ae = M(() => {
      const x = h.value?.template;
      return x ? v.title("message", x) : "";
    }), Z = M(() => !!h.value?.template && !!v.find("message", h.value.template)), H = M(() => {
      const x = h.value;
      if (!x) return [];
      const i = [{ label: "Accepted for delivery", at: x.created_at }];
      return x.status === "queued" && x.next_attempt_at && i.push({ label: x.attempts ? `Attempt ${x.attempts} did not go through; trying again` : "Next delivery attempt", at: x.next_attempt_at }), x.sent_at ? i.push({ label: x.attempts > 1 ? `Sent after ${x.attempts} attempts` : "Sent", at: x.sent_at }) : x.status === "failed" && x.finished_at && i.push({ label: x.attempts > 1 ? `Failed after ${x.attempts} attempts` : "Failed", at: x.finished_at }), i;
    }), I = M(() => (h.value?.attachments ?? []).map((x) => x.filename || "Attachment")), V = M(() => {
      const x = h.value;
      return x ? [
        { label: "Message ID", value: x.message_id },
        { label: "Delivery service", value: w.value?.administer_delivery ? x.driver_id : void 0 },
        { label: "Service message ID", value: x.provider_message_id },
        { label: "Error code", value: x.last_error?.code },
        { label: "Service response", value: x.last_error?.provider_detail }
      ].filter((i) => !!i.value) : [];
    });
    return (x, i) => (l(), O(a(Ja), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !g.value,
      "close-on-escape": !g.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": i[6] || (i[6] = (U) => {
        U || u("close");
      })
    }, {
      default: A(() => [
        s("div", {
          ref_key: "drawer",
          ref: T,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          s("header", Yo, [
            s("div", Go, [
              h.value ? (l(), O(a(Te), {
                key: 0,
                severity: a(Fa)[h.value.status],
                value: a(Ha)[h.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : S("", !0),
              s("h2", null, y(h.value?.subject ?? "Message"), 1)
            ]),
            t(a(B), {
              text: "",
              severity: "secondary",
              disabled: !h.value,
              "aria-label": j.value ? "Link copied" : "Copy link",
              title: j.value ? "Link copied" : "Copy link",
              onClick: ee
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: j.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            t(a(B), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: g.value,
              onClick: i[0] || (i[0] = (U) => u("close"))
            }, {
              icon: A(() => [
                t(a(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          R.value && !h.value ? (l(), n("p", Zo, [
            t(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            i[7] || (i[7] = Y("Loading message…", -1))
          ])) : b.value ? (l(), n("p", Qo, [
            t(a(N), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            i[8] || (i[8] = Y("This message is no longer in Activity.", -1))
          ])) : k.value ? (l(), n("p", Xo, [
            t(a(N), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            i[9] || (i[9] = Y("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : p.value ? (l(), n("div", er, [
            s("span", null, y(p.value), 1),
            t(a(B), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: i[1] || (i[1] = (U) => z())
            })
          ])) : S("", !0),
          h.value ? (l(), n(F, { key: 4 }, [
            h.value.status === "failed" ? (l(), n("div", ar, [
              t(a(N), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              s("div", lr, [
                i[12] || (i[12] = s("strong", null, "This message was not delivered.", -1)),
                c.value?.lead ? (l(), n("span", tr, y(c.value.lead), 1)) : S("", !0),
                c.value ? (l(), n("span", sr, y(c.value.next), 1)) : S("", !0),
                _.value ? (l(), n("p", ir, [
                  i[10] || (i[10] = Y(" Sent again as a new message. ", -1)),
                  t(a(B), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: i[2] || (i[2] = (U) => a(r)({ name: "activity", message: _.value.message_id }))
                  })
                ])) : C.value ? (l(), n("p", nr, [
                  i[11] || (i[11] = Y("Sending it again fails the same way until the delivery settings or the account with the service change. ", -1)),
                  a(w)?.administer_delivery ? (l(), O(a(B), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: i[3] || (i[3] = (U) => a(Ce).navigate("/system/settings/mail"))
                  })) : S("", !0)
                ])) : h.value.can_resend ? S("", !0) : (l(), n("p", or, "It cannot be sent again because its content was not kept.")),
                f.value ? (l(), n("p", rr, y(f.value), 1)) : S("", !0),
                a(w)?.send && h.value.can_resend && !_.value && !C.value ? (l(), n("div", ur, [
                  t(a(B), {
                    label: "Send again",
                    loading: g.value,
                    onClick: E
                  }, {
                    icon: A(() => [
                      t(a(N), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : S("", !0)
              ])
            ])) : h.value.status === "queued" ? (l(), n("p", dr, [
              t(a(N), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              i[13] || (i[13] = Y("Waiting to be delivered. ", -1))
            ])) : S("", !0),
            s("dl", cr, [
              i[19] || (i[19] = s("dt", null, "To", -1)),
              s("dd", null, y(h.value.to.join(", ")), 1),
              h.value.cc?.length ? (l(), n(F, { key: 0 }, [
                i[14] || (i[14] = s("dt", null, "Cc", -1)),
                s("dd", null, y(h.value.cc.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.bcc?.length ? (l(), n(F, { key: 1 }, [
                i[15] || (i[15] = s("dt", null, "Bcc", -1)),
                s("dd", null, y(h.value.bcc.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.reply_to ? (l(), n(F, { key: 2 }, [
                i[16] || (i[16] = s("dt", null, "Reply-to", -1)),
                s("dd", null, y(h.value.reply_to), 1)
              ], 64)) : S("", !0),
              i[20] || (i[20] = s("dt", null, "Template", -1)),
              s("dd", null, [
                ae.value === void 0 ? (l(), O(a(Ae), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : Z.value ? (l(), O(a(B), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: ae.value,
                  onClick: i[4] || (i[4] = (U) => a(r)({ name: "resource", kind: "message", resource: h.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", vr, y(ae.value || "Written directly"), 1))
              ]),
              i[21] || (i[21] = s("dt", null, "Sent by", -1)),
              s("dd", null, [
                Y(y(a(we)(h.value.sender_label, h.value.sender)), 1),
                h.value.origin ? (l(), n("span", mr, y(a(ta)(h.value.origin)), 1)) : S("", !0)
              ]),
              I.value.length ? (l(), n(F, { key: 3 }, [
                i[17] || (i[17] = s("dt", null, "Attachments", -1)),
                s("dd", null, y(I.value.join(", ")), 1)
              ], 64)) : S("", !0),
              h.value.resend_of ? (l(), n(F, { key: 4 }, [
                i[18] || (i[18] = s("dt", null, "Sent again from", -1)),
                s("dd", null, [
                  t(a(B), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: i[5] || (i[5] = (U) => a(r)({ name: "activity", message: h.value.resend_of }))
                  })
                ])
              ], 64)) : S("", !0)
            ]),
            s("section", fr, [
              i[22] || (i[22] = s("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              s("ol", br, [
                (l(!0), n(F, null, ce(H.value, (U) => (l(), n("li", {
                  key: U.label
                }, [
                  s("span", null, y(U.label), 1),
                  s("span", yr, y(a(Fe)(U.at)), 1)
                ]))), 128))
              ])
            ]),
            V.value.length ? (l(), O(Qa, {
              key: 2,
              label: "Technical details"
            }, {
              default: A(() => [
                s("dl", pr, [
                  (l(!0), n(F, null, ce(V.value, (U) => (l(), n(F, {
                    key: U.label
                  }, [
                    s("dt", null, y(U.label), 1),
                    s("dd", gr, y(U.value), 1)
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
}), kr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, $r = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, wr = { class: "mail-health-text" }, _r = { class: "mail-toolbar" }, xr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, Cr = {
  key: 1,
  class: "mail-muted mail-search-window",
  role: "status"
}, Vr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Sr = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Tr = {
  key: 4,
  class: "kx-loading",
  role: "status"
}, Rr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Ur = { class: "mail-sub" }, Ar = {
  key: 0,
  class: "mail-sub"
}, jr = { class: "mail-muted" }, Lr = {
  key: 2,
  class: "mail-more"
}, Ir = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Nr = /* @__PURE__ */ te({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const d = e, { library: o, go: u } = fe();
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
    ], h = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], R = M(() => o.ofKind("message").map((le) => ({ label: le.title, value: le.name }))), b = pe([]), k = $(), p = $(!0), f = $(!1), g = $(!1), _ = $(!1), j = $(""), L = $(""), z = $(""), E = Ve();
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
      const W = E();
      p.value = !0;
      try {
        const G = await ea.list(ee());
        if (!W()) return;
        b.value = G.items, k.value = G.next_cursor, H.value = G.total, I.value = !!G.total_is_lower_bound, V.value = G.failed_today ?? 0, j.value = L.value = z.value = "", _.value = !1, f.value = !0;
      } catch (G) {
        if (!W()) return;
        _.value = He(G);
        const ge = _.value ? "" : ne(G, "Activity could not be loaded.");
        le && f.value && !_.value ? z.value = ge : j.value = ge;
      } finally {
        W() && (p.value = !1);
      }
    }
    async function Z() {
      if (p.value || !k.value || g.value) return;
      const le = E();
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
    const x = M(() => {
      const le = H.value ?? b.value.length;
      return I.value ? `${le.toLocaleString()}+ messages` : ye(le, "message");
    }), i = M(() => I.value && !!T.value), U = M(() => V.value ? `${ye(V.value, "message")} failed today.` : "");
    function Q(le) {
      return le ? o.title("message", le) : "—";
    }
    function q(le) {
      u({ name: "activity", message: le.message_id });
    }
    function K() {
      u({ name: "activity", template: r.value || void 0 });
    }
    return (le, W) => (l(), n(F, null, [
      t(qe, {
        title: "Activity",
        description: "Every email sent from this workspace in the last 30 days."
      }),
      _.value ? (l(), n("p", kr, [
        t(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        W[8] || (W[8] = Y("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(F, { key: 1 }, [
        U.value ? (l(), n("p", $r, [
          t(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          s("span", wr, [
            s("strong", null, y(U.value), 1),
            Y(" " + y(v.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          v.value !== "failed" ? (l(), O(a(B), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[0] || (W[0] = (G) => v.value = "failed")
          })) : S("", !0)
        ])) : S("", !0),
        s("div", _r, [
          t(a(_e), {
            modelValue: v.value,
            "onUpdate:modelValue": W[1] || (W[1] = (G) => v.value = G),
            options: c,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          t(a(Ee), {
            modelValue: r.value,
            "onUpdate:modelValue": W[2] || (W[2] = (G) => r.value = G),
            options: R.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          t(a(Ee), {
            modelValue: w.value,
            "onUpdate:modelValue": W[3] || (W[3] = (G) => w.value = G),
            options: h,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          t(a(pa), { class: "mail-search" }, {
            default: A(() => [
              t(a(ga), null, {
                default: A(() => [
                  t(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              t(a(de), {
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
          f.value ? (l(), n("span", xr, y(x.value), 1)) : S("", !0)
        ]),
        i.value ? (l(), n("p", Cr, " Search looks through the newest 10,000 messages that match the other filters. Narrow the period or the message to search further back. ")) : S("", !0),
        j.value ? (l(), n("div", Vr, [
          s("span", null, y(j.value), 1),
          t(a(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[5] || (W[5] = (G) => ae())
          })
        ])) : S("", !0),
        z.value ? (l(), n("div", Sr, [
          s("span", null, y(z.value) + " The list shows what was loaded before.", 1),
          t(a(B), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: W[6] || (W[6] = (G) => ae(!0))
          })
        ])) : p.value && !f.value ? (l(), n("p", Tr, [
          t(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          W[9] || (W[9] = Y("Loading activity…", -1))
        ])) : f.value ? (l(), n(F, { key: 5 }, [
          b.value.length ? (l(), O(a(ya), {
            key: 1,
            value: b.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: W[7] || (W[7] = (G) => q(G.data))
          }, {
            default: A(() => [
              t(a(ue), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: A(({ data: G }) => [
                  t(a(Te), {
                    severity: a(Fa)[G.status],
                    value: a(Ha)[G.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              t(a(ue), { header: "Message" }, {
                body: A(({ data: G }) => [
                  t(a(B), {
                    link: "",
                    class: "mail-name",
                    label: G.subject,
                    onClick: Re((ge) => q(G), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  s("span", Ur, y(a(Vl)(G.to)), 1)
                ]),
                _: 1
              }),
              t(a(ue), { header: "Template" }, {
                body: A(({ data: G }) => [
                  Q(G.template) === void 0 ? (l(), O(a(Ae), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(F, { key: 1 }, [
                    Y(y(Q(G.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              t(a(ue), { header: "Sent by" }, {
                body: A(({ data: G }) => [
                  s("span", null, y(a(we)(G.sender_label, G.sender)), 1),
                  G.origin ? (l(), n("span", Ar, y(a(ta)(G.origin)), 1)) : S("", !0)
                ]),
                _: 1
              }),
              t(a(ue), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: A(({ data: G }) => [
                  s("span", jr, y(a(Sl)(G.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", Rr, y(T.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          k.value ? (l(), n("div", Lr, [
            L.value ? (l(), n("span", Ir, y(L.value), 1)) : S("", !0),
            t(a(B), {
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
      t(hr, {
        "message-id": e.message,
        onClose: K
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Er = { class: "kx-shell kx-settings-shell mail-admin" }, zr = { class: "kx-main" }, Dr = /* @__PURE__ */ te({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: d }) {
    const o = e, u = d, v = pe(Ia(o.route ?? "")), r = M(() => v.value), w = $(!1);
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
    function C(i, U) {
      return i.name === "resource" && U.name === "resource" && i.kind === U.kind && i.resource === U.resource;
    }
    async function c(i) {
      const U = Ie(i);
      !C(r.value, i) && !await T() || (C(r.value, i) || (w.value = !1), v.value = i, o.route !== void 0 && U !== o.route && u("navigate", U));
    }
    X(() => o.route, async (i, U) => {
      if (i === void 0) return;
      const Q = Ia(i);
      if (Ie(Q) !== Ie(v.value)) {
        if (!C(v.value, Q) && w.value) {
          if (!await T()) {
            U !== void 0 && o.route === i && u("navigate", Ie(v.value));
            return;
          }
          w.value = !1;
        }
        o.route === i && (v.value = Q);
      }
    });
    const h = at(), R = hl();
    X(R, (i, U) => {
      U === !1 && i === !0 && h.refresh();
    });
    const b = $(), k = $();
    async function p() {
      try {
        b.value = await Tl.capabilities();
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
    function j(i) {
      _.value = i, f.value = !0;
    }
    gl(Ka, {
      library: h,
      capabilities: b,
      delivery: k,
      go: (i) => {
        c(i);
      },
      create: j,
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
    }, z = {
      content: (i) => be[i],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, E = M(() => !!b.value?.administer_delivery), ee = M(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: be.message },
        { value: "bases", label: "Base templates", icon: be.base },
        { value: "parts", label: "Parts", icon: be.part },
        { value: "assets", label: "Images", icon: be.asset }
      ] },
      ...E.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ae = { value: "all", label: "All resources", icon: "tabler:table" }, Z = $("");
    X(() => Ie(r.value), () => {
      Z.value = "";
    });
    const H = M(() => {
      const i = r.value;
      if (i.name === "resource")
        return {
          leading: { value: "all", label: "All " + fa[i.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: Z.value || " ", items: Ga(i.kind).map((U) => ({
            value: U,
            label: L[U](i.kind),
            icon: z[U](i.kind)
          })) }]
        };
    }), I = M(() => {
      const i = r.value;
      return i.name === "resource" ? i.section : i.name === "activity" ? "activity" : i.section;
    });
    function V(i) {
      const U = r.value;
      if (U.name === "resource") {
        c(i === "all" ? { name: "library", section: ca(U.kind) } : { ...U, section: i });
        return;
      }
      c(i === "activity" ? { name: "activity" } : { name: "library", section: i });
    }
    const x = $();
    return X(() => Ie(r.value), () => {
      x.value?.scrollTo({ top: 0 });
    }), (i, U) => (l(), n("main", Er, [
      t(et, {
        label: "Mail sections",
        title: "Mail",
        value: I.value,
        groups: H.value ? H.value.groups : ee.value,
        "leading-item": H.value ? H.value.leading : ae,
        "onUpdate:value": V
      }, null, 8, ["value", "groups", "leading-item"]),
      s("div", zr, [
        s("div", {
          ref_key: "main",
          ref: x,
          class: re(["kx-main-scroll mail-main", { "mail-main-wide": r.value.name === "resource" && r.value.section === "content" }])
        }, [
          r.value.name === "resource" ? (l(), O(_n, {
            key: r.value.kind + "/" + r.value.resource,
            kind: r.value.kind,
            name: r.value.resource,
            section: r.value.section
          }, null, 8, ["kind", "name", "section"])) : r.value.name === "activity" ? (l(), n(F, { key: 1 }, [
            E.value ? (l(), O(Nr, {
              key: 0,
              message: r.value.message,
              template: r.value.template
            }, null, 8, ["message", "template"])) : b.value ? (l(), n(F, { key: 1 }, [
              t(qe, {
                title: "Activity",
                description: ""
              }),
              U[2] || (U[2] = s("p", {
                class: "kx-notice warn mail-block",
                role: "alert"
              }, "Ask an administrator to grant you access to mail delivery.", -1))
            ], 64)) : S("", !0)
          ], 64)) : r.value.section === "assets" ? (l(), O(Ao, {
            key: 2,
            asset: r.value.asset
          }, null, 8, ["asset"])) : (l(), O(Yt, {
            key: 3,
            section: r.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      t(Wo, {
        visible: f.value,
        intent: _.value,
        onClose: U[0] || (U[0] = (Q) => f.value = !1)
      }, null, 8, ["visible", "intent"]),
      t(al, {
        visible: g.value,
        onClose: U[1] || (U[1] = (Q) => g.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), Or = /* @__PURE__ */ te({
  __name: "MailAdminRoot",
  setup(e) {
    const d = kl(), o = $l();
    return (u, v) => (l(), O(Dr, {
      route: a(d).route,
      onNavigate: v[0] || (v[0] = (r) => a(o)("navigate", { route: r })),
      onDirtyChange: v[1] || (v[1] = (r) => a(o)("dirty-change", { dirty: r }))
    }, null, 8, ["route"]));
  }
}), Mr = Ul(Or, { type: "object", properties: { route: { type: "string", default: "" } } });
Ll(import.meta.url, Mr);
//# sourceMappingURL=admin.js.map
