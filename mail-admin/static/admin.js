import { defineComponent as te, useId as ve, openBlock as l, createElementBlock as n, unref as a, normalizeClass as ne, createElementVNode as t, createTextVNode as G, toDisplayString as h, createCommentVNode as T, renderSlot as ze, computed as P, createBlock as O, resolveDynamicComponent as nl, normalizeProps as ol, guardReactiveProps as rl, createSlots as fa, withCtx as j, Fragment as Y, renderList as me, inject as ul, ref as _, shallowRef as ge, onBeforeUnmount as Be, onMounted as dl, createVNode as s, watch as X, reactive as cl, nextTick as ea, withModifiers as je, useModel as za, mergeModels as ua, defineAsyncComponent as da, withDirectives as vl, vShow as ml, provide as fl } from "vue";
import { u as la, a as bl, b as yl, c as pl } from "./wc-runtime-CYKoUhqs.js";
import "pinia";
import { u as Ea, l as se, d as ie, i as qe, k as be, A as gl, e as Ue, a as we, p as pe, b as ke, _ as ta, c as ba, f as ye, s as Oa, g as Fe, h as ya, j as Je, o as sa, m as hl, n as kl, q as Pa, r as Ma, t as aa, v as Da, w as Ba, x as qa, y as Ha, z as De, B as $l, C as wl, D as _l, E as xl, F as Cl, G as Vl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-DyE7BiXg.js";
import { host as Re, api as Sl, on as Tl, define as Rl } from "@wippy-fe/proxy";
import { Icon as N } from "@iconify/vue";
import Ce from "primevue/skeleton";
import D from "primevue/button";
import de from "primevue/column";
import pa from "primevue/datatable";
import ga from "primevue/iconfield";
import ha from "primevue/inputicon";
import ce from "primevue/inputtext";
import $e from "primevue/selectbutton";
import Ae from "primevue/dialog";
import Ul from "primevue/progressbar";
import Ee from "primevue/tag";
import Oe from "primevue/select";
import jl from "primevue/accordion";
import Al from "primevue/accordioncontent";
import Il from "primevue/accordionheader";
import Ll from "primevue/accordionpanel";
import Nl from "primevue/menu";
import zl from "primevue/checkbox";
import El from "primevue/inputnumber";
import ca from "primevue/textarea";
import Fa from "primevue/drawer";
import Ol from "primevue/fileupload";
const Pl = ["aria-labelledby"], Ml = { class: "kx-railhead" }, Dl = ["id"], Bl = { key: 0 }, ql = { class: "kx-railhead-acts" }, Hl = { class: "kx-rail-body" }, Fl = /* @__PURE__ */ te({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const v = ve();
    return (r, c) => (l(), n("aside", {
      class: ne(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(v)
    }, [
      t("div", Ml, [
        t("span", {
          id: a(v),
          class: "kx-railhead-title"
        }, [
          G(h(e.title), 1),
          e.count !== void 0 ? (l(), n("b", Bl, h(e.count), 1)) : T("", !0)
        ], 8, Dl),
        t("div", ql, [
          ze(r.$slots, "actions")
        ])
      ]),
      ze(r.$slots, "toolbar"),
      t("div", Hl, [
        ze(r.$slots, "default")
      ])
    ], 10, Pl));
  }
}), Jl = ["aria-label"], Wl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Kl = ["aria-current", "onClick"], Yl = { class: "kx-settings-rail-label" }, Gl = /* @__PURE__ */ te({
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
    const v = e, r = P(() => v.leadingItem ? [{ items: [v.leadingItem] }, ...v.groups] : v.groups);
    function c(y) {
      const o = [...y.currentTarget.querySelectorAll(".kx-settings-rail-item")], k = o.indexOf(y.target);
      if (k < 0) return;
      let b;
      switch (y.key) {
        case "ArrowDown":
        case "ArrowRight":
          b = (k + 1) % o.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          b = (k + o.length - 1) % o.length;
          break;
        case "Home":
          b = 0;
          break;
        case "End":
          b = o.length - 1;
          break;
        default:
          return;
      }
      y.preventDefault(), o[b]?.focus();
    }
    return (y, o) => (l(), O(nl(e.title ? Fl : "div"), ol(rl(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), fa({
      default: j(() => [
        t("nav", {
          class: ne(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: c
        }, [
          (l(!0), n(Y, null, me(r.value, (k, b) => (l(), n("div", {
            key: k.items[0]?.value ?? b,
            class: ne(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && b === 0 }])
          }, [
            k.heading ? (l(), n("div", Wl, h(k.heading), 1)) : T("", !0),
            (l(!0), n(Y, null, me(k.items, (x) => (l(), n("button", {
              key: x.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": x.value === e.value ? "true" : void 0,
              onClick: (V) => y.$emit("update:value", x.value)
            }, [
              x.icon ? (l(), O(a(N), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: x.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : T("", !0),
              t("span", Yl, h(x.label), 1)
            ], 8, Kl))), 128))
          ], 2))), 128))
        ], 42, Jl)
      ]),
      _: 2
    }, [
      e.title && y.$slots.actions ? {
        name: "actions",
        fn: j(() => [
          ze(y.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Ja = Symbol("mail-admin");
function fe() {
  const e = ul(Ja);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function ka(e) {
  const { kind: v, name: r, title: c, description: y, state: o, revision: k, origin: b, origin_label: x, base: V, author: i, author_label: U, updated_at: S, used_by: R } = e, C = R && {
    messages: R.messages?.length,
    recent_sources: R.recent_senders?.length
  };
  return { kind: v, name: r, title: c, description: y, state: o, revision: k, origin: b, origin_label: x, base: V, author: i, author_label: U, updated_at: S, used_by: C };
}
function Zl() {
  const e = Object.fromEntries(["message", "base", "part", "asset"].map((u) => [u, { rows: ge([]), loaded: _(!1), loading: _(!1), error: _(""), users: 0, stale: !1 }])), v = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  function c(u) {
    const d = v.get(u);
    if (d) return d;
    const m = e[u];
    m.loading.value = !0;
    const $ = (async () => {
      try {
        const A = [];
        let I;
        do {
          const M = await se.page({ kind: u, cursor: I });
          A.push(...M.items), I = M.next_cursor;
        } while (I);
        m.rows.value = A, m.loaded.value = !0, m.stale = !1, m.error.value = "";
      } catch (A) {
        m.error.value = ie(A, "The mail library could not be loaded.");
      } finally {
        m.loading.value = !1, v.delete(u);
      }
    })();
    return v.set(u, $), $;
  }
  function y(u) {
    const d = e[u];
    (!d.loaded.value || d.stale) && !d.loading.value && c(u);
  }
  function o(...u) {
    dl(() => {
      for (const d of u)
        e[d].users++, y(d);
    }), Be(() => {
      for (const d of u) e[d].users--;
    });
  }
  function k(u, d, m) {
    const $ = e[u];
    if (!$.loaded.value) return;
    const A = $.rows.value.filter((I) => I.name !== d);
    m && A.push(m), $.rows.value = A;
  }
  async function b(u) {
    let d, m;
    try {
      m = await se.get(u), d = ka(m);
    } catch ($) {
      if (!qe($)) {
        e[u.kind].stale = !0, e[u.kind].users > 0 && y(u.kind);
        return;
      }
    }
    k(u.kind, u.name, d);
    for (const $ of r) $(u, d, m);
  }
  Ea((u) => {
    b(u);
  });
  function x() {
    for (const u of Object.values(e)) u.stale = u.loaded.value;
    for (const [u, d] of Object.entries(e)) d.users > 0 && y(u);
  }
  function V(u) {
    r.add(u), Be(() => r.delete(u));
  }
  const i = (u, d) => e[u].rows.value.find((m) => m.name === d);
  function U(u, d) {
    const m = i(u, d);
    return m ? m.title : (y(u), e[u].loaded.value ? d : void 0);
  }
  return { kinds: e, use: o, ensure: y, load: c, find: i, title: U, ofKind: (u) => [...e[u].rows.value].sort((d, m) => d.title.localeCompare(m.title)), ready: (u) => e[u].loaded.value, failed: (u) => e[u].error.value, onRow: V, refresh: x, patch: k };
}
function xe() {
  let e = 0;
  return () => {
    const v = ++e;
    return () => v === e;
  };
}
const Ql = { class: "kx-empty" }, Xl = { class: "kx-empty-ico" }, et = { class: "kx-empty-title" }, at = {
  key: 0,
  class: "kx-empty-sub"
}, $a = /* @__PURE__ */ te({
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
    return (v, r) => (l(), n("div", Ql, [
      t("div", Xl, [
        s(a(N), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", et, h(e.title), 1),
      e.hint || v.$slots.hint ? (l(), n("p", at, [
        ze(v.$slots, "hint", {}, () => [
          G(h(e.hint), 1)
        ])
      ])) : T("", !0),
      e.cta ? (l(), O(a(D), {
        key: 1,
        label: e.cta,
        onClick: r[0] || (r[0] = (c) => v.$emit("cta"))
      }, fa({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: j(({ class: c }) => [
            s(a(N), {
              icon: e.ctaIcon,
              class: ne(c),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : T("", !0)
    ]));
  }
}), wa = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Wa = Object.fromEntries(Object.entries(wa).map(([e, v]) => [v, e])), lt = ["content", "variables", "used-by", "history"];
function va(e) {
  return wa[e];
}
function tt(e) {
  return Wa[e];
}
function Ka(e) {
  return e === "base" ? ["content", "used-by", "history"] : e === "part" ? ["content", "variables", "history"] : lt;
}
function Ne(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${wa[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function Ia(e) {
  const v = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [r, c, y] = v;
  if (!r) return { name: "library", section: "all" };
  try {
    if (r === "activity")
      return c === "template" && y ? { name: "activity", template: decodeURIComponent(y) } : c ? { name: "activity", message: decodeURIComponent(c) } : { name: "activity" };
    if (r === "assets") return c ? { name: "library", section: "assets", asset: decodeURIComponent(c) } : { name: "library", section: "assets" };
    const o = Wa[r];
    if (!o) return { name: "library", section: "all" };
    if (!c) return { name: "library", section: r };
    const b = Ka(o).find((x) => x === y) ?? "content";
    return { name: "resource", kind: o, resource: decodeURIComponent(c), section: b };
  } catch {
    return { name: "library", section: "all" };
  }
}
const st = "default-src 'none'; img-src data:; style-src 'unsafe-inline'", ra = `<meta http-equiv="Content-Security-Policy" content="${st}">`;
function _a(e, v) {
  let r = e;
  for (const [o, k] of Object.entries(v ?? {}))
    r = r.split("cid:" + o).join(k);
  const c = /<head(\s[^>]*)?>/i.exec(r);
  if (c) return r.slice(0, c.index + c[0].length) + ra + r.slice(c.index + c[0].length);
  const y = /<html(\s[^>]*)?>/i.exec(r);
  return y ? r.slice(0, y.index + y[0].length) + "<head>" + ra + "</head>" + r.slice(y.index + y[0].length) : ra + r;
}
const it = {
  class: "mail-problem",
  role: "alert"
}, nt = { class: "mail-problem-lead" }, ot = { class: "mail-problem-detail" }, rt = {
  key: 0,
  class: "mail-problem-involved"
}, ut = {
  key: 0,
  class: "mail-problem-self"
}, ma = /* @__PURE__ */ te({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {}
  },
  setup(e) {
    const v = e, { library: r, go: c } = fe(), y = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, o = (i) => r.title(i.kind, i.name), k = (i) => !!i && !!v.draft && i.kind === v.draft.kind && i.name === v.draft.name, b = P(() => {
      const { resource: i, face: U, previewOf: S } = v.problem, R = U ? y[U] : "";
      if (i && v.draft && v.draft.kind !== "message" && i.kind === "message" && i.name === S)
        return `${o(i) ?? "The message"} does not render with your changes.`;
      if (!i || k(i)) {
        const C = v.draft ? `this ${be[v.draft.kind].toLowerCase()}` : "it";
        return R ? `The ${R} of ${C} does not render.` : `${C[0].toUpperCase()}${C.slice(1)} does not render.`;
      }
      return `${o(i) ?? "A resource it uses"} does not render${R ? ` (${R})` : ""}.`;
    }), x = P(() => v.problem.candidates ?? []);
    function V(i) {
      i.kind === "asset" ? c({ name: "library", section: "assets", asset: i.name }) : c({ name: "resource", kind: i.kind, resource: i.name, section: "content" });
    }
    return (i, U) => (l(), n("div", it, [
      t("p", nt, [
        s(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, h(b.value), 1)
      ]),
      t("code", ot, h(e.problem.engine ?? e.problem.message), 1),
      x.value.length ? (l(), n("p", rt, [
        U[0] || (U[0] = t("span", { class: "mail-muted" }, "The render used these; one of them holds the problem:", -1)),
        (l(!0), n(Y, null, me(x.value, (S) => (l(), n(Y, {
          key: S.kind + S.name
        }, [
          k(S) ? (l(), n("span", ut, "This " + h(a(be)[S.kind].toLowerCase()), 1)) : o(S) === void 0 ? (l(), O(a(Ce), {
            key: 1,
            width: "6rem",
            height: "1rem"
          })) : (l(), O(a(D), {
            key: 2,
            link: "",
            size: "small",
            label: o(S),
            class: "mail-inline-link",
            onClick: (R) => V(S)
          }, null, 8, ["label", "onClick"]))
        ], 64))), 128))
      ])) : T("", !0)
    ]));
  }
}), La = ["html", "text", "subject", "variables", "samples"];
function Ze(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function He(e) {
  if (!(e instanceof gl)) return;
  const v = e.details ?? {};
  if (Ue(e) === "mail_resource_in_use") {
    const x = Array.isArray(v.messages) ? v.messages.filter((i) => typeof i == "string") : [], V = v.dependent;
    return {
      message: e.message,
      dependents: x,
      face: La.find((i) => i === V?.face),
      resource: Ze(V?.resource) ? V.resource : void 0
    };
  }
  const c = La.find((x) => x === v.face);
  if (!c) return;
  const y = Array.isArray(v.dependent_messages) ? v.dependent_messages.filter((x) => typeof x == "string") : [], o = Array.isArray(v.errors) ? v.errors.flatMap((x) => {
    const V = x;
    return Ze(V.resource) && typeof V.message == "string" ? [{ name: V.resource.name, message: V.message }] : [];
  }) : [], k = Array.isArray(v.candidate_resources) ? v.candidate_resources.filter(Ze) : [], b = typeof v.engine_message == "string" ? v.engine_message : void 0;
  return {
    message: e.message,
    engine: b,
    face: c,
    resource: Ze(v.resource) ? v.resource : void 0,
    dependents: y.length ? y : void 0,
    reasons: o.length ? o : void 0,
    candidates: k.length ? k : void 0
  };
}
const dt = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, ct = { class: "kx-modal-head-icon" }, vt = {
  key: 0,
  class: "mail-gallery-progress",
  role: "status"
}, mt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ft = {
  key: 2,
  class: "mail-muted"
}, bt = ["data-name"], yt = { class: "mail-gallery-title" }, pt = { class: "mail-sub" }, gt = { class: "mail-gallery-frame" }, ht = {
  key: 0,
  class: "mail-muted mail-gallery-wait"
}, kt = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, $t = {
  key: 2,
  class: "mail-gallery-problem"
}, wt = {
  key: 1,
  role: "alert"
}, _t = ["srcdoc", "title"], xt = {
  key: 3,
  class: "mail-more"
}, Ct = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Vt = 3, St = /* @__PURE__ */ te({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: v }) {
    const r = e, c = v, { go: y } = fe();
    we(() => r.visible);
    const o = _([]), k = _(), b = _(!1), x = _("");
    let V = 0, i = [], U = 0, S;
    async function R(g, p) {
      g.state = "loading";
      try {
        const f = await se.preview(g.name, []);
        if (p !== V) return;
        g.subject = f.subject, g.document = f.html ? _a(f.html, f.inline_assets) : "", g.state = "ready";
      } catch (f) {
        if (p !== V) return;
        g.problem = He(f), g.failure = g.problem ? "" : ie(f, "This message could not be rendered."), g.state = "failed";
      }
    }
    function C(g) {
      for (; g === V && U < Vt && i.length; ) {
        const p = i.shift();
        p.state === "waiting" && (U++, R(p, g).finally(() => {
          U--, C(g);
        }));
      }
    }
    function u(g) {
      g.state !== "waiting" || i.includes(g) || (i.push(g), C(V));
    }
    const d = _();
    function m() {
      if (S?.disconnect(), typeof IntersectionObserver > "u" || !d.value) {
        for (const g of o.value) u(g);
        return;
      }
      S = new IntersectionObserver((g) => {
        for (const p of g) {
          if (!p.isIntersecting) continue;
          const f = o.value.find((w) => w.name === p.target.dataset.name);
          f && u(f);
        }
      }, { root: d.value.closest(".p-dialog-content"), rootMargin: "200px" });
      for (const g of d.value.querySelectorAll("[data-name]")) S.observe(g);
    }
    async function $(g) {
      b.value = !0, x.value = "";
      try {
        const p = await se.page({ kind: "message", cursor: k.value });
        if (g !== V) return;
        o.value = [...o.value, ...p.items.map((f) => cl({ name: f.name, title: f.title, state: "waiting" }))], k.value = p.next_cursor, await ea(), m();
      } catch (p) {
        g === V && (x.value = ie(p, "The messages could not be listed."));
      } finally {
        g === V && (b.value = !1);
      }
    }
    function A() {
      V++, i = [], S?.disconnect(), S = void 0;
    }
    function I() {
      A(), o.value = [], k.value = void 0, $(V);
    }
    function M() {
      const g = ++V;
      i = [];
      for (const p of o.value) Object.assign(p, { state: "waiting", subject: void 0, document: void 0, problem: void 0, failure: void 0 });
      ea(() => {
        g === V && m();
      });
    }
    X(() => r.visible, (g) => {
      g ? I() : A();
    }), Be(A);
    const L = P(() => o.value.filter((g) => g.state === "ready" || g.state === "failed").length), E = P(() => o.value.filter((g) => g.state === "failed").length), ae = P(() => {
      if (!o.value.length) return "";
      const g = `${L.value} of ${pe(o.value.length, "message")}${k.value ? " listed so far" : ""} rendered`;
      return E.value ? `${g}, ${E.value} with a problem.` : g + ".";
    });
    function le(g) {
      c("close"), y({ name: "resource", kind: "message", resource: g, section: "content" });
    }
    const q = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (g, p) => (l(), O(a(Ae), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: q,
      "aria-label": "Preview all messages",
      "onUpdate:visible": p[1] || (p[1] = (f) => {
        f || c("close");
      })
    }, {
      header: j(() => [
        t("span", ct, [
          s(a(N), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        p[2] || (p[2] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          disabled: !o.value.length,
          onClick: M
        }, {
          icon: j(() => [
            s(a(N), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: j(() => [
        o.value.length ? (l(), n("div", vt, [
          t("span", null, h(ae.value), 1),
          s(a(Ul), {
            value: Math.round(L.value / o.value.length * 100),
            "show-value": !1,
            "aria-hidden": "true"
          }, null, 8, ["value"])
        ])) : T("", !0),
        b.value && !o.value.length ? (l(), n("p", mt, [
          s(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          p[3] || (p[3] = G("Listing messages…", -1))
        ])) : !b.value && !x.value && !o.value.length ? (l(), n("p", ft, "There are no messages yet.")) : T("", !0),
        t("ul", {
          ref_key: "list",
          ref: d,
          class: "mail-gallery"
        }, [
          (l(!0), n(Y, null, me(o.value, (f) => (l(), n("li", {
            key: f.name,
            "data-name": f.name,
            class: ne(["mail-gallery-tile", { "mail-gallery-failed": f.state === "failed" }])
          }, [
            s(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-gallery-open",
              "aria-label": "Open " + f.title,
              onClick: (w) => le(f.name)
            }, {
              default: j(() => [
                t("span", yt, h(f.title), 1),
                t("span", pt, h(f.subject ?? ""), 1)
              ]),
              _: 2
            }, 1032, ["aria-label", "onClick"]),
            t("div", gt, [
              f.state === "waiting" ? (l(), n("p", ht, "Renders when shown.")) : f.state === "loading" ? (l(), n("p", kt, [
                s(a(N), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                p[4] || (p[4] = G("Rendering…", -1))
              ])) : f.state === "failed" ? (l(), n("div", $t, [
                f.problem ? (l(), O(ma, {
                  key: 0,
                  problem: f.problem,
                  draft: { kind: "message", name: f.name }
                }, null, 8, ["problem", "draft"])) : (l(), n("p", wt, h(f.failure), 1))
              ])) : (l(), n("iframe", {
                key: 3,
                sandbox: "",
                srcdoc: f.document,
                title: f.title + " preview",
                tabindex: "-1"
              }, null, 8, _t))
            ])
          ], 10, bt))), 128))
        ], 512),
        k.value || x.value ? (l(), n("div", xt, [
          x.value ? (l(), n("span", Ct, h(x.value), 1)) : T("", !0),
          s(a(D), {
            label: x.value ? "Retry" : "Show more messages",
            severity: "secondary",
            outlined: "",
            loading: b.value,
            onClick: p[0] || (p[0] = (f) => $(a(V)))
          }, null, 8, ["label", "loading"])
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), Tt = { class: "mail-source" }, Rt = { key: 0 }, Ut = { key: 1 }, xa = /* @__PURE__ */ te({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (v, r) => (l(), n("span", Tt, [
      e.resource.state === "created" ? (l(), n("span", Rt, h((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(ke)(e.resource.author_label, e.resource.author)), 1)) : (l(), n("span", Ut, "Included with " + h(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), O(a(Ee), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : T("", !0)
    ]));
  }
}), jt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, At = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, It = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Lt = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Nt = { class: "mail-toolbar" }, zt = {
  class: "mail-count",
  role: "status"
}, Et = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, Ot = {
  key: 0,
  class: "mail-sub"
}, Pt = { class: "mail-kind" }, Mt = { class: "mail-muted" }, Dt = {
  key: 2,
  class: "mail-more"
}, Bt = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, qt = /* @__PURE__ */ te({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const v = e, { library: r, go: c, create: y } = fe(), o = P(() => tt(v.section));
    X(o, (Z) => {
      Z === "message" && r.ensure("base");
    }, { immediate: !0 });
    const k = _("all"), b = _(""), x = _("");
    let V;
    X(b, (Z) => {
      clearTimeout(V), V = setTimeout(() => {
        x.value = Z.trim();
      }, 250);
    }), X(() => v.section, () => {
      b.value = x.value = "", k.value = "all";
    });
    const i = ge([]), U = _(), S = _(!0), R = _(!1), C = _(!1), u = _(!1), d = _(""), m = _(""), $ = _(""), A = xe(), I = () => ({ kind: o.value, state: k.value === "all" ? void 0 : k.value, q: x.value || void 0 });
    async function M(Z = !1) {
      const F = A();
      S.value = !0;
      try {
        const W = await se.page(I());
        if (!F()) return;
        i.value = W.items, U.value = W.next_cursor, d.value = m.value = $.value = "", u.value = !1, R.value = !0;
      } catch (W) {
        if (!F()) return;
        u.value = Fe(W);
        const oe = u.value ? "" : ie(W, "The mail library could not be loaded.");
        Z && R.value && !u.value ? $.value = oe : d.value = oe;
      } finally {
        F() && (S.value = !1);
      }
    }
    async function L() {
      if (!U.value || C.value) return;
      const Z = A();
      C.value = !0, m.value = "";
      try {
        const F = await se.page({ ...I(), cursor: U.value });
        if (!Z()) return;
        i.value = [...i.value, ...F.items], U.value = F.next_cursor;
      } catch (F) {
        Z() && (m.value = ie(F, "More resources could not be loaded."));
      } finally {
        C.value = !1;
      }
    }
    X([o, k, x], () => {
      M();
    }), la(() => M(R.value));
    const E = (Z) => Z.kind + "/" + Z.name;
    r.onRow((Z, F) => {
      const W = E(Z), oe = i.value.findIndex((J) => E(J) === W);
      if (oe >= 0) {
        const J = [...i.value];
        F ? J[oe] = F : J.splice(oe, 1), i.value = J;
        return;
      }
      if (!F || o.value && F.kind !== o.value || k.value !== "all" || x.value) return;
      const Ve = i.value[i.value.length - 1];
      if (U.value && Ve && W > E(Ve)) return;
      const ee = i.value.findIndex((J) => E(J) > W), K = [...i.value];
      K.splice(ee < 0 ? K.length : ee, 0, F), i.value = K;
    });
    const ae = P(() => {
      switch (o.value) {
        case "message":
          return { title: "Messages", description: "What recipients read. Each message follows its base template." };
        case "base":
          return { title: "Base templates", description: "The frame around messages: the page, the header and the footer." };
        case "part":
          return { title: "Parts", description: "Reusable pieces that templates include, such as the header, footer and buttons." };
        default:
          return { title: "All resources", description: "Everything your email is made of. Messages follow the base templates and parts they use." };
      }
    }), le = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], q = P(() => {
      const Z = o.value ? be[o.value].toLowerCase() : "resource";
      return U.value ? `First ${pe(i.value.length, Z)}` : pe(i.value.length, Z);
    });
    function g(Z) {
      const F = Z.used_by;
      return Z.kind === "base" || Z.kind === "asset" ? F?.messages ? pe(F.messages, "message") : "—" : Z.kind === "message" ? F?.recent_sources ? pe(F.recent_sources, "recent sender") : "—" : "";
    }
    function p(Z) {
      return Z.base ? r.title("base", Z.base) : "";
    }
    function f(Z) {
      Z.kind === "asset" ? c({ name: "library", section: "assets", asset: Z.name }) : c({ name: "resource", kind: Z.kind, resource: Z.name, section: "content" });
    }
    const w = P(() => R.value && !d.value && o.value && !i.value.length && k.value === "all" && !x.value), z = _(!1);
    return (Z, F) => (l(), n(Y, null, [
      s(ta, {
        title: ae.value.title,
        description: ae.value.description
      }, {
        actions: j(() => [
          !o.value || o.value === "message" ? (l(), O(a(D), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: F[0] || (F[0] = (W) => z.value = !0)
          }, {
            icon: j(() => [
              s(a(N), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : T("", !0),
          s(a(D), {
            label: o.value ? "New " + a(be)[o.value].toLowerCase() : "New",
            onClick: F[1] || (F[1] = (W) => a(y)({ kind: o.value }))
          }, {
            icon: j(() => [
              s(a(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      u.value ? (l(), n("p", jt, [
        s(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        F[9] || (F[9] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : d.value ? (l(), n("div", At, [
        t("span", null, h(d.value), 1),
        s(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[2] || (F[2] = (W) => M())
        })
      ])) : T("", !0),
      $.value ? (l(), n("div", It, [
        t("span", null, h($.value) + " The list shows what was loaded before.", 1),
        s(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: F[3] || (F[3] = (W) => M(!0))
        })
      ])) : S.value && !R.value ? (l(), n("p", Lt, [
        s(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        F[10] || (F[10] = G("Loading mail library…", -1))
      ])) : w.value && o.value ? (l(), O($a, {
        key: 4,
        icon: a(ye)[o.value],
        title: "No " + a(ba)[o.value].toLowerCase() + " yet",
        hint: "Create a " + a(be)[o.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(be)[o.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: F[4] || (F[4] = (W) => a(y)({ kind: o.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : R.value ? (l(), n(Y, { key: 5 }, [
        t("div", Nt, [
          s(a($e), {
            modelValue: k.value,
            "onUpdate:modelValue": F[5] || (F[5] = (W) => k.value = W),
            options: le,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          s(a(ga), { class: "mail-search" }, {
            default: j(() => [
              s(a(ha), null, {
                default: j(() => [
                  s(a(N), {
                    icon: S.value ? "tabler:loader-2" : "tabler:search",
                    class: ne({ spin: S.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: b.value,
                "onUpdate:modelValue": F[6] || (F[6] = (W) => b.value = W),
                type: "search",
                "aria-label": "Search " + ae.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", zt, h(q.value), 1)
        ]),
        i.value.length ? (l(), O(a(pa), {
          key: 1,
          value: i.value,
          "data-key": (W) => W.kind + "/" + W.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": ae.value.title } },
          onRowClick: F[7] || (F[7] = (W) => f(W.data))
        }, {
          default: j(() => [
            s(a(de), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: W }) => [
                s(a(D), {
                  link: "",
                  class: "mail-name",
                  label: W.title,
                  onClick: je((oe) => f(W), ["stop"])
                }, null, 8, ["label", "onClick"]),
                W.description ? (l(), n("span", Ot, h(W.description), 1)) : T("", !0)
              ]),
              _: 1
            }),
            o.value ? T("", !0) : (l(), O(a(de), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: j(({ data: W }) => [
                t("span", Pt, [
                  s(a(N), {
                    icon: a(ye)[W.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  G(h(a(be)[W.kind]), 1)
                ])
              ]),
              _: 1
            })),
            o.value === "message" ? (l(), O(a(de), {
              key: 1,
              header: "Base template"
            }, {
              body: j(({ data: W }) => [
                p(W) === void 0 ? (l(), O(a(Ce), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n(Y, { key: 1 }, [
                  G(h(p(W)), 1)
                ], 64))
              ]),
              _: 1
            })) : T("", !0),
            s(a(de), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: W }) => [
                s(xa, { resource: W }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            o.value !== "part" ? (l(), O(a(de), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: W }) => [
                G(h(g(W)), 1)
              ]),
              _: 1
            })) : T("", !0),
            s(a(de), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: W }) => [
                t("span", Mt, h(W.state === "original" ? "—" : a(Oa)(W.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), n("p", Et, "Nothing matches. Try another name or a word from the template.")),
        U.value ? (l(), n("div", Dt, [
          m.value ? (l(), n("span", Bt, h(m.value), 1)) : T("", !0),
          s(a(D), {
            label: m.value ? "Retry" : "Show more",
            severity: "secondary",
            outlined: "",
            loading: C.value,
            onClick: L
          }, null, 8, ["label", "loading"])
        ])) : T("", !0)
      ], 64)) : T("", !0),
      s(St, {
        visible: z.value,
        onClose: F[8] || (F[8] = (W) => z.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function Ht(e) {
  return JSON.parse(JSON.stringify(e));
}
function _e(e) {
  const v = Ht(e);
  return {
    kind: v.kind,
    name: v.name,
    title: v.title,
    description: v.description,
    html: v.html,
    text: v.text,
    base: v.base,
    subject: v.subject,
    schema: v.schema,
    samples: v.samples
  };
}
function Ft(e, v) {
  return JSON.stringify(_e(e)) === JSON.stringify(_e(v));
}
function Jt(e, v, r, c, y) {
  const o = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: v,
    title: r,
    description: c,
    base: y,
    subject: r,
    schema: o,
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
    name: v,
    title: r,
    description: c,
    schema: o,
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
  } : { kind: e, name: v, title: r, description: c, schema: o, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function Wt(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function Kt(e) {
  const v = [], r = e.samples;
  for (const [c, y] of Object.entries(e.schema.properties)) {
    const o = Wt(r[c] ?? y.default ?? (y.type === "string" ? "" : null));
    o !== void 0 && v.push(`${JSON.stringify(c)}, ${o}`);
  }
  return v.length ? `{{ include "/part/${e.name}" map(${v.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function Ya(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function Yt(e, v, r) {
  const c = r ? ` width="${r}"` : "";
  return `<img src="${Ya(e)}" alt="${v.replace(/"/g, "&quot;")}"${c} style="display:block;border:0;max-width:100%;height:auto;">`;
}
const Gt = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function Zt(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !Gt.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const Qt = "{{ block body() }}{{ end }}", Xt = {
  class: "mail-preview",
  "aria-label": "Preview"
}, es = { class: "mail-preview-bar" }, as = {
  key: 0,
  class: "mail-preview-with"
}, ls = ["for"], ts = {
  key: 0,
  class: "mail-field-hint"
}, ss = {
  key: 1,
  class: "mail-preview-busy",
  role: "status"
}, is = {
  key: 2,
  class: "mail-preview-envelope"
}, ns = ["aria-busy"], os = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, rs = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, us = ["srcdoc", "title"], ds = {
  key: 1,
  class: "mail-preview-text"
}, cs = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "status"
}, vs = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, ms = {
  key: 5,
  class: "mail-preview-foot"
}, fs = /* @__PURE__ */ te({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, delivery: o } = fe();
    r.draft.kind !== "message" && y.ensure("message");
    const k = { message: ve() }, b = _("email"), x = _("desktop"), V = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], i = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], U = P(() => y.ready("message") ? (r.messages ?? y.ofKind("message").map((p) => p.name)).map((p) => ({ value: p, label: y.title("message", p) ?? p })).sort((p, f) => p.label.localeCompare(f.label)) : []), S = _("");
    X(U, (g) => {
      r.draft.kind !== "message" && (g.some((p) => p.value === S.value) || (S.value = g[0]?.value ?? ""));
    }, { immediate: !0 });
    const R = P(() => r.draft.kind !== "message" && S.value && S.value === U.value[0]?.value ? "The first message by title. Choose another to see it around different content." : ""), C = P(() => r.draft.kind === "message" ? r.draft.name : S.value), u = ge(), d = _(!1), m = _(), $ = _(""), A = xe();
    let I, M = !1, L = !1;
    async function E() {
      const g = C.value;
      if (!g) return;
      if (M) {
        L = !0;
        return;
      }
      M = !0;
      const p = A();
      d.value = !0;
      try {
        const f = await se.preview(g, [r.draft]);
        if (!p()) return;
        u.value = f, m.value = void 0, $.value = "";
      } catch (f) {
        if (!p()) return;
        const w = He(f);
        m.value = w ? { ...w, previewOf: g } : void 0, $.value = m.value ? "" : ie(f, "The preview could not be rendered.");
      } finally {
        M = !1, p() && (d.value = !1), L && (L = !1, E());
      }
    }
    function ae() {
      clearTimeout(I), I = setTimeout(() => {
        E();
      }, 450);
    }
    X(() => JSON.stringify(r.draft), ae), X(C, () => {
      u.value = void 0, E();
    }, { immediate: !0 }), X(m, (g) => c("problem", g)), Be(() => clearTimeout(I));
    const le = P(() => u.value?.html ? _a(u.value.html, u.value.inline_assets) : ""), q = P(() => {
      const g = o.value?.from;
      return g ? g.name ? `${g.name} <${g.address}>` : g.address : "";
    });
    return (g, p) => (l(), n("section", Xt, [
      t("div", es, [
        s(a($e), {
          modelValue: b.value,
          "onUpdate:modelValue": p[0] || (p[0] = (f) => b.value = f),
          options: V,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        b.value === "email" ? (l(), O(a($e), {
          key: 0,
          modelValue: x.value,
          "onUpdate:modelValue": p[1] || (p[1] = (f) => x.value = f),
          options: i,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: j(({ option: f }) => [
            s(a(N), {
              icon: f.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            G(h(f.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : T("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), n("div", as, [
        t("label", {
          for: k.message
        }, "Preview with", 8, ls),
        s(a(Oe), {
          modelValue: S.value,
          "onUpdate:modelValue": p[2] || (p[2] = (f) => S.value = f),
          "input-id": k.message,
          options: U.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet",
          loading: !a(y).ready("message")
        }, null, 8, ["modelValue", "input-id", "options", "loading"]),
        R.value ? (l(), n("small", ts, h(R.value), 1)) : T("", !0)
      ])) : T("", !0),
      d.value && u.value ? (l(), n("p", ss, [
        s(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        p[3] || (p[3] = G("Updating the preview…", -1))
      ])) : T("", !0),
      u.value ? (l(), n("dl", is, [
        q.value ? (l(), n(Y, { key: 0 }, [
          p[4] || (p[4] = t("dt", null, "From", -1)),
          t("dd", null, h(q.value), 1)
        ], 64)) : T("", !0),
        p[5] || (p[5] = t("dt", null, "Subject", -1)),
        t("dd", null, h(u.value.subject), 1)
      ])) : T("", !0),
      t("div", {
        class: ne(["mail-preview-body", ["mail-preview-" + x.value, { "mail-preview-stale": m.value || $.value }]]),
        "aria-busy": d.value
      }, [
        !u.value && d.value ? (l(), n("p", os, [
          s(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          p[6] || (p[6] = G("Rendering preview…", -1))
        ])) : C.value ? u.value ? (l(), n(Y, { key: 2 }, [
          b.value === "email" ? (l(), n("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: le.value,
            title: "Email preview: " + (u.value.subject ?? "")
          }, null, 8, us)) : (l(), n("pre", ds, h(u.value.text), 1))
        ], 64)) : T("", !0) : (l(), n("p", rs, "Choose a message to see this " + h(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, ns),
      m.value ? (l(), n("p", cs, [
        s(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, h(u.value ? "The preview shows the last version that rendered." : "Nothing to show until it renders.") + " The problem is shown beside the source.", 1)
      ])) : $.value ? (l(), n("p", vs, [
        s(a(N), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, h($.value), 1)
      ])) : (l(), n("p", ms, [
        s(a(N), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        G(" " + h(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), bs = { class: "kx-modal-head-icon" }, ys = { class: "kx-modal-head-text" }, ps = { class: "kx-modal-head-sub" }, gs = { class: "mail-change-list" }, hs = { class: "mail-muted" }, ks = { class: "mail-field" }, $s = ["for"], ws = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, _s = { class: "mail-failure-body" }, xs = { class: "mail-dependents" }, Cs = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Vs = /* @__PURE__ */ te({
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
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, go: o } = fe(), k = _(""), b = ve();
    X(() => r.visible, (U) => {
      U && (k.value = r.suggestedNote ?? "");
    }), we(() => r.visible);
    const x = P(() => {
      const U = r.saved, S = r.draft, R = [];
      return (U.title !== S.title || U.description !== S.description) && R.push("Name and description"), U.base !== S.base && R.push(`Base template: ${y.title("base", S.base ?? "") ?? S.base}`), U.subject !== S.subject && R.push("Subject"), U.html !== S.html && R.push("HTML"), U.text !== S.text && R.push("Plain text"), (JSON.stringify(U.schema.properties) !== JSON.stringify(S.schema.properties) || JSON.stringify(U.schema.required ?? []) !== JSON.stringify(S.schema.required ?? [])) && R.push(S.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(U.samples) !== JSON.stringify(S.samples) && R.push("Sample values"), R;
    }), V = P(() => r.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${be[r.draft.kind].toLowerCase()} changes when you save.`), i = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (U, S) => (l(), O(a(Ae), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: i,
      "aria-label": "Review changes",
      "onUpdate:visible": S[3] || (S[3] = (R) => {
        R || c("close");
      })
    }, {
      header: j(() => [
        t("span", bs, [
          s(a(N), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", ys, [
          S[4] || (S[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", ps, h(e.draft.title), 1)
        ])
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: S[2] || (S[2] = (R) => c("close"))
        }, null, 8, ["disabled"]),
        s(a(D), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: S[1] || (S[1] = je((R) => c("save", k.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            S[5] || (S[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", gs, [
              (l(!0), n(Y, null, me(x.value, (R) => (l(), n("li", { key: R }, h(R), 1))), 128))
            ])
          ]),
          t("p", hs, h(V.value) + " The previous version stays in History.", 1),
          t("div", ks, [
            t("label", {
              class: "mail-field-label",
              for: a(b)
            }, "Note for History", 8, $s),
            s(a(ce), {
              id: a(b),
              modelValue: k.value,
              "onUpdate:modelValue": S[0] || (S[0] = (R) => k.value = R),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), n("div", ws, [
            s(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", _s, [
              t("strong", null, h(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, h(e.dependents.reason), 1),
              t("span", xs, [
                (l(!0), n(Y, null, me(e.dependents.names, (R) => (l(), O(a(D), {
                  key: R,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: a(y).title("message", R) ?? R,
                  onClick: (C) => {
                    c("close"), a(o)({ name: "resource", kind: "message", resource: R, section: "content" });
                  }
                }, null, 8, ["label", "onClick"]))), 128))
              ])
            ])
          ])) : e.error ? (l(), n("p", Cs, h(e.error), 1)) : T("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Ga = /* @__PURE__ */ te({
  __name: "Disclosure",
  props: /* @__PURE__ */ ua({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const v = za(e, "open");
    return (r, c) => (l(), O(a(jl), {
      class: "kx-disclosure",
      value: v.value ? "content" : void 0,
      "onUpdate:value": c[0] || (c[0] = (y) => v.value = y === "content")
    }, {
      default: j(() => [
        s(a(Ll), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: j(() => [
            s(a(Il), { class: "kx-disclosure-toggle" }, {
              default: j(() => [
                G(h(e.label), 1)
              ]),
              _: 1
            }),
            s(a(Al), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: j(() => [
                ze(r.$slots, "default")
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
}), Ss = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Ts = { class: "kx-modal-head-icon" }, Rs = { class: "kx-modal-head-text" }, Us = { class: "kx-modal-head-title" }, js = { class: "mail-field" }, As = ["for"], Is = /* @__PURE__ */ te({
  __name: "InsertMenu",
  props: {
    draft: {},
    face: {}
  },
  emits: ["insert"],
  setup(e, { expose: v, emit: r }) {
    const c = e, y = r, { library: o } = fe(), k = _(), b = _("");
    function x(A) {
      b.value = "", o.ensure("part"), c.face === "html" && o.ensure("asset"), k.value?.toggle(A);
    }
    v({ toggle: x });
    const V = [
      { name: "site.title", label: "Workspace name" },
      { name: "site.url", label: "Workspace address" },
      { name: "sender.name", label: "Sender’s name" },
      { name: "message.subject", label: "Subject" }
    ], i = (A) => ({ label: A, disabled: !0, icon: "tabler:loader-2" });
    async function U(A) {
      b.value = "";
      try {
        y("insert", Kt(await se.get({ kind: "part", name: A })));
      } catch (I) {
        b.value = ie(I, "The part could not be read.");
      }
    }
    const S = _(), R = _(""), C = ve();
    we(() => !!S.value);
    async function u(A, I) {
      b.value = "";
      try {
        const M = await se.get({ kind: "asset", name: A });
        S.value = { name: A, title: I, width: M.asset?.width }, R.value = I;
      } catch (M) {
        b.value = ie(M, "The image could not be read.");
      }
    }
    function d() {
      S.value && (y("insert", Yt(S.value.name, R.value, S.value.width)), S.value = void 0);
    }
    const m = P(() => {
      const A = Object.entries(c.draft.schema.properties).map(([L]) => ({
        label: L,
        icon: "tabler:variable",
        command: () => y("insert", c.draft.kind === "part" ? `{{ .${L} }}` : Zt(L))
      })), I = [{
        label: c.draft.kind === "part" ? "Inputs and values" : "Variables and values",
        items: [...A, ...V.map((L) => ({
          label: L.label,
          icon: "tabler:world",
          command: () => y("insert", `{{ ${L.name} }}`)
        }))]
      }], M = o.ofKind("part").filter((L) => !(c.draft.kind === "part" && L.name === c.draft.name));
      if (I.push({ label: "Parts", items: o.ready("part") ? M.length ? M.map((L) => ({ label: L.title, icon: ye.part, command: () => {
        U(L.name);
      } })) : [{ label: "There are no parts to include yet.", disabled: !0 }] : [i("Loading parts…")] }), c.face === "html") {
        const L = o.ofKind("asset");
        I.push({ label: "Images", items: o.ready("asset") ? L.length ? L.map((E) => ({ label: E.title, icon: ye.asset, command: () => {
          u(E.name, E.title);
        } })) : [{ label: "There are no images yet. Upload one in Images.", disabled: !0 }] : [i("Loading images…")] });
      }
      return c.draft.kind === "base" && I.push({ label: "Layout", items: [{
        label: "Message body",
        icon: "tabler:layout-rows",
        command: () => y("insert", Qt)
      }] }), I;
    }), $ = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (A, I) => (l(), n(Y, null, [
      s(a(Nl), {
        ref_key: "menu",
        ref: k,
        model: m.value,
        popup: "",
        "aria-label": "Insert into " + (e.face === "html" ? "HTML" : "plain text"),
        pt: { root: { style: "max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px" } }
      }, {
        itemicon: j(({ item: M, class: L }) => [
          M.icon ? (l(), O(a(N), {
            key: 0,
            icon: M.icon,
            class: ne(L),
            "aria-hidden": "true"
          }, null, 8, ["icon", "class"])) : T("", !0)
        ]),
        _: 1
      }, 8, ["model", "aria-label"]),
      b.value ? (l(), n("p", Ss, h(b.value), 1)) : T("", !0),
      s(a(Ae), {
        visible: !!S.value,
        modal: "",
        draggable: !1,
        class: "mail-dialog",
        pt: $,
        "aria-label": "Insert image",
        "onUpdate:visible": I[2] || (I[2] = (M) => {
          M || (S.value = void 0);
        })
      }, {
        header: j(() => [
          t("span", Ts, [
            s(a(N), {
              icon: "tabler:photo-plus",
              "aria-hidden": "true"
            })
          ]),
          t("span", Rs, [
            t("span", Us, "Insert " + h(S.value?.title), 1),
            I[3] || (I[3] = t("span", { class: "kx-modal-head-sub" }, "Added at the cursor in HTML.", -1))
          ])
        ]),
        footer: j(() => [
          s(a(D), {
            label: "Cancel",
            severity: "secondary",
            outlined: "",
            onClick: I[1] || (I[1] = (M) => S.value = void 0)
          }),
          s(a(D), {
            label: "Insert image",
            type: "submit",
            form: "mail-insert-image"
          })
        ]),
        default: j(() => [
          t("form", {
            id: "mail-insert-image",
            class: "mail-form",
            onSubmit: je(d, ["prevent"])
          }, [
            t("div", js, [
              t("label", {
                class: "mail-field-label",
                for: a(C)
              }, "Alternative text", 8, As),
              s(a(ce), {
                id: a(C),
                modelValue: R.value,
                "onUpdate:modelValue": I[0] || (I[0] = (M) => R.value = M),
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
}), Ls = ["disabled", "inert"], Ns = { class: "mail-form" }, zs = { class: "mail-field" }, Es = ["for"], Os = { class: "mail-field" }, Ps = ["for"], Ms = { class: "mail-field-hint" }, Ds = { class: "mail-mono" }, Bs = { class: "mail-field" }, qs = ["for"], Hs = { class: "mail-base-row" }, Fs = { class: "mail-kind" }, Js = ["id"], Ws = { class: "mail-code-frame mail-code-subject" }, Ks = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Ys = { class: "mail-face-bar" }, Gs = { class: "mail-code-frame mail-code-body" }, Zs = /* @__PURE__ */ te({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const v = da(() => import("./CodeEditor-CIrhfC0V.js")), r = e, { library: c, go: y } = fe();
    c.use("base");
    const o = { base: ve(), title: ve(), description: ve(), face: ve() }, k = _("html"), b = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], x = P(() => c.ofKind("base").map((u) => ({ value: u.name, label: u.title }))), V = P(() => r.draft.kind === "message" && /[\r\n]/.test(r.draft.subject ?? "")), i = _(), U = _();
    function S(u) {
      i.value?.insert(u);
    }
    const R = P(() => {
      const u = r.problem;
      if (u)
        return u.face === "html" || u.face === "text" || u.face === "subject" ? u.face : k.value;
    }), C = P(() => (r.draft.kind === "message" ? "Body" : "Source") + (k.value === "html" ? ", HTML" : ", plain text"));
    return (u, d) => (l(), n("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s(Ga, { label: "Name and description" }, {
        default: j(() => [
          t("div", Ns, [
            t("div", zs, [
              t("label", {
                class: "mail-field-label",
                for: o.title
              }, "Name", 8, Es),
              s(a(ce), {
                id: o.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": d[0] || (d[0] = (m) => e.draft.title = m)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Os, [
              t("label", {
                class: "mail-field-label",
                for: o.description
              }, "Description", 8, Ps),
              s(a(ce), {
                id: o.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": d[1] || (d[1] = (m) => e.draft.description = m)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Ms, [
              d[9] || (d[9] = G("Reference ", -1)),
              t("span", Ds, h(e.draft.name), 1),
              G(", used to " + h(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), n(Y, { key: 0 }, [
        t("div", Bs, [
          t("label", {
            class: "mail-field-label",
            for: o.base
          }, "Base template", 8, qs),
          t("div", Hs, [
            s(a(Oe), {
              modelValue: e.draft.base,
              "onUpdate:modelValue": d[2] || (d[2] = (m) => e.draft.base = m),
              "input-id": o.base,
              options: x.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select",
              loading: !a(c).ready("base")
            }, {
              value: j(({ value: m }) => [
                t("span", Fs, [
                  s(a(N), {
                    icon: a(ye).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  m && a(c).title("base", m) === void 0 ? (l(), O(a(Ce), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(Y, { key: 1 }, [
                    G(h(a(c).title("base", m)), 1)
                  ], 64))
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options", "loading"]),
            e.draft.base ? (l(), O(a(D), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: d[3] || (d[3] = (m) => a(y)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : T("", !0)
          ])
        ]),
        t("div", {
          class: ne(["mail-field", { "mail-field-invalid": R.value === "subject" || V.value }])
        }, [
          t("span", {
            id: o.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, Js),
          t("div", Ws, [
            s(a(v), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": d[4] || (d[4] = (m) => e.draft.subject = m),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          V.value ? (l(), n("small", Ks, "A subject is one line. Remove the line break.")) : e.problem && R.value === "subject" ? (l(), O(ma, {
            key: 1,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : T("", !0)
        ], 2)
      ], 64)) : T("", !0),
      t("div", {
        class: ne(["mail-field", { "mail-field-invalid": e.problem && R.value !== "subject" }])
      }, [
        t("div", Ys, [
          s(a($e), {
            modelValue: k.value,
            "onUpdate:modelValue": d[5] || (d[5] = (m) => k.value = m),
            options: b,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          s(a(D), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            "aria-haspopup": "true",
            onClick: d[6] || (d[6] = (m) => U.value?.toggle(m))
          }, {
            icon: j(() => [
              s(a(N), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", Gs, [
          k.value === "html" ? (l(), O(a(v), {
            ref_key: "editor",
            ref: i,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": d[7] || (d[7] = (m) => e.draft.html = m),
            label: C.value
          }, null, 8, ["modelValue", "label"])) : (l(), O(a(v), {
            ref_key: "editor",
            ref: i,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": d[8] || (d[8] = (m) => e.draft.text = m),
            label: C.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && R.value !== "subject" ? (l(), O(ma, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : T("", !0)
      ], 2),
      s(Is, {
        ref_key: "inserter",
        ref: U,
        draft: e.draft,
        face: k.value,
        onInsert: S
      }, null, 8, ["draft", "face"])
    ], 8, Ls));
  }
}), Qs = { class: "mail-value-field" }, Xs = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, Na = /* @__PURE__ */ te({
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
  setup(e, { emit: v }) {
    const r = e, c = za(e, "modelValue"), y = v, o = (m) => m === null || ["string", "number", "boolean"].includes(typeof m), k = (m) => m === void 0 || Array.isArray(m) && m.every(o), b = (m) => m === void 0 || !!m && typeof m == "object" && !Array.isArray(m) && Object.values(m).every(($) => typeof $ == "string"), x = _(!1);
    X(() => r.type, () => {
      x.value = !1;
    });
    const V = P(() => x.value ? "written" : r.type === "array" ? k(c.value) ? "list" : "written" : r.type === "object" ? b(c.value) ? "record" : "written" : r.type), i = P({
      get: () => Array.isArray(c.value) ? c.value.map((m) => m === null ? "" : String(m)).join(`
`) : "",
      set: (m) => {
        const $ = m.split(`
`).map((I) => I.trim()).filter(Boolean), A = r.itemType === "number" || r.itemType === "integer";
        c.value = $.length ? $.map((I) => A && I !== "" && !Number.isNaN(Number(I)) ? Number(I) : I) : void 0;
      }
    }), U = _([]);
    X(c, (m) => {
      if (V.value !== "record") return;
      const $ = m ?? {};
      JSON.stringify(Object.fromEntries(U.value.filter((A) => A.key).map((A) => [A.key, A.value]))) !== JSON.stringify($) && (U.value = Object.entries($).map(([A, I]) => ({ key: A, value: I })));
    }, { immediate: !0 });
    function S() {
      const m = U.value.filter(($) => $.key.trim());
      c.value = m.length ? Object.fromEntries(m.map(($) => [$.key.trim(), $.value])) : void 0;
    }
    const R = _(""), C = _("");
    X([c, V], () => {
      V.value === "written" && !C.value && (R.value = c.value === void 0 ? "" : JSON.stringify(c.value, null, 2));
    }, { immediate: !0 });
    function u(m) {
      if (R.value = m, !m.trim()) {
        C.value = "", c.value = void 0;
        return;
      }
      try {
        const $ = JSON.parse(m), A = r.type === "array" ? Array.isArray($) : !!$ && typeof $ == "object" && !Array.isArray($);
        C.value = A ? "" : r.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.', A && (c.value = $);
      } catch {
        C.value = r.type === "array" ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.';
      }
    }
    X(C, (m) => y("invalid", m), { immediate: !0 });
    const d = [{ label: "Yes", value: !0 }, { label: "No", value: !1 }];
    return (m, $) => (l(), n("div", Qs, [
      V.value === "string" ? (l(), O(a(ce), {
        key: 0,
        "model-value": typeof c.value == "string" ? c.value : "",
        "aria-label": e.label,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": $[0] || ($[0] = (A) => c.value = A || void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : V.value === "number" || V.value === "integer" ? (l(), O(a(El), {
        key: 1,
        "model-value": typeof c.value == "number" ? c.value : null,
        "aria-label": e.label,
        "max-fraction-digits": V.value === "integer" ? 0 : 6,
        "use-grouping": !1,
        disabled: e.disabled,
        fluid: "",
        "onUpdate:modelValue": $[1] || ($[1] = (A) => c.value = A ?? void 0)
      }, null, 8, ["model-value", "aria-label", "max-fraction-digits", "disabled"])) : V.value === "boolean" ? (l(), O(a($e), {
        key: 2,
        "model-value": typeof c.value == "boolean" ? c.value : null,
        options: d,
        "option-label": "label",
        "option-value": "value",
        "aria-label": e.label,
        disabled: e.disabled,
        "onUpdate:modelValue": $[2] || ($[2] = (A) => c.value = typeof A == "boolean" ? A : void 0)
      }, null, 8, ["model-value", "aria-label", "disabled"])) : V.value === "list" ? (l(), O(a(ca), {
        key: 3,
        modelValue: i.value,
        "onUpdate:modelValue": $[3] || ($[3] = (A) => i.value = A),
        "aria-label": e.label,
        rows: "3",
        "auto-resize": "",
        disabled: e.disabled,
        fluid: "",
        placeholder: "One item per line"
      }, null, 8, ["modelValue", "aria-label", "disabled"])) : V.value === "record" ? (l(), n(Y, { key: 4 }, [
        (l(!0), n(Y, null, me(U.value, (A, I) => (l(), n("div", {
          key: I,
          class: "mail-value-entry"
        }, [
          s(a(ce), {
            modelValue: A.key,
            "onUpdate:modelValue": [(M) => A.key = M, S],
            "aria-label": e.label + ", name " + (I + 1),
            placeholder: "Name",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(a(ce), {
            modelValue: A.value,
            "onUpdate:modelValue": [(M) => A.value = M, S],
            "aria-label": e.label + ", value " + (I + 1),
            placeholder: "Value",
            disabled: e.disabled
          }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "disabled"]),
          s(a(D), {
            text: "",
            severity: "secondary",
            size: "small",
            "aria-label": "Remove " + (A.key || "entry"),
            disabled: e.disabled,
            onClick: (M) => {
              U.value.splice(I, 1), S();
            }
          }, {
            icon: j(() => [
              s(a(N), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["aria-label", "disabled", "onClick"])
        ]))), 128)),
        s(a(D), {
          label: "Add a name and value",
          severity: "secondary",
          text: "",
          size: "small",
          disabled: e.disabled,
          onClick: $[4] || ($[4] = (A) => U.value.push({ key: "", value: "" }))
        }, {
          icon: j(() => [
            s(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ], 64)) : (l(), n(Y, { key: 5 }, [
        s(a(ca), {
          "model-value": R.value,
          "aria-label": e.label,
          rows: "3",
          "auto-resize": "",
          class: "mail-mono-input",
          invalid: !!C.value,
          disabled: e.disabled,
          fluid: "",
          "onUpdate:modelValue": u
        }, null, 8, ["model-value", "aria-label", "invalid", "disabled"]),
        C.value ? (l(), n("small", Xs, h(C.value), 1)) : T("", !0)
      ], 64)),
      (e.type === "array" || e.type === "object") && V.value !== "written" ? (l(), O(a(D), {
        key: 6,
        link: "",
        size: "small",
        class: "mail-inline-link",
        label: "Write it as data",
        disabled: e.disabled,
        onClick: $[5] || ($[5] = (A) => x.value = !0)
      }, null, 8, ["disabled"])) : T("", !0)
    ]));
  }
}), ei = ["disabled", "inert"], ai = { class: "mail-sr-only" }, li = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, ti = {
  key: 1,
  class: "mail-muted"
}, si = ["aria-label"], ii = { class: "mail-variable-grid" }, ni = { class: "mail-field" }, oi = { class: "mail-field" }, ri = { class: "mail-field" }, ui = ["id"], di = { class: "mail-variable-check" }, ci = { class: "mail-field" }, vi = { class: "mail-variable-values" }, mi = {
  key: 0,
  class: "mail-field"
}, fi = { class: "mail-field" }, bi = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, yi = /* @__PURE__ */ te({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: v }) {
    const r = e, c = v, y = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let o = 0;
    function k(C) {
      const u = new Set(C.schema.required ?? []);
      return Object.entries(C.schema.properties).map(([d, m]) => {
        const $ = m.items;
        return {
          id: o++,
          name: d,
          schema: m,
          title: typeof m.title == "string" ? m.title : "",
          type: y.some((A) => A.value === m.type) ? m.type : "string",
          itemType: typeof $?.type == "string" ? $.type : void 0,
          required: u.has(d),
          description: typeof m.description == "string" ? m.description : "",
          sample: C.samples[d],
          fallback: m.default,
          valueErrors: { sample: "", fallback: "" }
        };
      });
    }
    const b = _([]);
    b.value = k(r.draft), X(() => r.draft, (C) => {
      b.value = k(C);
    });
    function x(C, u) {
      if (u === void 0) return !0;
      switch (C.type) {
        case "string":
          return typeof u == "string";
        case "number":
          return typeof u == "number";
        case "integer":
          return typeof u == "number" && Number.isInteger(u);
        case "boolean":
          return typeof u == "boolean";
        case "array":
          return Array.isArray(u);
        default:
          return !!u && typeof u == "object" && !Array.isArray(u);
      }
    }
    function V(C, u) {
      C.type = u, x(C, C.sample) || (C.sample = void 0), x(C, C.fallback) || (C.fallback = void 0);
    }
    const i = P(() => b.value.map((C) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(C.name) ? b.value.some((u) => u !== C && u.name === C.name) ? "Another one has this name." : C.valueErrors.sample || C.valueErrors.fallback || "" : "Use letters, digits and underscores, starting with a letter."));
    X(i, (C) => c("invalid", C.some(Boolean)), { immediate: !0 }), X(b, (C) => {
      if (i.value.some(Boolean)) return;
      const u = {}, d = {};
      for (const $ of C) {
        const A = { ...$.schema, type: $.type };
        for (const [I, M] of [["title", $.title], ["description", $.description]])
          M ? A[I] = M : delete A[I];
        $.fallback !== void 0 ? A.default = $.fallback : delete A.default, u[$.name] = A, $.sample !== void 0 && (d[$.name] = $.sample);
      }
      const m = C.filter(($) => $.required).map(($) => $.name);
      r.draft.schema = { ...r.draft.schema, properties: u, required: m.length ? m : void 0 }, r.draft.samples = d;
    }, { deep: !0 });
    function U() {
      let C = b.value.length + 1;
      for (; b.value.some((u) => u.name === `value_${C}`); ) C++;
      b.value.push({
        id: o++,
        name: `value_${C}`,
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
    const S = P(() => r.draft.kind === "part"), R = P(() => r.problem && (r.problem.face === "variables" || r.problem.face === "samples") ? `${dt[r.problem.face]}: ${r.problem.engine ?? r.problem.message}` : "");
    return (C, u) => (l(), n("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t("legend", ai, h(e.label), 1),
      R.value ? (l(), n("p", li, h(R.value), 1)) : T("", !0),
      b.value.length ? (l(), n("ul", {
        key: 2,
        class: "mail-variable-list",
        "aria-label": e.label
      }, [
        (l(!0), n(Y, null, me(b.value, (d, m) => (l(), n("li", {
          key: d.id,
          class: ne(["mail-variable-card", { "mail-variable-invalid": i.value[m] }])
        }, [
          t("div", ii, [
            t("label", ni, [
              u[0] || (u[0] = t("span", { class: "mail-field-label" }, "Name in templates", -1)),
              s(a(ce), {
                modelValue: d.name,
                "onUpdate:modelValue": ($) => d.name = $,
                class: "mail-mono-input",
                invalid: !!i.value[m] && !d.valueErrors.sample && !d.valueErrors.fallback
              }, null, 8, ["modelValue", "onUpdate:modelValue", "invalid"])
            ]),
            t("label", oi, [
              u[1] || (u[1] = t("span", { class: "mail-field-label" }, "Label", -1)),
              s(a(ce), {
                modelValue: d.title,
                "onUpdate:modelValue": ($) => d.title = $,
                placeholder: d.name
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            t("div", ri, [
              t("span", {
                id: "type-" + d.id,
                class: "mail-field-label"
              }, "Type", 8, ui),
              s(a(Oe), {
                "model-value": d.type,
                options: y,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                "aria-labelledby": "type-" + d.id,
                "onUpdate:modelValue": ($) => V(d, $)
              }, null, 8, ["model-value", "aria-labelledby", "onUpdate:modelValue"])
            ]),
            t("label", di, [
              s(a(zl), {
                modelValue: d.required,
                "onUpdate:modelValue": ($) => d.required = $,
                binary: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              u[2] || (u[2] = t("span", null, "Required", -1))
            ]),
            s(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-variable-remove",
              "aria-label": "Remove " + d.name,
              title: "Remove " + d.name,
              onClick: ($) => b.value.splice(m, 1)
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          t("label", ci, [
            u[3] || (u[3] = t("span", { class: "mail-field-label" }, "Description", -1)),
            s(a(ce), {
              modelValue: d.description,
              "onUpdate:modelValue": ($) => d.description = $,
              placeholder: "What senders put here"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          t("div", vi, [
            S.value ? (l(), n("div", mi, [
              u[4] || (u[4] = t("span", { class: "mail-field-label" }, "Default", -1)),
              s(Na, {
                modelValue: d.fallback,
                "onUpdate:modelValue": ($) => d.fallback = $,
                type: d.type,
                "item-type": d.itemType,
                label: "Default of " + d.name,
                onInvalid: ($) => d.valueErrors.fallback = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])) : T("", !0),
            t("div", fi, [
              u[5] || (u[5] = t("span", { class: "mail-field-label" }, "Sample value", -1)),
              s(Na, {
                modelValue: d.sample,
                "onUpdate:modelValue": ($) => d.sample = $,
                type: d.type,
                "item-type": d.itemType,
                label: "Sample value of " + d.name,
                onInvalid: ($) => d.valueErrors.sample = $
              }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "item-type", "label", "onInvalid"])
            ])
          ]),
          i.value[m] ? (l(), n("small", bi, h(d.name) + ": " + h(i.value[m]), 1)) : T("", !0)
        ], 2))), 128))
      ], 8, si)) : (l(), n("p", ti, h(e.draft.title) + " takes no " + h(e.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        s(a(D), {
          label: S.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: U
        }, {
          icon: j(() => [
            s(a(N), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, ei));
  }
}), pi = { class: "kx-modal-head-icon" }, gi = {
  key: 0,
  class: "kx-modal-head-text"
}, hi = { class: "kx-modal-head-title" }, ki = {
  key: 0,
  class: "kx-modal-head-sub"
}, $i = {
  key: 1,
  class: "kx-modal-head-sub"
}, wi = {
  key: 0,
  class: "mail-form"
}, _i = { class: "mail-face-bar" }, xi = {
  key: 0,
  class: "mail-version-subject"
}, Ci = { class: "mail-mono-block" }, Vi = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, Si = /* @__PURE__ */ te({
  __name: "VersionDialog",
  props: {
    revision: {},
    current: {},
    compare: { type: Boolean },
    busy: { type: Boolean },
    included: { type: Boolean }
  },
  emits: ["close", "restore", "reset"],
  setup(e, { emit: v }) {
    const r = da(() => import("./CodeEditor-CIrhfC0V.js")), c = da(() => import("./DiffView-CjA70e3n.js")), y = e, o = v;
    we(() => !!y.revision);
    const k = _("version"), b = _("html");
    X(() => y.revision, (u) => {
      u && (k.value = y.compare ? "compare" : "version", b.value = "html");
    });
    const x = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], V = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], i = P(() => y.revision?.revision === y.current.revision), U = P(() => {
      const u = y.revision;
      return u ? y.included || u.state === "original" && u.action === "reset" ? `${y.current.title}: the version included with ${y.current.origin_label}` : `${y.current.title}, version ${u.version}` : "";
    }), S = P(() => y.revision ? b.value === "html" ? y.revision.content.html : y.revision.content.text : ""), R = P(() => b.value === "html" ? y.current.html : y.current.text), C = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (u, d) => (l(), O(a(Ae), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: C,
      "aria-label": U.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": d[5] || (d[5] = (m) => {
        m || o("close");
      })
    }, {
      header: j(() => [
        t("span", pi, [
          s(a(N), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), n("span", gi, [
          t("span", hi, h(U.value), 1),
          e.included ? (l(), n("span", ki, "Compare it with your customized version, or reset to it.")) : (l(), n("span", $i, h(a(ya)[e.revision.action]) + " by " + h(a(ke)(e.revision.author_label, e.revision.author)) + " · " + h(a(Je)(e.revision.created_at)), 1))
        ])) : T("", !0)
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: d[2] || (d[2] = (m) => o("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), O(a(D), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: d[3] || (d[3] = (m) => o("reset"))
        }, {
          icon: j(() => [
            s(a(N), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !i.value ? (l(), O(a(D), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: d[4] || (d[4] = (m) => o("restore", e.revision))
        }, {
          icon: j(() => [
            s(a(N), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : T("", !0)
      ]),
      default: j(() => [
        e.revision ? (l(), n("div", wi, [
          t("div", _i, [
            i.value ? T("", !0) : (l(), O(a($e), {
              key: 0,
              modelValue: k.value,
              "onUpdate:modelValue": d[0] || (d[0] = (m) => k.value = m),
              options: x,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            s(a($e), {
              modelValue: b.value,
              "onUpdate:modelValue": d[1] || (d[1] = (m) => b.value = m),
              options: V,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && k.value === "version" ? (l(), n("p", xi, [
            d[6] || (d[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            d[7] || (d[7] = G()),
            t("span", Ci, h(e.revision.content.subject), 1)
          ])) : T("", !0),
          k.value === "version" ? (l(), n("div", Vi, [
            (l(), O(a(r), {
              key: b.value,
              "model-value": S.value,
              label: U.value + (b.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), O(a(c), {
            key: "diff-" + b.value,
            before: S.value,
            after: R.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), Ti = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, Ri = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ui = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, ji = {
  key: 3,
  class: "mail-history"
}, Ai = { class: "mail-history-head" }, Ii = { class: "mail-history-main" }, Li = { class: "mail-history-title" }, Ni = { class: "mail-sub" }, zi = {
  key: 0,
  class: "mail-history-note"
}, Ei = { class: "mail-history-actions" }, Oi = /* @__PURE__ */ te({
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
    return (v, r) => e.error ? (l(), n("div", Ti, [
      t("span", null, h(e.error), 1),
      s(a(D), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: r[0] || (r[0] = (c) => v.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (l(), n("p", Ri, [
      s(a(N), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      r[1] || (r[1] = G("Loading history…", -1))
    ])) : e.revisions.length ? (l(), n("ol", ji, [
      (l(!0), n(Y, null, me(e.revisions, (c) => (l(), n("li", {
        key: c.revision,
        class: "mail-history-row"
      }, [
        t("div", Ai, [
          t("div", Ii, [
            t("span", Li, [
              G(" Version " + h(c.version) + " · " + h(a(ya)[c.action]) + h(c.restored_from ? " from version " + c.restored_from : "") + " ", 1),
              c.revision === e.resource.revision ? (l(), O(a(Ee), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : T("", !0)
            ]),
            t("span", Ni, h(a(ke)(c.author_label, c.author)) + " · " + h(a(Je)(c.created_at)), 1),
            c.note ? (l(), n("span", zi, h(c.note), 1)) : T("", !0)
          ]),
          t("div", Ei, [
            s(a(D), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (y) => v.$emit("show", c)
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            c.revision !== e.resource.revision ? (l(), O(a(D), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: e.busy === c.revision,
              disabled: e.busy !== void 0,
              onClick: (y) => v.$emit("restore", c)
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : T("", !0)
          ])
        ])
      ]))), 128))
    ])) : (l(), n("p", Ui, h(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Pi = { class: "kx-modal-head-icon mail-head-warn" }, Mi = { class: "kx-modal-head-text" }, Di = { class: "kx-modal-head-title" }, Bi = { class: "mail-dialog-text" }, qi = {
  key: 0,
  class: "mail-list"
}, Za = /* @__PURE__ */ te({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: v }) {
    const r = e;
    we(() => !!r.refusal);
    const c = v, y = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function o(k) {
      c("close"), k();
    }
    return (k, b) => (l(), O(a(Ae), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: y,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": b[1] || (b[1] = (x) => {
        x || c("close");
      })
    }, {
      header: j(() => [
        t("span", Pi, [
          s(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", Mi, [
          t("span", Di, h(e.refusal?.header), 1)
        ])
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Close",
          autofocus: "",
          onClick: b[0] || (b[0] = (x) => c("close"))
        })
      ]),
      default: j(() => [
        t("p", Bi, h(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), n("ul", qi, [
          (l(!0), n(Y, null, me(e.refusal.links, (x) => (l(), n("li", {
            key: x.label
          }, [
            s(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (V) => o(x.open)
            }, {
              default: j(() => [
                s(a(N), {
                  icon: "tabler:mail",
                  "aria-hidden": "true"
                }),
                t("span", null, h(x.label), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : T("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Hi = { class: "mail-stack" }, Fi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Ji = {
  key: 0,
  class: "mail-muted"
}, Wi = {
  key: 1,
  class: "mail-list"
}, Ki = { key: 1 }, Yi = {
  key: 1,
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, Gi = { class: "mail-group-head" }, Zi = {
  key: 0,
  class: "mail-muted"
}, Qi = {
  key: 1,
  class: "mail-list"
}, Xi = { class: "mail-list-main" }, en = {
  key: 0,
  class: "mail-sub"
}, an = { class: "mail-muted" }, ln = /* @__PURE__ */ te({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const v = e, { library: r, go: c, capabilities: y } = fe(), o = P(() => (v.resource.used_by?.messages ?? []).map((b) => ({
      name: b,
      title: r.title("message", b)
    }))), k = P(() => v.resource.used_by?.recent_senders ?? []);
    return (b, x) => (l(), n("div", Hi, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), n("section", Fi, [
        x[1] || (x[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        o.value.length ? (l(), n("ul", Wi, [
          (l(!0), n(Y, null, me(o.value, (V) => (l(), n("li", {
            key: V.name
          }, [
            s(a(D), {
              text: "",
              severity: "secondary",
              class: "mail-row-link",
              onClick: (i) => a(c)({ name: "resource", kind: "message", resource: V.name, section: "content" })
            }, {
              default: j(() => [
                s(a(N), {
                  icon: a(ye).message,
                  "aria-hidden": "true"
                }, null, 8, ["icon"]),
                V.title === void 0 ? (l(), O(a(Ce), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : (l(), n("span", Ki, h(V.title), 1))
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]))), 128))
        ])) : (l(), n("p", Ji, "No messages " + h(e.resource.kind === "asset" ? "show" : "use") + " " + h(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), n("section", Yi, [
        t("div", Gi, [
          x[2] || (x[2] = t("h2", {
            id: "used-by-recent",
            class: "mail-label"
          }, "Sent in the last 30 days", -1)),
          a(y)?.administer_delivery ? (l(), O(a(D), {
            key: 0,
            link: "",
            size: "small",
            class: "mail-inline-link",
            label: "Open in Activity",
            onClick: x[0] || (x[0] = (V) => a(c)({ name: "activity", template: e.resource.name }))
          })) : T("", !0)
        ]),
        k.value.length ? (l(), n("ul", Qi, [
          (l(!0), n(Y, null, me(k.value, (V) => (l(), n("li", {
            key: V.sender + (V.origin?.id ?? ""),
            class: "mail-list-row"
          }, [
            s(a(N), {
              icon: V.origin ? "tabler:bolt" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            t("span", Xi, [
              t("span", null, h(a(ke)(V.sender_label, V.sender)), 1),
              V.origin ? (l(), n("span", en, h(a(sa)(V.origin)), 1)) : T("", !0)
            ]),
            t("span", an, h(a(pe)(V.count, "message")), 1)
          ]))), 128))
        ])) : (l(), n("p", Zi, "Nobody has sent " + h(e.resource.title) + " recently.", 1))
      ])) : T("", !0)
    ]));
  }
}), tn = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, sn = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, nn = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, on = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, rn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, un = {
  key: 2,
  class: "mail-muted mail-blocked",
  role: "status"
}, dn = {
  key: 3,
  class: "kx-notice warn mail-block",
  role: "alert"
}, cn = {
  key: 4,
  class: "kx-err mail-error",
  role: "alert"
}, vn = {
  key: 5,
  class: "kx-notice info mail-block",
  role: "status"
}, mn = {
  key: 6,
  class: "kx-notice mail-customized"
}, fn = { class: "mail-customized-text" }, bn = { class: "mail-editor-layout" }, yn = /* @__PURE__ */ te({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const v = e, { library: r, capabilities: c, delivery: y, go: o, create: k, setDirty: b, setTitle: x } = fe(), V = P(() => ({ kind: v.kind, name: v.name })), i = ge(), U = _(), S = _(!0), R = _(!1), C = _(!1), u = _(""), d = _(), m = xe(), $ = P(() => !!U.value && !!i.value && !Ft(U.value, i.value));
    X($, (B) => b(B), { immediate: !0 }), Be(() => b(!1));
    async function A(B = {}) {
      const H = m();
      try {
        const Q = await se.get(V.value);
        if (!H()) return;
        if (B.keepDraft && $.value && i.value && Q.revision !== i.value.revision) {
          d.value = { revision: Q.revision, by: ke(Q.author_label, Q.author) || "Someone" };
          return;
        }
        i.value = Q, U.value = _e(Q), I.value = void 0, x(Q.title), d.value = void 0, R.value = C.value = !1, u.value = "";
      } catch (Q) {
        if (!H()) return;
        R.value = qe(Q), C.value = Fe(Q), u.value = R.value || C.value ? "" : ie(Q, "This resource could not be loaded."), R.value && (i.value = void 0, U.value = void 0);
      } finally {
        H() && (S.value = !1);
      }
    }
    const I = _(), M = ge([]), L = _(!1), E = _(""), ae = xe();
    async function le() {
      const B = ae();
      L.value = !0;
      try {
        const H = await se.history(V.value);
        if (!B()) return;
        M.value = H, E.value = "";
      } catch (H) {
        if (!B()) return;
        E.value = qe(H) ? "" : ie(H, "History could not be loaded.");
      } finally {
        B() && (L.value = !1);
      }
    }
    async function q() {
      await Promise.all([A({ keepDraft: !0 }), le()]);
    }
    la(q), Ea((B) => {
      B.kind === v.kind && B.name === v.name ? q() : v.kind === "base" && B.kind === "message" && A({ keepDraft: !0 });
    });
    const g = _(), p = _(""), f = _(!1), w = _(""), z = _(), Z = P(() => i.value?.title ?? v.name), F = P(() => {
      const B = i.value, H = Z.value, Q = B?.used_by?.messages?.length ?? 0, re = B?.used_by?.recent_senders?.find((oa) => oa.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (re?.origin ? ` Sent recently by “${sa(re.origin)}”.` : "") },
          base: { title: "Layout", description: Q ? `The frame around the ${pe(Q, "message")} that ${Q === 1 ? "uses" : "use"} ${H}.` : `The frame around messages that use ${H}.` },
          part: { title: "Content", description: `Shown wherever ${H} is included.` }
        }[v.kind],
        variables: v.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${H} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: v.kind === "message" ? `Who sends ${H}.` : v.kind === "base" ? `Messages that use ${H}.` : `Templates that include ${H}.`
        },
        history: { title: "History", description: `Every saved version of ${H}, newest first.` }
      }[v.section];
    }), W = P(() => {
      const B = i.value;
      return B?.state !== "customized" ? "" : `Customized by ${ke(B.author_label, B.author)} ${hl(B.updated_at)} from the version included with ${B.origin_label}.`;
    }), oe = P(() => {
      const B = i.value;
      if (!B?.original) return;
      const { kind: H, name: Q, title: re, description: ue } = B;
      return {
        kind: H,
        name: Q,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: H, name: Q, title: re, description: ue, ...B.original }
      };
    }), Ve = _(), ee = _(), K = _(!1), J = P(() => ee.value ?? Ve.value);
    X(() => JSON.stringify(U.value), () => {
      ee.value = void 0;
    });
    const he = P(() => v.kind === "message" && /[\r\n]/.test(U.value?.subject ?? "")), Ie = P(() => !!J.value || K.value || !!d.value || he.value), Ca = P(() => d.value ? "Discard your changes to load the newer version first." : K.value ? "Fix the variables first." : he.value ? "Put the subject on one line first." : J.value ? "Fix the error first." : "");
    function ia(B, H) {
      f.value = Ue(B) === "mail_revision_conflict", f.value && q(), p.value = ie(B, H);
    }
    function Va() {
      if (!i.value) return;
      const B = !!d.value;
      U.value = _e(i.value), d.value = void 0, ee.value = void 0, I.value = void 0, B && A();
    }
    const Le = _(!1), We = _(""), Ke = _();
    function el() {
      We.value = "", Ke.value = void 0, Le.value = !0;
    }
    async function al(B) {
      const H = i.value, Q = U.value;
      if (!(!H || !Q || g.value !== void 0)) {
        g.value = "save", We.value = p.value = w.value = "", Ke.value = void 0;
        try {
          const re = await se.update(Q, H.revision, B || void 0);
          i.value = { ...H, ...re }, U.value = _e(i.value), Le.value = !1, w.value = I.value ? `Version ${I.value.version} from ${Je(I.value.created_at)} is now in effect.` : `Saved ${re.title}.${v.kind === "message" ? "" : " Every message that uses it has the change."}`, I.value = void 0, await q();
        } catch (re) {
          const ue = He(re), Se = ue?.resource?.kind === Q.kind && ue.resource.name === Q.name;
          ue?.dependents?.length && !Se ? Ke.value = { names: ue.dependents, reason: ue.reasons?.[0]?.message ?? ue.message } : ue ? (ee.value = ue, Le.value = !1) : Ue(re) === "mail_revision_conflict" ? (Le.value = !1, await A({ keepDraft: !0 })) : We.value = ie(re, `${Q.title} could not be saved.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    async function ll() {
      const B = i.value;
      if (!(!B || g.value !== void 0)) {
        g.value = "test", p.value = w.value = "";
        try {
          await se.sendTest(B.name), w.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (H) {
          ia(H, "The test could not be sent.");
        } finally {
          g.value = void 0;
        }
      }
    }
    const Ye = P(() => $.value ? "Save your changes to send a test." : c.value?.send ? y.value && !y.value.configured ? "Mail delivery is not set up yet, so a test cannot be sent." : "" : "Ask an administrator for permission to send mail.");
    async function Sa() {
      const B = i.value;
      if (!(!B || g.value !== void 0 || !await Re.confirm({
        header: `Reset ${B.title} to the original?`,
        message: `Your changes are replaced by the version included with ${B.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        g.value = "reset", p.value = w.value = "", f.value = !1;
        try {
          i.value = await se.reset(V.value, B.revision), U.value = _e(i.value), w.value = `${B.title} is back to the original. Your changes are in History.`, await q();
        } catch (Q) {
          ia(Q, `${B.title} could not be reset.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    const Pe = _(), Ta = _(!1), Ra = _(!1);
    function Ua(B, H = !1, Q = !1) {
      Ta.value = H, Ra.value = Q, Pe.value = B;
    }
    async function ja(B) {
      const H = i.value;
      if (!H || g.value !== void 0 || $.value && !await Re.confirm({
        header: `Replace your unsaved changes with version ${B.version}?`,
        message: "Your unsaved changes to this resource are discarded. The saved version stays as it is until you save.",
        acceptLabel: "Load this version",
        rejectLabel: "Keep my changes"
      })) return;
      U.value = { ..._e(B.content), kind: H.kind, name: H.name }, I.value = B, Pe.value = void 0, p.value = "";
      const Q = `Version ${B.version} is loaded as your draft. Review and save to restore it.`;
      v.section === "content" ? w.value = Q : (na = Q, o({ name: "resource", kind: v.kind, resource: v.name, section: "content" }));
    }
    function Aa(B, H, Q) {
      const re = H.map((Se) => r.title("message", Se) ?? Se), ue = B.kind === "base" ? "use" : "include";
      z.value = {
        header: `${B.title} is in use`,
        message: `${pe(H.length, "message")} ${H.length === 1 ? ue + "s" : ue} it: ${re.join(", ")}. Remove it from ${H.length === 1 ? "that message" : "them"} first.`,
        links: H.map((Se, oa) => ({ label: re[oa], open: () => o({ name: "resource", kind: "message", resource: Se, section: "content" }) }))
      };
    }
    async function tl() {
      const B = i.value;
      if (!B || B.state !== "created" || g.value !== void 0) return;
      const H = B.used_by?.messages ?? [];
      if (B.kind === "base" && H.length) {
        Aa(B, H);
        return;
      }
      if (await Re.confirm({
        header: `Delete ${B.title}?`,
        message: B.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${be[B.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        g.value = "delete", p.value = w.value = "";
        try {
          await se.remove(V.value, B.revision), b(!1), o({ name: "library", section: va(v.kind) });
        } catch (re) {
          const ue = He(re);
          ue?.dependents?.length ? Aa(B, ue.dependents) : ia(re, `${B.title} could not be deleted.`);
        } finally {
          g.value = void 0;
        }
      }
    }
    function sl() {
      const B = i.value;
      B && k({ kind: v.kind, from: { kind: B.kind, name: B.name } });
    }
    const il = P(() => v.kind === "base" ? i.value?.used_by?.messages : void 0), Ge = P(() => g.value === "save");
    A(), X(() => v.section, (B) => {
      B === "history" && !M.value.length && le();
    }, { immediate: !0 });
    let na = "";
    return X(() => v.section, () => {
      w.value = na, na = "", p.value = "";
    }), (B, H) => (l(), n(Y, null, [
      R.value ? (l(), O($a, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(ba)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: H[0] || (H[0] = (Q) => a(o)({ name: "library", section: a(va)(e.kind) }))
      }, null, 8, ["cta"])) : C.value ? (l(), n("p", tn, [
        s(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        H[10] || (H[10] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), n(Y, { key: 2 }, [
        s(ta, {
          title: F.value.title,
          description: F.value.description
        }, fa({ _: 2 }, [
          i.value ? {
            name: "actions",
            fn: j(() => [
              $.value ? (l(), O(kl, {
                key: 0,
                busy: Ge.value,
                "review-disabled": Ie.value,
                onDiscard: Va,
                onReview: el
              }, null, 8, ["busy", "review-disabled"])) : (l(), n(Y, { key: 1 }, [
                e.kind === "message" ? (l(), O(a(D), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: g.value === "test",
                  disabled: !!Ye.value || g.value !== void 0,
                  title: Ye.value || void 0,
                  onClick: ll
                }, {
                  icon: j(() => [
                    s(a(N), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : T("", !0),
                s(a(D), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: g.value !== void 0,
                  onClick: sl
                }, {
                  icon: j(() => [
                    s(a(N), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                i.value.state === "created" ? (l(), O(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: g.value === "delete",
                  disabled: g.value !== void 0,
                  onClick: tl
                }, {
                  icon: j(() => [
                    s(a(N), {
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
        u.value ? (l(), n("div", sn, [
          t("span", null, h(u.value), 1),
          s(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: H[1] || (H[1] = (Q) => q())
          })
        ])) : S.value ? (l(), n("p", nn, [
          s(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          G("Loading " + h(Z.value) + "…", 1)
        ])) : T("", !0),
        i.value && U.value ? (l(), n(Y, { key: 2 }, [
          d.value ? (l(), n("p", on, [
            s(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              G(h(d.value.by) + " saved " + h(i.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              s(a(D), {
                link: "",
                size: "small",
                class: "mail-inline-link",
                label: "Discard and load",
                onClick: Va
              })
            ])
          ])) : T("", !0),
          $.value && Ca.value && !d.value ? (l(), n("p", rn, h(Ca.value), 1)) : e.kind === "message" && !$.value && Ye.value ? (l(), n("p", un, [
            G(h(Ye.value) + " ", 1),
            a(c)?.administer_delivery && a(y) && !a(y).configured ? (l(), O(a(D), {
              key: 0,
              link: "",
              size: "small",
              class: "mail-inline-link",
              label: "Open delivery settings",
              onClick: H[2] || (H[2] = (Q) => a(Re).navigate("/system/settings/mail"))
            })) : T("", !0)
          ])) : T("", !0),
          p.value && f.value ? (l(), n("p", dn, [
            s(a(N), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            G(h(p.value), 1)
          ])) : p.value ? (l(), n("p", cn, [
            t("span", null, h(p.value), 1)
          ])) : T("", !0),
          w.value ? (l(), n("p", vn, [
            s(a(N), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            G(h(w.value), 1)
          ])) : T("", !0),
          W.value && e.section === "content" ? (l(), n("div", mn, [
            s(a(N), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", fn, [
              G(h(W.value), 1),
              $.value ? (l(), n(Y, { key: 0 }, [
                G(" Save or discard your changes to reset it.")
              ], 64)) : T("", !0)
            ]),
            oe.value ? (l(), O(a(D), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: H[3] || (H[3] = (Q) => Ua(oe.value, !0, !0))
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : T("", !0),
            s(a(D), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: g.value === "reset",
              disabled: g.value !== void 0 || $.value,
              onClick: Sa
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : T("", !0),
          vl(t("div", bn, [
            s(Zs, {
              draft: U.value,
              problem: J.value,
              disabled: Ge.value
            }, null, 8, ["draft", "problem", "disabled"]),
            s(fs, {
              draft: U.value,
              messages: il.value,
              onProblem: H[4] || (H[4] = (Q) => Ve.value = Q)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [ml, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), O(yi, {
            key: 7,
            draft: U.value,
            label: F.value.title,
            problem: J.value,
            disabled: Ge.value,
            onInvalid: H[5] || (H[5] = (Q) => K.value = Q)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), O(ln, {
            key: 8,
            resource: i.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), O(Oi, {
            key: 9,
            resource: i.value,
            revisions: M.value,
            loading: L.value,
            error: E.value,
            busy: typeof g.value == "number" ? g.value : g.value ? -1 : void 0,
            onShow: Ua,
            onRestore: ja,
            onRetry: le
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : T("", !0)
        ], 64)) : T("", !0)
      ], 64)),
      i.value && U.value ? (l(), O(Vs, {
        key: 3,
        visible: Le.value,
        saved: a(_e)(i.value),
        draft: U.value,
        busy: Ge.value,
        error: We.value,
        dependents: Ke.value,
        "suggested-note": I.value ? `Restore version ${I.value.version}` : void 0,
        onClose: H[6] || (H[6] = (Q) => Le.value = !1),
        onSave: al
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents", "suggested-note"])) : T("", !0),
      i.value ? (l(), O(Si, {
        key: 4,
        revision: Pe.value,
        current: i.value,
        compare: Ta.value,
        included: Ra.value,
        busy: typeof g.value == "number" || g.value === "reset",
        onClose: H[7] || (H[7] = (Q) => Pe.value = void 0),
        onRestore: ja,
        onReset: H[8] || (H[8] = (Q) => {
          Pe.value = void 0, Sa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : T("", !0),
      s(Za, {
        refusal: z.value,
        onClose: H[9] || (H[9] = (Q) => z.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Qe = /* @__PURE__ */ new Map();
function pn(e, v) {
  const r = Qe.get(e);
  if (r && r.revision >= v) return r.url;
  const c = Promise.resolve(Sl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then((y) => y.data instanceof Blob ? URL.createObjectURL(y.data) : void 0, () => {
    Qe.get(e)?.url === c && Qe.delete(e);
  });
  return Qe.set(e, { revision: v, url: c }), r && r.url.then((y) => {
    y && URL.revokeObjectURL(y);
  }), c;
}
const gn = ["src", "alt"], hn = {
  key: 0,
  "aria-hidden": "true"
}, Qa = /* @__PURE__ */ te({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(e) {
    const v = e, r = _();
    X(() => [v.name, v.revision], async ([y, o]) => {
      r.value = void 0, r.value = await pn(y, o);
    }, { immediate: !0 });
    const c = P(() => v.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return (y, o) => (l(), n("span", {
      class: ne(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      r.value ? (l(), n("img", {
        key: 0,
        src: r.value,
        alt: e.alt ?? ""
      }, null, 8, gn)) : (l(), n(Y, { key: 1 }, [
        s(a(N), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        c.value ? (l(), n("span", hn, h(c.value), 1)) : T("", !0)
      ], 64))
    ], 2));
  }
});
function Me(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function kn(e, v) {
  return e;
}
function $n(e, v, r) {
  if (v !== void 0 && !v) return null;
  const c = Me(e) ? e : {}, y = [
    c,
    Me(c.data) ? c.data : null,
    Me(c.payload) ? c.payload : null,
    Me(c.detail) ? c.detail : null
  ].filter(Boolean);
  for (const o of y) {
    if (o.event !== "component.meta.changed" && o.event !== "component.deleting" && o.event !== "component.deleted") continue;
    const k = String(o.component_id || ""), b = String(c.topic || o.topic || "");
    if (v === void 0) {
      if (!k && (!b.startsWith("component.") || b === "component.")) continue;
    } else if (k && k !== v || !k && b !== `component.${v}`) continue;
    const x = k || v || b.slice(10);
    return o.event === "component.deleting" && typeof o.deletion_job_id == "string" && o.deletion_job_id ? { event: o.event, component_id: x, deletion_job_id: o.deletion_job_id } : o.event !== "component.meta.changed" ? { event: o.event, component_id: x } : {
      event: "component.meta.changed",
      component_id: x,
      meta: kn(Me(o.meta) ? o.meta : {}),
      deleted: Array.isArray(o.deleted) ? o.deleted.map(String) : []
    };
  }
  return null;
}
function wn(e, v, r) {
  const c = $n(e, v);
  return c?.event === "component.meta.changed" ? c : null;
}
function _n(e, v, r) {
  if (!e) return null;
  const c = Tl(`component.${e}`, (y) => {
    const o = wn(y, e);
    o && v(o);
  });
  return typeof c == "function" ? c : null;
}
class Xe extends Error {
}
function xn(e, v) {
  return new Promise((r, c) => {
    let y = null, o = !1, k = !1, b = !1;
    const x = (i) => {
      b || (b = !0, y?.(), i ? c(i) : r());
    };
    async function V() {
      if (!b) {
        if (v.cancelled) {
          x(new Xe("cancelled"));
          return;
        }
        if (o) {
          k = !0;
          return;
        }
        o = !0;
        try {
          const i = await Pa.state(e);
          i.status === "completed" ? x() : i.status === "error" ? x(new Xe(i.error ?? "")) : y || (y = _n(i.component_id, () => {
            V();
          }), y ? k = !0 : x(new Xe("")));
        } catch (i) {
          x(i);
        } finally {
          o = !1, k && !b && (k = !1, V());
        }
      }
    }
    V();
  });
}
const Cn = { class: "kx-modal-head-icon" }, Vn = { class: "kx-modal-head-text" }, Sn = { class: "kx-modal-head-title" }, Tn = { class: "kx-modal-head-sub" }, Rn = ["disabled", "inert"], Un = ["for"], jn = { class: "mail-muted" }, An = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, In = {
  key: 0,
  class: "mail-field"
}, Ln = ["for"], Nn = ["for"], zn = ["id"], En = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, On = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Pn = 1024 * 1024, Xa = /* @__PURE__ */ te({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, go: o } = fe(), k = { file: ve(), title: ve(), name: ve() };
    we(() => r.visible);
    const b = ["image/png", "image/jpeg", "image/gif"], x = _(), V = _(), i = _(""), U = _(""), S = _(!1), R = _(!1), C = _();
    let u = { cancelled: !1 };
    const d = _(""), m = _(""), $ = _("");
    X(() => r.visible, (q) => {
      if (!q) {
        u.cancelled = !0;
        return;
      }
      u = { cancelled: !1 }, r.replace || y.ensure("asset"), x.value = V.value = void 0, i.value = r.replace?.title ?? "", U.value = r.replace?.name ?? "", S.value = !1, d.value = m.value = $.value = "";
    }), X(i, (q) => {
      !r.replace && !S.value && (U.value = Ma(q));
    });
    function A(q) {
      return new Promise((g) => {
        const p = URL.createObjectURL(q), f = new Image();
        f.onload = () => {
          g({ width: f.naturalWidth, height: f.naturalHeight }), URL.revokeObjectURL(p);
        }, f.onerror = () => {
          g(void 0), URL.revokeObjectURL(p);
        }, f.src = p;
      });
    }
    async function I(q) {
      const g = Array.isArray(q.files) ? q.files[0] : q.files;
      if (m.value = "", x.value = void 0, !!g) {
        if (!b.includes(g.type)) {
          m.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (g.size > Pn) {
          m.value = "Images must be 1 MB or smaller.";
          return;
        }
        x.value = g, V.value = await A(g), !r.replace && !i.value && (i.value = g.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function M() {
      return $.value = "", r.replace ? !0 : (Da.test(U.value) ? y.find("asset", U.value) && ($.value = `An image named ${U.value} already exists. Choose another name or replace ${U.value}.`) : $.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !$.value);
    }
    async function L() {
      if (R.value || !x.value || !i.value.trim() || !M()) return;
      R.value = !0, d.value = "";
      const q = u;
      try {
        C.value = "upload";
        const g = await Pa.add(x.value);
        C.value = "process", await xn(g, q), C.value = "save";
        const p = { name: U.value, upload_id: g, title: i.value.trim(), ...V.value }, f = r.replace ? await se.replaceAsset(p, r.replace.revision) : await se.addAsset(p);
        y.patch("asset", f.name, ka(f)), c("done", f), c("close"), r.replace || o({ name: "library", section: "assets", asset: f.name });
      } catch (g) {
        if (q.cancelled) return;
        g instanceof Xe ? d.value = "The image could not be processed. Try another file, or upload it again." : Ue(g) === "mail_revision_conflict" && !r.replace ? $.value = `An image named ${U.value} already exists. Choose another name or replace ${U.value}.` : d.value = ie(g, "The image could not be uploaded.");
      } finally {
        R.value = !1, C.value = void 0;
      }
    }
    const E = P(() => C.value === "upload" ? "Uploading the image…" : C.value === "process" ? "Processing the image…" : C.value === "save" ? "Adding it to the library…" : ""), ae = P(() => r.replace ? `Replace ${r.replace.title}` : "Upload image"), le = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (q, g) => (l(), O(a(Ae), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !R.value || C.value === "process",
      "close-on-escape": !R.value || C.value === "process",
      class: "mail-dialog",
      pt: le,
      "aria-label": ae.value,
      "onUpdate:visible": g[4] || (g[4] = (p) => {
        p || c("close");
      })
    }, {
      header: j(() => [
        t("span", Cn, [
          s(a(N), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", Vn, [
          t("span", Sn, h(ae.value), 1),
          t("span", Tn, h(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: R.value && C.value !== "process",
          onClick: g[3] || (g[3] = (p) => c("close"))
        }, null, 8, ["disabled"]),
        s(a(D), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: R.value,
          disabled: !x.value || !e.replace && !i.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: je(L, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: R.value,
            inert: R.value || void 0
          }, [
            t("div", {
              class: ne(["mail-field", { "mail-field-invalid": m.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: k.file
              }, "Image", 8, Un),
              s(a(Ol), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": x.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: k.file, "aria-label": "Image file" } },
                onSelect: I
              }, {
                chooseicon: j(() => [
                  s(a(N), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: j(() => [
                  t("span", jn, h(x.value ? `${x.value.name} · ${a(aa)(x.value.size)}${V.value ? ` · ${V.value.width} × ${V.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              m.value ? (l(), n("small", An, h(m.value), 1)) : T("", !0)
            ], 2),
            e.replace ? T("", !0) : (l(), n("div", In, [
              t("label", {
                class: "mail-field-label",
                for: k.title
              }, "Name", 8, Ln),
              s(a(ce), {
                id: k.title,
                modelValue: i.value,
                "onUpdate:modelValue": g[0] || (g[0] = (p) => i.value = p)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? T("", !0) : (l(), n("div", {
              key: 1,
              class: ne(["mail-field", { "mail-field-invalid": $.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: k.name
              }, "Reference", 8, Nn),
              s(a(ce), {
                id: k.name,
                modelValue: U.value,
                "onUpdate:modelValue": g[1] || (g[1] = (p) => U.value = p),
                class: "mail-mono-input",
                invalid: !!$.value,
                "aria-describedby": k.name + "-hint",
                onInput: g[2] || (g[2] = (p) => S.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: k.name + "-hint",
                class: ne($.value ? "mail-field-error" : "mail-field-hint")
              }, h($.value || "Templates show it with this name. It cannot change later."), 11, zn)
            ], 2))
          ], 8, Rn),
          E.value ? (l(), n("p", En, [
            s(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            G(h(E.value), 1)
          ])) : T("", !0),
          d.value ? (l(), n("p", On, h(d.value), 1)) : T("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Mn = { class: "mail-drawer-head" }, Dn = { class: "mail-drawer-title" }, Bn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, qn = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Hn = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Fn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Jn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, Wn = { class: "mail-asset-actions" }, Kn = { class: "mail-asset-hero" }, Yn = { class: "mail-facts mail-card" }, Gn = { class: "mail-reference" }, Zn = { class: "mail-mono-block" }, Qn = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, Xn = {
  key: 0,
  class: "mail-muted"
}, eo = { class: "mail-list" }, ao = { key: 1 }, lo = {
  key: 0,
  class: "mail-asset-context"
}, to = ["srcdoc", "title"], so = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, io = {
  key: 0,
  class: "mail-muted"
}, no = {
  key: 1,
  class: "mail-history"
}, oo = { class: "mail-history-head" }, ro = { class: "mail-history-main" }, uo = { class: "mail-history-title" }, co = { class: "mail-sub" }, vo = /* @__PURE__ */ te({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, go: o } = fe();
    we(() => !!r.name);
    const k = _();
    X(() => !!r.name, (f) => {
      f && (y.ensure("message"), ea(() => k.value?.focus()));
    }, { immediate: !0 });
    const b = ge(), x = ge([]), V = ge(), i = _(""), U = _(!1), S = _(!1), R = _(""), C = _(""), u = _(""), d = _(), m = _(!1), $ = _(!1), A = _(!1), I = _(), M = xe();
    async function L() {
      const f = r.name, w = M();
      if (!f) {
        b.value = void 0;
        return;
      }
      U.value = !0;
      try {
        const [z, Z] = await Promise.all([se.get({ kind: "asset", name: f }), se.history({ kind: "asset", name: f })]);
        if (!w()) return;
        b.value = z, x.value = Z, S.value = !1, R.value = "";
        const F = z.used_by?.messages?.[0];
        i.value = F ?? "", V.value = F ? await se.preview(F, []) : void 0;
      } catch (z) {
        if (!w()) return;
        S.value = qe(z), R.value = S.value ? "" : ie(z, "This image could not be loaded.");
      } finally {
        w() && (U.value = !1);
      }
    }
    X(() => r.name, () => {
      m.value = $.value = !1, u.value = C.value = "", L();
    }, { immediate: !0 }), y.onRow((f) => {
      f.kind === "asset" && f.name === r.name && L();
    });
    const E = P(() => (b.value?.used_by?.messages ?? []).map((f) => ({ name: f, title: y.title("message", f) })));
    async function ae() {
      const f = b.value;
      if (f)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/assets/${encodeURIComponent(f.name)}`), $.value = !0;
        } catch {
          $.value = !1;
        }
    }
    const le = P(() => b.value ? Ya(b.value.name) : "");
    async function q() {
      try {
        await navigator.clipboard.writeText(le.value), m.value = !0;
      } catch {
        m.value = !1;
      }
    }
    async function g(f, w) {
      const z = b.value;
      if (!z || d.value !== void 0) return;
      if (f === "delete" && E.value.length) {
        I.value = {
          header: `${z.title} is in use`,
          message: `${pe(E.value.length, "message")} ${E.value.length === 1 ? "shows" : "show"} it: ${E.value.map((F) => F.title ?? F.name).join(", ")}. Remove it from ${E.value.length === 1 ? "that message" : "them"} first.`,
          links: E.value.map((F) => ({ label: F.title ?? F.name, open: () => o({ name: "resource", kind: "message", resource: F.name, section: "content" }) }))
        };
        return;
      }
      const Z = {
        reset: { header: `Reset ${z.title} to the original?`, message: `The image included with ${z.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${z.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${w?.version} of ${z.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[f];
      if (await Re.confirm({ header: Z.header, message: Z.message, acceptLabel: Z.accept, rejectLabel: "Cancel", ...f === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        d.value = w ? w.revision : f, C.value = u.value = "";
        try {
          if (f === "delete") {
            await se.remove({ kind: "asset", name: z.name }, z.revision), c("close");
            return;
          }
          b.value = f === "reset" ? await se.reset({ kind: "asset", name: z.name }, z.revision) : await se.restore({ kind: "asset", name: z.name }, w.revision, z.revision), u.value = f === "reset" ? `${z.title} is back to the original.` : `Version ${w.version} is shown again everywhere.`, await L();
        } catch (F) {
          const W = He(F);
          W?.dependents?.length ? I.value = { header: `${z.title} is in use`, message: W.message, links: W.dependents.map((oe) => ({ label: y.title("message", oe) ?? oe, open: () => o({ name: "resource", kind: "message", resource: oe, section: "content" }) })) } : (C.value = Ue(F) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ie(F, "The image could not be changed."), Ue(F) === "mail_revision_conflict" && L());
        } finally {
          d.value = void 0;
        }
      }
    }
    const p = P(() => V.value?.html ? _a(V.value.html, V.value.inline_assets) : "");
    return (f, w) => (l(), n(Y, null, [
      s(a(Fa), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: d.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": w[5] || (w[5] = (z) => {
          z || c("close");
        })
      }, {
        default: j(() => [
          t("div", {
            ref_key: "drawer",
            ref: k,
            class: "mail-drawer-body",
            tabindex: "-1"
          }, [
            t("header", Mn, [
              t("div", Dn, [
                b.value?.state === "customized" ? (l(), O(a(Ee), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : T("", !0),
                t("h2", null, h(b.value?.title ?? "Image"), 1)
              ]),
              s(a(D), {
                text: "",
                severity: "secondary",
                disabled: !b.value,
                "aria-label": $.value ? "Link copied" : "Copy link",
                title: $.value ? "Link copied" : "Copy link",
                onClick: ae
              }, {
                icon: j(() => [
                  s(a(N), {
                    icon: $.value ? "tabler:check" : "tabler:link",
                    "aria-hidden": "true"
                  }, null, 8, ["icon"])
                ]),
                _: 1
              }, 8, ["disabled", "aria-label", "title"]),
              s(a(D), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: d.value !== void 0,
                onClick: w[0] || (w[0] = (z) => c("close"))
              }, {
                icon: j(() => [
                  s(a(N), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            U.value && !b.value ? (l(), n("p", Bn, [
              s(a(N), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              w[9] || (w[9] = G("Loading image…", -1))
            ])) : S.value ? (l(), n("p", qn, [
              s(a(N), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              w[10] || (w[10] = G("This image no longer exists. It was deleted while you were away.", -1))
            ])) : R.value ? (l(), n("div", Hn, [
              t("span", null, h(R.value), 1),
              s(a(D), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: w[1] || (w[1] = (z) => L())
              })
            ])) : T("", !0),
            b.value ? (l(), n(Y, { key: 3 }, [
              C.value ? (l(), n("p", Fn, [
                s(a(N), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                G(h(C.value), 1)
              ])) : T("", !0),
              u.value ? (l(), n("p", Jn, [
                s(a(N), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                G(h(u.value), 1)
              ])) : T("", !0),
              t("div", Wn, [
                s(a(D), {
                  label: "Replace",
                  disabled: d.value !== void 0,
                  onClick: w[2] || (w[2] = (z) => A.value = !0)
                }, {
                  icon: j(() => [
                    s(a(N), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                b.value.state === "customized" ? (l(), O(a(D), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: d.value === "reset",
                  disabled: d.value !== void 0,
                  onClick: w[3] || (w[3] = (z) => g("reset"))
                }, {
                  icon: j(() => [
                    s(a(N), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : T("", !0),
                b.value.state === "created" ? (l(), O(a(D), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: d.value === "delete",
                  disabled: d.value !== void 0,
                  onClick: w[4] || (w[4] = (z) => g("delete"))
                }, {
                  icon: j(() => [
                    s(a(N), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : T("", !0)
              ]),
              t("div", Kn, [
                s(Qa, {
                  name: b.value.name,
                  revision: b.value.revision,
                  asset: b.value.asset,
                  large: "",
                  alt: b.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", Yn, [
                w[12] || (w[12] = t("dt", null, "Reference", -1)),
                t("dd", Gn, [
                  t("span", Zn, h(le.value), 1),
                  s(a(D), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": m.value ? "Reference copied" : "Copy reference",
                    title: m.value ? "Reference copied" : "Copy reference",
                    onClick: q
                  }, {
                    icon: j(() => [
                      s(a(N), {
                        icon: m.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                w[13] || (w[13] = t("dt", null, "File", -1)),
                t("dd", null, h(b.value.asset?.filename) + " · " + h(a(aa)(b.value.asset?.size)), 1),
                b.value.asset?.width ? (l(), n(Y, { key: 0 }, [
                  w[11] || (w[11] = t("dt", null, "Size", -1)),
                  t("dd", null, h(b.value.asset.width) + " × " + h(b.value.asset.height), 1)
                ], 64)) : T("", !0),
                w[14] || (w[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  s(xa, { resource: b.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", Qn, [
                w[15] || (w[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                E.value.length ? (l(), n(Y, { key: 1 }, [
                  t("ul", eo, [
                    (l(!0), n(Y, null, me(E.value, (z) => (l(), n("li", {
                      key: z.name
                    }, [
                      s(a(D), {
                        text: "",
                        severity: "secondary",
                        class: "mail-row-link",
                        onClick: (Z) => a(o)({ name: "resource", kind: "message", resource: z.name, section: "content" })
                      }, {
                        default: j(() => [
                          s(a(N), {
                            icon: a(ye).message,
                            "aria-hidden": "true"
                          }, null, 8, ["icon"]),
                          z.title === void 0 ? (l(), O(a(Ce), {
                            key: 0,
                            width: "8rem",
                            height: "1rem"
                          })) : (l(), n("span", ao, h(z.title), 1))
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]))), 128))
                  ]),
                  p.value ? (l(), n("div", lo, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: p.value,
                      title: "How " + b.value.title + " looks in " + (a(y).title("message", i.value) ?? "")
                    }, null, 8, to)
                  ])) : T("", !0)
                ], 64)) : (l(), n("p", Xn, "No message shows " + h(b.value.title) + " with its sample values.", 1))
              ]),
              t("section", so, [
                w[16] || (w[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                x.value.length ? (l(), n("ol", no, [
                  (l(!0), n(Y, null, me(x.value, (z) => (l(), n("li", {
                    key: z.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", oo, [
                      t("div", ro, [
                        t("span", uo, [
                          G("Version " + h(z.version) + " · " + h(a(ya)[z.action]) + " ", 1),
                          z.revision === b.value.revision ? (l(), O(a(Ee), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : T("", !0)
                        ]),
                        t("span", co, [
                          G(h(a(ke)(z.author_label, z.author)) + " · " + h(a(Je)(z.created_at)) + " ", 1),
                          z.content.asset?.filename ? (l(), n(Y, { key: 0 }, [
                            G(" · " + h(z.content.asset.filename), 1)
                          ], 64)) : T("", !0)
                        ])
                      ]),
                      z.revision !== b.value.revision ? (l(), O(a(D), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: d.value === z.revision,
                        disabled: d.value !== void 0,
                        onClick: (Z) => g("restore", z)
                      }, {
                        icon: j(() => [
                          s(a(N), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : T("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), n("p", io, h(b.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : T("", !0)
          ], 512)
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      b.value ? (l(), O(Xa, {
        key: 0,
        visible: A.value,
        replace: b.value,
        onClose: w[6] || (w[6] = (z) => A.value = !1),
        onDone: w[7] || (w[7] = (z) => L())
      }, null, 8, ["visible", "replace"])) : T("", !0),
      s(Za, {
        refusal: I.value,
        onClose: w[8] || (w[8] = (z) => I.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), mo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, fo = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, bo = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, yo = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, po = { class: "mail-toolbar" }, go = {
  class: "mail-count",
  role: "status"
}, ho = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, ko = { class: "mail-sub" }, $o = { class: "mail-mono-block" }, wo = { class: "mail-muted" }, _o = { key: 1 }, xo = { class: "mail-muted" }, Co = /* @__PURE__ */ te({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const v = e, { go: r, upload: c, library: y } = fe();
    y.use("asset");
    const o = _(""), k = _("");
    let b;
    X(o, (M) => {
      clearTimeout(b), b = setTimeout(() => {
        k.value = M.trim();
      }, 250);
    });
    const x = ge([]), V = _(!0), i = _(!1), U = _(!1), S = _(""), R = _(""), C = xe();
    async function u(M = !1) {
      const L = C();
      V.value = !0;
      try {
        const E = await se.assets(k.value || void 0);
        if (!L()) return;
        x.value = E, S.value = R.value = "", U.value = !1, i.value = !0;
      } catch (E) {
        if (!L()) return;
        U.value = Fe(E);
        const ae = U.value ? "" : ie(E, "Images could not be loaded.");
        M && i.value && !U.value ? R.value = ae : S.value = ae;
      } finally {
        L() && (V.value = !1);
      }
    }
    X(k, () => {
      u();
    }), la(() => u(i.value)), y.onRow((M, L, E) => {
      if (M.kind !== "asset") return;
      const ae = x.value.findIndex((q) => q.name === M.name), le = [...x.value];
      if (ae >= 0)
        E ? le[ae] = E : le.splice(ae, 1);
      else if (E && !k.value) le.push(E);
      else return;
      x.value = le;
    });
    function d(M) {
      const L = y.find("asset", M.name)?.used_by?.messages;
      return L === void 0 ? y.ready("asset") ? "—" : void 0 : L ? pe(L, "message") : "—";
    }
    const m = P(() => x.value.reduce((M, L) => M + (L.asset?.size ?? 0), 0)), $ = P(() => `${pe(x.value.length, "image")} · ${aa(m.value)}`);
    function A(M) {
      const L = M.asset;
      return L ? (L.width && L.height ? `${L.width} × ${L.height} · ` : "") + aa(L.size) : "";
    }
    function I(M) {
      r({ name: "library", section: "assets", asset: M.name });
    }
    return (M, L) => (l(), n(Y, null, [
      s(ta, {
        title: "Images",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: j(() => [
          s(a(D), {
            label: "Upload image",
            onClick: L[0] || (L[0] = (E) => a(c)())
          }, {
            icon: j(() => [
              s(a(N), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      U.value ? (l(), n("p", mo, [
        s(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        L[7] || (L[7] = G("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : S.value ? (l(), n("div", fo, [
        t("span", null, h(S.value), 1),
        s(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: L[1] || (L[1] = (E) => u())
        })
      ])) : T("", !0),
      R.value ? (l(), n("div", bo, [
        t("span", null, h(R.value) + " The list shows what was loaded before.", 1),
        s(a(D), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: L[2] || (L[2] = (E) => u(!0))
        })
      ])) : V.value && !i.value ? (l(), n("p", yo, [
        s(a(N), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        L[8] || (L[8] = G("Loading images…", -1))
      ])) : i.value && !x.value.length && !k.value ? (l(), O($a, {
        key: 4,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: L[3] || (L[3] = (E) => a(c)())
      })) : i.value ? (l(), n(Y, { key: 5 }, [
        t("div", po, [
          s(a(ga), { class: "mail-search" }, {
            default: j(() => [
              s(a(ha), null, {
                default: j(() => [
                  s(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: o.value,
                "onUpdate:modelValue": L[4] || (L[4] = (E) => o.value = E),
                type: "search",
                "aria-label": "Search images",
                placeholder: "Search images…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", go, h($.value), 1)
        ]),
        x.value.length ? (l(), O(a(pa), {
          key: 1,
          value: x.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Images" } },
          onRowClick: L[5] || (L[5] = (E) => I(E.data))
        }, {
          default: j(() => [
            s(a(de), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: j(({ data: E }) => [
                s(Qa, {
                  name: E.name,
                  revision: E.revision,
                  asset: E.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            s(a(de), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: j(({ data: E }) => [
                s(a(D), {
                  link: "",
                  class: "mail-name",
                  label: E.title,
                  onClick: je((ae) => I(E), ["stop"])
                }, null, 8, ["label", "onClick"]),
                t("span", ko, [
                  t("span", $o, h(E.name), 1),
                  E.asset?.filename ? (l(), n(Y, { key: 0 }, [
                    G(" · " + h(E.asset.filename), 1)
                  ], 64)) : T("", !0)
                ])
              ]),
              _: 1
            }),
            s(a(de), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: E }) => [
                t("span", wo, h(A(E)), 1)
              ]),
              _: 1
            }),
            s(a(de), {
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: j(({ data: E }) => [
                d(E) === void 0 ? (l(), O(a(Ce), {
                  key: 0,
                  width: "5rem",
                  height: "1rem"
                })) : (l(), n("span", _o, h(d(E)), 1))
              ]),
              _: 1
            }),
            s(a(de), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: j(({ data: E }) => [
                s(xa, { resource: E }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            s(a(de), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: j(({ data: E }) => [
                t("span", xo, h(E.state === "original" ? "—" : a(Oa)(E.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), n("p", ho, "Nothing matches. Try another name."))
      ], 64)) : T("", !0),
      s(vo, {
        name: v.asset,
        onClose: L[6] || (L[6] = (E) => a(r)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), Vo = { class: "kx-modal-head-icon" }, So = { class: "kx-modal-head-text" }, To = { class: "kx-modal-head-title" }, Ro = { class: "kx-modal-head-sub" }, Uo = ["id"], jo = ["disabled", "inert"], Ao = {
  key: 0,
  class: "mail-field"
}, Io = {
  key: 1,
  class: "mail-field"
}, Lo = ["for"], No = { class: "mail-field" }, zo = ["for"], Eo = ["for"], Oo = ["id"], Po = { class: "mail-field" }, Mo = ["for"], Do = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Te = "\0blank", Bo = /* @__PURE__ */ te({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, go: o } = fe(), k = _("message"), b = _(""), x = _(""), V = _(""), i = _(""), U = _(!1), S = _(!1), R = _(""), C = _(""), u = { title: ve(), reference: ve(), description: ve(), source: ve(), hint: ve() }, d = ["message", "base", "part"].map((q) => ({ value: q, label: be[q] })), m = P(() => !!r.intent.from), $ = P(() => [
      { value: Te, label: "Blank" },
      ...y.ofKind(k.value).map((q) => ({ value: q.name, label: q.title }))
    ]), A = P(() => b.value === Te || !!y.find(k.value, b.value));
    function I(q) {
      if (b.value = q, q === Te) return;
      const g = y.find(k.value, q);
      g && (i.value = g.description, r.intent.from && (x.value = `${g.title} copy`, U.value = !1));
    }
    X(() => r.visible, async (q) => {
      q && (k.value = r.intent.from?.kind ?? r.intent.kind ?? "message", x.value = V.value = i.value = b.value = "", R.value = C.value = "", U.value = !1, r.intent.from ? (b.value = r.intent.from.name, y.ready(k.value) || await y.load(k.value), r.visible && I(r.intent.from.name)) : (b.value = Te, y.ensure(k.value)));
    }, { immediate: !0 }), X(k, (q) => {
      r.intent.from || (b.value = Te, i.value = "", r.visible && y.ensure(q));
    }), we(() => r.visible), X(x, (q) => {
      U.value || (V.value = Ma(q));
    });
    const M = P(() => k.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function L() {
      return C.value = "", V.value ? Da.test(V.value) ? y.find(k.value, V.value) && (C.value = `A ${be[k.value].toLowerCase()} with this reference already exists. Choose another.`) : C.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : C.value = "Enter a reference.", !C.value;
    }
    async function E() {
      if (!(S.value || !x.value.trim() || !A.value || !L())) {
        S.value = !0, R.value = "";
        try {
          const q = b.value === Te ? await se.create(Jt(k.value, V.value, x.value.trim(), i.value.trim())) : await se.copy({
            kind: k.value,
            name: V.value,
            title: x.value.trim(),
            description: i.value.trim(),
            from: { kind: k.value, name: b.value }
          });
          y.patch(q.kind, q.name, ka(q)), c("close"), o({ name: "resource", kind: q.kind, resource: q.name, section: "content" });
        } catch (q) {
          Ue(q) === "mail_revision_conflict" ? C.value = `A ${be[k.value].toLowerCase()} with this reference already exists. Choose another.` : R.value = ie(q, "The resource could not be created.");
        } finally {
          S.value = !1;
        }
      }
    }
    const ae = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, le = P(() => r.intent.from ? `Duplicate ${y.title(r.intent.from.kind, r.intent.from.name) ?? ""}`.trim() : `New ${be[k.value].toLowerCase()}`);
    return (q, g) => (l(), O(a(Ae), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !S.value,
      "close-on-escape": !S.value,
      class: "mail-dialog",
      pt: ae,
      "aria-label": le.value,
      "onUpdate:visible": g[6] || (g[6] = (p) => {
        p || c("close");
      })
    }, {
      header: j(() => [
        t("span", Vo, [
          s(a(N), {
            icon: a(ye)[k.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", So, [
          t("span", To, h(le.value), 1),
          t("span", Ro, h(b.value === Te ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: j(() => [
        s(a(D), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: S.value,
          onClick: g[5] || (g[5] = (p) => c("close"))
        }, null, 8, ["disabled"]),
        s(a(D), {
          label: "Create " + a(be)[k.value].toLowerCase(),
          type: "submit",
          form: u.hint,
          loading: S.value,
          disabled: !x.value.trim() || !A.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: j(() => [
        t("form", {
          id: u.hint,
          class: "mail-form",
          onSubmit: je(E, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: S.value,
            inert: S.value || void 0
          }, [
            m.value ? T("", !0) : (l(), n("div", Ao, [
              g[7] || (g[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              s(a($e), {
                modelValue: k.value,
                "onUpdate:modelValue": g[0] || (g[0] = (p) => k.value = p),
                options: a(d),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            m.value ? T("", !0) : (l(), n("div", Io, [
              t("label", {
                class: "mail-field-label",
                for: u.source
              }, "Start from", 8, Lo),
              s(a(Oe), {
                "model-value": b.value,
                "input-id": u.source,
                options: $.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                filter: "",
                loading: !a(y).ready(k.value),
                "onUpdate:modelValue": I
              }, null, 8, ["model-value", "input-id", "options", "loading"])
            ])),
            t("div", No, [
              t("label", {
                class: "mail-field-label",
                for: u.title
              }, "Name", 8, zo),
              s(a(ce), {
                id: u.title,
                modelValue: x.value,
                "onUpdate:modelValue": g[1] || (g[1] = (p) => x.value = p),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: ne(["mail-field", { "mail-field-invalid": C.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: u.reference
              }, "Reference", 8, Eo),
              s(a(ce), {
                id: u.reference,
                modelValue: V.value,
                "onUpdate:modelValue": g[2] || (g[2] = (p) => V.value = p),
                class: "mail-mono-input",
                invalid: !!C.value,
                "aria-describedby": u.reference + "-hint",
                onInput: g[3] || (g[3] = (p) => U.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: u.reference + "-hint",
                class: ne(C.value ? "mail-field-error" : "mail-field-hint")
              }, h(C.value || M.value), 11, Oo)
            ], 2),
            t("div", Po, [
              t("label", {
                class: "mail-field-label",
                for: u.description
              }, "Description", 8, Mo),
              s(a(ca), {
                id: u.description,
                modelValue: i.value,
                "onUpdate:modelValue": g[4] || (g[4] = (p) => i.value = p),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, jo),
          R.value ? (l(), n("p", Do, h(R.value), 1)) : T("", !0)
        ], 40, Uo)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), qo = { class: "mail-drawer-head" }, Ho = { class: "mail-drawer-title" }, Fo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Jo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Wo = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Ko = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, Yo = {
  key: 0,
  class: "kx-notice error mail-failure"
}, Go = { class: "mail-failure-body" }, Zo = { key: 0 }, Qo = {
  key: 1,
  class: "mail-failure-done",
  role: "status"
}, Xo = {
  key: 2,
  class: "mail-sub"
}, er = {
  key: 3,
  class: "mail-sub"
}, ar = {
  key: 4,
  class: "mail-field-error",
  role: "alert"
}, lr = { key: 5 }, tr = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, sr = { class: "mail-facts mail-card" }, ir = { key: 2 }, nr = {
  key: 0,
  class: "mail-sub"
}, or = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, rr = { class: "mail-timeline" }, ur = { class: "mail-muted" }, dr = { class: "mail-facts" }, cr = { class: "mail-mono-block" }, vr = /* @__PURE__ */ te({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close"],
  setup(e, { emit: v }) {
    const r = e, c = v, { library: y, go: o, capabilities: k } = fe();
    we(() => !!r.messageId);
    const b = _();
    X(() => !!r.messageId, (p) => {
      p && ea(() => b.value?.focus());
    }, { immediate: !0 });
    const x = /* @__PURE__ */ new Set([
      "invalid_config",
      "settings_read_failed",
      "invalid_driver_descriptor",
      "duplicate_driver_id",
      "driver_availability_invalid",
      "provider_endpoint_invalid",
      "credentials_invalid"
    ]), V = P(() => !!i.value?.last_error && x.has(i.value.last_error.code)), i = ge(), U = _(!1), S = _(!1), R = _(!1), C = _(""), u = _(""), d = _(!1), m = _(), $ = _(!1), A = xe();
    async function I() {
      const p = r.messageId, f = A();
      if (!p) {
        i.value = void 0;
        return;
      }
      U.value = !0;
      try {
        const w = await De.get(p);
        if (!f()) return;
        i.value = w, C.value = "", S.value = R.value = !1;
      } catch (w) {
        if (!f()) return;
        i.value = void 0, S.value = qe(w), R.value = Fe(w), C.value = S.value || R.value ? "" : ie(w, "This message could not be loaded.");
      } finally {
        f() && (U.value = !1);
      }
    }
    X(() => r.messageId, (p) => {
      m.value = void 0, u.value = "", $.value = !1, p !== i.value?.message_id && (i.value = void 0), I();
    }, { immediate: !0 }), Ba((p) => {
      p.message_id === r.messageId && I();
    });
    async function M() {
      const p = i.value;
      if (!(!p || d.value)) {
        d.value = !0, u.value = "";
        try {
          m.value = await De.resend(p.message_id);
        } catch (f) {
          u.value = ie(f, "The message could not be sent again.");
        } finally {
          d.value = !1;
        }
      }
    }
    async function L() {
      const p = i.value;
      if (p)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(p.message_id)}`), $.value = !0;
        } catch {
          $.value = !1;
        }
    }
    const E = P(() => {
      const p = i.value?.template;
      return p ? y.title("message", p) : "";
    }), ae = P(() => !!i.value?.template && !!y.find("message", i.value.template)), le = P(() => {
      const p = i.value;
      if (!p) return [];
      const f = [{ label: "Accepted for delivery", at: p.created_at }];
      return p.status === "queued" && p.next_attempt_at && f.push({ label: p.attempts ? `Attempt ${p.attempts} did not go through; trying again` : "Next delivery attempt", at: p.next_attempt_at }), p.sent_at ? f.push({ label: p.attempts > 1 ? `Sent after ${p.attempts} attempts` : "Sent", at: p.sent_at }) : p.status === "failed" && p.finished_at && f.push({ label: p.attempts > 1 ? `Failed after ${p.attempts} attempts` : "Failed", at: p.finished_at }), f;
    }), q = P(() => (i.value?.attachments ?? []).map((p) => p.filename || "Attachment")), g = P(() => {
      const p = i.value;
      return p ? [
        { label: "Message ID", value: p.message_id },
        { label: "Delivery service", value: k.value?.administer_delivery ? p.driver_id : void 0 },
        { label: "Service message ID", value: p.provider_message_id },
        { label: "Error code", value: p.last_error?.code },
        { label: "Service response", value: p.last_error?.provider_detail }
      ].filter((f) => !!f.value) : [];
    });
    return (p, f) => (l(), O(a(Fa), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !d.value,
      "close-on-escape": !d.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": f[6] || (f[6] = (w) => {
        w || c("close");
      })
    }, {
      default: j(() => [
        t("div", {
          ref_key: "drawer",
          ref: b,
          class: "mail-drawer-body",
          tabindex: "-1"
        }, [
          t("header", qo, [
            t("div", Ho, [
              i.value ? (l(), O(a(Ee), {
                key: 0,
                severity: a(Ha)[i.value.status],
                value: a(qa)[i.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : T("", !0),
              t("h2", null, h(i.value?.subject ?? "Message"), 1)
            ]),
            s(a(D), {
              text: "",
              severity: "secondary",
              disabled: !i.value,
              "aria-label": $.value ? "Link copied" : "Copy link",
              title: $.value ? "Link copied" : "Copy link",
              onClick: L
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: $.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            s(a(D), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: d.value,
              onClick: f[0] || (f[0] = (w) => c("close"))
            }, {
              icon: j(() => [
                s(a(N), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          U.value && !i.value ? (l(), n("p", Fo, [
            s(a(N), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            f[7] || (f[7] = G("Loading message…", -1))
          ])) : S.value ? (l(), n("p", Jo, [
            s(a(N), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            f[8] || (f[8] = G("This message is no longer in Activity.", -1))
          ])) : R.value ? (l(), n("p", Wo, [
            s(a(N), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            f[9] || (f[9] = G("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : C.value ? (l(), n("div", Ko, [
            t("span", null, h(C.value), 1),
            s(a(D), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: f[1] || (f[1] = (w) => I())
            })
          ])) : T("", !0),
          i.value ? (l(), n(Y, { key: 4 }, [
            i.value.status === "failed" ? (l(), n("div", Yo, [
              s(a(N), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Go, [
                f[12] || (f[12] = t("strong", null, "This message was not delivered.", -1)),
                i.value.last_error ? (l(), n("span", Zo, h(i.value.last_error.message), 1)) : T("", !0),
                m.value ? (l(), n("p", Qo, [
                  f[10] || (f[10] = G(" Sent again as a new message. ", -1)),
                  s(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open the new message",
                    onClick: f[2] || (f[2] = (w) => a(o)({ name: "activity", message: m.value.message_id }))
                  })
                ])) : V.value ? (l(), n("p", Xo, [
                  f[11] || (f[11] = G("Sending it again fails the same way until the delivery settings are corrected. ", -1)),
                  a(k)?.administer_delivery ? (l(), O(a(D), {
                    key: 0,
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "Open delivery settings",
                    onClick: f[3] || (f[3] = (w) => a(Re).navigate("/system/settings/mail"))
                  })) : T("", !0)
                ])) : i.value.can_resend ? T("", !0) : (l(), n("p", er, "It cannot be sent again because its content was not kept.")),
                u.value ? (l(), n("p", ar, h(u.value), 1)) : T("", !0),
                i.value.can_resend && !m.value && !V.value ? (l(), n("div", lr, [
                  s(a(D), {
                    label: "Send again",
                    loading: d.value,
                    onClick: M
                  }, {
                    icon: j(() => [
                      s(a(N), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : T("", !0)
              ])
            ])) : i.value.status === "queued" ? (l(), n("p", tr, [
              s(a(N), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              f[13] || (f[13] = G("Waiting to be delivered. ", -1))
            ])) : T("", !0),
            t("dl", sr, [
              f[19] || (f[19] = t("dt", null, "To", -1)),
              t("dd", null, h(i.value.to.join(", ")), 1),
              i.value.cc?.length ? (l(), n(Y, { key: 0 }, [
                f[14] || (f[14] = t("dt", null, "Cc", -1)),
                t("dd", null, h(i.value.cc.join(", ")), 1)
              ], 64)) : T("", !0),
              i.value.bcc?.length ? (l(), n(Y, { key: 1 }, [
                f[15] || (f[15] = t("dt", null, "Bcc", -1)),
                t("dd", null, h(i.value.bcc.join(", ")), 1)
              ], 64)) : T("", !0),
              i.value.reply_to ? (l(), n(Y, { key: 2 }, [
                f[16] || (f[16] = t("dt", null, "Reply-to", -1)),
                t("dd", null, h(i.value.reply_to), 1)
              ], 64)) : T("", !0),
              f[20] || (f[20] = t("dt", null, "Template", -1)),
              t("dd", null, [
                E.value === void 0 ? (l(), O(a(Ce), {
                  key: 0,
                  width: "8rem",
                  height: "1rem"
                })) : ae.value ? (l(), O(a(D), {
                  key: 1,
                  link: "",
                  size: "small",
                  class: "mail-inline-link",
                  label: E.value,
                  onClick: f[4] || (f[4] = (w) => a(o)({ name: "resource", kind: "message", resource: i.value.template, section: "content" }))
                }, null, 8, ["label"])) : (l(), n("span", ir, h(E.value || "Written directly"), 1))
              ]),
              f[21] || (f[21] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                G(h(a(ke)(i.value.sender_label, i.value.sender)), 1),
                i.value.origin ? (l(), n("span", nr, h(a(sa)(i.value.origin)), 1)) : T("", !0)
              ]),
              q.value.length ? (l(), n(Y, { key: 3 }, [
                f[17] || (f[17] = t("dt", null, "Attachments", -1)),
                t("dd", null, h(q.value.join(", ")), 1)
              ], 64)) : T("", !0),
              i.value.resend_of ? (l(), n(Y, { key: 4 }, [
                f[18] || (f[18] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  s(a(D), {
                    link: "",
                    size: "small",
                    class: "mail-inline-link",
                    label: "The original message",
                    onClick: f[5] || (f[5] = (w) => a(o)({ name: "activity", message: i.value.resend_of }))
                  })
                ])
              ], 64)) : T("", !0)
            ]),
            t("section", or, [
              f[22] || (f[22] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", rr, [
                (l(!0), n(Y, null, me(le.value, (w) => (l(), n("li", {
                  key: w.label
                }, [
                  t("span", null, h(w.label), 1),
                  t("span", ur, h(a(Je)(w.at)), 1)
                ]))), 128))
              ])
            ]),
            g.value.length ? (l(), O(Ga, {
              key: 2,
              label: "Technical details"
            }, {
              default: j(() => [
                t("dl", dr, [
                  (l(!0), n(Y, null, me(g.value, (w) => (l(), n(Y, {
                    key: w.label
                  }, [
                    t("dt", null, h(w.label), 1),
                    t("dd", cr, h(w.value), 1)
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
}), mr = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, fr = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, br = { class: "mail-health-text" }, yr = { class: "mail-toolbar" }, pr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, gr = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, hr = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, kr = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, $r = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, wr = { class: "mail-sub" }, _r = {
  key: 0,
  class: "mail-sub"
}, xr = { class: "mail-muted" }, Cr = {
  key: 2,
  class: "mail-more"
}, Vr = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Sr = /* @__PURE__ */ te({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const v = e, { library: r, go: c, capabilities: y } = fe();
    r.use("message");
    const o = _("all"), k = _(v.template ?? null), b = _(30), x = _(""), V = _("");
    let i;
    X(x, (ee) => {
      clearTimeout(i), i = setTimeout(() => {
        V.value = ee.trim();
      }, 250);
    }), X(() => v.template, (ee) => {
      ee !== void 0 && (k.value = ee);
    });
    const U = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], S = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], R = P(() => r.ofKind("message").map((ee) => ({ label: ee.title, value: ee.name }))), C = ge([]), u = _(), d = _(!0), m = _(!1), $ = _(!1), A = _(!1), I = _(""), M = _(""), L = _(""), E = xe();
    function ae(ee) {
      return {
        status: o.value === "all" ? void 0 : o.value,
        message: k.value || void 0,
        since: Date.now() - b.value * 24 * 60 * 60 * 1e3,
        q: V.value || void 0,
        cursor: ee
      };
    }
    async function le(ee = !1) {
      const K = E();
      d.value = !0;
      try {
        const J = await De.list(ae());
        if (!K()) return;
        C.value = J.items, u.value = J.next_cursor, g.value = J.total, p.value = J.failed_today ?? 0, I.value = M.value = L.value = "", A.value = !1, m.value = !0;
      } catch (J) {
        if (!K()) return;
        A.value = Fe(J);
        const he = A.value ? "" : ie(J, "Activity could not be loaded.");
        ee && m.value && !A.value ? L.value = he : I.value = he;
      } finally {
        K() && (d.value = !1);
      }
    }
    async function q() {
      if (!u.value || $.value) return;
      const ee = E();
      $.value = !0, M.value = "";
      try {
        const K = await De.list(ae(u.value));
        if (!ee()) return;
        const J = new Set(C.value.map((he) => he.message_id));
        C.value = [...C.value, ...K.items.filter((he) => !J.has(he.message_id))], u.value = K.next_cursor;
      } catch (K) {
        ee() && (M.value = ie(K, "More activity could not be loaded."));
      } finally {
        $.value = !1;
      }
    }
    const g = _(), p = _(0);
    X([o, k, b, V], () => {
      le();
    }), la(() => le(m.value));
    function f(ee) {
      const K = ae();
      return K.q ? !1 : (!K.status || ee.status === K.status) && (!K.message || ee.template === K.message) && ee.created_at >= K.since;
    }
    Ba(async (ee) => {
      if (!m.value) return;
      let K;
      try {
        K = await De.get(ee.message_id);
      } catch {
        return;
      }
      const J = C.value.findIndex((Ie) => Ie.message_id === K.message_id);
      if ((J >= 0 ? C.value[J] : void 0)?.status !== "failed" && K.status === "failed" && K.created_at >= $l() && p.value++, J >= 0) {
        const Ie = [...C.value];
        Ie[J] = K, C.value = Ie;
      } else f(K) && (C.value = [K, ...C.value], g.value !== void 0 && g.value++);
    });
    const w = P(() => pe(g.value ?? C.value.length, "message")), z = P(() => p.value ? `${pe(p.value, "message")} failed today.` : ""), Z = P(() => !!y.value?.administer_delivery), F = P(() => Z.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function W(ee) {
      return ee ? r.title("message", ee) : "—";
    }
    function oe(ee) {
      c({ name: "activity", message: ee.message_id });
    }
    function Ve() {
      c({ name: "activity", template: k.value || void 0 });
    }
    return (ee, K) => (l(), n(Y, null, [
      s(ta, {
        title: "Activity",
        description: F.value
      }, null, 8, ["description"]),
      A.value ? (l(), n("p", mr, [
        s(a(N), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        K[8] || (K[8] = G("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), n(Y, { key: 1 }, [
        z.value ? (l(), n("p", fr, [
          s(a(N), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", br, [
            t("strong", null, h(z.value), 1),
            G(" " + h(o.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          o.value !== "failed" ? (l(), O(a(D), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: K[0] || (K[0] = (J) => o.value = "failed")
          })) : T("", !0)
        ])) : T("", !0),
        t("div", yr, [
          s(a($e), {
            modelValue: o.value,
            "onUpdate:modelValue": K[1] || (K[1] = (J) => o.value = J),
            options: U,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          s(a(Oe), {
            modelValue: k.value,
            "onUpdate:modelValue": K[2] || (K[2] = (J) => k.value = J),
            options: R.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          s(a(Oe), {
            modelValue: b.value,
            "onUpdate:modelValue": K[3] || (K[3] = (J) => b.value = J),
            options: S,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          s(a(ga), { class: "mail-search" }, {
            default: j(() => [
              s(a(ha), null, {
                default: j(() => [
                  s(a(N), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: x.value,
                "onUpdate:modelValue": K[4] || (K[4] = (J) => x.value = J),
                type: "search",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          m.value ? (l(), n("span", pr, h(w.value), 1)) : T("", !0)
        ]),
        I.value ? (l(), n("div", gr, [
          t("span", null, h(I.value), 1),
          s(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: K[5] || (K[5] = (J) => le())
          })
        ])) : T("", !0),
        L.value ? (l(), n("div", hr, [
          t("span", null, h(L.value) + " The list shows what was loaded before.", 1),
          s(a(D), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: K[6] || (K[6] = (J) => le(!0))
          })
        ])) : d.value && !m.value ? (l(), n("p", kr, [
          s(a(N), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          K[9] || (K[9] = G("Loading activity…", -1))
        ])) : m.value ? (l(), n(Y, { key: 4 }, [
          C.value.length ? (l(), O(a(pa), {
            key: 1,
            value: C.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: K[7] || (K[7] = (J) => oe(J.data))
          }, {
            default: j(() => [
              s(a(de), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: j(({ data: J }) => [
                  s(a(Ee), {
                    severity: a(Ha)[J.status],
                    value: a(qa)[J.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              s(a(de), { header: "Message" }, {
                body: j(({ data: J }) => [
                  s(a(D), {
                    link: "",
                    class: "mail-name",
                    label: J.subject,
                    onClick: je((he) => oe(J), ["stop"])
                  }, null, 8, ["label", "onClick"]),
                  t("span", wr, h(a(wl)(J.to)), 1)
                ]),
                _: 1
              }),
              s(a(de), { header: "Template" }, {
                body: j(({ data: J }) => [
                  W(J.template) === void 0 ? (l(), O(a(Ce), {
                    key: 0,
                    width: "8rem",
                    height: "1rem"
                  })) : (l(), n(Y, { key: 1 }, [
                    G(h(W(J.template)), 1)
                  ], 64))
                ]),
                _: 1
              }),
              s(a(de), { header: "Sent by" }, {
                body: j(({ data: J }) => [
                  t("span", null, h(a(ke)(J.sender_label, J.sender)), 1),
                  J.origin ? (l(), n("span", _r, h(a(sa)(J.origin)), 1)) : T("", !0)
                ]),
                _: 1
              }),
              s(a(de), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: j(({ data: J }) => [
                  t("span", xr, h(a(_l)(J.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), n("p", $r, h(V.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          u.value ? (l(), n("div", Cr, [
            M.value ? (l(), n("span", Vr, h(M.value), 1)) : T("", !0),
            s(a(D), {
              label: M.value ? "Retry" : "Show more",
              severity: "secondary",
              outlined: "",
              loading: $.value,
              onClick: q
            }, null, 8, ["label", "loading"])
          ])) : T("", !0)
        ], 64)) : T("", !0)
      ], 64)),
      s(vr, {
        "message-id": e.message,
        onClose: Ve
      }, null, 8, ["message-id"])
    ], 64));
  }
}), Tr = { class: "kx-shell kx-settings-shell mail-admin" }, Rr = { class: "kx-main" }, Ur = /* @__PURE__ */ te({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: v }) {
    const r = e, c = v, y = ge(Ia(r.route ?? "")), o = P(() => y.value), k = _(!1);
    X(k, (w) => c("dirty-change", w), { flush: "sync" });
    let b = !1;
    async function x() {
      if (!k.value) return !0;
      if (b) return !1;
      b = !0;
      try {
        return await Re.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        b = !1;
      }
    }
    function V(w, z) {
      return w.name === "resource" && z.name === "resource" && w.kind === z.kind && w.resource === z.resource;
    }
    async function i(w) {
      const z = Ne(w);
      !V(o.value, w) && !await x() || (V(o.value, w) || (k.value = !1), y.value = w, r.route !== void 0 && z !== r.route && c("navigate", z));
    }
    X(() => r.route, async (w, z) => {
      if (w === void 0) return;
      const Z = Ia(w);
      if (Ne(Z) !== Ne(y.value)) {
        if (!V(y.value, Z) && k.value) {
          if (!await x()) {
            z !== void 0 && r.route === w && c("navigate", Ne(y.value));
            return;
          }
          k.value = !1;
        }
        r.route === w && (y.value = Z);
      }
    });
    const U = Zl(), S = bl();
    X(S, (w, z) => {
      z === !1 && w === !0 && U.refresh();
    });
    const R = _(), C = _();
    async function u() {
      try {
        R.value = await xl.capabilities();
      } catch {
        R.value = void 0;
      }
      if (R.value?.administer_delivery)
        try {
          C.value = await Cl.status();
        } catch {
          C.value = void 0;
        }
    }
    u();
    const d = _(!1), m = _(!1), $ = _({});
    function A(w) {
      $.value = w, d.value = !0;
    }
    fl(Ja, {
      library: U,
      capabilities: R,
      delivery: C,
      go: (w) => {
        i(w);
      },
      create: A,
      upload: () => {
        m.value = !0;
      },
      setDirty: (w) => {
        k.value = w;
      },
      setTitle: (w) => {
        le.value = w;
      }
    });
    const I = {
      content: (w) => w === "message" ? "Message" : w === "base" ? "Layout" : "Content",
      variables: (w) => w === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, M = {
      content: (w) => ye[w],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, L = P(() => !!R.value && (R.value.administer_delivery || R.value.send)), E = P(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: ye.message },
        { value: "bases", label: "Base templates", icon: ye.base },
        { value: "parts", label: "Parts", icon: ye.part },
        { value: "assets", label: "Images", icon: ye.asset }
      ] },
      ...L.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), ae = { value: "all", label: "All resources", icon: "tabler:table" }, le = _("");
    X(() => Ne(o.value), () => {
      le.value = "";
    });
    const q = P(() => {
      const w = o.value;
      if (w.name === "resource")
        return {
          leading: { value: "all", label: "All " + ba[w.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: le.value || " ", items: Ka(w.kind).map((z) => ({
            value: z,
            label: I[z](w.kind),
            icon: M[z](w.kind)
          })) }]
        };
    }), g = P(() => {
      const w = o.value;
      return w.name === "resource" ? w.section : w.name === "activity" ? "activity" : w.section;
    });
    function p(w) {
      const z = o.value;
      if (z.name === "resource") {
        i(w === "all" ? { name: "library", section: va(z.kind) } : { ...z, section: w });
        return;
      }
      i(w === "activity" ? { name: "activity" } : { name: "library", section: w });
    }
    const f = _();
    return X(() => Ne(o.value), () => {
      f.value?.scrollTo({ top: 0 });
    }), (w, z) => (l(), n("main", Tr, [
      s(Gl, {
        label: "Mail sections",
        title: "Mail",
        value: g.value,
        groups: q.value ? q.value.groups : E.value,
        "leading-item": q.value ? q.value.leading : ae,
        "onUpdate:value": p
      }, null, 8, ["value", "groups", "leading-item"]),
      t("div", Rr, [
        t("div", {
          ref_key: "main",
          ref: f,
          class: ne(["kx-main-scroll mail-main", { "mail-main-wide": o.value.name === "resource" && o.value.section === "content" }])
        }, [
          o.value.name === "resource" ? (l(), O(yn, {
            key: o.value.kind + "/" + o.value.resource,
            kind: o.value.kind,
            name: o.value.resource,
            section: o.value.section
          }, null, 8, ["kind", "name", "section"])) : o.value.name === "activity" ? (l(), O(Sr, {
            key: 1,
            message: o.value.message,
            template: o.value.template
          }, null, 8, ["message", "template"])) : o.value.section === "assets" ? (l(), O(Co, {
            key: 2,
            asset: o.value.asset
          }, null, 8, ["asset"])) : (l(), O(qt, {
            key: 3,
            section: o.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      s(Bo, {
        visible: d.value,
        intent: $.value,
        onClose: z[0] || (z[0] = (Z) => d.value = !1)
      }, null, 8, ["visible", "intent"]),
      s(Xa, {
        visible: m.value,
        onClose: z[1] || (z[1] = (Z) => m.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), jr = /* @__PURE__ */ te({
  __name: "MailAdminRoot",
  setup(e) {
    const v = yl(), r = pl();
    return (c, y) => (l(), O(Ur, {
      route: a(v).route,
      onNavigate: y[0] || (y[0] = (o) => a(r)("navigate", { route: o })),
      onDirtyChange: y[1] || (y[1] = (o) => a(r)("dirty-change", { dirty: o }))
    }, null, 8, ["route"]));
  }
}), Ar = Vl(jr, { type: "object", properties: { route: { type: "string", default: "" } } });
Rl(import.meta.url, Ar);
//# sourceMappingURL=admin.js.map
