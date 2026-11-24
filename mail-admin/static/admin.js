import { defineComponent as ae, useId as de, openBlock as l, createElementBlock as i, unref as a, normalizeClass as oe, createElementVNode as t, createTextVNode as K, toDisplayString as u, createCommentVNode as V, renderSlot as Se, computed as z, createBlock as B, resolveDynamicComponent as Ha, normalizeProps as Fa, guardReactiveProps as Ka, createSlots as aa, withCtx as T, Fragment as H, renderList as re, createVNode as s, inject as Ja, shallowRef as fe, ref as p, watch as Q, reactive as Wa, withModifiers as xe, onBeforeUnmount as Qe, useModel as Ya, mergeModels as Ga, defineAsyncComponent as Xe, withDirectives as Za, vShow as Qa, provide as Xa } from "vue";
import { u as De, a as el, b as al } from "./wc-runtime-IM7bQYl9.js";
import "pinia";
import { u as Ne, l as le, i as Le, d as ne, k as me, A as ll, e as _e, p as ye, a as pe, _ as Je, b as la, c as be, s as _a, f as tl, g as ta, h as Pe, o as We, j as sl, m as il, n as qe, q as xa, r as He, t as nl, v as Ca, w as Va, x as Sa, y as Ra, z as Fe, B as ol, C as rl, D as ul, E as dl, F as cl } from "./SettingsDraftActions.vue_vue_type_script_setup_true_lang-iB-gd4CJ.js";
import { api as vl, host as Re, define as ml } from "@wippy-fe/proxy";
import { Icon as L } from "@iconify/vue";
import F from "primevue/button";
import ue from "primevue/column";
import sa from "primevue/datatable";
import ia from "primevue/iconfield";
import na from "primevue/inputicon";
import ce from "primevue/inputtext";
import he from "primevue/selectbutton";
import Ce from "primevue/dialog";
import Ue from "primevue/tag";
import Ae from "primevue/select";
import bl from "primevue/accordion";
import fl from "primevue/accordioncontent";
import pl from "primevue/accordionheader";
import yl from "primevue/accordionpanel";
import hl from "primevue/checkbox";
import Ta from "primevue/drawer";
import gl from "primevue/fileupload";
import kl from "primevue/textarea";
const $l = ["aria-labelledby"], wl = { class: "kx-railhead" }, _l = ["id"], xl = { key: 0 }, Cl = { class: "kx-railhead-acts" }, Vl = { class: "kx-rail-body" }, Sl = /* @__PURE__ */ ae({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(e) {
    const d = de();
    return (r, f) => (l(), i("aside", {
      class: oe(["kx-rail", { "kx-settings-list-rail": e.settings }]),
      "aria-labelledby": a(d)
    }, [
      t("div", wl, [
        t("span", {
          id: a(d),
          class: "kx-railhead-title"
        }, [
          K(u(e.title), 1),
          e.count !== void 0 ? (l(), i("b", xl, u(e.count), 1)) : V("", !0)
        ], 8, _l),
        t("div", Cl, [
          Se(r.$slots, "actions")
        ])
      ]),
      Se(r.$slots, "toolbar"),
      t("div", Vl, [
        Se(r.$slots, "default")
      ])
    ], 10, $l));
  }
}), Rl = ["aria-label"], Tl = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ul = ["aria-current", "onClick"], Al = { class: "kx-settings-rail-label" }, Ll = /* @__PURE__ */ ae({
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
    const d = e, r = z(() => d.leadingItem ? [{ items: [d.leadingItem] }, ...d.groups] : d.groups);
    function f($) {
      const c = [...$.currentTarget.querySelectorAll(".kx-settings-rail-item")], n = c.indexOf($.target);
      if (n < 0) return;
      let w;
      switch ($.key) {
        case "ArrowDown":
        case "ArrowRight":
          w = (n + 1) % c.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          w = (n + c.length - 1) % c.length;
          break;
        case "Home":
          w = 0;
          break;
        case "End":
          w = c.length - 1;
          break;
        default:
          return;
      }
      $.preventDefault(), c[w]?.focus();
    }
    return ($, c) => (l(), B(Ha(e.title ? Sl : "div"), Fa(Ka(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), aa({
      default: T(() => [
        t("nav", {
          class: oe(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: f
        }, [
          (l(!0), i(H, null, re(r.value, (n, w) => (l(), i("div", {
            key: n.items[0]?.value ?? w,
            class: oe(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && w === 0 }])
          }, [
            n.heading ? (l(), i("div", Tl, u(n.heading), 1)) : V("", !0),
            (l(!0), i(H, null, re(n.items, (k) => (l(), i("button", {
              key: k.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": k.value === e.value ? "true" : void 0,
              onClick: (y) => $.$emit("update:value", k.value)
            }, [
              k.icon ? (l(), B(a(L), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: k.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : V("", !0),
              t("span", Al, u(k.label), 1)
            ], 8, Ul))), 128))
          ], 2))), 128))
        ], 42, Rl)
      ]),
      _: 2
    }, [
      e.title && $.$slots.actions ? {
        name: "actions",
        fn: T(() => [
          Se($.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), jl = /* @__PURE__ */ ae({
  __name: "SettingsDirectoryActions",
  props: {
    createLabel: {}
  },
  emits: ["create", "defaults"],
  setup(e) {
    return (d, r) => (l(), i(H, null, [
      s(a(F), {
        type: "button",
        text: "",
        "aria-label": e.createLabel,
        title: e.createLabel,
        onClick: r[0] || (r[0] = (f) => d.$emit("create"))
      }, {
        icon: T(() => [
          s(a(L), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["aria-label", "title"]),
      s(a(F), {
        type: "button",
        text: "",
        "aria-label": "Application defaults",
        title: "Application defaults",
        onClick: r[1] || (r[1] = (f) => d.$emit("defaults"))
      }, {
        icon: T(() => [
          s(a(L), {
            icon: "tabler:settings",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ], 64));
  }
}), Ua = Symbol("mail-admin");
function ve() {
  const e = Ja(Ua);
  if (!e) throw new Error("Mail administration context is missing");
  return e;
}
function ge() {
  let e = 0;
  return () => {
    const d = ++e;
    return () => d === e;
  };
}
function Il() {
  const e = fe([]), d = p(!0), r = p(!1), f = p(!1), $ = p(""), c = p(0), n = ge();
  async function w() {
    const x = n();
    r.value || (d.value = !0);
    try {
      const m = await le.all();
      if (!x()) return;
      e.value = m, $.value = "", f.value = !1, r.value = !0, c.value++;
    } catch (m) {
      if (!x()) return;
      f.value = Le(m), $.value = f.value ? "" : ne(m, "The mail library could not be loaded.");
    } finally {
      x() && (d.value = !1);
    }
  }
  Ne(() => {
    w();
  }), De(w);
  const k = z(() => new Map(e.value.map((x) => [x.kind + "/" + x.name, x])));
  return { resources: e, loading: d, loaded: r, denied: f, error: $, version: c, load: w, find: (x, m) => k.value.get(x + "/" + m), ofKind: (x) => e.value.filter((m) => m.kind === x).sort((m, _) => m.title.localeCompare(_.title)) };
}
const Dl = { class: "kx-empty" }, Nl = { class: "kx-empty-ico" }, Pl = { class: "kx-empty-title" }, El = {
  key: 0,
  class: "kx-empty-sub"
}, oa = /* @__PURE__ */ ae({
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
    return (d, r) => (l(), i("div", Dl, [
      t("div", Nl, [
        s(a(L), {
          icon: e.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      t("div", Pl, u(e.title), 1),
      e.hint || d.$slots.hint ? (l(), i("p", El, [
        Se(d.$slots, "hint", {}, () => [
          K(u(e.hint), 1)
        ])
      ])) : V("", !0),
      e.cta ? (l(), B(a(F), {
        key: 1,
        label: e.cta,
        onClick: r[0] || (r[0] = (f) => d.$emit("cta"))
      }, aa({ _: 2 }, [
        e.ctaIcon ? {
          name: "icon",
          fn: T(({ class: f }) => [
            s(a(L), {
              icon: e.ctaIcon,
              class: oe(f),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : V("", !0)
    ]));
  }
}), ra = {
  message: "messages",
  base: "bases",
  part: "parts"
}, Aa = Object.fromEntries(Object.entries(ra).map(([e, d]) => [d, e])), zl = ["content", "variables", "used-by", "history"];
function ea(e) {
  return ra[e];
}
function Ml(e) {
  return Aa[e];
}
function La(e) {
  return e === "base" ? ["content", "used-by", "history"] : zl;
}
function ka(e) {
  return e.name === "activity" ? e.message ? `activity/${encodeURIComponent(e.message)}` : e.template ? `activity/template/${encodeURIComponent(e.template)}` : "activity" : e.name === "library" ? e.section === "assets" && e.asset ? `assets/${encodeURIComponent(e.asset)}` : e.section === "all" ? "" : e.section : `${ra[e.kind]}/${encodeURIComponent(e.resource)}/${e.section}`;
}
function $a(e) {
  const d = (e ?? "").replace(/^\/+|\/+$/g, "").split("/").filter(Boolean), [r, f, $] = d;
  if (!r) return { name: "library", section: "all" };
  try {
    if (r === "activity")
      return f === "template" && $ ? { name: "activity", template: decodeURIComponent($) } : f ? { name: "activity", message: decodeURIComponent(f) } : { name: "activity" };
    if (r === "assets") return f ? { name: "library", section: "assets", asset: decodeURIComponent(f) } : { name: "library", section: "assets" };
    const c = Aa[r];
    if (!c) return { name: "library", section: "all" };
    if (!f) return { name: "library", section: r };
    const w = La(c).find((k) => k === $) ?? "content";
    return { name: "resource", kind: c, resource: decodeURIComponent(f), section: w };
  } catch {
    return { name: "library", section: "all" };
  }
}
function ua(e, d) {
  let r = e;
  for (const [f, $] of Object.entries(d ?? {}))
    r = r.split("cid:" + f).join($);
  return r;
}
const Ol = {
  class: "mail-problem",
  role: "alert"
}, Bl = { class: "mail-problem-lead" }, ql = { class: "mail-problem-detail" }, Hl = {
  key: 0,
  class: "mail-problem-involved"
}, Fl = ["onClick"], Ke = /* @__PURE__ */ ae({
  __name: "ProblemNote",
  props: {
    problem: {},
    draft: {},
    lastGood: { type: Boolean }
  },
  setup(e) {
    const d = e, { library: r, go: f } = ve(), $ = { html: "HTML", text: "plain text", subject: "subject", variables: "variables", samples: "sample values" }, c = (g) => r.find(g.kind, g.name)?.title ?? g.name, n = (g) => !!g && !!d.draft && g.kind === d.draft.kind && g.name === d.draft.name, w = z(() => {
      const { resource: g, face: x, previewOf: m } = d.problem, _ = x ? $[x] : "";
      if (g && d.draft && d.draft.kind !== "message" && g.kind === "message" && g.name === m)
        return `${c(g)} does not render with your changes.`;
      if (!g || n(g)) {
        const o = d.draft ? `this ${me[d.draft.kind].toLowerCase()}` : "it";
        return _ ? `The ${_} of ${o} does not render.` : `${o[0].toUpperCase()}${o.slice(1)} does not render.`;
      }
      return `${c(g)} does not render${_ ? ` (${_})` : ""}.`;
    }), k = z(() => (d.problem.candidates ?? []).filter((g) => !n(g)));
    function y(g) {
      g.kind === "asset" ? f({ name: "library", section: "assets", asset: g.name }) : f({ name: "resource", kind: g.kind, resource: g.name, section: "content" });
    }
    return (g, x) => (l(), i("div", Ol, [
      t("p", Bl, [
        s(a(L), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, [
          K(u(w.value), 1),
          e.lastGood ? (l(), i(H, { key: 0 }, [
            K(" The preview shows the last version that rendered.")
          ], 64)) : V("", !0)
        ])
      ]),
      t("code", ql, u(e.problem.message), 1),
      k.value.length ? (l(), i("p", Hl, [
        x[0] || (x[0] = t("span", { class: "mail-muted" }, "Involved:", -1)),
        (l(!0), i(H, null, re(k.value, (m) => (l(), i("button", {
          key: m.kind + m.name,
          type: "button",
          class: "mail-text-link",
          onClick: (_) => y(m)
        }, u(c(m)), 9, Fl))), 128))
      ])) : V("", !0)
    ]));
  }
}), wa = ["html", "text", "subject", "variables", "samples"];
function Be(e) {
  return !!e && typeof e == "object" && typeof e.kind == "string" && typeof e.name == "string";
}
function Te(e) {
  if (!(e instanceof ll)) return;
  const d = e.details ?? {};
  if (_e(e) === "mail_resource_in_use") {
    const w = Array.isArray(d.messages) ? d.messages.filter((y) => typeof y == "string") : [], k = d.dependent;
    return {
      message: e.message,
      dependents: w,
      face: wa.find((y) => y === k?.face),
      resource: Be(k?.resource) ? k.resource : void 0
    };
  }
  const f = wa.find((w) => w === d.face);
  if (!f) return;
  const $ = Array.isArray(d.dependent_messages) ? d.dependent_messages.filter((w) => typeof w == "string") : [], c = Array.isArray(d.errors) ? d.errors.flatMap((w) => {
    const k = w;
    return Be(k.resource) && typeof k.message == "string" ? [{ name: k.resource.name, message: k.message }] : [];
  }) : [], n = Array.isArray(d.candidate_resources) ? d.candidate_resources.filter(Be) : [];
  return {
    message: e.message,
    face: f,
    resource: Be(d.resource) ? d.resource : void 0,
    dependents: $.length ? $ : void 0,
    reasons: c.length ? c : void 0,
    candidates: n.length ? n : void 0
  };
}
const Kl = {
  html: "HTML",
  text: "Plain text",
  subject: "Subject",
  variables: "Variables",
  samples: "Sample values"
}, Jl = { class: "kx-modal-head-icon" }, Wl = {
  key: 0,
  class: "mail-muted"
}, Yl = { class: "mail-gallery" }, Gl = ["aria-label", "onClick"], Zl = { class: "mail-gallery-title" }, Ql = { class: "mail-sub" }, Xl = { class: "mail-gallery-frame" }, et = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, at = {
  key: 1,
  class: "mail-gallery-problem"
}, lt = {
  key: 1,
  role: "alert"
}, tt = ["srcdoc", "title"], st = /* @__PURE__ */ ae({
  __name: "PreviewGallery",
  props: {
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = p([]);
    let w = 0;
    async function k(m, _) {
      try {
        const o = await le.preview(m.name, []);
        if (_ !== w) return;
        m.subject = o.subject, m.document = o.html ? ua(o.html, o.inline_assets) : "", m.state = "ready";
      } catch (o) {
        if (_ !== w) return;
        m.problem = Te(o), m.failure = m.problem ? "" : ne(o, "This message could not be rendered."), m.state = "failed";
      }
    }
    async function y() {
      const m = ++w;
      n.value = $.ofKind("message").map((v) => Wa({ name: v.name, title: v.title, state: "loading" }));
      const _ = [...n.value], o = Array.from({ length: 3 }, async () => {
        for (let v = _.shift(); v; v = _.shift()) await k(v, m);
      });
      await Promise.all(o);
    }
    Q(() => r.visible, (m) => {
      m ? y() : w++;
    });
    function g(m) {
      f("close"), c({ name: "resource", kind: "message", resource: m, section: "content" });
    }
    const x = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (m, _) => (l(), B(a(Ce), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-gallery",
      pt: x,
      "aria-label": "Preview all messages",
      "onUpdate:visible": _[0] || (_[0] = (o) => {
        o || f("close");
      })
    }, {
      header: T(() => [
        t("span", Jl, [
          s(a(L), {
            icon: "tabler:layout-grid",
            "aria-hidden": "true"
          })
        ]),
        _[1] || (_[1] = t("span", { class: "kx-modal-head-text" }, [
          t("span", { class: "kx-modal-head-title" }, "All messages"),
          t("span", { class: "kx-modal-head-sub" }, "Each message with its sample values, through the current library.")
        ], -1))
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Render again",
          severity: "secondary",
          outlined: "",
          onClick: y
        }, {
          icon: T(() => [
            s(a(L), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        })
      ]),
      default: T(() => [
        n.value.length ? V("", !0) : (l(), i("p", Wl, "There are no messages yet.")),
        t("ul", Yl, [
          (l(!0), i(H, null, re(n.value, (o) => (l(), i("li", {
            key: o.name,
            class: oe(["mail-gallery-tile", { "mail-gallery-failed": o.state === "failed" }])
          }, [
            t("button", {
              type: "button",
              class: "mail-gallery-open",
              "aria-label": "Open " + o.title,
              onClick: (v) => g(o.name)
            }, [
              t("span", Zl, u(o.title), 1),
              t("span", Ql, u(o.subject ?? ""), 1)
            ], 8, Gl),
            t("div", Xl, [
              o.state === "loading" ? (l(), i("p", et, [
                s(a(L), {
                  icon: "tabler:loader-2",
                  class: "spin",
                  "aria-hidden": "true"
                }),
                _[2] || (_[2] = K("Rendering…", -1))
              ])) : o.state === "failed" ? (l(), i("div", at, [
                o.problem ? (l(), B(Ke, {
                  key: 0,
                  problem: o.problem,
                  draft: { kind: "message", name: o.name }
                }, null, 8, ["problem", "draft"])) : (l(), i("p", lt, u(o.failure), 1))
              ])) : (l(), i("iframe", {
                key: 2,
                sandbox: "",
                srcdoc: o.document,
                title: o.title + " preview",
                tabindex: "-1"
              }, null, 8, tt))
            ])
          ], 2))), 128))
        ])
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), it = { class: "mail-source" }, nt = { key: 0 }, ot = { key: 1 }, da = /* @__PURE__ */ ae({
  __name: "ResourceSource",
  props: {
    resource: {}
  },
  setup(e) {
    return (d, r) => (l(), i("span", it, [
      e.resource.state === "created" ? (l(), i("span", nt, u((e.resource.kind === "asset" ? "Uploaded by " : "Created by ") + a(ye)(e.resource.author_label, e.resource.author)), 1)) : (l(), i("span", ot, "Included with " + u(e.resource.origin_label), 1)),
      e.resource.state === "customized" ? (l(), B(a(Ue), {
        key: 2,
        severity: "info",
        value: e.resource.kind === "asset" ? "Replaced" : "Customized",
        class: "kx-tag-sm"
      }, null, 8, ["value"])) : V("", !0)
    ]));
  }
}), rt = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, ut = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, dt = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, ct = { class: "mail-toolbar" }, vt = {
  class: "mail-count",
  role: "status"
}, mt = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, bt = ["onClick"], ft = {
  key: 0,
  class: "mail-sub"
}, pt = { class: "mail-kind" }, yt = { class: "mail-muted" }, ht = {
  key: 2,
  class: "mail-more"
}, gt = /* @__PURE__ */ ae({
  __name: "LibraryPage",
  props: {
    section: {}
  },
  setup(e) {
    const d = e, { library: r, go: f, create: $ } = ve(), c = z(() => Ml(d.section)), n = p("all"), w = p(""), k = p("");
    let y;
    Q(w, (P) => {
      clearTimeout(y), y = setTimeout(() => {
        k.value = P.trim();
      }, 250);
    }), Q(() => d.section, () => {
      w.value = k.value = "", n.value = "all";
    });
    const g = fe([]), x = p(), m = p(!0), _ = p(!1), o = p(!1), v = p(!1), b = p(""), O = ge(), A = () => ({ kind: c.value, state: n.value === "all" ? void 0 : n.value, q: k.value || void 0 });
    async function j() {
      const P = O();
      m.value = !0;
      try {
        const q = await le.page(A());
        if (!P()) return;
        g.value = q.items, x.value = q.next_cursor, b.value = "", v.value = !1, _.value = !0;
      } catch (q) {
        if (!P()) return;
        v.value = Le(q), b.value = v.value ? "" : ne(q, "The mail library could not be loaded.");
      } finally {
        P() && (m.value = !1);
      }
    }
    async function S() {
      if (!x.value || o.value) return;
      const P = O();
      o.value = !0;
      try {
        const q = await le.page({ ...A(), cursor: x.value });
        if (!P()) return;
        g.value = [...g.value, ...q.items], x.value = q.next_cursor;
      } catch (q) {
        P() && (b.value = ne(q, "More resources could not be loaded."));
      } finally {
        o.value = !1;
      }
    }
    Q([c, n, k], () => {
      j();
    }), De(j), Ne(() => {
      j();
    });
    const N = z(() => {
      switch (c.value) {
        case "message":
          return { title: "Messages", description: "What recipients read. Each message follows its base template." };
        case "base":
          return { title: "Base templates", description: "The frame around messages: the page, the header and the footer." };
        case "part":
          return { title: "Parts", description: "Reusable pieces that templates include, such as the header, footer and buttons." };
        default:
          return { title: "All resources", description: "Everything your email is made of. Messages follow the base templates and parts they use." };
      }
    }), te = [
      { label: "All", value: "all" },
      { label: "Customized", value: "customized" },
      { label: "Created here", value: "created" },
      { label: "Original", value: "original" }
    ], W = { base: 0, part: 1, message: 2, asset: 3 }, R = z(() => [...g.value].sort((P, q) => W[P.kind] - W[q.kind] || P.title.localeCompare(q.title))), h = z(() => {
      const P = c.value ? me[c.value].toLowerCase() : "resource";
      return pe(g.value.length, P) + (x.value ? " so far" : "");
    });
    function U(P) {
      const q = P.used_by;
      return P.kind === "base" || P.kind === "asset" ? q?.messages ? pe(q.messages, "message") : "—" : P.kind === "message" ? q?.recent_sources ? pe(q.recent_sources, "recent sender") : "—" : "";
    }
    function D(P) {
      return P.base ? r.find("base", P.base)?.title ?? P.base : "";
    }
    function I(P) {
      P.kind === "asset" ? f({ name: "library", section: "assets", asset: P.name }) : f({ name: "resource", kind: P.kind, resource: P.name, section: "content" });
    }
    const G = z(() => _.value && !b.value && c.value && !g.value.length && n.value === "all" && !k.value), C = p(!1);
    return (P, q) => (l(), i(H, null, [
      s(Je, {
        title: N.value.title,
        description: N.value.description
      }, {
        actions: T(() => [
          !c.value || c.value === "message" ? (l(), B(a(F), {
            key: 0,
            label: "Preview all messages",
            severity: "secondary",
            outlined: "",
            onClick: q[0] || (q[0] = (Z) => C.value = !0)
          }, {
            icon: T(() => [
              s(a(L), {
                icon: "tabler:eye",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : V("", !0),
          s(a(F), {
            label: c.value ? "New " + a(me)[c.value].toLowerCase() : "New",
            onClick: q[1] || (q[1] = (Z) => a($)({ kind: c.value }))
          }, {
            icon: T(() => [
              s(a(L), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["label"])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      v.value ? (l(), i("p", rt, [
        s(a(L), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        q[8] || (q[8] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : b.value ? (l(), i("div", ut, [
        t("span", null, u(b.value), 1),
        s(a(F), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: q[2] || (q[2] = (Z) => j())
        })
      ])) : m.value && !_.value ? (l(), i("p", dt, [
        s(a(L), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        q[9] || (q[9] = K("Loading mail library…", -1))
      ])) : G.value && c.value ? (l(), B(oa, {
        key: 3,
        icon: a(be)[c.value],
        title: "No " + a(la)[c.value].toLowerCase() + " yet",
        hint: "Create a " + a(me)[c.value].toLowerCase() + " from blank or from an existing one.",
        cta: "New " + a(me)[c.value].toLowerCase(),
        "cta-icon": "tabler:plus",
        onCta: q[3] || (q[3] = (Z) => a($)({ kind: c.value }))
      }, null, 8, ["icon", "title", "hint", "cta"])) : _.value ? (l(), i(H, { key: 4 }, [
        t("div", ct, [
          s(a(he), {
            modelValue: n.value,
            "onUpdate:modelValue": q[4] || (q[4] = (Z) => n.value = Z),
            options: te,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Show resources"
          }, null, 8, ["modelValue"]),
          s(a(ia), { class: "mail-search" }, {
            default: T(() => [
              s(a(na), null, {
                default: T(() => [
                  s(a(L), {
                    icon: m.value ? "tabler:loader-2" : "tabler:search",
                    class: oe({ spin: m.value }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"])
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: w.value,
                "onUpdate:modelValue": q[5] || (q[5] = (Z) => w.value = Z),
                type: "search",
                "aria-label": "Search " + N.value.title.toLowerCase(),
                placeholder: "Search names and content…"
              }, null, 8, ["modelValue", "aria-label"])
            ]),
            _: 1
          }),
          t("span", vt, u(h.value), 1)
        ]),
        g.value.length ? (l(), B(a(sa), {
          key: 1,
          value: R.value,
          "data-key": (Z) => Z.kind + "/" + Z.name,
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": N.value.title } },
          onRowClick: q[6] || (q[6] = (Z) => I(Z.data))
        }, {
          default: T(() => [
            s(a(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: T(({ data: Z }) => [
                t("button", {
                  type: "button",
                  class: "mail-name",
                  onClick: xe((X) => I(Z), ["stop"])
                }, u(Z.title), 9, bt),
                Z.description ? (l(), i("span", ft, u(Z.description), 1)) : V("", !0)
              ]),
              _: 1
            }),
            c.value ? V("", !0) : (l(), B(a(ue), {
              key: 0,
              header: "Kind",
              "header-class": "mail-col-kind",
              "body-class": "mail-col-kind"
            }, {
              body: T(({ data: Z }) => [
                t("span", pt, [
                  s(a(L), {
                    icon: a(be)[Z.kind],
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  K(u(a(me)[Z.kind]), 1)
                ])
              ]),
              _: 1
            })),
            c.value === "message" ? (l(), B(a(ue), {
              key: 1,
              header: "Base template"
            }, {
              body: T(({ data: Z }) => [
                K(u(D(Z)), 1)
              ]),
              _: 1
            })) : V("", !0),
            s(a(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: T(({ data: Z }) => [
                s(da, { resource: Z }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            c.value !== "part" ? (l(), B(a(ue), {
              key: 2,
              header: "Used by",
              "header-class": "mail-col-used",
              "body-class": "mail-col-used"
            }, {
              body: T(({ data: Z }) => [
                K(u(U(Z)), 1)
              ]),
              _: 1
            })) : V("", !0),
            s(a(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: T(({ data: Z }) => [
                t("span", yt, u(Z.state === "original" ? "—" : a(_a)(Z.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value", "data-key", "pt"])) : (l(), i("p", mt, "Nothing matches. Try another name or a word from the template.")),
        x.value ? (l(), i("div", ht, [
          s(a(F), {
            label: "Show more",
            severity: "secondary",
            outlined: "",
            loading: o.value,
            onClick: S
          }, null, 8, ["loading"])
        ])) : V("", !0)
      ], 64)) : V("", !0),
      s(st, {
        visible: C.value,
        onClose: q[7] || (q[7] = (Z) => C.value = !1)
      }, null, 8, ["visible"])
    ], 64));
  }
});
function kt(e) {
  return JSON.parse(JSON.stringify(e));
}
function ke(e) {
  const d = kt(e);
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
function $t(e, d) {
  return JSON.stringify(ke(e)) === JSON.stringify(ke(d));
}
function wt(e, d, r, f, $) {
  const c = { type: "object", properties: {} };
  return e === "message" ? {
    kind: e,
    name: d,
    title: r,
    description: f,
    base: $,
    subject: r,
    schema: c,
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
    title: r,
    description: f,
    schema: c,
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
  } : { kind: e, name: d, title: r, description: f, schema: c, samples: {}, html: `<p>{{ site.title }}</p>
`, text: `{{ site.title }}
` };
}
function _t(e) {
  if (typeof e == "string") return JSON.stringify(e);
  if (typeof e == "number" || typeof e == "boolean") return String(e);
}
function xt(e) {
  const d = [], r = e.samples;
  for (const [f, $] of Object.entries(e.schema.properties)) {
    const c = _t(r[f] ?? $.default ?? ($.type === "string" ? "" : null));
    c !== void 0 && d.push(`${JSON.stringify(f)}, ${c}`);
  }
  return d.length ? `{{ include "/part/${e.name}" map(${d.join(", ")}) }}` : `{{ include "/part/${e.name}" }}`;
}
function ja(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ assets.${e} }}` : `{{ assets[${JSON.stringify(e)}] }}`;
}
function Ct(e, d, r) {
  const f = r ? ` width="${r}"` : "";
  return `<img src="${ja(e)}" alt="${d.replace(/"/g, "&quot;")}"${f} style="display:block;border:0;max-width:100%;height:auto;">`;
}
const Vt = /* @__PURE__ */ new Set(["site", "sender", "message", "assets", "vars"]);
function St(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) && !Vt.has(e) ? `{{ ${e} }}` : /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? `{{ vars.${e} }}` : `{{ vars[${JSON.stringify(e)}] }}`;
}
const Rt = "{{ block body() }}{{ end }}", Tt = {
  class: "mail-preview",
  "aria-label": "Preview"
}, Ut = { class: "mail-preview-bar" }, At = {
  key: 0,
  class: "mail-preview-with"
}, Lt = ["for"], jt = {
  key: 1,
  class: "mail-preview-envelope"
}, It = ["aria-busy"], Dt = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Nt = {
  key: 1,
  class: "mail-muted mail-preview-empty"
}, Pt = ["srcdoc", "title"], Et = {
  key: 1,
  class: "mail-preview-text"
}, zt = {
  key: 2,
  class: "mail-preview-foot mail-preview-problem"
}, Mt = {
  key: 3,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, Ot = {
  key: 4,
  class: "mail-preview-foot mail-preview-problem",
  role: "alert"
}, Bt = {
  key: 5,
  class: "mail-preview-foot"
}, qt = /* @__PURE__ */ ae({
  __name: "PreviewPane",
  props: {
    draft: {},
    messages: {}
  },
  emits: ["problem"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, delivery: c } = ve(), n = { message: de() }, w = p("email"), k = p("desktop"), y = [{ label: "Email", value: "email" }, { label: "Plain text", value: "text" }], g = [{ label: "Desktop", value: "desktop", icon: "tabler:device-desktop" }, { label: "Phone", value: "phone", icon: "tabler:device-mobile" }], x = z(() => (r.messages ?? $.ofKind("message").map((C) => C.name)).map((C) => ({ value: C, label: $.find("message", C)?.title ?? C }))), m = p("");
    Q(x, (G) => {
      r.draft.kind !== "message" && (G.some((C) => C.value === m.value) || (m.value = G[0]?.value ?? ""));
    }, { immediate: !0 });
    const _ = z(() => r.draft.kind === "message" ? r.draft.name : m.value), o = fe(), v = p(!1), b = p(), O = p(""), A = ge();
    let j, S = !1, N = !1, te = !1;
    const W = () => {
      te = !0, clearTimeout(j);
    };
    window.addEventListener("pagehide", W), window.addEventListener("beforeunload", W), Qe(() => {
      window.removeEventListener("pagehide", W), window.removeEventListener("beforeunload", W);
    });
    const R = p(!1);
    async function h() {
      const G = _.value;
      if (!G || te) return;
      if (S) {
        N = !0;
        return;
      }
      S = !0;
      const C = A();
      v.value = !0;
      try {
        const P = await le.preview(G, [r.draft]);
        if (!C()) return;
        o.value = P, R.value = !1, b.value = void 0, O.value = "";
      } catch (P) {
        if (!C()) return;
        R.value = tl(P);
        const q = R.value ? void 0 : Te(P);
        b.value = q ? { ...q, previewOf: G } : void 0, O.value = b.value ? "" : ne(P, "The preview could not be rendered.");
      } finally {
        S = !1, C() && (v.value = !1), N && (N = !1, h());
      }
    }
    function U() {
      clearTimeout(j), j = setTimeout(() => {
        h();
      }, 450);
    }
    Q(() => JSON.stringify(r.draft), U), Q(_, () => {
      o.value = void 0, h();
    }, { immediate: !0 }), Q(b, (G) => f("problem", G)), Qe(() => clearTimeout(j));
    const D = z(() => o.value?.html ? ua(o.value.html, o.value.inline_assets) : ""), I = z(() => {
      const G = c.value?.from;
      return G ? G.name ? `${G.name} <${G.address}>` : G.address : "";
    });
    return (G, C) => (l(), i("section", Tt, [
      t("div", Ut, [
        s(a(he), {
          modelValue: w.value,
          "onUpdate:modelValue": C[0] || (C[0] = (P) => w.value = P),
          options: y,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview format"
        }, null, 8, ["modelValue"]),
        w.value === "email" ? (l(), B(a(he), {
          key: 0,
          modelValue: k.value,
          "onUpdate:modelValue": C[1] || (C[1] = (P) => k.value = P),
          options: g,
          "option-label": "label",
          "option-value": "value",
          "allow-empty": !1,
          "aria-label": "Preview width"
        }, {
          option: T(({ option: P }) => [
            s(a(L), {
              icon: P.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            K(u(P.label), 1)
          ]),
          _: 1
        }, 8, ["modelValue"])) : V("", !0)
      ]),
      e.draft.kind !== "message" ? (l(), i("div", At, [
        t("label", {
          for: n.message
        }, "Preview with", 8, Lt),
        s(a(Ae), {
          modelValue: m.value,
          "onUpdate:modelValue": C[2] || (C[2] = (P) => m.value = P),
          "input-id": n.message,
          options: x.value,
          "option-label": "label",
          "option-value": "value",
          "append-to": "self",
          placeholder: "Choose a message…",
          "empty-message": "No messages yet"
        }, null, 8, ["modelValue", "input-id", "options"])
      ])) : V("", !0),
      o.value ? (l(), i("dl", jt, [
        I.value ? (l(), i(H, { key: 0 }, [
          C[3] || (C[3] = t("dt", null, "From", -1)),
          t("dd", null, u(I.value), 1)
        ], 64)) : V("", !0),
        C[4] || (C[4] = t("dt", null, "Subject", -1)),
        t("dd", null, u(o.value.subject), 1)
      ])) : V("", !0),
      t("div", {
        class: oe(["mail-preview-body", ["mail-preview-" + k.value, { "mail-preview-stale": b.value || O.value }]]),
        "aria-busy": v.value
      }, [
        !o.value && v.value ? (l(), i("p", Dt, [
          s(a(L), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          C[5] || (C[5] = K("Rendering preview…", -1))
        ])) : _.value ? o.value ? (l(), i(H, { key: 2 }, [
          w.value === "email" ? (l(), i("iframe", {
            key: 0,
            class: "mail-preview-frame",
            sandbox: "",
            srcdoc: D.value,
            title: "Email preview: " + (o.value.subject ?? "")
          }, null, 8, Pt)) : (l(), i("pre", Et, u(o.value.text), 1))
        ], 64)) : V("", !0) : (l(), i("p", Nt, "Choose a message to see this " + u(e.draft.kind === "base" ? "base template" : "part") + " around real content.", 1))
      ], 10, It),
      b.value ? (l(), i("div", zt, [
        s(Ke, {
          problem: b.value,
          draft: e.draft,
          "last-good": !!o.value
        }, null, 8, ["problem", "draft", "last-good"])
      ])) : R.value ? (l(), i("p", Mt, [
        s(a(L), {
          icon: "tabler:plug-connected-x",
          "aria-hidden": "true"
        }),
        t("span", null, u(O.value), 1)
      ])) : O.value ? (l(), i("p", Ot, [
        s(a(L), {
          icon: "tabler:alert-triangle",
          "aria-hidden": "true"
        }),
        t("span", null, u(O.value), 1)
      ])) : (l(), i("p", Bt, [
        s(a(L), {
          icon: "tabler:info-circle",
          "aria-hidden": "true"
        }),
        K(" " + u(e.draft.kind === "message" ? "Filled with the sample values from Variables." : "Your unsaved version around a real message, filled with its sample values."), 1)
      ]))
    ]));
  }
}), Ht = { class: "kx-modal-head-icon" }, Ft = { class: "kx-modal-head-text" }, Kt = { class: "kx-modal-head-sub" }, Jt = { class: "mail-change-list" }, Wt = { class: "mail-muted" }, Yt = { class: "mail-field" }, Gt = ["for"], Zt = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "alert"
}, Qt = { class: "mail-failure-body" }, Xt = { class: "mail-dependents" }, es = ["onClick"], as = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, ls = /* @__PURE__ */ ae({
  __name: "ReviewDialog",
  props: {
    visible: { type: Boolean },
    saved: {},
    draft: {},
    busy: { type: Boolean },
    error: {},
    dependents: {}
  },
  emits: ["close", "save"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = p(""), w = de();
    Q(() => r.visible, (x) => {
      x && (n.value = "");
    });
    const k = z(() => {
      const x = r.saved, m = r.draft, _ = [];
      return (x.title !== m.title || x.description !== m.description) && _.push("Name and description"), x.base !== m.base && _.push(`Base template: ${$.find("base", m.base ?? "")?.title ?? m.base}`), x.subject !== m.subject && _.push("Subject"), x.html !== m.html && _.push("HTML"), x.text !== m.text && _.push("Plain text"), (JSON.stringify(x.schema.properties) !== JSON.stringify(m.schema.properties) || JSON.stringify(x.schema.required ?? []) !== JSON.stringify(m.schema.required ?? [])) && _.push(m.kind === "message" ? "Variables" : "Inputs"), JSON.stringify(x.samples) !== JSON.stringify(m.samples) && _.push("Sample values"), _;
    }), y = z(() => r.draft.kind === "message" ? "Email sent after you save uses this version." : `Every message that uses this ${me[r.draft.kind].toLowerCase()} changes when you save.`), g = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (x, m) => (l(), B(a(Ce), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !e.busy,
      "close-on-escape": !e.busy,
      class: "mail-dialog",
      pt: g,
      "aria-label": "Review changes",
      "onUpdate:visible": m[3] || (m[3] = (_) => {
        _ || f("close");
      })
    }, {
      header: T(() => [
        t("span", Ht, [
          s(a(L), {
            icon: "tabler:checklist",
            "aria-hidden": "true"
          })
        ]),
        t("span", Ft, [
          m[4] || (m[4] = t("span", { class: "kx-modal-head-title" }, "Review changes", -1)),
          t("span", Kt, u(e.draft.title), 1)
        ])
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Keep editing",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: m[2] || (m[2] = (_) => f("close"))
        }, null, 8, ["disabled"]),
        s(a(F), {
          label: "Save",
          type: "submit",
          form: "mail-review",
          loading: e.busy,
          disabled: !!e.dependents
        }, null, 8, ["loading", "disabled"])
      ]),
      default: T(() => [
        t("form", {
          id: "mail-review",
          class: "mail-form",
          onSubmit: m[1] || (m[1] = xe((_) => f("save", n.value.trim()), ["prevent"]))
        }, [
          t("div", null, [
            m[5] || (m[5] = t("p", { class: "mail-field-label" }, "Changed", -1)),
            t("ul", Jt, [
              (l(!0), i(H, null, re(k.value, (_) => (l(), i("li", { key: _ }, u(_), 1))), 128))
            ])
          ]),
          t("p", Wt, u(y.value) + " The previous version stays in History.", 1),
          t("div", Yt, [
            t("label", {
              class: "mail-field-label",
              for: a(w)
            }, "Note for History", 8, Gt),
            s(a(ce), {
              id: a(w),
              modelValue: n.value,
              "onUpdate:modelValue": m[0] || (m[0] = (_) => n.value = _),
              placeholder: "What changed and why…",
              disabled: e.busy
            }, null, 8, ["id", "modelValue", "disabled"])
          ]),
          e.dependents ? (l(), i("div", Zt, [
            s(a(L), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("div", Qt, [
              t("strong", null, u(e.dependents.names.length === 1 ? "1 message would break" : e.dependents.names.length + " messages would break") + ".", 1),
              t("span", null, u(e.dependents.reason), 1),
              t("span", Xt, [
                (l(!0), i(H, null, re(e.dependents.names, (_) => (l(), i("button", {
                  key: _,
                  type: "button",
                  class: "mail-text-link",
                  onClick: (o) => {
                    f("close"), a(c)({ name: "resource", kind: "message", resource: _, section: "content" });
                  }
                }, u(a($).find("message", _)?.title ?? _), 9, es))), 128))
              ])
            ])
          ])) : e.error ? (l(), i("p", as, u(e.error), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape"]));
  }
}), Ia = /* @__PURE__ */ ae({
  __name: "Disclosure",
  props: /* @__PURE__ */ Ga({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const d = Ya(e, "open");
    return (r, f) => (l(), B(a(bl), {
      class: "kx-disclosure",
      value: d.value ? "content" : void 0,
      "onUpdate:value": f[0] || (f[0] = ($) => d.value = $ === "content")
    }, {
      default: T(() => [
        s(a(yl), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: T(() => [
            s(a(pl), { class: "kx-disclosure-toggle" }, {
              default: T(() => [
                K(u(e.label), 1)
              ]),
              _: 1
            }),
            s(a(fl), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: T(() => [
                Se(r.$slots, "default")
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
}), Ze = /* @__PURE__ */ new Map();
function ts(e, d) {
  const r = `${e}@${d}`;
  let f = Ze.get(r);
  return f || (f = Promise.resolve(vl.get(`/api/v1/mail/library/asset/${encodeURIComponent(e)}/content`, { responseType: "blob" })).then(($) => $.data instanceof Blob ? URL.createObjectURL($.data) : void 0, () => {
    Ze.delete(r);
  }), Ze.set(r, f)), f;
}
const ss = ["src", "alt"], is = {
  key: 0,
  "aria-hidden": "true"
}, ca = /* @__PURE__ */ ae({
  __name: "AssetTile",
  props: {
    name: {},
    revision: {},
    asset: {},
    large: { type: Boolean },
    alt: {}
  },
  setup(e) {
    const d = e, r = p();
    Q(() => [d.name, d.revision], async ([$, c]) => {
      r.value = void 0, r.value = await ts($, c);
    }, { immediate: !0 });
    const f = z(() => d.asset?.content_type?.replace(/^image\//, "").replace("jpeg", "jpg").toUpperCase() ?? "");
    return ($, c) => (l(), i("span", {
      class: oe(["mail-asset-tile", { "mail-asset-tile-large": e.large }])
    }, [
      r.value ? (l(), i("img", {
        key: 0,
        src: r.value,
        alt: e.alt ?? ""
      }, null, 8, ss)) : (l(), i(H, { key: 1 }, [
        s(a(L), {
          icon: "tabler:photo",
          "aria-hidden": "true"
        }),
        f.value ? (l(), i("span", is, u(f.value), 1)) : V("", !0)
      ], 64))
    ], 2));
  }
}), ns = { class: "kx-modal-head-icon" }, os = { class: "kx-modal-head-text" }, rs = { class: "kx-modal-head-sub" }, us = { class: "mail-form" }, ds = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, cs = {
  key: 1,
  class: "mail-list mail-insert-list"
}, vs = ["onClick"], ms = { class: "mail-list-main" }, bs = { class: "mail-mono" }, fs = {
  key: 0,
  class: "mail-sub"
}, ps = {
  key: 0,
  class: "mail-muted"
}, ys = {
  key: 1,
  class: "mail-list mail-insert-list"
}, hs = ["disabled", "onClick"], gs = { class: "mail-list-main" }, ks = { class: "mail-sub" }, $s = { class: "mail-field" }, ws = ["for"], _s = { class: "mail-dialog-actions" }, xs = {
  key: 1,
  class: "mail-muted"
}, Cs = {
  key: 2,
  class: "mail-list mail-insert-list"
}, Vs = ["disabled", "onClick"], Ss = { class: "mail-list-main" }, Rs = { class: "mail-sub mail-mono-block" }, Ts = {
  key: 4,
  class: "mail-list mail-insert-list"
}, Us = /* @__PURE__ */ ae({
  __name: "InsertDialog",
  props: {
    visible: { type: Boolean },
    draft: {},
    face: {}
  },
  emits: ["close", "insert"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $ } = ve(), c = p("variable"), n = z(() => [
      { label: "Variable", value: "variable" },
      { label: "Part", value: "part" },
      ...r.face === "html" ? [{ label: "Image", value: "image" }] : [],
      ...r.draft.kind === "base" ? [{ label: "Message body", value: "block" }] : []
    ]);
    Q(() => r.visible, (j) => {
      j && (c.value = "variable", o.value = void 0, m.value = "");
    });
    const w = [
      { name: "site.title", hint: "Your workspace name" },
      { name: "site.url", hint: "Your workspace address" },
      { name: "sender.name", hint: "The person sending the message" },
      { name: "message.subject", hint: "This message’s subject" }
    ], k = z(() => [...Object.entries(r.draft.schema.properties).map(([S, N]) => ({
      text: r.draft.kind === "part" ? `{{ .${S} }}` : St(S),
      name: S,
      hint: typeof N.description == "string" ? N.description : ""
    })), ...w.map((S) => ({ text: `{{ ${S.name} }}`, name: S.name, hint: S.hint }))]), y = z(() => $.ofKind("part").filter((j) => !(r.draft.kind === "part" && j.name === r.draft.name))), g = z(() => $.ofKind("asset")), x = p(""), m = p("");
    async function _(j) {
      x.value = j, m.value = "";
      try {
        f("insert", xt(await le.get({ kind: "part", name: j })));
      } catch (S) {
        m.value = ne(S, "The part could not be read.");
      } finally {
        x.value = "";
      }
    }
    const o = p(), v = p(""), b = de();
    async function O(j, S) {
      x.value = j, m.value = "";
      try {
        const N = await le.get({ kind: "asset", name: j });
        o.value = { name: j, title: S, width: N.asset?.width }, v.value = S;
      } catch (N) {
        m.value = ne(N, "The image could not be read.");
      } finally {
        x.value = "";
      }
    }
    const A = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (j, S) => (l(), B(a(Ce), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      class: "mail-dialog",
      pt: A,
      "aria-label": "Insert",
      "onUpdate:visible": S[5] || (S[5] = (N) => {
        N || f("close");
      })
    }, {
      header: T(() => [
        t("span", ns, [
          s(a(L), {
            icon: "tabler:code-plus",
            "aria-hidden": "true"
          })
        ]),
        t("span", os, [
          S[6] || (S[6] = t("span", { class: "kx-modal-head-title" }, "Insert", -1)),
          t("span", rs, "Added at the cursor in " + u(e.face === "html" ? "HTML" : "plain text") + ".", 1)
        ])
      ]),
      default: T(() => [
        t("div", us, [
          s(a(he), {
            modelValue: c.value,
            "onUpdate:modelValue": S[0] || (S[0] = (N) => c.value = N),
            options: n.value,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "What to insert"
          }, null, 8, ["modelValue", "options"]),
          m.value ? (l(), i("p", ds, u(m.value), 1)) : V("", !0),
          c.value === "variable" ? (l(), i("ul", cs, [
            (l(!0), i(H, null, re(k.value, (N) => (l(), i("li", {
              key: N.name
            }, [
              t("button", {
                type: "button",
                class: "mail-row-link",
                onClick: (te) => f("insert", N.text)
              }, [
                s(a(L), {
                  icon: "tabler:variable",
                  "aria-hidden": "true"
                }),
                t("span", ms, [
                  t("span", bs, u(N.name), 1),
                  N.hint ? (l(), i("span", fs, u(N.hint), 1)) : V("", !0)
                ])
              ], 8, vs)
            ]))), 128))
          ])) : c.value === "part" ? (l(), i(H, { key: 2 }, [
            y.value.length ? (l(), i("ul", ys, [
              (l(!0), i(H, null, re(y.value, (N) => (l(), i("li", {
                key: N.name
              }, [
                t("button", {
                  type: "button",
                  class: "mail-row-link",
                  disabled: !!x.value,
                  onClick: (te) => _(N.name)
                }, [
                  s(a(L), {
                    icon: x.value === N.name ? "tabler:loader-2" : a(be).part,
                    class: oe({ spin: x.value === N.name }),
                    "aria-hidden": "true"
                  }, null, 8, ["icon", "class"]),
                  t("span", gs, [
                    t("span", null, u(N.title), 1),
                    t("span", ks, u(N.description), 1)
                  ])
                ], 8, hs)
              ]))), 128))
            ])) : (l(), i("p", ps, "There are no parts to include yet."))
          ], 64)) : c.value === "image" ? (l(), i(H, { key: 3 }, [
            o.value ? (l(), i("form", {
              key: 0,
              class: "mail-form",
              onSubmit: S[3] || (S[3] = xe((N) => f("insert", a(Ct)(o.value.name, v.value, o.value.width)), ["prevent"]))
            }, [
              t("div", $s, [
                t("label", {
                  class: "mail-field-label",
                  for: a(b)
                }, "Alternative text for " + u(o.value.title), 9, ws),
                s(a(ce), {
                  id: a(b),
                  modelValue: v.value,
                  "onUpdate:modelValue": S[1] || (S[1] = (N) => v.value = N),
                  autofocus: ""
                }, null, 8, ["id", "modelValue"]),
                S[7] || (S[7] = t("small", { class: "mail-field-hint" }, "Shown when the image does not load, and read aloud by screen readers.", -1))
              ]),
              t("div", _s, [
                s(a(F), {
                  label: "Back",
                  severity: "secondary",
                  outlined: "",
                  onClick: S[2] || (S[2] = (N) => o.value = void 0)
                }),
                s(a(F), {
                  label: "Insert image",
                  type: "submit"
                })
              ])
            ], 32)) : g.value.length ? (l(), i("ul", Cs, [
              (l(!0), i(H, null, re(g.value, (N) => (l(), i("li", {
                key: N.name
              }, [
                t("button", {
                  type: "button",
                  class: "mail-row-link",
                  disabled: !!x.value,
                  onClick: (te) => O(N.name, N.title)
                }, [
                  s(ca, {
                    name: N.name,
                    revision: N.revision
                  }, null, 8, ["name", "revision"]),
                  t("span", Ss, [
                    t("span", null, u(N.title), 1),
                    t("span", Rs, u(N.name), 1)
                  ]),
                  x.value === N.name ? (l(), B(a(L), {
                    key: 0,
                    icon: "tabler:loader-2",
                    class: "spin",
                    "aria-hidden": "true"
                  })) : V("", !0)
                ], 8, Vs)
              ]))), 128))
            ])) : (l(), i("p", xs, "There are no images yet. Upload one in Assets."))
          ], 64)) : (l(), i("ul", Ts, [
            t("li", null, [
              t("button", {
                type: "button",
                class: "mail-row-link",
                onClick: S[4] || (S[4] = (N) => f("insert", a(Rt)))
              }, [
                s(a(L), {
                  icon: "tabler:layout-rows",
                  "aria-hidden": "true"
                }),
                S[8] || (S[8] = t("span", { class: "mail-list-main" }, [
                  t("span", null, "Message body"),
                  t("span", { class: "mail-sub" }, "Where each message that uses this base template appears.")
                ], -1))
              ])
            ])
          ]))
        ])
      ]),
      _: 1
    }, 8, ["visible"]));
  }
}), As = ["disabled", "inert"], Ls = { class: "mail-form" }, js = { class: "mail-field" }, Is = ["for"], Ds = { class: "mail-field" }, Ns = ["for"], Ps = { class: "mail-field-hint" }, Es = { class: "mail-mono" }, zs = { class: "mail-field" }, Ms = ["for"], Os = { class: "mail-base-row" }, Bs = { class: "mail-kind" }, qs = ["id"], Hs = { class: "mail-code-frame mail-code-subject" }, Fs = { class: "mail-face-bar" }, Ks = { class: "mail-code-frame mail-code-body" }, Js = /* @__PURE__ */ ae({
  __name: "SourceEditor",
  props: {
    draft: {},
    problem: {},
    disabled: { type: Boolean }
  },
  setup(e) {
    const d = Xe(() => import("./CodeEditor-CIrhfC0V.js")), r = e, { library: f, go: $ } = ve(), c = { base: de(), title: de(), description: de(), face: de() }, n = p("html"), w = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], k = z(() => f.ofKind("base").map((o) => ({ value: o.name, label: o.title }))), y = p(), g = p(!1);
    function x(o) {
      g.value = !1, y.value?.insert(o);
    }
    const m = z(() => {
      const o = r.problem;
      if (o)
        return o.face === "html" || o.face === "text" || o.face === "subject" ? o.face : n.value;
    }), _ = z(() => (r.draft.kind === "message" ? "Body" : "Source") + (n.value === "html" ? ", HTML" : ", plain text"));
    return (o, v) => (l(), i("fieldset", {
      class: "mail-source-column",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      s(Ia, { label: "Name and description" }, {
        default: T(() => [
          t("div", Ls, [
            t("div", js, [
              t("label", {
                class: "mail-field-label",
                for: c.title
              }, "Name", 8, Is),
              s(a(ce), {
                id: c.title,
                modelValue: e.draft.title,
                "onUpdate:modelValue": v[0] || (v[0] = (b) => e.draft.title = b)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", Ds, [
              t("label", {
                class: "mail-field-label",
                for: c.description
              }, "Description", 8, Ns),
              s(a(ce), {
                id: c.description,
                modelValue: e.draft.description,
                "onUpdate:modelValue": v[1] || (v[1] = (b) => e.draft.description = b)
              }, null, 8, ["id", "modelValue"])
            ]),
            t("p", Ps, [
              v[10] || (v[10] = K("Reference ", -1)),
              t("span", Es, u(e.draft.name), 1),
              K(", used to " + u(e.draft.kind === "message" ? "send" : "include") + " it. It cannot change.", 1)
            ])
          ])
        ]),
        _: 1
      }),
      e.draft.kind === "message" ? (l(), i(H, { key: 0 }, [
        t("div", zs, [
          t("label", {
            class: "mail-field-label",
            for: c.base
          }, "Base template", 8, Ms),
          t("div", Os, [
            s(a(Ae), {
              modelValue: e.draft.base,
              "onUpdate:modelValue": v[2] || (v[2] = (b) => e.draft.base = b),
              "input-id": c.base,
              options: k.value,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              class: "mail-base-select"
            }, {
              value: T(({ value: b }) => [
                t("span", Bs, [
                  s(a(L), {
                    icon: a(be).base,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  K(u(k.value.find((O) => O.value === b)?.label ?? b), 1)
                ])
              ]),
              _: 1
            }, 8, ["modelValue", "input-id", "options"]),
            e.draft.base ? (l(), B(a(F), {
              key: 0,
              text: "",
              label: "Open",
              severity: "secondary",
              onClick: v[3] || (v[3] = (b) => a($)({ name: "resource", kind: "base", resource: e.draft.base, section: "content" }))
            })) : V("", !0)
          ])
        ]),
        t("div", {
          class: oe(["mail-field", { "mail-field-invalid": m.value === "subject" }])
        }, [
          t("span", {
            id: c.face + "-subject",
            class: "mail-field-label"
          }, "Subject", 8, qs),
          t("div", Hs, [
            s(a(d), {
              modelValue: e.draft.subject,
              "onUpdate:modelValue": v[4] || (v[4] = (b) => e.draft.subject = b),
              label: "Subject"
            }, null, 8, ["modelValue"])
          ]),
          e.problem && m.value === "subject" ? (l(), B(Ke, {
            key: 0,
            problem: e.problem,
            draft: e.draft
          }, null, 8, ["problem", "draft"])) : V("", !0)
        ], 2)
      ], 64)) : V("", !0),
      t("div", {
        class: oe(["mail-field", { "mail-field-invalid": e.problem && m.value !== "subject" }])
      }, [
        t("div", Fs, [
          s(a(he), {
            modelValue: n.value,
            "onUpdate:modelValue": v[5] || (v[5] = (b) => n.value = b),
            options: w,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": (e.draft.kind === "message" ? "Body" : "Source") + " format"
          }, null, 8, ["modelValue", "aria-label"]),
          s(a(F), {
            label: "Insert",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: v[6] || (v[6] = (b) => g.value = !0)
          }, {
            icon: T(() => [
              s(a(L), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        t("div", Ks, [
          n.value === "html" ? (l(), B(a(d), {
            ref_key: "editor",
            ref: y,
            key: "html",
            modelValue: e.draft.html,
            "onUpdate:modelValue": v[7] || (v[7] = (b) => e.draft.html = b),
            label: _.value
          }, null, 8, ["modelValue", "label"])) : (l(), B(a(d), {
            ref_key: "editor",
            ref: y,
            key: "text",
            modelValue: e.draft.text,
            "onUpdate:modelValue": v[8] || (v[8] = (b) => e.draft.text = b),
            label: _.value
          }, null, 8, ["modelValue", "label"]))
        ]),
        e.problem && m.value !== "subject" ? (l(), B(Ke, {
          key: 0,
          problem: e.problem,
          draft: e.draft
        }, null, 8, ["problem", "draft"])) : V("", !0)
      ], 2),
      s(Us, {
        visible: g.value,
        draft: e.draft,
        face: n.value,
        onClose: v[9] || (v[9] = (b) => g.value = !1),
        onInsert: x
      }, null, 8, ["visible", "draft", "face"])
    ], 8, As));
  }
}), Ws = ["disabled", "inert"], Ys = { class: "mail-sr-only" }, Gs = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Zs = {
  key: 1,
  class: "mail-muted"
}, Qs = ["aria-label"], Xs = {
  class: "mail-variable-row mail-variable-head",
  role: "row"
}, ei = {
  key: 0,
  role: "columnheader"
}, ai = { role: "cell" }, li = { role: "cell" }, ti = {
  role: "cell",
  class: "mail-variable-check"
}, si = { role: "cell" }, ii = {
  key: 0,
  role: "cell"
}, ni = { role: "cell" }, oi = { role: "cell" }, ri = {
  key: 1,
  class: "mail-field-error mail-variable-error",
  role: "alert"
}, ui = /* @__PURE__ */ ae({
  __name: "VariablesEditor",
  props: {
    draft: {},
    label: {},
    problem: {},
    disabled: { type: Boolean }
  },
  emits: ["invalid"],
  setup(e, { emit: d }) {
    const r = e, f = d, $ = [
      { value: "string", label: "Text" },
      { value: "number", label: "Number" },
      { value: "integer", label: "Whole number" },
      { value: "boolean", label: "Yes or no" },
      { value: "array", label: "List" },
      { value: "object", label: "Record" }
    ];
    let c = 0;
    function n(o) {
      return o == null ? "" : typeof o == "string" ? o : JSON.stringify(o);
    }
    function w(o) {
      const v = new Set(o.schema.required ?? []), b = o.samples;
      return Object.entries(o.schema.properties).map(([O, A]) => ({
        id: c++,
        name: O,
        schema: A,
        type: $.some((j) => j.value === A.type) ? A.type : "string",
        required: v.has(O),
        description: typeof A.description == "string" ? A.description : "",
        sample: n(b[O]),
        fallback: n(A.default)
      }));
    }
    const k = p(w(r.draft));
    Q(() => r.draft, (o) => {
      k.value = w(o);
    });
    function y(o, v) {
      if (v === "") return {};
      if (o.type === "string") return { value: v };
      try {
        const b = JSON.parse(v);
        return (o.type === "array" ? Array.isArray(b) : o.type === "object" ? !!b && typeof b == "object" && !Array.isArray(b) : o.type === "boolean" ? typeof b == "boolean" : typeof b == "number" && (o.type === "number" || Number.isInteger(b))) ? { value: b } : { invalid: `Enter a ${$.find((A) => A.value === o.type)?.label.toLowerCase()} value.` };
      } catch {
        return { invalid: o.type === "array" ? 'Enter a list, for example ["a", "b"].' : o.type === "object" ? 'Enter a record, for example {"key": "value"}.' : o.type === "boolean" ? "Enter true or false." : "Enter a number." };
      }
    }
    const g = z(() => k.value.map((o) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(o.name) ? k.value.some((v) => v !== o && v.name === o.name) ? "Another one has this name." : y(o, o.sample).invalid ?? y(o, o.fallback).invalid ?? "" : "Use letters, digits and underscores, starting with a letter."));
    Q(g, (o) => f("invalid", o.some(Boolean)), { immediate: !0 }), Q(k, (o) => {
      if (g.value.some(Boolean)) return;
      const v = {}, b = {};
      for (const A of o) {
        const j = { ...A.schema, type: A.type };
        A.description ? j.description = A.description : delete j.description;
        const S = y(A, A.fallback).value;
        S !== void 0 ? j.default = S : delete j.default, v[A.name] = j;
        const N = y(A, A.sample).value;
        N !== void 0 && (b[A.name] = N);
      }
      const O = o.filter((A) => A.required).map((A) => A.name);
      r.draft.schema = { ...r.draft.schema, properties: v, required: O.length ? O : void 0 }, r.draft.samples = b;
    }, { deep: !0 });
    function x() {
      let o = k.value.length + 1;
      for (; k.value.some((v) => v.name === `value_${o}`); ) o++;
      k.value.push({ id: c++, name: `value_${o}`, type: "string", required: !1, description: "", sample: "", fallback: "", schema: {} });
    }
    const m = z(() => r.draft.kind === "part"), _ = z(() => r.problem && (r.problem.face === "variables" || r.problem.face === "samples") ? `${Kl[r.problem.face]}: ${r.problem.message}` : "");
    return (o, v) => (l(), i("fieldset", {
      class: "mail-variables",
      disabled: e.disabled,
      inert: e.disabled || void 0
    }, [
      t("legend", Ys, u(e.label), 1),
      _.value ? (l(), i("p", Gs, u(_.value), 1)) : V("", !0),
      k.value.length ? (l(), i("div", {
        key: 2,
        class: "mail-variable-grid",
        role: "table",
        "aria-label": e.label
      }, [
        t("div", Xs, [
          v[0] || (v[0] = t("span", { role: "columnheader" }, "Name", -1)),
          v[1] || (v[1] = t("span", { role: "columnheader" }, "Type", -1)),
          v[2] || (v[2] = t("span", { role: "columnheader" }, "Required", -1)),
          v[3] || (v[3] = t("span", { role: "columnheader" }, "Description", -1)),
          m.value ? (l(), i("span", ei, "Default")) : V("", !0),
          v[4] || (v[4] = t("span", { role: "columnheader" }, "Sample value", -1)),
          v[5] || (v[5] = t("span", { role: "columnheader" }, [
            t("span", { class: "mail-sr-only" }, "Remove")
          ], -1))
        ]),
        (l(!0), i(H, null, re(k.value, (b, O) => (l(), i("div", {
          key: b.id,
          class: oe(["mail-variable-row", { "mail-variable-invalid": g.value[O] }]),
          role: "row"
        }, [
          t("span", ai, [
            s(a(ce), {
              modelValue: b.name,
              "onUpdate:modelValue": (A) => b.name = A,
              class: "mail-mono-input",
              "aria-label": "Name of " + (b.name || "value"),
              invalid: !!g.value[O]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label", "invalid"])
          ]),
          t("span", li, [
            s(a(Ae), {
              modelValue: b.type,
              "onUpdate:modelValue": (A) => b.type = A,
              options: $,
              "option-label": "label",
              "option-value": "value",
              "append-to": "self",
              "aria-label": "Type of " + b.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", ti, [
            s(a(hl), {
              modelValue: b.required,
              "onUpdate:modelValue": (A) => b.required = A,
              binary: "",
              "aria-label": b.name + " is required"
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", si, [
            s(a(ce), {
              modelValue: b.description,
              "onUpdate:modelValue": (A) => b.description = A,
              "aria-label": "Description of " + b.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          m.value ? (l(), i("span", ii, [
            s(a(ce), {
              modelValue: b.fallback,
              "onUpdate:modelValue": (A) => b.fallback = A,
              "aria-label": "Default of " + b.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ])) : V("", !0),
          t("span", ni, [
            s(a(ce), {
              modelValue: b.sample,
              "onUpdate:modelValue": (A) => b.sample = A,
              "aria-label": "Sample value of " + b.name
            }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"])
          ]),
          t("span", oi, [
            s(a(F), {
              text: "",
              severity: "secondary",
              "aria-label": "Remove " + b.name,
              title: "Remove " + b.name,
              onClick: (A) => k.value.splice(O, 1)
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["aria-label", "title", "onClick"])
          ]),
          g.value[O] ? (l(), i("small", ri, u(b.name) + ": " + u(g.value[O]), 1)) : V("", !0)
        ], 2))), 128))
      ], 8, Qs)) : (l(), i("p", Zs, u(e.draft.title) + " takes no " + u(e.label.toLowerCase()) + " yet.", 1)),
      t("div", null, [
        s(a(F), {
          label: m.value ? "Add input" : "Add variable",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: x
        }, {
          icon: T(() => [
            s(a(L), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])
      ])
    ], 8, Ws));
  }
}), di = { class: "kx-modal-head-icon" }, ci = {
  key: 0,
  class: "kx-modal-head-text"
}, vi = { class: "kx-modal-head-title" }, mi = {
  key: 0,
  class: "kx-modal-head-sub"
}, bi = {
  key: 1,
  class: "kx-modal-head-sub"
}, fi = {
  key: 0,
  class: "mail-form"
}, pi = { class: "mail-face-bar" }, yi = {
  key: 0,
  class: "mail-version-subject"
}, hi = { class: "mail-mono-block" }, gi = {
  key: 1,
  class: "mail-code-frame mail-code-version"
}, ki = /* @__PURE__ */ ae({
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
    const r = Xe(() => import("./CodeEditor-CIrhfC0V.js")), f = Xe(() => import("./DiffView-CjA70e3n.js")), $ = e, c = d, n = p("version"), w = p("html");
    Q(() => $.revision, (v) => {
      v && (n.value = $.compare ? "compare" : "version", w.value = "html");
    });
    const k = [{ label: "This version", value: "version" }, { label: "Compare with current", value: "compare" }], y = [{ label: "HTML", value: "html" }, { label: "Plain text", value: "text" }], g = z(() => $.revision?.revision === $.current.revision), x = z(() => {
      const v = $.revision;
      return v ? $.included || v.state === "original" && v.action === "reset" ? `${$.current.title}: the version included with ${$.current.origin_label}` : `${$.current.title}, version ${v.version}` : "";
    }), m = z(() => $.revision ? w.value === "html" ? $.revision.content.html : $.revision.content.text : ""), _ = z(() => w.value === "html" ? $.current.html : $.current.text), o = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (v, b) => (l(), B(a(Ce), {
      visible: !!e.revision,
      modal: "",
      draggable: !1,
      class: "mail-dialog mail-dialog-wide",
      pt: o,
      "aria-label": x.value,
      closable: !1,
      "close-on-escape": !e.busy,
      "onUpdate:visible": b[5] || (b[5] = (O) => {
        O || c("close");
      })
    }, {
      header: T(() => [
        t("span", di, [
          s(a(L), {
            icon: "tabler:history",
            "aria-hidden": "true"
          })
        ]),
        e.revision ? (l(), i("span", ci, [
          t("span", vi, u(x.value), 1),
          e.included ? (l(), i("span", mi, "Compare it with your customized version, or reset to it.")) : (l(), i("span", bi, u(a(ta)[e.revision.action]) + " by " + u(a(ye)(e.revision.author_label, e.revision.author)) + " · " + u(a(Pe)(e.revision.created_at)), 1))
        ])) : V("", !0)
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Close",
          severity: "secondary",
          outlined: "",
          disabled: e.busy,
          onClick: b[2] || (b[2] = (O) => c("close"))
        }, null, 8, ["disabled"]),
        e.revision && e.included ? (l(), B(a(F), {
          key: 0,
          label: "Reset to original",
          loading: e.busy,
          onClick: b[3] || (b[3] = (O) => c("reset"))
        }, {
          icon: T(() => [
            s(a(L), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : e.revision && !g.value ? (l(), B(a(F), {
          key: 1,
          label: "Restore this version",
          loading: e.busy,
          onClick: b[4] || (b[4] = (O) => c("restore", e.revision))
        }, {
          icon: T(() => [
            s(a(L), {
              icon: "tabler:restore",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["loading"])) : V("", !0)
      ]),
      default: T(() => [
        e.revision ? (l(), i("div", fi, [
          t("div", pi, [
            g.value ? V("", !0) : (l(), B(a(he), {
              key: 0,
              modelValue: n.value,
              "onUpdate:modelValue": b[0] || (b[0] = (O) => n.value = O),
              options: k,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Show"
            }, null, 8, ["modelValue"])),
            s(a(he), {
              modelValue: w.value,
              "onUpdate:modelValue": b[1] || (b[1] = (O) => w.value = O),
              options: y,
              "option-label": "label",
              "option-value": "value",
              "allow-empty": !1,
              "aria-label": "Format"
            }, null, 8, ["modelValue"])
          ]),
          e.revision.content.subject !== void 0 && n.value === "version" ? (l(), i("p", yi, [
            b[6] || (b[6] = t("span", { class: "mail-muted" }, "Subject", -1)),
            b[7] || (b[7] = K()),
            t("span", hi, u(e.revision.content.subject), 1)
          ])) : V("", !0),
          n.value === "version" ? (l(), i("div", gi, [
            (l(), B(a(r), {
              key: w.value,
              "model-value": m.value,
              label: x.value + (w.value === "html" ? ", HTML" : ", plain text"),
              "read-only": ""
            }, null, 8, ["model-value", "label"]))
          ])) : (l(), B(a(f), {
            key: "diff-" + w.value,
            before: m.value,
            after: _.value,
            "before-label": e.included || e.revision.state === "original" && e.revision.action === "reset" ? "Included version" : "Version " + e.revision.version,
            "after-label": "Current version"
          }, null, 8, ["before", "after", "before-label"]))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label", "close-on-escape"]));
  }
}), $i = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, wi = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, _i = {
  key: 2,
  class: "mail-muted",
  role: "status"
}, xi = {
  key: 3,
  class: "mail-history"
}, Ci = { class: "mail-history-head" }, Vi = { class: "mail-history-main" }, Si = { class: "mail-history-title" }, Ri = { class: "mail-sub" }, Ti = {
  key: 0,
  class: "mail-history-note"
}, Ui = { class: "mail-history-actions" }, Ai = /* @__PURE__ */ ae({
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
    return (d, r) => e.error ? (l(), i("div", $i, [
      t("span", null, u(e.error), 1),
      s(a(F), {
        label: "Retry",
        severity: "secondary",
        outlined: "",
        size: "small",
        onClick: r[0] || (r[0] = (f) => d.$emit("retry"))
      })
    ])) : e.loading && !e.revisions.length ? (l(), i("p", wi, [
      s(a(L), {
        icon: "tabler:loader-2",
        class: "spin",
        "aria-hidden": "true"
      }),
      r[1] || (r[1] = K("Loading history…", -1))
    ])) : e.revisions.length ? (l(), i("ol", xi, [
      (l(!0), i(H, null, re(e.revisions, (f) => (l(), i("li", {
        key: f.revision,
        class: "mail-history-row"
      }, [
        t("div", Ci, [
          t("div", Vi, [
            t("span", Si, [
              K(" Version " + u(f.version) + " · " + u(a(ta)[f.action]) + u(f.restored_from ? " from version " + f.restored_from : "") + " ", 1),
              f.revision === e.resource.revision ? (l(), B(a(Ue), {
                key: 0,
                severity: "success",
                value: "Current",
                class: "kx-tag-sm"
              })) : V("", !0)
            ]),
            t("span", Ri, u(a(ye)(f.author_label, f.author)) + " · " + u(a(Pe)(f.created_at)), 1),
            f.note ? (l(), i("span", Ti, u(f.note), 1)) : V("", !0)
          ]),
          t("div", Ui, [
            s(a(F), {
              label: "Show this version",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: ($) => d.$emit("show", f)
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:eye",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            f.revision !== e.resource.revision ? (l(), B(a(F), {
              key: 0,
              label: "Restore",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: e.busy === f.revision,
              disabled: e.busy !== void 0,
              onClick: ($) => d.$emit("restore", f)
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:restore",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
          ])
        ])
      ]))), 128))
    ])) : (l(), i("p", _i, u(e.resource.title) + " has not been changed yet. Each saved change is kept here, newest first. ", 1));
  }
}), Li = { class: "kx-modal-head-icon mail-head-warn" }, ji = { class: "kx-modal-head-text" }, Ii = { class: "kx-modal-head-title" }, Di = { class: "mail-dialog-text" }, Ni = {
  key: 0,
  class: "mail-list"
}, Pi = ["onClick"], Da = /* @__PURE__ */ ae({
  __name: "RefusalDialog",
  props: {
    refusal: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const r = d, f = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    function $(c) {
      r("close"), c();
    }
    return (c, n) => (l(), B(a(Ce), {
      visible: !!e.refusal,
      modal: "",
      draggable: !1,
      closable: !1,
      "close-on-escape": "",
      class: "mail-dialog",
      pt: f,
      role: "alertdialog",
      "aria-label": e.refusal?.header,
      "onUpdate:visible": n[1] || (n[1] = (w) => {
        w || r("close");
      })
    }, {
      header: T(() => [
        t("span", Li, [
          s(a(L), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        t("span", ji, [
          t("span", Ii, u(e.refusal?.header), 1)
        ])
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Close",
          autofocus: "",
          onClick: n[0] || (n[0] = (w) => r("close"))
        })
      ]),
      default: T(() => [
        t("p", Di, u(e.refusal?.message), 1),
        e.refusal?.links.length ? (l(), i("ul", Ni, [
          (l(!0), i(H, null, re(e.refusal.links, (w) => (l(), i("li", {
            key: w.label
          }, [
            t("button", {
              type: "button",
              class: "mail-row-link",
              onClick: (k) => $(w.open)
            }, [
              s(a(L), {
                icon: "tabler:mail",
                "aria-hidden": "true"
              }),
              t("span", null, u(w.label), 1)
            ], 8, Pi)
          ]))), 128))
        ])) : V("", !0)
      ]),
      _: 1
    }, 8, ["visible", "aria-label"]));
  }
}), Ei = { class: "mail-stack" }, zi = {
  key: 0,
  class: "mail-group",
  "aria-labelledby": "used-by-messages"
}, Mi = {
  key: 0,
  class: "mail-muted"
}, Oi = {
  key: 1,
  class: "mail-list"
}, Bi = ["onClick"], qi = {
  class: "mail-group",
  "aria-labelledby": "used-by-recent"
}, Hi = { class: "mail-group-head" }, Fi = {
  key: 0,
  class: "mail-muted"
}, Ki = {
  key: 1,
  class: "mail-list"
}, Ji = { class: "mail-list-main" }, Wi = {
  key: 0,
  class: "mail-sub"
}, Yi = { class: "mail-muted" }, Gi = {
  key: 2,
  class: "mail-group",
  "aria-labelledby": "used-by-templates"
}, Zi = { class: "mail-muted" }, Qi = /* @__PURE__ */ ae({
  __name: "UsedBy",
  props: {
    resource: {}
  },
  setup(e) {
    const d = e, { library: r, go: f, capabilities: $ } = ve(), c = z(() => (d.resource.used_by?.messages ?? []).map((w) => ({
      name: w,
      title: r.find("message", w)?.title ?? w
    }))), n = z(() => d.resource.used_by?.recent_senders ?? []);
    return (w, k) => (l(), i("div", Ei, [
      e.resource.kind === "base" || e.resource.kind === "asset" ? (l(), i("section", zi, [
        k[1] || (k[1] = t("h2", {
          id: "used-by-messages",
          class: "mail-label"
        }, "Messages", -1)),
        c.value.length ? (l(), i("ul", Oi, [
          (l(!0), i(H, null, re(c.value, (y) => (l(), i("li", {
            key: y.name
          }, [
            t("button", {
              type: "button",
              class: "mail-row-link",
              onClick: (g) => a(f)({ name: "resource", kind: "message", resource: y.name, section: "content" })
            }, [
              s(a(L), {
                icon: a(be).message,
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              t("span", null, u(y.title), 1)
            ], 8, Bi)
          ]))), 128))
        ])) : (l(), i("p", Mi, "No messages " + u(e.resource.kind === "asset" ? "show" : "use") + " " + u(e.resource.title) + ".", 1))
      ])) : e.resource.kind === "message" ? (l(), i(H, { key: 1 }, [
        t("section", qi, [
          t("div", Hi, [
            k[2] || (k[2] = t("h2", {
              id: "used-by-recent",
              class: "mail-label"
            }, "Sent in the last 30 days", -1)),
            a($)?.administer_delivery ? (l(), i("button", {
              key: 0,
              type: "button",
              class: "mail-text-link",
              onClick: k[0] || (k[0] = (y) => a(f)({ name: "activity", template: e.resource.name }))
            }, "Open in Activity")) : V("", !0)
          ]),
          n.value.length ? (l(), i("ul", Ki, [
            (l(!0), i(H, null, re(n.value, (y) => (l(), i("li", {
              key: y.sender + (y.origin?.id ?? ""),
              class: "mail-list-row"
            }, [
              s(a(L), {
                icon: y.origin ? "tabler:bolt" : "tabler:user",
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              t("span", Ji, [
                t("span", null, u(a(ye)(y.sender_label, y.sender)), 1),
                y.origin ? (l(), i("span", Wi, u(a(We)(y.origin)), 1)) : V("", !0)
              ]),
              t("span", Yi, u(a(pe)(y.count, "message")), 1)
            ]))), 128))
          ])) : (l(), i("p", Fi, "Nobody has sent " + u(e.resource.title) + " recently.", 1))
        ]),
        k[3] || (k[3] = t("section", {
          class: "mail-group",
          "aria-labelledby": "used-by-setup"
        }, [
          t("h2", {
            id: "used-by-setup",
            class: "mail-label"
          }, "Set up to send"),
          t("p", { class: "mail-muted" }, "Workflows, automations and agents that name this message are not listed here yet.")
        ], -1))
      ], 64)) : (l(), i("section", Gi, [
        k[4] || (k[4] = t("h2", {
          id: "used-by-templates",
          class: "mail-label"
        }, "Templates", -1)),
        t("p", Zi, "Templates that include " + u(e.resource.title) + " are not listed here yet. Deleting a part checks every message first.", 1)
      ]))
    ]));
  }
}), Xi = {
  key: 1,
  class: "kx-notice warn mail-block",
  role: "alert"
}, en = {
  key: 0,
  class: "kx-err mail-error",
  role: "alert"
}, an = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, ln = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, tn = {
  key: 1,
  class: "mail-muted mail-blocked",
  role: "status"
}, sn = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, nn = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, on = {
  key: 4,
  class: "kx-notice info mail-block",
  role: "status"
}, rn = {
  key: 5,
  class: "kx-notice mail-customized"
}, un = { class: "mail-customized-text" }, dn = { class: "mail-editor-layout" }, cn = /* @__PURE__ */ ae({
  __name: "ResourcePage",
  props: {
    kind: {},
    name: {},
    section: {}
  },
  setup(e) {
    const d = e, { library: r, capabilities: f, delivery: $, go: c, create: n, setDirty: w } = ve(), k = z(() => ({ kind: d.kind, name: d.name })), y = fe(), g = p(), x = p(!0), m = p(!1), _ = p(!1), o = p(""), v = p(), b = ge(), O = z(() => !!g.value && !!y.value && !$t(g.value, y.value));
    Q(O, (E) => w(E), { immediate: !0 }), Qe(() => w(!1));
    async function A(E = {}) {
      const M = b();
      try {
        const J = await le.get(k.value);
        if (!M()) return;
        if (E.keepDraft && O.value && y.value && J.revision !== y.value.revision) {
          v.value = { revision: J.revision, by: ye(J.author_label, J.author) || "Someone" };
          return;
        }
        y.value = J, g.value = ke(J), v.value = void 0, m.value = _.value = !1, o.value = "";
      } catch (J) {
        if (!M()) return;
        m.value = qe(J), _.value = Le(J), o.value = m.value || _.value ? "" : ne(J, "This resource could not be loaded."), m.value && (y.value = void 0, g.value = void 0);
      } finally {
        M() && (x.value = !1);
      }
    }
    const j = fe([]), S = p(!1), N = p(""), te = ge();
    async function W() {
      const E = te();
      S.value = !0;
      try {
        const M = await le.history(k.value);
        if (!E()) return;
        j.value = M, N.value = "";
      } catch (M) {
        if (!E()) return;
        N.value = qe(M) ? "" : ne(M, "History could not be loaded.");
      } finally {
        E() && (S.value = !1);
      }
    }
    async function R() {
      await Promise.all([A({ keepDraft: !0 }), W()]);
    }
    De(R), Ne((E) => {
      E.kind === d.kind && E.name === d.name ? R() : d.kind === "base" && E.kind === "message" && A({ keepDraft: !0 });
    });
    const h = p(), U = p(""), D = p(!1), I = p(""), G = p(), C = z(() => y.value?.title ?? d.name), P = z(() => {
      const E = y.value, M = C.value, J = E?.used_by?.messages?.length ?? 0, ie = E?.used_by?.recent_senders?.find((Ge) => Ge.origin);
      return {
        content: {
          message: { title: "Message", description: "What recipients read." + (ie?.origin ? ` Sent recently by “${We(ie.origin)}”.` : "") },
          base: { title: "Layout", description: J ? `The frame around the ${pe(J, "message")} that ${J === 1 ? "uses" : "use"} ${M}.` : `The frame around messages that use ${M}.` },
          part: { title: "Content", description: `Shown wherever ${M} is included.` }
        }[d.kind],
        variables: d.kind === "message" ? { title: "Variables", description: "The values a sender provides, with the samples used for previews and tests." } : { title: "Inputs", description: `The values passed to ${M} where it is included, with their defaults.` },
        "used-by": {
          title: "Used by",
          description: d.kind === "message" ? `Who sends ${M}.` : d.kind === "base" ? `Messages that use ${M}.` : `Templates that include ${M}.`
        },
        history: { title: "History", description: `Every saved version of ${M}, newest first.` }
      }[d.section];
    }), q = z(() => {
      const E = y.value;
      return E?.state !== "customized" ? "" : `Customized by ${ye(E.author_label, E.author)} ${sl(E.updated_at)} from the version included with ${E.origin_label}.`;
    }), Z = z(() => {
      const E = y.value;
      if (!E?.original) return;
      const { kind: M, name: J, title: ie, description: se } = E;
      return {
        kind: M,
        name: J,
        revision: -1,
        version: 0,
        action: "reset",
        state: "original",
        author: "",
        created_at: 0,
        content: { kind: M, name: J, title: ie, description: se, ...E.original }
      };
    }), X = p(), Y = p(), ee = p(!1), je = z(() => Y.value ?? X.value);
    Q(() => JSON.stringify(g.value), () => {
      Y.value = void 0;
    });
    const Pa = z(() => !!je.value || ee.value || !!v.value), va = z(() => v.value ? "Discard your changes to load the newer version first." : ee.value ? "Fix the variables first." : je.value ? "Fix the error first." : "");
    function Ee(E, M) {
      D.value = _e(E) === "mail_revision_conflict", D.value && R(), U.value = ne(E, M);
    }
    function ma() {
      if (!y.value) return;
      const E = !!v.value;
      g.value = ke(y.value), v.value = void 0, Y.value = void 0, E && A();
    }
    const Ve = p(!1), ze = p(""), Me = p();
    function Ea() {
      ze.value = "", Me.value = void 0, Ve.value = !0;
    }
    async function za(E) {
      const M = y.value, J = g.value;
      if (!(!M || !J || h.value !== void 0)) {
        h.value = "save", ze.value = U.value = I.value = "", Me.value = void 0;
        try {
          const ie = await le.update(J, M.revision, E || void 0);
          y.value = { ...M, ...ie }, g.value = ke(y.value), Ve.value = !1, I.value = `Saved ${ie.title}.${d.kind === "message" ? "" : " Every message that uses it has the change."}`, await R();
        } catch (ie) {
          const se = Te(ie), $e = se?.resource?.kind === J.kind && se.resource.name === J.name;
          se?.dependents?.length && !$e ? Me.value = { names: se.dependents, reason: se.reasons?.[0]?.message ?? se.message } : se ? (Y.value = se, Ve.value = !1) : _e(ie) === "mail_revision_conflict" ? (Ve.value = !1, await A({ keepDraft: !0 })) : ze.value = ne(ie, `${J.title} could not be saved.`);
        } finally {
          h.value = void 0;
        }
      }
    }
    async function Ma() {
      const E = y.value;
      if (!(!E || h.value !== void 0)) {
        h.value = "test", U.value = I.value = "";
        try {
          await le.sendTest(E.name), I.value = "Test sent to you with the sample values. It appears in Activity.";
        } catch (M) {
          Ee(M, "The test could not be sent.");
        } finally {
          h.value = void 0;
        }
      }
    }
    const ba = z(() => O.value ? "Save your changes to send a test." : f.value?.send ? $.value && !$.value.configured ? "Mail delivery is not set up. Open Delivery settings." : "" : "Ask an administrator for permission to send mail.");
    async function fa() {
      const E = y.value;
      if (!(!E || h.value !== void 0 || !await Re.confirm({
        header: `Reset ${E.title} to the original?`,
        message: `Your changes are replaced by the version included with ${E.origin_label}. They stay in History, so you can restore them.`,
        acceptLabel: "Reset to original",
        rejectLabel: "Cancel"
      }))) {
        h.value = "reset", U.value = I.value = "", D.value = !1;
        try {
          y.value = await le.reset(k.value, E.revision), g.value = ke(y.value), I.value = `${E.title} is back to the original. Your changes are in History.`, await R();
        } catch (J) {
          Ee(J, `${E.title} could not be reset.`);
        } finally {
          h.value = void 0;
        }
      }
    }
    const Ie = p(), pa = p(!1), ya = p(!1);
    function ha(E, M = !1, J = !1) {
      pa.value = M, ya.value = J, Ie.value = E;
    }
    async function ga(E) {
      const M = y.value;
      if (!(!M || h.value !== void 0 || !await Re.confirm({
        header: `Restore version ${E.version} of ${M.title}?`,
        message: "It becomes the current version. The current version stays in History.",
        acceptLabel: "Restore this version",
        rejectLabel: "Cancel"
      }))) {
        h.value = E.revision, U.value = I.value = "";
        try {
          y.value = await le.restore(k.value, E.revision, M.revision), g.value = ke(y.value), Ie.value = void 0, I.value = `Version ${E.version} from ${Pe(E.created_at)} is now in effect.`, await R();
        } catch (ie) {
          const se = Te(ie);
          se?.dependents?.length ? Ye(M, se.dependents, `Restoring version ${E.version} would break them: ${se.message}`) : Ee(ie, "That version could not be restored.");
        } finally {
          h.value = void 0;
        }
      }
    }
    function Ye(E, M, J) {
      const ie = M.map(($e) => r.find("message", $e)?.title ?? $e), se = E.kind === "base" ? "use" : "include";
      G.value = {
        header: J ? `${E.title} cannot change this way` : `${E.title} is in use`,
        message: J ?? `${pe(M.length, "message")} ${M.length === 1 ? se + "s" : se} it: ${ie.join(", ")}. Remove it from ${M.length === 1 ? "that message" : "them"} first.`,
        links: M.map(($e, Ge) => ({ label: ie[Ge], open: () => c({ name: "resource", kind: "message", resource: $e, section: "content" }) }))
      };
    }
    async function Oa() {
      const E = y.value;
      if (!E || E.state !== "created" || h.value !== void 0) return;
      const M = E.used_by?.messages ?? [];
      if (E.kind === "base" && M.length) {
        Ye(E, M);
        return;
      }
      if (await Re.confirm({
        header: `Delete ${E.title}?`,
        message: E.kind === "base" ? "It is not used anywhere. You can't undo this." : "You can't undo this.",
        acceptLabel: `Delete ${me[E.kind].toLowerCase()}`,
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) {
        h.value = "delete", U.value = I.value = "";
        try {
          await le.remove(k.value, E.revision), w(!1), c({ name: "library", section: ea(d.kind) });
        } catch (ie) {
          const se = Te(ie);
          se?.dependents?.length ? Ye(E, se.dependents) : Ee(ie, `${E.title} could not be deleted.`);
        } finally {
          h.value = void 0;
        }
      }
    }
    function Ba() {
      const E = y.value;
      E && n({ kind: d.kind, from: { kind: E.kind, name: E.name } });
    }
    const qa = z(() => d.kind === "base" ? y.value?.used_by?.messages : void 0), Oe = z(() => h.value === "save");
    return A(), Q(() => d.section, (E) => {
      E === "history" && !j.value.length && W();
    }, { immediate: !0 }), (E, M) => (l(), i(H, null, [
      m.value ? (l(), B(oa, {
        key: 0,
        icon: "tabler:file-off",
        title: "This resource no longer exists",
        hint: "It was deleted while you were away.",
        cta: "All " + a(la)[e.kind].toLowerCase(),
        "cta-icon": "tabler:table",
        onCta: M[0] || (M[0] = (J) => a(c)({ name: "library", section: a(ea)(e.kind) }))
      }, null, 8, ["cta"])) : _.value ? (l(), i("p", Xi, [
        s(a(L), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        M[9] || (M[9] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : (l(), i(H, { key: 2 }, [
        s(Je, {
          title: P.value.title,
          description: P.value.description
        }, aa({ _: 2 }, [
          y.value ? {
            name: "actions",
            fn: T(() => [
              O.value ? (l(), B(il, {
                key: 0,
                busy: Oe.value,
                "review-disabled": Pa.value,
                onDiscard: ma,
                onReview: Ea
              }, null, 8, ["busy", "review-disabled"])) : (l(), i(H, { key: 1 }, [
                e.kind === "message" ? (l(), B(a(F), {
                  key: 0,
                  label: "Send test to me",
                  severity: "secondary",
                  outlined: "",
                  loading: h.value === "test",
                  disabled: !!ba.value || h.value !== void 0,
                  title: ba.value || void 0,
                  onClick: Ma
                }, {
                  icon: T(() => [
                    s(a(L), {
                      icon: "tabler:send",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled", "title"])) : V("", !0),
                s(a(F), {
                  label: "Duplicate",
                  severity: "secondary",
                  outlined: "",
                  disabled: h.value !== void 0,
                  onClick: Ba
                }, {
                  icon: T(() => [
                    s(a(L), {
                      icon: "tabler:copy",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                y.value.state === "created" ? (l(), B(a(F), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: h.value === "delete",
                  disabled: h.value !== void 0,
                  onClick: Oa
                }, {
                  icon: T(() => [
                    s(a(L), {
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
        o.value ? (l(), i("div", en, [
          t("span", null, u(o.value), 1),
          s(a(F), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: M[1] || (M[1] = (J) => R())
          })
        ])) : x.value ? (l(), i("p", an, [
          s(a(L), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          K("Loading " + u(C.value) + "…", 1)
        ])) : V("", !0),
        y.value && g.value ? (l(), i(H, { key: 2 }, [
          v.value ? (l(), i("p", ln, [
            s(a(L), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            t("span", null, [
              K(u(v.value.by) + " saved " + u(y.value.title) + " while you were editing. Discard your changes to load theirs, or compare first. ", 1),
              t("button", {
                type: "button",
                class: "mail-text-link",
                onClick: ma
              }, "Discard and load")
            ])
          ])) : V("", !0),
          O.value && va.value && !v.value ? (l(), i("p", tn, u(va.value), 1)) : V("", !0),
          U.value && D.value ? (l(), i("p", sn, [
            s(a(L), {
              icon: "tabler:alert-triangle",
              "aria-hidden": "true"
            }),
            K(u(U.value), 1)
          ])) : U.value ? (l(), i("p", nn, [
            t("span", null, u(U.value), 1)
          ])) : V("", !0),
          I.value ? (l(), i("p", on, [
            s(a(L), {
              icon: "tabler:circle-check",
              "aria-hidden": "true"
            }),
            K(u(I.value), 1)
          ])) : V("", !0),
          q.value && e.section === "content" ? (l(), i("div", rn, [
            s(a(L), {
              icon: "tabler:pencil",
              "aria-hidden": "true"
            }),
            t("span", un, u(q.value), 1),
            Z.value ? (l(), B(a(F), {
              key: 0,
              label: "Compare with original",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: M[2] || (M[2] = (J) => ha(Z.value, !0, !0))
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:arrows-diff",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : V("", !0),
            s(a(F), {
              label: "Reset to original",
              severity: "secondary",
              outlined: "",
              size: "small",
              loading: h.value === "reset",
              disabled: h.value !== void 0 || O.value,
              onClick: fa
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:arrow-back-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["loading", "disabled"])
          ])) : V("", !0),
          Za(t("div", dn, [
            s(Js, {
              draft: g.value,
              problem: je.value,
              disabled: Oe.value
            }, null, 8, ["draft", "problem", "disabled"]),
            s(qt, {
              draft: g.value,
              messages: qa.value,
              onProblem: M[3] || (M[3] = (J) => X.value = J)
            }, null, 8, ["draft", "messages"])
          ], 512), [
            [Qa, e.section === "content"]
          ]),
          e.section === "variables" ? (l(), B(ui, {
            key: 6,
            draft: g.value,
            label: P.value.title,
            problem: je.value,
            disabled: Oe.value,
            onInvalid: M[4] || (M[4] = (J) => ee.value = J)
          }, null, 8, ["draft", "label", "problem", "disabled"])) : e.section === "used-by" ? (l(), B(Qi, {
            key: 7,
            resource: y.value
          }, null, 8, ["resource"])) : e.section === "history" ? (l(), B(Ai, {
            key: 8,
            resource: y.value,
            revisions: j.value,
            loading: S.value,
            error: N.value,
            busy: typeof h.value == "number" ? h.value : h.value ? -1 : void 0,
            onShow: ha,
            onRestore: ga,
            onRetry: W
          }, null, 8, ["resource", "revisions", "loading", "error", "busy"])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      y.value && g.value ? (l(), B(ls, {
        key: 3,
        visible: Ve.value,
        saved: a(ke)(y.value),
        draft: g.value,
        busy: Oe.value,
        error: ze.value,
        dependents: Me.value,
        onClose: M[5] || (M[5] = (J) => Ve.value = !1),
        onSave: za
      }, null, 8, ["visible", "saved", "draft", "busy", "error", "dependents"])) : V("", !0),
      y.value ? (l(), B(ki, {
        key: 4,
        revision: Ie.value,
        current: y.value,
        compare: pa.value,
        included: ya.value,
        busy: typeof h.value == "number" || h.value === "reset",
        onClose: M[6] || (M[6] = (J) => Ie.value = void 0),
        onRestore: ga,
        onReset: M[7] || (M[7] = (J) => {
          Ie.value = void 0, fa();
        })
      }, null, 8, ["revision", "current", "compare", "included", "busy"])) : V("", !0),
      s(Da, {
        refusal: G.value,
        onClose: M[8] || (M[8] = (J) => G.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), vn = { class: "kx-modal-head-icon" }, mn = { class: "kx-modal-head-text" }, bn = { class: "kx-modal-head-title" }, fn = { class: "kx-modal-head-sub" }, pn = ["disabled", "inert"], yn = ["for"], hn = { class: "mail-muted" }, gn = {
  key: 0,
  class: "mail-field-error",
  role: "alert"
}, kn = {
  key: 0,
  class: "mail-field"
}, $n = ["for"], wn = ["for"], _n = ["id"], xn = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, Cn = 1024 * 1024, Na = /* @__PURE__ */ ae({
  __name: "UploadAsset",
  props: {
    visible: { type: Boolean },
    replace: {}
  },
  emits: ["close", "done"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = { file: de(), title: de(), name: de() }, w = ["image/png", "image/jpeg", "image/gif"], k = p(), y = p(), g = p(""), x = p(""), m = p(!1), _ = p(!1), o = p(""), v = p(""), b = p("");
    Q(() => r.visible, (W) => {
      W && (k.value = y.value = void 0, g.value = r.replace?.title ?? "", x.value = r.replace?.name ?? "", m.value = !1, o.value = v.value = b.value = "");
    }), Q(g, (W) => {
      !r.replace && !m.value && (x.value = xa(W));
    });
    function O(W) {
      return new Promise((R) => {
        const h = URL.createObjectURL(W), U = new Image();
        U.onload = () => {
          R({ width: U.naturalWidth, height: U.naturalHeight }), URL.revokeObjectURL(h);
        }, U.onerror = () => {
          R(void 0), URL.revokeObjectURL(h);
        }, U.src = h;
      });
    }
    async function A(W) {
      const R = Array.isArray(W.files) ? W.files[0] : W.files;
      if (v.value = "", k.value = void 0, !!R) {
        if (!w.includes(R.type)) {
          v.value = "Use a PNG, JPEG or GIF image.";
          return;
        }
        if (R.size > Cn) {
          v.value = "Images must be 1 MB or smaller.";
          return;
        }
        k.value = R, y.value = await O(R), !r.replace && !g.value && (g.value = R.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
    }
    function j() {
      return b.value = "", r.replace ? !0 : (Ca.test(x.value) ? $.find("asset", x.value) && (b.value = `An image named ${x.value} already exists. Choose another name or replace ${x.value}.`) : b.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.", !b.value);
    }
    async function S() {
      if (!(_.value || !k.value || !g.value.trim() || !j())) {
        _.value = !0, o.value = "";
        try {
          const W = await nl.add(k.value), R = { name: x.value, upload_id: W, title: g.value.trim(), ...y.value }, h = r.replace ? await le.replaceAsset(R, r.replace.revision) : await le.addAsset(R);
          await $.load(), f("done", h), f("close"), r.replace || c({ name: "library", section: "assets", asset: h.name });
        } catch (W) {
          _e(W) === "mail_revision_conflict" && !r.replace ? b.value = `An image named ${x.value} already exists. Choose another name or replace ${x.value}.` : o.value = ne(W, "The image could not be uploaded.");
        } finally {
          _.value = !1;
        }
      }
    }
    const N = z(() => r.replace ? `Replace ${r.replace.title}` : "Upload image"), te = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } };
    return (W, R) => (l(), B(a(Ce), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !_.value,
      "close-on-escape": !_.value,
      class: "mail-dialog",
      pt: te,
      "aria-label": N.value,
      "onUpdate:visible": R[4] || (R[4] = (h) => {
        h || f("close");
      })
    }, {
      header: T(() => [
        t("span", vn, [
          s(a(L), {
            icon: "tabler:photo-up",
            "aria-hidden": "true"
          })
        ]),
        t("span", mn, [
          t("span", bn, u(N.value), 1),
          t("span", fn, u(e.replace ? "Every template that shows it changes at once." : "PNG, JPEG or GIF, up to 1 MB."), 1)
        ])
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: _.value,
          onClick: R[3] || (R[3] = (h) => f("close"))
        }, null, 8, ["disabled"]),
        s(a(F), {
          label: e.replace ? "Replace image" : "Upload image",
          type: "submit",
          form: "mail-upload",
          loading: _.value,
          disabled: !k.value || !e.replace && !g.value.trim()
        }, null, 8, ["label", "loading", "disabled"])
      ]),
      default: T(() => [
        t("form", {
          id: "mail-upload",
          class: "mail-form",
          onSubmit: xe(S, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: _.value,
            inert: _.value || void 0
          }, [
            t("div", {
              class: oe(["mail-field", { "mail-field-invalid": v.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: n.file
              }, "Image", 8, yn),
              s(a(gl), {
                mode: "basic",
                auto: !1,
                "custom-upload": "",
                accept: "image/png,image/jpeg,image/gif",
                "choose-label": k.value ? "Choose another file" : "Choose file",
                class: "mail-file-row",
                pt: { input: { id: n.file, "aria-label": "Image file" } },
                onSelect: A
              }, {
                chooseicon: T(() => [
                  s(a(L), {
                    icon: "tabler:file-upload",
                    "aria-hidden": "true"
                  })
                ]),
                filelabel: T(() => [
                  t("span", hn, u(k.value ? `${k.value.name} · ${a(He)(k.value.size)}${y.value ? ` · ${y.value.width} × ${y.value.height}` : ""}` : "No file chosen"), 1)
                ]),
                _: 1
              }, 8, ["choose-label", "pt"]),
              v.value ? (l(), i("small", gn, u(v.value), 1)) : V("", !0)
            ], 2),
            e.replace ? V("", !0) : (l(), i("div", kn, [
              t("label", {
                class: "mail-field-label",
                for: n.title
              }, "Name", 8, $n),
              s(a(ce), {
                id: n.title,
                modelValue: g.value,
                "onUpdate:modelValue": R[0] || (R[0] = (h) => g.value = h)
              }, null, 8, ["id", "modelValue"])
            ])),
            e.replace ? V("", !0) : (l(), i("div", {
              key: 1,
              class: oe(["mail-field", { "mail-field-invalid": b.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: n.name
              }, "Reference", 8, wn),
              s(a(ce), {
                id: n.name,
                modelValue: x.value,
                "onUpdate:modelValue": R[1] || (R[1] = (h) => x.value = h),
                class: "mail-mono-input",
                invalid: !!b.value,
                "aria-describedby": n.name + "-hint",
                onInput: R[2] || (R[2] = (h) => m.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: n.name + "-hint",
                class: oe(b.value ? "mail-field-error" : "mail-field-hint")
              }, u(b.value || "Templates show it with this name. It cannot change later."), 11, _n)
            ], 2))
          ], 8, pn),
          o.value ? (l(), i("p", xn, u(o.value), 1)) : V("", !0)
        ], 32)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), Vn = { class: "mail-drawer-body" }, Sn = { class: "mail-drawer-head" }, Rn = { class: "mail-drawer-title" }, Tn = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, Un = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, An = {
  key: 2,
  class: "kx-err mail-error",
  role: "alert"
}, Ln = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, jn = {
  key: 1,
  class: "kx-notice info mail-block",
  role: "status"
}, In = { class: "mail-asset-actions" }, Dn = { class: "mail-asset-hero" }, Nn = { class: "mail-facts mail-card" }, Pn = { class: "mail-reference" }, En = { class: "mail-mono-block" }, zn = {
  class: "mail-group",
  "aria-labelledby": "asset-shown"
}, Mn = {
  key: 0,
  class: "mail-muted"
}, On = { class: "mail-list" }, Bn = ["onClick"], qn = {
  key: 0,
  class: "mail-asset-context"
}, Hn = ["srcdoc", "title"], Fn = {
  class: "mail-group",
  "aria-labelledby": "asset-history"
}, Kn = {
  key: 0,
  class: "mail-muted"
}, Jn = {
  key: 1,
  class: "mail-history"
}, Wn = { class: "mail-history-head" }, Yn = { class: "mail-history-main" }, Gn = { class: "mail-history-title" }, Zn = { class: "mail-sub" }, Qn = /* @__PURE__ */ ae({
  __name: "AssetDrawer",
  props: {
    name: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = fe(), w = fe([]), k = fe(), y = p(""), g = p(!1), x = p(!1), m = p(""), _ = p(""), o = p(""), v = p(), b = p(!1), O = p(!1), A = p(), j = ge();
    async function S() {
      const U = r.name, D = j();
      if (!U) {
        n.value = void 0;
        return;
      }
      g.value = !0;
      try {
        const [I, G] = await Promise.all([le.get({ kind: "asset", name: U }), le.history({ kind: "asset", name: U })]);
        if (!D()) return;
        n.value = I, w.value = G, x.value = !1, m.value = "";
        const C = I.used_by?.messages?.[0];
        y.value = C ?? "", k.value = C ? await le.preview(C, []) : void 0;
      } catch (I) {
        if (!D()) return;
        x.value = qe(I), m.value = x.value ? "" : ne(I, "This image could not be loaded.");
      } finally {
        D() && (g.value = !1);
      }
    }
    Q(() => r.name, () => {
      b.value = !1, o.value = _.value = "", S();
    }, { immediate: !0 }), Ne((U) => {
      U.kind === "asset" && U.name === r.name && S();
    });
    const N = z(() => (n.value?.used_by?.messages ?? []).map((U) => ({ name: U, title: $.find("message", U)?.title ?? U }))), te = z(() => n.value ? ja(n.value.name) : "");
    async function W() {
      try {
        await navigator.clipboard.writeText(te.value), b.value = !0;
      } catch {
        b.value = !1;
      }
    }
    async function R(U, D) {
      const I = n.value;
      if (!I || v.value !== void 0) return;
      if (U === "delete" && N.value.length) {
        A.value = {
          header: `${I.title} is in use`,
          message: `${pe(N.value.length, "message")} ${N.value.length === 1 ? "shows" : "show"} it: ${N.value.map((C) => C.title).join(", ")}. Remove it from ${N.value.length === 1 ? "that message" : "them"} first.`,
          links: N.value.map((C) => ({ label: C.title, open: () => c({ name: "resource", kind: "message", resource: C.name, section: "content" }) }))
        };
        return;
      }
      const G = {
        reset: { header: `Reset ${I.title} to the original?`, message: `The image included with ${I.origin_label} is shown again everywhere. Your image stays in History.`, accept: "Reset to original" },
        delete: { header: `Delete ${I.title}?`, message: "No message shows it. You can't undo this.", accept: "Delete image" },
        restore: { header: `Restore version ${D?.version} of ${I.title}?`, message: "Every template that shows it changes at once. The current image stays in History.", accept: "Restore this version" }
      }[U];
      if (await Re.confirm({ header: G.header, message: G.message, acceptLabel: G.accept, rejectLabel: "Cancel", ...U === "delete" ? { acceptClass: "p-button-danger" } : {} })) {
        v.value = D ? D.revision : U, _.value = o.value = "";
        try {
          if (U === "delete") {
            await le.remove({ kind: "asset", name: I.name }, I.revision), f("close");
            return;
          }
          n.value = U === "reset" ? await le.reset({ kind: "asset", name: I.name }, I.revision) : await le.restore({ kind: "asset", name: I.name }, D.revision, I.revision), o.value = U === "reset" ? `${I.title} is back to the original.` : `Version ${D.version} is shown again everywhere.`, await S();
        } catch (C) {
          const P = Te(C);
          P?.dependents?.length ? A.value = { header: `${I.title} is in use`, message: P.message, links: P.dependents.map((q) => ({ label: $.find("message", q)?.title ?? q, open: () => c({ name: "resource", kind: "message", resource: q, section: "content" }) })) } : (_.value = _e(C) === "mail_revision_conflict" ? "Someone changed this image while you were looking at it. The latest version is shown now; try again." : ne(C, "The image could not be changed."), _e(C) === "mail_revision_conflict" && S());
        } finally {
          v.value = void 0;
        }
      }
    }
    const h = z(() => k.value?.html ? ua(k.value.html, k.value.inline_assets) : "");
    return (U, D) => (l(), i(H, null, [
      s(a(Ta), {
        visible: !!e.name,
        position: "right",
        modal: !0,
        dismissable: v.value === void 0,
        "show-close-icon": !1,
        class: "mail-drawer",
        pt: { root: { style: "width: min(560px, 92vw)" } },
        "aria-label": "Image details",
        "onUpdate:visible": D[5] || (D[5] = (I) => {
          I || f("close");
        })
      }, {
        default: T(() => [
          t("div", Vn, [
            t("header", Sn, [
              t("div", Rn, [
                n.value?.state === "customized" ? (l(), B(a(Ue), {
                  key: 0,
                  severity: "info",
                  value: "Replaced",
                  class: "kx-tag-sm"
                })) : V("", !0),
                t("h2", null, u(n.value?.title ?? "Image"), 1)
              ]),
              s(a(F), {
                text: "",
                severity: "secondary",
                "aria-label": "Close",
                title: "Close",
                disabled: v.value !== void 0,
                onClick: D[0] || (D[0] = (I) => f("close"))
              }, {
                icon: T(() => [
                  s(a(L), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"])
            ]),
            g.value && !n.value ? (l(), i("p", Tn, [
              s(a(L), {
                icon: "tabler:loader-2",
                class: "spin",
                "aria-hidden": "true"
              }),
              D[9] || (D[9] = K("Loading image…", -1))
            ])) : x.value ? (l(), i("p", Un, [
              s(a(L), {
                icon: "tabler:photo-off",
                "aria-hidden": "true"
              }),
              D[10] || (D[10] = K("This image no longer exists. It was deleted while you were away.", -1))
            ])) : m.value ? (l(), i("div", An, [
              t("span", null, u(m.value), 1),
              s(a(F), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                size: "small",
                onClick: D[1] || (D[1] = (I) => S())
              })
            ])) : V("", !0),
            n.value ? (l(), i(H, { key: 3 }, [
              _.value ? (l(), i("p", Ln, [
                s(a(L), {
                  icon: "tabler:alert-triangle",
                  "aria-hidden": "true"
                }),
                K(u(_.value), 1)
              ])) : V("", !0),
              o.value ? (l(), i("p", jn, [
                s(a(L), {
                  icon: "tabler:circle-check",
                  "aria-hidden": "true"
                }),
                K(u(o.value), 1)
              ])) : V("", !0),
              t("div", In, [
                s(a(F), {
                  label: "Replace",
                  disabled: v.value !== void 0,
                  onClick: D[2] || (D[2] = (I) => O.value = !0)
                }, {
                  icon: T(() => [
                    s(a(L), {
                      icon: "tabler:replace",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                n.value.state === "customized" ? (l(), B(a(F), {
                  key: 0,
                  label: "Reset to original",
                  severity: "secondary",
                  outlined: "",
                  loading: v.value === "reset",
                  disabled: v.value !== void 0,
                  onClick: D[3] || (D[3] = (I) => R("reset"))
                }, {
                  icon: T(() => [
                    s(a(L), {
                      icon: "tabler:arrow-back-up",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0),
                n.value.state === "created" ? (l(), B(a(F), {
                  key: 1,
                  label: "Delete",
                  severity: "danger",
                  outlined: "",
                  loading: v.value === "delete",
                  disabled: v.value !== void 0,
                  onClick: D[4] || (D[4] = (I) => R("delete"))
                }, {
                  icon: T(() => [
                    s(a(L), {
                      icon: "tabler:trash",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])) : V("", !0)
              ]),
              t("div", Dn, [
                s(ca, {
                  name: n.value.name,
                  revision: n.value.revision,
                  asset: n.value.asset,
                  large: "",
                  alt: n.value.title
                }, null, 8, ["name", "revision", "asset", "alt"])
              ]),
              t("dl", Nn, [
                D[12] || (D[12] = t("dt", null, "Reference", -1)),
                t("dd", Pn, [
                  t("span", En, u(te.value), 1),
                  s(a(F), {
                    text: "",
                    severity: "secondary",
                    size: "small",
                    "aria-label": b.value ? "Reference copied" : "Copy reference",
                    title: b.value ? "Reference copied" : "Copy reference",
                    onClick: W
                  }, {
                    icon: T(() => [
                      s(a(L), {
                        icon: b.value ? "tabler:check" : "tabler:copy",
                        "aria-hidden": "true"
                      }, null, 8, ["icon"])
                    ]),
                    _: 1
                  }, 8, ["aria-label", "title"])
                ]),
                D[13] || (D[13] = t("dt", null, "File", -1)),
                t("dd", null, u(n.value.asset?.filename) + " · " + u(a(He)(n.value.asset?.size)), 1),
                n.value.asset?.width ? (l(), i(H, { key: 0 }, [
                  D[11] || (D[11] = t("dt", null, "Size", -1)),
                  t("dd", null, u(n.value.asset.width) + " × " + u(n.value.asset.height), 1)
                ], 64)) : V("", !0),
                D[14] || (D[14] = t("dt", null, "Source", -1)),
                t("dd", null, [
                  s(da, { resource: n.value }, null, 8, ["resource"])
                ])
              ]),
              t("section", zn, [
                D[15] || (D[15] = t("h3", {
                  id: "asset-shown",
                  class: "mail-label"
                }, "Shown in", -1)),
                N.value.length ? (l(), i(H, { key: 1 }, [
                  t("ul", On, [
                    (l(!0), i(H, null, re(N.value, (I) => (l(), i("li", {
                      key: I.name
                    }, [
                      t("button", {
                        type: "button",
                        class: "mail-row-link",
                        onClick: (G) => a(c)({ name: "resource", kind: "message", resource: I.name, section: "content" })
                      }, [
                        s(a(L), {
                          icon: a(be).message,
                          "aria-hidden": "true"
                        }, null, 8, ["icon"]),
                        t("span", null, u(I.title), 1)
                      ], 8, Bn)
                    ]))), 128))
                  ]),
                  h.value ? (l(), i("div", qn, [
                    t("iframe", {
                      sandbox: "",
                      srcdoc: h.value,
                      title: "How " + n.value.title + " looks in " + (a($).find("message", y.value)?.title ?? y.value)
                    }, null, 8, Hn)
                  ])) : V("", !0)
                ], 64)) : (l(), i("p", Mn, "No message shows " + u(n.value.title) + " with its sample values.", 1))
              ]),
              t("section", Fn, [
                D[16] || (D[16] = t("h3", {
                  id: "asset-history",
                  class: "mail-label"
                }, "History", -1)),
                w.value.length ? (l(), i("ol", Jn, [
                  (l(!0), i(H, null, re(w.value, (I) => (l(), i("li", {
                    key: I.revision,
                    class: "mail-history-row"
                  }, [
                    t("div", Wn, [
                      t("div", Yn, [
                        t("span", Gn, [
                          K("Version " + u(I.version) + " · " + u(a(ta)[I.action]) + " ", 1),
                          I.revision === n.value.revision ? (l(), B(a(Ue), {
                            key: 0,
                            severity: "success",
                            value: "Current",
                            class: "kx-tag-sm"
                          })) : V("", !0)
                        ]),
                        t("span", Zn, [
                          K(u(a(ye)(I.author_label, I.author)) + " · " + u(a(Pe)(I.created_at)) + " ", 1),
                          I.content.asset?.filename ? (l(), i(H, { key: 0 }, [
                            K(" · " + u(I.content.asset.filename), 1)
                          ], 64)) : V("", !0)
                        ])
                      ]),
                      I.revision !== n.value.revision ? (l(), B(a(F), {
                        key: 0,
                        label: "Restore",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        loading: v.value === I.revision,
                        disabled: v.value !== void 0,
                        onClick: (G) => R("restore", I)
                      }, {
                        icon: T(() => [
                          s(a(L), {
                            icon: "tabler:restore",
                            "aria-hidden": "true"
                          })
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled", "onClick"])) : V("", !0)
                    ])
                  ]))), 128))
                ])) : (l(), i("p", Kn, u(n.value.title) + " has not been replaced.", 1))
              ])
            ], 64)) : V("", !0)
          ])
        ]),
        _: 1
      }, 8, ["visible", "dismissable"]),
      n.value ? (l(), B(Na, {
        key: 0,
        visible: O.value,
        replace: n.value,
        onClose: D[6] || (D[6] = (I) => O.value = !1),
        onDone: D[7] || (D[7] = (I) => S())
      }, null, 8, ["visible", "replace"])) : V("", !0),
      s(Da, {
        refusal: A.value,
        onClose: D[8] || (D[8] = (I) => A.value = void 0)
      }, null, 8, ["refusal"])
    ], 64));
  }
}), Xn = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, eo = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, ao = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, lo = { class: "mail-toolbar" }, to = {
  class: "mail-count",
  role: "status"
}, so = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, io = ["onClick"], no = { class: "mail-sub" }, oo = { class: "mail-mono-block" }, ro = { class: "mail-muted" }, uo = { class: "mail-muted" }, co = /* @__PURE__ */ ae({
  __name: "AssetsPage",
  props: {
    asset: {}
  },
  setup(e) {
    const d = e, { go: r, upload: f } = ve(), $ = p(""), c = p("");
    let n;
    Q($, (A) => {
      clearTimeout(n), n = setTimeout(() => {
        c.value = A.trim();
      }, 250);
    });
    const w = fe([]), k = p(!0), y = p(!1), g = p(!1), x = p(""), m = ge();
    async function _() {
      const A = m();
      k.value = !0;
      try {
        const j = await le.assets(c.value || void 0);
        if (!A()) return;
        w.value = j.sort((S, N) => S.title.localeCompare(N.title)), x.value = "", g.value = !1, y.value = !0;
      } catch (j) {
        if (!A()) return;
        g.value = Le(j), x.value = g.value ? "" : ne(j, "Assets could not be loaded.");
      } finally {
        A() && (k.value = !1);
      }
    }
    Q(c, () => {
      _();
    }), De(_), Ne((A) => {
      A.kind === "asset" && _();
    });
    const o = z(() => w.value.reduce((A, j) => A + (j.asset?.size ?? 0), 0)), v = z(() => `${pe(w.value.length, "image")} · ${He(o.value)}`);
    function b(A) {
      const j = A.asset;
      return j ? (j.width && j.height ? `${j.width} × ${j.height} · ` : "") + He(j.size) : "";
    }
    function O(A) {
      r({ name: "library", section: "assets", asset: A.name });
    }
    return (A, j) => (l(), i(H, null, [
      s(Je, {
        title: "Assets",
        description: "Images that templates show inline. Replace one and every template that uses it changes."
      }, {
        actions: T(() => [
          s(a(F), {
            label: "Upload image",
            onClick: j[0] || (j[0] = (S) => a(f)())
          }, {
            icon: T(() => [
              s(a(L), {
                icon: "tabler:upload",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }),
      g.value ? (l(), i("p", Xn, [
        s(a(L), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        j[6] || (j[6] = K("Ask an administrator to grant you access to the mail library. ", -1))
      ])) : x.value ? (l(), i("div", eo, [
        t("span", null, u(x.value), 1),
        s(a(F), {
          label: "Retry",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: j[1] || (j[1] = (S) => _())
        })
      ])) : k.value && !y.value ? (l(), i("p", ao, [
        s(a(L), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        j[7] || (j[7] = K("Loading assets…", -1))
      ])) : y.value && !w.value.length && !c.value ? (l(), B(oa, {
        key: 3,
        icon: "tabler:photo",
        title: "No images yet",
        hint: "Upload a logo or picture to show it in email. Replace it later and every template changes.",
        cta: "Upload image",
        "cta-icon": "tabler:upload",
        onCta: j[2] || (j[2] = (S) => a(f)())
      })) : y.value ? (l(), i(H, { key: 4 }, [
        t("div", lo, [
          s(a(ia), { class: "mail-search" }, {
            default: T(() => [
              s(a(na), null, {
                default: T(() => [
                  s(a(L), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: $.value,
                "onUpdate:modelValue": j[3] || (j[3] = (S) => $.value = S),
                type: "search",
                "aria-label": "Search assets",
                placeholder: "Search assets…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          t("span", to, u(v.value), 1)
        ]),
        w.value.length ? (l(), B(a(sa), {
          key: 1,
          value: w.value,
          "data-key": "name",
          class: "mail-table",
          "row-hover": "",
          pt: { table: { "aria-label": "Assets" } },
          onRowClick: j[4] || (j[4] = (S) => O(S.data))
        }, {
          default: T(() => [
            s(a(ue), {
              header: "Image",
              "header-class": "mail-col-thumb",
              "body-class": "mail-col-thumb"
            }, {
              body: T(({ data: S }) => [
                s(ca, {
                  name: S.name,
                  revision: S.revision,
                  asset: S.asset
                }, null, 8, ["name", "revision", "asset"])
              ]),
              _: 1
            }),
            s(a(ue), {
              header: "Name",
              "header-class": "mail-col-name",
              "body-class": "mail-col-name"
            }, {
              body: T(({ data: S }) => [
                t("button", {
                  type: "button",
                  class: "mail-name",
                  onClick: xe((N) => O(S), ["stop"])
                }, u(S.title), 9, io),
                t("span", no, [
                  t("span", oo, u(S.name), 1),
                  S.asset?.filename ? (l(), i(H, { key: 0 }, [
                    K(" · " + u(S.asset.filename), 1)
                  ], 64)) : V("", !0)
                ])
              ]),
              _: 1
            }),
            s(a(ue), {
              header: "Size",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: T(({ data: S }) => [
                t("span", ro, u(b(S)), 1)
              ]),
              _: 1
            }),
            s(a(ue), {
              header: "Source",
              "header-class": "mail-col-source",
              "body-class": "mail-col-source"
            }, {
              body: T(({ data: S }) => [
                s(da, { resource: S }, null, 8, ["resource"])
              ]),
              _: 1
            }),
            s(a(ue), {
              header: "Updated",
              "header-class": "mail-col-updated",
              "body-class": "mail-col-updated"
            }, {
              body: T(({ data: S }) => [
                t("span", uo, u(S.state === "original" ? "—" : a(_a)(S.updated_at)), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["value"])) : (l(), i("p", so, "Nothing matches. Try another name."))
      ], 64)) : V("", !0),
      s(Qn, {
        name: d.asset,
        onClose: j[5] || (j[5] = (S) => a(r)({ name: "library", section: "assets" }))
      }, null, 8, ["name"])
    ], 64));
  }
}), vo = { class: "kx-modal-head-icon" }, mo = { class: "kx-modal-head-text" }, bo = { class: "kx-modal-head-title" }, fo = { class: "kx-modal-head-sub" }, po = ["id"], yo = ["disabled", "inert"], ho = {
  key: 0,
  class: "mail-field"
}, go = {
  key: 1,
  class: "mail-field"
}, ko = ["for"], $o = { class: "mail-field" }, wo = ["for"], _o = ["for"], xo = ["id"], Co = { class: "mail-field" }, Vo = ["for"], So = {
  key: 0,
  class: "kx-err inline",
  role: "alert"
}, we = "\0blank", Ro = /* @__PURE__ */ ae({
  __name: "CreateResource",
  props: {
    visible: { type: Boolean },
    intent: {}
  },
  emits: ["close"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = p("message"), w = p(""), k = p(""), y = p(""), g = p(""), x = p(!1), m = p(!1), _ = p(""), o = p(""), v = { title: de(), reference: de(), description: de(), source: de(), hint: de() }, b = ["message", "base", "part"].map((U) => ({ value: U, label: me[U] })), O = z(() => !!r.intent.from), A = z(() => [
      { value: we, label: "Blank" },
      ...$.ofKind(n.value).map((U) => ({ value: U.name, label: U.title }))
    ]), j = z(() => w.value === we || !!$.find(n.value, w.value));
    function S(U) {
      if (w.value = U, U === we) return;
      const D = $.find(n.value, U);
      D && (g.value = D.description, r.intent.from && (k.value = `${D.title} copy`, x.value = !1));
    }
    Q(() => r.visible, (U) => {
      U && (n.value = r.intent.from?.kind ?? r.intent.kind ?? "message", k.value = y.value = g.value = w.value = "", _.value = o.value = "", x.value = !1, r.intent.from ? S(r.intent.from.name) : w.value = we);
    }, { immediate: !0 }), Q(n, () => {
      r.intent.from || (w.value = we, g.value = "");
    }), Q(k, (U) => {
      x.value || (y.value = xa(U));
    });
    const N = z(() => n.value === "message" ? "Workflows, automations and agents use this to send the message. It cannot change later." : "Templates use this to include it. It cannot change later.");
    function te() {
      return o.value = "", y.value ? Ca.test(y.value) ? $.find(n.value, y.value) && (o.value = `A ${me[n.value].toLowerCase()} with this reference already exists. Choose another.`) : o.value = "Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit." : o.value = "Enter a reference.", !o.value;
    }
    async function W() {
      if (!(m.value || !k.value.trim() || !j.value || !te())) {
        m.value = !0, _.value = "";
        try {
          const U = w.value === we ? await le.create(wt(n.value, y.value, k.value.trim(), g.value.trim())) : await le.copy({
            kind: n.value,
            name: y.value,
            title: k.value.trim(),
            description: g.value.trim(),
            from: { kind: n.value, name: w.value }
          });
          await $.load(), f("close"), c({ name: "resource", kind: U.kind, resource: U.name, section: "content" });
        } catch (U) {
          _e(U) === "mail_revision_conflict" ? o.value = `A ${me[n.value].toLowerCase()} with this reference already exists. Choose another.` : _.value = ne(U, "The resource could not be created.");
        } finally {
          m.value = !1;
        }
      }
    }
    const R = { header: { class: "mail-dialog-header" }, content: { class: "mail-dialog-content" }, footer: { class: "mail-dialog-footer" } }, h = z(() => r.intent.from ? `Duplicate ${$.find(r.intent.from.kind, r.intent.from.name)?.title ?? ""}` : `New ${me[n.value].toLowerCase()}`);
    return (U, D) => (l(), B(a(Ce), {
      visible: e.visible,
      modal: "",
      draggable: !1,
      closable: !m.value,
      "close-on-escape": !m.value,
      class: "mail-dialog",
      pt: R,
      "aria-label": h.value,
      "onUpdate:visible": D[6] || (D[6] = (I) => {
        I || f("close");
      })
    }, {
      header: T(() => [
        t("span", vo, [
          s(a(L), {
            icon: a(be)[n.value],
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        t("span", mo, [
          t("span", bo, u(h.value), 1),
          t("span", fo, u(w.value === we ? "It starts empty and opens in the editor." : "It starts as a copy and is yours to change."), 1)
        ])
      ]),
      footer: T(() => [
        s(a(F), {
          label: "Cancel",
          severity: "secondary",
          outlined: "",
          disabled: m.value,
          onClick: D[5] || (D[5] = (I) => f("close"))
        }, null, 8, ["disabled"]),
        s(a(F), {
          label: "Create " + a(me)[n.value].toLowerCase(),
          type: "submit",
          form: v.hint,
          loading: m.value,
          disabled: !k.value.trim() || !j.value
        }, null, 8, ["label", "form", "loading", "disabled"])
      ]),
      default: T(() => [
        t("form", {
          id: v.hint,
          class: "mail-form",
          onSubmit: xe(W, ["prevent"])
        }, [
          t("fieldset", {
            class: "mail-fieldset",
            disabled: m.value,
            inert: m.value || void 0
          }, [
            O.value ? V("", !0) : (l(), i("div", ho, [
              D[7] || (D[7] = t("span", { class: "mail-field-label" }, "Kind", -1)),
              s(a(he), {
                modelValue: n.value,
                "onUpdate:modelValue": D[0] || (D[0] = (I) => n.value = I),
                options: a(b),
                "option-label": "label",
                "option-value": "value",
                "allow-empty": !1,
                "aria-label": "Kind"
              }, null, 8, ["modelValue", "options"])
            ])),
            O.value ? V("", !0) : (l(), i("div", go, [
              t("label", {
                class: "mail-field-label",
                for: v.source
              }, "Start from", 8, ko),
              s(a(Ae), {
                "model-value": w.value,
                "input-id": v.source,
                options: A.value,
                "option-label": "label",
                "option-value": "value",
                "append-to": "self",
                placeholder: "Choose a resource…",
                "onUpdate:modelValue": S
              }, null, 8, ["model-value", "input-id", "options"])
            ])),
            t("div", $o, [
              t("label", {
                class: "mail-field-label",
                for: v.title
              }, "Name", 8, wo),
              s(a(ce), {
                id: v.title,
                modelValue: k.value,
                "onUpdate:modelValue": D[1] || (D[1] = (I) => k.value = I),
                autofocus: "",
                required: ""
              }, null, 8, ["id", "modelValue"])
            ]),
            t("div", {
              class: oe(["mail-field", { "mail-field-invalid": o.value }])
            }, [
              t("label", {
                class: "mail-field-label",
                for: v.reference
              }, "Reference", 8, _o),
              s(a(ce), {
                id: v.reference,
                modelValue: y.value,
                "onUpdate:modelValue": D[2] || (D[2] = (I) => y.value = I),
                class: "mail-mono-input",
                invalid: !!o.value,
                "aria-describedby": v.reference + "-hint",
                onInput: D[3] || (D[3] = (I) => x.value = !0)
              }, null, 8, ["id", "modelValue", "invalid", "aria-describedby"]),
              t("small", {
                id: v.reference + "-hint",
                class: oe(o.value ? "mail-field-error" : "mail-field-hint")
              }, u(o.value || N.value), 11, xo)
            ], 2),
            t("div", Co, [
              t("label", {
                class: "mail-field-label",
                for: v.description
              }, "Description", 8, Vo),
              s(a(kl), {
                id: v.description,
                modelValue: g.value,
                "onUpdate:modelValue": D[4] || (D[4] = (I) => g.value = I),
                rows: "2",
                "auto-resize": ""
              }, null, 8, ["id", "modelValue"])
            ])
          ], 8, yo),
          _.value ? (l(), i("p", So, u(_.value), 1)) : V("", !0)
        ], 40, po)
      ]),
      _: 1
    }, 8, ["visible", "closable", "close-on-escape", "aria-label"]));
  }
}), To = { class: "mail-drawer-body" }, Uo = { class: "mail-drawer-head" }, Ao = { class: "mail-drawer-title" }, Lo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, jo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Io = {
  key: 2,
  class: "kx-notice warn mail-block",
  role: "alert"
}, Do = {
  key: 3,
  class: "kx-err mail-error",
  role: "alert"
}, No = {
  key: 0,
  class: "kx-notice error mail-failure"
}, Po = { class: "mail-failure-body" }, Eo = { key: 0 }, zo = {
  key: 1,
  class: "mail-failure-done",
  role: "status"
}, Mo = {
  key: 2,
  class: "mail-sub"
}, Oo = {
  key: 3,
  class: "mail-field-error",
  role: "alert"
}, Bo = { key: 4 }, qo = {
  key: 1,
  class: "kx-notice mail-block",
  role: "status"
}, Ho = { class: "mail-facts mail-card" }, Fo = { key: 1 }, Ko = {
  key: 0,
  class: "mail-sub"
}, Jo = {
  class: "mail-group",
  "aria-labelledby": "message-history"
}, Wo = { class: "mail-timeline" }, Yo = { class: "mail-muted" }, Go = { class: "mail-facts" }, Zo = { class: "mail-mono-block" }, Qo = /* @__PURE__ */ ae({
  __name: "MessageDrawer",
  props: {
    messageId: {}
  },
  emits: ["close", "changed"],
  setup(e, { emit: d }) {
    const r = e, f = d, { library: $, go: c } = ve(), n = fe(), w = p(!1), k = p(!1), y = p(!1), g = p(""), x = p(""), m = p(!1), _ = p(), o = p(!1), v = ge();
    async function b() {
      const R = r.messageId, h = v();
      if (!R) {
        n.value = void 0;
        return;
      }
      w.value = !0;
      try {
        const U = await Fe.get(R);
        if (!h()) return;
        n.value = U, g.value = "", k.value = y.value = !1;
      } catch (U) {
        if (!h()) return;
        n.value = void 0, k.value = qe(U), y.value = Le(U), g.value = k.value || y.value ? "" : ne(U, "This message could not be loaded.");
      } finally {
        h() && (w.value = !1);
      }
    }
    Q(() => r.messageId, (R) => {
      _.value = void 0, x.value = "", o.value = !1, R !== n.value?.message_id && (n.value = void 0), b();
    }, { immediate: !0 }), Va((R) => {
      R.message_id === r.messageId && b();
    });
    async function O() {
      const R = n.value;
      if (!(!R || m.value)) {
        m.value = !0, x.value = "";
        try {
          _.value = await Fe.resend(R.message_id), f("changed");
        } catch (h) {
          x.value = ne(h, "The message could not be sent again.");
        } finally {
          m.value = !1;
        }
      }
    }
    async function A() {
      const R = n.value;
      if (R)
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/system/mail/activity/${encodeURIComponent(R.message_id)}`), o.value = !0;
        } catch {
          o.value = !1;
        }
    }
    const j = z(() => {
      const R = n.value?.template;
      return R ? $.find("message", R)?.title ?? R : "";
    }), S = z(() => !!n.value?.template && !!$.find("message", n.value.template)), N = z(() => {
      const R = n.value;
      if (!R) return [];
      const h = [{ label: "Accepted for delivery", at: R.created_at }];
      return R.status === "queued" && R.next_attempt_at && h.push({ label: R.attempts ? `Attempt ${R.attempts} did not go through; trying again` : "Next delivery attempt", at: R.next_attempt_at }), R.sent_at ? h.push({ label: R.attempts > 1 ? `Sent after ${R.attempts} attempts` : "Sent", at: R.sent_at }) : R.status === "failed" && R.finished_at && h.push({ label: R.attempts > 1 ? `Failed after ${R.attempts} attempts` : "Failed", at: R.finished_at }), h;
    }), te = z(() => (n.value?.attachments ?? []).map((R) => R.filename || "Attachment")), W = z(() => {
      const R = n.value;
      return R ? [
        { label: "Message ID", value: R.message_id },
        { label: "Delivery service", value: R.driver_id },
        { label: "Service message ID", value: R.provider_message_id },
        { label: "Error code", value: R.last_error?.code },
        { label: "Service response", value: R.last_error?.provider_detail }
      ].filter((h) => !!h.value) : [];
    });
    return (R, h) => (l(), B(a(Ta), {
      visible: !!e.messageId,
      position: "right",
      modal: !0,
      dismissable: !m.value,
      "close-on-escape": !m.value,
      "show-close-icon": !1,
      class: "mail-drawer",
      pt: { root: { style: "width: min(560px, 92vw)" } },
      "aria-label": "Message details",
      "onUpdate:visible": h[5] || (h[5] = (U) => {
        U || f("close");
      })
    }, {
      default: T(() => [
        t("div", To, [
          t("header", Uo, [
            t("div", Ao, [
              n.value ? (l(), B(a(Ue), {
                key: 0,
                severity: a(Ra)[n.value.status],
                value: a(Sa)[n.value.status],
                class: "kx-tag-sm"
              }, null, 8, ["severity", "value"])) : V("", !0),
              t("h2", null, u(n.value?.subject ?? "Message"), 1)
            ]),
            s(a(F), {
              text: "",
              severity: "secondary",
              disabled: !n.value,
              "aria-label": o.value ? "Link copied" : "Copy link",
              title: o.value ? "Link copied" : "Copy link",
              onClick: A
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: o.value ? "tabler:check" : "tabler:link",
                  "aria-hidden": "true"
                }, null, 8, ["icon"])
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "title"]),
            s(a(F), {
              text: "",
              severity: "secondary",
              "aria-label": "Close",
              title: "Close",
              disabled: m.value,
              onClick: h[0] || (h[0] = (U) => f("close"))
            }, {
              icon: T(() => [
                s(a(L), {
                  icon: "tabler:x",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          w.value && !n.value ? (l(), i("p", Lo, [
            s(a(L), {
              icon: "tabler:loader-2",
              class: "spin",
              "aria-hidden": "true"
            }),
            h[6] || (h[6] = K("Loading message…", -1))
          ])) : k.value ? (l(), i("p", jo, [
            s(a(L), {
              icon: "tabler:mail-off",
              "aria-hidden": "true"
            }),
            h[7] || (h[7] = K("This message is no longer in Activity.", -1))
          ])) : y.value ? (l(), i("p", Io, [
            s(a(L), {
              icon: "tabler:lock",
              "aria-hidden": "true"
            }),
            h[8] || (h[8] = K("Ask an administrator to grant you access to mail delivery.", -1))
          ])) : g.value ? (l(), i("div", Do, [
            t("span", null, u(g.value), 1),
            s(a(F), {
              label: "Retry",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: h[1] || (h[1] = (U) => b())
            })
          ])) : V("", !0),
          n.value ? (l(), i(H, { key: 4 }, [
            n.value.status === "failed" ? (l(), i("div", No, [
              s(a(L), {
                icon: "tabler:alert-triangle",
                "aria-hidden": "true"
              }),
              t("div", Po, [
                h[10] || (h[10] = t("strong", null, "This message was not delivered.", -1)),
                n.value.last_error ? (l(), i("span", Eo, u(n.value.last_error.message), 1)) : V("", !0),
                _.value ? (l(), i("p", zo, [
                  h[9] || (h[9] = K(" Sent again as a new message. ", -1)),
                  t("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: h[2] || (h[2] = (U) => a(c)({ name: "activity", message: _.value.message_id }))
                  }, "Open the new message")
                ])) : n.value.can_resend ? V("", !0) : (l(), i("p", Mo, "It cannot be sent again because its content was not kept.")),
                x.value ? (l(), i("p", Oo, u(x.value), 1)) : V("", !0),
                n.value.can_resend && !_.value ? (l(), i("div", Bo, [
                  s(a(F), {
                    label: "Send again",
                    loading: m.value,
                    onClick: O
                  }, {
                    icon: T(() => [
                      s(a(L), {
                        icon: "tabler:send",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])) : V("", !0)
              ])
            ])) : n.value.status === "queued" ? (l(), i("p", qo, [
              s(a(L), {
                icon: "tabler:clock",
                "aria-hidden": "true"
              }),
              h[11] || (h[11] = K("Waiting to be delivered. ", -1))
            ])) : V("", !0),
            t("dl", Ho, [
              h[17] || (h[17] = t("dt", null, "To", -1)),
              t("dd", null, u(n.value.to.join(", ")), 1),
              n.value.cc?.length ? (l(), i(H, { key: 0 }, [
                h[12] || (h[12] = t("dt", null, "Cc", -1)),
                t("dd", null, u(n.value.cc.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.bcc?.length ? (l(), i(H, { key: 1 }, [
                h[13] || (h[13] = t("dt", null, "Bcc", -1)),
                t("dd", null, u(n.value.bcc.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.reply_to ? (l(), i(H, { key: 2 }, [
                h[14] || (h[14] = t("dt", null, "Reply-to", -1)),
                t("dd", null, u(n.value.reply_to), 1)
              ], 64)) : V("", !0),
              h[18] || (h[18] = t("dt", null, "Template", -1)),
              t("dd", null, [
                S.value ? (l(), i("button", {
                  key: 0,
                  type: "button",
                  class: "mail-text-link",
                  onClick: h[3] || (h[3] = (U) => a(c)({ name: "resource", kind: "message", resource: n.value.template, section: "content" }))
                }, u(j.value), 1)) : (l(), i("span", Fo, u(j.value || "Written directly"), 1))
              ]),
              h[19] || (h[19] = t("dt", null, "Sent by", -1)),
              t("dd", null, [
                K(u(a(ye)(n.value.sender_label, n.value.sender)), 1),
                n.value.origin ? (l(), i("span", Ko, u(a(We)(n.value.origin)), 1)) : V("", !0)
              ]),
              te.value.length ? (l(), i(H, { key: 3 }, [
                h[15] || (h[15] = t("dt", null, "Attachments", -1)),
                t("dd", null, u(te.value.join(", ")), 1)
              ], 64)) : V("", !0),
              n.value.resend_of ? (l(), i(H, { key: 4 }, [
                h[16] || (h[16] = t("dt", null, "Sent again from", -1)),
                t("dd", null, [
                  t("button", {
                    type: "button",
                    class: "mail-text-link",
                    onClick: h[4] || (h[4] = (U) => a(c)({ name: "activity", message: n.value.resend_of }))
                  }, "The original message")
                ])
              ], 64)) : V("", !0)
            ]),
            t("section", Jo, [
              h[20] || (h[20] = t("h3", {
                id: "message-history",
                class: "mail-label"
              }, "History", -1)),
              t("ol", Wo, [
                (l(!0), i(H, null, re(N.value, (U) => (l(), i("li", {
                  key: U.label
                }, [
                  t("span", null, u(U.label), 1),
                  t("span", Yo, u(a(Pe)(U.at)), 1)
                ]))), 128))
              ])
            ]),
            W.value.length ? (l(), B(Ia, {
              key: 2,
              label: "Technical details"
            }, {
              default: T(() => [
                t("dl", Go, [
                  (l(!0), i(H, null, re(W.value, (U) => (l(), i(H, {
                    key: U.label
                  }, [
                    t("dt", null, u(U.label), 1),
                    t("dd", Zo, u(U.value), 1)
                  ], 64))), 128))
                ])
              ]),
              _: 1
            })) : V("", !0)
          ], 64)) : V("", !0)
        ])
      ]),
      _: 1
    }, 8, ["visible", "dismissable", "close-on-escape"]));
  }
}), Xo = {
  key: 0,
  class: "kx-notice warn mail-block",
  role: "alert"
}, er = {
  key: 0,
  class: "kx-notice error mail-block",
  role: "status"
}, ar = { class: "mail-health-text" }, lr = { class: "mail-toolbar" }, tr = {
  key: 0,
  class: "mail-count",
  role: "status"
}, sr = {
  key: 1,
  class: "kx-err mail-error",
  role: "alert"
}, ir = {
  key: 2,
  class: "kx-loading",
  role: "status"
}, nr = {
  key: 0,
  class: "mail-muted mail-nomatch",
  role: "status"
}, or = ["onClick"], rr = { class: "mail-sub" }, ur = {
  key: 0,
  class: "mail-sub"
}, dr = { class: "mail-muted" }, cr = {
  key: 2,
  class: "mail-more"
}, vr = /* @__PURE__ */ ae({
  __name: "ActivityPage",
  props: {
    message: {},
    template: {}
  },
  setup(e) {
    const d = e, { library: r, go: f, capabilities: $ } = ve(), c = p("all"), n = p(d.template ?? null), w = p(30), k = p(""), y = p("");
    let g;
    Q(k, (X) => {
      clearTimeout(g), g = setTimeout(() => {
        y.value = X.trim();
      }, 250);
    }), Q(() => d.template, (X) => {
      X !== void 0 && (n.value = X);
    });
    const x = [
      { label: "All", value: "all" },
      { label: "Pending", value: "queued" },
      { label: "Sent", value: "sent" },
      { label: "Failed", value: "failed" }
    ], m = [{ label: "Last 24 hours", value: 1 }, { label: "Last 7 days", value: 7 }, { label: "Last 30 days", value: 30 }], _ = z(() => r.resources.value.filter((X) => X.kind === "message").sort((X, Y) => X.title.localeCompare(Y.title)).map((X) => ({ label: X.title, value: X.name }))), o = fe([]), v = p(), b = p(!0), O = p(!1), A = p(!1), j = p(!1), S = p(""), N = ge();
    function te(X) {
      return {
        status: c.value === "all" ? void 0 : c.value,
        message: n.value || void 0,
        since: Date.now() - w.value * 24 * 60 * 60 * 1e3,
        q: y.value || void 0,
        cursor: X
      };
    }
    async function W() {
      const X = N();
      b.value = !0;
      try {
        const Y = await Fe.list(te());
        if (!X()) return;
        o.value = Y.items, v.value = Y.next_cursor, h.value = Y.total, U.value = Y.failed_today ?? 0, S.value = "", j.value = !1, O.value = !0;
      } catch (Y) {
        if (!X()) return;
        j.value = Le(Y), S.value = j.value ? "" : ne(Y, "Activity could not be loaded.");
      } finally {
        X() && (b.value = !1);
      }
    }
    async function R() {
      if (!v.value || A.value) return;
      const X = N();
      A.value = !0;
      try {
        const Y = await Fe.list(te(v.value));
        if (!X()) return;
        o.value = [...o.value, ...Y.items], v.value = Y.next_cursor;
      } catch (Y) {
        X() && (S.value = ne(Y, "More activity could not be loaded."));
      } finally {
        A.value = !1;
      }
    }
    const h = p(), U = p(0);
    Q([c, n, w, y], () => {
      W();
    }), De(W), Va(() => {
      W();
    });
    const D = z(() => pe(h.value ?? o.value.length, "message")), I = z(() => U.value ? `${pe(U.value, "message")} failed today.` : ""), G = z(() => !!$.value?.administer_delivery), C = z(() => G.value ? "Every email sent from this workspace in the last 30 days." : "Email you sent in the last 30 days.");
    function P(X) {
      return X ? r.find("message", X)?.title ?? X : "—";
    }
    function q(X) {
      f({ name: "activity", message: X.message_id });
    }
    function Z() {
      f({ name: "activity", template: n.value || void 0 });
    }
    return (X, Y) => (l(), i(H, null, [
      s(Je, {
        title: "Activity",
        description: C.value
      }, null, 8, ["description"]),
      j.value ? (l(), i("p", Xo, [
        s(a(L), {
          icon: "tabler:lock",
          "aria-hidden": "true"
        }),
        Y[7] || (Y[7] = K("Ask an administrator to grant you access to mail delivery. ", -1))
      ])) : (l(), i(H, { key: 1 }, [
        I.value ? (l(), i("p", er, [
          s(a(L), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          t("span", ar, [
            t("strong", null, u(I.value), 1),
            K(" " + u(c.value === "failed" ? "" : "Open one to see why, then send it again."), 1)
          ]),
          c.value !== "failed" ? (l(), B(a(F), {
            key: 0,
            label: "Show failed",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: Y[0] || (Y[0] = (ee) => c.value = "failed")
          })) : V("", !0)
        ])) : V("", !0),
        t("div", lr, [
          s(a(he), {
            modelValue: c.value,
            "onUpdate:modelValue": Y[1] || (Y[1] = (ee) => c.value = ee),
            options: x,
            "option-label": "label",
            "option-value": "value",
            "allow-empty": !1,
            "aria-label": "Status"
          }, null, 8, ["modelValue"]),
          s(a(Ae), {
            modelValue: n.value,
            "onUpdate:modelValue": Y[2] || (Y[2] = (ee) => n.value = ee),
            options: _.value,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Message",
            class: "mail-filter",
            placeholder: "All messages",
            "show-clear": ""
          }, null, 8, ["modelValue", "options"]),
          s(a(Ae), {
            modelValue: w.value,
            "onUpdate:modelValue": Y[3] || (Y[3] = (ee) => w.value = ee),
            options: m,
            "option-label": "label",
            "option-value": "value",
            "append-to": "self",
            "aria-label": "Period",
            class: "mail-filter"
          }, null, 8, ["modelValue"]),
          s(a(ia), { class: "mail-search" }, {
            default: T(() => [
              s(a(na), null, {
                default: T(() => [
                  s(a(L), {
                    icon: "tabler:search",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }),
              s(a(ce), {
                modelValue: k.value,
                "onUpdate:modelValue": Y[4] || (Y[4] = (ee) => k.value = ee),
                type: "search",
                "aria-label": "Search subject or recipient",
                placeholder: "Search subject or recipient…"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          O.value ? (l(), i("span", tr, u(D.value), 1)) : V("", !0)
        ]),
        S.value ? (l(), i("div", sr, [
          t("span", null, u(S.value), 1),
          s(a(F), {
            label: "Retry",
            severity: "secondary",
            outlined: "",
            size: "small",
            onClick: Y[5] || (Y[5] = (ee) => W())
          })
        ])) : b.value && !O.value ? (l(), i("p", ir, [
          s(a(L), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          Y[8] || (Y[8] = K("Loading activity…", -1))
        ])) : O.value ? (l(), i(H, { key: 3 }, [
          o.value.length ? (l(), B(a(sa), {
            key: 1,
            value: o.value,
            "data-key": "message_id",
            class: "mail-table",
            "row-hover": "",
            pt: { table: { "aria-label": "Sent messages" } },
            onRowClick: Y[6] || (Y[6] = (ee) => q(ee.data))
          }, {
            default: T(() => [
              s(a(ue), {
                header: "Status",
                "header-class": "mail-col-status",
                "body-class": "mail-col-status"
              }, {
                body: T(({ data: ee }) => [
                  s(a(Ue), {
                    severity: a(Ra)[ee.status],
                    value: a(Sa)[ee.status],
                    class: "kx-tag-sm"
                  }, null, 8, ["severity", "value"])
                ]),
                _: 1
              }),
              s(a(ue), { header: "Message" }, {
                body: T(({ data: ee }) => [
                  t("button", {
                    type: "button",
                    class: "mail-name",
                    onClick: xe((je) => q(ee), ["stop"])
                  }, u(ee.subject), 9, or),
                  t("span", rr, u(a(ol)(ee.to)), 1)
                ]),
                _: 1
              }),
              s(a(ue), { header: "Template" }, {
                body: T(({ data: ee }) => [
                  K(u(P(ee.template)), 1)
                ]),
                _: 1
              }),
              s(a(ue), { header: "Sent by" }, {
                body: T(({ data: ee }) => [
                  t("span", null, u(a(ye)(ee.sender_label, ee.sender)), 1),
                  ee.origin ? (l(), i("span", ur, u(a(We)(ee.origin)), 1)) : V("", !0)
                ]),
                _: 1
              }),
              s(a(ue), {
                header: "When",
                "header-class": "mail-col-when",
                "body-class": "mail-col-when"
              }, {
                body: T(({ data: ee }) => [
                  t("span", dr, u(a(rl)(ee.created_at)), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["value"])) : (l(), i("p", nr, u(y.value ? "Nothing matches. Try another subject or recipient." : "No email was sent in this period."), 1)),
          v.value ? (l(), i("div", cr, [
            s(a(F), {
              label: "Show more",
              severity: "secondary",
              outlined: "",
              loading: A.value,
              onClick: R
            }, null, 8, ["loading"])
          ])) : V("", !0)
        ], 64)) : V("", !0)
      ], 64)),
      s(Qo, {
        "message-id": e.message,
        onClose: Z,
        onChanged: W
      }, null, 8, ["message-id"])
    ], 64));
  }
}), mr = { class: "kx-shell kx-settings-shell mail-admin" }, br = { class: "kx-main" }, fr = /* @__PURE__ */ ae({
  __name: "MailAdmin",
  props: {
    route: {}
  },
  emits: ["navigate", "dirty-change"],
  setup(e, { emit: d }) {
    const r = e, f = d, $ = p($a("")), c = z(() => r.route === void 0 ? $.value : $a(r.route)), n = p(!1);
    Q(n, (C) => f("dirty-change", C), { flush: "sync" });
    let w = !1;
    async function k() {
      if (!n.value) return !0;
      if (w) return !1;
      w = !0;
      try {
        return await Re.confirm({
          header: "Discard unsaved changes?",
          message: "Your changes to this resource are not saved yet.",
          acceptLabel: "Discard changes",
          rejectLabel: "Keep editing",
          acceptClass: "p-button-danger"
        });
      } finally {
        w = !1;
      }
    }
    function y(C, P) {
      return C.name === "resource" && P.name === "resource" && C.kind === P.kind && C.resource === P.resource;
    }
    async function g(C) {
      const P = ka(C);
      !y(c.value, C) && !await k() || (y(c.value, C) || (n.value = !1), r.route === void 0 ? $.value = C : P !== r.route && f("navigate", P));
    }
    const x = Il(), m = p(), _ = p();
    async function o() {
      try {
        m.value = await ul.capabilities();
      } catch {
        m.value = void 0;
      }
      if (m.value?.administer_delivery)
        try {
          _.value = await dl.status();
        } catch {
          _.value = void 0;
        }
    }
    o();
    const v = p(!1), b = p(!1), O = p({});
    function A(C) {
      O.value = C, v.value = !0;
    }
    Xa(Ua, {
      library: x,
      capabilities: m,
      delivery: _,
      go: (C) => {
        g(C);
      },
      create: A,
      upload: () => {
        b.value = !0;
      },
      setDirty: (C) => {
        n.value = C;
      }
    });
    const j = {
      content: (C) => C === "message" ? "Message" : C === "base" ? "Layout" : "Content",
      variables: (C) => C === "message" ? "Variables" : "Inputs",
      "used-by": () => "Used by",
      history: () => "History"
    }, S = {
      content: (C) => be[C],
      variables: () => "tabler:variable",
      "used-by": () => "tabler:link",
      history: () => "tabler:history"
    }, N = z(() => !!m.value && (m.value.administer_delivery || m.value.send)), te = z(() => [
      { heading: "Library", items: [
        { value: "messages", label: "Messages", icon: be.message },
        { value: "bases", label: "Base templates", icon: be.base },
        { value: "parts", label: "Parts", icon: be.part },
        { value: "assets", label: "Assets", icon: be.asset }
      ] },
      ...N.value ? [{ heading: "Delivery", items: [{ value: "activity", label: "Activity", icon: "tabler:activity" }] }] : []
    ]), W = { value: "all", label: "All resources", icon: "tabler:table" }, R = z(() => {
      const C = c.value;
      return C.name !== "resource" ? "" : x.find(C.kind, C.resource)?.title ?? C.resource;
    }), h = z(() => {
      const C = c.value;
      if (C.name === "resource")
        return {
          leading: { value: "all", label: "All " + la[C.kind].toLowerCase(), icon: "tabler:table" },
          groups: [{ heading: R.value, items: La(C.kind).map((P) => ({
            value: P,
            label: j[P](C.kind),
            icon: S[P](C.kind)
          })) }]
        };
    }), U = z(() => {
      const C = c.value;
      return C.name === "resource" ? C.section : C.name === "activity" ? "activity" : C.section;
    });
    function D(C) {
      const P = c.value;
      if (P.name === "resource") {
        g(C === "all" ? { name: "library", section: ea(P.kind) } : { ...P, section: C });
        return;
      }
      g(C === "activity" ? { name: "activity" } : { name: "library", section: C });
    }
    function I() {
      const C = c.value;
      if (C.name === "library" && C.section === "assets") {
        b.value = !0;
        return;
      }
      C.name === "resource" ? A({ kind: C.kind }) : C.name === "library" ? A({ kind: C.section === "bases" ? "base" : C.section === "parts" ? "part" : "message" }) : A({});
    }
    const G = p();
    return Q(() => ka(c.value), () => {
      G.value?.scrollTo({ top: 0 });
    }), (C, P) => (l(), i("main", mr, [
      s(Ll, {
        label: "Mail sections",
        title: "Mail",
        value: U.value,
        groups: h.value ? h.value.groups : te.value,
        "leading-item": h.value ? h.value.leading : W,
        "onUpdate:value": D
      }, {
        actions: T(() => [
          s(jl, {
            "create-label": "New resource",
            onCreate: I,
            onDefaults: P[0] || (P[0] = (q) => a(Re).navigate("/system/settings/mail"))
          })
        ]),
        _: 1
      }, 8, ["value", "groups", "leading-item"]),
      t("div", br, [
        t("div", {
          ref_key: "main",
          ref: G,
          class: oe(["kx-main-scroll mail-main", { "mail-main-wide": c.value.name === "resource" && c.value.section === "content" }])
        }, [
          c.value.name === "resource" ? (l(), B(cn, {
            key: c.value.kind + "/" + c.value.resource,
            kind: c.value.kind,
            name: c.value.resource,
            section: c.value.section
          }, null, 8, ["kind", "name", "section"])) : c.value.name === "activity" ? (l(), B(vr, {
            key: 1,
            message: c.value.message,
            template: c.value.template
          }, null, 8, ["message", "template"])) : c.value.section === "assets" ? (l(), B(co, {
            key: 2,
            asset: c.value.asset
          }, null, 8, ["asset"])) : (l(), B(gt, {
            key: 3,
            section: c.value.section
          }, null, 8, ["section"]))
        ], 2)
      ]),
      s(Ro, {
        visible: v.value,
        intent: O.value,
        onClose: P[1] || (P[1] = (q) => v.value = !1)
      }, null, 8, ["visible", "intent"]),
      s(Na, {
        visible: b.value,
        onClose: P[2] || (P[2] = (q) => b.value = !1)
      }, null, 8, ["visible"])
    ]));
  }
}), pr = /* @__PURE__ */ ae({
  __name: "MailAdminRoot",
  setup(e) {
    const d = el(), r = al();
    return (f, $) => (l(), B(fr, {
      route: a(d).route,
      onNavigate: $[0] || ($[0] = (c) => a(r)("navigate", { route: c })),
      onDirtyChange: $[1] || ($[1] = (c) => a(r)("dirty-change", { dirty: c }))
    }, null, 8, ["route"]));
  }
}), yr = cl(pr, { type: "object", properties: { route: { type: "string", default: "" } } });
ml(import.meta.url, yr);
//# sourceMappingURL=admin.js.map
