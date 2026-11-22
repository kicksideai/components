import { defineComponent as Ve, computed as K, openBlock as n, createBlock as Y, resolveDynamicComponent as fa, normalizeProps as Ai, guardReactiveProps as Pi, createSlots as Hl, withCtx as H, createElementVNode as s, normalizeClass as wt, createElementBlock as b, Fragment as le, renderList as de, toDisplayString as T, createCommentVNode as S, unref as d, renderSlot as at, inject as Yl, ref as W, useSlots as Oi, watch as Ie, createVNode as g, Transition as Lo, withDirectives as Vt, vShow as Rt, onMounted as Ra, onUnmounted as Xl, resolveComponent as Bo, createTextVNode as q, onBeforeUnmount as At, useId as Qt, withKeys as Ye, withModifiers as Me, normalizeStyle as Ri, watchEffect as zo, nextTick as It, useModel as Ni, mergeModels as po, provide as jo } from "vue";
import { e as zt, u as Mi, a as Fi, b as Li, c as Bi } from "./mount-DPTy0rBc.js";
import "pinia";
import { m as Ya, h as bo, s as be, i as zi, t as Ke, g as ji, j as la, k as Yt, r as ho, w as Lt, f as pt, l as Ta, n as vt, o as Ze, q as jt, v as Wo, x as Re, y as Le, z as qo, A as Wt, B as Go, C as Pa, D as nl, d as Ko, E as Na, c as Ho, F as Wi, G as el, H as Ol, I as qi, J as da, K as Gi, L as Ki, _ as Rl, M as go, N as Hi, O as Yo, P as Yi, Q as Xi, u as Ji, a as Zi, p as Qi, R as $l, S as _i, T as oa, U as yo, V as en, W as tn, X as ko, Y as an, Z as ln } from "./usePackDiscovery-T7EkGban.js";
import fe from "primevue/select";
import ae from "primevue/button";
import { Icon as ve } from "@iconify/vue";
import { api as Nl, host as Xo, on, define as nn } from "@wippy-fe/proxy";
import dt from "primevue/tag";
import rt from "primevue/toggleswitch";
import Zt from "primevue/checkbox";
import De from "primevue/inputtext";
import Oa from "primevue/textarea";
import Dt from "primevue/inputnumber";
import Jl from "primevue/selectbutton";
import sn from "primevue/message";
const Vl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function rn(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Gt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((x) => [x.x, x.x + x.width])])].sort((x, V) => x - V), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((x) => [x.y, x.y + x.height])])].sort((x, V) => x - V);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, f = o.indexOf(a.y) * r + l.indexOf(a.x), u = o.indexOf(e.y) * r + l.indexOf(e.x), c = (x) => ({ x: l[x % r], y: o[Math.floor(x / r)] }), i = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), m = [];
  function w(x) {
    m.push(x);
    let V = m.length - 1;
    for (; V; ) {
      const F = V - 1 >> 1;
      if (m[F].priority <= x.priority) break;
      m[V] = m[F], V = F;
    }
    m[V] = x;
  }
  function p() {
    const x = m[0], V = m.pop();
    if (m.length) {
      let F = 0;
      for (; F * 2 + 1 < m.length; ) {
        let I = F * 2 + 1;
        if (I + 1 < m.length && m[I + 1].priority < m[I].priority && I++, V.priority <= m[I].priority) break;
        m[F] = m[I], F = I;
      }
      m[F] = V;
    }
    return x;
  }
  const y = (x) => Math.abs(x.x - a.x) + Math.abs(x.y - a.y);
  for (const x of [0, 1]) {
    const V = u * 2 + x;
    i.set(V, 0), w({ key: V, cost: 0, priority: y(e) });
  }
  const k = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
  for (; m.length; ) {
    const x = p(), V = Math.floor(x.key / 2), F = x.key % 2;
    if (x.cost !== i.get(x.key)) continue;
    if (V === f) {
      const B = [];
      let ue = x.key;
      for (; ue !== void 0; )
        B.push(c(Math.floor(ue / 2))), ue = v.get(ue);
      return Jo(B.reverse());
    }
    const I = c(V), _ = V % r, se = Math.floor(V / r);
    for (const [B, ue] of [[_ > 0 ? V - 1 : -1, 0], [_ + 1 < r ? V + 1 : -1, 0], [se > 0 ? V - r : -1, 1], [se + 1 < o.length ? V + r : -1, 1]]) {
      if (B < 0) continue;
      const me = c(B);
      if (k.has(B) || k.set(B, !t.some((E) => Vl(me, E))), !k.get(B)) continue;
      const ke = `${Math.min(V, B)}:${Math.max(V, B)}`;
      if ($.has(ke) || $.set(ke, !t.some((E) => rn(I, me, E))), !$.get(ke)) continue;
      const ce = x.cost + Math.abs(I.x - me.x) + Math.abs(I.y - me.y) + (F === ue ? 0 : 18), ie = B * 2 + ue;
      ce >= (i.get(ie) ?? 1 / 0) || (i.set(ie, ce), v.set(ie, x.key), w({ key: ie, cost: ce, priority: ce + y(me) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((x) => Vl(e, x)), endInside: t.filter((x) => Vl(a, x)) }));
}
function Jo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ka = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ua(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const f = o.slice(r, r + a);
      l && l.length + f.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + f : f;
    }
  return [...t, l].filter(Boolean);
}
function Wa(e) {
  if (e = Jo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], f = e[l + 1], u = Math.hypot(r.x - o.x, r.y - o.y), c = Math.hypot(f.x - r.x, f.y - r.y), i = Math.min(8, u / 3, c / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / u} ${r.y + (o.y - r.y) * i / u} Q ${r.x} ${r.y} ${r.x + (f.x - r.x) * i / c} ${r.y + (f.y - r.y) * i / c}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function dn(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || Ya(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && Ya(e).length > 6, r = new bo.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const f = Ya(e), u = new Map(f.map((h, U) => [h.id, U])), c = e.states.map((h) => {
    const U = (e.transitions ?? []).filter((A) => A.from === "any" && A.to === h.id), re = ua(be(h), o ? 13 : 28), Z = ua(zi(h, e), o ? 13 : 28), $e = U.flatMap((A) => ua(Ke(A) + " works from any state")), xe = a.policy?.wip?.[h.id]?.limit, Pe = xe === void 0 ? 0 : ka(" · limit " + xe), R = Math.max(o ? 122 : 168, ...re.map((A) => ka(A) + 58), ...Z.map((A, N) => ka(A) + 32 + (N === Z.length - 1 ? Pe : 0)), ...$e.map((A) => ka(A) + 32)), ne = Math.max(80, 42 + re.length * 18 + Z.length * 16 + $e.length * 18);
    return r.setNode(h.id, { width: R + (l === "LR" ? 36 : 0), height: ne + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: R, height: ne, title: re, caption: Z, badges: U, row: u.has(h.id) ? 0 : 1 };
  }), i = new Set(c.map((h) => h.state.id)), v = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((U) => i.has(U) && i.has(h.to)).map((U) => {
    const re = `${h.id}-${U}`, Z = ua(Ke(h), o ? 12 : 28), $e = Math.max(o ? 60 : 72, ...Z.map((Pe) => ka(Pe) + 24)), xe = Math.max(24, Z.length * 16 + 10);
    return { transition: h, from: U, key: re, lines: Z, width: $e, height: xe };
  })), m = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Set(), p = new Set(v.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(c.find((U) => U.state.id === h.from).state.category)).map((h) => h.key));
  function y(h) {
    if (!w.has(h)) {
      m.add(h);
      for (const U of v.filter((re) => re.from === h))
        p.has(U.key) || (m.has(U.transition.to) ? p.add(U.key) : y(U.transition.to));
      m.delete(h), w.add(h);
    }
  }
  y(e.initial);
  for (const h of c) y(h.state.id);
  for (const h of v) if (!p.has(h.key)) {
    const U = u.get(h.from), re = u.get(h.transition.to);
    r.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: U !== void 0 && re === U + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !u.has(h.to)) {
    const U = e.states.find((re) => re.id === h.to);
    r.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(U.category) ? Math.max(1, f.length - 1) : 1 }, `any:${h.id}`);
  }
  const k = e.states.flatMap((h) => (h.regions ?? []).filter((U) => i.has(U.initial)).map((U, re) => {
    const Z = `lane:${h.id}:${re}`;
    return r.setEdge(h.id, U.initial, {}, Z), { state: h, region: U, key: Z };
  }));
  if (!c.length) return { nodes: c, edges: [], parallels: [], main: f, direction: l, width: 320, height: 160 };
  bo.layout(r);
  for (const h of c) Object.assign(h, { x: r.node(h.state.id).x, y: r.node(h.state.id).y });
  const $ = l === "TB", x = v.filter((h) => !p.has(h.key)).map((h) => r.edge({ v: h.from, w: h.transition.to, name: h.key })), V = [...c, ...x], F = Math.max(...V.map((h) => h.x + h.width / 2)), I = Math.max(...V.map((h) => h.y + h.height / 2)), _ = (h) => c.find((U) => U.state.id === h), se = v.filter((h) => p.has(h.key)).sort((h, U) => {
    const re = $ ? "y" : "x";
    return Math.abs(_(h.from)[re] - _(h.transition.to)[re]) - Math.abs(_(U.from)[re] - _(U.transition.to)[re]);
  }), B = /* @__PURE__ */ new Map(), ue = Math.max(0, ...se.map((h) => h.width));
  let me = I + 32;
  for (const [h, U] of se.entries()) {
    const re = _(U.from), Z = _(U.transition.to), $e = $ ? F + 16 + ue + 28 + h * 18 : me + U.height / 2, xe = $ ? F + 16 + ue / 2 : (re.x + Z.x) / 2;
    let Pe = $ ? re.y + re.height / 2 + 18 : $e;
    if ($) for (const R of [...B.values()].sort((ne, A) => ne.y - A.y))
      Pe + U.height / 2 + 10 > R.y - R.height / 2 - 10 && Pe - U.height / 2 - 10 < R.y + R.height / 2 + 10 && (Pe = R.y + R.height / 2 + 24 + U.height / 2);
    B.set(U.key, { x: xe, y: Pe, corridor: $e, height: U.height }), me = $e + U.height / 2 + 24;
  }
  const ke = v.map((h) => ({ ...h, ...B.get(h.key) ?? r.edge({ v: h.from, w: h.transition.to, name: h.key }) })), ce = (h, U) => ({ x: h.x - h.width / 2 - U, y: h.y - h.height / 2 - U, width: h.width + U * 2, height: h.height + U * 2 }), ie = [...c.map((h) => ce(h, 12)), ...ke.map((h) => ce(h, 10))], E = (h, U) => ({
    start: $ ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: $ ? { x: U.x, y: U.y - U.height / 2 } : { x: U.x - U.width / 2, y: U.y }
  }), te = (h, U) => $ ? { x: h.x, y: h.y + U } : { x: h.x + U, y: h.y }, z = ke.map((h) => {
    const U = c.find((ee) => ee.state.id === h.from), re = c.find((ee) => ee.state.id === h.transition.to), { start: Z, end: $e } = E(U, re), xe = p.has(h.key), Pe = te(Z, 18), R = te($e, -18), ne = (xe || !$ ? h.width : h.height) / 2 + 10, A = xe ? { x: h.x + ($ ? -ne : ne), y: h.y } : te(h, -ne), N = xe ? { x: h.x + ($ ? ne : -ne), y: h.y } : te(h, ne);
    let M;
    if (xe) {
      const { corridor: ee } = B.get(h.key), Ce = $ ? { x: ee, y: h.y } : { x: Pe.x, y: ee }, Ue = $ ? { x: ee, y: R.y } : { x: R.x, y: ee };
      M = $ ? [
        [Z, ...Gt(Pe, A, ie)],
        [N, Ce, Ue, ...Gt(Ue, R, ie), $e]
      ] : [
        [Z, ...Gt(Pe, Ce, ie), A],
        [N, ...Gt(Ue, R, ie), $e]
      ];
    } else M = [
      [Z, ...Gt(Pe, A, ie)],
      [...Gt(N, R, ie), $e]
    ];
    const j = xe ? "return" : u.get(h.transition.to) === (u.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: M.flat(), segments: M, path: M.map(Wa).join(" "), type: j, targetOffset: 0 };
  }), pe = k.map((h) => {
    const U = c.find((Pe) => Pe.state.id === h.state.id), re = c.find((Pe) => Pe.state.id === h.region.initial), { start: Z, end: $e } = E(U, re), xe = [Z, ...Gt(te(Z, 18), te($e, -18), ie), $e];
    return { state: h.state, key: h.key, points: xe, path: Wa(xe) };
  }), X = [...c.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...z.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...pe.flatMap((h) => h.points)], L = 32 - Math.min(...X.map((h) => h.x)), C = 32 - Math.min(...X.map((h) => h.y)), O = Math.max(...X.map((h) => h.x)) + L + 32, D = Math.max(...X.map((h) => h.y)) + C + 32, J = (h) => ({ x: h.x + L, y: h.y + C });
  for (const h of c) Object.assign(h, J(h));
  for (const h of z)
    Object.assign(h, J(h)), h.segments = h.segments.map((U) => U.map(J)), h.points = h.segments.flat(), h.path = h.segments.map(Wa).join(" ");
  for (const h of pe)
    h.points = h.points.map(J), h.path = Wa(h.points);
  return { nodes: c, edges: z, parallels: pe, main: f, direction: l, width: O, height: D };
}
const un = ["aria-label"], cn = {
  key: 0,
  class: "kx-settings-rail-group"
}, vn = ["aria-current", "onClick"], fn = { class: "kx-settings-rail-label" }, mn = /* @__PURE__ */ Ve({
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
    const a = e, t = K(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], f = r.indexOf(o.target);
      if (f < 0) return;
      let u;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          u = (f + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          u = (f + r.length - 1) % r.length;
          break;
        case "Home":
          u = 0;
          break;
        case "End":
          u = r.length - 1;
          break;
        default:
          return;
      }
      o.preventDefault(), r[u]?.focus();
    }
    return (o, r) => (n(), Y(fa(e.title ? ji : "div"), Ai(Pi(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Hl({
      default: H(() => [
        s("nav", {
          class: wt(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), b(le, null, de(t.value, (f, u) => (n(), b("div", {
            key: f.items[0]?.value ?? u,
            class: wt(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && u === 0 }])
          }, [
            f.heading ? (n(), b("div", cn, T(f.heading), 1)) : S("", !0),
            (n(!0), b(le, null, de(f.items, (c) => (n(), b("button", {
              key: c.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": c.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", c.value)
            }, [
              c.icon ? (n(), Y(d(ve), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: c.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : S("", !0),
              s("span", fn, T(c.label), 1)
            ], 8, vn))), 128))
          ], 2))), 128))
        ], 42, un)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: H(() => [
          at(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), Zo = Symbol("work-navigation");
function pn() {
  return Yl(Zo, () => {
  });
}
function bn(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const ia = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, wo = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Nt = {
  packPlan: (e, a) => la(`${ia(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => la(`${ia(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => la(`${ia(e)}/plan_schema`, wo(a), "Schema plan"),
  apply: (e, a, t) => la(`${ia(e)}/apply_schema`, { ...wo(a), key: t }, "Apply schema"),
  resume: (e) => la(`${ia(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => la(`${ia(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Zl = /* @__PURE__ */ Ve({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(f) {
      if (t.disabled || f.defaultPrevented) return;
      const u = f.target;
      if (u instanceof Element && u !== f.currentTarget) {
        const c = u.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (c && c !== f.currentTarget) return;
      }
      l("activate", f);
    }
    function r(f) {
      f.target !== f.currentTarget || !["Enter", " "].includes(f.key) || (f.preventDefault(), t.disabled || l("activate", f));
    }
    return (f, u) => (n(), Y(fa(e.as), {
      "data-work-action": "",
      class: "work-content-action",
      type: e.as === "button" ? "button" : void 0,
      role: e.role,
      tabindex: e.disabled ? -1 : 0,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.disabled || void 0,
      onClick: o,
      onKeydown: r
    }, {
      default: H(() => [
        at(f.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), Ql = Symbol("section row"), hn = { class: "work-definition" }, gn = {
  key: 0,
  class: "work-definition-handle"
}, yn = { class: "work-definition-lead" }, kn = ["title"], wn = {
  key: 0,
  class: "work-definition-description"
}, $n = { class: "work-definition-details" }, Vn = { class: "work-definition-code" }, xn = ["title"], Cn = { class: "work-definition-kind" }, Sn = {
  key: 0,
  class: "work-definition-kind-label"
}, Tn = { class: "work-definition-kind-value" }, In = { class: "work-definition-flags" }, Dn = { class: "work-definition-usage" }, Un = { class: "work-definition-actions" }, En = ["inert"], sl = /* @__PURE__ */ Ve({
  __name: "DefinitionRow",
  props: {
    title: {},
    code: {},
    kind: {},
    kindLabel: {},
    description: {},
    initialOpen: { type: Boolean },
    routeSection: {},
    routeId: {}
  },
  setup(e) {
    const a = e, t = W(!!a.initialOpen), l = Oi(), o = Yl(Ql, void 0);
    function r(u) {
      return !!a.routeSection && !!a.routeId && u === a.routeSection + "/" + a.routeId;
    }
    Ie(() => o?.selected.value, (u, c) => {
      r(u) ? t.value = !0 : r(c) && (t.value = !1);
    }, { immediate: !0 });
    function f() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (u, c) => (n(), b("article", hn, [
      s("header", {
        class: wt(["work-definition-head", { "work-definition-has-handle": d(l).handle }])
      }, [
        d(l).handle ? (n(), b("div", gn, [
          at(u.$slots, "handle")
        ])) : S("", !0),
        s("div", yn, [
          g(Zl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: f
          }, {
            default: H(() => [
              g(d(ve), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, T(e.title), 9, kn)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), b("p", wn, T(e.description), 1)) : S("", !0)
        ]),
        s("div", $n, [
          s("span", Vn, [
            e.code ? (n(), b("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, T(e.code), 9, xn)) : S("", !0)
          ]),
          s("span", Cn, [
            e.kind ? (n(), Y(d(dt), {
              key: 0,
              severity: "secondary"
            }, {
              default: H(() => [
                e.kindLabel ? (n(), b("span", Sn, T(e.kindLabel) + ":", 1)) : S("", !0),
                s("span", Tn, T(e.kind), 1)
              ]),
              _: 1
            })) : S("", !0),
            at(u.$slots, "status")
          ]),
          s("span", In, [
            at(u.$slots, "flags")
          ]),
          s("div", Dn, [
            at(u.$slots, "usage")
          ])
        ]),
        s("div", Un, [
          at(u.$slots, "actions")
        ])
      ], 2),
      g(Lo, {
        name: "work-panel",
        persisted: ""
      }, {
        default: H(() => [
          Vt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            at(u.$slots, "default")
          ], 8, En), [
            [Rt, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), An = { class: "work-definition-scroll" }, Pn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, On = { key: 0 }, Rn = { class: "work-definition-usage" }, rl = /* @__PURE__ */ Ve({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), b("div", An, [
      s("div", {
        class: wt(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), b("div", Pn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, T(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), b("span", On, "Details")) : S("", !0),
          s("span", Rn, T(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : S("", !0),
        at(a.$slots, "default")
      ], 2)
    ]));
  }
}), Nn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function Mn(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...Nn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Fn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const Ln = { class: "work-field-control" }, Bn = ["id"], zn = {
  key: 1,
  class: "work-stack work-tight"
}, jn = { class: "work-chips" }, Wn = {
  key: 5,
  class: "work-row"
}, qn = ["inert"], Gn = ["value"], Kn = {
  key: 1,
  class: "work-muted"
}, Hn = ["inert"], Yn = ["value"], Xn = {
  key: 1,
  class: "work-muted"
}, Jn = {
  key: 11,
  class: "work-stack work-tight"
}, Zn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Qn = { class: "work-mono" }, _n = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, Qo = /* @__PURE__ */ Ve({
  __name: "FieldControl",
  props: {
    boardId: {},
    field: {},
    modelValue: {},
    disabled: { type: Boolean },
    inputId: {},
    editorTag: {},
    linkTag: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.inputId ?? `field-${t.field.code}`), r = K(() => !!t.field.cardinality && t.field.cardinality !== "one"), f = K(() => Array.isArray(t.modelValue) ? t.modelValue : []), u = K(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Yt(t.modelValue) : String(t.modelValue)), c = K(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = K(() => t.disabled || ho(t.field)), v = W(!1), m = W(!1), w = W(!1), p = W(""), y = W(""), k = W([]), $ = Ta(), x = W([]);
    let V = 0, F;
    const I = /* @__PURE__ */ new Set();
    Ie(f, (h) => {
      x.value = F ?? h.map((U, re) => x.value[re] ?? V++), F = void 0;
    }, { immediate: !0 });
    function _(h) {
      l("update:modelValue", h);
    }
    function se(h, U) {
      const re = [...f.value];
      re[h] = U, _(re);
    }
    function B(h, U) {
      U ? I.delete(h) : I.add(h), l("validity", !I.size);
    }
    function ue(h) {
      I.delete(x.value[h]), l("validity", !I.size), F = x.value.filter((U, re) => re !== h), _(f.value.filter((U, re) => re !== h));
    }
    function me() {
      F = [...x.value, V++], _([...f.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function ke(h) {
      const U = h.detail, re = U?.principal_id ?? U?.id;
      _(re ? { kind: U.type ?? "user", id: re } : void 0);
    }
    function ce(h) {
      const U = h.detail;
      _(U?.thread_id ? { ref: ["component", U.thread_id] } : void 0);
    }
    const ie = W("");
    let E = "";
    Ie(() => t.modelValue, (h) => {
      const U = JSON.stringify(h ?? {}, null, 2);
      U !== E && (E = U, ie.value = U, p.value = "", l("validity", !0));
    }, { immediate: !0 });
    function te(h) {
      ie.value = h;
      try {
        const U = JSON.parse(h);
        if (!U || typeof U != "object" || Array.isArray(U)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in U && typeof U.type == "string")) throw new Error("The document needs a type.");
        E = JSON.stringify(U, null, 2), p.value = "", l("validity", !0), _(U);
      } catch (U) {
        p.value = U instanceof Error ? U.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function z(h) {
      if (!h) {
        l("validity", !0), _(void 0);
        return;
      }
      const U = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", U), U && _(t.field.form === "int" ? Number(h) : h);
    }
    const pe = K(() => t.field.config?.format === "date");
    function X(h) {
      _(h ? pe.value ? h : new Date(h).toISOString() : void 0);
    }
    const L = K(() => {
      if (typeof t.modelValue != "string") return "";
      if (pe.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function C(h) {
      _(h.detail?.ref);
    }
    function O(h) {
      _(h.detail?.value);
    }
    let D;
    Ie(y, () => {
      const h = $();
      if (clearTimeout(D), !y.value.trim()) {
        k.value = [];
        return;
      }
      D = setTimeout(async () => {
        try {
          const U = y.value.trim(), re = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(U) ? [(await Lt.item(t.boardId, { key: U })).item] : (await Lt.query(t.boardId, { where: { field: "title", op: "contains", value: U }, limit: 8 })).items;
          h() && (k.value = re, p.value = "");
        } catch (U) {
          h() && (p.value = pt(U, "Could not search items."));
        }
      }, 200);
    });
    function J(h) {
      _({ board: t.boardId, item: h.id }), y.value = "", k.value = [];
    }
    Ra(async () => {
      t.field.type === "principal" ? v.value = await zt("wc-principal-picker") : t.field.config?.target === "component" && (v.value = await zt("wc-component-picker"));
    });
    for (const [h, U] of [[() => t.editorTag, w], [() => t.linkTag, m]])
      Ie(h, async (re, Z, $e) => {
        let xe = !0;
        if ($e(() => {
          xe = !1;
        }), U.value = !1, re) {
          const Pe = await zt(re);
          xe && (U.value = Pe);
        }
      }, { immediate: !0 });
    return Xl(() => {
      clearTimeout(D), $();
    }), (h, U) => {
      const re = Bo("FieldControl", !0);
      return n(), b("div", Ln, [
        d(ho)(e.field) ? (n(), b("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, T(d(Yt)(e.modelValue, e.field)), 9, Bn)) : r.value ? (n(), b("div", zn, [
          s("div", jn, [
            (n(!0), b(le, null, de(f.value, (Z, $e) => (n(), Y(d(dt), {
              key: x.value[$e],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: H(() => [
                q(T(d(Yt)(Z, e.field)) + " ", 1),
                g(d(ae), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + ($e + 1),
                  onClick: (xe) => ue($e),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: H(() => [
                    g(d(ve), {
                      icon: "tabler:x",
                      "aria-hidden": "true"
                    })
                  ]),
                  _: 1
                }, 8, ["disabled", "aria-label", "onClick"])
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          (n(!0), b(le, null, de(f.value, (Z, $e) => (n(), b("div", {
            key: x.value[$e],
            class: "work-stack work-tight"
          }, [
            g(re, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": Z,
              "input-id": o.value + "-" + x.value[$e],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (xe) => se($e, xe),
              onValidity: (xe) => B(x.value[$e], xe)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          g(d(ae), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: me,
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && w.value ? (n(), Y(fa(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: O
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && m.value ? (n(), Y(fa(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: C
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), Y(d(fe), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": U[0] || (U[0] = (Z) => _(Z || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((Z) => ({ label: Z.label ?? Z.id, value: Z.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), b("label", Wn, [
          g(d(Zt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": U[1] || (U[1] = (Z) => _(Z)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          q(T(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), Y(d(Dt), {
          key: 6,
          inputId: o.value,
          "model-value": u.value === "" ? null : Number(u.value),
          disabled: i.value,
          "onUpdate:modelValue": U[2] || (U[2] = (Z) => z(Z == null ? "" : String(Z))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), Y(d(De), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": u.value,
          disabled: i.value,
          "onUpdate:modelValue": U[3] || (U[3] = (Z) => z(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), Y(d(De), {
          key: 8,
          id: o.value,
          type: pe.value ? "date" : "datetime-local",
          value: L.value,
          disabled: i.value,
          onInput: U[4] || (U[4] = (Z) => X(Z.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), b("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          v.value ? (n(), b("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: ke
          }, null, 40, Gn)) : (n(), b("span", Kn, T(d(Yt)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, qn)) : e.field.config?.target === "component" ? (n(), b("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          v.value ? (n(), b("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: c.value }),
            onChange: ce
          }, null, 40, Yn)) : (n(), b("span", Xn, "Component picker is unavailable."))
        ], 8, Hn)) : e.field.type === "item" ? (n(), b("div", Jn, [
          g(d(dt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: H(() => [
              q(T(d(Yt)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          g(d(De), {
            id: o.value,
            modelValue: y.value,
            "onUpdate:modelValue": U[5] || (U[5] = (Z) => y.value = Z),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", Zn, [
            (n(!0), b(le, null, de(k.value, (Z) => (n(), Y(Zl, {
              key: Z.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: ($e) => J(Z)
            }, {
              default: H(() => [
                s("code", Qn, T(Z.key), 1),
                s("span", null, T(d(Yt)(Z.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), Y(d(ae), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: U[6] || (U[6] = (Z) => _(void 0)),
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : S("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), Y(d(Oa), {
          key: 12,
          id: o.value,
          "model-value": ie.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!p.value,
          "onUpdate:modelValue": U[7] || (U[7] = (Z) => te(Z ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), Y(d(Oa), {
          key: 13,
          id: o.value,
          "model-value": u.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": U[8] || (U[8] = (Z) => _(Z))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), Y(d(De), {
          key: 14,
          id: o.value,
          "model-value": u.value,
          disabled: i.value,
          "onUpdate:modelValue": U[9] || (U[9] = (Z) => _(Z))
        }, null, 8, ["id", "model-value", "disabled"])),
        p.value ? (n(), b("span", _n, T(p.value), 1)) : S("", !0)
      ]);
    };
  }
}), es = { class: "work-stack work-tight work-operand-control" }, ts = { class: "work-row work-small" }, as = {
  key: 1,
  class: "work-muted work-small"
}, ls = {
  key: 2,
  class: "work-stack work-tight"
}, os = { class: "work-small" }, is = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, wa = /* @__PURE__ */ Ve({
  __name: "OperandControl",
  props: {
    boardId: {},
    field: {},
    modelValue: {},
    multiple: { type: Boolean },
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => "$actor" in vt(t.modelValue) ? "actor" : "$now" in vt(t.modelValue) ? "now" : "literal"), r = W(""), f = W("");
    Ie(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), f.value = "";
    }, { immediate: !0 });
    function u(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function c(i) {
      r.value = i;
      try {
        const v = JSON.parse(i);
        if (!Array.isArray(v)) throw new Error("Enter a JSON list.");
        f.value = "", l("validity", !0), l("update:modelValue", v);
      } catch (v) {
        f.value = v instanceof Error ? v.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, v) => (n(), b("div", es, [
      s("label", ts, [
        q(T(e.label), 1),
        g(d(fe), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": v[0] || (v[0] = (m) => u(m)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), Y(d(De), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: d(vt)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: v[1] || (v[1] = (m) => l("update:modelValue", { $now: m.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), b("span", as, "The signed-in actor’s id")) : e.multiple ? (n(), b("div", ls, [
        s("label", os, [
          v[5] || (v[5] = q("Values as JSON (operands may appear in the list)", -1)),
          g(d(Oa), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: v[2] || (v[2] = (m) => c(m.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        f.value ? (n(), b("p", is, T(f.value), 1)) : S("", !0)
      ])) : (n(), Y(Qo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": v[3] || (v[3] = (m) => l("update:modelValue", m)),
        onValidity: v[4] || (v[4] = (m) => l("validity", m))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), ns = ["disabled"], ss = { class: "work-small work-mono" }, rs = { class: "work-row work-small" }, ds = { class: "work-row work-wrap" }, us = { key: 3 }, cs = { class: "work-row work-wrap" }, vs = { class: "work-row" }, fs = { class: "work-row" }, ms = { class: "work-row" }, ps = {
  key: 3,
  class: "work-row work-wrap"
}, bs = { class: "work-row work-wrap" }, hs = /* @__PURE__ */ Ve({
  __name: "FilterNode",
  props: {
    boardId: {},
    schema: {},
    modelValue: {},
    path: {},
    depth: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.path ?? "where"), r = K(() => t.depth ?? 1), f = K(() => ["and", "or", "not", "history", "match", "rel", "children"].find((ie) => ie in t.modelValue) ?? "field"), u = K(() => Mn(t.schema)), c = K(() => u.value.find((ie) => ie.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = K(() => vt(t.modelValue.history)), v = K(() => u.value.find((ie) => ie.code === i.value.field) ?? { code: "history", form: "text" }), m = K(() => Array.isArray(t.modelValue[f.value]) ? t.modelValue[f.value] : []), w = {
      eq: "Equals",
      neq: "Does not equal",
      in: "Is one of",
      nin: "Is none of",
      lt: "Less than",
      lte: "At most",
      gt: "Greater than",
      gte: "At least",
      between: "Between",
      has: "Includes",
      is_null: "Is empty",
      contains: "Contains",
      starts_with: "Starts with",
      member_of: "Is a member of"
    }, p = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, y = () => ({ field: "category", op: "eq", value: "unstarted" }), k = W(/* @__PURE__ */ new Set());
    function $(ie, E) {
      E ? k.value.delete(ie) : k.value.add(ie), l("validity", k.value.size === 0);
    }
    Ie(f, () => {
      k.value.clear(), l("validity", !0);
    });
    function x(ie) {
      const E = /* @__PURE__ */ new Set();
      for (const te of k.value) {
        const z = Number(te);
        !Number.isNaN(z) && z !== ie && E.add(String(z > ie ? z - 1 : z));
      }
      k.value = E, l("validity", E.size === 0), F({ [f.value]: m.value.filter((te, z) => z !== ie) });
    }
    function V(ie) {
      l("update:modelValue", ie);
    }
    function F(ie) {
      V({ ...t.modelValue, ...ie });
    }
    function I(ie) {
      V(ie === "field" ? y() : ie === "and" || ie === "or" ? { [ie]: [y()] } : ie === "not" ? { not: y() } : ie === "history" ? { history: { field: "state", changed: !0 } } : ie === "match" ? { match: "" } : ie === "children" ? { children: !0, q: "some", where: y() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: y() });
    }
    function _(ie, E) {
      F({ [f.value]: m.value.map((te, z) => z === ie ? E : te) });
    }
    function se(ie, E) {
      const te = { ...i.value };
      E === void 0 ? (delete te[ie], $(ie, !0)) : te[ie] = E, F({ history: te });
    }
    function B(ie) {
      k.value.clear(), l("validity", !0);
      const E = { ...i.value };
      delete E.was, delete E.changed, delete E.from, delete E.to, E[ie] = ie === "changed" ? !0 : "", F({ history: E });
    }
    const ue = { code: "actor", form: "text" }, me = { code: "at", form: "time" }, ke = K(() => Array.isArray(i.value.during) ? i.value.during : []);
    function ce(ie, E) {
      const te = [...ke.value];
      te[ie] = E, se("during", te);
    }
    return (ie, E) => {
      const te = Bo("FilterNode", !0);
      return n(), b("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", ss, T(o.value), 1),
        s("label", rs, [
          E[21] || (E[21] = q("Condition", -1)),
          g(d(fe), {
            "aria-label": o.value + " condition",
            "model-value": f.value,
            "onUpdate:modelValue": E[0] || (E[0] = (z) => I(z)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(p).map(([z, pe]) => ({ label: pe, value: z, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(z) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        f.value === "and" || f.value === "or" ? (n(), b(le, { key: 0 }, [
          (n(!0), b(le, null, de(m.value, (z, pe) => (n(), b("div", {
            key: pe,
            class: "work-stack work-tight"
          }, [
            g(te, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": z,
              path: o.value + "." + f.value + "[" + pe + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (X) => _(pe, X),
              onValidity: (X) => $(String(pe), X)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            g(d(ae), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (X) => x(pe),
              outlined: ""
            }, {
              icon: H(() => [
                g(d(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          g(d(ae), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: E[1] || (E[1] = (z) => F({ [f.value]: [...m.value, y()] })),
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : f.value === "not" ? (n(), Y(te, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": d(vt)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": E[2] || (E[2] = (z) => F({ not: z })),
          onValidity: E[3] || (E[3] = (z) => $("nested", z))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : f.value === "field" ? (n(), b(le, { key: 2 }, [
          s("div", ds, [
            s("label", null, [
              E[22] || (E[22] = q("Field", -1)),
              g(d(fe), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": E[4] || (E[4] = (z) => F({ field: z, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(u.value ?? []).map((z) => ({ label: d(Ze)(z), value: z.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              E[23] || (E[23] = q("Comparison", -1)),
              g(d(fe), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": E[5] || (E[5] = (z) => F({ op: z, value: z === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: d(Fn)(c.value).map((z) => ({ value: z, label: w[z] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          g(wa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : c.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": E[6] || (E[6] = (z) => F({ value: z })),
            onValidity: E[7] || (E[7] = (z) => $("value", z))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : f.value === "match" ? (n(), b("label", us, [
          E[24] || (E[24] = q("Search", -1)),
          g(d(De), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: E[8] || (E[8] = (z) => F({ match: z.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : f.value === "history" ? (n(), b(le, { key: 4 }, [
          s("div", cs, [
            s("label", null, [
              E[25] || (E[25] = q("Field", -1)),
              g(d(fe), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": E[9] || (E[9] = (z) => se("field", z)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(u.value ?? []).map((z) => ({ label: d(Ze)(z), value: z.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              E[26] || (E[26] = q("History", -1)),
              g(d(fe), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": E[10] || (E[10] = (z) => B(z)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), b(le, { key: 0 }, de(["from", "to"], (z) => s("div", { key: z }, [
            s("label", vs, [
              g(d(Zt), {
                "model-value": z in i.value,
                "aria-label": "Constrain " + z,
                "onUpdate:modelValue": (pe) => se(z, pe ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              q(T(z), 1)
            ]),
            z in i.value ? (n(), Y(wa, {
              key: 0,
              "board-id": e.boardId,
              field: v.value,
              "model-value": i.value[z],
              label: o.value + " history " + z,
              "onUpdate:modelValue": (pe) => se(z, pe),
              onValidity: (pe) => $(z, pe)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : S("", !0)
          ])), 64)) : (n(), Y(wa, {
            key: 1,
            "board-id": e.boardId,
            field: v.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": E[11] || (E[11] = (z) => se("was", z)),
            onValidity: E[12] || (E[12] = (z) => $("was", z))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", fs, [
            g(d(Zt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": E[13] || (E[13] = (z) => se("by", z ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            E[27] || (E[27] = q("By actor", -1))
          ]),
          "by" in i.value ? (n(), Y(wa, {
            key: 2,
            "board-id": e.boardId,
            field: ue,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": E[14] || (E[14] = (z) => se("by", z))
          }, null, 8, ["board-id", "model-value", "label"])) : S("", !0),
          s("label", ms, [
            g(d(Zt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": E[15] || (E[15] = (z) => se("during", z ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            E[28] || (E[28] = q("During", -1))
          ]),
          "during" in i.value ? (n(), b("div", ps, [
            (n(), b(le, null, de(["start", "end"], (z, pe) => g(wa, {
              key: z,
              "board-id": e.boardId,
              field: me,
              "model-value": ke.value[pe],
              label: o.value + " during " + z,
              "onUpdate:modelValue": (X) => ce(pe, X)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : S("", !0)
        ], 64)) : (n(), b(le, { key: 5 }, [
          s("div", bs, [
            f.value === "rel" ? (n(), b(le, { key: 0 }, [
              s("label", null, [
                E[29] || (E[29] = q("Relation", -1)),
                g(d(fe), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": E[16] || (E[16] = (z) => F({ rel: z })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((z) => ({ label: z.outward ?? z.id, value: z.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                E[30] || (E[30] = q("Direction", -1)),
                g(d(fe), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": E[17] || (E[17] = (z) => F({ dir: z })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : S("", !0),
            s("label", null, [
              E[31] || (E[31] = q("Quantifier", -1)),
              g(d(fe), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": E[18] || (E[18] = (z) => F({ q: z })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          g(te, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": d(vt)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": E[19] || (E[19] = (z) => F({ where: z })),
            onValidity: E[20] || (E[20] = (z) => $("nested", z))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, ns);
    };
  }
}), gs = { class: "work-stack work-tight" }, ys = { class: "work-row work-small" }, _l = /* @__PURE__ */ Ve({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), r = /* @__PURE__ */ new Set();
    function f(c, i) {
      i ? r.delete(c) : r.add(c), l("validity", !r.size);
    }
    function u(c) {
      l("update:modelValue", c ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), c || (r.clear(), l("validity", !0));
    }
    return At(() => l("validity", !0)), (c, i) => (n(), b("section", gs, [
      s("label", ys, [
        g(d(rt), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": u
        }, null, 8, ["model-value", "aria-label"]),
        q(T(e.label), 1)
      ]),
      e.modelValue != null ? (n(), Y(hs, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": d(vt)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (v) => l("update:modelValue", v)),
        onValidity: i[1] || (i[1] = (v) => f("structured", v))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : S("", !0),
      e.modelValue != null ? (n(), Y(jt, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (v) => l("update:modelValue", v)),
        onValidity: i[3] || (i[3] = (v) => f("raw", v))
      }, null, 8, ["label", "model-value"])) : S("", !0)
    ]));
  }
}), ks = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ws = ["aria-label"], $s = { class: "work-field-label" }, Vs = {
  key: 0,
  class: "work-chips"
}, xs = ["kinds"], Cs = {
  key: 2,
  class: "work-muted work-small"
}, eo = /* @__PURE__ */ Ve({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(!1), r = W(0), f = K(() => t.modelValue ?? []), { principalLabel: u, rememberPrincipal: c, nameError: i } = Wo(() => t.boardId ?? "", () => f.value);
    Ra(async () => {
      o.value = await zt("wc-principal-picker");
    });
    function v(m) {
      const w = m.detail, p = w?.principal_id ?? w?.id;
      if (!p) return;
      const y = { kind: w.type ?? "user", id: p };
      w.label && c(y, w.label), f.value.some((k) => k.id === p && k.kind === y.kind) || l("update:modelValue", [...f.value, y]), r.value++;
    }
    return (m, w) => (n(), b(le, null, [
      d(i) ? (n(), b("p", ks, T(d(i)), 1)) : S("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", $s, T(e.label), 1),
        f.value.length ? (n(), b("div", Vs, [
          (n(!0), b(le, null, de(f.value, (p, y) => (n(), Y(d(dt), {
            key: p.kind + p.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: H(() => [
              q(T(d(u)(p)), 1),
              g(d(ae), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + d(u)(p),
                onClick: (k) => l("update:modelValue", f.value.filter(($, x) => x !== y))
              }, {
                default: H(() => [
                  g(d(ve), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        o.value ? (n(), b("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: v
        }, null, 40, xs)) : (n(), b("p", Cs, "People and group picker is unavailable."))
      ], 8, ws)
    ], 64));
  }
}), Ss = { class: "work-stack work-tight" }, _o = /* @__PURE__ */ Ve({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => (t.modelValue ?? []).flatMap((f) => "user" in f ? [{ kind: "user", id: f.user }] : "group" in f ? [{ kind: "group", id: f.group }] : []));
    function r(f) {
      const u = [...(t.modelValue ?? []).filter((c) => "field" in c || "service" in c), ...f.map((c) => c.kind === "group" ? { group: c.id } : { user: c.id })];
      l("update:modelValue", u.length ? u : void 0);
    }
    return (f, u) => (n(), b("div", Ss, [
      g(eo, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      g(jt, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": u[0] || (u[0] = (c) => l("update:modelValue", c)),
        onValidity: u[1] || (u[1] = (c) => l("validity", c))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), Ts = ["disabled"], Is = { class: "work-chips" }, Ds = {
  key: 1,
  class: "work-muted work-small"
}, $t = /* @__PURE__ */ Ve({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(""), r = K(() => t.options.map((c) => typeof c == "string" ? { value: c } : c)), f = K(() => r.value.filter((c) => (c.label ?? Re(c.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function u(c) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(c) ? i.filter((v) => v !== c) : [...i, c]);
    }
    return (c, i) => (n(), b("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, T(e.label), 1),
      e.options.length > 10 ? (n(), Y(d(De), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (v) => o.value = v),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : S("", !0),
      s("div", Is, [
        g(d(Jl), {
          "model-value": e.modelValue ?? [],
          options: f.value.map((v) => ({ value: v.value, label: v.label ?? d(Re)(v.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (v) => l("update:modelValue", v ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), b(le, null, de(e.modelValue?.filter((v) => !r.value.some((m) => m.value === v)) ?? [], (v) => (n(), Y(d(ae), {
          severity: "secondary",
          text: "",
          size: "small",
          key: v,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + v,
          onClick: (m) => u(v)
        }, {
          default: H(() => [
            q(T(d(Re)(v)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? S("", !0) : (n(), b("span", Ds, "No choices declared."))
    ], 8, Ts));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function Us(e, a, t) {
  return (a = Os(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function Et() {
  return Et = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, Et.apply(null, arguments);
}
function $o(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function Ct(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? $o(Object(t), !0).forEach(function(l) {
      Us(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : $o(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function Es(e, a) {
  if (e == null) return {};
  var t, l, o = As(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function As(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function Ps(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function Os(e) {
  var a = Ps(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Ml(e) {
  "@babel/helpers - typeof";
  return Ml = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Ml(e);
}
var Rs = "1.15.7";
function Ut(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Pt = Ut(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Ma = Ut(/Edge/i), Vo = Ut(/firefox/i), Ia = Ut(/safari/i) && !Ut(/chrome/i) && !Ut(/android/i), to = Ut(/iP(ad|od|hone)/i), ei = Ut(/chrome/i) && Ut(/android/i), ti = {
  capture: !1,
  passive: !1
};
function Te(e, a, t) {
  e.addEventListener(a, t, !Pt && ti);
}
function Se(e, a, t) {
  e.removeEventListener(a, t, !Pt && ti);
}
function tl(e, a) {
  if (a) {
    if (a[0] === ">" && (a = a.substring(1)), e)
      try {
        if (e.matches)
          return e.matches(a);
        if (e.msMatchesSelector)
          return e.msMatchesSelector(a);
        if (e.webkitMatchesSelector)
          return e.webkitMatchesSelector(a);
      } catch {
        return !1;
      }
    return !1;
  }
}
function ai(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function kt(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && tl(e, a) : tl(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = ai(e));
  }
  return null;
}
var xo = /\s+/g;
function ut(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(xo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(xo, " ");
    }
}
function he(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function va(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = he(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function li(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function xt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function qe(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, f, u, c, i, v, m;
    if (e !== window && e.parentNode && e !== xt() ? (r = e.getBoundingClientRect(), f = r.top, u = r.left, c = r.bottom, i = r.right, v = r.height, m = r.width) : (f = 0, u = 0, c = window.innerHeight, i = window.innerWidth, v = window.innerHeight, m = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Pt))
      do
        if (o && o.getBoundingClientRect && (he(o, "transform") !== "none" || t && he(o, "position") !== "static")) {
          var w = o.getBoundingClientRect();
          f -= w.top + parseInt(he(o, "border-top-width")), u -= w.left + parseInt(he(o, "border-left-width")), c = f + r.height, i = u + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var p = va(o || e), y = p && p.a, k = p && p.d;
      p && (f /= k, u /= y, m /= y, v /= k, c = f + v, i = u + m);
    }
    return {
      top: f,
      left: u,
      bottom: c,
      right: i,
      width: m,
      height: v
    };
  }
}
function Co(e, a, t) {
  for (var l = Bt(e, !0), o = qe(e)[a]; l; ) {
    var r = qe(l)[t], f = void 0;
    if (f = o >= r, !f) return l;
    if (l === xt()) break;
    l = Bt(l, !1);
  }
  return !1;
}
function ma(e, a, t, l) {
  for (var o = 0, r = 0, f = e.children; r < f.length; ) {
    if (f[r].style.display !== "none" && f[r] !== ge.ghost && (l || f[r] !== ge.dragged) && kt(f[r], t.draggable, e, !1)) {
      if (o === a)
        return f[r];
      o++;
    }
    r++;
  }
  return null;
}
function ao(e, a) {
  for (var t = e.lastElementChild; t && (t === ge.ghost || he(t, "display") === "none" || a && !tl(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function mt(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== ge.clone && (!a || tl(e, a)) && t++;
  return t;
}
function So(e) {
  var a = 0, t = 0, l = xt();
  if (e)
    do {
      var o = va(e), r = o.a, f = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * f;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function Ns(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Bt(e, a) {
  if (!e || !e.getBoundingClientRect) return xt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = he(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return xt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return xt();
}
function Ms(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function xl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var Da;
function oi(e, a) {
  return function() {
    if (!Da) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), Da = setTimeout(function() {
        Da = void 0;
      }, a);
    }
  };
}
function Fs() {
  clearTimeout(Da), Da = void 0;
}
function ii(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function ni(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function si(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, f, u, c;
    if (!(!kt(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = qe(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((f = l.top) !== null && f !== void 0 ? f : 1 / 0, i.top), l.right = Math.max((u = l.right) !== null && u !== void 0 ? u : -1 / 0, i.right), l.bottom = Math.max((c = l.bottom) !== null && c !== void 0 ? c : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var st = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function Ls() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(he(o, "display") === "none" || o === ge.ghost)) {
            e.push({
              target: o,
              rect: qe(o)
            });
            var r = Ct({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var f = va(o, !0);
              f && (r.top -= f.f, r.left -= f.e);
            }
            o.fromRect = r;
          }
        });
      }
    },
    addAnimationState: function(l) {
      e.push(l);
    },
    removeAnimationState: function(l) {
      e.splice(Ns(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var r = !1, f = 0;
      e.forEach(function(u) {
        var c = 0, i = u.target, v = i.fromRect, m = qe(i), w = i.prevFromRect, p = i.prevToRect, y = u.rect, k = va(i, !0);
        k && (m.top -= k.f, m.left -= k.e), i.toRect = m, i.thisAnimationDuration && xl(w, m) && !xl(v, m) && // Make sure animatingRect is on line between toRect & fromRect
        (y.top - m.top) / (y.left - m.left) === (v.top - m.top) / (v.left - m.left) && (c = zs(y, w, p, o.options)), xl(m, v) || (i.prevFromRect = v, i.prevToRect = m, c || (c = o.options.animation), o.animate(i, y, m, c)), c && (r = !0, f = Math.max(f, c), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, c), i.thisAnimationDuration = c);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, f) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, f) {
      if (f) {
        he(l, "transition", ""), he(l, "transform", "");
        var u = va(this.el), c = u && u.a, i = u && u.d, v = (o.left - r.left) / (c || 1), m = (o.top - r.top) / (i || 1);
        l.animatingX = !!v, l.animatingY = !!m, he(l, "transform", "translate3d(" + v + "px," + m + "px,0)"), this.forRepaintDummy = Bs(l), he(l, "transition", "transform " + f + "ms" + (this.options.easing ? " " + this.options.easing : "")), he(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          he(l, "transition", ""), he(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, f);
      }
    }
  };
}
function Bs(e) {
  return e.offsetWidth;
}
function zs(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var na = [], Cl = {
  initializeByDefault: !0
}, Fa = {
  mount: function(a) {
    for (var t in Cl)
      Cl.hasOwnProperty(t) && !(t in a) && (a[t] = Cl[t]);
    na.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), na.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    na.forEach(function(f) {
      t[f.pluginName] && (t[f.pluginName][r] && t[f.pluginName][r](Ct({
        sortable: t
      }, l)), t.options[f.pluginName] && t[f.pluginName][a] && t[f.pluginName][a](Ct({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    na.forEach(function(u) {
      var c = u.pluginName;
      if (!(!a.options[c] && !u.initializeByDefault)) {
        var i = new u(a, t, a.options);
        i.sortable = a, i.options = a.options, a[c] = i, Et(l, i.defaults);
      }
    });
    for (var r in a.options)
      if (a.options.hasOwnProperty(r)) {
        var f = this.modifyOption(a, r, a.options[r]);
        typeof f < "u" && (a.options[r] = f);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return na.forEach(function(o) {
      typeof o.eventProperties == "function" && Et(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return na.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function js(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, f = e.toEl, u = e.fromEl, c = e.oldIndex, i = e.newIndex, v = e.oldDraggableIndex, m = e.newDraggableIndex, w = e.originalEvent, p = e.putSortable, y = e.extraEventProperties;
  if (a = a || t && t[st], !!a) {
    var k, $ = a.options, x = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Pt && !Ma ? k = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (k = document.createEvent("Event"), k.initEvent(l, !0, !0)), k.to = f || t, k.from = u || t, k.item = o || t, k.clone = r, k.oldIndex = c, k.newIndex = i, k.oldDraggableIndex = v, k.newDraggableIndex = m, k.originalEvent = w, k.pullMode = p ? p.lastPutMode : void 0;
    var V = Ct(Ct({}, y), Fa.getEventProperties(l, a));
    for (var F in V)
      k[F] = V[F];
    t && t.dispatchEvent(k), $[x] && $[x].call(a, k);
  }
}
var Ws = ["evt"], nt = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = Es(l, Ws);
  Fa.pluginEvent.bind(ge)(a, t, Ct({
    dragEl: oe,
    parentEl: ze,
    ghostEl: we,
    rootEl: Ne,
    nextEl: Xt,
    lastDownEl: Xa,
    cloneEl: Fe,
    cloneHidden: Ft,
    dragStarted: $a,
    putSortable: Je,
    activeSortable: ge.active,
    originalEvent: o,
    oldIndex: ca,
    oldDraggableIndex: Ua,
    newIndex: ct,
    newDraggableIndex: Mt,
    hideGhostForTarget: ci,
    unhideGhostForTarget: vi,
    cloneNowHidden: function() {
      Ft = !0;
    },
    cloneNowShown: function() {
      Ft = !1;
    },
    dispatchSortableEvent: function(u) {
      tt({
        sortable: t,
        name: u,
        originalEvent: o
      });
    }
  }, r));
};
function tt(e) {
  js(Ct({
    putSortable: Je,
    cloneEl: Fe,
    targetEl: oe,
    rootEl: Ne,
    oldIndex: ca,
    oldDraggableIndex: Ua,
    newIndex: ct,
    newDraggableIndex: Mt
  }, e));
}
var oe, ze, we, Ne, Xt, Xa, Fe, Ft, ca, ct, Ua, Mt, qa, Je, ra = !1, al = !1, ll = [], Kt, yt, Sl, Tl, To, Io, $a, sa, Ea, Aa = !1, Ga = !1, Ja, _e, Il = [], Fl = !1, ol = [], dl = typeof document < "u", Ka = to, Do = Ma || Pt ? "cssFloat" : "float", qs = dl && !ei && !to && "draggable" in document.createElement("div"), ri = (function() {
  if (dl) {
    if (Pt)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), di = function(a, t) {
  var l = he(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = ma(a, 0, t), f = ma(a, 1, t), u = r && he(r), c = f && he(f), i = u && parseInt(u.marginLeft) + parseInt(u.marginRight) + qe(r).width, v = c && parseInt(c.marginLeft) + parseInt(c.marginRight) + qe(f).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && u.float && u.float !== "none") {
    var m = u.float === "left" ? "left" : "right";
    return f && (c.clear === "both" || c.clear === m) ? "vertical" : "horizontal";
  }
  return r && (u.display === "block" || u.display === "flex" || u.display === "table" || u.display === "grid" || i >= o && l[Do] === "none" || f && l[Do] === "none" && i + v > o) ? "vertical" : "horizontal";
}, Gs = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, f = l ? a.width : a.height, u = l ? t.left : t.top, c = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === u || r === c || o + f / 2 === u + i / 2;
}, Ks = function(a, t) {
  var l;
  return ll.some(function(o) {
    var r = o[st].options.emptyInsertThreshold;
    if (!(!r || ao(o))) {
      var f = qe(o), u = a >= f.left - r && a <= f.right + r, c = t >= f.top - r && t <= f.bottom + r;
      if (u && c)
        return l = o;
    }
  }), l;
}, ui = function(a) {
  function t(r, f) {
    return function(u, c, i, v) {
      var m = u.options.group.name && c.options.group.name && u.options.group.name === c.options.group.name;
      if (r == null && (f || m))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (f && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(u, c, i, v), f)(u, c, i, v);
      var w = (f ? u : c).options.group.name;
      return r === !0 || typeof r == "string" && r === w || r.join && r.indexOf(w) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Ml(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, ci = function() {
  !ri && we && he(we, "display", "none");
}, vi = function() {
  !ri && we && he(we, "display", "");
};
dl && !ei && document.addEventListener("click", function(e) {
  if (al)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), al = !1, !1;
}, !0);
var Ht = function(a) {
  if (oe) {
    a = a.touches ? a.touches[0] : a;
    var t = Ks(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[st]._onDragOver(l);
    }
  }
}, Hs = function(a) {
  oe && oe.parentNode[st]._isOutsideThisEl(a.target);
};
function ge(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = Et({}, a), e[st] = this;
  var t = {
    group: null,
    sort: !0,
    disabled: !1,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(e.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: !1,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: !0,
    direction: function() {
      return di(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(f, u) {
      f.setData("Text", u.textContent);
    },
    dropBubble: !1,
    dragoverBubble: !1,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: !1,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: !1,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: !1,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    // Disabled on Safari: #1571; Enabled on Safari IOS: #2244
    supportPointer: ge.supportPointer !== !1 && "PointerEvent" in window && (!Ia || to),
    emptyInsertThreshold: 5
  };
  Fa.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ui(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : qs, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Te(e, "pointerdown", this._onTapStart) : (Te(e, "mousedown", this._onTapStart), Te(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Te(e, "dragover", this), Te(e, "dragenter", this)), ll.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), Et(this, Ls());
}
ge.prototype = /** @lends Sortable.prototype */
{
  constructor: ge,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (sa = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, oe) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, f = a.type, u = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, c = (u || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || c, v = o.filter;
      if (tr(l), !oe && !(/mousedown|pointerdown/.test(f) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && Ia && c && c.tagName.toUpperCase() === "SELECT") && (c = kt(c, o.draggable, l, !1), !(c && c.animated) && Xa !== c)) {
        if (ca = mt(c), Ua = mt(c, o.draggable), typeof v == "function") {
          if (v.call(this, a, c, this)) {
            tt({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: c,
              toEl: l,
              fromEl: l
            }), nt("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (v && (v = v.split(",").some(function(m) {
          if (m = kt(i, m.trim(), l, !1), m)
            return tt({
              sortable: t,
              rootEl: m,
              name: "filter",
              targetEl: c,
              fromEl: l,
              toEl: l
            }), nt("filter", t, {
              evt: a
            }), !0;
        }), v)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !kt(i, o.handle, l, !1) || this._prepareDragStart(a, u, c);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, f = o.options, u = r.ownerDocument, c;
    if (l && !oe && l.parentNode === r) {
      var i = qe(l);
      if (Ne = r, oe = l, ze = oe.parentNode, Xt = oe.nextSibling, Xa = l, qa = f.group, ge.dragged = oe, Kt = {
        target: oe,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, To = Kt.clientX - i.left, Io = Kt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, oe.style["will-change"] = "all", c = function() {
        if (nt("delayEnded", o, {
          evt: a
        }), ge.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !Vo && o.nativeDraggable && (oe.draggable = !0), o._triggerDragStart(a, t), tt({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), ut(oe, f.chosenClass, !0);
      }, f.ignore.split(",").forEach(function(v) {
        li(oe, v.trim(), Dl);
      }), Te(u, "dragover", Ht), Te(u, "mousemove", Ht), Te(u, "touchmove", Ht), f.supportPointer ? (Te(u, "pointerup", o._onDrop), !this.nativeDraggable && Te(u, "pointercancel", o._onDrop)) : (Te(u, "mouseup", o._onDrop), Te(u, "touchend", o._onDrop), Te(u, "touchcancel", o._onDrop)), Vo && this.nativeDraggable && (this.options.touchStartThreshold = 4, oe.draggable = !0), nt("delayStart", this, {
        evt: a
      }), f.delay && (!f.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Ma || Pt))) {
        if (ge.eventCanceled) {
          this._onDrop();
          return;
        }
        f.supportPointer ? (Te(u, "pointerup", o._disableDelayedDrag), Te(u, "pointercancel", o._disableDelayedDrag)) : (Te(u, "mouseup", o._disableDelayedDrag), Te(u, "touchend", o._disableDelayedDrag), Te(u, "touchcancel", o._disableDelayedDrag)), Te(u, "mousemove", o._delayedDragTouchMoveHandler), Te(u, "touchmove", o._delayedDragTouchMoveHandler), f.supportPointer && Te(u, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(c, f.delay);
      } else
        c();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    oe && Dl(oe), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Se(a, "mouseup", this._disableDelayedDrag), Se(a, "touchend", this._disableDelayedDrag), Se(a, "touchcancel", this._disableDelayedDrag), Se(a, "pointerup", this._disableDelayedDrag), Se(a, "pointercancel", this._disableDelayedDrag), Se(a, "mousemove", this._delayedDragTouchMoveHandler), Se(a, "touchmove", this._delayedDragTouchMoveHandler), Se(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Te(document, "pointermove", this._onTouchMove) : t ? Te(document, "touchmove", this._onTouchMove) : Te(document, "mousemove", this._onTouchMove) : (Te(oe, "dragend", this), Te(Ne, "dragstart", this._onDragStart));
    try {
      document.selection ? Za(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (ra = !1, Ne && oe) {
      nt("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Te(document, "dragover", Hs);
      var l = this.options;
      !a && ut(oe, l.dragClass, !1), ut(oe, l.ghostClass, !0), ge.active = this, a && this._appendGhost(), tt({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (yt) {
      this._lastX = yt.clientX, this._lastY = yt.clientY, ci();
      for (var a = document.elementFromPoint(yt.clientX, yt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(yt.clientX, yt.clientY), a !== t); )
        t = a;
      if (oe.parentNode[st]._isOutsideThisEl(a), t)
        do {
          if (t[st]) {
            var l = void 0;
            if (l = t[st]._onDragOver({
              clientX: yt.clientX,
              clientY: yt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = ai(t));
      vi();
    }
  },
  _onTouchMove: function(a) {
    if (Kt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, f = we && va(we, !0), u = we && f && f.a, c = we && f && f.d, i = Ka && _e && So(_e), v = (r.clientX - Kt.clientX + o.x) / (u || 1) + (i ? i[0] - Il[0] : 0) / (u || 1), m = (r.clientY - Kt.clientY + o.y) / (c || 1) + (i ? i[1] - Il[1] : 0) / (c || 1);
      if (!ge.active && !ra) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (we) {
        f ? (f.e += v - (Sl || 0), f.f += m - (Tl || 0)) : f = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: v,
          f: m
        };
        var w = "matrix(".concat(f.a, ",").concat(f.b, ",").concat(f.c, ",").concat(f.d, ",").concat(f.e, ",").concat(f.f, ")");
        he(we, "webkitTransform", w), he(we, "mozTransform", w), he(we, "msTransform", w), he(we, "transform", w), Sl = v, Tl = m, yt = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!we) {
      var a = this.options.fallbackOnBody ? document.body : Ne, t = qe(oe, !0, Ka, !0, a), l = this.options;
      if (Ka) {
        for (_e = a; he(_e, "position") === "static" && he(_e, "transform") === "none" && _e !== document; )
          _e = _e.parentNode;
        _e !== document.body && _e !== document.documentElement ? (_e === document && (_e = xt()), t.top += _e.scrollTop, t.left += _e.scrollLeft) : _e = xt(), Il = So(_e);
      }
      we = oe.cloneNode(!0), ut(we, l.ghostClass, !1), ut(we, l.fallbackClass, !0), ut(we, l.dragClass, !0), he(we, "transition", ""), he(we, "transform", ""), he(we, "box-sizing", "border-box"), he(we, "margin", 0), he(we, "top", t.top), he(we, "left", t.left), he(we, "width", t.width), he(we, "height", t.height), he(we, "opacity", "0.8"), he(we, "position", Ka ? "absolute" : "fixed"), he(we, "zIndex", "100000"), he(we, "pointerEvents", "none"), ge.ghost = we, a.appendChild(we), he(we, "transform-origin", To / parseInt(we.style.width) * 100 + "% " + Io / parseInt(we.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (nt("dragStart", this, {
      evt: a
    }), ge.eventCanceled) {
      this._onDrop();
      return;
    }
    nt("setupClone", this), ge.eventCanceled || (Fe = ni(oe), Fe.removeAttribute("id"), Fe.draggable = !1, Fe.style["will-change"] = "", this._hideClone(), ut(Fe, this.options.chosenClass, !1), ge.clone = Fe), l.cloneId = Za(function() {
      nt("clone", l), !ge.eventCanceled && (l.options.removeCloneOnHide || Ne.insertBefore(Fe, oe), l._hideClone(), tt({
        sortable: l,
        name: "clone"
      }));
    }), !t && ut(oe, r.dragClass, !0), t ? (al = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Se(document, "mouseup", l._onDrop), Se(document, "touchend", l._onDrop), Se(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, oe)), Te(document, "drop", l), he(oe, "transform", "translateZ(0)")), ra = !0, l._dragStartId = Za(l._dragStarted.bind(l, t, a)), Te(document, "selectstart", l), $a = !0, window.getSelection().removeAllRanges(), Ia && he(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, f, u = this.options, c = u.group, i = ge.active, v = qa === c, m = u.sort, w = Je || i, p, y = this, k = !1;
    if (Fl) return;
    function $(L, C) {
      nt(L, y, Ct({
        evt: a,
        isOwner: v,
        axis: p ? "vertical" : "horizontal",
        revert: f,
        dragRect: o,
        targetRect: r,
        canSort: m,
        fromSortable: w,
        target: l,
        completed: V,
        onMove: function(D, J) {
          return Ha(Ne, t, oe, o, D, qe(D), a, J);
        },
        changed: F
      }, C));
    }
    function x() {
      $("dragOverAnimationCapture"), y.captureAnimationState(), y !== w && w.captureAnimationState();
    }
    function V(L) {
      return $("dragOverCompleted", {
        insertion: L
      }), L && (v ? i._hideClone() : i._showClone(y), y !== w && (ut(oe, Je ? Je.options.ghostClass : i.options.ghostClass, !1), ut(oe, u.ghostClass, !0)), Je !== y && y !== ge.active ? Je = y : y === ge.active && Je && (Je = null), w === y && (y._ignoreWhileAnimating = l), y.animateAll(function() {
        $("dragOverAnimationComplete"), y._ignoreWhileAnimating = null;
      }), y !== w && (w.animateAll(), w._ignoreWhileAnimating = null)), (l === oe && !oe.animated || l === t && !l.animated) && (sa = null), !u.dragoverBubble && !a.rootEl && l !== document && (oe.parentNode[st]._isOutsideThisEl(a.target), !L && Ht(a)), !u.dragoverBubble && a.stopPropagation && a.stopPropagation(), k = !0;
    }
    function F() {
      ct = mt(oe), Mt = mt(oe, u.draggable), tt({
        sortable: y,
        name: "change",
        toEl: t,
        newIndex: ct,
        newDraggableIndex: Mt,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = kt(l, u.draggable, t, !0), $("dragOver"), ge.eventCanceled) return k;
    if (oe.contains(a.target) || l.animated && l.animatingX && l.animatingY || y._ignoreWhileAnimating === l)
      return V(!1);
    if (al = !1, i && !u.disabled && (v ? m || (f = ze !== Ne) : Je === this || (this.lastPutMode = qa.checkPull(this, i, oe, a)) && c.checkPut(this, i, oe, a))) {
      if (p = this._getDirection(a, l) === "vertical", o = qe(oe), $("dragOverValid"), ge.eventCanceled) return k;
      if (f)
        return ze = Ne, x(), this._hideClone(), $("revert"), ge.eventCanceled || (Xt ? Ne.insertBefore(oe, Xt) : Ne.appendChild(oe)), V(!0);
      var I = ao(t, u.draggable);
      if (!I || Zs(a, p, this) && !I.animated) {
        if (I === oe)
          return V(!1);
        if (I && t === a.target && (l = I), l && (r = qe(l)), Ha(Ne, t, oe, o, l, r, a, !!l) !== !1)
          return x(), I && I.nextSibling ? t.insertBefore(oe, I.nextSibling) : t.appendChild(oe), ze = t, F(), V(!0);
      } else if (I && Js(a, p, this)) {
        var _ = ma(t, 0, u, !0);
        if (_ === oe)
          return V(!1);
        if (l = _, r = qe(l), Ha(Ne, t, oe, o, l, r, a, !1) !== !1)
          return x(), t.insertBefore(oe, _), ze = t, F(), V(!0);
      } else if (l.parentNode === t) {
        r = qe(l);
        var se = 0, B, ue = oe.parentNode !== t, me = !Gs(oe.animated && oe.toRect || o, l.animated && l.toRect || r, p), ke = p ? "top" : "left", ce = Co(l, "top", "top") || Co(oe, "top", "top"), ie = ce ? ce.scrollTop : void 0;
        sa !== l && (B = r[ke], Aa = !1, Ga = !me && u.invertSwap || ue), se = Qs(a, l, r, p, me ? 1 : u.swapThreshold, u.invertedSwapThreshold == null ? u.swapThreshold : u.invertedSwapThreshold, Ga, sa === l);
        var E;
        if (se !== 0) {
          var te = mt(oe);
          do
            te -= se, E = ze.children[te];
          while (E && (he(E, "display") === "none" || E === we));
        }
        if (se === 0 || E === l)
          return V(!1);
        sa = l, Ea = se;
        var z = l.nextElementSibling, pe = !1;
        pe = se === 1;
        var X = Ha(Ne, t, oe, o, l, r, a, pe);
        if (X !== !1)
          return (X === 1 || X === -1) && (pe = X === 1), Fl = !0, setTimeout(Xs, 30), x(), pe && !z ? t.appendChild(oe) : l.parentNode.insertBefore(oe, pe ? z : l), ce && ii(ce, 0, ie - ce.scrollTop), ze = oe.parentNode, B !== void 0 && !Ga && (Ja = Math.abs(B - qe(l)[ke])), F(), V(!0);
      }
      if (t.contains(oe))
        return V(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Se(document, "mousemove", this._onTouchMove), Se(document, "touchmove", this._onTouchMove), Se(document, "pointermove", this._onTouchMove), Se(document, "dragover", Ht), Se(document, "mousemove", Ht), Se(document, "touchmove", Ht);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Se(a, "mouseup", this._onDrop), Se(a, "touchend", this._onDrop), Se(a, "pointerup", this._onDrop), Se(a, "pointercancel", this._onDrop), Se(a, "touchcancel", this._onDrop), Se(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (ct = mt(oe), Mt = mt(oe, l.draggable), nt("drop", this, {
      evt: a
    }), ze = oe && oe.parentNode, ct = mt(oe), Mt = mt(oe, l.draggable), ge.eventCanceled) {
      this._nulling();
      return;
    }
    ra = !1, Ga = !1, Aa = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ll(this.cloneId), Ll(this._dragStartId), this.nativeDraggable && (Se(document, "drop", this), Se(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), Ia && he(document.body, "user-select", ""), he(oe, "transform", ""), a && ($a && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), we && we.parentNode && we.parentNode.removeChild(we), (Ne === ze || Je && Je.lastPutMode !== "clone") && Fe && Fe.parentNode && Fe.parentNode.removeChild(Fe), oe && (this.nativeDraggable && Se(oe, "dragend", this), Dl(oe), oe.style["will-change"] = "", $a && !ra && ut(oe, Je ? Je.options.ghostClass : this.options.ghostClass, !1), ut(oe, this.options.chosenClass, !1), tt({
      sortable: this,
      name: "unchoose",
      toEl: ze,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Ne !== ze ? (ct >= 0 && (tt({
      rootEl: ze,
      name: "add",
      toEl: ze,
      fromEl: Ne,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "remove",
      toEl: ze,
      originalEvent: a
    }), tt({
      rootEl: ze,
      name: "sort",
      toEl: ze,
      fromEl: Ne,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "sort",
      toEl: ze,
      originalEvent: a
    })), Je && Je.save()) : ct !== ca && ct >= 0 && (tt({
      sortable: this,
      name: "update",
      toEl: ze,
      originalEvent: a
    }), tt({
      sortable: this,
      name: "sort",
      toEl: ze,
      originalEvent: a
    })), ge.active && ((ct == null || ct === -1) && (ct = ca, Mt = Ua), tt({
      sortable: this,
      name: "end",
      toEl: ze,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    nt("nulling", this), Ne = oe = ze = we = Xt = Fe = Xa = Ft = Kt = yt = $a = ct = Mt = ca = Ua = sa = Ea = Je = qa = ge.dragged = ge.ghost = ge.clone = ge.active = null;
    var a = this.el;
    ol.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), ol.length = Sl = Tl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        oe && (this._onDragOver(a), Ys(a));
        break;
      case "selectstart":
        a.preventDefault();
        break;
    }
  },
  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function() {
    for (var a = [], t, l = this.el.children, o = 0, r = l.length, f = this.options; o < r; o++)
      t = l[o], kt(t, f.draggable, this.el, !1) && a.push(t.getAttribute(f.dataIdAttr) || er(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(r, f) {
      var u = o.children[f];
      kt(u, this.options.draggable, o, !1) && (l[r] = u);
    }, this), t && this.captureAnimationState(), a.forEach(function(r) {
      l[r] && (o.removeChild(l[r]), o.appendChild(l[r]));
    }), t && this.animateAll();
  },
  /**
   * Save the current sorting
   */
  save: function() {
    var a = this.options.store;
    a && a.set && a.set(this);
  },
  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function(a, t) {
    return kt(a, t || this.options.draggable, this.el, !1);
  },
  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function(a, t) {
    var l = this.options;
    if (t === void 0)
      return l[a];
    var o = Fa.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ui(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    nt("destroy", this);
    var a = this.el;
    a[st] = null, Se(a, "mousedown", this._onTapStart), Se(a, "touchstart", this._onTapStart), Se(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Se(a, "dragover", this), Se(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), ll.splice(ll.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Ft) {
      if (nt("hideClone", this), ge.eventCanceled) return;
      he(Fe, "display", "none"), this.options.removeCloneOnHide && Fe.parentNode && Fe.parentNode.removeChild(Fe), Ft = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Ft) {
      if (nt("showClone", this), ge.eventCanceled) return;
      oe.parentNode == Ne && !this.options.group.revertClone ? Ne.insertBefore(Fe, oe) : Xt ? Ne.insertBefore(Fe, Xt) : Ne.appendChild(Fe), this.options.group.revertClone && this.animate(oe, Fe), he(Fe, "display", ""), Ft = !1;
    }
  }
};
function Ys(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function Ha(e, a, t, l, o, r, f, u) {
  var c, i = e[st], v = i.options.onMove, m;
  return window.CustomEvent && !Pt && !Ma ? c = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (c = document.createEvent("Event"), c.initEvent("move", !0, !0)), c.to = a, c.from = e, c.dragged = t, c.draggedRect = l, c.related = o || a, c.relatedRect = r || qe(a), c.willInsertAfter = u, c.originalEvent = f, e.dispatchEvent(c), v && (m = v.call(i, c, f)), m;
}
function Dl(e) {
  e.draggable = !1;
}
function Xs() {
  Fl = !1;
}
function Js(e, a, t) {
  var l = qe(ma(t.el, 0, t.options, !0)), o = si(t.el, t.options, we), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function Zs(e, a, t) {
  var l = qe(ao(t.el, t.options.draggable)), o = si(t.el, t.options, we), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function Qs(e, a, t, l, o, r, f, u) {
  var c = l ? e.clientY : e.clientX, i = l ? t.height : t.width, v = l ? t.top : t.left, m = l ? t.bottom : t.right, w = !1;
  if (!f) {
    if (u && Ja < i * o) {
      if (!Aa && (Ea === 1 ? c > v + i * r / 2 : c < m - i * r / 2) && (Aa = !0), Aa)
        w = !0;
      else if (Ea === 1 ? c < v + Ja : c > m - Ja)
        return -Ea;
    } else if (c > v + i * (1 - o) / 2 && c < m - i * (1 - o) / 2)
      return _s(a);
  }
  return w = w || f, w && (c < v + i * r / 2 || c > m - i * r / 2) ? c > v + i / 2 ? 1 : -1 : 0;
}
function _s(e) {
  return mt(oe) < mt(e) ? 1 : -1;
}
function er(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function tr(e) {
  ol.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && ol.push(l);
  }
}
function Za(e) {
  return setTimeout(e, 0);
}
function Ll(e) {
  return clearTimeout(e);
}
dl && Te(document, "touchmove", function(e) {
  (ge.active || ra) && e.cancelable && e.preventDefault();
});
ge.utils = {
  on: Te,
  off: Se,
  css: he,
  find: li,
  is: function(a, t) {
    return !!kt(a, t, a, !1);
  },
  extend: Ms,
  throttle: oi,
  closest: kt,
  toggleClass: ut,
  clone: ni,
  index: mt,
  nextTick: Za,
  cancelNextTick: Ll,
  detectDirection: di,
  getChild: ma,
  expando: st
};
ge.get = function(e) {
  return e[st];
};
ge.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && (ge.utils = Ct(Ct({}, ge.utils), l.utils)), Fa.mount(l);
  });
};
ge.create = function(e, a) {
  return new ge(e, a);
};
ge.version = Rs;
var We = [], Va, Bl, zl = !1, Ul, El, il, xa;
function ar() {
  function e() {
    this.defaults = {
      scroll: !0,
      forceAutoScrollFallback: !1,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: !0
    };
    for (var a in this)
      a.charAt(0) === "_" && typeof this[a] == "function" && (this[a] = this[a].bind(this));
  }
  return e.prototype = {
    dragStarted: function(t) {
      var l = t.originalEvent;
      this.sortable.nativeDraggable ? Te(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Te(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Te(document, "touchmove", this._handleFallbackAutoScroll) : Te(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Se(document, "dragover", this._handleAutoScroll) : (Se(document, "pointermove", this._handleFallbackAutoScroll), Se(document, "touchmove", this._handleFallbackAutoScroll), Se(document, "mousemove", this._handleFallbackAutoScroll)), Uo(), Qa(), Fs();
    },
    nulling: function() {
      il = Bl = Va = zl = xa = Ul = El = null, We.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, f = (t.touches ? t.touches[0] : t).clientY, u = document.elementFromPoint(r, f);
      if (il = t, l || this.options.forceAutoScrollFallback || Ma || Pt || Ia) {
        Al(t, this.options, u, l);
        var c = Bt(u, !0);
        zl && (!xa || r !== Ul || f !== El) && (xa && Uo(), xa = setInterval(function() {
          var i = Bt(document.elementFromPoint(r, f), !0);
          i !== c && (c = i, Qa()), Al(t, o.options, i, l);
        }, 10), Ul = r, El = f);
      } else {
        if (!this.options.bubbleScroll || Bt(u, !0) === xt()) {
          Qa();
          return;
        }
        Al(t, this.options, Bt(u, !1), !1);
      }
    }
  }, Et(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Qa() {
  We.forEach(function(e) {
    clearInterval(e.pid);
  }), We = [];
}
function Uo() {
  clearInterval(xa);
}
var Al = oi(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, f = a.scrollSensitivity, u = a.scrollSpeed, c = xt(), i = !1, v;
    Bl !== t && (Bl = t, Qa(), Va = a.scroll, v = a.scrollFn, Va === !0 && (Va = Bt(t, !0)));
    var m = 0, w = Va;
    do {
      var p = w, y = qe(p), k = y.top, $ = y.bottom, x = y.left, V = y.right, F = y.width, I = y.height, _ = void 0, se = void 0, B = p.scrollWidth, ue = p.scrollHeight, me = he(p), ke = p.scrollLeft, ce = p.scrollTop;
      p === c ? (_ = F < B && (me.overflowX === "auto" || me.overflowX === "scroll" || me.overflowX === "visible"), se = I < ue && (me.overflowY === "auto" || me.overflowY === "scroll" || me.overflowY === "visible")) : (_ = F < B && (me.overflowX === "auto" || me.overflowX === "scroll"), se = I < ue && (me.overflowY === "auto" || me.overflowY === "scroll"));
      var ie = _ && (Math.abs(V - o) <= f && ke + F < B) - (Math.abs(x - o) <= f && !!ke), E = se && (Math.abs($ - r) <= f && ce + I < ue) - (Math.abs(k - r) <= f && !!ce);
      if (!We[m])
        for (var te = 0; te <= m; te++)
          We[te] || (We[te] = {});
      (We[m].vx != ie || We[m].vy != E || We[m].el !== p) && (We[m].el = p, We[m].vx = ie, We[m].vy = E, clearInterval(We[m].pid), (ie != 0 || E != 0) && (i = !0, We[m].pid = setInterval(function() {
        l && this.layer === 0 && ge.active._onTouchMove(il);
        var z = We[this.layer].vy ? We[this.layer].vy * u : 0, pe = We[this.layer].vx ? We[this.layer].vx * u : 0;
        typeof v == "function" && v.call(ge.dragged.parentNode[st], pe, z, e, il, We[this.layer].el) !== "continue" || ii(We[this.layer].el, pe, z);
      }.bind({
        layer: m
      }), 24))), m++;
    } while (a.bubbleScroll && w !== c && (w = Bt(w, !1)));
    zl = i;
  }
}, 30), fi = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, f = a.dispatchSortableEvent, u = a.hideGhostForTarget, c = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    u();
    var v = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, m = document.elementFromPoint(v.clientX, v.clientY);
    c(), i && !i.el.contains(m) && (f("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function lo() {
}
lo.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = ma(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: fi
};
Et(lo, {
  pluginName: "revertOnSpill"
});
function oo() {
}
oo.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: fi
};
Et(oo, {
  pluginName: "removeOnSpill"
});
ge.mount(new ar());
ge.mount(oo, lo);
function lr(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function mi(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return At(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new ge(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(r) {
          const f = r.oldDraggableIndex, u = r.newDraggableIndex;
          lr(r, ".work-reorder-entry"), f !== void 0 && u !== void 0 && f !== u && e(f, u);
        }
      }));
    },
    unmounted: t
  };
}
const or = { class: "work-stack work-tight work-option-builder" }, ir = { class: "work-stack work-tight" }, nr = { class: "work-stack work-tight work-small" }, sr = { class: "work-stack work-tight work-small" }, rr = { class: "work-stack work-tight" }, dr = { class: "work-stack work-tight work-small" }, ur = { class: "work-row" }, cr = { class: "work-stack work-tight work-small" }, vr = { class: "work-row" }, fr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mr = { class: "work-add-option" }, pr = {
  key: 0,
  class: "work-muted work-small"
}, br = /* @__PURE__ */ Ve({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + Qt(), r = K(() => t.field.options ?? []), f = K(() => r.value.every((m, w) => !!m.id && r.value.findIndex((p) => p.id === m.id) === w));
    Ie(f, (m) => l("validity", m, o), { immediate: !0 }), At(() => l("validity", !0, o));
    function u(m, w) {
      Go(r.value, m, w - m), r.value.forEach((p, y) => p.order = y);
    }
    const c = mi(u), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function v() {
      let m = r.value.length + 1;
      for (; r.value.some((w) => w.id === `option_${m}`); ) m++;
      (t.field.options ??= []).push({ id: `option_${m}`, label: "New option", order: r.value.length });
    }
    return (m, w) => (n(), b("section", or, [
      w[4] || (w[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      Vt((n(), b("div", ir, [
        (n(!0), b(le, null, de(r.value, (p, y) => (n(), b("div", {
          key: y,
          class: "work-option-row work-reorder-entry"
        }, [
          g(d(ae), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ye(Me((k) => u(y, y - 1), ["prevent"]), ["up"]),
              Ye(Me((k) => u(y, y + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: H(() => [
              g(d(ve), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", nr, [
            w[0] || (w[0] = q("Label", -1)),
            g(d(De), {
              modelValue: p.label,
              "onUpdate:modelValue": (k) => p.label = k,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          g(Le, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: H(() => [
              s("label", sr, [
                w[1] || (w[1] = q("Integration identifier", -1)),
                g(d(De), {
                  modelValue: p.id,
                  "onUpdate:modelValue": (k) => p.id = k,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", rr, [
            s("label", dr, [
              w[2] || (w[2] = q("Color", -1)),
              s("span", ur, [
                s("span", {
                  class: wt(["work-color-swatch", "work-swatch-" + (p.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                g(d(fe), {
                  modelValue: p.color,
                  "onUpdate:modelValue": (k) => p.color = k,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((k) => ({ label: k, value: k, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", cr, [
              w[3] || (w[3] = q("Category", -1)),
              g(d(fe), {
                "model-value": p.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...d(qo)].map((k) => ({ label: d(Wt)(k), value: k })),
                "onUpdate:modelValue": (k) => p.category = k || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", vr, [
            g(d(ae), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: y === 0,
              onClick: (k) => u(y, y - 1),
              text: ""
            }, {
              default: H(() => [
                g(d(ve), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(d(ae), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: y === r.value.length - 1,
              onClick: (k) => u(y, y + 1),
              text: ""
            }, {
              default: H(() => [
                g(d(ve), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            g(d(ae), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (k) => r.value.splice(y, 1)
            }, {
              icon: H(() => [
                g(d(ve), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        f.value ? S("", !0) : (n(), b("p", fr, "Each choice needs a unique integration identifier.")),
        s("div", mr, [
          g(d(ae), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: v,
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [d(c)]
      ]),
      r.value.length ? S("", !0) : (n(), b("p", pr, "Add the choices people can select for this field."))
    ]));
  }
}), hr = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, gr = { class: "work-form-actions work-wrap" }, yr = { class: "work-stack work-tight" }, kr = {
  key: 0,
  class: "work-settings-card work-muted"
}, wr = { class: "work-muted work-small" }, $r = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, Vr = { class: "work-settings-grid work-field-properties" }, xr = { class: "work-stack work-tight" }, Cr = { class: "work-stack work-tight" }, Sr = { class: "work-stack work-tight" }, Tr = {
  key: 1,
  class: "work-stack work-tight"
}, Ir = {
  key: 4,
  class: "work-stack work-tight"
}, Dr = {
  key: 5,
  class: "work-stack work-tight"
}, Ur = { class: "work-stack work-tight" }, Er = { class: "work-stack work-tight" }, Ar = { class: "work-stack work-tight" }, Pr = { class: "work-stack work-tight" }, Or = { class: "work-stack" }, Rr = { class: "work-stack work-tight" }, Nr = { class: "work-stack work-tight" }, Mr = { class: "work-stack work-tight work-field-history" }, Fr = { class: "work-settings-list" }, Lr = { class: "work-settings-row" }, Br = { class: "work-settings-row" }, zr = { class: "work-stack" }, jr = /* @__PURE__ */ Ve({
  __name: "FieldsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    installedTypes: {},
    itemType: {},
    createForItemType: { type: Boolean }
  },
  emits: ["validity", "update:itemType", "created", "cancel-creation"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.fields ?? []), r = W("text"), f = W([]), u = K(() => (t.draft.item_types ?? []).map((C) => ({ value: C.id, label: C.title || Re(C.id) }))), c = K(() => t.draft.item_types?.find((C) => C.id === t.itemType)), i = K(() => o.value.map((C, O) => ({ field: C, index: O })).filter(({ field: C }) => !c.value || c.value.fields.includes(C.code))), v = W(""), m = W({}), w = mi((C, O) => {
      const D = i.value[C]?.index, J = i.value[O]?.index;
      D !== void 0 && J !== void 0 && te(D, J - D);
    });
    function p(C) {
      return (t.draft.item_types ?? []).filter((O) => O.fields.includes(C)).map((O) => O.title || Re(O.id));
    }
    async function y(C) {
      if (!v.value) {
        v.value = C.code;
        try {
          const O = await t.guardRemoval?.("fields", C.code);
          m.value[C.code] = O ?? "", O || Na(t.draft, "fields", C.code);
        } finally {
          v.value = "";
        }
      }
    }
    const k = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([C, O]) => ({ value: C, label: O })), $ = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], x = ["int", "dec", "quantity"], V = K(() => new Map(t.installedTypes?.map((C) => [C.id, C]))), F = K(() => [...k, ...(t.installedTypes ?? []).map((C) => ({ value: C.id, label: C.title }))]), I = {};
    function _(C) {
      return C.type && C.type !== "value" ? C.type : C.form ?? "text";
    }
    function se(C) {
      return C.type ? V.value.get(C.type) : void 0;
    }
    function B(C) {
      const O = se(C)?.config_schema;
      return O && Ho(O).length ? O : void 0;
    }
    function ue(C) {
      const O = se(C);
      return !!O?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(O?.form ?? C.form ?? "") || !!C.config;
    }
    function me(C) {
      const O = se(C), D = O?.form ?? C.form ?? "text";
      return $.filter(({ value: J }) => J === "none" || (!O?.indexes || O.indexes.includes(J)) && D !== "record" && (J !== "number" || x.includes(D) || C.type === "option"));
    }
    function ke(C) {
      C.index && !me(C).some((O) => O.value === C.index) && delete C.index;
    }
    function ce(C, O) {
      const D = V.value.get(O);
      if (D) {
        if (D.id === C.type) return;
        C.type = D.id, C.form = D.form, delete C.options, delete C.config, ke(C);
        return;
      }
      se(C) && delete C.config;
      const J = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      J[O] ? (C.type = O, C.form = J[O]) : (delete C.type, C.form = O), O !== "option" ? delete C.options : C.options ??= [], O === "rich_text" && (C.config = { format: "json" }), ke(C);
    }
    function ie(C, O) {
      C.form = O, ke(C);
    }
    function E(C, O) {
      const D = { ...C.config };
      O ? D.item_type = O : delete D.item_type, C.config = Object.keys(D).length ? D : void 0;
    }
    function te(C, O) {
      Go(o.value, C, O);
      for (const D of t.draft.item_types ?? []) {
        const J = new Set(D.fields);
        D.fields = o.value.filter((h) => J.has(h.code)).map((h) => h.code);
      }
    }
    function z(C, O) {
      try {
        Wi(t.draft, C, O.value), delete m.value[C.code];
      } catch (D) {
        m.value[C.code] = D.message, O.value = C.code;
      }
    }
    function pe() {
      r.value = "text", f.value = c.value ? [c.value.id] : [];
    }
    function X(C) {
      const O = C.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), D = (/^[a-z]/.test(O) ? O : `field_${O || "new"}`).slice(0, 40);
      let J = D, h = 2;
      for (; o.value.some((re) => re.code === J); ) {
        const re = "_" + h++;
        J = D.slice(0, 40 - re.length) + re;
      }
      const U = { code: J, title: C, form: "text", cardinality: "one" };
      ce(U, r.value), (t.draft.fields ??= []).push(U);
      for (const re of t.draft.item_types ?? []) f.value.includes(re.id) && re.fields.push(J);
      c.value && !f.value.includes(c.value.id) && l("update:itemType", ""), L.value = J, l("created");
    }
    const L = W("");
    return (C, O) => (n(), b("section", hr, [
      s("div", gr, [
        g(d(fe), {
          "model-value": c.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...u.value],
          "onUpdate:modelValue": O[0] || (O[0] = (D) => l("update:itemType", D))
        }, null, 8, ["model-value", "options"]),
        g(Pa, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: pe,
          onAdd: X,
          onCancel: O[3] || (O[3] = (D) => l("cancel-creation"))
        }, {
          default: H(() => [
            s("label", yr, [
              O[5] || (O[5] = q("Kind", -1)),
              g(d(fe), {
                modelValue: r.value,
                "onUpdate:modelValue": O[1] || (O[1] = (D) => r.value = D),
                "aria-label": "New field kind",
                appendTo: "self",
                options: F.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            u.value.length ? (n(), Y($t, {
              key: 0,
              label: "Show on item types",
              options: u.value,
              modelValue: f.value,
              "onUpdate:modelValue": O[2] || (O[2] = (D) => f.value = D)
            }, null, 8, ["options", "modelValue"])) : S("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? S("", !0) : (n(), b("p", kr, "No fields here yet. Add a field to capture information.")),
      Vt((n(), Y(rl, {
        columns: "fields",
        count: i.value.length
      }, {
        default: H(() => [
          (n(!0), b(le, null, de(i.value, ({ field: D, index: J }) => (n(), Y(sl, {
            "route-section": "fields",
            "route-id": D.code,
            title: d(Ze)(D),
            "initial-open": L.value === D.code,
            kind: se(D)?.title || d(k).find((h) => h.value === _(D))?.label || d(Re)(_(D)),
            key: D.id ?? J,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: H(() => [
              g(d(ae), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + d(Ze)(D) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ye(Me((h) => te(J, -1), ["prevent"]), ["up"]),
                  Ye(Me((h) => te(J, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: H(() => [
                  g(d(ve), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: H(() => [
              D.track ? (n(), Y(d(dt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : S("", !0),
              D.intervals ? (n(), Y(d(dt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : S("", !0)
            ]),
            usage: H(() => [
              s("span", wr, T(p(D.code).length ? p(D.code).join(", ") : "Unused"), 1)
            ]),
            actions: H(() => [
              g(d(ae), {
                "aria-label": "Move " + d(Ze)(D) + " earlier",
                severity: "secondary",
                disabled: J === 0,
                onClick: (h) => te(J, -1),
                text: "",
                size: "small"
              }, {
                default: H(() => [
                  g(d(ve), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              g(d(ae), {
                "aria-label": "Move " + d(Ze)(D) + " later",
                severity: "secondary",
                disabled: J === o.value.length - 1,
                onClick: (h) => te(J, 1),
                text: "",
                size: "small"
              }, {
                default: H(() => [
                  g(d(ve), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: H(() => [
              m.value[D.code] ? (n(), b("p", $r, T(m.value[D.code]), 1)) : S("", !0),
              (n(!0), b(le, null, de(e.issues?.filter((h) => h.code === D.code) ?? [], (h) => (n(), b("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, T(d(nl)(h)), 1))), 128)),
              s("div", Vr, [
                s("label", xr, [
                  O[6] || (O[6] = q("Title", -1)),
                  g(d(De), {
                    modelValue: D.title,
                    "onUpdate:modelValue": (h) => D.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: d(Ze)(D)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", Cr, [
                  O[7] || (O[7] = q("Kind", -1)),
                  g(d(fe), {
                    "aria-label": "Kind",
                    "model-value": _(D),
                    "onUpdate:modelValue": (h) => ce(D, h),
                    appendTo: "self",
                    options: F.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", Sr, [
                  O[8] || (O[8] = q("Values allowed", -1)),
                  g(d(fe), {
                    "aria-label": "Values allowed",
                    "model-value": D.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => D.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              D.type === "item" ? (n(), b("label", Tr, [
                O[9] || (O[9] = q("Which items can be referenced? ", -1)),
                g(d(fe), {
                  "model-value": D.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...u.value],
                  "onUpdate:modelValue": (h) => E(D, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                O[10] || (O[10] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : S("", !0),
              B(D) ? (n(), Y(Ko, {
                key: D.type,
                schema: B(D),
                "model-value": D.config ?? I,
                "onUpdate:modelValue": (h) => D.config = h,
                onValidity: (h) => l("validity", "config-" + J, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
              D.type === "option" ? (n(), Y(br, {
                key: 3,
                field: D,
                onValidity: O[4] || (O[4] = (h, U) => l("validity", U, h))
              }, null, 8, ["field"])) : S("", !0),
              D.type === "formula" || D.type === "rollup" ? (n(), b("label", Ir, [
                O[11] || (O[11] = q("Result type", -1)),
                g(d(fe), {
                  "model-value": D.form,
                  "onUpdate:modelValue": (h) => ie(D, h),
                  "aria-label": "Result type",
                  options: d(k).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : S("", !0),
              D.type === "formula" ? (n(), b("label", Dr, [
                O[12] || (O[12] = q("Expression", -1)),
                g(d(De), {
                  modelValue: D.expression,
                  "onUpdate:modelValue": (h) => D.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : S("", !0),
              D.type === "rollup" ? (n(), b(le, { key: 6 }, [
                s("label", Ur, [
                  O[13] || (O[13] = q("Of", -1)),
                  g(d(De), {
                    modelValue: D.of,
                    "onUpdate:modelValue": (h) => D.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Er, [
                  O[14] || (O[14] = q("Function", -1)),
                  g(d(De), {
                    modelValue: D.fn,
                    "onUpdate:modelValue": (h) => D.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Ar, [
                  O[15] || (O[15] = q("Field", -1)),
                  g(d(De), {
                    modelValue: D.field,
                    "onUpdate:modelValue": (h) => D.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", Pr, [
                  O[16] || (O[16] = q("Order by", -1)),
                  g(d(fe), {
                    "model-value": D.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => D.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                g(_l, {
                  modelValue: D.where,
                  "onUpdate:modelValue": (h) => D.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + J, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : S("", !0),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: H(() => [
                  s("div", Or, [
                    s("label", Rr, [
                      O[17] || (O[17] = q("Field identifier for integrations", -1)),
                      g(d(De), {
                        value: D.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => z(D, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", Nr, [
                      O[18] || (O[18] = q("Allow filters to use", -1)),
                      g(d(fe), {
                        "aria-label": "Allow filters to use",
                        "model-value": D.index ?? "none",
                        "onUpdate:modelValue": (h) => D.index = h,
                        appendTo: "self",
                        options: me(D),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", Mr, [
                      O[21] || (O[21] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Fr, [
                        s("div", Lr, [
                          O[19] || (O[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          g(d(rt), {
                            modelValue: D.track,
                            "onUpdate:modelValue": (h) => D.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Br, [
                          O[20] || (O[20] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          g(d(rt), {
                            modelValue: D.intervals,
                            "onUpdate:modelValue": (h) => D.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !B(D) && ue(D) ? (n(), Y(jt, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": D.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => D.config = h,
                      onValidity: (h) => l("validity", "config-" + J, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
                    s("section", zr, [
                      O[22] || (O[22] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), b(le, null, de(["read", "write"], (h) => g(_o, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": D.access?.[h],
                        "onUpdate:modelValue": (U) => D.access = { ...D.access, [h]: U },
                        onValidity: (U) => l("validity", "access-" + J + h, U)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    g(d(ae), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!v.value,
                      onClick: (h) => y(D)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "title", "initial-open", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"])), [
        [d(w)]
      ])
    ]));
  }
}), Wr = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, qr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Gr = { class: "work-definition-meta" }, Kr = { class: "work-settings-grid" }, Hr = { class: "work-stack work-tight" }, Yr = { class: "work-stack work-tight" }, Xr = {
  key: 0,
  class: "work-stack work-tight"
}, Jr = { key: 1 }, Zr = { class: "work-stack work-tight" }, Qr = { class: "work-stack" }, _r = { class: "work-stack work-tight" }, ed = {
  key: 0,
  class: "work-row work-wrap"
}, td = { class: "work-stack work-tight" }, ad = {
  key: 1,
  class: "work-stack work-tight work-small"
}, ld = {
  key: 0,
  class: "kx-empty"
}, od = /* @__PURE__ */ Ve({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.item_types ?? []), r = W(""), f = W(""), u = W("");
    function c($) {
      const x = $.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), V = /^[a-z]/.test(x) ? x : "type_" + (x || "new");
      let F = V.slice(0, 40), I = 2;
      for (; o.value.some((_) => _.id === F); ) {
        const _ = "_" + I++;
        F = V.slice(0, 40 - _.length) + _;
      }
      return F;
    }
    function i($) {
      const x = c($);
      (t.draft.item_types ??= []).push({ id: x, title: $, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), r.value = x;
    }
    function v($, x) {
      const V = $.id;
      $.id = x;
      for (const F of o.value) F.parent_types && (F.parent_types = F.parent_types.map((I) => I === V ? x : I));
    }
    function m($, x) {
      $.fields = x, $.inherit && ($.inherit = $.inherit.filter((V) => x.includes(V)));
    }
    function w($) {
      return ($.parent_types ?? []).filter((x) => typeof x == "string");
    }
    function p($, x, V) {
      $.parent_types = V && x.length ? [...x, !1] : x;
    }
    function y($) {
      return o.value.filter((x) => x.id !== $.id && x.parent_types?.includes($.id)).map((x) => x.title || Re(x.id));
    }
    async function k($) {
      if (!u.value) {
        if (y($).length) {
          f.value = `${$.title || Re($.id)} is a parent type for ${y($).join(", ")}. Remove those parent selections first.`;
          return;
        }
        u.value = $.id, f.value = "";
        try {
          const x = await t.guardRemoval?.("item_types", $.id);
          x ? f.value = x : Na(t.draft, "item_types", $.id);
        } finally {
          u.value = "";
        }
      }
    }
    return ($, x) => (n(), b("section", Wr, [
      f.value ? (n(), b("p", qr, T(f.value), 1)) : S("", !0),
      g(rl, {
        columns: "types",
        count: o.value.length
      }, {
        default: H(() => [
          (n(!0), b(le, null, de(o.value, (V, F) => (n(), Y(sl, {
            "route-section": "items",
            "route-id": V.id,
            "initial-open": r.value === V.id,
            title: V.title || d(Re)(V.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((I) => I.id === V.process)?.name || d(Re)(V.process),
            key: F,
            class: "work-type-card"
          }, {
            usage: H(() => [
              s("span", Gr, [
                g(d(dt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: H(() => [
                    q(T(V.fields.length) + " " + T(V.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                y(V).length ? (n(), Y(d(dt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: H(() => [
                    q("Parent of " + T(y(V).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : S("", !0)
              ])
            ]),
            default: H(() => [
              (n(!0), b(le, null, de(e.issues?.filter((I) => I.code === "item_type " + V.id) ?? [], (I) => (n(), b("p", {
                key: I.what,
                class: "work-error work-small",
                role: "alert"
              }, T(d(nl)(I)), 1))), 128)),
              s("div", Kr, [
                s("label", Hr, [
                  x[0] || (x[0] = q("Title", -1)),
                  g(d(De), {
                    modelValue: V.title,
                    "onUpdate:modelValue": (I) => V.title = I,
                    placeholder: d(Re)(V.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", Yr, [
                  e.draft.processes?.length ? (n(), b("label", Xr, [
                    x[1] || (x[1] = q(" Workflow ", -1)),
                    g(d(fe), {
                      modelValue: V.process,
                      "onUpdate:modelValue": (I) => V.process = I,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((I) => ({ label: I.name || d(Re)(I.id), value: I.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), b("span", Jr, "Workflow")),
                  s("div", null, [
                    g(d(ae), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (I) => l("create-workflow", V, I)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", Zr, [
                g($t, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((I) => ({ value: I.code, label: d(Ze)(I) })),
                  "model-value": V.fields,
                  "onUpdate:modelValue": (I) => m(V, I)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  g(d(ae), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (I) => l("create-field", V, I)
                  }, null, 8, ["onClick"])
                ])
              ]),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: H(() => [
                  s("div", Qr, [
                    s("label", _r, [
                      x[2] || (x[2] = q("Identifier", -1)),
                      g(d(De), {
                        value: V.id,
                        onChange: (I) => v(V, I.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    x[6] || (x[6] = q()),
                    g($t, {
                      label: "Parent types",
                      options: o.value.map((I) => ({ value: I.id, label: I.title || d(Re)(I.id) })),
                      "model-value": w(V),
                      "onUpdate:modelValue": (I) => p(V, I, !!V.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    w(V).length ? (n(), b("label", ed, [
                      g(d(rt), {
                        "model-value": !!V.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (I) => p(V, w(V), I)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      x[3] || (x[3] = q("Allow top-level items", -1))
                    ])) : S("", !0),
                    s("div", td, [
                      g($t, {
                        label: "Inherit from parent",
                        options: V.fields.map((I) => ({ value: I, label: d(Ze)(e.draft.fields?.find((_) => _.code === I) ?? { code: I }) })),
                        modelValue: V.inherit,
                        "onUpdate:modelValue": (I) => V.inherit = I
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      x[4] || (x[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    w(V).length ? (n(), b("label", ad, [
                      x[5] || (x[5] = q("When the parent moves", -1)),
                      g(d(fe), {
                        modelValue: V.move_children,
                        "onUpdate:modelValue": (I) => V.move_children = I,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : S("", !0),
                    g(d(ae), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!u.value,
                      onClick: (I) => k(V)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? S("", !0) : (n(), b("p", ld, "Add a type for the work people create, such as a delivery task or customer request.")),
          g(Pa, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), id = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", Eo = /* @__PURE__ */ new WeakSet();
function nd(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !Eo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = id, a.append(t), Eo.add(a);
  }
}
const pi = 0.8;
function sd(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= pi) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((f) => f.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const rd = ["onKeydown"], dd = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, ud = ["viewBox"], cd = ["id"], vd = ["d", "marker-end"], fd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], md = ["d"], pd = ["d", "marker-end"], bd = ["x", "y", "width", "height"], hd = ["x", "y"], gd = ["x", "dy"], yd = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], kd = ["x", "y", "width", "height"], wd = ["cx", "cy"], $d = ["x", "y"], Vd = ["x", "dy"], xd = ["x", "y"], Cd = ["x", "dy"], Sd = {
  key: 0,
  class: "work-limit-text"
}, Td = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], Id = ["x", "y"], Dd = ["x", "dy"], Ud = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], Ed = ["d"], Ad = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, Pd = { class: "work-process-legend" }, Od = /* @__PURE__ */ Ve({
  __name: "ProcessGraph",
  props: {
    process: {},
    draft: {},
    selectedState: {},
    selectedTransition: {},
    fitOnOpen: { type: Boolean }
  },
  emits: ["state", "transition", "connect", "removeTransition", "clear"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = Qt().replace(/:/g, "_"), f = W(""), u = W(), c = W();
    let i;
    const v = W(900), m = W(!1), w = K(() => v.value < 700 ? 420 : 480), p = K(() => dn(l.process, l.draft, {
      width: v.value,
      height: w.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), y = W(1), k = W({ x: 0, y: 0 }), $ = W({ x: 0, y: 0 }), x = K(() => {
      const R = Math.min(1, v.value / p.value.width);
      return l.fitOnOpen ? Math.max(pi, R) : R;
    }), V = K(() => ({
      width: v.value,
      height: m.value ? Math.max(w.value, Math.ceil(p.value.height * x.value)) : w.value
    })), F = K(() => p.value.nodes.filter((R) => R.x - R.width / 2 >= k.value.x && R.x + R.width / 2 <= k.value.x + V.value.width / y.value && R.y - R.height / 2 >= k.value.y && R.y + R.height / 2 <= k.value.y + V.value.height / y.value).length);
    function I() {
      m.value = !1;
      const R = sd(p.value, V.value, l.process.initial);
      y.value = R.zoom, k.value = R.pan;
    }
    const _ = K(() => `${k.value.x} ${k.value.y} ${V.value.width / y.value} ${V.value.height / y.value}`), se = K(() => p.value.nodes.find((R) => R.state.id === f.value));
    function B() {
      m.value = !0, y.value = x.value;
      const R = V.value.width / y.value, ne = p.value.nodes.find((A) => A.state.id === l.process.initial);
      k.value = {
        x: p.value.width > R && ne ? ne.x - R / 2 : (p.value.width - R) / 2,
        y: 0
      };
    }
    function ue(R) {
      l.fitOnOpen && (m.value = !1);
      const ne = Math.max(0.02, Math.min(3, y.value * R)), A = 1 / y.value - 1 / ne;
      k.value = { x: k.value.x + V.value.width * A / 2, y: k.value.y + V.value.height * A / 2 }, y.value = ne;
    }
    function me(R) {
      const ne = V.value.width / y.value, A = V.value.height / y.value;
      (R.x - R.width / 2 < k.value.x || R.x + R.width / 2 > k.value.x + ne || R.y - R.height / 2 < k.value.y || R.y + R.height / 2 > k.value.y + A) && (k.value = { x: R.x - ne / 2, y: R.y - A / 2 });
    }
    function ke() {
      const R = p.value.nodes.find((ne) => ne.state === l.selectedState) ?? p.value.edges.find((ne) => ne.transition === l.selectedTransition);
      if (!R) {
        l.fitOnOpen && m.value && B();
        return;
      }
      me(R);
    }
    Ie([p, () => l.selectedState, () => l.selectedTransition], ke, { flush: "post" });
    function ce() {
      l.fitOnOpen ? B() : I();
    }
    Ie(() => l.process.id, () => {
      C(), ce();
    }, { flush: "post" });
    function ie(R) {
      if (R.target !== u.value) return;
      (R.key === "+" || R.key === "=") && (R.preventDefault(), ue(1.2)), R.key === "-" && (R.preventDefault(), ue(1 / 1.2)), R.key === "0" && (R.preventDefault(), B());
      const ne = 60 / y.value;
      R.key.startsWith("Arrow") && (R.preventDefault(), k.value = { x: k.value.x + (R.key === "ArrowRight" ? ne : R.key === "ArrowLeft" ? -ne : 0), y: k.value.y + (R.key === "ArrowDown" ? ne : R.key === "ArrowUp" ? -ne : 0) });
    }
    function E(R, ne) {
      const A = ne.currentTarget;
      if (!f.value) o("state", R, A);
      else if (f.value !== R.id) {
        const N = f.value;
        f.value = "", o("connect", N, R.id, A);
      }
    }
    function te(R) {
      f.value = R.state.id, $.value = { x: p.value.direction === "TB" ? R.x : R.x + R.width / 2, y: p.value.direction === "TB" ? R.y + R.height / 2 : R.y };
    }
    function z(R, ne) {
      if (R.pointerType === "touch" || R.button !== 0) return;
      i = R.pointerId, te(ne);
      const A = R.currentTarget;
      A.hasPointerCapture?.(R.pointerId) && A.releasePointerCapture(R.pointerId);
    }
    function pe(R, ne) {
      i === R.pointerId && (i = void 0, !(!f.value || f.value === ne.id) && E(ne, R));
    }
    function X(R, ne) {
      if ((R.key === "Enter" || R.key === " ") && (R.preventDefault(), E(ne, R)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(R.key)) {
        R.preventDefault();
        const A = Array.from(c.value?.querySelectorAll(".work-graph-node") ?? []), N = p.value.nodes.findIndex((j) => j.state === ne), M = ["ArrowRight", "ArrowDown"].includes(R.key) ? 1 : -1;
        A[(N + M + A.length) % A.length]?.focus();
      }
    }
    function L(R, ne) {
      l.selectedTransition === ne && o("removeTransition", R);
    }
    function C() {
      f.value = "", i = void 0, D.clear(), J = 0;
    }
    function O() {
      C(), o("clear");
    }
    const D = /* @__PURE__ */ new Map();
    let J = 0;
    function h(R) {
      if (!R.target.closest('[role="button"]') && (D.set(R.pointerId, { x: R.clientX, y: R.clientY }), u.value?.setPointerCapture?.(R.pointerId), D.size === 2)) {
        const [ne, A] = [...D.values()];
        J = Math.hypot(ne.x - A.x, ne.y - A.y);
      }
    }
    function U(R) {
      const ne = c.value?.getBoundingClientRect();
      if (!ne?.width) return;
      if (i === R.pointerId && f.value) {
        $.value = { x: k.value.x + (R.clientX - ne.left) * V.value.width / y.value / ne.width, y: k.value.y + (R.clientY - ne.top) * V.value.height / y.value / ne.height };
        return;
      }
      const A = D.get(R.pointerId);
      if (A)
        if (D.set(R.pointerId, { x: R.clientX, y: R.clientY }), D.size === 2) {
          const [N, M] = [...D.values()], j = Math.hypot(N.x - M.x, N.y - M.y);
          J && ue(j / J), J = j;
        } else k.value = { x: k.value.x - (R.clientX - A.x) * V.value.width / y.value / ne.width, y: k.value.y - (R.clientY - A.y) * V.value.height / y.value / ne.height };
    }
    function re(R) {
      i === R.pointerId && (f.value = "", i = void 0);
    }
    function Z(R) {
      D.delete(R.pointerId), J = 0, re(R);
    }
    function $e(R) {
      R.ctrlKey && (R.preventDefault(), ue(Math.exp(-R.deltaY * 0.01)));
    }
    let xe;
    Ra(() => {
      if (u.value && nd(u.value), typeof ResizeObserver < "u" && c.value) {
        let R = !0;
        xe = new ResizeObserver(() => {
          const ne = c.value?.getBoundingClientRect();
          if (!ne?.width || !ne.height) return;
          const A = V.value.width;
          v.value = ne.width, (R || Math.abs(ne.width - A) > 1) && (R ? ce() : m.value ? B() : I(), R = !1), ke();
        }), xe.observe(c.value);
      }
    }), At(() => xe?.disconnect()), a({ fit: B, focus: () => u.value?.focus(), zoomIn: () => ue(1.2), zoomOut: () => ue(1 / 1.2) });
    function Pe(R) {
      return R.category === "completed" ? "check" : R.category === "canceled" ? "x" : R.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[R.kind ?? ""] ?? "user";
    }
    return (R, ne) => (n(), b("section", {
      ref_key: "canvas",
      ref: u,
      class: wt(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && m.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        ie,
        Ye(Me(O, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: U,
      onPointerup: Z,
      onPointerleave: re,
      onPointercancel: C,
      onWheel: $e
    }, [
      f.value ? (n(), b("p", dd, "Choose the next stop. Escape cancels.")) : S("", !0),
      (n(), b("svg", {
        ref_key: "svg",
        ref: c,
        style: Ri({ height: V.value.height + "px" }),
        viewBox: _.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: d(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...ne[1] || (ne[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, cd)
        ]),
        (n(!0), b(le, null, de(p.value.parallels, (A) => (n(), b("path", {
          key: A.key,
          d: A.path,
          class: "work-lane-line",
          "marker-end": `url(#${d(r)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + T(d(be)(A.state)), 1)
        ], 8, vd))), 128)),
        (n(!0), b(le, null, de(p.value.edges, (A) => (n(), b("g", {
          key: A.key,
          class: wt(["work-graph-edge", ["work-edge-" + A.type, { "work-selected": e.selectedTransition === A.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + d(Ke)(A.transition),
          "aria-pressed": e.selectedTransition === A.transition,
          "aria-keyshortcuts": e.selectedTransition === A.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ye((N) => L(N, A.transition), ["delete"]),
            Ye((N) => L(N, A.transition), ["backspace"]),
            Ye(Me((N) => o("transition", A.transition, N.currentTarget), ["prevent"]), ["enter"]),
            Ye(Me((N) => o("transition", A.transition, N.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (N) => me(A),
          onClick: (N) => o("transition", A.transition, N.currentTarget)
        }, [
          s("path", {
            d: A.path,
            class: "work-edge-hit"
          }, null, 8, md),
          s("path", {
            d: A.path,
            class: "work-edge-line",
            "marker-end": `url(#${d(r)}-arrow)`
          }, null, 8, pd),
          s("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, bd),
          s("text", {
            x: A.x,
            y: A.y - (A.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), b(le, null, de(A.lines, (N, M) => (n(), b("tspan", {
              key: M,
              x: A.x,
              dy: M ? 16 : 0
            }, T(N), 9, gd))), 128))
          ], 8, hd)
        ], 42, fd))), 128)),
        (n(!0), b(le, null, de(p.value.nodes, (A) => (n(), b("g", {
          key: A.state.id,
          class: wt(["work-graph-node", ["work-stop-" + A.state.category, { "work-selected": e.selectedState === A.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + d(be)(A.state),
          "aria-pressed": e.selectedState === A.state,
          onClick: (N) => E(A.state, N),
          onKeydown: (N) => X(N, A.state),
          onFocus: (N) => me(A),
          onPointerup: (N) => pe(N, A.state)
        }, [
          s("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, kd),
          s("circle", {
            cx: A.x - A.width / 2 + 22,
            cy: A.y - A.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, wd),
          g(d(ve), {
            icon: "tabler:" + Pe(A.state),
            x: A.x - A.width / 2 + 15,
            y: A.y - A.height / 2 + 18,
            width: "14",
            height: "14",
            class: "work-stop-icon",
            "aria-hidden": "true"
          }, null, 8, ["icon", "x", "y"]),
          s("text", {
            x: A.x - A.width / 2 + 42,
            y: A.y - A.height / 2 + 29,
            class: "work-node-name"
          }, [
            (n(!0), b(le, null, de(A.title, (N, M) => (n(), b("tspan", {
              key: M,
              x: A.x - A.width / 2 + 42,
              dy: M ? 18 : 0
            }, T(N), 9, Vd))), 128))
          ], 8, $d),
          s("text", {
            x: A.x - A.width / 2 + 16,
            y: A.y - A.height / 2 + 33 + A.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), b(le, null, de(A.caption, (N, M) => (n(), b("tspan", {
              key: M,
              x: A.x - A.width / 2 + 16,
              dy: M ? 16 : 0
            }, T(N), 9, Cd))), 128)),
            e.draft.policy?.wip?.[A.state.id] ? (n(), b("tspan", Sd, " · limit " + T(e.draft.policy.wip[A.state.id].limit), 1)) : S("", !0)
          ], 8, xd),
          (n(!0), b(le, null, de(A.badges, (N, M) => (n(), b("g", {
            key: N.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + d(Ke)(N),
            "aria-pressed": e.selectedTransition === N,
            "aria-keyshortcuts": e.selectedTransition === N ? "Delete Backspace" : void 0,
            onFocus: (j) => me(A),
            onKeydown: [
              Ye((j) => L(j, N), ["delete"]),
              Ye((j) => L(j, N), ["backspace"]),
              Ye(Me((j) => o("transition", N, j.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ye(Me((j) => o("transition", N, j.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Me((j) => o("transition", N, j.currentTarget), ["stop"])
          }, [
            s("text", {
              x: A.x - A.width / 2 + 16,
              y: A.y - A.height / 2 + 33 + A.title.length * 18 + A.caption.length * 16 + A.badges.slice(0, M).reduce((j, ee) => j + d(ua)(d(Ke)(ee) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), b(le, null, de(d(ua)(d(Ke)(N) + " works from any state"), (j, ee) => (n(), b("tspan", {
                key: ee,
                x: A.x - A.width / 2 + 16,
                dy: ee ? 18 : 0
              }, T(j), 9, Dd))), 128))
            ], 8, Id)
          ], 40, Td))), 128)),
          ["completed", "canceled"].includes(A.state.category) ? S("", !0) : (n(), b("circle", {
            key: 0,
            cx: p.value.direction === "TB" ? A.x : A.x + A.width / 2,
            cy: p.value.direction === "TB" ? A.y + A.height / 2 : A.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + d(be)(A.state),
            "aria-pressed": f.value === A.state.id,
            onFocus: (N) => me(A),
            onPointerdown: Me((N) => z(N, A), ["stop"]),
            onClick: Me((N) => te(A), ["stop"]),
            onKeydown: [
              Ye(Me((N) => te(A), ["stop", "prevent"]), ["enter"]),
              Ye(Me((N) => te(A), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, Ud))
        ], 42, yd))), 128)),
        se.value ? (n(), b("path", {
          key: 0,
          d: `M ${p.value.direction === "TB" ? se.value.x : se.value.x + se.value.width / 2} ${p.value.direction === "TB" ? se.value.y + se.value.height / 2 : se.value.y} L ${$.value.x} ${$.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, Ed)) : S("", !0)
      ], 12, ud)),
      F.value < e.process.states.length ? (n(), b("div", Ad, [
        s("span", null, T(F.value) + " of " + T(e.process.states.length) + " states in view · Pan to see more", 1),
        m.value ? S("", !0) : (n(), Y(d(ae), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: ne[0] || (ne[0] = (A) => B())
        }))
      ])) : S("", !0),
      s("div", Pd, [
        s("span", null, T(e.process.states.length) + " states · " + T(Math.round(y.value * 100)) + "%", 1),
        ne[2] || (ne[2] = s("span", null, [
          s("i"),
          q("Transition")
        ], -1)),
        ne[3] || (ne[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          q("Return / loop")
        ], -1)),
        ne[4] || (ne[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, rd));
  }
}), jl = new Intl.ListFormat("en", { type: "conjunction" }), Rd = new Intl.ListFormat("en", { type: "disjunction" }), Nd = {
  eq: "is",
  neq: "is different from",
  in: "is one of",
  nin: "is none of",
  lt: "is less than",
  lte: "is at most",
  gt: "is greater than",
  gte: "is at least",
  between: "is between",
  has: "includes",
  contains: "contains",
  starts_with: "starts with",
  member_of: "belongs to"
}, Md = { some: "At least one", every: "Every", none: "No" };
function Wl(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? Ze(t) : Re(e);
}
function ql(e, a, t) {
  return Array.isArray(e) ? jl.format(e.map((l) => ql(l, a, t))) : a === "category" && typeof e == "string" ? Wt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Re(e) : "$actor" in vt(e) ? "the person moving the item" : "$now" in vt(e) ? "the current time" : Yt(e, t.fields?.find((l) => l.code === a));
}
function Fd(e) {
  const a = vt(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function _a(e, a) {
  const t = vt(e), l = (r) => r.map((f) => _a(f, a)), o = a.relation_types?.find((r) => r.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${jl.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${Rd.format(l(t.or))})`;
  if (t.not) return `this condition is false (${_a(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const r = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, f = t.children ? "child item" : `item linked as “${r || Re(String(t.rel))}”`;
    return `${Md[String(t.q)] ?? "At least one"} ${f} matches (${_a(t.where, a)})`;
  }
  if (t.history) {
    const r = vt(t.history);
    if (typeof r.field != "string") return "a value history condition";
    const f = Wl(r.field, a), u = (i) => ql(i, String(r.field), a), c = Array.isArray(r.during) ? ` during ${jl.format(r.during.map((i) => String(i)))}` : "";
    if (r.changed === !0) {
      const i = r.from === void 0 ? "" : ` from ${u(r.from)}`, v = r.to === void 0 ? "" : ` to ${u(r.to)}`;
      return `${f} changed${i}${v}${c}`;
    }
    return r.was !== void 0 ? `${f} was ${u(r.was)}${c}` : `a change in the history of ${f}${c}`;
  }
  if (typeof t.field == "string") {
    const r = Wl(t.field, a);
    if (t.op === "is_null") return `${r} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const u = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (u) return `${r} ${u}`;
    }
    const f = Nd[String(t.op)];
    return f && t.value !== void 0 ? `${r} ${f} ${ql(t.value, t.field, a)}` : `a condition on ${r}`;
  }
  return "a custom condition";
}
function Ld(e, a, t, l = []) {
  const o = [], r = a.states.find((u) => u.id === e.to), f = [.../* @__PURE__ */ new Set([...e.require ?? [], ...r?.require ?? []])];
  f.length && o.push(`Required: ${f.map((u) => Wl(u, t)).join(", ")}`), e.when != null && o.push(Fd(vt(e.when)) ?? `Only when ${_a(e.when, t)}`);
  for (const u of e.guards ?? []) {
    const c = l.find((i) => i.id === u);
    o.push(c ? `Requires the “${c.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const Bd = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, bi = /* @__PURE__ */ Ve({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = K(() => Ld(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), b("div", Bd, [
      (n(!0), b(le, null, de(t.value, (r, f) => (n(), b("p", { key: f }, T(r), 1))), 128))
    ])) : S("", !0);
  }
}), zd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, jd = { class: "work-table-scroll" }, Wd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, qd = { role: "rowgroup" }, Gd = ["aria-selected"], Kd = { role: "cell" }, Hd = {
  key: 0,
  class: "work-muted work-small"
}, Yd = { role: "cell" }, Xd = { role: "cell" }, Jd = {
  role: "cell",
  class: "work-process-list-actions"
}, Zd = { class: "work-table-scroll" }, Qd = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, _d = { role: "rowgroup" }, eu = ["aria-selected"], tu = { role: "cell" }, au = { role: "cell" }, lu = { role: "cell" }, ou = {
  role: "cell",
  class: "work-process-list-actions"
}, iu = /* @__PURE__ */ Ve({
  __name: "ProcessList",
  props: {
    process: {},
    draft: {},
    guards: {},
    selectedState: {},
    selectedTransition: {},
    counts: {}
  },
  emits: ["state", "transition", "removeState", "removeTransition"],
  setup(e) {
    return (a, t) => (n(), b("section", zd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", jd, [
        s("table", Wd, [
          t[2] || (t[2] = s("thead", { role: "rowgroup" }, [
            s("tr", { role: "row" }, [
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Phase"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Kind"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          s("tbody", qd, [
            (n(!0), b(le, null, de(e.process.states, (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Kd, [
                g(d(De), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + d(be)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), b("p", Hd, T(e.counts[l.id] ?? 0) + " here", 1)) : S("", !0)
              ]),
              s("td", Yd, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                q(T(d(Wt)(l.category)), 1)
              ]),
              s("td", Xd, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                g(d(dt), { severity: "secondary" }, {
                  default: H(() => [
                    q(T(d(el)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Jd, [
                g(d(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + d(be)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: H(() => [
                    g(d(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(d(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + d(be)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: H(() => [
                    g(d(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Gd))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Zd, [
        s("table", Qd, [
          t[5] || (t[5] = s("thead", { role: "rowgroup" }, [
            s("tr", { role: "row" }, [
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Name"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "From"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "To"),
              s("th", {
                role: "columnheader",
                scope: "col"
              }, "Actions")
            ])
          ], -1)),
          s("tbody", _d, [
            (n(!0), b(le, null, de(e.process.transitions ?? [], (l) => (n(), b("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", tu, [
                g(d(De), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: d(Ke)(l),
                  "aria-label": "Name of " + d(Ke)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                g(bi, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              s("td", au, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                q(" " + T(l.from === "any" ? "Any state" : l.from.map((o) => d(be)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              s("td", lu, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                q(T(d(be)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", ou, [
                g(d(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + d(Ke)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: H(() => [
                    g(d(ve), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                g(d(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + d(Ke)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: H(() => [
                    g(d(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, eu))), 128))
          ])
        ])
      ])
    ]));
  }
}), nu = { class: "work-stack work-transition-settings" }, su = { class: "work-stack work-tight" }, ru = { class: "work-row" }, du = { key: 0 }, uu = { class: "work-stack" }, cu = { class: "work-row" }, vu = { class: "work-row" }, fu = { class: "work-stack work-tight" }, mu = { class: "work-row" }, pu = { class: "work-stack work-tight" }, bu = { class: "work-stack work-tight" }, hu = /* @__PURE__ */ Ve({
  __name: "TransitionSettings",
  props: {
    transition: {},
    process: {},
    draft: {},
    boardId: {},
    guards: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o() {
      (t.transition.set ??= []).push({ field: t.draft.fields?.[0]?.code ?? "", value: "" });
    }
    function r(f, u) {
      const c = t.transition.set?.[f];
      !c || !t.transition.set || (t.transition.set[f] = { field: c.field, ...u === "clear" ? { clear: !0 } : u === "copy" ? { copy: "" } : { value: "" } });
    }
    return (f, u) => (n(), b("div", nu, [
      s("label", su, [
        u[15] || (u[15] = q("To state", -1)),
        g(d(fe), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": u[0] || (u[0] = (c) => e.transition.to = c),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((c) => ({ label: d(be)(c), value: c.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", ru, [
        u[16] || (u[16] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        g(d(rt), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": u[1] || (u[1] = (c) => e.transition.from = c ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), Y($t, {
        key: 0,
        label: "From states",
        options: e.process.states.map((c) => ({ value: c.id, label: d(be)(c) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": u[2] || (u[2] = (c) => e.transition.from = c)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      u[24] || (u[24] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      g($t, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": u[3] || (u[3] = (c) => e.transition.require = c)
      }, null, 8, ["options", "modelValue"]),
      u[25] || (u[25] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      g(_l, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": u[4] || (u[4] = (c) => e.transition.when = c),
        onValidity: u[5] || (u[5] = (c) => l("validity", "when", c))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), Y($t, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((c) => ({ value: c.id, label: c.title })), ...(e.transition.guards ?? []).filter((c) => !e.guards?.some((i) => i.id === c)).map((c) => ({ value: c, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": u[6] || (u[6] = (c) => e.transition.guards = c)
      }, null, 8, ["options", "modelValue"])) : S("", !0),
      (n(!0), b(le, null, de(e.guards?.filter((c) => e.transition.guards?.includes(c.id)) ?? [], (c) => (n(), b("p", {
        key: c.id,
        class: "work-muted work-small"
      }, [
        q(T(c.description || c.title + " can stop this transition.") + " ", 1),
        c.reads?.length ? (n(), b("span", du, " Checks " + T(c.reads.map((i) => e.draft.fields?.find((v) => v.code === i)?.title || "a configured field").join(", ")) + ".", 1)) : S("", !0)
      ]))), 128)),
      g(Le, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: H(() => [
          s("div", uu, [
            s("label", cu, [
              u[17] || (u[17] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              g(d(rt), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": u[7] || (u[7] = (c) => {
                  e.transition.auto = c, c || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", vu, [
              u[18] || (u[18] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              g(d(rt), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": u[8] || (u[8] = (c) => e.transition.default = c),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            u[23] || (u[23] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), b(le, null, de(e.transition.set ?? [], (c, i) => (n(), b("div", {
              key: i,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", fu, [
                u[19] || (u[19] = q("Field", -1)),
                g(d(fe), {
                  modelValue: c.field,
                  "onUpdate:modelValue": (v) => c.field = v,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((v) => ({ value: v.code, label: v.title || v.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", mu, [
                g(d(fe), {
                  "model-value": c.clear ? "clear" : c.copy !== void 0 ? "copy" : "value",
                  "aria-label": "Value action",
                  appendTo: "self",
                  options: [
                    { label: "Set value", value: "value" },
                    { label: "Clear value", value: "clear" },
                    { label: "Copy field", value: "copy" }
                  ],
                  optionLabel: "label",
                  optionValue: "value",
                  "onUpdate:modelValue": (v) => r(i, v)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                g(d(ae), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (i + 1),
                  onClick: (v) => e.transition.set?.splice(i, 1)
                }, {
                  default: H(() => [
                    g(d(ve), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              c.copy !== void 0 ? (n(), Y(d(fe), {
                key: 0,
                modelValue: c.copy,
                "onUpdate:modelValue": (v) => c.copy = v,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((v) => ({ value: v.code, label: v.title || v.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : c.clear ? S("", !0) : (n(!0), b(le, { key: 1 }, de(e.draft.fields?.filter((v) => v.code === c.field) ?? [], (v) => (n(), Y(Qo, {
                key: v.code,
                "board-id": e.boardId ?? "",
                field: v,
                modelValue: c.value,
                "onUpdate:modelValue": (m) => c.value = m,
                onValidity: (m) => l("validity", "effect-" + i, m)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            g(d(ae), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: H(() => [
                g(d(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", pu, [
              u[20] || (u[20] = q("Offer to people", -1)),
              g(d(fe), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": u[9] || (u[9] = (c) => e.transition.people = c)
              }, null, 8, ["model-value"]),
              u[21] || (u[21] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", bu, [
              u[22] || (u[22] = q("Evaluation order", -1)),
              g(d(Dt), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": u[10] || (u[10] = (c) => e.transition.order = c ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            g(jt, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              "onUpdate:modelValue": u[11] || (u[11] = (c) => e.transition.set = c),
              onValidity: u[12] || (u[12] = (c) => l("validity", "set", c))
            }, null, 8, ["model-value"]),
            g(jt, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              "onUpdate:modelValue": u[13] || (u[13] = (c) => e.transition.guards = c),
              onValidity: u[14] || (u[14] = (c) => l("validity", "guards", c))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Ao = /* @__PURE__ */ Ve({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = K(() => a.draft.policy?.wip?.[a.state]);
    function l(r) {
      if (r === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const f = a.draft.policy ??= {}, u = f.wip ??= {};
      u[a.state] = { ...u[a.state], limit: r };
    }
    function o(r) {
      t.value && (t.value.hard = r);
    }
    return (r, f) => e.hard ? (n(), Y(d(rt), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), Y(d(Dt), {
      key: 1,
      "aria-label": e.label,
      min: 0,
      "max-fraction-digits": 0,
      "model-value": t.value?.limit ?? null,
      placeholder: "No limit",
      "use-grouping": !1,
      "onUpdate:modelValue": l
    }, null, 8, ["aria-label", "model-value"]));
  }
});
async function Pl(e, a) {
  try {
    const { data: t } = await Nl.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Ol({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw qi(t, "Published Flow");
  }
}
const Po = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Gl = {
  title: async (e) => (await Pl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Pl(Po(e))).versions ?? [],
  check: async (e) => {
    if ((await Pl(`${Po(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, gu = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, yu = {
  key: 0,
  class: "work-muted work-small"
}, ku = {
  key: 1,
  class: "kx-err work-alert-actions"
}, wu = { role: "alert" }, $u = ["schema", "config", "title"], Vu = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, xu = {
  key: 4,
  class: "work-stack work-tight"
}, Cu = ["value", "aria-busy", "disabled"], Su = {
  value: "",
  disabled: ""
}, Tu = ["value"], Iu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, Du = /* @__PURE__ */ Ve({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(!1), r = W(""), f = W([]), u = W(!1), c = W(""), i = W(!1), v = K(() => r.value || t.modelValue?.id), m = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), w = K(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let p = 0;
    async function y() {
      o.value = await zt("wc-workflow-picker");
    }
    y();
    async function k() {
      const F = ++p, I = v.value, _ = t.modelValue;
      if (u.value = !!I, c.value = "", f.value = [], !!I)
        try {
          const [se] = await Promise.all([Gl.versions(I), !i.value && _ ? Gl.check(_) : Promise.resolve()]);
          if (F !== p) return;
          if (f.value = se.filter((B) => Number.isInteger(B.version) && B.version > 0), !i.value && _ && !f.value.some((B) => B.version === _.version)) throw new Error("The published version is unavailable.");
        } catch (se) {
          F === p && (c.value = pt(se, "Could not read published Flow."));
        } finally {
          F === p && (u.value = !1);
        }
    }
    Ie([v, () => t.modelValue?.version, i], k, { immediate: !0 }), Ie(i, (F) => l("validity", !F), { immediate: !0 });
    function $(F) {
      const I = F.detail?.flow_ref;
      I?.kind !== "flow" || !I.id || (i.value = !0, r.value = I.id);
    }
    function x(F) {
      !v.value || !f.value.some((I) => I.version === F) || (l("update:modelValue", { kind: "flow", id: v.value, version: F }), i.value = !1, r.value = "");
    }
    function V() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return At(() => {
      p++, l("validity", !0);
    }), (F, I) => (n(), b("section", gu, [
      I[4] || (I[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? S("", !0) : (n(), b("p", yu, "No Flow bound. This stage keeps its existing external execution contract.")),
      c.value ? (n(), b("div", ku, [
        s("p", wu, [
          q(T(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), b(le, { key: 0 }, [
            q(" (v" + T(e.modelValue.version) + ")", 1)
          ], 64)) : S("", !0),
          q(". " + T(c.value), 1)
        ]),
        g(d(ae), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: k
        })
      ])) : S("", !0),
      o.value ? (n(), b("wc-workflow-picker", {
        key: 2,
        schema: d(m),
        config: w.value,
        title: e.modelValue?.id,
        onChange: $
      }, null, 40, $u)) : (n(), b("p", Vu, [
        I[2] || (I[2] = q("Published Flow picker unavailable.", -1)),
        g(d(ae), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: y
        })
      ])),
      v.value ? (n(), b("label", xu, [
        I[3] || (I[3] = q(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": u.value,
          disabled: u.value || !!c.value,
          onChange: I[0] || (I[0] = (_) => x(Number(_.target.value)))
        }, [
          s("option", Su, T(u.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), b(le, null, de(f.value, (_) => (n(), b("option", {
            key: _.version,
            value: _.version
          }, "v" + T(_.version), 9, Tu))), 128))
        ], 40, Cu)
      ])) : S("", !0),
      i.value ? (n(), b("p", Iu, "Choose a published version to finish selecting the Flow.")) : S("", !0),
      e.modelValue || i.value ? (n(), Y(d(ae), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: I[1] || (I[1] = (_) => i.value ? (i.value = !1, r.value = "") : V())
      }, null, 8, ["label", "aria-label"])) : S("", !0)
    ]));
  }
}), Kl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function Ca(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / Kl[r], unit: r };
}
function Uu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * Kl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * Kl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const Eu = { class: "work-stack work-tight" }, Au = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Jt = /* @__PURE__ */ Ve({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + Qt(), r = W(), f = W(""), u = K(() => t.modelValue ? Ca(t.modelValue) : void 0), c = K(() => r.value ?? u.value?.unit ?? "days");
    Ie(() => t.modelValue, (x) => {
      f.value = "", l("validity", !x || !!u.value, o);
    }, { immediate: !0 });
    const i = K(() => t.modelValue ? Ca(t.modelValue, c.value)?.amount ?? null : null);
    function v(x) {
      try {
        const V = Uu(x, c.value);
        f.value = "", l("update:modelValue", V), l("validity", !0, o);
      } catch (V) {
        f.value = V.message, l("validity", !1, o);
      }
    }
    let m;
    function w(x) {
      x.target instanceof HTMLInputElement && (m = x.target.value);
    }
    function p(x) {
      if (m === void 0) return;
      const V = m;
      m = void 0, k(x, V);
    }
    function y(x) {
      m = void 0;
      const V = x.originalEvent?.target instanceof HTMLInputElement ? x.originalEvent.target.value : x.formattedValue;
      k(x.value, V);
    }
    function k(x, V) {
      if (V.trim() && (typeof x != "number" || !Number.isFinite(x))) {
        f.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = c.value, v(typeof x == "number" ? x : null);
    }
    function $(x) {
      const V = i.value;
      r.value = x, !(t.modelValue && !u.value) && v(V);
    }
    return At(() => l("validity", !0, o)), (x, V) => (n(), b("label", Eu, [
      q(T(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: w
      }, [
        g(d(Dt), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!f.value || !!e.modelValue && !d(Ca)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": c.value === "seconds" ? 20 : 3,
          onInput: y,
          "onUpdate:modelValue": p
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        g(d(fe), {
          "model-value": c.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": V[0] || (V[0] = (F) => $(F))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      f.value || e.modelValue && !d(Ca)(e.modelValue) ? (n(), b("span", Au, T(f.value || `Unsupported duration: ${e.modelValue}`), 1)) : S("", !0)
    ]));
  }
}), Pu = { class: "work-stack" }, Ou = { class: "work-settings-grid" }, Ru = { class: "work-stack work-tight" }, Nu = { class: "work-stack work-tight" }, Mu = {
  key: 1,
  class: "work-stack work-tight"
}, Fu = { class: "work-stack work-tight" }, Lu = { class: "work-settings-grid" }, Bu = { class: "work-row" }, zu = { class: "work-stack work-tight" }, ju = {
  key: 0,
  class: "work-stack work-tight"
}, Wu = /* @__PURE__ */ Ve({
  __name: "TimersEditor",
  props: {
    state: {},
    draft: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o() {
      return t.state.timers ?? [];
    }
    function r() {
      const i = t.state.timers ?? (t.state.timers = []);
      i.push({ id: da("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function f(i, v) {
      delete i.after, delete i.at_field, v === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function u(i, v, m) {
      m ? i[v] = m : (delete i[v], delete i.table);
    }
    function c(i, v) {
      i.then = v === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, v) => (n(), b("section", Pu, [
      v[8] || (v[8] = s("h4", null, "Timers", -1)),
      (n(!0), b(le, null, de(o(), (m, w) => (n(), b("article", {
        key: m.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", Ou, [
          s("label", Ru, [
            v[2] || (v[2] = q("Timer ID", -1)),
            g(d(De), {
              modelValue: m.id,
              "onUpdate:modelValue": (p) => m.id = p,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", Nu, [
            v[3] || (v[3] = q("Deadline", -1)),
            g(d(fe), {
              "model-value": m.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (p) => f(m, p),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "After duration", value: "after", disabled: !1 },
                { label: "At field", value: "at_field", disabled: !1 }
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue"])
          ]),
          m.after !== void 0 ? (n(), Y(Jt, {
            key: 0,
            modelValue: m.after,
            "onUpdate:modelValue": (p) => m.after = p,
            label: "After",
            onValidity: v[0] || (v[0] = (p, y) => l("validity", y, p))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), b("label", Mu, [
            v[4] || (v[4] = q("At field", -1)),
            g(d(fe), {
              modelValue: m.at_field,
              "onUpdate:modelValue": (p) => m.at_field = p,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((p) => p.form === "time") ?? []).map((p) => ({
                  label: p.code,
                  value: p.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          s("label", Fu, [
            v[5] || (v[5] = q("Duration by field", -1)),
            g(d(fe), {
              "model-value": m.by ?? "",
              "onUpdate:modelValue": (p) => u(m, "by", p),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((p) => ({
                  label: p.code,
                  value: p.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        m.by ? (n(), Y(jt, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": m.table,
          shape: "object",
          "onUpdate:modelValue": (p) => m.table = p,
          onValidity: (p) => l("validity", "table-" + w, p)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : S("", !0),
        s("div", Lu, [
          g(Jt, {
            modelValue: m.repeat,
            "onUpdate:modelValue": (p) => m.repeat = p,
            label: "Repeat every",
            onValidity: v[1] || (v[1] = (p, y) => l("validity", y, p)),
            disabled: m.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", Bu, [
            g(d(Zt), {
              modelValue: m.interrupting,
              "onUpdate:modelValue": [(p) => m.interrupting = p, (p) => m.interrupting && delete m.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            v[6] || (v[6] = q("Interrupting", -1))
          ]),
          s("label", zu, [
            v[7] || (v[7] = q("Then", -1)),
            g(d(fe), {
              "model-value": m.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (p) => c(m, p),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Emit event", value: "emit", disabled: !1 },
                { label: "Transition", value: "transition", disabled: !1 }
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue"])
          ]),
          m.then ? (n(), b("label", ju, [
            q(T(m.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            m.then.transition !== void 0 ? (n(), Y(d(De), {
              key: 0,
              modelValue: m.then.transition,
              "onUpdate:modelValue": (p) => m.then.transition = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), Y(d(De), {
              key: 1,
              modelValue: m.then.emit,
              "onUpdate:modelValue": (p) => m.then.emit = p
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : S("", !0)
        ]),
        g(d(ae), {
          severity: "secondary",
          onClick: (p) => o().splice(w, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: H(() => [
            g(d(ve), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      g(d(ae), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: H(() => [
          g(d(ve), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), qu = ["aria-label"], Gu = { class: "work-stack work-tight" }, Ku = {
  key: 0,
  class: "work-stack work-tight"
}, Hu = /* @__PURE__ */ Ve({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), r = K(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function f(c) {
      l("update:modelValue", c === "field" ? { field: "" } : c === "group" ? { group: "" } : []);
    }
    function u(c) {
      l("update:modelValue", o.value === "group" ? { group: c.at(-1)?.id ?? "" } : c);
    }
    return zo(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), At(() => l("validity", !0)), (c, i) => (n(), b("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", Gu, [
        q(T(e.label) + " source", 1),
        g(d(fe), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": f
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), b("label", Ku, [
        i[1] || (i[1] = q("Principal field", -1)),
        g(d(fe), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((v) => v.type === "principal").map((v) => ({ label: v.title || v.code, value: v.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (v) => l("update:modelValue", { field: v }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), Y(eo, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": u
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, qu));
  }
}), Yu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xu = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Ju = { class: "work-stack work-tight" }, Zu = {
  key: 0,
  class: "work-stack work-tight"
}, Qu = ["kinds", "placeholder", "value"], _u = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, ec = {
  key: 3,
  class: "work-chips"
}, tc = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, ac = {
  key: 5,
  class: "work-muted work-small"
}, lc = { class: "work-row" }, oc = { class: "work-row work-small" }, ic = /* @__PURE__ */ Ve({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: f } = Wo(() => t.boardId ?? "", () => {
      const k = t.approvals.from;
      return Array.isArray(k) ? Gi(k) : "group" in k && k.group ? [{ kind: "group", id: k.group }] : [];
    }), u = W(), c = K(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = K(() => {
      const k = t.approvals.from;
      return "group" in k && k.group ? JSON.stringify({ type: "group", principal_id: k.group }) : "{}";
    }), v = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], m = K(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((k) => k.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    zo(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && m.value)), At(() => l("validity", !0)), Ra(async () => {
      u.value = await zt("wc-principal-picker");
    });
    function w(k) {
      t.approvals.from = k === "group" ? { group: "" } : k === "field" ? { field: "" } : [];
    }
    function p(k) {
      const $ = k.detail, x = $?.principal_id ?? $?.id;
      if (c.value === "group") {
        t.approvals.from = { group: x ?? "" };
        return;
      }
      if (!x || !Array.isArray(t.approvals.from)) return;
      const V = { kind: $.type ?? $.kind ?? "user", id: x };
      $.label && r(V, $.label), t.approvals.from.some((F) => F.id === x && F.kind === V.kind) || t.approvals.from.push(V);
    }
    function y(k) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(k, 1);
    }
    return (k, $) => (n(), b(le, null, [
      d(f) ? (n(), b("p", Yu, T(d(f)), 1)) : S("", !0),
      s("section", Xu, [
        s("label", Ju, [
          $[4] || ($[4] = q("Approval source ", -1)),
          g(d(fe), {
            "model-value": c.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": $[0] || ($[0] = (x) => w(x)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: v
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), b("label", Zu, [
          $[5] || ($[5] = q("Principal field", -1)),
          g(d(De), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": $[1] || ($[1] = (x) => e.approvals.from.field = x),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : u.value ? (n(), b("wc-principal-picker", {
          key: c.value,
          kinds: c.value === "group" ? "group" : "user,group",
          placeholder: c.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: p
        }, null, 40, Qu)) : (n(), b("p", _u, T(u.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), b("div", ec, [
          (n(!0), b(le, null, de(e.approvals.from, (x, V) => (n(), Y(d(dt), {
            key: x.kind + ":" + x.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: H(() => [
              q(T(d(o)(x)), 1),
              g(d(ae), {
                "aria-label": "Remove approver " + (V + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (F) => y(V)
              }, {
                default: H(() => [
                  g(d(ve), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : S("", !0),
        Array.isArray(e.approvals.from) && !m.value ? (n(), b("p", tc, "Select at least " + T(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), b("p", ac, "Choose the group that can approve this state.")) : S("", !0),
        s("label", lc, [
          $[6] || ($[6] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          g(d(Dt), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": $[2] || ($[2] = (x) => e.approvals.min = x),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        s("label", oc, [
          $[7] || ($[7] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          g(d(rt), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": $[3] || ($[3] = (x) => e.approvals.prevent_self = x),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), nc = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, sc = { class: "work-process-kind" }, rc = { class: "work-stack" }, dc = { class: "work-row" }, uc = { class: "work-row" }, cc = { class: "work-row" }, vc = { class: "work-stack work-tight" }, fc = { class: "work-row" }, mc = { class: "work-stack work-tight" }, pc = { class: "work-row" }, bc = { class: "work-row" }, hc = { class: "work-stack work-tight" }, gc = { class: "work-stack" }, yc = { class: "work-row" }, kc = { class: "work-row" }, wc = { class: "work-stack work-tight" }, $c = { class: "work-stack work-tight" }, Vc = {
  key: 0,
  class: "work-row"
}, xc = { class: "work-stack" }, Cc = { class: "work-stack work-tight" }, Sc = { class: "work-row" }, Tc = /* @__PURE__ */ Ve({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => (t.process.transitions ?? []).filter((c) => c.from === "any" || c.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function f(c) {
      const i = t.state;
      i.kind = c, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (c === "automated" || c === "gate") && delete i.awaiting, c === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), c === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), c === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((v) => v.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", c);
    }
    function u(c) {
      t.state.run && (c ? t.state.run.on_fail = c : delete t.state.run.on_fail);
    }
    return (c, i) => (n(), b("section", nc, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      g(d(Jl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((v) => ({
          ...v,
          label: d(el)(v.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": f
      }, {
        option: H(({ option: v }) => [
          s("span", sc, [
            g(d(ve), {
              icon: "tabler:" + v.icon
            }, null, 8, ["icon"]),
            s("span", null, T(v.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), b(le, { key: 0 }, [
        i[35] || (i[35] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), Y(ic, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (v) => l("validity", "approvers", v))
        }, null, 8, ["board-id", "approvals"])) : S("", !0),
        g(Le, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: H(() => [
            s("div", rc, [
              s("label", dc, [
                i[34] || (i[34] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                g(d(rt), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (v) => e.state.release_when.approvals = v ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              g(Jt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (v) => e.state.release_when.wait = v),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (v, m) => l("validity", m, v))
              }, null, 8, ["modelValue"]),
              g(_l, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (v) => e.state.release_when.when = v),
                onValidity: i[5] || (i[5] = (v) => l("validity", "release", v))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : S("", !0),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", uc, [
        i[36] || (i[36] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        g(Ao, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", cc, [
        i[37] || (i[37] = s("span", { class: "work-spacer" }, [
          q("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        g(Ao, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      g($t, {
        label: "Required fields",
        options: e.draft.fields?.map((v) => ({ value: v.code, label: v.title || v.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (v) => e.state.require = v)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), Y(Jt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (v) => e.state.due = v),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (v, m) => l("validity", m, v))
      }, null, 8, ["modelValue"])) : S("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), b(le, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", vc, [
          i[38] || (i[38] = q("Run label", -1)),
          g(d(De), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (v) => e.state.run.stage = v),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        g(Du, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (v) => e.state.run.flow_ref = v),
          onValidity: i[11] || (i[11] = (v) => l("validity", "flow", v))
        }, null, 8, ["modelValue"]),
        g(Jt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (v) => e.state.run.timeout = v),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (v, m) => l("validity", m, v))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", fc, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          g(d(Dt), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (v) => e.state.run.max_visits = v ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", mc, [
          i[40] || (i[40] = q("When visits are exhausted", -1)),
          g(d(fe), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((v) => !v.auto).map((v) => ({ label: d(Ke)(v), value: v.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (v) => e.state.run.on_exhausted = v || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", pc, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          g(d(rt), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (v) => e.state.run.retry = v ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), b(le, { key: 0 }, [
          s("label", bc, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            g(d(Dt), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (v) => e.state.run.retry.max = v),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          g(Jt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (v) => e.state.run.retry.backoff = v),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (v, m) => l("validity", m, v))
          }, null, 8, ["modelValue"])
        ], 64)) : S("", !0),
        (n(), b(le, null, de([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (v) => s("label", {
          key: v.key,
          class: "work-stack work-tight"
        }, [
          q(T(v.label), 1),
          g(d(fe), {
            "model-value": e.state.run[v.key],
            "aria-label": v.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((m) => ({ label: d(Ke)(m), value: m.id })),
            "onUpdate:modelValue": (m) => e.state.run[v.key] = m || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", hc, [
          i[43] || (i[43] = q("If it fails, go to", -1)),
          g(d(fe), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": u,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((v) => ({
              label: d(Ke)(v) + " → " + d(be)(e.process.states.find((m) => m.id === v.to)),
              value: v.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        g(Le, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: H(() => [
            s("div", gc, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              g(Jt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (v) => (e.draft.policy ??= {}).stage_timeout = v),
                onValidity: i[21] || (i[21] = (v, m) => l("validity", m, v))
              }, null, 8, ["model-value"]),
              s("label", yc, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                g(d(Dt), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (v) => (e.draft.policy ??= {}).stage_max_visits = v ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : S("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), b(le, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), b(le, null, de(e.state.regions, (v, m) => (n(), b("div", {
          key: m,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", kc, [
            s("span", null, "Lane " + T(m + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            g(d(ae), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (w) => e.state.regions.splice(m, 1)
            }, {
              default: H(() => [
                g(d(ve), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", wc, [
            i[50] || (i[50] = q("Starts at", -1)),
            g(d(fe), {
              "aria-label": "Lane starts at",
              modelValue: v.initial,
              "onUpdate:modelValue": (w) => v.initial = w,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((w) => w.id !== e.state.id).map((w) => ({ label: d(be)(w), value: w.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        g(d(ae), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (v) => e.state.regions.push({
            id: d(da)("region", e.state.regions),
            initial: e.process.states.find((m) => m.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: H(() => [
            g(d(ve), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", $c, [
          i[51] || (i[51] = q("Finish rule", -1)),
          g(d(fe), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (v) => e.state.join = v === "count" ? 1 : v)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), b("label", Vc, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          g(d(Dt), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (v) => e.state.join = v),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : S("", !0)
      ], 64)) : S("", !0),
      g(Le, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: H(() => [
          s("div", xc, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", Cc, [
              i[54] || (i[54] = q("Stage label", -1)),
              g(d(De), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (v) => e.state.stage = v || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), b(le, { key: 0 }, [
              s("label", Sc, [
                g(d(rt), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (v) => e.state.awaiting = v ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = q("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), Y(Hu, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (v) => e.state.awaiting = v),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (v) => l("validity", "awaiting", v))
              }, null, 8, ["modelValue", "draft", "board-id"])) : S("", !0)
            ], 64)) : S("", !0),
            g(eo, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (v) => e.state.assign = v),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            g(jt, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (v) => e.state.invariants = v),
              onValidity: i[32] || (i[32] = (v) => l("validity", "invariants", v))
            }, null, 8, ["model-value"]),
            g(Wu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (v, m) => l("validity", "timer-" + v, m))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Ic = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Dc = { key: 1 }, Uc = { class: "work-muted" }, Ec = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Ac = ["aria-label", "aria-keyshortcuts", "onKeydown"], Pc = { class: "work-row" }, Oc = {
  key: 0,
  class: "work-stack work-tight"
}, Rc = { class: "work-process-meaning" }, Nc = {
  key: 1,
  class: "work-muted"
}, Mc = { class: "work-stack work-tight" }, Fc = { class: "work-next-transition work-stack work-tight" }, Lc = { class: "work-row work-wrap" }, Bc = { class: "work-process-inspector-foot" }, zc = { class: "work-row work-transition-actions" }, jc = { class: "work-process-meaning" }, Wc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, qc = { class: "work-stack work-tight" }, Gc = { class: "work-stack" }, Kc = { class: "work-stack work-tight" }, Hc = {
  key: 0,
  class: "work-muted"
}, Yc = { class: "work-stack work-tight" }, Xc = { class: "work-dialog-actions" }, Jc = /* @__PURE__ */ Ve({
  __name: "ProcessEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {},
    boardId: {},
    counts: {},
    countTypes: {},
    guards: {},
    createForItemType: { type: Boolean },
    creationOpener: {}
  },
  emits: ["validity", "created", "cancel-creation"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = Yl(Ql, void 0), r = K(() => t.draft.processes ?? []), f = W(!1), u = W(""), c = W(""), i = W(""), v = W("Map"), m = W("");
    Ie(() => t.createForItemType, (N, M) => {
      !N && !M || (u.value = "", f.value = !!N);
    }, { immediate: !0 });
    const w = W(!1), p = W(), y = W(), k = W(), $ = W(), x = W(), V = W(), F = W(!1), I = /* @__PURE__ */ new WeakMap();
    let _;
    async function se() {
      F.value = !0, await It(), x.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    const B = K(() => r.value.find((N) => N.id === c.value) ?? r.value[0]), ue = K(() => {
      const N = p.value, M = B.value, j = N && I.get(N);
      if (!N || !M || !j) return;
      const { entry: ee, continuation: Ce } = j;
      if (!M.transitions?.includes(ee) || ee.to !== N.id) return;
      const Ue = [
        ee.from === "any" ? "Any state" : ee.from.map((et) => be(M.states.find((lt) => lt.id === et))).join(", "),
        be(N)
      ];
      return Ce && M.transitions.includes(Ce) && (Ce.from === "any" || Ce.from.includes(N.id)) && Ue.push(be(M.states.find((et) => et.id === Ce.to))), Ue.join(" → ");
    }), me = W(!1);
    function ke(N) {
      me.value = !0, v.value = N;
    }
    function ce() {
      !me.value && $.value?.clientWidth && (v.value = $.value.clientWidth < 480 && (B.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let ie;
    Ra(() => {
      ce(), $.value && typeof ResizeObserver < "u" && (ie = new ResizeObserver(ce), ie.observe($.value));
    }), At(() => ie?.disconnect()), Ie(B, () => {
      me.value = !1, ce();
    });
    function E() {
      F.value = !1, w.value = !1, p.value = void 0, y.value = void 0, i.value = "", _ = void 0;
    }
    async function te() {
      const N = _, M = o?.selected.value;
      M?.startsWith("workflow/") && o?.choose("workflow", M.slice(9), !1), E(), await It(), N?.isConnected ? N.focus() : z();
    }
    function z() {
      v.value === "Map" ? k.value?.focus() : V.value?.focus();
    }
    async function pe() {
      await It(), x.value && (x.value.scrollTop = 0, x.value.focus({ preventScroll: !0 }), (x.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && x.value.scrollIntoView?.({ block: "nearest" }));
    }
    function X(N, M) {
      _ = M, F.value = !1, w.value = !1, p.value = N, y.value = void 0, m.value = "", i.value = "", B.value && o?.choose("workflow", B.value.id + ".state." + N.id, !0), pe();
    }
    async function L(N) {
      m.value = "", w.value = N, await It();
      const M = N ? '[role="combobox"]' : "button";
      x.value?.querySelector(".work-next-transition " + M)?.focus();
    }
    function C(N, M) {
      _ = M, F.value = !1, y.value = N, p.value = void 0, i.value = "", B.value && o?.choose("workflow", B.value.id + ".transition." + N.id, !0), pe();
    }
    Ie([B, v], E), Ie([() => o?.selected.value, r], async ([N], M) => {
      if (!N?.startsWith("workflow/")) {
        M?.[0]?.startsWith("workflow/") && E();
        return;
      }
      const [j, ee, Ce] = N.slice(9).split("."), Ue = r.value.find((Qe) => Qe.id === j);
      if (!Ue || B.value !== Ue && (c.value = Ue.id, await It(), o?.selected.value !== N))
        return;
      const et = ee === "state" ? Ue.states.find((Qe) => Qe.id === Ce) : void 0, lt = ee === "transition" ? Ue.transitions?.find((Qe) => Qe.id === Ce) : void 0;
      et === p.value && lt === y.value || (E(), p.value = et, y.value = lt);
    }, { immediate: !0, flush: "post" });
    const O = K(() => {
      if (!t.counts || !B.value) return;
      const N = t.countTypes?.filter((M) => M.process === B.value?.id) ?? [];
      return Object.fromEntries(B.value.states.map((M) => [
        M.id,
        N.reduce((j, ee) => j + (t.counts?.[ee.id]?.[M.id] ?? 0), 0)
      ]));
    }), D = K(() => (t.guards ?? []).filter((N) => t.draft.plugins?.some((M) => M.use === N.plugin))), J = K(() => Object.keys(t.draft.policy?.wip ?? {}).filter((N) => !r.value.some((M) => M.states.some((j) => j.id === N))));
    function h() {
      const N = u.value.trim();
      if (!N) return;
      const M = N.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", j = (/^[a-z]/.test(M) ? M : "process_" + M).slice(0, 40), ee = r.value.some((Ce) => Ce.id === j) ? da(j, r.value) : j;
      (t.draft.processes ??= []).push({ id: ee, name: N, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), c.value = ee, u.value = "", f.value = !1, l("created", ee);
    }
    function U() {
      f.value = !1, l("cancel-creation");
    }
    async function re(N, M) {
      const j = { id: da("state", N.states), name: "New state", category: "started" }, ee = Ya(N), Ce = ee.at(-1), Ue = p.value ?? (Ce?.category === "completed" ? ee.at(-2) : Ce), et = Ue ? N.states.indexOf(Ue) : -1, lt = Ue ? et + 1 : N.states.length, Qe = Ue && N.transitions?.filter((je) => je.from !== "any" && je.from.length === 1 && je.from[0] === Ue.id && !go(N, je).length), He = Qe?.find((je) => je.default) ?? Qe?.find((je) => N.states.findIndex((ot) => ot.id === je.to) > et);
      N.states.splice(lt, 0, j);
      const Ee = N.states[lt];
      if (Ue && Ue.category !== "completed" && Ue.category !== "canceled") {
        const je = N.transitions ??= [], ot = He?.auto === !0 && He.default === !0, bt = {
          id: da("transition", je),
          name: "Continue",
          from: [He ? Ee.id : Ue.id],
          to: He?.to ?? Ee.id,
          ...ot ? { auto: !0, default: !0 } : {}
        };
        He && (He.to = Ee.id), je.push(bt);
        const Ot = je[je.length - 1];
        I.set(Ee, { entry: He ?? Ot, continuation: He ? Ot : void 0, automatic: ot });
      }
      X(Ee, M), await se();
    }
    function Z(N, M) {
      const j = I.get(N), ee = j?.continuation;
      !ee || j.automatic || ee.from === "any" || ee.from.length !== 1 || ee.from[0] !== N.id || (M === "gate" ? (ee.auto = !0, ee.default = !0) : (delete ee.auto, delete ee.default));
    }
    function $e(N, M, j = _) {
      const ee = B.value;
      if (!ee || !M || N === M) return;
      const Ce = ee.transitions ??= [], Ue = `to_${M}`;
      let et = Ue.slice(0, 40), lt = 2;
      for (; Ce.some((He) => He.id === et); ) {
        const He = `_${lt++}`;
        et = Ue.slice(0, 40 - He.length) + He;
      }
      const Qe = { id: et, name: `To ${be(ee.states.find((He) => He.id === M)).toLowerCase()}`, from: [N], to: M };
      Ce.push(Qe), C(Qe, j);
    }
    function xe(N, M) {
      const j = p.value ?? N.states.find((Ue) => Ue.id === N.initial) ?? N.states[0], ee = N.states.find((Ue) => Ue.id !== j?.id);
      if (!j || !ee) return;
      const Ce = { id: da("transition", N.transitions ?? []), name: "To " + be(ee), from: [j.id], to: ee.id };
      (N.transitions ??= []).push(Ce), C(Ce, M);
    }
    async function Pe(N) {
      const M = B.value, j = M?.transitions?.indexOf(N) ?? -1;
      if (!M || j < 0) return;
      const ee = go(M, N);
      if (ee.length) {
        i.value = `Used by ${ee.join(", ")}. Update those references first.`;
        return;
      }
      M.transitions.splice(j, 1), E(), await It(), z();
    }
    function R(N) {
      !y.value || N.defaultPrevented || N.repeat || (N.preventDefault(), Pe(y.value));
    }
    function ne(N, M) {
      const j = Hi(N, M);
      if (j.length) {
        i.value = `${be(M)} is used by ${j.join(", ")}. Update these references first.`;
        return;
      }
      N.states.splice(N.states.indexOf(M), 1), te();
    }
    async function A(N) {
      const M = t.draft.item_types?.filter((ee) => ee.process === N.id).map((ee) => ee.title || "Untitled item type") ?? [];
      if (M.length) {
        i.value = `Used by ${M.join(", ")}. Choose a different process for those item types first.`;
        return;
      }
      const j = await t.guardRemoval?.("processes", N.id);
      if (j) {
        i.value = j;
        return;
      }
      Na(t.draft, "processes", N.id), c.value = "", E();
    }
    return (N, M) => (n(), b("section", {
      ref_key: "editor",
      ref: $,
      class: "work-process-editor work-stack",
      "aria-label": "Process editor",
      onKeydown: M[17] || (M[17] = Ye((j) => x.value && te(), ["esc"]))
    }, [
      i.value && !y.value ? (n(), b("p", Ic, T(i.value), 1)) : S("", !0),
      (n(!0), b(le, null, de(e.issues?.filter((j) => j.code === "process " + B.value?.id) ?? [], (j) => (n(), b("p", {
        key: j.what + j.detail,
        class: "work-error work-small",
        role: "alert"
      }, T(d(nl)(j)) + " · " + T(j.what), 1))), 128)),
      B.value ? (n(), b("div", {
        key: 1,
        class: wt(["work-process-builder", { "work-process-inspecting": p.value || y.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: V,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Process tools",
          tabindex: "-1"
        }, [
          r.value.length > 1 ? (n(), Y(d(fe), {
            key: 0,
            "model-value": B.value.id,
            "aria-label": "Process",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: r.value.map((j) => ({ label: j.name || "Untitled process", value: j.id })),
            "onUpdate:modelValue": M[0] || (M[0] = (j) => c.value = j)
          }, null, 8, ["model-value", "options"])) : (n(), b("strong", Dc, T(B.value.name || "Untitled process"), 1)),
          g(d(ae), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: M[1] || (M[1] = (j) => re(B.value, j.currentTarget))
          }, {
            icon: H(() => [
              g(d(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          g(d(ae), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: B.value.states.length < 2,
            onClick: M[2] || (M[2] = (j) => xe(B.value, j.currentTarget))
          }, null, 8, ["disabled"]),
          g(d(fe), {
            modelValue: B.value.initial,
            "onUpdate:modelValue": M[3] || (M[3] = (j) => B.value.initial = j),
            "aria-label": "Starts in " + d(be)(B.value.states.find((j) => j.id === B.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: B.value.states.map((j) => ({ label: d(be)(j), value: j.id }))
          }, {
            value: H(() => [
              s("span", Uc, "Starts in " + T(d(be)(B.value.states.find((j) => j.id === B.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          M[18] || (M[18] = s("span", { class: "work-spacer" }, null, -1)),
          v.value === "Map" ? (n(), b("div", Ec, [
            g(d(ae), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: M[4] || (M[4] = (j) => k.value?.fit())
            }, {
              icon: H(() => [
                g(d(ve), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            v.value === "Map" ? (n(), Y(d(ae), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: M[5] || (M[5] = (j) => k.value?.zoomOut())
            }, {
              default: H(() => [
                g(d(ve), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : S("", !0),
            v.value === "Map" ? (n(), Y(d(ae), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: M[6] || (M[6] = (j) => k.value?.zoomIn())
            }, {
              default: H(() => [
                g(d(ve), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : S("", !0)
          ])) : S("", !0),
          g(d(Jl), {
            "model-value": v.value,
            "onUpdate:modelValue": ke,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Process layout"
          }, null, 8, ["model-value"]),
          g(d(ae), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: M[7] || (M[7] = (j) => f.value = !0)
          }, {
            icon: H(() => [
              g(d(ve), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        v.value === "Map" ? (n(), Y(Od, {
          key: 0,
          ref_key: "graph",
          ref: k,
          process: B.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": p.value,
          "selected-transition": y.value,
          onState: X,
          onTransition: C,
          onRemoveTransition: R,
          onConnect: $e,
          onClear: te
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), Y(iu, {
          key: 1,
          process: B.value,
          draft: e.draft,
          guards: D.value,
          "selected-state": p.value,
          "selected-transition": y.value,
          counts: O.value,
          onState: X,
          onTransition: C,
          onRemoveState: M[8] || (M[8] = (j) => ne(B.value, j)),
          onRemoveTransition: Pe
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        g(Lo, { name: "work-panel" }, {
          default: H(() => [
            p.value || y.value ? (n(), b("aside", {
              key: 0,
              ref_key: "inspector",
              ref: x,
              class: "work-process-sideform",
              tabindex: "-1",
              "aria-label": p.value ? "State inspector" : "Transition inspector",
              "aria-keyshortcuts": y.value ? "Delete Backspace" : void 0,
              onKeydown: [
                Ye(Me(R, ["self"]), ["delete"]),
                Ye(Me(R, ["self"]), ["backspace"])
              ]
            }, [
              (n(!0), b(le, null, de(p.value ? [p.value] : [], (j) => (n(), b(le, {
                key: j.id
              }, [
                s("header", Pc, [
                  F.value ? (n(), Y(d(De), {
                    key: 1,
                    modelValue: j.name,
                    "onUpdate:modelValue": (ee) => j.name = ee,
                    class: "work-process-name",
                    "aria-label": "State name",
                    onBlur: M[9] || (M[9] = (ee) => F.value = !1)
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), Y(Zl, {
                    key: 0,
                    class: "work-process-state-title",
                    "aria-label": "Rename state",
                    onActivate: se
                  }, {
                    default: H(() => [
                      s("span", null, T(d(be)(j)), 1)
                    ]),
                    _: 2
                  }, 1024)),
                  g(d(ae), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close state editor",
                    onClick: te
                  }, {
                    default: H(() => [
                      g(d(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                ue.value ? (n(), b("div", Oc, [
                  M[19] || (M[19] = s("p", { class: "work-field-label" }, "New route", -1)),
                  s("p", null, T(ue.value), 1)
                ])) : S("", !0),
                s("p", Rc, T(d(Ki)(j, e.draft)), 1),
                O.value ? (n(), b("p", Nc, T(O.value[j.id] ?? 0) + " " + T(O.value[j.id] === 1 ? "item" : "items") + " currently here", 1)) : S("", !0),
                g(Tc, {
                  state: j,
                  process: B.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  onKind: (ee) => Z(j, ee),
                  onValidity: (ee, Ce) => l("validity", ee.includes("duration:") ? ee : B.value.id + ":" + j.id + ":" + ee, Ce)
                }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
                s("label", Mc, [
                  M[20] || (M[20] = q("Phase", -1)),
                  g(d(fe), {
                    "aria-label": "Phase",
                    modelValue: j.category,
                    "onUpdate:modelValue": (ee) => j.category = ee,
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    options: ["triage", "backlog", ...d(qo)].map((ee) => ({ label: d(Wt)(ee), value: ee }))
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                ]),
                s("div", Fc, [
                  w.value ? (n(), b(le, { key: 1 }, [
                    g(d(fe), {
                      modelValue: m.value,
                      "onUpdate:modelValue": M[11] || (M[11] = (ee) => m.value = ee),
                      "aria-label": "Next state",
                      placeholder: "Choose the next state",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: B.value.states.filter((ee) => ee !== j).map((ee) => ({ label: d(be)(ee), value: ee.id }))
                    }, null, 8, ["modelValue", "options"]),
                    s("div", Lc, [
                      g(d(ae), {
                        label: "Add transition",
                        size: "small",
                        disabled: !m.value,
                        onClick: (ee) => $e(j.id, m.value)
                      }, null, 8, ["disabled", "onClick"]),
                      g(d(ae), {
                        label: "Cancel",
                        severity: "secondary",
                        text: "",
                        size: "small",
                        onClick: M[12] || (M[12] = (ee) => L(!1))
                      })
                    ])
                  ], 64)) : (n(), Y(d(ae), {
                    key: 0,
                    label: "Add transition",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    "aria-expanded": "false",
                    disabled: B.value.states.length < 2,
                    onClick: M[10] || (M[10] = (ee) => L(!0))
                  }, {
                    icon: H(() => [
                      g(d(ve), {
                        icon: "tabler:plus",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"]))
                ]),
                s("footer", Bc, [
                  g(d(ae), {
                    label: "Remove state",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (ee) => ne(B.value, j)
                  }, {
                    icon: H(() => [
                      g(d(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ], 64))), 128)),
              (n(!0), b(le, null, de(y.value ? [y.value] : [], (j) => (n(), b(le, {
                key: j.id
              }, [
                s("header", zc, [
                  M[21] || (M[21] = s("h3", null, "Transition", -1)),
                  g(d(ae), {
                    type: "button",
                    label: "Remove transition",
                    severity: "danger",
                    text: "",
                    size: "small",
                    onClick: (ee) => Pe(j)
                  }, {
                    icon: H(() => [
                      g(d(ve), { icon: "tabler:trash" })
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  g(d(ae), {
                    severity: "secondary",
                    text: "",
                    size: "small",
                    "aria-label": "Close transition editor",
                    onClick: te
                  }, {
                    default: H(() => [
                      g(d(ve), { icon: "tabler:x" })
                    ]),
                    _: 1
                  })
                ]),
                s("p", jc, T(j.from === "any" ? "Any state" : j.from.map((ee) => d(be)(B.value.states.find((Ce) => Ce.id === ee))).join(", ")) + " → " + T(d(be)(B.value.states.find((ee) => ee.id === j.to))), 1),
                g(bi, {
                  transition: j,
                  process: B.value,
                  draft: e.draft,
                  guards: D.value
                }, null, 8, ["transition", "process", "draft", "guards"]),
                i.value ? (n(), b("p", Wc, T(i.value), 1)) : S("", !0),
                s("label", qc, [
                  M[22] || (M[22] = q("Name", -1)),
                  g(d(De), {
                    modelValue: j.name,
                    "onUpdate:modelValue": (ee) => j.name = ee,
                    placeholder: d(Ke)(j),
                    "aria-label": "Transition name"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                g(hu, {
                  transition: j,
                  process: B.value,
                  draft: e.draft,
                  "board-id": e.boardId,
                  guards: D.value,
                  onValidity: (ee, Ce) => l("validity", B.value.id + ":transition-" + j.id + ":" + ee, Ce)
                }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
              ], 64))), 128))
            ], 40, Ac)) : S("", !0)
          ]),
          _: 1
        })
      ], 2)) : (n(), Y(d(ae), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: M[13] || (M[13] = (j) => f.value = !0)
      }, {
        icon: H(() => [
          g(d(ve), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      B.value ? (n(), Y(Le, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: H(() => [
          s("div", Gc, [
            g(Le, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: H(() => [...M[23] || (M[23] = [
                s("p", null, [
                  q("Workflow definitions are "),
                  s("code", null, "processes"),
                  q(" in "),
                  s("code", null, "WorkGetSchema"),
                  q(" and "),
                  s("code", null, "WorkApplySchema"),
                  q(".")
                ], -1)
              ])]),
              _: 1
            }),
            s("label", Kc, [
              M[24] || (M[24] = q("Workflow name", -1)),
              g(d(De), {
                modelValue: B.value.name,
                "onUpdate:modelValue": M[14] || (M[14] = (j) => B.value.name = j),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            J.value.length ? (n(), b("p", Hc, "Some item limits belong to removed states.")) : S("", !0),
            (n(!0), b(le, null, de(J.value, (j, ee) => (n(), Y(d(ae), {
              key: j,
              label: "Clear limit for removed state " + (ee + 1),
              severity: "secondary",
              text: "",
              onClick: (Ce) => delete e.draft.policy.wip[j]
            }, null, 8, ["label", "onClick"]))), 128)),
            g(d(ae), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: M[15] || (M[15] = (j) => A(B.value))
            })
          ])
        ]),
        _: 1
      })) : S("", !0),
      g(Rl, {
        visible: f.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: U
      }, {
        default: H(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Me(h, ["stop", "prevent"])
          }, [
            M[26] || (M[26] = s("h2", null, "New process", -1)),
            s("label", Yc, [
              M[25] || (M[25] = q("Name", -1)),
              g(d(De), {
                modelValue: u.value,
                "onUpdate:modelValue": M[16] || (M[16] = (j) => u.value = j),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Xc, [
              g(d(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: U
              }),
              g(d(ae), {
                label: "Create process",
                type: "submit",
                disabled: !u.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "return-focus"])
    ], 544));
  }
}), Zc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Qc = {
  key: 0,
  class: "work-stack work-tight"
}, _c = { class: "work-row" }, ev = /* @__PURE__ */ Ve({
  __name: "ProcessMigration",
  props: {
    removed: {},
    renamed: {},
    disabled: { type: Boolean },
    confirmed: { type: Boolean }
  },
  emits: ["destination", "update:confirmed"],
  setup(e) {
    const a = (t) => t + (t === 1 ? " item" : " items");
    return (t, l) => (n(), b("section", Zc, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), b(le, null, de(e.removed, ({ process: o, state: r, count: f }) => (n(), b("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        q(" Move " + T(a(f)) + " from " + T(d(be)(r)) + " to ", 1),
        g(d(fe), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + d(be)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((u) => ({ label: d(be)(u), value: u.id })),
          "onUpdate:modelValue": (u) => t.$emit("destination", o, r.id, u)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), b("div", Qc, [
        (n(!0), b(le, null, de(e.renamed, ({ process: o, state: r, count: f, name: u }) => (n(), b("p", {
          key: o.id + "/" + r.id
        }, [
          q(T(d(be)(r)) + " becomes ", 1),
          s("strong", null, T(u), 1),
          q(" for " + T(a(f)) + ". ", 1)
        ]))), 128)),
        s("label", _c, [
          g(d(Zt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = q(" Keep these items in their renamed states ", -1))
        ])
      ])) : S("", !0)
    ]));
  }
}), tv = {
  class: "work-stack",
  "aria-label": "Links editor"
}, av = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, lv = { class: "work-definition-meta work-muted work-small" }, ov = { class: "work-settings-grid" }, iv = { class: "work-stack work-tight" }, nv = { class: "work-stack work-tight" }, sv = { class: "work-stack work-tight" }, rv = { class: "work-row" }, dv = {
  key: 0,
  class: "work-muted work-small"
}, uv = {
  key: 1,
  class: "work-settings-grid"
}, cv = { class: "work-stack work-tight" }, vv = {
  key: 0,
  class: "work-chips"
}, fv = { class: "work-stack work-tight" }, mv = { class: "work-relation-preview work-small" }, pv = { class: "work-muted" }, bv = {
  key: 0,
  class: "kx-empty"
}, hv = /* @__PURE__ */ Ve({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = K(() => a.draft.relation_types ?? []), l = K(() => (a.draft.item_types ?? []).map((w) => ({ value: w.id, label: w.title || Re(w.id) })));
    function o(w, p, y) {
      y.length ? w[p] = y : delete w[p];
    }
    function r(w, p) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(p)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (w.to_types?.includes(p)) return "This ID is already in use.";
    }
    function f(w, p) {
      o(w, "to_types", [...w.to_types ?? [], p]);
    }
    const u = W(""), c = W(!1);
    function i(w) {
      const p = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), y = (/^[a-z]/.test(p) ? p : "link_" + (p || "new")).slice(0, 40);
      let k = y, $ = 2;
      for (; t.value.some((x) => x.id === k); ) {
        const x = "_" + $++;
        k = y.slice(0, 40 - x.length) + x;
      }
      return k;
    }
    function v(w) {
      (a.draft.relation_types ??= []).push({ id: i(w), outward: w, inward: w, cardinality: "many" });
    }
    async function m(w) {
      if (!c.value) {
        c.value = !0, u.value = "";
        try {
          const p = await a.guardRemoval?.("relation_types", w);
          p ? u.value = p : Na(a.draft, "relation_types", w);
        } finally {
          c.value = !1;
        }
      }
    }
    return (w, p) => (n(), b("section", tv, [
      u.value ? (n(), b("p", av, T(u.value), 1)) : S("", !0),
      g(rl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: H(() => [
          (n(!0), b(le, null, de(t.value, (y, k) => (n(), Y(sl, {
            "route-section": "links",
            "route-id": y.id,
            title: y.outward || d(Re)(y.id),
            kind: y.symmetric ? "Same both ways" : "Different each way",
            key: k,
            class: "work-stack"
          }, {
            usage: H(() => [
              s("span", lv, T(y.outward || "Related work") + " · " + T(y.inward || "Reverse relation"), 1)
            ]),
            actions: H(() => [
              g(d(ae), {
                severity: "secondary",
                text: "",
                disabled: c.value,
                onClick: ($) => m(y.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: H(() => [
                  g(d(ve), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: H(() => [
              s("div", ov, [
                s("label", iv, [
                  p[0] || (p[0] = q("Shown on this item ", -1)),
                  g(d(De), {
                    modelValue: y.outward,
                    "onUpdate:modelValue": ($) => y.outward = $,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", nv, [
                  p[1] || (p[1] = q("Shown on the other item ", -1)),
                  g(d(De), {
                    modelValue: y.inward,
                    "onUpdate:modelValue": ($) => y.inward = $,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", sv, [
                  p[2] || (p[2] = q("Links allowed ", -1)),
                  g(d(fe), {
                    "model-value": y.cardinality ?? "many",
                    "onUpdate:modelValue": ($) => y.cardinality = $,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", rv, [
                  g(d(Zt), {
                    modelValue: y.symmetric,
                    "onUpdate:modelValue": ($) => y.symmetric = $,
                    disabled: !!(y.from_types?.length || y.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p[3] || (p[3] = q("Same meaning in both directions ", -1))
                ])
              ]),
              y.from_types?.length || y.to_types?.length ? (n(), b("p", dv, " Clear the source and target types to use the same meaning in both directions. ")) : S("", !0),
              y.symmetric ? S("", !0) : (n(), b("div", uv, [
                g($t, {
                  label: "Source item types",
                  options: l.value,
                  "model-value": y.from_types,
                  "onUpdate:modelValue": ($) => o(y, "from_types", $)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", cv, [
                  p[4] || (p[4] = s("p", { class: "work-muted work-small" }, "Use the type ID from this board or a peer board. Leave either end empty to allow any type there.", -1)),
                  y.to_types?.length ? (n(), b("div", vv, [
                    (n(!0), b(le, null, de(y.to_types, ($) => (n(), Y(d(ae), {
                      key: $,
                      severity: "secondary",
                      text: "",
                      size: "small",
                      label: $ + " ×",
                      "aria-label": "Remove target type " + $,
                      onClick: (x) => o(y, "to_types", y.to_types.filter((V) => V !== $))
                    }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                  ])) : S("", !0),
                  g(Pa, {
                    action: "Add target type",
                    label: "Target type ID",
                    maxlength: 40,
                    validate: ($) => r(y, $),
                    onAdd: ($) => f(y, $)
                  }, null, 8, ["validate", "onAdd"])
                ])
              ])),
              g(Le, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: H(() => [
                  s("label", fv, [
                    p[5] || (p[5] = q("Identifier ", -1)),
                    g(d(De), {
                      modelValue: y.id,
                      "onUpdate:modelValue": ($) => y.id = $,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", mv, [
                p[6] || (p[6] = s("strong", null, "This item", -1)),
                q(" " + T(y.outward || "relates to") + " ", 1),
                p[7] || (p[7] = s("strong", null, "another item", -1)),
                s("span", pv, " · reverse: " + T(y.symmetric ? y.outward : y.inward), 1)
              ])
            ]),
            _: 2
          }, 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? S("", !0) : (n(), b("p", bv, "No link types yet. Add one to connect related work.")),
          g(Pa, {
            action: "Add link type",
            label: "Link name",
            onAdd: v
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
});
function hi(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function Oo(e, a) {
  const t = hi(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function gv(e, a) {
  const t = a?.lifecycle.error, l = a?.problem ?? e.problem;
  if (e.installed === !1)
    return { kind: "missing", status: "Not installed", cause: "This board still references a plugin that is no longer installed." };
  if (l?.code === "plugin_config_invalid" || t?.code === "plugin_config_invalid")
    return { kind: "configuration", status: "Misconfigured", cause: l?.message ?? t?.message };
  if (l) return { kind: "manifest", status: "Plugin unavailable", cause: l.message };
  if (t?.source === "schema_provider")
    return { kind: "provider", status: "Schema provider failed", cause: t.message };
  if (t?.code === "plugin_projection_gap")
    return { kind: "history", status: "History gap", cause: t.message, floor: t.floor };
  if (a?.lifecycle.state === "failed")
    return { kind: "setup", status: "Attachment setup failed", cause: t?.message ?? "Work could not prepare the plugin attachment." };
  const o = Object.values(a?.projections ?? {});
  if (o.some((r) => r.parked)) return { kind: "reset", status: "Needs reset" };
  if (o.some(hi)) return { kind: "degraded", status: "Degraded" };
}
const yv = {
  class: "work-stack",
  "aria-label": "Plugins editor"
}, kv = {
  key: 0,
  class: "kx-loading"
}, wv = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, $v = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Vv = { class: "work-block work-small work-error" }, xv = {
  key: 0,
  class: "work-muted work-small"
}, Cv = {
  key: 1,
  class: "work-notice"
}, Sv = {
  key: 2,
  class: "work-stack work-tight work-plugin-status"
}, Tv = {
  key: 0,
  class: "work-muted"
}, Iv = { key: 1 }, Dv = {
  key: 2,
  class: "work-row"
}, Uv = {
  key: 3,
  class: "work-row"
}, Ev = {
  key: 0,
  class: "work-small"
}, Av = {
  key: 6,
  class: "work-row"
}, Pv = {
  key: 7,
  class: "work-row"
}, Ov = {
  key: 8,
  class: "work-row"
}, Rv = { class: "work-stack work-tight" }, Nv = { key: 0 }, Mv = { key: 1 }, Fv = { key: 2 }, Lv = {
  key: 4,
  class: "work-stack work-tight"
}, Bv = {
  key: 0,
  class: "work-muted"
}, zv = { class: "work-form-actions" }, jv = "kickside.work.planning:plugin", Ro = /* @__PURE__ */ Ve({
  __name: "PluginsEditor",
  props: /* @__PURE__ */ po({
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {}
  }, {
    activeConfigs: { default: () => ({}) },
    activeConfigsModifiers: {}
  }),
  emits: /* @__PURE__ */ po(["configured", "refresh", "review", "validity"], ["update:activeConfigs"]),
  setup(e, { emit: a }) {
    const t = e, l = a, o = Ni(e, "activeConfigs"), r = W(""), f = W(""), u = W(""), c = W(/* @__PURE__ */ new Set()), i = W({}), v = W(/* @__PURE__ */ new Set()), m = K(() => t.options.map((X) => {
      const L = se(X.plugin);
      return { plugin: X, current: L, issue: gv(X, L) };
    })), w = K(() => !!r.value || t.disabled), p = K(() => w.value || t.activationLocked), y = {}, k = K(() => (t.draft.item_types ?? []).filter((X) => !["issue", "sprint", "milestone"].includes(X.id)).map((X) => ({ value: X.id, label: X.title || Re(X.id) }))), $ = K(() => ["current_sprint", "milestone"].every((X) => t.schema.compiled?.fields?.some((L) => L.code === X))), x = K(() => {
      const X = t.filters;
      return X ? (t.draft.scopes ?? []).filter((L) => !X.some((C) => C.id === L && t.options.some((O) => O.plugin === C.plugin))) : [];
    });
    function V(X) {
      return (t.filters ?? []).filter((L) => L.plugin === X);
    }
    function F(X, L) {
      const C = new Set(V(X).map((J) => J.id)), O = t.draft.scopes ?? [], D = [...O.filter((J) => !C.has(J)), ...L];
      (D.length !== O.length || D.some((J) => !O.includes(J))) && (t.draft.scopes = D);
    }
    function I(X, L) {
      ie(X, { ...ce(X), issue_types: L });
    }
    function _(X) {
      return !!X.config_schema && Ho(X.config_schema).length > 0;
    }
    function se(X) {
      return t.schema.plugins?.find((L) => L.plugin === X);
    }
    function B(X) {
      return se(X)?.active === !0;
    }
    function ue(X) {
      return t.draft.plugins?.some((L) => L.use === X) === !0;
    }
    function me(X, L) {
      const C = t.draft.plugins ?? [];
      L && !ue(X) && (t.draft.plugins = [...C, { use: X }]), L || (t.draft.plugins = C.filter((O) => O.use !== X), delete t.configs[X], c.value.delete(X), l("validity", X, !0), F(X, []));
    }
    function ke(X, L) {
      me(X, !1), l("review", L.currentTarget);
    }
    function ce(X) {
      return B(X) ? o.value[X] ?? se(X)?.config ?? y : t.configs[X] ?? y;
    }
    function ie(X, L) {
      B(X) ? o.value = { ...o.value, [X]: L } : t.configs[X] = L;
    }
    function E(X) {
      if (B(X)) {
        const L = { ...o.value };
        delete L[X], o.value = L;
      } else delete t.configs[X];
    }
    function te(X, L) {
      L ? c.value.delete(X) : c.value.add(X), B(X) || l("validity", X, L);
    }
    async function z(X) {
      await Xo.confirm({
        header: "Reset projection?",
        message: "Resetting can rebuild from current items or replay retained events, depending on the projection.",
        acceptLabel: "Reset projection",
        rejectLabel: "Cancel"
      }) && await pe(X, !0);
    }
    async function pe(X, L = !1) {
      if (!(w.value || !L && c.value.has(X))) {
        r.value = X, f.value = "", u.value = "";
        try {
          L ? await Nt.configure(t.boardId, X) : (await Nt.configure(t.boardId, X, ce(X)), E(X), v.value.delete(X)), u.value = L ? "Plugin recovery started." : "Plugin configuration saved.", l("configured");
        } catch (C) {
          f.value = pt(C, L ? "Could not recover the plugin." : "Could not configure plugin.");
        } finally {
          r.value = "";
        }
      }
    }
    return (X, L) => (n(), b("section", yv, [
      e.options.length ? S("", !0) : (n(), b("p", kv, "No installed plugins are visible to you.")),
      f.value ? (n(), b("div", wv, T(f.value), 1)) : S("", !0),
      u.value ? (n(), b("p", $v, T(u.value), 1)) : S("", !0),
      g(rl, {
        columns: "plugins",
        count: e.options.length
      }, {
        default: H(() => [
          (n(!0), b(le, null, de(m.value, ({ plugin: C, current: O, issue: D }) => (n(), Y(sl, {
            "route-section": "plugins",
            "route-id": C.plugin,
            key: C.plugin,
            title: C.installed === !1 ? C.plugin : C.title || C.plugin,
            description: C.description,
            kind: ue(C.plugin) && c.value.has(C.plugin) ? "Configuration needed" : ue(C.plugin) !== B(C.plugin) ? "Pending review" : D?.status,
            class: "work-stack"
          }, Hl({
            actions: H(() => [
              D?.kind !== "missing" ? (n(), Y(d(rt), {
                key: 0,
                "model-value": ue(C.plugin),
                "aria-label": "Enable " + (C.title || C.plugin),
                disabled: p.value || !!C.problem && !ue(C.plugin),
                "onUpdate:modelValue": (J) => me(C.plugin, J)
              }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])) : S("", !0)
            ]),
            default: H(() => [
              C.requires.length ? (n(), b("p", xv, "Requires " + T(C.requires.map((J) => e.options.find((h) => h.plugin === J)?.title || "Another capability").join(", ")), 1)) : S("", !0),
              O?.outdated ? (n(), b("p", Cv, "The stored declaration differs from the installed plugin. Review activation to update it.")) : S("", !0),
              D || O?.active ? (n(), b("div", Sv, [
                D && "cause" in D ? (n(), b("p", Tv, T(D.cause), 1)) : D ? S("", !0) : (n(), b("p", Iv, T(O?.lifecycle.state === "ready" ? "Ready to use" : "Getting ready"), 1)),
                (n(!0), b(le, null, de(O?.projections, (J, h) => (n(), b("div", {
                  key: h,
                  class: "work-stack work-tight"
                }, [
                  s("p", null, T(d(Oo)(J, e.schema.as_of)) + " · Indexed through " + T(J.last_seq) + " of " + T(e.schema.as_of) + " events.", 1)
                ]))), 128)),
                D?.kind === "setup" && O?.active ? (n(), b("div", Dv, [
                  g(d(ae), {
                    label: "Retry setup",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (J) => pe(C.plugin, !0)
                  }, null, 8, ["disabled", "onClick"])
                ])) : D?.kind === "provider" ? (n(), b("div", Uv, [
                  g(d(ae), {
                    label: "Retry schema check",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: L[0] || (L[0] = (J) => l("refresh"))
                  }, null, 8, ["disabled"])
                ])) : D?.kind === "degraded" ? (n(), Y(Le, {
                  key: 4,
                  class: "work-small",
                  label: "Inspect worker"
                }, {
                  default: H(() => [
                    L[1] || (L[1] = s("p", null, "Check the failing worker before resetting a projection.", -1)),
                    (n(!0), b(le, null, de(O?.projections, (J, h) => (n(), b("p", { key: h }, T(h) + " · " + T(d(Oo)(J, e.schema.as_of)), 1))), 128))
                  ]),
                  _: 2
                }, 1024)) : D?.kind === "history" ? (n(), b(le, { key: 5 }, [
                  D.floor !== void 0 ? (n(), b("p", Ev, "Earliest retained event sequence is " + T(D.floor) + ".", 1)) : S("", !0),
                  g(Le, {
                    class: "work-small",
                    label: "Review retained history"
                  }, {
                    default: H(() => [...L[2] || (L[2] = [
                      s("p", null, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : D?.kind === "reset" ? (n(), b("div", Av, [
                  g(d(ae), {
                    label: "Reset projection",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (J) => z(C.plugin)
                  }, null, 8, ["disabled", "onClick"]),
                  L[3] || (L[3] = s("span", { class: "work-muted work-small" }, "Resolve the worker error before resetting.", -1))
                ])) : D?.kind === "configuration" && ue(C.plugin) && _(C) && !v.value.has(C.plugin) ? (n(), b("div", Pv, [
                  g(d(ae), {
                    label: "Edit configuration",
                    severity: "secondary",
                    outlined: "",
                    disabled: w.value,
                    onClick: (J) => v.value.add(C.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])) : D?.kind === "missing" && ue(C.plugin) ? (n(), b("div", Ov, [
                  g(d(ae), {
                    label: "Review references",
                    severity: "secondary",
                    outlined: "",
                    disabled: p.value,
                    onClick: (J) => ke(C.plugin, J)
                  }, null, 8, ["disabled", "onClick"])
                ])) : S("", !0)
              ])) : S("", !0),
              C.installed ? (n(), Y(Le, {
                key: 3,
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: H(() => [
                  s("dl", Rv, [
                    s("div", null, [
                      L[4] || (L[4] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, T(C.plugin), 1)
                      ])
                    ]),
                    (O?.interface_version ?? C.interface_version) != null ? (n(), b("div", Nv, [
                      L[5] || (L[5] = s("dt", null, "Interface version", -1)),
                      s("dd", null, T(O?.interface_version ?? C.interface_version), 1)
                    ])) : S("", !0),
                    O?.version ? (n(), b("div", Mv, [
                      L[6] || (L[6] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, T(O.version), 1)
                    ])) : S("", !0),
                    L[8] || (L[8] = s("div", null, [
                      s("dt", null, "Configuration tool"),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ])
                    ], -1)),
                    C.tools.length ? (n(), b("div", Fv, [
                      L[7] || (L[7] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), b(le, null, de(C.tools, (J) => (n(), b("code", {
                          key: J,
                          class: "work-block"
                        }, T(J), 1))), 128))
                      ])
                    ])) : S("", !0)
                  ])
                ]),
                _: 2
              }, 1024)) : S("", !0),
              V(C.plugin).length && (ue(C.plugin) || B(C.plugin)) ? (n(), b("section", Lv, [
                L[9] || (L[9] = s("h4", null, "Query filters", -1)),
                L[10] || (L[10] = s("p", { class: "work-muted" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                g($t, {
                  label: "Available filters",
                  disabled: !!r.value || e.disabled || !ue(C.plugin),
                  options: V(C.plugin).map((J) => ({ value: J.id, label: J.title })),
                  "model-value": e.draft.scopes?.filter((J) => V(C.plugin).some((h) => h.id === J)),
                  "onUpdate:modelValue": (J) => F(C.plugin, J)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : S("", !0),
              ue(C.plugin) && _(C) && D?.kind !== "manifest" && D?.kind !== "missing" && (D?.kind !== "configuration" || v.value.has(C.plugin)) ? (n(), Y(fa(D && D.kind !== "configuration" ? Le : "div"), {
                key: 5,
                label: D && D.kind !== "configuration" ? "Plugin settings" : void 0,
                class: "work-stack work-tight"
              }, {
                default: H(() => [
                  C.plugin === jv ? (n(), b(le, { key: 0 }, [
                    $.value ? (n(), Y($t, {
                      key: 1,
                      label: "Plan these item types",
                      options: k.value,
                      "model-value": ce(C.plugin).issue_types,
                      disabled: !!r.value || e.disabled,
                      "onUpdate:modelValue": (J) => I(C.plugin, J)
                    }, null, 8, ["options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), b("p", Bv, "The Planning pack supplies sprint and milestone fields for item types.")),
                    L[11] || (L[11] = s("p", { class: "work-muted" }, "Selected types get Current sprint and Milestone fields.", -1))
                  ], 64)) : (n(), Y(Ko, {
                    key: 1,
                    disabled: !!r.value || e.disabled,
                    schema: C.config_schema,
                    "model-value": ce(C.plugin),
                    "suggest-defaults": "",
                    "onUpdate:modelValue": (J) => ie(C.plugin, J),
                    onValidity: (J) => te(C.plugin, J),
                    onValidationMessage: (J) => i.value[C.plugin] = J
                  }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onValidationMessage"])),
                  s("div", zv, [
                    g(d(ae), {
                      label: D ? "Reset form values" : "Reset",
                      severity: "secondary",
                      outlined: "",
                      disabled: !!r.value || e.disabled,
                      onClick: (J) => E(C.plugin)
                    }, null, 8, ["label", "disabled", "onClick"]),
                    B(C.plugin) ? (n(), Y(d(ae), {
                      key: 0,
                      label: "Save plugin settings",
                      disabled: !!r.value || e.disabled || c.value.has(C.plugin) || !o.value[C.plugin],
                      loading: r.value === C.plugin,
                      onClick: (J) => pe(C.plugin)
                    }, null, 8, ["disabled", "loading", "onClick"])) : S("", !0)
                  ])
                ]),
                _: 2
              }, 1032, ["label"])) : S("", !0)
            ]),
            _: 2
          }, [
            ue(C.plugin) && i.value[C.plugin] ? {
              name: "status",
              fn: H(() => [
                s("span", Vv, T(i.value[C.plugin]), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "description", "kind"]))), 128))
        ]),
        _: 1
      }, 8, ["count"]),
      x.value.length ? (n(), Y(Le, {
        key: 3,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: H(() => [
          L[12] || (L[12] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), b(le, null, de(x.value, (C, O) => (n(), Y(d(ae), {
            key: C,
            label: "Remove unavailable filter " + (O + 1),
            severity: "secondary",
            text: "",
            onClick: (D) => e.draft.scopes = e.draft.scopes?.filter((J) => J !== C)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : S("", !0),
      (n(!0), b(le, null, de(e.draft.plugins?.filter((C) => !e.options.some((O) => O.plugin === C.use)) ?? [], (C) => (n(), b("article", {
        key: C.use,
        class: "work-settings-card work-stack"
      }, [
        s("p", null, [
          s("strong", null, T(C.use), 1),
          L[13] || (L[13] = q(" · Not installed", -1))
        ]),
        L[14] || (L[14] = s("p", { class: "work-muted" }, "This board still references a plugin that is no longer installed.", -1)),
        g(d(ae), {
          label: "Review references",
          severity: "secondary",
          outlined: "",
          disabled: p.value,
          onClick: (O) => ke(C.use, O)
        }, null, 8, ["disabled", "onClick"])
      ]))), 128))
    ]));
  }
}), Wv = { class: "system-section-head" }, qv = { class: "system-section-head-text" }, Gv = {
  key: 0,
  class: "kx-head-actions"
}, Kv = /* @__PURE__ */ Ve({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), b("header", Wv, [
      s("div", qv, [
        s("h1", null, T(e.title), 1),
        s("p", null, T(e.description), 1)
      ]),
      a.$slots.actions ? (n(), b("div", Gv, [
        at(a.$slots, "actions")
      ])) : S("", !0)
    ]));
  }
}), Hv = /* @__PURE__ */ Ve({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), b(le, null, [
      g(d(dt), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      g(d(ae), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: H(() => [
          g(d(ve), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      g(d(ae), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), Yv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Xv = ["config"], Jv = /* @__PURE__ */ Ve({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = W(!1), l = W(!1), o = W("");
    async function r() {
      const u = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const c = await zt("kickside-share");
          if (a.board.board_id !== u.board_id) return;
          c ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    Ie(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const f = K(() => {
      const u = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + u,
        share_url: "/api/v1/component-access/share/" + u
      });
    });
    return (u, c) => (n(), b(le, null, [
      g(d(ae), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: r
      }, {
        icon: H(() => [
          g(d(ve), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), b("p", Yv, T(o.value), 1)) : S("", !0),
      t.value ? (n(), b("kickside-share", {
        key: 1,
        config: f.value,
        onClose: c[0] || (c[0] = (i) => t.value = !1),
        onChanged: c[1] || (c[1] = (i) => u.$emit("shared"))
      }, null, 40, Xv)) : S("", !0)
    ], 64));
  }
}), Zv = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, Qv = { class: "work-stack work-tight" }, _v = {
  key: 0,
  class: "work-settings-list"
}, ef = { class: "work-row-main" }, tf = { class: "work-small work-muted" }, af = { class: "work-row-control" }, lf = { class: "work-row" }, of = /* @__PURE__ */ Ve({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => t.draft.visibility), r = K(() => (t.draft.fields ?? []).filter((m) => m.form === "text" && (!m.cardinality || m.cardinality === "one") && m.type !== "rollup" && m.index !== "number" && m.config?.case !== "insensitive")), f = K(() => r.value.find((m) => m.code === o.value?.field)?.type !== "option");
    function u(m) {
      if (o.value?.levels.some((w) => w.id === m)) return "This level is already in use.";
    }
    function c(m) {
      o.value?.levels.push({ id: m, holders: [] });
    }
    function i(m) {
      if (!m) {
        delete t.draft.visibility;
        return;
      }
      const w = r.value.find((p) => p.code === m);
      t.draft.visibility = { field: m, levels: (w?.options ?? []).map((p) => ({ id: p.id, holders: [] })) };
    }
    function v(m, w) {
      const p = o.value?.levels.find((y) => y.id === m);
      p && (p.holders = w ?? []);
    }
    return (m, w) => (n(), b("section", Zv, [
      w[7] || (w[7] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      w[8] || (w[8] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", Qv, [
        w[5] || (w[5] = q("Visibility field ", -1)),
        g(d(fe), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((p) => ({ label: d(Ze)(p), value: p.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), b(le, { key: 0 }, [
        o.value.levels.length ? (n(), b("div", _v, [
          (n(!0), b(le, null, de(o.value.levels, (p, y) => (n(), b("div", {
            key: p.id,
            class: "work-settings-row"
          }, [
            s("div", ef, [
              s("strong", null, T(r.value.find((k) => k.code === o.value.field)?.options?.find((k) => k.id === p.id)?.label || p.id), 1),
              s("p", tf, "Level " + T(y + 1), 1)
            ]),
            s("div", af, [
              g(_o, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": p.holders,
                "onUpdate:modelValue": (k) => v(p.id, k),
                onValidity: w[0] || (w[0] = (k) => l("validity", k))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : S("", !0),
        f.value ? (n(), Y(Pa, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: u,
          onAdd: c
        })) : S("", !0),
        s("label", lf, [
          g(d(rt), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": w[1] || (w[1] = (p) => p ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          w[6] || (w[6] = q(" Board administrators can see every level ", -1))
        ]),
        g(d(ae), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: w[2] || (w[2] = (p) => delete e.draft.visibility)
        })
      ], 64)) : S("", !0),
      g(jt, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        "onUpdate:modelValue": w[3] || (w[3] = (p) => e.draft.visibility = p),
        onValidity: w[4] || (w[4] = (p) => l("validity", p))
      }, null, 8, ["model-value"])
    ]));
  }
}), nf = { class: "work-ia-section" }, sf = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, rf = { class: "work-settings-row" }, df = { class: "work-row-main" }, uf = {
  key: 0,
  class: "work-muted work-small"
}, cf = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, vf = { class: "work-spacer" }, ff = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, mf = {
  key: 2,
  class: "work-settings-row work-muted"
}, pf = {
  key: 3,
  class: "work-settings-row"
}, bf = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, hf = /* @__PURE__ */ Ve({
  __name: "BoardAccessSettings",
  props: {
    boardId: {},
    draft: {},
    active: { type: Boolean },
    board: {},
    busy: { type: Boolean }
  },
  emits: ["validity"],
  setup(e) {
    const a = e, t = W(), l = W([]), o = K(() => t.value?.filter((y) => y.subject_type === "group").length ?? 0), r = K(() => (t.value?.length ?? 0) - o.value), f = K(() => [...t.value ?? []].sort((y, k) => +!!k.owner - +!!y.owner || k.access_mask - y.access_mask).slice(0, 6).map((y) => ({ ...y, permissions: v(y) }))), u = K(() => f.value.map((y) => ({ id: y.subject_id, kind: y.subject_type ?? "user" }))), c = Yo(() => a.boardId, u);
    function i(y) {
      return y.full_name || c.label({ id: y.subject_id, kind: y.subject_type ?? "user", email: y.email });
    }
    function v(y) {
      return y.owner ? "Owner" : l.value.filter((k) => (y.access_mask & k.bit) === k.bit).map((k) => k.label).join(", ");
    }
    const m = W(!1), w = Ta();
    async function p() {
      const y = w();
      m.value = !1;
      try {
        const [{ data: k }, $] = await Promise.all([
          Nl.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          Nl.get("/api/v1/components/access-model")
        ]);
        if (!y()) return;
        if (!k?.success || !Array.isArray(k.access)) throw new Error("Grants unavailable");
        t.value = k.access, l.value = $.data?.success && Array.isArray($.data.capabilities) ? $.data.capabilities : [];
      } catch {
        y() && (t.value = void 0, m.value = !0);
      }
    }
    return Xl(() => w()), Ie(() => [a.active, a.boardId], () => {
      a.active && p();
    }, { immediate: !0 }), (y, k) => (n(), b("section", nf, [
      s("section", sf, [
        s("div", rf, [
          s("div", df, [
            k[1] || (k[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), b("p", uf, T(r.value) + " " + T(r.value === 1 ? "person" : "people") + " and " + T(o.value) + " " + T(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : S("", !0)
          ]),
          e.board ? (n(), Y(Jv, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: p
          }, null, 8, ["board", "busy"])) : S("", !0)
        ]),
        f.value.length ? (n(), b("ul", cf, [
          (n(!0), b(le, null, de(f.value, ($) => (n(), b("li", {
            key: $.subject_type + $.subject_id,
            class: "work-settings-row"
          }, [
            g(d(ve), {
              icon: $.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", vf, T(i($)), 1),
            $.permissions ? (n(), Y(d(dt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: $.permissions
            }, null, 8, ["value"])) : S("", !0)
          ]))), 128))
        ])) : S("", !0),
        t.value && t.value.length > f.value.length ? (n(), b("p", ff, " See all " + T(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), b("p", mf, "No direct grants yet.")) : m.value ? (n(), b("div", pf, [
          k[2] || (k[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          g(d(ae), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: p
          })
        ])) : t.value ? S("", !0) : (n(), b("p", bf, "Loading members…"))
      ]),
      g(Le, {
        class: "work-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: H(() => [
          g(of, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: k[0] || (k[0] = ($) => y.$emit("validity", $))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), gf = { class: "work-settings-row" }, yf = ["for"], kf = { class: "work-settings-row" }, wf = { class: "work-row-main" }, $f = ["id"], Vf = { class: "work-settings-grid" }, xf = { class: "work-stack work-tight" }, Cf = { class: "work-stack work-tight" }, Sf = ["value", "inert"], Tf = {
  key: 1,
  class: "work-muted work-small"
}, If = {
  key: 0,
  class: "work-settings-row"
}, Df = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Uf = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, Ef = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, Af = { class: "work-stack work-tight" }, Pf = { class: "work-stack work-tight" }, Of = { class: "work-stack work-tight" }, Rf = ["value", "inert"], Nf = {
  key: 1,
  class: "work-muted work-small"
}, Mf = { class: "work-row" }, Ff = { class: "work-row" }, Lf = { class: "work-row work-board-title" }, Bf = {
  key: 1,
  class: "work-identity-actions"
}, zf = ["title"], jf = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, Wf = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, qf = /* @__PURE__ */ Ve({
  __name: "BoardIdentity",
  props: {
    board: {},
    boardApps: {},
    compact: { type: Boolean },
    detail: { type: Boolean },
    subtitle: {}
  },
  emits: ["saved", "dirty-change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = W(!1), r = W(!1), f = W(""), u = W(""), c = W(""), i = W(""), v = W(!1), m = W(!1), w = W(""), p = W(""), y = K(() => t.board?.access?.admin === !0), k = Qt(), $ = Qt(), x = W({ title: "", description: "", icon: "", app: "" }), V = K(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((E) => E.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), F = K(() => V.value.find((E) => E.id === i.value)?.title), I = K(() => !!t.boardApps?.length || !!t.board?.ui_app), _ = K(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function se() {
      x.value = _.value, f.value = _.value.title, c.value = _.value.icon, u.value = _.value.description, i.value = _.value.app;
    }
    function B() {
      zt("wc-icon-picker").then((E) => v.value = E);
    }
    function ue() {
      se(), w.value = "", p.value = "", o.value = !0, B();
    }
    const me = K(() => {
      const E = {};
      return f.value.trim() !== x.value.title && (E.title = f.value.trim()), u.value !== x.value.description && (E.description = u.value), c.value !== x.value.icon && (E.icon = c.value), i.value !== x.value.app && (E.ui_app = i.value), E;
    }), ke = K(() => (t.detail || o.value) && Object.keys(me.value).length > 0);
    Ie(_, () => {
      t.detail && !ke.value && se();
    }, { immediate: !0 }), Ie(r, (E) => {
      E && B();
    }), Ie(y, (E) => {
      E || ce();
    }), Ie(ke, (E) => l("dirty-change", E));
    function ce() {
      o.value = !1, w.value = "", p.value = "", se();
    }
    async function ie() {
      if (!y.value || !t.board || m.value || !f.value.trim()) return;
      const E = me.value;
      if (!Object.keys(E).length) {
        o.value = !1, p.value = "Nothing changed.";
        return;
      }
      m.value = !0, w.value = "";
      try {
        const te = await Lt.updateBoard(t.board.board_id, E);
        f.value = f.value.trim(), x.value = { title: f.value, description: u.value, icon: c.value, app: i.value }, o.value = !1, p.value = te.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (te) {
        w.value = pt(te, "Could not save the board.");
      } finally {
        m.value = !1;
      }
    }
    return (E, te) => e.detail ? (n(), b("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Me(ie, ["prevent"])
    }, [
      s("div", gf, [
        s("label", {
          for: d(k),
          class: "work-row-main work-row-title"
        }, "Board name", 8, yf),
        g(d(De), {
          id: d(k),
          modelValue: f.value,
          "onUpdate:modelValue": te[0] || (te[0] = (z) => f.value = z),
          required: "",
          disabled: m.value || !y.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", kf, [
        s("div", wf, [
          s("h3", {
            class: "work-row-title",
            id: d($)
          }, "Board app", 8, $f),
          te[9] || (te[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        g(d(fe), {
          modelValue: i.value,
          "onUpdate:modelValue": te[1] || (te[1] = (z) => i.value = z),
          "aria-labelledby": d($),
          options: V.value,
          placeholder: F.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: m.value || !y.value || !I.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      at(E.$slots, "default"),
      g(Le, {
        open: r.value,
        "onUpdate:open": te[4] || (te[4] = (z) => r.value = z),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: H(() => [
          s("div", Vf, [
            s("label", xf, [
              te[10] || (te[10] = q("Description", -1)),
              g(d(Oa), {
                modelValue: u.value,
                "onUpdate:modelValue": te[2] || (te[2] = (z) => u.value = z),
                rows: "1",
                disabled: m.value || !y.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", Cf, [
              te[11] || (te[11] = s("span", null, "Board icon", -1)),
              v.value ? (n(), b("wc-icon-picker", {
                key: 0,
                value: c.value,
                fallback: "tabler:layout-kanban",
                inert: m.value || !y.value || void 0,
                onSelect: te[3] || (te[3] = (z) => c.value = z.detail)
              }, null, 40, Sf)) : (n(), b("p", Tf, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      ke.value || w.value || p.value ? (n(), b("div", If, [
        w.value ? (n(), b("p", Df, T(w.value), 1)) : p.value && !ke.value ? (n(), b("p", Uf, T(p.value), 1)) : S("", !0),
        ke.value ? (n(), b(le, { key: 2 }, [
          g(d(ae), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !f.value.trim() || m.value || !y.value,
            loading: m.value
          }, null, 8, ["disabled", "loading"]),
          g(d(ae), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: m.value,
            onClick: ce
          }, null, 8, ["disabled"])
        ], 64)) : S("", !0)
      ])) : S("", !0)
    ], 32)) : (n(), b("div", Ef, [
      o.value ? (n(), b("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: te[8] || (te[8] = Me(() => {
        }, ["stop"])),
        onSubmit: Me(ie, ["prevent"])
      }, [
        s("label", Af, [
          te[12] || (te[12] = q("Title", -1)),
          g(d(De), {
            modelValue: f.value,
            "onUpdate:modelValue": te[5] || (te[5] = (z) => f.value = z),
            required: "",
            autofocus: "",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", Pf, [
          te[13] || (te[13] = q("Description", -1)),
          g(d(Oa), {
            modelValue: u.value,
            "onUpdate:modelValue": te[6] || (te[6] = (z) => u.value = z),
            rows: "1",
            disabled: m.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", Of, [
          te[14] || (te[14] = s("span", null, "Board icon", -1)),
          v.value ? (n(), b("wc-icon-picker", {
            key: 0,
            value: c.value,
            fallback: "tabler:layout-kanban",
            inert: m.value || void 0,
            onSelect: te[7] || (te[7] = (z) => c.value = z.detail)
          }, null, 40, Rf)) : (n(), b("p", Nf, "The icon picker is unavailable."))
        ]),
        s("div", Mf, [
          g(d(ae), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !f.value.trim() || m.value,
            loading: m.value,
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          g(d(ae), {
            label: "Cancel",
            severity: "secondary",
            disabled: m.value,
            onClick: ce,
            outlined: ""
          }, {
            icon: H(() => [
              g(d(ve), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), b(le, { key: 1 }, [
        s("div", Ff, [
          s("div", Lf, [
            e.board?.icon ? (n(), Y(d(ve), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : S("", !0),
            (n(), Y(fa(e.compact ? "h2" : "h1"), {
              class: wt(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: H(() => [
                q(T(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? at(E.$slots, "title-end", {}, void 0, void 0, 0) : S("", !0),
          e.compact ? (n(), b("span", Bf, [
            y.value ? (n(), Y(d(ae), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Me(ue, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: H(() => [
                g(d(ve), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : S("", !0),
            at(E.$slots, "actions")
          ])) : y.value ? (n(), Y(d(ae), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Me(ue, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: H(() => [
              g(d(ve), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : S("", !0),
          e.compact ? S("", !0) : at(E.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), b("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, T(e.subtitle || e.board?.description), 9, zf)) : S("", !0)
      ], 64)),
      w.value ? (n(), b("p", jf, T(w.value), 1)) : S("", !0),
      p.value ? (n(), b("p", Wf, T(p.value), 1)) : S("", !0)
    ]));
  }
}), Gf = { class: "work-ia-section work-ia-general" }, Kf = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, Hf = {
  key: 0,
  class: "work-settings-row"
}, Yf = { class: "work-settings-row" }, Xf = { class: "work-row-main" }, Jf = ["for"], Zf = { class: "work-muted work-small" }, Qf = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, _f = { class: "work-muted" }, em = { key: 0 }, tm = { key: 1 }, am = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, lm = {
  key: 0,
  class: "work-stack work-tight"
}, om = {
  key: 0,
  class: "work-stack work-tight"
}, im = {
  key: 1,
  class: "work-muted"
}, nm = { class: "work-stack work-tight" }, sm = { class: "work-spacer" }, rm = /* @__PURE__ */ Ve({
  __name: "GeneralSettings",
  props: {
    draft: {},
    schema: {},
    board: {},
    boardApps: {},
    active: { type: Boolean },
    draftForm: {},
    disabled: { type: Boolean },
    packTitle: {},
    outdated: { type: Boolean },
    upgradeReason: {},
    canUpgrade: { type: Boolean },
    canInstall: { type: Boolean },
    packError: {}
  },
  emits: ["upgrade", "install", "retry", "saved", "share", "dirty-change"],
  setup(e) {
    const a = e, t = Qt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = K(() => Object.keys(l).filter((p) => a.draft.policy?.[p] !== void 0));
    function r(p) {
      const y = a.draft.policy?.[p];
      return p === "audit" ? y === "off" ? "Off" : "Track field changes" : p === "comments_per_item" ? y : y === 0 ? p === "audit_days" || p === "interval_days" ? "365 days" : "Clean up immediately" : y === 1 ? "1 day" : y + " days";
    }
    const f = W(), u = W(!1);
    let c = "";
    Ie([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([p, y, k], $, x) => {
      if (!p || !y || c === y + "/" + k) return;
      f.value = void 0, u.value = !1;
      let V = !0;
      x(() => V = !1);
      try {
        const F = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, k - 1)) },
          (I, _) => Lt.schema(y, k - _ - 1)
        ));
        V && (f.value = F, c = y + "/" + k);
      } catch {
        V && (u.value = !0);
      }
    }, { immediate: !0 });
    function i(p) {
      return JSON.stringify(p, (y, k) => k && typeof k == "object" && !Array.isArray(k) ? Object.fromEntries(Object.entries(k).sort(([$], [x]) => $.localeCompare(x))) : k);
    }
    function v(p, y) {
      if (!y) return ["Initial board setup"];
      const k = p.declaration, $ = y.declaration, x = [], V = [
        ["Fields", k.fields, $.fields],
        ["Item types", k.item_types, $.item_types],
        ["Workflow", k.processes, $.processes],
        ["Links", k.relation_types, $.relation_types],
        ["Plugins and filters", [k.plugins, k.scopes], [$.plugins, $.scopes]],
        ["Item visibility", k.visibility, $.visibility],
        ["Board rules", k.policy, $.policy],
        ["Starting pack", p.pack, y.pack],
        ["Item key prefix", p.key_prefix, y.key_prefix]
      ];
      if (i(k.fields) !== i($.fields)) {
        const I = k.fields?.filter((_) => !$.fields?.some((se) => se.code === _.code)) ?? [];
        I.length === 1 && x.push("Added " + Ze(I[0]));
      }
      const F = V.filter(([, I, _]) => i(I) !== i(_)).map(([I]) => I).filter((I) => I !== "Fields" || !x.length);
      return F.length && x.push(F.join(", ") + " updated"), x.length ? x : ["Board setup updated"];
    }
    const m = W(!1), w = K(() => {
      if (!f.value || a.schema.generation < 1) return [];
      const p = [a.schema, ...f.value];
      return p.slice(0, 3).map((y, k) => v(y, p[k + 1]));
    });
    return (p, y) => (n(), b("section", Gf, [
      s("section", Kf, [
        e.board ? (n(), b("div", Hf, [
          y[8] || (y[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            g(d(ae), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: y[0] || (y[0] = (k) => p.$emit("share"))
            }, {
              icon: H(() => [
                g(d(ve), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : S("", !0),
        (n(), Y(qf, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: y[2] || (y[2] = (k) => p.$emit("dirty-change", k)),
          onSaved: y[3] || (y[3] = (k) => p.$emit("saved"))
        }, {
          default: H(() => [
            s("div", Yf, [
              s("div", Xf, [
                s("label", {
                  class: "work-row-title",
                  for: d(t)
                }, "Item key prefix", 8, Jf),
                s("p", Zf, "Shown on items, for example " + T(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              g(d(De), {
                id: d(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": y[1] || (y[1] = (k) => e.draft.key_prefix = k),
                form: e.draftForm,
                disabled: e.disabled,
                "aria-label": "Item key prefix",
                required: "",
                pattern: "[A-Z][A-Z0-9]{1,9}",
                maxlength: "10"
              }, null, 8, ["id", "modelValue", "form", "disabled"])
            ])
          ]),
          _: 1
        }, 8, ["board", "board-apps"]))
      ]),
      s("section", Qf, [
        s("p", _f, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), b("span", em, T(e.board.open_count) + " open · " + T(e.board.item_count) + " total · ", 1)) : S("", !0),
          q(" " + T(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), b("span", tm, " · Update available")) : S("", !0)
        ]),
        e.packError ? (n(), b("p", am, T(e.packError), 1)) : S("", !0),
        e.packError ? (n(), Y(d(ae), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: y[4] || (y[4] = (k) => p.$emit("retry"))
        })) : S("", !0),
        e.packTitle ? e.outdated ? (n(), Y(d(ae), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: y[6] || (y[6] = (k) => p.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : S("", !0) : (n(), Y(d(ae), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: y[5] || (y[5] = (k) => p.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), Y(Le, {
        key: 0,
        open: m.value,
        "onUpdate:open": y[7] || (y[7] = (k) => m.value = k),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: H(() => [
          m.value ? (n(), b("dl", lm, [
            s("div", null, [
              y[9] || (y[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, T(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              y[10] || (y[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, T(e.schema.pack.version), 1)
            ]),
            y[11] || (y[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                q(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : S("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : S("", !0),
      g(Le, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: H(() => [
          w.value.length ? (n(), b("ul", om, [
            (n(!0), b(le, null, de(w.value, (k, $) => (n(), b("li", { key: $ }, T(k.join(" · ")), 1))), 128))
          ])) : (n(), b("p", im, T(u.value ? "Recent changes are unavailable." : f.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), Y(Le, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: H(() => [
          y[12] || (y[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", nm, [
            (n(!0), b(le, null, de(o.value, (k) => (n(), b("li", {
              key: k,
              class: "work-row work-wrap"
            }, [
              s("span", sm, T(l[k]) + " · " + T(r(k)), 1),
              g(d(ae), {
                label: "Use default for " + l[k].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: ($) => delete e.draft.policy[k]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : S("", !0)
    ]));
  }
}), Ge = (e, a) => `${e} → ${a}`, No = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? Ze(t) : "Untitled field";
}, Mo = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function Fo(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Re(String(a));
  if (e === "stage_timeout") {
    const t = Ca(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function dm(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(Mo).flatMap((u) => t[u] === l[u] ? [] : [`${Mo[u]} · ${Ge(Fo(u, t[u]), Fo(u, l[u]))}`]), r = (u) => u ? `${u.limit}${u.hard ? " (hard limit)" : ""}` : "No limit", f = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const u of f) {
    const c = r(t.wip?.[u]), i = r(l.wip?.[u]);
    if (c === i) continue;
    const v = (a.processes ?? []).flatMap((m) => m.states).find((m) => m.id === u) ?? (e.processes ?? []).flatMap((m) => m.states).find((m) => m.id === u);
    o.push(`${be(v)} limit · ${Ge(c, i)}`);
  }
  return o;
}
function um(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(Ge(
    l ? No(e, l.field) : "No additional restriction",
    o ? No(a, o.field) : "No additional restriction"
  ));
  const f = l?.levels ?? [], u = o?.levels ?? [], c = new Set([...f, ...u].map((i) => i.id));
  for (const i of c) {
    const v = f.find((k) => k.id === i), m = u.find((k) => k.id === i);
    if (v && m && JSON.stringify(v.holders) === JSON.stringify(m.holders)) continue;
    const w = (k) => k.fields?.find(($) => $.code === k.visibility?.field)?.options?.find(($) => $.id === i)?.label, p = w(a) || w(e) || Re(i), y = (k) => k ? k.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${p} · ${Ge(y(v), y(m))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
}
const Sa = {
  add: "Added",
  added: "Added",
  remove: "Removed",
  removed: "Removed",
  title: "Title",
  name: "Name",
  type: "Kind",
  form: "Stored value type",
  cardinality: "Values allowed",
  label: "Labels",
  index: "Search support",
  shape: "Settings changed",
  process: "Process",
  initial: "Starting state",
  migration: "Existing items",
  "options.add": "Choice added",
  "options.remove": "Choice removed",
  "options.change": "Choice updated",
  "state.add": "State added",
  "state.remove": "State removed",
  "state.map": "Move existing items",
  "state.kind": "State kind",
  "state.category": "State category",
  "state.change": "State settings updated",
  "state.name": "State name",
  "transition.add": "Transition added",
  "transition.remove": "Transition removed",
  "transition.change": "Transition settings updated",
  "transition.name": "Transition name",
  "views.remove": "Saved view removed",
  "automations.remove": "Automation removed",
  "automation.type": "Automation kind",
  invalid: "Invalid settings"
};
function cm(e, a, t) {
  const { what: l, detail: o, to: r } = e, u = `${t?.name || a?.name || "Untitled workflow"} · ${Sa[l] ?? "Workflow changed"}`, c = l.startsWith("state.") ? a?.states.find((p) => p.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((p) => p.id === o) : void 0, v = l.startsWith("transition.") ? a?.transitions?.find((p) => p.id === o) : void 0, m = l.startsWith("transition.") ? t?.transitions?.find((p) => p.id === o) : void 0;
  let w = "";
  if (l === "state.map") w = Ge(be(c), be(t?.states.find((p) => p.id === r)));
  else if (l === "state.name") w = Ge(be(c), be(i));
  else if (l === "state.kind") w = `${be(i)} · ${Ge(el(c?.kind), el(i?.kind))}`;
  else if (l === "state.category" && c && i) w = `${be(i)} · ${Ge(Wt(c.category), Wt(i.category))}`;
  else if (i || c) w = be(i ?? c);
  else if (l === "transition.name" && v && m) w = Ge(Ke(v), Ke(m));
  else if (m && v && m.to !== v.to) {
    const p = be(a?.states.find((k) => k.id === v.to)), y = be(t?.states.find((k) => k.id === m.to));
    return { title: u, details: [Ke(m), `Destination changes from ${p} to ${y}.`] };
  } else if (l === "transition.add" && m && t) {
    const p = m.from === "any" ? "Any state" : m.from.map((k) => be(t.states.find(($) => $.id === k))).join(", "), y = be(t.states.find((k) => k.id === m.to));
    return { title: u, details: [Ke(m), Ge(p, y), ...m.auto ? ["Runs automatically."] : []] };
  } else m ? w = Ke(m) : v ? w = Ke(v) : l === "initial" ? w = Ge(be(a?.states.find((p) => p.id === a.initial)), be(t?.states.find((p) => p.id === t.initial))) : l === "name" && (w = Ge(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: u, details: w ? [w] : [] };
}
function vm(e, a, t, l) {
  const { code: o, what: r, detail: f } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: dm(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: um(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [Ge(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const m = o.slice(8);
    return cm(e, a.processes?.find((w) => w.id === m), t.processes?.find((w) => w.id === m));
  }
  if (o.startsWith("item_type ")) {
    const m = o.slice(10), w = a.item_types?.find((k) => k.id === m), p = t.item_types?.find((k) => k.id === m);
    return { title: `${p?.title || w?.title || "Item type"} · ${Sa[r] ?? "Item type changed"}`, details: r === "title" ? [Ge(w?.title || "Untitled item type", p?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const m = o.slice(9), w = a.relation_types?.find((k) => k.id === m), p = t.relation_types?.find((k) => k.id === m), y = r === "label" ? [Ge([w?.outward, w?.inward].filter(Boolean).join(" / "), [p?.outward, p?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${p?.outward || w?.outward || "Link type"} · ${Sa[r] ?? "Link type changed"}`, details: y };
  }
  const u = t.fields?.find((m) => m.code === o), c = a.fields?.find((m) => u?.id !== void 0 ? m.id === u.id : m.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = u ?? c;
  if (!i) return { title: Sa[r] ?? "Board settings changed", details: [] };
  const v = `${Ze(i)} · ${r.startsWith("renamed from ") ? "Field key" : Sa[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const m = c?.options ?? [], w = u?.options ?? [], p = m.findIndex((F) => F.id === f), y = w.findIndex((F) => F.id === f), k = m[p], $ = w[y], x = $?.label || k?.label || "Untitled choice", V = k && $ && k.label !== $.label ? [] : [x];
    if (k && $) {
      k.label !== $.label && V.push(Ge(k.label || "Untitled choice", $.label || "Untitled choice")), k.category !== $.category && V.push(`Category · ${Ge(k.category ? Wt(k.category) : "None", $.category ? Wt($.category) : "None")}`);
      const F = k.order ?? p + 1, I = $.order ?? y + 1;
      F !== I && V.push(`Order · ${Ge(F, I)}`), k.color !== $.color && V.push(`Color · ${Ge(k.color ?? "Default", $.color ?? "Default")}`);
    }
    return { title: v, details: V };
  }
  return r === "title" && c && u ? { title: v, details: [Ge(Ze(c), Ze(u))] } : { title: v, details: [] };
}
const fm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, mm = { key: 0 }, pm = { class: "work-row work-wrap" }, bm = { class: "work-muted" }, hm = {
  key: 0,
  class: "work-notice"
}, gm = {
  key: 1,
  class: "work-notice"
}, ym = {
  key: 2,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, km = { key: 3 }, wm = {
  key: 4,
  class: "work-settings-table"
}, $m = { key: 0 }, Vm = /* @__PURE__ */ Ve({
  __name: "SchemaReview",
  props: {
    boardId: {},
    original: {},
    declaration: {},
    plan: {},
    generation: {},
    follows: {},
    configCount: {},
    packReview: { type: Boolean },
    plugins: {}
  },
  setup(e) {
    const a = e, t = {}, l = K(() => a.original ?? t), o = K(() => a.declaration ?? t), r = K(() => (o.value.processes ?? []).flatMap((V) => V.states.flatMap((F) => {
      const I = F.run?.flow_ref;
      return I ? [{ key: V.id + ":" + F.id, process: V.name || "Untitled process", state: be(F), reference: I }] : [];
    }))), f = W(/* @__PURE__ */ new Map());
    Ie(r, async (V, F, I) => {
      const _ = /* @__PURE__ */ new Map();
      f.value = _;
      let se = !0;
      I(() => se = !1), await Promise.all([...new Set(V.map((B) => B.reference.id))].map(async (B) => {
        try {
          const ue = (await Gl.title(B))?.trim();
          se && ue && !Yi(ue) && f.value.set(B, ue);
        } catch {
          se && f.value.set(B, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const u = K(() => [l.value, o.value].flatMap((V) => (V.visibility?.levels ?? []).flatMap((F) => F.holders.flatMap((I) => "group" in I ? [{ kind: "group", id: I.group }] : "user" in I ? [{ kind: "user", id: I.user }] : [])))), c = Yo(() => a.boardId ?? "", u);
    function i(V) {
      if ("user" in V) return c.label({ kind: "user", id: V.user });
      if ("group" in V) return c.label({ kind: "group", id: V.group });
      if ("field" in V) {
        const F = o.value.fields?.find((I) => I.code === V.field) ?? l.value.fields?.find((I) => I.code === V.field);
        return F ? Ze(F) : "People from a field";
      }
      return "Service";
    }
    const v = (V) => V.map((F) => {
      const I = vm(F, l.value, o.value, i);
      if (F.what === "plugins") {
        const _ = new Set(l.value.plugins?.map((B) => B.use)), se = new Set(o.value.plugins?.map((B) => B.use));
        for (const B of a.plugins ?? [])
          _.has(B.plugin) !== se.has(B.plugin) && I.details.push((se.has(B.plugin) ? "Enable " : "Turn off ") + (B.title || "an available plugin"));
      }
      return { change: F, ...I };
    }), m = K(() => v(a.plan?.changes.filter((V) => V.class !== "refused") ?? [])), w = K(() => v(a.plan?.refused ?? [])), p = K(() => {
      const V = a.plan?.migration;
      return !V || !w.value.length ? V : w.value.every((F) => F.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : w.value.every((F) => F.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : V;
    }), y = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, k = (V) => y[V]?.[0] ?? "Review needed", $ = (V) => y[V]?.[1] ?? "secondary";
    function x(V) {
      const { detail: F, ...I } = V;
      return nl(V.what === "invalid" || V.what.startsWith("views.") || V.what.startsWith("automation") ? V : I);
    }
    return (V, F) => e.plan ? (n(), b("section", fm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), b("p", mm, "No changes to apply.")) : (n(), b(le, { key: 1 }, [
        s("header", pm, [
          F[0] || (F[0] = s("h3", null, "Impact on this board", -1)),
          g(d(dt), {
            class: "kx-tag-sm",
            severity: $(e.plan.class)
          }, {
            default: H(() => [
              q(T(k(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", bm, T(d(Xi)[e.plan.class] || "Review the changes below."), 1),
        p.value ? (n(), b("p", hm, T(p.value), 1)) : e.follows.length ? (n(), b("p", gm, "Existing items in " + T(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : S("", !0),
        r.value.length ? (n(), b("section", ym, [
          F[1] || (F[1] = s("h3", null, "Flow bindings", -1)),
          (n(!0), b(le, null, de(r.value, (I) => (n(), b("p", {
            key: I.key
          }, [
            q(T(I.process) + " / " + T(I.state) + " · ", 1),
            s("strong", null, T(f.value.get(I.reference.id) ?? "Published Flow") + " · v" + T(I.reference.version), 1)
          ]))), 128)),
          F[2] || (F[2] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : S("", !0),
        at(V.$slots, "default"),
        w.value.length ? (n(), b("h3", km, "Blocked changes")) : S("", !0),
        (n(!0), b(le, null, de(w.value, (I, _) => (n(), Y(d(sn), {
          key: _,
          severity: "error",
          role: "alert"
        }, {
          default: H(() => [
            s("strong", null, T(I.title), 1),
            (n(!0), b(le, null, de(I.details, (se, B) => (n(), b("p", { key: B }, T(se), 1))), 128)),
            s("p", null, T(x(I.change)), 1),
            g(Le, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: H(() => [
                s("code", null, T(I.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        m.value.length ? (n(), b("table", wm, [
          F[3] || (F[3] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), b(le, null, de(m.value, (I, _) => (n(), b("tr", { key: _ }, [
              s("td", null, [
                s("strong", null, T(I.title), 1),
                (n(!0), b(le, null, de(I.details, (se, B) => (n(), b("p", { key: B }, T(se), 1))), 128)),
                I.change.count ? (n(), b("p", $m, T(I.change.count) + " " + T(I.change.count === 1 ? "item" : "items"), 1)) : S("", !0)
              ]),
              s("td", null, [
                g(d(dt), {
                  class: "kx-tag-sm",
                  severity: $(I.change.class)
                }, {
                  default: H(() => [
                    q(T(k(I.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : S("", !0)
      ], 64))
    ])) : S("", !0);
  }
}), xm = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, Cm = {
  key: 0,
  class: "work-muted work-small"
}, Sm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Tm = { class: "work-stack work-tight work-pack-review-field" }, Im = { class: "work-config-fields" }, Dm = { class: "work-json-example" }, Um = { class: "work-json-example" }, Em = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Am = /* @__PURE__ */ Ve({
  __name: "PackReview",
  props: {
    plan: {},
    request: {},
    original: {},
    plugins: {},
    disabled: { type: Boolean }
  },
  emits: ["change"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = K(() => [
      { label: "Saved views", entries: t.plan.views?.map((v) => ({ id: v.id, name: v.title || v.id })) },
      { label: "Automations", entries: t.plan.automations?.map((v) => ({ id: v.id, name: v.id })) },
      { label: "Traits", entries: t.plan.traits?.map((v) => ({ id: v, name: v })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((v) => ({ id: v, name: t.plugins?.find((m) => m.plugin === v)?.title || v })) }
    ].filter((v) => v.entries?.length));
    function r(v) {
      return t.original.processes?.find((m) => m.id === v)?.name || Re(v);
    }
    function f(v) {
      const [m, ...w] = v.split("."), p = w.join(".");
      return m === "processes" ? r(p) : m === "fields" ? t.original.fields?.find((y) => y.code === p)?.title || Re(p) : m === "item_types" ? t.original.item_types?.find((y) => y.id === p)?.title || Re(p) : Re(m);
    }
    function u(v) {
      return JSON.stringify(v ?? null, null, 2);
    }
    function c(v, m) {
      (t.request.resolutions ??= {})[v] = m, l("change");
    }
    function i(v, m, w) {
      ((t.request.maps ??= {})[v] ??= {})[m] = w, l("change");
    }
    return (v, m) => (n(), b(le, null, [
      s("section", xm, [
        m[1] || (m[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          m[0] || (m[0] = q("Target version ", -1)),
          s("strong", null, T(e.plan.version), 1)
        ]),
        o.value.length ? (n(), b("p", Cm, "Resources included in this plan.")) : S("", !0),
        (n(!0), b(le, null, de(o.value, (w) => (n(), b("div", {
          key: w.label
        }, [
          s("h4", null, T(w.label), 1),
          s("ul", null, [
            (n(!0), b(le, null, de(w.entries, (p) => (n(), b("li", {
              key: p.id
            }, T(p.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), b("section", Sm, [
        m[4] || (m[4] = s("h3", null, "Local edits conflict", -1)),
        m[5] || (m[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), b(le, null, de(e.plan.conflicts, (w) => (n(), b("div", {
          key: w.path,
          class: "work-stack work-tight"
        }, [
          s("label", Tm, [
            q(T(f(w.path)), 1),
            g(d(fe), {
              "model-value": e.request.resolutions?.[w.path],
              "aria-label": "Resolution for " + f(w.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (p) => c(w.path, p)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          g(Le, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: H(() => [
              s("div", Im, [
                s("section", null, [
                  m[2] || (m[2] = s("h4", null, "Local edits", -1)),
                  s("pre", Dm, T(u(w.local_value)), 1)
                ]),
                s("section", null, [
                  m[3] || (m[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", Um, T(u(w.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : S("", !0),
      Object.keys(e.plan.maps).length ? (n(), b("section", Em, [
        m[6] || (m[6] = s("h3", null, "Required state maps", -1)),
        m[7] || (m[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), b(le, null, de(e.plan.maps, (w, p) => (n(), b("div", {
          key: p,
          class: "work-stack"
        }, [
          s("h4", null, T(r(p)), 1),
          (n(!0), b(le, null, de(w, (y, k) => (n(), b("label", {
            key: k,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            q("Move items from " + T(d(be)(e.original.processes?.find(($) => $.id === p)?.states.find(($) => $.id === k))), 1),
            g(d(fe), {
              "model-value": e.request.maps?.[p]?.[k],
              "aria-label": "Move items from " + d(be)(e.original.processes?.find(($) => $.id === p)?.states.find(($) => $.id === k)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find(($) => $.id === p)?.states.map(($) => ({ label: d(be)($), value: $.id })) ?? [],
              "onUpdate:modelValue": ($) => i(p, k, $)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : S("", !0)
    ], 64));
  }
}), Pm = { class: "work-section-layout" }, Om = { class: "kx-main" }, Rm = ["aria-label"], Nm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Mm = { role: "alert" }, Fm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Lm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, Bm = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, zm = {
  key: 5,
  class: "work-settings-body"
}, jm = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, Wm = {
  key: 0,
  role: "status"
}, qm = {
  key: 1,
  role: "status"
}, Gm = { class: "work-small" }, Km = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, Hm = { key: 3 }, Ym = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, Xm = {
  key: 2,
  class: "work-notice"
}, Jm = ["id"], Zm = ["disabled", "inert"], Qm = {
  key: 3,
  class: "work-ia-section"
}, _m = {
  key: 0,
  class: "work-muted"
}, ep = {
  key: 5,
  class: "work-ia-section"
}, tp = { class: "work-review-layout" }, ap = { class: "work-muted" }, lp = ["aria-busy"], op = {
  key: 0,
  role: "status"
}, ip = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, np = {
  key: 2,
  role: "alert"
}, sp = { key: 6 }, rp = { class: "work-dialog-actions" }, dp = {
  key: 3,
  class: "work-muted",
  role: "status"
}, up = {
  key: 0,
  class: "work-muted",
  role: "status"
}, cp = {
  key: 1,
  class: "kx-err work-alert-actions"
}, vp = { role: "alert" }, fp = {
  key: 2,
  class: "work-stack work-tight"
}, mp = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, pp = {
  key: 3,
  class: "work-muted"
}, bp = { class: "work-dialog-actions" }, hp = /* @__PURE__ */ Ve({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = pn(), r = Qt(), f = W();
    let u, c = "";
    const i = () => JSON.stringify([St.value, J.value, Ee.value, [...it.value]]), v = K(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), m = W();
    Ie(m, (G) => {
      t.focusBack && G?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const w = [
      { heading: "Board setup", items: [
        { value: "Item types", label: "Item types", icon: "tabler:list-details" },
        { value: "Fields", label: "Fields", icon: "tabler:forms" },
        { value: "Links", label: "Links", icon: "tabler:link" },
        { value: "Workflow", label: "Workflow", icon: "tabler:route" }
      ] },
      { heading: "Management", items: [
        { value: "Access", label: "Access", icon: "tabler:users" },
        { value: "Plugins", label: "Plugins", icon: "tabler:puzzle" }
      ] }
    ], p = W("General"), y = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, k = W("");
    function $(G, P = "") {
      p.value = G, k.value = P ? y[G] + "/" + P : "";
    }
    function x(G, P = "") {
      $(G, P), t.route !== void 0 && l("navigate", [y[G], ...P ? [encodeURIComponent(P)] : []].join("/"));
    }
    function V(G, P, Q) {
      if (t.route === void 0 || y[p.value] !== G || !Q && k.value !== G + "/" + P) return;
      const ye = L.value?.declaration;
      (G === "items" ? ye?.item_types?.some((Ae) => Ae.id === P) : G === "fields" ? ye?.fields?.some((Ae) => Ae.code === P) : G === "links" ? ye?.relation_types?.some((Ae) => Ae.id === P) : G === "plugins" ? h.value?.schema_options.plugins.some((Ae) => Ae.plugin === P) : G === "workflow" && ye?.processes?.some((Ae) => Ae.states.some((Oe) => Ae.id + ".state." + Oe.id === P) || Ae.transitions?.some((Oe) => Ae.id + ".transition." + Oe.id === P))) && x(p.value, Q ? P : "");
    }
    jo(Ql, { selected: k, choose: V });
    function F(G) {
      if (G === v.value.value) {
        Di();
        return;
      }
      (G === "General" || w.some((P) => P.items.some((Q) => Q.value === G))) && x(G);
    }
    async function I() {
      x("Access"), await It(), f.value?.focus();
    }
    const _ = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Show relationships on both items, such as “Blocks” and “Blocked by.”",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, se = W(""), B = W();
    function ue(G, P, Q) {
      Q.currentTarget instanceof HTMLElement && (B.value = { section: G, type: P, opener: Q.currentTarget }, G === "Fields" && (se.value = P.id), x(G));
    }
    function me(G) {
      const P = B.value;
      if (!P) return;
      G !== void 0 && (P.type.process = G);
      const Q = P.type.id, ye = L.value?.declaration.item_types?.some((Be) => Be.id === Q);
      x("Item types", ye ? Q : ""), B.value = void 0, P.section === "Fields" && It(() => P.opener.focus());
    }
    const ke = W(!1), ce = W(""), ie = W();
    Ie(p, (G) => {
      f.value?.scrollTo({ top: 0 }), B.value && G !== B.value.section && (B.value = void 0);
    });
    function E() {
      ke.value = !1, ce.value = "", Ba.value = !1;
    }
    function te(G) {
      !ul.value || !Ci() || it.value.size || (ie.value = G, ke.value = !0, yl());
    }
    const z = W(!1), pe = W(""), X = W(/* @__PURE__ */ new Set(["General"]));
    Ie(p, (G) => X.value.add(G));
    const L = W(), C = W(), O = W(), D = W({}), J = W({}), h = W(), U = W(!1), re = W(!0), Z = W(!1), $e = W(""), xe = W(""), Pe = K(() => D.value.processes ?? []), R = K(() => U.value && L.value ? [
      { heading: O.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...w
    ] : []), ne = W(), A = W(!1), N = Ta();
    async function M(G) {
      const P = N();
      A.value = !1;
      try {
        const Q = await Lt.stateCounts(G);
        P() && (ne.value = Q);
      } catch {
        P() && (A.value = !0, ne.value = void 0);
      }
    }
    Ie(p, (G) => {
      U.value && G === "Workflow" && M(t.boardId);
    });
    const { packs: j, loading: ee, error: Ce, load: Ue, reset: et } = Ji(), lt = K(() => j.value.filter(Zi)), Qe = K(() => j.value.map(Qi)), He = K(() => Qe.value.find((G) => G.id === pe.value && !G.disabled)), Ee = W(), je = W(), ot = W(), bt = W(), Ot = W(""), _t = K(() => !!bt.value && bt.value.result.status !== "done"), pa = K(() => !Z.value && !ba.value && !aa.value && !_t.value), ul = K(() => ba.value && !(_t.value && Ee.value)), Xe = W(), ea = W(), ta = W(""), cl = W([]), vl = K(() => [...cl.value, ...Xe.value?.refused ?? []]), ht = W(!1), io = W(0), it = W(/* @__PURE__ */ new Set()), fl = W(), no = Ta(), La = Ta(), St = K(() => $l(D.value, L.value?.declaration ?? {})), ba = K(() => it.value.size > 0 || !!Ee.value || !!L.value && (JSON.stringify(St.value) !== JSON.stringify($l(L.value.declaration, L.value.declaration)) || Object.keys(J.value).length > 0)), ml = W(!1), ha = W({}), so = K(() => ba.value || ml.value || Object.keys(ha.value).length > 0);
    Ie(so, (G) => l("dirty-change", G), { immediate: !0, flush: "sync" });
    const ft = K(() => !!L.value && !!C.value && L.value.generation !== C.value.generation), gi = K(() => (!ga.value.renamed.length || Ba.value) && U.value && !Z.value && !ht.value && !aa.value && !ft.value && !it.value.size && Xe.value && (Xe.value.changes.length > 0 || Object.keys(J.value).length > 0) && Xe.value.class !== "refused" && !Xe.value.refused.length && ea.value?.matches(St.value, L.value?.generation ?? -1, J.value)), Ba = W(!1), ga = K(() => {
      const G = L.value?.declaration, P = [], Q = [];
      for (const ye of Pe.value) {
        const Be = G?.item_types?.filter((Oe) => Oe.process === ye.id) ?? [], Ae = G?.processes?.find((Oe) => Oe.id === ye.id);
        for (const Oe of Ae?.states ?? []) {
          const ja = ye.states.find((qt) => qt.id === Oe.id);
          if (ja && ja.name === Oe.name) continue;
          const wl = [...Xe.value?.refused ?? [], ...Xe.value?.changes ?? []].find((qt) => qt.code === "process " + ye.id && qt.detail === Oe.id && ["state.remove", "state.map"].includes(qt.what))?.count ?? Be.reduce((qt, Ei) => qt + (ne.value?.[Ei.id]?.[Oe.id] ?? 0), 0);
          wl && (ja ? Q.push({ process: ye, state: Oe, name: be(ja), count: wl }) : P.push({ process: ye, state: Oe, count: wl }));
        }
      }
      return { removed: P, renamed: Q };
    });
    function yi(G, P, Q) {
      G.map = { ...G.map, [P]: Q }, yl();
    }
    const pl = K(() => lt.value.find((G) => G.id === Ee.value?.pack)?.plugins.filter((G) => !L.value?.plugins?.some((P) => P.plugin === G.plugin && P.active)).map((G) => ({ use: G.plugin })) ?? []), ro = K(() => !!ot.value && JSON.stringify(ot.value) === JSON.stringify(Ee.value)), uo = K(() => Ee.value ? U.value && !Z.value && !it.value.size && !ft.value && !aa.value && ro.value && Xe.value?.class !== "refused" && !Xe.value?.refused.length && je.value?.conflicts.every((G) => !!Ee.value?.resolutions?.[G.path]) : gi.value), co = K(() => !!Xe.value && (!Ee.value || ro.value)), ki = K(() => lt.value.find((G) => G.id === L.value?.pack?.id)?.title || "Installed pack"), bl = K(() => !Ce.value && !!L.value?.outdated && !!Qe.value.find((G) => G.id === L.value?.pack?.id && !G.disabled)), wi = K(() => Ce.value ? "Reload packs to check available upgrades." : _t.value ? "Finish the current pack installation before upgrading." : bl.value ? ba.value ? "Discard the current draft before upgrading." : aa.value ? "Finish the current migration before upgrading." : Z.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade.");
    function vo() {
      Ee.value = void 0, je.value = void 0, ot.value = void 0;
    }
    async function $i() {
      if (!L.value?.pack || !pa.value || !bl.value) return;
      const G = lt.value.find((P) => P.id === L.value.pack.id);
      G && (ie.value = void 0, Ee.value = yo(G, L.value.generation), ke.value = !0, await hl());
    }
    async function Vi() {
      const G = lt.value.find((P) => P.id === pe.value);
      !L.value || !G || !He.value || !pa.value || ee.value || (ie.value = void 0, Ee.value = yo(G, L.value.generation), z.value = !1, ke.value = !0, await hl());
    }
    async function hl() {
      if (!Ee.value || Z.value || !U.value || ft.value || it.value.size) return;
      const G = La(), P = oa(Ee.value), Q = JSON.stringify(Ee.value);
      Z.value = !0, ce.value = "", xe.value = "";
      try {
        const ye = await en(P, (Be) => Nt.packPlan(t.boardId, Be));
        if (!G() || Q !== JSON.stringify(Ee.value)) return;
        je.value = ye.plan, Xe.value = ye.plan, Ee.value = ye.request, ot.value = oa(Ee.value), ta.value = crypto.randomUUID(), ke.value = !0;
      } catch (ye) {
        G() && (ot.value = void 0, ce.value = pt(ye, "Could not review the pack."));
      } finally {
        Z.value = !1;
      }
    }
    const fo = K(() => je.value?.declaration ?? ea.value?.declaration), xi = K(() => {
      const G = fo.value;
      return !Xe.value || !G ? [] : _i(Xe.value, G).map((P) => G.processes?.find((Q) => Q.id === P)?.name || "Untitled process");
    }), aa = K(() => !!C.value?.migration_error || O.value?.status === "migrating");
    function Tt() {
      cl.value = [], La(), Xe.value = void 0, ea.value = void 0, ot.value = void 0, ta.value = "";
    }
    Ie([St, J], Tt, { deep: !0, flush: "sync" }), Ie(J, (G) => {
      Ee.value && (Object.keys(G).length ? Ee.value.plugin_configs = oa(G) : delete Ee.value.plugin_configs);
    }, { deep: !0, flush: "sync" });
    function ya(G, P) {
      P ? it.value.delete(G) : it.value.add(G), Tt();
    }
    function gl(G) {
      vo(), B.value = void 0, io.value++, L.value = G, D.value = oa(G.declaration), J.value = {}, it.value.clear(), Tt();
    }
    async function gt(G = !1) {
      const P = no();
      try {
        const [Q, ye, Be] = await Promise.all([Lt.schema(t.boardId, void 0, !0).catch((Oe) => {
          if (Oe instanceof Ol && Oe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Oe;
        }), Lt.options(t.boardId), Lt.boards()]);
        if (!P()) return;
        if (U.value = ye.access.admin, h.value = ye, O.value = Be.find((Oe) => Oe.board_id === t.boardId), !U.value) {
          L.value = void 0, D.value = {}, Tt();
          return;
        }
        $e.value = "";
        const Ae = tn(Q);
        C.value = Ae, u !== void 0 && Ae.generation >= u ? (u = void 0, c === i() && gl(Ae), c = "") : (G || !L.value || !ba.value && Ae.generation !== L.value.generation) && gl(Ae), ft.value && Tt(), await Ue(P), P() && p.value === "Workflow" && M(t.boardId);
      } catch (Q) {
        if (!P()) return;
        Q instanceof Ol && (Q.status === 403 || Q.kind?.toLowerCase() === "permission_denied") && (U.value = !1), Tt(), $e.value = pt(Q, "Could not load board settings.");
      } finally {
        P() && (re.value = !1);
      }
    }
    function Ci() {
      for (const G of Array.from(fl.value?.elements ?? []))
        if ((G instanceof HTMLInputElement || G instanceof HTMLSelectElement || G instanceof HTMLTextAreaElement) && !(G.form !== fl.value || G.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !G.reportValidity()) {
          const Q = G.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return Q && (Q.click(), It(() => G.reportValidity())), !1;
        }
      return !0;
    }
    async function yl() {
      if (Ee.value) return hl();
      if (!L.value || Z.value || !U.value || ft.value || it.value.size) return;
      const G = La(), P = ko(St.value, L.value.generation, J.value);
      Z.value = !0, ce.value = "", xe.value = "";
      try {
        const Q = (P.declaration.processes ?? []).some((Be) => L.value?.declaration.processes?.find((Ae) => Ae.id === Be.id)?.states.some((Ae) => Be.states.some((Oe) => Oe.id === Ae.id && Oe.name !== Ae.name))), [ye] = await Promise.all([
          Nt.plan(t.boardId, P),
          Q ? M(t.boardId) : void 0
        ]);
        if (Q && A.value) {
          Tt(), ce.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!G() || it.value.size || !P.matches(St.value, L.value.generation, J.value)) return;
        Xe.value = ye, ea.value = P, ta.value = crypto.randomUUID(), ke.value = !0;
      } catch (Q) {
        G() && (Tt(), ce.value = pt(Q, "Could not review changes."), cl.value = an(Q, St.value));
      } finally {
        Z.value = !1;
      }
    }
    async function Si() {
      if (!uo.value) return;
      if (Ee.value && ot.value) {
        Z.value = !0, ce.value = "";
        try {
          await mo(oa(ot.value), ta.value, i()), E();
        } catch (P) {
          ce.value = pt(P, "Could not apply the pack upgrade.");
        } finally {
          Z.value = !1;
        }
        return;
      }
      if (!ea.value) return;
      Z.value = !0, ce.value = "", xe.value = "";
      const G = i();
      try {
        u = (await Nt.apply(t.boardId, ea.value, ta.value)).generation, c = G, await gt(), xe.value = "Board changes applied.", E();
      } catch (P) {
        ce.value = pt(P, "Could not apply the board changes.");
      } finally {
        Z.value = !1;
      }
    }
    async function mo(G, P, Q) {
      const ye = t.boardId, Be = await Nt.packApply(ye, G, P);
      t.boardId === ye && (bt.value = { request: G, key: P, result: Be, draft: Q }, Q === i() && (u = Be.generation, c = Q), await gt());
    }
    async function Ti() {
      const G = bt.value;
      if (!(!G || !_t.value || Z.value || !U.value)) {
        Z.value = !0, Ot.value = "";
        try {
          await mo(G.request, G.key, G.draft);
        } catch (P) {
          Ot.value = pt(P, "Could not continue the pack installation.");
        } finally {
          Z.value = !1;
        }
      }
    }
    async function Ii() {
      if (!Z.value) {
        Z.value = !0, $e.value = "";
        try {
          const G = await Nt.resume(t.boardId);
          xe.value = G.resumed ? "Migration resumes." : "Migration is already running.", await gt();
        } catch (G) {
          $e.value = pt(G, "Could not resume migration.");
        } finally {
          Z.value = !1;
        }
      }
    }
    async function za(G, P) {
      if (!L.value || !U.value || Z.value || ht.value) return "Wait for the current change to finish.";
      if (ft.value) return "Discard the stale draft before removing a definition.";
      const Q = L.value.generation, ye = JSON.stringify(St.value), Be = oa(D.value);
      Na(Be, G, P), ht.value = !0;
      try {
        const Ae = await Nt.plan(t.boardId, ko($l(Be, L.value.declaration), Q, J.value));
        if (!U.value || ft.value || L.value.generation !== Q || JSON.stringify(St.value) !== ye) return "The draft changes during the check. Try the removal again.";
        const Oe = ln(Ae, G, P);
        if (Oe) return Oe;
        if (Ae.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ae) {
        return pt(Ae, "Could not check this removal.");
      } finally {
        ht.value = !1;
      }
    }
    async function Di() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      so.value && !await Xo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function Ui() {
      u = void 0, ha.value = {}, C.value && gl(C.value), xe.value = "", $e.value = "", E();
    }
    Ie(() => t.boardId, () => {
      ml.value = !1, ha.value = {}, u = void 0, vo(), et(), bt.value = void 0, Ot.value = "", L.value = void 0, C.value = void 0, O.value = void 0, J.value = {}, it.value.clear(), N(), ne.value = void 0, se.value = "", B.value = void 0, X.value = /* @__PURE__ */ new Set(["General"]), $("General"), E(), U.value = !1, re.value = !0, gt(!0);
    }), Ie([() => t.route, () => t.boardId], ([G]) => {
      if (G === void 0) return;
      const [P, Q] = G.split("/"), ye = Object.keys(y).find((Ae) => y[Ae] === P) ?? "General";
      let Be = "";
      try {
        Q && (Be = decodeURIComponent(Q));
      } catch {
      }
      ye === "Fields" && Be && k.value !== "fields/" + Be && (se.value = ""), $(ye, Be), X.value.add(ye);
    }, { immediate: !0 });
    let kl = () => {
    };
    return Ie(() => t.boardId, (G) => {
      kl(), kl = on(`component.${G}`, () => {
        gt();
      });
    }, { immediate: !0 }), Mi(gt), Xl(() => {
      kl(), no(), La(), N();
    }), (G, P) => (n(), b("section", {
      class: wt(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", Pm, [
        g(mn, {
          ref_key: "rail",
          ref: m,
          label: "Board settings sections",
          value: p.value,
          groups: R.value,
          "leading-item": v.value,
          "onUpdate:value": F
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Om, [
          s("div", {
            ref_key: "pane",
            ref: f,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": p.value,
            tabindex: "-1"
          }, [
            U.value && L.value ? (n(), Y(Kv, {
              key: 0,
              title: p.value,
              description: _[p.value]
            }, Hl({ _: 2 }, [
              ul.value || p.value === "Plugins" ? {
                name: "actions",
                fn: H(() => [
                  p.value === "Plugins" ? (n(), Y(d(ae), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: Z.value || re.value,
                    onClick: P[0] || (P[0] = (Q) => gt())
                  }, {
                    icon: H(() => [
                      g(d(ve), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : S("", !0),
                  ul.value ? (n(), Y(Hv, {
                    key: 1,
                    busy: Z.value,
                    "discard-disabled": ht.value,
                    "review-disabled": ht.value || aa.value || ft.value || !!it.value.size,
                    onDiscard: Ui,
                    onReview: te
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : S("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : S("", !0),
            $e.value ? (n(), b("div", Nm, [
              s("p", Mm, T($e.value), 1),
              g(d(ae), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: P[1] || (P[1] = (Q) => gt())
              })
            ])) : S("", !0),
            xe.value ? (n(), b("p", Fm, T(xe.value), 1)) : S("", !0),
            re.value ? (n(), b("p", Lm, "Loading board settings…")) : !U.value && !$e.value ? (n(), b("p", Bm, "Ask a board administrator to grant you access to these settings.")) : S("", !0),
            U.value && L.value ? (n(), b("div", zm, [
              bt.value ? (n(), b("section", jm, [
                _t.value ? (n(), b("p", Wm, [
                  P[28] || (P[28] = q("Pack installation status ", -1)),
                  s("strong", null, T(d(Re)(bt.value.result.status)), 1)
                ])) : (n(), b("p", qm, "Pack applied.")),
                s("p", Gm, [
                  P[29] || (P[29] = q("Operation ", -1)),
                  s("code", null, T(bt.value.result.operation_id), 1),
                  P[30] || (P[30] = q(" · Job ", -1)),
                  s("code", null, T(bt.value.result.job_id), 1)
                ]),
                Ot.value ? (n(), b("p", Km, T(Ot.value), 1)) : S("", !0),
                _t.value ? (n(), b("div", Hm, [
                  g(d(ae), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: Z.value,
                    disabled: Z.value,
                    onClick: Ti
                  }, null, 8, ["loading", "disabled"])
                ])) : S("", !0)
              ])) : S("", !0),
              ft.value ? (n(), b("p", Ym, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : S("", !0),
              aa.value ? (n(), b("div", Xm, [
                s("p", null, T(C.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                C.value?.migration_error ? (n(), Y(Le, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: H(() => [
                    q(T(C.value.migration_error), 1)
                  ]),
                  _: 1
                })) : S("", !0),
                C.value?.migration_error ? (n(), Y(d(ae), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: Z.value,
                  outlined: "",
                  onClick: Ii
                }, null, 8, ["disabled"])) : S("", !0)
              ])) : S("", !0),
              Vt(g(rm, {
                draft: D.value,
                schema: C.value ?? L.value,
                board: O.value,
                active: p.value === "General",
                "board-apps": h.value?.board_apps,
                "draft-form": d(r),
                disabled: Z.value || ht.value,
                "pack-title": L.value.pack ? ki.value : void 0,
                outdated: L.value.outdated,
                "upgrade-reason": wi.value,
                "can-upgrade": bl.value && pa.value,
                "can-install": pa.value,
                "pack-error": d(Ce),
                onUpgrade: $i,
                onInstall: P[2] || (P[2] = (Q) => z.value = !0),
                onRetry: P[3] || (P[3] = (Q) => d(Ue)()),
                onDirtyChange: P[4] || (P[4] = (Q) => ml.value = Q),
                onSaved: P[5] || (P[5] = (Q) => gt()),
                onShare: I
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error"]), [
                [Rt, p.value === "General"]
              ]),
              s("form", {
                id: d(r),
                ref_key: "editor",
                ref: fl,
                onSubmit: P[20] || (P[20] = Me((Q) => te(), ["prevent"]))
              }, [
                (n(), b("fieldset", {
                  key: io.value,
                  class: "work-settings-fieldset",
                  disabled: Z.value || ht.value,
                  inert: Z.value || ht.value || void 0
                }, [
                  X.value.has("Item types") ? Vt((n(), Y(od, {
                    key: 0,
                    class: "work-ia-section",
                    draft: D.value,
                    "guard-removal": za,
                    issues: vl.value,
                    onCreateField: P[6] || (P[6] = (Q, ye) => ue("Fields", Q, ye)),
                    onCreateWorkflow: P[7] || (P[7] = (Q, ye) => ue("Workflow", Q, ye))
                  }, null, 8, ["draft", "issues"])), [
                    [Rt, p.value === "Item types"]
                  ]) : S("", !0),
                  X.value.has("Fields") ? Vt((n(), Y(jr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": h.value?.installed_types,
                    draft: D.value,
                    "guard-removal": za,
                    issues: vl.value,
                    "item-type": se.value,
                    "onUpdate:itemType": P[8] || (P[8] = (Q) => se.value = Q),
                    "create-for-item-type": B.value?.section === "Fields",
                    onCreated: P[9] || (P[9] = (Q) => me()),
                    onCancelCreation: P[10] || (P[10] = (Q) => me()),
                    onValidity: P[11] || (P[11] = (Q, ye) => ya("fields:" + Q, ye))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Rt, p.value === "Fields"]
                  ]) : S("", !0),
                  X.value.has("Links") ? Vt((n(), Y(hv, {
                    key: 2,
                    class: "work-ia-section",
                    draft: D.value,
                    "guard-removal": za
                  }, null, 8, ["draft"])), [
                    [Rt, p.value === "Links"]
                  ]) : S("", !0),
                  X.value.has("Workflow") ? Vt((n(), b("section", Qm, [
                    A.value ? (n(), b("p", _m, [
                      P[31] || (P[31] = q("Item counts are unavailable. ", -1)),
                      g(d(ae), {
                        label: "Reload counts",
                        text: "",
                        onClick: P[12] || (P[12] = (Q) => M(e.boardId))
                      })
                    ])) : S("", !0),
                    g(Jc, {
                      "board-id": e.boardId,
                      draft: D.value,
                      "guard-removal": za,
                      issues: vl.value,
                      counts: ne.value,
                      "count-types": L.value.declaration.item_types,
                      guards: h.value?.guards,
                      "create-for-item-type": B.value?.section === "Workflow",
                      "creation-opener": B.value?.opener,
                      onCreated: me,
                      onCancelCreation: P[13] || (P[13] = (Q) => me()),
                      onValidity: P[14] || (P[14] = (Q, ye) => ya("process:" + Q, ye))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Rt, p.value === "Workflow"]
                  ]) : S("", !0),
                  X.value.has("Access") ? Vt((n(), Y(hf, {
                    key: 4,
                    active: p.value === "Access",
                    "board-id": e.boardId,
                    draft: D.value,
                    board: O.value,
                    busy: Z.value,
                    onValidity: P[15] || (P[15] = (Q) => ya("visibility", Q))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Rt, p.value === "Access"]
                  ]) : S("", !0),
                  X.value.has("Plugins") ? Vt((n(), b("section", ep, [
                    g(Ro, {
                      "board-id": e.boardId,
                      draft: D.value,
                      schema: C.value ?? L.value,
                      options: h.value?.schema_options.plugins ?? [],
                      "active-configs": ha.value,
                      "onUpdate:activeConfigs": P[16] || (P[16] = (Q) => ha.value = Q),
                      filters: h.value?.filters,
                      configs: J.value,
                      disabled: Z.value,
                      onConfigured: P[17] || (P[17] = (Q) => {
                        Tt(), gt();
                      }),
                      onRefresh: P[18] || (P[18] = (Q) => gt()),
                      onReview: te,
                      onValidity: P[19] || (P[19] = (Q, ye) => ya("plugin:" + Q, ye))
                    }, null, 8, ["board-id", "draft", "schema", "options", "active-configs", "filters", "configs", "disabled"])
                  ], 512)), [
                    [Rt, p.value === "Plugins"]
                  ]) : S("", !0)
                ], 8, Zm))
              ], 40, Jm),
              g(Rl, {
                visible: ke.value,
                label: "Review changes",
                busy: Z.value,
                "return-focus": ie.value,
                class: "work-review-sheet",
                onClose: E
              }, {
                default: H(() => [
                  s("div", tp, [
                    s("header", null, [
                      P[32] || (P[32] = s("h2", null, "Review changes", -1)),
                      s("p", ap, T(O.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": Z.value
                    }, [
                      Z.value ? (n(), b("p", op, T(Xe.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : S("", !0),
                      ce.value ? (n(), b("p", ip, T(ce.value), 1)) : S("", !0),
                      ft.value ? (n(), b("p", np, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : S("", !0),
                      ke.value && !Ee.value && (ga.value.removed.length || ga.value.renamed.length) ? (n(), Y(ev, {
                        key: 3,
                        removed: ga.value.removed,
                        renamed: ga.value.renamed,
                        disabled: Z.value || ht.value,
                        confirmed: Ba.value,
                        "onUpdate:confirmed": P[21] || (P[21] = (Q) => Ba.value = Q),
                        onDestination: yi
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : S("", !0),
                      ke.value && Ee.value && pl.value.length ? (n(), Y(Ro, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: pl.value },
                        schema: C.value ?? L.value,
                        options: h.value?.schema_options.plugins.filter((Q) => pl.value.some((ye) => ye.use === Q.plugin)) ?? [],
                        configs: J.value,
                        disabled: Z.value,
                        "activation-locked": "",
                        onValidity: P[22] || (P[22] = (Q, ye) => ya("pack-plugin:" + Q, ye))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : S("", !0),
                      ke.value ? (n(), Y(Vm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: L.value.declaration,
                        declaration: fo.value,
                        plan: Xe.value,
                        follows: xi.value,
                        "config-count": Object.keys(J.value).length,
                        "pack-review": !!je.value,
                        plugins: h.value?.schema_options.plugins
                      }, {
                        default: H(() => [
                          je.value && Ee.value ? (n(), Y(Am, {
                            key: 0,
                            plan: je.value,
                            request: Ee.value,
                            original: L.value.declaration,
                            plugins: h.value?.schema_options.plugins,
                            disabled: Z.value,
                            onChange: P[23] || (P[23] = (Q) => {
                              ot.value = void 0, ta.value = "";
                            })
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled"])) : S("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "pack-review", "plugins"])) : S("", !0),
                      !Z.value && !co.value && !ft.value && !ce.value ? (n(), b("p", sp, "Check the impact again before applying.")) : S("", !0)
                    ], 8, lp),
                    s("footer", rp, [
                      g(d(ae), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: Z.value,
                        onClick: E
                      }, null, 8, ["disabled"]),
                      co.value ? (n(), Y(d(ae), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !uo.value,
                        loading: Z.value,
                        onClick: Si
                      }, null, 8, ["disabled", "loading"])) : (n(), Y(d(ae), {
                        key: 0,
                        label: "Check impact",
                        disabled: Z.value || ft.value || !!it.value.size,
                        onClick: yl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              ht.value ? (n(), b("p", dp, "Checking what uses this setting…")) : S("", !0)
            ])) : S("", !0)
          ], 8, Rm)
        ])
      ]),
      U.value ? (n(), Y(Rl, {
        key: 0,
        visible: z.value,
        label: "Install pack",
        busy: Z.value,
        onClose: P[27] || (P[27] = (Q) => z.value = !1)
      }, {
        default: H(() => [
          z.value ? (n(), b("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: Me(Vi, ["prevent"])
          }, [
            P[34] || (P[34] = s("h2", null, "Install a pack", -1)),
            P[35] || (P[35] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            d(ee) ? (n(), b("p", up, "Loading packs…")) : d(Ce) ? (n(), b("div", cp, [
              s("p", vp, T(d(Ce)), 1),
              g(d(ae), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: P[24] || (P[24] = (Q) => d(Ue)())
              })
            ])) : Qe.value.length ? (n(), b("label", fp, [
              P[33] || (P[33] = q("Pack ", -1)),
              g(d(fe), {
                modelValue: pe.value,
                "onUpdate:modelValue": P[25] || (P[25] = (Q) => pe.value = Q),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: Qe.value,
                pt: { option: ({ context: Q }) => ({ "aria-label": [Q.option.title, Q.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: H(({ option: Q }) => [
                  s("span", null, [
                    q(T(Q.title), 1),
                    Q.unavailable ? (n(), b("small", mp, T(Q.unavailable), 1)) : S("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), b("p", pp, "No available packs were found.")),
            s("footer", bp, [
              g(d(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: P[26] || (P[26] = (Q) => z.value = !1)
              }),
              g(d(ae), {
                type: "submit",
                label: "Review pack",
                disabled: !He.value || !pa.value || d(ee) || !!d(Ce)
              }, null, 8, ["disabled"])
            ])
          ], 32)) : S("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : S("", !0)
    ], 2));
  }
}), gp = /* @__PURE__ */ Ve({
  __name: "SettingsRoot",
  setup(e) {
    const a = Fi(), t = Li();
    return jo(Zo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: bn(l) });
    }), (l, o) => (n(), Y(hp, {
      "board-id": d(a).boardId ?? "",
      embedded: d(a).embedded,
      "focus-back": d(a).focusBack,
      route: d(a).route,
      onNavigate: o[0] || (o[0] = (r) => d(t)("navigate", { route: r })),
      onDirtyChange: o[1] || (o[1] = (r) => d(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), yp = Bi(gp, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
nn(import.meta.url, yp);
//# sourceMappingURL=settings.js.map
