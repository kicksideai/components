import { defineComponent as Te, computed as L, openBlock as n, createBlock as H, resolveDynamicComponent as Sa, normalizeProps as yi, guardReactiveProps as ki, createSlots as Ta, withCtx as q, createElementVNode as s, normalizeClass as ft, createElementBlock as f, Fragment as te, renderList as fe, toDisplayString as T, createCommentVNode as C, unref as u, renderSlot as Ye, inject as al, useModel as Io, useSlots as Do, watch as De, createVNode as k, Transition as jl, withDirectives as bt, vShow as Ct, mergeModels as Uo, ref as B, onMounted as Ua, onUnmounted as ql, resolveComponent as Eo, createTextVNode as W, onBeforeUnmount as Dt, useId as wt, withKeys as Ze, withModifiers as Be, normalizeStyle as wi, watchEffect as Ao, nextTick as yt, provide as Oo, reactive as $i } from "vue";
import { e as Mt, u as Vi, a as xi, b as Ci, c as Si } from "./mount-DbvthD5M.js";
import "pinia";
import { m as qa, h as io, s as ye, i as Ti, t as Xe, g as Ii, j as Qt, k as Ht, r as no, w as Rt, f as vt, l as sa, n as ut, o as et, q as Ft, v as Po, x as Me, y as qe, z as Ro, A as Lt, B as No, C as Ia, D as ll, d as Mo, E as Ea, c as Xa, F as Di, G as Ja, H as Dl, I as Ui, J as la, K as Ei, L as Ai, _ as Ul, M as so, N as Oi, O as Fo, P as Pi, Q as Ri, u as Ni, a as Mi, p as Fi, R as oa, S as Li, T as ro, U as ml, V as Bi, W as zi, X as uo, Y as ji, Z as qi } from "./usePackDiscovery-C1SrFn_g.js";
import ge from "primevue/select";
import ae from "primevue/button";
import { Icon as pe } from "@iconify/vue";
import { api as El, host as Lo, on as Wi, define as Gi } from "@wippy-fe/proxy";
import tt from "primevue/tag";
import nt from "primevue/toggleswitch";
import Zt from "primevue/checkbox";
import Ae from "primevue/inputtext";
import Da from "primevue/textarea";
import St from "primevue/inputnumber";
import Wl from "primevue/selectbutton";
import Bo from "primevue/message";
const pl = (e, a) => e.x > a.x && e.x < a.x + a.width && e.y > a.y && e.y < a.y + a.height;
function Ki(e, a, t) {
  return e.x === a.x ? e.x > t.x && e.x < t.x + t.width && Math.max(e.y, a.y) > t.y && Math.min(e.y, a.y) < t.y + t.height : e.y > t.y && e.y < t.y + t.height && Math.max(e.x, a.x) > t.x && Math.min(e.x, a.x) < t.x + t.width;
}
function Wt(e, a, t) {
  const l = [.../* @__PURE__ */ new Set([e.x, a.x, ...t.flatMap((V) => [V.x, V.x + V.width])])].sort((V, $) => V - $), o = [.../* @__PURE__ */ new Set([e.y, a.y, ...t.flatMap((V) => [V.y, V.y + V.height])])].sort((V, $) => V - $);
  l.unshift(l[0] - 24), l.push(l.at(-1) + 24), o.unshift(o[0] - 24), o.push(o.at(-1) + 24);
  const r = l.length, v = o.indexOf(a.y) * r + l.indexOf(a.x), m = o.indexOf(e.y) * r + l.indexOf(e.x), g = (V) => ({ x: l[V % r], y: o[Math.floor(V / r)] }), i = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), c = [];
  function x(V) {
    c.push(V);
    let $ = c.length - 1;
    for (; $; ) {
      const S = $ - 1 >> 1;
      if (c[S].priority <= V.priority) break;
      c[$] = c[S], $ = S;
    }
    c[$] = V;
  }
  function y() {
    const V = c[0], $ = c.pop();
    if (c.length) {
      let S = 0;
      for (; S * 2 + 1 < c.length; ) {
        let D = S * 2 + 1;
        if (D + 1 < c.length && c[D + 1].priority < c[D].priority && D++, $.priority <= c[D].priority) break;
        c[S] = c[D], S = D;
      }
      c[S] = $;
    }
    return V;
  }
  const b = (V) => Math.abs(V.x - a.x) + Math.abs(V.y - a.y);
  for (const V of [0, 1]) {
    const $ = m * 2 + V;
    i.set($, 0), x({ key: $, cost: 0, priority: b(e) });
  }
  const p = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map();
  for (; c.length; ) {
    const V = y(), $ = Math.floor(V.key / 2), S = V.key % 2;
    if (V.cost !== i.get(V.key)) continue;
    if ($ === v) {
      const J = [];
      let ce = V.key;
      for (; ce !== void 0; )
        J.push(g(Math.floor(ce / 2))), ce = d.get(ce);
      return zo(J.reverse());
    }
    const D = g($), z = $ % r, le = Math.floor($ / r);
    for (const [J, ce] of [[z > 0 ? $ - 1 : -1, 0], [z + 1 < r ? $ + 1 : -1, 0], [le > 0 ? $ - r : -1, 1], [le + 1 < o.length ? $ + r : -1, 1]]) {
      if (J < 0) continue;
      const me = g(J);
      if (p.has(J) || p.set(J, !t.some((O) => pl(me, O))), !p.get(J)) continue;
      const be = `${Math.min($, J)}:${Math.max($, J)}`;
      if (w.has(be) || w.set(be, !t.some((O) => Ki(D, me, O))), !w.get(be)) continue;
      const he = V.cost + Math.abs(D.x - me.x) + Math.abs(D.y - me.y) + (S === ce ? 0 : 18), se = J * 2 + ce;
      he >= (i.get(se) ?? 1 / 0) || (i.set(se, he), d.set(se, V.key), x({ key: se, cost: he, priority: he + b(me) }));
    }
  }
  throw new Error("Process map has no collision-free route between its ports: " + JSON.stringify({ start: e, end: a, startInside: t.filter((V) => pl(e, V)), endInside: t.filter((V) => pl(a, V)) }));
}
function zo(e) {
  const a = [];
  for (const t of e) {
    const l = a.at(-1), o = a.at(-2);
    l && l.x === t.x && l.y === t.y || (o && l && (o.x === l.x && l.x === t.x || o.y === l.y && l.y === t.y) && a.pop(), a.push(t));
  }
  return a;
}
const ma = (e) => Array.from(e).reduce((a, t) => a + (/[^\x20-\x7e]/u.test(t) ? 16 : /[MW@%]/.test(t) ? 11 : /[ilI.,:;!| ']/.test(t) ? 4 : 7.5), 0);
function ia(e, a = 28) {
  const t = [];
  let l = "";
  for (const o of e.split(/\s+/u))
    for (let r = 0; r < o.length; r += a) {
      const v = o.slice(r, r + a);
      l && l.length + v.length + 1 > a && (t.push(l), l = ""), l = l ? l + " " + v : v;
    }
  return [...t, l].filter(Boolean);
}
function Fa(e) {
  if (e = zo(e), !e.length) return "";
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let l = 1; l < e.length - 1; l++) {
    const o = e[l - 1], r = e[l], v = e[l + 1], m = Math.hypot(r.x - o.x, r.y - o.y), g = Math.hypot(v.x - r.x, v.y - r.y), i = Math.min(8, m / 3, g / 3);
    i && (a += ` L ${r.x + (o.x - r.x) * i / m} ${r.y + (o.y - r.y) * i / m} Q ${r.x} ${r.y} ${r.x + (v.x - r.x) * i / g} ${r.y + (v.y - r.y) * i / g}`);
  }
  const t = e.at(-1);
  return a + ` L ${t.x} ${t.y}`;
}
function Hi(e, a = {}, t = { width: 1400, height: 480 }) {
  const l = t.direction ?? (t.width < 750 || qa(e).length > 8 ? "TB" : "LR"), o = t.direction === "LR" && qa(e).length > 6, r = new io.graphlib.Graph({ multigraph: !0 });
  r.setGraph({ rankdir: l, ranker: "network-simplex", acyclicer: "greedy", nodesep: 32, edgesep: 32, ranksep: 24, marginx: 32, marginy: 32 }), r.setDefaultEdgeLabel(() => ({}));
  const v = qa(e), m = new Map(v.map((h, U) => [h.id, U])), g = e.states.map((h) => {
    const U = (e.transitions ?? []).filter((A) => A.from === "any" && A.to === h.id), R = ia(ye(h), o ? 13 : 28), E = ia(Ti(h, e), o ? 13 : 28), G = U.flatMap((A) => ia(Xe(A) + " works from any state")), re = a.policy?.wip?.[h.id]?.limit, ee = re === void 0 ? 0 : ma(" · limit " + re), I = Math.max(o ? 122 : 168, ...R.map((A) => ma(A) + 58), ...E.map((A, oe) => ma(A) + 32 + (oe === E.length - 1 ? ee : 0)), ...G.map((A) => ma(A) + 32)), Z = Math.max(80, 42 + R.length * 18 + E.length * 16 + G.length * 18);
    return r.setNode(h.id, { width: I + (l === "LR" ? 36 : 0), height: Z + (l === "TB" ? 36 : 0) }), { state: h, x: 0, y: 0, width: I, height: Z, title: R, caption: E, badges: U, row: m.has(h.id) ? 0 : 1 };
  }), i = new Set(g.map((h) => h.state.id)), d = (e.transitions ?? []).flatMap((h) => h.from === "any" ? [] : h.from.filter((U) => i.has(U) && i.has(h.to)).map((U) => {
    const R = `${h.id}-${U}`, E = ia(Xe(h), o ? 12 : 28), G = Math.max(o ? 60 : 72, ...E.map((ee) => ma(ee) + 24)), re = Math.max(24, E.length * 16 + 10);
    return { transition: h, from: U, key: R, lines: E, width: G, height: re };
  })), c = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set(), y = new Set(d.filter((h) => h.from === h.transition.to || h.transition.to === e.initial || ["completed", "canceled"].includes(g.find((U) => U.state.id === h.from).state.category)).map((h) => h.key));
  function b(h) {
    if (!x.has(h)) {
      c.add(h);
      for (const U of d.filter((R) => R.from === h))
        y.has(U.key) || (c.has(U.transition.to) ? y.add(U.key) : b(U.transition.to));
      c.delete(h), x.add(h);
    }
  }
  b(e.initial);
  for (const h of g) b(h.state.id);
  for (const h of d) if (!y.has(h.key)) {
    const U = m.get(h.from), R = m.get(h.transition.to);
    r.setEdge(h.from, h.transition.to, { width: h.width, height: h.height, labelpos: "c", weight: U !== void 0 && R === U + 1 ? 100 : 1 }, h.key);
  }
  for (const h of e.transitions ?? []) if (h.from === "any" && i.has(e.initial) && i.has(h.to) && !m.has(h.to)) {
    const U = e.states.find((R) => R.id === h.to);
    r.setEdge(e.initial, h.to, { minlen: ["completed", "canceled"].includes(U.category) ? Math.max(1, v.length - 1) : 1 }, `any:${h.id}`);
  }
  const p = e.states.flatMap((h) => (h.regions ?? []).filter((U) => i.has(U.initial)).map((U, R) => {
    const E = `lane:${h.id}:${R}`;
    return r.setEdge(h.id, U.initial, {}, E), { state: h, region: U, key: E };
  }));
  if (!g.length) return { nodes: g, edges: [], parallels: [], main: v, direction: l, width: 320, height: 160 };
  io.layout(r);
  for (const h of g) Object.assign(h, { x: r.node(h.state.id).x, y: r.node(h.state.id).y });
  const w = l === "TB", V = d.filter((h) => !y.has(h.key)).map((h) => r.edge({ v: h.from, w: h.transition.to, name: h.key })), $ = [...g, ...V], S = Math.max(...$.map((h) => h.x + h.width / 2)), D = Math.max(...$.map((h) => h.y + h.height / 2)), z = (h) => g.find((U) => U.state.id === h), le = d.filter((h) => y.has(h.key)).sort((h, U) => {
    const R = w ? "y" : "x";
    return Math.abs(z(h.from)[R] - z(h.transition.to)[R]) - Math.abs(z(U.from)[R] - z(U.transition.to)[R]);
  }), J = /* @__PURE__ */ new Map(), ce = Math.max(0, ...le.map((h) => h.width));
  let me = D + 32;
  for (const [h, U] of le.entries()) {
    const R = z(U.from), E = z(U.transition.to), G = w ? S + 16 + ce + 28 + h * 18 : me + U.height / 2, re = w ? S + 16 + ce / 2 : (R.x + E.x) / 2;
    let ee = w ? R.y + R.height / 2 + 18 : G;
    if (w) for (const I of [...J.values()].sort((Z, A) => Z.y - A.y))
      ee + U.height / 2 + 10 > I.y - I.height / 2 - 10 && ee - U.height / 2 - 10 < I.y + I.height / 2 + 10 && (ee = I.y + I.height / 2 + 24 + U.height / 2);
    J.set(U.key, { x: re, y: ee, corridor: G, height: U.height }), me = G + U.height / 2 + 24;
  }
  const be = d.map((h) => ({ ...h, ...J.get(h.key) ?? r.edge({ v: h.from, w: h.transition.to, name: h.key }) })), he = (h, U) => ({ x: h.x - h.width / 2 - U, y: h.y - h.height / 2 - U, width: h.width + U * 2, height: h.height + U * 2 }), se = [...g.map((h) => he(h, 12)), ...be.map((h) => he(h, 10))], O = (h, U) => ({
    start: w ? { x: h.x, y: h.y + h.height / 2 } : { x: h.x + h.width / 2, y: h.y },
    end: w ? { x: U.x, y: U.y - U.height / 2 } : { x: U.x - U.width / 2, y: U.y }
  }), Q = (h, U) => w ? { x: h.x, y: h.y + U } : { x: h.x + U, y: h.y }, M = be.map((h) => {
    const U = g.find((P) => P.state.id === h.from), R = g.find((P) => P.state.id === h.transition.to), { start: E, end: G } = O(U, R), re = y.has(h.key), ee = Q(E, 18), I = Q(G, -18), Z = (re || !w ? h.width : h.height) / 2 + 10, A = re ? { x: h.x + (w ? -Z : Z), y: h.y } : Q(h, -Z), oe = re ? { x: h.x + (w ? Z : -Z), y: h.y } : Q(h, Z);
    let Ve;
    if (re) {
      const { corridor: P } = J.get(h.key), Y = w ? { x: P, y: h.y } : { x: ee.x, y: P }, ke = w ? { x: P, y: I.y } : { x: I.x, y: P };
      Ve = w ? [
        [E, ...Wt(ee, A, se)],
        [oe, Y, ke, ...Wt(ke, I, se), G]
      ] : [
        [E, ...Wt(ee, Y, se), A],
        [oe, ...Wt(ke, I, se), G]
      ];
    } else Ve = [
      [E, ...Wt(ee, A, se)],
      [...Wt(oe, I, se), G]
    ];
    const Pe = re ? "return" : m.get(h.transition.to) === (m.get(h.from) ?? -2) + 1 ? "main" : "forward";
    return { ...h, points: Ve.flat(), segments: Ve, path: Ve.map(Fa).join(" "), type: Pe, targetOffset: 0 };
  }), ne = p.map((h) => {
    const U = g.find((ee) => ee.state.id === h.state.id), R = g.find((ee) => ee.state.id === h.region.initial), { start: E, end: G } = O(U, R), re = [E, ...Wt(Q(E, 18), Q(G, -18), se), G];
    return { state: h.state, key: h.key, points: re, path: Fa(re) };
  }), xe = [...g.flatMap((h) => [{ x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...M.flatMap((h) => [...h.points, { x: h.x - h.width / 2, y: h.y - h.height / 2 }, { x: h.x + h.width / 2, y: h.y + h.height / 2 }]), ...ne.flatMap((h) => h.points)], Oe = 32 - Math.min(...xe.map((h) => h.x)), K = 32 - Math.min(...xe.map((h) => h.y)), j = Math.max(...xe.map((h) => h.x)) + Oe + 32, N = Math.max(...xe.map((h) => h.y)) + K + 32, ve = (h) => ({ x: h.x + Oe, y: h.y + K });
  for (const h of g) Object.assign(h, ve(h));
  for (const h of M)
    Object.assign(h, ve(h)), h.segments = h.segments.map((U) => U.map(ve)), h.points = h.segments.flat(), h.path = h.segments.map(Fa).join(" ");
  for (const h of ne)
    h.points = h.points.map(ve), h.path = Fa(h.points);
  return { nodes: g, edges: M, parallels: ne, main: v, direction: l, width: j, height: N };
}
const Yi = ["aria-label"], Xi = {
  key: 0,
  class: "kx-settings-rail-group"
}, Ji = ["aria-current", "onClick"], Zi = { class: "kx-settings-rail-label" }, Qi = /* @__PURE__ */ Te({
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
    const a = e, t = L(() => a.leadingItem ? [{ items: [a.leadingItem] }, ...a.groups] : a.groups);
    function l(o) {
      const r = [...o.currentTarget.querySelectorAll(".kx-settings-rail-item")], v = r.indexOf(o.target);
      if (v < 0) return;
      let m;
      switch (o.key) {
        case "ArrowDown":
        case "ArrowRight":
          m = (v + 1) % r.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          m = (v + r.length - 1) % r.length;
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
      o.preventDefault(), r[m]?.focus();
    }
    return (o, r) => (n(), H(Sa(e.title ? Ii : "div"), yi(ki(e.title ? { title: e.title, count: e.count, settings: !0 } : { class: "kx-settings-rail-standalone" })), Ta({
      default: q(() => [
        s("nav", {
          class: ft(["kx-settings-rail", { "kx-settings-rail-framed": e.title }]),
          "aria-label": e.label,
          onKeydown: l
        }, [
          (n(!0), f(te, null, fe(t.value, (v, m) => (n(), f("div", {
            key: v.items[0]?.value ?? m,
            class: ft(["kx-settings-rail-section", { "kx-settings-rail-leading": e.leadingItem && m === 0 }])
          }, [
            v.heading ? (n(), f("div", Xi, T(v.heading), 1)) : C("", !0),
            (n(!0), f(te, null, fe(v.items, (g) => (n(), f("button", {
              key: g.value,
              type: "button",
              class: "kx-settings-rail-item",
              "aria-current": g.value === e.value ? "true" : void 0,
              onClick: (i) => o.$emit("update:value", g.value)
            }, [
              g.icon ? (n(), H(u(pe), {
                key: 0,
                class: "kx-settings-rail-icon",
                icon: g.icon,
                "aria-hidden": "true"
              }, null, 8, ["icon"])) : C("", !0),
              s("span", Zi, T(g.label), 1)
            ], 8, Ji))), 128))
          ], 2))), 128))
        ], 42, Yi)
      ]),
      _: 2
    }, [
      e.title && o.$slots.actions ? {
        name: "actions",
        fn: q(() => [
          Ye(o.$slots, "actions")
        ]),
        key: "0"
      } : void 0
    ]), 1040));
  }
}), jo = Symbol("work-navigation");
function _i() {
  return al(jo, () => {
  });
}
function en(e) {
  if (e.name === "boards") return "";
  const a = encodeURIComponent(e.board);
  return e.name === "settings" ? `${a}/settings` : a;
}
const _t = (e) => `/api/v1/work/boards/${encodeURIComponent(e)}`, co = (e) => ({ declaration: e.declaration, expected_generation: e.expected_generation, plugin_configs: e.plugin_configs }), Jt = {
  packPlan: (e, a) => Qt(`${_t(e)}/pack_plan`, a, "Pack plan"),
  packApply: (e, a, t) => Qt(`${_t(e)}/pack_apply`, { ...a, key: t }, "Apply pack"),
  plan: (e, a) => Qt(`${_t(e)}/plan_schema`, co(a), "Schema plan"),
  apply: (e, a, t) => Qt(`${_t(e)}/apply_schema`, { ...co(a), key: t }, "Apply schema"),
  resume: (e) => Qt(`${_t(e)}/resume_migration`, {}, "Resume migration"),
  configure: (e, a, t) => Qt(`${_t(e)}/configure_plugin`, { plugin: a, ...t === void 0 ? {} : { config: t } }, "Configure plugin")
}, Gl = /* @__PURE__ */ Te({
  __name: "ContentAction",
  props: {
    as: { default: "button" },
    disabled: { type: Boolean },
    role: { default: "button" }
  },
  emits: ["activate"],
  setup(e, { emit: a }) {
    const t = e, l = a;
    function o(v) {
      if (t.disabled || v.defaultPrevented) return;
      const m = v.target;
      if (m instanceof Element && m !== v.currentTarget) {
        const g = m.closest('[data-work-action], button, a, input, textarea, [role="combobox"], [role="checkbox"], [role="switch"], details');
        if (g && g !== v.currentTarget) return;
      }
      l("activate", v);
    }
    function r(v) {
      v.target !== v.currentTarget || !["Enter", " "].includes(v.key) || (v.preventDefault(), t.disabled || l("activate", v));
    }
    return (v, m) => (n(), H(Sa(e.as), {
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
      default: q(() => [
        Ye(v.$slots, "default")
      ]),
      _: 3
    }, 40, ["type", "role", "tabindex", "disabled", "aria-disabled"]));
  }
}), ol = Symbol("section row"), tn = { class: "work-definition" }, an = {
  key: 0,
  class: "work-definition-handle"
}, ln = { class: "work-definition-lead" }, on = ["title"], nn = {
  key: 0,
  class: "work-definition-description"
}, sn = { class: "work-definition-details" }, rn = { class: "work-definition-code" }, dn = ["title"], un = { class: "work-definition-kind" }, cn = {
  key: 0,
  class: "work-definition-kind-label"
}, vn = { class: "work-definition-kind-value" }, fn = { class: "work-definition-flags" }, mn = { class: "work-definition-usage" }, pn = { class: "work-definition-actions" }, gn = ["inert"], Kl = /* @__PURE__ */ Te({
  __name: "DefinitionRow",
  props: /* @__PURE__ */ Uo({
    title: {},
    code: {},
    kind: {},
    kindLabel: {},
    description: {},
    initialOpen: { type: Boolean },
    routeSection: {},
    routeId: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = e, t = Io(e, "open");
    a.initialOpen && (t.value = !0);
    const l = Do(), o = al(ol, void 0);
    function r(m) {
      return !!a.routeSection && !!a.routeId && m === a.routeSection + "/" + a.routeId;
    }
    De(() => o?.selected.value, (m, g) => {
      r(m) ? t.value = !0 : r(g) && (t.value = !1);
    }, { immediate: !0 });
    function v() {
      t.value = !t.value, a.routeSection && a.routeId && o?.choose(a.routeSection, a.routeId, t.value);
    }
    return (m, g) => (n(), f("article", tn, [
      s("header", {
        class: ft(["work-definition-head", { "work-definition-has-handle": u(l).handle }])
      }, [
        u(l).handle ? (n(), f("div", an, [
          Ye(m.$slots, "handle")
        ])) : C("", !0),
        s("div", ln, [
          k(Gl, {
            class: "work-definition-toggle",
            "aria-expanded": t.value,
            onActivate: v
          }, {
            default: q(() => [
              k(u(pe), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              }),
              s("span", {
                class: "work-row-title",
                title: e.title
              }, T(e.title), 9, on)
            ]),
            _: 1
          }, 8, ["aria-expanded"]),
          e.description ? (n(), f("p", nn, T(e.description), 1)) : C("", !0)
        ]),
        s("div", sn, [
          s("span", rn, [
            e.code ? (n(), f("code", {
              key: 0,
              class: "work-mono",
              title: e.code
            }, T(e.code), 9, dn)) : C("", !0)
          ]),
          s("span", un, [
            e.kind ? (n(), H(u(tt), {
              key: 0,
              severity: "secondary"
            }, {
              default: q(() => [
                e.kindLabel ? (n(), f("span", cn, T(e.kindLabel) + ":", 1)) : C("", !0),
                s("span", vn, T(e.kind), 1)
              ]),
              _: 1
            })) : C("", !0),
            Ye(m.$slots, "status")
          ]),
          s("span", fn, [
            Ye(m.$slots, "flags")
          ]),
          s("div", mn, [
            Ye(m.$slots, "usage")
          ])
        ]),
        s("div", pn, [
          Ye(m.$slots, "actions")
        ])
      ], 2),
      k(jl, {
        name: "work-panel",
        persisted: ""
      }, {
        default: q(() => [
          bt(s("div", {
            inert: !t.value,
            class: "work-definition-body work-stack"
          }, [
            Ye(m.$slots, "default")
          ], 8, gn), [
            [Ct, t.value]
          ])
        ]),
        _: 3
      })
    ]));
  }
}), bn = { class: "work-definition-scroll" }, hn = {
  key: 0,
  class: "work-definition-columns",
  "aria-hidden": "true"
}, yn = { key: 0 }, kn = { class: "work-definition-usage" }, Hl = /* @__PURE__ */ Te({
  __name: "DefinitionList",
  props: {
    count: {},
    columns: {}
  },
  setup(e) {
    return (a, t) => (n(), f("div", bn, [
      s("div", {
        class: ft(["work-field-builder", "work-definitions-" + e.columns])
      }, [
        e.count > 3 && e.columns !== "plugins" ? (n(), f("div", hn, [
          t[0] || (t[0] = s("span", null, null, -1)),
          t[1] || (t[1] = s("span", null, "Name", -1)),
          t[2] || (t[2] = s("span", { class: "work-definition-code" }, "Identifier", -1)),
          s("span", null, T(e.columns === "types" ? "Workflow" : "Kind"), 1),
          e.columns === "fields" ? (n(), f("span", yn, "Details")) : C("", !0),
          s("span", kn, T(e.columns === "fields" ? "Used by" : "Details"), 1),
          t[3] || (t[3] = s("span", null, null, -1))
        ])) : C("", !0),
        Ye(a.$slots, "default")
      ], 2)
    ]));
  }
}), wn = [
  { code: "key", form: "text", index: "key" },
  { code: "type", form: "text", index: "key" },
  { code: "state", form: "text", index: "key" },
  { code: "category", form: "text", index: "key" },
  { code: "rank", form: "text", index: "key" },
  { code: "parent", form: "text", index: "key" },
  { code: "created_at", form: "time", index: "key" },
  { code: "updated_at", form: "time", index: "key" }
];
function $n(e) {
  const a = e.compiled.processes?.flatMap((t) => t.states.map((l) => ({ id: l.id, label: l.name }))) ?? [];
  return [...wn.filter((t) => t.code !== "rank").map((t) => t.code === "state" ? { ...t, type: "option", options: a } : t.code === "category" ? { ...t, type: "option", options: ["triage", "backlog", "unstarted", "started", "completed", "canceled"].map((l) => ({ id: l })) } : t), ...(e.compiled.fields ?? []).filter((t) => t.index && t.index !== "none")];
}
function Vn(e) {
  if (e?.cardinality && e.cardinality !== "one") return ["has", "in", "nin", "is_null", ...e.type === "principal" ? ["member_of"] : []];
  const a = ["eq", "neq", "in", "nin", "is_null", ...e?.type === "principal" ? ["member_of"] : []];
  return e && (["int", "number", "dec", "time", "quantity"].includes(e.form ?? "") || e.index === "number") && a.push("lt", "lte", "gt", "gte", "between"), e?.form === "text" && e.type !== "option" && a.push("contains", "starts_with"), a;
}
const xn = { class: "work-field-control" }, Cn = ["id"], Sn = {
  key: 1,
  class: "work-stack work-tight"
}, Tn = { class: "work-chips" }, In = {
  key: 5,
  class: "work-row"
}, Dn = ["inert"], Un = ["value"], En = {
  key: 1,
  class: "work-muted"
}, An = ["inert"], On = ["value"], Pn = {
  key: 1,
  class: "work-muted"
}, Rn = {
  key: 11,
  class: "work-stack work-tight"
}, Nn = {
  class: "work-stack work-tight",
  "aria-label": "Matching items"
}, Mn = { class: "work-mono" }, Fn = {
  key: 15,
  class: "work-error work-small",
  role: "alert"
}, qo = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = L(() => t.inputId ?? `field-${t.field.code}`), r = L(() => !!t.field.cardinality && t.field.cardinality !== "one"), v = L(() => Array.isArray(t.modelValue) ? t.modelValue : []), m = L(() => t.modelValue == null ? "" : typeof t.modelValue == "object" ? Ht(t.modelValue) : String(t.modelValue)), g = L(() => {
      const h = t.modelValue;
      return h && typeof h == "object" && "ref" in h && Array.isArray(h.ref) ? String(h.ref[1] ?? "") : "";
    }), i = L(() => t.disabled || no(t.field)), d = B(!1), c = B(!1), x = B(!1), y = B(""), b = B(""), p = B([]), w = sa(), V = B([]);
    let $ = 0, S;
    const D = /* @__PURE__ */ new Set();
    De(v, (h) => {
      V.value = S ?? h.map((U, R) => V.value[R] ?? $++), S = void 0;
    }, { immediate: !0 });
    function z(h) {
      l("update:modelValue", h);
    }
    function le(h, U) {
      const R = [...v.value];
      R[h] = U, z(R);
    }
    function J(h, U) {
      U ? D.delete(h) : D.add(h), l("validity", !D.size);
    }
    function ce(h) {
      D.delete(V.value[h]), l("validity", !D.size), S = V.value.filter((U, R) => R !== h), z(v.value.filter((U, R) => R !== h));
    }
    function me() {
      S = [...V.value, $++], z([...v.value, t.field.form === "bool" ? !1 : t.field.form === "record" ? {} : ""]);
    }
    function be(h) {
      const U = h.detail, R = U?.principal_id ?? U?.id;
      z(R ? { kind: U.type ?? "user", id: R } : void 0);
    }
    function he(h) {
      const U = h.detail;
      z(U?.thread_id ? { ref: ["component", U.thread_id] } : void 0);
    }
    const se = B("");
    let O = "";
    De(() => t.modelValue, (h) => {
      const U = JSON.stringify(h ?? {}, null, 2);
      U !== O && (O = U, se.value = U, y.value = "", l("validity", !0));
    }, { immediate: !0 });
    function Q(h) {
      se.value = h;
      try {
        const U = JSON.parse(h);
        if (!U || typeof U != "object" || Array.isArray(U)) throw new Error("Enter a JSON object.");
        if (t.field.type === "rich_text" && !("type" in U && typeof U.type == "string")) throw new Error("The document needs a type.");
        O = JSON.stringify(U, null, 2), y.value = "", l("validity", !0), z(U);
      } catch (U) {
        y.value = U instanceof Error ? U.message : "Invalid JSON.", l("validity", !1);
      }
    }
    function M(h) {
      if (!h) {
        l("validity", !0), z(void 0);
        return;
      }
      const U = Number.isFinite(Number(h)) && (t.field.form !== "int" || Number.isSafeInteger(Number(h)));
      l("validity", U), U && z(t.field.form === "int" ? Number(h) : h);
    }
    const ne = L(() => t.field.config?.format === "date");
    function xe(h) {
      z(h ? ne.value ? h : new Date(h).toISOString() : void 0);
    }
    const Oe = L(() => {
      if (typeof t.modelValue != "string") return "";
      if (ne.value) return t.modelValue.slice(0, 10);
      const h = new Date(t.modelValue);
      return Number.isNaN(h.getTime()) ? "" : new Date(h.getTime() - h.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    });
    function K(h) {
      z(h.detail?.ref);
    }
    function j(h) {
      z(h.detail?.value);
    }
    let N;
    De(b, () => {
      const h = w();
      if (clearTimeout(N), !b.value.trim()) {
        p.value = [];
        return;
      }
      N = setTimeout(async () => {
        try {
          const U = b.value.trim(), R = /^[A-Z][A-Z0-9]{1,9}-[0-9]+$/.test(U) ? [(await Rt.item(t.boardId, { key: U })).item] : (await Rt.query(t.boardId, { where: { field: "title", op: "contains", value: U }, limit: 8 })).items;
          h() && (p.value = R, y.value = "");
        } catch (U) {
          h() && (y.value = vt(U, "Could not search items."));
        }
      }, 200);
    });
    function ve(h) {
      z({ board: t.boardId, item: h.id }), b.value = "", p.value = [];
    }
    Ua(async () => {
      t.field.type === "principal" ? d.value = await Mt("wc-principal-picker") : t.field.config?.target === "component" && (d.value = await Mt("wc-component-picker"));
    });
    for (const [h, U] of [[() => t.editorTag, x], [() => t.linkTag, c]])
      De(h, async (R, E, G) => {
        let re = !0;
        if (G(() => {
          re = !1;
        }), U.value = !1, R) {
          const ee = await Mt(R);
          re && (U.value = ee);
        }
      }, { immediate: !0 });
    return ql(() => {
      clearTimeout(N), w();
    }), (h, U) => {
      const R = Eo("FieldControl", !0);
      return n(), f("div", xn, [
        u(no)(e.field) ? (n(), f("output", {
          key: 0,
          id: o.value,
          class: "work-read-value"
        }, T(u(Ht)(e.modelValue, e.field)), 9, Cn)) : r.value ? (n(), f("div", Sn, [
          s("div", Tn, [
            (n(!0), f(te, null, fe(v.value, (E, G) => (n(), H(u(tt), {
              key: V.value[G],
              class: "kx-tag-sm",
              severity: "secondary"
            }, {
              default: q(() => [
                W(T(u(Ht)(E, e.field)) + " ", 1),
                k(u(ae), {
                  type: "button",
                  class: "work-icon-button",
                  disabled: i.value,
                  "aria-label": "Remove value " + (G + 1),
                  onClick: (re) => ce(G),
                  severity: "secondary",
                  text: "",
                  size: "small"
                }, {
                  default: q(() => [
                    k(u(pe), {
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
          (n(!0), f(te, null, fe(v.value, (E, G) => (n(), f("div", {
            key: V.value[G],
            class: "work-stack work-tight"
          }, [
            k(R, {
              "board-id": e.boardId,
              field: { ...e.field, cardinality: "one" },
              "model-value": E,
              "input-id": o.value + "-" + V.value[G],
              disabled: i.value,
              "editor-tag": e.editorTag,
              "link-tag": e.linkTag,
              "onUpdate:modelValue": (re) => le(G, re),
              onValidity: (re) => J(V.value[G], re)
            }, null, 8, ["board-id", "field", "model-value", "input-id", "disabled", "editor-tag", "link-tag", "onUpdate:modelValue", "onValidity"])
          ]))), 128)),
          k(u(ae), {
            label: "Add value",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: me,
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])) : e.editorTag && x.value ? (n(), H(Sa(e.editorTag), {
          key: 2,
          "board-id": e.boardId,
          value: JSON.stringify(e.modelValue ?? null),
          config: JSON.stringify(e.field.config ?? {}),
          readonly: i.value || void 0,
          onChange: j
        }, null, 40, ["board-id", "value", "config", "readonly"])) : e.linkTag && c.value ? (n(), H(Sa(e.linkTag), {
          key: 3,
          "board-id": e.boardId,
          kind: e.field.config?.target ?? e.field.type,
          value: JSON.stringify(e.modelValue ?? null),
          readonly: i.value || void 0,
          onChange: K
        }, null, 40, ["board-id", "kind", "value", "readonly"])) : e.field.type === "option" ? (n(), H(u(ge), {
          key: 4,
          placeholder: "Not set",
          inputId: o.value,
          "model-value": e.modelValue ?? "",
          disabled: i.value,
          "onUpdate:modelValue": U[0] || (U[0] = (E) => z(E || void 0)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Not set", value: "", disabled: !1 }, ...(e.field.options ?? []).map((E) => ({ label: E.label ?? E.id, value: E.id, disabled: !1 }))]
        }, null, 8, ["inputId", "model-value", "disabled", "options"])) : e.field.form === "bool" ? (n(), f("label", In, [
          k(u(Zt), {
            inputId: o.value,
            "model-value": e.modelValue === !0,
            disabled: i.value,
            "onUpdate:modelValue": U[1] || (U[1] = (E) => z(E)),
            binary: ""
          }, null, 8, ["inputId", "model-value", "disabled"]),
          W(T(e.modelValue === !0 ? "Yes" : e.modelValue === !1 ? "No" : "Not set"), 1)
        ])) : e.field.form === "int" ? (n(), H(u(St), {
          key: 6,
          inputId: o.value,
          "model-value": m.value === "" ? null : Number(m.value),
          disabled: i.value,
          "onUpdate:modelValue": U[2] || (U[2] = (E) => M(E == null ? "" : String(E))),
          useGrouping: !1
        }, null, 8, ["inputId", "model-value", "disabled"])) : e.field.form === "dec" ? (n(), H(u(Ae), {
          key: 7,
          id: o.value,
          inputmode: "decimal",
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": U[3] || (U[3] = (E) => M(E ?? ""))
        }, null, 8, ["id", "model-value", "disabled"])) : e.field.form === "time" ? (n(), H(u(Ae), {
          key: 8,
          id: o.value,
          type: ne.value ? "date" : "datetime-local",
          value: Oe.value,
          disabled: i.value,
          onInput: U[4] || (U[4] = (E) => xe(E.target.value))
        }, null, 8, ["id", "type", "value", "disabled"])) : e.field.type === "principal" ? (n(), f("div", {
          key: 9,
          inert: i.value || void 0,
          class: "work-stack work-tight"
        }, [
          d.value ? (n(), f("wc-principal-picker", {
            key: 0,
            value: JSON.stringify(e.modelValue ?? {}),
            kinds: "user,group",
            onConfigChanged: be
          }, null, 40, Un)) : (n(), f("span", En, T(u(Ht)(e.modelValue, e.field)) + " · Person picker is unavailable.", 1))
        ], 8, Dn)) : e.field.config?.target === "component" ? (n(), f("div", {
          key: 10,
          inert: i.value || void 0
        }, [
          d.value ? (n(), f("wc-component-picker", {
            key: 0,
            value: JSON.stringify({ thread_id: g.value }),
            onChange: he
          }, null, 40, On)) : (n(), f("span", Pn, "Component picker is unavailable."))
        ], 8, An)) : e.field.type === "item" ? (n(), f("div", Rn, [
          k(u(tt), {
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              W(T(u(Ht)(e.modelValue, e.field)), 1)
            ]),
            _: 1
          }),
          k(u(Ae), {
            id: o.value,
            modelValue: b.value,
            "onUpdate:modelValue": U[5] || (U[5] = (E) => b.value = E),
            disabled: i.value,
            placeholder: "Search a title or enter an item key",
            "aria-label": "Search items"
          }, null, 8, ["id", "modelValue", "disabled"]),
          s("div", Nn, [
            (n(!0), f(te, null, fe(p.value, (E) => (n(), H(Gl, {
              key: E.id,
              class: "work-match-item",
              disabled: i.value,
              onActivate: (G) => ve(E)
            }, {
              default: q(() => [
                s("code", Mn, T(E.key), 1),
                s("span", null, T(u(Ht)(E.values.title)), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onActivate"]))), 128))
          ]),
          e.modelValue ? (n(), H(u(ae), {
            key: 0,
            label: "Clear reference",
            severity: "secondary",
            size: "small",
            disabled: i.value,
            onClick: U[6] || (U[6] = (E) => z(void 0)),
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:list-check",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])) : C("", !0)
        ])) : e.field.form === "record" || e.field.type === "rich_text" || e.field.form === "quantity" || e.field.form === "ref" ? (n(), H(u(Da), {
          key: 12,
          id: o.value,
          "model-value": se.value,
          rows: "3",
          disabled: i.value,
          "aria-invalid": !!y.value,
          "onUpdate:modelValue": U[7] || (U[7] = (E) => Q(E ?? ""))
        }, null, 8, ["id", "model-value", "disabled", "aria-invalid"])) : e.field.code === "description" ? (n(), H(u(Da), {
          key: 13,
          id: o.value,
          "model-value": m.value,
          rows: "4",
          disabled: i.value,
          "onUpdate:modelValue": U[8] || (U[8] = (E) => z(E))
        }, null, 8, ["id", "model-value", "disabled"])) : (n(), H(u(Ae), {
          key: 14,
          id: o.value,
          "model-value": m.value,
          disabled: i.value,
          "onUpdate:modelValue": U[9] || (U[9] = (E) => z(E))
        }, null, 8, ["id", "model-value", "disabled"])),
        y.value ? (n(), f("span", Fn, T(y.value), 1)) : C("", !0)
      ]);
    };
  }
}), Ln = { class: "work-stack work-tight work-operand-control" }, Bn = { class: "work-row work-small" }, zn = {
  key: 1,
  class: "work-muted work-small"
}, jn = {
  key: 2,
  class: "work-stack work-tight"
}, qn = { class: "work-small" }, Wn = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, pa = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = L(() => "$actor" in ut(t.modelValue) ? "actor" : "$now" in ut(t.modelValue) ? "now" : "literal"), r = B(""), v = B("");
    De(() => t.modelValue, (i) => {
      r.value = JSON.stringify(i ?? []), v.value = "";
    }, { immediate: !0 });
    function m(i) {
      l("update:modelValue", i === "actor" ? { $actor: "id" } : i === "now" ? { $now: "P0D" } : void 0), l("validity", !0);
    }
    function g(i) {
      r.value = i;
      try {
        const d = JSON.parse(i);
        if (!Array.isArray(d)) throw new Error("Enter a JSON list.");
        v.value = "", l("validity", !0), l("update:modelValue", d);
      } catch (d) {
        v.value = d instanceof Error ? d.message : "Invalid values.", l("validity", !1);
      }
    }
    return (i, d) => (n(), f("div", Ln, [
      s("label", Bn, [
        W(T(e.label), 1),
        k(u(ge), {
          "aria-label": e.label + " operand",
          "model-value": o.value,
          disabled: e.disabled,
          "onUpdate:modelValue": d[0] || (d[0] = (c) => m(c)),
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          optionDisabled: "disabled",
          options: [{ label: "Value", value: "literal", disabled: !1 }, { label: "Current actor ($actor)", value: "actor", disabled: !1 }, { label: "Current time ($now)", value: "now", disabled: !1 }]
        }, null, 8, ["aria-label", "model-value", "disabled"])
      ]),
      o.value === "now" ? (n(), H(u(Ae), {
        key: 0,
        "aria-label": e.label + " time offset",
        value: u(ut)(e.modelValue).$now,
        disabled: e.disabled,
        placeholder: "-P7D",
        onInput: d[1] || (d[1] = (c) => l("update:modelValue", { $now: c.target.value }))
      }, null, 8, ["aria-label", "value", "disabled"])) : o.value === "actor" ? (n(), f("span", zn, "The signed-in actor’s id")) : e.multiple ? (n(), f("div", jn, [
        s("label", qn, [
          d[5] || (d[5] = W("Values as JSON (operands may appear in the list)", -1)),
          k(u(Da), {
            class: "work-mono",
            "aria-label": e.label + " values",
            value: r.value,
            disabled: e.disabled,
            rows: "2",
            onInput: d[2] || (d[2] = (c) => g(c.target.value))
          }, null, 8, ["aria-label", "value", "disabled"])
        ]),
        v.value ? (n(), f("p", Wn, T(v.value), 1)) : C("", !0)
      ])) : (n(), H(qo, {
        key: 3,
        "board-id": e.boardId,
        field: { ...e.field, cardinality: "one" },
        "model-value": e.modelValue,
        disabled: e.disabled,
        "input-id": e.label.replace(/[^a-z0-9]/gi, "-"),
        "onUpdate:modelValue": d[3] || (d[3] = (c) => l("update:modelValue", c)),
        onValidity: d[4] || (d[4] = (c) => l("validity", c))
      }, null, 8, ["board-id", "field", "model-value", "disabled", "input-id"]))
    ]));
  }
}), Gn = ["disabled"], Kn = { class: "work-small work-mono" }, Hn = { class: "work-row work-small" }, Yn = { class: "work-row work-wrap" }, Xn = { key: 3 }, Jn = { class: "work-row work-wrap" }, Zn = { class: "work-row" }, Qn = { class: "work-row" }, _n = { class: "work-row" }, es = {
  key: 3,
  class: "work-row work-wrap"
}, ts = { class: "work-row work-wrap" }, as = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = L(() => t.path ?? "where"), r = L(() => t.depth ?? 1), v = L(() => ["and", "or", "not", "history", "match", "rel", "children"].find((se) => se in t.modelValue) ?? "field"), m = L(() => $n(t.schema)), g = L(() => m.value.find((se) => se.code === t.modelValue.field) ?? { code: "value", form: "text" }), i = L(() => ut(t.modelValue.history)), d = L(() => m.value.find((se) => se.code === i.value.field) ?? { code: "history", form: "text" }), c = L(() => Array.isArray(t.modelValue[v.value]) ? t.modelValue[v.value] : []), x = {
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
    }, y = {
      field: "Field value",
      and: "All conditions",
      or: "Any condition",
      not: "Condition is false",
      history: "Value history",
      rel: "Linked items",
      children: "Child items",
      match: "Search text"
    }, b = () => ({ field: "category", op: "eq", value: "unstarted" }), p = B(/* @__PURE__ */ new Set());
    function w(se, O) {
      O ? p.value.delete(se) : p.value.add(se), l("validity", p.value.size === 0);
    }
    De(v, () => {
      p.value.clear(), l("validity", !0);
    });
    function V(se) {
      const O = /* @__PURE__ */ new Set();
      for (const Q of p.value) {
        const M = Number(Q);
        !Number.isNaN(M) && M !== se && O.add(String(M > se ? M - 1 : M));
      }
      p.value = O, l("validity", O.size === 0), S({ [v.value]: c.value.filter((Q, M) => M !== se) });
    }
    function $(se) {
      l("update:modelValue", se);
    }
    function S(se) {
      $({ ...t.modelValue, ...se });
    }
    function D(se) {
      $(se === "field" ? b() : se === "and" || se === "or" ? { [se]: [b()] } : se === "not" ? { not: b() } : se === "history" ? { history: { field: "state", changed: !0 } } : se === "match" ? { match: "" } : se === "children" ? { children: !0, q: "some", where: b() } : { rel: t.schema.compiled.relation_types?.[0]?.id ?? "", dir: "outward", q: "some", where: b() });
    }
    function z(se, O) {
      S({ [v.value]: c.value.map((Q, M) => M === se ? O : Q) });
    }
    function le(se, O) {
      const Q = { ...i.value };
      O === void 0 ? (delete Q[se], w(se, !0)) : Q[se] = O, S({ history: Q });
    }
    function J(se) {
      p.value.clear(), l("validity", !0);
      const O = { ...i.value };
      delete O.was, delete O.changed, delete O.from, delete O.to, O[se] = se === "changed" ? !0 : "", S({ history: O });
    }
    const ce = { code: "actor", form: "text" }, me = { code: "at", form: "time" }, be = L(() => Array.isArray(i.value.during) ? i.value.during : []);
    function he(se, O) {
      const Q = [...be.value];
      Q[se] = O, le("during", Q);
    }
    return (se, O) => {
      const Q = Eo("FilterNode", !0);
      return n(), f("fieldset", {
        class: "work-filter-node",
        disabled: e.disabled
      }, [
        s("legend", Kn, T(o.value), 1),
        s("label", Hn, [
          O[21] || (O[21] = W("Condition", -1)),
          k(u(ge), {
            "aria-label": o.value + " condition",
            "model-value": v.value,
            "onUpdate:modelValue": O[0] || (O[0] = (M) => D(M)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            optionDisabled: "disabled",
            options: Object.entries(y).map(([M, ne]) => ({ label: ne, value: M, disabled: r.value >= 6 && ["and", "or", "not", "rel", "children"].includes(M) }))
          }, null, 8, ["aria-label", "model-value", "options"])
        ]),
        v.value === "and" || v.value === "or" ? (n(), f(te, { key: 0 }, [
          (n(!0), f(te, null, fe(c.value, (M, ne) => (n(), f("div", {
            key: ne,
            class: "work-stack work-tight"
          }, [
            k(Q, {
              "board-id": e.boardId,
              schema: e.schema,
              "model-value": M,
              path: o.value + "." + v.value + "[" + ne + "]",
              depth: r.value + 1,
              "onUpdate:modelValue": (xe) => z(ne, xe),
              onValidity: (xe) => w(String(ne), xe)
            }, null, 8, ["board-id", "schema", "model-value", "path", "depth", "onUpdate:modelValue", "onValidity"]),
            k(u(ae), {
              label: "Remove condition",
              size: "small",
              severity: "secondary",
              onClick: (xe) => V(ne),
              outlined: ""
            }, {
              icon: q(() => [
                k(u(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]))), 128)),
          k(u(ae), {
            label: "Add condition",
            size: "small",
            severity: "secondary",
            disabled: r.value >= 6,
            onClick: O[1] || (O[1] = (M) => S({ [v.value]: [...c.value, b()] })),
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ], 64)) : v.value === "not" ? (n(), H(Q, {
          key: 1,
          "board-id": e.boardId,
          schema: e.schema,
          "model-value": u(ut)(e.modelValue.not),
          path: o.value + ".not",
          depth: r.value + 1,
          "onUpdate:modelValue": O[2] || (O[2] = (M) => S({ not: M })),
          onValidity: O[3] || (O[3] = (M) => w("nested", M))
        }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])) : v.value === "field" ? (n(), f(te, { key: 2 }, [
          s("div", Yn, [
            s("label", null, [
              O[22] || (O[22] = W("Field", -1)),
              k(u(ge), {
                "aria-label": o.value + " field",
                "model-value": e.modelValue.field,
                "onUpdate:modelValue": O[4] || (O[4] = (M) => S({ field: M, op: "eq", value: void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((M) => ({ label: u(et)(M), value: M.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              O[23] || (O[23] = W("Comparison", -1)),
              k(u(ge), {
                "aria-label": o.value + " operator",
                "model-value": e.modelValue.op,
                "onUpdate:modelValue": O[5] || (O[5] = (M) => S({ op: M, value: M === "is_null" ? !0 : void 0 })),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: u(Vn)(g.value).map((M) => ({ value: M, label: x[M] }))
              }, null, 8, ["aria-label", "model-value", "options"])
            ])
          ]),
          k(pa, {
            "board-id": e.boardId,
            field: e.modelValue.op === "is_null" ? { code: "null", form: "bool" } : g.value,
            "model-value": e.modelValue.value,
            multiple: ["in", "nin", "between"].includes(String(e.modelValue.op)),
            label: o.value + " value",
            "onUpdate:modelValue": O[6] || (O[6] = (M) => S({ value: M })),
            onValidity: O[7] || (O[7] = (M) => w("value", M))
          }, null, 8, ["board-id", "field", "model-value", "multiple", "label"])
        ], 64)) : v.value === "match" ? (n(), f("label", Xn, [
          O[24] || (O[24] = W("Search", -1)),
          k(u(Ae), {
            "aria-label": o.value + " search",
            value: e.modelValue.match,
            onInput: O[8] || (O[8] = (M) => S({ match: M.target.value }))
          }, null, 8, ["aria-label", "value"])
        ])) : v.value === "history" ? (n(), f(te, { key: 4 }, [
          s("div", Jn, [
            s("label", null, [
              O[25] || (O[25] = W("Field", -1)),
              k(u(ge), {
                "aria-label": o.value + " history field",
                "model-value": i.value.field,
                "onUpdate:modelValue": O[9] || (O[9] = (M) => le("field", M)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [...(m.value ?? []).map((M) => ({ label: u(et)(M), value: M.code, disabled: !1 }))]
              }, null, 8, ["aria-label", "model-value", "options"])
            ]),
            s("label", null, [
              O[26] || (O[26] = W("History", -1)),
              k(u(ge), {
                "aria-label": o.value + " history mode",
                "model-value": i.value.changed ? "changed" : "was",
                "onUpdate:modelValue": O[10] || (O[10] = (M) => J(M)),
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                optionDisabled: "disabled",
                options: [{ label: "Changed", value: "changed", disabled: !1 }, { label: "Was", value: "was", disabled: !1 }]
              }, null, 8, ["aria-label", "model-value"])
            ])
          ]),
          i.value.changed ? (n(), f(te, { key: 0 }, fe(["from", "to"], (M) => s("div", { key: M }, [
            s("label", Zn, [
              k(u(Zt), {
                "model-value": M in i.value,
                "aria-label": "Constrain " + M,
                "onUpdate:modelValue": (ne) => le(M, ne ? "" : void 0),
                binary: ""
              }, null, 8, ["model-value", "aria-label", "onUpdate:modelValue"]),
              W(T(M), 1)
            ]),
            M in i.value ? (n(), H(pa, {
              key: 0,
              "board-id": e.boardId,
              field: d.value,
              "model-value": i.value[M],
              label: o.value + " history " + M,
              "onUpdate:modelValue": (ne) => le(M, ne),
              onValidity: (ne) => w(M, ne)
            }, null, 8, ["board-id", "field", "model-value", "label", "onUpdate:modelValue", "onValidity"])) : C("", !0)
          ])), 64)) : (n(), H(pa, {
            key: 1,
            "board-id": e.boardId,
            field: d.value,
            "model-value": i.value.was,
            label: o.value + " history was",
            "onUpdate:modelValue": O[11] || (O[11] = (M) => le("was", M)),
            onValidity: O[12] || (O[12] = (M) => w("was", M))
          }, null, 8, ["board-id", "field", "model-value", "label"])),
          s("label", Qn, [
            k(u(Zt), {
              "model-value": "by" in i.value,
              "aria-label": "Constrain actor",
              "onUpdate:modelValue": O[13] || (O[13] = (M) => le("by", M ? { $actor: "id" } : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[27] || (O[27] = W("By actor", -1))
          ]),
          "by" in i.value ? (n(), H(pa, {
            key: 2,
            "board-id": e.boardId,
            field: ce,
            "model-value": i.value.by,
            label: o.value + " history by",
            "onUpdate:modelValue": O[14] || (O[14] = (M) => le("by", M))
          }, null, 8, ["board-id", "model-value", "label"])) : C("", !0),
          s("label", _n, [
            k(u(Zt), {
              "model-value": "during" in i.value,
              "aria-label": "Constrain time window",
              "onUpdate:modelValue": O[15] || (O[15] = (M) => le("during", M ? [{ $now: "-P30D" }, { $now: "P0D" }] : void 0)),
              binary: ""
            }, null, 8, ["model-value"]),
            O[28] || (O[28] = W("During", -1))
          ]),
          "during" in i.value ? (n(), f("div", es, [
            (n(), f(te, null, fe(["start", "end"], (M, ne) => k(pa, {
              key: M,
              "board-id": e.boardId,
              field: me,
              "model-value": be.value[ne],
              label: o.value + " during " + M,
              "onUpdate:modelValue": (xe) => he(ne, xe)
            }, null, 8, ["board-id", "model-value", "label", "onUpdate:modelValue"])), 64))
          ])) : C("", !0)
        ], 64)) : (n(), f(te, { key: 5 }, [
          s("div", ts, [
            v.value === "rel" ? (n(), f(te, { key: 0 }, [
              s("label", null, [
                O[29] || (O[29] = W("Relation", -1)),
                k(u(ge), {
                  "model-value": e.modelValue.rel,
                  "onUpdate:modelValue": O[16] || (O[16] = (M) => S({ rel: M })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [...(e.schema.compiled.relation_types ?? []).map((M) => ({ label: M.outward ?? M.id, value: M.id, disabled: !1 }))]
                }, null, 8, ["model-value", "options"])
              ]),
              s("label", null, [
                O[30] || (O[30] = W("Direction", -1)),
                k(u(ge), {
                  "model-value": e.modelValue.dir,
                  "onUpdate:modelValue": O[17] || (O[17] = (M) => S({ dir: M })),
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Outward", value: "outward", disabled: !1 }, { label: "Inward", value: "inward", disabled: !1 }]
                }, null, 8, ["model-value"])
              ])
            ], 64)) : C("", !0),
            s("label", null, [
              O[31] || (O[31] = W("Quantifier", -1)),
              k(u(ge), {
                "model-value": e.modelValue.q,
                "onUpdate:modelValue": O[18] || (O[18] = (M) => S({ q: M })),
                appendTo: "self",
                options: ["some", "every", "none"]
              }, null, 8, ["model-value"])
            ])
          ]),
          k(Q, {
            "board-id": e.boardId,
            schema: e.schema,
            "model-value": u(ut)(e.modelValue.where),
            path: o.value + ".where",
            depth: r.value + 1,
            "onUpdate:modelValue": O[19] || (O[19] = (M) => S({ where: M })),
            onValidity: O[20] || (O[20] = (M) => w("nested", M))
          }, null, 8, ["board-id", "schema", "model-value", "path", "depth"])
        ], 64))
      ], 8, Gn);
    };
  }
}), ls = { class: "work-stack work-tight" }, os = { class: "work-row work-small" }, Yl = /* @__PURE__ */ Te({
  __name: "ConditionEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => ({ declaration: t.draft, compiled: t.draft, generation: 0, as_of: 0, key_prefix: "" })), r = /* @__PURE__ */ new Set();
    function v(g, i) {
      i ? r.delete(g) : r.add(g), l("validity", !r.size);
    }
    function m(g) {
      l("update:modelValue", g ? { field: t.draft.fields?.[0]?.code ?? "state", op: "eq" } : void 0), g || (r.clear(), l("validity", !0));
    }
    return Dt(() => l("validity", !0)), (g, i) => (n(), f("section", ls, [
      s("label", os, [
        k(u(nt), {
          "model-value": e.modelValue != null,
          "aria-label": e.label,
          "onUpdate:modelValue": m
        }, null, 8, ["model-value", "aria-label"]),
        W(T(e.label), 1)
      ]),
      e.modelValue != null ? (n(), H(as, {
        key: 0,
        schema: o.value,
        "board-id": e.boardId ?? "",
        "model-value": u(ut)(e.modelValue),
        path: e.label,
        "onUpdate:modelValue": i[0] || (i[0] = (d) => l("update:modelValue", d)),
        onValidity: i[1] || (i[1] = (d) => v("structured", d))
      }, null, 8, ["schema", "board-id", "model-value", "path"])) : C("", !0),
      e.modelValue != null ? (n(), H(Ft, {
        key: 1,
        label: e.label + " predicate",
        "model-value": e.modelValue,
        hint: "Use any predicate accepted by Work, including installed or deeply nested forms.",
        "onUpdate:modelValue": i[2] || (i[2] = (d) => l("update:modelValue", d)),
        onValidity: i[3] || (i[3] = (d) => v("raw", d))
      }, null, 8, ["label", "model-value"])) : C("", !0)
    ]));
  }
}), is = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, ns = ["aria-label"], ss = { class: "work-field-label" }, rs = {
  key: 0,
  class: "work-chips"
}, ds = ["kinds"], us = {
  key: 2,
  class: "work-muted work-small"
}, Xl = /* @__PURE__ */ Te({
  __name: "PrincipalsPicker",
  props: {
    modelValue: {},
    label: {},
    kinds: {},
    boardId: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), r = B(0), v = L(() => t.modelValue ?? []), { principalLabel: m, rememberPrincipal: g, nameError: i } = Po(() => t.boardId ?? "", () => v.value);
    Ua(async () => {
      o.value = await Mt("wc-principal-picker");
    });
    function d(c) {
      const x = c.detail, y = x?.principal_id ?? x?.id;
      if (!y) return;
      const b = { kind: x.type ?? "user", id: y };
      x.label && g(b, x.label), v.value.some((p) => p.id === y && p.kind === b.kind) || l("update:modelValue", [...v.value, b]), r.value++;
    }
    return (c, x) => (n(), f(te, null, [
      u(i) ? (n(), f("p", is, T(u(i)), 1)) : C("", !0),
      s("section", {
        class: "work-stack work-tight work-principals-picker",
        "aria-label": e.label
      }, [
        s("h4", ss, T(e.label), 1),
        v.value.length ? (n(), f("div", rs, [
          (n(!0), f(te, null, fe(v.value, (y, b) => (n(), H(u(tt), {
            key: y.kind + y.id,
            severity: "secondary",
            class: "kx-tag-sm"
          }, {
            default: q(() => [
              W(T(u(m)(y)), 1),
              k(u(ae), {
                text: "",
                severity: "secondary",
                size: "small",
                "aria-label": "Remove " + u(m)(y),
                onClick: (p) => l("update:modelValue", v.value.filter((w, V) => V !== b))
              }, {
                default: q(() => [
                  k(u(pe), { icon: "tabler:x" })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : C("", !0),
        o.value ? (n(), f("wc-principal-picker", {
          key: r.value,
          kinds: e.kinds ?? "user,group",
          onConfigChanged: d
        }, null, 40, ds)) : (n(), f("p", us, "People and group picker is unavailable."))
      ], 8, ns)
    ], 64));
  }
}), cs = { class: "work-stack work-tight" }, Wo = /* @__PURE__ */ Te({
  __name: "HoldersPicker",
  props: {
    modelValue: {},
    label: {},
    boardId: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => (t.modelValue ?? []).flatMap((v) => "user" in v ? [{ kind: "user", id: v.user }] : "group" in v ? [{ kind: "group", id: v.group }] : []));
    function r(v) {
      const m = [...(t.modelValue ?? []).filter((g) => "field" in g || "service" in g), ...v.map((g) => g.kind === "group" ? { group: g.id } : { user: g.id })];
      l("update:modelValue", m.length ? m : void 0);
    }
    return (v, m) => (n(), f("div", cs, [
      k(Xl, {
        "board-id": e.boardId,
        label: e.label,
        "model-value": o.value,
        "onUpdate:modelValue": r
      }, null, 8, ["board-id", "label", "model-value"]),
      k(Ft, {
        label: e.label + " rules",
        "model-value": e.modelValue,
        shape: "array",
        example: [{ group: "selected-group" }],
        "onUpdate:modelValue": m[0] || (m[0] = (g) => l("update:modelValue", g)),
        onValidity: m[1] || (m[1] = (g) => l("validity", g))
      }, null, 8, ["label", "model-value"])
    ]));
  }
}), vs = ["disabled"], fs = { class: "work-chips" }, ms = {
  key: 1,
  class: "work-muted work-small"
}, mt = /* @__PURE__ */ Te({
  __name: "ChipPicker",
  props: {
    label: {},
    options: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(""), r = L(() => t.options.map((g) => typeof g == "string" ? { value: g } : g)), v = L(() => r.value.filter((g) => (g.label ?? Me(g.value)).toLocaleLowerCase().includes(o.value.toLocaleLowerCase())));
    function m(g) {
      if (t.disabled) return;
      const i = t.modelValue ?? [];
      l("update:modelValue", i.includes(g) ? i.filter((d) => d !== g) : [...i, g]);
    }
    return (g, i) => (n(), f("fieldset", {
      class: "work-chip-picker",
      disabled: e.disabled
    }, [
      s("legend", null, T(e.label), 1),
      e.options.length > 10 ? (n(), H(u(Ae), {
        key: 0,
        modelValue: o.value,
        "onUpdate:modelValue": i[0] || (i[0] = (d) => o.value = d),
        type: "search",
        "aria-label": "Find " + e.label.toLowerCase(),
        placeholder: "Find a choice…"
      }, null, 8, ["modelValue", "aria-label"])) : C("", !0),
      s("div", fs, [
        k(u(Wl), {
          "model-value": e.modelValue ?? [],
          options: v.value.map((d) => ({ value: d.value, label: d.label ?? u(Me)(d.value) })),
          optionLabel: "label",
          optionValue: "value",
          multiple: "",
          disabled: e.disabled,
          "aria-label": e.label,
          "onUpdate:modelValue": i[1] || (i[1] = (d) => l("update:modelValue", d ?? []))
        }, null, 8, ["model-value", "options", "disabled", "aria-label"]),
        (n(!0), f(te, null, fe(e.modelValue?.filter((d) => !r.value.some((c) => c.value === d)) ?? [], (d) => (n(), H(u(ae), {
          severity: "secondary",
          text: "",
          size: "small",
          key: d,
          type: "button",
          class: "work-choice work-unavailable",
          "aria-label": "Remove unavailable " + d,
          onClick: (c) => m(d)
        }, {
          default: q(() => [
            W(T(u(Me)(d)) + " · unavailable ×", 1)
          ]),
          _: 2
        }, 1032, ["aria-label", "onClick"]))), 128))
      ]),
      e.options.length ? C("", !0) : (n(), f("span", ms, "No choices declared."))
    ], 8, vs));
  }
});
/**!
 * Sortable 1.15.7
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ps(e, a, t) {
  return (a = ys(a)) in e ? Object.defineProperty(e, a, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[a] = t, e;
}
function It() {
  return It = Object.assign ? Object.assign.bind() : function(e) {
    for (var a = 1; a < arguments.length; a++) {
      var t = arguments[a];
      for (var l in t) ({}).hasOwnProperty.call(t, l) && (e[l] = t[l]);
    }
    return e;
  }, It.apply(null, arguments);
}
function vo(e, a) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    a && (l = l.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function $t(e) {
  for (var a = 1; a < arguments.length; a++) {
    var t = arguments[a] != null ? arguments[a] : {};
    a % 2 ? vo(Object(t), !0).forEach(function(l) {
      ps(e, l, t[l]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : vo(Object(t)).forEach(function(l) {
      Object.defineProperty(e, l, Object.getOwnPropertyDescriptor(t, l));
    });
  }
  return e;
}
function gs(e, a) {
  if (e == null) return {};
  var t, l, o = bs(e, a);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    for (l = 0; l < r.length; l++) t = r[l], a.indexOf(t) === -1 && {}.propertyIsEnumerable.call(e, t) && (o[t] = e[t]);
  }
  return o;
}
function bs(e, a) {
  if (e == null) return {};
  var t = {};
  for (var l in e) if ({}.hasOwnProperty.call(e, l)) {
    if (a.indexOf(l) !== -1) continue;
    t[l] = e[l];
  }
  return t;
}
function hs(e, a) {
  if (typeof e != "object" || !e) return e;
  var t = e[Symbol.toPrimitive];
  if (t !== void 0) {
    var l = t.call(e, a);
    if (typeof l != "object") return l;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (a === "string" ? String : Number)(e);
}
function ys(e) {
  var a = hs(e, "string");
  return typeof a == "symbol" ? a : a + "";
}
function Al(e) {
  "@babel/helpers - typeof";
  return Al = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(a) {
    return typeof a;
  } : function(a) {
    return a && typeof Symbol == "function" && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
  }, Al(e);
}
var ks = "1.15.7";
function Tt(e) {
  if (typeof window < "u" && window.navigator)
    return !!/* @__PURE__ */ navigator.userAgent.match(e);
}
var Ut = Tt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i), Aa = Tt(/Edge/i), fo = Tt(/firefox/i), wa = Tt(/safari/i) && !Tt(/chrome/i) && !Tt(/android/i), Jl = Tt(/iP(ad|od|hone)/i), Go = Tt(/chrome/i) && Tt(/android/i), Ko = {
  capture: !1,
  passive: !1
};
function Ee(e, a, t) {
  e.addEventListener(a, t, !Ut && Ko);
}
function Ue(e, a, t) {
  e.removeEventListener(a, t, !Ut && Ko);
}
function Za(e, a) {
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
function Ho(e) {
  return e.host && e !== document && e.host.nodeType && e.host !== e ? e.host : e.parentNode;
}
function ht(e, a, t, l) {
  if (e) {
    t = t || document;
    do {
      if (a != null && (a[0] === ">" ? e.parentNode === t && Za(e, a) : Za(e, a)) || l && e === t)
        return e;
      if (e === t) break;
    } while (e = Ho(e));
  }
  return null;
}
var mo = /\s+/g;
function rt(e, a, t) {
  if (e && a)
    if (e.classList)
      e.classList[t ? "add" : "remove"](a);
    else {
      var l = (" " + e.className + " ").replace(mo, " ").replace(" " + a + " ", " ");
      e.className = (l + (t ? " " + a : "")).replace(mo, " ");
    }
}
function we(e, a, t) {
  var l = e && e.style;
  if (l) {
    if (t === void 0)
      return document.defaultView && document.defaultView.getComputedStyle ? t = document.defaultView.getComputedStyle(e, "") : e.currentStyle && (t = e.currentStyle), a === void 0 ? t : t[a];
    !(a in l) && a.indexOf("webkit") === -1 && (a = "-webkit-" + a), l[a] = t + (typeof t == "string" ? "" : "px");
  }
}
function ra(e, a) {
  var t = "";
  if (typeof e == "string")
    t = e;
  else
    do {
      var l = we(e, "transform");
      l && l !== "none" && (t = l + " " + t);
    } while (!a && (e = e.parentNode));
  var o = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return o && new o(t);
}
function Yo(e, a, t) {
  if (e) {
    var l = e.getElementsByTagName(a), o = 0, r = l.length;
    if (t)
      for (; o < r; o++)
        t(l[o], o);
    return l;
  }
  return [];
}
function kt() {
  var e = document.scrollingElement;
  return e || document.documentElement;
}
function Ke(e, a, t, l, o) {
  if (!(!e.getBoundingClientRect && e !== window)) {
    var r, v, m, g, i, d, c;
    if (e !== window && e.parentNode && e !== kt() ? (r = e.getBoundingClientRect(), v = r.top, m = r.left, g = r.bottom, i = r.right, d = r.height, c = r.width) : (v = 0, m = 0, g = window.innerHeight, i = window.innerWidth, d = window.innerHeight, c = window.innerWidth), (a || t) && e !== window && (o = o || e.parentNode, !Ut))
      do
        if (o && o.getBoundingClientRect && (we(o, "transform") !== "none" || t && we(o, "position") !== "static")) {
          var x = o.getBoundingClientRect();
          v -= x.top + parseInt(we(o, "border-top-width")), m -= x.left + parseInt(we(o, "border-left-width")), g = v + r.height, i = m + r.width;
          break;
        }
      while (o = o.parentNode);
    if (l && e !== window) {
      var y = ra(o || e), b = y && y.a, p = y && y.d;
      y && (v /= p, m /= b, c /= b, d /= p, g = v + d, i = m + c);
    }
    return {
      top: v,
      left: m,
      bottom: g,
      right: i,
      width: c,
      height: d
    };
  }
}
function po(e, a, t) {
  for (var l = Nt(e, !0), o = Ke(e)[a]; l; ) {
    var r = Ke(l)[t], v = void 0;
    if (v = o >= r, !v) return l;
    if (l === kt()) break;
    l = Nt(l, !1);
  }
  return !1;
}
function da(e, a, t, l) {
  for (var o = 0, r = 0, v = e.children; r < v.length; ) {
    if (v[r].style.display !== "none" && v[r] !== $e.ghost && (l || v[r] !== $e.dragged) && ht(v[r], t.draggable, e, !1)) {
      if (o === a)
        return v[r];
      o++;
    }
    r++;
  }
  return null;
}
function Zl(e, a) {
  for (var t = e.lastElementChild; t && (t === $e.ghost || we(t, "display") === "none" || a && !Za(t, a)); )
    t = t.previousElementSibling;
  return t || null;
}
function ct(e, a) {
  var t = 0;
  if (!e || !e.parentNode)
    return -1;
  for (; e = e.previousElementSibling; )
    e.nodeName.toUpperCase() !== "TEMPLATE" && e !== $e.clone && (!a || Za(e, a)) && t++;
  return t;
}
function go(e) {
  var a = 0, t = 0, l = kt();
  if (e)
    do {
      var o = ra(e), r = o.a, v = o.d;
      a += e.scrollLeft * r, t += e.scrollTop * v;
    } while (e !== l && (e = e.parentNode));
  return [a, t];
}
function ws(e, a) {
  for (var t in e)
    if (e.hasOwnProperty(t)) {
      for (var l in a)
        if (a.hasOwnProperty(l) && a[l] === e[t][l]) return Number(t);
    }
  return -1;
}
function Nt(e, a) {
  if (!e || !e.getBoundingClientRect) return kt();
  var t = e, l = !1;
  do
    if (t.clientWidth < t.scrollWidth || t.clientHeight < t.scrollHeight) {
      var o = we(t);
      if (t.clientWidth < t.scrollWidth && (o.overflowX == "auto" || o.overflowX == "scroll") || t.clientHeight < t.scrollHeight && (o.overflowY == "auto" || o.overflowY == "scroll")) {
        if (!t.getBoundingClientRect || t === document.body) return kt();
        if (l || a) return t;
        l = !0;
      }
    }
  while (t = t.parentNode);
  return kt();
}
function $s(e, a) {
  if (e && a)
    for (var t in a)
      a.hasOwnProperty(t) && (e[t] = a[t]);
  return e;
}
function gl(e, a) {
  return Math.round(e.top) === Math.round(a.top) && Math.round(e.left) === Math.round(a.left) && Math.round(e.height) === Math.round(a.height) && Math.round(e.width) === Math.round(a.width);
}
var $a;
function Xo(e, a) {
  return function() {
    if (!$a) {
      var t = arguments, l = this;
      t.length === 1 ? e.call(l, t[0]) : e.apply(l, t), $a = setTimeout(function() {
        $a = void 0;
      }, a);
    }
  };
}
function Vs() {
  clearTimeout($a), $a = void 0;
}
function Jo(e, a, t) {
  e.scrollLeft += a, e.scrollTop += t;
}
function Zo(e) {
  var a = window.Polymer, t = window.jQuery || window.Zepto;
  return a && a.dom ? a.dom(e).cloneNode(!0) : t ? t(e).clone(!0)[0] : e.cloneNode(!0);
}
function Qo(e, a, t) {
  var l = {};
  return Array.from(e.children).forEach(function(o) {
    var r, v, m, g;
    if (!(!ht(o, a.draggable, e, !1) || o.animated || o === t)) {
      var i = Ke(o);
      l.left = Math.min((r = l.left) !== null && r !== void 0 ? r : 1 / 0, i.left), l.top = Math.min((v = l.top) !== null && v !== void 0 ? v : 1 / 0, i.top), l.right = Math.max((m = l.right) !== null && m !== void 0 ? m : -1 / 0, i.right), l.bottom = Math.max((g = l.bottom) !== null && g !== void 0 ? g : -1 / 0, i.bottom);
    }
  }), l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l;
}
var it = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function xs() {
  var e = [], a;
  return {
    captureAnimationState: function() {
      if (e = [], !!this.options.animation) {
        var l = [].slice.call(this.el.children);
        l.forEach(function(o) {
          if (!(we(o, "display") === "none" || o === $e.ghost)) {
            e.push({
              target: o,
              rect: Ke(o)
            });
            var r = $t({}, e[e.length - 1].rect);
            if (o.thisAnimationDuration) {
              var v = ra(o, !0);
              v && (r.top -= v.f, r.left -= v.e);
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
      e.splice(ws(e, {
        target: l
      }), 1);
    },
    animateAll: function(l) {
      var o = this;
      if (!this.options.animation) {
        clearTimeout(a), typeof l == "function" && l();
        return;
      }
      var r = !1, v = 0;
      e.forEach(function(m) {
        var g = 0, i = m.target, d = i.fromRect, c = Ke(i), x = i.prevFromRect, y = i.prevToRect, b = m.rect, p = ra(i, !0);
        p && (c.top -= p.f, c.left -= p.e), i.toRect = c, i.thisAnimationDuration && gl(x, c) && !gl(d, c) && // Make sure animatingRect is on line between toRect & fromRect
        (b.top - c.top) / (b.left - c.left) === (d.top - c.top) / (d.left - c.left) && (g = Ss(b, x, y, o.options)), gl(c, d) || (i.prevFromRect = d, i.prevToRect = c, g || (g = o.options.animation), o.animate(i, b, c, g)), g && (r = !0, v = Math.max(v, g), clearTimeout(i.animationResetTimer), i.animationResetTimer = setTimeout(function() {
          i.animationTime = 0, i.prevFromRect = null, i.fromRect = null, i.prevToRect = null, i.thisAnimationDuration = null;
        }, g), i.thisAnimationDuration = g);
      }), clearTimeout(a), r ? a = setTimeout(function() {
        typeof l == "function" && l();
      }, v) : typeof l == "function" && l(), e = [];
    },
    animate: function(l, o, r, v) {
      if (v) {
        we(l, "transition", ""), we(l, "transform", "");
        var m = ra(this.el), g = m && m.a, i = m && m.d, d = (o.left - r.left) / (g || 1), c = (o.top - r.top) / (i || 1);
        l.animatingX = !!d, l.animatingY = !!c, we(l, "transform", "translate3d(" + d + "px," + c + "px,0)"), this.forRepaintDummy = Cs(l), we(l, "transition", "transform " + v + "ms" + (this.options.easing ? " " + this.options.easing : "")), we(l, "transform", "translate3d(0,0,0)"), typeof l.animated == "number" && clearTimeout(l.animated), l.animated = setTimeout(function() {
          we(l, "transition", ""), we(l, "transform", ""), l.animated = !1, l.animatingX = !1, l.animatingY = !1;
        }, v);
      }
    }
  };
}
function Cs(e) {
  return e.offsetWidth;
}
function Ss(e, a, t, l) {
  return Math.sqrt(Math.pow(a.top - e.top, 2) + Math.pow(a.left - e.left, 2)) / Math.sqrt(Math.pow(a.top - t.top, 2) + Math.pow(a.left - t.left, 2)) * l.animation;
}
var ea = [], bl = {
  initializeByDefault: !0
}, Oa = {
  mount: function(a) {
    for (var t in bl)
      bl.hasOwnProperty(t) && !(t in a) && (a[t] = bl[t]);
    ea.forEach(function(l) {
      if (l.pluginName === a.pluginName)
        throw "Sortable: Cannot mount plugin ".concat(a.pluginName, " more than once");
    }), ea.push(a);
  },
  pluginEvent: function(a, t, l) {
    var o = this;
    this.eventCanceled = !1, l.cancel = function() {
      o.eventCanceled = !0;
    };
    var r = a + "Global";
    ea.forEach(function(v) {
      t[v.pluginName] && (t[v.pluginName][r] && t[v.pluginName][r]($t({
        sortable: t
      }, l)), t.options[v.pluginName] && t[v.pluginName][a] && t[v.pluginName][a]($t({
        sortable: t
      }, l)));
    });
  },
  initializePlugins: function(a, t, l, o) {
    ea.forEach(function(m) {
      var g = m.pluginName;
      if (!(!a.options[g] && !m.initializeByDefault)) {
        var i = new m(a, t, a.options);
        i.sortable = a, i.options = a.options, a[g] = i, It(l, i.defaults);
      }
    });
    for (var r in a.options)
      if (a.options.hasOwnProperty(r)) {
        var v = this.modifyOption(a, r, a.options[r]);
        typeof v < "u" && (a.options[r] = v);
      }
  },
  getEventProperties: function(a, t) {
    var l = {};
    return ea.forEach(function(o) {
      typeof o.eventProperties == "function" && It(l, o.eventProperties.call(t[o.pluginName], a));
    }), l;
  },
  modifyOption: function(a, t, l) {
    var o;
    return ea.forEach(function(r) {
      a[r.pluginName] && r.optionListeners && typeof r.optionListeners[t] == "function" && (o = r.optionListeners[t].call(a[r.pluginName], l));
    }), o;
  }
};
function Ts(e) {
  var a = e.sortable, t = e.rootEl, l = e.name, o = e.targetEl, r = e.cloneEl, v = e.toEl, m = e.fromEl, g = e.oldIndex, i = e.newIndex, d = e.oldDraggableIndex, c = e.newDraggableIndex, x = e.originalEvent, y = e.putSortable, b = e.extraEventProperties;
  if (a = a || t && t[it], !!a) {
    var p, w = a.options, V = "on" + l.charAt(0).toUpperCase() + l.substr(1);
    window.CustomEvent && !Ut && !Aa ? p = new CustomEvent(l, {
      bubbles: !0,
      cancelable: !0
    }) : (p = document.createEvent("Event"), p.initEvent(l, !0, !0)), p.to = v || t, p.from = m || t, p.item = o || t, p.clone = r, p.oldIndex = g, p.newIndex = i, p.oldDraggableIndex = d, p.newDraggableIndex = c, p.originalEvent = x, p.pullMode = y ? y.lastPutMode : void 0;
    var $ = $t($t({}, b), Oa.getEventProperties(l, a));
    for (var S in $)
      p[S] = $[S];
    t && t.dispatchEvent(p), w[V] && w[V].call(a, p);
  }
}
var Is = ["evt"], ot = function(a, t) {
  var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = l.evt, r = gs(l, Is);
  Oa.pluginEvent.bind($e)(a, t, $t({
    dragEl: ie,
    parentEl: je,
    ghostEl: Se,
    rootEl: Le,
    nextEl: Yt,
    lastDownEl: Wa,
    cloneEl: ze,
    cloneHidden: Pt,
    dragStarted: ga,
    putSortable: _e,
    activeSortable: $e.active,
    originalEvent: o,
    oldIndex: na,
    oldDraggableIndex: Va,
    newIndex: dt,
    newDraggableIndex: Ot,
    hideGhostForTarget: ai,
    unhideGhostForTarget: li,
    cloneNowHidden: function() {
      Pt = !0;
    },
    cloneNowShown: function() {
      Pt = !1;
    },
    dispatchSortableEvent: function(m) {
      lt({
        sortable: t,
        name: m,
        originalEvent: o
      });
    }
  }, r));
};
function lt(e) {
  Ts($t({
    putSortable: _e,
    cloneEl: ze,
    targetEl: ie,
    rootEl: Le,
    oldIndex: na,
    oldDraggableIndex: Va,
    newIndex: dt,
    newDraggableIndex: Ot
  }, e));
}
var ie, je, Se, Le, Yt, Wa, ze, Pt, na, dt, Va, Ot, La, _e, aa = !1, Qa = !1, _a = [], Gt, gt, hl, yl, bo, ho, ga, ta, xa, Ca = !1, Ba = !1, Ga, at, kl = [], Ol = !1, el = [], il = typeof document < "u", za = Jl, yo = Aa || Ut ? "cssFloat" : "float", Ds = il && !Go && !Jl && "draggable" in document.createElement("div"), _o = (function() {
  if (il) {
    if (Ut)
      return !1;
    var e = document.createElement("x");
    return e.style.cssText = "pointer-events:auto", e.style.pointerEvents === "auto";
  }
})(), ei = function(a, t) {
  var l = we(a), o = parseInt(l.width) - parseInt(l.paddingLeft) - parseInt(l.paddingRight) - parseInt(l.borderLeftWidth) - parseInt(l.borderRightWidth), r = da(a, 0, t), v = da(a, 1, t), m = r && we(r), g = v && we(v), i = m && parseInt(m.marginLeft) + parseInt(m.marginRight) + Ke(r).width, d = g && parseInt(g.marginLeft) + parseInt(g.marginRight) + Ke(v).width;
  if (l.display === "flex")
    return l.flexDirection === "column" || l.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (l.display === "grid")
    return l.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && m.float && m.float !== "none") {
    var c = m.float === "left" ? "left" : "right";
    return v && (g.clear === "both" || g.clear === c) ? "vertical" : "horizontal";
  }
  return r && (m.display === "block" || m.display === "flex" || m.display === "table" || m.display === "grid" || i >= o && l[yo] === "none" || v && l[yo] === "none" && i + d > o) ? "vertical" : "horizontal";
}, Us = function(a, t, l) {
  var o = l ? a.left : a.top, r = l ? a.right : a.bottom, v = l ? a.width : a.height, m = l ? t.left : t.top, g = l ? t.right : t.bottom, i = l ? t.width : t.height;
  return o === m || r === g || o + v / 2 === m + i / 2;
}, Es = function(a, t) {
  var l;
  return _a.some(function(o) {
    var r = o[it].options.emptyInsertThreshold;
    if (!(!r || Zl(o))) {
      var v = Ke(o), m = a >= v.left - r && a <= v.right + r, g = t >= v.top - r && t <= v.bottom + r;
      if (m && g)
        return l = o;
    }
  }), l;
}, ti = function(a) {
  function t(r, v) {
    return function(m, g, i, d) {
      var c = m.options.group.name && g.options.group.name && m.options.group.name === g.options.group.name;
      if (r == null && (v || c))
        return !0;
      if (r == null || r === !1)
        return !1;
      if (v && r === "clone")
        return r;
      if (typeof r == "function")
        return t(r(m, g, i, d), v)(m, g, i, d);
      var x = (v ? m : g).options.group.name;
      return r === !0 || typeof r == "string" && r === x || r.join && r.indexOf(x) > -1;
    };
  }
  var l = {}, o = a.group;
  (!o || Al(o) != "object") && (o = {
    name: o
  }), l.name = o.name, l.checkPull = t(o.pull, !0), l.checkPut = t(o.put), l.revertClone = o.revertClone, a.group = l;
}, ai = function() {
  !_o && Se && we(Se, "display", "none");
}, li = function() {
  !_o && Se && we(Se, "display", "");
};
il && !Go && document.addEventListener("click", function(e) {
  if (Qa)
    return e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), Qa = !1, !1;
}, !0);
var Kt = function(a) {
  if (ie) {
    a = a.touches ? a.touches[0] : a;
    var t = Es(a.clientX, a.clientY);
    if (t) {
      var l = {};
      for (var o in a)
        a.hasOwnProperty(o) && (l[o] = a[o]);
      l.target = l.rootEl = t, l.preventDefault = void 0, l.stopPropagation = void 0, t[it]._onDragOver(l);
    }
  }
}, As = function(a) {
  ie && ie.parentNode[it]._isOutsideThisEl(a.target);
};
function $e(e, a) {
  if (!(e && e.nodeType && e.nodeType === 1))
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));
  this.el = e, this.options = a = It({}, a), e[it] = this;
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
      return ei(e, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: !0,
    animation: 0,
    easing: null,
    setData: function(v, m) {
      v.setData("Text", m.textContent);
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
    supportPointer: $e.supportPointer !== !1 && "PointerEvent" in window && (!wa || Jl),
    emptyInsertThreshold: 5
  };
  Oa.initializePlugins(this, e, t);
  for (var l in t)
    !(l in a) && (a[l] = t[l]);
  ti(a);
  for (var o in this)
    o.charAt(0) === "_" && typeof this[o] == "function" && (this[o] = this[o].bind(this));
  this.nativeDraggable = a.forceFallback ? !1 : Ds, this.nativeDraggable && (this.options.touchStartThreshold = 1), a.supportPointer ? Ee(e, "pointerdown", this._onTapStart) : (Ee(e, "mousedown", this._onTapStart), Ee(e, "touchstart", this._onTapStart)), this.nativeDraggable && (Ee(e, "dragover", this), Ee(e, "dragenter", this)), _a.push(this.el), a.store && a.store.get && this.sort(a.store.get(this) || []), It(this, xs());
}
$e.prototype = /** @lends Sortable.prototype */
{
  constructor: $e,
  _isOutsideThisEl: function(a) {
    !this.el.contains(a) && a !== this.el && (ta = null);
  },
  _getDirection: function(a, t) {
    return typeof this.options.direction == "function" ? this.options.direction.call(this, a, t, ie) : this.options.direction;
  },
  _onTapStart: function(a) {
    if (a.cancelable) {
      var t = this, l = this.el, o = this.options, r = o.preventOnFilter, v = a.type, m = a.touches && a.touches[0] || a.pointerType && a.pointerType === "touch" && a, g = (m || a).target, i = a.target.shadowRoot && (a.path && a.path[0] || a.composedPath && a.composedPath()[0]) || g, d = o.filter;
      if (Bs(l), !ie && !(/mousedown|pointerdown/.test(v) && a.button !== 0 || o.disabled) && !i.isContentEditable && !(!this.nativeDraggable && wa && g && g.tagName.toUpperCase() === "SELECT") && (g = ht(g, o.draggable, l, !1), !(g && g.animated) && Wa !== g)) {
        if (na = ct(g), Va = ct(g, o.draggable), typeof d == "function") {
          if (d.call(this, a, g, this)) {
            lt({
              sortable: t,
              rootEl: i,
              name: "filter",
              targetEl: g,
              toEl: l,
              fromEl: l
            }), ot("filter", t, {
              evt: a
            }), r && a.preventDefault();
            return;
          }
        } else if (d && (d = d.split(",").some(function(c) {
          if (c = ht(i, c.trim(), l, !1), c)
            return lt({
              sortable: t,
              rootEl: c,
              name: "filter",
              targetEl: g,
              fromEl: l,
              toEl: l
            }), ot("filter", t, {
              evt: a
            }), !0;
        }), d)) {
          r && a.preventDefault();
          return;
        }
        o.handle && !ht(i, o.handle, l, !1) || this._prepareDragStart(a, m, g);
      }
    }
  },
  _prepareDragStart: function(a, t, l) {
    var o = this, r = o.el, v = o.options, m = r.ownerDocument, g;
    if (l && !ie && l.parentNode === r) {
      var i = Ke(l);
      if (Le = r, ie = l, je = ie.parentNode, Yt = ie.nextSibling, Wa = l, La = v.group, $e.dragged = ie, Gt = {
        target: ie,
        clientX: (t || a).clientX,
        clientY: (t || a).clientY
      }, bo = Gt.clientX - i.left, ho = Gt.clientY - i.top, this._lastX = (t || a).clientX, this._lastY = (t || a).clientY, ie.style["will-change"] = "all", g = function() {
        if (ot("delayEnded", o, {
          evt: a
        }), $e.eventCanceled) {
          o._onDrop();
          return;
        }
        o._disableDelayedDragEvents(), !fo && o.nativeDraggable && (ie.draggable = !0), o._triggerDragStart(a, t), lt({
          sortable: o,
          name: "choose",
          originalEvent: a
        }), rt(ie, v.chosenClass, !0);
      }, v.ignore.split(",").forEach(function(d) {
        Yo(ie, d.trim(), wl);
      }), Ee(m, "dragover", Kt), Ee(m, "mousemove", Kt), Ee(m, "touchmove", Kt), v.supportPointer ? (Ee(m, "pointerup", o._onDrop), !this.nativeDraggable && Ee(m, "pointercancel", o._onDrop)) : (Ee(m, "mouseup", o._onDrop), Ee(m, "touchend", o._onDrop), Ee(m, "touchcancel", o._onDrop)), fo && this.nativeDraggable && (this.options.touchStartThreshold = 4, ie.draggable = !0), ot("delayStart", this, {
        evt: a
      }), v.delay && (!v.delayOnTouchOnly || t) && (!this.nativeDraggable || !(Aa || Ut))) {
        if ($e.eventCanceled) {
          this._onDrop();
          return;
        }
        v.supportPointer ? (Ee(m, "pointerup", o._disableDelayedDrag), Ee(m, "pointercancel", o._disableDelayedDrag)) : (Ee(m, "mouseup", o._disableDelayedDrag), Ee(m, "touchend", o._disableDelayedDrag), Ee(m, "touchcancel", o._disableDelayedDrag)), Ee(m, "mousemove", o._delayedDragTouchMoveHandler), Ee(m, "touchmove", o._delayedDragTouchMoveHandler), v.supportPointer && Ee(m, "pointermove", o._delayedDragTouchMoveHandler), o._dragStartTimer = setTimeout(g, v.delay);
      } else
        g();
    }
  },
  _delayedDragTouchMoveHandler: function(a) {
    var t = a.touches ? a.touches[0] : a;
    Math.max(Math.abs(t.clientX - this._lastX), Math.abs(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
  },
  _disableDelayedDrag: function() {
    ie && wl(ie), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function() {
    var a = this.el.ownerDocument;
    Ue(a, "mouseup", this._disableDelayedDrag), Ue(a, "touchend", this._disableDelayedDrag), Ue(a, "touchcancel", this._disableDelayedDrag), Ue(a, "pointerup", this._disableDelayedDrag), Ue(a, "pointercancel", this._disableDelayedDrag), Ue(a, "mousemove", this._delayedDragTouchMoveHandler), Ue(a, "touchmove", this._delayedDragTouchMoveHandler), Ue(a, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function(a, t) {
    t = t || a.pointerType == "touch" && a, !this.nativeDraggable || t ? this.options.supportPointer ? Ee(document, "pointermove", this._onTouchMove) : t ? Ee(document, "touchmove", this._onTouchMove) : Ee(document, "mousemove", this._onTouchMove) : (Ee(ie, "dragend", this), Ee(Le, "dragstart", this._onDragStart));
    try {
      document.selection ? Ka(function() {
        document.selection.empty();
      }) : window.getSelection().removeAllRanges();
    } catch {
    }
  },
  _dragStarted: function(a, t) {
    if (aa = !1, Le && ie) {
      ot("dragStarted", this, {
        evt: t
      }), this.nativeDraggable && Ee(document, "dragover", As);
      var l = this.options;
      !a && rt(ie, l.dragClass, !1), rt(ie, l.ghostClass, !0), $e.active = this, a && this._appendGhost(), lt({
        sortable: this,
        name: "start",
        originalEvent: t
      });
    } else
      this._nulling();
  },
  _emulateDragOver: function() {
    if (gt) {
      this._lastX = gt.clientX, this._lastY = gt.clientY, ai();
      for (var a = document.elementFromPoint(gt.clientX, gt.clientY), t = a; a && a.shadowRoot && (a = a.shadowRoot.elementFromPoint(gt.clientX, gt.clientY), a !== t); )
        t = a;
      if (ie.parentNode[it]._isOutsideThisEl(a), t)
        do {
          if (t[it]) {
            var l = void 0;
            if (l = t[it]._onDragOver({
              clientX: gt.clientX,
              clientY: gt.clientY,
              target: a,
              rootEl: t
            }), l && !this.options.dragoverBubble)
              break;
          }
          a = t;
        } while (t = Ho(t));
      li();
    }
  },
  _onTouchMove: function(a) {
    if (Gt) {
      var t = this.options, l = t.fallbackTolerance, o = t.fallbackOffset, r = a.touches ? a.touches[0] : a, v = Se && ra(Se, !0), m = Se && v && v.a, g = Se && v && v.d, i = za && at && go(at), d = (r.clientX - Gt.clientX + o.x) / (m || 1) + (i ? i[0] - kl[0] : 0) / (m || 1), c = (r.clientY - Gt.clientY + o.y) / (g || 1) + (i ? i[1] - kl[1] : 0) / (g || 1);
      if (!$e.active && !aa) {
        if (l && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < l)
          return;
        this._onDragStart(a, !0);
      }
      if (Se) {
        v ? (v.e += d - (hl || 0), v.f += c - (yl || 0)) : v = {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: d,
          f: c
        };
        var x = "matrix(".concat(v.a, ",").concat(v.b, ",").concat(v.c, ",").concat(v.d, ",").concat(v.e, ",").concat(v.f, ")");
        we(Se, "webkitTransform", x), we(Se, "mozTransform", x), we(Se, "msTransform", x), we(Se, "transform", x), hl = d, yl = c, gt = r;
      }
      a.cancelable && a.preventDefault();
    }
  },
  _appendGhost: function() {
    if (!Se) {
      var a = this.options.fallbackOnBody ? document.body : Le, t = Ke(ie, !0, za, !0, a), l = this.options;
      if (za) {
        for (at = a; we(at, "position") === "static" && we(at, "transform") === "none" && at !== document; )
          at = at.parentNode;
        at !== document.body && at !== document.documentElement ? (at === document && (at = kt()), t.top += at.scrollTop, t.left += at.scrollLeft) : at = kt(), kl = go(at);
      }
      Se = ie.cloneNode(!0), rt(Se, l.ghostClass, !1), rt(Se, l.fallbackClass, !0), rt(Se, l.dragClass, !0), we(Se, "transition", ""), we(Se, "transform", ""), we(Se, "box-sizing", "border-box"), we(Se, "margin", 0), we(Se, "top", t.top), we(Se, "left", t.left), we(Se, "width", t.width), we(Se, "height", t.height), we(Se, "opacity", "0.8"), we(Se, "position", za ? "absolute" : "fixed"), we(Se, "zIndex", "100000"), we(Se, "pointerEvents", "none"), $e.ghost = Se, a.appendChild(Se), we(Se, "transform-origin", bo / parseInt(Se.style.width) * 100 + "% " + ho / parseInt(Se.style.height) * 100 + "%");
    }
  },
  _onDragStart: function(a, t) {
    var l = this, o = a.dataTransfer, r = l.options;
    if (ot("dragStart", this, {
      evt: a
    }), $e.eventCanceled) {
      this._onDrop();
      return;
    }
    ot("setupClone", this), $e.eventCanceled || (ze = Zo(ie), ze.removeAttribute("id"), ze.draggable = !1, ze.style["will-change"] = "", this._hideClone(), rt(ze, this.options.chosenClass, !1), $e.clone = ze), l.cloneId = Ka(function() {
      ot("clone", l), !$e.eventCanceled && (l.options.removeCloneOnHide || Le.insertBefore(ze, ie), l._hideClone(), lt({
        sortable: l,
        name: "clone"
      }));
    }), !t && rt(ie, r.dragClass, !0), t ? (Qa = !0, l._loopId = setInterval(l._emulateDragOver, 50)) : (Ue(document, "mouseup", l._onDrop), Ue(document, "touchend", l._onDrop), Ue(document, "touchcancel", l._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(l, o, ie)), Ee(document, "drop", l), we(ie, "transform", "translateZ(0)")), aa = !0, l._dragStartId = Ka(l._dragStarted.bind(l, t, a)), Ee(document, "selectstart", l), ga = !0, window.getSelection().removeAllRanges(), wa && we(document.body, "user-select", "none");
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function(a) {
    var t = this.el, l = a.target, o, r, v, m = this.options, g = m.group, i = $e.active, d = La === g, c = m.sort, x = _e || i, y, b = this, p = !1;
    if (Ol) return;
    function w(Oe, K) {
      ot(Oe, b, $t({
        evt: a,
        isOwner: d,
        axis: y ? "vertical" : "horizontal",
        revert: v,
        dragRect: o,
        targetRect: r,
        canSort: c,
        fromSortable: x,
        target: l,
        completed: $,
        onMove: function(N, ve) {
          return ja(Le, t, ie, o, N, Ke(N), a, ve);
        },
        changed: S
      }, K));
    }
    function V() {
      w("dragOverAnimationCapture"), b.captureAnimationState(), b !== x && x.captureAnimationState();
    }
    function $(Oe) {
      return w("dragOverCompleted", {
        insertion: Oe
      }), Oe && (d ? i._hideClone() : i._showClone(b), b !== x && (rt(ie, _e ? _e.options.ghostClass : i.options.ghostClass, !1), rt(ie, m.ghostClass, !0)), _e !== b && b !== $e.active ? _e = b : b === $e.active && _e && (_e = null), x === b && (b._ignoreWhileAnimating = l), b.animateAll(function() {
        w("dragOverAnimationComplete"), b._ignoreWhileAnimating = null;
      }), b !== x && (x.animateAll(), x._ignoreWhileAnimating = null)), (l === ie && !ie.animated || l === t && !l.animated) && (ta = null), !m.dragoverBubble && !a.rootEl && l !== document && (ie.parentNode[it]._isOutsideThisEl(a.target), !Oe && Kt(a)), !m.dragoverBubble && a.stopPropagation && a.stopPropagation(), p = !0;
    }
    function S() {
      dt = ct(ie), Ot = ct(ie, m.draggable), lt({
        sortable: b,
        name: "change",
        toEl: t,
        newIndex: dt,
        newDraggableIndex: Ot,
        originalEvent: a
      });
    }
    if (a.preventDefault !== void 0 && a.cancelable && a.preventDefault(), l = ht(l, m.draggable, t, !0), w("dragOver"), $e.eventCanceled) return p;
    if (ie.contains(a.target) || l.animated && l.animatingX && l.animatingY || b._ignoreWhileAnimating === l)
      return $(!1);
    if (Qa = !1, i && !m.disabled && (d ? c || (v = je !== Le) : _e === this || (this.lastPutMode = La.checkPull(this, i, ie, a)) && g.checkPut(this, i, ie, a))) {
      if (y = this._getDirection(a, l) === "vertical", o = Ke(ie), w("dragOverValid"), $e.eventCanceled) return p;
      if (v)
        return je = Le, V(), this._hideClone(), w("revert"), $e.eventCanceled || (Yt ? Le.insertBefore(ie, Yt) : Le.appendChild(ie)), $(!0);
      var D = Zl(t, m.draggable);
      if (!D || Ns(a, y, this) && !D.animated) {
        if (D === ie)
          return $(!1);
        if (D && t === a.target && (l = D), l && (r = Ke(l)), ja(Le, t, ie, o, l, r, a, !!l) !== !1)
          return V(), D && D.nextSibling ? t.insertBefore(ie, D.nextSibling) : t.appendChild(ie), je = t, S(), $(!0);
      } else if (D && Rs(a, y, this)) {
        var z = da(t, 0, m, !0);
        if (z === ie)
          return $(!1);
        if (l = z, r = Ke(l), ja(Le, t, ie, o, l, r, a, !1) !== !1)
          return V(), t.insertBefore(ie, z), je = t, S(), $(!0);
      } else if (l.parentNode === t) {
        r = Ke(l);
        var le = 0, J, ce = ie.parentNode !== t, me = !Us(ie.animated && ie.toRect || o, l.animated && l.toRect || r, y), be = y ? "top" : "left", he = po(l, "top", "top") || po(ie, "top", "top"), se = he ? he.scrollTop : void 0;
        ta !== l && (J = r[be], Ca = !1, Ba = !me && m.invertSwap || ce), le = Ms(a, l, r, y, me ? 1 : m.swapThreshold, m.invertedSwapThreshold == null ? m.swapThreshold : m.invertedSwapThreshold, Ba, ta === l);
        var O;
        if (le !== 0) {
          var Q = ct(ie);
          do
            Q -= le, O = je.children[Q];
          while (O && (we(O, "display") === "none" || O === Se));
        }
        if (le === 0 || O === l)
          return $(!1);
        ta = l, xa = le;
        var M = l.nextElementSibling, ne = !1;
        ne = le === 1;
        var xe = ja(Le, t, ie, o, l, r, a, ne);
        if (xe !== !1)
          return (xe === 1 || xe === -1) && (ne = xe === 1), Ol = !0, setTimeout(Ps, 30), V(), ne && !M ? t.appendChild(ie) : l.parentNode.insertBefore(ie, ne ? M : l), he && Jo(he, 0, se - he.scrollTop), je = ie.parentNode, J !== void 0 && !Ba && (Ga = Math.abs(J - Ke(l)[be])), S(), $(!0);
      }
      if (t.contains(ie))
        return $(!1);
    }
    return !1;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function() {
    Ue(document, "mousemove", this._onTouchMove), Ue(document, "touchmove", this._onTouchMove), Ue(document, "pointermove", this._onTouchMove), Ue(document, "dragover", Kt), Ue(document, "mousemove", Kt), Ue(document, "touchmove", Kt);
  },
  _offUpEvents: function() {
    var a = this.el.ownerDocument;
    Ue(a, "mouseup", this._onDrop), Ue(a, "touchend", this._onDrop), Ue(a, "pointerup", this._onDrop), Ue(a, "pointercancel", this._onDrop), Ue(a, "touchcancel", this._onDrop), Ue(document, "selectstart", this);
  },
  _onDrop: function(a) {
    var t = this.el, l = this.options;
    if (dt = ct(ie), Ot = ct(ie, l.draggable), ot("drop", this, {
      evt: a
    }), je = ie && ie.parentNode, dt = ct(ie), Ot = ct(ie, l.draggable), $e.eventCanceled) {
      this._nulling();
      return;
    }
    aa = !1, Ba = !1, Ca = !1, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Pl(this.cloneId), Pl(this._dragStartId), this.nativeDraggable && (Ue(document, "drop", this), Ue(t, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), wa && we(document.body, "user-select", ""), we(ie, "transform", ""), a && (ga && (a.cancelable && a.preventDefault(), !l.dropBubble && a.stopPropagation()), Se && Se.parentNode && Se.parentNode.removeChild(Se), (Le === je || _e && _e.lastPutMode !== "clone") && ze && ze.parentNode && ze.parentNode.removeChild(ze), ie && (this.nativeDraggable && Ue(ie, "dragend", this), wl(ie), ie.style["will-change"] = "", ga && !aa && rt(ie, _e ? _e.options.ghostClass : this.options.ghostClass, !1), rt(ie, this.options.chosenClass, !1), lt({
      sortable: this,
      name: "unchoose",
      toEl: je,
      newIndex: null,
      newDraggableIndex: null,
      originalEvent: a
    }), Le !== je ? (dt >= 0 && (lt({
      rootEl: je,
      name: "add",
      toEl: je,
      fromEl: Le,
      originalEvent: a
    }), lt({
      sortable: this,
      name: "remove",
      toEl: je,
      originalEvent: a
    }), lt({
      rootEl: je,
      name: "sort",
      toEl: je,
      fromEl: Le,
      originalEvent: a
    }), lt({
      sortable: this,
      name: "sort",
      toEl: je,
      originalEvent: a
    })), _e && _e.save()) : dt !== na && dt >= 0 && (lt({
      sortable: this,
      name: "update",
      toEl: je,
      originalEvent: a
    }), lt({
      sortable: this,
      name: "sort",
      toEl: je,
      originalEvent: a
    })), $e.active && ((dt == null || dt === -1) && (dt = na, Ot = Va), lt({
      sortable: this,
      name: "end",
      toEl: je,
      originalEvent: a
    }), this.save()))), this._nulling();
  },
  _nulling: function() {
    ot("nulling", this), Le = ie = je = Se = Yt = ze = Wa = Pt = Gt = gt = ga = dt = Ot = na = Va = ta = xa = _e = La = $e.dragged = $e.ghost = $e.clone = $e.active = null;
    var a = this.el;
    el.forEach(function(t) {
      a.contains(t) && (t.checked = !0);
    }), el.length = hl = yl = 0;
  },
  handleEvent: function(a) {
    switch (a.type) {
      case "drop":
      case "dragend":
        this._onDrop(a);
        break;
      case "dragenter":
      case "dragover":
        ie && (this._onDragOver(a), Os(a));
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
    for (var a = [], t, l = this.el.children, o = 0, r = l.length, v = this.options; o < r; o++)
      t = l[o], ht(t, v.draggable, this.el, !1) && a.push(t.getAttribute(v.dataIdAttr) || Ls(t));
    return a;
  },
  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function(a, t) {
    var l = {}, o = this.el;
    this.toArray().forEach(function(r, v) {
      var m = o.children[v];
      ht(m, this.options.draggable, o, !1) && (l[r] = m);
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
    return ht(a, t || this.options.draggable, this.el, !1);
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
    var o = Oa.modifyOption(this, a, t);
    typeof o < "u" ? l[a] = o : l[a] = t, a === "group" && ti(l);
  },
  /**
   * Destroy
   */
  destroy: function() {
    ot("destroy", this);
    var a = this.el;
    a[it] = null, Ue(a, "mousedown", this._onTapStart), Ue(a, "touchstart", this._onTapStart), Ue(a, "pointerdown", this._onTapStart), this.nativeDraggable && (Ue(a, "dragover", this), Ue(a, "dragenter", this)), Array.prototype.forEach.call(a.querySelectorAll("[draggable]"), function(t) {
      t.removeAttribute("draggable");
    }), this._onDrop(), this._disableDelayedDragEvents(), _a.splice(_a.indexOf(this.el), 1), this.el = a = null;
  },
  _hideClone: function() {
    if (!Pt) {
      if (ot("hideClone", this), $e.eventCanceled) return;
      we(ze, "display", "none"), this.options.removeCloneOnHide && ze.parentNode && ze.parentNode.removeChild(ze), Pt = !0;
    }
  },
  _showClone: function(a) {
    if (a.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (Pt) {
      if (ot("showClone", this), $e.eventCanceled) return;
      ie.parentNode == Le && !this.options.group.revertClone ? Le.insertBefore(ze, ie) : Yt ? Le.insertBefore(ze, Yt) : Le.appendChild(ze), this.options.group.revertClone && this.animate(ie, ze), we(ze, "display", ""), Pt = !1;
    }
  }
};
function Os(e) {
  e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
}
function ja(e, a, t, l, o, r, v, m) {
  var g, i = e[it], d = i.options.onMove, c;
  return window.CustomEvent && !Ut && !Aa ? g = new CustomEvent("move", {
    bubbles: !0,
    cancelable: !0
  }) : (g = document.createEvent("Event"), g.initEvent("move", !0, !0)), g.to = a, g.from = e, g.dragged = t, g.draggedRect = l, g.related = o || a, g.relatedRect = r || Ke(a), g.willInsertAfter = m, g.originalEvent = v, e.dispatchEvent(g), d && (c = d.call(i, g, v)), c;
}
function wl(e) {
  e.draggable = !1;
}
function Ps() {
  Ol = !1;
}
function Rs(e, a, t) {
  var l = Ke(da(t.el, 0, t.options, !0)), o = Qo(t.el, t.options, Se), r = 10;
  return a ? e.clientX < o.left - r || e.clientY < l.top && e.clientX < l.right : e.clientY < o.top - r || e.clientY < l.bottom && e.clientX < l.left;
}
function Ns(e, a, t) {
  var l = Ke(Zl(t.el, t.options.draggable)), o = Qo(t.el, t.options, Se), r = 10;
  return a ? e.clientX > o.right + r || e.clientY > l.bottom && e.clientX > l.left : e.clientY > o.bottom + r || e.clientX > l.right && e.clientY > l.top;
}
function Ms(e, a, t, l, o, r, v, m) {
  var g = l ? e.clientY : e.clientX, i = l ? t.height : t.width, d = l ? t.top : t.left, c = l ? t.bottom : t.right, x = !1;
  if (!v) {
    if (m && Ga < i * o) {
      if (!Ca && (xa === 1 ? g > d + i * r / 2 : g < c - i * r / 2) && (Ca = !0), Ca)
        x = !0;
      else if (xa === 1 ? g < d + Ga : g > c - Ga)
        return -xa;
    } else if (g > d + i * (1 - o) / 2 && g < c - i * (1 - o) / 2)
      return Fs(a);
  }
  return x = x || v, x && (g < d + i * r / 2 || g > c - i * r / 2) ? g > d + i / 2 ? 1 : -1 : 0;
}
function Fs(e) {
  return ct(ie) < ct(e) ? 1 : -1;
}
function Ls(e) {
  for (var a = e.tagName + e.className + e.src + e.href + e.textContent, t = a.length, l = 0; t--; )
    l += a.charCodeAt(t);
  return l.toString(36);
}
function Bs(e) {
  el.length = 0;
  for (var a = e.getElementsByTagName("input"), t = a.length; t--; ) {
    var l = a[t];
    l.checked && el.push(l);
  }
}
function Ka(e) {
  return setTimeout(e, 0);
}
function Pl(e) {
  return clearTimeout(e);
}
il && Ee(document, "touchmove", function(e) {
  ($e.active || aa) && e.cancelable && e.preventDefault();
});
$e.utils = {
  on: Ee,
  off: Ue,
  css: we,
  find: Yo,
  is: function(a, t) {
    return !!ht(a, t, a, !1);
  },
  extend: $s,
  throttle: Xo,
  closest: ht,
  toggleClass: rt,
  clone: Zo,
  index: ct,
  nextTick: Ka,
  cancelNextTick: Pl,
  detectDirection: ei,
  getChild: da,
  expando: it
};
$e.get = function(e) {
  return e[it];
};
$e.mount = function() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  a[0].constructor === Array && (a = a[0]), a.forEach(function(l) {
    if (!l.prototype || !l.prototype.constructor)
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(l));
    l.utils && ($e.utils = $t($t({}, $e.utils), l.utils)), Oa.mount(l);
  });
};
$e.create = function(e, a) {
  return new $e(e, a);
};
$e.version = ks;
var Ge = [], ba, Rl, Nl = !1, $l, Vl, tl, ha;
function zs() {
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
      this.sortable.nativeDraggable ? Ee(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? Ee(document, "pointermove", this._handleFallbackAutoScroll) : l.touches ? Ee(document, "touchmove", this._handleFallbackAutoScroll) : Ee(document, "mousemove", this._handleFallbackAutoScroll);
    },
    dragOverCompleted: function(t) {
      var l = t.originalEvent;
      !this.options.dragOverBubble && !l.rootEl && this._handleAutoScroll(l);
    },
    drop: function() {
      this.sortable.nativeDraggable ? Ue(document, "dragover", this._handleAutoScroll) : (Ue(document, "pointermove", this._handleFallbackAutoScroll), Ue(document, "touchmove", this._handleFallbackAutoScroll), Ue(document, "mousemove", this._handleFallbackAutoScroll)), ko(), Ha(), Vs();
    },
    nulling: function() {
      tl = Rl = ba = Nl = ha = $l = Vl = null, Ge.length = 0;
    },
    _handleFallbackAutoScroll: function(t) {
      this._handleAutoScroll(t, !0);
    },
    _handleAutoScroll: function(t, l) {
      var o = this, r = (t.touches ? t.touches[0] : t).clientX, v = (t.touches ? t.touches[0] : t).clientY, m = document.elementFromPoint(r, v);
      if (tl = t, l || this.options.forceAutoScrollFallback || Aa || Ut || wa) {
        xl(t, this.options, m, l);
        var g = Nt(m, !0);
        Nl && (!ha || r !== $l || v !== Vl) && (ha && ko(), ha = setInterval(function() {
          var i = Nt(document.elementFromPoint(r, v), !0);
          i !== g && (g = i, Ha()), xl(t, o.options, i, l);
        }, 10), $l = r, Vl = v);
      } else {
        if (!this.options.bubbleScroll || Nt(m, !0) === kt()) {
          Ha();
          return;
        }
        xl(t, this.options, Nt(m, !1), !1);
      }
    }
  }, It(e, {
    pluginName: "scroll",
    initializeByDefault: !0
  });
}
function Ha() {
  Ge.forEach(function(e) {
    clearInterval(e.pid);
  }), Ge = [];
}
function ko() {
  clearInterval(ha);
}
var xl = Xo(function(e, a, t, l) {
  if (a.scroll) {
    var o = (e.touches ? e.touches[0] : e).clientX, r = (e.touches ? e.touches[0] : e).clientY, v = a.scrollSensitivity, m = a.scrollSpeed, g = kt(), i = !1, d;
    Rl !== t && (Rl = t, Ha(), ba = a.scroll, d = a.scrollFn, ba === !0 && (ba = Nt(t, !0)));
    var c = 0, x = ba;
    do {
      var y = x, b = Ke(y), p = b.top, w = b.bottom, V = b.left, $ = b.right, S = b.width, D = b.height, z = void 0, le = void 0, J = y.scrollWidth, ce = y.scrollHeight, me = we(y), be = y.scrollLeft, he = y.scrollTop;
      y === g ? (z = S < J && (me.overflowX === "auto" || me.overflowX === "scroll" || me.overflowX === "visible"), le = D < ce && (me.overflowY === "auto" || me.overflowY === "scroll" || me.overflowY === "visible")) : (z = S < J && (me.overflowX === "auto" || me.overflowX === "scroll"), le = D < ce && (me.overflowY === "auto" || me.overflowY === "scroll"));
      var se = z && (Math.abs($ - o) <= v && be + S < J) - (Math.abs(V - o) <= v && !!be), O = le && (Math.abs(w - r) <= v && he + D < ce) - (Math.abs(p - r) <= v && !!he);
      if (!Ge[c])
        for (var Q = 0; Q <= c; Q++)
          Ge[Q] || (Ge[Q] = {});
      (Ge[c].vx != se || Ge[c].vy != O || Ge[c].el !== y) && (Ge[c].el = y, Ge[c].vx = se, Ge[c].vy = O, clearInterval(Ge[c].pid), (se != 0 || O != 0) && (i = !0, Ge[c].pid = setInterval(function() {
        l && this.layer === 0 && $e.active._onTouchMove(tl);
        var M = Ge[this.layer].vy ? Ge[this.layer].vy * m : 0, ne = Ge[this.layer].vx ? Ge[this.layer].vx * m : 0;
        typeof d == "function" && d.call($e.dragged.parentNode[it], ne, M, e, tl, Ge[this.layer].el) !== "continue" || Jo(Ge[this.layer].el, ne, M);
      }.bind({
        layer: c
      }), 24))), c++;
    } while (a.bubbleScroll && x !== g && (x = Nt(x, !1)));
    Nl = i;
  }
}, 30), oi = function(a) {
  var t = a.originalEvent, l = a.putSortable, o = a.dragEl, r = a.activeSortable, v = a.dispatchSortableEvent, m = a.hideGhostForTarget, g = a.unhideGhostForTarget;
  if (t) {
    var i = l || r;
    m();
    var d = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t, c = document.elementFromPoint(d.clientX, d.clientY);
    g(), i && !i.el.contains(c) && (v("spill"), this.onSpill({
      dragEl: o,
      putSortable: l
    }));
  }
};
function Ql() {
}
Ql.prototype = {
  startIndex: null,
  dragStart: function(a) {
    var t = a.oldDraggableIndex;
    this.startIndex = t;
  },
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable;
    this.sortable.captureAnimationState(), l && l.captureAnimationState();
    var o = da(this.sortable.el, this.startIndex, this.options);
    o ? this.sortable.el.insertBefore(t, o) : this.sortable.el.appendChild(t), this.sortable.animateAll(), l && l.animateAll();
  },
  drop: oi
};
It(Ql, {
  pluginName: "revertOnSpill"
});
function _l() {
}
_l.prototype = {
  onSpill: function(a) {
    var t = a.dragEl, l = a.putSortable, o = l || this.sortable;
    o.captureAnimationState(), t.parentNode && t.parentNode.removeChild(t), o.animateAll();
  },
  drop: oi
};
It(_l, {
  pluginName: "removeOnSpill"
});
$e.mount(new zs());
$e.mount(_l, Ql);
function js(e, a) {
  const t = e.oldDraggableIndex ?? e.oldIndex;
  e.item.remove();
  const l = [...e.from.children].filter((o) => o.matches(a));
  e.from.insertBefore(e.item, l[t ?? l.length] ?? null);
}
function ii(e) {
  const a = /* @__PURE__ */ new Map();
  function t(l) {
    a.get(l)?.destroy(), a.delete(l);
  }
  return Dt(() => {
    for (const l of a.keys()) t(l);
  }), {
    mounted(l) {
      const o = l.querySelector(".work-field-builder") ?? l;
      a.set(l, new $e(o, {
        draggable: ".work-reorder-entry",
        handle: ".work-reorder-handle",
        forceFallback: !0,
        fallbackOnBody: !1,
        ghostClass: "work-drag-ghost",
        onEnd(r) {
          const v = r.oldDraggableIndex, m = r.newDraggableIndex;
          js(r, ".work-reorder-entry"), v !== void 0 && m !== void 0 && v !== m && e(v, m);
        }
      }));
    },
    unmounted: t
  };
}
const qs = { class: "work-stack work-tight work-option-builder" }, Ws = { class: "work-stack work-tight" }, Gs = { class: "work-stack work-tight work-small" }, Ks = { class: "work-stack work-tight work-small" }, Hs = { class: "work-stack work-tight" }, Ys = { class: "work-stack work-tight work-small" }, Xs = { class: "work-row" }, Js = { class: "work-stack work-tight work-small" }, Zs = { class: "work-row" }, Qs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, _s = { class: "work-add-option" }, er = {
  key: 0,
  class: "work-muted work-small"
}, tr = /* @__PURE__ */ Te({
  __name: "OptionsEditor",
  props: {
    field: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "options:" + wt(), r = L(() => t.field.options ?? []), v = L(() => r.value.every((c, x) => !!c.id && r.value.findIndex((y) => y.id === c.id) === x));
    De(v, (c) => l("validity", c, o), { immediate: !0 }), Dt(() => l("validity", !0, o));
    function m(c, x) {
      No(r.value, c, x - c), r.value.forEach((y, b) => y.order = b);
    }
    const g = ii(m), i = ["primary", "success", "info", "warn", "danger", "secondary"];
    function d() {
      let c = r.value.length + 1;
      for (; r.value.some((x) => x.id === `option_${c}`); ) c++;
      (t.field.options ??= []).push({ id: `option_${c}`, label: "New option", order: r.value.length });
    }
    return (c, x) => (n(), f("section", qs, [
      x[4] || (x[4] = s("header", { class: "work-row" }, [
        s("h4", null, "Options"),
        s("span", { class: "work-muted work-small" }, "Renaming a choice keeps it selected on existing items."),
        s("span", { class: "work-spacer" })
      ], -1)),
      bt((n(), f("div", Ws, [
        (n(!0), f(te, null, fe(r.value, (y, b) => (n(), f("div", {
          key: b,
          class: "work-option-row work-reorder-entry"
        }, [
          k(u(ae), {
            type: "button",
            class: "work-icon-button work-reorder-handle",
            "aria-label": "Drag option; arrow keys reorder",
            onKeydown: [
              Ze(Be((p) => m(b, b - 1), ["prevent"]), ["up"]),
              Ze(Be((p) => m(b, b + 1), ["prevent"]), ["down"])
            ],
            severity: "secondary",
            text: "",
            size: "small"
          }, {
            default: q(() => [
              k(u(pe), {
                icon: "tabler:grip-vertical",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["onKeydown"]),
          s("label", Gs, [
            x[0] || (x[0] = W("Label", -1)),
            k(u(Ae), {
              modelValue: y.label,
              "onUpdate:modelValue": (p) => y.label = p,
              "aria-label": "Option label"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          k(qe, {
            class: "work-disclosure",
            label: "Advanced"
          }, {
            default: q(() => [
              s("label", Ks, [
                x[1] || (x[1] = W("Integration identifier", -1)),
                k(u(Ae), {
                  modelValue: y.id,
                  "onUpdate:modelValue": (p) => y.id = p,
                  class: "work-option-code",
                  required: "",
                  "aria-label": "Option ID"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])
            ]),
            _: 2
          }, 1024),
          s("div", Hs, [
            s("label", Ys, [
              x[2] || (x[2] = W("Color", -1)),
              s("span", Xs, [
                s("span", {
                  class: ft(["work-color-swatch", "work-swatch-" + (y.color || "secondary")]),
                  "aria-hidden": "true"
                }, null, 2),
                k(u(ge), {
                  modelValue: y.color,
                  "onUpdate:modelValue": (p) => y.color = p,
                  "aria-label": "Option color",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  optionDisabled: "disabled",
                  options: [{ label: "Default", value: void 0, disabled: !1 }, ...(i ?? []).map((p) => ({ label: p, value: p, disabled: !1 }))]
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ])
            ]),
            s("label", Js, [
              x[3] || (x[3] = W("Category", -1)),
              k(u(ge), {
                "model-value": y.category,
                "aria-label": "Option category",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                showClear: "",
                options: ["triage", "backlog", ...u(Ro)].map((p) => ({ label: u(Lt)(p), value: p })),
                "onUpdate:modelValue": (p) => y.category = p || void 0
              }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
            ])
          ]),
          s("div", Zs, [
            k(u(ae), {
              "aria-label": "Option earlier",
              severity: "secondary",
              size: "small",
              disabled: b === 0,
              onClick: (p) => m(b, b - 1),
              text: ""
            }, {
              default: q(() => [
                k(u(pe), {
                  icon: "tabler:arrow-up",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(u(ae), {
              "aria-label": "Option later",
              severity: "secondary",
              size: "small",
              disabled: b === r.value.length - 1,
              onClick: (p) => m(b, b + 1),
              text: ""
            }, {
              default: q(() => [
                k(u(pe), {
                  icon: "tabler:arrow-down",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["disabled", "onClick"]),
            k(u(ae), {
              label: "Remove",
              "aria-label": "Remove option",
              severity: "secondary",
              text: "",
              size: "small",
              onClick: (p) => r.value.splice(b, 1)
            }, {
              icon: q(() => [
                k(u(pe), {
                  icon: "tabler:trash",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ])
        ]))), 128)),
        v.value ? C("", !0) : (n(), f("p", Qs, "Each choice needs a unique integration identifier.")),
        s("div", _s, [
          k(u(ae), {
            label: "Add option",
            severity: "secondary",
            size: "small",
            onClick: d,
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:plus",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ])
      ])), [
        [u(g)]
      ]),
      r.value.length ? C("", !0) : (n(), f("p", er, "Add the choices people can select for this field."))
    ]));
  }
}), ar = {
  class: "work-stack",
  "aria-label": "Fields editor"
}, lr = { class: "work-form-actions work-wrap" }, or = { class: "work-stack work-tight" }, ir = {
  key: 0,
  class: "work-settings-card work-muted"
}, nr = { class: "work-muted work-small" }, sr = {
  key: 0,
  class: "work-error work-small",
  role: "alert"
}, rr = { class: "work-settings-grid work-field-properties" }, dr = { class: "work-stack work-tight" }, ur = { class: "work-stack work-tight" }, cr = { class: "work-stack work-tight" }, vr = {
  key: 1,
  class: "work-stack work-tight"
}, fr = {
  key: 4,
  class: "work-stack work-tight"
}, mr = {
  key: 5,
  class: "work-stack work-tight"
}, pr = { class: "work-stack work-tight" }, gr = { class: "work-stack work-tight" }, br = { class: "work-stack work-tight" }, hr = { class: "work-stack work-tight" }, yr = { class: "work-stack" }, kr = { class: "work-stack work-tight" }, wr = { class: "work-stack work-tight" }, $r = { class: "work-stack work-tight work-field-history" }, Vr = { class: "work-settings-list" }, xr = { class: "work-settings-row" }, Cr = { class: "work-settings-row" }, Sr = { class: "work-stack" }, Tr = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = L(() => t.draft.fields ?? []), r = B("text"), v = B([]), m = L(() => (t.draft.item_types ?? []).map((K) => ({ value: K.id, label: K.title || Me(K.id) }))), g = L(() => t.draft.item_types?.find((K) => K.id === t.itemType)), i = L(() => o.value.map((K, j) => ({ field: K, index: j })).filter(({ field: K }) => !g.value || g.value.fields.includes(K.code))), d = B(""), c = B({}), x = ii((K, j) => {
      const N = i.value[K]?.index, ve = i.value[j]?.index;
      N !== void 0 && ve !== void 0 && Q(N, ve - N);
    });
    function y(K) {
      return (t.draft.item_types ?? []).filter((j) => j.fields.includes(K)).map((j) => j.title || Me(j.id));
    }
    async function b(K) {
      if (!d.value) {
        d.value = K.code;
        try {
          const j = await t.guardRemoval?.("fields", K.code);
          c.value[K.code] = j ?? "", j || Ea(t.draft, "fields", K.code);
        } finally {
          d.value = "";
        }
      }
    }
    const p = Object.entries({ text: "Text", int: "Whole number", dec: "Decimal number", quantity: "Measurement", bool: "Yes or no", time: "Date or time", ref: "Reference", record: "Structured data", option: "Choice", principal: "Person or group", item: "Work item", rank: "Order", rich_text: "Formatted text", formula: "Formula", rollup: "Related item calculation", counter: "Counter" }).map(([K, j]) => ({ value: K, label: j })), w = [{ label: "None", value: "none" }, { label: "Exact matches", value: "key" }, { label: "Numeric ranges", value: "number" }], V = ["int", "dec", "quantity"], $ = L(() => new Map(t.installedTypes?.map((K) => [K.id, K]))), S = L(() => [...p, ...(t.installedTypes ?? []).map((K) => ({ value: K.id, label: K.title }))]), D = {};
    function z(K) {
      return K.type && K.type !== "value" ? K.type : K.form ?? "text";
    }
    function le(K) {
      return K.type ? $.value.get(K.type) : void 0;
    }
    function J(K) {
      const j = le(K)?.config_schema;
      return j && Xa(j).length ? j : void 0;
    }
    function ce(K) {
      const j = le(K);
      return !!j?.config_schema || ["dec", "quantity", "ref", "time", "record"].includes(j?.form ?? K.form ?? "") || !!K.config;
    }
    function me(K) {
      const j = le(K), N = j?.form ?? K.form ?? "text";
      return w.filter(({ value: ve }) => ve === "none" || (!j?.indexes || j.indexes.includes(ve)) && N !== "record" && (ve !== "number" || V.includes(N) || K.type === "option"));
    }
    function be(K) {
      K.index && !me(K).some((j) => j.value === K.index) && delete K.index;
    }
    function he(K, j) {
      const N = $.value.get(j);
      if (N) {
        if (N.id === K.type) return;
        K.type = N.id, K.form = N.form, delete K.options, delete K.config, be(K);
        return;
      }
      le(K) && delete K.config;
      const ve = { option: "text", principal: "ref", item: "ref", rank: "text", rich_text: "text", formula: "int", rollup: "int", counter: "int" };
      ve[j] ? (K.type = j, K.form = ve[j]) : (delete K.type, K.form = j), j !== "option" ? delete K.options : K.options ??= [], j === "rich_text" && (K.config = { format: "json" }), be(K);
    }
    function se(K, j) {
      K.form = j, be(K);
    }
    function O(K, j) {
      const N = { ...K.config };
      j ? N.item_type = j : delete N.item_type, K.config = Object.keys(N).length ? N : void 0;
    }
    function Q(K, j) {
      No(o.value, K, j);
      for (const N of t.draft.item_types ?? []) {
        const ve = new Set(N.fields);
        N.fields = o.value.filter((h) => ve.has(h.code)).map((h) => h.code);
      }
    }
    function M(K, j) {
      try {
        Di(t.draft, K, j.value), delete c.value[K.code];
      } catch (N) {
        c.value[K.code] = N.message, j.value = K.code;
      }
    }
    function ne() {
      r.value = "text", v.value = g.value ? [g.value.id] : [];
    }
    function xe(K) {
      const j = K.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), N = (/^[a-z]/.test(j) ? j : `field_${j || "new"}`).slice(0, 40);
      let ve = N, h = 2;
      for (; o.value.some((R) => R.code === ve); ) {
        const R = "_" + h++;
        ve = N.slice(0, 40 - R.length) + R;
      }
      const U = { code: ve, title: K, form: "text", cardinality: "one" };
      he(U, r.value), (t.draft.fields ??= []).push(U);
      for (const R of t.draft.item_types ?? []) v.value.includes(R.id) && R.fields.push(ve);
      g.value && !v.value.includes(g.value.id) && l("update:itemType", ""), Oe.value = ve, l("created");
    }
    const Oe = B("");
    return (K, j) => (n(), f("section", ar, [
      s("div", lr, [
        k(u(ge), {
          "model-value": g.value?.id ?? "",
          "aria-label": "Filter fields by item type",
          placeholder: "All item types",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: [{ value: "", label: "All item types" }, ...m.value],
          "onUpdate:modelValue": j[0] || (j[0] = (N) => l("update:itemType", N))
        }, null, 8, ["model-value", "options"]),
        k(Ia, {
          action: "Add field",
          label: "Field name",
          maxlength: 255,
          regular: "",
          "open-on-entry": e.createForItemType,
          onOpen: ne,
          onAdd: xe,
          onCancel: j[3] || (j[3] = (N) => l("cancel-creation"))
        }, {
          default: q(() => [
            s("label", or, [
              j[5] || (j[5] = W("Kind", -1)),
              k(u(ge), {
                modelValue: r.value,
                "onUpdate:modelValue": j[1] || (j[1] = (N) => r.value = N),
                "aria-label": "New field kind",
                appendTo: "self",
                options: S.value,
                optionLabel: "label",
                optionValue: "value"
              }, null, 8, ["modelValue", "options"])
            ]),
            m.value.length ? (n(), H(mt, {
              key: 0,
              label: "Show on item types",
              options: m.value,
              modelValue: v.value,
              "onUpdate:modelValue": j[2] || (j[2] = (N) => v.value = N)
            }, null, 8, ["options", "modelValue"])) : C("", !0)
          ]),
          _: 1
        }, 8, ["open-on-entry"])
      ]),
      i.value.length ? C("", !0) : (n(), f("p", ir, "No fields here yet. Add a field to capture information.")),
      bt((n(), H(Hl, {
        columns: "fields",
        count: i.value.length
      }, {
        default: q(() => [
          (n(!0), f(te, null, fe(i.value, ({ field: N, index: ve }) => (n(), H(Kl, {
            "route-section": "fields",
            "route-id": N.code,
            title: u(et)(N),
            "initial-open": Oe.value === N.code,
            kind: le(N)?.title || u(p).find((h) => h.value === z(N))?.label || u(Me)(z(N)),
            key: N.id ?? ve,
            class: "work-field-row work-reorder-entry work-stack"
          }, {
            handle: q(() => [
              k(u(ae), {
                type: "button",
                class: "work-reorder-handle work-icon-button",
                "aria-label": "Drag " + u(et)(N) + " or use the arrow keys to reorder",
                onKeydown: [
                  Ze(Be((h) => Q(ve, -1), ["prevent"]), ["up"]),
                  Ze(Be((h) => Q(ve, 1), ["prevent"]), ["down"])
                ],
                severity: "secondary",
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(u(pe), {
                    icon: "tabler:grip-vertical",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onKeydown"])
            ]),
            flags: q(() => [
              N.track ? (n(), H(u(tt), {
                key: 0,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Tracked"
              })) : C("", !0),
              N.intervals ? (n(), H(u(tt), {
                key: 1,
                class: "kx-tag-sm",
                severity: "secondary",
                value: "Intervals"
              })) : C("", !0)
            ]),
            usage: q(() => [
              s("span", nr, T(y(N.code).length ? y(N.code).join(", ") : "Unused"), 1)
            ]),
            actions: q(() => [
              k(u(ae), {
                "aria-label": "Move " + u(et)(N) + " earlier",
                severity: "secondary",
                disabled: ve === 0,
                onClick: (h) => Q(ve, -1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(u(pe), {
                    icon: "tabler:arrow-up",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"]),
              k(u(ae), {
                "aria-label": "Move " + u(et)(N) + " later",
                severity: "secondary",
                disabled: ve === o.value.length - 1,
                onClick: (h) => Q(ve, 1),
                text: "",
                size: "small"
              }, {
                default: q(() => [
                  k(u(pe), {
                    icon: "tabler:arrow-down",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "disabled", "onClick"])
            ]),
            default: q(() => [
              c.value[N.code] ? (n(), f("p", sr, T(c.value[N.code]), 1)) : C("", !0),
              (n(!0), f(te, null, fe(e.issues?.filter((h) => h.code === N.code) ?? [], (h) => (n(), f("p", {
                key: h.what,
                class: "work-error work-small",
                role: "alert"
              }, T(u(ll)(h)), 1))), 128)),
              s("div", rr, [
                s("label", dr, [
                  j[6] || (j[6] = W("Title", -1)),
                  k(u(Ae), {
                    modelValue: N.title,
                    "onUpdate:modelValue": (h) => N.title = h,
                    "aria-label": "Field title",
                    maxlength: "255",
                    placeholder: u(et)(N)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("label", ur, [
                  j[7] || (j[7] = W("Kind", -1)),
                  k(u(ge), {
                    "aria-label": "Kind",
                    "model-value": z(N),
                    "onUpdate:modelValue": (h) => he(N, h),
                    appendTo: "self",
                    options: S.value,
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                ]),
                s("label", cr, [
                  j[8] || (j[8] = W("Values allowed", -1)),
                  k(u(ge), {
                    "aria-label": "Values allowed",
                    "model-value": N.cardinality ?? "one",
                    "onUpdate:modelValue": (h) => N.cardinality = h,
                    appendTo: "self",
                    options: [{ label: "One value", value: "one" }, { label: "Multiple unique values", value: "set" }, { label: "Ordered values", value: "list" }],
                    optionLabel: "label",
                    optionValue: "value"
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ])
              ]),
              N.type === "item" ? (n(), f("label", vr, [
                j[9] || (j[9] = W("Which items can be referenced? ", -1)),
                k(u(ge), {
                  "model-value": N.config?.item_type ?? "",
                  "aria-label": "Reference target",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: [{ value: "", label: "Any item type" }, ...m.value],
                  "onUpdate:modelValue": (h) => O(N, h)
                }, null, 8, ["model-value", "options", "onUpdate:modelValue"]),
                j[10] || (j[10] = s("span", { class: "work-muted work-small" }, "A reference stores the selected item as a value. To show a named relationship on both items, use Links.", -1))
              ])) : C("", !0),
              J(N) ? (n(), H(Mo, {
                key: N.type,
                schema: J(N),
                "model-value": N.config ?? D,
                "onUpdate:modelValue": (h) => N.config = h,
                onValidity: (h) => l("validity", "config-" + ve, h)
              }, null, 8, ["schema", "model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
              N.type === "option" ? (n(), H(tr, {
                key: 3,
                field: N,
                onValidity: j[4] || (j[4] = (h, U) => l("validity", U, h))
              }, null, 8, ["field"])) : C("", !0),
              N.type === "formula" || N.type === "rollup" ? (n(), f("label", fr, [
                j[11] || (j[11] = W("Result type", -1)),
                k(u(ge), {
                  "model-value": N.form,
                  "onUpdate:modelValue": (h) => se(N, h),
                  "aria-label": "Result type",
                  options: u(p).slice(0, 8),
                  optionLabel: "label",
                  optionValue: "value",
                  appendTo: "self"
                }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
              ])) : C("", !0),
              N.type === "formula" ? (n(), f("label", mr, [
                j[12] || (j[12] = W("Expression", -1)),
                k(u(Ae), {
                  modelValue: N.expression,
                  "onUpdate:modelValue": (h) => N.expression = h,
                  "aria-label": "Expression"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : C("", !0),
              N.type === "rollup" ? (n(), f(te, { key: 6 }, [
                s("label", pr, [
                  j[13] || (j[13] = W("Of", -1)),
                  k(u(Ae), {
                    modelValue: N.of,
                    "onUpdate:modelValue": (h) => N.of = h,
                    "aria-label": "Related items"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", gr, [
                  j[14] || (j[14] = W("Function", -1)),
                  k(u(Ae), {
                    modelValue: N.fn,
                    "onUpdate:modelValue": (h) => N.fn = h,
                    "aria-label": "Calculation"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", br, [
                  j[15] || (j[15] = W("Field", -1)),
                  k(u(Ae), {
                    modelValue: N.field,
                    "onUpdate:modelValue": (h) => N.field = h,
                    "aria-label": "Calculated field"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                s("label", hr, [
                  j[16] || (j[16] = W("Order by", -1)),
                  k(u(ge), {
                    "model-value": N.by,
                    "aria-label": "Rollup order",
                    options: ["rank", "time"],
                    showClear: "",
                    appendTo: "self",
                    "onUpdate:modelValue": (h) => N.by = h || void 0
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                k(Yl, {
                  modelValue: N.where,
                  "onUpdate:modelValue": (h) => N.where = h,
                  draft: e.draft,
                  "board-id": e.boardId,
                  label: "Include related items when",
                  onValidity: (h) => l("validity", "rollup-" + ve, h)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "draft", "board-id", "onValidity"])
              ], 64)) : C("", !0),
              k(qe, {
                class: "work-disclosure",
                label: "Advanced field settings"
              }, {
                default: q(() => [
                  s("div", yr, [
                    s("label", kr, [
                      j[17] || (j[17] = W("Field identifier for integrations", -1)),
                      k(u(Ae), {
                        value: N.code,
                        "aria-label": "Field code",
                        required: "",
                        pattern: "[a-z][a-z0-9_]*",
                        onInput: (h) => M(N, h.target)
                      }, null, 8, ["value", "onInput"])
                    ]),
                    s("label", wr, [
                      j[18] || (j[18] = W("Allow filters to use", -1)),
                      k(u(ge), {
                        "aria-label": "Allow filters to use",
                        "model-value": N.index ?? "none",
                        "onUpdate:modelValue": (h) => N.index = h,
                        appendTo: "self",
                        options: me(N),
                        optionLabel: "label",
                        optionValue: "value"
                      }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
                    ]),
                    s("section", $r, [
                      j[21] || (j[21] = s("h4", { class: "work-group-title" }, "History", -1)),
                      s("div", Vr, [
                        s("div", xr, [
                          j[19] || (j[19] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track changes"),
                            s("p", { class: "work-muted work-small" }, "Record each value change in the item history.")
                          ], -1)),
                          k(u(nt), {
                            modelValue: N.track,
                            "onUpdate:modelValue": (h) => N.track = h,
                            "aria-label": "Track changes"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        s("div", Cr, [
                          j[20] || (j[20] = s("div", { class: "work-row-main" }, [
                            s("strong", null, "Track intervals"),
                            s("p", { class: "work-muted work-small" }, "Measure how long each value stays in effect.")
                          ], -1)),
                          k(u(nt), {
                            modelValue: N.intervals,
                            "onUpdate:modelValue": (h) => N.intervals = h,
                            "aria-label": "Track intervals"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ]),
                    !J(N) && ce(N) ? (n(), H(Ft, {
                      key: 0,
                      label: "Field configuration",
                      "model-value": N.config,
                      shape: "object",
                      "onUpdate:modelValue": (h) => N.config = h,
                      onValidity: (h) => l("validity", "config-" + ve, h)
                    }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
                    s("section", Sr, [
                      j[22] || (j[22] = s("h4", { class: "work-group-title" }, "Access", -1)),
                      (n(), f(te, null, fe(["read", "write"], (h) => k(Wo, {
                        "board-id": e.boardId,
                        key: h,
                        label: h === "read" ? "Who can read" : "Who can edit",
                        "model-value": N.access?.[h],
                        "onUpdate:modelValue": (U) => N.access = { ...N.access, [h]: U },
                        onValidity: (U) => l("validity", "access-" + ve + h, U)
                      }, null, 8, ["board-id", "label", "model-value", "onUpdate:modelValue", "onValidity"])), 64))
                    ]),
                    k(u(ae), {
                      label: "Remove field",
                      severity: "danger",
                      text: "",
                      disabled: !!d.value,
                      onClick: (h) => b(N)
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
        [u(x)]
      ])
    ]));
  }
}), Ir = {
  class: "work-stack",
  "aria-label": "Item types editor"
}, Dr = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ur = { class: "work-definition-meta" }, Er = { class: "work-settings-grid" }, Ar = { class: "work-stack work-tight" }, Or = { class: "work-stack work-tight" }, Pr = {
  key: 0,
  class: "work-stack work-tight"
}, Rr = { key: 1 }, Nr = { class: "work-stack work-tight" }, Mr = { class: "work-stack" }, Fr = { class: "work-stack work-tight" }, Lr = {
  key: 0,
  class: "work-row work-wrap"
}, Br = { class: "work-stack work-tight" }, zr = {
  key: 1,
  class: "work-stack work-tight work-small"
}, jr = {
  key: 0,
  class: "kx-empty"
}, qr = /* @__PURE__ */ Te({
  __name: "TypesEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function },
    issues: {}
  },
  emits: ["create-field", "create-workflow"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => t.draft.item_types ?? []), r = B(""), v = B(""), m = B("");
    function g(w) {
      const V = w.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), $ = /^[a-z]/.test(V) ? V : "type_" + (V || "new");
      let S = $.slice(0, 40), D = 2;
      for (; o.value.some((z) => z.id === S); ) {
        const z = "_" + D++;
        S = $.slice(0, 40 - z.length) + z;
      }
      return S;
    }
    function i(w) {
      const V = g(w);
      (t.draft.item_types ??= []).push({ id: V, title: w, process: t.draft.processes?.[0]?.id ?? "", fields: [] }), r.value = V;
    }
    function d(w, V) {
      const $ = w.id;
      w.id = V;
      for (const S of o.value) S.parent_types && (S.parent_types = S.parent_types.map((D) => D === $ ? V : D));
    }
    function c(w, V) {
      w.fields = V, w.inherit && (w.inherit = w.inherit.filter(($) => V.includes($)));
    }
    function x(w) {
      return (w.parent_types ?? []).filter((V) => typeof V == "string");
    }
    function y(w, V, $) {
      w.parent_types = $ && V.length ? [...V, !1] : V;
    }
    function b(w) {
      return o.value.filter((V) => V.id !== w.id && V.parent_types?.includes(w.id)).map((V) => V.title || Me(V.id));
    }
    async function p(w) {
      if (!m.value) {
        if (b(w).length) {
          v.value = `${w.title || Me(w.id)} is a parent type for ${b(w).join(", ")}. Remove those parent selections first.`;
          return;
        }
        m.value = w.id, v.value = "";
        try {
          const V = await t.guardRemoval?.("item_types", w.id);
          V ? v.value = V : Ea(t.draft, "item_types", w.id);
        } finally {
          m.value = "";
        }
      }
    }
    return (w, V) => (n(), f("section", Ir, [
      v.value ? (n(), f("p", Dr, T(v.value), 1)) : C("", !0),
      k(Hl, {
        columns: "types",
        count: o.value.length
      }, {
        default: q(() => [
          (n(!0), f(te, null, fe(o.value, ($, S) => (n(), H(Kl, {
            "route-section": "items",
            "route-id": $.id,
            "initial-open": r.value === $.id,
            title: $.title || u(Me)($.id),
            "kind-label": "Workflow",
            kind: e.draft.processes?.find((D) => D.id === $.process)?.name || u(Me)($.process),
            key: S,
            class: "work-type-card"
          }, {
            usage: q(() => [
              s("span", Ur, [
                k(u(tt), {
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    W(T($.fields.length) + " " + T($.fields.length === 1 ? "field" : "fields"), 1)
                  ]),
                  _: 2
                }, 1024),
                b($).length ? (n(), H(u(tt), {
                  key: 0,
                  class: "kx-tag-sm",
                  severity: "secondary"
                }, {
                  default: q(() => [
                    W("Parent of " + T(b($).join(", ")), 1)
                  ]),
                  _: 2
                }, 1024)) : C("", !0)
              ])
            ]),
            default: q(() => [
              (n(!0), f(te, null, fe(e.issues?.filter((D) => D.code === "item_type " + $.id) ?? [], (D) => (n(), f("p", {
                key: D.what,
                class: "work-error work-small",
                role: "alert"
              }, T(u(ll)(D)), 1))), 128)),
              s("div", Er, [
                s("label", Ar, [
                  V[0] || (V[0] = W("Title", -1)),
                  k(u(Ae), {
                    modelValue: $.title,
                    "onUpdate:modelValue": (D) => $.title = D,
                    placeholder: u(Me)($.id)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
                ]),
                s("div", Or, [
                  e.draft.processes?.length ? (n(), f("label", Pr, [
                    V[1] || (V[1] = W(" Workflow ", -1)),
                    k(u(ge), {
                      modelValue: $.process,
                      "onUpdate:modelValue": (D) => $.process = D,
                      "aria-label": "Workflow",
                      required: "",
                      appendTo: "self",
                      optionLabel: "label",
                      optionValue: "value",
                      options: e.draft.processes.map((D) => ({ label: D.name || u(Me)(D.id), value: D.id }))
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                  ])) : (n(), f("span", Rr, "Workflow")),
                  s("div", null, [
                    k(u(ae), {
                      label: "Create a workflow",
                      type: "button",
                      text: "",
                      size: "small",
                      onClick: (D) => l("create-workflow", $, D)
                    }, null, 8, ["onClick"])
                  ])
                ])
              ]),
              s("div", Nr, [
                k(mt, {
                  label: "Fields",
                  options: (e.draft.fields ?? []).map((D) => ({ value: D.code, label: u(et)(D) })),
                  "model-value": $.fields,
                  "onUpdate:modelValue": (D) => c($, D)
                }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                s("div", null, [
                  k(u(ae), {
                    label: "Create a field",
                    type: "button",
                    text: "",
                    size: "small",
                    onClick: (D) => l("create-field", $, D)
                  }, null, 8, ["onClick"])
                ])
              ]),
              k(qe, {
                class: "work-disclosure",
                label: "Advanced item type settings"
              }, {
                default: q(() => [
                  s("div", Mr, [
                    s("label", Fr, [
                      V[2] || (V[2] = W("Identifier", -1)),
                      k(u(Ae), {
                        value: $.id,
                        onChange: (D) => d($, D.target.value),
                        required: "",
                        pattern: "[a-z][a-z0-9_]*"
                      }, null, 8, ["value", "onChange"])
                    ]),
                    V[6] || (V[6] = W()),
                    k(mt, {
                      label: "Parent types",
                      options: o.value.map((D) => ({ value: D.id, label: D.title || u(Me)(D.id) })),
                      "model-value": x($),
                      "onUpdate:modelValue": (D) => y($, D, !!$.parent_types?.includes(!1))
                    }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                    x($).length ? (n(), f("label", Lr, [
                      k(u(nt), {
                        "model-value": !!$.parent_types?.includes(!1),
                        "aria-label": "Allow top-level items",
                        "onUpdate:modelValue": (D) => y($, x($), D)
                      }, null, 8, ["model-value", "onUpdate:modelValue"]),
                      V[3] || (V[3] = W("Allow top-level items", -1))
                    ])) : C("", !0),
                    s("div", Br, [
                      k(mt, {
                        label: "Inherit from parent",
                        options: $.fields.map((D) => ({ value: D, label: u(et)(e.draft.fields?.find((z) => z.code === D) ?? { code: D }) })),
                        modelValue: $.inherit,
                        "onUpdate:modelValue": (D) => $.inherit = D
                      }, null, 8, ["options", "modelValue", "onUpdate:modelValue"]),
                      V[4] || (V[4] = s("p", { class: "work-muted work-small" }, "These fields resolve from the parent when this item has no own value.", -1))
                    ]),
                    x($).length ? (n(), f("label", zr, [
                      V[5] || (V[5] = W("When the parent moves", -1)),
                      k(u(ge), {
                        modelValue: $.move_children,
                        "onUpdate:modelValue": (D) => $.move_children = D,
                        "aria-label": "When the parent moves",
                        appendTo: "self",
                        optionLabel: "label",
                        optionValue: "value",
                        optionDisabled: "disabled",
                        options: [{ label: "Default", value: void 0, disabled: !1 }, { label: "Move children", value: "move", disabled: !1 }, { label: "Refuse while children exist", value: "refuse", disabled: !1 }]
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])) : C("", !0),
                    k(u(ae), {
                      label: "Remove type",
                      severity: "danger",
                      text: "",
                      disabled: !!m.value,
                      onClick: (D) => p($)
                    }, null, 8, ["disabled", "onClick"])
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["route-id", "initial-open", "title", "kind"]))), 128)),
          o.value.length ? C("", !0) : (n(), f("p", jr, "Add a type for the work people create, such as a delivery task or customer request.")),
          k(Ia, {
            action: "Add item type",
            label: "Item type name",
            onAdd: i
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), Wr = ".work-process-canvas>svg{height:480px;width:100%}.work-process-canvas:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.work-state-card{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1.5}.work-graph-node.work-selected .work-state-card{stroke:var(--p-primary-color);stroke-width:2.5;fill:color-mix(in srgb,var(--p-primary-color) 6%,var(--p-content-background))}.work-graph-node:focus-visible .work-state-card{stroke:var(--p-focus-ring-color);stroke-width:var(--p-focus-ring-width)}.work-process-canvas .work-edge-label{font-size:12px;fill:var(--p-text-color)}.work-process-canvas .work-edge-label-bg{fill:var(--p-content-background);stroke:var(--p-content-border-color);stroke-width:1}.work-edge-line{stroke:var(--p-primary-color);stroke-width:1.5}.work-edge-return .work-edge-line{stroke:var(--p-text-muted-color);stroke-dasharray:5 4}.work-graph-arrow{fill:context-stroke}.work-lane-line{fill:none;stroke:var(--p-text-muted-color);stroke-width:1.5;stroke-dasharray:2 4}.work-node-connector{fill:var(--p-content-background);stroke:var(--p-primary-color);stroke-width:1.5}.work-node-connector:hover,.work-node-connector:focus-visible,.work-node-connector[aria-pressed=true]{fill:var(--p-primary-color)}.work-any-transition:focus-visible text,.work-any-transition[aria-pressed=true] text{fill:var(--p-primary-color);text-decoration:underline}.work-process-legend{position:static;flex-wrap:wrap;padding:10px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background)}@media(max-width:700px){.work-process-canvas>svg{height:420px}}.work-process-more{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 16px;border-top:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-muted-color);font-size:12px}.work-process-canvas .work-graph-edge.work-selected .work-edge-label-bg{fill:var(--p-primary-color);stroke:var(--p-primary-color)}.work-process-canvas .work-graph-edge.work-selected .work-edge-label{fill:var(--p-primary-contrast-color)}", wo = /* @__PURE__ */ new WeakSet();
function Gr(e) {
  const a = e.getRootNode();
  if (a instanceof ShadowRoot && !wo.has(a)) {
    const t = e.ownerDocument.createElement("style");
    t.textContent = Wr, a.append(t), wo.add(a);
  }
}
const ni = 0.8;
function Kr(e, a, t) {
  const l = Math.min(1, a.width / e.width, a.height / e.height);
  if (l >= ni) return { zoom: l, pan: { x: (e.width - a.width / l) / 2, y: (e.height - a.height / l) / 2 } };
  const o = e.nodes.find((v) => v.state.id === t) ?? e.nodes[0], r = Math.min(1, a.width / ((o?.width ?? 190) + 64));
  return { zoom: r, pan: o ? { x: e.direction === "TB" ? o.x - a.width / r / 2 : o.x - o.width / 2 - 32, y: e.direction === "TB" ? o.y - o.height / 2 - 32 : o.y - a.height / r / 2 } : { x: 0, y: 0 } };
}
const Hr = ["onKeydown"], Yr = {
  key: 0,
  class: "work-process-instruction",
  role: "status"
}, Xr = ["viewBox"], Jr = ["id"], Zr = ["d", "marker-end"], Qr = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onKeydown", "onFocus", "onClick"], _r = ["d"], ed = ["d", "marker-end"], td = ["x", "y", "width", "height"], ad = ["x", "y"], ld = ["x", "dy"], od = ["aria-label", "aria-pressed", "onClick", "onKeydown", "onFocus", "onPointerup"], id = ["x", "y", "width", "height"], nd = ["cx", "cy"], sd = ["x", "y"], rd = ["x", "dy"], dd = ["x", "y"], ud = ["x", "dy"], cd = {
  key: 0,
  class: "work-limit-text"
}, vd = ["aria-label", "aria-pressed", "aria-keyshortcuts", "onFocus", "onKeydown", "onClick"], fd = ["x", "y"], md = ["x", "dy"], pd = ["cx", "cy", "aria-label", "aria-pressed", "onFocus", "onPointerdown", "onClick", "onKeydown"], gd = ["d"], bd = {
  key: 1,
  class: "work-process-more",
  role: "status"
}, hd = { class: "work-process-legend" }, yd = /* @__PURE__ */ Te({
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
    const l = e, o = t, r = wt().replace(/:/g, "_"), v = B(""), m = B(), g = B();
    let i;
    const d = B(900), c = B(!1), x = L(() => d.value < 700 ? 420 : 480), y = L(() => Hi(l.process, l.draft, {
      width: d.value,
      height: x.value,
      direction: l.fitOnOpen ? "TB" : void 0
    })), b = B(1), p = B({ x: 0, y: 0 }), w = B({ x: 0, y: 0 }), V = L(() => {
      const I = Math.min(1, d.value / y.value.width);
      return l.fitOnOpen ? Math.max(ni, I) : I;
    }), $ = L(() => ({
      width: d.value,
      height: c.value ? Math.max(x.value, Math.ceil(y.value.height * V.value)) : x.value
    })), S = L(() => y.value.nodes.filter((I) => I.x - I.width / 2 >= p.value.x && I.x + I.width / 2 <= p.value.x + $.value.width / b.value && I.y - I.height / 2 >= p.value.y && I.y + I.height / 2 <= p.value.y + $.value.height / b.value).length);
    function D() {
      c.value = !1;
      const I = Kr(y.value, $.value, l.process.initial);
      b.value = I.zoom, p.value = I.pan;
    }
    const z = L(() => `${p.value.x} ${p.value.y} ${$.value.width / b.value} ${$.value.height / b.value}`), le = L(() => y.value.nodes.find((I) => I.state.id === v.value));
    function J() {
      c.value = !0, b.value = V.value;
      const I = $.value.width / b.value, Z = y.value.nodes.find((A) => A.state.id === l.process.initial);
      p.value = {
        x: y.value.width > I && Z ? Z.x - I / 2 : (y.value.width - I) / 2,
        y: 0
      };
    }
    function ce(I) {
      l.fitOnOpen && (c.value = !1);
      const Z = Math.max(0.02, Math.min(3, b.value * I)), A = 1 / b.value - 1 / Z;
      p.value = { x: p.value.x + $.value.width * A / 2, y: p.value.y + $.value.height * A / 2 }, b.value = Z;
    }
    function me(I) {
      const Z = $.value.width / b.value, A = $.value.height / b.value;
      (I.x - I.width / 2 < p.value.x || I.x + I.width / 2 > p.value.x + Z || I.y - I.height / 2 < p.value.y || I.y + I.height / 2 > p.value.y + A) && (p.value = { x: I.x - Z / 2, y: I.y - A / 2 });
    }
    function be() {
      const I = y.value.nodes.find((Z) => Z.state === l.selectedState) ?? y.value.edges.find((Z) => Z.transition === l.selectedTransition);
      if (!I) {
        l.fitOnOpen && c.value && J();
        return;
      }
      me(I);
    }
    De([y, () => l.selectedState, () => l.selectedTransition], be, { flush: "post" });
    function he() {
      l.fitOnOpen ? J() : D();
    }
    De(() => l.process.id, () => {
      K(), he();
    }, { flush: "post" });
    function se(I) {
      if (I.target !== m.value) return;
      (I.key === "+" || I.key === "=") && (I.preventDefault(), ce(1.2)), I.key === "-" && (I.preventDefault(), ce(1 / 1.2)), I.key === "0" && (I.preventDefault(), J());
      const Z = 60 / b.value;
      I.key.startsWith("Arrow") && (I.preventDefault(), p.value = { x: p.value.x + (I.key === "ArrowRight" ? Z : I.key === "ArrowLeft" ? -Z : 0), y: p.value.y + (I.key === "ArrowDown" ? Z : I.key === "ArrowUp" ? -Z : 0) });
    }
    function O(I, Z) {
      const A = Z.currentTarget;
      if (!v.value) o("state", I, A);
      else if (v.value !== I.id) {
        const oe = v.value;
        v.value = "", o("connect", oe, I.id, A);
      }
    }
    function Q(I) {
      v.value = I.state.id, w.value = { x: y.value.direction === "TB" ? I.x : I.x + I.width / 2, y: y.value.direction === "TB" ? I.y + I.height / 2 : I.y };
    }
    function M(I, Z) {
      if (I.pointerType === "touch" || I.button !== 0) return;
      i = I.pointerId, Q(Z);
      const A = I.currentTarget;
      A.hasPointerCapture?.(I.pointerId) && A.releasePointerCapture(I.pointerId);
    }
    function ne(I, Z) {
      i === I.pointerId && (i = void 0, !(!v.value || v.value === Z.id) && O(Z, I));
    }
    function xe(I, Z) {
      if ((I.key === "Enter" || I.key === " ") && (I.preventDefault(), O(Z, I)), ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(I.key)) {
        I.preventDefault();
        const A = Array.from(g.value?.querySelectorAll(".work-graph-node") ?? []), oe = y.value.nodes.findIndex((Pe) => Pe.state === Z), Ve = ["ArrowRight", "ArrowDown"].includes(I.key) ? 1 : -1;
        A[(oe + Ve + A.length) % A.length]?.focus();
      }
    }
    function Oe(I, Z) {
      l.selectedTransition === Z && o("removeTransition", I);
    }
    function K() {
      v.value = "", i = void 0, N.clear(), ve = 0;
    }
    function j() {
      K(), o("clear");
    }
    const N = /* @__PURE__ */ new Map();
    let ve = 0;
    function h(I) {
      if (!I.target.closest('[role="button"]') && (N.set(I.pointerId, { x: I.clientX, y: I.clientY }), m.value?.setPointerCapture?.(I.pointerId), N.size === 2)) {
        const [Z, A] = [...N.values()];
        ve = Math.hypot(Z.x - A.x, Z.y - A.y);
      }
    }
    function U(I) {
      const Z = g.value?.getBoundingClientRect();
      if (!Z?.width) return;
      if (i === I.pointerId && v.value) {
        w.value = { x: p.value.x + (I.clientX - Z.left) * $.value.width / b.value / Z.width, y: p.value.y + (I.clientY - Z.top) * $.value.height / b.value / Z.height };
        return;
      }
      const A = N.get(I.pointerId);
      if (A)
        if (N.set(I.pointerId, { x: I.clientX, y: I.clientY }), N.size === 2) {
          const [oe, Ve] = [...N.values()], Pe = Math.hypot(oe.x - Ve.x, oe.y - Ve.y);
          ve && ce(Pe / ve), ve = Pe;
        } else p.value = { x: p.value.x - (I.clientX - A.x) * $.value.width / b.value / Z.width, y: p.value.y - (I.clientY - A.y) * $.value.height / b.value / Z.height };
    }
    function R(I) {
      i === I.pointerId && (v.value = "", i = void 0);
    }
    function E(I) {
      N.delete(I.pointerId), ve = 0, R(I);
    }
    function G(I) {
      I.ctrlKey && (I.preventDefault(), ce(Math.exp(-I.deltaY * 0.01)));
    }
    let re;
    Ua(() => {
      if (m.value && Gr(m.value), typeof ResizeObserver < "u" && g.value) {
        let I = !0;
        re = new ResizeObserver(() => {
          const Z = g.value?.getBoundingClientRect();
          if (!Z?.width || !Z.height) return;
          const A = $.value.width;
          d.value = Z.width, (I || Math.abs(Z.width - A) > 1) && (I ? he() : c.value ? J() : D(), I = !1), be();
        }), re.observe(g.value);
      }
    }), Dt(() => re?.disconnect()), a({ fit: J, focus: () => m.value?.focus(), zoomIn: () => ce(1.2), zoomOut: () => ce(1 / 1.2) });
    function ee(I) {
      return I.category === "completed" ? "check" : I.category === "canceled" ? "x" : I.id === l.process.initial ? "arrow-bar-to-right" : { gate: "shield-check", automated: "bolt", parallel: "arrows-split" }[I.kind ?? ""] ?? "user";
    }
    return (I, Z) => (n(), f("section", {
      ref_key: "canvas",
      ref: m,
      class: ft(["work-process-canvas", { "work-process-scrollable": e.fitOnOpen && c.value }]),
      "aria-label": "Process map",
      tabindex: "0",
      onKeydown: [
        se,
        Ze(Be(j, ["stop"]), ["esc"])
      ],
      onPointerdown: h,
      onPointermove: U,
      onPointerup: E,
      onPointerleave: R,
      onPointercancel: K,
      onWheel: G
    }, [
      v.value ? (n(), f("p", Yr, "Choose the next stop. Escape cancels.")) : C("", !0),
      (n(), f("svg", {
        ref_key: "svg",
        ref: g,
        style: wi({ height: $.value.height + "px" }),
        viewBox: z.value,
        role: "group",
        "aria-label": "States and transitions"
      }, [
        s("defs", null, [
          s("marker", {
            id: u(r) + "-arrow",
            viewBox: "0 0 8 8",
            refX: "7",
            refY: "4",
            markerWidth: "6",
            markerHeight: "6",
            orient: "auto"
          }, [...Z[1] || (Z[1] = [
            s("path", {
              d: "M0 0 L8 4 L0 8 z",
              class: "work-graph-arrow"
            }, null, -1)
          ])], 8, Jr)
        ]),
        (n(!0), f(te, null, fe(y.value.parallels, (A) => (n(), f("path", {
          key: A.key,
          d: A.path,
          class: "work-lane-line",
          "marker-end": `url(#${u(r)}-arrow)`
        }, [
          s("title", null, "Parallel lane from " + T(u(ye)(A.state)), 1)
        ], 8, Zr))), 128)),
        (n(!0), f(te, null, fe(y.value.edges, (A) => (n(), f("g", {
          key: A.key,
          class: ft(["work-graph-edge", ["work-edge-" + A.type, { "work-selected": e.selectedTransition === A.transition }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit transition " + u(Xe)(A.transition),
          "aria-pressed": e.selectedTransition === A.transition,
          "aria-keyshortcuts": e.selectedTransition === A.transition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ze((oe) => Oe(oe, A.transition), ["delete"]),
            Ze((oe) => Oe(oe, A.transition), ["backspace"]),
            Ze(Be((oe) => o("transition", A.transition, oe.currentTarget), ["prevent"]), ["enter"]),
            Ze(Be((oe) => o("transition", A.transition, oe.currentTarget), ["prevent"]), ["space"])
          ],
          onFocus: (oe) => me(A),
          onClick: (oe) => o("transition", A.transition, oe.currentTarget)
        }, [
          s("path", {
            d: A.path,
            class: "work-edge-hit"
          }, null, 8, _r),
          s("path", {
            d: A.path,
            class: "work-edge-line",
            "marker-end": `url(#${u(r)}-arrow)`
          }, null, 8, ed),
          s("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "6",
            class: "work-edge-label-bg"
          }, null, 8, td),
          s("text", {
            x: A.x,
            y: A.y - (A.lines.length - 1) * 8 + 4,
            class: "work-edge-label",
            "text-anchor": "middle"
          }, [
            (n(!0), f(te, null, fe(A.lines, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: A.x,
              dy: Ve ? 16 : 0
            }, T(oe), 9, ld))), 128))
          ], 8, ad)
        ], 42, Qr))), 128)),
        (n(!0), f(te, null, fe(y.value.nodes, (A) => (n(), f("g", {
          key: A.state.id,
          class: ft(["work-graph-node", ["work-stop-" + A.state.category, { "work-selected": e.selectedState === A.state }]]),
          role: "button",
          tabindex: "0",
          "aria-label": "Edit state " + u(ye)(A.state),
          "aria-pressed": e.selectedState === A.state,
          onClick: (oe) => O(A.state, oe),
          onKeydown: (oe) => xe(oe, A.state),
          onFocus: (oe) => me(A),
          onPointerup: (oe) => ne(oe, A.state)
        }, [
          s("rect", {
            x: A.x - A.width / 2,
            y: A.y - A.height / 2,
            width: A.width,
            height: A.height,
            rx: "10",
            class: "work-state-card"
          }, null, 8, id),
          s("circle", {
            cx: A.x - A.width / 2 + 22,
            cy: A.y - A.height / 2 + 25,
            r: "10",
            class: "work-stop-ring"
          }, null, 8, nd),
          k(u(pe), {
            icon: "tabler:" + ee(A.state),
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
            (n(!0), f(te, null, fe(A.title, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: A.x - A.width / 2 + 42,
              dy: Ve ? 18 : 0
            }, T(oe), 9, rd))), 128))
          ], 8, sd),
          s("text", {
            x: A.x - A.width / 2 + 16,
            y: A.y - A.height / 2 + 33 + A.title.length * 18,
            class: "work-node-meta"
          }, [
            (n(!0), f(te, null, fe(A.caption, (oe, Ve) => (n(), f("tspan", {
              key: Ve,
              x: A.x - A.width / 2 + 16,
              dy: Ve ? 16 : 0
            }, T(oe), 9, ud))), 128)),
            e.draft.policy?.wip?.[A.state.id] ? (n(), f("tspan", cd, " · limit " + T(e.draft.policy.wip[A.state.id].limit), 1)) : C("", !0)
          ], 8, dd),
          (n(!0), f(te, null, fe(A.badges, (oe, Ve) => (n(), f("g", {
            key: oe.id,
            class: "work-any-transition",
            role: "button",
            tabindex: "0",
            "aria-label": "Edit transition " + u(Xe)(oe),
            "aria-pressed": e.selectedTransition === oe,
            "aria-keyshortcuts": e.selectedTransition === oe ? "Delete Backspace" : void 0,
            onFocus: (Pe) => me(A),
            onKeydown: [
              Ze((Pe) => Oe(Pe, oe), ["delete"]),
              Ze((Pe) => Oe(Pe, oe), ["backspace"]),
              Ze(Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop", "prevent"]), ["enter"]),
              Ze(Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop", "prevent"]), ["space"])
            ],
            onClick: Be((Pe) => o("transition", oe, Pe.currentTarget), ["stop"])
          }, [
            s("text", {
              x: A.x - A.width / 2 + 16,
              y: A.y - A.height / 2 + 33 + A.title.length * 18 + A.caption.length * 16 + A.badges.slice(0, Ve).reduce((Pe, P) => Pe + u(ia)(u(Xe)(P) + " works from any state").length * 18, 0),
              class: "work-node-meta"
            }, [
              (n(!0), f(te, null, fe(u(ia)(u(Xe)(oe) + " works from any state"), (Pe, P) => (n(), f("tspan", {
                key: P,
                x: A.x - A.width / 2 + 16,
                dy: P ? 18 : 0
              }, T(Pe), 9, md))), 128))
            ], 8, fd)
          ], 40, vd))), 128)),
          ["completed", "canceled"].includes(A.state.category) ? C("", !0) : (n(), f("circle", {
            key: 0,
            cx: y.value.direction === "TB" ? A.x : A.x + A.width / 2,
            cy: y.value.direction === "TB" ? A.y + A.height / 2 : A.y,
            r: "9",
            class: "work-node-connector",
            role: "button",
            tabindex: "0",
            "aria-label": "Connect from " + u(ye)(A.state),
            "aria-pressed": v.value === A.state.id,
            onFocus: (oe) => me(A),
            onPointerdown: Be((oe) => M(oe, A), ["stop"]),
            onClick: Be((oe) => Q(A), ["stop"]),
            onKeydown: [
              Ze(Be((oe) => Q(A), ["stop", "prevent"]), ["enter"]),
              Ze(Be((oe) => Q(A), ["stop", "prevent"]), ["space"])
            ]
          }, null, 40, pd))
        ], 42, od))), 128)),
        le.value ? (n(), f("path", {
          key: 0,
          d: `M ${y.value.direction === "TB" ? le.value.x : le.value.x + le.value.width / 2} ${y.value.direction === "TB" ? le.value.y + le.value.height / 2 : le.value.y} L ${w.value.x} ${w.value.y}`,
          class: "work-connect-ghost"
        }, null, 8, gd)) : C("", !0)
      ], 12, Xr)),
      S.value < e.process.states.length ? (n(), f("div", bd, [
        s("span", null, T(S.value) + " of " + T(e.process.states.length) + " states in view · Pan to see more", 1),
        c.value ? C("", !0) : (n(), H(u(ae), {
          key: 0,
          label: "Fit map",
          size: "small",
          text: "",
          onClick: Z[0] || (Z[0] = (A) => J())
        }))
      ])) : C("", !0),
      s("div", hd, [
        s("span", null, T(e.process.states.length) + " states · " + T(Math.round(b.value * 100)) + "%", 1),
        Z[2] || (Z[2] = s("span", null, [
          s("i"),
          W("Transition")
        ], -1)),
        Z[3] || (Z[3] = s("span", null, [
          s("i", { class: "work-return-key" }),
          W("Return / loop")
        ], -1)),
        Z[4] || (Z[4] = s("span", null, "Drag to pan · Ctrl + scroll to zoom · Fit to reset the view", -1))
      ])
    ], 42, Hr));
  }
}), Ml = new Intl.ListFormat("en", { type: "conjunction" }), kd = new Intl.ListFormat("en", { type: "disjunction" }), wd = {
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
}, $d = { some: "At least one", every: "Every", none: "No" };
function Fl(e, a) {
  const t = a.fields?.find((l) => l.code === e);
  return t ? et(t) : Me(e);
}
function Ll(e, a, t) {
  return Array.isArray(e) ? Ml.format(e.map((l) => Ll(l, a, t))) : a === "category" && typeof e == "string" ? Lt(e) : a === "state" && typeof e == "string" ? t.processes?.flatMap((l) => l.states).find((l) => l.id === e)?.name || Me(e) : "$actor" in ut(e) ? "the person moving the item" : "$now" in ut(e) ? "the current time" : Ht(e, t.fields?.find((l) => l.code === a));
}
function Vd(e) {
  const a = ut(e.where);
  if (!(e.rel !== "blocks" || e.dir !== "inward" || a.field !== "category" || a.op !== "nin" || !Array.isArray(a.value) || a.value.length !== 2 || !a.value.includes("completed") || !a.value.includes("canceled"))) {
    if (e.q === "none") return "Requires all blockers to be resolved.";
    if (e.q === "some") return "Requires an open blocker.";
  }
}
function Ya(e, a) {
  const t = ut(e), l = (r) => r.map((v) => Ya(v, a)), o = a.relation_types?.find((r) => r.id === t.rel);
  if (Array.isArray(t.and) && t.and.length) return `(${Ml.format(l(t.and))})`;
  if (Array.isArray(t.or) && t.or.length) return `(${kd.format(l(t.or))})`;
  if (t.not) return `this condition is false (${Ya(t.not, a)})`;
  if (typeof t.match == "string" && t.match.trim()) return `the item matches “${t.match}”`;
  if (typeof t.rel == "string" || t.children) {
    const r = t.dir === "inward" && !o?.symmetric ? o?.inward : o?.outward, v = t.children ? "child item" : `item linked as “${r || Me(String(t.rel))}”`;
    return `${$d[String(t.q)] ?? "At least one"} ${v} matches (${Ya(t.where, a)})`;
  }
  if (t.history) {
    const r = ut(t.history);
    if (typeof r.field != "string") return "a value history condition";
    const v = Fl(r.field, a), m = (i) => Ll(i, String(r.field), a), g = Array.isArray(r.during) ? ` during ${Ml.format(r.during.map((i) => String(i)))}` : "";
    if (r.changed === !0) {
      const i = r.from === void 0 ? "" : ` from ${m(r.from)}`, d = r.to === void 0 ? "" : ` to ${m(r.to)}`;
      return `${v} changed${i}${d}${g}`;
    }
    return r.was !== void 0 ? `${v} was ${m(r.was)}${g}` : `a change in the history of ${v}${g}`;
  }
  if (typeof t.field == "string") {
    const r = Fl(t.field, a);
    if (t.op === "is_null") return `${r} is ${t.value === !1 ? "filled" : "empty"}`;
    if (t.op === "is_state") {
      const m = { absent: "has never been filled", cleared: "was cleared", provided: "has a value" }[String(t.value)];
      if (m) return `${r} ${m}`;
    }
    const v = wd[String(t.op)];
    return v && t.value !== void 0 ? `${r} ${v} ${Ll(t.value, t.field, a)}` : `a condition on ${r}`;
  }
  return "a custom condition";
}
function xd(e, a, t, l = []) {
  const o = [], r = a.states.find((m) => m.id === e.to), v = [.../* @__PURE__ */ new Set([...e.require ?? [], ...r?.require ?? []])];
  v.length && o.push(`Required: ${v.map((m) => Fl(m, t)).join(", ")}`), e.when != null && o.push(Vd(ut(e.when)) ?? `Only when ${Ya(e.when, t)}`);
  for (const m of e.guards ?? []) {
    const g = l.find((i) => i.id === m);
    o.push(g ? `Requires the “${g.title}” check to pass` : "Requires an unavailable check to pass");
  }
  return o;
}
const Cd = {
  key: 0,
  class: "work-stack work-tight work-muted work-small"
}, si = /* @__PURE__ */ Te({
  __name: "TransitionRules",
  props: {
    transition: {},
    process: {},
    draft: {},
    guards: {}
  },
  setup(e) {
    const a = e, t = L(() => xd(a.transition, a.process, a.draft, a.guards));
    return (l, o) => t.value.length ? (n(), f("div", Cd, [
      (n(!0), f(te, null, fe(t.value, (r, v) => (n(), f("p", { key: v }, T(r), 1))), 128))
    ])) : C("", !0);
  }
}), Sd = {
  class: "work-process-list work-stack",
  "aria-label": "Process list"
}, Td = { class: "work-table-scroll" }, Id = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "States"
}, Dd = { role: "rowgroup" }, Ud = ["aria-selected"], Ed = { role: "cell" }, Ad = {
  key: 0,
  class: "work-muted work-small"
}, Od = { role: "cell" }, Pd = { role: "cell" }, Rd = {
  role: "cell",
  class: "work-process-list-actions"
}, Nd = { class: "work-table-scroll" }, Md = {
  class: "work-settings-table work-process-table",
  role: "table",
  "aria-label": "Transitions"
}, Fd = { role: "rowgroup" }, Ld = ["aria-selected"], Bd = { role: "cell" }, zd = { role: "cell" }, jd = { role: "cell" }, qd = {
  role: "cell",
  class: "work-process-list-actions"
}, Wd = /* @__PURE__ */ Te({
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
    return (a, t) => (n(), f("section", Sd, [
      t[6] || (t[6] = s("h3", null, "States", -1)),
      s("div", Td, [
        s("table", Id, [
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
          s("tbody", Dd, [
            (n(!0), f(te, null, fe(e.process.states, (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedState === l,
              role: "row"
            }, [
              s("td", Ed, [
                k(u(Ae), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  "aria-label": "Name of " + u(ye)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "aria-label"]),
                e.counts ? (n(), f("p", Ad, T(e.counts[l.id] ?? 0) + " here", 1)) : C("", !0)
              ]),
              s("td", Od, [
                t[0] || (t[0] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Phase", -1)),
                W(T(u(Lt)(l.category)), 1)
              ]),
              s("td", Pd, [
                t[1] || (t[1] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "Kind", -1)),
                k(u(tt), { severity: "secondary" }, {
                  default: q(() => [
                    W(T(u(Ja)(l.kind)), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              s("td", Rd, [
                k(u(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit state " + u(ye)(l),
                  onClick: (o) => a.$emit("state", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(u(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(u(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove state " + u(ye)(l),
                  onClick: (o) => a.$emit("removeState", l)
                }, {
                  default: q(() => [
                    k(u(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ud))), 128))
          ])
        ])
      ]),
      t[7] || (t[7] = s("h3", null, "Transitions", -1)),
      s("div", Nd, [
        s("table", Md, [
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
          s("tbody", Fd, [
            (n(!0), f(te, null, fe(e.process.transitions ?? [], (l) => (n(), f("tr", {
              key: l.id,
              "aria-selected": e.selectedTransition === l,
              role: "row"
            }, [
              s("td", Bd, [
                k(u(Ae), {
                  modelValue: l.name,
                  "onUpdate:modelValue": (o) => l.name = o,
                  placeholder: u(Xe)(l),
                  "aria-label": "Name of " + u(Xe)(l)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "aria-label"]),
                k(si, {
                  transition: l,
                  process: e.process,
                  draft: e.draft,
                  guards: e.guards
                }, null, 8, ["transition", "process", "draft", "guards"])
              ]),
              s("td", zd, [
                t[3] || (t[3] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "From", -1)),
                W(" " + T(l.from === "any" ? "Any state" : l.from.map((o) => u(ye)(e.process.states.find((r) => r.id === o))).join(", ")), 1)
              ]),
              s("td", jd, [
                t[4] || (t[4] = s("span", {
                  class: "work-process-cell-label",
                  "aria-hidden": "true"
                }, "To", -1)),
                W(T(u(ye)(e.process.states.find((o) => o.id === l.to))), 1)
              ]),
              s("td", qd, [
                k(u(ae), {
                  size: "small",
                  text: "",
                  severity: "secondary",
                  "aria-label": "Edit transition " + u(Xe)(l),
                  onClick: (o) => a.$emit("transition", l, o.currentTarget)
                }, {
                  default: q(() => [
                    k(u(pe), { icon: "tabler:pencil" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"]),
                k(u(ae), {
                  size: "small",
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove transition " + u(Xe)(l),
                  onClick: (o) => a.$emit("removeTransition", l)
                }, {
                  default: q(() => [
                    k(u(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ])
            ], 8, Ld))), 128))
          ])
        ])
      ])
    ]));
  }
}), $o = /* @__PURE__ */ Te({
  __name: "CapacityControl",
  props: {
    draft: {},
    state: {},
    label: {},
    hard: { type: Boolean }
  },
  setup(e) {
    const a = e, t = L(() => a.draft.policy?.wip?.[a.state]);
    function l(r) {
      if (r === null) {
        a.draft.policy?.wip && delete a.draft.policy.wip[a.state];
        return;
      }
      const v = a.draft.policy ??= {}, m = v.wip ??= {};
      m[a.state] = { ...m[a.state], limit: r };
    }
    function o(r) {
      t.value && (t.value.hard = r);
    }
    return (r, v) => e.hard ? (n(), H(u(nt), {
      key: 0,
      "aria-label": e.label,
      disabled: !t.value,
      "model-value": t.value?.hard ?? !1,
      "onUpdate:modelValue": o
    }, null, 8, ["aria-label", "disabled", "model-value"])) : (n(), H(u(St), {
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
async function Cl(e, a) {
  try {
    const { data: t } = await El.get(e, a ? { params: a } : void 0);
    if (!t?.success) {
      const l = t?.message || (typeof t?.error == "string" ? t.error : t?.error?.message) || "Could not read published Flow.";
      throw new Dl({ message: l, details: t?.details }, "Published Flow");
    }
    return t;
  } catch (t) {
    throw Ui(t, "Published Flow");
  }
}
const Vo = (e) => `/api/v1/workflows/${encodeURIComponent(e)}/versions`, Bl = {
  title: async (e) => (await Cl("/api/v1/workflows/published", { id: e })).item?.title,
  versions: async (e) => (await Cl(Vo(e))).versions ?? [],
  check: async (e) => {
    if ((await Cl(`${Vo(e.id)}/${e.version}`)).version?.version !== e.version) throw new Error("The published version is unavailable.");
  }
}, Gd = {
  class: "work-stack work-tight",
  "aria-label": "Stage Flow"
}, Kd = {
  key: 0,
  class: "work-muted work-small"
}, Hd = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Yd = { role: "alert" }, Xd = ["schema", "config", "title"], Jd = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Zd = {
  key: 4,
  class: "work-stack work-tight"
}, Qd = ["value", "aria-busy", "disabled"], _d = {
  value: "",
  disabled: ""
}, eu = ["value"], tu = {
  key: 5,
  class: "work-muted work-small",
  role: "status"
}, au = /* @__PURE__ */ Te({
  __name: "StageFlow",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = B(!1), r = B(""), v = B([]), m = B(!1), g = B(""), i = B(!1), d = L(() => r.value || t.modelValue?.id), c = JSON.stringify({ properties: { flow_ref: { title: "Published Flow", picker: "wc-workflow-picker" } } }), x = L(() => JSON.stringify(t.modelValue ? { flow_ref: t.modelValue } : {}));
    let y = 0;
    async function b() {
      o.value = await Mt("wc-workflow-picker");
    }
    b();
    async function p() {
      const S = ++y, D = d.value, z = t.modelValue;
      if (m.value = !!D, g.value = "", v.value = [], !!D)
        try {
          const [le] = await Promise.all([Bl.versions(D), !i.value && z ? Bl.check(z) : Promise.resolve()]);
          if (S !== y) return;
          if (v.value = le.filter((J) => Number.isInteger(J.version) && J.version > 0), !i.value && z && !v.value.some((J) => J.version === z.version)) throw new Error("The published version is unavailable.");
        } catch (le) {
          S === y && (g.value = vt(le, "Could not read published Flow."));
        } finally {
          S === y && (m.value = !1);
        }
    }
    De([d, () => t.modelValue?.version, i], p, { immediate: !0 }), De(i, (S) => l("validity", !S), { immediate: !0 });
    function w(S) {
      const D = S.detail?.flow_ref;
      D?.kind !== "flow" || !D.id || (i.value = !0, r.value = D.id);
    }
    function V(S) {
      !d.value || !v.value.some((D) => D.version === S) || (l("update:modelValue", { kind: "flow", id: d.value, version: S }), i.value = !1, r.value = "");
    }
    function $() {
      l("update:modelValue", void 0), i.value = !1, r.value = "";
    }
    return Dt(() => {
      y++, l("validity", !0);
    }), (S, D) => (n(), f("section", Gd, [
      D[4] || (D[4] = s("h4", { class: "work-field-label" }, "What runs", -1)),
      e.modelValue ? C("", !0) : (n(), f("p", Kd, "No Flow bound. This stage keeps its existing external execution contract.")),
      g.value ? (n(), f("div", Hd, [
        s("p", Yd, [
          W(T(i.value ? "Flow versions unavailable" : "Flow binding unavailable"), 1),
          !i.value && e.modelValue ? (n(), f(te, { key: 0 }, [
            W(" (v" + T(e.modelValue.version) + ")", 1)
          ], 64)) : C("", !0),
          W(". " + T(g.value), 1)
        ]),
        k(u(ae), {
          label: "Reload Flow",
          severity: "secondary",
          text: "",
          onClick: p
        })
      ])) : C("", !0),
      o.value ? (n(), f("wc-workflow-picker", {
        key: 2,
        schema: u(c),
        config: x.value,
        title: e.modelValue?.id,
        onChange: w
      }, null, 40, Xd)) : (n(), f("p", Jd, [
        D[2] || (D[2] = W("Published Flow picker unavailable.", -1)),
        k(u(ae), {
          label: "Reload Flow picker",
          text: "",
          severity: "secondary",
          onClick: b
        })
      ])),
      d.value ? (n(), f("label", Zd, [
        D[3] || (D[3] = W(" Published version ", -1)),
        s("select", {
          class: "p-inputtext work-flow-version",
          value: i.value ? "" : e.modelValue?.version,
          "aria-busy": m.value,
          disabled: m.value || !!g.value,
          onChange: D[0] || (D[0] = (z) => V(Number(z.target.value)))
        }, [
          s("option", _d, T(m.value ? "Loading versions…" : "Choose a published version"), 1),
          (n(!0), f(te, null, fe(v.value, (z) => (n(), f("option", {
            key: z.version,
            value: z.version
          }, "v" + T(z.version), 9, eu))), 128))
        ], 40, Qd)
      ])) : C("", !0),
      i.value ? (n(), f("p", tu, "Choose a published version to finish selecting the Flow.")) : C("", !0),
      e.modelValue || i.value ? (n(), H(u(ae), {
        key: 6,
        label: i.value ? "Cancel Flow selection" : "Remove Flow binding",
        "aria-label": i.value ? "Cancel Flow selection" : "Remove Flow binding",
        severity: "secondary",
        text: "",
        onClick: D[1] || (D[1] = (z) => i.value ? (i.value = !1, r.value = "") : $())
      }, null, 8, ["label", "aria-label"])) : C("", !0)
    ]));
  }
}), zl = { seconds: 1, minutes: 60, hours: 3600, days: 86400 };
function ya(e, a) {
  const t = /^P(\d+)W$/.exec(e), l = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(e);
  if (!t && (!l || e === "P" || e.endsWith("T"))) return;
  const o = t ? Number(t[1]) * 604800 : Number(l[1] ?? 0) * 86400 + Number(l[2] ?? 0) * 3600 + Number(l[3] ?? 0) * 60 + Number(l[4] ?? 0);
  if (!Number.isFinite(o) || o <= 0) return;
  const r = a ?? (o % 86400 === 0 ? "days" : o % 3600 === 0 ? "hours" : o < 60 ? "seconds" : "minutes");
  return { amount: o / zl[r], unit: r };
}
function lu(e, a) {
  if (e == null) return;
  if (!Number.isFinite(e * zl[a]) || e <= 0) throw new Error("Enter a positive duration.");
  const t = (o) => o.toLocaleString("en-US", { useGrouping: !1, maximumSignificantDigits: 21 });
  if (!Number.isInteger(e)) return `PT${t(e * zl[a])}S`;
  const l = { seconds: "S", minutes: "M", hours: "H", days: "D" }[a];
  return (a === "days" ? "P" : "PT") + t(e) + l;
}
const ou = { class: "work-stack work-tight" }, iu = {
  key: 0,
  class: "work-error",
  role: "alert"
}, Xt = /* @__PURE__ */ Te({
  __name: "DurationControl",
  props: {
    modelValue: {},
    label: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = "duration:" + wt(), r = B(), v = B(""), m = L(() => t.modelValue ? ya(t.modelValue) : void 0), g = L(() => r.value ?? m.value?.unit ?? "days");
    De(() => t.modelValue, (V) => {
      v.value = "", l("validity", !V || !!m.value, o);
    }, { immediate: !0 });
    const i = L(() => t.modelValue ? ya(t.modelValue, g.value)?.amount ?? null : null);
    function d(V) {
      try {
        const $ = lu(V, g.value);
        v.value = "", l("update:modelValue", $), l("validity", !0, o);
      } catch ($) {
        v.value = $.message, l("validity", !1, o);
      }
    }
    let c;
    function x(V) {
      V.target instanceof HTMLInputElement && (c = V.target.value);
    }
    function y(V) {
      if (c === void 0) return;
      const $ = c;
      c = void 0, p(V, $);
    }
    function b(V) {
      c = void 0;
      const $ = V.originalEvent?.target instanceof HTMLInputElement ? V.originalEvent.target.value : V.formattedValue;
      p(V.value, $);
    }
    function p(V, $) {
      if ($.trim() && (typeof V != "number" || !Number.isFinite(V))) {
        v.value = "Enter a positive duration.", l("validity", !1, o);
        return;
      }
      r.value = g.value, d(typeof V == "number" ? V : null);
    }
    function w(V) {
      const $ = i.value;
      r.value = V, !(t.modelValue && !m.value) && d($);
    }
    return Dt(() => l("validity", !0, o)), (V, $) => (n(), f("label", ou, [
      W(T(e.label), 1),
      s("span", {
        class: "work-duration-control",
        style: { "max-width": "360px" },
        onInputCapture: x
      }, [
        k(u(St), {
          "model-value": i.value,
          "aria-label": e.label,
          min: 0,
          "aria-invalid": !!v.value || !!e.modelValue && !u(ya)(e.modelValue),
          disabled: e.disabled,
          useGrouping: !1,
          "max-fraction-digits": g.value === "seconds" ? 20 : 3,
          onInput: b,
          "onUpdate:modelValue": y
        }, null, 8, ["model-value", "aria-label", "aria-invalid", "disabled", "max-fraction-digits"]),
        k(u(ge), {
          "model-value": g.value,
          "aria-label": e.label + " unit",
          disabled: e.disabled,
          options: [{ label: "Seconds", value: "seconds" }, { label: "Minutes", value: "minutes" }, { label: "Hours", value: "hours" }, { label: "Days", value: "days" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": $[0] || ($[0] = (S) => w(S))
        }, null, 8, ["model-value", "aria-label", "disabled"])
      ], 32),
      v.value || e.modelValue && !u(ya)(e.modelValue) ? (n(), f("span", iu, T(v.value || `Unsupported duration: ${e.modelValue}`), 1)) : C("", !0)
    ]));
  }
}), nu = { class: "work-stack" }, su = { class: "work-settings-grid" }, ru = { class: "work-stack work-tight" }, du = { class: "work-stack work-tight" }, uu = {
  key: 1,
  class: "work-stack work-tight"
}, cu = { class: "work-stack work-tight" }, vu = { class: "work-settings-grid" }, fu = { class: "work-row" }, mu = { class: "work-stack work-tight" }, pu = {
  key: 0,
  class: "work-stack work-tight"
}, gu = /* @__PURE__ */ Te({
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
      i.push({ id: la("timer", i), after: "P1D", then: { emit: "reminder" } });
    }
    function v(i, d) {
      delete i.after, delete i.at_field, d === "after" ? i.after = "P1D" : i.at_field = "";
    }
    function m(i, d, c) {
      c ? i[d] = c : (delete i[d], delete i.table);
    }
    function g(i, d) {
      i.then = d === "emit" ? { emit: "" } : { transition: "" };
    }
    return (i, d) => (n(), f("section", nu, [
      d[8] || (d[8] = s("h4", null, "Timers", -1)),
      (n(!0), f(te, null, fe(o(), (c, x) => (n(), f("article", {
        key: c.id,
        class: "work-settings-card work-stack"
      }, [
        s("div", su, [
          s("label", ru, [
            d[2] || (d[2] = W("Timer ID", -1)),
            k(u(Ae), {
              modelValue: c.id,
              "onUpdate:modelValue": (y) => c.id = y,
              required: "",
              pattern: "[a-z][a-z0-9_]*"
            }, null, 8, ["modelValue", "onUpdate:modelValue"])
          ]),
          s("label", du, [
            d[3] || (d[3] = W("Deadline", -1)),
            k(u(ge), {
              "model-value": c.at_field !== void 0 ? "at_field" : "after",
              "onUpdate:modelValue": (y) => v(c, y),
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
          c.after !== void 0 ? (n(), H(Xt, {
            key: 0,
            modelValue: c.after,
            "onUpdate:modelValue": (y) => c.after = y,
            label: "After",
            onValidity: d[0] || (d[0] = (y, b) => l("validity", b, y))
          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), f("label", uu, [
            d[4] || (d[4] = W("At field", -1)),
            k(u(ge), {
              modelValue: c.at_field,
              "onUpdate:modelValue": (y) => c.at_field = y,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                ...(e.draft.fields?.filter((y) => y.form === "time") ?? []).map((y) => ({
                  label: y.code,
                  value: y.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])),
          s("label", cu, [
            d[5] || (d[5] = W("Duration by field", -1)),
            k(u(ge), {
              "model-value": c.by ?? "",
              "onUpdate:modelValue": (y) => m(c, "by", y),
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              optionDisabled: "disabled",
              options: [
                { label: "Fixed duration", value: "", disabled: !1 },
                ...(e.draft.fields ?? []).map((y) => ({
                  label: y.code,
                  value: y.code,
                  disabled: !1
                }))
              ]
            }, null, 8, ["model-value", "onUpdate:modelValue", "options"])
          ])
        ]),
        c.by ? (n(), H(Ft, {
          key: 0,
          label: "Duration table",
          hint: "Map field values to ISO durations.",
          "model-value": c.table,
          shape: "object",
          "onUpdate:modelValue": (y) => c.table = y,
          onValidity: (y) => l("validity", "table-" + x, y)
        }, null, 8, ["model-value", "onUpdate:modelValue", "onValidity"])) : C("", !0),
        s("div", vu, [
          k(Xt, {
            modelValue: c.repeat,
            "onUpdate:modelValue": (y) => c.repeat = y,
            label: "Repeat every",
            onValidity: d[1] || (d[1] = (y, b) => l("validity", b, y)),
            disabled: c.interrupting
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
          s("label", fu, [
            k(u(Zt), {
              modelValue: c.interrupting,
              "onUpdate:modelValue": [(y) => c.interrupting = y, (y) => c.interrupting && delete c.repeat],
              binary: ""
            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
            d[6] || (d[6] = W("Interrupting", -1))
          ]),
          s("label", mu, [
            d[7] || (d[7] = W("Then", -1)),
            k(u(ge), {
              "model-value": c.then?.transition !== void 0 ? "transition" : "emit",
              "onUpdate:modelValue": (y) => g(c, y),
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
          c.then ? (n(), f("label", pu, [
            W(T(c.then.transition !== void 0 ? "Transition ID" : "Event name"), 1),
            c.then.transition !== void 0 ? (n(), H(u(Ae), {
              key: 0,
              modelValue: c.then.transition,
              "onUpdate:modelValue": (y) => c.then.transition = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(u(Ae), {
              key: 1,
              modelValue: c.then.emit,
              "onUpdate:modelValue": (y) => c.then.emit = y
            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
          ])) : C("", !0)
        ]),
        k(u(ae), {
          severity: "secondary",
          onClick: (y) => o().splice(x, 1),
          "aria-label": "Remove timer",
          text: "",
          size: "small"
        }, {
          default: q(() => [
            k(u(pe), {
              icon: "tabler:trash",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["onClick"])
      ]))), 128)),
      k(u(ae), {
        label: "Add timer",
        severity: "secondary",
        onClick: r,
        outlined: ""
      }, {
        icon: q(() => [
          k(u(pe), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      })
    ]));
  }
}), bu = ["aria-label"], hu = { class: "work-stack work-tight" }, yu = {
  key: 0,
  class: "work-stack work-tight"
}, ku = /* @__PURE__ */ Te({
  __name: "PrincipalSourceEditor",
  props: {
    modelValue: {},
    draft: {},
    boardId: {},
    label: {}
  },
  emits: ["update:modelValue", "validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => Array.isArray(t.modelValue) ? "principals" : "field" in t.modelValue ? "field" : "group"), r = L(() => Array.isArray(t.modelValue) ? t.modelValue : "group" in t.modelValue && t.modelValue.group ? [{ kind: "group", id: t.modelValue.group }] : []);
    function v(g) {
      l("update:modelValue", g === "field" ? { field: "" } : g === "group" ? { group: "" } : []);
    }
    function m(g) {
      l("update:modelValue", o.value === "group" ? { group: g.at(-1)?.id ?? "" } : g);
    }
    return Ao(() => l("validity", Array.isArray(t.modelValue) ? t.modelValue.length > 0 : "field" in t.modelValue ? !!t.modelValue.field : !!t.modelValue.group)), Dt(() => l("validity", !0)), (g, i) => (n(), f("section", {
      class: "work-stack work-tight",
      "aria-label": e.label
    }, [
      s("label", hu, [
        W(T(e.label) + " source", 1),
        k(u(ge), {
          "model-value": o.value,
          "aria-label": e.label + " source",
          options: [{ label: "Group", value: "group" }, { label: "People and groups", value: "principals" }, { label: "Principal field", value: "field" }],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": v
        }, null, 8, ["model-value", "aria-label"])
      ]),
      "field" in e.modelValue ? (n(), f("label", yu, [
        i[1] || (i[1] = W("Principal field", -1)),
        k(u(ge), {
          "model-value": e.modelValue.field,
          "aria-label": e.label + " field",
          options: e.draft.fields?.filter((d) => d.type === "principal").map((d) => ({ label: d.title || d.code, value: d.code })) ?? [],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i[0] || (i[0] = (d) => l("update:modelValue", { field: d }))
        }, null, 8, ["model-value", "aria-label", "options"])
      ])) : (n(), H(Xl, {
        key: 1,
        "board-id": e.boardId,
        label: e.label,
        kinds: o.value === "group" ? "group" : "user,group,service",
        "model-value": r.value,
        "onUpdate:modelValue": m
      }, null, 8, ["board-id", "label", "kinds", "model-value"]))
    ], 8, bu));
  }
}), wu = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, $u = {
  class: "work-stack work-tight",
  "aria-label": "Approval sources"
}, Vu = { class: "work-stack work-tight" }, xu = {
  key: 0,
  class: "work-stack work-tight"
}, Cu = ["kinds", "placeholder", "value"], Su = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Tu = {
  key: 3,
  class: "work-chips"
}, Iu = {
  key: 4,
  class: "work-error work-small",
  role: "alert"
}, Du = {
  key: 5,
  class: "work-muted work-small"
}, Uu = { class: "work-row" }, Eu = { class: "work-row work-small" }, Au = /* @__PURE__ */ Te({
  __name: "ApproversEditor",
  props: {
    approvals: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, { principalLabel: o, rememberPrincipal: r, nameError: v } = Po(() => t.boardId ?? "", () => {
      const p = t.approvals.from;
      return Array.isArray(p) ? Ei(p) : "group" in p && p.group ? [{ kind: "group", id: p.group }] : [];
    }), m = B(), g = L(() => Array.isArray(t.approvals.from) ? "principals" : "field" in t.approvals.from ? "field" : "group"), i = L(() => {
      const p = t.approvals.from;
      return "group" in p && p.group ? JSON.stringify({ type: "group", principal_id: p.group }) : "{}";
    }), d = [
      { label: "Group members", value: "group" },
      { label: "People and groups", value: "principals" },
      { label: "Principal field", value: "field" }
    ], c = L(() => Array.isArray(t.approvals.from) ? t.approvals.from.some((p) => p.kind === "group") || t.approvals.from.length >= t.approvals.min : "field" in t.approvals.from ? !!t.approvals.from.field : !!t.approvals.from.group);
    Ao(() => l("validity", Number.isSafeInteger(t.approvals.min) && t.approvals.min > 0 && c.value)), Dt(() => l("validity", !0)), Ua(async () => {
      m.value = await Mt("wc-principal-picker");
    });
    function x(p) {
      t.approvals.from = p === "group" ? { group: "" } : p === "field" ? { field: "" } : [];
    }
    function y(p) {
      const w = p.detail, V = w?.principal_id ?? w?.id;
      if (g.value === "group") {
        t.approvals.from = { group: V ?? "" };
        return;
      }
      if (!V || !Array.isArray(t.approvals.from)) return;
      const $ = { kind: w.type ?? w.kind ?? "user", id: V };
      w.label && r($, w.label), t.approvals.from.some((S) => S.id === V && S.kind === $.kind) || t.approvals.from.push($);
    }
    function b(p) {
      Array.isArray(t.approvals.from) && t.approvals.from.splice(p, 1);
    }
    return (p, w) => (n(), f(te, null, [
      u(v) ? (n(), f("p", wu, T(u(v)), 1)) : C("", !0),
      s("section", $u, [
        s("label", Vu, [
          w[4] || (w[4] = W("Approval source ", -1)),
          k(u(ge), {
            "model-value": g.value,
            "aria-label": "Approval source",
            "onUpdate:modelValue": w[0] || (w[0] = (V) => x(V)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: d
          }, null, 8, ["model-value"])
        ]),
        "field" in e.approvals.from ? (n(), f("label", xu, [
          w[5] || (w[5] = W("Principal field", -1)),
          k(u(Ae), {
            modelValue: e.approvals.from.field,
            "onUpdate:modelValue": w[1] || (w[1] = (V) => e.approvals.from.field = V),
            "aria-label": "Principal field"
          }, null, 8, ["modelValue"])
        ])) : m.value ? (n(), f("wc-principal-picker", {
          key: g.value,
          kinds: g.value === "group" ? "group" : "user,group",
          placeholder: g.value === "group" ? "Select a group…" : "Select a person or group…",
          value: i.value,
          onConfigChanged: y
        }, null, 40, Cu)) : (n(), f("p", Su, T(m.value === !1 ? "The principal picker is unavailable." : "Loading approver picker…"), 1)),
        Array.isArray(e.approvals.from) ? (n(), f("div", Tu, [
          (n(!0), f(te, null, fe(e.approvals.from, (V, $) => (n(), H(u(tt), {
            key: V.kind + ":" + V.id,
            class: "kx-tag-sm",
            severity: "secondary"
          }, {
            default: q(() => [
              W(T(u(o)(V)), 1),
              k(u(ae), {
                "aria-label": "Remove approver " + ($ + 1),
                text: "",
                severity: "secondary",
                size: "small",
                onClick: (S) => b($)
              }, {
                default: q(() => [
                  k(u(pe), {
                    icon: "tabler:x",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ])) : C("", !0),
        Array.isArray(e.approvals.from) && !c.value ? (n(), f("p", Iu, "Select at least " + T(e.approvals.min) + " distinct principals, or lower the minimum.", 1)) : "group" in e.approvals.from && !e.approvals.from.group ? (n(), f("p", Du, "Choose the group that can approve this state.")) : C("", !0),
        s("label", Uu, [
          w[6] || (w[6] = s("span", { class: "work-spacer" }, "Approvals needed", -1)),
          k(u(St), {
            modelValue: e.approvals.min,
            "onUpdate:modelValue": w[2] || (w[2] = (V) => e.approvals.min = V),
            min: 1,
            required: "",
            useGrouping: !1
          }, null, 8, ["modelValue"])
        ]),
        s("label", Eu, [
          w[7] || (w[7] = s("span", { class: "work-spacer" }, "The person who moves the item here cannot approve this visit", -1)),
          k(u(nt), {
            modelValue: e.approvals.prevent_self,
            "onUpdate:modelValue": w[3] || (w[3] = (V) => e.approvals.prevent_self = V),
            "aria-label": "The person who moves the item here cannot approve this visit"
          }, null, 8, ["modelValue"])
        ])
      ])
    ], 64));
  }
}), Ou = {
  class: "work-state-settings work-stack",
  "aria-label": "State settings"
}, Pu = { class: "work-process-kind" }, Ru = { class: "work-stack" }, Nu = { class: "work-row" }, Mu = { class: "work-row" }, Fu = { class: "work-row" }, Lu = { class: "work-stack work-tight" }, Bu = { class: "work-row" }, zu = { class: "work-stack work-tight" }, ju = { class: "work-row" }, qu = { class: "work-row" }, Wu = { class: "work-stack work-tight" }, Gu = { class: "work-stack" }, Ku = { class: "work-row" }, Hu = { class: "work-row" }, Yu = { class: "work-stack work-tight" }, Xu = { class: "work-stack work-tight" }, Ju = {
  key: 0,
  class: "work-row"
}, Zu = { class: "work-stack" }, Qu = { class: "work-stack work-tight" }, _u = { class: "work-row" }, ec = /* @__PURE__ */ Te({
  __name: "StateSettings",
  props: {
    state: {},
    process: {},
    draft: {},
    boardId: {}
  },
  emits: ["validity", "kind"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => (t.process.transitions ?? []).filter((g) => g.from === "any" || g.from.includes(t.state.id))), r = [{ value: "human", icon: "user" }, { value: "gate", icon: "shield-check" }, { value: "automated", icon: "bolt" }, { value: "parallel", icon: "arrows-split" }];
    function v(g) {
      const i = t.state;
      i.kind = g, delete i.run, delete i.release_when, delete i.regions, delete i.join, delete i.due, (g === "automated" || g === "gate") && delete i.awaiting, g === "automated" && (i.run = { stage: i.id, retry: { max: 1, backoff: "PT1M" } }), g === "gate" && (i.release_when = { approvals: { min: 1, from: { group: "" }, prevent_self: !0 } }), g === "parallel" && (i.regions = [{ id: "region_1", initial: t.process.states.find((d) => d.id !== i.id)?.id ?? "" }], i.join = "all"), l("kind", g);
    }
    function m(g) {
      t.state.run && (g ? t.state.run.on_fail = g : delete t.state.run.on_fail);
    }
    return (g, i) => (n(), f("section", Ou, [
      i[57] || (i[57] = s("h4", { class: "work-process-group" }, "Who moves the item on", -1)),
      k(u(Wl), {
        class: "work-process-kinds",
        "model-value": e.state.kind ?? "human",
        options: r.map((d) => ({
          ...d,
          label: u(Ja)(d.value)
        })),
        optionLabel: "label",
        optionValue: "value",
        optionDisabled: "disabled",
        "allow-empty": !1,
        "aria-label": "Who moves the item on",
        "onUpdate:modelValue": v
      }, {
        option: q(({ option: d }) => [
          s("span", Pu, [
            k(u(pe), {
              icon: "tabler:" + d.icon
            }, null, 8, ["icon"]),
            s("span", null, T(d.label), 1)
          ])
        ]),
        _: 1
      }, 8, ["model-value", "options"]),
      e.state.kind === "gate" && e.state.release_when ? (n(), f(te, { key: 0 }, [
        i[35] || (i[35] = s("h4", { class: "work-process-group" }, "Approval", -1)),
        e.state.release_when.approvals ? (n(), H(Au, {
          key: 0,
          "board-id": e.boardId,
          approvals: e.state.release_when.approvals,
          onValidity: i[0] || (i[0] = (d) => l("validity", "approvers", d))
        }, null, 8, ["board-id", "approvals"])) : C("", !0),
        k(qe, {
          class: "work-process-options",
          label: "Release options"
        }, {
          default: q(() => [
            s("div", Ru, [
              s("label", Nu, [
                i[34] || (i[34] = s("span", { class: "work-spacer" }, "Require approvals", -1)),
                k(u(nt), {
                  "model-value": !!e.state.release_when.approvals,
                  "aria-label": "Require approvals",
                  "onUpdate:modelValue": i[1] || (i[1] = (d) => e.state.release_when.approvals = d ? { min: 1, from: { group: "" }, prevent_self: !0 } : void 0)
                }, null, 8, ["model-value"])
              ]),
              k(Xt, {
                modelValue: e.state.release_when.wait,
                "onUpdate:modelValue": i[2] || (i[2] = (d) => e.state.release_when.wait = d),
                label: "Wait before release",
                onValidity: i[3] || (i[3] = (d, c) => l("validity", c, d))
              }, null, 8, ["modelValue"]),
              k(Yl, {
                label: "Release when",
                draft: e.draft,
                "board-id": e.boardId,
                modelValue: e.state.release_when.when,
                "onUpdate:modelValue": i[4] || (i[4] = (d) => e.state.release_when.when = d),
                onValidity: i[5] || (i[5] = (d) => l("validity", "release", d))
              }, null, 8, ["draft", "board-id", "modelValue"])
            ])
          ]),
          _: 1
        })
      ], 64)) : C("", !0),
      i[58] || (i[58] = s("h4", { class: "work-process-group" }, "Limit", -1)),
      s("label", Mu, [
        i[36] || (i[36] = s("span", { class: "work-spacer" }, "Items allowed here", -1)),
        k($o, {
          draft: e.draft,
          state: e.state.id,
          label: "Items allowed here"
        }, null, 8, ["draft", "state"])
      ]),
      s("label", Fu, [
        i[37] || (i[37] = s("span", { class: "work-spacer" }, [
          W("Refuse moves over the limit"),
          s("small", { class: "work-muted work-block" }, "Off only warns")
        ], -1)),
        k($o, {
          draft: e.draft,
          state: e.state.id,
          label: "Refuse moves over the limit",
          hard: ""
        }, null, 8, ["draft", "state"])
      ]),
      i[59] || (i[59] = s("h4", { class: "work-process-group" }, "Required on entry", -1)),
      k(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((d) => ({ value: d.code, label: d.title || d.code })) ?? [],
        modelValue: e.state.require,
        "onUpdate:modelValue": i[6] || (i[6] = (d) => e.state.require = d)
      }, null, 8, ["options", "modelValue"]),
      !e.state.kind || e.state.kind === "human" ? (n(), H(Xt, {
        key: 1,
        modelValue: e.state.due,
        "onUpdate:modelValue": i[7] || (i[7] = (d) => e.state.due = d),
        label: "Time allowed in this state",
        onValidity: i[8] || (i[8] = (d, c) => l("validity", c, d))
      }, null, 8, ["modelValue"])) : C("", !0),
      e.state.kind === "automated" && e.state.run ? (n(), f(te, { key: 2 }, [
        i[46] || (i[46] = s("h4", { class: "work-process-group" }, "Automation", -1)),
        s("label", Lu, [
          i[38] || (i[38] = W("Run label", -1)),
          k(u(Ae), {
            modelValue: e.state.run.stage,
            "onUpdate:modelValue": i[9] || (i[9] = (d) => e.state.run.stage = d),
            "aria-label": "Run label",
            required: ""
          }, null, 8, ["modelValue"])
        ]),
        k(au, {
          modelValue: e.state.run.flow_ref,
          "onUpdate:modelValue": i[10] || (i[10] = (d) => e.state.run.flow_ref = d),
          onValidity: i[11] || (i[11] = (d) => l("validity", "flow", d))
        }, null, 8, ["modelValue"]),
        k(Xt, {
          modelValue: e.state.run.timeout,
          "onUpdate:modelValue": i[12] || (i[12] = (d) => e.state.run.timeout = d),
          label: "Attempt timeout",
          onValidity: i[13] || (i[13] = (d, c) => l("validity", c, d))
        }, null, 8, ["modelValue"]),
        i[47] || (i[47] = s("small", { class: "work-muted" }, "Blank uses the board timeout, or one hour.", -1)),
        s("label", Bu, [
          i[39] || (i[39] = s("span", { class: "work-spacer" }, "Maximum visits", -1)),
          k(u(St), {
            "model-value": e.state.run.max_visits ?? null,
            "aria-label": "Maximum visits",
            min: 1,
            useGrouping: !1,
            placeholder: "Board default",
            "onUpdate:modelValue": i[14] || (i[14] = (d) => e.state.run.max_visits = d ?? void 0)
          }, null, 8, ["model-value"])
        ]),
        s("label", zu, [
          i[40] || (i[40] = W("When visits are exhausted", -1)),
          k(u(ge), {
            "model-value": e.state.run.on_exhausted,
            "aria-label": "When visits are exhausted",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: (e.process.transitions ?? []).filter((d) => !d.auto).map((d) => ({ label: u(Xe)(d), value: d.id })),
            "onUpdate:modelValue": i[15] || (i[15] = (d) => e.state.run.on_exhausted = d || void 0)
          }, null, 8, ["model-value", "options"])
        ]),
        i[48] || (i[48] = s("small", { class: "work-muted" }, "Blank records a failed run and stops automation. A route must leave every incoming state or be global.", -1)),
        s("label", ju, [
          i[41] || (i[41] = s("span", { class: "work-spacer" }, "Retry if it fails", -1)),
          k(u(nt), {
            "model-value": !!e.state.run.retry,
            "aria-label": "Retry if it fails",
            "onUpdate:modelValue": i[16] || (i[16] = (d) => e.state.run.retry = d ? { max: 1, backoff: "PT1M" } : void 0)
          }, null, 8, ["model-value"])
        ]),
        e.state.run.retry ? (n(), f(te, { key: 0 }, [
          s("label", qu, [
            i[42] || (i[42] = s("span", { class: "work-spacer" }, "Maximum attempts", -1)),
            k(u(St), {
              modelValue: e.state.run.retry.max,
              "onUpdate:modelValue": i[17] || (i[17] = (d) => e.state.run.retry.max = d),
              min: 1,
              useGrouping: !1
            }, null, 8, ["modelValue"])
          ]),
          k(Xt, {
            modelValue: e.state.run.retry.backoff,
            "onUpdate:modelValue": i[18] || (i[18] = (d) => e.state.run.retry.backoff = d),
            label: "Wait between attempts",
            onValidity: i[19] || (i[19] = (d, c) => l("validity", c, d))
          }, null, 8, ["modelValue"])
        ], 64)) : C("", !0),
        (n(), f(te, null, fe([{ key: "on_pass", label: "On success" }, { key: "on_cancel", label: "On cancellation" }], (d) => s("label", {
          key: d.key,
          class: "work-stack work-tight"
        }, [
          W(T(d.label), 1),
          k(u(ge), {
            "model-value": e.state.run[d.key],
            "aria-label": d.label,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((c) => ({ label: u(Xe)(c), value: c.id })),
            "onUpdate:modelValue": (c) => e.state.run[d.key] = c || void 0
          }, null, 8, ["model-value", "aria-label", "options", "onUpdate:modelValue"])
        ])), 64)),
        s("label", Wu, [
          i[43] || (i[43] = W("If it fails, go to", -1)),
          k(u(ge), {
            "aria-label": "If it fails, go to",
            "model-value": e.state.run.on_fail,
            "onUpdate:modelValue": m,
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            showClear: "",
            options: o.value.map((d) => ({
              label: u(Xe)(d) + " → " + u(ye)(e.process.states.find((c) => c.id === d.to)),
              value: d.id
            }))
          }, null, 8, ["model-value", "options"])
        ]),
        k(qe, {
          class: "work-disclosure",
          label: "Board automation defaults"
        }, {
          default: q(() => [
            s("div", Gu, [
              i[45] || (i[45] = s("p", { class: "work-muted" }, "These values apply to automated states without their own limit.", -1)),
              k(Xt, {
                "model-value": e.draft.policy?.stage_timeout,
                label: "Default attempt timeout",
                "onUpdate:modelValue": i[20] || (i[20] = (d) => (e.draft.policy ??= {}).stage_timeout = d),
                onValidity: i[21] || (i[21] = (d, c) => l("validity", c, d))
              }, null, 8, ["model-value"]),
              s("label", Ku, [
                i[44] || (i[44] = s("span", { class: "work-spacer" }, "Default maximum visits", -1)),
                k(u(St), {
                  "model-value": e.draft.policy?.stage_max_visits ?? null,
                  "aria-label": "Default maximum visits",
                  min: 1,
                  useGrouping: !1,
                  placeholder: "5",
                  "onUpdate:modelValue": i[22] || (i[22] = (d) => (e.draft.policy ??= {}).stage_max_visits = d ?? void 0)
                }, null, 8, ["model-value"])
              ])
            ])
          ]),
          _: 1
        })
      ], 64)) : C("", !0),
      e.state.kind === "parallel" && e.state.regions ? (n(), f(te, { key: 3 }, [
        i[53] || (i[53] = s("h4", { class: "work-process-group" }, "Lanes", -1)),
        (n(!0), f(te, null, fe(e.state.regions, (d, c) => (n(), f("div", {
          key: c,
          class: "work-process-value work-stack work-tight"
        }, [
          s("div", Hu, [
            s("span", null, "Lane " + T(c + 1), 1),
            i[49] || (i[49] = s("span", { class: "work-spacer" }, null, -1)),
            k(u(ae), {
              severity: "danger",
              text: "",
              size: "small",
              "aria-label": "Remove lane",
              onClick: (x) => e.state.regions.splice(c, 1)
            }, {
              default: q(() => [
                k(u(pe), { icon: "tabler:trash" })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          s("label", Yu, [
            i[50] || (i[50] = W("Starts at", -1)),
            k(u(ge), {
              "aria-label": "Lane starts at",
              modelValue: d.initial,
              "onUpdate:modelValue": (x) => d.initial = x,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.process.states.filter((x) => x.id !== e.state.id).map((x) => ({ label: u(ye)(x), value: x.id }))
            }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
          ])
        ]))), 128)),
        k(u(ae), {
          label: "Add lane",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: i[23] || (i[23] = (d) => e.state.regions.push({
            id: u(la)("region", e.state.regions),
            initial: e.process.states.find((c) => c.id !== e.state.id)?.id ?? ""
          }))
        }, {
          icon: q(() => [
            k(u(pe), { icon: "tabler:plus" })
          ]),
          _: 1
        }),
        s("label", Xu, [
          i[51] || (i[51] = W("Finish rule", -1)),
          k(u(ge), {
            "model-value": typeof e.state.join == "number" ? "count" : e.state.join ?? "all",
            appendTo: "self",
            options: [
              { label: "All must pass", value: "all" },
              { label: "Any may pass", value: "any" },
              { label: "A number must pass", value: "count" }
            ],
            optionLabel: "label",
            optionValue: "value",
            "onUpdate:modelValue": i[24] || (i[24] = (d) => e.state.join = d === "count" ? 1 : d)
          }, null, 8, ["model-value"])
        ]),
        typeof e.state.join == "number" ? (n(), f("label", Ju, [
          i[52] || (i[52] = s("span", { class: "work-spacer" }, "Lanes needed", -1)),
          k(u(St), {
            modelValue: e.state.join,
            "onUpdate:modelValue": i[25] || (i[25] = (d) => e.state.join = d),
            min: 1,
            max: e.state.regions.length,
            useGrouping: !1
          }, null, 8, ["modelValue", "max"])
        ])) : C("", !0)
      ], 64)) : C("", !0),
      k(qe, {
        class: "work-disclosure",
        label: "Advanced state settings"
      }, {
        default: q(() => [
          s("div", Zu, [
            i[56] || (i[56] = s("h4", { class: "work-process-group" }, "Assignment and conditions", -1)),
            s("label", Qu, [
              i[54] || (i[54] = W("Stage label", -1)),
              k(u(Ae), {
                "model-value": e.state.stage,
                "aria-label": "Stage label",
                "onUpdate:modelValue": i[26] || (i[26] = (d) => e.state.stage = d || void 0)
              }, null, 8, ["model-value"])
            ]),
            !e.state.kind || e.state.kind === "human" || e.state.kind === "parallel" ? (n(), f(te, { key: 0 }, [
              s("label", _u, [
                k(u(nt), {
                  "model-value": !!e.state.awaiting,
                  "aria-label": "Awaiting people",
                  "onUpdate:modelValue": i[27] || (i[27] = (d) => e.state.awaiting = d ? { group: "" } : void 0)
                }, null, 8, ["model-value"]),
                i[55] || (i[55] = W("Awaiting people", -1))
              ]),
              e.state.awaiting ? (n(), H(ku, {
                key: 0,
                modelValue: e.state.awaiting,
                "onUpdate:modelValue": i[28] || (i[28] = (d) => e.state.awaiting = d),
                draft: e.draft,
                "board-id": e.boardId,
                label: "Awaiting",
                onValidity: i[29] || (i[29] = (d) => l("validity", "awaiting", d))
              }, null, 8, ["modelValue", "draft", "board-id"])) : C("", !0)
            ], 64)) : C("", !0),
            k(Xl, {
              "board-id": e.boardId,
              modelValue: e.state.assign,
              "onUpdate:modelValue": i[30] || (i[30] = (d) => e.state.assign = d),
              label: "Assign to"
            }, null, 8, ["board-id", "modelValue"]),
            k(Ft, {
              label: "State checks",
              example: ["installed-check"],
              "model-value": e.state.invariants,
              shape: "array",
              "onUpdate:modelValue": i[31] || (i[31] = (d) => e.state.invariants = d),
              onValidity: i[32] || (i[32] = (d) => l("validity", "invariants", d))
            }, null, 8, ["model-value"]),
            k(gu, {
              state: e.state,
              draft: e.draft,
              onValidity: i[33] || (i[33] = (d, c) => l("validity", "timer-" + d, c))
            }, null, 8, ["state", "draft"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), tc = { class: "work-stack work-transition-settings" }, ac = { class: "work-stack work-tight" }, lc = { class: "work-row" }, oc = { key: 0 }, ic = { class: "work-stack" }, nc = { class: "work-row" }, sc = { class: "work-row" }, rc = { class: "work-stack work-tight" }, dc = { class: "work-row" }, uc = { class: "work-stack work-tight" }, cc = { class: "work-stack work-tight" }, vc = /* @__PURE__ */ Te({
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
    function r(i, d) {
      const c = t.transition.set?.[i];
      !c || !t.transition.set || (t.transition.set[i] = { field: c.field, ...d === "clear" ? { clear: !0 } : d === "copy" ? { copy: "" } : { value: "" } });
    }
    function v(i) {
      return !i || typeof i != "object" || !("field" in i) || typeof i.field != "string" ? !1 : "clear" in i ? i.clear === !0 && !("copy" in i) && !("value" in i) : "copy" in i ? typeof i.copy == "string" && !("value" in i) : "value" in i;
    }
    function m(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every(v)))
        return "Each effect needs a field and exactly one of value, clear (true), or copy (a source field).";
      t.transition.set = i;
    }
    function g(i) {
      if (i !== void 0 && (!Array.isArray(i) || !i.every((d) => typeof d == "string")))
        return "Enter guard IDs as strings.";
      t.transition.guards = i;
    }
    return (i, d) => (n(), f("div", tc, [
      s("label", ac, [
        d[13] || (d[13] = W("To state", -1)),
        k(u(ge), {
          modelValue: e.transition.to,
          "onUpdate:modelValue": d[0] || (d[0] = (c) => e.transition.to = c),
          "aria-label": "To state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: e.process.states.map((c) => ({ label: u(ye)(c), value: c.id }))
        }, null, 8, ["modelValue", "options"])
      ]),
      s("label", lc, [
        d[14] || (d[14] = s("span", { class: "work-spacer" }, "Works from any state", -1)),
        k(u(nt), {
          "model-value": e.transition.from === "any",
          "aria-label": "Works from any state",
          "onUpdate:modelValue": d[1] || (d[1] = (c) => e.transition.from = c ? "any" : [])
        }, null, 8, ["model-value"])
      ]),
      e.transition.from !== "any" ? (n(), H(mt, {
        key: 0,
        label: "From states",
        options: e.process.states.map((c) => ({ value: c.id, label: u(ye)(c) })),
        modelValue: e.transition.from,
        "onUpdate:modelValue": d[2] || (d[2] = (c) => e.transition.from = c)
      }, null, 8, ["options", "modelValue"])) : C("", !0),
      d[22] || (d[22] = s("h4", { class: "work-process-group" }, "Must be filled", -1)),
      k(mt, {
        label: "Required fields",
        options: e.draft.fields?.map((c) => ({ value: c.code, label: c.title || c.code })) ?? [],
        modelValue: e.transition.require,
        "onUpdate:modelValue": d[3] || (d[3] = (c) => e.transition.require = c)
      }, null, 8, ["options", "modelValue"]),
      d[23] || (d[23] = s("h4", { class: "work-process-group" }, "Only when", -1)),
      k(Yl, {
        label: "Allow this transition when",
        draft: e.draft,
        "board-id": e.boardId,
        "model-value": e.transition.when,
        "onUpdate:modelValue": d[4] || (d[4] = (c) => e.transition.when = c),
        onValidity: d[5] || (d[5] = (c) => l("validity", "when", c))
      }, null, 8, ["draft", "board-id", "model-value"]),
      e.guards?.length || e.transition.guards?.length ? (n(), H(mt, {
        key: 1,
        label: "Installed checks",
        options: [...(e.guards ?? []).map((c) => ({ value: c.id, label: c.title })), ...(e.transition.guards ?? []).filter((c) => !e.guards?.some((x) => x.id === c)).map((c) => ({ value: c, label: e.guards ? "Unavailable check" : "Configured check" }))],
        modelValue: e.transition.guards,
        "onUpdate:modelValue": d[6] || (d[6] = (c) => e.transition.guards = c)
      }, null, 8, ["options", "modelValue"])) : C("", !0),
      (n(!0), f(te, null, fe(e.guards?.filter((c) => e.transition.guards?.includes(c.id)) ?? [], (c) => (n(), f("p", {
        key: c.id,
        class: "work-muted work-small"
      }, [
        W(T(c.description || c.title + " can stop this transition.") + " ", 1),
        c.reads?.length ? (n(), f("span", oc, " Checks " + T(c.reads.map((x) => e.draft.fields?.find((y) => y.code === x)?.title || "a configured field").join(", ")) + ".", 1)) : C("", !0)
      ]))), 128)),
      k(qe, {
        class: "work-disclosure",
        label: "Advanced transition settings"
      }, {
        default: q(() => [
          s("div", ic, [
            s("label", nc, [
              d[15] || (d[15] = s("span", { class: "work-spacer" }, "Happens automatically", -1)),
              k(u(nt), {
                "model-value": e.transition.auto,
                "onUpdate:modelValue": d[7] || (d[7] = (c) => {
                  e.transition.auto = c, c || delete e.transition.default;
                }),
                "aria-label": "Automatic transition"
              }, null, 8, ["model-value"])
            ]),
            s("label", sc, [
              d[16] || (d[16] = s("span", { class: "work-spacer" }, "Default automatic transition", -1)),
              k(u(nt), {
                modelValue: e.transition.default,
                "onUpdate:modelValue": d[8] || (d[8] = (c) => e.transition.default = c),
                disabled: !e.transition.auto,
                "aria-label": "Default transition"
              }, null, 8, ["modelValue", "disabled"])
            ]),
            d[21] || (d[21] = s("h4", { class: "work-process-group" }, "Also sets", -1)),
            (n(!0), f(te, null, fe(e.transition.set ?? [], (c, x) => (n(), f("div", {
              key: x,
              class: "work-process-value work-stack work-tight"
            }, [
              s("label", rc, [
                d[17] || (d[17] = W("Field", -1)),
                k(u(ge), {
                  modelValue: c.field,
                  "onUpdate:modelValue": (y) => c.field = y,
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
              ]),
              s("div", dc, [
                k(u(ge), {
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
                  "onUpdate:modelValue": (y) => r(x, y)
                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                k(u(ae), {
                  text: "",
                  severity: "danger",
                  "aria-label": "Remove value " + (x + 1),
                  onClick: (y) => e.transition.set?.splice(x, 1)
                }, {
                  default: q(() => [
                    k(u(pe), { icon: "tabler:trash" })
                  ]),
                  _: 1
                }, 8, ["aria-label", "onClick"])
              ]),
              c.copy !== void 0 ? (n(), H(u(ge), {
                key: 0,
                modelValue: c.copy,
                "onUpdate:modelValue": (y) => c.copy = y,
                "aria-label": "Copy from field",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: e.draft.fields?.map((y) => ({ value: y.code, label: y.title || y.code })) ?? []
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])) : c.clear ? C("", !0) : (n(!0), f(te, { key: 1 }, fe(e.draft.fields?.filter((y) => y.code === c.field) ?? [], (y) => (n(), H(qo, {
                key: y.code,
                "board-id": e.boardId ?? "",
                field: y,
                modelValue: c.value,
                "onUpdate:modelValue": (b) => c.value = b,
                onValidity: (b) => l("validity", "effect-" + x, b)
              }, null, 8, ["board-id", "field", "modelValue", "onUpdate:modelValue", "onValidity"]))), 128))
            ]))), 128)),
            k(u(ae), {
              label: "Add value",
              severity: "secondary",
              outlined: "",
              size: "small",
              onClick: o
            }, {
              icon: q(() => [
                k(u(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            }),
            s("label", uc, [
              d[18] || (d[18] = W("Offer to people", -1)),
              k(u(ge), {
                "model-value": e.transition.people,
                "aria-label": "Offer to people",
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: [{ label: "Work default", value: void 0 }, { label: "Offer explicitly", value: !0 }, { label: "Process engine only", value: !1 }],
                "onUpdate:modelValue": d[9] || (d[9] = (c) => e.transition.people = c)
              }, null, 8, ["model-value"]),
              d[19] || (d[19] = s("span", { class: "work-muted work-small" }, "Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.", -1))
            ]),
            s("label", cc, [
              d[20] || (d[20] = W("Evaluation order", -1)),
              k(u(St), {
                "model-value": e.transition.order ?? null,
                "aria-label": "Transition order",
                min: 0,
                useGrouping: !1,
                "onUpdate:modelValue": d[10] || (d[10] = (c) => e.transition.order = c ?? void 0)
              }, null, 8, ["model-value"])
            ]),
            k(Ft, {
              label: "Set values",
              "model-value": e.transition.set,
              shape: "array",
              commit: m,
              onValidity: d[11] || (d[11] = (c) => l("validity", "set", c))
            }, null, 8, ["model-value"]),
            k(Ft, {
              label: "Guards",
              "model-value": e.transition.guards,
              shape: "array",
              commit: g,
              onValidity: d[12] || (d[12] = (c) => l("validity", "guards", c))
            }, null, 8, ["model-value"])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), fc = ["aria-label", "aria-keyshortcuts", "onKeydown"], mc = { class: "work-row" }, pc = {
  key: 0,
  class: "work-stack work-tight"
}, gc = { class: "work-process-meaning" }, bc = {
  key: 1,
  class: "work-muted"
}, hc = { class: "work-stack work-tight" }, yc = { class: "work-next-transition work-stack work-tight" }, kc = { class: "work-row work-wrap" }, wc = { class: "work-process-inspector-foot" }, $c = { class: "work-row work-transition-actions" }, Vc = { class: "work-process-meaning" }, xc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cc = { class: "work-stack work-tight" }, Sc = /* @__PURE__ */ Te({
  __name: "ProcessInspector",
  props: {
    process: {},
    draft: {},
    boardId: {},
    guards: {},
    error: {},
    selectedState: {},
    selectedTransition: {},
    insertedRoute: {},
    processCounts: {}
  },
  emits: ["close", "focus-editor", "validity", "kind", "connect", "remove-state", "remove-transition"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = B(), v = B(!1), m = B(!1), g = B("");
    let i;
    function d() {
      i = void 0, v.value = !1, m.value = !1, g.value = "";
    }
    async function c(w) {
      d(), i = w, await yt(), r.value && (r.value.scrollTop = 0, r.value.focus({ preventScroll: !0 }), (r.value.closest(".work-settings-shell")?.clientWidth ?? 1 / 0) <= 700 && r.value.scrollIntoView?.({ block: "nearest" }));
    }
    async function x() {
      const w = i;
      o("close"), await yt(), w?.isConnected ? w.focus() : o("focus-editor");
    }
    async function y() {
      v.value = !0, await yt(), r.value?.querySelector('[aria-label="State name"]')?.focus();
    }
    async function b(w) {
      g.value = "", m.value = w, await yt();
      const V = w ? '[role="combobox"]' : "button";
      r.value?.querySelector(".work-next-transition " + V)?.focus();
    }
    function p(w) {
      !l.selectedTransition || w.defaultPrevented || w.repeat || (w.preventDefault(), o("remove-transition", l.selectedTransition));
    }
    return a({ open: c, close: x, reset: d, editName: y, removeByShortcut: p }), (w, V) => (n(), H(jl, { name: "work-panel" }, {
      default: q(() => [
        e.selectedState || e.selectedTransition ? (n(), f("aside", {
          key: 0,
          ref_key: "panel",
          ref: r,
          class: "work-process-sideform",
          tabindex: "-1",
          "aria-label": e.selectedState ? "State inspector" : "Transition inspector",
          "aria-keyshortcuts": e.selectedTransition ? "Delete Backspace" : void 0,
          onKeydown: [
            Ze(Be(p, ["self"]), ["delete"]),
            Ze(Be(p, ["self"]), ["backspace"])
          ]
        }, [
          (n(!0), f(te, null, fe(e.selectedState ? [e.selectedState] : [], ($) => (n(), f(te, {
            key: $.id
          }, [
            s("header", mc, [
              v.value ? (n(), H(u(Ae), {
                key: 1,
                modelValue: $.name,
                "onUpdate:modelValue": (S) => $.name = S,
                class: "work-process-name",
                "aria-label": "State name",
                onBlur: V[0] || (V[0] = (S) => v.value = !1)
              }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (n(), H(Gl, {
                key: 0,
                class: "work-process-state-title",
                "aria-label": "Rename state",
                onActivate: y
              }, {
                default: q(() => [
                  s("span", null, T(u(ye)($)), 1)
                ]),
                _: 2
              }, 1024)),
              k(u(ae), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close state editor",
                onClick: x
              }, {
                default: q(() => [
                  k(u(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            e.insertedRoute ? (n(), f("div", pc, [
              V[4] || (V[4] = s("p", { class: "work-field-label" }, "New route", -1)),
              s("p", null, T(e.insertedRoute), 1)
            ])) : C("", !0),
            s("p", gc, T(u(Ai)($, e.draft)), 1),
            e.processCounts ? (n(), f("p", bc, T(e.processCounts[$.id] ?? 0) + " " + T(e.processCounts[$.id] === 1 ? "item" : "items") + " currently here", 1)) : C("", !0),
            k(ec, {
              state: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              onKind: (S) => o("kind", $, S),
              onValidity: (S, D) => o("validity", S.includes("duration:") ? S : e.process.id + ":" + $.id + ":" + S, D)
            }, null, 8, ["state", "process", "draft", "board-id", "onKind", "onValidity"]),
            s("label", hc, [
              V[5] || (V[5] = W("Phase", -1)),
              k(u(ge), {
                "aria-label": "Phase",
                modelValue: $.category,
                "onUpdate:modelValue": (S) => $.category = S,
                appendTo: "self",
                optionLabel: "label",
                optionValue: "value",
                options: ["triage", "backlog", ...u(Ro)].map((S) => ({ label: u(Lt)(S), value: S }))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
            ]),
            s("div", yc, [
              m.value ? (n(), f(te, { key: 1 }, [
                k(u(ge), {
                  modelValue: g.value,
                  "onUpdate:modelValue": V[2] || (V[2] = (S) => g.value = S),
                  "aria-label": "Next state",
                  placeholder: "Choose the next state",
                  appendTo: "self",
                  optionLabel: "label",
                  optionValue: "value",
                  options: e.process.states.filter((S) => S !== $).map((S) => ({ label: u(ye)(S), value: S.id }))
                }, null, 8, ["modelValue", "options"]),
                s("div", kc, [
                  k(u(ae), {
                    label: "Add transition",
                    size: "small",
                    disabled: !g.value,
                    onClick: (S) => o("connect", $.id, g.value, u(i))
                  }, null, 8, ["disabled", "onClick"]),
                  k(u(ae), {
                    label: "Cancel",
                    severity: "secondary",
                    text: "",
                    size: "small",
                    onClick: V[3] || (V[3] = (S) => b(!1))
                  })
                ])
              ], 64)) : (n(), H(u(ae), {
                key: 0,
                label: "Add transition",
                severity: "secondary",
                outlined: "",
                size: "small",
                "aria-expanded": "false",
                disabled: e.process.states.length < 2,
                onClick: V[1] || (V[1] = (S) => b(!0))
              }, {
                icon: q(() => [
                  k(u(pe), {
                    icon: "tabler:plus",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled"]))
            ]),
            s("footer", wc, [
              k(u(ae), {
                label: "Remove state",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (S) => o("remove-state", $)
              }, {
                icon: q(() => [
                  k(u(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 64))), 128)),
          (n(!0), f(te, null, fe(e.selectedTransition ? [e.selectedTransition] : [], ($) => (n(), f(te, {
            key: $.id
          }, [
            s("header", $c, [
              V[6] || (V[6] = s("h3", null, "Transition", -1)),
              k(u(ae), {
                type: "button",
                label: "Remove transition",
                severity: "danger",
                text: "",
                size: "small",
                onClick: (S) => o("remove-transition", $)
              }, {
                icon: q(() => [
                  k(u(pe), { icon: "tabler:trash" })
                ]),
                _: 1
              }, 8, ["onClick"]),
              k(u(ae), {
                severity: "secondary",
                text: "",
                size: "small",
                "aria-label": "Close transition editor",
                onClick: x
              }, {
                default: q(() => [
                  k(u(pe), { icon: "tabler:x" })
                ]),
                _: 1
              })
            ]),
            s("p", Vc, T($.from === "any" ? "Any state" : $.from.map((S) => u(ye)(e.process.states.find((D) => D.id === S))).join(", ")) + " → " + T(u(ye)(e.process.states.find((S) => S.id === $.to))), 1),
            k(si, {
              transition: $,
              process: e.process,
              draft: e.draft,
              guards: e.guards
            }, null, 8, ["transition", "process", "draft", "guards"]),
            e.error ? (n(), f("p", xc, T(e.error), 1)) : C("", !0),
            s("label", Cc, [
              V[7] || (V[7] = W("Name", -1)),
              k(u(Ae), {
                modelValue: $.name,
                "onUpdate:modelValue": (S) => $.name = S,
                placeholder: u(Xe)($),
                "aria-label": "Transition name"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])
            ]),
            k(vc, {
              transition: $,
              process: e.process,
              draft: e.draft,
              "board-id": e.boardId,
              guards: e.guards,
              onValidity: (S, D) => o("validity", e.process.id + ":transition-" + $.id + ":" + S, D)
            }, null, 8, ["transition", "process", "draft", "board-id", "guards", "onValidity"])
          ], 64))), 128))
        ], 40, fc)) : C("", !0)
      ]),
      _: 1
    }));
  }
}), Tc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ic = { key: 1 }, Dc = { class: "work-muted" }, Uc = {
  key: 2,
  class: "work-map-zoom",
  role: "group",
  "aria-label": "Map zoom"
}, Ec = { class: "work-stack" }, Ac = { class: "work-stack work-tight" }, Oc = {
  key: 0,
  class: "work-muted"
}, Pc = { class: "work-stack work-tight" }, Rc = { class: "work-dialog-actions" }, Nc = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = al(ol, void 0), r = L(() => t.draft.processes ?? []), v = B(!1), m = B(""), g = B(""), i = B(""), d = B("Map");
    De(() => t.createForItemType, (R, E) => {
      !R && !E || (m.value = "", v.value = !!R);
    }, { immediate: !0 });
    const c = B(), x = B(), y = B(), b = B(), p = B(), w = B(), V = /* @__PURE__ */ new WeakMap(), $ = L(() => r.value.find((R) => R.id === g.value) ?? r.value[0]), S = L(() => {
      const R = c.value, E = $.value, G = R && V.get(R);
      if (!R || !E || !G) return;
      const { entry: re, continuation: ee } = G;
      if (!E.transitions?.includes(re) || re.to !== R.id) return;
      const I = [
        re.from === "any" ? "Any state" : re.from.map((Z) => ye(E.states.find((A) => A.id === Z))).join(", "),
        ye(R)
      ];
      return ee && E.transitions.includes(ee) && (ee.from === "any" || ee.from.includes(R.id)) && I.push(ye(E.states.find((Z) => Z.id === ee.to))), I.join(" → ");
    }), D = B(!1);
    function z(R) {
      D.value = !0, d.value = R;
    }
    function le() {
      !D.value && b.value?.clientWidth && (d.value = b.value.clientWidth < 480 && ($.value?.states.length ?? 0) > 6 ? "List" : "Map");
    }
    let J;
    Ua(() => {
      le(), b.value && typeof ResizeObserver < "u" && (J = new ResizeObserver(le), J.observe(b.value));
    }), Dt(() => J?.disconnect()), De($, () => {
      D.value = !1, le();
    });
    function ce() {
      p.value?.reset(), c.value = void 0, x.value = void 0, i.value = "";
    }
    function me() {
      const R = o?.selected.value;
      R?.startsWith("workflow/") && o?.choose("workflow", R.slice(9), !1), ce();
    }
    function be() {
      d.value === "Map" ? y.value?.focus() : w.value?.focus();
    }
    function he(R, E) {
      c.value = R, x.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".state." + R.id, !0), p.value?.open(E);
    }
    function se(R, E) {
      x.value = R, c.value = void 0, i.value = "", $.value && o?.choose("workflow", $.value.id + ".transition." + R.id, !0), p.value?.open(E);
    }
    De([$, d], ce), De([() => o?.selected.value, r], async ([R], E) => {
      if (!R?.startsWith("workflow/")) {
        E?.[0]?.startsWith("workflow/") && ce();
        return;
      }
      const [G, re, ee] = R.slice(9).split("."), I = r.value.find((oe) => oe.id === G);
      if (!I || $.value !== I && (g.value = I.id, await yt(), o?.selected.value !== R))
        return;
      const Z = re === "state" ? I.states.find((oe) => oe.id === ee) : void 0, A = re === "transition" ? I.transitions?.find((oe) => oe.id === ee) : void 0;
      Z === c.value && A === x.value || (ce(), c.value = Z, x.value = A);
    }, { immediate: !0, flush: "post" });
    const O = L(() => {
      if (!t.counts || !$.value) return;
      const R = t.countTypes?.filter((E) => E.process === $.value?.id) ?? [];
      return Object.fromEntries($.value.states.map((E) => [
        E.id,
        R.reduce((G, re) => G + (t.counts?.[re.id]?.[E.id] ?? 0), 0)
      ]));
    }), Q = L(() => (t.guards ?? []).filter((R) => t.draft.plugins?.some((E) => E.use === R.plugin))), M = L(() => Object.keys(t.draft.policy?.wip ?? {}).filter((R) => !r.value.some((E) => E.states.some((G) => G.id === R))));
    function ne() {
      const R = m.value.trim();
      if (!R) return;
      const E = R.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "process", G = (/^[a-z]/.test(E) ? E : "process_" + E).slice(0, 40), re = r.value.some((ee) => ee.id === G) ? la(G, r.value) : G;
      (t.draft.processes ??= []).push({ id: re, name: R, initial: "todo", states: [{ id: "todo", name: "To do", category: "unstarted" }], transitions: [] }), g.value = re, m.value = "", v.value = !1, l("created", re);
    }
    function xe() {
      v.value = !1, l("cancel-creation");
    }
    async function Oe(R, E) {
      const G = { id: la("state", R.states), name: "New state", category: "started" }, re = qa(R), ee = re.at(-1), I = c.value ?? (ee?.category === "completed" ? re.at(-2) : ee), Z = I ? R.states.indexOf(I) : -1, A = I ? Z + 1 : R.states.length, oe = I && R.transitions?.filter((P) => P.from !== "any" && P.from.length === 1 && P.from[0] === I.id && !so(R, P).length), Ve = oe?.find((P) => P.default) ?? oe?.find((P) => R.states.findIndex((Y) => Y.id === P.to) > Z);
      R.states.splice(A, 0, G);
      const Pe = R.states[A];
      if (I && I.category !== "completed" && I.category !== "canceled") {
        const P = R.transitions ??= [], Y = Ve?.auto === !0 && Ve.default === !0, ke = {
          id: la("transition", P),
          name: "Continue",
          from: [Ve ? Pe.id : I.id],
          to: Ve?.to ?? Pe.id,
          ...Y ? { auto: !0, default: !0 } : {}
        };
        Ve && (Ve.to = Pe.id), P.push(ke);
        const de = P[P.length - 1];
        V.set(Pe, { entry: Ve ?? de, continuation: Ve ? de : void 0, automatic: Y });
      }
      he(Pe, E), await p.value?.editName();
    }
    function K(R, E) {
      const G = V.get(R), re = G?.continuation;
      !re || G.automatic || re.from === "any" || re.from.length !== 1 || re.from[0] !== R.id || (E === "gate" ? (re.auto = !0, re.default = !0) : (delete re.auto, delete re.default));
    }
    function j(R, E, G) {
      const re = $.value;
      if (!re || !E || R === E) return;
      const ee = re.transitions ??= [], I = `to_${E}`;
      let Z = I.slice(0, 40), A = 2;
      for (; ee.some((Ve) => Ve.id === Z); ) {
        const Ve = `_${A++}`;
        Z = I.slice(0, 40 - Ve.length) + Ve;
      }
      const oe = { id: Z, name: `To ${ye(re.states.find((Ve) => Ve.id === E)).toLowerCase()}`, from: [R], to: E };
      ee.push(oe), se(oe, G);
    }
    function N(R, E) {
      const G = c.value ?? R.states.find((I) => I.id === R.initial) ?? R.states[0], re = R.states.find((I) => I.id !== G?.id);
      if (!G || !re) return;
      const ee = { id: la("transition", R.transitions ?? []), name: "To " + ye(re), from: [G.id], to: re.id };
      (R.transitions ??= []).push(ee), se(ee, E);
    }
    async function ve(R) {
      const E = $.value, G = E?.transitions?.indexOf(R) ?? -1;
      if (!E || G < 0) return;
      const re = so(E, R);
      if (re.length) {
        i.value = `Used by ${re.join(", ")}. Update those references first.`;
        return;
      }
      E.transitions.splice(G, 1), ce(), await yt(), be();
    }
    function h(R, E) {
      const G = Oi(R, E);
      if (G.length) {
        i.value = `${ye(E)} is used by ${G.join(", ")}. Update these references first.`;
        return;
      }
      R.states.splice(R.states.indexOf(E), 1), p.value?.close();
    }
    async function U(R) {
      const E = t.draft.item_types?.filter((re) => re.process === R.id).map((re) => re.title || "Untitled item type") ?? [];
      if (E.length) {
        i.value = `Used by ${E.join(", ")}. Choose a different workflow for those item types first.`;
        return;
      }
      const G = await t.guardRemoval?.("processes", R.id);
      if (G) {
        i.value = G;
        return;
      }
      Ea(t.draft, "processes", R.id), g.value = "", ce();
    }
    return (R, E) => (n(), f("section", {
      ref_key: "editor",
      ref: b,
      class: "work-process-editor work-stack",
      "aria-label": "Workflow editor",
      onKeydown: E[17] || (E[17] = Ze((G) => (c.value || x.value) && p.value?.close(), ["esc"]))
    }, [
      i.value && !x.value ? (n(), f("p", Tc, T(i.value), 1)) : C("", !0),
      (n(!0), f(te, null, fe(e.issues?.filter((G) => G.code === "process " + $.value?.id) ?? [], (G) => (n(), f("p", {
        key: G.what + G.detail,
        class: "work-error work-small",
        role: "alert"
      }, T(u(ll)(G)) + " · " + T(G.what), 1))), 128)),
      $.value ? (n(), f("div", {
        key: 1,
        class: ft(["work-process-builder", { "work-process-inspecting": c.value || x.value }])
      }, [
        s("div", {
          ref_key: "tools",
          ref: w,
          class: "work-process-controls",
          role: "toolbar",
          "aria-label": "Workflow tools",
          tabindex: "-1"
        }, [
          r.value.length > 1 ? (n(), H(u(ge), {
            key: 0,
            "model-value": $.value.id,
            "aria-label": "Workflow",
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: r.value.map((G) => ({ label: G.name || "Untitled workflow", value: G.id })),
            "onUpdate:modelValue": E[0] || (E[0] = (G) => g.value = G)
          }, null, 8, ["model-value", "options"])) : (n(), f("strong", Ic, T($.value.name || "Untitled workflow"), 1)),
          k(u(ae), {
            label: "Add state",
            severity: "secondary",
            outlined: "",
            onClick: E[1] || (E[1] = (G) => Oe($.value, G.currentTarget))
          }, {
            icon: q(() => [
              k(u(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          }),
          k(u(ae), {
            label: "Add transition",
            severity: "secondary",
            outlined: "",
            disabled: $.value.states.length < 2,
            onClick: E[2] || (E[2] = (G) => N($.value, G.currentTarget))
          }, null, 8, ["disabled"]),
          k(u(ge), {
            modelValue: $.value.initial,
            "onUpdate:modelValue": E[3] || (E[3] = (G) => $.value.initial = G),
            "aria-label": "Starts in " + u(ye)($.value.states.find((G) => G.id === $.value.initial)),
            appendTo: "self",
            optionLabel: "label",
            optionValue: "value",
            options: $.value.states.map((G) => ({ label: u(ye)(G), value: G.id }))
          }, {
            value: q(() => [
              s("span", Dc, "Starts in " + T(u(ye)($.value.states.find((G) => G.id === $.value.initial))), 1)
            ]),
            _: 1
          }, 8, ["modelValue", "aria-label", "options"]),
          E[18] || (E[18] = s("span", { class: "work-spacer" }, null, -1)),
          d.value === "Map" ? (n(), f("div", Uc, [
            k(u(ae), {
              label: "Fit",
              title: "Fit the map to a readable width",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: E[4] || (E[4] = (G) => y.value?.fit())
            }, {
              icon: q(() => [
                k(u(pe), { icon: "tabler:arrows-maximize" })
              ]),
              _: 1
            }),
            d.value === "Map" ? (n(), H(u(ae), {
              key: 0,
              "aria-label": "Zoom out",
              title: "Zoom out",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: E[5] || (E[5] = (G) => y.value?.zoomOut())
            }, {
              default: q(() => [
                k(u(pe), { icon: "tabler:minus" })
              ]),
              _: 1
            })) : C("", !0),
            d.value === "Map" ? (n(), H(u(ae), {
              key: 1,
              "aria-label": "Zoom in",
              title: "Zoom in",
              text: "",
              severity: "secondary",
              size: "small",
              onClick: E[6] || (E[6] = (G) => y.value?.zoomIn())
            }, {
              default: q(() => [
                k(u(pe), { icon: "tabler:plus" })
              ]),
              _: 1
            })) : C("", !0)
          ])) : C("", !0),
          k(u(Wl), {
            "model-value": d.value,
            "onUpdate:modelValue": z,
            options: ["Map", "List"],
            "allow-empty": !1,
            "aria-label": "Workflow layout"
          }, null, 8, ["model-value"]),
          k(u(ae), {
            label: "New process",
            "aria-label": "New process",
            text: "",
            severity: "secondary",
            onClick: E[7] || (E[7] = (G) => v.value = !0)
          }, {
            icon: q(() => [
              k(u(pe), { icon: "tabler:plus" })
            ]),
            _: 1
          })
        ], 512),
        d.value === "Map" ? (n(), H(yd, {
          key: 0,
          ref_key: "graph",
          ref: y,
          process: $.value,
          draft: e.draft,
          "fit-on-open": "",
          "selected-state": c.value,
          "selected-transition": x.value,
          onState: he,
          onTransition: se,
          onRemoveTransition: E[8] || (E[8] = (G) => p.value?.removeByShortcut(G)),
          onConnect: j,
          onClear: E[9] || (E[9] = (G) => p.value?.close())
        }, null, 8, ["process", "draft", "selected-state", "selected-transition"])) : (n(), H(Wd, {
          key: 1,
          process: $.value,
          draft: e.draft,
          guards: Q.value,
          "selected-state": c.value,
          "selected-transition": x.value,
          counts: O.value,
          onState: he,
          onTransition: se,
          onRemoveState: E[10] || (E[10] = (G) => h($.value, G)),
          onRemoveTransition: ve
        }, null, 8, ["process", "draft", "guards", "selected-state", "selected-transition", "counts"])),
        k(Sc, {
          ref_key: "inspector",
          ref: p,
          process: $.value,
          draft: e.draft,
          "board-id": e.boardId,
          guards: Q.value,
          error: i.value,
          "selected-state": c.value,
          "selected-transition": x.value,
          "inserted-route": S.value,
          "process-counts": O.value,
          onClose: me,
          onFocusEditor: be,
          onKind: K,
          onConnect: j,
          onRemoveState: E[11] || (E[11] = (G) => h($.value, G)),
          onRemoveTransition: ve,
          onValidity: E[12] || (E[12] = (G, re) => l("validity", G, re))
        }, null, 8, ["process", "draft", "board-id", "guards", "error", "selected-state", "selected-transition", "inserted-route", "process-counts"])
      ], 2)) : (n(), H(u(ae), {
        key: 2,
        label: "New process",
        severity: "secondary",
        outlined: "",
        onClick: E[13] || (E[13] = (G) => v.value = !0)
      }, {
        icon: q(() => [
          k(u(pe), { icon: "tabler:plus" })
        ]),
        _: 1
      })),
      $.value ? (n(), H(qe, {
        key: 3,
        class: "work-disclosure",
        label: "Advanced workflow settings"
      }, {
        default: q(() => [
          s("div", Ec, [
            k(qe, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [...E[19] || (E[19] = [
                s("p", null, [
                  W("Workflow definitions are "),
                  s("code", null, "processes"),
                  W(" in "),
                  s("code", null, "WorkGetSchema"),
                  W(" and "),
                  s("code", null, "WorkApplySchema"),
                  W(".")
                ], -1)
              ])]),
              _: 1
            }),
            s("label", Ac, [
              E[20] || (E[20] = W("Workflow name", -1)),
              k(u(Ae), {
                modelValue: $.value.name,
                "onUpdate:modelValue": E[14] || (E[14] = (G) => $.value.name = G),
                "aria-label": "Workflow name"
              }, null, 8, ["modelValue"])
            ]),
            M.value.length ? (n(), f("p", Oc, "Some item limits belong to removed states.")) : C("", !0),
            (n(!0), f(te, null, fe(M.value, (G, re) => (n(), H(u(ae), {
              key: G,
              label: "Clear limit for removed state " + (re + 1),
              severity: "secondary",
              text: "",
              onClick: (ee) => delete e.draft.policy.wip[G]
            }, null, 8, ["label", "onClick"]))), 128)),
            k(u(ae), {
              label: "Remove workflow",
              severity: "danger",
              text: "",
              size: "small",
              onClick: E[15] || (E[15] = (G) => U($.value))
            })
          ])
        ]),
        _: 1
      })) : C("", !0),
      k(Ul, {
        visible: v.value,
        "return-focus": e.creationOpener,
        label: "New process",
        onClose: xe
      }, {
        default: q(() => [
          s("form", {
            class: "work-dialog-box",
            "aria-label": "New process",
            onSubmit: Be(ne, ["stop", "prevent"])
          }, [
            E[22] || (E[22] = s("h2", null, "New process", -1)),
            s("label", Pc, [
              E[21] || (E[21] = W("Name", -1)),
              k(u(Ae), {
                modelValue: m.value,
                "onUpdate:modelValue": E[16] || (E[16] = (G) => m.value = G),
                "aria-label": "New process name",
                autofocus: "",
                required: ""
              }, null, 8, ["modelValue"])
            ]),
            s("div", Rc, [
              k(u(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: xe
              }),
              k(u(ae), {
                label: "Create process",
                type: "submit",
                disabled: !m.value.trim()
              }, null, 8, ["disabled"])
            ])
          ], 32)
        ]),
        _: 1
      }, 8, ["visible", "return-focus"])
    ], 544));
  }
}), Mc = {
  class: "work-settings-card work-stack",
  "aria-label": "Existing items"
}, Fc = {
  key: 0,
  class: "work-stack work-tight"
}, Lc = { class: "work-row" }, Bc = /* @__PURE__ */ Te({
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
    return (t, l) => (n(), f("section", Mc, [
      l[2] || (l[2] = s("h3", { class: "work-row-title" }, "Items in changed states", -1)),
      (n(!0), f(te, null, fe(e.removed, ({ process: o, state: r, count: v }) => (n(), f("label", {
        key: o.id + "/" + r.id,
        class: "work-stack work-tight"
      }, [
        W(" Move " + T(a(v)) + " from " + T(u(ye)(r)) + " to ", 1),
        k(u(ge), {
          disabled: e.disabled,
          "model-value": o.map?.[r.id],
          "aria-label": "Move items from " + u(ye)(r) + " to",
          placeholder: "Choose a state",
          appendTo: "self",
          optionLabel: "label",
          optionValue: "value",
          options: o.states.map((m) => ({ label: u(ye)(m), value: m.id })),
          "onUpdate:modelValue": (m) => t.$emit("destination", o, r.id, m)
        }, null, 8, ["disabled", "model-value", "aria-label", "options", "onUpdate:modelValue"])
      ]))), 128)),
      e.renamed.length ? (n(), f("div", Fc, [
        (n(!0), f(te, null, fe(e.renamed, ({ process: o, state: r, count: v, name: m }) => (n(), f("p", {
          key: o.id + "/" + r.id
        }, [
          W(T(u(ye)(r)) + " becomes ", 1),
          s("strong", null, T(m), 1),
          W(" for " + T(a(v)) + ". ", 1)
        ]))), 128)),
        s("label", Lc, [
          k(u(Zt), {
            binary: "",
            "model-value": e.confirmed,
            disabled: e.disabled,
            "onUpdate:modelValue": l[0] || (l[0] = (o) => t.$emit("update:confirmed", o))
          }, null, 8, ["model-value", "disabled"]),
          l[1] || (l[1] = W(" Keep these items in their renamed states ", -1))
        ])
      ])) : C("", !0)
    ]));
  }
}), zc = {
  class: "work-stack",
  "aria-label": "Links editor"
}, jc = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, qc = { class: "work-definition-meta work-muted work-small" }, Wc = { class: "work-settings-grid" }, Gc = { class: "work-stack work-tight" }, Kc = {
  key: 0,
  class: "work-stack work-tight"
}, Hc = { class: "work-stack work-tight" }, Yc = { class: "work-row" }, Xc = {
  key: 0,
  class: "work-muted work-small"
}, Jc = {
  key: 1,
  class: "work-stack work-tight"
}, Zc = { class: "work-settings-grid" }, Qc = {
  key: 0,
  class: "work-chips"
}, _c = { class: "work-stack work-tight" }, ev = { class: "work-relation-preview work-small" }, tv = {
  key: 0,
  class: "work-muted"
}, av = {
  key: 0,
  class: "kx-empty"
}, lv = /* @__PURE__ */ Te({
  __name: "RelationsEditor",
  props: {
    draft: {},
    guardRemoval: { type: Function }
  },
  setup(e) {
    const a = e, t = L(() => a.draft.relation_types ?? []), l = L(() => (a.draft.item_types ?? []).map((b) => ({ value: b.id, label: b.title || Me(b.id) })));
    function o(b, p, w) {
      w.length ? b[p] = w : delete b[p];
    }
    function r(b, p) {
      if (!/^[a-z][a-z0-9_]{0,39}$/.test(p)) return "Start with a lowercase letter and use only lowercase letters, numbers or underscores.";
      if (b.to_types?.includes(p)) return "This ID is already in use.";
    }
    function v(b, p) {
      o(b, "to_types", [...b.to_types ?? [], p]);
    }
    function m(b) {
      return (b.to_types ?? []).filter((p) => l.value.some((w) => w.value === p));
    }
    function g(b) {
      return (b.to_types ?? []).filter((p) => !l.value.some((w) => w.value === p));
    }
    const i = B(""), d = B(!1);
    function c(b) {
      const p = b.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""), w = (/^[a-z]/.test(p) ? p : "link_" + (p || "new")).slice(0, 40);
      let V = w, $ = 2;
      for (; t.value.some((S) => S.id === V); ) {
        const S = "_" + $++;
        V = w.slice(0, 40 - S.length) + S;
      }
      return V;
    }
    function x(b) {
      (a.draft.relation_types ??= []).push({ id: c(b), outward: b, inward: b, cardinality: "many" });
    }
    async function y(b) {
      if (!d.value) {
        d.value = !0, i.value = "";
        try {
          const p = await a.guardRemoval?.("relation_types", b);
          p ? i.value = p : Ea(a.draft, "relation_types", b);
        } finally {
          d.value = !1;
        }
      }
    }
    return (b, p) => (n(), f("section", zc, [
      i.value ? (n(), f("p", jc, T(i.value), 1)) : C("", !0),
      k(Hl, {
        columns: "relations",
        count: t.value.length
      }, {
        default: q(() => [
          (n(!0), f(te, null, fe(t.value, (w, V) => (n(), H(Kl, {
            "route-section": "links",
            "route-id": w.id,
            title: w.outward || u(Me)(w.id),
            kind: w.symmetric ? "Same both ways" : "Different each way",
            key: V,
            class: "work-stack"
          }, Ta({
            actions: q(() => [
              k(u(ae), {
                severity: "secondary",
                text: "",
                disabled: d.value,
                onClick: ($) => y(w.id),
                "aria-label": "Remove link type",
                size: "small"
              }, {
                default: q(() => [
                  k(u(pe), {
                    icon: "tabler:trash",
                    "aria-hidden": "true"
                  })
                ]),
                _: 1
              }, 8, ["disabled", "onClick"])
            ]),
            default: q(() => [
              s("div", Wc, [
                s("label", Gc, [
                  p[0] || (p[0] = W("Shown on this item ", -1)),
                  k(u(Ae), {
                    modelValue: w.outward,
                    "onUpdate:modelValue": ($) => w.outward = $,
                    "aria-label": "Shown on this item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                w.symmetric ? C("", !0) : (n(), f("label", Kc, [
                  p[1] || (p[1] = W("Shown on the other item ", -1)),
                  k(u(Ae), {
                    modelValue: w.inward,
                    "onUpdate:modelValue": ($) => w.inward = $,
                    "aria-label": "Shown on the other item"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])),
                s("label", Hc, [
                  p[2] || (p[2] = W("Links allowed ", -1)),
                  k(u(ge), {
                    "model-value": w.cardinality ?? "many",
                    "onUpdate:modelValue": ($) => w.cardinality = $,
                    "aria-label": "Links allowed",
                    appendTo: "self",
                    optionLabel: "label",
                    optionValue: "value",
                    optionDisabled: "disabled",
                    options: [{ label: "One link", value: "one", disabled: !1 }, { label: "Many links", value: "many", disabled: !1 }]
                  }, null, 8, ["model-value", "onUpdate:modelValue"])
                ]),
                s("label", Yc, [
                  k(u(Zt), {
                    modelValue: w.symmetric,
                    "onUpdate:modelValue": ($) => w.symmetric = $,
                    disabled: !!(w.from_types?.length || w.to_types?.length),
                    "aria-label": "Same meaning in both directions",
                    binary: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  p[3] || (p[3] = W("Same meaning in both directions ", -1))
                ])
              ]),
              w.from_types?.length || w.to_types?.length ? (n(), f("p", Xc, " Clear the source and target types to use the same meaning in both directions. ")) : C("", !0),
              w.symmetric ? C("", !0) : (n(), f("div", Jc, [
                p[5] || (p[5] = s("p", { class: "work-muted work-small" }, "Leave either end empty to allow any item type there.", -1)),
                s("div", Zc, [
                  k(mt, {
                    label: "Source item types",
                    options: l.value,
                    "model-value": w.from_types,
                    "onUpdate:modelValue": ($) => o(w, "from_types", $)
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"]),
                  k(mt, {
                    label: "Target item types",
                    options: l.value,
                    "model-value": m(w),
                    "onUpdate:modelValue": ($) => o(w, "to_types", [...$, ...g(w)])
                  }, null, 8, ["options", "model-value", "onUpdate:modelValue"])
                ]),
                k(qe, {
                  class: "work-disclosure",
                  label: "Peer board target types"
                }, {
                  default: q(() => [
                    p[4] || (p[4] = s("p", { class: "work-muted work-small" }, "Enter a type ID to allow that type from a peer board.", -1)),
                    g(w).length ? (n(), f("div", Qc, [
                      (n(!0), f(te, null, fe(g(w), ($) => (n(), H(u(ae), {
                        key: $,
                        severity: "secondary",
                        text: "",
                        size: "small",
                        label: $ + " ×",
                        "aria-label": "Remove target type " + $,
                        onClick: (S) => o(w, "to_types", w.to_types?.filter((D) => D !== $) ?? [])
                      }, null, 8, ["label", "aria-label", "onClick"]))), 128))
                    ])) : C("", !0),
                    k(Ia, {
                      action: "Add target type",
                      label: "Target type ID",
                      maxlength: 40,
                      validate: ($) => r(w, $),
                      onAdd: ($) => v(w, $)
                    }, null, 8, ["validate", "onAdd"])
                  ]),
                  _: 2
                }, 1024)
              ])),
              k(qe, {
                class: "work-disclosure",
                label: "Advanced link settings"
              }, {
                default: q(() => [
                  s("label", _c, [
                    p[6] || (p[6] = W("Identifier ", -1)),
                    k(u(Ae), {
                      modelValue: w.id,
                      "onUpdate:modelValue": ($) => w.id = $,
                      required: "",
                      pattern: "[a-z][a-z0-9_]*",
                      "aria-label": "Relation ID"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                _: 2
              }, 1024),
              s("p", ev, [
                p[7] || (p[7] = s("strong", null, "This item", -1)),
                W(" " + T(w.outward || "relates to") + " ", 1),
                p[8] || (p[8] = s("strong", null, "another item", -1)),
                !w.symmetric && w.inward && w.inward !== w.outward ? (n(), f("span", tv, " · reverse: " + T(w.inward), 1)) : C("", !0)
              ])
            ]),
            _: 2
          }, [
            !w.symmetric && w.inward && w.inward !== w.outward ? {
              name: "usage",
              fn: q(() => [
                s("span", qc, T(w.inward), 1)
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["route-id", "title", "kind"]))), 128)),
          t.value.length ? C("", !0) : (n(), f("p", av, "No link types yet. Add one to connect related work.")),
          k(Ia, {
            action: "Add link type",
            label: "Link name",
            onAdd: x
          })
        ]),
        _: 1
      }, 8, ["count"])
    ]));
  }
}), ov = ["aria-labelledby"], iv = {
  key: 0,
  class: "kx-settings-group-head"
}, nv = ["id"], sv = {
  key: 0,
  class: "kx-settings-group-count"
}, rv = { class: "kx-settings-group-list" }, Sl = /* @__PURE__ */ Te({
  __name: "SettingsGroup",
  props: {
    title: {},
    count: {}
  },
  setup(e) {
    const a = wt();
    return (t, l) => (n(), f("section", {
      class: "kx-settings-group",
      "aria-labelledby": e.title ? u(a) : void 0
    }, [
      e.title ? (n(), f("div", iv, [
        s("h2", {
          id: u(a),
          class: "kx-settings-group-title"
        }, T(e.title), 9, nv),
        e.count !== void 0 ? (n(), f("span", sv, T(e.count), 1)) : C("", !0)
      ])) : C("", !0),
      s("div", rv, [
        Ye(t.$slots, "default")
      ])
    ], 8, ov));
  }
}), dv = { class: "kx-settings-item-head" }, uv = { class: "kx-settings-item-main" }, cv = { class: "kx-settings-item-line" }, vv = { class: "kx-settings-item-title" }, fv = {
  key: 0,
  class: "kx-settings-item-desc"
}, mv = {
  key: 1,
  class: "kx-settings-item-meta"
}, pv = { class: "kx-settings-item-actions" }, gv = ["aria-expanded", "aria-controls", "aria-label"], bv = ["id", "inert"], hv = { class: "kx-settings-item-clip" }, yv = { class: "kx-settings-item-body" }, Tl = /* @__PURE__ */ Te({
  __name: "SettingsItem",
  props: /* @__PURE__ */ Uo({
    title: {},
    description: {},
    expandLabel: {},
    keepMounted: { type: Boolean }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const a = e, t = Io(e, "open"), l = Do(), o = wt(), r = B(t.value);
    return De(t, (v) => {
      v && (r.value = !0);
    }), (v, m) => (n(), f("article", {
      class: ft(["kx-settings-item", { "kx-settings-item-open": t.value && u(l).default }])
    }, [
      s("div", dv, [
        s("div", uv, [
          s("div", cv, [
            s("h3", vv, T(e.title), 1),
            Ye(v.$slots, "status")
          ]),
          e.description ? (n(), f("p", fv, T(e.description), 1)) : C("", !0),
          u(l).meta ? (n(), f("p", mv, [
            Ye(v.$slots, "meta")
          ])) : C("", !0)
        ]),
        s("div", pv, [
          u(l).default ? (n(), f("button", {
            key: 0,
            type: "button",
            class: "kx-settings-item-expand",
            "aria-expanded": t.value,
            "aria-controls": u(o),
            "aria-label": (e.expandLabel || "Details") + " " + e.title,
            onClick: m[0] || (m[0] = (g) => t.value = !t.value)
          }, [
            s("span", null, T(e.expandLabel || "Details"), 1),
            k(u(pe), {
              icon: "tabler:chevron-down",
              "aria-hidden": "true"
            })
          ], 8, gv)) : C("", !0),
          Ye(v.$slots, "actions")
        ])
      ]),
      u(l).default ? (n(), H(jl, {
        key: 0,
        name: "kx-settings-item-motion"
      }, {
        default: q(() => [
          r.value || a.keepMounted ? bt((n(), f("div", {
            key: 0,
            id: u(o),
            inert: !t.value,
            class: "kx-settings-item-panel"
          }, [
            s("div", hv, [
              s("div", yv, [
                Ye(v.$slots, "default")
              ])
            ])
          ], 8, bv)), [
            [Ct, t.value]
          ]) : C("", !0)
        ]),
        _: 3
      })) : C("", !0)
    ], 2));
  }
});
function eo(e) {
  return typeof e.error == "string" ? e.error : e.error?.message;
}
function kv(e, a) {
  const t = eo(e);
  return e.parked ? "Stopped: " + (t ?? "Projection is parked") : t ? "Degraded: " + t : e.bootstrapping ? "Initializing" : e.last_seq >= a ? "Up to date" : "Catching up";
}
function wv(e, a) {
  const t = a?.lifecycle.error, l = a?.problem ?? e.problem;
  if (e.installed === !1)
    return { kind: "missing", status: "Not installed", cause: "This board still references a plugin that is no longer installed." };
  if (l?.code === "plugin_config_invalid" || t?.code === "plugin_config_invalid")
    return { kind: "configuration", status: "Needs configuration", cause: l?.message ?? t?.message };
  if (l) return { kind: "manifest", status: "Unavailable", cause: l.message };
  if (t?.source === "schema_provider")
    return { kind: "provider", status: "Setup failed", cause: "The plugin could not prepare its fields: " + t.message };
  if (t?.code === "plugin_projection_gap")
    return { kind: "history", status: "Needs attention", cause: t.message, floor: t.floor };
  if (a?.lifecycle.state === "failed")
    return { kind: "setup", status: "Setup failed", cause: t?.message ?? "Work could not prepare the plugin attachment." };
  const o = Object.values(a?.projections ?? {});
  if (o.some((r) => r.parked)) return { kind: "reset", status: "Stopped" };
  if (o.some(eo)) return { kind: "degraded", status: "Needs attention" };
}
function $v(e, a, t) {
  const l = /* @__PURE__ */ new Map();
  for (const r of e) {
    const v = a(r)?.trim() ?? "", m = l.get(v);
    m ? m.push(r) : l.set(v, [r]);
  }
  const o = [...l].map(([r, v]) => ({
    title: r,
    rows: [...v.filter(t), ...v.filter((m) => !t(m))]
  }));
  return o.length === 1 && o[0].title === "" ? o : o.map((r) => r.title ? r : { ...r, title: "Other" }).sort((r, v) => r.title === "Other" ? 1 : v.title === "Other" ? -1 : r.title.localeCompare(v.title));
}
function Il(e) {
  return e.length < 2 ? e[0] ?? "" : e.slice(0, -1).join(", ") + " and " + e[e.length - 1];
}
const Vv = {
  class: "work-stack work-plugins",
  "aria-label": "Plugins editor"
}, xv = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Cv = {
  key: 1,
  class: "work-notice",
  role: "status"
}, Sv = {
  key: 2,
  class: "work-muted work-small",
  role: "status"
}, Tv = {
  key: 3,
  class: "kx-loading"
}, Iv = { class: "work-stack work-tight" }, Dv = { key: 0 }, Uv = { key: 0 }, Ev = { key: 1 }, Av = { key: 2 }, Ov = {
  key: 3,
  class: "work-block work-error"
}, Pv = { class: "work-stack work-tight" }, Rv = { key: 0 }, Nv = { key: 1 }, Mv = { key: 2 }, Fv = {
  key: 3,
  class: "work-small"
}, Lv = {
  key: 4,
  class: "work-small"
}, Bv = {
  key: 5,
  class: "work-small"
}, zv = { class: "work-row" }, jv = ["aria-label"], qv = {
  key: 0,
  class: "work-muted"
}, Wv = ["id"], Gv = { class: "work-row" }, Kv = {
  key: 2,
  class: "work-stack work-tight"
}, Hv = {
  key: 3,
  class: "work-muted work-small"
}, Yv = { class: "work-stack work-tight" }, Xv = { key: 0 }, Jv = { key: 1 }, Zv = { key: 2 }, Qv = { key: 3 }, _v = "kickside.work.planning:plugin", xo = /* @__PURE__ */ Te({
  __name: "PluginsEditor",
  props: {
    boardId: {},
    draft: {},
    schema: {},
    options: {},
    configs: {},
    disabled: { type: Boolean },
    activationLocked: { type: Boolean },
    filters: {},
    pack: {}
  },
  emits: ["configured", "refresh", "review", "upgrade", "validity", "widget-validity"],
  setup(e, { expose: a, emit: t }) {
    const l = e, o = t, r = B(""), v = B(""), m = B(""), g = B({}), i = al(ol, void 0), d = B(/* @__PURE__ */ new Set()), c = B(/* @__PURE__ */ new Set()), x = B({}), y = /* @__PURE__ */ new Map(), b = B({}), p = { Enabled: "success", Available: "secondary", "Setting up": "info", "Catching up": "info", "Turns on when applied": "info", "Turns off when applied": "info" }, w = L(() => l.options.map((P) => {
      const Y = j(P.plugin), ke = wv(P, Y), de = ve(P.plugin), We = Y?.active === !0, Re = de && d.value.has(P.plugin) ? "Needs configuration" : de !== We ? de ? "Turns on when applied" : "Turns off when applied" : ke?.status ?? (We ? Y.lifecycle.state !== "ready" ? "Setting up" : K(Y) ? "Catching up" : "Enabled" : "Available"), Je = p[Re] ?? (ke?.kind === "missing" || ke?.kind === "manifest" ? "danger" : "warn"), ua = P.installed === !1 ? "Unavailable plugin" : P.title || "Unnamed plugin", ca = de && xe(P) && ke?.kind !== "manifest" && ke?.kind !== "missing", Et = Q(P.plugin).length > 0 && (de || We);
      return { plugin: P, current: Y, issue: ke, chosen: de, enabled: We, status: Re, severity: Je, title: ua, configurable: ca, filtered: Et, needs: se(P), usedBy: O(P.plugin) };
    })), V = L(() => $v(w.value, (P) => P.plugin.category, (P) => P.enabled)), $ = L(() => !!r.value || l.disabled), S = L(() => $.value || l.activationLocked), D = {}, z = wt(), le = L(() => (l.draft.item_types ?? []).filter((P) => !["issue", "sprint", "milestone"].includes(P.id)).map((P) => ({ value: P.id, label: P.title || Me(P.id) }))), J = L(() => ["current_sprint", "milestone"].every((P) => l.schema.compiled?.fields?.some((Y) => Y.code === P))), ce = L(() => {
      const P = l.filters;
      return P ? (l.draft.scopes ?? []).filter((Y) => !P.some((ke) => ke.id === Y && l.options.some((de) => de.plugin === ke.plugin))) : [];
    }), me = L(() => l.draft.plugins?.filter((P) => !l.options.some((Y) => Y.plugin === P.use)) ?? []), be = L(() => !l.activationLocked && w.value.some((P) => P.chosen !== P.enabled));
    function he(P) {
      return l.options.find((Y) => Y.plugin === P)?.title || "Another plugin";
    }
    function se(P) {
      return P.requires.map(he);
    }
    function O(P) {
      return [
        ...l.pack?.requires.includes(P) ? [l.pack.title] : [],
        ...l.options.filter((Y) => Y.requires.includes(P) && ve(Y.plugin)).map((Y) => Y.title || "Another plugin")
      ];
    }
    function Q(P) {
      return (l.filters ?? []).filter((Y) => Y.plugin === P);
    }
    function M(P, Y) {
      const ke = new Set(Q(P).map((Re) => Re.id)), de = l.draft.scopes ?? [], We = [...de.filter((Re) => !ke.has(Re)), ...Y];
      (We.length !== de.length || We.some((Re) => !de.includes(Re))) && (l.draft.scopes = We);
    }
    function ne(P, Y) {
      re(P, { ...G(P), issue_types: Y });
    }
    function xe(P) {
      return !!P.config_schema && Xa(P.config_schema).length > 0;
    }
    function Oe(P, Y) {
      return Xa(P.config_schema ?? {}).find((ke) => ke.key === Y)?.title ?? Me(Y);
    }
    function K(P) {
      return Object.values(P.projections).some((Y) => !Y.parked && (Y.bootstrapping || Y.last_seq < l.schema.as_of));
    }
    function j(P) {
      return l.schema.plugins?.find((Y) => Y.plugin === P);
    }
    function N(P) {
      return j(P)?.active === !0;
    }
    function ve(P) {
      return l.draft.plugins?.some((Y) => Y.use === P) === !0;
    }
    function h(P, Y) {
      return g.value[P] ?? !!Y;
    }
    function U(P, Y) {
      g.value[P] = Y, i?.choose("plugins", P, Y);
    }
    De(() => i?.selected.value, (P, Y) => {
      for (const [ke, de] of [[Y, !1], [P, !0]])
        ke?.startsWith("plugins/") && (g.value[ke.slice(8)] = de);
    }, { immediate: !0 });
    function R(P, Y) {
      const ke = l.draft.plugins ?? [];
      Y && !ve(P) && (l.draft.plugins = [...ke, { use: P }], l.options.some((de) => de.plugin === P && xe(de)) && U(P, !0)), Y || (l.draft.plugins = ke.filter((de) => de.use !== P), delete l.configs[P], d.value.delete(P), o("validity", P, !0), I(P, !0), M(P, []));
    }
    function E(P, Y) {
      R(P, !1), o("review", Y.currentTarget);
    }
    function G(P) {
      return l.configs[P] ?? j(P)?.config ?? D;
    }
    function re(P, Y) {
      m.value = "", l.configs[P] = Y;
    }
    function ee(P) {
      delete l.configs[P], x.value[P] = (x.value[P] ?? 0) + 1;
    }
    function I(P, Y) {
      Y || !ve(P) ? c.value.delete(P) : c.value.add(P), o("widget-validity", P, !c.value.has(P));
    }
    async function Z() {
      const P = w.value.find(({ plugin: Y, chosen: ke }) => ke && c.value.has(Y.plugin));
      return P ? (g.value[P.plugin.plugin] = !0, await yt(), y.get(P.plugin.plugin)?.reportValidity(), !1) : !0;
    }
    a({ reportValidity: Z });
    function A(P, Y) {
      Y ? d.value.delete(P) : d.value.add(P), o("validity", P, Y || !ve(P) || N(P) && !l.configs[P]);
    }
    function oe(P) {
      for (const Y of Object.values(j(P)?.projections ?? {})) {
        const ke = eo(Y);
        if (ke) return ke;
      }
    }
    async function Ve(P) {
      await Lo.confirm({
        header: "Reset background updates?",
        message: "The plugin rebuilds its data from current items or replays retained events.",
        acceptLabel: "Reset background updates",
        rejectLabel: "Cancel"
      }) && await Pe(P);
    }
    async function Pe(P) {
      if (!$.value) {
        r.value = P, v.value = "", m.value = "";
        try {
          await Jt.configure(l.boardId, P), m.value = "Plugin recovery started.", o("configured");
        } catch (Y) {
          v.value = vt(Y, "Could not recover the plugin.");
        } finally {
          r.value = "";
        }
      }
    }
    return (P, Y) => (n(), f("section", Vv, [
      v.value ? (n(), f("div", xv, T(v.value), 1)) : C("", !0),
      m.value ? (n(), f("p", Cv, T(m.value), 1)) : C("", !0),
      be.value ? (n(), f("p", Sv, "Plugin changes take effect after you review and apply them.")) : C("", !0),
      !e.options.length && !e.pack ? (n(), f("p", Tv, "No installed plugins are visible to you.")) : C("", !0),
      e.pack ? (n(), H(Sl, {
        key: 4,
        title: "Pack",
        count: 1
      }, {
        default: q(() => [
          k(Tl, {
            title: e.pack.title,
            description: e.pack.description,
            "expand-label": "Details",
            open: h("pack", !1),
            "onUpdate:open": Y[1] || (Y[1] = (ke) => g.value.pack = ke)
          }, Ta({
            status: q(() => [
              k(u(tt), {
                class: "kx-tag-sm work-plugin-state",
                severity: e.pack.outdated ? "info" : "success",
                value: e.pack.outdated ? "Update available" : "Installed"
              }, null, 8, ["severity", "value"])
            ]),
            default: q(() => [
              Y[6] || (Y[6] = s("p", { class: "work-muted work-small" }, "The pack set up this board’s item types, workflow and views. Turning off a plugin it needs can remove parts of that setup.", -1)),
              k(qe, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", Iv, [
                    s("div", null, [
                      Y[3] || (Y[3] = s("dt", null, "Pack ID", -1)),
                      s("dd", null, [
                        s("code", null, T(e.pack.id), 1)
                      ])
                    ]),
                    e.pack.version ? (n(), f("div", Dv, [
                      Y[4] || (Y[4] = s("dt", null, "Installed version", -1)),
                      s("dd", null, T(e.pack.version), 1)
                    ])) : C("", !0),
                    Y[5] || (Y[5] = s("div", null, [
                      s("dt", null, "Pack tools"),
                      s("dd", null, [
                        s("code", null, "WorkPackPlan"),
                        W(", "),
                        s("code", null, "WorkPackApply")
                      ])
                    ], -1))
                  ])
                ]),
                _: 1
              })
            ]),
            _: 2
          }, [
            e.pack.requires.length ? {
              name: "meta",
              fn: q(() => [
                W("Needs " + T(u(Il)(e.pack.requires.map(he))), 1)
              ]),
              key: "0"
            } : void 0,
            e.pack.outdated ? {
              name: "actions",
              fn: q(() => [
                k(u(ae), {
                  label: "Review update",
                  severity: "secondary",
                  outlined: "",
                  size: "small",
                  disabled: !e.pack.canUpgrade,
                  title: e.pack.upgradeReason,
                  onClick: Y[0] || (Y[0] = (ke) => o("upgrade"))
                }, null, 8, ["disabled", "title"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["title", "description", "open"])
        ]),
        _: 1
      })) : C("", !0),
      (n(!0), f(te, null, fe(V.value, (ke) => (n(), H(Sl, {
        key: ke.title,
        title: ke.title || void 0,
        count: ke.title ? ke.rows.length : void 0
      }, {
        default: q(() => [
          (n(!0), f(te, null, fe(ke.rows, ({ plugin: de, current: We, issue: Re, chosen: Je, status: ua, severity: ca, title: Et, configurable: Bt, filtered: st, needs: zt, usedBy: Vt }) => (n(), H(Tl, {
            key: de.plugin,
            "data-plugin": de.plugin,
            title: Et,
            description: de.description,
            "expand-label": Bt || st ? "Configure" : "Details",
            "keep-mounted": Je,
            open: h(de.plugin, Re),
            "onUpdate:open": (Ce) => U(de.plugin, Ce)
          }, Ta({
            status: q(() => [
              k(u(tt), {
                class: "kx-tag-sm work-plugin-state",
                severity: ca,
                value: ua
              }, null, 8, ["severity", "value"])
            ]),
            default: q(() => [
              Re ? (n(), H(u(Bo), {
                key: 0,
                class: "work-plugin-issue",
                severity: "warn",
                closable: !1
              }, {
                default: q(() => [
                  s("div", Pv, [
                    Re.kind === "degraded" ? (n(), f("p", Rv, T(oe(de.plugin) ?? "A background update reported an error."), 1)) : Re.kind === "reset" ? (n(), f("p", Nv, "Background updates stopped" + T(oe(de.plugin) ? ": " + oe(de.plugin) : "."), 1)) : "cause" in Re && Re.cause ? (n(), f("p", Mv, T(Re.cause), 1)) : C("", !0),
                    Re.kind === "configuration" ? (n(), f("p", Fv, "Update the settings below, then review and apply your changes.")) : C("", !0),
                    Re.kind === "history" && Re.floor !== void 0 ? (n(), f("p", Lv, "Earliest retained event sequence is " + T(Re.floor) + ".", 1)) : C("", !0),
                    Re.kind === "history" ? (n(), f("p", Bv, "Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.")) : C("", !0),
                    s("div", zv, [
                      Re.kind === "setup" && We?.active ? (n(), H(u(ae), {
                        key: 0,
                        label: "Retry setup",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: $.value,
                        onClick: (Ce) => Pe(de.plugin)
                      }, null, 8, ["disabled", "onClick"])) : Re.kind === "provider" || Re.kind === "degraded" ? (n(), H(u(ae), {
                        key: 1,
                        label: "Check again",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        onClick: Y[2] || (Y[2] = (Ce) => o("refresh"))
                      })) : Re.kind === "reset" ? (n(), H(u(ae), {
                        key: 2,
                        label: "Reset background updates",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: $.value,
                        onClick: (Ce) => Ve(de.plugin)
                      }, null, 8, ["disabled", "onClick"])) : Re.kind === "missing" && Je ? (n(), H(u(ae), {
                        key: 3,
                        label: "Review references",
                        severity: "secondary",
                        outlined: "",
                        size: "small",
                        disabled: S.value,
                        onClick: (Ce) => E(de.plugin, Ce)
                      }, null, 8, ["disabled", "onClick"])) : C("", !0)
                    ])
                  ])
                ]),
                _: 2
              }, 1024)) : C("", !0),
              Bt ? (n(), f("section", {
                key: 1,
                class: "work-stack work-plugin-config",
                "aria-label": Et + " settings"
              }, [
                de.plugin === _v ? (n(), f(te, { key: 0 }, [
                  J.value ? (n(), H(mt, {
                    key: 1,
                    label: Oe(de, "issue_types"),
                    "aria-describedby": u(z),
                    options: le.value,
                    "model-value": G(de.plugin).issue_types,
                    disabled: !!r.value || e.disabled,
                    "onUpdate:modelValue": (Ce) => ne(de.plugin, Ce)
                  }, null, 8, ["label", "aria-describedby", "options", "model-value", "disabled", "onUpdate:modelValue"])) : (n(), f("p", qv, "The Planning pack supplies sprint and milestone fields for item types.")),
                  s("p", {
                    id: u(z),
                    class: "work-muted work-small"
                  }, "Selected types get Current sprint and Milestone fields.", 8, Wv)
                ], 64)) : (n(), H(Mo, {
                  key: x.value[de.plugin],
                  ref_for: !0,
                  ref: (Ce) => {
                    Ce ? u(y).set(de.plugin, Ce) : u(y).delete(de.plugin);
                  },
                  disabled: !!r.value || e.disabled,
                  schema: de.config_schema ?? {},
                  "model-value": G(de.plugin),
                  "suggest-defaults": "",
                  "onUpdate:modelValue": (Ce) => re(de.plugin, Ce),
                  onValidity: (Ce) => A(de.plugin, Ce),
                  onWidgetValidity: (Ce) => I(de.plugin, Ce),
                  onValidationMessage: (Ce) => b.value[de.plugin] = Ce
                }, null, 8, ["disabled", "schema", "model-value", "onUpdate:modelValue", "onValidity", "onWidgetValidity", "onValidationMessage"])),
                s("div", Gv, [
                  k(u(ae), {
                    label: "Restore saved settings",
                    severity: "secondary",
                    outlined: "",
                    size: "small",
                    disabled: !!r.value || e.disabled,
                    onClick: (Ce) => ee(de.plugin)
                  }, null, 8, ["disabled", "onClick"])
                ])
              ], 8, jv)) : C("", !0),
              st ? (n(), f("section", Kv, [
                Y[7] || (Y[7] = s("h4", null, "Filters", -1)),
                Y[8] || (Y[8] = s("p", { class: "work-muted work-small" }, "Choose which filters people can use to narrow down work on this board.", -1)),
                k(mt, {
                  label: "Available filters",
                  disabled: !!r.value || e.disabled || !Je,
                  options: Q(de.plugin).map((Ce) => ({ value: Ce.id, label: Ce.title })),
                  "model-value": e.draft.scopes?.filter((Ce) => Q(de.plugin).some((At) => At.id === Ce)),
                  "onUpdate:modelValue": (Ce) => M(de.plugin, Ce)
                }, null, 8, ["disabled", "options", "model-value", "onUpdate:modelValue"])
              ])) : C("", !0),
              !Bt && !st && !Re ? (n(), f("p", Hv, T(Je ? "This plugin has no settings for this board." : "Turn the plugin on to use it on this board."), 1)) : C("", !0),
              k(qe, {
                class: "work-disclosure work-small",
                label: "Technical details"
              }, {
                default: q(() => [
                  s("dl", Yv, [
                    s("div", null, [
                      Y[9] || (Y[9] = s("dt", null, "Plugin ID", -1)),
                      s("dd", null, [
                        s("code", null, T(de.plugin), 1)
                      ])
                    ]),
                    (We?.interface_version ?? de.interface_version) != null ? (n(), f("div", Xv, [
                      Y[10] || (Y[10] = s("dt", null, "Interface version", -1)),
                      s("dd", null, T(We?.interface_version ?? de.interface_version), 1)
                    ])) : C("", !0),
                    We?.version ? (n(), f("div", Jv, [
                      Y[11] || (Y[11] = s("dt", null, "Active schema version", -1)),
                      s("dd", null, T(We.version), 1)
                    ])) : C("", !0),
                    de.installed ? (n(), f("div", Zv, [...Y[12] || (Y[12] = [
                      s("dt", null, "Configuration tool", -1),
                      s("dd", null, [
                        s("code", null, "WorkConfigurePlugin")
                      ], -1)
                    ])])) : C("", !0),
                    de.tools.length ? (n(), f("div", Qv, [
                      Y[13] || (Y[13] = s("dt", null, "Plugin tools", -1)),
                      s("dd", null, [
                        (n(!0), f(te, null, fe(de.tools, (Ce) => (n(), f("code", {
                          key: Ce,
                          class: "work-block"
                        }, T(Ce), 1))), 128))
                      ])
                    ])) : C("", !0),
                    (n(!0), f(te, null, fe(We?.projections, (Ce, At) => (n(), f("div", { key: At }, [
                      s("dt", null, T(u(Me)(At)), 1),
                      s("dd", null, T(u(kv)(Ce, e.schema.as_of)) + " · Indexed through " + T(Ce.last_seq) + " of " + T(e.schema.as_of) + " events.", 1)
                    ]))), 128))
                  ])
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, [
            zt.length || Vt.length || Je && b.value[de.plugin] ? {
              name: "meta",
              fn: q(() => [
                zt.length ? (n(), f("span", Uv, "Needs " + T(u(Il)(zt)), 1)) : C("", !0),
                zt.length && Vt.length ? (n(), f("span", Ev, " · ")) : C("", !0),
                Vt.length ? (n(), f("span", Av, "Used by " + T(u(Il)(Vt)), 1)) : C("", !0),
                Je && b.value[de.plugin] ? (n(), f("span", Ov, T(b.value[de.plugin]), 1)) : C("", !0)
              ]),
              key: "0"
            } : void 0,
            Re?.kind !== "missing" ? {
              name: "actions",
              fn: q(() => [
                k(u(nt), {
                  "model-value": Je,
                  "aria-label": "Enable " + Et,
                  disabled: S.value || !!de.problem && !Je,
                  "onUpdate:modelValue": (Ce) => R(de.plugin, Ce)
                }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
              ]),
              key: "1"
            } : void 0
          ]), 1032, ["data-plugin", "title", "description", "expand-label", "keep-mounted", "open", "onUpdate:open"]))), 128))
        ]),
        _: 2
      }, 1032, ["title", "count"]))), 128)),
      me.value.length ? (n(), H(Sl, {
        key: 5,
        title: "Unavailable",
        count: me.value.length
      }, {
        default: q(() => [
          (n(!0), f(te, null, fe(me.value, (ke) => (n(), H(Tl, {
            key: ke.use,
            title: "Unavailable plugin",
            description: "This board still references a plugin that is no longer installed."
          }, {
            status: q(() => [
              k(u(tt), {
                class: "kx-tag-sm work-plugin-state",
                severity: "danger",
                value: "Not installed"
              })
            ]),
            actions: q(() => [
              k(u(ae), {
                label: "Review references",
                severity: "secondary",
                outlined: "",
                size: "small",
                disabled: S.value,
                onClick: (de) => E(ke.use, de)
              }, null, 8, ["disabled", "onClick"])
            ]),
            _: 2
          }, 1024))), 128))
        ]),
        _: 1
      }, 8, ["count"])) : C("", !0),
      ce.value.length ? (n(), H(qe, {
        key: 6,
        class: "work-settings-card work-disclosure",
        label: "Unavailable query filters"
      }, {
        default: q(() => [
          Y[14] || (Y[14] = s("p", { class: "work-muted" }, "These filters came from a plugin that is unavailable. Remove one to stop using it on this board.", -1)),
          (n(!0), f(te, null, fe(ce.value, (ke, de) => (n(), H(u(ae), {
            key: ke,
            label: "Remove unavailable filter " + (de + 1),
            severity: "secondary",
            text: "",
            onClick: (We) => e.draft.scopes = e.draft.scopes?.filter((Re) => Re !== ke)
          }, null, 8, ["label", "onClick"]))), 128))
        ]),
        _: 1
      })) : C("", !0)
    ]));
  }
}), ef = { class: "system-section-head" }, tf = { class: "system-section-head-text" }, af = {
  key: 0,
  class: "kx-head-actions"
}, lf = /* @__PURE__ */ Te({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(e) {
    return (a, t) => (n(), f("header", ef, [
      s("div", tf, [
        s("h1", null, T(e.title), 1),
        s("p", null, T(e.description), 1)
      ]),
      a.$slots.actions ? (n(), f("div", af, [
        Ye(a.$slots, "actions")
      ])) : C("", !0)
    ]));
  }
}), of = /* @__PURE__ */ Te({
  __name: "SettingsDraftActions",
  props: {
    busy: { type: Boolean },
    discardDisabled: { type: Boolean },
    reviewDisabled: { type: Boolean }
  },
  emits: ["discard", "review"],
  setup(e) {
    return (a, t) => (n(), f(te, null, [
      k(u(tt), {
        severity: "warn",
        value: "Unsaved changes"
      }),
      k(u(ae), {
        label: "Discard",
        type: "button",
        severity: "secondary",
        outlined: "",
        disabled: e.busy || e.discardDisabled,
        onClick: t[0] || (t[0] = (l) => a.$emit("discard"))
      }, {
        icon: q(() => [
          k(u(pe), {
            icon: "tabler:restore",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["disabled"]),
      k(u(ae), {
        label: "Review changes",
        type: "button",
        disabled: e.busy || e.reviewDisabled,
        loading: e.busy,
        onClick: t[1] || (t[1] = (l) => a.$emit("review", l.currentTarget))
      }, null, 8, ["disabled", "loading"])
    ], 64));
  }
}), nf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, sf = ["config"], rf = /* @__PURE__ */ Te({
  __name: "BoardShare",
  props: {
    board: {},
    busy: { type: Boolean }
  },
  emits: ["shared"],
  setup(e) {
    const a = e, t = B(!1), l = B(!1), o = B("");
    async function r() {
      const m = a.board;
      if (!(a.busy || l.value)) {
        l.value = !0, o.value = "";
        try {
          const g = await Mt("kickside-share");
          if (a.board.board_id !== m.board_id) return;
          g ? t.value = !0 : o.value = "Sharing is unavailable. Try opening it again.";
        } finally {
          l.value = !1;
        }
      }
    }
    De(() => a.board.board_id, () => {
      t.value = !1, o.value = "";
    });
    const v = L(() => {
      const m = encodeURIComponent(a.board.board_id);
      return JSON.stringify({
        resource_id: a.board.board_id,
        title: a.board.title,
        access_url: "/api/v1/component-access/grants/" + m,
        share_url: "/api/v1/component-access/share/" + m
      });
    });
    return (m, g) => (n(), f(te, null, [
      k(u(ae), {
        label: "Share board",
        severity: "secondary",
        outlined: "",
        loading: l.value,
        disabled: e.busy,
        onClick: r
      }, {
        icon: q(() => [
          k(u(pe), {
            icon: "tabler:share",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["loading", "disabled"]),
      o.value ? (n(), f("p", nf, T(o.value), 1)) : C("", !0),
      t.value ? (n(), f("kickside-share", {
        key: 1,
        config: v.value,
        onClose: g[0] || (g[0] = (i) => t.value = !1),
        onChanged: g[1] || (g[1] = (i) => m.$emit("shared"))
      }, null, 40, sf)) : C("", !0)
    ], 64));
  }
}), df = {
  class: "work-stack",
  "aria-label": "Board visibility"
}, uf = { class: "work-stack work-tight" }, cf = {
  key: 0,
  class: "work-settings-list"
}, vf = { class: "work-row-main" }, ff = { class: "work-small work-muted" }, mf = { class: "work-row-control" }, pf = { class: "work-row" }, gf = /* @__PURE__ */ Te({
  __name: "VisibilityEditor",
  props: {
    draft: {},
    boardId: {}
  },
  emits: ["validity"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = L(() => t.draft.visibility), r = L(() => (t.draft.fields ?? []).filter((b) => b.form === "text" && (!b.cardinality || b.cardinality === "one") && b.type !== "rollup" && b.index !== "number" && b.config?.case !== "insensitive")), v = L(() => r.value.find((b) => b.code === o.value?.field)?.type !== "option");
    function m(b) {
      if (o.value?.levels.some((p) => p.id === b)) return "This level is already in use.";
    }
    function g(b) {
      o.value?.levels.push({ id: b, holders: [] });
    }
    function i(b) {
      if (!b) {
        delete t.draft.visibility;
        return;
      }
      const p = r.value.find((w) => w.code === b);
      t.draft.visibility = { field: b, levels: (p?.options ?? []).map((w) => ({ id: w.id, holders: [] })) };
    }
    function d(b, p) {
      const w = o.value?.levels.find((V) => V.id === b);
      w && (w.holders = p ?? []);
    }
    function c(b) {
      if (!b || typeof b != "object" || Array.isArray(b)) return !1;
      const p = Object.entries(b);
      if (p.length !== 1) return !1;
      const [w, V] = p[0];
      return ["group", "user", "service", "field"].includes(w) && typeof V == "string" && V.length > 0;
    }
    function x(b) {
      return !!b && typeof b == "object" && "field" in b && typeof b.field == "string" && (!("bypass" in b) || b.bypass === "admin") && "levels" in b && Array.isArray(b.levels) && b.levels.every((p) => !!p && typeof p == "object" && "id" in p && typeof p.id == "string" && p.id.length > 0 && "holders" in p && Array.isArray(p.holders) && p.holders.every(c));
    }
    function y(b) {
      if (b !== void 0 && !x(b)) return "Enter a field and levels with valid holder rules. Omit bypass or set it to admin.";
      t.draft.visibility = b;
    }
    return (b, p) => (n(), f("section", df, [
      p[6] || (p[6] = s("h3", { class: "work-group-title" }, "Board visibility", -1)),
      p[7] || (p[7] = s("p", { class: "work-small work-muted" }, "Restrict items by their visibility level. People still need access to the board.", -1)),
      s("label", uf, [
        p[4] || (p[4] = W("Visibility field ", -1)),
        k(u(ge), {
          "aria-label": "Visibility field",
          "model-value": o.value?.field ?? "",
          placeholder: "No additional restriction",
          options: [{ label: "No additional restriction", value: "" }, ...r.value.map((w) => ({ label: u(et)(w), value: w.code }))],
          optionLabel: "label",
          optionValue: "value",
          appendTo: "self",
          "onUpdate:modelValue": i
        }, null, 8, ["model-value", "options"])
      ]),
      o.value ? (n(), f(te, { key: 0 }, [
        o.value.levels.length ? (n(), f("div", cf, [
          (n(!0), f(te, null, fe(o.value.levels, (w, V) => (n(), f("div", {
            key: w.id,
            class: "work-settings-row"
          }, [
            s("div", vf, [
              s("strong", null, T(r.value.find(($) => $.code === o.value.field)?.options?.find(($) => $.id === w.id)?.label || w.id), 1),
              s("p", ff, "Level " + T(V + 1), 1)
            ]),
            s("div", mf, [
              k(Wo, {
                "board-id": e.boardId,
                label: "Who can see these items",
                "model-value": w.holders,
                "onUpdate:modelValue": ($) => d(w.id, $),
                onValidity: p[0] || (p[0] = ($) => l("validity", $))
              }, null, 8, ["board-id", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])) : C("", !0),
        v.value ? (n(), H(Ia, {
          key: o.value.field,
          action: "Add level",
          label: "New visibility level",
          validate: m,
          onAdd: g
        })) : C("", !0),
        s("label", pf, [
          k(u(nt), {
            "model-value": o.value.bypass === "admin",
            "onUpdate:modelValue": p[1] || (p[1] = (w) => w ? o.value.bypass = "admin" : delete o.value.bypass)
          }, null, 8, ["model-value"]),
          p[5] || (p[5] = W(" Board administrators can see every level ", -1))
        ]),
        k(u(ae), {
          label: "Remove visibility restriction",
          severity: "secondary",
          text: "",
          onClick: p[2] || (p[2] = (w) => delete e.draft.visibility)
        })
      ], 64)) : C("", !0),
      k(Ft, {
        label: "Visibility rules",
        "model-value": o.value,
        shape: "object",
        example: { field: "visibility", levels: [{ id: "internal", holders: [] }], bypass: "admin" },
        commit: y,
        onValidity: p[3] || (p[3] = (w) => l("validity", w))
      }, null, 8, ["model-value"])
    ]));
  }
}), bf = { class: "work-ia-section" }, hf = {
  class: "work-settings-list",
  "aria-labelledby": "work-sharing-title"
}, yf = { class: "work-settings-row" }, kf = { class: "work-row-main" }, wf = {
  key: 0,
  class: "work-muted work-small"
}, $f = {
  key: 0,
  class: "work-member-preview",
  "aria-label": "People and groups with direct access"
}, Vf = { class: "work-spacer" }, xf = {
  key: 1,
  class: "work-settings-row work-muted work-small"
}, Cf = {
  key: 2,
  class: "work-settings-row work-muted"
}, Sf = {
  key: 3,
  class: "work-settings-row"
}, Tf = {
  key: 4,
  class: "work-settings-row work-muted",
  role: "status"
}, If = /* @__PURE__ */ Te({
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
    const a = e, t = B(), l = B([]), o = L(() => t.value?.filter((b) => b.subject_type === "group").length ?? 0), r = L(() => (t.value?.length ?? 0) - o.value), v = L(() => [...t.value ?? []].sort((b, p) => +!!p.owner - +!!b.owner || p.access_mask - b.access_mask).slice(0, 6).map((b) => ({ ...b, permissions: d(b) }))), m = L(() => v.value.map((b) => ({ id: b.subject_id, kind: b.subject_type ?? "user" }))), g = Fo(() => a.boardId, m);
    function i(b) {
      return b.full_name || g.label({ id: b.subject_id, kind: b.subject_type ?? "user", email: b.email });
    }
    function d(b) {
      return b.owner ? "Owner" : l.value.filter((p) => (b.access_mask & p.bit) === p.bit).map((p) => p.label).join(", ");
    }
    const c = B(!1), x = sa();
    async function y() {
      const b = x();
      c.value = !1;
      try {
        const [{ data: p }, w] = await Promise.all([
          El.get("/api/v1/component-access/grants/" + encodeURIComponent(a.boardId)),
          El.get("/api/v1/components/access-model")
        ]);
        if (!b()) return;
        if (!p?.success || !Array.isArray(p.access)) throw new Error("Grants unavailable");
        t.value = p.access, l.value = w.data?.success && Array.isArray(w.data.capabilities) ? w.data.capabilities : [];
      } catch {
        b() && (t.value = void 0, c.value = !0);
      }
    }
    return ql(() => x()), De(() => [a.active, a.boardId], () => {
      a.active && y();
    }, { immediate: !0 }), (b, p) => (n(), f("section", bf, [
      s("section", hf, [
        s("div", yf, [
          s("div", kf, [
            p[1] || (p[1] = s("h3", {
              id: "work-sharing-title",
              class: "work-row-title"
            }, "Members and sharing", -1)),
            t.value ? (n(), f("p", wf, T(r.value) + " " + T(r.value === 1 ? "person" : "people") + " and " + T(o.value) + " " + T(o.value === 1 ? "group" : "groups") + " with direct access", 1)) : C("", !0)
          ]),
          e.board ? (n(), H(rf, {
            key: 0,
            board: e.board,
            busy: e.busy,
            onShared: y
          }, null, 8, ["board", "busy"])) : C("", !0)
        ]),
        v.value.length ? (n(), f("ul", $f, [
          (n(!0), f(te, null, fe(v.value, (w) => (n(), f("li", {
            key: w.subject_type + w.subject_id,
            class: "work-settings-row"
          }, [
            k(u(pe), {
              icon: w.subject_type === "group" ? "tabler:users" : "tabler:user",
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            s("strong", Vf, T(i(w)), 1),
            w.permissions ? (n(), H(u(tt), {
              key: 0,
              class: "kx-tag-sm",
              severity: "secondary",
              value: w.permissions
            }, null, 8, ["value"])) : C("", !0)
          ]))), 128))
        ])) : C("", !0),
        t.value && t.value.length > v.value.length ? (n(), f("p", xf, " See all " + T(t.value.length) + " people and groups under Share board. ", 1)) : t.value && !t.value.length ? (n(), f("p", Cf, "No direct grants yet.")) : c.value ? (n(), f("div", Sf, [
          p[2] || (p[2] = s("p", {
            class: "work-spacer work-muted",
            role: "alert"
          }, "Member summary is unavailable.", -1)),
          k(u(ae), {
            label: "Reload members",
            severity: "secondary",
            text: "",
            onClick: y
          })
        ])) : t.value ? C("", !0) : (n(), f("p", Tf, "Loading members…"))
      ]),
      k(qe, {
        class: "work-disclosure work-visibility-disclosure",
        label: e.draft.visibility ? "Advanced · Item visibility rules set" : "Advanced · Item visibility"
      }, {
        default: q(() => [
          k(gf, {
            "board-id": e.boardId,
            draft: e.draft,
            onValidity: p[0] || (p[0] = (w) => b.$emit("validity", w))
          }, null, 8, ["board-id", "draft"])
        ]),
        _: 1
      }, 8, ["label"])
    ]));
  }
}), Df = { class: "work-settings-row" }, Uf = ["for"], Ef = { class: "work-settings-row" }, Af = { class: "work-row-main" }, Of = ["id"], Pf = { class: "work-settings-grid" }, Rf = { class: "work-stack work-tight" }, Nf = { class: "work-stack work-tight" }, Mf = ["value", "inert"], Ff = {
  key: 1,
  class: "work-muted work-small"
}, Lf = {
  key: 0,
  class: "work-settings-row"
}, Bf = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, zf = {
  key: 1,
  class: "work-muted work-small",
  role: "status"
}, jf = {
  key: 1,
  class: "work-board-identity work-stack work-tight"
}, qf = { class: "work-stack work-tight" }, Wf = { class: "work-stack work-tight" }, Gf = { class: "work-stack work-tight" }, Kf = ["value", "inert"], Hf = {
  key: 1,
  class: "work-muted work-small"
}, Yf = { class: "work-row" }, Xf = { class: "work-row" }, Jf = { class: "work-row work-board-title" }, Zf = {
  key: 1,
  class: "work-identity-actions"
}, Qf = ["title"], _f = {
  key: 2,
  class: "kx-err work-inline",
  role: "alert"
}, em = {
  key: 3,
  class: "work-muted work-small",
  role: "status"
}, tm = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = B(!1), r = B(!1), v = B(""), m = B(""), g = B(""), i = B(""), d = B(!1), c = B(!1), x = B(""), y = B(""), b = L(() => t.board?.access?.admin === !0), p = wt(), w = wt(), V = B({ title: "", description: "", icon: "", app: "" }), $ = L(() => [
      { id: "", title: "Default app" },
      ...t.boardApps ?? [],
      ...t.board?.ui_app && !t.boardApps?.some((O) => O.id === t.board?.ui_app) ? [{ id: t.board.ui_app, title: t.boardApps ? "Unavailable app" : "Configured board app", disabled: !0 }] : []
    ]), S = L(() => $.value.find((O) => O.id === i.value)?.title), D = L(() => !!t.boardApps?.length || !!t.board?.ui_app), z = L(() => ({
      title: t.board?.title ?? "",
      icon: t.board?.icon ?? "",
      description: t.board?.description ?? "",
      app: t.board?.ui_app ?? ""
    }));
    function le() {
      V.value = z.value, v.value = z.value.title, g.value = z.value.icon, m.value = z.value.description, i.value = z.value.app;
    }
    function J() {
      Mt("wc-icon-picker").then((O) => d.value = O);
    }
    function ce() {
      le(), x.value = "", y.value = "", o.value = !0, J();
    }
    const me = L(() => {
      const O = {};
      return v.value.trim() !== V.value.title && (O.title = v.value.trim()), m.value !== V.value.description && (O.description = m.value), g.value !== V.value.icon && (O.icon = g.value), i.value !== V.value.app && (O.ui_app = i.value), O;
    }), be = L(() => (t.detail || o.value) && Object.keys(me.value).length > 0);
    De(z, () => {
      t.detail && !be.value && le();
    }, { immediate: !0 }), De(r, (O) => {
      O && J();
    }), De(b, (O) => {
      O || he();
    }), De(be, (O) => l("dirty-change", O));
    function he() {
      o.value = !1, x.value = "", y.value = "", le();
    }
    async function se() {
      if (!b.value || !t.board || c.value || !v.value.trim()) return;
      const O = me.value;
      if (!Object.keys(O).length) {
        o.value = !1, y.value = "Nothing changed.";
        return;
      }
      c.value = !0, x.value = "";
      try {
        const Q = await Rt.updateBoard(t.board.board_id, O);
        v.value = v.value.trim(), V.value = { title: v.value, description: m.value, icon: g.value, app: i.value }, o.value = !1, y.value = Q.status === "unchanged" ? "Nothing changed." : "Board saved.", l("saved");
      } catch (Q) {
        x.value = vt(Q, "Could not save the board.");
      } finally {
        c.value = !1;
      }
    }
    return (O, Q) => e.detail ? (n(), f("form", {
      key: 0,
      class: "work-board-identity",
      "aria-label": "Edit board details",
      onSubmit: Be(se, ["prevent"])
    }, [
      s("div", Df, [
        s("label", {
          for: u(p),
          class: "work-row-main work-row-title"
        }, "Board name", 8, Uf),
        k(u(Ae), {
          id: u(p),
          modelValue: v.value,
          "onUpdate:modelValue": Q[0] || (Q[0] = (M) => v.value = M),
          required: "",
          disabled: c.value || !b.value
        }, null, 8, ["id", "modelValue", "disabled"])
      ]),
      s("div", Ef, [
        s("div", Af, [
          s("h3", {
            class: "work-row-title",
            id: u(w)
          }, "Board app", 8, Of),
          Q[9] || (Q[9] = s("p", { class: "work-muted work-small" }, "Opens the board from Work navigation.", -1))
        ]),
        k(u(ge), {
          modelValue: i.value,
          "onUpdate:modelValue": Q[1] || (Q[1] = (M) => i.value = M),
          "aria-labelledby": u(w),
          options: $.value,
          placeholder: S.value,
          optionLabel: "title",
          optionValue: "id",
          optionDisabled: "disabled",
          appendTo: "self",
          disabled: c.value || !b.value || !D.value
        }, null, 8, ["modelValue", "aria-labelledby", "options", "placeholder", "disabled"])
      ]),
      Ye(O.$slots, "default"),
      k(qe, {
        open: r.value,
        "onUpdate:open": Q[4] || (Q[4] = (M) => r.value = M),
        class: "work-board-appearance",
        label: "Board description and icon"
      }, {
        default: q(() => [
          s("div", Pf, [
            s("label", Rf, [
              Q[10] || (Q[10] = W("Description", -1)),
              k(u(Da), {
                modelValue: m.value,
                "onUpdate:modelValue": Q[2] || (Q[2] = (M) => m.value = M),
                rows: "1",
                disabled: c.value || !b.value
              }, null, 8, ["modelValue", "disabled"])
            ]),
            s("div", Nf, [
              Q[11] || (Q[11] = s("span", null, "Board icon", -1)),
              d.value ? (n(), f("wc-icon-picker", {
                key: 0,
                value: g.value,
                fallback: "tabler:layout-kanban",
                inert: c.value || !b.value || void 0,
                onSelect: Q[3] || (Q[3] = (M) => g.value = M.detail)
              }, null, 40, Mf)) : (n(), f("p", Ff, "The icon picker is unavailable."))
            ])
          ])
        ]),
        _: 1
      }, 8, ["open"]),
      be.value || x.value || y.value ? (n(), f("div", Lf, [
        x.value ? (n(), f("p", Bf, T(x.value), 1)) : y.value && !be.value ? (n(), f("p", zf, T(y.value), 1)) : C("", !0),
        be.value ? (n(), f(te, { key: 2 }, [
          k(u(ae), {
            label: "Save board details",
            type: "submit",
            size: "small",
            disabled: !v.value.trim() || c.value || !b.value,
            loading: c.value
          }, null, 8, ["disabled", "loading"]),
          k(u(ae), {
            label: "Cancel",
            type: "button",
            severity: "secondary",
            text: "",
            size: "small",
            disabled: c.value,
            onClick: he
          }, null, 8, ["disabled"])
        ], 64)) : C("", !0)
      ])) : C("", !0)
    ], 32)) : (n(), f("div", jf, [
      o.value ? (n(), f("form", {
        key: 0,
        class: "work-identity-edit",
        "aria-label": "Edit board",
        onClick: Q[8] || (Q[8] = Be(() => {
        }, ["stop"])),
        onSubmit: Be(se, ["prevent"])
      }, [
        s("label", qf, [
          Q[12] || (Q[12] = W("Title", -1)),
          k(u(Ae), {
            modelValue: v.value,
            "onUpdate:modelValue": Q[5] || (Q[5] = (M) => v.value = M),
            required: "",
            autofocus: "",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("label", Wf, [
          Q[13] || (Q[13] = W("Description", -1)),
          k(u(Da), {
            modelValue: m.value,
            "onUpdate:modelValue": Q[6] || (Q[6] = (M) => m.value = M),
            rows: "1",
            disabled: c.value
          }, null, 8, ["modelValue", "disabled"])
        ]),
        s("div", Gf, [
          Q[14] || (Q[14] = s("span", null, "Board icon", -1)),
          d.value ? (n(), f("wc-icon-picker", {
            key: 0,
            value: g.value,
            fallback: "tabler:layout-kanban",
            inert: c.value || void 0,
            onSelect: Q[7] || (Q[7] = (M) => g.value = M.detail)
          }, null, 40, Kf)) : (n(), f("p", Hf, "The icon picker is unavailable."))
        ]),
        s("div", Yf, [
          k(u(ae), {
            label: "Save",
            severity: "secondary",
            type: "submit",
            disabled: !v.value.trim() || c.value,
            loading: c.value,
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:device-floppy",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled", "loading"]),
          k(u(ae), {
            label: "Cancel",
            severity: "secondary",
            disabled: c.value,
            onClick: he,
            outlined: ""
          }, {
            icon: q(() => [
              k(u(pe), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : (n(), f(te, { key: 1 }, [
        s("div", Xf, [
          s("div", Jf, [
            e.board?.icon ? (n(), H(u(pe), {
              key: 0,
              icon: e.board.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : C("", !0),
            (n(), H(Sa(e.compact ? "h2" : "h1"), {
              class: ft(e.compact ? "kx-card-name" : "kx-title")
            }, {
              default: q(() => [
                W(T(e.board?.title || "Untitled board"), 1)
              ]),
              _: 1
            }, 8, ["class"]))
          ]),
          e.compact ? Ye(O.$slots, "title-end", {}, void 0, void 0, 0) : C("", !0),
          e.compact ? (n(), f("span", Zf, [
            b.value ? (n(), H(u(ae), {
              key: 0,
              severity: "secondary",
              text: "",
              size: "small",
              onClick: Be(ce, ["stop"]),
              "aria-label": "Edit board"
            }, {
              default: q(() => [
                k(u(pe), {
                  icon: "tabler:pencil",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })) : C("", !0),
            Ye(O.$slots, "actions")
          ])) : b.value ? (n(), H(u(ae), {
            key: 2,
            severity: "secondary",
            text: "",
            size: "small",
            onClick: Be(ce, ["stop"]),
            "aria-label": "Edit board"
          }, {
            default: q(() => [
              k(u(pe), {
                icon: "tabler:pencil",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })) : C("", !0),
          e.compact ? C("", !0) : Ye(O.$slots, "title-end", {}, void 0, void 0, 3)
        ]),
        !e.compact && (e.subtitle || e.board?.description) ? (n(), f("p", {
          key: 0,
          class: "kx-head-sub",
          title: e.subtitle || e.board?.description
        }, T(e.subtitle || e.board?.description), 9, Qf)) : C("", !0)
      ], 64)),
      x.value ? (n(), f("p", _f, T(x.value), 1)) : C("", !0),
      y.value ? (n(), f("p", em, T(y.value), 1)) : C("", !0)
    ]));
  }
}), am = { class: "work-ia-section work-ia-general" }, lm = {
  class: "work-settings-list work-board-details",
  "aria-label": "Board details"
}, om = {
  key: 0,
  class: "work-settings-row"
}, im = { class: "work-settings-row" }, nm = { class: "work-row-main" }, sm = ["for"], rm = { class: "work-muted work-small" }, dm = {
  class: "work-board-summary work-row work-wrap work-small",
  "aria-label": "Board summary"
}, um = { class: "work-muted" }, cm = { key: 0 }, vm = { key: 1 }, fm = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, mm = {
  key: 0,
  class: "work-stack work-tight"
}, pm = {
  key: 0,
  class: "work-stack work-tight"
}, gm = {
  key: 1,
  class: "work-muted"
}, bm = { class: "work-stack work-tight" }, hm = { class: "work-spacer" }, ym = /* @__PURE__ */ Te({
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
    const a = e, t = wt(), l = {
      comments_per_item: "Comments per item",
      audit: "Change history",
      audit_days: "Change history retention",
      interval_days: "Time-in-state history retention",
      trash_days: "Trash retention",
      tombstone_days: "Deletion record retention"
    }, o = L(() => Object.keys(l).filter((y) => a.draft.policy?.[y] !== void 0));
    function r(y) {
      const b = a.draft.policy?.[y];
      return y === "audit" ? b === "off" ? "Off" : "Track field changes" : y === "comments_per_item" ? b : b === 0 ? y === "audit_days" || y === "interval_days" ? "365 days" : "Clean up immediately" : b === 1 ? "1 day" : b + " days";
    }
    const v = B(), m = B(!1);
    let g = "";
    De([() => a.active, () => a.board?.board_id, () => a.schema.generation], async ([y, b, p], w, V) => {
      if (!y || !b || g === b + "/" + p) return;
      v.value = void 0, m.value = !1;
      let $ = !0;
      V(() => $ = !1);
      try {
        const S = await Promise.all(Array.from(
          { length: Math.min(3, Math.max(0, p - 1)) },
          (D, z) => Rt.schema(b, p - z - 1)
        ));
        $ && (v.value = S, g = b + "/" + p);
      } catch {
        $ && (m.value = !0);
      }
    }, { immediate: !0 });
    function i(y) {
      return JSON.stringify(y, (b, p) => p && typeof p == "object" && !Array.isArray(p) ? Object.fromEntries(Object.entries(p).sort(([w], [V]) => w.localeCompare(V))) : p);
    }
    function d(y, b) {
      if (!b) return ["Initial board setup"];
      const p = y.declaration, w = b.declaration, V = [], $ = [
        ["Fields", p.fields, w.fields],
        ["Item types", p.item_types, w.item_types],
        ["Workflow", p.processes, w.processes],
        ["Links", p.relation_types, w.relation_types],
        ["Plugins and filters", [p.plugins, p.scopes], [w.plugins, w.scopes]],
        ["Item visibility", p.visibility, w.visibility],
        ["Board rules", p.policy, w.policy],
        ["Starting pack", y.pack, b.pack],
        ["Item key prefix", y.key_prefix, b.key_prefix]
      ];
      if (i(p.fields) !== i(w.fields)) {
        const D = p.fields?.filter((z) => !w.fields?.some((le) => le.code === z.code)) ?? [];
        D.length === 1 && V.push("Added " + et(D[0]));
      }
      const S = $.filter(([, D, z]) => i(D) !== i(z)).map(([D]) => D).filter((D) => D !== "Fields" || !V.length);
      return S.length && V.push(S.join(", ") + " updated"), V.length ? V : ["Board setup updated"];
    }
    const c = B(!1), x = L(() => {
      if (!v.value || a.schema.generation < 1) return [];
      const y = [a.schema, ...v.value];
      return y.slice(0, 3).map((b, p) => d(b, y[p + 1]));
    });
    return (y, b) => (n(), f("section", am, [
      s("section", lm, [
        e.board ? (n(), f("div", om, [
          b[8] || (b[8] = s("div", { class: "work-row-main" }, [
            s("h3", { class: "work-row-title" }, "Board access"),
            s("p", { class: "work-muted work-small" }, "Give people and groups access to this board.")
          ], -1)),
          s("div", null, [
            k(u(ae), {
              label: "Share board",
              type: "button",
              severity: "secondary",
              outlined: "",
              onClick: b[0] || (b[0] = (p) => y.$emit("share"))
            }, {
              icon: q(() => [
                k(u(pe), {
                  icon: "tabler:share",
                  "aria-hidden": "true"
                })
              ]),
              _: 1
            })
          ])
        ])) : C("", !0),
        (n(), H(tm, {
          key: e.board?.board_id,
          board: e.board,
          "board-apps": e.boardApps,
          detail: "",
          onDirtyChange: b[2] || (b[2] = (p) => y.$emit("dirty-change", p)),
          onSaved: b[3] || (b[3] = (p) => y.$emit("saved"))
        }, {
          default: q(() => [
            s("div", im, [
              s("div", nm, [
                s("label", {
                  class: "work-row-title",
                  for: u(t)
                }, "Item key prefix", 8, sm),
                s("p", rm, "Shown on items, for example " + T(e.draft.key_prefix || "WORK") + "-1.", 1)
              ]),
              k(u(Ae), {
                id: u(t),
                modelValue: e.draft.key_prefix,
                "onUpdate:modelValue": b[1] || (b[1] = (p) => e.draft.key_prefix = p),
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
      s("section", dm, [
        s("p", um, [
          e.board?.open_count !== void 0 && e.board.item_count !== void 0 ? (n(), f("span", cm, T(e.board.open_count) + " open · " + T(e.board.item_count) + " total · ", 1)) : C("", !0),
          W(" " + T(e.packTitle || "No pack installed"), 1),
          e.outdated ? (n(), f("span", vm, " · Update available")) : C("", !0)
        ]),
        e.packError ? (n(), f("p", fm, T(e.packError), 1)) : C("", !0),
        e.packError ? (n(), H(u(ae), {
          key: 1,
          label: "Reload packs",
          severity: "secondary",
          outlined: "",
          size: "small",
          onClick: b[4] || (b[4] = (p) => y.$emit("retry"))
        })) : C("", !0),
        e.packTitle ? e.outdated ? (n(), H(u(ae), {
          key: 3,
          label: "Update pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canUpgrade,
          title: e.upgradeReason,
          onClick: b[6] || (b[6] = (p) => y.$emit("upgrade"))
        }, null, 8, ["disabled", "title"])) : C("", !0) : (n(), H(u(ae), {
          key: 2,
          label: "Install pack",
          severity: "secondary",
          outlined: "",
          size: "small",
          disabled: !e.canInstall,
          onClick: b[5] || (b[5] = (p) => y.$emit("install"))
        }, null, 8, ["disabled"]))
      ]),
      e.schema.pack ? (n(), H(qe, {
        key: 0,
        open: c.value,
        "onUpdate:open": b[7] || (b[7] = (p) => c.value = p),
        class: "work-disclosure work-small",
        label: "Technical details"
      }, {
        default: q(() => [
          c.value ? (n(), f("dl", mm, [
            s("div", null, [
              b[9] || (b[9] = s("dt", null, "Pack ID", -1)),
              s("dd", null, [
                s("code", null, T(e.schema.pack.id), 1)
              ])
            ]),
            s("div", null, [
              b[10] || (b[10] = s("dt", null, "Pack version", -1)),
              s("dd", null, T(e.schema.pack.version), 1)
            ]),
            b[11] || (b[11] = s("div", null, [
              s("dt", null, "Pack tools"),
              s("dd", null, [
                s("code", null, "WorkPackPlan"),
                W(", "),
                s("code", null, "WorkPackApply")
              ])
            ], -1))
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["open"])) : C("", !0),
      k(qe, {
        class: "work-disclosure",
        label: "Recent setup changes"
      }, {
        default: q(() => [
          x.value.length ? (n(), f("ul", pm, [
            (n(!0), f(te, null, fe(x.value, (p, w) => (n(), f("li", { key: w }, T(p.join(" · ")), 1))), 128))
          ])) : (n(), f("p", gm, T(m.value ? "Recent changes are unavailable." : v.value ? "No setup changes yet." : "Loading recent changes…"), 1))
        ]),
        _: 1
      }),
      o.value.length ? (n(), H(qe, {
        key: 1,
        class: "work-settings-card work-disclosure",
        label: "Advanced · Existing board overrides"
      }, {
        default: q(() => [
          b[12] || (b[12] = s("p", { class: "work-muted" }, "Clear an override to use the Work application default.", -1)),
          s("ul", bm, [
            (n(!0), f(te, null, fe(o.value, (p) => (n(), f("li", {
              key: p,
              class: "work-row work-wrap"
            }, [
              s("span", hm, T(l[p]) + " · " + T(r(p)), 1),
              k(u(ae), {
                label: "Use default for " + l[p].toLowerCase(),
                disabled: e.disabled,
                size: "small",
                text: "",
                onClick: (w) => delete e.draft.policy[p]
              }, null, 8, ["label", "disabled", "onClick"])
            ]))), 128))
          ])
        ]),
        _: 1
      })) : C("", !0)
    ]));
  }
}), He = (e, a) => `${e} → ${a}`, Co = (e, a) => {
  const t = e.fields?.find((l) => l.code === a);
  return t ? et(t) : "Untitled field";
}, So = {
  comments_per_item: "Comments per item",
  stage_timeout: "Default attempt timeout",
  stage_max_visits: "Default maximum visits",
  audit: "Audit trail",
  audit_days: "Audit history",
  trash_days: "Keep trashed items",
  tombstone_days: "Keep deletion records",
  interval_days: "Keep state history"
};
function To(e, a) {
  if (a === void 0) return "Application default";
  if (e === "audit") return Me(String(a));
  if (e === "stage_timeout") {
    const t = ya(String(a));
    if (t) return `${t.amount.toLocaleString()} ${t.amount === 1 ? t.unit.slice(0, -1) : t.unit}`;
  }
  if (e.endsWith("_days")) {
    const t = a === 0 && (e === "audit_days" || e === "interval_days") ? 365 : a;
    return `${t} ${t === 1 ? "day" : "days"}`;
  }
  return String(a);
}
function km(e, a) {
  const t = e.policy ?? {}, l = a.policy ?? {}, o = Object.keys(So).flatMap((m) => t[m] === l[m] ? [] : [`${So[m]} · ${He(To(m, t[m]), To(m, l[m]))}`]), r = (m) => m ? `${m.limit}${m.hard ? " (hard limit)" : ""}` : "No limit", v = /* @__PURE__ */ new Set([...Object.keys(t.wip ?? {}), ...Object.keys(l.wip ?? {})]);
  for (const m of v) {
    const g = r(t.wip?.[m]), i = r(l.wip?.[m]);
    if (g === i) continue;
    const d = (a.processes ?? []).flatMap((c) => c.states).find((c) => c.id === m) ?? (e.processes ?? []).flatMap((c) => c.states).find((c) => c.id === m);
    o.push(`${ye(d)} limit · ${He(g, i)}`);
  }
  return o;
}
function wm(e, a, t) {
  const l = e.visibility, o = a.visibility, r = [];
  l?.field !== o?.field && r.push(He(
    l ? Co(e, l.field) : "No additional restriction",
    o ? Co(a, o.field) : "No additional restriction"
  ));
  const v = l?.levels ?? [], m = o?.levels ?? [], g = new Set([...v, ...m].map((i) => i.id));
  for (const i of g) {
    const d = v.find((p) => p.id === i), c = m.find((p) => p.id === i);
    if (d && c && JSON.stringify(d.holders) === JSON.stringify(c.holders)) continue;
    const x = (p) => p.fields?.find((w) => w.code === p.visibility?.field)?.options?.find((w) => w.id === i)?.label, y = x(a) || x(e) || Me(i), b = (p) => p ? p.holders.map(t).join(", ") || "No extra access" : "No level";
    r.push(`${y} · ${He(b(d), b(c))}`);
  }
  return l?.bypass !== o?.bypass && r.push(o?.bypass === "admin" ? "Board administrators can see every level." : "Visibility levels now apply to board administrators."), r;
}
const ka = {
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
function $m(e, a, t) {
  const { what: l, detail: o, to: r } = e, m = `${t?.name || a?.name || "Untitled workflow"} · ${ka[l] ?? "Workflow changed"}`, g = l.startsWith("state.") ? a?.states.find((y) => y.id === o) : void 0, i = l.startsWith("state.") ? t?.states.find((y) => y.id === o) : void 0, d = l.startsWith("transition.") ? a?.transitions?.find((y) => y.id === o) : void 0, c = l.startsWith("transition.") ? t?.transitions?.find((y) => y.id === o) : void 0;
  let x = "";
  if (l === "state.map") x = He(ye(g), ye(t?.states.find((y) => y.id === r)));
  else if (l === "state.name") x = He(ye(g), ye(i));
  else if (l === "state.kind") x = `${ye(i)} · ${He(Ja(g?.kind), Ja(i?.kind))}`;
  else if (l === "state.category" && g && i) x = `${ye(i)} · ${He(Lt(g.category), Lt(i.category))}`;
  else if (i || g) x = ye(i ?? g);
  else if (l === "transition.name" && d && c) x = He(Xe(d), Xe(c));
  else if (c && d && c.to !== d.to) {
    const y = ye(a?.states.find((p) => p.id === d.to)), b = ye(t?.states.find((p) => p.id === c.to));
    return { title: m, details: [Xe(c), `Destination changes from ${y} to ${b}.`] };
  } else if (l === "transition.add" && c && t) {
    const y = c.from === "any" ? "Any state" : c.from.map((p) => ye(t.states.find((w) => w.id === p))).join(", "), b = ye(t.states.find((p) => p.id === c.to));
    return { title: m, details: [Xe(c), He(y, b), ...c.auto ? ["Runs automatically."] : []] };
  } else c ? x = Xe(c) : d ? x = Xe(d) : l === "initial" ? x = He(ye(a?.states.find((y) => y.id === a.initial)), ye(t?.states.find((y) => y.id === t.initial))) : l === "name" && (x = He(a?.name || "Untitled workflow", t?.name || "Untitled workflow"));
  return { title: m, details: x ? [x] : [] };
}
function Vm(e, a, t, l) {
  const { code: o, what: r, detail: v } = e;
  if (o === "schema" || r === "visibility.remove")
    return r === "policy" ? { title: "Board limits and defaults", details: km(a, t) } : r.startsWith("visibility") ? { title: "Who can see items", details: wm(a, t, l) } : r === "key_prefix" ? { title: "Item key prefix", details: [He(a.key_prefix ?? "Default", t.key_prefix ?? "Default")] } : { title: { plugins: "Board plugins changed", scopes: "Saved query filters changed", "rollup.recompute": "Calculated totals will update" }[r] ?? "Board settings changed", details: [] };
  if (o.startsWith("process ")) {
    const c = o.slice(8);
    return $m(e, a.processes?.find((x) => x.id === c), t.processes?.find((x) => x.id === c));
  }
  if (o.startsWith("item_type ")) {
    const c = o.slice(10), x = a.item_types?.find((p) => p.id === c), y = t.item_types?.find((p) => p.id === c);
    return { title: `${y?.title || x?.title || "Item type"} · ${ka[r] ?? "Item type changed"}`, details: r === "title" ? [He(x?.title || "Untitled item type", y?.title || "Untitled item type")] : [] };
  }
  if (o.startsWith("relation ")) {
    const c = o.slice(9), x = a.relation_types?.find((p) => p.id === c), y = t.relation_types?.find((p) => p.id === c), b = r === "label" ? [He([x?.outward, x?.inward].filter(Boolean).join(" / "), [y?.outward, y?.inward].filter(Boolean).join(" / "))] : [];
    return { title: `${y?.outward || x?.outward || "Link type"} · ${ka[r] ?? "Link type changed"}`, details: b };
  }
  const m = t.fields?.find((c) => c.code === o), g = a.fields?.find((c) => m?.id !== void 0 ? c.id === m.id : c.code === (r.startsWith("renamed from ") ? r.slice(13) : o)), i = m ?? g;
  if (!i) return { title: ka[r] ?? "Board settings changed", details: [] };
  const d = `${et(i)} · ${r.startsWith("renamed from ") ? "Field key" : ka[r] ?? "Field settings changed"}`;
  if (r.startsWith("options.")) {
    const c = g?.options ?? [], x = m?.options ?? [], y = c.findIndex((S) => S.id === v), b = x.findIndex((S) => S.id === v), p = c[y], w = x[b], V = w?.label || p?.label || "Untitled choice", $ = p && w && p.label !== w.label ? [] : [V];
    if (p && w) {
      p.label !== w.label && $.push(He(p.label || "Untitled choice", w.label || "Untitled choice")), p.category !== w.category && $.push(`Category · ${He(p.category ? Lt(p.category) : "None", w.category ? Lt(w.category) : "None")}`);
      const S = p.order ?? y + 1, D = w.order ?? b + 1;
      S !== D && $.push(`Order · ${He(S, D)}`), p.color !== w.color && $.push(`Color · ${He(p.color ?? "Default", w.color ?? "Default")}`);
    }
    return { title: d, details: $ };
  }
  return r === "title" && g && m ? { title: d, details: [He(et(g), et(m))] } : { title: d, details: [] };
}
const xm = {
  key: 0,
  class: "work-settings-card work-schema-plan work-stack",
  "aria-label": "Schema review"
}, Cm = { key: 0 }, Sm = { class: "work-row work-wrap" }, Tm = { class: "work-muted" }, Im = {
  key: 0,
  class: "work-stack work-tight",
  "aria-label": "Plugin configuration"
}, Dm = {
  key: 1,
  class: "work-notice"
}, Um = {
  key: 2,
  class: "work-notice"
}, Em = {
  key: 3,
  class: "work-stack work-tight",
  "aria-label": "Reviewed Flow bindings"
}, Am = { key: 4 }, Om = {
  key: 5,
  class: "work-settings-table"
}, Pm = { key: 0 }, Rm = /* @__PURE__ */ Te({
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
    plugins: {},
    pluginConfigs: {}
  },
  setup(e) {
    const a = e, t = {}, l = L(() => a.original ?? t), o = L(() => a.declaration ?? t), r = L(() => (a.plugins ?? []).flatMap((S) => {
      if (!S.config_schema) return [];
      const D = a.pluginConfigs?.[S.plugin], z = !l.value.plugins?.some((J) => J.use === S.plugin) && o.value.plugins?.some((J) => J.use === S.plugin);
      if (!D && !z) return [];
      const le = Xa(S.config_schema).map((J) => {
        const ce = D?.[J.key];
        return S.plugin === "kickside.work.planning:plugin" && J.key === "issue_types" ? { title: "Plan these item types", value: (Array.isArray(ce) ? ce.map((be) => o.value.item_types?.find((he) => he.id === be)?.title || Me(be)) : []).join(", ") || "Uses default" } : ce === void 0 ? { title: J.title, value: "Uses default" } : J.schema.writeOnly || J.schema.format === "password" || typeof ce == "object" ? { title: J.title, value: "Set" } : { title: J.title, value: typeof ce == "boolean" ? ce ? "On" : "Off" : String(ce) };
      });
      return le.length ? [{ id: S.plugin, title: S.title || S.plugin, fields: le }] : [];
    })), v = L(() => (o.value.processes ?? []).flatMap((S) => S.states.flatMap((D) => {
      const z = D.run?.flow_ref;
      return z ? [{ key: S.id + ":" + D.id, process: S.name || "Untitled process", state: ye(D), reference: z }] : [];
    }))), m = B(/* @__PURE__ */ new Map());
    De(v, async (S, D, z) => {
      const le = /* @__PURE__ */ new Map();
      m.value = le;
      let J = !0;
      z(() => J = !1), await Promise.all([...new Set(S.map((ce) => ce.reference.id))].map(async (ce) => {
        try {
          const me = (await Bl.title(ce))?.trim();
          J && me && !Pi(me) && m.value.set(ce, me);
        } catch {
          J && m.value.set(ce, "Flow title unavailable");
        }
      }));
    }, { immediate: !0 });
    const g = L(() => [l.value, o.value].flatMap((S) => (S.visibility?.levels ?? []).flatMap((D) => D.holders.flatMap((z) => "group" in z ? [{ kind: "group", id: z.group }] : "user" in z ? [{ kind: "user", id: z.user }] : [])))), i = Fo(() => a.boardId ?? "", g);
    function d(S) {
      if ("user" in S) return i.label({ kind: "user", id: S.user });
      if ("group" in S) return i.label({ kind: "group", id: S.group });
      if ("field" in S) {
        const D = o.value.fields?.find((z) => z.code === S.field) ?? l.value.fields?.find((z) => z.code === S.field);
        return D ? et(D) : "People from a field";
      }
      return "Service";
    }
    const c = (S) => S.map((D) => {
      const z = Vm(D, l.value, o.value, d);
      if (D.what === "plugins") {
        const le = new Set(l.value.plugins?.map((ce) => ce.use)), J = new Set(o.value.plugins?.map((ce) => ce.use));
        for (const ce of a.plugins ?? [])
          le.has(ce.plugin) !== J.has(ce.plugin) && z.details.push((J.has(ce.plugin) ? "Enable " : "Turn off ") + (ce.title || "an available plugin"));
      }
      if (D.what === "plugin.config") {
        const le = a.plugins?.find((J) => J.plugin === D.code);
        return { change: D, title: (le?.title || "Plugin") + " settings changed", details: [] };
      }
      return { change: D, ...z };
    }), x = L(() => c(a.plan?.changes.filter((S) => S.class !== "refused") ?? [])), y = L(() => c(a.plan?.refused ?? [])), b = L(() => {
      const S = a.plan?.migration;
      return !S || !y.value.length ? S : y.value.every((D) => D.change.what === "options.remove") ? "Add a new field with the choices you want to keep. Copy existing values into it before removing the old field." : y.value.every((D) => D.change.what === "state.remove") ? "Choose where existing items should move before removing their state." : S;
    }), p = {
      unchanged: ["No changes", "secondary"],
      cosmetic: ["Labels or settings", "secondary"],
      additive: ["New definitions", "success"],
      semantic: ["Affects existing items", "warn"],
      refused: ["Blocked", "danger"],
      initial: ["First setup", "secondary"]
    }, w = (S) => p[S]?.[0] ?? "Review needed", V = (S) => p[S]?.[1] ?? "secondary";
    function $(S) {
      const { detail: D, ...z } = S;
      return ll(S.what === "invalid" || S.what.startsWith("views.") || S.what.startsWith("automation") ? S : z);
    }
    return (S, D) => e.plan ? (n(), f("section", xm, [
      !e.plan.changes.length && !e.plan.refused.length && !e.configCount && !e.packReview ? (n(), f("p", Cm, "No changes to apply.")) : (n(), f(te, { key: 1 }, [
        s("header", Sm, [
          D[0] || (D[0] = s("h3", null, "Impact on this board", -1)),
          k(u(tt), {
            class: "kx-tag-sm",
            severity: V(e.plan.class)
          }, {
            default: q(() => [
              W(T(w(e.plan.class)), 1)
            ]),
            _: 1
          }, 8, ["severity"])
        ]),
        s("p", Tm, T(u(Ri)[e.plan.class] || "Review the changes below."), 1),
        r.value.length ? (n(), f("section", Im, [
          D[1] || (D[1] = s("h3", null, "Plugin configuration", -1)),
          (n(!0), f(te, null, fe(r.value, (z) => (n(), f("div", {
            key: z.id
          }, [
            s("strong", null, T(z.title), 1),
            (n(!0), f(te, null, fe(z.fields, (le) => (n(), f("p", {
              key: le.title
            }, T(le.title) + " · " + T(le.value), 1))), 128))
          ]))), 128))
        ])) : C("", !0),
        b.value ? (n(), f("p", Dm, T(b.value), 1)) : e.follows.length ? (n(), f("p", Um, "Existing items in " + T(e.follows.join(", ")) + " will follow the updated workflow.", 1)) : C("", !0),
        v.value.length ? (n(), f("section", Em, [
          D[2] || (D[2] = s("h3", null, "Flow bindings", -1)),
          (n(!0), f(te, null, fe(v.value, (z) => (n(), f("p", {
            key: z.key
          }, [
            W(T(z.process) + " / " + T(z.state) + " · ", 1),
            s("strong", null, T(m.value.get(z.reference.id) ?? "Published Flow") + " · v" + T(z.reference.version), 1)
          ]))), 128)),
          D[3] || (D[3] = s("p", { class: "work-muted work-small" }, "New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.", -1))
        ])) : C("", !0),
        Ye(S.$slots, "default"),
        y.value.length ? (n(), f("h3", Am, "Blocked changes")) : C("", !0),
        (n(!0), f(te, null, fe(y.value, (z, le) => (n(), H(u(Bo), {
          key: le,
          severity: "error",
          role: "alert"
        }, {
          default: q(() => [
            s("strong", null, T(z.title), 1),
            (n(!0), f(te, null, fe(z.details, (J, ce) => (n(), f("p", { key: ce }, T(J), 1))), 128)),
            s("p", null, T($(z.change)), 1),
            k(qe, {
              class: "work-small",
              label: "Technical details"
            }, {
              default: q(() => [
                s("code", null, T(z.change.what), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          _: 2
        }, 1024))), 128)),
        x.value.length ? (n(), f("table", Om, [
          D[4] || (D[4] = s("thead", null, [
            s("tr", null, [
              s("th", { scope: "col" }, "Change"),
              s("th", { scope: "col" }, "Impact")
            ])
          ], -1)),
          s("tbody", null, [
            (n(!0), f(te, null, fe(x.value, (z, le) => (n(), f("tr", { key: le }, [
              s("td", null, [
                s("strong", null, T(z.title), 1),
                (n(!0), f(te, null, fe(z.details, (J, ce) => (n(), f("p", { key: ce }, T(J), 1))), 128)),
                z.change.count ? (n(), f("p", Pm, T(z.change.count) + " " + T(z.change.count === 1 ? "item" : "items"), 1)) : C("", !0)
              ]),
              s("td", null, [
                k(u(tt), {
                  class: "kx-tag-sm",
                  severity: V(z.change.class)
                }, {
                  default: q(() => [
                    W(T(w(z.change.class)), 1)
                  ]),
                  _: 2
                }, 1032, ["severity"])
              ])
            ]))), 128))
          ])
        ])) : C("", !0)
      ], 64))
    ])) : C("", !0);
  }
}), Nm = {
  class: "work-stack work-tight",
  "aria-label": "Pack resources"
}, Mm = {
  key: 0,
  class: "work-muted work-small"
}, Fm = {
  key: 0,
  class: "work-stack",
  "aria-label": "Pack conflicts"
}, Lm = { class: "work-stack work-tight work-pack-review-field" }, Bm = { class: "work-config-fields" }, zm = { class: "work-json-example" }, jm = { class: "work-json-example" }, qm = {
  key: 1,
  class: "work-stack",
  "aria-label": "Pack state maps"
}, Wm = /* @__PURE__ */ Te({
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
    const t = e, l = a, o = L(() => [
      { label: "Saved views", entries: t.plan.views?.map((d) => ({ id: d.id, name: d.title || d.id })) },
      { label: "Automations", entries: t.plan.automations?.map((d) => ({ id: d.id, name: d.id })) },
      { label: "Traits", entries: t.plan.traits?.map((d) => ({ id: d, name: d })) },
      { label: "Required plugins", entries: t.plan.plugins?.map((d) => ({ id: d, name: t.plugins?.find((c) => c.plugin === d)?.title || d })) }
    ].filter((d) => d.entries?.length));
    function r(d) {
      return t.original.processes?.find((c) => c.id === d)?.name || Me(d);
    }
    function v(d) {
      const [c, ...x] = d.split("."), y = x.join(".");
      return c === "processes" ? r(y) : c === "fields" ? t.original.fields?.find((b) => b.code === y)?.title || Me(y) : c === "item_types" ? t.original.item_types?.find((b) => b.id === y)?.title || Me(y) : Me(c);
    }
    function m(d) {
      return JSON.stringify(d ?? null, null, 2);
    }
    function g(d, c) {
      (t.request.resolutions ??= {})[d] = c, l("change");
    }
    function i(d, c, x) {
      ((t.request.maps ??= {})[d] ??= {})[c] = x, l("change");
    }
    return (d, c) => (n(), f(te, null, [
      s("section", Nm, [
        c[1] || (c[1] = s("h3", null, "Pack resources", -1)),
        s("p", null, [
          c[0] || (c[0] = W("Target version ", -1)),
          s("strong", null, T(e.plan.version), 1)
        ]),
        o.value.length ? (n(), f("p", Mm, "Resources included in this plan.")) : C("", !0),
        (n(!0), f(te, null, fe(o.value, (x) => (n(), f("div", {
          key: x.label
        }, [
          s("h4", null, T(x.label), 1),
          s("ul", null, [
            (n(!0), f(te, null, fe(x.entries, (y) => (n(), f("li", {
              key: y.id
            }, T(y.name), 1))), 128))
          ])
        ]))), 128))
      ]),
      e.plan.conflicts.length ? (n(), f("section", Fm, [
        c[4] || (c[4] = s("h3", null, "Local edits conflict", -1)),
        c[5] || (c[5] = s("p", { class: "work-muted work-small" }, "Choose which declaration to keep for each conflict, then review again.", -1)),
        (n(!0), f(te, null, fe(e.plan.conflicts, (x) => (n(), f("div", {
          key: x.path,
          class: "work-stack work-tight"
        }, [
          s("label", Lm, [
            W(T(v(x.path)), 1),
            k(u(ge), {
              "model-value": e.request.resolutions?.[x.path],
              "aria-label": "Resolution for " + v(x.path),
              disabled: e.disabled,
              appendTo: "self",
              placeholder: "Choose a resolution",
              optionLabel: "label",
              optionValue: "value",
              options: [{ label: "Keep local edits", value: "local" }, { label: "Use pack changes", value: "incoming" }],
              "onUpdate:modelValue": (y) => g(x.path, y)
            }, null, 8, ["model-value", "aria-label", "disabled", "onUpdate:modelValue"])
          ]),
          k(qe, {
            class: "work-json-disclosure",
            label: "Compare declarations"
          }, {
            default: q(() => [
              s("div", Bm, [
                s("section", null, [
                  c[2] || (c[2] = s("h4", null, "Local edits", -1)),
                  s("pre", zm, T(m(x.local_value)), 1)
                ]),
                s("section", null, [
                  c[3] || (c[3] = s("h4", null, "Pack changes", -1)),
                  s("pre", jm, T(m(x.incoming)), 1)
                ])
              ])
            ]),
            _: 2
          }, 1024)
        ]))), 128))
      ])) : C("", !0),
      Object.keys(e.plan.maps).length ? (n(), f("section", qm, [
        c[6] || (c[6] = s("h3", null, "Required state maps", -1)),
        c[7] || (c[7] = s("p", { class: "work-muted work-small" }, "Review the proposed destinations for existing items. Each destination is editable.", -1)),
        (n(!0), f(te, null, fe(e.plan.maps, (x, y) => (n(), f("div", {
          key: y,
          class: "work-stack"
        }, [
          s("h4", null, T(r(y)), 1),
          (n(!0), f(te, null, fe(x, (b, p) => (n(), f("label", {
            key: p,
            class: "work-stack work-tight work-pack-review-field"
          }, [
            W("Move items from " + T(u(ye)(e.original.processes?.find((w) => w.id === y)?.states.find((w) => w.id === p))), 1),
            k(u(ge), {
              "model-value": e.request.maps?.[y]?.[p],
              "aria-label": "Move items from " + u(ye)(e.original.processes?.find((w) => w.id === y)?.states.find((w) => w.id === p)),
              disabled: e.disabled,
              appendTo: "self",
              optionLabel: "label",
              optionValue: "value",
              options: e.plan.declaration.processes?.find((w) => w.id === y)?.states.map((w) => ({ label: u(ye)(w), value: w.id })) ?? [],
              "onUpdate:modelValue": (w) => i(y, p, w)
            }, null, 8, ["model-value", "aria-label", "disabled", "options", "onUpdate:modelValue"])
          ]))), 128))
        ]))), 128))
      ])) : C("", !0)
    ], 64));
  }
});
function Gm(e) {
  const { schema: a, configs: t, busy: l } = e, { packs: o, loading: r, error: v, load: m, reset: g } = Ni(), i = L(() => o.value.filter(Mi)), d = L(() => o.value.map(Fi)), c = B(!1), x = B(""), y = L(() => d.value.find((ee) => ee.id === x.value && !ee.disabled)), b = B(), p = B(), w = B(), V = B(!1), $ = B(""), S = B(), D = B(""), z = L(() => S.value?.result), le = L(() => !!z.value && z.value.status !== "done"), J = L(() => !!b.value || e.schemaDirty()), ce = L(() => !l.value && !J.value && !e.migrationPending() && !le.value), me = L(() => V.value ? p.value : void 0), be = L(() => !!me.value && !!w.value && JSON.stringify(w.value.request) === JSON.stringify(b.value)), he = L(() => e.canReview() && !e.migrationPending() && !l.value && be.value && me.value?.class !== "refused" && !me.value?.refused.length && p.value?.conflicts.every((ee) => !!b.value?.resolutions?.[ee.path])), se = L(() => i.value.find((ee) => ee.id === b.value?.pack)?.plugins.filter((ee) => !a.value?.plugins?.some((I) => I.plugin === ee.plugin && I.active)).map((ee) => ({ use: ee.plugin })) ?? []), O = L(() => i.value.find((ee) => ee.id === a.value?.pack?.id)?.title || "Installed pack"), Q = L(() => i.value.find((ee) => ee.id === a.value?.pack?.id)), M = L(() => !v.value && !!a.value?.outdated && d.value.some((ee) => ee.id === a.value?.pack?.id && !ee.disabled)), ne = L(() => v.value ? "Reload packs to check available upgrades." : le.value ? "Finish the current pack installation before upgrading." : M.value ? J.value ? "Discard the current draft before upgrading." : e.migrationPending() ? "Finish the current migration before upgrading." : l.value ? "Wait for the current request to finish." : void 0 : "Install an available version of this pack to upgrade."), xe = sa();
  function Oe() {
    w.value = void 0;
  }
  function K() {
    xe(), Oe(), V.value = !1;
  }
  function j() {
    b.value = void 0, p.value = void 0, K();
  }
  function N() {
    j(), g(), S.value = void 0, D.value = "";
  }
  function ve() {
    $.value = "";
  }
  De(t, (ee) => {
    b.value && (Object.keys(ee).length ? b.value.plugin_configs = oa(ee) : delete b.value.plugin_configs);
  }, { deep: !0, flush: "sync" });
  async function h() {
    if (!b.value || l.value || !e.canReview()) return;
    const ee = xe(), I = oa(b.value), Z = JSON.stringify(b.value);
    l.value = !0, ve(), e.clearSaved();
    try {
      const A = await Li(I, (oe) => Jt.packPlan(e.boardId(), oe));
      if (!ee() || Z !== JSON.stringify(b.value)) return;
      p.value = A.plan, V.value = !0, b.value = A.request, w.value = { request: oa(A.request), key: crypto.randomUUID() };
    } catch (A) {
      ee() && (Oe(), $.value = vt(A, "Could not review the pack."));
    } finally {
      l.value = !1;
    }
  }
  async function U() {
    if (!a.value?.pack || !ce.value || !M.value) return;
    const ee = i.value.find((I) => I.id === a.value?.pack?.id);
    ee && (b.value = ro(ee, a.value.generation), e.openReview(), await h());
  }
  async function R() {
    const ee = i.value.find((I) => I.id === x.value);
    !a.value || !ee || !y.value || !ce.value || r.value || (b.value = ro(ee, a.value.generation), c.value = !1, e.openReview(), await h());
  }
  async function E(ee, I, Z) {
    const A = e.boardId(), oe = await Jt.packApply(A, ee, I);
    e.boardId() === A && (S.value = { request: ee, key: I, result: oe, draft: Z }, await e.applied(oe.generation, Z));
  }
  async function G() {
    if (!he.value || !w.value) return !1;
    l.value = !0, ve();
    try {
      return await E(oa(w.value.request), w.value.key, e.draftSnapshot()), !0;
    } catch (ee) {
      return $.value = vt(ee, "Could not apply the pack upgrade."), !1;
    } finally {
      l.value = !1;
    }
  }
  async function re() {
    const ee = S.value;
    if (!(!ee || !le.value || l.value || !e.authorized())) {
      l.value = !0, D.value = "";
      try {
        await E(ee.request, ee.key, ee.draft);
      } catch (I) {
        D.value = vt(I, "Could not continue the pack installation.");
      } finally {
        l.value = !1;
      }
    }
  }
  return {
    choices: d,
    loading: r,
    error: v,
    load: m,
    installing: c,
    installPack: x,
    installChoice: y,
    canManage: ce,
    title: O,
    installed: Q,
    upgradeAvailable: M,
    upgradeReason: ne,
    request: b,
    preview: p,
    plan: me,
    reviewError: $,
    isReviewed: be,
    canApply: he,
    plugins: se,
    result: z,
    inProgress: le,
    operationError: D,
    install: R,
    upgrade: U,
    review: h,
    apply: G,
    continueInstallation: re,
    changed: Oe,
    invalidate: K,
    clearReviewError: ve,
    clear: j,
    reset: N
  };
}
const Km = { class: "work-section-layout" }, Hm = { class: "kx-main" }, Ym = ["aria-label"], Xm = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Jm = { role: "alert" }, Zm = {
  key: 2,
  class: "work-notice",
  role: "status"
}, Qm = {
  key: 3,
  class: "kx-loading",
  role: "status"
}, _m = {
  key: 4,
  class: "work-notice",
  role: "alert"
}, ep = {
  key: 5,
  class: "work-settings-body"
}, tp = {
  key: 0,
  class: "work-notice work-stack work-tight",
  "aria-label": "Pack installation"
}, ap = {
  key: 0,
  role: "status"
}, lp = {
  key: 1,
  role: "status"
}, op = { class: "work-small" }, ip = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, np = { key: 3 }, sp = {
  key: 1,
  class: "work-notice",
  role: "alert"
}, rp = {
  key: 2,
  class: "work-notice"
}, dp = ["id"], up = ["disabled", "inert"], cp = {
  key: 3,
  class: "work-ia-section"
}, vp = {
  key: 0,
  class: "work-muted"
}, fp = {
  key: 5,
  class: "work-ia-section"
}, mp = { class: "work-review-layout" }, pp = { class: "work-muted" }, gp = ["aria-busy"], bp = {
  key: 0,
  role: "status"
}, hp = {
  key: 1,
  role: "alert",
  class: "kx-err"
}, yp = {
  key: 2,
  role: "alert"
}, kp = { key: 6 }, wp = { class: "work-dialog-actions" }, $p = {
  key: 3,
  class: "work-muted",
  role: "status"
}, Vp = {
  key: 0,
  class: "work-muted",
  role: "status"
}, xp = {
  key: 1,
  class: "kx-err work-alert-actions"
}, Cp = { role: "alert" }, Sp = {
  key: 2,
  class: "work-stack work-tight"
}, Tp = {
  key: 0,
  class: "work-pack-unavailable work-block"
}, Ip = {
  key: 3,
  class: "work-muted"
}, Dp = { class: "work-dialog-actions" }, Up = /* @__PURE__ */ Te({
  __name: "BoardSettings",
  props: {
    boardId: {},
    embedded: { type: Boolean },
    focusBack: { type: Boolean },
    route: {}
  },
  emits: ["dirty-change", "navigate"],
  setup(e, { emit: a }) {
    const t = e, l = a, o = _i(), r = wt(), v = B();
    let m, g = "";
    const i = () => JSON.stringify([st.value, j.value, ue.request, [...de.value]]), d = L(() => ({
      value: "all-boards",
      label: t.embedded ? "All boards" : "Back to board",
      icon: t.embedded ? "tabler:table" : "tabler:layout-kanban"
    })), c = B();
    De(c, (X) => {
      t.focusBack && X?.$el.querySelector(".kx-settings-rail-item")?.focus();
    }, { flush: "post", once: !0 });
    const x = [
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
    ], y = B("General"), b = {
      General: "general",
      "Item types": "items",
      Fields: "fields",
      Links: "links",
      Workflow: "workflow",
      Access: "access",
      Plugins: "plugins"
    }, p = B("");
    function w(X, F = "") {
      y.value = X, p.value = F ? b[X] + "/" + F : "";
    }
    function V(X, F = "") {
      w(X, F), t.route !== void 0 && l("navigate", [b[X], ...F ? [encodeURIComponent(F)] : []].join("/"));
    }
    function $(X, F, _) {
      if (t.route === void 0 || b[y.value] !== X || !_ && p.value !== X + "/" + F) return;
      const Ie = ne.value?.declaration;
      (X === "items" ? Ie?.item_types?.some((Ne) => Ne.id === F) : X === "fields" ? Ie?.fields?.some((Ne) => Ne.code === F) : X === "links" ? Ie?.relation_types?.some((Ne) => Ne.id === F) : X === "plugins" ? N.value?.schema_options.plugins.some((Ne) => Ne.plugin === F) : X === "workflow" && Ie?.processes?.some((Ne) => Ne.states.some((Fe) => Ne.id + ".state." + Fe.id === F) || Ne.transitions?.some((Fe) => Ne.id + ".transition." + Fe.id === F))) && V(y.value, _ ? F : "");
    }
    Oo(ol, { selected: p, choose: $ });
    function S(X) {
      if (X === d.value.value) {
        gi();
        return;
      }
      (X === "General" || x.some((F) => F.items.some((_) => _.value === X))) && V(X);
    }
    async function D() {
      V("Access"), await yt(), v.value?.focus();
    }
    const z = {
      General: "Manage the board name, item key prefix and app.",
      "Item types": "Choose the fields, parent relationships and workflow for each kind of work.",
      Fields: "Choose what information people can capture on items.",
      Links: "Configure link types and how they appear on related items.",
      Workflow: "Select a state or transition to edit how work moves.",
      Access: "Who can use this board?",
      Plugins: "Choose which plugins this board uses."
    }, le = B(""), J = B();
    function ce(X, F, _) {
      _.currentTarget instanceof HTMLElement && (J.value = { section: X, type: F, opener: _.currentTarget }, X === "Fields" && (le.value = F.id), V(X));
    }
    function me(X) {
      const F = J.value;
      if (!F) return;
      X !== void 0 && (F.type.process = X);
      const _ = F.type.id, Ie = ne.value?.declaration.item_types?.some((Qe) => Qe.id === _);
      V("Item types", Ie ? _ : ""), J.value = void 0, F.section === "Fields" && yt(() => F.opener.focus());
    }
    const be = B(!1), he = B(""), se = B();
    De(y, (X) => {
      v.value?.scrollTo({ top: 0 }), J.value && X !== J.value.section && (J.value = void 0);
    });
    function O() {
      be.value = !1, he.value = "", ue.clearReviewError(), Ra.value = !1;
    }
    async function Q(X) {
      rl.value && (Je.value.size && (y.value !== "Plugins" && (V("Plugins"), await yt()), Re.value && !await Re.value.reportValidity()) || !vi() || de.value.size || (se.value = X, be.value = !0, cl()));
    }
    const M = B(/* @__PURE__ */ new Set(["General"]));
    De(y, (X) => M.value.add(X));
    const ne = B(), xe = B(), Oe = B(), K = B({}), j = B({}), N = B(), ve = B(!1), h = B(!0), U = B(!1), R = B(""), E = B(""), G = L(() => K.value.processes ?? []), re = L(() => ve.value && ne.value ? [
      { heading: Oe.value?.title || "Board settings", items: [{ value: "General", label: "General", icon: "tabler:settings" }] },
      ...x
    ] : []), ee = B(), I = B(!1), Z = sa();
    async function A(X) {
      const F = Z();
      I.value = !1;
      try {
        const _ = await Rt.stateCounts(X);
        F() && (ee.value = _);
      } catch {
        F() && (I.value = !0, ee.value = void 0);
      }
    }
    De(y, (X) => {
      ve.value && X === "Workflow" && A(t.boardId);
    });
    const oe = B(), Ve = B(), Pe = B(""), P = B([]), Y = B(!1), ke = B(0), de = B(/* @__PURE__ */ new Set()), We = B(), Re = B(), Je = B(/* @__PURE__ */ new Set()), ua = L(() => [...de.value].some((X) => !Je.value.has(X)));
    function ca(X, F) {
      const _ = "plugin:" + X;
      F ? Je.value.delete(_) : Je.value.add(_);
    }
    const Et = sa(), Bt = sa(), st = L(() => ml(K.value, ne.value?.declaration ?? {})), zt = L(() => de.value.size > 0 || Je.value.size > 0 || !!ne.value && (JSON.stringify(st.value) !== JSON.stringify(ml(ne.value.declaration, ne.value.declaration)) || Object.keys(j.value).length > 0)), Vt = L(() => !!xe.value?.migration_error || Oe.value?.status === "migrating"), Ce = L(() => !!ne.value && !!xe.value && ne.value.generation !== xe.value.generation), At = () => ve.value && !Ce.value && !de.value.size && !Je.value.size, ue = $i(Gm({
      boardId: () => t.boardId,
      schema: ne,
      configs: j,
      busy: U,
      schemaDirty: () => zt.value,
      migrationPending: () => Vt.value,
      canReview: At,
      authorized: () => ve.value,
      draftSnapshot: i,
      openReview: () => {
        se.value = void 0, be.value = !0;
      },
      clearSaved: () => {
        E.value = "";
      },
      applied: mi
    })), ri = L(() => {
      const X = ne.value?.pack;
      if (X)
        return {
          id: X.id,
          version: X.version,
          title: ue.title,
          description: ue.installed?.description,
          requires: ue.installed?.requires ?? [],
          outdated: ne.value?.outdated,
          canUpgrade: ue.upgradeAvailable && ue.canManage,
          upgradeReason: ue.upgradeReason
        };
    }), jt = L(() => ue.request ? ue.plan : oe.value), nl = L(() => ue.request ? ue.reviewError : he.value), sl = L(() => [...P.value, ...jt.value?.refused ?? []]), Pa = L(() => !!ue.request || zt.value), rl = L(() => Pa.value && !(ue.inProgress && ue.request)), dl = B(!1), to = L(() => Pa.value || dl.value);
    De(to, (X) => l("dirty-change", X), { immediate: !0, flush: "sync" });
    const di = L(() => (!va.value.renamed.length || Ra.value) && At() && !U.value && !Y.value && !Vt.value && oe.value && (oe.value.changes.length > 0 || Object.keys(j.value).length > 0) && oe.value.class !== "refused" && !oe.value.refused.length && Ve.value?.matches(st.value, ne.value?.generation ?? -1, j.value)), ao = L(() => ue.request ? ue.canApply : di.value), lo = L(() => ue.request ? ue.isReviewed : !!oe.value), Ra = B(!1), va = L(() => {
      const X = ne.value?.declaration, F = [], _ = [];
      for (const Ie of G.value) {
        const Qe = X?.item_types?.filter((Fe) => Fe.process === Ie.id) ?? [], Ne = X?.processes?.find((Fe) => Fe.id === Ie.id);
        for (const Fe of Ne?.states ?? []) {
          const Ma = Ie.states.find((qt) => qt.id === Fe.id);
          if (Ma && Ma.name === Fe.name) continue;
          const fl = [...jt.value?.refused ?? [], ...jt.value?.changes ?? []].find((qt) => qt.code === "process " + Ie.id && qt.detail === Fe.id && ["state.remove", "state.map"].includes(qt.what))?.count ?? Qe.reduce((qt, hi) => qt + (ee.value?.[hi.id]?.[Fe.id] ?? 0), 0);
          fl && (Ma ? _.push({ process: Ie, state: Fe, name: ye(Ma), count: fl }) : F.push({ process: Ie, state: Fe, count: fl }));
        }
      }
      return { removed: F, renamed: _ };
    });
    function ui(X, F, _) {
      X.map = { ...X.map, [F]: _ }, cl();
    }
    const oo = L(() => ue.preview?.declaration ?? Ve.value?.declaration), ci = L(() => {
      const X = oo.value;
      return !jt.value || !X ? [] : Bi(jt.value, X).map((F) => X.processes?.find((_) => _.id === F)?.name || "Untitled process");
    });
    function xt() {
      P.value = [], Bt(), oe.value = void 0, Ve.value = void 0, Pe.value = "", ue.invalidate();
    }
    De([st, j], xt, { deep: !0, flush: "sync" }), De(Pa, (X) => {
      X && (E.value = "");
    });
    function fa(X, F) {
      F ? de.value.delete(X) : de.value.add(X), xt();
    }
    function ul(X) {
      ue.clear(), J.value = void 0, ke.value++, ne.value = X, K.value = oa(X.declaration), j.value = {}, de.value.clear(), Je.value.clear(), xt();
    }
    async function pt(X = !1) {
      const F = Et();
      try {
        const [_, Ie, Qe] = await Promise.all([Rt.schema(t.boardId, void 0, !0).catch((Fe) => {
          if (Fe instanceof Dl && Fe.details?.code === "board_schema_missing") return { generation: 0, declaration: {}, compiled: {}, key_prefix: "", as_of: 0 };
          throw Fe;
        }), Rt.options(t.boardId), Rt.boards()]);
        if (!F()) return;
        if (ve.value = Ie.access.admin, N.value = Ie, Oe.value = Qe.find((Fe) => Fe.board_id === t.boardId), !ve.value) {
          ne.value = void 0, K.value = {}, xt();
          return;
        }
        R.value = "";
        const Ne = zi(_);
        xe.value = Ne, m !== void 0 && Ne.generation >= m ? (m = void 0, g === i() && ul(Ne), g = "") : (X || !ne.value || !Pa.value && Ne.generation !== ne.value.generation) && ul(Ne), Ce.value && xt(), await ue.load(F), F() && y.value === "Workflow" && A(t.boardId);
      } catch (_) {
        if (!F()) return;
        _ instanceof Dl && (_.status === 403 || _.kind?.toLowerCase() === "permission_denied") && (ve.value = !1), xt(), R.value = vt(_, "Could not load board settings.");
      } finally {
        F() && (h.value = !1);
      }
    }
    function vi() {
      for (const X of Array.from(We.value?.elements ?? []))
        if ((X instanceof HTMLInputElement || X instanceof HTMLSelectElement || X instanceof HTMLTextAreaElement) && !(X.form !== We.value || X.closest('[style*="display: none"]:not(.p-accordioncontent)')) && !X.reportValidity()) {
          const _ = X.closest('.p-accordioncontent[style*="display: none"]')?.closest(".kx-disclosure")?.querySelector('.kx-disclosure-toggle[aria-expanded="false"]');
          return _ && (_.click(), yt(() => X.reportValidity())), !1;
        }
      return !0;
    }
    async function cl() {
      if (ue.request) return ue.review();
      if (!ne.value || U.value || !At()) return;
      const X = Bt(), F = uo(st.value, ne.value.generation, j.value);
      U.value = !0, he.value = "", E.value = "";
      try {
        const _ = (F.declaration.processes ?? []).some((Qe) => ne.value?.declaration.processes?.find((Ne) => Ne.id === Qe.id)?.states.some((Ne) => Qe.states.some((Fe) => Fe.id === Ne.id && Fe.name !== Ne.name))), [Ie] = await Promise.all([
          Jt.plan(t.boardId, F),
          _ ? A(t.boardId) : void 0
        ]);
        if (_ && I.value) {
          xt(), he.value = "Could not check which items use the renamed states. Check the impact again.";
          return;
        }
        if (!X() || de.value.size || !F.matches(st.value, ne.value.generation, j.value)) return;
        oe.value = Ie, Ve.value = F, Pe.value = crypto.randomUUID(), be.value = !0;
      } catch (_) {
        X() && (xt(), he.value = vt(_, "Could not review changes."), P.value = ji(_, st.value));
      } finally {
        U.value = !1;
      }
    }
    async function fi() {
      if (!ao.value) return;
      if (ue.request) {
        await ue.apply() && O();
        return;
      }
      if (!Ve.value) return;
      U.value = !0, he.value = "", E.value = "";
      const X = i();
      try {
        m = (await Jt.apply(t.boardId, Ve.value, Pe.value)).generation, g = X, await pt(), E.value = "Board changes applied.", O();
      } catch (F) {
        he.value = vt(F, "Could not apply the board changes.");
      } finally {
        U.value = !1;
      }
    }
    async function mi(X, F) {
      F === i() && (m = X, g = F), await pt();
    }
    async function pi() {
      if (!U.value) {
        U.value = !0, R.value = "";
        try {
          const X = await Jt.resume(t.boardId);
          E.value = X.resumed ? "Migration resumes." : "Migration is already running.", await pt();
        } catch (X) {
          R.value = vt(X, "Could not resume migration.");
        } finally {
          U.value = !1;
        }
      }
    }
    async function Na(X, F) {
      if (!ne.value || !ve.value || U.value || Y.value) return "Wait for the current change to finish.";
      if (Ce.value) return "Discard the stale draft before removing a definition.";
      const _ = ne.value.generation, Ie = JSON.stringify(st.value), Qe = oa(K.value);
      Ea(Qe, X, F), Y.value = !0;
      try {
        const Ne = await Jt.plan(t.boardId, uo(ml(Qe, ne.value.declaration), _, j.value));
        if (!ve.value || Ce.value || ne.value.generation !== _ || JSON.stringify(st.value) !== Ie) return "The draft changes during the check. Try the removal again.";
        const Fe = qi(Ne, X, F);
        if (Fe) return Fe;
        if (Ne.class === "refused") return "Resolve the blocked changes in your draft before removing this definition.";
      } catch (Ne) {
        return vt(Ne, "Could not check this removal.");
      } finally {
        Y.value = !1;
      }
    }
    async function gi() {
      if (t.embedded) {
        o({ name: "boards" });
        return;
      }
      to.value && !await Lo.confirm({ header: "Discard changes?", message: "Your unsaved board settings will be discarded.", acceptLabel: "Discard", rejectLabel: "Keep editing" }) || o({ name: "board", board: t.boardId });
    }
    function bi() {
      m = void 0, xe.value && ul(xe.value), E.value = "", R.value = "", O();
    }
    De(() => t.boardId, () => {
      dl.value = !1, m = void 0, ue.reset(), ne.value = void 0, xe.value = void 0, Oe.value = void 0, j.value = {}, de.value.clear(), Je.value.clear(), Z(), ee.value = void 0, le.value = "", J.value = void 0, M.value = /* @__PURE__ */ new Set(["General"]), w("General"), O(), ve.value = !1, h.value = !0, pt(!0);
    }), De([() => t.route, () => t.boardId], ([X]) => {
      if (X === void 0) return;
      const [F, _] = X.split("/"), Ie = Object.keys(b).find((Ne) => b[Ne] === F) ?? "General";
      let Qe = "";
      try {
        _ && (Qe = decodeURIComponent(_));
      } catch {
      }
      Ie === "Fields" && Qe && p.value !== "fields/" + Qe && (le.value = ""), w(Ie, Qe), M.value.add(Ie);
    }, { immediate: !0 });
    let vl = () => {
    };
    return De(() => t.boardId, (X) => {
      vl(), vl = Wi(`component.${X}`, () => {
        pt();
      });
    }, { immediate: !0 }), Vi(pt), ql(() => {
      vl(), Et(), Bt(), Z(), ue.invalidate();
    }), (X, F) => (n(), f("section", {
      class: ft(["work-settings-shell work-ia", { "work-embedded": e.embedded }])
    }, [
      s("div", Km, [
        k(Qi, {
          ref_key: "rail",
          ref: c,
          label: "Board settings sections",
          value: y.value,
          groups: re.value,
          "leading-item": d.value,
          "onUpdate:value": S
        }, null, 8, ["value", "groups", "leading-item"]),
        s("div", Hm, [
          s("div", {
            ref_key: "pane",
            ref: v,
            class: "kx-main-scroll work-settings-content",
            role: "region",
            "aria-label": y.value,
            tabindex: "-1"
          }, [
            ve.value && ne.value ? (n(), H(lf, {
              key: 0,
              title: y.value,
              description: z[y.value]
            }, Ta({ _: 2 }, [
              rl.value || y.value === "Plugins" ? {
                name: "actions",
                fn: q(() => [
                  y.value === "Plugins" ? (n(), H(u(ae), {
                    key: 0,
                    label: "Refresh status",
                    severity: "secondary",
                    outlined: "",
                    disabled: U.value || h.value,
                    onClick: F[0] || (F[0] = (_) => pt())
                  }, {
                    icon: q(() => [
                      k(u(pe), {
                        icon: "tabler:refresh",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : C("", !0),
                  rl.value ? (n(), H(of, {
                    key: 1,
                    busy: U.value,
                    "discard-disabled": Y.value,
                    "review-disabled": Y.value || Vt.value || Ce.value || ua.value,
                    onDiscard: bi,
                    onReview: Q
                  }, null, 8, ["busy", "discard-disabled", "review-disabled"])) : C("", !0)
                ]),
                key: "0"
              } : void 0
            ]), 1032, ["title", "description"])) : C("", !0),
            R.value ? (n(), f("div", Xm, [
              s("p", Jm, T(R.value), 1),
              k(u(ae), {
                label: "Retry",
                severity: "secondary",
                outlined: "",
                onClick: F[1] || (F[1] = (_) => pt())
              })
            ])) : C("", !0),
            E.value ? (n(), f("p", Zm, T(E.value), 1)) : C("", !0),
            h.value ? (n(), f("p", Qm, "Loading board settings…")) : !ve.value && !R.value ? (n(), f("p", _m, "Ask a board administrator to grant you access to these settings.")) : C("", !0),
            ve.value && ne.value ? (n(), f("div", ep, [
              ue.result ? (n(), f("section", tp, [
                ue.inProgress ? (n(), f("p", ap, [
                  F[27] || (F[27] = W("Pack installation status ", -1)),
                  s("strong", null, T(u(Me)(ue.result.status)), 1)
                ])) : (n(), f("p", lp, "Pack applied.")),
                s("p", op, [
                  F[28] || (F[28] = W("Operation ", -1)),
                  s("code", null, T(ue.result.operation_id), 1),
                  F[29] || (F[29] = W(" · Job ", -1)),
                  s("code", null, T(ue.result.job_id), 1)
                ]),
                ue.operationError ? (n(), f("p", ip, T(ue.operationError), 1)) : C("", !0),
                ue.inProgress ? (n(), f("div", np, [
                  k(u(ae), {
                    label: "Continue pack installation",
                    severity: "secondary",
                    outlined: "",
                    loading: U.value,
                    disabled: U.value,
                    onClick: ue.continueInstallation
                  }, null, 8, ["loading", "disabled", "onClick"])
                ])) : C("", !0)
              ])) : C("", !0),
              Ce.value ? (n(), f("p", sp, "Someone saved new settings while you were editing. Discard this draft to load their changes.")) : C("", !0),
              Vt.value ? (n(), f("div", rp, [
                s("p", null, T(xe.value?.migration_error ? "Updating existing items paused." : "Updating existing items…"), 1),
                xe.value?.migration_error ? (n(), H(qe, {
                  key: 0,
                  label: "Technical details"
                }, {
                  default: q(() => [
                    W(T(xe.value.migration_error), 1)
                  ]),
                  _: 1
                })) : C("", !0),
                xe.value?.migration_error ? (n(), H(u(ae), {
                  key: 1,
                  label: "Resume updating items",
                  severity: "secondary",
                  disabled: U.value,
                  outlined: "",
                  onClick: pi
                }, null, 8, ["disabled"])) : C("", !0)
              ])) : C("", !0),
              bt(k(ym, {
                draft: K.value,
                schema: xe.value ?? ne.value,
                board: Oe.value,
                active: y.value === "General",
                "board-apps": N.value?.board_apps,
                "draft-form": u(r),
                disabled: U.value || Y.value,
                "pack-title": ne.value.pack ? ue.title : void 0,
                outdated: ne.value.outdated,
                "upgrade-reason": ue.upgradeReason,
                "can-upgrade": ue.upgradeAvailable && ue.canManage,
                "can-install": ue.canManage,
                "pack-error": ue.error,
                onUpgrade: ue.upgrade,
                onInstall: F[2] || (F[2] = (_) => ue.installing = !0),
                onRetry: F[3] || (F[3] = (_) => ue.load()),
                onDirtyChange: F[4] || (F[4] = (_) => dl.value = _),
                onSaved: F[5] || (F[5] = (_) => pt()),
                onShare: D
              }, null, 8, ["draft", "schema", "board", "active", "board-apps", "draft-form", "disabled", "pack-title", "outdated", "upgrade-reason", "can-upgrade", "can-install", "pack-error", "onUpgrade"]), [
                [Ct, y.value === "General"]
              ]),
              s("form", {
                id: u(r),
                ref_key: "editor",
                ref: We,
                onSubmit: F[19] || (F[19] = Be((_) => Q(), ["prevent"]))
              }, [
                (n(), f("fieldset", {
                  key: ke.value,
                  class: "work-settings-fieldset",
                  disabled: U.value || Y.value,
                  inert: U.value || Y.value || void 0
                }, [
                  M.value.has("Item types") ? bt((n(), H(qr, {
                    key: 0,
                    class: "work-ia-section",
                    draft: K.value,
                    "guard-removal": Na,
                    issues: sl.value,
                    onCreateField: F[6] || (F[6] = (_, Ie) => ce("Fields", _, Ie)),
                    onCreateWorkflow: F[7] || (F[7] = (_, Ie) => ce("Workflow", _, Ie))
                  }, null, 8, ["draft", "issues"])), [
                    [Ct, y.value === "Item types"]
                  ]) : C("", !0),
                  M.value.has("Fields") ? bt((n(), H(Tr, {
                    key: 1,
                    class: "work-ia-section",
                    "board-id": e.boardId,
                    "installed-types": N.value?.installed_types,
                    draft: K.value,
                    "guard-removal": Na,
                    issues: sl.value,
                    "item-type": le.value,
                    "onUpdate:itemType": F[8] || (F[8] = (_) => le.value = _),
                    "create-for-item-type": J.value?.section === "Fields",
                    onCreated: F[9] || (F[9] = (_) => me()),
                    onCancelCreation: F[10] || (F[10] = (_) => me()),
                    onValidity: F[11] || (F[11] = (_, Ie) => fa("fields:" + _, Ie))
                  }, null, 8, ["board-id", "installed-types", "draft", "issues", "item-type", "create-for-item-type"])), [
                    [Ct, y.value === "Fields"]
                  ]) : C("", !0),
                  M.value.has("Links") ? bt((n(), H(lv, {
                    key: 2,
                    class: "work-ia-section",
                    draft: K.value,
                    "guard-removal": Na
                  }, null, 8, ["draft"])), [
                    [Ct, y.value === "Links"]
                  ]) : C("", !0),
                  M.value.has("Workflow") ? bt((n(), f("section", cp, [
                    I.value ? (n(), f("p", vp, [
                      F[30] || (F[30] = W("Item counts are unavailable. ", -1)),
                      k(u(ae), {
                        label: "Reload counts",
                        text: "",
                        onClick: F[12] || (F[12] = (_) => A(e.boardId))
                      })
                    ])) : C("", !0),
                    k(Nc, {
                      "board-id": e.boardId,
                      draft: K.value,
                      "guard-removal": Na,
                      issues: sl.value,
                      counts: ee.value,
                      "count-types": ne.value.declaration.item_types,
                      guards: N.value?.guards,
                      "create-for-item-type": J.value?.section === "Workflow",
                      "creation-opener": J.value?.opener,
                      onCreated: me,
                      onCancelCreation: F[13] || (F[13] = (_) => me()),
                      onValidity: F[14] || (F[14] = (_, Ie) => fa("process:" + _, Ie))
                    }, null, 8, ["board-id", "draft", "issues", "counts", "count-types", "guards", "create-for-item-type", "creation-opener"])
                  ], 512)), [
                    [Ct, y.value === "Workflow"]
                  ]) : C("", !0),
                  M.value.has("Access") ? bt((n(), H(If, {
                    key: 4,
                    active: y.value === "Access",
                    "board-id": e.boardId,
                    draft: K.value,
                    board: Oe.value,
                    busy: U.value,
                    onValidity: F[15] || (F[15] = (_) => fa("visibility", _))
                  }, null, 8, ["active", "board-id", "draft", "board", "busy"])), [
                    [Ct, y.value === "Access"]
                  ]) : C("", !0),
                  M.value.has("Plugins") ? bt((n(), f("section", fp, [
                    k(xo, {
                      ref_key: "pluginEditor",
                      ref: Re,
                      "board-id": e.boardId,
                      draft: K.value,
                      schema: xe.value ?? ne.value,
                      options: N.value?.schema_options.plugins ?? [],
                      filters: N.value?.filters,
                      configs: j.value,
                      disabled: U.value,
                      pack: ri.value,
                      onConfigured: F[16] || (F[16] = (_) => {
                        xt(), pt();
                      }),
                      onRefresh: F[17] || (F[17] = (_) => pt()),
                      onReview: Q,
                      onUpgrade: ue.upgrade,
                      onValidity: F[18] || (F[18] = (_, Ie) => fa("plugin:" + _, Ie)),
                      onWidgetValidity: ca
                    }, null, 8, ["board-id", "draft", "schema", "options", "filters", "configs", "disabled", "pack", "onUpgrade"])
                  ], 512)), [
                    [Ct, y.value === "Plugins"]
                  ]) : C("", !0)
                ], 8, up))
              ], 40, dp),
              k(Ul, {
                visible: be.value,
                label: "Review changes",
                busy: U.value,
                "return-focus": se.value,
                class: "work-review-sheet",
                onClose: O
              }, {
                default: q(() => [
                  s("div", mp, [
                    s("header", null, [
                      F[31] || (F[31] = s("h2", null, "Review changes", -1)),
                      s("p", pp, T(Oe.value?.title), 1)
                    ]),
                    s("div", {
                      class: "work-review-content work-stack",
                      "aria-busy": U.value
                    }, [
                      U.value ? (n(), f("p", bp, T(jt.value ? "Applying or checking changes…" : "Checking the impact on your board…"), 1)) : C("", !0),
                      nl.value ? (n(), f("p", hp, T(nl.value), 1)) : C("", !0),
                      Ce.value ? (n(), f("p", yp, "The board changed while you were editing. Close this review and discard the draft to load the latest settings.")) : C("", !0),
                      be.value && !ue.request && (va.value.removed.length || va.value.renamed.length) ? (n(), H(Bc, {
                        key: 3,
                        removed: va.value.removed,
                        renamed: va.value.renamed,
                        disabled: U.value || Y.value,
                        confirmed: Ra.value,
                        "onUpdate:confirmed": F[20] || (F[20] = (_) => Ra.value = _),
                        onDestination: ui
                      }, null, 8, ["removed", "renamed", "disabled", "confirmed"])) : C("", !0),
                      be.value && ue.request && ue.plugins.length ? (n(), H(xo, {
                        key: 4,
                        "board-id": e.boardId,
                        draft: { plugins: ue.plugins },
                        schema: xe.value ?? ne.value,
                        options: N.value?.schema_options.plugins.filter((_) => ue.plugins.some((Ie) => Ie.use === _.plugin)) ?? [],
                        configs: j.value,
                        disabled: U.value,
                        "activation-locked": "",
                        onValidity: F[21] || (F[21] = (_, Ie) => fa("pack-plugin:" + _, Ie))
                      }, null, 8, ["board-id", "draft", "schema", "options", "configs", "disabled"])) : C("", !0),
                      be.value ? (n(), H(Rm, {
                        key: 5,
                        "board-id": e.boardId,
                        original: ne.value.declaration,
                        declaration: oo.value,
                        plan: jt.value,
                        follows: ci.value,
                        "config-count": Object.keys(j.value).length,
                        "plugin-configs": Ve.value?.plugin_configs,
                        "pack-review": !!ue.preview,
                        plugins: N.value?.schema_options.plugins
                      }, {
                        default: q(() => [
                          ue.preview && ue.request ? (n(), H(Wm, {
                            key: 0,
                            plan: ue.preview,
                            request: ue.request,
                            original: ne.value.declaration,
                            plugins: N.value?.schema_options.plugins,
                            disabled: U.value,
                            onChange: ue.changed
                          }, null, 8, ["plan", "request", "original", "plugins", "disabled", "onChange"])) : C("", !0)
                        ]),
                        _: 1
                      }, 8, ["board-id", "original", "declaration", "plan", "follows", "config-count", "plugin-configs", "pack-review", "plugins"])) : C("", !0),
                      !U.value && !lo.value && !Ce.value && !nl.value ? (n(), f("p", kp, "Check the impact again before applying.")) : C("", !0)
                    ], 8, gp),
                    s("footer", wp, [
                      k(u(ae), {
                        label: "Keep editing",
                        severity: "secondary",
                        outlined: "",
                        disabled: U.value,
                        onClick: O
                      }, null, 8, ["disabled"]),
                      lo.value ? (n(), H(u(ae), {
                        key: 1,
                        label: "Apply changes",
                        disabled: !ao.value,
                        loading: U.value,
                        onClick: fi
                      }, null, 8, ["disabled", "loading"])) : (n(), H(u(ae), {
                        key: 0,
                        label: "Check impact",
                        disabled: U.value || Ce.value || !!de.value.size,
                        onClick: cl
                      }, null, 8, ["disabled"]))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["visible", "busy", "return-focus"]),
              Y.value ? (n(), f("p", $p, "Checking what uses this setting…")) : C("", !0)
            ])) : C("", !0)
          ], 8, Ym)
        ])
      ]),
      ve.value ? (n(), H(Ul, {
        key: 0,
        visible: ue.installing,
        label: "Install pack",
        busy: U.value,
        onClose: F[26] || (F[26] = (_) => ue.installing = !1)
      }, {
        default: q(() => [
          ue.installing ? (n(), f("form", {
            key: 0,
            class: "work-dialog-box work-stack",
            onSubmit: F[25] || (F[25] = Be(
              //@ts-ignore
              (..._) => ue.install && ue.install(..._),
              ["prevent"]
            ))
          }, [
            F[33] || (F[33] = s("h2", null, "Install a pack", -1)),
            F[34] || (F[34] = s("p", { class: "work-muted work-small" }, "Packs give an empty board a starting setup. Review checks whether this board is eligible.", -1)),
            ue.loading ? (n(), f("p", Vp, "Loading packs…")) : ue.error ? (n(), f("div", xp, [
              s("p", Cp, T(ue.error), 1),
              k(u(ae), {
                label: "Reload packs",
                severity: "secondary",
                outlined: "",
                onClick: F[22] || (F[22] = (_) => ue.load())
              })
            ])) : ue.choices.length ? (n(), f("label", Sp, [
              F[32] || (F[32] = W("Pack ", -1)),
              k(u(ge), {
                modelValue: ue.installPack,
                "onUpdate:modelValue": F[23] || (F[23] = (_) => ue.installPack = _),
                "aria-label": "Pack to install",
                appendTo: "self",
                optionLabel: "title",
                optionValue: "id",
                optionDisabled: "disabled",
                options: ue.choices,
                pt: { option: ({ context: _ }) => ({ "aria-label": [_.option.title, _.option.unavailable].filter(Boolean).join(". ") }) }
              }, {
                option: q(({ option: _ }) => [
                  s("span", null, [
                    W(T(_.title), 1),
                    _.unavailable ? (n(), f("small", Tp, T(_.unavailable), 1)) : C("", !0)
                  ])
                ]),
                _: 1
              }, 8, ["modelValue", "options", "pt"])
            ])) : (n(), f("p", Ip, "No available packs were found.")),
            s("footer", Dp, [
              k(u(ae), {
                label: "Cancel",
                severity: "secondary",
                outlined: "",
                onClick: F[24] || (F[24] = (_) => ue.installing = !1)
              }),
              k(u(ae), {
                type: "submit",
                label: "Review pack",
                disabled: !ue.installChoice || !ue.canManage || ue.loading || !!ue.error
              }, null, 8, ["disabled"])
            ])
          ], 32)) : C("", !0)
        ]),
        _: 1
      }, 8, ["visible", "busy"])) : C("", !0)
    ], 2));
  }
}), Ep = /* @__PURE__ */ Te({
  __name: "SettingsRoot",
  setup(e) {
    const a = xi(), t = Ci();
    return Oo(jo, (l) => {
      a.value.embedded && l.name === "boards" ? t("back-to-boards", {}) : t("navigate", { route: en(l) });
    }), (l, o) => (n(), H(Up, {
      "board-id": u(a).boardId ?? "",
      embedded: u(a).embedded,
      "focus-back": u(a).focusBack,
      route: u(a).route,
      onNavigate: o[0] || (o[0] = (r) => u(t)("navigate", { route: r })),
      onDirtyChange: o[1] || (o[1] = (r) => u(t)("dirty-change", { dirty: r }))
    }, null, 8, ["board-id", "embedded", "focus-back", "route"]));
  }
}), Ap = Si(Ep, {
  type: "object",
  properties: {
    "board-id": { type: "string", default: "", description: "Board to administer." },
    "focus-back": { type: "boolean", default: !1, description: "Focus the first rail action when opening settings from the board picker." },
    route: { type: "string", description: "Section and selected row in System." },
    embedded: { type: "boolean", default: !1, description: "Fits in a System detail pane." }
  }
});
Gi(import.meta.url, Ap);
//# sourceMappingURL=settings.js.map
